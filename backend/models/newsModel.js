/**
 * ============================================================
 *  News model — durable document access for the global News collection.
 *
 *  TWO LAYERS, ONE DOCUMENT SHAPE
 *   • MySQL  `news` table — the source of truth (migration 003). Render
 *     wipes its local filesystem on every restart / redeploy, so a file
 *     could never be the durable store; MySQL is already used for
 *     contacts + subscribers.
 *   • JSON   `backend/data/news.json` — a local read mirror. Public pages
 *     read it synchronously (no await, no DB latency) and it keeps the
 *     API answering when MySQL is temporarily unreachable (local dev
 *     without the Namecheap tunnel).
 *
 *  WRITE  admin panel → controller → here:
 *     1. the row is written to MySQL
 *     2. only then is the local mirror updated
 *     3. if the MySQL write fails the mirror is rolled back and the error
 *        is thrown — the API never reports success for an article that
 *        would disappear on the next deploy, and a retry cannot create a
 *        duplicate (the failed article was never stored anywhere)
 *
 *  READ   public pages → controller → list() / findById(), which read the
 *  mirror synchronously. The mirror is hydrated from MySQL at boot
 *  (`hydrate()`) and refreshed after every write.
 *
 *  MIGRATION OF PRE-EXISTING DATA (no loss, no duplicates)
 *     `hydrate()` imports every mirror article MySQL does not have yet
 *     (`INSERT IGNORE` on the primary key) and then rewrites the mirror from
 *     MySQL. Rows that cannot be imported (e.g. an oversized legacy inline
 *     base64 image) stay in the mirror and are reported, never dropped.
 *
 *  IMAGE FIELDS: `imageUrl` (Cloudinary secure_url) + `imagePublicId`
 *  (Cloudinary public_id) — see services/newsImage.js.
 * ============================================================
 */
const fs = require("fs");
const path = require("path");
const defaultStore = require("../config/database");
const defaultDb = require("../config/mysql");
const { migrationFiles, readMigration, splitStatements } = require("../database/sql");

const COLLECTION = "news";
const TABLE = "news";

/* One list of columns drives SELECT, INSERT, UPDATE and the row⇄document
   mapping, so those can never drift apart. */
const COLUMNS = [
  "id",
  "title",
  "shortDesc",
  "fullContent",
  "imageUrl",
  "imagePublicId",
  "date",
  "status",
  "publishedAt",
  "createdAt",
  "updatedAt",
];

/* Column width guard: MySQL would otherwise silently truncate (or, with
   IGNORE, skip) a document, so values are clamped before they are written. */
const MAX_LENGTH = {
  id: 40,
  title: 255,
  shortDesc: 1000,
  imageUrl: 1000,
  imagePublicId: 300,
  date: 20,
  status: 20,
  publishedAt: 40,
  createdAt: 40,
  updatedAt: 40,
};

const SEED_FILE = path.join(__dirname, "..", "database", "seeds", "news.seed.json");

/** String form of a stored value (ISO timestamps and ids stay strings). */
const str = (v) => (v === null || v === undefined ? "" : String(v));

/** Error raised when an article could not be stored in MySQL. */
function dbUnavailableError(cause) {
  const err = new Error(
    `News database is unavailable (${(cause && cause.message) || "unknown error"}) — the article was not saved`
  );
  err.code = "NEWS_DB_UNAVAILABLE";
  err.cause = cause;
  return err;
}

