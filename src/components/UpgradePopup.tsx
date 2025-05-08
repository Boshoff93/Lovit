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
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import Face3Icon from '@mui/icons-material/Person';

interface UpgradePopupProps {
  open: boolean;
  type: 'photo' | 'model' | null;
  message: string;
  isPremiumTier: boolean;
  onClose: () => void;
  onTopUp: () => void;
  onUpgrade: () => void;
  isTopUpLoading?: boolean;
  isUpgradeLoading?: boolean;
}

const UpgradePopup: React.FC<UpgradePopupProps> = ({
  open,
  type,
  message,
  isPremiumTier,
  onClose,
  onTopUp,
  onUpgrade,
  isTopUpLoading = false,
  isUpgradeLoading = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          {type === 'photo' ? 'Photo Limit Reached' : 'Model Limit Reached'}
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
              backgroundColor: `${theme.palette.warning.main}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1
            }}
          >
            {type === 'photo' ? 
              <ImageIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} /> : 
              <Face3Icon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
            }
          </Box>
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            {message}
          </Typography>
          
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.light + '15',
              width: '100%'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {isPremiumTier
                ? (type === 'photo' 
                  ? 'Purchase additional photo credits to continue creating amazing content!' 
                  : 'Purchase additional model credits to create more AI personas!')
                : (type === 'photo' 
                  ? 'Upgrade to generate more stunning images with your model!' 
                  : 'Upgrade to create additional AI models of different looks!')}
            </Typography>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        justifyContent: 'center', 
        pb: 3, 
        px: 3,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 0
      }}>
        {isMobile ? (
          <>
            <Button 
              variant="contained" 
              onClick={onTopUp}
              sx={{ borderRadius: 2, minWidth: 120 }}
              color="primary"
              fullWidth
              disabled={isTopUpLoading}
            >
              {isTopUpLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Top Up'
              )}
            </Button>
            {isPremiumTier === false && (
              <Button 
                variant="contained" 
                onClick={onUpgrade}
                sx={{ borderRadius: 2, minWidth: 120 }}
                color="secondary"
                fullWidth
                disabled={isUpgradeLoading}
              >
                {isUpgradeLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Upgrade Now'
                )}
              </Button>
            )}
          </>
        ) : (
          <>
            {isPremiumTier === false ? (
              <>
                <Button 
                  variant="contained" 
                  onClick={onTopUp}
                  sx={{ borderRadius: 2, minWidth: 120 }}
                  color="primary"
                  disabled={isTopUpLoading}
                >
                  {isTopUpLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Top Up'
                  )}
                </Button>
                <Button 
                  variant="contained" 
                  onClick={onUpgrade}
                  sx={{ borderRadius: 2, minWidth: 120 }}
                  color="secondary"
                  disabled={isUpgradeLoading}
                >
                  {isUpgradeLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Upgrade Now'
                  )}
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                onClick={onTopUp}
                sx={{ borderRadius: 2, minWidth: 120 }}
                color="primary"
                disabled={isTopUpLoading}
              >
                {isTopUpLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Top Up'
                )}
              </Button>
            )}
          </>
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