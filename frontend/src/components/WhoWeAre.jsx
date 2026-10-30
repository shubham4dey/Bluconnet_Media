import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaCheckCircle,
  FaAward,
  FaArrowRight,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// import getThemeColors from "../utils/themeColors";
// Animated counter - counts from 0 up to `end` once it scrolls into view.
// - Defined at module scope (not inside WhoWeAre) so a re-render of the
//   parent can never remount it, which used to reset the value back to 0.
// - `data-i18n-skip` keeps the runtime translation engine (i18n/autoTranslate)
//   from rewriting the animated number back to the first value it saw, which
//   froze the counter at 0.
// - `startedRef` guarantees the count runs exactly once.

const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const counterRef = React.useRef(null);
  const inView = useInView(counterRef, { once: true });
  const startedRef = React.useRef(false);
  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;
    let frameId;
    let startTime;

    const animate = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / (duration * 1000),

        1,
      );

      if (progress < 1) {
        setCount(Math.floor(progress * end));

        frameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [inView, end, duration]);

  return (
    <span ref={counterRef} data-i18n-skip="">
      {count}
      {suffix}
    </span>
  );
};

const WhoWeAre = () => {
  const { isDarkMode } = useTheme();
  // const colors = getThemeColors(isDarkMode);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const features = [
    {
      icon: FaCheckCircle,
      title: "SEO & Search Optimization",
      desc: "Top search engine optimization services driving rankings.",
    },

    {
      icon: FaCheckCircle,
      title: "Online Lead Generation",
      desc: "Generate qualified leads for business growth.",
    },

    {
      icon: FaCheckCircle,
      title: "Email & Mobile Marketing",
      desc: "Targeted email marketing campaigns driving conversions.",
    },

    {
      icon: FaCheckCircle,
      title: "CPA & Affiliate Networks",
      desc: "Scalable affiliate marketing programs maximizing ROI.",
    },
  ];

  return (
    <section
      className={`relative py-16 md:py-24 lg:py-32 px-4 overflow-hidden ${
        isDarkMode ? "bg-[#050508]" : "bg-gradient-to-br from-slate-50 to-white"
      }`}
    >
      {/* Animated Background Pattern */}

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${
              isDarkMode ? "#d4e157" : "#10b981"
            } 1px, transparent 1px)`,

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
        className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl ${
          isDarkMode ? "bg-emerald-500/10" : "bg-emerald-300/20"
        }`}
      ></motion.div>

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl ${
          isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-300/20"
        }`}
      ></motion.div>

      {/* Decorative Lines */}

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? { opacity: 0.3, scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className={`absolute top-40 left-0 w-32 h-px ${
          isDarkMode
            ? "bg-gradient-to-r from-[#d4e157] to-transparent"
            : "bg-gradient-to-r from-emerald-500 to-transparent"
        }`}
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? { opacity: 0.3, scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.4 }}
        className={`absolute bottom-40 right-0 w-32 h-px ${
          isDarkMode
            ? "bg-gradient-to-l from-[#06b6d4] to-transparent"
            : "bg-gradient-to-l from-cyan-500 to-transparent"
        }`}
      ></motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section */}

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
              className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${
                isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
              }`}
            >
              Who We Are
            </span>
          </motion.div>

          {/* Main Heading */}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className={`font-black leading-tight mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
          >
            We're What Exactly
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4]"
                  : "from-emerald-500 to-cyan-600"
              }`}
            >
              Your Business Needs
            </span>
          </motion.h2>

          {/* Subtitle */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className={`text-base md:text-xl max-w-3xl mx-auto ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Transforming brands through creative excellence and strategic
            innovation
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}

        <div className="grid lg:grid-cols-12 gap-12 items-center mb-20 lg:mb-48">
          {/* Left - Premium Image Layout */}

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative overflow-visible">
              {/* Main Image */}

              <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem]">
                <img
                  src="https://res.cloudinary.com/wyixfdon/image/upload/v1790247517/ChatGPT_Image_Sep_24_2026_04_27_18_PM_lmxzkx.png"
                  alt="Our Team"
                  className="w-full h-[500px] sm:h-[540px] md:h-[580px] lg:h-[600px] object-cover object-center"
                />

                {/* Gradient Overlay */}

                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    isDarkMode ? "from-[#0a0e27]/60" : "from-black/30"
                  } via-transparent to-transparent`}
                ></div>

                {/* Floating Experience Badge */}

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    delay: 0.6,

                    type: "spring",

                    stiffness: 200,
                  }}
                  className="absolute top-5 left-5 sm:top-8 sm:left-8"
                >
                  <div
                    className={`${
                      isDarkMode ? "bg-[#0f1535]/90" : "bg-white/90"
                    } backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border ${
                      isDarkMode ? "border-[#d4e157]/30" : "border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${
                          isDarkMode
                            ? "from-[#d4e157] to-[#06b6d4]"
                            : "from-emerald-500 to-cyan-600"
                        } flex items-center justify-center shadow-lg`}
                      >
                        <FaAward className="text-white text-xl sm:text-2xl" />
                      </div>

                      <div>
                        <div
                          className={`text-2xl sm:text-3xl font-black ${
                            isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                          }`}
                        >
                          <AnimatedCounter end={10} suffix="+" />
                        </div>

                        <div
                          className={`text-[10px] sm:text-xs lg:text-sm font-semibold ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Years Experience
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating Quote Card */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="
                  relative
                  w-[calc(100%-1rem)]
                  sm:w-[calc(100%-2rem)]
                  max-w-md
                  mx-auto
                  -mt-8
                  sm:-mt-10
                  lg:absolute
                  lg:w-auto
                  lg:max-w-xs
                  lg:mx-0
                  lg:mt-0
                  lg:bottom-[-130px]
                  lg:right-8
                  z-30
                "
              >
                <div
                  className={`relative ${
                    isDarkMode ? "bg-[#0f1535]/95" : "bg-white/95"
                  } backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-2xl border ${
                    isDarkMode ? "border-[#06b6d4]/30" : "border-cyan-200"
                  }`}
                >
                  {/* LEFT QUOTE MARK */}

                  <FaQuoteLeft
                    className={`absolute top-5 left-5 text-3xl ${
                      isDarkMode ? "text-[#06b6d4]/50" : "text-cyan-500/50"
                    }`}
                  />

                  {/* RIGHT QUOTE MARK */}

                  <FaQuoteRight
                    className={`absolute top-5 right-5 text-3xl ${
                      isDarkMode ? "text-[#06b6d4]/50" : "text-cyan-500/50"
                    }`}
                  />

                  {/* Quote Text - Center */}

                  <p
                    className={`text-[11px] sm:text-xs lg:text-sm italic mb-5 leading-relaxed text-center pt-12 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    "BluConnet transformed our digital presence completely.
                    Their strategic approach delivered 300% ROI."
                  </p>

                  {/* Profile Group - EXACT CENTER */}

                  <div className="flex items-center justify-center gap-3 w-full">
                    {/* Profile Circle */}

                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shrink-0"></div>

                    {/* Name + Designation */}

                    <div className="text-left">
                      <div
                        className={`text-[11px] sm:text-xs lg:text-sm font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Shikha Sharma
                      </div>

                      <div
                        className={`text-xs ${
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        CEO, Bluconnet
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className={`absolute top-2 right-2 md:-top-8 md:-right-8 w-14 h-14 md:w-24 md:h-24 rounded-full border-2 ${
                  isDarkMode ? "border-[#d4e157]/30" : "border-emerald-300/50"
                }`}
              ></motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
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
              className={`text-2xl sm:text-3xl lg:text-4xl leading-tight text-center lg:text-start font-bold mb-5 ${
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
              className={`text-base md:text-xl leading-relaxed text-center lg:text-start mb-8 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              At BluConnet Media, we are a performance-focused lead generation
              agency and search engine optimization company dedicated to
              maximizing your ROI. From targeted email marketing in digital
              marketing and mobile advertising to comprehensive website SEO
              services and high-converting CPA affiliate networks, we build
              custom marketing strategies that generate leads online and rank
              your business at the top of search engines.
            </motion.p>

            {/* Features Grid */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`group p-5 rounded-2xl border text-center lg:text-start transition-all duration-300 cursor-pointer ${
                    isDarkMode
                      ? "bg-white/5 border-white/10 hover:border-[#d4e157]/50 hover:bg-white/10"
                      : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-xl"
                  }`}
                >
                  <div
                    className={`w-12 h-12 mx-auto lg:mx-0 rounded-xl bg-gradient-to-br ${
                      isDarkMode
                        ? "from-[#d4e157]/20 to-[#06b6d4]/20"
                        : "from-emerald-100 to-cyan-100"
                    } flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon
                      className={`text-xl ${
                        isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                      }`}
                    />
                  </div>

                  <h4
                    className={`font-bold mb-1 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {feature.title}
                  </h4>

                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-500" : "text-gray-500"
                    }`}
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
              className={`relative overflow-hidden group mx-auto lg:mx-0 px-8 py-4 bg-gradient-to-r font-black text-sm md:text-base uppercase tracking-widest rounded-full shadow-xl transition-all duration-300 flex items-center gap-3 ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                  : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
              }`}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

              <span className="relative z-20 flex items-center gap-3">
                Learn More About Us
                <FaArrowRight className="text-lg group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
