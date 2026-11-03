import React, { useEffect, useState } from 'react';
import { Alert, Button, MenuItem, TextField } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useGetSocialAccountsQuery } from '../store/apiSlice';
import { platformNames } from '../config/publishing';
import WorkspaceSkeleton from '../components/WorkspaceSkeleton';
import api from '../utils/axiosConfig';
export default function EngagementAnalyticsPage(){
 const {platform='instagram'}=useParams();const userId=useSelector((s:RootState)=>s.auth.user?.userId)||'';
 const accounts=useGetSocialAccountsQuery({userId},{skip:!userId});const available=(accounts.data?.accounts||[]).filter(a=>a.platform===platform);
 const [accountId,setAccountId]=useState(''),[data,setData]=useState<any>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{setAccountId('');setData(null);setError('');},[platform]);
 const load=async()=>{setBusy(true);setError('');try{const response=await api.get(`/api/gruvi/${platform}/analytics/summary`,{params:{accountId}});setData(response.data);}catch(e:any){setData(null);setError(e.response?.data?.error||'Analytics could not be loaded.');}finally{setBusy(false);}};
 const shown=(value:any)=>typeof value==='number'?value.toLocaleString():'Unavailable';
 return <div className="gd"><header className="gd-workspace-header"><div><p className="gd-eyebrow">Engagement analytics · Beta</p><h1>{platformNames[platform]||platform} performance</h1><p>See recent post engagement for one connected account.</p><Link className="gd-text-link gd-related-link" to="/analytics">All analytics ↗</Link></div></header><section className="gd-form-section"><h2>Choose an account</h2><TextField select label="Connected account" value={accountId} onChange={e=>{setAccountId(e.target.value);setData(null);}} disabled={busy}><MenuItem value="">Select an account</MenuItem>{available.map(a=><MenuItem key={a.accountId} value={a.accountId}>{a.accountName||a.username||a.accountId}</MenuItem>)}</TextField><p className="gd-quiet">Results are cached for five minutes. Platform permissions and API access determine which metrics are available.</p><Button variant="contained" className="gd-card-action" disabled={busy||!accountId} onClick={load}>{busy?'Loading...':'View analytics'}</Button>{!available.length&&!accounts.isLoading&&<Link to="/settings/connected-accounts">Connect an account ↗</Link>}</section>
 {error&&<Alert severity="warning">{error} <Link to="/settings/connected-accounts">Manage connection</Link></Alert>}{busy&&<WorkspaceSkeleton label="Loading analytics" rows={3}/>}{data&&<><div className="gd-stats gd-engagement-stats">{[['Followers',data.followers],['Recent posts',data.postCount],['Likes & reactions',data.totals?.likes],['Comments',data.totals?.comments],['Shares & reposts',data.totals?.shares],['Impressions',data.totals?.impressions]].map(([label,value])=><article className="gd-stat" key={label}><span>{label}</span><strong>{shown(value)}</strong></article>)}</div><section className="gd-form-section"><h2>Recent posts</h2><p className="gd-quiet">Totals cover up to 25 recent posts. Missing metrics are unavailable, not zero.</p>{data.posts.map((post:any)=><article className="gd-analytics-post" key={post.id}><strong>{post.title||'Post '+post.id}</strong><p>Likes: {shown(post.likes)} · Comments: {shown(post.comments)} · Shares: {shown(post.shares)}</p>{post.url&&<a className="gd-text-link" href={post.url} target="_blank" rel="noopener noreferrer">Open post ↗</a>}</article>)}{!data.posts.length&&<p>No recent posts were returned by this platform.</p>}</section></>}</div>;
}
