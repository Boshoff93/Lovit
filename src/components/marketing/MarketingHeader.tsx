import React, { useState, useEffect, useCallback } from 'react';
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
  { label: 'Home', href: '/' },
  { label: 'AI Music', href: '/ai-music' },
  { label: 'AI Video Shorts', href: '/ai-video-shorts' },
  { label: 'Social Media', href: '/social-media' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
];

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

  // Check if current path matches nav item
  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

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
              {/* Center navigation tabs */}
              <Box sx={{
                display: 'flex',
                gap: { md: 1, lg: 2 },
                alignItems: 'center',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
              }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={RouterLink}
                    to={item.href}
                    sx={{
                      color: isActive(item.href)
                        ? lightMode ? '#007AFF' : '#5DD3B3'
                        : lightMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.75)',
                      textTransform: 'none',
                      fontWeight: isActive(item.href) ? 600 : 500,
                      fontSize: { md: '0.85rem', lg: '0.95rem' },
                      px: { md: 1.5, lg: 2 },
                      py: 1,
                      borderRadius: '8px',
                      minWidth: 'auto',
                      transition: 'all 0.2s ease',
                      background: isActive(item.href)
                        ? lightMode ? 'rgba(0, 122, 255, 0.1)' : 'rgba(93, 211, 179, 0.1)'
                        : 'transparent',
                      '&:hover': {
                        color: isActive(item.href)
                          ? lightMode ? '#007AFF' : '#5DD3B3'
                          : lightMode ? '#1D1D1F' : '#fff',
                        background: lightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {/* Right side: Dashboard (logged in) or Login + CTA (logged out) */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 'auto' }}>
                {isLoggedIn ? (
                  <Button
                    component={RouterLink}
                    to="/my-music"
                    variant="contained"
                    sx={{
                      background: lightMode
                        ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                        : 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                      color: '#fff',
                      px: 3,
                      py: 1.25,
                      borderRadius: '100px',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      boxShadow: lightMode
                        ? '0 4px 16px rgba(0, 122, 255, 0.4)'
                        : '0 4px 16px rgba(78, 205, 196, 0.4)',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: lightMode
                          ? 'linear-gradient(135deg, #0066DD 0%, #4AB8E8 100%)'
                          : 'linear-gradient(135deg, #45B7AA 0%, #3D9480 100%)',
                        boxShadow: lightMode
                          ? '0 6px 24px rgba(0, 122, 255, 0.5)'
                          : '0 6px 24px rgba(78, 205, 196, 0.5)',
                        transform: 'translateY(-2px)',
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
                        background: lightMode
                          ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                          : 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                        color: '#fff',
                        px: 3,
                        py: 1.25,
                        borderRadius: '100px',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        boxShadow: lightMode
                          ? '0 4px 16px rgba(0, 122, 255, 0.4)'
                          : '0 4px 16px rgba(78, 205, 196, 0.4)',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          background: lightMode
                            ? 'linear-gradient(135deg, #0066DD 0%, #4AB8E8 100%)'
                            : 'linear-gradient(135deg, #45B7AA 0%, #3D9480 100%)',
                          boxShadow: lightMode
                            ? '0 6px 24px rgba(0, 122, 255, 0.5)'
                            : '0 6px 24px rgba(78, 205, 196, 0.5)',
                          transform: 'translateY(-2px)',
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
          {navItems.map((item) => (
            <ListItemButton
              key={item.label}
              component={RouterLink}
              to={item.href}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: isActive(item.href) ? 'rgba(93, 211, 179, 0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive(item.href) ? 'rgba(93, 211, 179, 0.2)' : 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive(item.href) ? 600 : 500,
                  color: isActive(item.href) ? '#5DD3B3' : 'rgba(255,255,255,0.9)',
                }}
              />
            </ListItemButton>
          ))}
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
