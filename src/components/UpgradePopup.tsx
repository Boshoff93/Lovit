import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import GruviCoin from './GruviCoin';
import { topUpBundles, TopUpBundle } from '../config/stripe';

interface UpgradePopupProps {
  open: boolean;
  message: string;
  title?: string;
  isPremiumTier: boolean;
  onClose: () => void;
  onTopUp: (bundle?: TopUpBundle) => void;
  onUpgrade: () => void;
  isTopUpLoading?: boolean;
  isUpgradeLoading?: boolean;
  // Legacy prop - kept for compatibility but not used
  type?: 'photo' | 'model' | null;
}

const UpgradePopup: React.FC<UpgradePopupProps> = ({
  open,
  message,
  title,
  isPremiumTier,
  onClose,
  onTopUp,
  onUpgrade,
  isTopUpLoading = false,
  isUpgradeLoading = false
}) => {
  const [selectedBundle, setSelectedBundle] = useState<string>(topUpBundles[0].id);

  const handleBundleChange = (_event: React.MouseEvent<HTMLElement>, newBundle: string | null) => {
    if (newBundle !== null) {
      setSelectedBundle(newBundle);
    }
  };

  const handleTopUpClick = () => {
    const bundle = topUpBundles.find(b => b.id === selectedBundle);
    onTopUp(bundle);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 3,
          maxWidth: 420,
          px: 1,
          bgcolor: '#141418 !important',
          backgroundImage: 'none !important',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ pt: 3, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={600}>
          {title || 'Need More Tokens'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          gap: 2,
          py: 1
        }}>
          <GruviCoin size={64} />
          
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
            {message}
          </Typography>
          
          {/* Top-up bundle selector */}
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#fff' }}>
              Select a top-up bundle:
            </Typography>
            <ToggleButtonGroup
              value={selectedBundle}
              exclusive
              onChange={handleBundleChange}
              aria-label="token bundle"
              sx={{
                width: '100%',
                display: 'flex',
                '& .MuiToggleButton-root': {
                  flex: 1,
                  flexDirection: 'column',
                  py: 1.5,
                  px: 1,
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px !important',
                  mx: 0.5,
                  color: '#fff',
                  '&:first-of-type': { ml: 0 },
                  '&:last-of-type': { mr: 0 },
                  '&.Mui-selected': {
                    background: 'rgba(59,130,246,0.15)',
                    borderColor: '#3B82F6',
                    '&:hover': {
                      background: 'rgba(59,130,246,0.2)',
                    }
                  }
                }
              }}
            >
              {topUpBundles.map((bundle, index) => (
                <ToggleButton 
                  key={bundle.id} 
                  value={bundle.id}
                  sx={{ position: 'relative' }}
                >
                  {bundle.badge && (
                    <Box sx={{
                      position: 'absolute',
                      top: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: index === 2 ? '#34C759' : '#007AFF', // Green for "Best Value", blue for others
                      color: '#fff',
                      fontSize: '0.5rem',
                      fontWeight: 700,
                      px: 0.5,
                      py: 0.25,
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                    }}>
                      {bundle.badge}
                    </Box>
                  )}
                  <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    +{bundle.tokens.toLocaleString()} x <GruviCoin size={16} />
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#3B82F6' }}>
                    ${bundle.price}
                  </Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          
          {!isPremiumTier && (
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: 'transparent',
                width: '100%'
              }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Or upgrade your plan for more monthly tokens!
              </Typography>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        justifyContent: 'center', 
        pb: 2, 
        px: 3,
        flexDirection: 'column',
        gap: 1
      }}>
        <Button
          variant="contained"
          onClick={handleTopUpClick}
          fullWidth
          disabled={isTopUpLoading}
          sx={{
            borderRadius: '12px',
            py: 1.25,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              boxShadow: '0 6px 16px rgba(59,130,246,0.4)',
            },
          }}
        >
          {isTopUpLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `Top Up ${topUpBundles.find(b => b.id === selectedBundle)?.tokens.toLocaleString()}`
          )}
        </Button>
        {!isPremiumTier && (
          <Button
            variant="outlined"
            onClick={onUpgrade}
            fullWidth
            disabled={isUpgradeLoading}
            sx={{
              borderRadius: '12px',
              py: 1.25,
              fontWeight: 600,
              borderColor: '#3B82F6',
              color: '#fff',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#3B82F6',
                backgroundColor: 'transparent',
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)',
              },
            }}
          >
            {isUpgradeLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Upgrade Plan'
            )}
          </Button>
        )}
        <Button 
          variant="text" 
          onClick={onClose}
          sx={{ 
            color: '#86868B',
            fontWeight: 500,
            mt: 0.5,
          }}
        >
          Maybe Later
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpgradePopup; 