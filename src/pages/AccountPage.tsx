import React from 'react';
import { 
  Box, 
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Avatar
} from '@mui/material';

const AccountPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your profile and account preferences
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              mb: 4
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                alt="User Profile"
                src="/lovit.jpeg"
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Account Status
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Active - Premium Plan
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ mt: 1 }}
              >
                Manage Subscription
              </Button>
              
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                Member Since
              </Typography>
              <Typography variant="body2" color="text.secondary">
                April 2024
              </Typography>
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: '66.667%' } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              mb: 4
            }}
          >
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField 
                  fullWidth 
                  label="First Name" 
                  defaultValue="John" 
                  size="small" 
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField 
                  fullWidth 
                  label="Last Name" 
                  defaultValue="Smith" 
                  size="small" 
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField 
                  fullWidth 
                  label="Email Address" 
                  defaultValue="john.smith@example.com" 
                  size="small" 
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default AccountPage; 