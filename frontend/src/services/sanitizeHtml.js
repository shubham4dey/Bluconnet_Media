/**
 * ============================================================
 *  HTML sanitizer — renders untrusted markup without executing it
 *
 *  WHO USES IT: the public /blog pages. Their content is NOT ours: it is
 *  fetched from the WordPress REST API (`services/wpApi.js`) and written by
 *  every author/editor that WordPress has — plus anything a compromised
 *  plugin, a hacked author account or an open content endpoint can inject.
 *  Rendering that with `dangerouslySetInnerHTML` handed the markup a
 *  script-execution context on bluconnetmedia.com (stored XSS):
 *  `<img src=x onerror=…>`, `<svg onload=…>`, `<iframe src=javascript:…>` and
 *  `<script>` all ran AS THE SITE — able to read `bc_admin_token`, forge
 *  requests, deface pages or redirect visitors.
 *
 *  HOW IT WORKS: parse, then rebuild. The markup is parsed with `DOMParser`
 *  (which never executes anything) into a throwaway document, and a brand new
 *  tree is built that only ever contains allow-listed tags, allow-listed
 *  attributes and safe URLs. Nothing is copied over "because it looked fine":
 *  an attribute we do not know about is dropped, which removes the event
 *  handlers (`on*`), `srcdoc`, `formaction`, `xlink:href`, `<svg>`/`<math>`
 *  and the rest of the script vectors by construction. Rebuilding instead of
 *  mutating also avoids mutation-XSS, where the browser re-parses a mutated
 *  tree differently than the sanitizer thought it would.
 *
 *  WHY NOT DOMPURIFY: it only exists in node_modules as an *optional,
 *  undeclared* transitive dependency of jsPDF, so importing it would need a
 *  package.json / package-lock.json change (out of scope here). This module has
 *  no dependencies at all, so the same protection ships even when the build is
 *  produced with `npm ci --omit=optional`.
 * ============================================================
 */

/* Everything a WordPress / Elementor article legitimately contains. A tag that
   is not listed here loses its markup but keeps its text (see `build`). */
const ALLOWED_TAGS = new Set([
  /* structure */
  "div", "span", "p", "br", "hr", "section", "article", "aside", "header",
  "footer", "main", "figure", "figcaption", "details", "summary",
  /* headings */
  "h1", "h2", "h3", "h4", "h5", "h6",
  /* inline text */
  "a", "strong", "b", "em", "i", "u", "s", "strike", "del", "ins", "mark",
  "small", "sub", "sup", "abbr", "cite", "q", "code", "kbd", "samp", "var",
  "pre", "blockquote",
  /* lists */
  "ul", "ol", "li", "dl", "dt", "dd",
  /* tables */
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup",
  "col",
  /* media */
  "img", "picture", "source", "video", "audio", "iframe",
]);

/* Removed together with everything inside them: these can execute, submit
   forms, restyle the page or phone home, and no article needs them.

   `<svg>` and `<math>` are deliberately NOT in this set. They are removed as
   tags, but their READABLE text is kept: they are in neither this set nor
   ALLOWED_TAGS, so `build`'s unknown-tag branch unwraps them and only the
   element is discarded. Dropping them with their contents would silently
   delete real paragraph text, while keeping them whole would reintroduce the
   SVG/MathML mXSS vectors. Their scripting children (`<script>`, `<style>`,
   `<animate>`/event handlers, namespace URLs) are still removed by the rules
   above and by the attribute allow-list. */
const DROP_TAGS = new Set([
  "script", "style", "noscript", "template", "slot", "form", "fieldset",
  "input", "textarea", "select", "option", "optgroup", "button", "label",
  "output", "keygen", "object", "param", "embed", "applet", "frame",
  "frameset", "base", "link", "meta", "title", "head", "html", "body",
  "portal", "marquee",
]);

/* Never copied, whatever the tag. */
const ALWAYS_FORBIDDEN_ATTRS = new Set([
  "srcdoc", "formaction", "action", "data", "code", "codebase", "profile",
  "usemap", "background", "longdesc", "ping", "xlink", "xmlns:xlink",
  "content", "http-equiv", "dynsrc", "lowsrc", "language",
]);

/* Copied to an allowed tag. `class` and `style` matter a lot: WordPress and
   Elementor express most of their layout through them, so stripping them would
   visually break every article on the site. */
