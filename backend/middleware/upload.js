/**
 * ============================================================
 *  File upload middleware — images / PDF / docs, max 5 MB
 *
 *  `upload`       — legacy disk storage (kept for non-image documents)
 *  `imageUpload`  — MEMORY storage used by every News image upload:
 *                   the buffer is streamed straight to Cloudinary by
 *                   services/newsImage.js, so nothing is ever written
 *                   to the local `/uploads` folder (Render wipes it on
 *                   each restart/redeploy).
 * ============================================================
 */
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp",
  ".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx", ".csv",
]);

/* Images only — used for the Cloudinary-backed News uploads. */
const ALLOWED_IMAGES = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".bmp"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .slice(0, 60)
      .trim() || "file";
    cb(null, `${Date.now()}-${base.replace(/\s+/g, "-")}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.has(ext)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});

/* Memory storage: the file never touches the filesystem. `req.file.buffer`
   is handed to Cloudinary. */
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImage =
      String(file.mimetype || "").startsWith("image/") && ALLOWED_IMAGES.has(ext);
    if (!isImage) {
      const err = new Error("Unsupported image type");
      err.status = 400; // answered as 400 (not a generic 500) by the error handler
      return cb(err);
    }
    cb(null, true);
  },
});

/* ---------------- file-signature (magic byte) guard ----------------
   The extension and the client's Content-Type are both supplied by the
   uploader, so a "image/png" file can really be anything. Before a buffer is
   forwarded to Cloudinary its first bytes must match a real image format. */
const IMAGE_SIGNATURES = [
  { format: "jpg", test: (b) => b.length > 2 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    format: "png",
    test: (b) =>
      b.length > 7 &&
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  {
    format: "gif",
    test: (b) => b.length > 5 && b.slice(0, 3).toString("latin1") === "GIF",
  },
  {
    format: "webp",
    test: (b) =>
      b.length > 11 &&
      b.slice(0, 4).toString("latin1") === "RIFF" &&
      b.slice(8, 12).toString("latin1") === "WEBP",
  },
  { format: "bmp", test: (b) => b.length > 1 && b[0] === 0x42 && b[1] === 0x4d },
  {
    format: "avif",
    test: (b) =>
      b.length > 11 &&
      b.slice(4, 8).toString("latin1") === "ftyp" &&
      ["avif", "avis", "heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(
        b.slice(8, 12).toString("latin1")
      ),
  },
];

/** Detected image format of a buffer ('' when it is not a known image). */
function detectImageFormat(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) return "";
  const match = IMAGE_SIGNATURES.find((sig) => sig.test(buffer));
  return match ? match.format : "";
}

/**
 * Express middleware: run AFTER `imageUpload.single("file")` (memory storage) so
 * `req.file.buffer` is populated. Answers 400 for anything whose bytes are not
 * a real image — a disguised script/HTML/archive never reaches Cloudinary.
 */
function imageSignatureGuard(req, res, next) {
  if (!req.file) return next(); // the controller answers the "no file" case
  const format = detectImageFormat(req.file.buffer);
  if (!format) {
    console.warn(
      `[upload] rejected "${String(req.file.originalname || "").slice(0, 60)}" — ` +
        `bytes are not a known image (claimed ${req.file.mimetype})`
    );
    return res.status(400).json({
      ok: false,
      error: "Unsupported image type — the file content is not a real image",
    });
  }
  req.file.detectedFormat = format;
  return next();
}

module.exports = { upload, imageUpload, imageSignatureGuard, detectImageFormat, UPLOAD_DIR };
