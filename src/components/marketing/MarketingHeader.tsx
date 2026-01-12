import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAuth } from '../../hooks/useAuth';

interface MarketingHeaderProps {
  onOpenAuth?: () => void;
  transparent?: boolean;
  /** Use light theme (white blur) instead of dark blur */
  lightMode?: boolean;
  /** Always show blur effect (don't wait for scroll) */
  alwaysBlurred?: boolean;
}

const navItems = [
  { label: 'Home', href: '/', activeColor: '#5DD3B3' }, // teal
  { label: 'AI Music', href: '/ai-music', activeColor: '#5AC8FA' }, // blue
  { label: 'AI Video Shorts', href: '/ai-video-shorts', activeColor: '#F5A623' }, // orange
  { label: 'Social Media', href: '/social-media', activeColor: '#22C55E' }, // green
  { label: 'Pricing', href: '/pricing', activeColor: '#A855F7' }, // purple
];

// Brighter teal/cyan for inactive nav items (high contrast)
const INACTIVE_COLOR = '#5DEDE0';

/**
 * MarketingHeader - Transparent header with scroll-based blur effect
 * Starts fully transparent, gradually becomes blurred as user scrolls
 */
const MarketingHeader: React.FC<MarketingHeaderProps> = ({
  onOpenAuth,
  transparent = true,
  lightMode = false,
  alwaysBlurred = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useAuth();
  const isLoggedIn = !!token;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Check if current path matches nav item
  const isActive = useCallback((href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  }, [location.pathname]);

  // Find active nav index
  const activeIndex = navItems.findIndex(item => isActive(item.href));
  const activeItem = activeIndex >= 0 ? navItems[activeIndex] : null;

  // Refs for animated bubble indicator
  const navContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLElement | null)[]>([]);
  const [bubbleStyle, setBubbleStyle] = useState({ left: 0, width: 0 });
  const [bounceKey, setBounceKey] = useState(0);
  const prevActiveIndexRef = useRef(activeIndex);

  // Calculate bubble position when active item changes or window resizes
  const updateBubblePosition = useCallback(() => {
    if (activeIndex >= 0 && buttonRefs.current[activeIndex] && navContainerRef.current) {
      const button = buttonRefs.current[activeIndex];
      const container = navContainerRef.current;
      if (button && container) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setBubbleStyle({
          left: buttonRect.left - containerRect.left,
          width: buttonRect.width,
        });
      }
    }
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateBubblePosition();

    // Trigger bounce animation when active index changes
    if (prevActiveIndexRef.current !== activeIndex && activeIndex >= 0) {
      setBounceKey(prev => prev + 1);
    }
    prevActiveIndexRef.current = activeIndex;
  }, [activeIndex, updateBubblePosition]);

  // Update bubble position on window resize
  useEffect(() => {
    const handleResize = () => {
      updateBubblePosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateBubblePosition]);

  // Calculate scroll progress (0 = top, 1 = scrolled 100px+)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 100, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen]);

  const handleClickOpen = useCallback(() => {
    if (user) {
      navigate('/my-music');
      return;
    }
    onOpenAuth?.();
  }, [user, navigate, onOpenAuth]);

  // Dynamic styles based on scroll (or always if alwaysBlurred)
  const effectiveProgress = alwaysBlurred ? 1 : scrollProgress;
  const blurAmount = transparent ? effectiveProgress * 20 : 20;
  // Keep background subtle - slightly more opacity when alwaysBlurred for better blur effect
  const bgOpacity = transparent
    ? (alwaysBlurred ? 0.5 : effectiveProgress * 0.3)
    : 0.3;
  const borderOpacity = transparent ? effectiveProgress * 0.08 : 0.08;

  // Colors based on lightMode
  const bgColor = lightMode ? '255, 255, 255' : '29, 29, 31';
  const borderColor = lightMode ? '0, 0, 0' : '255, 255, 255';
  const effectiveBorderOpacity = transparent && effectiveProgress < 0.5 ? 0 : borderOpacity;

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: transparent
            ? `rgba(${bgColor}, ${bgOpacity})`
            : `rgba(${bgColor}, 0.3)`,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          borderBottom: effectiveBorderOpacity > 0
            ? `1px solid rgba(${borderColor}, ${effectiveBorderOpacity})`
            : 'none',
          px: { xs: 2, sm: 3, md: 4 },
          transition: 'background 0.2s ease, border-bottom 0.2s ease',
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
          width: '100%',
          maxWidth: '1400px',
          mx: 'auto',
        }}>
          {/* Logo - left */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              flexShrink: 0,
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
              component="div"
              sx={{
                fontFamily: '"Fredoka", "Inter", sans-serif',
                fontWeight: 600,
                fontSize: '1.4rem',
                letterSpacing: '-0.01em',
                background: 'linear-gradient(135deg, #00D4AA, #5AC8FA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Gruvi
            </Typography>
          </Box>

          {/* Mobile: hamburger menu */}
          {isMobile ? (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: lightMode ? '#1D1D1F' : '#fff',
                ml: 'auto',
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              {/* Center navigation tabs with animated bubble */}
              <Box
                ref={navContainerRef}
                sx={{
                  display: 'flex',
                  gap: { md: 0.5, lg: 0.5 },
                  alignItems: 'center',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  // Container for bubble positioning
                  padding: '4px',
                  borderRadius: '24px',
                  background: lightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
                }}
              >
                {/* Animated sliding bubble indicator with bounce */}
                {activeItem && bubbleStyle.width > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '4px',
                      bottom: '4px',
                      left: `${bubbleStyle.left}px`,
                      width: `${bubbleStyle.width}px`,
                      borderRadius: '20px',
                      background: `${activeItem.activeColor}25`,
                      border: `1px solid ${activeItem.activeColor}50`,
                      boxShadow: `0 0 20px ${activeItem.activeColor}40, inset 0 0 15px ${activeItem.activeColor}15`,
                      // Spring bounce transition - overshoots then settles
                      transition: 'left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                      pointerEvents: 'none',
                      zIndex: 0,
                      // Pulsing animation
                      '@keyframes bubblePulse': {
                        '0%, 100%': {
                          boxShadow: `0 0 15px ${activeItem.activeColor}30, inset 0 0 12px ${activeItem.activeColor}10`,
                        },
                        '50%': {
                          boxShadow: `0 0 25px ${activeItem.activeColor}50, inset 0 0 20px ${activeItem.activeColor}20`,
                        },
                      },
                      // Bounce settle animation on arrival - use unique name to retrigger
                      [`@keyframes bounceSettle${bounceKey}`]: {
                        '0%': { transform: 'scaleX(1.15) scaleY(0.88)' },
                        '25%': { transform: 'scaleX(0.9) scaleY(1.1)' },
                        '45%': { transform: 'scaleX(1.06) scaleY(0.95)' },
                        '65%': { transform: 'scaleX(0.97) scaleY(1.03)' },
                        '80%': { transform: 'scaleX(1.01) scaleY(0.99)' },
                        '100%': { transform: 'scaleX(1) scaleY(1)' },
                      },
                      animation: `bubblePulse 3s ease-in-out infinite, bounceSettle${bounceKey} 0.6s cubic-bezier(0.22, 1, 0.36, 1)`,
                    }}
                  />
                )}

                {navItems.map((item, index) => {
                  const active = isActive(item.href);
                  const itemColor = active ? item.activeColor : INACTIVE_COLOR;
                  return (
                    <Button
                      key={item.label}
                      ref={(el) => { buttonRefs.current[index] = el; }}
                      component={RouterLink}
                      to={item.href}
                      sx={{
                        color: lightMode
                          ? (active ? item.activeColor : 'rgba(0,0,0,0.7)')
                          : itemColor,
                        textTransform: 'none',
                        fontWeight: active ? 600 : 500,
                        fontSize: { md: '0.8rem', lg: '0.9rem' },
                        px: { md: 1.25, lg: 2 },
                        py: 0.875,
                        borderRadius: '20px',
                        minWidth: 'auto',
                        whiteSpace: 'nowrap',
                        position: 'relative',
                        zIndex: 1,
                        transition: 'color 0.3s ease, transform 0.2s ease',
                        background: 'transparent',
                        '&:hover': {
                          color: lightMode ? '#1D1D1F' : '#fff',
                          background: active ? 'transparent' : (lightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'),
                          transform: 'scale(1.02)',
                        },
                        '&:not(:hover)': {
                          color: lightMode
                            ? (active ? item.activeColor : 'rgba(0,0,0,0.7)')
                            : itemColor,
                        },
                        '&:active': {
                          transform: 'scale(0.98)',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>

              {/* Right side: Dashboard (logged in) or Login + CTA (logged out) */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 'auto' }}>
                {isLoggedIn ? (
                  <Button
                    component={RouterLink}
                    to="/my-music"
                    variant="contained"
                    sx={{
                      // Primary button style - blue to teal gradient
                      background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                      backgroundColor: 'transparent !important',
                      color: '#fff !important',
                      px: 3,
                      py: 1.25,
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                        backgroundColor: 'transparent !important',
                        color: '#fff !important',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5) !important',
                      },
                    }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleClickOpen}
                      sx={{
                        color: lightMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        '&:hover': {
                          color: lightMode ? '#1D1D1F' : '#fff',
                          background: 'transparent',
                        },
                      }}
                    >
                      Log in
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleClickOpen}
                      sx={{
                        // Primary button style - blue to teal gradient
                        background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                        backgroundColor: 'transparent !important',
                        color: '#fff !important',
                        px: 3,
                        py: 1.25,
                        borderRadius: '12px',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                          backgroundColor: 'transparent !important',
                          color: '#fff !important',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5) !important',
                        },
                      }}
                    >
                      Start Your Free Trial!
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: false,
          disableScrollLock: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            background: '#1D1D1F',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px 0 0 16px',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/gruvi.png"
              alt="Gruvi"
              sx={{ height: 32, width: 32, objectFit: 'contain' }}
            />
            <Typography
              sx={{
                fontFamily: '"Fredoka", "Inter", sans-serif',
                fontWeight: 600,
                fontSize: '1.25rem',
                background: 'linear-gradient(135deg, #00D4AA, #5AC8FA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Gruvi
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Drawer Content */}
        <List sx={{ px: 1, py: 2 }}>
          {isLoggedIn && (
            <ListItemButton
              component={RouterLink}
              to="/my-music"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: 'rgba(78, 205, 196, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#4ECDC4' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Go to Dashboard" primaryTypographyProps={{ fontWeight: 600, color: '#4ECDC4' }} />
            </ListItemButton>
          )}
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <ListItemButton
                key={item.label}
                component={RouterLink}
                to={item.href}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: active ? `${item.activeColor}26` : 'transparent',
                  '&:hover': {
                    backgroundColor: active ? `${item.activeColor}33` : 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                    color: active ? item.activeColor : INACTIVE_COLOR,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        {/* Bottom buttons */}
        <Box sx={{
          mt: 'auto',
          p: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}>
          {isLoggedIn ? (
            <Button
              fullWidth
              variant="contained"
              component={RouterLink}
              to="/my-music"
              onClick={handleDrawerToggle}
              sx={{
                background: 'linear-gradient(135deg, #00D9FF 0%, #00A3CC 100%)',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                py: 1.25,
                boxShadow: '0 4px 16px rgba(0, 217, 255, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #33E0FF 0%, #00D9FF 100%)',
                  boxShadow: '0 6px 24px rgba(0, 217, 255, 0.5)',
                }
              }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  handleDrawerToggle();
                  onOpenAuth?.();
                }}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: '10px',
                  py: 1.25,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  }
                }}
              >
                Log in
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  handleDrawerToggle();
                  onOpenAuth?.();
                }}
                sx={{
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '10px',
                  py: 1.25,
                  boxShadow: '0 4px 16px rgba(78, 205, 196, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #45B7AA 0%, #3D9480 100%)',
                  }
                }}
              >
                Start Your Free Trial!
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default MarketingHeader;