const ALLOWED_ATTRS = new Set([
  /* `style` is allow-listed on purpose (see INSECURE_STYLE below): WordPress and
     Elementor lay every article out with inline styles, so dropping the
     attribute would visibly break the public /blog pages. Only values that
     could execute or reach out are refused. */
  "class", "style", "id", "title", "dir", "align", "width", "height", "alt", "loading",
  "decoding", "sizes", "srcset", "src", "href", "target", "rel", "type",
  "media", "start", "reversed", "value", "colspan", "rowspan", "scope",
  "headers", "valign", "border", "cellpadding", "cellspacing", "datetime",
  "cite", "open", "poster", "controls", "preload", "muted", "loop",
  "autoplay", "playsinline", "allowfullscreen", "frameborder", "allow",
  "referrerpolicy", "sandbox", "name", "role",
]);

/* Attributes whose value is a URL (or a list of URLs, for srcset). */
const URL_ATTRS = new Set(["href", "src", "srcset", "poster", "cite"]);

/* Only https, and only from real embed providers. Anything else is a
   click-jacking / phishing frame inside our own page, so that iframe is
   removed as a whole instead of being neutered to an empty box. */
const IFRAME_HOSTS = new Set([
  "youtube.com", "www.youtube.com", "youtube-nocookie.com",
  "www.youtube-nocookie.com", "player.youtube.com", "youtu.be",
  "vimeo.com", "player.vimeo.com", "dailymotion.com", "www.dailymotion.com",
  "player.twitch.tv", "open.spotify.com", "w.soundcloud.com",
  "maps.google.com", "maps.embed.google.com", "www.google.com",
  "fast.wistia.net", "www.slideshare.net", "platform.twitter.com",
]);

/* `data:` is accepted only where an image is expected — the News CMS and older
   WordPress posts store inline base64 pictures. data:text/html,
   data:application/… and base64 "SVG" never pass. */
