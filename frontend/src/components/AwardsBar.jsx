import React from "react";
import { FaStar } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import getThemeColors from "../utils/themeColors";

// Import images properly
import affiseLogo from "../assets/clients/aff1.png";
import namecheapLogo from "../assets/clients/namecheap.png";
import plutoLogo from "../assets/clients/pluto.png";
import mindbazLogo from "../assets/clients/mindbaz.png";
import campaignLogo from "../assets/clients/campaign.png";
import campaignDarkLogo from "../assets/clients/campaign-night.png";
import metaLogo from "../assets/clients/meta.png";
import googleLogo from "../assets/clients/google.png";

const AwardsBar = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const companies = [
    { name: "Affise", logo: affiseLogo },
    { name: "Namecheap", logo: namecheapLogo },
    { name: "Pluto", logo: plutoLogo },
    { name: "Mindbaz", logo: mindbazLogo },
    {
      name: "Campaign",
      lightLogo: campaignLogo,
      darkLogo: campaignDarkLogo,
    },
    { name: "Meta", logo: metaLogo },
    { name: "Google", logo: googleLogo },
  ];

  return (
    <section
      className={`py-9 md:py-16 ${colors.awardsBarBg} border-t border-b ${colors.awardsBarBorder} overflow-hidden transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Marquee Container */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-8 lg:gap-10 w-full">
          {/* Trusted By Badge */}
          <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
            <div
              className={`flex items-center gap-2 px-3.5 lg:px-5 py-2 rounded-full border transition-colors duration-300 ${
                isDarkMode
                  ? "bg-[#d4e157]/10 border-[#d4e157]/30"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <FaStar
                className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-500"
                } animate-pulse`}
              />

              <span
                className={`text-xs lg:text-[15px] font-semibold uppercase tracking-normal whitespace-nowrap ${
                  isDarkMode ? "text-[#d4e157]" : "text-emerald-700"
                }`}
              >
                Trusted By
              </span>
            </div>
          </div>

          {/* Scrolling Marquee - Full width on Mobile */}
          <div className="relative w-full overflow-hidden">
            {/* Fade Edges - Narrower on mobile, wider on desktop */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-r ${colors.awardsBarFadeFrom} to-transparent z-10 pointer-events-none`}
            ></div>
            <div
              className={`absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-32 bg-gradient-to-l ${colors.awardsBarFadeFrom} to-transparent z-10 pointer-events-none`}
            ></div>

            {/* Marquee Track – 2 sets for seamless loop */}
            <div className="flex w-max custom-marquee">
              {/* First Set */}
              {companies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center px-8 sm:px-10 md:px-12 lg:px-14 xl:px-16 flex-shrink-0"
                >
                  <img
                    src={
                      company.name === "Campaign"
                        ? isDarkMode
                          ? company.darkLogo
                          : company.lightLogo
                        : company.logo
                    }
                    alt={company.name}
                    className="h-16 sm:h-16 md:h-16 lg:h-20 xl:h-24 w-auto object-contain opacity-100 hover:scale-110 transition-all duration-300"
                    onError={(e) => {
                      console.error(`Failed to load ${company.name} logo`);
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "block";
                    }}
                  />
                  <span
                    className={`hidden ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } text-lg sm:text-xl md:text-2xl font-medium whitespace-nowrap`}
                  >
                    {company.name}
                  </span>
                </div>
              ))}

              {/* Duplicate Set for Seamless Loop */}
              {companies.map((company, index) => (
                <div
                  key={`dup-${index}`}
                  className="flex items-center justify-center px-8 sm:px-10 md:px-12 lg:px-14 xl:px-16 flex-shrink-0"
                >
                  <img
                    src={
                      company.name === "Campaign"
                        ? isDarkMode
                          ? company.darkLogo
                          : company.lightLogo
                        : company.logo
                    }
                    alt={company.name}
                    className="h-16 sm:h-16 md:h-16 lg:h-20 xl:h-24 w-auto object-contain opacity-100 hover:scale-110 transition-all duration-300"
                    onError={(e) => {
                      console.error(`Failed to load ${company.name} logo`);
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "block";
                    }}
                  />
                  <span
                    className={`hidden ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    } text-lg sm:text-xl md:text-2xl font-medium whitespace-nowrap`}
                  >
                    {company.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Animation Styles */}
      <style>{`
        @keyframes marqueeCorrect {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .custom-marquee {
          animation: marqueeCorrect 20s linear infinite;
        }
        .custom-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .custom-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default AwardsBar;