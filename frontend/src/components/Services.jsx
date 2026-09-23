import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaStar,
  FaCheck,
  FaBolt,
  FaChartLine,
  FaUsers,
  FaMobileAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [activeCard, setActiveCard] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* =========================================================
     SERVICES DATA
  ========================================================= */

  const servicesData = [
    {
      title: "Email Marketing",
      shortTitle: "EMAIL MARKETING",
      route: "/services/email",
      icon: FaEnvelope,

      description:
        "Build meaningful customer relationships and drive measurable growth with strategic email marketing campaigns. From targeted messaging and audience segmentation to automation and performance optimization, we create campaigns that turn every email into an opportunity to engage, convert, and retain customers.",

      cards: [
        {
          title: "Targeted Campaigns",
          desc:
            "Reach the right audience with personalized email campaigns designed around customer interests, behaviors, and business goals.",
          icon: FaUsers,
        },
        {
          title: "Smart Automation",
          desc:
            "Create powerful automated journeys that nurture leads, engage customers, and deliver the right message at every stage of the customer lifecycle.",
          icon: FaBolt,
        },
        {
          title: "Performance & Growth",
          desc:
            "Track campaign performance, optimize engagement, and continuously improve conversions with data-driven email marketing strategies.",
          icon: FaChartLine,
        },
      ],
    },

    {
      title: "Lead Generation",
      shortTitle: "LEAD GENERATION",
      route: "/services/lead",
      icon: FaUsers,

      description:
        "Generate high-quality opportunities with targeted lead generation strategies designed around your audience, industry, and growth objectives. We combine data, campaigns, landing experiences, and optimization to help businesses build a stronger pipeline.",

      cards: [
        {
          title: "Targeted Leads",
          desc:
            "Identify and reach relevant audiences with campaigns designed to attract prospects that match your ideal customer profile.",
          icon: FaUsers,
        },
        {
          title: "Conversion Funnels",
          desc:
            "Create optimized customer journeys that turn visitors into qualified leads through compelling offers and experiences.",
          icon: FaBolt,
        },
        {
          title: "Data-Driven Growth",
          desc:
            "Measure lead quality, campaign performance, and conversion behavior to continuously improve acquisition results.",
          icon: FaChartLine,
        },
      ],
    },

    {
      title: "Mobile Marketing",
      shortTitle: "MOBILE MARKETING",
      route: "/services/mobile",
      icon: FaMobileAlt,

      description:
        "Connect with customers wherever they are through mobile-first marketing strategies designed to increase engagement, conversions, and brand loyalty. From mobile campaigns and personalized messaging to app-focused experiences, we help brands create meaningful connections throughout the customer journey.",

      cards: [
        {
          title: "Mobile Campaigns",
          desc:
            "Reach customers through targeted mobile campaigns designed to capture attention and drive meaningful engagement across devices.",
          icon: FaMobileAlt,
        },
        {
          title: "Personalized Engagement",
          desc:
            "Deliver relevant messages and experiences based on customer behavior, preferences, and interactions to build stronger relationships.",
          icon: FaUsers,
        },
        {
          title: "Drive Conversions",
          desc:
            "Turn mobile engagement into measurable results with optimized experiences and strategies focused on leads, sales, and customer retention.",
          icon: FaChartLine,
        },
      ],
    },
  ];

  /* =========================================================
     CURRENT SERVICE
  ========================================================= */

  const currentService = servicesData[activeTab];

  const CurrentServiceIcon = currentService.icon;

  const currentCard =
    currentService.cards[activeCard];

  const CurrentCardIcon = currentCard.icon;

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goToContact = (e) => {
    e.stopPropagation();
    navigate("/contact");
  };

  const goToDigitalServices = (e) => {
    e.stopPropagation();
    navigate("/digitalservices");
  };

  const goToService = (e, route) => {
    e.stopPropagation();
    navigate(route);
  };

  /* =========================================================
     MAIN SERVICE TAB
  ========================================================= */

  const handleTabChange = (index, e) => {
    e.stopPropagation();

    setActiveTab(index);
    setActiveCard(0);
  };

  /* =========================================================
     AUTOMATIC INNER CARD ANIMATION
  ========================================================= */

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveCard((prev) => {
        return (
          (prev + 1) %
          servicesData[activeTab].cards.length
        );
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [activeTab, isPaused]);

  /* =========================================================
     AUTOMATIC MAIN SERVICE ANIMATION
  ========================================================= */

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const next =
          (prev + 1) % servicesData.length;

        setActiveCard(0);

        return next;
      });
    }, 12000);

    return () => clearInterval(timer);
  }, [isPaused]);

  /* =========================================================
     SECTION CLICK
  ========================================================= */

  const handleSectionClick = () => {
    navigate("/digitalservices");
  };

  /* =========================================================
     CARD ANIMATION
  ========================================================= */

  const cardVariants = {
    initial: {
      opacity: 0,
      x: 70,
      scale: 0.96,
      filter: "blur(8px)",
    },

    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
    },

    exit: {
      opacity: 0,
      x: -70,
      scale: 0.96,
      filter: "blur(8px)",
    },
  };

  return (
    <section
      id="services"
      onClick={handleSectionClick}
      className={`relative overflow-hidden py-20 md:py-28 px-4 cursor-pointer transition-colors duration-700 ${
        isDarkMode
          ? "bg-[#050508]"
          : "bg-white"
      }`}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className={`absolute top-[18%] -left-40 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none ${
          isDarkMode
            ? "bg-[#d4e157]/10"
            : "bg-emerald-400/10"
        }`}
      />

      <div
        className={`absolute bottom-[5%] -right-40 w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none ${
          isDarkMode
            ? "bg-[#06b6d4]/10"
            : "bg-cyan-400/10"
        }`}
      />

      {/* Moving ambient glow */}

      <motion.div
        animate={{
          x: [0, 30, 0, -30, 0],
          y: [0, -20, 0, 20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-[30%] left-[10%] w-3 h-3 rounded-full pointer-events-none ${
          isDarkMode
            ? "bg-[#d4e157]/50"
            : "bg-emerald-400/50"
        }`}
      />

      <motion.div
        animate={{
          x: [0, -25, 0, 25, 0],
          y: [0, 20, 0, -20, 0],
        }}
        transition={{
          duration: 17,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-[20%] right-[12%] w-2 h-2 rounded-full pointer-events-none ${
          isDarkMode
            ? "bg-[#06b6d4]/60"
            : "bg-cyan-500/60"
        }`}
      />

      {/* Subtle grid */}

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode
              ? "#d4e157"
              : "#10b981"
          } 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ===================================================
            HEADER
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
          }}
          className="mb-12"
        >
          {/* Badge */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="flex justify-center mb-6"
          >
            <div
              className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border border-[#d4e157]/30 text-[#d4e157]"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-700"
              }`}
            >
              <span className="relative flex w-2.5 h-2.5">
                <span
                  className={`absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ${
                    isDarkMode
                      ? "bg-[#d4e157]"
                      : "bg-emerald-500"
                  }`}
                />

                <span
                  className={`relative inline-flex w-2.5 h-2.5 rounded-full ${
                    isDarkMode
                      ? "bg-[#d4e157]"
                      : "bg-emerald-500"
                  }`}
                />
              </span>

              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em]">
                OUR SERVICES
              </span>
            </div>
          </motion.div>

          {/* Heading */}

          <div className="flex items-center justify-center gap-3 md:gap-5 mb-10">

            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="shrink-0"
            >
              <FaStar
                className={`text-3xl md:text-5xl ${
                  isDarkMode
                    ? "text-[#d4e157]"
                    : "text-emerald-500"
                }`}
              />
            </motion.div>

            <h2
              className={`text-center font-black leading-[0.95] tracking-tight ${
                isDarkMode
                  ? "text-white"
                  : "text-gray-900"
              } text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`}
            >
              AFFILIATE & INFLUENCER
              <br />

              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                MARKETING SERVICES
              </span>
            </h2>
          </div>

          {/* =================================================
              SERVICE TABS
          ================================================= */}

          <div
            onClick={(e) => e.stopPropagation()}
            className={`flex justify-center border-b ${
              isDarkMode
                ? "border-white/10"
                : "border-gray-200"
            }`}
          >
            <div className="flex flex-wrap justify-center gap-4 sm:gap-7 md:gap-10">

              {servicesData.map(
                (service, index) => {
                  const Icon = service.icon;

                  return (
                    <motion.button
                      key={service.title}
                      type="button"
                      onClick={(e) =>
                        handleTabChange(index, e)
                      }
                      whileHover={{
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      className={`relative flex items-center gap-2 pb-4 text-[10px] sm:text-xs md:text-sm font-bold tracking-wide transition-colors duration-300 ${
                        activeTab === index
                          ? isDarkMode
                            ? "text-[#d4e157]"
                            : "text-emerald-600"
                          : isDarkMode
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <Icon size={12} />

                      <span>
                        {service.shortTitle}
                      </span>

                      {activeTab === index && (
                        <motion.span
                          layoutId="activeServiceLine"
                          className={`absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-full bg-gradient-to-r ${
                            isDarkMode
                              ? "from-[#d4e157] to-[#06b6d4]"
                              : "from-emerald-500 to-cyan-600"
                          }`}
                        />
                      )}
                    </motion.button>
                  );
                }
              )}
            </div>
          </div>
        </motion.div>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div
          className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-center"
          onClick={(e) => e.stopPropagation()}
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{
                opacity: 0,
                x: -35,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: 35,
              }}
              transition={{
                duration: 0.55,
              }}
            >
              {/* Icon */}

              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${
                  isDarkMode
                    ? "bg-[#d4e157]/10 border-[#d4e157]/20"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <CurrentServiceIcon
                  size={24}
                  className={
                    isDarkMode
                      ? "text-[#d4e157]"
                      : "text-emerald-600"
                  }
                />
              </motion.div>

              {/* Title */}

              <h3
                className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-5 ${
                  isDarkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {currentService.title}
              </h3>

              {/* Description */}

              <p
                className={`max-w-xl text-base md:text-lg leading-8 mb-8 ${
                  isDarkMode
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {currentService.description}
              </p>

              {/* Buttons */}

              <div className="flex flex-wrap gap-4">

                {/* Contact */}

                <motion.button
                  type="button"
                  onClick={goToContact}
                  whileHover={{
                    y: -3,
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className={`px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg ${
                    isDarkMode
                      ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27]"
                      : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"
                  }`}
                >
                  LET'S TALK

                  <FaArrowRight size={13} />
                </motion.button>

                {/* Digital Services */}

                <motion.button
                  type="button"
                  onClick={goToDigitalServices}
                  whileHover={{
                    y: -3,
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className={`px-7 py-3.5 rounded-xl font-bold border ${
                    isDarkMode
                      ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      : "bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  SEE MORE
                </motion.button>
              </div>

              {/* Bottom info */}

              <div
                className={`mt-6 flex items-center gap-2 text-xs font-semibold ${
                  isDarkMode
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                <FaCheck
                  size={10}
                  className={
                    isDarkMode
                      ? "text-[#d4e157]"
                      : "text-emerald-500"
                  }
                />

                Explore our complete digital services
              </div>
            </motion.div>
          </AnimatePresence>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div
            className="relative h-[400px] sm:h-[430px] flex items-center justify-center"
            onMouseEnter={() =>
              setIsPaused(true)
            }
            onMouseLeave={() =>
              setIsPaused(false)
            }
          >

            {/* =================================================
                ORBIT
            ================================================= */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className={`absolute w-[310px] h-[310px] sm:w-[360px] sm:h-[360px] rounded-full border border-dashed ${
                isDarkMode
                  ? "border-[#d4e157]/10"
                  : "border-emerald-500/10"
              }`}
            />

            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className={`absolute w-[230px] h-[230px] sm:w-[280px] sm:h-[280px] rounded-full border ${
                isDarkMode
                  ? "border-[#06b6d4]/10"
                  : "border-cyan-500/10"
              }`}
            />

            {/* =================================================
                BACK CARD 1
            ================================================= */}

            <motion.div
              animate={{
                y: [0, 8, 0],
                rotate: [-3, -1, -3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute w-[82%] sm:w-[78%] h-[320px] rounded-3xl ${
                isDarkMode
                  ? "bg-[#d4e157]/5 border border-[#d4e157]/10"
                  : "bg-emerald-50/70 border border-emerald-100"
              }`}
            />

            {/* =================================================
                BACK CARD 2
            ================================================= */}

            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [2, 0, 2],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute w-[86%] sm:w-[82%] h-[320px] rounded-3xl ${
                isDarkMode
                  ? "bg-[#06b6d4]/5 border border-[#06b6d4]/10"
                  : "bg-cyan-50/70 border border-cyan-100"
              }`}
            />

            {/* =================================================
                MAIN CARD
            ================================================= */}

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${activeCard}`}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative z-20 w-[94%] sm:w-[90%] h-[330px] sm:h-[350px] rounded-3xl p-7 sm:p-9 border shadow-2xl overflow-hidden backdrop-blur-xl ${
                  isDarkMode
                    ? "bg-[#0b1020]/95 border-white/10 shadow-black/50"
                    : "bg-white/95 border-gray-200 shadow-gray-200/70"
                }`}
              >
                {/* Top gradient */}

                <div
                  className={`absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r ${
                    isDarkMode
                      ? "from-transparent via-[#d4e157] to-transparent"
                      : "from-transparent via-emerald-500 to-transparent"
                  }`}
                />

                {/* Glow top */}

                <div
                  className={`absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
                    isDarkMode
                      ? "bg-[#d4e157]/10"
                      : "bg-emerald-400/10"
                  }`}
                />

                {/* Glow bottom */}

                <div
                  className={`absolute -bottom-24 -left-24 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
                    isDarkMode
                      ? "bg-[#06b6d4]/10"
                      : "bg-cyan-400/10"
                  }`}
                />

                {/* =================================================
                    CARD CONTENT
                ================================================= */}

                <div className="relative z-10 h-full flex flex-col">

                  {/* Icon */}

                  <motion.div
                    animate={{
                      scale: [1, 1.06, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-[#d4e157]/15 to-[#06b6d4]/15 border-[#d4e157]/20"
                        : "bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200"
                    }`}
                  >
                    <CurrentCardIcon
                      size={24}
                      className={
                        isDarkMode
                          ? "text-[#d4e157]"
                          : "text-emerald-600"
                      }
                    />
                  </motion.div>

                  {/* Insight label */}

                  <div className="flex items-center gap-2 mt-5 mb-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.22em] ${
                        isDarkMode
                          ? "text-[#d4e157]"
                          : "text-emerald-600"
                      }`}
                    >
                      INSIGHT
                    </span>

                    <span
                      className={`w-8 h-px ${
                        isDarkMode
                          ? "bg-[#d4e157]/40"
                          : "bg-emerald-300"
                      }`}
                    />
                  </div>

                  {/* Title */}

                  <h4
                    className={`text-2xl sm:text-3xl font-black leading-tight mb-3 ${
                      isDarkMode
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {currentCard.title}
                  </h4>

                  {/* Description */}

                  <p
                    className={`text-sm sm:text-base leading-6 sm:leading-7 max-w-xl ${
                      isDarkMode
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {currentCard.desc}
                  </p>

                  {/* =================================================
                      CARD FOOTER

                      IMPORTANT:
                      This is NOT absolute.
                      mt-auto keeps 01/03 at bottom.
                  ================================================= */}

                  <div className="mt-auto pt-5">

                    <div className="flex items-center justify-between">

                      {/* Counter */}

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-black ${
                            isDarkMode
                              ? "text-[#d4e157]"
                              : "text-emerald-600"
                          }`}
                        >
                          {String(
                            activeCard + 1
                          ).padStart(2, "0")}
                        </span>

                        <span
                          className={
                            isDarkMode
                              ? "text-gray-600"
                              : "text-gray-300"
                          }
                        >
                          /
                        </span>

                        <span
                          className={`text-lg font-bold ${
                            isDarkMode
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {String(
                            currentService.cards
                              .length
                          ).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Progress */}

                      <div className="flex items-center gap-1.5">
                        {currentService.cards.map(
                          (_, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCard(
                                  index
                                );
                              }}
                              aria-label={`Show card ${
                                index + 1
                              }`}
                              className={`relative overflow-hidden h-1.5 rounded-full transition-all duration-300 ${
                                index ===
                                activeCard
                                  ? "w-8"
                                  : "w-1.5"
                              } ${
                                isDarkMode
                                  ? "bg-white/15"
                                  : "bg-gray-200"
                              }`}
                            >
                              {index ===
                                activeCard && (
                                <motion.span
                                  key={`${activeTab}-${activeCard}`}
                                  initial={{
                                    width: "0%",
                                  }}
                                  animate={{
                                    width: "100%",
                                  }}
                                  transition={{
                                    duration: 4,
                                    ease: "linear",
                                  }}
                                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${
                                    isDarkMode
                                      ? "from-[#d4e157] to-[#06b6d4]"
                                      : "from-emerald-500 to-cyan-600"
                                  }`}
                                />
                              )}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* =================================================
                RIGHT CARD SEE MORE
            ================================================= */}

            <motion.button
              type="button"
              onClick={goToDigitalServices}
              whileHover={{
                scale: 1.06,
                y: -3,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className={`absolute z-30 bottom-[-8px] right-[8%] sm:right-[7%] px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border shadow-xl ${
                isDarkMode
                  ? "bg-[#0a0e27] border-[#d4e157]/20 text-[#d4e157]"
                  : "bg-white border-gray-200 text-emerald-600"
              }`}
            >
              SEE MORE

              <FaArrowRight size={9} />
            </motion.button>
          </div>
        </div>

        {/* ===================================================
            MAIN SERVICE INDICATOR
        =================================================== */}

        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-16 flex justify-center"
        >
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              isDarkMode
                ? "bg-white/[0.03] border-white/10"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {servicesData.map(
              (service, index) => (
                <button
                  key={service.title}
                  type="button"
                  onClick={(e) =>
                    handleTabChange(index, e)
                  }
                  aria-label={`Show ${service.title}`}
                  className={`rounded-full transition-all duration-500 ${
                    activeTab === index
                      ? "w-8 h-1.5"
                      : "w-1.5 h-1.5"
                  } ${
                    activeTab === index
                      ? isDarkMode
                        ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]"
                        : "bg-gradient-to-r from-emerald-500 to-cyan-600"
                      : isDarkMode
                        ? "bg-white/20"
                        : "bg-gray-300"
                  }`}
                />
              )
            )}
          </div>
        </div>

        {/* ===================================================
            BOTTOM CLICK HINT
        =================================================== */}

        <motion.div
          animate={{
            opacity: [0.45, 0.8, 0.45],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className={`mt-5 text-center text-[10px] uppercase tracking-[0.2em] font-bold ${
            isDarkMode
              ? "text-gray-600"
              : "text-gray-400"
          }`}
        >
          Explore all digital services
        </motion.div>
      </div>
    </section>
  );
};

export default Services;