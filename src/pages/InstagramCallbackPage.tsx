import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Check, Error } from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
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
            : 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: status === 'success'
            ? '0 8px 24px rgba(52, 199, 89, 0.3)'
            : status === 'error'
            ? '0 8px 24px rgba(255, 59, 48, 0.3)'
            : '0 8px 24px rgba(131, 58, 180, 0.3)',
          mb: 3,
        }}
      >
        {status === 'success' ? (
          <Check sx={{ fontSize: 40, color: '#fff' }} />
        ) : status === 'error' ? (
          <Error sx={{ fontSize: 40, color: '#fff' }} />
        ) : (
          <InstagramIcon sx={{ fontSize: 40, color: '#fff' }} />
        )}
      </Box>

      {status === 'processing' && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1D1D1F' }}>
            Connecting to Instagram
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868B', mb: 3 }}>
            {message}
          </Typography>
          <CircularProgress sx={{ color: '#007AFF' }} size={32} />
        </>
      )}

      {status === 'success' && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1D1D1F' }}>
            Connected!
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868B' }}>
            {message}
          </Typography>
        </>
      )}

      {status === 'error' && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1D1D1F' }}>
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

export default InstagramCallbackPage;
