import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaCheckCircle,
  FaAward,
  FaUsers,
  FaRocket,
  FaArrowRight,
  FaQuoteLeft,
  FaTrophy,
  FaChartLine,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
// import getThemeColors from "../utils/themeColors";

const WhoWeAre = () => {
  const { isDarkMode } = useTheme();
  // const colors = getThemeColors(isDarkMode);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Animated counter hook
  const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const counterRef = React.useRef(null);
    const inView = useInView(counterRef, { once: true });

    useEffect(() => {
      if (!inView) return;
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1,
        );
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [inView, end, duration]);

    return (
      <span ref={counterRef}>
        {count}
        {suffix}
      </span>
    );
  };

  const stats = [
    {
      icon: FaUsers,
      number: 1000,
      suffix: "+",
      label: "Happy Clients",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FaRocket,
      number: 1200,
      suffix: "+",
      label: "Projects Done",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaTrophy,
      number: 50,
      suffix: "+",
      label: "Awards Won",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: FaChartLine,
      number: 98,
      suffix: "%",
      label: "Success Rate",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const features = [
    {
      icon: FaCheckCircle,
      title: "Strategic Planning",
      desc: "Data-driven strategies for maximum impact",
    },
    {
      icon: FaCheckCircle,
      title: "Creative Design",
      desc: "Stunning visuals that captivate audiences",
    },
    {
      icon: FaCheckCircle,
      title: "Development",
      desc: "Cutting-edge technology solutions",
    },
    {
      icon: FaCheckCircle,
      title: "24/7 Support",
      desc: "Round-the-clock assistance for clients",
    },
  ];

  return (
    <section
      className={`relative py-16 md:py-24 lg:py-32 px-4 overflow-hidden ${isDarkMode ? "bg-[#050508]" : "bg-gradient-to-br from-slate-50 to-white"}`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDarkMode ? "#d4e157" : "#10b981"} 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-300/20"}`}
      ></motion.div>

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-300/20"}`}
      ></motion.div>

      {/* Decorative Lines */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? { opacity: 0.3, scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className={`absolute top-40 left-0 w-32 h-px ${isDarkMode ? "bg-gradient-to-r from-[#d4e157] to-transparent" : "bg-gradient-to-r from-emerald-500 to-transparent"}`}
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? { opacity: 0.3, scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.4 }}
        className={`absolute bottom-40 right-0 w-32 h-px ${isDarkMode ? "bg-gradient-to-l from-[#06b6d4] to-transparent" : "bg-gradient-to-l from-cyan-500 to-transparent"}`}
      ></motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section - Badge & Title - MOBILE OPTIMIZED */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          {/* Premium Badge */}
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
              Who We Are
            </span>
          </motion.div>

          {/* Main Heading - MOBILE OPTIMIZED */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className={`font-black leading-tight mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
          >
            We're a Team of
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              Digital Innovators
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className={`text-base md:text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Transforming brands through creative excellence and strategic
            innovation
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
          {/* Left - Premium Image Layout */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative">
              {/* Main Image with Unique Shape */}
              <div className="relative overflow-hidden rounded-[3rem]">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Our Team"
                  className="w-full h-[600px] object-cover"
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? "from-[#0a0e27]/60" : "from-black/30"} via-transparent to-transparent`}
                ></div>

                {/* Floating Experience Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="absolute top-8 left-8"
                >
                  <div
                    className={`${isDarkMode ? "bg-[#0f1535]/90" : "bg-white/90"} backdrop-blur-xl rounded-2xl p-6 shadow-2xl border ${isDarkMode ? "border-[#d4e157]/30" : "border-emerald-200"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} flex items-center justify-center shadow-lg`}
                      >
                        <FaAward className="text-white text-2xl" />
                      </div>
                      <div>
                        <div
                          className={`text-3xl font-black ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                        >
                          <AnimatedCounter end={10} suffix="+" />
                        </div>
                        <div
                          className={`text-[11px] sm:text-xs lg:text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Years Experience
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Quote Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-8 right-8 max-w-xs"
                >
                  <div
                    className={`${isDarkMode ? "bg-[#0f1535]/90" : "bg-white/90"} backdrop-blur-xl rounded-2xl p-6 shadow-2xl border ${isDarkMode ? "border-[#06b6d4]/30" : "border-cyan-200"}`}
                  >
                    <FaQuoteLeft
                      className={`text-3xl mb-3 ${isDarkMode ? "text-[#06b6d4]/50" : "text-cyan-500/50"}`}
                    />
                    <p
                      className={`text-[11px] sm:text-xs lg:text-sm italic mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      "BluConnet transformed our digital presence completely.
                      Their strategic approach delivered 300% ROI."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                      <div>
                        <div
                          className={`text-[11px] sm:text-xs lg:text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                        >
                          Shikha Sharma
                        </div>
                        <div
                          className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                        >
                          CEO, TechCorp
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute top-2 right-2 md:-top-8 md:-right-8 w-14 h-14 md:w-24 md:h-24 rounded-full border-2 ${
                  isDarkMode ? "border-[#d4e157]/30" : "border-emerald-300/50"
                }`}
              ></motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className={`absolute bottom-2 left-2 md:-bottom-8 md:-left-8 w-16 h-16 md:w-32 md:h-32 rounded-full border-2 ${
                  isDarkMode ? "border-[#06b6d4]/30" : "border-cyan-300/50"
                }`}
              ></motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-6"
          >
            {/* Section Title */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className={`text-2xl sm:text-3xl lg:text-4xl leading-tight text-start font-bold mb-5 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Helping You Succeed Through{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                Creative & Digital Services
              </span>
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className={`text-base md:text-xl leading-relaxed text-start mb-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              At BluConnet Media, we are a passionate team of digital
              innovators, creative thinkers, and strategic experts dedicated to
              transforming your brand's digital presence. We combine
              cutting-edge technology with creative excellence to deliver
              measurable results.
            </motion.p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`group p-5 rounded-2xl border text-start transition-all duration-300 cursor-pointer ${
                    isDarkMode
                      ? "bg-white/5 border-white/10 hover:border-[#d4e157]/50 hover:bg-white/10"
                      : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-xl"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isDarkMode ? "from-[#d4e157]/20 to-[#06b6d4]/20" : "from-emerald-100 to-cyan-100"} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon
                      className={`text-xl ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                    />
                  </div>
                  <h4
                    className={`font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {feature.title}
                  </h4>
                  <p
                    className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden group px-8 py-4 bg-gradient-to-r font-black text-sm md:text-base uppercase tracking-widest rounded-full shadow-xl transition-all duration-300 flex items-center gap-3 ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                  : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
              }`}
            >
              {/* Animated Shine/Sweep Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

              <span className="relative z-20 flex items-center gap-3">
                Learn More About Us
                <FaArrowRight className="text-lg group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className={`relative rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12
          ${
            isDarkMode
              ? "bg-gradient-to-br from-white/5 to-white/10 border border-white/10"
              : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
          }`}
          >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.3 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="text-center group cursor-pointer py-2"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto rounded-xl lg:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 shadow-lg group-hover:shadow-2xl transition-all`}
                >
                  <stat.icon className="text-white text-lg sm:text-xl lg:text-2xl" />
                </div>
                <div
                  className={`text-3xl sm:text-3xl lg:text-4xl font-black mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div
                  className={`text-[11px] sm:text-xs lg:text-sm font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decorative Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className={`absolute top-2 right-2 md:top-3 md:right-3 lg:-top-6 lg:-right-6 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 ${isDarkMode ? "border-[#d4e157]/30" : "border-emerald-300/50"}`}
          ></motion.div>

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className={`absolute bottom-2 left-2 md:bottom-3 md:left-3 lg:-bottom-6 lg:-left-6 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full border-2 ${isDarkMode ? "border-[#06b6d4]/30" : "border-cyan-300/50"}`}
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhoWeAre;
