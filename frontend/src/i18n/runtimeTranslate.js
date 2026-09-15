/**
 * runtimeTranslate.js — on-demand fallback translator used by the DOM
 * engine (autoTranslate.js) for any English string not present in the
 * static dictionaries.
 *
 * Uses the free MyMemory translation API (CORS enabled, multiline
 * batching) and a localStorage cache so content translates instantly
 * on repeat visits and degrades gracefully when offline / out of quota
 * (such strings simply keep their English source, never break).
 *
 * Terms in SKIP are never sent to the API (brands, URLs, technical
 * acronyms) so they stay byte-for-byte identical in every language.
 */
const API = "https://api.mymemory.translated.net/get";
const CACHE_KEY = "bc_rt_dict_v1";
const CHUNK = 10;

/* Terms that must never be translated (brands / acronyms / tech terms). */
const SKIP = new Set(
  (
    "BluConnet|BluConnet Media|bluconnetmedia|bluconnetmedia.com|" +
    "APVision|ROI|SEO|PPC|CRM|AI|HTML|CSS|JS|API|HTTP|SMS|PDF|URL|CEO|HR|KPI|" +
    "SaaS|Instagram|Facebook|LinkedIn|YouTube|TikTok|Google|Microsoft|Amazon|" +
    "Meta|Shopify|WordPress|React|Node|Gemini|Gmail|YouTube|WhatsApp|X"
  ).split("|")
);

const norm = (s) => String(s).replace(/\s+/g, " ").trim();

let cache = null;
function getCache() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    cache = {};
  }
  if (!cache || typeof cache !== "object") cache = {};
  return cache;
}

function persist() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage quota */
  }
}

async function translateChunk(lang, chunk) {
  const q = chunk.join("\n");
  const url = `${API}?langpair=en|${lang}&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return chunk.map(() => null);
    const data = await res.json();
    const out = data.responseData && data.responseData.translatedText;
    if (typeof out === "string") {
      const lines = out.split("\n");
      return chunk.map((_, i) => {
        const line = lines[i];
        return line && line.trim() ? line : null;
      });
    }
  } catch (e) {
    /* offline / blocked / quota exhausted */
  }
  return chunk.map(() => null);
}

/**
 * Translate an array of English strings into `lang`.
 * Returns an array aligned with `texts`: the translation, or null when
 * the string should be left untouched (term, cached no-op, or failure).
 */
export async function translateTexts(lang, texts) {
  if (lang === "en") return texts.map(() => null);
  const c = getCache();
  const langCache = c[lang] || (c[lang] = {});
  const out = new Array(texts.length);
  const missing = [];
  const missingIdx = [];
  texts.forEach((t, i) => {
    const key = norm(t);
    if (key in langCache) {
      out[i] = langCache[key] === key ? null : langCache[key];
      return;
    }
    if (SKIP.has(t.trim()) || SKIP.has(t.trim().replace(/[™®]/g, ""))) {
      langCache[key] = key; /* cache a no-op so we never re-query it */
      out[i] = null;
      return;
    }
    missing.push(t);
    missingIdx.push(i);
  });
  if (missing.length) {
    for (let start = 0; start < missing.length; start += CHUNK) {
      const chunk = missing.slice(start, start + CHUNK);
      // eslint-disable-next-line no-await-in-loop
      const translations = await translateChunk(lang, chunk);
      chunk.forEach((src, k) => {
        const orig = missingIdx[start + k];
        const tr = translations[k];
        const key = norm(src);
        if (tr) {
          langCache[key] = tr;
          out[orig] = tr;
        } else {
          langCache[key] = key; /* cache no-op to avoid hammering the API */
          out[orig] = null;
        }
      });
    }
    persist();
  }
  return out;
}
