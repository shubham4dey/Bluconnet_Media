/**
 * ============================================================
 *  Contact model — MySQL data access for the `contacts` table.
 *
 *  This is the ONLY place that talks to MySQL for contact-form
 *  submissions. Every value goes through a PREPARED statement
 *  (`?` placeholders) — no SQL string concatenation anywhere.
 *
 *  Allowed `source` values: hero | home-contact | contact-page
 *    Hero.jsx        → "hero"
 *    ContactForm.jsx → "home-contact"
 *    contact.jsx     → "contact-page"
 * ============================================================
 */
const mysql = require("../config/mysql");
const { migrationFiles, readMigration, splitStatements } = require("../database/sql");

const TABLE = "contacts";

const ALLOWED_SOURCES = ["hero", "home-contact", "contact-page"];

/* Columns sortable by the (future) Admin Panel — whitelist, never user text. */
const SORTABLE = {
  id: "`id`",
  createdAt: "`createdAt`",
  updatedAt: "`updatedAt`",
  email: "`email`",
  companyName: "`companyName`",
  country: "`country`",
  source: "`source`",
  helpWith: "`helpWith`",
  hearAbout: "`hearAbout`",
  status: "`status`",
};

/**
 * Create the schema (database + contacts table) when missing.
 * Idempotent: runs the same SQL migration files used by `npm run migrate`.
 * Safe to call on every boot.
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
 * Insert ONE new enquiry. Always a new row — email is not unique by design.
 * `createdAt` / `updatedAt` / `status` are filled in by MySQL.
 * @returns {Promise<{id: string}>} the database-generated id
 */
async function insertContact(data) {
  const sql = `INSERT INTO \`${TABLE}\`
      (\`firstName\`, \`lastName\`, \`email\`, \`companyName\`, \`helpWith\`,
       \`country\`, \`message\`, \`hearAbout\`, \`agreeToContact\`, \`source\`)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    data.firstName,
    data.lastName,
    data.email,
    data.companyName,
    data.helpWith,
    data.country,
    data.message,
    data.hearAbout,
    data.agreeToContact ? 1 : 0,
    data.source,
  ];

  const [result] = await mysql.execute(sql, params);
  return { id: String(result.insertId) };
}

/* ---------------- reads (used by scripts / the future Admin Panel) ---------------- */

async function getContactById(id) {
  const [rows] = await mysql.execute(`SELECT * FROM \`${TABLE}\` WHERE \`id\` = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

/** Escape LIKE wildcards so a search term is matched literally. */
function likeTerm(value) {
  return `%${String(value).replace(/[\\%_]/g, "\\$&")}%`;
}

function buildWhere(filters = {}) {
  const where = [];
  const params = [];

  if (filters.source) {
    where.push("`source` = ?");
    params.push(String(filters.source));
  }
  if (filters.country) {
    where.push("`country` = ?");
    params.push(String(filters.country));
  }
  if (filters.helpWith) {
    where.push("`helpWith` = ?");
    params.push(String(filters.helpWith));
  }
  if (filters.hearAbout) {
    where.push("`hearAbout` = ?");
    params.push(String(filters.hearAbout));
  }
  if (filters.status) {
    where.push("`status` = ?");
    params.push(String(filters.status));
  }
  if (filters.email) {
    where.push("`email` LIKE ?");
    params.push(likeTerm(filters.email));
  }
  if (filters.companyName) {
    where.push("`companyName` LIKE ?");
    params.push(likeTerm(filters.companyName));
  }
  if (filters.q) {
    where.push(
      "(`firstName` LIKE ? OR `lastName` LIKE ? OR `email` LIKE ? OR `companyName` LIKE ? OR CONCAT(`firstName`, ' ', `lastName`) LIKE ?)"
    );
    const term = likeTerm(filters.q);
    params.push(term, term, term, term, term);
  }
  if (filters.from) {
    where.push("`createdAt` >= ?");
    params.push(filters.from);
  }
  if (filters.to) {
    where.push("`createdAt` <= ?");
    params.push(filters.to);
  }

  return { clause: where.length ? `WHERE ${where.join(" AND ")}` : "", params };
}

/**
 * List enquiries — filtering by source/country/helpWith/hearAbout/status,
 * free-text search (name, email, company) and sorting by createdAt.
 * Prepared statement, paginated, newest first by default.
 */
async function listContacts(filters = {}) {
  const { clause, params } = buildWhere(filters);

  const sortColumn = SORTABLE[filters.sort] || SORTABLE.createdAt;
  const direction = String(filters.order || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";
  const limit = Math.min(Math.max(parseInt(filters.limit, 10) || 50, 1), 500);
  const offset = Math.max(parseInt(filters.offset, 10) || 0, 0);

  const sql = `SELECT * FROM \`${TABLE}\` ${clause}
               ORDER BY ${sortColumn} ${direction}, \`id\` ${direction}
               LIMIT ? OFFSET ?`;

  const [rows] = await mysql.execute(sql, [...params, limit, offset]);
  return rows;
}

/** Total number of enquiries matching the same filters (for pagination). */
async function countContacts(filters = {}) {
  const { clause, params } = buildWhere(filters);
  const [rows] = await mysql.execute(`SELECT COUNT(*) AS total FROM \`${TABLE}\` ${clause}`, params);
  return Number(rows[0] ? rows[0].total : 0);
}

module.exports = {
  TABLE,
  ALLOWED_SOURCES,
  SORTABLE,
  ensureSchema,
  insertContact,
  getContactById,
  listContacts,
  countContacts,
};