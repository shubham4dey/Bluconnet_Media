/**
 * ============================================================
 *  Controller tests — News image lifecycle end to end.
 *
 *  The Cloudinary SDK and the document store are stubbed, so the whole
 *  Admin-panel flow is exercised without the network or the real
 *  `backend/data` files:
 *    upload → store secure_url + public_id → replace (new first, old
 *    deleted after) → delete (asset removed) → failures leave no URL.
 *
 *      npm test
 * ============================================================
 */
process.env.CLOUDINARY_CLOUD_NAME = "wyixfdon";
process.env.CLOUDINARY_API_KEY = "test-key";
process.env.CLOUDINARY_API_SECRET = "test-secret";
process.env.CLOUDINARY_NEWS_FOLDER = "bluconnet/news";

const test = require("node:test");
const assert = require("node:assert/strict");
const { Writable } = require("node:stream");

const CLOUD = "https://res.cloudinary.com/wyixfdon/image/upload";

/* ---------- in-memory document store ---------- */
const db = require("../config/database");
const state = { news: [] };

db.read = (collection) =>
  collection === "news" ? state.news.map((r) => ({ ...r })) : [];
db.write = (collection, rows) => {
  if (collection === "news") state.news = rows.map((r) => ({ ...r }));
};
db.insert = (collection, doc) => {
  const record = {
    id: `news-${state.news.length + 1}`,
    createdAt: new Date().toISOString(),
    ...doc,
  };
  state.news.unshift(record);
  return record;
};
db.update = (collection, id, patch) => {
  const idx = state.news.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  state.news[idx] = { ...state.news[idx], ...patch };
  return state.news[idx];
};

/* ---------- stubbed Cloudinary SDK ---------- */
const cloudinarySdk = require("../services/cloudinary").cloudinary;
const calls = { uploads: [], destroyed: [] };
let uploadMode = "ok";

cloudinarySdk.uploader.upload_stream = (options, cb) => {
  const chunks = [];
  const stream = new Writable({
    write(chunk, enc, next) {
      chunks.push(chunk);
      next();
    },
  });
  stream.on("finish", () => {
    calls.uploads.push({ options, bytes: Buffer.concat(chunks).length });
    if (uploadMode === "fail") return cb(new Error("cloudinary down"));
    return cb(null, {
      secure_url: `${CLOUD}/v1786009999/bluconnet/news/new-${calls.uploads.length}.png`,
      public_id: `bluconnet/news/new-${calls.uploads.length}`,
      width: 100,
      height: 50,
      bytes: Buffer.concat(chunks).length,
      format: "png",
      resource_type: "image",
      created_at: "2026-09-18T00:00:00Z",
    });
  });
  return stream;
};

cloudinarySdk.uploader.destroy = (publicId, options, cb) => {
  calls.destroyed.push(publicId);
  if (uploadMode === "destroy-fail") return cb(new Error("delete refused"));
  return cb(null, { result: "ok" });
};

const news = require("../controllers/newsController");
const newsImage = require("../services/newsImage");

