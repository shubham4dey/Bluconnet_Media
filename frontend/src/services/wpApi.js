/**
 * ============================================================
 *  WordPress REST API client for the public /blog pages.
 *
 *  The WordPress site and the React SPA share a single document root
 *  (bluconnetmedia.com). If the SPA's rewrite rule swallows /wp-json/...,
 *  WordPress answers with the SPA shell (text/html) and calling
 *  response.json() on it throws:
 *      SyntaxError: Unexpected token '<', "<!doctype ..." is not valid JSON
 *
 *  This helper therefore:
 *   1. requests the canonical  /wp-json/wp/v2/...  route,
 *   2. verifies the response really is JSON — HTML is never parsed,
 *   3. transparently retries through WordPress's own `?rest_route=` form,
 *      which keeps working even if the /wp-json rewrite rule is missing.
 * ============================================================
 */

/* WordPress origin. Overridable so a staging site can point elsewhere. */
export const WP_ORIGIN = (
  process.env.REACT_APP_WP_ORIGIN || "https://bluconnetmedia.com"
).replace(/\/+$/, "");

/* Build a query string that preserves flag-style params such as `_embed`
   (URLSearchParams would turn it into `_embed=`, which WordPress treats as
   "false" and then omits the featured images). */
function toQuery(params = {}) {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null)
    .map((key) =>
      params[key] === "" ? key : `${key}=${encodeURIComponent(params[key])}`
    )
    .join("&");
}

/**
 * GET a WordPress REST route and return parsed JSON.
 * @param {string} route  e.g. "/wp/v2/posts"
 * @param {object} params e.g. { _embed: "", per_page: 6, page: 1 }
 * @returns {Promise<{ok: boolean, data: any, totalPages: number, url: string}>}
 */
export async function wpGet(route, params = {}) {
  const qs = toQuery(params);
  const candidates = [
    `${WP_ORIGIN}/wp-json${route}${qs ? `?${qs}` : ""}`,
    `${WP_ORIGIN}/index.php?rest_route=${route}${qs ? `&${qs}` : ""}`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const type = (res.headers.get("content-type") || "").toLowerCase();

      // A mis-configured rewrite answers 200 with the SPA shell (text/html).
      // Never hand that to JSON.parse — try the next candidate instead.
      if (!res.ok || !type.includes("application/json")) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[wpApi] ${url} -> ${res.status} ${type || "no content-type"} (not JSON)`
          );
        }
        continue;
      }

      const data = await res.json();
      const totalPages = Number(res.headers.get("X-WP-TotalPages") || 1);
      return { ok: true, data, totalPages, url };
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[wpApi] ${url} failed:`, err && err.message);
      }
    }
  }

  return { ok: false, data: null, totalPages: 1, url: "" };
}

export default { wpGet, WP_ORIGIN };