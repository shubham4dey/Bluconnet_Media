import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaArrowRight,
  FaPlay,
  FaQuoteLeft,
  FaStar,
  FaAward,
  FaUsers,
  FaRocket,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import getThemeColors from "../utils/themeColors";

const AboutHero = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState(1);

  // Animated counter hook
  const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const counterRef = useRef(null);
    const inView = useInView(counterRef, { once: true });

    useEffect(() => {
      if (!inView) return;
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1
        );
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [inView, end, duration]);

    return (
      <span ref={counterRef}>
        {count}
        {suffix}
      </span>
    );
  };

  // Slides data
  const slides = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920",
  ];

  const marqueeWords = [
    "INNOVATION",
    "EXCELLENCE",
    "STRATEGY",
    "GROWTH",
    "SUCCESS",
    "LEADERSHIP",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setNextSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center pt-32 sm:pt-40 md:pt-44 lg:pt-56 pb-20 px-4 overflow-hidden"
    >
      {/* Background Slider - FIXED WHITE FLASH */}
      <div className="absolute inset-0 overflow-hidden bg-gray-900">
        {/* Current Slide */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide]})` }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          {/* Gradient Overlay - FIXED for day mode */}
          <div
            className={`absolute inset-0 ${
              isDarkMode
                ? "bg-gradient-to-br from-[#0a0e27]/90 via-black/70 to-[#06b6d4]/30"
                : "bg-gradient-to-br from-black/80 via-black/60 to-emerald-900/50"
            }`}
          ></div>
        </motion.div>

        {/* Next Slide - Preloaded */}
        <motion.div
          key={`next-${nextSlide}`}
          className="absolute inset-0 opacity-0 pointer-events-none"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[nextSlide]})` }}
          />
          <div
            className={`absolute inset-0 ${
              isDarkMode
                ? "bg-gradient-to-br from-[#0a0e27]/90 via-black/70 to-[#06b6d4]/30"
                : "bg-gradient-to-br from-black/80 via-black/60 to-emerald-900/50"
            }`}
          ></div>
        </motion.div>
      </div>

      {/* Animated Background Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-20 left-10 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] rounded-full blur-[120px] ${colors.glowLeft} opacity-20`}
      ></motion.div>

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-20 right-10 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] rounded-full blur-[120px] ${colors.glowRight} opacity-20`}
      ></motion.div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${colors.gridDotColor} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* ROTATING "ABOUT US" TEXT - Left Side */}
      <div className="absolute top-32 sm:top-36 lg:top-40 left-4 sm:left-6 lg:left-10 z-20 hidden xl:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="relative w-64 h-64"
        >
          {/* Circular Text Container */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <path
                id="circlePath"
                d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              />
            </defs>
            <text
              className="fill-white"
              fontSize="11"
              fontWeight="bold"
              letterSpacing="0.3em"
            >
              <textPath href="#circlePath" startOffset="0%">
                ABOUT US • DIGITAL AGENCY • EST. 2018 •
              </textPath>
            </text>
          </svg>

          {/* Center Badge - CONSISTENT GRADIENT */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} flex items-center justify-center shadow-xl`}
          >
            <span className="text-xs font-black text-white">10+</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className={`absolute top-32 right-4 sm:right-10 lg:right-20 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 ${colors.shapeOpacity} pointer-events-none hidden sm:block`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${colors.shapeColor1}`}
        >
          <path
            d="M50 5 L95 50 L50 95 L5 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className={`absolute bottom-32 left-4 sm:left-10 lg:left-20 w-12 h-12 sm:w-16 sm:h-16 lg:w-16 lg:h-16 ${colors.shapeOpacity} pointer-events-none hidden sm:block`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${colors.shapeColor2}`}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Top Row - Main Content */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
          {/* Left Content - 7 columns */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-left"
          >
            {/* Premium Badge - CONSISTENT COLORS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 ${colors.badgeBg} border ${colors.badgeBorder} rounded-full mb-6 sm:mb-10 shadow-lg backdrop-blur-sm`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full`}
                ></span>
                <span
                  className={`absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full animate-ping opacity-75`}
                ></span>
              </div>
              <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] sm:tracking-[0.25em] uppercase bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
                EST. 2018 • DIGITAL AGENCY
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[1.1] lg:leading-[0.95] text-white tracking-tight"
            >
              We Build
              <br />
              {/* Mobile */}
              <span className="sm:hidden whitespace-nowrap">
                <span className="relative inline-block">
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    }`}
                  >
                    Digital
                  </span>

                  <motion.svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 10"
                    fill="none"
                  >
                    <motion.path
                      d="M0 5 Q 50 0, 100 5 T 200 5"
                      stroke="url(#underline-gradient-mobile)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: 1,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    />

                    <defs>
                      <linearGradient
                        id="underline-gradient-mobile"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor={isDarkMode ? "#d4e157" : "#10b981"}
                        />
                        <stop
                          offset="100%"
                          stopColor={isDarkMode ? "#06b6d4" : "#0891b2"}
                        />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>

                <span className="italic font-light text-white/90 ml-2">
                  Experiences
                </span>
              </span>
              {/* Tablet & Desktop */}
              <span className="hidden sm:inline">
                <span className="relative inline-block">
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    }`}
                  >
                    Digital
                  </span>

                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 10"
                    fill="none"
                  >
                    <motion.path
                      d="M0 5 Q 50 0, 100 5 T 200 5"
                      stroke="url(#underline-gradient-desktop)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: 1,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    />

                    <defs>
                      <linearGradient
                        id="underline-gradient-desktop"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor={isDarkMode ? "#d4e157" : "#10b981"}
                        />
                        <stop
                          offset="100%"
                          stopColor={isDarkMode ? "#06b6d4" : "#0891b2"}
                        />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>

                <br />

                <span className="italic font-light text-white/90">
                  Experiences
                </span>
              </span>
            </motion.h1>

            {/* Description - IMPROVED READABILITY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 sm:mt-8 max-w-2xl"
            >
              <div className="relative bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed font-light">
                  At BluConnet Media, we don't just build campaigns—we craft
                  <span
                    className={`font-semibold text-white bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} bg-clip-text text-transparent`}
                  >
                    {" "}
                    digital masterpieces.
                  </span>
                  With over a decade of excellence, we transform brands into
                  industry leaders through innovative strategies and measurable
                  results.
                </p>
              </div>
            </motion.div>

            {/* Premium CTA Buttons - CONSISTENT COLORS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4"
            >
              {/* Button 1: Discover Our Story */}
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden group px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r font-bold rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                    : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                }`}
              >
                {/* Standardized Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                <span className="relative z-20 flex items-center justify-center gap-2 w-full text-sm sm:text-base">
                  Discover Our Story
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>

              {/* Button 2: Watch Showreel (Glassmorphism) */}
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-8 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 shadow-lg hover:shadow-xl"
              >
                {/* Subtle Shine Effect for Glass Button */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                <div className="relative z-20 flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    } flex items-center justify-center shadow-lg`}
                  >
                    <FaPlay className="text-white text-[10px] sm:text-xs ml-0.5" />
                  </div>
                  <span className="text-sm sm:text-base">Watch Showreel</span>
                </div>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 flex-wrap"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex -space-x-2">
                  {["JD", "SK", "MR", "AK"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="ml-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xs sm:text-sm" />
                    ))}
                  </div>
                  <div className="text-[10px] sm:text-xs text-white/90 mt-0.5">
                    <span className="font-bold text-white">4.9/5</span> from
                    500+ clients
                  </div>
                </div>
              </div>

              <div className="hidden sm:block h-10 w-px bg-white/30"></div>

              <div className="flex items-center gap-2 sm:gap-3 text-white/90">
                <FaAward
                  className={`text-lg sm:text-xl ${isDarkMode ? "text-[#d4e157]" : "text-emerald-400"}`}
                />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    Award Winning
                  </div>
                  <div className="text-[10px] sm:text-xs">30+ Global Awards</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - 5 columns - Premium Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-5 relative mt-8 lg:mt-0"
          >
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Main Glassmorphism Card */}
              <motion.div
                whileHover={{ y: -5 }}
                className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden"
              >
                {/* Animated Gradient Border - CONSISTENT COLORS */}
                <div
                  className={`absolute inset-0 rounded-2xl sm:rounded-3xl p-[2px] bg-gradient-to-br ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} opacity-30`}
                >
                  <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-white/10"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Top Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {[
                      {
                        icon: FaRocket,
                        num: 10,
                        suffix: "+",
                        label: "Years",
                        color: "from-purple-400 to-pink-400",
                      },
                      {
                        icon: FaUsers,
                        num: 200,
                        suffix: "+",
                        label: "Clients",
                        color: "from-blue-400 to-cyan-400",
                      },
                      {
                        icon: FaAward,
                        num: 30,
                        suffix: "+",
                        label: "Awards",
                        color: "from-yellow-400 to-orange-400",
                      },
                      {
                        icon: FaStar,
                        num: 500,
                        suffix: "+",
                        label: "Projects",
                        color: "from-green-400 to-teal-400",
                      },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        className="group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer"
                      >
                        <div
                          className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
                        ></div>
                        <div
                          className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 sm:mb-3 shadow-lg`}
                        >
                          <stat.icon className="text-white text-base sm:text-lg" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                          <AnimatedCounter
                            end={stat.num}
                            suffix={stat.suffix}
                          />
                        </div>
                        <div className="text-[10px] sm:text-xs font-semibold text-white/70 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote Card - CONSISTENT COLORS */}
                  <div
                    className={`relative p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${isDarkMode ? "from-[#d4e157]/10 to-[#06b6d4]/10" : "from-emerald-500/10 to-cyan-600/10"} border border-white/20`}
                  >
                    <FaQuoteLeft
                      className={`absolute top-3 left-3 text-xl sm:text-2xl ${isDarkMode ? "text-[#06b6d4]/30" : "text-emerald-400/30"}`}
                    />
                    <p className="relative z-10 text-xs sm:text-sm text-white italic pl-5 sm:pl-6 leading-relaxed">
                      "BluConnet transformed our digital presence completely.
                      Their strategic approach delivered 300% ROI in just 6
                      months."
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pl-5 sm:pl-6">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                      <div>
                        <div className="text-[10px] sm:text-xs font-bold text-white">
                          Shikha Sharma
                        </div>
                        <div className="text-[10px] sm:text-xs text-white/70">
                          CEO, TechCorp
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Achievement Badge - CONSISTENT COLORS */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-2 right-2 sm:-top-4 sm:right-4 lg:-top-6 lg:-right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl flex items-center gap-2 sm:gap-3 z-30"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  } flex items-center justify-center shadow-xl`}
                >
                  <FaAward className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl" />
                </div>

                <div>
                  <div className="font-black text-[10px] sm:text-xs md:text-sm text-white">
                    Top 1%
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-white/70">
                    Agency Worldwide
                  </div>
                </div>
              </motion.div>

              {/* Floating Stats Badge */}
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute
                -bottom-2 left-2
                sm:-bottom-4 sm:left-4
                lg:-bottom-6 lg:-left-6
                bg-white/10 backdrop-blur-xl border border-white/20
                rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-2xl z-20"
                style={{ willChange: "transform" }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className="text-yellow-400 text-[10px] sm:text-xs md:text-sm"
                      />
                    ))}
                  </div>

                  <div>
                    <div className="font-black text-[10px] sm:text-xs md:text-sm text-white">
                      4.9/5.0
                    </div>
                    <div className="text-[9px] sm:text-[10px] md:text-xs text-white/70">
                      Client Rating
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Scrolling Marquee - CONSISTENT COLORS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative overflow-hidden py-6 sm:py-8 border-y border-white/10"
        >
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-8 sm:gap-12"
          >
            {[...marqueeWords, ...marqueeWords, ...marqueeWords].map(
              (word, i) => (
                <div key={i} className="flex items-center gap-8 sm:gap-12">
                  <span
                    className={`text-3xl sm:text-5xl md:text-7xl font-black ${
                      i % 2 === 0
                        ? `text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`
                        : "text-white"
                    } opacity-20 hover:opacity-100 transition-opacity`}
                  >
                    {word}
                  </span>
                  <FaStar
                    className={`${isDarkMode ? "text-[#d4e157]" : "text-emerald-400"} opacity-30 text-lg sm:text-2xl`}
                  />
                </div>
              )
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;