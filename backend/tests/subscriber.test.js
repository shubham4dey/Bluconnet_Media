/**
 * ============================================================
 *  Unit + integration tests - Newsletter subscription endpoint
 *  (POST /api/subscribe).
 *
 *  Covered layers:
 *    - models/subscriberModel.js: prepared INSERT, UNIQUE-email
 *      duplicate detection, migration 002 (schema) and the
 *      self-heal path when the table was never created.
 *    - controllers/subscriberController.js: validation,
 *      consent flag, honeypot, exact response bodies, and the
 *      guarantee that no SQL detail ever reaches the client.
 *    - routes/subscribeRoutes.js: the REAL router (rate limiter +
 *      reCAPTCHA guard + controller + model) exercised over HTTP
 *      with Google siteverify mocked and the MySQL driver stubbed
 *      by an in-memory `subscribers` table (UNIQUE index included).
 *
 *      npm test
 * ============================================================
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");

const mysql = require("../config/mysql");
const subscribers = require("../models/subscriberModel");
const controller = require("../controllers/subscriberController");
const subscribeRoutes = require("../routes/subscribeRoutes");

const ORIGINAL_FETCH = globalThis.fetch;

/* The secret is read per call by services/recaptcha.js - pin a test value so
   the guard runs (Google itself is mocked below, the real key never leaves
   the process). This file runs in its own process under `node --test`. */
process.env.RECAPTCHA_SECRET_KEY = "test-secret";

/* ---------- in-memory `subscribers` table (implements the model's SQL) ----- */
const storedRows = new Map(); // email -> row (UNIQUE like MySQL)
let nextInsertId = 100;

function duplicateError(email) {
  const err = new Error(
    "Duplicate entry '" + email + "' for key 'uniq_subscribers_email'"
  );
  err.code = "ER_DUP_ENTRY";
  err.errno = 1062;
  return err;
}

function defaultExecute(sql, params) {
  const s = String(sql)
    .replace(/\s+/g, " ")
    .trim();

  if (
    /^INSERT INTO `subscribers` \(`email`, `agreeToSubscribe`\) VALUES \(\?, \?\)$/.test(
      s
    )
  ) {
    const email = params[0];
    const agree = params[1];
    if (storedRows.has(email)) throw duplicateError(email);
    storedRows.set(email, { email: email, agreeToSubscribe: agree });
    return [{ insertId: nextInsertId++, affectedRows: 1 }, []];
  }

  throw new Error("unexpected SQL: " + s);
}

function defaultConnection() {
  return {
    query: async () => ({}),
    release() {},
  };
}

mysql.execute = async (sql, params = []) => defaultExecute(sql, params || []);
mysql.ensureDatabase = async () => "bluconnet_media";
mysql.getConnection = async () => defaultConnection();

/* Google siteverify mock - only tokens issued by this test pass. */
globalThis.fetch = async (input, init) => {
  const url =
    typeof input === "string" ? input : (input && input.url) || String(input);

  if (url.includes("google.com/recaptcha")) {
    const params = new URLSearchParams((init && init.body) || "");
    const accepted = params.get("response") === "valid-token";

    return {
      ok: true,
      json: async () =>
        accepted
          ? {
              success: true,
              score: 0.9,
              action: "subscribe",
              hostname: "bluconnetmedia.com",
            }
          : { success: false, "error-codes": ["invalid-input-response"] },
    };
  }

  return ORIGINAL_FETCH(input, init);
};

/* =========================== model tests =========================== */

test("insertSubscriber stores the row through a prepared INSERT (no string concatenation)", async () => {
  storedRows.clear();

  const record = await subscribers.insertSubscriber({
    email: "reader@example.com",
    agreeToSubscribe: true,
  });

  assert.equal(record.id, "100");
  assert.deepEqual(storedRows.get("reader@example.com"), {
    email: "reader@example.com",
    agreeToSubscribe: 1,
  });

  const noConsent = await subscribers.insertSubscriber({
    email: "no-consent@example.com",
    agreeToSubscribe: false,
  });
  assert.equal(noConsent.id, "101");
  assert.equal(storedRows.get("no-consent@example.com").agreeToSubscribe, 0);
});

