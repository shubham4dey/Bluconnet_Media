/**
 * ============================================================
 *  Unit tests — Cloudinary URL helpers (services/cloudinary.js).
 *
 *      npm test
 * ============================================================
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const cloudinary = require("../services/cloudinary");
const {
  classifyImageUrl,
  localFilePath,
  decodeDataUrl,
  extensionForMime,
  CLASS,
} = require("../services/newsImage");

test("isCloudinaryUrl only accepts the Cloudinary delivery host", () => {
  assert.equal(
    cloudinary.isCloudinaryUrl(
      "https://res.cloudinary.com/wyixfdon/image/upload/v1/pic.png"
    ),
    true
  );
  assert.equal(cloudinary.isCloudinaryUrl("https://example.com/pic.png"), false);
  assert.equal(cloudinary.isCloudinaryUrl("/uploads/pic.png"), false);
  assert.equal(cloudinary.isCloudinaryUrl(""), false);
});

test("publicIdFromUrl handles version, transformation and folder segments", () => {
  assert.equal(
    cloudinary.publicIdFromUrl(
      "https://res.cloudinary.com/wyixfdon/image/upload/v1786004101/affise-logo_g4dnxg.png"
    ),
    "affise-logo_g4dnxg"
  );
  assert.equal(
    cloudinary.publicIdFromUrl(
      "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935715/moumita.0df1c1584a5b6f36068d_pblbmi.webp"
    ),
    "moumita.0df1c1584a5b6f36068d_pblbmi"
  );
  assert.equal(
    cloudinary.publicIdFromUrl(
      "https://res.cloudinary.com/wyixfdon/image/upload/bluconnet/news/1712345-banner.png"
    ),
    "bluconnet/news/1712345-banner"
  );
  assert.equal(
    cloudinary.publicIdFromUrl(
      "https://res.cloudinary.com/wyixfdon/image/upload/v1/bluconnet/news/banner.jpg"
    ),
    "bluconnet/news/banner"
  );
  // Not a Cloudinary URL -> nothing to clean up.
  assert.equal(cloudinary.publicIdFromUrl("/uploads/pic.png"), "");
  assert.equal(cloudinary.publicIdFromUrl("https://example.com/pic.png"), "");
  assert.equal(cloudinary.publicIdFromUrl(""), "");
});

test("safeFilename strips unsafe characters but stays readable", () => {
  assert.equal(
    cloudinary.safeFilename("Generated image (1)!.png"),
    "Generated-image-1"
  );
  assert.equal(cloudinary.safeFilename(""), "news-image");
  assert.equal(cloudinary.safeFilename("../../etc/passwd"), "etcpasswd");
});

test("urlFromPublicId rebuilds the permanent delivery URL of an asset", () => {
  assert.equal(
    cloudinary.urlFromPublicId("bluconnet/news/probe-test-blue_qo4pm3"),
    `https://res.cloudinary.com/${
      cloudinary.cloudName() || cloudinary.DEFAULT_CLOUD_NAME
    }/image/upload/bluconnet/news/probe-test-blue_qo4pm3`
  );
  // A leading slash is tolerated, other resource types are honoured.
  assert.match(
    cloudinary.urlFromPublicId("/bluconnet/news/banner.png"),
    /\/image\/upload\/bluconnet\/news\/banner\.png$/
  );
  assert.match(
    cloudinary.urlFromPublicId("bluconnet/news/banner.png", { resourceType: "video" }),
    /\/video\/upload\/bluconnet\/news\/banner\.png$/
  );
});

test("urlFromPublicId refuses anything that is not a usable public_id", () => {
  assert.equal(cloudinary.urlFromPublicId(""), "");
  assert.equal(cloudinary.urlFromPublicId("   "), "");
  assert.equal(cloudinary.urlFromPublicId(null), "");
  // A full URL is not a public_id (that would build a nonsense double URL).
  assert.equal(
    cloudinary.urlFromPublicId("https://res.cloudinary.com/wyixfdon/image/upload/a.png"),
    ""
  );
  assert.equal(cloudinary.urlFromPublicId("bluconnet/news/../../etc/passwd"), "");
  assert.equal(cloudinary.urlFromPublicId("bluconnet/news/a b.png"), "");
});

test("every stored Cloudinary secure_url round-trips through its public_id", () => {
  const url =
    "https://res.cloudinary.com/wyixfdon/image/upload/v1790156372/bluconnet/news/probe-test-blue_qo4pm3.png";
  const publicId = cloudinary.publicIdFromUrl(url);
  assert.equal(publicId, "bluconnet/news/probe-test-blue_qo4pm3");
  const rebuilt = cloudinary.urlFromPublicId(publicId);
  assert.equal(rebuilt.endsWith("/bluconnet/news/probe-test-blue_qo4pm3"), true);
  assert.equal(cloudinary.isCloudinaryUrl(rebuilt), true);
});

test("describe() always reports a usable status string", () => {
  const description = cloudinary.describe();
  assert.equal(typeof description, "string");
  assert.ok(description.length > 0);
});

test("classifyImageUrl recognises each kind of image reference", () => {
  assert.equal(classifyImageUrl(""), CLASS.EMPTY);
  assert.equal(classifyImageUrl(null), CLASS.EMPTY);
  assert.equal(
    classifyImageUrl("https://res.cloudinary.com/wyixfdon/image/upload/v1/a.png"),
    CLASS.CLOUDINARY
  );
  assert.equal(classifyImageUrl("data:image/png;base64,AAAA"), CLASS.INLINE);
  assert.equal(classifyImageUrl("/uploads/1789-pic.png"), CLASS.LOCAL);
  assert.equal(classifyImageUrl("uploads/1789-pic.png"), CLASS.LOCAL);
  assert.equal(classifyImageUrl("https://blog.example.com/a.jpg"), CLASS.REMOTE);
  assert.equal(classifyImageUrl("javascript:alert(1)"), CLASS.INVALID);
  assert.equal(classifyImageUrl("just some text"), CLASS.INVALID);
});

test("localFilePath maps /uploads paths and blocks traversal", () => {
  const dir = require("path").join("C:", "tmp", "uploads");
  assert.equal(localFilePath("/uploads/a.png", dir), require("path").join(dir, "a.png"));
  assert.equal(localFilePath("uploads/sub/a.png", dir), require("path").join(dir, "sub", "a.png"));
  assert.equal(localFilePath("/uploads/../../secret.txt", dir), null);
  assert.equal(localFilePath("https://example.com/a.png", dir), null);
});

test("decodeDataUrl decodes base64 and plain data URLs", () => {
  const b64 = Buffer.from("hello-image").toString("base64");
  const decoded = decodeDataUrl(`data:image/png;base64,${b64}`);
  assert.equal(decoded.mime, "image/png");
  assert.equal(decoded.buffer.toString("utf8"), "hello-image");

  const plain = decodeDataUrl("data:image/svg+xml,<svg/>");
  assert.equal(plain.buffer.toString("utf8"), "<svg/>");

  assert.equal(decodeDataUrl("data:text/plain;base64,AAAA"), null);
  assert.equal(decodeDataUrl("not-a-data-url"), null);
});

test("extensionForMime falls back to jpg", () => {
  assert.equal(extensionForMime("image/webp"), "webp");
  assert.equal(extensionForMime("image/PNG"), "png");
  assert.equal(extensionForMime("application/octet-stream"), "jpg");
});
