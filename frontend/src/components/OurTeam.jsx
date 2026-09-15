import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaArrowRight,
  FaTimes,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";
import getThemeColors from "../utils/themeColors";

const teamImages = {
  shikha:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935531/shikha.439aa9e0b5a9ad5ef710_bu3k9t.webp",
  harrychotu:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935802/harrychotu.222e2631de10151d20cc_drb62g.webp",
  ravi: "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935627/ravi.e0e20476fa04b5cfbe2b_tpl4mh.webp",
  atreyee:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935823/atreyee.2e25f85226862766fe0f_nwe8ys.webp",
  kashif:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935782/kashif.3e8cf346eb9cdeb5dea6_xtdrww.webp",
  shubham:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935511/shubham.d1a9a3a3225b05add634_th6cg1.webp",
  moumita:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935715/moumita.0df1c1584a5b6f36068d_pblbmi.webp",
  rumki:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935562/rumki.ac29ba034c5476e39001_g7he1r.webp",
  konica:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935762/konica.806db8d6dbf78816a897_1_xspll0.webp",
  ronit:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935600/ronit.4f317e63da8a823b64a1_rpjxwl.webp",
  sumana:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935472/sumana.193aedd5cbcb1fee3a1d_iivksv.webp",
  pdas: "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935683/pdas.451268cc1519900bdb15_oypbjd.webp",
  lasmi:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935737/lasmi.8cb83a825976b21f0a92_mouxin.webp",
  poulami:
    "https://res.cloudinary.com/wyixfdon/image/upload/f_auto,q_auto,c_fill,g_face,w_400,h_400/v1785935650/poulami.030e2f3d65620f3f0edb_aivmku.webp",
};

