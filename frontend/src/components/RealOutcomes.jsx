import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Images import karein
import leColImage from "../assets/img/hh1.png";
import tuiImage from "../assets/img/hh2.png";
import vistaprintImage from "../assets/img/hh3.png";
import tiktokImage from "../assets/img/hh4.png";
import swarovskiImage from "../assets/img/hh5.png";

const RealOutcomes = () => {
  const caseStudyPDF = process.env.PUBLIC_URL + "/_Case Study.pdf";
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const caseStudies = [
    {
      company: "Le Col",
      title:
        "Le Col Grows Affiliate Revenue Contribution 282% with Global Partnership Expertise",
      description:
        "Acceleration Partners has supported Le Col's affiliate program for over six years, scaling sales across the U.K., U.S. and DE through in-market expertise, local partner relationships, and tailored strategies for awareness and acquisition.",
      stats: [
        { value: "+282%", label: "AFFILIATE REVENUE CONTRIBUTION" },
        { value: "+31%", label: "GLOBAL REVENUE YOY" },
        { value: "+146%", label: "US REVENUE YOY" },
        { value: "+16%", label: "UK REVENUE YOY" },
      ],
      bgColor: "bg-gradient-to-br from-yellow-400 via-orange-500 to-orange-600",
      image: leColImage,
    },
    {
      company: "TUI",
      title:
        "TUI Grows Incremental Voucher Conversions from 37% to 60% with Data-Driven Affiliate Strategy",
      description:
        "By partnering with Acceleration Partners and impact.com, TUI challenged the industry perception of voucher partners and set a new standard for measuring and rewarding incremental performance.",
      stats: [
        {
          value: "37% to 60%",
          label: "INCREASE IN BOOKING CONVERSIONS FROM INCREMENTAL PARTNERS",
        },
        { value: "141%", label: "INCREASE IN BOOKINGS FROM TOP PAYOUT TIER" },
      ],
      bgColor: "bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600",
      image: tuiImage,
    },
    {
      company: "Vistaprint",
      title:
        "Vistaprint Reduces Affiliate Channel Costs 23% with Custom Incrementality Scorecard",
      description:
        "Senior leadership couldn't quantify what the affiliate channel drove incrementally, limiting investment confidence. AP built a custom incrementality scorecard to measure each partner's contribution and reallocated spend toward the most incremental partners to maximize channel effectiveness.",
      stats: [
        { value: "23%", label: "REDUCTION IN COSTS" },
        { value: "33%", label: "DROP IN AVERAGE CPA" },
      ],
      bgColor: "bg-gradient-to-br from-blue-400 via-cyan-500 to-cyan-600",
      image: vistaprintImage,
    },
    {
      company: "TikTok",
      title:
        "TikTok for Business Drives 3x Partner Growth with Global Partnership Strategy",
      description:
        "By partnering with Acceleration Partners, TikTok for Business rapidly scaled global growth through a unique partnership marketing strategy that tripled partner growth.",
      stats: [
        { value: "75%", label: "REDUCTION IN MANUAL TASKS" },
        { value: "500+", label: "AGENCIES IN JUST MONTHS" },
      ],
      highlights: [
        "Global partnership expertise drives significant global growth",
        "Bespoke partner solutions tailored for enterprise brands",
      ],
      bgColor:
        "bg-gradient-to-br from-green-400 via-emerald-500 to-emerald-600",
      image: tiktokImage,
    },
    {
      company: "Swarovski",
      title:
        "Swarovski Migrates Global Affiliate Program and Activates 81% of Partners in 2 Weeks",
      description:
        "Swarovski wanted to migrate its affiliate program to one affiliate platform with impact.com. The client had a complex global affiliate program covering 20+ countries and conducted a brand repositioning concurrently.",
      stats: [
        { value: "81%", label: "OF PARTNERS SALE-ACTIVE IN TWO WEEKS" },
        { value: "98%", label: "OF TOTAL REVENUE MIGRATED IN THREE WEEKS" },
      ],
      bgColor: "bg-gradient-to-br from-purple-500 via-pink-500 to-pink-600",
      image: swarovskiImage,
    },
  ];

  const next = () => setCurrentIndex((prev) => (prev + 1) % caseStudies.length);
  const prev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + caseStudies.length) % caseStudies.length,
    );

  return (
    <section
      id="real-outcomes"
      className={`py-20 md:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      {/* Diagonal Stripes - Right Side */}
      <div
        className={`absolute right-0 top-0 w-full md:w-1/3 h-full pointer-events-none ${isDarkMode ? "opacity-10" : "opacity-5"}`}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 15px, ${isDarkMode ? "#d4e157" : "#10b981"} 15px, ${isDarkMode ? "#d4e157" : "#10b981"} 30px)`,
            backgroundSize: "42.42px 42.42px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Theme Colors with Card Background */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-start"
        >
          <div
            className={`inline-flex items-center gap-4 px-4 py-3 md:px-6 md:py-4 rounded-2xl border shadow-lg ${
              isDarkMode
                ? "bg-white/5 border-white/10 shadow-black/20"
                : "bg-emerald-50 border-emerald-200 shadow-emerald-100/50"
            }`}
          >
            <div
              className={`w-12 h-12 md:w-16 md:h-16 ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-100"} rounded-full flex items-center justify-center`}
            >
              <div
                className={`w-6 h-6 md:w-8 md:h-8 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full`}
              ></div>
            </div>
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              REAL OUTCOMES
            </h2>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`${isDarkMode ? "bg-[#0f1535]" : "bg-white"} rounded-3xl overflow-hidden ${isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"} shadow-2xl`}
            >
              <div className="grid lg:grid-cols-2">
                {/* Left Side: Content */}
                <div className="p-6 md:p-10 lg:p-12 flex flex-col">
                  {/* Company Name */}
                  <div
                    className={`text-xl md:text-2xl lg:text-3xl font-black text-start text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} mb-3 uppercase tracking-tight`}
                  >
                    {caseStudies[currentIndex].company}
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-lg md:text-xl lg:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} text-start mb-4 leading-snug`}
                  >
                    {caseStudies[currentIndex].title}
                  </h3>

                  <div
                    className={`h-1 w-full bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} mb-6 rounded-full`}
                  ></div>

                  {/* Description */}
                  <p
                    className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm md:text-base text-start leading-relaxed mb-6`}
                  >
                    {caseStudies[currentIndex].description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6">
                    {caseStudies[currentIndex].stats.map((stat, i) => (
                      <div key={i}>
                        <div
                          className={`text-xl md:text-2xl lg:text-3xl font-black text-start text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} mb-1`}
                        >
                          {stat.value}
                        </div>
                        <div
                          className={`text-xs md:text-sm font-bold ${isDarkMode ? "text-gray-400" : "text-gray-600"} uppercase text-start tracking-wide`}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights (for TikTok) */}
                  {caseStudies[currentIndex].highlights && (
                    <div className="mb-6 space-y-2">
                      {caseStudies[currentIndex].highlights.map(
                        (highlight, i) => (
                          <div
                            key={i}
                            className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} font-medium text-sm md:text-base`}
                          >
                            <span
                              className={`font-bold ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                            >
                              {highlight.split(" ")[0]}{" "}
                              {highlight.split(" ")[1]}
                            </span>{" "}
                            {highlight.split(" ").slice(2).join(" ")}
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Button - Theme Colors */}
                  <motion.a
                    href={caseStudyPDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative overflow-hidden group self-start px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r font-bold rounded-lg transition-all duration-300 uppercase text-sm tracking-wider mt-auto flex items-center gap-2 ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                        : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                    }`}
                  >
                    {/* Animated Shine/Sweep Effect on Hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                    <span className="relative z-20 flex items-center gap-2">
                      VIEW CASE STUDY
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.a>
                </div>

                {/* Right Side: Image with Overlay - Fixed Equal Height */}
                <div
                  className={`relative ${caseStudies[currentIndex].bgColor} h-[320px] sm:h-[380px] md:h-[500px] lg:h-[600px] overflow-hidden`}
                >
                  {/* Background Image - Object Cover for Equal Size */}
                  <img
                    src={caseStudies[currentIndex].image}
                    alt={`${caseStudies[currentIndex].company} case study`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Overlay Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? "from-[#0a0e27]/80 via-[#0a0e27]/40 to-transparent" : "from-black/20 via-black/10 to-transparent"}`}
                  ></div>

                  {/* Company Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 text-4xl md:text-7xl lg:text-9xl font-black text-white select-none">
                    {caseStudies[currentIndex].company.toUpperCase()}
                  </div>

                  {/* Case Study Circle */}
                  <div className="relative z-10 text-center p-6 flex items-center justify-center h-full group">
                    <div
                      className="
                      w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44
                      bg-white/20 backdrop-blur-md 
                      rounded-full flex items-center justify-center
                      border-2 border-white/30
                      opacity-0 scale-90
                      group-hover:opacity-100
                      group-hover:scale-100
                      transition-all duration-500
                    "
                    >
                      <span className="text-white font-bold text-base md:text-lg lg:text-xl">
                        Case Study
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator - Mobile & Desktop */}
          <div className="flex justify-center gap-2 mt-6 mb-4">
            {caseStudies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? `${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} w-6 md:w-8`
                    : `${isDarkMode ? "bg-white/20 hover:bg-white/40" : "bg-gray-300 hover:bg-gray-400"}`
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={prev}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} flex items-center justify-center hover:shadow-lg transition shadow-lg`}
              aria-label="Previous case study"
            >
              <FaArrowLeft
                className={`${isDarkMode ? "text-[#0a0e27]" : "text-white"} text-sm md:text-lg`}
              />
            </button>
            <button
              onClick={next}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} flex items-center justify-center hover:shadow-lg transition shadow-lg`}
              aria-label="Next case study"
            >
              <FaArrowRight
                className={`${isDarkMode ? "text-[#0a0e27]" : "text-white"} text-sm md:text-lg`}
              />
            </button>
          </div>

          {/* ===== PREMIUM STYLISH "VIEW ALL" BUTTON ===== */}
          <div className="text-center mt-10">
            <motion.a
              href={caseStudyPDF}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden group inline-flex items-center px-8 py-4 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 gap-3 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
              }`}
            >
              {/* Animated Shine/Sweep Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

              <span className="relative z-20 flex items-center gap-3">
                VIEW ALL CASE STUDIES
                <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealOutcomes;
