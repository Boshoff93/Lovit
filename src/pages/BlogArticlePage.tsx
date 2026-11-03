import React from "react";
import { Link, useLocation } from "react-router-dom";
import PublicPage from "../components/PublicPage";
import GuideArtwork from "../components/GuideArtwork";
import CodeExample from "../components/CodeExample";
import { SEO } from "../utils/seoHelper";
import { blogPosts, guideMinutes, guideDate } from "../content/blog";
export default function BlogArticlePage() {
  const slug = useLocation().pathname.split("/").filter(Boolean).pop();
  const guide = blogPosts.find((post) => post.slug === slug);
  if (!guide)
    return (
      <PublicPage>
        <SEO
          title="Guide not found | Gruvi"
          description="Browse Gruvi's publishing guides."
          robots="noindex, follow"
        />
        <main className="gr-container gr-page-intro">
          <h1>That guide could not be found.</h1>
          <Link className="gr-button" to="/blog">
            Browse publishing guides
          </Link>
        </main>
      </PublicPage>
    );
  const canonical = `https://agentgruvi.com/blog/${guide.slug}`;
  return (
    <PublicPage>
      <SEO
        title={`${guide.title} | Gruvi`}
        description={guide.description}
        ogType="article"
        canonicalUrl={canonical}
        author="Gruvi"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": canonical + "#article",
              headline: guide.title,
              description: guide.description,
              url: canonical,
              mainEntityOfPage: canonical,
              datePublished: guide.publishedAt,
              dateModified: guide.updatedAt,
              inLanguage: "en",
              image: ["https://agentgruvi.com/gruvi-social.png"],
              author: {
                "@type": "Organization",
                name: "Gruvi",
                url: "https://agentgruvi.com",
              },
              publisher: {
                "@type": "Organization",
                name: "Gruvi",
                url: "https://agentgruvi.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://agentgruvi.com/gruvi.png",
                },
              },
              isPartOf: {
                "@type": "Blog",
                name: "Gruvi publishing guides",
                url: "https://agentgruvi.com/blog",
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Gruvi",
                  item: "https://agentgruvi.com/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: "https://agentgruvi.com/blog",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: guide.title,
                  item: canonical,
                },
              ],
            },
          ],
        }}
      />
      <main className="gr-container">
        <header className="gr-article-intro">
          <nav className="gr-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Gruvi</Link>
            <span aria-hidden="true">/</span>
            <Link to="/blog">Blog</Link>
            <span aria-hidden="true">/</span>
            <span>{guide.category}</span>
          </nav>
          <p className="gr-eyebrow">{guide.category}</p>
          <h1>{guide.title}</h1>
          <p className="gr-lead">{guide.description}</p>
          <p className="gr-guide-meta">
            By <Link to="/">{guide.author}</Link> <span>·</span>{" "}
            <time dateTime={guide.publishedAt}>
              {guideDate(guide.publishedAt)}
            </time>{" "}
            <span>·</span> {guideMinutes(guide)} min read
          </p>
        </header>
        <div className="gr-article-art">
          <GuideArtwork variant={guide.art} />
        </div>
        <div className="gr-article-layout">
          <aside className="gr-article-toc">
            <p className="gr-eyebrow">In this guide</p>
            <nav aria-label="Article sections">
              {guide.sections.map((section) => (
                <a href={`#${section.id}`} key={section.id}>
                  {section.title}
                </a>
              ))}
            </nav>
            <a
              className="gr-text-link"
              href={`/docs/for-agents/guides/${guide.slug}.md`}
            >
              Read as plain text ↗
            </a>
          </aside>
          <article className="gr-article-body">
            <section className="gr-takeaways">
              <h2>What you need to know</h2>
              <ul>
                {guide.takeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            {guide.sections.map((section) => (
              <section
                className="gr-article-section"
                id={section.id}
                key={section.id}
              >
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.code && (
                  <CodeExample
                    label={`${section.code.language} example`}
                    code={section.code.value}
                  />
                )}
                {section.links && (
                  <ul className="gr-article-links">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        {link.href.startsWith("/") ? (
                          <Link to={link.href}>{link.label} →</Link>
                        ) : (
                          <a href={link.href}>{link.label} ↗</a>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <section className="gr-article-next">
              <h2>Put the workflow to work.</h2>
              <p>
                Use the dashboard manually or connect your agent to the same
                publishing API.
              </p>
              <div className="gr-actions">
                <Link className="gr-button" to="/api">
                  Explore the API ↗
                </Link>
                <Link className="gr-text-link" to="/docs/agent-integration">
                  MCP setup →
                </Link>
              </div>
            </section>
          </article>
        </div>
        <section className="gr-section">
          <h2>Keep reading</h2>
          <div className="gr-related-guides">
            {guide.related
              .map((related) => blogPosts.find((post) => post.slug === related))
              .filter(Boolean)
              .map(
                (post) =>
                  post && (
                    <article className="gr-card" key={post.slug}>
                      <p className="gr-eyebrow">{post.category}</p>
                      <h3>
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p>{post.description}</p>
                      <Link className="gr-card-link" to={`/blog/${post.slug}`}>
                        Read guide →
                      </Link>
                    </article>
                  ),
              )}
          </div>
        </section>
      </main>
    </PublicPage>
  );
}
