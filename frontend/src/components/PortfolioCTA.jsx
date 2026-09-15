import React from "react";
import { motion, useInView } from "framer-motion";
import {
  FaAward,
  FaRocket,
  FaFilePdf,
  FaFolderOpen,
  FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const PortfolioCTA = () => {
  const { isDarkMode } = useTheme();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const portfolioUrl =
    "https://bluconnetmedia.com/wp-content/uploads/2025/12/Bluconnet-Media-Portfolio.pdf";

  // Memoized stats data
  const stats = React.useMemo(
    () => [
      { num: "500+", label: "Projects Done", icon: FaFolderOpen },
      { num: "1000+", label: "Happy Clients", icon: FaAward },
      { num: "30+", label: "Awards Won", icon: FaRocket },
      { num: "99%", label: "Success Rate", icon: FaAward },
    ],
    []
  );

  return (
    <section
      className={`py-16 md:py-24 lg:py-32 px-4 relative overflow-hidden ${
        isDarkMode ? "bg-[#050508]" : "bg-white"
      }`}
    >
      {/* Simplified Background - Better Performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDarkMode ? "bg-emerald-500/10" : "bg-emerald-300/20"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 ${
            isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-300/20"
          }`}
        />
      </div>

      {/* Simplified Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode ? "#d4e157" : "#10b981"
          } 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={`relative ${
            isDarkMode ? "bg-white/5" : "bg-white/80"
          } backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 border ${
            isDarkMode ? "border-white/10" : "border-gray-200"
          } shadow-2xl overflow-hidden`}
        >
          {/* Simplified Gradient Border */}
          <div
            className={`absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-r ${
              isDarkMode
                ? "from-[#d4e157] via-[#06b6d4] to-[#d4e157]"
                : "from-emerald-500 via-cyan-600 to-emerald-500"
            } opacity-30`}
          >
            <div
              className={`w-full h-full rounded-3xl ${
                isDarkMode ? "bg-[#0a0e27]" : "bg-slate-50"
              }`}
            />
          </div>

          {/* Simplified Floating Icons - Better Performance */}
          <div
            className={`absolute top-10 left-10 w-16 h-16 rounded-2xl ${
              isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-100/50"
            } flex items-center justify-center`}
          >
            <FaAward
              className={`text-3xl ${
                isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
              }`}
            />
          </div>

          <div
            className={`absolute bottom-10 right-10 w-16 h-16 rounded-2xl ${
              isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-100/50"
            } flex items-center justify-center`}
          >
            <FaRocket
              className={`text-3xl ${
                isDarkMode ? "text-[#06b6d4]" : "text-cyan-500"
              }`}
            />
          </div>

          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${
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
                Our Work Speaks
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className={`font-black leading-tight mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } text-3xl sm:text-4xl md:text-5xl lg:text-6xl`}
            >
              Explore Our{" "}
              <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                Award-Winning Portfolio
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className={`text-base md:text-xl max-w-3xl mx-auto mb-12 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Discover how we've transformed brands and delivered exceptional
              results. From innovative campaigns to strategic digital solutions,
              see the work that has earned us industry recognition.
            </motion.p>

            {/* Stats Grid - Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group p-6 ${
                    isDarkMode ? "bg-white/5" : "bg-white/80"
                  } rounded-2xl border ${
                    isDarkMode ? "border-white/10" : "border-gray-200"
                  } hover:border-transparent transition-all duration-300 text-center relative overflow-hidden ${
                    isDarkMode
                      ? "hover:bg-gradient-to-br hover:from-[#d4e157] hover:to-[#06b6d4]"
                      : "hover:bg-gradient-to-br hover:from-emerald-500 hover:to-cyan-600"
                  }`}
                >
                  <stat.icon
                    className={`w-8 h-8 mx-auto mb-3 ${
                      isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
                    } group-hover:text-white transition-colors duration-300`}
                  />
                  <div
                    className={`text-2xl md:text-3xl font-black ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } group-hover:text-white mb-1 transition-colors duration-300`}
                  >
                    {stat.num}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } group-hover:text-white/90 transition-colors duration-300`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Dual CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* Primary Button - Portfolio Page */}
              <Link
                to="/portfolio"
                className={`group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-lg hover:shadow-xl"
                    : "from-emerald-500 to-cyan-600 text-white shadow-lg hover:shadow-xl"
                } font-bold text-lg rounded-2xl transition-all duration-300 overflow-hidden hover:scale-105 active:scale-95`}
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <FaFolderOpen className="text-xl group-hover:scale-110 transition-transform duration-300 relative z-10" />
                <span className="relative z-10">View Portfolio</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              </Link>

              {/* Secondary Button - PDF Download - FIXED COLOR */}
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 ${
                  isDarkMode
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    : "bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100"
                } border-2 font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:border-transparent hover:shadow-lg overflow-hidden`}
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <FaFilePdf className="text-lg group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <span className="relative z-10">Preview PDF</span>
                <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                  New Tab
                </span>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-10 flex flex-wrap justify-center gap-6 text-sm"
            >
              {[
                "Industry Leading",
                "Client Approved",
                "Award Winning",
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    }`}
                  />
                  <span>{badge}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioCTA;