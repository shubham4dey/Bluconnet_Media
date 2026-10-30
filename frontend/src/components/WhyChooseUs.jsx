import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FaCoins,
  FaChartLine,
  FaRobot,
  FaChartBar,
  FaExpandArrowsAlt,
  FaHeadset,
  FaUsers,
  FaGlobe,
  FaTrophy,
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";

import teamImage from "../assets/img/h2.png";

const WhyChooseUs = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Navigate to About Us when the entire section is clicked
  const handleSectionClick = () => {
    navigate("/about");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  const benefits = [
    {
      number: "01",
      icon: FaCoins,
      title: "High Returns",
      description:
        "As a top lead generation agency, our lead generation digital marketing is built to make every penny work harder, securing highly qualified business to business sales leads.",
      lightIconColor: "bg-emerald-100 text-emerald-600",
      darkIconColor: "bg-[#d4e157]/10 text-[#d4e157]",
      lightArrowColor: "text-emerald-500",
      darkArrowColor: "text-[#d4e157]",
    },
    {
      number: "02",
      icon: FaChartLine,
      title: "ROI-Based Approach",
      description:
        "Across all online lead generation services, we act as your ultimate sales lead generator, focusing on actual pipeline growth and conversions rather than just impressions.",
      lightIconColor: "bg-blue-100 text-blue-600",
      darkIconColor: "bg-cyan-500/10 text-cyan-400",
      lightArrowColor: "text-blue-500",
      darkArrowColor: "text-cyan-400",
    },
    {
      number: "03",
      icon: FaRobot,
      title: "AI-Powered Optimization",
      description:
        "AI-driven targeting enhances your next email campaign and mobile advertising effort, pairing with the best app marketing to convert more visitors into loyal customers",
      lightIconColor: "bg-purple-100 text-purple-600",
      darkIconColor: "bg-purple-500/10 text-purple-400",
      lightArrowColor: "text-purple-500",
      darkArrowColor: "text-purple-400",
    },
    {
      number: "04",
      icon: FaChartBar,
      title: "Transparent Reporting",
      description:
        "Whether tracking a robust email marketing platform or lead generation through digital marketing, clear stats show exactly where your budget goes and what it earns.",
      lightIconColor: "bg-emerald-100 text-emerald-600",
      darkIconColor: "bg-[#d4e157]/10 text-[#d4e157]",
      lightArrowColor: "text-emerald-500",
      darkArrowColor: "text-[#d4e157]",
    },
    {
      number: "05",
      icon: FaExpandArrowsAlt,
      title: "Scalable Growth",
      description:
        "Scale what performs—from expert on & off page SEO by a premier SEO company to launching scalable affiliate programs and simplifying affiliate marketing for beginners",
      lightIconColor: "bg-cyan-100 text-cyan-600",
      darkIconColor: "bg-cyan-500/10 text-cyan-400",
      lightArrowColor: "text-cyan-500",
      darkArrowColor: "text-cyan-400",
    },
    {
      number: "06",
      icon: FaHeadset,
      title: "Dedicated Support",
      description:
        "Our team supports your email marketing service and email advertising needs, responding quickly at every step to reliably generate leads for your business.",
      lightIconColor: "bg-orange-100 text-orange-600",
      darkIconColor: "bg-orange-500/10 text-orange-400",
      lightArrowColor: "text-orange-500",
      darkArrowColor: "text-orange-400",
    },
  ];

  return (
    <section
      onClick={handleSectionClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSectionClick();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label="Learn more about BluConnet Media"
      className={`relative overflow-hidden py-20 lg:py-28 cursor-pointer transition-colors duration-500 ${
        isDarkMode
          ? "bg-[#050508]"
          : "bg-gradient-to-br from-cyan-50 via-white to-emerald-50"
      }`}
    >
      {/* =========================================================
          BACKGROUND DECORATIVE ELEMENTS
      ========================================================= */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Dots Pattern */}
        <div
          className={`absolute top-20 left-10 transition-opacity duration-500 ${
            isDarkMode ? "opacity-20" : "opacity-20"
          }`}
        >
          <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? "bg-[#d4e157]" : "bg-emerald-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Top Right Dots Pattern */}
        <div
          className={`absolute top-20 right-10 transition-opacity duration-500 ${
            isDarkMode ? "opacity-20" : "opacity-20"
          }`}
        >
          <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? "bg-cyan-400" : "bg-cyan-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Large Gradient Circle - Top Left */}
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl transition-all duration-700 ${
            isDarkMode
              ? "bg-gradient-to-br from-[#d4e157]/[0.06] to-[#06b6d4]/[0.05]"
              : "bg-gradient-to-br from-emerald-200/40 to-cyan-200/40"
          }`}
        />

        {/* Large Gradient Circle - Bottom Right */}
        <div
          className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl transition-all duration-700 ${
            isDarkMode
              ? "bg-gradient-to-br from-[#06b6d4]/[0.06] to-[#d4e157]/[0.04]"
              : "bg-gradient-to-br from-cyan-200/40 to-emerald-200/40"
          }`}
        />

        {/* Curved Line - Left */}
        <svg
          className={`absolute top-40 left-0 w-64 h-64 transition-opacity duration-500 ${
            isDarkMode ? "opacity-[0.08]" : "opacity-10"
          }`}
          viewBox="0 0 200 200"
        >
          <path
            d="M0,100 Q50,50 100,100 T200,100"
            fill="none"
            stroke={isDarkMode ? "#d4e157" : "#10b981"}
            strokeWidth="2"
          />
        </svg>

        {/* Curved Line - Right */}
        <svg
          className={`absolute bottom-40 right-0 w-64 h-64 transition-opacity duration-500 ${
            isDarkMode ? "opacity-[0.08]" : "opacity-10"
          }`}
          viewBox="0 0 200 200"
        >
          <path
            d="M0,100 Q50,150 100,100 T200,100"
            fill="none"
            stroke={isDarkMode ? "#06b6d4" : "#06b6d4"}
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* =========================================================
          MAIN CONTAINER
      ========================================================= */}

      <div className="w-full min-w-0 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-10 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-16 items-center min-w-0">
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 transition-colors duration-500 ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border-[#d4e157]/30"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                }`}
              />

              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-700"
                }`}
              >
                WHY CHOOSE US
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-3 text-left"
            >
              <span
                className={`block text-left ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                KEY BENEFITS
              </span>

              <span
  className={`text-transparent bg-clip-text bg-gradient-to-r text-left whitespace-nowrap ${
    isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600"
  }`}
>
  THAT DRIVE GROWTH
</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`text-xs sm:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-widest mb-6 text-left ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              STRATEGY × TECHNOLOGY × REAL RESULTS
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`text-sm sm:text-base leading-relaxed mb-10 max-w-lg text-left ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              At BluConnect Media, we accelerate predictable revenue through
              intelligent, performance-driven growth. We supercharge full-funnel
              marketing by combining AI integrations across every vital channel:
              from online lead generation services and expertise optimised SEO,
              to robust email marketing platforms and scalable affiliate
              programs. By synchronizing your prioritised digital footprint, we
              eliminate guesswork, reduce acquisition costs, and maximize
              conversion velocity. Brands tie with our Marketing expertise to
              transform fragmented outreach into a cohesive, high-converting
              engine that consistently delivers qualified b2b & b2c sales leads.
            </motion.p>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{
                      y: -5,
                      boxShadow: isDarkMode
                        ? "0 20px 40px rgba(0,0,0,0.35)"
                        : "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                    className={`group rounded-2xl p-5 border shadow-sm transition-all duration-300 text-left ${
                      isDarkMode
                        ? "bg-[#0b0d16]/90 border-white/[0.08] hover:border-[#d4e157]/25 hover:bg-[#0d101c]"
                        : "bg-white border-gray-100 hover:border-emerald-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isDarkMode
                            ? benefit.darkIconColor
                            : benefit.lightIconColor
                        }`}
                      >
                        <Icon className="text-xl" />
                      </div>

                      <span
                        className={`text-3xl font-black transition-colors ${
                          isDarkMode
                            ? "text-white/[0.06] group-hover:text-[#d4e157]/10"
                            : "text-gray-100 group-hover:text-emerald-100"
                        }`}
                      >
                        {benefit.number}
                      </span>
                    </div>

                    <h3
                      className={`font-bold mb-2 text-left transition-colors ${
                        isDarkMode
                          ? "text-white group-hover:text-[#d4e157]"
                          : "text-gray-900"
                      }`}
                    >
                      {benefit.title}
                    </h3>

                    <p
                      className={`text-sm leading-relaxed text-left ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {benefit.description}
                    </p>

                    <div
                      className={`mt-3 ${
                        isDarkMode
                          ? benefit.darkArrowColor
                          : benefit.lightArrowColor
                      } opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      <FaChartLine className="transform rotate-90" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              RIGHT VISUAL
          ===================================================== */}

          <div className="relative w-full min-w-0 max-w-[360px] sm:max-w-[500px] md:max-w-[560px] lg:max-w-none mx-auto mt-12 sm:mt-14 md:mt-16 lg:mt-0">
            {/* Script Text */}
            <motion.div
              initial={{ opacity: 0, rotate: -5, x: -20 }}
              whileInView={{ opacity: 1, rotate: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -top-6 sm:-top-8 left-6 sm:left-10 z-20"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              <h3
                className={`text-4xl sm:text-5xl lg:text-5xl leading-tight text-left ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                }`}
              >
                Your
                <br />
                Growth Partner
              </h3>
            </motion.div>

            {/* More Reach Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className={`absolute -top-8 sm:-top-9 md:-top-10 lg:top-4 right-2 sm:right-4 z-30 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-xl border transition-colors duration-500 ${
                isDarkMode
                  ? "bg-[#0b0d16]/95 border-white/10 backdrop-blur-xl"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${
                    isDarkMode ? "bg-cyan-500/10" : "bg-cyan-100"
                  }`}
                >
                  <FaChartLine
                    className={`text-sm sm:text-base ${
                      isDarkMode ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  />
                </div>

                <div className="text-left">
                  <p
                    className={`text-[10px] sm:text-xs font-semibold ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    More Reach.
                  </p>

                  <p
                    className={`text-[10px] sm:text-xs font-bold ${
                      isDarkMode ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  >
                    More Opportunities.
                  </p>

                  <p
                    className={`text-[10px] sm:text-xs font-bold ${
                      isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                    }`}
                  >
                    Greater Returns.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                MAIN IMAGE CONTAINER
            ================================================= */}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 transition-colors duration-500 ${
                isDarkMode
                  ? "border-[#d4e157]/15 bg-[#0b0d16]"
                  : "border-white bg-white"
              }`}
            >
              {/* Globe Background Effect */}
              <div
                className={`absolute inset-0 transition-colors duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-[#d4e157]/[0.06] to-[#06b6d4]/[0.06]"
                    : "bg-gradient-to-br from-emerald-100/50 to-cyan-100/50"
                }`}
              />

              {/* Image */}
              <img
                src={teamImage}
                alt="Team collaboration"
                className="w-full h-auto relative z-10 block"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 z-10 transition-colors duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-t from-[#050508]/95 via-[#050508]/10 to-transparent"
                    : "bg-gradient-to-t from-white/90 via-transparent to-transparent"
                }`}
              />

              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 lg:p-6"
              >
                <div
                  className={`backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl border transition-colors duration-500 ${
                    isDarkMode
                      ? "bg-[#0b0d16]/90 border-white/10"
                      : "bg-white/95 border-gray-100"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    {/* Clients */}
                    <div className="text-center">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-1.5 sm:mb-2 rounded-lg sm:rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-100"
                        }`}
                      >
                        <FaGlobe
                          className={`text-sm sm:text-lg lg:text-xl ${
                            isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                          }`}
                        />
                      </div>

                      <div
                        className={`text-lg sm:text-xl lg:text-2xl font-black ${
                          isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                        }`}
                      >
                        1000+
                      </div>

                      <div
                        className={`text-[9px] sm:text-xs font-medium ${
                          isDarkMode ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        Clients
                      </div>
                    </div>

                    {/* Countries */}
                    <div
                      className={`text-center border-x ${
                        isDarkMode ? "border-white/10" : "border-gray-200"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-1.5 sm:mb-2 rounded-lg sm:rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-cyan-500/10" : "bg-cyan-100"
                        }`}
                      >
                        <FaUsers
                          className={`text-sm sm:text-lg lg:text-xl ${
                            isDarkMode ? "text-cyan-400" : "text-cyan-600"
                          }`}
                        />
                      </div>

                      <div
                        className={`text-lg sm:text-xl lg:text-2xl font-black ${
                          isDarkMode ? "text-cyan-400" : "text-cyan-600"
                        }`}
                      >
                        150+
                      </div>

                      <div
                        className={`text-[9px] sm:text-xs font-medium ${
                          isDarkMode ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        Countries
                      </div>
                    </div>

                    {/* Awards */}
                    <div className="text-center">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-1.5 sm:mb-2 rounded-lg sm:rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-100"
                        }`}
                      >
                        <FaTrophy
                          className={`text-sm sm:text-lg lg:text-xl ${
                            isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                          }`}
                        />
                      </div>

                      <div
                        className={`text-lg sm:text-xl lg:text-2xl font-black ${
                          isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                        }`}
                      >
                        12
                      </div>

                      <div
                        className={`text-[9px] sm:text-xs font-medium ${
                          isDarkMode ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        Awards 2025
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className={`w-full min-w-0 text-center mt-4 sm:mt-6 lg:mt-6 text-[10px] min-[375px]:text-xs sm:text-sm md:text-base lg:text-sm font-bold uppercase tracking-normal sm:tracking-[0.1em] lg:tracking-widest break-words ${
                isDarkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Connecting Brands to a Brighter Tomorrow
            </motion.p>
          </div>
        </div>
      </div>

      {/* =========================================================
          DANCING SCRIPT FONT
      ========================================================= */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
