import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  useMediaQuery,
  Alert,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';
import { Allowances, getTokensFromAllowances } from '../store/authSlice';
import { logoutAllState } from '../store/actions';
import { createCheckoutSession, createPortalSession } from '../store/authSlice';
import UpgradePopup from './UpgradePopup';
import TrialPaywallModal from './TrialPaywallModal';
import { stripeConfig, topUpBundles, TopUpBundle } from '../config/stripe';
import { reportPurchaseConversion } from '../utils/googleAds';
import { useAccountData } from '../hooks/useAccountData';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { SidebarContent, CollapsedSidebarContent, CurrentViewingItem } from './SidebarContent';

// Create a context for the Layout functions
interface LayoutContextType {
  openCharacter: () => void;
  isDrawerOpen: boolean;
  drawerWidth: number;
  setCurrentViewingItem: (item: CurrentViewingItem | null) => void;
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

// Sidebar dimensions
const sidebarWidth = 240;
const sidebarCollapsedWidth = 72;
const mobileTopBarHeight = 56;

const Main = styled('main', { shouldForwardProp: (prop) => !['sidebarOpen', 'isMobile', 'sidebarCollapsed'].includes(prop as string) })<{
  sidebarOpen?: boolean;
  isMobile?: boolean;
  sidebarCollapsed?: boolean;
}>(({ theme, isMobile }) => ({
  flexGrow: 1,
  width: '100%',
  minWidth: 0,
  padding: theme.spacing(2),
  marginTop: isMobile ? mobileTopBarHeight : 0,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check if audio player is active to add bottom padding
  const { currentSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;

  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { subscription } = useSelector((state: RootState) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [currentViewingItem, setCurrentViewingItem] = useState<CurrentViewingItem | null>(null);

  const { isLoading: authLoading } = useSelector((state: RootState) => state.auth);
  const isPremiumTier = (subscription?.tier || '').toLowerCase() === 'premium';
  const hasSubscription = subscription?.tier && subscription.tier !== 'free';
  const isTrialing = subscription?.status === 'trialing';

  // Calculate trial days remaining
  const trialDaysRemaining = isTrialing && subscription?.currentPeriodEnd
    ? Math.max(0, Math.ceil((subscription.currentPeriodEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24)))
    : undefined;
  // Show paywall for all free users (no active subscription/trial)
  // - hasUsedTrial === true means trial expired → show "Trial Expired" messaging
  // - hasUsedTrial === false or undefined means new user → show "Start Trial" messaging
  // - Don't show paywall while auth/subscription data is still loading
  const showPaywall = !!user && !hasSubscription && !isTrialing && !authLoading;
  const trialExpired = user?.hasUsedTrial === true;

  // Scroll to top on route change and clear current viewing item
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentViewingItem(null);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    dispatch(logoutAllState());
    navigate('/');
  }, [dispatch, navigate]);

  // Auto-close mobile drawer when screen becomes large
  useEffect(() => {
    if (!isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const openCharacter = useCallback(() => {
    navigate('/ai-assets/create');
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [navigate, isMobile]);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [navigate, isMobile]);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const handleUpgradePopupClose = () => {
    setUpgradePopup(prev => ({
      ...prev,
      open: false,
    }));
  };

  const allowances = useSelector((state: RootState) => state.auth.allowances);

  // Fetch account data on route changes (with 60s cache built into useAccountData)
  const { fetchAccountData } = useAccountData();

  // Fetch on route change - the hook's internal cache prevents excessive API calls
  useEffect(() => {
    if (!token) return;
    fetchAccountData(); // Will be skipped if fetched within last 5 minutes (cache in useAccountData)
  }, [token, location.pathname, fetchAccountData]);

  const handleTopUp = useCallback(async (bundle?: TopUpBundle) => {
    try {
      setIsTopUpLoading(true);
      await reportPurchaseConversion();

      // Use selected bundle or default to first bundle
      const selectedBundle = bundle || topUpBundles[0];

      const resultAction = await dispatch(createCheckoutSession({
        priceId: selectedBundle.priceId,
        productId: selectedBundle.productId
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
    // For free tier users, navigate to payment page instead of Stripe portal
    if (isPremiumTier === false) {
      setIsUpgradeLoading(true);
      navigate('/payment');
      return;
    }

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
  }, [dispatch, isPremiumTier, navigate]);

  // Calculate remaining tokens
  const getRemainingTokens = () => {
    if (!allowances) return 0;
    const tokens = getTokensFromAllowances(allowances);
    return ((tokens?.max || 0) + (tokens?.topup || 0)) - (tokens?.used || 0);
  };

  // Props for sidebar components
  const handleTokensClick = useCallback(() => {
    if (isMobile) setMobileOpen(false);
    setUpgradePopup({
      open: true,
      type: 'credits',
      message: 'Upgrade your subscription or top up to get more tokens!',
      title: 'Tokens'
    });
  }, [isMobile]);

  const handleLogoutClick = useCallback(() => {
    if (isMobile) setMobileOpen(false);
    setLogoutDialogOpen(true);
  }, [isMobile]);

  // Sidebar props
  const sidebarProps = {
    hasToken: !!token && !!allowances,
    remainingTokens: getRemainingTokens(),
    isMobile,
    hasSubscription: !!hasSubscription,
    currentViewingItem,
    onNavigate: handleNavigate,
    onSidebarCollapse: handleSidebarCollapse,
    onTokensClick: handleTokensClick,
    onLogoutClick: handleLogoutClick,
    trialDaysRemaining,
    isTrialActive: isTrialing,
  };

  const collapsedSidebarProps = {
    onNavigate: handleNavigate,
    onSidebarCollapse: handleSidebarCollapse,
    onLogoutClick: handleLogoutClick,
  };

  return (
    <LayoutContext.Provider value={{
      openCharacter,
      isDrawerOpen: mobileOpen,
      drawerWidth: sidebarCollapsed ? sidebarCollapsedWidth : sidebarWidth,
      setCurrentViewingItem
    }}>
      <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 50%, #0D0D0F 100%)' }}>
        {/* Desktop Permanent Sidebar */}
        {!isMobile && (
          <Drawer
            variant="permanent"
            sx={{
              width: sidebarCollapsed ? sidebarCollapsedWidth : sidebarWidth,
              flexShrink: 0,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              '& .MuiDrawer-paper': {
                width: sidebarCollapsed ? sidebarCollapsedWidth : sidebarWidth,
                boxSizing: 'border-box',
                borderRight: '1px solid rgba(0,0,0,0.08)',
                backgroundColor: '#1D1D1F',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                overflowX: 'hidden',
                overflowY: 'auto', // Allow vertical scroll in drawer
              },
            }}
          >
            {sidebarCollapsed ? <CollapsedSidebarContent {...collapsedSidebarProps} /> : <SidebarContent {...sidebarProps} />}
          </Drawer>
        )}

        {/* Mobile Top Bar with Menu Button */}
        {isMobile && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 56,
              backgroundColor: '#1D1D1F',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              zIndex: theme.zIndex.drawer,
              display: 'flex',
              alignItems: 'center',
              px: 2,
              gap: 2,
            }}
          >
            <IconButton
              onClick={handleMobileDrawerToggle}
              sx={{
                color: '#007AFF',
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              component="a"
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
              }}
            >
              <Box
                component="img"
                src="/gruvi.png"
                alt="Gruvi"
                sx={{
                  height: 28,
                  width: 28,
                  objectFit: 'contain',
                }}
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: '"Fredoka", "Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  letterSpacing: '-0.01em',
                  background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Gruvi
              </Typography>
            </Box>
          </Box>
        )}

        {/* Mobile Drawer Sidebar */}
        {isMobile && (
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleMobileDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better mobile performance
            }}
            sx={{
              // Z-index must be higher than FeatureLockedModal overlay (1300) and modal (1301)
              zIndex: 1400,
              '& .MuiDrawer-paper': {
                width: sidebarWidth,
                boxSizing: 'border-box',
                backgroundColor: '#1D1D1F',
              },
            }}
          >
            <SidebarContent
              {...sidebarProps}
              showMobileBackButton={true}
              onMobileBackClick={handleMobileDrawerToggle}
            />
          </Drawer>
        )}

        {/* Main Content */}
        <Main sidebarOpen={!isMobile} isMobile={isMobile} sidebarCollapsed={sidebarCollapsed}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              width: '100%',
              minWidth: 0,
              maxWidth: 1200, // lg breakpoint max width
              mx: 'auto', // center horizontally
              px: { xs: 1, sm: 2, md: 3 },
              py: 2,
              // Add bottom padding when audio player is visible to prevent content from being hidden
              pb: hasActivePlayer ? 12 : 2,
            }}
          >
            <Box sx={{ flexGrow: 1, width: '100%', minWidth: 0 }}>
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
          sx={{ mt: isMobile ? 7 : 2 }}
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

        {/* Trial Paywall Modal - shown for free users (new or trial expired) */}
        <TrialPaywallModal open={showPaywall} trialExpired={trialExpired} />

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
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout;
