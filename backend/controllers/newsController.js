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
 *
 *  IMAGES — every News image uploaded from the Admin panel is stored
 *  permanently on Cloudinary (see services/newsImage.js): the article
 *  keeps the Cloudinary `secure_url` (imageUrl) plus its `public_id`
 *  (imagePublicId). Nothing is written to the local `/uploads` folder,
 *  which Render wipes on every restart/redeploy. A replaced image is
 *  uploaded FIRST and the old asset is deleted afterwards; deleting an
 *  article deletes its asset too. When an upload fails the image is
 *  dropped — a broken URL is never saved.
 *
 *  ARTICLES — written to MySQL (`news` table, see models/newsModel.js),
 *  which survives Render restarts/redeploys; a local JSON mirror keeps the
 *  public reads synchronous. A write that cannot reach MySQL is reported as
 *  an error instead of a success, so the panel never loses an article.
 * ============================================================
 */
const newsModel = require("../models/newsModel");
const newsImage = require("../services/newsImage");
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

/**
 * Turn whatever image reference arrived into the two persisted fields.
 * `persistImage` never throws: when Cloudinary rejects the upload (or the
 * reference is unusable) it returns an empty imageUrl, so a broken image
 * path can never end up in the database.
 */
async function imageFields(rawImageUrl) {
  const resolved = await newsImage.persistImage(rawImageUrl);
  return { imageUrl: resolved.imageUrl || "", imagePublicId: resolved.imagePublicId || "" };
}

/**
 * A durable-write failure (MySQL unreachable) is answered as 503 with the real
 * reason. The article was NOT stored (the model rolls the mirror back), so the
 * admin can retry safely — a retry can never create a duplicate.
 */
function dbFailure(res, e) {
  if (e && e.code === "NEWS_DB_UNAVAILABLE") {
    console.error("[news] durable write failed:", e.message);
    return res.status(503).json({
      ok: false,
      error:
        "News could not be saved because the database is unavailable. Nothing was stored — please retry in a moment.",
    });
  }
  return null;
}

/* ---------- PUBLIC: list published news (global, no filtering) ---------- */
exports.listPublished = (req, res) => {
  const rows = newsModel
    .list()
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
  const row = newsModel.findById(req.params.id);
  if (!row || normalizeStatus(row.status) !== "published") {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  return res.json({ ok: true, data: row });
};

/* ---------- ADMIN: list ALL news (published + drafts, no scoping) ---------- */
exports.listAll = (req, res) => {
  const rows = newsModel.list().slice().sort(byNewest);
  return res.json({ ok: true, data: rows });
};

/* ---------- ADMIN: create news ---------- */
exports.create = async (req, res) => {
  try {
    const b = req.body || {};
    const title = sanitize(b.title, MAX_TITLE);
    const shortDesc = sanitize(b.shortDesc, MAX_SHORT);
    const fullContent = sanitize(b.fullContent, MAX_BODY);

    if (!title || !shortDesc || !fullContent) {
      return res
        .status(400)
        .json({ ok: false, error: "title, shortDesc and fullContent are required" });
    }

    // The image (if any) is uploaded to Cloudinary BEFORE the article is
    // written, so the record only ever holds a permanent secure_url. A failed
    // upload yields an empty imageUrl instead of a broken path.
    const image = await imageFields(sanitize(b.imageUrl, MAX_IMAGE));

    // Admins publish from the panel: status defaults to "published" when the
    // caller does not send one (the panel has no draft toggle).
    const status = normalizeStatus(b.status);
    // Durable write (MySQL) — throws when the article could not be stored, so
    // the panel never reports success for data a redeploy would wipe.
    const record = await newsModel.insert({
      title,
      shortDesc,
      fullContent,
      imageUrl: image.imageUrl,
      imagePublicId: image.imagePublicId,
      date: sanitize(b.date, 20) || new Date().toISOString().slice(0, 10),
      status,
      publishedAt: status === "published" ? new Date().toISOString() : null,
    });

    return res.status(201).json({
      ok: true,
      data: record,
      // The panel can tell the admin when an image had to be dropped
      // (`imageDropped`) instead of silently publishing without it.
      imageStored: Boolean(image.imageUrl),
      imageDropped: Boolean(sanitize(b.imageUrl, MAX_IMAGE) && !image.imageUrl),
      storage: newsModel.isDurable() ? "mysql" : "local-mirror",
    });
  } catch (e) {
    const answered = dbFailure(res, e);
    if (answered) return answered;
    console.error("[news] create failed:", e.message);
    return res.status(500).json({ ok: false, error: "Could not save news" });
  }
};

/* ---------- ADMIN: update news ---------- */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const current = newsModel.findById(id);
    if (!current) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    const b = req.body || {};
    const patch = {};
    if (b.title !== undefined) patch.title = sanitize(b.title, MAX_TITLE);
    if (b.shortDesc !== undefined) patch.shortDesc = sanitize(b.shortDesc, MAX_SHORT);
    if (b.fullContent !== undefined) patch.fullContent = sanitize(b.fullContent, MAX_BODY);
    if (b.date !== undefined) patch.date = sanitize(b.date, 20);
    if (b.status !== undefined) {
      patch.status = normalizeStatus(b.status);
      // Stamp the publish time the first time an article goes live.
      if (patch.status === "published" && !current.publishedAt) {
        patch.publishedAt = new Date().toISOString();
      }
    }

    // Image replacement: the NEW image is uploaded to Cloudinary first…
    let replacedPublicId = "";
    if (b.imageUrl !== undefined) {
      const image = await imageFields(sanitize(b.imageUrl, MAX_IMAGE));
      patch.imageUrl = image.imageUrl;
      patch.imagePublicId = image.imagePublicId;
      const previous =
        current.imagePublicId || newsImage.publicIdFromUrl(current.imageUrl);
      if (previous && previous !== patch.imagePublicId) replacedPublicId = previous;
    }

    // …then the durable row is written (MySQL + local mirror)…
    const updated = await newsModel.update(id, patch);
    if (!updated) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    // …and only then is the replaced asset removed from Cloudinary (best
    // effort: the article is already saved, so a delete failure is logged and
    // reported instead of failing the request).
    let imageRemoved = null;
    if (replacedPublicId) {
      const cleanup = await newsImage.removeImage(replacedPublicId);
      imageRemoved = cleanup.removed;
    }

    return res.json({ ok: true, data: updated, imageRemoved });
  } catch (e) {
    const answered = dbFailure(res, e);
    if (answered) return answered;
    console.error("[news] update failed:", e.message);
    return res.status(500).json({ ok: false, error: "Could not update news" });
  }
};

