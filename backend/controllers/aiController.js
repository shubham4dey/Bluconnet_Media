/**
 * ============================================================
 *  AI controller — POST /api/ai/chat
 *  Escalates unknown / general-knowledge questions to Gemini
 *  while keeping all inputs sanitized and bounded.
 * ============================================================
 */
const { sanitize } = require("../middleware/validate");
const { askGemini } = require("../services/gemini");

exports.aiChat = async (req, res) => {
  try {
    const body = req.body || {};
    const message = sanitize(body.message, 2000);
    if (!message) {
      return res.status(400).json({ ok: false, error: "message required" });
    }

    const lang = sanitize(body.lang, 8) || "en";
    const history = Array.isArray(body.history)
      ? body.history
          .slice(-20)
          .map((m) => ({
            role: m && m.role === "user" ? "user" : "model",
            text: sanitize(m && m.text, 1000),
          }))
          .filter((m) => m.text)
      : [];

    const result = await askGemini({ message, history, lang });
    if (!result.ok || !result.reply) {
      return res.status(502).json({ ok: false, error: result.error || "AI service unavailable" });
    }
    return res.json({ ok: true, reply: result.reply });
  } catch (e) {
    console.error("[aiController] Unhandled error:", e.message, e.stack);
    return res.status(500).json({ ok: false, error: "AI controller error: " + e.message });
  }
};