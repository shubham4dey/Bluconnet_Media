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

module.exports = { sanitize, isEmail, isPhone, validate };
