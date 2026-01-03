import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Chip,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrowRounded,
  Pause,
  Download,
  MusicNote,
  Share,
  AccessTime,
  CalendarToday,
  Delete,
} from '@mui/icons-material';
import { RootState } from '../store/store';
import { songsApi } from '../services/api';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

// Platform SVG icons
// Platform icons - using proper branded icons
const PlatformIcons = {
  // SoundCloud - cloud with sound waves
  soundcloud: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path fill="#FF5500" d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.054-.048-.1-.099-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.226-1.308-.226-1.332c-.01-.057-.045-.094-.099-.094m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.104.106.104.061 0 .12-.044.12-.104l.24-2.458-.24-2.563c0-.06-.059-.104-.12-.104m.944-.424c-.074 0-.135.061-.15.135l-.194 2.841.194 2.59c.015.074.076.135.15.135.074 0 .135-.061.15-.135l.21-2.59-.21-2.841c-.015-.074-.076-.135-.15-.135m.976-.164c-.09 0-.165.075-.165.164l-.18 3.005.18 2.59c0 .09.075.165.165.165.09 0 .165-.075.165-.165l.195-2.59-.195-3.005c0-.089-.075-.164-.165-.164m1.005-.067c-.105 0-.18.074-.195.18l-.165 3.072.165 2.576c.015.105.09.179.195.179.106 0 .18-.074.195-.18l.181-2.575-.181-3.071c-.015-.106-.09-.181-.195-.181m1.02-.032c-.12 0-.21.089-.225.21l-.15 3.104.15 2.56c.015.12.105.21.225.21.12 0 .21-.09.225-.21l.165-2.56-.165-3.104c-.015-.121-.105-.21-.225-.21m1.035.045c-.135 0-.225.105-.24.24l-.135 3.059.135 2.536c.015.135.105.24.24.24.136 0 .226-.105.24-.24l.15-2.536-.15-3.059c-.014-.135-.104-.24-.24-.24m1.049.12c-.149 0-.255.118-.27.27l-.119 2.939.119 2.521c.015.15.121.27.27.27.151 0 .256-.12.271-.27l.134-2.521-.134-2.939c-.015-.152-.12-.27-.271-.27m1.064.149c-.165 0-.285.134-.299.3l-.105 2.791.105 2.505c.014.165.134.3.299.3.165 0 .285-.135.301-.3l.118-2.505-.118-2.791c-.015-.166-.135-.3-.301-.3m1.065.149c-.179 0-.3.149-.314.33l-.091 2.641.091 2.491c.014.179.135.33.314.33.18 0 .301-.151.315-.33l.104-2.491-.104-2.641c-.014-.181-.135-.33-.315-.33m1.079.135c-.194 0-.33.165-.345.36l-.075 2.506.075 2.476c.015.195.151.361.345.361.195 0 .33-.166.345-.361l.09-2.476-.09-2.506c-.015-.195-.15-.36-.345-.36m1.065-.165c-.21 0-.36.181-.375.39l-.061 2.671.061 2.461c.015.211.165.391.375.391.211 0 .361-.18.376-.391l.074-2.461-.074-2.671c-.015-.209-.165-.39-.376-.39m1.08-.24c-.225 0-.391.193-.405.42l-.046 2.911.046 2.445c.014.225.18.42.405.42.226 0 .391-.195.406-.42l.059-2.445-.059-2.911c-.015-.227-.18-.42-.406-.42m1.095.18c-.24 0-.42.194-.435.435l-.031 2.73.031 2.432c.015.24.195.434.435.434.241 0 .42-.194.436-.434l.044-2.432-.044-2.73c-.015-.241-.195-.435-.436-.435m1.634-.406c-.404 0-.705-.301-.705-.705V8.324c0-.405.301-.705.705-.705.646 0 1.232.159 1.772.477.54.318.972.764 1.291 1.339.317.574.476 1.209.476 1.904 0 .694-.159 1.329-.476 1.903-.319.575-.751 1.021-1.291 1.339-.54.319-1.126.477-1.772.477m4.484 1.128c-.555 0-1.058-.146-1.509-.439-.45-.292-.805-.695-1.064-1.209-.26-.514-.389-1.089-.389-1.726 0-.637.129-1.212.389-1.726.259-.514.614-.917 1.064-1.209.451-.293.954-.439 1.509-.439.555 0 1.058.146 1.509.439.45.292.805.695 1.064 1.209.26.514.389 1.089.389 1.726 0 .637-.129 1.212-.389 1.726-.259.514-.614.917-1.064 1.209-.451.293-.954.439-1.509.439"/>
    </svg>
  ),
  // Spotify - circle with sound waves
  spotify: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path fill="#1DB954" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  ),
  // Apple Music - music note (proper Apple style)
  appleMusic: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <path fill="#FC3C44" d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.99c-.042.003-.083.01-.124.013-.5.032-1 .08-1.49.18-.628.13-1.218.374-1.752.732-1.124.702-1.89 1.68-2.21 3-.17.72-.24 1.45-.25 2.19-.01.32-.02.638-.02.957v9.905c.003.3.01.6.02.9.02.67.07 1.33.21 1.98.27 1.25.92 2.25 1.93 3.02.53.41 1.14.697 1.8.897.53.15 1.07.23 1.62.27.43.03.86.05 1.29.05h10.17c.26 0 .52-.003.79-.01.5-.01 1-.05 1.5-.13.633-.11 1.23-.33 1.79-.66 1.01-.59 1.76-1.43 2.25-2.52.23-.517.38-1.06.463-1.62.047-.33.07-.66.09-.99.01-.4.02-.81.02-1.22V7.34c-.003-.398-.017-.797-.047-1.197l-.02-.02zM17.88 12.56l-5.27 1.01v5.43c0 .42-.01.84-.05 1.26-.04.37-.14.72-.35 1.03a1.88 1.88 0 01-1.12.79c-.27.08-.55.12-.83.16-.5.06-.99.06-1.44-.12a1.72 1.72 0 01-1.08-1.03 1.7 1.7 0 01-.1-.98c.07-.51.3-.94.68-1.28.35-.31.77-.5 1.21-.61.44-.11.89-.18 1.33-.26.3-.05.6-.11.88-.21.35-.12.55-.38.6-.75.01-.06.01-.12.01-.18V9.47c0-.13.02-.26.07-.38.09-.23.28-.35.53-.39.2-.04.4-.07.6-.11l4.49-.87c.41-.08.82-.16 1.23-.23.23-.04.35.07.37.3.003.05.003.1.003.15v4.5c0 .07-.01.15-.02.22l.02-.1z"/>
    </svg>
  ),
  // YouTube Music - play button in circle
  youtubeMusic: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <circle cx="12" cy="12" r="12" fill="#FF0000"/>
      <path fill="#fff" d="M9.5 16.5v-9l7 4.5-7 4.5z"/>
    </svg>
  ),
  // Amazon Music - text style logo simplified as music note with smile
  amazonMusic: (
    <svg viewBox="0 0 24 24" width="22" height="22">
      <rect width="24" height="24" rx="4" fill="#25D1DA"/>
      <path fill="#232F3E" d="M17 7h-4v7.55c-.47-.34-1.02-.55-1.62-.55-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V10h2.62V7z"/>
      <path fill="#232F3E" d="M6 18.5c0 .28.22.5.5.5h11c.28 0 .5-.22.5-.5s-.22-.5-.5-.5c-2.5 0-4-1-5.5-2-1.5 1-3 2-5.5 2-.28 0-.5.22-.5.5z"/>
    </svg>
  ),
};