const OurTeam = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [visiblePairsCount, setVisiblePairsCount] = useState(3);

  const getImageObjectPosition = (memberName) => {
    if (memberName === "Shikha Sharma") return "center 28%";
    if (memberName === "Harry Chotu") return "center 28%";
    if (memberName === "Atreyee Som") return "center 40%";
    if (memberName === "Shubham Dey") return "center 30%";
    if (memberName === "Ronit Das") return "center 8%";
    if (memberName === "Pue Das") return "center 30%";
    if (memberName === "Poulami Pal") return "center 70%";
    return "center";
  };

  const teamMembers = [
    {
      name: "Shikha Sharma",
      role: "CEO & Founder",
      image: teamImages.shikha,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Shikha leads the company's vision with a focus on innovation, strategic growth, and building lasting client partnerships through digital-first business solutions.",
      expertise: [
        "Business Strategy",
        "Leadership",
        "Digital Marketing",
        "Business Growth",
      ],
    },
    {
      name: "Harry Chotu",
      role: "Senior Affiliate Manager",
      image: teamImages.harrychotu,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Harry builds strong affiliate partnerships, manages publisher relationships, and drives campaign growth through strategic optimization and performance-focused management.",
      expertise: [
        "Affiliate Marketing",
        "Partner Management",
        "Campaign Optimization",
        "Performance Tracking",
      ],
    },
    {
      name: "Ravi Sharma",
      role: "Social Marketing Executive",
      image: teamImages.ravi,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Ravi manages social media campaigns, creates engaging content, and drives audience growth through strategic marketing and performance-focused execution.",
      expertise: [
        "Social Media Marketing",
        "Content Strategy",
        "Campaign Management",
        "Performance Analytics",
      ],
    },
    {
      name: "Atreyee Som",
      role: "HR & Operational Officer",
      image: teamImages.atreyee,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Atreyee manages HR operations, streamlines internal processes, and fosters a productive workplace while ensuring efficient coordination across teams.",
      expertise: [
        "HR Management",
        "Operations Management",
        "Team Coordination",
        "Process Improvement",
      ],
    },
    {
      name: "Md Kashif Khan",
      role: "Frontend Developer",
      image: teamImages.kashif,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Kashif creates responsive, high-performance user interfaces using modern web technologies, delivering seamless experiences with clean, efficient, and maintainable code.",
      expertise: ["React", "Next.js", "Tailwind CSS", "API Integration"],
    },
    {
      name: "Shubham Dey",
      role: "Backend Developer",
      image: teamImages.shubham,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Shubham develops secure, scalable backend systems, builds robust APIs, and optimizes databases to ensure reliable performance across all applications.",
      expertise: [
        "Node.js",
        "REST APIs",
        "Database Management",
        "Backend Architecture",
      ],
    },
    {
      name: "Moumita Ghosh",
      role: "Campaign Specialist",
      image: teamImages.moumita,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Moumita plans, manages, and optimizes marketing campaigns to maximize reach, improve performance, and deliver measurable results for every client.",
      expertise: [
        "Campaign Strategy",
        "Audience Segmentation",
        "Performance Optimization",
        "Marketing Analytics",
      ],
    },
    {
      name: "Rumki Deb",
      role: "Lead Generation Specialist",
      image: teamImages.rumki,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Rumki identifies high-quality prospects, develops targeted outreach strategies, and generates valuable leads that help drive consistent business growth.",
      expertise: [
        "Lead Generation",
        "Prospect Research",
        "Email Outreach",
        "CRM Management",
      ],
    },
    {
      name: "Konica Das",
      role: "Digital Traffic Manager",
      image: teamImages.konica,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Konica oversees campaign workflows, manages traffic distribution, and ensures projects are delivered on time with seamless coordination and operational efficiency.",
      expertise: [
        "Traffic Management",
        "Campaign Operations",
        "Workflow Coordination",
        "Performance Monitoring",
      ],
    },
    {
      name: "Ronit Das",
      role: "Account Manager",
      image: teamImages.ronit,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Ronit manages key client accounts, builds lasting partnerships, and ensures every project is executed smoothly while driving business growth and client satisfaction.",
      expertise: [
        "Client Relations",
        "Account Management",
        "Business Development",
        "Project Coordination",
      ],
    },
    {
      name: "Sumana Das",
      role: "Account Manager",
      image: teamImages.sumana,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Sumana focuses on client success by managing accounts, improving collaboration, and delivering tailored solutions that drive lasting business value.",
      expertise: [
        "Customer Success",
        "Account Strategy",
        "Relationship Management",
        "Business Development",
      ],
    },
    {
      name: "Pue Das",
      role: "Account Manager",
      image: teamImages.pdas,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Pue builds strong client relationships, coordinates project execution, and ensures every solution aligns with business goals while delivering measurable results.",
      expertise: [
        "Client Relations",
        "Account Management",
        "Project Coordination",
        "Business Strategy",
      ],
    },
    {
      name: "Lasmi Gupta",
      role: "Account Manager",
      image: teamImages.lasmi,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Lasmi manages client relationships, coordinates project execution, and ensures every account is handled with efficiency, professionalism, and a strong focus on client success.",
      expertise: [
        "Client Management",
        "Account Strategy",
        "Project Coordination",
        "Relationship Building",
      ],
    },
    {
      name: "Poulami Pal",
      role: "Account Manager",
      image: teamImages.poulami,
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
        linkedin: "#",
        pinterest: "#",
        youtube: "#",
      },
      bio: "Poulami oversees client accounts, strengthens business relationships, and ensures projects are delivered efficiently while maintaining exceptional service and client satisfaction.",
      expertise: [
        "Client Success",
        "Account Management",
        "Project Planning",
        "Stakeholder Communication",
      ],
    },
  ];

  const socialIcons = [
    { icon: FaFacebookF, href: "facebook", delay: 0.1 },
    { icon: FaXTwitter, href: "twitter", delay: 0.2 },
    { icon: FaLinkedinIn, href: "linkedin", delay: 0.3 },
    { icon: FaInstagram, href: "instagram", delay: 0.4 },
  ];

  const getThemeIconColor = (idx) => {
    const darkColors = ["#d4e157", "#06b6d4", "#d4e157", "#06b6d4"];
    const lightColors = ["#10b981", "#06b6d4", "#10b981", "#06b6d4"];
    return isDarkMode ? darkColors[idx] : lightColors[idx];
  };

  const teamPairs = [
    [teamMembers[0], teamMembers[1]],
    [teamMembers[2], teamMembers[3]],
    [teamMembers[4], teamMembers[5]],
    [teamMembers[6], teamMembers[7]],
    [teamMembers[8], teamMembers[9]],
    [teamMembers[10], teamMembers[11]],
    [teamMembers[12], teamMembers[13]],
  ];

  const visiblePairs = teamPairs.slice(0, visiblePairsCount);
  const isAllVisible = visiblePairsCount >= teamPairs.length;

  const handleToggleView = () => {
    if (isAllVisible) {
      setVisiblePairsCount(3);
    } else {
      setVisiblePairsCount((prev) => Math.min(prev + 2, teamPairs.length));
    }
  };

  const handleElementInteraction = (speakerId, member) => {
    if (activeSpeaker === speakerId) {
      setSelectedMember(member);
      setActiveSpeaker(null);
    } else {
      setActiveSpeaker(speakerId);
    }
  };

  return (
    <section
      className={`py-24 px-4 relative overflow-hidden ${isDarkMode ? "bg-[#050508]" : "bg-white"}`}
    >
      {/* Background Elements */}
      <div
        className={`absolute top-0 right-0 w-96 h-96 ${colors.glowLeft} rounded-full blur-3xl opacity-30`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-96 h-96 ${colors.glowRight} rounded-full blur-3xl opacity-30`}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full mb-5 md:mb-8 ${
              isDarkMode
                ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30"
                : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
            }`}
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
              OUR TEAM
            </span>
          </motion.div>

          <h2
            className={`font-black leading-tight mb-6 ${isDarkMode ? "text-white" : "text-gray-900"} text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl`}
          >
            Meet The{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
            >
              Experts
            </span>
          </h2>
          <p
            className={`text-base md:text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Our talented team of digital innovators, creative thinkers, and
            strategic experts are dedicated to transforming your brand's digital
            presence.
          </p>
        </motion.div>

        {/* Team Rows */}
        <div className="space-y-8">
          {visiblePairs.map((pair, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + rowIndex * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
            >
              {/* Left Circular Image */}
              <motion.div
                className="relative flex justify-center cursor-pointer"
                onClick={() =>
                  handleElementInteraction(`left-${rowIndex}`, pair[0])
                }
                onMouseEnter={() => setActiveSpeaker(`left-${rowIndex}`)}
                onMouseLeave={() => setActiveSpeaker(null)}
              >
                <div className="relative w-64 h-64 md:w-72 md:h-72">
                  <motion.div
                    className={`absolute inset-0 rounded-full border-4 border-dashed ${isDarkMode ? "border-[#d4e157]/30" : "border-emerald-300/30"}`}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className={`absolute inset-2 rounded-full border-2 border-dotted ${isDarkMode ? "border-[#06b6d4]/30" : "border-cyan-300/30"}`}
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${activeSpeaker === `left-${rowIndex}` ? (isDarkMode ? "bg-[#d4e157]/40 opacity-100" : "bg-emerald-400/40 opacity-100") : "opacity-0"}`}
                  />
                  <motion.div
                    className={`relative w-full h-full rounded-full overflow-hidden border-4 transition-all duration-500 ${activeSpeaker === `left-${rowIndex}` ? (isDarkMode ? "border-[#d4e157] shadow-2xl shadow-[#d4e157]/50" : "border-emerald-500 shadow-2xl shadow-emerald-500/50") : isDarkMode ? "border-white/20" : "border-emerald-200"}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={pair[0].image}
                      alt={pair[0].name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: getImageObjectPosition(pair[0].name),
                      }}
                    />
                    <motion.div
                      className={`absolute inset-0 transition-all duration-500 ${activeSpeaker === `left-${rowIndex}` ? (isDarkMode ? "bg-gradient-to-br from-[#d4e157]/40 via-[#06b6d4]/40 to-[#0a0e27]/90" : "bg-gradient-to-br from-emerald-400/50 via-cyan-400/50 to-gray-900/90") : "bg-black/0"}`}
                      initial={false}
                      animate={{
                        opacity: activeSpeaker === `left-${rowIndex}` ? 1 : 0,
                      }}
                    />
                  </motion.div>

                  {/* Social Icons */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-full h-full pointer-events-auto">
                      {socialIcons.map((social, idx) => {
                        const Icon = social.icon;
                        const positions = [
                          {
                            top: "5%",
                            left: "50%",
                            transform: "translate(-50%, 0)",
                          },
                          {
                            top: "50%",
                            right: "5%",
                            transform: "translate(0, -50%)",
                          },
                          {
                            bottom: "5%",
                            left: "50%",
                            transform: "translate(-50%, 0)",
                          },
                          {
                            top: "50%",
                            left: "5%",
                            transform: "translate(0, -50%)",
                          },
                        ];
                        return (
                          <motion.a
                            key={idx}
                            href={pair[0].social[social.href] || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center border-2 transition-all"
                            style={{
                              ...positions[idx],
                              borderColor:
                                activeSpeaker === `left-${rowIndex}`
                                  ? getThemeIconColor(idx)
                                  : "transparent",
                              backgroundColor:
                                activeSpeaker === `left-${rowIndex}`
                                  ? getThemeIconColor(idx)
                                  : "rgba(0,0,0,0.6)",
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity:
                                activeSpeaker === `left-${rowIndex}` ? 1 : 0,
                              scale:
                                activeSpeaker === `left-${rowIndex}` ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, delay: social.delay }}
                            whileHover={{ scale: 1.2, rotate: 360 }}
                          >
                            <Icon className="text-sm" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Center - Premium Capsule Design for Names */}
              <motion.div
                className={`${colors.cardBg} rounded-3xl p-5 border-2 ${colors.borderColor} shadow-2xl flex flex-col justify-center gap-4 relative overflow-hidden`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + rowIndex * 0.1 }}
              >
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 ${isDarkMode ? "bg-[#d4e157]/5" : "bg-emerald-400/10"} rounded-full blur-3xl`}
                ></div>

                {/* Left Member Capsule */}
                <motion.div
                  onClick={() =>
                    handleElementInteraction(`left-${rowIndex}`, pair[0])
                  }
                  onMouseEnter={() => setActiveSpeaker(`left-${rowIndex}`)}
                  onMouseLeave={() => setActiveSpeaker(null)}
                  className={`relative group p-3 rounded-2xl cursor-pointer transition-all duration-500 border-2 overflow-hidden ${activeSpeaker === `left-${rowIndex}` ? (isDarkMode ? "border-[#d4e157] bg-[#d4e157]/10 shadow-lg shadow-[#d4e157]/20" : "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20") : isDarkMode ? "border-white/10 hover:border-white/30 hover:bg-white/5" : "border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50"}`}
                >
                  <motion.div
                    className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/20 via-[#06b6d4]/20 to-[#d4e157]/20" : "bg-gradient-to-r from-emerald-200/40 via-cyan-200/40 to-emerald-200/40"}`}
                    initial={{ x: "-100%" }}
                    animate={{
                      x: activeSpeaker === `left-${rowIndex}` ? "0%" : "-100%",
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${activeSpeaker === `left-${rowIndex}` ? (isDarkMode ? "border-[#d4e157]" : "border-emerald-500") : "border-transparent"}`}
                      >
                        <img
                          src={pair[0].image}
                          alt={pair[0].name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: getImageObjectPosition(
                              pair[0].name,
                            ),
                          }}
                        />
                      </div>
                      <motion.div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${isDarkMode ? "border-[#0a0e27] bg-[#d4e157]" : "border-white bg-emerald-500"}`}
                        animate={{
                          scale:
                            activeSpeaker === `left-${rowIndex}`
                              ? [1, 1.2, 1]
                              : 1,
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold text-base truncate transition-all duration-300 ${activeSpeaker === `left-${rowIndex}` ? (isDarkMode ? "text-[#d4e157]" : "text-emerald-700") : isDarkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {pair[0].name}
                      </h4>
                      <p
                        className={`text-sm transition-colors duration-300 ${activeSpeaker === `left-${rowIndex}` ? (isDarkMode ? "text-[#06b6d4]" : "text-cyan-700") : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {pair[0].role}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${activeSpeaker === `left-${rowIndex}` ? (isDarkMode ? "bg-[#d4e157] text-[#0a0e27]" : "bg-emerald-500 text-white") : isDarkMode ? "bg-white/10 text-white" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      <FaArrowRight
                        className={`text-sm transition-transform duration-300 ${activeSpeaker === `left-${rowIndex}` ? "translate-x-1" : ""}`}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Right Member Capsule */}
                <motion.div
                  onClick={() =>
                    handleElementInteraction(`right-${rowIndex}`, pair[1])
                  }
                  onMouseEnter={() => setActiveSpeaker(`right-${rowIndex}`)}
                  onMouseLeave={() => setActiveSpeaker(null)}
                  className={`relative group p-3 rounded-2xl cursor-pointer transition-all duration-500 border-2 overflow-hidden ${activeSpeaker === `right-${rowIndex}` ? (isDarkMode ? "border-[#d4e157] bg-[#d4e157]/10 shadow-lg shadow-[#d4e157]/20" : "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/20") : isDarkMode ? "border-white/10 hover:border-white/30 hover:bg-white/5" : "border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50"}`}
                >
                  <motion.div
                    className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/20 via-[#06b6d4]/20 to-[#d4e157]/20" : "bg-gradient-to-r from-emerald-200/40 via-cyan-200/40 to-emerald-200/40"}`}
                    initial={{ x: "-100%" }}
                    animate={{
                      x: activeSpeaker === `right-${rowIndex}` ? "0%" : "-100%",
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${activeSpeaker === `right-${rowIndex}` ? (isDarkMode ? "border-[#d4e157]" : "border-emerald-500") : "border-transparent"}`}
                      >
                        <img
                          src={pair[1].image}
                          alt={pair[1].name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: getImageObjectPosition(
                              pair[1].name,
                            ),
                          }}
                        />
                      </div>
                      <motion.div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${isDarkMode ? "border-[#0a0e27] bg-[#d4e157]" : "border-white bg-emerald-500"}`}
                        animate={{
                          scale:
                            activeSpeaker === `right-${rowIndex}`
                              ? [1, 1.2, 1]
                              : 1,
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold text-base truncate transition-all duration-300 ${activeSpeaker === `right-${rowIndex}` ? (isDarkMode ? "text-[#d4e157]" : "text-emerald-700") : isDarkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {pair[1].name}
                      </h4>
                      <p
                        className={`text-sm transition-colors duration-300 ${activeSpeaker === `right-${rowIndex}` ? (isDarkMode ? "text-[#06b6d4]" : "text-cyan-700") : isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {pair[1].role}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${activeSpeaker === `right-${rowIndex}` ? (isDarkMode ? "bg-[#d4e157] text-[#0a0e27]" : "bg-emerald-500 text-white") : isDarkMode ? "bg-white/10 text-white" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      <FaArrowRight
                        className={`text-sm transition-transform duration-300 ${activeSpeaker === `right-${rowIndex}` ? "translate-x-1" : ""}`}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Circular Image */}
              <motion.div
                className="relative flex justify-center cursor-pointer"
                onClick={() =>
                  handleElementInteraction(`right-${rowIndex}`, pair[1])
                }
                onMouseEnter={() => setActiveSpeaker(`right-${rowIndex}`)}
                onMouseLeave={() => setActiveSpeaker(null)}
              >
                <div className="relative w-64 h-64 md:w-72 md:h-72">
                  <motion.div
                    className={`absolute inset-0 rounded-full border-4 border-dashed ${isDarkMode ? "border-[#d4e157]/30" : "border-emerald-300/30"}`}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className={`absolute inset-2 rounded-full border-2 border-dotted ${isDarkMode ? "border-[#06b6d4]/30" : "border-cyan-300/30"}`}
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${activeSpeaker === `right-${rowIndex}` ? (isDarkMode ? "bg-[#d4e157]/40 opacity-100" : "bg-emerald-400/40 opacity-100") : "opacity-0"}`}
                  />
                  <motion.div
                    className={`relative w-full h-full rounded-full overflow-hidden border-4 transition-all duration-500 ${activeSpeaker === `right-${rowIndex}` ? (isDarkMode ? "border-[#d4e157] shadow-2xl shadow-[#d4e157]/50" : "border-emerald-500 shadow-2xl shadow-emerald-500/50") : isDarkMode ? "border-white/20" : "border-emerald-200"}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={pair[1].image}
                      alt={pair[1].name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: getImageObjectPosition(pair[1].name),
                      }}
                    />
                    <motion.div
                      className={`absolute inset-0 transition-all duration-500 ${activeSpeaker === `right-${rowIndex}` ? (isDarkMode ? "bg-gradient-to-br from-[#d4e157]/40 via-[#06b6d4]/40 to-[#0a0e27]/90" : "bg-gradient-to-br from-emerald-400/50 via-cyan-400/50 to-gray-900/90") : "bg-black/0"}`}
                      initial={false}
                      animate={{
                        opacity: activeSpeaker === `right-${rowIndex}` ? 1 : 0,
                      }}
                    />
                  </motion.div>

                  {/* Social Icons */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-full h-full pointer-events-auto">
                      {socialIcons.map((social, idx) => {
                        const Icon = social.icon;
                        const positions = [
                          {
                            top: "5%",
                            left: "50%",
                            transform: "translate(-50%, 0)",
                          },
                          {
                            top: "50%",
                            right: "5%",
                            transform: "translate(0, -50%)",
                          },
                          {
                            bottom: "5%",
                            left: "50%",
                            transform: "translate(-50%, 0)",
                          },
                          {
                            top: "50%",
                            left: "5%",
                            transform: "translate(0, -50%)",
                          },
                        ];
                        return (
                          <motion.a
                            key={idx}
                            href={pair[1].social[social.href] || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center border-2 transition-all"
                            style={{
                              ...positions[idx],
                              borderColor:
                                activeSpeaker === `right-${rowIndex}`
                                  ? getThemeIconColor(idx)
                                  : "transparent",
                              backgroundColor:
                                activeSpeaker === `right-${rowIndex}`
                                  ? getThemeIconColor(idx)
                                  : "rgba(0,0,0,0.6)",
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity:
                                activeSpeaker === `right-${rowIndex}` ? 1 : 0,
                              scale:
                                activeSpeaker === `right-${rowIndex}` ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, delay: social.delay }}
                            whileHover={{ scale: 1.2, rotate: 360 }}
                          >
                            <Icon className="text-sm" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ===== PREMIUM STYLISH VIEW MORE / VIEW LESS BUTTON ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={handleToggleView}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`relative overflow-hidden group px-8 py-4 bg-gradient-to-r font-black text-sm md:text-base uppercase tracking-widest rounded-xl shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-3 ${
              isDarkMode
                ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
            }`}
          >
            {/* Animated Shine/Sweep Effect on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

            <span className="relative z-20 flex items-center gap-3">
              {isAllVisible ? "View Less" : "View More"}
              <FaArrowRight
                className={`text-lg transition-transform duration-300 ${isAllVisible ? "rotate-180" : "group-hover:translate-x-1"}`}
              />
            </span>
          </motion.button>
        </motion.div>

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
          className="mt-16 text-center"
        >
          <div
            className={`inline-flex flex-col md:flex-row items-center gap-4 md:gap-6 px-6 md:px-8 py-6 ${colors.cardBg} rounded-2xl border ${colors.borderColor} shadow-xl`}
          >
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className={`text-xl font-bold mb-1 ${colors.textColor}`}>
                Want to Join Our Team?
              </h3>
              <p className={`text-sm ${colors.textMuted}`}>
                We're always looking for talented individuals
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/career")}
              className={`relative overflow-hidden group px-8 py-4 bg-gradient-to-r font-black text-sm md:text-base uppercase tracking-widest rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 w-full md:w-auto ${
                isDarkMode
                  ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                  : "from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
              }`}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
              <span className="relative z-20">View Careers</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedMember(null)}
            ></div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border ${isDarkMode ? "bg-[#0f1535] border-white/10" : "bg-white border-gray-200"}`}
            >
              <button
                onClick={() => setSelectedMember(null)}
                className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${isDarkMode ? "bg-gradient-to-br from-[#d4e157] to-[#06b6d4] text-[#0a0e27] hover:shadow-[#d4e157]/50 hover:scale-110" : "bg-gradient-to-br from-emerald-500 to-cyan-600 text-white hover:shadow-emerald-500/50 hover:scale-110"}`}
              >
                <FaTimes className="text-lg font-bold" />
              </button>

              <div className="grid md:grid-cols-2">
                <div
                  className={`relative h-72 md:h-auto flex items-center justify-center p-8 ${isDarkMode ? "bg-gradient-to-br from-[#d4e157]/10 to-[#06b6d4]/10" : "bg-gradient-to-br from-emerald-50 to-cyan-50"}`}
                >
                  <div
                    className={`relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 shadow-2xl ${isDarkMode ? "border-[#d4e157]/50" : "border-emerald-500/50"}`}
                  >
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: getImageObjectPosition(
                          selectedMember.name,
                        ),
                      }}
                    />
                  </div>
                  <div
                    className={`absolute top-10 left-10 w-24 h-24 rounded-full blur-3xl ${isDarkMode ? "bg-[#d4e157]/30" : "bg-emerald-400/30"}`}
                  ></div>
                  <div
                    className={`absolute bottom-10 right-10 w-24 h-24 rounded-full blur-3xl ${isDarkMode ? "bg-[#06b6d4]/30" : "bg-cyan-400/30"}`}
                  ></div>
                </div>

                <div className="p-8 md:p-10 flex flex-col justify-center items-start text-start w-full">
                  <div className="mb-6 w-full">
                    <h3
                      className={`text-3xl md:text-4xl font-black mb-3 ${isDarkMode ? "text-white" : "text-gray-900"} text-start`}
                    >
                      {selectedMember.name}
                    </h3>
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${isDarkMode ? "bg-[#d4e157]/10 text-[#d4e157] border border-[#d4e157]/30" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}
                    >
                      {selectedMember.role}
                    </span>
                  </div>

                  <p
                    className={`text-base md:text-lg leading-relaxed mb-8 w-full ${isDarkMode ? "text-gray-300" : "text-gray-600"} text-start`}
                  >
                    {selectedMember.bio}
                  </p>

                  <div className="mb-8 w-full">
                    <h4
                      className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"} text-start`}
                    >
                      Core Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${isDarkMode ? "bg-white/5 text-gray-300 border border-white/10" : "bg-gray-100 text-gray-700 border border-gray-200"}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full">
                    <h4
                      className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"} text-start`}
                    >
                      Connect
                    </h4>
                    <div className="flex gap-3">
                      {Object.entries(selectedMember.social).map(
                        ([platform, link]) => {
                          const Icon =
                            platform === "facebook"
                              ? FaFacebookF
                              : platform === "twitter"
                                ? FaXTwitter
                                : platform === "instagram"
                                  ? FaInstagram
                                  : platform === "linkedin"
                                    ? FaLinkedinIn
                                    : platform === "pinterest"
                                      ? FaPinterestP
                                      : FaYoutube;
                          return (
                            <a
                              key={platform}
                              href={link || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isDarkMode ? "bg-white/5 text-white hover:bg-[#d4e157] hover:text-[#0a0e27]" : "bg-gray-100 text-gray-700 hover:bg-emerald-500 hover:text-white"}`}
                            >
                              <Icon className="text-lg" />
                            </a>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurTeam;
