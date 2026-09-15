import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  FaAward,
  FaTrophy,
  FaChevronDown,
  FaStar,
  FaMedal,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import getThemeColors from "../utils/themeColors";
import statsImage from "../assets/img/awards-img.png";

const AwardsSection = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  // Ultra smooth mouse tracking with springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const awards = [
    {
      year: "2024",
      title: "Best Digital Marketing Agency",
      category: "Excellence",
      description:
        "Recognized for outstanding performance in digital marketing strategies and client results.",
    },
    {
      year: "2023",
      title: "Excellence in SEO Innovation",
      category: "Innovation",
      description:
        "Awarded for breakthrough SEO techniques and measurable client success stories.",
    },
    {
      year: "2023",
      title: "Best Content Marketing Campaign",
      category: "Creative",
      description:
        "Honored for creating viral content campaigns that drove exceptional engagement.",
    },
    {
      year: "2022",
      title: "Client Satisfaction Award",
      category: "Trusted",
      description:
        "Recognized for maintaining 98% client satisfaction rate and long-term partnerships.",
    },
    {
      year: "2022",
      title: "Top Social Media Agency",
      category: "Industry",
      description:
        "Awarded for excellence in social media management and brand growth strategies.",
    },
  ];

  // Award Winner Badge Component
  const AwardBadge = () => (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotateY: -90 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      exit={{ scale: 0, opacity: 0, rotateY: 90 }}
      whileHover={{
        scale: 1.08,
        rotate: 5,
        filter: `drop-shadow(0 0 25px ${
          isDarkMode ? "rgba(212,225,87,.8)" : "rgba(34,197,94,.8)"
        })`,
      }}
      transition={{
        duration: 0.6,
        type: "spring",
        stiffness: 200,
      }}
      className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 cursor-pointer"
      style={{ perspective: 200 }}
    >
      <motion.div
        animate={{ rotate: [0, 1, -1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
          <defs>
            {/* Enhanced Filters */}
            <filter
              id="glow-effect"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="inner-glow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
              <feFlood
                floodColor={isDarkMode ? "#d4e157" : "#22c55e"}
                floodOpacity="0.5"
              />
              <feComposite in2="offsetBlur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Theme Gradients */}
            <linearGradient
              id="gold-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isDarkMode ? "#d4e157" : "#34d399"}
              />
              <stop
                offset="25%"
                stopColor={isDarkMode ? "#c4d64a" : "#22c55e"}
              />
              <stop
                offset="50%"
                stopColor={isDarkMode ? "#06b6d4" : "#16a34a"}
              />
              <stop
                offset="75%"
                stopColor={isDarkMode ? "#0891b2" : "#15803d"}
              />
              <stop
                offset="100%"
                stopColor={isDarkMode ? "#0e7490" : "#166534"}
              />
            </linearGradient>

            <linearGradient id="metallic" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={isDarkMode ? "#fef9c3" : "#d1fae5"}
              />
              <stop
                offset="30%"
                stopColor={isDarkMode ? "#d4e157" : "#a7f3d0"}
              />
              <stop
                offset="50%"
                stopColor={isDarkMode ? "#06b6d4" : "#6ee7b7"}
              />
              <stop
                offset="70%"
                stopColor={isDarkMode ? "#0891b2" : "#34d399"}
              />
              <stop
                offset="100%"
                stopColor={isDarkMode ? "#0e7490" : "#10b981"}
              />
            </linearGradient>

            <radialGradient id="trophy-glow" cx="50%" cy="40%">
              <stop
                offset="0%"
                stopColor={isDarkMode ? "#d4e157" : "#6ee7b7"}
                stopOpacity="0.4"
              />
              <stop
                offset="100%"
                stopColor={isDarkMode ? "#06b6d4" : "#6ee7b7"}
                stopOpacity="0"
              />
            </radialGradient>

            <linearGradient
              id="crown-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isDarkMode ? "#fef9c3" : "#ecfdf5"}
              />
              <stop
                offset="50%"
                stopColor={isDarkMode ? "#d4e157" : "#6ee7b7"}
              />
              <stop
                offset="100%"
                stopColor={isDarkMode ? "#06b6d4" : "#059669"}
              />
            </linearGradient>

            {/* Circular Text Path */}
            <path
              id="award-circle-path"
              d="M60,60 m-54,0 a54,54 0 1,1 108,0 a54,54 0 1,1 -108,0"
              fill="none"
            />
          </defs>

          {/* Outer Glow Pulse */}
          <motion.circle
            cx="60"
            cy="60"
            r="58"
            fill="none"
            stroke="url(#gold-gradient)"
            strokeWidth="1"
            animate={{
              r: [57, 59, 57],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated Outer Ring + Circular Text */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 60px" }}
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#gold-gradient)"
              strokeWidth="2.5"
              strokeDasharray="8 4"
              opacity="0.7"
            />

            <text
              fill={isDarkMode ? "#d4e157" : "#22c55e"}
              fontSize="6"
              fontWeight="700"
              letterSpacing="2.5"
            >
              <textPath href="#award-circle-path" startOffset="0%">
                ★ CHAMPION ★ EXCELLENCE ★ CHAMPION ★ EXCELLENCE ★
              </textPath>
            </text>
          </motion.g>

          {/* Counter-Rotating Inner Ring */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 60px" }}
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#gold-gradient)"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.5"
            />
          </motion.g>

          {/* Main Circle */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill={isDarkMode ? "#111827" : "#000"}
            stroke="url(#gold-gradient)"
            strokeWidth="3"
            filter="url(#glow-effect)"
          />

          {/* Inner Decorative Rings */}
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="url(#gold-gradient)"
            strokeWidth="1"
            opacity="0.4"
          />
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="url(#gold-gradient)"
            strokeWidth="0.5"
            strokeDasharray="1 2"
            opacity="0.3"
          />

          {/* Trophy Glow Background */}
          <circle cx="60" cy="58" r="30" fill="url(#trophy-glow)" />

          {/* Enhanced Crown */}
          <g transform="translate(60,35)" filter="url(#inner-glow)">
            <path
              d="M-20 0 L20 0 L20 10 L-20 10 Z"
              fill="url(#crown-gradient)"
              stroke="url(#gold-gradient)"
              strokeWidth="0.5"
            />
            <path d="M-20 0 L-24 -14 L-12 -6 Z" fill="url(#crown-gradient)" />
            <path d="M-10 0 L-14 -18 L-4 -8 Z" fill="url(#crown-gradient)" />
            <path d="M0 0 L-4 -20 L4 -8 Z" fill="url(#crown-gradient)" />
            <path d="M10 0 L4 -18 L14 -8 Z" fill="url(#crown-gradient)" />
            <path d="M20 0 L24 -14 L12 -6 Z" fill="url(#crown-gradient)" />

            <circle
              cx="-14"
              cy="-4"
              r="2.5"
              fill={isDarkMode ? "#1f2937" : "#fff"}
              stroke="url(#gold-gradient)"
              strokeWidth="0.5"
            />
            <circle
              cx="0"
              cy="-8"
              r="3"
              fill={isDarkMode ? "#dc2626" : "#ef4444"}
              stroke="url(#gold-gradient)"
              strokeWidth="0.5"
            />
            <circle
              cx="14"
              cy="-4"
              r="2.5"
              fill={isDarkMode ? "#1f2937" : "#fff"}
              stroke="url(#gold-gradient)"
              strokeWidth="0.5"
            />

            <path
              d="M-18 5 L18 5"
              stroke="url(#gold-gradient)"
              strokeWidth="1"
              opacity="0.6"
            />
          </g>

          {/* Enhanced Trophy Cup */}
          <g transform="translate(60,62)" filter="url(#inner-glow)">
            <path
              d="M-18 -14 Q-20 -14 -20 -7 Q-20 10 -7 14 Q0 16 7 14 Q20 10 20 -7 Q20 -14 18 -14 Z"
              fill="url(#metallic)"
              stroke="url(#gold-gradient)"
              strokeWidth="1.5"
            />
            <path
              d="M-18 -10 Q-26 -8 -26 2 Q-26 12 -18 10"
              fill="none"
              stroke="url(#gold-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M18 -10 Q26 -8 26 2 Q26 12 18 10"
              fill="none"
              stroke="url(#gold-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <rect
              x="-5"
              y="12"
              width="10"
              height="10"
              rx="1.5"
              fill="url(#gold-gradient)"
              stroke="url(#metallic)"
              strokeWidth="0.5"
            />
            <rect
              x="-12"
              y="20"
              width="24"
              height="5"
              rx="2"
              fill="url(#gold-gradient)"
              stroke="url(#metallic)"
              strokeWidth="0.5"
            />
            <path
              d="M-10 -10 Q-3 -3 -7 10"
              stroke="rgba(255,255,255,.6)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M10 -10 Q3 -3 7 10"
              stroke="rgba(255,255,255,.4)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Enhanced Laurel Left */}
          <g
            stroke="url(#gold-gradient)"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          >
            <path d="M36 50 Q26 55 22 65 Q18 75 20 85" />
            <path d="M28 55 Q22 53 20 57 Q22 61 28 59" />
            <path d="M26 65 Q20 63 18 67 Q20 71 26 69" />
            <path d="M25 75 Q19 73 17 77 Q19 81 25 79" />
            <path d="M24 85 Q18 83 16 87 Q18 91 24 89" />
          </g>

          {/* Enhanced Laurel Right */}
          <g
            stroke="url(#gold-gradient)"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          >
            <path d="M84 50 Q94 55 98 65 Q102 75 100 85" />
            <path d="M92 55 Q98 53 100 57 Q98 61 92 59" />
            <path d="M94 65 Q100 63 102 67 Q100 71 94 69" />
            <path d="M95 75 Q101 73 103 77 Q101 81 95 79" />
            <path d="M96 85 Q102 83 104 87 Q102 91 96 89" />
          </g>

          {/* Premium Stars */}
          <g fill="url(#gold-gradient)">
            <motion.path
              d="M60 18 L63 24 L70 24 L65 28 L67 34 L60 30 L53 34 L55 28 L50 24 L57 24 Z"
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "60px 26px" }}
            />
            <motion.path
              d="M32 38 L34 42 L39 42 L35 45 L37 50 L32 47 L27 50 L29 45 L25 42 L30 42 Z"
              opacity=".8"
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              style={{ transformOrigin: "32px 44px" }}
            />
            <motion.path
              d="M88 38 L90 42 L95 42 L91 45 L93 50 L88 47 L83 50 L85 45 L81 42 L86 42 Z"
              opacity=".8"
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              style={{ transformOrigin: "88px 44px" }}
            />
          </g>

          {/* Animated Sparkles */}
          <motion.g
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {[
              { cx: 22, cy: 32 },
              { cx: 98, cy: 32 },
              { cx: 18, cy: 60 },
              { cx: 102, cy: 60 },
              { cx: 25, cy: 88 },
              { cx: 95, cy: 88 },
            ].map((sparkle, i) => (
              <circle
                key={i}
                cx={sparkle.cx}
                cy={sparkle.cy}
                r="1.5"
                fill={isDarkMode ? "#d4e157" : "#22c55e"}
              />
            ))}
          </motion.g>

          {/* Trophy Glow Pulse */}
          <motion.circle
            cx="60"
            cy="60"
            r="34"
            fill="none"
            stroke="url(#gold-gradient)"
            strokeWidth="1.5"
            opacity=".3"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "60px 60px" }}
          />

          {/* Rotating Shine Effect */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 60px" }}
          >
            <line
              x1="60"
              y1="8"
              x2="60"
              y2="16"
              stroke="white"
              strokeWidth="1.5"
              opacity=".6"
              strokeLinecap="round"
            />
            <circle cx="60" cy="8" r="2.5" fill="white" opacity=".9" />
          </motion.g>

          {/* Floating Stars */}
          {[
            { x: 20, delay: 0 },
            { x: 60, delay: 0.5 },
            { x: 100, delay: 1 },
          ].map((star, i) => (
            <motion.circle
              key={i}
              cx={star.x}
              cy="16"
              r="1.8"
              fill={isDarkMode ? "#d4e157" : "#22c55e"}
              animate={{
                y: [0, -5, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: star.delay,
              }}
            />
          ))}

          {/* Particle Effects */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            const x = 60 + Math.cos(angle) * 45;
            const y = 60 + Math.sin(angle) * 45;
            return (
              <motion.circle
                key={`particle-${i}`}
                cx={x}
                cy={y}
                r="1"
                fill={isDarkMode ? "#d4e157" : "#22c55e"}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
              />
            );
          })}
        </svg>
      </motion.div>
    </motion.div>
  );

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;
    const offset = isMobile ? 24 : 40;

    mouseX.set(e.clientX - rect.left - offset);
    mouseY.set(e.clientY - rect.top - offset);
    setActiveIndex(index);
  };

  return (
    <section
      className={`py-32 px-4 relative overflow-hidden ${isDarkMode ? "bg-[#050508]" : "bg-gradient-to-br from-slate-50 via-white to-emerald-50"}`}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(212, 225, 87, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(212, 225, 87, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating Orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 100 * (i + 1), 0],
            y: [0, -50 * (i + 1), 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
          className={`absolute w-96 h-96 rounded-full blur-3xl opacity-10 ${
            i % 2 === 0
              ? isDarkMode
                ? "bg-[#d4e157]"
                : "bg-emerald-400"
              : isDarkMode
                ? "bg-[#06b6d4]"
                : "bg-cyan-400"
          } ${i === 0 ? "top-20 left-20" : i === 1 ? "bottom-20 right-20" : "top-1/2 left-1/2"}`}
        />
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-3 px-5 md:px-8 py-3 rounded-full mb-6 md:mb-8 backdrop-blur-xl border ${
              isDarkMode
                ? "bg-gradient-to-r from-[#d4e157]/20 to-[#06b6d4]/20 border-[#d4e157]/30"
                : "bg-gradient-to-r from-emerald-100/50 to-cyan-100/50 border-emerald-300"
            } shadow-xl`}
          >
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
              }`}
            >
              <FaAward
                className={`text-sm md:text-lg ${
                  isDarkMode ? "text-[#0a0e27]" : "text-white"
                }`}
              />
            </div>

            <span
              className={`text-xs md:text-sm font-bold uppercase tracking-wider ${
                isDarkMode ? "text-[#d4e157]" : "text-emerald-700"
              }`}
            >
              Awards & Recognition
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
             className={`font-black leading-tight mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
          >
            Innovation for Business{" "}
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDarkMode
                  ? "from-[#d4e157] via-[#06b6d4] to-[#d4e157]"
                  : "from-emerald-500 via-cyan-600 to-emerald-500"
              }`}
            >
              Growth with BluConnet
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className={`text-base md:text-xl max-w-3xl mx-auto px-2 md:px-0 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </motion.p>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left - Trophy Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-4 relative"
          >
            <div className="relative group">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157]/40 to-[#06b6d4]/40"
                    : "from-emerald-400/40 to-cyan-400/40"
                } rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500`}
              ></div>

              <div
                className={`relative ${
                  isDarkMode ? "bg-[#0f1535]/80" : "bg-white/80"
                } backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 border ${
                  isDarkMode ? "border-white/20" : "border-gray-200"
                } shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
              >
                {/* Trophy Image - Responsive max height */}
                <img
                  src={statsImage}
                  alt="Award Trophy"
                  className="w-full h-auto object-contain max-h-[260px] sm:max-h-[320px] md:max-h-[380px] lg:max-h-[450px] drop-shadow-2xl mx-auto"
                />

                {/* Awards Badge - Smaller on mobile, bigger on desktop */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className={`absolute top-1 right-1 sm:top-2 sm:right-2 md:top-3 md:right-3 lg:-top-4 lg:-right-4 ${
                    isDarkMode ? "bg-[#0f1535]" : "bg-white"
                  } backdrop-blur-xl border ${
                    isDarkMode ? "border-[#d4e157]/30" : "border-emerald-200"
                  } rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 shadow-2xl`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-md sm:rounded-lg md:rounded-xl bg-gradient-to-br ${
                        isDarkMode
                          ? "from-[#d4e157] to-[#06b6d4]"
                          : "from-emerald-500 to-cyan-600"
                      } flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <FaTrophy className="text-white text-xs sm:text-sm md:text-base lg:text-2xl" />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`font-black text-base sm:text-lg md:text-xl lg:text-2xl ${
                          isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                        }`}
                      >
                        30+
                      </div>
                      <div
                        className={`text-[9px] sm:text-[10px] md:text-xs font-semibold ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        } whitespace-nowrap`}
                      >
                        Awards Won
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right - Awards List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="lg:col-span-8"
          >
            <div className="space-y-3 sm:space-y-4">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`relative rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden group ${
                    activeIndex === index
                      ? isDarkMode
                        ? "bg-gradient-to-r from-[#d4e157]/30 via-[#06b6d4]/20 to-[#d4e157]/30 border border-[#d4e157]/50 shadow-[0_0_40px_rgba(212,225,87,0.3)]"
                        : "bg-gradient-to-r from-emerald-400/20 via-cyan-400/20 to-emerald-400/20 border border-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                      : isDarkMode
                        ? "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
                        : "bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-emerald-200 hover:shadow-xl"
                  }`}
                >
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1 min-w-0">
                        <div
                          className={`text-sm sm:text-base md:text-lg font-bold flex-shrink-0 ${
                            isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                          } group-hover:scale-110 transition-transform`}
                        >
                          {award.year}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-sm sm:text-base md:text-lg font-bold mb-1 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            } truncate sm:truncate md:whitespace-normal`}
                          >
                            {award.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <span
                          className={`text-xs sm:text-sm font-semibold hidden sm:inline ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {award.category}
                        </span>
                        <motion.div
                          animate={{ rotate: activeIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={
                            isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                          }
                        >
                          <FaChevronDown className="text-xs sm:text-sm" />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p
                            className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${
                              isDarkMode
                                ? "border-white/10 text-gray-400"
                                : "border-gray-200 text-gray-600"
                            } text-xs sm:text-sm md:text-base`}
                          >
                            {award.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mouse Follow Badge - Now visible on ALL devices */}
                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.3 }}
                          className="absolute pointer-events-none z-10"
                          style={{
                            left: smoothX,
                            top: smoothY,
                            transform:
                              window.innerWidth < 640
                                ? "translate(-30%, -30%) scale(0.65)"
                                : "translate(-50%, -50%)",
                          }}
                        >
                          <AwardBadge />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      {/* Bottom Stats Section */}
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, delay: 1 }}
  className={`mt-12 sm:mt-16 lg:mt-20
    grid grid-cols-2 md:grid-cols-4
    gap-5 md:gap-6
    px-5 sm:px-7 lg:px-10
    py-8 sm:py-9 lg:py-10
    rounded-2xl lg:rounded-3xl
    ${
      isDarkMode
        ? "bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl"
        : "bg-gradient-to-br from-gray-50 to-white border border-gray-200 backdrop-blur-xl shadow-2xl"
    }`}
>
  {[
    {
      icon: FaTrophy,
      num: "30+",
      label: "Awards Won",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FaStar,
      num: "50+",
      label: "Nominations",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaMedal,
      num: "150+",
      label: "Countries",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: FaAward,
      num: "98%",
      label: "Success Rate",
      color: "from-green-500 to-emerald-500",
    },
  ].map((stat, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 1.1 + index * 0.1 }}
      whileHover={{
        scale: 1.05,
        y: window.innerWidth >= 1024 ? -10 : -5,
      }}
      className="text-center group cursor-pointer"
    >
      {/* Icon */}
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20
          mx-auto rounded-xl lg:rounded-2xl
          bg-gradient-to-br ${stat.color}
          flex items-center justify-center
          mb-3 lg:mb-4
          shadow-lg group-hover:shadow-2xl
          transition-all duration-300
          group-hover:rotate-12`}
      >
        <stat.icon className="text-white text-xl sm:text-2xl lg:text-3xl" />
      </div>

      {/* Number */}
      <div
        className={`text-2xl sm:text-3xl lg:text-4xl font-black mb-1 lg:mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {stat.num}
      </div>

      {/* Label */}
      <div
        className={`text-[11px] sm:text-xs lg:text-sm font-semibold leading-tight ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {stat.label}
      </div>
    </motion.div>
  ))}
</motion.div>
      </div>
    </section>
  );
};

export default AwardsSection;
