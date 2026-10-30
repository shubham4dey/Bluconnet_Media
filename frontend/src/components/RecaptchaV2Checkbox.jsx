import React, { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================================
   reCAPTCHA v2 "I'm not a robot" Checkbox — opened by the Google badge
   ============================================================================

   What this file does (and what it deliberately does NOT do)
   ---------------------------------------------------------
   The v3 integration in `components/RecaptchaProtection.jsx` is untouched and
   still does everything it did before (same site key, same badge, same hover /
   tap behaviour, same tokens for the protected API routes).

   This component adds ONE thing on top of it: the v3 badge becomes clickable /
   tappable and opens Google's REAL reCAPTCHA v2 "I'm not a robot" checkbox —
   centred, with a fullscreen dimmed + subtly blurred backdrop behind it (the
   same look the site's own modals use), so the website visibly sits behind the
   verification while Google's widget stays sharp on top of it.

       click / tap the badge  →  the page behind dims + blurs and Google's own
                                 v2 checkbox is rendered, centred in the viewport
                              →  the visitor ticks it
                              →  Google verifies (and shows its own challenge
                                 whenever it decides one is required)
                              →  Google's own success state is shown

   Everything the visitor sees inside the box is Google's own cross-origin
   widget (its own iframe, its own checkbox, its own challenge, its own
   branding). Nothing is faked, re-styled, simulated or auto-answered — this
   file never sets a verification result itself.

   How the click reaches us
   ------------------------
   The badge is one cross-origin iframe, so a click inside it never reaches the
   page. This component therefore puts a transparent click target over Google's
   own `.grecaptcha-badge` wrapper (size/position inherited from the wrapper, so
   it is always exactly on top of the badge, on every screen size, in both the
   collapsed and the hover-expanded state).

   Because the target is a CHILD of that wrapper, the existing `:hover` rule in
   `index.css` still expands the badge exactly as before — the badge's geometry,
   size, position, animation and responsive offsets are untouched. The badge is
   still Google's real badge and is never hidden.

   (Measured on the live badge: the box is 256x60 parked at `right:-186px`, so
   70px are on screen while collapsed; on hover the box slides 200px left. The
   point under the pointer therefore moves from the box's left 70px to its right
   70px — covering the whole box is what makes a click/tap land here in every
   state, and it also avoids racing the 0.3s slide-out transition.)

   Why a SECOND (v2) site key is required
   --------------------------------------
   A v3 site key cannot render this checkbox. Rendered as a v2 checkbox widget,
   Google answers, inside the widget itself:

       ERROR for site owner: Invalid key type

   (measured in a real browser against the project's v3 key; a bogus key answers
   "Invalid site key" instead, so the message is specific to the key TYPE).
   A separate key has to be created:
   https://www.google.com/recaptcha/admin/create
     • reCAPTCHA type : reCAPTCHA v2  →  "I'm not a robot" Checkbox
     • Domains        : bluconnetmedia.com, www.bluconnetmedia.com, localhost
   Then paste the SITE key below (a site key is public by design — Google ships
   it in the page's script URL, exactly like the v3 key already in this project),
   or set `REACT_APP_RECAPTCHA_V2_SITE_KEY` in frontend/.env,
   .env.development and .env.production (`react-scripts` only exposes
   `REACT_APP_*` to the browser bundle) and rebuild.

   While no v2 key is configured this component renders nothing and does not
   touch the badge at all: the site behaves exactly as it does today.
   ========================================================================== */

const V2_SITE_KEY_FALLBACK =
  ""; /* <-- paste the v2 "I'm not a robot" Checkbox SITE key between the quotes */

/** The configured v2 Checkbox site key ('' when it has not been set yet). */
function v2SiteKey() {
  return String(
    process.env.REACT_APP_RECAPTCHA_V2_SITE_KEY ||
      process.env.VITE_RECAPTCHA_V2_SITE_KEY ||
      V2_SITE_KEY_FALLBACK
  ).trim();
}

/* Google's own badge wrapper (v3) + the click target added inside it. */
const BADGE_SELECTOR = ".grecaptcha-badge";
const TRIGGER_CLASS = "bc-recaptcha-v2-trigger";
const PANEL_ID = "bc-recaptcha-v2-panel";
const BACKDROP_ID = "bc-recaptcha-v2-backdrop";

/* Visible part of Google's collapsed badge (70x60 of its 256x60 box — measured
   on the live badge). The click target below spans the whole box on purpose:
   the box slides 200px left on hover, so the point under the pointer moves from
   its left 70px to its right 70px. */
const TRIGGER_INSET = "0px";

/* The v2 library is loaded by RecaptchaProtection (api.js?render=<v3 key>) and
   is the same `grecaptcha` object; `grecaptcha.render()` is available from it
   (verified in a real browser against that exact script load). The poll below
   simply waits for it, so the two components need no import/boot ordering. */
const READY_TIMEOUT_MS = 10000;
const READY_POLL_MS = 100;

/* Panel geometry: nothing but a plain container for Google's widget, centred on
   the viewport — so the checkbox opens as its own centred popup instead of
   sitting directly above / next to Google's bottom-right badge.

   Google renders this "I'm not a robot" Checkbox as a fixed-size 304x78 box, so
   the container is parked on the viewport's centre point and pulled back by
   half of that box (left/top 50% + equal negative margins).

   Plain offsets are used on purpose rather than a `transform`: the container
   keeps exactly the same kind of parent Google's widget already had
   (`position: fixed`, unchanged from before this positioning change), so
   nothing about the widget itself moves or resizes — in particular the
   challenge bubble Google draws next to the checkbox when a puzzle is required
   keeps the geometry it has today. Only the location of the whole popup
   changes. */
const V2_WIDGET_WIDTH_PX = 304;
const V2_WIDGET_HEIGHT_PX = 78;

const PANEL_STYLE = {
  position: "fixed",
  top: "50%",
  left: "50%",
  marginTop: `${-V2_WIDGET_HEIGHT_PX / 2}px`,
  marginLeft: `${-V2_WIDGET_WIDTH_PX / 2}px`,
  zIndex: 10000,
  lineHeight: 0,
};

/* Modal backdrop: while Google's checkbox is open the website behind it is
   dimmed and subtly blurred — the same treatment the site's own modals use
   (`bg-black/60 backdrop-blur-sm`) — and Google's own widget in the panel above
   stays completely sharp and clickable.

   Layering, bottom to top:
     website  →  this backdrop  →  the panel holding Google's widget
   Backdrop z-index 9999 sits above the site's own floating stack (chat /
   scroll-to-top / site modals = 9999, painted earlier in the DOM) and above
   Google's badge (999), while the panel keeps its existing 10000 so the real
   Google iframe is always on top of the dimming and is never blurred or
   restyled. It is deliberately a SIBLING of the panel, not part of it: a
   click/tap on it is therefore "outside the widget" and closes the popup
   through the existing document handler, with no JS change at all. */
const BACKDROP_STYLE = {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 9999,
  background: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  pointerEvents: "auto",
};

const TRIGGER_STYLE = {
  position: "absolute",
  top: TRIGGER_INSET,
  right: TRIGGER_INSET,
  bottom: TRIGGER_INSET,
  left: TRIGGER_INSET,
  zIndex: "2",
  background: "transparent",
  cursor: "pointer",
  pointerEvents: "auto",
  touchAction: "manipulation",
};

/** Resolves true once `grecaptcha` is loaded and usable, false on timeout. */
function whenGrecaptchaReady() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

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
      window.setTimeout(poll, READY_POLL_MS);
    };

    poll();
  });
}

