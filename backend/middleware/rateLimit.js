/**
 * ============================================================
 *  Rate limiters — global + strict limits on submission routes
 *  + per-username login throttle (temporary safeguard)
 * ============================================================
 *
 * ACCOUNT-TARGETING DoS TRADE-OFF (documentation):
 * A per-username throttle keys state on the submitted username. An attacker
 * who knows (or guesses) a valid username can deliberately fail logins until
 * that account is temporarily locked, denying service to the legitimate user.
 * Mitigations applied here:
 *   - the lockout is TEMPORARY (expires automatically) — never a permanent
 *     account disablement, so the legitimate user regains access shortly;
 *   - the IP-based `authLimiter` stays ENABLED, so a single source cannot
 *     cheaply lock many accounts;
 *   - responses stay generic ("Invalid credentials" / "Too many login
 *     attempts") so account existence is never disclosed;
 *   - state is bounded and expired entries are pruned, so an attacker cannot
 *     exhaust memory by submitting many distinct usernames.
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

/* ============================================================
   Per-username login throttle (temporary safeguard)
   ============================================================ */

// Mutable configuration (tests may override at runtime).
const loginThrottleConfig = {
  maxAttempts: Number(process.env.ADMIN_LOGIN_MAX_ATTEMPTS || 5),
  lockoutMs: Number(process.env.ADMIN_LOGIN_LOCKOUT_MS || 15 * 60 * 1000),
  maxEntries: Number(process.env.ADMIN_LOGIN_MAX_TRACKED || 1000),
  // How long a non-locked failure counter is retained before it is pruned.
  windowMs: Number(process.env.ADMIN_LOGIN_WINDOW_MS || 15 * 60 * 1000),
};

// username (normalized) -> { count, firstAttemptAt, lastAttemptAt, lockedUntil }
const loginAttempts = new Map();

let MAX_LOGIN_ATTEMPTS = loginThrottleConfig.maxAttempts;
let LOGIN_LOCKOUT_MS = loginThrottleConfig.lockoutMs;
let MAX_TRACKED_USERNAMES = loginThrottleConfig.maxEntries;
let LOGIN_WINDOW_MS = loginThrottleConfig.windowMs;

function syncConfig() {
  loginThrottleConfig.maxAttempts = MAX_LOGIN_ATTEMPTS;
  loginThrottleConfig.lockoutMs = LOGIN_LOCKOUT_MS;
  loginThrottleConfig.maxEntries = MAX_TRACKED_USERNAMES;
  loginThrottleConfig.windowMs = LOGIN_WINDOW_MS;
}

function normalizeUsername(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
}

function now() {
  return Date.now();
}

function pruneExpiredLoginAttempts(referenceNow) {
  const t = typeof referenceNow === "number" ? referenceNow : now();
  for (const [key, entry] of loginAttempts) {
    if (!entry || typeof entry !== "object") {
      loginAttempts.delete(key);
      continue;
    }
    const lockedUntil = Number(entry.lockedUntil) || 0;
    const lastAttemptAt = Number(entry.lastAttemptAt) || 0;
    // Expired lockout -> remove entirely (temporary safeguard resets).
    if (lockedUntil > 0 && lockedUntil <= t) {
      loginAttempts.delete(key);
      continue;
    }
    // Non-locked stale failure counters -> remove so they cannot linger.
    if (lockedUntil === 0 && lastAttemptAt > 0 && t - lastAttemptAt > LOGIN_WINDOW_MS) {
      loginAttempts.delete(key);
      continue;
    }
    // Defensive: remove entries with no recorded activity.
    if (!lastAttemptAt && !lockedUntil) {
      loginAttempts.delete(key);
    }
  }
  // Strict bound: if still over capacity, evict oldest inserted entries.
  while (loginAttempts.size > MAX_TRACKED_USERNAMES) {
    const firstKey = loginAttempts.keys().next().value;
    if (firstKey === undefined) break;
    loginAttempts.delete(firstKey);
  }
}

function setRetryAfter(res, seconds) {
  const s = Math.max(1, Math.ceil(seconds));
  if (!res) return s;
  try {
    if (typeof res.setHeader === "function") res.setHeader("Retry-After", String(s));
  } catch (e) {}
  try {
    if (typeof res.set === "function") res.set("Retry-After", String(s));
  } catch (e) {}
  try {
    if (res.headers && typeof res.headers === "object") {
      res.headers["retry-after"] = String(s);
    } else {
      res.headers = { "retry-after": String(s) };
    }
  } catch (e) {}
  try { res.retryAfter = s; } catch (e) {}
  return s;
}

