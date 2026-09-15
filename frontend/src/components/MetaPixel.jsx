import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Global Meta Pixel (ID: 1475421227742559) — SPA route-change tracking.
 *
 * The Meta Pixel base code (init + the first PageView + the <noscript>
 * fallback) lives in `public/index.html`, so it is executed exactly once per
 * full document load, before React boots. This component is the single global
 * piece of React-side code that tells the already-initialised Pixel that the
 * user moved to another React route without a full browser refresh.
 *
 * Duplicate protection:
 *   • `lastTrackedPath` is module-level state, so React re-renders, StrictMode
 *     double-invoked effects, component remounts and route re-renders can never
 *     re-fire a PageView for a route that was already tracked.
 *   • The very first render is intentionally NOT tracked here, because
 *     `public/index.html` already sent the PageView for the initial load.
 *   • `window.fbq` is only ever used to send `track` events — `init` is never
 *     called from React, and the snippet's `if (f.fbq) return;` guard makes
 *     sure the Pixel can never be initialised twice.
 *
 * This component renders nothing and has no UI impact.
 */

const PIXEL_ID = "1475421227742559"; // must stay in sync with public/index.html

let lastTrackedPath = null;

/**
 * Sends a single PageView for the given route, unless that route is already
 * tracked (guards against StrictMode/remount duplicates).
 * @param {string} path Route pathname as reported by React Router.
 */
const sendPageView = (path) => {
  if (lastTrackedPath === path) return;

  lastTrackedPath = path;

  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    // Pixel base code unavailable (e.g. blocked) — fail silently, never throw.
    return;
  }

  window.fbq("track", "PageView");
};

const MetaPixel = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Initial load: public/index.html already fired this PageView, so only
    // record the route. Everything React navigates to afterwards is tracked.
    if (lastTrackedPath === null) {
      lastTrackedPath = pathname;
      return;
    }

    sendPageView(pathname);
  }, [pathname]);

  return null;
};

export { PIXEL_ID };
export default MetaPixel;
