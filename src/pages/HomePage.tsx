import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { RootState } from "../store/store";
import { SEO } from "../utils/seoHelper";
import MarketingHeader from "../components/marketing/MarketingHeader";
import DistributionFooter from "../components/DistributionFooter";
import DistributionAuthDialog from "../components/DistributionAuthDialog";
import PublishingPlans from "../components/PublishingPlans";
import GuideArtwork from "../components/GuideArtwork";
import { blogPosts, guideMinutes } from "../content/blog";
import "../public-content.css";
import {
  DISTRIBUTION_DESCRIPTION,
  publishingPlans,
} from "../config/publishing";
import {
  AgentConnection,
  CalendarPreview,
  DeliveryPreview,
  DistributionFAQ,
  distributionFaqs,
  FeatureSection,
  PlatformGrid,
  PublishingPreview,
  PublishingSteps,
  ManualPublishingArtwork,
  SectionHeading,
  SocialOrbit,
} from "../components/marketing/DistributionShowcase";
import "../distribution.css";
import "../components/marketing/DistributionMarketing.css";

export default function HomePage() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [params] = useSearchParams();
  const [auth, setAuth] = useState(params.get("signin") === "1");
  const getStarted = () =>
    token ? window.location.assign("/dashboard") : setAuth(true);
  return (
    <div className="gd gm">
      <SEO
        title="Gruvi | Social Publishing API & MCP for Agents"
        ogTitle="Gruvi | Content Distribution Built for Agents"
        twitterTitle="Gruvi | Content Distribution Built for Agents"
        description={DISTRIBUTION_DESCRIPTION}
        canonicalUrl="https://agentgruvi.com/"
        ogUrl="https://agentgruvi.com/"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://agentgruvi.com/#website",
              name: "Gruvi",
              url: "https://agentgruvi.com",
              description: DISTRIBUTION_DESCRIPTION,
            },
            {
              "@type": "SoftwareApplication",
              name: "Gruvi",
              url: "https://agentgruvi.com",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: DISTRIBUTION_DESCRIPTION,
              featureList: [
                "Social media publishing API",
                "Local MCP server for agents",
                "Video uploads and custom thumbnails",
                "Social media scheduling calendar",
                "Per-platform delivery status",
                "TikTok and YouTube analytics",
                "Instagram, Facebook and X engagement summaries",
                "Bulk video scheduling",
                "Instagram and TikTok photo carousels",
              ],
              offers: publishingPlans.map((plan) => ({
                "@type": "Offer",
                name: `Gruvi ${plan.name} monthly`,
                price: plan.price,
                priceCurrency: "USD",
                url: "https://agentgruvi.com/pricing",
              })),
            },
            {
              "@type": "FAQPage",
              mainEntity: distributionFaqs.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />
      <MarketingHeader onOpenAuth={() => setAuth(true)} />
      <main>
        <section className="gm-hero">
          <div className="gm-container gm-hero-grid">
            <div className="gm-hero-copy">
              <p className="gm-eyebrow">Your agent's publishing sidekick</p>
              <h1>
                Content distribution.
                <span className="gm-gradient-text">Built for agents.</span>
              </h1>
              <p className="gm-hero-description">
                Give your agent one place to upload, schedule and publish. Your
                content, your channels, with a calendar that keeps you in the
                loop.
              </p>
              <div className="gm-actions">
                <button
                  type="button"
                  className="gm-button"
                  onClick={getStarted}
                >
                  {token ? "Open your workspace" : "Get started"}
                  <ArrowForwardRoundedIcon />
                </button>
                <Link
                  className="gm-button gm-button-secondary"
                  to="/docs/agent-integration"
                >
                  Read the docs
                  <CodeRoundedIcon />
                </Link>
              </div>
              <div className="gm-hero-capabilities">
                <span>
                  <CheckRoundedIcon />
                  MCP ready
                </span>
                <span>
                  <CodeRoundedIcon />
                  One publishing API
                </span>
                <span>
                  <CalendarMonthRoundedIcon />
                  Your social calendar
                </span>
              </div>
            </div>
            <SocialOrbit />
          </div>
        </section>
        <section className="gm-platform-section" id="platforms">
          <div className="gm-container gm-section">
            <SectionHeading
              eyebrow="Meet your channels"
              title={
                <>
                  One workflow.
                  <br />
                  Six places to show up.
                </>
              }
            >
              From your next Reel to your next YouTube video. Connect your
              accounts once, then choose where each post goes.
            </SectionHeading>
            <PlatformGrid />
            <p className="gm-section-note">
              Publish to eligible connected accounts.{" "}
              <Link to="/docs/social">See formats and platform details.</Link>
            </p>
          </div>
        </section>
        <section
          className="gm-container gm-section gm-process-section"
          id="how-it-works"
        >
          <SectionHeading
            eyebrow="From ready to out there"
            title="A simpler path to your next post."
          />
          <PublishingSteps />
        </section>
        <div className="gm-features">
          <div className="gm-container">
            <FeatureSection
              id="publishing"
              eyebrow="Make it yours"
              title={
                <>
                  Your content.
                  <br />
                  <span>Your finishing touches.</span>
                </>
              }
              description="The video is ready. Give it the cover, caption and destination it deserves. Gruvi keeps everything together, ready for your next post."
              points={[
                "Upload finished videos and your own thumbnails",
                "Choose captions, tags and connected accounts",
                "Keep a media library you and your agent can reuse",
              ]}
              link={{ to: "/posts/new", label: "Prepare a post" }}
              visual={<PublishingPreview />}
            />
            <FeatureSection
              id="calendar"
              tone="purple"
              reverse
              eyebrow="Make room for the next idea"
              title={
                <>
                  Let your agent plan.
                  <br />
                  <span>Keep the whole view.</span>
                </>
              }
              description="Line up your posts without losing track of the week. Your agent and your dashboard work from the same schedule, so you can always see what's coming."
              points={[
                "Day, week and month calendar views",
                "Publish now or choose a time for later",
                "Review scheduled posts and delivery history",
              ]}
              link={{
                to: "/docs/getting-started",
                label: "See how scheduling works",
              }}
              visual={<CalendarPreview />}
            />
            <FeatureSection
              id="analytics"
              tone="blue"
              eyebrow="Stay in the loop"
              title={
                <>
                  Know what made it out.
                  <br />
                  <span>See what connects.</span>
                </>
              }
              description="Follow delivery for every destination, then look closer at how your videos perform. TikTok and YouTube analytics bring the next decision into focus."
              points={[
                "Publishing results for each connected platform",
                "Post links and errors when a destination needs attention",
                "Account and video insights for TikTok and YouTube",
              ]}
              link={{
                to: "/docs/social#analytics",
                label: "Explore delivery & analytics",
              }}
              visual={<DeliveryPreview />}
            />
          </div>
        </div>
        <section className="gm-manual-section" id="dashboard">
          <div className="gm-container gm-manual-layout">
            <ManualPublishingArtwork />
            <div>
              <p className="gm-eyebrow">Publish from the dashboard</p>
              <h2>
                Upload, schedule
                <br />
                <span>and publish.</span>
              </h2>
              <p className="gm-body">
                Upload a video, add your thumbnail and caption, choose your
                accounts and pick a time. The same media library, calendar and
                analytics are ready whenever you want to work hands on.
              </p>
              <div className="gm-actions">
                <button
                  type="button"
                  className="gm-button"
                  onClick={() =>
                    token ? window.location.assign("/posts/new") : setAuth(true)
                  }
                >
                  Prepare a post
                  <ArrowForwardRoundedIcon />
                </button>
                <button
                  type="button"
                  className="gm-button gm-button-secondary"
                  onClick={() =>
                    token
                      ? window.location.assign("/settings/scheduled-content")
                      : setAuth(true)
                  }
                >
                  Open your calendar
                  <CalendarMonthRoundedIcon />
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="gm-agent-section" id="for-agents">
          <div className="gm-container gm-agent-layout">
            <div>
              <p className="gm-eyebrow">A natural fit for your workflow</p>
              <h2>
                Your agent already has the idea.
                <br />
                <span>Give it a way to publish.</span>
              </h2>
              <p className="gm-body">
                Add Gruvi to your MCP client or call the HTTP API. A focused set
                of tools takes your agent from finished video to scheduled post,
                with a clear result at each step.
              </p>
              <ul className="gm-check-list">
                <li>
                  <CheckRoundedIcon />
                  Agent keys you can create and revoke
                </li>
                <li>
                  <CheckRoundedIcon />
                  Tools for media, posts, schedules and analytics
                </li>
                <li>
                  <CheckRoundedIcon />
                  Readable docs and machine-readable API contracts
                </li>
              </ul>
              <Link className="gm-text-link" to="/docs/agent-integration">
                Connect your agent
                <ArrowForwardRoundedIcon />
              </Link>
              <div className="gm-agent-links">
                <a href="/llms.txt">llms.txt ↗</a>
                <a href="/openapi.json">OpenAPI ↗</a>
                <a href="/.well-known/mcp.json">MCP discovery ↗</a>
              </div>
            </div>
            <AgentConnection />
          </div>
        </section>
        <section className="gr-home-developers" id="api">
          <div className="gm-container">
            <div className="gr-home-dev-intro">
              <div><p className="gm-eyebrow">The hosted Gruvi API</p><h2>Build publishing into your workflow.</h2><p>Upload finished media, schedule a batch or send a carousel. Browse the endpoint reference, copy a request and keep your agent moving.</p></div>
              <Link className="gr-button" to="/api">Explore the API ↗</Link>
            </div>
            <div className="gr-home-feature-links">
              <article className="gr-card"><p className="gm-eyebrow">Bulk video scheduling</p><h3>Plan the next 20 posts.</h3><p>Separate captions, exact account targets and a future time for every video. Retry-safe results keep accepted schedules intact.</p><Link className="gr-card-link" to="/blog/bulk-video-scheduling">See the batch workflow →</Link></article>
              <article className="gr-card"><p className="gm-eyebrow">Photo carousels</p><h3>Make the sequence count.</h3><p>Prepare 2 to 10 images for Instagram or TikTok. Arrange the frames, choose the caption and publish or schedule the set.</p><Link className="gr-card-link" to="/blog/instagram-tiktok-carousel-posts">Explore carousel posts →</Link></article>
              <article className="gr-card"><p className="gm-eyebrow">Analytics</p><h3>Know what happened next.</h3><p>TikTok and YouTube analytics, with Instagram, Facebook and X engagement summaries in beta. Clear coverage for every metric.</p><Link className="gr-card-link" to="/blog/social-media-analytics-api">Compare analytics coverage →</Link></article>
            </div>
          </div>
        </section>
        <section className="gm-section gm-pricing-section" id="pricing">
          <div className="gm-container">
            <SectionHeading
              eyebrow="A little structure. A lot of possibility."
              title="Find your publishing pace."
            >
              Monthly plans from $10. Dashboard, API and MCP access included,
              with room to grow your schedule.
            </SectionHeading>
            <PublishingPlans />
          </div>
        </section>
        <section className="gr-home-developers">
          <div className="gm-container">
            <div className="gr-home-dev-intro"><div><p className="gm-eyebrow">From the Gruvi blog</p><h2>Guides for your next integration.</h2><p>Practical examples for agents, APIs and the details that make publishing reliable.</p></div><Link className="gr-text-link" to="/blog">Browse all guides →</Link></div>
            <div className="gr-blog-grid">{[blogPosts[0], blogPosts[4], blogPosts[5]].map(post => <article className="gr-guide-card" key={post.slug}><GuideArtwork guide={post} /><div className="gr-guide-card-body"><p className="gr-guide-meta">{post.category} · {guideMinutes(post)} min read</p><h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p><Link className="gr-card-link" to={`/blog/${post.slug}`}>Read guide →</Link></div></article>)}</div>
          </div>
        </section>
        <section className="gm-section gm-faq-section" id="faq">
          <div className="gm-container gm-faq-grid">
            <SectionHeading
              eyebrow="Good questions"
              title={
                <>
                  A little more
                  <br />
                  about Gruvi.
                </>
              }
            >
              The essentials, before you connect your first channel.
            </SectionHeading>
            <DistributionFAQ />
          </div>
        </section>
        <section className="gm-container gm-final-cta">
          <div>
            <img
              src="/gruvi.png"
              alt=""
              width="85"
              height="85"
              loading="lazy"
            />
            <div>
              <h2>Ready when your content is.</h2>
              <p>Connect your channels. Give your next post somewhere to go.</p>
            </div>
          </div>
          <button type="button" className="gm-button" onClick={getStarted}>
            {token ? "Open your workspace" : "Get started with Gruvi"}
            <ArrowForwardRoundedIcon />
          </button>
        </section>
      </main>
      <DistributionFooter />
      <DistributionAuthDialog open={auth} onClose={() => setAuth(false)} />
    </div>
  );
}
