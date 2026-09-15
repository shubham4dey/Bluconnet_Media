import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, lang } = useLanguage();

  /* translate known nav labels; unknown names fall back to English */
  const NAV_LABELS = {
    "Home": "nav.home", "About Us": "nav.about", "Our Portfolio": "nav.portfolio",
    "Digital Services": "nav.services", "Blog": "nav.blog", "News": "nav.news",
    "Contact": "nav.contact", "Careers": "nav.careers", "Login": "nav.login",
    "Email Marketing": "services.email", "Lead Generation": "services.lead",
    "Web Development": "services.web", "SEO Marketing": "services.seo",
    "Social Media": "services.social", "Content Marketing": "services.content",
    "Affiliate Marketing": "services.affiliate", "E-Commerce": "services.ecommerce",
    "CRM & Design": "services.crm", "Data Analytics": "services.analytics",
    "Mobile Marketing": "services.mobile", "AI Automation": "services.ai",
  };
  const tt = (name) => name; // runtime DOM engine translates; English stays as authored
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [mobileActiveSubmenu, setMobileActiveSubmenu] = useState(null);

  const isActive = (link) => {
    if (link === "/") return location.pathname === "/";
    return location.pathname.startsWith(link);
  };

  const isDropdownActive = (item) => {
    if (!item.hasDropdown) return false;
    return item.items.some(
      (subItem) =>
        location.pathname === subItem.link ||
        (subItem.hasSubmenu &&
          subItem.submenu.some((nested) => location.pathname === nested.link)),
    );
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // Theme-based classes
  const navBg = scrolled
    ? isDarkMode
      ? "bg-[#0a0e27]/95"
      : "bg-white/95"
    : isDarkMode
      ? "bg-[#0a0e27]/100"
      : "bg-white/100";

  const navBorder = isDarkMode ? "border-[#d4e157]/20" : "border-gray-200";
  const navShadow = isDarkMode ? "shadow-[#d4e157]/5" : "shadow-gray-300/50";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const textMuted = isDarkMode ? "text-gray-400" : "text-gray-600";
  const textGray = isDarkMode ? "text-gray-300" : "text-gray-700";
  const mobileMenuBg = isDarkMode ? "bg-[#0a0e27]/98" : "bg-white/98";
  const dropdownBg = isDarkMode ? "bg-[#0a0e27]/95" : "bg-white/95";
  const borderColor = isDarkMode ? "border-white/5" : "border-gray-100";

  const activeText = isDarkMode ? "text-[#d4e157]" : "text-emerald-600";
  const hoverText = isDarkMode
    ? "group-hover:text-[#d4e157]"
    : "group-hover:text-cyan-600";
  const activeBg = isDarkMode
    ? "from-[#d4e157]/15 to-[#06b6d4]/15"
    : "from-emerald-50 to-cyan-50";
  const hoverBg = isDarkMode
    ? "from-[#d4e157]/10 to-[#06b6d4]/10"
    : "from-emerald-50/50 to-cyan-50/50";
  const gradientLine = isDarkMode
    ? "from-[#d4e157] to-[#06b6d4]"
    : "from-emerald-500 to-cyan-600";
  const gradientText = isDarkMode
    ? "from-[#d4e157] to-[#06b6d4]"
    : "from-emerald-500 to-cyan-600";

  const navItems = [
    { name: "Home", link: "/", hasDropdown: false },
    { name: "About Us", link: "/about", hasDropdown: false },
    { name: "Our Portfolio", link: "/portfolio", hasDropdown: false },
    {
      name: "Digital Services",
      hasDropdown: true,
      items: [
        { name: "Email Marketing", link: "/services/email" },
        { name: "Lead Generation", link: "/services/lead" },
        { name: "Content Marketing", link: "/services/content" },
        { name: "Affiliate Marketing", link: "/services/affiliate" },
        { name: "HTML & WEB App", link: "/services/html" },
        { name: "Social Media Marketing", link: "/services/social" },
        {
          name: "More",
          hasSubmenu: true,
          link: "#",
          submenu: [
            { name: "Web Design & Development", link: "/services/web" },
            { name: "SEO Marketing", link: "/services/seo" },
            { name: "E-Commerce Marketing", link: "/services/ecommerce" },
            { name: "CRM & Graphic Designing", link: "/services/crm" },
            { name: "Data Analytics & Research", link: "/services/analytics" },
            { name: "Mobile Marketing", link: "/services/mobile" },
          ],
        },
      ],
    },
    { name: "Blog", link: "/blog", hasDropdown: false },
    { name: "News", link: "/news", hasDropdown: false },
    { name: "Career", link: "/career", hasDropdown: false },
    { name: "Contact Us", link: "/contact", hasDropdown: false },
    {
      name: "Login Us",
      hasDropdown: true,
      items: [
        {
          name: "Affiliate SignUp",
          link: "https://bluconnet.affise.com/v2/sign/up",
        },
        { name: "Advertiser SignUp", link: "/register" },
        { name: "Admin Panel", link: "/admin-news" }
      ],
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 py-2 sm:py-3 ${navBg} backdrop-blur-xl shadow-2xl ${navShadow} border-b ${navBorder}`}
    >
      {/* Top Gradient Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent ${isDarkMode ? "via-[#d4e157]" : "via-emerald-500"} to-transparent transition-opacity duration-500 ${mobileMenuOpen ? "opacity-100" : "opacity-80"}`}
      ></div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0 mr-4 sm:mr-8 group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center relative">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? "from-[#d4e157]/20 to-[#06b6d4]/20" : "from-emerald-500/20 to-cyan-500/20"} rounded-full blur-xl group-hover:blur-2xl transition-all duration-300`}
              ></div>
              <img
                src={logo}
                alt="BluConnet Logo"
                className="w-full h-full object-contain relative z-10"
              />
            </div>
            <div className="text-left">
              <h1
                className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r ${gradientText}`}
              >
                BluConnet
              </h1>
              <p
                className={`text-[10px] sm:text-xs md:text-sm font-black tracking-[0.15em] sm:tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r ${
                  isDarkMode
                    ? "from-[#d4e157] to-[#06b6d4]"
                    : "from-emerald-600 to-cyan-600"
                }`}
              >
                Media
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className={`hidden lg:flex items-center justify-between ${lang === "de" || lang === "fr" || lang === "es" ? "gap-1 xl:gap-2" : "gap-0.5 xl:gap-1"} ml-auto grow min-w-0`}>
            {navItems.map((item, index) => {
              const active = isActive(item.link) || isDropdownActive(item);

              return (
                <div
                  key={index}
                  className="relative min-w-0"
                  onMouseEnter={() =>
                    item.hasDropdown && setActiveDropdown(index)
                  }
                  onMouseLeave={() => {
                    setActiveDropdown(null);
                    setActiveSubmenu(null);
                  }}
                >
                  <Link
                    to={item.link || "#"}
                    className={`relative px-2 lg:px-3 xl:px-4 py-2 text-[11px] lg:text-xs xl:text-sm font-bold uppercase tracking-wider rounded-lg overflow-hidden group flex items-center justify-center whitespace-nowrap transition-colors duration-300 ${active ? activeText : textColor} ${hoverText}`}
                  >
                    {active && (
                      <span
                        className={`absolute inset-0 bg-gradient-to-r rounded-lg ${activeBg}`}
                      />
                    )}
                    <span
                      className={`absolute inset-0 bg-gradient-to-r ${hoverBg} rounded-lg transition-all duration-300 ease-out ${activeDropdown === index ? "scale-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"}`}
                      style={{ transformOrigin: "center" }}
                    />
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradientLine} transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                    ></span>

                    <span className="relative z-10 flex items-center space-x-1 lg:space-x-2">
                      <span className="min-w-0 truncate">{tt(item.name)}</span>
                      {item.hasDropdown && (
                        <FaChevronDown
                          size={10}
                          className={`shrink-0 transition-transform duration-300 ${activeDropdown === index ? "rotate-180" : ""}`}
                        />
                      )}
                    </span>
                  </Link>

                  <AnimatePresence>
                    {activeDropdown === index && item.hasDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 ${dropdownBg} backdrop-blur-xl border ${isDarkMode ? "border-[#d4e157]/20" : "border-gray-200"} rounded-xl sm:rounded-2xl shadow-2xl ${isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"} min-w-[220px] sm:min-w-[260px] py-2 z-50`}
                        onMouseEnter={() => setActiveDropdown(index)}
                        onMouseLeave={() => {
                          setActiveDropdown(null);
                          setActiveSubmenu(null);
                        }}
                      >
                        <div
                          className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradientLine}`}
                        ></div>
                        <div
                          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none ${isDarkMode ? "bg-emerald-500/5" : "bg-emerald-500/10"}`}
                        ></div>

                        {item.items.map((subItem, subIndex) => {
                          const subActive =
                            location.pathname === subItem.link ||
                            (subItem.hasSubmenu &&
                              subItem.submenu.some(
                                (nested) => location.pathname === nested.link,
                              ));

                          return (
                            <div
                              key={subIndex}
                              className="relative"
                              onMouseEnter={() =>
                                subItem.hasSubmenu && setActiveSubmenu(subIndex)
                              }
                              onMouseLeave={() => setActiveSubmenu(null)}
                            >
                              <Link
                                to={subItem.link || "#"}
                                className={`flex items-center justify-between px-4 sm:px-5 py-3 text-sm font-semibold transition-all duration-200 group/item relative overflow-hidden ${
                                  subActive
                                    ? isDarkMode
                                      ? "text-[#d4e157] bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10"
                                      : "text-emerald-600 bg-gradient-to-r from-emerald-50 to-cyan-50"
                                    : textGray
                                } ${isDarkMode ? "hover:text-white" : "hover:text-gray-900"}`}
                              >
                                <span
                                  className={`absolute inset-0 bg-gradient-to-r ${hoverBg} scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left`}
                                ></span>
                                <span
                                  className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b ${gradientLine} transition-transform duration-300 ${subActive ? "scale-y-100" : "scale-y-0 group-hover/item:scale-y-100"}`}
                                ></span>

                                <span className="relative z-10 flex items-center gap-2">
                                  <span>{tt(subItem.name)}</span>
                                </span>

                                {subItem.hasSubmenu && (
                                  <FaChevronRight
                                    size={12}
                                    className={`relative z-10 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} group-hover/item:translate-x-1 transition-transform`}
                                  />
                                )}
                              </Link>

                              {subItem.hasSubmenu &&
                                activeSubmenu === subIndex && (
                                  <motion.div
                                    initial={{
                                      opacity: 0,
                                      x: -10,
                                      scale: 0.95,
                                    }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                                    transition={{
                                      duration: 0.2,
                                      ease: "easeOut",
                                    }}
                                    className={`absolute left-full top-0 ml-1 sm:ml-2 ${dropdownBg} backdrop-blur-xl border ${isDarkMode ? "border-[#06b6d4]/20" : "border-gray-200"} rounded-xl sm:rounded-2xl shadow-2xl ${isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"} min-w-[220px] sm:min-w-[260px] py-2 z-50`}
                                    onMouseEnter={() =>
                                      setActiveSubmenu(subIndex)
                                    }
                                    onMouseLeave={() => setActiveSubmenu(null)}
                                  >
                                    <div
                                      className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${isDarkMode ? "from-[#06b6d4] to-[#d4e157]" : "from-cyan-600 to-emerald-500"}`}
                                    ></div>
                                    <div
                                      className={`absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl pointer-events-none ${isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-500/10"}`}
                                    ></div>

                                    {subItem.submenu.map(
                                      (nestedItem, nestedIndex) => {
                                        const nestedActive =
                                          location.pathname === nestedItem.link;
                                        return (
                                          <Link
                                            key={nestedIndex}
                                            to={nestedItem.link}
                                            className={`flex items-center px-4 sm:px-5 py-3 text-sm font-semibold transition-all duration-200 group/nested relative overflow-hidden ${
                                              nestedActive
                                                ? isDarkMode
                                                  ? "text-[#d4e157] bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10"
                                                  : "text-emerald-600 bg-gradient-to-r from-emerald-50 to-cyan-50"
                                                : textGray
                                            } ${isDarkMode ? "hover:text-white" : "hover:text-gray-900"}`}
                                          >
                                            <span
                                              className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? "from-[#06b6d4]/10 to-[#d4e157]/10" : "from-cyan-50/50 to-emerald-50/50"} scale-x-0 group-hover/nested:scale-x-100 transition-transform duration-300 origin-left`}
                                            ></span>
                                            <span
                                              className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b ${isDarkMode ? "from-[#06b6d4] to-[#d4e157]" : "from-cyan-600 to-emerald-500"} transition-transform duration-300 ${nestedActive ? "scale-y-100" : "scale-y-0 group-hover/nested:scale-y-100"}`}
                                            ></span>
                                            <span className="relative z-10">
                                              {tt(nestedItem.name)}
                                            </span>
                                          </Link>
                                        );
                                      },
                                    )}
                                  </motion.div>
                                )}

                              {subIndex < item.items.length - 1 && (
                                <div
                                  className={`border-t ${borderColor} mx-4`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Desktop controls — LanguageSelector + theme toggle stay pinned at the right edge. For de/fr/es (longer nav text) extra gap (gap-1 xl:gap-2) is applied so items never overlap or touch; en/it/pt keep the original gap-0.5 xl:gap-1 unchanged. */}
            <div className="shrink-0 flex items-center">
              <LanguageSelector />

              {/* Desktop Theme Toggle */}
              <label className="switch ml-2 xl:ml-3 scale-90 xl:scale-100 origin-right">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                />
                <span className="slider"></span>
                <span className="decoration"></span>
              </label>
            </div>
          </div>

          {/* Language selector - tablet/mobile */}
          <div className="hidden sm:block lg:hidden shrink-0 mr-1 scale-90 origin-right">
            <LanguageSelector />
          </div>

          {/* Theme Toggle Button - Mobile */}
          <div className="lg:hidden flex items-center shrink-0 mr-2 sm:mr-3 scale-75 sm:scale-100 origin-right">
            <label className="switch">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
              <span className="decoration"></span>
            </label>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileActiveDropdown(null);
              setMobileActiveSubmenu(null);
            }}
            className="lg:hidden relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl group"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-xl sm:rounded-2xl p-[2px]"
            >
              <div
                className={`w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] via-[#06b6d4] to-[#d4e157]" : "from-emerald-500 via-cyan-600 to-emerald-500"} opacity-60`}
              ></div>
            </motion.div>

            <motion.div
              animate={{
                background: mobileMenuOpen
                  ? "linear-gradient(135deg, rgba(212, 225, 87, 0.2), rgba(6, 182, 212, 0.2))"
                  : isDarkMode
                    ? "rgba(10, 14, 39, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-[2px] rounded-xl sm:rounded-2xl"
            />

            <motion.div
              animate={{
                scale: mobileMenuOpen ? [1, 1.2, 1] : 1,
                opacity: mobileMenuOpen ? [0.3, 0, 0.3] : 0,
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-[#d4e157]/40"
            />

            <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex flex-col items-center justify-center gap-1 sm:gap-1.5 z-10">
              <motion.span
                animate={{
                  rotate: mobileMenuOpen ? 45 : 0,
                  y: mobileMenuOpen ? (window.innerWidth < 640 ? 6 : 7) : 0,
                  width: mobileMenuOpen ? "24px" : "20px",
                  backgroundColor: mobileMenuOpen
                    ? "#d4e157"
                    : isDarkMode
                      ? "#ffffff"
                      : "#0a0e27",
                  boxShadow: mobileMenuOpen
                    ? "0 0 12px rgba(212, 225, 87, 0.8)"
                    : "none",
                }}
                transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
                className="block h-[2px] rounded-full"
              />
              <motion.span
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  scale: mobileMenuOpen ? 0 : 1,
                  backgroundColor: mobileMenuOpen
                    ? "#06b6d4"
                    : isDarkMode
                      ? "#ffffff"
                      : "#0a0e27",
                }}
                transition={{ duration: 0.2 }}
                className="block w-5 sm:w-6 h-[2px] rounded-full"
              />
              <motion.span
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? (window.innerWidth < 640 ? -6 : -7) : 0,
                  width: mobileMenuOpen ? "24px" : "20px",
                  backgroundColor: mobileMenuOpen
                    ? "#d4e157"
                    : isDarkMode
                      ? "#ffffff"
                      : "#0a0e27",
                  boxShadow: mobileMenuOpen
                    ? "0 0 12px rgba(212, 225, 87, 0.8)"
                    : "none",
                }}
                transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
                className="block h-[2px] rounded-full"
              />
            </div>

            <motion.div
              animate={{
                opacity: mobileMenuOpen ? 1 : 0,
                scale: mobileMenuOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"
            />
            <motion.div
              animate={{
                opacity: mobileMenuOpen ? 1 : 0,
                scale: mobileMenuOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-[#06b6d4] rounded-full"
            />
            <motion.div
              whileHover={{ opacity: 1 }}
              className="absolute -inset-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#d4e157]/20 to-[#06b6d4]/20 blur-xl opacity-0 transition-opacity duration-300 -z-10"
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`lg:hidden ${mobileMenuBg} backdrop-blur-xl border-t ${navBorder} overflow-hidden`}
          >
            <div
              className={`h-1 bg-gradient-to-r from-transparent ${isDarkMode ? "via-[#d4e157]" : "via-emerald-500"} to-transparent`}
            ></div>

            <div className="max-h-[80vh] sm:max-h-[85vh] overflow-y-auto px-4 sm:px-5 py-4 sm:py-5 space-y-2">
              {navItems.map((item, index) => {
                const mobileActive =
                  isActive(item.link) || isDropdownActive(item);

                return (
                  <div key={index}>
                    {item.hasDropdown ? (
                      <button
                        className={`w-full flex items-center justify-between py-3 sm:py-4 px-3 sm:px-4 font-semibold sm:font-bold text-sm sm:text-base tracking-wide rounded-lg sm:rounded-xl transition-all duration-300 ${
                          mobileActive
                            ? isDarkMode
                              ? "text-[#d4e157] bg-gradient-to-r from-[#d4e157]/15 to-[#06b6d4]/15 border border-[#d4e157]/30"
                              : "text-emerald-600 bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"
                            : isDarkMode
                              ? "text-white hover:bg-gradient-to-r hover:from-[#d4e157]/10 hover:to-[#06b6d4]/10 border border-transparent hover:border-[#d4e157]/20"
                              : "text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                        }`}
                        onClick={() =>
                          setMobileActiveDropdown(
                            mobileActiveDropdown === index ? null : index,
                          )
                        }
                      >
                        <span>{tt(item.name)}</span>
                        <motion.div
                          animate={{
                            rotate: mobileActiveDropdown === index ? 180 : 0,
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <FaChevronDown size={14} className={textMuted} />
                        </motion.div>
                      </button>
                    ) : (
                      <Link
                        to={item.link}
                        className={`w-full flex items-center py-3 sm:py-4 px-3 sm:px-4 font-semibold sm:font-bold text-sm sm:text-base tracking-wide rounded-lg sm:rounded-xl transition-all duration-300 ${
                          mobileActive
                            ? isDarkMode
                              ? "text-[#d4e157] bg-gradient-to-r from-[#d4e157]/15 to-[#06b6d4]/15 border-l-4 border-[#d4e157]"
                              : "text-emerald-600 bg-gradient-to-r from-emerald-50 to-cyan-50 border-l-4 border-emerald-500"
                            : isDarkMode
                              ? "text-white hover:bg-gradient-to-r hover:from-[#d4e157]/10 hover:to-[#06b6d4]/10"
                              : "text-gray-900 hover:bg-gray-100"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {mobileActive && (
                          <span
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradientLine} mr-3`}
                          ></span>
                        )}
                        {tt(item.name)}
                      </Link>
                    )}

                    <AnimatePresence>
                      {mobileActiveDropdown === index && item.hasDropdown && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div
                            className={`ml-4 sm:ml-5 border-l-2 ${isDarkMode ? "border-[#d4e157]/40" : "border-emerald-500/40"} pl-4 sm:pl-5 space-y-1.5 pb-3 pt-2`}
                          >
                            {item.items.map((subItem, subIndex) => {
                              const subMobileActive =
                                location.pathname === subItem.link ||
                                (subItem.hasSubmenu &&
                                  subItem.submenu.some(
                                    (nested) =>
                                      location.pathname === nested.link,
                                  ));

                              return (
                                <div key={subIndex}>
                                  {subItem.hasSubmenu ? (
                                    <button
                                      className={`flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-md sm:rounded-lg transition-all duration-200 w-full ${
                                        subMobileActive
                                          ? isDarkMode
                                            ? "text-[#d4e157] bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10"
                                            : "text-emerald-600 bg-gradient-to-r from-emerald-50 to-cyan-50"
                                          : isDarkMode
                                            ? "text-gray-200 hover:text-[#d4e157] hover:bg-[#d4e157]/5"
                                            : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                                      }`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setMobileActiveSubmenu(
                                          mobileActiveSubmenu === subIndex
                                            ? null
                                            : subIndex,
                                        );
                                      }}
                                    >
                                      <span>{tt(subItem.name)}</span>
                                      <motion.div
                                        animate={{
                                          rotate:
                                            mobileActiveSubmenu === subIndex
                                              ? 180
                                              : 0,
                                        }}
                                        transition={{
                                          duration: 0.3,
                                          ease: "easeInOut",
                                        }}
                                      >
                                        <FaChevronDown
                                          size={14}
                                          className={
                                            isDarkMode
                                              ? "text-[#d4e157]"
                                              : "text-emerald-600"
                                          }
                                        />
                                      </motion.div>
                                    </button>
                                  ) : (
                                    <Link
                                      to={subItem.link}
                                      className={`flex items-center py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-md sm:rounded-lg transition-all duration-200 ${
                                        subMobileActive
                                          ? isDarkMode
                                            ? "text-[#d4e157] bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 font-bold"
                                            : "text-emerald-600 bg-gradient-to-r from-emerald-50 to-cyan-50 font-bold"
                                          : isDarkMode
                                            ? "text-gray-200 hover:text-[#d4e157] hover:bg-[#d4e157]/5"
                                            : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                                      }`}
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {subMobileActive && (
                                        <span
                                          className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradientLine} mr-2`}
                                        ></span>
                                      )}
                                      {tt(subItem.name)}
                                    </Link>
                                  )}

                                  {subItem.hasSubmenu && (
                                    <AnimatePresence>
                                      {mobileActiveSubmenu === subIndex && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{
                                            duration: 0.35,
                                            ease: "easeInOut",
                                          }}
                                          className="overflow-hidden"
                                        >
                                          <div
                                            className={`ml-4 sm:ml-5 border-l-2 ${isDarkMode ? "border-[#06b6d4]/40" : "border-cyan-500/40"} pl-4 sm:pl-5 space-y-1.5 py-2`}
                                          >
                                            {subItem.submenu.map(
                                              (nestedItem, nestedIndex) => {
                                                const nestedMobileActive =
                                                  location.pathname ===
                                                  nestedItem.link;
                                                return (
                                                  <Link
                                                    key={nestedIndex}
                                                    to={nestedItem.link}
                                                    className={`block py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base rounded-md sm:rounded-lg transition-all duration-200 text-start ${
                                                      nestedMobileActive
                                                        ? isDarkMode
                                                          ? "text-[#d4e157] bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 font-bold"
                                                          : "text-emerald-600 bg-gradient-to-r from-emerald-50 to-cyan-50 font-bold"
                                                        : isDarkMode
                                                          ? "text-gray-300 hover:text-[#06b6d4] hover:bg-[#06b6d4]/5"
                                                          : "text-gray-600 hover:text-cyan-600 hover:bg-cyan-50"
                                                    }`}
                                                    onClick={() =>
                                                      setMobileMenuOpen(false)
                                                    }
                                                  >
                                                    {nestedMobileActive && (
                                                      <span
                                                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradientLine} inline-block mr-2`}
                                                      ></span>
                                                    )}
                                                    {tt(nestedItem.name)}
                                                  </Link>
                                                );
                                              },
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Language selector - mobile/tablet menu footer.
                Always visible below the scrollable nav list so it never
                scrolls away. Shares LanguageContext with the desktop navbar
                and tablet header selector, so the chosen language stays in
                sync across every breakpoint and layout. */}
            <div
              className={`mx-4 sm:mx-5 mb-4 sm:mb-5 pt-3 sm:pt-4 border-t ${borderColor} flex items-center justify-between gap-3`}
            >
              <span
                className={`text-[10.5px] sm:text-xs font-bold uppercase tracking-wider ${textMuted}`}
              >
                Language
              </span>
              <LanguageSelector />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;