import React, { CSSProperties, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { Link } from "react-router-dom";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { mcpConfiguration, scheduleExample } from "../../config/agentDocs";

export const publishingPlatforms = [
  {
    id: "youtube",
    name: "YouTube",
    detail: "Videos & Shorts",
    color: "#ff5757",
  },
  {
    id: "instagram",
    name: "Instagram",
    detail: "Videos & Reels",
    color: "#f07bab",
  },
  {
    id: "tiktok",
    name: "TikTok",
    detail: "Drafts & direct posts",
    color: "#54e2d6",
  },
  { id: "facebook", name: "Facebook", detail: "Page videos", color: "#6aa9ff" },
  {
    id: "linkedin",
    name: "LinkedIn",
    detail: "Video updates",
    color: "#74b6ef",
  },
  { id: "twitter", name: "X", detail: "Video posts", color: "#e5e7eb" },
] as const;
type PlatformId = (typeof publishingPlatforms)[number]["id"];

export function PlatformIcon({ id }: { id: string }) {
  if (id === "youtube") return <YouTubeIcon />;
  if (id === "instagram") return <InstagramIcon />;
  if (id === "facebook") return <FacebookIcon />;
  if (id === "linkedin") return <LinkedInIcon />;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d={
          id === "tiktok"
            ? "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
            : "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        }
      />
    </svg>
  );
}

export function SocialOrbit() {
  return (
    <div
      className="gm-orbit"
      role="img"
      aria-label="Gruvi connects an agent's content to YouTube, Instagram, TikTok, Facebook, LinkedIn and X"
    >
      <div className="gm-orbit-glow" />
      <div className="gm-orbit-ring gm-orbit-ring-outer" />
      <div className="gm-orbit-ring gm-orbit-ring-inner" />
      <svg
        className="gm-orbit-lines"
        viewBox="0 0 480 480"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="gruvi-connection"
            x1="0"
            y1="0"
            x2="480"
            y2="480"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#54e2ca" />
            <stop offset="1" stopColor="#7c91ff" />
          </linearGradient>
        </defs>
        {[
          [115, 100],
          [335, 68],
          [430, 220],
          [352, 374],
          [125, 382],
          [49, 227],
        ].map(([x, y]) => (
          <path
            key={x}
            d={`M240 233 Q${(x + 240) / 2} ${y} ${x} ${y}`}
            stroke="url(#gruvi-connection)"
            strokeWidth="1.4"
            strokeDasharray="4 8"
          />
        ))}
      </svg>
      <div className="gm-orbit-agent">
        <CodeRoundedIcon />
        <span>Your agent</span>
        <i />
      </div>
      <div className="gm-orbit-mascot">
        <img
          src="/gruvi.png"
          alt=""
          width="180"
          height="180"
          fetchPriority="high"
        />
        <span>Gruvi</span>
      </div>
      {publishingPlatforms.map((platform, index) => (
        <div
          key={platform.id}
          className={`gm-orbit-platform gm-orbit-platform-${index}`}
          style={
            {
              "--platform-color": platform.color,
              "--float-delay": `${index * -0.7}s`,
            } as CSSProperties
          }
        >
          <PlatformIcon id={platform.id} />
          <span>{platform.name}</span>
        </div>
      ))}
      <div className="gm-orbit-content">
        <img src="/thumbnails/tent.jpeg" alt="" width="40" height="50" />
        <span>
          Your next post<small>Video + thumbnail</small>
        </span>
        <PlayArrowRoundedIcon />
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="gm-section-heading">
      <p className="gm-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </header>
  );
}

export function PlatformGrid() {
  return (
    <div className="gm-platform-grid">
      {publishingPlatforms.map((platform) => (
        <Link
          to={`/docs/social#${platform.id}`}
          className="gm-platform-card"
          key={platform.id}
          style={{ "--platform-color": platform.color } as CSSProperties}
        >
          <span className={`gm-platform-logo gm-platform-logo-${platform.id}`}>
            <PlatformIcon id={platform.id} />
          </span>
          <h3>{platform.name}</h3>
          <p>{platform.detail}</p>
          <ArrowForwardRoundedIcon className="gm-platform-arrow" />
        </Link>
      ))}
    </div>
  );
}

export function PublishingSteps() {
  const steps = [
    {
      icon: <CodeRoundedIcon />,
      title: "Connect your world",
      copy: "Link your social accounts. Use the dashboard or connect an agent.",
    },
    {
      icon: <CloudUploadRoundedIcon />,
      title: "Bring something worth sharing",
      copy: "Upload a finished video, choose a thumbnail and add your caption.",
    },
    {
      icon: <CalendarMonthRoundedIcon />,
      title: "Pick the moment",
      copy: "Publish now or schedule ahead. Follow the result for each channel.",
    },
  ];
  return (
    <ol className="gm-process">
      {steps.map((step, index) => (
        <li key={step.title}>
          <span className="gm-process-icon">{step.icon}</span>
          <span className="gm-process-number">0{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </li>
      ))}
    </ol>
  );
}

export function FeatureSection({
  id,
  eyebrow,
  title,
  description,
  points,
  link,
  visual,
  reverse = false,
  tone = "cyan",
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  points: string[];
  link: { to: string; label: string };
  visual: React.ReactNode;
  reverse?: boolean;
  tone?: string;
}) {
  return (
    <section
      id={id}
      className={`gm-section gm-feature gm-feature-${tone} ${reverse ? "gm-feature-reverse" : ""}`}
    >
      <div className="gm-feature-copy">
        <p className="gm-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="gm-body">{description}</p>
        <ul className="gm-check-list">
          {points.map((point) => (
            <li key={point}>
              <CheckRoundedIcon />
              {point}
            </li>
          ))}
        </ul>
        <Link className="gm-text-link" to={link.to}>
          {link.label}
          <ArrowForwardRoundedIcon />
        </Link>
      </div>
      <div className="gm-feature-visual">{visual}</div>
    </section>
  );
}

function WindowHeader({ title, label }: { title: string; label: string }) {
  return (
    <div className="gm-window-header">
      <span className="gm-window-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>{title}</span>
      <small>{label}</small>
    </div>
  );
}

export function PublishingPreview() {
  return (
    <div
      className="gm-publishing-art"
      role="img"
      aria-label="Post preview showing a video, custom thumbnail, caption and selected social accounts"
    >
      <div className="gm-product-window gm-composer-preview">
        <WindowHeader title="Prepare a post" label="Preview" />
        <div className="gm-composer-content">
          <div className="gm-video-cover">
            <img
              src="/marketing/slow-mornings-video.webp"
              alt="An illustrated duck enjoying the morning sunshine in a warm kitchen"
              width="1774"
              height="887"
              loading="lazy"
            />
            <span>
              <PlayArrowRoundedIcon />
            </span>
            <small>Your finished video</small>
          </div>
          <div className="gm-preview-field">
            <small>Title & caption</small>
            <strong>Slow mornings.</strong>
            <p>A little sunshine. A slower morning. A story worth sharing.</p>
          </div>
          <div className="gm-preview-accounts">
            {(["instagram", "youtube", "tiktok"] as PlatformId[]).map((id) => (
              <span key={id}>
                <PlatformIcon id={id} />
                <CheckRoundedIcon />
              </span>
            ))}
            <small>Your chosen accounts</small>
          </div>
        </div>
      </div>
      <div className="gm-thumbnail-card">
        <div className="gm-thumbnail-art">
          <img
            src="/marketing/slow-mornings-thumbnail.webp"
            alt="Matching cover artwork for Slow mornings"
            width="1122"
            height="1402"
            loading="lazy"
          />
          <strong>
            Slow
            <br />
            mornings.
          </strong>
        </div>
        <span>
          <CheckRoundedIcon />
          Your thumbnail
        </span>
      </div>
    </div>
  );
}

export function CalendarPreview() {
  const [view, setView] = useState<"week" | "month">("week");
  const posts = [
    {
      day: 1,
      row: 1,
      title: "Campfire stories",
      image: "/thumbnails/tent.jpeg",
      platform: "instagram",
    },
    {
      day: 3,
      row: 2,
      title: "Coffee break",
      image: "/marketing/slow-mornings-thumbnail.webp",
      platform: "youtube",
    },
    {
      day: 5,
      row: 1,
      title: "Weekend plans",
      image: "/thumbnails/skiis.jpeg",
      platform: "tiktok",
    },
  ];
  return (
    <div className="gm-product-window gm-calendar-preview">
      <WindowHeader title="Content calendar" label="Example schedule" />
      <div className="gm-calendar-toolbar">
        <span>
          <CalendarMonthRoundedIcon />
          Your {view}, at a glance
        </span>
        <div aria-label="Calendar preview views">
          {(["week", "month"] as const).map((v) => (
            <button
              type="button"
              key={v}
              aria-pressed={view === v}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className={`gm-calendar-grid gm-calendar-${view}`}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span className="gm-calendar-day" key={d}>
            {d}
          </span>
        ))}
        {Array.from({ length: view === "week" ? 21 : 28 }, (_, i) => (
          <span
            className="gm-calendar-cell"
            key={i}
            style={{ gridColumn: (i % 7) + 1, gridRow: Math.floor(i / 7) + 2 }}
          >
            {view === "month" ? <small>{i + 1}</small> : null}
          </span>
        ))}
        {posts.map((p) => (
          <div
            key={p.title}
            className={`gm-calendar-post gm-calendar-post-${p.platform}`}
            style={{
              gridColumn: `${p.day + 1} / span ${view === "week" ? 2 : 1}`,
              gridRow: view === "week" ? p.row + 1 : p.row + 2,
            }}
          >
            <div className="gm-calendar-post-main">
              <img src={p.image} alt="" width="90" height="75" loading="lazy" />
              <strong title={p.title}>{p.title}</strong>
            </div>
            <span>
              <PlatformIcon id={p.platform} />
              Scheduled
            </span>
          </div>
        ))}
      </div>
      <div className="gm-calendar-legend">
        <span>
          <i />
          Scheduled
        </span>
        <span>
          <i />
          Published
        </span>
        <span>
          <i />
          Needs attention
        </span>
      </div>
    </div>
  );
}

export function ManualPublishingArtwork() {
  const { ref, inView } = useInView({
    rootMargin: "80px",
    triggerOnce: false,
  });
  return (
    <div
      className={`gm-manual-art${inView ? " gm-manual-art-active" : ""}`}
      ref={ref}
      aria-hidden="true"
      inert
    >
      <div className="gm-manual-glow" />
      <img
        className="gm-bazooka-mascot"
        src="/landing/littlefriend.png"
        alt=""
        width="500"
        height="500"
        loading="lazy"
      />
    </div>
  );
}

export function DeliveryPreview() {
  return (
    <div className="gm-product-window gm-delivery-preview">
      <WindowHeader title="Delivery & insights" label="Example dashboard" />
      <div className="gm-delivery-content">
        <div className="gm-delivery-title">
          <div>
            <small>One post. Every destination.</small>
            <h3>The full picture.</h3>
          </div>
          <span className="gm-insight-icon">
            <CheckRoundedIcon />
          </span>
        </div>
        <div className="gm-delivery-rows">
          {[
            { id: "instagram", state: "Published" },
            { id: "youtube", state: "Published" },
            { id: "tiktok", state: "In creator inbox" },
          ].map((p) => (
            <div key={p.id}>
              <span className={`gm-platform-logo gm-platform-logo-${p.id}`}>
                <PlatformIcon id={p.id} />
              </span>
              <strong>
                {publishingPlatforms.find((x) => x.id === p.id)?.name}
              </strong>
              <span className="gm-delivery-state">
                <CheckRoundedIcon />
                {p.state}
              </span>
            </div>
          ))}
        </div>
        <div className="gm-insight-chart">
          <span>Views over time</span>
          <small>TikTok & YouTube analytics</small>
          <svg
            viewBox="0 0 440 110"
            role="img"
            aria-label="Illustrative performance trend"
          >
            <defs>
              <linearGradient id="gruvi-chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#b28aff" stopOpacity=".25" />
                <stop offset="1" stopColor="#b28aff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 95 C35 95 25 77 58 80 S94 97 121 64 S169 88 198 56 S240 66 268 39 S311 57 339 26 S386 42 440 10 L440 110 L0 110Z"
              fill="url(#gruvi-chart-fill)"
            />
            <path
              d="M0 95 C35 95 25 77 58 80 S94 97 121 64 S169 88 198 56 S240 66 268 39 S311 57 339 26 S386 42 440 10"
              stroke="#b899fb"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

const agentPrompt =
  "Use Gruvi to schedule this video for Instagram and YouTube on Friday at 10am in my timezone. Use the attached thumbnail and caption, then show me the scheduled post.";
const httpExample =
  "POST https://api.agentgruvi.com/api/gruvi/scheduled-posts\nAuthorization: Bearer <your-agent-key>\nContent-Type: application/json\n\n" +
  scheduleExample;
export function AgentConnection() {
  const [tab, setTab] = useState("prompt");
  const [copied, setCopied] = useState(false);
  const tabs = [
    { id: "prompt", label: "Agent prompt" },
    { id: "mcp", label: "MCP setup" },
    { id: "api", label: "HTTP API" },
  ];
  const value =
    tab === "prompt"
      ? agentPrompt
      : tab === "mcp"
        ? mcpConfiguration
        : httpExample;
  const selectTab = (id: string) => {
    setTab(id);
    setCopied(false);
  };
  return (
    <div className="gm-agent-window">
      <div
        className="gm-agent-tabs"
        role="tablist"
        aria-label="Agent integration examples"
      >
        {tabs.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`gm-agent-tab-${item.id}`}
            aria-controls="gm-agent-panel"
            aria-selected={tab === item.id}
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => selectTab(item.id)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
              else if (event.key === "ArrowLeft")
                next = (index + tabs.length - 1) % tabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = tabs.length - 1;
              else return;
              event.preventDefault();
              selectTab(tabs[next].id);
              document.getElementById(`gm-agent-tab-${tabs[next].id}`)?.focus();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        className="gm-agent-panel"
        id="gm-agent-panel"
        role="tabpanel"
        aria-labelledby={`gm-agent-tab-${tab}`}
      >
        <div className="gm-agent-panel-label">
          <span>
            {tab === "prompt"
              ? "An example request"
              : tab === "mcp"
                ? "Your MCP client configuration"
                : "Schedule an uploaded video"}
          </span>
          <button
            type="button"
            aria-label={`Copy ${tabs.find((x) => x.id === tab)?.label}`}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(value);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            <ContentCopyRoundedIcon />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        {tab === "prompt" ? (
          <div className="gm-agent-conversation">
            <div className="gm-agent-message">
              <span>You</span>
              <p>“{agentPrompt}”</p>
            </div>
            <div className="gm-agent-tools">
              <span>
                <img src="/gruvi.png" alt="" width="25" height="25" />
                The Gruvi toolset
              </span>
              <code>gruvi_get_social_accounts</code>
              <code>gruvi_upload_video</code>
              <code>gruvi_schedule_post</code>
              <p>Connect accounts. Send content. Confirm the schedule.</p>
            </div>
          </div>
        ) : (
          <pre className="gm-agent-code">
            <code>{value}</code>
          </pre>
        )}
        <span className="gm-copy-status" role="status">
          {copied ? "Copied to clipboard" : ""}
        </span>
      </div>
      <div className="gm-agent-window-footer">
        <span>
          <i />
          MCP & HTTP API
        </span>
        <Link to="/docs/agent-integration">
          Full setup guide
          <ArrowForwardRoundedIcon />
        </Link>
      </div>
    </div>
  );
}

export const distributionFaqs = [
  {
    question: "What is Gruvi?",
    answer:
      "Gruvi is a content distribution API and dashboard for agents and teams. Bring finished videos or image carousels, publish or schedule to connected social accounts, and follow delivery in one place.",
  },
  {
    question: "Can I publish without an agent?",
    answer:
      "Yes. Upload your videos and thumbnails, write captions, choose connected accounts and publish or schedule directly in the Gruvi dashboard. Your media library, calendar and available analytics are there to use manually too.",
  },
  {
    question: "How does my agent connect?",
    answer:
      "Create a Gruvi account, connect your social profiles and create an agent key. Add the Gruvi MCP server to a compatible client, or call the HTTP API directly. The setup guide includes configuration, examples and the complete tool reference.",
  },
  {
    question: "Which platforms can I publish to?",
    answer:
      "Gruvi supports video publishing to YouTube, Instagram, TikTok, Facebook, LinkedIn and X, plus photo carousels for Instagram and TikTok. Formats, thumbnail behavior and permissions depend on the connected account.",
  },
  {
    question: "Can I use my own content and thumbnails?",
    answer:
      "Yes. Upload your finished MP4, MOV or WebM video and add your own thumbnail, caption and tags. Gruvi is focused on distributing the content you already make in your own workflow.",
  },
  {
    question: "What can I track?",
    answer:
      "Review your calendar and per-platform delivery results. TikTok and YouTube have summary and trend analytics. Instagram, Facebook and X have recent-post engagement summaries in beta, subject to platform permissions and API access.",
  },
  {
    question: "When do I choose a plan?",
    answer:
      "Set up your account, connect your channels and configure your agent first. Choose a monthly plan when you are ready to publish or schedule. Plans start at $10 per month and include dashboard, API and MCP access.",
  },
];
export function DistributionFAQ() {
  return (
    <div className="gm-faq-list">
      {distributionFaqs.map((item) => (
        <details key={item.question}>
          <summary>
            {item.question}
            <span aria-hidden="true">+</span>
          </summary>
          <p>
            {item.answer}
            {item.question === "How does my agent connect?" && (
              <>
                {" "}
                <Link to="/docs/agent-integration">Read the setup guide.</Link>
              </>
            )}
            {item.question === "Which platforms can I publish to?" && (
              <>
                {" "}
                <Link to="/docs/social">See platform details.</Link>
              </>
            )}
          </p>
        </details>
      ))}
    </div>
  );
}
