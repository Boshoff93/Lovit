# Gruvi: content distribution for agents

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
TikTok and YouTube have summary and trend endpoints. Instagram, Facebook and X have recent-post engagement summaries in beta, requiring platform read permissions and API access. Those summaries cover up to 25 recent posts and cache for five minutes. Missing metrics are null, not zero; totals cover returned posts, not lifetime account activity.
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
- GET /api/user/account: Read the authenticated account
- GET /api/user/subscription: Read subscription status
- GET /api/publishing/plans: List monthly distribution plans
- POST /api/publishing/checkout: Create hosted Stripe checkout without charging a card
- GET /api/gruvi/social-accounts: List connected destination accounts
- GET /api/gruvi/videos/{userId}: List media
- GET /api/gruvi/videos/{userId}/{videoId}: Inspect a video
- POST /api/gruvi/videos/{userId}/get-upload-url: Get a signed upload URL for a video up to 512 MB
- POST /api/gruvi/videos/{userId}/finalize-upload: Save a completed direct upload
- POST /api/gruvi/videos/{userId}/{videoId}/upload-thumbnail: Upload a custom JPEG thumbnail
- PUT /api/gruvi/videos/{userId}/{videoId}/social-metadata: Set title, description and tags
- POST /api/gruvi/videos/{userId}/{videoId}/batch-social-upload: Queue a video for immediate publishing; requires a publishing plan or trial
- GET /api/gruvi/videos/{userId}/{videoId}/social-upload-status: Inspect per-platform immediate delivery
- POST /api/gruvi/scheduled-posts: Schedule a future video post; requires a publishing plan or trial
- GET /api/gruvi/scheduled-posts: Read calendar, delivery history and allowance
- GET /api/gruvi/scheduled-posts/{scheduleId}: Inspect one scheduled post
- DELETE /api/gruvi/scheduled-posts/{scheduleId}: Cancel a scheduled post
- GET /api/gruvi/youtube/analytics/summary: Read YouTube summary analytics
- GET /api/gruvi/youtube/analytics/trends: Read YouTube trends analytics
- GET /api/gruvi/tiktok/analytics/summary: Read TikTok summary analytics
- GET /api/gruvi/tiktok/analytics/trends: Read TikTok trends analytics
- POST /api/gruvi/scheduled-posts/bulk: Schedule 1 to 20 videos with one stable requestId and per-item results
- POST /api/gruvi/carousels/get-upload-url: Allocate a ten-minute signed upload URL for one carousel image
- POST /api/gruvi/carousels: Save 2 to 10 uploaded images as a carousel without publishing
- GET /api/gruvi/carousels: List this account's saved carousels
- POST /api/gruvi/carousels/{carouselId}/publish: Publish one carousel to one Instagram or TikTok account. TikTok defaults to creator-inbox review.
- POST /api/gruvi/carousels/{carouselId}/schedule: Schedule one carousel to one Instagram or TikTok account. TikTok defaults to creator-inbox review.
- GET /api/gruvi/carousels/{carouselId}/publications/{requestId}: Check an uncertain carousel publication before retrying
- GET /api/gruvi/instagram/analytics/summary: Read Instagram engagement summary
- GET /api/gruvi/facebook/analytics/summary: Read Facebook engagement summary
- GET /api/gruvi/twitter/analytics/summary: Read X engagement summary

## MCP tools
- gruvi_login
- gruvi_get_plans
- gruvi_create_checkout
- gruvi_get_billing_status
- gruvi_get_user_info
- gruvi_get_social_accounts
- gruvi_upload_video
- gruvi_get_video_upload_url
- gruvi_finalize_video_upload
- gruvi_list_videos
- gruvi_get_video
- gruvi_upload_thumbnail
- gruvi_update_post_metadata
- gruvi_publish_post
- gruvi_get_post_status
- gruvi_schedule_post
- gruvi_list_scheduled_posts
- gruvi_get_scheduled_post
- gruvi_delete_scheduled_post
- gruvi_get_analytics
- gruvi_bulk_schedule_videos
- gruvi_list_carousels
- gruvi_upload_carousel
- gruvi_publish_carousel
- gruvi_schedule_carousel
- gruvi_get_carousel_publication

## Practical guides
- [A social media API for AI agents: from upload to verified delivery](https://agentgruvi.com/blog/social-media-api-for-ai-agents)
  Plain text: https://agentgruvi.com/docs/for-agents/guides/social-media-api-for-ai-agents.md
- [Bulk video scheduling: plan a batch without duplicating posts](https://agentgruvi.com/blog/bulk-video-scheduling)
  Plain text: https://agentgruvi.com/docs/for-agents/guides/bulk-video-scheduling.md
- [Instagram and TikTok carousels: upload, order and schedule your images](https://agentgruvi.com/blog/instagram-tiktok-carousel-posts)
  Plain text: https://agentgruvi.com/docs/for-agents/guides/instagram-tiktok-carousel-posts.md
- [A practical guide to social media analytics across five platforms](https://agentgruvi.com/blog/social-media-analytics-api)
  Plain text: https://agentgruvi.com/docs/for-agents/guides/social-media-analytics-api.md
- [Connect Claude Code or Codex to your social publishing workflow](https://agentgruvi.com/blog/connect-claude-code-codex-mcp)
  Plain text: https://agentgruvi.com/docs/for-agents/guides/connect-claude-code-codex-mcp.md
- [How to retry a social publishing request without creating duplicates](https://agentgruvi.com/blog/retry-social-media-posts-safely)
  Plain text: https://agentgruvi.com/docs/for-agents/guides/retry-social-media-posts-safely.md
