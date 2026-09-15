/**
 * ============================================================
 *  autoTranslate — runtime DOM translation engine
 * ============================================================
 *  Translates the rendered website in place (text nodes, input
 *  placeholders, aria-labels, titles, alts, document title and
 *  meta description) using exact-match dictionaries keyed by the
 *  original English strings. A MutationObserver keeps dynamic
 *  content (route changes, validation messages, chat replies…)
 *  translated too. Switching back to "en" restores the original
 *  strings byte-for-byte, so the default design is untouched.
 *
 *  Public API:
 *    setDomLanguage(lang)  – apply a language to the whole page
 *    translateString(en)   – translate one English string (alerts etc.)
 *    getDomLanguage()      – current engine language
 * ============================================================
 */
import { DICTS } from "./dictionaries";
import { translateTexts } from "./runtimeTranslate";

const SUPPORTED = ["en", "de", "fr", "it", "pt", "es"];

/*
 * SINGLE SOURCE OF TRUTH for the current language:
 *
 * This engine mirrors the language persisted by LanguageContext
 * (localStorage "bc_lang") and is initialised from the SAME stored value on
 * page load, so the DOM translation engine and the language selector always
 * agree — even right after a refresh. It is only ever changed through
 * setDomLanguage(lang), which LanguageContext calls with its own `lang`
 * state, so the two can never drift apart. When nothing is saved the
 * default is English, matching the application default.
 */
let currentLang = (() => {
  try {
    const stored = localStorage.getItem("bc_lang");
    if (SUPPORTED.includes(stored)) return stored;
  } catch { /* storage unavailable */ }
  return "en";
})();
let observer = null;
let origTitle = null;
let origDescription = null;

/* original values (English) remembered per node/element */
const origText = new WeakMap();
const origAttr = new WeakMap();

/* runtime (MyMemory) translation bookkeeping:
   - rtApplied: element/text-node -> language code for which its current
     value is correct. Guards the sync engine from overwriting a
     runtime-translated node, and lets us skip already-done nodes. */
const rtApplied = new WeakMap();
let rtTimer = null;

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "IFRAME", "SVG"]);
const ATTRS = ["placeholder", "aria-label", "aria-placeholder", "title", "alt"];

const norm = (s) => String(s).replace(/\s+/g, " ").trim();

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* combined "phrase" regex per language (longest keys first) */
const phraseRx = new Map();
function getPhraseRegex(lang) {
  if (phraseRx.has(lang)) return phraseRx.get(lang);
  const dict = DICTS[lang];
  let rx = null;
  if (dict) {
    const keys = Object.keys(dict).filter((k) => k.length >= 3).sort((a, b) => b.length - a.length);
    if (keys.length) {
      try {
        rx = new RegExp(`(?<![\\p{L}\\p{N}])(?:${keys.map(escapeRe).join("|")})(?![\\p{L}\\p{N}])`, "gu");
      } catch (e) {
        rx = null; /* very old browser without lookbehind */
      }
    }
  }
  phraseRx.set(lang, rx);
  return rx;
}

/**
 * Translate an English string using the dictionary for `lang`.
 * Exact (whitespace-normalised) match first, then word-boundary
 * phrase replacement so headings split across styled spans and
 * mixed-in labels still translate.
 */
export function translateString(en, lang = currentLang) {
  const src = String(en);
  if (!src || !src.trim() || lang === "en") return src;
  const dict = DICTS[lang];
  if (!dict) return src;
  const exact = dict[norm(src)];
  if (exact != null) {
    const lead = /^\s*/.exec(src)[0];
    const trail = /\s*$/.exec(src)[0];
    return lead + exact + trail;
  }
  const rx = getPhraseRegex(lang);
  if (!rx) return src;
  return src.replace(rx, (m) => {
    const hit = dict[norm(m)];
    return hit != null ? hit : m;
  });
}

function translateNodeValue(original, lang) {
  if (lang === "en") return original;
  return translateString(original, lang);
}

