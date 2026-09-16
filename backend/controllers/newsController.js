/**
 * ============================================================
 *  News controller — global CRUD CMS for the public website.
 *
 *  PUBLIC endpoints (/api/news*) return ONLY published articles,
 *  aggregated globally from a single database collection. They are
 *  NEVER scoped by admin user, portal, session or device — so any
 *  admin can publish a news item and every visitor sees it.
 *
 *  ADMIN endpoints (/api/admin/news*) are RBAC-protected via
 *  `requireAuth` and let admins Create / Read / Update / Delete
 *  any article (including drafts).
 * ============================================================
 */
const db = require("../config/database");
const { sanitize } = require("../middleware/validate");

const MAX_TITLE = 200;
const MAX_SHORT = 500;
const MAX_BODY = 20000;
const MAX_IMAGE = 2000000; // reject gigantic inline/legacy base64 on write

/* ---------- helpers ---------- */
function normalizeStatus(raw) {
  return raw === "draft" || raw === "published" ? raw : "published";
}

function byNewest(a, b) {
  const da = new Date(a.date || a.createdAt || 0);
  const db_ = new Date(b.date || b.createdAt || 0);
  return db_ - da;
}

/* ---------- PUBLIC: list published news (global, no filtering) ---------- */
exports.listPublished = (req, res) => {
  const rows = db
    .read("news")
    .filter((r) => normalizeStatus(r.status) === "published");

  // Optional global keyword search across title + short description.
  // This is an admin-agnostic text filter only — no scoping.
  const q = (req.query.q || "").toString().toLowerCase().trim();
  let out = rows;
  if (q) {
    out = rows.filter(
      (r) =>
        (r.title || "").toLowerCase().includes(q) ||
        (r.shortDesc || "").toLowerCase().includes(q)
    );
  }

  out = out.slice().sort(byNewest);
  return res.json({ ok: true, data: out });
};

/* ---------- PUBLIC: single published article ---------- */
exports.getPublished = (req, res) => {
  const row = db.read("news").find((r) => r.id === req.params.id);
  if (!row || normalizeStatus(row.status) !== "published") {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  return res.json({ ok: true, data: row });
};

/* ---------- ADMIN: list ALL news (published + drafts, no scoping) ---------- */
exports.listAll = (req, res) => {
  const rows = db
    .read("news")
    .slice()
    .sort(byNewest);
  return res.json({ ok: true, data: rows });
};

/* ---------- ADMIN: create news ---------- */
exports.create = (req, res) => {
  const b = req.body || {};
  const title = sanitize(b.title, MAX_TITLE);
  const shortDesc = sanitize(b.shortDesc, MAX_SHORT);
  const fullContent = sanitize(b.fullContent, MAX_BODY);
  const imageUrl = sanitize(b.imageUrl, MAX_IMAGE);

  if (!title || !shortDesc || !fullContent) {
    return res
      .status(400)
      .json({ ok: false, error: "title, shortDesc and fullContent are required" });
  }

  // Admins publish from the panel: status defaults to "published" when the
  // caller does not send one (the panel has no draft toggle).
  const status = normalizeStatus(b.status);
  const record = db.insert("news", {
    title,
    shortDesc,
    fullContent,
    imageUrl,
    date: sanitize(b.date, 20) || new Date().toISOString().slice(0, 10),
    status,
    publishedAt: status === "published" ? new Date().toISOString() : null,
  });

  return res.status(201).json({ ok: true, data: record });
};

/* ---------- ADMIN: update news ---------- */
exports.update = (req, res) => {
  const { id } = req.params;
  const rows = db.read("news");
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }

  const b = req.body || {};
  const patch = {};
  if (b.title !== undefined) patch.title = sanitize(b.title, MAX_TITLE);
  if (b.shortDesc !== undefined) patch.shortDesc = sanitize(b.shortDesc, MAX_SHORT);
  if (b.fullContent !== undefined) patch.fullContent = sanitize(b.fullContent, MAX_BODY);
  if (b.imageUrl !== undefined) patch.imageUrl = sanitize(b.imageUrl, MAX_IMAGE);
  if (b.date !== undefined) patch.date = sanitize(b.date, 20);
  if (b.status !== undefined) {
    patch.status = normalizeStatus(b.status);
    // Stamp the publish time the first time an article goes live.
    if (patch.status === "published" && !rows[idx].publishedAt) {
      patch.publishedAt = new Date().toISOString();
    }
  }

  rows[idx] = { ...rows[idx], ...patch, updatedAt: new Date().toISOString() };
  db.write("news", rows);
  return res.json({ ok: true, data: rows[idx] });
};

/* ---------- ADMIN: delete news ---------- */
exports.remove = (req, res) => {
  const { id } = req.params;
  const rows = db.read("news");
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  rows.splice(idx, 1);
  db.write("news", rows);
  return res.json({ ok: true });
};
