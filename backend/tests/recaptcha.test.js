/**
 * ============================================================
 *  reCAPTCHA v3 verification test suite
 * ============================================================
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");

const {
  verifyRecaptchaToken,
  isConfigured,
  isHostnameAllowed,
  configuredMinScore,
  VERIFY_URL,
} = require("../services/recaptcha");
const {
  requireRecaptcha,
  readToken,
  FAILURE_MESSAGE,
} = require("../middleware/recaptcha");

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_FETCH = globalThis.fetch;

function restoreGlobals() {
  process.env = { ...ORIGINAL_ENV };
  globalThis.fetch = ORIGINAL_FETCH;
}

test("isConfigured reflects process.env.RECAPTCHA_SECRET_KEY", () => {
  try {
    delete process.env.RECAPTCHA_SECRET_KEY;
    assert.equal(isConfigured(), false);

    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    assert.equal(isConfigured(), true);
  } finally {
    restoreGlobals();
  }
});

test("configuredMinScore respects RECAPTCHA_MIN_SCORE", () => {
  try {
    delete process.env.RECAPTCHA_MIN_SCORE;
    assert.equal(configuredMinScore(), 0.5);

    process.env.RECAPTCHA_MIN_SCORE = "0.7";
    assert.equal(configuredMinScore(), 0.7);

    process.env.RECAPTCHA_MIN_SCORE = "invalid";
    assert.equal(configuredMinScore(), 0.5);
  } finally {
    restoreGlobals();
  }
});

test("isHostnameAllowed checks allowed host list", () => {
  assert.equal(isHostnameAllowed("bluconnetmedia.com"), true);
  assert.equal(isHostnameAllowed("www.bluconnetmedia.com"), true);
  assert.equal(isHostnameAllowed("sub.bluconnetmedia.com"), true);
  assert.equal(isHostnameAllowed("localhost"), true);
  assert.equal(isHostnameAllowed("127.0.0.1"), true);
  assert.equal(isHostnameAllowed("malicious-site.com"), false);
  assert.equal(isHostnameAllowed(""), false);
});

test("verifyRecaptchaToken rejects when secret key is not configured", async () => {
  try {
    delete process.env.RECAPTCHA_SECRET_KEY;
    const result = await verifyRecaptchaToken("dummy-token");
    assert.equal(result.ok, false);
    assert.equal(result.status, 403);
    assert.equal(result.reason, "not_configured");
  } finally {
    restoreGlobals();
  }
});

test("verifyRecaptchaToken rejects missing or blank token with status 400", async () => {
  try {
    process.env.RECAPTCHA_SECRET_KEY = "dummy-secret";
    const res1 = await verifyRecaptchaToken("");
    assert.equal(res1.ok, false);
    assert.equal(res1.status, 400);
    assert.equal(res1.reason, "missing_token");

    const res2 = await verifyRecaptchaToken("   ");
    assert.equal(res2.ok, false);
    assert.equal(res2.status, 400);

    const res3 = await verifyRecaptchaToken(null);
    assert.equal(res3.ok, false);
    assert.equal(res3.status, 400);
  } finally {
    restoreGlobals();
  }
});

test("verifyRecaptchaToken sends form-encoded POST to Google siteverify", async () => {
  let calledUrl = null;
  let calledOptions = null;

  globalThis.fetch = async (url, options) => {
    calledUrl = url;
    calledOptions = options;
    return {
      ok: true,
      json: async () => ({
        success: true,
        score: 0.9,
        action: "test_action",
        hostname: "bluconnetmedia.com",
      }),
    };
  };

  try {
    process.env.RECAPTCHA_SECRET_KEY = "my-secret-key-123";
    const result = await verifyRecaptchaToken("test-token-abc", {
      action: "test_action",
    });

    assert.equal(result.ok, true);
    assert.equal(result.score, 0.9);
    assert.equal(result.action, "test_action");
    assert.equal(calledUrl, VERIFY_URL);
    assert.equal(calledOptions.method, "POST");
    assert.equal(
      calledOptions.headers["Content-Type"],
      "application/x-www-form-urlencoded"
    );

    const parsed = new URLSearchParams(calledOptions.body);
    assert.equal(parsed.get("secret"), "my-secret-key-123");
    assert.equal(parsed.get("response"), "test-token-abc");
  } finally {
    restoreGlobals();
  }
});

test("verifyRecaptchaToken handles network failure cleanly", async () => {
  globalThis.fetch = async () => {
    throw new Error("Network offline");
  };

  try {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    const result = await verifyRecaptchaToken("token");
    assert.equal(result.ok, false);
    assert.equal(result.status, 403);
    assert.equal(result.reason, "network_error");
  } finally {
    restoreGlobals();
  }
});

test("verifyRecaptchaToken rejects when Google answers success: false", async () => {
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: false,
      "error-codes": ["invalid-input-response"],
    }),
  });

  try {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    const result = await verifyRecaptchaToken("token");
    assert.equal(result.ok, false);
    assert.equal(result.status, 403);
    assert.equal(result.reason, "invalid_token");
  } finally {
    restoreGlobals();
  }
});

test("verifyRecaptchaToken rejects when score is below threshold", async () => {
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      score: 0.3,
      action: "contact_form",
      hostname: "localhost",
    }),
  });

  try {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    const result = await verifyRecaptchaToken("token", {
      action: "contact_form",
      minScore: 0.5,
    });
    assert.equal(result.ok, false);
    assert.equal(result.status, 403);
    assert.equal(result.reason, "score_too_low");
    assert.equal(result.score, 0.3);
  } finally {
    restoreGlobals();
  }
});

test("verifyRecaptchaToken rejects when action does not match", async () => {
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      score: 0.9,
      action: "wrong_action",
      hostname: "localhost",
    }),
  });

  try {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    const result = await verifyRecaptchaToken("token", {
      action: "expected_action",
    });
    assert.equal(result.ok, false);
    assert.equal(result.status, 403);
    assert.equal(result.reason, "action_mismatch");
  } finally {
    restoreGlobals();
  }
});

test("verifyRecaptchaToken rejects unapproved hostname", async () => {
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      success: true,
      score: 0.9,
      action: "contact_form",
      hostname: "evil-phishing-domain.com",
    }),
  });

  try {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    const result = await verifyRecaptchaToken("token", {
      action: "contact_form",
    });
    assert.equal(result.ok, false);
    assert.equal(result.status, 403);
    assert.equal(result.reason, "hostname_not_allowed");
  } finally {
    restoreGlobals();
  }
});

// ---------------------------------------------------------------------
// Middleware Integration Tests with Express
// ---------------------------------------------------------------------

function createTestApp(guardOptions = {}) {
  const app = express();
  app.use(express.json());

  app.post(
    "/test-endpoint",
    requireRecaptcha(guardOptions),
    (req, res) => {
      res.json({
        ok: true,
        controllerRan: true,
        recaptcha: req.recaptcha,
      });
    }
  );

  return app;
}

test("readToken extracts from multiple supported body and header locations", () => {
  assert.equal(readToken({ body: { recaptchaToken: "t1" } }), "t1");
  assert.equal(readToken({ body: { recaptcha_token: "t2" } }), "t2");
  assert.equal(readToken({ body: { "g-recaptcha-response": "t3" } }), "t3");
  assert.equal(
    readToken({
      body: {},
      get: (header) => (header === "x-recaptcha-token" ? "t4" : null),
    }),
    "t4"
  );
  assert.equal(readToken({ body: {} }), "");
});

test("guard blocks request with missing token and returns 400 + exact JSON", async () => {
  try {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    const app = createTestApp({ action: "contact_form" });
    const server = app.listen(0);
    const port = server.address().port;

    try {
      const response = await fetch(`http://127.0.0.1:${port}/test-endpoint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Alice" }),
      });

      assert.equal(response.status, 400);
      const data = await response.json();
      assert.deepEqual(data, { message: FAILURE_MESSAGE });
    } finally {
      server.close();
    }
  } finally {
    restoreGlobals();
  }
});

test("guard blocks request when Google rejects token and returns 403 + exact JSON", async () => {
  globalThis.fetch = async (input, init) => {
    const urlStr = typeof input === "string" ? input : input?.url || String(input);
    if (urlStr.includes("google.com/recaptcha")) {
      return {
        ok: true,
        json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }),
      };
    }
    return ORIGINAL_FETCH(input, init);
  };

  try {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    const app = createTestApp({ action: "contact_form" });
    const server = app.listen(0);
    const port = server.address().port;

    try {
      const response = await ORIGINAL_FETCH(`http://127.0.0.1:${port}/test-endpoint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Alice",
          recaptchaToken: "invalid-token",
        }),
      });

      assert.equal(response.status, 403);
      const data = await response.json();
      assert.deepEqual(data, { message: FAILURE_MESSAGE });
    } finally {
      server.close();
    }
  } finally {
    restoreGlobals();
  }
});

test("guard blocks request when score is too low (403)", async () => {
  globalThis.fetch = async (input, init) => {
    const urlStr = typeof input === "string" ? input : input?.url || String(input);
    if (urlStr.includes("google.com/recaptcha")) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          score: 0.1,
          action: "contact_form",
          hostname: "localhost",
        }),
      };
    }
    return ORIGINAL_FETCH(input, init);
  };

  try {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    const app = createTestApp({ action: "contact_form" });
    const server = app.listen(0);
    const port = server.address().port;

    try {
      const response = await ORIGINAL_FETCH(`http://127.0.0.1:${port}/test-endpoint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recaptchaToken: "bot-token",
        }),
      });

      assert.equal(response.status, 403);
      const data = await response.json();
      assert.deepEqual(data, { message: FAILURE_MESSAGE });
    } finally {
      server.close();
    }
  } finally {
    restoreGlobals();
  }
});

test("guard passes valid request to controller and attaches req.recaptcha", async () => {
  globalThis.fetch = async (input, init) => {
    const urlStr = typeof input === "string" ? input : input?.url || String(input);
    if (urlStr.includes("google.com/recaptcha")) {
      return {
        ok: true,
        json: async () => ({
          success: true,
          score: 0.85,
          action: "contact_form",
          hostname: "bluconnetmedia.com",
        }),
      };
    }
    return ORIGINAL_FETCH(input, init);
  };

  try {
    process.env.RECAPTCHA_SECRET_KEY = "secret";
    const app = createTestApp({ action: "contact_form" });
    const server = app.listen(0);
    const port = server.address().port;

    try {
      const response = await ORIGINAL_FETCH(`http://127.0.0.1:${port}/test-endpoint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "John",
          recaptchaToken: "legit-token",
        }),
      });

      assert.equal(response.status, 200);
      const data = await response.json();
      assert.equal(data.controllerRan, true);
      assert.deepEqual(data.recaptcha, {
        score: 0.85,
        action: "contact_form",
        hostname: "bluconnetmedia.com",
      });
    } finally {
      server.close();
    }
  } finally {
    restoreGlobals();
  }
});
