import React from 'react';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { analyticsCount } from '../utils/analyticsSnapshot';

type Post = { id: string; title: string; thumbnailUrl?: string | null; url?: string; likes: number | null; comments: number | null; shares: number | null };
const safeUrl = (url?: string | null) => { try { return url && new URL(url).protocol === 'https:' ? url : undefined; } catch { return undefined; } };
const score = (post: Post) => [post.likes, post.comments, post.shares].filter((n): n is number => analyticsCount(n) !== null).reduce((a, b) => a + b, 0);
export default function AnalyticsEngagementPanels({ posts, totals, available }: { posts: Post[]; totals: Record<string, number | null>; available: boolean }) {
  const categories = [{key: 'likes', label: 'Likes & reactions', icon: <FavoriteBorderRoundedIcon/>}, {key: 'comments', label: 'Comments', icon: <ChatBubbleOutlineRoundedIcon/>}, {key: 'shares', label: 'Shares', icon: <IosShareRoundedIcon/>}];
  const max = Math.max(1, ...categories.map(c => analyticsCount(totals[c.key]) || 0));
  const top = posts.filter(p => [p.likes,p.comments,p.shares].some(n => analyticsCount(n) !== null)).sort((a, b) => score(b) - score(a)).slice(0, 3);
  return <div className="gd-analytics-detail-grid">
    <section className="gd-form-section gd-engagement-panel"><h2>Post engagement</h2><p className="gd-quiet">Lifetime counts on {posts.length} recent posts, separate from the insights period.</p>
      <div className="gd-engagement-bars">{categories.map(c => { const value = available ? analyticsCount(totals[c.key]) : null; return <div key={c.key}><div><span>{c.icon}{c.label}</span><strong>{value === null ? 'Unavailable' : value.toLocaleString()}</strong></div><div className="gd-engagement-track" aria-hidden="true"><span style={{ width: `${value === null ? 0 : value / max * 100}%` }}/></div></div>; })}</div>
    </section>
    <section className="gd-form-section gd-engagement-panel"><h2>Top recent posts</h2><p className="gd-quiet">Ranked by available likes, comments and shares on these {posts.length} posts.</p>
      <div className="gd-analytics-top-posts">{available && top.map(post => { const url = safeUrl(post.url); return <div className="gd-analytics-top-post" key={post.id}><div className="gd-analytics-top-art">{safeUrl(post.thumbnailUrl) ? <img src={safeUrl(post.thumbnailUrl)} alt="" loading="lazy" onError={e => {e.currentTarget.style.display = 'none';}}/> : <ImageOutlinedIcon aria-hidden="true"/>}</div><div>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{post.title || 'Untitled post'} ↗</a> : <strong>{post.title || 'Untitled post'}</strong>}<span>{score(post).toLocaleString()} known interactions</span></div></div>; })}</div>
      {(!available || !top.length) && <p className="gd-quiet">{available ? 'No post engagement is available to rank yet.' : 'Recent post engagement is unavailable. Check the account connection or try again shortly.'}</p>}
    </section>
  </div>;
}
