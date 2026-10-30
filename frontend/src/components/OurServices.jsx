import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FiArrowRight,
  FiGlobe,
  FiHeadphones,
  FiLink2,
  FiTarget,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const services = [
  {
    id: "affiliate-marketing",
    number: "01",
    title: "Affiliate Marketing",
    description:
      "Affiliate marketing lets advertisers pay partners only to performance-based outcomes. Searching for affiliate marketing what is? In short: a partner promotes your offer through tracked affiliate links, and earns when a sale or lead follows. Some call it affiliate programs, affiliate market programs, an affiliate advertising program or program affiliate marketing. The goal is the same: pay for outcomes. A strong affiliate marketing programme has lucid terms. We review how affiliate marketing affiliate programs are set up, then run affiliate marketing programs directly or through affiliate networks and affiliate marketing networks. Every affiliate marketing platform should report clicks and conversions accurately. Partners include affiliate marketing websites, niche affiliate marketing sites and affiliate blogging publishers, prioritizing quality engagement over vanity metrics. Recruiting them is a distinct discipline, often referred to as affiliate marketing. New to the channel? Affiliate marketing for beginners works best when you start with one offer and simple commission terms. Talk to BLUCONNET MEDIA about building your programme.",
    label: "PARTNERS",
    Icon: FiUsers,
  },
  {
    id: "cpa-cpl-campaigns",
    number: "02",
    title: "CPA & CPL Campaigns",
    description:
      "CPA and CPL campaigns directly align your ad spend with measurable performance: you pay for a defined action or a qualified lead, not for impressions alone. They suit advertisers who want lead generation that can be measured from first click to final conversion. Many people search for gen lead or lead gen when they are really asking the same question: how do I get leads that are worth following up? We start by defining what counts as a qualified lead, then build campaigns around that standard. The lead generation leads you receive are only useful if they match your offer, so we review traffic sources, creatives and landing pages against your cost targets. Weak sources are paused, and strong ones receive more budget. We combine lead generation and real-time tracking, so you can see which campaigns deliver and which don't. Targets and terms are agreed upfront. Whether you want sign-ups, enquiries or sales, talk to BLUCONNET MEDIA about a campaign structure that fits your goals.",
    label: "PERFORMANCE",
    Icon: FiTarget,
  },
  {
    id: "smartlink-technology",
    number: "03",
    title: "Smartlink Technology",
    description:
      "A smartlink is a single link that sends each visitor to the offer most likely to convert for them. Instead of guessing which destination suits which user, the link decides automatically, based on devices, locations and past performances. This matters most in mobile marketing, where audiences switch between devices, apps and networks constantly. Smartlinks routes mobile users to mobile-optimized offers and directs desktop visitors to desktop-specific destinations, so fewer clicks are wasted. It also supports mobile advertising campaigns that run across several sources at once. Rather than maintaining many separate links, you manage one, and the routing adjusts as results come in. At BLUCONNET MEDIA, we pair smartlink technology with real-time tracking, so you can see which sources and offers are driving conversions and refine your campaigns with confidence. If you want traffic to reach the right offer without constant manual changes, talk to us about a smartlink set-up.",
    label: "AI POWERED",
    Icon: FiLink2,
  },
  {
    id: "real-time-tracking",
    number: "04",
    title: "Real-Time Tracking",
    description:
      "Clicks, conversions and revenue as they happen, so you can act while a campaign is still running. In affiliate marketing, tracking is what makes payment fair. Whether you run affiliate marketing programs directly, manage affiliate programs for several brands or buy traffic through affiliate networks, advertisers and partners need to see the same numbers. In the same way, good lead generation is about quality as well as volume. Tracking shows which sources, creatives and landing pages produce genuine enquiries, so you can get leads that match your offer. We follow lead generation leads from first click to follow-up and compare them against your cost targets. That tells you where the lead gen budget is working and where it is not. For mobile advertising, we look at device, source and conversion by placement. Email has its own measurement needs: each email campaign should report opens, clicks and conversions. Organic traffic deserves the same scrutiny. Seo marketing and content marketing both depend on knowing which pages bring visitors who convert, and website seo optimization is easier to prioritise when tracking shows where people drop off.",
    label: "ANALYTICS",
    Icon: FiTrendingUp,
  },
  {
    id: "global-reach",
    number: "05",
    title: "Global Reach",
    description:
      "Expanding into a new market requires establishing a strong, discoverable presence. Local customers use their own language and preferred devices to search and evaluate options long before reaching out. BLUCONNET MEDIA helps businesses build that visibility through seo services, email marketing and performance-led traffic acquisition, with access to multiple COUNTRIES and premium traffic sources. Most businesses start with seo, and for good reason: organic visibility keeps working after a campaign ends. Seo marketing brings together technical fixes, content and authority building, so a site is easier for search engines to understand and easier for people to trust. We treat seo and marketing as parts of one plan, and seo & marketing is how many clients first describe what they need: a way to be found, and a reason to be chosen. The same idea goes by many names. Some briefs ask for seo digital marketing, others for seo and digital marketing, seo marketing digital or search engine marketing. Terminology varies by region. Clients in some markets ask for seo optimization and others for seo optimisation. Search, email and performance traffic are planned as one effort, and real-time tracking shows what is working. Talk to BLUCONNET MEDIA about reaching your next market.",
    label: "GLOBAL",
    Icon: FiGlobe,
  },
  {
    id: "dedicated-support",
    number: "06",
    title: "Dedicated Support",
    description:
      "Performance campaigns don't stop at the end of the working day, and neither arrive with problems. BLUCONNET MEDIA offers 24/7 expert support from people who know your account, so a question never has to wait. Our team helps with affiliate marketing queries, from partner approvals to payouts, and investigates quickly if one of your affiliate links sticks. For campaigns built around lead generation, we review traffic quality with you so you can get leads that match your offer, adjusting before budget is wasted. Our seo experts answer questions on search engine marketing in plain terms, and we help with each email campaign, from delivery queries to reporting. You get clear answers, quick escalation of urgent issues and honest updates, so you can focus on growth while we keep your campaigns running smoothly.",
    label: "24 / 7",
    Icon: FiHeadphones,
  },
];

