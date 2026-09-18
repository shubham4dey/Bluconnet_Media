/**
 * ============================================================
 *  MySQL migration runner
 *
 *      npm run migrate
 *
 *  Creates the configured database when it does not exist yet and
 *  applies every file in `database/migrations` (001_, 002_, …) in
 *  order. All migrations are idempotent, so this is safe to run on
 *  every deploy. The same migrations run automatically when the
 *  server boots.
 * ============================================================
 */
require("dotenv").config();
const mysql = require("../config/mysql");
const { migrationFiles, runMigrations } = require("./sql");

(async () => {
  const files = migrationFiles();
  console.log(`[migrate] target : ${mysql.describeTarget()}`);
  console.log(`[migrate] files  : ${files.length ? files.join(", ") : "(none)"}`);

  if (!files.length) {
    console.log("[migrate] nothing to do.");
    process.exit(0);
  }

  await mysql.ensureDatabase();

  const connection = await mysql.getConnection();
  try {
    const applied = await runMigrations(connection);
    applied.forEach(({ file, statements }) =>
      console.log(`[migrate] applied ${file} (${statements} statement${statements === 1 ? "" : "s"})`)
    );
  } finally {
    connection.release();
  }

  await mysql.close();
  console.log("[migrate] done ✅");
  process.exit(0);
})().catch(async (err) => {
  console.error("[migrate] FAILED:", mysql.safeError(err));
  console.error("[migrate] check MYSQL_HOST / MYSQL_PORT / MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE in backend/.env");
  try {
    await mysql.close();
  } catch (e) {
    /* ignore */
  }
  process.exit(1);
});