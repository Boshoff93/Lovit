const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = (file) =>
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const write = (file, content) => {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
};
const xml = (value) =>
  String(value).replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character],
  );
const posts = read("src/content/blog.json");
const routes = [
  ...read("src/config/publicPages.json"),
  ...posts.map((post) => ({
    path: "/blog/" + post.slug,
    modified: post.updatedAt,
    image: post.artwork.src,
  })),
];
write(
  "public/openapi.json",
  JSON.stringify(read("src/content/openapi.json"), null, 2) + "\n",
);
write(
  "public/sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    routes
      .map(
        (route) =>
          `  <url><loc>https://agentgruvi.com${xml(route.path)}</loc><lastmod>${xml(route.modified)}</lastmod>${route.image ? `<image:image><image:loc>https://agentgruvi.com${xml(route.image)}</image:loc></image:image>` : ""}</url>`,
      )
      .join("\n") +
    "\n</urlset>\n",
);
write(
  "public/blog/rss.xml",
  '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Gruvi publishing guides</title><link>https://agentgruvi.com/blog</link><description>Social publishing APIs, MCP, scheduling and analytics.</description><language>en</language>' +
    posts
      .map(
        (post) =>
          `<item><title>${xml(post.title)}</title><link>https://agentgruvi.com/blog/${post.slug}</link><guid isPermaLink="true">https://agentgruvi.com/blog/${post.slug}</guid><description>${xml(post.description)}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate><enclosure url="https://agentgruvi.com${xml(post.artwork.social)}" length="${fs.statSync(path.join(root, "public", post.artwork.social)).size}" type="image/jpeg"/></item>`,
      )
      .join("") +
    "</channel></rss>\n",
);
for (const post of posts) {
  let text = `# ${post.title}\n\n${post.description}\n\nCanonical: https://agentgruvi.com/blog/${post.slug}\nPublished: ${post.publishedAt}\nUpdated: ${post.updatedAt}\nAuthor: ${post.author}\n\n## What you need to know\n${post.takeaways.map((item) => "- " + item).join("\n")}\n`;
  text = text.replace(
    "\n\nCanonical:",
    `\n\n![${post.artwork.alt}](https://agentgruvi.com${post.artwork.src})\n\nCanonical:`,
  );
  for (const section of post.sections) {
    text +=
      "\n## " + section.title + "\n\n" + section.paragraphs.join("\n\n") + "\n";
    if (section.code)
      text +=
        "\n```" +
        section.code.language.toLowerCase() +
        "\n" +
        section.code.value +
        "\n```\n";
    for (const link of section.links || [])
      text += `\n- [${link.label}](${link.href.startsWith("/") ? "https://agentgruvi.com" + link.href : link.href})\n`;
  }
  write("public/docs/for-agents/guides/" + post.slug + ".md", text);
}
console.log(
  `Synced OpenAPI, sitemap (${routes.length} pages), RSS and ${posts.length} plain-text guides.`,
);
const manifest = read("public/.well-known/mcp.json");
const toolNames = manifest.tools.map((tool) =>
  typeof tool === "string" ? tool : tool.name,
);
const endpointText = Object.entries(read("src/content/openapi.json").paths)
  .flatMap(([url, methods]) =>
    Object.entries(methods).map(
      ([method, operation]) =>
        `- ${method.toUpperCase()} ${url}: ${operation.summary}`,
    ),
  )
  .join("\n");
