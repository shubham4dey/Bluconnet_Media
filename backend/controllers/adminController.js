/**
 * ============================================================
 *  Admin controller — login, dashboard aggregates & analytics,
 *  collection listings, CSV export, settings (webhook/CRM/…).
 * ============================================================
 */
const db = require("../config/database");
const { issueToken } = require("../middleware/auth");
const { sanitize } = require("../middleware/validate");

const COLLECTIONS = ["leads", "meetings", "applications", "handoffs", "feedback", "sessions", "visitors"];

/* ---------------- auth ---------------- */
exports.login = (req, res) => {
  const { username, password } = req.body || {};
  const user = sanitize(username, 60);
  const pass = sanitize(password, 120);
  if (
    user !== (process.env.ADMIN_USER || "bluconnetnews") ||
    pass !== (process.env.ADMIN_PASS || "bluconnetmedia@2026")
  ) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }
  return res.json({ ok: true, token: issueToken() });
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

function csvEscape(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

exports.exportCsv = (req, res) => {
  const { collection } = req.params;
  const cols = CSV_COLUMNS[collection];
  if (!cols) return res.status(400).json({ ok: false, error: "Unknown collection" });
  const rows = db.read(collection);
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
  if (body.webhookUrl !== undefined) settings.webhookUrl = sanitize(body.webhookUrl, 300);
  if (body.crmWebhookUrl !== undefined) settings.crmWebhookUrl = sanitize(body.crmWebhookUrl, 300);
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

