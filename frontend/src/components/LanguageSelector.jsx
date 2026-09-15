/**
 * LanguageSelector - portal-based language picker.
 * Renders via createPortal + fixed positioning so it can NEVER be
 * clipped by overflow:hidden/auto ancestors (navbar, chat panel, etc).
 * Viewport-clamped, scroll/resize-aware, z-index 99999, fade/slide in.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaCheck } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const PANEL_W = 268;
/* dropdown sizing guards — the panel must always stay fully inside the
   viewport, flipping upward when there isn't room below it (e.g. the
   mobile-menu footer selector sits near the bottom of the screen) */
const MIN_PANEL_H = 150;
const EDGE = 12;

const LanguageSelector = ({ variant = "nav" }) => {
  const { lang, setLang, t, LANGUAGES, isRTL } = useLanguage();
  const { isDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, maxH: 360, above: false });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const updatePos = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 8;

    /* natural content height of the panel (measured from the mounted DOM,
       ≈ 320px for the 6 languages) capped so it can never exceed ~60% of
       a short viewport */
    const capH = Math.min(380, Math.max(MIN_PANEL_H, vh * 0.6));
    const panel = panelRef.current;
    const natural = Math.min(
      capH,
      panel ? Math.max(MIN_PANEL_H, panel.scrollHeight) : capH,
    );

    /* free viewport space above/below the trigger */
    const spaceBelow = vh - r.bottom - gap - EDGE;
    const spaceAbove = r.top - gap - EDGE;

    /* open downward when the full list fits below; otherwise flip upward
       (mobile-menu footer selector sits near the screen bottom). If neither
       side fits the whole list, use the roomier side and scroll inside. */
    let above;
    if (natural <= spaceBelow) above = false;
    else if (natural <= spaceAbove) above = true;
    else above = spaceAbove > spaceBelow;

    const space = Math.max(0, above ? spaceAbove : spaceBelow);
    const h = Math.max(
      MIN_PANEL_H,
      Math.min(natural, Math.max(MIN_PANEL_H, space), vh - 2 * EDGE),
    );

    let top = above ? r.top - gap - h : r.bottom + gap;
    /* hard viewport clamp — the panel can never overflow top or bottom */
    top = Math.max(EDGE, Math.min(top, vh - EDGE - h));

    let left = isRTL ? r.left : r.right - PANEL_W;
    left = Math.max(8, Math.min(left, vw - PANEL_W - 8));
    setPos({ top, left, maxH: h, above });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    updatePos();
    /* one re-measure after paint (emoji flags / font metrics can settle
       slightly later) so panel height and flip direction stay exact */
    const raf = requestAnimationFrame(updatePos);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onRepos = () => updatePos();
    const onDown = (e) => {
      const tgt = e.target;
      if (btnRef.current && btnRef.current.contains(tgt)) return;
      if (panelRef.current && panelRef.current.contains(tgt)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("resize", onRepos);
    window.addEventListener("scroll", onRepos, true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onRepos);
      window.removeEventListener("scroll", onRepos, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pick = (code) => {
    setLang(code);
    setOpen(false);
  };

  const isChat = variant === "chat";
  const triggerCls = isChat
    ? "h-8 px-2 shrink-0 rounded-full flex items-center gap-1 text-[11px] font-bold text-white/90 hover:bg-white/20 transition-colors"
    : `flex items-center gap-1.5 w-[116px] shrink-0 overflow-hidden px-2.5 py-2 rounded-xl text-[12.5px] font-semibold transition-colors ${
        isDarkMode
          ? "text-gray-200 hover:bg-white/10 active:bg-white/15"
          : "text-gray-800 hover:bg-black/5 active:bg-black/10"
      } ${open ? (isDarkMode ? "bg-white/10" : "bg-black/5") : ""}`;

  /* nav trigger must occupy EXACTLY the same space for every language
     (English … Español …) — inline min/width/max so longer names are
     ellipsised instead of resizing the button or pushing navbar items */
  const triggerStyle = isChat
    ? undefined
    : { width: 116, minWidth: 116, maxWidth: 116, boxSizing: "border-box" };

  const panel = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          data-language-panel=""
          data-i18n-skip=""
          role="listbox"
          aria-label={"Language"}
          initial={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: pos.above ? 8 : -8, scale: 0.97 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: PANEL_W,
            maxHeight: pos.maxH,
            zIndex: 99999,
            transformOrigin: pos.above ? "bottom right" : "top right",
          }}
          className={`overflow-y-auto overscroll-contain rounded-2xl border shadow-2xl backdrop-blur-xl bc-chat-scroll ${
            isDarkMode ? "bg-[#0a0f2e]/98 border-white/10" : "bg-white/98 border-gray-200"
          }`}
        >
          <p
            className={`sticky top-0 px-3 py-2 text-[10.5px] font-bold uppercase tracking-wide backdrop-blur-xl ${
              isDarkMode ? "text-gray-400 bg-[#0a0f2e]/95" : "text-gray-500 bg-white/95"
            }`}
          >
            Language - {LANGUAGES.length}+
          </p>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === lang}
              onClick={() => pick(l.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-start transition-colors ${
                l.code === lang
                  ? "bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 font-bold"
                  : isDarkMode
                  ? "hover:bg-white/10"
                  : "hover:bg-black/5"
              }`}
            >
              <span aria-hidden="true" className="text-base leading-none">{l.flag}</span>
              <span className="flex-1 min-w-0">
                <span className={`block text-[12.5px] truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {l.native}
                </span>
                <span className={`block text-[10px] truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {l.name}
                </span>
              </span>
              {l.code === lang && <FaCheck size={11} className="text-cyan-500 shrink-0" aria-hidden="true" />}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-i18n-skip=""
        className={triggerCls}
        style={triggerStyle}
        aria-label={`Language: ${current.native}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Language"
      >
        <FaGlobe size={isChat ? 13 : 14} className="shrink-0" aria-hidden="true" />
        <span className="flex-1 min-w-0 truncate text-start">
          {current.native}
        </span>
        {!isChat && <span aria-hidden="true" className="shrink-0 text-[9px] opacity-60">&#9660;</span>}
      </button>
      {createPortal(panel, document.body)}
    </>
  );
};

export default LanguageSelector;