/* ---------- ADMIN: delete news ---------- */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    // Durable delete first: when MySQL refuses, the article is still there and
    // the panel sees the error instead of a half-deleted record.
    const removed = await newsModel.remove(id);
    if (!removed) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    // Delete the article's Cloudinary asset too (best effort — the record is
    // already gone, so a cleanup failure must not turn into an error).
    const cleanup = await newsImage.removeImage(
      removed.imagePublicId || removed.imageUrl
    );
    return res.json({ ok: true, imageRemoved: cleanup.removed });
  } catch (e) {
    const answered = dbFailure(res, e);
    if (answered) return answered;
    console.error("[news] delete failed:", e.message);
    return res.status(500).json({ ok: false, error: "Could not delete news" });
  }
};

/* ---------- ADMIN: upload a News image to Cloudinary ----------
   The file arrives in memory (never on disk) and leaves as a permanent
   Cloudinary asset. On ANY failure the response contains no URL at all, so
   the Admin panel can never save a broken image path. */
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: "No file received" });
  }
  if (!newsImage.isConfigured()) {
    console.error("[news] image upload refused — Cloudinary is not configured");
    return res.status(503).json({
      ok: false,
      error:
        "Image storage is not configured on the server (missing Cloudinary credentials).",
    });
  }

  try {
    const out = await newsImage.uploadBuffer(req.file.buffer, {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
    });
    console.log(`[news] uploaded ${req.file.originalname} -> ${out.publicId}`);
    return res.json({
      ok: true,
      url: out.secureUrl, // same field the Admin panel already consumes
      secureUrl: out.secureUrl,
      publicId: out.publicId,
      name: String(req.file.originalname || "").slice(0, 120),
      size: req.file.size,
      width: out.width,
      height: out.height,
      format: out.format,
    });
  } catch (e) {
    console.error("[news] Cloudinary upload failed:", e.message);
    return res.status(502).json({
      ok: false,
      error: `Cloudinary upload failed: ${e.message}`,
    });
  }
};

/* ---------- ADMIN: migrate legacy image paths to Cloudinary ----------
   Upgrades `/uploads/...` and inline base64 references (optionally external
   URLs) to permanent Cloudinary assets. Returns a report; never throws. */
exports.migrateImages = async (req, res) => {
  try {
    const body = req.body || {};
    const report = await newsImage.migrateNewsImages({
      allowRemote: Boolean(body.allowRemote),
      dryRun: Boolean(body.dryRun),
    });
    return res.json({
      ok: true,
      ...report,
      storage: newsModel.isDurable() ? "mysql" : "local-mirror",
    });
  } catch (e) {
    console.error("[news] image migration failed:", e.message);
    return res.status(500).json({ ok: false, error: "Could not migrate news images" });
  }
};
