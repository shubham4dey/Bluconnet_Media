import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Import image properly
import statsImage from "../assets/img/h1.png";

const Stats = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  /* =========================================================
     STATS DATA
  ========================================================= */

  const stats = [
    {
      number: "$8.6 BILLION",
      label: "CLIENT REVENUE DRIVEN (2025)",
    },
    {
      number: "110M+",
      label: "CONVERSIONS DRIVEN (2025)",
    },
    {
      number: "$430M+",
      label: "ANNUAL MEDIA SPEND (2025)",
    },
    {
      number: "30+",
      label: "AWARDS WON",
    },
    {
      number: "1000+",
      label: "ACTIVE CLIENTS MANAGED",
    },
    {
      number: "4",
      label: "CLIENTS IN FORTUNE 500'S TOP 10",
    },
  ];

  /* =========================================================
     PORTFOLIO NAVIGATION
  ========================================================= */

  const handlePortfolioClick = () => {
    navigate("/portfolio");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  return (
    <section
      onClick={handlePortfolioClick}
      className={`group relative cursor-pointer overflow-hidden py-20 px-4 transition-colors duration-500 md:py-28 ${
        isDarkMode
          ? "bg-[#050508]"
          : "bg-white"
      }`}
      aria-label="View our portfolio"
    >
      {/* =====================================================
          BACKGROUND GRADIENT
      ===================================================== */}

      <div
        className={`pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l ${
          isDarkMode
            ? "from-[#d4e157]/5 to-transparent"
            : "from-emerald-500/5 to-transparent"
        }`}
      />

      {/* =====================================================
          SUBTLE HOVER OVERLAY
      ===================================================== */}

      <div
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${
          isDarkMode
            ? "bg-gradient-to-br from-[#d4e157]/[0.015] via-transparent to-[#06b6d4]/[0.02]"
            : "bg-gradient-to-br from-emerald-50/40 via-transparent to-cyan-50/30"
        }`}
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* =================================================
              LEFT IMAGE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
            }}
            className="relative mx-auto w-full max-w-lg lg:mx-0"
            style={{
              perspective: "1000px",
            }}
          >
            {/* ===============================================
                MAIN 3D IMAGE CONTAINER
            =============================================== */}

            <motion.div
              initial={{
                rotateY: -15,
                rotateX: 5,
                opacity: 0,
              }}
              whileInView={{
                rotateY: 0,
                rotateX: 0,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1,
                type: "spring",
              }}
              className="transform-gpu relative"
              style={{
                transformStyle: "preserve-3d",
                transform:
                  "rotateY(-5deg) rotateX(5deg)",
              }}
            >
              {/* =========================================
                  MIDDLE 3D LAYER
              ========================================= */}

              <div
                className={`absolute inset-0 translate-z-[-15px] transform rounded-3xl border-2 bg-gradient-to-br ${
                  isDarkMode
                    ? "from-[#1a1f3a] to-[#0f1535] border-white/20"
                    : "from-slate-100 to-white border-gray-200"
                }`}
              />

              {/* =========================================
                  FRONT IMAGE
              ========================================= */}

              <div
                className={`relative translate-z-[0px] transform overflow-hidden rounded-3xl border-2 ${
                  isDarkMode
                    ? "border-[#d4e157]/40"
                    : "border-emerald-500/40"
                }`}
              >
                {/* Image Container */}

                <div className="relative flex min-h-[520px] items-center justify-center p-4 sm:min-h-[580px] md:min-h-[650px]">
                  <img
                    src={statsImage}
                    alt="Marketing Success"
                    className="h-auto max-h-[600px] w-full object-contain drop-shadow-xl"
                    style={{
                      transform:
                        "translateZ(20px)",
                    }}
                    onError={(e) => {
                      e.target.style.display =
                        "none";

                      if (
                        e.target.nextElementSibling
                      ) {
                        e.target.nextElementSibling.style.display =
                          "flex";
                      }
                    }}
                  />

                  {/* =====================================
                      FALLBACK
                  ===================================== */}

                  <div
                    className={`absolute inset-0 hidden items-center justify-center bg-gradient-to-br ${
                      isDarkMode
                        ? "from-[#0f1535] to-[#1a1f3a]"
                        : "from-white to-slate-50"
                    }`}
                  >
                    <div className="px-4 text-center">
                      <div
                        className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full ${
                          isDarkMode
                            ? "bg-[#d4e157]/20"
                            : "bg-emerald-100"
                        }`}
                      >
                        <svg
                          className={`h-12 w-12 ${
                            isDarkMode
                              ? "text-[#d4e157]"
                              : "text-emerald-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>

                      <p
                        className={`text-sm ${
                          isDarkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        Add your image to
                        <br />
                        src/assets/img/h1.png
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================
                  ESTABLISHED BADGE
                  2019
              ========================================= */}

              <motion.div
                initial={{
                  scale: 0,
                  rotate: 10,
                  z: 30,
                }}
                whileInView={{
                  scale: 1,
                  rotate: 0,
                  z: 30,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
                className={`absolute right-6 top-6 z-20 rounded-xl border-2 px-4 py-2 shadow-lg backdrop-blur-sm ${
                  isDarkMode
                    ? "border-white/20 bg-[#0f1535]"
                    : "border-gray-200 bg-white/90"
                }`}
                style={{
                  transform:
                    "translateZ(40px)",
                }}
              >
                <div
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDarkMode
                      ? "text-[#d4e157]"
                      : "text-emerald-600"
                  }`}
                >
                  Est. 2019
                </div>
              </motion.div>

              {/* =========================================
                  CORNER DECORATIONS
              ========================================= */}

              <div
                className={`absolute right-4 top-4 h-16 w-16 rounded-tr-2xl border-r-2 border-t-2 ${
                  isDarkMode
                    ? "border-[#d4e157]/40"
                    : "border-emerald-500/40"
                }`}
                style={{
                  transform:
                    "translateZ(30px)",
                }}
              />

              <div
                className={`absolute bottom-4 left-4 h-16 w-16 rounded-bl-2xl border-b-2 border-l-2 ${
                  isDarkMode
                    ? "border-[#06b6d4]/40"
                    : "border-cyan-600/40"
                }`}
                style={{
                  transform:
                    "translateZ(30px)",
                }}
              />
            </motion.div>
          </motion.div>

          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <motion.div
            ref={ref}
            className="text-center lg:text-left"
          >
            {/* ===============================================
                BADGE
            =============================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              className="mb-8"
            >
              <div
                className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 ${
                  isDarkMode
                    ? "border-[#d4e157]/30 bg-[#d4e157]/10 text-[#d4e157]"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {/* Blinking Circle */}

                <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isDarkMode
                        ? "bg-[#d4e157]"
                        : "bg-emerald-500"
                    }`}
                  />

                  <span
                    className={`absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full opacity-75 ${
                      isDarkMode
                        ? "bg-[#d4e157]"
                        : "bg-emerald-500"
                    }`}
                  />
                </div>

                <span
                  className={`text-[11px] font-bold uppercase tracking-wider sm:text-xs lg:text-sm ${
                    isDarkMode
                      ? "text-[#d4e157]"
                      : "text-emerald-600"
                  }`}
                >
                  OUR TRACK RECORD
                </span>
              </div>
            </motion.div>

            {/* ===============================================
                HEADING
            =============================================== */}

            <motion.h2
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
              }}
              transition={{
                duration: 0.6,
              }}
              className="mb-8 text-3xl font-extrabold leading-tight sm:text-4xl md:mb-12 md:text-5xl lg:text-6xl xl:text-7xl"
            >
              <span
                className={`font-black leading-tight ${
                  isDarkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                PROVEN MARKETING{" "}
              </span>

              <span
                className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-500 to-cyan-600"
                }`}
              >
                SUCCESS
              </span>
            </motion.h2>

            {/* ===============================================
                STATS GRID
            =============================================== */}

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 text-center sm:gap-x-6 sm:gap-y-10 md:gap-x-10 md:gap-y-12 lg:text-left">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                  className="group cursor-pointer"
                >
                  <h3
                    className={`mb-2 text-2xl font-bold transition-colors duration-300 sm:text-3xl md:text-4xl ${
                      isDarkMode
                        ? "text-white group-hover:text-[#d4e157]"
                        : "text-gray-900 group-hover:text-emerald-600"
                    }`}
                  >
                    {stat.number}
                  </h3>

                  <div
                    className={`mx-auto mb-3 h-0.5 w-12 bg-gradient-to-r transition-all duration-300 group-hover:w-20 lg:mx-0 ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    }`}
                  />

                  <p
                    className={`text-xs font-semibold uppercase tracking-wide transition-colors sm:text-sm md:text-base ${
                      isDarkMode
                        ? "text-gray-400 group-hover:text-[#d4e157]"
                        : "text-gray-600 group-hover:text-emerald-600"
                    }`}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* ===============================================
                PORTFOLIO MICRO CTA
            =============================================== */}

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
                delay: 0.7,
                duration: 0.5,
              }}
              className="mt-10 flex items-center justify-center gap-3 lg:justify-start"
            >
              <span
                className={`h-px w-8 ${
                  isDarkMode
                    ? "bg-[#d4e157]/50"
                    : "bg-emerald-500/50"
                }`}
              />

              <span
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isDarkMode
                    ? "text-gray-600 group-hover:text-[#d4e157]"
                    : "text-gray-400 group-hover:text-emerald-600"
                }`}
              >
                Explore Our Portfolio
              </span>

              <span
                className={`h-px w-8 ${
                  isDarkMode
                    ? "bg-[#06b6d4]/50"
                    : "bg-cyan-500/50"
                }`}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================
          3D TRANSFORM CSS
      ===================================================== */}

      <style>{`
        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .translate-z-\\[-30px\\] {
          transform: translateZ(-30px);
        }

        .translate-z-\\[-15px\\] {
          transform: translateZ(-15px);
        }

        .translate-z-\\[0px\\] {
          transform: translateZ(0px);
        }

        .translate-z-\\[20px\\] {
          transform: translateZ(20px);
        }

        .translate-z-\\[30px\\] {
          transform: translateZ(30px);
        }

        .translate-z-\\[40px\\] {
          transform: translateZ(40px);
        }

        .translate-z-\\[50px\\] {
          transform: translateZ(50px);
        }
      `}</style>
    </section>
  );
};

export default Stats;