test("duplicate / missing-schema errors are recognised by their MySQL codes", () => {
  assert.equal(subscribers.isDuplicateError(duplicateError("a@b.co")), true);
  assert.equal(subscribers.isDuplicateError({ errno: 1062 }), true);
  assert.equal(subscribers.isDuplicateError(null), false);
  assert.equal(subscribers.isDuplicateError(new Error("other")), false);

  assert.equal(
    subscribers.isMissingSchemaError({ code: "ER_NO_SUCH_TABLE" }),
    true
  );
  assert.equal(subscribers.isMissingSchemaError({ errno: 1146 }), true);
  assert.equal(
    subscribers.isMissingSchemaError({ code: "ER_BAD_DB_ERROR" }),
    true
  );
  assert.equal(subscribers.isMissingSchemaError({ errno: 1049 }), true);
  assert.equal(
    subscribers.isMissingSchemaError({ code: "ECONNREFUSED" }),
    false
  );
});

test("ensureSchema applies migration 002: subscribers table with a UNIQUE email index", async () => {
  const statements = [];
  const originalGetConnection = mysql.getConnection;

  mysql.getConnection = async () => ({
    query: async (statement) => {
      statements.push(String(statement));
      return {};
    },
    release() {},
  });

  try {
    await subscribers.ensureSchema();
  } finally {
    mysql.getConnection = originalGetConnection;
  }

  assert.ok(statements.length > 0, "migration statements were executed");

  const createTable = statements.find((s) =>
    /CREATE TABLE IF NOT EXISTS `subscribers`/.test(s)
  );
  assert.ok(createTable, "the subscribers table is created idempotently");
  assert.match(createTable, /UNIQUE KEY `uniq_subscribers_email` \(`email`\)/);
  assert.match(createTable, /`email` VARCHAR\(190\) NOT NULL/);
  assert.match(createTable, /`agreeToSubscribe` TINYINT\(1\)/);
  assert.match(createTable, /`status` VARCHAR\(20\)/);
});

test("a subscription taken after a failed boot self-heals: schema applied, insert retried", async () => {
  const originalExecute = mysql.execute;
  const originalGetConnection = mysql.getConnection;

  let attempts = 0;
  const migrationStatements = [];

  mysql.execute = async (sql, params = []) => {
    attempts += 1;
    if (attempts === 1) {
      const err = new Error("Table 'bluconnet_media.subscribers' doesn't exist");
      err.code = "ER_NO_SUCH_TABLE";
      err.errno = 1146;
      throw err;
    }
    return defaultExecute(sql, params);
  };

  mysql.getConnection = async () => ({
    query: async (statement) => {
      migrationStatements.push(String(statement));
      return {};
    },
    release() {},
  });

  try {
    const record = await subscribers.insertSubscriber({
      email: "healed@example.com",
      agreeToSubscribe: true,
    });

    assert.equal(record.id, String(nextInsertId - 1));
    assert.equal(storedRows.has("healed@example.com"), true);
    assert.equal(attempts, 2, "the insert was retried exactly once");
    assert.ok(
      migrationStatements.some((s) =>
        /CREATE TABLE IF NOT EXISTS `subscribers`/.test(s)
      ),
      "the idempotent migrations were applied before the retry"
    );
  } finally {
    mysql.execute = originalExecute;
    mysql.getConnection = originalGetConnection;
  }
});
/* ========================== controller tests ========================== */

