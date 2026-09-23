/**
 * ============================================================
 *  Cloudinary client — permanent, deploy-safe image storage.
 *
 *  Admin-uploaded News (blog) images must NEVER be written to the
 *  server's local `/uploads` folder: Render (and every other PaaS)
 *  wipes the local filesystem on each restart / redeploy, which is
 *  exactly why the uploaded images kept disappearing in production.
 *  Uploads therefore go straight to Cloudinary and only the returned
 *  `secure_url` + `public_id` are stored with the article.
 *
 *  The Cloudinary account already powering the BluConnet website /
 *  blog is reused by default (`wyixfdon`), so no new media host is
 *  introduced — only the API credentials have to be supplied through
 *  environment variables (never committed).
 *
 *  Config (backend/.env):
 *    CLOUDINARY_CLOUD_NAME=wyixfdon
 *    CLOUDINARY_API_KEY=...
 *    CLOUDINARY_API_SECRET=...
 *    # …or the single SDK-native URL instead of the three vars above
 *    CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
 *    CLOUDINARY_NEWS_FOLDER=bluconnet/news        (optional)
 *
 *  When the credentials are missing, `isConfigured()` is false and the
 *  upload endpoint answers 503 — nothing is ever persisted in that case.
 * ============================================================
 */
const cloudinary = require("cloudinary").v2;

/* Existing BluConnet site/blog Cloudinary cloud (see the image URLs used by
   the marketing pages). Used only as the default cloud name. */
const DEFAULT_CLOUD_NAME = "wyixfdon";

const NEWS_FOLDER = (process.env.CLOUDINARY_NEWS_FOLDER || "bluconnet/news")
  .trim()
  .replace(/^\/+|\/+$/g, "");

const env = (name) => (process.env[name] || "").trim();

/* The SDK also reads CLOUDINARY_URL from the environment, so the single-URL
   form keeps working without any code change. A broken configuration must
   never take the API down: it only disables uploads. */
let configError = "";
try {
  const apiKey = env("CLOUDINARY_API_KEY");
  const apiSecret = env("CLOUDINARY_API_SECRET");
  const cloudName = env("CLOUDINARY_CLOUD_NAME") || DEFAULT_CLOUD_NAME;
  if (apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  } else {
    cloudinary.config({ secure: true }); // falls back to CLOUDINARY_URL
  }
} catch (e) {
  configError = e.message;
}

function currentConfig() {
  try {
    return cloudinary.config() || {};
  } catch (e) {
    return {};
  }
}

function isConfigured() {
  if (configError) return false;
  const cfg = currentConfig();
  return Boolean(cfg.cloud_name && cfg.api_key && cfg.api_secret);
}

function cloudName() {
  return currentConfig().cloud_name || "";
}

/** Human-readable status for boot logs / diagnostics. */
function describe() {
  if (isConfigured()) {
    return `configured (cloud="${cloudName()}", folder="${NEWS_FOLDER}")`;
  }
  return (
    "NOT configured — set CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + " +
    `CLOUDINARY_API_SECRET (or CLOUDINARY_URL)${configError ? ` [${configError}]` : ""}`
  );
}

/* ---------------- URL helpers (keep the DB consistent) ---------------- */

const CLOUDINARY_URL_RE = /^https?:\/\/res\.cloudinary\.com\//i;

/** True for a permanently hosted Cloudinary asset URL. */
function isCloudinaryUrl(url) {
  return CLOUDINARY_URL_RE.test(String(url || "").trim());
}

/* A Cloudinary delivery URL looks like one of:
 *   https://res.cloudinary.com/<cloud>/image/upload/<public_id>.<ext>
 *   https://res.cloudinary.com/<cloud>/image/upload/v1234/<folder>/<name>.<ext>
 *   https://res.cloudinary.com/<cloud>/image/upload/<t>/v1234/<folder>/<name>.<ext>
 * where <t> is an optional transformation segment (f_auto,q_auto,w_400…). */
const TRANSFORM_HINT_RE =
  /^(?:a|ar|b|bo|c|co|d|dl|dn|dpr|du|e|eo|f|fl|fn|g|h|if|l|o|p|pg|q|r|so|sp|t|u|vc|vs|w|x|y|z)_/;

function dropTransformSegments(segments) {
  let i = 0;
  while (i < segments.length - 1) {
    const seg = segments[i];
    if (seg.includes(",") || TRANSFORM_HINT_RE.test(seg)) i += 1;
    else break;
  }
  return segments.slice(i);
}

/**
 * Extract the Cloudinary `public_id` from a delivery URL (transformation +
 * version prefixes removed). Returns "" for anything that is not a
 * Cloudinary URL, so callers can treat it as "nothing to clean up".
 */
