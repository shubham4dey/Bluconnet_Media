/**
 * ============================================================
 *  Chatbot API client — talks to the BluConnet backend.
 *  Every call degrades gracefully: if the backend is offline
 *  the assistant keeps working (AI runs in the browser) and
 *  submissions are queued for retry.
 * ============================================================
 */
import axios from "axios";

/* reCAPTCHA v3 — the backend verifies every protected submission with Google
   (backend/middleware/recaptcha.js) using the token this client sends. */
import { getRecaptchaToken } from "../RecaptchaProtection";
import API_BASE from "../../services/apiConfig";

/* Backend base URL — defined once in services/apiConfig.js (REACT_APP_API_URL
   with the deployed production backend as the fallback). */
const API = API_BASE;

const client = axios.create({
  baseURL: API,
  timeout: 9000,
  headers: { "Content-Type": "application/json" },
});

/* ---------- offline queue for submissions ---------- */
const QUEUE_KEY = "bc_chat_queue_v1";

function readQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function writeQueue(q) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(0, 50)));
  } catch (e) {
    /* storage full — ignore */
  }
}

/* ---------- reCAPTCHA v3 tokens for protected submissions ----------
   The action name must match the guard on the backend route
   (backend/routes/api.js → requireRecaptcha({ action })). A fresh token is
   requested at send time, so the offline queue always retries with a valid
   one (tokens expire after two minutes). */
const RECAPTCHA_ACTIONS = {
  "/lead": "lead",
  "/meeting": "meeting",
  "/application": "application",
  "/handoff": "handoff",
  "/feedback": "feedback",
};

async function withRecaptchaToken(path, data) {
  const action = RECAPTCHA_ACTIONS[path];
  if (!action) return data;
  try {
    const token = await getRecaptchaToken(action);
    return token ? { ...data, recaptchaToken: token } : data;
  } catch (err) {
    /* reCAPTCHA unavailable (offline/blocked) — the request is still sent and
       the backend answers with its reCAPTCHA failure response. */
    return data;
  }
}

async function post(path, data, { queue = false } = {}) {
  const payload = await withRecaptchaToken(path, data);
  try {
    const res = await client.post(path, payload);
    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    // network down / timeout / server 5xx → queue for retry (never for 4xx validation)
    if (queue && (!status || status >= 500)) {
      const q = readQueue();
      q.push({ path, data, at: Date.now() });
      writeQueue(q);
    }
    return null;
  }
}

/* retry queued submissions when backend returns */
export async function flushQueue() {
  const q = readQueue();
  if (!q.length) return;
  const remaining = [];
  for (const item of q) {
    // eslint-disable-next-line no-await-in-loop
    const res = await post(item.path, item.data).catch(() => null);
    if (!res || res.ok !== true) remaining.push(item);
  }
  writeQueue(remaining);
}

/* ---------- public endpoints ---------- */
export const submitLead = (payload) => post("/lead", payload, { queue: true });
export const submitMeeting = (payload) => post("/meeting", payload, { queue: true });
export const submitApplication = (payload) => post("/application", payload, { queue: true });
export const submitHandoff = (payload) => post("/handoff", payload, { queue: true });
export const sendFeedback = (payload) => post("/feedback", payload);
export const saveSession = (payload) => post("/chat/session", payload);
export const heartbeat = (payload) => post("/visitor/heartbeat", payload);
/* general-knowledge AI answer (Gemini via backend) — longer timeout, never queued */
export const aiChat = (payload) =>
  client
    .post("/ai/chat", payload, { timeout: 45000 })
    .then((r) => r.data)
    .catch((err) => {
      console.error(
        "[chatApi] aiChat failed:",
        err?.response?.status,
        err?.response?.data || err?.message
      );
      return null;
    });
export async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  /* POST /api/upload is anonymous, so the backend demands a reCAPTCHA v3 token
     for the "upload" action (backend/routes/api.js). It travels as a HEADER —
     the guard must run before multer touches the file, and a multipart body
     field would only be readable after that. A missing token (reCAPTCHA
     blocked/offline) simply means the file is not copied to the server: the
     attachment still works locally in the conversation. */
  const headers = { "Content-Type": "multipart/form-data" };
  try {
    const token = await getRecaptchaToken("upload");
    if (token) headers["X-Recaptcha-Token"] = token;
  } catch (err) {
    /* reCAPTCHA unavailable — the request is still sent and the backend
       answers with its reCAPTCHA failure response. */
  }
  return client
    .post("/upload", fd, { headers, timeout: 20000 })
    .then((r) => r.data)
    .catch(() => null);
}

/* ---------- admin endpoints ---------- */
function adminClient() {
  const token = localStorage.getItem("bc_admin_token") || "";
  return axios.create({
    baseURL: API,
    timeout: 15000,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export const adminLogin = (username, password) =>
  client.post("/admin/login", { username, password }).then((r) => r.data);

export const adminGet = (path) =>
  adminClient().get(path).then((r) => r.data).catch(() => null);

export const adminPut = (path, data) =>
  adminClient().put(path, data).then((r) => r.data).catch(() => null);

export const adminDelete = (path) =>
  adminClient().delete(path).then((r) => r.data).catch(() => null);

export const adminPost = (path, data) =>
  adminClient().post(path, data).then((r) => r.data).catch(() => null);

export const adminCsvUrl = (collection) => `${API}/admin/export/${collection}`;

/* ---------- CRM Lead Management ---------- */
export const searchLeads = (params) => {
  const query = new URLSearchParams(params).toString();
  return adminGet(`/admin/leads/search?${query}`);
};

export const getLeadStats = () => adminGet("/admin/leads/stats");

export const getLeadWithHistory = (id) => adminGet(`/admin/leads/${id}`);

export const updateLead = (id, data) => adminPut(`/admin/leads/${id}`, data);

export const deleteLead = (id) => adminDelete(`/admin/leads/${id}`);

export const bulkDeleteLeads = (ids) => adminPost("/admin/leads/bulk-delete", { ids });

export const addLeadNote = (id, note) => adminPost(`/admin/leads/${id}/note`, { note });

/* ---------- Chat Session Management ---------- */
export const getSession = (sessionId) => adminGet(`/admin/sessions/${sessionId}`);

export const getSessionsByLead = (leadId) => adminGet(`/admin/sessions/lead/${leadId}`);

export const getApiBase = () => API;

export default {
  submitLead,
  submitMeeting,
  submitApplication,
  submitHandoff,
  sendFeedback,
  saveSession,
  heartbeat,
  aiChat,
  uploadFile,
  flushQueue,
  adminLogin,
  adminGet,
  adminPut,
  adminDelete,
  adminPost,
  adminCsvUrl,
  getApiBase,
  searchLeads,
  getLeadStats,
  getLeadWithHistory,
  updateLead,
  deleteLead,
  bulkDeleteLeads,
  addLeadNote,
  getSession,
  getSessionsByLead,
};
