/**
 * ============================================================
 *  BLUCONNET MEDIA — AI Assistant Backend
 *  Express API: leads, meetings, job applications, live-chat
 *  handoffs, chat session history, live visitors, analytics,
 *  CSV export, webhook + email + CRM notifications.
 * ============================================================
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const db = require("./config/database");
const { globalLimiter } = require("./middleware/rateLimit");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

db.ensure();

/* ---------------- security & parsing ---------------- */
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  next();
});

/* Always-allowed origins: the production frontend domains plus the local
   development frontends (the site is served on http://localhost:3000 in dev).
   FRONTEND_ORIGIN is ADDITIVE, it no longer REPLACES this list. Previously a
   .env that only listed the production domains removed the localhost entries,
   so the browser CORS preflight for file uploads (POST /api/upload) and admin
   writes (POST /api/admin/news) was blocked and Axios surfaced the opaque
   `AxiosError: Network Error` — while preflight-free requests such as
   GET /api/health kept working, which made it look like an upload bug. */
const BASE_ORIGINS = [
  "https://bluconnetmedia.com",
  "https://www.bluconnetmedia.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];
const allowed = Array.from(
  new Set(
    BASE_ORIGINS.concat(
      (process.env.FRONTEND_ORIGIN || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  )
);
console.log("[cors] allowed origins:", allowed.join(", "));
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowed.includes("*") || allowed.includes(origin)) {
        return cb(null, true);
      }
      return cb(null, false);
    },
    credentials: true,
  })
);

/* Debug: log request method + path + origin + status + duration for the
   upload + news endpoints only (no UI change — purely diagnostic). */
app.use((req, res, next) => {
  if (req.path.startsWith("/api/upload") ||
      req.path.startsWith("/api/news") ||
      req.path.startsWith("/api/admin/news")) {
    const start = Date.now();
    const origEnd = res.end;
    res.end = function (...args) {
      res.end = origEnd;
      const ms = Date.now() - start;
      console.log(
        `[diag] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms` +
        (req.headers.origin ? ` origin=${req.headers.origin}` : "") +
        (req.headers["user-agent"] ? ` ua=${req.headers["user-agent"].slice(0, 60)}` : "")
      );
      return res.end.apply(res, args);
    };
  }
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(globalLimiter);

/* ---------------- static uploads ---------------- */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), { maxAge: "7d" })
);

/* ---------------- routes ---------------- */
app.set("trust proxy", 1);

app.get("/health", (req, res) =>
  res.json({ ok: true, service: "bluconnet-ai-backend", time: new Date().toISOString() })
);
app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "bluconnet-ai-backend", time: new Date().toISOString() })
);
app.use("/api", apiRoutes);

/* ---------------- 404 + errors ---------------- */
app.use((req, res) => res.status(404).json({ ok: false, error: "Not found" }));
app.use((err, req, res, next) => {
  console.error("[error]", err.message);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ ok: false, error: "File too large (max 5MB)" });
  }
  if (err instanceof multer.MulterError) {
    const msg = err.code === "LIMIT_FILE_SIZE"
      ? "File too large (max 5MB)"
      : `Upload rejected: ${err.message}`;
    console.error("[upload-error]", msg);
    return res.status(400).json({ ok: false, error: msg });
  }
  if (err.type === "entity.parse.failed" || err.status === 400) {
    return res.status(400).json({ ok: false, error: err.message || "Bad request" });
  }
  res.status(err.status || 500).json({ ok: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ BluConnet AI backend running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
});

