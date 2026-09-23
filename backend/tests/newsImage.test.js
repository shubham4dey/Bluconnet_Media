/**
 * ============================================================
 *  Unit tests — News image service (services/newsImage.js).
 *
 *  Cloudinary, the document store and fetch are injected, so every
 *  failure path is exercised without touching the network or the real
 *  database. The key guarantees under test:
 *    • a permanent Cloudinary URL + public_id is what gets persisted
 *    • a failed upload NEVER leaves a broken image URL behind
 *    • replaced/deleted assets are removed from Cloudinary
 *    • legacy local / inline / external references are migrated
 *
 *      npm test
 * ============================================================
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const cloudinary = require("../services/cloudinary");
const { createNewsImageService, CLASS } = require("../services/newsImage");

const CLOUD_URL =
  "https://res.cloudinary.com/wyixfdon/image/upload/v1786000000/bluconnet/news/uploaded.png";
const CLOUD_PUBLIC_ID = "bluconnet/news/uploaded";

const silentLogger = { log() {}, warn() {}, error() {} };

function makeFakeCloud(overrides = {}) {
  const uploads = [];
  const destroyed = [];
  return {
    isConfigured: () => true,
    cloudName: () => "wyixfdon",
    NEWS_FOLDER: "bluconnet/news",
    // reuse the real URL parsing so the tests stay honest
    isCloudinaryUrl: cloudinary.isCloudinaryUrl,
    publicIdFromUrl: cloudinary.publicIdFromUrl,
    urlFromPublicId: cloudinary.urlFromPublicId,
    uploadBuffer: async (buffer, opts) => {
      uploads.push({ buffer, opts });
      return {
        secureUrl: CLOUD_URL,
        url: CLOUD_URL,
        publicId: CLOUD_PUBLIC_ID,
        width: 1200,
        height: 630,
        bytes: buffer.length,
        format: "png",
      };
    },
    destroy: async (publicId) => {
      destroyed.push(publicId);
      return { result: "ok", removed: true };
    },
    _uploads: uploads,
    _destroyed: destroyed,
    ...overrides,
  };
}

function makeStore(rows = []) {
  const data = rows.map((r) => ({ ...r }));
  return {
    list: () => data,
    update: (id, patch) => {
      const i = data.findIndex((r) => r.id === id);
      if (i >= 0) data[i] = { ...data[i], ...patch };
      return data[i];
    },
    _data: data,
  };
}

function tempUploadDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "news-image-"));
}

function makeService(opts = {}) {
  return createNewsImageService({
    cloud: makeFakeCloud(),
    store: makeStore(),
    uploadDir: tempUploadDir(),
    fetchImpl: null,
    logger: silentLogger,
    ...opts,
  });
}

test("keeps an existing Cloudinary secure_url and derives its public_id", async () => {
  const svc = makeService();
  const url =
    "https://res.cloudinary.com/wyixfdon/image/upload/v1786004101/affise-logo_g4dnxg.png";
  const res = await svc.persistImage(url);
  assert.equal(res.imageUrl, url);
  assert.equal(res.imagePublicId, "affise-logo_g4dnxg");
  assert.equal(res.dropped, false);
});

test("empty image stays empty", async () => {
  const svc = makeService();
  const res = await svc.persistImage("");
  assert.equal(res.imageUrl, "");
  assert.equal(res.imagePublicId, "");
  assert.equal(res.dropped, false);
});

test("re-uploads a legacy local /uploads image to Cloudinary", async () => {
  const dir = tempUploadDir();
  fs.writeFileSync(path.join(dir, "legacy.png"), Buffer.from([1, 2, 3]));
  const cloud = makeFakeCloud();
  const svc = makeService({ cloud, uploadDir: dir });

  const res = await svc.persistImage("/uploads/legacy.png");

  assert.equal(res.migrated, true);
  assert.equal(res.imageUrl, CLOUD_URL);
  assert.equal(res.imagePublicId, CLOUD_PUBLIC_ID);
  assert.deepEqual(cloud._uploads[0].buffer, Buffer.from([1, 2, 3]));
  assert.equal(cloud._uploads[0].opts.filename, "legacy.png");
});

test("drops a legacy local path whose file no longer exists", async () => {
  const svc = makeService();
  const res = await svc.persistImage("/uploads/does-not-exist.png");
  assert.equal(res.imageUrl, "");
  assert.equal(res.dropped, true);
  assert.equal(res.reason, "local file not found");
});

test("a failing Cloudinary upload never yields an image URL", async () => {
  const dir = tempUploadDir();
  fs.writeFileSync(path.join(dir, "legacy.png"), Buffer.from([9]));
  const svc = makeService({
    cloud: makeFakeCloud({
      uploadBuffer: async () => {
        throw new Error("boom");
      },
    }),
    uploadDir: dir,
  });

  const res = await svc.persistImage("/uploads/legacy.png");
  assert.equal(res.imageUrl, "");
  assert.equal(res.imagePublicId, "");
  assert.equal(res.dropped, true);
  assert.match(res.reason, /upload failed: boom/);
});

test("re-uploads a legacy inline base64 image to Cloudinary", async () => {
  const cloud = makeFakeCloud();
  const svc = makeService({ cloud });
  const b64 = Buffer.from("inline-bytes").toString("base64");

  const res = await svc.persistImage(`data:image/png;base64,${b64}`);

  assert.equal(res.migrated, true);
  assert.equal(res.imageUrl, CLOUD_URL);
  assert.deepEqual(cloud._uploads[0].buffer, Buffer.from("inline-bytes"));
});

test("keeps an inline image untouched while Cloudinary is not configured", async () => {
  const svc = makeService({ cloud: makeFakeCloud({ isConfigured: () => false }) });
  const inline = `data:image/png;base64,${Buffer.from("x").toString("base64")}`;
  const res = await svc.persistImage(inline);
  assert.equal(res.imageUrl, inline);
  assert.equal(res.dropped, false);
  assert.equal(res.reason, "cloudinary-not-configured");
});

test("drops an unusable reference instead of storing it", async () => {
  const svc = makeService();
  const res = await svc.persistImage("javascript:alert(1)");
  assert.equal(res.imageUrl, "");
  assert.equal(res.dropped, true);
  assert.equal(res.kind, CLASS.INVALID);
});
test("external URLs are kept as-is unless remote migration is requested", async () => {
  const url = "https://blog.bluconnetmedia.com/wp-content/uploads/2025/12/pic.jpg";
  const svc = makeService();
  const kept = await svc.persistImage(url);
  assert.equal(kept.imageUrl, url);
  assert.equal(kept.reason, "remote-kept");
});

test("remote migration re-hosts a reachable external image on Cloudinary", async () => {
  const url = "https://blog.bluconnetmedia.com/wp-content/uploads/2025/12/pic.jpg";
  const cloud = makeFakeCloud();
  const svc = makeService({
    cloud,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => Uint8Array.from([7, 7, 7]).buffer,
    }),
  });

  const res = await svc.persistImage(url, { fetchRemote: true });

  assert.equal(res.migrated, true);
  assert.equal(res.imageUrl, CLOUD_URL);
  assert.deepEqual(cloud._uploads[0].buffer, Buffer.from([7, 7, 7]));
});

test("an unreachable external image is kept (never silently lost)", async () => {
  const url = "https://blog.bluconnetmedia.com/wp-content/uploads/2025/12/gone.jpg";
  const svc = makeService({
    fetchImpl: async () => {
      throw new Error("ECONNREFUSED");
    },
  });

  const res = await svc.persistImage(url, { fetchRemote: true });

  assert.equal(res.imageUrl, url);
  assert.equal(res.dropped, false);
  assert.match(res.reason, /remote-unreachable/);
});

test("removeImage deletes a stored public_id", async () => {
  const cloud = makeFakeCloud();
  const svc = makeService({ cloud });
  const res = await svc.removeImage(CLOUD_PUBLIC_ID);
  assert.equal(res.removed, true);
  assert.deepEqual(cloud._destroyed, [CLOUD_PUBLIC_ID]);
});

test("removeImage derives the public_id from a secure_url", async () => {
  const cloud = makeFakeCloud();
  const svc = makeService({ cloud });
  const res = await svc.removeImage(
    "https://res.cloudinary.com/wyixfdon/image/upload/v1/bluconnet/news/old.png"
  );
  assert.equal(res.removed, true);
  assert.deepEqual(cloud._destroyed, ["bluconnet/news/old"]);
});

test("removeImage ignores non-Cloudinary references", async () => {
  const cloud = makeFakeCloud();
  const svc = makeService({ cloud });
  const res = await svc.removeImage("/uploads/legacy.png");
  assert.equal(res.removed, false);
  assert.deepEqual(cloud._destroyed, []);
});

test("removeImage never throws when Cloudinary fails", async () => {
  const svc = makeService({
    cloud: makeFakeCloud({
      destroy: async () => {
        throw new Error("rate limited");
      },
    }),
  });
  const res = await svc.removeImage(CLOUD_PUBLIC_ID);
  assert.equal(res.removed, false);
  assert.equal(res.reason, "rate limited");
});

test("migrateNewsImages upgrades recoverable references only", async () => {
  const dir = tempUploadDir();
  fs.writeFileSync(path.join(dir, "legacy.png"), Buffer.from([4, 5]));
  const store = makeStore([
    { id: "1", imageUrl: CLOUD_URL, imagePublicId: CLOUD_PUBLIC_ID }, // already fine
    { id: "2", imageUrl: "https://res.cloudinary.com/wyixfdon/image/upload/v1/pic_def.png" }, // backfill
    { id: "3", imageUrl: "/uploads/legacy.png" }, // migrated
    { id: "4", imageUrl: "/uploads/missing.png" }, // unrecoverable
    { id: "5", imageUrl: "https://blog.example.com/pic.jpg" }, // remote, skipped
    { id: "6", imageUrl: "not-a-path" }, // invalid
    { id: "7", imageUrl: "" }, // nothing to do
  ]);
  const svc = makeService({ store, uploadDir: dir });

  const report = await svc.migrateNewsImages();

  assert.equal(report.scanned, 7);
  assert.equal(report.migrated, 2);
  assert.equal(report.unmigrated, 2);
  assert.equal(report.skipped, 3);

  const byId = (id) => store._data.find((r) => r.id === id);
  assert.equal(byId("2").imagePublicId, "pic_def");
  assert.equal(byId("3").imageUrl, CLOUD_URL);
  assert.equal(byId("3").imagePublicId, CLOUD_PUBLIC_ID);
  assert.equal(byId("4").imageUrl, "/uploads/missing.png"); // untouched
  assert.equal(byId("5").imageUrl, "https://blog.example.com/pic.jpg");
});

test("migrateNewsImages rebuilds a lost imageUrl from a stored public_id", async () => {
  const store = makeStore([
    // The URL was lost (publish interrupted mid-upload, hand-edited row) while
    // the asset itself never left Cloudinary: the public_id is enough to bring
    // the image back instead of the placeholder.
    { id: "1", imageUrl: "", imagePublicId: "bluconnet/news/kept_pic" },
    // Nothing to rebuild from -> left alone.
    { id: "2", imageUrl: "", imagePublicId: "" },
  ]);
  const svc = makeService({ store });

  const report = await svc.migrateNewsImages();

  assert.equal(report.scanned, 2);
  assert.equal(report.migrated, 1);
  assert.equal(report.skipped, 1);
  assert.match(store._data[0].imageUrl, /\/image\/upload\/bluconnet\/news\/kept_pic$/);
  assert.equal(store._data[0].imagePublicId, "bluconnet/news/kept_pic");
  assert.equal(store._data[1].imageUrl, "");

  // Dry-run must report without touching the row.
  const store2 = makeStore([{ id: "1", imageUrl: "", imagePublicId: "bluconnet/news/kept_pic" }]);
  const dry = await makeService({ store: store2 }).migrateNewsImages({ dryRun: true });
  assert.equal(dry.migrated, 1);
  assert.equal(store2._data[0].imageUrl, "");
});

test("migrateNewsImages can also re-host external URLs and supports dry-run", async () => {
  const store = makeStore([{ id: "1", imageUrl: "https://blog.example.com/pic.jpg" }]);
  const cloud = makeFakeCloud();
  const svc = makeService({
    cloud,
    store,
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      arrayBuffer: async () => Uint8Array.from([1]).buffer,
    }),
  });

  const dry = await svc.migrateNewsImages({ allowRemote: true, dryRun: true });
  assert.equal(dry.migrated, 1);
  assert.equal(store._data[0].imageUrl, "https://blog.example.com/pic.jpg"); // not written

  const real = await svc.migrateNewsImages({ allowRemote: true });
  assert.equal(real.migrated, 1);
  assert.equal(store._data[0].imageUrl, CLOUD_URL);
  assert.equal(store._data[0].imagePublicId, CLOUD_PUBLIC_ID);
});

test("migrateNewsImages survives an unreadable store", async () => {
  const svc = makeService({
    store: {
      list() {
        throw new Error("db down");
      },
    },
  });
  const report = await svc.migrateNewsImages();
  assert.equal(report.scanned, 0);
  assert.equal(report.migrated, 0);
});
