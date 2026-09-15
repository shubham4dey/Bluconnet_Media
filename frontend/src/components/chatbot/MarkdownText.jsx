import React, { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";

/* ============================================================
   Lightweight Markdown renderer for chat messages
   Supports: **bold**, *italic*, `code`, ```code blocks```,
   [links](url), bare URLs, bullet lists, numbered lists
   ============================================================ */

const INLINE_RE =
  /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\[[^\]\n]+\]\((?:https?:\/\/|www\.)[^\s)]+\)|https?:\/\/[^\s<)]+)/g;

/* ============================================================
   sanitizeMarkdown — cleans messy AI / engine output before
   rendering so broken characters (`**`, `\*`, `Whi`) can never
   appear:
   - unescapes literal backslash escapes ( \* → * , \** → ** )
   - drops dangling / unmatched ** tokens on a line
   - collapses 3+ blank lines and trims trailing whitespace
   - removes broken fragments at end (cut-off words)
   ============================================================ */
export function sanitizeMarkdown(raw) {
  if (raw === null || raw === undefined) return raw;
  let s = String(raw);
  s = s.replace(/\\([*_~`#\[\]])/g, "$1");
  s = s
    .split("\n")
    .map((line) => {
      const double = (line.match(/\*\*/g) || []).length;
      if (double % 2 === 1) line = line.replace(/\*\*\s*$/, "");
      return line;
    })
    .join("\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  // remove broken fragments at the end (cut-off words like "Whi", "Xy ab")
  // A broken fragment is a short word (1-3 chars) at the very end that:
  // - is not a number
  // - is not a common English word (a, an, the, is, of, etc.)
  // - does not end with punctuation
  const commonWords = new Set(["a", "an", "the", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "shall", "can", "need", "dare", "ought", "used", "to", "of", "in", "for", "on", "with", "at", "by", "from", "as", "into", "through", "during", "before", "after", "above", "below", "between", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "just", "because", "but", "and", "or", "if", "while", "up", "out", "off", "over", "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "their", "this", "that", "these", "those", "am", "ok", "okay", "yes", "oh", "ah", "hi", "hey", "also", "well", "back", "even", "still", "already", "always", "never", "often", "sometimes", "usually", "really", "quite", "rather", "enough", "almost", "much", "many", "little", "big", "small", "good", "bad", "new", "old", "first", "last", "long", "great", "right", "left", "early", "young", "important", "public", "private", "able", "free", "full", "true", "false", "high", "low", "sure", "surely"]);
  // first remove two-word fragments like "Xy ab" (where both words are uncommon)
  s = s.replace(/\s+(\w{1,3})\s+(\w{1,3})\s*$/, (match, w1, w2) => {
    const isW1Common = commonWords.has(w1.toLowerCase()) || /^\d+$/.test(w1);
    const isW2Common = commonWords.has(w2.toLowerCase()) || /^\d+$/.test(w2);
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
  return s.trimEnd();
}

function renderInline(text, keyBase) {
  const parts = [];
  let last = 0;
  let m;
  const re = new RegExp(INLINE_RE.source, "g");
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${m.index}`;
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={key} className="font-bold">
          {tok.slice(2, -2)}
        </strong>
      );
    } else if (tok.startsWith("*")) {
      parts.push(
        <em key={key} className="italic">
          {tok.slice(1, -1)}
        </em>
      );
    } else if (tok.startsWith("`")) {
      parts.push(
        <code
          key={key}
          className="px-1.5 py-0.5 mx-0.5 rounded-md text-[0.85em] font-mono bg-black/10 dark:bg-white/10 text-pink-600 dark:text-pink-300"
        >
          {tok.slice(1, -1)}
        </code>
      );
    } else if (tok.startsWith("[")) {
      const mm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (mm) {
        parts.push(
          <a
            key={key}
            href={mm[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-300 dark:hover:text-cyan-200 break-all"
          >
            {mm[1]}
          </a>
        );
      }
    } else if (/^https?:\/\//.test(tok) || /^www\./.test(tok)) {
      parts.push(
        <a
          key={key}
          href={tok.startsWith("www.") ? `https://${tok}` : tok}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 font-medium text-cyan-600 hover:text-cyan-200 break-all"
        >
          {tok}
        </a>
      );
    } else {
      parts.push(tok);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function CodeBlock({ code, isDark }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      /* noop */
    }
  };
  return (
    <div
      className={`relative my-2 rounded-xl overflow-hidden border ${
        isDark ? "border-white/10 bg-[#0d1226]" : "border-gray-200 bg-[#0f172a]"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <button
          onClick={copy}
          aria-label="Copy code"
          className="text-gray-400 hover:text-white transition text-xs flex items-center gap-1"
        >
          {copied ? <FaCheck size={11} /> : <FaCopy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-[12.5px] leading-relaxed">
        <code className="font-mono text-emerald-300 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function renderTextBlock(block, isDark, keyBase) {
  const lines = block.split("\n");
  const out = [];
  let bullets = [];
  let numbered = [];
  let n = 0;

  const flushBullets = (k) => {
    if (bullets.length) {
      out.push(
        <ul key={`${keyBase}-ul-${k}`} className="my-1 space-y-1 pl-1">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-cyan-500 mt-[2px] shrink-0">•</span>
              <span className="min-w-0">{parseInlineContent(bullets[i], `${keyBase}-ul-${k}-${i}`)}</span>
            </li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };
  const flushNumbered = (k) => {
    if (numbered.length) {
      out.push(
        <ol key={`${keyBase}-ol-${k}`} className="my-1 space-y-1 pl-1">
          {numbered.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-cyan-500 font-semibold shrink-0">{i + 1}.</span>
              <span className="min-w-0">{parseInlineContent(item, `${keyBase}-ol-${k}-${i}`)}</span>
            </li>
          ))}
        </ol>
      );
      numbered = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (/^#{1,3}\s+/.test(trimmed)) {
      if (bullets.length) flushBullets(i);
      if (numbered.length) flushNumbered(i);
      const level = trimmed.match(/^#+/)[0].length;
      const content = trimmed.replace(/^#{1,3}\s+/, "");
      const cls =
        level === 1
          ? "text-[15px] font-bold mt-1"
          : level === 2
          ? "text-[14px] font-semibold mt-1"
          : "text-[13.5px] font-semibold";
      out.push(
        <p key={`${keyBase}-h-${i}`} className={`${cls} min-w-0`}>
          {parseInlineContent(content, `${keyBase}-h-${i}`)}
        </p>
      );
    } else if (/^[•\-\u2022]\s+/.test(trimmed)) {
      if (numbered.length) flushNumbered(i);
      bullets.push(trimmed.replace(/^[•\-\s]+/, ""));
    } else if (/^\d+[.)]\s+/.test(trimmed)) {
      if (bullets.length) flushBullets(i);
      numbered.push(trimmed.replace(/^\d+[.)]\s+/, ""));
    } else {
      if (bullets.length) flushBullets(i);
      if (numbered.length) flushNumbered(i);
      if (trimmed === "") {
        out.push(<div key={`${keyBase}-sp-${i}`} className="h-2" />);
      } else {
        out.push(
          <p key={`${keyBase}-p-${i}`} className="min-w-0">
            {parseInlineContent(trimmed, `${keyBase}-p-${i}`)}
          </p>
        );
      }
    }
    n = i;
  });
  if (bullets.length) flushBullets(n + 1);
  if (numbered.length) flushNumbered(n + 1);
  return out;
}

function parseInlineContent(text, keyBase) {
  return renderInline(text, keyBase);
}

const MarkdownText = ({ text, isDark }) => {
  if (!text) return null;
  const clean = sanitizeMarkdown(text);
  const segments = String(clean).split(/```(?:\w*\n)?([\s\S]*?)```/g);
  const nodes = [];
  segments.forEach((seg, i) => {
    if (i % 2 === 1) {
      nodes.push(<CodeBlock key={`cb-${i}`} code={seg.replace(/\n$/, "")} isDark={isDark} />);
    } else if (seg.trim()) {
      nodes.push(...renderTextBlock(seg, isDark, `tb-${i}`));
    }
  });
  return <div className="space-y-0.5 leading-relaxed break-words text-left">{nodes}</div>;
};

/* ============================================================
   Typing indicator (three bouncing dots)
   ============================================================ */
export const TypingDots = ({ isDark }) => (
  <div className="flex items-center gap-1.5 px-1 py-1" aria-label="Assistant is typing">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"
        style={{
          animation: "bcBounce 1.2s infinite ease-in-out",
          animationDelay: `${i * 0.18}s`,
        }}
      />
    ))}
  </div>
);

/* ============================================================
   Thinking indicator (shimmer text)
   ============================================================ */
export const ThinkingIndicator = ({ label = "Thinking" }) => (
  <div className="flex items-center gap-2 px-1 py-0.5">
    <span
      className="text-[12px] font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-cyan-400 to-gray-400"
      style={{ backgroundSize: "200% auto", animation: "bcShimmer 1.6s linear infinite" }}
    >
      {label}…
    </span>
  </div>
);

/* ============================================================
   Emoji picker
   ============================================================ */
export const EMOJIS = [
  "😀","😁","😂","🤣","😊","😍","🤩","😎","🤔","🙂","😉","😅",
  "🙌","👏","👍","👎","🙏","💪","🤝","✌️","👌","🫶","❤️","🔥",
  "✨","🎉","🎊","🚀","💡","📌","✅","❌","⚡","🌟","💯","🎯",
  "📧","📞","💼","💰","📅","⏰","🌍","🔍","📊","🤖","🛒","📝",
];

export const EmojiPicker = ({ onPick, isDark }) => (
  <div
    className={`absolute bottom-full mb-2 left-0 z-30 p-2 rounded-2xl shadow-2xl border backdrop-blur-xl grid grid-cols-8 gap-1 w-[264px] ${
      isDark ? "bg-[#131a35]/95 border-white/10" : "bg-white/95 border-gray-200"
    }`}
    role="menu"
    aria-label="Emoji picker"
  >
    {EMOJIS.map((e, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onPick(e)}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-lg hover:scale-125 hover:bg-cyan-500/10 transition-transform"
        aria-label={`Insert ${e}`}
      >
        {e}
      </button>
    ))}
  </div>
);

export default MarkdownText;