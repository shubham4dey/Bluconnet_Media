import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

/* =========================================================
   SUBSCRIBE API — the existing backend endpoint: POST /api/subscribe
   (stores the signup in the MySQL `subscribers` table).

   Same environment convention as Hero.jsx / ContactForm.jsx /
   pages/contact.jsx, so localhost is never used in a production build:
     .env             → REACT_APP_API_URL=http://localhost:5000/api
     .env.production  → REACT_APP_API_URL=https://bluconnet-backend-m2lj.onrender.com/api
   ========================================================= */

const RAW_API_URL = (
  process.env.REACT_APP_API_URL ||
  "https://bluconnet-backend-m2jl.onrender.com/api"
).replace(/\/+$/, "");

/* Accepts both ".../api" (project default) and a bare origin ("...:5000"). */
const API_BASE = /\/api$/.test(RAW_API_URL)
  ? RAW_API_URL
  : `${RAW_API_URL}/api`;

const SUBSCRIBE_ENDPOINT = `${API_BASE}/subscribe`;

/* Same format rule the backend enforces (middleware/validate.js isEmail). */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SubscribeSection = () => {
  const { isDarkMode } = useTheme();

  // Controlled form state.
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);

  // Pending-request flag — blocks duplicate submissions.
  const [submitting, setSubmitting] = useState(false);

  /* Synchronous mirror of `submitting`: state updates are async, so a
     double click could otherwise fire two POSTs before React re-renders. */
  const submittingRef = useRef(false);

  // In-page success feedback (replaces any browser alert()).
  const [showSuccess, setShowSuccess] = useState(false);

  // In-page error feedback — keeps everything the visitor typed.
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handleAgreeChange = (e) => {
    setAgree(e.target.checked);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // A request is already in flight — ignore extra clicks/submits.
    if (submittingRef.current) return;

    const trimmedEmail = email.trim();

    // Client-side validation first — never POST an obviously invalid body.
    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Please enter a valid business email address.");
      return;
    }

    if (!agree) {
      setError("Please agree to receive updates before subscribing.");
      return;
    }

    setError(null);
    submittingRef.current = true;
    setSubmitting(true);

    try {
      const response = await fetch(SUBSCRIBE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          agreeToSubscribe: agree,
        }),
      });

      // 409 — the UNIQUE index on subscribers.email already has this address.
      if (response.status === 409) {
        setError("This email is already subscribed.");
        return;
      }

      // 400 validation / 429 rate limit / 500 server+database / offline.
      if (!response.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      // HTTP 201 — the signup is stored in the MySQL `subscribers` table.
      setShowSuccess(true);
      setEmail("");
      setAgree(false);
    } catch (networkError) {
      // Network failure — keep the entered values.
      setError("Something went wrong. Please try again.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  /* Same tokens the success overlays in Hero.jsx / ContactForm.jsx /
     pages/contact.jsx are built from. */
  const theme = {
    cardBg: isDarkMode ? "bg-[#0f1535]/80" : "bg-white/80",
    borderColor: isDarkMode ? "border-white/10" : "border-gray-200",
    muted: isDarkMode ? "text-gray-400" : "text-gray-600",
    gradientText: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",
    gradientBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",
    btnText: isDarkMode ? "text-[#0a0e27]" : "text-white",
  };

  return (
    <section
      className={`py-16 md:py-24 lg:py-28 px-4 ${
        isDarkMode ? "bg-[#050508]" : "bg-white"
      } relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Glow Effects (Matching Who We Are) */}
      <div
        className={`absolute top-1/4 left-0 w-96 h-96 ${
          isDarkMode ? "bg-emerald-500/10" : "bg-emerald-300/20"
        } rounded-full blur-3xl`}
      />

      <div
        className={`absolute bottom-1/4 right-0 w-96 h-96 ${
          isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-300/20"
        } rounded-full blur-3xl`}
      />

      {/* Subtle Grid Pattern (Matching Who We Are) */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode ? "#d4e157" : "#10b981"
          } 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Background Geometric Shapes */}
      <div
        className={`absolute top-20 right-20 w-32 h-32 md:w-48 md:h-48 ${
          isDarkMode ? "opacity-10" : "opacity-20"
        } pointer-events-none`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${
            isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
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
      </div>

      <div
        className={`absolute bottom-20 left-16 w-24 h-24 md:w-40 md:h-40 ${
          isDarkMode ? "opacity-10" : "opacity-20"
        } pointer-events-none rotate-12`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${
            isDarkMode ? "text-[#06b6d4]" : "text-cyan-500"
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
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative ${
            isDarkMode ? "bg-white/5" : "bg-white/80"
          } backdrop-blur-2xl border-2 ${
            isDarkMode ? "border-white/10" : "border-gray-200"
          } rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl overflow-hidden`}
        >
          {/* Card Glow Effects */}
          <div
            className={`absolute -top-20 -right-20 w-60 h-60 ${
              isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-400/20"
            } rounded-full blur-3xl`}
          />

          <div
            className={`absolute -bottom-20 -left-20 w-60 h-60 ${
              isDarkMode ? "bg-[#06b6d4]/20" : "bg-cyan-400/20"
            } rounded-full blur-3xl`}
          />

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
            {/* Left Side: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 text-start"
              >
                <span
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
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
                    />
                    <span
                      className={`absolute inset-0 w-2.5 h-2.5 ${
                        isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                      } rounded-full animate-ping opacity-75`}
                    />
                  </div>

                  <span
                    className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${
                      isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                    }`}
                  >
                    Subscribe For Updates
                  </span>
                </span>
              </motion.div>

              {/* Heading */}
              <h2
                className={`font-black leading-tight text-start mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
              >
                <span
                  className={
                    isDarkMode ? "text-white" : "text-gray-900"
                  }
                >
                  Helping Brands Unlock Growth Through{" "}
                </span>

                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  }`}
                >
                  Partnerships
                </span>
              </h2>

              {/* Decorative Line */}
              <div
                className={`mt-6 h-1 w-24 bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                } rounded-full`}
              />
            </motion.div>

            {/* Right Side: Form */}
            <motion.form
              onSubmit={handleSubmit}
              noValidate
              aria-busy={submitting}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Email Input */}
              <div>
                <label
                  className={`block ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } text-start font-bold mb-3 text-sm md:text-base`}
                >
                  Business Email Address:{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <div
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode
                        ? "text-[#d4e157]"
                        : "text-emerald-500"
                    }`}
                  >
                    <FaEnvelope className="w-5 h-5" />
                  </div>

                  <input
                    type="email"
                    name="email"
                    id="subscribe-email"
                    value={email}
                    onChange={handleEmailChange}
                    aria-invalid={Boolean(error)}
                    placeholder="Enter your email"
                    className={`w-full pl-12 pr-4 py-4 ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                    } border-2 rounded-xl focus:outline-none focus:border-${
                      isDarkMode ? "[#d4e157]" : "emerald-500"
                    } transition-all duration-300`}
                  />
                </div>
              </div>

              {/* Privacy Checkbox */}
              <label
                className={`flex items-start gap-3 text-sm text-start ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } cursor-pointer group`}
              >
                {/* Custom themed checkbox */}
                <span className="relative mt-1 flex-shrink-0">
                  <input
                    type="checkbox"
                    name="agreeToSubscribe"
                    id="subscribe-agree"
                    checked={agree}
                    onChange={handleAgreeChange}
                    className="peer sr-only"
                  />

                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                      agree
                        ? isDarkMode
                          ? "border-[#d4e157] bg-[#d4e157]"
                          : "border-emerald-500 bg-emerald-500"
                        : isDarkMode
                        ? "border-white/10 bg-white/5"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {agree && (
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
                </span>

                <span
                  className={`leading-relaxed ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } transition-colors`}
                >
                  <span className="text-red-500">*</span> I agree to receive
                  news and other promotional materials from BluConnet Media.
                  For more information, please view our{" "}
                  <Link
                    to="/privacy-policy"
                    className={`${
                      isDarkMode
                        ? "text-[#d4e157] hover:text-[#06b6d4]"
                        : "text-emerald-500 hover:text-cyan-600"
                    } transition-colors underline`}
                  >
                    privacy policy
                  </Link>
                  .
                </span>
              </label>

              {/* In-page error feedback */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  role="alert"
                  className="text-sm text-start font-semibold text-red-500"
                >
                  {error}
                </motion.p>
              )}

              {/* Premium Stylish Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden group w-full md:w-auto px-8 py-4 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                }`}
              >
                {/* Animated Shine/Sweep Effect on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                <span className="relative z-20 flex items-center gap-3">
                  Let's Connect
                  <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>

      {/* =================================================
          SUCCESS FEEDBACK — in-page (no browser alert).
          Same overlay pattern as Hero.jsx / ContactForm.jsx /
          pages/contact.jsx.
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
            aria-labelledby="subscribe-success-title"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              className={`relative w-full max-w-md overflow-hidden rounded-3xl border p-6 text-center backdrop-blur-xl shadow-2xl sm:p-8 ${theme.cardBg} ${theme.borderColor}`}
            >
              <div
                className={`pointer-events-none absolute -top-20 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full blur-3xl ${
                  isDarkMode
                    ? "bg-[#d4e157]/20"
                    : "bg-emerald-400/20"
                }`}
              />

              <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
                <motion.span
                  animate={{
                    scale: [1, 1.35, 1.35],
                    opacity: [0.35, 0, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${theme.gradientBg}`}
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
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r ${theme.gradientBg} ${theme.btnText} ${
                    isDarkMode
                      ? "shadow-[0_8px_30px_rgba(212,225,87,0.35)]"
                      : "shadow-[0_8px_30px_rgba(16,185,129,0.35)]"
                  }`}
                >
                  <FaCheckCircle className="text-4xl" />
                </motion.div>
              </div>

              <h3
                id="subscribe-success-title"
                className={`bg-gradient-to-r bg-clip-text text-2xl font-black uppercase tracking-wide text-transparent sm:text-3xl ${theme.gradientText}`}
              >
                Successfully Subscribed!
              </h3>

              <p
                className={`mt-3 text-sm leading-relaxed ${theme.muted}`}
              >
                Thank you! You’re now subscribed to our latest updates and
                insights.
              </p>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowSuccess(false)}
                className={`mt-7 w-full rounded-xl bg-gradient-to-r px-6 py-3.5 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${theme.gradientBg} ${theme.btnText} ${
                  isDarkMode
                    ? "shadow-[0_8px_30px_rgba(212,225,87,0.25)] hover:shadow-[0_12px_35px_rgba(212,225,87,0.4)]"
                    : "shadow-[0_8px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)]"
                }`}
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

export default SubscribeSection;