function mockRes() {
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

test("normalize validates and normalises the subscription payload", () => {
  // missing everything
  let out = controller.normalize({});
  assert.deepEqual(out.data, { email: "", agreeToSubscribe: false });
  assert.ok(out.errors.indexOf("Email is required") !== -1);
  assert.ok(out.errors.indexOf("You must agree to subscribe") !== -1);

  // invalid format
  out = controller.normalize({ email: "not-an-email", agreeToSubscribe: true });
  assert.ok(out.errors.indexOf("Please provide a valid email address") !== -1);

  // oversized (> VARCHAR(190)) - rejected, never silently truncated
  out = controller.normalize({
    email: "a".repeat(200) + "@example.com",
    agreeToSubscribe: true,
  });
  assert.ok(out.errors.indexOf("Please provide a valid email address") !== -1);

  // control characters are refused
  out = controller.normalize({
    email: "a" + String.fromCharCode(1) + "b@example.com",
    agreeToSubscribe: true,
  });
  assert.ok(out.errors.indexOf("Please provide a valid email address") !== -1);

  // valid: trimmed + lower-cased
  out = controller.normalize({
    email: "  Reader@Example.COM  ",
    agreeToSubscribe: true,
  });
  assert.deepEqual(out.errors, []);
  assert.equal(out.data.email, "reader@example.com");
  assert.equal(out.data.agreeToSubscribe, true);

  // consent must be exactly `true` (not "true", not 1)
  out = controller.normalize({ email: "a@b.co", agreeToSubscribe: "true" });
  assert.ok(out.errors.indexOf("You must agree to subscribe") !== -1);
});

test("POST handler answers 400 for the honeypot and never touches the database", async () => {
  const originalInsert = subscribers.insertSubscriber;
  let insertCalled = false;

  subscribers.insertSubscriber = async () => {
    insertCalled = true;
    return { id: "1" };
  };

  try {
    const res = mockRes();
    await controller.createSubscriber(
      {
        body: {
          email: "bot@example.com",
          agreeToSubscribe: true,
          website: "spam.example.com",
        },
      },
      res
    );

    assert.equal(res.statusCode, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, controller.MESSAGES.validation);
    assert.equal(insertCalled, false);
  } finally {
    subscribers.insertSubscriber = originalInsert;
  }
});

test("POST handler answers 201 with the exact success body on a stored signup", async () => {
  const originalInsert = subscribers.insertSubscriber;
  subscribers.insertSubscriber = async () => ({ id: "42" });

  try {
    const res = mockRes();
    await controller.createSubscriber(
      { body: { email: "Reader@Example.com", agreeToSubscribe: true } },
      res
    );

    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, {
      success: true,
      message: controller.MESSAGES.success,
      data: { id: "42" },
    });
  } finally {
    subscribers.insertSubscriber = originalInsert;
  }
});

test("POST handler answers 409 when the UNIQUE email index rejects the insert", async () => {
  const originalInsert = subscribers.insertSubscriber;
  subscribers.insertSubscriber = async () => {
    throw duplicateError("dup@example.com");
  };

  try {
    const res = mockRes();
    await controller.createSubscriber(
      { body: { email: "dup@example.com", agreeToSubscribe: true } },
      res
    );

    assert.equal(res.statusCode, 409);
    assert.deepEqual(res.body, {
      success: false,
      message: controller.MESSAGES.duplicate,
    });
  } finally {
    subscribers.insertSubscriber = originalInsert;
  }
});

test("POST handler answers 500 without leaking any SQL error detail", async () => {
  const originalInsert = subscribers.insertSubscriber;
  const originalConsoleError = console.error;
  console.error = () => {}; // keep the test output clean

  subscribers.insertSubscriber = async () => {
    const err = new Error(
      "ER_ACCESS_DENIED_ERROR: Access denied for user 'root' (password=super-secret)"
    );
    err.code = "ER_ACCESS_DENIED_ERROR";
    throw err;
  };

  try {
    const res = mockRes();
    await controller.createSubscriber(
      { body: { email: "reader@example.com", agreeToSubscribe: true } },
      res
    );

    assert.equal(res.statusCode, 500);
    assert.deepEqual(res.body, {
      success: false,
      message: controller.MESSAGES.server,
    });

    const raw = JSON.stringify(res.body);
    assert.equal(raw.indexOf("super-secret"), -1);
    assert.equal(raw.indexOf("ER_ACCESS_DENIED"), -1);
  } finally {
    subscribers.insertSubscriber = originalInsert;
    console.error = originalConsoleError;
  }
});

