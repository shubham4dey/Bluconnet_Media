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

const PROD_ORIGINS = [
  "https://bluconnetmedia.com",
  "https://www.bluconnetmedia.com",
];
const allowed = (process.env.FRONTEND_ORIGIN || PROD_ORIGINS.join(","))
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
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
  res.status(err.status || 500).json({ ok: false, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ BluConnet AI backend running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
});

