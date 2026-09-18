import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaStar,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import getThemeColors from "../utils/themeColors";
import { Link } from "react-router-dom";

// =========================================================
// SIGNUP LINKS
// =========================================================

const AFFILIATE_SIGNUP_URL = "https://bluconnet.affise.com/v2/sign/up";

const ADVERTISER_SIGNUP_URL = "https://bluconnet.affise.com/v2/sign/up";

// =========================================================
// TRUSTED COMPANIES
// =========================================================

const trustedCompanies = [
  {
    name: "Affise",
    logo: "https://res.cloudinary.com/wyixfdon/image/upload/v1786004101/affise-logo_g4dnxg.png",
  },
  {
    name: "Namecheap",
    logo: "https://res.cloudinary.com/wyixfdon/image/upload/v1786004095/namecheap-logo_jxewiq.webp",
  },
  {
    name: "Campaign",
    dayLogo:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1787912115/campaign-day_uxa4no.png",
    nightLogo:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1787912194/campaign-night_nzwyax.png",
  },
  {
    name: "Mindbaz",
    logo: "https://res.cloudinary.com/wyixfdon/image/upload/v1786004080/mindbaz-logo_hhaqsn.png",
  },
];

/* =========================================================
   CONTACT FORM API — the ONE existing endpoint: POST /api/contact
   (stores the enquiry in the MySQL `contacts` table).

   Same environment convention as pages/contact.jsx, so localhost
   is never used in a production build:
     .env             → REACT_APP_API_URL=http://localhost:5000/api
     .env.production  → REACT_APP_API_URL=https://bluconnet-backend-m2jl.onrender.com/api
   ========================================================= */

const RAW_API_URL = (
  process.env.REACT_APP_API_URL ||
  "https://bluconnet-backend-m2jl.onrender.com/api"
).replace(/\/+$/, "");

/* Accepts both ".../api" (project default) and a bare origin ("...:5000"). */
const API_BASE = /\/api$/.test(RAW_API_URL)
  ? RAW_API_URL
  : `${RAW_API_URL}/api`;

const CONTACT_ENDPOINT = `${API_BASE}/contact`;

