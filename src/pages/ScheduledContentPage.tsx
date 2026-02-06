import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  CalendarMonth as CalendarMonthIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  HourglassTop as HourglassIcon,
  Close as CloseIcon,
  PlayArrow as PlayArrowIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  scheduledPostsApi,
  ScheduledPost,
} from '../services/api';
import { useGetScheduledPostsQuery } from '../store/apiSlice';
import { useAuth } from '../hooks/useAuth';

// TikTok icon component
const TikTokIcon: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    sx={{ width: 24, height: 24, ...sx }}
  >
    <path
      fill="currentColor"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
    />
  </Box>
);

type ViewMode = 'day' | 'week' | 'month';

const ScheduledContentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { subscription } = useAuth();

  // RTK Query for scheduled posts
  const scheduledPostsQuery = useGetScheduledPostsQuery();
  const scheduledPosts = scheduledPostsQuery.data?.scheduledPosts || [];
  const schedulingLimitsRaw = scheduledPostsQuery.data?.schedulingLimits;
  const loading = scheduledPostsQuery.isLoading;

  // Scheduling limits with tier-based fallback
  const effectiveLimits = useMemo(() => {
    const TIER_LIMITS: Record<string, number> = { starter: 60, pro: 120, scale: 120, premium: 240, beast: 240, hardcore: 240 };
    const tierLimit = TIER_LIMITS[(subscription?.tier || 'starter').toLowerCase()] || 60;
    const used = schedulingLimitsRaw?.used ?? 0;
    const limit = schedulingLimitsRaw?.limit ?? tierLimit;
    const remaining = Math.max(0, limit - used);
    return { used, limit, remaining };
  }, [schedulingLimitsRaw, subscription?.tier]);

  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'published' | 'partial' | 'failed'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [postToCancel, setPostToCancel] = useState<ScheduledPost | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Details dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  // Highlighted post (from URL param)
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);

  // Refs for scrolling to posts
  const postRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Handle highlight param from URL
  useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (highlight) {
      setHighlightedPostId(highlight);
      // Clear the URL param after reading it
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Scroll to highlighted post after posts load
  useEffect(() => {
    if (highlightedPostId && scheduledPosts.length > 0 && !loading) {
      const post = scheduledPosts.find(p => p.scheduleId === highlightedPostId);
      if (post) {
        // Navigate calendar to the date of the scheduled post
        const postDate = new Date(post.scheduledTime);
        setCurrentDate(postDate);

        // Wait for render, then scroll to the post
        setTimeout(() => {
          const element = postRefs.current.get(highlightedPostId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Clear highlight after animation
            setTimeout(() => setHighlightedPostId(null), 3000);
          }
        }, 300);
      }
    }
  }, [highlightedPostId, scheduledPosts, loading]);

  // Preload thumbnail images when posts are loaded (so they're cached when popup opens)
  useEffect(() => {
    if (scheduledPosts.length > 0) {
      scheduledPosts.forEach(post => {
        if (post.thumbnailUrl) {
          const img = new Image();
          img.src = post.thumbnailUrl;
        }
      });
    }
  }, [scheduledPosts]);

  // Handle post tile click - show details dialog
  const handlePostClick = useCallback((post: ScheduledPost) => {
    setSelectedPost(post);
    setDetailsDialogOpen(true);
  }, []);

  // Calendar navigation
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());

  // Get week dates
  const getWeekDates = useMemo(() => {
    const dates: Date[] = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);

  // Get month dates (including padding days from prev/next months)
  const getMonthDates = useMemo(() => {
    const dates: Date[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Start from the Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // End at the Saturday of the week containing the last day
    const endDate = new Date(lastDay);
    const daysToAdd = 6 - lastDay.getDay();
    endDate.setDate(endDate.getDate() + daysToAdd);

    // Generate all dates
    const current = new Date(startDate);
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }, [currentDate]);

  // Get posts for a specific date (for month view) - show all statuses except cancelled
  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledTime);
      const matchesDate = postDate.toDateString() === date.toDateString() && post.status !== 'cancelled';
      const matchesFilter = statusFilter === 'all' || post.status === statusFilter;
      return matchesDate && matchesFilter;
    });
  };

  // Get status color and styling
  const getStatusStyle = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'published':
        return { bg: 'rgba(34, 197, 94, 0.15)', border: '#22C55E', text: '#4ADE80' };
      case 'partial':
        return { bg: 'rgba(234, 179, 8, 0.15)', border: '#EAB308', text: '#FACC15' }; // Yellow for partial success
      case 'failed':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: '#EF4444', text: '#F87171' };
      case 'publishing':
        return { bg: 'rgba(249, 115, 22, 0.15)', border: '#F97316', text: '#FB923C' };
      case 'cancelled':
        return { bg: 'rgba(156, 163, 175, 0.15)', border: '#9CA3AF', text: '#9CA3AF' };
      default: // scheduled
        return { bg: 'rgba(0, 122, 255, 0.15)', border: '#007AFF', text: '#60A5FA' };
    }
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Get time slots for the day (24 hours)
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 0; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // Format date range for header
  const getDateRangeText = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else if (viewMode === 'week') {
      const start = getWeekDates[0];
      const end = getWeekDates[6];
      if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} - ${end.getDate()}, ${end.getFullYear()}`;
      }
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  // Get posts for a specific date and hour - show all statuses except cancelled
  const getPostsForSlot = (date: Date, hour: number) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledTime);
      const matchesSlot = postDate.toDateString() === date.toDateString() && postDate.getHours() === hour && post.status !== 'cancelled';
      const matchesFilter = statusFilter === 'all' || post.status === statusFilter;
      return matchesSlot && matchesFilter;
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleCancelClick = (post: ScheduledPost) => {
    setPostToCancel(post);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!postToCancel) return;
    try {
      setCancelling(true);
      await scheduledPostsApi.cancelScheduledPost(postToCancel.scheduleId);
      // Refetch to get updated data
      scheduledPostsQuery.refetch();
      setCancelDialogOpen(false);
      setPostToCancel(null);
    } catch (error) {
      console.error('Failed to cancel scheduled post:', error);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Header - Same style as Create Music page */}
      <Box sx={{ pt: { xs: 0, md: 2 }, pb: 3, px: { xs: 2, sm: 3, md: 4 }, background: 'transparent' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                flexShrink: 0,
                animation: 'iconEntrance 0.5s ease-out',
                '@keyframes iconEntrance': {
                  '0%': {
                    opacity: 0,
                    transform: 'scale(0.5) rotate(-10deg)',
                  },
                  '50%': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1) rotate(0deg)',
                  },
                },
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                Content Calendar
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
                  Schedule and manage your video posts
                </Typography>
                <Chip
                  label={`${effectiveLimits.remaining}/${effectiveLimits.limit} posts left`}
                  size="small"
                  sx={{
                    background: effectiveLimits.remaining <= 5
                      ? 'rgba(239,68,68,0.15)'
                      : effectiveLimits.remaining <= 15
                        ? 'rgba(234,179,8,0.15)'
                        : 'rgba(59,130,246,0.15)',
                    color: effectiveLimits.remaining <= 5
                      ? '#F87171'
                      : effectiveLimits.remaining <= 15
                        ? '#FACC15'
                        : '#60A5FA',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 24,
                    border: '1px solid',
                    borderColor: effectiveLimits.remaining <= 5
                      ? 'rgba(239,68,68,0.3)'
                      : effectiveLimits.remaining <= 15
                        ? 'rgba(234,179,8,0.3)'
                        : 'rgba(59,130,246,0.3)',
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Create a Post button - Full on large, icon on small */}
          <Button
            variant="contained"
            onClick={() => navigate('/my-videos')}
            endIcon={<ArrowForwardIcon />}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              background: '#007AFF',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              '&:hover': {
                background: '#0066CC',
                boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
              },
            }}
          >
            Create a Post
          </Button>
          {/* Circle icon button for small screens */}
          <IconButton
            onClick={() => navigate('/my-videos')}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              width: 44,
              height: 44,
              background: '#007AFF',
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              '&:hover': {
                background: '#0066CC',
              },
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Controls Row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3, md: 4 },
          py: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: '#1E1E22',
          borderRadius: '16px 16px 0 0',
          gap: 1,
        }}
      >
        {/* Left - Date Range with Arrows */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 0.5 }}>
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: { xs: '0.8rem', sm: '0.9rem' }, display: { xs: 'block', sm: 'none' } }}>
            {getDateRangeText()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => navigateDate('prev')}
              sx={{
                p: 0.5,
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                color: 'rgba(255,255,255,0.7)',
                '&:hover': { borderColor: '#007AFF', color: '#007AFF' },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => navigateDate('next')}
              sx={{
                p: 0.5,
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                color: 'rgba(255,255,255,0.7)',
                '&:hover': { borderColor: '#007AFF', color: '#007AFF' },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', ml: 0.5, display: { xs: 'none', sm: 'block' } }}>
              {getDateRangeText()}
            </Typography>
          </Box>
        </Box>

        {/* Right - Calendar Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <Button
            variant="outlined"
            size="small"
            onClick={goToToday}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              borderColor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              py: 0.5,
              px: { xs: 1.5, sm: 2 },
              minWidth: 'auto',
              '&:hover': { borderColor: '#007AFF', color: '#007AFF' },
            }}
          >
            Today
          </Button>

          <ButtonGroup size="small">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                onClick={() => setViewMode(mode)}
                variant={viewMode === mode ? 'contained' : 'outlined'}
                sx={{
                  textTransform: 'capitalize',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  py: 0.5,
                  px: { xs: 1, sm: 1.5 },
                  minWidth: 'auto',
                  bgcolor: viewMode === mode ? '#007AFF' : 'transparent',
                  borderColor: viewMode === mode ? '#007AFF' : 'rgba(255,255,255,0.15)',
                  color: viewMode === mode ? '#fff' : 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    bgcolor: viewMode === mode ? '#0066DD' : 'rgba(0,122,255,0.1)',
                    borderColor: '#007AFF',
                  },
                }}
              >
                {mode}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>

      {/* Status Filter */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 3, md: 4 },
          py: 1,
          background: '#1E1E22',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexWrap: 'wrap',
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, mr: 0.5 }}>
          Filter:
        </Typography>
        <Box
          onClick={() => setStatusFilter('all')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            px: 1,
            py: 0.25,
            borderRadius: '8px',
            bgcolor: statusFilter === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: statusFilter === 'all' ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', color: statusFilter === 'all' ? '#fff' : 'rgba(255,255,255,0.7)' }}>All</Typography>
        </Box>
        <Box
          onClick={() => setStatusFilter('scheduled')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            px: 1,
            py: 0.25,
            borderRadius: '8px',
            bgcolor: statusFilter === 'scheduled' ? 'rgba(0,122,255,0.15)' : 'transparent',
            border: statusFilter === 'scheduled' ? '1px solid rgba(0,122,255,0.3)' : '1px solid transparent',
            '&:hover': { bgcolor: 'rgba(0,122,255,0.1)' },
          }}
        >
          <ScheduleIcon sx={{ fontSize: 14, color: '#007AFF' }} />
          <Typography sx={{ fontSize: '0.75rem', color: statusFilter === 'scheduled' ? '#fff' : 'rgba(255,255,255,0.7)' }}>Scheduled</Typography>
        </Box>
        <Box
          onClick={() => setStatusFilter('published')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            px: 1,
            py: 0.25,
            borderRadius: '8px',
            bgcolor: statusFilter === 'published' ? 'rgba(34,197,94,0.15)' : 'transparent',
            border: statusFilter === 'published' ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
            '&:hover': { bgcolor: 'rgba(34,197,94,0.1)' },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 14, color: '#22C55E' }} />
          <Typography sx={{ fontSize: '0.75rem', color: statusFilter === 'published' ? '#fff' : 'rgba(255,255,255,0.7)' }}>Published</Typography>
        </Box>
        <Box
          onClick={() => setStatusFilter('partial')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            px: 1,
            py: 0.25,
            borderRadius: '8px',
            bgcolor: statusFilter === 'partial' ? 'rgba(234,179,8,0.15)' : 'transparent',
            border: statusFilter === 'partial' ? '1px solid rgba(234,179,8,0.3)' : '1px solid transparent',
            '&:hover': { bgcolor: 'rgba(234,179,8,0.1)' },
          }}
        >
          <WarningIcon sx={{ fontSize: 14, color: '#EAB308' }} />
          <Typography sx={{ fontSize: '0.75rem', color: statusFilter === 'partial' ? '#FACC15' : 'rgba(255,255,255,0.7)' }}>Partial</Typography>
        </Box>
        <Box
          onClick={() => setStatusFilter('failed')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            px: 1,
            py: 0.25,
            borderRadius: '8px',
            bgcolor: statusFilter === 'failed' ? 'rgba(239,68,68,0.15)' : 'transparent',
            border: statusFilter === 'failed' ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' },
          }}
        >
          <ErrorIcon sx={{ fontSize: 14, color: '#EF4444' }} />
          <Typography sx={{ fontSize: '0.75rem', color: statusFilter === 'failed' ? '#fff' : 'rgba(255,255,255,0.7)' }}>Failed</Typography>
        </Box>
      </Box>

      {/* Main Content - Calendar fills remaining space */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', minWidth: 0 }}>

        {/* Calendar Grid */}
        <Box sx={{ flex: 1, background: '#141418', borderRadius: '0 0 16px 16px', position: 'relative', minHeight: 400, minWidth: { xs: 'auto', sm: 700 }, overflow: 'auto' }}>
          {/* Loading overlay */}
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(20, 20, 24, 0.8)',
                backdropFilter: 'blur(4px)',
                zIndex: 100,
                borderRadius: '0 0 16px 16px',
              }}
            >
              <CircularProgress sx={{ color: '#007AFF' }} />
            </Box>
          )}
            {/* Empty state overlay - centered, doesn't affect layout */}
            {scheduledPosts.filter(p => p.status === 'scheduled').length === 0 && !loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2, sm: 4 },
                    background: '#1E1E22',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    width: 'fit-content',
                    maxWidth: { xs: 'calc(100% - 32px)', sm: '400px' },
                    pointerEvents: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(0,122,255,0.2) 0%, rgba(90,200,250,0.2) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <ScheduleIcon sx={{ fontSize: 32, color: '#007AFF' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                    No Scheduled Posts
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, maxWidth: 280, fontSize: '0.9rem' }}>
                    Create content with AI to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create')}
                    sx={{
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0066DD 0%, #4AB8EA 100%)',
                      },
                    }}
                  >
                    Create Content
                  </Button>
                </Box>
              </Box>
            )}
            {/* Week Header */}
            {viewMode === 'week' && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '50px repeat(7, 1fr)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  background: '#1E1E22',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}
              >
                <Box sx={{ borderRight: '1px solid rgba(255,255,255,0.08)' }} />
                {getWeekDates.map((date, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      py: 1,
                      textAlign: 'center',
                      borderRight: idx < 6 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      background: isToday(date) ? 'rgba(0,122,255,0.1)' : 'transparent',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: isToday(date) ? '#007AFF' : '#fff',
                        lineHeight: 1,
                      }}
                    >
                      {date.getDate()}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        color: isToday(date) ? '#007AFF' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      / {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Time Grid */}
            {viewMode === 'week' && (
              <Box>
                {timeSlots.map((time) => (
                  <Box
                    key={time}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '50px repeat(7, 1fr)',
                      minHeight: 50,
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        pr: 0.75,
                        pt: 0.25,
                        borderRight: '1px solid rgba(255,255,255,0.08)',
                        background: '#1E1E22',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                        {time}
                      </Typography>
                    </Box>

                    {getWeekDates.map((date, dayIdx) => {
                      const hour = parseInt(time.split(':')[0]);
                      const posts = getPostsForSlot(date, hour);

                      return (
                        <Box
                          key={dayIdx}
                          sx={{
                            borderRight: dayIdx < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                            background: isToday(date) ? 'rgba(0,122,255,0.05)' : 'transparent',
                            p: 0.25,
                            minHeight: 50,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {posts.map((post) => {
                            const statusStyle = getStatusStyle(post.status);
                            const isHighlighted = highlightedPostId === post.scheduleId;
                            return (
                              <Box
                                key={post.scheduleId}
                                ref={(el: HTMLDivElement | null) => {
                                  if (el) postRefs.current.set(post.scheduleId, el);
                                }}
                                sx={{
                                  background: isHighlighted ? 'rgba(0, 122, 255, 0.2)' : statusStyle.bg,
                                  borderLeft: `3px solid ${statusStyle.border}`,
                                  borderRadius: '6px',
                                  p: 0.5,
                                  mb: 0.25,
                                  cursor: 'pointer',
                                  position: 'relative',
                                  transition: 'all 0.3s ease',
                                  overflow: 'hidden',
                                  animation: isHighlighted ? 'pulse 1s ease-in-out 3' : 'none',
                                  '@keyframes pulse': {
                                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 122, 255, 0.4)' },
                                    '50%': { boxShadow: '0 0 0 8px rgba(0, 122, 255, 0)' },
                                  },
                                  '&:hover': {
                                    background: statusStyle.bg,
                                    filter: 'brightness(0.95)',
                                    transform: 'scale(1.02)',
                                  },
                                  '&:hover .delete-btn': { opacity: 1 },
                                }}
                                onClick={() => handlePostClick(post)}
                              >
                                {/* Title row with status icon */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: 2 }}>
                                  {post.status === 'published' && <CheckCircleIcon sx={{ fontSize: 10, color: '#22C55E' }} />}
                                  {post.status === 'partial' && <WarningIcon sx={{ fontSize: 10, color: '#EAB308' }} />}
                                  {post.status === 'failed' && <ErrorIcon sx={{ fontSize: 10, color: '#EF4444' }} />}
                                  {post.status === 'publishing' && <HourglassIcon sx={{ fontSize: 10, color: '#F97316' }} />}
                                  {post.status === 'scheduled' && <ScheduleIcon sx={{ fontSize: 10, color: '#007AFF' }} />}
                                  <Typography
                                    sx={{
                                      fontSize: '0.65rem',
                                      fontWeight: 600,
                                      color: statusStyle.text,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      flex: 1,
                                    }}
                                  >
                                    {post.title || 'Untitled'}
                                  </Typography>
                                </Box>
                                {/* Platform icons row */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                  {post.platforms.slice(0, 4).map((p, i) => (
                                    <Box
                                      key={i}
                                      sx={{
                                        width: 14,
                                        height: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '3px',
                                        background: 'rgba(255,255,255,0.8)',
                                      }}
                                    >
                                      {p.platform.toLowerCase() === 'youtube' && <YouTubeIcon sx={{ fontSize: 11, color: '#FF0000' }} />}
                                      {p.platform.toLowerCase() === 'instagram' && <InstagramIcon sx={{ fontSize: 11, color: '#E4405F' }} />}
                                      {p.platform.toLowerCase() === 'tiktok' && <TikTokIcon sx={{ width: 11, height: 11, color: '#000' }} />}
                                      {p.platform.toLowerCase() === 'facebook' && <FacebookIcon sx={{ fontSize: 11, color: '#1877F2' }} />}
                                      {p.platform.toLowerCase() === 'linkedin' && <LinkedInIcon sx={{ fontSize: 11, color: '#0A66C2' }} />}
                                    </Box>
                                  ))}
                                  {post.platforms.length > 4 && (
                                    <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                      +{post.platforms.length - 4}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
              <Box>
                {timeSlots.map((time) => {
                  const hour = parseInt(time.split(':')[0]);
                  const posts = getPostsForSlot(currentDate, hour);
                  return (
                    <Box
                      key={time}
                      sx={{
                        display: 'flex',
                        minHeight: 60,
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 60,
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-end',
                          pr: 1,
                          pt: 0.5,
                          borderRight: '1px solid rgba(255,255,255,0.08)',
                          background: '#1E1E22',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                          {time}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 0.5 }}>
                        {posts.map((post) => {
                          const statusStyle = getStatusStyle(post.status);
                          const isHighlighted = highlightedPostId === post.scheduleId;
                          return (
                            <Box
                              key={post.scheduleId}
                              ref={(el: HTMLDivElement | null) => {
                                if (el) postRefs.current.set(post.scheduleId, el);
                              }}
                              onClick={() => handlePostClick(post)}
                              sx={{
                                background: isHighlighted ? 'rgba(0, 122, 255, 0.2)' : statusStyle.bg,
                                borderLeft: `3px solid ${statusStyle.border}`,
                                borderRadius: '4px',
                                p: 1,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                animation: isHighlighted ? 'pulse 1s ease-in-out 3' : 'none',
                                '&:hover': { background: 'rgba(0,122,255,0.15)' },
                              }}
                            >
                              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {post.title || 'Untitled'}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Month View */}
            {viewMode === 'month' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Weekday Header */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    background: '#1E1E22',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <Box
                      key={day}
                      sx={{
                        py: 1,
                        textAlign: 'center',
                        borderRight: day !== 'Sat' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'rgba(255,255,255,0.5)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {day}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Calendar Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    flex: 1,
                  }}
                >
                  {getMonthDates.map((date, idx) => {
                    const posts = getPostsForDate(date);
                    const inCurrentMonth = isCurrentMonth(date);
                    const todayDate = isToday(date);

                    return (
                      <Box
                        key={idx}
                        sx={{
                          minHeight: { xs: 80, sm: 100 },
                          borderRight: (idx + 1) % 7 !== 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.08)',
                          background: todayDate
                            ? 'rgba(0,122,255,0.1)'
                            : inCurrentMonth
                            ? '#1C1C20'
                            : '#141418',
                          p: 0.5,
                          overflow: 'hidden',
                        }}
                      >
                        {/* Date Number */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.85rem',
                              fontWeight: todayDate ? 700 : 500,
                              color: todayDate
                                ? '#fff'
                                : inCurrentMonth
                                ? '#fff'
                                : 'rgba(255,255,255,0.3)',
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: todayDate ? '#007AFF' : 'transparent',
                            }}
                          >
                            {date.getDate()}
                          </Typography>
                        </Box>

                        {/* Posts for this date */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                          {posts.slice(0, 3).map((post) => {
                            const statusStyle = getStatusStyle(post.status);
                            const isHighlighted = highlightedPostId === post.scheduleId;
                            return (
                              <Box
                                key={post.scheduleId}
                                ref={(el: HTMLDivElement | null) => {
                                  if (el) postRefs.current.set(post.scheduleId, el);
                                }}
                                onClick={() => handlePostClick(post)}
                                sx={{
                                  background: isHighlighted ? 'rgba(0, 122, 255, 0.2)' : statusStyle.bg,
                                  borderLeft: `2px solid ${statusStyle.border}`,
                                  borderRadius: '4px',
                                  px: 0.5,
                                  py: 0.25,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  animation: isHighlighted ? 'pulse 1s ease-in-out 3' : 'none',
                                  '&:hover': {
                                    filter: 'brightness(0.95)',
                                    transform: 'scale(1.02)',
                                  },
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                  {post.status === 'published' && <CheckCircleIcon sx={{ fontSize: 8, color: '#22C55E' }} />}
                                  {post.status === 'partial' && <WarningIcon sx={{ fontSize: 8, color: '#EAB308' }} />}
                                  {post.status === 'failed' && <ErrorIcon sx={{ fontSize: 8, color: '#EF4444' }} />}
                                  {post.status === 'publishing' && <HourglassIcon sx={{ fontSize: 8, color: '#F97316' }} />}
                                  {post.status === 'scheduled' && <ScheduleIcon sx={{ fontSize: 8, color: '#007AFF' }} />}
                                  <Typography
                                    sx={{
                                      fontSize: '0.55rem',
                                      fontWeight: 600,
                                      color: statusStyle.text,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {new Date(post.scheduledTime).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                    })}{' '}
                                    {post.title || 'Untitled'}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })}
                          {posts.length > 3 && (
                            <Typography
                              sx={{
                                fontSize: '0.55rem',
                                color: '#007AFF',
                                fontWeight: 600,
                                textAlign: 'center',
                              }}
                            >
                              +{posts.length - 3} more
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>
      </Box>

      {/* Cancel Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => !cancelling && setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxWidth: 400,
            bgcolor: '#1E1E22',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#fff' }}>Cancel Scheduled Post?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
            This will cancel the scheduled upload. The video will remain in your library.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={cancelling}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                bgcolor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            Keep Scheduled
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            disabled={cancelling}
            sx={{
              borderRadius: '10px',
              bgcolor: '#007AFF',
              color: '#fff',
              '&:hover': {
                bgcolor: '#0066DD',
              },
            }}
          >
            {cancelling ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Cancel Post'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Scheduled Post Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            overflow: 'hidden',
            bgcolor: '#1E1E22',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        {selectedPost && (
          <>
            {/* Header */}
            <Box sx={{ p: 3, pb: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {/* Status badge */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '20px',
                      bgcolor: selectedPost.status === 'scheduled' ? 'rgba(0,122,255,0.1)'
                        : selectedPost.status === 'published' ? 'rgba(34,197,94,0.1)'
                        : selectedPost.status === 'partial' ? 'rgba(234,179,8,0.1)'
                        : selectedPost.status === 'failed' ? 'rgba(239,68,68,0.1)'
                        : selectedPost.status === 'publishing' ? 'rgba(249,115,22,0.1)'
                        : 'rgba(156,163,175,0.1)',
                      color: selectedPost.status === 'scheduled' ? '#007AFF'
                        : selectedPost.status === 'published' ? '#22C55E'
                        : selectedPost.status === 'partial' ? '#EAB308'
                        : selectedPost.status === 'failed' ? '#EF4444'
                        : selectedPost.status === 'publishing' ? '#F97316'
                        : '#9CA3AF',
                    }}
                  >
                    {selectedPost.status === 'scheduled' && <ScheduleIcon sx={{ fontSize: 16 }} />}
                    {selectedPost.status === 'published' && <CheckCircleIcon sx={{ fontSize: 16 }} />}
                    {selectedPost.status === 'partial' && <WarningIcon sx={{ fontSize: 16 }} />}
                    {selectedPost.status === 'failed' && <ErrorIcon sx={{ fontSize: 16 }} />}
                    {selectedPost.status === 'publishing' && <HourglassIcon sx={{ fontSize: 16 }} />}
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                      {selectedPost.status}
                    </Typography>
                  </Box>
                </Box>
                {/* Close button */}
                <IconButton
                  onClick={() => setDetailsDialogOpen(false)}
                  size="small"
                  sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Title */}
              <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#fff', mb: 1 }}>
                {selectedPost.title || 'Untitled'}
              </Typography>

              {/* Scheduled time */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <ScheduleIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                  {new Date(selectedPost.scheduledTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Typography>
              </Box>
            </Box>

            <DialogContent sx={{ p: 3, pt: 0 }}>
              {/* Thumbnail & Platforms Row */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {/* Thumbnail - 16:9 for landscape, 9:16 for portrait */}
                {selectedPost.thumbnailUrl && (
                  <Box
                    component="img"
                    src={selectedPost.thumbnailUrl}
                    alt="Thumbnail"
                    sx={{
                      width: selectedPost.aspectRatio === 'landscape' ? 160 : 90,
                      height: selectedPost.aspectRatio === 'landscape' ? 90 : 160,
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '1px solid rgba(255,255,255,0.1)',
                      flexShrink: 0,
                    }}
                  />
                )}
                {/* Platforms */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                    Platforms
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedPost.platforms.map((p, i) => (
                      <Chip
                        key={i}
                        icon={
                          p.platform.toLowerCase() === 'youtube' ? <YouTubeIcon sx={{ fontSize: 16 }} /> :
                          p.platform.toLowerCase() === 'instagram' ? <InstagramIcon sx={{ fontSize: 16 }} /> :
                          p.platform.toLowerCase() === 'tiktok' ? <TikTokIcon sx={{ width: 16, height: 16 }} /> :
                          p.platform.toLowerCase() === 'facebook' ? <FacebookIcon sx={{ fontSize: 16 }} /> :
                          p.platform.toLowerCase() === 'linkedin' ? <LinkedInIcon sx={{ fontSize: 16 }} /> :
                          undefined
                        }
                        label={p.accountName || p.platform}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': {
                            color: p.platform.toLowerCase() === 'youtube' ? '#FF0000' :
                              p.platform.toLowerCase() === 'instagram' ? '#E4405F' :
                              p.platform.toLowerCase() === 'facebook' ? '#1877F2' :
                              p.platform.toLowerCase() === 'linkedin' ? '#0A66C2' :
                              '#fff',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Hook */}
              {selectedPost.hook && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                    Hook
                  </Typography>
                  <Box sx={{
                    p: 1.5,
                    borderRadius: '8px',
                    bgcolor: 'rgba(0,122,255,0.1)',
                    borderLeft: '3px solid #007AFF'
                  }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      "{selectedPost.hook}"
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Description */}
              {selectedPost.description && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                    Description
                  </Typography>
                  <Typography sx={{ color: '#fff', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {selectedPost.description}
                  </Typography>
                </Box>
              )}

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedPost.tags.map((tag, i) => (
                      <Chip
                        key={i}
                        label={`#${tag}`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Video Footer */}
              {selectedPost.videoFooter && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                    Video Footer
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.8)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5,
                    }}
                  >
                    {selectedPost.videoFooter}
                  </Typography>
                </Box>
              )}

              {/* Upload Results (for published/failed posts) */}
              {selectedPost.uploadResults && selectedPost.uploadResults.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                    Upload Results
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {selectedPost.uploadResults.map((result, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          borderRadius: '8px',
                          bgcolor: result.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        }}
                      >
                        {result.success ? (
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#22C55E' }} />
                        ) : (
                          <ErrorIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                        )}
                        <Typography sx={{ fontWeight: 500, textTransform: 'capitalize', flex: 1, color: '#fff' }}>
                          {result.platform}
                        </Typography>
                        {!result.success && (
                          <Typography sx={{ fontSize: '0.75rem', color: '#EF4444' }}>
                            Oops, something went wrong
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
              {/* Cancel button - only for scheduled posts */}
              {selectedPost.status === 'scheduled' && (
                <Button
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleCancelClick(selectedPost);
                  }}
                  variant="outlined"
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  Cancel Post
                </Button>
              )}
              <Box sx={{ flex: 1 }} />
              {/* View Video button */}
              <Button
                onClick={() => {
                  setDetailsDialogOpen(false);
                  navigate(`/video/${selectedPost.videoId}`);
                }}
                variant="contained"
                sx={{
                  bgcolor: '#007AFF',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#0066DD' },
                }}
              >
                View Video
              </Button>
              {/* Close button - only for completed or failed posts */}
              {(selectedPost.status === 'published' || selectedPost.status === 'failed') && (
                <Button
                  onClick={() => setDetailsDialogOpen(false)}
                  variant="outlined"
                  sx={{
                    ml: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.7)',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.3)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  Close
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ScheduledContentPage;
