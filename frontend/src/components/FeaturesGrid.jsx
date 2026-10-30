import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaUsers,
  FaGlobe,
  FaHandshake,
  FaArrowRight,
  FaTrophy,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import backgroundVideo from "../assets/video/featuregrid.mp4";

// =========================================================
// CLOUDINARY CARD BACKGROUND IMAGES
// =========================================================
const cardImage1 =
  "https://res.cloudinary.com/wyixfdon/image/upload/v1790936629/feature-card-1_lnlqly.png";

const cardImage2 =
  "https://res.cloudinary.com/wyixfdon/image/upload/v1790936644/feature-card-2_nyrhav.png";

const cardImage3 =
  "https://res.cloudinary.com/wyixfdon/image/upload/v1790936657/feature-card-3_fxxkv2.png";

const cardImage4 =
  "https://res.cloudinary.com/wyixfdon/image/upload/v1790936673/feature-card-4_xpabw9.png";

const FeaturesGrid = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSectionClick = () => {
    navigate("/about");
  };

  const features = [
    {
      title: "Drive Sustainable Growth for Your Brand",
      points: [
        "Long-term, strong relationships with major partners that drive success",
        "Customized partner recruitment",
      ],
      icon: FaRocket,
      iconGradient: "from-[#00f5d4] to-[#00b4d8]",
      glow: "#00f5d4",
      image: cardImage1,
    },

    {
      title: "Expect a High-Touch Consultative Approach",
      points: [
        "7-10 years average experience of Senior Account Directors",
        "Top award honors for performance & culture",
      ],
      icon: FaUsers,
      iconGradient: "from-[#a855f7] to-[#6366f1]",
      glow: "#a855f7",
      image: cardImage2,
    },

    {
      title: "Grow or Launch Your Global Program to New Regions",
      points: [
        "3 continents hubs located worldwide, with programs managed in 40+ countries",
        "20+ languages spoken by global employees",
      ],
      icon: FaGlobe,
      iconGradient: "from-[#ffd166] to-[#f59e0b]",
      glow: "#ffd166",
      image: cardImage3,
    },

    {
      title: "Tap Into A Massive Network of Global Partnerships",
      points: [
        "Continual discovery of new, creative, and non-traditional partners",
        "In-house publisher development team",
      ],
      icon: FaHandshake,
      iconGradient: "from-[#00c6ff] to-[#2563eb]",
      glow: "#00c6ff",
      image: cardImage4,
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
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        cursor-pointer
      "
    >
      {/* =========================================================
          FULL BACKGROUND VIDEO
      ========================================================== */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          object-center
        "
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* =========================================================
          MAIN CONTENT
          SAME WIDTH AS WHY CHOOSE US
      ========================================================== */}
      <div className="relative z-10 min-h-screen w-full flex items-center">
        <div
          className="
            w-full
            max-w-[1600px]
            mx-auto
            px-6
            sm:px-8
            lg:px-10
            xl:px-12
            py-16
            lg:py-20
          "
        >
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-12
              gap-10
              xl:gap-16
              items-center
            "
          >
            {/* =====================================================
                LEFT CONTENT
            ====================================================== */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="
                lg:col-span-6
                xl:col-span-[5.7]
                text-left
              "
            >
              {/* =================================================
                  10+ YEARS EXCELLENCE
              ================================================== */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.15,
                  duration: 0.6,
                }}
                className={`
                  inline-flex
                  items-center
                  gap-3
                  px-5
                  py-3
                  rounded-full
                  border
                  mb-7
                  transition-colors
                  duration-500
                  ${
                    isDarkMode
                      ? "border-[#d4e157]/60"
                      : "border-emerald-500/50"
                  }
                `}
              >
                <FaTrophy
                  className={`
                    text-lg
                    transition-colors
                    duration-500
                    ${
                      isDarkMode
                        ? "text-[#d4e157]"
                        : "text-emerald-500"
                    }
                  `}
                />

                <span
                  className={`
                    font-bold
                    text-sm
                    md:text-base
                    tracking-wide
                    transition-colors
                    duration-500
                    ${
                      isDarkMode
                        ? "text-[#d4e157]"
                        : "text-emerald-600"
                    }
                  `}
                >
                  10+ Years Excellence
                </span>
              </motion.div>

              {/* =================================================
                  HEADING
              ================================================== */}
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.25,
                  duration: 0.7,
                }}
                className="
                  text-4xl
                  sm:text-5xl
                  md:text-6xl
                  xl:text-[64px]
                  2xl:text-[68px]
                  font-extrabold
                  leading-[1.02]
                  tracking-tight
                  text-white
                "
              >
                Global Growth
                <br />
                Through{" "}
                <span
                  className={`
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    }
                  `}
                >
                  Possibilities
                </span>
              </motion.h2>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.4,
                  duration: 0.7,
                }}
                className="
                  mt-7
                  max-w-[560px]
                  text-base
                  md:text-lg
                  xl:text-xl
                  leading-relaxed
                  text-gray-400
                "
              >
                Strategic digital solutions that connect brands,
                people and opportunities worldwide.
              </motion.p>

              {/* =================================================
                  ACCENT LINE
              ================================================== */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 66 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.6,
                  duration: 0.7,
                }}
                className={`
                  h-1.5
                  rounded-full
                  mt-7
                  bg-gradient-to-r
                  transition-all
                  duration-500
                  ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  }
                `}
              />

              {/* =================================================
                  CONNECTING IDEAS WORLDWIDE
              ================================================== */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.7,
                  duration: 0.6,
                }}
                className="mt-8"
              >
                <p
                  className={`
                    text-3xl
                    md:text-4xl
                    leading-tight
                    font-semibold
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    transition-all
                    duration-500
                    ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    }
                  `}
                  style={{
                    fontFamily:
                      "'Brush Script MT', 'Segoe Script', cursive",
                  }}
                >
                  Connecting
                  <br />
                  <span className="ml-12">
                    Ideas Worldwide
                  </span>
                </p>

                <div
                  className={`
                    ml-12
                    mt-2
                    w-48
                    h-[2px]
                    rounded-full
                    rotate-[-5deg]
                    bg-gradient-to-r
                    transition-all
                    duration-500
                    ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    }
                  `}
                />
              </motion.div>
            </motion.div>

            {/* =====================================================
                RIGHT SIDE — 2x2 IMAGE CARDS
            ====================================================== */}
            <div
              className="
                lg:col-span-6
                xl:col-span-[6.3]
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-5
                  md:gap-6
                "
              >
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        y: 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.15 + index * 0.12,
                        duration: 0.65,
                      }}
                      className="
                        group
                        relative
                        min-h-[270px]
                        md:min-h-[285px]
                        rounded-[20px]
                        overflow-hidden
                      "
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* =================================================
                          CLOUDINARY CARD BACKGROUND IMAGE
                      ================================================== */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-cover
                          bg-center
                          bg-no-repeat
                        "
                        style={{
                          backgroundImage: `url("${feature.image}")`,
                        }}
                      />

                      {/* =================================================
                          STRONG DARK OVERLAY
                          Makes card text clearly visible
                      ================================================== */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-black/55
                        "
                      />

                      {/* =================================================
                          EXTRA COLOR OVERLAY
                          Keeps the image visible but improves readability
                      ================================================== */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-br
                          from-[#03141c]/35
                          via-[#03141c]/40
                          to-black/70
                        "
                      />

                      {/* =================================================
                          BOTTOM TEXT READABILITY OVERLAY
                      ================================================== */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/75
                          via-black/20
                          to-transparent
                        "
                      />

                      {/* =================================================
                          GLASS EFFECT
                      ================================================== */}
                      <div
                        className="
                          absolute
                          inset-0
                          rounded-[20px]
                          bg-white/[0.035]
                          backdrop-blur-[1px]
                          border
                        "
                        style={{
                          borderColor: `${feature.glow}cc`,
                          boxShadow: `
                            inset 0 0 25px ${feature.glow}08,
                            0 0 18px ${feature.glow}18
                          `,
                        }}
                      />

                      {/* =================================================
                          CARD CONTENT
                      ================================================== */}
                      <div
                        className="
                          relative
                          z-10
                          h-full
                          p-6
                          md:p-7
                          flex
                          flex-col
                          items-start
                          text-left
                        "
                      >
                        {/* =================================================
                            TOP ROW
                        ================================================== */}
                        <div
                          className="
                            w-full
                            flex
                            items-start
                            justify-between
                          "
                        >
                          {/* ICON */}
                          <div
                            className={`
                              w-14
                              h-14
                              md:w-16
                              md:h-16
                              rounded-full
                              bg-gradient-to-br
                              ${feature.iconGradient}
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                            `}
                            style={{
                              boxShadow: `
                                0 0 18px ${feature.glow}70,
                                0 0 35px ${feature.glow}30
                              `,
                            }}
                          >
                            <Icon
                              className="
                                text-white
                                text-2xl
                                md:text-[27px]
                              "
                            />
                          </div>

                          {/* ARROW */}
                          <div
                            className="
                              w-11
                              h-11
                              md:w-12
                              md:h-12
                              rounded-full
                              border
                              border-cyan-300/80
                              bg-black/30
                              flex
                              items-center
                              justify-center
                              text-cyan-300
                              flex-shrink-0
                            "
                          >
                            <FaArrowRight
                              className="
                                text-lg
                                md:text-xl
                              "
                            />
                          </div>
                        </div>

                        {/* =================================================
                            TITLE
                        ================================================== */}
                        <h3
                          className="
                            mt-6
                            w-full
                            text-left
                            text-lg
                            md:text-xl
                            xl:text-[21px]
                            font-extrabold
                            text-white
                            leading-[1.25]
                            tracking-tight
                            drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]
                          "
                        >
                          {feature.title}
                        </h3>

                        {/* =================================================
                            POINTS
                        ================================================== */}
                        <div
                          className="
                            mt-5
                            w-full
                            space-y-3.5
                          "
                        >
                          {feature.points.map((point, i) => (
                            <div
                              key={i}
                              className="
                                flex
                                items-start
                                justify-start
                                gap-3
                                text-left
                                text-sm
                                md:text-[15px]
                                text-white
                                leading-[1.45]
                                drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]
                              "
                            >
                              {/* BULLET */}
                              <span
                                className="
                                  mt-[7px]
                                  w-1.5
                                  h-1.5
                                  rounded-full
                                  flex-shrink-0
                                "
                                style={{
                                  backgroundColor:
                                    feature.glow,
                                  boxShadow: `
                                    0 0 7px ${feature.glow}
                                  `,
                                }}
                              />

                              <span className="text-left">
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;