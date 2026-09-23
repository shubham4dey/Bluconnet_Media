/**
 * ============================================================
 *  News verification CLI — reads the REAL MySQL rows back out:
 *
 *      npm run news:verify          # every article, newest first
 *      npm run news:verify -- 25    # only the 25 newest
 *
 *  This is the scripted equivalent of:
 *      SELECT * FROM news ORDER BY date DESC;
 *
 *  It also reports whether the local mirror (backend/data/news.json,
 *  what the public API serves) is in step with the database and whether
 *  permanent image storage (Cloudinary) is configured.
 * ============================================================
 */
require("dotenv").config();
const mysql = require("../config/mysql");
const cloudinary = require("../services/cloudinary");
const newsModel = require("../models/newsModel");

const isCloudinaryUrl = (url) => /^https?:\/\/res\.cloudinary\.com\//i.test(String(url || ""));

(async () => {
  const limit = Math.min(Math.max(parseInt(process.argv[2], 10) || 200, 1), 2000);

  console.log(`[verify] target : ${mysql.describeTarget()}`);
  console.log(`[verify] table  : ${newsModel.TABLE}`);
  console.log(`[verify] images : ${cloudinary.describe()}`);

  await newsModel.ensureSchema();

  const rows = (await newsModel.listFromDb()).sort((a, b) =>
    String(b.date || b.createdAt).localeCompare(String(a.date || a.createdAt))
  );
  console.log(`[verify] rows   : ${rows.length}\n`);

  if (!rows.length) {
    console.log("(no news articles stored in MySQL yet)");
  }

  rows.slice(0, limit).forEach((r) => {
    const image = r.imageUrl
      ? `${isCloudinaryUrl(r.imageUrl) ? "cloudinary" : "NON-CLOUDINARY"} ${r.imageUrl}`
      : "(no image)";
    console.log(
      `id=${r.id} status=${r.status} date=${r.date} created=${r.createdAt}\n` +
        `   ${r.title}\n` +
        `   image: ${image}\n` +
        `   publicId: ${r.imagePublicId || "(none)"}\n`
    );
  });

  const mirror = newsModel.list();
  const mirrorIds = new Set(mirror.map((r) => r.id));
  const missingInMirror = rows.filter((r) => !mirrorIds.has(r.id)).map((r) => r.id);
  console.log(
    `[verify] local mirror: ${mirror.length} article(s)` +
      (missingInMirror.length ? ` — NOT yet mirrored: ${missingInMirror.join(", ")}` : " (in step)")
  );

  const localOnly = mirror.filter((r) => !rows.some((x) => x.id === r.id)).map((r) => r.id);
  if (localOnly.length) {
    console.log(
      `[verify] mirror-only article(s) (re-upload/re-save from the Admin panel to store them): ${localOnly.join(", ")}`
    );
  }

  const withoutImage = rows.filter((r) => !r.imageUrl).length;
  if (withoutImage) {
    console.log(
      `[verify] ${withoutImage} article(s) have no image — open News Admin, re-upload the image and save.`
    );
  }

  await mysql.close();
  process.exit(0);
})().catch(async (err) => {
  console.error("[verify] FAILED:", mysql.safeError(err));
  console.error(
    "[verify] the news table lives in the same MySQL database as `contacts` — check " +
      "MYSQL_* / NAMECHEAP_SSH_* in backend/.env and run `npm run migrate` once"
  );
  try {
    await mysql.close();
  } catch (e) {
    /* ignore */
  }
  process.exit(1);
});
