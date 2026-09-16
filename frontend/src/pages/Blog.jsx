import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaSearch, FaTimes } from "react-icons/fa";
import { wpGet } from "../services/wpApi";
import "./Blog.css";

const POSTS_PER_PAGE = 6;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80";

const Blog = () => {
  const { isDarkMode } = useTheme();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const fetchPosts = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError("");

      const { ok, data, totalPages } = await wpGet("/wp/v2/posts", {
        _embed: "",
        per_page: POSTS_PER_PAGE,
        page: pageNumber,
      });

      if (!ok || !Array.isArray(data)) {
        throw new Error("Failed to fetch blogs");
      }

      if (pageNumber === 1) {
        setPosts(data);
        setFilteredPosts(data);
      } else {
        setPosts((previousPosts) => [...previousPosts, ...data]);
        setFilteredPosts((previousPosts) => [...previousPosts, ...data]);
      }

      setPage(pageNumber);
      setHasMore(pageNumber < totalPages);
    } catch (err) {
      console.error("Blog API Error:", err);
      setError("Unable to load blogs at the moment.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Real-time search filter (ONLY BY HEADING/TITLE)
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter((post) => {
        // Sirf heading (title) mein search karega
        const title = cleanTitle(post.title.rendered).toLowerCase();
        return title.includes(query);
      });
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const getFeaturedImage = (post) => {
    return (
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || FALLBACK_IMAGE
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const cleanTitle = (title) => {
    return title.replace(/<[^>]+>/g, "");
  };

  if (loading) {
    return (
      <main className={`blog-page ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="blog-status">
          <div className="blog-spinner"></div>
          <h2>Loading insights...</h2>
        </div>
      </main>
    );
  }

  if (error && posts.length === 0) {
    return (
      <main className={`blog-page ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="blog-status">
          <h2>{error}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className={`blog-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* HERO WITH SEARCH BOX */}
      <section className="blog-hero">
        <div className="blog-label-badge">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full animate-ping ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"} opacity-75`}
            ></span>
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isDarkMode ? "bg-[#d4e157]" : "bg-emerald-500"}`}
            ></span>
          </span>
          OUR INSIGHTS
        </div>

        <h1>
          Ideas, Insights &{" "}
          <span className="gradient-text">Industry Trends</span>
        </h1>

        <p>
          Explore the latest strategies, trends and insights from BluConnet
          Media to help businesses grow in the digital world.
        </p>

        {/* SEARCH BOX - TOP RIGHT POSITION */}
        <div
          className={`hero-search-box ${isSearchFocused ? "search-focused" : ""}`}
        >
          <div className="hero-search-inner">
            <div className="hero-search-border"></div>
            <div className="hero-search-content">
              <div className="hero-search-left">
                <div className="hero-search-icon-wrapper">
                  <FaSearch className="hero-search-icon" />
                </div>
                <input
                  type="text"
                  placeholder="Search by heading..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="hero-search-input"
                />
              </div>

              <div className="hero-search-right">
                {searchQuery && (
                  <>
                    <span className="hero-search-count">
                      <span className="count-number">
                        {filteredPosts.length}
                      </span>
                      <span className="count-label">
                        result{filteredPosts.length !== 1 ? "s" : ""}
                      </span>
                    </span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hero-search-clear"
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

      {/* BLOGS */}
      <section className="blog-content">
        <div className="blog-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article className="blog-card" key={post.id}>
                <Link to={`/blog/${post.slug}`} className="blog-card-link">
                  <div className="blog-image-wrapper">
                    <img
                      src={getFeaturedImage(post)}
                      alt={cleanTitle(post.title.rendered)}
                      className="blog-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <span className="blog-date">{formatDate(post.date)}</span>
                  </div>

                  <div className="blog-card-content">
                    <h2
                      className="blog-title"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />

                    <div
                      className="blog-excerpt"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />

                    <span className="blog-read-more">
                      Read More
                      <span>→</span>
                    </span>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <div className="blog-no-results">
              <div className="no-results-icon">
                <FaSearch />
              </div>
              <h3>No articles found</h3>
              <p>Try searching with different keywords in headings</p>
            </div>
          )}
        </div>

        {/* LOAD MORE */}
        {hasMore && filteredPosts.length > 0 && searchQuery === "" && (
          <div className="blog-load-more-wrapper">
            <button
              type="button"
              className="blog-load-more"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  Loading
                  <span className="load-more-spinner"></span>
                </>
              ) : (
                <>
                  Load More
                  <span>↓</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* LOAD MORE ERROR */}
        {error && posts.length > 0 && (
          <p className="blog-load-error">{error}</p>
        )}
      </section>
    </main>
  );
};

export default Blog;
