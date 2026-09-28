import React, { useEffect } from "react";

/* ============================================================================
   Google reCAPTCHA v3 — official integration (site-wide)
   ============================================================================

   What it does
   ------------
   Loads Google's official reCAPTCHA v3 script with the project's site key:

     https://www.google.com/recaptcha/api.js?render=<SITE_KEY>

   Loading that script is what renders Google's own reCAPTCHA badge in the
   bottom-right corner. No custom widget/design is used and the badge is never
   hidden, so the integration follows Google's branding requirements.

   Where the site key comes from
   -----------------------------
   The key already lives in the project .env files as
   `VITE_RECAPTCHA_SITE_KEY`. `react-scripts` (CRA/webpack) only injects
   `REACT_APP_*` variables into the browser bundle, so the link below is driven
   by the CRA-visible `REACT_APP_RECAPTCHA_SITE_KEY` first and then falls back
   to the existing `VITE_` variable and to the key those files already hold.
   Site keys are public by design (Google ships them in the script URL).

   Using it from a form
   --------------------
   reCAPTCHA v3 tokens expire after two minutes, so they must be requested at
   the moment the user acts — never on page load:

     const token = await getRecaptchaToken("contact_form");
     // send `token` along with the form payload for server-side verification
     // (POST https://www.google.com/recaptcha/api/siteverify with the secret)

   If reCAPTCHA cannot load (offline, blocked, key missing) everything degrades
   gracefully: `getRecaptchaToken()` resolves to `null` and the site keeps
   working exactly as before.
   ========================================================================== */

/* Mirrors the VITE_RECAPTCHA_SITE_KEY value configured in .env,
   .env.development and .env.production. Only used when neither variable name
   is exposed to the bundle, so the official badge always loads. */
const FALLBACK_SITE_KEY = "6LdLvswtAAAAAPscdvooAkP_xxfRN6rHMIT2wsdD";

const RECAPTCHA_SITE_KEY = (
  process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
  process.env.VITE_RECAPTCHA_SITE_KEY ||
  FALLBACK_SITE_KEY
).trim();

/* Marks/identifies our script tag (same attribute the component always used). */
const SCRIPT_FLAG = "data-recaptcha";
const READY_TIMEOUT_MS = 10000;

/* One shared load per page, no matter how often the component mounts. */
let readyPromise = null;

const findRecaptchaScript = () =>
  document.querySelector(`script[${SCRIPT_FLAG}="true"]`);

/**
 * Resolves `true` once the reCAPTCHA library is loaded and usable, and
 * `false` when it cannot be used (missing key, offline, script blocked).
 */
function whenRecaptchaReady() {
  return new Promise((resolve) => {
    const deadline = Date.now() + READY_TIMEOUT_MS;

    const poll = () => {
      if (window.grecaptcha && typeof window.grecaptcha.ready === "function") {
        window.grecaptcha.ready(() => resolve(true));
        return;
      }
      if (Date.now() >= deadline) {
        resolve(false);
        return;
      }
      window.setTimeout(poll, 100);
    };

    poll();
  });
}

/**
 * Injects Google's official reCAPTCHA v3 script once and resolves to whether
 * reCAPTCHA became available. Safe to call repeatedly.
 */
function loadRecaptcha() {
  if (readyPromise) return readyPromise;

  readyPromise = (async () => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn("reCAPTCHA site key is missing.");
      return false;
    }

    if (!findRecaptchaScript()) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.setAttribute(SCRIPT_FLAG, "true");
      script.onerror = () =>
        console.warn("reCAPTCHA script could not be loaded.");
      document.head.appendChild(script);
    }

    return whenRecaptchaReady();
  })();

  return readyPromise;
}

/**
 * reCAPTCHA v3 helper — returns a fresh token for `action`, or `null` when
 * reCAPTCHA is not available. Actions may contain alphanumerics, slashes and
 * underscores only.
 */
export async function getRecaptchaToken(action) {
  const ready = await loadRecaptcha();
  if (!ready) return null;

  try {
    return await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
      action: action || "submit",
    });
  } catch (err) {
    console.warn(
      "reCAPTCHA could not be executed:",
      err && err.message ? err.message : err
    );
    return null;
  }
}

/* ----------------------------------------------------------------------------
   Touch / tablet: open the official badge by tapping it
   ----------------------------------------------------------------------------
   Nothing in this helper changes the desktop path: it returns immediately
   (no listener, no class, no style change) unless the device reports that it
   has no hover capability at all (`(hover: none)` = phone / tablet).

   Why it is needed: the badge is one cross-origin Google iframe (the visible
   70px tile is part of it) parked at `right:-186px`. A tap therefore goes
   inside the iframe — the page never receives it and `:hover` is not applied
   over an iframe — so the panel could not be opened by tapping at all
   (measured: two taps on the production badge left it at `right:-186px`).

   What it does (no fake UI, no simulated verification):
   • marks the badge `grecaptcha-badge-touch` so the (hover:none) CSS lets the
     tap land on Google's own badge wrapper while it is collapsed,
   • on tap inside the badge slides Google's real panel out
     (`grecaptcha-badge-expanded` — the same geometry as desktop hover),
   • on tap anywhere else closes it again,
   • the CSS hands pointer events straight back to Google's iframe as soon as it
     is expanded, so all further taps hit the real reCAPTCHA UI.
   -------------------------------------------------------------------------- */
const BADGE_TOUCH_CLASS = "grecaptcha-badge-touch";
const BADGE_EXPANDED_CLASS = "grecaptcha-badge-expanded";
const BADGE_SELECTOR = ".grecaptcha-badge";
const NO_HOVER_QUERY = "(hover: none)";

/**
 * Enables tap-to-open for the official badge on touch devices only.
 * Resolves to a cleanup function, or to `null` when the device has hover (in
 * which case nothing at all is registered).
 */
function enableTouchTapToOpen() {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof window.matchMedia !== "function" ||
    !window.matchMedia(NO_HOVER_QUERY).matches
  ) {
    return null;
  }

  /* pointerdown where available (every modern mobile browser), otherwise the
     legacy touch event. Capture phase: the tap is seen before anything else. */
  const tapEvent = "onpointerdown" in window ? "pointerdown" : "touchstart";

  const onTap = (event) => {
    const badge = document.querySelector(BADGE_SELECTOR);
    if (!badge) return;

    /* Google's iframe never lets a tap bubble out, so a tap that reaches us
       inside the badge is a tap on the collapsed tile (or on the panel while
       the iframe is interactive). */
    const tappedBadge = event.target === badge || badge.contains(event.target);
    badge.classList.toggle(BADGE_EXPANDED_CLASS, tappedBadge);
  };

  document.addEventListener(tapEvent, onTap, true);

  /* Google injects div.grecaptcha-badge asynchronously, so mark it as soon as
     it exists (and immediately if it is already there). */
  const markBadge = () => {
    const badge = document.querySelector(BADGE_SELECTOR);
    if (!badge) return false;
    badge.classList.add(BADGE_TOUCH_CLASS);
    return true;
  };

  let observer = null;
  if (!markBadge() && typeof MutationObserver === "function") {
    observer = new MutationObserver(() => {
      if (markBadge()) {
        observer.disconnect();
        observer = null;
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  return () => {
    document.removeEventListener(tapEvent, onTap, true);
    if (observer) observer.disconnect();
  };
}

const RecaptchaProtection = () => {
  useEffect(() => {
    loadRecaptcha();
    /* no-op on desktop: returns null unless the device has no hover at all */
    return enableTouchTapToOpen() || undefined;
  }, []);

  return null;
};

export default RecaptchaProtection;
