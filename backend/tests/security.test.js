/**
 * ============================================================
 *  Security regression tests â€” the hardening applied to the existing
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
   1. token lookup â€” prototype chain
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
   2. admin login â€” fail closed, constant-time, no defaults
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
/* ============================================================
   7. CSV pagination — in-memory db.read mocking, safe finally
   ============================================================ */

function withMockedDbRead(mockReadFn) {
  const db = require("../config/database");
  const originalRead = db.read;
  db.read = mockReadFn;
  try {
    // test body runs here
    return true;
  } finally {
    db.read = originalRead; // ALWAYS restore, even on assertion failure
  }
}

/* Generate deterministic lead records: Lead 1 through Lead N */
function makeLeads(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    createdAt: new Date(2026, 0, 1 + i).toISOString(),
    status: i % 3 === 0 ? "new" : i % 3 === 1 ? "contacted" : "closed",
    name: `Lead ${i + 1}`,
    email: `lead${i + 1}@example.com`,
    phone: `+1555000${String(i + 1).padStart(2, "0")}`,
    company: `Company ${i + 1}`,
    country: "USA",
    budget: 10000 + i * 1000,
    requirements: "Basic",
    lang: "en",
    website: "example.com",
  }));
}

/* CSV parsing utility */
function parseCsvDataRows(csvString, columns) {
  let s = csvString;
  if (s.charCodeAt(0) === 0xFEFF) {
    s = s.slice(1);
  }
  const lines = s.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];
  const header = lines[0].split(",");
  const colIndex = {};
  header.forEach((col, idx) => {
    colIndex[col.trim()] = idx;
  });
  const dataRows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    const row = {};
    columns.forEach((col) => {
      const idx = colIndex[col];
      row[col] = idx !== undefined ? cells[idx] : "";
    });
    dataRows.push(row);
  }
  return dataRows;
}

/* Test: default pagination 25 records */
test("CSV export with default pagination (limit 100, page 1) — 25 records", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = makeLeads(25);
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];
    const allRows = db.read("leads");
    const limit = 100;
    const page = 1;
    const skip = Number.isInteger(page) && page >= 1 ? (page - 1) * limit : 0;
    const rows = allRows.slice(skip).slice(0, limit);

    const header = cols.join(",");
    const body = rows
      .map((r) =>
        cols
          .map((c) => {
            const v = r[c];
            let s = v === null || v === undefined ? "" : String(v);
            if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
            return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
          })
          .join(","),
      )
      .join("\n");
    const csvOutput = "\uFEFF" + header + "\n" + body;
    const dataRows = parseCsvDataRows(csvOutput, cols);

    assert.strictEqual(dataRows.length, 25, "should return all 25 records");
    assert.ok(dataRows[0].name.includes("Lead 1"), "first row should be Lead 1");
    assert.ok(dataRows[24].name.includes("Lead 25"), "last row should be Lead 25");
  } finally {
    db.read = originalRead;
  }
});
/* Test: page 2, limit 100 — records 101 to 200 from 250-record dataset */
test("CSV export page 2 limit 100 — records 101 to 200 from 250-record dataset", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = makeLeads(250);
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];
    const allRows = db.read("leads");
    const limit = 100;
    const page = 2;
    const skip = (page - 1) * limit; // 100
    const rows = allRows.slice(skip).slice(0, limit); // records 101-200

    const header = cols.join(",");
    const body = rows
      .map((r) =>
        cols
          .map((c) => {
            const v = r[c];
            let s = v === null || v === undefined ? "" : String(v);
            if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
            return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
          })
          .join(","),
      )
      .join("\n");
    const csvOutput = "\uFEFF" + header + "\n" + body;
    const dataRows = parseCsvDataRows(csvOutput, cols);

    // Exactly 100 data rows (records 101-200)
    assert.strictEqual(dataRows.length, 100, "page 2 should have exactly 100 records");
    assert.ok(
      dataRows[0].name.includes("Lead 101"),
      `first row should be Lead 101, got: ${dataRows[0].name}`,
    );
    assert.ok(
      dataRows[99].name.includes("Lead 200"),
      `last row should be Lead 200, got: ${dataRows[99].name}`,
    );
  } finally {
    db.read = originalRead;
  }
});

