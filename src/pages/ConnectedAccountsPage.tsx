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
  YouTube,
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
    icon: () => <YouTube sx={{ color: '#FF0000', fontSize: 28 }} />,
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
        sx={{ 
          width: 24, 
          height: 24, 
          borderRadius: '50%',
          background: '#1DB954',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box 
          component="svg" 
          viewBox="0 0 24 24" 
          sx={{ width: 16, height: 16, fill: 'white' }}
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </Box>
      </Box>
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
        sx={{ 
          width: 24, 
          height: 24, 
          borderRadius: '6px',
          background: 'linear-gradient(180deg, #FA233B 0%, #FB5C74 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box 
          component="svg" 
          viewBox="0 0 24 24" 
          sx={{ width: 14, height: 14, fill: 'white' }}
        >
          <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.295-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.785-.404-2.17-1.266-.34-.76-.166-1.71.46-2.32.44-.43.99-.65 1.59-.74.357-.053.72-.074 1.08-.112.36-.04.714-.09.967-.35.14-.142.21-.34.21-.554V8.946c0-.46-.274-.69-.737-.608-.36.064-.72.134-1.08.203l-3.896.74c-.027.005-.056.01-.082.02-.257.064-.39.22-.405.487-.003.06-.005.12-.005.18v7.395c0 .482-.054.96-.26 1.4-.293.63-.79 1.03-1.46 1.22-.36.1-.73.16-1.1.18-.94.05-1.83-.36-2.22-1.29-.32-.76-.15-1.69.5-2.3.43-.4.97-.62 1.56-.71.36-.06.72-.08 1.08-.12.37-.04.72-.1.98-.37.17-.174.24-.4.24-.65V5.97c0-.2.03-.39.1-.57.1-.27.32-.46.59-.52.14-.03.28-.06.42-.08l5.49-1.05c.38-.07.76-.14 1.14-.21.26-.05.52-.1.78-.12.46-.03.74.25.74.71v6z"/>
        </Box>
      </Box>
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
        sx={{ 
          width: 24, 
          height: 24, 
          borderRadius: '6px',
          background: 'linear-gradient(180deg, #25D1DA 0%, #1A8CFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box 
          component="svg" 
          viewBox="0 0 24 24" 
          sx={{ width: 16, height: 16, fill: 'white' }}
        >
          <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.659.659 0 01-.752.076c-1.057-.878-1.247-1.287-1.826-2.124-1.746 1.779-2.982 2.312-5.243 2.312-2.676 0-4.762-1.651-4.762-4.958 0-2.581 1.401-4.333 3.393-5.19 1.727-.756 4.141-.891 5.983-1.1v-.41c0-.754.058-1.646-.385-2.296-.385-.582-1.124-.822-1.776-.822-1.207 0-2.284.619-2.547 1.9-.054.284-.264.564-.552.578l-3.087-.333c-.26-.057-.548-.266-.475-.659.71-3.738 4.093-4.865 7.12-4.865 1.548 0 3.571.41 4.793 1.583 1.55 1.441 1.402 3.365 1.402 5.458v4.94c0 1.486.618 2.137 1.199 2.94.203.288.248.633-.009.847-.645.538-1.791 1.539-2.422 2.1l-.054-.047z"/>
        </Box>
      </Box>
    ),
    color: '#00A8E1',
    bgColor: 'rgba(0,168,225,0.1)',
    description: 'Distribute music to Amazon Music',
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

