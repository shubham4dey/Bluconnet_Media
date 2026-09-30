/**
 * ============================================================
 *  Input validation & sanitization (spam-safe)
 * ============================================================
 */

/** Strip angle brackets & control chars, trim, cap length */
function sanitize(value, maxLen = 2000) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/[<>]/g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim()
    .slice(0, maxLen);
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
const isPhone = (v) =>
  /^\+?[\d\s\-().]{7,18}$/.test(String(v).trim()) &&
  (String(v).match(/\d/g) || []).length >= 7;

/**
 * Validate `body` against rules: { field: { required, email, phone, minLen, maxLen, label } }
 * Returns { ok, data, errors }
 */
function validate(body, rules) {
  const data = {};
  const errors = [];
  Object.entries(rules).forEach(([field, rule]) => {
    let value = sanitize(body[field], rule.maxLen || 2000);
    const missing = !value || value.length === 0;
    if (missing) {
      // honeypot / spam guard: hidden field must stay empty
      if (rule.required) {
        errors.push(`${rule.label || field} is required`);
      }
      value = "";
    } else {
      if (rule.email && !isEmail(value)) errors.push("Please provide a valid email address");
      if (rule.phone && !isPhone(value)) errors.push("Please provide a valid phone number");
      if (rule.minLen && value.length < rule.minLen) {
        errors.push(`${rule.label || field} is too short`);
      }
    }
    data[field] = value;
  });
  return { ok: errors.length === 0, data, errors };
}

/**
 * Resolved client IP — Express' `req.ip`, which is already proxy-aware through
 * `app.set("trust proxy", 1)`, bounded to a sane length.
 *
 * SECURITY: never store the raw `x-forwarded-for` header: it is client-supplied
 * and unbounded, so a visitor could write arbitrary data (and a fake IP) into
 * the stored lead / chat record the admin panel and CSV exports show.
 */
function clientIp(req, maxLen = 64) {
  const raw =
    (req && (req.ip || (req.socket && req.socket.remoteAddress))) || "";
  return String(raw).slice(0, maxLen);
}

/* ---- outbound-URL guard (SSRF) -------------------------------------------
   Used where the server fetches a URL that a request supplied (legacy news
   image migration, admin-configured webhooks). Only public http(s) hosts are
   allowed: loopback, RFC1918, link-local (cloud metadata 169.254.169.254),
   .internal/.local names and every IP literal form that is not obviously
   public are refused. */

const PRIVATE_V4 = (host) => {
  const parts = host.split(".").map((n) => Number(n));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true; // not a valid IPv4 literal -> treat as unsafe
  }
  const [a, b] = parts;
  if (a === 0 || a === 10 || a === 127) return true; // this-network, private, loopback
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 169 && b === 254) return true; // link-local + cloud metadata
  if (a === 100 && b >= 64 && b <= 127) return true; // carrier-grade NAT
  if (a >= 224) return true; // multicast / reserved
  return false;
};

/** True for hosts that must never be reached from this server. */
function isPrivateHostname(hostname) {
  const host = String(hostname || "").toLowerCase().replace(/^\[|\]$/g, "");
  if (!host) return true;
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host.endsWith(".local") || host.endsWith(".internal")) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return PRIVATE_V4(host);
  if (host.includes(":")) return true; // refuse every IPv6 literal (::1, fc00::/7, fe80::/10, …)
  return false;
}

/**
 * Validate an outbound URL: returns the normalised URL string, or null when it
 * must not be fetched. `requireHttps` defaults to true (webhooks); the news
 * image migration also accepts plain http because legacy media may be http.
 */
function isPublicHttpUrl(value, { requireHttps = true } = {}) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  let url;
  try {
    url = new URL(raw);
  } catch (e) {
    return null;
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && requireHttps === false)) {
    return null;
  }
  if (url.username || url.password) return null; // no credentials-in-URL
  if (isPrivateHostname(url.hostname)) return null;
  return url.toString();
}

module.exports = {
  sanitize,
  isEmail,
  isPhone,
  validate,
  clientIp,
  isPrivateHostname,
  isPublicHttpUrl,
};
