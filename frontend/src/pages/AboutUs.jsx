import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaBell } from "react-icons/fa";
import AboutHero from "../components/AboutHero";
import WhoWeAre from "../components/WhoWeAre";
import AwardsVideo from "../components/AwardsVideo";
import OurTeam from "../components/OurTeam";
import MissionVision from "../components/MissionVision";
import PortfolioCTA from "../components/PortfolioCTA";
import SubscribeSection from "../components/SubscribeSection";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full overflow-hidden"
    >
      {/* Section 1: Hero with Video/Slider */}
      <AboutHero />

      {/* Section 2: Who We Are */}
      <WhoWeAre />

      {/* Section 3: Awards Video */}
      <AwardsVideo />

      {/* Section 4: Our Team */}
      <OurTeam />

      {/* Section 5: Mission & Vision */}
      <MissionVision />

      {/* Section 6: Portfolio CTA */}
      <PortfolioCTA />

      {/* Section 7: Subscribe - Same Component, Different Props */}
      <SubscribeSection 
        title="Join Our Community"
        highlight="Community"
        description="Be part of our growing community of digital marketers and business leaders. Get exclusive insights, case studies, and early access to our latest innovations."
        badgeText="JOIN 10K+ MARKETERS"
        icon={FaBell}
        showBadge={true}
        showStats={true}
      />
    </motion.div>
  );
};

export default AboutUs;