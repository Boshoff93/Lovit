import React, { useMemo, useEffect } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import {
  Typography,
  Box,
  Container,
  Button,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';

// Mood data with detailed information
export const moodData = [
  { id: 'happy', name: 'Happy', image: '/moods/happy.jpeg', color: '#FFD93D', description: 'Joyful and upbeat vibes', fullDescription: 'Happy music spreads joy and positivity. Create uplifting tracks with bright melodies, major keys, and feel-good energy. Perfect for celebrations, feel-good content, and brightening anyone\'s day.' },
  { id: 'sad', name: 'Sad', image: '/moods/sad.jpeg', color: '#5B8FB9', description: 'Emotional and melancholic tones', fullDescription: 'Sad music touches the heart with emotional depth. Create moving tracks with minor keys, slow tempos, and heartfelt melodies. Perfect for emotional storytelling and moments of reflection.' },
  { id: 'energetic', name: 'Energetic', image: '/moods/energetic.jpeg', color: '#FF6B35', description: 'High-energy and pumping beats', fullDescription: 'Energetic music gets the adrenaline flowing. Create high-tempo tracks with driving rhythms and powerful energy. Perfect for workouts, action content, and motivation.' },
  { id: 'romantic', name: 'Romantic', image: '/moods/romantic.jpeg', color: '#FF69B4', description: 'Love and tender emotions', fullDescription: 'Romantic music captures the essence of love. Create tender tracks with sweeping melodies and intimate arrangements. Perfect for love songs, weddings, and romantic moments.' },
  { id: 'chill', name: 'Chill', image: '/moods/chill.jpeg', color: '#87CEEB', description: 'Relaxed and laid-back sounds', fullDescription: 'Chill music provides the perfect backdrop for relaxation. Create smooth, laid-back tracks with mellow vibes. Perfect for studying, lounging, and unwinding.' },
  { id: 'epic', name: 'Epic', image: '/moods/epic.jpeg', color: '#9B59B6', description: 'Grand and cinematic soundscapes', fullDescription: 'Epic music creates powerful emotional impact. Create grand tracks with soaring orchestration and dramatic builds. Perfect for trailers, games, and memorable moments.' },
  { id: 'dreamy', name: 'Dreamy', image: '/moods/dreamy.jpeg', color: '#DDA0DD', description: 'Ethereal and atmospheric', fullDescription: 'Dreamy music transports listeners to otherworldly places. Create floating, atmospheric tracks with lush textures. Perfect for ambient content and creative inspiration.' },
  { id: 'dark', name: 'Dark', image: '/moods/dark.jpeg', color: '#2C3E50', description: 'Moody and intense atmosphere', fullDescription: 'Dark music creates tension and intrigue. Create brooding tracks with minor keys and ominous undertones. Perfect for thrillers, horror, and edgy content.' },
  { id: 'uplifting', name: 'Uplifting', image: '/moods/uplifting.jpeg', color: '#27AE60', description: 'Inspiring and motivational', fullDescription: 'Uplifting music inspires and motivates. Create tracks that build toward emotional peaks and triumphant moments. Perfect for inspirational content and success stories.' },
  { id: 'nostalgic', name: 'Nostalgic', image: '/moods/nostalgic.jpeg', color: '#D4A574', description: 'Warm memories and reflection', fullDescription: 'Nostalgic music evokes warm memories of the past. Create tracks with vintage textures and emotional resonance. Perfect for reminiscing and sentimental content.' },
  { id: 'peaceful', name: 'Peaceful', image: '/moods/peacful.jpeg', color: '#98FB98', description: 'Calm and serene vibes', fullDescription: 'Peaceful music creates tranquility and calm. Create gentle tracks with soft dynamics and soothing melodies. Perfect for meditation, yoga, and relaxation.' },
  { id: 'intense', name: 'Intense', image: '/moods/intense.jpeg', color: '#E74C3C', description: 'Powerful and gripping energy', fullDescription: 'Intense music grabs attention and doesn\'t let go. Create tracks with driving energy, tension, and release. Perfect for action sequences and dramatic moments.' },
  { id: 'melancholic', name: 'Melancholic', image: '/moods/melancholic.jpeg', color: '#7F8C8D', description: 'Bittersweet and reflective', fullDescription: 'Melancholic music captures bittersweet emotions. Create tracks with emotional depth and thoughtful arrangements. Perfect for introspective content and artistic expression.' },
  { id: 'playful', name: 'Playful', image: '/moods/playful.jpeg', color: '#F39C12', description: 'Fun and lighthearted', fullDescription: 'Playful music brings fun and whimsy. Create tracks with bouncy rhythms and cheerful melodies. Perfect for children\'s content, comedy, and lighthearted moments.' },
  { id: 'mysterious', name: 'Mysterious', image: '/moods/mysterious.jpeg', color: '#8E44AD', description: 'Intriguing and enigmatic', fullDescription: 'Mysterious music creates curiosity and intrigue. Create tracks with unusual harmonies and suspenseful elements. Perfect for mystery, sci-fi, and exploration content.' },
  { id: 'triumphant', name: 'Triumphant', image: '/moods/triumphant.jpeg', color: '#F1C40F', description: 'Victorious and celebratory', fullDescription: 'Triumphant music celebrates victory and achievement. Create tracks with powerful brass, soaring melodies, and celebratory energy. Perfect for sports, achievements, and success moments.' },
  { id: 'promotional', name: 'Promotional', image: '/moods/promotional.jpeg', color: '#3498DB', description: 'Professional and engaging', fullDescription: 'Promotional music captures attention and conveys professionalism. Create polished tracks perfect for ads, corporate videos, and product showcases. Engaging and memorable.' },
];

// Sample tracks for moods
const moodSampleTracks: Record<string, Array<{id: number; title: string; duration: string; plays: string}>> = {
  'happy': [
    { id: 1, title: 'Sunshine Day', duration: '2:45', plays: '28.5K' },
    { id: 2, title: 'Good Vibes Only', duration: '3:12', plays: '22.1K' },
    { id: 3, title: 'Feel the Joy', duration: '2:58', plays: '35.2K' },
  ],
  'sad': [
    { id: 1, title: 'Tears in the Rain', duration: '4:22', plays: '31.3K' },
    { id: 2, title: 'Empty Streets', duration: '3:56', plays: '18.7K' },
    { id: 3, title: 'Missing You', duration: '3:45', plays: '25.9K' },
  ],
  'default': [
    { id: 1, title: 'Track One', duration: '2:45', plays: '15.2K' },
    { id: 2, title: 'Track Two', duration: '3:18', plays: '12.8K' },
    { id: 3, title: 'Track Three', duration: '2:32', plays: '18.4K' },
  ],
};

const MoodDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { moodId } = useParams<{ moodId: string }>();
  
  // Check if audio player is active to add bottom padding
  const { currentSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;

  // Find the current mood data
  const currentMood = useMemo(() => {
    return moodData.find(mood => mood.id === moodId);
  }, [moodId]);

  // Get sample tracks for this mood
  const sampleTracks = useMemo(() => {
    return moodSampleTracks[moodId || ''] || moodSampleTracks['default'];
  }, [moodId]);

  // Scroll to top when component mounts or moodId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [moodId]);

  // If mood not found, redirect to home
  if (!currentMood) {
    navigate('/');
    return null;
  }

  // Create breadcrumb data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://gruvimusic.com/' },
    { name: 'Moods', url: 'https://gruvimusic.com/moods' },
    { name: currentMood.name, url: `https://gruvimusic.com/moods/${currentMood.id}` }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fff',
        position: 'relative',
        // Add bottom padding when audio player is visible
        pb: hasActivePlayer ? 12 : 0,
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
          background: `radial-gradient(ellipse at top, ${currentMood.color}15 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SEO
        title={`Create ${currentMood.name} Music with AI | Gruvi`}
        description={`Generate original ${currentMood.name} music with Gruvi's AI music generator. ${currentMood.fullDescription}`}
        keywords={`${currentMood.name.toLowerCase()} music, AI ${currentMood.name.toLowerCase()} generator, create ${currentMood.name.toLowerCase()} songs, ${currentMood.name.toLowerCase()} beats`}
        ogTitle={`Create ${currentMood.name} Music with AI | Gruvi`}
        ogDescription={`Generate original ${currentMood.name} music with Gruvi's AI music generator. ${currentMood.description}`}
        ogType="website"
        ogUrl={`https://gruvimusic.com/moods/${currentMood.id}`}
        twitterTitle={`Create ${currentMood.name} Music with AI | Gruvi`}
        twitterDescription={currentMood.description}
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

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          {/* Mood Image */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 140,
              height: 140,
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: `0 20px 60px ${currentMood.color}30, 0 8px 24px rgba(0,0,0,0.1)`,
              border: `3px solid ${currentMood.color}40`,
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={currentMood.image}
              alt={currentMood.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              color: '#1D1D1F',
              mb: 2,
            }}
          >
            {currentMood.name} Music
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: '1.25rem',
              color: '#86868B',
              mb: 3,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {currentMood.description}
          </Typography>

          {/* Full Description */}
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: '#1D1D1F',
              mb: 4,
              lineHeight: 1.8,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            {currentMood.fullDescription}
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            endIcon={<KeyboardArrowRightIcon />}
            sx={{
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(20px)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '16px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              },
            }}
          >
            Create {currentMood.name} Music
          </Button>
        </Box>

        {/* Sample Tracks Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#1D1D1F',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Example {currentMood.name} Tracks
          </Typography>

          <Box
            sx={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}
          >
            {sampleTracks.map((track, index) => (
              <Box
                key={track.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderBottom: index < sampleTracks.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(0,122,255,0.04)',
                  },
                }}
              >
                {/* Track Number */}
                <Typography sx={{ width: 24, color: '#86868B', fontWeight: 500 }}>
                  {index + 1}
                </Typography>

                {/* Mood Image as Cover */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <Box
                    component="img"
                    src={currentMood.image}
                    alt={currentMood.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                {/* Track Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                    {track.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                    {currentMood.name} • {track.duration}
                  </Typography>
                </Box>

                {/* Plays */}
                <Typography sx={{ color: '#86868B', fontSize: '0.9rem', display: { xs: 'none', sm: 'block' } }}>
                  {track.plays}
                </Typography>

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    sx={{
                      background: '#fff',
                      color: '#007AFF',
                      width: 40,
                      height: 40,
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#fff',
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <DownloadRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      background: '#fff',
                      color: '#007AFF',
                      width: 40,
                      height: 40,
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#fff',
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Related Moods */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1D1D1F',
              mb: 3,
            }}
          >
            Explore More Moods
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
            {moodData.filter(m => m.id !== moodId).slice(0, 8).map((mood) => (
              <Box
                key={mood.id}
                onClick={() => navigate(`/moods/${mood.id}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    borderColor: `${mood.color}40`,
                  },
                }}
              >
                <Box
                  component="img"
                  src={mood.image}
                  alt={mood.name}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <Typography sx={{ fontWeight: 500, color: '#1D1D1F' }}>{mood.name}</Typography>
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
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
            Ready to Create Your Own {currentMood.name} Track?
          </Typography>
          <Typography sx={{ color: '#86868B', mb: 3, fontSize: '1.1rem' }}>
            Sign up for Gruvi and start generating professional {currentMood.name} music in seconds.
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

export default MoodDetailPage;

