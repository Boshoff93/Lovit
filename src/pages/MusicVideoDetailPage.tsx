import React, { useMemo, useEffect } from 'react';
import {
  Typography,
  Box,
  Container,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PaletteIcon from '@mui/icons-material/Palette';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';

// Sample music videos data
export const musicVideoData = [
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
    description: 'Adventure through magical worlds in 3D cartoon style',
    fullDescription: 'Join the ultimate adventure in this 3D cartoon music video. Fantasy Quest takes you through magical forests, ancient castles, and mystical creatures, all brought to life with vibrant Pixar-quality animation.',
  },
];

const MusicVideoDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { videoId } = useParams<{ videoId: string }>();

  // Find the current video data
  const currentVideo = useMemo(() => {
    return musicVideoData.find(video => video.id === videoId);
  }, [videoId]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [videoId]);

  // If video not found, redirect to home
  if (!currentVideo) {
    navigate('/');
    return null;
  }

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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Video Preview */}
          <Box sx={{ flex: { xs: 'none', md: '0 0 300px' } }}>
            <Box
              sx={{
                position: 'relative',
                aspectRatio: '9/16',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
            >
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
                }}
              >
                <IconButton
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
                }}
              />
            </Box>
          </Box>

          {/* Video Info */}
          <Box sx={{ flex: 1 }}>
            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
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
                fontSize: '1.1rem',
                color: '#86868B',
                mb: 3,
              }}
            >
              {currentVideo.description}
            </Typography>

            {/* Full Description */}
            <Typography
              sx={{
                fontSize: '1rem',
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

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<DownloadRoundedIcon sx={{ color: '#fff' }} />}
                onClick={() => navigate('/')}
                sx={{
                  background: '#007AFF',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 3,
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
                Download Video
              </Button>
              <Button
                variant="contained"
                endIcon={<KeyboardArrowRightIcon sx={{ color: '#fff' }} />}
                onClick={() => navigate('/')}
                sx={{
                  background: '#007AFF',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 3,
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
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {musicVideoData.filter(v => v.id !== videoId).slice(0, 4).map((video) => (
              <Box
                key={video.id}
                onClick={() => navigate(`/videos/${video.id}`)}
                sx={{
                  width: { xs: '140px', sm: '160px' },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ position: 'relative', aspectRatio: '9/16', borderRadius: '16px', overflow: 'hidden' }}>
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
            ))}
          </Box>
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

