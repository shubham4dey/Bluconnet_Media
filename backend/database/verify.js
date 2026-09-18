/**
 * ============================================================
 *  Contact verification CLI — reads the REAL MySQL rows back out:
 *
 *      npm run contacts:verify          # 10 newest rows
 *      npm run contacts:verify -- 25    # 25 newest rows
 *
 *  This is the scripted equivalent of:
 *      SELECT * FROM contacts ORDER BY createdAt DESC;
 * ============================================================
 */
require("dotenv").config();
const mysql = require("../config/mysql");
const contacts = require("../models/contactModel");

(async () => {
  const limit = Math.min(Math.max(parseInt(process.argv[2], 10) || 10, 1), 200);

  console.log(`[verify] target : ${mysql.describeTarget()}`);
  console.log(`[verify] table  : ${contacts.TABLE}`);

  const [info] = await mysql.query(
    `SELECT TABLE_ROWS AS approxRows, CREATE_TIME AS createdAt
       FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [mysql.DATABASE, contacts.TABLE]
  );
  if (!info.length) {
    throw new Error(`table \`${contacts.TABLE}\` does not exist yet — run \`npm run migrate\``);
  }

  const total = await contacts.countContacts();
  console.log(`[verify] rows   : ${total}\n`);

  const rows = await contacts.listContacts({ limit, sort: "createdAt", order: "desc" });
  if (!rows.length) {
    console.log("(no contact submissions stored yet)");
  } else {
    rows.forEach((r) => {
      console.log(
        `id=${r.id} source=${r.source} status=${r.status} createdAt=${r.createdAt} agree=${r.agreeToContact}`
      );
      console.log(
        `   ${r.firstName} ${r.lastName} <${r.email}> — ${r.companyName} — ${r.country} — ${r.helpWith} — ${r.hearAbout}`
      );
      console.log(`   message: ${String(r.message).replace(/\s+/g, " ").slice(0, 160)}`);
      console.log("");
    });
    console.log("[verify] newest row as stored in MySQL:");
    console.log(JSON.stringify(rows[0], null, 2));
  }

  await mysql.close();
  process.exit(0);
})().catch(async (err) => {
  console.error("[verify] FAILED:", mysql.safeError(err));
  try {
    await mysql.close();
  } catch (e) {
    /* ignore */
  }
  process.exit(1);
});