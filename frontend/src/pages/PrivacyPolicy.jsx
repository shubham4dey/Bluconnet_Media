import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaEnvelope,
  FaChevronRight,
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const PrivacyPolicy = () => {
  const { isDarkMode } = useTheme();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto";
  }, []);

  const theme = {
    bg: isDarkMode ? "bg-[#050508]" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    muted: isDarkMode ? "text-gray-400" : "text-gray-600",
    gradientText: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-500 to-cyan-600",
    cardBg: isDarkMode ? "bg-white/5" : "bg-gray-50",
    borderColor: isDarkMode ? "border-white/10" : "border-gray-200",
  };

  const sections = [
    {
      id: "info-collect",
      title: "1: Information We Collect from You",
      content: [
        {
          subtitle: "a) Information You Provide",
          text: "When you interact with our website (www.bluconnetmedia.com) or reach out via phone, email, or other communication methods, we collect personal data that you voluntarily submit. This may include:",
          list: [
            "Name",
            "Email address",
            "Contact number",
            "Instant messenger details",
            "Messages or inquiries",
          ],
          note: "All personal data shared with BluConnet Media is handled in strict accordance with the Data Protection Acts. While providing this information is optional, opting not to do so may limit your ability to engage with our network.",
        },
        {
          subtitle: "b) Information We Automatically Collect",
          text: "During visits to our website, we gather technical data to improve user experience and security. This includes:",
          list: [
            "IP address used to connect to the internet",
            "Login details",
            "Browser type and version",
            "Time zone settings",
            "Browser plug-in types and versions",
            "Operating system and platform",
          ],
          note: "If you are a prospective client, you may also submit personal data when applying to join our network through our website.",
        },
      ],
    },
    {
      id: "use-data",
      title: "2: Use of Personal Data",
      content: [
        {
          text: "BluConnet Media is dedicated to safeguarding the personal data you provide and ensuring it is processed in accordance with our Privacy Policy and all applicable laws. We utilize your information for the following purposes:",
          list: [
            "Providing Requested Products & Services – Ensuring you receive the products and services you inquire about or request.",
            "Managing Business Obligations – Handling payments, fulfilling agreed-upon commitments, and conducting internal analyses to enhance operations.",
            "Ensuring Website Security & User Safety – Maintaining a secure, user-friendly experience and protecting visitors on our platform.",
            "Improving Customer Service & User Experience – Analyzing user behavior to optimize service delivery and the information we provide.",
          ],
          note: "Additionally, we use collected data to keep subscribers informed about company news, updates, industry insights, and relevant product or service information via email. If any user wishes to opt out, they can do so by clicking the unsubscribe link included in all emails and newsletters.",
        },
      ],
    },
    {
      id: "disclosure",
      title: "3: Disclosure and Transfer of Personal Data",
      content: [
        {
          text: "At BluConnet Media, safeguarding user privacy is our highest priority. We do not promote the transfer of user data beyond what is necessary to maintain security and integrity. Any data transfer occurs internally within BluConnet Media or to associated partners only with proper consent and in full compliance with applicable privacy regulations.",
          note: "We remain committed to ensuring user data is handled responsibly and transparently.",
        },
      ],
    },
    {
      id: "access",
      title: "4: Access to Your Personal Information",
      content: [
        {
          text: "Subscribers of BluConnet Media have the right to request access to their personal information at any time. To ensure security and proper handling, all access requests must be processed through official emails or calls.",
          note: "BluConnet Media reserves the right to charge a fee to cover administrative costs associated with providing details of the information we hold.",
        },
      ],
    },
    {
      id: "security",
      title: "5: Security",
      content: [
        {
          text: "At BluConnet Media, we prioritize the security of our users' data and take proactive measures to prevent unauthorized access. We implement advanced technical and organizational safeguards to protect personal information.",
          list: [
            "All sensitive and personal data exchanged between our website and your browser is encrypted using SSL technology to ensure secure communication.",
            "We enforce access restrictions, allowing only authorized personnel within the company to handle specific data.",
          ],
          note: "However, while we strive to uphold the highest security standards, internet transmissions are not entirely risk-free. Users should be aware that any data shared online carries inherent risks, and BluConnet Media cannot guarantee absolute security. As a result, individuals assume responsibility for data transmitted to our site.",
        },
      ],
    },
    {
      id: "newsletters",
      title: "6: Newsletters & Promotions",
      content: [
        {
          text: "At BluConnet Media, we periodically launch promotions to support lead generation and audience engagement. Our newsletters serve as a key resource, delivering updates, news, and essential insights to keep our subscribers and users informed.",
          note: "By sharing timely and relevant information, we aim to provide value while keeping our audience engaged with the latest developments.",
        },
      ],
    },
    {
      id: "cookies",
      title: "7: Cookies",
      content: [
        {
          text: "An HTTP cookie, also known as an internet cookie, is a small piece of data that a website sends to a user's computer, where it is stored by the web browser during browsing sessions. The primary function of cookies is to enhance user experience by improving site navigation, search capabilities, and personalized content accessibility.",
          note: "You have the option to decline cookies or set alerts to notify you when cookies are being sent. However, please be aware that restricting cookies may affect certain functionalities, potentially limiting access to some features on our website.",
        },
      ],
    },
    {
      id: "company-info",
      title: "8: Company Information",
      content: [
        {
          text: "BluConnet Media is headquartered in the United Kingdom, where we provide dedicated support services to our clients, ensuring efficient and tailored solutions to meet their needs.",
        },
      ],
    },
    {
      id: "contact",
      title: "9: Contact Us",
      content: [
        {
          text: "If you have any questions or comments regarding this Privacy Policy, feel free to reach out to us via email at ",
          email: "info@bluconnetmedia.com",
          note: "We're here to assist you.",
        },
      ],
    },
    {
      id: "changes",
      title: "10: Changes to Our Privacy Policy",
      content: [
        {
          text: "At BluConnet Media, we periodically update our Privacy Policy to reflect changes, additions, or improvements in data protection practices. Any modifications will be published here, ensuring users can always stay informed about our latest policies.",
        },
      ],
    },
  ];

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-0 left-1/4 w-96 h-96 ${isDarkMode ? "bg-[#d4e157]/5" : "bg-emerald-400/5"} rounded-full blur-3xl`}
        />
        <div
          className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-400/5"} rounded-full blur-3xl`}
        />
      </div>

      {/* Increased padding-top to pt-40 for better navbar clearance */}
      <div className="max-w-5xl mx-auto px-4 pt-40 pb-20 relative z-10">
        {/* ===== CENTERED HEADER & INTRO SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"}`}
          >
            <FaShieldAlt
              className={`text-lg ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
            />
            <span
              className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}
            >
              Legal & Compliance
            </span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-black ${theme.text} mb-6`}>
            PRIVACY{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}
            >
              POLICY
            </span>
          </h1>

          <p
            className={`text-sm md:text-base lg:text-lg ${theme.muted} max-w-4xl mx-auto leading-relaxed text-start mb-6`}
          >
            BluConnet Media is dedicated to protecting and maintaining the
            privacy of our users. We have established a comprehensive set of
            policies to ensure responsible data handling and security. As part
            of our service offerings, we process data from advertisers,
            publishers, media agencies, and other affiliates. It is essential
            that our users trust that their information is managed in full
            compliance with applicable privacy laws and regulations. Please
            review the details below to understand how we collect, process, and
            safeguard your personal data.
          </p>
        </motion.div>

        {/* ===== SINGLE UNIFIED CONTAINER FOR SECTIONS 1 TO 10 ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative p-8 md:p-12 rounded-3xl border ${theme.borderColor} ${theme.cardBg} backdrop-blur-sm text-start shadow-xl`}
        >
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`${index !== 0 ? `mt-12 pt-12 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}` : ""}`}
            >
              {/* Section Number Badge */}
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? "bg-[#d4e157]/20 text-[#d4e157] border border-[#d4e157]/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}
              >
                Section {index + 1}
              </div>

              <h2
                className={`text-2xl md:text-3xl font-bold ${theme.text} mb-6`}
              >
                {section.title}
              </h2>

              <div className="space-y-6">
                {section.content.map((block, blockIdx) => (
                  <div key={blockIdx} className="space-y-4">
                    {block.subtitle && (
                      <h3
                        className={`text-lg font-semibold ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"}`}
                      >
                        {block.subtitle}
                      </h3>
                    )}

                    {/* 1. Text (and Email if exists) */}
                    <p className={`${theme.muted} leading-relaxed`}>
                      {block.text}
                      {block.email && (
                        <a
                          href={`mailto:${block.email}`}
                          className={`font-semibold ${isDarkMode ? "text-[#d4e157] hover:text-[#06b6d4]" : "text-emerald-600 hover:text-cyan-600"} transition-colors underline decoration-dotted`}
                        >
                          {block.email}
                        </a>
                      )}
                    </p>

                    {/* 2. List (Bullet Points) */}
                    {block.list && (
                      <ul className="space-y-3 mt-4">
                        {block.list.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3">
                            <FaChevronRight
                              className={`mt-1.5 flex-shrink-0 text-sm ${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"}`}
                            />
                            <span className={`${theme.muted} leading-relaxed`}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* 3. Note (Italic, at the very bottom of the block) */}
                    {block.note && (
                      <p
                        className={`mt-4 text-sm italic ${theme.muted} border-l-4 ${isDarkMode ? "border-[#06b6d4] pl-3" : "border-cyan-500 pl-3"}`}
                      >
                        {block.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ===== DOWNLOAD BUTTON (After Section 10) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <motion.a
            href="/privacy-policy.pdf"
            download="BluConnet_Privacy_Policy.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${theme.gradientText} ${isDarkMode ? "text-[#0a0e27]" : "text-white"} font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <FaDownload className="text-xl" /> Download Privacy Policy
          </motion.a>
        </motion.div>

        {/* ===== BOTTOM CTA (Centered) ===== */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mt-16 p-8 md:p-12 rounded-3xl border ${theme.borderColor} ${theme.cardBg} backdrop-blur-xl text-center flex flex-col items-center`}
        >
          <FaEnvelope
            className={`text-4xl mb-4 ${
              isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
            }`}
          />

          <h3 className={`text-2xl font-bold ${theme.text} mb-3`}>
            Still Have Questions?
          </h3>

          <p className={`${theme.muted} mb-6 max-w-2xl mx-auto`}>
            If anything in this policy is unclear, our team is here to help
            clarify how we handle your data.
          </p>

          <a
            href="mailto:info@bluconnetmedia.com"
            className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r ${
              theme.gradientText
            } ${
              isDarkMode ? "text-[#0a0e27]" : "text-white"
            } font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            Contact Our Privacy Team
            <FaArrowRight className="text-sm" />
          </a>
        </motion.div> */}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
