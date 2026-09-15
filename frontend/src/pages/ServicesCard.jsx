import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Icons
import {
  FaEnvelope,
  FaUsers,
  FaBullhorn,
  FaHandshake,
  FaCode,
  FaShareAlt,
  FaPalette,
  FaSearch,
  FaShoppingCart,
  FaChartLine,
  FaMobileAlt,
  FaCogs,
  FaArrowRight,
  FaCheckCircle,
  FaRocket,
  FaStar,
} from "react-icons/fa";

const ServicesCard = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  const y = useTransform(scrollY, [0, 300], [0, -120]);

  const [counters, setCounters] = useState({ clients: 0, projects: 0, satisfaction: 0 });
  const counterRef = useRef(null);

  const theme = {
    bg: isDarkMode ? "bg-[#050508]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    muted: isDarkMode ? "text-gray-400" : "text-gray-600",
    gradientText: isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600",
    gradientBg: isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600",
    cardBg: isDarkMode ? "bg-white/5" : "bg-white",
    borderColor: isDarkMode ? "border-white/10" : "border-gray-200",
  };

  const services = [
    { id: 1, title: "Email Marketing", link: "/services/email", icon: FaEnvelope, description: "Craft targeted email campaigns that nurture leads, boost conversions, and build lasting customer relationships." },
    { id: 2, title: "Lead Generation", link: "/services/lead", icon: FaUsers, description: "Identify and attract high-quality prospects through data-driven strategies and multi-channel outreach." },
    { id: 3, title: "Content Marketing", link: "/services/content", icon: FaBullhorn, description: "Create compelling, SEO-friendly content that educates, engages, and drives organic traffic to your brand." },
    { id: 4, title: "Affiliate Marketing", link: "/services/affiliate", icon: FaHandshake, description: "Grow your revenue by partnering with affiliates who promote your products to their trusted audiences." },
    { id: 5, title: "HTML & Web App", link: "/services/html", icon: FaCode, description: "Build robust, responsive web applications with modern HTML, CSS, and JavaScript frameworks." },
    { id: 6, title: "Social Media Marketing", link: "/services/social", icon: FaShareAlt, description: "Engage your audience across platforms with creative content, paid ads, and community management." },
    { id: 7, title: "Web Design & Development", link: "/services/web", icon: FaPalette, description: "Design stunning, user-friendly websites that convert visitors into loyal customers." },
    { id: 8, title: "SEO Marketing", link: "/services/seo", icon: FaSearch, description: "Improve your search rankings with on-page, off-page, and technical SEO strategies that deliver results." },
    { id: 9, title: "E-Commerce Marketing", link: "/services/ecommerce", icon: FaShoppingCart, description: "Drive sales and optimize your online store with tailored marketing funnels and conversion tactics." },
    { id: 10, title: "CRM & Graphic Designing", link: "/services/crm", icon: FaCogs, description: "Manage customer relationships effectively and create stunning visuals that reinforce your brand identity." },
    { id: 11, title: "Data Analytics & Research", link: "/services/analytics", icon: FaChartLine, description: "Turn data into actionable insights with advanced analytics, market research, and performance tracking." },
    { id: 12, title: "Mobile Marketing", link: "/services/mobile", icon: FaMobileAlt, description: "Reach customers on the go with SMS, in-app ads, and mobile-optimized campaigns that drive engagement." },
  ];

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const targetClients = 250;
          const targetProjects = 480;
          const targetSatisfaction = 98;
          const duration = 2500;
          const startTime = Date.now();

          const updateCounters = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setCounters({
              clients: Math.floor(easeOutQuart * targetClients),
              projects: Math.floor(easeOutQuart * targetProjects),
              satisfaction: Math.floor(easeOutQuart * targetSatisfaction),
            });
            if (progress < 1) requestAnimationFrame(updateCounters);
          };
          updateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-500 overflow-x-hidden`}>
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-br from-[#0a0e27] via-[#0f172a] to-[#050508]" : "bg-gradient-to-br from-slate-50 via-white to-gray-100"}`} />

        {/* Large SERVICES Watermark */}
        <div className={`absolute top-[85%] sm:top-[35%] md:top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[70px] sm:text-[100px] md:text-[250px] lg:text-[300px] font-black pointer-events-none select-none z-0 tracking-tighter whitespace-nowrap opacity-[0.03] md:opacity-[0.04] ${isDarkMode ? "text-white" : "text-black"}`}>
          SERVICES
        </div>

        {/* Animated Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-96 h-96 rounded-full blur-3xl ${i % 2 === 0 ? (isDarkMode ? "bg-emerald-500/10" : "bg-emerald-300/20") : (isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-300/20")}`}
              animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
              style={{ left: `${i * 20}%`, top: `${(i % 3) * 30}%` }}
            />
          ))}
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDarkMode
            ? `linear-gradient(rgba(212, 225, 87, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 225, 87, 0.1) 1px, transparent 1px)`
            : `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
          backgroundSize: "50px 50px, 50px 50px",
        }} />

        {/* Hero Content */}
        <motion.div
          style={{ opacity, scale, y, willChange: "transform" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"} backdrop-blur-sm`}>
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className={`w-2.5 h-2.5 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full`}></span>
              <span className={`absolute inset-0 w-2.5 h-2.5 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full animate-ping opacity-75`}></span>
            </div>
            <span className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}>
              What We Deliver
            </span>
          </div>

          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black ${theme.text} mb-6 leading-tight`}>
            Digital Solutions
            <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}>
              That Drive Growth.
            </span>
          </h1>

          <p className={`text-lg md:text-xl ${theme.muted} max-w-3xl mx-auto mb-12`}>
            From SEO to social media, web development to data analytics — we offer a full suite of services to help your brand thrive in the digital world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('services-grid').scrollIntoView({ behavior: 'smooth' })}
              className={`inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r ${theme.gradientText} ${isDarkMode ? "text-[#0a0e27]" : "text-white"} font-bold rounded-full shadow-2xl hover:shadow-[#d4e157]/50 transition-all duration-300`}
            >
              Explore Services <FaArrowRight />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className={`inline-flex items-center justify-center gap-3 px-8 py-4 border ${isDarkMode ? "border-white/20 text-white" : "border-gray-900/20 text-gray-900"} font-bold rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300`}
            >
              Get a Free Quote
            </motion.button>
          </div>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className={`w-6 h-10 rounded-full border-2 ${isDarkMode ? "border-white/30" : "border-gray-900/30"} flex items-start justify-center p-2`}>
            <div className={`w-1 h-3 rounded-full ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} animate-bounce`} />
          </div>
        </motion.div>
      </section>

      {/* ===== ALL SERVICES GRID ===== */}
      <section id="services-grid" className={`py-24 relative overflow-hidden ${isDarkMode ? "bg-[#0a0e27]" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-5xl font-black ${theme.text} mb-6`}>
              All{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}>
                Services
              </span>
            </h2>
            <p className={`text-lg ${theme.muted} max-w-2xl mx-auto`}>
              End‑to‑end digital marketing and development services tailored to your business goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  // UPDATED: navigate to the specific service link
                  className={`group relative p-8 rounded-3xl border ${theme.borderColor} ${theme.cardBg} backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:border-transparent overflow-hidden cursor-pointer text-left`}
                  onClick={() => navigate(service.link)}
                >
                  {/* Animated Top Border & Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientText} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradientText} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${theme.gradientText} text-[#0a0e27] text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon />
                    </div>
                    <h3 className={`text-xl font-bold ${theme.text} mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${theme.gradientText} transition-all duration-300`}>
                      {service.title}
                    </h3>
                    <p className={`${theme.muted} text-sm leading-relaxed mb-6`}>
                      {service.description}
                    </p>
                    <span className={`inline-flex items-center gap-2 text-sm font-bold ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300`}>
                      Learn More <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ANIMATED STATS ===== */}
      <section ref={counterRef} className={`py-24 relative overflow-hidden ${theme.bg}`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDarkMode ? "bg-[#d4e157]/5" : "bg-emerald-400/5"} rounded-full blur-3xl`} />
          <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-400/5"} rounded-full blur-3xl`} />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-5xl font-black ${theme.text} mb-6`}>
              Our{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}>
                Impact in Numbers
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FaUsers, value: counters.clients, suffix: "+", label: "Happy Clients" },
              { icon: FaRocket, value: counters.projects, suffix: "+", label: "Projects Delivered" },
              { icon: FaStar, value: counters.satisfaction, suffix: "%", label: "Client Satisfaction" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative p-10 rounded-3xl ${theme.cardBg} border ${theme.borderColor} text-center group overflow-hidden transition-all duration-300 hover:shadow-2xl`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientText} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${theme.gradientText} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <stat.icon className="text-4xl text-[#0a0e27]" />
                </div>
                <div className={`text-5xl md:text-6xl font-black ${theme.text} mb-2 tabular-nums`}>
                  {stat.value}{stat.suffix}
                </div>
                <div className={`text-lg font-medium ${theme.muted}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className={`py-24 relative overflow-hidden ${isDarkMode ? "bg-[#0a0e27]" : "bg-gray-50"}`}>
        <div className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/20 to-[#06b6d4]/20" : "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"}`} />
        <div className="absolute inset-0 backdrop-blur-sm" />
        
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className={`absolute top-20 left-10 w-24 h-24 rounded-2xl ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} blur-xl`}
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
              <FaCheckCircle className="text-4xl text-[#0a0e27]" />
            </motion.div>
            
            <h2 className={`text-3xl md:text-5xl font-black ${theme.text} mb-6`}>
              Ready to Elevate Your{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}>
                Digital Presence?
              </span>
            </h2>
            <p className={`text-lg md:text-xl ${theme.muted} mb-8 max-w-2xl mx-auto`}>
              Let's discuss how our services can help you achieve your goals. Get a free consultation today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className={`px-10 py-4 bg-gradient-to-r ${theme.gradientText} ${isDarkMode ? "text-[#0a0e27]" : "text-white"} font-bold rounded-full shadow-2xl hover:shadow-[#d4e157]/50 transition-all duration-300 text-lg`}
            >
              Contact Us Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesCard;