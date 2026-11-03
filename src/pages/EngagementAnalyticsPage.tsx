import React, { useEffect, useState } from 'react';
import { Avatar, Button, MenuItem, TextField } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RootState } from '../store/store';
import { useGetSocialAccountsQuery } from '../store/apiSlice';
import { platformNames } from '../config/publishing';
import WorkspaceNotice from '../components/WorkspaceNotice';
import AnalyticsPosts from '../components/AnalyticsPosts';
import { AnalyticsInsightsSkeleton } from '../components/AnalyticsSkeleton';
import api from '../utils/axiosConfig';
import AnalyticsWorkspaceHeader, { useAnalyticsAccount } from '../components/AnalyticsWorkspaceHeader';
import AnalyticsEngagementPanels from '../components/AnalyticsEngagementPanels';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

type Metric = { value: number | null; availability: string; coverageDays?: number; series?: { date: string; value: number | null }[] };
type Summary = {
  accountId: string; followers: number | null; postCount: number; updatedAt: string; postsAvailable?: boolean;
  totals: Record<string, number | null>;
  posts: { id: string; title: string; thumbnailUrl?: string | null; createdAt?: string; url?: string; likes: number | null; comments: number | null; shares: number | null }[];
  warnings?: string[];
  insights?: { status: string; window: { since: string; until: string }; metrics: Record<string, Metric>;
    daily: { label: string; points: { date: string; value: number | null }[] }; limitations: string[] };
};
const shown = (n: number | null | undefined) => typeof n === 'number' ? n.toLocaleString() : 'Unavailable';
const dateLabel = (value: string) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
const safeUrl = (value?: string) => { try { return value && new URL(value).protocol === 'https:' ? value : undefined; } catch { return undefined; } };
type Account = { accountId: string; accountName?: string; username?: string; avatarUrl?: string };
const accountLabel = (account?: Account) => account?.accountName || account?.username || 'Connected account';
const accountAvatar = (account?: Account, large = false) => <Avatar src={safeUrl(account?.avatarUrl)} alt="" aria-hidden="true" className={large ? 'gd-analytics-profile-avatar' : 'gd-analytics-select-avatar'}>{accountLabel(account).slice(0, 1).toUpperCase()}</Avatar>;

