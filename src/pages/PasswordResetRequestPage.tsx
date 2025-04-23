import React, { useCallback, useState } from 'react';
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
import LockResetIcon from '@mui/icons-material/LockReset';
import { useAuth } from '../hooks/useAuth';

const PasswordResetRequestPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { resetPassword, isLoading, error: authError } = useAuth();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return; // The form validation will handle this
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      // Error is handled by Redux and available through useAuth
    }
  },[email, resetPassword, setError]);

  const handleGoToLogin = useCallback(() => {
    navigate('/');
  },[navigate]);

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
          <LockResetIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Reset Your Password
          </Typography>

          {!success ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <Typography color="text.secondary" align="center" paragraph>
                Enter your email address and we'll send you a password reset link.
              </Typography>

              {(error || authError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error || authError}
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
                {isLoading ? <CircularProgress size={24} /> : 'Send Reset Link'}
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
                Reset email sent successfully!
              </Alert>
              <Typography color="text.secondary" paragraph>
                Please check your email inbox for the password reset link.
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

export default PasswordResetRequestPage; 