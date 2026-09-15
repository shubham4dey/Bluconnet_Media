import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaStar,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contact");
  };

  const [activeTab, setActiveTab] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  // Exact Data from Website
  const servicesData = [
    {
      title: "Affiliate Marketing Management",
      description:
        "Acceleration Partners brings the industry's most experience to global affiliate marketing with deep regional expertise and in-country support. There's a reason we're a six-time winner of the GPMA \"Best Affiliate and Partner Marketing Agency\" category.",
      cards: [
        {
          title: "Sub-Affiliate",
          desc: "Sub-affiliate networks act as intermediaries that connect brands with a broad range of affiliate partners, making it easier to scale programs and reach diverse audiences without managing individual relationships.",
        },
        {
          title: "Content",
          desc: "Content affiliates use their trusted voices to create high-quality content that expands your reach and drives conversions. Our Publisher Development team connects you with the right content partners.",
        },
        {
          title: "Retail Media",
          desc: "Reach high-intent shoppers through retailer-owned ad placements, driving visibility and conversions at the point of purchase. By integrating retail media into your affiliate strategy, we help you optimize spend.",
        },
        {
          title: "Performance PR",
          desc: "With the robust tracking capabilities of affiliate marketing, we help you measure PR campaign impact in driving business growth and achieving key objectives.",
        },
        {
          title: "Coupon",
          desc: "Partner with a diverse network of publishers—including deal affiliates, bloggers, and traditional media—to distribute exclusive coupon codes that drive sales and build customer loyalty.",
        },
        {
          title: "Deal",
          desc: "Combine the strengths of coupon and content partners to attract and convert shoppers by promoting curated discounts and special offers to engaged audiences.",
        },
        {
          title: "Loyalty",
          desc: "Loyalty affiliates reward shoppers with cashback, points, and other incentives, making them trusted shopping destinations for deal seekers.",
        },
      ],
    },
    {
      title: "Influencer Marketing Programs",
      description:
        "Performance Influencer from Acceleration Partners is your future-proof influencer partner, transforming your influencer program into a performance-driven growth channel. This full-funnel, data-led program helps brands of all sizes ignite awareness and drive measurable results.",
      cards: [
        {
          title: "Amplify performance",
          desc: "with Paid Amplification that increases engagement, accelerates results and sustains performance.",
        },
        {
          title: "Ignite momentum",
          desc: "with user-generated content from nano and micro influencers who inspire trust.",
        },
        {
          title: "Expand your reach",
          desc: "through macro and celebrity influencers who build brand awareness and engagement.",
        },
        {
          title: "Drive measurable growth",
          desc: "through full-funnel influencer strategies that connect awareness to conversion and deliver 360-degree performance.",
        },
      ],
    },
    {
      title: "Partnership Marketing",
      description:
        "Maximize your brand's potential with a comprehensive partnership marketing strategy. From affiliates to influencers to strategic alliances, we help you tap into every partnership channel to drive awareness, engagement, and sales across the entire customer journey.",
      cards: [
        {
          title: "End to End",
          desc: "Our full-spectrum, full-funnel partnership marketing programs—spanning design, recruitment, optimization, and scale—drive revenue and category growth.",
        },
        {
          title: "Affiliate Marketing",
          desc: "Acceleration Partners brings the industry's most experience to global affiliate marketing with deep regional expertise and in-country support.",
        },
        {
          title: "Influencer Marketing",
          desc: "AP is the influencer marketing solution that transforms influencer partnerships from a brand awareness tool into a direct revenue-generating channel.",
        },
      ],
    },
  ];

  const handleTabChange = (index) => {
    setActiveTab(index);
    setActiveCard(0);
  };

  const nextCard = () =>
    setActiveCard((prev) => (prev + 1) % servicesData[activeTab].cards.length);
  const prevCard = () =>
    setActiveCard(
      (prev) =>
        (prev - 1 + servicesData[activeTab].cards.length) %
        servicesData[activeTab].cards.length,
    );

  return (
    <section
      id="services"
      className={`py-20 md:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Glow Effects */}
      <div
        className={`absolute top-1/4 right-0 w-96 h-96 ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} rounded-full blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-1/4 left-0 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-600/10"} rounded-full blur-3xl`}
      ></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? "#d4e157" : "#10b981"} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          {/* Label Badge */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="mb-6 text-center"  // ✅ Changed from "text-center lg:text-left" to "text-center"
>
  <div
    className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${
      isDarkMode
        ? "bg-[#d4e157]/10 border border-[#d4e157]/30 text-[#d4e157]"
        : "bg-emerald-50 border border-emerald-200 text-emerald-700"
    }`}
  >
    {/* Blinking Circle */}
    <div className="relative flex items-center justify-center w-2.5 h-2.5">
      <span
        className={`w-2.5 h-2.5 ${
          isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
        } rounded-full`}
      ></span>
      <span
        className={`absolute inset-0 w-2.5 h-2.5 ${
          isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
        } rounded-full animate-ping opacity-75`}
      ></span>
    </div>

    <span
      className={`text-[11px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
    >
      OUR SERVICES
    </span>
  </div>
</motion.div>

          {/* Main Heading */}
          <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8">
            <FaStar
              className={`${
                isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
              } text-3xl sm:text-4xl md:text-5xl flex-shrink-0 mt-1`}
            />
            <h2
              className={`font-black leading-tight mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              } text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
            >
              AFFILIATE & INFLUENCER <br className="md:hidden" />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
              >
                MARKETING SERVICES
              </span>
            </h2>
          </div>

          {/* Tabs */}
          <div
            className={`flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10 border-b ${
              isDarkMode ? "border-white/10" : "border-gray-200"
            } pb-4 mb-12`}
          >
            {servicesData.map((tab, index) => (
              <motion.button
                key={index}
                onClick={() => handleTabChange(index)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 text-sm md:text-base font-bold tracking-wide transition-all duration-300 pb-2 ${
                  activeTab === index
                    ? isDarkMode
                      ? "text-[#d4e157]"
                      : "text-emerald-600"
                    : isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.title.toUpperCase()}
                {activeTab === index ? (
                  <FaMinus size={12} />
                ) : (
                  <FaPlus size={12} />
                )}
              </motion.button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Side: Text & Buttons */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3
                className={`text-2xl md:text-4xl text-center lg:text-left font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}
              >
                {servicesData[activeTab].title}
              </h3>
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-base text-center lg:text-left md:text-lg leading-relaxed mb-8`}
              >
                {servicesData[activeTab].description}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <motion.button
                  onClick={goToContact}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 bg-gradient-to-r font-bold rounded-lg transition-all duration-300 flex items-center gap-2 group shadow-lg ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[#d4e157]/20"
                      : "from-emerald-500 to-cyan-600 text-white shadow-emerald-500/20"
                  }`}
                >
                  LET'S TALK{" "}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={goToContact}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 font-bold rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      : "bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  LEARN MORE
                </motion.button>
              </div>
            </motion.div>

            {/* Right Side: Card Carousel */}
            <div className="relative min-h-[300px] md:min-h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${activeCard}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className={`relative bg-gradient-to-br ${isDarkMode ? "from-white/5 to-white/10" : "from-white to-gray-50"} border ${isDarkMode ? "border-white/10" : "border-gray-200"} rounded-2xl text-center lg:text-left p-8 h-full flex flex-col justify-center overflow-hidden group transition-all duration-500 ${isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"} shadow-lg`}
                >
                  {/* Card Glow Effect */}
                  <div
                    className={`absolute -top-20 -right-20 w-40 h-40 ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-500/20"} rounded-full blur-3xl transition-all duration-500`}
                  ></div>
                  <div
                    className={`absolute -bottom-20 -left-20 w-40 h-40 ${isDarkMode ? "bg-[#06b6d4]/20" : "bg-cyan-600/20"} rounded-full blur-3xl transition-all duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${isDarkMode ? "from-[#d4e157]/20 to-[#06b6d4]/20" : "from-emerald-100 to-cyan-100"} flex items-center justify-center border ${isDarkMode ? "border-[#d4e157]/30" : "border-emerald-200"}`}
                      >
                        <div
                          className={`w-5 h-5 ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} rounded-full`}
                        ></div>
                      </div>
                      <h4
                        className={`text-xl md:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {servicesData[activeTab].cards[activeCard].title}
                      </h4>
                    </div>
                    <p
                      className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} leading-relaxed text-base md:text-lg`}
                    >
                      {servicesData[activeTab].cards[activeCard].desc}
                    </p>

                    {/* Card Counter */}
                    <div className="mt-6 flex items-center gap-2">
                      <span
                        className={`${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} font-bold text-lg`}
                      >
                        {String(activeCard + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }
                      >
                        /
                      </span>
                      <span
                        className={`${isDarkMode ? "text-gray-500" : "text-gray-400"} font-bold text-lg`}
                      >
                        {String(servicesData[activeTab].cards.length).padStart(
                          2,
                          "0",
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Arrows */}
              <div className="absolute -bottom-16 right-1/2 translate-x-1/2 lg:right-0 lg:translate-x-0 flex gap-4">
                <motion.button
                  onClick={prevCard}
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  } flex items-center justify-center transition shadow-lg`}
                >
                  <FaArrowLeft
                    className={isDarkMode ? "text-[#0a0e27]" : "text-white"}
                  />
                </motion.button>
                <motion.button
                  onClick={nextCard}
                  whileHover={{ scale: 1.1, x: 3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} flex items-center justify-center transition shadow-lg`}
                >
                  <FaArrowRight
                    className={isDarkMode ? "text-[#0a0e27]" : "text-white"}
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
