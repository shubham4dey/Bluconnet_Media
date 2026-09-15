/**
 * ============================================================
 *  Submission controller — leads, meetings, job applications,
 *  live-chat handoffs and message feedback.
 *
 *  Enhanced for CRM:
 *   - Duplicate detection (email/phone)
 *   - Auto-capture: IP, device, browser, page URL, language
 *   - Customer confirmation emails
 *   - Complete conversation storage
 * ============================================================
 */
const db = require("../config/database");
const { validate } = require("../middleware/validate");
const { notifyAdmin, sendCustomerConfirmation } = require("../services/notify");

function ok(res, record) {
  return res.json({ ok: true, id: record.id });
}
function bad(res, errors) {
  return res.status(400).json({ ok: false, errors });
}

/* ---------------- helper: find duplicate lead ---------------- */
function findDuplicateLead(email, phone) {
  if (!email && !phone) return null;
  const leads = db.read("leads");
  return leads.find((l) => {
    if (email && l.email && l.email.toLowerCase() === email.toLowerCase()) return true;
    if (phone && l.phone && l.phone.replace(/\D/g, "") === phone.replace(/\D/g, "")) return true;
    return false;
  }) || null;
}

/* ---------------- helper: extract client info ---------------- */
function clientInfo(req) {
  return {
    ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "",
    userAgent: req.headers["user-agent"] || "",
    referrer: req.headers["referer"] || req.headers["referrer"] || "",
  };
}

/* ---------------- LEAD ---------------- */
exports.createLead = (req, res) => {
  const { ok: valid, data, errors } = validate(req.body, {
    name: { required: true, minLen: 2, label: "Name" },
    email: { required: true, email: true, label: "Email" },
    phone: { required: true, phone: true, label: "Phone" },
    company: { maxLen: 120 },
    country: { required: true, maxLen: 80, label: "Country" },
    budget: { maxLen: 80 },
    requirements: { required: true, minLen: 5, maxLen: 3000, label: "Requirements" },
    service: { maxLen: 120 },
    lang: { maxLen: 8 },
    sessionId: { maxLen: 64 },
    page: { maxLen: 300 },
    device: { maxLen: 60 },
    browser: { maxLen: 60 },
    website: { maxLen: 0 }, // honeypot — must be empty
  });
  if (!valid) return bad(res, errors);

  const info = clientInfo(req);
  const duplicate = findDuplicateLead(data.email, data.phone);

  if (duplicate) {
    // Update existing lead with new info
    const updated = db.update("leads", duplicate.id, {
      ...data,
      ip: info.ip,
      userAgent: info.userAgent,
      referrer: info.referrer,
      leadSource: data.leadSource || "AI Chat",
      status: "updated",
      updatedAt: new Date().toISOString(),
    });
    notifyAdmin("lead", { ...updated, isUpdate: true });
    return ok(res, updated);
  }

  const record = db.insert("leads", {
    ...data,
    ip: info.ip,
    userAgent: info.userAgent,
    referrer: info.referrer,
    leadSource: data.leadSource || "AI Chat",
    status: "new",
  });

  // Send notifications
  notifyAdmin("lead", record);
  sendCustomerConfirmation("lead", record);

  return ok(res, record);
};

