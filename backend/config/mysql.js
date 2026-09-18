/**
 * ============================================================
 * MySQL connection + optional Namecheap SSH tunnel.
 *
 * Render backend -> SSH tunnel -> Namecheap MySQL
 *
 * Namecheap:
 *   SSH host: 66.29.132.129
 *   SSH port: 21098
 *   Remote MySQL: 127.0.0.1:3306
 *
 * Render/local MySQL client endpoint:
 *   127.0.0.1:5522
 * ============================================================
 */

require("dotenv").config();

const mysql = require("mysql2/promise");
const net = require("net");
const { Client } = require("ssh2");

// ------------------------------------------------------------
// Defaults
// ------------------------------------------------------------

const DEFAULTS = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "bluconnet_media",
};

// ------------------------------------------------------------
// Environment
// ------------------------------------------------------------

const CONNECTION_URI = (
  process.env.MYSQL_URL ||
  process.env.DATABASE_URL ||
  ""
).trim();

const DATABASE = (
  process.env.MYSQL_DATABASE ||
  DEFAULTS.database
).trim();

const SSH_ENABLED =
  Boolean(process.env.NAMECHEAP_SSH_HOST) &&
  Boolean(process.env.NAMECHEAP_SSH_USER) &&
  Boolean(process.env.NAMECHEAP_SSH_KEY_B64);

const SSH_HOST = process.env.NAMECHEAP_SSH_HOST || "";
const SSH_PORT = Number(process.env.NAMECHEAP_SSH_PORT || 21098) || 21098;
const SSH_USER = process.env.NAMECHEAP_SSH_USER || "";
const SSH_PASSPHRASE = process.env.NAMECHEAP_SSH_PASSPHRASE || "";

const TUNNEL_LOCAL_HOST = "127.0.0.1";
const TUNNEL_LOCAL_PORT =
  Number(process.env.MYSQL_TUNNEL_LOCAL_PORT || 5522) || 5522;

const TUNNEL_REMOTE_HOST = "127.0.0.1";
const TUNNEL_REMOTE_PORT = 3306;

// ------------------------------------------------------------
// Namecheap SSH tunnel
// ------------------------------------------------------------

const tunnelState = {
  ssh: null,
  ready: false,
  connecting: false,
  server: null,
  reconnectTimer: null,
  queue: [],
};

function getPrivateKey() {
  try {
    return Buffer.from(process.env.NAMECHEAP_SSH_KEY_B64, "base64");
  } catch (err) {
    throw new Error("Invalid NAMECHEAP_SSH_KEY_B64");
  }
}

function flushTunnelQueue() {
  if (!tunnelState.ready) return;

  const queued = tunnelState.queue.splice(0);

  for (const socket of queued) {
    if (!socket.destroyed) {
      openForward(socket);
    }
  }
}

function openForward(socket) {
  if (socket.destroyed) return;

  if (!tunnelState.ready || !tunnelState.ssh) {
    socket.pause();

    tunnelState.queue.push(socket);

    socket.once("close", () => {
      const index = tunnelState.queue.indexOf(socket);

      if (index !== -1) {
        tunnelState.queue.splice(index, 1);
      }
    });

    return;
  }

  const ssh = tunnelState.ssh;

  ssh.forwardOut(
    "127.0.0.1",
    0,
    TUNNEL_REMOTE_HOST,
    TUNNEL_REMOTE_PORT,
    (err, stream) => {
      if (err) {
        console.error("[mysql/ssh] forward error:", err.message);
        socket.destroy();
        return;
      }

      socket.pipe(stream);
      stream.pipe(socket);

      stream.on("error", (streamErr) => {
        console.error(
          "[mysql/ssh] stream error:",
          streamErr.message
        );

        socket.destroy();
      });

      socket.on("error", () => {
        stream.destroy();
      });

      socket.on("close", () => {
        stream.destroy();
      });

      socket.resume();
    }
  );
}

function scheduleSSHReconnect() {
  if (tunnelState.reconnectTimer) return;

  tunnelState.reconnectTimer = setTimeout(() => {
    tunnelState.reconnectTimer = null;
    connectSSH();
  }, 5000);
}

