"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiClock, FiTrendingUp, FiX } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";

const SOURCES = [
  {
    name: "AI News",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/artificial-intelligence",
    parse: (data) =>
      (data.items || []).map((a) => ({
        id: a.guid || a.link,
        title: a.title,
        description: a.description
          ? a.description.replace(/<[^>]*>/g, "").slice(0, 200)
          : a.author || "",
        url: a.link,
        image: a.thumbnail || a.enclosure?.link || null,
        source: "Medium",
        date: a.pubDate,
        readTime: null,
        tags: a.categories?.slice(0, 3) || ["AI"],
      })),
  },
  {
    name: "Dev.to",
    url: "https://dev.to/api/articles?tag=ai&top=7&per_page=8",
    parse: (data) =>
      data.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description || a.tag_list?.join(", ") || "",
        url: a.url,
        image: a.cover_image || a.social_image || null,
        source: "Dev.to",
        date: a.published_at,
        readTime: a.reading_time_minutes,
        tags: a.tag_list?.slice(0, 3) || [],
      })),
  },
  {
    name: "HackerNews",
    url: "https://hn.algolia.com/api/v1/search?query=artificial+intelligence+OR+LLM+OR+GPT&tags=story&hitsPerPage=8",
    parse: (data) =>
      (data.hits || []).map((a) => ({
        id: a.objectID,
        title: a.title,
        description: `${a.num_comments || 0} comments • ${a.points || 0} points`,
        url: a.url || `https://news.ycombinator.com/item?id=${a.objectID}`,
        image: null,
        source: "Hacker News",
        date: a.created_at,
        readTime: null,
        tags: ["AI", "Tech"],
      })),
  },
  {
    name: "Reddit",
    url: "https://www.reddit.com/r/artificial/hot.json?limit=10",
    parse: (data) =>
      (data?.data?.children || [])
        .filter((c) => !c.data.stickied)
        .map((c) => {
          const a = c.data;
          return {
            id: a.id,
            title: a.title,
            description: a.selftext
              ? a.selftext.slice(0, 200)
              : `${a.num_comments || 0} comments • ${a.score || 0} upvotes`,
            url: a.url_overridden_by_dest || `https://reddit.com${a.permalink}`,
            image:
              a.thumbnail && a.thumbnail.startsWith("http")
                ? a.thumbnail
                : null,
            source: "Reddit",
            date: new Date(a.created_utc * 1000).toISOString(),
            readTime: null,
            tags: ["r/artificial", ...(a.link_flair_text ? [a.link_flair_text] : [])],
          };
        }),
  },
];

// Only show articles from the last 7 days
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const cardVariant = {
  hidden: { opacity: 0, y: 25 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

export default function AiNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const results = await Promise.allSettled(
          SOURCES.map(async (src) => {
            const res = await fetch(src.url);
            const data = await res.json();
            return src.parse(data);
          })
        );
        const now = Date.now();
        const all = results
          .filter((r) => r.status === "fulfilled")
          .flatMap((r) => r.value)
          .filter((a) => {
            if (!a.title || !a.url) return false;
            // Only keep articles from the last 7 days
            const articleDate = new Date(a.date).getTime();
            return !isNaN(articleDate) && now - articleDate < SEVEN_DAYS_MS;
          });

        // Sort by date descending (newest first)
        all.sort((a, b) => new Date(b.date) - new Date(a.date));
        setArticles(all);
      } catch (err) {
        console.error("Failed to fetch AI news:", err);
      }
      setLoading(false);
    }
    fetchNews();
    // Refresh every 10 minutes
    const interval = setInterval(fetchNews, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="ainews" id="ainews">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">
            <FaRobot style={{ marginRight: 10, verticalAlign: "middle" }} />
            AI News & Trends
          </h2>
          <p className="section-subtitle">
            Latest AI articles, model releases, and trending topics — updated live.
          </p>
        </motion.div>

        {loading ? (
          <div className="news-loading">
            <div className="news-spinner" />
            <p>Fetching latest AI news...</p>
          </div>
        ) : (
          <div className="news-grid">
            {articles.slice(0, 12).map((article, idx) => (
              <motion.div
                className="news-card glass-card"
                key={article.id}
                custom={idx}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                onClick={() => setSelectedArticle(article)}
              >
                {article.image && (
                  <div className="news-card-img">
                    <img src={article.image} alt={article.title} loading="lazy" />
                  </div>
                )}
                <div className="news-card-body">
                  <div className="news-card-meta">
                    <span className="news-source-badge">{article.source}</span>
                    <span className="news-time">
                      <FiClock size={12} /> {timeAgo(article.date)}
                    </span>
                  </div>
                  <h3 className="news-card-title">{article.title}</h3>
                  <p className="news-card-desc">
                    {article.description?.slice(0, 120)}
                    {article.description?.length > 120 ? "..." : ""}
                  </p>
                  <div className="news-card-footer">
                    {article.tags?.map((t) => (
                      <span className="news-tag" key={t}>{t}</span>
                    ))}
                    {article.readTime && (
                      <span className="news-read-time">{article.readTime} min read</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Article Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              className="news-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
            >
              <motion.div
                className="news-modal"
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="news-modal-close"
                  onClick={() => setSelectedArticle(null)}
                >
                  <FiX size={20} />
                </button>

                {selectedArticle.image && (
                  <div className="news-modal-img">
                    <img src={selectedArticle.image} alt={selectedArticle.title} />
                  </div>
                )}

                <div className="news-modal-body">
                  <div className="news-card-meta">
                    <span className="news-source-badge">{selectedArticle.source}</span>
                    <span className="news-time">
                      <FiClock size={12} /> {timeAgo(selectedArticle.date)}
                    </span>
                    {selectedArticle.readTime && (
                      <span className="news-read-time">{selectedArticle.readTime} min read</span>
                    )}
                  </div>

                  <h2 className="news-modal-title">{selectedArticle.title}</h2>
                  <p className="news-modal-desc">{selectedArticle.description}</p>

                  <div className="news-modal-tags">
                    {selectedArticle.tags?.map((t) => (
                      <span className="news-tag" key={t}>{t}</span>
                    ))}
                  </div>

                  <a
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary news-read-btn"
                  >
                    Read Full Article <FiExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