const Hero = () => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(isDarkMode);

  const canvasRef = useRef(null);

  // =========================================================
  // FORM STATE
  // =========================================================

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    helpWith: "",
    country: "",
    message: "",
    hearAbout: "",
    agreeToContact: false,
  });

  // Pending-request flag — blocks duplicate submissions.
  const [submitting, setSubmitting] = useState(false);

  /* Synchronous mirror of `submitting`: state updates are async, so a
     double click could otherwise fire two POSTs before React re-renders. */
  const submittingRef = useRef(false);

  // In-page success feedback (replaces the old success alert()).
  const [showSuccess, setShowSuccess] = useState(false);

  // =========================================================
  // HERO TITLE
  // =========================================================

  const heroTitle = t("hero.title");

  const heroSplit = (() => {
    const i = heroTitle.indexOf(". ");

    if (i === -1) {
      return {
        first: heroTitle,
        second: "",
      };
    }

    return {
      first: heroTitle.slice(0, i + 1),
      second: heroTitle.slice(i + 2),
    };
  })();

  // =========================================================
  // FORM OPTIONS
  // =========================================================

  const helpOptions = [
    "Affiliate program management services",
    "Consulting / Project work",
    "Influencer program management",
    "360 partnership marketing services",
    "Business partnership opportunities",
    "Publisher or affiliate opportunities",
  ];

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Singapore",
    "UAE",
    "South Africa",
  ];

  const hearAboutOptions = [
    "LinkedIn",
    "Google Search",
    "Facebook",
    "Instagram",
    "YouTube",
    "X / Twitter",
    "Referral / Word of Mouth",
    "Email",
    "Event / Conference",
    "Partner / Affiliate",
    "Advertisement",
    "Blog / Website",
    "Other",
  ];

  // =========================================================
  // FORM HANDLER
  // =========================================================

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // A request is already in flight — ignore extra clicks/submits.
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          companyName: formData.companyName,
          helpWith: formData.helpWith,
          country: formData.country,
          message: formData.message,
          hearAbout: formData.hearAbout,
          agreeToContact: formData.agreeToContact,
          // Which form this enquiry came from (Admin Panel filtering).
          source: "hero",
        }),
      });

      // A non-2xx status (400 validation, 500 server/database) is NOT
      // a success — surface it instead of resetting the form.
      if (!response.ok) {
        let message = "Something went wrong. Please try again.";

        try {
          const errorBody = await response.json();

          if (errorBody && errorBody.message) {
            message = errorBody.message;
          }
        } catch (parseError) {
          /* Non-JSON error body — keep the generic message. */
        }

        throw new Error(message);
      }

      // HTTP 201 — the enquiry is stored in the MySQL `contacts` table.
      setShowSuccess(true);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        companyName: "",
        helpWith: "",
        country: "",
        message: "",
        hearAbout: "",
        agreeToContact: false,
      });
    } catch (error) {
      // Keep everything the visitor typed so nothing is lost on failure.
      alert(
        error && error.message
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // =========================================================
  // PARTICLE BACKGROUND
  // =========================================================

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let particles = [];

    const mouse = {
      x: null,
      y: null,
      radius: 150,
    };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles = [];

      const particleCount =
        window.innerWidth < 480 ? 15 : window.innerWidth < 768 ? 25 : 50;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();

      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particleColor = isDarkMode ? "212, 225, 87" : "16, 185, 129";

      const lineColor = isDarkMode ? "6, 182, 212" : "8, 145, 178";

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
        }

        // Draw particle

        ctx.beginPath();

        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(${particleColor}, 0.3)`;

        ctx.fill();

        // Connect nearby particles

        for (let j = index + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;

          const dy = particle.y - particles[j].y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();

            ctx.strokeStyle = `rgba(${lineColor}, ${
              0.15 * (1 - distance / 120)
            })`;

            ctx.lineWidth = 1;

            ctx.moveTo(particle.x, particle.y);

            ctx.lineTo(particles[j].x, particles[j].y);

            ctx.stroke();
          }
        }

        // Connect to mouse

        if (mouse.x !== null && mouse.y !== null) {
          const dx = particle.x - mouse.x;

          const dy = particle.y - mouse.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            ctx.beginPath();

            ctx.strokeStyle = `rgba(${lineColor}, ${
              0.3 * (1 - distance / mouse.radius)
            })`;

            ctx.lineWidth = 1.5;

            ctx.moveTo(particle.x, particle.y);

            ctx.lineTo(mouse.x, mouse.y);

            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    createParticles();
    drawParticles();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener("resize", handleResize);

    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener("resize", handleResize);

      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDarkMode]);

  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputClass = `
    w-full
    px-4
    py-3
    rounded-xl
    border
    ${colors.borderColor}
    ${colors.innerCardBg}
    ${colors.textColor}
    placeholder-gray-400
    text-sm
    outline-none
    transition-all
    duration-300
    focus:ring-2
    ${
      isDarkMode
        ? "focus:ring-[#06b6d4]/30 focus:border-[#06b6d4]"
        : "focus:ring-emerald-500/20 focus:border-emerald-500"
    }
  `;

  return (
    <section
      className={`
        relative
        min-h-[85vh]
        lg:min-h-screen
        flex
        items-center
        pt-32
        sm:pt-32
        md:pt-36
        lg:pt-36
        pb-12
        lg:pb-16
        px-4
        overflow-hidden
        ${colors.sectionBg}
      `}
    >
      {/* =====================================================
          CANVAS
      ===================================================== */}

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          w-full
          h-full
          pointer-events-none
        "
        style={{
          zIndex: 1,
        }}
      />

      {/* =====================================================
          DOT GRID
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          pointer-events-none
        "
        style={{
          backgroundImage: `radial-gradient(circle, ${colors.gridDotColor} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* =====================================================
          GLOW
      ===================================================== */}

      <div
        className={`
          absolute
          top-20
          left-1/4
          w-60
          h-60
          md:w-80
          md:h-80
          lg:w-96
          lg:h-96
          rounded-full
          blur-3xl
          pointer-events-none
          ${colors.glowLeft}
        `}
      />

      <div
        className={`
          absolute
          bottom-20
          right-1/4
          w-60
          h-60
          md:w-80
          md:h-80
          lg:w-96
          lg:h-96
          rounded-full
          blur-3xl
          pointer-events-none
          ${colors.glowRight}
        `}
      />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div
          className="
            grid
            lg:grid-cols-[0.9fr_1.1fr]
            gap-10
            lg:gap-14
            items-center
          "
        >
          {/* =================================================
              LEFT HERO
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="text-left"
          >
            {/* Badge */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className={`
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                mb-6
                shadow-md
                ${
                  isDarkMode
                    ? "bg-[#d4e157]/10 border border-[#d4e157]/30"
                    : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
                }
              `}
            >
              <span
                className={`
                  w-2
                  h-2
                  rounded-full
                  animate-pulse
                  ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"}
                `}
              />

              <span
                className={`
                  text-xs
                  font-extrabold
                  tracking-wider
                  uppercase
                  ${isDarkMode ? "text-[#d4e157]" : "text-emerald-700"}
                `}
              >
                #1 DIGITAL MARKETING AGENCY
              </span>
            </motion.div>

            {/* =================================================
                HEADING
            ================================================= */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.8,
              }}
              data-i18n-skip
              className={`
                text-4xl
                sm:text-5xl
                md:text-6xl
                lg:text-[4rem]
                xl:text-7xl
                font-extrabold
                leading-[1.08]
                ${isDarkMode ? "text-white" : "text-gray-900"}
              `}
            >
              <span>{heroSplit.first} </span>

              <span
                className={`
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  }
                `}
              >
                {heroSplit.second}
              </span>
            </motion.h1>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.8,
              }}
              className={`
                mt-6
                ${colors.textMuted}
                text-base
                md:text-lg
                leading-relaxed
                max-w-xl
              `}
            >
              We build intelligent digital solutions that transform businesses
              worldwide
            </motion.p>

            {/* =================================================
                AFFILIATE + ADVERTISER BUTTONS
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.6,
                duration: 0.8,
              }}
              className="
                mt-8
                flex
                flex-col
                sm:flex-row
                gap-4
              "
            >
              {/* Affiliate SignUp */}

              <motion.button
                type="button"
                onClick={() => {
                  window.open(
                    AFFILIATE_SIGNUP_URL,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                whileHover={{
                  scale: 1.05,
                  y: -4,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className={`
                  relative
                  overflow-hidden
                  group
                  w-full
                  sm:w-auto
                  px-8
                  py-4
                  bg-gradient-to-r
                  font-bold
                  rounded-lg
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  gap-2
                  ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                      : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                  }
                `}
              >
                <div
                  className="
                    absolute
                    inset-0
                    -translate-x-full
                    group-hover:translate-x-full
                    transition-transform
                    duration-1000
                    ease-in-out
                    bg-gradient-to-r
                    from-transparent
                    via-white/40
                    to-transparent
                    z-10
                  "
                />

                <span
                  className="
                    relative
                    z-20
                    flex
                    items-center
                    gap-2
                  "
                >
                  Affiliate SignUp
                  <FaArrowRight
                    className="
                      group-hover:translate-x-1
                      transition-transform
                      duration-300
                    "
                  />
                </span>
              </motion.button>

              {/* Advertiser SignUp */}

              <motion.button
                type="button"
                onClick={() => {
                  window.open(
                    ADVERTISER_SIGNUP_URL,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                whileHover={{
                  scale: 1.05,
                  y: -4,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className={`
                  relative
                  overflow-hidden
                  group
                  w-full
                  sm:w-auto
                  px-8
                  py-4
                  ${colors.secondaryBtnBg}
                  border
                  ${colors.secondaryBtnBorder}
                  ${colors.secondaryBtnText}
                  font-bold
                  rounded-lg
                  transition-all
                  duration-300
                  flex
                  items-center
                  justify-center
                  gap-2
                  ${isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-200"}
                `}
              >
                <div
                  className="
                    absolute
                    inset-0
                    -translate-x-full
                    group-hover:translate-x-full
                    transition-transform
                    duration-1000
                    ease-in-out
                    bg-gradient-to-r
                    from-transparent
                    via-white/30
                    to-transparent
                    z-10
                  "
                />

                <span
                  className="
                    relative
                    z-20
                    flex
                    items-center
                    gap-2
                  "
                >
                  Advertiser SignUp
                  <FaArrowRight
                    className="
                      group-hover:translate-x-1
                      transition-transform
                      duration-300
                    "
                  />
                </span>
              </motion.button>
            </motion.div>

            {/* =================================================
                RATING
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
                duration: 0.8,
              }}
              className="
                mt-8
                flex
                items-center
                gap-3
              "
            >
              <div className="flex -space-x-2">
                <div
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-gradient-to-br
                    from-purple-400
                    to-pink-400
                    border-2
                    border-white
                    dark:border-[#0a0e27]
                    flex
                    items-center
                    justify-center
                    text-white
                    text-xs
                    font-bold
                  "
                >
                  JD
                </div>

                <div
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-gradient-to-br
                    from-blue-400
                    to-cyan-400
                    border-2
                    border-white
                    dark:border-[#0a0e27]
                    flex
                    items-center
                    justify-center
                    text-white
                    text-xs
                    font-bold
                  "
                >
                  SK
                </div>

                <div
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-gradient-to-br
                    from-yellow-400
                    to-orange-400
                    border-2
                    border-white
                    dark:border-[#0a0e27]
                    flex
                    items-center
                    justify-center
                    text-white
                    text-xs
                    font-bold
                  "
                >
                  MR
                </div>
              </div>

              <div className="flex items-center gap-1">
                <FaStar
                  className={
                    isDarkMode ? "text-yellow-400" : "text-emerald-500"
                  }
                />

                <span
                  className={`
                    ${colors.textColor}
                    font-bold
                  `}
                >
                  4.8
                </span>

                <span
                  className={`
                    ${colors.textMuted}
                    text-sm
                  `}
                >
                  (150K)
                </span>
              </div>
            </motion.div>

            {/* =================================================
                TRUSTED COMPANIES
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1,
                duration: 0.8,
              }}
              className="mt-10"
            >
              <p
                className={`
                  ${colors.textColor}
                  text-sm
                  mb-5
                  text-left
                  font-bold
                `}
              >
                Trusted by top companies
              </p>

              <div
                className="
                  grid
                  grid-cols-2
                  sm:flex
                  sm:flex-nowrap
                  justify-start
                  items-center
                  gap-6
                  sm:gap-8
                  md:gap-10
                "
              >
                {trustedCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="
                        flex
                        justify-start
                        sm:justify-start
                        w-full
                        sm:w-auto
                      "
                  >
                    <img
                      src={
                        company.nightLogo && isDarkMode
                          ? company.nightLogo
                          : company.logo || company.dayLogo
                      }
                      alt={company.name}
                      className={`
                          h-10
                          sm:h-11
                          md:h-12
                          lg:h-12
                          max-w-[150px]
                          sm:max-w-[160px]
                          md:max-w-[170px]
                          w-auto
                          object-contain
                          opacity-90
                          hover:opacity-100
                          transition-all
                          duration-300
                          ${
                            company.name === "Campaign" && isDarkMode
                              ? "scale-[1.1]"
                              : ""
                          }
                        `}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* =================================================
              RIGHT SIDE - CONTACT FORM
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.35,
              duration: 0.8,
            }}
            className="relative w-full"
          >
            {/* Outer Glow */}

            <div
              className={`
                absolute
                -inset-1
                rounded-[28px]
                blur-xl
                opacity-20
                ${
                  isDarkMode
                    ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]"
                    : "bg-gradient-to-r from-emerald-400 to-cyan-500"
                }
              `}
            />

            {/* Form Card */}

            <div
              className={`
                relative
                rounded-[26px]
                border
                ${colors.borderColor}
                ${isDarkMode ? "bg-[#0b1029]/90" : "bg-white/90"}
                backdrop-blur-2xl
                shadow-2xl
                p-5
                sm:p-6
                md:p-7
                overflow-hidden
              `}
            >
              {/* Decorative glow */}

              <div
                className={`
                  absolute
                  top-0
                  right-0
                  w-40
                  h-40
                  rounded-full
                  blur-3xl
                  pointer-events-none
                  ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-500/10"}
                `}
              />

              <div
                className={`
                  absolute
                  bottom-0
                  left-0
                  w-40
                  h-40
                  rounded-full
                  blur-3xl
                  pointer-events-none
                  ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"}
                `}
              />

              {/* =================================================
                  FORM HEADER
              ================================================= */}

              <div className="relative z-10 mb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 text-left">
                    <div
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                        mb-2
                        text-left
                        ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}
                      `}
                    >
                      <span
                        className={`
                          w-2
                          h-2
                          rounded-full
                          animate-pulse
                          ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"}
                        `}
                      />
                      Let's Connect
                    </div>

                    <h2
                      className={`
                        text-2xl
                        sm:text-3xl
                        font-extrabold
                        text-left
                        ${colors.textColor}
                      `}
                    >
                      Let's build something{" "}
                      <span
                        className={`
                          text-transparent
                          bg-clip-text
                          bg-gradient-to-r
                          ${
                            isDarkMode
                              ? "from-[#d4e157] to-[#06b6d4]"
                              : "from-emerald-500 to-cyan-600"
                          }
                        `}
                      >
                        great.
                      </span>
                    </h2>

                    <p
                      className={`
                        mt-2
                        text-xs
                        sm:text-sm
                        leading-relaxed
                        text-left
                        whitespace-nowrap
                        ${colors.textMuted}
                      `}
                    >
                      Tell us about your project and our team will get back to you within 24 hours.
                    </p>
                  </div>

                  <div
                    className={`
                      hidden
                      sm:flex
                      flex-shrink-0
                      items-center
                      gap-2
                      px-3
                      py-2
                      rounded-full
                      text-[10px]
                      font-bold
                      ${
                        isDarkMode
                          ? "bg-[#d4e157]/10 text-[#d4e157] border border-[#d4e157]/20"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }
                    `}
                  >
                    AI Powered
                  </div>
                </div>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                aria-busy={submitting}
                className="
                  relative
                  z-10
                  space-y-3
                "
              >
                {/* First + Last Name */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                  "
                >
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
                  />

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name *"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Email + Company */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                  "
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />

                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name *"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* =================================================
                    HELP WITH + COUNTRY
                ================================================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                  "
                >
                  {/* Help With */}

                  <div className="relative">
                    <select
                      name="helpWith"
                      value={formData.helpWith}
                      onChange={handleChange}
                      required
                      className={`
                        ${inputClass}
                        appearance-none
                        cursor-pointer
                        pr-10
                      `}
                    >
                      <option
                        value=""
                        disabled
                        className={
                          isDarkMode
                            ? "bg-[#0b1029] text-gray-500"
                            : "bg-white text-gray-500"
                        }
                      >
                        What can we help with? *
                      </option>

                      {helpOptions.map((option, index) => (
                        <option
                          key={index}
                          value={option}
                          className={
                            isDarkMode
                              ? "bg-[#0b1029] text-white"
                              : "bg-white text-gray-900"
                          }
                        >
                          {option}
                        </option>
                      ))}
                    </select>

                    {/* THIN SVG ARROW — SAME AS CONTACT FORM */}

                    <div
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        pointer-events-none
                      "
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Country */}

                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className={`
                        ${inputClass}
                        appearance-none
                        cursor-pointer
                        pr-10
                      `}
                    >
                      <option
                        value=""
                        disabled
                        className={
                          isDarkMode
                            ? "bg-[#0b1029] text-gray-500"
                            : "bg-white text-gray-500"
                        }
                      >
                        What Country Are You Located In? *
                      </option>

                      {countries.map((country, index) => (
                        <option
                          key={index}
                          value={country}
                          className={
                            isDarkMode
                              ? "bg-[#0b1029] text-white"
                              : "bg-white text-gray-900"
                          }
                        >
                          {country}
                        </option>
                      ))}
                    </select>

                    {/* THIN SVG ARROW — SAME AS CONTACT FORM */}

                    <div
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        pointer-events-none
                      "
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <textarea
                  name="message"
                  placeholder="Your Message..."
                  rows={3}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className={`
                    ${inputClass}
                    resize-none
                  `}
                />

                {/* =================================================
                    HOW DID YOU HEAR ABOUT US
                ================================================= */}

                <div className="relative">
                  <select
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                    required
                    className={`
                      ${inputClass}
                      appearance-none
                      cursor-pointer
                      pr-10
                    `}
                  >
                    <option
                      value=""
                      disabled
                      className={
                        isDarkMode
                          ? "bg-[#0b1029] text-gray-500"
                          : "bg-white text-gray-500"
                      }
                    >
                      How Did You Hear About Us? *
                    </option>

                    {hearAboutOptions.map((option, index) => (
                      <option
                        key={index}
                        value={option}
                        className={
                          isDarkMode
                            ? "bg-[#0b1029] text-white"
                            : "bg-white text-gray-900"
                        }
                      >
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* THIN SVG ARROW — SAME AS CONTACT FORM */}

                  <div
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                      pointer-events-none
                    "
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* =================================================
                    AGREEMENT
                ================================================= */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                    pt-1
                  "
                >
                  <label
                    htmlFor="hero-agree-to-contact"
                    className="relative mt-0.5 w-5 h-5 flex-shrink-0 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="agreeToContact"
                      id="hero-agree-to-contact"
                      checked={formData.agreeToContact}
                      onChange={handleChange}
                      required
                      className="peer absolute inset-0 z-10 h-5 w-5 cursor-pointer opacity-0"
                    />

                    <span
                      aria-hidden="true"
                      className={`
                        absolute
                        inset-0
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-md
                        border-2
                        transition-all
                        duration-200
                        ${
                          formData.agreeToContact
                            ? isDarkMode
                              ? "bg-[#d4e157] border-[#d4e157]"
                              : "bg-emerald-500 border-emerald-500"
                            : isDarkMode
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-gray-300"
                        }
                      `}
                    >
                      {formData.agreeToContact && (
                        <svg
                          className={`h-3.5 w-3.5 ${
                            isDarkMode ? "text-black" : "text-white"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                  </label>

                  <label
                    htmlFor="hero-agree-to-contact"
                    className={`
                      block
                      text-left
                      text-[11px]
                      leading-relaxed
                      ${colors.textMuted}
                      cursor-pointer
                    `}
                  >
                    <span className="text-red-500">*</span> I agree to be
                    contacted by BluConnet Media and receive news and other
                    promotional materials. For more information, please view our{" "}
                    <Link
                      to="/privacy-policy"
                      className={`
                        font-semibold
                        text-transparent
                        bg-clip-text
                        bg-gradient-to-r
                        ${
                          isDarkMode
                            ? "from-[#d4e157] to-[#06b6d4]"
                            : "from-emerald-500 to-cyan-600"
                        }
                        hover:underline
                      `}
                    >
                      privacy policy
                    </Link>
                    .
                  </label>
                </div>

                {/* =================================================
                    SEND BUTTON
                ================================================= */}

                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.015,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className={`
                    relative
                    overflow-hidden
                    group
                    w-full
                    py-3.5
                    rounded-xl
                    font-extrabold
                    text-sm
                    transition-all
                    duration-300
                    flex
                    items-center
                    justify-center
                    gap-2.5
                    ${
                      isDarkMode
                        ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.25)] hover:shadow-[0_12px_35px_rgba(212,225,87,0.4)]"
                        : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)]"
                    }
                  `}
                >
                  <div
                    className="
                      absolute
                      inset-0
                      -translate-x-full
                      group-hover:translate-x-full
                      transition-transform
                      duration-1000
                      ease-in-out
                      bg-gradient-to-r
                      from-transparent
                      via-white/40
                      to-transparent
                    "
                  />

                  <span
                    className="
                      relative
                      z-20
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    Send Message
                    <FaPaperPlane
                      className="
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                        transition-transform
                        duration-300
                      "
                    />
                  </span>
                </motion.button>

                {/* Secure */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <span
                    className={`
                      w-1.5
                      h-1.5
                      rounded-full
                      ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"}
                    `}
                  />

                  <span
                    className={`
                      text-[10px]
                      ${colors.textMuted}
                    `}
                  >
                    Your information is secure & confidential
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =================================================
          SUCCESS FEEDBACK — in-page (no browser alert)
      ================================================= */}

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setShowSuccess(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-contact-success-title"
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/60
              px-4
              py-6
              backdrop-blur-sm
            "
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={`
                relative
                w-full
                max-w-md
                overflow-hidden
                rounded-3xl
                border
                p-6
                text-center
                shadow-2xl
                sm:p-8
                ${colors.cardBg}
                ${isDarkMode ? "border-white/10" : "border-gray-200"}
              `}
            >
              <div
                className={`
                  pointer-events-none
                  absolute
                  -top-20
                  left-1/2
                  h-44
                  w-44
                  -translate-x-1/2
                  rounded-full
                  blur-3xl
                  ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-400/20"}
                `}
              />

              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
                <motion.span
                  animate={{ scale: [1, 1.35, 1.35], opacity: [0.35, 0, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className={`
                    absolute
                    inset-0
                    rounded-full
                    bg-gradient-to-r
                    ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    }
                  `}
                />

                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.12,
                    type: "spring",
                    stiffness: 280,
                    damping: 18,
                  }}
                  className={`
                    relative
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-r
                    ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.35)]"
                        : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.35)]"
                    }
                  `}
                >
                  <FaCheckCircle className="text-4xl" />
                </motion.div>
              </div>

              <h3
                id="hero-contact-success-title"
                className={`
                  bg-gradient-to-r
                  bg-clip-text
                  text-2xl
                  font-black
                  uppercase
                  tracking-wide
                  text-transparent
                  sm:text-3xl
                  ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  }
                `}
              >
                Successfully Submitted!
              </h3>

              <p
                className={`
                  mt-3
                  text-sm
                  leading-relaxed
                  ${colors.textMuted}
                `}
              >
                Thank you! We have received your message and will get back to
                you soon.
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowSuccess(false)}
                className={`
                  mt-7
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  px-6
                  py-3.5
                  text-sm
                  font-extrabold
                  uppercase
                  tracking-widest
                  transition-all
                  duration-300
                  ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.25)] hover:shadow-[0_12px_35px_rgba(212,225,87,0.4)]"
                      : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)]"
                  }
                `}
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
