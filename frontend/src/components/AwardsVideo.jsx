import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  animate,
} from "framer-motion";
import {
  FaAward,
  FaBullhorn,
  FaSearch,
  FaPenAlt,
  FaHandshake,
  FaShareAlt,
  FaChevronRight,
  FaChartLine,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const GROWTH_IMAGE =
  "https://res.cloudinary.com/r6av8t7e/image/upload/v1791287693/imgo_eoemlk.jpg";

const AWARDS = [
  {
    title: "Best Digital Marketing Agency",
    description:
      "Recognized for outstanding performance in digital marketing strategies and client results.",
    category: "Excellence",
    icon: FaBullhorn,
    gradient: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.35)",
  },
  {
    title: "Excellence in SEO Innovation",
    description:
      "Recognised for innovative SEO strategies and impactful organic growth.",
    category: "Innovation",
    icon: FaSearch,
    gradient: "from-cyan-500 to-sky-500",
    glow: "rgba(6,182,212,0.35)",
  },
  {
    title: "Best Content Marketing Campaign",
    description:
      "Recognised for creative, engaging and results-driven content marketing campaigns.",
    category: "Creative",
    icon: FaPenAlt,
    gradient: "from-violet-500 to-fuchsia-500",
    glow: "rgba(168,85,247,0.32)",
  },
  {
    title: "Client Satisfaction Award",
    description:
      "Recognised for delivering trusted solutions and maintaining strong client relationships.",
    category: "Trusted",
    icon: FaHandshake,
    gradient: "from-amber-400 to-orange-500",
    glow: "rgba(249,115,22,0.32)",
  },
  {
    title: "Top Social Media Agency",
    description:
      "Recognised for effective social media strategies, creative campaigns and audience engagement.",
    category: "Industry",
    icon: FaShareAlt,
    gradient: "from-rose-500 to-pink-500",
    glow: "rgba(244,63,94,0.32)",
  },
];

/* ------------------------------------------------------------------ */
/* Award Card                                                          */
/* ------------------------------------------------------------------ */

