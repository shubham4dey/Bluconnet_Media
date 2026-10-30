/**
 * ============================================================
 *  SINGLE SOURCE OF TRUTH for the backend API URL.
 *
 *  Every caller (services/newsApi.js, components/Hero.jsx,
 *  components/ContactForm.jsx, components/SubscribeSection.jsx,
 *  pages/contact.jsx, components/chatbot/chatApi.js) imports this
 *  module instead of hard-coding its own copy of the URL.
 *
 *  Why this module exists — the production news outage:
 *    The live site was built with its own copy of the URL in five
 *    different files, and the production bundle ended up pointing at
 *    `bluconnet-backend-m2jl.onrender.com` — the letters `j` and `l`
 *    transposed. That host does not exist: Render answers every
 *    request (even `/`) with `404 x-render-routing: no-server`. The
 *    news request therefore never reached any backend, and the News
 *    page / Home "recent news" section fell back to their empty
 *    state while the rows sat safely in MySQL.
 *    The service that IS deployed is `bluconnet-backend-m2lj.onrender.com`
 *    (verified: /api/health → 200 with the Cloudinary + news store report).
 *    One file cannot be typo'd in five places at once.
 *
 *  Resolution order:
 *    REACT_APP_API_URL   (frontend/.env for dev,
 *                         frontend/.env.production for `npm run build`)
 *    → DEFAULT_API_URL   (the deployed production backend)
 * ============================================================
 */

/* The deployed backend. Both spellings of this hostname have existed in the
   repository; this one is the live service. */
export const DEFAULT_API_URL = "https://bluconnet-backend-m2lj.onrender.com/api";

/* Hostnames that look like the backend but are guaranteed not to answer:
   Render replies 404 (`x-render-routing: no-server`) for every path, including
   `/`. A build that uses one of them is broken, so it is reported loudly
   instead of failing silently at runtime. */
const DEAD_HOSTS = ["bluconnet-backend-m2jl.onrender.com"];

const RAW_API_URL = (
  process.env.REACT_APP_API_URL || DEFAULT_API_URL
)
  .trim()
  .replace(/\/+$/, "");

/* Accepts both ".../api" (project default) and a bare origin ("...:5000"). */
export const API_BASE = /\/api$/.test(RAW_API_URL)
  ? RAW_API_URL
  : `${RAW_API_URL}/api`;

/* The backend origin, used to resolve legacy relative image paths
   (`/uploads/...`) that predate Cloudinary. */
export const API_ORIGIN = API_BASE.replace(/\/api$/, "");

for (const dead of DEAD_HOSTS) {
  if (API_BASE.includes(dead)) {
    console.error(
      `[apiConfig] REACT_APP_API_URL points at ${dead}, which does NOT exist ` +
        "(Render answers 404 for every request). News, contact and subscribe " +
        `calls will all fail. Use ${DEFAULT_API_URL} instead.`
    );
  }
}

console.log(`[apiConfig] backend → ${API_BASE}`);

export default API_BASE;