// Distribution platforms
const distributionPlatforms = [
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: PlatformIcons.soundcloud,
    color: '#FF5500',
    available: false,
    comingSoon: true,
    description: 'Coming soon',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: PlatformIcons.spotify,
    color: '#1DB954',
    available: false,
    comingSoon: true,
    description: 'Coming soon',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    icon: PlatformIcons.appleMusic,
    color: '#FA233B',
    available: false,
    comingSoon: true,
    description: 'Coming soon',
  },
  {
    id: 'youtube-music',
    name: 'YouTube Music',
    icon: PlatformIcons.youtubeMusic,
    color: '#FF0000',
    available: false,
    comingSoon: true,
    description: 'Coming soon',
  },
  {
    id: 'amazon-music',
    name: 'Amazon Music',
    icon: PlatformIcons.amazonMusic,
    color: '#25D1DA',
    available: false,
    comingSoon: true,
    description: 'Coming soon',
  },
];

// Genre to image mapping
const genreImages: Record<string, string> = {
  'pop': '/genres/pop.jpeg',
  'hip hop': '/genres/hip-hop.jpeg',
  'hip-hop': '/genres/hip-hop.jpeg',
  'r&b': '/genres/rnb.jpeg',
  'rnb': '/genres/rnb.jpeg',
  'electronic': '/genres/electronic.jpeg',
  'dance': '/genres/dance.jpeg',
  'house': '/genres/house.jpeg',
  'tropical house': '/genres/chillout.jpeg',
  'tropical-house': '/genres/chillout.jpeg',
  'edm': '/genres/edm.jpeg',
  'techno': '/genres/techno.jpeg',
  'rock': '/genres/rock.jpeg',
  'alternative': '/genres/alternative.jpeg',
  'indie': '/genres/indie.jpeg',
  'punk': '/genres/punk.jpeg',
  'metal': '/genres/metal.jpeg',
  'jazz': '/genres/jazz.jpeg',
  'blues': '/genres/blues.jpeg',
  'soul': '/genres/soul.jpeg',
  'funk': '/genres/funk.jpeg',
  'classical': '/genres/classic.jpeg',
  'orchestral': '/genres/orchestral.jpeg',
  'cinematic': '/genres/cinematic.jpeg',
  'country': '/genres/country.jpeg',
  'folk': '/genres/folk.jpeg',
  'acoustic': '/genres/acoustic.jpeg',
  'latin': '/genres/latin.jpeg',
  'reggaeton': '/genres/raggaeton.jpeg',
  'k-pop': '/genres/kpop.jpeg',
  'kpop': '/genres/kpop.jpeg',
  'j-pop': '/genres/jpop.jpeg',
  'jpop': '/genres/jpop.jpeg',
  'reggae': '/genres/raggae.jpeg',
  'lo-fi': '/genres/lofi.jpeg',
  'lofi': '/genres/lofi.jpeg',
  'ambient': '/genres/ambient.jpeg',
  'gospel': '/genres/gospels.jpeg',
};

