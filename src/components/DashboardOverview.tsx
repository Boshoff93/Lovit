import React from 'react';
import { Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';

import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import { SnapshotRow, snapshotMetric } from '../utils/analyticsSnapshot';
import './DashboardOverview.css';

const performanceMetrics = [
  { key: 'followers', label: 'Followers & subscribers', icon: GroupOutlinedIcon },
  { key: 'likes', label: 'Likes & reactions', icon: FavoriteBorderRoundedIcon },
  { key: 'comments', label: 'Comments', icon: ChatBubbleOutlineRoundedIcon },
] as const;
const formatCount = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });

export function DashboardHeader({ rows = [], loading = false, syncing = false, unavailable = false }: {
  rows?: SnapshotRow[];
  loading?: boolean;
  syncing?: boolean;
  unavailable?: boolean;
}) {
  return <header className="gd-workspace-header gd-dashboard-performance">
    <div className="gd-dashboard-performance-heading">
      <div>
        <p className="gd-eyebrow"><BarChartRoundedIcon aria-hidden="true" /> Across channels</p>
        <h1>Audience & engagement</h1>
        <p>Audience counts and lifetime engagement on available posts.</p>
      </div>
      <span className="gd-dashboard-sync" role="status">{syncing && <><SyncRoundedIcon aria-hidden="true" /> Syncing</>}</span>
    </div>
    <dl className="gd-dashboard-metrics" aria-busy={loading}>
      {performanceMetrics.map(({ key, label, icon: Icon }) => {
        const { value, reporting, eligible } = snapshotMetric(rows, key);
        return <div className="gd-dashboard-metric" key={key}>
          <dt><Icon aria-hidden="true" />{label}</dt>
          <dd>{loading ? <Skeleton variant="rounded" width={78} height={30} /> :
            <span title={value?.toLocaleString()} aria-label={value?.toLocaleString() || 'Unavailable'}>{value === null ? '—' : formatCount.format(value)}</span>}</dd>
          <small>{loading ? <Skeleton variant="rounded" width={90} height={12} /> :
            eligible ? `${reporting} of ${eligible} reporting` : unavailable ? 'Unavailable' : 'No reporting accounts'}</small>
        </div>;
      })}
    </dl>
    <div className="gd-card-actions">
      <Link className="gd-button gd-primary-action gd-card-action" to="/posts/new">
        New post <span aria-hidden="true">+</span>
      </Link>
      <Link className="gd-text-link" to="/analytics">View analytics ↗</Link>
    </div>
  </header>;
}

export const scheduleLink = (id: string) => `/settings/scheduled-content?highlight=${encodeURIComponent(id)}`;

export function DashboardStats({ scheduled, failed, accounts, postsLoading = false, accountsLoading = false, latestAttentionId }: {
  latestAttentionId?: string;
  scheduled?: number | null;
  failed?: number | null;
  accounts?: number | null;
  postsLoading?: boolean;
  accountsLoading?: boolean;
}) {
  const stats = [
    { label: 'Scheduled', value: scheduled, loading: postsLoading, to: '/settings/scheduled-content' },
    { label: 'Needs attention', value: failed, loading: postsLoading, to: latestAttentionId ? scheduleLink(latestAttentionId) : '/settings/scheduled-content', hint: 'Past 7 days' },
    { label: 'Connected accounts', value: accounts, loading: accountsLoading, to: '/settings/connected-accounts' },
  ];
  return <div className="gd-stat-grid gd-dashboard-stats" aria-label="Workspace counts" aria-busy={postsLoading || accountsLoading}>
    {stats.map(stat => <Link to={stat.to} className="gd-stat" key={stat.label}>
      <span>{stat.label}{stat.hint && <small className="gd-dashboard-stat-hint">{stat.hint}</small>}</span>
      {stat.loading ? <strong className="gd-dashboard-stat-loading">
        <Skeleton component="span" variant="rounded" width="1.15em" height="0.85em" aria-hidden="true" />
        <span className="gd-sr-only">Loading</span>
      </strong> : <strong>{stat.value ?? '—'}</strong>}
      <span>Open <span aria-hidden="true">↗</span></span>
    </Link>)}
  </div>;
}

export function DashboardNextSteps() {
  return <section className="gd-dashboard-next">
    <div>
      <p className="gd-eyebrow">The next step</p>
      <h2>Content in. Posts out.</h2>
      <p>Upload a finished video and thumbnail, choose your connected accounts, then publish or schedule it.</p>
      <Link className="gd-text-link" to="/posts/new">Prepare a post →</Link>
    </div>
    <div>
      <p className="gd-eyebrow">Work through your agent</p>
      <h2>Connect once. Keep moving.</h2>
      <p>Create an agent key, install the MCP server and put Gruvi inside your existing workflow.</p>
      <Link className="gd-text-link" to="/agents">Set up agent access →</Link>
    </div>
  </section>;
}

/** Plain rows match the upcoming schedule instead of nesting placeholder cards. */
export function UpcomingPostsSkeleton() {
  return <div className="gd-dashboard-upcoming-loading" role="status" aria-label="Loading upcoming posts" aria-busy="true">
    {[0, 1].map(index => <div className="gd-upcoming-row" aria-hidden="true" key={index}>
      <span><Skeleton variant="rounded" width={index === 0 ? '78%' : '62%'} height={16} /><small><Skeleton variant="rounded" width="42%" height={10} /></small></span>
      <Skeleton className="gd-upcoming-time-loading" variant="rounded" width={140} height={13} />
    </div>)}
    <span className="gd-sr-only">Loading upcoming posts.</span>
  </div>;
}

export default function DashboardSkeleton() {
  return <div className="gd gd-dashboard gd-dashboard-loading" aria-busy="true">
    <span className="gd-sr-only" role="status" aria-label="Loading dashboard" aria-busy="true">Loading dashboard.</span>
    <DashboardHeader loading />
    <DashboardStats postsLoading accountsLoading />
    <section className="gd-upcoming">
      <div className="gd-inline-heading"><h2>Coming up</h2></div>
      <UpcomingPostsSkeleton />
      <div className="gd-card-actions"><Link className="gd-text-link" to="/settings/scheduled-content">View schedule ↗</Link></div>
    </section>
    <DashboardNextSteps />
  </div>;
}
