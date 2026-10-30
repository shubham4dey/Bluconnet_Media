/**
 * ============================================================
 *  Admin controller — login, dashboard aggregates & analytics,
 *  collection listings, CSV export, settings (webhook/CRM/…).
 * ============================================================
 */
const crypto = require("crypto");
const db = require("../config/database");
const { issueToken, revokeToken, readBearer } = require("../middleware/auth");
const { sanitize, isPublicHttpUrl } = require("../middleware/validate");

const COLLECTIONS = ["leads", "meetings", "applications", "handoffs", "feedback", "sessions", "visitors"];

/* ---------------- auth ---------------- */

/**
 * Length-safe constant-time string comparison: both sides are hashed first, so
 * the comparison never leaks the password length (and never short-circuits on
 * the first differing character).
 */
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a), "utf8").digest();
  const hb = crypto.createHash("sha256").update(String(b), "utf8").digest();
  return crypto.timingSafeEqual(ha, hb);
}

exports.login = (req, res) => {
  const { username, password, role } = req.body || {};
  const user = sanitize(username, 60);
  const pass = sanitize(password, 120);

  /* SECURITY: no built-in fallback credentials. Previously an unset
     ADMIN_USER / ADMIN_PASS silently fell back to a well-known user/password
     that is public in the repository and in the shipped frontend bundle, so
     anyone could mint an admin token. Missing configuration now fails closed. */
  const expectedUser = String(process.env.ADMIN_USER || "").trim();
  const expectedPass = String(process.env.ADMIN_PASS || "");
  if (!expectedUser || !expectedPass) {
    console.error(
      "[admin] ADMIN_USER / ADMIN_PASS are not configured — admin login refused (set both in the environment)"
    );
    return res.status(503).json({ ok: false, error: "Admin login is not configured" });
  }

  // Per-username throttle (temporary safeguard). Missing usernames are skipped
  // so no state is created for anonymous/blank submissions.
  const rl = require("../middleware/rateLimit");
  const normalizeUsername = rl.normalizeUsername || ((v) => String(v || "").trim().toLowerCase());
  const throttleKey = normalizeUsername(user);
  if (throttleKey) {
    const locked = typeof rl.isUsernameLocked === "function" ? rl.isUsernameLocked(throttleKey) : false;
    if (locked) {
      const retryAfter = typeof rl.getRetryAfter === "function" ? rl.getRetryAfter(throttleKey) : 0;
      if (retryAfter > 0) {
        if (typeof res.setHeader === "function") res.setHeader("Retry-After", String(retryAfter));
        if (res.headers && typeof res.headers === "object") res.headers["retry-after"] = String(retryAfter);
        else res.headers = { "retry-after": String(retryAfter) };
        res.retryAfter = retryAfter;
      }
      return res.status(429).json({
        ok: false,
        error: "Too many login attempts. Try later.",
        retryAfter,
      });
    }
  }

  const userOk = safeEqual(user, expectedUser);
  const passOk = safeEqual(pass, expectedPass);
  if (!userOk || !passOk) {
    console.warn(
      `[admin] failed login attempt from ${(req && req.ip) || "unknown ip"}`
    );
    if (throttleKey && typeof rl.recordLoginFailure === "function") {
      const entry = rl.recordLoginFailure(throttleKey);
      const lockedUntil = entry && Number(entry.lockedUntil) ? Number(entry.lockedUntil) : 0;
      if (lockedUntil > Date.now()) {
        const retryAfter = Math.max(1, Math.ceil((lockedUntil - Date.now()) / 1000));
        if (typeof res.setHeader === "function") res.setHeader("Retry-After", String(retryAfter));
        if (res.headers && typeof res.headers === "object") res.headers["retry-after"] = String(retryAfter);
        else res.headers = { "retry-after": String(retryAfter) };
        res.retryAfter = retryAfter;
        return res.status(429).json({
          ok: false,
          error: "Too many login attempts. Try later.",
          retryAfter,
        });
      }
    }
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }
  // Successful login resets any prior failure state for this username.
  if (throttleKey && typeof rl.clearLoginFailures === "function") {
    rl.clearLoginFailures(throttleKey);
  }
  // Default role to super_admin if not specified; allow override via body
  const userRole = String(role || "super_admin").trim() || "super_admin";
  return res.json({ ok: true, token: issueToken(userRole) });
};

