import React, { useCallback, useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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
  FormControlLabel,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createPortalSession, createCheckoutSession, refreshUserData } from '../store/authSlice';
import { useAccountData } from '../hooks/useAccountData';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { reportPurchaseConversion } from '../utils/googleAds';
import { updateEmailPreferences, getTokensFromAllowances } from '../store/authSlice';
import GruviCoin from '../components/GruviCoin';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { stripeConfig, topUpBundles } from '../config/stripe';
import { userApi } from '../services/api';

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
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  
  // Profile editing state - single field for Profile Name
  const [artistName, setArtistName] = useState(user?.artistName || user?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);
  
  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setArtistName(user.artistName || user.name || '');
    }
  }, [user]);

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

  const handleSaveName = useCallback(async () => {
    setIsSavingName(true);
    setError(null);
    
    try {
      await userApi.updateProfile({
        name: artistName,
        artistName: artistName,
        directorName: artistName,
      });
      
      // Refresh user data to update the store
      await dispatch(refreshUserData());
      
      setNameSuccess('Saved!');
      setIsEditingName(false);
      setTimeout(() => setNameSuccess(null), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update name');
    } finally {
      setIsSavingName(false);
    }
  }, [artistName, dispatch]);

  const handleCancelEdit = useCallback(() => {
    setArtistName(user?.artistName || user?.name || '');
    setIsEditingName(false);
  }, [user]);


  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
            flexShrink: 0,
            animation: 'iconEntrance 0.5s ease-out',
            '@keyframes iconEntrance': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.5) rotate(-10deg)',
              },
              '50%': {
                transform: 'scale(1.1) rotate(5deg)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1) rotate(0deg)',
              },
            },
          }}
        >
          <AccountCircleIcon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#141418', mb: 0.5 }}>
            Account
          </Typography>
          <Typography sx={{ color: '#86868B' }}>
            Manage your profile and subscription
          </Typography>
        </Box>
      </Box>

      {(error || fetchError) && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError(null)}>
          {error || fetchError}
        </Alert>
      )}

      {/* User Info Card */}
      <Card sx={{
        mb: 3,
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: 'none',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#141418' }}>
                  {user?.username || 'Loading...'}
                </Typography>
                <Chip
                  label={user?.isVerified ? 'Verified' : 'Unverified'}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    background: user?.isVerified ? 'rgba(52,199,89,0.1)' : 'rgba(255,149,0,0.1)',
                    color: user?.isVerified ? '#34C759' : '#FF9500',
                  }}
                />
              </Box>
              <Typography sx={{ color: '#86868B', fontSize: '0.9rem' }}>
                {user?.artistName || user?.name || 'No artist name set'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#86868B', fontSize: '0.8rem', mb: 0.5 }}>Member Since</Typography>
                <Typography sx={{ fontWeight: 600, color: '#141418' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#86868B', fontSize: '0.8rem', mb: 0.5 }}>Plan</Typography>
                <Typography sx={{ fontWeight: 600, color: '#007AFF' }}>
                  {formatTier(subscription?.tier || 'free')}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tokens Section */}
      {allowances && (
        <Card sx={{ mb: 3, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#141418', mb: 2 }}>
              Your Tokens
            </Typography>
            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GruviCoin size={40} sx={{ mr: 1.5 }} />
                <Box>
                  <Typography sx={{ fontWeight: 600, color: '#141418' }}>
                    Tokens
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                    Use tokens across all Gruvi features
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={() => setTopUpModalOpen(true)}
                sx={{
                  borderRadius: '10px',
                  px: 2.5,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  width: { xs: '100%', sm: 'auto' },
                  background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0066DD, #4AB8F0)',
                    boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
                  }
                }}
              >
                Top Up Tokens
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
                    <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#007AFF' }}>
                      {remaining.toLocaleString()}
                      <Typography component="span" sx={{ fontSize: '0.9rem', color: '#86868B', ml: 1 }}>
                        tokens remaining
                      </Typography>
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                      {used.toLocaleString()} / {total.toLocaleString()} used
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculateAllowancePercentage(used, total)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      my: 1,
                      backgroundColor: 'rgba(0,122,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: used >= total
                          ? 'linear-gradient(135deg, #FF3B30, #FF6B6B)'
                          : 'linear-gradient(135deg, #007AFF, #5AC8FA)'
                      }
                    }}
                  />
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Subscription Details */}
      <Card sx={{ mb: 3, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#141418', mb: 2 }}>
            Subscription Details
          </Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={subscription?.tier === 'premium' ? '/gruvi/gruvi-beast.png' : subscription?.tier === 'pro' ? '/gruvi/gruvi-scale.png' : '/gruvi/gruvi-started.png'}
                alt={subscription?.tier || 'free'}
                sx={{ height: 72, width: 'auto', flexShrink: 0 }}
              />
              <Box>
              <Typography sx={{ fontWeight: 600, color: '#007AFF', mb: 0.5 }}>
                {formatTier(subscription?.tier || 'free')} Plan
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: subscription?.status === 'active' ? '#34C759' : '#FF9500',
                }} />
                <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                  Status: {subscription?.status || 'Active'}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                {subscription?.currentPeriodEnd && subscription.currentPeriodEnd > 0
                  ? `Renews: ${new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
                  : 'No renewal date'}
              </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="small"
              onClick={isFreeTier ? () => navigate('/payment') : handleManageSubscription}
              disabled={isLoading || portalLoading}
              startIcon={portalLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
                background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                  boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
                }
              }}
            >
              {portalLoading ? 'Loading...' : (isFreeTier ? 'Upgrade Plan' : 'Manage Subscription')}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card sx={{ mb: 3, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#141418', mb: 3 }}>
            Personal Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Profile Name */}
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#141418', mb: 1, fontSize: '0.9rem' }}>
                Profile Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter your artist or director name"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                size="small"
                disabled={!isEditingName}
                InputProps={{
                  sx: { borderRadius: '10px' },
                  endAdornment: (
                    <InputAdornment position="end">
                      {isEditingName ? (
                        <>
                          <IconButton
                            onClick={handleCancelEdit}
                            size="small"
                            disabled={isSavingName}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={handleSaveName}
                            size="small"
                            disabled={isSavingName}
                            sx={{ color: '#007AFF' }}
                          >
                            {isSavingName ? (
                              <CircularProgress size={18} />
                            ) : (
                              <SaveIcon fontSize="small" />
                            )}
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          onClick={() => setIsEditingName(true)}
                          size="small"
                          sx={{ color: '#007AFF' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <Typography sx={{ color: nameSuccess ? '#34C759' : '#86868B', mt: 0.5, fontSize: '0.8rem' }}>
                {nameSuccess || "Your display name across Gruvi"}
              </Typography>
            </Box>

            {/* Email Address */}
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#141418', mb: 1, fontSize: '0.9rem' }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                value={user?.email || ''}
                size="small"
                disabled
                InputProps={{
                  sx: { borderRadius: '10px', bgcolor: 'rgba(0,0,0,0.02)' }
                }}
              />
              <Typography sx={{ color: '#86868B', mt: 0.5, fontSize: '0.8rem' }}>
                Email cannot be changed
              </Typography>
            </Box>

            {/* Email Notifications */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#86868B' }}>
              Email Notifications:
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={user?.emailPreferences?.notifications ?? false}
                  onChange={(e) => handleToggleNotifications(e.target.checked)}
                  disabled={isLoading}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#34C759',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#34C759',
                    },
                  }}
                />
              }
              label={
                emailPreferencesLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Chip
                    label={user?.emailPreferences?.notifications ? 'Enabled' : 'Disabled'}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      background: user?.emailPreferences?.notifications ? 'rgba(52,199,89,0.1)' : 'rgba(0,0,0,0.05)',
                      color: user?.emailPreferences?.notifications ? '#34C759' : '#86868B',
                    }}
                  />
                )
              }
              sx={{ m: 0 }}
            />
          </Box>
        </Box>
        </CardContent>
      </Card>
      {/* Top Up Modal */}
      <Dialog
        open={topUpModalOpen}
        onClose={() => setTopUpModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#141418' }}>
              Need More Tokens?
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
              Top-up tokens never expire!
            </Typography>
          </Box>
          <IconButton onClick={() => setTopUpModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflow: 'visible', pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {topUpBundles.map((bundle, index) => (
              <Card
                key={bundle.id}
                onClick={async () => {
                  try {
                    setCheckoutLoading(bundle.id);
                    const resultAction = await dispatch(createCheckoutSession({
                      priceId: bundle.priceId,
                      productId: bundle.productId
                    }));
                    if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
                      window.location.href = resultAction.payload.url;
                    }
                  } catch (err: any) {
                    setError(err.message || 'Failed to create checkout session');
                  } finally {
                    setCheckoutLoading(null);
                  }
                }}
                sx={{
                  borderRadius: '16px',
                  cursor: 'pointer',
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,122,255,0.15)',
                    borderColor: '#007AFF',
                  },
                }}
              >
                {bundle.badge && (
                  <Chip
                    label={bundle.badge}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 16,
                      background: bundle.badge === 'BEST VALUE'
                        ? 'linear-gradient(135deg, #34C759 0%, #30D158 100%)'
                        : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.65rem',
                    }}
                  />
                )}
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#141418', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {bundle.tokens.toLocaleString()} x <GruviCoin size={22} />
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>
                        Never expires
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#007AFF' }}>
                        ${bundle.price}
                      </Typography>
                      {checkoutLoading === bundle.id ? (
                        <CircularProgress size={16} sx={{ color: '#007AFF' }} />
                      ) : (
                        <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>
                          One-time
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AccountPage; 