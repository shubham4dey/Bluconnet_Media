import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const ContactHome = () => {
  const { isDarkMode } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    helpWith: "",
    country: "",
    message: "",
    hearAbout: "",
    agreeToContact: false,
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thanks! We'll be in touch soon.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      helpWith: "",
      country: "",
      message: "",
      hearAbout: "",
      agreeToContact: false,
    });
  };

  const helpOptions = [
    "Affiliate program management services",
    "Consulting / Project work",
    "Influencer program management",
    "360 partnership marketing services",
    "Business partnership opportunities",
    "Publisher or affiliate opportunities",
  ];

  const countries = [
    "United States",
    "United Kingdom",
    "India",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Singapore",
    "UAE",
    "South Africa",
  ];

  const theme = {
    bg: isDarkMode ? "bg-[#050508]" : "bg-white",
    cardBg: isDarkMode ? "bg-[#0f1535]/80" : "bg-white/80",
    borderColor: isDarkMode ? "border-white/10" : "border-gray-200",
    text: isDarkMode ? "text-white" : "text-gray-900",
    muted: isDarkMode ? "text-gray-400" : "text-gray-600",
    inputBg: isDarkMode ? "bg-white/5" : "bg-gray-50",
    gradientText: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",
    gradientBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",
    btnText: isDarkMode ? "text-[#0a0e27]" : "text-white",
    focusRing: isDarkMode
      ? "focus:ring-[#06b6d4]/50"
      : "focus:ring-emerald-500/50",
    focusBorder: isDarkMode
      ? "focus:border-[#06b6d4]"
      : "focus:border-emerald-500",
  };

  return (
    <section
      className={`py-24 px-4 relative overflow-hidden ${theme.bg} transition-colors duration-500`}
    >
      {/* Background Glows */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-r ${isDarkMode ? "from-[#d4e157]/10 to-[#06b6d4]/10" : "from-emerald-500/10 to-cyan-600/10"} rounded-full blur-[120px] pointer-events-none`}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className={`${theme.cardBg} backdrop-blur-2xl rounded-3xl p-8 md:p-12 border ${theme.borderColor} shadow-2xl text-center`}
        >
          <h2 className={`text-3xl md:text-5xl font-black ${theme.text} mb-4`}>
            Ready to{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
            >
              Scale Up?
            </span>
          </h2>
          <p className={`${theme.muted} text-lg mb-10 max-w-2xl mx-auto`}>
            Drop us a quick message. Our team will get back to you within 24
            hours.
          </p>

          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto space-y-5 text-left"
          >
            {/* Row 1: First Name & Last Name */}
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                required
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-5 py-4 ${theme.inputBg} ${theme.text} border ${theme.borderColor} rounded-xl focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all placeholder-gray-500`}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                required
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-5 py-4 ${theme.inputBg} ${theme.text} border ${theme.borderColor} rounded-xl focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all placeholder-gray-500`}
              />
            </div>

            {/* Row 2: Email & Company Name */}
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="email"
                name="email"
                placeholder="Email *"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-5 py-4 ${theme.inputBg} ${theme.text} border ${theme.borderColor} rounded-xl focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all placeholder-gray-500`}
              />
              <input
                type="text"
                name="companyName"
                placeholder="Company Name *"
                required
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full px-5 py-4 ${theme.inputBg} ${theme.text} border ${theme.borderColor} rounded-xl focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all placeholder-gray-500`}
              />
            </div>

            {/* Row 3: Help With & Country */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative">
                <select
                  name="helpWith"
                  value={formData.helpWith}
                  onChange={handleChange}
                  required
                  className={`w-full px-5 py-4 ${theme.inputBg} ${theme.text} border ${theme.borderColor} rounded-xl focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all appearance-none cursor-pointer`}
                >
                  <option
                    value=""
                    disabled
                    className={
                      isDarkMode
                        ? "bg-[#0f1535] text-gray-500"
                        : "bg-white text-gray-500"
                    }
                  >
                    What Can We Help With? *
                  </option>
                  {helpOptions.map((option, idx) => (
                    <option
                      key={idx}
                      value={option}
                      className={
                        isDarkMode
                          ? "bg-[#0f1535] text-white"
                          : "bg-white text-gray-900"
                      }
                    >
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className={`w-full px-5 py-4 ${theme.inputBg} ${theme.text} border ${theme.borderColor} rounded-xl focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all appearance-none cursor-pointer`}
                >
                  <option
                    value=""
                    disabled
                    className={
                      isDarkMode
                        ? "bg-[#0f1535] text-gray-500"
                        : "bg-white text-gray-500"
                    }
                  >
                    What Country Are You Located In? *
                  </option>
                  {countries.map((country, idx) => (
                    <option
                      key={idx}
                      value={country}
                      className={
                        isDarkMode
                          ? "bg-[#0f1535] text-white"
                          : "bg-white text-gray-900"
                      }
                    >
                      {country}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 4: Message */}
            <textarea
              name="message"
              placeholder="Your Message"
              rows="3"
              required
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-5 py-4 ${theme.inputBg} ${theme.text} border ${theme.borderColor} rounded-xl focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all placeholder-gray-500 resize-none`}
            ></textarea>

            {/* Row 5: Hear About */}
            <input
              type="text"
              name="hearAbout"
              placeholder="How Did You Hear About Us?"
              value={formData.hearAbout}
              onChange={handleChange}
              className={`w-full px-5 py-4 ${theme.inputBg} ${theme.text} border ${theme.borderColor} rounded-xl focus:outline-none focus:ring-2 ${theme.focusRing} ${theme.focusBorder} transition-all placeholder-gray-500`}
            />

            {/* Row 6: Checkbox Agreement */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                name="agreeToContact"
                checked={formData.agreeToContact}
                onChange={handleChange}
                required
                className={`mt-1 w-5 h-5 flex-shrink-0 rounded border-gray-300 cursor-pointer ${isDarkMode ? "accent-[#d4e157] focus:ring-[#d4e157] bg-white/5" : "accent-emerald-500 focus:ring-emerald-500"}`}
              />
              <label
                className={`${theme.muted} text-sm leading-relaxed cursor-pointer text-left flex-1`}
              >
                <span className="text-red-500">*</span> I agree to be contacted
                by Acceleration Partners and receive news and other promotional
                materials. For more information, please view our{" "}
                <Link
                  to="/privacy-policy"
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText} hover:underline font-semibold`}
                >
                  privacy policy
                </Link>
                .
              </label>
            </div>

            {/* ===== PREMIUM STYLISH SUBMIT BUTTON ===== */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden group w-full py-4 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
              }`}
            >
              {/* Animated Shine/Sweep Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />

              <span className="relative z-20 flex items-center gap-3">
                Send Message
                <FaPaperPlane className="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactHome;
