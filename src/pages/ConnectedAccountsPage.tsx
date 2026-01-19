import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Link as LinkIcon,
  LinkOff,
  CheckCircle,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { youtubeApi, tiktokApi, instagramApi, facebookApi, linkedinApi } from '../services/api';

// Social platform configurations
const socialPlatforms = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: () => (
      <Box
        component="img"
        src="/music-apps/youtube.png"
        alt="YouTube"
        sx={{ width: 32, height: 32, objectFit: 'contain' }}
      />
    ),
    color: '#FF0000',
    bgColor: 'rgba(255,0,0,0.08)',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
    description: 'Upload videos directly to your YouTube channel',
    available: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 28, height: 28, fill: '#000000' }}
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </Box>
    ),
    color: '#000000',
    bgColor: 'rgba(0,0,0,0.06)',
    gradient: 'linear-gradient(135deg, #25F4EE 0%, #FE2C55 50%, #000000 100%)',
    description: 'Share videos to TikTok',
    available: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: () => (
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '8px',
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            border: '2px solid white',
            borderRadius: '5px',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '1px',
              right: '1px',
              width: '3px',
              height: '3px',
              background: 'white',
              borderRadius: '50%',
            }
          }}
        />
      </Box>
    ),
    color: '#E4405F',
    bgColor: 'rgba(228,64,95,0.08)',
    gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    description: 'Share Reels to Instagram',
    available: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: () => (
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#1877F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '18px',
        }}
      >
        f
      </Box>
    ),
    color: '#1877F2',
    bgColor: 'rgba(24,119,242,0.08)',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0D5DB8 100%)',
    description: 'Share videos to Facebook Page',
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
        sx={{ width: 28, height: 28, fill: '#0077B5' }}
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </Box>
    ),
    color: '#0077B5',
    bgColor: 'rgba(0,119,181,0.08)',
    gradient: 'linear-gradient(135deg, #0077B5 0%, #005582 100%)',
    description: 'Share professional video content',
    available: true,
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 24, height: 24, fill: '#000000' }}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </Box>
    ),
    color: '#000000',
    bgColor: 'rgba(0,0,0,0.06)',
    gradient: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
    description: 'Share videos to X',
    available: false,
    comingSoon: true,
  },
];

interface ConnectionStatus {
  [key: string]: {
    connected: boolean;
    channelName?: string;
    channelId?: string;
    username?: string;
    avatarUrl?: string;
    loading: boolean;
  };
}

const ConnectedAccountsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    const availablePlatforms = socialPlatforms.filter(p => p.available);
    const connectedCount = availablePlatforms.filter(p => connectionStatus[p.id]?.connected).length;
    const totalAvailable = availablePlatforms.length;
    const progress = totalAvailable > 0 ? Math.round((connectedCount / totalAvailable) * 100) : 0;
    const notConnectedCount = totalAvailable - connectedCount;

    return { connectedCount, totalAvailable, progress, notConnectedCount };
  }, [connectionStatus]);

  // Handle OAuth redirect result from URL params
  useEffect(() => {
    const youtubeResult = searchParams.get('youtube');
    const tiktokResult = searchParams.get('tiktok');
    const message = searchParams.get('message');
    const channel = searchParams.get('channel');
    const username = searchParams.get('username');

    if (youtubeResult === 'success') {
      setSuccess(`YouTube connected${channel ? ` to ${channel}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
    } else if (youtubeResult === 'error') {
      setError(message || 'Failed to connect YouTube');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }

    if (tiktokResult === 'success') {
      setSuccess(`TikTok connected${username ? ` as @${username}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
    } else if (tiktokResult === 'error') {
      setError(message || 'Failed to connect TikTok');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }

    const instagramResult = searchParams.get('instagram');
    if (instagramResult === 'success') {
      setSuccess(`Instagram connected${username ? ` as @${username}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
    } else if (instagramResult === 'error') {
      setError(message || 'Failed to connect Instagram');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Check connection status on mount
  useEffect(() => {
    const checkConnections = async () => {
      if (!user?.userId) return;

      // Check YouTube
      setConnectionStatus(prev => ({
        ...prev,
        youtube: { ...prev.youtube, loading: true, connected: false },
        tiktok: { ...prev.tiktok, loading: true, connected: false },
        instagram: { ...prev.instagram, loading: true, connected: false },
        facebook: { ...prev.facebook, loading: true, connected: false },
      }));

      // Check YouTube status
      try {
        const response = await youtubeApi.getStatus(user.userId);
        setConnectionStatus(prev => ({
          ...prev,
          youtube: {
            connected: response.data.connected,
            channelName: response.data.channelInfo?.channelTitle,
            channelId: response.data.channelInfo?.channelId,
            loading: false,
          },
        }));
      } catch (err) {
        setConnectionStatus(prev => ({
          ...prev,
          youtube: { connected: false, loading: false },
        }));
      }

      // Check TikTok status
      try {
        const response = await tiktokApi.getStatus(user.userId);
        setConnectionStatus(prev => ({
          ...prev,
          tiktok: {
            connected: response.data.connected,
            username: response.data.username,
            avatarUrl: response.data.avatarUrl,
            loading: false,
          },
        }));
      } catch (err) {
        setConnectionStatus(prev => ({
          ...prev,
          tiktok: { connected: false, loading: false },
        }));
      }

      // Check Instagram status
      try {
        const response = await instagramApi.getStatus(user.userId);
        setConnectionStatus(prev => ({
          ...prev,
          instagram: {
            connected: response.data.connected,
            username: response.data.username,
            avatarUrl: response.data.profilePictureUrl,
            loading: false,
          },
        }));
      } catch (err) {
        setConnectionStatus(prev => ({
          ...prev,
          instagram: { connected: false, loading: false },
        }));
      }

      // Check Facebook status (shares auth with Instagram)
      try {
        const response = await facebookApi.getStatus(user.userId);
        setConnectionStatus(prev => ({
          ...prev,
          facebook: {
            connected: response.data.connected,
            channelName: response.data.pageName,
            channelId: response.data.pageId,
            loading: false,
          },
        }));
      } catch (err) {
        setConnectionStatus(prev => ({
          ...prev,
          facebook: { connected: false, loading: false },
        }));
      }

      // Check LinkedIn status
      try {
        const response = await linkedinApi.getStatus(user.userId);
        setConnectionStatus(prev => ({
          ...prev,
          linkedin: {
            connected: response.data.connected,
            channelName: response.data.name,
            avatarUrl: response.data.profilePictureUrl,
            loading: false,
          },
        }));
      } catch (err) {
        setConnectionStatus(prev => ({
          ...prev,
          linkedin: { connected: false, loading: false },
        }));
      }
    };

    checkConnections();
  }, [user?.userId]);

  const handleConnect = async (platformId: string) => {
    if (!user?.userId) return;

    if (platformId === 'youtube') {
      setConnectionStatus(prev => ({
        ...prev,
        youtube: { ...prev.youtube, loading: true },
      }));

      try {
        const response = await youtubeApi.getAuthUrl(user.userId);
        window.location.href = response.data.authUrl;

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to start YouTube connection');
        setConnectionStatus(prev => ({
          ...prev,
          youtube: { connected: false, loading: false },
        }));
      }
    }

    if (platformId === 'tiktok') {
      setConnectionStatus(prev => ({
        ...prev,
        tiktok: { ...prev.tiktok, loading: true },
      }));

      try {
        const response = await tiktokApi.getAuthUrl(user.userId);
        window.location.href = response.data.authUrl;

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to start TikTok connection');
        setConnectionStatus(prev => ({
          ...prev,
          tiktok: { connected: false, loading: false },
        }));
      }
    }

    if (platformId === 'instagram') {
      setConnectionStatus(prev => ({
        ...prev,
        instagram: { ...prev.instagram, loading: true },
      }));

      try {
        const response = await instagramApi.getAuthUrl(user.userId);
        window.location.href = response.data.authUrl;

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to start Instagram connection');
        setConnectionStatus(prev => ({
          ...prev,
          instagram: { connected: false, loading: false },
        }));
      }
    }

    if (platformId === 'facebook') {
      setConnectionStatus(prev => ({
        ...prev,
        facebook: { ...prev.facebook, loading: true },
      }));

      try {
        const response = await instagramApi.getAuthUrl(user.userId);
        window.location.href = response.data.authUrl;

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to start Facebook connection');
        setConnectionStatus(prev => ({
          ...prev,
          facebook: { connected: false, loading: false },
        }));
      }
    }

    if (platformId === 'linkedin') {
      setConnectionStatus(prev => ({
        ...prev,
        linkedin: { ...prev.linkedin, loading: true },
      }));

      try {
        const response = await linkedinApi.getAuthUrl(user.userId);
        window.location.href = response.data.authUrl;

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to start LinkedIn connection');
        setConnectionStatus(prev => ({
          ...prev,
          linkedin: { connected: false, loading: false },
        }));
      }
    }
  };

  const handleDisconnect = async (platformId: string) => {
    if (!user?.userId) return;

    if (platformId === 'youtube') {
      setConnectionStatus(prev => ({
        ...prev,
        youtube: { ...prev.youtube, loading: true },
      }));

      try {
        await youtubeApi.disconnect(user.userId);
        setConnectionStatus(prev => ({
          ...prev,
          youtube: { connected: false, loading: false },
        }));
        setSuccess('YouTube account disconnected');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to disconnect YouTube');
        setConnectionStatus(prev => ({
          ...prev,
          youtube: { ...prev.youtube, loading: false },
        }));
      }
    }

    if (platformId === 'tiktok') {
      setConnectionStatus(prev => ({
        ...prev,
        tiktok: { ...prev.tiktok, loading: true },
      }));

      try {
        await tiktokApi.disconnect(user.userId);
        setConnectionStatus(prev => ({
          ...prev,
          tiktok: { connected: false, loading: false },
        }));
        setSuccess('TikTok account disconnected');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to disconnect TikTok');
        setConnectionStatus(prev => ({
          ...prev,
          tiktok: { ...prev.tiktok, loading: false },
        }));
      }
    }

    if (platformId === 'instagram') {
      setConnectionStatus(prev => ({
        ...prev,
        instagram: { ...prev.instagram, loading: true },
      }));

      try {
        await instagramApi.disconnect(user.userId);
        setConnectionStatus(prev => ({
          ...prev,
          instagram: { connected: false, loading: false },
        }));
        setSuccess('Instagram account disconnected');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to disconnect Instagram');
        setConnectionStatus(prev => ({
          ...prev,
          instagram: { ...prev.instagram, loading: false },
        }));
      }
    }

    if (platformId === 'linkedin') {
      setConnectionStatus(prev => ({
        ...prev,
        linkedin: { ...prev.linkedin, loading: true },
      }));

      try {
        await linkedinApi.disconnect(user.userId);
        setConnectionStatus(prev => ({
          ...prev,
          linkedin: { connected: false, loading: false },
        }));
        setSuccess('LinkedIn account disconnected');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to disconnect LinkedIn');
        setConnectionStatus(prev => ({
          ...prev,
          linkedin: { ...prev.linkedin, loading: false },
        }));
      }
    }
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 },width: '100%', minWidth: 0, display: "flex", flexDirection: "column", mx: 'auto'}}>
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
            <LinkIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#141418', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              Social Media Integrations
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
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
        {/* Active Connections */}
        <Card sx={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25)',
          p: 2.5,
          border: 'none',
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
        </Card>

        {/* Progress */}
        <Card sx={{
          background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 122, 255, 0.25)',
          p: 2.5,
          border: 'none',
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
              Progress
            </Typography>
          </Box>
          <Typography sx={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
            {stats.progress}%
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', mt: 0.5 }}>
            Setup complete
          </Typography>
        </Card>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 3, borderRadius: '12px' }}>
          {success}
        </Alert>
      )}

      {/* Available to Connect Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Typography sx={{ fontWeight: 600, color: '#141418', fontSize: '1.1rem' }}>
            Available to Connect
          </Typography>
          <Chip
            label={stats.notConnectedCount}
            size="small"
            sx={{
              background: 'rgba(0,0,0,0.06)',
              color: '#86868B',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>

        {/* Social Platform Cards - Grid Layout */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2.5,
        }}>
          {socialPlatforms.map((platform) => {
            const status = connectionStatus[platform.id];
            const IconComponent = platform.icon;
            const isConnected = status?.connected;
            const isLoading = status?.loading;
            const accountName = status?.channelName || (status?.username ? `@${status.username}` : null);

            return (
              <Card
                key={platform.id}
                sx={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '20px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  p: 0,
                  overflow: 'visible',
                  opacity: platform.available ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  '&:hover': platform.available ? {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                  } : {},
                }}
              >
                {/* Status Badge - Top Right Corner */}
                <Box sx={{
                  position: 'absolute',
                  top: -1,
                  right: -1,
                  zIndex: 1,
                }}>
                  {isConnected ? (
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 14, color: '#fff' }} />}
                      label="Connected"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 28,
                        borderRadius: '0 20px 0 12px',
                        '& .MuiChip-icon': { ml: 0.5 },
                      }}
                    />
                  ) : platform.comingSoon ? (
                    <Chip
                      label="Coming Soon"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 28,
                        borderRadius: '0 20px 0 12px',
                      }}
                    />
                  ) : (
                    <Chip
                      label="Not Connected"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 28,
                        borderRadius: '0 20px 0 12px',
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ p: 3, pt: 4 }}>
                  {/* Icon + Name Row */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      background: platform.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}>
                      <IconComponent />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#141418', fontSize: '1.1rem' }}>
                        {platform.name}
                      </Typography>
                      <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
                        {isConnected ? (accountName || 'Connected') : 'Not connected'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Box sx={{
                    height: 1,
                    background: 'rgba(0,0,0,0.06)',
                    mx: -3,
                    mb: 2.5
                  }} />

                  {/* Description */}
                  <Typography sx={{
                    color: '#4B5563',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    mb: 3,
                    minHeight: 44,
                  }}>
                    {platform.description}
                  </Typography>

                  {/* Action Button - Full Width */}
                  {platform.available && (
                    <>
                      {isLoading ? (
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          py: 1.5,
                        }}>
                          <CircularProgress size={24} sx={{ color: '#007AFF' }} />
                        </Box>
                      ) : isConnected ? (
                        <Box
                          onClick={() => handleDisconnect(platform.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            py: 1.5,
                            borderRadius: '14px',
                            border: '1px solid rgba(0,0,0,0.12)',
                            background: '#fff',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: '#FF3B30',
                              background: 'rgba(255,59,48,0.05)',
                              '& .btn-text': { color: '#FF3B30' },
                              '& .btn-icon': { color: '#FF3B30' },
                            },
                          }}
                        >
                          <LinkOff className="btn-icon" sx={{ fontSize: 20, color: '#86868B', transition: 'color 0.2s' }} />
                          <Typography className="btn-text" sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#86868B', transition: 'color 0.2s' }}>
                            Disconnect
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          onClick={() => handleConnect(platform.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            py: 1.5,
                            borderRadius: '14px',
                            background: '#007AFF',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 16px rgba(0, 122, 255, 0.35)',
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(0, 122, 255, 0.5)',
                              background: '#0066DD',
                            },
                          }}
                        >
                          <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                            Connect {platform.name}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectedAccountsPage;
