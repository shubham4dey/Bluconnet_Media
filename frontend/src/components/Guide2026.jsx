import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMinus, FaPlus, FaDownload, FaArrowRight } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Import the guide image
import guideImage from "../assets/img/h6.png";

const Guide2026 = () => {
  const { isDarkMode } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);

  const accordionItems = [
    {
      title: "WHAT'S CHANGING",
      content:
        "AI-driven discovery and value-focused spending are reshaping affiliate and influencer performance. Explore the consumer and market trends guiding partnership marketing in 2026.",
    },
    {
      title: "WHAT'S DRIVING GROWTH",
      content:
        "High-intent channels like influencer, search, loyalty, and incentive partners are delivering efficient, measurable revenue. See which partnership types are scaling and why.",
    },
    {
      title: "HOW BRANDS ARE ADAPTING",
      content:
        "Leading brands are connecting affiliate, influencer, and retail media into one full-funnel strategy powered by data and insights. Learn the frameworks guiding modern partnership marketing programs.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className={`py-20 md:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Glow Effects */}
      <div
        className={`absolute top-0 right-0 w-96 h-96 ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} rounded-full blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-600/10"} rounded-full blur-3xl`}
      ></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? "#d4e157" : "#10b981"} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Theme Colors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <div
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border border-[#d4e157]/30 text-[#d4e157]"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-700"
              }`}
            >
              {/* Blinking Circle */}
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span
                  className={`w-2.5 h-2.5 ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  } rounded-full`}
                ></span>
                <span
                  className={`absolute inset-0 w-2.5 h-2.5 ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  } rounded-full animate-ping opacity-75`}
                ></span>
              </div>

              <span
                className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
              >
                GUIDE
              </span>
            </div>
          </motion.div>

          <h2
            className={`font-black leading-tight mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
          >
            <span className={isDarkMode ? "text-white" : "text-gray-900"}>
              TRENDS AND STRATEGIES
            </span>
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              FOR 2026
            </span>
          </h2>

          <p
            className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-lg md:text-xl mt-4 font-semibold`}
          >
            POWERED BY PROPRIETARY INSIGHTS FROM APVISION™
          </p>
        </motion.div>

        {/* Content Grid - Image Left, Text Right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side: Report Cover with Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div
              className={`group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 ${isDarkMode ? "border-[#d4e157]/30" : "border-emerald-500/30"} cursor-pointer transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]`}
            >
              <img
                src={guideImage}
                alt="2026 Partnership Marketing Guide"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  isDarkMode
                    ? "from-[#0a0e27]/0 via-[#0a0e27]/0 to-[#0a0e27]/0 group-hover:from-[#0a0e27]/90 group-hover:via-[#0a0e27]/85 group-hover:to-[#0a0e27]/95"
                    : "from-slate-900/0 via-slate-900/0 to-slate-900/0 group-hover:from-slate-900/85 group-hover:via-slate-900/80 group-hover:to-slate-900/90"
                } transition-all duration-500`}
              ></div>

              {/* Cyan Circle Decoration */}
              <div
                className={`absolute top-1/2 right-4 md:right-8 w-24 h-24 md:w-40 md:h-40 border-2 ${isDarkMode ? "border-[#06b6d4]/50" : "border-cyan-600/50"} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-45`}
              >
                <div
                  className={`absolute inset-0 border-2 ${isDarkMode ? "border-[#06b6d4]/30" : "border-cyan-600/30"} rounded-full transform rotate-45`}
                ></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <div>
                  <p
                    className={`${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"} text-xs md:text-sm font-bold tracking-widest mb-2 uppercase drop-shadow-lg`}
                  >
                    GUIDED BY AP'S 2025 YEAR IN REVIEW
                  </p>
                  <h4
                    className={`text-lg md:text-2xl lg:text-3xl font-black leading-tight ${
                      isDarkMode
                        ? "text-white"
                        : "text-gray-900 group-hover:text-white"
                    } drop-shadow-lg transition-colors duration-500`}
                  >
                    PARTNERSHIP MARKETING'S
                    <br />
                    MOST DEFINING YEAR YET
                  </h4>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className={`w-6 h-6 md:w-8 md:h-8 ${isDarkMode ? "bg-white" : "bg-gray-100"} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#d4e157] to-[#06b6d4] rounded-full transform rotate-45"></div>
                  </div>
                  <span
                    className="font-bold text-white text-sm md:text-lg drop-shadow-lg"
                  >
                    BluConnet Media
                  </span>
                </div>
              </div>

              {/* Hover Indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
                <div
                  className={`${isDarkMode ? "bg-white/10 backdrop-blur-md border border-white/20" : "bg-slate-900/10 backdrop-blur-md border border-slate-900/20"} px-6 py-3 rounded-full`}
                >
                  <p
                    className={`${isDarkMode ? "text-white" : "text-slate-900"} font-bold text-sm md:text-base`}
                  >
                    Explore the Report
                  </p>
                </div>
              </div>
            </div>

            {/* FREE DOWNLOAD Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`absolute bottom-4 right-4 md:-bottom-6 md:-right-6 px-4 py-2 md:px-6 md:py-4 rounded-lg md:rounded-xl shadow-xl font-bold text-xs md:text-sm lg:text-base whitespace-nowrap z-20 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27]"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"
              }`}
            >
              2026 EDITION
            </motion.div>
          </motion.div>

          {/* Right Side: Description & Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Description Paragraph */}
            <p
              className={`text-base md:text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Partnership marketing is evolving as AI reshapes discovery,
              consumers become more value-focused, and brands face increasing
              pressure to prove ROI. Powered by proprietary APVision™ data and
              insights from across our global portfolio, this guide explores the
              trends, channels, and strategies driving efficient growth across
              affiliate, influencer, and commerce media.
            </p>

            {/* Accordion */}
            <div className="space-y-4 mb-10">
              {accordionItems.map((item, index) => (
                <div
                  key={index}
                  className={`border-b transition-all duration-300 ${
                    openIndex === index
                      ? isDarkMode
                        ? "border-[#d4e157]/30"
                        : "border-emerald-500/30"
                      : isDarkMode
                        ? "border-white/10"
                        : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex justify-between items-center text-left group py-4"
                  >
                    <span
                      className={`text-base md:text-lg font-bold transition-colors duration-300 ${
                        openIndex === index
                          ? isDarkMode
                            ? "text-[#d4e157]"
                            : "text-emerald-600"
                          : `${isDarkMode ? "text-white" : "text-gray-900"} ${isDarkMode ? "group-hover:text-[#06b6d4]" : "group-hover:text-cyan-600"}`
                      }`}
                    >
                      {item.title}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300 ${
                        openIndex === index
                          ? isDarkMode
                            ? "bg-gradient-to-br from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-lg shadow-[#d4e157]/30"
                            : "bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/30"
                          : `${isDarkMode ? "bg-white/5 border border-white/20 text-white group-hover:border-[#06b6d4]/50" : "bg-gray-50 border border-gray-200 text-gray-700 group-hover:border-cyan-600/50"}`
                      }`}
                    >
                      <motion.div
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {openIndex === index ? (
                          <FaMinus size={10} />
                        ) : (
                          <FaPlus size={10} />
                        )}
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pl-4 border-l-2 border-[#d4e157]/30">
                          <p
                            className={`text-base md:text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {item.content}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* ===== STYLISH PREMIUM BUTTON ===== */}
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
                GET THE 2026 REPORT
                {/* <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" /> */}
              </span>
            </motion.button>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Guide2026;