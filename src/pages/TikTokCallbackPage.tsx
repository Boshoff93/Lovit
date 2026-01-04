import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Check, Error } from '@mui/icons-material';
import axios from 'axios';

/**
 * TikTok OAuth Callback Page
 * 
 * This page handles the OAuth callback from TikTok after user authorization.
 * TikTok redirects here with ?code=xxx&state=yyy
 * We send these to the backend to exchange for tokens.
 */
const TikTokCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Connecting your TikTok account...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      console.log('[TikTokCallback] Processing callback...');
      console.log('[TikTokCallback] Has code:', !!code);
      console.log('[TikTokCallback] Has state:', !!state);
      console.log('[TikTokCallback] Error:', error);

      if (error) {
        setStatus('error');
        setMessage(error === 'access_denied' 
          ? 'TikTok authorization was cancelled.'
          : `Authorization failed: ${errorDescription || error}`
        );
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization parameters.');
        return;
      }

      try {
        console.log('[TikTokCallback] Sending code to backend...');
        
        // Call the backend directly (no auth required for this public endpoint)
        const response = await axios.post(
          'https://api.gruvimusic.com/api/public/tiktok/callback',
          { code, state }
        );

        console.log('[TikTokCallback] Backend response:', response.data);

        if (response.data.success) {
          setStatus('success');
          const username = response.data.username || 'your account';
          setMessage(`Connected to ${username}! Redirecting...`);
          
          // Redirect back to connected accounts page
          setTimeout(() => {
            window.location.href = '/settings/connected-accounts?tiktok=success&username=' + encodeURIComponent(username);
          }, 1500);
        } else {
          setStatus('error');
          setMessage('Failed to connect TikTok. Please try again.');
        }
      } catch (err: any) {
        console.error('[TikTokCallback] Error:', err);
        console.error('[TikTokCallback] Error response:', err.response?.data);
        setStatus('error');
        setMessage(err.response?.data?.error || 'Failed to connect TikTok. Please try again.');
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
          <CircularProgress sx={{ color: '#000000', mb: 3 }} size={60} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Connecting to TikTok
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
          onClick={() => window.location.href = '/settings/connected-accounts'}
        >
          Go back to Connected Accounts
        </Typography>
      )}
    </Box>
  );
};

export default TikTokCallbackPage;


