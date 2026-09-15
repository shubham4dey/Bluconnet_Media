/**
 * LanguageContext - Global i18n provider
 * Supports English, German, French, Italian, Portuguese, Spanish.
 * Persists the selection in localStorage and applies it to the whole
 * rendered DOM (text, placeholders, aria-labels, titles, alts, <html
 * lang>, document title & meta description) without reloading.
 */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { setDomLanguage, I18N_LANGS } from "../i18n/autoTranslate";

const LanguageContext = createContext();

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const LANGUAGES = [
  { code: "en", name: "English", native: "English", dir: "ltr", flag: "🇺🇸" },
  { code: "de", name: "German", native: "Deutsch", dir: "ltr", flag: "🇩🇪" },
  { code: "fr", name: "French", native: "Français", dir: "ltr", flag: "🇫🇷" },
  { code: "it", name: "Italian", native: "Italiano", dir: "ltr", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", native: "Português", dir: "ltr", flag: "🇵🇹" },
  { code: "es", name: "Spanish", native: "Español", dir: "ltr", flag: "🇪🇸" },
];

export const RTL_LANGS = new Set();

/* BCP-47 locales for voice input / output */
export const SPEECH_LOCALES = {
  en: "en-US", de: "de-DE", fr: "fr-FR", it: "it-IT", pt: "pt-PT", es: "es-ES",
};
export const speechLocale = (code) => SPEECH_LOCALES[code] || "en-US";

const SUPPORTED = new Set(I18N_LANGS);

const STORAGE_KEY = "bc_lang";
function getStoredLang() { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } }
function setStoredLang(code) { try { localStorage.setItem(STORAGE_KEY, code); } catch { } }

export const LanguageProvider = ({ children, translations }) => {
  /* Default is ALWAYS English. We never auto-detect or auto-switch the
     language. The only thing that can change it is an explicit manual
     selection (persisted in localStorage so returning visitors keep
     their chosen language on their NEXT visit). */
  const [lang, setLang] = useState(() => {
    const stored = getStoredLang();
    if (stored && SUPPORTED.has(stored)) return stored;
    return "en";
  });

  const isRTL = RTL_LANGS.has(lang);

  useEffect(() => {
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
    /* translate the whole rendered page in place (no reload) */
    setDomLanguage(lang);
  }, [lang, isRTL]);

  const changeLang = useCallback((code) => {
    if (!SUPPORTED.has(code)) code = "en";
    setLang(code);
    setStoredLang(code);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang] || translations["en"] || {};
      const enDict = translations["en"] || {};
      let str = key.split(".").reduce((obj, k) => obj?.[k], dict);
      if (str === undefined || str === null) {
        str = key.split(".").reduce((obj, k) => obj?.[k], enDict);
      }
      if (str === undefined || str === null) str = key;
      if (vars && typeof str === "string") {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        });
      }
      return str;
    },
    [lang, translations]
  );

  const value = useMemo(
    () => ({ lang, setLang: changeLang, t, isRTL, LANGUAGES }),
    [lang, changeLang, t, isRTL]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;