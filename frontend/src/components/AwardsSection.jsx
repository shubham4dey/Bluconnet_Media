import React from "react";
import { motion } from "framer-motion";
import { FaAward, FaStar, FaTrophy, FaMedal, FaGem } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const AwardsSection = () => {
  const { isDarkMode } = useTheme();

  const awards = [
    {
      name: "GLOBAL PERFORMANCE MARKETING AWARDS",
      years: "2022, 2021, 2020, 2019, 2018, 2017",
      icon: FaTrophy,
    },
    {
      name: "PERFORMANCE MARKETING AWARDS",
      years: "2025, 2023, 2022, 2021, 2020",
      icon: FaMedal,
    },
    { name: "PARTNERSHIP AWARDS", years: "2025, 2024", icon: FaAward },
    { name: "EUROPEAN AFFILIATE AWARDS", years: "2025", icon: FaStar },
    { name: "GLOBAL INFLUENCER MARKETING AWARDS", years: "2023", icon: FaStar },
    { name: "AWIN", years: "2025, 2019", icon: FaGem },
    { name: "GLASSDOOR", years: "2019, 2018", icon: FaAward },
    { name: "Entrepreneur", years: "2018, 2017", icon: FaTrophy },
    { name: "BOSTON BUSINESS JOURNAL", years: "2021", icon: FaMedal },
  ];

  // Card backgrounds - EXPLICITLY MATCHED TO WHO WE ARE THEME
  const cardBgColors = isDarkMode
    ? [
        "from-[#d4e157]/20 to-[#06b6d4]/20 border-[#d4e157]/40 hover:border-[#d4e157]/80",
        "from-[#d4e157]/20 to-[#06b6d4]/20 border-[#d4e157]/40 hover:border-[#d4e157]/80",
        "from-yellow-500/20 to-amber-600/20 border-yellow-500/40 hover:border-yellow-500/80",
        "from-rose-500/20 to-pink-600/20 border-rose-500/40 hover:border-rose-500/80",
        "from-purple-500/20 to-violet-600/20 border-purple-500/40 hover:border-purple-500/80",
        "from-gray-400/20 to-gray-500/20 border-gray-400/40 hover:border-gray-400/80",
        "from-teal-500/20 to-emerald-600/20 border-teal-500/40 hover:border-teal-500/80",
        "from-orange-500/20 to-red-600/20 border-orange-500/40 hover:border-orange-500/80",
        "from-indigo-500/20 to-blue-600/20 border-indigo-500/40 hover:border-indigo-500/80",
      ]
    : [
        // Day mode - matched to WhoWeAre theme (emerald/cyan gradients)
        "from-emerald-100 to-cyan-100 border-emerald-300 hover:border-emerald-400",
        "from-lime-100 to-emerald-100 border-lime-300 hover:border-lime-400",
        "from-amber-100 to-orange-100 border-amber-300 hover:border-amber-400",
        "from-rose-100 to-pink-100 border-rose-300 hover:border-rose-400",
        "from-violet-100 to-purple-100 border-violet-300 hover:border-violet-400",
        "from-slate-100 to-gray-100 border-slate-300 hover:border-slate-400",
        "from-teal-100 to-emerald-100 border-teal-300 hover:border-teal-400",
        "from-orange-100 to-red-100 border-orange-300 hover:border-orange-400",
        "from-indigo-100 to-blue-100 border-indigo-300 hover:border-indigo-400",
      ];

  // Text colors for cards - EXPLICITLY MATCHED
  const cardTextColors = isDarkMode
    ? "text-white group-hover:text-white"
    : "text-gray-900 group-hover:text-gray-900";

  // Year tag colors - EXPLICITLY MATCHED
  const yearTagColors = isDarkMode
    ? "bg-white/10 border-white/20 text-gray-300"
    : "bg-white/60 border-white/80 text-gray-700";

  return (
    <section
      className={`py-20 md:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      {/* Animated Background Waves */}
      <div className="absolute inset-0 opacity-20">
        <div
          className={`absolute top-20 left-0 w-full h-32 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157]/20 to-[#06b6d4]/20" : "from-emerald-500/10 to-cyan-600/10"} blur-xl`}
        ></div>
        <div
          className={`absolute bottom-40 left-0 w-full h-32 bg-gradient-to-r ${isDarkMode ? "from-[#06b6d4]/20 to-[#d4e157]/20" : "from-cyan-600/10 to-emerald-500/10"} blur-xl`}
        ></div>
      </div>

      {/* Floating Geometric Shapes - EXPLICITLY MATCHED TO THEME */}
     <div
  className={`absolute
    top-20 sm:top-24 md:top-24 lg:top-20
    right-4 sm:right-8 md:right-12 lg:right-20
    w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32
    pointer-events-none animate-pulse
    ${isDarkMode ? "opacity-10" : "opacity-20"}
  `}
>
        <svg
  viewBox="0 0 100 100"
  className={`w-full h-full ${
    isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
  }`}
>
  <circle
    cx="50"
    cy="50"
    r="40"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  />
  <circle
    cx="50"
    cy="50"
    r="28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  />
</svg>
      </div>
      <div
        className={`absolute bottom-32 left-16 w-24 h-24 pointer-events-none animate-pulse ${
          isDarkMode ? "opacity-10" : "opacity-20"
        }`}
        style={{ animationDelay: "1s" }}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${
            isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"
          }`}
        >
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            transform="rotate(45 50 50)"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Counter Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={`inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full ${
              isDarkMode
                ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30"
                : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
            }`}
          >
            <FaStar
              className={`text-lg sm:text-xl lg:text-2xl animate-pulse ${
                isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
              }`}
            />
            <span
              className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
            >
              INDUSTRY RECOGNITION
            </span>
          </motion.div>

          <h2
            className={`font-black leading-tight mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
          >
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              30+
            </span>
            <br className="md:hidden" />
            <span className="hidden md:inline"> </span>
            AWARDS & HONORS
          </h2>

          <p
            className={`text-base md:text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Our focused, data-driven approach to digital marketing has generated
            massive returns for our clients and earned us a reputation for
            excellence.
          </p>
        </motion.div>

        {/* Awards Grid - All Cards Same Height */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, rotateX: 5 }}
              className={`group relative bg-gradient-to-br ${cardBgColors[index]} backdrop-blur-sm border-2 rounded-2xl p-5 md:p-6 overflow-hidden transition-all duration-500 flex flex-col h-full min-h-[280px] ${
                isDarkMode ? "" : "shadow-lg shadow-gray-200/50"
              }`}
            >
              {/* Glass Reflection Effect */}
              <div
                className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b ${
                  isDarkMode
                    ? "from-white/10 to-transparent"
                    : "from-white/40 to-transparent"
                } pointer-events-none`}
              ></div>

              {/* Corner Accent */}
              <div className="absolute top-4 right-4 transition-all duration-500 opacity-10 group-hover:opacity-35 group-hover:scale-110">
                <award.icon
                  className={`w-14 h-14 ${
                    isDarkMode ? "text-white" : "text-slate-700"
                  }`}
                />
              </div>

              <div className="relative z-10 flex flex-col flex-1">
                {/* Icon Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${
                    isDarkMode
                      ? "from-white/20 to-white/5 border-white/30"
                      : "from-white/60 to-white/40 border-white/60"
                  } border flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                >
                  <award.icon
                    className={`w-7 h-7 ${
                      isDarkMode ? "text-white" : "text-gray-700"
                    }`}
                  />
                </motion.div>

                {/* Award Name - EXPLICITLY MATCHED TEXT COLOR */}
                <h3
                  className={`text-lg md:text-xl font-bold mb-3 leading-tight transition-colors duration-300 flex-1 ${cardTextColors}`}
                >
                  {award.name}
                </h3>

                {/* Years as Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {award.years.split(", ").map((year, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 + i * 0.05 }}
                      className={`px-3 py-1 backdrop-blur-sm border rounded-lg text-xs font-bold transition-all duration-300 ${yearTagColors}`}
                    >
                      {year}
                    </motion.span>
                  ))}
                </div>

                {/* Bottom Accent Line */}
                <div
                  className={`mt-auto h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${
                    isDarkMode
                      ? "from-white/60 to-white/20"
                      : "from-gray-400/60 to-gray-300/20"
                  } transition-all duration-500`}
                ></div>
              </div>

              {/* Hover Glow */}
              <div
                className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isDarkMode ? "bg-white/10" : "bg-white/30"
                }`}
              ></div>
            </motion.div>
          ))}
        </div>

        {/* Stats Footer - EXPLICITLY MATCHED TO THEME */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: "30+", label: "Total Awards", icon: FaTrophy },
            { number: "12", label: "In 2025", icon: FaStar },
            { number: "9", label: "Categories", icon: FaAward },
            { number: "8", label: "Years Won", icon: FaMedal },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`text-center p-5 md:p-6 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-white/5 to-white/0 border-white/10 hover:border-white/20"
                  : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-emerald-300 shadow-lg shadow-gray-200/50"
              }`}
            >
              <stat.icon
                className={`w-8 h-8 mx-auto mb-3 ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
                }`}
              />
              <div
                className={`text-3xl font-black mb-1 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {stat.number}
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AwardsSection;
