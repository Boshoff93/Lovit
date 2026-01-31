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
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Snackbar,
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
import KeyIcon from '@mui/icons-material/Key';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { stripeConfig, topUpBundles } from '../config/stripe';
import { userApi, AgentKey } from '../services/api';

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
  
  // Agent Keys state
  const [agentKeys, setAgentKeys] = useState<AgentKey[]>([]);
  const [agentKeysLoading, setAgentKeysLoading] = useState(false);
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState(false);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setArtistName(user.artistName || user.name || '');
    }
  }, [user]);

  // Fetch agent keys on mount
  useEffect(() => {
    const fetchAgentKeys = async () => {
      setAgentKeysLoading(true);
      try {
        const response = await userApi.listAgentKeys();
        setAgentKeys(response.data.keys || []);
      } catch (err) {
        console.error('Failed to fetch agent keys:', err);
      } finally {
        setAgentKeysLoading(false);
      }
    };
    fetchAgentKeys();
  }, []);

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

  const handleCreateAgentKey = useCallback(async () => {
    if (!newKeyName.trim()) return;

    setCreatingKey(true);
    setError(null);

    try {
      const response = await userApi.createAgentKey(newKeyName.trim());
      setNewlyCreatedKey(response.data.key);
      setAgentKeys(prev => [...prev, {
        keyId: response.data.keyId,
        name: response.data.name,
        createdAt: response.data.createdAt,
      }]);
      setNewKeyName('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create agent key');
    } finally {
      setCreatingKey(false);
    }
  }, [newKeyName]);

  const handleCopyKey = useCallback((key: string) => {
    navigator.clipboard.writeText(key);
    setCopySuccess(true);
  }, []);

  const handleDeleteAgentKey = useCallback(async () => {
    if (!deleteKeyId) return;

    setDeletingKey(true);
    setError(null);

    try {
      await userApi.deleteAgentKey(deleteKeyId);
      setAgentKeys(prev => prev.filter(k => k.keyId !== deleteKeyId));
      setDeleteKeyId(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete agent key');
    } finally {
      setDeletingKey(false);
    }
  }, [deleteKeyId]);

  const handleCloseNewKeyDialog = useCallback(() => {
    setCreateKeyDialogOpen(false);
    setNewlyCreatedKey(null);
    setNewKeyName('');
  }, []);

  return (
    <Box sx={{ pt: { xs: 0, md: 2 }, pb: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
            Account
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Manage your profile and subscription
          </Typography>
        </Box>
      </Box>

      {(error || fetchError) && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: '12px',
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#EF4444' },
          }}
          onClose={() => setError(null)}
        >
          {error || fetchError}
        </Alert>
      )}

      {/* Main Content Paper */}
      <Paper sx={{
        borderRadius: '16px',
        bgcolor: '#1E1E22',
        border: '1px solid rgba(255,255,255,0.06)',
        p: 3,
      }}>
        {/* User Info Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                {user?.email || 'Loading...'}
              </Typography>
              <Chip
                label={user?.isVerified ? 'Verified' : 'Unverified'}
                size="small"
                sx={{
                  fontWeight: 500,
                  background: user?.isVerified ? 'rgba(52,199,89,0.15)' : 'rgba(255,149,0,0.15)',
                  color: user?.isVerified ? '#34C759' : '#FF9500',
                }}
              />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
              {user?.artistName || user?.name || 'No profile name set'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Member Since</Typography>
              <Typography sx={{ fontWeight: 600, color: '#fff' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Plan</Typography>
              <Typography sx={{ fontWeight: 600, color: '#007AFF' }}>
                {formatTier(subscription?.tier || 'free')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tokens Section */}
        {allowances && (
          <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
            Your Tokens
          </Typography>
          <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <GruviCoin size={40} sx={{ mr: 1.5 }} />
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#fff' }}>
                  Tokens
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
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
                    <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
                      {remaining.toLocaleString()}
                      <Typography component="span" sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', ml: 1 }}>
                        tokens remaining
                      </Typography>
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
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
          </Box>
        )}

        {/* Subscription Details */}
        <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
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
                <Typography sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                  {formatTier(subscription?.tier || 'free')} Plan
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Box sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: subscription?.status === 'active' ? '#34C759' : '#FF9500',
                  }} />
                  <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                    Status: {subscription?.status || 'Active'}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
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
              sx={{
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: 180 },
                background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                  boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
                },
                '&.Mui-disabled': {
                  background: portalLoading
                    ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                    : 'rgba(255,255,255,0.12)',
                  color: portalLoading ? '#fff' : 'rgba(255,255,255,0.3)',
                },
              }}
            >
              {portalLoading ? (
                <CircularProgress size={20} sx={{ color: '#fff' }} />
              ) : (
                isFreeTier ? 'Upgrade Plan' : 'Manage Subscription'
              )}
            </Button>
          </Box>
        </Box>

        {/* Personal Information */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 3 }}>
            Personal Information
          </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Profile Name */}
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#fff', mb: 1, fontSize: '0.9rem' }}>
              Profile Name
            </Typography>
              <TextField
                fullWidth
                placeholder="Enter your artist or director name"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                disabled={!isEditingName}
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    '& input': { color: '#fff', py: 1.5, fontSize: '1rem' },
                    '& input::placeholder': { color: 'rgba(255,255,255,0.4)' },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                    '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.03)' },
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#007AFF !important' },
                  },
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
              <Typography sx={{ fontWeight: 600, color: '#fff', mb: 1, fontSize: '0.9rem' }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                value={user?.email || ''}
                disabled
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.5)',
                    '& input': { color: 'rgba(255,255,255,0.5)', py: 1.5, fontSize: '1rem' },
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  }
                }}
              />
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, fontSize: '0.8rem' }}>
                Email cannot be changed
              </Typography>
            </Box>
        </Box>
        </Box>

        {/* Agent Keys Section */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SmartToyIcon sx={{ color: '#8B5CF6' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Agent Keys
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                  API keys for AI agents to access Gruvi
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setCreateKeyDialogOpen(true)}
              sx={{
                borderRadius: '10px',
                px: 2,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                  boxShadow: '0 4px 12px rgba(139,92,246,0.4)',
                }
              }}
            >
              Create Key
            </Button>
          </Box>

          {agentKeysLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} sx={{ color: '#8B5CF6' }} />
            </Box>
          ) : agentKeys.length === 0 ? (
            <Box sx={{
              py: 4,
              px: 3,
              textAlign: 'center',
              bgcolor: 'rgba(139,92,246,0.05)',
              borderRadius: '12px',
              border: '1px dashed rgba(139,92,246,0.3)',
            }}>
              <KeyIcon sx={{ fontSize: 40, color: 'rgba(139,92,246,0.4)', mb: 1 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                No agent keys yet
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                Create an agent key to let Claude, ChatGPT, or other AI assistants use Gruvi on your behalf
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {agentKeys.map((key, index) => (
                <ListItem
                  key={key.keyId}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: '10px',
                    mb: index < agentKeys.length - 1 ? 1 : 0,
                    px: 2,
                  }}
                >
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    bgcolor: 'rgba(139,92,246,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}>
                    <KeyIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />
                  </Box>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 500, color: '#fff' }}>
                        {key.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                          Created: {new Date(key.createdAt).toLocaleDateString()}
                        </Typography>
                        {key.lastUsedAt && (
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                            Last used: {new Date(key.lastUsedAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Delete key">
                      <IconButton
                        edge="end"
                        onClick={() => setDeleteKeyId(key.keyId)}
                        sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#FF3B30' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          <Box sx={{
            mt: 2,
            p: 2,
            bgcolor: 'rgba(139,92,246,0.08)',
            borderRadius: '10px',
            border: '1px solid rgba(139,92,246,0.2)',
          }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', mb: 1 }}>
              Give your agent key to an AI assistant to let it create content for you. Example:
            </Typography>
            <Box sx={{
              p: 1.5,
              bgcolor: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: '#8B5CF6',
            }}>
              export GRUVI_KEY="gruvi_agent_xxxx"
            </Box>
          </Box>
        </Box>

        {/* Email Notifications */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
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
                      fontWeight: 600,
                      background: user?.emailPreferences?.notifications ? '#34C759' : 'rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  />
                )
              }
              sx={{ m: 0 }}
            />
          </Box>
        </Box>
      </Paper>

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
            bgcolor: '#1E1E22',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
              Need More Tokens?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
              Top-up tokens never expire!
            </Typography>
          </Box>
          <IconButton onClick={() => setTopUpModalOpen(false)} size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ overflow: 'visible', pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {topUpBundles.map((bundle, index) => {
              const isThisBundleLoading = checkoutLoading === bundle.id;
              const isAnyLoading = checkoutLoading !== null;
              return (
              <Card
                key={bundle.id}
                sx={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  bgcolor: '#141418',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'visible',
                  opacity: isAnyLoading && !isThisBundleLoading ? 0.5 : 1,
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
                      zIndex: 1,
                    }}
                  />
                )}
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box>
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        +{bundle.tokens.toLocaleString()} x <GruviCoin size={22} />
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        Never expires
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                      ${bundle.price}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={isAnyLoading}
                    onClick={async () => {
                      if (isAnyLoading) return;
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
                      py: 1,
                      borderRadius: '10px',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                      },
                      '&.Mui-disabled': {
                        background: isThisBundleLoading
                          ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                          : 'rgba(255,255,255,0.12)',
                        color: isThisBundleLoading ? '#fff' : 'rgba(255,255,255,0.3)',
                      },
                    }}
                  >
                    {isThisBundleLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={18} sx={{ color: '#fff' }} />
                        <span>Loading...</span>
                      </Box>
                    ) : (
                      'Buy Now'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
            })}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Create Agent Key Dialog */}
      <Dialog
        open={createKeyDialogOpen}
        onClose={handleCloseNewKeyDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 1,
            bgcolor: '#1E1E22',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SmartToyIcon sx={{ color: '#8B5CF6' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
              {newlyCreatedKey ? 'Agent Key Created' : 'Create Agent Key'}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseNewKeyDialog} size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {newlyCreatedKey ? (
            <Box>
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255,149,0,0.1)',
                  border: '1px solid rgba(255,149,0,0.3)',
                  color: '#fff',
                  '& .MuiAlert-icon': { color: '#FF9500' },
                }}
              >
                Copy this key now. You won't be able to see it again!
              </Alert>
              <Box sx={{
                p: 2,
                bgcolor: 'rgba(0,0,0,0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(139,92,246,0.3)',
              }}>
                <Typography sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  color: '#8B5CF6',
                  wordBreak: 'break-all',
                  mb: 2,
                }}>
                  {newlyCreatedKey}
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => handleCopyKey(newlyCreatedKey)}
                  sx={{
                    borderRadius: '10px',
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                    }
                  }}
                >
                  Copy to Clipboard
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                Give your key a name to help you remember what it's used for.
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g., Claude Desktop, My AI Agent"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                autoFocus
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    '& input': { color: '#fff', py: 1.5 },
                    '& input::placeholder': { color: 'rgba(255,255,255,0.4)' },
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2) !important' },
                    '&.Mui-focused fieldset': { borderColor: '#8B5CF6 !important' },
                  }
                }}
              />
            </Box>
          )}
        </DialogContent>
        {!newlyCreatedKey && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseNewKeyDialog}
              sx={{ borderRadius: '10px', color: 'rgba(255,255,255,0.7)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAgentKey}
              variant="contained"
              disabled={!newKeyName.trim() || creatingKey}
              sx={{
                borderRadius: '10px',
                px: 3,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              {creatingKey ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create Key'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Delete Agent Key Confirmation Dialog */}
      <Dialog
        open={!!deleteKeyId}
        onClose={() => setDeleteKeyId(null)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1,
            bgcolor: '#1E1E22',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#fff' }}>Delete Agent Key?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            This will permanently revoke this key. Any agents using it will no longer be able to access your account.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteKeyId(null)}
            disabled={deletingKey}
            sx={{ borderRadius: '10px', color: 'rgba(255,255,255,0.7)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAgentKey}
            variant="contained"
            color="error"
            disabled={deletingKey}
            sx={{ borderRadius: '10px' }}
          >
            {deletingKey ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        message="Copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default AccountPage; 