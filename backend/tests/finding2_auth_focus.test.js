/**
 * Focused verification for FINDING-2: role-aware issueToken, authentication,
 * role authorization, logout/revocation, expired/invalid tokens, and
 * prototype-chain rejection.
 *
 * These tests run against the real `auth` module. We swap `db.read`/`db.write`
 * on the shared `db` object with functions that delegate to a simple
 * in-memory token store, so the tests are deterministic and isolated.
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const auth = require('../middleware/auth');
const db = require('../config/database');

function ownProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

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

// Module-level token store that the mock `db` reads/writes.
let tokenStoreData = { adminTokens: {} };

function withMockedDb(fn) {
  const originalRead = db.read;
  const originalWrite = db.write;

  db.read = (collection) => {
    if (collection === 'settings') {
      return tokenStoreData;
    }
    return originalRead(collection);
  };

  db.write = (collection, data) => {
    if (collection === 'settings' && data && typeof data === 'object') {
      if (data.adminTokens) {
        Object.assign(tokenStoreData.adminTokens, data.adminTokens);
      }
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

test('issueToken renders a role-aware token and stores expiry and role', () => {
  withMockedDb(() => {
    for (const role of ['super_admin', 'admin', 'editor']) {
      const token = auth.issueToken(role);
      assert.match(token, /^[a-f0-9]{64}$/);
      assert.equal(tokenStoreData.adminTokens[token].role, role);
      assert.ok(typeof tokenStoreData.adminTokens[token].expiry === 'number');
      assert.ok(tokenStoreData.adminTokens[token].expiry > Date.now());
    }
  });
});

test('auth issues role-aware tokens and supports authentication and role authorization', () => {
  withMockedDb(() => {
    // Issue and verify super_admin token before the next issue prunes it.
    const superAdmin = auth.issueToken('super_admin');
    assert.equal(auth.isValidToken(superAdmin), true);
    assert.equal(isRoleAuthOk(superAdmin, ['super_admin']), true);
    assert.equal(isRoleAuthOk(superAdmin, ['admin']), false);

    // Issue and verify admin token before any subsequent issue prunes it.
    const staff = auth.issueToken('admin');
    assert.equal(auth.isValidToken(staff), true);
    assert.equal(isRoleAuthOk(staff, ['admin']), true);
    assert.equal(isRoleAuthOk(staff, ['super_admin']), false);

    // Revocation (logout) invalidates the presented token immediately.
    assert.equal(auth.revokeToken(staff), true);
    assert.equal(auth.isValidToken(staff), false);
    assert.equal(auth.revokeToken(staff), false);
  });
});

test('expired and invalid tokens are rejected', () => {
  withMockedDb(() => {
    const token = auth.issueToken('super_admin');
    assert.equal(auth.isValidToken(token), true);

    // Force the stored token to expire.
    tokenStoreData.adminTokens[token].expiry = Date.now() - 1;
    assert.equal(auth.isValidToken(token), false);
  });
});

test('prototype-chain tokens can never authenticate', () => {
  for (const evil of ['__proto__', 'constructor', 'toString', 'valueOf', 'hasOwnProperty']) {
    assert.equal(auth.isValidToken(evil), false, '"' + evil + '" must be rejected');
    const res = fakeRes();
    let nexted = false;
    auth.requireAuth({ headers: { authorization: 'Bearer ' + evil } }, res, () => {
      nexted = true;
    });
    assert.equal(nexted, false);
    assert.equal(res.statusCode, 401);
  }
});

function isRoleAuthOk(token, allowedRoles) {
  if (!auth.isValidToken(token)) return false;
  if (!ownProperty(tokenStoreData.adminTokens, token)) return false;
  const role = tokenStoreData.adminTokens[token].role;
  return allowedRoles.includes(role);
}
