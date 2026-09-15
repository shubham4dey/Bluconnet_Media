import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const MarqueeBanner = () => {
  const { isDarkMode } = useTheme();

  // EXPLICITLY DEFINED GRADIENTS TO MATCH WHO WE ARE THEME PERFECTLY
  const marqueeBrightGradient = isDarkMode
    ? "linear-gradient(135deg, #d4e157 0%, #06b6d4 100%)" // Night: Lime to Cyan
    : "linear-gradient(135deg, #10b981 0%, #0891b2 100%)"; // Day: Emerald to Cyan

  const marqueeDarkGradient = isDarkMode
    ? "linear-gradient(135deg, #a3a12f 0%, #0891b2 100%)" // Night: Darker Lime to Darker Cyan (for contrast)
    : "linear-gradient(135deg, #047857 0%, #0e7490 100%)"; // Day: Darker Emerald to Darker Cyan (for contrast)

  const marqueeBg = isDarkMode ? "bg-[#050508]" : "bg-white"; // Dark background so white text pops

  const bannerItems = [
    "Growth Platform",
    "Digital Agency",
    "Digital Excellence",
    "Powerful Performance",
    "Smart & Efficient",
    "Digital Agency",
    "Growth Platform",
    "Digital Excellence",
  ];

  const duplicateItems = [...bannerItems, ...bannerItems];

  return (
    <section
      className={`relative overflow-hidden h-[300px] transition-colors duration-500 ${
        isDarkMode ? "bg-[#050508]" : "bg-white"
      }`}
    >
      {/* Desktop */}
      <div className="hidden md:block relative h-full">
        {/* TOP STRIP */}
        <div
          className="absolute left-[-30%] w-[160%] h-24 overflow-hidden z-20"
          style={{
            top: "34%",
            transform: "rotate(-5deg)",
          }}
        >
          <motion.div
            className="flex w-max"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...duplicateItems, ...duplicateItems].map((item, index) => (
              <div
                key={index}
                className="flex items-center px-12 py-6 whitespace-nowrap font-bold text-2xl text-white shadow-lg"
                style={{
                  background:
                    index % 2 === 0
                      ? marqueeBrightGradient
                      : marqueeDarkGradient,
                  clipPath: "polygon(5% 0%,100% 0%,95% 100%,0% 100%)",
                }}
              >
                {item}
                <span className="mx-8 text-2xl">✦</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* BOTTOM STRIP */}
        <div
          className="absolute left-[-30%] w-[160%] h-24 overflow-hidden z-10"
          style={{
            top: "34%",
            transform: "rotate(5deg)",
          }}
        >
          <motion.div
            className="flex w-max"
            animate={{
              x: ["-50%", "0%"],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...duplicateItems, ...duplicateItems].map((item, index) => (
              <div
                key={`bottom-${index}`}
                className="flex items-center px-12 py-6 whitespace-nowrap font-bold text-2xl text-white shadow-lg"
                style={{
                  background:
                    index % 2 === 0
                      ? marqueeDarkGradient
                      : marqueeBrightGradient,
                  clipPath: "polygon(0% 0%,95% 0%,100% 100%,5% 100%)",
                }}
              >
                <span className="mx-8 text-2xl">✦</span>
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden relative h-[240px] overflow-hidden">
        {/* Top Strip */}
        <div className="absolute top-[40%] left-[-45%] w-[190%] overflow-hidden">
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...duplicateItems, ...duplicateItems].map((item, index) => (
              <div
                key={`mobile-top-${index}`}
                className="flex items-center px-6 py-3 whitespace-nowrap text-base font-bold text-white shadow-md"
                style={{
                  background:
                    index % 2 === 0
                      ? marqueeBrightGradient
                      : marqueeDarkGradient,
                }}
              >
                {item}
                <span className="mx-5">✦</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Strip */}
        <div className="absolute top-[70%] left-[-45%] w-[190%] overflow-hidden">
          <motion.div
            className="flex w-max"
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...duplicateItems, ...duplicateItems].map((item, index) => (
              <div
                key={`mobile-bottom-${index}`}
                className="flex items-center px-6 py-3 whitespace-nowrap text-base font-bold text-white shadow-md"
                style={{
                  background:
                    index % 2 === 0
                      ? marqueeDarkGradient
                      : marqueeBrightGradient,
                }}
              >
                <span className="mx-5">✦</span>
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MarqueeBanner;
