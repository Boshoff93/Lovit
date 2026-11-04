import React from 'react';
import { Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';

/** Static dashboard content stays in place during account and data loading. */
export function DashboardHeader() {
  return <header className="gd-workspace-header">
    <div>
      <p className="gd-eyebrow">Your distribution workspace</p>
      <h1>Ready for your next post.</h1>
      <p>See what's scheduled, check delivery and keep your accounts connected.</p>
      <div className="gd-card-actions">
        <Link className="gd-button gd-primary-action gd-card-action" to="/posts/new">
          New post <span aria-hidden="true">+</span>
        </Link>
      </div>
    </div>
  </header>;
}

export function DashboardStats({ scheduled, failed, accounts, postsLoading = false, accountsLoading = false }: {
  scheduled?: number | null;
  failed?: number | null;
  accounts?: number | null;
  postsLoading?: boolean;
  accountsLoading?: boolean;
}) {
  const stats = [
    { label: 'Scheduled', value: scheduled, loading: postsLoading, to: '/settings/scheduled-content' },
    { label: 'Need attention', value: failed, loading: postsLoading, to: '/settings/scheduled-content' },
    { label: 'Connected accounts', value: accounts, loading: accountsLoading, to: '/settings/connected-accounts' },
  ];
  return <div className="gd-stat-grid gd-dashboard-stats" aria-label="Workspace counts" aria-busy={postsLoading || accountsLoading}>
    {stats.map(stat => <Link to={stat.to} className="gd-stat" key={stat.label}>
      <span>{stat.label}</span>
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
  return <div className="gd gd-dashboard-loading" role="status" aria-label="Loading dashboard" aria-busy="true">
    <DashboardHeader />
    <DashboardStats postsLoading accountsLoading />
    <DashboardNextSteps />
    <section className="gd-upcoming">
      <div className="gd-inline-heading"><h2>Coming up</h2></div>
      <UpcomingPostsSkeleton />
      <div className="gd-card-actions"><Link className="gd-text-link" to="/settings/scheduled-content">View schedule ↗</Link></div>
    </section>
  </div>;
}
