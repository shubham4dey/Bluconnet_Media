import React from "react";
import { useTheme } from "../context/ThemeContext";

// Import logo images
import affiseLogo from "../assets/clients/aff1.png";
import namecheapLogo from "../assets/clients/namecheap.png";
import plutoLogo from "../assets/clients/pluto.png";
import mindbazLogo from "../assets/clients/mindbaz.png";
import campaignLogo from "../assets/clients/campaign.png";
import campaignDarkLogo from "../assets/clients/campaign-night.png";
import metaLogo from "../assets/clients/meta.png";
import googleLogo from "../assets/clients/google.png";

const LogoSlider = () => {
  const { isDarkMode } = useTheme();

  const logos = [
    {
      name: "Affise",
      logo: affiseLogo,
    },
    {
      name: "Namecheap",
      logo: namecheapLogo,
    },
    {
      name: "PlutoAstro",
      logo: plutoLogo,
    },
    {
      name: "Mindbaz",
      logo: mindbazLogo,
    },
    {
      name: "Campaign Monitor",
      logo: isDarkMode ? campaignDarkLogo : campaignLogo,
    },
    {
      name: "Meta",
      logo: metaLogo,
    },
    {
      name: "Google",
      logo: googleLogo,
    },
  ];

  // Duplicate array for seamless infinite loop
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section
      className={`
        py-12
        overflow-hidden
        relative
        transition-colors duration-500
        ${isDarkMode ? "bg-[#050508]" : "bg-white"}
      `}
    >
      {/* Logo Slider - Auto Scrolling */}
      <div className="logo-slider-container flex whitespace-nowrap pt-12">
        {duplicatedLogos.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="
              mx-8 md:mx-16
              flex items-center justify-center
              opacity-90
              hover:opacity-100
              transition-opacity duration-300
              flex-shrink-0
            "
          >
            {/* Original Color Logo */}
            <img
              src={item.logo}
              alt={item.name}
              className="
                h-12 md:h-16
                w-auto
                object-contain
                transition-all duration-300
              "
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LogoSlider;