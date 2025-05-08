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
  CardContent,
  LinearProgress,
  Grid,
  Paper
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { createPortalSession, createCheckoutSession } from '../store/authSlice';
import { useAccountData } from '../hooks/useAccountData';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

const AccountPage: React.FC = () => {
  const { user, subscription, createStripePortal, allowances } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  const { fetchAccountData, isLoading, error: fetchError } = useAccountData(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountData(true);
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

  const handleTopUp = useCallback(async (type: 'photos' | 'models') => {
    try {
      setError(null);
      setCheckoutLoading(type);
      const resultAction = await dispatch(createCheckoutSession({ 
        priceId: 'price_1RJSc0PU9E45VDzjai47qewH',
        productId: 'prod_SDuQwcDcLNpFsl'
      }));
      
      if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
        window.location.href = resultAction.payload.url;
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create checkout session');
    } finally {
      setCheckoutLoading(null);
    }
  }, [dispatch]);

  // Format subscription tier for display
  const formatTier = useCallback((tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  },[]);

  // Calculate remaining percentage for progress bar
  const calculateAllowancePercentage = useCallback((used: number, max: number) => {
    if (max === 0) return 0;
    return Math.min((used / max) * 100, 100);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '100vh',
      pt: 4,
      pb: { xs: 4, sm: 8 },
      px: 0
    }}>
      <Container maxWidth="md" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        p:0
      }}>
        {(error || fetchError) && (
          <Alert severity="error" sx={{ mb: 4, width: '100%' }}>
            {error || fetchError}
          </Alert>
        )}
        
        <Card sx={{ 
          width: '100%', 
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          overflow: 'visible',
          position: 'relative',
          mt: 4,
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              pt: { xs: 5, sm: 6 },
              pb: { xs: 3, sm: 4 },
              position: 'relative'
            }}>
              <Avatar 
                sx={{ 
                  width: { xs: 100, sm: 120 }, 
                  height: { xs: 100, sm: 120 }, 
                  mb: 2,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  position: 'absolute',
                  backgroundColor: 'secondary.light',
                  top: { xs: -50, sm: -60 }
                }}
                alt={user?.username || 'User Profile'}
                src="/lovit.png"
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
                    fontWeight: 500,
                    backgroundColor: user?.isVerified ? 'success.light' : 'warning.light',
                    color: 'black',
                    '&:hover': {
                      backgroundColor: user?.isVerified ? 'success.light' : 'warning.light'
                    }
                  }}
                />

                <Box sx={{ mt: 3, mb: 1, display: 'flex', justifyContent: 'center', gap: { xs: 3, sm: 2 }, flexWrap: 'wrap' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Member Since
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="600">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                  
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

            {/* Allowances Section */}
            {allowances && (
              <Box sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Your Allowances
                </Typography>
                <Grid container spacing={2}>
                  {/* AI Photos Allowance */}
                  <Grid size={12} key="photos">
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: { xs: 1.5, sm: 2 }, 
                        borderRadius: 2, 
                        border: '1px solid',
                        borderColor: 'divider' 
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhotoCameraIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle1" fontWeight={600}>
                            AI Photos
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="medium"
                          onClick={() => handleTopUp('photos')}
                          disabled={!!checkoutLoading}
                          startIcon={checkoutLoading === 'photos' ? <CircularProgress size={16} /> : undefined}
                          sx={{ 
                            borderRadius: 8,
                            px: 3,
                            fontWeight: 600,
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }
                          }}
                        >
                          {checkoutLoading === 'photos' ? 'Loading...' : 'Top Up'}
                        </Button>
                      </Box>
                      <Box sx={{ mt: 1, mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Used: {allowances.aiPhotos.used} / {allowances.aiPhotos.max + (allowances.aiPhotos.topup || 0)}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color={
                          allowances.aiPhotos.used >= (allowances.aiPhotos.max + (allowances.aiPhotos.topup || 0)) ? 'error.main' : 'primary.main'
                        }>
                          {(allowances.aiPhotos.max + (allowances.aiPhotos.topup || 0)) - allowances.aiPhotos.used <= 0 
                            ? "Limit reached" 
                            : `${(allowances.aiPhotos.max + (allowances.aiPhotos.topup || 0)) - allowances.aiPhotos.used} remaining`}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateAllowancePercentage(allowances.aiPhotos.used, allowances.aiPhotos.max + (allowances.aiPhotos.topup || 0))}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          my: 1,
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: allowances.aiPhotos.used >= (allowances.aiPhotos.max + (allowances.aiPhotos.topup || 0)) 
                              ? 'error.main' 
                              : 'primary.main'
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                  
                  {/* AI Models Allowance */}
                  <Grid size={12} key="models">
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        border: '1px solid',
                        borderColor: 'divider' 
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle1" fontWeight={600}>
                            AI Models
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="medium"
                          onClick={() => handleTopUp('models')}
                          disabled={!!checkoutLoading}
                          startIcon={checkoutLoading === 'models' ? <CircularProgress size={16} /> : undefined}
                          sx={{ 
                            borderRadius: 8,
                            px: 3,
                            fontWeight: 600,
                            width: { xs: '100%', sm: 'auto' },
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }
                          }}
                          
                        >
                          {checkoutLoading === 'models' ? 'Loading...' : 'Top Up'}
                        </Button>
                      </Box>
                      <Box sx={{ mt: 1, mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Used: {allowances.aiModels.used} / {allowances.aiModels.max + (allowances.aiModels.topup || 0)}
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color={
                          allowances.aiModels.used >= (allowances.aiModels.max + (allowances.aiModels.topup || 0)) ? 'error.main' : 'primary.main'
                        }>
                          {(allowances.aiModels.max + (allowances.aiModels.topup || 0)) - allowances.aiModels.used <= 0 
                            ? "Limit reached" 
                            : `${(allowances.aiModels.max + (allowances.aiModels.topup || 0)) - allowances.aiModels.used} remaining`}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateAllowancePercentage(allowances.aiModels.used, allowances.aiModels.max + (allowances.aiModels.topup || 0))}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          my: 1,
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: allowances.aiModels.used >= (allowances.aiModels.max + (allowances.aiModels.topup || 0)) 
                              ? 'error.main' 
                              : 'primary.main'
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            <Divider />
            
            <Box sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Subscription Details
                </Typography>
                <Paper sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' }, 
                  mb: 3,
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  backgroundColor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  gap: { xs: 2, sm: 0 }
                }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                      {formatTier(subscription?.tier || 'free')} Plan
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ 
                        display: 'inline-block',
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%',
                        bgcolor: subscription?.status === 'active' ? 'success.main' : 'warning.main',
                        mr: 1 
                      }} />
                      Status: {subscription?.status || 'Active'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Subscription Renews: {subscription?.currentPeriodEnd && subscription.currentPeriodEnd > 0 
                        ? new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'No end date'}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    size="medium"
                    onClick={handleManageSubscription}
                    disabled={isLoading || portalLoading}
                    startIcon={portalLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
                    sx={{ 
                      borderRadius: 8,
                      px: 3,
                      fontWeight: 600,
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      }
                    }}
                  >
                    {portalLoading ? 'Loading...' : 'Manage'}
                  </Button>
                </Paper>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Personal Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 }, mt: 1 }}>
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