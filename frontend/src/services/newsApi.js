/**
 * ============================================================
 *  News API client — global CRUD CMS for the public website.
 *
 *  Public helpers read ONLY published news from the central
 *  database (no admin/user/portal/session scoping).
 *  Admin helpers are token-authenticated (bc_admin_token, same
 *  session used by the chat admin panel) so RBAC is unchanged.
 * ============================================================
 */
import axios from "axios";

const API = (
  process.env.REACT_APP_API_URL || "https://bluconnet-backend-m2lj.onrender.com/api"
).replace(/\/+$/, "");
const ORIGIN = API.replace(/\/api$/, "");

const client = axios.create({
  baseURL: API,
  timeout: 9000,
  headers: { "Content-Type": "application/json" },
});

/* Same static admin credentials already baked into Login.jsx */
const ADMIN_USER = process.env.REACT_APP_ADMIN_USER || "bluconnetnews";
const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS || "bluconnetmedia@2026";
const TOKEN_KEY = "bc_admin_token";

/* ---------- admin token (minted on first admin call) ---------- */
let mintPromise = null;
async function ensureToken() {
  const existing = localStorage.getItem(TOKEN_KEY);
  if (existing && existing !== "undefined") return existing;

  if (!mintPromise) {
    mintPromise = client
      .post("/admin/login", { username: ADMIN_USER, password: ADMIN_PASS })
      .then((r) => {
        const token = r.data && r.data.token;
        if (token) localStorage.setItem(TOKEN_KEY, token);
        return token || null;
      })
      .catch(() => null)
      .finally(() => {
        mintPromise = null;
      });
  }
  return mintPromise;
}

async function admin(path, { method = "get", data, retry = true } = {}) {
  const token = await ensureToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await client({ url: path, method, data, headers });
    return res.data;
  } catch (e) {
    // A stale/expired token left in localStorage would otherwise break EVERY
    // admin call forever. Re-mint once and retry so the panel self-heals.
    if (retry && e && e.response && e.response.status === 401) {
      console.warn("[newsApi] 401 on", path, "-> re-minting admin token and retrying");
      localStorage.removeItem(TOKEN_KEY);
      return admin(path, { method, data, retry: false });
    }
    throw e;
  }
}

/* ---------- PUBLIC: published news (global) ---------- */
export const getPublishedNews = (q = "") =>
  client
    .get("/news", { params: q ? { q } : undefined })
    .then((r) => r.data)
    .catch(() => ({ ok: false, data: [] }));

export const getPublishedNewsById = (id) =>
  client
    .get(`/news/${id}`)
    .then((r) => r.data)
    .catch(() => ({ ok: false, data: null }));

/* Resolve a stored image URL for rendering.
 * Cloudinary `secure_url`s are already absolute and pass through unchanged —
 * the public News page therefore loads images straight from Cloudinary.
 * Legacy `/uploads/...` paths (older articles) still resolve against the
 * backend origin so they keep rendering until they are migrated. */
