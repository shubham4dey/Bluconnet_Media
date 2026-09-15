/**
 * ============================================================
 *  Chat session controller — stores full conversation history
 *  so the admin dashboard can review every chat + analytics.
 *
 *  Enhanced: Links chat sessions to leads for complete history.
 * ============================================================
 */
const db = require("../config/database");
const { sanitize } = require("../middleware/validate");

exports.saveSession = (req, res) => {
  const body = req.body || {};
  const sessionId = sanitize(body.sessionId, 64);
  if (!sessionId) {
    return res.status(400).json({ ok: false, error: "sessionId required" });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-200) : [];
  const transcript = messages.map((m) => ({
    role: m.role === "user" ? "user" : "bot",
    text: sanitize(m.text, 4000),
    at: m.at ? String(m.at).slice(0, 32) : new Date().toISOString(),
  }));

  const existing = db.read("sessions").find((s) => s.sessionId === sessionId);
  const payload = {
    sessionId,
    page: sanitize(body.page, 200),
    lang: sanitize(body.lang, 8) || "en",
    country: sanitize(body.country, 80),
    device: sanitize(body.device, 40),
    browser: sanitize(body.browser, 60),
    messageCount: transcript.length,
    intents: Array.isArray(body.intents) ? body.intents.slice(0, 50).map((i) => sanitize(i, 60)) : [],
    durationSec: Math.min(Number(body.durationSec) || 0, 86400),
    messages: transcript,
    leadId: sanitize(body.leadId, 64) || null,
    ip: body.ip || "",
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    db.update("sessions", existing.id, payload);
  } else {
    db.insert("sessions", payload);
  }

  // If linked to a lead, update lead with session reference
  if (payload.leadId) {
    const leads = db.read("leads");
    const leadIdx = leads.findIndex((l) => l.id === payload.leadId);
    if (leadIdx >= 0) {
      leads[leadIdx].sessionId = sessionId;
      leads[leadIdx].updatedAt = new Date().toISOString();
      db.write("leads", leads);
    }
  }

  return res.json({ ok: true });
};

/* ---------------- get session by ID ---------------- */
exports.getSession = (req, res) => {
  const { sessionId } = req.params;
  const session = db.read("sessions").find((s) => s.sessionId === sanitize(sessionId, 64));
  if (!session) return res.status(404).json({ ok: false, error: "Session not found" });
  return res.json({ ok: true, data: session });
};

/* ---------------- get sessions by lead ID ---------------- */
exports.getSessionsByLead = (req, res) => {
  const { leadId } = req.params;
  const sessions = db.read("sessions").filter((s) => s.leadId === sanitize(leadId, 64) || s.sessionId === sanitize(leadId, 64));
  return res.json({ ok: true, data: sessions });
};
