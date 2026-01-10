import React, { useState, useCallback } from 'react';
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAuth } from '../hooks/useAuth';
import { SEO } from '../utils/seoHelper';
import { MarketingHeader, CTASection } from '../components/marketing';

// Blog categories
const categories = [
  { id: 'all', name: 'All Posts' },
  { id: 'ai-music', name: 'AI Music' },
  { id: 'social-media', name: 'Social Media' },
  { id: 'tutorials', name: 'Tutorials' },
  { id: 'news', name: 'News' },
];

// Sample blog posts
const blogPosts = [
  {
    id: '1',
    title: 'How to Create Viral TikTok Music with AI',
    excerpt: 'Learn the secrets to creating catchy, trending music that can help your TikTok content go viral. From beats to hooks, we cover everything.',
    category: 'ai-music',
    image: '/genres/pop.jpeg',
    author: 'Gruvi Team',
    date: 'Jan 8, 2026',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: '2',
    title: '10 Tips for Growing Your Music Audience on Social Media',
    excerpt: 'Building an audience takes time and strategy. Here are proven tactics to grow your following across YouTube, TikTok, and Instagram.',
    category: 'social-media',
    image: '/genres/electronic.jpeg',
    author: 'Sarah Chen',
    date: 'Jan 5, 2026',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: '3',
    title: 'Understanding Copyright-Free Music for Content Creators',
    excerpt: 'Navigate the complex world of music licensing and learn why AI-generated music is changing the game for creators.',
    category: 'tutorials',
    image: '/genres/cinematic.jpeg',
    author: 'Michael Torres',
    date: 'Jan 3, 2026',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: '4',
    title: 'The Future of AI Music: 2026 Predictions',
    excerpt: 'What does the future hold for AI-generated music? We explore emerging trends and technologies shaping the industry.',
    category: 'news',
    image: '/genres/techno.jpeg',
    author: 'Gruvi Team',
    date: 'Jan 1, 2026',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: '5',
    title: 'How to Choose the Perfect Genre for Your Content',
    excerpt: 'Different types of content call for different music styles. Learn how to match genres to your videos for maximum impact.',
    category: 'tutorials',
    image: '/genres/jazz.jpeg',
    author: 'Emma Wilson',
    date: 'Dec 28, 2025',
    readTime: '4 min read',
    featured: false,
  },
  {
    id: '6',
    title: 'Case Study: How One Creator Got 1M Views with AI Music',
    excerpt: 'An in-depth look at how content creator @MusicMaster leveraged Gruvi to create viral content and grow their channel.',
    category: 'social-media',
    image: '/genres/hip-hop.jpeg',
    author: 'David Park',
    date: 'Dec 25, 2025',
    readTime: '10 min read',
    featured: false,
  },
  {
    id: '7',
    title: 'Creating Emotional Soundtracks with AI',
    excerpt: 'Music sets the mood for your content. Discover how to use AI to create emotional, impactful soundtracks for any video.',
    category: 'ai-music',
    image: '/genres/orchestral.jpeg',
    author: 'Gruvi Team',
    date: 'Dec 22, 2025',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: '8',
    title: 'Gruvi 2.0: New Features and Improvements',
    excerpt: 'Announcing our biggest update yet! Check out all the new features, improved AI models, and exciting additions to Gruvi.',
    category: 'news',
    image: '/genres/dance.jpeg',
    author: 'Gruvi Team',
    date: 'Dec 20, 2025',
    readTime: '5 min read',
    featured: false,
  },
];

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;
  const { login, signup, googleLogin, getGoogleIdToken, resendVerificationEmail, error: authError } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('all');

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

  // Filter posts by category
  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
        navigate('/my-music');
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
          navigate('/my-music');
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
        title="Blog | AI Music Tips, Tutorials & News | Gruvi"
        description="Stay up to date with the latest in AI music generation, social media tips, tutorials, and news from the Gruvi team."
        keywords="AI music blog, music creation tips, social media marketing, content creator tutorials, Gruvi news"
        ogTitle="Gruvi Blog | AI Music & Content Creation"
        ogDescription="Tips, tutorials, and news about AI music generation and content creation."
        ogType="website"
        ogUrl="https://gruvimusic.com/blog"
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 20 },
          pb: { xs: 6, md: 10 },
          background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 100%)',
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
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '0%',
          right: '10%',
          width: '35%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(78, 205, 196, 0.08) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '700px', mx: 'auto' }}>
            <Chip
              label="Gruvi Blog"
              size="small"
              sx={{
                mb: 3,
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#8B5CF6',
                fontWeight: 600,
                fontSize: '0.8rem',
                height: 32,
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
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Tips, Tutorials &{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Insights
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.7,
              }}
            >
              Learn how to create better music, grow your audience, and make the most of AI-powered content creation.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Category Filter */}
      <Box sx={{
        py: 3,
        background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => setSelectedCategory(category.id)}
                sx={{
                  background: selectedCategory === category.id
                    ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                    : 'rgba(255,255,255,0.08)',
                  color: selectedCategory === category.id ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  px: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: selectedCategory === category.id
                      ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                      : 'rgba(255,255,255,0.12)',
                  },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <Box sx={{
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(180deg, #16213E 0%, #1A1A2E 100%)',
        }}>
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 4,
              }}
            >
              Featured Articles
            </Typography>
            <Grid container spacing={3}>
              {featuredPosts.map((post, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={post.id}>
                  <Box
                    sx={{
                      borderRadius: '24px',
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      animation: `fadeInUp 0.5s ease ${index * 100}ms forwards`,
                      opacity: 0,
                      '@keyframes fadeInUp': {
                        from: { opacity: 0, transform: 'translateY(20px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        background: 'rgba(255,255,255,0.05)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        '& img': { transform: 'scale(1.05)' },
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                      <Box
                        component="img"
                        src={post.image}
                        alt={post.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                        }}
                      />
                      <Chip
                        label="Featured"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          color: '#000',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                    <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Chip
                        label={categories.find(c => c.id === post.category)?.name || post.category}
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          mb: 2,
                          background: 'rgba(139, 92, 246, 0.15)',
                          color: '#8B5CF6',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', mb: 1.5 }}>
                        {post.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, mb: 2, flex: 1 }}>
                        {post.excerpt}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                          {post.author}
                        </Typography>
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                          {post.date}
                        </Typography>
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                            {post.readTime}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* All Posts */}
      <Box sx={{
        py: { xs: 6, md: 10 },
        background: 'linear-gradient(180deg, #1A1A2E 0%, #0D0D0F 100%)',
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 700,
              color: '#fff',
              mb: 4,
            }}
          >
            {selectedCategory === 'all' ? 'All Articles' : `${categories.find(c => c.id === selectedCategory)?.name} Articles`}
          </Typography>
          <Grid container spacing={3}>
            {regularPosts.map((post, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                <Box
                  sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: `fadeIn 0.4s ease ${index * 60}ms forwards`,
                    opacity: 0,
                    '@keyframes fadeIn': { to: { opacity: 1 } },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                      '& img': { transform: 'scale(1.05)' },
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={post.image}
                      alt={post.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Chip
                      label={categories.find(c => c.id === post.category)?.name || post.category}
                      size="small"
                      sx={{
                        alignSelf: 'flex-start',
                        mb: 1.5,
                        background: 'rgba(139, 92, 246, 0.15)',
                        color: '#8B5CF6',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 22,
                      }}
                    />
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', mb: 1, lineHeight: 1.3 }}>
                      {post.title}
                    </Typography>
                    <Typography sx={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      mb: 2,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                        {post.date}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                          {post.readTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <CTASection
        title="Ready to Create Your First Track?"
        subtitle="Join thousands of creators making music with AI."
        primaryButtonText="Get Started Free"
        primaryButtonAction={() => isLoggedIn ? navigate('/create/music') : handleOpenAuth()}
        variant="dark"
      />

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
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
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

export default BlogPage;
