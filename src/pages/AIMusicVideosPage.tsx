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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import GoogleIcon from '@mui/icons-material/Google';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAuth } from '../hooks/useAuth';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { MarketingHeader, CTASection } from '../components/marketing';

interface VideoItem {
  id: string;
  title: string;
  style: string;
  thumbnail: string;
  videoUrl?: string;
  tag?: string;
  aspectRatio: 'portrait' | 'landscape';
}

// Music videos data
const musicVideos: VideoItem[] = [
  {
    id: 'da4d792d-a24b-45d8-87ba-5b41778496e8',
    title: 'Polaroid Summer',
    style: '3D Cartoon',
    thumbnail: '/thumbnails/duck.jpeg',
    aspectRatio: 'portrait',
    videoUrl: 'https://gruvimusic.com/video/da4d792d-a24b-45d8-87ba-5b41778496e8',
    tag: '3D Cartoon',
  },
  {
    id: '4a7ec232-aca9-4538-bc79-45149d705812',
    title: 'Cha-La Head-Cha-La',
    style: 'Anime',
    thumbnail: '/thumbnails/goku.jpeg',
    aspectRatio: 'landscape',
    videoUrl: 'https://gruvimusic.com/video/4a7ec232-aca9-4538-bc79-45149d705812',
    tag: 'Dragon Ball',
  },
  {
    id: '4221ddeb-136c-4968-a46f-7585635827f1',
    title: 'Set Sail to Glory',
    style: 'Anime',
    thumbnail: '/thumbnails/one-piece.jpeg',
    aspectRatio: 'landscape',
    videoUrl: 'https://gruvimusic.com/video/4221ddeb-136c-4968-a46f-7585635827f1',
    tag: 'One Piece',
  },
];

// Art styles for showcase
const artStyles = [
  { id: '3d-cartoon', label: '3D Cartoon', image: '/art_styles/boy_cartoon.jpeg' },
  { id: 'claymation', label: 'Claymation', image: '/art_styles/boy_claymation.jpeg' },
  { id: 'childrens-storybook', label: "Children's Book", image: '/art_styles/boy_storybook.jpeg' },
  { id: 'photo-realism', label: 'Realistic', image: '/art_styles/boy_real.jpeg' },
  { id: 'comic-book', label: 'Comic Book', image: '/art_styles/boy_comic.jpeg' },
  { id: 'anime', label: 'Animation', image: '/art_styles/boy_anime.jpeg' },
  { id: 'watercolor', label: 'Watercolor', image: '/art_styles/boy_watercolor.jpeg' },
  { id: 'pixel', label: '2D Game', image: '/art_styles/boy_pixel.jpeg' },
];

// Video Card with hover to play
const VideoCard: React.FC<{
  video: VideoItem;
  onClick?: () => void;
  index: number;
}> = ({ video, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isLandscape = video.aspectRatio === 'landscape';

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (video.videoUrl) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowVideo(true);
      }, 300);
    }
  }, [video.videoUrl]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.05)',
        cursor: 'pointer',
        animation: `fadeInUp 0.5s ease ${index * 100}ms forwards`,
        opacity: 0,
        '@keyframes fadeInUp': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        boxShadow: isHovered
          ? '0 24px 60px rgba(139, 92, 246, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
        },
      }}
    >
      {/* Video/Thumbnail Container */}
      <Box
        sx={{
          position: 'relative',
          aspectRatio: isLandscape ? '16/9' : '9/16',
          overflow: 'hidden',
        }}
      >
        {/* Thumbnail Image */}
        <Box
          component="img"
          src={video.thumbnail}
          alt={video.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: showVideo ? 0 : 1,
            transition: 'opacity 0.3s ease, transform 0.4s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Video - only visible on hover */}
        {video.videoUrl && (
          <Box
            component="video"
            ref={videoRef}
            src={video.videoUrl}
            autoPlay={showVideo}
            muted
            loop
            playsInline
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: showVideo ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Tag */}
        {video.tag && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: '100px',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
              {video.tag}
            </Typography>
          </Box>
        )}

        {/* Play button */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: showVideo ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              transform: isHovered && !showVideo ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.25s ease',
            }}
          >
            <PlayArrowRoundedIcon sx={{ fontSize: 28, color: '#8B5CF6', ml: 0.25 }} />
          </Box>
        </Box>

        {/* Gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Card Footer */}
      <Box sx={{ p: 2.5, background: 'rgba(0,0,0,0.4)' }}>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#fff',
            mb: 0.5,
          }}
        >
          {video.title}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
          {video.style}
        </Typography>
      </Box>
    </Box>
  );
};

const AIMusicVideosPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;
  const { login, signup, googleLogin, getGoogleIdToken, resendVerificationEmail, error: authError } = useAuth();

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

  // Auth handlers
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
        navigate('/my-videos');
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
          navigate('/my-videos');
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
        title="AI Music Video Generator | Create Stunning Videos | Gruvi"
        description="Create AI-generated music videos with custom characters and art styles. Anime, 3D Cartoon, Realistic, and more. Turn your songs into visual masterpieces."
        keywords="AI music video generator, AI video creator, anime music video, 3D cartoon video, music video maker, AI video generator"
        ogTitle="AI Music Video Generator | Gruvi"
        ogDescription="Create stunning AI-generated music videos with custom characters and art styles."
        ogType="website"
        ogUrl="https://gruvimusic.com/ai-music-videos"
        structuredData={[createBreadcrumbStructuredData([
          { name: 'Home', url: 'https://gruvimusic.com' },
          { name: 'AI Music Videos', url: 'https://gruvimusic.com/ai-music-videos' }
        ])]}
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 18 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 50%, #2D1B4E 100%)',
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
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '35%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
            <Chip
              label="AI Music Videos"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#A78BFA',
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
              Create Stunning{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Music Videos
              </Box>
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
              Turn your songs into visual masterpieces. Choose from 16+ art styles including Anime,
              3D Cartoon, Realistic, and more. Create cinematic music videos in minutes.
            </Typography>
            <Button
              variant="contained"
              onClick={() => isLoggedIn ? navigate('/create/video') : handleOpenAuth()}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: '#fff',
                px: 5,
                py: 2,
                borderRadius: '100px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
                },
              }}
            >
              Create Your Video
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Videos */}
      <Box sx={{ background: '#0D0D0F', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              color: '#fff',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Featured Music Videos
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.6)',
              mb: 5,
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            All videos created with AI in minutes.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: { xs: 3, md: 4 },
              maxWidth: '1000px',
              mx: 'auto',
            }}
          >
            {musicVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                onClick={() => navigate(`/videos/${video.title.toLowerCase().replace(/\s+/g, '-')}`)}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Art Styles Section */}
      <Box sx={{
        background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 100%)',
        py: { xs: 8, md: 12 },
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="16+ Art Styles"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#F472B6',
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
              Choose Your Visual Style
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              From anime to photorealism, create videos that match your artistic vision.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {artStyles.map((style, index) => (
              <Box
                key={style.id}
                sx={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  animation: `fadeIn 0.4s ease ${index * 50}ms forwards`,
                  opacity: 0,
                  '@keyframes fadeIn': {
                    to: { opacity: 1 },
                  },
                  '&:hover': {
                    transform: 'scale(1.05)',
                    '& img': { transform: 'scale(1.1)' },
                  },
                  transition: 'transform 0.3s ease',
                }}
                onClick={() => isLoggedIn ? navigate('/create/video') : handleOpenAuth()}
              >
                <Box
                  component="img"
                  src={style.image}
                  alt={style.label}
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                  }}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                    {style.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <CTASection
        title="Ready to Create Your Music Video?"
        subtitle="Turn your music into stunning visual experiences with AI."
        primaryButtonText="Start Creating"
        primaryButtonAction={() => isLoggedIn ? navigate('/create/video') : handleOpenAuth()}
        variant="dark"
      />

      {/* Auth Modal - Same as AIMusicPage */}
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
              '& .Mui-selected': { color: '#8B5CF6' },
              '& .MuiTabs-indicator': { backgroundColor: '#8B5CF6' },
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
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
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

export default AIMusicVideosPage;
