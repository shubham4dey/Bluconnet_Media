/**
 * Chatbot — premium AI assistant panel (NO launcher).
 * The floating chat button lives in FloatingActions.jsx.
 * This component renders only the glassmorphism chat window.
 */
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSearch, FaTrash, FaChevronDown, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../LanguageSelector";
import useChat from "./useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { TypingDots, ThinkingIndicator } from "./MarkdownText";
import chatApi from "./chatApi";

const Chatbot = ({ isOpen, onClose, unread, onBotReply }) => {
  const { isDarkMode } = useTheme();
  const { lang: siteLang, t } = useLanguage();
  const {
    messages, isThinking, isTyping, lang, send, sendQuickReply,
    regenerate, setFeedback, clearChat, setLanguage, setVoiceOn, sessionId, onBotDone,
  } = useChat();

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [voiceOn, setVoiceOnState] = useState(false);

  const listRef = useRef(null);
  const stickToBottom = useRef(true);
  const sessionRef = useRef(sessionId);
  sessionRef.current = sessionId;

  /* wire up bot-reply listener for unread counter */
  useEffect(() => {
    if (!onBotReply) return;
    return onBotDone(() => {
      if (!isOpen) onBotReply();
    });
  }, [onBotDone, onBotReply, isOpen]);

  /* keep chat engine language in sync with site language (all 6 supported) */
  useEffect(() => {
    const SUPPORTED = new Set(["en", "de", "fr", "it", "pt", "es"]);
    const engineLang = SUPPORTED.has(siteLang) ? siteLang : "en";
    if (engineLang !== lang) setLanguage(engineLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteLang]);

  /* Esc closes the panel */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  /* live-visitor heartbeat */
  useEffect(() => {
    const beat = () => {
      chatApi.heartbeat({
        sessionId: sessionRef.current,
        page: window.location.pathname,
        referrer: String(document.referrer || "").slice(0, 180),
        device: /Mobi|Android/i.test(navigator.userAgent || "") ? "mobile" : "desktop",
      });
    };
    beat();
    const iv = setInterval(beat, 45000);
    return () => clearInterval(iv);
  }, []);

  /* auto-scroll (respects manual scroll-up) */
  useEffect(() => {
    const el = listRef.current;
    if (!el || !stickToBottom.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking, isTyping, searchOpen]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
  };

  const toggleVoice = () => { const n = !voiceOn; setVoiceOnState(n); setVoiceOn(n); };
  const toggleSearch = () => { setSearchOpen((s) => !s); setSearch(""); };

  const q = search.trim().toLowerCase();
  const visible = searchOpen && q
    ? messages.filter((m) => String(m.text).toLowerCase().includes(q))
    : messages;
  const lastBotId = searchOpen ? null : [...messages].reverse().find((m) => m.role === "bot")?.id;

  const headerBtn = "w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white/90 hover:bg-white/20 hover:text-white transition-colors";

  if (!isOpen) return null;

  return (
    <motion.div
      role="dialog"
      aria-label="AI Assistant chat"
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 28, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed z-[9999] flex flex-col overflow-hidden border shadow-2xl
        left-4 right-6 bottom-6 top-20 rounded-3xl
        sm:inset-auto sm:right-6 sm:bottom-24 sm:top-auto sm:w-[400px] sm:h-[min(640px,calc(100vh-7.5rem))]
        ${isDarkMode ? "bg-[#0a0f2e]/90 backdrop-blur-2xl border-white/10" : "bg-white/85 backdrop-blur-2xl border-white/60"}`}
    >
      {/* header */}
      <div className="shrink-0 px-4 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 dark:from-[#9ccc3d] dark:via-[#22d3ee] dark:to-[#06b6d4]">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 shrink-0 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-lg">
            🤖
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white/70" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[14.5px] leading-tight text-white">BluConnet AI</p>
            <p className="text-[11px] text-white/85 truncate">
              {isTyping || isThinking ? "Typing..." : "Online" + " · 24/7"}
            </p>
          </div>
          <button type="button" onClick={toggleVoice} className={headerBtn}
            aria-label={voiceOn ? "Mute voice replies" : "Enable voice replies"}
            title={voiceOn ? "Voice replies on" : "Voice replies off"}>
            {voiceOn ? <FaVolumeUp size={14} /> : <FaVolumeMute size={14} />}
          </button>
          <LanguageSelector variant="chat" />
          <button type="button" onClick={toggleSearch} className={headerBtn} aria-label="Search conversation">
            <FaSearch size={13} />
          </button>
          <button type="button" onClick={clearChat} className={headerBtn} aria-label="Clear chat" title="Clear conversation">
            <FaTrash size={13} />
          </button>
          <button type="button" onClick={onClose} className={headerBtn} aria-label="Minimize chat">
            <FaChevronDown size={14} />
          </button>
          <button type="button" onClick={onClose} className={`${headerBtn} sm:hidden`} aria-label="Close chat">
            <FaTimes size={14} />
          </button>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={"Search" + "…"} aria-label="Search in conversation"
                className="mt-2 w-full px-3 py-2 rounded-xl bg-white/15 placeholder-white/60 text-white text-[12.5px] outline-none focus:bg-white/25 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* messages */}
      <div ref={listRef} onScroll={handleScroll}
        className="flex-1 overflow-y-auto bc-chat-scroll px-4 py-4 space-y-4" aria-live="polite">
        {visible.length === 0 && (
          <p className={`text-center text-[12.5px] mt-8 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            Search 🔍
          </p>
        )}
        {visible.map((m) => (
          <ChatMessage key={m.id} msg={m} isDark={isDarkMode}
            isLastBot={m.id === lastBotId}
            onQuickReply={sendQuickReply} onRegenerate={regenerate} onFeedback={setFeedback} />
        ))}
        {(isThinking || isTyping) && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600" aria-hidden="true">AI</div>
            <div className={`px-4 py-2.5 rounded-2xl rounded-bl-md ${isDarkMode ? "bg-white/[0.07] border border-white/10" : "bg-white border-gray-200/80"}`}>
              {isThinking ? <ThinkingIndicator label="Thinking" /> : <TypingDots isDark={isDarkMode} />}
            </div>
          </div>
        )}
      </div>

      {/* composer */}
      <div className={`shrink-0 border-t ${isDarkMode ? "border-white/10" : "border-gray-200/70"}`}>
        <ChatInput onSend={send} busy={isThinking || isTyping} isDark={isDarkMode} lang={lang} />
      </div>
    </motion.div>
  );
};

export default Chatbot;
