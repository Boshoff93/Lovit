import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tooltip as MuiTooltip,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShareIcon from '@mui/icons-material/Share';
import PeopleIcon from '@mui/icons-material/People';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  useGetTikTokSummaryQuery,
  useGetTikTokTrendsQuery,
  useGetTikTokAccountStatsQuery,
  useGetTikTokVideosQuery,
  TikTokVideo,
} from '../store/apiSlice';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
};

const formatPercent = (n: number): string => {
  if (!isFinite(n)) return '0%';
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
};

const pctChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  change?: number;
  subtitle?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon, gradient, change, subtitle }) => (
  <Box sx={{
    borderRadius: '20px',
    p: 2.5,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{
        width: 40, height: 40, borderRadius: '12px',
        background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}>
        {icon}
      </Box>
      {change !== undefined && (
        <Chip
          icon={change >= 0 ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
          label={formatPercent(change)}
          size="small"
          sx={{
            height: 24,
            fontSize: '0.75rem',
            fontWeight: 600,
            background: change >= 0 ? 'rgba(52,199,89,0.15)' : 'rgba(255,59,48,0.15)',
            color: change >= 0 ? '#34C759' : '#FF3B30',
            border: `1px solid ${change >= 0 ? 'rgba(52,199,89,0.3)' : 'rgba(255,59,48,0.3)'}`,
            '& .MuiChip-icon': { color: 'inherit' },
          }}
        />
      )}
    </Box>
    <Box>
      <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
        {typeof value === 'number' ? formatNumber(value) : value}
      </Typography>
      <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', mt: 0.25 }}>
        {label}
      </Typography>
      {subtitle && (
        <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', mt: 0.25 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

const chartTooltipStyle = {
  contentStyle: {
    background: '#1E1E22',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.8rem',
  },
  labelStyle: { color: 'rgba(255,255,255,0.6)' },
};

const TikTokAnalyticsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId || '';
  const [trendPeriod, setTrendPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const { data: summary, isLoading: summaryLoading, error: summaryError } = useGetTikTokSummaryQuery(
    { userId },
    { skip: !userId }
  );
  const { data: trendsData, isLoading: trendsLoading } = useGetTikTokTrendsQuery(
    { userId, period: trendPeriod },
    { skip: !userId }
  );
  const { data: accountStats, isLoading: statsLoading } = useGetTikTokAccountStatsQuery(
    { userId },
    { skip: !userId }
  );
  const { data: videosData } = useGetTikTokVideosQuery(
    { userId },
    { skip: !userId }
  );

  const isLoading = summaryLoading || trendsLoading || statsLoading;

  if (!userId) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 }, textAlign: 'center', py: 8 }}>
        <BarChartIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)' }}>Sign in to view analytics</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
        <CircularProgress sx={{ color: '#007AFF' }} />
      </Box>
    );
  }

  if (summaryError) {
    const errMsg = (summaryError as any)?.data?.error || 'Failed to load analytics';
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 }, textAlign: 'center', py: 8 }}>
        <BarChartIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>TikTok Not Connected</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>{errMsg}</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>
          Connect your TikTok account in Settings &gt; Integrations to view analytics.
        </Typography>
      </Box>
    );
  }

  const trends = trendsData?.trends || [];
  const weekViews = summary?.lastWeek?.views || 0;
  const monthViews = summary?.lastMonth?.views || 0;
  const allViews = summary?.totals?.views || 0;
  const avgViews = summary?.averages?.views || 0;

  // Week-over-week: compare lastWeek to the week before that (rough: allTime minus lastWeek / weeks)
  // We'll just show lastWeek vs lastMonth/4 as a rough comparison
  const prevWeekEstViews = (summary?.lastMonth?.views || 0) / 4;
  const weekViewsChange = pctChange(weekViews, prevWeekEstViews);

  const engagementRate = allViews > 0
    ? ((summary?.totals?.likes || 0) + (summary?.totals?.comments || 0) + (summary?.totals?.shares || 0)) / allViews * 100
    : 0;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {accountStats?.avatarUrl && (
          <Avatar src={accountStats.avatarUrl} sx={{ width: 56, height: 56 }} />
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px',
            background: 'linear-gradient(135deg, #EE1D52 0%, #69C9D0 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(238,29,82,0.3)',
            flexShrink: 0,
          }}>
            <BarChartIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              TikTok Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {accountStats?.displayName ? `@${accountStats.displayName}` : 'Performance overview'}
              {summary?.totalPosts ? ` \u00B7 ${summary.totalPosts} videos` : ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' },
        gap: 2,
        mb: 4,
      }}>
        <KpiCard
          label="Followers"
          value={accountStats?.followerCount || 0}
          icon={<PeopleIcon sx={{ fontSize: 20, color: '#fff' }} />}
          gradient="linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)"
        />
        <KpiCard
          label="Total Videos"
          value={accountStats?.videoCount || summary?.totalPosts || 0}
          icon={<VideoLibraryIcon sx={{ fontSize: 20, color: '#fff' }} />}
          gradient="linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)"
        />
        <KpiCard
          label="Total Views"
          value={allViews}
          icon={<VisibilityIcon sx={{ fontSize: 20, color: '#fff' }} />}
          gradient="linear-gradient(135deg, #10B981 0%, #14B8A6 100%)"
          change={weekViewsChange}
          subtitle={`${formatNumber(avgViews)} avg/post`}
        />
        <KpiCard
          label="Total Likes"
          value={summary?.totals?.likes || 0}
          icon={<FavoriteIcon sx={{ fontSize: 20, color: '#fff' }} />}
          gradient="linear-gradient(135deg, #EF4444 0%, #F97316 100%)"
        />
        <KpiCard
          label="Engagement Rate"
          value={`${engagementRate.toFixed(1)}%`}
          icon={<ChatBubbleIcon sx={{ fontSize: 20, color: '#fff' }} />}
          gradient="linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)"
        />
      </Box>

      {/* 7-Day Post Calendar */}
      {videosData?.videos && videosData.videos.length > 0 && (() => {
        const now = new Date();
        const days: Array<{ date: Date; label: string; dayName: string; videos: TikTokVideo[] }> = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          d.setHours(0, 0, 0, 0);
          const dayStart = d.getTime() / 1000;
          const dayEnd = dayStart + 86400;
          const dayVideos = videosData.videos.filter(
            (v) => v.create_time >= dayStart && v.create_time < dayEnd
          );
          days.push({
            date: d,
            label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            dayName: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : d.toLocaleDateString('en-US', { weekday: 'short' }),
            videos: dayVideos,
          });
        }
        return (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarTodayIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                Last 7 Days
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}>
              {days.map((day, idx) => (
                <Box
                  key={day.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    px: 2.5,
                    py: 1.5,
                    borderBottom: idx < days.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    '&:hover': { background: 'rgba(255,255,255,0.02)' },
                  }}
                >
                  {/* Day label */}
                  <Box sx={{ minWidth: 80, pt: 0.5 }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: day.dayName === 'Today' ? '#007AFF' : '#fff' }}>
                      {day.dayName}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                      {day.label}
                    </Typography>
                  </Box>

                  {/* Posts for that day */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1, minHeight: 36 }}>
                    {day.videos.length === 0 ? (
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', alignSelf: 'center' }}>
                        No posts
                      </Typography>
                    ) : (
                      day.videos.map((video) => {
                        const eng = video.like_count + video.comment_count + video.share_count;
                        const rate = video.view_count > 0 ? (eng / video.view_count * 100).toFixed(1) : '0';
                        const tooltipContent = [
                          video.title ? `"${video.title.slice(0, 60)}${video.title.length > 60 ? '...' : ''}"` : 'Untitled',
                          `Views: ${formatNumber(video.view_count)}`,
                          `Likes: ${formatNumber(video.like_count)}`,
                          `Comments: ${formatNumber(video.comment_count)}`,
                          `Shares: ${formatNumber(video.share_count)}`,
                          `Engagement: ${rate}%`,
                        ].join('\n');
                        return (
                          <MuiTooltip
                            key={video.id}
                            title={
                              <Box sx={{ whiteSpace: 'pre-line', fontSize: '0.75rem', lineHeight: 1.6 }}>
                                {tooltipContent}
                              </Box>
                            }
                            arrow
                            placement="top"
                            slotProps={{
                              tooltip: {
                                sx: {
                                  background: '#1E1E22',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  borderRadius: '10px',
                                  p: 1.5,
                                  maxWidth: 280,
                                },
                              },
                              arrow: { sx: { color: '#1E1E22' } },
                            }}
                          >
                            <Box
                              component="a"
                              href={video.share_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 1.5,
                                py: 0.75,
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                '&:hover': {
                                  background: 'rgba(0,122,255,0.1)',
                                  borderColor: 'rgba(0,122,255,0.3)',
                                },
                              }}
                            >
                              <VisibilityIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }} />
                              <Typography sx={{ fontSize: '0.75rem', color: '#fff', fontWeight: 500 }}>
                                {formatNumber(video.view_count)}
                              </Typography>
                              <FavoriteIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }} />
                              <Typography sx={{ fontSize: '0.75rem', color: '#fff', fontWeight: 500 }}>
                                {formatNumber(video.like_count)}
                              </Typography>
                            </Box>
                          </MuiTooltip>
                        );
                      })
                    )}
                  </Box>

                  {/* Day totals */}
                  {day.videos.length > 0 && (
                    <Box sx={{ textAlign: 'right', minWidth: 60, pt: 0.5 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
                        {day.videos.length} post{day.videos.length !== 1 ? 's' : ''}
                      </Typography>
                      <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                        {formatNumber(day.videos.reduce((s, v) => s + v.view_count, 0))} views
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        );
      })()}

      {/* Views Over Time */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
            Views Over Time
          </Typography>
          <ToggleButtonGroup
            value={trendPeriod}
            exclusive
            onChange={(_, v) => v && setTrendPeriod(v)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: 'rgba(255,255,255,0.5)',
                borderColor: 'rgba(255,255,255,0.1)',
                textTransform: 'none',
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.5,
                '&.Mui-selected': {
                  color: '#fff',
                  background: 'rgba(0,122,255,0.2)',
                  borderColor: 'rgba(0,122,255,0.4)',
                },
              },
            }}
          >
            <ToggleButton value="daily">Daily</ToggleButton>
            <ToggleButton value="weekly">Weekly</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box sx={{
          borderRadius: '20px',
          p: 2,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          height: 300,
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={(d: string) => {
                  if (trendPeriod === 'monthly') return d;
                  const date = new Date(d);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke="rgba(255,255,255,0.1)"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={formatNumber}
                stroke="rgba(255,255,255,0.1)"
                width={50}
              />
              <Tooltip
                {...chartTooltipStyle}
                formatter={(value: number) => [formatNumber(value ?? 0), 'Views']}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#007AFF"
                strokeWidth={2}
                fill="url(#viewsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Engagement Over Time */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
          Engagement Over Time
        </Typography>
        <Box sx={{
          borderRadius: '20px',
          p: 2,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          height: 300,
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={(d: string) => {
                  if (trendPeriod === 'monthly') return d;
                  const date = new Date(d);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke="rgba(255,255,255,0.1)"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={formatNumber}
                stroke="rgba(255,255,255,0.1)"
                width={50}
              />
              <Tooltip
                {...chartTooltipStyle}
                formatter={(value: number, name: string) => [formatNumber(value ?? 0), String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
              />
              <Legend
                wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}
              />
              <Bar dataKey="likes" stackId="engagement" fill="#EF4444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="comments" stackId="engagement" fill="#F59E0B" radius={[0, 0, 0, 0]} />
              <Bar dataKey="shares" stackId="engagement" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Post Frequency */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
          Post Frequency
        </Typography>
        <Box sx={{
          borderRadius: '20px',
          p: 2,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          height: 200,
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={(d: string) => {
                  if (trendPeriod === 'monthly') return d;
                  const date = new Date(d);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke="rgba(255,255,255,0.1)"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                stroke="rgba(255,255,255,0.1)"
                width={30}
                allowDecimals={false}
              />
              <Tooltip
                {...chartTooltipStyle}
                formatter={(value: any) => [value ?? 0, 'Posts']}
              />
              <Bar dataKey="posts" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Week-over-Week Comparison */}
      {summary && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
            This Week vs Last Month (Avg Week)
          </Typography>
          <TableContainer sx={{
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Metric</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>This Week</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Monthly Avg/Week</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { label: 'Views', current: summary.lastWeek.views, prev: summary.lastMonth.views / 4 },
                  { label: 'Likes', current: summary.lastWeek.likes, prev: summary.lastMonth.likes / 4 },
                  { label: 'Comments', current: summary.lastWeek.comments, prev: summary.lastMonth.comments / 4 },
                  { label: 'Shares', current: summary.lastWeek.shares, prev: summary.lastMonth.shares / 4 },
                  { label: 'Posts', current: summary.lastWeek.posts, prev: summary.lastMonth.posts / 4 },
                ].map((row) => {
                  const change = pctChange(row.current, row.prev);
                  return (
                    <TableRow key={row.label}>
                      <TableCell sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 500 }}>{row.label}</TableCell>
                      <TableCell align="right" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.08)' }}>{formatNumber(row.current)}</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>{formatNumber(Math.round(row.prev))}</TableCell>
                      <TableCell align="right" sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <Chip
                          size="small"
                          label={formatPercent(change)}
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: change >= 0 ? 'rgba(52,199,89,0.15)' : 'rgba(255,59,48,0.15)',
                            color: change >= 0 ? '#34C759' : '#FF3B30',
                            border: `1px solid ${change >= 0 ? 'rgba(52,199,89,0.3)' : 'rgba(255,59,48,0.3)'}`,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Top Performers by Views */}
      {summary?.topByViews && summary.topByViews.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
            Top Performers by Views
          </Typography>
          <TableContainer sx={{
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>#</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Title</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Views</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Likes</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Shares</TableCell>
                  <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.topByViews.map((video, i) => (
                  <TableRow key={video.id}>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>{i + 1}</TableCell>
                    <TableCell sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.08)', maxWidth: 300 }}>
                      <Typography noWrap sx={{ fontSize: '0.875rem' }}>{video.title || 'Untitled'}</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>
                      {formatNumber(video.views)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>
                      {formatNumber(video.likes)}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>
                      {formatNumber(video.shares)}
                    </TableCell>
                    <TableCell align="center" sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      {video.url && (
                        <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF' }}>
                          <OpenInNewIcon sx={{ fontSize: 18 }} />
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Top by Engagement Rate */}
      {summary?.topByEngagement && summary.topByEngagement.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
            Top by Engagement Rate
          </Typography>
          <TableContainer sx={{
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>#</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Title</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Views</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Engagement</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Rate</TableCell>
                  <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.topByEngagement.map((video, i) => {
                  const totalEng = video.likes + video.comments + video.shares;
                  const rate = video.views > 0 ? (totalEng / video.views * 100) : 0;
                  return (
                    <TableRow key={video.id}>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}>{i + 1}</TableCell>
                      <TableCell sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.08)', maxWidth: 300 }}>
                        <Typography noWrap sx={{ fontSize: '0.875rem' }}>{video.title || 'Untitled'}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.08)' }}>
                        {formatNumber(video.views)}
                      </TableCell>
                      <TableCell align="right" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 600 }}>
                        {formatNumber(totalEng)}
                      </TableCell>
                      <TableCell align="right" sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <Chip
                          size="small"
                          label={`${rate.toFixed(1)}%`}
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: 'rgba(236,72,153,0.15)',
                            color: '#EC4899',
                            border: '1px solid rgba(236,72,153,0.3)',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        {video.url && (
                          <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007AFF' }}>
                            <OpenInNewIcon sx={{ fontSize: 18 }} />
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default TikTokAnalyticsPage;
