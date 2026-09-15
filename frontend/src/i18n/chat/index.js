/* Chat pack index — aggregates per-language AI-chat packs (de/fr/it/pt/es) */
import { de } from "./de.js";
import { fr } from "./fr.js";
import { it } from "./it.js";
import { pt } from "./pt.js";
import { es } from "./es.js";

export const CHAT_PACKS = { de, fr, it, pt, es };
export const CHAT_LANGS = Object.keys(CHAT_PACKS);