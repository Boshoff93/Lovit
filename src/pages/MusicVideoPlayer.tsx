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
  Select,
  MenuItem,
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
  ContentCopy,
  CloudUpload,
  Bolt,
  Delete,
  Error,
} from '@mui/icons-material';
import { RootState, AppDispatch } from '../store/store';
import { getTokensFromAllowances, createCheckoutSession } from '../store/authSlice';
import { videosApi, songsApi, youtubeApi, tiktokApi, instagramApi, facebookApi, linkedinApi, charactersApi, Character } from '../services/api';
import { useDispatch } from 'react-redux';
import UpgradePopup from '../components/UpgradePopup';
import { TopUpBundle } from '../config/stripe';

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
  const [newTag, setNewTag] = useState('');
  const [ctaType, setCtaType] = useState<string>('');
  const [ctaUrl, setCtaUrl] = useState('');
  
  // YouTube state
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [youtubeChannel, setYoutubeChannel] = useState<{ channelTitle?: string; channelThumbnail?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [addThumbnailIntro, setAddThumbnailIntro] = useState(true);
  
  // TikTok state
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [tiktokUsername, setTiktokUsername] = useState<string | null>(null);
  const [tiktokUploaded, setTiktokUploaded] = useState(false);
  
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
  
  // Video characters state (for thumbnail selection)
  const [videoCharacters, setVideoCharacters] = useState<Character[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]); // Store all AI-generated thumbnails
  const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState<string | null>(null); // Currently selected thumbnail

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
          setCtaType(response.data.socialMetadata.ctaType || '');
          setCtaUrl(response.data.socialMetadata.ctaUrl || '');
        }
        if (response.data.socialThumbnailUrl) {
          setSocialThumbnailUrl(response.data.socialThumbnailUrl);
          setSelectedThumbnailUrl(response.data.socialThumbnailUrl);
        }
        // Load all previously generated thumbnails
        if (response.data.generatedThumbnails && response.data.generatedThumbnails.length > 0) {
          const thumbnailUrls = response.data.generatedThumbnails.map((t: { url: string }) => t.url);
          setGeneratedThumbnails(thumbnailUrls);
        }
      } catch {
        // No existing metadata, that's okay
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
  const handleGenerateMetadata = async () => {
    if (!user?.userId || !videoId) return;
    setIsGeneratingMetadata(true);
    setSocialError(null);
    
    try {
      const response = await videosApi.generateSocialMetadata(user.userId, videoId, {});
      const newMetadata = response.data.socialMetadata;
      setSocialMetadata(newMetadata);
      setEditedMetadata(newMetadata);
      setHookText(newMetadata.hook || '');
      setSocialSuccess('Social metadata generated! (10 credits used)');
      setTimeout(() => setSocialSuccess(null), 3000);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.error === 'Insufficient credits') {
        showSocialError(`Insufficient credits. You need ${errorData.required} credits but have ${errorData.available}. Add credits or enter metadata manually.`);
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
    if (realSelectedIds.length === 0) {
      showSocialError('Please select at least one image');
      return;
    }
    setIsGeneratingThumbnail(true);
    setSocialError(null);
    
    try {
      // Convert selected image IDs to actual URLs
      const selectedImageUrls: string[] = [];
      realSelectedIds.forEach(id => {
        // Handle different ID formats
        if (id.startsWith('ai_thumb_')) {
          // AI-generated thumbnail: ai_thumb_N
          const idx = parseInt(id.replace('ai_thumb_', ''));
          const url = generatedThumbnails[idx];
          if (url) selectedImageUrls.push(url);
        } else if (id.endsWith('_seedream')) {
          // Seedream reference: characterId_seedream
          const charId = id.replace('_seedream', '');
          const url = videoData?.seedreamReferenceUrls?.[charId];
          if (url) selectedImageUrls.push(url);
        } else if (id.startsWith('scene_')) {
          // Video scene: scene_N
          const idx = parseInt(id.replace('scene_', ''));
          const url = videoData?.sceneImageUrls?.[idx];
          if (url) selectedImageUrls.push(url);
        } else if (id === 'original_thumb') {
          // Original thumbnail (video first frame)
          if (videoData?.thumbnailUrl) selectedImageUrls.push(videoData.thumbnailUrl);
        } else if (id.startsWith('upload_')) {
          // User-uploaded custom thumbnail
          const idx = parseInt(id.replace('upload_', ''));
          const thumb = uploadedCustomThumbnails[idx];
          if (thumb?.dataUrl) selectedImageUrls.push(thumb.dataUrl);
        }
      });
      
      const response = await videosApi.generateSocialThumbnail(user.userId, videoId, {
        hookText,
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

  const handleCopyDescription = () => {
    if (editedMetadata?.description) {
      navigator.clipboard.writeText(editedMetadata.description);
      setSocialSuccess('Description copied!');
      setTimeout(() => setSocialSuccess(null), 2000);
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
        ctaType: ctaType || '',
        ctaUrl: ctaUrl || '',
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
        ctaType: ctaType || '',
        ctaUrl: ctaUrl || '',
      });
      
      // Upload to TikTok
      await tiktokApi.upload(user.userId, videoId);
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
        ctaType: ctaType || '',
        ctaUrl: ctaUrl || '',
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
    navigate('/my-library?tab=videos');
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
      navigate('/my-library?tab=videos');
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
          background: '#f5f5f7',
        }}
      >
        <CircularProgress sx={{ color: '#007AFF', mb: 2 }} size={48} />
        <Typography sx={{ color: '#1d1d1f' }}>Loading video...</Typography>
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
            <Typography variant="h6" sx={{ color: '#1D1D1F', mb: 1 }}>
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
    <Box sx={{ minHeight: '100vh', background: '#f5f5f7', pb: 16 }}>
      {/* Header */}
      <Box
        sx={{
          background: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handleGoBack} sx={{ color: '#007AFF' }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                {videoData.songTitle || 'Music Video'}
              </Typography>
            </Box>
            
            {/* Right side buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Tokens Button */}
              {user && allowances && (
                <Button
                  onClick={() => setShowUpgradePopup(true)}
                  sx={{
                    borderRadius: '20px',
                    px: 2,
                    py: 0.75,
                    minWidth: 'auto',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#fff',
                    background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                      boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
                    }
                  }}
                >
                  <Bolt sx={{ fontSize: 18, color: '#fff' }} />
                  <span style={{ color: '#fff' }}>{remainingTokens}</span>
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 3 }}>
        {/* Video + Details - Portrait: side-by-side, Landscape: stacked */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: videoData.aspectRatio === 'landscape' ? 'column' : 'row',
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
                : { xs: 320, sm: 380, md: 420 },
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

              {/* Play Button Overlay (when paused) */}
              {!isPlaying && !isBuffering && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}
                >
                  <IconButton
                    onClick={handlePlayPause}
                    sx={{
                      width: 80,
                      height: 80,
                      background: 'rgba(255,255,255,0.95)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                      '&:hover': {
                        background: '#fff',
                        transform: 'scale(1.1)',
                      },
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <PlayArrowRounded sx={{ fontSize: 48, color: '#007AFF' }} />
                  </IconButton>
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

          {/* Video Details - Right side, aligned to bottom like TrackDetailPage */}
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
                  sx={{ height: { xs: 20, sm: 24 }, fontSize: { xs: '0.65rem', sm: '0.75rem' }, background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}
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
                  sx={{ height: { xs: 20, sm: 24 }, fontSize: { xs: '0.65rem', sm: '0.75rem' }, background: 'rgba(88,86,214,0.1)', color: '#5856D6' }}
                />
              )}
              {videoData.videoType && (
                <Chip
                  icon={<Movie sx={{ fontSize: { xs: 12, sm: 14 }, color: '#FF9500' }} />}
                  label={videoData.videoType === 'still' ? 'Still' : 'Cinematic'}
                  size="small"
                  sx={{ height: { xs: 20, sm: 24 }, fontSize: { xs: '0.65rem', sm: '0.75rem' }, background: 'rgba(255,149,0,0.1)', color: '#FF9500' }}
                />
              )}
            </Box>
            
            {/* Title */}
            <Typography 
              sx={{ 
                fontWeight: 800, 
                color: '#1d1d1f', 
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
              <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {formatTime(displayDuration)}
              </Typography>
              <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>•</Typography>
              <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {videoData.aspectRatio === 'landscape' ? '16:9' : '9:16'}
              </Typography>
              <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>•</Typography>
              <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {formatDate(videoData.createdAt)}
              </Typography>
            </Box>
            
            {/* Action Buttons - Share and Download */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Share Button - Icon on xs/sm, full button on md+ */}
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
                <Share sx={{ fontSize: 18 }} />
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
                startIcon={<Share sx={{ fontSize: 20 }} />}
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
                Share
              </Button>
              
              {/* Download Button - Icon on xs/sm, full button on md+ */}
              <IconButton
                onClick={handleDownload}
                disabled={!videoData.videoUrl}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  border: '1px solid rgba(0,0,0,0.15)',
                  color: '#007AFF',
                  width: 36,
                  height: 36,
                  '&:hover': { borderColor: '#007AFF', bgcolor: 'rgba(0,122,255,0.05)' },
                  '&:disabled': { opacity: 0.4 },
                }}
              >
                <Download sx={{ fontSize: 18 }} />
              </IconButton>
              <Button
                onClick={handleDownload}
                disabled={!videoData.videoUrl}
                variant="outlined"
                startIcon={<Download sx={{ fontSize: 20, color: '#007AFF' }} />}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  color: '#007AFF !important',
                  borderColor: 'rgba(0,0,0,0.15)',
                  borderRadius: '10px',
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '& .MuiButton-startIcon': { color: '#007AFF' },
                  '& .MuiSvgIcon-root': { color: '#007AFF' },
                  '&:hover': { borderColor: '#007AFF', bgcolor: 'rgba(0,122,255,0.05)' },
                  '&:disabled': { opacity: 0.4, color: '#007AFF !important' },
                }}
              >
                Download
              </Button>
              
              {/* Delete Button - Icon on xs/sm, full button on md+ */}
              <IconButton
                onClick={() => setShowDeleteDialog(true)}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  border: '1px solid rgba(255,59,48,0.3)',
                  color: '#FF3B30',
                  width: 36,
                  height: 36,
                  '&:hover': { borderColor: '#FF3B30', bgcolor: 'rgba(255,59,48,0.05)' },
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
                  color: '#FF3B30 !important',
                  borderColor: 'rgba(255,59,48,0.3)',
                  borderRadius: '10px',
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '& .MuiButton-startIcon': { color: '#FF3B30' },
                  '& .MuiSvgIcon-root': { color: '#FF3B30' },
                  '&:hover': { borderColor: '#FF3B30', bgcolor: 'rgba(255,59,48,0.05)' },
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
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#fff',
            mb: 3,
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
              '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Lyrics sx={{ fontSize: 20, color: '#007AFF' }} />
              <Typography sx={{ fontWeight: 600, color: '#1d1d1f', fontSize: '0.95rem' }}>
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
                  color: '#1d1d1f',
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
          sx={{ mt: 4 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, ml: 0.5 }}>
            <Share sx={{ fontSize: 22, color: '#FF3B30' }} />
            <Typography sx={{ fontWeight: 600, color: '#1d1d1f', fontSize: '1.1rem' }}>
              Share to Social Media
            </Typography>
          </Box>

          {/* Alerts */}
          {socialError && (
            <Alert severity="error" onClose={() => setSocialError(null)} sx={{ mb: 2 }}>
              {socialError}
            </Alert>
          )}
          {socialSuccess && (
            <Alert severity="success" onClose={() => setSocialSuccess(null)} sx={{ mb: 2 }}>
              {socialSuccess}
            </Alert>
          )}
          
          {/* Platform Upload Success Banners */}
          {youtubeUrl && (
            <Alert 
              severity="success" 
              onClose={() => setYoutubeUrl(null)}
              sx={{ mb: 1.5, borderRadius: '10px', alignItems: 'center', '& .MuiAlert-message': { flex: 1 }, '& .MuiAlert-action': { pt: 0 } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>Uploaded to YouTube!</span>
                <Button color="inherit" size="small" href={youtubeUrl} target="_blank">View</Button>
              </Box>
            </Alert>
          )}
          {instagramUploaded && (
            <Alert 
              severity="success" 
              onClose={() => setInstagramUploaded(false)}
              sx={{ mb: 1.5, borderRadius: '10px', alignItems: 'center', '& .MuiAlert-message': { flex: 1 }, '& .MuiAlert-action': { pt: 0 } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>Uploaded to Instagram!</span>
                <Button color="inherit" size="small" href={`https://instagram.com/${instagramUsername || ''}`} target="_blank">View</Button>
              </Box>
            </Alert>
          )}
          {tiktokUploaded && (
            <Alert 
              severity="success" 
              onClose={() => setTiktokUploaded(false)}
              sx={{ mb: 1.5, borderRadius: '10px', alignItems: 'center', '& .MuiAlert-message': { flex: 1 }, '& .MuiAlert-action': { pt: 0 } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>Uploaded to TikTok!</span>
                <Button color="inherit" size="small" href={`https://tiktok.com/@${tiktokUsername || ''}`} target="_blank">View</Button>
              </Box>
            </Alert>
          )}
          {facebookUploaded && (
            <Alert 
              severity="success" 
              onClose={() => setFacebookUploaded(false)}
              sx={{ mb: 1.5, borderRadius: '10px', alignItems: 'center', '& .MuiAlert-message': { flex: 1 }, '& .MuiAlert-action': { pt: 0 } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>Uploaded to Facebook!</span>
                <Button color="inherit" size="small" href={facebookPageId ? `https://www.facebook.com/${facebookPageId}` : 'https://www.facebook.com'} target="_blank">View</Button>
              </Box>
            </Alert>
          )}
          {linkedinUploaded && (
            <Alert 
              severity="success" 
              onClose={() => setLinkedinUploaded(false)}
              sx={{ mb: 1.5, borderRadius: '10px', alignItems: 'center', '& .MuiAlert-message': { flex: 1 }, '& .MuiAlert-action': { pt: 0 } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>Uploaded to LinkedIn!</span>
                <Button color="inherit" size="small" href="https://linkedin.com/feed" target="_blank">View</Button>
              </Box>
            </Alert>
          )}

          {/* Platform Selection - Own Paper Section */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              p: { xs: 2, sm: 2.5 },
              mb: 2,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2, fontSize: '0.95rem' }}>
              Select Platforms
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {/* YouTube - Selectable */}
              <Box
                onClick={() => {
                  if (!youtubeConnected) {
                    // Connect first
                    handleYouTubeUpload();
                  } else {
                    // Toggle selection
                    setSelectedPlatforms(prev => 
                      prev.includes('youtube') 
                        ? prev.filter(p => p !== 'youtube')
                        : [...prev, 'youtube']
                    );
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: selectedPlatforms.includes('youtube') 
                    ? '2px solid #34C759' 
                    : youtubeConnected 
                      ? '2px solid #FF0000' 
                      : '1px solid rgba(0,0,0,0.1)',
                  background: selectedPlatforms.includes('youtube') 
                    ? 'rgba(52,199,89,0.08)' 
                    : youtubeConnected 
                      ? 'rgba(255,0,0,0.05)' 
                      : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    borderColor: youtubeConnected ? '#FF0000' : '#FF0000',
                    background: 'rgba(255,0,0,0.02)',
                  },
                }}
              >
                {youtubeConnected && (
                  <Checkbox
                    checked={selectedPlatforms.includes('youtube')}
                    size="small"
                    sx={{ p: 0, mr: -0.5, color: '#FF0000', '&.Mui-checked': { color: '#34C759' } }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      setSelectedPlatforms(prev => 
                        prev.includes('youtube') 
                          ? prev.filter(p => p !== 'youtube')
                          : [...prev, 'youtube']
                      );
                    }}
                  />
                )}
                <Box sx={{ 
                  width: 36, height: 36, borderRadius: '10px', 
                  background: 'rgba(255,0,0,0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <YouTube sx={{ fontSize: 22, color: '#FF0000' }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.9rem' }}>YouTube</Typography>
                    {youtubeConnected && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#34C759' }} />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', color: '#86868B' }}>
                    {youtubeConnected ? (youtubeChannel?.channelTitle || 'Connected') : 'Click to connect'}
                  </Typography>
                </Box>
              </Box>

              {/* TikTok - Selectable */}
              <Box
                onClick={() => {
                  if (!tiktokConnected) {
                    handleConnectTikTok();
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
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: selectedPlatforms.includes('tiktok') 
                    ? '2px solid #34C759' 
                    : tiktokConnected 
                      ? '2px solid #000000' 
                      : '1px solid rgba(0,0,0,0.1)',
                  background: selectedPlatforms.includes('tiktok') 
                    ? 'rgba(52,199,89,0.08)' 
                    : tiktokConnected 
                      ? 'rgba(0,0,0,0.05)' 
                      : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    borderColor: tiktokConnected ? '#000000' : '#000000',
                    background: 'rgba(0,0,0,0.02)',
                  },
                }}
              >
                {tiktokConnected && (
                  <Checkbox
                    checked={selectedPlatforms.includes('tiktok')}
                    size="small"
                    sx={{ p: 0, mr: -0.5, color: '#000', '&.Mui-checked': { color: '#34C759' } }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      setSelectedPlatforms(prev => 
                        prev.includes('tiktok') 
                          ? prev.filter(p => p !== 'tiktok')
                          : [...prev, 'tiktok']
                      );
                    }}
                  />
                )}
                <Box sx={{ 
                  width: 36, height: 36, borderRadius: '10px', 
                  background: 'rgba(0,0,0,0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18, fill: '#000' }}>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.9rem' }}>TikTok</Typography>
                    {tiktokConnected && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#34C759' }} />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', color: '#86868B' }}>
                    {tiktokConnected ? (tiktokUsername ? `@${tiktokUsername}` : 'Connected') : 'Click to connect'}
                  </Typography>
                </Box>
              </Box>

              {/* Instagram */}
              <Box
                onClick={() => {
                  if (!instagramConnected) {
                    handleConnectInstagram();
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
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: selectedPlatforms.includes('instagram') 
                    ? '2px solid #34C759' 
                    : instagramConnected 
                      ? '2px solid #E4405F' 
                      : '1px solid rgba(0,0,0,0.1)',
                  background: selectedPlatforms.includes('instagram') 
                    ? 'rgba(52,199,89,0.08)' 
                    : instagramConnected 
                      ? 'rgba(228,64,95,0.05)' 
                      : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    borderColor: instagramConnected ? '#E4405F' : '#E4405F',
                    background: 'rgba(228,64,95,0.02)',
                  },
                }}
              >
                {instagramConnected && (
                  <Checkbox
                    checked={selectedPlatforms.includes('instagram')}
                    size="small"
                    sx={{ p: 0, mr: -0.5, color: '#E4405F', '&.Mui-checked': { color: '#34C759' } }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      setSelectedPlatforms(prev => 
                        prev.includes('instagram') 
                          ? prev.filter(p => p !== 'instagram')
                          : [...prev, 'instagram']
                      );
                    }}
                  />
                )}
                <Box sx={{ 
                  width: 36, height: 36, borderRadius: '10px', 
                  background: 'linear-gradient(135deg, rgba(228,64,95,0.1) 0%, rgba(131,58,180,0.1) 100%)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18 }}>
                    <defs>
                      <linearGradient id="ig-grad-select" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFDC80" />
                        <stop offset="50%" stopColor="#E1306C" />
                        <stop offset="100%" stopColor="#833AB4" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#ig-grad-select)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.9rem' }}>Instagram</Typography>
                    {instagramConnected && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#34C759' }} />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', color: '#86868B' }}>
                    {instagramConnected ? (instagramUsername ? `@${instagramUsername}` : 'Connected') : 'Click to connect'}
                  </Typography>
                </Box>
              </Box>

              {/* Facebook */}
              <Box
                onClick={() => {
                  if (!facebookConnected) {
                    // Facebook uses same OAuth as Instagram
                    handleConnectInstagram();
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
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: selectedPlatforms.includes('facebook') 
                    ? '2px solid #34C759' 
                    : facebookConnected 
                      ? '2px solid #1877F2' 
                      : '1px solid rgba(0,0,0,0.1)',
                  background: selectedPlatforms.includes('facebook') 
                    ? 'rgba(52,199,89,0.08)' 
                    : facebookConnected 
                      ? 'rgba(24,119,242,0.05)' 
                      : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    borderColor: facebookConnected ? '#1877F2' : '#1877F2',
                    background: 'rgba(24,119,242,0.02)',
                  },
                }}
              >
                {facebookConnected && (
                  <Checkbox
                    checked={selectedPlatforms.includes('facebook')}
                    size="small"
                    sx={{ p: 0, mr: -0.5, color: '#1877F2', '&.Mui-checked': { color: '#34C759' } }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      setSelectedPlatforms(prev => 
                        prev.includes('facebook') 
                          ? prev.filter(p => p !== 'facebook')
                          : [...prev, 'facebook']
                      );
                    }}
                  />
                )}
                <Box sx={{ 
                  width: 36, height: 36, borderRadius: '10px', 
                  background: 'rgba(24,119,242,0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18, fill: '#1877F2' }}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.9rem' }}>Facebook</Typography>
                    {facebookConnected && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#34C759' }} />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', color: '#86868B' }}>
                    {facebookConnected ? (facebookPageName || 'Page Connected') : 'Click to connect'}
                  </Typography>
                </Box>
              </Box>

              {/* LinkedIn */}
              <Box
                onClick={() => {
                  if (!linkedinConnected) {
                    handleConnectLinkedin();
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
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: selectedPlatforms.includes('linkedin') 
                    ? '2px solid #34C759' 
                    : linkedinConnected 
                      ? '2px solid #0077B5' 
                      : '1px solid rgba(0,0,0,0.1)',
                  background: selectedPlatforms.includes('linkedin') 
                    ? 'rgba(52,199,89,0.08)' 
                    : linkedinConnected 
                      ? 'rgba(0,119,181,0.05)' 
                      : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    borderColor: linkedinConnected ? '#0077B5' : '#0077B5',
                    background: 'rgba(0,119,181,0.02)',
                  },
                }}
              >
                {linkedinConnected && (
                  <Checkbox
                    checked={selectedPlatforms.includes('linkedin')}
                    size="small"
                    sx={{ p: 0, mr: -0.5, color: '#0077B5', '&.Mui-checked': { color: '#34C759' } }}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => {
                      setSelectedPlatforms(prev => 
                        prev.includes('linkedin') 
                          ? prev.filter(p => p !== 'linkedin')
                          : [...prev, 'linkedin']
                      );
                    }}
                  />
                )}
                <Box sx={{ 
                  width: 36, height: 36, borderRadius: '10px', 
                  background: 'rgba(0,119,181,0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18, fill: '#0077B5' }}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.9rem' }}>LinkedIn</Typography>
                    {linkedinConnected && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#34C759' }} />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', color: '#86868B' }}>
                    {linkedinConnected ? (linkedinName || 'Connected') : 'Click to connect'}
                  </Typography>
                </Box>
              </Box>
            </Box>

          </Paper>

          {/* Video Details Section - Own Paper */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              p: { xs: 2, sm: 2.5 },
              mb: 2,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
              <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.95rem', flexShrink: 0 }}>
                Video Details
              </Typography>
              
              {/* Generate with AI button */}
              <Button
                variant="contained"
                startIcon={isGeneratingMetadata ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <AutoAwesome />}
                onClick={handleGenerateMetadata}
                disabled={isGeneratingMetadata}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
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
                {isGeneratingMetadata ? 'Generating...' : 'Generate with AI (10 credits)'}
              </Button>
            </Box>
            
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
              Enter details manually or use AI to generate title, description, and tags
            </Typography>

            {/* Title */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#86868B', fontWeight: 500 }}>
                Title
              </Typography>
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
                size="small"
                inputProps={{ maxLength: 100 }}
                helperText={`${editedMetadata?.title?.length || 0}/100`}
                placeholder="Enter a catchy title"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                  },
                }}
              />
            </Box>

            {/* Description */}
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#86868B', fontWeight: 500 }}>
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
                rows={3}
                size="small"
                placeholder="Describe your video..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                  },
                }}
              />
              {editedMetadata?.description && (
                <Tooltip title="Copy description">
                  <IconButton
                    onClick={handleCopyDescription}
                    sx={{ position: 'absolute', top: 32, right: 8 }}
                    size="small"
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {/* Call to Action */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#86868B', fontWeight: 500 }}>
                Call to Action (optional)
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <Select
                    value={ctaType}
                    onChange={(e) => setCtaType(e.target.value)}
                    displayEmpty
                    sx={{
                      borderRadius: '10px',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                    }}
                  >
                    <MenuItem value="">No CTA</MenuItem>
                    <MenuItem value="Learn More">Learn More</MenuItem>
                    <MenuItem value="Shop Now">Shop Now</MenuItem>
                    <MenuItem value="Download">Download</MenuItem>
                    <MenuItem value="Sign Up">Sign Up</MenuItem>
                    <MenuItem value="Book Now">Book Now</MenuItem>
                    <MenuItem value="Get Started">Get Started</MenuItem>
                    <MenuItem value="Watch More">Watch More</MenuItem>
                    <MenuItem value="Subscribe">Subscribe</MenuItem>
                    <MenuItem value="Contact Us">Contact Us</MenuItem>
                    <MenuItem value="Visit Website">Visit Website</MenuItem>
                  </Select>
                </FormControl>
                {ctaType && (
                  <TextField
                    size="small"
                    placeholder="https://your-website.com"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    sx={{ 
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      },
                    }}
                  />
                )}
              </Box>
              {ctaType && (
                <Typography variant="caption" sx={{ color: '#86868B', mt: 0.5, display: 'block' }}>
                  Link will be added to your video description
                </Typography>
              )}
            </Box>

            {/* Tags */}
            <Box sx={{ mb: 0 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#86868B', fontWeight: 500 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                {editedMetadata?.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{
                      borderRadius: '100px',
                      bgcolor: 'rgba(0,122,255,0.1)',
                      color: '#007AFF',
                      fontWeight: 500,
                      '& .MuiChip-deleteIcon': { color: '#007AFF' },
                    }}
                  />
                ))}
              </Box>
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
                      borderRadius: '10px',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#007AFF' },
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
                    background: newTag.trim() ? 'rgba(0,122,255,0.1)' : 'rgba(0,0,0,0.04)',
                    '&:hover': { background: 'rgba(0,122,255,0.2)' },
                  }}
                >
                  <Add sx={{ color: newTag.trim() ? '#007AFF' : '#86868B' }} />
                </IconButton>
              </Box>
            </Box>
          </Paper>

          {/* Thumbnail Section - Own Paper */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              p: { xs: 2, sm: 2.5 },
              mb: 2,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2, fontSize: '0.95rem' }}>
              Select Thumbnail
            </Typography>
            
            {/* Thumbnail Options Grid */}
            {(() => {
              const isLandscape = videoData?.aspectRatio === 'landscape';
              const thumbWidth = isLandscape ? 160 : 90;
              const thumbHeight = isLandscape ? 90 : 160;
              
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
              
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
                  {/* Existing thumbnail options */}
                  {thumbnailOptions.map((thumb, idx) => {
                    const isSelected = thumb.type === 'custom' 
                      ? selectedThumbnailUrl === thumb.dataUrl
                      : selectedThumbnailUrl === thumb.url;
                    return (
                      <Box
                        key={`thumb-${thumb.type}-${idx}`}
                        onClick={() => {
                          const url = thumb.type === 'custom' ? thumb.dataUrl! : thumb.url;
                          setSelectedThumbnailUrl(url);
                          setSocialThumbnailUrl(url);
                          // Close the Create panel when selecting an existing thumbnail
                          setSelectedCharacterIds([]);
                        }}
                        sx={{
                          position: 'relative',
                          cursor: 'pointer',
                          borderRadius: 1,
                          overflow: 'hidden',
                          width: thumbWidth,
                          height: thumbHeight,
                          border: isSelected ? '3px solid #34C759' : '2px solid rgba(0,0,0,0.1)',
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
                        }}
                      >
                        <Box
                          component="img"
                          src={thumb.type === 'custom' ? thumb.dataUrl : thumb.url}
                          alt={thumb.label}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
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
                      borderRadius: 1,
                      border: showCreatePanel ? '2px solid #007AFF' : '2px solid rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      bgcolor: showCreatePanel ? 'rgba(0,122,255,0.08)' : '#fff',
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
                    <Typography sx={{ fontSize: '8px', color: '#007AFF', fontWeight: 600, textAlign: 'center' }}>
                      Create
                    </Typography>
                  </Box>
                  
                  {/* Upload Thumbnail Button */}
                  <Box
                    component="label"
                    sx={{
                      width: thumbWidth,
                      height: thumbHeight,
                      borderRadius: 1,
                      border: '2px solid rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      bgcolor: '#fff',
                      transition: 'all 0.2s',
                      '&:hover': { 
                        borderColor: '#007AFF', 
                        bgcolor: 'rgba(0,122,255,0.04)',
                      },
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 20, color: '#007AFF', mb: 0.5 }} />
                    <Typography sx={{ fontSize: '8px', color: '#007AFF', fontWeight: 600, textAlign: 'center' }}>
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
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                    Generate New Thumbnail
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setSelectedCharacterIds([])}
                    sx={{ 
                      color: '#86868B',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid rgba(0,0,0,0.1)',
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
                  const refThumbWidth = isLandscape ? 80 : 45;
                  const refThumbHeight = isLandscape ? 45 : 80;
                  const realSelectedIds = selectedCharacterIds.filter(id => id !== 'toggle_open');
                  const maxSelections = 3;
                  
                  return (
                    <>
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: '#1D1D1F', fontWeight: 600 }}>
                            Select reference images
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: '#007AFF', 
                            fontWeight: 600,
                            bgcolor: 'rgba(0,122,255,0.1)',
                            px: 1.5, py: 0.5, borderRadius: '100px',
                          }}>
                            {realSelectedIds.length}/{maxSelections}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#86868B', display: 'block', mt: 0.5 }}>
                          AI will use the selected images as a starting point to generate a new thumbnail
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
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  border: isSelected ? '2px solid #007AFF' : '1px solid rgba(0,0,0,0.1)',
                                  opacity: canSelect ? 1 : 0.4,
                                  transition: 'all 0.2s',
                                  '&:hover': canSelect ? { boxShadow: '0 2px 8px rgba(0,0,0,0.12)' } : {},
                                }}
                              >
                                <Box component="img" src={img.url} alt={img.label} sx={{ width: refThumbWidth, height: refThumbHeight, objectFit: 'cover', display: 'block' }} />
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
                      
                      {/* Hook Text */}
                      <Typography variant="body2" sx={{ mb: 0.5, color: '#1D1D1F', fontWeight: 500 }}>
                        Hook Text
                      </Typography>
                      <TextField
                        fullWidth
                        value={hookText}
                        onChange={(e) => {
                          setHookText(e.target.value);
                          setEditedMetadata(prev => prev ? { ...prev, hook: e.target.value } : { title: '', description: '', tags: [], hook: e.target.value });
                        }}
                        size="small"
                        placeholder="e.g., 'Epic Adventure Awaits!'"
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#fff' } }}
                      />
                      
                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Button
                          variant="contained"
                          startIcon={isGeneratingThumbnail ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <AutoAwesome />}
                          onClick={handleGenerateThumbnail}
                          disabled={isGeneratingThumbnail || !hookText.trim() || realSelectedIds.length === 0}
                          size="small"
                          sx={{ bgcolor: '#007AFF', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#0066DD' }, '&:disabled': { bgcolor: 'rgba(0,0,0,0.12)' } }}
                        >
                          {isGeneratingThumbnail ? 'Generating...' : 'Generate (10 credits)'}
                        </Button>
                      </Box>
                    </>
                  );
                })()}
              </Box>
            )}
          </Paper>

          {/* Upload Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={isUploading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <CloudUpload />}
              onClick={() => setShowUploadConfirm(true)}
              disabled={isUploading || selectedPlatforms.length === 0 || !editedMetadata?.title}
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
                '&:disabled': { bgcolor: 'rgba(0,0,0,0.12)', boxShadow: 'none' },
              }}
            >
              {isUploading 
                ? 'Uploading...' 
                : selectedPlatforms.length === 0 
                  ? 'Select a Platform'
                  : !editedMetadata?.title 
                    ? 'Enter Title First'
                    : `Upload to ${selectedPlatforms.length} Platform${selectedPlatforms.length > 1 ? 's' : ''}`
              }
            </Button>
          </Box>
        </Box>

        {/* Upload Confirmation Modal */}
        <Dialog 
          open={showUploadConfirm} 
          onClose={() => !isUploading && setShowUploadConfirm(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '16px', p: 1 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            {isUploading ? 'Uploading...' : Object.values(uploadProgress).some(s => s === 'success' || s === 'error') ? 'Upload Complete' : 'Confirm Upload'}
          </DialogTitle>
          <DialogContent>
            {isUploading && (
              <Alert severity="info" sx={{ mb: 2, borderRadius: '10px' }}>
                We've kicked off your upload! Please wait a few moments while your video is being posted to each platform.
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
                  bgcolor: uploadProgress.youtube === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.youtube === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(255,0,0,0.05)', 
                  borderRadius: '12px', 
                  border: `1px solid ${uploadProgress.youtube === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.youtube === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(255,0,0,0.2)'}` 
                }}>
                  <YouTube sx={{ fontSize: 32, color: '#FF0000' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>YouTube</Typography>
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
                  bgcolor: uploadProgress.tiktok === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.tiktok === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(0,0,0,0.03)', 
                  borderRadius: '12px', 
                  border: `1px solid ${uploadProgress.tiktok === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.tiktok === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(0,0,0,0.2)'}` 
                }}>
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 32, height: 32, fill: '#000' }}>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>TikTok</Typography>
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
                  bgcolor: uploadProgress.instagram === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.instagram === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(228,64,95,0.05)', 
                  borderRadius: '12px', 
                  border: `1px solid ${uploadProgress.instagram === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.instagram === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(228,64,95,0.2)'}` 
                }}>
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 32, height: 32 }}>
                    <defs>
                      <linearGradient id="ig-grad-confirm" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFDC80" />
                        <stop offset="50%" stopColor="#E1306C" />
                        <stop offset="100%" stopColor="#833AB4" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#ig-grad-confirm)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>Instagram</Typography>
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
                  bgcolor: uploadProgress.facebook === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.facebook === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(24,119,242,0.05)', 
                  borderRadius: '12px', 
                  border: `1px solid ${uploadProgress.facebook === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.facebook === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(24,119,242,0.2)'}` 
                }}>
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 32, height: 32, fill: '#1877F2' }}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>Facebook</Typography>
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
                  bgcolor: uploadProgress.linkedin === 'success' ? 'rgba(52,199,89,0.1)' : uploadProgress.linkedin === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(0,119,181,0.05)', 
                  borderRadius: '12px', 
                  border: `1px solid ${uploadProgress.linkedin === 'success' ? 'rgba(52,199,89,0.3)' : uploadProgress.linkedin === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(0,119,181,0.2)'}` 
                }}>
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 32, height: 32, fill: '#0077B5' }}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>LinkedIn</Typography>
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
              <Box sx={{ bgcolor: '#f5f5f7', borderRadius: '12px', p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Video Details</Typography>
                <Typography variant="body2" sx={{ color: '#1D1D1F', mb: 0.5 }}>
                  <strong>Title:</strong> {editedMetadata?.title || 'Untitled'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868B', mb: 0.5, 
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                }}>
                  <strong>Description:</strong> {editedMetadata?.description?.slice(0, 100) || 'No description'}...
                </Typography>
                {editedMetadata?.tags && editedMetadata.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {editedMetadata.tags.slice(0, 5).map((tag, i) => (
                      <Chip key={i} label={tag} size="small" sx={{ fontSize: '0.7rem', height: 22 }} />
                    ))}
                    {editedMetadata.tags.length > 5 && (
                      <Chip label={`+${editedMetadata.tags.length - 5} more`} size="small" sx={{ fontSize: '0.7rem', height: 22, bgcolor: 'rgba(0,0,0,0.08)' }} />
                    )}
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
            
            {/* TikTok sandbox mode disclaimer */}
            {selectedPlatforms.includes('tiktok') && !isUploading && !Object.values(uploadProgress).some(s => s === 'success' || s === 'error') && (
              <Alert severity="warning" sx={{ mt: 2, borderRadius: '10px', '& .MuiAlert-message': { fontSize: '0.85rem' } }}>
                <strong>TikTok Note:</strong> TikTok posting currently only works for private accounts while we await approval. Full public posting will be available soon!
              </Alert>
            )}

          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
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
            ) : (
              <>
                <Button 
                  onClick={() => {
                    setShowUploadConfirm(false);
                    setUploadProgress({});
                  }}
                  disabled={isUploading}
                  sx={{ borderRadius: '10px', textTransform: 'none', color: '#86868B' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={isUploading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <CloudUpload />}
                  onClick={async () => {
                    const uploadYouTube = selectedPlatforms.includes('youtube');
                    const uploadTikTok = selectedPlatforms.includes('tiktok');
                    const uploadInstagram = selectedPlatforms.includes('instagram');
                    const uploadFacebook = selectedPlatforms.includes('facebook');
                    
                    // Initialize progress for all selected platforms
                    const initialProgress: Record<string, 'pending' | 'uploading' | 'success' | 'error'> = {};
                    if (uploadYouTube) initialProgress.youtube = 'pending';
                    if (uploadTikTok) initialProgress.tiktok = 'pending';
                    if (uploadInstagram) initialProgress.instagram = 'pending';
                    if (uploadFacebook) initialProgress.facebook = 'pending';
                    setUploadProgress(initialProgress);
                    setIsUploading(true);
                    setSocialError(null);
                    
                    // Save metadata first
                    if (editedMetadata?.title) {
                      await videosApi.updateSocialMetadata(user!.userId, videoId!, {
                        title: editedMetadata.title,
                        description: editedMetadata.description || '',
                        tags: editedMetadata.tags || [],
                        hook: editedMetadata.hook || hookText || '',
                        ctaType: ctaType || '',
                        ctaUrl: ctaUrl || '',
                      });
                    }
                    
                    // Track upload results
                    const results: string[] = [];
                    const errors: string[] = [];
                    const uploadLinkedin = selectedPlatforms.includes('linkedin');
                    
                    // Set all selected platforms to uploading state
                    if (uploadYouTube) setUploadProgress(prev => ({ ...prev, youtube: 'uploading' }));
                    if (uploadTikTok) setUploadProgress(prev => ({ ...prev, tiktok: 'uploading' }));
                    if (uploadInstagram) setUploadProgress(prev => ({ ...prev, instagram: 'uploading' }));
                    if (uploadFacebook) setUploadProgress(prev => ({ ...prev, facebook: 'uploading' }));
                    if (uploadLinkedin) setUploadProgress(prev => ({ ...prev, linkedin: 'uploading' }));
                    
                    // Create upload promises for all selected platforms (run in parallel!)
                    const uploadPromises: Promise<void>[] = [];
                    
                    if (uploadYouTube) {
                      uploadPromises.push((async () => {
                        try {
                          const shouldAddThumbnailIntro = videoData?.aspectRatio === 'portrait' ? addThumbnailIntro : false;
                          const response = await videosApi.uploadToYouTube(user!.userId, videoId!, { addThumbnailIntro: shouldAddThumbnailIntro });
                          setYoutubeUrl(response.data.youtubeUrl);
                          results.push('YouTube');
                          setUploadProgress(prev => ({ ...prev, youtube: 'success' }));
                        } catch (err: any) {
                          const errorMsg = err.response?.data?.error || 'YouTube upload failed';
                          if (errorMsg.includes('not connected') || errorMsg.includes('reconnect')) {
                            setYoutubeConnected(false);
                          }
                          errors.push(`YouTube: ${errorMsg}`);
                          setUploadProgress(prev => ({ ...prev, youtube: 'error' }));
                        }
                      })());
                    }
                    
                    if (uploadTikTok) {
                      uploadPromises.push((async () => {
                        try {
                          await tiktokApi.upload(user!.userId, videoId!);
                          results.push('TikTok');
                          setTiktokUploaded(true);
                          setUploadProgress(prev => ({ ...prev, tiktok: 'success' }));
                        } catch (err: any) {
                          const errorMsg = err.response?.data?.error || 'TikTok upload failed';
                          if (errorMsg.includes('not connected') || errorMsg.includes('reconnect')) {
                            setTiktokConnected(false);
                          }
                          errors.push(`TikTok: ${errorMsg}`);
                          setUploadProgress(prev => ({ ...prev, tiktok: 'error' }));
                        }
                      })());
                    }
                    
                    if (uploadInstagram) {
                      uploadPromises.push((async () => {
                        try {
                          await instagramApi.upload(user!.userId, videoId!);
                          results.push('Instagram');
                          setInstagramUploaded(true);
                          setUploadProgress(prev => ({ ...prev, instagram: 'success' }));
                        } catch (err: any) {
                          const errorMsg = err.response?.data?.error || 'Instagram upload failed';
                          if (errorMsg.includes('not connected') || errorMsg.includes('reconnect')) {
                            setInstagramConnected(false);
                          }
                          errors.push(`Instagram: ${errorMsg}`);
                          setUploadProgress(prev => ({ ...prev, instagram: 'error' }));
                        }
                      })());
                    }
                    
                    if (uploadFacebook) {
                      uploadPromises.push((async () => {
                        try {
                          await facebookApi.upload(user!.userId, videoId!);
                          results.push('Facebook');
                          setFacebookUploaded(true);
                          setUploadProgress(prev => ({ ...prev, facebook: 'success' }));
                        } catch (err: any) {
                          const errorMsg = err.response?.data?.error || 'Facebook upload failed';
                          if (errorMsg.includes('not connected') || errorMsg.includes('reconnect')) {
                            setFacebookConnected(false);
                          }
                          errors.push(`Facebook: ${errorMsg}`);
                          setUploadProgress(prev => ({ ...prev, facebook: 'error' }));
                        }
                      })());
                    }
                    
                    if (uploadLinkedin) {
                      uploadPromises.push((async () => {
                        try {
                          await linkedinApi.upload(user!.userId, videoId!);
                          results.push('LinkedIn');
                          setLinkedinUploaded(true);
                          setUploadProgress(prev => ({ ...prev, linkedin: 'success' }));
                        } catch (err: any) {
                          const errorMsg = err.response?.data?.error || 'LinkedIn upload failed';
                          if (errorMsg.includes('not connected') || errorMsg.includes('reconnect') || errorMsg.includes('expired')) {
                            setLinkedinConnected(false);
                          }
                          errors.push(`LinkedIn: ${errorMsg}`);
                          setUploadProgress(prev => ({ ...prev, linkedin: 'error' }));
                        }
                      })());
                    }
                    
                    // Wait for all uploads to complete in parallel
                    await Promise.all(uploadPromises);
                    
                    setIsUploading(false);
                    
                    // Show errors (success banners are shown individually per platform)
                    if (errors.length > 0) {
                      showSocialError(errors.join('. '));
                    }
                  }}
                  disabled={isUploading}
                  sx={{
                    bgcolor: selectedPlatforms.length > 1 ? '#007AFF' : selectedPlatforms.includes('facebook') ? '#1877F2' : selectedPlatforms.includes('instagram') ? '#E4405F' : selectedPlatforms.includes('tiktok') ? '#000' : '#FF0000',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    '&:hover': { 
                      bgcolor: selectedPlatforms.length > 1 ? '#0066DD' : selectedPlatforms.includes('facebook') ? '#1558B0' : selectedPlatforms.includes('instagram') ? '#C13584' : selectedPlatforms.includes('tiktok') ? '#333' : '#CC0000',
                    },
                  }}
                >
                  {isUploading ? 'Uploading...' : 'Upload Now'}
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
            borderRadius: '24px', 
            p: 3,
            maxWidth: 400,
            mx: 2,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255,59,48,0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Delete sx={{ fontSize: 24, color: '#FF3B30' }} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            Delete Video?
          </Typography>
        </Box>
        
        <Typography sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
          Are you sure you want to delete "<strong>{videoData?.songTitle || 'this video'}</strong>"? This action cannot be undone.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button 
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
            fullWidth
            sx={{ 
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              fontSize: '1rem',
              color: '#1d1d1f',
              border: '1px solid rgba(0,0,0,0.15)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#007AFF',
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              fontSize: '1rem',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0066DD', boxShadow: 'none' },
              '&:disabled': { bgcolor: '#007AFF', opacity: 0.7 },
            }}
          >
            {isDeleting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default MusicVideoPlayer;
