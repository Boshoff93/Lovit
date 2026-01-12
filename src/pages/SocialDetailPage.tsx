import React, { useMemo, useEffect } from 'react';
import {
  Typography,
  Box,
  Container,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

// Social platform data with detailed information
export const socialPlatformData = [
  { 
    id: 'youtube', 
    name: 'YouTube', 
    color: '#FF0000',
    image: '/music-apps/youtube.png',
    svgPath: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    description: 'Share videos and music to the world\'s largest video platform',
    fullDescription: 'YouTube is the world\'s largest video sharing platform with over 2 billion monthly active users. With Gruvi, you can create AI-generated music videos and upload them directly to your YouTube channel. Perfect for Shorts, music videos, and promotional content that reaches a global audience.',
    features: ['YouTube Shorts support', 'Full music video uploads', 'Automatic metadata', 'Custom thumbnails'],
    contentTypes: ['Music Videos', 'Shorts', 'Promotional Videos', 'Cinematic Content'],
    category: 'video',
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    color: '#000000',
    image: null,
    svgPath: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
    description: 'Go viral with short-form video content on TikTok',
    fullDescription: 'TikTok is the leading short-form video platform with over 1 billion active users. Create attention-grabbing AI-generated content with original music and post directly to your TikTok account. Perfect for viral trends, promotional clips, and creative storytelling.',
    features: ['Direct posting', 'Portrait video support', 'Trending content', 'Original audio'],
    contentTypes: ['Short Videos', 'Promotional Clips', 'Trend Content', 'Brand Videos'],
    category: 'video',
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    color: '#E4405F',
    image: null,
    svgPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
    svgGradient: true,
    description: 'Share Reels and Stories to your Instagram followers',
    fullDescription: 'Instagram reaches over 2 billion monthly users with its visual-first approach. Share your AI-generated music videos as Reels to maximize engagement and reach new audiences. Gruvi\'s direct integration makes posting seamless and effortless.',
    features: ['Reels support', 'Portrait optimization', 'Hashtag suggestions', 'Direct posting'],
    contentTypes: ['Reels', 'Stories', 'Promotional Content', 'Brand Awareness'],
    category: 'video',
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    color: '#1877F2',
    image: null,
    svgPath: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    description: 'Reach billions on the world\'s largest social network',
    fullDescription: 'Facebook connects over 3 billion people worldwide. Share your AI-generated content to your Facebook Page, reaching audiences through the feed, Reels, and video sections. Portrait videos are automatically posted as Facebook Reels for maximum engagement.',
    features: ['Facebook Reels', 'Page video posts', 'Wide reach', 'Community sharing'],
    contentTypes: ['Reels', 'Page Videos', 'Promotional Content', 'Community Posts'],
    category: 'video',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0077B5',
    image: null,
    svgPath: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    description: 'Share professional video content with your network',
    fullDescription: 'LinkedIn is the world\'s largest professional network with over 1 billion members. Share your AI-generated videos to build your professional brand, showcase your work, and engage with a business-focused audience. Perfect for thought leadership and professional content.',
    features: ['Professional audience', 'Video posts', 'Network sharing', 'Business reach'],
    contentTypes: ['Professional Videos', 'Brand Content', 'Thought Leadership', 'Promotional'],
    category: 'video',
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    color: '#000000',
    image: null,
    svgPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    description: 'Join the conversation and share content with your followers',
    fullDescription: 'X (formerly Twitter) is the global town square where conversations happen in real-time. With over 500 million monthly active users, share your AI-generated video content as posts or replies to engage your audience. Perfect for viral moments, announcements, and building your personal brand.',
    features: ['Real-time engagement', 'Viral potential', 'Thread support', 'Community building'],
    contentTypes: ['Short Videos', 'Announcements', 'Behind-the-scenes', 'Promotional Clips'],
    category: 'video',
  },
];


const SocialDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { platformId } = useParams<{ platformId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentSong } = useAudioPlayer();

  // Handle create button click - navigate to create page or login
  const handleCreateClick = () => {
    if (user?.userId) {
      navigate('/create');
    } else {
      navigate('/login');
    }
  };
  
  const currentPlatform = useMemo(() => {
    return socialPlatformData.find(platform => platform.id === platformId);
  }, [platformId]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [platformId]);

  // If platform not found, redirect to home
  if (!currentPlatform) {
    navigate('/');
    return null;
  }

  // Create breadcrumb data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://gruvi.ai/' },
    { name: 'Platforms', url: 'https://gruvi.ai/platforms' },
    { name: currentPlatform.name, url: `https://gruvi.ai/platforms/${currentPlatform.id}` }
  ];

  const isVideoCategory = currentPlatform.category === 'video';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0A0E1A 0%, #121826 50%, #0F1420 100%)',
        position: 'relative',
        pb: currentSong ? { xs: 10, sm: 12, md: 14 } : 0,
        transition: 'padding-bottom 0.3s ease-out',
      }}
    >
      {/* Background gradient orbs */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '40%',
            height: '40%',
            background: `radial-gradient(circle, ${currentPlatform.color}15 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '35%',
            height: '35%',
            background: `radial-gradient(circle, ${currentPlatform.color}10 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
      </Box>

      <SEO
        title={`Distribute to ${currentPlatform.name} | AI Music & Video Generator | Gruvi`}
        description={`Create AI-generated ${isVideoCategory ? 'videos' : 'music'} and share directly to ${currentPlatform.name}. ${currentPlatform.fullDescription}`}
        keywords={`${currentPlatform.name.toLowerCase()} upload, share to ${currentPlatform.name.toLowerCase()}, AI ${isVideoCategory ? 'video' : 'music'} ${currentPlatform.name.toLowerCase()}, distribute to ${currentPlatform.name.toLowerCase()}`}
        ogTitle={`Distribute to ${currentPlatform.name} | Gruvi`}
        ogDescription={currentPlatform.description}
        ogType="website"
        ogUrl={`https://gruvi.ai/platforms/${currentPlatform.id}`}
        twitterTitle={`Distribute to ${currentPlatform.name} | Gruvi`}
        twitterDescription={currentPlatform.description}
        structuredData={[createBreadcrumbStructuredData(breadcrumbData)]}
      />

      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 4,
            color: '#fff !important',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff !important',
            },
            '& .MuiSvgIcon-root': {
              color: '#fff !important',
            }
          }}
        >
          Back
        </Button>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          {/* Platform Icon */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: '28px',
              // White glow background for TikTok and X (black icons on dark background)
              background: (currentPlatform.id === 'tiktok' || currentPlatform.id === 'x')
                ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.20) 100%)'
                : `linear-gradient(135deg, ${currentPlatform.color}15 0%, ${currentPlatform.color}25 100%)`,
              border: (currentPlatform.id === 'tiktok' || currentPlatform.id === 'x')
                ? '2px solid rgba(255,255,255,0.2)'
                : `2px solid ${currentPlatform.color}30`,
              boxShadow: (currentPlatform.id === 'tiktok' || currentPlatform.id === 'x')
                ? '0 20px 60px rgba(255,255,255,0.12), 0 8px 24px rgba(255,255,255,0.08)'
                : `0 20px 60px ${currentPlatform.color}20, 0 8px 24px rgba(0,0,0,0.1)`,
              mb: 4,
            }}
          >
            {currentPlatform.image ? (
              <Box
                component="img"
                src={currentPlatform.image}
                alt={currentPlatform.name}
                sx={{
                  width: 64,
                  height: 64,
                  objectFit: 'contain',
                }}
              />
            ) : currentPlatform.svgPath ? (
              <Box component="svg" viewBox="0 0 24 24" sx={{ width: 64, height: 64 }}>
                {currentPlatform.svgGradient && (
                  <defs>
                    <linearGradient id={`gradient-${currentPlatform.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFDC80" />
                      <stop offset="25%" stopColor="#F77737" />
                      <stop offset="50%" stopColor="#E1306C" />
                      <stop offset="75%" stopColor="#C13584" />
                      <stop offset="100%" stopColor="#833AB4" />
                    </linearGradient>
                  </defs>
                )}
                <path
                  d={currentPlatform.svgPath}
                  fill={currentPlatform.svgGradient ? `url(#gradient-${currentPlatform.id})` : currentPlatform.color}
                />
              </Box>
            ) : null}
          </Box>

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#fff',
              mb: 2,
            }}
          >
            Share to {currentPlatform.name}
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.7)',
              mb: 3,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {currentPlatform.description}
          </Typography>

          {/* Full Description */}
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.8)',
              mb: 3,
              lineHeight: 1.8,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            {currentPlatform.fullDescription}
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            onClick={handleCreateClick}
            endIcon={<KeyboardArrowRightIcon />}
            sx={{
              background: `linear-gradient(135deg, ${currentPlatform.color} 0%, ${currentPlatform.color}CC 100%) !important`,
              backgroundColor: 'transparent !important',
              color: '#fff !important',
              fontWeight: 600,
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: `0 8px 24px ${currentPlatform.color}40`,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              mb: 3,
              '&:hover': {
                background: `linear-gradient(135deg, ${currentPlatform.color} 0%, ${currentPlatform.color}CC 100%) !important`,
                backgroundColor: 'transparent !important',
                color: '#fff !important',
                transform: 'translateY(-2px)',
                boxShadow: `0 12px 32px ${currentPlatform.color}50 !important`,
              },
            }}
          >
            Create for {currentPlatform.name}
          </Button>
        </Box>


        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#fff',
              mb: 3,
              textAlign: 'center',
            }}
          >
            {currentPlatform.name} Integration Features
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            {currentPlatform.features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#fff',
                    }}
                  />
                </Box>
                <Typography sx={{ fontWeight: 500, color: '#fff' }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Content Types */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#fff',
              mb: 3,
              textAlign: 'center',
            }}
          >
            What You Can Share
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
            {currentPlatform.contentTypes.map((type, index) => (
              <Box
                key={index}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: '100px',
                  background: `${currentPlatform.color}15`,
                  border: `1px solid ${currentPlatform.color}30`,
                }}
              >
                <Typography sx={{ fontWeight: 500, color: '#fff', fontSize: '0.95rem' }}>
                  {type}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Other Platforms */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#fff',
              mb: 3,
            }}
          >
            Explore More Platforms
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {socialPlatformData.filter(p => p.id !== platformId).map((platform) => (
              <Box
                key={platform.id}
                onClick={() => navigate(`/platforms/${platform.id}`)}
                sx={{
                  width: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    background: (platform.id === 'tiktok' || platform.id === 'x')
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.20) 100%)'
                      : `linear-gradient(135deg, ${platform.color}15 0%, ${platform.color}25 100%)`,
                    border: (platform.id === 'tiktok' || platform.id === 'x')
                      ? '1px solid rgba(255,255,255,0.2)'
                      : `1px solid ${platform.color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: (platform.id === 'tiktok' || platform.id === 'x')
                      ? '0 4px 16px rgba(255,255,255,0.08)'
                      : '0 4px 16px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: (platform.id === 'tiktok' || platform.id === 'x')
                        ? '0 8px 24px rgba(255,255,255,0.12)'
                        : `0 8px 24px ${platform.color}20`,
                    },
                  }}
                >
                  {platform.image ? (
                    <Box
                      component="img"
                      src={platform.image}
                      alt={platform.name}
                      sx={{
                        width: 28,
                        height: 28,
                        objectFit: 'contain',
                      }}
                    />
                  ) : platform.svgPath ? (
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 28, height: 28 }}>
                      {platform.svgGradient && (
                        <defs>
                          <linearGradient id={`gradient-other-${platform.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFDC80" />
                            <stop offset="25%" stopColor="#F77737" />
                            <stop offset="50%" stopColor="#E1306C" />
                            <stop offset="75%" stopColor="#C13584" />
                            <stop offset="100%" stopColor="#833AB4" />
                          </linearGradient>
                        </defs>
                      )}
                      <path
                        d={platform.svgPath}
                        fill={platform.svgGradient ? `url(#gradient-other-${platform.id})` : platform.color}
                      />
                    </Box>
                  ) : null}
                </Box>
                <Typography sx={{ fontWeight: 500, color: '#fff', fontSize: '0.7rem', textAlign: 'center' }}>
                  {platform.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            p: 5,
            borderRadius: '24px',
            background: `linear-gradient(135deg, ${currentPlatform.color}15 0%, ${currentPlatform.color}08 100%)`,
            border: `1px solid ${currentPlatform.color}30`,
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
            Ready to Share on {currentPlatform.name}?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, fontSize: '1.1rem' }}>
            Create original AI-generated {isVideoCategory ? 'videos' : 'music'} and distribute directly - no copyright worries.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            sx={{
              background: `linear-gradient(135deg, ${currentPlatform.color} 0%, ${currentPlatform.color}CC 100%) !important`,
              backgroundColor: 'transparent !important',
              color: '#fff !important',
              fontWeight: 600,
              borderRadius: '12px',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: `0 8px 24px ${currentPlatform.color}40`,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: `linear-gradient(135deg, ${currentPlatform.color} 0%, ${currentPlatform.color}CC 100%) !important`,
                backgroundColor: 'transparent !important',
                color: '#fff !important',
                transform: 'translateY(-2px)',
                boxShadow: `0 12px 32px ${currentPlatform.color}50 !important`,
              },
            }}
          >
            {user?.userId ? 'Start Creating' : 'Get Started Free'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SocialDetailPage;

