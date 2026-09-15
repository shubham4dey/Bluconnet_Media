export const getThemeColors = (isDarkMode) => {
  return {
    // Section Backgrounds
    sectionBg: isDarkMode
      ? "bg-[#0a0e27]"
      : "bg-gradient-to-br from-slate-50 via-white to-cyan-50/30",
    cardBg: isDarkMode ? "bg-[#0f1535]" : "bg-white/80 backdrop-blur-xl",
    innerCardBg: isDarkMode
      ? "bg-[#0a0e27]"
      : "bg-gradient-to-br from-slate-50 to-white",

    // Text Colors
    textColor: isDarkMode ? "text-white" : "text-slate-900",
    textMuted: isDarkMode ? "text-gray-400" : "text-slate-600",
    textLight: isDarkMode ? "text-gray-500" : "text-slate-500",
    textGray: isDarkMode ? "text-gray-300" : "text-gray-700",

    // Borders
    borderColor: isDarkMode ? "border-white/10" : "border-slate-200/60",
    borderColorLight: isDarkMode ? "border-white/5" : "border-gray-100",

    // Badge Colors
    badgeBg: isDarkMode
      ? "bg-[#0f4c5c]/30"
      : "bg-gradient-to-r from-[#d4e157]/20 to-[#06b6d4]/20",
    badgeBorder: isDarkMode ? "border-[#0f4c5c]/50" : "border-[#d4e157]/30",
    badgeText: isDarkMode ? "text-[#d4e157]" : "text-slate-700",

    // Button Colors
    secondaryBtnBg: isDarkMode
      ? "bg-white/5"
      : "bg-slate-100/80 backdrop-blur-sm",
    secondaryBtnBorder: isDarkMode ? "border-white/20" : "border-slate-300/60",
    secondaryBtnText: isDarkMode ? "text-white" : "text-slate-900",
    trustedByText: isDarkMode ? "text-white" : "text-slate-700",

    // Glow Effects
    glowLeft: isDarkMode ? "bg-blue-500/10" : "bg-emerald-500/5",
    glowRight: isDarkMode ? "bg-cyan-500/10" : "bg-[#06b6d4]/5",

    // Grid Pattern
    gridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",

    // Shadows
    navShadow: isDarkMode ? "shadow-[#d4e157]/5" : "shadow-gray-300/50",
    cardShadow: isDarkMode ? "shadow-black/50" : "shadow-slate-300/50",

    // Mobile Menu
    mobileMenuBg: isDarkMode ? "bg-[#0a0e27]/98" : "bg-white/98",
    dropdownBg: isDarkMode ? "bg-[#0a0e27]/95" : "bg-white/95",
    navBorder: isDarkMode ? "border-[#d4e157]/20" : "border-gray-200",

    // ============ CONSISTENT HEADING GRADIENTS ============
    headingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    badgeGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    buttonGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    accentLineGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    // ============ MARQUEE BANNER COLORS ============
    marqueeBrightGradient: isDarkMode
      ? "linear-gradient(135deg, #d4e157 0%, #fbbf24 100%)"
      : "linear-gradient(135deg, #10b981 0%, #34d399 100%)",

    marqueeDarkGradient: isDarkMode
      ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
      : "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",

    marqueeBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",

    // ============ SECTION SPECIFIC COLORS ============
    apvisionHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    awardsHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    clientsHeadingGradient: isDarkMode
      ? "from-[#d4e157] via-[#f0a500] to-[#06b6d4]"
      : "from-emerald-500 via-amber-500 to-cyan-600",

    contactHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    featuresHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    footerLogoGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    guideHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    subscribeHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    insightsHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    testimonialsHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    realOutcomesHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-emerald-600 to-cyan-600",

    techPartnersHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    whyChooseUsHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    servicesHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    statsHeadingGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",

    // ============ APVision Specific Colors ============
    dashboardFrameBg: isDarkMode
      ? "bg-gradient-to-br from-[#0f1535] to-[#0a0e27]"
      : "bg-gradient-to-br from-white to-slate-50",
    dashboardImageBg: isDarkMode ? "bg-[#1a1f4d]" : "bg-slate-100",
    dashboardBorder: isDarkMode ? "border-[#d4e157]/30" : "border-slate-200",
    urlBarBg: isDarkMode ? "bg-white/5" : "bg-slate-100",
    statCardBg: isDarkMode ? "bg-white/5" : "bg-slate-100/80",

    accordionBorderColor: isDarkMode ? "border-white/10" : "border-slate-200",
    accordionActiveBorder: isDarkMode
      ? "border-[#d4e157]/30"
      : "border-[#d4e157]/50",
    accordionInactiveText: isDarkMode ? "text-white" : "text-slate-900",
    accordionHoverText: isDarkMode ? "text-[#06b6d4]" : "text-[#06b6d4]",
    accordionActiveText: isDarkMode ? "text-[#d4e157]" : "text-[#854d0e]",

    iconBgColor: isDarkMode ? "bg-opacity-10" : "bg-opacity-20",
    plusIconBg: isDarkMode ? "bg-white/5" : "bg-slate-100",
    plusIconBorder: isDarkMode ? "border-white/20" : "border-slate-300",
    plusIconText: isDarkMode ? "text-white" : "text-slate-700",

    shapeOpacity: isDarkMode ? "opacity-10" : "opacity-30",
    shapeColor1: isDarkMode ? "text-[#d4e157]" : "text-[#854d0e]",
    shapeColor2: isDarkMode ? "text-[#06b6d4]" : "text-[#0e7490]",

    // ============ AwardsBar Specific Colors ============
    awardsBarBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    awardsBarBorder: isDarkMode ? "border-white/5" : "border-slate-200",
    awardsBarText: isDarkMode ? "text-white" : "text-slate-900",
    awardsBarHoverText: isDarkMode
      ? "hover:text-[#d4e157]"
      : "hover:text-[#06b6d4]",
    awardsBarFadeFrom: isDarkMode ? "from-[#0a0e27]" : "from-white",
    awardsBarFallbackText: isDarkMode ? "text-gray-300" : "text-slate-700",

    // ============ AwardsSection Specific Colors ============
    awardsSectionBg: isDarkMode
      ? "bg-[#0a0e27]"
      : "bg-gradient-to-br from-slate-50 via-white to-cyan-50/30",
    awardsHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    awardsMutedText: isDarkMode ? "text-gray-400" : "text-slate-600",
    awardsYearTagText: isDarkMode ? "text-gray-300" : "text-slate-700",
    awardsBorderLight: isDarkMode ? "border-white/10" : "border-slate-200",
    awardsBorderMedium: isDarkMode ? "border-white/20" : "border-slate-300",
    awardsBorderStrong: isDarkMode ? "border-white/30" : "border-slate-300",
    awardsBgWhite5: isDarkMode ? "bg-white/5" : "bg-slate-100/50",
    awardsBgWhite10: isDarkMode ? "bg-white/10" : "bg-slate-200/60",
    awardsBgWhite20: isDarkMode ? "bg-white/20" : "bg-slate-200/80",
    awardsIconBadgeGradient: isDarkMode
      ? "from-white/20 to-white/5"
      : "from-slate-200 to-slate-100",
    awardsStatsCardGradient: isDarkMode
      ? "from-white/5 to-white/0"
      : "from-slate-100/80 to-white/50",
    awardsAccentLineGradient: isDarkMode
      ? "from-white/60 to-white/20"
      : "from-slate-400/60 to-slate-300/20",
    awardsGlassReflection: isDarkMode
      ? "from-white/10 to-transparent"
      : "from-white/40 to-transparent",
    awardsHoverGlow: isDarkMode ? "bg-white/10" : "bg-slate-300/20",
    awardsWave1: isDarkMode
      ? "from-[#d4e157]/10 via-transparent to-[#06b6d4]/10"
      : "from-[#d4e157]/5 via-transparent to-[#06b6d4]/5",
    awardsWave2: isDarkMode
      ? "from-[#06b6d4]/10 via-transparent to-[#d4e157]/10"
      : "from-[#06b6d4]/5 via-transparent to-[#d4e157]/5",

    // ============ Clients Section - PREMIUM ============
    clientsSectionBg: isDarkMode
      ? "bg-gradient-to-br from-[#0a0e27] via-[#0f1535] to-[#0a0e27]"
      : "bg-gradient-to-br from-slate-50 via-white to-cyan-50/30",
    clientsHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    clientsMutedText: isDarkMode ? "text-gray-400" : "text-slate-600",
    clientsBadgeBg: isDarkMode
      ? "bg-gradient-to-r from-[#d4e157]/20 to-[#06b6d4]/20 border border-[#d4e157]/30"
      : "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200",
    clientsBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    clientsBadgeIcon: isDarkMode ? "text-[#d4e157]" : "text-emerald-500",
    clientsCardBg: isDarkMode
      ? "bg-white/5 backdrop-blur-xl border border-white/10"
      : "bg-white/80 backdrop-blur-xl border border-slate-200",
    clientsCardHoverBorder: isDarkMode
      ? "hover:border-[#d4e157]/50 hover:bg-white/10"
      : "hover:border-emerald-300 hover:bg-white",
    clientsCardText: isDarkMode
      ? "text-white opacity-60 group-hover:opacity-100 group-hover:text-[#d4e157]"
      : "text-slate-700 opacity-60 group-hover:opacity-100 group-hover:text-emerald-600",
    clientsCardShadow: isDarkMode
      ? "shadow-lg shadow-black/20"
      : "shadow-lg shadow-slate-200/50",
    clientsCardHoverShadow: isDarkMode
      ? "hover:shadow-xl hover:shadow-[#d4e157]/20"
      : "hover:shadow-xl hover:shadow-emerald-200/50",
    clientsStripeColor: isDarkMode ? "#1e3a8a" : "#10b981",
    clientsStripeOpacity: isDarkMode ? "opacity-10" : "opacity-5",
    clientsStripeGradient: isDarkMode
      ? "bg-gradient-to-r from-[#0a0e27] via-[#0a0e27]/60 to-transparent"
      : "bg-gradient-to-r from-white via-white/60 to-transparent",
    clientsGlowLeft: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-200/30",
    clientsGlowRight: isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-200/30",
    clientsGlowCenter: isDarkMode ? "bg-purple-500/5" : "bg-purple-200/20",
    clientsStatBg: isDarkMode
      ? "bg-gradient-to-br from-white/5 to-white/0 border border-white/10"
      : "bg-gradient-to-br from-white to-slate-50 border border-slate-200",
    clientsStatNumber: isDarkMode ? "text-[#d4e157]" : "text-emerald-600",
    clientsStatLabel: isDarkMode ? "text-gray-400" : "text-slate-600",
    clientsFloatingBg: isDarkMode
      ? "bg-gradient-to-br from-[#d4e157]/10 to-[#06b6d4]/10 border border-[#d4e157]/20"
      : "bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200",

    // ============ ContactForm Section Colors ============
    contactSectionBg: isDarkMode
      ? "bg-gradient-to-b from-[#1e3a8a] via-[#3b82f6] to-[#06b6d4]"
      : "bg-gradient-to-b from-emerald-600 via-teal-500 to-cyan-500",
    contactCardBg: isDarkMode
      ? "bg-[#0a0e27]/90 backdrop-blur-md border border-white/10"
      : "bg-white/95 backdrop-blur-md border border-slate-200",
    contactCardShadow: isDarkMode
      ? "shadow-2xl shadow-black/50"
      : "shadow-2xl shadow-slate-300/50",
    contactHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    contactMutedText: isDarkMode ? "text-white/90" : "text-slate-700",
    contactLabelText: isDarkMode ? "text-white" : "text-slate-900",
    contactBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    contactInputBg: isDarkMode ? "bg-white" : "bg-white",
    contactInputText: isDarkMode ? "text-black" : "text-slate-900",
    contactInputFocus: isDarkMode
      ? "focus:ring-cyan-400"
      : "focus:ring-emerald-400",
    contactCheckboxColor: isDarkMode
      ? "text-cyan-600 focus:ring-cyan-400"
      : "text-emerald-600 focus:ring-emerald-400",
    contactLinkColor: isDarkMode ? "text-cyan-400" : "text-emerald-600",
    contactStripeColor: isDarkMode
      ? "rgba(59, 130, 246, 0.5)"
      : "rgba(16, 185, 129, 0.5)",
    contactStripeOpacity: isDarkMode ? "opacity-30" : "opacity-20",

    // ============ FeaturesGrid Section Colors ============
    featuresSectionBg: isDarkMode
      ? "bg-[#0a0e27]"
      : "bg-gradient-to-br from-slate-50 via-white to-cyan-50/30",
    featuresGlowLeft: isDarkMode ? "bg-emerald-500/5" : "bg-emerald-200/20",
    featuresGlowRight: isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-200/20",
    featuresGridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",
    featuresShapeColor1: isDarkMode ? "text-[#d4e157]" : "text-emerald-400",
    featuresShapeColor2: isDarkMode ? "text-[#06b6d4]" : "text-cyan-400",
    featuresShapeOpacity: isDarkMode ? "opacity-10" : "opacity-15",
    featuresImageBorder: isDarkMode
      ? "border-[#d4e157]/30"
      : "border-emerald-300",
    featuresImageOverlay: isDarkMode
      ? "bg-gradient-to-t from-[#0a0e27] via-[#0a0e27]/40 to-transparent"
      : "bg-gradient-to-t from-black/20 via-black/10 to-transparent",
    featuresImageGlow: isDarkMode
      ? "radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 60%)"
      : "radial-gradient(circle at 50% 50%, #10b981 0%, transparent 70%)",
    featuresImageBorderGlow: isDarkMode
      ? "from-[#d4e157]/20 via-[#06b6d4]/20 to-[#d4e157]/20"
      : "from-emerald-300/15 via-cyan-300/15 to-emerald-300/15",
    featuresDiamondGlow: isDarkMode ? "bg-emerald-500/40" : "bg-emerald-400/30",
    featuresDiamondColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-500",
    featuresBadgeBg: "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]",
    featuresBadgeText: "text-[#0a0e27]",
    featuresCardBg: isDarkMode
      ? "from-[#0f1535] to-[#0a0e27] border-white/10"
      : "from-white to-slate-50 border-slate-200",
    featuresCardHoverBorder: isDarkMode
      ? "hover:border-[#d4e157]/50"
      : "hover:border-emerald-300",
    featuresCardShadow: isDarkMode ? "" : "shadow-lg shadow-slate-200/50",
    featuresCardGlowYellow: isDarkMode
      ? "bg-emerald-500/10 group-hover:bg-emerald-500/20"
      : "bg-emerald-200/20 group-hover:bg-emerald-200/40",
    featuresCardGlowCyan: isDarkMode
      ? "bg-[#06b6d4]/10 group-hover:bg-[#06b6d4]/20"
      : "bg-cyan-200/20 group-hover:bg-cyan-200/40",
    featuresCardTitle: isDarkMode
      ? "text-white group-hover:text-[#d4e157]"
      : "text-slate-900 group-hover:text-emerald-600",
    featuresCardPoints: isDarkMode ? "text-gray-400" : "text-slate-600",
    featuresBottomAccent: "from-[#d4e157] to-[#06b6d4]",

    // ============ Footer Colors ============
    footerBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    footerGlowLeft: isDarkMode ? "bg-emerald-500/5" : "bg-emerald-200/30",
    footerGlowRight: isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-200/30",
    footerGridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",
    footerHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    footerContentText: isDarkMode ? "text-gray-300" : "text-slate-600",
    footerMutedText: isDarkMode ? "text-gray-400" : "text-slate-500",
    footerLinkHover: isDarkMode
      ? "hover:text-[#d4e157]"
      : "hover:text-emerald-600",
    footerSocialBg: isDarkMode
      ? "bg-white/5 border border-white/10"
      : "bg-slate-100 border border-slate-200",
    footerSocialHoverBg: isDarkMode
      ? "hover:bg-gradient-to-br hover:from-[#d4e157] hover:to-[#06b6d4] hover:border-transparent"
      : "hover:bg-gradient-to-br hover:from-emerald-500 hover:to-cyan-600 hover:border-transparent",
    footerSocialIcon: isDarkMode
      ? "text-white group-hover:text-[#0a0e27]"
      : "text-slate-700 group-hover:text-white",
    footerHeadingUnderline: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    footerPhoneIconBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30 group-hover:bg-emerald-500/20"
      : "bg-emerald-100 border border-emerald-200 group-hover:bg-emerald-200",
    footerPhoneIconColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-600",
    footerEmailIconBg: isDarkMode
      ? "bg-[#06b6d4]/10 border border-[#06b6d4]/30 group-hover:bg-[#06b6d4]/20"
      : "bg-cyan-100 border border-cyan-200 group-hover:bg-cyan-200",
    footerEmailIconColor: isDarkMode ? "text-[#06b6d4]" : "text-cyan-600",
    footerAddressIconBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30 group-hover:bg-emerald-500/20"
      : "bg-emerald-100 border border-emerald-200 group-hover:bg-emerald-200",
    footerAddressIconColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-600",
    footerDivider: isDarkMode
      ? "from-transparent via-[#d4e157]/50 to-transparent"
      : "from-transparent via-emerald-500/50 to-transparent",

    // ============ Guide2026 Section Colors ============
    guideSectionBg: isDarkMode
      ? "bg-gradient-to-b from-[#0a0e27] to-[#0f1535]"
      : "bg-gradient-to-b from-slate-50 via-white to-cyan-50/30",
    guideGlowRight: isDarkMode ? "bg-emerald-500/5" : "bg-emerald-200/30",
    guideGlowLeft: isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-200/30",
    guideGridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",
    guideShapeColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-400",
    guideShapeOpacity: isDarkMode ? "opacity-10" : "opacity-20",
    guideBadgeBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30"
      : "bg-emerald-50 border border-emerald-200",
    guideBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    guideHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    guideSubheadingText: isDarkMode ? "text-gray-400" : "text-slate-600",
    guideDescriptionText: isDarkMode ? "text-gray-300" : "text-slate-700",
    guideAccordionText: isDarkMode ? "text-white" : "text-slate-900",
    guideAccordionHoverText: isDarkMode ? "text-[#06b6d4]" : "text-cyan-600",
    guideAccordionActiveText: isDarkMode
      ? "text-[#d4e157]"
      : "text-emerald-600",
    guideContentText: isDarkMode ? "text-gray-400" : "text-slate-600",
    guideAccordionBorder: isDarkMode ? "border-white/10" : "border-slate-200",
    guideAccordionActiveBorder: isDarkMode
      ? "border-[#d4e157]/30"
      : "border-emerald-300",
    guideAccordionIconBg: isDarkMode
      ? "bg-white/5 border border-white/20"
      : "bg-slate-100 border border-slate-200",
    guideAccordionIconHoverBorder: isDarkMode
      ? "group-hover:border-[#06b6d4]/50"
      : "group-hover:border-cyan-300/50",
    guideAccordionActiveIcon: isDarkMode
      ? "bg-gradient-to-br from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-lg shadow-[#d4e157]/30"
      : "bg-gradient-to-br from-[#d4e157] to-[#06b6d4] text-white shadow-lg shadow-emerald-200/50",
    guideImageBorder: isDarkMode ? "border-[#d4e157]/30" : "border-emerald-300",
    guideImageOverlay: isDarkMode
      ? "opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#0a0e27]/90 via-[#0a0e27]/80 to-[#0a0e27]/90"
      : "opacity-0 group-hover:opacity-100 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80",
    guideCircleBorder: isDarkMode
      ? "border-[#06b6d4]/50"
      : "border-cyan-400/50",
    guideCircleBorderInner: isDarkMode
      ? "border-[#06b6d4]/30"
      : "border-cyan-400/30",
    guideOverlayText: isDarkMode ? "text-[#d4e157]" : "text-[#d4e157]",
    guideOverlayHeading: isDarkMode ? "text-white" : "text-white",
    guideLogoBadge: isDarkMode ? "bg-white" : "bg-white",
    guideLogoText: isDarkMode ? "text-white" : "text-white",
    guideContentVisibility: "opacity-0 group-hover:opacity-100",
    guideFloatingBadgeBg: isDarkMode
      ? "bg-gradient-to-br from-[#d4e157] to-[#06b6d4] text-[#0a0e27]"
      : "bg-gradient-to-br from-[#d4e157] to-[#06b6d4] text-white",
    guideDownloadBtnBg: isDarkMode
      ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] hover:shadow-[#d4e157]/30"
      : "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-white hover:shadow-emerald-200/50",

    // ============ SubscribeSection Colors ============
    subscribeSectionBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    subscribeGlowLeft: isDarkMode ? "bg-emerald-500/5" : "bg-emerald-200/20",
    subscribeGlowRight: isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-200/20",
    subscribeGridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",
    subscribeShapeColor1: isDarkMode ? "text-[#d4e157]" : "text-emerald-400",
    subscribeShapeColor2: isDarkMode ? "text-[#06b6d4]" : "text-cyan-400",
    subscribeShapeOpacity: isDarkMode ? "opacity-10" : "opacity-20",
    subscribeCardBg: isDarkMode
      ? "from-[#0f1535] to-[#0a0e27] border-[#d4e157]/30"
      : "from-white to-slate-50 border-emerald-300",
    subscribeCardShadow: isDarkMode
      ? "shadow-2xl shadow-black/50"
      : "shadow-2xl shadow-slate-300/50",
    subscribeCardGlowYellow: isDarkMode
      ? "bg-emerald-500/10"
      : "bg-emerald-200/30",
    subscribeCardGlowCyan: isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-200/30",
    subscribeBadgeBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30"
      : "bg-emerald-50 border border-emerald-200",
    subscribeBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    subscribeHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    subscribeLabelText: isDarkMode ? "text-white" : "text-slate-900",
    subscribeMutedText: isDarkMode ? "text-gray-400" : "text-slate-600",
    subscribeDecorativeLine: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    subscribeInputBg: isDarkMode ? "bg-white/5" : "bg-slate-50",
    subscribeInputBorder: isDarkMode ? "border-white/10" : "border-slate-200",
    subscribeInputText: isDarkMode ? "text-white" : "text-slate-900",
    subscribeInputFocus: isDarkMode
      ? "focus:border-[#d4e157]/50 focus:bg-white/10"
      : "focus:border-emerald-400 focus:bg-white",
    subscribeInputIcon: isDarkMode ? "text-gray-400" : "text-slate-500",
    subscribeInputPlaceholder: isDarkMode
      ? "placeholder-gray-500"
      : "placeholder-slate-400",
    subscribeCheckboxBorder: isDarkMode
      ? "border-white/20"
      : "border-slate-300",
    subscribeCheckboxBg: isDarkMode ? "bg-white/5" : "bg-white",
    subscribeCheckboxColor: isDarkMode
      ? "text-[#d4e157] focus:ring-[#d4e157]/30"
      : "text-emerald-500 focus:ring-emerald-400/30",
    subscribeLinkColor: isDarkMode
      ? "text-[#06b6d4] hover:text-[#d4e157]"
      : "text-emerald-600 hover:text-emerald-700",
    subscribeButtonBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] hover:shadow-[#d4e157]/30"
      : "from-[#d4e157] to-[#06b6d4] text-white hover:shadow-emerald-200/50",

    // ============ Insights Section Colors ============
    insightsSectionBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    insightsGlowRight: isDarkMode ? "bg-emerald-500/5" : "bg-emerald-200/20",
    insightsGlowLeft: isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-200/20",
    insightsGridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",
    insightsShapeColor1: isDarkMode ? "text-[#d4e157]" : "text-emerald-400",
    insightsShapeColor2: isDarkMode ? "text-[#06b6d4]" : "text-cyan-400",
    insightsShapeOpacity: isDarkMode ? "opacity-10" : "opacity-20",
    insightsBadgeBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30"
      : "bg-emerald-50 border border-emerald-200",
    insightsBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    insightsHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    insightsMutedText: isDarkMode ? "text-gray-400" : "text-slate-600",
    insightsCardTitle: isDarkMode ? "text-white" : "text-slate-900",
    insightsCardTitleHover: isDarkMode
      ? "group-hover:text-[#d4e157]"
      : "group-hover:text-emerald-600",
    insightsCardDesc: isDarkMode ? "text-gray-400" : "text-slate-700",
    insightsCardDescSmall: isDarkMode ? "text-gray-500" : "text-slate-600",
    insightsMetaText: isDarkMode ? "text-gray-500" : "text-slate-500",
    insightsLinkColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-600",
    insightsCardBg: isDarkMode
      ? "from-[#0f1535] to-[#0a0e27] border-white/10"
      : "from-white to-slate-50 border-slate-200",
    insightsCardHoverBorder: isDarkMode
      ? "hover:border-[#d4e157]/50"
      : "hover:border-emerald-300",
    insightsCardHoverBorderSmall: isDarkMode
      ? "hover:border-[#06b6d4]/50"
      : "hover:border-cyan-300",
    insightsCardGlowYellow: isDarkMode
      ? "bg-emerald-500/10 group-hover:bg-emerald-500/20"
      : "bg-emerald-200/30 group-hover:bg-emerald-200/50",
    insightsCardGlowCyan: isDarkMode
      ? "bg-[#06b6d4]/10 group-hover:bg-[#06b6d4]/20"
      : "bg-cyan-200/30 group-hover:bg-cyan-200/50",
    insightsIconBadgeBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30"
      : "bg-emerald-50 border border-emerald-200",
    insightsIconColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-600",
    insightsTypeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    insightsTypeTextSmall: isDarkMode ? "text-[#06b6d4]" : "text-cyan-600",
    insightsFeaturedBadgeBg: "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]",
    insightsFeaturedBadgeText: "text-[#0a0e27]",
    insightsImageOverlay: isDarkMode
      ? "bg-gradient-to-r from-transparent to-[#0a0e27]/80 md:block hidden"
      : "bg-gradient-to-r from-transparent to-white/80 md:block hidden",
    insightsImageOverlayMobile: isDarkMode
      ? "bg-gradient-to-t from-[#0a0e27]/80 to-transparent md:hidden"
      : "bg-gradient-to-t from-white/80 to-transparent md:hidden",
    insightsNumberText: "text-white/50",
    insightsCardBorder: isDarkMode ? "border-white/10" : "border-slate-200",
    insightsCardBorderTop: isDarkMode ? "border-white/10" : "border-slate-200",
    insightsCardBorderTopSmall: isDarkMode
      ? "border-white/5"
      : "border-slate-100",
    insightsAccentLine: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    insightsAccentLineSmall: isDarkMode
      ? "from-[#06b6d4] to-[#d4e157]"
      : "from-cyan-600 to-emerald-500",
    insightsButtonBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[#d4e157]/20 hover:shadow-[#d4e157]/40"
      : "from-[#d4e157] to-[#06b6d4] text-white shadow-emerald-200/50 hover:shadow-emerald-300/50",
    insightsCardShadow: isDarkMode
      ? "shadow-2xl shadow-black/50"
      : "shadow-xl shadow-slate-200/50",

    // ============ LogoSlider Colors ============
    logoSliderBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",

    // ============ Testimonials Section Colors ============
    testimonialsSectionBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    testimonialsGlowLeft: isDarkMode ? "bg-emerald-500/5" : "bg-emerald-200/20",
    testimonialsGlowRight: isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-200/20",
    testimonialsGridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",
    testimonialsShapeColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-400",
    testimonialsShapeOpacity: isDarkMode ? "opacity-10" : "opacity-20",
    testimonialsBadgeBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30"
      : "bg-emerald-50 border border-emerald-200",
    testimonialsBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    testimonialsHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    testimonialsQuoteText: isDarkMode ? "text-gray-200" : "text-slate-800",
    testimonialsMutedText: isDarkMode ? "text-gray-400" : "text-slate-600",
    testimonialsCounterText: isDarkMode ? "text-gray-500" : "text-slate-500",
    testimonialsCompanyText: isDarkMode ? "text-[#d4e157]" : "text-emerald-600",
    testimonialsSignatureText: isDarkMode ? "text-gray-400" : "text-slate-600",
    testimonialsProgressText: isDarkMode ? "text-gray-400" : "text-slate-600",
    testimonialsCounterGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    testimonialsDecorativeLine: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    testimonialsSignatureLine: isDarkMode
      ? "from-[#d4e157] to-transparent"
      : "from-emerald-500 to-transparent",
    testimonialsLeftCardBg: isDarkMode
      ? "from-[#0f1535] to-[#0a0e27] border-[#d4e157]/30"
      : "from-white to-slate-50 border-emerald-300",
    testimonialsLeftCardGlow: isDarkMode
      ? "from-[#d4e157]/10 to-transparent"
      : "from-emerald-200/30 to-transparent",
    testimonialsLogoBadgeBg: isDarkMode
      ? "bg-white/5 border border-white/10"
      : "bg-slate-100 border border-slate-200",
    testimonialsRightCardBg: isDarkMode
      ? "from-[#0f1535]/80 to-[#0a0e27]/80 border-white/10"
      : "from-white/90 to-slate-50/90 border-slate-200",
    testimonialsRightCardGlow: isDarkMode
      ? "from-[#06b6d4]/10 to-[#d4e157]/10"
      : "from-cyan-200/20 to-emerald-200/20",
    testimonialsQuoteIcon: isDarkMode
      ? "text-[#d4e157]/10"
      : "text-emerald-500/10",
    testimonialsStarColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-500",
    testimonialsProgressBg: isDarkMode ? "bg-white/10" : "bg-slate-200",
    testimonialsProgressFill: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    testimonialsPrevBtnBg: isDarkMode
      ? "bg-white/5 border-white/20 hover:border-[#d4e157]/50 hover:bg-emerald-500/10"
      : "bg-slate-100 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50",
    testimonialsPrevBtnIcon: isDarkMode
      ? "text-white group-hover:text-[#d4e157]"
      : "text-slate-700 group-hover:text-emerald-600",
    testimonialsNextBtnBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4] hover:shadow-[#d4e157]/30"
      : "from-[#d4e157] to-[#06b6d4] hover:shadow-emerald-200/50",
    testimonialsNextBtnIcon: isDarkMode ? "text-[#0a0e27]" : "text-white",
    testimonialsCardShadow: isDarkMode
      ? "shadow-2xl shadow-black/50"
      : "shadow-xl shadow-slate-200/50",

    // ============ RealOutcomes Section Colors ============
    realOutcomesSectionBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    realOutcomesStripeColor: isDarkMode ? "#1e3a8a" : "#10b981",
    realOutcomesStripeOpacity: isDarkMode ? "opacity-20" : "opacity-10",
    realOutcomesHeaderCardBg: isDarkMode
      ? "bg-gradient-to-r from-[#0f1535] to-[#0a0e27] border border-[#d4e157]/30"
      : "bg-white border-2 border-emerald-300",
    realOutcomesHeaderCardShadow: isDarkMode
      ? ""
      : "shadow-lg shadow-emerald-100/50",
    realOutcomesHeaderIconBg: "bg-gradient-to-br from-[#d4e157] to-[#06b6d4]",
    realOutcomesHeaderIconInner: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    realOutcomesCardBg: isDarkMode ? "bg-white" : "bg-white",
    realOutcomesCardShadow: isDarkMode
      ? "shadow-2xl shadow-black/50"
      : "shadow-2xl shadow-slate-300/50",
    realOutcomesCompanyNameGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    realOutcomesTitleText: isDarkMode ? "text-black" : "text-slate-900",
    realOutcomesDecorativeLine: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    realOutcomesDescText: isDarkMode ? "text-gray-600" : "text-slate-600",
    realOutcomesStatsGradient: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    realOutcomesStatsLabel: isDarkMode ? "text-gray-500" : "text-slate-500",
    realOutcomesHighlightText: isDarkMode ? "text-gray-700" : "text-slate-700",
    realOutcomesHighlightBold: isDarkMode ? "text-black" : "text-slate-900",
    realOutcomesButtonBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] hover:shadow-[#d4e157]/30"
      : "from-[#d4e157] to-[#06b6d4] text-white hover:shadow-emerald-200/50",
    realOutcomesDotActive: isDarkMode
      ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]"
      : "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]",
    realOutcomesDotInactive: isDarkMode
      ? "bg-white/30 hover:bg-white/50"
      : "bg-slate-300 hover:bg-slate-400",
    realOutcomesNavBtnBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4] hover:shadow-[#d4e157]/30"
      : "from-[#d4e157] to-[#06b6d4] hover:shadow-emerald-200/50",
    realOutcomesNavBtnIcon: isDarkMode ? "text-[#0a0e27]" : "text-white",
    realOutcomesImageOverlay: isDarkMode
      ? "from-black/40 via-black/30 to-black/50"
      : "from-black/30 via-black/20 to-black/40",

    // ============ TechPartners Section Colors ============
    techPartnersSectionBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    techPartnersGlowLeft: isDarkMode ? "bg-emerald-500/5" : "bg-emerald-200/20",
    techPartnersGlowRight: isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-200/20",
    techPartnersGridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",
    techPartnersShapeColor1: isDarkMode ? "text-[#d4e157]" : "text-emerald-400",
    techPartnersShapeColor2: isDarkMode ? "text-[#06b6d4]" : "text-cyan-400",
    techPartnersShapeOpacity: isDarkMode ? "opacity-10" : "opacity-20",
    techPartnersBadgeBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30"
      : "bg-emerald-50 border border-emerald-200",
    techPartnersBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    techPartnersHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    techPartnersMutedText: isDarkMode ? "text-gray-400" : "text-slate-600",
    techPartnersPartnerName: isDarkMode ? "text-white" : "text-slate-900",
    techPartnersTagline: isDarkMode ? "text-gray-400" : "text-slate-600",
    techPartnersCardBg: isDarkMode
      ? "from-[#0f1535] to-[#0a0e27] border-white/10"
      : "from-white to-slate-50 border-slate-200",
    techPartnersCardHoverBorderLeft: isDarkMode
      ? "hover:border-[#d4e157]/50"
      : "hover:border-emerald-300",
    techPartnersCardHoverBorderRight: isDarkMode
      ? "hover:border-[#06b6d4]/50"
      : "hover:border-cyan-300",
    techPartnersCardShadow: isDarkMode
      ? "shadow-lg shadow-black/20"
      : "shadow-lg shadow-slate-200/50",
    techPartnersHubOuterRing: isDarkMode
      ? "border-[#d4e157]/20"
      : "border-emerald-300/30",
    techPartnersHubInnerRing: isDarkMode
      ? "border-[#06b6d4]/20"
      : "border-cyan-300/30",
    techPartnersHubGlow: isDarkMode
      ? "from-[#d4e157]/20 to-[#06b6d4]/20"
      : "from-emerald-200/30 to-cyan-200/30",
    techPartnersHubBg: isDarkMode
      ? "from-[#0f1535] to-[#0a0e27] border-[#d4e157]/40"
      : "from-white to-slate-50 border-emerald-300",
    techPartnersHubInnerGradient: isDarkMode
      ? "from-[#d4e157]/10 to-[#06b6d4]/10"
      : "from-emerald-100/30 to-cyan-100/30",
    techPartnersHubLogoBg: "bg-gradient-to-br from-[#d4e157] to-[#06b6d4]",
    techPartnersHubLogoText: "text-[#0a0e27]",
    techPartnersHubTitle: isDarkMode ? "text-white" : "text-slate-900",
    techPartnersHubSubtitle: isDarkMode ? "text-[#06b6d4]" : "text-cyan-600",
    techPartnersBadgeBgGradient: "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]",
    techPartnersBadgeTextGradient: "text-[#0a0e27]",
    techPartnersDotYellow: isDarkMode
      ? "bg-emerald-500 shadow-[#d4e157]/50"
      : "bg-emerald-400 shadow-emerald-300/50",
    techPartnersDotCyan: isDarkMode
      ? "bg-[#06b6d4] shadow-[#06b6d4]/50"
      : "bg-cyan-400 shadow-cyan-300/50",
    techPartnersDotGradient: "bg-gradient-to-br from-[#d4e157] to-[#06b6d4]",
    techPartnersStatsCardBg: isDarkMode
      ? "from-[#0f1535] to-[#0a0e27] border-white/10 hover:border-[#d4e157]/50"
      : "from-white to-slate-50 border-slate-200 hover:border-emerald-300",
    techPartnersStatsIconBg: isDarkMode
      ? "from-[#d4e157]/20 to-[#06b6d4]/20 border-[#d4e157]/30"
      : "from-emerald-100/50 to-cyan-100/50 border-emerald-200",
    techPartnersStatsIconColor: isDarkMode
      ? "text-[#d4e157]"
      : "text-emerald-600",
    techPartnersStatsNumber: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    techPartnersStatsLabel: isDarkMode ? "text-gray-400" : "text-slate-600",
    techPartnersButtonBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[#d4e157]/20 hover:shadow-[#d4e157]/40"
      : "from-[#d4e157] to-[#06b6d4] text-white shadow-emerald-200/50 hover:shadow-emerald-300/50",

    // ============ WhyChooseUs Section Colors ============
    whyChooseUsSectionBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    whyChooseUsGlowLeft: isDarkMode ? "bg-emerald-500/5" : "bg-emerald-200/20",
    whyChooseUsGlowRight: isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-200/20",
    whyChooseUsGridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",
    whyChooseUsShapeColor1: isDarkMode ? "text-[#06b6d4]" : "text-cyan-400",
    whyChooseUsShapeColor2: isDarkMode ? "text-[#d4e157]" : "text-emerald-400",
    whyChooseUsShapeOpacity: isDarkMode ? "opacity-10" : "opacity-20",
    whyChooseUsBadgeBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30"
      : "bg-emerald-50 border border-emerald-200",
    whyChooseUsBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    whyChooseUsHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    whyChooseUsDescriptionText: isDarkMode ? "text-gray-400" : "text-slate-600",
    whyChooseUsStatNumber: isDarkMode ? "text-white" : "text-slate-900",
    whyChooseUsStatNumberHover: isDarkMode
      ? "group-hover:text-[#d4e157]"
      : "group-hover:text-emerald-600",
    whyChooseUsStatLabel: isDarkMode ? "text-cyan-400" : "text-cyan-600",
    whyChooseUsStatLabelHover: isDarkMode
      ? "group-hover:text-cyan-300"
      : "group-hover:text-cyan-700",
    whyChooseUsStatLine: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    whyChooseUsCardBg: isDarkMode
      ? "from-[#0f1535] to-[#0a0e27] border-[#d4e157]/30"
      : "from-white to-slate-50 border-emerald-300",
    whyChooseUsCardShadow: isDarkMode
      ? "shadow-2xl shadow-black/50"
      : "shadow-2xl shadow-slate-300/50",
    whyChooseUsStarColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-500",
    whyChooseUsDecorativeBadgeBg:
      "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]",
    whyChooseUsDecorativeBadgeText: "text-[#0a0e27]",
    whyChooseUsBottomBarBg: isDarkMode
      ? "from-[#0a0e27] via-[#0a0e27]/80 to-transparent"
      : "from-white via-white/80 to-transparent",
    whyChooseUsBottomBarStat1: isDarkMode
      ? "text-[#d4e157]"
      : "text-emerald-600",
    whyChooseUsBottomBarStat2: isDarkMode ? "text-[#06b6d4]" : "text-cyan-600",
    whyChooseUsBottomBarLabel: isDarkMode ? "text-gray-300" : "text-slate-700",
    whyChooseUsBottomBarDivider: isDarkMode ? "bg-white/20" : "bg-slate-300",

    // ============ Services Section Colors ============
    servicesSectionBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    servicesGlowRight: isDarkMode ? "bg-emerald-500/5" : "bg-emerald-200/20",
    servicesGlowLeft: isDarkMode ? "bg-[#06b6d4]/5" : "bg-cyan-200/20",
    servicesGridDotColor: isDarkMode ? "#ffffff" : "#0a0e27",
    servicesBadgeBg: isDarkMode
      ? "bg-emerald-500/10 border border-[#d4e157]/30"
      : "bg-emerald-50 border border-emerald-200",
    servicesBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    servicesHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    servicesTitleText: isDarkMode ? "text-white" : "text-slate-900",
    servicesDescriptionText: isDarkMode ? "text-gray-400" : "text-slate-600",
    servicesCardTitle: isDarkMode ? "text-white" : "text-slate-900",
    servicesCardDesc: isDarkMode ? "text-gray-400" : "text-slate-600",
    servicesCounterActive: isDarkMode ? "text-[#d4e157]" : "text-emerald-600",
    servicesCounterMuted: isDarkMode ? "text-gray-500" : "text-slate-500",
    servicesStarIcon: isDarkMode ? "text-[#d4e157]" : "text-emerald-500",
    servicesTabActive: isDarkMode
      ? "text-[#d4e157] border-b-2 border-[#d4e157]"
      : "text-emerald-600 border-b-2 border-emerald-600",
    servicesTabInactive: isDarkMode
      ? "text-gray-400 hover:text-white"
      : "text-slate-500 hover:text-slate-900",
    servicesTabBorder: isDarkMode ? "border-white/10" : "border-slate-200",
    servicesPrimaryBtnBg: isDarkMode
      ? "bg-emerald-500 text-[#0a0e27] hover:bg-[#c0cc45] shadow-[#d4e157]/20"
      : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200/50",
    servicesSecondaryBtnBg: isDarkMode
      ? "bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-[#d4e157]/30"
      : "bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-200 hover:border-emerald-300",
    servicesCardBg: isDarkMode
      ? "from-[#0f1535] to-[#0a0e27] border-white/10 border-t-[#d4e157] hover:border-[#d4e157]/50"
      : "from-white to-slate-50 border-slate-200 border-t-emerald-500 hover:border-emerald-300",
    servicesCardGlowYellow: isDarkMode
      ? "bg-emerald-500/10 group-hover:bg-emerald-500/20"
      : "bg-emerald-200/30 group-hover:bg-emerald-200/50",
    servicesCardGlowCyan: isDarkMode
      ? "bg-[#06b6d4]/10 group-hover:bg-[#06b6d4]/20"
      : "bg-cyan-200/30 group-hover:bg-cyan-200/50",
    servicesCardShadow: isDarkMode
      ? "shadow-2xl shadow-black/50"
      : "shadow-xl shadow-slate-200/50",
    servicesIconBadgeBg: isDarkMode
      ? "from-[#d4e157]/20 to-[#06b6d4]/20 border-[#d4e157]/30"
      : "from-emerald-100/50 to-cyan-100/50 border-emerald-200",
    servicesIconDot: "bg-gradient-to-br from-[#d4e157] to-[#06b6d4]",
    servicesArrowPrevBg: isDarkMode
      ? "bg-emerald-500 hover:bg-[#c0cc45] shadow-[#d4e157]/20"
      : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200/50",
    servicesArrowPrevIcon: isDarkMode ? "text-[#0a0e27]" : "text-white",
    servicesArrowNextBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4] hover:shadow-[#d4e157]/40"
      : "from-[#d4e157] to-[#06b6d4] hover:shadow-emerald-300/50",
    servicesArrowNextIcon: isDarkMode ? "text-[#0a0e27]" : "text-white",

    // ============ Stats Section Colors ============
    statsSectionBg: isDarkMode ? "bg-[#0a0e27]" : "bg-white",
    statsBgGradient: isDarkMode
      ? "from-[#0f1535]/30 to-transparent"
      : "from-slate-100/30 to-transparent",
    statsGlowYellow: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-200/30",
    statsGlowCyan: isDarkMode ? "bg-cyan-500/10" : "bg-cyan-200/30",
    statsImageGlow: isDarkMode
      ? "from-[#d4e157]/20 to-cyan-500/20"
      : "from-emerald-200/30 to-cyan-200/30",
    statsImageContainerBg: isDarkMode
      ? "from-[#0f1535] to-[#1a1f3a] border-white/10"
      : "from-white to-slate-50 border-slate-200",
    statsImageOverlay: isDarkMode
      ? "from-[#0a0e27]/60 via-transparent to-transparent"
      : "from-white/60 via-transparent to-transparent",
    statsFallbackBg: isDarkMode
      ? "from-[#0f1535] to-[#1a1f3a]"
      : "from-white to-slate-50",
    statsFallbackIconBg: "bg-gradient-to-br from-[#d4e157] to-cyan-500",
    statsFallbackIconColor: "text-[#0a0e27]",
    statsFallbackText: isDarkMode ? "text-gray-400" : "text-slate-600",
    statsStarburstColor: isDarkMode ? "text-[#d4e157]" : "text-emerald-500",
    statsBadgeBg: isDarkMode
      ? "bg-[#0f4c5c]/30 border border-[#0f4c5c]/50"
      : "bg-emerald-50 border border-emerald-200",
    statsBadgeText: isDarkMode ? "text-[#d4e157]" : "text-emerald-700",
    statsDecorativeBadgeBg: "bg-gradient-to-r from-[#d4e157] to-[#06b6d4]",
    statsDecorativeBadgeText: "text-[#0a0e27]",
    statsHeadingText: isDarkMode ? "text-white" : "text-slate-900",
    statsNumber: isDarkMode ? "text-white" : "text-slate-900",
    statsNumberHover: isDarkMode
      ? "group-hover:text-[#d4e157]"
      : "group-hover:text-emerald-600",
    statsLabel: isDarkMode ? "text-cyan-400" : "text-cyan-600",
    statsLabelHover: isDarkMode
      ? "group-hover:text-cyan-300"
      : "group-hover:text-cyan-700",
    statsLine: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4]"
      : "from-[#d4e157] to-[#06b6d4]",
    statsButtonBg: isDarkMode
      ? "from-[#d4e157] to-[#06b6d4] text-[#0a0e27] hover:shadow-[#d4e157]/30"
      : "from-[#d4e157] to-[#06b6d4] text-white hover:shadow-emerald-200/50",
    statsCardShadow: isDarkMode
      ? "shadow-2xl shadow-black/50"
      : "shadow-2xl shadow-slate-300/50",
  };
};

export default getThemeColors;