const guide = `# Gruvi: content distribution for agents

Gruvi distributes finished videos to connected X, Instagram, TikTok, YouTube, Facebook and LinkedIn accounts. It also prepares image carousels for Instagram and TikTok. Use the dashboard manually, the hosted HTTPS API, or the local stdio MCP server. Gruvi does not generate the content.

## Read first
- API overview: https://agentgruvi.com/api
- Searchable endpoint reference: https://agentgruvi.com/docs/api-reference
- OpenAPI 3.1 contract: https://agentgruvi.com/openapi.json
- MCP setup: https://agentgruvi.com/docs/agent-integration
- Platform rules and delivery: https://agentgruvi.com/docs/social
- Original publishing guides: https://agentgruvi.com/blog
- Public MCP Registry: https://registry.modelcontextprotocol.io/v0.1/servers/com.agentgruvi%2Fgruvi/versions/2.1.0

## Authentication and setup
1. Sign in at https://agentgruvi.com and verify your email.
2. Connect the destination accounts you own in /settings/connected-accounts. Multiple accounts per platform are supported.
3. Create a named key in /agents and keep it in your client environment or secret manager as GRUVI_API_KEY.
4. For direct HTTP requests, use https://api.agentgruvi.com and Authorization: Bearer <agent-key>.
5. Read GET /api/user/account for the real userId. Never derive a userId by splitting the key. Read connected accounts and select their exact accountId values. X uses the identifier twitter.

Requires Node.js 20+ for local MCP. The official npm package is @agent-gruvi/gruvi-mcp-server@2.1.0. It exposes 26 tools and two readable documentation resources. Install with:

    npm install --global @agent-gruvi/gruvi-mcp-server@2.1.0

Claude Code, Claude Desktop and Codex can launch the local stdio server. Client configuration examples are in the setup guide. OpenClaw and other HTTP workflows can call the API directly. The local server is not a hosted remote MCP endpoint.

## Video workflow
Inspect existing media and schedules before uploading again. Request a signed upload URL, upload finished MP4/MOV/WebM media up to 512 MB, then finalize the video. Never send the Gruvi bearer key to a signed storage URL. Attach your own JPEG thumbnail up to 5 MB and save title, caption and tags.
Publish with the exact connected accounts, or schedule at a future ISO 8601 timestamp including a timezone. Read per-platform social-upload status after immediate delivery, or the schedule record after scheduled execution. Queued, scheduled, processing, draft and published are different states. A profile URL is not proof of a public post.

## Bulk scheduling
POST /api/gruvi/scheduled-posts/bulk accepts a stable requestId and 1 to 20 posts. Each post has a videoId, title/caption, future scheduledTime and exact platform/accountId targets. Preserve the batch ID, order and content on retry. HTTP 201 means all items scheduled; 207 has per-item results. Inspect each result. Retry the unchanged batch with the same ID after uncertainty; do not resubmit successful items under fresh identities.
MCP: gruvi_bulk_schedule_videos. Dashboard: /posts/bulk.

## Image carousels
Use 2 to 10 JPEG, PNG or WebP images up to 5 MB each. Allocate signed image uploads through /api/gruvi/carousels/get-upload-url, upload the bytes, then save the ordered imageKeys through POST /api/gruvi/carousels. Keys must belong to the current account. Images fit a 1080 x 1350 canvas without cropping.
Publish or schedule to one exact Instagram or TikTok destination. Immediate publication uses platform, accountId and a stable requestId. Check /carousels/{carouselId}/publications/{requestId} after an uncertain send. TikTok defaults to creator-inbox review; an inbox draft is not a live post.
MCP: gruvi_upload_carousel, gruvi_publish_carousel, gruvi_schedule_carousel and gruvi_get_carousel_publication. Dashboard: /posts/carousel.

## Analytics coverage
TikTok and YouTube have summary and trend endpoints. Instagram and Facebook summary endpoints include native account insights for days=7 or days=28 (default 28), ending before today in UTC, plus daily values and up to 25 recent posts. Read insights.status and each metric availability before reporting a result. Account insights and recent-post lifetime totals are separate measurements. Never sum unique audiences across days. Missing metrics are null, not zero. Meta may withhold data for permissions, account eligibility, privacy thresholds or provider delays. Instagram needs instagram_manage_insights; Facebook needs read_insights and the Page ANALYZE task; both need pages_read_engagement. The account owner enables this separately in Analytics through Meta authorization; agent keys cannot change permissions. App review may be required for customer accounts. Results cache up to five minutes and reconnects invalidate cached results. X retains beta recent-post engagement only.
Use an exact accountId. X uses platform=twitter. MCP: gruvi_get_analytics, with kind=summary for Instagram, Facebook or X. The dashboard exposes all five analytics pages.

## Publishing access and billing
Account setup, connected channels, agent keys and media preparation remain available without a subscription. Submitting a post requires verified active publishing access through a paid plan, trial or complimentary grant.
Monthly USD plans: Starter $10 with 60 scheduled posts, Scale $25 with 120, Pro $50 with 240. One scheduled video or carousel counts as one post. A video post targeting multiple accounts still counts once. Each video in a bulk schedule counts separately. Preparing media does not consume the monthly post allowance; separate daily upload safety limits apply. The allowance resets each UTC calendar month. Cancelling a future post before delivery starts returns its slot once to the month it was created in. Immediate publishing is included separately; the monthly allowance applies to scheduled posts.
Eligible accounts receive one three-day trial through Stripe-hosted checkout. A payment method is required; the selected monthly plan renews unless cancelled before trial end. Trial use cannot be reset with another agent key.
Agents can call gruvi_get_plans and gruvi_create_checkout with a stable requestId. Return the hosted checkoutUrl for the account owner to complete. Do not collect card details or charge a saved card. Creating a checkout link is not an entitlement. Confirm access through gruvi_get_billing_status after the signed webhook has activated it.
API access is included in every plan. MCP is highlighted on Scale and Pro; the same API key contract is available to the local client. Founder support: admin@wbtechventures.com.

## Limits and safe retries
An account's keys share 180 requests/minute and 40 writes/minute. Publishing operations allow 12/minute; credential/checkout writes allow 10 per five minutes. Free media preparation allows five video and 50 image upload allocations daily; an active publishing plan or trial allows 60 videos and 400 images. Authentication and recovery have separate IP/email limits.
Honor Retry-After on 429 responses. Read the error body for 403 access requirements. A 503 protection error is not permission to bypass the protected API. Preserve stable request IDs on supported operations. Inspect immediate video delivery before resubmitting: that endpoint must not be blindly replayed after a lost response.

## API endpoints
${endpointText}

## MCP tools
${toolNames.map((name) => "- " + name).join("\n")}

## Practical guides
${posts.map((post) => `- [${post.title}](https://agentgruvi.com/blog/${post.slug})\n  Plain text: https://agentgruvi.com/docs/for-agents/guides/${post.slug}.md`).join("\n")}
`;
for (const file of [
  "public/llms-full.txt",
  "public/agents.md",
  "public/docs/for-agents/README.md",
  "public/docs/for-agents/api-reference.md",
  "public/docs/for-agents/workflows.md",
  "public/docs/for-agents/installing-skill.md",
  "public/docs/api-reference.md",
])
  write(file, guide);
write(
  "public/skill.md",
  "---\nname: gruvi\ndescription: Distribute finished content through the Gruvi API and local MCP server, including video, bulk schedules, image carousels and analytics.\n---\n\n" +
    guide,
);
write(
  "public/llms.txt",
  `# Gruvi

> Content distribution for agents. Upload finished media, publish or schedule with exact account targets, and verify delivery.

## Start
- [Hosted API overview](https://agentgruvi.com/api): Capabilities, quickstart and analytics coverage.
- [Searchable API reference](https://agentgruvi.com/docs/api-reference): OpenAPI fields and Shell, JavaScript and Python examples.
- [OpenAPI schema](https://agentgruvi.com/openapi.json): Authoritative machine-readable HTTP contract.
- [MCP setup](https://agentgruvi.com/docs/agent-integration): Install @agent-gruvi/gruvi-mcp-server@2.1.0 for Node.js 20+.
- [MCP manifest](https://agentgruvi.com/.well-known/mcp.json): 26 local stdio tools and documentation resources.
- [Full agent guide](https://agentgruvi.com/llms-full.txt): Authentication, access, billing, workflows and retry rules.
- [Publishing guides](https://agentgruvi.com/blog): Original guides to agents, bulk scheduling, carousels and analytics, with plain-text versions.
- [Plans](https://agentgruvi.com/pricing): $10, $25 or $50 monthly, with one three-day trial for eligible accounts.

## Capabilities
Video distribution: X, Instagram, TikTok, YouTube, Facebook and LinkedIn.
Photo carousels: Instagram and TikTok, 2 to 10 images per set.
Bulk scheduling: 1 to 20 videos, with stable request IDs and per-item results.
Analytics: TikTok and YouTube summary/trends; Instagram, Facebook and X recent-post engagement summaries in beta.

## Operating rules
Use exact connected account IDs. X is identified as twitter. Setup and media preparation remain available before subscribing. Publishing requires verified active access. Creating a checkout URL does not activate a plan. Respect Retry-After. An accepted request, a schedule and a TikTok draft are not proof of a live post.
`,
);