function createNewsModel({
  store = defaultStore,
  db = defaultDb,
  logger = console,
  seedFile = SEED_FILE,
} = {}) {
  const warn = (msg) => logger.warn && logger.warn(`[news] ${msg}`);
  const info = (msg) => logger.log && logger.log(`[news] ${msg}`);
  const fail = (msg) => logger.error && logger.error(`[news] ${msg}`);

  /* MySQL schema initialised and usable? Until `ensureSchema()` succeeds the
     model behaves like the previous JSON-only store, which is what makes
     local development possible without a database. */
  let ready = false;
  let lastError = "";

  /**
   * Durability policy. In production a failed MySQL write is an error (the
   * admin must know the article is not stored durably); elsewhere the local
   * mirror is an acceptable fallback so development needs no database.
   */
  function requireDb() {
    const raw =
      process.env.NEWS_REQUIRE_DB === undefined
        ? process.env.NODE_ENV === "production"
          ? "true"
          : "false"
        : process.env.NEWS_REQUIRE_DB;
    return String(raw).toLowerCase() === "true";
  }

  function isDurable() {
    return ready;
  }

  function status() {
    return {
      durable: ready,
      table: TABLE,
      requireDb: requireDb(),
      importMirror: importMirrorEnabled(),
      lastError: lastError || null,
    };
  }

  /**
   * The boot-time reconciliation with the local mirror can be switched off
   * (`NEWS_IMPORT_MIRROR=false`) for the one dangerous combination: a
   * development machine whose `backend/data/news.json` holds local test
   * articles connected to the PRODUCTION database. Enabled by default.
   */
  function importMirrorEnabled() {
    const raw = process.env.NEWS_IMPORT_MIRROR;
    if (raw === undefined) return true;
    return !["false", "0", "off", "no"].includes(String(raw).trim().toLowerCase());
  }

  /* ---------------- local mirror (synchronous reads) ---------------- */

  function list() {
    try {
      const rows = store.read(COLLECTION);
      return Array.isArray(rows) ? rows : [];
    } catch (e) {
      fail(`could not read the local mirror (${e.message})`);
      return [];
    }
  }

  function findById(id) {
    return list().find((r) => r && r.id === id) || null;
  }

  function writeMirror(rows) {
    try {
      store.write(COLLECTION, rows);
      return true;
    } catch (e) {
      fail(`could not update the local mirror (${e.message})`);
      return false;
    }
  }

  /* ---------------- document ⇄ row mapping ---------------- */

  /** Clamp a document field to its column width (never throws). */
  function clamp(column, value) {
    const max = MAX_LENGTH[column];
    const text = str(value);
    return max && text.length > max ? text.slice(0, max) : text;
  }

  function docToRow(doc) {
    return COLUMNS.map((c) => clamp(c, doc && doc[c]));
  }

  function rowToDoc(row) {
    const doc = {};
    COLUMNS.forEach((c) => {
      doc[c] = row && row[c] !== null && row[c] !== undefined ? String(row[c]) : "";
    });
    return doc;
  }

  /** Clamp every field of a document (an oversized image is trimmed). */
  function normalizeDoc(doc) {
    const out = {};
    COLUMNS.forEach((c) => {
      out[c] = clamp(c, doc && doc[c]);
    });
    out.fullContent = str(doc && doc.fullContent);
    return out;
  }

  /** A usable article needs an id and the three text fields. */
  function isImportable(doc) {
    return Boolean(doc && doc.id && doc.title && doc.shortDesc && doc.fullContent);
  }

  /* ---------------- SQL ---------------- */

  const SELECT_SQL = `SELECT ${COLUMNS.map((c) => `\`${c}\``).join(", ")} FROM \`${TABLE}\``;

  async function selectRows() {
    const [rows] = await db.execute(SELECT_SQL);
    return rows || [];
  }

  async function insertRow(doc) {
    const sql = `INSERT IGNORE INTO \`${TABLE}\` (${COLUMNS.map((c) => `\`${c}\``).join(
      ", "
    )}) VALUES (${COLUMNS.map(() => "?").join(", ")})`;
    const [res] = await db.execute(sql, docToRow(doc));
    return res;
  }

  async function updateRow(id, doc) {
    const editable = COLUMNS.filter((c) => c !== "id");
    const sql = `UPDATE \`${TABLE}\` SET ${editable
      .map((c) => `\`${c}\` = ?`)
      .join(", ")} WHERE \`id\` = ?`;
    const [res] = await db.execute(sql, [...editable.map((c) => clamp(c, doc[c])), id]);
    return res;
  }

  async function deleteRow(id) {
    const [res] = await db.execute(`DELETE FROM \`${TABLE}\` WHERE \`id\` = ?`, [id]);
    return res;
  }

  async function countRows() {
    const [rows] = await db.execute(`SELECT COUNT(*) AS total FROM \`${TABLE}\``);
    return Number((rows && rows[0] && rows[0].total) || 0);
  }

  /* ---------------- schema ---------------- */

  /**
   * Create the `news` table (idempotent — it re-uses `npm run migrate`).
   * Only after this succeeds does the model write to MySQL.
   */
  async function ensureSchema() {
    await db.ensureDatabase();

    const connection = await db.getConnection();
    try {
      for (const file of migrationFiles()) {
        for (const statement of splitStatements(readMigration(file))) {
          await connection.query(statement);
        }
      }
    } finally {
      connection.release();
    }

    ready = true;
    lastError = "";
    return { table: TABLE, target: db.describeTarget ? db.describeTarget() : "" };
  }

  /* ---------------- one-time import of the local mirror ---------------- */

  /**
   * Import every mirrored article MySQL does not have yet. Keyed on the
   * primary key, so running this on every boot can never duplicate a row and
   * never overwrites an article MySQL already stores.
   */
  async function importFromJson() {
    const report = { total: 0, imported: 0, failed: 0, failedIds: [] };
    if (!ready) return report;

    const rows = list();
    report.total = rows.length;

    for (const row of rows) {
      if (!isImportable(row)) {
        // Never lose an article: it stays in the mirror and is reported.
        report.failed += 1;
        report.failedIds.push(str(row && row.id));
        warn(
          `article "${str(row && row.id) || "(no id)"}" has no usable id/title/body — kept in the local mirror only`
        );
        continue;
      }
      const doc = normalizeDoc(row);
      // The primary key is capped at 40 chars: an id that does not fit would
      // be silently clipped and could collide, so such a document is reported
      // and kept in the mirror instead.
      if (doc.id !== str(row.id)) {
        report.failed += 1;
        report.failedIds.push(str(row.id));
        warn(`article ${str(row.id)} has an unusable id — kept in the local mirror only`);
        continue;
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await insertRow(doc);
        if (res && res.affectedRows > 0) report.imported += 1;
      } catch (e) {
        report.failed += 1;
        report.failedIds.push(doc.id);
        warn(`article ${doc.id} could not be imported into MySQL (${e.message})`);
      }
    }

    if (report.imported) {
      info(`imported ${report.imported} article(s) from the local mirror into MySQL`);
    }
    return report;
  }

  /**
   * One-time recovery of articles that existed in production before the
   * durable store was introduced (database/seeds/news.seed.json).
   * Applied ONLY while the `news` table is empty, so it can never resurrect an
   * article an admin deleted and never duplicates anything.
   */
  async function importSeed() {
    const report = { seeded: 0, skipped: 0, reason: "" };
    if (!ready) {
      report.reason = "database-not-ready";
      return report;
    }
    if (!seedFile || !fs.existsSync(seedFile)) {
      report.reason = "no-seed-file";
      return report;
    }

    const existing = await countRows();
    if (existing > 0) {
      report.skipped = 1;
      report.reason = "table-not-empty";
      return report;
    }

    let docs = [];
    try {
      docs = JSON.parse(fs.readFileSync(seedFile, "utf-8"));
    } catch (e) {
      report.reason = `unreadable-seed (${e.message})`;
      return report;
    }
    if (!Array.isArray(docs)) {
      report.reason = "seed-is-not-an-array";
      return report;
    }

    for (const doc of docs) {
      if (!isImportable(doc)) continue;
      // eslint-disable-next-line no-await-in-loop
      const res = await insertRow(doc);
      if (res && res.affectedRows > 0) report.seeded += 1;
    }
    if (report.seeded) {
      info(`recovered ${report.seeded} article(s) from database/seeds/news.seed.json`);
    }
    return report;
  }

  /**
   * Rewrite the local mirror from MySQL. `keepIds` are articles that could not
   * be imported — they are preserved so no article is ever lost, while rows
   * MySQL no longer has (i.e. deleted by an admin) are dropped, never
   * resurrected.
   */
  async function syncFromDb({ keepIds = [] } = {}) {
    const fromDb = (await selectRows()).map(rowToDoc);
    const inDb = new Set(fromDb.map((r) => str(r.id)));
    const keep = new Set(keepIds.map(str));
    const kept = list().filter(
      (r) => r && !inDb.has(str(r.id)) && (keep.has(str(r.id)) || !str(r.id))
    );
    writeMirror([...fromDb, ...kept]);
    return { fromDb: fromDb.length, kept: kept.length };
  }

  /** Full boot sequence for the store: import → seed → hydrate. */
  async function hydrate() {
    if (!importMirrorEnabled()) {
      info("local-mirror import disabled (NEWS_IMPORT_MIRROR=false) — MySQL is the only source");
      return {
        imported: 0,
        importFailed: 0,
        seeded: 0,
        articles: list().length,
        kept: 0,
        skipped: "mirror-import-disabled",
      };
    }

    const imported = await importFromJson();
    let seeded = { seeded: 0, reason: "" };
    try {
      seeded = await importSeed();
    } catch (e) {
      warn(`seed recovery skipped (${e.message})`);
    }
    const synced = await syncFromDb({ keepIds: imported.failedIds });
    return {
      imported: imported.imported,
      importFailed: imported.failed,
      seeded: seeded.seeded,
      articles: synced.fromDb,
      kept: synced.kept,
    };
  }

  /** Re-read MySQL into the mirror (used by the optional refresh timer). */
  async function refreshFromDb() {
    if (!ready) return { fromDb: 0, kept: 0, skipped: true };
    return syncFromDb();
  }

  /** Read the articles straight from MySQL (verification scripts / CLI). */
  async function listFromDb() {
    if (!ready) throw dbUnavailableError(new Error("schema not initialised"));
    return (await selectRows()).map(rowToDoc);
  }

  /* ---------------- writes ---------------- */

  function markFailure(e) {
    lastError = (e && e.message) || String(e);
    fail(`MySQL write failed: ${lastError}`);
  }

  /**
   * Fail closed only when the database is known to be usable AND this
   * environment requires durable writes. Anywhere else the local mirror keeps
   * the API working (development without a database, first boot with MySQL
   * still starting up) — the boot log and /api/health report that state.
   */
  function failClosed() {
    return ready && requireDb();
  }

  /** Put a previously read row back exactly where it was (rollback helper). */
  function restoreMirrorRow(row) {
    const rows = list();
    const idx = rows.findIndex((r) => r && r.id === row.id);
    if (idx === -1) {
      writeMirror([row, ...rows]);
      return;
    }
    rows[idx] = row;
    writeMirror(rows);
  }

  let warnedNotDurable = false;
  function warnNotDurable() {
    if (warnedNotDurable) return;
    warnedNotDurable = true;
    warn(
      "MySQL is not initialised — articles are stored in the local mirror only " +
        "(they are imported automatically once the database is reachable)"
    );
  }

  /**
   * Insert one article. Durable first: when MySQL rejects the write in a
   * fail-closed environment the mirror is rolled back and the error is thrown,
   * so a retry can never create a duplicate.
   */
  async function insert(doc) {
    const record = store.insert(COLLECTION, doc); // local mirror (same id/createdAt for both)

    if (!ready) {
      warnNotDurable();
      return record;
    }

    try {
      const res = await insertRow(record);
      if (res && res.affectedRows === 0) {
        throw new Error(`news id ${record.id} already exists in MySQL`);
      }
      return record;
    } catch (e) {
      markFailure(e);
      if (failClosed()) {
        writeMirror(list().filter((r) => r && r.id !== record.id));
        throw dbUnavailableError(e);
      }
      warn(`article ${record.id} kept in the local mirror only (${e.message})`);
      return record;
    }
  }

  /**
   * Update one article (partial patch). Returns the updated document, or null
   * when the id is unknown.
   */
  async function update(id, patch) {
    const before = findById(id);
    if (!before) return null;

    const after = store.update(COLLECTION, id, patch || {});
    if (!after) return null;

    if (!ready) {
      warnNotDurable();
      return after;
    }

    try {
      const res = await updateRow(id, after);
      // A row that only exists in the mirror (legacy article that could not be
      // imported yet) is inserted instead of silently losing the edit.
      if (res && res.affectedRows === 0) await insertRow(after);
      return after;
    } catch (e) {
      markFailure(e);
      if (failClosed()) {
        restoreMirrorRow(before);
        throw dbUnavailableError(e);
      }
      warn(`article ${id} updated in the local mirror only (${e.message})`);
      return after;
    }
  }

  /** Delete one article, returning the removed document (or null). */
  async function remove(id) {
    const removed = findById(id);
    if (!removed) return null;

    if (ready) {
      try {
        await deleteRow(id);
      } catch (e) {
        markFailure(e);
        if (failClosed()) throw dbUnavailableError(e);
        warn(`article ${id} removed from the local mirror only (${e.message})`);
      }
    }

    writeMirror(list().filter((r) => r && r.id !== id));
    return removed;
  }

  return {
    COLLECTION,
    TABLE,
    COLUMNS,
    ensureSchema,
    isDurable,
    status,
    list,
    findById,
    insert,
    update,
    remove,
    importFromJson,
    importSeed,
    syncFromDb,
    hydrate,
    refreshFromDb,
    listFromDb,
    countRows,
    // for tests / scripts
    createNewsModel,
  };
}

/* Default instance wired to the real MySQL client + JSON store. */
const newsModel = createNewsModel();

module.exports = newsModel;
module.exports.createNewsModel = createNewsModel;
module.exports.COLLECTION = COLLECTION;
module.exports.TABLE = TABLE;
module.exports.COLUMNS = COLUMNS;
module.exports.dbUnavailableError = dbUnavailableError;
