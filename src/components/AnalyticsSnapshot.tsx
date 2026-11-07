import React, { useMemo } from 'react';
import { Button, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import AnalyticsRefreshButton from './AnalyticsRefreshButton';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useGetAnalyticsSnapshotQuery } from '../store/apiSlice';
import { AnalyticsAccount, SnapshotRow, analyticsPlatforms, snapshotFreshnessSeconds, snapshotMetric } from '../utils/analyticsSnapshot';
import { platformNames } from '../config/publishing';
import { AnalyticsAvatar, AnalyticsPlatformIcon, analyticsAccountName } from './AnalyticsWorkspaceHeader';
import WorkspaceNotice from './WorkspaceNotice';

const number = (value: number | null) => value === null ? 'Unavailable' : value.toLocaleString();
const metrics = [
  { key: 'followers', label: 'Followers & subscribers', icon: <PeopleOutlineRoundedIcon/>, description: 'Current audience, summed across accounts.' },
  { key: 'views', label: 'Video views', icon: <VisibilityOutlinedIcon/>, description: 'Lifetime views on recorded YouTube and TikTok videos.' },
  { key: 'likes', label: 'Likes & reactions', icon: <FavoriteBorderRoundedIcon/>, description: 'Reported lifetime counts on available content.' },
  { key: 'comments', label: 'Comments', icon: <ChatBubbleOutlineRoundedIcon/>, description: 'Reported lifetime counts on available content.' },
] as const;

export default function AnalyticsSnapshot({ accounts, userId }: { accounts: AnalyticsAccount[]; userId: string }) {
  const eligible = useMemo(() => accounts.filter(a => analyticsPlatforms.includes(a.platform)), [accounts]);
  const query = useGetAnalyticsSnapshotQuery({ userId, accounts: eligible }, { skip: !eligible.length || !userId, refetchOnMountOrArgChange: snapshotFreshnessSeconds });
  const rows = query.currentData || eligible.map(a => ({ ...a, followers: null, views: null, likes: null, comments: null, posts: null, coverage: (['youtube','tiktok'].includes(a.platform) ? 'videos' : 'recent_posts') as 'videos' | 'recent_posts', unavailable: true, updatedAt: '' })), loading = query.isFetching && !query.currentData;
  return <AnalyticsSnapshotView accounts={eligible} rows={rows} loading={loading} refreshing={query.isFetching} onRefresh={() => query.refetch()} failed={query.isError}/>;
}

export function AnalyticsSnapshotView({ accounts: eligible, rows, loading = false, refreshing = false, onRefresh, failed = false }: { accounts: AnalyticsAccount[]; rows: SnapshotRow[]; loading?: boolean; refreshing?: boolean; onRefresh: () => void; failed?: boolean }) {
  return <div className="gd-analytics-overview-body">
    <section aria-labelledby="combined-snapshot-title" aria-busy={loading}>
      <div className="gd-analytics-section-heading"><div><p className="gd-eyebrow">Across your channels</p><h2 id="combined-snapshot-title">Combined snapshot</h2></div><AnalyticsRefreshButton label="Refresh snapshot" onClick={onRefresh} refreshing={refreshing} disabled={!eligible.length}/></div>
      <div className="gd-snapshot-kpis gd-analytics-skeleton">{metrics.map(m => {
        const total = snapshotMetric(rows, m.key);
        return <article className="gd-stat gd-snapshot-stat" key={m.key}><span className={`gd-analytics-kpi-icon is-${m.key}`} aria-hidden="true">{m.icon}</span><span>{m.label}</span>{loading ? <Skeleton width={120} height={40} variant="rounded"/> : <strong className={total.value === null ? 'is-unavailable' : ''}>{number(total.value)}</strong>}<p>{m.description}</p><small>{loading ? 'Loading accounts...' : `${total.reporting} of ${total.eligible} eligible accounts reporting`}</small></article>;
      })}</div>
      <details className="gd-snapshot-definitions"><summary>What these totals include</summary><p>Audience counts are current followers or subscribers, not unique people across networks. Video views include recorded YouTube and TikTok videos only. Likes and comments use all recorded YouTube and TikTok videos, plus up to 25 recent posts per Instagram, Facebook and X account. These are lifetime content counts, not activity during a shared date range. Missing measurements are excluded, never treated as zero. Meta period views and reach remain in each account dashboard.</p></details>
    </section>
    {failed && <WorkspaceNotice onRetry={onRefresh}>The combined snapshot could not be loaded. Your individual account dashboards are still available.</WorkspaceNotice>}
    <section className="gd-form-section gd-analytics-accounts-panel gd-analytics-skeleton" aria-labelledby="snapshot-accounts-title">
      <div className="gd-analytics-section-heading"><h2 id="snapshot-accounts-title">Your accounts</h2><span className="gd-quiet">Select an account to explore its analytics</span></div>
      <div className="gd-snapshot-account-list">{eligible.map(account => {
        const row = rows.find(r => r.accountId === account.accountId && r.platform === account.platform);
        return <article className="gd-snapshot-account" key={`${account.platform}:${account.accountId}`}>
          <div className="gd-snapshot-account-identity"><div className="gd-snapshot-avatar"><AnalyticsAvatar account={account}/><span className={`gd-analytics-platform-mark is-${account.platform}`} aria-hidden="true"><AnalyticsPlatformIcon platform={account.platform}/></span></div><div><h3>{analyticsAccountName(account)}</h3><p>{platformNames[account.platform]}<span aria-hidden="true"> · </span>{row?.coverage === 'videos' ? `${row.posts === null ? 'Available' : number(row.posts)} recorded videos` : 'Up to 25 recent posts'}</p>{row?.unavailable && <span className="gd-snapshot-unavailable">Some data unavailable</span>}</div></div>
          <dl>{[['Audience', row?.followers], ['Likes', row?.likes], ['Comments', row?.comments]].map(([label, value]) => <div key={String(label)}><dt>{label}</dt><dd>{loading ? <Skeleton width={45}/> : typeof value === 'number' ? number(value) : 'Unavailable'}</dd></div>)}</dl>
          <Button component={Link} variant="outlined" endIcon={<ArrowForwardRoundedIcon/>} to={`/analytics/${account.platform}?account=${encodeURIComponent(account.accountId)}`}>View analytics</Button>
        </article>;
      })}</div>
      {!eligible.length && <div className="gd-analytics-empty"><h3>Connect your first channel</h3><p>Connect an account to start seeing audience and content performance here.</p><Button component={Link} to="/settings/connected-accounts" variant="contained" className="gd-card-action">Connect account</Button></div>}
    </section>
  </div>;
}
