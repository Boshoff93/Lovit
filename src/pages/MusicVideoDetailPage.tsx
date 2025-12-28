import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import {
  Typography,
  Box,
  Container,
  Button,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PaletteIcon from '@mui/icons-material/Palette';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useNavigate, useParams } from 'react-router-dom';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

// Sample music videos data
export const musicVideoData = [
  // Real Gruvi videos
  {
    id: 'polaroid-summer',
    title: 'Polaroid Summer',
    style: '3D Cartoon',
    styleId: '3d-cartoon',
    genre: 'Indie',
    views: '1.2K',
    duration: '1:59',
    bpm: 110,
    thumbnail: '/thumbnails/duck.jpeg',
    aspectRatio: 'portrait' as const,
    realVideoId: 'da4d792d-a24b-45d8-87ba-5b41778496e8',
    description: 'A nostalgic summer journey with a charming duck character',
    fullDescription: 'Polaroid Summer takes you on a heartwarming journey through sun-drenched memories. Follow an adorable duck character through cozy kitchens and golden afternoons, all rendered in beautiful 3D cartoon style that captures the warmth of cherished summer moments.',
  },
  {
    id: 'cha-la-head-cha-la',
    title: 'Cha-La Head-Cha-La',
    style: 'Anime',
    styleId: 'anime',
    genre: 'Rock',
    views: '3.5K',
    duration: '2:10',
    bpm: 150,
    thumbnail: '/thumbnails/goku.jpeg',
    aspectRatio: 'landscape' as const,
    realVideoId: '4a7ec232-aca9-4538-bc79-45149d705812',
    description: 'Epic Dragon Ball inspired anime adventure',
    fullDescription: 'Experience the legendary Dragon Ball theme song brought to life with stunning anime visuals. Watch as warriors power up, battle across epic landscapes, and push beyond their limits in this high-energy tribute to the iconic series.',
  },
  // Placeholder videos
  {
    id: 'neon-city-nights',
    title: 'Neon City Nights',
    style: 'Cyberpunk',
    styleId: 'photo-realism',
    genre: 'Electronic',
    views: '45.2K',
    duration: '3:24',
    bpm: 128,
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=1067&fit=crop',
    aspectRatio: 'portrait' as const,
    description: 'A futuristic journey through neon-lit cityscapes',
    fullDescription: 'Experience the electric energy of the future in this cyberpunk-inspired music video. Neon lights pulse to the beat as futuristic cityscapes unfold, creating an immersive visual journey that captures the essence of electronic music.',
  },
  {
    id: 'ocean-dreams',
    title: 'Ocean Dreams',
    style: '3D Animation',
    styleId: '3d-cartoon',
    genre: 'Ambient',
    views: '32.8K',
    duration: '4:12',
    bpm: 80,
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=1067&fit=crop',
    aspectRatio: 'portrait' as const,
    description: 'Serene underwater visuals with flowing 3D animation',
    fullDescription: 'Dive into a tranquil underwater world with stunning 3D animated visuals. Ocean Dreams takes you on a peaceful journey through crystal-clear waters, coral reefs, and gentle sea life, perfectly synchronized to ambient soundscapes.',
  },
  {
    id: 'mountain-journey',
    title: 'Mountain Journey',
    style: 'Cinematic',
    styleId: 'photo-realism',
    genre: 'Cinematic',
    views: '28.5K',
    duration: '3:45',
    bpm: 100,
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=1067&fit=crop',
    aspectRatio: 'portrait' as const,
    description: 'Epic mountain landscapes with dramatic cinematography',
    fullDescription: 'Embark on an epic visual journey through majestic mountain peaks and sweeping valleys. This cinematic music video combines dramatic camera movements with orchestral music for an awe-inspiring experience.',
  },
  {
    id: 'urban-rhythm',
    title: 'Urban Rhythm',
    style: 'Anime',
    styleId: 'anime',
    genre: 'Hip Hop',
    views: '38.1K',
    duration: '2:58',
    bpm: 95,
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=1067&fit=crop',
    aspectRatio: 'portrait' as const,
    description: 'Anime-style street scenes with urban energy',
    fullDescription: 'Urban Rhythm brings anime aesthetics to hip hop with dynamic street scenes, expressive characters, and fluid animation. The video pulses with urban energy, capturing the raw power of the city.',
  },
  {
    id: 'fantasy-quest',
    title: 'Fantasy Quest',
    style: '3D Cartoon',
    styleId: '3d-cartoon',
    genre: 'Soundtrack',
    views: '52.3K',
    duration: '4:30',
    bpm: 140,
    thumbnail: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&h=1067&fit=crop',
    aspectRatio: 'portrait' as const,
    description: 'Adventure through magical worlds in 3D cartoon style',
    fullDescription: 'Join the ultimate adventure in this 3D cartoon music video. Fantasy Quest takes you through magical forests, ancient castles, and mystical creatures, all brought to life with vibrant Pixar-quality animation.',
  },
];

const MusicVideoDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { videoId } = useParams<{ videoId: string }>();

  const { currentSong } = useAudioPlayer();
  
  // Video player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  // Carousel scroll state for fade gradients and arrows
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  
  // Video URL state (fetched from API for signed URLs)
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  // Find the current video data
  const currentVideo = useMemo(() => {
    return musicVideoData.find(video => video.id === videoId);
  }, [videoId]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    // Reset video state when changing videos
    setShowVideo(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setVideoUrl(null);
    setVideoError(null);
  }, [videoId]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Carousel scroll handler to show/hide fade gradients
  const handleCarouselScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const overflow = scrollWidth > clientWidth + 5;
    setHasOverflow(overflow);
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(overflow && scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  // Scroll carousel left/right
  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  // Check scroll state on mount, resize, and after images load
  useEffect(() => {
    // Delay initial check to ensure carousel is rendered
    const timer = setTimeout(handleCarouselScroll, 100);
    window.addEventListener('resize', handleCarouselScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleCarouselScroll);
    };
  }, [handleCarouselScroll, videoId]);

  // Video player handlers
  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const handleStartVideo = useCallback(async () => {
    if (!currentVideo?.realVideoId) return;
    
    setShowVideo(true);
    setVideoLoading(true);
    setVideoError(null);
    
    try {
      // Fetch signed URL from backend
      const apiBase = process.env.REACT_APP_API_URL || 'https://api.gruvimusic.com';
      const response = await fetch(`${apiBase}/api/gruvi/videos/public/${currentVideo.realVideoId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load video');
      }
      
      const data = await response.json();
      setVideoUrl(data.videoUrl);
      
      // Auto-play after URL is loaded
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error('Error loading video:', err);
      setVideoError('Failed to load video. Please try again.');
      setShowVideo(false);
    } finally {
      setVideoLoading(false);
    }
  }, [currentVideo?.realVideoId]);

  const handleFullscreenToggle = useCallback(() => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If video not found, redirect to home
  if (!currentVideo) {
    navigate('/');
    return null;
  }

  // Check if this video has a real video ID (for playback)
  const hasRealVideo = !!currentVideo.realVideoId;

  // Create breadcrumb data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://gruvi.ai/' },
    { name: 'Music Videos', url: 'https://gruvi.ai/videos' },
    { name: currentVideo.title, url: `https://gruvi.ai/videos/${currentVideo.id}` }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fff',
        position: 'relative',
        pb: currentSong ? { xs: 10, sm: 12, md: 14 } : 0,
        transition: 'padding-bottom 0.3s ease-out',
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at top, rgba(0, 122, 255, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SEO
        title={`${currentVideo.title} - ${currentVideo.style} Music Video | Gruvi`}
        description={`${currentVideo.fullDescription} Created with Gruvi's AI music video generator.`}
        keywords={`${currentVideo.title.toLowerCase()}, ${currentVideo.style.toLowerCase()} music video, ${currentVideo.genre.toLowerCase()} music, AI music video`}
        ogTitle={`${currentVideo.title} - ${currentVideo.style} Music Video | Gruvi`}
        ogDescription={currentVideo.description}
        ogType="video.other"
        ogUrl={`https://gruvi.ai/videos/${currentVideo.id}`}
        twitterTitle={`${currentVideo.title} | Gruvi`}
        twitterDescription={currentVideo.description}
        structuredData={[createBreadcrumbStructuredData(breadcrumbData)]}
      />

      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            mb: 4,
            color: '#1D1D1F',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(0,0,0,0.05)',
            }
          }}
        >
          Back to Home
        </Button>

        {/* Main Content */}
        {/* Different layout for landscape vs portrait videos */}
        {currentVideo.aspectRatio === 'landscape' ? (
          // Landscape layout - video on top, info below
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Video Player - Full width for landscape */}
            <Box sx={{ width: '100%' }} ref={containerRef}>
              <Box
                sx={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                  background: '#000',
                }}
              >
                {/* Show video if playing, otherwise show thumbnail */}
                {showVideo ? (
                  <>
                    {videoUrl ? (
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        poster={currentVideo.thumbnail}
                        onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
                        onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={() => setIsPlaying(false)}
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
                    ) : (
                      <Box
                        component="img"
                        src={currentVideo.thumbnail}
                        alt={currentVideo.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    {/* Loading/Buffering indicator */}
                    {(videoLoading || isBuffering) && (
                      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                        <CircularProgress sx={{ color: '#fff' }} size={64} />
                      </Box>
                    )}
                    {/* Error message */}
                    {videoError && (
                      <Box sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        zIndex: 10,
                        textAlign: 'center',
                        p: 3,
                      }}>
                        <Typography sx={{ color: '#fff', mb: 2 }}>{videoError}</Typography>
                        <Button 
                          variant="contained" 
                          onClick={() => { setShowVideo(false); setVideoError(null); }}
                          sx={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                        >
                          Close
                        </Button>
                      </Box>
                    )}
                    {/* Play/Pause overlay when paused */}
                    {!isPlaying && !isBuffering && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        onClick={handlePlayPause}
                      >
                        <IconButton
                          sx={{
                            background: 'rgba(255,255,255,0.95)',
                            width: 72,
                            height: 72,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                            '&:hover': { background: '#fff', transform: 'scale(1.1)' },
                          }}
                        >
                          <PlayArrowRoundedIcon sx={{ fontSize: 40, color: '#007AFF' }} />
                        </IconButton>
                      </Box>
                    )}
                    {/* Video Controls */}
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
                          {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                        </IconButton>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </Typography>
                      </Box>
                      <IconButton onClick={handleFullscreenToggle} sx={{ color: '#fff' }}>
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                      </IconButton>
                    </Box>
                    {/* Progress bar */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 56,
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
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      component="img"
                      src={currentVideo.thumbnail}
                      alt={currentVideo.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* Play Button Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.2)',
                        cursor: hasRealVideo ? 'pointer' : 'default',
                      }}
                      onClick={hasRealVideo ? handleStartVideo : undefined}
                    >
                      <IconButton
                        onClick={hasRealVideo ? handleStartVideo : undefined}
                        sx={{
                          background: 'rgba(255,255,255,0.98)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          width: 72,
                          height: 72,
                          border: '1px solid rgba(0,0,0,0.06)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: '#fff',
                            transform: 'translateY(-3px) scale(1.08)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                          },
                        }}
                      >
                        <PlayArrowRoundedIcon sx={{ fontSize: 40, color: '#007AFF' }} />
                      </IconButton>
                    </Box>
                  </>
                )}
                {/* Style Badge */}
                <Chip
                  label={currentVideo.style}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    color: '#FF9500',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    border: '1px solid rgba(255, 149, 0, 0.3)',
                    px: 1,
                    zIndex: 5,
                  }}
                />
              </Box>
            </Box>

            {/* Info Section for Landscape */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: '#1D1D1F',
                  mb: 1,
                  fontFamily: '"Fredoka", "Nunito", sans-serif',
                }}
              >
                {currentVideo.title}
              </Typography>
              <Typography sx={{ color: '#86868B', fontSize: '1.1rem', mb: 3 }}>
                {currentVideo.description}
              </Typography>
              <Typography sx={{ color: '#1D1D1F', lineHeight: 1.8, mb: 4 }}>
                {currentVideo.fullDescription}
              </Typography>

              {/* Stats Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <MusicNoteIcon sx={{ fontSize: 18, color: '#86868B' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#86868B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Genre</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>{currentVideo.genre}</Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <PaletteIcon sx={{ fontSize: 18, color: '#86868B' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#86868B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Style</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>{currentVideo.style}</Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: '#86868B' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#86868B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Duration</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>{currentVideo.duration}</Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <SpeedIcon sx={{ fontSize: 18, color: '#86868B' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#86868B', textTransform: 'uppercase', letterSpacing: 0.5 }}>BPM</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>{currentVideo.bpm}</Typography>
                </Box>
              </Box>

              {/* Action Button */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: "center" }}>
                <Button
                  variant="contained"
                  endIcon={<KeyboardArrowRightIcon />}
                  onClick={() => navigate('/create?tab=video')}
                  sx={{
                    background: '#007AFF',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    '&:hover': {
                      background: '#0056CC',
                    },
                  }}
                >
                  Create Similar
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          // Portrait layout - side by side
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Video Player */}
          <Box 
            ref={containerRef}
            sx={{ flex: { xs: 'none', md: '0 0 280px' }, maxWidth: { xs: '240px', sm: '260px', md: '280px' }, mx: { xs: 'auto', md: 0 } }}
          >
            <Box
              sx={{
                position: 'relative',
                aspectRatio: '9/16',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                background: '#000',
              }}
            >
              {/* Show video if playing, otherwise show thumbnail */}
              {showVideo ? (
                <>
                  {videoUrl ? (
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      poster={currentVideo.thumbnail}
                      onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
                      onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
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
                  ) : (
                    <Box
                      component="img"
                      src={currentVideo.thumbnail}
                      alt={currentVideo.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  {/* Loading/Buffering indicator */}
                  {(videoLoading || isBuffering) && (
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                      <CircularProgress sx={{ color: '#fff' }} size={48} />
                    </Box>
                  )}
                  {/* Error message */}
                  {videoError && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)', 
                      zIndex: 10,
                      textAlign: 'center',
                      p: 2,
                    }}>
                      <Typography sx={{ color: '#fff', fontSize: '0.85rem', mb: 1 }}>{videoError}</Typography>
                      <Button 
                        size="small"
                        variant="contained" 
                        onClick={() => { setShowVideo(false); setVideoError(null); }}
                        sx={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                      >
                        Close
                      </Button>
                    </Box>
                  )}
                  {/* Play/Pause overlay when paused */}
                  {!isPlaying && !isBuffering && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={handlePlayPause}
                    >
                      <IconButton
                        sx={{
                          background: 'rgba(255,255,255,0.95)',
                          width: 56,
                          height: 56,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                          '&:hover': { background: '#fff', transform: 'scale(1.1)' },
                        }}
                      >
                        <PlayArrowRoundedIcon sx={{ fontSize: 32, color: '#007AFF' }} />
                      </IconButton>
                    </Box>
                  )}
                  {/* Video Controls */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1.5,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton onClick={handlePlayPause} sx={{ color: '#fff', p: 0.5 }}>
                        {isPlaying ? <PauseRoundedIcon sx={{ fontSize: 20 }} /> : <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />}
                      </IconButton>
                      <Typography variant="caption" sx={{ color: '#fff', fontWeight: 500 }}>
                        {formatTime(currentTime)}
                      </Typography>
                    </Box>
                    <IconButton onClick={handleFullscreenToggle} sx={{ color: '#fff', p: 0.5 }}>
                      {isFullscreen ? <FullscreenExitIcon sx={{ fontSize: 20 }} /> : <FullscreenIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </Box>
                  {/* Progress bar */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 44,
                      left: 8,
                      right: 8,
                      height: 3,
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
                      }}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    component="img"
                    src={currentVideo.thumbnail}
                    alt={currentVideo.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {/* Play Button Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.2)',
                      cursor: hasRealVideo ? 'pointer' : 'default',
                    }}
                    onClick={hasRealVideo ? handleStartVideo : undefined}
                  >
                    <IconButton
                      onClick={hasRealVideo ? handleStartVideo : undefined}
                      sx={{
                        background: 'rgba(255,255,255,0.98)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        width: 56,
                        height: 56,
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: '#fff',
                          transform: 'translateY(-3px) scale(1.08)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                        },
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: 32, color: '#007AFF' }} />
                    </IconButton>
                  </Box>
                </>
              )}
              {/* Style Badge */}
              <Chip
                label={currentVideo.style}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  zIndex: 5,
                }}
              />
            </Box>
          </Box>

          {/* Video Info */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                color: '#1D1D1F',
                mb: 2,
              }}
            >
              {currentVideo.title}
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                fontSize: '1rem',
                color: '#86868B',
                mb: 3,
              }}
            >
              {currentVideo.description}
            </Typography>

            {/* Full Description */}
            <Typography
              sx={{
                fontSize: '0.95rem',
                color: '#1D1D1F',
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              {currentVideo.fullDescription}
            </Typography>

            {/* Details Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 4 }}>
              {/* Genre */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <MusicNoteIcon sx={{ fontSize: 18, color: '#007AFF' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#86868B', textTransform: 'uppercase' }}>Genre</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>{currentVideo.genre}</Typography>
              </Box>

              {/* Style */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(0,122,255,0.3)',
                    boxShadow: '0 8px 24px rgba(0,122,255,0.1)',
                  },
                }}
                onClick={() => navigate(`/styles/${currentVideo.styleId}`)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <PaletteIcon sx={{ fontSize: 18, color: '#007AFF' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#86868B', textTransform: 'uppercase' }}>Style</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>{currentVideo.style}</Typography>
              </Box>

              {/* Duration */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 18, color: '#007AFF' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#86868B', textTransform: 'uppercase' }}>Duration</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>{currentVideo.duration}</Typography>
              </Box>

              {/* BPM */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <SpeedIcon sx={{ fontSize: 18, color: '#007AFF' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#86868B', textTransform: 'uppercase' }}>BPM</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>{currentVideo.bpm}</Typography>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: "center" }}>
              <Button
                variant="contained"
                endIcon={<KeyboardArrowRightIcon sx={{ color: '#fff' }} />}
                onClick={() => navigate('/create?tab=video')}
                sx={{
                  background: '#007AFF',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 24px rgba(0,122,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: '#0066DD',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(0,122,255,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  },
                }}
              >
                Create Similar
              </Button>
            </Box>
          </Box>
        </Box>
        )}

        {/* More Videos Section */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1D1D1F',
              mb: 3,
              textAlign: 'center',
            }}
          >
            More Music Videos
          </Typography>
          {/* 
            Portrait: 160px width with 9:16 = 284px height
            Landscape: To match same height (284px) with 16:9 = 505px width
            Single row only with horizontal scroll if needed
          */}
          <Box sx={{ position: 'relative' }}>
            {/* Left fade gradient - only show when can scroll left */}
            {hasOverflow && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 40,
                  background: 'linear-gradient(to right, #fff 0%, transparent 100%)',
                  zIndex: 2,
                  pointerEvents: 'none',
                  opacity: canScrollLeft ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                }}
              />
            )}
            {/* Right fade gradient - only show when can scroll right */}
            {hasOverflow && (
              <Box
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 40,
                  background: 'linear-gradient(to left, #fff 0%, transparent 100%)',
                  zIndex: 2,
                  pointerEvents: 'none',
                  opacity: canScrollRight ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                }}
              />
            )}
            <Box 
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'nowrap', 
                alignItems: 'flex-start',
                overflowX: 'auto',
                px: 2, // Padding so content isn't cut off
                pb: 1, // Space for scrollbar
                // Hide scrollbar by default, show on hover
                scrollbarWidth: 'thin',
                scrollbarColor: 'transparent transparent',
                '&:hover': {
                  scrollbarColor: 'rgba(0,0,0,0.2) transparent',
                },
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { 
                  background: 'transparent', 
                  borderRadius: 3,
                  transition: 'background 0.2s ease',
                },
                '&:hover::-webkit-scrollbar-thumb': { 
                  background: 'rgba(0,0,0,0.2)',
                },
                '&::-webkit-scrollbar-thumb:hover': { 
                  background: 'rgba(0,0,0,0.3)',
                },
              }}>
            {musicVideoData.filter(v => v.id !== videoId).slice(0, 4).map((video) => {
              // Portrait dimensions
              const portraitWidth = { xs: 140, sm: 160 };
              // Height of portrait = width * (16/9)
              const portraitHeight = { xs: portraitWidth.xs * (16/9), sm: portraitWidth.sm * (16/9) };
              // Landscape width to match portrait height = height * (16/9)
              const landscapeWidth = { xs: portraitHeight.xs * (16/9), sm: portraitHeight.sm * (16/9) };
              
              return (
              <Box
                key={video.id}
                onClick={() => navigate(`/videos/${video.id}`)}
                sx={{
                  width: video.aspectRatio === 'landscape' 
                    ? { xs: `${landscapeWidth.xs}px`, sm: `${landscapeWidth.sm}px` } 
                    : { xs: `${portraitWidth.xs}px`, sm: `${portraitWidth.sm}px` },
                  height: { xs: `${portraitHeight.xs}px`, sm: `${portraitHeight.sm}px` },
                  flexShrink: 0,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%',
                  height: '100%',
                  borderRadius: '16px', 
                  overflow: 'hidden' 
                }}>
                  <Box
                    component="img"
                    src={video.thumbnail}
                    alt={video.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconButton
                      sx={{
                        background: 'rgba(255,255,255,0.98)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        width: 44,
                        height: 44,
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          background: '#fff',
                          transform: 'translateY(-2px) scale(1.05)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                        },
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: 24, color: '#007AFF' }} />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1.5,
                      pt: 4,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {video.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>
                      {video.style}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              );
            })}
            </Box>
          </Box>
          
          {/* Navigation Arrows - only show when there's overflow */}
          {hasOverflow && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <IconButton
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                sx={{
                  width: 44,
                  height: 44,
                  background: canScrollLeft ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.02)',
                  border: '1px solid',
                  borderColor: canScrollLeft ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.04)',
                  color: canScrollLeft ? '#1D1D1F' : 'rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: canScrollLeft ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              >
                <ChevronLeftRoundedIcon />
              </IconButton>
              <IconButton
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                sx={{
                  width: 44,
                  height: 44,
                  background: canScrollRight ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.02)',
                  border: '1px solid',
                  borderColor: canScrollRight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.04)',
                  color: canScrollRight ? '#1D1D1F' : 'rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: canScrollRight ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              >
                <ChevronRightRoundedIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            mt: 8,
            textAlign: 'center',
            p: 5,
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
            Create Your Own Music Video
          </Typography>
          <Typography sx={{ color: '#86868B', mb: 3, fontSize: '1.1rem' }}>
            Turn your song into a stunning AI-generated music video in any style.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,1))',
              backdropFilter: 'blur(20px)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '16px',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              '&:hover': {
                background: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              },
            }}
          >
            Get Started Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MusicVideoDetailPage;

