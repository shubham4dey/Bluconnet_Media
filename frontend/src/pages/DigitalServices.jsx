import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaEnvelope,
  FaFilter,
  FaPenNib,
  FaUsers,
  FaCode,
  FaShareAlt,
  FaDesktop,
  FaSearch,
  FaShoppingCart,
  FaPalette,
  FaChartBar,
  FaMobileAlt,
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";

/* =========================================================
   3D HOLOGRAPHIC SERVICE CARD
========================================================= */

const HolographicCard = ({
  service,
  index,
  isDarkMode,
  onNavigate,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  const Icon = service.icon;

  /* =======================================================
     MOUSE 3D TILT
  ======================================================= */

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width - 0.5) * 2;

    const y =
      ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setMouse({
      x,
      y,
    });
  };

  const handleMouseLeave = () => {
    setMouse({
      x: 0,
      y: 0,
    });

    setIsHovered(false);
  };

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 45,
        scale: 0.94,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.045,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onNavigate(service.path)}
      className="group relative cursor-pointer"
      style={{
        perspective: "1200px",
      }}
    >
      {/* =====================================================
          OUTER 3D SHADOW
      ===================================================== */}

      <div
        className={`absolute inset-x-4 bottom-[-12px] h-12 rounded-full bg-gradient-to-r ${service.gradient} opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-30`}
      />

      {/* =====================================================
          3D CARD WRAPPER
      ===================================================== */}

      <div
        className="relative transition-transform duration-150"
        style={{
          transformStyle: "preserve-3d",
          transform: `
            rotateX(${mouse.y * -5}deg)
            rotateY(${mouse.x * 6}deg)
            translateY(${isHovered ? "-8px" : "0px"})
          `,
        }}
      >
        {/* ===================================================
            BACK PRISM
        =================================================== */}

        <div
          className={`absolute inset-0 translate-x-[10px] translate-y-[10px] rounded-[30px] bg-gradient-to-br ${service.gradient} opacity-25`}
          style={{
            transform: "translateZ(-25px)",
          }}
        />

        {/* ===================================================
            SECOND PRISM
        =================================================== */}

        <div
          className={`absolute inset-0 translate-x-[5px] translate-y-[5px] rounded-[30px] bg-gradient-to-br ${service.gradient} opacity-40`}
          style={{
            transform: "translateZ(-12px)",
          }}
        />

        {/* ===================================================
            MAIN HOLOGRAPHIC CARD
        =================================================== */}

        <div
          className={`relative min-h-[355px] overflow-hidden rounded-[30px] border transition-all duration-500 ${
            isDarkMode
              ? "border-white/[0.10] bg-[#0b111c]/95"
              : "border-white bg-white/95"
          }`}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: isDarkMode
              ? "0 25px 70px rgba(0,0,0,0.32)"
              : "0 25px 70px rgba(15,23,42,0.10)",
          }}
        >
          {/* =================================================
              HOLOGRAPHIC GRADIENT BACKGROUND
          ================================================= */}

          <div
            className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-[0.025] transition-opacity duration-500 group-hover:opacity-[0.08]`}
          />

          {/* =================================================
              TOP NEON LINE
          ================================================= */}

          <div
            className={`absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r ${service.gradient}`}
          />

          {/* =================================================
              GLOW ORB
          ================================================= */}

          <div
            className={`absolute -right-20 -top-20 h-48 w-48 rounded-full ${service.glow} opacity-[0.06] blur-[55px] transition-all duration-700 group-hover:scale-[1.5] group-hover:opacity-[0.18]`}
          />

          <div
            className={`absolute -bottom-20 -left-20 h-40 w-40 rounded-full ${service.glow} opacity-[0.04] blur-[50px] transition-all duration-700 group-hover:scale-[1.4] group-hover:opacity-[0.15]`}
          />

          {/* =================================================
              HOLOGRAPHIC GRID
          ================================================= */}

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(100,116,139,0.5) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(100,116,139,0.5) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "26px 26px",
            }}
          />

          {/* =================================================
              HUGE BACKGROUND NUMBER
          ================================================= */}

          <div
            className={`pointer-events-none absolute right-[-5px] top-[60px] select-none text-[110px] font-black leading-none tracking-[-0.12em] ${
              isDarkMode
                ? "text-white/[0.025]"
                : "text-slate-900/[0.035]"
            }`}
            style={{
              transform: `
                translateZ(-5px)
                translateX(${mouse.x * 8}px)
                translateY(${mouse.y * 5}px)
              `,
            }}
          >
            {service.id}
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="relative z-10 flex min-h-[355px] flex-col p-6 md:p-7">
            {/* ===============================================
                TOP ROW
            =============================================== */}

            <div className="flex items-start justify-between">
              {/* =============================================
                  FLOATING HOLOGRAM ICON
              ============================================= */}

              <motion.div
                animate={{
                  y: isHovered
                    ? [0, -5, 0]
                    : [0, -3, 0],

                  rotateZ: isHovered
                    ? [0, 3, -3, 0]
                    : 0,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Orbital Ring */}

                <div
                  className={`absolute -inset-2 rounded-[20px] border border-dashed ${
                    isDarkMode
                      ? "border-white/[0.12]"
                      : "border-slate-300/50"
                  }`}
                  style={{
                    transform:
                      "rotateX(60deg) rotateZ(20deg)",
                  }}
                />

                {/* Glow */}

                <div
                  className={`absolute inset-[-12px] rounded-full ${service.glow} opacity-20 blur-xl`}
                />

                {/* Icon depth */}

                <div
                  className={`absolute inset-0 translate-x-[5px] translate-y-[6px] rounded-[18px] bg-gradient-to-br ${service.gradient} opacity-40`}
                  style={{
                    transform: "translateZ(-15px)",
                  }}
                />

                {/* Icon body */}

                <div
                  className={`relative flex h-[62px] w-[62px] items-center justify-center rounded-[18px] border shadow-[0_15px_30px_rgba(15,23,42,0.12)] ${
                    isDarkMode
                      ? `${service.softDark} border-white/[0.10]`
                      : `${service.softBg} border-white`
                  }`}
                  style={{
                    transform: `
                      translateZ(30px)
                      translateX(${mouse.x * 3}px)
                      translateY(${mouse.y * 3}px)
                    `,
                  }}
                >
                  {/* Shine */}

                  <div className="absolute inset-x-3 top-1 h-1/2 rounded-full bg-white/30 blur-md" />

                  <Icon
                    className={`relative z-10 text-[22px] ${
                      isDarkMode
                        ? service.iconDark
                        : service.iconColor
                    }`}
                  />
                </div>
              </motion.div>

              {/* =============================================
                  SMALL NUMBER CHIP
              ============================================= */}

              <div
                className={`rounded-full border px-3 py-1.5 text-[10px] font-black tracking-[0.18em] ${
                  isDarkMode
                    ? "border-white/[0.08] bg-white/[0.025] text-slate-500"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                SERVICE {service.id}
              </div>
            </div>

            {/* ===============================================
                HOLOGRAPHIC DIVIDER
            =============================================== */}

            <div className="mt-8 flex items-center gap-2">
              <div
                className={`h-[1px] flex-1 bg-gradient-to-r ${service.gradient} opacity-30`}
              />

              <div
                className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${service.gradient}`}
              />

              <div
                className={`h-[1px] w-8 bg-gradient-to-r ${service.gradient} opacity-20`}
              />
            </div>

            {/* ===============================================
                TITLE + DESCRIPTION
            =============================================== */}

            <div
              className="mt-6"
              style={{
                transform: `
                  translateZ(18px)
                  translateX(${mouse.x * 2}px)
                  translateY(${mouse.y * 2}px)
                `,
              }}
            >
              <h2
                className={`text-[19px] font-black leading-[1.25] tracking-[-0.02em] transition-all duration-300 ${
                  isDarkMode
                    ? "text-white group-hover:text-[#d4e157]"
                    : "text-[#07172f] group-hover:text-emerald-600"
                }`}
              >
                {service.title}
              </h2>

              <p
                className={`mt-3 max-w-[290px] text-[12px] leading-[1.7] ${
                  isDarkMode
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                {service.description}
              </p>
            </div>

            {/* ===============================================
                FLEX SPACER
            =============================================== */}

            <div className="flex-1" />

            {/* ===============================================
                BOTTOM CONNECTION
            =============================================== */}

            <div className="mt-7">
              <div
                className={`flex items-center justify-between border-t pt-4 ${
                  isDarkMode
                    ? "border-white/[0.07]"
                    : "border-slate-200"
                }`}
              >
                {/* Left */}

                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${service.gradient}`}
                  />

                  <span
                    className={`text-[9px] font-black uppercase tracking-[0.18em] ${
                      isDarkMode
                        ? "text-slate-500"
                        : "text-slate-500"
                    }`}
                  >
                    Explore Service
                  </span>
                </div>

                {/* Right */}

                <motion.div
                  animate={{
                    x: isHovered ? 5 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="relative"
                >
                  {/* Button glow */}

                  <div
                    className={`absolute inset-[-5px] rounded-full bg-gradient-to-r ${service.gradient} opacity-20 blur-md`}
                  />

                  {/* Button */}

                  <div
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${service.gradient} text-white shadow-lg`}
                  >
                    <FaArrowRight className="text-[11px]" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* =================================================
              NO HOVER LIGHT SWEEP HERE
              Removed intentionally.
          ================================================= */}

          {/* =================================================
              CORNER ENERGY LINE
          ================================================= */}

          <div
            className={`absolute bottom-0 right-0 h-[3px] w-24 rounded-l-full bg-gradient-to-r ${service.gradient} opacity-60 transition-all duration-500 group-hover:w-40 group-hover:opacity-100`}
          />

          {/* =================================================
              LEFT ENERGY LINE
          ================================================= */}

          <div
            className={`absolute bottom-6 left-0 top-24 w-[2px] rounded-full bg-gradient-to-b ${service.gradient} opacity-40 transition-all duration-500 group-hover:opacity-100`}
          />
        </div>
      </div>
    </motion.article>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const DigitalServices = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  /* =========================================================
     12 DIGITAL SERVICES
  ========================================================= */

  const services = [
    {
      id: "01",
      title: "Email Marketing",
      description:
        "Build stronger customer relationships with targeted email campaigns, automation, and performance-focused messaging.",
      icon: FaEnvelope,
      path: "/services/email",
      gradient:
        "from-emerald-400 via-teal-400 to-cyan-500",
      glow: "bg-emerald-400",
      iconColor: "text-emerald-600",
      iconDark: "text-emerald-300",
      softBg: "bg-emerald-50",
      softDark: "bg-emerald-400/10",
    },

    {
      id: "02",
      title: "Lead Generation",
      description:
        "Attract and convert high-quality leads through targeted campaigns, optimized funnels, and measurable strategies.",
      icon: FaFilter,
      path: "/services/lead",
      gradient:
        "from-blue-400 via-sky-400 to-cyan-500",
      glow: "bg-blue-400",
      iconColor: "text-blue-600",
      iconDark: "text-blue-300",
      softBg: "bg-blue-50",
      softDark: "bg-blue-400/10",
    },

    {
      id: "03",
      title: "Content Marketing",
      description:
        "Create valuable content that engages your audience, builds trust, and drives meaningful business results.",
      icon: FaPenNib,
      path: "/services/content",
      gradient:
        "from-orange-400 via-amber-400 to-yellow-500",
      glow: "bg-orange-400",
      iconColor: "text-orange-600",
      iconDark: "text-orange-300",
      softBg: "bg-orange-50",
      softDark: "bg-orange-400/10",
    },

    {
      id: "04",
      title: "Affiliate Marketing",
      description:
        "Expand your reach with performance-based affiliate campaigns designed around measurable growth and conversions.",
      icon: FaUsers,
      path: "/services/affiliate",
      gradient:
        "from-purple-400 via-fuchsia-400 to-pink-500",
      glow: "bg-purple-400",
      iconColor: "text-purple-600",
      iconDark: "text-purple-300",
      softBg: "bg-purple-50",
      softDark: "bg-purple-400/10",
    },

    {
      id: "05",
      title: "HTML & Web App",
      description:
        "Build scalable web applications with modern technologies, clean architecture, and performance-focused development.",
      icon: FaCode,
      path: "/services/html",
      gradient:
        "from-cyan-400 via-sky-400 to-blue-500",
      glow: "bg-cyan-400",
      iconColor: "text-cyan-600",
      iconDark: "text-cyan-300",
      softBg: "bg-cyan-50",
      softDark: "bg-cyan-400/10",
    },

    {
      id: "06",
      title: "Social Media Marketing",
      description:
        "Grow your brand across social platforms with creative strategies, engaging campaigns, and consistent storytelling.",
      icon: FaShareAlt,
      path: "/services/social",
      gradient:
        "from-emerald-400 via-green-400 to-teal-500",
      glow: "bg-emerald-400",
      iconColor: "text-emerald-600",
      iconDark: "text-emerald-300",
      softBg: "bg-emerald-50",
      softDark: "bg-emerald-400/10",
    },

    {
      id: "07",
      title: "Web Design & Development",
      description:
        "Create stunning, responsive websites that deliver great user experiences and convert visitors into customers.",
      icon: FaDesktop,
      path: "/services/web",
      gradient:
        "from-indigo-400 via-blue-500 to-violet-500",
      glow: "bg-indigo-400",
      iconColor: "text-indigo-600",
      iconDark: "text-indigo-300",
      softBg: "bg-indigo-50",
      softDark: "bg-indigo-400/10",
    },

    {
      id: "08",
      title: "SEO Marketing",
      description:
        "Improve visibility, strengthen search rankings, and bring qualified organic traffic to your digital presence.",
      icon: FaSearch,
      path: "/services/seo",
      gradient:
        "from-yellow-400 via-amber-400 to-orange-500",
      glow: "bg-yellow-400",
      iconColor: "text-yellow-700",
      iconDark: "text-yellow-300",
      softBg: "bg-yellow-50",
      softDark: "bg-yellow-400/10",
    },

    {
      id: "09",
      title: "E-Commerce Marketing",
      description:
        "Drive online sales with conversion-focused campaigns, customer journeys, and growth strategies for your store.",
      icon: FaShoppingCart,
      path: "/services/ecommerce",
      gradient:
        "from-orange-400 via-amber-400 to-yellow-500",
      glow: "bg-orange-400",
      iconColor: "text-orange-600",
      iconDark: "text-orange-300",
      softBg: "bg-orange-50",
      softDark: "bg-orange-400/10",
    },

    {
      id: "10",
      title: "CRM & Graphic Designing",
      description:
        "Manage customer relationships while creating memorable visual assets that strengthen your brand identity.",
      icon: FaPalette,
      path: "/services/crm",
      gradient:
        "from-violet-400 via-purple-500 to-fuchsia-500",
      glow: "bg-violet-400",
      iconColor: "text-violet-600",
      iconDark: "text-violet-300",
      softBg: "bg-violet-50",
      softDark: "bg-violet-400/10",
    },

    {
      id: "11",
      title: "Data Analytics & Research",
      description:
        "Turn complex data into actionable insights that support smarter decisions, better targeting, and sustainable growth.",
      icon: FaChartBar,
      path: "/services/analytics",
      gradient:
        "from-green-400 via-emerald-400 to-teal-500",
      glow: "bg-green-400",
      iconColor: "text-green-600",
      iconDark: "text-green-300",
      softBg: "bg-green-50",
      softDark: "bg-green-400/10",
    },

    {
      id: "12",
      title: "Mobile Marketing",
      description:
        "Reach your audience on the go with mobile-first campaigns, personalized experiences, and performance strategies.",
      icon: FaMobileAlt,
      path: "/services/mobile",
      gradient:
        "from-sky-400 via-cyan-400 to-blue-500",
      glow: "bg-sky-400",
      iconColor: "text-sky-600",
      iconDark: "text-sky-300",
      softBg: "bg-sky-50",
      softDark: "bg-sky-400/10",
    },
  ];

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goToService = (path) => {
    navigate(path);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#05070b] text-white"
          : "bg-[#f7fbfa] text-[#07172f]"
      }`}
    >
      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Cyan glow */}

        <motion.div
          animate={{
            x: [0, 35, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full blur-[140px] ${
            isDarkMode
              ? "bg-cyan-500/[0.07]"
              : "bg-cyan-200/35"
          }`}
        />

        {/* Green glow */}

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -right-48 top-[20%] h-[650px] w-[650px] rounded-full blur-[140px] ${
            isDarkMode
              ? "bg-emerald-500/[0.06]"
              : "bg-emerald-200/30"
          }`}
        />

        {/* Purple glow */}

        <div
          className={`absolute -bottom-64 left-[30%] h-[600px] w-[600px] rounded-full blur-[150px] ${
            isDarkMode
              ? "bg-purple-500/[0.035]"
              : "bg-purple-200/20"
          }`}
        />

        {/* Dot grid */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              radial-gradient(
                circle,
                ${isDarkMode ? "#d4e157" : "#10b981"} 1px,
                transparent 1px
              )
            `,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Floating particle 1 */}

        <motion.span
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute left-[8%] top-[25%] h-2 w-2 rounded-full ${
            isDarkMode
              ? "bg-[#d4e157]"
              : "bg-emerald-400"
          }`}
        />

        {/* Floating particle 2 */}

        <motion.span
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[9%] top-[40%] h-2.5 w-2.5 rounded-full bg-cyan-400"
        />

        {/* Floating particle 3 */}

        <motion.span
          animate={{
            x: [0, 15, 0],
            opacity: [0.15, 0.7, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[20%] left-[13%] h-1.5 w-1.5 rounded-full bg-purple-400"
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative z-10 px-5 pb-24 pt-28 sm:px-8 sm:pt-32 md:px-10 md:pt-36 lg:px-12 lg:pt-40 xl:px-16">
        <div className="mx-auto max-w-[1420px]">

          {/* =================================================
              HEADER
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-14 text-center md:mb-16"
          >
            {/* Badge */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className={`mx-auto mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] sm:text-xs ${
                isDarkMode
                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span
                className={`h-2 w-2 animate-pulse rounded-full ${
                  isDarkMode
                    ? "bg-cyan-300"
                    : "bg-emerald-500"
                }`}
              />

              Digital Solutions
            </motion.div>

            {/* Heading */}

            <h1
              className={`text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl md:text-6xl lg:text-7xl ${
                isDarkMode
                  ? "text-white"
                  : "text-[#07172f]"
              }`}
            >
              OUR DIGITAL{" "}
              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode
                    ? "from-[#d4e157] via-emerald-400 to-cyan-400"
                    : "from-emerald-500 via-teal-500 to-cyan-600"
                }`}
              >
                SERVICES
              </span>
            </h1>

            {/* Decorative line */}

            <div className="mx-auto mt-7 flex items-center justify-center gap-2">
              <span
                className={`h-px w-16 ${
                  isDarkMode
                    ? "bg-cyan-400/30"
                    : "bg-cyan-200"
                }`}
              />

              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDarkMode
                    ? "bg-[#d4e157]"
                    : "bg-emerald-500"
                }`}
              />

              <span
                className={`h-px w-16 ${
                  isDarkMode
                    ? "bg-cyan-400/30"
                    : "bg-cyan-200"
                }`}
              />
            </div>

            {/* Subtitle */}

            <p
              className={`mx-auto mt-5 max-w-2xl text-sm leading-7 md:text-base ${
                isDarkMode
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              Strategy, technology, creativity, and
              performance solutions built to help your
              business grow.
            </p>
          </motion.div>

          {/* =================================================
              3D SERVICE GRID
          ================================================= */}

          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            style={{
              perspective: "1800px",
            }}
          >
            {services.map((service, index) => (
              <HolographicCard
                key={service.id}
                service={service}
                index={index}
                isDarkMode={isDarkMode}
                onNavigate={goToService}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DigitalServices;