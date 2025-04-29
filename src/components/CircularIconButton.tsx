import React, { ReactNode } from 'react';
import { Button, Box, SxProps, Theme } from '@mui/material';

interface CircularIconButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  icon: ReactNode;
  textLabel?: string;
  onClick: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps<Theme>;
  size?: 'small' | 'medium' | 'large';
}

const CircularIconButton: React.FC<CircularIconButtonProps> = ({
  variant = 'outlined',
  icon,
  textLabel,
  onClick,
  sx,
  size = 'small'
}) => {
  return (
    <Button
      variant={variant}
      startIcon={<Box sx={{ display: { xs: 'none', md: 'inline' } }}>{icon}</Box>}
      onClick={onClick}
      size={size}
      sx={{ 
        borderRadius: { xs: '50%', sm: '50%', md: textLabel ? 20 : '50%' },
        minWidth: { xs: '40px', sm: '40px', md: textLabel ? 'auto' : '40px' },
        width: { xs: '40px', sm: '40px', md: textLabel ? 'auto' : '40px' },
        height: { xs: '40px', sm: '40px', md: textLabel ? 'auto' : '40px' },
        padding: { xs: 0, sm: 0, md: textLabel ? '6px 16px' : 0 },
        fontSize: { xs: '0.75rem', sm: '0.75rem', md: '0.875rem' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 1,
        '& .MuiButton-startIcon': {
          margin: { xs: 0, sm: 0, md: textLabel ? '0 8px 0 -4px' : 0 },
        },
        ...sx
      }}
    >
      <Box sx={{ display: { xs: 'inline', md: textLabel ? 'none' : 'inline' }, fontSize: '1.25rem' }}>
        {icon}
      </Box>
      {textLabel && (
        <Box sx={{ display: { xs: 'none', md: 'inline' } }}>
          {textLabel}
        </Box>
      )}
    </Button>
  );
};

export default CircularIconButton; 