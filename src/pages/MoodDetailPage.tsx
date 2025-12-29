import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import {
  Typography,
  Box,
  Container,
  Button,
  Paper,
  CircularProgress,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { SEO, createBreadcrumbStructuredData, createMusicPlaylistStructuredData } from '../utils/seoHelper';
import { songsApi } from '../services/api';

// Animated Equalizer Component for playing tracks
const AudioEqualizer: React.FC<{ isPlaying: boolean; size?: number; color?: string }> = ({ 
  isPlaying, 
  size = 20,
  color = '#007AFF' 
}) => {
  const barWidth = size / 5;
  const gap = size / 10;
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: `${gap}px`,
        height: size,
        width: size,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            width: barWidth,
            backgroundColor: color,
            borderRadius: `${barWidth / 2}px`,
            height: isPlaying ? undefined : `${size * 0.2}px`,
            minHeight: `${size * 0.15}px`,
            animation: isPlaying 
              ? `equalizer${i} 0.${4 + i}s ease-in-out infinite alternate`
              : 'none',
            '@keyframes equalizer0': {
              '0%': { height: `${size * 0.2}px` },
              '100%': { height: `${size * 0.9}px` },
            },
            '@keyframes equalizer1': {
              '0%': { height: `${size * 0.5}px` },
              '100%': { height: `${size * 0.3}px` },
            },
            '@keyframes equalizer2': {
              '0%': { height: `${size * 0.3}px` },
              '100%': { height: `${size * 0.8}px` },
            },
            '@keyframes equalizer3': {
              '0%': { height: `${size * 0.6}px` },
              '100%': { height: `${size * 0.4}px` },
            },
          }}
        />
      ))}
    </Box>
  );
};

// Scrollable Carousel with arrows and gradient edges
interface ScrollableCarouselProps {
  id: string;
  children: React.ReactNode;
}

const ScrollableCarousel: React.FC<ScrollableCarouselProps> = ({ id, children }) => {
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const checkScrollPosition = React.useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      // Initial check and delayed check for content to render
      checkScrollPosition();
      setTimeout(checkScrollPosition, 100);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [checkScrollPosition]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {showLeftArrow && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: -1,
              top: -8,
              bottom: -8,
              width: 64,
              background: 'linear-gradient(to right, #fff 0%, #fff 20%, transparent 100%)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              background: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              width: 40,
              height: 40,
              '&:hover': { background: '#fff', transform: 'translateY(-50%) scale(1.05)' },
            }}
          >
            <ChevronLeftIcon sx={{ color: '#1D1D1F' }} />
          </IconButton>
        </>
      )}
      {showRightArrow && (
        <>
          <Box
            sx={{
              position: 'absolute',
              right: -1,
              top: -8,
              bottom: -8,
              width: 64,
              background: 'linear-gradient(to left, #fff 0%, #fff 20%, transparent 100%)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              background: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              width: 40,
              height: 40,
              '&:hover': { background: '#fff', transform: 'translateY(-50%) scale(1.05)' },
            }}
          >
            <ChevronRightIcon sx={{ color: '#1D1D1F' }} />
          </IconButton>
        </>
      )}
      <Box
        ref={containerRef}
        id={id}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          py: 1,
          px: 0.5,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// Owner user ID for the seed songs (your account)
const SEED_SONGS_USER_ID = 'b1b35a41-efb4-4f79-ad61-13151294940d';

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

