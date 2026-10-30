/**
 * ============================================================
 *  Subscriber model — MySQL data access for the `subscribers`
 *  table (newsletter / blog subscription form).
 *
 *      POST /api/subscribe   (controllers/subscriberController.js)
 *
 *  Every value goes through a PREPARED statement (`?`
 *  placeholders) — no SQL string concatenation anywhere.
 *
 *  Uses the SAME pooled MySQL connection as the contact API
 *  (config/mysql.js) — no second connection is created.
 * ============================================================
 */
const mysql = require("../config/mysql");
const { migrationFiles, readMigration, splitStatements } = require("../database/sql");

const TABLE = "subscribers";

/* MySQL duplicate-key errors: the unique index on `email` fired. */
function isDuplicateError(err) {
  if (!err) return false;
  return err.code === "ER_DUP_ENTRY" || err.errno === 1062;
}

/* The schema was never created — MySQL was unreachable while the server
   booted (server.js logs that case and asks for `npm run migrate`).
   Reported as a missing table/database, never as a connection failure. */
function isMissingSchemaError(err) {
  if (!err) return false;
  return (
    err.code === "ER_NO_SUCH_TABLE" ||
    err.errno === 1146 ||
    err.code === "ER_BAD_DB_ERROR" ||
    err.errno === 1049
  );
}

/**
 * Create the schema (database + tables) when missing.
 * Idempotent: runs the same SQL migration files used by `npm run migrate`,
 * so it is safe to call on every boot.
 */
async function ensureSchema() {
  await mysql.ensureDatabase();

  const connection = await mysql.getConnection();
  try {
    for (const file of migrationFiles()) {
      for (const statement of splitStatements(readMigration(file))) {
        await connection.query(statement);
      }
    }
  } finally {
    connection.release();
  }
}

/* ---------------- writes ---------------- */

/**
 * Insert ONE subscriber. `createdAt` / `updatedAt` / `status` are
 * filled in by MySQL. Throws ER_DUP_ENTRY when the email already
 * exists (UNIQUE index) — the controller turns that into HTTP 409.
 * @returns {Promise<{id: string}>} the database-generated id
 */
async function insertSubscriber({ email, agreeToSubscribe }) {
  const sql = `INSERT INTO \`${TABLE}\` (\`email\`, \`agreeToSubscribe\`)
               VALUES (?, ?)`;
  const params = [email, agreeToSubscribe ? 1 : 0];

  try {
    const [result] = await mysql.execute(sql, params);
    return { id: String(result.insertId) };
  } catch (err) {
    if (!isMissingSchemaError(err)) throw err;

    /* One self-heal: apply the idempotent migrations (CREATE TABLE IF NOT
       EXISTS ...) and retry the insert, so a subscription taken right after
       a failed boot still reaches MySQL instead of failing until the next
       deploy. A database that stays unreachable simply throws again and the
       controller answers its clean 500. */
    console.warn(
      `[subscribe] \`${TABLE}\` schema missing — applying migrations and retrying`
    );
    await ensureSchema();

    const [result] = await mysql.execute(sql, params);
    return { id: String(result.insertId) };
  }
}

/* ---------------- reads (used by the future Admin Panel) ---------------- */

async function findByEmail(email) {
  const [rows] = await mysql.execute(
    `SELECT * FROM \`${TABLE}\` WHERE \`email\` = ? LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

async function countSubscribers(filters = {}) {
  const where = [];
  const params = [];

  if (filters.status) {
    where.push("`status` = ?");
    params.push(String(filters.status));
  }

  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows] = await mysql.execute(`SELECT COUNT(*) AS total FROM \`${TABLE}\` ${clause}`, params);
  return Number(rows[0] ? rows[0].total : 0);
}

module.exports = {
  TABLE,
  ensureSchema,
  insertSubscriber,
  findByEmail,
  countSubscribers,
  isDuplicateError,
  isMissingSchemaError,
};