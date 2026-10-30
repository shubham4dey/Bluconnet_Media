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
import API_BASE, { API_ORIGIN as ORIGIN } from "./apiConfig";

const API = API_BASE;

const client = axios.create({
  baseURL: API,
  timeout: 9000,
  headers: { "Content-Type": "application/json" },
});

/* SECURITY (C1): this module used to carry its own copy of the admin username
   and password and POST them to /admin/login the first time any admin call ran.
   Everything below ships inside the public JavaScript bundle, so the repository
   and the live site effectively published a working admin credential set: any
   visitor could mint a valid admin token and create/edit/delete News articles
   or burn Cloudinary storage through the upload route.

   There is deliberately NO credential here any more. `bc_admin_token` is the
   session token the backend handed out when a human signed in on /login (or on
   /admin/chat), and nothing in the browser can authenticate on its own. A
   missing/expired session is an error the caller shows — never a silent
   re-login. */
const TOKEN_KEY = "bc_admin_token";

/* The current admin session token, or null when nobody is signed in. */
export function getAdminToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    return typeof token === "string" && token && token !== "undefined" ? token : null;
  } catch (e) {
    /* private mode / storage disabled — treat as signed out */
    return null;
  }
}

/* Drop the session (expired, revoked or logged out). */
export function clearAdminToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    /* nothing to clean up */
  }
}

/* A 401-shaped error for calls made without a session, so callers can react
   (the Admin panel redirects to /login) exactly like for a rejected token. */
function noSessionError(path) {
  const err = new Error(`Admin session required for ${path}`);
  err.status = 401;
  err.code = "NO_ADMIN_SESSION";
  return err;
}

async function admin(path, { method = "get", data } = {}) {
  const token = getAdminToken();
  if (!token) throw noSessionError(path);

  const headers = { Authorization: `Bearer ${token}` };
  try {
    const res = await client({ url: path, method, data, headers });
    return res.data;
  } catch (e) {
    /* An expired or revoked token is NOT re-minted from here: the only way to
       get a new one is signing in again. The session is dropped so the Admin
       panel notices and redirects to /login instead of failing on every call. */
    if (e && e.response && e.response.status === 401) {
      console.warn("[newsApi] 401 on", path, "-> admin session expired, sign in again");
      clearAdminToken();
    }
    throw e;
  }
}

/* ---------- PUBLIC: published news (global) ----------
 * The failure contract (`{ ok:false, data:[] }`) is kept so the pages cannot
 * crash, but the real reason is now LOGGED and returned as `error`: a dead
 * backend URL (404 / connection refused) must be visible in the console and in
 * the UI instead of being indistinguishable from "no articles published yet".
 */
export const getPublishedNews = (q = "") =>
  client
    .get("/news", { params: q ? { q } : undefined })
    .then((r) => r.data)
    .catch((e) => {
      const status = e && e.response && e.response.status;
      const body =
        e && e.response && e.response.data && JSON.stringify(e.response.data);
      console.error(
        `[newsApi] GET ${API}/news FAILED ->`,
        status || "(no HTTP status — network/CORS failure)",
        body || e.message
      );
      return {
        ok: false,
        data: [],
        error: body || e.message || "News request failed",
        status: status || 0,
      };
    });

export const getPublishedNewsById = (id) =>
  client
    .get(`/news/${id}`)
    .then((r) => r.data)
    .catch((e) => {
      const status = e && e.response && e.response.status;
      console.error(
        `[newsApi] GET ${API}/news/${id} FAILED ->`,
        status || "(no HTTP status — network/CORS failure)",
        (e && e.response && JSON.stringify(e.response.data)) || e.message
      );
      return { ok: false, data: null, status: status || 0 };
    });

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
export async function uploadNewsImageFile(file) {
  /* Signed-in session only — the upload endpoint costs real Cloudinary storage
     and is protected by requireAuth on the server (see backend/routes/api.js). */
  const token = getAdminToken();
  if (!token) {
    console.warn("[newsApi] upload refused — no admin session");
    return { url: null, publicId: "", error: "Admin session expired. Sign in again." };
  }

  const fd = new FormData();
  fd.append("file", file);
  try {
    const headers = { Authorization: `Bearer ${token}` };
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
    // An expired/revoked session is dropped (the panel then redirects to
    // /login). It is never re-minted from the browser: only a real sign-in
    // produces a token.
    if (status === 401) {
      console.warn("[newsApi] 401 on upload -> admin session expired, sign in again");
      clearAdminToken();
      return {
        url: null,
        publicId: "",
        error: "Admin session expired. Sign in again.",
      };
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
  admin("/admin/news").then((res) => {
    const data = res && res.ok && Array.isArray(res.data) ? res.data : [];
    return { ok: true, data };
  }).catch((e) => {
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