function mockRes() {
  return {
    code: 200,
    body: null,
    status(code) {
      this.code = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function fileRequest(name = "banner.png", mimetype = "image/png") {
  return {
    file: {
      buffer: Buffer.from("fake-bytes"),
      originalname: name,
      mimetype,
      size: 10,
    },
  };
}

function reset() {
  state.news = [];
  calls.uploads.length = 0;
  calls.destroyed.length = 0;
  uploadMode = "ok";
}

const ARTICLE = {
  title: "Cloudinary news test",
  shortDesc: "Images must survive a Render redeploy.",
  fullContent: "Body copy.",
  date: "2026-09-18",
  status: "published",
};

test("POST /admin/news/upload stores the file on Cloudinary and returns its URL", async () => {
  reset();
  const res = mockRes();
  await news.uploadImage(fileRequest(), res);

  assert.equal(res.code, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.url, `${CLOUD}/v1786009999/bluconnet/news/new-1.png`);
  assert.equal(res.body.publicId, "bluconnet/news/new-1");
  assert.equal(res.body.secureUrl, res.body.url);
  // memory storage -> the buffer (never a disk path) is what got uploaded
  assert.equal(calls.uploads[0].bytes, 10);
  assert.equal(calls.uploads[0].options.folder, "bluconnet/news");
});

test("upload answers 502 without a URL when Cloudinary fails", async () => {
  reset();
  uploadMode = "fail";
  const res = mockRes();
  await news.uploadImage(fileRequest(), res);

  assert.equal(res.code, 502);
  assert.equal(res.body.ok, false);
  assert.equal(res.body.url, undefined);
  assert.match(res.body.error, /Cloudinary upload failed/);
});

test("upload answers 503 when image storage is not configured", async () => {
  reset();
  const original = newsImage.isConfigured;
  newsImage.isConfigured = () => false;
  try {
    const res = mockRes();
    await news.uploadImage(fileRequest(), res);
    assert.equal(res.code, 503);
    assert.equal(res.body.url, undefined);
    assert.equal(calls.uploads.length, 0);
  } finally {
    newsImage.isConfigured = original;
  }
});

test("upload rejects a request with no file", async () => {
  reset();
  const noFile = mockRes();
  await news.uploadImage({}, noFile);
  assert.equal(noFile.code, 400);
  assert.equal(calls.uploads.length, 0);
});

test("the real upload route accepts images and rejects other file types", async () => {
  reset();
  const express = require("express");
  const { imageUpload } = require("../middleware/upload");
  const app = express();
  app.post("/upload", imageUpload.single("file"), news.uploadImage);
  app.use((err, req, res, next) => {
    res
      .status(err.status || 500)
      .json({ ok: false, error: err.message });
  });

  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;

  try {
    const form = new FormData();
    form.append(
      "file",
      new Blob([Buffer.from("png-bytes")], { type: "image/png" }),
      "banner.png"
    );
    const okRes = await fetch(`${base}/upload`, { method: "POST", body: form });
    const okBody = await okRes.json();
    assert.equal(okRes.status, 200);
    assert.equal(okBody.ok, true);
    assert.match(okBody.url, /^https:\/\/res\.cloudinary\.com\//);
    assert.equal(okBody.publicId, "bluconnet/news/new-1");

    const badForm = new FormData();
    badForm.append(
      "file",
      new Blob([Buffer.from("%PDF-1.4")], { type: "application/pdf" }),
      "notes.pdf"
    );
    const badRes = await fetch(`${base}/upload`, { method: "POST", body: badForm });
    const badBody = await badRes.json();
    assert.equal(badRes.status, 400);
    assert.equal(badBody.ok, false);
    assert.match(badBody.error, /Unsupported image type/);
    // The rejected file must not have reached Cloudinary.
    assert.equal(calls.uploads.length, 1);
  } finally {
    server.close();
  }
});
test("create stores the Cloudinary secure_url + public_id, never a local path", async () => {
  reset();
  const res = mockRes();
  await news.create(
    {
      body: {
        ...ARTICLE,
        imageUrl: `${CLOUD}/v1786009999/bluconnet/news/existing_abc.png`,
      },
    },
    res
  );

  assert.equal(res.code, 201);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.data.imageUrl, `${CLOUD}/v1786009999/bluconnet/news/existing_abc.png`);
  assert.equal(res.body.data.imagePublicId, "bluconnet/news/existing_abc");
  assert.equal(calls.uploads.length, 0); // already permanent -> no re-upload
});

test("create drops an unusable image instead of saving a broken URL", async () => {
  reset();
  const res = mockRes();
  await news.create({ body: { ...ARTICLE, imageUrl: "javascript:alert(1)" } }, res);

  assert.equal(res.code, 201);
  assert.equal(res.body.data.imageUrl, "");
  assert.equal(res.body.data.imagePublicId, "");
});

test("create still succeeds when the Cloudinary upload fails — with no image", async () => {
  reset();
  uploadMode = "fail";
  const res = mockRes();
  await news.create(
    {
      body: {
        ...ARTICLE,
        imageUrl: "data:image/png;base64," + Buffer.from("inline").toString("base64"),
      },
    },
    res
  );

  assert.equal(res.code, 201);
  assert.equal(res.body.data.imageUrl, "");
  assert.equal(res.body.data.imagePublicId, "");
});

test("create validates the required fields", async () => {
  reset();
  const res = mockRes();
  await news.create({ body: { title: "only a title" } }, res);
  assert.equal(res.code, 400);
  assert.equal(res.body.ok, false);
});

test("replacing the image uploads the new one first, then deletes the old asset", async () => {
  reset();
  const created = mockRes();
  await news.create(
    {
      body: {
        ...ARTICLE,
        imageUrl: `${CLOUD}/v1786009999/bluconnet/news/old_abc.png`,
      },
    },
    created
  );
  const id = created.body.data.id;

  const updated = mockRes();
  await news.update(
    {
      params: { id },
      // a newly uploaded Cloudinary URL (the panel uploads before saving)
      body: { imageUrl: `${CLOUD}/v1786009999/bluconnet/news/new_def.png` },
    },
    updated
  );

  assert.equal(updated.code, 200);
  assert.equal(updated.body.data.imageUrl, `${CLOUD}/v1786009999/bluconnet/news/new_def.png`);
  assert.equal(updated.body.data.imagePublicId, "bluconnet/news/new_def");
  assert.equal(updated.body.imageRemoved, true);
  assert.deepEqual(calls.destroyed, ["bluconnet/news/old_abc"]);
});

test("an unchanged image is not deleted on update", async () => {
  reset();
  const created = mockRes();
  await news.create(
    {
      body: {
        ...ARTICLE,
        imageUrl: `${CLOUD}/v1786009999/bluconnet/news/keep_abc.png`,
      },
    },
    created
  );
  const row = created.body.data;

  const updated = mockRes();
  await news.update(
    {
      params: { id: row.id },
      body: { imageUrl: row.imageUrl, title: "Renamed article" },
    },
    updated
  );

  assert.equal(updated.code, 200);
  assert.equal(updated.body.data.title, "Renamed article");
  assert.deepEqual(calls.destroyed, []);
  assert.equal(updated.body.imageRemoved, null);
});

test("update with an unrecoverable image clears it instead of storing a 404 path", async () => {
  reset();
  const created = mockRes();
  await news.create(
    {
      body: {
        ...ARTICLE,
        imageUrl: `${CLOUD}/v1786009999/bluconnet/news/old_xyz.png`,
      },
    },
    created
  );
  const id = created.body.data.id;

  const updated = mockRes();
  await news.update(
    { params: { id }, body: { imageUrl: "/uploads/no-longer-on-disk.png" } },
    updated
  );

  assert.equal(updated.code, 200);
  assert.equal(updated.body.data.imageUrl, "");
  assert.equal(updated.body.data.imagePublicId, "");
  // The replaced (still valid) asset is cleaned up from Cloudinary.
  assert.deepEqual(calls.destroyed, ["bluconnet/news/old_xyz"]);
});

test("deleting an article deletes its Cloudinary asset too", async () => {
  reset();
  const created = mockRes();
  await news.create(
    {
      body: {
        ...ARTICLE,
        imageUrl: `${CLOUD}/v1786009999/bluconnet/news/delete_me.png`,
      },
    },
    created
  );
  const id = created.body.data.id;

  const removed = mockRes();
  await news.remove({ params: { id } }, removed);

  assert.equal(removed.code, 200);
  assert.equal(removed.body.ok, true);
  assert.equal(removed.body.imageRemoved, true);
  assert.deepEqual(calls.destroyed, ["bluconnet/news/delete_me"]);
  assert.equal(state.news.length, 0);
});

test("delete reports cleanup failure without failing the request", async () => {
  reset();
  const created = mockRes();
  await news.create(
    {
      body: {
        ...ARTICLE,
        imageUrl: `${CLOUD}/v1786009999/bluconnet/news/stubborn.png`,
      },
    },
    created
  );

  uploadMode = "destroy-fail";
  const removed = mockRes();
  await news.remove({ params: { id: created.body.data.id } }, removed);

  assert.equal(removed.code, 200);
  assert.equal(removed.body.ok, true);
  assert.equal(removed.body.imageRemoved, false);
  assert.equal(state.news.length, 0);
});

test("deleting an unknown id answers 404", async () => {
  reset();
  const res = mockRes();
  await news.remove({ params: { id: "nope" } }, res);
  assert.equal(res.code, 404);
});

test("the public listing returns the stored Cloudinary URL", async () => {
  reset();
  const created = mockRes();
  await news.create(
    {
      body: {
        ...ARTICLE,
        imageUrl: `${CLOUD}/v1786009999/bluconnet/news/public_abc.png`,
      },
    },
    created
  );

  const listed = mockRes();
  news.listPublished({ query: {} }, listed);
  assert.equal(listed.body.data.length, 1);
  assert.equal(
    listed.body.data[0].imageUrl,
    `${CLOUD}/v1786009999/bluconnet/news/public_abc.png`
  );
});