import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  DialogActions,
  FormControlLabel,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';
import {
  ArrowBack,
  Delete,
  CheckCircle,
  Error as ErrorIcon,
  Close,
  Schedule,
  ChevronLeft,
  ChevronRight,
  Download,
  CloudUpload,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { useGetSlideshowQuery, useGetSocialAccountsQuery, useDeleteSlideshowMutation, apiSlice } from '../store/apiSlice';
import { slideshowsApi, tiktokApi, scheduledPostsApi } from '../services/api';
import { useLayout } from '../components/Layout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

const SlideshowDetailPage: React.FC = () => {
  const { slideshowId } = useParams<{ slideshowId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { setCurrentViewingItem } = useLayout();

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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Metadata editing
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
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
  const [tiktokDiscloseContent, setTiktokDiscloseContent] = useState(false);
  const [tiktokBrandOrganic, setTiktokBrandOrganic] = useState(false);
  const [tiktokBrandedContent, setTiktokBrandedContent] = useState(false);

  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pre-populate metadata from slideshow data
  useEffect(() => {
    if (currentSlideshow) {
      setEditTitle(currentSlideshow.hook || currentSlideshow.title || '');
      const captionText = (currentSlideshow.captions || []).filter(Boolean).join('\n');
      setEditDescription(currentSlideshow.tiktokDescription || '');
      setEditTags(currentSlideshow.hashtags || []);
    }
  }, [currentSlideshow?.slideshowId, currentSlideshow?.status]);

  // Set current viewing item for sidebar
  useEffect(() => {
    if (currentSlideshow && slideshowId) {
      setCurrentViewingItem({
        type: 'video',
        title: currentSlideshow.title || 'Slideshow',
        path: `/slideshow/${slideshowId}`,
      });
    }
    return () => setCurrentViewingItem(null);
  }, [currentSlideshow?.title, slideshowId, setCurrentViewingItem]);

  const selectedAccounts = useMemo(() =>
    slideshowAccounts.filter(a => selectedAccountIds.has(a.accountId)),
    [slideshowAccounts, selectedAccountIds]
  );
  const hasTikTok = selectedAccounts.some(a => a.platform === 'tiktok');
  const hasInstagram = selectedAccounts.some(a => a.platform === 'instagram');
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

    if (!tiktokPrivacyLevel) {
      setSocialError('Please select a TikTok privacy level');
      return;
    }

    // Don't append hashtags to description — backend adds them from slideshow.hashtags
    const fullDescription = editDescription.trim();

    // Photo/carousel posts only support disableComment — duet/stitch are video-only fields
    const tiktokSettings = {
      privacyLevel: tiktokPrivacyLevel,
      postMode: tiktokPostMode,
      disableComment: !tiktokAllowComment,
    };

    if (uploadMode === 'schedule') {
      if (!scheduledDateTime || scheduledDateTime.isBefore(dayjs())) {
        setSocialError('Please select a future date and time');
        return;
      }
      setIsScheduling(true);
      setSocialError(null);
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 30000)
        );
        await Promise.race([
          slideshowsApi.scheduleSlideshow(currentSlideshow.slideshowId, {
            scheduledTime: scheduledDateTime.toISOString(),
            accountId: tiktokAccount.accountId,
            title: editTitle,
            description: fullDescription,
            tiktokSettings,
          }),
          timeoutPromise,
        ]);
        setSocialSuccess('Slideshow scheduled successfully');
        setShowUploadConfirm(false);
        dispatch(apiSlice.util.invalidateTags(['ScheduledPosts']));
      } catch (err: any) {
        if (err.message === 'timeout') {
          setSocialError('Scheduling timed out. Please try again.');
        } else {
          setSocialError(err.response?.data?.error || err.response?.data?.message || 'Failed to schedule');
        }
      } finally {
        setIsScheduling(false);
      }
    } else {
      setIsUploading(true);
      setUploadProgress({ [tiktokAccount.accountId]: 'uploading' });
      try {
        await slideshowsApi.uploadSlideshow(currentSlideshow.slideshowId, {
          accountId: tiktokAccount.accountId,
          title: editTitle,
          description: fullDescription,
          tiktokSettings,
        });
        setUploadProgress({ [tiktokAccount.accountId]: 'success' });
        setSocialSuccess(tiktokPostMode === 'draft' ? 'Slideshow sent to TikTok drafts' : 'Slideshow published to TikTok');
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

  const imageUrls = currentSlideshow?.imageUrls || [];
  const totalSlides = imageUrls.length;

  const prevSlide = useCallback(() => setCurrentSlide(s => Math.max(0, s - 1)), []);
  const nextSlide = useCallback(() => setCurrentSlide(s => Math.min(totalSlides - 1, s + 1)), [totalSlides]);

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
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Back + Title Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/my-slideshows')} sx={{ color: '#fff' }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
            {currentSlideshow.hook || (currentSlideshow.title ? currentSlideshow.title.substring(0, 80) + (currentSlideshow.title.length > 80 ? '…' : '') : 'Slideshow')}
          </Typography>
          <Chip
            label={currentSlideshow.status}
            size="small"
            sx={{
              backgroundColor: currentSlideshow.status === 'ready' ? 'rgba(34,197,94,0.15)' : currentSlideshow.status === 'failed' ? 'rgba(255,59,48,0.15)' : 'rgba(0,122,255,0.15)',
              color: currentSlideshow.status === 'ready' ? '#22C55E' : currentSlideshow.status === 'failed' ? '#FF3B30' : '#007AFF',
              fontWeight: 600,
              border: `1px solid ${currentSlideshow.status === 'ready' ? 'rgba(34,197,94,0.3)' : currentSlideshow.status === 'failed' ? 'rgba(255,59,48,0.3)' : 'rgba(0,122,255,0.3)'}`,
            }}
          />
        </Box>
        <IconButton onClick={() => setShowDeleteDialog(true)} sx={{ color: '#FF3B30' }}>
          <Delete />
        </IconButton>
      </Box>

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

      {/* Image Carousel */}
      {totalSlides > 0 && (
        <Paper sx={{ borderRadius: '20px', overflow: 'hidden', mb: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
          <Box sx={{ position: 'relative', backgroundColor: '#000' }}>
            <Box
              component="img"
              src={imageUrls[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              onClick={() => setLightboxOpen(true)}
              sx={{ width: '100%', maxHeight: 600, objectFit: 'contain', display: 'block', mx: 'auto', cursor: 'pointer' }}
            />
            {currentSlide > 0 && (
              <IconButton onClick={prevSlide} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
                <ChevronLeft />
              </IconButton>
            )}
            {currentSlide < totalSlides - 1 && (
              <IconButton onClick={nextSlide} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
                <ChevronRight />
              </IconButton>
            )}
            <Chip label={`${currentSlide + 1} / ${totalSlides}`} size="small" sx={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: '#fff', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)' }} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, py: 1.5, backgroundColor: 'rgba(255,255,255,0.03)' }}>
            {imageUrls.map((_: string, i: number) => (
              <Box key={i} onClick={() => setCurrentSlide(i)} sx={{ width: i === currentSlide ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === currentSlide ? '#007AFF' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s ease' }} />
            ))}
          </Box>
          {currentSlideshow.captions?.[currentSlide] && (
            <Box sx={{ px: 3, py: 1.5, backgroundColor: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                "{currentSlideshow.captions[currentSlide]}"
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {currentSlideshow.status === 'ready' && (
        <>
          {/* Metadata Editing */}
          <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
              Post Details
            </Typography>

            {/* Title / Hook */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>Title</Typography>
                <Typography sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: editTitle.length > 90 ? '#FF3B30' : 'rgba(255,255,255,0.4)',
                }}>
                  {editTitle.length}/90 chars
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Scroll-stop hook text"
                value={editTitle}
                onChange={(e) => {
                  if (e.target.value.length <= 90 || e.target.value.length < editTitle.length) {
                    setEditTitle(e.target.value);
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', lineHeight: 1.6,
                    '& fieldset': { borderColor: editTitle ? '#007AFF' : 'rgba(255,255,255,0.1)', borderWidth: editTitle ? '2px' : '1px' },
                    '&:hover fieldset': { borderColor: editTitle ? '#007AFF' : 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
                  },
                  '& .MuiInputBase-input': { '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 } },
                }}
              />
            </Box>

            {/* Caption / Body */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>Caption</Typography>
              <TextField
                fullWidth multiline rows={5} placeholder="Tell the story behind the post, add context, or expand on your hook..."
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', lineHeight: 1.6,
                    '& fieldset': { borderColor: editDescription ? '#007AFF' : 'rgba(255,255,255,0.1)', borderWidth: editDescription ? '2px' : '1px' },
                    '&:hover fieldset': { borderColor: editDescription ? '#007AFF' : 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
                  },
                  '& .MuiInputBase-input': { '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 } },
                }}
              />
            </Box>

            {/* Hashtags */}
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#fff' }}>Hashtags</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {editTags.map((tag, i) => (
                <Chip key={i} label={tag.startsWith('#') ? tag : `#${tag}`} size="small"
                  onDelete={() => setEditTags(prev => prev.filter((_, idx) => idx !== i))}
                  sx={{ borderRadius: '100px', bgcolor: 'transparent', border: '1.5px solid #007AFF', color: '#fff', fontWeight: 500, '& .MuiChip-deleteIcon': { color: '#007AFF' } }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" placeholder="Add hashtag" value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && newTag.trim()) { setEditTags(prev => [...prev, newTag.trim().replace(/^#/, '')]); setNewTag(''); } }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': { borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' } },
                  '& .MuiInputBase-input': { '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 } },
                }}
              />
              <Button size="small" variant="outlined"
                onClick={() => { if (newTag.trim()) { setEditTags(prev => [...prev, newTag.trim().replace(/^#/, '')]); setNewTag(''); } }}
                sx={{ borderRadius: '10px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { borderColor: '#007AFF' } }}
              >Add</Button>
            </Box>
          </Paper>

          {/* Social Accounts */}
          <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#fff' }}>Publish To</Typography>
            {slideshowAccounts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>No TikTok or Instagram accounts connected</Typography>
                <Button variant="outlined" size="small" onClick={() => navigate('/settings/connected-accounts')}
                  sx={{ borderRadius: '10px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { borderColor: '#007AFF' } }}
                >Connect Accounts</Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {slideshowAccounts.map((account) => {
                  const isSelected = selectedAccountIds.has(account.accountId);
                  const isDisabled = account.platform === 'instagram' && instagramDisabled;
                  return (
                    <Tooltip key={account.accountId} title={isDisabled ? `Instagram limits carousels to 10 images (this slideshow has ${totalSlides})` : ''}>
                      <Box onClick={() => handleAccountToggle(account.accountId, account.platform)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderRadius: '12px',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          border: isSelected ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                          background: isDisabled ? 'rgba(255,255,255,0.02)' : isSelected ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                          opacity: isDisabled ? 0.5 : 1, transition: 'all 0.2s ease',
                          '&:hover': isDisabled ? {} : { borderColor: isSelected ? '#007AFF' : 'rgba(255,255,255,0.2)', background: isSelected ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.08)' },
                        }}
                      >
                        <Box component="img" src={account.platform === 'tiktok' ? '/social/tiktok.png' : '/social/instagram.png'} alt={account.platform}
                          sx={{ width: 28, height: 28, borderRadius: '6px' }} onError={(e: any) => { e.target.style.display = 'none'; }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>{account.platform}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{account.username || account.accountName || 'Connected'}</Typography>
                        </Box>
                        {isSelected && <CheckCircle sx={{ fontSize: 20, color: '#007AFF' }} />}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            )}
          </Paper>

          {/* TikTok Settings */}
          {hasTikTok && (
            <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#fff' }}>TikTok Settings</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#fff' }}>Post Mode</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {(['direct', 'draft'] as const).map(mode => (
                    <Chip key={mode} label={mode === 'direct' ? 'Publish' : 'Save as Draft'} onClick={() => setTiktokPostMode(mode)}
                      sx={{ borderRadius: '10px', fontWeight: 600, backgroundColor: tiktokPostMode === mode ? '#007AFF' : 'rgba(255,255,255,0.05)', color: '#fff', border: tiktokPostMode === mode ? '1px solid #007AFF' : '1px solid rgba(255,255,255,0.1)', '&:hover': { opacity: 0.8 } }}
                    />
                  ))}
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#fff' }}>Privacy Level</Typography>
                <Select value={tiktokPrivacyLevel} onChange={(e) => setTiktokPrivacyLevel(e.target.value)} displayEmpty size="small" fullWidth
                  sx={{ borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' }, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}
                >
                  <MenuItem value="" disabled>Select privacy level</MenuItem>
                  {(tiktokCreatorInfo?.privacyLevelOptions || ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'FOLLOWER_OF_CREATOR', 'SELF_ONLY']).map((level: string) => (
                    <MenuItem key={level} value={level}>{level.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}</MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <FormControlLabel control={<Checkbox checked={tiktokAllowComment} onChange={(e) => setTiktokAllowComment(e.target.checked)} size="small" sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#007AFF' } }} />} label={<Typography variant="body2" sx={{ color: '#fff' }}>Allow comments</Typography>} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={<Switch checked={tiktokDiscloseContent} onChange={(e) => setTiktokDiscloseContent(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#007AFF' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#007AFF' } }} />}
                  label={<Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>Content disclosure</Typography>}
                />
                {tiktokDiscloseContent && (
                  <Box sx={{ ml: 4, mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <FormControlLabel control={<Checkbox checked={tiktokBrandOrganic} onChange={(e) => setTiktokBrandOrganic(e.target.checked)} size="small" sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#007AFF' } }} />} label={<Typography variant="body2" sx={{ color: '#fff' }}>Your brand</Typography>} />
                    <FormControlLabel control={<Checkbox checked={tiktokBrandedContent} onChange={(e) => setTiktokBrandedContent(e.target.checked)} size="small" sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#007AFF' } }} />} label={<Typography variant="body2" sx={{ color: '#fff' }}>Branded content</Typography>} />
                  </Box>
                )}
              </Box>
            </Paper>
          )}

          {/* Publish Button */}
          {selectedAccountIds.size > 0 && (
            <Button fullWidth variant="contained" onClick={() => setShowUploadConfirm(true)}
              disabled={hasTikTok && !tiktokPrivacyLevel}
              sx={{
                borderRadius: '12px', py: 1.5, mb: 3, textTransform: 'none', fontWeight: 600, fontSize: '1rem',
                bgcolor: '#007AFF', boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                '&:hover': { bgcolor: '#0066DD', boxShadow: '0 6px 20px rgba(0,122,255,0.4)' },
                '&:disabled': { bgcolor: 'rgba(255,255,255,0.1)', boxShadow: 'none', color: 'rgba(255,255,255,0.3)' },
              }}
            >{hasTikTok && !tiktokPrivacyLevel ? 'Select Privacy Level to Publish' : 'Publish Slideshow'}</Button>
          )}

          {/* Download all */}
          <Button fullWidth variant="outlined" startIcon={<Download />}
            onClick={() => { imageUrls.forEach((url: string, i: number) => { const a = document.createElement('a'); a.href = url; a.download = `slide-${i + 1}.jpg`; a.target = '_blank'; a.click(); }); }}
            sx={{ borderRadius: '12px', py: 1.5, mb: 3, textTransform: 'none', fontWeight: 600, borderColor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { borderColor: '#007AFF' } }}
          >Download All Slides</Button>
        </>
      )}

      {/* Upload Confirmation Dialog */}
      <Dialog
        open={showUploadConfirm}
        onClose={() => { if (!isUploading && !isScheduling) { setShowUploadConfirm(false); } }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', p: 1, bgcolor: '#1D1D1F' } }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1, color: '#fff' }}>
          {isUploading ? 'Uploading...' : isScheduling ? 'Scheduling...' : Object.values(uploadProgress).some(s => s === 'success' || s === 'error') ? 'Upload Complete' : 'Confirm Upload'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#86868B', mb: 3 }}>
            {isUploading
              ? 'Your slideshow is being uploaded to the following platforms:'
              : isScheduling
                ? 'Your slideshow is being scheduled...'
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

          {/* Mode Selection */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="Publish Now" onClick={() => setUploadMode('now')}
              sx={{ borderRadius: '10px', fontWeight: 600, backgroundColor: uploadMode === 'now' ? '#007AFF' : 'rgba(255,255,255,0.05)', color: '#fff', border: uploadMode === 'now' ? '1px solid #007AFF' : '1px solid rgba(255,255,255,0.1)' }} />
            <Chip icon={<Schedule sx={{ fontSize: 16, color: '#fff !important' }} />} label="Schedule" onClick={() => setUploadMode('schedule')}
              sx={{ borderRadius: '10px', fontWeight: 600, backgroundColor: uploadMode === 'schedule' ? '#007AFF' : 'rgba(255,255,255,0.05)', color: '#fff', border: uploadMode === 'schedule' ? '1px solid #007AFF' : '1px solid rgba(255,255,255,0.1)' }} />
          </Box>
          {uploadMode === 'schedule' && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker label="Schedule for" value={scheduledDateTime} onChange={setScheduledDateTime} minDateTime={dayjs().add(5, 'minute')}
                sx={{ width: '100%', '& .MuiOutlinedInput-root': { borderRadius: '12px', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&.Mui-focused fieldset': { borderColor: '#007AFF' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' }, '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' } }}
              />
            </LocalizationProvider>
          )}

          {/* Error/Success inside dialog so user can see it */}
          {socialError && (
            <Alert severity="error" onClose={() => setSocialError(null)} sx={{ mt: 2, borderRadius: '12px' }}>
              {socialError}
            </Alert>
          )}
          {socialSuccess && (
            <Alert severity="success" onClose={() => setSocialSuccess(null)} sx={{ mt: 2, borderRadius: '12px' }}>
              {socialSuccess}
            </Alert>
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
                disabled={isUploading || isScheduling}
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
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1, bgcolor: '#1D1D1F' } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>Delete Slideshow?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>This will permanently delete this slideshow and all its images. This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} sx={{ textTransform: 'none', color: 'rgba(255,255,255,0.7)' }}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={isDeleting} sx={{ textTransform: 'none', borderRadius: '10px' }}>
            {isDeleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="lg" fullWidth>
        <Box sx={{ position: 'relative', backgroundColor: '#000' }}>
          <IconButton onClick={() => setLightboxOpen(false)} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 1 }}><Close /></IconButton>
          {totalSlides > 0 && <Box component="img" src={imageUrls[currentSlide]} alt={`Slide ${currentSlide + 1}`} sx={{ width: '100%', maxHeight: '90vh', objectFit: 'contain', display: 'block' }} />}
          {currentSlide > 0 && <IconButton onClick={prevSlide} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}><ChevronLeft /></IconButton>}
          {currentSlide < totalSlides - 1 && <IconButton onClick={nextSlide} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}><ChevronRight /></IconButton>}
        </Box>
      </Dialog>

      {socialSuccess && <Alert severity="success" onClose={() => setSocialSuccess(null)} sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, borderRadius: '12px', boxShadow: 3 }}>{socialSuccess}</Alert>}
      {socialError && <Alert severity="error" onClose={() => setSocialError(null)} sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, borderRadius: '12px', boxShadow: 3 }}>{socialError}</Alert>}
    </Box>
  );
};

export default SlideshowDetailPage;
