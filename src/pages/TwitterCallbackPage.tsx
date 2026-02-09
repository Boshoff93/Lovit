import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Check, Error } from '@mui/icons-material';
import { twitterApi } from '../services/api';

/**
 * Twitter/X OAuth Callback Page
 *
 * This page handles the OAuth callback from X after user authorization.
 * X redirects here with ?code=xxx&state=yyy
 * We send these to the backend to exchange for tokens.
 */
const TwitterCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Connecting your X account...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      console.log('[TwitterCallback] Processing callback...');
      console.log('[TwitterCallback] Has code:', !!code);
      console.log('[TwitterCallback] Has state:', !!state);
      console.log('[TwitterCallback] Error:', error);

      if (error) {
        setStatus('error');
        setMessage(error === 'access_denied'
          ? 'X authorization was cancelled.'
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
        console.log('[TwitterCallback] Sending code to backend...');

        const response = await twitterApi.handleCallback(code, state);

        console.log('[TwitterCallback] Backend response:', response.data);

        if (response.data.success) {
          setStatus('success');
          const username = response.data.username || 'your account';
          setMessage(`Connected to @${username}! Redirecting...`);

          // Redirect back to connected accounts page
          setTimeout(() => {
            window.location.href = '/settings/connected-accounts?x=success&username=' + encodeURIComponent(username);
          }, 1500);
        } else {
          setStatus('error');
          setMessage('Failed to connect X. Please try again.');
        }
      } catch (err: any) {
        console.error('[TwitterCallback] Error:', err);
        console.error('[TwitterCallback] Error response:', err.response?.data);
        setStatus('error');
        setMessage(err.response?.data?.error || 'Failed to connect X. Please try again.');
      }
    };

    handleCallback();
  }, []);

  // X logo SVG icon
  const XIcon = () => (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{ width: 40, height: 40, fill: '#fff' }}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </Box>
  );

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
            : 'linear-gradient(135deg, #000000 0%, #333333 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: status === 'success'
            ? '0 8px 24px rgba(52, 199, 89, 0.3)'
            : status === 'error'
            ? '0 8px 24px rgba(255, 59, 48, 0.3)'
            : '0 8px 24px rgba(0, 0, 0, 0.3)',
          mb: 3,
        }}
      >
        {status === 'success' ? (
          <Check sx={{ fontSize: 40, color: '#fff' }} />
        ) : status === 'error' ? (
          <Error sx={{ fontSize: 40, color: '#fff' }} />
        ) : (
          <XIcon />
        )}
      </Box>

      {status === 'processing' && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#141418' }}>
            Connecting to X
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

export default TwitterCallbackPage;
