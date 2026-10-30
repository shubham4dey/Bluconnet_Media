const test = require('node:test');
const assert = require('node:assert/strict');
const admin = require('../controllers/adminController');
const rl = require('../middleware/rateLimit');

function fakeRes() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    retryAfter: undefined,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    set(k, v) { this.headers[k.toLowerCase()] = v; },
  };
}
function fakeReq(body) { return { body: body || {}, headers: {}, ip: '203.0.113.9' }; }

test('manual throttle checks', () => {
  const originalUser = process.env.ADMIN_USER;
  const originalPass = process.env.ADMIN_PASS;
  process.env.ADMIN_USER = 'admin';
  process.env.ADMIN_PASS = 'secret';
  rl.loginAttempts.clear();
  rl.MAX_LOGIN_ATTEMPTS = 3;
  rl.LOGIN_LOCKOUT_MS = 1000;

  // missing username -> no throw, invalid credentials
  let res = fakeRes();
  admin.login(fakeReq({ username: '', password: 'x' }), res);
  assert.equal(res.statusCode, 401);
  assert.equal(rl.loginAttempts.size, 0);

  // normalization: ' Admin ' and 'ADMIN' same bucket
  for (let i = 0; i < 2; i++) {
    res = fakeRes();
    admin.login(fakeReq({ username: ' Admin ', password: 'wrong' }), res);
    assert.equal(res.statusCode, 401);
  }
  assert.equal(rl.loginAttempts.has('admin'), true);
  assert.equal(rl.loginAttempts.get('admin').count, 2);

  // third failure locks
  res = fakeRes();
  admin.login(fakeReq({ username: 'ADMIN', password: 'wrong' }), res);
  assert.equal(res.statusCode, 429);
  assert.ok(res.headers['retry-after']);
  assert.equal(res.body.retryAfter, Number(res.headers['retry-after']));

  // while locked, request returns 429 with Retry-After
  res = fakeRes();
  admin.login(fakeReq({ username: 'admin', password: 'secret' }), res);
  assert.equal(res.statusCode, 429);
  assert.ok(Number(res.headers['retry-after']) >= 1);

  // successful login after expiry resets
  const entry = rl.loginAttempts.get('admin');
  entry.lockedUntil = Date.now() - 1;
  rl.loginAttempts.set('admin', entry);
  rl.pruneExpiredLoginAttempts();
  assert.equal(rl.loginAttempts.has('admin'), false);

  res = fakeRes();
  admin.login(fakeReq({ username: 'admin', password: 'secret' }), res);
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.token);
  assert.equal(rl.loginAttempts.has('admin'), false);

  // existing IP limiter still exported
  assert.ok(rl.authLimiter);

  // restore
  rl.loginAttempts.clear();
  if (originalUser === undefined) delete process.env.ADMIN_USER; else process.env.ADMIN_USER = originalUser;
  if (originalPass === undefined) delete process.env.ADMIN_PASS; else process.env.ADMIN_PASS = originalPass;
});