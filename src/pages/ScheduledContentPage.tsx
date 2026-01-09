import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Cancel as CancelIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { scheduledPostsApi, ScheduledPost, videosApi } from '../services/api';

// TikTok icon component (not available in MUI icons)
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

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return <YouTubeIcon sx={{ color: '#FF0000' }} />;
    case 'tiktok':
      return <TikTokIcon sx={{ color: '#000' }} />;
    case 'instagram':
      return <InstagramIcon sx={{ color: '#E4405F' }} />;
    case 'facebook':
      return <FacebookIcon sx={{ color: '#1877F2' }} />;
    case 'linkedin':
      return <LinkedInIcon sx={{ color: '#0A66C2' }} />;
    default:
      return <ScheduleIcon sx={{ color: '#007AFF' }} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return { bg: 'rgba(0,122,255,0.1)', color: '#007AFF' };
    case 'publishing':
      return { bg: 'rgba(255,149,0,0.1)', color: '#FF9500' };
    case 'published':
      return { bg: 'rgba(52,199,89,0.1)', color: '#34C759' };
    case 'failed':
      return { bg: 'rgba(255,59,48,0.1)', color: '#FF3B30' };
    case 'cancelled':
      return { bg: 'rgba(142,142,147,0.1)', color: '#8E8E93' };
    default:
      return { bg: 'rgba(0,0,0,0.1)', color: '#000' };
  }
};

const getStatusIcon = (status: string): React.ReactElement | undefined => {
  switch (status) {
    case 'scheduled':
      return <ScheduleIcon sx={{ fontSize: 16 }} />;
    case 'publishing':
      return <CircularProgress size={14} />;
    case 'published':
      return <CheckCircleIcon sx={{ fontSize: 16 }} />;
    case 'failed':
      return <ErrorIcon sx={{ fontSize: 16 }} />;
    case 'cancelled':
      return <CancelIcon sx={{ fontSize: 16 }} />;
    default:
      return undefined;
  }
};

const ScheduledContentPage: React.FC = () => {
  const navigate = useNavigate();
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [postToCancel, setPostToCancel] = useState<ScheduledPost | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = async () => {
    try {
      setLoading(true);
      const response = await scheduledPostsApi.getScheduledPosts();
      const posts = response.data.scheduledPosts || [];
      setScheduledPosts(posts);

      // Load video thumbnails for each post
      const thumbnails: Record<string, string> = {};
      for (const post of posts) {
        if (post.thumbnailUrl) {
          thumbnails[post.videoId] = post.thumbnailUrl;
        } else {
          // Try to get from video data
          try {
            const videoResponse = await videosApi.getVideo(post.userId, post.videoId);
            if (videoResponse.data?.thumbnailUrl) {
              thumbnails[post.videoId] = videoResponse.data.thumbnailUrl;
            }
          } catch (e) {
            // Ignore thumbnail fetch errors
          }
        }
      }
      setVideoThumbnails(thumbnails);
    } catch (error) {
      console.error('Failed to load scheduled posts:', error);
    } finally {
      setLoading(false);
    }
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
      // Update local state
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

  const formatScheduledTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isPastDue = (scheduledTime: string, status: string) => {
    if (status !== 'scheduled') return false;
    return new Date(scheduledTime) < new Date();
  };

  // Sort posts: scheduled first (by time), then others
  const sortedPosts = [...scheduledPosts].sort((a, b) => {
    if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
    if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
    return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
  });

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <Box sx={{
      py: 4,
      px: { xs: 2, sm: 3, md: 4 },
      width: '100%',
      maxWidth: '100%',
    }}>
        {/* Page Title */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/gruvi/gruvi-schedule.png"
            alt="Scheduled Content"
            sx={{
              height: 64,
              width: 'auto',
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
              Scheduled Content
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PublicIcon sx={{ fontSize: 14, color: '#86868B' }} />
              <Typography sx={{ color: '#86868B' }}>
                Times shown in {userTimezone}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Card Container */}
        <Card
          sx={{
            width: '100%',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none',
            background: '#fff',
            overflow: 'hidden',
          }}
        >
          {/* Content area */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#007AFF' }} />
            </Box>
          ) : scheduledPosts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 }, px: 3 }}>
              {/* Icon with gradient background */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(90,200,250,0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <ScheduleIcon sx={{ fontSize: 40, color: '#007AFF' }} />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
                No Scheduled Content
              </Typography>
              <Typography sx={{ color: '#86868B', mb: 4, maxWidth: 300, mx: 'auto', lineHeight: 1.6 }}>
                Schedule your videos to post automatically at the perfect time for your audience
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/my-videos')}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                  boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                    boxShadow: '0 6px 16px rgba(0,122,255,0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Go to My Videos
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sortedPosts.map((post) => {
              const statusColors = getStatusColor(post.status);
              const pastDue = isPastDue(post.scheduledTime, post.status);

              return (
                <Card
                  key={post.scheduleId}
                  sx={{
                    borderRadius: '16px',
                    boxShadow: 'none',
                    border: `1px solid ${pastDue ? 'rgba(255,59,48,0.3)' : 'rgba(0,0,0,0.08)'}`,
                    overflow: 'hidden',
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
                      {/* Thumbnail */}
                      <Box
                        sx={{
                          width: 80,
                          height: 120,
                          borderRadius: '8px',
                          bgcolor: '#E5E5EA',
                          backgroundImage: videoThumbnails[post.videoId]
                            ? `url(${videoThumbnails[post.videoId]})`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          flexShrink: 0,
                        }}
                      />

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Title */}
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: '#1D1D1F',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {post.title || 'Untitled Video'}
                        </Typography>

                        {/* Scheduled time */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 14, color: pastDue ? '#FF3B30' : '#86868B' }} />
                          <Typography
                            variant="body2"
                            sx={{ color: pastDue ? '#FF3B30' : '#86868B' }}
                          >
                            {formatScheduledTime(post.scheduledTime)}
                          </Typography>
                        </Box>

                        {/* Platforms */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          {post.platforms.map((platform, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                bgcolor: 'rgba(0,0,0,0.04)',
                                px: 1,
                                py: 0.25,
                                borderRadius: '6px',
                              }}
                            >
                              {getPlatformIcon(platform.platform)}
                              <Typography variant="caption" sx={{ color: '#1D1D1F' }}>
                                {platform.accountName || platform.platform}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        {/* Status chip */}
                        <Chip
                          icon={getStatusIcon(post.status)}
                          label={post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            fontWeight: 500,
                            '& .MuiChip-icon': {
                              color: statusColors.color,
                            },
                          }}
                        />
                      </Box>

                      {/* Actions */}
                      {post.status === 'scheduled' && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <IconButton
                            onClick={() => handleCancelClick(post)}
                            sx={{
                              color: '#FF3B30',
                              '&:hover': {
                                bgcolor: 'rgba(255,59,48,0.1)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
            </Box>
          )}
        </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => !cancelling && setCancelDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px', maxWidth: 400 },
        }}
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
