import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaRegNewspaper,
  FaRegClock,
  FaRegCalendar,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// Professional fallback image agar WordPress se image na aaye
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80";

const Insights = () => {
  const { isDarkMode } = useTheme();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const response = await fetch(
          "https://bluconnetmedia.com/wp-json/wp/v2/posts?per_page=3&_embed",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const posts = await response.json();

        const formattedPosts = posts.map((post) => {
          // Robust image extraction with fallback
          const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
          const imageUrl = featuredMedia?.source_url || FALLBACK_IMAGE;

          return {
            id: post.id,
            type: "BLOG",
            title: post.title.rendered,
            desc: post.excerpt.rendered
              .replace(/<[^>]*>/g, "")
              .replace(/&nbsp;/g, " ")
              .trim(),
            image: imageUrl,
            icon: FaRegNewspaper,
            date: new Date(post.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            readTime: "5 min read",
            slug: post.slug,
          };
        });

        setInsights(formattedPosts);
      } catch (error) {
        console.error("Error fetching latest blogs:", error);
        // Fallback data agar API fail ho jaye
        setInsights([
          {
            id: 1,
            type: "BLOG",
            title: "The Future of Digital Marketing",
            desc: "Explore the latest trends and strategies shaping the digital marketing landscape in 2025 and beyond.",
            image: FALLBACK_IMAGE,
            icon: FaRegNewspaper,
            date: "15 Dec 2024",
            readTime: "5 min read",
            slug: "future-of-digital-marketing",
          },
          {
            id: 2,
            type: "BLOG",
            title: "SEO Best Practices for 2025",
            desc: "Learn how to optimize your website for search engines and drive organic traffic effectively.",
            image: FALLBACK_IMAGE,
            icon: FaRegNewspaper,
            date: "10 Dec 2024",
            readTime: "4 min read",
            slug: "seo-best-practices-2025",
          },
          {
            id: 3,
            type: "BLOG",
            title: "Maximizing ROI with Affiliate Marketing",
            desc: "Discover proven strategies to scale your affiliate program and increase revenue.",
            image: FALLBACK_IMAGE,
            icon: FaRegNewspaper,
            date: "05 Dec 2024",
            readTime: "6 min read",
            slug: "maximizing-roi-affiliate-marketing",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (loading) {
    return (
      <section
        className={`py-20 md:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} transition-colors duration-500`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Loading insights...
          </p>
        </div>
      </section>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <section
      className={`py-20 md:py-28 px-4 ${isDarkMode ? "bg-[#050508]" : "bg-white"} relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Glow Effects */}
      <div
        className={`absolute top-1/4 right-0 w-96 h-96 ${isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"} rounded-full blur-3xl`}
      ></div>
      <div
        className={`absolute bottom-1/4 left-0 w-96 h-96 ${isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-600/10"} rounded-full blur-3xl`}
      ></div>

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDarkMode ? "#d4e157" : "#10b981"} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Background Geometric Shapes */}
      <div
        className={`absolute top-20 right-20 w-32 h-32 md:w-48 md:h-48 ${isDarkMode ? "opacity-10" : "opacity-20"} pointer-events-none`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${isDarkMode ? "text-[#d4e157]" : "text-emerald-500"}`}
        >
          <path
            d="M20 30 L50 10 L80 30 L80 70 L50 90 L20 70 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M20 30 L50 50 L80 30 M50 50 L50 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div
        className={`absolute bottom-20 left-16 w-24 h-24 md:w-40 md:h-40 ${isDarkMode ? "opacity-10" : "opacity-20"} pointer-events-none rotate-12`}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"}`}
        >
          <path
            d="M20 30 L50 10 L80 30 L80 70 L50 90 L20 70 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M20 30 L50 50 L80 30 M50 50 L50 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - Magazine Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between text-start gap-6"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase ${
                  isDarkMode
                    ? "bg-[#d4e157]/10 border border-[#d4e157]/30 text-[#d4e157]"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                }`}
              >
                {/* Blinking Circle */}
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full animate-ping ${
                      isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                    } opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                    }`}
                  ></span>
                </span>

                <span>LATEST UPDATES</span>
              </span>
            </motion.div>

            <h2
              className={`text-3xl md:text-5xl lg:text-6xl font-extrabold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6 leading-tight`}
            >
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                INSIGHTS &{" "}
              </span>
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"}`}
              >
                RESOURCES
              </span>
            </h2>

            <p
              className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-base md:text-lg mt-4 max-w-2xl`}
            >
              Stay ahead with expert insights, strategic guides, and industry
              trends from our partnership marketing specialists.
            </p>
          </div>

          {/* View All Link */}
          <motion.button
            whileHover={{ x: 5 }}
            className={`hidden md:flex items-center gap-2 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} font-bold text-sm uppercase tracking-wider group`}
          >
            View All Articles
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Magazine-Style Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 mb-12">
          {/* Featured Card - Takes 8 columns */}
          <Link
            to={`/blog/${insights[0].slug}`}
            className="lg:col-span-8 block"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8 }}
              className={`text-start group relative bg-gradient-to-br ${isDarkMode ? "from-[#0f1535] to-[#0a0e27]" : "from-white to-slate-50"} border-2 rounded-3xl overflow-hidden ${isDarkMode ? "hover:border-[#d4e157]/50" : "hover:border-emerald-500/50"} transition-all duration-500 cursor-pointer ${isDarkMode ? "shadow-black/50" : "shadow-gray-200/50"} shadow-lg h-full`}
            >
              {/* Hover Glow */}
              <div
                className={`absolute -top-20 -right-20 w-60 h-60 ${isDarkMode ? "bg-[#d4e157]/20" : "bg-emerald-500/20"} rounded-full blur-3xl transition-all duration-500`}
              ></div>
              <div
                className={`absolute -bottom-20 -left-20 w-60 h-60 ${isDarkMode ? "bg-[#06b6d4]/20" : "bg-cyan-600/20"} rounded-full blur-3xl transition-all duration-500`}
              ></div>

              <div className="grid md:grid-cols-2 h-full">
                {/* Image Side */}
                <div className="relative h-64 md:h-auto min-h-[280px] overflow-hidden">
                  <img
                    src={insights[0].image}
                    alt={insights[0].title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-r from-transparent to-[#0a0e27]/80 md:block hidden" : "bg-gradient-to-r from-transparent to-white/80 md:block hidden"}`}
                  ></div>
                  <div
                    className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-t from-[#0a0e27]/80 to-transparent md:hidden" : "bg-gradient-to-t from-white/80 to-transparent md:hidden"}`}
                  ></div>

                  {/* Featured Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <div
                      className={`${isDarkMode ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27]" : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"} px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide shadow-lg flex items-center gap-2`}
                    >
                      <span
                        className={`w-2 h-2 ${isDarkMode ? "bg-[#0a0e27]" : "bg-white"} rounded-full animate-pulse`}
                      ></span>
                      FEATURED
                    </div>
                  </div>

                  {/* Big Number */}
                  <div
                    className={`absolute bottom-6 right-6 text-8xl md:text-9xl font-black ${isDarkMode ? "text-white/10" : "text-gray-900/10"} leading-none select-none drop-shadow-lg`}
                  >
                    01
                  </div>
                </div>

                {/* Content Side */}
                <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between">
                  <div>
                    {/* Type Badge */}
                    <div className="inline-flex items-center gap-2 mb-4">
                      <div
                        className={`w-8 h-8 ${isDarkMode ? "bg-[#d4e157]/20 border border-[#d4e157]/30" : "bg-emerald-100 border border-emerald-200"} rounded-lg flex items-center justify-center`}
                      >
                        {React.createElement(insights[0].icon, {
                          className: `w-4 h-4 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"}`,
                        })}
                      </div>
                      <span
                        className={`${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} text-xs font-bold uppercase tracking-wider`}
                      >
                        {insights[0].type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-2xl md:text-3xl lg:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4 leading-tight ${isDarkMode ? "group-hover:text-[#d4e157]" : "group-hover:text-emerald-600"} transition-colors duration-300`}
                      dangerouslySetInnerHTML={{ __html: insights[0].title }}
                    />

                    {/* Description */}
                    <p
                      className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-base leading-relaxed mb-6`}
                      dangerouslySetInnerHTML={{ __html: insights[0].desc }}
                    />
                  </div>

                  {/* Meta Info */}
                  <div
                    className={`flex flex-wrap items-center justify-between gap-4 pt-6 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
                  >
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <FaRegCalendar
                          className={
                            isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"
                          }
                        />
                        <span>{insights[0].date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaRegClock
                          className={
                            isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"
                          }
                        />
                        <span>{insights[0].readTime}</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div
                      className={`flex items-center gap-2 ${isDarkMode ? "text-[#d4e157]" : "text-emerald-600"} font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all duration-300`}
                    >
                      <span>Read Article</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${isDarkMode ? "from-[#d4e157] to-[#06b6d4]" : "from-emerald-500 to-cyan-600"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>
            </motion.div>
          </Link>

          {/* Right Column - 2 Smaller Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
            {insights.slice(1).map((insight, index) => {
              const IconComponent = insight.icon;

              return (
                <Link
                  key={insight.id}
                  to={`/blog/${insight.slug}`}
                  className="block flex-1"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index + 1) * 0.15 }}
                    whileHover={{ y: -5, x: -5 }}
                    className={`group relative bg-gradient-to-br ${isDarkMode ? "from-[#0f1535] to-[#0a0e27]" : "from-white to-slate-50"} border-2 ${isDarkMode ? "border-white/10" : "border-gray-200"} rounded-2xl overflow-hidden ${isDarkMode ? "hover:border-[#06b6d4]/50" : "hover:border-cyan-500/50"} transition-all duration-500 cursor-pointer h-full`}
                  >
                    {/* Hover Glow */}
                    <div
                      className={`absolute -top-10 -right-10 w-32 h-32 ${isDarkMode ? "bg-[#06b6d4]/20" : "bg-cyan-600/20"} rounded-full blur-2xl transition-all duration-500`}
                    ></div>

                    <div className="flex h-full">
                      {/* Image */}
                      <div className="relative w-32 md:w-40 flex-shrink-0 overflow-hidden">
                        <img
                          src={insight.image}
                          alt={insight.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Number */}
                        <div
                          className={`absolute top-2 left-2 text-4xl font-black ${isDarkMode ? "text-white/10" : "text-gray-900/10"} leading-none drop-shadow-lg`}
                        >
                          0{index + 2}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 p-4 md:p-5 flex flex-col flex-1 min-w-0">
                        {/* Type Badge */}
                        <div className="inline-flex items-center gap-1.5 mb-2">
                          {React.createElement(IconComponent, {
                            className: `w-3 h-3 ${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"}`,
                          })}
                          <span
                            className={`${isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"} text-[10px] md:text-xs font-bold uppercase tracking-wider`}
                          >
                            {insight.type}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className={`text-sm md:text-base font-bold ${isDarkMode ? "text-white" : "text-gray-900"} text-start mb-2 leading-snug ${isDarkMode ? "group-hover:text-[#d4e157]" : "group-hover:text-emerald-600"} transition-colors duration-300 line-clamp-2`}
                          dangerouslySetInnerHTML={{ __html: insight.title }}
                        />

                        {/* Description */}
                        <p
                          className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-xs text-start leading-relaxed mb-3 line-clamp-2 hidden md:block`}
                          dangerouslySetInnerHTML={{ __html: insight.desc }}
                        />

                        {/* Meta */}
                        <div
                          className={`mt-auto flex items-center justify-between gap-2 pt-3 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
                        >
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                            <FaRegClock
                              className={
                                isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"
                              }
                            />
                            <span>{insight.readTime}</span>
                          </div>
                          <FaArrowRight
                            className={`${
                              isDarkMode ? "text-[#06b6d4]" : "text-cyan-600"
                            } text-xs group-hover:translate-x-1 transition-transform`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Accent Line */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${isDarkMode ? "from-[#06b6d4] to-[#d4e157]" : "from-cyan-600 to-emerald-500"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    ></div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ===== PREMIUM STYLISH CTA BUTTON ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/blog">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden group inline-flex items-center px-8 py-4 rounded-xl font-black text-sm md:text-base uppercase tracking-widest transition-all duration-300 gap-3 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_8px_30px_rgba(212,225,87,0.3)] hover:shadow-[0_15px_40px_rgba(212,225,87,0.5)]"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)]"
              }`}
            >
              {/* Animated Shine/Sweep Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
              
              <span className="relative z-20 flex items-center gap-3">
                VIEW ALL INSIGHTS
                <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Insights;