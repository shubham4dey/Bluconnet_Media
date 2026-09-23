/**
 * ============================================================
 *  Tests — News API client (services/newsApi.js).
 *
 *  Axios is mocked, so the Admin upload flow is verified without a
 *  network: the image goes to the authenticated Cloudinary route, a
 *  Cloudinary `secure_url` is what gets stored, and every failure path
 *  returns no URL at all (a broken image path must never be saved).
 * ============================================================
 */
import axios from "axios";
import {
  resolveUrl,
  uploadNewsImageFile,
  migrateNewsImages,
  listAdminNews,
} from "./newsApi";

jest.mock("axios", () => {
  const instances = [];
  const create = jest.fn(() => {
    const instance = jest.fn(() => Promise.resolve({ data: { ok: true } }));
    instance.get = jest.fn();
    instance.post = jest.fn();
    instances.push(instance);
    return instance;
  });
  return { create, __instances: instances };
});

/* newsApi.js creates two clients: the JSON client first, the upload client last */
const jsonClient = axios.__instances[axios.__instances.length - 2];
const uploadClient = axios.__instances[axios.__instances.length - 1];

const CLOUD_URL =
  "https://res.cloudinary.com/wyixfdon/image/upload/v1786009999/bluconnet/news/banner.png";

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  jsonClient.mockResolvedValue({ data: { ok: true } });
});

describe("resolveUrl", () => {
  it("passes an absolute Cloudinary URL straight through", () => {
    expect(resolveUrl(CLOUD_URL)).toBe(CLOUD_URL);
  });

  it("still resolves a legacy /uploads path against the backend origin", () => {
    const resolved = resolveUrl("/uploads/old.png");
    expect(resolved).toMatch(/^https?:\/\/.+\/uploads\/old\.png$/);
  });

  it("returns an empty string for nothing", () => {
    expect(resolveUrl("")).toBe("");
    expect(resolveUrl(undefined)).toBe("");
  });
});

describe("uploadNewsImageFile", () => {
  it("posts to the authenticated Cloudinary route and returns its secure_url", async () => {
    localStorage.setItem("bc_admin_token", "test-token");
    uploadClient.post.mockResolvedValue({
      data: { ok: true, url: CLOUD_URL, secureUrl: CLOUD_URL, publicId: "bluconnet/news/banner" },
    });

    const file = new File(["bytes"], "banner.png", { type: "image/png" });
    const result = await uploadNewsImageFile(file);

    expect(result).toEqual({
      url: CLOUD_URL,
      publicId: "bluconnet/news/banner",
      error: null,
    });

    const [path, body, config] = uploadClient.post.mock.calls[0];
    expect(path).toBe("/admin/news/upload");
    expect(body instanceof FormData).toBe(true);
    expect(body.get("file")).toBe(file);
    expect(config.headers.Authorization).toBe("Bearer test-token");
    // Content-Type is intentionally left unset so the browser adds the boundary
    expect(config.headers["Content-Type"]).toBeUndefined();
  });

  it("mints an admin token when none is stored", async () => {
    jsonClient.post.mockResolvedValue({ data: { ok: true, token: "fresh-token" } });
    uploadClient.post.mockResolvedValue({
      data: { ok: true, secureUrl: CLOUD_URL, publicId: "bluconnet/news/banner" },
    });

    const result = await uploadNewsImageFile(
      new File(["bytes"], "banner.png", { type: "image/png" })
    );

    expect(jsonClient.post).toHaveBeenCalledWith("/admin/login", expect.any(Object));
    expect(result.url).toBe(CLOUD_URL);
    expect(uploadClient.post.mock.calls[0][2].headers.Authorization).toBe("Bearer fresh-token");
  });

  it("returns no URL when the backend reports a Cloudinary failure", async () => {
    localStorage.setItem("bc_admin_token", "test-token");
    uploadClient.post.mockRejectedValue({
      response: { status: 502, data: { ok: false, error: "Cloudinary upload failed: boom" } },
    });

    const result = await uploadNewsImageFile(
      new File(["bytes"], "banner.png", { type: "image/png" })
    );

    expect(result.url).toBeNull();
    expect(result.error).toMatch(/Cloudinary upload failed/);
  });

  it("returns no URL when the response carries none", async () => {
    localStorage.setItem("bc_admin_token", "test-token");
    uploadClient.post.mockResolvedValue({ data: { ok: false, error: "no storage" } });

    const result = await uploadNewsImageFile(
      new File(["bytes"], "banner.png", { type: "image/png" })
    );

    expect(result.url).toBeNull();
    expect(result.error).toBe("no storage");
  });

  it("re-mints the token and retries once on 401", async () => {
    localStorage.setItem("bc_admin_token", "stale-token");
    jsonClient.post.mockResolvedValue({ data: { ok: true, token: "new-token" } });
    uploadClient.post
      .mockRejectedValueOnce({ response: { status: 401, data: { ok: false } } })
      .mockResolvedValueOnce({ data: { ok: true, secureUrl: CLOUD_URL, publicId: "p" } });

    const result = await uploadNewsImageFile(
      new File(["bytes"], "banner.png", { type: "image/png" })
    );

    expect(uploadClient.post).toHaveBeenCalledTimes(2);
    expect(result.url).toBe(CLOUD_URL);
    expect(uploadClient.post.mock.calls[1][2].headers.Authorization).toBe("Bearer new-token");
  });
});

describe("migrateNewsImages", () => {
  it("asks the backend to upgrade legacy image paths", async () => {
    localStorage.setItem("bc_admin_token", "test-token");
    jsonClient.mockResolvedValue({ data: { ok: true, migrated: 2, scanned: 3 } });

    const report = await migrateNewsImages();

    const [config] = jsonClient.mock.calls[0];
    expect(config.url).toBe("/admin/news/migrate-images");
    expect(config.method).toBe("post");
    expect(report.migrated).toBe(2);
  });
});

describe("listAdminNews", () => {
  it("never throws when the backend is unreachable", async () => {
    localStorage.setItem("bc_admin_token", "test-token");
    jsonClient.mockRejectedValue(new Error("offline"));

    const result = await listAdminNews();
    expect(result).toEqual({ ok: false, data: [] });
  });
});
