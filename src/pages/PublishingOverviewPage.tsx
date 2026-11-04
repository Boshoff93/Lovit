import { DashboardHeader, DashboardStats, DashboardNextSteps, UpcomingPostsSkeleton } from "../components/DashboardOverview";
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
      <DashboardHeader />
      {(posts.isError || accounts.isError) && (
        <WorkspaceNotice
          onRetry={() => Promise.all([posts.refetch(), accounts.refetch()])}
        >
          Some workspace data could not be loaded. Try again to refresh this
          overview.
        </WorkspaceNotice>
      )}
      <DashboardStats
        scheduled={posts.isError ? null : scheduled.length}
        failed={posts.isError ? null : failed.length}
        accounts={accounts.isError ? null : (accounts.data?.accounts.length ?? 0)}
        postsLoading={posts.isLoading}
        accountsLoading={accounts.isLoading}
      />
      <DashboardNextSteps />
      <section className="gd-upcoming">
        <div className="gd-inline-heading">
          <h2>Coming up</h2>
        </div>
        {posts.isError ? (
          <p>Your schedule is unavailable until the workspace reconnects.</p>
        ) : posts.isLoading ? (
          <UpcomingPostsSkeleton />
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
