/**
 * ============================================================
 *  Google reCAPTCHA v3 — server-side verification
 * ============================================================
 *
 *  The browser obtains a reCAPTCHA v3 token
 *  (frontend: components/RecaptchaProtection.jsx) and sends it with the
 *  protected request. Before a controller runs, that token is verified
 *  with Google's official service:
 *
 *      POST https://www.google.com/recaptcha/api/siteverify
 *        secret   = process.env.RECAPTCHA_SECRET_KEY   ← server-side only
 *        response = the reCAPTCHA token sent by the browser
 *
 *  A token is only accepted when Google answers:
 *    * success === true
 *    * score   >= threshold            (v3 score, RECAPTCHA_MIN_SCORE, default 0.5)
 *    * action  === expected action     (when the endpoint requires one)
 *    * hostname is one of the site's own hosts (when Google returns one)
 *
 *  The secret key is never logged, never written to a response and never
 *  sent anywhere except Google's verification endpoint.
 *
 *  verifyRecaptchaToken() never throws — it resolves to
 *      { ok: true,  score, action, hostname }
 *      { ok: false, status, reason }              status = 400 | 403
 *  so callers can answer without leaking internals.
 *
 *  Optional environment variables:
 *    RECAPTCHA_MIN_SCORE      0.5   minimum accepted v3 score (0–1)
 *    RECAPTCHA_ALLOWED_HOSTS  —     extra comma-separated hostnames
 * ============================================================
 */

/* Google's official verification endpoint (as documented by Google). */
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/* Google's recommended starting threshold for v3 (1.0 = very likely
   legitimate, 0.1 = very likely a bot). 0.5 is the common production
   default and can be tuned per deployment with RECAPTCHA_MIN_SCORE. */
const DEFAULT_MIN_SCORE = 0.5;

/* A hung verification call must never hold a form submission open. */
const DEFAULT_TIMEOUT_MS = 5000;

/* Longest token we will forward to Google (real tokens are ~2 KB). */
const MAX_TOKEN_LENGTH = 4096;

/* Hosts the verified token may originate from when neither FRONTEND_ORIGIN
   nor RECAPTCHA_ALLOWED_HOSTS is configured. */
const DEFAULT_ALLOWED_HOSTS = [
  "bluconnetmedia.com",
  "www.bluconnetmedia.com",
  "localhost",
  "127.0.0.1",
];

/**
 * The reCAPTCHA secret key. Read from the environment on every call (so a
 * rotated key needs no restart) and never returned, logged or exposed.
 */
function secretKey() {
  return String(process.env.RECAPTCHA_SECRET_KEY || "").trim();
}

/** true when a secret key is configured, i.e. verification can run. */
function isConfigured() {
  return secretKey().length > 0;
}

/** Configured score threshold (RECAPTCHA_MIN_SCORE) or the v3 default. */
function configuredMinScore() {
  const value = Number(process.env.RECAPTCHA_MIN_SCORE);
  if (!Number.isFinite(value) || value <= 0 || value > 1) return DEFAULT_MIN_SCORE;
  return value;
}

/** "https://bluconnetmedia.com:443" | "bluconnetmedia.com" → "bluconnetmedia.com" */
function hostnameFromValue(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "";
  if (!raw.includes("://")) return raw.replace(/\/.*$/, "").replace(/:\d+$/, "");
  try {
    return new URL(raw).hostname.toLowerCase();
  } catch (err) {
    return "";
  }
}

/**
 * Hostnames a legitimate token may come from: the site's own hosts plus
 * FRONTEND_ORIGIN, the Render host serving the app, RECAPTCHA_ALLOWED_HOSTS
 * and any caller-supplied additions.
 */
function allowedHosts(extra) {
  const hosts = new Set(DEFAULT_ALLOWED_HOSTS);

  String(process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .forEach((origin) => {
      const host = hostnameFromValue(origin);
      if (host) hosts.add(host);
    });

  if (process.env.RENDER_EXTERNAL_HOSTNAME) {
    hosts.add(String(process.env.RENDER_EXTERNAL_HOSTNAME).trim().toLowerCase());
  }

  String(process.env.RECAPTCHA_ALLOWED_HOSTS || "")
    .split(",")
    .forEach((host) => {
      const clean = String(host || "").trim().toLowerCase();
      if (clean) hosts.add(clean);
    });

  (Array.isArray(extra) ? extra : []).forEach((host) => {
    const clean = String(host || "").trim().toLowerCase();
    if (clean) hosts.add(clean);
  });

  return Array.from(hosts);
}

/** Exact host or any sub-domain of an allowed host. */
function isHostnameAllowed(hostname, extra) {
  const host = String(hostname || "").trim().toLowerCase();
  if (!host) return false;
  return allowedHosts(extra).some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  );
}

