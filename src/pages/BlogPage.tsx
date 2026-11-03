import React, { useState } from "react";
import { Link } from "react-router-dom";
import PublicPage from "../components/PublicPage";
import GuideArtwork from "../components/GuideArtwork";
import { SEO } from "../utils/seoHelper";
import { blogPosts, guideMinutes, guideDate } from "../content/blog";
export default function BlogPage() {
  const [category, setCategory] = useState("All guides");
  const categories = ["All guides", "API & agents", "Publishing", "Analytics"];
  const posts = blogPosts.filter(
    (post) => category === "All guides" || post.category === category,
  );
  return (
    <PublicPage>
      <SEO
        title="Social Publishing Guides for Agents & Creators | Gruvi Blog"
        description="Practical guides to social media APIs, MCP agents, bulk video scheduling, Instagram and TikTok carousels, analytics and reliable publishing."
        canonicalUrl="https://agentgruvi.com/blog"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Gruvi publishing guides",
          url: "https://agentgruvi.com/blog",
          blogPost: blogPosts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: "https://agentgruvi.com/blog/" + post.slug,
            datePublished: post.publishedAt,
            author: {
              "@type": "Organization",
              name: "Gruvi",
              url: "https://agentgruvi.com",
            },
          })),
        }}
      />
      <main className="gr-container">
        <header className="gr-page-intro">
          <p className="gr-eyebrow">The Gruvi blog</p>
          <h1>
            Practical guides.
            <br />
            <span>Better publishing workflows.</span>
          </h1>
          <p className="gr-lead">
            API examples, scheduling advice and clear answers about agents,
            delivery and analytics.
          </p>
          <a className="gr-text-link" href="/blog/rss.xml">
            Subscribe with RSS ↗
          </a>
        </header>
        <nav className="gr-category-filter" aria-label="Filter guides">
          {categories.map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </nav>
        <p className="gr-sr-only" aria-live="polite">
          {posts.length} guides shown
        </p>
        <section className="gr-blog-grid" aria-label="Publishing guides">
          {posts.map((post) => (
            <article className="gr-guide-card" key={post.slug}>
              <Link to={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
                <GuideArtwork variant={post.art} />
              </Link>
              <div className="gr-guide-card-body">
                <p className="gr-guide-meta">
                  {post.category} <span>·</span> {guideMinutes(post)} min read
                </p>
                <h2>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.description}</p>
                <p className="gr-guide-date">
                  <time dateTime={post.publishedAt}>
                    {guideDate(post.publishedAt)}
                  </time>{" "}
                  · By {post.author}
                </p>
                <Link
                  className="gr-card-link"
                  to={`/blog/${post.slug}`}
                  aria-label={`Read ${post.title}`}
                >
                  Read guide <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </section>
        <section className="gr-bottom-cta">
          <div>
            <h2>Looking for an endpoint?</h2>
            <p>Search the API reference and copy a working request shape.</p>
          </div>
          <Link className="gr-button" to="/docs/api-reference">
            Open API reference ↗
          </Link>
        </section>
      </main>
    </PublicPage>
  );
}
