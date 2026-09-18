/**
 * ============================================================
 *  Subscriber controller — newsletter subscription endpoint:
 *
 *      POST /api/subscribe
 *
 *  Body: { email, agreeToSubscribe }
 *
 *  Backend validation is mandatory — frontend validation is
 *  never trusted:
 *   * email is required, trimmed and lower-cased,
 *   * email format is validated (shared middleware/validate
 *     helper, same one the contact endpoint uses),
 *   * agreeToSubscribe must be exactly true,
 *   * the row is INSERTED into MySQL with a prepared statement,
 *   * a duplicate email is reported as HTTP 409 (the UNIQUE
 *     index on `subscribers`.`email` fires ER_DUP_ENTRY),
 *   * no SQL error, stack trace or credential ever reaches the
 *     client.
 * ============================================================
 */
const { sanitize, isEmail } = require("../middleware/validate");
const subscribers = require("../models/subscriberModel");

const EMAIL_MAX_LENGTH = 190; /* matches VARCHAR(190) in migration 002 */

/* Exact response bodies required by the API contract. */
const MESSAGES = {
  success: "You have been successfully subscribed.",
  validation: "Please provide a valid email address and agree to subscribe.",
  duplicate: "This email is already subscribed.",
  server: "Something went wrong. Please try again.",
};

function badRequest(res, errors) {
  return res.status(400).json({
    success: false,
    message: MESSAGES.validation,
    errors,
  });
}

function serverError(res, err) {
  // Full detail in the server log only — never in the response.
  console.error("[subscribe] failed:", require("../config/mysql").safeError(err));
  return res.status(500).json({ success: false, message: MESSAGES.server });
}

/* ---------------- validation + normalization ---------------- */

function normalize(body) {
  const raw = body && typeof body === "object" ? body : {};

  const data = {
    // Reject oversized addresses rather than silently truncating them.
    email: typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "",
    agreeToSubscribe: raw.agreeToSubscribe === true,
  };

  const errors = [];

  if (!data.email) errors.push("Email is required");

  if (data.email && (data.email.length > EMAIL_MAX_LENGTH || !isEmail(data.email) || /[<>\u0000-\u001f\u007f]/.test(data.email))) {
    errors.push("Please provide a valid email address");
  }

  if (!data.agreeToSubscribe) {
    errors.push("You must agree to subscribe");
  }

  return { data, errors };
}

/* ---------------- POST /api/subscribe ---------------- */

exports.createSubscriber = async (req, res) => {
  const body = (req.body && typeof req.body === "object" ? req.body : {}) || {};

  // Honeypot — same spam guard the other public forms use. A real
  // visitor never fills this hidden field; a filled one is reported
  // as a normal validation failure (no hint it was a bot trap).
  if (sanitize(body.website, 60)) {
    return badRequest(res, [MESSAGES.validation]);
  }

  const { data, errors } = normalize(body);
  if (errors.length) return badRequest(res, errors);

  try {
    const record = await subscribers.insertSubscriber(data);

    console.log(`[subscribe] stored id=${record.id} email=${data.email}`);

    return res.status(201).json({
      success: true,
      message: MESSAGES.success,
      data: { id: record.id },
    });
  } catch (err) {
    // The UNIQUE index on `email` rejected the insert — this is an
    // expected, user-facing outcome (HTTP 409), not a server error.
    if (subscribers.isDuplicateError(err)) {
      console.log(`[subscribe] duplicate email ignored: ${data.email}`);
      return res.status(409).json({
        success: false,
        message: MESSAGES.duplicate,
      });
    }

    return serverError(res, err);
  }
};

exports.MESSAGES = MESSAGES;
exports.normalize = normalize;