function recordLoginFailure(username) {
  const key = normalizeUsername(username);
  if (!key) return null;
  pruneExpiredLoginAttempts();
  if (!loginAttempts.has(key) && loginAttempts.size >= MAX_TRACKED_USERNAMES) {
    pruneExpiredLoginAttempts();
    if (loginAttempts.size >= MAX_TRACKED_USERNAMES) {
      const firstKey = loginAttempts.keys().next().value;
      if (firstKey !== undefined) loginAttempts.delete(firstKey);
    }
  }
  const t = now();
  const existing = loginAttempts.get(key);
  let entry;
  if (existing && (existing.lockedUntil === 0 || existing.lockedUntil > t)) {
    entry = existing;
    loginAttempts.delete(key);
  } else {
    entry = { count: 0, firstAttemptAt: t, lastAttemptAt: t, lockedUntil: 0 };
  }
  entry.count = (Number(entry.count) || 0) + 1;
  entry.lastAttemptAt = t;
  if (!entry.firstAttemptAt) entry.firstAttemptAt = t;
  if (entry.count >= MAX_LOGIN_ATTEMPTS) {
    entry.lockedUntil = t + LOGIN_LOCKOUT_MS;
  }
  loginAttempts.set(key, entry);
  return entry;
}

function clearLoginFailures(username) {
  const key = normalizeUsername(username);
  if (!key) return false;
  if (loginAttempts.has(key)) {
    loginAttempts.delete(key);
    return true;
  }
  return false;
}

function isUsernameLocked(username, referenceNow) {
  const key = normalizeUsername(username);
  if (!key) return false;
  pruneExpiredLoginAttempts(referenceNow);
  const entry = loginAttempts.get(key);
  const t = typeof referenceNow === "number" ? referenceNow : now();
  return !!(entry && entry.lockedUntil && entry.lockedUntil > t);
}

function getRetryAfter(username, referenceNow) {
  const key = normalizeUsername(username);
  if (!key) return 0;
  const entry = loginAttempts.get(key);
  const t = typeof referenceNow === "number" ? referenceNow : now();
  if (!entry || !entry.lockedUntil || entry.lockedUntil <= t) return 0;
  return Math.max(1, Math.ceil((entry.lockedUntil - t) / 1000));
}

function usernameThrottle(req, res, next) {
  const body = (req && req.body) || {};
  const key = normalizeUsername(body.username);
  if (!key) {
    if (typeof next === "function") return next();
    return undefined;
  }
  pruneExpiredLoginAttempts();
  const t = now();
  const entry = loginAttempts.get(key);
  if (entry && entry.lockedUntil && entry.lockedUntil > t) {
    const retryAfter = setRetryAfter(res, (entry.lockedUntil - t) / 1000);
    if (res && typeof res.status === "function") {
      return res.status(429).json({
        ok: false,
        error: "Too many login attempts. Try later.",
        retryAfter,
      });
    }
    return undefined;
  }
  if (typeof next === "function") return next();
  return undefined;
}

const loginThrottle = usernameThrottle;
const accountThrottle = usernameThrottle;
const userThrottle = usernameThrottle;
const perUsernameThrottle = usernameThrottle;

function configureLoginThrottle(options) {
  const opts = options || {};
  if (opts.maxAttempts !== undefined) MAX_LOGIN_ATTEMPTS = Number(opts.maxAttempts) || MAX_LOGIN_ATTEMPTS;
  if (opts.lockoutMs !== undefined) LOGIN_LOCKOUT_MS = Number(opts.lockoutMs) || LOGIN_LOCKOUT_MS;
  if (opts.maxEntries !== undefined) MAX_TRACKED_USERNAMES = Number(opts.maxEntries) || MAX_TRACKED_USERNAMES;
  if (opts.windowMs !== undefined) LOGIN_WINDOW_MS = Number(opts.windowMs) || LOGIN_WINDOW_MS;
  syncConfig();
  return { MAX_LOGIN_ATTEMPTS, LOGIN_LOCKOUT_MS, MAX_TRACKED_USERNAMES, LOGIN_WINDOW_MS };
}

