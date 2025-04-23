import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../hooks/useAuth';
import { useAccountData } from '../hooks/useAccountData';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const ResendVerificationPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { resendVerificationEmail, isLoading, error } = useAuth();
  const hasInitialFetch = useRef<boolean>(false);
  const { fetchAccountData } = useAccountData(false);

  useEffect(() => {
    if (!hasInitialFetch.current) {
      fetchAccountData(true);
      hasInitialFetch.current = true;
    }
  }, [fetchAccountData]);

  // Redirect to dashboard if user is verified
  useEffect(() => {
    if (user?.isVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return; // The form validation will handle this
    }

    try {
      await resendVerificationEmail(email);
      setSuccess(true);
      // Refresh account data after successful email resend
      fetchAccountData(true);
    } catch (error: any) {
      // Error is handled by Redux and available through useAuth
    }
  };

  const handleGoToLogin = useCallback(() => {
    navigate('/');
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
          <EmailIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Resend Verification Email
          </Typography>

          {!success ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <Typography color="text.secondary" align="center" paragraph>
                Enter your email address and we'll send you a new verification link.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Send Verification Email'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleGoToLogin}
                  underline="hover"
                >
                  Back to Home
                </Link>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Verification email sent successfully!
              </Alert>
              <Typography color="text.secondary" paragraph>
                Please check your email inbox for the verification link.
                If you don't see it, please check your spam or junk folder.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGoToLogin}
                sx={{ mt: 2 }}
              >
                Back to Home
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ResendVerificationPage; 