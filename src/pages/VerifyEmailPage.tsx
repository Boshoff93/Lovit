import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
  Alert,
  Link
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAuth } from '../hooks/useAuth';
import { useAccountData } from '../hooks/useAccountData';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  const verificationAttempted = useRef(false);
  const hasInitialFetch = useRef<boolean>(false);
  const { fetchAccountData } = useAccountData(false);
  const { verifyUserEmail } = useAuth();

  useEffect(() => {
      fetchAccountData(true);
  }, []);

  useEffect(() => {
    const verifyUserEmailAsync = async () => {
      if (!token || !userId || verificationAttempted.current) {
        return;
      }

      verificationAttempted.current = true;

      try {
        // Use Redux through the useAuth hook to verify email
        await verifyUserEmail(token, userId);
        await fetchAccountData(true);
        setStatus('success');
        setMessage('Your email has been successfully verified!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error || 'Failed to verify your email. The token may be expired or invalid.');
      }
    };

    verifyUserEmailAsync();
  }, [verifyUserEmail, token, userId, fetchAccountData]);

  const handleGoToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleGoToPayment = useCallback(() => {
    navigate('/payment');
  }, [navigate]);

  const handleResendVerification = useCallback(() => {
    navigate('/resend-verification');
  }, [navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 2 
          }}
        >
          {status === 'loading' && (
            <>
              <CircularProgress sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Verifying your email...
              </Typography>
              <Typography color="text.secondary" align="center">
                Please wait while we verify your email address.
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <MarkEmailReadIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Email Verified!
              </Typography>
              <Typography color="text.secondary" align="center" paragraph>
                {message}
              </Typography>
              <Typography color="text.secondary" align="center" paragraph>
                You can now access all the features of Lovit.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleGoToPayment}
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Verification Failed
              </Typography>
              <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                {message}
              </Alert>
              <Typography color="text.secondary" align="center" paragraph>
                If your verification link has expired, you can request a new one.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleResendVerification}
                sx={{ mt: 2 }}
              >
                Resend Verification Email
              </Button>
              <Box sx={{ mt: 2 }}>
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={handleGoToHome}
                  underline="hover"
                >
                  Back to Home
                </Link>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmailPage; 