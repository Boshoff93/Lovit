import React from 'react';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

export type AnalyticsMetricTone = 'audience' | 'posts' | 'views' | 'likes' | 'engagement';
export const formatAnalyticsNumber = (value: number) => value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value >= 1_000 ? `${(value / 1_000).toFixed(1)}K` : value.toLocaleString();

export default function AnalyticsMetricCard({ label, value, icon, tone = 'posts', change, subtitle, unavailable = false }: {
  label: string; value: string | number; icon: React.ReactNode; tone?: AnalyticsMetricTone; change?: number; subtitle?: string; unavailable?: boolean;
}) {
  return <article className="gd-analytics-metric-card">
    <div className="gd-analytics-metric-top"><span className={`gd-analytics-metric-icon is-${tone}`} aria-hidden="true">{icon}</span>
      {typeof change === 'number' && Number.isFinite(change) && <span className={`gd-analytics-metric-change${change < 0 ? ' is-negative' : ''}`}>{change < 0 ? <TrendingDownRoundedIcon aria-hidden="true"/> : <TrendingUpRoundedIcon aria-hidden="true"/>}{change >= 0 ? '+' : ''}{change.toFixed(1)}%</span>}
    </div>
    <div className="gd-analytics-metric-value"><strong className={unavailable ? 'is-unavailable' : undefined}>{typeof value === 'number' ? formatAnalyticsNumber(value) : value}</strong><span>{label}</span></div>
    {subtitle && <p>{subtitle}</p>}
  </article>;
}
