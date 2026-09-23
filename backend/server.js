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
const mysql = require("./config/mysql");
const contacts = require("./models/contactModel");
const newsModel = require("./models/newsModel");
const { globalLimiter } = require("./middleware/rateLimit");
const cloudinary = require("./services/cloudinary");
const newsImage = require("./services/newsImage");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

db.ensure();

/* Contact-form submissions live in MySQL (the JSON store keeps serving the
   chatbot collections). Bootstrap the `contacts` schema on every boot, but
   never let an unavailable database take the rest of the API down — the
   failure is logged and POST /api/contact answers with a clean 500 until
   MySQL is reachable (`npm run migrate` re-applies the schema manually). */
contacts
  .ensureSchema()
  .then(() =>
    console.log(`[mysql] ${mysql.describeTarget()} — \`${contacts.TABLE}\` table ready`)
  )
  .catch((err) =>
    console.error(
      `[mysql] contacts schema unavailable (${mysql.safeError(err)}) — run \`npm run migrate\` once MySQL is up`
    )
  );

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
/* Hosts that are always trusted, whatever the scheme (http/https) or port.
   An exact-string origin comparison is brittle: the very same site can appear
   as "https://bluconnetmedia.com", "https://www.bluconnetmedia.com" or — when
   a visitor lands on plain HTTP — "http://bluconnetmedia.com". Any origin that
   does not match exactly is rejected, the browser then blocks the response and
   the console reports a CORS error (e.g. on /api/visitor/heartbeat). Matching
   on hostname instead removes that whole class of failure. */
const ALLOWED_HOSTS = new Set(["bluconnetmedia.com", "www.bluconnetmedia.com"]);
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

function isAllowedOrigin(origin) {
  if (!origin) return true; // same-origin / non-browser caller
  if (allowed.includes("*") || allowed.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    if (ALLOWED_HOSTS.has(host)) return true; // apex + www, any scheme/port
    if (host.endsWith(".bluconnetmedia.com")) return true; // any subdomain
    if (LOCAL_HOSTS.has(host)) return true; // local development
  } catch (e) {
    /* malformed Origin header -> reject */
  }
  return false;
}

console.log(
  "[cors] allowed origins:",
  allowed.join(", "),
  "+ any scheme/port/subdomain of bluconnetmedia.com"
);
app.use(
  cors({
    origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
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

/* ---------------- static uploads (legacy only) ----------------
   News images are served from Cloudinary, NOT from here: this folder is
   wiped by Render on every restart/redeploy. Static serving is kept only so
   old `/uploads/...` references still resolve until they are migrated. */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), { maxAge: "7d" })
);

/* ---------------- routes ---------------- */
app.set("trust proxy", 1);

/* Health + storage diagnostics. `news` reports where articles and images are
   actually stored (no secrets) so production can be verified with one request:
     store.durable      → true = articles are in MySQL (survive a redeploy)
     store.requireDb    → true = a failed MySQL write is reported as an error
     images.configured  → Cloudinary credentials present on this service      */
const health = (req, res) =>
  res.json({
    ok: true,
    service: "bluconnet-ai-backend",
    time: new Date().toISOString(),
    news: {
      store: {
        durable: newsModel.isDurable(),
        table: newsModel.TABLE,
        requireDb: newsModel.status().requireDb,
      },
      images: {
        configured: cloudinary.isConfigured(),
        cloud: cloudinary.cloudName(),
        folder: cloudinary.NEWS_FOLDER,
      },
    },
  });

app.get("/health", health);
app.get("/api/health", health);
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

/* ---------------- permanent News storage on boot ----------------
   Articles live in MySQL (`news` table) with `backend/data/news.json` as a
   local read mirror; images live on Cloudinary. The order below matters:

     1. create/verify the news schema (idempotent, same SQL as `npm run migrate`)
     2. upgrade legacy image references (local `/uploads/...` paths Render has
        already wiped, inline base64) to permanent Cloudinary assets
     3. import mirror articles MySQL does not have yet — INSERT IGNORE on the
        primary key, so no duplicate and no overwrite ever happens
     4. hydrate the mirror from MySQL, so the public API serves the database

   Every step is independent and best-effort: a failure is logged and the API
   keeps answering with whatever the mirror holds. */
console.log(`[cloudinary] ${cloudinary.describe()}`);

async function bootstrapNews() {
  try {
    const schema = await newsModel.ensureSchema();
    console.log(`[news] storage : MySQL \`${schema.table}\` via ${schema.target}`);
  } catch (err) {
    console.error(
      `[news] MySQL unavailable (${mysql.safeError(err)}) — articles are kept in the local mirror only ` +
        "until the database is reachable (check the NAMECHEAP_SSH_* / MYSQL_* variables)"
    );
    return;
  }

  try {
    const report = await newsImage.migrateNewsImages({ allowRemote: false });
    if (report.migrated) {
      console.log(
        `[cloudinary] migrated ${report.migrated} legacy news image(s) (scanned=${report.scanned}, unmigrated=${report.unmigrated})`
      );
    } else if (report.unmigrated) {
      console.warn(
        `[cloudinary] ${report.unmigrated} news image(s) could not be migrated automatically — re-upload them from the Admin panel`
      );
    }
  } catch (err) {
    console.error(`[cloudinary] news image migration skipped (${err.message})`);
  }

  try {
    const report = await newsModel.hydrate();
    console.log(
      `[news] articles: ${report.articles} stored in MySQL ` +
        `(imported=${report.imported}, recovered=${report.seeded}, importFailed=${report.importFailed}, mirrorOnly=${report.kept})`
    );
  } catch (err) {
    console.error(`[news] mirror hydration skipped (${err.message})`);
  }

  /* Optional: keep the local mirror in step with MySQL when something else
     writes to the table (multi-instance / manual SQL). Disabled by default —
     a single instance always mirrors its own writes. */
  const refreshMs = Number(process.env.NEWS_DB_REFRESH_MS || 0) || 0;
  if (refreshMs > 0) {
    setInterval(() => {
      newsModel
        .refreshFromDb()
        .catch((err) => console.error(`[news] mirror refresh skipped (${err.message})`));
    }, refreshMs).unref();
  }
}

bootstrapNews();

app.listen(PORT, () => {
  console.log(`✅ BluConnet AI backend running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
});

