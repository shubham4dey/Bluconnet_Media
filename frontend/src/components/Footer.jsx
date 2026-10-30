import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaRss,
  FaFacebookF,
  FaXTwitter,
  FaPinterestP,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaUsers,
} from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/img/logo.png";

const Footer = () => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/bluconnet",
      label: "Facebook",
      color: "text-[#1877F2]",
      tooltipColor: "bg-[#1877F2]",
      arrowColor: "border-t-[#1877F2]",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/Bluconnet_Media",
      label: "X / Twitter",
      color: isDarkMode ? "text-white" : "text-black",
      tooltipColor: "bg-black",
      arrowColor: "border-t-black",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/company/bluconnetmedia/",
      label: "LinkedIn",
      color: "text-[#0A66C2]",
      tooltipColor: "bg-[#0A66C2]",
      arrowColor: "border-t-[#0A66C2]",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/bluconnet_media/",
      label: "Instagram",
      color: "text-[#E4405F]",
      tooltipColor: "bg-[#E4405F]",
      arrowColor: "border-t-[#E4405F]",
    },
    {
      icon: FaPinterestP,
      href: "https://www.pinterest.com/Bluconnet_Media/",
      label: "Pinterest",
      color: "text-[#E60023]",
      tooltipColor: "bg-[#E60023]",
      arrowColor: "border-t-[#E60023]",
    },
    {
      icon: FaRss,
      href: "https://bluconnetmedia.com/blog",
      label: "RSS",
      color: "text-[#F26522]",
      tooltipColor: "bg-[#F26522]",
      arrowColor: "border-t-[#F26522]",
    },
  ];

  const headingClass = `
    ${isDarkMode ? "text-white" : "text-gray-900"}
    font-bold
    text-[15px]
    md:text-base
    tracking-wider
    uppercase
    relative
    inline-block
  `;

  const headingLineClass = `
    absolute
    -bottom-1
    left-0
    w-12
    h-0.5
    bg-gradient-to-r
    ${
      isDarkMode
        ? "from-[#d4e157] to-[#06b6d4]"
        : "from-emerald-500 to-cyan-600"
    }
  `;

  const linkClass = `
    ${isDarkMode ? "text-gray-400" : "text-gray-600"}
    ${isDarkMode ? "hover:text-[#d4e157]" : "hover:text-emerald-600"}
    transition-all
    duration-300
    text-[15px]
    md:text-base
    block
    hover:translate-x-1
  `;

  const normalTextClass = `
    ${isDarkMode ? "text-gray-400" : "text-gray-600"}
    text-[15px]
    md:text-base
  `;

  return (
    <footer
      className={`${
        isDarkMode ? "bg-[#0a0e27]" : "bg-white"
      } relative overflow-hidden transition-colors duration-500`}
    >
      {/* =========================================================
          BACKGROUND GLOW EFFECTS
      ========================================================= */}

      <div
        className={`absolute top-0 left-0 w-96 h-96 ${
          isDarkMode ? "bg-emerald-500/10" : "bg-emerald-500/5"
        } rounded-full blur-3xl pointer-events-none`}
      />

      <div
        className={`absolute bottom-0 right-0 w-96 h-96 ${
          isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-500/5"
        } rounded-full blur-3xl pointer-events-none`}
      />

      {/* =========================================================
          SUBTLE GRID
      ========================================================= */}

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode ? "#d4e157" : "#10b981"
          } 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* =======================================================
            MAIN FOOTER CONTENT
        ======================================================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-[3.4fr_1.7fr_1.7fr_1.7fr_2.5fr]
            gap-x-8
            xl:gap-x-10
            gap-y-12
            mb-14
          "
        >
          {/* =====================================================
              COLUMN 1 — BRAND / ABOUT
          ===================================================== */}

          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center relative flex-shrink-0">
                <img
                  src={logo}
                  alt="BluConnet Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-start">
                <h1
                  className={`text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  }`}
                >
                  BluConnet
                </h1>

                <p
                  className={`text-sm font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-600 to-cyan-600"
                  }`}
                >
                  Media
                </p>
              </div>
            </div>

            {/* About */}
            <p
              className={`${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              } text-[15px] md:text-base leading-7 max-w-[390px] mb-8 text-start`}
            >
              At BluConnet Media, we're a vibrant collective of imaginative
              individuals united by a common purpose. With unwavering dedication
              to excellence, we empower individuals and businesses through our
              dynamic products and services.
            </p>

            {/* =====================================================
                SOCIAL ICONS
            ===================================================== */}

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 group ${
                    isDarkMode ? "bg-white/5" : "bg-gray-100"
                  }`}
                >
                  {/* Tooltip */}
                  <span
                    className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold text-white shadow-lg opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50 ${social.tooltipColor}`}
                  >
                    {social.label}

                    {/* Tooltip Arrow */}
                    <span
                      className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${social.arrowColor}`}
                    />
                  </span>

                  {/* Social Icon */}
                  <social.icon
                    className={`${social.color} text-base md:text-lg transition-transform duration-300 group-hover:scale-110`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* =====================================================
              COLUMN 2 — NAVIGATION
          ===================================================== */}

          <div className="text-start">
            <h4 className={headingClass}>
              Navigation
              <span className={headingLineClass}></span>
            </h4>

            <ul className="space-y-4 mt-6">
              <li>
                <Link to="/digitalservices" className={linkClass}>
                  Services
                </Link>
              </li>

              <li>
                <a
                  href="/_Case Study.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Case Study
                </a>
              </li>

              <li>
                <Link to="/services/affiliate" className={linkClass}>
                  Affiliate Marketing
                </Link>
              </li>

              <li>
                <Link to="/services/email" className={linkClass}>
                  E-Mail Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* =====================================================
              COLUMN 3 — LICENCE
          ===================================================== */}

          <div className="text-start">
            <h4 className={headingClass}>
              Licence
              <span className={headingLineClass}></span>
            </h4>

            <ul className="space-y-4 mt-6">

               <li>
                <Link to="/blog" className={linkClass}>
                  Blogs
                </Link>
              </li>

              <li>
                <Link to="/news" className={linkClass}>
                  News
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className={linkClass}>
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link to="/terms-conditions" className={linkClass}>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* =====================================================
              COLUMN 4 — INDUSTRIES
          ===================================================== */}

          <div className="text-start">
            <h4 className={headingClass}>
              Industries
              <span className={headingLineClass}></span>
            </h4>

            <ul className="space-y-4 mt-6">
              <li>
                <Link to="/digitalservices" className={linkClass}>
                  Fintech
                </Link>
              </li>

              <li>
                <Link to="/digitalservices" className={linkClass}>
                  Finance
                </Link>
              </li>

              <li>
                <Link to="/digitalservices" className={linkClass}>
                  Home Improvement
                </Link>
              </li>

              <li>
                <Link to="/digitalservices" className={linkClass}>
                  Healthcare
                </Link>
              </li>

              <li>
                <Link to="/digitalservices" className={linkClass}>
                  Automobile
                </Link>
              </li>
            </ul>
          </div>

          {/* =====================================================
              COLUMN 5 — CONTACT
          ===================================================== */}

          <div className="text-start min-w-0">
            <h4 className={headingClass}>
              Contact Us
              <span className={headingLineClass}></span>
            </h4>

            <div className="space-y-5 mt-6">
              {/* PHONE */}
              <div className="flex items-center gap-3 group min-w-0">
                <div
                  className={`w-10 h-10 ${
                    isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"
                  } rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105`}
                >
                  <FaPhone
                    className={`${
                      isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                    } text-sm`}
                  />
                </div>

                <a
                  href="tel:+447450635355"
                  className={`${
                    isDarkMode
                      ? "text-gray-400 group-hover:text-[#d4e157]"
                      : "text-gray-600 group-hover:text-emerald-600"
                  } transition-colors duration-300 text-[15px] md:text-base whitespace-nowrap`}
                >
                  +44 7450635355
                </a>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3 group min-w-0">
                <div
                  className={`w-10 h-10 ${
                    isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-500/10"
                  } rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105`}
                >
                  <FaEnvelope
                    className={`${
                      isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"
                    } text-sm`}
                  />
                </div>

                <a
                  href="mailto:info@bluconnetmedia.com"
                  className={`${
                    isDarkMode
                      ? "text-gray-400 group-hover:text-[#06b6d4]"
                      : "text-gray-600 group-hover:text-cyan-600"
                  } transition-colors duration-300 text-[15px] md:text-base whitespace-nowrap`}
                >
                  info@bluconnetmedia.com
                </a>
              </div>

              {/* ADDRESS */}
              <div className="flex items-start gap-3 group min-w-0">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                  <FaLocationDot className="text-orange-500 text-sm" />
                </div>

                <address
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } text-[15px] md:text-base not-italic leading-6 pt-1 max-w-[250px]`}
                >
                  Shaggy Calf Lane, Slough,
                  <br />
                  Berkshire, SL2 5HP,
                  <br />
                  London, UK
                </address>
              </div>

              {/* JOIN US */}
              <Link
                to="/contact"
                className={`flex items-center gap-3 group min-w-0 transition-all duration-300 ${
                  isDarkMode
                    ? "text-gray-400 hover:text-[#d4e157]"
                    : "text-gray-600 hover:text-emerald-600"
                }`}
              >
                <div
                  className={`w-10 h-10 ${
                    isDarkMode
                      ? "bg-[#d4e157]/10 group-hover:bg-[#d4e157]/20"
                      : "bg-emerald-500/10 group-hover:bg-emerald-500/20"
                  } rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105`}
                >
                  <FaUsers
                    className={`${
                      isDarkMode
                        ? "text-gray-400 group-hover:text-[#d4e157]"
                        : "text-gray-600 group-hover:text-emerald-600"
                    } text-sm transition-colors duration-300`}
                  />
                </div>

                <span className="text-[15px] md:text-base transition-colors duration-300">
                  Join Us
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================
            GRADIENT DIVIDER
        ========================================================= */}

        <div
          className={`w-full h-px bg-gradient-to-r ${
            isDarkMode
              ? "from-[#d4e157]/50 via-[#06b6d4]/50 to-[#d4e157]/50"
              : "from-emerald-500/50 via-cyan-600/50 to-emerald-500/50"
          } mb-8`}
        />

        {/* =========================================================
            BOTTOM BAR
        ========================================================= */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-[14px] md:text-base">
            <Link
              to="/privacy-policy"
              className={`${
                isDarkMode
                  ? "text-gray-500 hover:text-[#d4e157]"
                  : "text-gray-500 hover:text-emerald-600"
              } transition-colors duration-300`}
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms-conditions"
              className={`${
                isDarkMode
                  ? "text-gray-500 hover:text-[#d4e157]"
                  : "text-gray-500 hover:text-emerald-600"
              } transition-colors duration-300`}
            >
              Terms & Conditions
            </Link>
          </div>

          <div
            className={`${
              isDarkMode ? "text-gray-500" : "text-gray-500"
            } text-[14px] md:text-base text-center md:text-right`}
          >
            © {new Date().getFullYear()} BluConnet Media. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;