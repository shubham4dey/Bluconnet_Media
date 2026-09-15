/**
 * ============================================================
 *  useChat — orchestrates the AI assistant:
 *   - chatEngine.js (NLU + flows) runs 100% in the browser
 *   - typewriter "streaming" for human-like responses
 *   - localStorage conversation history & context memory
 *   - session sync + offline queue for leads / meetings / etc.
 * ============================================================
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  processMessage,
  createInitialContext,
  getWelcome,
  resolveQuickAction,
  TRANSLATIONS,
} from "../../utils/chatEngine";
import chatApi from "./chatApi";
import { SPEECH_LOCALES } from "../../context/LanguageContext";
import { sanitizeMarkdown } from "./MarkdownText";

const STORAGE_KEY = "bc_chat_state_v1";
const MAX_STORED = 100;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let seq = 0;
const nextId = () => `m${Date.now().toString(36)}-${(seq++).toString(36)}`;
const newSessionId = () =>
  `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function loadStored() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (raw && Array.isArray(raw.messages)) return raw;
  } catch (e) {
    /* corrupted storage */
  }
  return null;
}

function speak(text, lang) {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const clean = String(text)
      .replace(/[*_`#>|]/g, "")
      .replace(/https?:\/\/\S+/g, "link")
      .slice(0, 300);
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = SPEECH_LOCALES[lang] || "en-US";
    u.rate = 1.04;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    /* voice unsupported */
  }
}

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lang, setLangState] = useState("en");

  const ctxRef = useRef(createInitialContext("en"));
  const sessionRef = useRef(newSessionId());
  const startedAtRef = useRef(Date.now());
  const intentsRef = useRef([]);
  const busyRef = useRef(false);
  const messagesRef = useRef([]);
  const saveTimer = useRef(null);
  const voiceRef = useRef(false);
  const listenersRef = useRef(new Set());

  /* ---------- persistence & sync ---------- */
  const persist = useCallback((msgs, ctx) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: msgs.slice(-MAX_STORED),
          ctx,
          sessionId: sessionRef.current,
          startedAt: startedAtRef.current,
        })
      );
    } catch (e) {
      /* storage quota */
    }
  }, []);

  const scheduleSave = useCallback(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(
      () => persist(messagesRef.current, ctxRef.current),
      400
    );
  }, []);

  const syncSession = useCallback(() => {
    const msgs = messagesRef.current;
    if (!msgs.length) return;
    chatApi.saveSession({
      sessionId: sessionRef.current,
      page: typeof window !== "undefined" ? window.location.pathname : "/",
      lang: ctxRef.current.lang,
      device: /Mobi|Android/i.test(navigator.userAgent || "") ? "mobile" : "desktop",
      messageCount: msgs.length,
      intents: intentsRef.current.slice(-40),
      durationSec: Math.round((Date.now() - startedAtRef.current) / 1000),
      messages: msgs.slice(-60).map((m) => ({ role: m.role, text: m.text, at: m.at })),
      leadId: ctxRef.current.leadId || null,
    });
  }, []);

  /* ---------- boot: restore history or greet ---------- */
  useEffect(() => {
    const stored = loadStored();
    if (stored && stored.messages.length) {
      // Self-heal: never restore a half-streamed message. If a bot message
      // was persisted mid-stream, fall back to its full text (or drop it).
      const repaired = stored.messages.map((m) => {
        if (m && m.role === "bot" && m.streaming) {
          return { ...m, text: m.full || m.text || "", streaming: false };
        }
        if (m && m.full) return { ...m, full: undefined };
        return m;
      });
      setMessages(repaired);
      messagesRef.current = repaired;
      ctxRef.current = { ...createInitialContext("en"), ...(stored.ctx || {}) };
      if (stored.sessionId) sessionRef.current = stored.sessionId;
      if (stored.startedAt) startedAtRef.current = stored.startedAt;
      setLangState(ctxRef.current.lang || "en");
    } else {
      const welcome = getWelcome("en");
      const msgs = [
        {
          id: nextId(),
          role: "bot",
          text: welcome.text,
          quickReplies: welcome.quickReplies,
          at: new Date().toISOString(),
        },
      ];
      setMessages(msgs);
      messagesRef.current = msgs;
      persist(msgs, ctxRef.current);
    }
    try {
      voiceRef.current = localStorage.getItem("bc_voice_on") === "1";
    } catch (e) {
      voiceRef.current = false;
    }
    chatApi.flushQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onLeave = () => {
      persist(messagesRef.current, ctxRef.current);
      syncSession();
    };
    const onVis = () => {
      if (document.visibilityState === "hidden") syncSession();
    };
    window.addEventListener("beforeunload", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("beforeunload", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [persist, syncSession]);

  /* ---------- typewriter streaming ---------- */
  /*
   * Streams a bot reply by whole LINES (never mid-word, never inside a
   * `**bold**` / `*italic*` token), so partial paint can't corrupt
   * Markdown or show cut words like "Whi". Always terminates on the
   * FULL text and stores the full copy (`m.full`) so any interrupted
   * stream self-heals on reload.
   */
  const streamInto = useCallback((id, full) => {
    return new Promise((resolve) => {
      const clean = String(full || "").trimEnd();
      const lines = clean.split("\n");
      const total = lines.length;
      const perTick = Math.max(1, Math.ceil(Math.min(total, 300) / 60));
      let i = 0;
      let resolved = false;
      const tick = () => {
        i = Math.min(total, i + perTick);
        const done = i >= total;
        const shown = done ? clean : lines.slice(0, i).join("\n");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, text: shown, full: clean, streaming: !done } : m
          )
        );
        if (!done) { setTimeout(tick, 12); }
        else if (!resolved) { resolved = true; resolve(); }
      };
      tick();
    });
  }, []);

  const pushReplies = useCallback(
    async (replies) => {
      const list = (replies || []).filter((r) => r && r.text).map((r) => ({ ...r, text: sanitizeMarkdown(r.text) }));
      for (const r of list) {
        const id = nextId();
        const at = new Date().toISOString();
        setIsThinking(false);
        setIsTyping(true);
        setMessages((prev) => [
          ...prev,
          {
            id,
            role: "bot",
            text: "",
            full: r.text,
            quickReplies: r.quickReplies || null,
            at,
          },
        ]);
        await sleep(280 + Math.random() * 420); // human-like pause
        await streamInto(id, r.text);
        // keep the source-of-truth list in sync so refresh never loses it
        messagesRef.current = [
          ...messagesRef.current,
          { id, role: "bot", text: r.text, quickReplies: r.quickReplies || null, at },
        ];
        setIsTyping(false);
        if (voiceRef.current) speak(r.text, ctxRef.current.lang);
        listenersRef.current.forEach((cb) => cb());
      }
    },
    [streamInto]
  );

  /* ---------- engine runner ---------- */
  const runEngine = useCallback(
    async (text, attachment = null) => {
      setIsThinking(true);
      try {
        const result = processMessage(text || "(attachment)", { ...ctxRef.current }, { attachment });
        ctxRef.current = result.ctx;
        setLangState(result.ctx.lang);
        if (result.ctx.lastIntent) intentsRef.current.push(result.ctx.lastIntent);
        await sleep(420 + Math.random() * 380); // natural thinking time
        let submitFailed = false;
        if (result.submit) {
          const { type, payload } = result.submit;
          const fn = {
            lead: chatApi.submitLead,
            meeting: chatApi.submitMeeting,
            application: chatApi.submitApplication,
            handoff: chatApi.submitHandoff,
          }[type];
          if (fn) {
            try {
              const res = await fn({ ...payload, sessionId: sessionRef.current });
              // Store the saved record's ID so the chat session gets linked
              // to the lead in the database (complete chat history in CRM).
              if (res?.ok && res.id) {
                ctxRef.current.leadId = res.id;
                scheduleSave();
                syncSession();
              } else {
                // Delivery failed (offline → queued, or 4xx) — surface it
                submitFailed = true;
              }
            } catch (e) {
              /* chatApi already queues offline submissions */
              submitFailed = true;
            }
          }
        }

        let replies = result.replies || [];
        if (submitFailed) {
          // Honest failure notice — data is queued in localStorage and
          // auto-retried by chatApi.flushQueue when the backend returns.
          const pack = TRANSLATIONS[ctxRef.current.lang] || TRANSLATIONS.en;
          replies = [...replies, {
            text: "⚠️ " + (pack.submitWarning || "I couldn't reach our server just now. Your details are saved locally and will be delivered automatically as soon as the connection is restored."),
          }];
        }

        // Auto-decide: questions the knowledge base can't answer (unrelated /
        // general knowledge) are escalated to Gemini. The engine flags them
        // with `result.needsGeneralAI`. If Gemini is unreachable we keep the engine's
        // polite fallback so the user is never left empty-handed.
        if (result.needsGeneralAI) {
          const history = messagesRef.current
            .slice(-14)
            .filter((m) => m && m.text && (m.role === "user" || m.role === "bot"))
            .map((m) => ({ role: m.role, text: String(m.text).slice(0, 1000) }));
          const ai = await chatApi.aiChat({
            message: String(text || "").slice(0, 2000),
            history,
            lang: ctxRef.current.lang,
          });
          if (ai && ai.ok && ai.reply) {
            // Gemini answers in the currently selected language (enforced
            // server-side) and always in full, clean Markdown.
            // Post-process: ensure the response is complete and well-formed.
            let cleanReply = sanitizeMarkdown(ai.reply);
            // If the response ends abruptly (mid-word), try to complete it
            if (cleanReply && !cleanReply.match(/[.!?…]\s*$/)) {
              // Find the last complete sentence
              const lastSentence = cleanReply.lastIndexOf(". ");
              if (lastSentence > cleanReply.length * 0.7) {
                cleanReply = cleanReply.substring(0, lastSentence + 1).trim();
              }
            }
            const mainQuick = getWelcome(ctxRef.current.lang).quickReplies;
            replies = [{ text: cleanReply, quickReplies: mainQuick }];
            // Gemini succeeded — clear the handoff flag so "yes" won't
            // accidentally start the team-handoff flow.
            ctxRef.current.pendingAction = null;
          } else {
            // Gemini genuinely unavailable - log the actual backend error,
            // then keep the existing fallback bubble shown to the user.
            console.error(
              "[useChat] Gemini unavailable:",
              ai && ai.error ? ai.error : "empty/invalid AI response"
            );
          }
        }

        await pushReplies(replies);
      } catch (e) {
        setIsTyping(false);
        // Localised error message — fall back to English
        let errText = "I hit a small snag processing that. 😅 Could you try again?";
        try {
          const pack = TRANSLATIONS[ctxRef.current.lang] || TRANSLATIONS.en;
          errText = pack.fallback || errText;
        } catch { /* keep default */ }
        const errMsg = {
          id: nextId(),
          role: "bot",
          text: errText,
          at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errMsg]);
        messagesRef.current = [...messagesRef.current, errMsg];
      } finally {
        setIsThinking(false);
        setIsTyping(false);
        busyRef.current = false;
        scheduleSave();
        syncSession();
      }
    },
    [pushReplies, scheduleSave, syncSession]
  );

  const send = useCallback(
    async (rawText, attachment = null) => {
      const text = String(rawText || "").trim();
      if ((!text && !attachment) || busyRef.current) return;
      busyRef.current = true;
      const userMsg = {
        id: nextId(),
        role: "user",
        text,
        attachment,
        at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      messagesRef.current = [...messagesRef.current, userMsg];
      await runEngine(text, attachment);
    },
    [runEngine]
  );

  const sendQuickReply = useCallback(
    (label) => {
      if (busyRef.current) return;
      const mapped = resolveQuickAction(label, ctxRef.current.lang);
      send(mapped || label);
    },
    [send]
  );

  const regenerate = useCallback(async () => {
    if (busyRef.current || ctxRef.current.flow) return; // not during form flows
    const msgs = messagesRef.current;
    let lastBot = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "bot") { lastBot = i; break; }
    }
    let lastUser = -1;
    for (let i = (lastBot === -1 ? msgs.length : lastBot) - 1; i >= 0; i--) {
      if (msgs[i].role === "user") { lastUser = i; break; }
    }
    if (lastUser === -1) return;
    const trimmed = msgs.slice(0, lastBot === -1 ? msgs.length : lastBot);
    setMessages(trimmed);
    messagesRef.current = trimmed;
    busyRef.current = true;
    await runEngine(msgs[lastUser].text, msgs[lastUser].attachment || null);
  }, [runEngine]);

  const setFeedback = useCallback((messageId, value) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, feedback: m.feedback === value ? null : value }
          : m
      )
    );
    const msg = messagesRef.current.find((m) => m.id === messageId);
    if (msg) {
      chatApi.sendFeedback({
        value,
        messageId,
        messageText: msg.text.slice(0, 800),
        intent: ctxRef.current.lastIntent || "",
        sessionId: sessionRef.current,
      });
    }
  }, []);

  const clearChat = useCallback(() => {
    if (busyRef.current) return;
    ctxRef.current = createInitialContext(ctxRef.current.lang);
    sessionRef.current = newSessionId();
    intentsRef.current = [];
    startedAtRef.current = Date.now();
    const welcome = getWelcome(ctxRef.current.lang);
    const msgs = [
      {
        id: nextId(),
        role: "bot",
        text: welcome.text,
        quickReplies: welcome.quickReplies,
        at: new Date().toISOString(),
      },
    ];
    setMessages(msgs);
    messagesRef.current = msgs;
    persist(msgs, ctxRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }, [persist]);

  const setLanguage = useCallback(
    (l) => {
      if (busyRef.current) return;
      ctxRef.current.lang = l;
      ctxRef.current.langLocked = true;
      setLangState(l);
      /* pull the switch confirmation from the chat pack (fallback to en) */
      const pack = getWelcome(l);
      const text = pack.langSwitched || pack.greeting || "Language switched ✅";
      const msgs = [
        ...messagesRef.current,
        { id: nextId(), role: "bot", text, quickReplies: pack.quickReplies, at: new Date().toISOString() },
      ];
      setMessages(msgs);
      messagesRef.current = msgs;
      scheduleSave();
    },
    [scheduleSave]
  );

  const setVoiceOn = useCallback((on) => {
    voiceRef.current = !!on;
    try {
      localStorage.setItem("bc_voice_on", on ? "1" : "0");
    } catch (e) { /* noop */ }
    if (!on && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  const onBotDone = useCallback((cb) => {
    listenersRef.current.add(cb);
    return () => listenersRef.current.delete(cb);
  }, []);

  return {
    messages,
    isThinking,
    isTyping,
    lang,
    busy: busyRef,
    send,
    sendQuickReply,
    regenerate,
    setFeedback,
    clearChat,
    setLanguage,
    setVoiceOn,
    voiceOn: voiceRef.current,
    onBotDone,
    sessionId: sessionRef.current,
  };
}




