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
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { logoutAllState } from '../store/actions';
import { createCheckoutSession, getTokensFromAllowances } from '../store/authSlice';
import { topUpBundles } from '../config/stripe';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, subscription, allowances } = useSelector((state: RootState) => state.auth);
  
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<string>(topUpBundles[0].id);

  const tokens = allowances ? getTokensFromAllowances(allowances) : null;
  const remainingTokens = tokens ? (tokens.max || 0) + (tokens.topup || 0) - (tokens.used || 0) : 0;

  const handleLogout = () => {
    dispatch(logoutAllState());
    navigate('/');
  };

  const handleTopUpClick = () => {
    setTopUpDialogOpen(true);
  };

  const handleTopUpConfirm = async () => {
    const bundle = topUpBundles.find(b => b.id === selectedBundle);
    if (!bundle) return;
    
    setIsTopUpLoading(true);
    try {
      const resultAction = await dispatch(createCheckoutSession({
        priceId: bundle.priceId,
        productId: bundle.productId,
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

  const handleSubscription = () => {
    // Always navigate to payment page for subscription management
    navigate('/payment');
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
    },
    {
      icon: <BoltIcon sx={{ color: '#34C759' }} />,
      title: 'Top Up Tokens',
      description: `${remainingTokens} tokens remaining`,
      onClick: handleTopUpClick,
      loading: false, // Loading state shown in dialog
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

        {/* Top Up Tokens Dialog */}
        <Dialog
          open={topUpDialogOpen}
          onClose={() => setTopUpDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              maxWidth: 400,
              width: '100%',
              mx: 2,
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, textAlign: 'center', pt: 3 }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(90,200,250,0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}>
              <BoltIcon sx={{ fontSize: 28, color: '#007AFF' }} />
            </Box>
            Top Up Tokens
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#86868B', textAlign: 'center', mb: 3 }}>
              Select a token bundle to add to your account
            </Typography>
            
            <ToggleButtonGroup
              value={selectedBundle}
              exclusive
              onChange={(_e, newBundle) => newBundle && setSelectedBundle(newBundle)}
              aria-label="token bundle"
              sx={{ 
                width: '100%',
                display: 'flex',
                '& .MuiToggleButton-root': {
                  flex: 1,
                  flexDirection: 'column',
                  py: 2,
                  px: 1,
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '12px !important',
                  mx: 0.5,
                  '&:first-of-type': { ml: 0 },
                  '&:last-of-type': { mr: 0 },
                  '&.Mui-selected': {
                    background: 'rgba(0,122,255,0.08)',
                    borderColor: '#007AFF',
                    '&:hover': {
                      background: 'rgba(0,122,255,0.12)',
                    }
                  }
                }
              }}
            >
              {topUpBundles.map((bundle, index) => (
                <ToggleButton 
                  key={bundle.id} 
                  value={bundle.id}
                  sx={{ position: 'relative' }}
                >
                  {bundle.badge && (
                    <Box sx={{
                      position: 'absolute',
                      top: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: index === 2 ? '#34C759' : '#007AFF',
                      color: '#fff',
                      fontSize: '0.5rem',
                      fontWeight: 700,
                      px: 0.5,
                      py: 0.25,
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                    }}>
                      {bundle.badge}
                    </Box>
                  )}
                  {/* Lightning bolts - 1, 2, or 3 based on bundle size */}
                  <Box sx={{ display: 'flex', gap: 0.25, mb: 0.5 }}>
                    {Array.from({ length: index + 1 }).map((_, i) => (
                      <BoltIcon key={i} sx={{ fontSize: 16, color: '#007AFF' }} />
                    ))}
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1D1D1F' }}>
                    {bundle.tokens.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#007AFF' }}>
                    ${bundle.price}
                  </Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, flexDirection: 'column', gap: 1 }}>
            <Button 
              onClick={handleTopUpConfirm}
              variant="contained"
              fullWidth
              disabled={isTopUpLoading}
              sx={{ 
                borderRadius: '12px',
                py: 1.5,
                background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                }
              }}
            >
              {isTopUpLoading ? (
                <CircularProgress size={20} sx={{ color: '#fff' }} />
              ) : (
                `Purchase ${topUpBundles.find(b => b.id === selectedBundle)?.tokens.toLocaleString()} Tokens`
              )}
            </Button>
            <Button 
              onClick={() => setTopUpDialogOpen(false)}
              fullWidth
              sx={{ 
                borderRadius: '12px',
                color: '#86868B',
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default SettingsPage;