// Sample tracks for moods with song IDs for playback
const moodSampleTracks: Record<string, Array<{id: string; title: string; duration: string; plays: string}>> = {
  'happy': [
    { id: '7f4f3eb5-596a-4d46-b33c-dd4697a74a83', title: 'Sunshine State of Mind', duration: '1:54', plays: '0' },
    { id: '5beb25e2-4c15-48cc-9a89-79fb8dd04402', title: 'Golden Days', duration: '2:30', plays: '0' },
    { id: 'd89b3510-bbdc-4a0c-9139-293bd950b78d', title: 'Get Up and Groove', duration: '2:00', plays: '0' },
  ],
  'sad': [
    { id: '837fc2d9-cf58-45ff-a9d0-e07f87ff3283', title: 'The Last Time I Hold You', duration: '3:11', plays: '0' },
    { id: '83f79863-e9b5-4232-a0ee-3f74b208e485', title: 'Empty Rooms', duration: '3:14', plays: '0' },
    { id: '45655657-4b0b-4345-b2a3-096fbdbb325c', title: 'Tears Like Rain', duration: '2:10', plays: '0' },
  ],
  'energetic': [
    { id: '1a8457ce-7e62-487a-9a40-0c21a16946c6', title: 'Unstoppable Force', duration: '2:04', plays: '0' },
    { id: '4b366df5-654b-4b2e-99e7-d032168b66a3', title: 'Burn It Down', duration: '2:38', plays: '0' },
    { id: '9a3848b9-42fd-4eb5-8a0f-c3afff95833e', title: 'All In', duration: '1:30', plays: '0' },
  ],
  'romantic': [
    { id: '5f435834-05ba-4cdb-8a2a-d18a2cd62516', title: 'Every Beat of My Heart', duration: '3:00', plays: '0' },
    { id: '9bdfd8d2-e81e-46ea-b96f-cfd5678a5c12', title: 'Closer to You', duration: '2:17', plays: '0' },
    { id: 'ff603ac3-6c99-47bd-ad02-217a8acd5132', title: 'Forever Starts Tonight', duration: '2:34', plays: '0' },
  ],
  'chill': [
    { id: 'e4311b6b-e5b6-4a45-8683-9abb166ac987', title: 'Drift Away', duration: '2:27', plays: '0' },
    { id: 'e07563ca-8240-4a84-868b-f6fe2c93b170', title: 'Sunday Afternoon', duration: '2:14', plays: '0' },
    { id: '260edba5-d9d2-4ebe-a041-125342cf13f7', title: 'Hammock Afternoon', duration: '2:21', plays: '0' },
  ],
  'epic': [
    { id: '873ba9a5-b04b-4e2d-826c-4480c660d6bd', title: 'Rise of the Fallen', duration: '3:06', plays: '0' },
    { id: 'bec5e3c4-45e5-419b-b304-6550a34996fd', title: 'Carved in Stone', duration: '2:53', plays: '0' },
    { id: '59e116e0-b584-4fd6-a1d6-95a56149ff8f', title: 'Infinite Horizon', duration: '3:10', plays: '0' },
  ],
  'dreamy': [
    { id: 'a674a1db-f278-4bf2-b243-03c52f925a9a', title: 'Dissolving Light', duration: '3:06', plays: '0' },
    { id: 'd37169f4-c62d-4a92-b4bc-05efe7eb6822', title: 'Firefly Lullaby', duration: '2:18', plays: '0' },
    { id: '4e29c826-fba9-4d73-bf37-8e2f848b844a', title: 'Velvet Telescope', duration: '2:20', plays: '0' },
  ],
  'dark': [
    { id: '596c838c-4dc7-418b-9782-6d71fb2bd76b', title: 'Shadow Pulse', duration: '2:10', plays: '0' },
    { id: 'efcc46e1-d9b4-47e8-a1fd-fb48124ae637', title: 'Throne of Ashes', duration: '3:00', plays: '0' },
    { id: 'd803f9ca-45d9-4ba5-8c60-ef619804ed8f', title: 'Echoes in the Abyss', duration: '2:03', plays: '0' },
  ],
  'uplifting': [
    { id: '1f46a1d0-8aba-4292-b70d-03f2a16135ff', title: 'Rise Above the Storm', duration: '2:24', plays: '0' },
    { id: 'a62fe964-b721-47e9-95a0-387af2621783', title: 'Dawn Breaking Through', duration: '3:07', plays: '0' },
    { id: '0a2f7170-bcfc-4dfd-99ff-9d59fca45234', title: 'Rise Together', duration: '2:24', plays: '0' },
  ],
  'nostalgic': [
    { id: '225cffc1-7630-4409-83a3-e126c6111d87', title: 'Polaroid Summer', duration: '3:09', plays: '0' },
    { id: '14c25030-c245-4700-9833-9fcb943a3649', title: 'Polaroid Summer', duration: '3:04', plays: '0' },
    { id: 'e0646d71-e6dc-4cf4-9330-c0608fd81795', title: "Photographs Don't Fade Like We Do", duration: '2:28', plays: '0' },
  ],
  'peaceful': [
    { id: '84c6a79e-058e-4962-a46a-f242c32ae475', title: 'Still Water Morning', duration: '3:20', plays: '0' },
    { id: '48b7b427-8027-498c-bc4c-31bb8f8db128', title: 'Morning Light', duration: '2:30', plays: '0' },
    { id: '3d211cf3-3978-4e83-9a5e-4a430761d26d', title: 'Temple of Stillness', duration: '3:14', plays: '0' },
  ],
  'intense': [
    { id: '2b64c7a5-2cf6-4d38-8176-9892dbac5e14', title: 'Breaking Point', duration: '2:22', plays: '0' },
    { id: '6c65a6d5-3af9-4822-b5dd-1d5acc5e5488', title: 'No Escape', duration: '2:19', plays: '0' },
    { id: 'ddd8a5ab-fe8b-4a3b-9ccb-44176de7291d', title: 'Blood and Iron', duration: '3:33', plays: '0' },
  ],
  'melancholic': [
    { id: '50c472d1-fa58-44e5-8498-f0747143f1c5', title: 'The Weight of Yesterday', duration: '3:01', plays: '0' },
    { id: '5029fa45-e83c-4cea-adaf-4384e56da016', title: 'Glass Houses in the Rain', duration: '3:00', plays: '0' },
    { id: '4ee19d88-aa4e-4afb-a521-43432ecd3238', title: 'The Last Light Fades', duration: '3:14', plays: '0' },
  ],
  'playful': [
    { id: 'b7c4fc6d-31b0-4cb2-8143-7f4ccc80e959', title: 'Bubble Gum Dreams', duration: '1:47', plays: '0' },
    { id: 'de03bede-6f6b-4637-8b42-30a6b389e0a8', title: 'The Mischief March', duration: '1:59', plays: '0' },
    { id: '86a564cc-4111-4841-9b4d-f992971280b5', title: 'Funky Chicken Revolution', duration: '1:41', plays: '0' },
  ],
  'mysterious': [
    { id: '335a246a-ae01-4226-b2e2-45b05d9f9b36', title: 'Whispers in the Static', duration: '2:16', plays: '0' },
    { id: '457efe01-0fa2-4522-af10-dfbafd935b3d', title: 'Echoes in the Sand', duration: '3:12', plays: '0' },
    { id: '6912cf23-bd04-47b1-bcf6-e268181c0412', title: "Shadows Don't Lie", duration: '2:27', plays: '0' },
  ],
  'triumphant': [
    { id: 'fb24a715-5fad-4390-81fd-38d626652b06', title: 'Rise to Glory', duration: '2:39', plays: '0' },
    { id: 'f9f05234-2774-4670-bde4-4b18c37e54bc', title: 'Unstoppable', duration: '2:45', plays: '0' },
    { id: 'ff010436-732f-43bf-97d9-d62ddcf51a92', title: 'Crown Heavy', duration: '1:36', plays: '0' },
  ],
  'promotional': [
    { id: '7d37576a-53d2-4f24-bb14-58875a1000ef', title: 'Digital Horizon', duration: '2:18', plays: '0' },
    { id: '5c1382e3-4a20-418a-b315-06d5ffc124a9', title: 'Rise Beyond', duration: '2:21', plays: '0' },
    { id: '4fddf01d-da46-4f73-baaa-c1918f0813b1', title: 'Rise Up and Shine', duration: '2:46', plays: '0' },
  ],
};

const MoodDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { moodId } = useParams<{ moodId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Audio player context
  const { currentSong, isPlaying, playSong, pauseSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;
  
  // State for loading songs
  const [loadingSongId, setLoadingSongId] = useState<string | null>(null);
  const [songCache, setSongCache] = useState<Record<string, any>>({});

  // Handle play button click
  const handlePlayClick = useCallback(async (track: { id: string; title: string; duration: string }) => {
    // If this song is currently playing, pause it
    if (currentSong?.songId === track.id && isPlaying) {
      pauseSong();
      return;
    }
    
    // If we already have this song cached, play it
    if (songCache[track.id]) {
      playSong(songCache[track.id]);
      return;
    }
    
    // Fetch the song metadata with audio URL (using public endpoint - no auth required)
    setLoadingSongId(track.id);
    try {
      const response = await songsApi.getPublicSampleSongs(SEED_SONGS_USER_ID, [track.id]);
      const songs = response.data?.songs || [];
      
      if (songs.length > 0 && songs[0].audioUrl) {
        const song = {
          songId: songs[0].songId,
          songTitle: songs[0].songTitle,
          genre: songs[0].genre,
          audioUrl: songs[0].audioUrl,
          status: songs[0].status,
          createdAt: songs[0].createdAt,
          duration: songs[0].actualDuration,
        };
        
        // Cache the song
        setSongCache(prev => ({ ...prev, [track.id]: song }));
        
        // Play it
        playSong(song);
      } else {
        console.error('Song not found or no audio URL');
      }
    } catch (error) {
      console.error('Error fetching song:', error);
    } finally {
      setLoadingSongId(null);
    }
  }, [currentSong, isPlaying, playSong, pauseSong, songCache]);

  // Handle create button click - navigate to create page or login
  const handleCreateClick = () => {
    if (user?.userId) {
      navigate('/create?tab=song');
    } else {
      navigate('/login');
    }
  };

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
        ogUrl={`https://gruvi.ai/moods/${currentMood.id}`}
        twitterTitle={`Create ${currentMood.name} Music with AI | Gruvi`}
        twitterDescription={currentMood.description}
        structuredData={[
          createBreadcrumbStructuredData(breadcrumbData),
          createMusicPlaylistStructuredData({
            name: `${currentMood.name} Music by Gruvi`,
            description: `AI-generated ${currentMood.name} music samples created with Gruvi.`,
            url: `https://gruvi.ai/moods/${currentMood.id}`,
            tracks: sampleTracks.map(track => ({
              name: track.title,
              duration: `PT${track.duration.replace(':', 'M')}S`,
            })),
          }),
        ]}
      />

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
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
            onClick={handleCreateClick}
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
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              Example {currentMood.name} Tracks
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
              AI-generated {currentMood.name.toLowerCase()} music samples
            </Typography>
          </Box>

          <ScrollableCarousel id="sample-tracks">
            {sampleTracks.map((track) => (
              <Paper
                key={track.id}
                elevation={0}
                onClick={() => handlePlayClick(track)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  minWidth: 260,
                  width: 280,
                  flexShrink: 0,
                  background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.08)' : '#fff',
                  borderRadius: '12px',
                  border: currentSong?.songId === track.id ? '1px solid rgba(0,122,255,0.3)' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  },
                  '&:hover .play-overlay': {
                    opacity: 1,
                  },
                }}
              >
                {/* Album Art */}
                <Box
                  sx={{
                    position: 'relative',
                    width: 48,
                    height: 48,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <Box
                    component="img"
                    src={currentMood.image}
                    alt={track.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Play overlay */}
                  <Box
                    className="play-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.4)' : 'rgba(0,0,0,0.4)',
                      opacity: currentSong?.songId === track.id ? 1 : 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {loadingSongId === track.id ? (
                      <CircularProgress size={14} sx={{ color: '#fff' }} />
                    ) : currentSong?.songId === track.id && isPlaying ? (
                      <AudioEqualizer isPlaying={true} size={20} color="#fff" />
                    ) : (
                      <PlayArrowRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
                    )}
                  </Box>
                </Box>

                {/* Track Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: currentSong?.songId === track.id ? '#007AFF' : '#1D1D1F',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {track.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#86868B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {currentMood.name}
                  </Typography>
                </Box>

                {/* Duration */}
                <Typography sx={{ fontSize: '0.75rem', color: '#86868B', flexShrink: 0 }}>
                  {track.duration}
                </Typography>
              </Paper>
            ))}
          </ScrollableCarousel>
        </Box>

        {/* Related Moods */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              Explore More Moods
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
              Music that captures every emotion
            </Typography>
          </Box>
          <ScrollableCarousel id="related-moods-carousel">
            {moodData.filter(m => m.id !== moodId).slice(0, 12).map((mood) => (
              <Box 
                key={mood.id}
                onClick={() => navigate(`/moods/${mood.id}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  minWidth: { xs: 85, sm: 100 },
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                  '&:hover .mood-circle': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
                }}
              >
                <Box
                  className="mood-circle"
                  sx={{
                    width: { xs: 72, sm: 88 },
                    height: { xs: 72, sm: 88 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    p: 0.5,
                    background: '#fff',
                  }}
                >
                  <Box
                    component="img"
                    src={mood.image}
                    alt={mood.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                </Box>
                <Typography sx={{ color: '#1D1D1F', fontWeight: 600, fontSize: '0.8rem', textAlign: 'center' }}>
                  {mood.name}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Box>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
            Ready to Create Your Own {currentMood.name} Track?
          </Typography>
          <Typography sx={{ color: '#86868B', mb: 3, fontSize: '1rem' }}>
            Sign up for Gruvi and start generating professional {currentMood.name} music in seconds.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            sx={{
              background: '#007AFF',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
              '&:hover': {
                background: '#0066DD',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0,122,255,0.4)',
              },
            }}
          >
            {user?.userId ? 'Create Music' : 'Get Started Free'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MoodDetailPage;

