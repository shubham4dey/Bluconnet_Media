/**
 * ============================================================
 *  ChatInput — message composer with:
 *   - auto-growing textarea (Enter = send, Shift+Enter = newline)
 *   - emoji picker
 *   - voice input (Web Speech API, en-IN / hi-IN)
 *   - file / image / PDF upload (≤5 MB) with upload to backend
 * ============================================================
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaMicrophone,
  FaPaperclip,
  FaRegSmile,
  FaTimes,
} from "react-icons/fa";
import { EmojiPicker } from "./MarkdownText";
import { useLanguage, speechLocale } from "../../context/LanguageContext";
import chatApi from "./chatApi";

const MAX_FILE_MB = 5;
const ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.webp,.gif,.doc,.docx,.txt,.xls,.xlsx,.csv";

function sizeLabel(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ChatInput = ({ onSend, busy, isDark, lang }) => {
  const { t, lang: siteLang } = useLanguage();
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [listening, setListening] = useState(false);
  const [hint, setHint] = useState("");
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const recogRef = useRef(null);
  const hintTimer = useRef(null);

  const showHint = useCallback((text) => {
    setHint(text);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(""), 3200);
  }, []);

  /* auto-resize textarea */
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [value]);

  useEffect(
    () => () => {
      try {
        recogRef.current?.stop?.();
      } catch (e) {
        /* noop */
      }
      clearTimeout(hintTimer.current);
    },
    []
  );

  const stopListening = useCallback(() => {
    try {
      recogRef.current?.stop?.();
    } catch (e) {
      /* noop */
    }
    setListening(false);
  }, []);

  const doSend = () => {
    const text = value.trim();
    if ((!text && !attachment) || busy) return;
    onSend(text, attachment);
    setValue("");
    setAttachment(null);
    setShowEmoji(false);
    stopListening();
  };

  const toggleMic = () => {
    if (listening) return stopListening();
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) {
      showHint("Voice input isn't supported in this browser 🎙️");
      return;
    }
    const recog = new SR();
    recog.lang = speechLocale(siteLang);
    recog.interimResults = true;
    recog.maxAlternatives = 1;
    recog.continuous = false;
    const base = value;
    recog.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setValue(`${base} ${transcript}`.trim().slice(0, 1000));
    };
    recog.onend = () => setListening(false);
    recog.onerror = () => {
      setListening(false);
      showHint("Couldn't hear you — try again 🎙️");
    };
    recogRef.current = recog;
    try {
      recog.start();
      setListening(true);
      showHint("🎙️ Listening… tap the mic again to stop");
    } catch (e) {
      setListening(false);
    }
  };

  const onPickFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      showHint(`File too large — max ${MAX_FILE_MB} MB`);
      return;
    }
    const att = {
      name: file.name.slice(0, 80),
      size: file.size,
      sizeLabel: sizeLabel(file.size),
      type: file.type,
      file,
    };
    setAttachment(att);
    chatApi.uploadFile(file); // fire-and-forget (queued backend copy)
    showHint(`📎 ${file.name} attached`);
  };

  const shell = isDark
    ? "bg-white/[0.06] border-white/10"
    : "bg-white border-gray-200";
  const iconBtn = `w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
    isDark
      ? "text-gray-400 hover:text-cyan-300 hover:bg-white/10"
      : "text-gray-500 hover:text-cyan-600 hover:bg-cyan-50"
  }`;

  return (
    <div className="px-3 pb-3 pt-1">
      {/* attachment chip */}
      {attachment && (
        <div
          className={`mb-2 flex items-center gap-2 text-[11.5px] px-3 py-1.5 rounded-xl border ${
            isDark
              ? "bg-white/5 border-white/10 text-gray-300"
              : "bg-gray-50 border-gray-200 text-gray-600"
          }`}
        >
          <span>📎</span>
          <span className="truncate max-w-[220px]">{attachment.name}</span>
          <span className="opacity-60">{attachment.sizeLabel}</span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="ml-auto opacity-60 hover:opacity-100"
            aria-label="Remove attachment"
          >
            <FaTimes size={11} />
          </button>
        </div>
      )}

      {hint && (
        <p
          className={`mb-1.5 px-1 text-[11px] animate-pulse ${
            isDark ? "text-cyan-300/80" : "text-cyan-600/80"
          }`}
          role="status"
        >
          {hint}
        </p>
      )}

      <div
        className={`flex items-end gap-1 rounded-2xl border px-2 py-1.5 backdrop-blur ${shell}`}
      >
        {/* emoji */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmoji((s) => !s)}
            className={iconBtn}
            aria-label="Insert emoji"
            aria-expanded={showEmoji}
          >
            <FaRegSmile size={17} />
          </button>
          {showEmoji && (
            <EmojiPicker
              isDark={isDark}
              onPick={(e) => {
                setValue((v) => (v + e).slice(0, 1000));
                taRef.current?.focus();
              }}
            />
          )}
        </div>

        {/* attach */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={iconBtn}
          aria-label="Attach file"
        >
          <FaPaperclip size={16} />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={onPickFile}
        />

        {/* textarea */}
        <textarea
          ref={taRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 1000))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              doSend();
            }
          }}
          placeholder={listening ? "Listening… 🎙️" : "Type your message…"}
          aria-label="Type your message…"
          className={`flex-1 resize-none bg-transparent outline-none text-[13.5px] leading-snug py-2 max-h-[120px] ${
            isDark ? "text-gray-100 placeholder-gray-500" : "text-gray-800 placeholder-gray-400"
          }`}
        />

        {/* mic */}
        <button
          type="button"
          onClick={toggleMic}
          className={`${iconBtn} relative`}
          aria-label={listening ? "Stop voice input" : "Start voice input"}
          aria-pressed={listening}
        >
          {listening && (
            <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
          )}
          <FaMicrophone
            size={16}
            className={listening ? "text-red-500 relative" : "relative"}
          />
        </button>

        {/* send */}
        <button
          type="button"
          onClick={doSend}
          disabled={busy || (!value.trim() && !attachment)}
          className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full text-white shadow-lg bg-gradient-to-br from-emerald-500 to-cyan-600 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-90"
          aria-label="Send"
        >
          <FaPaperPlane size={14} />
        </button>
      </div>

      <p
        className={`mt-1.5 text-center text-[10px] ${
          isDark ? "text-gray-600" : "text-gray-400"
        }`}
      >
        Powered by <span className="font-semibold">BluConnet AI</span> · Enter
        to send · Shift+Enter for a new line
      </p>
    </div>
  );
};

export default ChatInput;

