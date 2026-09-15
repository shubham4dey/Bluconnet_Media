/**
 * ============================================================
 *  API routes — public submission endpoints + admin endpoints
 * ============================================================
 */
const express = require("express");
const router = express.Router();

const { submitLimiter, uploadLimiter, authLimiter, aiLimiter } = require("../middleware/rateLimit");
const { requireAuth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const submissions = require("../controllers/submissionController");
const chat = require("../controllers/chatController");
const visitors = require("../controllers/visitorController");
const admin = require("../controllers/adminController");
const ai = require("../controllers/aiController");
const leads = require("../controllers/leadController");

/* ---------------- public ---------------- */
router.post("/lead", submitLimiter, submissions.createLead);
router.post("/meeting", submitLimiter, submissions.createMeeting);
router.post("/application", submitLimiter, submissions.createApplication);
router.post("/handoff", submitLimiter, submissions.createHandoff);
router.post("/feedback", submitLimiter, submissions.createFeedback);
router.post("/chat/session", submitLimiter, chat.saveSession);
router.post("/visitor/heartbeat", visitors.heartbeat);
router.post("/upload", uploadLimiter, upload.single("file"), visitors.uploadFile);
/* general-knowledge / off-topic questions → Gemini */
router.post("/ai/chat", aiLimiter, ai.aiChat);

/* ---------------- admin ---------------- */
router.post("/admin/login", authLimiter, admin.login);
router.get("/admin/dashboard", requireAuth, admin.dashboard);
router.get("/admin/settings", requireAuth, admin.getSettings);
router.get("/admin/:collection", requireAuth, admin.listCollection);
router.get("/admin/export/:collection", requireAuth, admin.exportCsv);
router.put("/admin/settings", requireAuth, admin.updateSettings);
router.put("/admin/:collection/:id", requireAuth, admin.updateRecord);
router.delete("/admin/:collection/:id", requireAuth, admin.deleteRecord);

/* ---------------- CRM Lead Management ---------------- */
router.get("/admin/leads/search", requireAuth, leads.searchLeads);
router.get("/admin/leads/stats", requireAuth, leads.getStats);
router.get("/admin/leads/:id", requireAuth, leads.getLeadWithHistory);
router.put("/admin/leads/:id", requireAuth, leads.updateLead);
router.delete("/admin/leads/:id", requireAuth, leads.deleteLead);
router.post("/admin/leads/bulk-delete", requireAuth, leads.bulkDelete);
router.post("/admin/leads/:id/note", requireAuth, leads.addNote);

/* ---------------- Chat Session Management ---------------- */
router.get("/admin/sessions/:sessionId", requireAuth, chat.getSession);
router.get("/admin/sessions/lead/:leadId", requireAuth, chat.getSessionsByLead);

module.exports = router;

