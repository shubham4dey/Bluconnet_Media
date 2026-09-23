/**
 * ============================================================
 *  News image migration CLI — moves legacy News images to Cloudinary.
 *
 *      npm run news:images:migrate              # local /uploads + inline base64
 *      npm run news:images:migrate -- --remote  # also re-host external URLs
 *      npm run news:images:migrate -- --dry-run # report only, no DB writes
 *
 *  Safe to run repeatedly (permanent Cloudinary assets are skipped) and on
 *  every deploy — the server also runs the non-remote part on boot.
 * ============================================================
 */
require("dotenv").config();
const cloudinary = require("../services/cloudinary");
const newsImage = require("../services/newsImage");

const args = process.argv.slice(2);
const allowRemote = args.includes("--remote");
const dryRun = args.includes("--dry-run");

(async () => {
  console.log(`[news:images] storage : ${cloudinary.describe()}`);
  if (!cloudinary.isConfigured()) {
    console.log(
      "[news:images] no Cloudinary credentials — set CLOUDINARY_CLOUD_NAME / " +
        "CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET (or CLOUDINARY_URL) first."
    );
    process.exit(0);
  }

  console.log(
    `[news:images] mode    : ${
      allowRemote ? "local /uploads + inline base64 + external URLs" : "local /uploads + inline base64"
    }${dryRun ? " (dry-run, nothing is written)" : ""}`
  );

  const report = await newsImage.migrateNewsImages({ allowRemote, dryRun });
  console.log(
    `[news:images] scanned=${report.scanned} migrated=${report.migrated} ` +
      `unmigrated=${report.unmigrated} skipped=${report.skipped}`
  );

  report.items.forEach((item) => {
    console.log(
      `  • ${item.id || "(no id)"} → ${item.action}` +
        `${item.publicId ? ` (${item.publicId})` : ""}` +
        `${item.reason ? ` — ${item.reason}` : ""}`
    );
  });

  if (report.unmigrated) {
    console.log(
      "[news:images] 'unmigrated' images are no longer recoverable automatically — " +
        "open the News Admin panel and upload a replacement."
    );
  }
  process.exit(0);
})().catch((e) => {
  console.error("[news:images] failed:", e.message);
  process.exit(1);
});