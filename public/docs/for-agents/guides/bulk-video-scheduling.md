# Bulk video scheduling: plan a batch without duplicating posts

Schedule up to 20 finished videos through the Gruvi dashboard, API or MCP connector, with individual times and retry-safe results.

Canonical: https://agentgruvi.com/blog/bulk-video-scheduling
Published: 2026-11-03T03:22:42+00:00
Updated: 2026-11-03T03:22:42+00:00
Author: Gruvi

## What you need to know
- A batch contains 1 to 20 existing videos, each with its own time and caption.
- A multi-status response can contain both accepted and rejected items.
- Retry an unchanged batch with the original requestId.

## Build the batch from finished videos

Bulk video scheduling is useful when the media is ready and the work is mostly repetitive: select the same channels, assign publishing times and check several results. In Gruvi, a bulk request contains 1 to 20 posts. Each item references a video in your account and has its own title, caption, future time and connected-account targets.

Upload the videos before you submit the batch. In the dashboard, open Bulk Scheduling, upload several files or choose existing library items, then select destinations. Set the first publishing time and an interval to fill the schedule, and review the time for every row before submitting.

Spacing posts is a planning convenience, not a guarantee of better reach. Choose the cadence that fits your audience and the material you have, rather than filling every available slot.

- [Open bulk scheduling](https://agentgruvi.com/posts/bulk)

## Send a stable batch request

Use POST /api/gruvi/scheduled-posts/bulk with one stable requestId. Preserve both that ID and the order of the posts when retrying an uncertain response. Changing the content, order or timing represents a different batch and should use a new ID.

The example below shows the shape of a batch item. Replace the example IDs and timestamp with your own media, account and future publishing time. Add another object to posts for each video you want to schedule.

```json
{
  "requestId": "campaign-launch-batch-001",
  "posts": [
    {
      "videoId": "your-video-id",
      "title": "A closer look",
      "description": "The details behind our next release.",
      "platforms": [
        {
          "platform": "instagram",
          "accountId": "your-connected-account-id"
        }
      ],
      "scheduledTime": "2026-12-01T09:00:00Z"
    }
  ]
}
```

- [Bulk request fields and responses](https://agentgruvi.com/docs/api-reference#bulkScheduleVideos)

## Read every item in a partial result

A 201 response means all items were scheduled. A 207 response contains per-item results, so the batch may be partly accepted. Inspect the success value, scheduleId and any error for each index. Do not label the entire batch successful because one item received a schedule ID.

Gruvi validates the media and destination ownership before creating the schedules. Scheduling allowances are consumed atomically, which prevents simultaneous requests from exceeding the account limit. A valid batch can still have partial results when the remaining monthly allowance cannot cover every item.

## Keep retries and cancellations deliberate

If the response is uncertain, check the calendar and retry the unchanged batch with the same requestId. Accepted items retain their schedule IDs and do not consume a second allowance. To change a caption or time, inspect the existing schedule first instead of submitting a slightly different batch under its old identity.

A future schedule that has not started can be cancelled. Gruvi refunds that scheduled allowance once. A post that is already publishing or finished cannot be made safe to resend just by cancelling a calendar entry.

- [Safe retry guide](https://agentgruvi.com/blog/retry-social-media-posts-safely)

## Use the same batch from an MCP agent

The MCP tool gruvi_bulk_schedule_videos accepts the same logical batch. Your agent should keep the batch request ID in its task state, inspect per-item results and report any rejected rows. It should also distinguish scheduled acceptance from published delivery.

TikTok videos in the bulk dashboard use creator-inbox review. Other networks attempt publication at the scheduled time, subject to their permissions and media requirements. Keep that distinction in your campaign checklist so a review draft is not mistaken for a public post.

- [Connect an MCP client](https://agentgruvi.com/docs/agent-integration)

- [Platform delivery rules](https://agentgruvi.com/docs/social)
