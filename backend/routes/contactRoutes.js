/**
 * ============================================================
 *  Contact routes — mounted by the existing API router:
 *
 *      routes/api.js →  router.use("/contact", contactRoutes)
 *      ⇒  POST /api/contact
 *
 *  ONE endpoint for all three contact forms. There is deliberately
 *  no /api/hero-contact, /api/home-contact or /api/contact-page.
 * ============================================================
 */
const express = require("express");
const router = express.Router();

const { submitLimiter } = require("../middleware/rateLimit");
const contacts = require("../controllers/contactController");

/* Public: store a contact-form enquiry in MySQL. */
router.post("/", submitLimiter, contacts.createContact);

module.exports = router;