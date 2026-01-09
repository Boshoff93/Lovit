import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import MovieIcon from '@mui/icons-material/Movie';
import BoltIcon from '@mui/icons-material/Bolt';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinkIcon from '@mui/icons-material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';
import { Allowances, getTokensFromAllowances } from '../store/authSlice';
import { logoutAllState } from '../store/actions';
import { createCheckoutSession, createPortalSession } from '../store/authSlice';
import UpgradePopup from './UpgradePopup';
import { stripeConfig, topUpBundles, TopUpBundle } from '../config/stripe';
import { reportPurchaseConversion } from '../utils/googleAds';
import { useAccountData } from '../hooks/useAccountData';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

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

// Navigation items configuration - grouped like Followr
// CREATE section - for creating new content
const createItems = [
  { path: '/create/music', label: 'Create Music', icon: MusicNoteIcon },
  { path: '/create/video', label: 'Create Video', icon: MovieIcon },
  { path: '/my-cast/create', label: 'Create Cast', icon: PersonAddIcon },
];

// UPLOAD section - for uploading content
const uploadItems = [
  { path: '/upload', label: 'Upload Music', icon: MusicNoteIcon, params: '?type=song' },
  { path: '/upload', label: 'Upload Video', icon: MovieIcon, params: '?type=video' },
];

// CONTENT section - for viewing your content
const contentItems = [
  { path: '/my-music', label: 'My Music', icon: LibraryMusicIcon },
  { path: '/my-videos', label: 'My Videos', icon: VideoLibraryIcon },
  { path: '/my-cast', label: 'My Cast', icon: FolderSpecialIcon },
];

const publishItems = [
  { path: '/settings/connected-accounts', label: 'Integrations', icon: LinkIcon },
  { path: '/settings/scheduled-content', label: 'Scheduled Posts', icon: CalendarMonthIcon },
];

