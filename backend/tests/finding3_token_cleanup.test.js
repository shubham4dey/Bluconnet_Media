/**
 * Focused verification for FINDING-3: expired token metadata cleanup.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const auth = require("../middleware/auth");
const db = require("../config/database");

function ownProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function fakeRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

let tokenStoreData = { adminTokens: {} };

function withMockedDb(fn) {
  const originalRead = db.read;
  const originalWrite = db.write;
  db.read = (collection) => {
    if (collection === "settings") return tokenStoreData;
    return originalRead(collection);
  };
  db.write = (collection, data) => {
    if (collection === "settings" && data && typeof data === "object" && data.adminTokens) {
      Object.keys(data.adminTokens).forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(data.adminTokens, k)) {
          tokenStoreData.adminTokens[k] = data.adminTokens[k];
        }
      });
      // propagate deletions from pruning
      Object.keys(tokenStoreData.adminTokens).forEach((k) => {
        if (!Object.prototype.hasOwnProperty.call(data.adminTokens, k)) {
          delete tokenStoreData.adminTokens[k];
        }
      });
    } else {
      originalWrite(collection, data);
    }
  };
  try {
    return fn();
  } finally {
    db.read = originalRead;
    db.write = originalWrite;
  }
}

test("issuing a second token keeps the first valid token and its role", () => {
  withMockedDb(() => {
    tokenStoreData = { adminTokens: {} };
    const first = auth.issueToken("admin");
    const second = auth.issueToken("editor");
    assert.equal(auth.isValidToken(first), true);
    assert.equal(auth.isValidToken(second), true);

    auth.pruneExpiredTokens();
    assert.equal(auth.isValidToken(first), true);
    assert.equal(auth.isValidToken(second), true);

    const req = { headers: { authorization: "Bearer " + first } };
    const res = fakeRes();
    let authed = false;
    auth.requireAuth(req, res, () => { authed = true; });
    assert.equal(authed, true);
    const res2 = fakeRes();
    let allowed = false;
    auth.requireRole("admin")(req, res2, () => { allowed = true; });
    assert.equal(allowed, true);
  });
});

test("expired object-shaped and numeric tokens are rejected and pruned", () => {
  withMockedDb(() => {
    tokenStoreData = { adminTokens: {} };
    const token = auth.issueToken("admin");
    tokenStoreData.adminTokens[token].expiry = Date.now() - 1;
    assert.equal(auth.isValidToken(token), false);

    const legacy = "legacy-token";
    tokenStoreData.adminTokens[legacy] = Date.now() - 1;
    assert.equal(auth.isValidToken(legacy), false);

    auth.pruneExpiredTokens();
    assert.equal(ownProperty(tokenStoreData.adminTokens, token), false);
    assert.equal(ownProperty(tokenStoreData.adminTokens, legacy), false);
  });
});

test("valid tokens retain roles after pruning expired tokens", () => {
  withMockedDb(() => {
    tokenStoreData = { adminTokens: {} };
    const valid = auth.issueToken("editor");
    const expired = auth.issueToken("admin");
    tokenStoreData.adminTokens[expired].expiry = Date.now() - 1;

    auth.pruneExpiredTokens();
    assert.equal(auth.isValidToken(valid), true);
    assert.equal(ownProperty(tokenStoreData.adminTokens, expired), false);

    const req = { headers: { authorization: "Bearer " + valid } };
    const res = fakeRes();
    let authed = false;
    auth.requireAuth(req, res, () => { authed = true; });
    assert.equal(authed, true);
    const res2 = fakeRes();
    let allowed = false;
    auth.requireRole("editor")(req, res2, () => { allowed = true; });
    assert.equal(allowed, true);
  });
});

test("logout/revocation still invalidates tokens", () => {
  withMockedDb(() => {
    tokenStoreData = { adminTokens: {} };
    const token = auth.issueToken("admin");
    assert.equal(auth.revokeToken(token), true);
    assert.equal(auth.isValidToken(token), false);
    assert.equal(auth.revokeToken(token), false);
  });
});

test("prototype-chain tokens remain rejected", () => {
  for (const evil of ["__proto__", "constructor", "toString", "valueOf", "hasOwnProperty"]) {
    assert.equal(auth.isValidToken(evil), false);
    const res = fakeRes();
    let nexted = false;
    auth.requireAuth({ headers: { authorization: "Bearer " + evil } }, res, () => { nexted = true; });
    assert.equal(nexted, false);
    assert.equal(res.statusCode, 401);
  }
});