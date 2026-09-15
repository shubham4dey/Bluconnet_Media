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

module.exports = { globalLimiter, submitLimiter, uploadLimiter, authLimiter, aiLimiter };
