/**
 * ============================================================
 *  News image service — every image attached to an article ends up
 *  as a permanent Cloudinary asset.
 *
 *  • uploadBuffer()        — send a received file straight to Cloudinary
 *  • persistImage()        — normalise ANY image reference before it is
 *                            stored with an article:
 *                              Cloudinary secure_url → kept, public_id kept
 *                              legacy inline base64  → re-uploaded
 *                              legacy /uploads/...  → re-uploaded from disk
 *                              external http(s) URL → kept (owned elsewhere)
 *                              anything unusable    → DROPPED (a broken
 *                                                     path is never stored)
 *  • removeImage()         — best-effort delete of a replaced/removed asset
 *  • migrateNewsImages()   — one-off upgrade of legacy paths in the database
 *
 *  Upload failures never surface a URL: the article is saved without an
 *  image instead of a path that 404s after the next Render redeploy.
 * ============================================================
 */
const fs = require("fs");
const path = require("path");
const cloudinaryClient = require("./cloudinary");
const defaultStore = require("../models/newsModel");

const DEFAULT_UPLOAD_DIR = path.join(__dirname, "..", "uploads");

const CLASS = {
  EMPTY: "empty",
  CLOUDINARY: "cloudinary",
  INLINE: "inline",
  LOCAL: "local",
  REMOTE: "remote",
  INVALID: "invalid",
};