const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:", "sms:", "ftp:", "ftps:"]);
const BASE = "https://sanitize.invalid/";
const DATA_IMAGE = /^data:image\/(png|jpe?g|gif|webp|avif|bmp);base64,/i;
const INSECURE_STYLE = /(expression\s*\(|javascript\s*:|vbscript\s*:|behavior\s*:|-moz-binding|@import|url\s*\(\s*["']?\s*(javascript|vbscript|data)\s*:)/i;

/** Safe URL? Empty or unsafe values are dropped instead of rendered. */
function isSafeUrl(value, { allowDataImage = false } = {}) {
  const raw = String(value == null ? "" : value).trim();
  if (!raw) return false;
  if (DATA_IMAGE.test(raw)) return allowDataImage;
  if (/^data:/i.test(raw)) return false;

  /* Relative ("/post/1", "img/a.png", "?p=1", "#anchor") URLs are fine, and
     protocol-relative ones ("//host/x") resolve to https: from BASE. A
     javascript:/vbscript:/file: value — even with stray tabs or newlines,
     which the URL parser strips — resolves to a protocol we do not allow. */
  let url;
  try {
    url = new URL(raw, BASE);
  } catch (err) {
    return false; // unparseable -> refuse
  }
  return SAFE_PROTOCOLS.has(url.protocol);
}

/** srcset is "url 1x, url 2x, …" — every candidate must pass on its own. */
function cleanSrcset(value) {
  const parts = String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const kept = [];
  for (const part of parts) {
    const pieces = part.split(/\s+/);
    const url = pieces[0];
    if (!isSafeUrl(url, { allowDataImage: true })) continue;
    kept.push(pieces.length > 1 ? `${url} ${pieces.slice(1).join(" ")}` : url);
  }
  return kept.join(", ");
}

/** Same-origin-quality rule for embeds: https + a known provider. */
function isSafeEmbed(value) {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "https:" && IFRAME_HOSTS.has(url.hostname.toLowerCase());
  } catch (err) {
    return false;
  }
}

function copyAttributes(source, target) {
  const tag = target.tagName.toLowerCase();
  const isIframe = tag === "iframe";

  for (const attr of Array.prototype.slice.call(source.attributes)) {
    const name = attr.name.toLowerCase();

    /* Anything starting with `on` is an event handler: never copied.
       `data-*` / `aria-*` are inert and stay (Elementor relies on them). */
    if (name.startsWith("on")) continue;
    if (name.startsWith("data-") || name.startsWith("aria-")) {
      target.setAttribute(name, attr.value);
      continue;
    }
    if (ALWAYS_FORBIDDEN_ATTRS.has(name) || !ALLOWED_ATTRS.has(name)) continue;

    if (name === "style") {
      /* Inline styles are how WP/Elementor lay articles out; only values that
         could execute or reach out are refused. */
      if (INSECURE_STYLE.test(attr.value)) continue;
      target.setAttribute("style", attr.value);
      continue;
    }
    if (name === "srcset") {
      const cleaned = cleanSrcset(attr.value);
      if (cleaned) target.setAttribute("srcset", cleaned);
      continue;
    }
    if (URL_ATTRS.has(name)) {
      if (isIframe && name === "src") {
        /* An unusable embed takes the whole iframe down (see `build`). */
        if (isSafeEmbed(attr.value)) target.setAttribute("src", attr.value);
        continue;
      }
      /* `href` never gets the data: exception — a data: document is content. */
      if (!isSafeUrl(attr.value, { allowDataImage: name !== "href" })) continue;
      target.setAttribute(name, attr.value);
      continue;
    }
    target.setAttribute(name, attr.value);
  }

  if (isIframe) {
    target.setAttribute("loading", "lazy");
    target.setAttribute("rel", "noopener");
    return;
  }
  /* target="_blank" without rel=noopener lets the opened tab reach us. */
  if (tag === "a" && target.getAttribute("target") === "_blank") {
    const rel = `noopener noreferrer ${target.getAttribute("rel") || ""}`.trim();
    target.setAttribute("rel", rel.replace(/\s+/g, " "));
  }
}

/** Rebuild `source`'s allowed children into `parent` (new document). */
function build(source, doc, parent) {
  for (const child of Array.prototype.slice.call(source.childNodes)) {
    /* Text is kept verbatim — and stays text, it never becomes markup.
       Comments, CDATA and processing instructions are dropped. */
    if (child.nodeType === 3) {
      parent.appendChild(doc.createTextNode(child.nodeValue));
      continue;
    }
    if (child.nodeType !== 1) continue;

    const tag = child.tagName.toLowerCase();
    if (DROP_TAGS.has(tag)) continue;
    if (!ALLOWED_TAGS.has(tag)) {
      /* Unknown/custom element (Word's <o:p>, <my-widget>, …): the tag goes,
         the readable content inside it stays. */
      build(child, doc, parent);
      continue;
    }

    let el;
    try {
      el = doc.createElement(tag);
    } catch (err) {
      continue;
    }
    copyAttributes(child, el);

    /* A media element whose URL was refused must not survive as an empty
       300x150 box in the middle of the article: an iframe that failed the
       provider check, or an <img>/<source> whose src/srcset was rejected
       (javascript:, an unsafe data: document, …). */
    if (tag === "iframe" && !el.getAttribute("src")) continue;
    if (tag === "img" || tag === "source") {
      const hadUrl = child.hasAttribute("src") || child.hasAttribute("srcset");
      const keptUrl = el.getAttribute("src") || el.getAttribute("srcset");
      if (hadUrl && !keptUrl) continue;
    }

    build(child, doc, el);
    parent.appendChild(el);
  }
}

/** Last-resort output when there is no DOM: plain escaped text. */
function escapeOnly(html) {
  return String(html)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sanitize an HTML fragment for `dangerouslySetInnerHTML`.
 * @param {string} html untrusted markup (WordPress `rendered` fields, …)
 * @returns {string} markup containing only allow-listed tags/attrs/URLs
 */
export function sanitizeHtml(html) {
  if (html == null) return "";
  if (typeof html !== "string") return escapeOnly(String(html));
  if (!html.trim()) return "";

  if (typeof DOMParser === "undefined" || typeof document === "undefined") {
    return escapeOnly(html);
  }

  const parsed = new DOMParser().parseFromString(html, "text/html");
  const out = document.implementation.createHTMLDocument("sanitized");
  build(parsed.body, out, out.body);
  return out.body.innerHTML;
}

/** Plain text for places that must never contain markup (titles, meta…). */
export function htmlToText(html) {
  if (html == null) return "";
  if (typeof DOMParser === "undefined" || typeof document === "undefined") {
    return String(html).replace(/<[^>]*>/g, "");
  }
  /* Route through the sanitizer first: the `textContent` of a raw parse would
     include the source text of <script>/<style>/<template>, which must never
     end up in a title or meta description. */
  const parsed = new DOMParser().parseFromString(sanitizeHtml(html), "text/html");
  return (parsed.body.textContent || "").replace(/\s+/g, " ").trim();
}

export default sanitizeHtml;


