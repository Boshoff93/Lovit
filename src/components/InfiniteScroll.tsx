import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

interface InfiniteScrollProps {
  items: Array<{ name: string; logo: string }>;
  direction?: 'left' | 'right';
  speed?: number;
  itemWidth?: number | { xs: number; sm: number; md: number };
  itemHeight?: number | { xs: number; sm: number; md: number };
  spacing?: number;
  grayscale?: boolean;
  hoverScale?: number;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  items,
  direction = 'left',
  speed = 20,
  itemWidth = { xs: 250, sm: 300, md: 350 },
  itemHeight = { xs: 100, sm: 120, md: 140 },
  spacing = 6,
  grayscale = true,
  hoverScale = 1.05
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Adjust speed for different screen sizes
  const adjustedSpeed = isXs ? speed * 0.8 : isSm ? speed * 0.4 : speed * 1.7;
  
  // Adjust spacing for different screen sizes
  const adjustedSpacing = isXs ? spacing * -.5 : isSm ? spacing * -.1 : spacing;
  
  // Calculate the current item width based on screen size
  const currentItemWidth = typeof itemWidth === 'number' 
    ? itemWidth 
    : isXs 
      ? itemWidth.xs 
      : isSm 
        ? itemWidth.sm 
        : itemWidth.md;

  // Create three sets of items for seamless looping
  const tripleItems = [...items, ...items, ...items];
  
  return (
    <Box
      sx={{
        display: 'flex',
        animation: `scroll${direction === 'right' ? 'Reverse' : ''} ${adjustedSpeed}s linear infinite alternate`,
        '@keyframes scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% / 3))' },
        },
        '@keyframes scrollReverse': {
          '0%': { transform: 'translateX(calc(-100% / 3))' },
          '100%': { transform: 'translateX(0)' },
        },
      }}
    >
      {tripleItems.map((item, index) => (
        <Box
          key={`${item.name}-${index}`}
          sx={{
            flex: '0 0 auto',
            mx: adjustedSpacing,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: typeof itemWidth === 'number' ? itemWidth : itemWidth,
            height: typeof itemHeight === 'number' ? itemHeight : itemHeight,
          }}
        >
          <Box
            component="img"
            src={item.logo}
            alt={item.name}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              filter: grayscale ? 'grayscale(100%)' : 'none',
              opacity: 0.7,
              transition: 'all 0.3s ease',
              '&:hover': {
                filter: 'grayscale(0%)',
                opacity: 1,
                transform: `scale(${hoverScale})`,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default InfiniteScroll; 