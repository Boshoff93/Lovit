import React from 'react';
import { Skeleton } from '@mui/material';

function Line({ width = '100%', height = 14, className = '' }: { width?: number | string; height?: number; className?: string }) {
  return <Skeleton variant="rounded" width={width} height={height} className={className}/>;
}

function ChartPlaceholder({ height = 240 }: { height?: number }) {
  return <div className="gd-chart-placeholder" style={{ height }}>
    <div className="gd-chart-placeholder-y">{[0, 1, 2, 3].map(i => <Line key={i} width={24} height={10}/>)}</div>
    <div className="gd-chart-placeholder-plot"/>
    <div className="gd-chart-placeholder-x">{[0, 1, 2, 3].map(i => <Line key={i} width={35} height={10}/>)}</div>
  </div>;
}

function MetricPlaceholders({ labels, video = false }: { labels: string[]; video?: boolean }) {
  return <div className={`gd-analytics-metric-grid${video ? ' is-video' : ''}`}>{labels.map(label => <div className="gd-analytics-metric-card" key={label}>
    <div className="gd-analytics-metric-top"><Line width={38} height={38}/></div>
    <div className="gd-analytics-metric-value"><Line width={90} height={38}/><span>{label}</span></div>
    <Line width="75%" height={12}/>
  </div>)}</div>;
}

/** Same thumbnail, text and divider geometry as the loaded paginated post rows. */
export function AnalyticsPostRowsSkeleton() {
  return <div className="gd-posts-loading" aria-hidden="true">
    <div className="gd-recent-totals">{[104, 120, 96, 96].map((width, i) => <span key={i}><Line width={width} height={18}/></span>)}</div>
    <div className="gd-analytics-post-list">{[0, 1, 2].map(i => <div className="gd-analytics-post gd-post-loading-row" key={i}>
      <Skeleton variant="rounded" className="gd-post-loading-artwork"/>
      <div className="gd-post-content gd-post-loading-content"><Line width={90} height={12}/><Line width={i === 1 ? '72%' : '88%'} height={22}/><Line width="100%"/><Line width="78%"/><div className="gd-post-metrics"><Line width={70} height={18}/><Line width={90} height={18}/><Line width={95} height={18}/></div><Line width={72} height={18}/></div>
    </div>)}</div>
  </div>;
}

export function AnalyticsInsightsSkeleton({ platform, chartLabel }: { platform: string; chartLabel?: string }) {
  const isMeta = platform === 'instagram' || platform === 'facebook';
  return <div className="gd-analytics-loading gd-analytics-skeleton" role="status" aria-label="Loading analytics" aria-busy="true">
    <div className="gd-analytics-skeleton-content" aria-hidden="true">
      <div className="gd-analytics-account"><div className="gd-analytics-identity"><Line width={44} height={44}/><div><Line width={130} height={16}/><Line width={80} height={12}/></div></div><div className="gd-analytics-snapshot-badges">{[90, 115, 115].map((width, i) => <span key={i}><Line width={width} height={18}/></span>)}</div></div>
      {isMeta && <>
        <div className="gd-analytics-section-heading"><h2>Account insights</h2><Line width={140} height={18}/></div>
        <MetricPlaceholders labels={['Content views', platform === 'facebook' ? 'Unique viewers' : 'Accounts reached', 'Interactions']}/>
        <div className="gd-form-section gd-analytics-chart">
          <h2>{chartLabel || (platform === 'facebook' ? 'Content views each day' : 'Accounts reached each day')}</h2>
          {platform === 'facebook' && <Line width={280} height={56}/>}
          <p className="gd-quiet">Daily values returned by Meta. Dates show bucket end times in UTC. Missing periods stay missing.</p>
          <ChartPlaceholder/><div className="gd-loading-chart-details"><Line width={110} height={14}/></div>
          <p className="gd-quiet">Meta may take 24 to 48 hours to update insights. Unavailable means no usable measurement was returned.</p>
        </div>
      </>}
      {!isMeta && <><div className="gd-analytics-section-heading"><h2>Recent post engagement</h2><Line width={140} height={18}/></div><MetricPlaceholders labels={['Likes & reactions', 'Comments', 'Shares']}/></>}
      <div className="gd-analytics-detail-grid">{['Post engagement', 'Top recent posts'].map(title => <div className="gd-form-section gd-engagement-panel" key={title}><h2>{title}</h2><Line width="85%"/>{[0,1,2].map(i => <Line key={i} width="100%" height={40}/>)}</div>)}</div>
    </div>
    <span className="gd-sr-only">Loading account analytics.</span>
  </div>;
}

export function AnalyticsChannelsSkeleton() {
  return <div className="gd-analytics-skeleton" role="status" aria-label="Loading analytics channels" aria-busy="true">
    <div className="gd-analytics-overview-body" aria-hidden="true"><div className="gd-snapshot-kpis">{[0,1,2,3].map(i => <div className="gd-stat gd-snapshot-stat" key={i}><Line width={36} height={36}/><Line width="80%"/><Line width={120} height={40}/><Line width="90%"/><Line width="65%"/></div>)}</div><div className="gd-form-section"><Line width={140} height={28}/>{[0,1,2].map(i => <div className="gd-snapshot-account" key={i}><Line width={44} height={44}/><Line width="65%" height={30}/><Line width={130} height={48}/></div>)}</div></div>
    <span className="gd-sr-only">Loading connected analytics channels.</span>
  </div>;
}

function VideoWeekPlaceholder() {
  return <div className="gd-video-loading-section"><h2>Last 7 Days</h2><div className="gd-video-loading-week">{[0, 1, 2, 3, 4, 5, 6].map(i => <div key={i}><div><Line width={45} height={12}/><Line width={55} height={10}/></div><Line width={i % 2 ? 115 : 165} height={16}/></div>)}</div></div>;
}

export function VideoActivitySkeleton() {
  return <div className="gd-analytics-skeleton" role="status" aria-label="Loading recent video activity" aria-busy="true"><div aria-hidden="true"><VideoWeekPlaceholder/></div><span className="gd-sr-only">Loading recent video activity.</span></div>;
}

export function VideoAnalyticsSkeleton({ platform, includeHeader = true }: { platform: 'YouTube' | 'TikTok'; includeHeader?: boolean }) {
  const labels = [platform === 'YouTube' ? 'Subscribers' : 'Followers', 'Total Videos', 'Total Views', 'Total Likes', 'Engagement Rate'];
  return <div className={`gd gd-video-analytics-skeleton gd-analytics-skeleton${includeHeader ? '' : ' has-workspace-header'}`} role="status" aria-label={`Loading ${platform} analytics`} aria-busy="true">
    <div aria-hidden="true">
      {includeHeader && <div className="gd-video-loading-header"><div><Line width={56} height={56}/><div><h1>{platform} Analytics</h1><Line width={155} height={16}/></div></div><Line width={170} height={48}/></div>}
      <MetricPlaceholders labels={labels} video/>
      <VideoWeekPlaceholder/>
      {['Views Over Time', 'Engagement Over Time', platform === 'YouTube' ? 'Upload Frequency' : 'Post Frequency'].map((title, i) => <div className="gd-video-loading-section" key={title}><div className="gd-video-loading-chart-heading"><h2>{title}</h2>{i === 0 && <Line width={175} height={32}/>}</div><div className="gd-video-loading-chart"><ChartPlaceholder height={i === 2 ? 166 : 266}/></div></div>)}
    </div>
    <span className="gd-sr-only">Loading {platform} analytics.</span>
  </div>;
}
