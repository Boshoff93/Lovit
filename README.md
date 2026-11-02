# Gruvi

Content distribution for agents. Gruvi keeps its existing React and Material UI design while focusing on finished media, social publishing, scheduling, delivery status and analytics.

## Development

```sh
npm ci
npm start
```

The app uses the Gruvi API at `https://api.agentgruvi.com`. Authentication and social connections use the existing backend. Never put provider or Stripe secret keys in the frontend.

```sh
CI=true npm test -- --watchAll=false --runInBand
npm run build
npm run preview
```

The preview serves the production build at `http://127.0.0.1:3031`.
It proxies `/api` and `/auth` to the Gruvi API so browser authentication works on port 3031. The preview uses your real Gruvi account data.

## Product scope

- Free account setup, connected accounts, media uploads, agent keys, calendar and available analytics.
- A paid plan is required when publishing immediately or submitting a scheduled post. The composer opens a dismissible plan chooser at that point.
- Monthly plans: Starter $10 with 60 scheduled posts, Scale $25 with 120, and Pro $50 with 240. Immediate publishing is included. A scheduled post can target several accounts.
- The existing day, week and month calendar remains in place.
- AI generation routes redirect to publishing or the media library. The matching backend retires generation writes while keeping existing media readable.

The internal subscription tiers remain `starter`, `pro` and `premium` for compatibility. Display names map to Starter, Scale and Pro. Existing subscriptions keep their existing Stripe prices.

## Agent discovery

The public docs live at `/docs`, with setup at `/docs/agent-integration` and API contracts at `/docs/api-reference`. Machine-readable entry points are `public/llms.txt`, `public/llms-full.txt`, `public/agents.md`, `public/openapi.json` and `public/.well-known/mcp.json`.

The MCP server is a local stdio server distributed as a versioned public download. It is not a hosted HTTP MCP endpoint or a published npm package. Its source is in the sibling backend repository at `packages/gruvi-mcp-server`.

To rebuild the public bundle from that package:

```sh
npm test
npm pack --pack-destination ../../../Gruvi/public/downloads
```

When changing its version, update the download URL in the docs, discovery files and `src/config/agentDocs.ts` together.

## Billing and release

The frontend calls the authenticated backend `/api/publishing/checkout` with a plan ID and stable request ID. The server chooses the Stripe price. Agents can request the same hosted checkout link through MCP; creating a checkout link does not activate a subscription. Access follows verified Stripe webhook state.

Deploy the matching Gruvi backend before the frontend. The backend changes supply free social-account setup, publishing access checks, generation retirement, checkout and subscription reconciliation. See `../Gruvi-Backend/DISTRIBUTION_RELEASE.md` for the release checks. Deploy the complete `build` directory, including the MCP download and hidden `.well-known` directory.
