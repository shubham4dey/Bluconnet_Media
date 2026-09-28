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
const { requireRecaptcha } = require("../middleware/recaptcha");
const contacts = require("../controllers/contactController");

/* Public: store a contact-form enquiry in MySQL.
   The reCAPTCHA v3 token sent by the form is verified with Google before
   the controller runs — an unverified request never reaches the database. */
router.post(
  "/",
  submitLimiter,
  requireRecaptcha({ action: "contact_form" }),
  contacts.createContact
);

module.exports = router;