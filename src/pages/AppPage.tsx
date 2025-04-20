import React from 'react';
import { 
  Box, 
  Container,
  Typography,
  Paper
} from '@mui/material';
import MainTabs from '../components/MainTabs';

const AppPage: React.FC = () => {
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
    </Container>
  );
};

export default AppPage; 