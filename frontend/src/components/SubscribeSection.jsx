import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaEnvelope } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const SubscribeSection = () => {
  const { isDarkMode } = useTheme();

  return (
    <section
      className={`py-16 md:py-24 lg:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Glow Effects (Matching Who We Are) */}
      <div
        className={`absolute top-1/4 left-0 w-96 h-96 ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-300/20"} rounded-full blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-1/4 right-0 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-300/20"} rounded-full blur-3xl`}
      ></div>

      {/* Subtle Grid Pattern (Matching Who We Are) */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? "#d4e157" : "#10b981"} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Background Geometric Shapes */}
      <div
        className={`absolute top-20 right-20 w-32 h-32 md:w-48 md:h-48 ${isDarkMode ? "opacity-10" : "opacity-20"} pointer-events-none`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"}`}
        >
          <path
            d="M20 30 L50 10 L80 30 L80 70 L50 90 L20 70 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M20 30 L50 50 L80 30 M50 50 L50 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div
        className={`absolute bottom-20 left-16 w-24 h-24 md:w-40 md:h-40 ${isDarkMode ? "opacity-10" : "opacity-20"} pointer-events-none rotate-12`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-500"}`}
        >
          <path
            d="M20 30 L50 10 L80 30 L80 70 L50 90 L20 70 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M20 30 L50 50 L80 30 M50 50 L50 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative ${isDarkMode ? "bg-white/5" : "bg-white/80"} backdrop-blur-2xl border-2 ${isDarkMode ? "border-white/10" : "border-gray-200"} rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl overflow-hidden`}
        >
          {/* Card Glow Effects */}
          <div
            className={`absolute -top-20 -right-20 w-60 h-60 ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-400/20"} rounded-full blur-3xl`}
          ></div>
          <div
            className={`absolute -bottom-20 -left-20 w-60 h-60 ${isDarkMode ? "bg-[#06b6d4]/20" : "bg-cyan-400/20"} rounded-full blur-3xl`}
          ></div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
            {/* Left Side: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {/* Badge - Exact match with Who We Are */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 text-start"
              >
                <span
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
                    isDarkMode
                      ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30"
                      : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
                  }`}
                >
                  <div className="relative flex items-center justify-center w-2.5 h-2.5">
                    <span
                      className={`w-2.5 h-2.5 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full`}
                    ></span>
                    <span
                      className={`absolute inset-0 w-2.5 h-2.5 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full animate-ping opacity-75`}
                    ></span>
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                  >
                    Subscribe For Updates
                  </span>
                </span>
              </motion.div>

              {/* Heading */}
              <h2
                className={`font-black leading-tight text-start mb-6 ${isDarkMode ? "text-white" : "text-gray-900"} text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
              >
                <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                  Helping Brands Unlock Growth Through{" "}
                </span>
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
                >
                  Partnerships
                </span>
              </h2>

              {/* Decorative Line */}
              <div
                className={`mt-6 h-1 w-24 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} rounded-full`}
              ></div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Email Input */}
              <div>
                <label
                  className={`block ${isDarkMode ? "text-white" : "text-gray-900"} text-start font-bold mb-3 text-sm md:text-base`}
                >
                  Business Email Address:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"}`}
                  >
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full pl-12 pr-4 py-4 ${isDarkMode ? "bg-white/5 border-white/10 text-white placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"} border-2 rounded-xl focus:outline-none focus:border-${isDarkMode ? "[#d4e157]" : "emerald-500"} transition-all duration-300`}
                  />
                </div>
              </div>

              {/* Privacy Checkbox */}
              <label
                className={`flex items-start gap-3 text-sm text-start ${isDarkMode ? "text-gray-400" : "text-gray-600"} cursor-pointer group`}
              >
                <input
                  type="checkbox"
                  className={`mt-1 w-5 h-5 rounded border-2 ${isDarkMode ? "border-white/10 bg-white/5" : "border-gray-300 bg-white"} ${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"} cursor-pointer`}
                />
                <span
                  className={`leading-relaxed ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } transition-colors`}
                >
                  <span className="text-red-500">*</span> I agree to receive
                  news and other promotional materials from BluConnet Media. For
                  more information, please view our{" "}
                  <Link
                    to="/privacy-policy"
                    className={`${isDarkMode ? "text-[#d4e157] hover:text-[#06b6d4]" : "text-emerald-500 hover:text-cyan-600"} transition-colors underline`}
                  >
                    privacy policy
                  </Link>
                  .
                </span>
              </label>

              {/* ===== PREMIUM STYLISH SUBMIT BUTTON ===== */}
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden group w-full md:w-auto px-8 py-4 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                }`}
              >
                {/* Animated Shine/Sweep Effect on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                <span className="relative z-20 flex items-center gap-3">
                  Let's Connect
                  <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SubscribeSection;