/* Logout — the presented token is dropped straight away instead of staying
   valid for the rest of its 12h TTL. */
exports.logout = (req, res) => {
  const revoked = revokeToken(readBearer(req));
  return res.json({ ok: true, revoked });
};

/* ---------------- helpers ---------------- */
function countToday(rows) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return rows.filter((r) => new Date(r.createdAt).getTime() >= start.getTime()).length;
}

function lastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en", { day: "numeric", month: "short" }),
    });
  }
  return days;
}

/* ---------------- dashboard aggregates ---------------- */
exports.dashboard = (req, res) => {
  const leads = db.read("leads");
  const meetings = db.read("meetings");
  const applications = db.read("applications");
  const handoffs = db.read("handoffs");
  const feedback = db.read("feedback");
  const sessions = db.read("sessions");
  const visitors = db.read("visitors");

  const now = Date.now();
  const liveVisitors = visitors.filter(
    (v) => now - new Date(v.lastSeen).getTime() < 90 * 1000
  );

  // messages per day (last 14 days)
  const messagesPerDay = lastNDays(14).map((d) => {
    let messages = 0;
    let chats = 0;
    sessions.forEach((s) => {
      if (String(s.updatedAt || s.createdAt).slice(0, 10) === d.key) {
        messages += s.messageCount || 0;
        chats += 1;
      }
    });
    return { ...d, messages, chats };
  });

  // intent distribution
  const intentMap = {};
  sessions.forEach((s) =>
    (s.intents || []).forEach((i) => {
      intentMap[i] = (intentMap[i] || 0) + 1;
    })
  );
  const intents = Object.entries(intentMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // popular questions (top repeated user messages)
  const qMap = {};
  sessions.forEach((s) =>
    (s.messages || []).forEach((m) => {
      if (m.role !== "user" || m.text.length < 4) return;
      const key = m.text.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, "").trim().slice(0, 60);
      if (!key) return;
      qMap[key] = qMap[key] || { question: m.text.slice(0, 80), count: 0 };
      qMap[key].count += 1;
    })
  );
  const popularQuestions = Object.values(qMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const likes = feedback.filter((f) => f.value === "up").length;
  const dislikes = feedback.filter((f) => f.value === "down").length;

  return res.json({
    ok: true,
    stats: {
      leads: leads.length,
      leadsToday: countToday(leads),
      meetings: meetings.length,
      applications: applications.length,
      handoffs: handoffs.length,
      chats: sessions.length,
      messages: sessions.reduce((s, x) => s + (x.messageCount || 0), 0),
      liveVisitors: liveVisitors.length,
      likes,
      dislikes,
      satisfaction: likes + dislikes ? Math.round((likes / (likes + dislikes)) * 100) : null,
    },
    liveVisitors: liveVisitors.slice(0, 50),
    messagesPerDay,
    intents,
    popularQuestions,
  });
};

/* ---------------- collections ---------------- */
exports.listCollection = (req, res) => {
  const { collection } = req.params;
  if (!COLLECTIONS.includes(collection)) {
    return res.status(400).json({ ok: false, error: "Unknown collection" });
  }
  const rows = db.read(collection);
  // sessions list view strips transcripts; ?full=1 keeps them
  const wantFull = collection === "sessions" && req.query.full === "1";
  const data =
    collection === "sessions" && !wantFull
      ? rows.map(({ messages, ...rest }) => ({ ...rest, hasTranscript: (messages || []).length > 0 }))
      : rows;
  return res.json({ ok: true, data });
};


exports.updateRecord = (req, res) => {
  const { collection, id } = req.params;
  if (!COLLECTIONS.includes(collection)) {
    return res.status(400).json({ ok: false, error: "Unknown collection" });
  }
  const patch = {};
  if (req.body && req.body.status) patch.status = sanitize(req.body.status, 30);
  const updated = db.update(collection, id, patch);
  if (!updated) return res.status(404).json({ ok: false, error: "Not found" });
  return res.json({ ok: true, data: updated });
};

/* ---------------- delete record ---------------- */
exports.deleteRecord = (req, res) => {
  const { collection, id } = req.params;
  if (!COLLECTIONS.includes(collection)) {
    return res.status(400).json({ ok: false, error: "Unknown collection" });
  }
  const rows = db.read(collection);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });

  rows.splice(idx, 1);
  db.write(collection, rows);
  return res.json({ ok: true });
};