export default function EngagementAnalyticsPage() {
  const { platform = 'instagram' } = useParams();
  const userId = useSelector((s: RootState) => s.auth.user?.userId) || '';
  const accounts = useGetSocialAccountsQuery({ userId }, { skip: !userId });
  const { accountId, select, available } = useAnalyticsAccount(accounts.data?.accounts || [], platform);
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
  const [chartMetric, setChartMetric] = useState('views');
  const chartLabel = platform === 'facebook' ? ({views: 'Content views each day', reach: 'Unique viewers each day', interactions: 'Interactions each day'} as Record<string,string>)[chartMetric] : data?.insights?.daily.label || '';
  const points = platform === 'facebook' ? data?.insights?.metrics[chartMetric]?.series || [] : data?.insights?.daily.points || [];
  const hasPoints = points.some(p => typeof p.value === 'number');
  const account = available.find(a => a.accountId === accountId);
  return <div className="gd gd-meta-analytics">
    <AnalyticsWorkspaceHeader platform={platform} accounts={accounts.data?.accounts || []} accountId={accountId} onAccountChange={select} loading={accounts.isLoading}>
      {isMeta && <TextField select label="Account insights" value={days} onChange={e => setDays(Number(e.target.value))}><MenuItem value={7}>Last 7 complete days</MenuItem><MenuItem value={28}>Last 28 complete days</MenuItem></TextField>}
      <Button variant="outlined" startIcon={<RefreshRoundedIcon/>} disabled={!accountId || busy} onClick={() => setRefresh(n => n + 1)}>Refresh</Button>
    </AnalyticsWorkspaceHeader>
    {accounts.isError && <WorkspaceNotice onRetry={() => accounts.refetch()}>Your connected accounts could not be loaded.</WorkspaceNotice>}
    <div className="gd-analytics-context-note"><p>{isMeta ? 'Account insights exclude today. Recent-post counts are lifetime counts. ' : ''}Results can be cached for up to five minutes.</p>{isMeta && accountId && !needsPermission && <Button variant="outlined" onClick={enable} disabled={connecting}>{connecting ? 'Opening Meta...' : 'Manage insights access'}</Button>}</div>
    {!accounts.isLoading && !accounts.isError && !available.length && <section className="gd-form-section gd-analytics-empty"><h2>Connect {platformNames[platform]}</h2><p>Connect an account to see your audience and content performance here.</p><Button component={Link} to="/settings/connected-accounts" variant="contained" className="gd-card-action">Connect an account</Button></section>}
    {error && <WorkspaceNotice onRetry={() => setRefresh(n => n + 1)}>{error.message}</WorkspaceNotice>}
    {connectError && <WorkspaceNotice severity="warning">{connectError}</WorkspaceNotice>}
    {needsPermission && <section className="gd-form-section gd-analytics-permission">
      <InsightsRoundedIcon aria-hidden="true"/><div><h2>{error?.reconnect || insightStatus === 'reconnect_required' ? 'Reconnect to Meta' : 'Enable account insights'}</h2>
      <p>Meta needs permission to read insights for this account. Use a Facebook profile with access to the linked Page and meet any business two-factor authentication requirement. Instagram needs a professional account.</p>
      <p className="gd-quiet">Meta will ask you to approve read access. App permission approval and business asset selection determine what is available.</p>
      <Button variant="contained" className="gd-card-action" onClick={enable} disabled={connecting}>{connecting ? 'Opening Meta...' : 'Continue with Meta'}</Button></div>
    </section>}
    {!data && (accounts.isLoading || busy) && <AnalyticsInsightsSkeleton platform={platform} chartLabel={chartLabel}/>}
    {data && <>
      <section className="gd-analytics-account" aria-label="Selected account snapshot">
        <div className="gd-analytics-identity">{accountAvatar(account, true)}<div><strong>{accountLabel(account)}</strong><span>{platformNames[platform] || platform}{account?.username && account.username !== accountLabel(account) ? ' · ' + account.username : ''}</span></div></div>
        <div className="gd-analytics-snapshot-badges"><span><PeopleOutlineRoundedIcon aria-hidden="true"/>{data.followers == null ? 'Followers unavailable' : shown(data.followers) + ' followers'}</span><span><CameraAltOutlinedIcon aria-hidden="true"/>Current snapshot</span><span><ScheduleRoundedIcon aria-hidden="true"/><time dateTime={data.updatedAt} title={new Date(data.updatedAt).toLocaleString()}>Updated {new Date(data.updatedAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</time></span></div>
      </section>
      {data.warnings?.map(w => <WorkspaceNotice severity="warning" key={w}>{w}</WorkspaceNotice>)}
      {data.insights && <>
        <div className="gd-analytics-section-heading"><h2>Account insights</h2><p>{dateLabel(data.insights.window.since)} to {dateLabel(new Date(Date.parse(data.insights.window.until) - 1).toISOString())} · UTC</p></div>
        <div className="gd-analytics-kpis">{[['views', 'Content views'], ['reach', platform === 'facebook' ? 'Unique viewers' : 'Accounts reached'], ['interactions', 'Interactions']].map(([id, label]) => <article className="gd-stat" key={id}>
          <span className="gd-analytics-kpi-heading"><i className={`gd-analytics-kpi-icon is-${id}`} aria-hidden="true">{id === 'views' ? <VisibilityOutlinedIcon/> : id === 'reach' ? <PeopleOutlineRoundedIcon/> : <InsightsRoundedIcon/>}</i>{label}</span><strong className={data.insights!.metrics[id]?.value == null ? 'is-unavailable' : ''}>{id === 'reach' && platform === 'facebook' && data.insights!.metrics[id]?.availability === 'daily_only' ? 'Daily only' : shown(data.insights!.metrics[id]?.value)}</strong>
          <span>{id === 'reach' && platform === 'facebook' ? 'Choose unique viewers in the daily chart below.' : data.insights!.metrics[id]?.availability === 'partial' ? `${data.insights!.metrics[id].coverageDays} of ${days} reporting days available.` : 'For the selected account insights period.'}</span>
        </article>)}</div>
        <section className="gd-form-section gd-analytics-chart"><h2>{chartLabel}</h2>{platform === 'facebook' && <TextField select label="Daily metric" value={chartMetric} onChange={e => setChartMetric(e.target.value)} sx={{ maxWidth: 280 }}><MenuItem value="views">Content views</MenuItem><MenuItem value="reach">Unique viewers</MenuItem><MenuItem value="interactions">Interactions</MenuItem></TextField>}
          {hasPoints ? <><p className="gd-quiet">Daily values returned by Meta. Dates show bucket end times in UTC. Missing periods stay missing.</p><div className="gd-chart-canvas" role="img" aria-label={chartLabel + '. Daily values are listed below.'}>
            <ResponsiveContainer width="100%" height={240}><LineChart data={points} margin={{ top: 12, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid stroke="#ffffff12" vertical={false}/><XAxis dataKey="date" tickFormatter={dateLabel} tick={{ fill: '#aab4c2', fontSize: 11 }} minTickGap={28}/><YAxis tick={{ fill: '#aab4c2', fontSize: 11 }} width={45} allowDecimals={false}/>
              <Tooltip labelFormatter={v => dateLabel(String(v))} contentStyle={{ background: '#171e28', border: '1px solid #ffffff28', borderRadius: 8, color: '#f4f7fb' }}/><Line type="linear" dataKey="value" name={platform === 'instagram' ? 'Accounts reached' : ({views:'Content views', reach:'Unique viewers', interactions:'Interactions'} as Record<string,string>)[chartMetric]} stroke="#80baff" strokeWidth={2} dot={points.length <= 7} connectNulls={false}/>
            </LineChart></ResponsiveContainer></div>
            <details className="gd-analytics-details"><summary>View daily values</summary><table><thead><tr><th>Bucket ending (UTC)</th><th>{platform === 'instagram' ? 'Accounts reached' : ({views:'Content views', reach:'Unique viewers', interactions:'Interactions'} as Record<string,string>)[chartMetric]}</th></tr></thead><tbody>{points.map(p => <tr key={p.date}><td>{dateLabel(p.date)}</td><td>{shown(p.value)}</td></tr>)}</tbody></table></details></>
          : <div className="gd-analytics-no-data"><InsightsRoundedIcon aria-hidden="true"/><p>{insightStatus === 'rate_limited' ? 'Meta is limiting requests. Try again in a few minutes.' : needsPermission ? 'Your recent posts remain available below while account insights need authorization.' : 'Meta has not returned daily insights for this period. This can happen with new accounts, privacy thresholds or unavailable metrics.'}</p></div>}
          <p className="gd-quiet">Meta may take 24 to 48 hours to update insights. Unavailable means no usable measurement was returned.</p>
        </section>
      </>}
      {isMeta && <AnalyticsEngagementPanels posts={data.posts} totals={data.totals} available={data.postsAvailable !== false}/>}
    </>}
    {accountId && !error && <AnalyticsPosts key={`${userId}:${platform}:${accountId}:${refresh}`} platform={platform} accountId={accountId}/>}
  </div>;
}
