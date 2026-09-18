import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaArrowRight,
  FaUser,
  FaBuilding,
  FaGlobe,
  FaCheckCircle,
  FaClock,
  FaLinkedin,
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { useTheme } from "../context/ThemeContext";

/* =========================================================
   CONTACT FORM API — the ONE existing endpoint: POST /api/contact
   (stores the enquiry in the MySQL `contacts` table).

   Same environment convention as the rest of the project, so
   localhost is never used in a production build:
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

const ContactPage = () => {
  const { isDarkMode } = useTheme();

  // Scroll effects for 3D parallax
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const y = useTransform(scrollYProgress, [0, 0.2], [0, -120]);

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

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
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
          source: "contact-page",
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

  const helpOptions = [
    "Affiliate program management services",
    "Consulting / Project work",
    "Influencer program management",
    "360 partnership marketing services",
    "Business partnership opportunities",
    "Publisher or affiliate opportunities",
  ];

  const countries = [
    "United States",
    "United Kingdom",
    "India",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Singapore",
    "UAE",
    "South Africa",
  ];

  // =========================================================
  // HOW DID YOU HEAR ABOUT US OPTIONS
  // =========================================================

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

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      label: "Office Address",
      value: "Shaggy Calf Lane, Slough, Berkshire, SL2 5HP, United Kingdom",
      href: "https://www.google.com/maps/search/?api=1&query=Shaggy+Calf+Lane,+Slough,+Berkshire,+SL2+5HP,+United+Kingdom",
    },
    {
      icon: FaPhoneAlt,
      label: "Call",
      value: "+44 7450 635355",
      href: "tel:+447450635355",
    },
    {
      icon: FaEnvelope,
      label: "Email",
      value: "info@bluconnetmedia.com",
      href: "mailto:info@bluconnetmedia.com",
    },
  ];

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/bluconnet",
      label: "Facebook",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/Bluconnet_Media",
      label: "Twitter",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/company/bluconnetmedia/",
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/bluconnet_media/",
      label: "Instagram",
    },
    {
      icon: FaPinterestP,
      href: "https://www.pinterest.com/Bluconnet_Media/",
      label: "Pinterest",
    },
    {
      icon: FaYoutube,
      href: "https://m.youtube.com/@Bluconnet_Media",
      label: "YouTube",
    },
  ];

  const theme = {
    bg: isDarkMode ? "bg-[#050508]" : "bg-white",

    cardBg: isDarkMode ? "bg-white/5" : "bg-gray-50",

    borderColor: isDarkMode ? "border-white/10" : "border-gray-200",

    text: isDarkMode ? "text-white" : "text-gray-900",

    muted: isDarkMode ? "text-gray-400" : "text-gray-600",

    gradientText: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",

    gradientBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",

    btnText: isDarkMode ? "text-[#0a0e27]" : "text-white",

    inputBg: isDarkMode ? "bg-white/5" : "bg-gray-50",
  };

  return (
    <div
      className={`
        min-h-screen
        ${theme.bg}
        relative
        overflow-hidden
        transition-colors
        duration-500
      `}
    >
      {/* ===== BACKGROUND EFFECTS ===== */}

      <div className="absolute inset-0 overflow-hidden">
        {/* GRADIENT BACKGROUND */}

        <div
          className={`
            absolute
            inset-0
            ${
              isDarkMode
                ? "bg-gradient-to-br from-[#0a0e27] via-[#0f172a] to-[#050508]"
                : "bg-gradient-to-br from-slate-50 via-white to-gray-100"
            }
          `}
        />

        {/* FLOATING LIGHTS/ORBS - MATCHED TO WHO WE ARE */}

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`
                absolute
                w-96
                h-96
                rounded-full
                blur-3xl
                ${
                  i % 2 === 0
                    ? isDarkMode
                      ? "bg-[#d4e157]/10"
                      : "bg-emerald-300/20"
                    : isDarkMode
                      ? "bg-[#06b6d4]/10"
                      : "bg-cyan-300/20"
                }
              `}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: `${i * 20}%`,
                top: `${(i % 3) * 30}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className={`
            absolute
            -top-1/2
            -right-1/2
            w-[1000px]
            h-[1000px]
            rounded-full
            blur-[150px]
            ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-300/20"}
          `}
        />

        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
          }}
          className={`
            absolute
            -bottom-1/2
            -left-1/2
            w-[1000px]
            h-[1000px]
            rounded-full
            blur-[150px]
            ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-300/20"}
          `}
        />

        {/* ===== GRID PATTERN ===== */}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDarkMode
              ? `
                linear-gradient(
                  rgba(212, 225, 87, 0.1) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(212, 225, 87, 0.1) 1px,
                  transparent 1px
                ),
                radial-gradient(
                  circle,
                  rgba(212, 225, 87, 0.15) 1px,
                  transparent 1px
                )
              `
              : `
                linear-gradient(
                  rgba(0, 0, 0, 0.05) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(0, 0, 0, 0.05) 1px,
                  transparent 1px
                )
              `,
            backgroundSize: isDarkMode
              ? "50px 50px, 50px 50px, 50px 50px"
              : "50px 50px, 50px 50px",
          }}
        />
      </div>

      {/* LARGE BACKGROUND TEXT */}

      <div
        className={`
          absolute
          top-[17%]
          md:top-1/3
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          text-[70px]
          sm:text-[100px]
          md:text-[250px]
          lg:text-[350px]
          font-black
          pointer-events-none
          select-none
          z-0
          tracking-tighter
          whitespace-nowrap
          opacity-[0.03]
          md:opacity-[0.04]
          ${isDarkMode ? "text-white" : "text-black"}
        `}
      >
        CONTACT
      </div>

      {/* ===== MAIN CONTENT WITH SCROLL EFFECTS ===== */}

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-4
          pt-10
          md:pt-20
          lg:pt-20
          pb-20
        "
      >
        {/* ===== HERO SECTION ===== */}

        <motion.div
          style={{
            opacity,
            scale,
            y,
          }}
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
          }}
          className="
            text-center
            pt-20
            md:pt-24
            lg:pt-16
            mb-24
          "
        >
          {/* UPDATED BADGE TO MATCH WHO WE ARE */}

          <div
            className={`
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-full
              border
              ${
                isDarkMode
                  ? "border-[#d4e157]/30 bg-[#d4e157]/10"
                  : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50"
              }
              mt-16
              lg:mt-12
              mb-8
            `}
          >
            <span
              className={`
                w-2
                h-2
                rounded-full
                ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"}
                animate-pulse
              `}
            />

            <span
              className={`
                text-sm
                font-bold
                uppercase
                tracking-wider
                ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}
              `}
            >
              Get In Touch
            </span>
          </div>

          <h1
            className={`
              text-4xl
              sm:text-4xl
              md:text-7xl
              lg:text-8xl
              font-black
              ${theme.text}
              mb-6
              leading-tight
            `}
          >
            Let's Create
            <br />
            <span
              className={`
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                ${theme.gradientText}
              `}
            >
              Something Amazing
            </span>
          </h1>

          <p
            className={`
              text-base
              sm:text-lg
              md:text-xl
              ${theme.muted}
              max-w-2xl
              mx-auto
              px-4
              md:px-0
            `}
          >
            Ready to transform your digital presence? We're here to help you
            achieve extraordinary results.
          </p>
        </motion.div>

        {/* ===== CONTACT CARDS ===== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
            md:gap-6
            mt-28
            md:mt-10
            lg:mt-56
            xl:mt-64
            mb-12
            md:mb-20
          "
        >
          {contactInfo.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target={item.label === "Office Address" ? "_blank" : undefined}
              rel={
                item.label === "Office Address"
                  ? "noopener noreferrer"
                  : undefined
              }
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
              className={`
                group
                relative
                p-5
                md:p-8
                rounded-2xl
                md:rounded-3xl
                border
                ${theme.borderColor}
                ${theme.cardBg}
                backdrop-blur-xl
                hover:bg-opacity-80
                transition-all
                duration-500
                hover:scale-[1.02]
                md:hover:scale-105
              `}
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    md:gap-4
                    min-w-0
                  "
                >
                  <div
                    className={`
                      w-12
                      h-12
                      md:w-14
                      md:h-14
                      rounded-xl
                      ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-100/50"}
                      flex
                      items-center
                      justify-center
                      group-hover:bg-gradient-to-br
                      ${
                        isDarkMode
                          ? "group-hover:from-[#d4e157] group-hover:to-[#06b6d4]"
                          : "group-hover:from-emerald-500 group-hover:to-cyan-600"
                      }
                      transition-all
                      duration-500
                      flex-shrink-0
                    `}
                  >
                    <item.icon
                      className={`
                        ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}
                        text-xl
                        md:text-2xl
                        group-hover:text-white
                        transition-colors
                        duration-500
                      `}
                    />
                  </div>

                  <div
                    className="
                      min-w-0
                      text-left
                    "
                  >
                    <p
                      className={`
                        ${theme.muted}
                        text-sm
                        md:text-base
                        font-medium
                        mb-1
                      `}
                    >
                      {item.label}
                    </p>

                    <p
                      className={`
                        ${theme.text}
                        font-semibold
                        break-words
                        leading-relaxed
                        ${
                          item.label === "Office Address"
                            ? "text-xs md:text-sm"
                            : "text-sm md:text-base"
                        }
                      `}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>

                <FaArrowRight
                  className={`
                    ${theme.muted}
                    text-sm
                    md:text-base
                    flex-shrink-0
                    ${
                      isDarkMode
                        ? "group-hover:text-[#06b6d4]"
                        : "group-hover:text-cyan-600"
                    }
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    transition-all
                  `}
                />
              </div>
            </motion.a>
          ))}
        </div>

        {/* ===== FORM & MAP SECTION ===== */}

        <div
          className="
            grid
            lg:grid-cols-2
            gap-12
          "
        >
          {/* Contact Form */}

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
            }}
            className="relative"
          >
            <div
              className={`
                relative
                p-8
                md:p-10
                rounded-3xl
                ${theme.cardBg}
                border
                ${theme.borderColor}
                backdrop-blur-xl
              `}
            >
              <div
                className={`
                  absolute
                  -top-px
                  -left-px
                  w-20
                  h-20
                  border-t-2
                  border-l-2
                  ${
                    isDarkMode ? "border-[#d4e157]/30" : "border-emerald-500/50"
                  }
                  rounded-tl-3xl
                `}
              />

              <div
                className={`
                  absolute
                  -bottom-px
                  -right-px
                  w-20
                  h-20
                  border-b-2
                  border-r-2
                  ${isDarkMode ? "border-[#06b6d4]/30" : "border-cyan-500/50"}
                  rounded-br-3xl
                `}
              />

              <h2
                className={`
                  text-3xl
                  font-bold
                  ${theme.text}
                  mb-8
                  text-center
                  lg:text-left
                `}
              >
                Send Us a Message
              </h2>

              <form
                onSubmit={handleSubmit}
                aria-busy={submitting}
                className="space-y-5"
              >
                {/* First Name / Last Name */}

                <div
                  className="
                    grid
                    md:grid-cols-2
                    gap-5
                  "
                >
                  <div className="relative">
                    <div
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    >
                      <FaUser className="text-sm" />
                    </div>

                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="First Name *"
                      className={`
                        w-full
                        pl-12
                        pr-4
                        py-4
                        rounded-xl
                        ${theme.inputBg}
                        border
                        ${theme.borderColor}
                        ${theme.text}
                        placeholder-gray-500
                        focus:outline-none
                        ${
                          isDarkMode
                            ? "focus:border-[#06b6d4] focus:ring-[#06b6d4]/20"
                            : "focus:border-emerald-500 focus:ring-emerald-500/20"
                        }
                        transition-all
                      `}
                    />
                  </div>

                  <div className="relative">
                    <div
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    >
                      <FaUser className="text-sm" />
                    </div>

                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Last Name *"
                      className={`
                        w-full
                        pl-12
                        pr-4
                        py-4
                        rounded-xl
                        ${theme.inputBg}
                        border
                        ${theme.borderColor}
                        ${theme.text}
                        placeholder-gray-500
                        focus:outline-none
                        ${
                          isDarkMode
                            ? "focus:border-[#06b6d4] focus:ring-[#06b6d4]/20"
                            : "focus:border-emerald-500 focus:ring-emerald-500/20"
                        }
                        transition-all
                      `}
                    />
                  </div>
                </div>

                {/* Email / Company */}

                <div
                  className="
                    grid
                    md:grid-cols-2
                    gap-5
                  "
                >
                  <div className="relative">
                    <div
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    >
                      <FaEnvelope className="text-sm" />
                    </div>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Email *"
                      className={`
                        w-full
                        pl-12
                        pr-4
                        py-4
                        rounded-xl
                        ${theme.inputBg}
                        border
                        ${theme.borderColor}
                        ${theme.text}
                        placeholder-gray-500
                        focus:outline-none
                        ${
                          isDarkMode
                            ? "focus:border-[#06b6d4] focus:ring-[#06b6d4]/20"
                            : "focus:border-emerald-500 focus:ring-emerald-500/20"
                        }
                        transition-all
                      `}
                    />
                  </div>

                  <div className="relative">
                    <div
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    >
                      <FaBuilding className="text-sm" />
                    </div>

                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      placeholder="Company Name *"
                      className={`
                        w-full
                        pl-12
                        pr-4
                        py-4
                        rounded-xl
                        ${theme.inputBg}
                        border
                        ${theme.borderColor}
                        ${theme.text}
                        placeholder-gray-500
                        focus:outline-none
                        ${
                          isDarkMode
                            ? "focus:border-[#06b6d4] focus:ring-[#06b6d4]/20"
                            : "focus:border-emerald-500 focus:ring-emerald-500/20"
                        }
                        transition-all
                      `}
                    />
                  </div>
                </div>

                {/* Help / Country */}

                <div
                  className="
                    grid
                    md:grid-cols-2
                    gap-5
                  "
                >
                  <div className="relative">
                    <div
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    >
                      <FaCheckCircle className="text-sm" />
                    </div>

                    <select
                      name="helpWith"
                      value={formData.helpWith}
                      onChange={handleChange}
                      required
                      className={`
                        w-full
                        pl-12
                        pr-10
                        py-4
                        rounded-xl
                        ${theme.inputBg}
                        border
                        ${theme.borderColor}
                        ${theme.text}
                        focus:outline-none
                        ${
                          isDarkMode
                            ? "focus:border-[#06b6d4] focus:ring-[#06b6d4]/20"
                            : "focus:border-emerald-500 focus:ring-emerald-500/20"
                        }
                        transition-all
                        appearance-none
                        cursor-pointer
                      `}
                    >
                      <option
                        value=""
                        className={isDarkMode ? "bg-zinc-900" : "bg-white"}
                      >
                        What Can We Help With? *
                      </option>

                      {helpOptions.map((option, idx) => (
                        <option
                          key={idx}
                          value={option}
                          className={isDarkMode ? "bg-zinc-900" : "bg-white"}
                        >
                          {option}
                        </option>
                      ))}
                    </select>

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
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <div
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    >
                      <FaGlobe className="text-sm" />
                    </div>

                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className={`
                        w-full
                        pl-12
                        pr-10
                        py-4
                        rounded-xl
                        ${theme.inputBg}
                        border
                        ${theme.borderColor}
                        ${theme.text}
                        focus:outline-none
                        ${
                          isDarkMode
                            ? "focus:border-[#06b6d4] focus:ring-[#06b6d4]/20"
                            : "focus:border-emerald-500 focus:ring-emerald-500/20"
                        }
                        transition-all
                        appearance-none
                        cursor-pointer
                      `}
                    >
                      <option
                        value=""
                        className={isDarkMode ? "bg-zinc-900" : "bg-white"}
                      >
                        What Country Are You Located In? *
                      </option>

                      {countries.map((country, idx) => (
                        <option
                          key={idx}
                          value={country}
                          className={isDarkMode ? "bg-zinc-900" : "bg-white"}
                        >
                          {country}
                        </option>
                      ))}
                    </select>

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
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}

                <div className="relative">
                  <div
                    className="
                      absolute
                      left-4
                      top-6
                      text-gray-500
                    "
                  >
                    <FaPaperPlane className="text-sm" />
                  </div>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Your Message"
                    className={`
                      w-full
                      pl-12
                      pr-4
                      py-4
                      rounded-xl
                      ${theme.inputBg}
                      border
                      ${theme.borderColor}
                      ${theme.text}
                      placeholder-gray-500
                      focus:outline-none
                      ${
                        isDarkMode
                          ? "focus:border-[#06b6d4] focus:ring-[#06b6d4]/20"
                          : "focus:border-emerald-500 focus:ring-emerald-500/20"
                      }
                      transition-all
                      resize-none
                    `}
                  ></textarea>
                </div>

                {/* =================================================
                    HOW DID YOU HEAR ABOUT US - DROPDOWN ONLY
                ================================================= */}

                <div className="relative">
                  <select
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                    className={`
                      w-full
                      px-4
                      pr-10
                      py-4
                      rounded-xl
                      ${theme.inputBg}
                      border
                      ${theme.borderColor}
                      ${theme.text}
                      focus:outline-none
                      ${
                        isDarkMode
                          ? "focus:border-[#06b6d4] focus:ring-[#06b6d4]/20"
                          : "focus:border-emerald-500 focus:ring-emerald-500/20"
                      }
                      transition-all
                      appearance-none
                      cursor-pointer
                    `}
                  >
                    <option
                      value=""
                      className={isDarkMode ? "bg-zinc-900" : "bg-white"}
                    >
                      How Did You Hear About Us?
                    </option>

                    {hearAboutOptions.map((option, idx) => (
                      <option
                        key={idx}
                        value={option}
                        className={isDarkMode ? "bg-zinc-900" : "bg-white"}
                      >
                        {option}
                      </option>
                    ))}
                  </select>

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
                      ></path>
                    </svg>
                  </div>
                </div>

                {/* Agreement */}

                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  {/* Custom themed checkbox — input remains fully clickable */}
                  <label
                    htmlFor="contact-page-agree"
                    className="relative mt-1 w-5 h-5 flex-shrink-0 block cursor-pointer"
                  >
                    <input
                      id="contact-page-agree"
                      type="checkbox"
                      name="agreeToContact"
                      checked={formData.agreeToContact}
                      onChange={handleChange}
                      required
                      className="
                        absolute
                        inset-0
                        z-20
                        m-0
                        w-5
                        h-5
                        cursor-pointer
                        opacity-0
                      "
                    />

                    <span
                      aria-hidden="true"
                      className={`
                        pointer-events-none
                        absolute
                        inset-0
                        z-10
                        flex
                        items-center
                        justify-center
                        w-5
                        h-5
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
                          className={`w-3.5 h-3.5 ${
                            isDarkMode ? "text-black" : "text-white"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
                    htmlFor="contact-page-agree"
                    className={`
                      ${theme.muted}
                      text-sm
                      leading-relaxed
                      cursor-pointer
                      text-left
                      flex-1
                    `}
                  >
                    <span className="text-red-500">*</span> I agree to be
                    contacted by Acceleration Partners and receive news and
                    other promotional materials. For more information, please
                    view our{" "}
                    <a
                      href="/privacy-policy"
                      className={`
                        text-transparent
                        bg-clip-text
                        bg-gradient-to-r
                        ${theme.gradientText}
                        hover:underline
                        font-semibold
                      `}
                    >
                      privacy policy
                    </a>
                    .
                  </label>
                </div>

                {/* Submit Button */}

                <motion.button
                  type="submit"
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
                    py-4
                    bg-gradient-to-r
                    ${theme.gradientBg}
                    ${theme.btnText}
                    font-bold
                    rounded-xl
                    transition-all
                    duration-300
                    flex
                    items-center
                    justify-center
                    gap-3
                    text-lg
                    ${
                      isDarkMode
                        ? "shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                        : "shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                    }
                  `}
                >
                  {/* Animated Shine */}

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
                      gap-3
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
              </form>

              {/* Social Media Links Section */}

              <div
                className={`
                  mt-8
                  pt-8
                  border-t
                  ${theme.borderColor}
                `}
              >
                <p
                  className={`
                    ${theme.muted}
                    text-sm
                    mb-4
                    text-center
                  `}
                >
                  Or connect with us on social media
                </p>

                <div
                  className="
                    flex
                    justify-center
                    gap-4
                    flex-wrap
                  "
                >
                  {socialLinks.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className={`
                          w-9
                          h-9
                          md:w-10
                          md:h-10
                          ${
                            isDarkMode
                              ? "bg-white/5 border border-white/10 hover:bg-gradient-to-br hover:from-[#d4e157] hover:to-[#06b6d4] hover:border-transparent"
                              : "bg-slate-100 border border-slate-200 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-cyan-600 hover:border-transparent"
                          }
                          rounded-full
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-300
                          hover:scale-110
                          group
                          flex-shrink-0
                        `}
                    >
                      <item.icon
                        className={`
                            ${
                              isDarkMode
                                ? "text-white group-hover:text-[#0a0e27]"
                                : "text-slate-700 group-hover:text-white"
                            }
                            text-base
                            md:text-lg
                            transition-colors
                          `}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom decorative blurs */}

            <div
              className={`
                absolute
                -top-6
                -right-6
                w-24
                h-24
                rounded-full
                blur-xl
                ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-300/20"}
              `}
            />

            <div
              className={`
                absolute
                -bottom-6
                -left-6
                w-32
                h-32
                rounded-full
                blur-xl
                ${isDarkMode ? "bg-[#06b6d4]/20" : "bg-cyan-300/20"}
              `}
            />
          </motion.div>

          {/* Map Section */}

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
            className="relative"
          >
            <div
              className={`
                relative
                rounded-3xl
                border
                ${theme.borderColor}
                ${theme.cardBg}
                backdrop-blur-xl
                shadow-2xl
                overflow-hidden
                h-full
                min-h-[700px]
              `}
            >
              <div
                className={`
                  p-6
                  border-b
                  ${theme.borderColor}
                `}
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <FaMapMarkerAlt
                    className={`
                      text-2xl
                      ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"}
                    `}
                  />

                  <div className="text-center lg:text-left">
                    <h3
                      className={`
                        text-xl
                        font-bold
                        ${theme.text}
                      `}
                    >
                      Our Location
                    </h3>

                    <p
                      className={`
                        text-sm
                        ${theme.muted}
                      `}
                    >
                      Visit our headquarters in UK
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="
                  relative
                  h-[calc(100%-100px)]
                "
              >
                {/* Google Maps Embed */}

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2454.1234567890!2d-0.607123456789!3d51.5123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48765b0c0c0c0c0c%3A0x0!2zNTPCsDMwJzQ0LjQiTiAwwrAzNicwMC4wIlc!5e0!3m2!1sen!2suk!4v1234567890!5m2!1sen!2suk"
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                  "
                  style={{
                    border: 0,
                    filter: isDarkMode
                      ? "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)"
                      : "none",
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BluConnet Media Location"
                ></iframe>

                {/* Animated Blinking Marker */}

                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.5,
                  }}
                  className="
                    absolute
                    top-[45%]
                    left-[55%]
                    -translate-x-1/2
                    -translate-y-1/2
                    z-10
                  "
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.8, 2.5],
                      opacity: [0.8, 0.4, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="
                      absolute
                      top-1/2
                      left-1/2
                      -translate-x-1/2
                      -translate-y-1/2
                      w-12
                      h-12
                      rounded-full
                      bg-gradient-to-r
                      from-[#d4e157]
                      to-[#06b6d4]
                    "
                  />

                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      relative
                      w-10
                      h-10
                      rounded-full
                      bg-gradient-to-r
                      from-[#d4e157]
                      to-[#06b6d4]
                      flex
                      items-center
                      justify-center
                      shadow-2xl
                    "
                  >
                    <FaMapMarkerAlt
                      className="
                        text-xl
                        text-[#0a0e27]
                      "
                    />
                  </motion.div>
                </motion.div>

                {/* Location Info Card */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className={`
                    absolute
                    bottom-6
                    left-6
                    right-6
                    p-6
                    rounded-2xl
                    backdrop-blur-xl
                    border
                    ${
                      isDarkMode
                        ? "bg-[#111827]/95 border-white/10"
                        : "bg-white/95 border-gray-200 shadow-lg"
                    }
                    text-center
                    lg:text-left
                  `}
                >
                  <h4
                    className={`
                      font-bold
                      ${theme.text}
                      mb-2
                    `}
                  >
                    BluConnet Media
                  </h4>

                  <p
                    className={`
                      ${theme.muted}
                      text-sm
                      mb-3
                    `}
                  >
                    Shaggy Calf Ln, Slough SL2, United Kingdom
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      lg:justify-start
                      gap-2
                      text-sm
                      mb-2
                    "
                  >
                    <FaClock
                      className={
                        isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                      }
                    />

                    <span className={theme.text}>
                      Mon - Fri: 10:00 AM - 7:00 PM (GMT)
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      lg:justify-start
                      gap-2
                      text-sm
                    "
                  >
                    <FaPhoneAlt
                      className={
                        isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"
                      }
                    />

                    <span className={theme.text}>+44 (0) 1753 272372</span>
                  </div>
                </motion.div>
              </div>
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
            aria-labelledby="contact-page-success-title"
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
                ${theme.bg}
                ${theme.borderColor}
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
                    ${theme.gradientBg}
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
                    ${theme.gradientBg}
                    ${theme.btnText}
                    ${
                      isDarkMode
                        ? "shadow-[0_8px_30px_rgba(212,225,87,0.35)]"
                        : "shadow-[0_8px_30px_rgba(16,185,129,0.35)]"
                    }
                  `}
                >
                  <FaCheckCircle className="text-4xl" />
                </motion.div>
              </div>

              <h3
                id="contact-page-success-title"
                className={`
                  bg-gradient-to-r
                  bg-clip-text
                  text-2xl
                  font-black
                  uppercase
                  tracking-wide
                  text-transparent
                  sm:text-3xl
                  ${theme.gradientText}
                `}
              >
                Successfully Submitted!
              </h3>

              <p
                className={`
                  mt-3
                  text-sm
                  leading-relaxed
                  ${theme.muted}
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
                  font-bold
                  uppercase
                  tracking-widest
                  transition-all
                  duration-300
                  ${theme.gradientBg}
                  ${theme.btnText}
                  ${
                    isDarkMode
                      ? "shadow-[0_8px_30px_rgba(212,225,87,0.25)] hover:shadow-[0_12px_35px_rgba(212,225,87,0.4)]"
                      : "shadow-[0_8px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)]"
                  }
                `}
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactPage;
