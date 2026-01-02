import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Paper,
  useMediaQuery,
  useTheme,
  Divider,
  Button,
  TextField,
  Alert,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrowRounded,
  Pause,
  Fullscreen,
  FullscreenExit,
  MusicNote,
  AccessTime,
  CalendarToday,
  Movie,
  AspectRatio,
  Download,
  Mic,
  Lyrics,
  Share,
  YouTube,
  AutoAwesome,
  Image as ImageIcon,
  Edit,
  Add,
  LocationOn,
  Refresh,
  Check,
  ContentCopy,
} from '@mui/icons-material';
import { RootState } from '../store/store';
import { videosApi, songsApi, youtubeApi, charactersApi, Character } from '../services/api';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state: RootState) => state.auth);
  
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
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [socialLocation, setSocialLocation] = useState('');
  const [socialError, setSocialError] = useState<string | null>(null);
  const [socialSuccess, setSocialSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMetadata, setEditedMetadata] = useState<typeof socialMetadata>(null);
  const [hookText, setHookText] = useState('');
  const [newTag, setNewTag] = useState('');
  
  // YouTube state
  const [youtubeConnected, setYoutubeConnected] = useState(false);
  const [youtubeChannel, setYoutubeChannel] = useState<{ channelTitle?: string; channelThumbnail?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [addThumbnailIntro, setAddThumbnailIntro] = useState(true);
  
  // Video characters state (for thumbnail selection)
  const [videoCharacters, setVideoCharacters] = useState<Character[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);

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
        
        // Pre-select all images by default (seedream + original images)
        const allImageIds: string[] = [];
        usedCharacters.forEach((char: Character) => {
          // Add seedream reference if available
          if (videoData.seedreamReferenceUrls?.[char.characterId]) {
            allImageIds.push(`${char.characterId}_seedream`);
          }
          // Add all original images
          char.imageUrls?.forEach((_, idx) => {
            allImageIds.push(`${char.characterId}_img_${idx}`);
          });
        });
        setSelectedCharacterIds(allImageIds);
      } catch (err) {
        console.error('Failed to fetch video characters:', err);
      }
    };
    
    fetchVideoCharacters();
  }, [user?.userId, videoData?.characterIds, videoData?.seedreamReferenceUrls]);

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
          setSocialLocation(response.data.socialMetadata.location || '');
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
    };
    
    loadSocialData();
  }, [user?.userId, videoId]);

  // Social sharing handlers
  const handleGenerateMetadata = async () => {
    if (!user?.userId || !videoId) return;
    setIsGeneratingMetadata(true);
    setSocialError(null);
    
    try {
      const response = await videosApi.generateSocialMetadata(user.userId, videoId, { location: socialLocation });
      const newMetadata = response.data.socialMetadata;
      setSocialMetadata(newMetadata);
      setEditedMetadata(newMetadata);
      setHookText(newMetadata.hook || '');
      setSocialSuccess('Social metadata generated! (10 credits used)');
      setTimeout(() => setSocialSuccess(null), 3000);
    } catch (err: any) {
      setSocialError(err.response?.data?.error || 'Failed to generate metadata');
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleSaveMetadata = async () => {
    if (!user?.userId || !videoId || !editedMetadata) return;
    setSocialError(null);
    
    try {
      await videosApi.updateSocialMetadata(user.userId, videoId, editedMetadata);
      setSocialMetadata(editedMetadata);
      setIsEditing(false);
      setSocialSuccess('Metadata saved!');
      setTimeout(() => setSocialSuccess(null), 3000);
    } catch (err: any) {
      setSocialError(err.response?.data?.error || 'Failed to save metadata');
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!user?.userId || !videoId || !hookText.trim()) {
      setSocialError('Please enter hook text for the thumbnail');
      return;
    }
    setIsGeneratingThumbnail(true);
    setSocialError(null);
    
    try {
      // Convert selected image IDs to actual URLs
      const selectedImageUrls: string[] = [];
      selectedCharacterIds.forEach(id => {
        // Parse the ID format: characterId_seedream or characterId_img_N
        if (id.endsWith('_seedream')) {
          const charId = id.replace('_seedream', '');
          const url = videoData?.seedreamReferenceUrls?.[charId];
          if (url) selectedImageUrls.push(url);
        } else if (id.includes('_img_')) {
          const [charId, , idxStr] = id.split('_img_');
          const idx = parseInt(idxStr || '0');
          const char = videoCharacters.find(c => c.characterId === charId);
          if (char?.imageUrls?.[idx]) {
            selectedImageUrls.push(char.imageUrls[idx]);
          }
        }
      });
      
      const response = await videosApi.generateSocialThumbnail(user.userId, videoId, {
        hookText,
        selectedImageUrls: selectedImageUrls.length > 0 ? selectedImageUrls : undefined,
      });
      setSocialThumbnailUrl(response.data.thumbnailUrl);
      setSocialSuccess('Thumbnail generated! (10 credits used)');
      setTimeout(() => setSocialSuccess(null), 3000);
    } catch (err: any) {
      setSocialError(err.response?.data?.error || 'Failed to generate thumbnail');
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleAddTag = () => {
    if (editedMetadata && newTag.trim()) {
      const updatedTags = [...(editedMetadata.tags || []), newTag.trim()];
      setEditedMetadata({ ...editedMetadata, tags: updatedTags });
      setNewTag('');
    }
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
      
      const authWindow = window.open(authUrl, 'YouTube Authorization', 'width=600,height=700');
      
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === 'youtube-oauth-callback') {
          const { code, state } = event.data;
          window.removeEventListener('message', handleMessage);
          
          try {
            const callbackResponse = await youtubeApi.handleCallback(code, state);
            setYoutubeConnected(true);
            setYoutubeChannel(callbackResponse.data.channelInfo);
            setSocialSuccess('YouTube connected!');
            setTimeout(() => setSocialSuccess(null), 3000);
          } catch (err: any) {
            setSocialError(err.response?.data?.error || 'Failed to connect YouTube');
          }
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);
      
    } catch (err: any) {
      setSocialError(err.response?.data?.error || 'Failed to start YouTube authorization');
    }
  };

  const handleYouTubeUpload = async () => {
    if (!user?.userId || !videoId) return;
    
    if (!youtubeConnected) {
      handleConnectYouTube();
      return;
    }
    
    setIsUploading(true);
    setSocialError(null);
    
    try {
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
          <Box sx={{ display: 'flex', alignItems: 'center', py: 1.5, gap: 2 }}>
            <IconButton onClick={handleGoBack} sx={{ color: '#007AFF' }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
              {videoData.songTitle || 'Music Video'}
            </Typography>
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

          {/* Generate Metadata Section */}
          {!socialMetadata ? (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#86868B', mb: 2 }}>
                Generate AI-powered title, description, tags, and hook for your video
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <TextField
                  label="Location (Optional)"
                  placeholder="e.g., New York City, Beach sunset"
                  value={socialLocation}
                  onChange={(e) => setSocialLocation(e.target.value)}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ color: '#86868B', mr: 1 }} />,
                  }}
                  sx={{ flex: 1, minWidth: 250 }}
                  size="small"
                />
                <Button
                  variant="contained"
                  startIcon={isGeneratingMetadata ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <AutoAwesome />}
                  onClick={handleGenerateMetadata}
                  disabled={isGeneratingMetadata}
                  sx={{
                    background: 'linear-gradient(135deg, #007AFF, #5856D6)',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { background: 'linear-gradient(135deg, #0066CC, #4845B3)' },
                  }}
                >
                  {isGeneratingMetadata ? 'Generating...' : 'Generate Metadata (10 credits)'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              {/* Metadata Editor */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Social Media Details
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<Refresh />}
                    onClick={handleGenerateMetadata}
                    disabled={isGeneratingMetadata}
                    size="small"
                  >
                    Regenerate
                  </Button>
                  {!isEditing ? (
                    <Button startIcon={<Edit />} onClick={() => setIsEditing(true)} size="small">
                      Edit
                    </Button>
                  ) : (
                    <Button startIcon={<Check />} onClick={handleSaveMetadata} size="small" variant="contained">
                      Save
                    </Button>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {/* Title */}
                <TextField
                  fullWidth
                  label="Title"
                  value={editedMetadata?.title || ''}
                  onChange={(e) => setEditedMetadata(prev => prev ? { ...prev, title: e.target.value } : null)}
                  disabled={!isEditing}
                  size="small"
                  inputProps={{ maxLength: 100 }}
                  helperText={`${editedMetadata?.title?.length || 0}/100`}
                />

                {/* Hook */}
                <TextField
                  fullWidth
                  label="Hook (for thumbnail)"
                  value={editedMetadata?.hook || ''}
                  onChange={(e) => {
                    setEditedMetadata(prev => prev ? { ...prev, hook: e.target.value } : null);
                    setHookText(e.target.value);
                  }}
                  disabled={!isEditing}
                  size="small"
                  placeholder="e.g., 'Epic Adventure Awaits!'"
                />
              </Box>

              {/* Description */}
              <Box sx={{ position: 'relative', mt: 2 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editedMetadata?.description || ''}
                  onChange={(e) => setEditedMetadata(prev => prev ? { ...prev, description: e.target.value } : null)}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                  size="small"
                />
                <Tooltip title="Copy description">
                  <IconButton
                    onClick={handleCopyDescription}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    size="small"
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Tags */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#86868B', fontWeight: 500 }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {editedMetadata?.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag.startsWith('#') ? tag : `#${tag}`}
                      size="small"
                      onDelete={isEditing ? () => handleRemoveTag(tag) : undefined}
                      sx={{
                        bgcolor: 'rgba(0,122,255,0.1)',
                        color: '#007AFF',
                        '& .MuiChip-deleteIcon': { color: '#007AFF' },
                      }}
                    />
                  ))}
                </Box>
                {isEditing && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      sx={{ flex: 1, maxWidth: 200 }}
                    />
                    <IconButton onClick={handleAddTag} disabled={!newTag.trim()} size="small">
                      <Add />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Thumbnail Generation */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
              Custom Thumbnail
            </Typography>
            
            <Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Hook Text (appears on thumbnail)"
                  value={hookText}
                  onChange={(e) => setHookText(e.target.value)}
                  placeholder="e.g., 'This Changes Everything!'"
                  size="small"
                  sx={{ mb: 2 }}
                  helperText="Catchy 2-6 word phrase"
                />

                {/* Characters/Products Selection with ALL images */}
                {videoCharacters.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#86868B', fontWeight: 500, mb: 1.5 }}>
                      Include in Thumbnail (click images to select)
                    </Typography>
                    
                    {videoCharacters.map((char) => {
                      // Collect all images for this character
                      const allImages: { url: string; label: string; id: string }[] = [];
                      
                      // Add Seedream reference image (AI-generated) if available
                      const seedreamUrl = videoData?.seedreamReferenceUrls?.[char.characterId];
                      if (seedreamUrl) {
                        allImages.push({
                          url: seedreamUrl,
                          label: 'AI Reference',
                          id: `${char.characterId}_seedream`,
                        });
                      }
                      
                      // Add all original images
                      char.imageUrls?.forEach((url, idx) => {
                        allImages.push({
                          url,
                          label: char.characterType === 'App' ? `Screenshot ${idx + 1}` : `Image ${idx + 1}`,
                          id: `${char.characterId}_img_${idx}`,
                        });
                      });
                      
                      if (allImages.length === 0) return null;
                      
                      return (
                        <Box key={char.characterId} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography sx={{ fontSize: 14 }}>
                              {char.characterType === 'App' ? '📱' : 
                               char.characterType === 'Product' ? '📦' :
                               char.characterType === 'Place' ? '🏠' : '👤'}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                              {char.characterName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#86868B' }}>
                              ({char.characterType || 'Character'})
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {allImages.map((img) => {
                              const isSelected = selectedCharacterIds.includes(img.id);
                              
                              return (
                                <Box
                                  key={img.id}
                                  onClick={() => {
                                    setSelectedCharacterIds(prev => 
                                      isSelected 
                                        ? prev.filter(id => id !== img.id)
                                        : [...prev, img.id]
                                    );
                                  }}
                                  sx={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                    borderRadius: 1.5,
                                    overflow: 'hidden',
                                    border: isSelected ? '3px solid #007AFF' : '2px solid transparent',
                                    boxShadow: isSelected ? '0 0 0 2px rgba(0,122,255,0.3)' : 'none',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    },
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={img.url}
                                    alt={img.label}
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      objectFit: 'cover',
                                      display: 'block',
                                    }}
                                  />
                                  {/* Label badge */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      bgcolor: 'rgba(0,0,0,0.6)',
                                      color: '#fff',
                                      fontSize: '9px',
                                      fontWeight: 500,
                                      textAlign: 'center',
                                      py: 0.25,
                                    }}
                                  >
                                    {img.label}
                                  </Box>
                                  {/* Selection checkmark */}
                                  {isSelected && (
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        width: 18,
                                        height: 18,
                                        borderRadius: '50%',
                                        bgcolor: '#007AFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <Check sx={{ fontSize: 12, color: '#fff' }} />
                                    </Box>
                                  )}
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                <Button
                  variant="outlined"
                  startIcon={isGeneratingThumbnail ? <CircularProgress size={18} /> : <ImageIcon />}
                  onClick={handleGenerateThumbnail}
                  disabled={isGeneratingThumbnail || !hookText.trim()}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  {isGeneratingThumbnail ? 'Generating...' : 'Generate Thumbnail (10 credits)'}
                </Button>
              </Box>

              {/* Thumbnail Preview - shows below the generate button */}
              {(socialThumbnailUrl || videoData?.thumbnailUrl) && (
                <Box
                  sx={{
                    mt: 2,
                    width: videoData?.aspectRatio === 'landscape' ? '100%' : 200,
                    maxWidth: videoData?.aspectRatio === 'landscape' ? 480 : 200,
                    aspectRatio: videoData?.aspectRatio === 'landscape' ? '16/9' : '9/16',
                    bgcolor: '#f5f5f7',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <img
                    src={socialThumbnailUrl || videoData?.thumbnailUrl}
                    alt="Thumbnail Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* YouTube Upload Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <YouTube sx={{ fontSize: 32, color: '#FF0000' }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Upload to YouTube {videoData?.aspectRatio === 'portrait' ? 'Shorts' : ''}
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868B' }}>
                  {youtubeConnected 
                    ? `Connected: ${youtubeChannel?.channelTitle || 'Your Channel'}`
                    : 'Connect your YouTube account to upload'
                  }
                </Typography>
              </Box>
              {youtubeChannel?.channelThumbnail && (
                <Box
                  component="img"
                  src={youtubeChannel.channelThumbnail}
                  alt="Channel"
                  sx={{ width: 40, height: 40, borderRadius: '50%' }}
                />
              )}
            </Box>

            {/* Thumbnail intro toggle */}
            {youtubeConnected && socialMetadata && socialThumbnailUrl && (
              <FormControlLabel
                control={
                  <Switch
                    checked={addThumbnailIntro}
                    onChange={(e) => setAddThumbnailIntro(e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">Add 2-second thumbnail intro with fade transition</Typography>}
                sx={{ mb: 2 }}
              />
            )}

            {youtubeUrl ? (
              <Alert 
                severity="success"
                action={
                  <Button color="inherit" size="small" href={youtubeUrl} target="_blank">
                    View on YouTube
                  </Button>
                }
              >
                Successfully uploaded to YouTube!
              </Alert>
            ) : (
              <Button
                variant="contained"
                startIcon={isUploading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <YouTube />}
                onClick={handleYouTubeUpload}
                disabled={isUploading || (!youtubeConnected && !socialMetadata)}
                sx={{
                  bgcolor: youtubeConnected ? '#FF0000' : '#1D1D1F',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { bgcolor: youtubeConnected ? '#CC0000' : '#333' },
                }}
              >
                {isUploading 
                  ? 'Uploading...' 
                  : youtubeConnected 
                    ? (socialMetadata ? 'Upload to YouTube' : 'Generate Metadata First')
                    : 'Connect YouTube Account'
                }
              </Button>
            )}

            {/* Coming Soon Platforms */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3, opacity: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 24, height: 24, borderRadius: 0.5, bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>T</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#86868B' }}>TikTok (Coming Soon)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 24, height: 24, borderRadius: 0.5, 
                  background: 'linear-gradient(45deg, #405DE6, #833AB4, #E1306C, #F77737)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>I</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#86868B' }}>Instagram (Coming Soon)</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

    </Box>
  );
};

export default MusicVideoPlayer;
