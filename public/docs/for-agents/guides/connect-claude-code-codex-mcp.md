# Connect Claude Code or Codex to your social publishing workflow

Install Gruvi's local MCP server, store your key safely and verify account access before asking an agent to upload or schedule content.

![Gruvi connecting a cable between code brackets and a video play symbol.](https://agentgruvi.com/marketing/blog/gruvi-mcp-editorial.webp)

Canonical: https://agentgruvi.com/blog/connect-claude-code-codex-mcp
Published: 2026-11-03T03:22:42+00:00
Updated: 2026-11-03T04:52:48.380Z
Author: Gruvi

## What you need to know
- Install the official @agent-gruvi/gruvi-mcp-server package.
- Local stdio MCP clients and direct HTTP workflows have different setup paths.
- Verify the account and connected destinations before the first send.

## Choose MCP or the HTTP API

MCP lets a compatible agent client discover named tools and their input schemas. Gruvi's local MCP server exposes tools for uploading media, scheduling posts, preparing carousels, inspecting delivery and reading analytics. It calls the hosted Gruvi API on behalf of your account.

Use the HTTP API directly when your automation already makes authenticated web requests. OpenClaw and other automation workflows can use that contract without pretending to be a local MCP client. A browser-based client that requires hosted remote MCP transport cannot use a local stdio configuration as a remote endpoint.

- [HTTP API overview](https://agentgruvi.com/api)

- [Full MCP setup](https://agentgruvi.com/docs/agent-integration)

## Create a key for this workflow

Set up the Gruvi account, verify the email and connect the channels you want to use. Create a named key in Agent Access. Use separate keys for separate agents or workflows so you can revoke a single integration without replacing every client configuration.

Store the key in your client's secret configuration or an environment variable. Do not put a real key in a public repository, screenshot or chat. The server determines the account from the key, so you should not derive a userId by splitting the key string.

- [Agent Access](https://agentgruvi.com/agents)

## Install the pinned package and configure your client

Gruvi's published package is @agent-gruvi/gruvi-mcp-server. The documented setup pins version 2.1.0, which exposes 26 tools and two readable documentation resources. It requires Node.js 20 or newer.

Claude Code, Claude Desktop and Codex can launch a local stdio server, but their configuration file formats differ. Use the exact client-specific example in the setup guide. Pass GRUVI_API_KEY through the environment and leave the API URL at its documented production value unless you are intentionally using a different environment.

```shell
npx --yes --package=@agent-gruvi/gruvi-mcp-server@2.1.0 gruvi-mcp
```

- [Client-specific configuration examples](https://agentgruvi.com/docs/agent-integration)

## Check the connection before any publication

Reload the MCP client, list the available tools and call gruvi_get_user_info. Then call gruvi_get_social_accounts and confirm the selected account names and IDs. These are read-only checks and do not require sending a real test post.

The server also exposes gruvi://docs/quickstart and gruvi://docs/api resources. An agent can read those instructions to understand authentication, publishing access, safe retries and platform delivery differences before it acts.

## Give the agent a specific publishing task

A useful request identifies the finished media, destination accounts, caption and time. Ask the agent to inspect existing media and schedules first so it can reuse a video instead of uploading it again. Keep changes to the media itself separate from distribution instructions.

For batches, use gruvi_bulk_schedule_videos and preserve the batch request ID. For image sequences, use the carousel tools. After sending, ask for the schedule or publication ID and the actual destination state. A public URL is useful evidence only when the platform has returned a real post URL.

Setup and media preparation are available before subscribing. When publishing access is needed, the agent can retrieve plans and return a hosted checkout link. The account owner completes that checkout; generating the link does not activate the subscription.

- [Pricing and three-day trial](https://agentgruvi.com/pricing)

- [Safe retry guide](https://agentgruvi.com/blog/retry-social-media-posts-safely)
