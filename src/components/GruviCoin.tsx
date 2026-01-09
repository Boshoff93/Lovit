import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface GruviCoinProps {
  size?: number;
  sx?: SxProps<Theme>;
}

const GruviCoin: React.FC<GruviCoinProps> = ({ size = 20, sx }) => {
  return (
    <Box
      component="img"
      src="/gruvi/gruvi-coin.png"
      alt="Gruvi Coin"
      sx={{
        width: size,
        height: size,
        objectFit: 'contain',
        ...sx,
      }}
    />
  );
};

export default GruviCoin;
