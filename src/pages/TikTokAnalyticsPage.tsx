import { VideoActivitySkeleton, VideoAnalyticsSkeleton } from "../components/AnalyticsSkeleton";
import AnalyticsWorkspaceHeader, { useAnalyticsAccount } from '../components/AnalyticsWorkspaceHeader';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import WorkspaceNotice from "../components/WorkspaceNotice";
import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip as MuiTooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  useGetTikTokSummaryQuery,
  useGetTikTokTrendsQuery,
  useGetTikTokAccountStatsQuery,
  useGetSocialAccountsQuery,
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

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface DayVideos {
  date: Date;
  label: string;
  isToday: boolean;
  videos: TikTokVideo[];
}

const groupVideosByDay = (videos: TikTokVideo[]): DayVideos[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  // Group videos by local date key
  const byDate = new Map<string, TikTokVideo[]>();
  videos.forEach(v => {
    const d = new Date(v.create_time * 1000);
    if (d < sevenDaysAgo) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(v);
  });

  // Build 7 day entries (oldest first)
  const days: DayVideos[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const isToday = i === 0;
    days.push({
      date,
      label: `${DAY_NAMES[date.getDay()]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`,
      isToday,
      videos: (byDate.get(key) || []).sort((a, b) => b.create_time - a.create_time),
    });
  }
  return days;
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
      <Typography sx={{ fontSize: '0.8rem', color: '#aab4c2', mt: 0.25 }}>
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
    background: '#171e28',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.8rem',
  },
  labelStyle: { color: '#aab4c2' },
};

const tooltipSx = {
  background: '#171e28',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  px: 2,
  py: 1.5,
  minWidth: 160,
  '& .MuiTooltip-arrow': { color: '#171e28' },
};

