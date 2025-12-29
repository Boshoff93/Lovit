import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  ChevronRight as ChevronRightIcon,
  HelpOutline as HelpOutlineIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  HeadsetMic as SupportIcon,
  CreditCard as SubscriptionIcon,
  Bolt as BoltIcon,
  Face as FaceIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { logoutAllState } from '../store/actions';
import { createCheckoutSession, createPortalSession, getTokensFromAllowances } from '../store/authSlice';
import { stripeConfig } from '../config/stripe';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, subscription, allowances } = useSelector((state: RootState) => state.auth);
  
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const tokens = allowances ? getTokensFromAllowances(allowances) : null;
  const remainingTokens = tokens ? (tokens.max || 0) + (tokens.topup || 0) - (tokens.used || 0) : 0;

  const handleLogout = () => {
    dispatch(logoutAllState());
    navigate('/');
  };

  const handleTopUp = async () => {
    setIsTopUpLoading(true);
    try {
      const resultAction = await dispatch(createCheckoutSession({
        priceId: stripeConfig.topUp.priceId,
        productId: stripeConfig.topUp.productId,
      }));
      if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
        window.location.href = resultAction.payload.url;
      }
    } catch (error) {
      console.error('Top up error:', error);
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const handleSubscription = async () => {
    // If free tier, go to payment page
    if (!subscription || subscription.tier === 'free') {
      navigate('/payment');
      return;
    }
    
    // Otherwise, go to Stripe portal
    setIsPortalLoading(true);
    try {
      const resultAction = await dispatch(createPortalSession());
      if (createPortalSession.fulfilled.match(resultAction) && resultAction.payload.url) {
        window.location.href = resultAction.payload.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
    } finally {
      setIsPortalLoading(false);
    }
  };

  const getTierDisplay = () => {
    if (!subscription || subscription.tier === 'free') return 'Free Plan';
    return `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan`;
  };

  const navigationItems = [
    {
      icon: <PersonIcon sx={{ color: '#007AFF' }} />,
      title: 'Account',
      description: 'View your account details',
      onClick: () => navigate('/account'),
    },
    {
      icon: <FaceIcon sx={{ color: '#007AFF' }} />,
      title: 'My Cast',
      description: 'Characters, products & places for your videos',
      onClick: () => navigate('/my-cast'),
    },
    {
      icon: <SubscriptionIcon sx={{ color: '#007AFF' }} />,
      title: subscription && subscription.tier !== 'free' ? 'Manage Subscription' : 'Upgrade Plan',
      description: getTierDisplay(),
      onClick: handleSubscription,
      loading: isPortalLoading,
    },
    {
      icon: <BoltIcon sx={{ color: '#34C759' }} />,
      title: 'Top Up Tokens',
      description: `${remainingTokens} tokens remaining`,
      onClick: handleTopUp,
      loading: isTopUpLoading,
    },
    {
      icon: <HelpOutlineIcon sx={{ color: '#007AFF' }} />,
      title: 'FAQ',
      description: 'Frequently asked questions',
      onClick: () => navigate('/faq', { state: { fromDashboard: true } }),
    },
    {
      icon: <SupportIcon sx={{ color: '#007AFF' }} />,
      title: 'Support',
      description: 'Get help with Gruvi',
      onClick: () => navigate('/support'),
    },
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      pt: 2,
      pb: { xs: 2, sm: 4 },
      px: { xs: 1, sm: 2 },
    }}>
      <Container maxWidth="md" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        p: 0
      }}>
        {/* User Info Card */}
        <Card sx={{
          width: '100%', 
        mb: 2,
        background: 'linear-gradient(135deg, rgba(0,122,255,0.05) 0%, rgba(90,200,250,0.05) 100%)',
        border: '1px solid rgba(0,122,255,0.1)',
        borderRadius: '16px',
        boxShadow: 'none',
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1D1D1F',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email || 'user@email.com'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B' }}>
                {getTierDisplay()}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              px: 2,
              py: 1,
              borderRadius: '20px',
              flexShrink: 0,
            }}>
              <BoltIcon sx={{ color: '#fff', fontSize: 20 }} />
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600 }}>
                {remainingTokens}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

        {/* Navigation List */}
        <Card sx={{ 
          width: '100%',
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '16px',
          boxShadow: 'none',
          overflow: 'hidden',
        }}>
          <List sx={{ p: 0 }}>
            {navigationItems.map((item, index) => (
              <Box key={index}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={item.onClick}
                    disabled={item.loading}
                    sx={{
                      py: 2,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(0,122,255,0.05)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 44 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: 'rgba(0,122,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {item.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title}
                      secondary={item.description}
                      sx={{ 
                        '& .MuiTypography-root': { 
                          color: '#1D1D1F',
                          fontWeight: 500
                        },
                        '& .MuiTypography-body2': {
                          color: '#86868B',
                          fontWeight: 400,
                        }
                      }}
                    />
                    {item.loading ? (
                      <CircularProgress size={20} sx={{ color: '#007AFF' }} />
                    ) : (
                      <ChevronRightIcon sx={{ color: '#C7C7CC' }} />
                    )}
                  </ListItemButton>
                </ListItem>
                {index < navigationItems.length - 1 && (
                  <Divider sx={{ ml: 9 }} />
                )}
              </Box>
            ))}
          </List>
        </Card>

        {/* Sign Out Button */}
        <Card sx={{ 
          width: '100%',
          mt: 2,
          background: '#fff',
          border: '1px solid rgba(255,59,48,0.2)',
          borderRadius: '16px',
          boxShadow: 'none',
          overflow: 'hidden',
        }}>
          <List sx={{ p: 0 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setLogoutDialogOpen(true)}
                sx={{
                  py: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255,59,48,0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 44 }}>
                  <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: 'rgba(255,59,48,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <LogoutIcon sx={{ color: '#FF3B30' }} />
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary="Sign Out"
                  sx={{ 
                    '& .MuiTypography-root': { 
                      color: '#FF3B30',
                      fontWeight: 500
                    }
                  }}
                />
                <ChevronRightIcon sx={{ color: 'rgba(255,59,48,0.5)' }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Card>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              p: 1,
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Sign Out</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to sign out?</Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => setLogoutDialogOpen(false)}
              sx={{ borderRadius: '10px' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogout}
              variant="contained"
              color="error"
              sx={{ borderRadius: '10px' }}
            >
              Sign Out
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SettingsPage;

