import React, { useState, useEffect } from "react";
import { FaArrowUp, FaComments, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

/**
 * Floating action stack (bottom-right):
 *   • Scroll-to-top — appears after scrolling 150px
 *   • AI Chat — always visible, 16px below scroll-to-top
 * Single source of truth for the floating buttons. No duplicates.
 */
const ScrollToTop = ({ isOpen, onToggleChat, unread }) => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 150);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed z-[9998] bottom-6 right-6 sm:bottom-6 sm:right-6 flex flex-col items-center gap-4">
      {/* Scroll-to-top (conditional) */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          type="button"
          title="Back to Top"
          aria-label="Back to top"
          className={`group w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
            shadow-lg transition-all duration-300 ease-out
            hover:scale-110 active:scale-95
            ${isDarkMode
              ? "bg-gradient-to-br from-[#9ccc3d] to-[#06b6d4] text-[#0a0e27] shadow-black/30"
              : "bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-emerald-500/25"
            }`}
        >
          <FaArrowUp className="text-base sm:text-lg transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      )}

      {/* AI Chat (always visible) */}
      <button
        onClick={onToggleChat}
        type="button"
        title={isOpen ? "Close chat" : "Chat with AI Assistant"}
        aria-label={isOpen ? "Close chat" : "Chat with AI Assistant"}
        className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
          shadow-xl transition-all duration-300 ease-out
          hover:scale-110 active:scale-95
          ${isDarkMode
            ? "bg-gradient-to-br from-[#9ccc3d] to-[#06b6d4] text-[#0a0e27] shadow-[#9ccc3d]/25"
            : "bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-emerald-500/25"
          }`}
      >
        {/* subtle ring pulse — only when closed */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping"
            style={{ animationDuration: "2.4s" }}
            aria-hidden="true"
          />
        )}

        {isOpen ? (
          <FaTimes className="text-lg sm:text-xl" />
        ) : (
          <FaComments className="text-lg sm:text-xl transition-transform duration-300 group-hover:scale-110" />
        )}

        {/* Unread badge — hidden when panel open */}
        {unread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0a0f2e]">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    </div>
  );
};

export default ScrollToTop;

