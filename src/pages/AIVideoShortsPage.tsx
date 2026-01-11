import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import GoogleIcon from '@mui/icons-material/Google';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import DiamondIcon from '@mui/icons-material/Diamond';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FlightIcon from '@mui/icons-material/Flight';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAuth } from '../hooks/useAuth';
import { useInView } from '../hooks/useInView';
import { SEO } from '../utils/seoHelper';
import { MarketingHeader, VideoShowcase, CTASection } from '../components/marketing';

interface VideoItem {
  id: string;
  title: string;
  style: string;
  thumbnail: string;
  videoUrl?: string;
  tag?: string;
}

// Promo/UGC videos for showcase
const promoVideos: VideoItem[] = [
  {
    id: '564c0a00-5064-4713-a6d5-b191f2ab751f',
    title: 'Powder Dreams',
    style: 'Cinematic',
    thumbnail: '/thumbnails/skiis.jpeg',
    tag: 'Rossignol Skis',
  },
  {
    id: 'b19d1ce4-6650-40dc-afdb-c3d12800ffac',
    title: 'Walk Right In',
    style: 'Cinematic',
    thumbnail: '/thumbnails/chanel.jpeg',
    tag: 'Coco Chanel',
  },
  {
    id: 'ef807231-faab-4a97-a51b-08f574fbae52',
    title: 'Beneath the Surface',
    style: 'Cinematic',
    thumbnail: '/thumbnails/rolex.jpeg',
    tag: 'Rolex',
  },
];

// Additional portrait videos for grid
const moreVideos: VideoItem[] = [
  {
    id: '134e4aed-1b25-4d0b-a41a-73a683f76225',
    title: "Gotta Catch 'Em All",
    style: 'Cinematic',
    thumbnail: '/thumbnails/pokeball.jpeg',
    tag: 'Pokeball',
  },
  {
    id: '9a3a7f9d-3f03-44a7-8ea5-ae306c4172e5',
    title: 'Labubu Gang',
    style: 'Cinematic',
    thumbnail: '/thumbnails/labubu.jpeg',
    tag: 'Labubu',
  },
  {
    id: '18061fda-525d-4aba-a6b9-cbd41b1748c5',
    title: 'Kiss Me Slow',
    style: 'Cinematic',
    thumbnail: '/thumbnails/kiss.jpeg',
    tag: 'MAC Lipstick',
  },
  {
    id: '5405e955-ec86-453e-ae75-ae666a0f693c',
    title: 'Under the Open Sky',
    style: 'Cinematic',
    thumbnail: '/thumbnails/tent.jpeg',
    tag: 'North Face',
  },
];

// Landscape/cinematic videos for separate section
const landscapeVideos: VideoItem[] = [
  {
    id: 'dc6c22f4-22e5-433d-aa38-5792bc653185',
    title: 'Glide',
    style: 'Cinematic',
    thumbnail: '/thumbnails/tesla.jpeg',
    tag: 'Tesla',
  },
  {
    id: '4d42bf20-328b-4d80-b319-8ff8d9867036',
    title: 'Frinton Sunrise',
    style: 'Cinematic',
    thumbnail: '/thumbnails/frinton.jpeg',
    tag: 'Airbnb',
  },
];

// Music video for "Turn any song into a music video" section
const musicVideo: VideoItem = {
  id: '4a7ec232-aca9-4538-bc79-45149d705812',
  title: 'Cha-La Head-Cha-La',
  style: 'Anime',
  thumbnail: '/thumbnails/goku.jpeg',
  tag: 'Dragon Ball',
};

// TikTok icon
const TikTokIcon: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 24, height: 24, ...sx }}>
    <path
      fill="currentColor"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
    />
  </Box>
);

