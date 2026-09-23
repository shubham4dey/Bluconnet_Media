import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FaCoins,
  FaChartLine,
  FaRobot,
  FaChartBar,
  FaExpandArrowsAlt,
  FaHeadset,
  FaUsers,
  FaGlobe,
  FaTrophy,
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";

import teamImage from "../assets/img/h2.png";

const WhyChooseUs = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Navigate to About Us when the entire section is clicked
  const handleSectionClick = () => {
    navigate("/about");
  };

  const benefits = [
    {
      number: "01",
      icon: FaCoins,
      title: "High Returns",
      description:
        "Our marketing and web & app development are built to make every penny work harder.",
      iconColor: "bg-emerald-100 text-emerald-600",
      arrowColor: "text-emerald-500",
    },
    {
      number: "02",
      icon: FaChartLine,
      title: "ROI-Based Approach",
      description:
        "Across every service, from campaigns to apps and websites, we focus on results such as quality leads, sales, and conversions, not just impressions.",
      iconColor: "bg-blue-100 text-blue-600",
      arrowColor: "text-blue-500",
    },
    {
      number: "03",
      icon: FaRobot,
      title: "AI-Powered Optimization",
      description:
        "AI-driven targeting and faster decisions improve your email and mobile campaigns and help your website and app convert more visitors into customers.",
      iconColor: "bg-purple-100 text-purple-600",
      arrowColor: "text-purple-500",
    },
    {
      number: "04",
      icon: FaChartBar,
      title: "Transparent Reporting",
      description:
        "Clear stats across all five services show what is working, so you always know where your budget goes and what it earns.",
      iconColor: "bg-emerald-100 text-emerald-600",
      arrowColor: "text-emerald-500",
    },
    {
      number: "05",
      icon: FaExpandArrowsAlt,
      title: "Scalable Growth",
      description:
        "Start with one service and scale up whatever performs, from a single campaign to a full app or website.",
      iconColor: "bg-cyan-100 text-cyan-600",
      arrowColor: "text-cyan-500",
    },
    {
      number: "06",
      icon: FaHeadset,
      title: "Dedicated Support",
      description:
        "Our team supports your marketing and development needs and responds quickly at every step.",
      iconColor: "bg-orange-100 text-orange-600",
      arrowColor: "text-orange-500",
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
      className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-emerald-50 py-20 lg:py-28 cursor-pointer"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Dots Pattern */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-emerald-400"
              />
            ))}
          </div>
        </div>

        {/* Top Right Dots Pattern */}
        <div className="absolute top-20 right-10 opacity-20">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-400"
              />
            ))}
          </div>
        </div>

        {/* Large Gradient Circles */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-200/40 to-cyan-200/40 rounded-full blur-3xl" />

        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-emerald-200/40 rounded-full blur-3xl" />

        {/* Curved Lines */}
        <svg
          className="absolute top-40 left-0 w-64 h-64 opacity-10"
          viewBox="0 0 200 200"
        >
          <path
            d="M0,100 Q50,50 100,100 T200,100"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
          />
        </svg>

        <svg
          className="absolute bottom-40 right-0 w-64 h-64 opacity-10"
          viewBox="0 0 200 200"
        >
          <path
            d="M0,100 Q50,150 100,100 T200,100"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 xl:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200 mb-6"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />

              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                WHY CHOOSE US
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black leading-tight mb-3 text-left"
            >
              <span className="text-gray-900 block text-left">
                KEY BENEFITS
              </span>

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-600 block text-left">
                THAT DRIVE GROWTH
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 text-left"
            >
              STRATEGY × TECHNOLOGY × REAL RESULTS
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 leading-relaxed mb-10 max-w-lg text-left"
            >
              At BluConnet Media, every campaign is built for high returns. Our
              ROI-based approach across digital marketing, email marketing, app
              development, and web development focuses your budget on what
              performs. AI-powered insights sharpen targeting and optimize
              results, while transparent reporting shows exactly what you earn.
              We scale what works, refine what doesn't, and support you at every
              step, so your growth stays steady, measurable, and sustainable.
            </motion.p>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                    className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-emerald-200 transition-all duration-300 text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl ${benefit.iconColor} flex items-center justify-center`}
                      >
                        <Icon className="text-xl" />
                      </div>

                      <span className="text-3xl font-black text-gray-100 group-hover:text-emerald-100 transition-colors">
                        {benefit.number}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2 text-left">
                      {benefit.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed text-left">
                      {benefit.description}
                    </p>

                    <div
                      className={`mt-3 ${benefit.arrowColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      <FaChartLine className="transform rotate-90" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Script Text - Your Growth Partner */}
            <motion.div
              initial={{ opacity: 0, rotate: -5, x: -20 }}
              whileInView={{ opacity: 1, rotate: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -top-8 left-10 z-20"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              <h3 className="text-5xl text-emerald-600 leading-tight text-left">
                Your
                <br />
                Growth Partner
              </h3>
            </motion.div>

            {/* More Reach Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 right-4 z-30 bg-white rounded-2xl p-4 shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <FaChartLine className="text-cyan-600" />
                </div>

                <div className="text-left">
                  <p className="text-xs text-gray-600 font-semibold">
                    More Reach.
                  </p>

                  <p className="text-xs text-cyan-600 font-bold">
                    More Opportunities.
                  </p>

                  <p className="text-xs text-emerald-600 font-bold">
                    Greater Returns.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            >
              {/* Globe Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-cyan-100/50" />

              {/* Image */}
              <img
                src={teamImage}
                alt="Team collaboration"
                className="w-full h-auto relative z-10 block"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent z-10" />

              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-0 left-0 right-0 z-20 p-6"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Clients */}
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <FaGlobe className="text-emerald-600 text-xl" />
                      </div>

                      <div className="text-2xl font-black text-emerald-600">
                        1000+
                      </div>

                      <div className="text-xs text-gray-600 font-medium">
                        Clients
                      </div>
                    </div>

                    {/* Countries */}
                    <div className="text-center border-x border-gray-200">
                      <div className="w-12 h-12 mx-auto mb-2 bg-cyan-100 rounded-xl flex items-center justify-center">
                        <FaUsers className="text-cyan-600 text-xl" />
                      </div>

                      <div className="text-2xl font-black text-cyan-600">
                        150+
                      </div>

                      <div className="text-xs text-gray-600 font-medium">
                        Countries
                      </div>
                    </div>

                    {/* Awards */}
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <FaTrophy className="text-emerald-600 text-xl" />
                      </div>

                      <div className="text-2xl font-black text-emerald-600">
                        12
                      </div>

                      <div className="text-xs text-gray-600 font-medium">
                        Awards 2025
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="text-center mt-6 text-sm font-bold text-gray-400 uppercase tracking-widest"
            >
              Connecting Brands to a Brighter Tomorrow
            </motion.p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </section>
  );
};

export default WhyChooseUs;