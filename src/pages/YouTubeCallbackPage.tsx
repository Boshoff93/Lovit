import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Check, Error } from '@mui/icons-material';
import axios from 'axios';

/**
 * YouTube OAuth Callback Page
 * 
 * This page handles the OAuth callback from YouTube after user authorization.
 * Google redirects here with ?code=xxx&state=yyy
 * We send these to the backend to exchange for tokens.
 * The parent page polls the status to detect when connection is complete.
 */
const YouTubeCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Connecting your YouTube account...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      console.log('[YouTubeCallback] Processing callback...');
      console.log('[YouTubeCallback] Has code:', !!code);
      console.log('[YouTubeCallback] Has state:', !!state);
      console.log('[YouTubeCallback] Error:', error);

      if (error) {
        setStatus('error');
        setMessage(error === 'access_denied' 
          ? 'YouTube authorization was cancelled.'
          : `Authorization failed: ${error}`
        );
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization parameters.');
        return;
      }

      try {
        console.log('[YouTubeCallback] Sending code to backend...');
        
        // Call the backend directly (no auth required for this public endpoint)
        const response = await axios.post(
          'https://api.gruvimusic.com/api/public/youtube/callback',
          { code, state }
        );

        console.log('[YouTubeCallback] Backend response:', response.data);

        if (response.data.success) {
          setStatus('success');
          const channelName = response.data.channelName || 'your channel';
          setMessage(`Connected to ${channelName}! Redirecting...`);
          
          // Redirect back to connected accounts page
          setTimeout(() => {
            window.location.href = '/settings/connected-accounts?youtube=success&channel=' + encodeURIComponent(channelName);
          }, 1500);
        } else {
          setStatus('error');
          setMessage('Failed to connect YouTube. Please try again.');
        }
      } catch (err: any) {
        console.error('[YouTubeCallback] Error:', err);
        console.error('[YouTubeCallback] Error response:', err.response?.data);
        setStatus('error');
        setMessage(err.response?.data?.error || 'Failed to connect YouTube. Please try again.');
      }
    };

    handleCallback();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1D1D1F 0%, #2D2D2F 100%)',
        color: '#fff',
        p: 4,
        textAlign: 'center',
      }}
    >
      {status === 'processing' && (
        <>
          <CircularProgress sx={{ color: '#FF0000', mb: 3 }} size={60} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Connecting to YouTube
          </Typography>
        </>
      )}

      {status === 'success' && (
        <>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#34C759',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Check sx={{ fontSize: 48, color: '#fff' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Connected!
          </Typography>
        </>
      )}

      {status === 'error' && (
        <>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#FF3B30',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Error sx={{ fontSize: 48, color: '#fff' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Connection Failed
          </Typography>
        </>
      )}

      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
        {message}
      </Typography>

      {status !== 'processing' && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.5)', 
            mt: 3,
            cursor: 'pointer',
            '&:hover': { color: 'rgba(255,255,255,0.8)' },
          }}
          onClick={() => window.close()}
        >
          Click here to close this window
        </Typography>
      )}
    </Box>
  );
};

export default YouTubeCallbackPage;
