/**
 * ============================================================
 *  MySQL connection — ONE pooled connection for the whole app.
 *
 *  Used by the contact-form API (POST /api/contact), whose
 *  submissions are stored in the MySQL `contacts` table.
 *
 *  Credentials come from environment variables only (never
 *  hard-coded, never logged):
 *    MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD,
 *    MYSQL_DATABASE, MYSQL_CONNECTION_LIMIT, MYSQL_SSL
 *  …or a single connection string:
 *    MYSQL_URL / DATABASE_URL
 *
 *  NOTE: this is additive. The existing JSON store
 *  (`config/database.js`) keeps serving leads / meetings /
 *  applications / news untouched — no architecture was replaced.
 * ============================================================
 */
require("dotenv").config();
const mysql = require("mysql2/promise");

const DEFAULTS = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "bluconnet_media",
};

/* Single connection string (Render / Railway / PlanetScale style) wins. */
const CONNECTION_URI = (process.env.MYSQL_URL || process.env.DATABASE_URL || "").trim();

const DATABASE = (process.env.MYSQL_DATABASE || DEFAULTS.database).trim();

const poolOptions = {
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10) || 10,
  queueLimit: 0,
  charset: "utf8mb4_unicode_ci",
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  // BIGINT columns (id, counts) stay exact instead of silently losing precision.
  supportBigNumbers: true,
  bigNumberStrings: false,
};

/* Managed MySQL (PlanetScale / Aiven / RDS / …) is TLS-only. Explicit opt-in:
   MYSQL_SSL=true  [MYSQL_SSL_REJECT_UNAUTHORIZED=false for self-signed certs] */
if (String(process.env.MYSQL_SSL || "").toLowerCase() === "true") {
  poolOptions.ssl = {
    rejectUnauthorized:
      String(process.env.MYSQL_SSL_REJECT_UNAUTHORIZED || "true").toLowerCase() !== "false",
  };
}

const pool = CONNECTION_URI
  ? mysql.createPool({ uri: CONNECTION_URI, ...poolOptions })
  : mysql.createPool({
      host: process.env.MYSQL_HOST || DEFAULTS.host,
      port: Number(process.env.MYSQL_PORT || DEFAULTS.port) || DEFAULTS.port,
      user: process.env.MYSQL_USER || DEFAULTS.user,
      password: process.env.MYSQL_PASSWORD || DEFAULTS.password,
      database: DATABASE,
      ...poolOptions,
    });

function getPool() {
  return pool;
}

/** Run a (non-prepared) statement on the pool. Only for trusted, static SQL. */
function query(sql, params = []) {
  return pool.query(sql, params);
}

/** Run a PREPARED statement — every user-supplied value goes through here. */
function execute(sql, params = []) {
  return pool.execute(sql, params);
}

function getConnection() {
  return pool.getConnection();
}

/** Cheap connectivity probe. Throws when the database is unreachable. */
async function ping() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}

/**
 * Create the target schema if it does not exist yet.
 * Idempotent + safe: CREATE DATABASE IF NOT EXISTS is a no-op when it exists.
 * Only used at bootstrap/migration time, never on the request path.
 */
async function ensureDatabase() {
  const database = CONNECTION_URI
    ? new URL(CONNECTION_URI).pathname.replace(/^\//, "") || DATABASE
    : DATABASE;

  // Connect WITHOUT selecting a schema so we can create it when missing.
  const connection = await (CONNECTION_URI
    ? mysql.createConnection({ uri: CONNECTION_URI.replace(/\/[^/?]*(\?|$)/, "/"), ...poolOptions })
    : mysql.createConnection({
        host: process.env.MYSQL_HOST || DEFAULTS.host,
        port: Number(process.env.MYSQL_PORT || DEFAULTS.port) || DEFAULTS.port,
        user: process.env.MYSQL_USER || DEFAULTS.user,
        password: process.env.MYSQL_PASSWORD || DEFAULTS.password,
        ...poolOptions,
      }));

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database.replace(/`/g, "")}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    return database;
  } finally {
    await connection.end();
  }
}

/** Target description for logs — never contains the password. */
function describeTarget() {
  if (CONNECTION_URI) {
    try {
      const u = new URL(CONNECTION_URI);
      return `${u.username ? u.username + "@" : ""}${u.hostname}:${u.port || 3306}/${u.pathname.replace(/^\//, "")}`;
    } catch (e) {
      return "MYSQL_URL (unparseable)";
    }
  }
  return `${process.env.MYSQL_USER || DEFAULTS.user}@${process.env.MYSQL_HOST || DEFAULTS.host}:${
    process.env.MYSQL_PORT || DEFAULTS.port
  }/${DATABASE}`;
}

/**
 * Error text that is safe for LOGS (never returned to a client).
 * Keeps the driver's error code/message so operators can debug, and
 * deliberately drops anything that could carry credentials.
 */
function safeError(err) {
  if (!err) return "unknown error";
  const code = err.code || err.sqlState || "";
  const message = String(err.message || "").replace(/password[^,;]*/gi, "password=***");
  return `${code ? code + " " : ""}${message}`.trim();
}

function isConnectionError(err) {
  return !err || !err.code
    ? false
    : [
        "ECONNREFUSED",
        "ENOTFOUND",
        "ETIMEDOUT",
        "EHOSTUNREACH",
        "ER_ACCESS_DENIED_ERROR",
        "ER_BAD_DB_ERROR",
        "PROTOCOL_CONNECTION_LOST",
        "ER_CON_COUNT_ERROR",
        "ER_NOT_SUPPORTED_AUTH_MODE",
      ].includes(err.code);
}

async function close() {
  await pool.end();
}

module.exports = {
  pool,
  getPool,
  query,
  execute,
  getConnection,
  ping,
  ensureDatabase,
  describeTarget,
  safeError,
  isConnectionError,
  close,
  DATABASE,
};