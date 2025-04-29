import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { useLocation, useSearchParams } from 'react-router-dom';
import MainTabs from '../components/MainTabs';
import { useAuth } from '../hooks/useAuth';
import { useAccountData } from '../hooks/useAccountData';

const AppPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { fetchAccountData } = useAccountData(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch latest account data when the dashboard loads
  useEffect(() => {
      fetchAccountData(false);
  }, []);

  useEffect(() => {
    // Check if user just subscribed
    const hasSubscribed = searchParams.get('subscription') === 'true';
    
    if (hasSubscribed) {
      setNotification({
        open: true,
        message: `Welcome to Lovit! Create a model and start trying on cloths!`,
        severity: 'success'
      });
    }
  }, [searchParams]);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  },[setNotification]);

  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ mb: 4, textAlign: 'center', mx: 'auto' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Style Studio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create AI images of yourself in any outfit
        </Typography>
      </Box>
      
      <Box 
        sx={{ 
          overflow: 'hidden'
        }}
      >
        <MainTabs />
      </Box>

      {/* Subscription Success Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          mt: 7
        }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%',  bgcolor: 'primary.main', color: 'secondary'  }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AppPage; 