/** What kind of image reference is this? */
function classifyImageUrl(raw) {
  const value = String(raw == null ? "" : raw).trim();
  if (!value) return CLASS.EMPTY;
  if (cloudinaryClient.isCloudinaryUrl(value)) return CLASS.CLOUDINARY;
  if (/^data:/i.test(value)) return CLASS.INLINE;
  if (/^\/?uploads\//i.test(value)) return CLASS.LOCAL;
  if (/^https?:\/\/\S+$/i.test(value)) return CLASS.REMOTE;
  return CLASS.INVALID;
}

/**
 * Absolute path of a legacy `/uploads/<file>` reference, or null when the
 * reference is malformed or tries to escape the uploads folder.
 */
function localFilePath(raw, uploadDir = DEFAULT_UPLOAD_DIR) {
  const value = String(raw || "").trim();
  if (!/^\/?uploads\//i.test(value)) return null;
  const rel = value.replace(/^\/?uploads\//i, "").replace(/^\/+/, "");
  if (!rel) return null;
  const base = path.resolve(uploadDir);
  const abs = path.resolve(base, rel);
  if (abs !== base && !abs.startsWith(base + path.sep)) return null; // traversal
  return abs;
}

const MIME_EXT = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/bmp": "bmp",
};

function extensionForMime(mime) {
  return MIME_EXT[String(mime || "").toLowerCase()] || "jpg";
}

/** Decode a legacy inline `data:image/…;base64,…` reference. */
function decodeDataUrl(raw) {
  const m = /^data:([^;,]+)(;base64)?,([\s\S]*)$/.exec(String(raw || ""));
  if (!m) return null;
  const mime = String(m[1] || "image/png").toLowerCase();
  if (!mime.startsWith("image/")) return null;
  try {
    const buffer = m[2]
      ? Buffer.from(m[3], "base64")
      : Buffer.from(decodeURIComponent(m[3]), "utf8");
    if (!buffer.length) return null;
    return { buffer, mime };
  } catch (e) {
    return null;
  }
}

/** A stored `public_id` (as opposed to a URL / path / inline blob). */
const PUBLIC_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._\-/]*$/;

/**
 * Build a service instance. Everything external (Cloudinary client, the
 * document store, the filesystem, fetch) is injectable so the failure paths
 * can be unit-tested without touching the network or the real database.
 */
function createNewsImageService({
  cloud = cloudinaryClient,
  store = defaultStore,
  uploadDir = DEFAULT_UPLOAD_DIR,
  fetchImpl = typeof fetch === "function" ? fetch.bind(globalThis) : null,
  logger = console,
} = {}) {
  const warn = (msg) => logger && logger.warn && logger.warn(`[news-image] ${msg}`);
  const info = (msg) => logger && logger.log && logger.log(`[news-image] ${msg}`);
  const fail = (msg) => logger && logger.error && logger.error(`[news-image] ${msg}`);

  const dropped = (kind, reason) => ({
    imageUrl: "",
    imagePublicId: "",
    kind,
    migrated: false,
    dropped: true,
    reason,
  });

  const kept = (imageUrl, kind, imagePublicId = "", reason = "") => ({
    imageUrl,
    imagePublicId,
    kind,
    migrated: false,
    dropped: false,
    reason,
  });

  function isConfigured() {
    return Boolean(cloud.isConfigured());
  }

  function status() {
    return {
      configured: isConfigured(),
      cloudName: cloud.cloudName ? cloud.cloudName() : "",
      folder: cloud.NEWS_FOLDER || "",
    };
  }

  function uploadBuffer(buffer, opts = {}) {
    return cloud.uploadBuffer(buffer, opts);
  }

  async function uploadFromBuffer(buffer, opts, sourceLabel, kind = CLASS.LOCAL) {
    const out = await cloud.uploadBuffer(buffer, opts);
    info(`uploaded ${sourceLabel} -> ${out.publicId}`);
    return {
      imageUrl: out.secureUrl,
      imagePublicId: out.publicId,
      kind,
      migrated: true,
      dropped: false,
      reason: "",
    };
  }

  function filenameFromUrl(url) {
    try {
      const base = path.basename(new URL(url).pathname);
      return base || "external-image";
    } catch (e) {
      return "external-image";
    }
  }

  async function fetchRemoteBuffer(url, timeoutMs = 10000) {
    if (!fetchImpl) throw new Error("fetch is unavailable on this runtime");
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      const res = await fetchImpl(url, {
        redirect: "follow",
        signal: controller ? controller.signal : undefined,
      });
      if (!res || !res.ok) throw new Error(`HTTP ${res ? res.status : "error"}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (!buf.length) throw new Error("empty response");
      return buf;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
/**
   * Normalise an image reference into the two fields persisted with an
   * article. NEVER throws and NEVER returns an unusable URL: on any failure
   * the image is dropped (`imageUrl: ""`) and the reason is logged.
   */
  async function persistImage(raw, options = {}) {
    const value = String(raw == null ? "" : raw).trim();
    const kind = classifyImageUrl(value);

    if (kind === CLASS.EMPTY) {
      return kept("", kind);
    }

    if (kind === CLASS.CLOUDINARY) {
      return kept(value, kind, cloud.publicIdFromUrl(value));
    }

    if (kind === CLASS.INLINE) {
      const decoded = decodeDataUrl(value);
      if (!decoded) {
        warn("dropped an inline image that could not be decoded");
        return dropped(kind, "inline image could not be decoded");
      }
      if (!isConfigured()) {
        // Legacy behaviour preserved: an inline image still renders, so it is
        // only left untouched while Cloudinary is not configured.
        warn("Cloudinary is not configured — keeping the legacy inline image as-is");
        return kept(value, kind, "", "cloudinary-not-configured");
      }
      try {
        return await uploadFromBuffer(
          decoded.buffer,
          { filename: `news-inline.${extensionForMime(decoded.mime)}` },
          "legacy inline image",
          kind
        );
      } catch (e) {
        fail(`legacy inline image upload failed (${e.message}) — image dropped`);
        return dropped(kind, `upload failed: ${e.message}`);
      }
    }

    if (kind === CLASS.LOCAL) {
      const abs = localFilePath(value, uploadDir);
      if (!abs || !fs.existsSync(abs)) {
        warn(`legacy local image "${value}" is not on disk — dropped (a 404 path is never stored)`);
        return dropped(kind, "local file not found");
      }
      if (!isConfigured()) {
        warn(`Cloudinary is not configured — dropping legacy local image "${value}"`);
        return dropped(kind, "cloudinary-not-configured");
      }
      try {
        const buffer = fs.readFileSync(abs);
        return await uploadFromBuffer(
          buffer,
          { filename: path.basename(abs) },
          `legacy local image ${value}`,
          kind
        );
      } catch (e) {
        fail(`legacy local image upload failed for "${value}" (${e.message}) — image dropped`);
        return dropped(kind, `upload failed: ${e.message}`);
      }
    }

    if (kind === CLASS.REMOTE) {
      // Already hosted elsewhere (e.g. the old WordPress media library).
      // Re-hosting is a bonus, never a downgrade: when the bytes cannot be
      // fetched the existing URL is kept untouched.
      if (!options.fetchRemote || !isConfigured() || !fetchImpl) {
        return kept(value, kind, "", "remote-kept");
      }
      try {
        const buffer = await fetchRemoteBuffer(value, options.timeoutMs);
        return await uploadFromBuffer(
          buffer,
          { filename: filenameFromUrl(value) },
          `external image ${value}`,
          kind
        );
      } catch (e) {
        warn(`external image "${value}" could not be migrated (${e.message}) — kept as-is`);
        return kept(value, kind, "", `remote-unreachable: ${e.message}`);
      }
    }

    warn(`dropped an unusable image reference (${JSON.stringify(value).slice(0, 80)})`);
    return dropped(kind, "invalid image reference");
  }

  /**
   * Delete the Cloudinary asset behind a stored image reference (accepts a
   * secure_url or a raw public_id). Best effort by design: the article has
   * already been updated/removed, so a failure is reported, never thrown.
   */
  async function removeImage(ref, options = {}) {
    const value = String(ref == null ? "" : ref).trim();
    if (!value) return { removed: false, publicId: "", reason: "empty reference" };

    const kind = classifyImageUrl(value);
    let publicId = "";
    if (kind === CLASS.CLOUDINARY) {
      publicId = cloud.publicIdFromUrl(value);
    } else if (kind === CLASS.INVALID && PUBLIC_ID_RE.test(value)) {
      publicId = value; // already a stored public_id
    }

    if (!publicId) {
      return { removed: false, publicId: "", reason: "not a Cloudinary asset" };
    }
    if (!isConfigured()) {
      warn(`cannot delete Cloudinary asset "${publicId}" — Cloudinary is not configured`);
      return { removed: false, publicId, reason: "cloudinary-not-configured" };
    }
    try {
      const res = await cloud.destroy(publicId, options);
      if (res && res.removed) info(`deleted Cloudinary asset ${publicId}`);
      else warn(`Cloudinary did not delete "${publicId}" (${res && res.result})`);
      return {
        removed: Boolean(res && res.removed),
        publicId,
        reason: res && res.removed ? "" : (res && res.result) || "unknown",
      };
    } catch (e) {
      fail(`Cloudinary delete failed for "${publicId}" (${e.message})`);
      return { removed: false, publicId, reason: e.message };
    }
  }
/**
   * Inspect every article and upgrade legacy image references to Cloudinary
   * (`/uploads/...`, inline base64 and — when `allowRemote` — external URLs).
   * Idempotent: already-permanent assets are only checked, never re-uploaded.
   * References that cannot be recovered are left untouched and reported.
   */
  async function migrateNewsImages(options = {}) {
    const { allowRemote = false, dryRun = false } = options;
    const report = {
      scanned: 0,
      migrated: 0,
      unmigrated: 0,
      skipped: 0,
      dryRun: Boolean(dryRun),
      items: [],
    };

    let rows = [];
    try {
      rows = store.list() || [];
    } catch (e) {
      fail(`could not read the news collection (${e.message})`);
      return report;
    }

    for (const row of rows) {
      report.scanned += 1;
      const value = String((row && row.imageUrl) || "").trim();
      const kind = classifyImageUrl(value);

      if (kind === CLASS.EMPTY) {
        report.skipped += 1;
        continue;
      }

      if (kind === CLASS.CLOUDINARY) {
        const publicId = row.imagePublicId || cloud.publicIdFromUrl(value);
        if (publicId && row.imagePublicId === publicId) {
          report.skipped += 1;
          continue;
        }
        if (!publicId) {
          report.unmigrated += 1;
          report.items.push({ id: row.id, action: "unrecognised-cloudinary-url" });
          continue;
        }
        if (!dryRun) await store.update(row.id, { imageUrl: value, imagePublicId: publicId });
        report.migrated += 1;
        report.items.push({ id: row.id, action: "public-id-backfilled", publicId });
        continue;
      }

      if (kind === CLASS.REMOTE && !allowRemote) {
        report.skipped += 1;
        continue;
      }

      const res = await persistImage(value, { fetchRemote: allowRemote });
      if (res.migrated && res.imageUrl) {
        if (!dryRun) {
          await store.update(row.id, { imageUrl: res.imageUrl, imagePublicId: res.imagePublicId });
        }
        report.migrated += 1;
        report.items.push({
          id: row.id,
          action: "migrated",
          from: value.slice(0, 120),
          to: res.imageUrl,
          publicId: res.imagePublicId,
        });
      } else if (res.dropped) {
        // Unrecoverable (file gone / upload refused): the record is kept
        // intact and reported — the admin can re-upload it from the panel.
        report.unmigrated += 1;
        report.items.push({
          id: row.id,
          action: "unmigrated",
          from: value.slice(0, 120),
          reason: res.reason,
        });
      } else {
        report.skipped += 1;
        report.items.push({ id: row.id, action: "kept", reason: res.reason });
      }
    }

    if (report.migrated || report.unmigrated) {
      info(
        `migration ${dryRun ? "(dry-run) " : ""}done — scanned=${report.scanned} ` +
          `migrated=${report.migrated} unmigrated=${report.unmigrated} skipped=${report.skipped}`
      );
    }
    return report;
  }

  return {
    CLASS,
    classifyImageUrl,
    localFilePath,
    decodeDataUrl,
    isConfigured,
    status,
    uploadBuffer,
    persistImage,
    removeImage,
    migrateNewsImages,
  };
}

/* Default instance wired to the real Cloudinary client + document store. */
const newsImage = createNewsImageService();

module.exports = newsImage;
module.exports.createNewsImageService = createNewsImageService;
module.exports.CLASS = CLASS;
module.exports.classifyImageUrl = classifyImageUrl;
module.exports.localFilePath = localFilePath;
module.exports.decodeDataUrl = decodeDataUrl;
module.exports.extensionForMime = extensionForMime;
module.exports.PUBLIC_ID_RE = PUBLIC_ID_RE;
module.exports.DEFAULT_UPLOAD_DIR = DEFAULT_UPLOAD_DIR;
