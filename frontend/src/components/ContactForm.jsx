import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

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

const ContactHome = () => {
  const { isDarkMode } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

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
          source: "home-contact",
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
          : "Something went wrong. Please try again."
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

  // How Did You Hear About Us? options
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

  const theme = {
    bg: isDarkMode ? "bg-[#050508]" : "bg-white",

    cardBg: isDarkMode ? "bg-[#0f1535]/80" : "bg-white/80",

    borderColor: isDarkMode ? "border-white/10" : "border-gray-200",

    text: isDarkMode ? "text-white" : "text-gray-900",

    muted: isDarkMode ? "text-gray-400" : "text-gray-600",

    inputBg: isDarkMode ? "bg-white/5" : "bg-gray-50",

    gradientText: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",

    gradientBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",

    btnText: isDarkMode ? "text-[#0a0e27]" : "text-white",

    focusRing: isDarkMode
      ? "focus:ring-[#06b6d4]/50"
      : "focus:ring-emerald-500/50",

    focusBorder: isDarkMode
      ? "focus:border-[#06b6d4]"
      : "focus:border-emerald-500",
  };

  return (
    <section
      className={`
        py-24
        px-4
        relative
        overflow-hidden
        ${theme.bg}
        transition-colors
        duration-500
      `}
    >
      {/* Background Glows */}

      <div
        className={`
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[600px]
          h-[600px]
          bg-gradient-to-r
          ${
            isDarkMode
              ? "from-[#d4e157]/10 to-[#06b6d4]/10"
              : "from-emerald-500/10 to-cyan-600/10"
          }
          rounded-full
          blur-[120px]
          pointer-events-none
        `}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.8,
          }}
          className={`
            ${theme.cardBg}
            backdrop-blur-2xl
            rounded-3xl
            p-8
            md:p-12
            border
            ${theme.borderColor}
            shadow-2xl
            text-center
          `}
        >
          <h2
            className={`
              text-3xl
              md:text-5xl
              font-black
              ${theme.text}
              mb-4
            `}
          >
            Ready to{" "}
            <span
              className={`
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                ${theme.gradientText}
              `}
            >
              Scale Up?
            </span>
          </h2>

          <p
            className={`
              ${theme.muted}
              text-lg
              mb-10
              max-w-2xl
              mx-auto
            `}
          >
            Drop us a quick message. Our team will get back to you within 24
            hours.
          </p>

          <form
            onSubmit={handleSubmit}
            aria-busy={submitting}
            className="
              max-w-2xl
              mx-auto
              space-y-5
              text-left
            "
          >
            {/* Row 1: First Name & Last Name */}

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                required
                value={formData.firstName}
                onChange={handleChange}
                className={`
                  w-full
                  px-5
                  py-4
                  ${theme.inputBg}
                  ${theme.text}
                  border
                  ${theme.borderColor}
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  ${theme.focusRing}
                  ${theme.focusBorder}
                  transition-all
                  placeholder-gray-500
                `}
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                required
                value={formData.lastName}
                onChange={handleChange}
                className={`
                  w-full
                  px-5
                  py-4
                  ${theme.inputBg}
                  ${theme.text}
                  border
                  ${theme.borderColor}
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  ${theme.focusRing}
                  ${theme.focusBorder}
                  transition-all
                  placeholder-gray-500
                `}
              />
            </div>

            {/* Row 2: Email & Company Name */}

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="email"
                name="email"
                placeholder="Email *"
                required
                value={formData.email}
                onChange={handleChange}
                className={`
                  w-full
                  px-5
                  py-4
                  ${theme.inputBg}
                  ${theme.text}
                  border
                  ${theme.borderColor}
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  ${theme.focusRing}
                  ${theme.focusBorder}
                  transition-all
                  placeholder-gray-500
                `}
              />

              <input
                type="text"
                name="companyName"
                placeholder="Company Name *"
                required
                value={formData.companyName}
                onChange={handleChange}
                className={`
                  w-full
                  px-5
                  py-4
                  ${theme.inputBg}
                  ${theme.text}
                  border
                  ${theme.borderColor}
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  ${theme.focusRing}
                  ${theme.focusBorder}
                  transition-all
                  placeholder-gray-500
                `}
              />
            </div>

            {/* Row 3: Help With & Country */}

            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative">
                <select
                  name="helpWith"
                  value={formData.helpWith}
                  onChange={handleChange}
                  required
                  className={`
                    w-full
                    px-5
                    py-4
                    ${theme.inputBg}
                    ${theme.text}
                    border
                    ${theme.borderColor}
                    rounded-xl
                    focus:outline-none
                    focus:ring-2
                    ${theme.focusRing}
                    ${theme.focusBorder}
                    transition-all
                    appearance-none
                    cursor-pointer
                  `}
                >
                  <option
                    value=""
                    disabled
                    className={
                      isDarkMode
                        ? "bg-[#0f1535] text-gray-500"
                        : "bg-white text-gray-500"
                    }
                  >
                    What Can We Help With? *
                  </option>

                  {helpOptions.map((option, idx) => (
                    <option
                      key={idx}
                      value={option}
                      className={
                        isDarkMode
                          ? "bg-[#0f1535] text-white"
                          : "bg-white text-gray-900"
                      }
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
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className={`
                    w-full
                    px-5
                    py-4
                    ${theme.inputBg}
                    ${theme.text}
                    border
                    ${theme.borderColor}
                    rounded-xl
                    focus:outline-none
                    focus:ring-2
                    ${theme.focusRing}
                    ${theme.focusBorder}
                    transition-all
                    appearance-none
                    cursor-pointer
                  `}
                >
                  <option
                    value=""
                    disabled
                    className={
                      isDarkMode
                        ? "bg-[#0f1535] text-gray-500"
                        : "bg-white text-gray-500"
                    }
                  >
                    What Country Are You Located In? *
                  </option>

                  {countries.map((country, idx) => (
                    <option
                      key={idx}
                      value={country}
                      className={
                        isDarkMode
                          ? "bg-[#0f1535] text-white"
                          : "bg-white text-gray-900"
                      }
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
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 4: Message */}

            <textarea
              name="message"
              placeholder="Your Message..."
              rows="3"
              required
              value={formData.message}
              onChange={handleChange}
              className={`
                w-full
                px-5
                py-4
                ${theme.inputBg}
                ${theme.text}
                border
                ${theme.borderColor}
                rounded-xl
                focus:outline-none
                focus:ring-2
                ${theme.focusRing}
                ${theme.focusBorder}
                transition-all
                placeholder-gray-500
                resize-none
              `}
            ></textarea>

            {/* =================================================
                Row 5: How Did You Hear About Us?
            ================================================= */}

            <div className="relative">
              <select
                name="hearAbout"
                value={formData.hearAbout}
                onChange={handleChange}
                required
                className={`
                  w-full
                  px-5
                  py-4
                  ${theme.inputBg}
                  ${theme.text}
                  border
                  ${theme.borderColor}
                  rounded-xl
                  focus:outline-none
                  focus:ring-2
                  ${theme.focusRing}
                  ${theme.focusBorder}
                  transition-all
                  appearance-none
                  cursor-pointer
                  pr-12
                `}
              >
                <option
                  value=""
                  disabled
                  className={
                    isDarkMode
                      ? "bg-[#0f1535] text-gray-500"
                      : "bg-white text-gray-500"
                  }
                >
                  How Did You Hear About Us? *
                </option>

                {[
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
                ].map((option, idx) => (
                  <option
                    key={idx}
                    value={option}
                    className={
                      isDarkMode
                        ? "bg-[#0f1535] text-white"
                        : "bg-white text-gray-900"
                    }
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
                  />
                </svg>
              </div>
            </div>

            {/* Row 6: Checkbox Agreement */}

            <div className="flex items-start gap-3 pt-2">
              {/* Custom checkbox - the real input stays on top so it is clickable */}
              <label
                htmlFor="home-contact-agree"
                className="relative mt-1 w-5 h-5 flex-shrink-0 block cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="agreeToContact"
                  id="home-contact-agree"
                  checked={formData.agreeToContact}
                  onChange={handleChange}
                  required
                  className="peer absolute inset-0 z-10 w-5 h-5 m-0 opacity-0 cursor-pointer"
                />

                <span
                  aria-hidden="true"
                  className={`
                    pointer-events-none
                    absolute
                    inset-0
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
                htmlFor="home-contact-agree"
                className={`
                  ${theme.muted}
                  text-sm
                  leading-relaxed
                  cursor-pointer
                  text-left
                  flex-1
                `}
              >
                <span className="text-red-500">*</span> I agree to be contacted
                by Acceleration Partners and receive news and other promotional
                materials. For more information, please view our{" "}
                <Link
                  to="/privacy-policy"
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
                </Link>
                .
              </label>
            </div>

            {/* ===== PREMIUM STYLISH SUBMIT BUTTON ===== */}

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
                rounded-xl
                font-black
                text-sm
                md:text-base
                uppercase
                tracking-widest
                transition-all
                duration-300
                flex
                items-center
                justify-center
                gap-3
                ${
                  isDarkMode
                    ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                }
              `}
            >
              {/* Animated Shine/Sweep Effect on Hover */}

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
                    text-lg
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    transition-transform
                    duration-300
                  "
                />
              </span>
            </motion.button>
          </form>
        </motion.div>
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
            aria-labelledby="home-contact-success-title"
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
                backdrop-blur-xl
                shadow-2xl
                sm:p-8
                ${theme.cardBg}
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
                  ${
                    isDarkMode
                      ? "bg-[#d4e157]/20"
                      : "bg-emerald-400/20"
                  }
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
                id="home-contact-success-title"
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
                Thank you! We have received your message and will get back to you soon.
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
    </section>
  );
};

export default ContactHome;
