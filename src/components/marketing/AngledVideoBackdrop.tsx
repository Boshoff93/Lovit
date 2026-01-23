import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

interface VideoItem {
  id: string;
  thumbnail: string;
}

interface AngledVideoBackdropProps {
  /** List of videos to display (just needs thumbnails) */
  videos: VideoItem[];
  /** Rotation angle in degrees (default: -8) */
  angle?: number;
  /** Overlay darkness 0-1 (default: 0.55) */
  overlayOpacity?: number;
}

/**
 * Single panel - just shows thumbnail (no video for fast loading)
 */
const VideoPanel: React.FC<{
  video: VideoItem;
}> = ({ video }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '9/16',
        borderRadius: '12px',
        overflow: 'hidden',
        flexShrink: 0,
        background: '#1a1a2e',
      }}
    >
      <Box
        component="img"
        src={video.thumbnail}
        alt=""
        loading="lazy"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
};

/**
 * A single column of thumbnails that scrolls continuously
 */
const VideoColumn: React.FC<{
  videos: VideoItem[];
  direction: 'up' | 'down';
  duration: number;
  columnIndex: number;
}> = ({ videos, direction, duration, columnIndex }) => {
  // Double the videos for seamless loop
  const allVideos = [...videos, ...videos];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        animation: `scroll${direction === 'up' ? 'Up' : 'Down'}${columnIndex} ${duration}s linear infinite`,
        [`@keyframes scrollUp${columnIndex}`]: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        [`@keyframes scrollDown${columnIndex}`]: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' },
        },
      }}
    >
      {allVideos.map((video, index) => (
        <VideoPanel
          key={`${video.id}-${index}`}
          video={video}
        />
      ))}
    </Box>
  );
};

/**
 * AngledVideoBackdrop - Full-screen backdrop with vertical video columns
 * Similar to Followr.ai hero section
 */
const AngledVideoBackdrop: React.FC<AngledVideoBackdropProps> = ({
  videos,
  angle = -8,
  overlayOpacity = 0.55,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Number of columns - extra on each side for overflow effect
  const numColumns = isMobile ? 5 : isTablet ? 7 : 9;

  // Videos per column
  const videosPerColumn = 4;

  // Distribute videos across columns
  const getColumnVideos = (colIndex: number): VideoItem[] => {
    const result: VideoItem[] = [];
    for (let i = 0; i < videosPerColumn; i++) {
      const videoIndex = (colIndex + i * numColumns) % videos.length;
      result.push(videos[videoIndex]);
    }
    return result;
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        // Mask to fade to transparent at bottom - starts fading at 40%
        maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 97%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 97%)',
      }}
    >
      {/* Rotated container that overflows viewport on all sides */}
      <Box
        sx={{
          position: 'absolute',
          top: '-30%',
          left: '-25%',
          right: '-25%',
          bottom: '-30%',
          transform: `rotate(${angle}deg)`,
          display: 'flex',
          gap: { xs: 1, sm: 1.5, md: 2 },
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {Array.from({ length: numColumns }).map((_, colIndex) => (
          <Box
            key={colIndex}
            sx={{
              width: { xs: '100px', sm: '130px', md: '160px', lg: '200px' },
              flexShrink: 0,
            }}
          >
            <VideoColumn
              videos={getColumnVideos(colIndex)}
              direction={colIndex % 2 === 0 ? 'up' : 'down'}
              duration={80 + colIndex * 10}
              columnIndex={colIndex}
            />
          </Box>
        ))}
      </Box>

      {/* Dark gradient overlay for text readability - fades to transparent at bottom */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg,
            rgba(13, 13, 15, ${overlayOpacity + 0.15}) 0%,
            rgba(13, 13, 15, ${overlayOpacity}) 30%,
            rgba(13, 13, 15, ${overlayOpacity - 0.1}) 50%,
            rgba(13, 13, 15, ${overlayOpacity - 0.15}) 70%,
            rgba(13, 13, 15, 0.2) 85%,
            rgba(13, 13, 15, 0) 100%
          )`,
          pointerEvents: 'none',
        }}
      />

      {/* Side gradients for edge blending */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '12%',
          background: 'linear-gradient(90deg, rgba(13, 13, 15, 1) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '12%',
          background: 'linear-gradient(270deg, rgba(13, 13, 15, 1) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default AngledVideoBackdrop;