function connectSSH() {
  if (!SSH_ENABLED) return;

  if (tunnelState.connecting || tunnelState.ready) {
    return;
  }

  tunnelState.connecting = true;

  const ssh = new Client();

  tunnelState.ssh = ssh;

  ssh.on("ready", () => {
    tunnelState.connecting = false;
    tunnelState.ready = true;

    console.log(
      `[mysql/ssh] SSH tunnel connected to ${SSH_USER}@${SSH_HOST}:${SSH_PORT}`
    );

    console.log(
      `[mysql/ssh] MySQL forwarding: ${TUNNEL_LOCAL_HOST}:${TUNNEL_LOCAL_PORT} -> ${TUNNEL_REMOTE_HOST}:${TUNNEL_REMOTE_PORT}`
    );

    flushTunnelQueue();
  });

  ssh.on("error", (err) => {
    tunnelState.connecting = false;
    tunnelState.ready = false;

    console.error(
      "[mysql/ssh] SSH error:",
      err.message
    );
  });

  ssh.on("close", () => {
    tunnelState.connecting = false;
    tunnelState.ready = false;

    if (tunnelState.ssh === ssh) {
      tunnelState.ssh = null;
    }

    console.error(
      "[mysql/ssh] SSH connection closed. Reconnecting in 5 seconds..."
    );

    scheduleSSHReconnect();
  });

  try {
    ssh.connect({
      host: SSH_HOST,
      port: SSH_PORT,
      username: SSH_USER,
      privateKey: getPrivateKey(),
      passphrase: SSH_PASSPHRASE || undefined,
      readyTimeout: 20000,
      keepaliveInterval: 10000,
      keepaliveCountMax: 3,
    });
  } catch (err) {
    tunnelState.connecting = false;

    console.error(
      "[mysql/ssh] SSH connect failed:",
      err.message
    );

    scheduleSSHReconnect();
  }
}

function startNamecheapTunnel() {
  if (!SSH_ENABLED) {
    console.log(
      "[mysql/ssh] SSH tunnel disabled. Using direct MySQL connection."
    );

    return;
  }

  tunnelState.server = net.createServer((socket) => {
    openForward(socket);
  });

  tunnelState.server.on("error", (err) => {
    console.error(
      "[mysql/ssh] Local tunnel server error:",
      err.message
    );
  });

  tunnelState.server.listen(
    TUNNEL_LOCAL_PORT,
    TUNNEL_LOCAL_HOST,
    () => {
      console.log(
        `[mysql/ssh] Local tunnel listening on ${TUNNEL_LOCAL_HOST}:${TUNNEL_LOCAL_PORT}`
      );

      connectSSH();
    }
  );
}

if (SSH_ENABLED) {
  startNamecheapTunnel();
}

// ------------------------------------------------------------
// MySQL pool options
// ------------------------------------------------------------

const poolOptions = {
  waitForConnections: true,

  connectionLimit:
    Number(process.env.MYSQL_CONNECTION_LIMIT || 10) || 10,

  queueLimit: 0,

  charset: "utf8mb4_unicode_ci",

  enableKeepAlive: true,

  keepAliveInitialDelay: 10000,

  supportBigNumbers: true,

  bigNumberStrings: false,
};

// ------------------------------------------------------------
// Optional SSL
// ------------------------------------------------------------

if (
  String(process.env.MYSQL_SSL || "").toLowerCase() === "true"
) {
  poolOptions.ssl = {
    rejectUnauthorized:
      String(
        process.env.MYSQL_SSL_REJECT_UNAUTHORIZED || "true"
      ).toLowerCase() !== "false",
  };
}

// ------------------------------------------------------------
// MySQL pool
// ------------------------------------------------------------

