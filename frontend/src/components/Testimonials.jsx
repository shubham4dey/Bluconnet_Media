import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaArrowRight, FaArrowLeft, FaStar } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Import client logos
import reebokLogo from "../assets/img/logo.png";
import swarovskiLogo from "../assets/img/logo.png";
import crocsLogo from "../assets/img/logo.png";
import redbubbleLogo from "../assets/img/logo.png";

const Testimonials = () => {
  const { isDarkMode } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  return (
    <section
      className={`py-20 md:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Glow Effects */}
      <div
        className={`absolute top-1/4 left-0 w-96 h-96 ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} rounded-full blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-1/4 right-0 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-600/10"} rounded-full blur-3xl`}
      ></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? "#d4e157" : "#10b981"} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Background Geometric Shapes */}
      <div
        className={`absolute top-20 right-20 w-32 h-32 md:w-48 md:h-48 ${isDarkMode ? "opacity-10" : "opacity-20"} pointer-events-none`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"}`}
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
        {/* Header - Theme Colors */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-center gap-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-2"
          >
            <div
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border border-[#d4e157]/30 text-[#d4e157]"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-700"
              }`}
            >
              {/* Blinking Circle */}
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span
                  className={`w-2.5 h-2.5 ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  } rounded-full`}
                ></span>
                <span
                  className={`absolute inset-0 w-2.5 h-2.5 ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  } rounded-full animate-ping opacity-75`}
                ></span>
              </div>
              <span 
              className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
            >
                CLIENT TESTIMONIALS
              </span>
            </div>
          </motion.div>

          <h2
            className={`font-black leading-tight mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
          >
            <span className={isDarkMode ? "text-white" : "text-gray-900"}>
              TAKE IT{" "}
            </span>
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              FROM THEM
            </span>
          </h2>
        </motion.div>

        {/* Main Testimonial Container - Asymmetric Layout */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
            >
              {/* LEFT SIDE - Company Info (4 cols) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`lg:col-span-4 bg-gradient-to-br ${isDarkMode ? "from-[#0f1535] to-[#0a0e27] border-white/10" : "from-white to-slate-50 border-gray-200"} border-2 rounded-2xl p-6 md:p-8 relative overflow-hidden ${isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"} shadow-lg`}
              >
                {/* Decorative corner accent */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} rounded-full blur-2xl`}
                ></div>

                {/* Big Number Counter */}
                <div className="relative z-10 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
                    >
                      {String(currentIndex + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-2xl ${isDarkMode ? "text-gray-400" : "text-gray-600"} font-bold`}
                    >
                      /{String(testimonials.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div
                    className={`h-1 w-16 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} mt-3 rounded-full`}
                  ></div>
                </div>

                {/* Logo */}
                <div
                  className={`relative z-10 mb-6 ${isDarkMode ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200"} backdrop-blur-sm px-4 py-3 md:px-6 md:py-4 rounded-xl inline-block`}
                >
                  <img
                    src={testimonials[currentIndex].logo}
                    alt={`${testimonials[currentIndex].company} logo`}
                    className="h-12 md:h-14 w-auto object-contain"
                  />
                </div>

                {/* Company Info */}
                <div className="relative z-10">
                  <div
                    className={`${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} font-bold text-xl md:text-2xl uppercase tracking-wide mb-1`}
                  >
                    {testimonials[currentIndex].company}
                  </div>
                  <div
                    className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm md:text-base mb-4`}
                  >
                    {testimonials[currentIndex].position}
                  </div>

                  {/* Star Rating */}
                  <div className="flex justify-center gap-1 mt-3">
                    {[...Array(testimonials[currentIndex].rating)].map(
                      (_, i) => (
                        <FaStar
                          key={i}
                          className={`${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"} w-4 h-4`}
                        />
                      ),
                    )}
                  </div>
                </div>
              </motion.div>

              {/* RIGHT SIDE - Quote (8 cols) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`lg:col-span-8 bg-gradient-to-br ${isDarkMode ? "from-[#0f1535] to-[#0a0e27] border-white/10" : "from-white to-slate-50 border-gray-200"} backdrop-blur-sm border-2 rounded-2xl p-6 md:p-12 lg:p-14 relative overflow-hidden ${isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"} shadow-lg`}
              >
                {/* Large Quote Icon */}
                <div
                  className={`absolute top-6 left-6 ${isDarkMode ? "text-[#d4e157]/10" : "text-emerald-500/10"}`}
                >
                  <FaQuoteLeft className="w-12 h-12 md:w-24 md:h-24" />
                </div>

                {/* Decorative gradient blob */}
                <div
                  className={`absolute -bottom-20 -right-20 w-64 h-64 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-600/10"} rounded-full blur-3xl`}
                ></div>

                {/* Quote Text */}
                <div className="relative z-10">
                  <p
                    className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} text-lg md:text-xl lg:text-2xl leading-relaxed font-light italic`}
                  >
                    "{testimonials[currentIndex].quote}"
                  </p>

                  {/* Signature Line */}
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <div
                      className={`h-0.5 w-16 bg-gradient-to-r ${
                        isDarkMode
                          ? "from-[#d4e157] to-transparent"
                          : "from-emerald-500 to-transparent"
                      }`}
                    ></div>
                    <span
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm uppercase tracking-widest font-semibold text-center`}
                    >
                      Client Review
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Navigation Bar */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Progress Bar */}
            <div className="w-full md:w-auto flex items-center gap-3">
              <span
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm font-semibold`}
              >
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(testimonials.length).padStart(2, "0")}
              </span>
              <div
                className={`flex-1 md:w-64 h-1 ${isDarkMode ? "bg-white/10" : "bg-gray-200"} rounded-full overflow-hidden`}
              >
                <motion.div
                  key={currentIndex}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentIndex + 1) / testimonials.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                  className={`h-full bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
                ></motion.div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={prev}
                whileHover={{ scale: 1.1, x: -3 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                } flex items-center justify-center hover:shadow-lg transition-all duration-300 group`}
                aria-label="Previous testimonial"
              >
                <FaArrowLeft
                  className={`${
                    isDarkMode ? "text-[#0a0e27]" : "text-white"
                  } group-hover:-translate-x-1 transition-transform duration-300`}
                />
              </motion.button>

              <motion.button
                onClick={next}
                whileHover={{ scale: 1.1, x: 3 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                } flex items-center justify-center hover:shadow-lg transition-all duration-300 group`}
                aria-label="Next testimonial"
              >
                <FaArrowRight
                  className={`${
                    isDarkMode ? "text-[#0a0e27]" : "text-white"
                  } group-hover:translate-x-1 transition-transform duration-300`}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
