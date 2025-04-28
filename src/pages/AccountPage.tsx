import React, { useCallback, useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { createPortalSession } from '../store/authSlice';
import { useAccountData } from '../hooks/useAccountData';

const AccountPage: React.FC = () => {
  const { user, subscription, createStripePortal } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { fetchAccountData, isLoading, error: fetchError } = useAccountData(false);

  useEffect(() => {
      fetchAccountData(false);
  }, []);

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
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '100vh',
      pt: 2,
      pb: 8,
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Container maxWidth="sm" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%'
      }}>
        <Box sx={{ mb: 12, textAlign: 'center', maxWidth: '600px' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Account Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your profile and account preferences
          </Typography>
        </Box>
        
        {(error || fetchError) && (
          <Alert severity="error" sx={{ mb: 4, width: '100%' }}>
            {error || fetchError}
          </Alert>
        )}
        
        <Card sx={{ 
          width: '100%', 
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'visible',
          position: 'relative',
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              pt: 6,
              pb: 4,
              position: 'relative'
            }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  border: '4px solid white',
                  position: 'absolute',
                  top: -60
                }}
                alt={user?.username || 'User Profile'}
                src="/lovit.jpeg"
              />
              <Box sx={{ mt: 7, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  {user?.username || 'Loading...'}
                </Typography>
                <Chip 
                  label={user?.isVerified ? 'Verified' : 'Unverified'} 
                  color={user?.isVerified ? 'success' : 'warning'}
                  size="small"
                  sx={{ 
                    mb: 1,
                    fontWeight: 500
                  }}
                />

                <Box sx={{ mt: 3, mb: 1, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Member Since
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="600">
                      April 2024
                    </Typography>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem />
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Subscription
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="600">
                      {formatTier(subscription?.tier || 'free')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Subscription Details
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 3,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  p: 2,
                  borderRadius: 2
                }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {formatTier(subscription?.tier || 'free')} Plan
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {subscription?.status || 'Active'}
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="medium"
                    onClick={handleManageSubscription}
                    disabled={isLoading || portalLoading}
                    startIcon={portalLoading ? <CircularProgress size={16} /> : undefined}
                    sx={{ 
                      borderRadius: 8,
                      px: 2
                    }}
                  >
                    {portalLoading ? 'Loading...' : 'Manage'}
                  </Button>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Personal Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                <TextField 
                  fullWidth 
                  label="Username" 
                  value={user?.username || ''}
                  size="small"
                  disabled
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
                <TextField 
                  fullWidth 
                  label="Email Address" 
                  value={user?.email || ''}
                  size="small"
                  disabled
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AccountPage; 