import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// Apni image import karein
import whyChooseUsImage from "../assets/img/h2.png";

const WhyChooseUs = () => {
  const { isDarkMode } = useTheme();

  const ref = useRef(null);

  const stats = [
    { number: "+36%", label: "AVERAGE YOY CLIENT PROGRAM GROWTH" },
    { number: "$8.6B", label: "REVENUE DRIVEN IN 2025" },
    { number: "110M+", label: "CONVERSIONS DRIVEN IN 2025" },
    { number: "1500+", label: "CREATOR-BRAND PARTNERSHIPS" },
  ];

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

      {/* Background Geometric Shapes (3D Boxes - Theme Colors) */}
      <div
        className={`absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 opacity-10 pointer-events-none`}
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
      <div
        className={`absolute bottom-20 right-32 w-24 h-24 md:w-40 md:h-40 opacity-10 pointer-events-none rotate-12`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"}`}
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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div ref={ref} className="text-center lg:text-left">
            {/* Label Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 text-center lg:text-left"
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
                  WHY CHOOSE US
                </span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-8 leading-tight text-center lg:text-left`}
            >
              <span 
              className={`font-black leading-tight mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
              >
                WHY BRANDS{" "}
              </span>
              <br />
              <span
               className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
              >
                CHOOSE AP
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`text-base md:text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Acceleration Partners is the strategic guide top-tier brands trust
              to navigate an AI-accelerated, margin-pressured, and increasingly
              complex partnership marketing ecosystem. We unify affiliate,
              influencer, and emerging partnership models into a single
              data-driven growth engine, helping teams cut through complexity
              with clarity, structure, and trusted decision support.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm sm:text-base md:text-lg leading-relaxed mb-10 text-center lg:text-left`}
            >
              This approach is powered by APVision®, our proprietary technology
              designed to optimize and scale partnership performance, delivering
              real-time dashboards, automated insights, and predictive
              optimization across partners, channels, and markets. With 1000+
              clients, including Fortune 500 brands, operations across 150+
              countries, and multiple industry awards, including 12 wins in
              2025, we bring enterprise scale and global execution without
              platform bias. The result is measurable growth brands can trust
              and the confidence to scale in a changing market.
            </motion.p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-6 md:gap-x-8 gap-y-8 text-center lg:text-left">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="group cursor-pointer"
                >
                  <h3
                    className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-2 ${isDarkMode ? "group-hover:text-[#d4e157]" : "group-hover:text-emerald-600"} transition-colors duration-300`}
                  >
                    {stat.number}
                  </h3>
                  <div
                    className={`h-0.5 w-12 mx-auto lg:mx-0 bg-gradient-to-r ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    } mb-3`}
                  ></div>
                  <p
                    className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs md:text-sm font-semibold uppercase tracking-wide ${isDarkMode ? "group-hover:text-[#d4e157]" : "group-hover:text-emerald-600"} transition-colors`}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual - Clean Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
          >
            {/* Card Container */}
            <div
              className={`relative w-full max-w-[320px] sm:max-w-sm md:max-w-md bg-gradient-to-br ${isDarkMode ? "from-[#0f1535] to-[#1a1f3a] border-white/10" : "from-white to-slate-50 border-gray-200"} border-2 rounded-2xl overflow-hidden ${isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"} shadow-lg`}
            >
              {/* Shooting Star Badge at Top Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -45 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 150,
                }}
                className="absolute top-6 right-6 w-20 h-20 z-20"
              >
                <svg
                  viewBox="0 0 100 100"
                  className={`w-full h-full ${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"} drop-shadow-lg`}
                >
                  {/* Main Star Body */}
                  <path
                    fill="currentColor"
                    d="M50 8 L58 35 L87 35 L64 52 L72 80 L50 63 L28 80 L36 52 L13 35 L42 35 Z"
                  />

                  {/* Dynamic Swoosh 1 */}
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    d="M5 45 Q25 30 45 35 Q65 40 85 25"
                    opacity="0.9"
                  />

                  {/* Dynamic Swoosh 2 */}
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    d="M8 55 Q28 40 48 45 Q68 50 88 35"
                    opacity="0.7"
                  />

                  {/* Dynamic Swoosh 3 */}
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M12 62 Q32 47 52 52 Q72 57 90 42"
                    opacity="0.6"
                  />

                  {/* Small Sparkles */}
                  <circle
                    cx="15"
                    cy="20"
                    r="2"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <circle
                    cx="85"
                    cy="15"
                    r="1.5"
                    fill="currentColor"
                    opacity="0.5"
                  />
                  <circle
                    cx="90"
                    cy="65"
                    r="2"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <circle
                    cx="10"
                    cy="75"
                    r="1.5"
                    fill="currentColor"
                    opacity="0.5"
                  />
                  <circle
                    cx="75"
                    cy="85"
                    r="1.5"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <circle
                    cx="25"
                    cy="10"
                    r="1"
                    fill="currentColor"
                    opacity="0.5"
                  />
                  <circle
                    cx="65"
                    cy="12"
                    r="1.5"
                    fill="currentColor"
                    opacity="0.6"
                  />
                  <circle
                    cx="95"
                    cy="45"
                    r="1"
                    fill="currentColor"
                    opacity="0.5"
                  />
                </svg>
              </motion.div>

              {/* Decorative Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className={`absolute top-8 left-8 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27]" : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"} px-4 py-2 rounded-lg font-bold text-sm shadow-lg z-20`}
              >
                10+ Years Excellence
              </motion.div>

              {/* Main Image - UPDATED FOR BETTER FIT */}
              <div className="relative w-full min-h-[400px] sm:min-h-[500px]">
                <img
                  src={whyChooseUsImage}
                  alt="Why Choose Us"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="flex items-center justify-center h-full bg-gradient-to-br ${isDarkMode ? "from-[#0f1535] to-[#1a1f3a]" : "from-white to-slate-50"}">
                        <div class="text-center px-4">
                          <div class="w-20 h-20 mx-auto mb-4 ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-100"} rounded-full flex items-center justify-center">
                            <svg class="w-10 h-10 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p class="${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm">Add your image to src/assets/img/h2.png</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>

              {/* Bottom Stats Bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${isDarkMode ? "from-[#0a0e27]/90 via-[#0a0e27]/70 to-transparent" : "from-white/95 via-white/80 to-transparent"} p-6 z-10`}
              >
                <div className="flex justify-around items-center">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                    >
                      1000+
                    </div>
                    <div
                      className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Clients
                    </div>
                  </div>
                  <div
                    className={`h-8 w-px ${isDarkMode ? "bg-white/20" : "bg-gray-300"}`}
                  ></div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"}`}
                    >
                      150+
                    </div>
                    <div
                      className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Countries
                    </div>
                  </div>
                  <div
                    className={`h-8 w-px ${isDarkMode ? "bg-white/20" : "bg-gray-300"}`}
                  ></div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                    >
                      12
                    </div>
                    <div
                      className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Awards 2025
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;