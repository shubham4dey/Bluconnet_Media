import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { wpGet } from "../services/wpApi";
/* WordPress content is author-supplied, not ours: it is sanitized before it
   reaches dangerouslySetInnerHTML (see services/sanitizeHtml.js). */
import { sanitizeHtml } from "../services/sanitizeHtml";
import "./BlogDetails.css";

const BlogDetails = () => {
  const { slug } = useParams();
  const { isDarkMode } = useTheme();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");

        const { ok, data } = await wpGet("/wp/v2/posts", {
          slug,
          _embed: "",
        });

        if (!ok || !Array.isArray(data)) {
          throw new Error("Failed to fetch blog");
        }

        if (!data.length) {
          throw new Error("Blog not found");
        }

        setPost(data[0]);
      } catch (err) {
        console.error("Blog Details Error:", err);
        setError(err.message || "Unable to load blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <main className={`blog-details-page ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="blog-details-status">
          <div className="blog-details-spinner"></div>
          <h2>Loading article...</h2>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className={`blog-details-page ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="blog-details-status">
          <h2>{error || "Blog not found"}</h2>
          <Link to="/blog" className="back-to-blogs">
            ← Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  /* Untrusted HTML from the WordPress REST API — sanitized, never injected raw. */
  const safeTitle = sanitizeHtml(post.title && post.title.rendered);
  const safeContent = sanitizeHtml(post.content && post.content.rendered);

  return (
    <main className={`blog-details-page ${isDarkMode ? "dark-mode" : ""}`}>
      <section className="blog-details-header">
        <Link to="/blog" className="back-to-blogs">
          ← Back to Blogs
        </Link>

        <p className="blog-details-date">{formattedDate}</p>

        <h1
          dangerouslySetInnerHTML={{
            __html: safeTitle,
          }}
        />
      </section>

      <article className="blog-details-container">
        <div
          className="wordpress-blog-content"
          dangerouslySetInnerHTML={{
            __html: safeContent,
          }}
        />
      </article>
    </main>
  );
};

export default BlogDetails;
