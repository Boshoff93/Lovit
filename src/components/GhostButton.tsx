import React from 'react';
import { Button, ButtonProps, IconButton, IconButtonProps } from '@mui/material';

// Ghost button - outline style with blue glow on hover
// Used for secondary actions like Cancel, Upload, etc.

interface GhostButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
}

export const GhostButton: React.FC<GhostButtonProps> = ({ children, sx, ...props }) => {
  return (
    <Button
      variant="outlined"
      sx={{
        borderColor: '#3B82F6',
        color: '#fff',
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        '& .MuiButton-startIcon': {
          color: '#3B82F6',
        },
        '&:hover': {
          borderColor: '#3B82F6',
          backgroundColor: 'transparent',
          color: '#fff',
          boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)',
          transform: 'translateY(-2px)',
        },
        '&:disabled': {
          borderColor: 'rgba(59, 130, 246, 0.3)',
          color: 'rgba(255, 255, 255, 0.3)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

// Ghost icon button - circle outline with blue glow on hover
interface GhostIconButtonProps extends Omit<IconButtonProps, 'color'> {
  children: React.ReactNode;
}

export const GhostIconButton: React.FC<GhostIconButtonProps> = ({ children, sx, ...props }) => {
  return (
    <IconButton
      sx={{
        border: '2px solid #3B82F6',
        color: '#fff',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#3B82F6',
          color: '#fff',
          background: 'transparent',
          boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)',
          transform: 'translateY(-2px)',
        },
        '&:disabled': {
          borderColor: 'rgba(59, 130, 246, 0.3)',
          color: 'rgba(255, 255, 255, 0.3)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </IconButton>
  );
};

export default GhostButton;
