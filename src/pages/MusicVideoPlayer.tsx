import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Lyrics
} from '@mui/icons-material';
import { RootState } from '../store/store';
import { videosApi, songsApi } from '../services/api';

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

  // Fetch video and song data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId || !videoId) {
        setError('Unable to load video');
        setLoading(false);
        return;
      }

      try {
        // Fetch video
        const videoResponse = await videosApi.getUserVideos(user.userId);
        const videos = videoResponse.data.videos || [];
        const video = videos.find((v: VideoData) => v.videoId === videoId);
        
        if (video) {
          setVideoData(video);
          
          // Fetch associated song for lyrics
          if (video.songId) {
            try {
              const songsResponse = await songsApi.getUserSongs(user.userId);
              const songs = songsResponse.data.songs || [];
              const song = songs.find((s: SongData) => s.songId === video.songId);
              if (song) {
                setSongData(song);
              }
            } catch (songErr) {
              console.error('Error fetching song:', songErr);
            }
          }
        } else {
          setError('Video not found');
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.userId, videoId]);

  const handleGoBack = useCallback(() => {
    navigate('/dashboard?tab=videos');
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

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
          }}
        >
          {/* Left Column - Video Player */}
          <Box sx={{ flex: 1 }}>
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

          {/* Right Column - Details & Lyrics */}
          <Box sx={{ 
            flex: 1, 
            minWidth: 0, 
            display: 'flex', 
            flexDirection: 'column',
            maxHeight: { md: '80vh' }, // Match video height on desktop
          }}>
            {/* Video Info Card */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 3,
                mb: 2,
                background: '#fff',
                flexShrink: 0, // Don't shrink
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1d1d1f', mb: 2 }}>
                {videoData.songTitle || 'Music Video'}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {songData?.genre && (
                  <Chip
                    icon={
                      <Box
                        component="img"
                        src={`/genres/${songData.genre.toLowerCase().replace(/\s+/g, '-').replace('r&b', 'rnb')}.jpeg`}
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
                {songData?.mood && (
                  <Chip
                    icon={
                      <Box
                        component="img"
                        src={`/moods/${songData.mood.toLowerCase()}.jpeg`}
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
            {lyrics && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 3,
                  background: '#fff',
                  flex: 1, // Take remaining space
                  minHeight: { xs: 200, md: 0 }, // Min height on mobile
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
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MusicVideoPlayer;