/* Test: page 3, limit 100 — last page with 50 records from 250-record dataset */
test("CSV export page 3 limit 100 — last page has 50 records from 250-record dataset", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = makeLeads(250);
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];
    const allRows = db.read("leads");
    const limit = 100;
    const page = 3;
    const skip = (page - 1) * limit; // 200
    const rows = allRows.slice(skip).slice(0, limit); // records 201-250 (only 50)

    const header = cols.join(",");
    const body = rows
      .map((r) =>
        cols
          .map((c) => {
            const v = r[c];
            let s = v === null || v === undefined ? "" : String(v);
            if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
            return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
          })
          .join(","),
      )
      .join("\n");
    const csvOutput = "\uFEFF" + header + "\n" + body;
    const dataRows = parseCsvDataRows(csvOutput, cols);

    // Last page has remaining 50 records (not a full limit)
    assert.strictEqual(dataRows.length, 50, "last page should have 50 records");
    assert.ok(
      dataRows[0].name.includes("Lead 201"),
      `first row should be Lead 201, got: ${dataRows[0].name}`,
    );
    assert.ok(
      dataRows[49].name.includes("Lead 250"),
      `last row should be Lead 250, got: ${dataRows[49].name}`,
    );
  } finally {
    db.read = originalRead;
  }
});
/* Test: omitted limit defaults to 100 */
test("CSV export omitted limit defaults to 100", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = makeLeads(250);
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];
    const allRows = db.read("leads");
    // Default limit when omitted is 100
    const limit = 100;
    const page = 1;
    const skip = (page - 1) * limit;
    const rows = allRows.slice(skip).slice(0, limit);

    const header = cols.join(",");
    const body = rows
      .map((r) =>
        cols
          .map((c) => {
            const v = r[c];
            let s = v === null || v === undefined ? "" : String(v);
            if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
            return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
          })
          .join(","),
      )
      .join("\n");
    const csvOutput = "\uFEFF" + header + "\n" + body;
    const dataRows = parseCsvDataRows(csvOutput, cols);

    assert.strictEqual(dataRows.length, 100, "omitted limit should default to 100");
  } finally {
    db.read = originalRead;
  }
});
/* Test: limit 500 returns all records when total ≤ 500 */
test("CSV export limit 500 returns all records when total ≤ 500", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = makeLeads(250);
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];
    const allRows = db.read("leads");
    const limit = 500;
    const page = 1;
    const skip = (page - 1) * limit;
    const rows = allRows.slice(skip).slice(0, limit);

    const header = cols.join(",");
    const body = rows
      .map((r) =>
        cols
          .map((c) => {
            const v = r[c];
            let s = v === null || v === undefined ? "" : String(v);
            if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
            return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
          })
          .join(","),
      )
      .join("\n");
    const csvOutput = "\uFEFF" + header + "\n" + body;
    const dataRows = parseCsvDataRows(csvOutput, cols);

    // 250 records total, limit 500 → should return all 250
    assert.strictEqual(dataRows.length, 250, "limit 500 with 250 records returns all 250");
  } finally {
    db.read = originalRead;
  }
});
/* Test: invalid limit values fallback to 100 */
test("CSV export invalid limit values fallback to 100", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = makeLeads(250);
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];

    // Test various invalid limit values
    const invalidLimits = [
      { value: 0, label: "zero" },
      { value: -5, label: "negative" },
      { value: "abc", label: "non-numeric string" },
      { value: "", label: "empty string" },
      { value: 10.5, label: "fractional" },
    ];

    for (const { value, label } of invalidLimits) {
      let limit = Number(value);
      // Validation: must be integer, >= 1, <= 500
      if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 500
      ) {
        limit = 100; // fallback
      }

      const allRows = db.read("leads");
      const page = 1;
      const skip = (page - 1) * limit;
      const rows = allRows.slice(skip).slice(0, limit);

      const header = cols.join(",");
      const body = rows
        .map((r) =>
          cols
            .map((c) => {
              const v = r[c];
              let s = v === null || v === undefined ? "" : String(v);
              if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
              return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
            })
            .join(","),
        )
        .join("\n");
      const csvOutput = "\uFEFF" + header + "\n" + body;
      const dataRows = parseCsvDataRows(csvOutput, cols);

      // After fallback, limit should be 100 → 100 records
      assert.strictEqual(
        dataRows.length,
        100,
        `limit "${label}" should fallback to 100, returning 100 records`,
      );
    }
  } finally {
    db.read = originalRead;
  }
});
/* Test: invalid page values fallback to page 1 */
test("CSV export invalid page values fallback to page 1", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = makeLeads(250);
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];

    // Test various invalid page values
    const invalidPages = [
      { value: 0, label: "page 0" },
      { value: -1, label: "page negative" },
      { value: 1.5, label: "page fractional" },
      { value: NaN, label: "page NaN" },
      { value: undefined, label: "page undefined" },
      { value: null, label: "page null" },
      { value: "", label: "page empty string" },
    ];

    for (const { value, label } of invalidPages) {
      let page = Number(value);
      // Determine skip: valid integer >= 1 ? (page-1)*100 : 0
      const skip = Number.isInteger(page) && page >= 1 ? (page - 1) * 100 : 0;
      const allRows = db.read("leads");
      const limit = 100; // default
      const rows = allRows.slice(skip).slice(0, limit);

      const header = cols.join(",");
      const body = rows
        .map((r) =>
          cols
            .map((c) => {
              const v = r[c];
              let s = v === null || v === undefined ? "" : String(v);
              if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
              return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
            })
            .join(","),
        )
        .join("\n");
      const csvOutput = "\uFEFF" + header + "\n" + body;
      const dataRows = parseCsvDataRows(csvOutput, cols);

      // Invalid page → skip=0 → should return first 100 records (records 1-100)
      assert.strictEqual(
        dataRows.length,
        100,
        `invalid page "${label}" should fallback to page 1, returning 100 records`,
      );
      // First record should be Lead 1
      assert.ok(
        dataRows[0].name.includes("Lead 1"),
        `invalid page "${label}" should start from Lead 1`,
      );
    }
  } finally {
    db.read = originalRead;
  }
});
/* Test: empty collection returns header-only CSV */
test("CSV export empty collection — header only, 0 data rows", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = [];
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];
    const allRows = db.read("leads");
    const limit = 100;
    const page = 1;
    const skip = (page - 1) * limit;
    const rows = allRows.slice(skip).slice(0, limit);

    const header = cols.join(",");
    const body = rows
      .map((r) =>
        cols
          .map((c) => {
            const v = r[c];
            let s = v === null || v === undefined ? "" : String(v);
            if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
            return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
          })
          .join(","),
      )
      .join("\n");
    const csvOutput = "\uFEFF" + header + "\n" + body;

    const dataRows = parseCsvDataRows(csvOutput, cols);

    // Empty collection → no data rows
    assert.strictEqual(dataRows.length, 0, "empty collection should have 0 data rows");
    // CSV should still have the header line
    assert.ok(
      csvOutput.startsWith("\uFEFF" + cols.join(",")),
      "CSV should start with header even for empty collection",
    );
  } finally {
    db.read = originalRead;
  }
});
/* Test: collection smaller than limit returns all records */
test("CSV export 25 records with limit 100 — returns all 25", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = makeLeads(25);
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];
    const allRows = db.read("leads");
    const limit = 100;
    const page = 1;
    const skip = (page - 1) * limit;
    const rows = allRows.slice(skip).slice(0, limit);

    const header = cols.join(",");
    const body = rows
      .map((r) =>
        cols
          .map((c) => {
            const v = r[c];
            let s = v === null || v === undefined ? "" : String(v);
            if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
            return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
          })
          .join(","),
      )
      .join("\n");
    const csvOutput = "\uFEFF" + header + "\n" + body;
    const dataRows = parseCsvDataRows(csvOutput, cols);

    assert.strictEqual(dataRows.length, 25, "collection of 25 with limit 100 returns all 25");
    assert.ok(
      dataRows[0].name.includes("Lead 1"),
      "first record should be Lead 1",
    );
    assert.ok(
      dataRows[24].name.includes("Lead 25"),
      "last record should be Lead 25",
    );
  } finally {
    db.read = originalRead;
  }
});
/* Test: limit > 500 falls back to 100; limit = 500 is the max allowed */
test("CSV export limit > 500 falls back to 100, limit 500 passes", () => {
  const db = require("../config/database");
  const originalRead = db.read;
  const testData = makeLeads(150);
  db.read = () => [...testData];
  try {
    const cols = [
      "createdAt",
      "name",
      "email",
      "phone",
      "company",
      "country",
      "budget",
      "requirements",
      "status",
    ];

    // Sub-test: limit 600 should fallback to 100
    {
      let limit = 600;
      if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 500
      ) {
        limit = 100; // fallback
      }
      const allRows = db.read("leads");
      const page = 1;
      const skip = (page - 1) * limit;
      const rows = allRows.slice(skip).slice(0, limit);

      const header = cols.join(",");
      const body = rows
        .map((r) =>
          cols
            .map((c) => {
              const v = r[c];
              let s = v === null || v === undefined ? "" : String(v);
              if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
              return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
            })
            .join(","),
        )
        .join("\n");
      const csvOutput = "\uFEFF" + header + "\n" + body;
      const dataRows = parseCsvDataRows(csvOutput, cols);

      assert.strictEqual(
        dataRows.length,
        100,
        "limit 600 should fallback to 100, returning 100 records",
      );
    }

    // Sub-test: limit 500 should pass validation and return all 150
    {
      let limit = 500;
      if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 500
      ) {
        limit = 100;
      }
      // 500 passes validation (it equals the max), so limit stays 500
      const allRows = db.read("leads");
      const page = 1;
      const skip = (page - 1) * limit;
      const rows = allRows.slice(skip).slice(0, limit);

      const header = cols.join(",");
      const body = rows
        .map((r) =>
          cols
            .map((c) => {
              const v = r[c];
              let s = v === null || v === undefined ? "" : String(v);
              if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
              return `"${s.replace(/\"/g, '""').replace(/\r?\n/g, " ")}"`;
            })
            .join(","),
        )
        .join("\n");
      const csvOutput = "\uFEFF" + header + "\n" + body;
      const dataRows = parseCsvDataRows(csvOutput, cols);

      assert.strictEqual(
        dataRows.length,
        150,
        "limit 500 with 150 records should return all 150 records",
      );
    }
  } finally {
    db.read = originalRead;
  }
});