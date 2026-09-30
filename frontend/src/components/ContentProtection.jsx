import { useEffect } from "react";

/* ============================================================================
   Content protection (client-side, deterrent only)
   ============================================================================
   The client asked for aggressive anti-copy behaviour across the site: no
   right-click menu, no image/link dragging out of the page and no Ctrl+C /
   Ctrl+X of selected content — while every form field must keep working
   exactly as before (Ctrl+C/V inside an input, textarea, rich-text editor or
   contenteditable area is normal editing, not content theft).

   What is deliberately NOT done:
     • no `alert()` / toast on right-click — it punished real visitors and was
       trivially dismissed,
     • no invisible overlay over the page (breaks scrolling, taps, screen
       readers and SEO),
     • nothing is hidden from the DOM, and no asset URL is obfuscated:
       anyone determined can still view source or save an image. Client-side
       copy protection raises the effort bar, it is NOT a security boundary —
       the actual protection of the site lives in the backend (auth, RBAC,
       rate limits, input validation).
   ============================================================================ */

/* Where normal editing must never be interfered with. */
const EDITABLE_SELECTOR =
  'input, textarea, select, [contenteditable], [contenteditable="true"], [data-copy-allowed], [data-copy-allowed] *';

const isEditable = (target) =>
  !!target &&
  typeof target.closest === "function" &&
  !!target.closest(EDITABLE_SELECTOR);

const ContentProtection = () => {
  useEffect(() => {
    /* Right-click / long-press context menu (Save image as…, Inspect…). */
    const onContextMenu = (event) => {
      if (!isEditable(event.target)) event.preventDefault();
    };

    /* Dragging an <img> or <a> out of the page saves it straight to disk. */
    const onDragStart = (event) => {
      if (isEditable(event.target)) return;
      const tag = event.target && event.target.tagName;
      if (tag === "IMG" || tag === "A" || tag === "VIDEO" || tag === "SVG") {
        event.preventDefault();
      }
    };

    /* The copy/cut event itself: nothing lands on the clipboard unless the
       selection lives inside a field the visitor is typing in. */
    const onCopy = (event) => {
      if (isEditable(event.target)) return;
      const selection = window.getSelection && window.getSelection();
      if (selection && !selection.isCollapsed) event.preventDefault();
    };

    /* Keyboard shortcuts, on top of the copy event, so Ctrl+C / Ctrl+X /
       Ctrl+U (view source) / Ctrl+S (save page) are refused outside fields. */
    const onKeyDown = (event) => {
      if (isEditable(event.target)) return;
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = String(event.key || "").toLowerCase();
      if (key === "c" || key === "x" || key === "u" || key === "s") {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCopy);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
};

export default ContentProtection;
