import React, { useEffect, useRef } from 'react';
import { Avatar, Button, MenuItem, Select } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import AnalyticsRefreshButton from './AnalyticsRefreshButton';
import { platformNames } from '../config/publishing';
import { AnalyticsAccount, analyticsPlatforms } from '../utils/analyticsSnapshot';

export function AnalyticsPlatformIcon({ platform }: { platform: string }) {
  if (platform === 'youtube') return <YouTubeIcon/>;
  if (platform === 'instagram') return <InstagramIcon/>;
  if (platform === 'facebook') return <FacebookIcon/>;
  if (platform === 'twitter') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l8.2-9.4L.8 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z"/></svg>;
  if (platform === 'tiktok') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.6 6.7A4.8 4.8 0 0 1 15.8 2h-3.4v13.7a2.9 2.9 0 1 1-2.1-3.2V9a6.3 6.3 0 1 0 5.5 6.3V8.8a8.3 8.3 0 0 0 4.8 1.5V6.8l-1-.1Z"/></svg>;
  return <BarChartRoundedIcon/>;
}
export const analyticsAccountName = (account?: AnalyticsAccount) => account?.accountName || account?.username || 'Connected account';
export function AnalyticsAvatar({ account }: { account?: AnalyticsAccount }) {
  const src = account?.avatarUrl?.startsWith('https://') ? account.avatarUrl : undefined;
  return <Avatar src={src} alt="" aria-hidden="true" className="gd-analytics-select-avatar">{analyticsAccountName(account).slice(0, 1).toUpperCase()}</Avatar>;
}
export function useAnalyticsAccount(accounts: AnalyticsAccount[], platform: string) {
  const [params, setParams] = useSearchParams();
  const available = accounts.filter(a => a.platform === platform), requested = params.get('account');
  const accountId = available.find(a => a.accountId === requested)?.accountId || available[0]?.accountId || '';
  const select = (value: string) => setParams(previous => { const next = new URLSearchParams(previous); next.set('account', value); return next; });
  return { accountId, select, available };
}

export default function AnalyticsWorkspaceHeader({ platform, accounts, accountId = '', onAccountChange, loading = false, children, onRefresh, refreshing = false, refreshDisabled = false, secondaryAction }: {
  platform?: string; accounts: AnalyticsAccount[]; accountId?: string; onAccountChange?: (id: string) => void; loading?: boolean; children?: React.ReactNode;
  onRefresh?: () => void; refreshing?: boolean; refreshDisabled?: boolean; secondaryAction?: React.ReactNode;
}) {
  const available = accounts.filter(a => a.platform === platform), selected = available.find(a => a.accountId === accountId);
  const connected = accounts.filter(a => analyticsPlatforms.includes(a.platform)).length;
  const channelNav = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = channelNav.current;
    if (!nav) return;
    const revealChannel = () => {
      const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
      if (active && nav.scrollWidth > nav.clientWidth) nav.scrollLeft += active.getBoundingClientRect().left - nav.getBoundingClientRect().left - (nav.clientWidth - active.offsetWidth) / 2;
    };
    revealChannel();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(revealChannel) : undefined;
    observer?.observe(nav);
    return () => observer?.disconnect();
  }, [platform]);
  return <>
    <nav className="gd-analytics-breadcrumb" aria-label="Breadcrumb"><Link to="/dashboard">Workspace</Link><span aria-hidden="true">/</span>{platform ? <><Link to="/analytics">Analytics</Link><span aria-hidden="true">/</span><span aria-current="page">{platformNames[platform]}</span></> : <span aria-current="page">Analytics</span>}</nav>
    <header className="gd-analytics-title"><span className={`gd-analytics-platform-mark is-${platform || 'all'}`} aria-hidden="true"><AnalyticsPlatformIcon platform={platform || 'all'}/></span><div><h1>{platform ? `${platformNames[platform]} analytics` : 'Analytics'}</h1><p>{platform ? 'Choose an account, explore its performance and see what is working.' : 'Your connected channels, together. Open any account for a closer look.'}</p></div></header>
    <section className="gd-analytics-workspace-controls" aria-label="Analytics workspace">
      <div className="gd-analytics-controls-heading"><span>Channels</span><span className="gd-analytics-connection-count"><LinkRoundedIcon aria-hidden="true"/>{loading ? 'Loading accounts' : `${connected} connected ${connected === 1 ? 'account' : 'accounts'}`}</span></div>
      <nav ref={channelNav} className="gd-analytics-platform-nav" aria-label="Analytics channels"><Link to="/analytics" aria-current={!platform ? 'page' : undefined}><BarChartRoundedIcon/>Overview</Link>{analyticsPlatforms.map(p => <Link key={p} to={`/analytics/${p}`} aria-current={platform === p ? 'page' : undefined}><AnalyticsPlatformIcon platform={p}/>{platformNames[p]}</Link>)}</nav>
      {platform && <div className="gd-analytics-toolbar">
        <div className="gd-analytics-account-field"><span id="analytics-account-label" className="gd-analytics-control-label">Connected account</span><Select labelId="analytics-account-label" id="analytics-account" value={accountId} displayEmpty disabled={loading || !available.length} onChange={e => onAccountChange?.(e.target.value)} renderValue={() => <span className="gd-analytics-account-option"><AnalyticsAvatar account={selected}/><span><strong>{selected ? analyticsAccountName(selected) : loading ? 'Loading accounts...' : 'No connected accounts'}</strong>{selected?.username && selected.username !== analyticsAccountName(selected) && <small>{selected.username}</small>}</span></span>} MenuProps={{PaperProps:{className:'gd-analytics-account-menu'}}}>
          {!available.length && <MenuItem value="">{loading ? 'Loading accounts...' : 'No connected accounts'}</MenuItem>}
          {available.map(a => <MenuItem key={a.accountId} value={a.accountId}><span className="gd-analytics-account-option"><AnalyticsAvatar account={a}/><span>{analyticsAccountName(a)}</span></span></MenuItem>)}
        </Select></div>
        {children}
        {onRefresh && <AnalyticsRefreshButton onClick={onRefresh} refreshing={refreshing} disabled={refreshDisabled || !accountId}/>}
      </div>}
      <div className="gd-analytics-controls-actions">
        <Button component={Link} to="/settings/connected-accounts" variant="contained" startIcon={<AddRoundedIcon/>} className="gd-analytics-connect gd-primary-action">Connect account</Button>
        {secondaryAction}
      </div>
    </section>
  </>;
}
