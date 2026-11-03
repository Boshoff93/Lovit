---
name: gruvi
version: 2.1.0
description: Distribute finished videos through social publishing, scheduling, delivery status and analytics.
homepage: https://agentgruvi.com
metadata:
  api_base: https://api.agentgruvi.com
  docs: https://agentgruvi.com/docs/agent-integration
---

# Gruvi: content distribution for agents

Gruvi distributes finished video content to connected X, Instagram, TikTok, YouTube, Facebook and LinkedIn accounts. It provides a dashboard, calendar, HTTP API and a standard stdio MCP server. It does not generate content.

## Setup
1. Sign in at https://agentgruvi.com and verify your email.
2. Connect destination accounts in https://agentgruvi.com/settings/connected-accounts.
3. Create an agent key at https://agentgruvi.com/agents. Store it as GRUVI_API_KEY in the MCP client environment.
4. Requires Node.js 20+. Install the versioned bundle:
   npm install --global @agent-gruvi/gruvi-mcp-server@2.1.0
5. Configure your MCP client:
   {"mcpServers":{"gruvi":{"command":"npx","args":["--yes","--package=@agent-gruvi/gruvi-mcp-server@2.1.0","gruvi-mcp"],"env":{"GRUVI_API_KEY":"<your-agent-key>","GRUVI_API_URL":"https://api.agentgruvi.com"}}}}
6. Reload the MCP client and call gruvi_get_user_info and gruvi_get_social_accounts.

The server uses stdio. A hosted HTTP MCP endpoint is not part of this release. The downloadable bundle is served with the website; it does not require access to the source repository or claim publication on npm.

## Workflow
Inspect the media library before uploading again. Call gruvi_upload_video with a local MP4/MOV/WebM path, title and optional JPEG thumbnailFilePath. Video limit: 512 MB. Thumbnail limit: 5 MB.
Choose exact account IDs from gruvi_get_social_accounts.
Set title, caption and tags through gruvi_update_post_metadata, and a custom JPEG through gruvi_upload_thumbnail.
For immediate delivery use gruvi_publish_post. For later delivery use gruvi_schedule_post with an ISO 8601 timestamp including a timezone.
Check gruvi_get_post_status for an immediate post or gruvi_get_scheduled_post for a schedule. A queue acknowledgement is not confirmed publication.

## Billing
Free users can explore the workspace, connect accounts, upload media, create agent keys and inspect the calendar.
Submitting an immediate or scheduled post requires an active paid plan.
Monthly plans (USD): Starter $10, 60 scheduled posts; Scale $25, 120; Pro $50, 240.
A schedule can target multiple connected accounts. Cancelled schedules are excluded from the calendar-month allowance.
Immediate publishing is included; the monthly allowance applies to scheduled posts.
Agents can call gruvi_get_plans and gruvi_create_checkout with planId and a stable requestId. Return the Stripe-hosted checkoutUrl for secure completion. Reuse the requestId after an uncertain response; do not collect card details or silently charge a saved card.
Call gruvi_get_billing_status and wait for active subscription status after payment. Checkout creation and browser redirects do not activate membership.
Taxes follow the merchant's existing Stripe configuration and are shown by checkout when applicable.

## Available MCP tools
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

