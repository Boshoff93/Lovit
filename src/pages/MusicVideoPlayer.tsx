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
  Divider,
  Button,
  TextField,
  Alert,
  Tooltip,
  Switch,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrowRounded,
  Pause,
  Fullscreen,
  FullscreenExit,
  AccessTime,
  CalendarToday,
  Movie,
  AspectRatio,
  Download,
  Lyrics,
  Share,
  YouTube,
  AutoAwesome,
  Add,
  Check,
  ContentCopy,
  CloudUpload,
  Bolt,
} from '@mui/icons-material';
import { RootState } from '../store/store';
import { getTokensFromAllowances } from '../store/authSlice';
import { videosApi, songsApi, youtubeApi, tiktokApi, charactersApi, Character } from '../services/api';

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
  const [searchParams] = useSearchParams();
  const { user, allowances } = useSelector((state: RootState) => state.auth);
  const socialSectionRef = useRef<HTMLDivElement>(null);
  
  // Calculate remaining tokens
  const tokens = getTokensFromAllowances(allowances);
  const remainingTokens = ((tokens?.max || 0) + (tokens?.topup || 0)) - (tokens?.used || 0);
  
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
  const [editedMetadata, setEditedMetadata] = useState<typeof socialMetadata>(null);
  const [hookText, setHookText] = useState('');
  const [newTag, setNewTag] = useState('');
  
  // YouTube state
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [youtubeChannel, setYoutubeChannel] = useState<{ channelTitle?: string; channelThumbnail?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [addThumbnailIntro, setAddThumbnailIntro] = useState(true);
  
  // TikTok state
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [tiktokUsername, setTiktokUsername] = useState<string | null>(null);
  
  // Platform selection & upload confirmation
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  
  // Video characters state (for thumbnail selection)
  const [videoCharacters, setVideoCharacters] = useState<Character[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<string[]>([]); // Store all AI-generated thumbnails
  const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState<string | null>(null); // Currently selected thumbnail

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
        }
        if (response.data.socialThumbnailUrl) {
          setSocialThumbnailUrl(response.data.socialThumbnailUrl);
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
        setSocialError(`Insufficient credits. You need ${errorData.required} credits but have ${errorData.available}. Add credits or enter metadata manually.`);
      } else {
        setSocialError(errorData?.error || 'Failed to generate metadata');
      }
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!user?.userId || !videoId || !hookText.trim()) {
      setSocialError('Please enter hook text for the thumbnail');
      return;
    }
    // Filter out the toggle marker
    const realSelectedIds = selectedCharacterIds.filter(id => id !== 'toggle_open');
    if (realSelectedIds.length === 0) {
      setSocialError('Please select at least one image');
      return;
    }
    setIsGeneratingThumbnail(true);
    setSocialError(null);
    
    try {
      // Convert selected image IDs to actual URLs
      const selectedImageUrls: string[] = [];
      realSelectedIds.forEach(id => {
        // Handle different ID formats
        if (id.endsWith('_seedream')) {
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
          // Original thumbnail
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
      setSocialError(err.response?.data?.error || 'Failed to generate thumbnail');
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

  const handleConnectYouTube = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await youtubeApi.getAuthUrl(user.userId);
      const { authUrl } = response.data;
      
      // Redirect to OAuth - the callback page will handle the response
      window.location.href = authUrl;
      
    } catch (err: any) {
      setSocialError(err.response?.data?.error || 'Failed to start YouTube authorization');
    }
  };

  const handleConnectTikTok = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await tiktokApi.getAuthUrl(user.userId);
      const { authUrl } = response.data;
      
      // Redirect to OAuth - the callback page will handle the response
      window.location.href = authUrl;
      
    } catch (err: any) {
      setSocialError(err.response?.data?.error || 'Failed to start TikTok authorization');
    }
  };

  const handleYouTubeUpload = async () => {
    if (!user?.userId || !videoId) return;
    
    if (!youtubeConnected) {
      handleConnectYouTube();
      return;
    }
    
    if (!editedMetadata?.title) {
      setSocialError('Please enter a title for your video');
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
      });
      
      // Then upload to YouTube
      const response = await videosApi.uploadToYouTube(user.userId, videoId, { addThumbnailIntro });
      setYoutubeUrl(response.data.youtubeUrl);
      setSocialSuccess(`Uploaded to YouTube!`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to upload to YouTube';
      if (errorMsg.includes('not connected') || errorMsg.includes('reconnect')) {
        setYoutubeConnected(false);
      }
      setSocialError(errorMsg);
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
        <Typography variant="h6" sx={{ color: '#FF3B30', mb: 2 }}>
          {error || 'Video not available'}
        </Typography>
        <IconButton onClick={handleGoBack} sx={{ color: '#007AFF' }}>
          <ArrowBack sx={{ mr: 1 }} /> Back to Videos
        </IconButton>
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
            
            {/* Tokens Button */}
            {user && allowances && (
              <Button
                onClick={() => navigate('/payment')}
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
        </Container>
      </Box>

      <Container maxWidth={videoData.aspectRatio === 'landscape' ? 'md' : 'lg'} sx={{ mt: 3 }}>
        <Box
          sx={{
            display: 'flex',
            // Landscape videos: always column layout (video on top, info below)
            // Portrait videos: side-by-side on desktop, column on mobile
            flexDirection: videoData.aspectRatio === 'landscape' 
              ? 'column' 
              : { xs: 'column', md: 'row' },
            gap: 3,
          }}
        >
          {/* Video Player - Full width for landscape */}
          <Box sx={{ 
            flex: videoData.aspectRatio === 'landscape' ? 'none' : 1,
            width: videoData.aspectRatio === 'landscape' ? '100%' : 'auto',
          }}>
            <Paper
              ref={containerRef}
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                background: '#000',
                position: 'relative',
                aspectRatio: videoData.aspectRatio === 'landscape' ? '16/9' : '9/16',
                maxHeight: { xs: '60vh', md: '80vh' },
                mx: 'auto',
                width: videoData.aspectRatio === 'landscape' ? '100%' : 'auto',
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
                  <IconButton 
                    onClick={() => document.getElementById('social-sharing-section')?.scrollIntoView({ behavior: 'smooth' })} 
                    sx={{ color: '#fff' }}
                    title="Share to social media"
                  >
                    <Share />
                  </IconButton>
                  <IconButton onClick={handleDownload} sx={{ color: '#fff' }}>
                    <Download />
                  </IconButton>
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
          </Box>

          {/* Details & Lyrics - Side by side for landscape, stacked for portrait */}
          <Box sx={{ 
            flex: videoData.aspectRatio === 'landscape' ? 'none' : 1, 
            width: videoData.aspectRatio === 'landscape' ? '100%' : 'auto',
            minWidth: 0, 
            display: 'flex', 
            flexDirection: videoData.aspectRatio === 'landscape' 
              ? { xs: 'column', md: 'row' }  // Landscape: info and lyrics side by side on desktop
              : 'column',                     // Portrait: stacked
            gap: videoData.aspectRatio === 'landscape' ? 3 : 0,
            maxHeight: videoData.aspectRatio === 'landscape' ? 'none' : { md: '80vh' },
          }}>
            {/* Video Info Card */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 3,
                mb: videoData.aspectRatio === 'landscape' ? 0 : 2,
                background: '#fff',
                flexShrink: 0, // Don't shrink
                flex: videoData.aspectRatio === 'landscape' ? 1 : 'none', // Equal width in landscape row
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1d1d1f', mb: 2 }}>
                {videoData.songTitle || 'Music Video'}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {genreImageUrl && songData?.genre && (
                  <Chip
                    icon={
                      <Box
                        component="img"
                        src={genreImageUrl}
                        alt={songData.genre}
                        sx={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover', ml: 0.5 }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                      />
                    }
                    label={songData.genre}
                    size="small"
                    sx={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}
                  />
                )}
                {moodImageUrl && songData?.mood && (
                  <Chip
                    icon={
                      <Box
                        component="img"
                        src={moodImageUrl}
                        alt={songData.mood}
                        sx={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover', ml: 0.5 }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.style.display = 'none'; }}
                      />
                    }
                    label={songData.mood}
                    size="small"
                    sx={{ background: 'rgba(88,86,214,0.1)', color: '#5856D6' }}
                  />
                )}
                {videoData.videoType && (
                  <Chip
                    icon={<Movie sx={{ fontSize: 16, color: '#FF9500' }} />}
                    label={videoData.videoType === 'still' ? 'Still' : 'Cinematic'}
                    size="small"
                    sx={{ background: 'rgba(255,149,0,0.1)', color: '#FF9500' }}
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AccessTime sx={{ fontSize: 20, color: '#86868B' }} />
                  <Typography variant="body2" sx={{ color: '#1d1d1f' }}>
                    <strong>Duration:</strong> {formatTime(displayDuration)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AspectRatio sx={{ fontSize: 20, color: '#86868B' }} />
                  <Typography variant="body2" sx={{ color: '#1d1d1f' }}>
                    <strong>Aspect Ratio:</strong> {videoData.aspectRatio === 'landscape' ? '16:9 Landscape' : '9:16 Portrait'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CalendarToday sx={{ fontSize: 20, color: '#86868B' }} />
                  <Typography variant="body2" sx={{ color: '#1d1d1f' }}>
                    <strong>Created:</strong> {formatDate(videoData.createdAt)}
                  </Typography>
                </Box>
              </Box>

            </Paper>

            {/* Lyrics Card - Takes remaining height */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 3,
                background: '#fff',
                flex: 1, // Take remaining space (or equal width in landscape row)
                minHeight: { xs: 200, md: 0 }, // Min height on mobile
                maxHeight: videoData.aspectRatio === 'landscape' ? 400 : 'none', // Limit height for landscape
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexShrink: 0 }}>
                <Lyrics sx={{ fontSize: 22, color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                  Lyrics
                </Typography>
              </Box>
              {lyrics ? (
                <Typography
                  sx={{
                    color: '#1d1d1f',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.95rem',
                    overflow: 'auto',
                  }}
                >
                  {cleanLyrics(lyrics)}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    color: '#86868B',
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                  }}
                >
                  {songData ? 'No lyrics available for this song.' : 'Loading lyrics...'}
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>

        {/* Social Sharing Section */}
        <Paper
          ref={socialSectionRef}
          id="social-sharing-section"
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 3,
            mt: 3,
            background: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Share sx={{ fontSize: 24, color: '#FF3B30' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
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

          {/* Platform Selection - At the top */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
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
                    ? '2px solid #FF0000' 
                    : youtubeConnected 
                      ? '2px solid #34C759' 
                      : '1px solid rgba(0,0,0,0.1)',
                  background: selectedPlatforms.includes('youtube') 
                    ? 'rgba(255,0,0,0.05)' 
                    : youtubeConnected 
                      ? 'rgba(52,199,89,0.05)' 
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
                    sx={{ p: 0, mr: -0.5, color: '#FF0000', '&.Mui-checked': { color: '#FF0000' } }}
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
                    ? '2px solid #000000' 
                    : tiktokConnected 
                      ? '2px solid #34C759' 
                      : '1px solid rgba(0,0,0,0.1)',
                  background: selectedPlatforms.includes('tiktok') 
                    ? 'rgba(0,0,0,0.05)' 
                    : tiktokConnected 
                      ? 'rgba(52,199,89,0.05)' 
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
                    sx={{ p: 0, mr: -0.5, color: '#000', '&.Mui-checked': { color: '#000' } }}
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

              {/* Instagram - Coming Soon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: 'rgba(0,0,0,0.02)',
                  opacity: 0.5,
                }}
              >
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
                  <Typography sx={{ fontWeight: 600, color: '#86868B', fontSize: '0.9rem' }}>Instagram</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#007AFF', fontWeight: 500 }}>Coming Soon</Typography>
                </Box>
              </Box>

              {/* Facebook - Coming Soon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: 'rgba(0,0,0,0.02)',
                  opacity: 0.5,
                }}
              >
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
                  <Typography sx={{ fontWeight: 600, color: '#86868B', fontSize: '0.9rem' }}>Facebook</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#007AFF', fontWeight: 500 }}>Coming Soon</Typography>
                </Box>
              </Box>
            </Box>

            {/* YouTube already uploaded success */}
            {youtubeUrl && (
              <Alert 
                severity="success"
                action={
                  <Button color="inherit" size="small" href={youtubeUrl} target="_blank">
                    View
                  </Button>
                }
                sx={{ mt: 2 }}
              >
                Uploaded to YouTube!
              </Alert>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Metadata Section - Always show editor, with option to generate */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Social Media Details
              </Typography>
              
              {/* Generate with AI button */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={isGeneratingMetadata ? <CircularProgress size={18} /> : <AutoAwesome />}
                  onClick={handleGenerateMetadata}
                  disabled={isGeneratingMetadata}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    borderColor: '#007AFF',
                    color: '#007AFF',
                    '&:hover': { borderColor: '#0066CC', bgcolor: 'rgba(0,122,255,0.05)' },
                  }}
                >
                  {isGeneratingMetadata ? 'Generating...' : 'Generate with AI (10 credits)'}
                </Button>
              </Box>
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

            {/* Tags */}
            <Box sx={{ mb: 2 }}>
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

          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Select Thumbnail Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
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
                    <AutoAwesome sx={{ fontSize: 20, color: showCreatePanel ? '#007AFF' : '#86868B', mb: 0.5 }} />
                    <Typography sx={{ fontSize: '8px', color: showCreatePanel ? '#007AFF' : '#86868B', fontWeight: showCreatePanel ? 600 : 500, textAlign: 'center' }}>
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
                        borderColor: '#34C759', 
                        bgcolor: 'rgba(52,199,89,0.04)',
                      },
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 20, color: '#86868B', mb: 0.5 }} />
                    <Typography sx={{ fontSize: '8px', color: '#86868B', fontWeight: 500, textAlign: 'center' }}>
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
                    Create Custom Thumbnail
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
                  
                  // Original thumbnail fallback
                  if (!videoData?.sceneImageUrls?.length && videoData?.thumbnailUrl) {
                    availableImages.push({ url: videoData.thumbnailUrl, label: 'Original', id: 'original_thumb' });
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
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
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
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Upload Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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

        </Paper>

        {/* Upload Confirmation Modal */}
        <Dialog 
          open={showUploadConfirm} 
          onClose={() => setShowUploadConfirm(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '16px', p: 1 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            Confirm Upload
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 3 }}>
              Your video will be uploaded to the following platforms:
            </Typography>

            {/* Selected Platforms */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {selectedPlatforms.includes('youtube') && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(255,0,0,0.05)', borderRadius: '12px', border: '1px solid rgba(255,0,0,0.2)' }}>
                  <YouTube sx={{ fontSize: 32, color: '#FF0000' }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>YouTube</Typography>
                    <Typography variant="caption" sx={{ color: '#86868B' }}>
                      {youtubeChannel?.channelTitle || 'Your Channel'}
                    </Typography>
                  </Box>
                </Box>
              )}
              {selectedPlatforms.includes('tiktok') && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.2)' }}>
                  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 32, height: 32, fill: '#000' }}>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>TikTok</Typography>
                    <Typography variant="caption" sx={{ color: '#86868B' }}>
                      {tiktokUsername ? `@${tiktokUsername}` : 'Your Account'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Video Details Summary */}
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

            {/* Thumbnail Intro Toggle */}
            {socialThumbnailUrl && (
              <FormControlLabel
                control={
                  <Switch
                    checked={addThumbnailIntro}
                    onChange={(e) => setAddThumbnailIntro(e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">Add thumbnail intro with fade</Typography>}
                sx={{ mt: 2 }}
              />
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button 
              onClick={() => setShowUploadConfirm(false)}
              sx={{ borderRadius: '10px', textTransform: 'none', color: '#86868B' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={isUploading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <CloudUpload />}
              onClick={() => {
                setShowUploadConfirm(false);
                // For now, only YouTube upload is implemented
                if (selectedPlatforms.includes('youtube')) {
                  handleYouTubeUpload();
                }
                // TikTok upload will be implemented later
                if (selectedPlatforms.includes('tiktok') && !selectedPlatforms.includes('youtube')) {
                  setSocialError('TikTok upload coming soon! For now, please select YouTube.');
                }
              }}
              disabled={isUploading}
              sx={{
                bgcolor: selectedPlatforms.length > 1 ? '#007AFF' : selectedPlatforms.includes('tiktok') ? '#000' : '#FF0000',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { 
                  bgcolor: selectedPlatforms.length > 1 ? '#0066DD' : selectedPlatforms.includes('tiktok') ? '#333' : '#CC0000',
                },
              }}
            >
              {isUploading ? 'Uploading...' : 'Upload Now'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

    </Box>
  );
};

export default MusicVideoPlayer;
