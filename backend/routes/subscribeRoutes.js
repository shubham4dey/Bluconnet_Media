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
const subscribers = require("../controllers/subscriberController");

/* Public: store a newsletter subscription in MySQL. */
router.post("/", submitLimiter, subscribers.createSubscriber);

module.exports = router;