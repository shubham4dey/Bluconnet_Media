/**
 * ============================================================
 *  Lightweight JSON file database (zero external dependencies)
 *  Stores collections as pretty-printed JSON files under /data.
 *  Atomic writes via tmp file + rename. Swap with MongoDB by
 *  reimplementing read/insert/update/remove if needed later.
 * ============================================================
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

const COLLECTIONS = [
  "leads",
  "meetings",
  "applications",
  "handoffs",
  "feedback",
  "sessions",
  "visitors",
];

function filePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  // settings.json is an object, everything else is an array
  if (!fs.existsSync(filePath("settings"))) {
    fs.writeFileSync(
      filePath("settings"),
      JSON.stringify(
        {
          webhookUrl: process.env.WEBHOOK_URL || "",
          crmWebhookUrl: process.env.CRM_WEBHOOK_URL || "",
          emailNotify: true,
          adminTokens: {},
          createdAt: new Date().toISOString(),
        },
        null,
        2
      )
    );
  }
  COLLECTIONS.forEach((c) => {
    if (!fs.existsSync(filePath(c))) fs.writeFileSync(filePath(c), "[]");
  });
}

function read(collection) {
  ensure();
  try {
    return JSON.parse(fs.readFileSync(filePath(collection), "utf-8"));
  } catch (e) {
    return collection === "settings" ? {} : [];
  }
}

function write(collection, data) {
  ensure();
  const tmp = filePath(collection) + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, filePath(collection));
}

function insert(collection, doc) {
  const rows = read(collection);
  const record = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: "new",
    ...doc,
  };
  rows.unshift(record);
  write(collection, rows);
  return record;
}

function update(collection, id, patch) {
  const rows = read(collection);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  rows[idx] = { ...rows[idx], ...patch, updatedAt: new Date().toISOString() };
  write(collection, rows);
  return rows[idx];
}

function findById(collection, id) {
  return read(collection).find((r) => r.id === id) || null;
}

module.exports = { ensure, read, write, insert, update, findById };

