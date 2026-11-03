export const mcpConfiguration = JSON.stringify(
  {
    mcpServers: {
      gruvi: {
        command: "npx",
        args: [
          "--yes",
          "--package=@agent-gruvi/gruvi-mcp-server@2.1.0",
          "gruvi-mcp",
        ],
        env: {
          GRUVI_API_KEY: "<your-agent-key>",
          GRUVI_API_URL: "https://api.agentgruvi.com",
        },
      },
    },
  },
  null,
  2,
);
export const agentQuickstart =
  "npm install --global @agent-gruvi/gruvi-mcp-server@2.1.0";
export const scheduleExample = JSON.stringify(
  {
    videoId: "<uploaded-video-id>",
    platforms: [
      { platform: "instagram", accountId: "<connected-account-id>" },
      { platform: "twitter", accountId: "<connected-account-id>" },
    ],
    scheduledTime: "2026-11-10T18:00:00Z",
    title: "Your post title",
    description: "Your caption",
    tags: ["your-tag"],
  },
  null,
  2,
);
export const distributionTools = [
  ["gruvi_get_plans", "List current subscription plans."],
  [
    "gruvi_create_checkout",
    "Create secure Stripe checkout for the selected plan.",
  ],
  ["gruvi_get_billing_status", "Verify subscription status after checkout."],
  ["gruvi_get_user_info", "Check the authenticated account."],
  ["gruvi_get_social_accounts", "List connected accounts and destination IDs."],
  ["gruvi_upload_video", "Upload a local video and optional custom thumbnail."],
  [
    "gruvi_get_video_upload_url",
    "Get a signed upload URL for an external workflow.",
  ],
  [
    "gruvi_finalize_video_upload",
    "Save a completed direct upload to the media library.",
  ],
  ["gruvi_list_videos", "Find existing videos before uploading again."],
  ["gruvi_get_video", "Inspect an existing video."],
  ["gruvi_upload_thumbnail", "Attach a custom thumbnail from a local file."],
  [
    "gruvi_update_post_metadata",
    "Save a title, caption and tags without generating content.",
  ],
  ["gruvi_publish_post", "Publish a video to selected connected accounts."],
  ["gruvi_get_post_status", "Check per-platform delivery results."],
  ["gruvi_schedule_post", "Schedule a future post."],
  ["gruvi_list_scheduled_posts", "Read the schedule and delivery history."],
  ["gruvi_get_scheduled_post", "Inspect one scheduled post."],
  ["gruvi_delete_scheduled_post", "Cancel a scheduled post."],
  [
    "gruvi_get_analytics",
    "Read TikTok and YouTube analytics, or Instagram, Facebook and X engagement summaries.",
  ],
  ["gruvi_bulk_schedule_videos", "Schedule up to 20 videos with retry-safe per-item results."],
  ["gruvi_list_carousels", "Inspect saved photo carousels."],
  ["gruvi_upload_carousel", "Upload 2 to 10 local images in display order."],
  ["gruvi_publish_carousel", "Send a carousel to one Instagram or TikTok account."],
  ["gruvi_schedule_carousel", "Schedule a carousel with an exact account target."],
  ["gruvi_get_carousel_publication", "Check a carousel send before retrying."],
];
