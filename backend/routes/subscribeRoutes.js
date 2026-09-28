/**
 * ============================================================
 *  Subscriber routes — mounted by the existing API router:
 *
 *      routes/api.js →  router.use("/subscribe", subscribeRoutes)
 *      ⇒  POST /api/subscribe
 *
 *  Newsletter subscription endpoint for the existing
 *  components/SubscribeSection.jsx form. Submissions are stored
 *  in the MySQL `subscribers` table (models/subscriberModel.js).
 * ============================================================
 */
const express = require("express");
const router = express.Router();

const { submitLimiter } = require("../middleware/rateLimit");
const { requireRecaptcha } = require("../middleware/recaptcha");
const subscribers = require("../controllers/subscriberController");

/* Public: store a newsletter subscription in MySQL.
   The reCAPTCHA v3 token sent by the form is verified with Google before
   the controller runs — an unverified request never reaches the database. */
router.post(
  "/",
  submitLimiter,
  requireRecaptcha({ action: "subscribe" }),
  subscribers.createSubscriber
);

module.exports = router;