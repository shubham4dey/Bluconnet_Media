/**
 * dictionaries/index.js — merges the RAW `en~de~fr~it~pt~es` rows into
 * per-language lookup maps keyed by the exact English source string.
 */
import { RAW as R1 } from "./data1.js";
import { RAW as R2 } from "./data2.js";
import { RAW as R3 } from "./data3.js";
import { RAW as R4 } from "./data4.js";
import { RAW as R5 } from "./data5.js";
import { RAW as R6 } from "./data6.js";
import { RAW as R7 } from "./data7.js";
import { RAW as R8 } from "./data8.js";
import { RAW as R9 } from "./data9.js";
import { RAW as R10 } from "./data10.js";

const LANGS = ["de", "fr", "it", "pt", "es"];
const FILES = [R1, R2, R3, R4, R5, R6, R7, R8, R9, R10];

export const DICTS = { en: {}, de: {}, fr: {}, it: {}, pt: {}, es: {} };

const norm = (s) => String(s).replace(/\s+/g, " ").trim();

for (const raw of FILES) {
  for (const line of raw.split(/\r?\n/)) {
    const row = line.trim();
    if (!row) continue;
    const parts = row.split("~");
    if (parts.length !== 6) continue;
    const en = norm(parts[0]);
    if (!en || en.length < 2) continue;
    for (let i = 0; i < LANGS.length; i++) {
      const tr = String(parts[i + 1] || "").trim();
      if (tr && tr !== en) DICTS[LANGS[i]][en] = tr;
    }
  }
}

/* export a cheap size hint without spamming the browser console */
export const DICT_SIZES = Object.fromEntries(
  LANGS.map((lang) => [lang, Object.keys(DICTS[lang]).length])
);