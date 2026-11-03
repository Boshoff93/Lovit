import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import React, { useCallback, useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Alert,
  CircularProgress,
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createPortalSession, refreshUserData } from '../store/authSlice';
import { useAccountData } from '../hooks/useAccountData';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { updateEmailPreferences } from '../store/authSlice';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/Key';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { userApi, AgentKey } from '../services/api';
import { useGetScheduledPostsQuery } from '../store/apiSlice';

const AccountPage: React.FC = () => {
  const { user, subscription, createStripePortal } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const isFreeTier = !subscription?.tier || subscription.tier === 'free';
  const { fetchAccountData, isLoading, error: fetchError } = useAccountData(false);
  const scheduledPostsQuery = useGetScheduledPostsQuery();
  const schedulingLimits = scheduledPostsQuery.data?.schedulingLimits;

  useEffect(() => {
    fetchAccountData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [portalLoading, setPortalLoading] = useState(false);
  const [emailPreferencesLoading, setEmailPreferencesLoading] = useState(false);

  // Profile editing state - single field for Profile Name
  const [artistName, setArtistName] = useState(user?.artistName || user?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);

  // Agent Keys state
  const [agentKeys, setAgentKeys] = useState<AgentKey[]>([]);
  const [agentKeysLoading, setAgentKeysLoading] = useState(true);
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

  // Format subscription tier for display
  const formatTier = useCallback((tier: string) => {
    return ({ free: 'Free setup', starter: 'Starter', pro: 'Scale', scale: 'Scale', premium: 'Pro', beast: 'Pro', hardcore: 'Pro' } as Record<string, string>)[tier] || tier;
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
    setCopySuccess(false);
  }, []);

  return (
    <Box className="gd gd-account-page" sx={{ pt: { xs: 0, md: 2 }, pb: 4, px: { xs: 0, sm: 0, md: 0 }, width: '100%', maxWidth: '100%' }}>
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
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
            Account
          </Typography>
          <Typography sx={{ color: '#aab4c2' }}>
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
        bgcolor: '#171e28',
        border: '1px solid rgba(255,255,255,0.06)',
        p: 3,
      }}>
        {/* User Info Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
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
            <Typography sx={{ color: '#aab4c2', fontSize: '0.9rem' }}>
              {user?.artistName || user?.name || 'No profile name set'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ color: '#aab4c2', fontSize: '0.8rem', mb: 0.5 }}>Member Since</Typography>
              <Typography sx={{ fontWeight: 600, color: '#fff' }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ color: '#aab4c2', fontSize: '0.8rem', mb: 0.5 }}>Plan</Typography>
              <Typography sx={{ fontWeight: 600, color: '#f4f7fb' }}>
                {formatTier(subscription?.tier || 'free')}
              </Typography>
            </Box>
          </Box>
        </Box>

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
                  <Typography sx={{ fontSize: '0.85rem', color: '#aab4c2' }}>
                    Status: {subscription?.status || 'Active'}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.85rem', color: '#aab4c2' }}>
                  {subscription?.currentPeriodEnd && subscription.currentPeriodEnd > 0
                    ? `Renews: ${new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
                    : 'No renewal date'}
                </Typography>
              </Box>
            </Box>

          </Box>
          <div className="gd-card-actions">
            <Button
              className="gd-primary-action gd-card-action"
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
          </div>
        </Box>

        {/* Scheduling Limits */}
        {!isFreeTier && (() => {
          const TIER_LIMITS: Record<string, number> = { starter: 60, pro: 120, scale: 120, premium: 240, beast: 240, hardcore: 240 };
          const tierLimit = TIER_LIMITS[(subscription?.tier || 'starter').toLowerCase()] || 60;
          const used = schedulingLimits?.used ?? 0;
          const limit = schedulingLimits?.limit ?? tierLimit;
          const remaining = Math.max(0, limit - used);

          return (
          <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(6,182,212,0.2) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5,
                }}>
                  <CalendarMonthIcon sx={{ fontSize: 22, color: '#3B82F6' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: '#fff' }}>
                    Scheduled Posts
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#aab4c2' }}>
                    Monthly limit resets each billing cycle
                  </Typography>
                </Box>
              </Box>

            </Box>
            <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff' }}>
                {remaining.toLocaleString()}
                <Typography component="span" sx={{ fontSize: '0.9rem', color: '#aab4c2', ml: 1 }}>
                  posts remaining
                </Typography>
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#aab4c2' }}>
                {used.toLocaleString()} / {limit.toLocaleString()} used
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculateAllowancePercentage(used, limit)}
              sx={{
                height: 8, borderRadius: 4, my: 1,
                backgroundColor: 'rgba(59,130,246,0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: remaining <= 5
                    ? 'linear-gradient(135deg, #FF3B30, #FF6B6B)'
                    : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                },
              }}
            />
            <div className="gd-card-actions">
              <Button
                className="gd-primary-action gd-card-action"
                variant="contained"
                size="small"
                onClick={() => navigate('/settings/scheduled-content')}
              >
                View Calendar
              </Button>
            </div>
          </Box>
          );
        })()}

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
                    '& input::placeholder': { color: '#91aaa9' },
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
                    color: '#aab4c2',
                    '& input': { color: '#aab4c2', py: 1.5, fontSize: '1rem' },
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  }
                }}
              />
              <Typography sx={{ color: '#aab4c2', mt: 0.5, fontSize: '0.8rem' }}>
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
                <Typography sx={{ color: '#aab4c2', fontSize: '0.85rem' }}>
                  API keys for AI agents to access Gruvi
                </Typography>
              </Box>
            </Box>

          </Box>

          {agentKeysLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <WorkspaceSkeleton label="Loading agent keys" kind="list" rows={2} />
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
              <Typography sx={{ color: '#aab4c2', fontSize: '0.85rem' }}>
                Create an agent key to let Claude, OpenClaw, or other AI assistants use Gruvi on your behalf
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
                        <Typography sx={{ color: '#aab4c2', fontSize: '0.8rem' }}>
                          Created: {new Date(key.createdAt).toLocaleDateString()}
                        </Typography>
                        {key.lastUsedAt && (
                          <Typography sx={{ color: '#aab4c2', fontSize: '0.8rem' }}>
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
                        sx={{ color: '#aab4c2', '&:hover': { color: '#FF3B30' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          <Box sx={{ mt: 2, p: 2, border: '1px solid #007AFF25', borderRadius: '12px', bgcolor: '#111822' }}>
            <Typography sx={{ color: '#aab4c2', fontSize: '0.85rem' }}>Configure an MCP client, manage your keys and follow the publishing workflow in Agent Access.</Typography>
            <Button sx={{ px: 0 }} onClick={() => navigate('/agents')}>Set up agent access →</Button>
          </Box>
          <div className="gd-card-actions">
            <Button
              className="gd-primary-action gd-card-action"
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
          </div>
        </Box>

        {/* Email Notifications */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#aab4c2' }}>
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
            bgcolor: '#171e28',
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
                  color: '#fff',
                  wordBreak: 'break-all',
                  mb: 2,
                }}>
                  {newlyCreatedKey}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Button
                    variant="contained"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleCopyKey(newlyCreatedKey)}
                    sx={{
                      borderRadius: '10px',
                      px: 3,
                      py: 1,
                      fontWeight: 600,
                      textTransform: 'none',
                      background: '#007AFF',
                      '&:hover': {
                        background: '#0056CC',
                      }
                    }}
                  >
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </Button>
                </Box>
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
                    '& input::placeholder': { color: '#91aaa9' },
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
            bgcolor: '#171e28',
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

          </Box>
  );
};

export default AccountPage;