// Video Card with hover to play - portrait style with overlay text like LandscapeVideoCard
const VideoCard: React.FC<{
  video: VideoItem;
  videoUrl?: string;
  onClick?: () => void;
  index: number;
  inView?: boolean;
}> = ({ video, videoUrl, onClick, index, inView = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        // Start at opacity 0, animate to visible when inView
        opacity: 0,
        transform: 'translateY(20px)',
        ...(inView && {
          animation: `fadeInUp 0.5s ease ${index * 80}ms forwards`,
        }),
        '@keyframes fadeInUp': {
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        boxShadow: isHovered
          ? '0 16px 40px rgba(0, 0, 0, 0.4)'
          : '0 8px 24px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Video/Thumbnail Container - 9:16 aspect ratio */}
      <Box sx={{ position: 'relative', aspectRatio: '9/16', overflow: 'hidden' }}>
        {/* Thumbnail - always visible when not playing */}
        <Box
          component="img"
          src={video.thumbnail}
          alt={video.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease, opacity 0.3s ease',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            opacity: isPlaying ? 0 : 1,
            zIndex: 1,
          }}
        />
        {/* Video - plays muted on hover */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              zIndex: 0,
            }}
          />
        )}

        {/* Gradient overlay for text */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Content overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 1.5,
            zIndex: 3,
          }}
        >
          {/* Top: Brand Tag */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {video.tag && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '100px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#fff' }}>
                  {video.tag}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Bottom: Title and Play Button */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {video.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {video.style}
              </Typography>
            </Box>

            {/* Play button */}
            <Box
              sx={{
                flexShrink: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                opacity: isPlaying ? 0.6 : 1,
                transform: isHovered && !isPlaying ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <PlayArrowRoundedIcon sx={{ fontSize: 16, color: '#F97316', ml: 0.25 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Landscape Video Card - smaller card for side-by-side layout
const LandscapeVideoCard: React.FC<{
  video: VideoItem;
  videoUrl?: string;
  onClick?: () => void;
  inView?: boolean;
}> = ({ video, videoUrl, onClick, inView = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: 0,
        transform: 'translateY(20px)',
        ...(inView && {
          animation: 'fadeInUp 0.5s ease forwards',
        }),
        '@keyframes fadeInUp': {
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        boxShadow: isHovered
          ? '0 16px 40px rgba(0, 0, 0, 0.4)'
          : '0 8px 24px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Video/Thumbnail Container - 16:9 aspect ratio */}
      <Box sx={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        {/* Thumbnail */}
        <Box
          component="img"
          src={video.thumbnail}
          alt={video.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease, opacity 0.3s ease',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            opacity: isPlaying ? 0 : 1,
            zIndex: 1,
          }}
        />
        {/* Video - plays muted on hover */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              zIndex: 0,
            }}
          />
        )}

        {/* Gradient overlay for text */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Content overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2,
            zIndex: 3,
          }}
        >
          {/* Top: Brand Tag */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {video.tag && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '100px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
                  {video.tag}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Bottom: Title and Play Button */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
            <Box>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}
              >
                {video.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {video.style}
              </Typography>
            </Box>

            {/* Play button */}
            <Box
              sx={{
                flexShrink: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                opacity: isPlaying ? 0.6 : 1,
                transform: isHovered && !isPlaying ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <PlayArrowRoundedIcon sx={{ fontSize: 18, color: '#F97316', ml: 0.25 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Orange-themed Section Divider for AI Video page - absolute positioned style
const SectionDivider: React.FC<{ color?: 'orange' | 'blue' }> = ({ color = 'orange' }) => {
  const isBlue = color === 'blue';
  const r = isBlue ? 99 : 249;
  const g = isBlue ? 102 : 115;
  const b = isBlue ? 241 : 22;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, transparent 15%, rgba(${r},${g},${b},0.2) 35%, rgba(${r},${g},${b},0.25) 50%, rgba(${r},${g},${b},0.2) 65%, transparent 85%, transparent 100%)`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: '30%',
            right: '30%',
            height: '4px',
            background: `linear-gradient(90deg, transparent 0%, rgba(${r},${g},${b},0.05) 30%, rgba(${r},${g},${b},0.08) 50%, rgba(${r},${g},${b},0.05) 70%, transparent 100%)`,
            filter: 'blur(2px)',
          },
        }}
      />
    </Box>
  );
};

const AIVideoShortsPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;
  const { login, signup, googleLogin, getGoogleIdToken, resendVerificationEmail, error: authError } = useAuth();

  // Scroll-triggered animation refs
  const { ref: moreVideosAnimRef, inView: moreVideosInView } = useInView({ threshold: 0.1 });
  const { ref: landscapeVideosRef, inView: landscapeVideosInView } = useInView({ threshold: 0.1 });
  const { ref: musicVideoRef, inView: musicVideoInView } = useInView({ threshold: 0.1 });
  const { ref: useCasesRef, inView: useCasesInView } = useInView({ threshold: 0.1 });

  // More Videos carousel ref
  const moreVideosRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});

  // Fetch all video URLs on mount
  useEffect(() => {
    const fetchVideoUrls = async () => {
      const apiBase = 'https://api.gruvimusic.com';
      const allVideos = [...promoVideos, ...moreVideos, ...landscapeVideos, musicVideo];
      const urls: Record<string, string> = {};

      await Promise.all(
        allVideos.map(async (video) => {
          try {
            const response = await fetch(`${apiBase}/api/public/videos/${video.id}`);
            if (response.ok) {
              const data = await response.json();
              urls[video.id] = data.videoUrl;
            }
          } catch (err) {
            console.error(`Error fetching video URL for ${video.id}:`, err);
          }
        })
      );

      setVideoUrls(urls);
    };

    fetchVideoUrls();
  }, []);

  // Check if carousel has overflow and track scroll position
  useEffect(() => {
    const container = moreVideosRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollWidth, clientWidth, scrollLeft } = container;
      const hasContentOverflow = scrollWidth > clientWidth + 10;
      setHasOverflow(hasContentOverflow);
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Scroll carousel left/right
  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    if (!moreVideosRef.current) return;
    const scrollAmount = 200;
    moreVideosRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  // Auth modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenAuth = useCallback(() => {
    setAuthOpen(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setError(null);
  }, []);

  const handleCloseAuth = useCallback(() => {
    setAuthOpen(false);
    setIsLoading(false);
    setIsGoogleLoading(false);
  }, []);

  const handleEmailLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password) {
        setError('Please enter your email and password');
        setIsLoading(false);
        return;
      }

      const result = await login(email, password);
      if (result.type === 'auth/login/fulfilled') {
        handleCloseAuth();
        navigate('/create/video');
      } else {
        setError(result.payload || 'Login failed');
      }
    } catch (err: any) {
      setError(authError || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, [login, email, password, authError, handleCloseAuth, navigate]);

  const handleEmailSignup = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password || !username) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be 8+ chars with uppercase, number, and special character');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const result = await signup(email, password, username);
      if (result.type.endsWith('/fulfilled')) {
        handleCloseAuth();
      } else {
        setError(result.payload || 'Signup failed');
      }
    } catch (err: any) {
      setError(authError || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  }, [signup, email, password, confirmPassword, username, authError, handleCloseAuth]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);

      const accessToken = await getGoogleIdToken();
      const result = await googleLogin(accessToken);

      if (result.type === 'auth/loginWithGoogle/fulfilled') {
        const userData = result.payload.user;
        if (!userData.isVerified) {
          await resendVerificationEmail(userData.email);
        } else {
          navigate('/create/video');
        }
        handleCloseAuth();
      } else {
        setError(result.payload || 'Google login failed');
      }
    } catch (err: any) {
      if (err.error === 'popup_closed_by_user') {
        setError('Google sign-in was cancelled');
      } else {
        setError(authError || 'Google sign-in failed');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }, [googleLogin, getGoogleIdToken, resendVerificationEmail, navigate, handleCloseAuth, authError]);

  return (
    <Box sx={{ minHeight: '100vh', background: '#0D0D0F' }}>
      <SEO
        title="AI Video Shorts | UGC Product Videos | Gruvi"
        description="Create AI-powered product videos and UGC content. Perfect for TikTok, Instagram Reels, and YouTube Shorts. Generate stunning promotional videos in minutes."
        keywords="AI video shorts, UGC video generator, product video maker, TikTok video AI, Instagram Reels AI, YouTube Shorts AI, promo video generator"
        ogTitle="AI Video Shorts | UGC Product Videos | Gruvi"
        ogDescription="Create AI-powered product videos and UGC content for social media."
        ogType="website"
        ogUrl="https://gruvimusic.com/ai-video-shorts"
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 18 },
          pb: { xs: 6, md: 6 },
          background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1210 30%, #201510 60%, #1A1008 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orbs */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '40%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '35%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Chip
              label="AI Video Shorts"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(249, 115, 22, 0.2)',
                color: '#FB923C',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 28,
                borderRadius: '100px',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 800,
                color: '#fff',
                mb: 3,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Create{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                UGC Videos
              </Box>
              {' '}with AI
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              Transform your products into engaging video content. AI avatars showcase your products 24/7
              with perfect delivery, multiple languages, and unlimited scalability.
            </Typography>

            {/* Platform Icons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
              {[
                { icon: <TikTokIcon />, name: 'TikTok', color: '#000' },
                { icon: <InstagramIcon />, name: 'Reels', color: '#E4405F' },
                { icon: <YouTubeIcon />, name: 'Shorts', color: '#FF0000' },
              ].map((platform) => (
                <Box
                  key={platform.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: '100px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <Box sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>{platform.icon}</Box>
                  <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>
                    {platform.name}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              onClick={() => isLoggedIn ? navigate('/create/video') : handleOpenAuth()}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%) !important',
                color: '#fff',
                px: 5,
                py: 2,
                borderRadius: '100px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
                },
              }}
            >
              Create Your Video
            </Button>
          </Box>
        </Container>
        <SectionDivider />
      </Box>

      {/* Featured Videos Showcase - wrapped with divider */}
      <Box sx={{ position: 'relative', background: '#140E0A' }}>
        <VideoShowcase
          videos={promoVideos}
          videoUrls={videoUrls}
          title={
            <>
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                AI-Powered
              </Box>
              {' '}Product Presentations
            </>
          }
          subtitle="Hover to preview. Create stunning product videos with AI avatars, custom music, and cinematic effects."
          badge="UGC Content"
          ctaText="Start Creating"
          ctaLink={isLoggedIn ? '/create/video' : undefined}
          onVideoClick={(video) => navigate(`/videos/${video.title.toLowerCase().replace(/\s+/g, '-')}`)}
          darkMode
          gradientBackground="linear-gradient(180deg, #1A1008 0%, #18100A 50%, #140E0A 100%)"
        />
        <SectionDivider />
      </Box>

      {/* More Videos Grid - with overlay title like VideoShowcase */}
      <Box ref={moreVideosAnimRef} sx={{
        background: 'linear-gradient(180deg, #140E0A 0%, #120C08 50%, #100A08 100%)',
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 10 },
        position: 'relative',
      }}>
        <Container maxWidth="lg">
          {/* Section Header with Badge */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Chip
              label="Portrait Videos"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(249, 115, 22, 0.2)',
                color: '#FB923C',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 28,
                borderRadius: '100px',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
              }}
            >
              Create{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                UGC Videos
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              From luxury brands to consumer products. AI creates engaging content for any industry.
            </Typography>
          </Box>

          {/* Carousel container with overlay arrows */}
          <Box sx={{ position: 'relative', mx: { xs: -2, xl: 0 } }}>
            {/* Left Arrow Overlay - only show on mobile when can scroll left */}
            {hasOverflow && canScrollLeft && !isMdUp && (
              <Box
                onClick={() => scrollCarousel('left')}
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '48px',
                  zIndex: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(to right, rgba(13,13,15,1) 0%, transparent 100%)',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'opacity 0.2s ease',
                  '&:active': {
                    opacity: 0.7,
                  },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 28 }} />
              </Box>
            )}

            {/* Right Arrow Overlay - only show on mobile when can scroll right */}
            {hasOverflow && canScrollRight && !isMdUp && (
              <Box
                onClick={() => scrollCarousel('right')}
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '48px',
                  zIndex: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(to left, rgba(13,13,15,1) 0%, transparent 100%)',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'opacity 0.2s ease',
                  '&:active': {
                    opacity: 0.7,
                  },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 28 }} />
              </Box>
            )}

            {/* Scrollable container - horizontal scroll on mobile, centered on desktop */}
            <Box
              ref={moreVideosRef}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'center' },
                flexWrap: 'nowrap',
                gap: { xs: 2, md: 3 },
                py: 2,
                px: { xs: 2, md: 0 },
                overflowX: { xs: 'auto', md: 'visible' },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                // Smooth scroll on mobile
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {moreVideos.map((video, index) => (
                <Box
                  key={video.id}
                  sx={{
                    // Fixed width cards - consistent widths, no shrinking
                    width: { xs: '140px', sm: '160px', md: '200px' },
                    flexShrink: 0,
                  }}
                >
                  <VideoCard
                    video={video}
                    videoUrl={videoUrls[video.id]}
                    index={index}
                    inView={moreVideosInView}
                    onClick={() => navigate(`/videos/${video.title.toLowerCase().replace(/\s+/g, '-')}`)}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
        <SectionDivider color="blue" />
      </Box>

      {/* Product Video Section - Side by side layout */}
      <Box ref={landscapeVideosRef} sx={{
        background: 'linear-gradient(180deg, #100A08 0%, #0E0A0A 50%, #0C0A0C 100%)',
        pt: { xs: 10, md: 12 },
        pb: { xs: 8, md: 10 },
      }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            {/* Text Content - always first on mobile for context */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Chip
                label="Promo Videos"
                size="small"
                sx={{
                  mb: 2,
                  width: 'fit-content',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#A78BFA',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  borderRadius: '100px',
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  fontWeight: 700,
                  color: '#fff',
                  mb: 2,
                }}
              >
                Create{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Product Promo Videos
                </Box>
              </Typography>
              <Typography
                sx={{
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.7)',
                  mb: 3,
                  lineHeight: 1.7,
                  display: { xs: 'block', md: 'block' },
                }}
              >
                Showcase your products with cinematic AI-generated videos perfect for ads and social media.
              </Typography>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.5 }}>
                {[
                  'Cinematic quality visually stunning videos',
                  'Perfect for YouTube ads & social media',
                  'AI handles editing, music & effects',
                ].map((point, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: '#A78BFA', fontSize: 20 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{point}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {/* Video Card */}
            <Box sx={{ flex: 1, width: '100%', maxWidth: { xs: '100%', md: '480px' } }}>
              <LandscapeVideoCard
                video={landscapeVideos[0]}
                videoUrl={videoUrls[landscapeVideos[0]?.id]}
                inView={landscapeVideosInView}
                onClick={() => navigate(`/videos/${landscapeVideos[0]?.title.toLowerCase().replace(/\s+/g, '-')}`)}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Airbnb/Property Video Section - Side by side layout (video on left on desktop) */}
      <Box sx={{
        background: 'linear-gradient(180deg, #0C0A0C 0%, #0C0A10 50%, #0C0C14 100%)',
        py: { xs: 6, md: 8 },
      }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            {/* Text Content - first on mobile, second on desktop */}
            <Box sx={{ flex: 1, order: { xs: 0, md: 1 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Chip
                label="Property Videos"
                size="small"
                sx={{
                  mb: 2,
                  width: 'fit-content',
                  background: 'rgba(78, 205, 196, 0.2)',
                  color: '#4ECDC4',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  borderRadius: '100px',
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  fontWeight: 700,
                  color: '#fff',
                  mb: 2,
                }}
              >
                Create{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #2AB5AB 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Airbnb Videos
                </Box>
              </Typography>
              <Typography
                sx={{
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.7)',
                  mb: 3,
                  lineHeight: 1.7,
                  display: { xs: 'block', md: 'block' },
                }}
              >
                Generate stunning property tours and vacation rental showcases that convert viewers into guests.
              </Typography>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.5 }}>
                {[
                  'Virtual property tours that sell',
                  'Perfect for Airbnb & real estate listings',
                  'Increase bookings & engagement',
                ].map((point, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: '#4ECDC4', fontSize: 20 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{point}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {/* Video Card - second on mobile, first on desktop */}
            <Box sx={{ flex: 1, width: '100%', maxWidth: { xs: '100%', md: '480px' }, order: { xs: 1, md: 0 } }}>
              <LandscapeVideoCard
                video={landscapeVideos[1]}
                videoUrl={videoUrls[landscapeVideos[1]?.id]}
                inView={landscapeVideosInView}
                onClick={() => navigate(`/videos/${landscapeVideos[1]?.title.toLowerCase().replace(/\s+/g, '-')}`)}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Music Video Section - Turn any song into a music video */}
      <Box ref={musicVideoRef} sx={{
        background: 'linear-gradient(180deg, #0C0C14 0%, #0D0D18 50%, #0E0E1C 100%)',
        pt: { xs: 6, md: 8 },
        pb: { xs: 10, md: 10 },
        position: 'relative',
      }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            {/* Text Content - first on mobile */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Chip
                label="Music Videos"
                size="small"
                sx={{
                  mb: 2,
                  width: 'fit-content',
                  background: 'rgba(251, 146, 60, 0.2)',
                  color: '#FB923C',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  borderRadius: '100px',
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  fontWeight: 700,
                  color: '#fff',
                  mb: 2,
                }}
              >
                Turn Any Song Into a{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Music Video
                </Box>
              </Typography>
              <Typography
                sx={{
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.7)',
                  mb: 3,
                  lineHeight: 1.7,
                  display: { xs: 'block', md: 'block' },
                }}
              >
                Upload your track or create AI-generated music, then watch as AI transforms it into a stunning visual experience in any style.
              </Typography>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.5 }}>
                {[
                  'Works with any song or audio',
                  'Multiple visual styles: Anime, Cinematic, Abstract',
                  'Perfect sync with beats and rhythm',
                ].map((point, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: '#FB923C', fontSize: 20 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{point}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {/* Video Card - second on mobile */}
            <Box sx={{ flex: 1, width: '100%', maxWidth: { xs: '100%', md: '480px' } }}>
              <LandscapeVideoCard
                video={musicVideo}
                videoUrl={videoUrls[musicVideo.id]}
                inView={musicVideoInView}
                onClick={() => navigate('/videos/cha-la-head-cha-la')}
              />
            </Box>
          </Box>
        </Container>
        <SectionDivider color="blue" />
      </Box>

      {/* Use Cases Section with embedded CTA - continues from Cinematic Videos to dark */}
      <Box
        ref={useCasesRef}
        sx={{
          background: 'linear-gradient(180deg, #0E0E1C 0%, #101020 30%, #0D0D0F 100%)',
          pt: { xs: 10, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Use Cases"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ADE80',
                fontWeight: 600,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
              }}
            >
              Perfect For Every Industry
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {[
              { title: 'E-commerce', desc: 'Product showcases, unboxings, and reviews', icon: <ShoppingCartIcon />, color: '#F97316' },
              { title: 'Real Estate', desc: 'Property tours and Airbnb listings', icon: <HomeWorkIcon />, color: '#4ECDC4' },
              { title: 'Fashion & Beauty', desc: 'Lookbooks and product demonstrations', icon: <DiamondIcon />, color: '#EC4899' },
              { title: 'Tech & Electronics', desc: 'Product reviews and feature highlights', icon: <PhoneIphoneIcon />, color: '#8B5CF6' },
              { title: 'Food & Beverage', desc: 'Recipe videos and brand promotions', icon: <RestaurantIcon />, color: '#EF4444' },
              { title: 'Travel & Hospitality', desc: 'Destination showcases and hotel tours', icon: <FlightIcon />, color: '#3B82F6' },
            ].map((useCase, index) => (
              <Box
                key={useCase.title}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  // Start at opacity 0, animate to visible when inView
                  opacity: 0,
                  ...(useCasesInView && {
                    animation: `fadeIn 0.4s ease ${index * 80}ms forwards`,
                  }),
                  '@keyframes fadeIn': { to: { opacity: 1 } },
                  transition: 'background 0.3s ease, transform 0.3s ease, border-color 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ fontSize: '2rem', mb: 1, color: useCase.color, '& .MuiSvgIcon-root': { fontSize: '2rem' } }}>{useCase.icon}</Box>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', mb: 0.5 }}>
                  {useCase.title}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                  {useCase.desc}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* CTA content - embedded in same section for seamless gradient */}
          <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 12 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                fontFamily: '"Fredoka", "Nunito", sans-serif',
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Ready to Create Viral Content?
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: 'rgba(255,255,255,0.8)',
                maxWidth: '500px',
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Join thousands of creators using AI to produce engaging video content.
            </Typography>
            <Button
              variant="contained"
              onClick={() => isLoggedIn ? navigate('/create/video') : handleOpenAuth()}
              sx={{
                background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%) !important',
                color: '#fff',
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 1.75 },
                borderRadius: '100px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(249, 115, 22, 0.5)',
                },
              }}
            >
              Start Creating Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Auth Modal */}
      <Dialog
        open={authOpen}
        onClose={handleCloseAuth}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: '#1D1D1F',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            {authTab === 0 ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <IconButton onClick={handleCloseAuth} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={authTab}
            onChange={(_, v) => { setAuthTab(v); setError(null); }}
            sx={{
              mb: 3,
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 600 },
              '& .Mui-selected': { color: '#F97316' },
              '& .MuiTabs-indicator': { backgroundColor: '#F97316' },
            }}
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && (
            <Typography sx={{ color: '#FF6B6B', fontSize: '0.85rem', mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {authTab === 1 && (
              <TextField
                fullWidth
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  },
                }}
              />
            )}
            <TextField
              fullWidth
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                },
              }}
            />
            <TextField
              fullWidth
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                },
              }}
            />
            {authTab === 1 && (
              <TextField
                fullWidth
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  },
                }}
              />
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={authTab === 0 ? handleEmailLogin : handleEmailSignup}
              disabled={isLoading}
              sx={{
                background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (authTab === 0 ? 'Log In' : 'Sign Up')}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
              <Box sx={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>or</Typography>
              <Box sx={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </Box>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              startIcon={isGoogleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AIVideoShortsPage;
