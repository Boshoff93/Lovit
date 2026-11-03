import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import PublicPage from "../../components/PublicPage";
import CodeExample from "../../components/CodeExample";
import { SEO } from "../../utils/seoHelper";
import {
  apiBase,
  apiDocument,
  apiGroups,
  apiOperations,
  ApiOperation,
  ExampleLanguage,
  requestExample,
  resolveSchema,
  schemaType,
} from "../../content/apiReference";

function FieldTable({
  fields,
}: {
  fields: {
    name: string;
    schema: any;
    required?: boolean;
    description?: string;
    location?: string;
  }[];
}) {
  if (!fields.length) return null;
  return (
    <div className="gr-table-wrap">
      <table className="gr-table gr-fields">
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => {
            const schema = resolveSchema(field.schema);
            const bounds = [
              schema.minItems !== undefined
                ? `Minimum ${schema.minItems} items.`
                : "",
              schema.maxItems !== undefined
                ? `Maximum ${schema.maxItems} items.`
                : "",
              schema.maxLength !== undefined
                ? `Up to ${schema.maxLength} characters.`
                : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <tr key={field.name}>
                <td>
                  <code>{field.name}</code>
                  {field.required && (
                    <span className="gr-field-required">Required</span>
                  )}
                </td>
                <td>
                  <code>{schemaType(schema)}</code>
                  {field.location && <small>{field.location}</small>}
                </td>
                <td>
                  {field.description ||
                    schema.description ||
                    (schema.format ? `Format: ${schema.format}.` : "")}{" "}
                  {bounds}
                  {schema.enum && (
                    <span> Values: {schema.enum.join(", ")}.</span>
                  )}
                  {schema.properties && (
                    <span>
                      {" "}
                      Object fields: {Object.keys(schema.properties).join(", ")}
                      .
                    </span>
                  )}
                  {schema.type === "array" &&
                    resolveSchema(schema.items).properties && (
                      <span>
                        {" "}
                        Item fields:{" "}
                        {Object.keys(
                          resolveSchema(schema.items).properties,
                        ).join(", ")}
                        .
                      </span>
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
function Endpoint({
  operation,
  language,
  selected,
}: {
  operation: ApiOperation;
  language: ExampleLanguage;
  selected: boolean;
}) {
  const definition = operation.definition;
  const body = resolveSchema(
    definition.requestBody?.content?.["application/json"]?.schema,
  );
  return (
    <section className="gr-endpoint" id={operation.id}>
      <details open={selected}>
        <summary>
          <span className={`gr-method is-${operation.method.toLowerCase()}`}>
            {operation.method}
          </span>
          <span className="gr-endpoint-title">
            <code>{operation.path}</code>
            <strong>{definition.summary}</strong>
          </span>
          <span className="gr-expand" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="gr-endpoint-body">
          {definition.description && <p>{definition.description}</p>}
          <p className="gr-note">
            {(definition.security || apiDocument.security || []).length
              ? "Authentication: bearer agent key. The server resolves the account from your key."
              : "Public endpoint. No agent key is required."}
          </p>
          {!!definition.parameters?.length && (
            <>
              <h4>Parameters</h4>
              <FieldTable
                fields={definition.parameters.map((parameter: any) => ({
                  ...parameter,
                  location: parameter.in,
                }))}
              />
            </>
          )}
          {body.properties && (
            <>
              <h4>JSON request body</h4>
              <FieldTable
                fields={Object.entries(body.properties).map(
                  ([name, schema]) => ({
                    name,
                    schema,
                    required: body.required?.includes(name),
                  }),
                )}
              />
            </>
          )}
          <CodeExample
            code={requestExample(operation, language)}
            label={`${language} example`}
          />
          <h4>Responses</h4>
          <div className="gr-response-list">
            {Object.entries(definition.responses || {}).map(
              ([status, response]: [string, any]) => (
                <div key={status}>
                  <code>{status}</code>
                  <span>{response.description}</span>
                </div>
              ),
            )}
          </div>
          <a className="gr-card-link" href={`#${operation.id}`}>
            Link to this endpoint <span aria-hidden="true">#</span>
          </a>
        </div>
      </details>
    </section>
  );
}
export default function ApiReferencePage() {
  const location = useLocation();
  const compact = useMediaQuery("(max-width:900px)");
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<ExampleLanguage>("Shell");
  const [selected, setSelected] = useState("");
  const operations = useMemo(
    () =>
      apiOperations.filter((operation) =>
        `${operation.method} ${operation.path} ${operation.group} ${operation.definition.summary}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
      ),
    [query],
  );
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    setSelected(id);
    if (id)
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ block: "start" }),
      );
  }, [location.hash]);
  const jump = (id: string) => {
    setQuery("");
    setSelected(id);
  };
  return (
    <PublicPage className="gr-reference-page">
      <SEO
        title="Gruvi API Reference | OpenAPI, Requests & Examples"
        description="Browse Gruvi's hosted social media API. Search media uploads, bulk scheduling, image carousels, publishing and five-platform analytics, with Shell, JavaScript and Python examples."
        canonicalUrl="https://agentgruvi.com/docs/api-reference"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Gruvi API Reference",
          url: "https://agentgruvi.com/docs/api-reference",
          author: {
            "@type": "Organization",
            name: "Gruvi",
            url: "https://agentgruvi.com",
          },
        }}
      />
      <main className="gr-container gr-reference-layout">
        <aside className="gr-reference-nav">
          <label className="gr-search-label" htmlFor="endpoint-search">
            Find an endpoint
          </label>
          <input
            className="gr-search"
            id="endpoint-search"
            type="search"
            placeholder="Search uploads, bulk, analytics..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className="gr-search-count" aria-live="polite">
            {operations.length}{" "}
            {operations.length === 1 ? "endpoint" : "endpoints"}
          </p>
          <details className="gr-reference-menu" open={!compact || !!query}>
            <summary>Browse API sections</summary>
            <nav aria-label="API reference">
              <a href="#introduction" onClick={() => jump("introduction")}>
                Introduction
              </a>
              <a href="#authentication" onClick={() => jump("authentication")}>
                Authentication
              </a>
              <a href="#rate-limits" onClick={() => jump("rate-limits")}>
                Limits and retries
              </a>
              {apiGroups.map((group) => {
                const items = operations.filter(
                  (operation) => operation.group === group,
                );
                return (
                  !!items.length && (
                    <div className="gr-reference-group" key={group}>
                      <a
                        className="gr-reference-group-label"
                        href={`#group-${group.toLowerCase()}`}
                        onClick={() => jump(`group-${group.toLowerCase()}`)}
                      >
                        {group}
                      </a>
                      {items.map((operation) => (
                        <a
                          className={
                            selected === operation.id ? "is-active" : ""
                          }
                          key={operation.id}
                          href={`#${operation.id}`}
                          onClick={() => jump(operation.id)}
                        >
                          <span
                            className={`gr-method is-${operation.method.toLowerCase()}`}
                          >
                            {operation.method}
                          </span>
                          <span>
                            {operation.definition["x-displayName"] ||
                              operation.definition.summary.split(";")[0]}
                          </span>
                        </a>
                      ))}
                    </div>
                  )
                );
              })}
              <Link to="/docs/agent-integration">MCP setup ↗</Link>
              <Link to="/blog">Publishing guides ↗</Link>
            </nav>
          </details>
        </aside>
        <div className="gr-reference-content">
          <header className="gr-reference-intro" id="introduction">
            <p className="gr-eyebrow">OpenAPI reference</p>
            <h1>Gruvi API</h1>
            <p className="gr-lead">
              Content distribution over HTTPS. Upload finished media, publish or
              schedule posts, and check what happened next.
            </p>
            <div className="gr-badges">
              <span>v{apiDocument.info.version}</span>
              <span>OpenAPI {apiDocument.openapi}</span>
              <span>{apiOperations.length} endpoints</span>
            </div>
            <div className="gr-api-base">
              <span>Base URL</span>
              <code>{apiBase}</code>
            </div>
            <div className="gr-actions">
              <a
                className="gr-button"
                href="/openapi.json"
                download="gruvi-openapi.json"
              >
                Download OpenAPI <span aria-hidden="true">↓</span>
              </a>
              <Link className="gr-text-link" to="/api">
                API overview →
              </Link>
            </div>
          </header>
          <section className="gr-doc-section" id="authentication">
            <h2>Authentication</h2>
            <p>
              Create a named key in <Link to="/agents">Agent Access</Link> after
              verifying your account. Keep the key in an environment variable or
              secret manager. Send{" "}
              <code>Authorization: Bearer $GRUVI_API_KEY</code> to the Gruvi
              API. Never forward this header to a signed storage upload URL.
            </p>
            <p>
              Read{" "}
              <Link to="#getAccount" onClick={() => jump("readAccount")}>
                your account
              </Link>{" "}
              to obtain its userId, then list connected accounts to choose exact
              destination IDs. Do not derive a userId from the key itself. X
              uses the platform identifier <code>twitter</code>.
            </p>
            <CodeExample
              label="A read-only first request"
              code={
                'curl --fail-with-body https://api.agentgruvi.com/api/gruvi/social-accounts \\\n  -H "Authorization: Bearer $GRUVI_API_KEY"'
              }
            />
          </section>
          <section className="gr-doc-section" id="rate-limits">
            <h2>Limits, access and retries</h2>
            <p>
              Setup, connected accounts and media preparation remain available
              before subscribing. Submitting a post requires verified, active
              publishing access through a plan, trial or complimentary grant.
              Eligible accounts can start one three-day trial through hosted
              checkout.
            </p>
            <div className="gr-facts">
              <div>
                <strong>180 / minute</strong>
                <span>Requests per account</span>
              </div>
              <div>
                <strong>40 / minute</strong>
                <span>Writes per account</span>
              </div>
              <div>
                <strong>12 / minute</strong>
                <span>Publishing requests</span>
              </div>
            </div>
            <p>
              Keys for an account share these limits. Credential and checkout
              writes allow 10 requests per five minutes. Free preparation allows
              five video and 50 image upload allocations daily; an active
              publishing plan or trial allows 60 videos and 400 images.
              Authentication and recovery have separate protections.
            </p>
            <p>
              Honor <code>Retry-After</code> on 429 responses. For schedules,
              bulk requests and carousel sends, preserve the original requestId
              and unchanged payload after uncertainty. For an immediate video
              send, read delivery status before retrying. A queued request, a
              future schedule and a TikTok inbox draft are different from a
              confirmed public post.
            </p>
            <Link
              className="gr-card-link"
              to="/blog/retry-social-media-posts-safely"
            >
              Read the retry guide →
            </Link>
          </section>
          <div className="gr-reference-tools">
            <div>
              <h2>Endpoint reference</h2>
              <p>
                Replace example IDs and timestamps before running a request. An
                accountId identifies a connected destination; videoId and
                carouselId identify saved media.
              </p>
            </div>
            <fieldset className="gr-language-picker">
              <legend>Example language</legend>
              {(["Shell", "JavaScript", "Python"] as ExampleLanguage[]).map(
                (value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={language === value}
                    onClick={() => setLanguage(value)}
                  >
                    {value}
                  </button>
                ),
              )}
            </fieldset>
          </div>
          {!operations.length && (
            <div className="gr-empty">
              <h3>No matching endpoints</h3>
              <p>
                Try a platform name, a method or a workflow such as carousel.
              </p>
              <button
                type="button"
                className="gr-button"
                onClick={() => setQuery("")}
              >
                Clear search
              </button>
            </div>
          )}
          {apiGroups.map((group) => {
            const items = operations.filter(
              (operation) => operation.group === group,
            );
            return (
              !!items.length && (
                <section
                  className="gr-endpoint-group"
                  id={`group-${group.toLowerCase()}`}
                  key={group}
                >
                  <h2>{group}</h2>
                  <p>
                    {
                      apiDocument.tags.find((tag: any) => tag.name === group)
                        .description
                    }
                  </p>
                  {items.map((operation) => (
                    <Endpoint
                      key={operation.id}
                      operation={operation}
                      language={language}
                      selected={selected === operation.id}
                    />
                  ))}
                </section>
              )
            );
          })}
          <section className="gr-doc-section">
            <h2>Keep the contract close to your workflow.</h2>
            <p>
              The OpenAPI document describes these same endpoints. Agents can
              also read <a href="/llms-full.txt">the full plain-text guide</a>,{" "}
              <a href="/docs/for-agents/api-reference.md">the API notes</a> and
              the MCP server's built-in resources. Read{" "}
              <Link to="/docs/social">platform settings</Link> before sending
              content.
            </p>
          </section>
        </div>
      </main>
    </PublicPage>
  );
}
