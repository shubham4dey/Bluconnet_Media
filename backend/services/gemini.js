/**
 * ============================================================
 *  Gemini API client — powers general-knowledge answers for the
 *  BluConnet AI assistant.
 *
 *  The frontend sends unknown/general questions here so the bot
 *  never hallucinates company facts. Uses global fetch (Node ≥ 18),
 *  so no extra dependencies are required.
 *
 *  Config (backend/.env):
 *    GEMINI_API_KEY=your-key
 *    GEMINI_MODEL=gemini-3.5-flash     (optional)
 * ============================================================
 */

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = (process.env.GEMINI_MODEL || "gemini-3.5-flash").trim();

const LANG_NAMES = {
  en: "English",
  de: "German",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
  es: "Spanish",
  hi: "Hindi",
};

const COMPANY_FACTS = `BluConnet Media is a full-stack digital growth agency.
- Services: SEO, Social Media Marketing, Content Marketing, Email Marketing, PPC / Performance Marketing, Affiliate Marketing, Lead Generation, Web Development, E-Commerce Marketing, AI Automation, Data Analytics and Mobile Marketing.
- Locations: Kolkata, India (work from office) + UK and US (remote).
- Contact: info@bluconnetmedia.com, +91 98765 43210, www.bluconnetmedia.com.
- Hours: Monday to Friday 9:00 AM - 7:00 PM IST, Saturday 10:00 AM - 4:00 PM IST, Sunday closed (the AI assistant is available 24/7).`;

/**
 * System prompt — keeps the model in character, on-topic and in the
 * user's language. Always instructs COMPLETE responses so the reply
 * never reads as truncated.
 */
function systemPrompt(lang) {
  const langName = LANG_NAMES[lang] || "English";
  return [
    "You are the BluConnet Media AI assistant — a helpful, professional customer-facing chatbot.",
    "",
    `IMPORTANT: Always reply in ${langName}. Never switch to another language, even if the user writes in a different one.`,
    "",
    "Company facts you may use:",
    COMPANY_FACTS,
    "",
    "Guidelines:",
    "- If the question is about BluConnet Media (services, pricing, careers, portfolio, contact, blogs, FAQs, etc.), answer using ONLY the company facts above and our website www.bluconnetmedia.com.",
    "- If the question is general knowledge or unrelated to the company, answer it helpfully and correctly.",
    "- If you genuinely cannot answer, politely say you don't have that information and suggest contacting the BluConnet Media team (info@bluconnetmedia.com).",
    "- NEVER invent company facts, prices, client names or policies.",
    "- Format with clean Markdown: **bold** for emphasis, bullet lists with •, short headings with ### when useful, and friendly emojis.",
    "- ALWAYS give complete, finished answers. Never truncate, never cut off mid-sentence, never end with '...' or placeholders, and never leave Markdown syntax unclosed.",
    "- Finish every response with a complete closing sentence or question to continue the conversation.",
  ].join("\n");
}

/** Post-process the model output so it can never render broken. */
function cleanReply(raw) {
  let s = String(raw || "").trim();
  if (!s) return "";
  // unescape literal backslash escapes
  s = s.replace(/\\([*_~`#\[\]])/g, "$1");
  // drop dangling ** tokens per line (odd count = one is unclosed)
  s = s
    .split("\n")
    .map((line) => {
      const opens = (line.match(/\*\*/g) || []).length;
      if (opens % 2 === 1) line = line.replace(/\*\*\s*$/, "");
      return line;
    })
    .join("\n");
  // collapse excessive blank lines
  s = s.replace(/\n{3,}/g, "\n\n");
  // remove broken fragments at the end (cut-off words like "Whi", "We of")
  // A broken fragment is a short word (1-3 chars) at the very end that:
  // - is not a number
  // - is not a common English word (a, an, the, is, of, etc.)
  // - does not end with punctuation
  const commonWords = new Set(["a", "an", "the", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "shall", "can", "need", "dare", "ought", "used", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just", "because", "but", "and", "or", "if", "while", "up", "out", "off", "over", "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "their", "this", "that", "these", "those", "am", "ok", "okay", "yes", "oh", "ah", "hi", "hey", "also", "well", "back", "even", "still", "already", "always", "never", "often", "sometimes", "usually", "really", "quite", "rather", "enough", "almost", "much", "many", "little", "big", "small", "good", "bad", "new", "old", "first", "last", "long", "great", "little", "right", "left", "early", "young", "important", "public", "private", "able", "free", "full", "true", "false", "high", "low", "sure", "surely"]);
  // first remove two-word fragments like "We of" (where at least one word is uncommon)
  s = s.replace(/\s+(\w{1,3})\s+(\w{1,3})\s*$/, (match, w1, w2) => {
    const isW1Common = commonWords.has(w1.toLowerCase()) || /^\d+$/.test(w1);
    const isW2Common = commonWords.has(w2.toLowerCase()) || /^\d+$/.test(w2);
    // remove only if BOTH words are uncommon (likely broken fragments)
    if (!isW1Common && !isW2Common) return "";
    return match;
  });
  // then remove single-word fragments like "Whi"
  s = s.replace(/\s+\w{1,3}\s*$/, (match) => {
    const trimmed = match.trim();
    if (/^\d+$/.test(trimmed)) return match;
    if (commonWords.has(trimmed.toLowerCase())) return match;
    if (trimmed.match(/[.!?…]$/)) return match;
    return "";
  });
  return s.trim();
}

/**
 * Ask Gemini for a completion.
 * Returns { ok: true, reply } or { ok: false, error }.
 */
async function askGemini({ message, history = [], lang = "en" }) {
  const key = String(process.env.GEMINI_API_KEY || "").trim();
  if (!key) {
    console.log("[gemini] GEMINI_API_KEY is not configured — skipping AI answer");
    return { ok: false, error: "GEMINI_API_KEY not configured" };
  }

  const contents = [];
  // role-agnostic system priming
  contents.push({ role: "user", parts: [{ text: systemPrompt(lang) }] });
  // recent conversation context (keeps follow-ups coherent)
  const recent = Array.isArray(history) ? history.slice(-12) : [];
  for (const m of recent) {
    const role = m && m.role === "user" ? "user" : "model";
    const text = String((m && m.text) || "").slice(0, 800);
    if (text) contents.push({ role, parts: [{ text }] });
  }
  contents.push({ role: "user", parts: [{ text: String(message).slice(0, 2000) }] });

  try {
    const res = await fetch(
      `${GEMINI_BASE}/${encodeURIComponent(MODEL)}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.4,
            topP: 0.95,
            maxOutputTokens: 4000,
          },
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[gemini] HTTP ${res.status}: ${body.slice(0, 300)}`);
      return { ok: false, error: `Gemini HTTP ${res.status}` };
    }

    const data = await res.json();
    const reply =
      (data.candidates || [])
        .flatMap((c) => (c.content?.parts || []).map((p) => p.text || ""))
        .join("")
        .trim();
    if (!reply) return { ok: false, error: "empty Gemini response" };
    return { ok: true, reply: cleanReply(reply) };
  } catch (e) {
    console.error("[gemini] request failed:", e.message);
    return { ok: false, error: e.message || "Gemini request failed" };
  }
}

module.exports = { askGemini, cleanReply };