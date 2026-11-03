import React from "react";
import { Link } from "react-router-dom";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import PublicPage from "../components/PublicPage";
import ApiWorkflowArtwork from "../components/marketing/ApiWorkflowArtwork";
import { SEO } from "../utils/seoHelper";
import { analyticsCoverage } from "../content/apiReference";
const workflows = [
  {
    icon: <CodeRoundedIcon />,
    title: "Upload once. Choose your channels.",
    text: "Bring a finished video, caption and thumbnail. Use exact account targets and check delivery for every destination.",
    href: "/docs/api-reference#group-media",
    label: "Media and publishing API",
  },
  {
    icon: <CalendarMonthRoundedIcon />,
    title: "Schedule a whole batch.",
    text: "Give up to 20 videos their own captions and times. Stable request IDs keep accepted schedules intact when you retry.",
    href: "/docs/api-reference#bulkScheduleVideos",
    label: "Bulk scheduling API",
  },
  {
    icon: <CollectionsRoundedIcon />,
    title: "Tell it in pictures.",
    text: "Upload 2 to 10 images, arrange a carousel and send or schedule it for Instagram or TikTok.",
    href: "/docs/api-reference#group-carousels",
    label: "Carousel API",
  },
  {
    icon: <BarChartRoundedIcon />,
    title: "Read the results.",
    text: "TikTok and YouTube analytics, plus recent-post engagement for Instagram, Facebook and X in beta.",
    href: "/docs/api-reference#group-analytics",
    label: "Analytics API",
  },
];
export default function ApiPage() {
  return (
    <PublicPage className="gr-api-page">
      <SEO
        title="Social Media API for Agents & Developers | Gruvi"
        description="A hosted social media publishing API for finished content. Upload videos, schedule batches, publish image carousels and read analytics through HTTPS or MCP."
        canonicalUrl="https://agentgruvi.com/api"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Gruvi Content Distribution API",
          description:
            "Hosted HTTPS API and local MCP tools for social content distribution.",
          url: "https://agentgruvi.com/api",
          author: {
            "@type": "Organization",
            name: "Gruvi",
            url: "https://agentgruvi.com",
          },
        }}
      />
      <main>
        <section className="gr-container gr-api-hero">
          <div>
            <p className="gr-eyebrow">The Gruvi API</p>
            <h1>
              Social media API.
              <br />
              <span>Built for agents.</span>
            </h1>
            <p className="gr-lead">
              Upload, schedule, publish and measure through one HTTPS API. Built
              for your agent, your scripts and the way you already work.
            </p>
            <div className="gr-actions">
              <Link className="gr-button" to="/docs/api-reference">
                Explore the API reference <span aria-hidden="true">↗</span>
              </Link>
              <Link className="gr-text-link" to="/docs/agent-integration">
                Connect with MCP <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="gr-inline-perks">
              <li>API included in every plan</li>
              <li>OpenAPI 3.1</li>
              <li>Prepare content before subscribing</li>
            </ul>
          </div>
          <ApiWorkflowArtwork />
        </section>
        <section className="gr-container gr-section">
          <div className="gr-section-heading">
            <p className="gr-eyebrow">One API. A useful set of tools.</p>
            <h2>From finished content to the right channel.</h2>
          </div>
          <div className="gr-workflow-grid">
            {workflows.map((item) => (
              <article className="gr-card" key={item.title}>
                <div className="gr-feature-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link className="gr-card-link" to={item.href}>
                  {item.label} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section
          className="gr-container gr-section gr-api-start"
          id="quickstart"
        >
          <div>
            <p className="gr-eyebrow">Start with one working request</p>
            <h2>Connect. Upload. Send. Verify.</h2>
            <p>
              Keep your media, schedules and delivery results in one workflow.
              Use the dashboard whenever you want to take over manually.
            </p>
            <Link className="gr-button" to="/docs/getting-started">
              Follow the quickstart <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ol className="gr-step-list">
            <li>
              <strong>Connect the accounts</strong>
              <p>
                Verify your Gruvi account and connect the channels you own.
                Multiple accounts per platform are supported.
              </p>
            </li>
            <li>
              <strong>Create a named agent key</strong>
              <p>
                Keep it in your environment or secret manager. Send it as a
                bearer token to the Gruvi API.
              </p>
            </li>
            <li>
              <strong>Prepare the content</strong>
              <p>
                Upload finished videos or image sets. Add captions and
                thumbnails without generating anything.
              </p>
            </li>
            <li>
              <strong>Submit and check the outcome</strong>
              <p>
                Publish or schedule with an active plan or trial. Inspect each
                destination before reporting success.
              </p>
            </li>
          </ol>
        </section>
        <section className="gr-container gr-section">
          <p className="gr-eyebrow">Know what you are measuring</p>
          <h2>Five platforms. Clear coverage.</h2>
          <p className="gr-section-copy">
            Choose the connected account, then read the metrics its platform
            makes available. Missing values stay unavailable, never a made-up
            zero.
          </p>
          <div className="gr-table-wrap">
            <table className="gr-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Available metrics</th>
                  <th>Coverage</th>
                </tr>
              </thead>
              <tbody>
                {analyticsCoverage.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={index}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="gr-note">
            Instagram, Facebook and X summaries cover up to 25 recent posts and
            are cached for five minutes. Platform permissions and API access
            apply.
          </p>
        </section>
        <section className="gr-container gr-section gr-resource-grid">
          <article className="gr-card">
            <p className="gr-eyebrow">For humans</p>
            <h2>A reference you can browse.</h2>
            <p>
              Search endpoints, inspect fields and copy examples in Shell,
              JavaScript or Python. No account is needed to read the
              documentation.
            </p>
            <Link className="gr-button" to="/docs/api-reference">
              Browse endpoints <span aria-hidden="true">↗</span>
            </Link>
          </article>
          <article className="gr-card">
            <p className="gr-eyebrow">For agents</p>
            <h2>A contract you can read.</h2>
            <p>
              Download the OpenAPI schema, discover the MCP tools or read
              plain-text guides before taking action.
            </p>
            <div className="gr-card-links">
              <a href="/openapi.json">OpenAPI schema ↗</a>
              <a href="/llms-full.txt">Agent guide ↗</a>
              <a href="/.well-known/mcp.json">MCP manifest ↗</a>
            </div>
          </article>
        </section>
        <section className="gr-container gr-bottom-cta">
          <div>
            <h2>Get your first request working.</h2>
            <p>
              Plans from $10 a month. One three-day trial for eligible accounts.
              Founder support when you need a hand.
            </p>
          </div>
          <Link className="gr-button" to="/pricing">
            View plans <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>
    </PublicPage>
  );
}
