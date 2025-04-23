import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { useLocation, useSearchParams } from 'react-router-dom';
import MainTabs from '../components/MainTabs';
import { useAuth } from '../hooks/useAuth';
import { useAccountData } from '../hooks/useAccountData';

const AppPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hasInitialFetch = useRef<boolean>(false);
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
      fetchAccountData(true);
  }, []);

  useEffect(() => {
    // Check if user just subscribed
    const hasSubscribed = searchParams.get('subscription') === 'true';
    const tier = searchParams.get('tier') || 'Premium';
    
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
    <Container maxWidth="xl" sx={{ py: 5, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Your Lovit Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create, customize and generate AI images of yourself in any outfit
        </Typography>
      </Box>
      
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          bgcolor: 'background.paper',
          p: { xs: 2, sm: 4 }
        }}
      >
        <MainTabs />
      </Paper>

      {/* Subscription Success Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%', bgcolor: '#F5F5DC', color: 'text.primary' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AppPage; 