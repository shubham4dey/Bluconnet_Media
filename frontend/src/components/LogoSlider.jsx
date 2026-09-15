import React from "react";
import { useTheme } from "../context/ThemeContext";
import getThemeColors from "../utils/themeColors";

// Import logo images
import columbiaLogo from "../assets/img/logo.png";
import fiveBelowLogo from "../assets/img/logo.png";
import redbubbleLogo from "../assets/img/logo.png";
import allbirdsLogo from "../assets/img/logo.png";
import reebokLogo from "../assets/img/logo.png";
import bonafideLogo from "../assets/img/logo.png";
import targetLogo from "../assets/img/logo.png";
import crocsLogo from "../assets/img/logo.png";
import instacartLogo from "../assets/img/logo.png";
import hotwireLogo from "../assets/img/logo.png";
import caribouLogo from "../assets/img/logo.png";
import blendersLogo from "../assets/img/logo.png";

const LogoSlider = () => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  const logos = [
    { name: "Columbia", logo: columbiaLogo },
    { name: "Five Below", logo: fiveBelowLogo },
    { name: "Redbubble", logo: redbubbleLogo },
    { name: "Allbirds", logo: allbirdsLogo },
    { name: "Reebok", logo: reebokLogo },
    { name: "Bonafide", logo: bonafideLogo },
    { name: "Target", logo: targetLogo },
    { name: "Crocs", logo: crocsLogo },
    { name: "Instacart", logo: instacartLogo },
    { name: "Hotwire", logo: hotwireLogo },
    { name: "Caribou", logo: caribouLogo },
    { name: "Blenders", logo: blendersLogo },
  ];

  // Duplicate array for seamless infinite loop
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section
      className={`py-12 ${colors.logoSliderBg} overflow-hidden relative transition-colors duration-500`}
    >
      {/* Logo Slider - Auto Scrolling */}
      <div className="logo-slider-container flex whitespace-nowrap">
        {duplicatedLogos.map((item, index) => (
          <div
            key={index}
            className="mx-8 md:mx-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
          >
            {/* Logo Image */}
            <img
              src={item.logo}
              alt={item.name}
              className="h-12 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LogoSlider;