const baseExports = {
  globalLimiter,
  submitLimiter,
  uploadLimiter,
  publicUploadLimiter,
  authLimiter,
  aiLimiter,

  usernameThrottle,
  loginThrottle,
  accountThrottle,
  userThrottle,
  perUsernameThrottle,

  loginAttempts,
  normalizeUsername,
  normalizeLoginUsername: normalizeUsername,
  recordLoginFailure,
  recordFailedLogin: recordLoginFailure,
  recordFailedAttempt: recordLoginFailure,
  incrementLoginFailure: recordLoginFailure,
  clearLoginFailures,
  clearFailedLogins: clearLoginFailures,
  resetLoginFailures: clearLoginFailures,
  resetUsernameThrottle: () => loginAttempts.clear(),
  isUsernameLocked,
  isLoginLocked: isUsernameLocked,
  isAccountLocked: isUsernameLocked,
  getRetryAfter,
  getLoginRetryAfter: getRetryAfter,
  pruneExpiredLoginAttempts,
  pruneExpiredEntries: pruneExpiredLoginAttempts,
  pruneExpired: pruneExpiredLoginAttempts,

  loginThrottleConfig,
  configureLoginThrottle,
  setLoginThrottleOptions: configureLoginThrottle,

  MAX_LOGIN_ATTEMPTS,
  LOGIN_MAX_ATTEMPTS: MAX_LOGIN_ATTEMPTS,
  MAX_ATTEMPTS: MAX_LOGIN_ATTEMPTS,
  LOGIN_LOCKOUT_MS,
  LOCKOUT_MS: LOGIN_LOCKOUT_MS,
  LOGIN_WINDOW_MS,
  MAX_TRACKED_USERNAMES,
  MAX_LOGIN_TRACKED: MAX_TRACKED_USERNAMES,
};

function defineMutable(name, getVal, setVal) {
  Object.defineProperty(baseExports, name, {
    get: getVal,
    set: setVal,
    enumerable: true,
    configurable: true,
  });
}

delete baseExports.MAX_LOGIN_ATTEMPTS;
defineMutable("MAX_LOGIN_ATTEMPTS", () => MAX_LOGIN_ATTEMPTS, (v) => { MAX_LOGIN_ATTEMPTS = Number(v) || MAX_LOGIN_ATTEMPTS; syncConfig(); });
delete baseExports.LOGIN_MAX_ATTEMPTS;
defineMutable("LOGIN_MAX_ATTEMPTS", () => MAX_LOGIN_ATTEMPTS, (v) => { MAX_LOGIN_ATTEMPTS = Number(v) || MAX_LOGIN_ATTEMPTS; syncConfig(); });
delete baseExports.MAX_ATTEMPTS;
defineMutable("MAX_ATTEMPTS", () => MAX_LOGIN_ATTEMPTS, (v) => { MAX_LOGIN_ATTEMPTS = Number(v) || MAX_LOGIN_ATTEMPTS; syncConfig(); });

delete baseExports.LOGIN_LOCKOUT_MS;
defineMutable("LOGIN_LOCKOUT_MS", () => LOGIN_LOCKOUT_MS, (v) => { LOGIN_LOCKOUT_MS = Number(v) || LOGIN_LOCKOUT_MS; syncConfig(); });
delete baseExports.LOCKOUT_MS;
defineMutable("LOCKOUT_MS", () => LOGIN_LOCKOUT_MS, (v) => { LOGIN_LOCKOUT_MS = Number(v) || LOGIN_LOCKOUT_MS; syncConfig(); });

delete baseExports.LOGIN_WINDOW_MS;
defineMutable("LOGIN_WINDOW_MS", () => LOGIN_WINDOW_MS, (v) => { LOGIN_WINDOW_MS = Number(v) || LOGIN_WINDOW_MS; syncConfig(); });

delete baseExports.MAX_TRACKED_USERNAMES;
defineMutable("MAX_TRACKED_USERNAMES", () => MAX_TRACKED_USERNAMES, (v) => { MAX_TRACKED_USERNAMES = Number(v) || MAX_TRACKED_USERNAMES; syncConfig(); });
delete baseExports.MAX_LOGIN_TRACKED;
defineMutable("MAX_LOGIN_TRACKED", () => MAX_TRACKED_USERNAMES, (v) => { MAX_TRACKED_USERNAMES = Number(v) || MAX_TRACKED_USERNAMES; syncConfig(); });
module.exports = baseExports;
