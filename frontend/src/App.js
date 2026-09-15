import React, { Suspense, lazy, useState, useEffect, useCallback } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import PortfolioPage from "./pages/PortfolioPage";

import Navbar from "./components/Navbar";
import MetaPixel from "./components/MetaPixel";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";
import Hero from "./components/Hero";
import AwardsBar from "./components/AwardsBar";
import Stats from "./components/Stats";
import Clients from "./components/Clients";
import Services from "./components/Services";
import WhyChooseUs from "./components/WhyChooseUs";
import AwardsSection from "./components/AwardsSection";
import FeaturesGrid from "./components/FeaturesGrid";
import APVision from "./components/APVision";
import RealOutcomes from "./components/RealOutcomes";
import LogoSlider from "./components/LogoSlider";
import Testimonials from "./components/Testimonials";
import Guide2026 from "./components/Guide2026";
import TechPartners from "./components/TechPartners";
import Insights from "./components/Insights";
import ContactForm from "./components/ContactForm";
import SubscribeSection from "./components/SubscribeSection";
import Footer from "./components/Footer";
import MarqueeBanner from "./components/MarqueeBanner";
import AboutUs from "./pages/AboutUs";
import ContactPage from "./pages/contact";
import "./App.css";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import News from "./pages/News";
import NewsDetails from "./pages/NewsDetails";
import Login from "./pages/Login";
import AdminNews from "./pages/AdminNews";
import EmailMarketing from "./pages/EmailMarketing";
import LeadGeneration from "./pages/LeadGeneration";
import ContentMarketing from "./pages/ContentMarketing";
import AffiliateMarketing from "./pages/AffiliateMarketing";
import HtmlWebApp from "./pages/HtmlWebApp";
import SocialMediaMarketing from "./pages/SocialMediaMarketing";
import WebDesignDevelopment from "./pages/WebDesignDevelopment";
import SEOMarketing from "./pages/SEOMarketing";
import ECommerceMarketing from "./pages/ECommerceMarketing";
import CRMGraphicDesigning from "./pages/CRMGraphicDesigning";
import DataAnalyticsResearch from "./pages/DataAnalyticsResearch";
import MobileMarketing from "./pages/MobileMarketing";
import CareerPage from "./pages/CareerPage";
import ServicesCard from "./pages/ServicesCard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

// Lazy-loaded AI assistant (zero impact on initial page load)
const Chatbot = lazy(() => import("./components/chatbot/Chatbot"));
const ChatAdmin = lazy(() => import("./pages/ChatAdmin"));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => {
      if (!prev) setUnread(0); // opening → clear unread
      return !prev;
    });
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  const handleBotReply = useCallback(() => {
    setUnread((u) => Math.min(u + 1, 9));
  }, []);

  //  Disable browser's default scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  //  Save scroll position BEFORE page unloads (refresh/close)
  useEffect(() => {
    const savePosition = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    window.addEventListener("beforeunload", savePosition);

    return () => {
      window.removeEventListener("beforeunload", savePosition);
    };
  }, []);

  //  Restore scroll position AFTER content loads
  useEffect(() => {
    if (!isLoading) {
      const savedPosition = sessionStorage.getItem("scrollPosition");

      if (savedPosition !== null) {
        const position = parseInt(savedPosition);

        // Wait for content to fully render
        const timer = setTimeout(() => {
          window.scrollTo(0, position);
          sessionStorage.removeItem("scrollPosition");
        }, 100);

        document.body.style.overflow = "auto";

        return () => clearTimeout(timer);
      } else {
        // First visit - scroll to top
        window.scrollTo(0, 0);
        document.body.style.overflow = "auto";
      }
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isLoading]);

  //  Continuous scroll position saving (backup)
  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        sessionStorage.setItem("scrollPosition", window.scrollY.toString());
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Router>
      {/* Global Meta Pixel — fires PageView on React route changes (renders nothing) */}
      <MetaPixel />
      <div className="App">
        {/* Preloader */}
        {isLoading && <Preloader setIsLoading={setIsLoading} />}

        {/* Main Content */}
        <div
          className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-700`}
        >
          <Navbar />
          <ScrollToTop isOpen={isChatOpen} onToggleChat={toggleChat} unread={unread} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <AwardsBar />
                  <Stats />
                  <Clients />
                  <Services />
                  <MarqueeBanner />
                  <WhyChooseUs />
                  <AwardsSection />
                  <FeaturesGrid />
                  <APVision />
                  <RealOutcomes />
                  <LogoSlider />
                  <Testimonials />
                  <Guide2026 />
                  <TechPartners />
                  <Insights />
                  <ContactForm />
                  <SubscribeSection />
                </>
              }
            />
            {/* NEW: About Us Page Route */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-news" element={<AdminNews />} />
            <Route path="/services/email" element={<EmailMarketing />} />
            <Route path="/services/lead" element={<LeadGeneration />} />
            <Route path="/services/content" element={<ContentMarketing />} />
            <Route
              path="/services/affiliate"
              element={<AffiliateMarketing />}
            />
            <Route path="/services/html" element={<HtmlWebApp />} />
            <Route path="/services/social" element={<SocialMediaMarketing />} />
            <Route path="/services/web" element={<WebDesignDevelopment />} />
            <Route path="/services/seo" element={<SEOMarketing />} />
            <Route
              path="/services/ecommerce"
              element={<ECommerceMarketing />}
            />
            <Route path="/services/crm" element={<CRMGraphicDesigning />} />
            <Route
              path="/services/analytics"
              element={<DataAnalyticsResearch />}
            />
            <Route path="/services/mobile" element={<MobileMarketing />} />
            <Route path="/career" element={<CareerPage />} />
            <Route path="/services" element={<ServicesCard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/admin/chat" element={<ChatAdmin />} />
          </Routes>
          <Suspense fallback={null}>
            <Chatbot isOpen={isChatOpen} onClose={closeChat} unread={unread} onBotReply={handleBotReply} />
          </Suspense>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
