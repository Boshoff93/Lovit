import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Container, Chip, Button, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface VideoItem {
  id: string;
  title: string;
  style: string;
  thumbnail: string;
  videoUrl?: string;
  tag?: string;
}

interface VideoShowcaseProps {
  videos: VideoItem[];
  /** Pre-fetched video URLs keyed by video id - if provided, skips internal fetch */
  videoUrls?: Record<string, string>;
  title?: React.ReactNode;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  onVideoClick?: (video: VideoItem) => void;
  darkMode?: boolean;
  /** Custom gradient background - overrides darkMode background */
  gradientBackground?: string;
}

/**
 * VideoCard - Individual video card with hover-to-play functionality
 * Styled like pricing cards with rounded corners, shadows, and gradient accents
 */
const VideoCard: React.FC<{
  video: VideoItem;
  videoUrl?: string;
  onClick?: () => void;
  index: number;
  darkMode?: boolean;
  isInView?: boolean;
}> = ({ video, videoUrl, onClick, index, darkMode = false, isInView = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play when in view
  useEffect(() => {
    if (isInView && videoRef.current && videoUrl) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    } else if (!isInView && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView, videoUrl]);

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
    // Don't stop playing if in view - keep auto-playing
    if (!isInView && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isInView]);

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
        // Staggered animation on mount
        animation: `cardFadeIn 0.5s ease ${index * 100}ms forwards`,
        opacity: 0,
        '@keyframes cardFadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        boxShadow: isHovered
          ? darkMode ? '0 24px 60px rgba(249, 115, 22, 0.25)' : '0 24px 60px rgba(236, 72, 153, 0.25)'
          : darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.08)',
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
          aspectRatio: '9/16',
          overflow: 'hidden',
        }}
      >
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
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            opacity: isPlaying ? 0 : 1,
            zIndex: 1,
          }}
        />
        {/* Video - hidden until hover, plays on hover */}
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
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              zIndex: 0,
            }}
          />
        )}

        {/* Full gradient overlay */}
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
            p: 2,
            zIndex: 3,
          }}
        >
          {/* Tag at top */}
          {video.tag && (
            <Box
              sx={{
                alignSelf: 'flex-start',
                px: 1.5,
                py: 0.5,
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '0.02em',
                }}
              >
                {video.tag}
              </Typography>
            </Box>
          )}

          {/* Title, style, and play button at bottom */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#fff',
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {video.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
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
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                opacity: isPlaying ? 0.6 : 1,
                transform: isHovered && !isPlaying ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <PlayArrowRoundedIcon sx={{ fontSize: 22, color: '#F97316', ml: 0.25 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * VideoShowcase - Centered 3-video showcase section like Followr.ai
 * Professional marketing-focused design with hover-to-play videos
 */
const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  videos,
  videoUrls: externalVideoUrls,
  title = 'Create UGC Videos with AI',
  subtitle = 'Transform your product demos into engaging video presentations. Let AI avatars showcase your products 24/7 with perfect delivery, multiple languages, and unlimited scalability.',
  badge = 'AI-Powered Product Presentations',
  ctaText = 'Create Your Video',
  ctaLink = '/create/video',
  onVideoClick,
  darkMode = false,
  gradientBackground,
}) => {
  // Take only first 3 videos for the centered display
  const displayVideos = videos.slice(0, 3);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [internalVideoUrls, setInternalVideoUrls] = useState<Record<string, string>>({});
  const [isInView, setIsInView] = useState(false);

  // Use external video URLs if provided, otherwise use internal state
  const videoUrls = externalVideoUrls || internalVideoUrls;

  // Intersection observer for auto-play when in view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Fetch all video URLs on mount (only if external URLs not provided)
  useEffect(() => {
    if (externalVideoUrls) return; // Skip if external URLs provided

    const fetchVideoUrls = async () => {
      const apiBase = 'https://api.gruvimusic.com';
      const urls: Record<string, string> = {};

      await Promise.all(
        displayVideos.map(async (video) => {
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

      setInternalVideoUrls(urls);
    };

    if (displayVideos.length > 0) {
      fetchVideoUrls();
    }
  }, [displayVideos, externalVideoUrls]);

  // Check if carousel has overflow and track scroll position
  useEffect(() => {
    const container = carouselRef.current;
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
  }, [displayVideos]);

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 200;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  const getBackground = () => {
    if (gradientBackground) return gradientBackground;
    if (darkMode) return 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 100%)';
    return 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(252,250,255,1) 100%)';
  };

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        background: getBackground(),
      }}
    >
      {/* Decorative gradient orbs - only show if no custom gradient background */}
      {!gradientBackground && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '40%',
              height: '60%',
              background: darkMode
                ? 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.12) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-15%',
              left: '-10%',
              width: '35%',
              height: '50%',
              background: darkMode
                ? 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.08) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header - Centered */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 5, md: 7 },
          }}
        >
          {/* Badge */}
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                mb: 2,
                background: darkMode ? 'rgba(249, 115, 22, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                color: darkMode ? '#FB923C' : '#8B5CF6',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '100px',
                animation: 'fadeInDown 0.4s ease forwards',
                '@keyframes fadeInDown': {
                  from: { opacity: 0, transform: 'translateY(-8px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            />
          )}

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: darkMode ? '#fff' : '#1D1D1F',
              mb: 2,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          {/* Subtitle */}
          {subtitle && (
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: darkMode ? 'rgba(255,255,255,0.7)' : '#48484A',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Video Grid - Centered 3 cards */}
        <Box sx={{
          position: 'relative',
          maxWidth: '900px',
          mx: { xs: -2, sm: -3, md: 'auto' }, // Break out of container padding on mobile
          mb: { xs: 5, md: 6 },
          overflow: 'visible'
        }}>
          {/* Left Arrow Overlay - only show when can scroll left */}
          {hasOverflow && canScrollLeft && !isLgUp && (
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
                background: darkMode
                  ? 'linear-gradient(to right, rgba(46,26,26,1) 0%, transparent 100%)'
                  : 'linear-gradient(to right, rgba(255,255,255,1) 0%, transparent 100%)',
                cursor: 'pointer',
                color: darkMode ? '#fff' : '#1D1D1F',
                transition: 'opacity 0.2s ease',
                '&:active': {
                  opacity: 0.7,
                },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 28 }} />
            </Box>
          )}

          {/* Right Arrow Overlay - only show when can scroll right */}
          {hasOverflow && canScrollRight && !isLgUp && (
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
                background: darkMode
                  ? 'linear-gradient(to left, rgba(46,26,26,1) 0%, transparent 100%)'
                  : 'linear-gradient(to left, rgba(255,255,255,1) 0%, transparent 100%)',
                cursor: 'pointer',
                color: darkMode ? '#fff' : '#1D1D1F',
                transition: 'opacity 0.2s ease',
                '&:active': {
                  opacity: 0.7,
                },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 28 }} />
            </Box>
          )}

          {/* Centered grid container */}
          <Box
            ref={carouselRef}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'center' },
              overflowX: { xs: 'auto', md: 'visible' },
              overflowY: 'visible',
              // Add padding to prevent shadow clipping on mobile
              py: { xs: 4, md: 2 },
              my: { xs: -2, md: 0 },
              scrollSnapType: { xs: 'x mandatory', md: 'none' },
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              // Edge-to-edge scrolling on mobile with padding for first/last items
              '&::before': {
                content: '""',
                flexShrink: 0,
                width: { xs: '16px', md: 0 },
              },
              '&::after': {
                content: '""',
                flexShrink: 0,
                width: { xs: '16px', md: 0 },
              },
              gap: { xs: 2, md: 3 },
            }}
          >
            {displayVideos.map((video, index) => (
              <Box
                key={video.id}
                sx={{
                  width: { xs: '200px', sm: '220px', md: '260px' },
                  minWidth: { xs: '200px', sm: '220px', md: '260px' },
                  flex: '0 0 auto',
                  scrollSnapAlign: { xs: 'center', md: 'none' },
                }}
              >
                <VideoCard
                  video={video}
                  videoUrl={videoUrls[video.id]}
                  index={index}
                  darkMode={darkMode}
                  isInView={isInView}
                  onClick={() => onVideoClick?.(video)}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Button */}
        {ctaText && ctaLink && (
          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to={ctaLink}
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                background: darkMode
                  ? 'linear-gradient(135deg, #F97316 0%, #EF4444 100%) !important'
                  : 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%) !important',
                color: '#fff',
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 1.75 },
                borderRadius: '100px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                boxShadow: darkMode
                  ? '0 8px 24px rgba(249, 115, 22, 0.35)'
                  : '0 8px 24px rgba(236, 72, 153, 0.35)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: darkMode
                    ? '0 12px 32px rgba(249, 115, 22, 0.45)'
                    : '0 12px 32px rgba(236, 72, 153, 0.45)',
                },
              }}
            >
              {ctaText}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default VideoShowcase;
