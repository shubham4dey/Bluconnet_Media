/**
 * ============================================================
 *  ChatMessage — a single message bubble with markdown,
 *  streaming caret, attachment chip, copy / like / dislike /
 *  regenerate actions and quick-reply chips.
 * ============================================================
 */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCopy,
  FaCheck,
  FaThumbsUp,
  FaThumbsDown,
  FaRedo,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
} from "react-icons/fa";
import MarkdownText from "./MarkdownText";

const timeOf = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "";
  }
};

function attachmentIcon(att = {}) {
  const name = String(att.name || "").toLowerCase();
  if ((att.type || "").startsWith("image/")) return FaFileImage;
  if (name.endsWith(".pdf")) return FaFilePdf;
  return FaFileAlt;
}

function AttachmentChip({ att, isDark }) {
  if (!att) return null;
  const Icon = attachmentIcon(att);
  return (
    <div
      className={`mt-1.5 flex items-center gap-2 px-3 py-2 rounded-xl text-xs border ${
        isDark
          ? "bg-white/10 border-white/10 text-gray-200"
          : "bg-black/5 border-black/5 text-gray-700"
      }`}
    >
      <Icon className="shrink-0" />
      <span className="truncate max-w-[170px]" title={att.name}>
        {att.name}
      </span>
      {att.sizeLabel && (
        <span className="opacity-60 shrink-0">{att.sizeLabel}</span>
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, label, active, onClick, isDark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-1 rounded-md transition-colors ${
        active
          ? "text-cyan-500"
          : isDark
          ? "text-gray-500 hover:text-cyan-300"
          : "text-gray-400 hover:text-cyan-600"
      }`}
    >
      <Icon size={12} />
    </button>
  );
}
const ChatMessage = ({
  msg,
  isDark,
  isLastBot,
  onQuickReply,
  onRegenerate,
  onFeedback,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div
          className="shrink-0 w-7 h-7 rounded-full mr-2 mt-1 flex items-center justify-center text-white text-[11px] font-bold shadow-lg bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600"
          aria-hidden="true"
        >
          AI
        </div>
      )}

      <div
        className={`max-w-[82%] ${
          isUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <div
          className={`relative px-4 py-3 text-[13.5px] leading-relaxed shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-emerald-500 to-cyan-600 text-white rounded-2xl rounded-br-md"
              : isDark
              ? "bg-white/[0.07] text-gray-100 border border-white/10 rounded-2xl rounded-bl-md"
              : "bg-white text-gray-800 border border-gray-200/80 rounded-2xl rounded-bl-md"
          }`}
        >
          {isUser ? (
            <>
              {msg.attachment && (
                <AttachmentChip att={msg.attachment} isDark={isDark} />
              )}
              {msg.text && (
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              )}
            </>
          ) : (
            <div className={msg.streaming ? "bc-caret text-left" : "text-left"}>
              <MarkdownText text={msg.text} isDark={isDark} />
            </div>
          )}
        </div>

        {/* meta row */}
        <div
          className={`flex items-center gap-1 mt-1 px-1 ${
            isUser ? "flex-row-reverse" : ""
          }`}
        >
          <span
            className={`text-[10px] ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {timeOf(msg.at)}
          </span>

          {!isUser && !msg.streaming && msg.text && (
            <>
              <ActionButton
                icon={copied ? FaCheck : FaCopy}
                label="Copy message"
                onClick={copy}
                isDark={isDark}
              />
              <ActionButton
                icon={FaThumbsUp}
                label="Good response"
                active={msg.feedback === "up"}
                onClick={() => onFeedback(msg.id, "up")}
                isDark={isDark}
              />
              <ActionButton
                icon={FaThumbsDown}
                label="Bad response"
                active={msg.feedback === "down"}
                onClick={() => onFeedback(msg.id, "down")}
                isDark={isDark}
              />
              {isLastBot && (
                <ActionButton
                  icon={FaRedo}
                  label="Regenerate response"
                  onClick={onRegenerate}
                  isDark={isDark}
                />
              )}
            </>
          )}
        </div>

        {/* quick replies under the latest bot message */}
        {isLastBot && !msg.streaming && msg.quickReplies?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-1.5 mt-2 max-w-[300px]"
          >
            {msg.quickReplies.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onQuickReply(q)}
                className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium border transition-all hover:scale-[1.04] active:scale-95 ${
                  isDark
                    ? "bg-white/5 border-white/15 text-cyan-200 hover:bg-cyan-500/15"
                    : "bg-cyan-50/80 border-cyan-200/70 text-cyan-700 hover:bg-cyan-100"
                }`}
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;