const PostCard: React.FC<{ video: TikTokVideo }> = ({ video }) => (
  <MuiTooltip
    arrow
    placement="top"
    componentsProps={{ tooltip: { sx: tooltipSx } }}
    title={
      <Box sx={{ p: 0.5 }}>
        <Typography sx={{
          fontWeight: 600, fontSize: '0.8rem', color: '#fff', mb: 1, maxWidth: 200,
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {video.title || 'Untitled'}
        </Typography>
        {[
          { label: 'Views', value: video.view_count },
          { label: 'Likes', value: video.like_count },
          { label: 'Comments', value: video.comment_count },
          { label: 'Shares', value: video.share_count },
        ].map(m => (
          <Box key={m.label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', py: 0.25 }}>
            <span>{m.label}</span>
            <span style={{ fontWeight: 600 }}>{formatNumber(m.value)}</span>
          </Box>
        ))}
      </Box>
    }
  >
    <Box
      component="a"
      href={video.share_url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 64,
        flexShrink: 0,
        cursor: 'pointer',
        textDecoration: 'none',
        borderRadius: '8px',
        p: 0.5,
        transition: 'background 0.2s',
        '&:hover': { background: 'rgba(255,255,255,0.06)' },
      }}
    >
      <Box sx={{
        width: '100%',
        aspectRatio: '3/4',
        borderRadius: '6px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.05)',
        mb: 0.5,
      }}>
        {video.cover_image_url ? (
          <Box
            component="img"
            src={video.cover_image_url}
            alt={video.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VideoLibraryIcon sx={{ fontSize: 24, color: 'rgba(255,255,255,0.2)' }} />
          </Box>
        )}
      </Box>
      <Typography sx={{
        fontSize: '0.6rem',
        color: '#aab4c2',
        lineHeight: 1.2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
      }}>
        {video.title || 'Untitled'}
      </Typography>
    </Box>
  </MuiTooltip>
);

interface WeekCalendarProps {
  videos: TikTokVideo[];
}

const WeekCalendar: React.FC<WeekCalendarProps> = ({ videos }) => {
  const days = useMemo(() => groupVideosByDay(videos), [videos]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
        Last 7 Days
      </Typography>
      <Box sx={{
        borderRadius: '20px',
        p: { xs: 1.5, sm: 2.5 },
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}>
        {days.map((day) => (
          <Box
            key={day.date.toISOString()}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 1.5, sm: 2 },
              py: 1.5,
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              '&:last-child': { borderBottom: 'none', pb: 0 },
              '&:first-of-type': { pt: 0 },
            }}
          >
            {/* Day label */}
            <Box sx={{
              width: { xs: 60, sm: 80 },
              flexShrink: 0,
              pt: 0.5,
            }}>
              <Typography sx={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: day.isToday ? '#007AFF' : '#fff',
                lineHeight: 1.2,
              }}>
                {day.isToday ? 'Today' : DAY_NAMES[day.date.getDay()]}
              </Typography>
              <Typography sx={{
                fontSize: '0.7rem',
                color: day.isToday ? 'rgba(0,122,255,0.7)' : 'rgba(255,255,255,0.35)',
              }}>
                {MONTH_NAMES[day.date.getMonth()]} {day.date.getDate()}
              </Typography>
            </Box>

            {/* Posts carousel */}
            {day.videos.length > 0 ? (
              <Box sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                flex: 1,
                pb: 0.5,
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: 2 },
              }}>
                {day.videos.map(video => (
                  <PostCard key={video.id} video={video} />
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', pt: 0.5 }}>
                No posts
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const TikTokAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId || '';
  const [trendPeriod, setTrendPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Fetch connected TikTok accounts
  const { data: socialAccountsData, isLoading: accountsLoading, isError: accountsError, refetch: refetchAccounts } = useGetSocialAccountsQuery(
    { userId },
    { skip: !userId }
  );
  const { accountId: activeAccountId, select } = useAnalyticsAccount(socialAccountsData?.accounts || [], 'tiktok');

  const { currentData: summary, isFetching: summaryFetching, error: summaryError, refetch: refetchSummary } = useGetTikTokSummaryQuery(
    { userId, accountId: activeAccountId },
    { skip: !userId || !activeAccountId }
  );
  const { currentData: trendsData, isFetching: trendsFetching, refetch: refetchTrends } = useGetTikTokTrendsQuery(
    { userId, accountId: activeAccountId, period: trendPeriod },
    { skip: !userId || !activeAccountId }
  );
  const { currentData: accountStats, isFetching: statsFetching, refetch: refetchStats } = useGetTikTokAccountStatsQuery(
    { userId, accountId: activeAccountId },
    { skip: !userId || !activeAccountId }
  );
  const { currentData: videosData, isFetching: videosLoading, error: videosError, refetch: refetchVideos } = useGetTikTokVideosQuery(
    { userId, accountId: activeAccountId },
    { skip: !userId || !activeAccountId }
  );

  const isLoading = accountsLoading || (!!activeAccountId && ((!summary && !summaryError) || (trendsFetching && !trendsData) || (statsFetching && !accountStats)));
  const header = <AnalyticsWorkspaceHeader platform="tiktok" accounts={socialAccountsData?.accounts || []} accountId={activeAccountId} onAccountChange={select} loading={accountsLoading}><Button variant="outlined" startIcon={<RefreshRoundedIcon/>} disabled={!activeAccountId || summaryFetching || trendsFetching || statsFetching || videosLoading} onClick={() => { refetchSummary(); refetchTrends(); refetchStats(); refetchVideos(); }}>Refresh</Button></AnalyticsWorkspaceHeader>;

  if (!userId) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 }, textAlign: 'center', py: 8 }}>
        <BarChartIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
        <Typography variant="h6" sx={{ color: '#aab4c2' }}>Sign in to view analytics</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return <div className="gd gd-video-analytics">{header}<VideoAnalyticsSkeleton platform="TikTok" includeHeader={false}/></div>;
  }

  if (accountsError || !activeAccountId || summaryError) {
    return <div className="gd gd-video-analytics">{header}
      {accountsError ? <WorkspaceNotice onRetry={() => refetchAccounts()}>Your connected accounts could not be loaded.</WorkspaceNotice> : summaryError ? <WorkspaceNotice onRetry={() => refetchSummary()}>We could not load this account's analytics. Try again shortly or check its connection in Connected Accounts.</WorkspaceNotice> : <section className="gd-form-section gd-analytics-empty"><h2>Connect TikTok</h2><p>Connect an account to see its audience and video performance.</p><Button variant="contained" className="gd-card-action" onClick={() => navigate('/settings/connected-accounts')}>Connect account</Button></section>}
    </div>;
  }

  const trends = trendsData?.trends || [];
  const weekViews = summary?.lastWeek?.views || 0;
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
    <Box className="gd gd-video-analytics">
      {header}
      {/* KPI Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
        gap: 2,
        mb: 4,
      }}>
        <KpiCard
          label="Followers"
          value={accountStats ? accountStats.followerCount : 'Unavailable'}
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

      {/* Last 7 Days Calendar */}
      <>{videosLoading && !videosData ? <VideoActivitySkeleton/> : videosError && !videosData ? <WorkspaceNotice onRetry={() => refetchVideos()}>Recent video activity could not be loaded.</WorkspaceNotice> : <WeekCalendar videos={videosData?.videos || []}/>}</>

      <p className="gd-video-chart-context">Charts group lifetime video engagement by publication date, rather than the day each view happened.</p>
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
                color: '#aab4c2',
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
                tick={{ fill: '#91aaa9', fontSize: 11 }}
                tickFormatter={(d: string) => {
                  if (trendPeriod === 'monthly') return d;
                  const date = new Date(d);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke="rgba(255,255,255,0.1)"
              />
              <YAxis
                tick={{ fill: '#91aaa9', fontSize: 11 }}
                tickFormatter={formatNumber}
                stroke="rgba(255,255,255,0.1)"
                width={50}
              />
              <Tooltip
                {...chartTooltipStyle}
                formatter={(value: number | undefined) => [formatNumber(value ?? 0), 'Views']}
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
                tick={{ fill: '#91aaa9', fontSize: 11 }}
                tickFormatter={(d: string) => {
                  if (trendPeriod === 'monthly') return d;
                  const date = new Date(d);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke="rgba(255,255,255,0.1)"
              />
              <YAxis
                tick={{ fill: '#91aaa9', fontSize: 11 }}
                tickFormatter={formatNumber}
                stroke="rgba(255,255,255,0.1)"
                width={50}
              />
              <Tooltip
                {...chartTooltipStyle}
                formatter={(value: number | undefined, name: string | undefined) => [formatNumber(value ?? 0), String(name ?? '').charAt(0).toUpperCase() + String(name ?? '').slice(1)]}
              />
              <Legend
                wrapperStyle={{ color: '#aab4c2', fontSize: '0.75rem' }}
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
                tick={{ fill: '#91aaa9', fontSize: 11 }}
                tickFormatter={(d: string) => {
                  if (trendPeriod === 'monthly') return d;
                  const date = new Date(d);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                stroke="rgba(255,255,255,0.1)"
              />
              <YAxis
                tick={{ fill: '#91aaa9', fontSize: 11 }}
                stroke="rgba(255,255,255,0.1)"
                width={30}
                allowDecimals={false}
              />
              <Tooltip
                {...chartTooltipStyle}
                formatter={(value: number | undefined) => [value ?? 0, 'Posts']}
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
                  <TableCell sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Metric</TableCell>
                  <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>This Week</TableCell>
                  <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Monthly Avg/Week</TableCell>
                  <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Change</TableCell>
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
                      <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>{formatNumber(Math.round(row.prev))}</TableCell>
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
                  <TableCell sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>#</TableCell>
                  <TableCell sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Title</TableCell>
                  <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Views</TableCell>
                  <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Likes</TableCell>
                  <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Shares</TableCell>
                  <TableCell align="center" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.topByViews.map((video, i) => (
                  <TableRow key={video.id}>
                    <TableCell sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>{i + 1}</TableCell>
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
                  <TableCell sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>#</TableCell>
                  <TableCell sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Title</TableCell>
                  <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Views</TableCell>
                  <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Engagement</TableCell>
                  <TableCell align="right" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Rate</TableCell>
                  <TableCell align="center" sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.topByEngagement.map((video, i) => {
                  const totalEng = video.likes + video.comments + video.shares;
                  const rate = video.views > 0 ? (totalEng / video.views * 100) : 0;
                  return (
                    <TableRow key={video.id}>
                      <TableCell sx={{ color: '#aab4c2', borderColor: 'rgba(255,255,255,0.08)' }}>{i + 1}</TableCell>
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
