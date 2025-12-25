import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Slider,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrowRounded,
  Pause,
  Replay10,
  Forward10,
  Fullscreen,
  FullscreenExit,
  VolumeUp,
  VolumeOff,
} from '@mui/icons-material';
import { RootState } from '../store/store';
import { videosApi } from '../services/api';

interface VideoData {
  videoId: string;
  songId: string;
  songTitle?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt: string;
  status: string;
}

const MusicVideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      if (!user?.userId || !videoId) {
        setError('Unable to load video');
        setLoading(false);
        return;
      }

      try {
        const response = await videosApi.getUserVideos(user.userId);
        const videos = response.data.videos || [];
        const video = videos.find((v: VideoData) => v.videoId === videoId);
        
        if (video) {
          setVideoData(video);
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

    fetchVideo();
  }, [user?.userId, videoId]);

  // Show/hide controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
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

  const handleSeek = useCallback((_event: Event, value: number | number[]) => {
    if (!videoRef.current) return;
    const newTime = value as number;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const handleSkipBackward = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
  }, []);

  const handleSkipForward = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
  }, [duration]);

  const handleVolumeChange = useCallback((_event: Event, value: number | number[]) => {
    if (!videoRef.current) return;
    const newVolume = value as number;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const handleMuteToggle = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

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
    setShowControls(true);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1D1D1F 0%, #2D2D2F 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#007AFF', mb: 2 }} size={48} />
        <Typography sx={{ color: '#fff' }}>Loading video...</Typography>
      </Box>
    );
  }

  if (error || !videoData?.videoUrl) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1D1D1F 0%, #2D2D2F 100%)',
        }}
      >
        <Typography variant="h6" sx={{ color: '#FF3B30', mb: 2 }}>
          {error || 'Video not available'}
        </Typography>
        <IconButton onClick={handleGoBack} sx={{ color: '#fff' }}>
          <ArrowBack /> Back
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#000',
        zIndex: 9999,
        cursor: showControls ? 'default' : 'none',
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

      {/* Controls Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: showControls
            ? 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%)'
            : 'transparent',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none',
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <IconButton onClick={handleGoBack} sx={{ color: '#fff' }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 600,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {videoData.songTitle || 'Music Video'}
          </Typography>
        </Box>

        {/* Center Play Button (when paused) */}
        {!isPlaying && !isBuffering && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
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

        {/* Bottom Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            pb: 3,
          }}
        >
          {/* Progress Bar */}
          <Box sx={{ px: 2, mb: 2 }}>
            <Slider
              value={currentTime}
              min={0}
              max={duration || 100}
              onChange={handleSeek}
              sx={{
                color: '#007AFF',
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 4px 16px rgba(0,122,255,0.5)',
                  },
                },
                '& .MuiSlider-track': {
                  background: 'linear-gradient(90deg, #007AFF, #5856D6)',
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  background: 'rgba(255,255,255,0.3)',
                },
              }}
            />
          </Box>

          {/* Time & Controls Row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
            }}
          >
            {/* Time */}
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            {/* Center Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleSkipBackward} sx={{ color: '#fff' }}>
                <Replay10 />
              </IconButton>
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  width: 56,
                  height: 56,
                  background: '#007AFF',
                  color: '#fff',
                  '&:hover': {
                    background: '#0066CC',
                  },
                }}
              >
                {isPlaying ? (
                  <Pause sx={{ fontSize: 32 }} />
                ) : (
                  <PlayArrowRounded sx={{ fontSize: 32 }} />
                )}
              </IconButton>
              <IconButton onClick={handleSkipForward} sx={{ color: '#fff' }}>
                <Forward10 />
              </IconButton>
            </Box>

            {/* Right Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={handleMuteToggle} sx={{ color: '#fff' }}>
                {isMuted ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
              <Box sx={{ width: 80, display: { xs: 'none', sm: 'block' } }}>
                <Slider
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={handleVolumeChange}
                  sx={{
                    color: '#fff',
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                    },
                    '& .MuiSlider-track': {
                      border: 'none',
                    },
                    '& .MuiSlider-rail': {
                      background: 'rgba(255,255,255,0.3)',
                    },
                  }}
                />
              </Box>
              <IconButton onClick={handleFullscreenToggle} sx={{ color: '#fff' }}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MusicVideoPlayer;



