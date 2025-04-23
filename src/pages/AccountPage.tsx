import React, { useCallback, useState } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Avatar,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { createPortalSession } from '../store/authSlice';
import { useAccountData } from '../hooks/useAccountData';

const AccountPage: React.FC = () => {
  const { user, subscription, createStripePortal } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { isLoading, error: fetchError } = useAccountData();
  const [portalLoading, setPortalLoading] = useState(false);

  const handleManageSubscription = useCallback(async () => {
    try {
      setError(null);
      setPortalLoading(true);
      // Use the Redux action to create a portal session
      const resultAction = await createStripePortal()
      
      if (createPortalSession.fulfilled.match(resultAction)) {
        // Redirect to Stripe customer portal
        if (resultAction.payload.url) {
          window.location.href = resultAction.payload.url;
        }
      } else if (createPortalSession.rejected.match(resultAction)) {
        setError(resultAction.payload as string || 'Failed to access subscription management');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setPortalLoading(false);
    }
  },[createStripePortal, setError, setPortalLoading]);

  // Format subscription tier for display
  const formatTier = useCallback((tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  },[]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center', maxWidth: 480, mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your profile and account preferences
        </Typography>
      </Box>
      
      {(error || fetchError) && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 480, mx: 'auto' }}>
          {error || fetchError}
        </Alert>
      )}
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          mb: 4,
          maxWidth: 480,
          mx: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              mb: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            alt={user?.username || 'User Profile'}
            src="/lovit.jpeg"
          />
          <Typography variant="h6" gutterBottom>
            {user?.username || 'Loading...'}
          </Typography>
          <Chip 
            label={user?.isVerified ? 'Verified' : 'Unverified'} 
            color={user?.isVerified ? undefined : 'warning'}
            size="small"
            sx={{ 
              mb: 1,
              ...(user?.isVerified && {
                backgroundColor: '#F5F5DC',
                color: 'text.primary',
                fontWeight: 500
              })
            }}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Subscription Plan
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {formatTier(subscription?.tier || 'free')} - {subscription?.status || 'Active'}
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ mt: 1 }}
            onClick={handleManageSubscription}
            disabled={isLoading || portalLoading}
            startIcon={portalLoading ? <CircularProgress size={16} /> : undefined}
          >
            {portalLoading ? 'Loading...' : 'Manage Subscription'}
          </Button>
          
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
            Member Since
          </Typography>
          <Typography variant="body2" color="text.secondary">
            April 2024
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Personal Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField 
              fullWidth 
              label="Username" 
              value={user?.username || ''}
              size="small"
              disabled
            />
            <TextField 
              fullWidth 
              label="Email Address" 
              value={user?.email || ''}
              size="small"
              disabled
            />
            <Box>
              <Button 
                variant="contained" 
                fullWidth
                sx={{ mt: 1 }}
                disabled
              >
                Save Changes
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                Contact support to update your account information
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AccountPage; 