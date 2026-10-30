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
const subscribers = require("./models/subscriberModel");
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

/* Newsletter subscriptions live in MySQL (`subscribers` table, migration 002).
   Bootstrap it on every boot with the same best-effort pattern as `contacts`:
   a missing/unreachable database must never take the API down — the model
   self-heals on first write and POST /api/subscribe answers a clean 500
   until MySQL is reachable (`npm run migrate` re-applies the schema). */
subscribers
  .ensureSchema()
  .then(() =>
    console.log(`[mysql] ${mysql.describeTarget()} — \`${subscribers.TABLE}\` table ready`)
  )
  .catch((err) =>
    console.error(
      `[mysql] subscribers schema unavailable (${mysql.safeError(err)}) — run \`npm run migrate\` once MySQL is up`
    )
  );

/* ---------------- security & parsing ---------------- */
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  /* Added hardening (OWASP secure-headers set):
     • HSTS — the API is only reachable over HTTPS, so browsers are pinned to it.
     • This app answers JSON (plus legacy /uploads images), never HTML, so the
       strictest CSP is safe here: nothing may be loaded, framed or scripted.
     • Cross-Origin-Resource-Policy stays `cross-origin` on purpose: the site
       (bluconnetmedia.com) loads the legacy /uploads images from this origin. */
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"
  );
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()"
  );
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
];

/* SECURITY (M1): the dev-only origins are NEVER allowed once NODE_ENV is
   "production". With `credentials: true` an allowed origin can read every
   response AND have the browser attach cookies to cross-site requests, so a
   permissive list here is a real data-exposure hole: any local service or
   attacker-hosted page on `http://localhost:*` used to be trusted by the
   deployed API. Production deployments must therefore name their own origins
   explicitly through FRONTEND_ORIGIN (comma separated). */
const IS_PRODUCTION = String(process.env.NODE_ENV || "").toLowerCase() === "production";
const DEV_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

