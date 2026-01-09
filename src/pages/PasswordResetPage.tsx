import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../hooks/useAuth';

const PasswordResetPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { confirmResetPassword, isLoading, error, subscription } = useAuth();
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  const isPremiumMember = subscription?.tier && subscription.tier !== 'free'

  useEffect(() => {
    if (!token) {
      navigate('/reset-password-request');
    }
  }, [token, navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous validation errors
    setValidationError(null);
    
    // Validation
    if (!newPassword || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setValidationError('Password must be at least 8 characters and include at least one capital letter, one number, and one special character');
      return;
    }
    
    if (!token) {
      setValidationError('Reset token is missing');
      return;
    }

    if (!userId) {
      setValidationError('User ID is missing');
      return;
    }

    try {
      // Call API to reset password with token and userId
      const result = await confirmResetPassword(token, newPassword, userId);
      
      if (result.type.endsWith('/fulfilled')) {
        setSuccess(true);
      }
    } catch (error: any) {
      // Error is handled by Redux and available through useAuth
    }
  }, [confirmResetPassword, token, confirmPassword, newPassword, userId]);

  const handleBackToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (!token) {
    return null;
  }

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
          <LockOutlinedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Reset Your Password
          </Typography>

          {!success ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <Typography color="text.secondary" align="center" paragraph>
                Please enter your new password below.
              </Typography>

              {(error || validationError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {validationError || error}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleBackToHome}
                  underline="hover"
                >
                  Back to Home
                </Link>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Your password has been successfully reset!
              </Alert>
              <Typography color="text.secondary" paragraph>
                You will be redirected to {isPremiumMember ? 'your dashboard' : 'the payment page'} in a few seconds...
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(isPremiumMember ? '/my-music' : '/payment')}
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default PasswordResetPage; 