import React from "react";
import MarketingHeader from "../components/marketing/MarketingHeader";
import DistributionFooter from "../components/DistributionFooter";
import PublishingPlans from "../components/PublishingPlans";
import { SEO } from "../utils/seoHelper";
export default function PaymentPage() {
  return (
    <div className="gd gd-pricing-page">
      <SEO
        title="Gruvi Pricing | Content Distribution from $10/month"
        description="Content distribution for agents from $10 per month. Choose 60, 120 or 240 scheduled posts, with video posts, custom thumbnails, API, MCP and analytics."
        canonicalUrl="https://agentgruvi.com/pricing"
      />
      <MarketingHeader />
      <main className="gd-container">
        <header className="gd-page-intro gd-pricing-intro">
          <p className="gd-eyebrow">Simple monthly pricing</p>
          <h1>
            Ready when
            <br />
            <em>your content is.</em>
          </h1>
          <p>
            Set up your account, connect channels and explore the calendar for
            free. Choose a plan when you publish or schedule your first post.
          </p>
        </header>
        <PublishingPlans />
        <section className="gd-section gd-pricing-faq">
          <h2>A few useful details.</h2>
          <details>
            <summary>Can I explore without a subscription?</summary>
            <p>
              Yes. Set up your account, connect channels, upload media and
              configure agent access. A paid plan is required when you submit a
              post for publishing or scheduling.
            </p>
          </details>
          <details>
            <summary>What counts as a scheduled post?</summary>
            <p>
              One scheduled video or carousel counts as one post. A video post
              sent to several connected accounts still counts once. Each video
              in a bulk schedule counts separately. Adding media to your library
              does not use this allowance. It resets each UTC calendar month;
              cancelling a future post before delivery starts returns its slot
              to the month it was created in. Immediate publishing is included
              separately and remains subject to service and platform limits.
            </p>
          </details>
          <details>
            <summary>What does the agent need?</summary>
            <p>
              An agent key and either the MCP server or HTTP API. All plans
              include access to the same publishing toolset.
            </p>
          </details>
          <details>
            <summary>Where are analytics available?</summary>
            <p>
              TikTok and YouTube have summary and trend analytics. Instagram,
              Facebook and X have recent-post engagement summaries in beta,
              subject to platform read permissions and API access.
            </p>
          </details>
        </section>
      </main>
      <DistributionFooter />
    </div>
  );
}
