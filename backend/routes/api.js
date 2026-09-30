/**
 * ============================================================
 *  API routes — public submission endpoints + admin endpoints
 * ============================================================
 */
const express = require("express");
const router = express.Router();

const { submitLimiter, uploadLimiter, publicUploadLimiter, authLimiter, aiLimiter } = require("../middleware/rateLimit");
const { requireRecaptcha } = require("../middleware/recaptcha");
const { requireAuth } = require("../middleware/auth");
const { imageUpload, imageSignatureGuard } = require("../middleware/upload");
const submissions = require("../controllers/submissionController");
const chat = require("../controllers/chatController");
const visitors = require("../controllers/visitorController");
const admin = require("../controllers/adminController");
const ai = require("../controllers/aiController");
const leads = require("../controllers/leadController");

/* ---------------- CONTACT FORMS (MySQL-backed, one endpoint) ---------------- */
const contactRoutes = require("./contactRoutes");

/* ---------------- NEWSLETTER SUBSCRIPTION (MySQL-backed) ---------------- */
const subscribeRoutes = require("./subscribeRoutes");

/* ---------------- NEWS: public (global, published-only) ---------------- */
const news = require("../controllers/newsController");

/* ---------------- public ----------------
   Every endpoint that stores visitor-submitted data is protected by
   middleware/recaptcha: the reCAPTCHA v3 token sent by the frontend is
   verified with Google (RECAPTCHA_SECRET_KEY) before the controller runs,
   so the existing controller/DB logic is never reached by an unverified
   request. Telemetry (visitor heartbeat), chat transcripts (chat/session),
   AI answers (ai/chat) and admin routes are not visitor forms. */
router.post("/lead", submitLimiter, requireRecaptcha({ action: "lead" }), submissions.createLead);
router.post("/meeting", submitLimiter, requireRecaptcha({ action: "meeting" }), submissions.createMeeting);
router.post("/application", submitLimiter, requireRecaptcha({ action: "application" }), submissions.createApplication);
router.post("/handoff", submitLimiter, requireRecaptcha({ action: "handoff" }), submissions.createHandoff);
router.post("/feedback", submitLimiter, requireRecaptcha({ action: "feedback" }), submissions.createFeedback);
router.post("/chat/session", submitLimiter, chat.saveSession);
router.post("/visitor/heartbeat", visitors.heartbeat);
/* Image uploads go straight to Cloudinary (memory storage — nothing is ever
   written to the local /uploads folder, which Render wipes on redeploy).
   `imageSignatureGuard` rejects any buffer whose actual bytes are not a real
   image (the extension and Content-Type are attacker-controlled).
   news.uploadImage answers without a URL when the upload fails, so a broken
   image path can never be persisted.

   SECURITY (H1): this route is anonymous — the chatbot attachment copy
   (chatbot/ChatInput.jsx → chatApi.uploadFile) is a public visitor feature and
   cannot be put behind the admin token — so it is protected with the two
   controls that do not require a session:
     • `publicUploadLimiter`  → 6 files / 15 min / IP (was 30),
     • `requireRecaptcha`     → a Google-verified v3 token for the action
       "upload" is mandatory BEFORE the file is read and Cloudinary is called.
   The token travels in the `X-Recaptcha-Token` header, which the guard also
   accepts (a multipart body field would only exist after multer has already
   parsed — and therefore stored — the file).
   The authenticated admin panel keeps using POST /api/admin/news/upload. */
router.post(
  "/upload",
  publicUploadLimiter,
  requireRecaptcha({ action: "upload" }),
  imageUpload.single("file"),
  imageSignatureGuard,
  news.uploadImage
);
/* general-knowledge / off-topic questions → Gemini */
router.post("/ai/chat", aiLimiter, ai.aiChat);

/* public news (global, published-only) */
router.get("/news", news.listPublished);
router.get("/news/:id", news.getPublished);

/* ---------------- contact forms → MySQL ----------------
   POST /api/contact is the SINGLE endpoint shared by Hero.jsx,
   ContactForm.jsx and pages/contact.jsx (source = hero |
   home-contact | contact-page). Submissions are stored in the
   MySQL `contacts` table (see models/contactModel.js). */
router.use("/contact", contactRoutes);

/* ---------------- newsletter subscription → MySQL ----------------
   POST /api/subscribe stores the SubscribeSection.jsx signup in
   the MySQL `subscribers` table (see models/subscriberModel.js). */
router.use("/subscribe", subscribeRoutes);

/* ---------------- admin ---------------- */
router.post("/admin/login", authLimiter, admin.login);
/* Logout revokes the presented token immediately (no remaining 12h TTL) */
router.post("/admin/logout", requireAuth, admin.logout);
/* /admin/news must be registered before the generic /admin/:collection route */
router.get("/admin/news", requireAuth, news.listAll);
router.post("/admin/news", requireAuth, news.create);
/* Admin image upload → Cloudinary (memory storage, never the local disk).
   The bytes must be a real image before Cloudinary is called. */
router.post(
  "/admin/news/upload",
  requireAuth,
  uploadLimiter,
  imageUpload.single("file"),
  imageSignatureGuard,
  news.uploadImage
);
/* One-off upgrade of legacy local/inline News image paths to Cloudinary */
router.post("/admin/news/migrate-images", requireAuth, news.migrateImages);
router.put("/admin/news/:id", requireAuth, news.update);
router.delete("/admin/news/:id", requireAuth, news.remove);
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