export const resolveUrl = (u) => {
  // Trim first: a stored value with stray whitespace (hand-edited database
  // row, copy/paste) would otherwise be treated as a relative path and turn a
  // perfectly valid Cloudinary URL into a broken one.
  const raw = String(u == null ? "" : u).trim();
  if (!raw) return "";
  if (/^data:/i.test(raw)) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;
  // Protocol-relative CDN URLs (<img src="//res.cloudinary.com/...">) are
  // absolute too — do not glue the API origin in front of them.
  if (/^\/\//.test(raw)) return `https:${raw}`;
  return `${ORIGIN}${raw.startsWith("/") ? "" : "/"}${raw}`;
};

/* ---------- image upload → Cloudinary (admin-authenticated) ----------
 * The backend streams the file straight to Cloudinary and answers with the
 * permanent `secure_url` (+ `public_id`). Nothing is written to the server's
 * local /uploads folder — Render wipes that on every restart/redeploy, which
 * is why uploaded images used to disappear.
 * On ANY failure the backend answers without a URL, so the Admin panel shows
 * the real error instead of saving a broken image path.
 * NOTE: we intentionally do NOT set Content-Type — FormData uploads must let
 * the browser set `multipart/form-data; boundary=...`. Forcing the header to
 * a boundary-less "multipart/form-data" is the documented cause of
 * `AxiosError: Network Error` on file uploads.
 * DEBUG: the raw request/response is logged so a real backend error is
 * visible in the AdminNews UI instead of a generic message.
 */
const uploadClient = axios.create({ baseURL: API, timeout: 30000 });
export async function uploadNewsImageFile(file, { retry = true } = {}) {
  const fd = new FormData();
  fd.append("file", file);
  try {
    const token = await ensureToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    console.log(
      "[newsApi] upload ->",
      API,
      "/admin/news/upload; file:",
      file.name,
      file.type,
      file.size
    );
    const res = await uploadClient.post("/admin/news/upload", fd, { headers });
    console.log("[newsApi] upload response:", JSON.stringify(res.data));
    const url = res.data && (res.data.secureUrl || res.data.url);
    if (res.data && res.data.ok && url) {
      console.log("[newsApi] upload OK -> storing Cloudinary imageUrl:", url);
      return { url, publicId: res.data.publicId || "", error: null };
    }
    console.warn("[newsApi] upload unexpected shape:", JSON.stringify(res.data));
    return {
      url: null,
      publicId: "",
      error:
        res.data && res.data.error ? String(res.data.error) : "upload returned no URL",
    };
  } catch (e) {
    const status = e && e.response && e.response.status;
    const body =
      e && e.response && e.response.data && JSON.stringify(e.response.data);
    // A stale token would otherwise break uploads until localStorage is cleared.
    if (retry && status === 401) {
      console.warn("[newsApi] 401 on upload -> re-minting admin token and retrying");
      localStorage.removeItem(TOKEN_KEY);
      return uploadNewsImageFile(file, { retry: false });
    }
    console.error("[newsApi] upload ERROR ->", status, body || e.message);
    return { url: null, publicId: "", error: body || e.message || "Network error" };
  }
}

/* ---------- ADMIN CRUD (token-protected) ---------- */
const _report = (label, res, err) => {
  if (err) {
    const status = err && err.response && err.response.status;
    const body =
      err &&
      err.response &&
      err.response.data &&
      JSON.stringify(err.response.data);
    console.error(`[newsApi] ${label} ERROR ->`, status, body || err.message);
  } else if (res) {
    console.log(`[newsApi] ${label} ->`, JSON.stringify(res));
  }
};

/* ---------- ADMIN: migrate legacy news images to Cloudinary ----------
 * Upgrades `/uploads/...` / inline base64 references (and, with
 * { allowRemote: true }, external URLs) to permanent Cloudinary assets. */
export const migrateNewsImages = (options = {}) =>
  admin("/admin/news/migrate-images", { method: "post", data: options }).catch((e) => {
    _report("migrateNewsImages", null, e);
    return { ok: false };
  });

export const listAdminNews = () =>
  admin("/admin/news").catch((e) => {
    _report("listAdminNews", null, e);
    return { ok: false, data: [] };
  });

export const createNews = (payload) =>
  admin("/admin/news", { method: "post", data: payload }).then(
    (r) => {
      _report("createNews", r, null);
      return r;
    },
    (e) => {
      _report("createNews", null, e);
      return { ok: false, error: (e && e.response && e.response.data && e.response.data.error) || "create failed" };
    }
  );

export const updateNews = (id, payload) =>
  admin(`/admin/news/${id}`, { method: "put", data: payload }).then(
    (r) => {
      _report("updateNews", r, null);
      return r;
    },
    (e) => {
      _report("updateNews", null, e);
      return { ok: false, error: (e && e.response && e.response.data && e.response.data.error) || "update failed" };
    }
  );

export const deleteNews = (id) =>
  admin(`/admin/news/${id}`, { method: "delete" }).then(
    (r) => {
      _report("deleteNews", r, null);
      return r;
    },
    (e) => {
      _report("deleteNews", null, e);
      return { ok: false, error: (e && e.response && e.response.data && e.response.data.error) || "delete failed" };
    }
  );

export default {
  getPublishedNews,
  getPublishedNewsById,
  uploadNewsImageFile,
  resolveUrl,
  listAdminNews,
  createNews,
  updateNews,
  deleteNews,
  migrateNewsImages,
};