function publicIdFromUrl(url) {
  const raw = String(url || "").trim();
  if (!isCloudinaryUrl(raw)) return "";
  let pathname;
  try {
    pathname = new URL(raw).pathname;
  } catch (e) {
    return "";
  }
  const marker = "/image/upload/";
  const at = pathname.indexOf(marker);
  if (at === -1) return "";
  const segments = pathname.slice(at + marker.length).split("/").filter(Boolean);
  if (!segments.length) return "";

  const versionAt = segments.findIndex((s) => /^v\d+$/.test(s));
  const publicSegments =
    versionAt >= 0 ? segments.slice(versionAt + 1) : dropTransformSegments(segments);
  if (!publicSegments.length) return "";

  const last = publicSegments[publicSegments.length - 1].replace(/\.[a-z0-9]+$/i, "");
  if (!last) return "";
  return [...publicSegments.slice(0, -1), last].join("/");
}

/**
 * Build the permanent delivery URL of an asset from its Cloudinary
 * `public_id`:
 *
 *     https://res.cloudinary.com/<cloud>/image/upload/<public_id>
 *
 * Cloudinary serves that URL directly (it is the very form the delivery
 * URLs use, only without the version prefix), which makes it possible to
 * repair a stored record whose `secure_url` was lost — while the asset
 * itself never left Cloudinary. Returns "" when the public_id is unusable
 * or the cloud name is unknown, so callers can treat it as "nothing to
 * repair".
 */
function urlFromPublicId(publicId, opts = {}) {
  const id = String(publicId == null ? "" : publicId)
    .trim()
    .replace(/^\/+/, "");
  // A delivery path must not contain whitespace, control characters or any
  // traversal sequence — such a value is not a public_id we generated.
  if (!id || /\s/.test(id) || id.includes("..") || /^https?:/i.test(id)) return "";

  // Same cloud the uploads use by default: when the SDK has no explicit cloud
  // name configured, fall back to the BluConnet cloud the assets are uploaded
  // to, so the repair still works on a bare service.
  const name = cloudName() || DEFAULT_CLOUD_NAME;
  if (!name) return "";

  const resource =
    String(opts.resourceType || "image")
      .toLowerCase()
      .replace(/[^a-z]/g, "") || "image";

  return `https://res.cloudinary.com/${name}/${resource}/upload/${id}`;
}

/* ---------------- upload / destroy ---------------- */

function safeFilename(name, fallback = "news-image") {
  const base = String(name || "")
    .replace(/\.[a-z0-9]+$/i, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .slice(0, 60)
    .trim()
    .replace(/\s+/g, "-");
  return base || fallback;
}

/**
 * Upload an in-memory buffer (never a local file) to Cloudinary.
 * Resolves with the permanent asset info or rejects with the real error.
 */
function uploadBuffer(buffer, opts = {}) {
  return new Promise((resolve, reject) => {
    if (!isConfigured()) {
      return reject(new Error("Cloudinary is not configured"));
    }
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      return reject(new Error("Empty image buffer"));
    }

    const folder = (opts.folder === undefined ? NEWS_FOLDER : opts.folder || "")
      .replace(/^\/+|\/+$/g, "");

    const options = {
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      invalidate: true,
      filename: safeFilename(opts.filename),
    };
    if (folder) options.folder = folder;
    if (opts.publicId) {
      Object.assign(options, {
        public_id: opts.publicId,
        use_filename: false,
        unique_filename: false,
        overwrite: true,
      });
    }

    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      if (!result || !result.secure_url || !result.public_id) {
        return reject(new Error("Cloudinary returned no secure_url/public_id"));
      }
      return resolve({
        secureUrl: result.secure_url,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        format: result.format,
        resourceType: result.resource_type,
        createdAt: result.created_at,
      });
    });
    stream.on("error", reject);
    stream.end(buffer);
  });
}

/**
 * Permanently delete an asset by its `public_id`.
 * "not found" counts as removed (the asset is already gone).
 */
function destroy(publicId, opts = {}) {
  return new Promise((resolve, reject) => {
    const id = String(publicId || "").trim();
    if (!id) return resolve({ result: "not found", removed: false });
    if (!isConfigured()) return reject(new Error("Cloudinary is not configured"));
    return cloudinary.uploader.destroy(
      id,
      { resource_type: opts.resourceType || "image", invalidate: true },
      (err, result) => {
        if (err) return reject(err);
        const state = (result && result.result) || "unknown";
        return resolve({ result: state, removed: state === "ok" || state === "not found" });
      }
    );
  });
}

module.exports = {
  DEFAULT_CLOUD_NAME,
  NEWS_FOLDER,
  isConfigured,
  describe,
  cloudName,
  isCloudinaryUrl,
  publicIdFromUrl,
  urlFromPublicId,
  uploadBuffer,
  destroy,
  safeFilename,
  cloudinary,
};
