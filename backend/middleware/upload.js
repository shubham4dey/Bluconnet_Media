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

module.exports = { upload, imageUpload, UPLOAD_DIR };
