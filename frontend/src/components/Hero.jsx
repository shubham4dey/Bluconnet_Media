import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar } from "react-icons/fa";
import {
  FaChartLine,
  FaSearch,
  FaUsers,
  FaEnvelope,
  FaRobot,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import getThemeColors from "../utils/themeColors";
import { useNavigate } from "react-router-dom";

const trustedCompanies = [
  {
    name: "Affise",
    logo: "https://res.cloudinary.com/wyixfdon/image/upload/v1786004101/affise-logo_g4dnxg.png",
  },
  {
    name: "Namecheap",
    logo: "https://res.cloudinary.com/wyixfdon/image/upload/v1786004095/namecheap-logo_jxewiq.webp",
  },
  {
    name: "Campaign",
    dayLogo:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1787912115/campaign-day_uxa4no.png",
    nightLogo:
      "https://res.cloudinary.com/wyixfdon/image/upload/v1787912194/campaign-night_nzwyax.png",
  },
  {
    name: "Mindbaz",
    logo: "https://res.cloudinary.com/wyixfdon/image/upload/v1786004080/mindbaz-logo_hhaqsn.png",
  },
];

const Hero = () => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const colors = getThemeColors(isDarkMode);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  /* Hero headline — translated via the existing language system
     (useLanguage().t), split into the two styled parts so the original
     two-span layout, colors and gradient stay exactly unchanged. */
  const heroTitle = t("hero.title");
  const heroSplit = (() => {
    const i = heroTitle.indexOf(". ");
    if (i === -1) return { first: heroTitle, second: "" };
    return {
      first: heroTitle.slice(0, i + 1),
      second: heroTitle.slice(i + 2),
    };
  })();

  const goToContact = () => {
    navigate("/contact");
  };

  // Canvas Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount =
        window.innerWidth < 480 ? 15 : window.innerWidth < 768 ? 25 : 50;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particleColor = isDarkMode ? "212, 225, 87" : "16, 185, 129";
      const lineColor = isDarkMode ? "6, 182, 212" : "8, 145, 178";

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, 0.3)`;
        ctx.fill();

        // Connect nearby particles
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor}, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColor}, ${0.3 * (1 - distance / mouse.radius)})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    createParticles();
    drawParticles();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDarkMode]);

  return (
    <section
      className={`relative min-h-[85vh] lg:min-h-screen flex items-center pt-40 sm:pt-36 md:pt-36 lg:pt-40 pb-12 lg:pb-20 px-4 overflow-hidden ${colors.sectionBg}`}
    >
      {/* Canvas Particle Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Subtle Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, ${colors.gridDotColor} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Glow Effects */}
      <div
        className={`absolute top-20 left-1/4 w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full blur-3xl ${colors.glowLeft}`}
      ></div>
      <div
        className={`absolute bottom-20 right-1/4 w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full blur-3xl ${colors.glowRight}`}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 shadow-md ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border border-[#d4e157]/30"
                  : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
              }`}
            >
              <span
                className={`w-2 h-2 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full animate-pulse`}
              ></span>
              <span
                className={`text-xs font-extrabold tracking-wider uppercase ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-700"
                }`}
              >
                #1 DIGITAL MARKETING AGENCY
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.8 }}
  data-i18n-skip
  className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] ${
    isDarkMode ? "text-white" : "text-gray-900"
  }`}
>
  <span>
    {heroSplit.first}{" "}
  </span>

  <span
    className={`text-transparent bg-clip-text bg-gradient-to-r ${
      isDarkMode
        ? "from-[#d4e157] to-[#06b6d4]"
        : "from-emerald-500 to-cyan-600"
    }`}
  >
    {heroSplit.second}
  </span>
</motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`mt-6 ${colors.textMuted} text-base md:text-lg leading-relaxed max-w-xl`}
            >
              We build intelligent digital solutions that transform businesses worldwide
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              {/* Get Started Button (Already Premium) */}
              <motion.button
                onClick={goToContact}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden group w-full sm:w-auto px-8 py-4 bg-gradient-to-r font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                    : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
                }`}
              >
                {/* Animated Shine/Sweep Effect on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

                <span className="relative z-20 flex items-center gap-2">
                  Start Your Project
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>

              {/* Book a Demo Button (Premium Effects Added, Original Colors Kept) */}
              <motion.button
                onClick={() => navigate("/portfolio")}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden group w-full sm:w-auto px-8 py-4 ${colors.secondaryBtnBg} border ${colors.secondaryBtnBorder} ${colors.secondaryBtnText} font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isDarkMode ? "hover:bg-white/10" : "hover:bg-slate-200"
                }`}
              >
                {/* Animated Shine/Sweep Effect on Hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

                <span className="relative z-20 flex items-center gap-2">
                  View Our Work
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-[#0a0e27] flex items-center justify-center text-white text-xs font-bold">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-[#0a0e27] flex items-center justify-center text-white text-xs font-bold">
                  SK
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 border-2 border-[#0a0e27] flex items-center justify-center text-white text-xs font-bold">
                  MR
                </div>
              </div>
              <div className="flex items-center gap-1">
                <FaStar
                  className={
                    isDarkMode ? "text-yellow-400" : "text-emerald-500"
                  }
                />
                <span className={`${colors.textColor} font-bold`}>4.8</span>
                <span className={`${colors.textMuted} text-sm`}>(150K)</span>
              </div>
            </motion.div>

            {/* Trusted By */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-10"
            >
              <p
                className={`${colors.textColor} text-sm mb-5 text-center sm:text-left font-bold`}
              >
                Trusted by top companies
              </p>

              {/* Mobile: 2 columns (NO scroll). Tablet/Desktop: Single line (flex-nowrap) */}
              <div className="grid grid-cols-2 sm:flex sm:flex-nowrap justify-center sm:justify-start items-center gap-6 sm:gap-8 md:gap-10">
                {trustedCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="flex justify-center sm:justify-start w-full sm:w-auto"
                  >
                    <img
                      src={
                        company.nightLogo && isDarkMode
                          ? company.nightLogo
                          : company.logo || company.dayLogo
                      }
                      alt={company.name}
                      className={`
            /* Mobile sizing - INCREASED (No scroll, fits 2 per row) */
            h-12 max-w-[160px]
            
            /* Tablet sizing - INCREASED (Single line) */
            sm:h-14 sm:max-w-[180px]
            
            /* Desktop sizing - KEPT EXACTLY AS ORIGINAL (Perfect single line) */
            md:h-12 md:max-w-[160px]
            lg:h-14 lg:max-w-[180px]

            w-auto
            object-contain
            opacity-90 hover:opacity-100 transition-all duration-300
            
            /* SPECIFIC FIX: Make Campaign night logo 15% bigger to match day logo */
            ${company.name === "Campaign" && isDarkMode ? "scale-[1.15]" : ""}
          `}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative mt-10 lg:mt-0"
          >
            {/* Main Dashboard Card */}
            <div
              className={`relative ${colors.cardBg} border ${colors.borderColor} rounded-2xl p-4 sm:p-6 shadow-2xl ${colors.cardShadow}`}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between mb-6 pb-4 border-b ${colors.borderColor}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className={`${colors.textMuted} text-xs`}>Dashboard</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Blog Traffic Card */}
                <div
                  className={`${colors.innerCardBg} border ${colors.borderColor} rounded-xl p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${colors.textMuted} text-xs`}>
                      Blog Traffic
                    </span>
                    <span
                      className={`${isDarkMode ? "text-green-400" : "text-emerald-600"} text-xs font-bold flex items-center gap-1`}
                    >
                      <FaChartLine size={10} /> +18.5%
                    </span>
                  </div>
                  <div className={`${colors.textColor} text-2xl font-bold`}>
                    125,536
                  </div>
                  <div className={`${colors.textLight} text-xs mt-1`}>
                    Since last week
                  </div>
                </div>

                {/* SEO Analytics Card */}
                <div
                  className={`${colors.innerCardBg} border ${colors.borderColor} rounded-xl p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${colors.textMuted} text-xs`}>
                      SEO Analytics
                    </span>
                    <span
                      className={`${isDarkMode ? "text-green-400" : "text-emerald-600"} text-xs font-bold flex items-center gap-1`}
                    >
                      <FaChartLine size={10} /> +20%
                    </span>
                  </div>
                  <div className="relative w-20 h-20 mx-auto">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={isDarkMode ? "#1e293b" : "#e2e8f0"}
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeDasharray="80, 100"
                      />
                      <defs>
                        <linearGradient id="gradient">
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
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`${colors.textColor} font-bold text-sm`}>
                        80%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Area - ANIMATED FROM BOTTOM TO TOP */}
              <div
                className={`${colors.innerCardBg} border ${colors.borderColor} rounded-xl p-4 h-32 flex items-end gap-2 overflow-hidden`}
              >
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                  (height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: "0%" }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: i * 0.05,
                        ease: "easeOut",
                      }}
                      className={`flex-1 rounded-t-sm bg-gradient-to-t ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} relative group`}
                    >
                      {/* Hover glow effect */}
                      <div
                        className={`absolute inset-0 rounded-t-sm bg-gradient-to-t ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} opacity-0 group-hover:opacity-60 blur-sm transition-opacity duration-300`}
                      />
                    </motion.div>
                  ),
                )}
              </div>
            </div>

            {/* Floating AI Badge - OPTIMIZED FOR SMOOTH ANIMATION */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute top-3 right-1 md:-top-4 md:-right-4 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27]" : "from-emerald-500 to-cyan-600 text-white"} px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg`}
              style={{ willChange: "transform" }}
            >
              <FaRobot /> AI Integrated
            </motion.div>

            {/* Floating Users Card */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute bottom-1 left-3 md:-bottom-6 md:-left-6 ${colors.cardBg} border ${colors.borderColor} rounded-xl p-4 shadow-xl`}
              style={{
                willChange: "transform",
                transform: "translate3d(0, 0, 0)",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-50"} rounded-full flex items-center justify-center`}
                >
                  <FaUsers
                    className={
                      isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                    }
                  />
                </div>
                <div>
                  <div className={`${colors.textColor} font-bold text-sm`}>
                    200+ Brands
                  </div>
                  <div className={`${colors.textMuted} text-xs`}>
                    Active Partners
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Search Icon */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute top-1/2 left-2 md:-left-8 ${colors.cardBg} border ${colors.borderColor} rounded-xl p-3 shadow-xl`}
            >
              <FaSearch
                className={`${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"} text-xl`}
              />
            </motion.div>

            {/* Floating Email Icon */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute top-28 right-1 md:-right-8 ${colors.cardBg} border ${colors.borderColor} rounded-xl p-3 shadow-xl`}
            >
              <FaEnvelope
                className={`${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"} text-xl`}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
