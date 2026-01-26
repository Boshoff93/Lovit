import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
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
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Switch,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrowRounded,
  Pause,
  Fullscreen,
  FullscreenExit,
  Movie,
  Download,
  Lyrics,
  Share,
  YouTube,
  AutoAwesome,
  Add,
  Check,
  CheckCircle,
  CloudUpload,
  Delete,
  Error,
  Close,
  InfoOutlined,
  Schedule,
  Public as PublicIcon,
  VideoLibrary as VideoLibraryIcon,
  Casino,
  CheckBoxOutlineBlank,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { getTokensFromAllowances, createCheckoutSession, setTokensRemaining } from '../store/authSlice';
import { videosApi, songsApi, youtubeApi, tiktokApi, instagramApi, facebookApi, linkedinApi, charactersApi, scheduledPostsApi, Character } from '../services/api';
import { useDispatch } from 'react-redux';
import UpgradePopup from '../components/UpgradePopup';
import GruviCoin from '../components/GruviCoin';
import { GhostButton } from '../components/GhostButton';
import { TopUpBundle } from '../config/stripe';
import { useLayout } from '../components/Layout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

// Image cache map to avoid reloading
const imageCache = new Map<string, HTMLImageElement>();

// Preload and cache an image
const preloadImage = (src: string): void => {
  if (!src || imageCache.has(src)) return;
  const img = new Image();
  img.src = src;
  imageCache.set(src, img);
};

interface VideoData {
  videoId: string;
  songId: string;
  songTitle?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number; // Backend saves this
  createdAt: string;
  status: string;
  aspectRatio?: 'portrait' | 'landscape';
  videoType?: string;
  style?: string;
  characterIds?: string[];
  seedreamReferenceUrls?: Record<string, string>; // characterId -> seedream URL
  sceneImageUrls?: string[]; // All generated scene images from video
  isUserUpload?: boolean; // Flag for user-uploaded videos
  originalFilename?: string; // Original filename for uploaded videos
  description?: string; // Description/context for uploaded videos
}

interface SongData {
  songId: string;
  title?: string;
  songTitle?: string;
  lyrics?: string;
  lyricsRaw?: string;
  genre?: string;
  mood?: string;
  actualDuration?: number;
  estimatedDuration?: number;
}

const MusicVideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { user, allowances, subscription } = useSelector((state: RootState) => state.auth);
  const { setCurrentViewingItem } = useLayout();
  const socialSectionRef = useRef<HTMLDivElement>(null);
  
  // Calculate remaining tokens
  const tokens = getTokensFromAllowances(allowances);
  const remainingTokens = ((tokens?.max || 0) + (tokens?.topup || 0)) - (tokens?.used || 0);
  const isPremiumTier = subscription?.tier === 'premium' || subscription?.tier === 'pro';
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [songData, setSongData] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrlRetryCount, setVideoUrlRetryCount] = useState(0);
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Social share state (inline on page)
  const [socialMetadata, setSocialMetadata] = useState<{
    title: string;
    description: string;
    tags: string[];
    hook: string;
    location?: string;
  } | null>(null);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [socialThumbnailUrl, setSocialThumbnailUrl] = useState<string | null>(null);
  const [localThumbnailFile, setLocalThumbnailFile] = useState<{ dataUrl: string; file: File } | null>(null); // Legacy - kept for compatibility
  const [uploadedCustomThumbnails, setUploadedCustomThumbnails] = useState<{ dataUrl: string; file: File }[]>([]); // Up to 3 custom uploaded thumbnails
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [socialError, setSocialError] = useState<string | null>(null);
  const [socialSuccess, setSocialSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Helper to show social error and scroll to it
  const showSocialError = useCallback((message: string) => {
    setSocialError(message);
    // Scroll to the social section so user sees the error
    setTimeout(() => {
      const element = socialSectionRef.current;
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - 100, behavior: 'smooth' });
      }
    }, 100);
  }, []);
  
  const [editedMetadata, setEditedMetadata] = useState<typeof socialMetadata>(null);
  const [hookText, setHookText] = useState('');
  const [thumbnailDescription, setThumbnailDescription] = useState(''); // Optional description for AI thumbnail generation
  const [thumbnailGenMode, setThumbnailGenMode] = useState<'images' | 'text'>('images'); // Toggle between image-based and text-based generation
  const [newTag, setNewTag] = useState('');
  const [videoFooter, setVideoFooter] = useState<string>(() => {
    // Load from localStorage on init
    return localStorage.getItem('gruvi_video_footer') || '';
  });
  const [uploadedVideoContext, setUploadedVideoContext] = useState(''); // Context for uploaded videos
  const [showContextModal, setShowContextModal] = useState(false); // Modal for uploaded video context
  const [useGruviRoulette, setUseGruviRoulette] = useState(true); // Toggle for Gruvi Roulette in modal
  
  // YouTube state
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [youtubeChannel, setYoutubeChannel] = useState<{ channelTitle?: string; channelThumbnail?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [backgroundUploadStarted, setBackgroundUploadStarted] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [addThumbnailIntro, setAddThumbnailIntro] = useState(true);

  // TikTok state
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [tiktokUsername, setTiktokUsername] = useState<string | null>(null);
  const [tiktokUploaded, setTiktokUploaded] = useState(false);

  // TikTok creator info (fetched from API per TikTok UX guidelines)
  const [tiktokCreatorInfo, setTiktokCreatorInfo] = useState<{
    creatorNickname: string;
    creatorAvatarUrl: string;
    privacyLevelOptions: string[];
    maxVideoPostDurationSec: number;
    commentDisabled: boolean;
    duetDisabled: boolean;
    stitchDisabled: boolean;
    canPost: boolean;
  } | null>(null);
  const [tiktokCreatorInfoLoading, setTiktokCreatorInfoLoading] = useState(false);
  const [tiktokCreatorInfoError, setTiktokCreatorInfoError] = useState<string | null>(null);

  // TikTok posting settings (required by TikTok API guidelines)
  const [tiktokPrivacyLevel, setTiktokPrivacyLevel] = useState<string>(''); // No default - user must select (TikTok UX requirement)
  const [tiktokAllowComment, setTiktokAllowComment] = useState(false); // Unchecked by default
  const [tiktokAllowDuet, setTiktokAllowDuet] = useState(false); // Unchecked by default
  const [tiktokAllowStitch, setTiktokAllowStitch] = useState(false); // Unchecked by default
  const [tiktokDiscloseContent, setTiktokDiscloseContent] = useState(false); // Commercial content toggle
  const [tiktokBrandOrganic, setTiktokBrandOrganic] = useState(false); // "Your brand" option
  const [tiktokBrandedContent, setTiktokBrandedContent] = useState(false); // "Branded content" option
  const [tiktokPostMode, setTiktokPostMode] = useState<'draft' | 'direct'>('direct'); // Draft (inbox) or Direct post

  // Instagram state
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramUsername, setInstagramUsername] = useState<string | null>(null);
  const [instagramUploaded, setInstagramUploaded] = useState(false);
  
  // Facebook state (shares auth with Instagram)
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [facebookPageName, setFacebookPageName] = useState<string | null>(null);
  const [facebookPageId, setFacebookPageId] = useState<string | null>(null);
  const [facebookUploaded, setFacebookUploaded] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [linkedinName, setLinkedinName] = useState<string | null>(null);
  const [linkedinUploaded, setLinkedinUploaded] = useState(false);
  
  // Platform selection & upload confirmation
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({});

  // Scheduling state
  const [uploadMode, setUploadMode] = useState<'now' | 'schedule'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState<Dayjs | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const uploadDialogContentRef = useRef<HTMLDivElement>(null);

  // Post-schedule success dialog state
  const [showScheduleSuccessDialog, setShowScheduleSuccessDialog] = useState(false);
  const [lastScheduledPostId, setLastScheduledPostId] = useState<string | null>(null);
  const [lastScheduledTime, setLastScheduledTime] = useState<string | null>(null);

  // Top banner state for schedule success/failure
  const [scheduleBanner, setScheduleBanner] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
    scheduleId?: string;
  }>({ show: false, type: 'success', message: '' });
  
  // Video characters state (for thumbnail selection)
  const [videoCharacters, setVideoCharacters] = useState<Character[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]); // Store all AI-generated thumbnails
  const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState<string | null>(null); // Currently selected thumbnail
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null); // For viewing thumbnails in full screen

  // Upgrade popup state
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  
  // Lyrics dropdown state
  const [showLyrics, setShowLyrics] = useState(false);
  
  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle top-up purchase
  const handleTopUp = async (bundle?: TopUpBundle) => {
    if (!bundle) return;
    setIsTopUpLoading(true);
    try {
      const result = await dispatch(createCheckoutSession({
        priceId: bundle.priceId,
        productId: bundle.productId,
      })).unwrap();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error('Failed to create checkout session:', err);
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const handleUpgrade = () => {
    setShowUpgradePopup(false);
    navigate('/payment');
  };

  // Persist video footer to localStorage
  useEffect(() => {
    localStorage.setItem('gruvi_video_footer', videoFooter);
  }, [videoFooter]);

  // Fetch video and song data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId || !videoId) {
        setError('Unable to load video');
        setLoading(false);
        return;
      }

      try {
        // Fetch video directly by ID (works regardless of pagination)
        const videoResponse = await videosApi.getVideo(user.userId, videoId);
        const video = videoResponse.data.video;
        
        if (video) {
          setVideoData(video);
          
          // Fetch the specific song for lyrics
          if (video.songId) {
            try {
              // Try the efficient single-song endpoint first
              const songResponse = await songsApi.getSong(user.userId, video.songId);
              if (songResponse.data.song) {
                setSongData(songResponse.data.song);
              }
            } catch (songErr: any) {
              // Fallback: If single-song endpoint not available (404), fetch from songs list
              if (songErr.response?.status === 404) {
                try {
                  const songsResponse = await songsApi.getUserSongs(user.userId, { limit: 100 });
                  const songs = songsResponse.data.songs || [];
                  const song = songs.find((s: SongData) => s.songId === video.songId);
                  if (song) {
                    setSongData(song);
                  }
                } catch {
                  // Song fetch failed, lyrics won't be shown
                }
              }
            }
          }
        } else {
          setError('Video not found');
        }
      } catch (err: any) {
        console.error('Error fetching video:', err);
        if (err.response?.status === 404) {
          setError('Video not found');
        } else {
          setError('Failed to load video');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.userId, videoId]);

  // Set the current viewing item for sidebar navigation
  useEffect(() => {
    if (videoData && videoId) {
      setCurrentViewingItem({
        type: 'video',
        title: videoData.songTitle || 'Video',
        path: `/video/${videoId}`,
      });
    }
  }, [videoData, videoId, setCurrentViewingItem]);

  // Load previously successful uploads when video data is loaded
  // Shows checkmarks on platforms that already have this video
  useEffect(() => {
    if (!user?.userId || !videoId || !videoData) return;

    const loadPreviousUploads = async () => {
      try {
        const response = await videosApi.getSocialUploadStatus(user.userId, videoId);
        const { results } = response.data;

        // Update the uploaded flags for platforms that were previously successful
        if (results) {
          if (results.youtube?.success) setYoutubeUrl(results.youtube.url || null);
          if (results.tiktok?.success) setTiktokUploaded(true);
          if (results.instagram?.success) setInstagramUploaded(true);
          if (results.facebook?.success) setFacebookUploaded(true);
          if (results.linkedin?.success) setLinkedinUploaded(true);
        }
      } catch (err) {
        // Ignore errors - status endpoint might not exist for old videos
      }
    };

    loadPreviousUploads();
  }, [user?.userId, videoId, videoData]);

  // Fetch characters used in this video
  useEffect(() => {
    const fetchVideoCharacters = async () => {
      if (!user?.userId || !videoData?.characterIds?.length) {
        setVideoCharacters([]);
        return;
      }
      
      try {
        // Fetch all user's characters and filter to ones used in this video
        const response = await charactersApi.getUserCharacters(user.userId);
        const allCharacters = response.data.characters || [];
        const usedCharacters = allCharacters.filter((c: Character) => 
          videoData.characterIds?.includes(c.characterId)
        );
        setVideoCharacters(usedCharacters);
      } catch (err) {
        console.error('Failed to fetch video characters:', err);
      }
    };
    
    fetchVideoCharacters();
  }, [user?.userId, videoData?.characterIds, videoData?.seedreamReferenceUrls]);

  // Handle scroll to social section from query param
  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo === 'social' && videoData && !loading) {
      // Wait for the page to fully render before scrolling
      const scrollTimer = setTimeout(() => {
        const element = socialSectionRef.current || document.getElementById('social-sharing-section');
        if (element) {
          // Get element position and scroll with offset to keep header visible
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - 100; // 100px offset from top
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 800);
      return () => clearTimeout(scrollTimer);
    }
  }, [searchParams, videoData, loading]); // Re-run when video data loads and loading completes

  // Load existing social metadata and YouTube status
  useEffect(() => {
    const loadSocialData = async () => {
      if (!user?.userId || !videoId) return;
      
      try {
        // Load existing social metadata
        const response = await videosApi.getSocialMetadata(user.userId, videoId);
        if (response.data.socialMetadata) {
          setSocialMetadata(response.data.socialMetadata);
          setEditedMetadata(response.data.socialMetadata);
          setHookText(response.data.socialMetadata.hook || '');
        }
        // Load all previously generated thumbnails
        if (response.data.generatedThumbnails && response.data.generatedThumbnails.length > 0) {
          const thumbnailUrls = response.data.generatedThumbnails.map((t: { url: string }) => t.url);
          setGeneratedThumbnails(thumbnailUrls);

          // Always auto-select first AI generated thumbnail
          setSocialThumbnailUrl(thumbnailUrls[0]);
          setSelectedThumbnailUrl(thumbnailUrls[0]);
        } else if (response.data.socialThumbnailUrl) {
          setSocialThumbnailUrl(response.data.socialThumbnailUrl);
          setSelectedThumbnailUrl(response.data.socialThumbnailUrl);
        }
      } catch {
        // No existing metadata
      }

      try {
        // Check YouTube status
        const ytResponse = await youtubeApi.getStatus(user.userId);
        setYoutubeConnected(ytResponse.data.connected);
        setYoutubeChannel(ytResponse.data.channelInfo);
      } catch {
        // YouTube not connected
      }
      
      try {
        // Check TikTok status
        const ttResponse = await tiktokApi.getStatus(user.userId);
        setTiktokConnected(ttResponse.data.connected);
        setTiktokUsername(ttResponse.data.username);

        // If TikTok is connected, fetch creator info (required by TikTok UX guidelines)
        if (ttResponse.data.connected) {
          setTiktokCreatorInfoLoading(true);
          try {
            const creatorResponse = await tiktokApi.getCreatorInfo(user.userId);
            setTiktokCreatorInfo(creatorResponse.data);
            setTiktokCreatorInfoError(null);
          } catch (err: any) {
            console.error('[TikTok] Failed to fetch creator info:', err);
            setTiktokCreatorInfoError(err.response?.data?.error || 'Failed to load TikTok settings');
            // If can't post, show error
            if (err.response?.status === 429) {
              setTiktokCreatorInfoError('You have reached TikTok\'s posting limit. Please try again later.');
            }
          } finally {
            setTiktokCreatorInfoLoading(false);
          }
        }
      } catch {
        // TikTok not connected
      }
      
      try {
        // Check Instagram status
        const igResponse = await instagramApi.getStatus(user.userId);
        setInstagramConnected(igResponse.data.connected);
        setInstagramUsername(igResponse.data.username);
      } catch {
        // Instagram not connected
      }
      
      try {
        // Check Facebook status (shares auth with Instagram)
        const fbResponse = await facebookApi.getStatus(user.userId);
        setFacebookConnected(fbResponse.data.connected);
        setFacebookPageName(fbResponse.data.pageName);
        setFacebookPageId(fbResponse.data.pageId);
      } catch {
        // Facebook not connected
      }
      
      // Check LinkedIn status
      try {
        const liResponse = await linkedinApi.getStatus(user.userId);
        setLinkedinConnected(liResponse.data.connected);
        setLinkedinName(liResponse.data.name);
      } catch {
        // LinkedIn not connected
      }
    };
    
    loadSocialData();
  }, [user?.userId, videoId]);

  // Social sharing handlers
  const handleGenerateMetadata = async (options?: { context?: string; useRoulette?: boolean }) => {
    if (!user?.userId || !videoId) return;

    // Always show modal first (unless called from modal with an option selected)
    if (options === undefined) {
      setShowContextModal(true);
      return;
    }

    setIsGeneratingMetadata(true);
    setSocialError(null);
    setShowContextModal(false);

    try {
      const response = await videosApi.generateSocialMetadata(user.userId, videoId, {
        userContext: options.useRoulette ? undefined : options.context,
      });
      const newMetadata = response.data.socialMetadata;
      setSocialMetadata(newMetadata);
      setEditedMetadata(newMetadata);
      setHookText(newMetadata.hook || '');

      // Update tokens in UI with actual value from backend
      if (response.data.tokensRemaining !== undefined) {
        dispatch(setTokensRemaining(response.data.tokensRemaining));
      }

      setSocialSuccess('Social metadata generated! (10 credits used)');
      setTimeout(() => setSocialSuccess(null), 3000);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.error === 'Insufficient credits') {
        showSocialError(`Insufficient credits. You need ${errorData.required} credits but have ${errorData.available}. Add credits or enter metadata manually.`);
      } else if (errorData?.error === 'uploaded_needs_context') {
        // Show context modal for uploaded videos
        setShowContextModal(true);
      } else {
        showSocialError(errorData?.error || 'Failed to generate metadata');
      }
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!user?.userId || !videoId || !hookText.trim()) {
      showSocialError('Please enter hook text for the thumbnail');
      return;
    }
    // Filter out the toggle marker
    const realSelectedIds = selectedCharacterIds.filter(id => id !== 'toggle_open');

    // Validate based on generation mode
    if (thumbnailGenMode === 'images' && realSelectedIds.length === 0) {
      showSocialError('Please select at least one image');
      return;
    }
    if (thumbnailGenMode === 'text' && !thumbnailDescription.trim()) {
      showSocialError('Please enter a description for the thumbnail');
      return;
    }

    setIsGeneratingThumbnail(true);
    setSocialError(null);

    try {
      // Convert selected image IDs to source identifiers (not URLs!)
      // Backend will generate fresh presigned URLs from stored S3 keys
      const selectedImageUrls: string[] = [];
      if (thumbnailGenMode === 'images') {
        realSelectedIds.forEach(id => {
          // Handle different ID formats - pass source identifiers, not URLs
          if (id.startsWith('ai_thumb_')) {
            // AI-generated thumbnail: ai_thumb_N → generated:N
            const idx = parseInt(id.replace('ai_thumb_', ''));
            selectedImageUrls.push(`generated:${idx}`);
          } else if (id.endsWith('_seedream')) {
            // Seedream reference: characterId_seedream → seedream:characterId
            const charId = id.replace('_seedream', '');
            selectedImageUrls.push(`seedream:${charId}`);
          } else if (id.startsWith('scene_')) {
            // Video scene: scene_N → scene:N
            const idx = parseInt(id.replace('scene_', ''));
            selectedImageUrls.push(`scene:${idx}`);
          } else if (id === 'original_thumb') {
            // Original thumbnail → thumbnail
            selectedImageUrls.push('thumbnail');
          } else if (id.startsWith('upload_')) {
            // User-uploaded custom thumbnail - pass data URL (backend will upload to S3)
            const idx = parseInt(id.replace('upload_', ''));
            const thumb = uploadedCustomThumbnails[idx];
            if (thumb?.dataUrl) selectedImageUrls.push(thumb.dataUrl);
          }
        });
      }

      const response = await videosApi.generateSocialThumbnail(user.userId, videoId, {
        hookText,
        thumbnailDescription: thumbnailDescription.trim() || undefined,
        selectedImageUrls: selectedImageUrls.length > 0 ? selectedImageUrls : undefined,
      });
      const newThumbnailUrl = response.data.thumbnailUrl;
      setSocialThumbnailUrl(newThumbnailUrl);
      setSelectedThumbnailUrl(newThumbnailUrl);
      // Add to generated thumbnails list (don't duplicate)
      setGeneratedThumbnails(prev => 
        prev.includes(newThumbnailUrl) ? prev : [...prev, newThumbnailUrl]
      );
      setLocalThumbnailFile(null); // Clear any custom upload
      
      // Update tokens in UI with actual value from backend
      if (response.data.tokensRemaining !== undefined) {
        dispatch(setTokensRemaining(response.data.tokensRemaining));
      }
      
      setSocialSuccess('Thumbnail generated! (10 credits used)');
      setTimeout(() => setSocialSuccess(null), 3000);
    } catch (err: any) {
      showSocialError(err.response?.data?.error || 'Failed to generate thumbnail');
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Simple: process each file and update state
    fileArray.forEach((file, index) => {
      if (index >= 3) return; // Max 3
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        setUploadedCustomThumbnails(prev => {
          const newThumb = { dataUrl, file };
          
          if (prev.length < 3) {
            // Add to existing
            return [...prev, newThumb];
          } else {
            // Replace from the end backwards
            const slotToReplace = 2 - (index % 3); // 2, 1, 0 pattern
            const updated = [...prev];
            updated[slotToReplace] = newThumb;
            return updated;
          }
        });
        
        // Select this thumbnail
        setSelectedThumbnailUrl(dataUrl);
        setSocialThumbnailUrl(dataUrl);
        setLocalThumbnailFile({ dataUrl, file });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';

    // Reset input so same file can be selected again
    event.target.value = '';
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const tagToAdd = newTag.trim();
    setEditedMetadata(prev => {
      const currentTags = prev?.tags || [];
      // Avoid duplicates
      if (currentTags.includes(tagToAdd)) {
        return prev;
      }
      return {
        title: prev?.title || '',
        description: prev?.description || '',
        tags: [...currentTags, tagToAdd],
        hook: prev?.hook || '',
        location: prev?.location,
      };
    });
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (editedMetadata) {
      const updatedTags = editedMetadata.tags.filter(tag => tag !== tagToRemove);
      setEditedMetadata({ ...editedMetadata, tags: updatedTags });
    }
  };

  // Check if user has a subscription (starter, pro, or premium)
  const hasSubscription = subscription?.tier === 'starter' || subscription?.tier === 'pro' || subscription?.tier === 'premium';

  const handleConnectYouTube = async () => {
    if (!user?.userId) return;
    
    // Check subscription before allowing social sharing
    if (!hasSubscription) {
      navigate('/payment');
      return;
    }
    
    try {
      const response = await youtubeApi.getAuthUrl(user.userId);
      const { authUrl } = response.data;
      
      // Redirect to OAuth - the callback page will handle the response
      window.location.href = authUrl;
      
    } catch (err: any) {
      showSocialError(err.response?.data?.error || 'Failed to start YouTube authorization');
    }
  };

  const handleConnectTikTok = async () => {
    if (!user?.userId) return;
    
    // Check subscription before allowing social sharing
    if (!hasSubscription) {
      navigate('/payment');
      return;
    }
    
    try {
      const response = await tiktokApi.getAuthUrl(user.userId);
      const { authUrl } = response.data;
      
      // Redirect to OAuth - the callback page will handle the response
      window.location.href = authUrl;
      
    } catch (err: any) {
      showSocialError(err.response?.data?.error || 'Failed to start TikTok authorization');
    }
  };

  const handleConnectInstagram = async () => {
    if (!user?.userId) return;
    
    // Check subscription before allowing social sharing
    if (!hasSubscription) {
      navigate('/payment');
      return;
    }
    
    try {
      const response = await instagramApi.getAuthUrl(user.userId);
      const { authUrl } = response.data;
      
      // Redirect to OAuth - the callback page will handle the response
      window.location.href = authUrl;
      
    } catch (err: any) {
      showSocialError(err.response?.data?.error || 'Failed to start Instagram authorization');
    }
  };

  const handleConnectLinkedin = async () => {
    if (!user?.userId) return;
    
    // Check subscription before allowing social sharing
    if (!hasSubscription) {
      navigate('/payment');
      return;
    }
    
    try {
      const response = await linkedinApi.getAuthUrl(user.userId);
      const { authUrl } = response.data;
      
      // Redirect to OAuth - the callback page will handle the response
      window.location.href = authUrl;
      
    } catch (err: any) {
      showSocialError(err.response?.data?.error || 'Failed to start LinkedIn authorization');
    }
  };

  const handleYouTubeUpload = async () => {
    if (!user?.userId || !videoId) return;
    
    // Check subscription before allowing social sharing
    if (!hasSubscription) {
      navigate('/payment');
      return;
    }
    
    // Check if video is ready
    if (!videoData?.videoUrl) {
      showSocialError('Video is still processing. Please wait until it\'s ready.');
      return;
    }
    
    if (!youtubeConnected) {
      handleConnectYouTube();
      return;
    }
    
    if (!editedMetadata?.title) {
      showSocialError('Please enter a title for your video');
      return;
    }
    
    setIsUploading(true);
    setSocialError(null);
    
    try {
      // If user uploaded a custom thumbnail, upload it first
      if (localThumbnailFile) {
        try {
          const thumbnailResponse = await videosApi.uploadThumbnail(user.userId, videoId, {
            thumbnailBase64: localThumbnailFile.dataUrl,
          });
          setSocialThumbnailUrl(thumbnailResponse.data.thumbnailUrl);
          setLocalThumbnailFile(null); // Clear local file after successful upload
        } catch (err: any) {
          console.error('Failed to upload custom thumbnail:', err);
          // Continue with upload even if thumbnail fails
        }
      }
      
      // Save metadata (in case user manually entered it)
      await videosApi.updateSocialMetadata(user.userId, videoId, {
        title: editedMetadata.title,
        description: editedMetadata.description || '',
        tags: editedMetadata.tags || [],
        hook: editedMetadata.hook || hookText || '',
        videoFooter: videoFooter || '',
      });
      
      // Then upload to YouTube
      // Only add thumbnail intro for portrait videos (shorts)
      const shouldAddThumbnailIntro = videoData?.aspectRatio === 'portrait' ? addThumbnailIntro : false;
      const response = await videosApi.uploadToYouTube(user.userId, videoId, { addThumbnailIntro: shouldAddThumbnailIntro });
      setYoutubeUrl(response.data.youtubeUrl);
      // Individual platform banner will show instead of generic socialSuccess
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to upload to YouTube';
      if (errorMsg.includes('not connected') || errorMsg.includes('reconnect')) {
        setYoutubeConnected(false);
      }
      showSocialError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTikTokUpload = async () => {
    if (!user?.userId || !videoId) return;
    
    // Check subscription before allowing social sharing
    if (!hasSubscription) {
      navigate('/payment');
      return;
    }
    
    // Check if video is ready
    if (!videoData?.videoUrl) {
      showSocialError('Video is still processing. Please wait until it\'s ready.');
      return;
    }
    
    if (!tiktokConnected) {
      handleConnectTikTok();
      return;
    }
    
    if (!editedMetadata?.title) {
      showSocialError('Please enter a title for your video');
      return;
    }
    
    setIsUploading(true);
    setSocialError(null);
    
    try {
      // Save metadata first
      await videosApi.updateSocialMetadata(user.userId, videoId, {
        title: editedMetadata.title,
        description: editedMetadata.description || '',
        tags: editedMetadata.tags || [],
        hook: editedMetadata.hook || hookText || '',
        videoFooter: videoFooter || '',
      });
      
      // Upload to TikTok with user's selected settings
      await tiktokApi.upload(user.userId, videoId, {
        postMode: tiktokPostMode,
        privacyLevel: tiktokPrivacyLevel,
        allowComment: tiktokAllowComment,
        allowDuet: tiktokAllowDuet,
        allowStitch: tiktokAllowStitch,
        discloseContent: tiktokDiscloseContent,
        brandOrganic: tiktokBrandOrganic,
        brandedContent: tiktokBrandedContent,
      });
      setTiktokUploaded(true);
      // Individual platform banner will show instead of generic socialSuccess
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to upload to TikTok';
      if (errorMsg.includes('not connected') || errorMsg.includes('reconnect')) {
        setTiktokConnected(false);
      }
      showSocialError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInstagramUpload = async () => {
    if (!user?.userId || !videoId) return;
    
    // Check subscription before allowing social sharing
    if (!hasSubscription) {
      navigate('/payment');
      return;
    }
    
    // Check if video is ready
    if (!videoData?.videoUrl) {
      showSocialError('Video is still processing. Please wait until it\'s ready.');
      return;
    }
    
    if (!instagramConnected) {
      handleConnectInstagram();
      return;
    }
    
    if (!editedMetadata?.title) {
      showSocialError('Please enter a title for your video');
      return;
    }
    
    setIsUploading(true);
    setSocialError(null);
    
    try {
      // Save metadata first
      await videosApi.updateSocialMetadata(user.userId, videoId, {
        title: editedMetadata.title,
        description: editedMetadata.description || '',
        tags: editedMetadata.tags || [],
        hook: editedMetadata.hook || hookText || '',
        videoFooter: videoFooter || '',
      });
      
      // Upload to Instagram
      const response = await instagramApi.upload(user.userId, videoId);
      setSocialSuccess(response.data.message || 'Posted to Instagram as a Reel!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to upload to Instagram';
      if (errorMsg.includes('not connected') || errorMsg.includes('reconnect')) {
        setInstagramConnected(false);
      }
      showSocialError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGoBack = useCallback(() => {
    navigate('/my-videos');
  }, [navigate]);

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  const handleDownload = useCallback(async () => {
    if (!videoData?.videoUrl) return;
    
    try {
      const response = await fetch(videoData.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${videoData.songTitle || 'music-video'}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, [videoData]);
  
  const handleDelete = useCallback(async () => {
    if (!user?.userId || !videoId) return;
    
    setIsDeleting(true);
    try {
      await videosApi.deleteVideo(user.userId, videoId);
      setShowDeleteDialog(false);
      // Navigate back to library after successful deletion
      navigate('/my-videos');
    } catch (err: any) {
      console.error('Failed to delete video:', err);
      setSocialError(err.response?.data?.error || 'Failed to delete video');
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  }, [user?.userId, videoId, navigate]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Clean lyrics (remove section tags)
  const cleanLyrics = (lyrics: string): string => {
    return lyrics
      .replace(/\[(intro|verse|chorus|bridge|outro|hook|pre-chorus)\]/gi, '')
      .trim();
  };

  // Memoize image URLs and preload them (must be before early returns)
  const genreImageUrl = useMemo(() => {
    if (!songData?.genre) return null;
    const genre = songData.genre.toLowerCase().replace(/\s+/g, '-');
    // Handle filename mismatches
    const genreFileMap: Record<string, string> = {
      'r&b': 'rnb',
      'rnb': 'rnb',
      'reggaeton': 'raggaeton',
      'reggae': 'raggae',
      'classical': 'classic',
      'gospel': 'gospels',
      'tropical-house': 'chillout',
      'chill': 'chillout',
      'chillout': 'chillout',
    };
    const fileName = genreFileMap[genre] || genre;
    const url = `/genres/${fileName}.jpeg`;
    preloadImage(url);
    return url;
  }, [songData?.genre]);

  const moodImageUrl = useMemo(() => {
    if (!songData?.mood) return null;
    const mood = songData.mood.toLowerCase();
    // Handle filename mismatches
    const moodFileMap: Record<string, string> = {
      'peaceful': 'peacful', // typo in filename
    };
    const fileName = moodFileMap[mood] || mood;
    const url = `/moods/${fileName}.jpeg`;
    preloadImage(url);
    return url;
  }, [songData?.mood]);

  // Preload video thumbnail (must be before early returns)
  useEffect(() => {
    if (videoData?.thumbnailUrl) {
      preloadImage(videoData.thumbnailUrl);
    }
  }, [videoData?.thumbnailUrl]);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <CircularProgress sx={{ color: '#007AFF', mb: 2 }} size={48} />
        <Typography sx={{ color: '#fff' }}>Loading video...</Typography>
      </Box>
    );
  }

  // Error state
  if (error || !videoData?.videoUrl) {
    const isProcessing = videoData && !videoData.videoUrl && videoData.status !== 'failed';
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f7',
        }}
      >
        {isProcessing ? (
          <>
            <CircularProgress sx={{ mb: 2, color: '#007AFF' }} />
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
              Video is still processing...
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
              Please check back in a few moments
            </Typography>
          </>
        ) : (
          <Typography variant="h6" sx={{ color: '#FF3B30', mb: 2 }}>
            {error || 'Video not available'}
          </Typography>
        )}
        <Button 
          onClick={handleGoBack} 
          startIcon={<ArrowBack />}
          sx={{ color: '#007AFF' }}
        >
          Back to Videos
        </Button>
      </Box>
    );
  }

  const lyrics = songData?.lyrics || songData?.lyricsRaw || '';
  // Use video's saved durationSeconds first, then song's actual duration, then video element duration
  const displayDuration = videoData?.durationSeconds || songData?.actualDuration || songData?.estimatedDuration || duration;

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Box sx={{ pt: { xs: 0, md: 2 }, px: { xs: 2, sm: 3, md: 4 }, pb: 16 }}>
      {/* Top Schedule Banner */}
      {scheduleBanner.show && (
        <Box
          sx={{
            mb: 3,
            borderRadius: '12px',
            background: scheduleBanner.type === 'success'
              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            color: '#fff',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 4px 12px rgba(255,255,255,0.15)',
          }}
        >
          {scheduleBanner.type === 'success' ? (
            <CheckCircle sx={{ fontSize: 24 }} />
          ) : (
            <Error sx={{ fontSize: 24 }} />
          )}
          <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
            {scheduleBanner.message}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setScheduleBanner({ ...scheduleBanner, show: false })}
            sx={{ color: '#fff', ml: 'auto', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      )}
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
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
          <VideoLibraryIcon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
            {videoData.songTitle || 'Music Video'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Watch, edit, and share your video
          </Typography>
        </Box>
      </Box>

      <Container maxWidth={false} sx={{ px: 0 }} disableGutters>
        {/* Video + Details - Portrait: side-by-side, Landscape: stacked */}
        <Box sx={{
          display: videoData.aspectRatio === 'landscape' ? 'flex' : 'grid',
          flexDirection: videoData.aspectRatio === 'landscape' ? 'column' : undefined,
          gridTemplateColumns: videoData.aspectRatio === 'landscape' ? undefined : 'auto 1fr',
          alignItems: videoData.aspectRatio === 'landscape' ? undefined : 'stretch',
          gap: { xs: 2, sm: 3 },
          mb: 3
        }}>
          {/* Video Player */}
          <Paper
            ref={containerRef}
            elevation={0}
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              background: '#000',
              position: 'relative',
              aspectRatio: videoData.aspectRatio === 'landscape' ? '16/9' : '9/16',
              height: videoData.aspectRatio === 'landscape'
                ? 'auto'
                : '100%',
              minHeight: videoData.aspectRatio === 'landscape'
                ? undefined
                : { xs: 200, sm: 240, md: 280 },
              maxHeight: videoData.aspectRatio === 'landscape'
                ? undefined
                : { xs: 400, sm: 450, md: 500 },
              width: videoData.aspectRatio === 'landscape'
                ? '100%'
                : 'auto',
              flexShrink: 0,
            }}
          >
              {/* Video Element */}
              <video
                ref={videoRef}
                src={videoData.videoUrl}
                poster={videoData.thumbnailUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleVideoEnded}
                onWaiting={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onError={(e) => {
                  console.error('[Video] Failed to load video:', e);
                  // Video failed to load - likely expired URL, trigger refetch
                  setError('Video failed to load. Please refresh the page to get a new link.');
                }}
                onClick={handlePlayPause}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  cursor: 'pointer',
                }}
              />

              {/* Buffering Indicator */}
              {isBuffering && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}
                >
                  <CircularProgress sx={{ color: '#fff' }} size={64} />
                </Box>
              )}


              {/* Control Bar */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handlePlayPause} sx={{ color: '#fff' }}>
                    {isPlaying ? <Pause /> : <PlayArrowRounded />}
                  </IconButton>
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton onClick={handleFullscreenToggle} sx={{ color: '#fff' }}>
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Box>
              </Box>

              {/* Progress Bar */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 60,
                  left: 16,
                  right: 16,
                  height: 4,
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: 2,
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  if (!videoRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  videoRef.current.currentTime = percent * duration;
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${(currentTime / duration) * 100}%`,
                    background: 'linear-gradient(90deg, #007AFF, #5856D6)',
                    borderRadius: 2,
                    transition: 'width 0.1s linear',
                  }}
                />
              </Box>
          </Paper>

          {/* Video Details - Right side, aligned to bottom */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minWidth: 0,
          }}>
            {/* Tags */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
              {genreImageUrl && songData?.genre && (
                <Chip
                  icon={
                    <Box
                      component="img"
                      src={genreImageUrl}
                      alt={songData.genre}
                      sx={{ width: { xs: 14, sm: 16 }, height: { xs: 14, sm: 16 }, borderRadius: '50%', objectFit: 'cover', ml: 0.5 }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                    />
                  }
                  label={songData.genre}
                  size="small"
                  sx={{ height: { xs: 20, sm: 24 }, fontSize: { xs: '0.65rem', sm: '0.75rem' }, background: 'rgba(0,122,255,0.15)', color: '#fff', border: '1px solid rgba(0,122,255,0.3)' }}
                />
              )}
              {moodImageUrl && songData?.mood && (
                <Chip
                  icon={
                    <Box
                      component="img"
                      src={moodImageUrl}
                      alt={songData.mood}
                      sx={{ width: { xs: 14, sm: 16 }, height: { xs: 14, sm: 16 }, borderRadius: '50%', objectFit: 'cover', ml: 0.5 }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                    />
                  }
                  label={songData.mood}
                  size="small"
                  sx={{ height: { xs: 20, sm: 24 }, fontSize: { xs: '0.65rem', sm: '0.75rem' }, background: 'rgba(88,86,214,0.15)', color: '#fff', border: '1px solid rgba(88,86,214,0.3)' }}
                />
              )}
              {videoData.videoType && (
                <Chip
                  icon={<Movie sx={{ fontSize: { xs: 12, sm: 14 }, color: '#FF9500' }} />}
                  label={videoData.videoType === 'still' ? 'Still' : 'Cinematic'}
                  size="small"
                  sx={{ height: { xs: 20, sm: 24 }, fontSize: { xs: '0.65rem', sm: '0.75rem' }, background: 'rgba(255,149,0,0.15)', color: '#fff', border: '1px solid rgba(255,149,0,0.3)' }}
                />
              )}
            </Box>
            
            {/* Title */}
            <Typography
              sx={{
                fontWeight: 800,
                color: '#fff',
                fontSize: { xs: '1.1rem', sm: '1.5rem' },
                lineHeight: 1.2,
                mb: 0.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {videoData.songTitle || 'Music Video'}
            </Typography>

            {/* Metadata line: Duration • Aspect • Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexWrap: 'wrap', mb: 1.5 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {formatTime(displayDuration)}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>•</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {videoData.aspectRatio === 'landscape' ? '16:9' : '9:16'}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>•</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {formatDate(videoData.createdAt)}
              </Typography>
            </Box>
            
            {/* Action Buttons - Share and Download */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Post Button - Icon on xs/sm, full button on md+ */}
              <IconButton
                onClick={() => {
                  const element = socialSectionRef.current || document.getElementById('social-sharing-section');
                  if (element) {
                    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top: elementPosition - 100, behavior: 'smooth' });
                  }
                }}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  bgcolor: '#007AFF',
                  color: '#fff',
                  width: 36,
                  height: 36,
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': { bgcolor: '#0066CC' },
                }}
              >
                <CloudUpload sx={{ fontSize: 18 }} />
              </IconButton>
              <Button
                onClick={() => {
                  const element = socialSectionRef.current || document.getElementById('social-sharing-section');
                  if (element) {
                    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top: elementPosition - 100, behavior: 'smooth' });
                  }
                }}
                variant="contained"
                startIcon={<CloudUpload sx={{ fontSize: 20 }} />}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  bgcolor: '#007AFF',
                  color: '#fff',
                  borderRadius: '10px',
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': { bgcolor: '#0066CC' },
                }}
              >
                Post
              </Button>
              
              {/* Download Button - Ghost style with blue icon */}
              <IconButton
                onClick={handleDownload}
                disabled={!videoData.videoUrl}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  border: '1px solid #3B82F6',
                  color: '#3B82F6',
                  width: 36,
                  height: 36,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#3B82F6',
                    bgcolor: 'transparent',
                    boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)',
                  },
                  '&:disabled': { opacity: 0.4 },
                }}
              >
                <Download sx={{ fontSize: 18 }} />
              </IconButton>
              <GhostButton
                onClick={handleDownload}
                disabled={!videoData.videoUrl}
                startIcon={<Download sx={{ fontSize: 20 }} />}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  px: 2,
                  py: 0.75,
                  fontSize: '0.9rem',
                  '&:disabled': { opacity: 0.4 },
                }}
              >
                Download
              </GhostButton>

              {/* Delete Button - Ghost style with red icon and shadow */}
              <IconButton
                onClick={() => setShowDeleteDialog(true)}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  border: '1px solid #FF3B30',
                  color: '#FF3B30',
                  width: 36,
                  height: 36,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#FF3B30',
                    bgcolor: 'transparent',
                    boxShadow: '0 0 12px rgba(255, 59, 48, 0.4)',
                  },
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
                  color: '#fff',
                  borderColor: '#FF3B30',
                  borderRadius: '12px',
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#FF3B30',
                    bgcolor: 'transparent',
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
            
        {/* Collapsible Lyrics Section - YouTube style dropdown (only show if lyrics exist) */}
        {lyrics && (
        <Box
          sx={{
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)',
            mb: 2,
          }}
        >
          <Box
            onClick={() => setShowLyrics(!showLyrics)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Lyrics sx={{ fontSize: 20, color: '#007AFF' }} />
              <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                Lyrics
              </Typography>
              {lyrics && (
                <Typography sx={{ color: '#86868B', fontSize: '0.8rem' }}>
                  • {lyrics.split('\n').filter(l => l.trim()).length} lines
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                transform: showLyrics ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                color: '#86868B',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </Box>
          </Box>
          
          {showLyrics && (
            <Box sx={{ px: 2, pb: 2, maxHeight: 300, overflow: 'auto' }}>
              <Typography
                sx={{
                  color: '#fff',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.9rem',
                }}
              >
                {cleanLyrics(lyrics)}
              </Typography>
            </Box>
          )}
        </Box>
        )}

        {/* Social Sharing Section */}
        <Box
          ref={socialSectionRef}
          id="social-sharing-section"
        >
          {/* Alerts */}
          {socialError && (
            <Alert severity="error" onClose={() => setSocialError(null)} sx={{ mb: 2 }}>
              {socialError}
            </Alert>
          )}
          {socialSuccess && (
            <Alert
              severity="success"
              onClose={() => setSocialSuccess(null)}
              sx={{
                mb: 2,
                ...(socialSuccess.includes('Scheduled Posts') && {
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.12)' },
                }),
              }}
              onClick={() => {
                if (socialSuccess.includes('Scheduled Posts')) {
                  navigate('/content-calendar');
                }
              }}
            >
              {socialSuccess}
            </Alert>
          )}

          {/* Platform Selection - Own Paper Section */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Share sx={{ fontSize: 20, color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                Schedule Post
              </Typography>
            </Box>

            {/* Social Account Grid with names */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {/* YouTube Account */}
              <Box
                onClick={() => {
                                    if (!youtubeConnected) {
                    navigate('/settings/connected-accounts');
                  } else {
                    setSelectedPlatforms(prev =>
                      prev.includes('youtube')
                        ? prev.filter(p => p !== 'youtube')
                        : [...prev, 'youtube']
                    );
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  opacity: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                {/* Avatar circle */}
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: selectedPlatforms.includes('youtube')
                        ? '2.5px solid #34C759'
                        : 'none',
                      background: youtubeConnected ? '#FF0000' : 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: selectedPlatforms.includes('youtube') ? '0 0 12px rgba(52,199,89,0.4)' : 'none',
                    }}
                  >
                    <YouTube sx={{ fontSize: 24, color: '#fff' }} />
                  </Box>
                  {/* Selection checkmark */}
                  {selectedPlatforms.includes('youtube') && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        bgcolor: '#34C759',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check sx={{ fontSize: 12, color: '#fff' }} />
                    </Box>
                  )}
                </Box>
                {/* Account name */}
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: youtubeConnected ? '#fff' : 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                    maxWidth: 70,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {youtubeConnected ? (youtubeChannel?.channelTitle || 'YouTube') : 'Connect'}
                </Typography>
              </Box>

              {/* TikTok Account */}
              <Box
                onClick={() => {
                                    if (!tiktokConnected) {
                    navigate('/settings/connected-accounts');
                  } else {
                    setSelectedPlatforms(prev =>
                      prev.includes('tiktok')
                        ? prev.filter(p => p !== 'tiktok')
                        : [...prev, 'tiktok']
                    );
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  opacity: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: selectedPlatforms.includes('tiktok')
                        ? '2.5px solid #34C759'
                        : 'none',
                      background: tiktokConnected ? '#000' : 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: selectedPlatforms.includes('tiktok') ? '0 0 12px rgba(52,199,89,0.4)' : 'none',
                    }}
                  >
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 22, height: 22, fill: '#fff' }}>
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </Box>
                  </Box>
                  {selectedPlatforms.includes('tiktok') && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        bgcolor: '#34C759',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check sx={{ fontSize: 12, color: '#fff' }} />
                    </Box>
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: tiktokConnected ? '#fff' : 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                    maxWidth: 70,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tiktokConnected ? (tiktokUsername ? `@${tiktokUsername}` : 'TikTok') : 'Connect'}
                </Typography>
              </Box>

              {/* Instagram Account */}
              <Box
                onClick={() => {
                                    if (!instagramConnected) {
                    navigate('/settings/connected-accounts');
                  } else {
                    setSelectedPlatforms(prev =>
                      prev.includes('instagram')
                        ? prev.filter(p => p !== 'instagram')
                        : [...prev, 'instagram']
                    );
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  opacity: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: selectedPlatforms.includes('instagram')
                        ? '2.5px solid #34C759'
                        : 'none',
                      background: instagramConnected
                        ? 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)'
                        : 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: selectedPlatforms.includes('instagram') ? '0 0 12px rgba(52,199,89,0.4)' : 'none',
                    }}
                  >
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 22, height: 22, fill: '#fff' }}>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                      </Box>
                  </Box>
                  {selectedPlatforms.includes('instagram') && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        bgcolor: '#34C759',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check sx={{ fontSize: 12, color: '#fff' }} />
                    </Box>
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: instagramConnected ? '#fff' : 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                    maxWidth: 70,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {instagramConnected ? (instagramUsername ? `@${instagramUsername}` : 'Instagram') : 'Connect'}
                </Typography>
              </Box>

              {/* Facebook Account */}
              <Box
                onClick={() => {
                                    if (!facebookConnected) {
                    navigate('/settings/connected-accounts');
                  } else {
                    setSelectedPlatforms(prev =>
                      prev.includes('facebook')
                        ? prev.filter(p => p !== 'facebook')
                        : [...prev, 'facebook']
                    );
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  opacity: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: selectedPlatforms.includes('facebook')
                        ? '2.5px solid #34C759'
                        : 'none',
                      background: facebookConnected ? '#1877F2' : 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: selectedPlatforms.includes('facebook') ? '0 0 12px rgba(52,199,89,0.4)' : 'none',
                    }}
                  >
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 22, height: 22, fill: '#fff' }}>
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </Box>
                  </Box>
                  {selectedPlatforms.includes('facebook') && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        bgcolor: '#34C759',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check sx={{ fontSize: 12, color: '#fff' }} />
                    </Box>
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: facebookConnected ? '#fff' : 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                    maxWidth: 70,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {facebookConnected ? (facebookPageName || 'Facebook') : 'Connect'}
                </Typography>
              </Box>

              {/* LinkedIn Account */}
              <Box
                onClick={() => {
                                    if (!linkedinConnected) {
                    navigate('/settings/connected-accounts');
                  } else {
                    setSelectedPlatforms(prev =>
                      prev.includes('linkedin')
                        ? prev.filter(p => p !== 'linkedin')
                        : [...prev, 'linkedin']
                    );
                  }
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  opacity: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      border: selectedPlatforms.includes('linkedin')
                        ? '2.5px solid #34C759'
                        : 'none',
                      background: linkedinConnected ? '#0077B5' : 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: selectedPlatforms.includes('linkedin') ? '0 0 12px rgba(52,199,89,0.4)' : 'none',
                    }}
                  >
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 22, height: 22, fill: '#fff' }}>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </Box>
                  </Box>
                  {selectedPlatforms.includes('linkedin') && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        bgcolor: '#34C759',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check sx={{ fontSize: 12, color: '#fff' }} />
                    </Box>
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: linkedinConnected ? '#fff' : 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                    maxWidth: 70,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {linkedinConnected ? (linkedinName || 'LinkedIn') : 'Connect'}
                </Typography>
              </Box>

              {/* Add More Account Button */}
              <Box
                onClick={() => navigate('/settings/connected-accounts')}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: '2px dashed rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.4)',
                      background: 'rgba(255,255,255,0.06)',
                    },
                  }}
                >
                  <Add sx={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.4)',
                    textAlign: 'center',
                  }}
                >
                  Add
                </Typography>
              </Box>
            </Box>

            {/* Divider between social accounts and post details */}
            <Box sx={{ my: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }} />

            {/* Post Details Section */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
              {/* Generate Post Metadata button */}
              <Button
                variant="contained"
                size="small"
                startIcon={!isGeneratingMetadata && <AutoAwesome sx={{ fontSize: 18 }} />}
                endIcon={!isGeneratingMetadata && (
                  <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid rgba(255,255,255,0.3)', pl: 1.5, ml: 0.5 }}>
                    <Typography component="span" sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>10</Typography>
                    <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 400, mx: 0.5, color: '#fff' }}>x</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}><GruviCoin size={16} /></Box>
                  </Box>
                )}
                onClick={() => handleGenerateMetadata()}
                disabled={isGeneratingMetadata}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  py: { xs: 0.5, sm: 1 },
                  px: { xs: 1.25, sm: 2 },
                  color: '#fff',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #a0a0a0 0%, #808080 100%)',
                    boxShadow: 'none',
                  },
                }}
              >
                {isGeneratingMetadata ? <><CircularProgress size={14} sx={{ color: '#fff', mr: 1 }} /> Generating...</> : 'Generate Post Metadata'}
              </Button>
            </Box>


            {/* Title (Hook) */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Title (Hook)
                </Typography>
                <Tooltip
                  title="The hook is the attention-grabbing first line viewers see. Make it compelling to stop the scroll!"
                  arrow
                  placement="top"
                >
                  <InfoOutlined sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', cursor: 'help' }} />
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                value={editedMetadata?.title || ''}
                onChange={(e) => setEditedMetadata(prev => ({
                  title: e.target.value,
                  description: prev?.description || '',
                  tags: prev?.tags || [],
                  hook: prev?.hook || '',
                  location: prev?.location,
                }))}
                inputProps={{ maxLength: 100 }}
                helperText={`${editedMetadata?.title?.length || 0}/100`}
                placeholder="Enter a catchy title"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    '& .MuiOutlinedInput-input': { py: 1.5, px: 2 },
                    '& fieldset': { borderColor: editedMetadata?.title ? '#007AFF' : 'rgba(255,255,255,0.1)', borderWidth: editedMetadata?.title ? '2px' : '1px' },
                    '&:hover fieldset': { borderColor: editedMetadata?.title ? '#007AFF' : 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
                  },
                  '& .MuiInputBase-input': {
                    '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'rgba(255,255,255,0.5)',
                  },
                }}
              />
            </Box>

            {/* Description */}
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                value={editedMetadata?.description || ''}
                onChange={(e) => setEditedMetadata(prev => ({
                  title: prev?.title || '',
                  description: e.target.value,
                  tags: prev?.tags || [],
                  hook: prev?.hook || '',
                  location: prev?.location,
                }))}
                multiline
                rows={5}
                placeholder="Describe your video..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    '& fieldset': { borderColor: editedMetadata?.description ? '#007AFF' : 'rgba(255,255,255,0.1)', borderWidth: editedMetadata?.description ? '2px' : '1px' },
                    '&:hover fieldset': { borderColor: editedMetadata?.description ? '#007AFF' : 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
                  },
                  '& .MuiInputBase-input': {
                    '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                  },
                }}
              />
            </Box>

            {/* Video Footer */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Video Footer
                </Typography>
                <Tooltip
                  title="Text that will be appended to the end of your video descriptions. Great for brand links, social handles, or subscribe prompts. This persists across all your videos."
                  arrow
                  placement="top"
                >
                  <InfoOutlined sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', cursor: 'help' }} />
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                value={videoFooter}
                onChange={(e) => setVideoFooter(e.target.value)}
                multiline
                rows={3}
                placeholder="e.g., Follow me for more content! Check out my website: https://mysite.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    '& fieldset': { borderColor: videoFooter ? '#007AFF' : 'rgba(255,255,255,0.1)', borderWidth: videoFooter ? '2px' : '1px' },
                    '&:hover fieldset': { borderColor: videoFooter ? '#007AFF' : 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
                  },
                  '& .MuiInputBase-input': {
                    '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, display: 'block' }}>
                This footer is saved and will be used for all your videos
              </Typography>
            </Box>

            {/* Tags */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                Tags
              </Typography>
              {editedMetadata?.tags && editedMetadata.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                  {editedMetadata.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      onDelete={() => handleRemoveTag(tag)}
                      sx={{
                        borderRadius: '100px',
                        bgcolor: 'transparent',
                        border: '1.5px solid #007AFF',
                        color: '#fff',
                        fontWeight: 500,
                        '& .MuiChip-deleteIcon': { color: '#007AFF' },
                      }}
                    />
                  ))}
                </Box>
              )}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  sx={{
                    flex: 1,
                    maxWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputBase-input': {
                      '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                    },
                  }}
                />
                <IconButton
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  size="small"
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'rgba(255,255,255,0.1)',
                    '&:hover': { background: 'rgba(255,255,255,0.15)' },
                  }}
                >
                  <Add sx={{ color: '#fff' }} />
                </IconButton>
              </Box>
            </Box>

            {/* Thumbnail Section */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
              Select Thumbnail
            </Typography>
            
            {/* Thumbnail Options Grid */}
            {(() => {
              const isLandscape = videoData?.aspectRatio === 'landscape';
              // Responsive thumbnail sizes - smaller on mobile
              const thumbWidth = { xs: isLandscape ? 120 : 68, sm: isLandscape ? 160 : 90 };
              const thumbHeight = { xs: isLandscape ? 68 : 120, sm: isLandscape ? 90 : 160 };
              
              // All available thumbnails: original + AI generated + uploaded customs
              const thumbnailOptions: { url: string; label: string; type: 'original' | 'ai' | 'custom'; dataUrl?: string }[] = [];
              
              // Add original video thumbnail
              if (videoData?.thumbnailUrl) {
                thumbnailOptions.push({ url: videoData.thumbnailUrl, label: 'Original', type: 'original' });
              }
              
              // Add AI generated thumbnails
              generatedThumbnails.forEach((url, idx) => {
                thumbnailOptions.push({ url, label: `AI #${idx + 1}`, type: 'ai' });
              });
              
              // Add custom uploaded thumbnails (up to 3 persisted)
              uploadedCustomThumbnails.forEach((thumb, idx) => {
                thumbnailOptions.push({ 
                  url: thumb.dataUrl, 
                  label: `Upload #${idx + 1}`, 
                  type: 'custom',
                  dataUrl: thumb.dataUrl,
                });
              });
              
              const showCreatePanel = selectedCharacterIds.length > 0;

              // Auto-select first thumbnail if none selected
              if (thumbnailOptions.length > 0 && !selectedThumbnailUrl) {
                const firstUrl = thumbnailOptions[0].type === 'custom' ? thumbnailOptions[0].dataUrl! : thumbnailOptions[0].url;
                setSelectedThumbnailUrl(firstUrl);
                setSocialThumbnailUrl(firstUrl);
              }

              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
                  {/* Existing thumbnail options */}
                  {thumbnailOptions.map((thumb, idx) => {
                    const isSelected = thumb.type === 'custom' 
                      ? selectedThumbnailUrl === thumb.dataUrl
                      : selectedThumbnailUrl === thumb.url;
                    const thumbUrl = thumb.type === 'custom' ? thumb.dataUrl! : thumb.url;
                    return (
                      <Box
                        key={`thumb-${thumb.type}-${idx}`}
                        onClick={() => {
                          setSelectedThumbnailUrl(thumbUrl);
                          setSocialThumbnailUrl(thumbUrl);
                          // Close the Create panel when selecting an existing thumbnail
                          setSelectedCharacterIds([]);
                        }}
                        sx={{
                          position: 'relative',
                          cursor: 'pointer',
                          borderRadius: 0.5,
                          overflow: 'hidden',
                          width: thumbWidth,
                          height: thumbHeight,
                          border: isSelected ? '3px solid #34C759' : '2px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 16px rgba(255,255,255,0.1)' },
                          '&:hover .expand-btn': { opacity: 1 },
                        }}
                      >
                        <Box
                          component="img"
                          src={thumbUrl}
                          alt={thumb.label}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        {/* Expand button overlay */}
                        <Box
                          className="expand-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxUrl(thumbUrl);
                          }}
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            width: 24,
                            height: 24,
                            borderRadius: '4px',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: { xs: 1, sm: 0 }, // Always visible on mobile, hover on desktop
                            transition: 'opacity 0.2s',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                          }}
                        >
                          <Fullscreen sx={{ fontSize: 16, color: '#fff' }} />
                        </Box>
                        {isSelected && (
                          <Box sx={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', bgcolor: '#34C759', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check sx={{ fontSize: 14, color: '#fff' }} />
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                  
                  {/* Create Custom Thumbnail Toggle */}
                  <Box
                    onClick={() => setSelectedCharacterIds(prev => prev.length === 0 ? ['toggle_open'] : [])}
                    sx={{
                      width: thumbWidth,
                      height: thumbHeight,
                      borderRadius: 0.5,
                      border: showCreatePanel ? '2px solid #007AFF' : '2px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      bgcolor: showCreatePanel ? 'rgba(0,122,255,0.08)' : 'rgba(255,255,255,0.03)',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: '#007AFF',
                        bgcolor: showCreatePanel ? 'rgba(0,122,255,0.12)' : 'rgba(0,122,255,0.04)',
                      },
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 20, color: '#007AFF', mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600, textAlign: 'center' }}>
                      Create
                    </Typography>
                  </Box>

                  {/* Upload Thumbnail Button */}
                  <Box
                    component="label"
                    sx={{
                      width: thumbWidth,
                      height: thumbHeight,
                      borderRadius: 0.5,
                      border: '2px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      bgcolor: 'rgba(255,255,255,0.03)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#007AFF',
                        bgcolor: 'rgba(0,122,255,0.04)',
                      },
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 20, color: '#007AFF', mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600, textAlign: 'center' }}>
                      Upload
                    </Typography>
                    <input type="file" hidden accept="image/*" multiple onChange={handleThumbnailUpload} />
                  </Box>
                </Box>
              );
            })()}
            
            {/* Create Custom Thumbnail Panel (shown when + is clicked) */}
            {selectedCharacterIds.length > 0 && (
              <Box sx={{ 
                mt: 2,
                p: 2,
                border: '1px solid rgba(0,122,255,0.2)', 
                borderRadius: '12px', 
                bgcolor: 'rgba(0,122,255,0.02)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoAwesome sx={{ fontSize: 20, color: '#007AFF' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                      Generate New Thumbnail
                    </Typography>
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => setSelectedCharacterIds([])}
                    sx={{ 
                      color: '#86868B',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.1)',
                      p: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: 16, lineHeight: 1 }}>×</Typography>
                  </IconButton>
                </Box>
                
                {/* Reference Image Selection */}
                {(() => {
                  const availableImages: { url: string; label: string; id: string }[] = [];
                  
                  // AI-generated thumbnails (most useful as references since they have the style we want)
                  generatedThumbnails.forEach((url, idx) => {
                    availableImages.push({
                      url,
                      label: `AI ${idx + 1}`,
                      id: `ai_thumb_${idx}`,
                    });
                  });
                  
                  // Seedream-generated reference images
                  videoCharacters.forEach((char) => {
                    const seedreamUrl = videoData?.seedreamReferenceUrls?.[char.characterId];
                    if (seedreamUrl) {
                      availableImages.push({
                        url: seedreamUrl,
                        label: char.characterName || 'Reference',
                        id: `${char.characterId}_seedream`,
                      });
                    }
                  });
                  
                  // Video scene images
                  videoData?.sceneImageUrls?.forEach((url, idx) => {
                    availableImages.push({ url, label: `Scene ${idx + 1}`, id: `scene_${idx}` });
                  });
                  
                  // Original thumbnail (video first frame)
                  if (videoData?.thumbnailUrl) {
                    availableImages.push({ url: videoData.thumbnailUrl, label: 'Video Frame', id: 'original_thumb' });
                  }
                  
                  // User-uploaded custom thumbnails
                  uploadedCustomThumbnails.forEach((thumb, idx) => {
                    availableImages.push({ url: thumb.dataUrl, label: `Upload ${idx + 1}`, id: `upload_${idx}` });
                  });
                  
                  const isLandscape = videoData?.aspectRatio === 'landscape';
                  // Responsive reference thumbnail sizes
                  const refThumbWidth = { xs: isLandscape ? 60 : 34, sm: isLandscape ? 80 : 45 };
                  const refThumbHeight = { xs: isLandscape ? 34 : 60, sm: isLandscape ? 45 : 80 };
                  const realSelectedIds = selectedCharacterIds.filter(id => id !== 'toggle_open');
                  const maxSelections = 3;
                  
                  return (
                    <>
                      {/* Generation Mode Toggle */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Box
                          onClick={() => setThumbnailGenMode('images')}
                          sx={{
                            flex: 1,
                            p: 1.5,
                            borderRadius: '10px',
                            border: `2px solid ${thumbnailGenMode === 'images' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                            bgcolor: thumbnailGenMode === 'images' ? 'rgba(0,122,255,0.08)' : 'rgba(255,255,255,0.03)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'center',
                            '&:hover': { borderColor: thumbnailGenMode === 'images' ? '#007AFF' : 'rgba(255,255,255,0.3)' },
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>
                            From Images
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                            Use reference images
                          </Typography>
                        </Box>
                        <Box
                          onClick={() => setThumbnailGenMode('text')}
                          sx={{
                            flex: 1,
                            p: 1.5,
                            borderRadius: '10px',
                            border: `2px solid ${thumbnailGenMode === 'text' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                            bgcolor: thumbnailGenMode === 'text' ? 'rgba(0,122,255,0.08)' : 'rgba(255,255,255,0.03)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'center',
                            '&:hover': { borderColor: thumbnailGenMode === 'text' ? '#007AFF' : 'rgba(255,255,255,0.3)' },
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>
                            From Text
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                            Describe your thumbnail
                          </Typography>
                        </Box>
                      </Box>

                      {/* Image Selection - Only show in images mode */}
                      {thumbnailGenMode === 'images' && (
                        <>
                          <Box sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                                Select reference images
                              </Typography>
                              <Typography variant="caption" sx={{
                                color: '#fff',
                                fontWeight: 600,
                                bgcolor: 'rgba(255,255,255,0.1)',
                                px: 1.5, py: 0.5, borderRadius: '100px',
                              }}>
                                {realSelectedIds.length}/{maxSelections}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#86868B', display: 'block', mt: 0.5 }}>
                              AI will use the selected images as a starting point
                            </Typography>
                          </Box>

                          {availableImages.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                              {availableImages.map((img) => {
                                const isSelected = realSelectedIds.includes(img.id);
                                const canSelect = isSelected || realSelectedIds.length < maxSelections;

                                return (
                                  <Box
                                    key={img.id}
                                    onClick={() => {
                                      if (!canSelect && !isSelected) return;
                                      setSelectedCharacterIds(prev => {
                                        const filtered = prev.filter(id => id !== 'toggle_open');
                                        const newIds = isSelected
                                          ? filtered.filter(id => id !== img.id)
                                          : [...filtered, img.id];
                                        return newIds.length === 0 ? ['toggle_open'] : newIds;
                                      });
                                    }}
                                    sx={{
                                      position: 'relative',
                                      cursor: canSelect ? 'pointer' : 'not-allowed',
                                      borderRadius: 0.5,
                                      overflow: 'hidden',
                                      border: isSelected ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                                      opacity: canSelect ? 1 : 0.4,
                                      transition: 'all 0.2s',
                                      '&:hover': canSelect ? { boxShadow: '0 2px 8px rgba(255,255,255,0.1)' } : {},
                                    }}
                                  >
                                    <Box component="img" src={img.url} alt={img.label} sx={{ width: refThumbWidth, height: refThumbHeight, objectFit: 'cover', display: 'block', minWidth: 0 }} />
                                    {isSelected && (
                                      <Box sx={{ position: 'absolute', top: 2, right: 2, width: 14, height: 14, borderRadius: '50%', bgcolor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Check sx={{ fontSize: 9, color: '#fff' }} />
                                      </Box>
                                    )}
                                  </Box>
                                );
                              })}
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
                              No reference images available
                            </Typography>
                          )}
                        </>
                      )}

                      {/* Hook Text */}
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                          Hook Text
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#86868B', display: 'block', mt: 0.5 }}>
                          Text overlay displayed on your thumbnail
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        value={hookText}
                        onChange={(e) => {
                          setHookText(e.target.value);
                          setEditedMetadata(prev => prev ? { ...prev, hook: e.target.value } : { title: '', description: '', tags: [], hook: e.target.value });
                        }}
                        placeholder="e.g., 'Epic Adventure Awaits!'"
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            fontSize: '0.9rem',
                            '& .MuiOutlinedInput-input': { py: 1.5, px: 2 },
                            '& fieldset': {
                              borderColor: hookText ? '#007AFF' : 'rgba(255,255,255,0.1)',
                              borderWidth: hookText ? '2px' : '1px',
                            },
                            '&:hover': { background: 'rgba(255,255,255,0.08)' },
                            '&:hover fieldset': { borderColor: hookText ? '#007AFF' : 'rgba(255,255,255,0.1)' },
                            '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
                          },
                          '& .MuiInputBase-input': {
                            '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                          },
                        }}
                      />

                      {/* Thumbnail Description */}
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                          Thumbnail Description {thumbnailGenMode === 'images' && <Typography component="span" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>(Optional)</Typography>}
                          {thumbnailGenMode === 'text' && <Typography component="span" sx={{ color: '#FF3B30', fontWeight: 400 }}>*</Typography>}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#86868B', display: 'block', mt: 0.5 }}>
                          {thumbnailGenMode === 'text' ? 'Describe the scene you want AI to generate' : 'Additional guidance for the AI to enhance your thumbnail'}
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        value={thumbnailDescription}
                        onChange={(e) => setThumbnailDescription(e.target.value)}
                        size="small"
                        multiline
                        rows={3}
                        placeholder={thumbnailGenMode === 'text'
                          ? "Describe the scene, characters, style, and mood for your thumbnail..."
                          : "e.g., 'Show the character looking up at the sky with a glowing aura'"
                        }
                        sx={{
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '16px',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            '& fieldset': {
                              borderColor: thumbnailDescription ? '#007AFF' : 'rgba(255,255,255,0.1)',
                              borderWidth: thumbnailDescription ? '2px' : '1px',
                            },
                            '&:hover fieldset': { borderColor: thumbnailDescription ? '#007AFF' : 'rgba(255,255,255,0.2)' },
                            '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
                          },
                          '& .MuiInputBase-input': {
                            '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                          },
                        }}
                      />

                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Button
                          variant="contained"
                          startIcon={isGeneratingThumbnail ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <AutoAwesome />}
                          onClick={handleGenerateThumbnail}
                          disabled={isGeneratingThumbnail || !hookText.trim() || (thumbnailGenMode === 'images' && realSelectedIds.length === 0) || (thumbnailGenMode === 'text' && !thumbnailDescription.trim())}
                          size="small"
                          sx={{ bgcolor: '#007AFF', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#0066DD' }, '&:disabled': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                        >
                          {isGeneratingThumbnail ? 'Generating...' : 'Generate (10 credits)'}
                        </Button>
                      </Box>
                    </>
                  );
                })()}
              </Box>
            )}

            {/* TikTok Specific Settings - shown when TikTok is selected */}
            {selectedPlatforms.includes('tiktok') && (
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Creator Info Header - Required by TikTok UX Guidelines */}
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
                    {tiktokCreatorInfoLoading ? (
                      'Loading account info...'
                    ) : tiktokCreatorInfo?.creatorNickname && tiktokCreatorInfo.creatorNickname !== tiktokUsername ? (
                      `@${tiktokUsername} (${tiktokCreatorInfo.creatorNickname})`
                    ) : tiktokUsername ? (
                      `@${tiktokUsername}`
                    ) : (
                      'Your TikTok account'
                    )}
                  </Typography>
                </Box>
                {tiktokCreatorInfoLoading && <CircularProgress size={16} sx={{ color: '#86868B' }} />}
              </Box>

              {/* Error message if can't post */}
              {tiktokCreatorInfoError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
                  {tiktokCreatorInfoError}
                </Alert>
              )}

              {/* Video duration info/warning */}
              {tiktokCreatorInfo && (videoData?.durationSeconds || displayDuration) && (() => {
                const videoDuration = videoData?.durationSeconds || displayDuration || 0;
                const maxDuration = tiktokCreatorInfo.maxVideoPostDurationSec;
                const exceeds = videoDuration > maxDuration;
                return (
                  <Alert severity={exceeds ? 'warning' : 'info'} sx={{ mb: 2, borderRadius: '10px' }}>
                    {exceeds
                      ? `Your video (${Math.round(videoDuration)}s) exceeds TikTok's maximum duration (${maxDuration}s). Please use a shorter video.`
                      : `Video duration: ${Math.round(videoDuration)}s (max ${maxDuration}s allowed)`
                    }
                  </Alert>
                );
              })()}

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
                  onClick={() => {
                    setTiktokPostMode('direct');
                  }}
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

              {/* Privacy Level - Options from API, NO default value (TikTok requirement) */}
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
                {/* Use options from creator_info API, fallback to defaults */}
                {(tiktokCreatorInfo?.privacyLevelOptions || ['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'FOLLOWER_OF_CREATOR', 'SELF_ONLY']).map((option) => (
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

              {/* Interaction Settings - Disabled if creator has them off in TikTok settings */}
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
                      sx={{
                        '&.Mui-disabled': { opacity: 0.3 },
                      }}
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
                      sx={{
                        '&.Mui-disabled': { opacity: 0.3 },
                      }}
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
                      sx={{
                        '&.Mui-disabled': { opacity: 0.3 },
                      }}
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

              {/* Processing Time Notice - TikTok UX Guideline Point 5d */}
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
                    ? <>After posting, it may take a few minutes for your video to appear on your TikTok profile.</>
                    : <>After posting, it may take a few minutes for your video to appear in your TikTok inbox.</>
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
              </Box>
            )}
          </Paper>

          {/* Upload Button */}
          {(() => {
            // TikTok validation checks
            const tiktokSelected = selectedPlatforms.includes('tiktok');
            // User must manually select privacy level (TikTok UX requirement - no default)
            const tiktokPrivacyMissing = tiktokSelected && tiktokPrivacyLevel === '';
            const videoDurationForCheck = videoData?.durationSeconds || displayDuration || 0;
            const tiktokDurationExceeds = tiktokSelected && tiktokCreatorInfo && videoDurationForCheck > tiktokCreatorInfo.maxVideoPostDurationSec;
            const tiktokCommercialIncomplete = tiktokSelected && tiktokDiscloseContent && !tiktokBrandOrganic && !tiktokBrandedContent;
            const tiktokCantPost = tiktokSelected && tiktokCreatorInfo?.canPost === false;

            const isDisabled = isUploading || selectedPlatforms.length === 0 || !editedMetadata?.title || tiktokPrivacyMissing || tiktokDurationExceeds || tiktokCommercialIncomplete || tiktokCantPost;

            let buttonText = 'Publish Video';
            if (isUploading) buttonText = 'Publishing...';
            else if (selectedPlatforms.length === 0) buttonText = 'Select a Platform';
            else if (!editedMetadata?.title) buttonText = 'Enter Title First';
            else if (tiktokPrivacyMissing) buttonText = 'Select TikTok Privacy Level';
            else if (tiktokDurationExceeds) buttonText = 'Video Too Long for TikTok';
            else if (tiktokCommercialIncomplete) buttonText = 'Complete Commercial Disclosure';

            return (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isUploading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <CloudUpload />}
                  onClick={() => setShowUploadConfirm(true)}
                  disabled={isDisabled}
                  sx={{
                    bgcolor: '#007AFF',
                    px: 5,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                    '&:hover': { bgcolor: '#0066DD', boxShadow: '0 6px 20px rgba(0,122,255,0.4)' },
                    '&:disabled': { bgcolor: 'rgba(255,255,255,0.1)', boxShadow: 'none' },
                  }}
                >
                  {buttonText}
                </Button>
              </Box>
            );
          })()}
        </Box>

        {/* Upload Confirmation Modal */}
        <Dialog
          open={showUploadConfirm}
          onClose={() => { if (!isUploading) { setShowUploadConfirm(false); setModalError(null); } }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '16px', p: 1, bgcolor: '#1D1D1F' }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1, color: '#fff' }}>
            {isUploading ? 'Uploading...' : Object.values(uploadProgress).some(s => s === 'success' || s === 'error') ? 'Upload Complete' : 'Confirm Upload'}
          </DialogTitle>
          <DialogContent ref={uploadDialogContentRef}>
            {/* Modal Error Alert */}
            {modalError && (
              <Alert
                severity="error"
                onClose={() => setModalError(null)}
                sx={{
                  mb: 2,
                  borderRadius: '10px',
                  width: 'fit-content',
                }}
              >
                {modalError}
              </Alert>
            )}

            {backgroundUploadStarted && (
              <Alert
                severity="success"
                icon={<CloudUpload />}
                sx={{ mb: 2, borderRadius: '10px' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>
                  We're uploading your video. You'll receive an email when it's ready.
                </Typography>
                <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 0.5 }}>
                  After processing, it may take a few minutes for your video to appear on your profile.
                </Typography>
              </Alert>
            )}
            
            <Typography variant="body2" sx={{ color: '#86868B', mb: 3 }}>
              {isUploading 
                ? 'Your video is being uploaded to the following platforms:'
                : Object.values(uploadProgress).some(s => s === 'success' || s === 'error')
                  ? 'Upload results:'
                  : 'Your video will be uploaded to the following platforms:'
              }
            </Typography>

            {/* Selected Platforms with Progress Indicators */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {selectedPlatforms.includes('youtube') && (
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2,
                  bgcolor: uploadProgress.youtube === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.youtube === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  border: `1px solid ${uploadProgress.youtube === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.youtube === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(255,255,255,0.2)'}`
                }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#FF0000', border: '2.5px solid #34C759', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <YouTube sx={{ fontSize: 22, color: '#fff' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#fff' }}>YouTube</Typography>
                    <Typography variant="caption" sx={{ color: '#86868B' }}>
                      {youtubeChannel?.channelTitle || 'Your Channel'}
                    </Typography>
                  </Box>
                  {uploadProgress.youtube === 'uploading' && <CircularProgress size={20} sx={{ color: '#FF0000' }} />}
                  {uploadProgress.youtube === 'success' && <CheckCircle sx={{ color: '#34C759', fontSize: 24 }} />}
                  {uploadProgress.youtube === 'error' && <Error sx={{ color: '#FF3B30', fontSize: 24 }} />}
                  {uploadProgress.youtube === 'pending' && isUploading && <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #ccc' }} />}
                </Box>
              )}
              {selectedPlatforms.includes('tiktok') && (
                <Box sx={{ 
                  display: 'flex', alignItems: 'center', gap: 2, p: 2, 
                  bgcolor: uploadProgress.tiktok === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.tiktok === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(255,255,255,0.05)', 
                  borderRadius: '12px', 
                  border: `1px solid ${uploadProgress.tiktok === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.tiktok === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(255,255,255,0.2)'}` 
                }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#000', border: '2.5px solid #34C759', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18, fill: '#fff' }}>
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#fff' }}>TikTok</Typography>
                    <Typography variant="caption" sx={{ color: '#86868B' }}>
                      {tiktokUsername ? `@${tiktokUsername}` : 'Your Account'}
                    </Typography>
                  </Box>
                  {uploadProgress.tiktok === 'uploading' && <CircularProgress size={20} sx={{ color: '#000' }} />}
                  {uploadProgress.tiktok === 'success' && <CheckCircle sx={{ color: '#34C759', fontSize: 24 }} />}
                  {uploadProgress.tiktok === 'error' && <Error sx={{ color: '#FF3B30', fontSize: 24 }} />}
                  {uploadProgress.tiktok === 'pending' && isUploading && <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #ccc' }} />}
                </Box>
              )}
              {selectedPlatforms.includes('instagram') && (
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2,
                  bgcolor: uploadProgress.instagram === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.instagram === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  border: `1px solid ${uploadProgress.instagram === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.instagram === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(255,255,255,0.2)'}`
                }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #FFDC80 0%, #E1306C 50%, #833AB4 100%)', border: '2.5px solid #34C759', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18, fill: '#fff' }}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#fff' }}>Instagram</Typography>
                    <Typography variant="caption" sx={{ color: '#86868B' }}>
                      {instagramUsername ? `@${instagramUsername}` : 'Your Account'}
                    </Typography>
                  </Box>
                  {uploadProgress.instagram === 'uploading' && <CircularProgress size={20} sx={{ color: '#E4405F' }} />}
                  {uploadProgress.instagram === 'success' && <CheckCircle sx={{ color: '#34C759', fontSize: 24 }} />}
                  {uploadProgress.instagram === 'error' && <Error sx={{ color: '#FF3B30', fontSize: 24 }} />}
                  {uploadProgress.instagram === 'pending' && isUploading && <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #ccc' }} />}
                </Box>
              )}
              {selectedPlatforms.includes('facebook') && (
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2,
                  bgcolor: uploadProgress.facebook === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.facebook === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  border: `1px solid ${uploadProgress.facebook === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.facebook === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(255,255,255,0.2)'}`
                }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#1877F2', border: '2.5px solid #34C759', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18, fill: '#fff' }}>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#fff' }}>Facebook</Typography>
                    <Typography variant="caption" sx={{ color: '#86868B' }}>
                      {facebookPageName || 'Your Page'}
                    </Typography>
                  </Box>
                  {uploadProgress.facebook === 'uploading' && <CircularProgress size={20} sx={{ color: '#1877F2' }} />}
                  {uploadProgress.facebook === 'success' && <CheckCircle sx={{ color: '#34C759', fontSize: 24 }} />}
                  {uploadProgress.facebook === 'error' && <Error sx={{ color: '#FF3B30', fontSize: 24 }} />}
                  {uploadProgress.facebook === 'pending' && isUploading && <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #ccc' }} />}
                </Box>
              )}
              {selectedPlatforms.includes('linkedin') && (
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2,
                  bgcolor: uploadProgress.linkedin === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.linkedin === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  border: `1px solid ${uploadProgress.linkedin === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.linkedin === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(255,255,255,0.2)'}`
                }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#0077B5', border: '2.5px solid #34C759', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18, fill: '#fff' }}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#fff' }}>LinkedIn</Typography>
                    <Typography variant="caption" sx={{ color: '#86868B' }}>
                      {linkedinName || 'Your Profile'}
                    </Typography>
                  </Box>
                  {uploadProgress.linkedin === 'uploading' && <CircularProgress size={20} sx={{ color: '#0077B5' }} />}
                  {uploadProgress.linkedin === 'success' && <CheckCircle sx={{ color: '#34C759', fontSize: 24 }} />}
                  {uploadProgress.linkedin === 'error' && <Error sx={{ color: '#FF3B30', fontSize: 24 }} />}
                  {uploadProgress.linkedin === 'pending' && isUploading && <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #ccc' }} />}
                </Box>
              )}
            </Box>

            {/* Video Details Summary - only show before uploading */}
            {!isUploading && !Object.values(uploadProgress).some(s => s === 'success' || s === 'error') && (
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px', p: 2, display: 'flex', gap: 2 }}>
                {/* Thumbnail Preview */}
                {(selectedThumbnailUrl || localThumbnailFile?.dataUrl || videoData?.thumbnailUrl) && (
                  <Box
                    component="img"
                    src={localThumbnailFile?.dataUrl || selectedThumbnailUrl || videoData?.thumbnailUrl}
                    alt="Thumbnail"
                    sx={{
                      width: videoData?.aspectRatio === 'portrait' ? 56 : 100,
                      height: videoData?.aspectRatio === 'portrait' ? 100 : 56,
                      borderRadius: '8px',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                )}
                {/* Details */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: '#fff' }}>Video Details</Typography>
                  <Typography variant="body2" sx={{
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    <Box component="span" sx={{ color: '#fff', fontWeight: 600 }}>Title:</Box>
                    <Box component="span" sx={{ color: '#86868B' }}> {editedMetadata?.title || 'Untitled'}</Box>
                  </Typography>
                  <Typography variant="body2" sx={{
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    <Box component="span" sx={{ color: '#fff', fontWeight: 600 }}>Description:</Box>
                    <Box component="span" sx={{ color: '#86868B' }}> {editedMetadata?.description || 'No description'}</Box>
                  </Typography>
                  {/* Video Footer */}
                  {videoFooter && (
                    <Typography variant="body2" sx={{
                      mt: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      <Box component="span" sx={{ color: '#fff', fontWeight: 600 }}>Footer:</Box>
                      <Box component="span" sx={{ color: '#86868B' }}> {videoFooter}</Box>
                    </Typography>
                  )}
                  {editedMetadata?.tags && editedMetadata.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {editedMetadata.tags.slice(0, 5).map((tag, i) => (
                        <Chip key={i} label={tag} size="small" sx={{ fontSize: '0.7rem', height: 22, color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }} />
                      ))}
                      {editedMetadata.tags.length > 5 && (
                        <Chip label={`+${editedMetadata.tags.length - 5} more`} size="small" sx={{ fontSize: '0.7rem', height: 22, color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' }} />
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            {/* Publish Now / Schedule Toggle */}
            {!isUploading && !Object.values(uploadProgress).some(s => s === 'success' || s === 'error') && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#fff' }}>
                  When to publish?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Box
                    onClick={() => setUploadMode('now')}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: '12px',
                      border: `2px solid ${uploadMode === 'now' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                      bgcolor: uploadMode === 'now' ? 'rgba(0,122,255,0.05)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: uploadMode === 'now' ? '#007AFF' : 'rgba(0,122,255,0.3)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CloudUpload sx={{ fontSize: 20, color: uploadMode === 'now' ? '#007AFF' : '#86868B' }} />
                      <Typography sx={{ fontWeight: 600, color: '#fff' }}>
                        Publish Now
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Goes live in ~5 minutes
                    </Typography>
                  </Box>
                  <Box
                    onClick={() => {
                      setUploadMode('schedule');
                      // Set default scheduled time to 1 hour from now, rounded to next 15 minutes
                      if (!scheduledDateTime) {
                        const now = dayjs();
                        const minutesToAdd = 60 + (15 - (now.minute() % 15));
                        const defaultTime = now.add(minutesToAdd, 'minute').second(0);
                        setScheduledDateTime(defaultTime);
                      }
                      // Scroll to bottom after state update renders the date picker
                      setTimeout(() => {
                        uploadDialogContentRef.current?.scrollTo({
                          top: uploadDialogContentRef.current.scrollHeight,
                          behavior: 'smooth'
                        });
                      }, 100);
                    }}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: '12px',
                      border: `2px solid ${uploadMode === 'schedule' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                      bgcolor: uploadMode === 'schedule' ? 'rgba(0,122,255,0.05)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: uploadMode === 'schedule' ? '#007AFF' : 'rgba(0,122,255,0.3)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Schedule sx={{ fontSize: 20, color: uploadMode === 'schedule' ? '#007AFF' : '#86868B' }} />
                      <Typography sx={{ fontWeight: 600, color: '#fff' }}>
                        Schedule
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Pick a date & time
                    </Typography>
                  </Box>
                </Box>

                {/* Date/Time Picker for scheduling */}
                {uploadMode === 'schedule' && (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, ml: 0.5 }}>
                      <PublicIcon sx={{ fontSize: 14, color: '#86868B' }} />
                      <Typography variant="caption" sx={{ color: '#86868B' }}>
                        {Intl.DateTimeFormat().resolvedOptions().timeZone}
                      </Typography>
                    </Box>
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
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                '& fieldset': {
                                  borderColor: 'rgba(255,255,255,0.1)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(0,122,255,0.3)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#007AFF',
                                },
                              },
                              '& input': {
                                py: 1.5,
                                px: 1.5,
                                fontSize: '0.95rem',
                                color: '#fff',
                              },
                            },
                          },
                          popper: {
                            sx: {
                              '& .MuiPaper-root': {
                                borderRadius: '16px',
                                boxShadow: '0 8px 32px rgba(255,255,255,0.1)',
                              },
                              '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#007AFF',
                              },
                              '& .MuiClock-pin, & .MuiClockPointer-root, & .MuiClockPointer-thumb': {
                                backgroundColor: '#007AFF',
                              },
                              '& .MuiClockPointer-thumb': {
                                borderColor: '#007AFF',
                              },
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                )}
              </Box>
            )}

            {/* YouTube Shorts thumbnail note */}
            {selectedPlatforms.includes('youtube') && videoData?.aspectRatio === 'portrait' && !isUploading && !Object.values(uploadProgress).some(s => s === 'success' || s === 'error') && (
              <Alert severity="info" sx={{ mt: 2, borderRadius: '10px', '& .MuiAlert-message': { fontSize: '0.85rem' } }}>
                <strong>YouTube Shorts:</strong> Your thumbnail is added as the first frame. To set it as the cover, edit the Short in the YouTube mobile app and scroll to select the first frame.
              </Alert>
            )}

          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)', bgcolor: '#141418', position: 'sticky', bottom: 0 }}>
            {!isUploading && Object.values(uploadProgress).some(s => s === 'success' || s === 'error') ? (
              <Button 
                variant="contained"
                onClick={() => {
                  setShowUploadConfirm(false);
                  setUploadProgress({});
                  // Scroll to success banners so user can see them
                  setTimeout(() => {
                    const element = socialSectionRef.current;
                    if (element) {
                      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                      window.scrollTo({ top: elementPosition - 100, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: '#007AFF' }}
              >
                Done
              </Button>
            ) : backgroundUploadStarted ? (
              <Button 
                variant="contained"
                onClick={() => {
                  setShowUploadConfirm(false);
                  setUploadProgress({});
                  setBackgroundUploadStarted(false);
                  // Scroll to social sharing section
                  setTimeout(() => {
                    const element = document.getElementById('social-sharing-section');
                    if (element) {
                      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                      window.scrollTo({ top: elementPosition - 100, behavior: 'smooth' });
                    }
                  }, 100);
                }}
                sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, bgcolor: '#007AFF', color: '#fff', '&:hover': { bgcolor: '#0066DD' } }}
              >
                Got it!
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowUploadConfirm(false);
                    setUploadProgress({});
                    setModalError(null);
                  }}
                  disabled={isUploading}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.4)',
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={(isUploading || isScheduling) ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : uploadMode === 'schedule' ? <Schedule /> : <CloudUpload />}
                  onClick={async () => {
                    setModalError(null);

                    // Handle scheduling
                    if (uploadMode === 'schedule') {
                      if (!scheduledDateTime) {
                        setModalError('Please select a date and time for scheduling');
                        return;
                      }

                      const scheduledDate = scheduledDateTime.toDate();
                      if (scheduledDate <= new Date()) {
                        setModalError('Scheduled time must be in the future');
                        return;
                      }

                      setIsScheduling(true);
                      try {
                        // Save metadata first
                        if (editedMetadata?.title) {
                          await videosApi.updateSocialMetadata(user!.userId, videoId!, {
                            title: editedMetadata.title,
                            description: editedMetadata.description || '',
                            tags: editedMetadata.tags || [],
                            hook: editedMetadata.hook || hookText || '',
                            videoFooter: videoFooter || '',
                          });
                        }

                        // Create scheduled post
                        const platformConfigs = selectedPlatforms.map(platform => ({
                          platform,
                          accountName: (platform === 'youtube' ? youtubeChannel?.channelTitle :
                                       platform === 'tiktok' ? tiktokUsername :
                                       platform === 'instagram' ? instagramUsername :
                                       platform === 'facebook' ? facebookPageName :
                                       platform === 'linkedin' ? linkedinName : undefined) || undefined,
                        }));

                        const response = await scheduledPostsApi.createScheduledPost({
                          videoId: videoId!,
                          platforms: platformConfigs,
                          scheduledTime: scheduledDate.toISOString(),
                          title: editedMetadata?.title || '',
                          description: editedMetadata?.description || '',
                          thumbnailUrl: selectedThumbnailUrl || videoData?.thumbnailUrl || '',
                          hook: editedMetadata?.hook || hookText || '',
                          tags: editedMetadata?.tags || [],
                          videoFooter: videoFooter || '',
                          aspectRatio: videoData?.aspectRatio || 'portrait',
                          // Pass TikTok settings if TikTok is selected
                          ...(selectedPlatforms.includes('tiktok') && {
                            tiktokSettings: {
                              postMode: tiktokPostMode,
                              privacyLevel: tiktokPrivacyLevel,
                              allowComment: tiktokAllowComment,
                              allowDuet: tiktokAllowDuet,
                              allowStitch: tiktokAllowStitch,
                              discloseContent: tiktokDiscloseContent,
                              brandOrganic: tiktokBrandOrganic,
                              brandedContent: tiktokBrandedContent,
                            },
                          }),
                        });

                        // Get the scheduleId from response
                        const newScheduleId = response.data?.scheduledPost?.scheduleId;

                        setIsScheduling(false);
                        setShowUploadConfirm(false);
                        // Reset state
                        setUploadMode('now');
                        setScheduledDateTime(null);
                        // Show success banner at very top of page
                        const formattedDate = scheduledDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        });
                        setScheduleBanner({
                          show: true,
                          type: 'success',
                          message: `Post scheduled for ${formattedDate}`,
                          scheduleId: newScheduleId,
                        });
                        setLastScheduledPostId(newScheduleId || null);
                        setLastScheduledTime(formattedDate);
                        // Show dialog asking if user wants to view scheduled posts
                        setShowScheduleSuccessDialog(true);
                        // Scroll to top to show success banner
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } catch (err: any) {
                        console.error('Scheduling failed:', err);
                        setIsScheduling(false);
                        const errorMessage = err.response?.status === 401
                          ? 'Session expired. Please refresh the page and try again.'
                          : err.response?.data?.error || 'Failed to schedule post. Please try again.';
                        setModalError(errorMessage);
                        // Also show error banner at top
                        setScheduleBanner({
                          show: true,
                          type: 'error',
                          message: errorMessage,
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                      return;
                    }

                    // Handle "Post Now" - schedule 5 minutes from now for better UX
                    const scheduledDate = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

                    setIsScheduling(true);
                    try {
                      // Save metadata first
                      if (editedMetadata?.title) {
                        await videosApi.updateSocialMetadata(user!.userId, videoId!, {
                          title: editedMetadata.title,
                          description: editedMetadata.description || '',
                          tags: editedMetadata.tags || [],
                          hook: editedMetadata.hook || hookText || '',
                          videoFooter: videoFooter || '',
                        });
                      }

                      // Create scheduled post for 5 minutes from now
                      const platformConfigs = selectedPlatforms.map(platform => ({
                        platform,
                        accountName: (platform === 'youtube' ? youtubeChannel?.channelTitle :
                                     platform === 'tiktok' ? tiktokUsername :
                                     platform === 'instagram' ? instagramUsername :
                                     platform === 'facebook' ? facebookPageName :
                                     platform === 'linkedin' ? linkedinName : undefined) || undefined,
                      }));

                      const response = await scheduledPostsApi.createScheduledPost({
                        videoId: videoId!,
                        platforms: platformConfigs,
                        scheduledTime: scheduledDate.toISOString(),
                        title: editedMetadata?.title || '',
                        description: editedMetadata?.description || '',
                        thumbnailUrl: selectedThumbnailUrl || videoData?.thumbnailUrl || '',
                        hook: editedMetadata?.hook || hookText || '',
                        tags: editedMetadata?.tags || [],
                        videoFooter: videoFooter || '',
                        aspectRatio: videoData?.aspectRatio || 'portrait',
                        // Pass TikTok settings if TikTok is selected
                        ...(selectedPlatforms.includes('tiktok') && {
                          tiktokSettings: {
                            postMode: tiktokPostMode,
                            privacyLevel: tiktokPrivacyLevel,
                            allowComment: tiktokAllowComment,
                            allowDuet: tiktokAllowDuet,
                            allowStitch: tiktokAllowStitch,
                            discloseContent: tiktokDiscloseContent,
                            brandOrganic: tiktokBrandOrganic,
                            brandedContent: tiktokBrandedContent,
                          },
                        }),
                      });

                      // Get the scheduleId from response
                      const newScheduleId = response.data?.scheduledPost?.scheduleId;

                      setIsScheduling(false);
                      setShowUploadConfirm(false);
                      // Reset state
                      setUploadMode('now');
                      // Show success banner
                      setScheduleBanner({
                        show: true,
                        type: 'success',
                        message: 'Your post will go live in ~5 minutes!',
                        scheduleId: newScheduleId,
                      });
                      setLastScheduledPostId(newScheduleId || null);
                      setLastScheduledTime('in ~5 minutes');
                      // Show dialog asking if user wants to view scheduled posts
                      setShowScheduleSuccessDialog(true);
                      // Scroll to top to show success banner
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } catch (err: any) {
                      console.error('Upload scheduling failed:', err);
                      setIsScheduling(false);
                      const errorMessage = err.response?.status === 401
                        ? 'Session expired. Please refresh the page and try again.'
                        : err.response?.data?.error || 'Failed to schedule post. Please try again.';
                      showSocialError(errorMessage);
                    }
                  }}
                  disabled={
                    isScheduling ||
                    selectedPlatforms.length === 0 ||
                    // TikTok validation: if disclosure is on, must select at least one brand option
                    (selectedPlatforms.includes('tiktok') && tiktokDiscloseContent && !tiktokBrandOrganic && !tiktokBrandedContent) ||
                    // Schedule validation: must have date/time selected
                    (uploadMode === 'schedule' && !scheduledDateTime)
                  }
                  sx={{
                    bgcolor: '#007AFF',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    '&:hover': { bgcolor: '#0066DD' },
                  }}
                >
                  {isScheduling ? 'Scheduling...' : uploadMode === 'schedule' ? 'Schedule Post' : 'Post Now'}
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Container>

      {/* Tokens Upgrade Popup */}
      <UpgradePopup
        open={showUpgradePopup}
        message="Upgrade your subscription or top up to get more tokens!"
        title="Tokens"
        isPremiumTier={isPremiumTier}
        onClose={() => setShowUpgradePopup(false)}
        onTopUp={handleTopUp}
        onUpgrade={handleUpgrade}
        isTopUpLoading={isTopUpLoading}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => !isDeleting && setShowDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            bgcolor: '#fff',
            maxWidth: 400,
            mx: 2,
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 1,
        }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: 'rgba(255,59,48,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Delete sx={{ fontSize: 24, color: '#FF3B30' }} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#fff' }}>
            Delete Video?
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Are you sure you want to delete "<strong style={{ color: '#fff' }}>{videoData?.songTitle || 'this video'}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <GhostButton
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
            sx={{ flex: 1, py: 1.25 }}
          >
            Cancel
          </GhostButton>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            fullWidth
            variant="contained"
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)',
              boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E53528 0%, #FF5252 100%)',
                boxShadow: '0 6px 16px rgba(255, 59, 48, 0.4)',
              },
              '&:disabled': { opacity: 0.7 },
            }}
          >
            {isDeleting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Success Dialog - Ask user to view scheduled posts */}
      <Dialog
        open={showScheduleSuccessDialog}
        onClose={() => setShowScheduleSuccessDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 3,
            maxWidth: 420,
            mx: 2,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
          }}>
            <Schedule sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>
              Post Scheduled!
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.9rem' }}>
              {lastScheduledTime}
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.6 }}>
          Your video has been scheduled and will be automatically posted at the scheduled time. Would you like to view your scheduled posts?
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={() => setShowScheduleSuccessDialog(false)}
            fullWidth
            variant="outlined"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              fontSize: '1rem',
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                bgcolor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            Maybe Later
          </Button>
          <Button
            onClick={() => {
              setShowScheduleSuccessDialog(false);
              // Navigate to scheduled posts page with the scheduleId to scroll to
              if (lastScheduledPostId) {
                navigate(`/settings/scheduled-content?highlight=${lastScheduledPostId}`);
              } else {
                navigate('/settings/scheduled-content');
              }
            }}
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#007AFF',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              fontSize: '1rem',
              color: '#fff',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0066DD', boxShadow: 'none' },
            }}
          >
            View Scheduled
          </Button>
        </Box>
      </Dialog>

      {/* Generate Metadata Modal */}
      <Dialog
        open={showContextModal}
        onClose={() => setShowContextModal(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '24px',
            p: 1,
            maxWidth: 560,
            width: '100%',
            mx: 2,
            bgcolor: '#141418 !important',
            backgroundImage: 'none !important',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogContent sx={{ pt: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}>
              <AutoAwesome sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#fff', mb: 0.5 }}>
                Generate Post Metadata
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B' }}>
                Create a title, description, and tags for your post
              </Typography>
            </Box>
          </Box>

          {/* Text field with integrated Roulette button - only for non-uploaded videos */}
          {!videoData?.isUserUpload && (
            <>
              {useGruviRoulette ? (
                /* Roulette mode - show special UI */
                <Box
                  sx={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(88,86,214,0.08) 50%, rgba(255,45,85,0.08) 100%)',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                    position: 'relative',
                    p: 3,
                    minHeight: 3 * 24 + 32,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '16px',
                      padding: '2px',
                      background: 'linear-gradient(135deg, #007AFF, #5856D6, #FF2D55)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    },
                    '&:hover': {
                      transform: 'scale(1.01)',
                    },
                  }}
                  onClick={() => setUseGruviRoulette(false)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Casino sx={{ fontSize: 32, color: '#5856D6' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                      Gruvi Roulette Active
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 320 }}>
                    We'll create metadata based on your video's story and lyrics. Sit back and let the magic happen!
                  </Typography>
                  <Typography sx={{ color: '#007AFF', fontSize: '0.75rem', mt: 2, fontWeight: 500 }}>
                    Click to enter your own prompt instead
                  </Typography>
                </Box>
              ) : (
                /* Normal text field with integrated bottom bar */
                <Box
                  sx={{
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: uploadedVideoContext.trim()
                      ? '2px solid #007AFF'
                      : '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: uploadedVideoContext.trim()
                        ? '#007AFF'
                        : 'rgba(0,122,255,0.3)',
                      background: 'rgba(255,255,255,0.08)',
                    },
                    '&:focus-within': {
                      borderColor: '#007AFF',
                      borderWidth: '2px',
                    },
                  }}
                >
                  {/* Text input area */}
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    value={uploadedVideoContext}
                    onChange={(e) => setUploadedVideoContext(e.target.value)}
                    placeholder="Override with your own description, e.g., A high-energy music video about chasing dreams..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                        background: 'transparent',
                        color: '#fff',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        '& fieldset': { border: 'none' },
                        '&:hover fieldset': { border: 'none' },
                        '&.Mui-focused fieldset': { border: 'none' },
                      },
                      '& .MuiInputBase-input': {
                        '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                      },
                    }}
                  />

                  {/* Divider and Roulette button */}
                  <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', px: 2, py: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
                    <Box
                      onClick={() => {
                        setUseGruviRoulette(true);
                        setUploadedVideoContext('');
                      }}
                      sx={{
                        background: '#5856D6',
                        border: 'none',
                        borderRadius: '20px',
                        px: 1.5,
                        py: 0.5,
                        gap: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5856D6 0%, #FF2D55 100%)',
                        },
                      }}
                    >
                      <Casino sx={{ fontSize: 14, color: '#fff' }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
                        Roulette
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          )}

          {/* Custom context input - for uploaded videos only */}
          {videoData?.isUserUpload && (
            <TextField
              fullWidth
              multiline
              rows={3}
              value={uploadedVideoContext}
              onChange={(e) => setUploadedVideoContext(e.target.value)}
              placeholder="Describe your video content, e.g., A cinematic travel video showcasing the beaches of Bali at sunset..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                },
                '& .MuiInputBase-input': {
                  '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                },
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <GhostButton
            onClick={() => setShowContextModal(false)}
            sx={{ px: 3, py: 1 }}
          >
            Cancel
          </GhostButton>
          <Button
            variant="contained"
            onClick={() => {
              if (!videoData?.isUserUpload && useGruviRoulette) {
                // Use Gruvi Roulette - no context needed
                handleGenerateMetadata({ useRoulette: true });
              } else {
                // Use custom context
                handleGenerateMetadata({ context: uploadedVideoContext });
              }
            }}
            disabled={
              isGeneratingMetadata ||
              // Only require context if NOT using Gruvi Roulette (or if uploaded video)
              ((!videoData?.isUserUpload && !useGruviRoulette && !uploadedVideoContext.trim()) ||
               (videoData?.isUserUpload && !uploadedVideoContext.trim()))
            }
            endIcon={!isGeneratingMetadata && (() => {
              const isDisabled = isGeneratingMetadata ||
                ((!videoData?.isUserUpload && !useGruviRoulette && !uploadedVideoContext.trim()) ||
                 (videoData?.isUserUpload && !uploadedVideoContext.trim()));
              const textColor = isDisabled ? '#999' : '#fff';
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', borderLeft: `1px solid ${isDisabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}`, pl: 1.5, ml: 0.5 }}>
                  <Typography component="span" sx={{ fontSize: '0.85rem', fontWeight: 600, color: textColor }}>10</Typography>
                  <Typography component="span" sx={{ fontSize: '0.8rem', fontWeight: 400, mx: 0.5, color: textColor }}>x</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}><GruviCoin size={16} /></Box>
                </Box>
              );
            })()}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              py: 1,
              color: '#fff',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255,255,255,0.1)',
                boxShadow: 'none',
                color: 'rgba(255,255,255,0.4)',
              },
            }}
          >
            {isGeneratingMetadata ? <><CircularProgress size={16} sx={{ color: '#fff', mr: 1 }} /> Generating...</> : 'Generate Post Metadata'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thumbnail Lightbox Overlay */}
      {lightboxUrl && (
        <Box
          onClick={() => setLightboxUrl(null)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={() => setLightboxUrl(null)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: '#fff',
              width: 44,
              height: 44,
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
            }}
          >
            <Typography sx={{ fontSize: 28, lineHeight: 1, fontWeight: 300 }}>×</Typography>
          </IconButton>
          
          {/* Full size image */}
          <Box
            component="img"
            src={lightboxUrl}
            alt="Thumbnail preview"
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      )}
      </Box>
    </Box>
  );
};

export default MusicVideoPlayer;