const allowed = Array.from(
  new Set(
    BASE_ORIGINS.concat(IS_PRODUCTION ? [] : DEV_ORIGINS).concat(
      (process.env.FRONTEND_ORIGIN || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  )
);
/* The ONLY hosts trusted in PRODUCTION: the official apex + www. Arbitrary
   subdomains of bluconnetmedia.com are deliberately NOT trusted there — a
   dangling / attacker-controlled subdomain must not be able to make
   credentialed cross-origin requests. In DEVELOPMENT the same hosts are
   accepted on any scheme/port (apex, www or a subdomain) so a visitor landing
   on plain HTTP — or a preview host — is not hit by the brittle exact-origin
   mismatch that surfaces as a CORS error (e.g. on /api/visitor/heartbeat).
   LOCAL_HOSTS is development-only. Any other real origin must be named in
   FRONTEND_ORIGIN. */
const ALLOWED_HOSTS = new Set(["bluconnetmedia.com", "www.bluconnetmedia.com"]);
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

function isAllowedOrigin(origin) {
  if (!origin) return true; // same-origin / non-browser caller (curl, monitoring)
  if (allowed.includes("*") || allowed.includes(origin)) return true;
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();

    /* SECURITY: in PRODUCTION ONLY the official apex + www hosts are trusted,
       and only over HTTPS. `anything.bluconnetmedia.com` is NOT automatically
       allowed — a subdomain is a different origin, and with `credentials: true`
       an attacker-controlled (or dangling-DNS) subdomain could otherwise read
       authenticated responses and drive authenticated requests. */
    if (IS_PRODUCTION) {
      return ALLOWED_HOSTS.has(host) && url.protocol === "https:";
    }

    /* DEVELOPMENT only: the site on any scheme/port (apex, www or a subdomain).
       This branch is unreachable in production (the branch above returns). */
    if (ALLOWED_HOSTS.has(host) || host.endsWith(".bluconnetmedia.com")) return true;
    if (LOCAL_HOSTS.has(host)) return true;
  } catch (e) {
    /* malformed Origin header -> reject */
  }
  return false;
}

console.log(
  "[cors] allowed origins:",
  allowed.join(", "),
  IS_PRODUCTION
    ? "+ HTTPS apex/www of bluconnetmedia.com only (subdomains + localhost rejected in production)"
    : "+ any scheme/port on bluconnetmedia.com + localhost (development)"
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

/* Health endpoint: public responses report only minimal operational status.
   Detailed storage diagnostics name the database target and last connection
   error, but those stay available for operations only. As soon as a HEALTH_TOKEN
   is configured, the detail requires that token (`x-health-token: <token>`),
   so the endpoint no longer publishes infrastructure identifiers to anonymous
   callers. With no HEALTH_TOKEN configured the endpoint fails closed and never
   exposes details, so existing monitoring (which relies on the minimal public
   fields) keeps working unchanged. */
const health = (req, res) => {
  /* SECURITY: public responses report only minimal operational status.
     Detailed storage diagnostics name the database target and last connection
     error, but those stay available for operations only. As soon as a
     HEALTH_TOKEN is configured, the detail requires that token
     (`x-health-token: <token>`), so the endpoint no longer publishes
     infrastructure identifiers to anonymous callers. With no HEALTH_TOKEN set
     the endpoint fails closed and never exposes details; normal monitoring
     keeps working unchanged. */
  const healthToken = String(process.env.HEALTH_TOKEN || "");
  const authorized =
    healthToken !== "" && (req.headers["x-health-token"] || "") === healthToken;

  const store = {
    durable: newsModel.isDurable(),
    mirror: newsModel.status().mirror,
    requireDb: newsModel.status().requireDb,
  };

  const images = { configured: cloudinary.isConfigured() };
  if (authorized) {
    const s = newsModel.status();
    store.target = s.target;
    store.connect = s.connect;
    images.cloud = cloudinary.cloudName();
    images.folder = cloudinary.NEWS_FOLDER;
  }

  return res.json({
    ok: true,
    service: "bluconnet-ai-backend",
    time: new Date().toISOString(),
    news: { store, images },
  });
};

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

/* ---------------- permanent News storage on boot ----------------
   Articles live in MySQL (`news` table) with `backend/data/news.json` as a
   local read mirror; images live on Cloudinary. The order below matters:

     1. create/verify the news schema (idempotent, same SQL as `npm run migrate`)
     2. upgrade legacy image references (local `/uploads/...` paths Render has
        already wiped, inline base64) to permanent Cloudinary assets
     3. import mirror articles MySQL does not have yet — INSERT IGNORE on the
        primary key, so no duplicate and no overwrite ever happens
     4. hydrate the mirror from MySQL, so the public API serves the database

   Every step is independent and best-effort, and the whole sequence is
   IDEMPOTENT, so it is safe to re-run.

   The first attempt is retried a few times because the FIRST connection of an
   instance is the fragile one: a cold start plus the Namecheap SSH handshake
   (66.29.132.129:21098) has to finish before the forwarded socket can carry
   MySQL traffic. Previously that single attempt was the only one ever made —
   when it lost that race the instance served an empty mirror for its entire
   lifetime (news pages showed "coming soon" while the rows sat in MySQL).
   A watchdog then keeps the store honest for as long as the instance lives. */

const BOOT_RETRY_MS = Number(process.env.NEWS_BOOT_RETRY_MS || 5000) || 5000;
const BOOT_RETRY_MAX = Number(process.env.NEWS_BOOT_RETRY_MAX || 6) || 6;
const WATCHDOG_MS = Number(process.env.NEWS_DB_REFRESH_MS || 60000) || 60000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let imagesReconciled = false;

/* Legacy image upgrade — runs once, only after MySQL is known to be usable. */
async function reconcileImages() {
  if (imagesReconciled) return;
  try {
    const report = await newsImage.migrateNewsImages({ allowRemote: false });
    imagesReconciled = true;
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
}

/** Connect to MySQL and sync the read mirror. Resolves true when durable. */
async function connectAndHydrate() {
  if (!newsModel.isDurable()) {
    const schema = await newsModel.ensureSchema();
    console.log(`[news] storage : MySQL \`${schema.table}\` via ${schema.target}`);
  }

  await reconcileImages();

  const report = await newsModel.hydrate();
  console.log(
    `[news] articles: ${report.articles} stored in MySQL ` +
      `(imported=${report.imported}, recovered=${report.seeded}, importFailed=${report.importFailed}, mirrorOnly=${report.kept}) ` +
      `— /api/news serves ${newsModel.status().mirror}`
  );
  return true;
}

async function bootstrapNews() {
  for (let attempt = 1; attempt <= BOOT_RETRY_MAX; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await connectAndHydrate();
      if (attempt > 1) {
        console.log(`[news] MySQL reachable on attempt ${attempt} — articles are live`);
      }
      break;
    } catch (err) {
      const last = attempt === BOOT_RETRY_MAX;
      console.error(
        `[news] MySQL connection attempt ${attempt}/${BOOT_RETRY_MAX} failed ` +
          `(${mysql.safeError(err)})${last ? " — giving up for now" : ` — retrying in ${BOOT_RETRY_MS / 1000}s`}`
      );
      if (last) {
        console.error(
          `[news] the public API now serves the local mirror (${newsModel.status().mirror} article(s)). ` +
            `Fix the database configuration — \`GET /api/health\` reports the resolved target, the tunnel state and the last error.`
        );
        break;
      }
      // eslint-disable-next-line no-await-in-loop
      await delay(BOOT_RETRY_MS);
    }
  }
}

/* Watchdog: self-heal a failed connection, then keep the mirror in step with
   MySQL. Both paths are idempotent and never delete an article that has not
   reached the database yet (see models/newsModel.js). */
function startNewsWatchdog() {
  const timer = setInterval(async () => {
    if (!newsModel.isDurable()) {
      try {
        await connectAndHydrate();
        console.log("[news] MySQL became reachable — articles are live again");
      } catch (err) {
        console.error(`[news] MySQL still unreachable (${mysql.safeError(err)})`);
      }
      return;
    }

    try {
      const report = await newsModel.refreshFromDb();
      if (report.skipped) {
        console.warn("[news] mirror refresh skipped — the store is not initialised yet");
      } else if (report.imported || report.kept) {
        console.log(
          `[news] mirror refreshed from MySQL (${report.fromDb} article(s), imported=${report.imported}, mirrorOnly=${report.kept})`
        );
      }
    } catch (err) {
      console.error(`[news] mirror refresh skipped (${mysql.safeError(err)})`);
    }
  }, WATCHDOG_MS);

  timer.unref();
}

bootstrapNews().then(startNewsWatchdog);

app.listen(PORT, () => {
  console.log(`✅ BluConnet AI backend running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
});

