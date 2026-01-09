import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Alert,
  IconButton,
  Button,
} from '@mui/material';
import {
  Link as LinkIcon,
  LinkOff,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    available: true,
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
    description: 'Share videos to Facebook Page',
    available: true,
    sharedAuth: 'instagram', // Facebook uses same OAuth as Instagram
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 24, height: 24, fill: '#0077B5' }}
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </Box>
    ),
    color: '#0077B5',
    bgColor: 'rgba(0,119,181,0.1)',
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
        sx={{ width: 20, height: 20, fill: '#000000' }}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </Box>
    ),
    color: '#000000',
    bgColor: 'rgba(0,0,0,0.08)',
    description: 'Share videos to X',
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

    if (platformId === 'instagram') {
      setConnectionStatus(prev => ({
        ...prev,
        instagram: { ...prev.instagram, loading: true },
      }));

      try {
        const response = await instagramApi.getAuthUrl(user.userId);
        
        // Redirect to Facebook/Instagram OAuth
        window.location.href = response.data.authUrl;

      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to start Instagram connection');
        setConnectionStatus(prev => ({
          ...prev,
          instagram: { connected: false, loading: false },
        }));
      }
    }
    
    // Facebook uses same OAuth as Instagram
    if (platformId === 'facebook') {
      setConnectionStatus(prev => ({
        ...prev,
        facebook: { ...prev.facebook, loading: true },
      }));

      try {
        // Use Instagram's auth URL - it grants both Instagram and Facebook permissions
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
    <Box sx={{
      py: 4,
      px: { xs: 2, sm: 3, md: 4 },
      width: '100%',
      maxWidth: '100%',
    }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShareIcon sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
              Connected Accounts
            </Typography>
            <Typography sx={{ color: '#86868B' }}>
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

                  {/* Right: Action Button or Coming Soon Badge */}
                  {platform.comingSoon && !platform.available && (
                    <Box sx={{
                      flexShrink: 0,
                      py: 0.75,
                      px: 2,
                      borderRadius: '10px',
                      background: 'rgba(0,0,0,0.05)',
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#86868B' }}>
                        Coming Soon
                      </Typography>
                    </Box>
                  )}
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
    </Box>
  );
};

export default ConnectedAccountsPage;

