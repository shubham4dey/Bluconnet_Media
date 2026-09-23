import React from "react";
import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaGlobe, FaHandshake } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Apni image import karein
import featuresImage from "../assets/img/h3.png";

const FeaturesGrid = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Entire section click → About Us
  const handleSectionClick = () => {
    navigate("/about");
  };

  const features = [
    {
      title: "Drive Sustainable Growth for Your Brand",
      points: [
        "Long-term, strong relationships with major partners that drive success",
        "Customized partner recruitment",
      ],
      icon: FaRocket,
      dayColor: "from-emerald-500 to-cyan-600",
      nightColor: "from-[#d4e157] to-[#06b6d4]",
    },
    {
      title: "Expect a High-Touch Consultative Approach",
      points: [
        "7-10 years average experience of Senior Account Directors",
        "Top award honors for performance & culture",
      ],
      icon: FaUsers,
      dayColor: "from-cyan-600 to-emerald-500",
      nightColor: "from-[#06b6d4] to-[#d4e157]",
    },
    {
      title: "Grow or Launch Your Global Program to New Regions",
      points: [
        "3 continents hubs located worldwide, with programs managed in 40+ countries",
        "20+ languages spoken by global employees",
      ],
      icon: FaGlobe,
      dayColor: "from-emerald-500 to-amber-500",
      nightColor: "from-[#d4e157] to-[#f59e0b]",
    },
    {
      title: "Tap Into A Massive Network of Global Partnerships",
      points: [
        "Continual discovery of new, creative, and non-traditional partners",
        "In-house publisher development team",
      ],
      icon: FaHandshake,
      dayColor: "from-cyan-600 to-blue-600",
      nightColor: "from-[#06b6d4] to-[#3b82f6]",
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
      className={`py-20 md:py-28 px-4 ${
        isDarkMode ? "bg-[#050508]" : "bg-white"
      } relative overflow-hidden transition-colors duration-500 cursor-pointer`}
    >
      {/* Background Glow Effects */}
      <div
        className={`absolute top-1/4 left-0 w-96 h-96 ${
          isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"
        } rounded-full blur-3xl`}
      ></div>

      <div
        className={`absolute bottom-1/4 right-0 w-96 h-96 ${
          isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-600/10"
        } rounded-full blur-3xl`}
      ></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode ? "#d4e157" : "#10b981"
          } 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Background Geometric Shapes */}
      <div
        className={`absolute top-20 left-20 w-32 h-32 md:w-48 md:h-48 ${
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
        className={`absolute bottom-20 right-20 w-24 h-24 md:w-40 md:h-40 ${
          isDarkMode ? "opacity-10" : "opacity-20"
        } pointer-events-none rotate-12`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${
            isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"
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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left Side: Image with Overlay Effects */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`relative w-full aspect-square lg:aspect-auto lg:min-h-full rounded-2xl overflow-hidden border-2 ${
              isDarkMode
                ? "border-[#d4e157]/30"
                : "border-emerald-500/30"
            } shadow-2xl`}
          >
            {/* Main Image */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={featuresImage}
                alt="Features"
                className="w-full h-full object-contain max-h-[700px]"
                onError={(e) => {
                  e.target.style.display = "none";

                  if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.style.display = "flex";
                  }
                }}
              />

              {/* Fallback Placeholder */}
              <div
                className={`hidden absolute inset-0 items-center justify-center bg-gradient-to-br ${
                  isDarkMode
                    ? "from-[#0f1535] to-[#0a0e27]"
                    : "from-white to-slate-50"
                }`}
              >
                <div className="text-center px-4">
                  <div
                    className={`w-20 h-20 mx-auto mb-4 ${
                      isDarkMode
                        ? "bg-[#d4e157]/20"
                        : "bg-emerald-100"
                    } rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className={`w-10 h-10 ${
                        isDarkMode
                          ? "text-[#d4e157]"
                          : "text-emerald-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <p
                    className={`${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } text-sm`}
                  >
                    Add your image to
                    <br />
                    src/assets/img/h3.png
                  </p>
                </div>
              </div>
            </div>

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 ${
                isDarkMode
                  ? "bg-gradient-to-t from-[#0a0e27]/30 via-transparent to-transparent"
                  : "bg-gradient-to-t from-black/10 via-transparent to-transparent"
              } pointer-events-none`}
            ></div>

            {/* Glowing lines effect */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: isDarkMode
                  ? "radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 60%)"
                  : "radial-gradient(circle at 50% 50%, #10b981 0%, transparent 70%)",
              }}
            ></div>

            {/* Animated Border Glow */}
            <div
              className={`absolute inset-0 border-2 border-transparent rounded-2xl bg-gradient-to-r ${
                isDarkMode
                  ? "from-[#d4e157]/10 via-[#06b6d4]/10 to-[#d4e157]/10"
                  : "from-emerald-500/10 via-cyan-600/10 to-emerald-500/10"
              } animate-pulse pointer-events-none`}
            ></div>

            {/* Yellow Diamond Logo at Bottom Center */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 150,
              }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-24 h-24 md:w-32 md:h-32 z-10"
            >
              <div className="relative w-full h-full">
                {/* Glow behind diamond */}
                <div
                  className={`absolute inset-0 ${
                    isDarkMode
                      ? "bg-[#d4e157]/40"
                      : "bg-emerald-400/30"
                  } rounded-full blur-2xl`}
                ></div>

                {/* Diamond Shape */}
                <svg
                  viewBox="0 0 100 100"
                  className={`w-full h-full ${
                    isDarkMode
                      ? "text-[#d4e157]"
                      : "text-emerald-500"
                  } fill-current drop-shadow-lg relative z-10`}
                >
                  <path d="M50 10 L90 50 L50 90 L10 50 Z" />
                </svg>
              </div>
            </motion.div>

            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`absolute top-6 left-6 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27]"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"
              } px-4 py-2 rounded-lg font-bold text-sm shadow-lg z-10`}
            >
              10+ Years Excellence
            </motion.div>
          </motion.div>

          {/* Right Side: 2x2 Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const activeColor = isDarkMode
                ? feature.nightColor
                : feature.dayColor;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.5,
                  }}
                  whileHover={{ y: -8 }}
                  className={`group relative bg-gradient-to-br ${
                    isDarkMode
                      ? "from-[#0f1535] to-[#0a0e27] border-white/10"
                      : "from-white to-slate-50 border-gray-200"
                  } border-2 rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden ${
                    isDarkMode
                      ? "hover:border-[#d4e157]/50"
                      : "hover:border-emerald-500/50"
                  } ${
                    isDarkMode
                      ? "shadow-black/50"
                      : "shadow-gray-200/50"
                  } shadow-lg transition-all duration-500`}
                >
                  {/* Card Glow on Hover */}
                  <div
                    className={`absolute -top-20 -right-20 w-40 h-40 ${
                      isDarkMode
                        ? "bg-[#d4e157]/10"
                        : "bg-emerald-500/10"
                    } rounded-full blur-3xl transition-all duration-500`}
                  ></div>

                  <div
                    className={`absolute -bottom-20 -left-20 w-40 h-40 ${
                      isDarkMode
                        ? "bg-[#06b6d4]/10"
                        : "bg-cyan-600/10"
                    } rounded-full blur-3xl transition-all duration-500`}
                  ></div>

                  {/* Top Accent Line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${activeColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
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
                      className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${activeColor} border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3
                      className={`text-lg md:text-xl font-bold text-start mb-4 leading-tight transition-colors duration-300 ${
                        isDarkMode
                          ? "text-white group-hover:text-[#d4e157]"
                          : "text-gray-900 group-hover:text-emerald-600"
                      }`}
                    >
                      {feature.title}
                    </h3>
                  </div>

                  {/* Points */}
                  <div className="relative z-10 space-y-3 mt-4">
                    {feature.points.map((point, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.4 + index * 0.1 + i * 0.1,
                        }}
                        className={`${
                          isDarkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                        } text-sm text-start md:text-base leading-relaxed flex items-start gap-2`}
                      >
                        <span
                          className={`flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeColor} mt-2`}
                        ></span>

                        {point}
                      </motion.p>
                    ))}
                  </div>

                  {/* Bottom Accent Line */}
                  <div
                    className={`mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    } transition-all duration-500`}
                  ></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;