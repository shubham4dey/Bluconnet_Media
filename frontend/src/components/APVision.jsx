import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaMinus,
  FaArrowRight,
  FaChartLine,
  FaRobot,
  FaDatabase,
  FaRocket,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

// Apni dashboard image import karein
import apvisionDashboard from "../assets/img/h4.png";

const APVision = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [openIndex, setOpenIndex] = useState(0);

  const goToContact = () => {
    navigate("/contact");
  };

  // EXPLICIT DAY/NIGHT COLORS FOR ACCORDION ITEMS
  const accordionItems = [
    {
      title: "Unique, Proprietary Technology",
      content:
        "Experience reporting differently with APVision. Developed by Acceleration Partners, APVision is an enterprise data warehouse and reporting platform that equips our client teams with the data and insights needed to stay ahead of trends and uncover new opportunities to drive client performance. With APVision, our analytics teams generate highly customized reports, aggregating and analyzing data across the AP client portfolio to power your data-driven strategies. For you, this means full transparency into performance, with insights that translate into clear, actionable recommendations to maximize your growth—giving you a competitive advantage that other providers simply can't match.",
      icon: FaDatabase,
      dayColor: "from-emerald-500 to-cyan-600",
      nightColor: "from-[#d4e157] to-[#06b6d4]",
    },
    {
      title: "Sophisticated Reporting",
      content:
        "With APVision, sophisticated weekly, monthly, and ad hoc reports are simple – ensuring you see the right data when you need it. Our reporting dashboards include the key metrics and performance indicators needed to monitor your program and help ensure it stays on track. Reporting is automated wherever possible to ensure that your account team spends more time on strategic analysis and less time manually pulling reports.",
      icon: FaChartLine,
      dayColor: "from-cyan-600 to-blue-600",
      nightColor: "from-[#06b6d4] to-[#3b82f6]",
    },
    {
      title: "Data Automation",
      content:
        "APVision automates key insights, alerting your account team to opportunities and risks within your publisher set – and freeing them up to act on these opportunities vs. spending hours pulling data. Your account team works with you to understand key KPIs and to build them into APVision. The automated insight from thousands of data points ensures that your account team is always informed about key metrics that impact your program.",
      icon: FaRobot,
      dayColor: "from-emerald-500 to-amber-500",
      nightColor: "from-[#d4e157] to-[#f59e0b]",
    },
    {
      title: "Accelerate Program Growth",
      content:
        "APVision puts the power of every single AP publisher partner at your account team's fingertips. Our master publisher information cuts down on time duplicating discovery efforts, and gets the right partners into your program, quickly. The APVision Publisher CRM is a unique, proprietary database of publishers, individually tagged based on functionality and performance. With APVision, your team can quickly and easily identify and onboard the right publishers for you – faster than any other agency team.",
      icon: FaRocket,
      dayColor: "from-cyan-600 to-emerald-500",
      nightColor: "from-[#06b6d4] to-[#d4e157]",
    },
  ];

  return (
    <section
      className={`py-20 md:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Glow Effects - Smaller on Mobile */}
      <div
        className={`absolute top-1/4 left-0 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} rounded-full blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-1/4 right-0 w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-600/10"} rounded-full blur-3xl`}
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
        className={`absolute top-20 right-20 w-16 h-16 md:w-32 md:h-32 lg:w-48 lg:h-48 pointer-events-none ${isDarkMode ? "opacity-10" : "opacity-20"}`}
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
        className={`absolute bottom-20 left-16 w-12 h-12 md:w-24 md:h-24 lg:w-40 lg:h-40 pointer-events-none rotate-12 ${isDarkMode ? "opacity-10" : "opacity-20"}`}
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
        {/* Full Width Header - Top Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 text-center lg:text-start"
        >
          {/* Label Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-center lg:text-start"
          >
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border border-[#d4e157]/30 text-[#d4e157]"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-700"
              }`}
            >
              {/* Blinking Circle */}
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  }`}
                ></span>
                <span
                  className={`absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75 ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  }`}
                ></span>
              </div>
              <span>PROPRIETARY TECH</span>
            </div>
          </motion.div>

          {/* Heading with APVision gradient */}
          <h2
            className={`text-2xl md:text-4xl lg:text-6xl text-center lg:text-start font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6 leading-tight`}
          >
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              APVision:
            </span>
            <br />
            PROPRIETARY TECHNOLOGY POWERING
            <br />
            SMARTER AFFILIATE GROWTH
          </h2>

          <p
            className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-base text-center lg:text-start md:text-lg leading-relaxed max-w-4xl mx-auto lg:mx-0`}
          >
            $8.6B+ in managed programs powered by real-time dashboards,
            automated insights, and a proprietary publisher database, enabling
            faster, smarter partnership decisions.
          </p>
        </motion.div>

        {/* Two Column Layout - Desktop | Stacked - Mobile */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start">
          {/* Left Side: Accordion */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-1"
          >
            {/* Accordion */}
            <div
              className={`space-y-0 border-t text-start ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
            >
              {accordionItems.map((item, index) => {
                const activeColor = isDarkMode
                  ? item.nightColor
                  : item.dayColor;

                return (
                  <div
                    key={index}
                    className={`border-b transition-all duration-500 ${
                      openIndex === index
                        ? isDarkMode
                          ? "border-[#d4e157]/30"
                          : "border-emerald-500/30"
                        : isDarkMode
                          ? "border-white/10"
                          : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setOpenIndex(openIndex === index ? -1 : index)
                      }
                      className="w-full flex justify-between items-center py-5 text-left group focus:outline-none touch-manipulation cursor-pointer relative z-10"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        {/* Number Badge */}
                        <div
                          className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${activeColor} flex items-center justify-center font-bold text-white text-xs md:text-sm transition-all duration-300 ${
                            openIndex === index ? "scale-110" : "scale-100"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <span
                          className={`text-lg sm:text-xl md:text-2xl lg:text-xl font-bold transition-colors duration-300 ${
                            openIndex === index
                              ? isDarkMode
                                ? "text-[#d4e157]"
                                : "text-emerald-600"
                              : `${isDarkMode ? "text-white" : "text-gray-900"} group-hover:${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"}`
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      {/* Plus Icon - Clickable Area */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-20 ${
                          openIndex === index
                            ? `bg-gradient-to-br ${activeColor} text-white shadow-lg ${isDarkMode ? "shadow-[#d4e157]/30" : "shadow-emerald-500/30"}`
                            : `${isDarkMode ? "bg-white/5 border-white/20 text-white group-hover:border-[#06b6d4]/50" : "bg-gray-50 border-gray-200 text-gray-700 group-hover:border-cyan-600/50"}`
                        }`}
                      >
                        <motion.div
                          animate={{ rotate: openIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {openIndex === index ? (
                            <FaMinus size={10} />
                          ) : (
                            <FaPlus size={10} />
                          )}
                        </motion.div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-5 pl-12 md:pl-14 pr-4 md:pr-8 relative">
                            {/* Left accent line */}
                            <div
                              className={`absolute left-5 md:left-6 top-0 bottom-4 w-0.5 bg-gradient-to-b ${activeColor} opacity-50`}
                            ></div>

                            {/* Icon */}
                            <div
                              className={`inline-flex w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${activeColor} ${isDarkMode ? "bg-opacity-20" : "bg-opacity-10"} items-center justify-center mb-3`}
                            >
                              <item.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>

                            <p
                              className={`text-[15px] sm:text-base md:text-lg lg:text-base leading-relaxed ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {item.content}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side: Dashboard Image (Sticky on Desktop, Below on Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-2 lg:sticky lg:top-32"
          >
            {/* Glow Behind Dashboard */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157]/20 to-[#06b6d4]/20" : "from-emerald-500/20 to-cyan-600/20"} rounded-2xl blur-2xl transform rotate-2`}
            ></div>

            {/* Dashboard Frame - Compact Height */}
            <div
              className={`relative ${isDarkMode ? "bg-[#0f1535]" : "bg-white"} rounded-2xl p-3 md:p-4 shadow-2xl border-2 ${isDarkMode ? "border-[#d4e157]/30" : "border-emerald-500/30"}`}
            >
              {/* Top Bar - Laptop Style */}
              <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80"></div>
                <div
                  className={`flex-1 mx-4 ${isDarkMode ? "bg-white/5" : "bg-gray-100"} rounded-lg px-3 py-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} font-mono text-center truncate`}
                >
                  BluConnet Media
                </div>
              </div>

              {/* Dashboard Image Container - Compact with aspect-video */}
              <div
                className={`rounded-lg overflow-hidden relative ${isDarkMode ? "bg-[#1a1f3a]" : "bg-gray-50"} aspect-video`}
              >
                <img
                  src={apvisionDashboard}
                  alt="APVision Dashboard"
                  className="w-full h-full object-cover"
                />

                {/* Top overlay badge */}
                {/* <div
                  className={`absolute top-3 left-3 md:top-4 md:left-4 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27]" : "from-emerald-500 to-cyan-600 text-white"} px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg font-bold text-[10px] md:text-xs shadow-lg`}
                >
                  LIVE DASHBOARD
                </div> */}
              </div>

              {/* Bottom Stats Bar */}
              <div className="mt-3 md:mt-4 grid grid-cols-3 gap-2">
                <div
                  className={`${isDarkMode ? "bg-white/5" : "bg-gray-50"} rounded-lg p-2 md:p-3 text-center`}
                >
                  <div
                    className={`text-[10px] md:text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
                  >
                    Active Users
                  </div>
                  <div
                    className={`text-base md:text-lg font-bold ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                  >
                    2.4K
                  </div>
                </div>
                <div
                  className={`${isDarkMode ? "bg-white/5" : "bg-gray-50"} rounded-lg p-2 md:p-3 text-center`}
                >
                  <div
                    className={`text-[10px] md:text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
                  >
                    Reports
                  </div>
                  <div
                    className={`text-base md:text-lg font-bold ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"}`}
                  >
                    180+
                  </div>
                </div>
                <div
                  className={`${isDarkMode ? "bg-white/5" : "bg-gray-50"} rounded-lg p-2 md:p-3 text-center`}
                >
                  <div
                    className={`text-[10px] md:text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-1`}
                  >
                    Insights
                  </div>
                  <div
                    className={`text-base md:text-lg font-bold ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                  >
                    Real-time
                  </div>
                </div>
              </div>
            </div>

            {/* ===== PREMIUM STYLISH CTA BUTTON ===== */}
            <motion.button
              onClick={goToContact}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden group mt-6 md:mt-8 w-full px-8 py-4 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
              }`}
            >
              {/* Animated Shine/Sweep Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
              
              <span className="relative z-20 flex items-center gap-3">
                CONTACT US
                <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.button>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default APVision;