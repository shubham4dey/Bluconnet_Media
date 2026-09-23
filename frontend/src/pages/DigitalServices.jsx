import React from "react";
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
      gradient: "from-emerald-500 to-cyan-500",
      iconBg: isDarkMode
        ? "bg-emerald-400/10 text-emerald-300"
        : "bg-emerald-50 text-emerald-600",
    },

    {
      id: "02",
      title: "Lead Generation",
      description:
        "Attract and convert high-quality leads through targeted campaigns, optimized funnels, and measurable strategies.",
      icon: FaFilter,
      path: "/services/lead",
      gradient: "from-blue-500 to-cyan-500",
      iconBg: isDarkMode
        ? "bg-blue-400/10 text-blue-300"
        : "bg-blue-50 text-blue-600",
    },

    {
      id: "03",
      title: "Content Marketing",
      description:
        "Create valuable content that engages your audience, builds trust, and drives meaningful business results.",
      icon: FaPenNib,
      path: "/services/content",
      gradient: "from-orange-400 to-amber-500",
      iconBg: isDarkMode
        ? "bg-orange-400/10 text-orange-300"
        : "bg-orange-50 text-orange-600",
    },

    {
      id: "04",
      title: "Affiliate Marketing",
      description:
        "Expand your reach with performance-based affiliate campaigns designed around measurable growth and conversions.",
      icon: FaUsers,
      path: "/services/affiliate",
      gradient: "from-purple-500 to-pink-500",
      iconBg: isDarkMode
        ? "bg-purple-400/10 text-purple-300"
        : "bg-purple-50 text-purple-600",
    },

    {
      id: "05",
      title: "HTML & Web App",
      description:
        "Build scalable web applications with modern technologies, clean architecture, and performance-focused development.",
      icon: FaCode,
      path: "/services/html",
      gradient: "from-cyan-500 to-blue-500",
      iconBg: isDarkMode
        ? "bg-cyan-400/10 text-cyan-300"
        : "bg-cyan-50 text-cyan-600",
    },

    {
      id: "06",
      title: "Social Media Marketing",
      description:
        "Grow your brand across social platforms with creative strategies, engaging campaigns, and consistent storytelling.",
      icon: FaShareAlt,
      path: "/services/social",
      gradient: "from-emerald-500 to-teal-500",
      iconBg: isDarkMode
        ? "bg-teal-400/10 text-teal-300"
        : "bg-teal-50 text-teal-600",
    },

    {
      id: "07",
      title: "Web Design & Development",
      description:
        "Create stunning, responsive websites that deliver great user experiences and convert visitors into customers.",
      icon: FaDesktop,
      path: "/services/web",
      gradient: "from-blue-500 to-indigo-500",
      iconBg: isDarkMode
        ? "bg-indigo-400/10 text-indigo-300"
        : "bg-indigo-50 text-indigo-600",
    },

    {
      id: "08",
      title: "SEO Marketing",
      description:
        "Improve visibility, strengthen search rankings, and bring qualified organic traffic to your digital presence.",
      icon: FaSearch,
      path: "/services/seo",
      gradient: "from-orange-400 to-yellow-500",
      iconBg: isDarkMode
        ? "bg-yellow-400/10 text-yellow-300"
        : "bg-yellow-50 text-yellow-600",
    },

    {
      id: "09",
      title: "E-Commerce Marketing",
      description:
        "Drive online sales with conversion-focused campaigns, customer journeys, and growth strategies for your store.",
      icon: FaShoppingCart,
      path: "/services/ecommerce",
      gradient: "from-orange-400 to-amber-500",
      iconBg: isDarkMode
        ? "bg-amber-400/10 text-amber-300"
        : "bg-amber-50 text-amber-600",
    },

    {
      id: "10",
      title: "CRM & Graphic Designing",
      description:
        "Manage customer relationships while creating memorable visual assets that strengthen your brand identity.",
      icon: FaPalette,
      path: "/services/crm",
      gradient: "from-purple-500 to-violet-500",
      iconBg: isDarkMode
        ? "bg-violet-400/10 text-violet-300"
        : "bg-violet-50 text-violet-600",
    },

    {
      id: "11",
      title: "Data Analytics & Research",
      description:
        "Turn complex data into actionable insights that support smarter decisions, better targeting, and sustainable growth.",
      icon: FaChartBar,
      path: "/services/analytics",
      gradient: "from-emerald-500 to-green-500",
      iconBg: isDarkMode
        ? "bg-green-400/10 text-green-300"
        : "bg-green-50 text-green-600",
    },

    {
      id: "12",
      title: "Mobile Marketing",
      description:
        "Reach your audience on the go with mobile-first campaigns, personalized experiences, and performance strategies.",
      icon: FaMobileAlt,
      path: "/services/mobile",
      gradient: "from-cyan-500 to-blue-500",
      iconBg: isDarkMode
        ? "bg-cyan-400/10 text-cyan-300"
        : "bg-cyan-50 text-cyan-600",
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
     CARD ANIMATION
  ========================================================= */

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      scale: 0.97,
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#050508] text-white"
          : "bg-[#fbfffe] text-[#07172f]"
      }`}
    >
      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Left ambient glow */}

        <motion.div
          animate={{
            x: [0, 25, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[120px] ${
            isDarkMode
              ? "bg-emerald-400/[0.07]"
              : "bg-emerald-300/20"
          }`}
        />

        {/* Right ambient glow */}

        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -right-40 top-[30%] h-[500px] w-[500px] rounded-full blur-[120px] ${
            isDarkMode
              ? "bg-cyan-400/[0.07]"
              : "bg-cyan-300/20"
          }`}
        />

        {/* Bottom glow */}

        <div
          className={`absolute -bottom-48 left-[35%] h-[500px] w-[500px] rounded-full blur-[130px] ${
            isDarkMode
              ? "bg-emerald-500/[0.04]"
              : "bg-emerald-200/20"
          }`}
        />

        {/* Dot pattern */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle, ${
              isDarkMode ? "#d4e157" : "#10b981"
            } 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating dots */}

        <motion.span
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute left-[12%] top-[18%] h-2 w-2 rounded-full ${
            isDarkMode
              ? "bg-[#d4e157]"
              : "bg-emerald-400"
          }`}
        />

        <motion.span
          animate={{
            y: [0, 18, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute right-[13%] top-[42%] h-2.5 w-2.5 rounded-full ${
            isDarkMode
              ? "bg-[#06b6d4]"
              : "bg-cyan-400"
          }`}
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
          Extra top spacing for Navbar
      ===================================================== */}

      <section className="relative z-10 px-5 pb-16 pt-28 sm:px-8 sm:pt-32 md:pb-20 md:pt-36 lg:px-12 lg:pt-40 xl:px-16">

        <div className="mx-auto max-w-[1400px]">

          {/* =================================================
              PREMIUM PAGE HEADING
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-12 text-center md:mb-14"
          >
            {/* Small badge */}

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
                  ? "border-[#d4e157]/25 bg-[#d4e157]/10 text-[#d4e157]"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isDarkMode
                    ? "bg-[#d4e157]"
                    : "bg-emerald-500"
                }`}
              />

              What We Do
            </motion.div>

            {/* Main heading */}

            <h1
              className={`text-4xl font-black leading-[0.95] tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-7xl ${
                isDarkMode
                  ? "text-white"
                  : "text-[#07172f]"
              }`}
            >
              OUR DIGITAL{" "}
              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                SERVICES
              </span>
            </h1>

            {/* Decorative line */}

            <div className="mx-auto mt-6 flex items-center justify-center gap-3">
              <span
                className={`h-px w-12 sm:w-20 ${
                  isDarkMode
                    ? "bg-[#06b6d4]/30"
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
                className={`h-px w-12 sm:w-20 ${
                  isDarkMode
                    ? "bg-[#06b6d4]/30"
                    : "bg-cyan-200"
                }`}
              />
            </div>

            {/* Subtitle */}

            <p
              className={`mx-auto mt-5 max-w-2xl text-sm leading-7 md:text-base ${
                isDarkMode
                  ? "text-gray-500"
                  : "text-slate-500"
              }`}
            >
              Strategy, technology, creativity, and
              performance solutions built to help your
              business grow.
            </p>
          </motion.div>

          {/* =================================================
              12 SERVICE CARDS
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.article
                  key={service.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.12,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.055,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() =>
                    goToService(service.path)
                  }
                  whileHover={{
                    y: -8,
                  }}
                  className={`group relative min-h-[330px] cursor-pointer overflow-hidden rounded-[24px] border p-6 md:p-7 transition-all duration-500 ${
                    isDarkMode
                      ? "border-white/[0.08] bg-[#0b1020]/90 hover:border-white/[0.16] hover:bg-[#0e1427]"
                      : "border-slate-200/80 bg-white/90 hover:border-slate-300 hover:bg-white"
                  } backdrop-blur-xl ${
                    isDarkMode
                      ? "shadow-[0_20px_60px_rgba(0,0,0,0.22)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.4)]"
                      : "shadow-[0_15px_45px_rgba(15,23,42,0.06)] hover:shadow-[0_25px_60px_rgba(15,23,42,0.12)]"
                  }`}
                >
                  {/* =========================================
                      TOP GRADIENT LINE
                  ========================================= */}

                  <div
                    className={`absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r ${service.gradient} opacity-30 transition-all duration-500 group-hover:opacity-100`}
                  />

                  {/* =========================================
                      HOVER GLOW
                  ========================================= */}

                  <div
                    className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${service.gradient} opacity-0 blur-[70px] transition-opacity duration-700 group-hover:opacity-20`}
                  />

                  {/* =========================================
                      NUMBER + ICON
                  ========================================= */}

                  <div className="relative flex items-start justify-between">

                    <motion.div
                      whileHover={{
                        rotate: 5,
                        scale: 1.05,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${service.iconBg} border ${
                        isDarkMode
                          ? "border-white/[0.06]"
                          : "border-black/[0.03]"
                      }`}
                    >
                      <Icon className="text-xl" />
                    </motion.div>

                    <span
                      className={`text-[42px] font-black leading-none tracking-[-0.05em] transition-all duration-500 ${
                        isDarkMode
                          ? "text-white/[0.055] group-hover:text-white/[0.1]"
                          : "text-slate-900/[0.06] group-hover:text-slate-900/[0.1]"
                      }`}
                    >
                      {service.id}
                    </span>
                  </div>

                  {/* =========================================
                      DIVIDER
                  ========================================= */}

                  <div
                    className={`mt-7 h-px w-full ${
                      isDarkMode
                        ? "bg-white/[0.07]"
                        : "bg-slate-100"
                    }`}
                  />

                  {/* =========================================
                      CONTENT
                  ========================================= */}

                  <div className="relative mt-6">

                    <h2
                      className={`text-lg font-black leading-snug transition-colors duration-300 md:text-xl ${
                        isDarkMode
                          ? "text-white group-hover:text-[#d4e157]"
                          : "text-[#07172f] group-hover:text-emerald-600"
                      }`}
                    >
                      {service.title}
                    </h2>

                    <p
                      className={`mt-3 text-sm leading-6 ${
                        isDarkMode
                          ? "text-gray-500"
                          : "text-slate-500"
                      }`}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* =========================================
                      BOTTOM ACTION
                  ========================================= */}

                  <div className="absolute bottom-6 left-6 right-6 md:bottom-7 md:left-7 md:right-7">

                    <div
                      className={`flex items-center justify-between border-t pt-4 ${
                        isDarkMode
                          ? "border-white/[0.07]"
                          : "border-slate-100"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-black uppercase tracking-[0.18em] transition-colors duration-300 ${
                          isDarkMode
                            ? "text-gray-600 group-hover:text-[#06b6d4]"
                            : "text-slate-400 group-hover:text-cyan-600"
                        }`}
                      >
                        Explore Service
                      </span>

                      <motion.span
                        whileHover={{
                          x: 5,
                        }}
                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r ${service.gradient} text-white shadow-md`}
                      >
                        <FaArrowRight className="text-[11px]" />
                      </motion.span>
                    </div>
                  </div>

                  {/* =========================================
                      CORNER ACCENT
                  ========================================= */}

                  <div
                    className={`pointer-events-none absolute bottom-0 right-0 h-24 w-24 translate-x-12 translate-y-12 rounded-full bg-gradient-to-br ${service.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
                  />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DigitalServices;