/** One-line operator status — never contains the key itself. */
function describe() {
  if (!isConfigured()) {
    return "reCAPTCHA v3 verification: DISABLED (RECAPTCHA_SECRET_KEY is not set)";
  }
  return `reCAPTCHA v3 verification: enabled (min score ${configuredMinScore()})`;
}

/**
 * Verify a reCAPTCHA v3 token with Google.
 *
 * @param  {string} token                 token sent by the browser
 * @param  {object} [options]
 * @param  {string}   [options.action]       action the endpoint expects (v3)
 * @param  {number}   [options.minScore]     override the score threshold
 * @param  {string[]} [options.allowedHosts] extra allowed hostnames
 * @param  {number}   [options.timeoutMs]    abort the Google call after N ms
 * @returns {Promise<{ok: boolean, status?: number, reason?: string,
 *                    score?: number, action?: string|null,
 *                    hostname?: string|null}>}
 */
async function verifyRecaptchaToken(token, options) {
  const opts = options || {};

  const secret = secretKey();
  if (!secret) {
    /* Misconfiguration, not a user error: refuse to process the request and
       tell the operator what to fix. The key itself is never logged. */
    console.error(
      "[recaptcha] RECAPTCHA_SECRET_KEY is not configured — protected submissions are rejected until it is set"
    );
    return { ok: false, status: 403, reason: "not_configured" };
  }

  const value = typeof token === "string" ? token.trim() : "";
  if (!value || value.length > MAX_TOKEN_LENGTH) {
    return { ok: false, status: 400, reason: "missing_token" };
  }

  /* Google expects an application/x-www-form-urlencoded POST body. */
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", value);

  const timeoutMs =
    Number.isFinite(Number(opts.timeoutMs)) && Number(opts.timeoutMs) > 0
      ? Number(opts.timeoutMs)
      : DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let payload;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });

    if (!res.ok) {
      /* Google answered with an HTTP error — log the status only. */
      console.error(`[recaptcha] siteverify responded HTTP ${res.status}`);
      return { ok: false, status: 403, reason: "verification_error" };
    }

    payload = await res.json();
  } catch (err) {
    const reason =
      err && err.name === "AbortError"
        ? `timeout after ${timeoutMs}ms`
        : (err && err.message) || "network error";
    console.error(`[recaptcha] siteverify request failed (${reason})`);
    return { ok: false, status: 403, reason: "network_error" };
  } finally {
    clearTimeout(timer);
  }

  if (!payload || payload.success !== true) {
    /* Google's own error codes (never the token) are safe to log. */
    const codes = Array.isArray(payload && payload["error-codes"])
      ? payload["error-codes"]
      : [];
    console.warn(
      `[recaptcha] token rejected by Google (codes: ${codes.join(", ") || "none"})`
    );
    return {
      ok: false,
      status: 403,
      reason: codes.includes("invalid-input-response")
        ? "invalid_token"
        : "rejected",
    };
  }

  /* reCAPTCHA v3 always returns a score; a response without one is refused
     because this project protects its forms with v3. */
  const score = Number(payload.score);
  if (!Number.isFinite(score)) {
    console.warn("[recaptcha] verification response carried no score");
    return { ok: false, status: 403, reason: "missing_score" };
  }

  const minScore = Number.isFinite(Number(opts.minScore))
    ? Number(opts.minScore)
    : configuredMinScore();

  if (score < minScore) {
    console.warn(`[recaptcha] score ${score} is below the minimum ${minScore}`);
    return { ok: false, status: 403, reason: "score_too_low", score };
  }

  const action = payload.action || null;
  if (opts.action && action !== opts.action) {
    console.warn(
      `[recaptcha] action mismatch (expected "${opts.action}", received "${
        action || "none"
      }")`
    );
    return { ok: false, status: 403, reason: "action_mismatch", score, action };
  }

  /* Google only returns a hostname for real (non-test) keys — when it is
     present it must belong to this site. */
  const hostname = payload.hostname || null;
  if (hostname && !isHostnameAllowed(hostname, opts.allowedHosts)) {
    console.warn(`[recaptcha] hostname not allowed (${hostname})`);
    return {
      ok: false,
      status: 403,
      reason: "hostname_not_allowed",
      score,
      action,
    };
  }

  return { ok: true, score, action, hostname };
}

module.exports = {
  verifyRecaptchaToken,
  isConfigured,
  allowedHosts,
  isHostnameAllowed,
  configuredMinScore,
  describe,
  VERIFY_URL,
  DEFAULT_MIN_SCORE,
};

