import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import {
  FaBullseye,
  FaEye,
  FaLightbulb,
  FaHeart,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import getThemeColors from "../utils/themeColors";

const MissionVision = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: FaBullseye,
      title: "Innovation First",
      desc: "Pushing boundaries with creative, next-generation digital solutions.",
    },
    {
      icon: FaHeart,
      title: "Unmatched Passion",
      desc: "Dedicated to excellence and genuine care in everything we build.",
    },
    {
      icon: FaEye,
      title: "Global Vision",
      desc: "Transforming local brands into recognized industry leaders worldwide.",
    },
    {
      icon: FaLightbulb,
      title: "Smart Strategy",
      desc: "Data-driven approaches tailored for maximum, measurable impact.",
    },
  ];

  const missionPoints = [
    "Results-Driven Strategies",
    "Client-Centric Approach",
    "Continuous Innovation",
  ];
  const visionPoints = [
    "Global Recognition",
    "Industry Leadership",
    "Sustainable Growth",
  ];

  return (
    <section
      className={`py-32 px-4 relative overflow-hidden ${
        isDarkMode ? "bg-[#050508]" : "bg-white"
      }`}
    >
      {/* 1. Premium SVG Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Animated Background Orbs - WhoWeAre jaise colors */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, -60, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] ${isDarkMode ? "bg-[#d4e157]/15" : "bg-emerald-500/10"}`}
      />
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 60, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] ${isDarkMode ? "bg-[#06b6d4]/15" : "bg-cyan-600/10"}`}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Premium Badge - Same as WHO WE ARE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
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
                className={`w-2.5 h-2.5 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full`}
              ></span>
              <span
                className={`absolute inset-0 w-2.5 h-2.5 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full animate-ping opacity-75`}
              ></span>
            </div>
            <span
              className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
            >
              MISSION & VISION
            </span>
          </motion.div>

          <h2
             className={`font-black leading-tight mb-6 ${isDarkMode ? "text-white" : "text-gray-900"} text-3xl  sm:text-3xl sm:text-3xl lg:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`}
          >
            Driven by{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              Purpose
            </span>
          </h2>
          <p
            className={`text-base md:text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            We don't just build digital products; we craft experiences that
            redefine industries and set new benchmarks for excellence.
          </p>
        </motion.div>

        {/* Bento Grid Layout for Mission & Vision */}
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-32">
          {/* Mission Card (Spans 7 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`group lg:col-span-7 relative p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
              isDarkMode
                ? "bg-white/5 border-white/10 hover:border-[#d4e157]/30"
                : "bg-white/80 border-gray-200 hover:border-emerald-500/30"
            } backdrop-blur-2xl shadow-2xl`}
          >
            {/* Giant Watermark */}
            <span
              className={`absolute -top-6 -right-6 text-[140px] md:text-[180px] font-black leading-none opacity-[0.03] select-none pointer-events-none ${colors.textColor}`}
            >
              01
            </span>

            {/* Animated Top Gradient Line */}
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4]"
                  : "from-emerald-500 to-cyan-600"
              } scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}
            ></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  } flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <FaBullseye className="text-white text-3xl" />
                  {/* Icon Glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    } blur-xl opacity-50 group-hover:opacity-80 transition-opacity`}
                  ></div>
                </div>
                <h3
                  className={`text-3xl md:text-4xl font-black ${colors.textColor} tracking-tight`}
                >
                  Our Mission
                </h3>
              </div>

              <p
                className={`text-lg md:text-xl ${colors.textMuted} leading-relaxed mb-10 max-w-2xl`}
              >
                To empower businesses with innovative digital solutions that
                drive measurable growth, enhance brand visibility, and create
                lasting connections with their target audiences.
              </p>

              {/* Centered Mission Points - Horizontal Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className={`flex flex-wrap items-center justify-center gap-6 md:gap-8 p-6 rounded-2xl border-2 ${
                  isDarkMode
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-50/80 border-gray-200"
                }`}
              >
                {missionPoints.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                        isDarkMode
                          ? "from-[#d4e157] to-[#06b6d4]"
                          : "from-emerald-500 to-cyan-600"
                      } flex items-center justify-center flex-shrink-0 shadow-md`}
                    >
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <span
                      className={`text-sm font-bold ${colors.textColor} whitespace-nowrap`}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Vision Card (Spans 5 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`group lg:col-span-5 relative p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 overflow-hidden flex flex-col justify-between ${
              isDarkMode
                ? "bg-white/5 border-white/10 hover:border-[#06b6d4]/30"
                : "bg-white/80 border-gray-200 hover:border-cyan-500/30"
            } backdrop-blur-2xl shadow-2xl`}
          >
            <span
              className={`absolute -top-6 -right-6 text-[140px] md:text-[180px] font-black leading-none opacity-[0.03] select-none pointer-events-none ${colors.textColor}`}
            >
              02
            </span>

            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4]"
                  : "from-emerald-500 to-cyan-600"
              } scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}
            ></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  } flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <FaEye className="text-white text-3xl" />
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    } blur-xl opacity-50 group-hover:opacity-80 transition-opacity`}
                  ></div>
                </div>
                <h3
                  className={`text-3xl md:text-4xl font-black ${colors.textColor} tracking-tight`}
                >
                  Our Vision
                </h3>
              </div>

              <p
                className={`text-lg ${colors.textMuted} leading-relaxed mb-10`}
              >
                To become the global leader in digital marketing excellence,
                transforming brands and setting new industry standards
                worldwide.
              </p>

              <div className="space-y-4">
                {visionPoints.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                        isDarkMode
                          ? "from-[#d4e157] to-[#06b6d4]"
                          : "from-emerald-500 to-cyan-600"
                      } flex items-center justify-center flex-shrink-0`}
                    >
                      <FaArrowRight className="text-white text-sm" />
                    </div>
                    <span className={`font-bold ${colors.textColor}`}>
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="text-center md:text-start">
              <h2
                  className={`font-black leading-tight mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
              >
                Core{" "}
                <span
                 className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
                >
                  Values
                </span>
              </h2>
              <p
                className={`text-base md:text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                The foundational principles that shape our culture and drive our
                success.
              </p>
            </div>
            <div
              className={`hidden md:block h-px flex-1 mx-8 ${isDarkMode ? "bg-white/10" : "bg-gray-200"}`}
            ></div>
            <div
              className={`text-6xl font-black opacity-10 ${colors.textColor} hidden md:block`}
            >
              04
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative h-full"
              >
                {/* Animated Glowing Border Effect on Hover */}
                <div
                  className={`absolute -inset-[1px] rounded-[2rem] bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] via-[#06b6d4] to-[#d4e157]"
                      : "from-emerald-500 via-cyan-600 to-emerald-500"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}
                />
                <div
                  className={`absolute -inset-[1px] rounded-[2rem] bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] via-[#06b6d4] to-[#d4e157]"
                      : "from-emerald-500 via-cyan-600 to-emerald-500"
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    backgroundSize: "200% 200%",
                    animation: "gradient-xy 3s ease infinite",
                  }}
                />

                {/* Inner Card */}
                <div
                  className={`relative h-full p-8 rounded-[2rem] border transition-all duration-500 z-10 ${
                    isDarkMode
                      ? "bg-zinc-900/90 border-white/10 group-hover:border-transparent"
                      : "bg-white/90 border-gray-200 group-hover:border-transparent"
                  } backdrop-blur-xl`}
                >
                  {/* Floating Icon Orb */}
                  <div className="relative w-14 h-14 mb-8 mx-auto md:mx-0">
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${
                        isDarkMode
                          ? "from-[#d4e157] to-[#06b6d4]"
                          : "from-emerald-500 to-cyan-600"
                      } blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500`}
                    ></div>
                    <div
                      className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${
                        isDarkMode
                          ? "from-[#d4e157] to-[#06b6d4]"
                          : "from-emerald-500 to-cyan-600"
                      } flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                    >
                      <value.icon className="text-white text-2xl" />
                    </div>
                  </div>

                  <h3
                    className={`text-xl font-black ${colors.textColor} mb-3 text-center md:text-start group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    } transition-all duration-300`}
                  >
                    {value.title}
                  </h3>

                  {/* Fixed: Dark mode mein text hamesha visible */}
                  <p
                    className={`text-sm leading-relaxed text-center md:text-start transition-colors duration-300 ${
                      isDarkMode
                        ? "text-gray-300 group-hover:text-white"
                        : `${colors.textMuted} group-hover:text-gray-700`
                    }`}
                  >
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;
