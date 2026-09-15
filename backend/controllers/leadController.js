/**
 * ============================================================
 *  Lead Controller — Advanced CRM operations
 *   - Search leads by name, email, phone, company
 *   - Filter by date, service, country, language, status
 *   - Update lead details & status
 *   - Delete leads
 *   - Get lead with full chat history
 * ============================================================
 */
const db = require("../config/database");
const { sanitize } = require("../middleware/validate");

/* ---------------- search & filter leads ---------------- */
exports.searchLeads = (req, res) => {
  const { q, status, country, service, lang, dateFrom, dateTo } = req.query;
  let leads = db.read("leads");

  // Text search
  if (q) {
    const query = q.toLowerCase();
    leads = leads.filter((l) => {
      return (
        (l.name || "").toLowerCase().includes(query) ||
        (l.email || "").toLowerCase().includes(query) ||
        (l.phone || "").includes(query) ||
        (l.company || "").toLowerCase().includes(query) ||
        (l.requirements || "").toLowerCase().includes(query)
      );
    });
  }

  // Filters
  if (status) leads = leads.filter((l) => l.status === status);
  if (country) leads = leads.filter((l) => (l.country || "").toLowerCase().includes(country.toLowerCase()));
  if (service) leads = leads.filter((l) => (l.service || "").toLowerCase().includes(service.toLowerCase()));
  if (lang) leads = leads.filter((l) => l.lang === lang);

  // Date range
  if (dateFrom) {
    const from = new Date(dateFrom).getTime();
    leads = leads.filter((l) => new Date(l.createdAt).getTime() >= from);
  }
  if (dateTo) {
    const to = new Date(dateTo).getTime() + 86400000; // end of day
    leads = leads.filter((l) => new Date(l.createdAt).getTime() <= to);
  }

  return res.json({ ok: true, data: leads, total: leads.length });
};

/* ---------------- get single lead with chat history ---------------- */
exports.getLeadWithHistory = (req, res) => {
  const { id } = req.params;
  const lead = db.findById("leads", id);
  if (!lead) return res.status(404).json({ ok: false, error: "Lead not found" });

  // Find related chat sessions (by explicit link OR by sessionId reference)
  const sessions = db.read("sessions");
  const relatedSessions = sessions.filter(
    (s) => s.leadId === lead.id || (lead.sessionId && s.sessionId === lead.sessionId)
  );

  return res.json({
    ok: true,
    data: {
      ...lead,
      chatHistory: relatedSessions,
    },
  });
};

/* ---------------- update lead (full edit) ---------------- */
exports.updateLead = (req, res) => {
  const { id } = req.params;
  const body = req.body || {};

  const lead = db.findById("leads", id);
  if (!lead) return res.status(404).json({ ok: false, error: "Lead not found" });

  // Only update allowed fields
  const allowedFields = [
    "name", "email", "phone", "company", "country", "budget",
    "requirements", "service", "status", "notes", "meetingDate",
    "meetingTime", "timezone"
  ];

  const patch = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      patch[field] = sanitize(body[field], field === "requirements" ? 3000 : 200);
    }
  });

  patch.updatedAt = new Date().toISOString();
  const updated = db.update("leads", id, patch);
  return res.json({ ok: true, data: updated });
};

/* ---------------- delete lead ---------------- */
exports.deleteLead = (req, res) => {
  const { id } = req.params;
  const leads = db.read("leads");
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: "Lead not found" });

  leads.splice(idx, 1);
  db.write("leads", leads);
  return res.json({ ok: true });
};

/* ---------------- bulk delete ---------------- */
exports.bulkDelete = (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ ok: false, error: "ids array required" });
  }

  const leads = db.read("leads");
  const filtered = leads.filter((l) => !ids.includes(l.id));
  db.write("leads", filtered);

  return res.json({ ok: true, deleted: leads.length - filtered.length });
};

/* ---------------- get lead statistics ---------------- */
exports.getStats = (req, res) => {
  const leads = db.read("leads");
  const meetings = db.read("meetings");

  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    closed: leads.filter((l) => l.status === "closed").length,
    updated: leads.filter((l) => l.status === "updated").length,
    totalMeetings: meetings.length,
    upcomingMeetings: meetings.filter((m) => m.status === "new").length,
    byCountry: {},
    byService: {},
    byStatus: {},
  };

  // Group by country
  leads.forEach((l) => {
    const c = l.country || "Unknown";
    stats.byCountry[c] = (stats.byCountry[c] || 0) + 1;
  });

  // Group by service
  leads.forEach((l) => {
    const s = l.service || "General";
    stats.byService[s] = (stats.byService[s] || 0) + 1;
  });

  // Group by status
  leads.forEach((l) => {
    const s = l.status || "new";
    stats.byStatus[s] = (stats.byStatus[s] || 0) + 1;
  });

  return res.json({ ok: true, data: stats });
};

/* ---------------- add note to lead ---------------- */
exports.addNote = (req, res) => {
  const { id } = req.params;
  const { note } = req.body || {};

  const lead = db.findById("leads", id);
  if (!lead) return res.status(404).json({ ok: false, error: "Lead not found" });

  const notes = lead.notes ? `${lead.notes}\n[${new Date().toLocaleString()}] ${sanitize(note, 1000)}` : `[${new Date().toLocaleString()}] ${sanitize(note, 1000)}`;

  const updated = db.update("leads", id, { notes, updatedAt: new Date().toISOString() });
  return res.json({ ok: true, data: updated });
};