import React, { useCallback, useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  FaAmazon,
  FaArrowLeft,
  FaArrowRight,
  FaBitcoin,
  FaChartLine,
  FaCloud,
  FaDice,
  FaGraduationCap,
  FaHeart,
  FaHeartbeat,
  FaLandmark,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaPlane,
  FaShieldAlt,
  FaSun,
  FaHome,
  FaStar,
  FaClipboardList,
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";

/* =========================================================
   TOP OFFERS — HOME PAGE ONLY
========================================================= */

const topOffers = [
  {
    id: "amazon-us-cpl",
    name: "Amazon US - CPL",
    category: "E-commerce",
    payout: "$45.00",
    location: "US",
    Icon: FaAmazon,
    image:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1791374518/a1_swuodx.png",
  },

  {
    id: "personal-loan-cpl",
    name: "Loan - CPL",
    category: "Finance",
    payout: "$82.00",
    location: "IN",
    Icon: FaLandmark,
    image:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1791374525/a2_resycz.png",
  },

  {
    id: "solar-energy",
    name: "Solar Energy",
    category: "Renewable Energy",
    payout: "$120.00",
    location: "UK",
    Icon: FaSun,
    image: "https://res.cloudinary.com/wyixfdon/image/upload/v1793000466/SolarEnergy_fw0ktb.jpg",
  },

  {
    id: "home-improvement",
    name: "Home Improvement",
    category: "Home Improvement",
    payout: "$85.00",
    location: "UK",
    Icon: FaHome,
    image: "https://res.cloudinary.com/wyixfdon/image/upload/v1793000460/HomeImprovement_phrfhm.jpg",
  },

  {
    id: "insurance-cpl",
    name: "Insurance - CPL",
    category: "Insurance",
    payout: "$36.00",
    location: "US",
    Icon: FaShieldAlt,
    image:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1791374548/a5_s68jm0.png",
  },

  {
    id: "travel-booking-cps",
    name: "Travel Booking - CPS",
    category: "Travel",
    payout: "$28.00",
    location: "UK",
    Icon: FaPlane,
    image:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1791374555/a6_jdaca8.png",
  },

  {
    id: "forex-trading-cpa",
    name: "Forex Trading - CPA",
    category: "Finance",
    payout: "$120.00",
    location: "Global",
    Icon: FaChartLine,
    image:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1791374561/a7_m9rmep.png",
  },

  {
    id: "health-supplement-cod",
    name: "Health Supplement - COD",
    category: "Health",
    payout: "$52.00",
    location: "DE",
    Icon: FaHeartbeat,
    image:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1791374581/a8_j7uhwu.png",
  },

  {
    id: "saas-subscription-recurring",
    name: "SaaS Subscription - Recurring",
    category: "Software",
    payout: "$65.00",
    location: "Global",
    Icon: FaCloud,
    image:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1791374587/a9_a0s6il.png",
  },

  {
    id: "astrology",
    name: "Astrology",
    category: "Astrology",
    payout: "$35.00",
    location: "UK",
    Icon: FaStar,
    image: "https://res.cloudinary.com/wyixfdon/image/upload/v1793000456/Astrology_o43ewd.jpg",
  },

  {
    id: "education-course-cps",
    name: "Education Course - CPS",
    category: "Education",
    payout: "$30.00",
    location: "US",
    Icon: FaGraduationCap,
    image:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1791374614/a11_duxmzw.png",
  },

  {
    id: "mobile-recharge-cps",
    name: "Mobile Recharge - CPS",
    category: "Telecom",
    payout: "$12.00",
    location: "IN",
    Icon: FaMobileAlt,
    image:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1791374621/a12_yidimi.png",
  },

  {
    id: "survey",
    name: "Survey",
    category: "Survey",
    payout: "$8.00",
    location: "UK",
    Icon: FaClipboardList,
    image: "https://res.cloudinary.com/wyixfdon/image/upload/v1793000450/Survey_tokgfh.jpg",
  },

  {
    id: "finance",
    name: "Finance",
    category: "Finance",
    payout: "$65.00",
    location: "UK",
    Icon: FaLandmark,
    image: "https://res.cloudinary.com/wyixfdon/image/upload/v1793000441/Finance_twzakw.jpg",
  },
];

const totalOffers = topOffers.length;

const SIDE_SCALE = 0.72;
const GHOST_SCALE = 0.6;

const AUTOPLAY_MS = 4000;

/* =========================================================
   RESPONSIVE CARD GEOMETRY
   Desktop dimensions remain unchanged
========================================================= */

const getLayout = (width) => {
  // Large desktop — unchanged
  if (width >= 1600) {
    return {
      cw: 620,
      ch: 500,
      sideX: 500,
    };
  }

  if (width >= 1440) {
    return {
      cw: 580,
      ch: 490,
      sideX: 465,
    };
  }

  if (width >= 1360) {
    return {
      cw: 565,
      ch: 480,
      sideX: 445,
    };
  }

  if (width >= 1280) {
    return {
      cw: 560,
      ch: 475,
      sideX: 425,
    };
  }

  if (width >= 1152) {
    return {
      cw: 540,
      ch: 465,
      sideX: 365,
    };
  }

  if (width >= 1024) {
    return {
      cw: 520,
      ch: 455,
      sideX: 300,
    };
  }

  // Tablet
  if (width >= 860) {
    return {
      cw: 440,
      ch: 400,
      sideX: 285,
    };
  }

  if (width >= 700) {
    return {
      cw: 400,
      ch: 370,
      sideX: 255,
    };
  }

  // Small tablet
  if (width >= 560) {
    return {
      cw: 330,
      ch: 340,
      sideX: 215,
    };
  }

  // Mobile
  const cw = Math.max(200, Math.min(width - 80, 280));

  return {
    cw,
    ch: 320,
    sideX: Math.round(cw * 0.73),
  };
};

/* =========================================================
   RELATIVE CARD POSITION
========================================================= */

const getRelative = (offerIndex, active) => {
  let rel = (offerIndex - active + totalOffers) % totalOffers;

  if (rel > totalOffers / 2) {
    rel -= totalOffers;
  }

  return rel;
};

/* =========================================================
   CARD SLOT
========================================================= */

const getSlot = (rel, layout) => {
  const abs = Math.abs(rel);
  const sign = rel < 0 ? -1 : 1;

  const ghostX = layout.sideX + Math.round(layout.cw * 0.66) - 20;

  if (abs === 0) {
    return {
      x: 0,
      scale: 1,
      opacity: 1,
      zIndex: 30,
    };
  }

  if (abs === 1) {
    return {
      x: sign * layout.sideX,
      scale: SIDE_SCALE,
      opacity: 0.92,
      zIndex: 20,
    };
  }

  if (abs === 2) {
    return {
      x: sign * ghostX,
      scale: GHOST_SCALE,
      opacity: 0.3,
      zIndex: 10,
    };
  }

  return {
    x: sign * (ghostX + (abs - 2) * 420),
    scale: GHOST_SCALE,
    opacity: 0,
    zIndex: 5,
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const TopOffers = () => {
  const { isDarkMode } = useTheme();

  const [index, setIndex] = useState(0);

  const [layout, setLayout] = useState(() =>
    typeof window !== "undefined"
      ? getLayout(window.innerWidth)
      : getLayout(1440),
  );

  /* =========================================================
     RESIZE
  ========================================================== */

  useEffect(() => {
    const handleResize = () => {
      setLayout(getLayout(window.innerWidth));
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* =========================================================
     INFINITE LOOP
  ========================================================== */

  const prev = useCallback(() => {
    setIndex((current) => (current - 1 + totalOffers) % totalOffers);
  }, []);

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % totalOffers);
  }, []);

  /* =========================================================
     AUTOPLAY
  ========================================================== */

  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const [autoplayToken, setAutoplayToken] = useState(0);

  const lastTouchAtRef = useRef(0);

  const bumpAutoplay = useCallback(() => {
    setAutoplayToken((current) => current + 1);
  }, []);

  useEffect(() => {
    if (isAutoplayPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      next();
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [isAutoplayPaused, autoplayToken, next]);

  /* =========================================================
     MANUAL CONTROLS
  ========================================================== */

  const handleNext = useCallback(() => {
    next();
    bumpAutoplay();
  }, [next, bumpAutoplay]);

  const handlePrev = useCallback(() => {
    prev();
    bumpAutoplay();
  }, [prev, bumpAutoplay]);

  const goToOffer = useCallback(
    (offerIndex) => {
      setIndex(offerIndex);
      bumpAutoplay();
    },
    [bumpAutoplay],
  );

  /* =========================================================
     MOUSE / TOUCH
  ========================================================== */

  const handleMouseEnter = () => {
    if (Date.now() - lastTouchAtRef.current < 700) {
      return;
    }

    setIsAutoplayPaused(true);
  };

  const handleMouseLeave = () => {
    setIsAutoplayPaused(false);
  };

  const handleTouchStart = () => {
    lastTouchAtRef.current = Date.now();
    bumpAutoplay();
  };

  const { cw, ch } = layout;

  /* =========================================================
     THEME COLORS
  ========================================================== */

  const accentColor = isDarkMode ? "text-[#d4e157]" : "text-emerald-500";

  const accentBorder = isDarkMode
    ? "border-[#d4e157]/40"
    : "border-emerald-400/60";

  const accentBackground = isDarkMode ? "bg-[#d4e157]/10" : "bg-white/80";

  const payoutColor = isDarkMode ? "text-[#d4e157]" : "text-emerald-500";

  const numberColor = isDarkMode ? "text-[#d4e157]/75" : "text-emerald-500/90";

  return (
    <section
      id="top-offers"
      aria-labelledby="top-offers-heading"
      className={`relative overflow-hidden px-4 py-16 transition-colors duration-500 md:py-24 ${
        isDarkMode
          ? "bg-[#050508]"
          : "border-b border-t border-slate-100 bg-white"
      }`}
    >
      <div className="relative z-10 mx-auto w-full max-w-[1500px]">
        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative mx-auto text-center"
        >
          {/* TOP OFFERS BADGE */}

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
              delay: 0.1,
              duration: 0.6,
            }}
            className="mb-5"
          >
            <div
              className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border-[#d4e157]/30 text-[#d4e157]"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  }`}
                />

                <span
                  className={`absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full opacity-75 ${
                    isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                  }`}
                />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider sm:text-xs lg:text-sm">
                TOP OFFERS
              </span>
            </div>
          </motion.div>

          {/* HEADING */}

          <motion.h2
            id="top-offers-heading"
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.08,
              duration: 0.65,
            }}
            className={`mx-auto max-w-[1100px] text-3xl font-black leading-[0.95] tracking-tight sm:text-4xl md:text-5xl lg:text-[68px] xl:text-[76px] ${
              isDarkMode ? "text-white" : "text-[#07172f]"
            }`}
          >
            <span className="block">
              Explore{" "}
              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                High-Converting
              </span>{" "}
              Offers
            </span>
          </motion.h2>

          {/* DESCRIPTION */}

          <motion.p
            initial={{
              opacity: 0,
              y: 18,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.18,
              duration: 0.6,
            }}
            className={`mx-auto mt-6 max-w-4xl text-[13px] leading-6 sm:text-sm sm:leading-7 md:text-[15px] lg:text-[15px] ${
              isDarkMode ? "text-gray-400" : "text-slate-600"
            }`}
          >
            Discover our top performing offers across multiple verticals and
            global markets. Start promoting high-quality offers and maximize
            your earnings.
          </motion.p>

          {/* VIEW ALL OFFERS — DESKTOP */}

          <Link
            to="/portfolio"
            className={`group absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-2 rounded-[12px] border px-5 py-2.5 text-sm font-semibold transition-all duration-300 xl:inline-flex ${
              isDarkMode
                ? "border-[#d4e157]/60 bg-transparent text-[#d4e157] hover:border-[#d4e157] hover:bg-[#d4e157]/10 hover:shadow-[0_0_25px_rgba(212,225,87,0.12)]"
                : "border-emerald-400 bg-transparent text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-[0_8px_25px_rgba(16,185,129,0.12)]"
            }`}
          >
            <span>View All Offers</span>

            <FaArrowRight
              aria-hidden="true"
              className="text-base transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* VIEW ALL OFFERS — MOBILE / TABLET */}

        <div className="mt-7 flex justify-center xl:hidden">
          <Link
            to="/services/affiliate"
            className={`group inline-flex items-center gap-2 rounded-[12px] border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              isDarkMode
                ? "border-[#d4e157]/60 bg-transparent text-[#d4e157] hover:border-[#d4e157] hover:bg-[#d4e157]/10 hover:shadow-[0_0_25px_rgba(212,225,87,0.12)]"
                : "border-emerald-400 bg-transparent text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-[0_8px_25px_rgba(16,185,129,0.12)]"
            }`}
          >
            <span>View All Offers</span>

            <FaArrowRight
              aria-hidden="true"
              className="text-base transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* =====================================================
            OFFER COVER FLOW
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 28,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.55,
            delay: 0.1,
          }}
          className="relative mt-10 md:mt-14"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
        >
          {/* STAGE */}

          <div
            className="relative mx-auto w-full overflow-hidden"
            style={{
              height: ch + 80,
            }}
          >
            {topOffers.map((offer, offerIndex) => {
              const { Icon } = offer;

              const rel = getRelative(offerIndex, index);

              const isActive = rel === 0;

              const slot = getSlot(rel, layout);

              const number = String(offerIndex + 1).padStart(2, "0");

              return (
                <div
                  key={offer.id}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: cw,
                    height: ch,
                    zIndex: slot.zIndex,
                  }}
                >
                  <motion.article
                    aria-hidden={!isActive}
                    data-active={isActive ? "true" : "false"}
                    initial={false}
                    animate={{
                      x: slot.x,
                      scale: slot.scale,
                      opacity: slot.opacity,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`absolute inset-0 overflow-hidden rounded-[30px] border-2 ${
                      isDarkMode
                        ? "border-[#d4e157]/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),0_0_0_1px_rgba(212,225,87,0.10)]"
                        : "border-emerald-300/70 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.45),0_0_0_1px_rgba(16,185,129,0.10)]"
                    }`}
                  >
                    {/* BACKGROUND IMAGE */}

                    {offer.image && (
                      <img
                        src={offer.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover scale-[1.12] transform-gpu"
                      />
                    )}

                    {/* FULL IMAGE THEME OVERLAY */}

                    <div
                      className={`absolute inset-0 ${
                        isDarkMode ? "bg-[#050508]/30" : "bg-white/10"
                      }`}
                      aria-hidden="true"
                    />

                    {/* CONTENT READABILITY OVERLAY */}

                    <div
                      className={`absolute inset-0 ${
                        isDarkMode
                          ? "bg-gradient-to-t from-[#050508]/90 via-[#050508]/30 to-transparent"
                          : "bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                      }`}
                      aria-hidden="true"
                    />

                    {/* INNER PREMIUM BORDER */}

                    <div
                      className={`pointer-events-none absolute inset-0 rounded-[28px] border ${
                        isDarkMode ? "border-white/[0.08]" : "border-white/40"
                      }`}
                      aria-hidden="true"
                    />

                    {/* OFFER NUMBER */}

                    <span
                      data-offer-number={number}
                      className={`absolute right-5 top-4 z-20 text-3xl font-black tracking-tight md:text-4xl ${numberColor}`}
                    >
                      {number}
                    </span>

                    {/* CARD CONTENT */}

                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-left md:p-8">
                      {/* OFFER ICON */}

                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-sm md:h-16 md:w-16 ${accentBorder} ${accentBackground} ${accentColor}`}
                      >
                        <Icon
                          className="text-xl md:text-2xl"
                          aria-hidden="true"
                        />
                      </div>

                      {/* OFFER NAME */}

                      <h3 className="mt-5 text-lg font-black leading-snug text-white md:text-[26px]">
                        {offer.name}
                      </h3>

                      {/* CATEGORY */}

                      <p className="mt-1 text-sm font-medium text-gray-300 md:text-base">
                        {offer.category}
                      </p>

                      {/* PAYOUT */}

                      <p
                        className={`mt-3 text-3xl font-black tracking-tight md:text-[34px] ${payoutColor}`}
                      >
                        {offer.payout}
                      </p>

                      {/* LOCATION */}

                      <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gray-300 md:text-[15px]">
                        <FaMapMarkerAlt
                          className={accentColor}
                          aria-hidden="true"
                        />

                        <span>{offer.location}</span>
                      </p>
                    </div>
                  </motion.article>
                </div>
              );
            })}

            {/* ===================================================
                PREVIOUS ARROW
            ==================================================== */}

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous offers"
              className={`absolute left-3 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 sm:left-5 sm:h-12 sm:w-12 ${
                isDarkMode
                  ? "border-[#d4e157]/40 bg-[#d4e157]/10 text-[#d4e157] backdrop-blur-md hover:border-[#d4e157]/70 hover:bg-[#d4e157]/20 hover:shadow-[0_0_20px_rgba(212,225,87,0.12)]"
                  : "border-emerald-300 bg-white text-emerald-600 shadow-[0_10px_25px_rgba(16,185,129,0.14)] hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-[0_10px_25px_rgba(16,185,129,0.18)]"
              }`}
            >
              <FaArrowLeft className="text-sm sm:text-base" />
            </button>

            {/* ===================================================
                NEXT ARROW
            ==================================================== */}

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next offers"
              className={`absolute right-3 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 sm:right-5 sm:h-12 sm:w-12 ${
                isDarkMode
                  ? "border-[#d4e157]/40 bg-[#d4e157]/10 text-[#d4e157] backdrop-blur-md hover:border-[#d4e157]/70 hover:bg-[#d4e157]/20 hover:shadow-[0_0_20px_rgba(212,225,87,0.12)]"
                  : "border-emerald-300 bg-white text-emerald-600 shadow-[0_10px_25px_rgba(16,185,129,0.14)] hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-[0_10px_25px_rgba(16,185,129,0.18)]"
              }`}
            >
              <FaArrowRight className="text-sm sm:text-base" />
            </button>
          </div>

          {/* =====================================================
              PAGINATION
          ====================================================== */}

          <div className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
            {topOffers.map((offer, offerIndex) => {
              const number = String(offerIndex + 1).padStart(2, "0");

              const isActive = offerIndex === index;

              return (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => goToOffer(offerIndex)}
                  aria-label={`Show offer ${number}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? isDarkMode
                        ? "w-9 bg-[#d4e157]"
                        : "w-9 bg-emerald-600"
                      : isDarkMode
                        ? "w-5 bg-white/20 hover:bg-white/35"
                        : "w-5 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TopOffers;
