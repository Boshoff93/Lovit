import React, { useEffect, useState, useMemo } from 'react';
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
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  CalendarMonth as CalendarMonthIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  VideoLibrary as VideoLibraryIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  scheduledPostsApi,
  ScheduledPost,
} from '../services/api';

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
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [postToCancel, setPostToCancel] = useState<ScheduledPost | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Load scheduled posts
  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = async () => {
    try {
      setLoading(true);
      const response = await scheduledPostsApi.getScheduledPosts();
      setScheduledPosts(response.data.scheduledPosts || []);
    } catch (error) {
      console.error('Failed to load scheduled posts:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Get posts for a specific date (for month view)
  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledTime);
      return postDate.toDateString() === date.toDateString() && post.status === 'scheduled';
    });
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

  // Get posts for a specific date and hour
  const getPostsForSlot = (date: Date, hour: number) => {
    return scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledTime);
      return postDate.toDateString() === date.toDateString() && postDate.getHours() === hour && post.status === 'scheduled';
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
      setScheduledPosts(posts =>
        posts.map(p =>
          p.scheduleId === postToCancel.scheduleId
            ? { ...p, status: 'cancelled' as const }
            : p
        )
      );
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
      <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }, background: 'transparent' }}>
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
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                Content Calendar
              </Typography>
              <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
                Schedule and manage your video posts
              </Typography>
            </Box>
          </Box>

          {/* View My Videos button - Full on large, icon on small */}
          <Button
            variant="contained"
            onClick={() => navigate('/my-videos')}
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
            View My Videos
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
            <VideoLibraryIcon sx={{ fontSize: 22 }} />
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
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          background: '#fff',
          borderRadius: '16px 16px 0 0',
          gap: 1,
        }}
      >
        {/* Left - Date Range with Arrows */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 0.5 }}>
          <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: { xs: '0.8rem', sm: '0.9rem' }, display: { xs: 'block', sm: 'none' } }}>
            {getDateRangeText()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => navigateDate('prev')}
              sx={{
                p: 0.5,
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: '4px',
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
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: '4px',
                '&:hover': { borderColor: '#007AFF', color: '#007AFF' },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.9rem', ml: 0.5, display: { xs: 'none', sm: 'block' } }}>
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
              borderColor: 'rgba(0,0,0,0.15)',
              color: '#1D1D1F',
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
                  borderColor: viewMode === mode ? '#007AFF' : 'rgba(0,0,0,0.15)',
                  color: viewMode === mode ? '#fff' : '#1D1D1F',
                  '&:hover': {
                    bgcolor: viewMode === mode ? '#0066DD' : 'rgba(0,122,255,0.04)',
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

      {/* Main Content - Calendar fills remaining space */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', minWidth: 0 }}>

        {/* Calendar Grid */}
        <Box sx={{ flex: 1, background: '#FAFAFA', borderRadius: '0 0 16px 16px', position: 'relative', minHeight: 400, minWidth: { xs: 'auto', sm: 700 }, overflow: 'auto' }}>
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
                background: 'rgba(250, 250, 250, 0.8)',
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
                    background: 'rgba(255,255,255,0.98)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
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
                      background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(90,200,250,0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <ScheduleIcon sx={{ fontSize: 32, color: '#007AFF' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
                    No Scheduled Posts
                  </Typography>
                  <Typography sx={{ color: '#86868B', mb: 3, maxWidth: 280, fontSize: '0.9rem' }}>
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
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                  background: '#fff',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}
              >
                <Box sx={{ borderRight: '1px solid rgba(0,0,0,0.08)' }} />
                {getWeekDates.map((date, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      py: 1,
                      textAlign: 'center',
                      borderRight: idx < 6 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                      background: isToday(date) ? 'rgba(0,122,255,0.04)' : 'transparent',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: isToday(date) ? '#007AFF' : '#1D1D1F',
                        lineHeight: 1,
                      }}
                    >
                      {date.getDate()}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        color: isToday(date) ? '#007AFF' : '#86868B',
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
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        pr: 0.75,
                        pt: 0.25,
                        borderRight: '1px solid rgba(0,0,0,0.08)',
                        background: '#fff',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.7rem', color: '#86868B' }}>
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
                            borderRight: dayIdx < 6 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                            background: isToday(date) ? 'rgba(0,122,255,0.02)' : 'transparent',
                            p: 0.25,
                            minHeight: 50,
                            position: 'relative',
                          }}
                        >
                          {posts.map((post) => (
                            <Box
                              key={post.scheduleId}
                              sx={{
                                background: 'rgba(0,122,255,0.1)',
                                borderLeft: '3px solid #007AFF',
                                borderRadius: '4px',
                                p: 0.5,
                                mb: 0.25,
                                cursor: 'pointer',
                                position: 'relative',
                                '&:hover': { background: 'rgba(0,122,255,0.15)' },
                                '&:hover .delete-btn': { opacity: 1 },
                              }}
                              onClick={() => navigate(`/video/${post.videoId}`)}
                            >
                              <Typography
                                sx={{
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  color: '#1D1D1F',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  pr: 2,
                                }}
                              >
                                {post.title || 'Untitled'}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.25, mt: 0.25 }}>
                                {post.platforms.slice(0, 3).map((p, i) => (
                                  <Box key={i} sx={{ width: 12, height: 12 }}>
                                    {p.platform.toLowerCase() === 'youtube' && <YouTubeIcon sx={{ fontSize: 10, color: '#FF0000' }} />}
                                    {p.platform.toLowerCase() === 'instagram' && <InstagramIcon sx={{ fontSize: 10, color: '#E4405F' }} />}
                                    {p.platform.toLowerCase() === 'tiktok' && <TikTokIcon sx={{ '& svg': { width: 10, height: 10 } }} />}
                                    {p.platform.toLowerCase() === 'facebook' && <FacebookIcon sx={{ fontSize: 10, color: '#1877F2' }} />}
                                    {p.platform.toLowerCase() === 'linkedin' && <LinkedInIcon sx={{ fontSize: 10, color: '#0A66C2' }} />}
                                  </Box>
                                ))}
                              </Box>
                              <IconButton
                                className="delete-btn"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelClick(post);
                                }}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  p: 0.25,
                                  color: '#FF3B30',
                                  opacity: 0,
                                  transition: 'opacity 0.2s',
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 12 }} />
                              </IconButton>
                            </Box>
                          ))}
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
                        borderBottom: '1px solid rgba(0,0,0,0.04)',
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
                          borderRight: '1px solid rgba(0,0,0,0.08)',
                          background: '#fff',
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>
                          {time}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, p: 0.5 }}>
                        {posts.map((post) => (
                          <Box
                            key={post.scheduleId}
                            onClick={() => navigate(`/video/${post.videoId}`)}
                            sx={{
                              background: 'rgba(0,122,255,0.1)',
                              borderLeft: '3px solid #007AFF',
                              borderRadius: '4px',
                              p: 1,
                              cursor: 'pointer',
                              '&:hover': { background: 'rgba(0,122,255,0.15)' },
                            }}
                          >
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                              {post.title || 'Untitled'}
                            </Typography>
                          </Box>
                        ))}
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
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    background: '#fff',
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
                        borderRight: day !== 'Sat' ? '1px solid rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#86868B',
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
                          borderRight: (idx + 1) % 7 !== 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                          borderBottom: '1px solid rgba(0,0,0,0.08)',
                          background: todayDate
                            ? 'rgba(0,122,255,0.04)'
                            : inCurrentMonth
                            ? '#fff'
                            : '#FAFAFA',
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
                                ? '#1D1D1F'
                                : '#C7C7CC',
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
                          {posts.slice(0, 3).map((post) => (
                            <Box
                              key={post.scheduleId}
                              onClick={() => navigate(`/video/${post.videoId}`)}
                              sx={{
                                background: 'rgba(0,122,255,0.1)',
                                borderLeft: '2px solid #007AFF',
                                borderRadius: '3px',
                                px: 0.5,
                                py: 0.25,
                                cursor: 'pointer',
                                '&:hover': { background: 'rgba(0,122,255,0.2)' },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '0.6rem',
                                  fontWeight: 600,
                                  color: '#1D1D1F',
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
                          ))}
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
        PaperProps={{ sx: { borderRadius: '16px', maxWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Cancel Scheduled Post?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#86868B' }}>
            This will cancel the scheduled upload. The video will remain in your library.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setCancelDialogOpen(false)}
            disabled={cancelling}
            sx={{ borderRadius: '10px' }}
          >
            Keep Scheduled
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            disabled={cancelling}
            sx={{ borderRadius: '10px' }}
          >
            {cancelling ? <CircularProgress size={20} /> : 'Cancel Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduledContentPage;
