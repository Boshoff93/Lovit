import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

interface VideoLoadingPlaceholderProps {
  aspectRatio?: 'landscape' | 'portrait';
  progress?: number;
  message?: string;
  isQueued?: boolean;
  queuePosition?: number;
}

export const VideoLoadingPlaceholder: React.FC<VideoLoadingPlaceholderProps> = ({
  aspectRatio = 'portrait',
  progress = 0,
  message = 'Creating your video...',
  isQueued = false,
  queuePosition,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top left - Progress percentage */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1,
        }}
      >
        {!isQueued && (
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            {progress}%
          </Typography>
        )}
        {isQueued && (
          <Typography
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            In Queue{queuePosition ? ` (#${queuePosition})` : ''}
          </Typography>
        )}
      </Box>

      {/* Center content - Star icon */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {/* Star icon with glow */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: `${pulse} 2s ease-in-out infinite`,
            boxShadow: '0 0 40px rgba(0,122,255,0.5)',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
      </Box>

      {/* Bottom left - Status message */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
        }}
      >
        <Typography
          sx={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.7)',
            mb: 1,
          }}
        >
          {isQueued
            ? `In Queue${queuePosition ? ` (#${queuePosition})` : ''}`
            : message}
        </Typography>

        {/* Progress bar */}
        <Box
          sx={{
            height: 3,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: isQueued ? '100%' : `${progress}%`,
              borderRadius: 2,
              background: isQueued
                ? 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 100%)'
                : 'linear-gradient(90deg, #007AFF 0%, #5856D6 100%)',
              backgroundSize: isQueued ? '200% 100%' : '100% 100%',
              animation: isQueued ? `${shimmer} 2s infinite` : 'none',
              transition: 'width 0.5s ease',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default VideoLoadingPlaceholder;
