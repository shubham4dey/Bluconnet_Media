import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

/* =========================================================
   PRIORITY GEOS — HOME PAGE ONLY

   Short GEO names are displayed.
   Hovering over a short GEO name shows the full GEO names.
   Hovering over an individual flag shows the full country/region
   name represented by that flag.
========================================================= */

const priorityGeos = [
  {
    name: "UK",
    fullName: "United Kingdom",
    flags: [
      {
        code: "gb",
        emoji: "🇬🇧",
        alt: "United Kingdom flag",
        fullName: "United Kingdom",
      },
    ],
    description:
      "Mature, English-speaking markets with established brands, sophisticated publishers and consistent, high-quality performance at scale.",
  },

  {
    name: "FR / ES / IT",
    fullName: "France / Spain / Italy",
    flags: [
      {
        code: "fr",
        emoji: "🇫🇷",
        alt: "France flag",
        fullName: "France",
      },
      {
        code: "es",
        emoji: "🇪🇸",
        alt: "Spain flag",
        fullName: "Spain",
      },
      {
        code: "it",
        emoji: "🇮🇹",
        alt: "Italy flag",
        fullName: "Italy",
      },
    ],
    description:
      "Europe's second-largest digital ad market, where measurable and fully compliant growth matters most.",
  },

  {
    name: "DE / BE / CH",
    fullName: "Germany / Belgium / Switzerland",
    flags: [
      {
        code: "de",
        emoji: "🇩🇪",
        alt: "Germany flag",
        fullName: "Germany",
      },
      {
        code: "be",
        emoji: "🇧🇪",
        alt: "Belgium flag",
        fullName: "Belgium",
      },
      {
        code: "ch",
        emoji: "🇨🇭",
        alt: "Switzerland flag",
        fullName: "Switzerland",
      },
    ],
    description:
      "Digitally advanced markets with high consumer value, strong audience trust and rigorous data-privacy standards.",
  },

  {
    name: "US / LATAM",
    fullName: "United States / Latin America",
    flags: [
      {
        code: "us",
        emoji: "🇺🇸",
        alt: "United States flag",
        fullName: "United States",
      },
      {
        code: "latam",
        emoji: "🌎",
        alt: "Latin America",
        fullName: "Latin America",
      },
    ],
    description:
      "A dense, cross-border hub of international headquarters, e-commerce leaders and early technology adopters.",
  },

  {
    name: "NO / SE / FI",
    fullName: "Norway / Sweden / Finland",
    flags: [
      {
        code: "no",
        emoji: "🇳🇴",
        alt: "Norway flag",
        fullName: "Norway",
      },
      {
        code: "se",
        emoji: "🇸🇪",
        alt: "Sweden flag",
        fullName: "Sweden",
      },
      {
        code: "fi",
        emoji: "🇫🇮",
        alt: "Finland flag",
        fullName: "Finland",
      },
    ],
    description:
      "Precision-driven markets where quality, transparency and return on spend lead every partnership decision.",
  },

  {
    name: "AU / NZ",
    fullName: "Australia / New Zealand",
    flags: [
      {
        code: "au",
        emoji: "🇦🇺",
        alt: "Australia flag",
        fullName: "Australia",
      },
      {
        code: "nz",
        emoji: "🇳🇿",
        alt: "New Zealand flag",
        fullName: "New Zealand",
      },
    ],
    description:
      "The world's largest performance-marketing arena, served with dedicated in-market teams on both sides of the border.",
  },
];

const PriorityGeos = () => {
  const { isDarkMode } = useTheme();

  // Codes whose flag image failed to load → fall back to emoji.
  const [failedFlags, setFailedFlags] = useState(() => new Set());

  const handleFlagError = (code) => {
    setFailedFlags((prev) => {
      if (prev.has(code)) return prev;

      const next = new Set(prev);
      next.add(code);

      return next;
    });
  };

  return (
    <section
      id="priority-geos"
      aria-labelledby="priority-geos-heading"
      className={`relative overflow-hidden px-4 py-16 transition-colors duration-500 md:py-24 ${
        isDarkMode
          ? "bg-[#050508]"
          : "bg-white border-t border-b border-slate-100"
      }`}
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* =========================================================
            HEADING + SUPPORTING DESCRIPTION
        ========================================================== */}

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
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          {/* MAIN HEADING */}
          <motion.h2
            id="priority-geos-heading"
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
              delay: 0.1,
            }}
            className="text-center text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl"
          >
            <span className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Priority{" "}
            </span>

            <span
              className={`bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4]"
                  : "from-emerald-500 to-cyan-600"
              }`}
            >
              GEOs
            </span>
          </motion.h2>

          {/* SUPPORTING DESCRIPTION */}
          <p
            className={`mt-5 max-w-2xl text-center text-[13px] sm:text-sm md:text-[15px] lg:text-lg leading-6 sm:leading-7 ${
              isDarkMode ? "text-gray-400" : "text-slate-600"
            }`}
          >
            We concentrate our deepest local expertise, dedicated account
            management and strongest partner relationships in the markets that
            deliver the highest value for our clients.
          </p>
        </motion.div>

        {/* =========================================================
            GEO CARD GRID — 2 COLUMNS (DESKTOP) x 3 ROWS
        ========================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
          {priorityGeos.map((geo, index) => (
            <motion.div
              key={geo.name}
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
                amount: 0.2,
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
              }}
              className={`group rounded-2xl border p-6 text-center transition-all duration-300 md:p-7 md:text-left ${
                isDarkMode
                  ? "border-white/10 bg-[#0f1535] shadow-black/40 hover:border-white/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                  : "border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:shadow-[0_14px_36px_rgba(15,23,42,0.10)]"
              }`}
            >
              {/* =====================================================
                  FLAG ICONS
              ====================================================== */}

              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {geo.flags.map((flag) =>
                  failedFlags.has(flag.code) ? (
                    <span
                      key={flag.code}
                      title={flag.fullName}
                      aria-label={flag.fullName}
                      className="inline-flex h-6 items-center text-xl leading-none md:h-7 md:text-2xl"
                    >
                      {flag.emoji}
                    </span>
                  ) : (
                    <img
                      key={flag.code}
                      src={`https://flagcdn.com/w80/${flag.code}.png`}
                      alt={flag.alt}
                      title={flag.fullName}
                      height={28}
                      loading="lazy"
                      decoding="async"
                      onError={() => handleFlagError(flag.code)}
                      className={`h-6 w-auto rounded-[3px] shadow-sm ring-1 md:h-7 ${
                        isDarkMode ? "ring-white/15" : "ring-black/10"
                      }`}
                    />
                  ),
                )}
              </div>

              {/* =====================================================
                  GEO NAME
                  Hover → Full GEO Name
              ====================================================== */}

              <h3
                title={geo.fullName}
                className={`mt-4 cursor-default text-lg font-bold md:text-xl ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {geo.name}
              </h3>

              {/* =====================================================
                  SHORT DESCRIPTION
              ====================================================== */}

              <p
                className={`mt-2 text-sm leading-relaxed md:text-[15px] ${
                  isDarkMode ? "text-gray-400" : "text-slate-600"
                }`}
              >
                {geo.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriorityGeos;