// Mood to image mapping
const moodImages: Record<string, string> = {
  'happy': '/moods/happy.jpeg',
  'sad': '/moods/sad.jpeg',
  'energetic': '/moods/energetic.jpeg',
  'romantic': '/moods/romantic.jpeg',
  'chill': '/moods/chill.jpeg',
  'calm': '/moods/chill.jpeg',
  'epic': '/moods/epic.jpeg',
  'dreamy': '/moods/dreamy.jpeg',
  'dark': '/moods/dark.jpeg',
  'uplifting': '/moods/uplifting.jpeg',
  'nostalgic': '/moods/nostalgic.jpeg',
  'peaceful': '/moods/peacful.jpeg',
  'intense': '/moods/intense.jpeg',
  'melancholic': '/moods/melancholic.jpeg',
  'playful': '/moods/playful.jpeg',
  'mysterious': '/moods/mysterious.jpeg',
  'triumphant': '/moods/triumphant.jpeg',
  'promotional': '/moods/promotional.jpeg',
  'angry': '/moods/intense.jpeg',
  'party': '/moods/energetic.jpeg',
  'motivational': '/moods/uplifting.jpeg',
};

// Helper to get image URL for genre/mood
const getGenreImage = (genre: string): string | null => {
  const key = genre.toLowerCase();
  return genreImages[key] || null;
};

