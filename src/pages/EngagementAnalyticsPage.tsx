import React, { useEffect, useMemo, useState } from 'react';
import { Button, MenuItem, Skeleton, TextField } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RootState } from '../store/store';
import { useGetSocialAccountsQuery } from '../store/apiSlice';
import { platformNames } from '../config/publishing';
import WorkspaceNotice from '../components/WorkspaceNotice';
import api from '../utils/axiosConfig';

type Metric = { value: number | null; availability: string };
type Summary = {
  accountId: string; followers: number | null; postCount: number; updatedAt: string; postsAvailable?: boolean;
  totals: Record<string, number | null>;
  posts: { id: string; title: string; createdAt?: string; url?: string; likes: number | null; comments: number | null; shares: number | null }[];
  warnings?: string[];
  insights?: { status: string; window: { since: string; until: string }; metrics: Record<string, Metric>;
    daily: { label: string; points: { date: string; value: number | null }[] }; limitations: string[] };
};
const shown = (n: number | null | undefined) => typeof n === 'number' ? n.toLocaleString() : 'Unavailable';
const dateLabel = (value: string) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
const safeUrl = (value?: string) => { try { return value && new URL(value).protocol === 'https:' ? value : undefined; } catch { return undefined; } };

export default function EngagementAnalyticsPage() {
  const { platform = 'instagram' } = useParams();
  const userId = useSelector((s: RootState) => s.auth.user?.userId) || '';
  const accounts = useGetSocialAccountsQuery({ userId }, { skip: !userId });
  const available = useMemo(() => (accounts.data?.accounts || []).filter(a => a.platform === platform), [accounts.data, platform]);
  const [selected, setSelected] = useState({ platform, accountId: '' });
  const accountId = selected.platform === platform && available.some(a => a.accountId === selected.accountId)
    ? selected.accountId : available.length === 1 ? available[0].accountId : '';
  const [days, setDays] = useState(28), [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState<{ key: string; data: Summary } | null>(null);
  const [loadingKey, setLoadingKey] = useState(''), [failure, setFailure] = useState<{ key: string; message: string; reconnect: boolean } | null>(null);
  const [connecting, setConnecting] = useState(false), [connectError, setConnectError] = useState('');
  const isMeta = platform === 'instagram' || platform === 'facebook';
  const key = `${userId}:${platform}:${accountId}:${days}:${refresh}`;
  const data = result?.key === key ? result.data : null;
  const error = failure?.key === key ? failure : null;
  const busy = !!accountId && (loadingKey === key || (!data && !error));
  useEffect(() => {
    if (!accountId || !userId) return;
    const controller = new AbortController();
    let active = true;
    setLoadingKey(key);
    api.get(`/api/gruvi/${platform}/analytics/summary`, { params: { accountId, days }, signal: controller.signal })
      .then(response => { if (active) { setResult({ key, data: response.data }); setFailure(null); } })
      .catch(e => { if (active) setFailure({ key, message: e.response?.data?.error || 'Analytics could not be loaded. Try again shortly.', reconnect: e.response?.data?.code === 'ANALYTICS_RECONNECT_REQUIRED' }); })
      .finally(() => { if (active) setLoadingKey(''); });
    return () => { active = false; controller.abort(); };
  }, [key, platform, accountId, days, userId]);
  useEffect(() => { setConnectError(''); }, [platform, accountId]);
  const enable = async () => {
    setConnecting(true); setConnectError('');
    try {
      const response = await api.get('/api/gruvi/instagram/analytics/auth-url', { params: { accountId } });
      const destination = new URL(response.data.authUrl);
      if (destination.protocol !== 'https:' || destination.hostname !== 'www.facebook.com') throw Error('Unexpected authorization destination.');
      window.location.assign(destination.toString());
    } catch (e: any) { setConnectError(e.response?.data?.error || 'Meta authorization could not be started. Try again shortly.'); setConnecting(false); }
  };
  const insightStatus = data?.insights?.status;
  const needsPermission = isMeta && (!!error?.reconnect || ['permission_required', 'reconnect_required'].includes(insightStatus || ''));
  const points = data?.insights?.daily.points || [];
  const hasPoints = points.some(p => typeof p.value === 'number');
  const account = available.find(a => a.accountId === accountId);
  return <div className="gd gd-meta-analytics">
    <header className="gd-workspace-header"><div>
      <p className="gd-eyebrow">Measure your content</p><h1>{platformNames[platform] || platform} analytics</h1>
      <p>{isMeta ? 'Account insights and recent post engagement, with the source and time range kept clear.' : 'Engagement from your recent posts.'}</p>
      <Link className="gd-text-link gd-related-link" to="/analytics">All analytics ↗</Link>
    </div></header>
    {accounts.isError && <WorkspaceNotice onRetry={() => accounts.refetch()}>Your connected accounts could not be loaded.</WorkspaceNotice>}
    <section className="gd-form-section gd-analytics-controls" aria-label="Analytics filters">
      <div className="gd-analytics-filters">
        <TextField select label="Connected account" value={accountId} onChange={e => setSelected({ platform, accountId: e.target.value })} disabled={accounts.isLoading || !available.length}>
          <MenuItem value="">{accounts.isLoading ? 'Loading accounts...' : 'Choose an account'}</MenuItem>
          {available.map(a => <MenuItem key={a.accountId} value={a.accountId}>{a.accountName || a.username || a.accountId}</MenuItem>)}
        </TextField>
        {isMeta && <TextField select label="Account insights" value={days} onChange={e => setDays(Number(e.target.value))}>
          <MenuItem value={7}>Last 7 complete days</MenuItem><MenuItem value={28}>Last 28 complete days</MenuItem>
        </TextField>}
        <Button variant="outlined" startIcon={<RefreshRoundedIcon />} disabled={!accountId || busy} onClick={() => setRefresh(n => n + 1)}>Refresh</Button>
      </div>
      {isMeta && accountId && !needsPermission && <Button variant="outlined" className="gd-card-action" onClick={enable} disabled={connecting}>{connecting ? 'Opening Meta...' : 'Manage insights access'}</Button>}
      {!accounts.isLoading && !accounts.isError && !available.length
        ? <p>No {platformNames[platform]} account is connected. <Link className="gd-text-link" to="/settings/connected-accounts">Connect an account ↗</Link></p>
        : <p className="gd-quiet">{isMeta ? 'Account insights exclude today. Recent-post counts are lifetime counts on up to 25 posts. ' : ''}Results can be cached for up to five minutes.</p>}
    </section>
    {error && <WorkspaceNotice onRetry={() => setRefresh(n => n + 1)}>{error.message}</WorkspaceNotice>}
    {connectError && <WorkspaceNotice severity="warning">{connectError}</WorkspaceNotice>}
    {needsPermission && <section className="gd-form-section gd-analytics-permission">
      <InsightsRoundedIcon aria-hidden="true"/><div><h2>{error?.reconnect || insightStatus === 'reconnect_required' ? 'Reconnect to Meta' : 'Enable account insights'}</h2>
      <p>Meta needs permission to read insights for this account. Use a Facebook profile with access to the linked Page and meet any business two-factor authentication requirement. Instagram needs a professional account.</p>
      <p className="gd-quiet">Meta will ask you to approve read access. App permission approval and business asset selection determine what is available.</p>
      <Button variant="contained" className="gd-card-action" onClick={enable} disabled={connecting}>{connecting ? 'Opening Meta...' : 'Continue with Meta'}</Button></div>
    </section>}
    {busy && <div className="gd-analytics-loading" role="status" aria-label="Loading analytics" aria-busy="true">
      <div className="gd-analytics-kpis">{[0,1,2].map(i => <div className="gd-stat" key={i}><Skeleton width="45%"/><Skeleton width="65%" height={54}/><Skeleton width="75%"/></div>)}</div>
      <div className="gd-form-section"><Skeleton width="35%" height={28}/><Skeleton variant="rounded" width="100%" height={180}/></div>
    </div>}
    {data && <>
      <div className="gd-analytics-account"><span>{account?.accountName || account?.username || 'Connected account'}</span><span>{shown(data.followers)} followers · Current snapshot</span><span>Updated {new Date(data.updatedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span></div>
      {data.warnings?.map(w => <WorkspaceNotice severity="warning" key={w}>{w}</WorkspaceNotice>)}
      {data.insights && <>
        <div className="gd-analytics-section-heading"><h2>Account insights</h2><p>{dateLabel(data.insights.window.since)} to {dateLabel(new Date(Date.parse(data.insights.window.until) - 1).toISOString())} · UTC</p></div>
        <div className="gd-analytics-kpis">{[['views', 'Content views'], ['reach', platform === 'facebook' ? 'Unique viewers' : 'Accounts reached'], ['interactions', 'Interactions']].map(([id, label]) => <article className="gd-stat" key={id}>
          <span>{label}</span><strong className={data.insights!.metrics[id]?.value == null ? 'is-unavailable' : ''}>{shown(data.insights!.metrics[id]?.value)}</strong>
          <span>{id === 'reach' && platform === 'facebook' ? 'Daily unique audiences are not added together.' : 'For the selected account insights period.'}</span>
        </article>)}</div>
        <section className="gd-form-section gd-analytics-chart"><h2>{data.insights.daily.label}</h2>
          {hasPoints ? <><p className="gd-quiet">Daily values returned by Meta. Missing periods stay missing.</p><div className="gd-chart-canvas" role="img" aria-label={data.insights.daily.label + '. Daily values are listed below.'}>
            <ResponsiveContainer width="100%" height={240}><LineChart data={points} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid stroke="#ffffff12" vertical={false}/><XAxis dataKey="date" tickFormatter={dateLabel} tick={{ fill: '#aab4c2', fontSize: 11 }} minTickGap={28}/><YAxis tick={{ fill: '#aab4c2', fontSize: 11 }} width={45} allowDecimals={false}/>
              <Tooltip labelFormatter={v => dateLabel(String(v))} contentStyle={{ background: '#171e28', border: '1px solid #ffffff28', borderRadius: 8, color: '#f4f7fb' }}/><Line type="linear" dataKey="value" name={platform === 'instagram' ? 'Accounts reached' : 'Content views'} stroke="#80baff" strokeWidth={2} dot={points.length <= 7} connectNulls={false}/>
            </LineChart></ResponsiveContainer></div>
            <details className="gd-analytics-details"><summary>View daily values</summary><table><thead><tr><th>Bucket ending (UTC)</th><th>{platform === 'instagram' ? 'Accounts reached' : 'Content views'}</th></tr></thead><tbody>{points.map(p => <tr key={p.date}><td>{dateLabel(p.date)}</td><td>{shown(p.value)}</td></tr>)}</tbody></table></details></>
          : <div className="gd-analytics-no-data"><InsightsRoundedIcon aria-hidden="true"/><p>{insightStatus === 'rate_limited' ? 'Meta is limiting requests. Try again in a few minutes.' : needsPermission ? 'Your recent posts remain available below while account insights need authorization.' : 'Meta has not returned daily insights for this period. This can happen with new accounts, privacy thresholds or unavailable metrics.'}</p></div>}
          <p className="gd-quiet">Meta may take 24 to 48 hours to update insights. Unavailable means no usable measurement was returned.</p>
        </section>
      </>}
      <section className="gd-form-section gd-analytics-recent"><div><h2>Recent posts</h2><p className="gd-quiet">Up to 25 recent posts. These lifetime counts are separate from the date range above. Totals include only counts Meta made available.</p></div>
        <div className="gd-recent-totals"><span>{data.postsAvailable === false ? 'Unavailable' : data.postCount} posts returned</span><span>{shown(data.totals.likes)} likes & reactions</span><span>{shown(data.totals.comments)} comments</span><span>{shown(data.totals.shares)} shares</span></div>
        {data.posts.map(post => <article className="gd-analytics-post" key={post.id}><div><p className="gd-quiet">{post.createdAt ? dateLabel(post.createdAt) : 'Date unavailable'}</p><h3>{post.title || 'Post ' + post.id}</h3><p>Likes: {shown(post.likes)} · Comments: {shown(post.comments)} · Shares: {shown(post.shares)}</p></div>
          {safeUrl(post.url) && <a className="gd-text-link" href={safeUrl(post.url)} target="_blank" rel="noopener noreferrer">Open post ↗</a>}
        </article>)}
        {!data.posts.length && <p>{data.postsAvailable === false ? 'Recent posts could not be retrieved. Check the connection and try again.' : 'No recent posts were returned by this platform.'}</p>}
      </section>
    </>}
  </div>;
}
