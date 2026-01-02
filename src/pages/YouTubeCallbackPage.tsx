import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Check, Error } from '@mui/icons-material';

/**
 * YouTube OAuth Callback Page
 * 
 * This page handles the OAuth callback from YouTube after user authorization.
 * It extracts the authorization code and state from the URL, then:
 * 1. Sends them back to the parent window (MusicVideoPlayer page)
 * 2. Shows success/error message
 * 3. Auto-closes after a brief delay
 */
const YouTubeCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Connecting your YouTube account...');

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

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

      // Send the code and state back to the parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'youtube-oauth-callback',
          code,
          state,
        }, window.location.origin);

        setStatus('success');
        setMessage('YouTube connected! You can close this window.');

        // Auto-close after a short delay
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Could not communicate with the main window. Please close this and try again.');
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

