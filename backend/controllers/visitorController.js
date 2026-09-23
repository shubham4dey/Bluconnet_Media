/**
 * ============================================================
 *  Live visitors (heartbeat) + upload response
 *  A visitor is "live" if their last heartbeat is < 90s old.
 * ============================================================
 */
const path = require("path");
const db = require("../config/database");
const { sanitize } = require("../middleware/validate");

const LIVE_WINDOW_MS = 90 * 1000;

exports.heartbeat = (req, res) => {
  const body = req.body || {};
  const sessionId = sanitize(body.sessionId, 64);
  if (!sessionId) return res.status(400).json({ ok: false });

  const rows = db.read("visitors");
  const now = Date.now();
  // keep only the last 24h of visitor rows to bound file size
  const fresh = rows.filter((r) => now - new Date(r.lastSeen).getTime() < 24 * 60 * 60 * 1000);
  const existingIdx = fresh.findIndex((r) => r.sessionId === sessionId);

  const record = {
    sessionId,
    page: sanitize(body.page, 200) || "/",
    referrer: sanitize(body.referrer, 200),
    device: sanitize(body.device, 40),
    country: sanitize(body.country, 80),
    lastSeen: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    record.firstSeen = fresh[existingIdx].firstSeen;
    fresh[existingIdx] = { ...fresh[existingIdx], ...record };
  } else {
    record.firstSeen = record.lastSeen;
    fresh.unshift(record);
  }

  db.write("visitors", fresh.slice(0, 500));
  return res.json({ ok: true });
};

/* Legacy local-disk upload response. It is no longer wired to any route:
   News images are uploaded straight to Cloudinary by newsController.uploadImage
   (services/newsImage.js) so they survive Render restarts/redeploys. Kept only
   so the shape stays documented for non-image documents. */
exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: "No file received" });
  }
  return res.json({
    ok: true,
    url: `/uploads/${req.file.filename}`,
    name: req.file.originalname.slice(0, 120),
    size: req.file.size,
  });
};
