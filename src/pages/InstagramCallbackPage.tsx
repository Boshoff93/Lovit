import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Check, Error } from '@mui/icons-material';
import { instagramApi } from '../services/api';

/**
 * Instagram OAuth Callback Page
 * 
 * This page handles the OAuth callback from Facebook/Instagram after user authorization.
 * Facebook redirects here with ?code=xxx&state=yyy
 * We send these to the backend to exchange for tokens.
 */
const InstagramCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Connecting your Instagram account...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      console.log('[InstagramCallback] Processing callback...');
      console.log('[InstagramCallback] Has code:', !!code);
      console.log('[InstagramCallback] Has state:', !!state);
      console.log('[InstagramCallback] Error:', error);

      if (error) {
        setStatus('error');
        setMessage(error === 'access_denied' 
          ? 'Instagram authorization was cancelled.'
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
        console.log('[InstagramCallback] Sending code to backend...');
        
        const response = await instagramApi.handleCallback(code, state);

        console.log('[InstagramCallback] Backend response:', response.data);

        if (response.data.success) {
          setStatus('success');
          const username = response.data.username || 'your account';
          setMessage(`Connected to @${username}! Redirecting...`);
          
          // Redirect back to connected accounts page
          setTimeout(() => {
            window.location.href = '/settings/connected-accounts?instagram=success&username=' + encodeURIComponent(username);
          }, 1500);
        } else {
          setStatus('error');
          setMessage('Failed to connect Instagram. Please try again.');
        }
      } catch (err: any) {
        console.error('[InstagramCallback] Error:', err);
        console.error('[InstagramCallback] Error response:', err.response?.data);
        setStatus('error');
        setMessage(err.response?.data?.error || 'Failed to connect Instagram. Please try again.');
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
        background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
        color: '#fff',
        p: 4,
        textAlign: 'center',
      }}
    >
      {status === 'processing' && (
        <>
          <CircularProgress sx={{ color: '#fff', mb: 3 }} size={60} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Connecting to Instagram
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
              bgcolor: 'rgba(255,255,255,0.2)',
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
              bgcolor: 'rgba(0,0,0,0.2)',
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

      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
        {message}
      </Typography>

      {status !== 'processing' && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)', 
            mt: 3,
            cursor: 'pointer',
            '&:hover': { color: 'rgba(255,255,255,1)' },
          }}
          onClick={() => window.location.href = '/settings/connected-accounts'}
        >
          Go back to Connected Accounts
        </Typography>
      )}
    </Box>
  );
};

export default InstagramCallbackPage;



