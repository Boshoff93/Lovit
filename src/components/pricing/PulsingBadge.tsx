import React from 'react';
import { Box, Typography } from '@mui/material';
import { gruviGradients } from '../../index';

interface PulsingBadgeProps {
  label?: string;
  gradient?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * PulsingBadge - An animated badge with a pulsing glow effect
 * Used for "Most Popular" or similar highlighting on pricing cards
 */
const PulsingBadge: React.FC<PulsingBadgeProps> = ({
  label = 'Most Popular',
  gradient = gruviGradients.scale,
  size = 'medium',
}) => {
  const sizeStyles = {
    small: {
      px: 1.5,
      py: 0.5,
      fontSize: '0.7rem',
      borderRadius: '8px',
    },
    medium: {
      px: 2,
      py: 0.75,
      fontSize: '0.75rem',
      borderRadius: '10px',
    },
    large: {
      px: 2.5,
      py: 1,
      fontSize: '0.85rem',
      borderRadius: '12px',
    },
  };

  const styles = sizeStyles[size];

  return (
    <Box
      sx={{
        display: 'inline-block',
        background: gradient,
        px: styles.px,
        py: styles.py,
        borderRadius: styles.borderRadius,
        animation: 'pulsingBadge 2s ease-in-out infinite',
        '@keyframes pulsingBadge': {
          '0%, 100%': {
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4), 0 0 0 0 rgba(236, 72, 153, 0.4)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 6px 20px rgba(236, 72, 153, 0.5), 0 0 0 6px rgba(236, 72, 153, 0)',
            transform: 'scale(1.02)',
          },
        },
      }}
    >
      <Typography
        sx={{
          fontSize: styles.fontSize,
          fontWeight: 700,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default PulsingBadge;
