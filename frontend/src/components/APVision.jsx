import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaChartLine,
  FaRobot,
  FaRocket,
  FaLink,
  FaLaptopCode,
  FaEye,
  FaHandshake,
  FaGlobe,
  FaBullseye,
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

// Existing image
import apvisionDashboard from "../assets/img/h4.png";

const APVision = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [openIndex, setOpenIndex] = useState(0);

  const goToPortfolio = () => {
    navigate("/portfolio");
  };

  // =========================================================
  // VISION & MISSION CONTENT
  // =========================================================

  const accordionItems = [
    {
      title: "OUR VISION",
      content:
        "To make digital growth more measurable, transparent, and accessible — enabling businesses, brands, publishers, and audiences to achieve more through smarter connections and innovative technology.",
      icon: FaEye,
      dayColor: "from-emerald-500 to-cyan-600",
      nightColor: "from-[#d4e157] to-[#06b6d4]",
    },

    {
      title: "OUR MISSION",
      content:
        "To connect brands, publishers, and digital audiences through data-driven solutions, performance-focused strategies, and innovative technology while creating sustainable, long-term value for every partner.",
      icon: FaRocket,
      dayColor: "from-cyan-600 to-blue-600",
      nightColor: "from-[#06b6d4] to-[#3b82f6]",
    },

    {
      title: "OUR VALUES",
      content:
        "We believe in transparency, innovation, accountability, collaboration, and measurable results. Every relationship we build is designed around trust and long-term growth.",
      icon: FaHandshake,
      dayColor: "from-emerald-500 to-amber-500",
      nightColor: "from-[#d4e157] to-[#f59e0b]",
    },

    {
      title: "OUR APPROACH",
      content:
        "We combine technology, data, creativity, and performance marketing to build smarter digital solutions that adapt to changing markets and help our partners scale what works.",
      icon: FaChartLine,
      dayColor: "from-cyan-600 to-emerald-500",
      nightColor: "from-[#06b6d4] to-[#d4e157]",
    },

    {
      title: "OUR IMPACT",
      content:
        "Our goal is to create meaningful and measurable impact by helping businesses reach the right audiences, build stronger partnerships, improve performance, and unlock sustainable digital growth.",
      icon: FaGlobe,
      dayColor: "from-cyan-600 to-blue-600",
      nightColor: "from-[#06b6d4] to-[#3b82f6]",
    },
  ];

  return (
    <section
      onClick={goToPortfolio}
      className={`relative overflow-hidden transition-colors duration-500 cursor-pointer ${
        isDarkMode ? "bg-[#050508]" : "bg-[#f8fffd]"
      }`}
    >
      {/* =========================================================
          BACKGROUND EFFECTS
      ========================================================= */}

      <div
        className={`absolute -top-32 -left-32 w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl ${
          isDarkMode
            ? "bg-[#d4e157]/10"
            : "bg-emerald-400/10"
        }`}
      />

      <div
        className={`absolute top-1/3 -right-40 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full blur-3xl ${
          isDarkMode
            ? "bg-[#06b6d4]/10"
            : "bg-cyan-400/10"
        }`}
      />

      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode ? "#d4e157" : "#10b981"
          } 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top-right decorative dots */}
      <div className="absolute top-10 right-10 md:right-20 opacity-20 pointer-events-none">
        <div className="grid grid-cols-6 gap-3">
          {[...Array(36)].map((_, index) => (
            <span
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${
                isDarkMode
                  ? "bg-[#06b6d4]"
                  : "bg-cyan-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom-left decorative dots */}
      <div className="absolute bottom-20 left-8 md:left-12 opacity-15 pointer-events-none">
        <div className="grid grid-cols-5 gap-3">
          {[...Array(25)].map((_, index) => (
            <span
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${
                isDarkMode
                  ? "bg-[#d4e157]"
                  : "bg-emerald-400"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-10 xl:px-12 py-16 md:py-20 lg:py-24">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-12"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-5"
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold tracking-[0.15em] uppercase ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border-[#d4e157]/30 text-[#d4e157]"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              <span className="relative flex w-2.5 h-2.5">
                <span
                  className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                    isDarkMode
                      ? "bg-[#d4e157]"
                      : "bg-emerald-500"
                  }`}
                />

                <span
                  className={`relative w-2.5 h-2.5 rounded-full ${
                    isDarkMode
                      ? "bg-[#d4e157]"
                      : "bg-emerald-500"
                  }`}
                />
              </span>

              OUR VISION & MISSION
            </div>
          </motion.div>

          {/* Main Heading */}
          <h2
            className={`font-black leading-[0.95] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] ${
              isDarkMode ? "text-white" : "text-[#07172f]"
            }`}
          >
            <span className="block">
              A BIGGER TOMORROW
            </span>

            <span
              className={`block text-transparent bg-clip-text bg-gradient-to-r ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4]"
                  : "from-emerald-500 to-cyan-600"
              }`}
            >
              BUILT TOGETHER
            </span>
          </h2>

          {/* Small tagline */}
          <div
            className={`mt-5 text-xs md:text-sm font-semibold tracking-[0.3em] uppercase ${
              isDarkMode
                ? "text-gray-500"
                : "text-slate-400"
            }`}
          >
            PEOPLE × TECHNOLOGY × OPPORTUNITY × IMPACT
          </div>

          {/* Description */}
          <p
            className={`mt-6 max-w-4xl text-sm md:text-base lg:text-[15px] leading-7 ${
              isDarkMode
                ? "text-gray-400"
                : "text-slate-600"
            }`}
          >
            At BluConnet Media, our vision is to make digital growth more
            measurable, transparent, and accessible for every partner. Our
            mission is to connect brands, publishers, and audiences through
            innovative technology, data-driven solutions, and long-term
            collaboration — creating sustainable value across the digital
            ecosystem.
          </p>
        </motion.div>

        {/* =========================================================
            MAIN TWO COLUMN AREA
        ========================================================= */}

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 xl:gap-20 items-start">
          {/* =======================================================
              LEFT SIDE - ACCORDION
          ======================================================= */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className={`border-t ${
                isDarkMode
                  ? "border-white/10"
                  : "border-slate-200"
              }`}
            >
              {accordionItems.map((item, index) => {
                const activeColor = isDarkMode
                  ? item.nightColor
                  : item.dayColor;

                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={`border-b transition-all duration-500 ${
                      isDarkMode
                        ? "border-white/10"
                        : "border-slate-200"
                    }`}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenIndex(isOpen ? -1 : index);
                      }}
                      className="w-full flex items-center justify-between gap-4 py-4 md:py-5 text-left group"
                    >
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        {/* Number */}
                        <div
                          className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${activeColor} flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-sm transition-transform duration-300 ${
                            isOpen
                              ? "scale-110"
                              : "scale-100"
                          }`}
                        >
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        {/* Title */}
                        <span
                          className={`font-bold text-sm sm:text-base md:text-lg lg:text-base xl:text-lg transition-colors duration-300 ${
                            isOpen
                              ? isDarkMode
                                ? "text-[#d4e157]"
                                : "text-emerald-600"
                              : isDarkMode
                              ? "text-white"
                              : "text-[#0d1b32]"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      {/* Plus / Minus */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? `bg-gradient-to-br ${activeColor} text-white shadow-lg`
                            : isDarkMode
                            ? "bg-white/5 border border-white/10 text-white"
                            : "bg-slate-50 border border-slate-200 text-slate-600"
                        }`}
                      >
                        <motion.div
                          animate={{
                            rotate: isOpen ? 180 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                          }}
                        >
                          {isOpen ? (
                            <FaMinus size={10} />
                          ) : (
                            <FaPlus size={10} />
                          )}
                        </motion.div>
                      </div>
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.4,
                            ease: "easeInOut",
                          }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pl-12 md:pl-14 pr-4 relative">
                            {/* Accent line */}
                            <div
                              className={`absolute left-5 md:left-6 top-0 bottom-5 w-0.5 bg-gradient-to-b ${activeColor} opacity-50`}
                            />

                            {/* Icon */}
                            <div
                              className={`inline-flex w-10 h-10 rounded-xl bg-gradient-to-br ${activeColor} items-center justify-center mb-3 shadow-md`}
                            >
                              <item.icon className="w-4 h-4 text-white" />
                            </div>

                            <p
                              className={`text-sm md:text-[15px] leading-7 ${
                                isDarkMode
                                  ? "text-gray-400"
                                  : "text-slate-600"
                              }`}
                            >
                              {item.content}
                            </p>

                            {/* See More → Our Portfolio */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                goToPortfolio();
                              }}
                              className={`mt-4 inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 group/see-more ${
                                isDarkMode
                                  ? "text-[#d4e157] hover:text-[#06b6d4]"
                                  : "text-emerald-600 hover:text-cyan-600"
                              }`}
                            >
                              <span>See More</span>
                              <FaArrowRight className="text-[10px] group-hover/see-more:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* =====================================================
                BOTTOM STATS
            ===================================================== */}

            <div className="mt-8 md:mt-10 grid grid-cols-3 gap-3 md:gap-5">
              {/* Stat 1 */}
              <div className="flex items-center gap-2 md:gap-3">
                <div
                  className={`flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center ${
                    isDarkMode
                      ? "bg-[#d4e157]/10 text-[#d4e157]"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  <FaBullseye className="text-sm md:text-lg" />
                </div>

                <div>
                  <div
                    className={`text-lg md:text-2xl font-black ${
                      isDarkMode
                        ? "text-[#d4e157]"
                        : "text-emerald-600"
                    }`}
                  >
                    1000+
                  </div>

                  <div
                    className={`text-[9px] md:text-xs ${
                      isDarkMode
                        ? "text-gray-500"
                        : "text-slate-500"
                    }`}
                  >
                    Brands Empowered
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-2 md:gap-3 border-x border-slate-200 dark:border-white/10 px-3 md:px-5">
                <div
                  className={`flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center ${
                    isDarkMode
                      ? "bg-[#06b6d4]/10 text-[#06b6d4]"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  <FaGlobe className="text-sm md:text-lg" />
                </div>

                <div>
                  <div
                    className={`text-lg md:text-2xl font-black ${
                      isDarkMode
                        ? "text-[#06b6d4]"
                        : "text-cyan-600"
                    }`}
                  >
                    150+
                  </div>

                  <div
                    className={`text-[9px] md:text-xs ${
                      isDarkMode
                        ? "text-gray-500"
                        : "text-slate-500"
                    }`}
                  >
                    Countries Reached
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-2 md:gap-3">
                <div
                  className={`flex-shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center ${
                    isDarkMode
                      ? "bg-[#d4e157]/10 text-[#d4e157]"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  <FaChartLine className="text-sm md:text-lg" />
                </div>

                <div>
                  <div
                    className={`text-lg md:text-2xl font-black ${
                      isDarkMode
                        ? "text-[#d4e157]"
                        : "text-emerald-600"
                    }`}
                  >
                    10M+
                  </div>

                  <div
                    className={`text-[9px] md:text-xs ${
                      isDarkMode
                        ? "text-gray-500"
                        : "text-slate-500"
                    }`}
                  >
                    Opportunities Created
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* =======================================================
              RIGHT SIDE - IMAGE
          ======================================================= */}

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow */}
            <div
              className={`absolute -inset-5 rounded-[30px] blur-2xl opacity-40 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]"
                  : "bg-gradient-to-r from-emerald-300 to-cyan-300"
              }`}
            />

            {/* Main Image Card */}
            <div
              className={`relative rounded-2xl md:rounded-3xl p-2.5 md:p-3 shadow-2xl border ${
                isDarkMode
                  ? "bg-[#0f1535] border-[#d4e157]/20"
                  : "bg-white border-emerald-200"
              }`}
            >
              {/* Browser Top Bar */}
              <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />

                <div
                  className={`flex-1 mx-3 md:mx-5 h-5 md:h-6 rounded-md flex items-center justify-center text-[8px] md:text-[9px] font-mono ${
                    isDarkMode
                      ? "bg-white/5 text-gray-500"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  BluConnet Media
                </div>
              </div>

              {/* Image */}
              <div
                className={`relative overflow-hidden rounded-xl aspect-[16/10] ${
                  isDarkMode
                    ? "bg-[#1a1f3a]"
                    : "bg-slate-50"
                }`}
              >
                <img
                  src={apvisionDashboard}
                  alt="BluConnet Media digital growth"
                  className="w-full h-full object-cover"
                />

                {/* Soft image overlay */}
                <div
                  className={`absolute inset-0 pointer-events-none ${
                    isDarkMode
                      ? "bg-gradient-to-t from-[#050508]/20 via-transparent to-transparent"
                      : "bg-gradient-to-t from-white/10 via-transparent to-transparent"
                  }`}
                />
              </div>

              {/* Right Side Keywords */}
              <div className="absolute top-[27%] right-[7%] z-20 hidden md:block">
                <div
                  className={`text-[10px] md:text-xs font-bold leading-7 tracking-wider text-right ${
                    isDarkMode
                      ? "text-white"
                      : "text-white"
                  }`}
                >
                  IDEAS
                  <br />
                  PEOPLE
                  <br />
                  PARTNERSHIPS
                  <br />
                  GROWTH
                  <br />
                  A BRIGHTER
                  <br />
                  TOMORROW
                </div>
              </div>

              {/* Image Bottom Stats */}
              <div className="mt-2.5 md:mt-3 grid grid-cols-3 gap-2">
                <div
                  className={`rounded-lg p-2 md:p-3 text-center ${
                    isDarkMode
                      ? "bg-white/5"
                      : "bg-slate-50"
                  }`}
                >
                  <div
                    className={`text-[8px] md:text-[10px] ${
                      isDarkMode
                        ? "text-gray-500"
                        : "text-slate-500"
                    }`}
                  >
                    Active Users
                  </div>

                  <div
                    className={`text-sm md:text-base font-bold ${
                      isDarkMode
                        ? "text-[#d4e157]"
                        : "text-emerald-600"
                    }`}
                  >
                    2.4K
                  </div>
                </div>

                <div
                  className={`rounded-lg p-2 md:p-3 text-center ${
                    isDarkMode
                      ? "bg-white/5"
                      : "bg-slate-50"
                  }`}
                >
                  <div
                    className={`text-[8px] md:text-[10px] ${
                      isDarkMode
                        ? "text-gray-500"
                        : "text-slate-500"
                    }`}
                  >
                    Reports
                  </div>

                  <div
                    className={`text-sm md:text-base font-bold ${
                      isDarkMode
                        ? "text-[#06b6d4]"
                        : "text-cyan-600"
                    }`}
                  >
                    180+
                  </div>
                </div>

                <div
                  className={`rounded-lg p-2 md:p-3 text-center ${
                    isDarkMode
                      ? "bg-white/5"
                      : "bg-slate-50"
                  }`}
                >
                  <div
                    className={`text-[8px] md:text-[10px] ${
                      isDarkMode
                        ? "text-gray-500"
                        : "text-slate-500"
                    }`}
                  >
                    Insights
                  </div>

                  <div
                    className={`text-sm md:text-base font-bold ${
                      isDarkMode
                        ? "text-[#d4e157]"
                        : "text-emerald-600"
                    }`}
                  >
                    Real-time
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                VISION + MISSION MINI CARDS
            ================================================= */}

            <div
              className={`relative mt-4 md:mt-5 rounded-2xl p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                isDarkMode
                  ? "bg-[#0f1535] border border-white/10"
                  : "bg-white border border-slate-100 shadow-xl"
              }`}
            >
              {/* Vision */}
              <div className="flex gap-3">
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? "bg-[#d4e157]/10 text-[#d4e157]"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  <FaEye />
                </div>

                <div>
                  <h4
                    className={`font-bold text-sm md:text-base mb-1 ${
                      isDarkMode
                        ? "text-white"
                        : "text-[#0d1b32]"
                    }`}
                  >
                    Our Vision
                  </h4>

                  <p
                    className={`text-xs md:text-sm leading-5 ${
                      isDarkMode
                        ? "text-gray-400"
                        : "text-slate-500"
                    }`}
                  >
                    A connected digital world where every opportunity creates
                    meaningful growth.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block absolute top-5 bottom-5 left-1/2 w-px bg-slate-200 dark:bg-white/10" />

              {/* Mission */}
              <div className="flex gap-3 sm:pl-5">
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? "bg-[#06b6d4]/10 text-[#06b6d4]"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  <FaRocket />
                </div>

                <div>
                  <h4
                    className={`font-bold text-sm md:text-base mb-1 ${
                      isDarkMode
                        ? "text-white"
                        : "text-[#0d1b32]"
                    }`}
                  >
                    Our Mission
                  </h4>

                  <p
                    className={`text-xs md:text-sm leading-5 ${
                      isDarkMode
                        ? "text-gray-400"
                        : "text-slate-500"
                    }`}
                  >
                    To empower businesses through technology, partnerships, and
                    performance-driven solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                CTA
            ================================================= */}

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                goToPortfolio();
              }}
              whileHover={{
                scale: 1.02,
                y: -2,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className={`relative overflow-hidden group mt-4 md:mt-5 w-full px-6 py-4 rounded-xl font-black text-sm md:text-base uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#07172f] shadow-[0_10px_35px_rgba(212,225,87,0.25)]"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_10px_35px_rgba(16,185,129,0.25)]"
              }`}
            >
              {/* Shine */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              <span className="relative z-10 flex items-center gap-3">
                EXPLORE OUR PORTFOLIO
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.button>

            {/* Bottom Quote */}
            <div className="flex items-center gap-4 mt-6">
              <div
                className={`hidden sm:block h-px flex-1 ${
                  isDarkMode
                    ? "bg-[#06b6d4]/40"
                    : "bg-emerald-300"
                }`}
              />

              <p
                className={`text-center text-xs md:text-sm italic whitespace-nowrap ${
                  isDarkMode
                    ? "text-[#06b6d4]"
                    : "text-emerald-600"
                }`}
              >
                “Connecting Today, Creating a Brighter Tomorrow”
              </p>

              <div
                className={`hidden sm:block h-px flex-1 ${
                  isDarkMode
                    ? "bg-[#06b6d4]/40"
                    : "bg-emerald-300"
                }`}
              />
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default APVision;