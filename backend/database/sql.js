/**
 * ============================================================
 *  SQL migration helpers.
 *
 *  Migrations are plain .sql files under `database/migrations`,
 *  applied in filename order (001_, 002_, …). Every migration is
 *  written idempotently (IF NOT EXISTS) so the runner can be
 *  executed any number of times — including automatically on
 *  server boot.
 * ============================================================
 */
const fs = require("fs");
const path = require("path");

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

/** Migration files in apply order. */
function migrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".sql"))
    .sort();
}

function readMigration(file) {
  return fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
}

/**
 * Split a .sql file into individual statements.
 * `--` comment lines are dropped; statements are separated by `;`.
 * (Kept intentionally simple: our migrations contain no `;` inside literals.)
 */
function splitStatements(sql) {
  return String(sql)
    .split(/\r?\n/)
    .map((line) => (/^\s*--/.test(line) ? "" : line))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Apply every migration file using an existing connection.
 * Returns [{ file, statements }] for logging.
 */
async function runMigrations(connection) {
  const applied = [];
  for (const file of migrationFiles()) {
    const statements = splitStatements(readMigration(file));
    for (const statement of statements) {
      await connection.query(statement);
    }
    applied.push({ file, statements: statements.length });
  }
  return applied;
}

module.exports = {
  MIGRATIONS_DIR,
  migrationFiles,
  readMigration,
  splitStatements,
  runMigrations,
};