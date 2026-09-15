import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar, FaTrophy, FaHandshake } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Import client logos
import affiseLogo from "../assets/clients/aff1.png";
import namecheapLogo from "../assets/clients/namecheap.png";
import plutoLogo from "../assets/clients/pluto.png";
import mindbazLogo from "../assets/clients/mindbaz.png";

const Clients = () => {
  const { isDarkMode } = useTheme();

  const clients = [
    { name: "Affise", logo: affiseLogo },
    { name: "Namecheap", logo: namecheapLogo },
    { name: "Pluto", logo: plutoLogo },
    { name: "Mindbaz", logo: mindbazLogo },
  ];

  const stats = [
    { number: "1000+", label: "Global Clients", icon: FaHandshake },
    { number: "98%", label: "Retention Rate", icon: FaTrophy },
    { number: "150+", label: "Industries", icon: FaStar },
  ];

  return (
    <section
      className={`py-16 md:py-28 lg:py-40 px-4 relative overflow-hidden ${isDarkMode ? "bg-[#050508]" : "bg-white"} transition-colors duration-500`}
    >
      {/* Diagonal Stripes - Mobile */}
      <div className="absolute right-0 top-16 w-40 h-40 sm:w-48 sm:h-48 md:hidden pointer-events-none overflow-hidden">
        <div
          className={`w-full h-full ${isDarkMode ? "opacity-10" : "opacity-5"}`}
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${isDarkMode ? "#d4e157" : "#10b981"} 10px, ${isDarkMode ? "#d4e157" : "#10b981"} 20px)`,
            backgroundSize: "28.28px 28.28px",
          }}
        ></div>
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-l from-transparent to-[#0a0e27]/40" : "bg-gradient-to-l from-transparent to-white/40"}`}
        ></div>
      </div>

      {/* Diagonal Stripes - Desktop */}
      <div className="absolute right-0 top-24 bottom-24 w-1/2 hidden md:block pointer-events-none overflow-hidden">
        <div
          className={`w-full h-full ${isDarkMode ? "opacity-10" : "opacity-5"}`}
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, ${isDarkMode ? "#d4e157" : "#10b981"} 30px, ${isDarkMode ? "#d4e157" : "#10b981"} 60px)`,
            backgroundSize: "84.85px 84.85px",
          }}
        ></div>
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-l from-transparent to-[#0a0e27]/40" : "bg-gradient-to-l from-transparent to-white/40"}`}
        ></div>
      </div>

      {/* Premium Glow Effects */}
      <div
        className={`absolute top-1/4 left-0 w-48 md:w-96 h-48 md:h-96 ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} rounded-full blur-3xl animate-pulse`}
      ></div>
      <div
        className={`absolute bottom-1/4 right-1/4 w-48 md:w-96 h-48 md:h-96 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-600/10"} rounded-full blur-3xl animate-pulse`}
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-[500px] h-64 md:h-[500px] ${isDarkMode ? "bg-purple-500/5" : "bg-purple-200/10"} rounded-full blur-3xl`}
      ></div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-32 right-20 w-20 h-20 ${isDarkMode ? "bg-white/5 border border-white/10" : "bg-emerald-50 border border-emerald-200"} rounded-2xl backdrop-blur-xl hidden lg:flex items-center justify-center`}
      >
        <FaStar
          className={`text-3xl ${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"}`}
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className={`absolute bottom-32 left-20 w-16 h-16 ${isDarkMode ? "bg-white/5 border border-white/10" : "bg-emerald-50 border border-emerald-200"} rounded-2xl backdrop-blur-xl hidden lg:flex items-center justify-center`}
      >
        {/* FIXED: Trophy color now changes to lime in night mode */}
        <FaTrophy
          className={`text-2xl ${isDarkMode ? "text-[#d4e157]" : "text-cyan-600"}`}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Premium Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 text-center lg:text-left"
            >
              <span
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase shadow-lg ${
                  isDarkMode
                    ? "bg-[#d4e157]/10 border border-[#d4e157]/30 text-[#d4e157]"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                }`}
              >
                <FaStar
                  className={`animate-pulse text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${
                    isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                  }`}
                />
                TRUSTED BY LEADERS
              </span>
            </motion.div>

            {/* Premium Heading */}
            <h2
              className={`font-black leading-tight mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
            >
              <span className="block whitespace-nowrap">UNLOCK GROWTH</span>
              <span className="block whitespace-nowrap">THROUGH</span>
              <span
                className={`block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} animate-gradient`}
              >
                PARTNERSHIPS
              </span>
            </h2>

            {/* Description */}
            <p
              className={`text-base md:text-xl leading-relaxed mb-8 md:mb-12 max-w-3xl mx-auto text-center lg:text-left ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Our team is trusted by top brands across industries, helping them
              connect with the right buyers through performance partnerships,
              traditional affiliate, influencer, performance PR, content and B2B
              partnership marketing.
            </p>

            {/* Premium Client Logo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mb-10 md:mb-12 justify-items-center">
              {clients.map((client, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ scale: 1.08, y: -5 }}
                  className={`w-[85%] sm:w-full flex items-center justify-center min-h-16 sm:min-h-20 md:min-h-24 cursor-pointer group rounded-xl md:rounded-2xl transition-all duration-500 p-4 md:p-5 relative overflow-hidden ${
                    isDarkMode
                      ? "bg-white/5 border border-white/10 shadow-black/20 hover:border-[#d4e157]/50 hover:shadow-[#d4e157]/20"
                      : "bg-white border border-gray-200 shadow-gray-200/50 hover:border-emerald-500/50 hover:shadow-emerald-500/20"
                  }`}
                >
                  {/* Gradient Border on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 rounded-xl md:rounded-2xl ${
                      isDarkMode
                        ? "from-[#d4e157]/0 to-[#06b6d4]/0 group-hover:from-[#d4e157]/10 group-hover:to-[#06b6d4]/10"
                        : "from-emerald-500/0 to-cyan-600/0 group-hover:from-emerald-500/10 group-hover:to-cyan-600/10"
                    }`}
                  ></div>

                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-14 sm:max-h-16 md:max-h-20 w-auto object-contain transition-all duration-500 group-hover:scale-110 relative z-10"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "block";
                    }}
                  />

                  <span
                    className={`hidden font-bold text-sm md:text-base transition-all duration-500 text-center relative z-10 ${
                      isDarkMode
                        ? "text-gray-400 group-hover:text-[#d4e157]"
                        : "text-gray-600 group-hover:text-emerald-600"
                    }`}
                  >
                    {client.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Premium CTA Button */}
            {/* <motion.div className="text-start">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`w-[85%] mx-auto sm:w-auto sm:mx-0 px-8 py-4 md:px-10 md:py-5 font-bold rounded-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-center gap-3 group text-sm md:text-base relative overflow-hidden ${
                  isDarkMode
                    ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] hover:shadow-[#d4e157]/40"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white hover:shadow-emerald-500/40"
                }`}
              >
                Button Shine Effect
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <span className="relative z-10">SEE REAL OUTCOMES</span>
                <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>
            </motion.div> */}
          </motion.div>

          {/* Right Side - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col justify-center gap-4 md:gap-5 lg:gap-6 mt-10 lg:mt-0"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.03, x: -10 }}
                className={`backdrop-blur-xl rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-7 lg:p-8 transition-all duration-500 group relative overflow-hidden ${
                  isDarkMode
                    ? "bg-white/5 border border-white/10"
                    : "bg-white border border-gray-200"
                }`}
              >
                {/* Gradient Accent */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} group-hover:w-2 transition-all duration-500`}
                ></div>

                <div className="flex items-center gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ${
                      isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-50"
                    }`}
                  >
                    <stat.icon
                      className={`w-8 h-8 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-4xl font-black mb-1 ${
                        isDarkMode
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-[#d4e157] to-[#06b6d4]"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-600"
                      }`}
                    >
                      {stat.number}
                    </div>
                    <div
                      className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
