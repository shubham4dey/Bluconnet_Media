import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaNewspaper,
  FaExternalLinkAlt,
  FaCheck,
  FaEnvelope,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { getPublishedNews, resolveUrl } from "../services/newsApi";

const Guide2026 = () => {
  const { isDarkMode } = useTheme();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchNews = async () => {
      try {
        const res = await getPublishedNews();
        const list =
          res && res.ok && Array.isArray(res.data) ? res.data : [];

        if (mounted) setNewsList(list);
      } catch (error) {
        console.error("News fetch error:", error);
        if (mounted) setNewsList([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNews();

    return () => {
      mounted = false;
    };
  }, []);

  const latestNews = [...newsList]
    .sort(
      (a, b) =>
        new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    )
    .slice(0, 6);

  const getExcerpt = (post) => {
    const text = post?.shortDesc || post?.description || post?.content || "";
    return text.length > 145 ? `${text.slice(0, 145).trim()}...` : text;
  };

  return (
    <section
      className={`relative overflow-hidden px-4 py-20 transition-colors duration-500 md:py-28 ${
        isDarkMode ? "bg-[#050508]" : "bg-white"
      }`}
    >
      {/* PREMIUM BACKGROUND */}
      <div
        className={`pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full blur-3xl ${
          isDarkMode ? "bg-[#d4e157]/10" : "bg-emerald-500/10"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl ${
          isDarkMode ? "bg-[#06b6d4]/10" : "bg-cyan-500/10"
        }`}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDarkMode ? "#d4e157" : "#10b981"
          } 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Decorative cube */}
      <div
        className={`pointer-events-none absolute right-8 top-20 hidden h-40 w-40 md:block ${
          isDarkMode ? "opacity-10" : "opacity-15"
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          className={isDarkMode ? "text-[#d4e157]" : "text-emerald-500"}
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

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-left"
        >
          <div
            className={`mb-5 inline-flex items-center gap-3 rounded-full border px-4 py-2 ${
              isDarkMode
                ? "border-[#d4e157]/30 bg-[#d4e157]/10 text-[#d4e157]"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                }`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"
                }`}
              />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              OUR NEWS
            </span>
          </div>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                className={`max-w-4xl text-4xl font-black leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Latest News &{" "}
                <span
                  className={`bg-gradient-to-r bg-clip-text text-transparent ${
                    isDarkMode
                      ? "from-[#d4e157] to-[#06b6d4]"
                      : "from-emerald-500 to-cyan-600"
                  }`}
                >
                  Insights
                </span>
              </h2>

              <p
                className={`mt-5 max-w-2xl text-base leading-7 md:text-lg ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Discover the latest updates, industry trends, announcements,
                and insights from BluConnet Media.
              </p>
            </div>

            <Link
              to="/news"
              className={`group inline-flex w-fit shrink-0 items-center gap-3 rounded-full border px-6 py-3.5 text-sm font-bold transition-all duration-300 ${
                isDarkMode
                  ? "border-white/15 bg-white/5 text-white hover:border-[#06b6d4]/50 hover:bg-[#06b6d4]/10"
                  : "border-gray-200 bg-white text-gray-900 shadow-sm hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              View All News
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`animate-pulse overflow-hidden rounded-3xl border ${
                  isDarkMode
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div
                  className={`h-64 ${
                    isDarkMode ? "bg-white/10" : "bg-gray-200"
                  }`}
                />
                <div className="space-y-4 p-6">
                  <div
                    className={`h-3 w-24 rounded ${
                      isDarkMode ? "bg-white/10" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-6 w-4/5 rounded ${
                      isDarkMode ? "bg-white/10" : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-4 w-full rounded ${
                      isDarkMode ? "bg-white/10" : "bg-gray-200"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NEWS CARDS */}
        {!loading && latestNews.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
                className="group"
              >
                <Link
                  to={`/news/${post.id}`}
                  className={`relative block h-full overflow-hidden rounded-3xl border transition-all duration-500 ${
                    isDarkMode
                      ? "border-white/10 bg-[#0b0c12]/90 hover:border-[#d4e157]/30 hover:bg-[#10121a]"
                      : "border-gray-200 bg-white hover:border-emerald-300"
                  }`}
                  style={{
                    boxShadow: isDarkMode
                      ? "0 20px 60px rgba(0,0,0,0.25)"
                      : "0 20px 60px rgba(15,23,42,0.08)",
                  }}
                >
                  {/* IMAGE */}
                  <div className="relative h-64 overflow-hidden sm:h-72">
                    {post.imageUrl ? (
                      <img
                        src={resolveUrl(post.imageUrl)}
                        alt={post.title || "BluConnet Media News"}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center ${
                          isDarkMode
                            ? "bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#062e2e]"
                            : "bg-gradient-to-br from-emerald-50 via-white to-cyan-50"
                        }`}
                      >
                        <FaNewspaper
                          className={`text-6xl ${
                            isDarkMode
                              ? "text-[#d4e157]/40"
                              : "text-emerald-500/30"
                          }`}
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80" />

                    <div className="absolute left-5 top-5">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur-md ${
                          isDarkMode
                            ? "border-white/15 bg-black/30 text-white"
                            : "border-white/40 bg-white/80 text-slate-800"
                        }`}
                      >
                        News
                      </span>
                    </div>

                    {post.date && (
                      <div className="absolute bottom-5 left-5 flex items-center gap-2 text-xs font-semibold text-white drop-shadow-lg">
                        <FaCalendarAlt />
                        <span>{post.date}</span>
                      </div>
                    )}

                    <div
                      className={`absolute right-5 top-5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full border opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${
                        isDarkMode
                          ? "border-white/20 bg-black/30 text-white"
                          : "border-white/50 bg-white/80 text-slate-900"
                      }`}
                    >
                      <FaExternalLinkAlt size={13} />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 text-left">
                    <h3
                      className={`line-clamp-2 text-xl font-extrabold leading-tight transition-colors duration-300 md:text-2xl ${
                        isDarkMode
                          ? "text-white group-hover:text-[#d4e157]"
                          : "text-gray-900 group-hover:text-emerald-600"
                      }`}
                    >
                      {post.title}
                    </h3>

                    <p
                      className={`mt-4 line-clamp-3 text-sm leading-6 md:text-base ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {getExcerpt(post) ||
                        "Read the latest update and insights from BluConnet Media."}
                    </p>

                    <div
                      className={`mt-6 flex items-center justify-between border-t pt-5 ${
                        isDarkMode ? "border-white/10" : "border-gray-100"
                      }`}
                    >
                      <span
                        className={`text-sm font-bold ${
                          isDarkMode ? "text-[#d4e157]" : "text-emerald-600"
                        }`}
                      >
                        Read News
                      </span>

                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-1 ${
                          isDarkMode
                            ? "bg-[#d4e157]/10 text-[#d4e157]"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <FaArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && latestNews.length === 0 && (
          <div
            className={`rounded-3xl border p-12 text-center ${
              isDarkMode
                ? "border-white/10 bg-white/[0.03]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <FaNewspaper
              className={`mx-auto mb-5 text-5xl ${
                isDarkMode ? "text-[#d4e157]/50" : "text-emerald-500/40"
              }`}
            />
            <h3
              className={`text-2xl font-black ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              News coming soon
            </h3>
            <p
              className={`mx-auto mt-3 max-w-xl ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Latest BluConnet Media news and updates will appear here.
            </p>
            <Link
              to="/news"
              className={`mt-7 inline-flex items-center gap-3 rounded-full px-6 py-3 font-bold ${
                isDarkMode
                  ? "bg-[#d4e157] text-[#0a0e27]"
                  : "bg-emerald-500 text-white"
              }`}
            >
              Open News Page
              <FaArrowRight />
            </Link>
          </div>
        )}

        {/* =========================================================
            NEWSLETTER SUBSCRIBE
        ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`mt-16 overflow-hidden rounded-[28px] border p-6 md:p-8 lg:p-10 ${
            isDarkMode
              ? "border-white/10 bg-gradient-to-br from-[#0b1118] via-[#0f172a] to-[#062e2e]"
              : "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50"
          }`}
        >
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            {/* Newsletter Text */}
            <div className="max-w-2xl text-left">
              <div
                className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                  isDarkMode
                    ? "border-[#06b6d4]/30 bg-[#06b6d4]/10 text-[#06b6d4]"
                    : "border-cyan-200 bg-cyan-50 text-cyan-700"
                }`}
              >
                <FaEnvelope className="text-xs" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                  Stay Updated
                </span>
              </div>

              <h3
                className={`text-2xl font-black leading-tight md:text-3xl ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Subscribe to Our Newsletter
              </h3>

              <p
                className={`mt-3 max-w-xl text-sm leading-6 md:text-base ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Get the latest news, digital marketing insights, industry
                updates, and announcements from BluConnet Media directly in
                your inbox.
              </p>
            </div>

            {/* Subscribe Form / Success */}
            <div className="w-full lg:max-w-xl">
              {!subscribed ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    if (!email.trim()) return;

                    // Temporary frontend-only success state.
                    // Replace this with the real API call when backend is ready.
                    setSubscribed(true);
                  }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <div
                    className={`flex min-h-[54px] flex-1 items-center rounded-full border px-5 transition-all duration-300 ${
                      isDarkMode
                        ? "border-white/10 bg-white/5 focus-within:border-[#06b6d4]/50"
                        : "border-gray-200 bg-white focus-within:border-emerald-400 shadow-sm"
                    }`}
                  >
                    <FaEnvelope
                      className={`mr-3 flex-shrink-0 text-sm ${
                        isDarkMode
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className={`w-full bg-transparent text-sm outline-none ${
                        isDarkMode
                          ? "text-white placeholder:text-gray-500"
                          : "text-gray-900 placeholder:text-gray-400"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full px-7 text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_10px_30px_rgba(212,225,87,0.18)] hover:-translate-y-0.5"
                        : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:-translate-y-0.5"
                    }`}
                  >
                    Subscribe
                    <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex min-h-[100px] items-center gap-4 rounded-2xl border px-5 py-4 ${
                    isDarkMode
                      ? "border-emerald-400/20 bg-emerald-400/10"
                      : "border-emerald-200 bg-white shadow-sm"
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.1,
                      type: "spring",
                      stiffness: 220,
                    }}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  >
                    <FaCheck />
                  </motion.div>

                  <div className="text-left">
                    <h4
                      className={`text-base font-extrabold md:text-lg ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      You're Subscribed!
                    </h4>

                    <p
                      className={`mt-1 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Thanks for subscribing. You'll receive our latest
                      updates and insights at{" "}
                      <span
                        className={`font-semibold ${
                          isDarkMode
                            ? "text-[#d4e157]"
                            : "text-emerald-600"
                        }`}
                      >
                        {email}
                      </span>
                      .
                    </p>
                  </div>
                </motion.div>
              )}

              <p
                className={`mt-3 px-2 text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                No spam. Just useful updates, insights, and news.
              </p>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM CTA */}
        {!loading && latestNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <Link
              to="/news"
              className={`group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27] shadow-[0_12px_35px_rgba(212,225,87,0.2)]"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_12px_35px_rgba(16,185,129,0.25)]"
              }`}
            >
              Explore All News
              <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Guide2026;
