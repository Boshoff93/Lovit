import React from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';

interface FeatureLockedModalProps {
  open: boolean;
  onClose: () => void;
  featureName: string;
  description?: string;
}

const FeatureLockedModal: React.FC<FeatureLockedModalProps> = ({
  open,
  onClose,
  featureName,
  description,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/payment');
  };

  const plans = [
    { name: 'Starter', image: '/gruvi/gruvi-started.png' },
    { name: 'Scale', image: '/gruvi/gruvi-scale.png' },
    { name: 'Beast', image: '/gruvi/gruvi-beast.png' },
  ];

  return (
    <Dialog
      open={open}
      // No onClose - modal cannot be dismissed on locked pages
      hideBackdrop
      disableEscapeKeyDown
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '20px',
          maxWidth: 500,
          width: '90%',
          p: 0,
          overflow: 'hidden',
          bgcolor: '#141418 !important',
          backgroundImage: 'none !important',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }}
      sx={{
        position: 'fixed',
        zIndex: 1301,
        // Account for mobile top bar (56px) on small screens
        top: { xs: 56, md: 0 },
        left: { xs: 0, md: 240 },
        right: 0,
        bottom: 0,
        '& .MuiDialog-container': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
      }}>
        {/* Lock Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <LockIcon sx={{ fontSize: 40, color: '#fff' }} />
        </Box>

        {/* Feature Name */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#fff',
            mb: 1,
            textAlign: 'center',
          }}
        >
          {featureName}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            mb: 3,
            lineHeight: 1.5,
          }}
        >
          {description || 'This feature requires a Gruvi subscription plan.'}
          <br />
          <strong style={{ color: '#fff' }}>Choose a plan that works for you!</strong>
        </Typography>

        {/* Plans Available */}
        <Box
          sx={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.1)',
            p: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AutoAwesomeIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
              Available in these plans:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            {plans.map((plan) => (
              <Box
                key={plan.name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              >
                <Box
                  component="img"
                  src={plan.image}
                  alt={plan.name}
                  sx={{
                    width: 28,
                    height: 28,
                    objectFit: 'contain',
                  }}
                />
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#fff' }}>
                  {plan.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Upgrade Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleUpgrade}
          sx={{
            py: 1.5,
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            background: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
            boxShadow: '0 4px 16px rgba(236,72,153,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              background: 'linear-gradient(135deg, #DB2777 0%, #EA580C 100%)',
              boxShadow: '0 6px 20px rgba(236,72,153,0.4)',
            },
          }}
        >
          <LockOpenIcon sx={{ fontSize: 20 }} />
          Unlock
        </Button>

        {/* Subtext */}
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.8rem',
            mt: 1.5,
            textAlign: 'center',
          }}
        >
          Start your subscription today - Cancel anytime
        </Typography>
      </Box>
    </Dialog>
  );
};

export default FeatureLockedModal;
