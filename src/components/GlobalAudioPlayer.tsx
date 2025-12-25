import React, { useState, useCallback } from 'react';
import { Box, Typography, IconButton, Slider } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

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
        left: 0,
        right: 0,
        zIndex: 1300,
        background: '#fff',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        px: { xs: 2, sm: 3 },
        py: 1.5,
      }}
    >
      <Box sx={{ maxWidth: 'lg', mx: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Song Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1D1D1F 0%, #3D3D3F 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <VolumeUpIcon sx={{ color: '#fff', fontSize: 24 }} />
        </Box>

        {/* Song Info */}
        <Box sx={{ flex: 1, minWidth: 0, maxWidth: { xs: 120, sm: 200 } }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#1D1D1F',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {currentSong.songTitle}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#86868B' }}
          >
            {currentSong.genre}
          </Typography>
        </Box>

        {/* Progress Slider - using MUI Slider for smooth experience */}
        <Box 
          sx={{ 
            flex: 2, 
            display: { xs: 'none', sm: 'flex' }, 
            alignItems: 'center', 
            gap: 1.5,
            height: 48, // Match the height of the song icon for consistent alignment
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
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Slider
              value={displayProgress}
              min={0}
              max={duration || 100}
              onChange={handleSliderChange}
              onChangeCommitted={handleSliderChangeCommitted}
              sx={{
                color: '#007AFF',
                height: 4,
                padding: '0 !important',
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
                  marginTop: 0,
                  marginLeft: -8,
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

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
