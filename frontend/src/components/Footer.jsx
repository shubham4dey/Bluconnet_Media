import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaRss, // <-- YouTube ki jagah RSS icon add kiya
  FaFacebookF,
  FaXTwitter,
  FaPinterestP,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
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
    },
    {
      icon: FaXTwitter,
      href: "https://x.com/Bluconnet_Media",
      label: "Twitter",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/company/bluconnetmedia/",
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/bluconnet_media/",
      label: "Instagram",
    },
    {
      icon: FaPinterestP,
      href: "https://www.pinterest.com/Bluconnet_Media/",
      label: "Pinterest",
    },
    {
      icon: FaRss, 
      href: "https://bluconnetmedia.com/#/blog", 
      label: "RSS",
    },
  ];

  return (
    <footer
      className={`${isDarkMode ? "bg-[#0a0e27]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Glow Effects - Subtle */}
      <div
        className={`absolute top-0 left-0 w-96 h-96 ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-500/5"} rounded-full blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-500/5"} rounded-full blur-3xl`}
      ></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? "#d4e157" : "#10b981"} 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo & About */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center relative">
                <img
                  src={logo}
                  alt="BluConnet Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-start">
                <h1
                  className={`text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
                >
                  BluConnet
                </h1>
                <p
                  className={`text-sm font-black tracking-[0.18em] uppercase text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-600 to-cyan-600"}`}
                >
                  Media
                </p>
              </div>
            </div>
            <p
              className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-base leading-relaxed mb-8 text-start`}
            >
              At BluConnet Media, we're a vibrant collective of imaginative
              individuals united by a common purpose. With unwavering dedication
              to excellence, we empower individuals and businesses through our
              dynamic products and services.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3 flex-nowrap">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 group ${
                    isDarkMode
                      ? "bg-white/5 hover:bg-gradient-to-br hover:from-[#d4e157] hover:to-[#06b6d4]"
                      : "bg-gray-100 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-cyan-600"
                  }`}
                >
                  <social.icon
                    className={`text-base md:text-lg transition-colors duration-300 ${isDarkMode ? "text-gray-400 group-hover:text-[#0a0e27]" : "text-gray-600 group-hover:text-white"}`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="text-start">
            <h4
              className={`${isDarkMode ? "text-white" : "text-gray-900"} font-bold mb-6 text-base tracking-wider uppercase text-start relative inline-block`}
            >
              Navigation
              <span
                className={`absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
              ></span>
            </h4>
            <ul className="space-y-4 text-start">
              <li>
                <a
                  href="#services"
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ${isDarkMode ? "hover:text-[#d4e157]" : "hover:text-emerald-600"} transition text-base text-start block hover:translate-x-1 transform duration-300`}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/_Case Study.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ${isDarkMode ? "hover:text-[#d4e157]" : "hover:text-emerald-600"} transition text-base text-start block hover:translate-x-1 transform duration-300`}
                >
                  Case Study
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ${isDarkMode ? "hover:text-[#d4e157]" : "hover:text-emerald-600"} transition text-base text-start block hover:translate-x-1 transform duration-300`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Licence */}
          <div className="text-start">
            <h4
              className={`${isDarkMode ? "text-white" : "text-gray-900"} font-bold mb-6 text-base tracking-wider uppercase text-start relative inline-block`}
            >
              Licence
              <span
                className={`absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
              ></span>
            </h4>
            <ul className="space-y-4 text-start">
              <li>
                <Link
                  to="/privacy-policy"
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ${isDarkMode ? "hover:text-[#d4e157]" : "hover:text-emerald-600"} transition text-base text-start block hover:translate-x-1 transform duration-300`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ${isDarkMode ? "hover:text-[#d4e157]" : "hover:text-emerald-600"} transition text-base text-start block hover:translate-x-1 transform duration-300`}
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="text-start">
            <h4
              className={`${isDarkMode ? "text-white" : "text-gray-900"} font-bold mb-6 text-base tracking-wider uppercase text-start relative inline-block`}
            >
              Contact Us
              <span
                className={`absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
              ></span>
            </h4>
            <div className="space-y-6 text-start">
              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div
                  className={`w-9 h-9 ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} rounded-lg flex items-center justify-center flex-shrink-0 transition-all`}
                >
                  <FaPhone
                    className={`${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} text-sm`}
                  />
                </div>
                <a
                  href="tel:+447450635355"
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ${isDarkMode ? "group-hover:text-[#d4e157]" : "group-hover:text-emerald-600"} transition text-base pt-1`}
                >
                  +44 7450635355
                </a>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div
                  className={`w-9 h-9 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-500/10"} rounded-lg flex items-center justify-center flex-shrink-0 transition-all`}
                >
                  <FaEnvelope
                    className={`${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"} text-sm`}
                  />
                </div>
                <a
                  href="mailto:info@bluconnetmedia.com"
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} ${isDarkMode ? "group-hover:text-[#06b6d4]" : "group-hover:text-cyan-600"} transition text-base pt-1`}
                >
                  info@bluconnetmedia.com
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 group">
                <div
                  className={`w-9 h-9 ${isDarkMode ? "bg-orange-500/10" : "bg-orange-500/10"} rounded-lg flex items-center justify-center flex-shrink-0 transition-all`}
                >
                  <FaLocationDot
                    className={`${isDarkMode ? "text-orange-500" : "text-orange-500"} text-sm`}
                  />
                </div>
                <address
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-base not-italic leading-relaxed pt-1`}
                >
                  Shaggy Calf Lane, Slough, Berkshire, SL2 5HP, London, UK
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Divider Line */}
        <div
          className={`w-full h-0.5 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157]/50 via-[#06b6d4]/50 to-[#d4e157]/50" : "from-emerald-500/50 via-cyan-600/50 to-emerald-500/50"} mb-8`}
        ></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-start">
          <div className="flex gap-6 text-base text-start">
            <Link
              to="/privacy-policy"
              className={`${isDarkMode ? "text-gray-500" : "text-gray-500"} ${isDarkMode ? "hover:text-[#d4e157]" : "hover:text-emerald-600"} transition text-start`}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-conditions"
              className={`${isDarkMode ? "text-gray-500" : "text-gray-500"} ${isDarkMode ? "hover:text-[#d4e157]" : "hover:text-emerald-600"} transition text-start`}
            >
              Terms & Conditions
            </Link>
          </div>
          <div
            className={`${isDarkMode ? "text-gray-500" : "text-gray-500"} text-base text-start`}
          >
            © {new Date().getFullYear()} BluConnet Media. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;