## API
Base URL: https://api.agentgruvi.com
Authentication: Authorization: Bearer <agent-key>
Schema: https://agentgruvi.com/openapi.json
Account: GET /api/user/account -> user.userId.
Accounts: GET /api/gruvi/social-accounts -> accounts[].
Uploads: POST /api/gruvi/videos/{userId}/get-upload-url with fileName,fileType,fileSize. PUT bytes to the returned uploadUrl with matching Content-Type and no Gruvi Authorization header. POST /api/gruvi/videos/{userId}/finalize-upload with videoId,videoKey,title,description,aspectRatio.
Thumbnail: POST /api/gruvi/videos/{userId}/{videoId}/upload-thumbnail with thumbnailBase64 as a JPEG data URL.
Metadata: PUT /api/gruvi/videos/{userId}/{videoId}/social-metadata with title,description,tags.
Publish: POST /api/gruvi/videos/{userId}/{videoId}/batch-social-upload with platforms:[{platform,accountId}], optional title,description,tags and platform settings. HTTP 202 is queued, not published.
Immediate status: GET /api/gruvi/videos/{userId}/{videoId}/social-upload-status.
Schedule: POST /api/gruvi/scheduled-posts with videoId,platforms,scheduledTime,title,description,tags and optional thumbnailUrl/thumbnailKey. Response: {success,scheduledPost}.
Calendar: GET /api/gruvi/scheduled-posts -> {scheduledPosts,schedulingLimits}.
One post: GET /api/gruvi/scheduled-posts/{scheduleId}.
Cancel: DELETE /api/gruvi/scheduled-posts/{scheduleId}.
Plans: GET /api/publishing/plans.
Checkout: POST /api/publishing/checkout with planId:starter|scale|pro and requestId (8-100 letters, digits, underscores or hyphens).
Billing status: GET /api/user/subscription -> {subscription}.
Analytics: GET /api/gruvi/{youtube|tiktok}/analytics/{summary|trends}, optional accountId.

## Platform settings and limitations
Platform identifiers: twitter, instagram, tiktok, youtube, facebook, linkedin.
Use a connected account ID to identify the exact destination.
TikTok defaults to postMode:draft (creator inbox), privacyLevel:SELF_ONLY and interactions off. For direct posting select allowed privacy, comments, duet, stitch and content disclosures intentionally.
Custom thumbnail support depends on the destination and account permissions. Upload the custom thumbnail before sending.
TikTok and YouTube have analytics dashboards. The other networks currently provide publishing and delivery status.
This workflow supports video content and video thumbnails; it does not advertise text-only posts or image carousels.

## Agent rules
- Require the user's instruction to cover public content and destination accounts.
- Reuse existing media where appropriate.
- Never infer publication from scheduling or upload acceptance.
- Inspect status after an uncertain send before retrying. The publishing endpoints do not promise exactly-once delivery or general idempotency.
- Keep agent keys and signed storage URLs out of logs and chat.
- Report partial platform delivery explicitly.
- Do not submit a real social post or purchase as a setup test.

## Errors
Setup and read tools remain available without a paid plan. A publishing refusal uses `code: PUBLISHING_PLAN_REQUIRED` and includes checkout and documentation details. Respect `Retry-After` on a 429 response. User IDs must match the authenticated account.

401: invalid or missing authentication. 403: access or paid-plan requirement. 409: existing subscription needs management. 410: retired generation route. 429: scheduling allowance or provider limit. For timeouts and 5xx during side effects, inspect status before repeating.

Docs: https://agentgruvi.com/docs/agent-integration
HTTP reference: https://agentgruvi.com/docs/api-reference
Platform guide: https://agentgruvi.com/docs/social
Discovery manifest: https://agentgruvi.com/.well-known/mcp.json


## Bulk scheduling, carousels and analytics
Use gruvi_bulk_schedule_videos for 1 to 20 existing videos with exact account IDs and a future time per post. Keep the same requestId and unchanged content when retrying. A 207 response lists per-item results; do not create a new request ID merely because only some items succeeded.
Use gruvi_upload_carousel to upload 2 to 10 JPEG, PNG or WebP images in order, up to 5 MB each. Images are fitted to a 4:5 canvas without cropping. Uploads do not publish. Publish or schedule to one Instagram or TikTok account using gruvi_publish_carousel or gruvi_schedule_carousel. After uncertainty, check gruvi_get_carousel_publication with the same request ID. TikTok inbox drafts require the creator to finish posting.
Analytics supports TikTok and YouTube, plus Instagram, Facebook and X recent-post summaries where platform permissions/API access allow. Supply an accountId for the latter and use kind=summary. Missing metrics are unavailable, not zero.
Eligible verified accounts can start one three-day trial through hosted Stripe checkout. A payment method is required; the selected monthly subscription renews unless canceled before trial end. Setup remains free. Creating a checkout URL does not activate access.
Rate limits are shared across all keys for an account: 180 requests/minute and 40 writes/minute, with tighter limits on publishing, credentials and checkout. Honor Retry-After. Store agent keys in client secrets, never in chat or source control. Agent keys cannot manage account credentials or invoke internal worker routes.
