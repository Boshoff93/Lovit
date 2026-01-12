import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import {
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PaletteIcon from '@mui/icons-material/Palette';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useNavigate, useParams } from 'react-router-dom';
import { SEO, createBreadcrumbStructuredData, createVideoStructuredData } from '../utils/seoHelper';
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
    id: 'walk-right-in',
    title: 'Walk Right In',
    style: 'Cinematic',
    styleId: 'photo-realism',
    genre: 'Blues',
    views: '892',
    duration: '1:36',
    bpm: 85,
    thumbnail: '/thumbnails/chanel.jpeg',
    aspectRatio: 'portrait' as const,
    realVideoId: 'b19d1ce4-6650-40dc-afdb-c3d12800ffac',
    tag: 'Coco Chanel',
    isPromo: true,
    description: 'A smoky blues journey through dim-lit bars and whiskey glasses',
    fullDescription: 'Walk Right In captures the essence of classic blues with cinematic realism. Step into a smoky room where every eye turns as you pass, experience the silence falling like velvet rain, and feel the magnetism of a woman who steals the night with just one breath.',
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
    tag: 'Dragon Ball',
    isPromo: false, // Fan tribute, not brand promo
    description: 'Epic Dragon Ball inspired anime adventure',
    fullDescription: 'Experience the legendary Dragon Ball theme song brought to life with stunning anime visuals. Watch as warriors power up, battle across epic landscapes, and push beyond their limits in this high-energy tribute to the iconic series.',
  },
  {
    id: 'beneath-the-surface',
    title: 'Beneath the Surface',
    style: 'Cinematic',
    styleId: 'photo-realism',
    genre: 'Hip Hop',
    views: '1.8K',
    duration: '1:21',
    bpm: 95,
    thumbnail: '/thumbnails/rolex.jpeg',
    aspectRatio: 'portrait' as const,
    realVideoId: 'ef807231-faab-4a97-a51b-08f574fbae52',
    tag: 'Rolex',
    isPromo: true,
    description: 'Luxury Rolex Submariner showcased in stunning underwater cinematography',
    fullDescription: 'Beneath the Surface is a cinematic tribute to the iconic Rolex Submariner. Watch as the legendary dive watch descends through turquoise waters, surrounded by bioluminescent sea life, volcanic rock, and twilight reflections. Every frame captures the timeless elegance and engineering mastery of this horological icon.',
  },
  {
    id: 'glide',
    title: 'Glide',
    style: 'Cinematic',
    styleId: 'photo-realism',
    genre: 'Hip Hop',
    views: '1.5K',
    duration: '1:21',
    bpm: 100,
    thumbnail: '/thumbnails/tesla.jpeg',
    aspectRatio: 'landscape' as const,
    realVideoId: 'dc6c22f4-22e5-433d-aa38-5792bc653185',
    tag: 'Tesla',
    isPromo: true,
    description: 'Tesla gliding through misty mountain roads at golden hour',
    fullDescription: 'Glide captures the silent power and elegance of electric driving. A sleek Tesla navigates winding mountain roads through morning mist, surrounded by lush forests and golden sunlight. The cinematic visuals perfectly complement the smooth hip-hop beats, celebrating the harmony between cutting-edge technology and natural beauty.',
  },
  {
    id: "gotta-catch-'em-all",
    title: "Gotta Catch 'Em All",
    style: 'Cinematic',
    styleId: '3d-cartoon',
    genre: 'Pop',
    views: '1.1K',
    duration: '1:04',
    bpm: 130,
    thumbnail: '/thumbnails/pokeball.jpeg',
    aspectRatio: 'portrait' as const,
    realVideoId: '134e4aed-1b25-4d0b-a41a-73a683f76225',
    tag: 'Pokeball',
    isPromo: true,
    description: 'An energetic Pokémon-inspired adventure with iconic Pokeball action',
    fullDescription: "Gotta Catch 'Em All brings the thrill of Pokémon battles to life with stunning 3D animation. Watch as trainers throw Pokeballs through vibrant worlds, capturing creatures and embarking on epic adventures. The catchy pop beats drive the action forward in this nostalgic tribute to the beloved franchise.",
  },
  {
    id: 'frinton-sunrise',
    title: 'Frinton Sunrise',
    style: 'Cinematic',
    styleId: 'photo-realism',
    genre: 'Indie',
    views: '892',
    duration: '1:04',
    bpm: 78,
    thumbnail: '/thumbnails/frinton.jpeg',
    aspectRatio: 'landscape' as const,
    realVideoId: '4d42bf20-328b-4d80-b319-8ff8d9867036',
    tag: 'Airbnb',
    isPromo: true,
    description: 'A peaceful coastal morning at Frinton by the Sea holiday rental',
    fullDescription: 'Frinton Sunrise captures the serene beauty of waking up at a stunning coastal holiday property. Golden morning light washes over the elegant architecture as the ocean breeze carries the promise of a perfect day. This cinematic promo showcases the dreamy escape that awaits at Frinton by the Sea.',
  },
  {
    id: 'set-sail-to-glory',
    title: 'Set Sail to Glory',
    style: 'Anime',
    styleId: 'anime',
    genre: 'Rock',
    views: '2.1K',
    duration: '3:06',
    bpm: 140,
    thumbnail: '/thumbnails/one-piece.jpeg',
    aspectRatio: 'landscape' as const,
    realVideoId: '4221ddeb-136c-4968-a46f-7585635827f1',
    tag: 'One Piece',
    isPromo: false, // Fan tribute, not brand promo
    description: 'An epic One Piece inspired adventure on the high seas',
    fullDescription: 'Set Sail to Glory captures the spirit of adventure with stunning anime visuals inspired by One Piece. Watch as the Straw Hat crew embarks on an epic journey across vast oceans, facing challenges with unwavering determination. The powerful rock soundtrack drives the action as dreams of becoming the Pirate King come to life.',
  },
  {
    id: 'labubu-gang',
    title: 'Labubu Gang',
    style: 'Cinematic',
    styleId: 'photo-realism',
    genre: 'Hip Hop',
    views: '1.0K',
    duration: '0:33',
    bpm: 95,
    thumbnail: '/thumbnails/labubu.jpeg',
    aspectRatio: 'portrait' as const,
    realVideoId: '9a3a7f9d-3f03-44a7-8ea5-ae306c4172e5',
    tag: 'Labubu',
    isPromo: true,
    description: 'A cute Labubu plush keychain charm in an adorable promo video',
    fullDescription: 'Labubu Gang celebrates the adorable Labubu plush keychain with hip-hop swagger. Watch as the little monster charm swings and sparkles, bringing all the dreams and the cutest flex you can\'t deny. This triumphant promo captures the charm of the beloved collectible in stunning cinematic style.',
  },
  {
    id: 'kiss-me-slow',
    title: 'Kiss Me Slow',
    style: 'Cinematic',
    styleId: 'photo-realism',
    genre: 'Blues',
    views: '1.1K',
    duration: '0:54',
    bpm: 75,
    thumbnail: '/thumbnails/kiss.jpeg',
    aspectRatio: 'portrait' as const,
    realVideoId: '18061fda-525d-4aba-a6b9-cbd41b1748c5',
    tag: 'MAC Lipstick',
    isPromo: true,
    description: 'A seductive lipstick promo with romantic blues vibes',
    fullDescription: 'Kiss Me Slow captures the allure of red lipstick with sultry blues music. These lips got secrets, and one taste of this magic will have you falling under the spell. The cinematic visuals showcase the bold color and intimate moments, leaving lipstick traces everywhere.',
  },
  {
    id: 'under-the-open-sky',
    title: 'Under the Open Sky',
    style: 'Cinematic',
    styleId: 'photo-realism',
    genre: 'Indie',
    views: '1.3K',
    duration: '0:59',
    bpm: 90,
    thumbnail: '/thumbnails/tent.jpeg',
    aspectRatio: 'portrait' as const,
    realVideoId: '5405e955-ec86-453e-ae75-ae666a0f693c',
    tag: 'North Face',
    isPromo: true,
    description: 'Epic camping adventure with The North Face gear under starry skies',
    fullDescription: 'Under the Open Sky is a cinematic camping promo for The North Face. Chase the mountains, chase the light, and come alive under the open sky with fire in your heart and stars in your eyes. The stunning visuals showcase premium camping gear amidst breathtaking mountain landscapes.',
  },
  {
    id: 'powder-dreams',
    title: 'Powder Dreams',
    style: 'Cinematic',
    styleId: 'photo-realism',
    genre: 'Cinematic',
    views: '1.8K',
    duration: '0:50',
    bpm: 85,
    thumbnail: '/thumbnails/skiis.jpeg',
    aspectRatio: 'portrait' as const,
    realVideoId: '564c0a00-5064-4713-a6d5-b191f2ab751f',
    tag: 'Rossignol Skis',
    isPromo: true,
    description: 'Dreamy ski promo featuring Rossignol skis against endless white powder',
    fullDescription: 'Powder Dreams captures the magic of skiing with stunning Rossignol equipment. White horizon calls my name as mountains rise like ancient kings. Snow beneath me, I have wings - falling through the powder dreams where nothing is ever what it seems. Experience the freedom of endless white.',
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

// Video Carousel Component with scroll arrows
interface VideoCarouselProps {
  videos: typeof musicVideoData;
  isLandscape: boolean;
  onVideoClick: (videoId: string) => void;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos, isLandscape, onVideoClick }) => {
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);
  const [maskImage, setMaskImage] = React.useState('linear-gradient(to right, black 0%, black 95%, transparent 100%)');
  const carouselContainerRef = React.useRef<HTMLDivElement>(null);

  const checkScrollPosition = React.useCallback(() => {
    const container = carouselContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const atStart = scrollLeft <= 10;
    const atEnd = scrollLeft >= scrollWidth - clientWidth - 10;

    setShowLeftArrow(!atStart);
    setShowRightArrow(!atEnd);

    // Update mask based on scroll position
    if (atStart) {
      setMaskImage('linear-gradient(to right, black 0%, black 95%, transparent 100%)');
    } else if (atEnd) {
      setMaskImage('linear-gradient(to right, transparent 0%, black 5%, black 100%)');
    } else {
      setMaskImage('linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)');
    }
  }, []);

  React.useEffect(() => {
    const container = carouselContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);
    setTimeout(checkScrollPosition, 100);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  const scroll = (direction: 'left' | 'right') => {
    const container = carouselContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Portrait dimensions
  const portraitWidth = { xs: 140, sm: 160 };
  const portraitHeight = { xs: portraitWidth.xs * (16/9), sm: portraitWidth.sm * (16/9) };
  // Landscape dimensions
  const landscapeHeight = { xs: 140, sm: 160 };
  const landscapeWidth = { xs: landscapeHeight.xs * (16/9), sm: landscapeHeight.sm * (16/9) };

  return (
    <Box sx={{ position: 'relative', overflow: 'visible' }}>
      {/* Left arrow */}
      {showLeftArrow && (
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(249, 115, 22, 0.4) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(249, 115, 22, 0.5)',
            width: 40,
            height: 40,
            animation: 'pulseOutOrange 2.5s ease-out infinite',
            '@keyframes pulseOutOrange': {
              '0%': {
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(249, 115, 22, 0.5)',
              },
              '100%': {
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 0 12px rgba(249, 115, 22, 0)',
              },
            },
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(249, 115, 22, 0.5) 100%)',
              transform: 'translateY(-50%) scale(1.05)',
              animation: 'none',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
            },
          }}
        >
          <ChevronLeftIcon sx={{ color: '#FFFFFF' }} />
        </IconButton>
      )}

      {/* Right arrow */}
      {showRightArrow && (
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(249, 115, 22, 0.4) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(249, 115, 22, 0.5)',
            width: 40,
            height: 40,
            animation: 'pulseOutOrange 2.5s ease-out infinite',
            '@keyframes pulseOutOrange': {
              '0%': {
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 0 0 rgba(249, 115, 22, 0.5)',
              },
              '100%': {
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3), 0 0 0 12px rgba(249, 115, 22, 0)',
              },
            },
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(249, 115, 22, 0.5) 100%)',
              transform: 'translateY(-50%) scale(1.05)',
              animation: 'none',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.4)',
            },
          }}
        >
          <ChevronRightIcon sx={{ color: '#FFFFFF' }} />
        </IconButton>
      )}

      <Box
        ref={carouselContainerRef}
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
          overflowX: 'auto',
          overflowY: 'visible',
          px: 4,
          pt: 1,
          pb: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {videos.map((video) => (
          <Box
            key={video.id}
            onClick={() => onVideoClick(video.id)}
            sx={{
              width: isLandscape
                ? { xs: `${landscapeWidth.xs}px`, sm: `${landscapeWidth.sm}px` }
                : { xs: `${portraitWidth.xs}px`, sm: `${portraitWidth.sm}px` },
              height: isLandscape
                ? { xs: `${landscapeHeight.xs}px`, sm: `${landscapeHeight.sm}px` }
                : { xs: `${portraitHeight.xs}px`, sm: `${portraitHeight.sm}px` },
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
              {/* Tag */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
                  {(video as any).tag || video.style}
                </Typography>
              </Box>
              {/* Title overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  p: 1.5,
                }}
              >
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                  {video.title}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const MusicVideoDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { videoId } = useParams<{ videoId: string }>();

  const { currentSong } = useAudioPlayer();
  
  // Video player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
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
      const apiBase = 'https://api.gruvimusic.com';
      const response = await fetch(`${apiBase}/api/public/videos/${currentVideo.realVideoId}`);
      
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

  // Create video structured data for real videos (helps with Google video search)
  const videoStructuredData = currentVideo.realVideoId ? createVideoStructuredData({
    name: currentVideo.title,
    description: currentVideo.fullDescription,
    thumbnailUrl: currentVideo.thumbnail.startsWith('http') 
      ? currentVideo.thumbnail 
      : `https://gruvimusic.com${currentVideo.thumbnail}`,
    uploadDate: '2024-12-01', // Approximate upload date for demo videos
    duration: `PT${currentVideo.duration.replace(':', 'M')}S`, // ISO 8601 duration format
    url: `https://gruvimusic.com/videos/${currentVideo.id}`,
  }) : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0D0D0F 0%, #14110E 50%, #1A1008 100%)',
        position: 'relative',
        pb: currentSong ? { xs: 10, sm: 12, md: 14 } : 0,
        transition: 'padding-bottom 0.3s ease-out',
      }}
    >
      <SEO
        title={currentVideo.tag
          ? `${currentVideo.title} - ${currentVideo.tag} Promo Video | Gruvi AI Video Generator`
          : `${currentVideo.title} - ${currentVideo.style} Music Video | Gruvi AI Video Generator`}
        description={currentVideo.tag
          ? `${currentVideo.fullDescription} Create stunning AI-powered promotional videos for your brand like ${currentVideo.tag}. Perfect for products, Airbnb listings, and e-commerce.`
          : `${currentVideo.fullDescription} Created with Gruvi's AI music video generator. Turn your songs into stunning ${currentVideo.style.toLowerCase()} visuals.`}
        keywords={currentVideo.tag
          ? `${currentVideo.title.toLowerCase()}, ${currentVideo.tag.toLowerCase()} promo video, AI promotional video, brand video generator, product video maker, ${currentVideo.style.toLowerCase()} video, Gruvi AI, Airbnb video, e-commerce promo`
          : `${currentVideo.title.toLowerCase()}, ${currentVideo.style.toLowerCase()} music video, ${currentVideo.genre.toLowerCase()} music, AI music video, Gruvi, music video generator, ${currentVideo.genre.toLowerCase()} visuals`}
        ogTitle={currentVideo.tag
          ? `${currentVideo.title} - ${currentVideo.tag} Promo Video | Gruvi`
          : `${currentVideo.title} - ${currentVideo.style} Music Video | Gruvi`}
        ogDescription={currentVideo.tag
          ? `${currentVideo.description} Create AI-powered promo videos for your brand.`
          : currentVideo.description}
        ogType="video.other"
        ogUrl={`https://gruvimusic.com/videos/${currentVideo.id}`}
        twitterTitle={`${currentVideo.title} | ${currentVideo.tag || currentVideo.style} | Gruvi`}
        twitterDescription={currentVideo.tag
          ? `${currentVideo.description} AI-powered brand videos.`
          : currentVideo.description}
        structuredData={[
          createBreadcrumbStructuredData(breadcrumbData),
          ...(videoStructuredData ? [videoStructuredData] : []),
        ]}
      />

      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 4,
            color: '#F97316 !important',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(249, 115, 22, 0.1)',
              color: '#FB923C !important',
            },
            '& .MuiSvgIcon-root': {
              color: '#F97316 !important',
            }
          }}
        >
          Back
        </Button>

        {/* Main Content */}
        {/* Different layout for landscape vs portrait videos */}
        {currentVideo.aspectRatio === 'landscape' ? (
          // Landscape layout - video on top, info below
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Video Player - Full width for landscape */}
            <Box 
              ref={containerRef}
              sx={{ 
                width: '100%',
                // Fullscreen styles
                ...(isFullscreen && {
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#000',
                }),
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  borderRadius: isFullscreen ? 0 : '20px',
                  overflow: 'hidden',
                  boxShadow: isFullscreen ? 'none' : '0 16px 48px rgba(0,0,0,0.12)',
                  background: '#000',
                  // In fullscreen, fill width and let height be auto
                  ...(isFullscreen && {
                    width: '100vw',
                    height: 'auto',
                    maxHeight: '100vh',
                  }),
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
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = currentVideo.aspectRatio === 'landscape' ? '/gruvi/octopus-landscape-wait.jpeg' : '/gruvi/octopus-portrait-wait.jpeg';
                        }}
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
                    {/* Play/Pause overlay when paused (not during loading) */}
                    {!isPlaying && !isBuffering && !videoLoading && (
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
                          <PlayArrowRoundedIcon sx={{ fontSize: 40, color: '#F97316' }} />
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
                          background: 'linear-gradient(90deg, #F97316, #EF4444)',
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
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = currentVideo.aspectRatio === 'landscape' ? '/gruvi/octopus-landscape-wait.jpeg' : '/gruvi/octopus-portrait-wait.jpeg';
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
                        <PlayArrowRoundedIcon sx={{ fontSize: 40, color: '#F97316' }} />
                      </IconButton>
                    </Box>
                  </>
                )}
                {/* Tag Badge - brand tag or style */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '100px',
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                    zIndex: 5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#1D1D1F',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {currentVideo.tag || currentVideo.style}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Info Section for Landscape */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: '#fff',
                  mb: 1,
                  fontFamily: '"Fredoka", "Nunito", sans-serif',
                }}
              >
                {currentVideo.title}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', mb: 3 }}>
                {currentVideo.description}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, mb: 4 }}>
                {currentVideo.fullDescription}
              </Typography>

              {/* Stats Grid */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <MusicNoteIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Genre</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#fff' }}>{currentVideo.genre}</Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <PaletteIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Style</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#fff' }}>{currentVideo.style}</Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Duration</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#fff' }}>{currentVideo.duration}</Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <SpeedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.5 }}>BPM</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#fff' }}>{currentVideo.bpm}</Typography>
                </Box>
              </Box>

              {/* Action Button */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: "center" }}>
                <Button
                  variant="contained"
                  endIcon={<KeyboardArrowRightIcon />}
                  onClick={() => navigate('/create?tab=video')}
                  sx={{
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%) !important',
                    backgroundColor: 'transparent !important',
                    color: '#fff !important',
                    fontWeight: 600,
                    borderRadius: '12px',
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    boxShadow: '0 8px 24px rgba(249, 115, 22, 0.35)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%) !important',
                      backgroundColor: 'transparent !important',
                      color: '#fff !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(249, 115, 22, 0.45)',
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
            sx={{ 
              flex: isFullscreen ? 'none' : { xs: 'none', md: '0 0 280px' }, 
              maxWidth: isFullscreen ? '100%' : { xs: '240px', sm: '260px', md: '280px' }, 
              mx: isFullscreen ? 0 : { xs: 'auto', md: 0 },
              // Fullscreen styles
              ...(isFullscreen && {
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
              }),
            }}
          >
            <Box
              sx={{
                position: 'relative',
                aspectRatio: '9/16',
                borderRadius: isFullscreen ? 0 : '20px',
                overflow: 'hidden',
                boxShadow: isFullscreen ? 'none' : '0 16px 48px rgba(0,0,0,0.12)',
                background: '#000',
                // In fullscreen, fill height and let width be auto
                ...(isFullscreen && {
                  height: '100vh',
                  width: 'auto',
                }),
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
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        // This is inside portrait layout, so always use portrait fallback
                        e.currentTarget.src = '/gruvi/octopus-portrait-wait.jpeg';
                      }}
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
                  {/* Play/Pause overlay when paused (not during loading) */}
                  {!isPlaying && !isBuffering && !videoLoading && (
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
                        <PlayArrowRoundedIcon sx={{ fontSize: 32, color: '#F97316' }} />
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
                        background: 'linear-gradient(90deg, #F97316, #EF4444)',
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
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      // This is inside portrait layout, so always use portrait fallback
                      e.currentTarget.src = '/gruvi/octopus-portrait-wait.jpeg';
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
                      <PlayArrowRoundedIcon sx={{ fontSize: 32, color: '#F97316' }} />
                    </IconButton>
                  </Box>
                </>
              )}
              {/* Tag Badge - brand tag or style */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '100px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                  zIndex: 5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#1D1D1F',
                    letterSpacing: '0.02em',
                  }}
                >
                  {currentVideo.tag || currentVideo.style}
                </Typography>
              </Box>
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
                color: '#fff',
                mb: 2,
              }}
            >
              {currentVideo.title}
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.6)',
                mb: 3,
              }}
            >
              {currentVideo.description}
            </Typography>

            {/* Full Description */}
            <Typography
              sx={{
                fontSize: '0.95rem',
                color: 'rgba(255,255,255,0.85)',
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
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <MusicNoteIcon sx={{ fontSize: 18, color: '#F97316' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Genre</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#fff' }}>{currentVideo.genre}</Typography>
              </Box>

              {/* Style */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(249, 115, 22, 0.3)',
                    background: 'rgba(255,255,255,0.08)',
                  },
                }}
                onClick={() => navigate(`/styles/${currentVideo.styleId}`)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <PaletteIcon sx={{ fontSize: 18, color: '#F97316' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Style</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#fff' }}>{currentVideo.style}</Typography>
              </Box>

              {/* Duration */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 18, color: '#F97316' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Duration</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#fff' }}>{currentVideo.duration}</Typography>
              </Box>

              {/* BPM */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <SpeedIcon sx={{ fontSize: 18, color: '#F97316' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>BPM</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#fff' }}>{currentVideo.bpm}</Typography>
              </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: "center" }}>
              <Button
                variant="contained"
                endIcon={<KeyboardArrowRightIcon sx={{ color: '#fff' }} />}
                onClick={() => navigate('/create?tab=video')}
                sx={{
                  background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%) !important',
                  backgroundColor: 'transparent !important',
                  color: '#fff !important',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 8px 24px rgba(249, 115, 22, 0.35)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%) !important',
                    backgroundColor: 'transparent !important',
                    color: '#fff !important',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(249, 115, 22, 0.45) !important',
                  },
                }}
              >
                Create Similar
              </Button>
            </Box>
          </Box>
        </Box>
        )}

        {/* More Videos Section - Same type and aspect ratio */}
        {(() => {
          // Check if current video is a promo (isPromo: true) or music video
          const isPromoVideo = !!(currentVideo as any).isPromo;
          const currentAspectRatio = currentVideo.aspectRatio;

          // Filter videos by same type (promo vs music) and same aspect ratio
          const sameTypeVideos = musicVideoData.filter(v =>
            v.id !== videoId &&
            v.aspectRatio === currentAspectRatio &&
            (isPromoVideo ? !!(v as any).isPromo : !(v as any).isPromo) &&
            !!v.realVideoId // Only show real videos
          ).slice(0, 8);

          const sectionTitle = isPromoVideo ? 'More Promo Videos' : 'More Music Videos';
          const sectionSubtext = isPromoVideo
            ? 'Explore more AI-generated promotional videos for products, brands, and businesses'
            : 'Discover more AI-generated music videos in stunning visual styles';

          const isLandscape = currentAspectRatio === 'landscape';

          if (sameTypeVideos.length === 0) return null;
          
          return (
            <Box sx={{ mt: 8 }}>
              {/* Section header - left aligned */}
              <Box sx={{ mb: 3, px: 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#fff',
                    mb: 0.5,
                  }}
                >
                  {sectionTitle}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.5,
                  }}
                >
                  {sectionSubtext}
                </Typography>
              </Box>

              {/* Use VideoCarousel component */}
              <VideoCarousel
                videos={sameTypeVideos}
                isLandscape={isLandscape}
                onVideoClick={(id) => navigate(`/videos/${id}`)}
              />
            </Box>
          );
        })()}

        {/* CTA Section */}
        <Box
          sx={{
            mt: 8,
            textAlign: 'center',
            p: 5,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
            Create Your Own Music Video
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, fontSize: '1.1rem' }}>
            Turn your song into a stunning AI-generated music video in any style.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/create?tab=video')}
            sx={{
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%) !important',
              backgroundColor: 'transparent !important',
              color: '#fff !important',
              fontWeight: 600,
              borderRadius: '12px',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(249, 115, 22, 0.35)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%) !important',
                backgroundColor: 'transparent !important',
                color: '#fff !important',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(249, 115, 22, 0.45)',
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

