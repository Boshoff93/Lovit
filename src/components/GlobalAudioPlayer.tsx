import React, { useState, useCallback } from 'react';
import { Box, Typography, IconButton, Slider } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CloseIcon from '@mui/icons-material/Close';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

// Genre to image mapping
const genreImages: Record<string, string> = {
  'pop': '/genres/pop.jpeg',
  'rock': '/genres/rock.jpeg',
  'hip-hop': '/genres/hip-hop.jpeg',
  'jazz': '/genres/jazz.jpeg',
  'classical': '/genres/classic.jpeg',
  'electronic': '/genres/electronic.jpeg',
  'country': '/genres/country.jpeg',
  'r&b': '/genres/rnb.jpeg',
  'rnb': '/genres/rnb.jpeg',
  'folk': '/genres/folk.jpeg',
  'blues': '/genres/blues.jpeg',
  'reggae': '/genres/raggae.jpeg',
  'latin': '/genres/latin.jpeg',
  'metal': '/genres/metal.jpeg',
  'punk': '/genres/punk.jpeg',
  'indie': '/genres/indie.jpeg',
  'alternative': '/genres/alternative.jpeg',
  'soul': '/genres/soul.jpeg',
  'funk': '/genres/funk.jpeg',
  'disco': '/genres/disco.jpeg',
  'house': '/genres/house.jpeg',
  'techno': '/genres/techno.jpeg',
  'ambient': '/genres/ambient.jpeg',
  'lofi': '/genres/lofi.jpeg',
  // Additional genres
  'dance': '/genres/dance.jpeg',
  'edm': '/genres/edm.jpeg',
  'cinematic': '/genres/cinematic.jpeg',
  'orchestral': '/genres/orchestral.jpeg',
  'reggaeton': '/genres/raggaeton.jpeg',
  'kpop': '/genres/kpop.jpeg',
  'jpop': '/genres/jpop.jpeg',
  'chillout': '/genres/chillout.jpeg',
  'chill': '/genres/chillout.jpeg',
  'tropical-house': '/genres/chillout.jpeg',
  'gospel': '/genres/gospels.jpeg',
  'acoustic': '/genres/acoustic.jpeg',
};

const getGenreImage = (genre: string): string => {
  const normalizedGenre = genre?.toLowerCase().trim() || '';
  return genreImages[normalizedGenre] || '/genres/pop.jpeg';
};

// Animated Equalizer Component
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

// Format time helper
const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const GlobalAudioPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    closePlayer,
  } = useAudioPlayer();

  const [localProgress, setLocalProgress] = useState<number | null>(null);

  const handleSliderChange = useCallback((_event: Event, value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setLocalProgress(newValue);
  }, []);

  const handleSliderChangeCommitted = useCallback((_event: React.SyntheticEvent | Event, value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setLocalProgress(newValue);
    seekTo(newValue);
    // Clear local override after a short delay to let audio catch up
    setTimeout(() => setLocalProgress(null), 300);
  }, [seekTo]);

  if (!currentSong) {
    return null;
  }

  // Use local progress while dragging/seeking, otherwise use actual progress
  const displayProgress = localProgress !== null ? localProgress : progress;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        // On mobile: full width. On desktop (md+): start after sidebar
        left: { xs: 0, md: 240 },
        right: 0,
        zIndex: 1300,
        background: '#fff',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        px: { xs: 2, sm: 3 },
        py: 1.5,
      }}
    >
      <Box sx={{ maxWidth: 'lg', mx: 'auto', display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, width: '100%' }}>
        {/* Song Icon with Genre Image and Equalizer */}
        <Box
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            borderRadius: '12px',
            background: '#1D1D1F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Genre Background Image */}
          <Box
            component="img"
            src={getGenreImage(currentSong.genre || '')}
            alt={currentSong.genre}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Dark overlay for better equalizer visibility */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.4)',
            }}
          />
          {/* Equalizer overlay */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <AudioEqualizer isPlaying={isPlaying} size={20} color="#fff" />
          </Box>
        </Box>

        {/* Song Info */}
        <Box sx={{ minWidth: 0, maxWidth: { xs: 100, sm: 200 }, flexShrink: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#1D1D1F',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            {currentSong.songTitle}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#86868B', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
          >
            {currentSong.genre}
          </Typography>
        </Box>

        {/* Progress Slider - Full version for md+ screens */}
        <Box 
          sx={{ 
            flex: 1, 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 1.5,
            minWidth: 0,
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#86868B', 
              minWidth: 36,
              fontVariantNumeric: 'tabular-nums',
              textAlign: 'right',
              lineHeight: 1,
            }}
          >
            {formatTime(displayProgress)}
          </Typography>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Slider
              value={displayProgress}
              min={0}
              max={duration || 100}
              onChange={handleSliderChange}
              onChangeCommitted={handleSliderChangeCommitted}
              sx={{
                color: '#007AFF',
                height: 4,
                '& .MuiSlider-track': {
                  border: 'none',
                  background: 'linear-gradient(90deg, #007AFF, #5AC8FA)',
                },
                '& .MuiSlider-rail': {
                  opacity: 1,
                  backgroundColor: 'rgba(0,0,0,0.08)',
                },
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  backgroundColor: '#fff',
                  border: '2px solid #007AFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:before': {
                    display: 'none',
                  },
                  '&:hover, &.Mui-focusVisible, &.Mui-active': {
                    boxShadow: '0 2px 10px rgba(0,122,255,0.25)',
                  },
                },
              }}
            />
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#86868B', 
              minWidth: 36,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {formatTime(duration)}
          </Typography>
        </Box>

        {/* Compact Progress Slider - for small screens only */}
        <Box 
          sx={{ 
            flex: 1, 
            display: { xs: 'flex', md: 'none' }, 
            alignItems: 'center', 
            gap: 0.5,
            minWidth: 0,
          }}
        >
          <Slider
            value={displayProgress}
            min={0}
            max={duration || 100}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
            sx={{
              color: '#007AFF',
              height: 3,
              py: 1,
              '& .MuiSlider-track': {
                border: 'none',
                background: 'linear-gradient(90deg, #007AFF, #5AC8FA)',
              },
              '& .MuiSlider-rail': {
                opacity: 1,
                backgroundColor: 'rgba(0,0,0,0.08)',
              },
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                backgroundColor: '#fff',
                border: '2px solid #007AFF',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                '&:before': {
                  display: 'none',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: '0 2px 8px rgba(0,122,255,0.25)',
                },
              },
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#86868B', 
              fontSize: '0.65rem',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {formatTime(displayProgress)}
          </Typography>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
          <IconButton
            onClick={previousSong}
            size="small"
            sx={{ 
              color: '#1D1D1F',
              '&:hover': { color: '#007AFF' },
            }}
          >
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            onClick={togglePlayPause}
            sx={{
              width: 44,
              height: 44,
              background: '#fff',
              color: '#007AFF',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'scale(1.05)',
              },
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowRoundedIcon />}
          </IconButton>
          <IconButton
            onClick={nextSong}
            size="small"
            sx={{ 
              color: '#1D1D1F',
              '&:hover': { color: '#007AFF' },
            }}
          >
            <SkipNextIcon />
          </IconButton>
          <IconButton
            onClick={closePlayer}
            size="small"
            sx={{ 
              color: '#86868B', 
              ml: 1,
              '&:hover': { color: '#FF3B30' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default GlobalAudioPlayer;
