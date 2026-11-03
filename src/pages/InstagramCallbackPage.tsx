import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { instagramApi } from '../services/api';

/** The signed analytics state is verified on the backend. Client decoding is only for routing and labels. */
export default function InstagramCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [analytics, setAnalytics] = useState(false);
  const [message, setMessage] = useState('Checking your Meta authorization.');
  const [errorCode, setErrorCode] = useState('');
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const complete = async () => {
      const params = new URLSearchParams(window.location.search);
      window.history.replaceState(null, '', window.location.pathname);
      const code = params.get('code'), state = params.get('state');
      let selectedPlatform: 'instagram' | 'facebook' = 'instagram', isAnalytics = false;
      try {
        const metadata = JSON.parse(atob(state || ''));
        selectedPlatform = metadata.platform === 'facebook' ? 'facebook' : 'instagram';
        isAnalytics = metadata.analytics === true;
      } catch { /* Backend validation remains authoritative. */ }
      setPlatform(selectedPlatform); setAnalytics(isAnalytics);
      if (params.has('error') || !code || !state) {
        setStatus('error'); setMessage(params.get('error') === 'access_denied' ? 'Meta authorization was cancelled. Your existing connection has been kept.' : 'Authorization could not be completed. Return to Gruvi and start again.'); return;
      }
      try {
        const response = isAnalytics ? await instagramApi.handleAnalyticsCallback(code, state) : await instagramApi.handleCallback(code, state);
        if (!response.data.success) throw Error('Connection was not confirmed.');
        const responsePlatform = response.data.platform === 'facebook' ? 'facebook' : selectedPlatform;
        setPlatform(responsePlatform); setStatus('success');
        setMessage(response.data.analytics ? 'Analytics access has been updated. Opening your dashboard.' : 'Your account is connected. Opening Connected accounts.');
        setTimeout(() => { window.location.assign(response.data.analytics ? '/analytics/' + responsePlatform : '/settings/connected-accounts?instagram=success'); }, 1200);
      } catch (error: any) {
        setStatus('error'); setErrorCode(error.response?.data?.code || '');
        setMessage(error.response?.data?.error || 'The connection could not be confirmed. Return to Gruvi and try again.');
      }
    };
    complete();
  }, []);
  const back = analytics ? '/analytics/' + platform : '/settings/connected-accounts';
  return <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: { xs: 2, sm: 4 }, background: '#0d1118', color: '#f4f7fb', boxSizing: 'border-box' }}>
    <Box component="main" sx={{ width: '100%', maxWidth: 580, p: { xs: 3, sm: 4 }, border: '1px solid #ffffff14', borderRadius: '16px', background: '#171e28' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        {status === 'error' ? <ErrorOutline sx={{ color: '#ff7777', fontSize: 30 }}/> : status === 'success' ? <CheckCircleOutline sx={{ color: '#9ee6cf', fontSize: 30 }}/> : null}
        <Typography component="h1" variant="h5" sx={{ fontWeight: 600, color: '#f4f7fb' }}>{status === 'processing' ? 'Connecting to Meta' : status === 'success' ? 'Connection confirmed' : 'Connection needs attention'}</Typography>
      </Box>
      <Typography component="p" sx={{ color: '#b6c0cd', lineHeight: 1.8, fontSize: 15 }}>{message}</Typography>
      {status === 'processing' && <Box aria-label="Checking Meta authorization" role="status" sx={{ mt: 3 }}><Skeleton width="80%"/><Skeleton width="60%"/></Box>}
      {status === 'error' && <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, mt: 3, alignItems: { xs: 'stretch', sm: 'center' } }}>
        {errorCode === 'META_PAGE_ACCESS_REQUIRED' && <Button variant="outlined" href="https://www.facebook.com/settings?tab=business_tools" target="_blank" rel="noopener noreferrer" sx={{ color: '#f4f7fb', borderColor: '#ffffff35', textTransform: 'none', minHeight: 44 }}>Review Meta access ↗</Button>}
        <Button variant="contained" href={back} sx={{ background: '#007aff', color: '#fff', textTransform: 'none', minHeight: 44 }}>{analytics ? 'Back to analytics' : 'Connected accounts'}</Button>
      </Box>}
    </Box>
  </Box>;
}
