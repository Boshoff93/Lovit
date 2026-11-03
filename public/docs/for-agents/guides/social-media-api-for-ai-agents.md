# A social media API for AI agents: from upload to verified delivery

How to connect an agent to Gruvi, upload finished media, choose exact account targets and check whether a post actually published.

Canonical: https://agentgruvi.com/blog/social-media-api-for-ai-agents
Published: 2026-11-03T03:22:42+00:00
Updated: 2026-11-03T03:22:42+00:00
Author: Gruvi

## What you need to know
- Separate media preparation, scheduling and published delivery.
- Choose connected account IDs instead of guessing a destination.
- Use the HTTP API directly or the local MCP connector.

## What a social media API should do for your agent

An agent can prepare a caption and choose a publishing time, but it still needs an authenticated way to send that work to the right social account. Gruvi provides that distribution layer through a hosted HTTPS API and a local MCP server.

The workflow starts with content you already have. Upload a finished video, attach a thumbnail, select connected destinations and publish now or schedule ahead. You can perform the same work manually in the dashboard. Gruvi does not need to generate the media to distribute it.

Keep the boundaries visible in your own application. An uploaded video is library media. A scheduled post is a future instruction. A published result is a platform outcome. Treating those as separate records makes it easier to explain progress and recover from failures.

## Start with a named agent key

Create an account, verify your email and connect your social channels in the workspace. Create a named agent key for the workflow you are building. Store it in an environment variable or secret manager and send it as a bearer token to the Gruvi API.

Call the account and connected-accounts endpoints before sending anything. The account response supplies your userId. Each connected destination has its own accountId, even when two accounts use the same platform. Agent keys authorize your Gruvi account; they are not the platform OAuth tokens, and they cannot mint more agent keys.

```shell
curl --fail-with-body https://api.agentgruvi.com/api/gruvi/social-accounts \
  -H "Authorization: Bearer $GRUVI_API_KEY"
```

- [Authentication and account endpoints](https://agentgruvi.com/docs/api-reference#getAccount)

## Upload media once, then reuse its ID

Request a signed video upload URL, upload the file to storage and finalize it in Gruvi. The file upload and the API call use different credentials: send your bearer key only to Gruvi, never to the signed storage URL. The videoId returned by finalization identifies the library item you can reuse for later posts.

Prepare a title, caption and any custom thumbnail before scheduling. Do not assume that a stored thumbnail will become the native cover on every platform. The platform settings guide explains the delivery options and restrictions for each destination.

- [Media API](https://agentgruvi.com/docs/api-reference#group-media)

- [Platform settings](https://agentgruvi.com/docs/social)

## Schedule with exact targets and a future time

Send the selected account IDs with the platform identifiers returned by Gruvi. X uses the identifier twitter. Use an ISO 8601 timestamp with a timezone for scheduling, and choose a future time. Give the operation a stable requestId so an uncertain response can be retried without inventing a second logical schedule.

Free setup lets you connect channels, prepare media and configure your agent. Submitting a post requires an active publishing plan, trial or complimentary access. If a plan is needed, your agent can return a Stripe-hosted checkout link for the account owner to complete.

- [Schedule a post](https://agentgruvi.com/docs/api-reference#schedulePost)

- [Plans and trial](https://agentgruvi.com/pricing)

## Read the result before calling the job finished

Read the schedule record and the destination delivery results after the scheduled time. An accepted queue request does not establish that a public post exists. TikTok creator-inbox delivery produces a draft for review, which is different from a live post.

For a network timeout during an immediate send, inspect the existing delivery state first. Automatically resubmitting the same video can create duplicate public posts. Record the operation ID, destination account and current platform state in your agent workflow so you can report what actually happened.

- [MCP installation and operating rules](https://agentgruvi.com/docs/agent-integration)