const CARD_COUNT = services.length;
const START = 0.06;
const SPAN = 0.16;
const SECTION_HEIGHT = `${CARD_COUNT + 8}00vh`;

const ServiceCardFace = ({ service, isDarkMode }) => {
  const { number, title, description, label, Icon } = service;

const cardSurface = isDarkMode
  ? "border-white/[0.08] bg-[#0a0f22] shadow-[0_18px_35px_-18px_rgba(0,0,0,0.65),0_6px_12px_-8px_rgba(6,182,212,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]"
  : "border-slate-200/90 bg-white shadow-[0_18px_35px_-18px_rgba(15,23,42,0.24),0_6px_12px_-8px_rgba(16,185,129,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]";

  const accentLine = isDarkMode
    ? "bg-gradient-to-r from-[#d4e157] via-[#06b6d4] to-transparent"
    : "bg-gradient-to-r from-emerald-500 via-cyan-500 to-transparent";

  const badge = isDarkMode
    ? "border-[#d4e157]/25 bg-[#d4e157]/[0.07] text-[#d4e157]"
    : "border-emerald-200/80 bg-emerald-50 text-emerald-700";

  const iconBox = isDarkMode
    ? "border-[#06b6d4]/30 bg-gradient-to-br from-[#101a32] to-[#0a0f22] text-[#06b6d4] shadow-[0_0_45px_-10px_rgba(6,182,212,0.55)]"
    : "border-cyan-200/80 bg-gradient-to-br from-white to-cyan-50 text-cyan-600 shadow-[0_18px_40px_-18px_rgba(6,182,212,0.55)]";

  const orbit = isDarkMode ? "border-white/[0.09]" : "border-slate-300/60";
  const orbitDash = isDarkMode ? "border-white/[0.05]" : "border-slate-200";

  const titleColor = isDarkMode ? "text-white" : "text-slate-900";
  const descColor = isDarkMode ? "text-slate-400" : "text-slate-600";
  const microColor = isDarkMode ? "text-slate-500" : "text-slate-400";

  const numberColor = isDarkMode
    ? "text-white/[0.055]"
    : "text-slate-900/[0.055]";

  const watermarkColor = isDarkMode
    ? "text-white/[0.03]"
    : "text-slate-900/[0.035]";

  const arrowCircle = isDarkMode
    ? "border-white/10 bg-white/[0.02] text-slate-400"
    : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <article
      className={`
        relative w-full overflow-hidden rounded-[24px] border
        text-left transition-colors duration-500 h-full min-h-0
        md:rounded-[32px]
        lg:h-[590px] lg:max-h-[calc(100vh-220px)] lg:rounded-[34px]
        xl:h-[600px] xl:max-h-[calc(100vh-220px)]
        ${cardSurface}
      `}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[3px] ${accentLine}`}
      />

      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute -right-20 -top-24 h-56 w-56
          rounded-full blur-3xl
          ${isDarkMode ? "bg-[#06b6d4]/[0.14]" : "bg-cyan-300/30"}
        `}
      />

      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute -bottom-28 -left-20 h-56 w-56
          rounded-full blur-3xl
          ${isDarkMode ? "bg-[#d4e157]/[0.08]" : "bg-emerald-300/25"}
        `}
      />

      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute right-4 top-3 select-none
          font-black leading-none tracking-tighter text-[65px]
          sm:right-5 sm:text-[85px] md:right-7 md:text-[105px]
          lg:right-8 lg:text-[120px] ${numberColor}
        `}
      >
        {number}
      </span>

      <Icon
        aria-hidden="true"
        className={`
          pointer-events-none absolute -bottom-8 right-1 select-none
          text-[120px] sm:-bottom-10 sm:right-4 sm:text-[160px]
          md:-bottom-12 md:right-5 md:text-[190px]
          lg:-bottom-14 lg:right-7 lg:text-[220px] ${watermarkColor}
        `}
      />

      <div
        className="
          relative z-10 flex min-h-full h-full overflow-y-auto
          lg:overflow-visible flex-col p-4 sm:p-6 md:h-full md:p-8 lg:p-10
          pt-8 pb-8
          sm:pt-10 sm:pb-10
          md:pt-8 md:pb-8
          lg:pt-10 lg:pb-10
        "
      >
        <div className="flex-1 lg:min-h-0">
          <div className="mb-4 flex items-center gap-3 md:hidden">
            <span
              className={`
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-xl border ${iconBox}
              `}
            >
              <Icon className="text-base" aria-hidden="true" />
            </span>

            <span
              className={`
                inline-flex items-center rounded-full border px-3 py-1.5
                text-[8px] font-bold uppercase tracking-[0.2em] ${badge}
              `}
            >
              {label}
            </span>
          </div>

          <span
            className={`
              hidden items-center rounded-full border px-3 py-1.5
              text-[9px] font-bold uppercase tracking-[0.22em]
              md:inline-flex ${badge}
            `}
          >
            {label}
          </span>

          <h3
            className={`
              mt-3 text-[20px] font-black leading-[1.08] tracking-tight
              sm:text-[23px] md:mt-4 md:text-[30px] lg:text-[36px]
              ${titleColor}
            `}
          >
            {title}
          </h3>

          <p
            className={`
              mt-4 max-w-[700px] text-[12px] leading-[1.62]
              sm:text-[12.5px] sm:leading-[1.65] md:mt-5
              md:text-[15px] md:leading-[1.65] ${descColor}
            `}
          >
            {description}
          </p>
        </div>

        <div className="relative z-20 mt-7 shrink-0 sm:mt-8 md:mt-5">
          <div className="flex max-w-[700px] items-center gap-2 sm:gap-3">
            <span
              className={`
                text-[8px] font-bold uppercase tracking-[0.25em]
                sm:text-[10px] ${microColor}
              `}
            >
              BluConnet
            </span>

            <span
              aria-hidden="true"
              className={`h-px flex-1 ${
                isDarkMode ? "bg-white/[0.08]" : "bg-slate-200"
              }`}
            />

            <span
              aria-hidden="true"
              className={`
                flex h-8 w-8 shrink-0 items-center justify-center
                rounded-full border sm:h-9 sm:w-9 md:h-10 md:w-10
                ${arrowCircle}
              `}
            >
              <FiArrowRight className="text-xs sm:text-sm" />
            </span>
          </div>

          <div className="mt-4 flex justify-start sm:mt-5 md:mt-5">
            <Link
              to="/digitalservices"
              className={`
                group inline-flex items-center gap-2 rounded-[11px]
                border px-4 py-2 text-xs font-semibold sm:px-5 sm:py-2.5
                sm:text-sm transition-all duration-300
                ${
                  isDarkMode
                    ? "border-[#d4e157]/60 bg-transparent text-[#d4e157] hover:border-[#d4e157] hover:bg-[#d4e157]/10"
                    : "border-emerald-400 bg-transparent text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50"
                }
              `}
            >
              <span>View All Services</span>
              <FiArrowRight
                aria-hidden="true"
                className="text-sm transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      <div
        className="
          pointer-events-none absolute inset-y-0 right-0 hidden w-[42%]
          items-center justify-center md:flex
        "
      >
        <span
          aria-hidden="true"
          className={`
            absolute h-[185px] w-[185px] rounded-full border
            lg:h-[225px] lg:w-[225px] ${orbit}
          `}
        />

        <span
          aria-hidden="true"
          className={`
            absolute h-[240px] w-[240px] rounded-full border border-dashed
            lg:h-[275px] lg:w-[275px] ${orbitDash}
          `}
        />

        <span
          aria-hidden="true"
          className={`
            absolute right-[12%] top-[25%] h-2.5 w-2.5 rounded-full
            ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"}
          `}
        />

        <span
          aria-hidden="true"
          className={`
            absolute bottom-[23%] left-[12%] h-2 w-2 rounded-full
            ${isDarkMode ? "bg-[#06b6d4]" : "bg-cyan-500"}
          `}
        />

        <span
          className={`
            relative flex h-20 w-20 items-center justify-center
            rounded-[24px] border lg:h-24 lg:w-24 ${iconBox}
          `}
        >
          <Icon className="text-3xl lg:text-4xl" aria-hidden="true" />
        </span>
      </div>

      <div
        aria-hidden="true"
        className={`
          absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2
          bg-gradient-to-r
          ${
            isDarkMode
              ? "from-transparent via-[#06b6d4]/60 to-transparent"
              : "from-transparent via-emerald-400/60 to-transparent"
          }
        `}
      />
    </article>
  );
};

