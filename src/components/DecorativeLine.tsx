import React from 'react';
import { Box } from '@mui/material';

interface DecorativeLineProps {
  src: string;
  alt?: string;
  height?: {
    xs?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
  };
  marginTop?: string | number;
  marginBottom?: string | number;
}

const DecorativeLine: React.FC<DecorativeLineProps> = ({
  src,
  alt = "Decorative Line",
  height = {
    xs: '150px',
    sm: '200px',
    md: '250px',
    lg: '300px',
    xl: '400px'
  },
  marginTop = 0,
  marginBottom = 6,
}) => {
  return (
    <Box sx={{
      height,
      mt: marginTop,
      mb: marginBottom,
      position: 'relative',
      marginLeft: '-10vw',
      marginRight: '-10vw',
    }}>
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

export default DecorativeLine; 