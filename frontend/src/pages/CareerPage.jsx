import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";

import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft,
  FaPhoneAlt,
  FaFire,
  FaUsers,
  FaRocket,
  FaGlobe,
  FaAward,
  FaUserTie,
  FaFileAlt,
  FaComments,
  FaHandshake,
  FaTrophy,
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import SubscribeSection from "../components/SubscribeSection";

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

const CareerPage = () => {
  const { isDarkMode } = useTheme();
  const [expandedJob, setExpandedJob] = useState(null);
  const [filter, setFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const navigate = useNavigate();

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

  const openPositions = [
    {
      title: "SEO Specialist",
      department: "SEO",
      country: "India",
      flag: "🇮🇳",
      location: "Kolkata",
      workMode: "Work From Office (WFO)",
      experience: "1–3 Years",
      type: "Full Time",
      urgent: true,
      responsibilities: [
        "Develop and execute comprehensive SEO strategies",
        "Conduct keyword research and competitive analysis",
        "Optimize on-page and technical SEO elements",
        "Monitor and report on SEO performance metrics",
      ],
      skills: [
        "Google Search Console",
        "GA4",
        "SEO Tools",
        "Content Optimization",
      ],
    },
    {
      title: "Social Media Manager",
      department: "Social Media",
      country: "India",
      flag: "🇮🇳",
      location: "Kolkata",
      workMode: "Work From Office (WFO)",
      experience: "2–4 Years",
      type: "Full Time",
      urgent: false,
      responsibilities: [
        "Manage social media accounts across platforms",
        "Create engaging content strategies",
        "Analyze social media metrics and insights",
        "Build and engage with online communities",
      ],
      skills: [
        "Social Media Strategy",
        "Content Creation",
        "Analytics",
        "Community Management",
      ],
    },
    {
      title: "Content Writer",
      department: "Content & Creative",
      country: "UK",
      flag: "🇬🇧",
      location: "Remote",
      workMode: "Remote",
      experience: "1–2 Years",
      type: "Full Time",
      urgent: false,
      responsibilities: [
        "Write compelling blog posts and articles",
        "Create SEO-optimized content",
        "Develop content for social media and email",
        "Edit and proofread content for quality",
      ],
      skills: ["SEO Writing", "Research", "Editing", "Content Strategy"],
    },
    {
      title: "Frontend Developer",
      department: "Web & Technology",
      country: "India",
      flag: "🇮🇳",
      location: "Kolkata",
      workMode: "Work From Office (WFO)",
      experience: "2–5 Years",
      type: "Full Time",
      urgent: true,
      responsibilities: [
        "Develop responsive web applications",
        "Implement modern UI/UX designs",
        "Optimize applications for performance",
        "Collaborate with design and backend teams",
      ],
      skills: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    },
    {
      title: "Backend Developer",
      department: "Web & Technology",
      country: "US",
      flag: "🇺🇸",
      location: "Remote",
      workMode: "Remote",
      experience: "2–5 Years",
      type: "Full Time",
      urgent: false,
      responsibilities: [
        "Design and implement scalable server-side logic and APIs",
        "Manage database interactions and optimize complex queries",
        "Ensure high performance, security, and responsiveness to requests",
        "Collaborate with frontend developers to integrate user-facing elements",
      ],
      skills: ["Node.js", "Express.js", "MongoDB / PostgreSQL", "RESTful APIs"],
    },
    {
      title: "PPC Specialist",
      department: "Performance Marketing",
      country: "UK",
      flag: "🇬🇧",
      location: "Remote",
      workMode: "Remote",
      experience: "1–3 Years",
      type: "Full Time",
      urgent: false,
      responsibilities: [
        "Manage Google Ads and Meta Ads campaigns",
        "Optimize ad spend and ROI",
        "Conduct A/B testing for ad creatives",
        "Analyze campaign performance and insights",
      ],
      skills: [
        "Google Ads",
        "Meta Ads",
        "Analytics",
        "Conversion Optimization",
      ],
    },
    {
      title: "Affiliate Manager",
      department: "Affiliate Marketing",
      country: "US",
      flag: "🇺🇸",
      location: "Remote",
      workMode: "Remote",
      experience: "2–4 Years",
      type: "Full Time",
      urgent: false,
      responsibilities: [
        "Recruit and manage affiliate partners",
        "Develop affiliate marketing strategies",
        "Track and optimize affiliate performance",
        "Build strong partner relationships",
      ],
      skills: [
        "Affiliate Networks",
        "Partnership Management",
        "Analytics",
        "Negotiation",
      ],
    },
  ];

  const process = [
    {
      step: "01",
      title: "Apply Online",
      desc: "Submit your CV and fill out the application form for your desired role.",
      icon: FaFileAlt,
    },
    {
      step: "02",
      title: "Screening Call",
      desc: "A quick 15-minute intro call to understand your background and goals.",
      icon: FaPhoneAlt,
    },
    {
      step: "03",
      title: "Skill Assessment",
      desc: "Role-specific task or work sample to showcase your expertise.",
      icon: FaCheckCircle,
    },
    {
      step: "04",
      title: "Team Interview",
      desc: "Meet your future colleagues and managers for a cultural fit discussion.",
      icon: FaComments,
    },
    {
      step: "05",
      title: "Offer & Join",
      desc: "Receive your offer letter and start your exciting journey with us!",
      icon: FaHandshake,
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "SEO Specialist",
      text: "I got the opportunity to take ownership of real projects from the beginning and continuously develop my skills.",
      rating: 5,
      initials: "PS",
    },
    {
      name: "Rahul Verma",
      role: "Frontend Developer",
      text: "The collaborative culture and learning opportunities here are amazing. I've grown more in 1 year than I did in 3 years before.",
      rating: 5,
      initials: "RV",
    },
    {
      name: "Anjali Das",
      role: "Content Writer",
      text: "Working with diverse clients and having creative freedom makes every day exciting. The team is incredibly supportive.",
      rating: 5,
      initials: "AD",
    },
  ];

  const filteredJobs = openPositions.filter((job) => {
    const matchesDepartment = filter === "All" || job.department === filter;
    const matchesCountry =
      countryFilter === "All" || job.country === countryFilter;
    return matchesDepartment && matchesCountry;
  });

  const jobFilters = [
    "All",
    ...new Set(openPositions.map((job) => job.department)),
  ];

  const countryFilters = [
    { name: "All", label: "All", flag: "" },
    { name: "India", label: "India", flag: "🇮🇳" },
    { name: "UK", label: "UK", flag: "🇬🇧" },
    { name: "US", label: "US", flag: "🇺🇸" },
  ];

  // Display logic: India jobs show "Kolkata | Work From Office (WFO)", UK/US jobs show "Remote"
  const getLocationDisplay = (job) =>
    job.workMode === "Remote" ? "Remote" : `${job.location} | ${job.workMode}`;

  // Human-readable hiring region label
  const getHiringRegion = (job) => {
    const regions = {
      India: "India (APAC)",
      UK: "United Kingdom (EMEA)",
      US: "United States (AMER)",
    };
    return regions[job.country] || job.country;
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      SEO: "from-emerald-500 to-teal-400",
      "Social Media": "from-purple-500 to-pink-400",
      "Content & Creative": "from-orange-500 to-red-400",
      "Web & Technology": "from-indigo-500 to-blue-400",
      "Performance Marketing": "from-blue-500 to-cyan-400",
      "Affiliate Marketing": "from-red-500 to-rose-400",
    };
    return colors[dept] || "from-gray-500 to-gray-400";
  };

  return (
    <div
      className={`min-h-screen ${theme.bg} transition-colors duration-500 overflow-x-hidden`}
    >
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-br from-[#0a0e27] via-[#0f172a] to-[#050508]" : "bg-gradient-to-br from-slate-50 via-white to-gray-100"}`}
        />

        {/* Large CAREERS Watermark */}
        <div
          className={`absolute top-[85%] sm:top-[35%] md:top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[70px] sm:text-[100px] md:text-[250px] lg:text-[300px] font-black pointer-events-none select-none z-0 tracking-tighter whitespace-nowrap opacity-[0.03] md:opacity-[0.04] ${isDarkMode ? "text-white" : "text-black"}`}
        >
          CAREERS
        </div>

        {/* Animated Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-96 h-96 rounded-full blur-3xl ${i % 2 === 0 ? (isDarkMode ? "bg-emerald-500/10" : "bg-emerald-300/20") : isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-300/20"}`}
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

        {/* Background Pattern with Night Dots */}
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

        {/* Floating Badge - UNIQUE */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
          className={`absolute top-32 right-10 md:right-20 hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? "bg-[#d4e157]/10 border border-[#d4e157]/30" : "bg-emerald-50 border border-emerald-200"} backdrop-blur-sm`}
        >
          <FaFire className="text-orange-500 animate-pulse" />
          <span
            className={`text-xs font-bold ${isDarkMode ? "text-[#d4e157]" : "text-emerald-700"}`}
          >
            6 Open Positions
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, type: "spring" }}
          className={`absolute bottom-32 left-10 md:left-20 hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? "bg-[#06b6d4]/10 border border-[#06b6d4]/30" : "bg-cyan-50 border border-cyan-200"} backdrop-blur-sm`}
        >
          <FaGlobe className="text-cyan-500" />
          <span
            className={`text-xs font-bold ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-700"}`}
          >
            Remote Friendly
          </span>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity, scale, y, willChange: "transform" }}
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
              Join Our Team
            </span>
          </div>

          <h1
            className={`text-4xl md:text-7xl lg:text-8xl font-black ${theme.text} mb-6 leading-tight`}
          >
            Build Your Career.
            <br />
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
            >
              Create Real Impact.
            </span>
          </h1>

          <p
            className={`text-lg md:text-xl ${theme.muted} max-w-3xl mx-auto mb-12`}
          >
            Join a performance-driven digital marketing team where creativity,
            technology and data come together to build brands and drive
            measurable growth.
          </p>

          {/* ===== PREMIUM BUTTONS SET 1 ===== */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                document
                  .getElementById("open-positions")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r ${theme.gradientText} ${isDarkMode ? "text-[#0a0e27]" : "text-white"} font-bold rounded-full shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)] transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
              <span className="relative z-20 flex items-center gap-3">
                View Open Positions
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contact")}
              className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 border ${isDarkMode ? "border-white/20 text-white hover:bg-white/10" : "border-gray-900/20 text-gray-900 hover:bg-gray-900/5"} font-bold rounded-full backdrop-blur-sm transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl`}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
              <span className="relative z-20 flex items-center gap-3">
                Send Your Resume
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

      {/* ===== QUICK STATS STRIP - UNIQUE ===== */}
      <section
        className={`py-12 relative ${isDarkMode ? "bg-[#0a0e27]" : "bg-gradient-to-r from-emerald-50 via-cyan-50 to-emerald-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: FaUsers,
                number: 50,
                suffix: "+",
                label: "Team Members",
                color: "from-emerald-500 to-teal-400",
              },
              {
                icon: FaRocket,
                number: 8,
                suffix: "",
                label: "Departments",
                color: "from-blue-500 to-cyan-400",
              },
              {
                icon: FaGlobe,
                number: 150,
                suffix: "+",
                label: "Countries",
                color: "from-purple-500 to-pink-400",
              },
              {
                icon: FaAward,
                number: 4,
                suffix: ".8",
                label: "Employee Rating",
                color: "from-orange-500 to-red-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className={`relative p-6 rounded-2xl ${theme.cardBg} border ${theme.borderColor} backdrop-blur-xl text-center group cursor-pointer overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="text-xl text-[#0a0e27]" />
                </div>
                <div
                  className={`text-3xl md:text-4xl font-black ${theme.text} mb-1`}
                >
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className={`text-sm ${theme.muted} font-medium`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPEN POSITIONS ===== */}
      <section
        id="open-positions"
        className={`py-24 relative overflow-hidden ${theme.bg}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"}`}
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
                We're Hiring
              </span>
            </div>
            <h2
              className={`text-3xl md:text-5xl font-black ${theme.text} mb-4`}
            >
              Current{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
              >
                Open Positions
              </span>
            </h2>
            <p
              className={`text-sm md:text-base ${theme.muted} max-w-2xl mx-auto`}
            >
              We're hiring across multiple countries — 🇮🇳 India (Kolkata, WFO)
              and 🇬🇧 UK / 🇺🇸 US (Remote). Use the filters below to find your
              perfect role.
            </p>

            {/* Country Filter Buttons with Flags & Counts */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {countryFilters.map((countryItem) => {
                const count =
                  countryItem.name === "All"
                    ? openPositions.length
                    : openPositions.filter(
                        (job) => job.country === countryItem.name,
                      ).length;
                return (
                  <motion.button
                    key={countryItem.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCountryFilter(countryItem.name)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${countryFilter === countryItem.name ? `bg-gradient-to-r ${theme.gradientText} ${isDarkMode ? "text-[#0a0e27]" : "text-white"} shadow-lg` : `${theme.cardBg} ${theme.borderColor} border ${theme.muted} hover:border-[#d4e157]/50 hover:shadow-md`}`}
                  >
                    {countryItem.flag && (
                      <span className="text-base leading-none">
                        {countryItem.flag}
                      </span>
                    )}
                    {countryItem.label}
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${countryFilter === countryItem.name ? (isDarkMode ? "bg-[#0a0e27]/20 text-[#0a0e27]" : "bg-white/30 text-white") : isDarkMode ? "bg-[#d4e157]/15 text-[#d4e157]" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Department Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {jobFilters.map((filterItem) => (
                <motion.button
                  key={filterItem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(filterItem)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${filter === filterItem ? `bg-gradient-to-r ${theme.gradientText} text-[#0a0e27]` : `${theme.cardBg} ${theme.borderColor} border ${theme.muted} hover:border-[#d4e157]/50`}`}
                >
                  {filterItem}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border ${theme.borderColor} ${theme.cardBg} overflow-hidden transition-all duration-500 group hover:shadow-2xl`}
              >
                {/* Department Color Bar - UNIQUE */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getDepartmentColor(job.department)}`}
                />

                <div
                  onClick={() =>
                    setExpandedJob(expandedJob === index ? null : index)
                  }
                  className="p-6 cursor-pointer pl-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className={`text-xl font-bold ${theme.text}`}>
                          {job.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getDepartmentColor(job.department)} text-white`}
                        >
                          {job.department}
                        </span>
                        {job.urgent && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center gap-1">
                            <FaFire className="text-[10px]" /> Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {/* Country Flag + Hiring Region Badge */}
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isDarkMode ? "bg-white/10 border border-white/20 text-white" : "bg-white border border-gray-200 text-gray-800 shadow-sm"}`}
                        >
                          <span className="text-base leading-none">
                            {job.flag}
                          </span>{" "}
                          {job.country}
                        </span>
                        {/* Location + Work Mode: "Kolkata | Work From Office (WFO)" for India, "Remote" for UK/US */}
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${theme.gradientText} ${isDarkMode ? "text-[#0a0e27]" : "text-white"} shadow-sm`}
                        >
                          <FaMapMarkerAlt className="text-[11px]" />{" "}
                          {getLocationDisplay(job)}
                        </span>
                        {/* Hiring Region */}
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${theme.borderColor} ${theme.cardBg} ${theme.muted}`}
                        >
                          <FaGlobe className="text-[11px]" /> Hiring Region:{" "}
                          {getHiringRegion(job)}
                        </span>
                        {/* Experience */}
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${theme.borderColor} ${theme.cardBg} ${theme.muted}`}
                        >
                          <FaBriefcase className="text-[11px]" /> Experience:{" "}
                          {job.experience}
                        </span>
                        {/* Employment Type */}
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${theme.borderColor} ${theme.cardBg} ${theme.muted}`}
                        >
                          <FaClock className="text-[11px]" /> {job.type}
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? "text-[#d4e157] bg-[#d4e157]/10" : "text-emerald-600 bg-emerald-50"} font-bold transition-all duration-300`}
                    >
                      {expandedJob === index ? "Close Details" : "View Details"}
                      {expandedJob === index ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedJob === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`border-t ${theme.borderColor} bg-gradient-to-r ${isDarkMode ? "from-[#d4e157]/5 to-[#06b6d4]/5" : "from-emerald-50/50 to-cyan-50/50"}`}
                    >
                      <div className="p-6">
                        {/* Job Quick Info Grid: Hiring Region / Work Mode / Experience / Employment Type */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                          {[
                            {
                              label: "Hiring Region",
                              value: getHiringRegion(job),
                              icon: FaGlobe,
                            },
                            {
                              label: "Work Mode",
                              value: job.workMode,
                              icon: FaMapMarkerAlt,
                            },
                            {
                              label: "Experience",
                              value: job.experience,
                              icon: FaBriefcase,
                            },
                            {
                              label: "Employment Type",
                              value: job.type,
                              icon: FaClock,
                            },
                          ].map((info, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-xl border ${theme.borderColor} ${isDarkMode ? "bg-white/5" : "bg-white shadow-sm"}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <info.icon
                                  className={`text-sm ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
                                />
                                <span
                                  className={`text-[10px] font-black uppercase tracking-wider ${theme.muted}`}
                                >
                                  {info.label}
                                </span>
                              </div>
                              <p className={`text-sm font-bold ${theme.text}`}>
                                {info.value}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4
                              className={`font-bold ${theme.text} mb-3 flex items-center gap-2`}
                            >
                              <FaCheckCircle
                                className={
                                  isDarkMode
                                    ? "text-[#d4e157]"
                                    : "text-emerald-500"
                                }
                              />
                              Responsibilities
                            </h4>
                            <ul className="space-y-2">
                              {job.responsibilities.map((resp, idx) => (
                                <li
                                  key={idx}
                                  className={`flex items-start gap-2 ${theme.muted}`}
                                >
                                  <span
                                    className={`mt-1.5 w-1.5 h-1.5 rounded-full ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} flex-shrink-0`}
                                  />
                                  {resp}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4
                              className={`font-bold ${theme.text} mb-3 flex items-center gap-2`}
                            >
                              <FaStar
                                className={
                                  isDarkMode
                                    ? "text-[#d4e157]"
                                    : "text-emerald-500"
                                }
                              />
                              Required Skills
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {job.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className={`px-4 py-2 rounded-full text-sm font-semibold ${isDarkMode ? "bg-white/10 text-gray-300 border border-white/20" : "bg-white text-gray-700 border border-gray-200 shadow-sm"}`}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate("/contact")}
                              className={`w-full md:w-auto px-8 py-3 bg-gradient-to-r ${theme.gradientText} ${isDarkMode ? "text-[#0a0e27]" : "text-white"} font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
                            >
                              Apply Now <FaArrowRight className="text-sm" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HIRING PROCESS - UNIQUE TIMELINE ===== */}
      <section className={`py-24 relative overflow-hidden ${theme.bg}`}>
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"}`}
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
                How It Works
              </span>
            </div>
            <h2
              className={`text-3xl md:text-5xl font-black ${theme.text} mb-6`}
            >
              Our{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
              >
                Hiring Process
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical Connecting Line */}
            <div
              className={`absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 ${isDarkMode ? "bg-gradient-to-b from-[#d4e157]/50 via-[#06b6d4]/50 to-transparent" : "bg-gradient-to-b from-emerald-500/50 via-cyan-500/50 to-transparent"}`}
            />

            <div className="space-y-8">
              {process.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Center Dot - UNIQUE */}
                  <div
                    className={`absolute left-8 md:left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-gradient-to-r ${theme.gradientText} z-10 ring-4 ${isDarkMode ? "ring-[#050508]" : "ring-white"}`}
                  >
                    <motion.div
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${theme.gradientText}`}
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    />
                  </div>

                  <div
                    className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? "md:mr-auto md:pr-12 md:text-right" : "md:ml-auto md:pl-12 md:text-left"}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, y: -5 }}
                      className={`relative p-6 rounded-2xl ${theme.cardBg} border ${theme.borderColor} group cursor-pointer overflow-hidden`}
                    >
                      {/* Step Number Badge */}
                      <div
                        className={`absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-r ${theme.gradientText} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <span className="text-sm font-black text-[#0a0e27]">
                          {step.step}
                        </span>
                      </div>

                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${theme.gradientText} flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <step.icon className="text-xl text-[#0a0e27]" />
                      </div>
                      <h3 className={`text-xl font-bold ${theme.text} mb-2`}>
                        {step.title}
                      </h3>
                      <p className={theme.muted}>{step.desc}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section
        className={`py-24 relative overflow-hidden ${isDarkMode ? "bg-[#0a0e27]" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"}`}
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
                Team Voices
              </span>
            </div>
            <h2
              className={`text-3xl md:text-5xl font-black ${theme.text} mb-6`}
            >
              Employee{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
              >
                Testimonials
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative p-8 rounded-3xl ${theme.cardBg} border ${theme.borderColor} backdrop-blur-xl transition-all duration-300 group overflow-hidden`}
              >
                {/* Background Gradient - UNIQUE */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${theme.gradientText} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <FaQuoteLeft
                  className={`text-4xl mb-4 bg-gradient-to-r ${theme.gradientText} bg-clip-text text-transparent opacity-50`}
                />
                <p className={`${theme.muted} mb-6 leading-relaxed`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${i < testimonial.rating ? (isDarkMode ? "text-[#d4e157]" : "text-emerald-500") : "text-gray-300"}`}
                    />
                  ))}
                </div>

                {/* Avatar + Info - UNIQUE */}
                <div className="flex items-center gap-3 pt-4 border-t border-dashed border-gray-300/20">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.gradientText} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-sm font-bold text-[#0a0e27]">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <div className={`font-bold ${theme.text}`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-sm ${theme.muted}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className={`py-24 relative overflow-hidden ${theme.bg}`}>
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/20 to-[#06b6d4]/20" : "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"}`}
        />
        <div className="absolute inset-0 backdrop-blur-sm" />

        {/* Floating Decorations - UNIQUE */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className={`absolute top-20 left-10 w-20 h-20 rounded-2xl ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} blur-xl`}
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className={`absolute bottom-20 right-10 w-32 h-32 rounded-full ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-500/10"} blur-xl`}
        />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${theme.gradientText} flex items-center justify-center shadow-2xl`}
            >
              <FaRocket className="text-3xl text-[#0a0e27]" />
            </motion.div>

            <h2
              className={`text-3xl md:text-5xl font-black ${theme.text} mb-6`}
            >
              Ready to Build What's{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
              >
                Next?
              </span>
            </h2>
            <p
              className={`text-lg md:text-xl ${theme.muted} mb-8 max-w-3xl mx-auto`}
            >
              Your next opportunity could be the beginning of something bigger.
              Join BluConnet Media and build a career where your ideas, skills
              and ambition can make a real impact.
            </p>

            {/* ===== PREMIUM BUTTONS SET 2 ===== */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("open-positions")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r ${theme.gradientText} ${isDarkMode ? "text-[#0a0e27]" : "text-white"} font-bold rounded-full shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)] transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
                <span className="relative z-20 flex items-center gap-3">
                  View Open Positions
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/contact")}
                className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 border ${isDarkMode ? "border-white/20 text-white hover:bg-white/10" : "border-gray-900/20 text-gray-900 hover:bg-gray-900/5"} font-bold rounded-full backdrop-blur-sm transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl`}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                <span className="relative z-20 flex items-center gap-3">
                  Send Your Resume
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      <SubscribeSection />
    </div>
  );
};

export default CareerPage;
