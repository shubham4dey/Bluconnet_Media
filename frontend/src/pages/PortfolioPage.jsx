import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  FaRocket,
  FaChartLine,
  FaUsers,
  FaArrowRight,
  // FaEnvelope,
  FaLightbulb,
  FaCode,
  FaHandshake,
  FaSearch,
  FaPalette,
  FaCheckCircle,
  FaStar,
  FaPlay,
  FaQuoteLeft,
  FaTrophy,
  FaGlobe,
  FaCog,
  FaQuoteRight,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import SubscribeSection from "../components/SubscribeSection";
// ===== IMPORT IMAGES =====
import sarahImage from "../assets/img/logo.png";
import michaelImage from "../assets/img/logo.png";
import emmaImage from "../assets/img/logo.png";

const PortfolioPage = () => {
  const { isDarkMode } = useTheme();
  const [activeService, setActiveService] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();

  // Scroll effects for 3D parallax
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  const y = useTransform(scrollY, [0, 300], [0, -120]);

  const theme = {
    bg: isDarkMode ? "bg-[#050508]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    muted: isDarkMode ? "text-gray-400" : "text-gray-600",
    gradientText: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",
    gradientBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",
    cardBg: isDarkMode ? "bg-white/5" : "bg-gray-50",
    borderColor: isDarkMode ? "border-white/10" : "border-gray-200",
  };

  // const services = [
  //   {
  //     icon: FaEnvelope,
  //     title: "Email Marketing",
  //     description:
  //       "Creating focused advertising campaigns that increase interaction.",
  //     color: "from-blue-500 to-cyan-400",
  //     stats: "98% Open Rate",
  //   },
  //   {
  //     icon: FaChartLine,
  //     title: "Lead Generation",
  //     description:
  //       "Supplying top-notch leads in the UK to enable companies to grow.",
  //     color: "from-emerald-500 to-teal-400",
  //     stats: "500+ Leads/Month",
  //   },
  //   {
  //     icon: FaLightbulb,
  //     title: "Content Marketing",
  //     description: "Content that attracts, converts, and grows.",
  //     color: "from-yellow-500 to-orange-400",
  //     stats: "10x Engagement",
  //   },
  //   {
  //     icon: FaCode,
  //     title: "HTML & Web App",
  //     description: "Developing user-friendly, scalable web applications.",
  //     color: "from-purple-500 to-pink-400",
  //     stats: "100% Responsive",
  //   },
  //   {
  //     icon: FaHandshake,
  //     title: "Affiliate Marketing",
  //     description: "Insightful affiliate tactics, expansion of UK businesses.",
  //     color: "from-red-500 to-rose-400",
  //     stats: "300% ROI",
  //   },
  //   {
  //     icon: FaSearch,
  //     title: "SEO Marketing",
  //     description: "Helping your company rank higher on search engines.",
  //     color: "from-indigo-500 to-blue-400",
  //     stats: "Top 3 Rankings",
  //   },
  // ];

  const processes = [
    {
      icon: FaSearch,
      title: "Working Process",
      desc: "We follow a clear and structured workflow to ensure every project runs smoothly. From planning to delivery, every step is focused on quality and efficiency.",
    },
    {
      icon: FaCog,
      title: "Project Planning",
      desc: "We analyze your goals, audience, and requirements before starting. A solid strategy ensures the project stays on track and delivers results.",
    },
    {
      icon: FaRocket,
      title: "Content Creation",
      desc: "Our team creates engaging, high-quality content tailored to your brand. Every piece is designed to inform, attract, and convert your audience.",
    },
    {
      icon: FaChartLine,
      title: "Seamless Execution",
      desc: "We bring the plan to life with precision, collaboration, and attention to detail. Timely delivery and consistent quality are ensured at every stage.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      text: "BluConnet transformed our digital presence completely. Their strategic approach delivered exceptional results.",
      rating: 5,
      image: sarahImage,
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      text: "The affiliate marketing campaign exceeded all expectations. Revenue increased by 250% in just 3 months.",
      rating: 5,
      image: michaelImage,
    },
    {
      name: "Emma Williams",
      role: "Founder, EcoBrand",
      text: "Professional, innovative, and results-driven. They truly understand digital marketing excellence.",
      rating: 5,
      image: emmaImage,
    },
  ];

  const offerings = [
    {
      icon: FaLightbulb,
      title: "Strategic Content Planning",
      desc: "Content is at the heart of any successful online strategy. We help you plan and execute a content strategy that resonates with your audience. From blog posts to visual storytelling, we ensure every piece aligns with your brand voice.",
    },
    {
      icon: FaPalette,
      title: "Creative Branding",
      desc: "Your brand identity sets you apart. Our branding experts strengthen your presence by developing compelling visuals, messaging, and design elements that reflect your business value for unforgettable results.",
    },
    {
      icon: FaUsers,
      title: "Social Engagement Strategies",
      desc: "Effective social media is about meaningful engagement. We craft social strategies that build community, spark conversations, and boost visibility, empowering your brand to connect authentically.",
    },
    {
      icon: FaCode,
      title: "Website Development & Optimization",
      desc: "Your website is the first touchpoint for customers. We design responsive, user-friendly websites that reflect your professionalism and convert visitors, ensuring performance stays strong as trends evolve.",
    },
  ];

  const whyChoose = [
    {
      icon: FaStar,
      title: "Personalised Approach",
      desc: "Every business is different. We never use a one-size-fits-all approach, creating customized strategies to meet your specific needs, budget, and growth ambitions.",
    },
    {
      icon: FaChartLine,
      title: "Data Driven Results",
      desc: "We combine creativity with analytics to make informed decisions. We track performance, refine tactics, and adapt strategies to ensure continuous improvement and measurable success.",
    },
    {
      icon: FaHandshake,
      title: "Collaborative Partnership",
      desc: "Collaborating with us means having a partner who listens and works closely with you at every stage. Our portfolio is built on long-term partnerships and shared success.",
    },
  ];

  const caseStudies = [
    "Transformative brand storytelling that increased audience engagement",
    "Website redesigns resulting in higher conversion rates",
    "Strategic content campaigns that boosted organic reach",
    "Social engagement initiatives that strengthened community interaction",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleNext = () =>
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  const handlePrevious = () =>
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );

  return (
    <div
      className={`min-h-screen ${theme.bg} transition-colors duration-500 overflow-x-hidden`}
    >
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-br from-[#0a0e27] via-[#0f172a] to-[#050508]" : "bg-gradient-to-br from-slate-50 via-white to-gray-100"}`}
        />

        {/* Large PORTFOLIO Watermark */}
        <div
          className={`absolute top-[85%] sm:top-[35%] md:top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[70px] sm:text-[100px] md:text-[250px] lg:text-[300px] font-black pointer-events-none select-none z-0 tracking-tighter whitespace-nowrap opacity-[0.03] md:opacity-[0.04] ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          PORTFOLIO
        </div>

        {/* Animated Floating Orbs - EXACTLY LIKE WHO WE ARE */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-96 h-96 rounded-full blur-3xl ${
                i % 2 === 0
                  ? isDarkMode
                    ? "bg-emerald-500/10"
                    : "bg-emerald-300/20"
                  : isDarkMode
                    ? "bg-[#06b6d4]/10"
                    : "bg-cyan-300/20"
              }`}
              animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ left: `${i * 20}%`, top: `${(i % 3) * 30}%` }}
            />
          ))}
        </div>

        {/* ===== ORIGINAL BACKGROUND PATTERN (NO DAY DOTS) ===== */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDarkMode
              ? `linear-gradient(rgba(212, 225, 87, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 225, 87, 0.1) 1px, transparent 1px), radial-gradient(circle, rgba(212, 225, 87, 0.15) 1px, transparent 1px)`
              : `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
            backgroundSize: isDarkMode
              ? "50px 50px, 50px 50px, 50px 50px"
              : "50px 50px, 50px 50px",
          }}
        />

        {/* ===== HERO SCROLL EFFECT ===== */}
        <motion.div
          style={{
            opacity,
            scale,
            y,
            willChange: "transform",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"} backdrop-blur-sm`}
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
              Digital Marketing Portfolio
            </span>
          </div>
          <h1
            className={`text-4xl md:text-7xl lg:text-8xl font-black ${theme.text} mb-6 leading-tight`}
          >
            Elevating Your Brand
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
            >
              With Precision & Creativity
            </span>
          </h1>
          <p
            className={`text-lg md:text-xl ${theme.muted} max-w-3xl mx-auto mb-12`}
          >
            Transforming digital strategies with intelligent automation. We
            craft result-driven campaigns that deliver measurable success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Primary Button: Explore Our Work */}
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r ${theme.gradientText} ${
                isDarkMode ? "text-[#0a0e27]" : "text-white"
              } font-bold rounded-full shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)] transition-all duration-300 overflow-hidden`}
            >
              {/* Animated Shine/Sweep Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

              <span className="relative z-20 flex items-center gap-3">
                Explore Our Work
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.button>

            {/* Secondary Button: Watch Video */}
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                window.open(
                  "https://bluconnetmedia.com/wp-content/uploads/2025/11/Bluconnet-Media-Portfolio-1.mp4",
                  "_blank",
                )
              }
              className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 border ${
                isDarkMode
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-gray-900/20 text-gray-900 hover:bg-gray-900/5"
              } font-bold rounded-full backdrop-blur-sm transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl`}
            >
              {/* Subtle Shine Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

              <span className="relative z-20 flex items-center gap-3">
                <FaPlay className="group-hover:scale-110 transition-transform duration-300" />
                Watch Video
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div
            className={`w-6 h-10 rounded-full border-2 ${isDarkMode ? "border-white/30" : "border-gray-900/30"} flex items-start justify-center p-2`}
          >
            <div
              className={`w-1 h-3 rounded-full ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} animate-bounce`}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className={`py-20 relative overflow-hidden ${theme.bg}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: FaRocket,
                value: "500+",
                label: "Projects Completed",
                subLabel: "Delivered with excellence",
                color: "from-[#d4e157] to-[#06b6d4]",
                dayColor: "from-emerald-500 to-cyan-600",
                trend: "+24% this year",
              },
              {
                icon: FaChartLine,
                value: "98%",
                label: "Client Satisfaction",
                subLabel: "Based on 200+ reviews",
                color: "from-[#06b6d4] to-[#d4e157]",
                dayColor: "from-cyan-600 to-emerald-500",
                trend: "Top 1% Agency",
              },
              {
                icon: FaUsers,
                value: "1000+",
                label: "Happy Clients",
                subLabel: "Across 150+ countries",
                color: "from-[#d4e157] to-[#06b6d4]",
                dayColor: "from-emerald-500 to-cyan-600",
                trend: "Growing rapidly",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-3xl opacity-20 group-hover:opacity-60 blur-sm transition-all duration-500`}
                />
                <div
                  className={`relative h-full p-8 rounded-3xl ${theme.cardBg} backdrop-blur-xl border ${theme.borderColor} overflow-hidden`}
                >
                  <stat.icon
                    className={`absolute -bottom-4 -right-4 text-9xl opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-white" : "text-black"}`}
                  />
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isDarkMode ? stat.color : stat.dayColor} flex items-center justify-center shadow-lg group-hover:shadow-[#d4e157]/30 transition-shadow duration-500`}
                    >
                      <stat.icon className="text-3xl text-[#0a0e27]" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isDarkMode ? "bg-white/10 text-[#d4e157]" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      <FaChartLine className="text-[10px]" /> {stat.trend}
                    </span>
                  </div>
                  <motion.div
                    className={`text-6xl lg:text-7xl font-black tracking-tighter mb-2 transition-colors duration-500 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] bg-clip-text text-transparent group-hover:text-white group-hover:bg-none" : "text-emerald-500"}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-center">
                    <h3 className={`text-xl font-bold ${theme.text} mb-1`}>
                      {stat.label}
                    </h3>
                    <p
                      className={`text-sm ${theme.muted} flex items-center justify-center gap-2`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${isDarkMode ? stat.color : stat.dayColor}`}
                      />{" "}
                      {stat.subLabel}
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO CONTENT SECTION ===== */}
      <section className={`py-24 relative overflow-hidden ${theme.bg}`}>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r ${isDarkMode ? "from-[#d4e157]/10 to-[#06b6d4]/10" : "from-emerald-500/10 to-cyan-600/10"} rounded-full blur-[120px] pointer-events-none`}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-24 text-center md:text-left"
          >
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"}`}
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
                What We Do
              </span>
            </div>
            <h2
              className={`font-black leading-tight mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
            >
              Bluconnet Media Services
              <br />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
              >
                Elevating Your Brand with Precision & Creativity
              </span>
            </h2>
            <p
              className={`text-base md:text-xl max-w-3xl leading-relaxed text-center lg:text-start ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              At Bluconnet Media Services, we believe every brand has a unique
              story that deserves to be told with clarity, creativity, and
              impact. Our digital marketing portfolio showcases a comprehensive
              suite of solutions designed to help businesses grow, engage
              audiences, and maximize online presence through strategic,
              result-driven implementation.
            </p>
          </motion.div>

          {/* WHAT MAKES US STAND OUT */}
          <div className="grid lg:grid-cols-12 gap-12 mb-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <h3
                className={`text-3xl md:text-4xl font-bold ${theme.text} mb-6 text-center md:text-start`}
              >
                What Makes Our Portfolio{" "}
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
                >
                  Stand Out
                </span>
              </h3>
              <p
                className={`text-base md:text-xl max-w-3xl leading-relaxed text-center lg:text-start mb-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                When you choose Bluconnet Media Services, you're gaining a
                strategic partner with a proven track record. We take the time
                to understand your business goals, target audience, and
                competitive landscape. This enables us to craft tailored
                solutions that deliver real, measurable results.
              </p>
              <div className="space-y-4 flex flex-col items-center md:items-start">
                {[
                  "Innovation-driven solutions",
                  "Transparent processes",
                  "Accountable results",
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-center gap-4 group w-full justify-start"
                  >
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.gradientText} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <FaCheckCircle className="text-[#0a0e27] text-sm" />
                    </div>
                    <span
                      className={`text-lg font-semibold ${theme.text} group-hover:translate-x-1 transition-transform`}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div
                className={`relative p-8 rounded-3xl ${theme.cardBg} border ${theme.borderColor} backdrop-blur-xl`}
              >
                <div
                  className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${theme.gradientText} rounded-2xl opacity-20 blur-xl`}
                />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: FaRocket, value: "500+", label: "Projects" },
                    { icon: FaChartLine, value: "98%", label: "Satisfaction" },
                    { icon: FaUsers, value: "1000+", label: "Clients" },
                    { icon: FaGlobe, value: "150+", label: "Countries" },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl ${isDarkMode ? "bg-white/5" : "bg-white"} border ${theme.borderColor} text-center hover:border-[#d4e157]/50 transition-colors`}
                    >
                      <div
                        className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${theme.gradientText} flex items-center justify-center`}
                      >
                        <stat.icon className="text-xl text-[#0a0e27]" />
                      </div>
                      <div className={`text-2xl font-black ${theme.text} mb-1`}>
                        {stat.value}
                      </div>
                      <div
                        className={`text-xs font-medium ${theme.muted} uppercase tracking-wide`}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* CORE OFFERINGS */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-start mb-12"
            >
              <h3
                className={`text-3xl md:text-5xl font-black ${theme.text} mb-4`}
              >
                Our Core{" "}
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
                >
                  Offerings
                </span>
              </h3>
              <p
                className={`text-base md:text-xl max-w-3xl leading-relaxed text-center lg:text-start mb-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Strategic solutions designed to elevate your brand and drive
                measurable growth.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {offerings.map((offering, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${theme.gradientText} rounded-3xl opacity-0 group-hover:opacity-30 blur transition-all duration-500`}
                  />
                  <div
                    className={`relative h-full p-8 rounded-3xl ${theme.cardBg} border ${theme.borderColor} backdrop-blur-xl overflow-hidden text-center md:text-start`}
                  >
                    <offering.icon
                      className={`absolute -bottom-6 -right-6 text-9xl opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700 ${isDarkMode ? "text-white" : "text-black"}`}
                    />
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradientText} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-[#d4e157]/30 transition-all duration-300 mx-auto md:mx-0`}
                    >
                      <offering.icon className="text-2xl text-[#0a0e27]" />
                    </div>
                    <h4 className={`text-2xl font-bold ${theme.text} mb-3`}>
                      {offering.title}
                    </h4>
                    <p className={`${theme.muted} leading-relaxed`}>
                      {offering.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* WHY CHOOSE US */}
          <div className="mb-24">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`text-3xl md:text-5xl font-black ${theme.text} text-center md:text-start mb-12`}
            >
              Why Clients Choose{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
              >
                Bluconnet Media
              </span>
            </motion.h3>
            <div className="grid md:grid-cols-3 gap-8">
              {whyChoose.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative p-8 rounded-3xl ${theme.cardBg} border ${theme.borderColor} backdrop-blur-xl group hover:border-[#d4e157]/40 transition-all duration-500 text-center md:text-start`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${theme.gradientText} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 mx-auto md:mx-0`}
                  >
                    <feature.icon className="text-2xl text-[#0a0e27]" />
                  </div>
                  <h4 className={`text-xl font-bold ${theme.text} mb-3`}>
                    {feature.title}
                  </h4>
                  <p className={`${theme.muted} leading-relaxed`}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CASE STUDY HIGHLIGHTS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative p-8 md:p-12 rounded-[2.5rem] overflow-hidden border ${isDarkMode ? "bg-[#0f172a]/80 border-white/10" : "bg-white border-gray-200 shadow-2xl"}`}
          >
            <div
              className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${theme.gradientText} opacity-10 rounded-full blur-3xl pointer-events-none`}
            />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-start">
                <h3
                  className={`text-3xl md:text-4xl font-black ${theme.text} mb-6`}
                >
                  Explore Our{" "}
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
                  >
                    Success Stories
                  </span>
                </h3>
                <p
                  className={`text-base md:text-xl max-w-3xl leading-relaxed text-center lg:text-start mb-8 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  From start-ups finding their voices to established brands
                  scaling new heights, our work highlights creativity, strategic
                  thinking, and real business impact.
                </p>
                <div className="space-y-4 flex flex-col items-start">
                  {caseStudies.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex items-start gap-4 w-full md:w-auto justify-center md:justify-start"
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-gradient-to-r ${theme.gradientText} flex items-center justify-center flex-shrink-0 mt-1`}
                      >
                        <FaCheckCircle className="text-[10px] text-[#0a0e27]" />
                      </div>
                      <span
                        className={`${theme.text} font-medium leading-relaxed text-start`}
                      >
                        {highlight}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div
                className={`relative p-8 rounded-3xl ${isDarkMode ? "bg-white/5" : "bg-gray-50"} border ${theme.borderColor} text-center md:text-start`}
              >
                <FaQuoteLeft
                  className={`text-5xl mb-4 bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent opacity-50 mx-auto md:mx-0`}
                />
                <p
                  className={`text-xl font-medium ${theme.text} italic leading-relaxed mb-6`}
                >
                  "Each project reflects the commitment and expertise of
                  Bluconnet Media Services - a tailored solution that drives
                  results and inspires trust."
                </p>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.gradientText} flex items-center justify-center`}
                  >
                    <FaTrophy className="text-[#0a0e27] text-sm" />
                  </div>
                  <div>
                    <div className={`font-bold ${theme.text}`}>
                      Proven Excellence
                    </div>
                    <div className={`text-sm ${theme.muted}`}>
                      Driven by measurable impact
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== WORKING PROCESS SECTION ===== */}
      <section className={`py-24 relative overflow-hidden ${theme.bg}`}>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="mb-8 text-center lg:text-left">
                <div className="inline-flex items-center justify-center lg:justify-start mb-6">
                  <div
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"}`}
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
                      Working Process
                    </span>
                  </div>
                </div>

                <h2
                  className={`font-black leading-tight mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
                >
                  Shaping the Future Through{" "}
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
                  >
                    Step-by-Step Innovation
                  </span>
                </h2>
              </div>

              <div className="relative h-80 md:h-[420px] flex items-center justify-center lg:justify-start">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 flex flex-col justify-between py-8">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-full h-px ${isDarkMode ? "bg-white/5" : "bg-gray-200/50"}`}
                      />
                    ))}
                  </div>

                  <div className="relative flex items-end justify-between gap-3 h-64 md:h-80 px-4">
                    {[
                      { height: "40%", delay: 0 },
                      { height: "55%", delay: 0.1 },
                      { height: "45%", delay: 0.2 },
                      { height: "70%", delay: 0.3 },
                      { height: "65%", delay: 0.4 },
                      { height: "85%", delay: 0.5 },
                      { height: "95%", delay: 0.6 },
                    ].map((bar, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        whileInView={{ height: bar.height }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: bar.delay,
                          ease: "easeOut",
                        }}
                        className={`flex-1 rounded-t-lg bg-gradient-to-t ${theme.gradientText} relative group`}
                      >
                        <div
                          className={`absolute inset-0 rounded-t-lg bg-gradient-to-t ${theme.gradientText} opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300`}
                        />
                        <div
                          className={`absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r ${theme.gradientText}`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <motion.path
                      d="M 10 60 Q 25 55 35 50 T 55 35 T 75 20 T 90 10"
                      fill="none"
                      stroke={isDarkMode ? "#d4e157" : "#10b981"}
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </svg>

                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.5 }}
                    className={`absolute top-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r ${theme.gradientText} flex items-center justify-center shadow-lg`}
                  >
                    <svg
                      className="w-6 h-6 text-[#0a0e27]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.8 }}
                    className={`absolute top-4 left-4 px-3 py-2 rounded-lg ${isDarkMode ? "bg-[#d4e157]/10 border border-[#d4e157]/30" : "bg-emerald-500/10 border border-emerald-500/30"}`}
                  >
                    <div
                      className={`text-xs font-bold ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                    >
                      +247% Growth
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {processes.map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    activeService === index
                      ? isDarkMode
                        ? "bg-[#d4e157]/10 border-[#d4e157]/50"
                        : "bg-emerald-500/10 border-emerald-500/50"
                      : `${theme.cardBg} ${theme.borderColor} hover:border-[#d4e157]/30`
                  }`}
                  onClick={() => setActiveService(index)}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className={`flex-shrink-0 w-12 h-28 rounded-xl flex items-center justify-center transition-all duration-500 ${activeService === index ? `bg-gradient-to-br ${theme.gradientText}` : isDarkMode ? "bg-white/5" : "bg-gray-100"}`}
                    >
                      <span
                        className={`text-xs font-bold ${activeService === index ? "text-[#0a0e27]" : theme.muted}`}
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                        }}
                      >
                        Step 0{index + 1}
                      </span>
                    </div>

                    <div className="flex-1 pt-2 text-center lg:text-left">
                      <h3
                        className={`text-xl font-bold mb-2 transition-colors duration-500 ${activeService === index ? `text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}` : theme.text}`}
                      >
                        {process.title}
                      </h3>
                      <p className={`${theme.muted} text-sm leading-relaxed`}>
                        {process.desc}
                      </p>
                    </div>

                    <div
                      className={`flex-shrink-0 w-3 h-3 rounded-full transition-all duration-500 mt-4 ${activeService === index ? `bg-gradient-to-r ${theme.gradientText} scale-125` : isDarkMode ? "bg-white/20" : "bg-gray-300"}`}
                    />
                  </div>

                  {index < processes.length - 1 && (
                    <div
                      className={`absolute left-20 bottom-0 w-[calc(100%-5rem)] h-px ${activeService === index ? `bg-gradient-to-r ${theme.gradientText} opacity-50` : `${isDarkMode ? "bg-white/5" : "bg-gray-200"}`}
                    }`}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          [style*="writing-mode: vertical-rl"] {
            writing-mode: vertical-rl;
          }
        `}</style>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className={`py-24 relative overflow-hidden ${theme.bg}`}>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative w-full">
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
                <div
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"}`}
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
                    Our Testimonials
                  </span>
                </div>
              </div>

              <h2
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-center lg:text-start`}
              >
                <span className={theme.text}>What They're Talking</span>
                <br />
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
                >
                  About Company?
                </span>
              </h2>

              <p
                className={`text-base md:text-xl max-w-3xl mx-auto mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                Our clients' success stories speak louder than words. Here's
                what they have to say about working with Bluconnet Media
                Services.
              </p>

              <div className="flex items-center gap-3 mb-12 justify-center lg:justify-start">
                <button
                  onClick={() => handlePrevious()}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isDarkMode ? "border-white/20 text-white hover:bg-[#d4e157] hover:text-[#0a0e27] hover:border-[#d4e157]" : "border-gray-300 text-gray-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleNext()}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isDarkMode ? "border-white/20 text-white hover:bg-[#d4e157] hover:text-[#0a0e27] hover:border-[#d4e157]" : "border-gray-300 text-gray-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative h-48 mt-8">
                {testimonials.map((testimonial, index) => {
                  let position;
                  const totalTestimonials = testimonials.length;
                  let offset =
                    (index - activeTestimonial + totalTestimonials) %
                    totalTestimonials;

                  if (offset === 0) {
                    position = {
                      left: "35%",
                      top: "35%",
                      scale: 1.2,
                      zIndex: 30,
                      hasBorder: true,
                      opacity: 1,
                    };
                  } else if (offset === 1 || offset === -2) {
                    position = {
                      left: "70%",
                      top: "70%",
                      scale: 0.9,
                      zIndex: 20,
                      hasBorder: false,
                      opacity: 0.7,
                    };
                  } else {
                    position = {
                      left: "0%",
                      top: "0%",
                      scale: 0.9,
                      zIndex: 10,
                      hasBorder: false,
                      opacity: 0.7,
                    };
                  }

                  const colors = [
                    "border-[#d4e157]",
                    "border-[#06b6d4]",
                    "border-orange-500",
                  ];

                  return (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{
                        left: position.left,
                        top: position.top,
                        scale: position.scale,
                        opacity: position.opacity,
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 ${position.hasBorder ? colors[index % colors.length] : "border-transparent"} transition-all duration-500 cursor-pointer shadow-lg`}
                      style={{ zIndex: position.zIndex }}
                      onClick={() => setActiveTestimonial(index)}
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div
                className={`relative rounded-3xl overflow-hidden ${isDarkMode ? "bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]" : "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"} p-8 md:p-12 min-h-[600px]`}
              >
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: isDarkMode
                      ? "radial-gradient(circle at 20% 50%, rgba(212, 225, 87, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)"
                      : "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)",
                    backgroundSize: "200% 200%",
                  }}
                />

                <motion.div
                  animate={{ rotate: 360, y: [0, -20, 0] }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={`absolute top-20 right-20 w-16 h-16 ${isDarkMode ? "border-2 border-[#d4e157]/20" : "border-2 border-emerald-500/20"} rotate-45`}
                />
                <motion.div
                  animate={{ rotate: -360, y: [0, 30, 0] }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className={`absolute bottom-32 left-16 w-12 h-12 ${isDarkMode ? "border-2 border-[#06b6d4]/20" : "border-2 border-cyan-500/20"} rounded-full`}
                />
                <motion.div
                  animate={{ rotate: 180, scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute top-1/2 left-10 w-8 h-8 ${isDarkMode ? "bg-orange-500/10" : "bg-orange-500/10"} rotate-45`}
                />

                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        x: [0, Math.random() * 100 - 50],
                        y: [0, Math.random() * 100 - 50],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 6 + i * 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut",
                      }}
                      className={`absolute w-1 h-1 rounded-full ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-400"}`}
                      style={{
                        left: `${10 + i * 12}%`,
                        top: `${15 + i * 10}%`,
                      }}
                    />
                  ))}
                </div>

                <div
                  className="absolute inset-0 opacity-[0.02]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />

                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-3xl p-px"
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(90deg, rgba(212, 225, 87, 0.2), rgba(6, 182, 212, 0.2), rgba(249, 115, 22, 0.2), rgba(212, 225, 87, 0.2))"
                      : "linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2), rgba(249, 115, 22, 0.2), rgba(16, 185, 129, 0.2))",
                    backgroundSize: "300% 100%",
                  }}
                />

                <div
                  className={`absolute top-0 left-0 w-20 h-20 ${isDarkMode ? "border-t-2 border-l-2 border-[#d4e157]/30" : "border-t-2 border-l-2 border-emerald-500/30"} rounded-tl-3xl`}
                />
                <div
                  className={`absolute top-0 right-0 w-20 h-20 ${isDarkMode ? "border-t-2 border-r-2 border-[#06b6d4]/30" : "border-t-2 border-r-2 border-cyan-500/30"} rounded-tr-3xl`}
                />
                <div
                  className={`absolute bottom-0 left-0 w-20 h-20 ${isDarkMode ? "border-b-2 border-l-2 border-orange-500/30" : "border-b-2 border-l-2 border-orange-500/30"} rounded-bl-3xl`}
                />
                <div
                  className={`absolute bottom-0 right-0 w-20 h-20 ${isDarkMode ? "border-b-2 border-r-2 border-purple-500/30" : "border-b-2 border-r-2 border-purple-500/30"} rounded-br-3xl`}
                />

                <div className="relative z-10 space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`card1-${activeTestimonial}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className={`relative p-6 rounded-2xl ${isDarkMode ? "bg-[#1a1f2e]/90 backdrop-blur-md border border-white/10" : "bg-white/95 backdrop-blur-md"} shadow-2xl`}
                    >
                      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-4 ${activeTestimonial === 0 ? (isDarkMode ? "border-[#d4e157]" : "border-emerald-500") : activeTestimonial === 1 ? "border-[#06b6d4]" : "border-orange-500"}`}
                        >
                          <img
                            src={testimonials[activeTestimonial].image}
                            alt={testimonials[activeTestimonial].name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 text-center lg:text-start w-full">
                          <div className="flex gap-1 mb-3 justify-center lg:justify-start">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${i < testimonials[activeTestimonial].rating ? (isDarkMode ? "text-[#d4e157]" : "text-emerald-500") : "text-gray-300"}`}
                              />
                            ))}
                          </div>

                          <p
                            className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm leading-relaxed mb-3 italic`}
                          >
                            "{testimonials[activeTestimonial].text}"
                          </p>

                          <div>
                            <h4
                              className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {testimonials[activeTestimonial].name}
                            </h4>
                            <p
                              className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                            >
                              {testimonials[activeTestimonial].role}
                            </p>
                          </div>
                        </div>

                        <FaQuoteRight
                          className={`text-4xl flex-shrink-0 hidden lg:block ${isDarkMode ? "text-white/10" : "text-gray-200"}`}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      key={`card2-${(activeTestimonial + 1) % testimonials.length}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1,
                        ease: "easeInOut",
                      }}
                      className={`relative p-6 rounded-2xl ${isDarkMode ? "bg-[#1a1f2e]/90 backdrop-blur-md border border-white/10" : "bg-white/95 backdrop-blur-md"} shadow-2xl`}
                    >
                      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-4 ${(activeTestimonial + 1) % testimonials.length === 0 ? (isDarkMode ? "border-[#d4e157]" : "border-emerald-500") : (activeTestimonial + 1) % testimonials.length === 1 ? "border-[#06b6d4]" : "border-orange-500"}`}
                        >
                          <img
                            src={
                              testimonials[
                                (activeTestimonial + 1) % testimonials.length
                              ].image
                            }
                            alt={
                              testimonials[
                                (activeTestimonial + 1) % testimonials.length
                              ].name
                            }
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 text-center lg:text-start w-full">
                          <div className="flex gap-1 mb-3 justify-center lg:justify-start">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-sm ${i < testimonials[(activeTestimonial + 1) % testimonials.length].rating ? (isDarkMode ? "text-[#d4e157]" : "text-emerald-500") : "text-gray-300"}`}
                              />
                            ))}
                          </div>

                          <p
                            className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm leading-relaxed mb-3 italic`}
                          >
                            "
                            {
                              testimonials[
                                (activeTestimonial + 1) % testimonials.length
                              ].text
                            }
                            "
                          </p>

                          <div>
                            <h4
                              className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {
                                testimonials[
                                  (activeTestimonial + 1) % testimonials.length
                                ].name
                              }
                            </h4>
                            <p
                              className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                            >
                              {
                                testimonials[
                                  (activeTestimonial + 1) % testimonials.length
                                ].role
                              }
                            </p>
                          </div>
                        </div>

                        <FaQuoteRight
                          className={`text-4xl flex-shrink-0 hidden lg:block ${isDarkMode ? "text-white/10" : "text-gray-200"}`}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SubscribeSection />
    </div>
  );
};

export default PortfolioPage;
