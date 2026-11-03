import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import WorkspaceNotice from "../components/WorkspaceNotice";
import { RootState } from "../store/store";
import {
  useGetScheduledPostsQuery,
  useGetSocialAccountsQuery,
} from "../store/apiSlice";
export default function PublishingOverviewPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useGetScheduledPostsQuery();
  const accounts = useGetSocialAccountsQuery(
    { userId: user?.userId || "" },
    { skip: !user?.userId },
  );
  const items = posts.data?.scheduledPosts || [];
  const scheduled = items.filter((p) => p.status === "scheduled");
  const failed = items.filter(
    (p) => p.status === "failed" || p.status === "partial",
  );
  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Your distribution workspace</p>
          <h1>Ready for your next post.</h1>
          <p>
            See what's scheduled, check delivery and keep your accounts
            connected.
          </p>
          <div className="gd-card-actions">
            <Link
              className="gd-button gd-primary-action gd-card-action"
              to="/posts/new"
            >
              New post <span aria-hidden="true">+</span>
            </Link>
          </div>
        </div>
      </header>
      {(posts.isError || accounts.isError) && (
        <WorkspaceNotice
          onRetry={() => Promise.all([posts.refetch(), accounts.refetch()])}
        >
          Some workspace data could not be loaded. Try again to refresh this
          overview.
        </WorkspaceNotice>
      )}
      {posts.isLoading || accounts.isLoading ? (
        <WorkspaceSkeleton label="Loading workspace" />
      ) : (
        <div className="gd-stat-grid">
          {[
            [
              "Scheduled",
              posts.isError ? "—" : scheduled.length,
              "/settings/scheduled-content",
            ],
            [
              "Need attention",
              posts.isError ? "—" : failed.length,
              "/settings/scheduled-content",
            ],
            [
              "Connected accounts",
              accounts.isError ? "—" : (accounts.data?.accounts.length ?? 0),
              "/settings/connected-accounts",
            ],
          ].map(([label, value, to]) => (
            <Link to={String(to)} className="gd-stat" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <span>
                Open <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>
      )}
      <section className="gd-dashboard-next">
        <div>
          <p className="gd-eyebrow">The next step</p>
          <h2>Content in. Posts out.</h2>
          <p>
            Upload a finished video and thumbnail, choose your connected
            accounts, then publish or schedule it.
          </p>
          <Link className="gd-text-link" to="/posts/new">
            Prepare a post →
          </Link>
        </div>
        <div>
          <p className="gd-eyebrow">Work through your agent</p>
          <h2>Connect once. Keep moving.</h2>
          <p>
            Create an agent key, install the MCP server and put Gruvi inside
            your existing workflow.
          </p>
          <Link className="gd-text-link" to="/agents">
            Set up agent access →
          </Link>
        </div>
      </section>
      <section className="gd-upcoming">
        <div className="gd-inline-heading">
          <h2>Coming up</h2>
        </div>
        {posts.isError ? (
          <p>Your schedule is unavailable until the workspace reconnects.</p>
        ) : posts.isLoading ? (
          <WorkspaceSkeleton
            label="Loading upcoming posts"
            kind="list"
            rows={2}
          />
        ) : scheduled.length ? (
          scheduled
            .slice()
            .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
            .slice(0, 5)
            .map((p) => (
              <Link
                className="gd-upcoming-row"
                key={p.scheduleId}
                to="/settings/scheduled-content"
              >
                <span>
                  {p.title || "Untitled post"}
                  <small>
                    {p.platforms
                      .map((v) => (v.platform === "twitter" ? "X" : v.platform))
                      .join(" · ")}
                  </small>
                </span>
                <time dateTime={p.scheduledTime}>
                  {new Date(p.scheduledTime).toLocaleString()}
                </time>
              </Link>
            ))
        ) : (
          <p>
            No posts are scheduled yet. Your next scheduled post will appear
            here.
          </p>
        )}
        <div className="gd-card-actions">
          <Link className="gd-text-link" to="/settings/scheduled-content">
            View schedule ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