/* ---------------- CSV export ---------------- */
const CSV_COLUMNS = {
  leads: ["createdAt", "name", "email", "phone", "company", "country", "budget", "requirements", "status"],
  meetings: ["createdAt", "name", "email", "phone", "date", "time", "timezone", "purpose", "status"],
  applications: ["createdAt", "name", "email", "phone", "role", "experience", "portfolio", "status"],
  handoffs: ["createdAt", "name", "email", "message", "reason", "status"],
  feedback: ["createdAt", "value", "messageText", "intent"],
  sessions: ["sessionId", "createdAt", "updatedAt", "page", "lang", "device", "messageCount", "durationSec", "intents"],
  visitors: ["sessionId", "firstSeen", "lastSeen", "page", "device"],
};

/* SECURITY: CSV / formula injection. Excel and Google Sheets execute a cell that
   starts with `=`, `+`, `-`, `@` (or a tab/CR) as a formula, and these columns
   are visitor-submitted (name, email, requirements, …) while the file is opened
   by an admin — so a risky cell is prefixed with a single quote (the standard
   mitigation) instead of being exported as-is. */
const FORMULA_LEAD = /^[=+\-@\t\r]/;

function csvEscape(v) {
  let s = v === null || v === undefined ? "" : String(v);
  if (FORMULA_LEAD.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

exports.exportCsv = (req, res) => {
  const { collection } = req.params;
  const cols = CSV_COLUMNS[collection];
  if (!cols) return res.status(400).json({ ok: false, error: "Unknown collection" });

  /* ── Pagination ────────────────────────────────────────────────────────── */
  // Default 100, hard max 500; non‑positive or non‑integer → default 100
  let limit = Number(req.query.limit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) limit = 100;

  // Default page 1; page must be an integer >= 1
  const page = Number(req.query.page);
  const skip = Number.isInteger(page) && page >= 1 ? (page - 1) * limit : 0;

  const allRows = db.read(collection);
  const rows = allRows.slice(skip).slice(0, limit); // at most `limit` records starting at `skip`
  /* └──────────────────────────────────────────────────────────────────────── */

  const header = cols.join(",");
  const body = rows
    .map((r) => cols.map((c) => csvEscape(Array.isArray(r[c]) ? r[c].join(" | ") : r[c])).join(","))
    .join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="bluconnet-${collection}-${new Date().toISOString().slice(0, 10)}.csv"`
  );
  return res.send(`\uFEFF${header}\n${body}`);
};

/* ---------------- settings ---------------- */
exports.getSettings = (req, res) => {
  const settings = db.read("settings");
  return res.json({
    ok: true,
    data: {
      webhookUrl: settings.webhookUrl || "",
      crmWebhookUrl: settings.crmWebhookUrl || "",
      emailNotify: settings.emailNotify !== false,
    },
  });
};

exports.updateSettings = (req, res) => {
  const settings = db.read("settings");
  const body = req.body || {};

  /* SECURITY: these URLs are fetched by services/notify.js FROM THIS SERVER, so
     only public https targets are accepted — otherwise the setting is an SSRF
     primitive (internal services, cloud metadata) rather than a webhook. */
  const urls = {};
  ["webhookUrl", "crmWebhookUrl"].forEach((field) => {
    if (body[field] === undefined) return;
    const raw = sanitize(body[field], 300);
    if (!raw) {
      urls[field] = "";
      return;
    }
    const safe = isPublicHttpUrl(raw, { requireHttps: true });
    urls[field] = safe === null ? undefined : safe;
  });

  if (urls.webhookUrl === undefined || urls.crmWebhookUrl === undefined) {
    return res.status(400).json({
      ok: false,
      error: "Webhook URLs must be public https:// URLs",
    });
  }

  if (body.webhookUrl !== undefined) settings.webhookUrl = urls.webhookUrl;
  if (body.crmWebhookUrl !== undefined) settings.crmWebhookUrl = urls.crmWebhookUrl;
  if (body.emailNotify !== undefined) settings.emailNotify = !!body.emailNotify;
  db.write("settings", settings);
  return res.json({
    ok: true,
    data: {
      webhookUrl: settings.webhookUrl,
      crmWebhookUrl: settings.crmWebhookUrl,
      emailNotify: settings.emailNotify,
    },
  });
};

/* csvEscape is exported for the test suite only (no route uses it directly). */
exports._csvEscape = csvEscape;

