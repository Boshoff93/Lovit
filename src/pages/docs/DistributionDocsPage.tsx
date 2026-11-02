import React from "react";
import { Link, useLocation } from "react-router-dom";
import MarketingHeader from "../../components/marketing/MarketingHeader";
import DistributionFooter from "../../components/DistributionFooter";
import { SEO } from "../../utils/seoHelper";
import {
  agentQuickstart,
  distributionTools,
  mcpConfiguration,
  scheduleExample,
} from "../../config/agentDocs";
import "../../distribution.css";
import "../../components/marketing/DistributionMarketing.css";
export default function DistributionDocsPage() {
  const path = useLocation().pathname;
  const section =
    path === "/docs"
      ? "overview"
      : path.includes("agent-integration")
        ? "agents"
        : path.includes("api-reference")
          ? "api"
          : path.includes("social")
            ? "platforms"
            : "start";
  return (
    <div className="gd gm-docs-page">
      <SEO
        title={
          section === "overview"
            ? "Gruvi Developer Docs | Social Publishing API & MCP"
            : section === "agents"
              ? "MCP Setup & Agent Integration | Gruvi"
              : section === "api"
                ? "Content Distribution API Reference | Gruvi"
                : section === "platforms"
                  ? "Publishing Platforms & Delivery | Gruvi"
                  : "Getting Started with Gruvi | Documentation"
        }
        description={
          section === "overview"
            ? "Build content distribution into your agent workflow. Find Gruvi's MCP setup, social publishing API, upload examples and platform guides."
            : section === "agents"
              ? "Connect your agent to Gruvi with MCP. Install the local server, configure an agent key and use tools for uploads, social posts, scheduling and analytics."
              : section === "api"
                ? "Gruvi social media API reference. Authenticate, upload videos and thumbnails, publish or schedule posts, check delivery and manage your subscription."
                : section === "platforms"
                  ? "Gruvi's supported social platforms, video publishing formats, custom thumbnails, TikTok settings, delivery results and analytics coverage."
                  : "Get started with Gruvi. Connect social accounts, upload finished videos and thumbnails, configure an agent, and publish or schedule your first post."
        }
        canonicalUrl={"https://agentgruvi.com" + path}
      />
      <MarketingHeader />
      <main className="gd-container gd-docs">
        <nav aria-label="Documentation">
          <p className="gd-eyebrow">Documentation</p>
          {[
            ["/docs/getting-started", "Get started"],
            ["/docs/agent-integration", "MCP & agent setup"],
            ["/docs/api-reference", "API reference"],
            ["/docs/social", "Platforms & delivery"],
          ].map(([url, label]) => (
            <Link className={path === url ? "active" : ""} key={url} to={url}>
              {label}
            </Link>
          ))}
          <a href="/llms.txt">llms.txt ↗</a>
          <a href="/openapi.json">OpenAPI schema ↗</a>
          <a href="/.well-known/mcp.json">MCP discovery manifest ↗</a>
        </nav>
        <article>
          {section === "overview" && (
            <>
              <p className="gd-eyebrow">Build with Gruvi</p>
              <h1>Your agent's publishing toolkit.</h1>
              <p className="gd-lead">
                A clear path from finished content to social posts. Connect
                through MCP or the HTTP API, with the same media, accounts and
                calendar in your Gruvi dashboard.
              </p>
              <div className="gm-docs-quicklinks">
                {[
                  [
                    "/docs/getting-started",
                    "Get started",
                    "Your account, channels and first post.",
                  ],
                  [
                    "/docs/agent-integration",
                    "Connect an agent",
                    "MCP installation, configuration and tools.",
                  ],
                  [
                    "/docs/api-reference",
                    "Use the HTTP API",
                    "Authentication, uploads and publishing requests.",
                  ],
                  [
                    "/docs/social",
                    "Explore the platforms",
                    "Formats, thumbnails, settings and delivery.",
                  ],
                ].map(([url, title, text]) => (
                  <Link key={url} to={url}>
                    <strong>
                      {title}
                      <span aria-hidden="true">↗</span>
                    </strong>
                    <span>{text}</span>
                  </Link>
                ))}
              </div>
              <h2>One publishing workflow</h2>
              <p>
                Create an agent key, inspect your connected accounts, then
                upload your video and thumbnail. Publish immediately or schedule
                a future post. Check the returned status to confirm what
                happened at each destination.
              </p>
              <h2>Start with the machine-readable guide</h2>
              <p>
                Point your agent at <a href="/llms.txt">llms.txt</a> for
                discovery, the <a href="/llms-full.txt">complete agent guide</a>{" "}
                for setup and workflows, or the{" "}
                <a href="/openapi.json">OpenAPI schema</a> for request and
                response contracts.
              </p>
            </>
          )}
          {section === "start" && (
            <>
              <p className="gd-eyebrow">Start here</p>
              <h1>Content distribution for agents.</h1>
              <p className="gd-lead">
                Gruvi is the publishing layer between your finished content and
                your connected social accounts.
              </p>
              <h2>1. Set up your account</h2>
              <p>
                Sign in, verify your email and connect the social accounts you
                want to use. You can explore the dashboard, calendar, media
                library and agent setup before subscribing.
              </p>
              <h2>2. Bring finished media</h2>
              <p>
                Upload an MP4, MOV or WebM video up to 512 MB. Add your own
                JPEG, PNG or WebP thumbnail. The dashboard normalises thumbnails
                to JPEG; API callers should send a JPEG data URL.
              </p>
              <h2>3. Choose a publishing path</h2>
              <p>
                Use New post in the dashboard,{" "}
                <Link to="/docs/agent-integration">connect an MCP client</Link>,
                or call the <Link to="/docs/api-reference">HTTP API</Link>.
              </p>
              <h2>4. Review and send</h2>
              <p>
                Choose the exact accounts, title, caption and destination
                settings. Publish now or choose a future ISO 8601 timestamp for
                scheduling. A paid plan is required at this step.
              </p>
              <h2>5. Check the result</h2>
              <p>
                A queued upload is not a confirmed social post. Review
                per-platform status and returned post URLs before treating
                delivery as complete. If a network request times out, check
                status before retrying.
              </p>
              <Link className="gd-button" to="/docs/agent-integration">
                Set up MCP ↗
              </Link>
            </>
          )}
          {section === "agents" && (
            <>
              <p className="gd-eyebrow">MCP & agent setup</p>
              <h1>Your agent's distribution tool.</h1>
              <p className="gd-lead">
                The MCP server exposes a focused publishing toolset over stdio.
                Use it with a client that supports local MCP servers.
              </p>
              <h2>1. Create an agent key</h2>
              <p>
                Open <Link to="/agents">Agent access</Link> in the dashboard.
                Create a named key and save it in your client's secret settings.
                The key is shown once. No separate user ID is required: the
                server resolves the authenticated account.
              </p>
              <h2>2. Install the MCP server</h2>
              <p>
                Requires Node.js 20 or newer. Install the versioned bundle or
                let npx install it using the client configuration below.
              </p>
              <pre className="gd-code">{agentQuickstart}</pre>
              <h2>3. Configure your MCP client</h2>
              <p>
                The configuration downloads the versioned Gruvi MCP bundle.
                Supply your key through the environment rather than chat or a
                checked-in configuration.
              </p>
              <pre className="gd-code">{mcpConfiguration}</pre>
              <p>
                The local server uses stdio. There is no hosted Streamable HTTP
                endpoint advertised by this setup.
              </p>
              <h2>Publishing access and retries</h2>
              <p>Setup, channel connections and media preparation do not require a paid plan. Publishing returns PUBLISHING_PLAN_REQUIRED when a plan is needed. Use gruvi_get_plans and gruvi_create_checkout to request a hosted checkout link, then ask the account owner to complete payment.</p>
              <p>Respect Retry-After on a 429 response. After a timeout or uncertain send, check delivery status before trying again.</p>
              <h2>4. Verify the connection</h2>
              <p>
                Restart or reload the MCP client, list its tools, then call{" "}
                <code>gruvi_get_user_info</code> and{" "}
                <code>gruvi_get_social_accounts</code>. If authentication fails,
                check the key and API base URL. A subscription is needed only
                when submitting a post.
              </p>
              <h2>5. Upload, schedule, verify</h2>
              <p>
                Call <code>gruvi_upload_video</code> with a local video path and
                title. It returns a video ID. Select connected account IDs, then
                call <code>gruvi_schedule_post</code> with a future timestamp.
              </p>
              <pre className="gd-code">{scheduleExample}</pre>
              <p>
                Inspect the returned schedule ID with{" "}
                <code>gruvi_get_scheduled_post</code>. For immediate posts, use{" "}
                <code>gruvi_publish_post</code> and follow with{" "}
                <code>gruvi_get_post_status</code>.
              </p>
              <h2>Subscriptions through your agent</h2>
              <p>
                Call <code>gruvi_get_plans</code>, let the user choose Starter
                ($10), Scale ($25) or Pro ($50) per month, then call{" "}
                <code>gruvi_create_checkout</code> with that plan ID and a
                unique request ID. Return the Stripe-hosted URL for secure
                payment. Reuse the request ID after an uncertain response. Call{" "}
                <code>gruvi_get_billing_status</code> afterward and wait for an
                active subscription before sending. The tool does not charge a
                saved card automatically.
              </p>
              <h2>Available tools</h2>
              <div className="gd-api-table">
                {distributionTools.map(([name, text]) => (
                  <div key={name}>
                    <code>{name}</code>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <h2>Agent operating rules</h2>
              <ul>
                <li>
                  Inspect existing media and scheduled posts before repeating an
                  upload or send.
                </li>
                <li>
                  Publish only with the user's instruction covering the content
                  and destination accounts.
                </li>
                <li>
                  Treat tokens, signed upload URLs and agent keys as secrets.
                </li>
                <li>
                  Check delivery status after an uncertain response. Avoid
                  automatic retries that could duplicate a public post.
                </li>
                <li>
                  Read platform settings before submitting. TikTok defaults to
                  the creator inbox for review.
                </li>
              </ul>
              <h2>Discovery resources</h2>
              <p>
                <a href="/llms.txt">llms.txt</a>,{" "}
                <a href="/llms-full.txt">full agent guide</a>,{" "}
                <a href="/openapi.json">OpenAPI 3.1 schema</a>, and the{" "}
                <a href="/.well-known/mcp.json">MCP discovery manifest</a> point
                to this workflow. MCP clients can also read the server's
                built-in quickstart and API resources.
              </p>
            </>
          )}
          {section === "api" && (
            <>
              <p className="gd-eyebrow">HTTP API</p>
              <h1>From upload to delivery.</h1>
              <p>
                Base URL: <code>https://api.agentgruvi.com</code>. Send{" "}
                <code>Authorization: Bearer &lt;agent-key&gt;</code>. JSON
                writes also use <code>Content-Type: application/json</code>.
              </p>
              <p>
                Fetch <code>GET /api/user/account</code> and read{" "}
                <code>user.userId</code> for paths that include a user ID. Your
                key remains scoped to your account.
              </p>
              <div className="gd-api-table">
                {[
                  [
                    "GET",
                    "/api/publishing/plans",
                    "Read prices, scheduled-post allowances and billing interval.",
                  ],
                  [
                    "POST",
                    "/api/publishing/checkout",
                    "Create checkout using planId and requestId. Returns checkoutUrl; does not activate membership.",
                  ],
                  [
                    "GET",
                    "/api/user/subscription",
                    "Verify subscription status after payment.",
                  ],
                  [
                    "GET",
                    "/api/gruvi/social-accounts",
                    "List destination account IDs.",
                  ],
                  [
                    "POST",
                    "/api/gruvi/videos/{userId}/get-upload-url",
                    "Request a signed upload URL using fileName, fileType and fileSize.",
                  ],
                  [
                    "PUT",
                    "<returned uploadUrl>",
                    "Upload binary content directly, with the same Content-Type. Do not send the Gruvi Authorization header to storage.",
                  ],
                  [
                    "POST",
                    "/api/gruvi/videos/{userId}/finalize-upload",
                    "Send videoId, videoKey, title, description and optional aspectRatio.",
                  ],
                  [
                    "POST",
                    "/api/gruvi/videos/{userId}/{videoId}/upload-thumbnail",
                    "Send thumbnailBase64 as a JPEG data URL.",
                  ],
                  [
                    "PUT",
                    "/api/gruvi/videos/{userId}/{videoId}/social-metadata",
                    "Set title, description and tags.",
                  ],
                  [
                    "POST",
                    "/api/gruvi/videos/{userId}/{videoId}/batch-social-upload",
                    "Send platforms as account targets. Optional title, description, tags and platform settings.",
                  ],
                  [
                    "GET",
                    "/api/gruvi/videos/{userId}/{videoId}/social-upload-status",
                    "Inspect delivery for an immediate publish.",
                  ],
                  [
                    "POST",
                    "/api/gruvi/scheduled-posts",
                    "Schedule videoId, platforms and scheduledTime, with optional caption, tags and thumbnailUrl.",
                  ],
                  [
                    "GET",
                    "/api/gruvi/scheduled-posts",
                    "Read schedule, delivery history and current scheduling limits.",
                  ],
                  [
                    "GET",
                    "/api/gruvi/scheduled-posts/{scheduleId}",
                    "Inspect one post.",
                  ],
                  [
                    "DELETE",
                    "/api/gruvi/scheduled-posts/{scheduleId}",
                    "Cancel a scheduled post.",
                  ],
                ].map(([method, url, text]) => (
                  <div key={method + url}>
                    <code>
                      {method} {url}
                    </code>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <h2>Schedule a video</h2>
              <pre className="gd-code">
                {"POST /api/gruvi/scheduled-posts\nAuthorization: Bearer <agent-key>\nContent-Type: application/json\n\n" +
                  scheduleExample}
              </pre>
              <h2>Responses and retries</h2>
              <p>
                401 means the key is missing or invalid. 403 indicates an access
                or subscription requirement. 429 indicates a limit. For network
                failures or server errors during a send, inspect the post or
                video delivery status before retrying.
              </p>
              <p>
                Read the <a href="/openapi.json">OpenAPI schema</a> for request
                fields and response shapes.{" "}
                <Link to="/docs/social">Platform settings</Link> vary by
                destination.
              </p>
            </>
          )}
          {section === "platforms" && (
            <>
              <p className="gd-eyebrow">Platforms & delivery</p>
              <h1>Your connected channels.</h1>
              <p>
                Publishing currently works with video content. Use the account
                IDs returned by the connected-accounts API rather than guessing
                a destination.
              </p>
              <div className="gd-api-table">
                {[
                  [
                    "X",
                    "twitter",
                    "Video posts, captions and account targets.",
                  ],
                  [
                    "Instagram",
                    "instagram",
                    "Video/Reels publishing for eligible connected accounts.",
                  ],
                  [
                    "TikTok",
                    "tiktok",
                    "Creator inbox (draft) or direct posting with privacy, interaction and disclosure settings.",
                  ],
                  [
                    "YouTube",
                    "youtube",
                    "Video/Shorts publishing, metadata and custom thumbnails where permitted.",
                  ],
                  [
                    "Facebook",
                    "facebook",
                    "Video publishing to connected pages.",
                  ],
                  [
                    "LinkedIn",
                    "linkedin",
                    "Video publishing to connected accounts.",
                  ],
                ].map(([name, id, text]) => (
                  <div key={id} id={id}>
                    <code>
                      {name} · {id}
                    </code>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <h2>Custom thumbnails</h2>
              <p>
                Upload your thumbnail before sending the post. A platform may
                choose its own cover or require account permissions for custom
                thumbnails. Gruvi does not promise identical thumbnail display
                across every network.
              </p>
              <h2>TikTok settings</h2>
              <p>
                The MCP server defaults to <code>postMode: draft</code> to send
                content to the creator inbox. For direct posting, specify
                privacy, interaction and disclosure settings that are allowed
                for the account. Select commercial-content disclosures
                deliberately.
              </p>
              <h2 id="analytics">Analytics coverage</h2>
              <p>
                Account and video analytics are available for connected TikTok
                and YouTube accounts. The other networks currently support
                publishing, rather than a full analytics dashboard.
              </p>
              <h2>Delivery states</h2>
              <p>
                A schedule starts as scheduled, then moves through publishing to
                published, partial or failed. Review each platform result for
                links and errors. Some platform processing continues after
                upload acceptance.
              </p>
              <h2>Free setup, paid sending</h2>
              <p>
                Explore the app, connect your accounts and inspect the calendar
                without a subscription. Paid plans are required to publish or
                schedule. Existing scheduled posts and their history remain
                visible.
              </p>
            </>
          )}
        </article>
      </main>
      <DistributionFooter />
    </div>
  );
}