/* ---------------- MEETING ---------------- */
exports.createMeeting = (req, res) => {
  const { ok: valid, data, errors } = validate(req.body, {
    name: { required: true, minLen: 2, label: "Name" },
    email: { required: true, email: true, label: "Email" },
    phone: { required: true, phone: true, label: "Phone" },
    date: { required: true, maxLen: 40, label: "Preferred date" },
    time: { required: true, maxLen: 40, label: "Preferred time" },
    timezone: { required: true, maxLen: 60, label: "Time zone" },
    // `purpose` OR `requirements` accepted (chatbot collects `requirements`)
    purpose: { maxLen: 1000 },
    requirements: { maxLen: 3000 },
    service: { maxLen: 120 },
    lang: { maxLen: 8 },
    sessionId: { maxLen: 64 },
    page: { maxLen: 300 },
    device: { maxLen: 60 },
    browser: { maxLen: 60 },
    website: { maxLen: 0 },
  });
  if (!valid) return bad(res, errors);
  // Union check: `purpose` OR `requirements` (chatbot collects `requirements`)
  data.purpose = String(data.purpose || data.requirements || "").trim();
  if (data.purpose.length < 3) return bad(res, ["Purpose is required"]);

  const info = clientInfo(req);

  // Check for duplicate meeting request
  const meetings = db.read("meetings");
  const duplicate = meetings.find(
    (m) => m.email?.toLowerCase() === data.email?.toLowerCase() && m.date === data.date && m.time === data.time
  );

  if (duplicate) {
    const updated = db.update("meetings", duplicate.id, {
      ...data,
      ip: info.ip,
      userAgent: info.userAgent,
      referrer: info.referrer,
      status: "rescheduled",
      updatedAt: new Date().toISOString(),
    });
    notifyAdmin("meeting", { ...updated, isUpdate: true });
    return ok(res, updated);
  }

  const record = db.insert("meetings", {
    ...data,
    ip: info.ip,
    userAgent: info.userAgent,
    referrer: info.referrer,
    leadSource: "AI Chat",
    status: "new",
  });

  notifyAdmin("meeting", record);
  sendCustomerConfirmation("meeting", record);

  return ok(res, record);
};

/* ---------------- APPLICATION ---------------- */
exports.createApplication = (req, res) => {
  const { ok: valid, data, errors } = validate(req.body, {
    name: { required: true, minLen: 2, label: "Name" },
    email: { required: true, email: true, label: "Email" },
    phone: { required: true, phone: true, label: "Phone" },
    role: { required: true, maxLen: 120, label: "Role" },
    experience: { required: true, maxLen: 60, label: "Experience" },
    portfolio: { maxLen: 500 },
    country: { maxLen: 80 },
    lang: { maxLen: 8 },
    sessionId: { maxLen: 64 },
    page: { maxLen: 300 },
    device: { maxLen: 60 },
    browser: { maxLen: 60 },
    website: { maxLen: 0 },
  });
  if (!valid) return bad(res, errors);

  const info = clientInfo(req);
  const record = db.insert("applications", {
    ...data,
    ip: info.ip,
    userAgent: info.userAgent,
    referrer: info.referrer,
    leadSource: "AI Chat",
    status: "new",
  });

  notifyAdmin("application", record);
  return ok(res, record);
};

/* ---------------- HANDOFF ---------------- */
exports.createHandoff = (req, res) => {
  const { ok: valid, data, errors } = validate(req.body, {
    name: { required: true, minLen: 2, label: "Name" },
    email: { required: true, email: true, label: "Email" },
    message: { required: true, minLen: 3, maxLen: 3000, label: "Message" },
    reason: { maxLen: 120 },
    lang: { maxLen: 8 },
    sessionId: { maxLen: 64 },
    page: { maxLen: 300 },
    device: { maxLen: 60 },
    browser: { maxLen: 60 },
    website: { maxLen: 0 },
  });
  if (!valid) return bad(res, errors);

  const info = clientInfo(req);
  const record = db.insert("handoffs", {
    ...data,
    ip: info.ip,
    userAgent: info.userAgent,
    referrer: info.referrer,
    leadSource: "AI Chat",
    status: "new",
  });

  notifyAdmin("handoff", record);
  return ok(res, record);
};

exports.createFeedback = (req, res) => {
  const { ok: valid, data } = validate(req.body, {
    value: { required: true, maxLen: 12, label: "Feedback" },
    messageId: { maxLen: 64 },
    messageText: { maxLen: 1500 },
    intent: { maxLen: 60 },
    sessionId: { maxLen: 64 },
  });
  if (!valid) return res.status(400).json({ ok: false });
  const record = db.insert("feedback", data);
  return ok(res, record);
};