const accountItems = [
  { path: '/account', label: 'Account', icon: AccountCircleIcon },
  { path: '/payment', label: 'Subscription', icon: CreditCardIcon },
  { path: '/support', label: 'Support', icon: HeadsetMicIcon },
  { path: '/faq', label: 'Help & FAQ', icon: HelpOutlineIcon },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check if audio player is active to add bottom padding
  const { currentSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;

  // Helper to check if path is active
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/') || location.pathname.startsWith(path + '?');
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
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

  const isPremiumTier = (subscription?.tier || '').toLowerCase() === 'premium';
  const hasSubscription = subscription?.tier && subscription.tier !== 'free';

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
    navigate('/create?tab=character');
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [navigate, isMobile]);

  const handleNavigate = useCallback((path: string, e?: React.MouseEvent) => {
    // Pass state for FAQ to indicate it's from dashboard
    if (path === '/faq') {
      navigate(path, { state: { fromDashboard: true } });
    } else {
      navigate(path);
    }
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

  // Sidebar content component
  const SidebarContent = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      py: 2,
      // Add bottom padding when audio player is visible to prevent Sign Out from being hidden
      pb: hasActivePlayer ? 10 : 2,
    }}>
      {/* Logo and Collapse button row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 3 }}>
        {/* Logo - links to homepage for SEO */}
        <Box
          component="a"
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          <Box
            component="img"
            src="/gruvi.png"
            alt="Gruvi"
            sx={{
              height: 36,
              width: 36,
              objectFit: 'contain',
            }}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontFamily: '"Fredoka", "Inter", sans-serif',
              fontWeight: 600,
              fontSize: '1.4rem',
              letterSpacing: '-0.01em',
              background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Gruvi
          </Typography>
        </Box>

        {/* Collapse button - only on desktop */}
        {!isMobile && (
          <IconButton
            onClick={handleSidebarCollapse}
            size="small"
            sx={{
              color: '#86868B',
              '&:hover': {
                color: '#007AFF',
                backgroundColor: 'rgba(0,122,255,0.08)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Tokens Display */}
      {token && allowances && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Button
            fullWidth
            onClick={() => {
              if (isMobile) setMobileOpen(false);
              setUpgradePopup({
                open: true,
                type: 'credits',
                message: 'Upgrade your subscription or top up to get more tokens!',
                title: 'Tokens'
              });
            }}
            sx={{
              borderRadius: '12px',
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
              }
            }}
          >
            <BoltIcon sx={{ fontSize: 20, color: '#fff' }} />
            <span style={{ color: '#fff' }}>{getRemainingTokens().toLocaleString()} Tokens</span>
          </Button>
        </Box>
      )}

      {/* Scrollable content area */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {/* CREATE Section */}
        <Typography
          variant="caption"
          sx={{
            px: 3,
            py: 1,
            display: 'block',
            color: '#86868B',
            fontWeight: 600,
            fontSize: '0.65rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Create
        </Typography>
        <List sx={{ px: 1, pb: 1 }}>
          {createItems.map((item, index) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const isLocked = !hasSubscription && item.path === '/create/video';
            return (
              <ListItem key={`${item.path}-${index}`} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: active ? 'rgba(0,122,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon sx={{
                      fontSize: 20,
                      color: active ? '#007AFF' : '#86868B',
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.875rem',
                      color: active ? '#007AFF' : '#1D1D1F',
                    }}
                  />
                  {isLocked && (
                    <LockIcon sx={{ fontSize: 14, color: '#86868B', ml: 1 }} />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* UPLOAD Section */}
        <Typography
          variant="caption"
          sx={{
            px: 3,
            py: 1,
            display: 'block',
            color: '#86868B',
            fontWeight: 600,
            fontSize: '0.65rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Upload
        </Typography>
        <List sx={{ px: 1, pb: 1 }}>
          {uploadItems.map((item, index) => {
            const Icon = item.icon;
            const fullPath = item.path + (item.params || '');
            const active = location.pathname === item.path && (item.params ? location.search === item.params : true);
            return (
              <ListItem key={`${item.path}-${index}`} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => handleNavigate(fullPath)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: active ? 'rgba(0,122,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon sx={{
                      fontSize: 20,
                      color: active ? '#007AFF' : '#86868B',
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.875rem',
                      color: active ? '#007AFF' : '#1D1D1F',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* CONTENT Section */}
        <Typography
          variant="caption"
          sx={{
            px: 3,
            py: 1,
            display: 'block',
            color: '#86868B',
            fontWeight: 600,
            fontSize: '0.65rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Content
        </Typography>
        <List sx={{ px: 1, pb: 1 }}>
          {contentItems.map((item, index) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            // Show "My Videos" as active when viewing a video
            const isViewingVideo = item.path === '/my-videos' && location.pathname.startsWith('/video/');
            // Show "My Cast" as active when editing a cast member
            const isEditingCast = item.path === '/my-cast' && location.pathname.startsWith('/my-cast/edit/');
            const isHighlighted = active || isViewingVideo || isEditingCast;
            const showIndicator = isViewingVideo || isEditingCast;
            return (
              <ListItem key={`${item.path}-${index}`} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: isHighlighted ? 'rgba(0,122,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isHighlighted ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon sx={{
                      fontSize: 20,
                      color: isHighlighted ? '#007AFF' : '#86868B',
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isHighlighted ? 600 : 500,
                      fontSize: '0.875rem',
                      color: isHighlighted ? '#007AFF' : '#1D1D1F',
                    }}
                  />
                  {showIndicator && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#007AFF',
                        ml: 1,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* PUBLISHING Section */}
        <Typography
          variant="caption"
          sx={{
            px: 3,
            py: 1,
            display: 'block',
            color: '#86868B',
            fontWeight: 600,
            fontSize: '0.65rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Publishing
        </Typography>
        <List sx={{ px: 1, pb: 1 }}>
          {publishItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isLocked = !hasSubscription;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: active ? 'rgba(0,122,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon sx={{
                      fontSize: 20,
                      color: active ? '#007AFF' : '#86868B',
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.875rem',
                      color: active ? '#007AFF' : '#1D1D1F',
                    }}
                  />
                  {isLocked && (
                    <LockIcon sx={{ fontSize: 14, color: '#86868B', ml: 1 }} />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* ACCOUNT Section */}
        <Typography
          variant="caption"
          sx={{
            px: 3,
            py: 1,
            display: 'block',
            color: '#86868B',
            fontWeight: 600,
            fontSize: '0.65rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Account
        </Typography>
        <List sx={{ px: 1 }}>
          {accountItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: active ? 'rgba(0,122,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon sx={{
                      fontSize: 20,
                      color: active ? '#007AFF' : '#86868B',
                    }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.875rem',
                      color: active ? '#007AFF' : '#1D1D1F',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Sign Out Button - Fixed at bottom */}
      <Box sx={{ px: 1, pb: 1, pt: 1 }}>
        <Divider sx={{ mb: 1 }} />
        <ListItemButton
          onClick={() => {
            if (isMobile) setMobileOpen(false);
            setLogoutDialogOpen(true);
          }}
          sx={{
            borderRadius: '10px',
            py: 1,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(255,59,48,0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon sx={{ fontSize: 20, color: '#FF3B30' }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign Out"
            primaryTypographyProps={{
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#FF3B30',
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  // Collapsed sidebar content - icons only (for desktop)
  const CollapsedSidebarContent = () => {
    // All items combined for collapsed view
    const allItems = [
      ...createItems,
      ...uploadItems,
      ...contentItems,
      ...publishItems,
      ...accountItems,
    ];

    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        py: 2,
        alignItems: 'center',
        // Add bottom padding when audio player is visible to prevent Sign Out from being hidden
        pb: hasActivePlayer ? 10 : 2,
      }}>
        {/* Logo only */}
        <Box
          component="a"
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          <Box
            component="img"
            src="/gruvi.png"
            alt="Gruvi"
            sx={{
              height: 32,
              width: 32,
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Expand button */}
        <IconButton
          onClick={handleSidebarCollapse}
          sx={{
            mb: 2,
            background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
            color: '#fff',
            width: 40,
            height: 40,
            '&:hover': {
              background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>

        {/* Scrollable icons */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
          <List sx={{ px: 1 }}>
            {allItems.map((item, index) => {
              const Icon = item.icon;
              const fullPath = item.path + ((item as any).params || '');
              const active = location.pathname === item.path && ((item as any).params ? location.search === (item as any).params : true);
              return (
                <ListItem key={`${item.path}-${index}`} disablePadding sx={{ mb: 0.5, justifyContent: 'center' }}>
                  <ListItemButton
                    onClick={() => handleNavigate(fullPath)}
                    sx={{
                      borderRadius: '10px',
                      py: 1.25,
                      px: 1.25,
                      minWidth: 0,
                      justifyContent: 'center',
                      backgroundColor: active ? 'rgba(0,122,255,0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: active ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                      <Icon sx={{
                        fontSize: 22,
                        color: active ? '#007AFF' : '#86868B',
                      }} />
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Sign Out Icon */}
        <Box sx={{ px: 1, pb: 1, pt: 1 }}>
          <Divider sx={{ mb: 1, mx: 1 }} />
          <ListItemButton
            onClick={() => setLogoutDialogOpen(true)}
            sx={{
              borderRadius: '10px',
              py: 1.25,
              px: 1.25,
              minWidth: 0,
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: 'rgba(255,59,48,0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
              <LogoutIcon sx={{ fontSize: 22, color: '#FF3B30' }} />
            </ListItemIcon>
          </ListItemButton>
        </Box>
      </Box>
    );
  };

  return (
    <LayoutContext.Provider value={{
      openCharacter,
      isDrawerOpen: mobileOpen,
      drawerWidth: sidebarCollapsed ? sidebarCollapsedWidth : sidebarWidth
    }}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
                backgroundColor: '#FAFAFA',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                overflowX: 'hidden',
              },
            }}
          >
            {sidebarCollapsed ? <CollapsedSidebarContent /> : <SidebarContent />}
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
              backgroundColor: '#FAFAFA',
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
                backgroundColor: '#FAFAFA',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <IconButton onClick={handleMobileDrawerToggle}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
            <SidebarContent />
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