const getMoodImage = (mood: string): string | null => {
  const key = mood.toLowerCase();
  return moodImages[key] || null;
};

interface SongData {
  songId: string;
  songTitle?: string;
  artist?: string;
  album?: string;
  genre?: string;
  mood?: string;
  lyrics?: string;
  lyricsRaw?: string;
  audioUrl?: string;
  coverUrl?: string;
  description?: string;
  actualDuration?: number;
  createdAt: string;
  status: string;
  isUserUpload?: boolean;
}

const TrackDetailPage: React.FC = () => {
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Global audio player
  const { 
    currentSong, 
    isPlaying: globalIsPlaying, 
    playSong,
    togglePlayPause,
  } = useAudioPlayer();
  
  const [songData, setSongData] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if current song is the one being viewed
  const isCurrentSong = currentSong?.songId === songId;
  const isPlaying = isCurrentSong && globalIsPlaying;
  
  // Upload state (for future use)
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  
  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      if (!user?.userId || !songId) return;
      
      try {
        setLoading(true);
        const response = await songsApi.getSong(user.userId, songId);
        setSongData(response.data.song || response.data);
      } catch (err: any) {
        console.error('Failed to fetch song:', err);
        setError(err.response?.data?.error || 'Failed to load track');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSong();
  }, [user?.userId, songId]);
  
  const handlePlayPause = useCallback(() => {
    if (!songData?.audioUrl) return;
    
    if (isCurrentSong) {
      // Toggle the global player
      togglePlayPause();
    } else {
      // Start playing this song in the global player
      playSong({
        songId: songData.songId,
        songTitle: songData.songTitle || 'Untitled Track',
        genre: songData.genre || '',
        audioUrl: songData.audioUrl,
        status: songData.status,
        createdAt: songData.createdAt,
        duration: songData.actualDuration,
        lyrics: songData.lyrics,
      });
    }
  }, [songData, isCurrentSong, togglePlayPause, playSong]);
  
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  
  const handleDownload = async () => {
    if (!songData?.audioUrl) return;
    
    try {
      const response = await fetch(songData.audioUrl, {
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!response.ok) throw new Error('Failed to fetch audio');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${songData.songTitle || 'track'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };
  
  const handleGoBack = useCallback(() => {
    navigate('/my-library?tab=songs');
  }, [navigate]);
  
  const handleDelete = useCallback(async () => {
    if (!user?.userId || !songId) return;
    
    setIsDeleting(true);
    try {
      await songsApi.deleteSong(user.userId, songId);
      setShowDeleteDialog(false);
      // Navigate back to library after successful deletion
      navigate('/my-library?tab=songs');
    } catch (err: any) {
      console.error('Failed to delete track:', err);
      setUploadError(err.response?.data?.error || 'Failed to delete track');
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  }, [user?.userId, songId, navigate]);
  
  // Compute genre image URL for non-user-uploaded songs without cover art
  const genreImageUrl = useMemo(() => {
    if (!songData?.genre) return null;
    const genre = songData.genre.toLowerCase().replace(/\s+/g, '-');
    // Handle filename mismatches
    const genreFileMap: Record<string, string> = {
      'r&b': 'rnb',
      'rnb': 'rnb',
      'reggaeton': 'raggaeton',
      'reggae': 'raggae',
      'classical': 'classic',
      'gospel': 'gospels',
      'tropical-house': 'chillout',
      'chill': 'chillout',
      'chillout': 'chillout',
    };
    const fileName = genreFileMap[genre] || genre;
    return `/genres/${fileName}.jpeg`;
  }, [songData?.genre]);
  
  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f7',
        }}
      >
        <CircularProgress sx={{ color: '#007AFF', mb: 2 }} size={48} />
        <Typography sx={{ color: '#1d1d1f' }}>Loading track...</Typography>
      </Box>
    );
  }
  
  // Error state
  if (error || !songData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f7',
        }}
      >
        <Typography variant="h6" sx={{ color: '#FF3B30', mb: 2 }}>
          {error || 'Track not found'}
        </Typography>
        <Button 
          onClick={handleGoBack} 
          startIcon={<ArrowBack />}
          sx={{ color: '#007AFF' }}
        >
          Back to Library
        </Button>
      </Box>
    );
  }

  const displayDuration = songData.actualDuration || 0;
  
  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f7', pb: 16 }}>
      {/* Header */}
      <Box
        sx={{
          background: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handleGoBack} sx={{ color: '#007AFF' }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1d1d1f' }}>
                {songData.songTitle || 'Track'}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pt: 3 }}>
        {/* Track Info - Spotify Style */}
        <Box sx={{ mb: 4 }}>
          {/* Top Section: Cover Art + Track Info - Always horizontal */}
          <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2.5 }, mb: 2 }}>
          {/* Cover Art / Genre Art / Placeholder */}
          <Box
            sx={{
              width: { xs: 100, sm: 140 },
              height: { xs: 100, sm: 140 },
              borderRadius: '8px',
              background: songData.coverUrl 
                ? `url(${songData.coverUrl}) center/cover`
                : genreImageUrl
                  ? `url(${genreImageUrl}) center/cover`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            {!songData.coverUrl && !genreImageUrl && (
              <MusicNote sx={{ fontSize: { xs: 36, sm: 48 }, color: 'rgba(255,255,255,0.6)' }} />
            )}
          </Box>
          
          {/* Track Details */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minWidth: 0 }}>
            {/* Tags */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.5 }}>
              {songData.genre && (
                <Chip 
                  label={songData.genre}
                  size="small"
                  avatar={
                    getGenreImage(songData.genre) ? (
                      <Box
                        component="img"
                        src={getGenreImage(songData.genre)!}
                        alt={songData.genre}
                        sx={{ 
                          width: { xs: 14, sm: 18 }, 
                          height: { xs: 14, sm: 18 }, 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          ml: '2px !important',
                        }}
                      />
                    ) : undefined
                  }
                  sx={{ 
                    height: { xs: 20, sm: 24 }, 
                    fontSize: { xs: '0.6rem', sm: '0.7rem' }, 
                    background: 'rgba(0,122,255,0.1)', 
                    color: '#007AFF',
                    '& .MuiChip-avatar': { ml: 0.5 },
                  }}
                />
              )}
              {songData.mood && (
                <Chip 
                  label={songData.mood}
                  size="small"
                  avatar={
                    getMoodImage(songData.mood) ? (
                      <Box
                        component="img"
                        src={getMoodImage(songData.mood)!}
                        alt={songData.mood}
                        sx={{ 
                          width: { xs: 14, sm: 18 }, 
                          height: { xs: 14, sm: 18 }, 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          ml: '2px !important',
                        }}
                      />
                    ) : undefined
                  }
                  sx={{ 
                    height: { xs: 20, sm: 24 }, 
                    fontSize: { xs: '0.6rem', sm: '0.7rem' }, 
                    background: 'rgba(88,86,214,0.1)', 
                    color: '#5856D6',
                    '& .MuiChip-avatar': { ml: 0.5 },
                  }}
                />
              )}
              {songData.isUserUpload && (
                <Chip label="Uploaded" size="small" sx={{ height: { xs: 20, sm: 24 }, fontSize: { xs: '0.6rem', sm: '0.7rem' } }} color="primary" variant="outlined" />
              )}
            </Box>
            
            {/* Title */}
            <Typography 
              sx={{ 
                fontWeight: 800, 
                color: '#1d1d1f', 
                mb: 0.25, 
                lineHeight: 1.2,
                fontSize: { xs: '1.1rem', sm: '1.5rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {songData.songTitle || 'Untitled Track'}
            </Typography>
            
            {/* Artist + Duration + Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexWrap: 'wrap' }}>
              {songData.artist && (
                <>
                  <Typography sx={{ color: '#1d1d1f', fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {songData.artist}
                  </Typography>
                  <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>•</Typography>
                </>
              )}
              {displayDuration > 0 && (
                <>
                  <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {formatTime(displayDuration)}
                  </Typography>
                  <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>•</Typography>
                </>
              )}
              <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {formatDate(songData.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Action Buttons - Below like Spotify */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Play Button - Icon on xs/sm, full button on md+ */}
          <IconButton
            onClick={handlePlayPause}
            sx={{
              display: { xs: 'flex', md: 'none' },
              bgcolor: '#007AFF',
              color: '#fff',
              width: 36,
              height: 36,
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              '&:hover': { bgcolor: '#0066CC' },
            }}
          >
            {isPlaying ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', height: 16 }}>
                {[0.6, 1, 0.4, 0.8, 0.5].map((h, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 2,
                      height: `${h * 100}%`,
                      bgcolor: '#fff',
                      borderRadius: '1px',
                      animation: 'equalizer 0.5s ease-in-out infinite alternate',
                      animationDelay: `${i * 0.1}s`,
                      '@keyframes equalizer': {
                        '0%': { height: `${h * 50}%` },
                        '100%': { height: `${h * 100}%` },
                      },
                    }}
                  />
                ))}
              </Box>
            ) : <PlayArrowRounded sx={{ fontSize: 18 }} />}
          </IconButton>
          <Button
            onClick={handlePlayPause}
            variant="contained"
            startIcon={isPlaying ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', height: 18 }}>
                {[0.6, 1, 0.4, 0.8, 0.5].map((h, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 3,
                      height: `${h * 100}%`,
                      bgcolor: '#fff',
                      borderRadius: '1px',
                      animation: 'equalizer 0.5s ease-in-out infinite alternate',
                      animationDelay: `${i * 0.1}s`,
                      '@keyframes equalizer': {
                        '0%': { height: `${h * 50}%` },
                        '100%': { height: `${h * 100}%` },
                      },
                    }}
                  />
                ))}
              </Box>
            ) : <PlayArrowRounded sx={{ fontSize: 20 }} />}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              bgcolor: '#007AFF',
              color: '#fff',
              borderRadius: '10px',
              px: 2,
              py: 0.75,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              '&:hover': { bgcolor: '#0066CC' },
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          {/* Download Button - Icon on xs/sm, full button on md+ */}
          <IconButton
            onClick={handleDownload}
            disabled={!songData.audioUrl}
            sx={{
              display: { xs: 'flex', md: 'none' },
              border: '1px solid rgba(0,0,0,0.15)',
              color: '#007AFF',
              width: 36,
              height: 36,
              '&:hover': { borderColor: '#007AFF', bgcolor: 'rgba(0,122,255,0.05)' },
              '&:disabled': { opacity: 0.4 },
            }}
          >
            <Download sx={{ fontSize: 18 }} />
          </IconButton>
          <Button
            onClick={handleDownload}
            disabled={!songData.audioUrl}
            variant="outlined"
            startIcon={<Download sx={{ fontSize: 20, color: '#007AFF' }} />}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              color: '#007AFF !important',
              borderColor: 'rgba(0,0,0,0.15)',
              borderRadius: '10px',
              px: 2,
              py: 0.75,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              '& .MuiButton-startIcon': { color: '#007AFF' },
              '& .MuiSvgIcon-root': { color: '#007AFF' },
              '&:hover': { borderColor: '#007AFF', bgcolor: 'rgba(0,122,255,0.05)' },
              '&:disabled': { opacity: 0.4, color: '#007AFF !important' },
            }}
          >
            Download
          </Button>
          
          {/* Delete Button - Icon on xs/sm, full button on md+ */}
          <IconButton
            onClick={() => setShowDeleteDialog(true)}
            sx={{
              display: { xs: 'flex', md: 'none' },
              border: '1px solid rgba(255,59,48,0.3)',
              color: '#FF3B30',
              width: 36,
              height: 36,
              '&:hover': { borderColor: '#FF3B30', bgcolor: 'rgba(255,59,48,0.05)' },
            }}
          >
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="outlined"
            startIcon={<Delete sx={{ fontSize: 20, color: '#FF3B30' }} />}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              color: '#FF3B30 !important',
              borderColor: 'rgba(255,59,48,0.3)',
              borderRadius: '10px',
              px: 2,
              py: 0.75,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              '& .MuiButton-startIcon': { color: '#FF3B30' },
              '& .MuiSvgIcon-root': { color: '#FF3B30' },
              '&:hover': { borderColor: '#FF3B30', bgcolor: 'rgba(255,59,48,0.05)' },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
          
        {/* Share to Platforms - Below Track Info */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <Share sx={{ fontSize: 22, color: '#FF5500' }} />
            <Typography sx={{ fontWeight: 600, color: '#1d1d1f', fontSize: '1.1rem' }}>
              Share to Platforms
            </Typography>
          </Box>
          
          {/* Alerts */}
          {uploadError && (
            <Alert severity="error" onClose={() => setUploadError(null)} sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}
          {uploadSuccess && (
            <Alert severity="success" onClose={() => setUploadSuccess(null)} sx={{ mb: 2 }}>
              {uploadSuccess}
            </Alert>
          )}
          
          {/* Platform Selection - Wrapped in Paper */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              p: { xs: 2, sm: 2.5 },
              mb: 2,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Typography sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2, fontSize: '0.95rem' }}>
              Select Platforms
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
              {distributionPlatforms.map((platform) => (
                <Box
                  key={platform.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: 'rgba(0,0,0,0.02)',
                    opacity: 0.5,
                  }}
                >
                  <Box sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: '10px', 
                    background: `${platform.color}15`,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                  }}>
                    {platform.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#86868B', fontSize: '0.9rem' }}>
                      {platform.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#007AFF', fontWeight: 500 }}>
                      Coming Soon
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            
            {/* Info Note */}
            <Box sx={{ p: 2, background: 'rgba(0,122,255,0.05)', borderRadius: '10px' }}>
              <Typography variant="body2" sx={{ color: '#007AFF' }}>
                <strong>💡 Coming Soon:</strong> Direct distribution to all major music platforms. 
                Stay tuned!
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={showDeleteDialog} 
        onClose={() => !isDeleting && setShowDeleteDialog(false)}
        PaperProps={{
          sx: { 
            borderRadius: '24px', 
            p: 3,
            maxWidth: 400,
            mx: 2,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: '50%', 
            bgcolor: 'rgba(255,59,48,0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Delete sx={{ fontSize: 24, color: '#FF3B30' }} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            Delete Song?
          </Typography>
        </Box>
        
        <Typography sx={{ color: '#666', mb: 3, lineHeight: 1.6 }}>
          Are you sure you want to delete "<strong>{songData?.songTitle || 'this song'}</strong>"? This action cannot be undone.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button 
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
            fullWidth
            sx={{ 
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              fontSize: '1rem',
              color: '#1d1d1f',
              border: '1px solid rgba(0,0,0,0.15)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#007AFF',
              borderRadius: '100px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              fontSize: '1rem',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#0066DD', boxShadow: 'none' },
              '&:disabled': { bgcolor: '#007AFF', opacity: 0.7 },
            }}
          >
            {isDeleting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TrackDetailPage;