const pool = CONNECTION_URI
  ? mysql.createPool({
      uri: CONNECTION_URI,
      ...poolOptions,
    })
  : mysql.createPool({
      host: SSH_ENABLED
        ? TUNNEL_LOCAL_HOST
        : process.env.MYSQL_HOST || DEFAULTS.host,

      port: SSH_ENABLED
        ? TUNNEL_LOCAL_PORT
        : Number(
            process.env.MYSQL_PORT || DEFAULTS.port
          ) || DEFAULTS.port,

      user:
        process.env.MYSQL_USER ||
        DEFAULTS.user,

      password:
        process.env.MYSQL_PASSWORD ||
        DEFAULTS.password,

      database: DATABASE,

      ...poolOptions,
    });

// ------------------------------------------------------------
// Public helpers
// ------------------------------------------------------------

function getPool() {
  return pool;
}

function query(sql, params = []) {
  return pool.query(sql, params);
}

function execute(sql, params = []) {
  return pool.execute(sql, params);
}

function getConnection() {
  return pool.getConnection();
}

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
 * Database already exists on Namecheap.
 *
 * By default, DO NOT run CREATE DATABASE because the cPanel
 * database user normally does not have CREATE DATABASE privilege.
 *
 * To explicitly allow creation elsewhere:
 * MYSQL_CREATE_DATABASE=true
 */
async function ensureDatabase() {
  const database = CONNECTION_URI
    ? new URL(CONNECTION_URI).pathname.replace(/^\//, "") ||
      DATABASE
    : DATABASE;

  const shouldCreate =
    String(
      process.env.MYSQL_CREATE_DATABASE || "false"
    ).toLowerCase() === "true";

  if (!shouldCreate) {
    return database;
  }

  const connection = await (CONNECTION_URI
    ? mysql.createConnection({
        uri: CONNECTION_URI.replace(
          /\/[^/?]*(\?|$)/,
          "/"
        ),
        ...poolOptions,
      })
    : mysql.createConnection({
        host: SSH_ENABLED
          ? TUNNEL_LOCAL_HOST
          : process.env.MYSQL_HOST || DEFAULTS.host,

        port: SSH_ENABLED
          ? TUNNEL_LOCAL_PORT
          : Number(
              process.env.MYSQL_PORT || DEFAULTS.port
            ) || DEFAULTS.port,

        user:
          process.env.MYSQL_USER ||
          DEFAULTS.user,

        password:
          process.env.MYSQL_PASSWORD ||
          DEFAULTS.password,

        ...poolOptions,
      }));

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database.replace(
        /`/g,
        ""
      )}\`
       CHARACTER SET utf8mb4
       COLLATE utf8mb4_unicode_ci`
    );

    return database;
  } finally {
    await connection.end();
  }
}

function describeTarget() {
  if (CONNECTION_URI) {
    try {
      const u = new URL(CONNECTION_URI);

      return `${
        u.username ? u.username + "@" : ""
      }${u.hostname}:${u.port || 3306}/${u.pathname.replace(
        /^\//,
        ""
      )}`;
    } catch (e) {
      return "MYSQL_URL (unparseable)";
    }
  }

  return `${
    process.env.MYSQL_USER || DEFAULTS.user
  }@${
    SSH_ENABLED
      ? TUNNEL_LOCAL_HOST
      : process.env.MYSQL_HOST || DEFAULTS.host
  }:${
    SSH_ENABLED
      ? TUNNEL_LOCAL_PORT
      : process.env.MYSQL_PORT || DEFAULTS.port
  }/${DATABASE}`;
}

function safeError(err) {
  if (!err) return "unknown error";

  const code = err.code || err.sqlState || "";

  const message = String(
    err.message || ""
  ).replace(/password[^,;]*/gi, "password=***");

  return `${code ? code + " " : ""}${message}`.trim();
}

function isConnectionError(err) {
  if (!err || !err.code) {
    return false;
  }

  return [
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
  if (tunnelState.server) {
    await new Promise((resolve) => {
      tunnelState.server.close(() => resolve());
    }).catch(() => {});
  }

  if (tunnelState.reconnectTimer) {
    clearTimeout(tunnelState.reconnectTimer);
    tunnelState.reconnectTimer = null;
  }

  if (tunnelState.ssh) {
    tunnelState.ssh.end();
    tunnelState.ssh = null;
  }

  tunnelState.ready = false;
  tunnelState.connecting = false;

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