import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { styled, useTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Drawer, Typography, IconButton, useMediaQuery, Alert, Snackbar, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { logoutAllState } from '../store/actions';
import { useSidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '../contexts/SidebarContext';
import { SidebarContent, CollapsedSidebarContent, CurrentViewingItem } from './SidebarContent';
import { createWorkspaceTheme } from './workspaceTheme';
interface LayoutContextType {openCharacter:()=>void;isDrawerOpen:boolean;drawerWidth:number;sidebarCollapsed:boolean;setCurrentViewingItem:(item:CurrentViewingItem|null)=>void;}
export const LayoutContext=createContext<LayoutContextType|null>(null);
export const useLayout=()=>{const context=useContext(LayoutContext);if(!context)throw new Error('useLayout must be used within a LayoutProvider');return context;};
const sidebarWidth=SIDEBAR_WIDTH;const sidebarCollapsedWidth=SIDEBAR_COLLAPSED_WIDTH;const mobileTopBarHeight=56;
const Main=styled('main',{shouldForwardProp:prop=>!['sidebarOpen','isMobile','sidebarCollapsed'].includes(prop as string)})<{sidebarOpen?:boolean;isMobile?:boolean;sidebarCollapsed?:boolean}>(({theme,isMobile})=>({flexGrow:1,width:'100%',minWidth:0,padding:theme.spacing(2),marginTop:isMobile?mobileTopBarHeight:0,transition:theme.transitions.create(['margin','width'],{easing:theme.transitions.easing.sharp,duration:theme.transitions.duration.leavingScreen})}));
const Layout:React.FC<{children:React.ReactNode;isInitializing?:boolean}>=({children,isInitializing=false})=>{
 const theme=useTheme();const workspaceTheme=useMemo(()=>createWorkspaceTheme(theme),[theme]);const navigate=useNavigate();const location=useLocation();const isMobile=useMediaQuery(theme.breakpoints.down('md'));const dispatch=useDispatch<AppDispatch>();
 const hasToken=useSelector((s:RootState)=>!!s.auth.token);const hasSubscription=useSelector((s:RootState)=>!!s.auth.subscription?.tier&&s.auth.subscription.tier!=='free');const [mobileOpen,setMobileOpen]=useState(false);const{sidebarCollapsed,setSidebarCollapsed}=useSidebar();const[logoutDialogOpen,setLogoutDialogOpen]=useState(false);const[currentViewingItem,setCurrentViewingItem]=useState<CurrentViewingItem|null>(null);const[notification,setNotification]=useState<{open:boolean;message:string;severity:'success'|'error'|'info'|'warning'}>({open:false,message:'',severity:'info'});
 const hasActivePlayer=false;
 useEffect(()=>{setMobileOpen(false);setCurrentViewingItem(null);},[location.pathname]);
 useEffect(()=>{if(!isMobile)setMobileOpen(false);},[isMobile]);
 const handleLogout=useCallback(()=>{dispatch(logoutAllState());navigate('/');},[dispatch,navigate]);
 const handleMobileDrawerToggle=()=>setMobileOpen(!mobileOpen);const handleSidebarCollapse=()=>setSidebarCollapsed(!sidebarCollapsed);
 const openCharacter=useCallback(()=>{navigate('/posts/new');setMobileOpen(false);},[navigate]);
 const handleNavigate=useCallback((path:string)=>{navigate(path);setMobileOpen(false);},[navigate]);
 const handleLogoutClick=()=>{if(isInitializing)return;setMobileOpen(false);setLogoutDialogOpen(true);};
 const handleCloseNotification=()=>setNotification(old=>({...old,open:false}));
 const sidebarProps={hasToken,remainingTokens:0,isMobile,hasSubscription,currentViewingItem,onNavigate:handleNavigate,onSidebarCollapse:handleSidebarCollapse,onTokensClick:()=>navigate('/payment'),onLogoutClick:handleLogoutClick,isTrialActive:false};
 const collapsedSidebarProps={onNavigate:handleNavigate,onSidebarCollapse:handleSidebarCollapse,onLogoutClick:handleLogoutClick};
  return (
    <ThemeProvider theme={workspaceTheme}>
    <LayoutContext.Provider value={{
      openCharacter,
      isDrawerOpen: mobileOpen,
      drawerWidth: sidebarCollapsed ? sidebarCollapsedWidth : sidebarWidth,
      sidebarCollapsed,
      setCurrentViewingItem
    }}>
      <Box className="gd-workspace" sx={{ display: 'flex', minHeight: '100vh' }}>
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
                borderRight: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: '#14171f',
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
              backgroundColor: '#14171f',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              zIndex: theme.zIndex.drawer,
              display: 'flex',
              alignItems: 'center',
              px: 2,
              gap: 2,
            }}
          >
            <IconButton
              aria-label="Open navigation"
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
                  fontSize: '1.8rem',
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
                backgroundColor: '#14171f',
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
    </ThemeProvider>
  );
};

export default Layout;