/* ---------- text nodes ---------- */
function processTextNode(node) {
  /* runtime (async) translation already owns this node for this language */
  if (rtApplied.get(node) === currentLang) return;
  const value = node.nodeValue;
  if (!value || !value.trim()) return;
  /* respect manual opt-out (e.g. language selector labels) — also on the
     MutationObserver path which calls us directly */
  const p = node.parentNode;
  if (p && p.nodeType === 1 && p.closest("[data-i18n-skip]")) return;
  const original = origText.get(node) ?? value;
  origText.set(node, original);
  const next = translateNodeValue(original, currentLang);
  if (next !== value) node.nodeValue = next;
}

/* ---------- element attributes ---------- */
function processElementAttrs(el) {
  if (SKIP_TAGS.has(el.tagName) || el.closest("[data-i18n-skip]")) return;
  /* runtime (async) translation already owns this element for this language */
  if (rtApplied.get(el) === currentLang) return;
  const attrs = ATTRS.slice();
  if (el.tagName === "INPUT") {
    const t = (el.getAttribute("type") || "").toLowerCase();
    if (t === "submit" || t === "button") attrs.push("value");
  }
  let map = origAttr.get(el);
  for (const a of attrs) {
    if (!el.hasAttribute(a)) continue;
    const value = el.getAttribute(a);
    if (!value || !value.trim()) continue;
    if (!map) { map = {}; origAttr.set(el, map); }
    const original = a in map ? map[a] : value;
    map[a] = original;
    const next = translateNodeValue(original, currentLang);
    if (next !== value) el.setAttribute(a, next);
  }
}

/* ---------- tree walk ---------- */
function walk(root) {
  if (!root) return;
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    if (n.nodeType === Node.TEXT_NODE) {
      const p = n.parentNode;
      if (p && p.nodeType === 1 && (SKIP_TAGS.has(p.tagName) || p.closest("[data-i18n-skip]"))) continue;
      processTextNode(n);
      continue;
    }
    if (n.nodeType !== Node.ELEMENT_NODE) continue;
    if (SKIP_TAGS.has(n.tagName) || n.closest("[data-i18n-skip]")) continue;
    processElementAttrs(n);
    let child = n.firstChild;
    while (child) { stack.push(child); child = child.nextSibling; }
  }
}

/* ---------- SEO bits ---------- */
function applySeo() {
  try {
    if (origTitle === null) origTitle = document.title || "";
    if (origDescription === null) {
      const m = document.querySelector('meta[name="description"]');
      origDescription = m ? m.getAttribute("content") || "" : "";
    }
    document.title = translateNodeValue(origTitle, currentLang);
    const meta = document.querySelector('meta[name="description"]');
    if (meta && origDescription) meta.setAttribute("content", translateNodeValue(origDescription, currentLang));
  } catch (e) { /* noop */ }
}

/* ======================================================================
 *  Runtime translation pass (async fallback for strings missing from the
 *  static dictionaries). Walks the DOM, finds nodes/elements that are
 *  still English after the synchronous pass, translates them in batches
 *  through runtimeTranslate.js (MyMemory + cache) and applies results.
 *  Reuses origText/origAttr as the canonical English source so switching
 *  back to English always restores the true originals.
 * ==================================================================== */
const looksEnglish = (s) => /[A-Za-z]/.test(String(s));

function scheduleRuntimePass(lang) {
  if (lang === "en") return;
  if (rtTimer) clearTimeout(rtTimer);
  rtTimer = setTimeout(() => runRuntimePass(lang), 250);
}

async function runRuntimePass(lang) {
  if (lang === "en" || !document.body) return;
  const textNodes = [];
  const attrEls = new Set();
  const stack = [document.body];
  while (stack.length) {
    const n = stack.pop();
    if (n.nodeType === Node.TEXT_NODE) {
      const p = n.parentNode;
      if (
        p &&
        p.nodeType === 1 &&
        !(SKIP_TAGS.has(p.tagName) || p.closest("[data-i18n-skip]"))
      ) {
        const v = n.nodeValue;
        if (v && v.trim() && rtApplied.get(n) !== lang && looksEnglish(v)) {
          textNodes.push(n);
        }
      }
      continue;
    }
    if (n.nodeType !== Node.ELEMENT_NODE) continue;
    if (SKIP_TAGS.has(n.tagName) || n.closest("[data-i18n-skip]")) continue;
    if (rtApplied.get(n) !== lang) {
      const attrs = ATTRS.slice();
      if (n.tagName === "INPUT") {
        const t = (n.getAttribute("type") || "").toLowerCase();
        if (t === "submit" || t === "button") attrs.push("value");
      }
      for (const a of attrs) {
        if (!n.hasAttribute(a)) continue;
        const v = n.getAttribute(a);
        if (v && v.trim() && looksEnglish(v)) {
          attrEls.add(n);
          break;
        }
      }
    }
    let child = n.firstChild;
    while (child) {
      stack.push(child);
      child = child.nextSibling;
    }
  }

  /* ---- text nodes ---- */
  if (textNodes.length) {
    const jobs = [];
    const uniq = new Map();
    for (const node of textNodes) {
      const src = origText.get(node) || node.nodeValue;
      const key = norm(src);
      let idx = uniq.get(key);
      if (idx === undefined) {
        idx = uniq.size;
        uniq.set(key, idx);
      }
      jobs.push({ node, key, idx });
    }
    const results = await translateTexts(lang, [...uniq.keys()]);
    for (const { node, key, idx } of jobs) {
      const tr = results[idx];
      if (tr && tr !== node.nodeValue) {
        origText.set(node, key);
        rtApplied.set(node, lang);
        node.nodeValue = tr;
      }
    }
  }

  /* ---- element attributes (placeholder, title, aria-label, alt…) ---- */
  if (attrEls.size) {
    const jobs = [];
    const uniq = new Map();
    for (const el of attrEls) {
      const attrs = ATTRS.slice();
      if (el.tagName === "INPUT") {
        const t = (el.getAttribute("type") || "").toLowerCase();
        if (t === "submit" || t === "button") attrs.push("value");
      }
      for (const a of attrs) {
        if (!el.hasAttribute(a)) continue;
        const v = el.getAttribute(a);
        if (!v || !v.trim() || !looksEnglish(v)) continue;
        const map = origAttr.get(el);
        const src = (map && a in map ? map[a] : v) || v;
        const key = norm(src);
        let idx = uniq.get(key);
        if (idx === undefined) {
          idx = uniq.size;
          uniq.set(key, idx);
        }
        jobs.push({ el, a, key, idx });
      }
    }
    const results = await translateTexts(lang, [...uniq.keys()]);
    for (const { el, a, key, idx } of jobs) {
      const tr = results[idx];
      if (tr && tr !== el.getAttribute(a)) {
        let map = origAttr.get(el);
        if (!map) {
          map = {};
          origAttr.set(el, map);
        }
        map[a] = key;
        rtApplied.set(el, lang);
        el.setAttribute(a, tr);
      }
    }
  }
}

/* ---------- observer for dynamic content ---------- */
function ensureObserver() {
  if (observer || typeof MutationObserver === "undefined" || !document.body) return;
  observer = new MutationObserver((muts) => {
    let changed = false;
    for (const m of muts) {
      if (m.type === "characterData") {
        processTextNode(m.target);
        changed = true;
      } else if (m.type === "attributes") {
        processElementAttrs(m.target);
        changed = true;
      } else if (m.type === "childList") {
        for (const n of m.addedNodes) {
          walk(n);
          changed = true;
        }
      }
    }
    /* dynamic content (route changes, chat, validation messages…) also
       needs the async runtime pass when anything changed */
    if (changed) scheduleRuntimePass(currentLang);
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...ATTRS, "value"],
  });
}

/* ---------- public API ---------- */
export function setDomLanguage(lang) {
  currentLang = SUPPORTED.includes(lang) ? lang : "en";
  applySeo();
  if (document.body) {
    walk(document.body);
    ensureObserver();
    scheduleRuntimePass(currentLang);
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        walk(document.body);
        ensureObserver();
        scheduleRuntimePass(currentLang);
      },
      { once: true }
    );
  }
}

export function getDomLanguage() {
  return currentLang;
}

export const I18N_LANGS = SUPPORTED;