/* ======================= HTTP tests (real router) ======================= */

async function withSubscribeServer(fn) {
  const app = express();
  app.use(express.json());
  app.use("/api/subscribe", subscribeRoutes);

  const server = app.listen(0);
  try {
    await fn(server.address().port);
  } finally {
    server.close();
  }
}

function postSubscribe(port, body, token) {
  const payload = Object.assign({}, body);
  if (token !== undefined) payload.recaptchaToken = token;

  return ORIGINAL_FETCH("http://127.0.0.1:" + port + "/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

test("HTTP: a request without a reCAPTCHA token never reaches the controller", async () => {
  await withSubscribeServer(async (port) => {
    const before = storedRows.size;
    const response = await postSubscribe(port, {
      email: "no-token@example.com",
      agreeToSubscribe: true,
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.deepEqual(body, { message: "reCAPTCHA verification failed" });
    assert.equal(storedRows.size, before, "nothing was stored");
  });
});

test("HTTP: a token rejected by Google is blocked with 403", async () => {
  await withSubscribeServer(async (port) => {
    const before = storedRows.size;
    const response = await postSubscribe(
      port,
      { email: "bot@example.com", agreeToSubscribe: true },
      "invalid-token"
    );

    assert.equal(response.status, 403);
    const body = await response.json();
    assert.deepEqual(body, { message: "reCAPTCHA verification failed" });
    assert.equal(storedRows.size, before, "nothing was stored");
  });
});

test("HTTP: an invalid email is refused with 400 even with a valid token", async () => {
  await withSubscribeServer(async (port) => {
    const response = await postSubscribe(
      port,
      { email: "definitely-not-an-email", agreeToSubscribe: true },
      "valid-token"
    );

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.message, controller.MESSAGES.validation);
    assert.deepEqual(body.errors, ["Please provide a valid email address"]);
  });
});

test("HTTP: a valid signup is stored in MySQL and answers 201", async () => {
  await withSubscribeServer(async (port) => {
    const response = await postSubscribe(
      port,
      { email: "  Mixed.Case@Example.COM  ", agreeToSubscribe: true },
      "valid-token"
    );

    assert.equal(response.status, 201);
    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(body.message, controller.MESSAGES.success);
    assert.equal(typeof body.data.id, "string");

    // normalised (trimmed + lower-cased) before it hit the UNIQUE index
    assert.equal(storedRows.has("mixed.case@example.com"), true);
  });
});

test("HTTP: subscribing the same address twice answers 409 (duplicate prevention)", async () => {
  await withSubscribeServer(async (port) => {
    const before = storedRows.size;
    const response = await postSubscribe(
      port,
      { email: "MIXED.CASE@example.com", agreeToSubscribe: true },
      "valid-token"
    );

    assert.equal(response.status, 409);
    const body = await response.json();
    assert.deepEqual(body, {
      success: false,
      message: controller.MESSAGES.duplicate,
    });
    assert.equal(storedRows.size, before, "no second row was created");
  });
});

test("HTTP: a filled honeypot field is refused with 400 and stored nothing", async () => {
  await withSubscribeServer(async (port) => {
    const before = storedRows.size;
    const response = await postSubscribe(
      port,
      {
        email: "honeypot@example.com",
        agreeToSubscribe: true,
        website: "spam.example.com",
      },
      "valid-token"
    );

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.message, controller.MESSAGES.validation);
    assert.equal(storedRows.has("honeypot@example.com"), false);
    assert.equal(storedRows.size, before);
  });
});

