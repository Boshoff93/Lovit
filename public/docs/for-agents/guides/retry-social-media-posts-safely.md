# How to retry a social publishing request without creating duplicates

Use stable request IDs, inspect delivery after uncertainty and distinguish a scheduled post, a TikTok draft and a confirmed publication.

![Gruvi holding duplicate posts in a retry loop while guiding one post toward a check mark.](https://agentgruvi.com/marketing/blog/gruvi-retries-editorial.webp)

Canonical: https://agentgruvi.com/blog/retry-social-media-posts-safely
Published: 2026-11-03T03:22:42+00:00
Updated: 2026-11-03T04:52:48.380Z
Author: Gruvi

## What you need to know
- A timeout means the response is uncertain, not that nothing happened.
- Use stable request IDs where the endpoint supports them.
- Inspect existing delivery before retrying an immediate video publication.

## A lost response is not a failed post

A publishing request can reach a server even when the client does not receive its response. If an agent treats every timeout as permission to send again, it can create duplicate posts or duplicate calendar entries. The first step after uncertainty is to inspect the existing state.

Keep the video or carousel ID, selected destination IDs, logical request ID and any returned schedule ID in your workflow state. That small record is more useful than a success message that omits which account was targeted or what the platform actually returned.

## Give a logical operation a stable identity

Gruvi scheduling, bulk scheduling and carousel publication support a stable requestId. Reuse the original ID with the original payload after an uncertain response. Do not generate a fresh ID each time the network client retries.

A new caption, different destination or reordered batch is a different request. Reusing an old ID with changed content is rejected so that one identity cannot silently describe two publishing operations. For a batch, preserve the post order as well as the individual content and times.

```json
{
  "requestId": "product-launch-instagram-001",
  "videoId": "your-existing-video-id",
  "platforms": [
    {
      "platform": "instagram",
      "accountId": "your-connected-account-id"
    }
  ],
  "scheduledTime": "2026-12-01T09:00:00Z"
}
```

- [Scheduling API](https://agentgruvi.com/docs/api-reference#schedulePost)

## Immediate video publishing needs a delivery check

Do not assume every endpoint has the same idempotency behavior. Before repeating an immediate video publication, read that video's per-platform social-upload status. The existing batch-social-upload path should not be blindly resubmitted just because its HTTP response was lost.

Inspect the result for each selected destination. A multi-platform request can succeed for one network and fail for another. Keep the successful result, diagnose the failed destination and avoid resetting the whole aggregate operation while another platform is still processing.

- [Publishing and delivery endpoints](https://agentgruvi.com/docs/api-reference#group-publishing)

## Use the right words for the current state

Scheduled means that a future instruction was accepted. Processing means work is still in flight. Published means the integration has confirmed the platform outcome. TikTok creator-inbox delivery is a draft awaiting review, even when its transfer completed successfully.

Do not substitute a profile URL for a missing post URL. A link to a channel proves that the channel exists, not that the requested video or image set was published. Report the operation ID and current status when the platform has not provided a native post link.

## Respect rate limits and access failures

A 429 response includes retry guidance. Honor Retry-After rather than launching parallel retries. Gruvi shares request allowances across an account's keys, so switching keys does not create a fresh account budget.

A 403 response can indicate a publishing-plan, verification, ownership or platform-permission requirement. Fix the specific access problem before sending again. A 503 protection failure is also not permission to bypass the protected endpoint.

Your agent's final report should name each intended destination and say published, scheduled, draft, processing or failed. Include the exact next step for unresolved work. Clear state reporting is part of the publishing workflow, not an optional summary at the end.

- [Authentication, errors and limits](https://agentgruvi.com/docs/api-reference#rate-limits)

- [Bulk partial results](https://agentgruvi.com/blog/bulk-video-scheduling)
