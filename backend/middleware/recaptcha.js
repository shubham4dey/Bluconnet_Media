/**
 * ============================================================
 *  reCAPTCHA v3 guard — protects public submission endpoints
 * ============================================================
 *
 *  Usage (one place per protected route, no duplicated logic):
 *
 *      const { requireRecaptcha } = require("../middleware/recaptcha");
 *      router.post("/contact", submitLimiter,
 *                  requireRecaptcha({ action: "contact_form" }),
 *                  contacts.createContact);
 *
 *  The frontend sends the token it obtained from Google with the request
 *  (JSON body `recaptchaToken` / `recaptcha_token` / `g-recaptcha-response`,
 *  or the `X-Recaptcha-Token` header). The guard verifies it with Google
 *  (services/recaptcha.js, using RECAPTCHA_SECRET_KEY) before the request
 *  reaches the controller:
 *
 *    • verification passed → `req.recaptcha = { score, action, hostname }`
 *      and the existing controller runs completely unchanged.
 *    • missing / invalid / failed → the controller never runs and the client
 *      receives HTTP 400 (no token) or 403 (verification failed):
 *
 *          { "message": "reCAPTCHA verification failed" }
 *
 *  The secret key stays server-side: it is used only inside
 *  services/recaptcha.js and is never logged or returned to a client.
 * ============================================================
 */
const { verifyRecaptchaToken } = require("../services/recaptcha");

/* Exact body required by the API contract on any failure. */
const FAILURE_MESSAGE = "reCAPTCHA verification failed";

/** Token from the JSON body (or the X-Recaptcha-Token header as fallback). */
function readToken(req) {
  const body = req && req.body && typeof req.body === "object" ? req.body : {};
  const candidates = [
    body.recaptchaToken,
    body.recaptcha_token,
    body["g-recaptcha-response"],
    req && typeof req.get === "function" ? req.get("x-recaptcha-token") : null,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }

  return "";
}

/**
 * Express middleware factory — verifies the reCAPTCHA token, then continues.
 *
 * @param {object}   [options]
 * @param {string}   [options.action]       reCAPTCHA v3 action this endpoint expects
 * @param {number}   [options.minScore]     score threshold override
 * @param {string[]} [options.allowedHosts] extra allowed hostnames
 * @param {number}   [options.timeoutMs]    Google call timeout override
 * @returns {import("express").RequestHandler}
 */
function requireRecaptcha(options) {
  const opts = options || {};
  const config = {
    action: opts.action || null,
    minScore: opts.minScore,
    allowedHosts: opts.allowedHosts,
    timeoutMs: opts.timeoutMs,
  };

  return async function recaptchaGuard(req, res, next) {
    let result;

    try {
      result = await verifyRecaptchaToken(readToken(req), config);
    } catch (err) {
      /* verifyRecaptchaToken() handles its own failures — this is the
         last-resort guard so an unexpected error can never let a request
         through unverified. */
      console.error("[recaptcha] guard failed:", (err && err.message) || err);
      return res.status(403).json({ message: FAILURE_MESSAGE });
    }

    if (!result.ok) {
      /* Identical body for every failure: no detail about the token, the
         score or the key is disclosed to the client (the reason is logged
         server-side by the service). */
      return res
        .status(result.status === 400 ? 400 : 403)
        .json({ message: FAILURE_MESSAGE });
    }

    req.recaptcha = {
      score: result.score,
      action: result.action,
      hostname: result.hostname,
    };

    return next();
  };
}

module.exports = { requireRecaptcha, readToken, FAILURE_MESSAGE };
