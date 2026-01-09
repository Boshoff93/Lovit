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
        sx: {
          borderRadius: 3,
          maxWidth: 420,
          px: 1
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
          
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            {message}
          </Typography>
          
          {/* Top-up bundle selector */}
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#1D1D1F' }}>
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
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '12px !important',
                  mx: 0.5,
                  '&:first-of-type': { ml: 0 },
                  '&:last-of-type': { mr: 0 },
                  '&.Mui-selected': {
                    background: 'rgba(0,122,255,0.08)',
                    borderColor: '#007AFF',
                    '&:hover': {
                      background: 'rgba(0,122,255,0.12)',
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
                  <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1D1D1F', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {bundle.tokens.toLocaleString()} x <GruviCoin size={16} />
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#007AFF' }}>
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
                background: 'rgba(0,0,0,0.03)',
                width: '100%'
              }}
            >
              <Typography variant="caption" color="text.secondary">
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
            background: '#007AFF',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
            '&:hover': { 
              background: '#0066DD',
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
              borderColor: 'rgba(0,0,0,0.15)',
              color: '#1D1D1F',
              '&:hover': { 
                borderColor: '#007AFF',
                color: '#007AFF',
                background: 'rgba(0,122,255,0.05)',
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