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

/** Own-property test — never falls through to Object.prototype. */
const owns = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * The token store, guaranteed to be a plain object.
 *
 * SECURITY: tokens are looked up with an OWN-property check (`owns`) below.
 * Indexing the store directly (`store[token]`) also matches inherited
 * Object.prototype members, so `Authorization: Bearer __proto__` (or
 * constructor / toString / valueOf / hasOwnProperty) was accepted as a valid
 * admin token — verified before the fix: isValidToken("__proto__") === true.
 * Such a value is a function/object, so the numeric expiry comparison was
 * always false and the token never expired either.
 */
function tokenStore(settings) {
  const store = settings && settings.adminTokens;
  return store && typeof store === "object" && !Array.isArray(store) ? store : {};
}

function issueToken() {
  const settings = db.read("settings");
  const token = crypto.randomBytes(32).toString("hex");
  const store = tokenStore(settings);
  // prune expired tokens
  Object.keys(store).forEach((t) => {
    if (!(store[t] > Date.now())) delete store[t];
  });
  store[token] = Date.now() + TOKEN_TTL_MS;
  settings.adminTokens = store;
  db.write("settings", settings);
  return token;
}

function isValidToken(token) {
  if (typeof token !== "string" || !token) return false;
  const store = tokenStore(db.read("settings"));
  if (!owns(store, token)) return false;
  const expiry = store[token];
  return typeof expiry === "number" && expiry > Date.now();
}

/** Drop one token (logout). Unknown tokens are ignored. */
function revokeToken(token) {
  if (typeof token !== "string" || !token) return false;
  const settings = db.read("settings");
  const store = tokenStore(settings);
  if (!owns(store, token)) return false;
  delete store[token];
  settings.adminTokens = store;
  db.write("settings", settings);
  return true;
}

/** The bearer token of a request (`Authorization: Bearer <token>`), or null. */
function readBearer(req) {
  const header = (req && req.headers && req.headers.authorization) || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

/** Check if the authenticated token has a matching role. */
function hasRole(req, allowedRoles) {
  const token = readBearer(req);
  if (!token) return false;
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return true;
  const payload = tokenPayload.get(token);
  if (!payload) return false;
  return allowedRoles.includes(payload.role);
}

/** Map token → role (populated on issueToken). */
const tokenPayload = new Map();

function requireAuth(req, res, next) {
  if (!isValidToken(readBearer(req))) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  // Attach role to req for use by requireRole middleware
  const store = tokenStore(db.read("settings"));
  const token = readBearer(req);
  if (token && owns(store, token)) {
    req.adminRole = store[token] && typeof store[token] === "object" ? store[token].role : "super_admin";
  } else {
    req.adminRole = "super_admin";
  }
  next();
  return undefined;
}

/** Authorization middleware — rejects if token role is not in allowedRoles. */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    // If no allowed roles specified, allow through (backward compatibility)
    if (allowedRoles.length === 0) return next();
    // Permit super_admin unrestricted access unless explicitly restricted
    if (req.adminRole === "super_admin") return next();
    if (hasRole(req, allowedRoles)) return next();
    return res.status(403).json({ ok: false, error: "Forbidden — insufficient privileges" });
  };
}

/** Issue a token with an optional role. Defaults to super_admin. */
function issueToken(role = "super_admin") {
  const settings = db.read("settings");
  const token = crypto.randomBytes(32).toString("hex");
  const store = tokenStore(settings);
  // prune expired tokens
  Object.keys(store).forEach((t) => {
    if (!(store[t] > Date.now())) delete store[t];
  });
  store[token] = { expiry: Date.now() + TOKEN_TTL_MS, role };
  settings.adminTokens = store;
  // Store in memory map for requireRole lookups
  tokenPayload.set(token, { role });
  db.write("settings", settings);
  return token;
}

module.exports = { issueToken, isValidToken, revokeToken, readBearer, requireAuth };
