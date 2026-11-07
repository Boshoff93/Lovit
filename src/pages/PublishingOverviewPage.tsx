import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DashboardHeader, DashboardStats, DashboardNextSteps, UpcomingPostsSkeleton, scheduleLink } from '../components/DashboardOverview';
import WorkspaceNotice from '../components/WorkspaceNotice';
import { platformNames } from '../config/publishing';
import { RootState } from '../store/store';
import { useGetAnalyticsSnapshotQuery, useGetScheduleOverviewQuery, useGetSocialAccountsQuery } from '../store/apiSlice';
import { analyticsPlatforms, noAnalyticsAccounts, snapshotFreshnessSeconds } from '../utils/analyticsSnapshot';
import { overviewFreshnessSeconds } from '../utils/dashboardSchedule';

const dateAndTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function PublishingOverviewPage() {
  const userId = useSelector((state: RootState) => state.auth.user?.userId) || '';
  const posts = useGetScheduleOverviewQuery(userId, { skip: !userId, refetchOnMountOrArgChange: overviewFreshnessSeconds });
  const accounts = useGetSocialAccountsQuery({ userId }, { skip: !userId, refetchOnMountOrArgChange: overviewFreshnessSeconds });
  const connected = accounts.currentData?.accounts ?? noAnalyticsAccounts;
  const eligible = useMemo(() => connected.filter(a => analyticsPlatforms.includes(a.platform)), [connected]);
  const snapshot = useGetAnalyticsSnapshotQuery({ userId, accounts: eligible }, {
    skip: !userId || !eligible.length, refetchOnMountOrArgChange: snapshotFreshnessSeconds,
  });
  const schedule = posts.currentData;
  const now = Date.now();
  const upcoming = schedule?.upcoming.filter(post => Date.parse(post.scheduledTime) > now);
  const expired = (schedule?.upcoming.length ?? 0) - (upcoming?.length ?? 0);
  const snapshotFailed = snapshot.isError || (!!snapshot.currentData?.length &&
    snapshot.currentData.every(row => row.unavailable && row.followers === null && row.likes === null && row.comments === null));
  const errors = [
    ...(posts.isError ? [{ label: 'schedule', retry: posts.refetch }] : []),
    ...(accounts.isError ? [{ label: 'connected accounts', retry: accounts.refetch }] : []),
    ...(snapshotFailed ? [{ label: 'analytics', retry: snapshot.refetch }] : []),
  ];
  return <div className="gd gd-dashboard">
    <DashboardHeader rows={snapshot.currentData}
      loading={accounts.isLoading || (snapshot.isFetching && !snapshot.currentData)}
      syncing={snapshot.isFetching && !!snapshot.currentData}
      unavailable={accounts.isError || snapshotFailed} />
    {!!errors.length && <WorkspaceNotice onRetry={() => Promise.all(errors.map(error => error.retry()))}>
      Couldn’t refresh your {errors.map(error => error.label).join(', ')}.
    </WorkspaceNotice>}
    <DashboardStats
      scheduled={schedule ? Math.max(0, schedule.scheduledCount - expired) : null}
      failed={schedule?.attentionCount}
      latestAttentionId={schedule?.latestAttentionId}
      accounts={accounts.currentData?.accounts.length}
      postsLoading={posts.isLoading}
      accountsLoading={accounts.isLoading}
    />
    <section className="gd-upcoming">
      <div className="gd-inline-heading"><h2>Coming up</h2></div>
      {posts.isLoading ? <UpcomingPostsSkeleton /> : upcoming?.length ? upcoming.map(post => (
        <Link className="gd-upcoming-row" key={post.scheduleId} to={scheduleLink(post.scheduleId)}>
          <span>{post.title || 'Untitled post'}<small>{post.platforms.map(({ platform }) => platformNames[platform] || platform).join(' · ')}</small></span>
          <time dateTime={post.scheduledTime}>{dateAndTime.format(new Date(post.scheduledTime))}</time>
        </Link>
      )) : <p>{!schedule && posts.isError ? 'Your schedule could not be loaded.' : 'No upcoming posts scheduled.'}</p>}
      <div className="gd-card-actions"><Link className="gd-text-link" to="/settings/scheduled-content">View schedule ↗</Link></div>
    </section>
    <DashboardNextSteps />
  </div>;
}
