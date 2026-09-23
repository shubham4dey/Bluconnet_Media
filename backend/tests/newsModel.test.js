/**
 * ============================================================
 *  Unit tests — News model (models/newsModel.js).
 *
 *  The MySQL client and the JSON store are injected, so the whole
 *  durability contract is exercised without a database:
 *    • articles are written to MySQL and mirrored locally
 *    • a failed MySQL write never leaves a phantom article behind
 *      (and a retry cannot create a duplicate)
 *    • pre-existing articles are imported exactly once (no duplicates,
 *      nothing overwritten, nothing lost)
 *    • public reads stay synchronous (local mirror)
 *
 *      npm test
 * ============================================================
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const {
  createNewsModel,
  dbUnavailableError,
  COLUMNS: NEWS_COLUMNS,
} = require("../models/newsModel");

const silentLogger = { log() {}, warn() {}, error() {} };

/* ---------- local JSON mirror (same contract as config/database) ---------- */
function makeMirror(rows = []) {
  let data = rows.map((r) => ({ ...r }));
  return {
    read: (collection) => (collection === "news" ? data.map((r) => ({ ...r })) : []),
    write: (collection, next) => {
      if (collection === "news") data = next.map((r) => ({ ...r }));
    },
    insert: (collection, doc) => {
      const record = {
        id: `gen-${data.length + 1}`,
        createdAt: "2026-09-23T00:00:00.000Z",
        status: "new",
        ...doc,
      };
      data = [record, ...data];
      return { ...record };
    },
    update: (collection, id, patch) => {
      const idx = data.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      data[idx] = { ...data[idx], ...patch, updatedAt: "2026-09-23T01:00:00.000Z" };
      return { ...data[idx] };
    },
    _data: () => data,
  };
}

