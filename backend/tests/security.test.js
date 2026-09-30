/**
 * ============================================================
 *  Security regression tests — the hardening applied to the existing
 *  BluConnet backend after the audit.
 *
 *  Every case below is a real weakness that was found:
 *    1. admin-token lookup matched inherited Object.prototype members, so
 *       `Authorization: Bearer __proto__` passed requireAuth  (CRITICAL)
 *    2. admin login accepted a built-in default password when the env was unset
 *    3. visitor-supplied / raw `x-forwarded-for` values were stored as the IP
 *    4. the CSV export emitted `=formula` cells verbatim (CSV injection)
 *    5. server-side fetches of request-supplied URLs had no SSRF guard
 *    6. uploads were accepted on extension + Content-Type alone (no magic bytes)
 *
 *      npm test
 * ============================================================
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const auth = require("../middleware/auth");
const { clientIp, isPrivateHostname, isPublicHttpUrl } = require("../middleware/validate");
const { detectImageFormat, imageSignatureGuard } = require("../middleware/upload");
const admin = require("../controllers/adminController");

/* ---------- helpers ---------- */

function fakeRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function fakeReq({ body = {}, headers = {}, ip = "203.0.113.7" } = {}) {
  return { body, headers, ip };
}

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x01]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const GIF = Buffer.from("GIF89a", "latin1");
const WEBP = Buffer.concat([
  Buffer.from("RIFF", "latin1"),
  Buffer.from([0x24, 0x00, 0x00, 0x00]),
  Buffer.from("WEBP", "latin1"),
]);
const HTML = Buffer.from("<script>alert(1)</script>", "utf8");

/* ============================================================
   1. token lookup — prototype chain
   ============================================================ */

test("prototype-chain values are NOT valid admin tokens", () => {
  ["__proto__", "constructor", "toString", "valueOf", "hasOwnProperty"].forEach((evil) => {
    assert.equal(auth.isValidToken(evil), false, `"${evil}" must never authenticate a request`);
  });
});

test("non-string / empty tokens are rejected", () => {
  [null, undefined, "", 0, false, {}, [], "abc"].forEach((value) => {
    assert.equal(auth.isValidToken(value), false, `${JSON.stringify(value)} must be rejected`);
  });
});

test("an issued token authenticates, can be revoked and then fails", () => {
  const token = auth.issueToken();
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.equal(auth.isValidToken(token), true);

  assert.equal(auth.revokeToken(token), true);
  assert.equal(auth.isValidToken(token), false);
  assert.equal(auth.revokeToken(token), false); // already gone
});

test("requireAuth answers 401 for a prototype-chain bearer token", () => {
  const res = fakeRes();
  let nexted = false;
  auth.requireAuth({ headers: { authorization: "Bearer __proto__" } }, res, () => {
    nexted = true;
  });
  assert.equal(nexted, false);
  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { ok: false, error: "Unauthorized" });
});

test("readBearer only accepts the Bearer scheme", () => {
  assert.equal(auth.readBearer({ headers: { authorization: "Bearer abc" } }), "abc");
  assert.equal(auth.readBearer({ headers: { authorization: "Basic abc" } }), null);
  assert.equal(auth.readBearer({ headers: {} }), null);
  assert.equal(auth.readBearer(null), null);
});


/* ============================================================
   2. admin login — fail closed, constant-time, no defaults
   ============================================================ */

test("admin login refuses to work when ADMIN_USER/ADMIN_PASS are not configured", () => {
  const original = { user: process.env.ADMIN_USER, pass: process.env.ADMIN_PASS };
  try {
    delete process.env.ADMIN_USER;
    delete process.env.ADMIN_PASS;

    const res = fakeRes();
    // Even the old built-in credentials must not work any more.
    admin.login(
      fakeReq({ body: { username: "bluconnetnews", password: "bluconnetmedia@2026" } }),
      res
    );

    assert.equal(res.statusCode, 503);
    assert.equal(res.body.ok, false);
    assert.equal(res.body.token, undefined);
  } finally {
    if (original.user !== undefined) process.env.ADMIN_USER = original.user;
    if (original.pass !== undefined) process.env.ADMIN_PASS = original.pass;
  }
});

test("admin login rejects wrong credentials without saying which part was wrong", () => {
  const original = { user: process.env.ADMIN_USER, pass: process.env.ADMIN_PASS };
  try {
    process.env.ADMIN_USER = "correct-user";
    process.env.ADMIN_PASS = "correct-pass";

    const res = fakeRes();
    admin.login(fakeReq({ body: { username: "correct-user", password: "wrong" } }), res);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { ok: false, error: "Invalid credentials" });
  } finally {
    if (original.user !== undefined) process.env.ADMIN_USER = original.user;
    if (original.pass !== undefined) process.env.ADMIN_PASS = original.pass;
  }
});

/* ============================================================
   3. stored client IP
   ============================================================ */

test("clientIp uses the resolved request IP and never a spoofed header", () => {
  assert.equal(clientIp(fakeReq({ ip: "198.51.100.9" })), "198.51.100.9");
  assert.equal(
    clientIp({ headers: { "x-forwarded-for": "1.2.3.4" }, socket: { remoteAddress: "10.0.0.1" } }),
    "10.0.0.1"
  );
  assert.equal(clientIp({ socket: { remoteAddress: "10.0.0.1" } }), "10.0.0.1");
  assert.equal(clientIp({ ip: "9".repeat(200) }).length, 64);
  assert.equal(clientIp({}), "");
  assert.equal(clientIp(null), "");
});

/* ============================================================
   4. CSV / formula injection
   ============================================================ */

test("csv export neutralises formula-leading cells from visitors", () => {
  const escaped = admin._csvEscape;
  assert.equal(escaped("=cmd|' /C calc'!A0"), "\"'=cmd|' /C calc'!A0\"");
  assert.equal(escaped("+1+1"), "\"'+1+1\"");
  assert.equal(escaped("-2+3"), "\"'-2+3\"");
  assert.equal(escaped("@SUM(A1)"), "\"'@SUM(A1)\"");
  assert.equal(escaped("\tTAB"), "\"'\tTAB\"");
  // normal values keep working, quotes/newlines are still escaped
  assert.equal(escaped("Alice Smith"), "\"Alice Smith\"");
  assert.equal(escaped('say "hi"\nnow'), "\"say \"\"hi\"\" now\"");
  assert.equal(escaped(null), "\"\"");
  assert.equal(escaped(undefined), "\"\"");
});
