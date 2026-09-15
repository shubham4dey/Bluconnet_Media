import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaArrowLeft, FaCalendarAlt, FaClock } from "react-icons/fa";

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const savedNews = localStorage.getItem("bluconnet_news");
    if (savedNews) {
      const parsedNews = JSON.parse(savedNews);
      const found = parsedNews.find((item) => item.id === id);
      setArticle(found);
    }
  }, [id]);

  if (!article) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-[#050508] text-white" : "bg-white text-gray-900"}`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <button
            onClick={() => navigate("/news")}
            className="text-emerald-500 hover:underline font-bold"
          >
            ← Back to News
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen py-28 px-4 ${isDarkMode ? "bg-[#050508] text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button with Theme Colors */}
        <div className="mb-8 text-left lg:mt-12 xl:mt-16">
          <button
            onClick={() => navigate("/news")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 ${
              isDarkMode
                ? "bg-gradient-to-r from-[#d4e157] to-[#06b6d4] text-[#0a0e27]"
                : "bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"
            }`}
          >
            <FaArrowLeft /> Back to News
          </button>
        </div>

        <article
          className={`rounded-3xl overflow-hidden shadow-2xl border ${isDarkMode ? "bg-[#0f1535] border-white/10" : "bg-white border-gray-200"}`}
        >
          {/* FULL WIDTH IMAGE - No cropping, shows complete image */}
          {article.imageUrl && (
            <div className="w-full bg-gray-100 dark:bg-gray-900">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto max-h-[600px] object-contain"
              />
            </div>
          )}

          {/* Content Section Below Image */}
          <div className="p-6 md:p-8 lg:p-10 text-left">
            {/* Date Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 text-left ${isDarkMode ? "bg-[#d4e157]/10 text-[#d4e157]" : "bg-emerald-100 text-emerald-700"}`}
            >
              <FaCalendarAlt />
              <span>{article.date}</span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight text-left ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              {article.title}
            </h1>

            {/* Content */}
            <div
              className={`space-y-6 text-lg leading-relaxed text-left ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {article.fullContent.split("\n").map(
                (paragraph, idx) =>
                  paragraph.trim() && (
                    <p key={idx} className="text-left">
                      {paragraph}
                    </p>
                  ),
              )}
            </div>

            {/* Footer Info */}
            <div
              className={`mt-12 pt-8 border-t text-left ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
            >
              <div
                className={`flex items-center gap-2 text-sm text-left ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                <FaClock />
                <span>Published on {article.date}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};

export default NewsDetails;
