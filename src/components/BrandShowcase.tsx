import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import InfiniteScroll from './InfiniteScroll';

const brands = [
  { name: 'AGOLDE', logo: '/agolde.png' },
  { name: 'Anthropologie', logo: '/anthropologie.png' },
  { name: 'ASTR The Label', logo: '/astrthelabel.png' },
  { name: 'Citizens of Humanity', logo: '/citizensofhumanity.png' },
  { name: 'Farm Rio', logo: '/farmrio.png' },
  { name: 'Eloquii', logo: '/eloquii.png' },
  { name: 'FashionPass', logo: '/fashionpass.png' },
  { name: 'Favorite Daughter', logo: '/favoritedaughter.png' },
  { name: 'Frame', logo: '/frame.png' },
  { name: 'Good American', logo: '/goodamerican.png' },
  { name: 'Free People', logo: '/freepeople.png' },
  { name: "Levi's", logo: '/levis.png' },
  { name: 'Madewell', logo: '/madewell.png' },
  { name: 'Nuuly', logo: '/nuuly.png' },
  { name: 'Rent the Runway', logo: '/renttherunway.png' },
  { name: "Rolla's", logo: '/rollas.png' },
  { name: 'Selkie', logo: '/selkie.png' },
  { name: 'Urban Outfitters', logo: '/urbanoutfitters.png' }
];

interface BrandShowcaseProps {
  title?: string;
  speed?: number;
  spacing?: number;
  itemWidth?: number | { xs: number; sm: number; md: number };
  itemHeight?: number | { xs: number; sm: number; md: number };
}

const BrandShowcase: React.FC<BrandShowcaseProps> = ({
  title = "Your Online Fitting Room",
  speed = 20,
  spacing = 6,
  itemWidth = { xs: 250, sm: 300, md: 350 },
  itemHeight = { xs: 100, sm: 120, md: 140 }
}) => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        mb: 12,
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        overflow: 'hidden',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          width: '200px',
          height: '100%',
          zIndex: 2,
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          maskImage: 'linear-gradient(to right, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, black, transparent)',
        },
        '&::before': {
          left: 0,
          maskImage: 'linear-gradient(to right, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, black, transparent)',
          background: 'transparent',
        },
        '&::after': {
          right: 0,
          maskImage: 'linear-gradient(to left, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
          background: 'transparent',
        }
      }}
    >
      <InfiniteScroll 
        items={brands}
        direction="left"
        speed={speed}
        spacing={spacing}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
      />
      <Box sx={{ mt: 4 }}>
        <InfiniteScroll 
          items={[...brands].reverse()}
          direction="right"
          speed={speed}
          spacing={spacing}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
        />
      </Box>
    </Box>
  );
};

export default BrandShowcase; 