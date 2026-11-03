import React, { useEffect, useRef, useState } from 'react';
import { Button, Skeleton } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import api from '../utils/axiosConfig';
import WorkspaceNotice from './WorkspaceNotice';

type Post = { id: string; title: string; caption?: string; thumbnailUrl?: string | null; createdAt?: string; url?: string; likes: number | null; comments: number | null; shares: number | null };
type Page = { posts: Post[]; totals: Record<string, number | null>; paging: { nextCursor: string | null; hasMore: boolean } };
const shown = (n: number | null | undefined) => typeof n === 'number' ? n.toLocaleString() : 'Unavailable';
const safeUrl = (value?: string) => { try { return value && new URL(value).protocol === 'https:' ? value : undefined; } catch { return undefined; } };

function PostArtwork({ url }: { url?: string | null }) {
  const [failedUrl, setFailedUrl] = useState('');
  const src = safeUrl(url || undefined), available = !!src && failedUrl !== src;
  return <div className="gd-post-artwork" role={available ? undefined : 'img'} aria-label={available ? undefined : 'Thumbnail unavailable'}>
    {available ? <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailedUrl(src!)}/> : <><ImageOutlinedIcon aria-hidden="true"/><span>No preview</span></>}
  </div>;
}

function PostRow({ post }: { post: Post }) {
  const lines = (post.caption || post.title || '').trim().split(/\n+/).filter(Boolean);
  const title = lines[0] || 'Untitled post', excerpt = lines.slice(1).join(' ');
  const url = safeUrl(post.url);
  return <article className="gd-analytics-post">
    <PostArtwork url={post.thumbnailUrl}/>
    <div className="gd-post-content">
      <p className="gd-quiet">{post.createdAt ? <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</time> : 'Date unavailable'}</p>
      <h3>{title}</h3>{excerpt && <p className="gd-post-excerpt">{excerpt}</p>}
      <div className="gd-post-metrics" aria-label="Post engagement"><span><FavoriteBorderRoundedIcon aria-hidden="true"/>{shown(post.likes)} likes</span><span><ChatBubbleOutlineRoundedIcon aria-hidden="true"/>{shown(post.comments)} comments</span><span><IosShareRoundedIcon aria-hidden="true"/>{shown(post.shares)} shares</span></div>
      {url && <a className="gd-text-link gd-post-open" href={url} target="_blank" rel="noopener noreferrer">Open post ↗</a>}
    </div>
  </article>;
}

// The parent keys this component by owner, connection and refresh to reset navigation.
export default function AnalyticsPosts({ platform, accountId }: { platform: string; accountId: string }) {
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const [index, setIndex] = useState(0), [retry, setRetry] = useState(0);
  const [result, setResult] = useState<{ key: string; data: Page } | null>(null);
  const [failure, setFailure] = useState<{ key: string; message: string; expired: boolean } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const cursor = cursors[index], key = `${platform}:${accountId}:${cursor || ''}:${retry}`;
  const data = result?.key === key ? result.data : null, error = failure?.key === key ? failure : null;
  const busy = !data && !error;
  useEffect(() => {
    const controller = new AbortController(); let active = true;
    api.get(`/api/gruvi/${platform}/analytics/posts`, { params: { accountId, limit: 10, ...(cursor ? { cursor } : {}) }, signal: controller.signal })
      .then(response => { if (active) { setResult({ key, data: response.data }); setFailure(null); } })
      .catch(e => { if (active) setFailure({ key, message: e.response?.data?.error || 'Posts could not be loaded. Try again shortly.', expired: e.response?.data?.code === 'ANALYTICS_CURSOR_INVALID' }); });
    return () => { active = false; controller.abort(); };
  }, [platform, accountId, cursor, key]);
  const navigate = (page: number) => { setIndex(page); heading.current?.focus(); };
  const next = () => {
    if (!data?.paging.nextCursor) return;
    setCursors(previous => [...previous.slice(0, index + 1), data.paging.nextCursor!]); navigate(index + 1);
  };
  const reset = () => { setCursors([undefined]); setIndex(0); setRetry(n => n + 1); };
  return <section className="gd-form-section gd-analytics-recent" aria-labelledby="analytics-posts-title" aria-busy={busy}>
    <div className="gd-analytics-posts-heading"><h2 id="analytics-posts-title" ref={heading} tabIndex={-1}>Recent posts</h2><span className="gd-analytics-page-size">10 per page</span></div>
    <p className="gd-quiet">Lifetime engagement for the posts on this page. These counts are separate from the account insights period. Unavailable counts stay unavailable.</p>
    {error && <WorkspaceNotice onRetry={() => error.expired ? reset() : setRetry(n => n + 1)}>{error.message}</WorkspaceNotice>}
    {busy && <div role="status" aria-label="Loading posts" className="gd-posts-loading">{[0, 1, 2].map(i => <div className="gd-post-loading-row" key={i}><Skeleton variant="rounded" className="gd-post-loading-artwork"/><div><Skeleton width="25%"/><Skeleton width="90%" height={32}/><Skeleton width="70%"/><Skeleton width="50%"/></div></div>)}</div>}
    {data && <>
      <div className="gd-recent-totals"><span>{data.posts.length} posts on this page</span><span>{shown(data.totals.likes)} likes & reactions</span><span>{shown(data.totals.comments)} comments</span><span>{shown(data.totals.shares)} shares</span></div>
      <div className="gd-analytics-post-list">{data.posts.map(post => <PostRow post={post} key={post.id}/>)}</div>
      {!data.posts.length && <p>{index === 0 ? 'No posts were returned by this platform.' : 'No posts were returned on this page. You can go back or check the next page if available.'}</p>}
    </>}
    <nav className="gd-analytics-pagination" aria-label="Post pages">
      <span role="status" aria-live="polite">Page {index + 1}{busy ? ' · Loading' : data && !data.paging.hasMore ? ' · End of available posts' : ''}</span>
      <div><Button variant="outlined" startIcon={<ChevronLeftRoundedIcon/>} disabled={index === 0 || busy} onClick={() => navigate(index - 1)}>Previous</Button><Button variant="outlined" endIcon={<ChevronRightRoundedIcon/>} disabled={busy || !data?.paging.hasMore} onClick={next}>Next</Button></div>
    </nav>
    {index > 0 && <Button variant="text" className="gd-text-link gd-card-action" onClick={reset}>Back to latest posts</Button>}
  </section>;
}
