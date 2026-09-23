import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaQuoteLeft,
  FaArrowRight,
  FaArrowLeft,
  FaStar,
  FaGoogle,
  FaFacebookF,
  FaExternalLinkAlt,
  FaHeart,
  FaPen,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Import client logos
import reebokLogo from "../assets/img/logo.png";
import swarovskiLogo from "../assets/img/logo.png";
import crocsLogo from "../assets/img/logo.png";
import redbubbleLogo from "../assets/img/logo.png";

/* =========================================================
   REVIEW LINKS
   ---------------------------------------------------------
   IMPORTANT:
   Replace these with your REAL review URLs.
   
   Google:
   Use your Google Business Profile "Write a review" link.
   
   Facebook:
   Use your Facebook Page review/recommendation link.
========================================================= */

const GOOGLE_REVIEW_URL = "YOUR_GOOGLE_REVIEW_LINK";
const FACEBOOK_REVIEW_URL = "YOUR_FACEBOOK_REVIEW_LINK";

const Testimonials = () => {
  const { isDarkMode } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* =========================================================
     TESTIMONIAL DATA
  ========================================================= */

  const testimonials = [
    {
      quote:
        "Our partnership with Acceleration Partners has been unbelievably valuable. Through Acceleration Partners' strategic recommendations and knowledge, the affiliate channel has become a high-performing digital marketing channel for Reebok. We cannot say enough good things about everyone on the team.",
      company: "Reebok",
      logo: reebokLogo,
      position: "Global Marketing Director",
      rating: 5,
    },

    {
      quote:
        "Acceleration Partners' excellent strategic support and strong local resources have significantly contributed in the growth of our global affiliate program. The team is sharp, hard-working and regularly reviews operational effectiveness to improve processes and performance.",
      company: "Swarovski",
      logo: swarovskiLogo,
      position: "Head of Digital Marketing",
      rating: 5,
    },

    {
      quote:
        "Acceleration Partners is a strong agency with good expertise, timely responses, and a strong knowledge of regional partners. Their dedication to understanding our market has been exceptional.",
      company: "Crocs",
      logo: crocsLogo,
      position: "E-commerce Manager",
      rating: 5,
    },

    {
      quote:
        "The team at Acceleration Partners has shown an enormous amount of passion for our brand and mission. Our check-in meetings often turn into brainstorming sessions where we bounce off ideas for new opportunities.",
      company: "Redbubble",
      logo: redbubbleLogo,
      position: "VP of Marketing",
      rating: 5,
    },
  ];

  /* =========================================================
     AUTO SLIDE
  ========================================================= */

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(
        (prev) =>
          (prev + 1) % testimonials.length
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const next = () => {
    setCurrentIndex(
      (prev) =>
        (prev + 1) % testimonials.length
    );
  };

  const prev = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + testimonials.length) %
        testimonials.length
    );
  };

  /* =========================================================
     REVIEW HANDLERS
  ========================================================= */

  const openGoogleReview = () => {
    if (
      !GOOGLE_REVIEW_URL ||
      GOOGLE_REVIEW_URL ===
        "YOUR_GOOGLE_REVIEW_LINK"
    ) {
      console.warn(
        "Please add your Google review URL in Testimonials.jsx"
      );
      return;
    }

    window.open(
      GOOGLE_REVIEW_URL,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openFacebookReview = () => {
    if (
      !FACEBOOK_REVIEW_URL ||
      FACEBOOK_REVIEW_URL ===
        "YOUR_FACEBOOK_REVIEW_LINK"
    ) {
      console.warn(
        "Please add your Facebook review URL in Testimonials.jsx"
      );
      return;
    }

    window.open(
      FACEBOOK_REVIEW_URL,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section
      className={`relative overflow-hidden py-20 md:py-28 px-4 transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#050508]"
          : "bg-white"
      }`}
    >
      {/* =====================================================
          BACKGROUND GLOWS
      ===================================================== */}

      <div
        className={`absolute top-1/4 left-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${
          isDarkMode
            ? "bg-[#d4e157]/10"
            : "bg-emerald-500/10"
        }`}
      />

      <div
        className={`absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${
          isDarkMode
            ? "bg-[#06b6d4]/10"
            : "bg-cyan-600/10"
        }`}
      />

      {/* =====================================================
          MOVING LIGHT
      ===================================================== */}

      <motion.div
        animate={{
          x: [0, 60, 0, -60, 0],
          y: [0, -20, 0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-[35%] left-[10%] w-2 h-2 rounded-full ${
          isDarkMode
            ? "bg-[#d4e157]/60"
            : "bg-emerald-500/60"
        }`}
      />

      <motion.div
        animate={{
          x: [0, -50, 0, 50, 0],
          y: [0, 25, 0, -25, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-[20%] right-[12%] w-2.5 h-2.5 rounded-full ${
          isDarkMode
            ? "bg-[#06b6d4]/60"
            : "bg-cyan-500/60"
        }`}
      />

      {/* =====================================================
          GRID
      ===================================================== */}

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode
              ? "#d4e157"
              : "#10b981"
          } 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* =====================================================
          DECORATIVE GEOMETRY
      ===================================================== */}

      <motion.div
        animate={{
          rotate: [0, 5, 0, -5, 0],
          y: [0, -8, 0, 8, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-20 right-8 md:right-20 w-28 h-28 md:w-48 md:h-48 ${
          isDarkMode
            ? "opacity-10"
            : "opacity-20"
        } pointer-events-none`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${
            isDarkMode
              ? "text-[#d4e157]"
              : "text-emerald-500"
          }`}
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
      </motion.div>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ===================================================
            HEADER
        =================================================== */}

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
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mb-14 md:mb-16 flex flex-col items-center gap-4"
        >
          {/* Badge */}

          <motion.div
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
              duration: 0.6,
            }}
          >
            <div
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border border-[#d4e157]/30 text-[#d4e157]"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-700"
              }`}
            >
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isDarkMode
                      ? "bg-[#d4e157]"
                      : "bg-emerald-500"
                  }`}
                />

                <span
                  className={`absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75 ${
                    isDarkMode
                      ? "bg-[#d4e157]"
                      : "bg-emerald-500"
                  }`}
                />
              </div>

              <span className="text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider">
                CLIENT TESTIMONIALS
              </span>
            </div>
          </motion.div>

          {/* Heading */}

          <h2
            className={`font-black leading-tight text-center ${
              isDarkMode
                ? "text-white"
                : "text-gray-900"
            } text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`}
          >
            TAKE IT{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4]"
                  : "from-emerald-500 to-cyan-600"
              }`}
            >
              FROM THEM
            </span>
          </h2>

          {/* Small description */}

          <p
            className={`max-w-2xl text-center text-sm md:text-base leading-7 ${
              isDarkMode
                ? "text-gray-500"
                : "text-gray-500"
            }`}
          >
            Real experiences from the brands and
            partners we've worked with.
          </p>
        </motion.div>

        {/* ===================================================
            TESTIMONIAL AREA
        =================================================== */}

        <div
          className="relative"
          onMouseEnter={() =>
            setIsPaused(true)
          }
          onMouseLeave={() =>
            setIsPaused(false)
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -30,
              }}
              transition={{
                duration: 0.55,
                ease: "easeInOut",
              }}
              className="grid lg:grid-cols-12 gap-5 lg:gap-7 items-stretch"
            >
              {/* =================================================
                  LEFT COMPANY CARD
              ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.15,
                }}
                className={`lg:col-span-4 min-h-[330px] lg:min-h-[360px] bg-gradient-to-br ${
                  isDarkMode
                    ? "from-[#0f1535] to-[#0a0e27] border-white/10"
                    : "from-white to-slate-50 border-gray-200"
                } border rounded-3xl p-6 md:p-8 relative overflow-hidden ${
                  isDarkMode
                    ? "shadow-black/40"
                    : "shadow-gray-200/70"
                } shadow-xl`}
              >
                {/* Glow */}

                <div
                  className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl ${
                    isDarkMode
                      ? "bg-[#d4e157]/10"
                      : "bg-emerald-500/10"
                  }`}
                />

                {/* Number */}

                <div className="relative z-10">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br ${
                        isDarkMode
                          ? "from-[#d4e157] to-[#06b6d4]"
                          : "from-emerald-500 to-cyan-600"
                      }`}
                    >
                      {String(
                        currentIndex + 1
                      ).padStart(2, "0")}
                    </span>

                    <span
                      className={`text-xl md:text-2xl font-bold ${
                        isDarkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      /
                      {String(
                        testimonials.length
                      ).padStart(2, "0")}
                    </span>
                  </div>

                  <div
                    className={`h-1 w-14 bg-gradient-to-r ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    } mt-3 rounded-full`}
                  />
                </div>

                {/* Logo */}

                <div className="relative z-10 flex justify-center mt-7 mb-6">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                    }}
                    className={`w-24 h-20 md:w-28 md:h-24 flex items-center justify-center ${
                      isDarkMode
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-gray-200"
                    } border rounded-2xl shadow-sm`}
                  >
                    <img
                      src={
                        testimonials[
                          currentIndex
                        ].logo
                      }
                      alt={`${testimonials[currentIndex].company} logo`}
                      className="max-h-14 md:max-h-16 w-auto object-contain"
                    />
                  </motion.div>
                </div>

                {/* Company */}

                <div className="relative z-10 text-center">
                  <div
                    className={`font-black text-xl md:text-2xl uppercase tracking-wide mb-1 ${
                      isDarkMode
                        ? "text-[#d4e157]"
                        : "text-emerald-600"
                    }`}
                  >
                    {
                      testimonials[
                        currentIndex
                      ].company
                    }
                  </div>

                  <div
                    className={`text-sm md:text-base mb-4 ${
                      isDarkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {
                      testimonials[
                        currentIndex
                      ].position
                    }
                  </div>

                  {/* Stars */}

                  <div className="flex justify-center gap-1">
                    {[
                      ...Array(
                        testimonials[
                          currentIndex
                        ].rating
                      ),
                    ].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          scale: 0,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          delay:
                            0.1 + i * 0.05,
                        }}
                      >
                        <FaStar
                          className={`w-4 h-4 ${
                            isDarkMode
                              ? "text-[#d4e157]"
                              : "text-emerald-500"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* =================================================
                  RIGHT QUOTE CARD
              ================================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.25,
                }}
                className={`lg:col-span-8 min-h-[330px] lg:min-h-[360px] bg-gradient-to-br ${
                  isDarkMode
                    ? "from-[#0f1535] to-[#0a0e27] border-white/10"
                    : "from-white to-slate-50 border-gray-200"
                } backdrop-blur-sm border rounded-3xl p-7 md:p-10 lg:p-14 relative overflow-hidden ${
                  isDarkMode
                    ? "shadow-black/40"
                    : "shadow-gray-200/70"
                } shadow-xl flex items-center`}
              >
                {/* Quote icon */}

                <div
                  className={`absolute top-6 left-6 ${
                    isDarkMode
                      ? "text-[#d4e157]/10"
                      : "text-emerald-500/10"
                  }`}
                >
                  <FaQuoteLeft className="w-16 h-16 md:w-24 md:h-24" />
                </div>

                {/* Glow */}

                <div
                  className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl ${
                    isDarkMode
                      ? "bg-[#06b6d4]/10"
                      : "bg-cyan-600/10"
                  }`}
                />

                {/* Quote */}

                <div className="relative z-10 w-full text-center">
                  <p
                    className={`text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-light italic ${
                      isDarkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                    }`}
                  >
                    "
                    {
                      testimonials[
                        currentIndex
                      ].quote
                    }
                    "
                  </p>

                  {/* Signature */}

                  <div className="mt-8 flex flex-col items-center gap-3">
                    <div
                      className={`h-0.5 w-16 bg-gradient-to-r ${
                        isDarkMode
                          ? "from-[#d4e157] to-transparent"
                          : "from-emerald-500 to-transparent"
                      }`}
                    />

                    <span
                      className={`text-xs uppercase tracking-[0.2em] font-semibold ${
                        isDarkMode
                          ? "text-gray-500"
                          : "text-gray-500"
                      }`}
                    >
                      CLIENT REVIEW
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* ===================================================
              BOTTOM NAVIGATION
          =================================================== */}

          <div className="mt-7 flex flex-col md:flex-row items-center justify-between gap-5">

            {/* Progress */}

            <div className="w-full md:w-auto flex items-center gap-3">
              <span
                className={`text-sm font-semibold ${
                  isDarkMode
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {String(
                  currentIndex + 1
                ).padStart(2, "0")}{" "}
                /{" "}
                {String(
                  testimonials.length
                ).padStart(2, "0")}
              </span>

              <div
                className={`flex-1 md:w-64 h-1 ${
                  isDarkMode
                    ? "bg-white/10"
                    : "bg-gray-200"
                } rounded-full overflow-hidden`}
              >
                <motion.div
                  key={currentIndex}
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${
                      ((currentIndex + 1) /
                        testimonials.length) *
                      100
                    }%`,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className={`h-full bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  }`}
                />
              </div>
            </div>

            {/* Navigation */}

            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={prev}
                whileHover={{
                  scale: 1.08,
                  x: -3,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                } flex items-center justify-center shadow-lg`}
                aria-label="Previous testimonial"
              >
                <FaArrowLeft
                  className={
                    isDarkMode
                      ? "text-[#0a0e27]"
                      : "text-white"
                  }
                />
              </motion.button>

              <motion.button
                type="button"
                onClick={next}
                whileHover={{
                  scale: 1.08,
                  x: 3,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                } flex items-center justify-center shadow-lg`}
                aria-label="Next testimonial"
              >
                <FaArrowRight
                  className={
                    isDarkMode
                      ? "text-[#0a0e27]"
                      : "text-white"
                  }
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* =====================================================
            WRITE A REVIEW SECTION
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mt-16 md:mt-20"
        >
          <div
            className={`relative overflow-hidden rounded-[28px] border ${
              isDarkMode
                ? "bg-gradient-to-br from-[#0f1535] via-[#0a0e27] to-[#07151c] border-white/10"
                : "bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 border-gray-200"
            } shadow-2xl`}
          >
            {/* =================================================
                DECORATIVE GLOWS
            ================================================= */}

            <div
              className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[90px] ${
                isDarkMode
                  ? "bg-[#d4e157]/10"
                  : "bg-emerald-400/15"
              }`}
            />

            <div
              className={`absolute -bottom-28 -right-20 w-80 h-80 rounded-full blur-[100px] ${
                isDarkMode
                  ? "bg-[#06b6d4]/10"
                  : "bg-cyan-400/15"
              }`}
            />

            {/* Decorative circles */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className={`absolute right-8 top-8 w-20 h-20 rounded-full border border-dashed ${
                isDarkMode
                  ? "border-[#d4e157]/15"
                  : "border-emerald-500/15"
              }`}
            />

            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className={`absolute left-10 bottom-8 w-14 h-14 rounded-full border ${
                isDarkMode
                  ? "border-[#06b6d4]/15"
                  : "border-cyan-500/15"
              }`}
            />

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="relative z-10 px-6 py-10 md:px-12 md:py-12 lg:px-16">

              <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">

                {/* LEFT */}

                <div>
                  {/* Mini badge */}

                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 ${
                      isDarkMode
                        ? "bg-[#d4e157]/10 border border-[#d4e157]/20"
                        : "bg-emerald-50 border border-emerald-200"
                    }`}
                  >
                    <FaHeart
                      size={11}
                      className={
                        isDarkMode
                          ? "text-[#d4e157]"
                          : "text-emerald-600"
                      }
                    />

                    <span
                      className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] ${
                        isDarkMode
                          ? "text-[#d4e157]"
                          : "text-emerald-700"
                      }`}
                    >
                      YOUR VOICE MATTERS
                    </span>
                  </div>

                  <h3
                    className={`text-2xl md:text-3xl lg:text-4xl font-black mb-3 ${
                      isDarkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Worked With Us?
                    <br />

                    <span
                      className={`text-transparent bg-clip-text bg-gradient-to-r ${
                        isDarkMode
                          ? "from-[#d4e157] to-[#06b6d4]"
                          : "from-emerald-500 to-cyan-600"
                      }`}
                    >
                      Tell Us About It.
                    </span>
                  </h3>

                  <p
                    className={`max-w-xl text-sm md:text-base leading-7 ${
                      isDarkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    Your feedback helps us improve,
                    build better experiences, and
                    continue delivering meaningful
                    results for our clients.
                  </p>
                </div>

                {/* =================================================
                    REVIEW BUTTONS
                ================================================= */}

                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">

                  {/* GOOGLE */}

                  <motion.button
                    type="button"
                    onClick={openGoogleReview}
                    whileHover={{
                      y: -4,
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className={`group relative min-w-[190px] flex items-center gap-4 px-5 py-4 rounded-2xl border text-left overflow-hidden ${
                      isDarkMode
                        ? "bg-white/[0.04] border-white/10 hover:border-[#d4e157]/30"
                        : "bg-white border-gray-200 hover:border-emerald-300"
                    } shadow-lg transition-all duration-300`}
                  >
                    {/* Hover glow */}

                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-[#d4e157]/10 to-transparent"
                          : "bg-gradient-to-r from-emerald-50 to-transparent"
                      }`}
                    />

                    <div
                      className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center ${
                        isDarkMode
                          ? "bg-white/10"
                          : "bg-gray-50"
                      }`}
                    >
                      <FaGoogle
                        size={19}
                        className={
                          isDarkMode
                            ? "text-[#d4e157]"
                            : "text-emerald-600"
                        }
                      />
                    </div>

                    <div className="relative z-10">
                      <div
                        className={`text-sm font-black ${
                          isDarkMode
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Review us on Google
                      </div>

                      <div
                        className={`flex items-center gap-1.5 mt-1 text-[10px] uppercase tracking-wider font-bold ${
                          isDarkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        <FaStar
                          size={8}
                          className={
                            isDarkMode
                              ? "text-[#d4e157]"
                              : "text-emerald-500"
                          }
                        />

                        Share your experience

                        <FaExternalLinkAlt
                          size={8}
                        />
                      </div>
                    </div>
                  </motion.button>

                  {/* FACEBOOK */}

                  <motion.button
                    type="button"
                    onClick={openFacebookReview}
                    whileHover={{
                      y: -4,
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className={`group relative min-w-[190px] flex items-center gap-4 px-5 py-4 rounded-2xl border text-left overflow-hidden ${
                      isDarkMode
                        ? "bg-white/[0.04] border-white/10 hover:border-[#06b6d4]/30"
                        : "bg-white border-gray-200 hover:border-cyan-300"
                    } shadow-lg transition-all duration-300`}
                  >
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-[#06b6d4]/10 to-transparent"
                          : "bg-gradient-to-r from-cyan-50 to-transparent"
                      }`}
                    />

                    <div
                      className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center ${
                        isDarkMode
                          ? "bg-white/10"
                          : "bg-gray-50"
                      }`}
                    >
                      <FaFacebookF
                        size={18}
                        className={
                          isDarkMode
                            ? "text-[#06b6d4]"
                            : "text-cyan-600"
                        }
                      />
                    </div>

                    <div className="relative z-10">
                      <div
                        className={`text-sm font-black ${
                          isDarkMode
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Recommend us on Facebook
                      </div>

                      <div
                        className={`flex items-center gap-1.5 mt-1 text-[10px] uppercase tracking-wider font-bold ${
                          isDarkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        <FaHeart
                          size={8}
                          className={
                            isDarkMode
                              ? "text-[#06b6d4]"
                              : "text-cyan-600"
                          }
                        />

                        Leave your feedback

                        <FaExternalLinkAlt
                          size={8}
                        />
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* =================================================
                  BOTTOM MICRO CTA
              ================================================= */}

              <div
                className={`mt-8 pt-5 border-t flex flex-wrap items-center justify-center md:justify-start gap-2 ${
                  isDarkMode
                    ? "border-white/10"
                    : "border-gray-200"
                }`}
              >
                <FaPen
                  size={10}
                  className={
                    isDarkMode
                      ? "text-[#d4e157]"
                      : "text-emerald-500"
                  }
                />

                <span
                  className={`text-[10px] sm:text-xs font-semibold ${
                    isDarkMode
                      ? "text-gray-500"
                      : "text-gray-500"
                  }`}
                >
                  A few words from you can make a
                  big difference to us.
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            TRUST FOOTER
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="mt-8 text-center"
        >
          <span
            className={`text-[10px] uppercase tracking-[0.25em] font-bold ${
              isDarkMode
                ? "text-gray-600"
                : "text-gray-400"
            }`}
          >
            TRUSTED • EXPERIENCED • CLIENT FOCUSED
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;