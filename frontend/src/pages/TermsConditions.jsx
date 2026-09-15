import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaFileContract, FaChevronRight, FaPen, FaDownload } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const TermsAndConditions = () => {
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
    gradientText: isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600",
    cardBg: isDarkMode ? "bg-white/5" : "bg-gray-50",
    borderColor: isDarkMode ? "border-white/10" : "border-gray-200",
  };

  const sections = [
    {
      id: "preliminary",
      title: "1. Preliminary",
      content: [{ text: "The premise constitutes a fundamental and indispensable component of this agreement." }]
    },
    {
      id: "object",
      title: "2. Object of the Contract",
      content: [
        {
          list: [
            "This contract governs the relationship between BluConnet Media and (Client’s Name).",
            "BluConnet Media delegates the responsibility of conducting online marketing activities in accordance with the terms and procedures outlined in the agreement.",
            "The objective is to generate user engagement and actions on websites belonging to direct or indirect clients.",
            "The Franchisee is required to adhere to these terms upon signing the contract."
          ]
        }
      ]
    },
    {
      id: "client-obligations",
      title: "3. Obligations of BluConnet Media & (Client’s Name)",
      content: [
        {
          text: "(Client’s Name) agrees to:",
          list: [
            "Actively collaborate to facilitate the successful execution of the activities outlined in this contract.",
            "Grant BluConnet Media exclusive access to its affiliate software via a unique login, enabling full visibility into advertising campaigns managed by (Client’s Name). This includes essential campaign details, tracking links, advertising materials (such as banners and email designs), and conversion data, including pending conversions.",
            "Compensate BluConnet Media according to the agreed terms and conditions for valid leads, as recorded within (Client’s Name)’s tracking software.",
            "Refrain from transferring this contract, either partially or in full, whether for compensation or free of charge. Additionally, no third party shall be permitted to execute activities covered under this contract without prior written authorization from BluConnet Media."
          ]
        }
      ]
    },
    {
      id: "bluconnet-obligations",
      title: "4. Obligations of BluConnet Media",
      content: [
        {
          list: [
            "Diligent Cooperation: BluConnet Media shall exert maximum effort to facilitate the implementation of the activities outlined in this contract.",
            "Ongoing Communication: BluConnet Media shall provide regular updates to (Client’s Name) regarding the progress and development of the marketing activities being carried out.",
            "Promotion & Compliance: BluConnet Media shall actively promote the product offerings provided by (Client’s Name) through its affiliate system, ensuring full adherence to the general terms and conditions and any specific contractual provisions established within (Client’s Name)’s system.",
            "Contract Integrity: BluConnet Media shall neither transfer this contract, whether in whole or in part, for payment or free of charge, nor shall it permit any third party to execute the activities outlined herein without prior written authorization from (Client’s Name)."
          ]
        }
      ]
    },
    {
      id: "duration",
      title: "5. Duration",
      content: [
        {
          text: "This contract shall remain in effect for a twelve (12)-month period from the date of signing. Upon expiration, the contract shall automatically renew for an additional twelve (12) months, unless either party elects to terminate the agreement. Termination must be initiated by written notice sent via Recorded Delivery Letter with confirmation of receipt, at least thirty (30) days prior to the contract’s expiration date."
        }
      ]
    },
    {
      id: "ip-rights",
      title: "6. Intellectual Property Rights",
      content: [
        {
          list: [
            "Both parties, along with their respective clients, shall retain full ownership and exclusive control over all industrial and intellectual property rights, including denominations, trademarks, logos, and any proprietary assets supplied or utilized within the scope of this agreement.",
            "Neither (Client’s Name) nor BluConnet Media shall, under any circumstance, assert any rights over the intellectual property owned by the other party or their clients.",
            "Upon expiration or termination of this contract, both parties must immediately cease the use of any marks, intellectual property, or proprietary rights belonging to the other party or their clients. This obligation also extends to commercial documents, advertisements, or any promotional materials disseminated through any media or platform that may potentially mislead third parties by implying unauthorized affiliation with the company, its ownership, or its products."
          ]
        }
      ]
    },
    {
      id: "confidentiality",
      title: "7. Confidentiality",
      content: [
        {
          list: [
            "Both parties commit to maintaining strict confidentiality regarding the terms and conditions of this contract and any related agreements throughout the contract’s duration and for twelve (12) months following its expiration.",
            "Necessary precautions shall be taken to ensure confidentiality in interactions with employees, partners, collaborators, assistants, or consultants to prevent unauthorized disclosure.",
            "No party shall disclose, communicate, or share any contract-related information with third parties without prior written authorization from the other party.",
            "Disclosure of confidential information is permitted only if required by competent authorities or if the information has entered the public domain due to circumstances beyond the control of the parties or their associates.",
            "Upon termination of the contract, each party must return all documents, files, physical or electronic records received during the contract period. No copies of such materials shall be disclosed to any third party for any reason.",
            "Any breach of confidentiality obligations shall render the responsible party liable for damages incurred by the other party."
          ]
        }
      ]
    },
    {
      id: "privacy",
      title: "8. Privacy",
      content: [
        {
          list: [
            "The parties shall ensure the handling and processing of personal data obtained during the execution of this contract strictly in compliance with UK personal data protection laws. The use of such data shall be limited exclusively to purposes directly related to fulfilling contractual obligations.",
            "The parties shall implement appropriate security measures, as mandated by law, to safeguard the integrity and confidentiality of the personal data in their possession.",
            "Each party further undertakes to indemnify and hold the other party harmless against any losses, damages, or expenses, including legal fees, incurred as a result of violations of the Personal Data Protection Code or subsequent amendments and additions enacted in the respective jurisdictions."
          ]
        }
      ]
    },
    {
      id: "indemnity",
      title: "9. Indemnity",
      content: [
        {
          list: [
            "(Client’s Name) hereby agrees to indemnify and hold BluConnet Media and its Clients harmless against any and all claims, liabilities, or adverse consequences arising from actions, omissions, or non-fulfillment directly attributable to the Franchisee during the execution of this contract.",
            "Furthermore, (Client’s Name) commits to fully safeguard BluConnet Media and its Clients from any demands for compensation, as well as any sanctions, fines, or financial obligations, including taxes, levies, fiscal penalties, or legal expenses that may be incurred in connection with the contract’s implementation."
          ]
        }
      ]
    },
    {
      id: "termination",
      title: "10. Express Termination Clause",
      content: [
        {
          list: [
            "Both parties agree to indemnify and hold each other, along with their respective Clients, harmless against any and all claims, liabilities, or adverse consequences arising from actions, omissions, or non-fulfillment directly attributable to the other party during the execution of this contract.",
            "Specifically, both parties commit to protecting each other and their Clients from any demands for compensation, sanctions, fines, or financial obligations, including taxes, levies, fiscal penalties, or legal expenses, resulting directly from the actions of the other party.",
            "(Client’s Name) shall not transfer this contract, whether in whole or in part, for payment or free of charge, without obtaining prior written authorization from BluConnet Media.",
            "Any form of sub-franchising is strictly prohibited."
          ]
        }
      ]
    },
    {
      id: "general",
      title: "11. General Provisions",
      content: [
        {
          list: [
            "Transfer Restrictions: Neither party shall assign or transfer this contract, in whole or in part, whether for payment or free of charge, without prior written authorization from the other party.",
            "Prohibition of Sub-Franchising: Any form of sub-franchising is strictly prohibited under this agreement."
          ]
        }
      ]
    },
    {
      id: "address",
      title: "12. Address for Service",
      content: [
        {
          text: "For the execution of this contract and the delivery of all related documents, both parties formally designate the addresses specified on the first page of this contract as their official address for service."
        }
      ]
    },
    {
      id: "jurisdiction",
      title: "13. Governing Law and Jurisdiction",
      content: [
        {
          text: "This contract shall be regulated and interpreted in full compliance with UK law. Any disputes arising from or related to the interpretation, execution, or termination of this agreement—including all matters directly or indirectly associated with its scope—shall be exclusively resolved by the competent courts within the jurisdiction of UK.",
          note: "The parties hereby confirm that they have carefully reviewed and explicitly approve the contractual provisions concerning the Obligations of BLUCONNET MEDIA & (Client’s Name), as well as the stipulated prohibitions contained herein."
        }
      ]
    },
    {
      id: "agreement-terms",
      title: "Agreement Terms Summary",
      content: [
        {
          list: [
            "Compensation Protection: Safeguards both parties against claims, losses, or liabilities.",
            "Scope of Engagement: Defines the contractual obligations and responsibilities.",
            "Payment Conditions: Specifies financial terms, timelines, and invoicing procedures.",
            "Contract Validity: Establishes the duration of the agreement and renewal conditions.",
            "Ownership Rights: Ensures proprietary assets remain under rightful ownership.",
            "Information Security: Maintains confidentiality in dealings and data protection.",
            "Termination Protocol: Outlines conditions under which the contract may be terminated.",
            "Assignment Restrictions: Regulates transferability and third-party involvement.",
            "Fundamental Guidelines: Defines overarching principles governing the agreement.",
            "Legal Correspondence Address: Designates the official location for communications.",
            "Regulatory Jurisdiction: Specifies the governing laws and applicable courts."
          ]
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-500`}>
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDarkMode ? "bg-[#d4e157]/5" : "bg-emerald-400/5"} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-400/5"} rounded-full blur-3xl`} />
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
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 ${isDarkMode ? "bg-gradient-to-r from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/30" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200"}`}>
            <FaFileContract className={`text-lg ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`} />
            <span className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`}>
              Legal Agreement
            </span>
          </div>
          
          <h1 className={`text-3xl md:text-5xl font-black ${theme.text} mb-4 leading-tight`}>
            TERMS AND{" "}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientText}`}>
              CONDITIONS
            </span>
          </h1>
          
          <h2 className={`text-xl md:text-2xl font-bold ${theme.muted} mb-8`}>
            Digital Marketing Service Level Agreement
          </h2>
          
          <div className={`text-sm md:text-base lg:text-lg ${theme.muted} max-w-4xl mx-auto leading-relaxed space-y-4 text-start`}>
            <p>
              <strong className={theme.text}>Between:</strong><br />
              BLUCONNET MEDIA LIMITED<br />
              SHAGGY CALF LANE, SLOUGH BERKSHIRE, SL2 5HP, LONDON UK<br />
              <strong className={theme.text}>AND</strong><br />
              CLIENTS (Where "jurisdiction of UK" applies)
            </p>
            <p>
              BluConnet Media is a leading Digital Marketing Agency specializing in email marketing and lead generation. Leveraging a vast network of qualified publishers and an extensive, up-to-date global database, BluConnet Media enhances its clients’ sales and business growth through CPC (Cost Per Click), CPM (Cost Per Mille), and CPL (Cost Per Lead) strategies. With precision-driven custom user profiling, BluConnet Media ensures optimal marketing performance, delivering high-quality leads and maximizing advertising impact.
            </p>
            <p>
              BluConnet Media delivers cutting-edge integrated communication strategies, helping businesses thrive in the digital landscape. With expertise in online advertising, email marketing campaigns, and search marketing (S.E.M. & S.E.O.), BluConnet Media ensures maximum visibility and engagement.
            </p>
            <p>
              Additionally, BluConnet Media specializes in mobile advertising, innovative online marketing solutions, corporate blog affiliation systems, and high-impact web copywriting, providing brands with powerful tools to enhance their reach and drive meaningful connections.
            </p>
            <p>
              BluConnet Media leverages proprietary technologies equipped with state-of-the-art tracking systems to precisely target campaigns. These innovative solutions enable real-time monitoring and continuous optimization, ensuring seamless campaign evolution and maximized performance.
            </p>
            <p>
              BluConnet Media and its Clients/advertisers (hereinafter “Clients”) achieve their shared objectives by leveraging targeted customer insights and business analytics. By continuously monitoring consumer reactions in real time, BluConnet Media ensures dynamic optimization throughout the campaign, effectively enhancing engagement and performance. This approach is rooted in relational marketing strategies, fostering meaningful connections between brands and their audiences.
            </p>
            <p>
              Considering the aforementioned terms and conditions, both parties mutually agree to abide by the provisions outlined in this agreement.
            </p>
          </div>
        </motion.div>

        {/* ===== SINGLE UNIFIED CONTAINER FOR ALL SECTIONS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative p-8 md:p-12 rounded-3xl border ${theme.borderColor} ${theme.cardBg} backdrop-blur-sm text-start shadow-xl`}
        >
          {sections.map((section, index) => (
            <div 
              key={section.id} 
              className={`${index !== 0 ? `mt-12 pt-12 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}` : ''}`}
            >
              {/* Section Number Badge */}
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? "bg-[#d4e157]/20 text-[#d4e157] border border-[#d4e157]/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}>
                Section {index + 1}
              </div>

              <h2 className={`text-2xl md:text-3xl font-bold ${theme.text} mb-6`}>
                {section.title}
              </h2>

              <div className="space-y-6">
                {section.content.map((block, blockIdx) => (
                  <div key={blockIdx} className="space-y-4">
                    {block.subtitle && (
                      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"}`}>
                        {block.subtitle}
                      </h3>
                    )}
                    
                    {/* 1. Text */}
                    {block.text && (
                      <p className={`${theme.muted} leading-relaxed`}>
                        {block.text}
                      </p>
                    )}

                    {/* 2. List (Bullet Points) */}
                    {block.list && (
                      <ul className="space-y-3 mt-4">
                        {block.list.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3">
                            <FaChevronRight className={`mt-1.5 flex-shrink-0 text-sm ${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"}`} />
                            <span className={`${theme.muted} leading-relaxed`}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* 3. Note (Italic, at the very bottom of the block) */}
                    {block.note && (
                      <p className={`mt-4 text-sm italic ${theme.muted} border-l-4 ${isDarkMode ? "border-[#06b6d4] pl-3" : "border-cyan-500 pl-3"}`}>
                        {block.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ===== SIGNATURE BLOCK ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-2 gap-8"
        >
          {/* BluConnet Media Signature */}
          <div className={`p-8 rounded-2xl border ${theme.borderColor} ${theme.cardBg} backdrop-blur-sm`}>
            <h3 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
              <FaPen className={isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} />
              BLUCONNET MEDIA
            </h3>
            <div className="space-y-6">
              <div>
                <div className={`h-12 border-b-2 border-dashed ${isDarkMode ? "border-gray-600" : "border-gray-300"} mb-2`}></div>
                <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Signature</span>
              </div>
              <div>
                <div className={`h-8 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} mb-2`}></div>
                <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Name</span>
              </div>
              <div>
                <div className={`h-8 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} mb-2`}></div>
                <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Designation</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`h-8 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} mb-2`}></div>
                  <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Location</span>
                </div>
                <div>
                  <div className={`h-8 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} mb-2`}></div>
                  <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Date</span>
                </div>
              </div>
            </div>
          </div>

          {/* Client Signature */}
          <div className={`p-8 rounded-2xl border ${theme.borderColor} ${theme.cardBg} backdrop-blur-sm`}>
            <h3 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
              <FaPen className={isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"} />
              CLIENT
            </h3>
            <div className="space-y-6">
              <div>
                <div className={`h-12 border-b-2 border-dashed ${isDarkMode ? "border-gray-600" : "border-gray-300"} mb-2`}></div>
                <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Signature</span>
              </div>
              <div>
                <div className={`h-8 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} mb-2`}></div>
                <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Name</span>
              </div>
              <div>
                <div className={`h-8 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} mb-2`}></div>
                <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Designation</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`h-8 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} mb-2`}></div>
                  <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Location</span>
                </div>
                <div>
                  <div className={`h-8 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} mb-2`}></div>
                  <span className={`text-xs uppercase tracking-wider ${theme.muted}`}>Date</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

          {/* ===== DOWNLOAD BUTTON ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <motion.a
            href="/terms-and-conditions.pdf" 
            download="BluConnet_Terms_and_Conditions.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r ${theme.gradientText} ${isDarkMode ? "text-[#0a0e27]" : "text-white"} font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <FaDownload className="text-xl" /> Download Terms & Conditions
          </motion.a>
        </motion.div>

      </div>
    </div>
  );
};

export default TermsAndConditions;