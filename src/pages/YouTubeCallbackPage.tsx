import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Check, Error } from '@mui/icons-material';
import YouTubeIcon from '@mui/icons-material/YouTube';
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
        background: '#fff',
        p: 4,
        textAlign: 'center',
      }}
    >
      {/* Status Icon */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '20px',
          background: status === 'success'
            ? 'linear-gradient(135deg, #34C759 0%, #2DB14E 100%)'
            : status === 'error'
            ? 'linear-gradient(135deg, #FF3B30 0%, #E02020 100%)'
            : 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: status === 'success'
            ? '0 8px 24px rgba(52, 199, 89, 0.3)'
            : status === 'error'
            ? '0 8px 24px rgba(255, 59, 48, 0.3)'
            : '0 8px 24px rgba(255, 0, 0, 0.3)',
          mb: 3,
        }}
      >
        {status === 'success' ? (
          <Check sx={{ fontSize: 40, color: '#fff' }} />
        ) : status === 'error' ? (
          <Error sx={{ fontSize: 40, color: '#fff' }} />
        ) : (
          <YouTubeIcon sx={{ fontSize: 40, color: '#fff' }} />
        )}
      </Box>

      {status === 'processing' && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#141418' }}>
            Connecting to YouTube
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868B', mb: 3 }}>
            {message}
          </Typography>
          <CircularProgress sx={{ color: '#007AFF' }} size={32} />
        </>
      )}

      {status === 'success' && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#141418' }}>
            Connected!
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868B' }}>
            {message}
          </Typography>
        </>
      )}

      {status === 'error' && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#141418' }}>
            Connection Failed
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868B' }}>
            {message}
          </Typography>
        </>
      )}

      {status !== 'processing' && (
        <Typography
          variant="body2"
          sx={{
            color: '#007AFF',
            mt: 4,
            cursor: 'pointer',
            fontWeight: 500,
            '&:hover': { textDecoration: 'underline' },
          }}
          onClick={() => window.location.href = '/settings/connected-accounts'}
        >
          Go back to Connected Accounts
        </Typography>
      )}
    </Box>
  );
};

export default YouTubeCallbackPage;
