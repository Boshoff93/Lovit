import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const UnsubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const message = searchParams.get('message');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center'
        }}
      >
        {status === 'success' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Unsubscribed Successfully
            </Typography>
            <Typography variant="body1">
              You have been successfully unsubscribed from our emails.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              You can always resubscribe to our emails through your account settings.
            </Typography>
          </Box>
        )}

        {status === 'error' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" color="error" gutterBottom>
              Error
            </Typography>
            <Typography variant="body1">
              {message || 'An error occurred while processing your request'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UnsubscribePage; 