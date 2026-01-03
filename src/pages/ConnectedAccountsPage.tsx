import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { 
  Link as LinkIcon,
  LinkOff,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { youtubeApi, tiktokApi } from '../services/api';

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
        sx={{ width: 28, height: 28, objectFit: 'contain' }}
      />
    ),
    color: '#FF0000',
    bgColor: 'rgba(255,0,0,0.1)',
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
        sx={{ width: 24, height: 24, fill: '#000000' }}
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </Box>
    ),
    color: '#000000',
    bgColor: 'rgba(0,0,0,0.1)',
    description: 'Share videos to TikTok',
    available: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: () => (
      <Box 
        sx={{ 
          width: 24, 
          height: 24, 
          borderRadius: '6px',
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box 
          sx={{ 
            width: 14, 
            height: 14, 
            border: '2px solid white', 
            borderRadius: '4px',
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
    bgColor: 'rgba(228,64,95,0.1)',
    description: 'Share Reels to Instagram',
    available: false,
    comingSoon: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: () => (
      <Box 
        sx={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%',
          background: '#1877F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: '16px',
        }}
      >
        f
      </Box>
    ),
    color: '#1877F2',
    bgColor: 'rgba(24,119,242,0.1)',
    description: 'Share videos to Facebook',
    available: false,
    comingSoon: true,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: () => (
      <Box 
        component="img" 
        src="/music-apps/spotify.png" 
        alt="Spotify"
        sx={{ width: 28, height: 28, objectFit: 'contain' }}
      />
    ),
    color: '#1DB954',
    bgColor: 'rgba(29,185,84,0.1)',
    description: 'Distribute music to Spotify',
    available: false,
    comingSoon: true,
  },
  {
    id: 'apple-music',
    name: 'Apple Music',
    icon: () => (
      <Box 
        component="img" 
        src="/music-apps/apple.png" 
        alt="Apple Music"
        sx={{ width: 28, height: 28, objectFit: 'contain' }}
      />
    ),
    color: '#FA233B',
    bgColor: 'rgba(250,35,59,0.1)',
    description: 'Distribute music to Apple Music',
    available: false,
    comingSoon: true,
  },
  {
    id: 'amazon-music',
    name: 'Amazon Music',
    icon: () => (
      <Box 
        component="img" 
        src="/music-apps/amazon.png" 
        alt="Amazon Music"
        sx={{ width: 28, height: 28, objectFit: 'contain' }}
      />
    ),
    color: '#00A8E1',
    bgColor: 'rgba(0,168,225,0.1)',
    description: 'Distribute music to Amazon Music',
    available: false,
    comingSoon: true,
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    icon: () => (
      <Box 
        component="img" 
        src="/music-apps/sound.png" 
        alt="SoundCloud"
        sx={{ width: 28, height: 28, objectFit: 'contain' }}
      />
    ),
    color: '#FF5500',
    bgColor: 'rgba(255,85,0,0.1)',
    description: 'Distribute music to SoundCloud',
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        
        // Redirect to Google OAuth - backend will handle the callback and redirect back
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
        
        // Redirect to TikTok OAuth
        window.location.href = response.data.authUrl;

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to start TikTok connection');
        setConnectionStatus(prev => ({
          ...prev,
          tiktok: { connected: false, loading: false },
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
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#f5f5f7',
      pt: 2,
      pb: 4,
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton onClick={() => navigate('/settings')} sx={{ color: '#007AFF' }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
              Connected Accounts
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B' }}>
              Connect your social accounts to share content directly
            </Typography>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Info Card */}
        <Card sx={{ 
          mb: 3,
          background: 'linear-gradient(135deg, rgba(0,122,255,0.05) 0%, rgba(90,200,250,0.05) 100%)',
          border: '1px solid rgba(0,122,255,0.1)',
          borderRadius: '16px',
          boxShadow: 'none',
          p: 3,
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
            About Connected Accounts
          </Typography>
          <Typography variant="body2" sx={{ color: '#86868B', lineHeight: 1.6 }}>
            Connecting your social accounts allows you to share your AI-generated music and videos directly 
            to your favorite platforms. Upload music videos to YouTube, share clips to TikTok and Instagram, 
            or distribute your songs to streaming services. We only request the minimum permissions needed 
            and you can disconnect at any time.
          </Typography>
        </Card>

        {/* Social Platforms - Individual Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  border: isConnected 
                    ? '2px solid #34C759' 
                    : '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '16px',
                  boxShadow: 'none',
                  p: { xs: 2, sm: 2.5 },
                  opacity: platform.available ? 1 : 0.5,
                }}
              >
                {/* Main Content Row - Responsive */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 1.5, sm: 2 },
                }}>
                  {/* Left: Icon + Info */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    flex: 1,
                    width: '100%',
                  }}>
                    <Box sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      background: platform.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <IconComponent />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '1rem' }}>
                        {platform.name}
                      </Typography>
                      <Typography sx={{ color: '#86868B', fontSize: '0.85rem', mt: 0.25 }}>
                        {platform.description}
                      </Typography>
                      {isConnected && accountName && (
                        <Typography sx={{ fontSize: '0.8rem', color: '#007AFF', fontWeight: 500, mt: 0.25 }}>
                          {accountName}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Right: Action Button */}
                  {platform.available && (
                    <Box sx={{ 
                      flexShrink: 0,
                      width: { xs: '100%', sm: 'auto' },
                      mt: { xs: 0.5, sm: 0 },
                    }}>
                      {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1, px: 3 }}>
                          <CircularProgress size={20} sx={{ color: platform.color }} />
                        </Box>
                      ) : isConnected ? (
                        <Box
                          onClick={() => handleDisconnect(platform.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.75,
                            py: 1,
                            px: 2,
                            borderRadius: '10px',
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
                          <LinkOff className="btn-icon" sx={{ fontSize: 16, color: '#86868B', transition: 'color 0.2s' }} />
                          <Typography className="btn-text" sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#86868B', transition: 'color 0.2s' }}>
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
                            gap: 0.75,
                            py: 1,
                            px: 2.5,
                            borderRadius: '10px',
                            background: platform.color,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              opacity: 0.9,
                            },
                          }}
                        >
                          <LinkIcon sx={{ fontSize: 16, color: '#fff' }} />
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                            Connect
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default ConnectedAccountsPage;

