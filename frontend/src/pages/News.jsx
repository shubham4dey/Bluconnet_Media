import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaSearch, FaTimes } from "react-icons/fa";
import { getPublishedNews, resolveUrl } from "../services/newsApi";
import { NEWS_CARD_FALLBACK } from "../utils/newsImageFallback";
import "./News.css";

const News = () => {
  const { isDarkMode } = useTheme();
  const [newsList, setNewsList] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    // Global published-news API — no admin/user/portal scoping.
    getPublishedNews().then((res) => {
      const list = (res && res.ok && res.data) || [];
      setNewsList(list);
      setFilteredNews(list);
    });
  }, []);

  // Real-time search filter (ONLY BY HEADING/TITLE)
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNews(newsList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = newsList.filter((post) => {
        const title = post.title.toLowerCase();
        return title.includes(query);
      });
      setFilteredNews(filtered);
    }
  }, [searchQuery, newsList]);

  return (
    <main className={`news-page ${isDarkMode ? "dark-mode" : ""}`}>
      <section className="news-hero">
        <div className="news-label-badge">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full animate-ping ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"}`}
            ></span>
          </span>
          OUR NEWS
        </div>
        <h1>
          Latest News & <span className="gradient-text">Insights</span>
        </h1>
        <p>
          Discover the latest updates, trends, and announcements from BluConnet
          Media to help businesses grow in the digital world.
        </p>

        {/* SEARCH BOX - Same design as Blog */}
        <div
          className={`news-search-box ${isSearchFocused ? "search-focused" : ""}`}
        >
          <div className="news-search-inner">
            <div className="news-search-border"></div>
            <div className="news-search-content">
              <div className="news-search-left">
                <div className="news-search-icon-wrapper">
                  <FaSearch className="news-search-icon" />
                </div>
                <input
                  type="text"
                  placeholder="Search news by heading..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="news-search-input"
                />
              </div>

              <div className="news-search-right">
                {searchQuery && (
                  <>
                    <span className="news-search-count">
                      <span className="count-number">
                        {filteredNews.length}
                      </span>
                      <span className="count-label">
                        result{filteredNews.length !== 1 ? "s" : ""}
                      </span>
                    </span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="news-search-clear"
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="news-content">
        {filteredNews.length === 0 ? (
          <div className="news-status">
            <h2>{searchQuery ? "No news found" : "No news found"}</h2>
            <p>
              {searchQuery
                ? "Try searching with different keywords in headings"
                : "News articles are currently unavailable. Check back later or add from Admin Panel!"}
            </p>
          </div>
        ) : (
          <div className="news-grid">
            {filteredNews.map((post, index) => (
              <article
                className="news-card"
                key={post.id}
                style={{ animationDelay: `${0.1 + (index % 9) * 0.05}s` }}
              >
                <Link to={`/news/${post.id}`} className="news-card-link">
                  <div className="news-image-wrapper">
                    {post.imageUrl ? (
                      <img
                        src={resolveUrl(post.imageUrl)}
                        alt={post.title}
                        className="news-image"
                        loading="lazy"
                        onError={(e) => {
                          // An inline placeholder is used instead of an
                          // external placeholder service: those no longer
                          // serve images, so a failing image used to end up
                          // as a broken icon. The card (class, size, layout)
                          // is unchanged.
                          e.target.onerror = null;
                          e.target.src = NEWS_CARD_FALLBACK;
                        }}
                      />
                    ) : (
                      <div className="news-image-placeholder">
                        <span>BluConnet Media</span>
                      </div>
                    )}
                    <span className="news-date">{post.date}</span>
                  </div>
                  <div className="news-card-content text-left">
                    <h2 className="news-title text-left">{post.title}</h2>
                    <p className="news-excerpt text-left">{post.shortDesc}</p>
                    <span className="news-read-more text-left">
                      Read More <span>→</span>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default News;
