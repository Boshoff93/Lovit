import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Check, Error } from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { instagramApi } from '../services/api';

/**
 * Meta OAuth Callback Page (Instagram & Facebook)
 *
 * This page handles the OAuth callback from Facebook/Instagram after user authorization.
 * Facebook redirects here with ?code=xxx&state=yyy
 * We send these to the backend to exchange for tokens.
 * The platform (instagram/facebook) is stored in the state parameter.
 */
const InstagramCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [message, setMessage] = useState('Connecting your account...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      console.log('[MetaCallback] Processing callback...');
      console.log('[MetaCallback] Has code:', !!code);
      console.log('[MetaCallback] Has state:', !!state);
      console.log('[MetaCallback] Error:', error);

      // Try to extract platform from state before making API call
      if (state) {
        try {
          const decodedState = JSON.parse(atob(state));
          const detectedPlatform = decodedState.platform || 'instagram';
          setPlatform(detectedPlatform);
          setMessage(`Connecting your ${detectedPlatform === 'facebook' ? 'Facebook' : 'Instagram'} account...`);
          console.log('[MetaCallback] Platform:', detectedPlatform);
        } catch {
          // Ignore decode errors, keep default platform
        }
      }

      if (error) {
        setStatus('error');
        const platformName = platform === 'facebook' ? 'Facebook' : 'Instagram';
        setMessage(error === 'access_denied'
          ? `${platformName} authorization was cancelled.`
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
        console.log('[MetaCallback] Sending code to backend...');

        const response = await instagramApi.handleCallback(code, state);

        console.log('[MetaCallback] Backend response:', response.data);

        if (response.data.success) {
          // Update platform from response if available
          const responsePlatform = response.data.platform || platform;
          setPlatform(responsePlatform);

          setStatus('success');
          const username = response.data.username || 'your account';
          const platformName = responsePlatform === 'facebook' ? 'Facebook' : 'Instagram';
          setMessage(`Connected to ${platformName}${username ? ` (@${username})` : ''}! Redirecting...`);

          // Redirect back to connected accounts page
          setTimeout(() => {
            window.location.href = '/settings/connected-accounts?instagram=success&username=' + encodeURIComponent(username);
          }, 1500);
        } else {
          setStatus('error');
          const platformName = platform === 'facebook' ? 'Facebook' : 'Instagram';
          setMessage(`Failed to connect ${platformName}. Please try again.`);
        }
      } catch (err: any) {
        console.error('[MetaCallback] Error:', err);
        console.error('[MetaCallback] Error response:', err.response?.data);
        setStatus('error');
        const platformName = platform === 'facebook' ? 'Facebook' : 'Instagram';
        setMessage(err.response?.data?.error || `Failed to connect ${platformName}. Please try again.`);
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
            : platform === 'facebook'
            ? '#1877F2'
            : 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: status === 'success'
            ? '0 8px 24px rgba(52, 199, 89, 0.3)'
            : status === 'error'
            ? '0 8px 24px rgba(255, 59, 48, 0.3)'
            : platform === 'facebook'
            ? '0 8px 24px rgba(24, 119, 242, 0.3)'
            : '0 8px 24px rgba(131, 58, 180, 0.3)',
          mb: 3,
        }}
      >
        {status === 'success' ? (
          <Check sx={{ fontSize: 40, color: '#fff' }} />
        ) : status === 'error' ? (
          <Error sx={{ fontSize: 40, color: '#fff' }} />
        ) : platform === 'facebook' ? (
          <FacebookIcon sx={{ fontSize: 40, color: '#fff' }} />
        ) : (
          <InstagramIcon sx={{ fontSize: 40, color: '#fff' }} />
        )}
      </Box>

      {status === 'processing' && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#141418' }}>
            Connecting to {platform === 'facebook' ? 'Facebook' : 'Instagram'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#86868B', mb: 3 }}>
            {message}
          </Typography>
          <CircularProgress sx={{ color: platform === 'facebook' ? '#1877F2' : '#007AFF' }} size={32} />
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

export default InstagramCallbackPage;
