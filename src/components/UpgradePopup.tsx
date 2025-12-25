import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';

interface UpgradePopupProps {
  open: boolean;
  message: string;
  title?: string;
  isPremiumTier: boolean;
  onClose: () => void;
  onTopUp: () => void;
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxWidth: 400,
          px: 1
        }
      }}
    >
      <DialogTitle sx={{ pt: 3, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={600}>
          {title || 'Not Enough Tokens'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          gap: 2,
          py: 2
        }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(90,200,250,0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1
            }}
          >
            <BoltIcon sx={{ fontSize: 40, color: '#007AFF' }} />
          </Box>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            {message}
          </Typography>
          
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(0,122,255,0.05) 0%, rgba(90,200,250,0.05) 100%)',
              width: '100%'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {isPremiumTier
                ? 'Purchase additional tokens to continue creating amazing music and videos!'
                : 'Upgrade your plan for more monthly tokens and premium features!'}
            </Typography>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        justifyContent: 'center', 
        pb: 3, 
        px: 3,
        flexDirection: 'column',
        gap: 1.5
      }}>
        <Button 
          variant="contained" 
          onClick={onTopUp}
          fullWidth
          disabled={isTopUpLoading}
          sx={{ 
            borderRadius: '12px', 
            py: 1.5,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
              boxShadow: '0 6px 16px rgba(0,122,255,0.4)',
            },
          }}
        >
          {isTopUpLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Top Up Tokens'
          )}
        </Button>
        {isPremiumTier === false && (
          <Button 
            variant="outlined" 
            onClick={onUpgrade}
            fullWidth
            disabled={isUpgradeLoading}
            sx={{ 
              borderRadius: '12px', 
              py: 1.5,
              fontWeight: 600,
              borderColor: '#007AFF',
              color: '#007AFF',
              '&:hover': { 
                borderColor: '#0066DD',
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
      </DialogActions>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        pb: 2
      }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ borderRadius: 2, minWidth: 120 }}
        >
          Later
        </Button>
      </Box>
    </Dialog>
  );
};

export default UpgradePopup; 