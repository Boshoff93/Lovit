import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Alert,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Link as LinkIcon,
  CheckCircle,
  YouTube,
  Add,
  Close,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { youtubeApi, tiktokApi, instagramApi, linkedinApi, socialAccountsApi } from '../services/api';
import { useGetSocialAccountsQuery } from '../store/apiSlice';

// Social platform configurations
const socialPlatforms = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: () => (
      <YouTube sx={{ fontSize: 20, color: '#fff' }} />
    ),
    color: '#FF0000',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
    available: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 18, height: 18, fill: '#fff' }}
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </Box>
    ),
    color: '#000000',
    gradient: '#000000',
    available: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 18, height: 18, fill: '#fff' }}
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </Box>
    ),
    color: '#E4405F',
    gradient: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
    available: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 18, height: 18, fill: '#fff' }}
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </Box>
    ),
    color: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0D5DB8 100%)',
    available: true,
    sharedAuth: 'instagram',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 18, height: 18, fill: '#fff' }}
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </Box>
    ),
    color: '#0077B5',
    gradient: 'linear-gradient(135deg, #0077B5 0%, #005582 100%)',
    available: true,
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 16, height: 16, fill: '#fff' }}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </Box>
    ),
    color: '#000000',
    gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
    available: false,
    comingSoon: true,
  },
];

interface SocialAccount {
  accountId: string;
  platform: string;
  accountName?: string;
  username?: string;
  avatarUrl?: string;
  connectedAt?: string;
}

const ConnectedAccountsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId || '';

  // Fetch all social accounts from the unified endpoint
  const socialAccountsQuery = useGetSocialAccountsQuery({ userId }, { skip: !userId });
  const accounts: SocialAccount[] = socialAccountsQuery.data?.accounts || [];

  // Group accounts by platform
  const accountsByPlatform = useMemo(() => {
    const grouped: Record<string, SocialAccount[]> = {};
    for (const platform of socialPlatforms) {
      grouped[platform.id] = accounts.filter(a => a.platform === platform.id);
    }
    return grouped;
  }, [accounts]);

  // Local state
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [disconnectingAccountId, setDisconnectingAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    const availablePlatforms = socialPlatforms.filter(p => p.available);
    const connectedCount = accounts.length;
    const platformsConnected = availablePlatforms.filter(p => accountsByPlatform[p.id]?.length > 0).length;
    const totalAvailable = availablePlatforms.length;
    const progress = totalAvailable > 0 ? Math.round((platformsConnected / totalAvailable) * 100) : 0;

    return { connectedCount, platformsConnected, totalAvailable, progress };
  }, [accounts, accountsByPlatform]);

  // Handle OAuth redirect result from URL params
  useEffect(() => {
    const youtubeResult = searchParams.get('youtube');
    const tiktokResult = searchParams.get('tiktok');
    const instagramResult = searchParams.get('instagram');
    const message = searchParams.get('message');
    const channel = searchParams.get('channel');
    const username = searchParams.get('username');

    if (youtubeResult === 'success') {
      setSuccess(`YouTube connected${channel ? ` to ${channel}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
      socialAccountsQuery.refetch();
    } else if (youtubeResult === 'error') {
      setError(message || 'Failed to connect YouTube');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }

    if (tiktokResult === 'success') {
      setSuccess(`TikTok connected${username ? ` as @${username}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
      socialAccountsQuery.refetch();
    } else if (tiktokResult === 'error') {
      setError(message || 'Failed to connect TikTok');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }

    if (instagramResult === 'success') {
      setSuccess(`Instagram connected${username ? ` as @${username}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
      socialAccountsQuery.refetch();
    } else if (instagramResult === 'error') {
      setError(message || 'Failed to connect Instagram');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleConnect = async (platformId: string) => {
    if (!userId) return;

    setConnectingPlatform(platformId);

    try {
      let authUrl: string;
      switch (platformId) {
        case 'youtube':
          authUrl = (await youtubeApi.getAuthUrl(userId)).data.authUrl;
          break;
        case 'tiktok':
          authUrl = (await tiktokApi.getAuthUrl(userId)).data.authUrl;
          break;
        case 'instagram':
          authUrl = (await instagramApi.getAuthUrl(userId, 'instagram')).data.authUrl;
          break;
        case 'facebook':
          authUrl = (await instagramApi.getAuthUrl(userId, 'facebook')).data.authUrl;
          break;
        case 'linkedin':
          authUrl = (await linkedinApi.getAuthUrl(userId)).data.authUrl;
          break;
        default:
          throw new Error('Unknown platform');
      }
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to start ${platformId} connection`);
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (accountId: string, platformName: string) => {
    if (!userId) return;

    setDisconnectingAccountId(accountId);

    try {
      await socialAccountsApi.disconnect(userId, accountId);
      socialAccountsQuery.refetch();
      setSuccess(`${platformName} account disconnected`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to disconnect ${platformName}`);
    } finally {
      setDisconnectingAccountId(null);
    }
  };

  const getAccountDisplayName = (account: SocialAccount): string => {
    if (account.username) return `@${account.username}`;
    if (account.accountName) return account.accountName;
    return 'Connected';
  };

  return (
    <Box sx={{ pt: { xs: 0, md: 2 }, pb: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
              flexShrink: 0,
            }}
          >
            <LinkIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              Social Media Integrations
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              Connect your social accounts to share content directly
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, 1fr)' },
        gap: 2,
        mb: 4,
      }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
          p: 2.5,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <CheckCircle sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 20 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: 500 }}>
              Active
            </Typography>
          </Box>
          <Typography sx={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
            {stats.connectedCount}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', mt: 0.5 }}>
            Connected accounts
          </Typography>
        </Box>

        <Box sx={{
          background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 122, 255, 0.25)',
          p: 2.5,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)'
              }} />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: 500 }}>
              Platforms
            </Typography>
          </Box>
          <Typography sx={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
            {stats.platformsConnected}/{stats.totalAvailable}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', mt: 0.5 }}>
            Platforms connected
          </Typography>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            mb: 3,
            borderRadius: '12px',
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#EF4444' },
          }}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess(null)}
          sx={{
            mb: 3,
            borderRadius: '12px',
            bgcolor: 'rgba(52, 199, 89, 0.1)',
            border: '1px solid rgba(52, 199, 89, 0.3)',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#34C759' },
          }}
        >
          {success}
        </Alert>
      )}

      {/* Loading State */}
      {socialAccountsQuery.isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} sx={{ color: '#007AFF' }} />
        </Box>
      )}

      {/* Platform Rows */}
      {!socialAccountsQuery.isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {socialPlatforms.map((platform) => {
            const platformAccounts = accountsByPlatform[platform.id] || [];
            const IconComponent = platform.icon;
            const isConnecting = connectingPlatform === platform.id;
            const hasAccounts = platformAccounts.length > 0;

            return (
              <Box
                key={platform.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: '16px',
                  bgcolor: '#1E1E22',
                  border: '1px solid rgba(255,255,255,0.08)',
                  opacity: platform.available ? 1 : 0.5,
                  transition: 'all 0.2s',
                  flexWrap: 'wrap',
                }}
              >
                {/* Platform Icon + Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: platform.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: hasAccounts ? '2px solid #34C759' : 'none',
                    boxSizing: 'border-box',
                  }}>
                    <IconComponent />
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                    {platform.name}
                  </Typography>
                </Box>

                {/* Account Chips */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flex: 1 }}>
                  {platformAccounts.map((account) => (
                    <Chip
                      key={account.accountId}
                      avatar={
                        account.avatarUrl ? (
                          <Box
                            component="img"
                            src={account.avatarUrl}
                            alt=""
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : undefined
                      }
                      label={getAccountDisplayName(account)}
                      onDelete={() => handleDisconnect(account.accountId, platform.name)}
                      deleteIcon={
                        disconnectingAccountId === account.accountId
                          ? <CircularProgress size={14} sx={{ color: 'rgba(255,255,255,0.5)' }} />
                          : <Close sx={{ fontSize: 16 }} />
                      }
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        height: 38,
                        borderRadius: '19px',
                        px: 0.5,
                        py: 0.5,
                        border: '2px solid #007AFF',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.12)',
                          borderColor: '#3399FF',
                        },
                        '& .MuiChip-avatar': {
                          width: 24,
                          height: 24,
                          ml: 0.5,
                        },
                        '& .MuiChip-deleteIcon': {
                          color: 'rgba(255,255,255,0.5)',
                          '&:hover': { color: '#FF3B30' },
                        },
                      }}
                    />
                  ))}

                  {!hasAccounts && !platform.comingSoon && (
                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      Not connected
                    </Typography>
                  )}

                  {platform.comingSoon && (
                    <Chip
                      label="Coming Soon"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.4)',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        height: 28,
                      }}
                    />
                  )}
                </Box>

                {/* Add / Connect Button */}
                {platform.available && !platform.comingSoon && (
                  <Box sx={{ flexShrink: 0 }}>
                    {isConnecting ? (
                      <CircularProgress size={20} sx={{ color: '#007AFF' }} />
                    ) : (
                      <IconButton
                        onClick={() => handleConnect(platform.id)}
                        size="small"
                        sx={{
                          bgcolor: hasAccounts ? 'rgba(255,255,255,0.08)' : '#007AFF',
                          color: '#fff',
                          width: 32,
                          height: 32,
                          '&:hover': {
                            bgcolor: hasAccounts ? 'rgba(255,255,255,0.15)' : '#0066DD',
                          },
                        }}
                      >
                        <Add sx={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ConnectedAccountsPage;
