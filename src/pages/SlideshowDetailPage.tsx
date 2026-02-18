import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Paper,
  Button,
  TextField,
  Alert,
  Tooltip,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';
import {
  Delete,
  CheckCircle,
  Error as ErrorIcon,
  Schedule,
  ChevronLeft,
  ChevronRight,
  Download,
  CloudUpload,
  Share,
  Add,
  Check,
  InfoOutlined,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { useGetSlideshowQuery, useGetSocialAccountsQuery, useDeleteSlideshowMutation, apiSlice } from '../store/apiSlice';
import { slideshowsApi, tiktokApi } from '../services/api';
import { useLayout } from '../components/Layout';
import { GhostButton } from '../components/GhostButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const SlideshowDetailPage: React.FC = () => {
  const { slideshowId } = useParams<{ slideshowId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { setCurrentViewingItem } = useLayout();
  const socialSectionRef = useRef<HTMLDivElement>(null);

  // RTK Query with polling for generating status
  const { data, isLoading, error: fetchError } = useGetSlideshowQuery(slideshowId || '', {
    skip: !slideshowId,
    pollingInterval: undefined,
  });
  const slideshow = data?.slideshow;

  // Poll while generating
  const [pollingEnabled, setPollingEnabled] = useState(false);
  const { data: pollingData } = useGetSlideshowQuery(slideshowId || '', {
    skip: !slideshowId || !pollingEnabled,
    pollingInterval: 3000,
  });

  useEffect(() => {
    const current = pollingData?.slideshow || slideshow;
    if (current?.status === 'generating') {
      setPollingEnabled(true);
    } else {
      setPollingEnabled(false);
    }
  }, [slideshow?.status, pollingData?.slideshow?.status]);

  const currentSlideshow = pollingData?.slideshow || slideshow;

  // Social accounts
  const { data: socialAccountsData } = useGetSocialAccountsQuery(
    { userId: user?.userId || '' },
    { skip: !user?.userId }
  );
  const socialAccounts = socialAccountsData?.accounts || [];
  const slideshowAccounts = useMemo(() =>
    socialAccounts.filter(a => a.platform === 'tiktok' || a.platform === 'instagram'),
    [socialAccounts]
  );

  const [deleteSlideshow] = useDeleteSlideshowMutation();

  // UI state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Metadata editing
  const [editCaption, setEditCaption] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Social posting state
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set());
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [uploadMode, setUploadMode] = useState<'now' | 'schedule'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState<Dayjs | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({});
  const [socialError, setSocialError] = useState<string | null>(null);
  const [socialSuccess, setSocialSuccess] = useState<string | null>(null);

  // TikTok settings
  const [tiktokCreatorInfo, setTiktokCreatorInfo] = useState<any>(null);
  const [tiktokPrivacyLevel, setTiktokPrivacyLevel] = useState('');
  const [tiktokPostMode, setTiktokPostMode] = useState<'draft' | 'direct'>('direct');
  const [tiktokAllowComment, setTiktokAllowComment] = useState(false);
  const [tiktokAllowDuet, setTiktokAllowDuet] = useState(false);
  const [tiktokAllowStitch, setTiktokAllowStitch] = useState(false);
  const [tiktokDiscloseContent, setTiktokDiscloseContent] = useState(false);
  const [tiktokBrandOrganic, setTiktokBrandOrganic] = useState(false);
  const [tiktokBrandedContent, setTiktokBrandedContent] = useState(false);

  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pre-populate post caption from slide captions (NOT the generation prompt)
  useEffect(() => {
    if (currentSlideshow) {
      const captionText = (currentSlideshow.captions || []).filter(Boolean).join('\n');
      setEditCaption(captionText);
      setEditTags(currentSlideshow.hashtags || []);
    }
  }, [currentSlideshow?.slideshowId, currentSlideshow?.status]);

  // Set current viewing item for sidebar
  useEffect(() => {
    if (currentSlideshow && slideshowId) {
      setCurrentViewingItem({
        type: 'slideshow',
        title: currentSlideshow.title || 'Slideshow',
        path: `/slideshow/${slideshowId}`,
      });
    }
    return () => setCurrentViewingItem(null);
  }, [currentSlideshow?.title, slideshowId, setCurrentViewingItem]);

  // Handle scroll to social section from query param
  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo === 'social' && currentSlideshow && !isLoading) {
      const scrollTimer = setTimeout(() => {
        const element = socialSectionRef.current;
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementPosition - 100, behavior: 'smooth' });
        }
      }, 800);
      return () => clearTimeout(scrollTimer);
    }
  }, [searchParams, currentSlideshow, isLoading]);

  const selectedAccounts = useMemo(() =>
    slideshowAccounts.filter(a => selectedAccountIds.has(a.accountId)),
    [slideshowAccounts, selectedAccountIds]
  );
  const hasTikTok = selectedAccounts.some(a => a.platform === 'tiktok');
  const instagramDisabled = (currentSlideshow?.imageUrls?.length || 0) > 10;

  useEffect(() => {
    if (hasTikTok && user?.userId && !tiktokCreatorInfo) {
      tiktokApi.getCreatorInfo(user.userId)
        .then(res => setTiktokCreatorInfo(res.data))
        .catch(() => {});
    }
  }, [hasTikTok, user?.userId]);

  const handleAccountToggle = (accountId: string, platform: string) => {
    if (platform === 'instagram' && instagramDisabled) return;
    setSelectedAccountIds(prev => {
      const next = new Set(prev);
      if (next.has(accountId)) {
        next.delete(accountId);
      } else {
        next.add(accountId);
      }
      return next;
    });
  };

  const handlePublish = async () => {
    if (!currentSlideshow || selectedAccountIds.size === 0) return;

    const tiktokAccount = selectedAccounts.find(a => a.platform === 'tiktok');
    if (!tiktokAccount) {
      setSocialError('Please select a TikTok account');
      return;
    }

    const hashtagString = editTags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
    const fullCaption = `${editCaption}\n\n${hashtagString}`.trim();

    const tiktokSettings = {
      privacyLevel: tiktokPrivacyLevel || 'SELF_ONLY',
      postMode: tiktokPostMode,
      disableComment: !tiktokAllowComment,
      disableDuet: !tiktokAllowDuet,
      disableStitch: !tiktokAllowStitch,
    };

    if (uploadMode === 'schedule') {
      if (!scheduledDateTime || scheduledDateTime.isBefore(dayjs())) {
        setSocialError('Please select a future date and time');
        return;
      }
      setIsScheduling(true);
      try {
        await slideshowsApi.scheduleSlideshow(currentSlideshow.slideshowId, {
          scheduledTime: scheduledDateTime.toISOString(),
          accountId: tiktokAccount.accountId,
          title: fullCaption,
          description: '',
          tiktokSettings,
        });
        setSocialSuccess('Slideshow scheduled successfully');
        setShowUploadConfirm(false);
        dispatch(apiSlice.util.invalidateTags(['ScheduledPosts']));
      } catch (err: any) {
        setSocialError(err.response?.data?.error || 'Failed to schedule');
      } finally {
        setIsScheduling(false);
      }
    } else {
      setIsUploading(true);
      setUploadProgress({ [tiktokAccount.accountId]: 'uploading' });
      try {
        await slideshowsApi.uploadSlideshow(currentSlideshow.slideshowId, {
          accountId: tiktokAccount.accountId,
          title: fullCaption,
          description: '',
          tiktokSettings,
        });
        setUploadProgress({ [tiktokAccount.accountId]: 'success' });
        setSocialSuccess('Slideshow uploaded to TikTok');
        setShowUploadConfirm(false);
      } catch (err: any) {
        setUploadProgress({ [tiktokAccount.accountId]: 'error' });
        setSocialError(err.response?.data?.error || 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!slideshowId) return;
    setIsDeleting(true);
    try {
      await deleteSlideshow(slideshowId).unwrap();
      navigate('/my-slideshows');
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (imageUrls.length === 0 || isDownloading) return;
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const fetches = imageUrls.map(async (url: string, i: number) => {
        const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
        const blob = await res.blob();
        zip.file(`slide-${i + 1}.jpg`, blob);
      });
      await Promise.all(fetches);
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${currentSlideshow?.title || 'slideshow'}-slides.zip`);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const imageUrls = currentSlideshow?.imageUrls || [];
  const totalSlides = imageUrls.length;

  const prevSlide = useCallback(() => setCurrentSlide(s => Math.max(0, s - 1)), []);
  const nextSlide = useCallback(() => setCurrentSlide(s => Math.min(totalSlides - 1, s + 1)), [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#007AFF' }} />
      </Box>
    );
  }

  if (fetchError || !currentSlideshow) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: '#FF3B30' }}>Slideshow not found</Typography>
        <Button onClick={() => navigate('/my-slideshows')} sx={{ mt: 2, textTransform: 'none', color: '#007AFF' }}>
          Back to My Slideshows
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Generating State */}
      {currentSlideshow.status === 'generating' && (
        <Paper sx={{ p: 4, borderRadius: '20px', textAlign: 'center', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
          <CircularProgress size={48} sx={{ color: '#007AFF', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>Generating your slideshow...</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            This usually takes 1-3 minutes. The page will update automatically.
          </Typography>
        </Paper>
      )}

      {/* Failed State */}
      {currentSlideshow.status === 'failed' && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          Generation failed: {currentSlideshow.errorMessage || 'Unknown error'}
        </Alert>
      )}

      {/* Main layout: slide viewer + info side-by-side for portrait slides */}
      {totalSlides > 0 && (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
          gap: { xs: 2, sm: 3 },
          mb: 3,
        }}>
          {/* Slide Viewer - portrait card style */}
          <Box sx={{
            width: { xs: '100%', md: 280 },
            maxWidth: { xs: 280, md: 280 },
            mx: { xs: 'auto', md: 0 },
          }}>
            <Box sx={{
              position: 'relative',
              aspectRatio: currentSlideshow.aspectRatio === '4:5' ? '4/5' : '9/16',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#000',
              border: '2px solid #10B981',
            }}>
              <Box
                component="img"
                src={imageUrls[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
              {/* Left arrow */}
              {currentSlide > 0 && (
                <IconButton
                  onClick={prevSlide}
                  sx={{
                    position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff',
                    width: 32, height: 32,
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <ChevronLeft sx={{ fontSize: 20 }} />
                </IconButton>
              )}
              {/* Right arrow */}
              {currentSlide < totalSlides - 1 && (
                <IconButton
                  onClick={nextSlide}
                  sx={{
                    position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff',
                    width: 32, height: 32,
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <ChevronRight sx={{ fontSize: 20 }} />
                </IconButton>
              )}
              {/* Bottom gradient overlay with dots + caption */}
              <Box sx={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                px: 1.5, pb: 1.5, pt: 4,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75,
              }}>
                {/* Caption */}
                {currentSlideshow.captions?.[currentSlide] && (
                  <Typography variant="body2" sx={{
                    color: 'rgba(255,255,255,0.85)', fontStyle: 'italic',
                    textAlign: 'center', fontSize: '0.75rem', lineHeight: 1.4,
                    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    "{currentSlideshow.captions[currentSlide]}"
                  </Typography>
                )}
                {/* Dot indicators */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  {imageUrls.map((_: string, i: number) => (
                    <Box
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      sx={{
                        width: i === currentSlide ? 16 : 5, height: 5, borderRadius: 3,
                        backgroundColor: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        boxShadow: i === currentSlide ? '0 0 6px rgba(255,255,255,0.5)' : 'none',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Info panel - right side, content at bottom */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 1, minHeight: { md: 0 } }}>
            {/* Status chip */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={currentSlideshow.aspectRatio === '4:5' ? '4:5' : '9:16'}
                size="small"
                sx={{ height: 22, fontSize: '0.7rem', background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}
              />
              <Chip
                label={currentSlideshow.status}
                size="small"
                sx={{
                  height: 22, fontSize: '0.7rem', fontWeight: 600,
                  backgroundColor: currentSlideshow.status === 'ready' ? 'rgba(34,197,94,0.15)' : currentSlideshow.status === 'failed' ? 'rgba(255,59,48,0.15)' : 'rgba(0,122,255,0.15)',
                  color: currentSlideshow.status === 'ready' ? '#22C55E' : currentSlideshow.status === 'failed' ? '#FF3B30' : '#007AFF',
                  border: `1px solid ${currentSlideshow.status === 'ready' ? 'rgba(34,197,94,0.3)' : currentSlideshow.status === 'failed' ? 'rgba(255,59,48,0.3)' : 'rgba(0,122,255,0.3)'}`,
                }}
              />
            </Box>

            {/* Title */}
            <Typography sx={{
              fontWeight: 800,
              color: '#fff',
              fontSize: { xs: '1.1rem', sm: '1.5rem' },
              lineHeight: 1.2,
              mb: 0.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {currentSlideshow.title || 'Slideshow'}
            </Typography>

            {/* Metadata line */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {totalSlides} slides
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>•</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {currentSlideshow.aspectRatio === '4:5' ? '4:5' : '9:16'}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>•</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {formatDate(currentSlideshow.createdAt)}
              </Typography>
            </Box>

            {/* Action Buttons - Post, Download, Delete (matching video page) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 1, md: 0 } }}>
              {/* Post Button */}
              <IconButton
                onClick={() => {
                  const element = socialSectionRef.current;
                  if (element) {
                    const pos = element.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top: pos - 100, behavior: 'smooth' });
                  }
                }}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  bgcolor: '#007AFF', color: '#fff',
                  width: 36, height: 36,
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': { bgcolor: '#0066CC' },
                }}
              >
                <CloudUpload sx={{ fontSize: 18 }} />
              </IconButton>
              <Button
                onClick={() => {
                  const element = socialSectionRef.current;
                  if (element) {
                    const pos = element.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top: pos - 100, behavior: 'smooth' });
                  }
                }}
                variant="contained"
                startIcon={<CloudUpload sx={{ fontSize: 20 }} />}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  bgcolor: '#007AFF', color: '#fff',
                  borderRadius: '10px', px: 2, py: 0.75,
                  textTransform: 'none', fontWeight: 600, fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': { bgcolor: '#0066CC' },
                }}
              >
                Post
              </Button>

              {/* Download Button */}
              <IconButton
                onClick={handleDownloadAll}
                disabled={totalSlides === 0 || isDownloading}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  border: '1px solid #3B82F6', color: '#3B82F6',
                  width: 36, height: 36,
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#3B82F6', bgcolor: 'transparent', boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)' },
                  '&:disabled': { opacity: 0.4 },
                }}
              >
                {isDownloading ? <CircularProgress size={18} sx={{ color: '#3B82F6' }} /> : <Download sx={{ fontSize: 18 }} />}
              </IconButton>
              <GhostButton
                onClick={handleDownloadAll}
                disabled={totalSlides === 0 || isDownloading}
                startIcon={isDownloading ? <CircularProgress size={18} sx={{ color: '#3B82F6' }} /> : <Download sx={{ fontSize: 20 }} />}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  px: 2, py: 0.75, fontSize: '0.9rem',
                  '&:disabled': { opacity: 0.4 },
                }}
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </GhostButton>

              {/* Delete Button */}
              <IconButton
                onClick={() => setShowDeleteDialog(true)}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  border: '1px solid #FF3B30', color: '#FF3B30',
                  width: 36, height: 36,
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#FF3B30', bgcolor: 'transparent', boxShadow: '0 0 12px rgba(255, 59, 48, 0.4)' },
                }}
              >
                <Delete sx={{ fontSize: 18 }} />
              </IconButton>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="outlined"
                startIcon={<Delete sx={{ fontSize: 20, color: '#FF3B30' }} />}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  color: '#fff', borderColor: '#FF3B30',
                  borderRadius: '12px', px: 2, py: 0.75,
                  textTransform: 'none', fontWeight: 600, fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#FF3B30', bgcolor: 'transparent',
                    boxShadow: '0 0 12px rgba(255, 59, 48, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Social Sharing Section - matching video page layout */}
      {currentSlideshow.status === 'ready' && (
        <Box ref={socialSectionRef}>
          {/* Alerts */}
          {socialSuccess && (
            <Alert severity="success" onClose={() => setSocialSuccess(null)} sx={{ mb: 2, borderRadius: '12px' }}>
              {socialSuccess}
            </Alert>
          )}
          {socialError && (
            <Alert severity="error" onClose={() => setSocialError(null)} sx={{ mb: 2, borderRadius: '12px' }}>
              {socialError}
            </Alert>
          )}

          {/* Platform Selection - Schedule Post section */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              p: { xs: 2, sm: 2.5 },
              mb: 2,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Share sx={{ fontSize: 20, color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Schedule Post
                </Typography>
              </Box>
              {slideshowAccounts.length > 0 && (
                <Chip
                  label={selectedAccountIds.size > 0 ? 'Deselect All' : 'Select All'}
                  onClick={() => {
                    if (selectedAccountIds.size > 0) {
                      setSelectedAccountIds(new Set());
                    } else {
                      setSelectedAccountIds(new Set(slideshowAccounts.map(a => a.accountId)));
                    }
                  }}
                  size="small"
                  sx={{
                    bgcolor: selectedAccountIds.size > 0 ? '#007AFF' : 'transparent',
                    border: '1px solid #007AFF',
                    color: '#fff',
                    fontWeight: 500,
                    '&:hover': { bgcolor: selectedAccountIds.size > 0 ? '#0066DD' : 'rgba(0,122,255,0.1)' },
                  }}
                />
              )}
            </Box>

            {/* Social Account Grid - matching video player style */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {(() => {
                const platformConfig: Record<string, { color: string; gradient?: string; icon: React.ReactNode }> = {
                  tiktok: {
                    color: '#000000',
                    icon: (
                      <Box component="svg" viewBox="0 0 24 24" sx={{ width: 12, height: 12, fill: '#fff' }}>
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </Box>
                    ),
                  },
                  instagram: {
                    color: '#E4405F',
                    gradient: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                    icon: (
                      <Box component="svg" viewBox="0 0 24 24" sx={{ width: 12, height: 12, fill: '#fff' }}>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                      </Box>
                    ),
                  },
                };

                const platformOrder = ['tiktok', 'instagram'];
                const sortedAccounts = [...slideshowAccounts].sort((a, b) => {
                  return platformOrder.indexOf(a.platform) - platformOrder.indexOf(b.platform);
                });

                return sortedAccounts.map((account) => {
                  const isSelected = selectedAccountIds.has(account.accountId);
                  const isDisabled = account.platform === 'instagram' && instagramDisabled;
                  const config = platformConfig[account.platform] || { color: '#666', icon: null };
                  const displayName = account.username ? `@${account.username}` : account.accountName || account.platform;

                  return (
                    <Tooltip key={account.accountId} title={isDisabled ? `Instagram limits carousels to 10 images (this slideshow has ${totalSlides})` : ''}>
                      <Box
                        onClick={() => !isDisabled && handleAccountToggle(account.accountId, account.platform)}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0.75,
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.4 : 1,
                          transition: 'all 0.2s ease',
                          '&:hover': { transform: isDisabled ? 'none' : 'scale(1.02)' },
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          {/* Main circle - Avatar */}
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              border: isSelected ? '2.5px solid #34C759' : 'none',
                              background: account.avatarUrl ? 'transparent' : (config.gradient || config.color),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: isSelected ? '0 0 12px rgba(52,199,89,0.4)' : 'none',
                              overflow: 'hidden',
                            }}
                          >
                            {account.avatarUrl ? (
                              <Box
                                component="img"
                                src={account.avatarUrl}
                                alt={displayName}
                                onError={(e: any) => { e.target.style.display = 'none'; }}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : null}
                            <Box sx={{
                              transform: 'scale(1.5)',
                              display: account.avatarUrl ? 'none' : 'flex',
                              width: '100%', height: '100%',
                              alignItems: 'center', justifyContent: 'center',
                            }}>
                              {config.icon}
                            </Box>
                          </Box>
                          {isSelected && (
                            <Box sx={{
                              position: 'absolute', top: -4, right: -4,
                              width: 18, height: 18, borderRadius: '50%',
                              bgcolor: '#34C759',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Check sx={{ fontSize: 12, color: '#fff' }} />
                            </Box>
                          )}
                          {/* Platform badge */}
                          <Box sx={{
                            position: 'absolute', bottom: -6, right: -6,
                            width: 28, height: 28, borderRadius: '50%',
                            background: config.gradient || config.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid #1a1a2e',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          }}>
                            <Box sx={{ transform: 'scale(1.2)' }}>{config.icon}</Box>
                          </Box>
                        </Box>
                        <Typography sx={{
                          fontSize: '0.7rem', color: '#fff', textAlign: 'center',
                          maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {displayName}
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                });
              })()}

              {/* Add More Account Button */}
              <Box
                onClick={() => navigate('/settings/connected-accounts')}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
              >
                <Box sx={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: '2px dashed rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)' },
                }}>
                  <Add sx={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }} />
                </Box>
                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                  Add
                </Typography>
              </Box>
            </Box>

            {/* Divider between social accounts and post details */}
            <Box sx={{ my: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }} />

            {/* Caption Section */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#fff', fontSize: '1rem' }}>
              Title / Caption
            </Typography>
            <TextField
              fullWidth multiline rows={4} placeholder="Write your caption..." value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              size="small"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', lineHeight: 1.6,
                  '& fieldset': { borderColor: editCaption ? '#007AFF' : 'rgba(255,255,255,0.1)', borderWidth: editCaption ? '2px' : '1px' },
                  '&:hover fieldset': { borderColor: editCaption ? '#007AFF' : 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
                },
                '& .MuiInputBase-input': { '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 } },
              }}
              inputProps={{ maxLength: 2200 }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#fff' }}>Hashtags</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {editTags.map((tag, i) => (
                <Chip key={i} label={tag.startsWith('#') ? tag : `#${tag}`} size="small"
                  onDelete={() => setEditTags(prev => prev.filter((_, idx) => idx !== i))}
                  sx={{ borderRadius: '100px', bgcolor: 'transparent', border: '1.5px solid #007AFF', color: '#fff', fontWeight: 500, '& .MuiChip-deleteIcon': { color: '#007AFF' } }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField size="small" placeholder="Add a tag..." value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && newTag.trim()) { e.preventDefault(); setEditTags(prev => [...prev, newTag.trim().replace(/^#/, '')]); setNewTag(''); } }}
                sx={{
                  flex: 1,
                  maxWidth: 200,
                  '& .MuiOutlinedInput-root': { borderRadius: '16px', background: 'rgba(255,255,255,0.03)', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&.Mui-focused fieldset': { borderColor: '#007AFF' } },
                  '& .MuiInputBase-input': { '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 } },
                }}
              />
              <IconButton
                onClick={() => { if (newTag.trim()) { setEditTags(prev => [...prev, newTag.trim().replace(/^#/, '')]); setNewTag(''); } }}
                disabled={!newTag.trim()}
                size="small"
                sx={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,255,255,0.15)' } }}
              >
                <Add sx={{ color: '#fff' }} />
              </IconButton>
            </Box>

            {/* TikTok Settings */}
            {hasTikTok && (
              <>
                <Box sx={{ my: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }} />

                {/* TikTok Header with icon */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '2.5px solid #34C759',
                      background: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 12px rgba(52,199,89,0.4)',
                    }}
                  >
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 20, height: 20, fill: '#fff' }}>
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                      TikTok Settings
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#86868B' }}>
                      {(() => {
                        const tiktokAccount = selectedAccounts.find(a => a.platform === 'tiktok');
                        const username = tiktokAccount?.username;
                        return tiktokCreatorInfo?.creatorNickname && tiktokCreatorInfo.creatorNickname !== username
                          ? `@${username} (${tiktokCreatorInfo.creatorNickname})`
                          : username ? `@${username}` : 'Your TikTok account';
                      })()}
                    </Typography>
                  </Box>
                </Box>

                {/* Post Mode Selection */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                  Post Mode
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                  <Box
                    onClick={() => setTiktokPostMode('draft')}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      borderRadius: '10px',
                      border: tiktokPostMode === 'draft' ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                      bgcolor: tiktokPostMode === 'draft' ? 'rgba(0,122,255,0.08)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: tiktokPostMode === 'draft' ? '#007AFF' : 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                      Save as Draft
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                      Video appears in your TikTok inbox to review and post
                    </Typography>
                  </Box>
                  <Box
                    onClick={() => setTiktokPostMode('direct')}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      borderRadius: '10px',
                      border: tiktokPostMode === 'direct' ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                      bgcolor: tiktokPostMode === 'direct' ? 'rgba(0,122,255,0.08)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: tiktokPostMode === 'direct' ? '#007AFF' : 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                      Direct Post
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                      Post directly to your TikTok profile
                    </Typography>
                  </Box>
                </Box>

                {/* Privacy Level */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                  Who can view this video <Typography component="span" sx={{ color: '#FF3B30', fontWeight: 400 }}>*</Typography>
                </Typography>
                <Select
                  fullWidth
                  value={tiktokPrivacyLevel}
                  onChange={(e) => {
                    setTiktokPrivacyLevel(e.target.value);
                    if (e.target.value === 'SELF_ONLY' && tiktokBrandedContent) {
                      setTiktokBrandedContent(false);
                    }
                  }}
                  displayEmpty
                  sx={{
                    borderRadius: '12px',
                    mb: tiktokPrivacyLevel !== '' ? 2 : 1,
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    '& .MuiSelect-select': { py: 1.5, px: 2, display: 'flex', alignItems: 'center' },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: tiktokPrivacyLevel ? '#007AFF' : 'rgba(255,255,255,0.1)',
                      borderWidth: tiktokPrivacyLevel ? '2px' : '1px',
                    },
                    '&:hover': { background: 'rgba(255,255,255,0.08)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: tiktokPrivacyLevel ? '#007AFF' : 'rgba(255,255,255,0.1) !important',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF', borderWidth: '2px' },
                    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.6)' },
                  }}
                >
                  <MenuItem value="" disabled>
                    <Typography sx={{ color: '#86868B' }}>Select privacy level</Typography>
                  </MenuItem>
                  {(tiktokCreatorInfo?.privacyLevelOptions || ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'FOLLOWER_OF_CREATOR', 'SELF_ONLY']).map((option: string) => (
                    <MenuItem
                      key={option}
                      value={option}
                      disabled={option === 'SELF_ONLY' && tiktokBrandedContent}
                    >
                      {option === 'PUBLIC_TO_EVERYONE' && 'Everyone'}
                      {option === 'MUTUAL_FOLLOW_FRIENDS' && 'Friends'}
                      {option === 'SELF_ONLY' && (tiktokBrandedContent ? 'Only me (unavailable for branded content)' : 'Only me')}
                      {option === 'FOLLOWER_OF_CREATOR' && 'Followers'}
                    </MenuItem>
                  ))}
                </Select>
                {tiktokPrivacyLevel === '' && (
                  <Typography sx={{ fontSize: '0.7rem', color: '#FF3B30', mb: 2 }}>
                    Please select a privacy level to continue
                  </Typography>
                )}

                {/* Interaction Settings */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                  Allow viewers to:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tiktokAllowComment && !tiktokCreatorInfo?.commentDisabled}
                        onChange={(e) => setTiktokAllowComment(e.target.checked)}
                        disabled={tiktokCreatorInfo?.commentDisabled}
                        size="small"
                        icon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', border: '2px solid rgba(255,255,255,0.3)', bgcolor: 'transparent' }} />}
                        checkedIcon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check sx={{ fontSize: 14, color: '#fff' }} /></Box>}
                        sx={{ '&.Mui-disabled': { opacity: 0.3 } }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.95rem', lineHeight: 1, color: tiktokCreatorInfo?.commentDisabled ? '#C7C7CC' : 'inherit' }}>Comment</Typography>
                        <Tooltip title={tiktokCreatorInfo?.commentDisabled ? 'Comments are disabled in your TikTok settings' : 'Allow viewers to leave comments on your video'} arrow>
                          <InfoOutlined sx={{ fontSize: '1rem', color: tiktokCreatorInfo?.commentDisabled ? '#E0E0E0' : '#6B6B6B', verticalAlign: 'middle', cursor: 'pointer' }} />
                        </Tooltip>
                      </Box>
                    }
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tiktokAllowDuet && !tiktokCreatorInfo?.duetDisabled}
                        onChange={(e) => setTiktokAllowDuet(e.target.checked)}
                        disabled={tiktokCreatorInfo?.duetDisabled}
                        size="small"
                        icon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', border: '2px solid rgba(255,255,255,0.3)', bgcolor: 'transparent' }} />}
                        checkedIcon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check sx={{ fontSize: 14, color: '#fff' }} /></Box>}
                        sx={{ '&.Mui-disabled': { opacity: 0.3 } }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.95rem', lineHeight: 1, color: tiktokCreatorInfo?.duetDisabled ? '#C7C7CC' : 'inherit' }}>Duet</Typography>
                        <Tooltip title={tiktokCreatorInfo?.duetDisabled ? 'Duet is disabled in your TikTok settings' : 'Allow others to create a video side-by-side with yours'} arrow>
                          <InfoOutlined sx={{ fontSize: '1rem', color: tiktokCreatorInfo?.duetDisabled ? '#E0E0E0' : '#6B6B6B', verticalAlign: 'middle', cursor: 'pointer' }} />
                        </Tooltip>
                      </Box>
                    }
                    sx={{ mr: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={tiktokAllowStitch && !tiktokCreatorInfo?.stitchDisabled}
                        onChange={(e) => setTiktokAllowStitch(e.target.checked)}
                        disabled={tiktokCreatorInfo?.stitchDisabled}
                        size="small"
                        icon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', border: '2px solid rgba(255,255,255,0.3)', bgcolor: 'transparent' }} />}
                        checkedIcon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check sx={{ fontSize: 14, color: '#fff' }} /></Box>}
                        sx={{ '&.Mui-disabled': { opacity: 0.3 } }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography sx={{ fontSize: '0.95rem', lineHeight: 1, color: tiktokCreatorInfo?.stitchDisabled ? '#C7C7CC' : 'inherit' }}>Stitch</Typography>
                        <Tooltip title={tiktokCreatorInfo?.stitchDisabled ? 'Stitch is disabled in your TikTok settings' : 'Allow others to clip up to 5 seconds of your video into theirs'} arrow>
                          <InfoOutlined sx={{ fontSize: '1rem', color: tiktokCreatorInfo?.stitchDisabled ? '#E0E0E0' : '#6B6B6B', verticalAlign: 'middle', cursor: 'pointer' }} />
                        </Tooltip>
                      </Box>
                    }
                  />
                </Box>

                {/* Commercial Content Disclosure */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: tiktokDiscloseContent ? 1.5 : 0, ml: -1 }}>
                  <Switch
                    checked={tiktokDiscloseContent}
                    onChange={(e) => {
                      setTiktokDiscloseContent(e.target.checked);
                      if (!e.target.checked) {
                        setTiktokBrandOrganic(false);
                        setTiktokBrandedContent(false);
                      }
                    }}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#007AFF' },
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>Content disclosure</Typography>
                    <Typography variant="caption" sx={{ color: '#86868B', display: 'block' }}>Indicate if this promotes a brand, product, or service</Typography>
                  </Box>
                </Box>

                {tiktokDiscloseContent && (
                  <>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={tiktokBrandOrganic}
                            onChange={(e) => setTiktokBrandOrganic(e.target.checked)}
                            size="small"
                            icon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', border: '2px solid rgba(255,255,255,0.3)', bgcolor: 'transparent' }} />}
                            checkedIcon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check sx={{ fontSize: 14, color: '#fff' }} /></Box>}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.95rem', lineHeight: 1 }}>Your brand</Typography>
                            <Tooltip title="You're promoting yourself or your own business" arrow>
                              <InfoOutlined sx={{ fontSize: '1rem', color: '#6B6B6B', verticalAlign: 'middle', cursor: 'pointer' }} />
                            </Tooltip>
                          </Box>
                        }
                        sx={{ mr: 2 }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={tiktokBrandedContent}
                            onChange={(e) => {
                              setTiktokBrandedContent(e.target.checked);
                              if (e.target.checked && tiktokPrivacyLevel === 'SELF_ONLY') {
                                setTiktokPrivacyLevel('PUBLIC_TO_EVERYONE');
                              }
                            }}
                            size="small"
                            disabled={tiktokPrivacyLevel === 'SELF_ONLY'}
                            icon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', border: '2px solid rgba(255,255,255,0.3)', bgcolor: 'transparent' }} />}
                            checkedIcon={<Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check sx={{ fontSize: 14, color: '#fff' }} /></Box>}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography sx={{ fontSize: '0.95rem', lineHeight: 1, color: tiktokPrivacyLevel === 'SELF_ONLY' ? '#C7C7CC' : 'inherit' }}>Branded content</Typography>
                            <Tooltip title={tiktokPrivacyLevel === 'SELF_ONLY' ? 'Branded content cannot be private' : "You're promoting another brand or third party"} arrow>
                              <InfoOutlined sx={{ fontSize: '1rem', color: tiktokPrivacyLevel === 'SELF_ONLY' ? '#C7C7CC' : '#6B6B6B', verticalAlign: 'middle', cursor: 'pointer' }} />
                            </Tooltip>
                          </Box>
                        }
                      />
                    </Box>
                    {(tiktokBrandOrganic || tiktokBrandedContent) && (
                      <Alert
                        severity="info"
                        icon={<InfoOutlined />}
                        sx={{
                          mt: 1.5,
                          borderRadius: '10px',
                          bgcolor: 'rgba(0,122,255,0.08)',
                          border: '1px solid rgba(0,122,255,0.2)',
                          '& .MuiAlert-icon': { color: '#007AFF' },
                          '& .MuiAlert-message': { color: '#fff' }
                        }}
                      >
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          Your video will be labeled as "{tiktokBrandedContent ? 'Paid partnership' : 'Promotional content'}"
                        </Typography>
                      </Alert>
                    )}
                    {!tiktokBrandOrganic && !tiktokBrandedContent && (
                      <Alert
                        severity="warning"
                        icon={<InfoOutlined />}
                        sx={{
                          mt: 1.5,
                          borderRadius: '10px',
                          bgcolor: 'rgba(245,158,11,0.08)',
                          border: '1px solid rgba(245,158,11,0.2)',
                          '& .MuiAlert-icon': { color: '#F59E0B' },
                          '& .MuiAlert-message': { color: '#fff' }
                        }}
                      >
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          Select at least one option to indicate what you're promoting
                        </Typography>
                      </Alert>
                    )}
                  </>
                )}

                {/* Processing Time Notice */}
                <Alert
                  severity="info"
                  icon={<InfoOutlined />}
                  sx={{
                    mt: 2,
                    borderRadius: '10px',
                    bgcolor: 'rgba(0,122,255,0.08)',
                    border: '1px solid rgba(0,122,255,0.2)',
                    '& .MuiAlert-icon': { color: '#007AFF' },
                    '& .MuiAlert-message': { color: '#fff' }
                  }}
                >
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {tiktokPostMode === 'direct'
                      ? 'After posting, it may take a few minutes for your video to appear on your TikTok profile.'
                      : 'After posting, it may take a few minutes for your video to appear in your TikTok inbox.'
                    }
                  </Typography>
                </Alert>

                {/* Consent Declaration */}
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  By posting, you agree to TikTok's{' '}
                  {tiktokBrandedContent && (
                    <>
                      <Typography
                        component="a"
                        href="https://www.tiktok.com/legal/bc-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontSize: '0.75rem', color: '#fff', textDecoration: 'underline', '&:hover': { opacity: 0.8 } }}
                      >
                        Branded Content Policy
                      </Typography>
                      {' and '}
                    </>
                  )}
                  <Typography
                    component="a"
                    href="https://www.tiktok.com/legal/music-usage-confirmation"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontSize: '0.75rem', color: '#fff', textDecoration: 'underline', '&:hover': { opacity: 0.8 } }}
                  >
                    Music Usage Confirmation
                  </Typography>
                </Typography>
              </>
            )}
          </Paper>

          {/* Publish Button - matching video player "Select an Account" / "Publish" */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={isUploading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <CloudUpload />}
              onClick={() => setShowUploadConfirm(true)}
              disabled={isUploading || selectedAccountIds.size === 0}
              sx={{
                bgcolor: '#007AFF',
                px: 5, py: 1.5,
                borderRadius: '12px',
                fontWeight: 600, fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                '&:hover': { bgcolor: '#0066DD', boxShadow: '0 6px 20px rgba(0,122,255,0.4)' },
                '&:disabled': { bgcolor: 'rgba(255,255,255,0.1)', boxShadow: 'none' },
              }}
            >
              {isUploading ? 'Publishing...' : selectedAccountIds.size === 0 ? 'Select an Account' : 'Publish Slideshow'}
            </Button>
          </Box>
        </Box>
      )}

      {/* Upload Confirmation Dialog - matching video player */}
      <Dialog
        open={showUploadConfirm}
        onClose={() => { if (!isUploading) { setShowUploadConfirm(false); } }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1, bgcolor: '#1D1D1F' } }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1, color: '#fff' }}>
          {isUploading ? 'Uploading...' : Object.values(uploadProgress).some(s => s === 'success' || s === 'error') ? 'Upload Complete' : 'Confirm Upload'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#86868B', mb: 3 }}>
            {isUploading
              ? 'Your slideshow is being uploaded to the following platforms:'
              : Object.values(uploadProgress).some(s => s === 'success' || s === 'error')
                ? 'Upload results:'
                : 'Your slideshow will be uploaded to the following platforms:'
            }
          </Typography>

          {/* Selected Platforms - Grouped Compact View */}
          {(() => {
            const modalPlatformConfig: Record<string, { color: string; gradient?: string; icon: React.ReactNode }> = {
              tiktok: {
                color: '#000000',
                icon: (
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 22, height: 22, fill: '#fff' }}>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </Box>
                ),
              },
              instagram: {
                color: '#E4405F',
                gradient: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                icon: (
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 22, height: 22, fill: '#fff' }}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </Box>
                ),
              },
            };

            const platformOrder = ['tiktok', 'instagram'];
            const groupedAccounts = platformOrder
              .map(platform => ({
                platform,
                accounts: selectedAccounts.filter(a => a.platform === platform),
              }))
              .filter(group => group.accounts.length > 0);

            return (
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                p: 2, mb: 3,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {groupedAccounts.map(({ platform, accounts }) => {
                    const config = modalPlatformConfig[platform] || { color: '#666', icon: null };
                    return (
                      <Box key={platform} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: config.gradient || config.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, border: '2px solid #34C759',
                        }}>
                          {config.icon}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          {accounts.map((account) => {
                            const progress = uploadProgress[account.accountId];
                            const displayName = account.username || account.accountName || 'Account';
                            return (
                              <Box key={account.accountId} sx={{
                                display: 'flex', alignItems: 'center', gap: 0.75,
                                px: 1, py: 1, borderRadius: '20px',
                                bgcolor: progress === 'success' ? 'rgba(52,199,89,0.15)' : progress === 'error' ? 'rgba(255,59,48,0.15)' : 'rgba(255,255,255,0.05)',
                                border: progress === 'success' ? '2px solid rgba(52,199,89,0.6)' : progress === 'error' ? '2px solid rgba(255,59,48,0.6)' : '2px solid #007AFF',
                              }}>
                                {account.avatarUrl ? (
                                  <Box component="img" src={account.avatarUrl} sx={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
                                )}
                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  @{displayName}
                                </Typography>
                                {progress === 'uploading' && <CircularProgress size={12} sx={{ color: config.color }} />}
                                {progress === 'success' && <CheckCircle sx={{ color: '#34C759', fontSize: 14 }} />}
                                {progress === 'error' && <ErrorIcon sx={{ color: '#FF3B30', fontSize: 14 }} />}
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })()}

          {/* Slideshow Details Summary */}
          {!isUploading && !Object.values(uploadProgress).some(s => s === 'success' || s === 'error') && (
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px', p: 2, display: 'flex', gap: 2 }}>
              {imageUrls[0] && (
                <Box
                  component="img"
                  src={imageUrls[0]}
                  alt="Thumbnail"
                  sx={{
                    width: 56, height: 100,
                    borderRadius: '8px', objectFit: 'cover', flexShrink: 0,
                    border: '2px solid #34C759',
                  }}
                />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: '#fff' }}>Post Preview</Typography>
                <Typography variant="body2" sx={{ mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Box component="span" sx={{ color: '#fff', fontWeight: 600 }}>Caption:</Box>
                  <Box component="span" sx={{ color: '#86868B' }}> {editCaption || 'No caption'}</Box>
                </Typography>
                {editTags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {editTags.slice(0, 5).map((tag, i) => (
                      <Chip key={i} label={tag.startsWith('#') ? tag : `#${tag}`} size="small" sx={{ fontSize: '0.7rem', height: 22, color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }} />
                    ))}
                    {editTags.length > 5 && (
                      <Chip label={`+${editTags.length - 5} more`} size="small" sx={{ fontSize: '0.7rem', height: 22, color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' }} />
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* When to publish? */}
          {!isUploading && !Object.values(uploadProgress).some(s => s === 'success' || s === 'error') && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#fff' }}>
                When to publish?
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box
                  onClick={() => setUploadMode('now')}
                  sx={{
                    flex: 1, p: 2, borderRadius: '12px',
                    border: `2px solid ${uploadMode === 'now' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                    bgcolor: uploadMode === 'now' ? 'rgba(0,122,255,0.05)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { borderColor: uploadMode === 'now' ? '#007AFF' : 'rgba(0,122,255,0.3)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CloudUpload sx={{ fontSize: 20, color: uploadMode === 'now' ? '#007AFF' : '#86868B' }} />
                    <Typography sx={{ fontWeight: 600, color: '#fff' }}>Publish Now</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Goes live in ~5 minutes
                  </Typography>
                </Box>
                <Box
                  onClick={() => {
                    setUploadMode('schedule');
                    if (!scheduledDateTime) {
                      const now = dayjs();
                      const minutesToAdd = 60 + (15 - (now.minute() % 15));
                      const defaultTime = now.add(minutesToAdd, 'minute').second(0);
                      setScheduledDateTime(defaultTime);
                    }
                  }}
                  sx={{
                    flex: 1, p: 2, borderRadius: '12px',
                    border: `2px solid ${uploadMode === 'schedule' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                    bgcolor: uploadMode === 'schedule' ? 'rgba(0,122,255,0.05)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { borderColor: uploadMode === 'schedule' ? '#007AFF' : 'rgba(0,122,255,0.3)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Schedule sx={{ fontSize: 20, color: uploadMode === 'schedule' ? '#007AFF' : '#86868B' }} />
                    <Typography sx={{ fontWeight: 600, color: '#fff' }}>Schedule</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Pick a date & time
                  </Typography>
                </Box>
              </Box>

              {uploadMode === 'schedule' && (
                <Box sx={{ mt: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      value={scheduledDateTime}
                      onChange={(newValue) => setScheduledDateTime(newValue)}
                      minDateTime={dayjs().add(5, 'minute')}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                              '&:hover fieldset': { borderColor: 'rgba(0,122,255,0.3)' },
                              '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                            },
                            '& input': { py: 1.5, px: 1.5, fontSize: '0.95rem', color: '#fff' },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)', bgcolor: '#141418', position: 'sticky', bottom: 0 }}>
          {!isUploading && Object.values(uploadProgress).some(s => s === 'success' || s === 'error') ? (
            <Button
              variant="contained"
              onClick={() => { setShowUploadConfirm(false); setUploadProgress({}); }}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: '#007AFF' }}
            >
              Done
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => { setShowUploadConfirm(false); setUploadProgress({}); }}
                disabled={isUploading}
                sx={{
                  borderRadius: '10px', textTransform: 'none', color: '#fff',
                  borderColor: 'rgba(255,255,255,0.2)',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.4)', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={(isUploading || isScheduling) ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : uploadMode === 'schedule' ? <Schedule /> : <CloudUpload />}
                onClick={handlePublish}
                disabled={isUploading || isScheduling}
                sx={{
                  borderRadius: '10px', textTransform: 'none', fontWeight: 600,
                  bgcolor: '#007AFF',
                  '&:hover': { bgcolor: '#0066DD' },
                  '&:disabled': { bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {isUploading || isScheduling ? 'Processing...' : uploadMode === 'schedule' ? 'Schedule Post' : 'Post Now'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        PaperProps={{ sx: { bgcolor: '#141418', borderRadius: '16px', maxWidth: 400 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: 'rgba(255,59,48,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Delete sx={{ fontSize: 24, color: '#FF3B30' }} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#fff' }}>Delete Slideshow?</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            This will permanently delete this slideshow and all its images. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <GhostButton onClick={() => setShowDeleteDialog(false)} disabled={isDeleting} sx={{ flex: 1, py: 1.25 }}>
            Cancel
          </GhostButton>
          <Button onClick={handleDelete} disabled={isDeleting} variant="contained"
            sx={{
              flex: 1, py: 1.25, borderRadius: '12px', textTransform: 'none', fontWeight: 600,
              background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)',
              boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #E53528 0%, #FF5252 100%)' },
              '&:disabled': { opacity: 0.7 },
            }}
          >
            {isDeleting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SlideshowDetailPage;
