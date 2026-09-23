/**
 * ============================================================
 *  Inline image placeholders for the News pages.
 *
 *  Every News <img> falls back to one of these when a stored
 *  image URL cannot be loaded. They are inline `data:` SVGs on
 *  purpose:
 *    • they need no network request, so the fallback itself can
 *      never fail. The previous fallback pointed at
 *      `https://via.placeholder.com/...`, which no longer serves
 *      images — so a single failing image collapsed into a
 *      broken image icon (and looked like "the placeholder"
 *      even when the real URL was in the database).
 *    • the <img> keeps its existing class/size, so the UI and
 *      the design are unchanged — only the pixels behind it.
 * ============================================================
 */

/** Build a `data:` URI SVG placeholder with a centred label. */
function placeholder(width, height, label, background, colour) {
  const fontSize = Math.max(11, Math.round(Math.min(width, height) / 9));
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">` +
    `<rect width="${width}" height="${height}" fill="${background}"/>` +
    `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" ` +
    `font-family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" ` +
    `font-size="${fontSize}" font-weight="600" fill="${colour}">${label}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/* Public News card (same 400×300 box the old placeholder service painted). */
export const NEWS_CARD_FALLBACK = placeholder(
  400,
  300,
  "BluConnet Media",
  "#edf2f7",
  "#94a3b8"
);

/* Admin panel list thumbnail (80×80, matching the list's small tile). */
export const NEWS_THUMB_FALLBACK = placeholder(
  80,
  80,
  "No Image",
  "#e5e7eb",
  "#9ca3af"
);

/* Article hero on the details page (wide box, object-contain). */
export const NEWS_ARTICLE_FALLBACK = placeholder(
  1200,
  630,
  "BluConnet Media",
  "#edf2f7",
  "#94a3b8"
);

export default {
  NEWS_CARD_FALLBACK,
  NEWS_THUMB_FALLBACK,
  NEWS_ARTICLE_FALLBACK,
};
