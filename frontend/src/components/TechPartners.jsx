import React from "react";
import { motion } from "framer-motion";
import {
  FaHandshake,
  FaPlug,
  FaRocket,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

import mainLogo from "../assets/img/logo.png";
import affiseLogo from "../assets/clients/aff1.png";
import namecheapLogo from "../assets/clients/namecheap.png";
import mindbazLogo from "../assets/clients/mindbaz.png";
import campaignLogo from "../assets/clients/campaign.png";
import campaignDarkLogo from "../assets/clients/campaign-night.png";
import mailchimpLogo from "../assets/clients/mailchimp.png";
import mailchimpDarkLogo from "../assets/clients/mailchimp-night.png";
import adobeLogo from "../assets/clients/adobe.png";
import plutoLogo from "../assets/clients/pluto.png";
import canvaLogo from "../assets/clients/canva.png";

const TechPartners = () => {
  const { isDarkMode } = useTheme();

  const partners = {
    left: [
      { name: "Affise", logo: affiseLogo },
      { name: "Namecheap", logo: namecheapLogo },
      { 
        name: "Campaign Monitor", 
        logo: isDarkMode ? campaignDarkLogo : campaignLogo 
      },
      { name: "Mindbaz", logo: mindbazLogo },
    ],
    right: [
      { 
        name: "Mailchimp", 
        logo: isDarkMode ? mailchimpDarkLogo : mailchimpLogo 
      },
      { name: "Adobe", logo: adobeLogo },
      { name: "PlutoAstro", logo: plutoLogo },
      { name: "Canva", logo: canvaLogo },
    ],
  };

  const stats = [
    { number: "150+", label: "TECH PARTNERS", icon: FaPlug },
    { number: "1000+", label: "BRANDS POWERED", icon: FaRocket },
    { number: "10+", label: "YEARS EXPERIENCE", icon: FaHandshake },
    { number: "98%", label: "CLIENT SATISFACTION", icon: FaGlobe },
  ];

  return (
    <section
      className={`py-20 md:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      <div
        className={`absolute top-1/4 left-0 w-96 h-96 ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} rounded-full blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-1/4 right-0 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-600/10"} rounded-full blur-3xl`}
      ></div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? "#d4e157" : "#10b981"} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div
        className={`absolute top-20 left-20 w-32 h-32 md:w-48 md:h-48 ${isDarkMode ? "opacity-10" : "opacity-20"} pointer-events-none`}
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
        className={`absolute bottom-20 right-20 w-24 h-24 md:w-40 md:h-40 ${isDarkMode ? "opacity-10" : "opacity-20"} pointer-events-none rotate-12`}
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 flex justify-center"
          >
            <span
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border border-[#d4e157]/30 text-[#d4e157]"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-700"
              }`}
            >
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  } opacity-75`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  }`}
                ></span>
              </span>
              ECOSYSTEM
            </span>
          </motion.div>

          <h2
            className={`text-3xl md:text-5xl lg:text-6xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6 leading-tight`}
          >
            TECHNOLOGIES & PARTNERS
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              WITH BLUCONNETMEDIA
            </span>
          </h2>

          <p
            className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-base md:text-lg max-w-3xl mx-auto leading-relaxed`}
          >
            We partner with industry-leading platforms and technologies to
            deliver exceptional results for our clients through powerful
            integrations and strategic partnerships.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 grid grid-cols-2 gap-4"
          >
            {partners.left.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`group relative bg-gradient-to-br ${
                  isDarkMode
                    ? "from-[#0f1535] to-[#0a0e27] border-white/10 hover:border-[#d4e157]/50 hover:shadow-[0_0_20px_rgba(212,225,87,0.25)]"
                    : "from-white to-slate-50 border-gray-200 hover:border-emerald-500/50 hover:shadow-emerald-500/20"
                } border-2 rounded-2xl p-5 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                  isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"
                } shadow-lg`}
              >
                <div className="relative w-full h-16 flex items-center justify-center mb-2">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div
                  className={`text-xs md:text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"} text-center`}
                >
                  {partner.name}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="lg:col-span-4 relative z-10 flex flex-col items-center justify-center py-8 lg:py-0"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div
                className={`absolute inset-0 rounded-full border-2 ${isDarkMode ? "border-[#d4e157]/30" : "border-emerald-500/30"} animate-spin-slow`}
              ></div>
              <div
                className={`absolute inset-4 rounded-full border-2 ${isDarkMode ? "border-[#06b6d4]/30" : "border-cyan-600/30"} animate-spin-slow-reverse`}
              ></div>

              <div
                className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157]/20 to-[#06b6d4]/20" : "from-emerald-500/20 to-cyan-600/20"} rounded-full blur-2xl animate-pulse`}
              ></div>

              <div
                className={`absolute inset-8 bg-gradient-to-br ${isDarkMode ? "from-[#0f1535] to-[#0a0e27] border-[#d4e157]/30" : "from-white to-slate-50 border-emerald-500/30"} border-2 rounded-full flex items-center justify-center overflow-hidden shadow-2xl`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? "from-[#d4e157]/10 to-[#06b6d4]/10" : "from-emerald-500/10 to-cyan-600/10"}`}
                ></div>

                <div className="relative z-10 text-center p-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                    <img
                      src={mainLogo}
                      alt="BluConnet Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div
                    className={`${isDarkMode ? "text-white" : "text-gray-900"} font-bold text-lg md:text-xl`}
                  >
                    BluConnet
                  </div>
                  <div
                    className={`${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"} text-xs md:text-sm font-semibold`}
                  >
                    Media
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className={`absolute -top-2 -right-2 md:top-4 md:right-4 px-3 py-1.5 rounded-full shadow-lg font-bold text-xs ${
                  isDarkMode
                    ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27]"
                    : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"
                }`}
              >
                PARTNER HUB
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute top-1/2 -left-4 w-4 h-4 ${isDarkMode ? "bg-[#d4e157] shadow-[#d4e157]/50" : "bg-emerald-500 shadow-emerald-500/50"} rounded-full shadow-lg`}
              ></motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className={`absolute top-1/2 -right-4 w-4 h-4 ${isDarkMode ? "bg-[#06b6d4] shadow-[#06b6d4]/50" : "bg-cyan-600 shadow-cyan-600/50"} rounded-full shadow-lg`}
              ></motion.div>
              <motion.div
                animate={{ x: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 ${isDarkMode ? "bg-gradient-to-br from-[#d4e157] to-[#06b6d4]" : "bg-gradient-to-br from-emerald-500 to-cyan-600"} rounded-full shadow-lg`}
              ></motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className={`mt-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm md:text-base text-center font-semibold`}
            >
              Connecting Brands with
              <br />
              Powerful Partnerships
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 grid grid-cols-2 gap-4"
          >
            {partners.right.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 6) * 0.1 }}
                whileHover={{ y: -5 }}
                className={`group relative bg-gradient-to-br ${
                  isDarkMode
                    ? "from-[#0f1535] to-[#0a0e27] border-white/10 hover:border-[#d4e157]/50 hover:shadow-[0_0_20px_rgba(212,225,87,0.25)]"
                    : "from-white to-slate-50 border-gray-200 hover:border-emerald-500/50 hover:shadow-emerald-500/20"
                } border-2 rounded-2xl p-5 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                  isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"
                } shadow-lg`}
              >
                <div className="relative w-full h-16 flex items-center justify-center mb-2">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div
                  className={`text-xs md:text-sm font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } text-center`}
                >
                  {partner.name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`group relative bg-gradient-to-br ${isDarkMode ? "from-[#0f1535] to-[#0a0e27] border-white/10 hover:border-[#d4e157]/50" : "from-white to-slate-50 border-gray-200 hover:border-emerald-500/50"} border-2 rounded-2xl p-6 text-center transition-all duration-300 ${isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"} shadow-lg`}
            >
              <div
                className={`relative z-10 w-12 h-12 mx-auto mb-4 bg-gradient-to-br ${isDarkMode ? "from-[#d4e157]/20 to-[#06b6d4]/20 border-[#d4e157]/30" : "from-emerald-100 to-cyan-100 border-emerald-200"} border rounded-xl flex items-center justify-center`}
              >
                <stat.icon
                  className={`w-6 h-6 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                />
              </div>

              <div
                className={`relative z-10 text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} mb-2`}
              >
                {stat.number}
              </div>

              <div
                className={`relative z-10 ${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs md:text-sm font-bold uppercase tracking-wide`}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`relative overflow-hidden group inline-flex items-center px-8 py-4 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 gap-3 ${
              isDarkMode
                ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
            }`}
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
            
            <span className="relative z-20 flex items-center gap-3">
              BECOME A PARTNER
              <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TechPartners;