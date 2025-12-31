import React, { useCallback, useState, useEffect } from 'react';
import { 
  Box, 
  Container,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  Paper,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createPortalSession, createCheckoutSession } from '../store/authSlice';
import { useAccountData } from '../hooks/useAccountData';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { reportPurchaseConversion } from '../utils/googleAds';
import { updateEmailPreferences, getTokensFromAllowances } from '../store/authSlice';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { stripeConfig } from '../config/stripe';

const AccountPage: React.FC = () => {
  const { user, subscription, createStripePortal, allowances } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const isFreeTier = !subscription?.tier || subscription.tier === 'free';
  const { fetchAccountData, isLoading, error: fetchError } = useAccountData(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [portalLoading, setPortalLoading] = useState(false);
  const [emailPreferencesLoading, setEmailPreferencesLoading] = useState(false);

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
      // Track purchase conversion
      await reportPurchaseConversion();
      
      const resultAction = await dispatch(createCheckoutSession({ 
        priceId: stripeConfig.topUp.priceId,
        productId: stripeConfig.topUp.productId
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

  const handleToggleNotifications = useCallback(async (enabled: boolean) => {
    try {
      setError(null);
      setEmailPreferencesLoading(true);
      
      const resultAction = await dispatch(updateEmailPreferences({ notifications: enabled }));
      
      if (updateEmailPreferences.fulfilled.match(resultAction)) {
        // Successfully updated
      } else if (updateEmailPreferences.rejected.match(resultAction)) {
        setError(resultAction.payload as string || 'Failed to update email notifications');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setEmailPreferencesLoading(false);
    }
  }, [dispatch]);

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
        {/* Back Button */}
        <Box sx={{ width: '100%', mb: 2}}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/settings')}
            sx={{
              color: '#007AFF',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(0,122,255,0.08)',
              },
            }}
          >
            Back to Settings
          </Button>
        </Box>

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
              <Box 
                sx={{ 
                  width: { xs: 100, sm: 120 }, 
                  height: { xs: 100, sm: 120 }, 
                  mb: 2,
                  position: 'absolute',
                  top: { xs: -50, sm: -60 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img 
                  src="/gruvi.png" 
                  alt={user?.username || 'User Profile'}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box sx={{ mt: 7, textAlign: 'center' }}>
                <Typography 
                  variant="subtitle2"
                  fontWeight="600"
                  gutterBottom
                  sx={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    maxWidth: '100%',
                    textAlign: 'center'
                  }}
                >
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

            {/* Tokens Section */}
            {allowances && (
              <Box sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Your Tokens
                </Typography>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: { xs: 2, sm: 3 }, 
                    borderRadius: 3, 
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'linear-gradient(135deg, rgba(0,122,255,0.02) 0%, rgba(0,122,255,0.05) 100%)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1.5
                      }}>
                        <BoltIcon sx={{ fontSize: '1.5rem', color: '#fff' }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Tokens
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Use tokens across all Gruvi features
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={() => handleTopUp('photos')}
                      disabled={!!checkoutLoading}
                      startIcon={checkoutLoading === 'photos' ? <CircularProgress size={16} /> : undefined}
                      sx={{ 
                        borderRadius: '100px',
                        px: 4,
                        py: 1,
                        fontWeight: 600,
                        width: { xs: '100%', sm: 'auto' },
                        background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                        boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0066DD, #4AB8F0)',
                          boxShadow: '0 6px 20px rgba(0,122,255,0.4)',
                          transform: 'translateY(-1px)',
                        }
                      }}
                    >
                      {checkoutLoading === 'photos' ? 'Loading...' : 'Top Up Tokens'}
                    </Button>
                  </Box>
                  {(() => {
                    const tokens = getTokensFromAllowances(allowances);
                    const total = (tokens?.max || 0) + (tokens?.topup || 0);
                    const used = tokens?.used || 0;
                    const remaining = total - used;
                    return (
                      <>
                        <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <Typography variant="h4" fontWeight={700} color="primary.main">
                            {remaining}
                            <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                              tokens remaining
                            </Typography>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {used} / {total} used
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={calculateAllowancePercentage(used, total)}
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            my: 1,
                            backgroundColor: 'rgba(0,122,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              background: used >= total 
                                ? 'linear-gradient(135deg, #FF3B30, #FF6B6B)'
                                : 'linear-gradient(135deg, #007AFF, #5AC8FA)'
                            }
                          }}
                        />
                      </>
                    );
                  })()}
                </Paper>
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
                    onClick={isFreeTier ? () => navigate('/payment') : handleManageSubscription}
                    disabled={isLoading || portalLoading}
                    startIcon={portalLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
                    sx={{ 
                      borderRadius: 8,
                      px: 3,
                      fontWeight: 600,
                      width: { xs: '100%', sm: 'auto' },
                      background: isFreeTier 
                        ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' 
                        : undefined,
                      boxShadow: isFreeTier 
                        ? '0 4px 12px rgba(0,122,255,0.3)' 
                        : undefined,
                      '&:hover': {
                        background: isFreeTier 
                          ? 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)' 
                          : undefined,
                        boxShadow: isFreeTier 
                          ? '0 6px 16px rgba(0,122,255,0.4)' 
                          : '0 2px 8px rgba(0,0,0,0.05)',
                      }
                    }}
                  >
                    {portalLoading ? 'Loading...' : (isFreeTier ? 'Upgrade' : 'Manage')}
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email Notifications:
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user?.emailPreferences?.notifications ?? false}
                        onChange={(e) => handleToggleNotifications(e.target.checked)}
                        disabled={isLoading}
                        color="primary"
                      />
                    }
                    label={
                      emailPreferencesLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <Chip 
                          label={user?.emailPreferences?.notifications ? 'Enabled' : 'Disabled'} 
                          color={user?.emailPreferences?.notifications ? 'success' : 'default'}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            backgroundColor: user?.emailPreferences?.notifications ? 'success.light' : 'grey.200',
                            color: user?.emailPreferences?.notifications ? 'black' : 'text.secondary',
                            '&:hover': {
                              backgroundColor: user?.emailPreferences?.notifications ? 'success.light' : 'grey.200'
                            }
                          }}
                        />
                      )
                    }
                    sx={{ m: 0 }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AccountPage; 