/* ---------- tiny in-memory `news` table (understands the model's SQL) ------ */
function makeSql(rows = []) {
  const table = new Map();
  rows.forEach((r) => table.set(r.id, { ...r }));
  const calls = [];

  const client = {
    _table: table,
    _calls: calls,
    _fail: null,

    ensureDatabase: async () => {
      if (client._fail) throw client._fail;
      return "bluconnet_media";
    },
    describeTarget: () => "test@127.0.0.1:3306/bluconnet_media",
    getConnection: async () => {
      if (client._fail) throw client._fail;
      return { query: async () => ({}), release() {} };
    },

    async execute(sql, params = []) {
      const s = String(sql).replace(/\s+/g, " ").trim();
      calls.push({ sql: s, params });
      if (client._fail) throw client._fail;

      const insert = /^INSERT IGNORE INTO `news` \(([^)]+)\) VALUES/.exec(s);
      if (insert) {
        const cols = insert[1].split(",").map((c) => c.trim().replace(/`/g, ""));
        const row = {};
        cols.forEach((c, i) => {
          row[c] = params[i];
        });
        if (table.has(row.id)) return [{ affectedRows: 0 }, []];
        table.set(row.id, row);
        return [{ affectedRows: 1 }, []];
      }

      if (/^UPDATE `news` SET /.test(s)) {
        const [setPart] = s.split(" WHERE ");
        const cols = [...setPart.matchAll(/`([A-Za-z_]+)` = \?/g)].map((x) => x[1]);
        const row = table.get(params[params.length - 1]);
        if (!row) return [{ affectedRows: 0 }, []];
        cols.forEach((c, i) => {
          row[c] = params[i];
        });
        return [{ affectedRows: 1 }, []];
      }

      if (/^DELETE FROM `news` WHERE/.test(s)) {
        return [{ affectedRows: table.delete(params[0]) ? 1 : 0 }, []];
      }

      if (/^SELECT COUNT\(\*\) AS total FROM `news`$/.test(s)) {
        return [[{ total: table.size }], []];
      }

      if (/^SELECT .+ FROM `news`$/.test(s)) {
        return [[...table.values()].map((r) => ({ ...r })), []];
      }

      throw new Error(`unexpected SQL: ${s}`);
    },
  };
  return client;
}

/* ---------- fixtures ---------- */

function tempSeed(docs = []) {
  const file = path.join(
    os.tmpdir(),
    `news-seed-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
  );
  fs.writeFileSync(file, JSON.stringify(docs));
  return file;
}

function makeModel({ mysqlRows = [], mirrorRows = [], seed, fail = null } = {}) {
  const store = makeMirror(mirrorRows);
  const sql = makeSql(mysqlRows);
  sql._fail = fail;
  const model = createNewsModel({
    store,
    db: sql,
    logger: silentLogger,
    // empty temp seed by default: tests never touch database/seeds/news.seed.json
    seedFile: seed === null ? null : tempSeed(seed || []),
  });
  return { model, store, sql };
}

const ARTICLE = {
  title: "Durable news test",
  shortDesc: "Articles must survive a Render redeploy.",
  fullContent: "Body copy.",
  date: "2026-09-23",
  status: "published",
  imageUrl: "https://res.cloudinary.com/wyixfdon/image/upload/v1/bluconnet/news/a.png",
  imagePublicId: "bluconnet/news/a",
};

/** Run `fn` under a specific durability policy (production requires MySQL). */
async function withRequireDb(value, fn) {
  const beforeFlag = process.env.NEWS_REQUIRE_DB;
  const beforeEnv = process.env.NODE_ENV;
  process.env.NEWS_REQUIRE_DB = value;
  process.env.NODE_ENV = "production";
  try {
    return await fn();
  } finally {
    if (beforeFlag === undefined) delete process.env.NEWS_REQUIRE_DB;
    else process.env.NEWS_REQUIRE_DB = beforeFlag;
    if (beforeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = beforeEnv;
  }
}

/* ---------- reads ---------- */

test("public reads come from the local mirror and need no database", () => {
  const { model } = makeModel({ mirrorRows: [{ id: "a1", title: "Mirrored" }] });
  assert.equal(model.isDurable(), false);
  assert.equal(model.list().length, 1);
  assert.equal(model.findById("a1").title, "Mirrored");
  assert.equal(model.findById("missing"), null);
});

test("ensureSchema marks the store durable and reports it", async () => {
  const { model } = makeModel();
  const out = await model.ensureSchema();
  assert.equal(out.table, "news");
  assert.equal(model.isDurable(), true);
  assert.equal(model.status().durable, true);
});

test("an unavailable database at boot leaves the mirror-only store usable", async () => {
  const { model, store } = makeModel({
    mirrorRows: [{ id: "a1", title: "Kept" }],
    fail: new Error("ECONNREFUSED"),
  });
  await assert.rejects(() => model.ensureSchema());
  assert.equal(model.isDurable(), false);
  assert.equal(model.list().length, 1); // the site keeps working

  const record = await model.insert(ARTICLE); // non-production fallback
  assert.ok(record.id);
  assert.equal(store._data().length, 2);
});

/* ---------- durable writes ---------- */

test("insert writes the article to MySQL and mirrors it", async () => {
  const { model, store, sql } = makeModel();
  await model.ensureSchema();

  const record = await model.insert(ARTICLE);

  assert.ok(record.id);
  assert.equal(store._data().length, 1);
  assert.equal(sql._table.size, 1);
  assert.equal(sql._table.get(record.id).title, ARTICLE.title);
  assert.equal(sql._table.get(record.id).imageUrl, ARTICLE.imageUrl);
  assert.equal(sql._table.get(record.id).imagePublicId, "bluconnet/news/a");
  assert.match(sql._calls[0].sql, /^INSERT IGNORE INTO `news`/);
});

test("a failed durable write rolls the mirror back, throws and never duplicates", async () => {
  const { model, store, sql } = makeModel();
  await model.ensureSchema();

  await withRequireDb("true", async () => {
    sql._fail = new Error("ECONNREFUSED");
    await assert.rejects(
      () => model.insert(ARTICLE),
      (e) => {
        assert.equal(e.code, "NEWS_DB_UNAVAILABLE");
        return true;
      }
    );
    assert.equal(store._data().length, 0); // no phantom article

    sql._fail = null; // database back: a retry stores exactly ONE article
    const record = await model.insert(ARTICLE);
    assert.ok(record.id);
    assert.equal(store._data().length, 1);
    assert.equal(sql._table.size, 1);
  });
});

test("update patches MySQL and the mirror", async () => {
  const { model, store, sql } = makeModel();
  await model.ensureSchema();
  const record = await model.insert(ARTICLE);

  const updated = await model.update(record.id, { title: "Renamed" });

  assert.equal(updated.title, "Renamed");
  assert.equal(model.findById(record.id).title, "Renamed");
  assert.equal(store._data().find((r) => r.id === record.id).title, "Renamed");
  assert.equal(sql._table.get(record.id).title, "Renamed");
  assert.equal(await model.update("nope", { title: "x" }), null);
});

test("a failed durable update restores the previous article and throws", async () => {
  const { model, store, sql } = makeModel();
  await model.ensureSchema();
  const record = await model.insert(ARTICLE);

  await withRequireDb("true", async () => {
    sql._fail = new Error("ETIMEDOUT");
    await assert.rejects(
      () => model.update(record.id, { title: "Lost" }),
      (e) => {
        assert.equal(e.code, "NEWS_DB_UNAVAILABLE");
        return true;
      }
    );
  });

  assert.equal(model.findById(record.id).title, ARTICLE.title); // rolled back
  assert.equal(store._data().length, 1);
});

test("update self-heals an article that only exists in the mirror", async () => {
  const { model, sql } = makeModel({ mirrorRows: [{ ...ARTICLE, id: "local-1" }] });
  await model.ensureSchema();

  const updated = await model.update("local-1", { title: "Promoted" });

  assert.equal(updated.title, "Promoted");
  assert.equal(sql._table.get("local-1").title, "Promoted");
  assert.match(sql._calls[0].sql, /^UPDATE `news` SET /);
  assert.match(sql._calls[1].sql, /^INSERT IGNORE INTO `news`/);
});

test("remove deletes the article from MySQL and the mirror", async () => {
  const { model, store, sql } = makeModel();
  await model.ensureSchema();
  const record = await model.insert(ARTICLE);

  const removed = await model.remove(record.id);

  assert.equal(removed.id, record.id);
  assert.equal(sql._table.size, 0);
  assert.equal(store._data().length, 0);
  assert.equal(await model.remove(record.id), null);
});

test("a failed durable delete keeps the article everywhere and throws", async () => {
  const { model, store, sql } = makeModel();
  await model.ensureSchema();
  const record = await model.insert(ARTICLE);

  await withRequireDb("true", async () => {
    sql._fail = new Error("ECONNREFUSED");
    await assert.rejects(
      () => model.remove(record.id),
      (e) => {
        assert.equal(e.code, "NEWS_DB_UNAVAILABLE");
        return true;
      }
    );
  });

  assert.equal(store._data().length, 1); // the article is still there
  assert.equal(sql._table.size, 1);
});

/* ---------- migrating pre-existing data ---------- */

test("hydrate imports mirror articles MySQL does not have — exactly once", async () => {
  const existing = { ...ARTICLE, id: "db-1", title: "Already in MySQL" };
  const legacy = { ...ARTICLE, id: "mirror-1", title: "Only in the mirror" };
  const { model, store, sql } = makeModel({
    mysqlRows: [existing],
    mirrorRows: [existing, legacy],
  });

  await model.ensureSchema();
  const report = await model.hydrate();

  assert.equal(report.imported, 1); // just the missing one
  assert.equal(report.articles, 2);
  assert.equal(sql._table.size, 2);
  assert.equal(sql._table.get("db-1").title, "Already in MySQL"); // never overwritten
  assert.equal(sql._table.get("mirror-1").title, "Only in the mirror");

  const ids = store._data().map((r) => r.id);
  assert.deepEqual(ids.sort(), ["db-1", "mirror-1"]); // no duplicate rows

  // running it again is a no-op (idempotent on every deploy)
  const again = await model.hydrate();
  assert.equal(again.imported, 0);
  assert.equal(store._data().length, 2);
});

test("an article that cannot be imported stays in the mirror (never lost)", async () => {
  const broken = {
    ...ARTICLE,
    id: "x".repeat(60), // longer than the column allows
    title: "Legacy article",
  };
  const { model, store } = makeModel({ mirrorRows: [broken] });

  await model.ensureSchema();
  const report = await model.hydrate();

  assert.equal(report.importFailed, 1);
  assert.equal(report.kept, 1);
  assert.equal(store._data().length, 1);
  assert.equal(model.findById(broken.id).title, "Legacy article");
});

test("importSeed recovers the seeded article only while the table is empty", async () => {
  const seeded = { ...ARTICLE, id: "seed-1", title: "Recovered from production" };

  const empty = makeModel({ seed: [seeded] });
  await empty.model.ensureSchema();
  const report = await empty.model.hydrate();
  assert.equal(report.seeded, 1);
  assert.equal(empty.sql._table.get("seed-1").title, "Recovered from production");
  assert.equal(empty.store._data().length, 1);

  // A database that already holds articles is never touched by the seed.
  const populated = makeModel({
    seed: [seeded],
    mysqlRows: [{ ...ARTICLE, id: "db-1", title: "Real article" }],
  });
  await populated.model.ensureSchema();
  const skipped = await populated.model.hydrate();
  assert.equal(skipped.seeded, 0);
  assert.equal(populated.sql._table.has("seed-1"), false);
  assert.equal(populated.store._data().length, 1);
});

test("an oversized legacy image reference is clamped instead of failing", async () => {
  const legacy = {
    ...ARTICLE,
    id: "legacy-1",
    imageUrl: `data:image/png;base64,${"A".repeat(2000)}`,
  };
  const { model, sql } = makeModel({ mirrorRows: [legacy] });

  await model.ensureSchema();
  await model.hydrate();

  assert.equal(sql._table.get("legacy-1").imageUrl.length, 1000);
});

test("refreshFromDb mirrors articles written elsewhere back into the file", async () => {
  const { model, sql } = makeModel();
  await model.ensureSchema();
  sql._table.set("external-1", { ...ARTICLE, id: "external-1", title: "Manual SQL" });

  await model.refreshFromDb();

  assert.equal(model.list().length, 1);
  assert.equal(model.findById("external-1").title, "Manual SQL");
});

test("dbUnavailableError carries the NEWS_DB_UNAVAILABLE code", () => {
  const err = dbUnavailableError(new Error("boom"));
  assert.equal(err.code, "NEWS_DB_UNAVAILABLE");
  assert.match(err.message, /database is unavailable/);
});

test("the migration defines every column the model writes", () => {
  const tableSql = fs.readFileSync(
    path.join(__dirname, "..", "database", "migrations", "003_create_news_table.sql"),
    "utf-8"
  );

  assert.match(tableSql, /CREATE TABLE IF NOT EXISTS `news`/);
  assert.match(tableSql, /PRIMARY KEY \(`id`\)/);
  NEWS_COLUMNS.forEach((column) => {
    assert.ok(
      tableSql.includes(`\`${column}\``),
      `migration 003 is missing the \`${column}\` column`
    );
  });
});

test("NEWS_IMPORT_MIRROR=false leaves the local mirror untouched at boot", async () => {
  process.env.NEWS_IMPORT_MIRROR = "false";
  try {
    const { model, store, sql } = makeModel({ mirrorRows: [{ ...ARTICLE, id: "dev-1" }] });
    await model.ensureSchema();

    const report = await model.hydrate();

    assert.equal(report.skipped, "mirror-import-disabled");
    assert.equal(sql._table.size, 0); // nothing was pushed into the database
    assert.equal(store._data().length, 1); // nothing was deleted either
  } finally {
    delete process.env.NEWS_IMPORT_MIRROR;
  }
});