const StackedCard = ({ service, index, progress, isDarkMode }) => {
  const isBase = index === 0;

  const enterStart = isBase ? 0 : START + (index - 1) * SPAN;
  const enterEnd = enterStart + SPAN;

  const y = useTransform(
    progress,
    isBase ? [0, 1] : [enterStart, enterEnd],
    isBase ? ["0vh", "0vh"] : ["110vh", "0vh"],
  );

  const visibility = useTransform(progress, (latestProgress) => {
    if (isBase || latestProgress >= enterStart) {
      return "visible";
    }

    return "hidden";
  });

  return (
    <motion.div
      style={{
        y,
        visibility,
        opacity: 1,
        scale: 1,
        zIndex: index + 1,
      }}
      className="
        h-full lg:h-auto w-full max-w-[calc(100vw-24px)]
        sm:max-w-[700px] md:max-w-[820px]
        lg:max-w-[1020px] xl:max-w-[1080px]
      "
    >
      <ServiceCardFace service={service} isDarkMode={isDarkMode} />
    </motion.div>
  );
};

const OurServices = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      <section
        ref={sectionRef}
        id="our-services"
        aria-labelledby="our-services-heading"
        style={{
          height: SECTION_HEIGHT,
        }}
        className={`
          relative
          ${
            isDarkMode
              ? "bg-[#050508]"
              : "border-b border-t border-slate-100 bg-white"
          }
        `}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            aria-hidden="true"
            className={`
              pointer-events-none absolute inset-0
              ${
                isDarkMode
                  ? "bg-[radial-gradient(circle_at_50%_35%,rgba(6,182,212,0.10),transparent_62%)]"
                  : "bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.09),transparent_62%)]"
              }
            `}
          />

          <div
            aria-hidden="true"
            className={`
              pointer-events-none absolute left-1/2 top-[42%]
              h-[350px] w-[700px] -translate-x-1/2 rounded-full
              blur-[150px]
              ${isDarkMode ? "bg-[#d4e157]/[0.025]" : "bg-cyan-300/[0.035]"}
            `}
          />

          <div className="relative z-10 flex h-screen flex-col px-3 sm:px-4">
            <motion.header
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="
                mx-auto w-full max-w-6xl shrink-0 text-center
                pt-[44px] sm:pt-[68px] md:pt-[55px] lg:pt-[58px]
              "
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-3 sm:mb-4"
              >
                <div
                  className={`
                    inline-flex items-center gap-2 rounded-full border
                    px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] font-bold
                    uppercase tracking-[0.15em] sm:text-xs
                    ${
                      isDarkMode
                        ? "border-[#d4e157]/30 bg-[#d4e157]/10 text-[#d4e157]"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }
                  `}
                >
                  <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                    <span
                      className={`
                        absolute inset-0 animate-ping rounded-full opacity-75
                        ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"}
                      `}
                    />
                    <span
                      className={`
                        relative h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5
                        ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"}
                      `}
                    />
                  </span>
                  OUR SERVICES
                </div>
              </motion.div>

              <motion.h2
                id="our-services-heading"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.65 }}
                className={`
                  mx-auto max-w-[1100px] font-black uppercase
                  leading-[0.95] tracking-tight text-[27px]
                  sm:text-4xl md:text-5xl lg:text-[62px] xl:text-[70px]
                  ${isDarkMode ? "text-white" : "text-[#07172f]"}
                `}
              >
                <span className="block">PERFORMANCE MARKETING</span>
                <span
                  className={`
                    block bg-gradient-to-r bg-clip-text text-transparent
                    ${
                      isDarkMode
                        ? "from-[#d4e157] to-[#06b6d4]"
                        : "from-emerald-500 to-cyan-600"
                    }
                  `}
                >
                  SOLUTIONS THAT DELIVER
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.18, duration: 0.6 }}
                className={`
                  mx-auto mt-5 max-w-4xl px-3 text-[11px] leading-5
                  sm:mt-5 sm:px-0 sm:text-sm sm:leading-7 md:mt-5
                  md:text-[15px] ${
                    isDarkMode ? "text-gray-400" : "text-slate-600"
                  }
                `}
              >
                Powerful performance marketing solutions built to connect
                brands, partners and audiences while driving measurable growth.
              </motion.p>
            </motion.header>

            <div
              className="
                relative mx-auto min-h-0 w-full max-w-[1200px] flex-1
                pt-8 pb-14 sm:pt-9 sm:pb-16 md:pt-16 md:pb-28
                lg:pt-20 lg:pb-36
              "
            >
              {services.map((service, index) => (
                <div
                  key={service.id}
                 className="
                  absolute left-0 right-0 bottom-4 flex justify-center
                  top-8 sm:top-9 md:top-16
                  lg:top-6 lg:bottom-8
                  max-lg:bottom-8
                "
                >
                  <StackedCard
                    service={service}
                    index={index}
                    progress={scrollYProgress}
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurServices;