import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import getThemeColors from "../utils/themeColors";

const AboutHero = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "-100px",
  });

  // ------------------------------------------------------------
  // Background slides
  // ------------------------------------------------------------

  const slides = [
    "https://res.cloudinary.com/wyixfdon/image/upload/v1790167112/01_r4fqrw.png",
    "https://res.cloudinary.com/wyixfdon/image/upload/v1790167951/02_mcbozk.png",
    "https://res.cloudinary.com/wyixfdon/image/upload/v1790167126/03_urcyk6.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Preload background images
  useEffect(() => {
    slides.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Background slider
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------
  // Marquee
  // ------------------------------------------------------------

  const marqueeWords = [
    "Digital Growth",
    "Marketing Excellence",
    "Performance Marketing",
    "Growth Strategy",
    "Smart Marketing",
    "Customer Engagement",
    "Digital Innovation",
    "Measurable Results",
  ];

  // ------------------------------------------------------------
  // Cards
  // ------------------------------------------------------------

  const cards = [
    {
      number: "01",
      title: "CPA & Affiliate Networks",
      description: "Top CPA marketing network maximizing ROI",
      image:
        "https://res.cloudinary.com/wyixfdon/image/upload/v1791198727/about1_mdoxfw.png",
    },
    {
      number: "02",
      title: "SEO & Search Optimization",
      description: "Best SEO services driving top rankings.",
      image:
        "https://res.cloudinary.com/wyixfdon/image/upload/v1791191867/about2_rwuqzj.png",
    },
    {
      number: "03",
      title: "Mobile & Email Marketing",
      description: "High-converting mobile advertising and email deployment.",
      image:
        "https://res.cloudinary.com/wyixfdon/image/upload/v1791191880/about3_ssnpp5.png",
    },
    {
      number: "04",
      title: "Lead Generation Campaigns",
      description: "Top lead generation agency driving sales.",
      image:
        "https://res.cloudinary.com/wyixfdon/image/upload/v1791191904/about4_kcr14x.png",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-screen overflow-hidden px-4 pt-32 pb-20 sm:pt-40 md:pt-44 lg:pt-48 xl:pt-52"
    >
      {/* ========================================================
          BACKGROUND
          ======================================================== */}

      <div
        className="absolute inset-0 z-0 overflow-hidden bg-[#020711]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[#020711]" />

        {slides.map((src, index) => (
          <motion.img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            draggable="false"
            initial={false}
            animate={{
              opacity: currentSlide === index ? 1 : 0,
              scale: currentSlide === index ? 1 : 1.06,
            }}
            transition={{
              opacity: {
                duration: 1.5,
                ease: "easeInOut",
              },
              scale: {
                duration: 7,
                ease: "easeOut",
              },
            }}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}

        <div className="absolute inset-0 bg-black/20" />

        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-br from-[#020817]/70 via-black/35 to-[#021a2b]/45"
              : "bg-gradient-to-br from-black/65 via-black/35 to-emerald-950/40"
          }`}
        />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020711]/85 to-transparent" />

        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />
      </div>

      {/* ========================================================
          AMBIENT GLOW
          ======================================================== */}

      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`pointer-events-none absolute left-10 top-20 z-[1] h-[300px] w-[300px] rounded-full blur-[120px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] ${colors.glowLeft} opacity-20`}
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`pointer-events-none absolute bottom-20 right-10 z-[1] h-[300px] w-[300px] rounded-full blur-[120px] sm:h-[400px] sm:w-[400px] lg:h-[600px] lg:w-[600px] ${colors.glowRight} opacity-20`}
      />

      {/* ========================================================
          GRID
          ======================================================== */}

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle, ${colors.gridDotColor} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ========================================================
          ROTATING BADGE
          ======================================================== */}

      <div className="absolute left-4 top-40 z-20 hidden xl:block sm:left-6 lg:left-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative h-64 w-64"
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <defs>
              <path
                id="aboutCirclePath"
                d="M 100,100 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              />
            </defs>

            <text
              className="fill-white"
              fontSize="11"
              fontWeight="bold"
              letterSpacing="0.3em"
            >
              <textPath href="#aboutCirclePath" startOffset="0%">
                ABOUT US • DIGITAL AGENCY • EST. 2019 •
              </textPath>
            </text>
          </svg>

          <div
            className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br ${
              isDarkMode
                ? "from-[#d4e157] to-[#06b6d4]"
                : "from-emerald-500 to-cyan-600"
            } shadow-[0_0_35px_rgba(6,182,212,0.35)]`}
          >
            <span className="text-xs font-black text-white">10+</span>
          </div>
        </motion.div>
      </div>

      {/* ========================================================
          MAIN CONTENT
          ======================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-[1600px]">
        <div className="grid items-center gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14 xl:gap-16">
          {/* ====================================================
              LEFT CONTENT
              ==================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : -50,
            }}
            transition={{ duration: 0.8 }}
            className="min-w-0 text-left lg:pl-28 xl:pl-36"
          >
            {/* EST BADGE */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`mb-6 inline-flex items-center gap-3 rounded-full border px-5 py-2.5 shadow-lg backdrop-blur-md sm:mb-10 sm:px-6 sm:py-3 ${colors.badgeBg} ${colors.badgeBorder}`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className={`h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  }`}
                />

                <span
                  className={`absolute inset-0 h-2 w-2 rounded-full opacity-75 animate-ping sm:h-2.5 sm:w-2.5 ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  }`}
                />
              </div>

              <span className="bg-gradient-to-r from-lime-400 to-cyan-400 bg-clip-text text-[10px] font-black uppercase tracking-[0.2em] text-transparent sm:text-xs sm:tracking-[0.25em]">
                EST. 2019 • DIGITAL AGENCY
              </span>
            </motion.div>

            {/* HEADING */}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[0.98]"
            >
              {/* LINE 1 — We Engineer */}
              <span className="block whitespace-nowrap">We Engineer</span>

              {/* LINE 2 — Measurable */}
              <span className="relative inline-block whitespace-nowrap">
                <span
                  className={`bg-gradient-to-r bg-clip-text text-transparent ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-400 to-cyan-500"
                  }`}
                >
                  Measurable
                </span>

                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="aboutUnderlineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor={isDarkMode ? "#d4e157" : "#10b981"}
                      />

                      <stop
                        offset="100%"
                        stopColor={isDarkMode ? "#06b6d4" : "#0891b2"}
                      />
                    </linearGradient>
                  </defs>

                  <motion.path
                    d="M0 5 Q 50 0, 100 5 T 200 5"
                    stroke="url(#aboutUnderlineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      delay: 1,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </span>

              {/* LINE 3 — Digital Results */}
              <span className="block whitespace-nowrap font-light italic text-white/95">
                Digital Results
              </span>
            </motion.h1>

            {/* DESCRIPTION */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 max-w-2xl sm:mt-8"
            >
              <p className="rounded-2xl border border-white/20 bg-white/[0.08] px-6 py-5 text-base font-light leading-relaxed text-white/90 backdrop-blur-md sm:px-7 sm:py-6 sm:text-lg md:text-xl">
                At BluConnet Media, we bridge the space between creative
                execution and measurable ROI.As a full-service SEO digital
                marketing partner, we deliver mordern{" "}
                <span
                  className={`bg-gradient-to-r bg-clip-text font-semibold text-transparent ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-400 to-cyan-500"
                  }`}
                >
                  search engine optimization (SEO)
                </span>{" "}
                and targeted lead generation services to help determined
                businesses apprehend qualified leads and rule search rankings.
              </p>
            </motion.div>

            {/* CTA */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r px-6 py-3.5 font-bold shadow-xl transition-all duration-300 sm:w-auto sm:px-8 sm:py-4 ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)]"
                    : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)]"
                }`}
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />

                <span className="relative z-20 flex items-center justify-center gap-2 text-sm sm:text-base">
                  Generate Leads Online
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ====================================================
              RIGHT CARDS
              ==================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative mt-2 w-full lg:mt-2"
          >
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:gap-6">
              {cards.map((card, index) => (
                <motion.article
                  key={card.number}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    duration: 0.65,
                    ease: "easeOut",
                  }}
                  className="group relative aspect-[16/9] w-full overflow-hidden rounded-[24px] shadow-[0_18px_55px_rgba(0,0,0,0.38)] lg:scale-[1.04] xl:scale-[1.06]"
                >
                  {/* CARD IMAGE */}

                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={index < 2 ? "eager" : "lazy"}
                  />

                  {/* CARD OVERLAY */}

                  <div className="absolute inset-0 bg-black/35" />

                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-black/5" />

                  {/* CARD CONTENT */}

                  <div className="relative z-10 flex h-full flex-col items-start p-5 text-left sm:p-5 lg:p-7 xl:p-8">
                    <span className="text-sm font-black tracking-[0.18em] text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-base lg:text-lg">
                      {card.number}
                    </span>

                    <div className="mt-4 w-[70%] max-w-[280px] sm:mt-5 lg:w-[60%]">
                      <h3 className="whitespace-nowrap text-[20px] font-extrabold leading-[1.08] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-[21px] lg:text-[23px] xl:text-[25px]">
                        {card.title}
                      </h3>

                      <p className="mt-3 text-[12px] leading-[1.45] text-white/95 drop-shadow-[0_2px_7px_rgba(0,0,0,0.7)] sm:text-[12.5px] lg:text-[13.5px] xl:text-[14px]">
                        {card.description}
                      </p>
                    </div>

                    {/* ARROW */}

                    <motion.div
                      whileHover={{ x: 4, scale: 1.08 }}
                      className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white/85 bg-black/10 text-white backdrop-blur-[2px] shadow-[0_0_15px_rgba(56,189,248,0.28)] transition-all duration-300 group-hover:border-white group-hover:bg-white/10 sm:mt-3 sm:h-9 sm:w-9 lg:mt-3 lg:h-9 lg:w-9 xl:mt-4 xl:h-10 xl:w-10"
                    >
                      <FaArrowRight className="text-xs sm:text-sm" />
                    </motion.div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ========================================================
            BOTTOM MARQUEE
            ======================================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative mt-12 overflow-hidden border-y border-white/10 py-6 sm:mt-14 sm:py-8"
        >
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex whitespace-nowrap gap-8 sm:gap-12"
          >
            {[...marqueeWords, ...marqueeWords, ...marqueeWords].map(
              (word, i) => (
                <div
                  key={`${word}-${i}`}
                  className="flex items-center gap-8 sm:gap-12"
                >
                  <span
                    className={`text-3xl font-black opacity-20 transition-opacity hover:opacity-100 sm:text-5xl md:text-7xl ${
                      i % 2 === 0
                        ? `bg-gradient-to-r bg-clip-text text-transparent ${
                            isDarkMode
                              ? "from-[#d4e157] to-[#06b6d4]"
                              : "from-emerald-500 to-cyan-600"
                          }`
                        : "text-white"
                    }`}
                  >
                    {word}
                  </span>

                  <FaStar
                    className={`text-lg opacity-30 sm:text-2xl ${
                      isDarkMode ? "text-[#d4e157]" : "text-emerald-400"
                    }`}
                  />
                </div>
              ),
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
