/**
 * ============================================================
 *  Rate limiters — global + strict limits on submission routes
 * ============================================================
 */
const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests. Please slow down." },
});

const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: "You're doing that too fast. Please wait a moment and try again.",
  },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { ok: false, error: "Too many uploads. Please wait a bit." },
});

/* ANONYMOUS uploads (POST /api/upload — the chatbot attachment copy).
   uploadLimiter stays for the authenticated admin route; this one is much
   stricter because the caller is not logged in and every accepted file costs
   real Cloudinary storage/bandwidth: a scripted flood used to be able to push
   30 x 5 MB per IP per 15 minutes. */
const publicUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many uploads from this connection. Try again later." },
});

/* General-knowledge AI answers — needs a laxer limit than form submits
   so normal back-and-forth chat (incl. automated test sequences)
   never trips the submission throttle. */
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: "You're doing that too fast. Please wait a moment and try again.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { ok: false, error: "Too many login attempts. Try later." },
});

module.exports = {
  globalLimiter,
  submitLimiter,
  uploadLimiter,
  publicUploadLimiter,
  authLimiter,
  aiLimiter,
};
