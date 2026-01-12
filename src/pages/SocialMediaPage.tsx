import React, { useState, useCallback } from 'react';
import Lottie from 'react-lottie';
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
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import GoogleIcon from '@mui/icons-material/Google';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAuth } from '../hooks/useAuth';
import { useInView } from '../hooks/useInView';
import { useTabHeaders } from '../hooks/useTabHeaders';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { MarketingHeader } from '../components/marketing';
import socialsAnimationData from '../assets/animations/socials.json';
import cloudAnimationData from '../assets/animations/cloud.json';

// Green-themed Section Divider for green zone sections
const SectionDivider: React.FC = () => (
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
        background: 'linear-gradient(90deg, transparent 0%, transparent 15%, rgba(34,197,94,0.2) 35%, rgba(34,197,94,0.25) 50%, rgba(34,197,94,0.2) 65%, transparent 85%, transparent 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-2px',
          left: '30%',
          right: '30%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.05) 30%, rgba(34,197,94,0.08) 50%, rgba(34,197,94,0.05) 70%, transparent 100%)',
          filter: 'blur(2px)',
        },
      }}
    />
  </Box>
);

// Purple-themed Section Divider for purple zone sections
const PurpleSectionDivider: React.FC = () => (
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
        background: 'linear-gradient(90deg, transparent 0%, transparent 15%, rgba(139,92,246,0.2) 35%, rgba(139,92,246,0.25) 50%, rgba(139,92,246,0.2) 65%, transparent 85%, transparent 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-2px',
          left: '30%',
          right: '30%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.05) 30%, rgba(139,92,246,0.08) 50%, rgba(139,92,246,0.05) 70%, transparent 100%)',
          filter: 'blur(2px)',
        },
      }}
    />
  </Box>
);

// TikTok icon
const TikTokIcon: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 24, height: 24, ...sx }}>
    <path
      fill="currentColor"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
    />
  </Box>
);

// X/Twitter icon
const XIcon: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box component="svg" viewBox="0 0 24 24" sx={{ width: 24, height: 24, ...sx }}>
    <path
      fill="currentColor"
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    />
  </Box>
);

const platforms = [
  { id: 'youtube', name: 'YouTube', icon: YouTubeIcon, color: '#FF0000', desc: 'Reach billions of viewers' },
  { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, color: '#000000', desc: 'Go viral with trending sounds' },
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: '#E4405F', desc: 'Engage your visual audience', gradient: true },
  { id: 'facebook', name: 'Facebook', icon: FacebookIcon, color: '#1877F2', desc: 'Connect with communities' },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon, color: '#0A66C2', desc: 'Build your professional brand' },
  { id: 'x', name: 'X (Twitter)', icon: XIcon, color: '#000000', desc: 'Join the conversation' },
];

const SocialMediaPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;
  const { login, signup, googleLogin, getGoogleIdToken, resendVerificationEmail, error: authError } = useAuth();

  // Dynamic headers based on route
  const headers = useTabHeaders();

  // Scroll-triggered animation refs
  const { ref: platformsRef, inView: platformsInView } = useInView({ threshold: 0.1 });
  const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.1 });
  const { ref: reachRef, inView: reachInView } = useInView({ threshold: 0.1 });
  const { ref: benefitsRef, inView: benefitsInView } = useInView({ threshold: 0.1 });

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
        navigate('/settings/connected-accounts');
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
          navigate('/settings/connected-accounts');
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
    <Box sx={{ minHeight: '100vh', background: '#0D0D0F', overflow: 'hidden' }}>
      <SEO
        title="Social Media Publishing | Share Music to All Platforms | Gruvi"
        description="Publish your AI-generated music and videos to YouTube, TikTok, Instagram, Facebook, LinkedIn, and X. One-click sharing with smart scheduling."
        keywords="social media publishing, music sharing, YouTube shorts, TikTok music, Instagram reels, social media scheduler"
        ogTitle="Social Media Publishing | Gruvi"
        ogDescription="Publish AI music and videos to all social platforms with one click."
        ogType="website"
        ogUrl="https://gruvimusic.com/social-media"
        structuredData={[createBreadcrumbStructuredData([
          { name: 'Home', url: 'https://gruvimusic.com' },
          { name: 'Social Media Publishing', url: 'https://gruvimusic.com/social-media' }
        ])]}
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 20 },
          pb: { xs: 10, md: 16 },
          background: 'linear-gradient(180deg, #0D0D0F 0%, #0F1A14 60%, #142620 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orbs */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '45%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '0%',
          right: '10%',
          width: '40%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label={headers.badge}
                size="small"
                sx={{
                  mb: 3,
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#22C55E',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  height: 32,
                  borderRadius: '12px',
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.75rem', sm: '3.5rem', md: '4.25rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 3,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                }}
              >
                {headers.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: '540px',
                }}
              >
                {headers.subtitle}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => isLoggedIn ? navigate('/settings/connected-accounts') : handleOpenAuth()}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%) !important',
                    color: '#fff',
                    px: 4,
                    py: 1.75,
                    borderRadius: '12px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(34, 197, 94, 0.5)',
                    },
                  }}
                >
                  Connect Your Accounts
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 420,
                  }}
                >
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: socialsAnimationData,
                      rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                      }
                    }}
                    isClickToPauseDisabled={true}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
        <SectionDivider />
      </Box>

      {/* Platforms Grid */}
      <Box
        ref={platformsRef}
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #142620 0%, #0F1A14 50%, #0D1210 100%)',
          position: 'relative',
        }}
      >
    
        <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 800,
                color: '#fff',
                mb: 2,
              }}
            >
              Supported Platforms
            </Typography>
            <Typography sx={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '550px', mx: 'auto' }}>
              Connect all your social accounts and publish content everywhere with a single click.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {platforms.map((platform, index) => {
              const IconComponent = platform.icon;
              const isBlackIcon = platform.id === 'tiktok' || platform.id === 'x';
              return (
                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={platform.id}>
                  <Box
                    onClick={() => navigate(`/platforms/${platform.id}`)}
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      // Start at opacity 0, animate to visible when inView
                      opacity: 0,
                      transform: 'translateY(20px)',
                      ...(platformsInView && {
                        animation: `fadeInUp 0.4s ease ${index * 60}ms forwards`,
                      }),
                      '@keyframes fadeInUp': {
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: isBlackIcon ? '0 16px 40px rgba(255,255,255,0.15)' : `0 16px 40px ${platform.color}20`,
                        borderColor: isBlackIcon ? 'rgba(255,255,255,0.25)' : `${platform.color}40`,
                        background: isBlackIcon ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '16px',
                        background: platform.gradient
                          ? 'linear-gradient(135deg, #FFDC80, #F77737, #E1306C, #C13584, #833AB4)'
                          : platform.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <IconComponent sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                      {platform.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                      {platform.desc}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <SectionDivider />
      </Box>

      {/* One-Click Distribution Section */}
      <Box
        ref={featuresRef}
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #0D1210 0%, #0D0D12 50%, #12101A 100%)',
          position: 'relative',
        }}
      >
  
        <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 400,
                  mx: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 350,
                }}
              >
                {/* Iridescent shimmering dots floating around */}
                {[
                  { x: -120, y: -80, size: 8, delay: 0 },
                  { x: 130, y: -60, size: 6, delay: 0.5 },
                  { x: -100, y: 60, size: 10, delay: 1 },
                  { x: 140, y: 40, size: 7, delay: 1.5 },
                  { x: -60, y: -120, size: 5, delay: 2 },
                  { x: 80, y: 100, size: 9, delay: 2.5 },
                  { x: -140, y: 0, size: 6, delay: 0.3 },
                  { x: 100, y: -100, size: 8, delay: 0.8 },
                  { x: 0, y: 130, size: 5, delay: 1.3 },
                  { x: -80, y: 110, size: 7, delay: 1.8 },
                  { x: 60, y: -130, size: 6, delay: 2.2 },
                  { x: -30, y: -100, size: 4, delay: 0.7 },
                ].map((dot, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: dot.size,
                      height: dot.size,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg,
                        ${['#22C55E', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'][index % 6]} 0%,
                        ${['#3B82F6', '#8B5CF6', '#EC4899', '#22C55E', '#10B981', '#3B82F6'][index % 6]} 100%)`,
                      boxShadow: `0 0 ${dot.size * 2}px ${['#22C55E', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'][index % 6]}90`,
                      zIndex: 0,
                      animation: `shimmerFloat${index} 4s ease-in-out ${dot.delay}s infinite`,
                      [`@keyframes shimmerFloat${index}`]: {
                        '0%, 100%': {
                          opacity: 0.4,
                          transform: `translate(calc(-50% + ${dot.x}px), calc(-50% + ${dot.y}px)) scale(0.8)`,
                        },
                        '50%': {
                          opacity: 1,
                          transform: `translate(calc(-50% + ${dot.x + (index % 2 === 0 ? 15 : -15)}px), calc(-50% + ${dot.y + (index % 3 === 0 ? -20 : 20)}px)) scale(1.2)`,
                        },
                      },
                    }}
                  />
                ))}

                {/* Main image with subtle bob animation */}
                <Box
                  component="img"
                  src="/landing/littlefriend.png"
                  alt="Social Media Distribution"
                  sx={{
                    width: '100%',
                    maxWidth: 320,
                    height: 'auto',
                    filter: 'drop-shadow(0 20px 40px rgba(34, 197, 94, 0.25))',
                    position: 'relative',
                    zIndex: 2,
                    animation: 'gentleBob 3s ease-in-out infinite',
                    '@keyframes gentleBob': {
                      '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
                      '50%': { transform: 'translateY(-10px) rotate(2deg)' },
                    },
                  }}
                />

                {/* Iridescent glow effect behind character */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, rgba(34, 197, 94, 0.12), rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.12), rgba(236, 72, 153, 0.12), rgba(34, 197, 94, 0.12))',
                    filter: 'blur(50px)',
                    zIndex: 0,
                    animation: 'iridescentSpin 8s linear infinite',
                    '@keyframes iridescentSpin': {
                      '0%': { transform: 'rotate(0deg) scale(1)' },
                      '50%': { transform: 'rotate(180deg) scale(1.1)' },
                      '100%': { transform: 'rotate(360deg) scale(1)' },
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="One-Click Distribution"
                size="small"
                sx={{ mb: 2, background: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 3,
                }}
              >
                No More{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Manual Posting
                </Box>
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', lineHeight: 1.7, mb: 4 }}>
                Say goodbye to logging into each platform separately. Create your content once, then blast it everywhere instantly. Gruvi handles the formatting for each platform automatically.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  { icon: TouchAppIcon, title: 'One-Click Publish', desc: 'Post to all connected platforms simultaneously', color: '#22C55E' },
                  { icon: ScheduleIcon, title: 'Smart Scheduling', desc: 'Schedule posts for optimal engagement times', color: '#8B5CF6' },
                  { icon: AutoAwesomeIcon, title: 'Auto-Formatting', desc: 'Content automatically optimized for each platform', color: '#FF6B9D' },
                ].map((feature, index) => (
                  <Box
                    key={feature.title}
                    sx={{
                      display: 'flex',
                      gap: 3,
                      p: 3,
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'background 0.3s ease, border-color 0.3s ease',
                      // Start at opacity 0, animate to visible when inView
                      opacity: 0,
                      transform: 'translateX(30px)',
                      ...(featuresInView && {
                        animation: `slideIn 0.5s ease ${index * 100}ms forwards`,
                      }),
                      '@keyframes slideIn': {
                        to: { opacity: 1, transform: 'translateX(0)' },
                      },
                      '&:hover': {
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: `${feature.color}40`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '14px',
                        background: `${feature.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <feature.icon sx={{ color: feature.color, fontSize: 26 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', mb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        {feature.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
        <PurpleSectionDivider />
      </Box>

      {/* Upload Your Content Section */}
      <Box
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #12101A 0%, #1A142E 60%, #1A142E 100%)',
          position: 'relative',
        }}
      >
  
        <Box sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '30%',
          height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 4, md: 6 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Content Upload"
                size="small"
                sx={{ mb: 2, background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 3,
                }}
              >
                Upload Your Own{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Music & Videos
                </Box>
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', lineHeight: 1.7, mb: 4 }}>
                Already have content? Upload your existing music and videos directly to Gruvi. We'll help you create engaging social media posts and distribute them to all your connected platforms.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {[
                  'Upload MP3, WAV, MP4, MOV, and more',
                  'AI generates captions and hashtags',
                  'Create video content from audio files',
                  'Distribute to all platforms instantly',
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#A78BFA', fontSize: 22 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                onClick={() => isLoggedIn ? navigate('/upload') : handleOpenAuth()}
                startIcon={<CloudUploadIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%) !important',
                  color: '#fff',
                  px: 4,
                  py: 1.75,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%) !important',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
                  },
                }}
              >
                Upload Content
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 350,
                  mx: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 25px 50px rgba(139, 92, 246, 0.3))',
                }}
              >
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: cloudAnimationData,
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid slice'
                    }
                  }}
                  height={300}
                  width={300}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
        <PurpleSectionDivider />
      </Box>

      {/* Multi-Platform Reach Section */}
      <Box
        ref={reachRef}
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #1A142E 0%, #18142A 50%, #14101E 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  <Box sx={{ flex: 1, p: 3, borderRadius: '16px', background: 'rgba(139, 92, 246, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 1 }}>Platforms</Typography>
                    <Typography sx={{ color: '#A78BFA', fontSize: '2rem', fontWeight: 800 }}>6+</Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 3, borderRadius: '16px', background: 'rgba(168, 85, 247, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 1 }}>One Click</Typography>
                    <Typography sx={{ color: '#A855F7', fontSize: '2rem', fontWeight: 800 }}>Publish</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1, p: 3, borderRadius: '16px', background: 'rgba(236, 72, 153, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 1 }}>AI Content</Typography>
                    <Typography sx={{ color: '#EC4899', fontSize: '2rem', fontWeight: 800 }}>100%</Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 3, borderRadius: '16px', background: 'rgba(192, 132, 252, 0.1)' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 1 }}>Copyright</Typography>
                    <Typography sx={{ color: '#C084FC', fontSize: '2rem', fontWeight: 800 }}>Free</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Multi-Platform Reach"
                size="small"
                sx={{ mb: 2, background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 3,
                }}
              >
                Grow Your{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #C084FC 0%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Audience
                </Box>
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', lineHeight: 1.7, mb: 4 }}>
                Expand your reach by publishing to all major platforms simultaneously. Build your presence on YouTube, TikTok, Instagram, and more from one place.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { icon: AnalyticsIcon, text: 'Publish to 6+ platforms at once', color: '#A78BFA' },
                  { icon: TrendingUpIcon, text: 'Maximize your content reach', color: '#8B5CF6' },
                  { icon: AutoAwesomeIcon, text: 'AI-optimized for each platform', color: '#FF6B9D' },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <item.icon sx={{ color: item.color, fontSize: 24 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{item.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
        <PurpleSectionDivider />
      </Box>

      {/* Benefits List + CTA - single seamless gradient section */}
      <Box
        ref={benefitsRef}
        sx={{
          pt: { xs: 4, md: 6 },
          pb: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #14101E 0%, #100D18 40%, #0D0D0F 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative purple glow elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '-10%',
            width: '40%',
            height: '150%',
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '35%',
            height: '120%',
            background: 'radial-gradient(ellipse at center, rgba(167, 139, 250, 0.06) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="md" sx={{ pt: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 800, color: '#fff', mb: 2 }}
            >
              Why Use Gruvi for Publishing?
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              '100% original AI content - no copyright strikes',
              'One-click publishing to multiple platforms',
              'AI-generated captions and hashtags',
              'Optimal posting times for each platform',
              'Build your audience everywhere',
              'Commercial license included',
            ].map((benefit, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 3,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  // Start at opacity 0, animate to visible when inView
                  opacity: 0,
                  transform: 'translateX(30px)',
                  ...(benefitsInView && {
                    animation: `slideIn 0.4s ease ${index * 80}ms forwards`,
                  }),
                  '@keyframes slideIn': {
                    to: { opacity: 1, transform: 'translateX(0)' },
                  },
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                  },
                }}
              >
                <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 26 }} />
                <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '1.05rem' }}>{benefit}</Typography>
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
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Ready to Go Viral?
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
              Connect your accounts and start publishing AI content today.
            </Typography>
            <Button
              variant="contained"
              onClick={() => isLoggedIn ? navigate('/settings/connected-accounts') : handleOpenAuth()}
              sx={{
                background: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%) !important',
                color: '#fff',
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 1.75 },
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.5)',
                },
              }}
            >
              Get Started Free
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
              '& .Mui-selected': { color: '#22C55E' },
              '& .MuiTabs-indicator': { backgroundColor: '#22C55E' },
            }}
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && (
            <Typography sx={{ color: '#22C55E', fontSize: '0.85rem', mb: 2, textAlign: 'center' }}>
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
                  startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
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
                startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
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
                startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
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
                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>,
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
                background: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
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
                '&:hover': { borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)' },
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

export default SocialMediaPage;
