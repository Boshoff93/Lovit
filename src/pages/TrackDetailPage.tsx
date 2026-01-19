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

// Distribution platforms with PNG icons
const distributionPlatforms = [
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    iconSrc: '/music-apps/sound.png',
    color: '#FF5500',
    available: false,
    comingSoon: true,
    description: 'Coming soon',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    iconSrc: '/music-apps/spotify.png',
    color: '#1DB954',
    available: false,
    comingSoon: true,
    description: 'Coming soon',
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    iconSrc: '/music-apps/apple.png',
    color: '#FA233B',
    available: false,
    comingSoon: true,
    description: 'Coming soon',
  },
  {
    id: 'youtube-music',
    name: 'YouTube Music',
    iconSrc: '/music-apps/youtube.png',
    color: '#FF0000',
    available: false,
    comingSoon: true,
    description: 'Coming soon',
  },
  {
    id: 'amazon-music',
    name: 'Amazon Music',
    iconSrc: '/music-apps/amazon.png',
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
    navigate('/my-music');
  }, [navigate]);
  
  const handleDelete = useCallback(async () => {
    if (!user?.userId || !songId) return;
    
    setIsDeleting(true);
    try {
      await songsApi.deleteSong(user.userId, songId);
      setShowDeleteDialog(false);
      // Navigate back to library after successful deletion
      navigate('/my-music');
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
                  <Box
                    component="img"
                    src={platform.iconSrc}
                    alt={platform.name}
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: '8px',
                      objectFit: 'contain',
                    }}
                  />
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
            borderRadius: 3,
            p: 1,
            minWidth: 340,
            bgcolor: '#1D1D1F',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: 'rgba(255,59,48,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Delete sx={{ fontSize: 24, color: '#FF3B30' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
            Delete Song?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Are you sure you want to delete "<strong style={{ color: '#fff' }}>{songData?.songTitle || 'this song'}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
            variant="outlined"
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              borderColor: '#3B82F6',
              color: '#fff',
              '&:hover': {
                borderColor: '#3B82F6',
                backgroundColor: 'transparent',
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)',
              },
              '&:disabled': {
                borderColor: 'rgba(59, 130, 246, 0.3)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="contained"
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)',
              boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E53528 0%, #FF5252 100%)',
                boxShadow: '0 6px 16px rgba(255, 59, 48, 0.4)',
              },
              '&:disabled': { opacity: 0.7 },
            }}
          >
            {isDeleting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrackDetailPage;
