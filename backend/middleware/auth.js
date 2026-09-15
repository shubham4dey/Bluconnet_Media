/**
 * ============================================================
 *  Admin authentication — token issued on login, persisted in
 *  settings.json with 12h expiry. Clients send:
 *    Authorization: Bearer <token>
 * ============================================================
 */
const crypto = require("crypto");
const db = require("../config/database");

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function issueToken() {
  const settings = db.read("settings");
  const token = crypto.randomBytes(32).toString("hex");
  settings.adminTokens = settings.adminTokens || {};
  // prune expired tokens
  Object.keys(settings.adminTokens).forEach((t) => {
    if (settings.adminTokens[t] < Date.now()) delete settings.adminTokens[t];
  });
  settings.adminTokens[token] = Date.now() + TOKEN_TTL_MS;
  db.write("settings", settings);
  return token;
}

function isValidToken(token) {
  if (!token) return false;
  const settings = db.read("settings");
  const expiry = (settings.adminTokens || {})[token];
  if (!expiry || expiry < Date.now()) return false;
  return true;
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!isValidToken(token)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  next();
}

module.exports = { issueToken, isValidToken, requireAuth };
