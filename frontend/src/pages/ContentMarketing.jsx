import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  FaArrowRight,
  FaCheck,
  FaUsers,
  FaChartLine,
  FaClock,
  FaChevronRight,
  FaPlay,
  FaAt,
  FaMobileAlt,
  FaRocket,
  FaSearch,
  FaChartBar,
  FaPenNib,
  FaBookOpen,
  FaGlobe,
  FaShareAlt,
  FaEye,
  FaFileAlt,
  FaBullhorn,
  FaLightbulb,
  FaVideo,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ContentMarketing = () => {
  const { isDarkMode } = useTheme();
  const { scrollYProgress } = useScroll();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, -70]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
  });

  const springY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set((x - rect.width / 2) / 35);
    mouseY.set((y - rect.height / 2) / 35);
  };

  const theme = {
    bg: isDarkMode ? "bg-[#050508]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-950",
    muted: isDarkMode ? "text-gray-400" : "text-gray-600",
    subtle: isDarkMode ? "text-gray-500" : "text-gray-500",
    border: isDarkMode ? "border-white/10" : "border-gray-200",
    card: isDarkMode ? "bg-[#0b0d18]/90" : "bg-white",
    softCard: isDarkMode ? "bg-white/[0.035]" : "bg-white",
    gradientText: isDarkMode
      ? "from-[#d4e157] via-[#a5d83d] to-[#06b6d4]"
      : "from-emerald-500 via-teal-500 to-cyan-600",
    gradientBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",
    accent: isDarkMode ? "text-[#d4e157]" : "text-emerald-600",
    accentBg: isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-50",
    accentBorder: isDarkMode ? "border-[#d4e157]/20" : "border-emerald-200",
    inner: isDarkMode ? "bg-white/[0.035]" : "bg-gray-50",
    glowOne: isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-400/[0.08]",
    glowTwo: isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-400/[0.08]",
  };

  /* =========================================================
     SERVICES
  ========================================================= */

  const services = [
    {
      icon: FaPenNib,
      number: "01",
      title: "Content Strategy",
      desc: "Build a clear content strategy around your audience, business goals and search opportunities to create content that drives meaningful growth.",
    },
    {
      icon: FaBookOpen,
      number: "02",
      title: "High-Value Content",
      desc: "Create valuable blogs, guides, resources and educational content that establish authority and give your audience a reason to keep coming back.",
    },
    {
      icon: FaGlobe,
      number: "03",
      title: "SEO Content",
      desc: "Develop search-focused content designed to improve visibility, attract organic traffic and help your brand get discovered by the right audience.",
    },
    {
      icon: FaShareAlt,
      number: "04",
      title: "Content Distribution",
      desc: "Extend the reach of every piece of content across social channels, email, communities and other relevant distribution platforms.",
    },
  ];

  /* =========================================================
     CONTENT JOURNEY
  ========================================================= */

  const journey = [
    {
      icon: FaUsers,
      title: "Discover",
      desc: "Reach the right audience with useful content.",
    },
    {
      icon: FaEye,
      title: "Engage",
      desc: "Capture attention with relevant stories.",
    },
    {
      icon: FaBookOpen,
      title: "Educate",
      desc: "Build trust through valuable information.",
    },
    {
      icon: FaBullhorn,
      title: "Amplify",
      desc: "Distribute content across key channels.",
    },
    {
      icon: FaUsers,
      title: "Convert",
      desc: "Turn engaged audiences into customers.",
    },
  ];

  /* =========================================================
     STATS
  ========================================================= */

  const stats = [
    {
      value: "68%",
      label: "Organic Traffic Growth",
      icon: FaGlobe,
    },
    {
      value: "4.2x",
      label: "Content Engagement",
      icon: FaChartLine,
    },
    {
      value: "52%",
      label: "Higher Brand Reach",
      icon: FaShareAlt,
    },
    {
      value: "24/7",
      label: "Evergreen Visibility",
      icon: FaClock,
    },
  ];

  /* =========================================================
     PROCESS
  ========================================================= */

  const process = [
    {
      number: "01",
      icon: FaSearch,
      title: "Research & Strategy",
      desc: "We research your audience, market, competitors, keywords and content gaps to identify the topics and formats with the strongest growth potential.",
    },
    {
      number: "02",
      icon: FaLightbulb,
      title: "Create Valuable Content",
      desc: "We develop blogs, guides, social content, videos and resources that answer real questions and position your brand as a trusted authority.",
    },
    {
      number: "03",
      icon: FaBullhorn,
      title: "Publish & Distribute",
      desc: "Content is strategically published and distributed across search, social, email and relevant channels to maximize visibility and reach.",
    },
    {
      number: "04",
      icon: FaChartBar,
      title: "Measure & Optimize",
      desc: "We track traffic, engagement, rankings and conversions to continuously improve content performance and create more of what works.",
    },
  ];

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.text} overflow-x-hidden transition-colors duration-500`}
    >
      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center pt-44 sm:pt-32 lg:pt-44 pb-20 px-4 sm:px-6 overflow-hidden"
      >
        {/* Background Glow */}

        <div
          className={`pointer-events-none absolute -top-40 -left-40 w-[420px] sm:w-[600px] lg:w-[760px] h-[420px] sm:h-[600px] lg:h-[760px] rounded-full blur-[140px] ${theme.glowOne}`}
        />

        <div
          className={`pointer-events-none absolute -bottom-40 -right-40 w-[420px] sm:w-[600px] lg:w-[760px] h-[420px] sm:h-[600px] lg:h-[760px] rounded-full blur-[140px] ${theme.glowTwo}`}
        />

        {/* Decorative Grid */}

        <div
          className={`pointer-events-none absolute inset-0 opacity-[0.035] ${
            isDarkMode ? "bg-white" : "bg-gray-900"
          }`}
          style={{
            maskImage: "linear-gradient(to bottom, black, transparent 80%)",
          }}
        />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-16 xl:gap-24 items-center">
            {/* HERO LEFT */}

            <motion.div
              style={{
                opacity: heroOpacity,
                y: heroY,
              }}
              className="text-center lg:text-left"
            >
              {/* Badge */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30"
                    : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
                }`}
              >
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
                  className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                  }`}
                >
                  Content Marketing System
                </span>
              </motion.div>

              {/* Heading */}

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                }}
                className={`font-black leading-tight mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
              >
                Turn Ideas Into
                <br />
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  }`}
                >
                  Meaningful Growth.
                </span>
              </motion.h1>

              {/* Description */}

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                }}
                className={`text-base md:text-xl max-w-3xl leading-relaxed text-center lg:text-start ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                We build intelligent content marketing systems that attract the
                right audience, build brand authority and turn valuable content
                into measurable business growth.
              </motion.p>

              {/* CTA */}

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mt-8"
              >
                {/* Primary Button: Grow With Content */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                      : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                  }`}
                >
                  {/* Animated Shine/Sweep Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                  <span className="relative z-20 flex items-center gap-2">
                    Grow With Content
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>

                {/* Secondary Button: See How It Works */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative w-full sm:w-auto px-8 py-4 ${
                    isDarkMode ? "bg-[#0b0d18]" : "bg-slate-50"
                  } border ${
                    isDarkMode
                      ? "border-white/10 text-white"
                      : "border-gray-200 text-gray-950"
                  } font-bold rounded-lg ${
                    isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-200"
                  } transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg hover:shadow-xl`}
                >
                  {/* Subtle Shine Effect for Secondary Button */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                  <span className="relative z-20 flex items-center gap-2">
                    <FaPlay className="text-xs group-hover:scale-110 transition-transform duration-300" />
                    See How It Works
                  </span>
                </motion.button>
              </motion.div>

              {/* Trust */}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className={`mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-xs sm:text-sm ${theme.subtle}`}
              >
                <span className="flex items-center gap-2">
                  <FaCheck className="text-emerald-500" />
                  Audience-focused content
                </span>

                <span className="flex items-center gap-2">
                  <FaCheck className="text-emerald-500" />
                  Search-driven growth
                </span>

                <span className="flex items-center gap-2">
                  <FaCheck className="text-emerald-500" />
                  Data-backed strategy
                </span>
              </motion.div>
            </motion.div>

            {/* =====================================================
                HERO RIGHT — CONTENT DASHBOARD
            ===================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: 60,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.35,
              }}
              style={{
                x: springX,
                y: springY,
              }}
              className="relative w-full max-w-2xl mx-auto"
            >
              {/* Floating top card */}

              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute -top-5 right-1 sm:-right-5 z-30 p-3 sm:p-4 rounded-2xl ${theme.card} border ${theme.border} shadow-2xl backdrop-blur-xl`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center`}
                  >
                    <FaEye className="text-[#07101a]" />
                  </div>

                  <div>
                    <p
                      className={`text-lg sm:text-xl font-black ${theme.text}`}
                    >
                      +184%
                    </p>

                    <p
                      className={`text-[9px] sm:text-[10px] uppercase tracking-wider ${theme.muted}`}
                    >
                      Content Reach
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating bottom card */}

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className={`absolute -bottom-6 left-2 sm:-left-7 z-30 p-3 sm:p-4 rounded-2xl ${theme.card} border ${theme.border} shadow-2xl backdrop-blur-xl`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="relative shrink-0">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center`}
                    >
                      <FaFileAlt className="text-[#07101a]" />
                    </div>

                    <span className="absolute -right-1 -top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="pt-1.5 sm:pt-2">
                    <p
                      className={`text-xs sm:text-sm font-black whitespace-nowrap ${theme.text}`}
                    >
                      New Content Published
                    </p>

                    <p
                      className={`text-[9px] sm:text-[10px] uppercase tracking-wider whitespace-nowrap ${theme.muted}`}
                    >
                      High-engagement article detected
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Main Dashboard */}

              <div
                className={`relative rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-5 md:p-7 ${theme.card} border ${theme.border} shadow-[0_25px_80px_rgba(0,0,0,.15)] backdrop-blur-2xl overflow-hidden`}
              >
                {/* Shine */}

                <div
                  className={`absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent ${
                    isDarkMode ? "via-[#d4e157]/70" : "via-emerald-500/40"
                  } to-transparent`}
                />

                {/* Header */}

                <div className="relative flex items-center justify-between mb-6">
                  {/* Left Circles */}

                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>

                  {/* Center */}

                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <span
                      className={`text-[9px] sm:text-[10px] uppercase tracking-widest ${theme.muted}`}
                    >
                      Live Content Analytics
                    </span>

                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />

                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  </div>
                </div>

                {/* Heading */}

                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p
                      className={`text-[10px] sm:text-xs text-start uppercase tracking-wider ${theme.muted}`}
                    >
                      Content Overview
                    </p>

                    <h3
                      className={`text-lg sm:text-xl md:text-2xl font-black ${theme.text} mt-1`}
                    >
                      Content Performance
                    </h3>
                  </div>

                  <div
                    className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.inner} border ${theme.border}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                    <span className={`text-[10px] ${theme.muted}`}>
                      This Month
                    </span>
                  </div>
                </div>

                {/* Metrics */}

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <motion.div
                    whileHover={{ y: -3 }}
                    className={`rounded-2xl p-4 sm:p-5 ${theme.inner} border ${theme.border}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className={`text-[10px] sm:text-xs ${theme.muted}`}>
                          Content Views
                        </p>

                        <p
                          className={`text-xl sm:text-2xl md:text-3xl font-black ${theme.text} mt-1`}
                        >
                          84,260
                        </p>
                      </div>

                      <FaEye className="text-emerald-500" />
                    </div>

                    <p className="text-[9px] sm:text-xs text-emerald-500 mt-2 font-bold">
                      ↑ 28.6% this month
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    className={`rounded-2xl p-4 sm:p-5 ${theme.inner} border ${theme.border}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className={`text-[10px] sm:text-xs ${theme.muted}`}>
                          Engaged Audience
                        </p>

                        <p
                          className={`text-xl sm:text-2xl md:text-3xl font-black ${theme.text} mt-1`}
                        >
                          31,840
                        </p>
                      </div>

                      <FaUsers
                        className={
                          isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
                        }
                      />
                    </div>

                    <p className="text-[9px] sm:text-xs text-emerald-500 mt-2 font-bold">
                      ↑ 21.4% this month
                    </p>
                  </motion.div>
                </div>

                {/* Graph */}

                <div
                  className={`rounded-2xl p-4 sm:p-5 ${theme.inner} border ${theme.border}`}
                >
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <p className={`text-[10px] sm:text-xs ${theme.muted}`}>
                        Content Reach
                      </p>

                      <p className={`text-sm font-bold ${theme.text}`}>
                        Last 8 campaigns
                      </p>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-lg ${theme.accentBg} flex items-center justify-center`}
                    >
                      <FaChartLine className={theme.accent} />
                    </div>
                  </div>

                  <div className="h-28 sm:h-32 md:h-36 flex items-end gap-1.5 sm:gap-2">
                    {[38, 52, 46, 63, 58, 76, 71, 96].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{
                          height: 0,
                        }}
                        whileInView={{
                          height: `${height}%`,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          delay: 0.4 + index * 0.08,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className={`flex-1 rounded-t-md bg-gradient-to-t ${theme.gradientBg}`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between mt-2">
                    {["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"].map(
                      (item) => (
                        <span
                          key={item}
                          className={`text-[8px] sm:text-[9px] ${theme.subtle}`}
                        >
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* Bottom Stats */}

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
                  {[
                    ["68.4%", "Engagement"],
                    ["$18.40", "Cost / Content"],
                    ["4.2x", "Content Growth"],
                  ].map(([value, label], index) => (
                    <motion.div
                      key={label}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay: 0.8 + index * 0.1,
                      }}
                      className={`text-center rounded-xl py-3 ${theme.softCard} border ${theme.border}`}
                    >
                      <p
                        className={`text-sm sm:text-base font-black ${theme.text}`}
                      >
                        {value}
                      </p>

                      <p className={`text-[8px] sm:text-[10px] ${theme.muted}`}>
                        {label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PLATFORM STRIP
      ========================================================= */}

      <section className={`border-y ${theme.border} py-8 sm:py-10`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p
            className={`text-center text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] ${theme.subtle} mb-6`}
          >
            Built for the platforms your audience already uses
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {[
              {
                name: "WordPress",
                icon: FaGlobe,
              },
              {
                name: "Google",
                icon: FaSearch,
              },
              {
                name: "LinkedIn",
                icon: FaUsers,
              },
              {
                name: "YouTube",
                icon: FaVideo,
              },
              {
                name: "Social Media",
                icon: FaShareAlt,
              },
            ].map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -3,
                }}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full border ${theme.border} ${theme.softCard} ${theme.muted} text-xs sm:text-sm font-bold`}
              >
                <platform.icon className={theme.accent} />

                {platform.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}

      <section className={`py-24 sm:py-28 md:py-32 px-4 sm:px-6 ${theme.bg}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-12 lg:gap-20">
            {/* Intro */}

            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: "-100px",
              }}
              transition={{
                duration: 0.8,
              }}
              className="lg:sticky lg:top-28 h-fit text-center lg:text-left"
            >
              {/* What We Do Badge */}
              <div
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30"
                    : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
                }`}
              >
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
                  className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                  }`}
                >
                  What We Do
                </span>
              </div>

              <h2
                className={`font-black leading-tight mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
              >
                More Than Just
                <br />
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  }`}
                >
                  Creating Content.
                </span>
              </h2>

              <p
                className={`text-base md:text-xl max-w-3xl leading-relaxed text-center lg:text-start ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                We build complete content systems that attract audiences,
                establish authority, increase visibility and turn attention into
                long-term business value.
              </p>

              <div
                className={`flex items-center justify-center lg:justify-start gap-3 mt-8 text-sm ${theme.muted}`}
              >
                <span
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center flex-shrink-0`}
                >
                  <FaAt className="text-[#07101a]" />
                </span>
                Strategy + Creation + Distribution
              </div>
            </motion.div>

            {/* Cards */}

            <div className="grid sm:grid-cols-2 gap-5">
              {services.map((service, index) => (
                <motion.div
                  key={service.number}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                  className={`group relative p-6 sm:p-8 rounded-[1.75rem] border ${theme.border} ${theme.card} overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 text-left`}
                >
                  <div
                    className={`absolute -right-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br ${theme.gradientBg} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}
                  />

                  <div className="flex items-start justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center shadow-lg`}
                    >
                      <service.icon className="text-xl text-[#07101a]" />
                    </div>

                    <span
                      className={`text-4xl font-black ${
                        isDarkMode ? "text-white/5" : "text-gray-100"
                      }`}
                    >
                      {service.number}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold ${theme.text} mt-7 mb-3`}>
                    {service.title}
                  </h3>

                  <p
                    className={`${theme.muted} text-sm sm:text-base leading-7`}
                  >
                    {service.desc}
                  </p>

                  <div
                    className={`mt-6 flex items-center gap-2 text-xs font-bold ${theme.accent}`}
                  >
                    Explore capability
                    <FaChevronRight className="text-[9px] group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTENT ENGINE
      ========================================================= */}

      <section className="py-24 sm:py-28 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30"
                  : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
              }`}
            >
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
                className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                }`}
              >
                The Content Engine
              </span>
            </div>

            {/* Heading */}
            <h2
              className={`font-black leading-tight mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
            >
              One Idea.
              <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                Multiple Growth Opportunities.
              </span>
            </h2>

            {/* Paragraph */}
            <p
              className={`text-base md:text-xl max-w-3xl mx-auto leading-relaxed ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Your content system should keep attracting, educating and engaging
              your audience long after the content is published.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Main card */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className={`lg:col-span-2 relative overflow-hidden rounded-[2rem] border ${theme.border} ${theme.card} p-6 sm:p-8 md:p-10`}
            >
              <div
                className={`absolute right-0 top-0 w-72 h-72 rounded-full bg-gradient-to-br ${theme.gradientBg} opacity-5 blur-3xl`}
              />

              <div className="relative z-10">
                <div className="flex flex-col items-center text-center mb-8">
                  <div>
                    <p
                      className={`text-xs uppercase tracking-widest ${theme.muted}`}
                    >
                      Content Flow
                    </p>

                    <h3
                      className={`text-2xl sm:text-3xl font-black ${theme.text} mt-1`}
                    >
                      Automated Content Engine
                    </h3>
                  </div>
                </div>

                {/* Flow */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      icon: FaLightbulb,
                      title: "Ideas",
                      value: "2.4K",
                    },
                    {
                      icon: FaFileAlt,
                      title: "Published",
                      value: "684",
                    },
                    {
                      icon: FaEye,
                      title: "Engaged",
                      value: "84K",
                    },
                    {
                      icon: FaChartLine,
                      title: "Conversions",
                      value: "3.2K",
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.title}
                      whileHover={{
                        y: -4,
                      }}
                      className={`relative rounded-2xl border ${theme.border} ${theme.inner} p-4`}
                    >
                      <div
                        className={`mx-auto w-9 h-9 rounded-xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center mb-4`}
                      >
                        <item.icon className="text-[#07101a] text-sm" />
                      </div>

                      <p
                        className={`text-xl sm:text-2xl font-black ${theme.text}`}
                      >
                        {item.value}
                      </p>

                      <p
                        className={`text-[10px] sm:text-xs ${theme.muted} mt-1`}
                      >
                        {item.title}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Progress */}

                <div className="mt-7">
                  <div className="flex justify-between mb-2">
                    <span className={`text-xs ${theme.muted}`}>
                      Content strategy performance
                    </span>

                    <span className={`text-xs font-bold ${theme.accent}`}>
                      86%
                    </span>
                  </div>

                  <div
                    className={`h-2 rounded-full ${
                      isDarkMode ? "bg-white/5" : "bg-gray-100"
                    } overflow-hidden`}
                  >
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      whileInView={{
                        width: "86%",
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 1.2,
                        ease: "easeOut",
                      }}
                      className={`h-full rounded-full bg-gradient-to-r ${theme.gradientBg}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Side Cards */}

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-5">
              <motion.div
                initial={{
                  opacity: 0,
                  x: 30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                className={`rounded-[1.75rem] border ${theme.border} ${theme.card} p-5 sm:p-7`}
              >
                <div
                  className={`mx-auto w-11 h-11 rounded-xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center mb-5`}
                >
                  <FaMobileAlt className="text-[#07101a]" />
                </div>

                <p className={`text-2xl sm:text-3xl font-black ${theme.text}`}>
                  100%
                </p>

                <p className={`text-xs sm:text-sm ${theme.muted} mt-1`}>
                  Mobile-ready content
                </p>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  x: 30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.1,
                }}
                className={`rounded-[1.75rem] border ${theme.border} ${theme.card} p-5 sm:p-7`}
              >
                <div
                  className={`mx-auto w-11 h-11 rounded-xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center mb-5`}
                >
                  <FaClock className="text-[#07101a]" />
                </div>

                <p className={`text-2xl sm:text-3xl font-black ${theme.text}`}>
                  24/7
                </p>

                <p className={`text-xs sm:text-sm ${theme.muted} mt-1`}>
                  Evergreen content reach
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTENT INTELLIGENCE
      ========================================================= */}

      <section className="py-24 sm:py-28 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30"
                  : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
              }`}
            >
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
                className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                }`}
              >
                Data Behind Every Piece
              </span>
            </div>

            {/* Heading */}
            <h2
              className={`font-black leading-tight mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
            >
              Content Marketing
              <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                Intelligence
              </span>
            </h2>

            {/* Paragraph */}
            <p
              className={`text-base md:text-xl max-w-3xl mx-auto leading-relaxed ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              We don't chase vanity metrics. We measure the numbers that
              actually show whether your content is building visibility,
              engagement and business value.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -5,
                }}
                className={`relative p-5 sm:p-7 rounded-2xl sm:rounded-3xl border ${theme.border} ${theme.card} text-center overflow-hidden shadow-sm hover:shadow-xl transition-shadow`}
              >
                <div
                  className={`mx-auto w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center mb-4`}
                >
                  <stat.icon className="text-[#07101a] text-sm sm:text-base" />
                </div>

                <div
                  className={`text-2xl sm:text-3xl md:text-4xl font-black ${theme.text}`}
                >
                  {stat.value}
                </div>

                <p
                  className={`text-[10px] sm:text-xs md:text-sm ${theme.muted} mt-2`}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CUSTOMER JOURNEY
      ========================================================= */}

      <section className="py-24 sm:py-28 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}

          <div className="text-center mb-24">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30"
                  : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
              }`}
            >
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
                className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                }`}
              >
                The Content Journey
              </span>
            </div>

            <h2
              className={`font-black leading-tight mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
            >
              From First Impression To
              <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                Loyal Customer
              </span>
            </h2>
          </div>

          {/* Journey */}

          <div className="relative">
            {/* Connecting Line */}

            <div
              className={`hidden md:block absolute top-[34px] left-[10%] right-[10%] h-px ${
                isDarkMode
                  ? "bg-gradient-to-r from-transparent via-[#d4e157]/40 to-transparent"
                  : "bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
              }`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 md:gap-4">
              {journey.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{
                      y: -8,
                    }}
                    className={`relative h-full p-6 sm:p-7 rounded-[1.75rem] border ${theme.border} ${theme.card} shadow-sm hover:shadow-xl transition-all duration-500 text-center overflow-hidden`}
                  >
                    {/* Hover Glow */}

                    <div
                      className={`absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br ${theme.gradientBg} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}
                    />

                    {/* Icon */}

                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`relative w-[68px] h-[68px] rounded-2xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                      >
                        <item.icon className="text-xl text-[#07101a]" />

                        <span
                          className={`absolute -top-2 -right-2 w-7 h-7 rounded-full ${theme.card} border ${theme.border} flex items-center justify-center text-[10px] font-black ${theme.accent}`}
                        >
                          0{index + 1}
                        </span>
                      </div>

                      <h3
                        className={`font-black text-lg sm:text-xl mt-6 ${theme.text}`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`text-sm leading-6 ${theme.muted} mt-2 max-w-[190px]`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>

                  {/* Mobile Connector */}

                  {index < journey.length - 1 && (
                    <div
                      className={`md:hidden w-px h-6 mx-auto ${
                        isDarkMode ? "bg-[#d4e157]/30" : "bg-emerald-500/30"
                      }`}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROCESS
      ========================================================= */}

      <section className="py-24 sm:py-28 md:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30"
                  : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
              }`}
            >
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
                className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                }`}
              >
                How It Works
              </span>
            </div>

            {/* Heading */}
            <h2
              className={`font-black leading-tight mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
            >
              A System Built To
              <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                Create Better Content
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {process.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -30 : 30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -4,
                }}
                className={`group relative p-6 sm:p-8 rounded-[1.75rem] border ${theme.border} ${theme.card} shadow-sm hover:shadow-xl transition-all`}
              >
                <div className="flex gap-5">
                  <div
                    className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center`}
                  >
                    <item.icon className="text-[#07101a] text-xl" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3
                        className={`text-lg sm:text-xl font-bold ${theme.text}`}
                      >
                        {item.title}
                      </h3>

                      <span
                        className={`hidden sm:block text-xs font-black ${theme.accent}`}
                      >
                        {item.number}
                      </span>
                    </div>

                    <p
                      className={`${theme.muted} leading-7 text-sm sm:text-base mt-2 text-left`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="relative py-24 sm:py-28 md:py-36 px-4 sm:px-6 overflow-hidden">
        {/* Glow */}

        <div
          className={`absolute inset-0 bg-gradient-to-r ${theme.gradientBg} opacity-[0.035]`}
        />

        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] md:w-[700px] h-[350px] sm:h-[550px] md:h-[700px] rounded-full blur-[150px] ${theme.glowOne}`}
        />

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.97,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className={`relative z-10 max-w-5xl mx-auto text-center p-8 sm:p-12 md:p-16 lg:p-20 rounded-[2rem] sm:rounded-[3rem] border ${theme.border} ${theme.card} shadow-2xl overflow-hidden`}
        >
          {/* CTA shine */}

          <div
            className={`absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent ${
              isDarkMode ? "via-[#d4e157]/70" : "via-emerald-500/40"
            } to-transparent`}
          />

          {/* Icon */}

          <div
            className={`relative mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${theme.gradientBg} flex items-center justify-center mb-7`}
          >
            <FaRocket className="text-[#07101a] text-xl sm:text-2xl" />
          </div>

          {/* Heading */}

          <h2
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.02] ${theme.text} mb-6`}
          >
            Your Next Customer
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
            >
              Starts With Great Content.
            </span>
          </h2>

          <p
            className={`max-w-2xl mx-auto ${theme.muted} text-base sm:text-lg leading-7 mb-9`}
          >
            Let's build a content marketing system that consistently attracts
            the right audience, strengthens your brand authority and turns
            attention into predictable business growth.
          </p>

          {/* CTA Button */}

          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r ${theme.gradientBg} ${
              isDarkMode
                ? "text-[#0a0e27]"
                : "text-white" /* ✅ FIXED: Day mode = white, Night mode = black */
            } font-black text-base sm:text-lg shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)] transition-all duration-300 overflow-hidden`}
          >
            {/* Animated Shine/Sweep Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

            <span className="relative z-20 flex items-center gap-3">
              Start Growing With Content
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.button>

          {/* Trust */}

          <div
            className={`flex flex-wrap justify-center gap-x-6 gap-y-3 mt-7 text-xs sm:text-sm ${theme.muted}`}
          >
            <span>
              <FaCheck className="inline mr-1 text-emerald-500" />
              Free content strategy review
            </span>

            <span>
              <FaCheck className="inline mr-1 text-emerald-500" />
              No long-term commitment
            </span>

            <span>
              <FaCheck className="inline mr-1 text-emerald-500" />
              Actionable growth plan
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ContentMarketing;
