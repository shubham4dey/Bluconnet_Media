import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// Import image properly
import statsImage from "../assets/img/h1.png";

const Stats = () => {
  const { isDarkMode } = useTheme();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      number: "$8.6 BILLION",
      label: "CLIENT REVENUE DRIVEN (2025)",
    },
    {
      number: "110M+",
      label: "CONVERSIONS DRIVEN (2025)",
    },
    {
      number: "$430M+",
      label: "ANNUAL MEDIA SPEND (2025)",
    },
    { number: "30+", label: "AWARDS WON" },
    { number: "1000+", label: "ACTIVE CLIENTS MANAGED" },
    {
      number: "4",
      label: "CLIENTS IN FORTUNE 500'S TOP 10",
    },
  ];

  return (
    <section
      className={`py-20 md:py-28 px-4 relative ${isDarkMode ? "bg-[#050508]" : "bg-white"} overflow-hidden transition-colors duration-500`}
    >
      {/* Background Gradient */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l ${isDarkMode ? "from-[#d4e157]/5 to-transparent" : "from-emerald-500/5 to-transparent"}`}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Image with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-lg mx-auto lg:mx-0"
            style={{ perspective: "1000px" }}
          >
            {/* Main 3D Image Container */}
            <motion.div
              initial={{ rotateY: -15, rotateX: 5, opacity: 0 }}
              whileInView={{ rotateY: 0, rotateX: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring" }}
              className="relative transform-gpu"
              style={{ 
                transformStyle: "preserve-3d",
                transform: "rotateY(-5deg) rotateX(5deg)"
              }}
            >
              {/* Middle Layer - Colored Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? "from-[#1a1f3a] to-[#0f1535]" : "from-slate-100 to-white"} rounded-3xl transform translate-z-[-15px] border-2 ${isDarkMode ? "border-white/20" : "border-gray-200"}`}
              />

              {/* Front Layer - Main Image */}
              <div
                className={`relative rounded-3xl overflow-hidden border-2 ${isDarkMode ? "border-[#d4e157]/40" : "border-emerald-500/40"} shadow-none transform translate-z-[0px]`}
              >
                {/* Image Container */}
                <div className="relative w-full min-h-[520px] sm:min-h-[580px] md:min-h-[650px] flex items-center justify-center p-4">
                  <img
                    src={statsImage}
                    alt="Marketing Success"
                    className="w-full h-auto max-h-[600px] object-contain drop-shadow-xl"
                    style={{ transform: "translateZ(20px)" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />

                  {/* Fallback Placeholder */}
                  <div
                    className={`hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br ${isDarkMode ? "from-[#0f1535] to-[#1a1f3a]" : "from-white to-slate-50"}`}
                  >
                    <div className="text-center px-4">
                      <div
                        className={`w-24 h-24 mx-auto mb-4 ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-100"} rounded-full flex items-center justify-center`}
                      >
                        <svg
                          className={`w-12 h-12 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <p
                        className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}
                      >
                        Add your image to
                        <br />
                        src/assets/img/h1.png
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Floating Badge - Bottom Left with BLACK dot */}
              <motion.div
                initial={{ scale: 0, rotate: -10, z: 30 }}
                whileInView={{ scale: 1, rotate: 0, z: 30 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className={`absolute bottom-6 left-6 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]" : "bg-gradient-to-r from-emerald-500 to-cyan-600"} px-5 py-3 rounded-xl font-bold text-sm shadow-lg z-20`}
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isDarkMode ? "bg-black" : "bg-white"}`}></div>
                  <span className={isDarkMode ? "text-[#0a0e27]" : "text-white"}>
                    10+ Years Excellence
                  </span>
                </div>
              </motion.div>

              {/* Top Right Badge */}
              <motion.div
                initial={{ scale: 0, rotate: 10, z: 30 }}
                whileInView={{ scale: 1, rotate: 0, z: 30 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className={`absolute top-6 right-6 ${isDarkMode ? "bg-[#0f1535] border-white/20" : "bg-white/90 border-gray-200"} backdrop-blur-sm border-2 px-4 py-2 rounded-xl shadow-lg z-20`}
                style={{ transform: "translateZ(40px)" }}
              >
                <div className={`text-xs font-bold ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} uppercase tracking-wider`}>
                  Est. 2018
                </div>
              </motion.div>

              {/* Animated Corner Decorations */}
              <div className={`absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 ${isDarkMode ? "border-[#d4e157]/40" : "border-emerald-500/40"} rounded-tr-2xl`} style={{ transform: "translateZ(30px)" }} />
              <div className={`absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 ${isDarkMode ? "border-[#06b6d4]/40" : "border-cyan-600/40"} rounded-bl-2xl`} style={{ transform: "translateZ(30px)" }} />
            </motion.div>

            {/* Floating Stats Cards - 3D Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20, z: -50 }}
              whileInView={{ opacity: 1, y: 0, z: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, type: "spring" }}
              className={`absolute -bottom-6 -right-6 ${isDarkMode ? "bg-[#0f1535] border-white/10" : "bg-white border-gray-200"} border-2 rounded-2xl p-4 shadow-lg hidden lg:block`}
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-100"} flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>1000+</div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Happy Clients</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div ref={ref} className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${
                  isDarkMode
                    ? "bg-[#d4e157]/10 text-[#d4e157] border border-[#d4e157]/30"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
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

                <span className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}>
                  OUR TRACK RECORD
                </span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 md:mb-12 leading-tight"
            >
              <span
                className={`font-black leading-tight mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
              >
                10+ YEARS OF{" "}
              </span>
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
              >
                MARKETING SUCCESS
              </span>
            </motion.h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:gap-x-10 md:gap-y-12 text-center lg:text-left">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group cursor-pointer"
                >
                  <h3
                    className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2 group-hover:${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} transition-colors duration-300`}
                  >
                    {stat.number}
                  </h3>
                  <div
                    className={`h-0.5 w-12 mx-auto lg:mx-0 bg-gradient-to-r ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    } mb-3 group-hover:w-20 transition-all duration-300`}
                  ></div>
                  <p
                    className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide group-hover:${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} transition-colors`}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add CSS for 3D transforms */}
      <style>{`
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .translate-z-\\[-30px\\] {
          transform: translateZ(-30px);
        }
        .translate-z-\\[-15px\\] {
          transform: translateZ(-15px);
        }
        .translate-z-\\[0px\\] {
          transform: translateZ(0px);
        }
        .translate-z-\\[20px\\] {
          transform: translateZ(20px);
        }
        .translate-z-\\[30px\\] {
          transform: translateZ(30px);
        }
        .translate-z-\\[40px\\] {
          transform: translateZ(40px);
        }
        .translate-z-\\[50px\\] {
          transform: translateZ(50px);
        }
      `}</style>
    </section>
  );
};

export default Stats;