const AwardCard = ({
  award,
  index,
  enabled,
  isDarkMode,
  isTouchDevice,
  touchExpanded,
  onTouchToggle,
}) => {
  const cardRef = useRef(null);

  const touchStartRef = useRef({
    x: 0,
    y: 0,
    moved: false,
    wasExpanded: false,
  });

  const [hovered, setHovered] = useState(false);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const smoothGlowX = useSpring(glowX, {
    stiffness: 180,
    damping: 28,
    mass: 0.6,
  });

  const smoothGlowY = useSpring(glowY, {
    stiffness: 180,
    damping: 28,
    mass: 0.6,
  });

  const medalX = useSpring(glowX, {
    stiffness: 240,
    damping: 24,
    mass: 0.45,
  });

  const medalY = useSpring(glowY, {
    stiffness: 240,
    damping: 24,
    mass: 0.45,
  });

  const Icon = award.icon;

  const isExpanded = enabled && (isTouchDevice ? touchExpanded : hovered);

  /* ------------------------- Pointer position ---------------------- */

  const updatePointerPosition = (clientX, clientY) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    glowX.set(clientX - rect.left);
    glowY.set(clientY - rect.top);
  };

  /* ------------------------- Mouse events -------------------------- */

  const handleMouseMove = (e) => {
    if (!enabled || isTouchDevice) return;

    updatePointerPosition(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e) => {
    if (!enabled || isTouchDevice) return;

    setHovered(true);
    updatePointerPosition(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;

    setHovered(false);

    const rect = cardRef.current?.getBoundingClientRect();

    if (rect) {
      glowX.set(rect.width / 2);
      glowY.set(rect.height / 2);
    }
  };

  /* ------------------------- Touch events -------------------------- */

  const handleTouchStart = (e) => {
    if (!isTouchDevice || !enabled || !cardRef.current) return;

    const touch = e.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      moved: false,
      wasExpanded: isExpanded,
    };

    updatePointerPosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (!isTouchDevice || !enabled || !cardRef.current) return;

    const touch = e.touches[0];
    const start = touchStartRef.current;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
      start.moved = true;
    }

    // Keep the medal following the finger while the card is open.
    if (start.wasExpanded) {
      updatePointerPosition(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    if (!isTouchDevice || !enabled) return;

    const start = touchStartRef.current;

    // Dragging an already-open card must not close it.
    if (start.wasExpanded && start.moved) {
      start.moved = false;
      return;
    }

    // Scrolling must not accidentally toggle a card.
    if (start.moved) {
      start.moved = false;
      return;
    }

    // A simple tap opens or closes the selected card.
    onTouchToggle(index);

    start.moved = false;
  };

  const handleTouchCancel = () => {
    touchStartRef.current.moved = false;
    touchStartRef.current.wasExpanded = false;
  };

  return (
    <motion.article
      ref={cardRef}
      layout="position"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        opacity: { duration: 0.4, delay: 0.06 * index },
        y: {
          duration: 0.4,
          delay: 0.06 * index,
          ease: "easeOut",
        },
        layout: {
          type: "tween",
          duration: 0.36,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className={`group relative isolate overflow-hidden rounded-[24px] sm:rounded-[26px] border backdrop-blur-xl transition-[border-color,box-shadow] duration-300 ${
        isDarkMode
          ? "bg-white/[0.045] border-white/10 hover:border-white/25"
          : "bg-white/80 border-slate-200/80 hover:border-teal-300/70"
      }`}
      style={{
        boxShadow: isExpanded
          ? isDarkMode
            ? "0 18px 38px -24px rgba(6,182,212,0.45)"
            : "0 18px 38px -24px rgba(13,148,136,0.35)"
          : isDarkMode
            ? "0 12px 34px -22px rgba(0,0,0,0.85)"
            : "0 16px 40px -26px rgba(15,116,99,0.35)",

        // Drag the medal while expanded on touch devices.
        touchAction: isTouchDevice && isExpanded ? "none" : "pan-y",
      }}
    >
      {/* Cursor-following ambient glow */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          x: smoothGlowX,
          y: smoothGlowY,
          background: `radial-gradient(circle, ${award.glow} 0%, transparent 70%)`,
        }}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Floating award medal */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-gradient-to-br from-white/90 via-white/70 to-emerald-100/80 shadow-[0_8px_28px_rgba(13,148,136,0.28)] backdrop-blur-md"
        style={{
          x: medalX,
          y: medalY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={false}
        animate={{
          opacity: isExpanded ? 1 : 0,
          scale: isExpanded ? 1 : 0.55,
          rotate: isExpanded ? 0 : -24,
        }}
        transition={{
          opacity: { duration: isExpanded ? 0.2 : 0.14 },
          scale: {
            duration: 0.26,
            ease: [0.22, 1, 0.36, 1],
          },
          rotate: { duration: 0.28, ease: "easeOut" },
        }}
      >
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${award.gradient} shadow-inner`}
        >
          <FaAward className="text-lg text-white drop-shadow-sm" />
        </span>
      </motion.div>

      {/* Card content */}
      <div className="relative z-10 flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 lg:p-5">
        <div
          className={`flex h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${award.gradient} shadow-lg transition-transform duration-300 ease-out ${
            isExpanded ? "scale-[1.03]" : "scale-100"
          }`}
        >
          <Icon className="text-base sm:text-lg lg:text-xl text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`text-[13px] sm:text-sm lg:text-[15px] font-extrabold leading-snug tracking-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {award.title}
          </h3>

          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
              marginTop: isExpanded ? 5 : 0,
            }}
            transition={{
              height: {
                duration: 0.36,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: isExpanded ? 0.24 : 0.12,
                delay: isExpanded ? 0.04 : 0,
              },
              marginTop: {
                duration: 0.25,
                ease: "easeOut",
              },
            }}
            className="overflow-hidden"
            aria-hidden={!isExpanded}
          >
            <p
              className={`text-[11px] sm:text-xs lg:text-[13px] leading-relaxed ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {award.description}
            </p>
          </motion.div>

          {/* Category pill on mobile */}
          <span
            className={`mt-2 inline-flex rounded-full bg-gradient-to-r ${award.gradient} px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm sm:hidden`}
          >
            {award.category}
          </span>
        </div>

        {/* Category and arrow: arrow stays visible at every breakpoint */}
        <div className="flex shrink-0 flex-col items-end justify-center gap-2">
          <span
            className={`hidden sm:inline-flex rounded-full bg-gradient-to-r ${award.gradient} px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm lg:px-3.5`}
          >
            {award.category}
          </span>

          <span
            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
              isDarkMode
                ? "border-white/15 bg-white/5 text-slate-400 group-hover:border-teal-400/50 group-hover:text-teal-300"
                : "border-slate-200 bg-white text-slate-400 group-hover:border-teal-300 group-hover:text-teal-600"
            }`}
          >
            <motion.span
              animate={{ x: isExpanded ? 2 : 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <FaChevronRight className="text-[10px] sm:text-xs" />
            </motion.span>
          </span>
        </div>
      </div>
    </motion.article>
  );
};

/* ------------------------------------------------------------------ */
/* Awards & Recognition section                                       */
/* ------------------------------------------------------------------ */

const AwardsSection = () => {
  const { isDarkMode } = useTheme();

  const sectionRef = useRef(null);
  const sizeRef = useRef({ w: 1, h: 1 });

  const [hoveringSection, setHoveringSection] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Only one touch card can be open at a time.
  const [activeTouchIndex, setActiveTouchIndex] = useState(-1);

  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const hoverFactor = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 120,
    damping: 20,
    mass: 0.6,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 120,
    damping: 20,
    mass: 0.6,
  });

  /* ------------------------- Device detection ---------------------- */

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const touchQuery = window.matchMedia("(pointer: coarse)");

    const update = () => {
      setCanHover(hoverQuery.matches);

      // Hybrid laptops with a mouse retain desktop behaviour.
      setIsTouchDevice(touchQuery.matches && !hoverQuery.matches);
    };

    update();

    const subscribe = (query) => {
      if (query.addEventListener) {
        query.addEventListener("change", update);
      } else {
        query.addListener(update);
      }
    };

    const unsubscribe = (query) => {
      if (query.removeEventListener) {
        query.removeEventListener("change", update);
      } else {
        query.removeListener(update);
      }
    };

    subscribe(hoverQuery);
    subscribe(touchQuery);

    return () => {
      unsubscribe(hoverQuery);
      unsubscribe(touchQuery);
    };
  }, []);

  const interactive = canHover && !reduceMotion;
  const cardInteractive = !reduceMotion;

  const handleTouchToggle = (index) => {
    setActiveTouchIndex((currentIndex) =>
      currentIndex === index ? -1 : index,
    );
  };

  /* ------------------------- Section cursor effects ---------------- */

  const handleSectionMove = (e) => {
    if (!interactive || !sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();

    sizeRef.current = {
      w: rect.width,
      h: rect.height,
    };

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleSectionEnter = () => {
    if (!interactive) return;

    setHoveringSection(true);

    animate(hoverFactor, 1, {
      duration: 0.5,
      ease: "easeOut",
    });
  };

  const handleSectionLeave = () => {
    setHoveringSection(false);

    animate(hoverFactor, 0, {
      duration: 0.7,
      ease: "easeOut",
    });

    const rect = sectionRef.current?.getBoundingClientRect();

    if (rect) {
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    }
  };

  /* ------------------------- Image parallax ------------------------ */

  const imageX = useTransform(
    [smoothX, hoverFactor],
    ([value, factor]) => (value / (sizeRef.current.w || 1) - 0.5) * 26 * factor,
  );

  const imageY = useTransform(
    [smoothY, hoverFactor],
    ([value, factor]) => (value / (sizeRef.current.h || 1) - 0.5) * 16 * factor,
  );

  const innerX = useTransform(imageX, (v) => v * -0.55);
  const innerY = useTransform(imageY, (v) => v * -0.55);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMove}
      onMouseEnter={handleSectionEnter}
      onMouseLeave={handleSectionLeave}
      className={`relative overflow-hidden py-20 md:py-24 lg:py-28 px-4 sm:px-6 transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#050508]"
          : "bg-[linear-gradient(180deg,#ffffff_0%,#f7fcfa_45%,#ecf8f4_100%)]"
      }`}
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(45,212,191,0.22) 0%, transparent 70%)",
          }}
        />

        <div
          className="absolute -bottom-40 right-[-10%] h-[480px] w-[480px] rounded-full blur-3xl"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle, rgba(212,225,87,0.10) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(167,243,208,0.35) 0%, transparent 70%)",
          }}
        />

        <div
          className="absolute top-1/3 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background: isDarkMode
              ? "radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(204,251,241,0.55) 0%, transparent 70%)",
          }}
        />

        {/* Top decorative curves */}
        <svg
          className="absolute inset-x-0 top-0 h-64 w-full"
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M-40 180 C 260 40, 520 240, 800 130 S 1300 20, 1500 140"
            stroke={
              isDarkMode ? "rgba(6,182,212,0.22)" : "rgba(13,148,136,0.16)"
            }
            strokeWidth="1.5"
          />

          <path
            d="M-40 230 C 300 90, 560 280, 860 170 S 1340 70, 1500 190"
            stroke={
              isDarkMode ? "rgba(212,225,87,0.14)" : "rgba(45,212,191,0.14)"
            }
            strokeWidth="1.5"
          />
        </svg>

        {/* Bottom decorative curve */}
        <svg
          className="absolute inset-x-0 bottom-0 h-56 w-full"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M-40 60 C 300 200, 620 10, 940 120 S 1340 200, 1500 90"
            stroke={
              isDarkMode ? "rgba(6,182,212,0.16)" : "rgba(13,148,136,0.12)"
            }
            strokeWidth="1.5"
          />
        </svg>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(${
              isDarkMode ? "rgba(255,255,255,0.10)" : "rgba(13,148,136,0.14)"
            } 1px, transparent 1px)`,
            backgroundSize: "34px 34px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)",
          }}
        />

        {/* Desktop cursor-following glow */}
        <motion.div
          className="absolute"
          style={{ left: smoothX, top: smoothY }}
          animate={{
            opacity: hoveringSection && interactive ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div
            className="h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${
                isDarkMode ? "rgba(6,182,212,0.13)" : "rgba(45,212,191,0.20)"
              } 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14 lg:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className={`inline-flex items-center gap-2.5 rounded-full border px-4 sm:px-5 py-2 sm:py-2.5 backdrop-blur-xl ${
              isDarkMode
                ? "bg-white/5 border-white/15"
                : "bg-white/70 border-teal-200/80 shadow-[0_10px_30px_-18px_rgba(13,148,136,0.6)]"
            }`}
          >
            <span
              className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gradient-to-br ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4]"
                  : "from-teal-500 to-emerald-500"
              }`}
            >
              <FaAward
                className={`text-[11px] sm:text-xs ${
                  isDarkMode ? "text-[#0a0e27]" : "text-white"
                }`}
              />
            </span>

            <span
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] ${
                isDarkMode ? "text-[#d4e157]" : "text-teal-700"
              }`}
            >
              Awards &amp; Recognition
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className={`mt-5 md:mt-7 font-black leading-[1.08] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Innovation for Business
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDarkMode
                  ? "from-[#d4e157] via-[#06b6d4] to-[#d4e157]"
                  : "from-teal-500 via-cyan-600 to-emerald-500"
              }`}
            >
              Growth with BluConnet
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className={`mt-4 md:mt-5 mx-auto max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed ${
              isDarkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            From CPL and CPA campaigns to affiliate growth, we combine quality
            traffic, strategic optimisation and transparent partnerships to help
            business scale with measurable results.
          </motion.p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:gap-12 lg:grid-cols-[45fr_55fr]">
          {/* Left: business growth visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="relative"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[42px] blur-2xl opacity-70"
              style={{
                background: isDarkMode
                  ? "radial-gradient(circle at 30% 30%, rgba(6,182,212,0.25), transparent 65%)"
                  : "radial-gradient(circle at 30% 30%, rgba(45,212,191,0.35), transparent 65%)",
              }}
            />

            <motion.div
              style={{ x: imageX, y: imageY }}
              className={`relative h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[520px] overflow-hidden rounded-[26px] sm:rounded-[32px] border backdrop-blur-xl ${
                isDarkMode
                  ? "border-white/15 shadow-[0_40px_90px_-45px_rgba(6,182,212,0.7)]"
                  : "border-white/70 shadow-[0_40px_90px_-45px_rgba(13,148,136,0.75)]"
              }`}
            >
              <motion.img
                src={GROWTH_IMAGE}
                alt="BluConnet Media campaign performance dashboard showing CPL, CPA and affiliate growth analytics"
                loading="lazy"
                style={{ x: innerX, y: innerY }}
                className="absolute inset-0 h-full w-full scale-110 object-cover"
              />

              {/* Image contrast overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(160deg, rgba(5,5,8,0.25) 0%, transparent 45%, rgba(5,5,8,0.45) 100%)"
                    : "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 45%, rgba(8,47,73,0.18) 100%)",
                }}
              />

              {/* Campaign growth badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={`absolute bottom-4 left-4 sm:bottom-5 sm:left-5 flex items-center gap-2.5 rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-xl ${
                  isDarkMode
                    ? "bg-black/40 border-white/15"
                    : "bg-white/75 border-white/70"
                } shadow-xl`}
              >
                <span
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-teal-500 to-emerald-500"
                  }`}
                >
                  <FaChartLine
                    className={`text-xs sm:text-sm ${
                      isDarkMode ? "text-[#0a0e27]" : "text-white"
                    }`}
                  />
                </span>

                <span className="leading-tight">
                  <span
                    className={`block text-sm sm:text-base font-black ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    +278%
                  </span>

                  <span
                    className={`block text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Campaign Growth
                  </span>
                </span>
              </motion.div>

              {/* Awards badge */}
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className={`absolute right-4 top-4 sm:right-5 sm:top-5 flex items-center gap-2 rounded-full border px-3 sm:px-4 py-2 backdrop-blur-xl ${
                  isDarkMode
                    ? "bg-black/40 border-white/15"
                    : "bg-white/75 border-white/70"
                } shadow-xl`}
              >
                <FaAward
                  className={`text-[11px] transition-colors duration-300 ${
                    isDarkMode ? "text-[#d4e157]" : "text-teal-600"
                  }`}
                />

                <span
                  className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  30+ Awards Won
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: award cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: "easeOut",
            }}
            className="flex flex-col gap-3.5 sm:gap-4"
          >
            {AWARDS.map((award, index) => (
              <AwardCard
                key={award.title}
                award={award}
                index={index}
                enabled={cardInteractive}
                isDarkMode={isDarkMode}
                isTouchDevice={isTouchDevice}
                touchExpanded={activeTouchIndex === index}
                onTouchToggle={handleTouchToggle}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
