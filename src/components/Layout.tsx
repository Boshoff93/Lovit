import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  useMediaQuery,
  Alert,
  Snackbar,
  CircularProgress,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CampaignIcon from '@mui/icons-material/Campaign';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddIcon from '@mui/icons-material/Add';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logoutAllState } from '../store/actions';
import { AppDispatch } from '../store/store';
import { Allowances } from '../store/authSlice';
import { createCheckoutSession, createPortalSession } from '../store/authSlice';
import UpgradePopup from './UpgradePopup';
import { reportPurchaseConversion } from '../utils/googleAds';

// Create a context for the Layout functions
interface LayoutContextType {
  openCharacter: () => void;
  isDrawerOpen: boolean;
  drawerWidth: number;
}

export const LayoutContext = createContext<LayoutContextType | null>(null);

// Hook to use the Layout context
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// Responsive drawer width
const drawerWidth = 360;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(3),
  marginLeft: 0,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme }) => ({
  width: '100%',
  marginLeft: 0,
  backgroundColor: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

interface LayoutProps {
  children: React.ReactNode;
}

const AllowanceDisplay: React.FC<{ 
  allowances: Allowances | null;
  onUpgrade: (type: 'credits') => void;
}> = ({ allowances, onUpgrade }) => {
  if (!allowances) return null;
  
  const totalCredits = (allowances.aiPhotos?.max || 0) + (allowances.aiPhotos?.topup || 0);
  const usedCredits = allowances.aiPhotos?.used || 0;
  const remainingCredits = totalCredits - usedCredits;

  return (
    <Button
      onClick={() => onUpgrade('credits')}
      startIcon={<MusicNoteIcon sx={{ fontSize: 18 }} />}
      sx={{
        borderRadius: '100px',
        textTransform: 'none',
        px: 2.5,
        py: 0.75,
        fontWeight: 500,
        fontSize: '0.875rem',
        minWidth: 'auto',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,0.08)',
        color: '#1D1D1F',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: '#fff',
          borderColor: 'rgba(0,122,255,0.3)',
          color: '#007AFF',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)',
        }
      }}
    >
      {remainingCredits} credits left
    </Button>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Helper to check if path is active
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '?');
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { subscription } = useSelector((state: RootState) => state.auth);
  
  const [open, setOpen] = useState(!useMediaQuery(theme.breakpoints.down('md')));
  
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const [upgradePopup, setUpgradePopup] = useState<{
    open: boolean;
    type: 'credits' | null;
    message: string;
    title: string;
  }>({
    open: false,
    type: null,
    message: '',
    title: ''
  });

  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState(false);

  const isPremiumTier = (subscription?.tier || '').toLowerCase() === 'premium';

  // Update drawer state when screen size changes
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const openCharacter = useCallback(() => {
    navigate('/create?tab=character');
    if (isMobile) {
      setOpen(false);
    }
  }, [navigate, isMobile]);
  
  const handleNavigate = useCallback((path: string, e?: React.MouseEvent) => {
    navigate(path);
    if (isMobile && (!e || !(e.target instanceof Element) || !e.target.closest('.MuiSelect-select'))) {
      setOpen(false);
    }
  }, [navigate, isMobile]);
  
  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const handleLogout = useCallback(() => {
    dispatch(logoutAllState());
    navigate('/login');
    if (isMobile) {
      setOpen(false);
    }
  }, [dispatch, navigate, isMobile]);

  const handleUpgradePopupClose = () => {
    setUpgradePopup(prev => ({
      ...prev,
      open: false,
    }));
  };

  const allowances = useSelector((state: RootState) => state.auth.allowances);

  const handleTopUp = useCallback(async () => {
    try {
      setIsTopUpLoading(true);
      await reportPurchaseConversion();
      
      const resultAction = await dispatch(createCheckoutSession({ 
        priceId: 'price_1RJSklB6HvdZJCd5L5hh2o0C',
        productId: 'prod_SDuZQfG5jCbfwZ'
      }));
      if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
        window.location.href = resultAction.payload.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setNotification({
        open: true,
        message: 'Failed to create checkout session. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsTopUpLoading(false);
    }
  }, [dispatch]);

  const handleUpgrade = useCallback(async () => {
    try {
      setIsUpgradeLoading(true);
      const resultAction = await dispatch(createPortalSession());
      if (createPortalSession.fulfilled.match(resultAction) && resultAction.payload.url) {
        window.location.href = resultAction.payload.url;
      }
    } catch (error) {
      console.error('Failed to access subscription management:', error);
      setNotification({
        open: true,
        message: 'Failed to access subscription management. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsUpgradeLoading(false);
    }
  }, [dispatch]);

  return (
    <LayoutContext.Provider value={{ 
      openCharacter, 
      isDrawerOpen: open, 
      drawerWidth 
    }}>
      <Box sx={{ display: 'flex' }}>
        <AppBarStyled position="fixed" open={isMobile ? false : open}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
            {/* Logo on left */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer' 
              }}
              onClick={() => navigate('/')}
            >
              <Box
                component="img"
                src="/gruvi.png"
                alt="Gruvi"
                sx={{
                  height: 40,
                  width: 40,
                  objectFit: 'contain',
                }}
              />
              <Typography 
                variant="h6" 
                noWrap 
                component="div" 
                sx={{ 
                  fontFamily: '"Fredoka", "Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '1.5rem',
                  letterSpacing: '-0.01em',
                  background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Gruvi
              </Typography>
            </Box>

            {/* Right side - navigation and actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Desktop navigation */}
              {!isMobile && (
                <>
                  <Button
                    onClick={() => handleNavigate('/create')}
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: '20px',
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      color: isActive('/create') ? '#007AFF' : '#1D1D1F',
                      backgroundColor: isActive('/create') ? 'rgba(0,122,255,0.12)' : 'transparent',
                      border: '1px solid',
                      borderColor: isActive('/create') ? 'rgba(0,122,255,0.3)' : 'rgba(0,0,0,0.1)',
                      boxShadow: isActive('/create') ? '0 2px 8px rgba(0,122,255,0.2)' : 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0,122,255,0.08)',
                        boxShadow: '0 2px 8px rgba(0,122,255,0.15)',
                      }
                    }}
                  >
                    Create
                  </Button>
                  <Button
                    onClick={() => handleNavigate('/dashboard')}
                    startIcon={<LibraryMusicIcon />}
                    sx={{
                      borderRadius: '20px',
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      color: isActive('/dashboard') ? '#007AFF' : '#1D1D1F',
                      backgroundColor: isActive('/dashboard') ? 'rgba(0,122,255,0.12)' : 'transparent',
                      border: '1px solid',
                      borderColor: isActive('/dashboard') ? 'rgba(0,122,255,0.3)' : 'rgba(0,0,0,0.1)',
                      boxShadow: isActive('/dashboard') ? '0 2px 8px rgba(0,122,255,0.2)' : 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0,122,255,0.08)',
                        boxShadow: '0 2px 8px rgba(0,122,255,0.15)',
                      }
                    }}
                  >
                    My Library
                  </Button>
                  <Button
                    onClick={() => handleNavigate('/account')}
                    startIcon={<AccountCircleIcon />}
                    sx={{
                      borderRadius: '20px',
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      color: isActive('/account') ? '#007AFF' : '#1D1D1F',
                      backgroundColor: isActive('/account') ? 'rgba(0,122,255,0.12)' : 'transparent',
                      border: '1px solid',
                      borderColor: isActive('/account') ? 'rgba(0,122,255,0.3)' : 'rgba(0,0,0,0.1)',
                      boxShadow: isActive('/account') ? '0 2px 8px rgba(0,122,255,0.2)' : 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0,122,255,0.08)',
                        boxShadow: '0 2px 8px rgba(0,122,255,0.15)',
                      }
                    }}
                  >
                    Account
                  </Button>
                  <Button
                    onClick={() => handleNavigate('/support')}
                    startIcon={<SupportAgentIcon />}
                    sx={{
                      borderRadius: '20px',
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      color: isActive('/support') ? '#007AFF' : '#1D1D1F',
                      backgroundColor: isActive('/support') ? 'rgba(0,122,255,0.12)' : 'transparent',
                      border: '1px solid',
                      borderColor: isActive('/support') ? 'rgba(0,122,255,0.3)' : 'rgba(0,0,0,0.1)',
                      boxShadow: isActive('/support') ? '0 2px 8px rgba(0,122,255,0.2)' : 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0,122,255,0.08)',
                        boxShadow: '0 2px 8px rgba(0,122,255,0.15)',
                      }
                    }}
                  >
                    Support
                  </Button>
                  {user?.isAdmin && (
                    <Button
                      onClick={() => handleNavigate('/admin/email')}
                      startIcon={<CampaignIcon />}
                      sx={{
                        borderRadius: '20px',
                        px: 2,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: isActive('/admin/email') ? '#007AFF' : '#1D1D1F',
                        backgroundColor: isActive('/admin/email') ? 'rgba(0,122,255,0.12)' : 'transparent',
                        border: '1px solid',
                        borderColor: isActive('/admin/email') ? 'rgba(0,122,255,0.3)' : 'rgba(0,0,0,0.1)',
                        boxShadow: isActive('/admin/email') ? '0 2px 8px rgba(0,122,255,0.2)' : 'none',
                        '&:hover': {
                          backgroundColor: 'rgba(0,122,255,0.08)',
                          boxShadow: '0 2px 8px rgba(0,122,255,0.15)',
                        }
                      }}
                    >
                      Campaigns
                    </Button>
                  )}
                </>
              )}
              
              {/* Mobile hamburger menu */}
              {isMobile && (
                <IconButton
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  sx={{ 
                    color: '#007AFF',
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              {/* Credits display - only on desktop */}
              {!isMobile && token && allowances && (
                <AllowanceDisplay 
                  allowances={allowances} 
                  onUpgrade={(type) => {
                    setUpgradePopup({
                      open: true,
                      type,
                      message: 'Upgrade your subscription or top up to generate more songs!',
                      title: 'Song Credits'
                    });
                  }}
                />
              )}

              {!isMobile && token && (
                <IconButton color="secondary" onClick={() => handleLogout()}>
                  <LogoutIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBarStyled>
        {/* Mobile drawer - only shows on small screens */}
        <Drawer
          sx={{
            display: { xs: 'block', md: 'none' },
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '0 16px 16px 0',
            },
          }}
          variant="temporary"
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: false,
            disableScrollLock: true,
            disableEnforceFocus: true,
            disableAutoFocus: true
          }}
          SlideProps={{
            timeout: {
              enter: theme.transitions.duration.enteringScreen,
              exit: theme.transitions.duration.leavingScreen
            }
          }}
        >
          <DrawerHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'left', width: '100%' }}>
                Menu
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerClose} color="primary">
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
            <List sx={{ px: 1 }}>
              {/* Create Section - First */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ 
                    px: 2, 
                    borderRadius: 2, 
                    mb: 1,
                    backgroundColor: isActive('/create') ? 'rgba(0,122,255,0.1)' : 'transparent',
                    border: isActive('/create') ? '2px solid #007AFF' : '2px solid transparent',
                    color: isActive('/create') ? '#007AFF' : '#1D1D1F',
                    '&:hover': {
                      backgroundColor: 'rgba(0,122,255,0.08)',
                    }
                  }}
                  onClick={() => handleNavigate('/create')}
                >
                  <ListItemIcon sx={{ color: isActive('/create') ? '#007AFF' : '#86868B' }}>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Create" 
                    primaryTypographyProps={{ 
                      fontWeight: 600,
                      color: isActive('/create') ? '#007AFF' : '#1D1D1F'
                    }} 
                  />
                </ListItemButton>
              </ListItem>

              {/* My Library Section */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ 
                    px: 2, 
                    borderRadius: 2, 
                    mb: 1,
                    backgroundColor: isActive('/dashboard') ? 'rgba(0,122,255,0.1)' : 'transparent',
                    border: isActive('/dashboard') ? '2px solid #007AFF' : '2px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0,122,255,0.08)',
                    }
                  }}
                  onClick={() => handleNavigate('/dashboard')}
                >
                  <ListItemIcon sx={{ color: '#007AFF' }}>
                    <LibraryMusicIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="My Library" 
                    primaryTypographyProps={{ 
                      fontWeight: isActive('/dashboard') ? 600 : 400,
                      color: isActive('/dashboard') ? '#007AFF' : 'inherit'
                    }} 
                  />
                </ListItemButton>
              </ListItem>

              {/* Account Section */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ 
                    px: 2, 
                    borderRadius: 2, 
                    mb: 1,
                    backgroundColor: isActive('/account') ? 'rgba(0,122,255,0.1)' : 'transparent',
                    border: isActive('/account') ? '2px solid #007AFF' : '2px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0,122,255,0.08)',
                    }
                  }}
                  onClick={() => handleNavigate('/account')}
                >
                  <ListItemIcon sx={{ color: '#007AFF' }}>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Account" 
                    primaryTypographyProps={{ 
                      fontWeight: isActive('/account') ? 600 : 400,
                      color: isActive('/account') ? '#007AFF' : 'inherit'
                    }} 
                  />
                </ListItemButton>
              </ListItem>

              {/* Support Section */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ 
                    px: 2, 
                    borderRadius: 2, 
                    mb: 1,
                    backgroundColor: isActive('/support') ? 'rgba(0,122,255,0.1)' : 'transparent',
                    border: isActive('/support') ? '2px solid #007AFF' : '2px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0,122,255,0.08)',
                    }
                  }}
                  onClick={() => handleNavigate('/support')}
                >
                  <ListItemIcon sx={{ color: '#007AFF' }}>
                    <SupportAgentIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Support" 
                    primaryTypographyProps={{ 
                      fontWeight: isActive('/support') ? 600 : 400,
                      color: isActive('/support') ? '#007AFF' : 'inherit'
                    }} 
                  />
                </ListItemButton>
              </ListItem>

              {/* Campaigns Section - Admin Only */}
              {user?.isAdmin && (
                <ListItem disablePadding>
                  <ListItemButton 
                    sx={{ 
                      px: 2, 
                      borderRadius: 2, 
                      mb: 1,
                      backgroundColor: isActive('/admin/email') ? 'rgba(0,122,255,0.1)' : 'transparent',
                      border: isActive('/admin/email') ? '2px solid #007AFF' : '2px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(0,122,255,0.08)',
                      }
                    }}
                    onClick={() => handleNavigate('/admin/email')}
                  >
                    <ListItemIcon sx={{ color: '#007AFF' }}>
                      <CampaignIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Campaigns" 
                      primaryTypographyProps={{ 
                        fontWeight: isActive('/admin/email') ? 600 : 400,
                        color: isActive('/admin/email') ? '#007AFF' : 'inherit'
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
            
            {/* Credits display in drawer for mobile */}
            {token && allowances && (
              <Box sx={{ px: 2, py: 1.5 }}>
                <Paper
                  onClick={() => {
                    handleDrawerClose();
                    setUpgradePopup({
                      open: true,
                      type: 'credits',
                      message: 'Upgrade your subscription or top up to generate more songs!',
                      title: 'Song Credits'
                    });
                  }}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, rgba(0,122,255,0.05) 0%, rgba(0,122,255,0.1) 100%)',
                    border: '1px solid rgba(0,122,255,0.15)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(0,122,255,0.15) 100%)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <MusicNoteIcon sx={{ color: '#007AFF', fontSize: 20 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                        {((allowances.aiPhotos?.max || 0) + (allowances.aiPhotos?.topup || 0)) - (allowances.aiPhotos?.used || 0)} credits left
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#86868B' }}>
                        Tap to top up
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
            
            {/* Logout button in drawer for mobile */}
            {token && (
              <Box sx={{ px: 2, pb: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    handleDrawerClose();
                    handleLogout();
                  }}
                  startIcon={<LogoutIcon />}
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    color: '#86868B',
                    borderColor: 'rgba(0,0,0,0.1)',
                    '&:hover': {
                      borderColor: '#FF3B30',
                      color: '#FF3B30',
                      backgroundColor: 'rgba(255,59,48,0.05)',
                    }
                  }}
                >
                  Sign Out
                </Button>
              </Box>
            )}

            <Box sx={{ mt: 'auto', p: 2 }}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Pro Tip
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use @CharacterName in your song prompts to include your characters in the lyrics and vocals.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 3, 
              width: '100%', 
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 3, sm: 4 }
            }}
          >
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              {children}
            </Box>
          </Box>
        </Main>
        
        {/* Notification */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            mt: 7,
            [theme.breakpoints.up('md')]: {
              ...(open && {
                marginLeft: `${drawerWidth/2}px`
              })
            }
          }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
        
        {/* Subscription Upgrade Popup */}
        <UpgradePopup
          open={upgradePopup.open}
          type={upgradePopup.type === 'credits' ? 'photo' : null}
          message={upgradePopup.message}
          title={upgradePopup.title}
          isPremiumTier={isPremiumTier}
          onClose={handleUpgradePopupClose}
          onTopUp={handleTopUp}
          onUpgrade={handleUpgrade}
          isTopUpLoading={isTopUpLoading}
          isUpgradeLoading={isUpgradeLoading}
        />
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