/**
 * Google's official v2 Checkbox, opened from the badge.
 *
 * @param {object}   [props]
 * @param {Function} [props.onVerified] receives Google's token once the
 *   checkbox challenge is solved (nothing is done with it by default — the
 *   existing v3 flow stays the API protection, so no endpoint is touched).
 */
const RecaptchaV2Checkbox = ({ onVerified }) => {
  const [open, setOpen] = useState(false);
  const mountRef = useRef(null);
  const widgetRef = useRef(null);
  const onVerifiedRef = useRef(onVerified);

  useEffect(() => {
    onVerifiedRef.current = onVerified;
  }, [onVerified]);

  const openCheckbox = useCallback(() => setOpen(true), []);

  /* --------------------------------------------------------------------------
     1. Make the badge clickable / tappable — no other badge behaviour changes.
     ------------------------------------------------------------------------ */
  useEffect(() => {
    const key = v2SiteKey();
    if (!key || typeof document === "undefined") {
      if (!key) {
        console.warn(
          "[recaptcha-v2] no v2 Checkbox site key configured — the badge will not open the checkbox."
        );
      }
      return undefined;
    }

    let observer = null;
    let trigger = null;

    const onClick = (event) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      openCheckbox();
    };

    const onKeyDown = (event) => {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "Spacebar"
      ) {
        onClick(event);
      }
    };

    const install = () => {
      const badge = document.querySelector(BADGE_SELECTOR);
      if (!badge) return false;
      if (badge.querySelector(`.${TRIGGER_CLASS}`)) return true;

      trigger = document.createElement("div");
      trigger.className = TRIGGER_CLASS;
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("aria-label", "Verify you are not a robot");
      trigger.setAttribute("title", "I'm not a robot");
      Object.assign(trigger.style, TRIGGER_STYLE);
      trigger.addEventListener("click", onClick);
      trigger.addEventListener("keydown", onKeyDown);
      badge.appendChild(trigger);
      return true;
    };

    if (!install() && typeof MutationObserver === "function") {
      observer = new MutationObserver(() => {
        if (install() && observer) {
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
      if (observer) observer.disconnect();
      if (trigger) {
        trigger.removeEventListener("click", onClick);
        trigger.removeEventListener("keydown", onKeyDown);
        trigger.remove();
      }
      trigger = null;
    };
  }, [openCheckbox]);

  /* --------------------------------------------------------------------------
     2. Render Google's real v2 widget into the panel when it opens.
     ------------------------------------------------------------------------ */
  useEffect(() => {
    if (!open || !v2SiteKey()) return undefined;

    let cancelled = false;

    (async () => {
      const ready = await whenGrecaptchaReady();
      const key = v2SiteKey();
      if (cancelled || !ready || !key) return;

      const container = mountRef.current;
      if (!container || container.childElementCount > 0) return; // already there

      try {
        widgetRef.current = window.grecaptcha.render(container, {
          sitekey: key,
          /* Google reports the solved challenge; the token is handed to the
             optional listener and nothing else is decided here. */
          callback: (token) => {
            if (typeof onVerifiedRef.current === "function") {
              onVerifiedRef.current(token);
            }
          },
          /* Google's own token expiry: restart its widget so the visitor can
             verify again instead of being left on an expired checkbox. */
          "expired-callback": () => {
            if (
              widgetRef.current !== null &&
              window.grecaptcha &&
              typeof window.grecaptcha.reset === "function"
            ) {
              window.grecaptcha.reset(widgetRef.current);
            }
          },
        });
      } catch (err) {
        /* Only reached when Google's library itself refuses to render (e.g. the
           site key is missing from the key's domain list). */
        console.warn(
          "[recaptcha-v2] Google's checkbox could not be rendered:",
          (err && err.message) || err
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  /* --------------------------------------------------------------------------
     3. Dismissal — Esc or a click/tap outside the checkbox. Google's own widget
        stays exactly as it is; this only closes the container.
     ------------------------------------------------------------------------ */
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event) => {
      const panel = document.getElementById(PANEL_ID);
      if (panel && panel.contains(event.target)) return;

      const target = event.target;
      if (target && target.classList && target.classList.contains(TRIGGER_CLASS)) {
        return; // the badge itself keeps it open
      }

      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open]);

  const key = v2SiteKey();
  if (!key || !open) return null;

  return (
    <>
      {/* Dimmed + blurred fullscreen backdrop. Rendered only while the popup is
          open and removed with it, so the website is restored to its normal
          appearance on close. Nothing of Google's widget is styled by it. */}
      <div id={BACKDROP_ID} style={BACKDROP_STYLE} aria-hidden="true" />
      <div id={PANEL_ID} style={PANEL_STYLE}>
        {/* Container for Google's own iframe — the widget itself is never
            styled, resized, hidden or replaced. */}
        <div ref={mountRef} />
      </div>
    </>
  );
};

export default RecaptchaV2Checkbox;
export { v2SiteKey };

