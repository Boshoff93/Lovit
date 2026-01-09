import React, { memo } from 'react';
import {
  Box,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
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
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import { useLocation } from 'react-router-dom';

// Gradient colors for each navigation group
const gradients = {
  create: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
  upload: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
  content: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
  publish: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
  account: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
};

// Navigation items configuration
const createItems = [
  { path: '/create/music', label: 'Create Music', icon: MusicNoteIcon, gradient: gradients.create },
  { path: '/create/video', label: 'Create Video', icon: MovieIcon, gradient: gradients.create },
  { path: '/my-cast/create', label: 'Create Cast', icon: PersonAddIcon, gradient: gradients.create },
];

const uploadItems = [
  { path: '/upload', label: 'Upload Music', icon: MusicNoteIcon, params: '?type=song', gradient: gradients.upload },
  { path: '/upload', label: 'Upload Video', icon: MovieIcon, params: '?type=video', gradient: gradients.upload },
];

const contentItems = [
  { path: '/my-music', label: 'My Music', icon: LibraryMusicIcon, gradient: gradients.content },
  { path: '/my-videos', label: 'My Videos', icon: VideoLibraryIcon, gradient: gradients.content },
  { path: '/my-cast', label: 'My Cast', icon: FolderSpecialIcon, gradient: gradients.content },
];

const publishItems = [
  { path: '/settings/connected-accounts', label: 'Integrations', icon: LinkIcon, gradient: gradients.publish },
  { path: '/settings/scheduled-content', label: 'Scheduled Posts', icon: CalendarMonthIcon, gradient: gradients.publish },
];

const accountItems = [
  { path: '/account', label: 'Account', icon: AccountCircleIcon, gradient: gradients.account },
  { path: '/payment', label: 'Subscription', icon: CreditCardIcon, gradient: gradients.account },
  { path: '/support', label: 'Support & FAQ', icon: HeadsetMicIcon, gradient: gradients.account },
];

interface SidebarContentProps {
  hasActivePlayer: boolean;
  hasToken: boolean;
  remainingTokens: number;
  isMobile: boolean;
  hasSubscription: boolean;
  onNavigate: (path: string) => void;
  onSidebarCollapse: () => void;
  onTokensClick: () => void;
  onLogoutClick: () => void;
}

// Memoized sidebar content - only re-renders when props change
const SidebarContent = memo<SidebarContentProps>(({
  hasActivePlayer,
  hasToken,
  remainingTokens,
  isMobile,
  hasSubscription,
  onNavigate,
  onSidebarCollapse,
  onTokensClick,
  onLogoutClick,
}) => {
  // Use location inside the memoized component - changes will only cause this component to re-render
  const location = useLocation();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      py: 2,
      pb: hasActivePlayer ? 10 : 2,
    }}>
      {/* Logo and Collapse button row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 3 }}>
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

        {!isMobile && (
          <IconButton
            onClick={onSidebarCollapse}
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
      {hasToken && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Button
            fullWidth
            onClick={onTokensClick}
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
            <span style={{ color: '#fff' }}>{remainingTokens.toLocaleString()} Tokens</span>
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
                  onClick={() => onNavigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: active ? 'rgba(236,72,153,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(236,72,153,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        background: item.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(236,72,153,0.25)',
                      }}
                    >
                      <Icon sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.875rem',
                      color: '#1D1D1F',
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
            const fullPath = item.path + ((item as any).params || '');
            const active = location.pathname === item.path && ((item as any).params ? location.search === (item as any).params : true);
            return (
              <ListItem key={`${item.path}-${index}`} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => onNavigate(fullPath)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: active ? 'rgba(249,115,22,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(249,115,22,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        background: item.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(249,115,22,0.25)',
                      }}
                    >
                      <Icon sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.875rem',
                      color: '#1D1D1F',
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
            // Show "My Music" as active when viewing a music item
            const isViewingMusic = item.path === '/my-music' && location.pathname.startsWith('/music/');
            // Show "My Cast" as active when editing a cast member
            const isEditingCast = item.path === '/my-cast' && location.pathname.startsWith('/my-cast/edit/');
            const isHighlighted = active || isViewingVideo || isViewingMusic || isEditingCast;
            // Only show indicator dot when viewing a specific item (not on the list page)
            const showIndicator = isViewingVideo || isViewingMusic || isEditingCast;
            return (
              <ListItem key={`${item.path}-${index}`} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => onNavigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: isHighlighted ? 'rgba(16,185,129,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isHighlighted ? 'rgba(16,185,129,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        background: item.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(16,185,129,0.25)',
                      }}
                    >
                      <Icon sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isHighlighted ? 600 : 500,
                      fontSize: '0.875rem',
                      color: '#1D1D1F',
                    }}
                  />
                  {showIndicator && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        ml: 1,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* PUBLISH Section */}
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
          Publish
        </Typography>
        <List sx={{ px: 1, pb: 1 }}>
          {publishItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const isLocked = !hasSubscription;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => onNavigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: active ? 'rgba(59,130,246,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(59,130,246,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        background: item.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(59,130,246,0.25)',
                      }}
                    >
                      <Icon sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.875rem',
                      color: '#1D1D1F',
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
        <List sx={{ px: 1, pb: 1 }}>
          {accountItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => onNavigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 2,
                    backgroundColor: active ? 'rgba(139,92,246,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(139,92,246,0.15)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '8px',
                        background: item.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(139,92,246,0.25)',
                      }}
                    >
                      <Icon sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                      fontSize: '0.875rem',
                      color: '#1D1D1F',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Sign Out Button */}
      <Box sx={{ px: 2, pb: 1, pt: 1 }}>
        <Divider sx={{ mb: 2 }} />
        <ListItemButton
          onClick={onLogoutClick}
          sx={{
            borderRadius: '10px',
            py: 1,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(255,59,48,0.08)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
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
});

SidebarContent.displayName = 'SidebarContent';

// Collapsed sidebar content
interface CollapsedSidebarContentProps {
  hasActivePlayer: boolean;
  onNavigate: (path: string) => void;
  onSidebarCollapse: () => void;
  onLogoutClick: () => void;
}

const CollapsedSidebarContent = memo<CollapsedSidebarContentProps>(({
  hasActivePlayer,
  onNavigate,
  onSidebarCollapse,
  onLogoutClick,
}) => {
  const location = useLocation();

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
      pb: hasActivePlayer ? 10 : 2,
    }}>
      {/* Logo only */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box
          component="a"
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
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
        </Box>
        <IconButton
          onClick={onSidebarCollapse}
          size="small"
          sx={{
            color: '#86868B',
            '&:hover': {
              color: '#007AFF',
              backgroundColor: 'rgba(0,122,255,0.08)',
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      {/* Icons List */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
        <List sx={{ px: 1 }}>
          {allItems.map((item, index) => {
            const Icon = item.icon;
            const fullPath = item.path + ((item as any).params || '');
            const active = location.pathname === item.path && ((item as any).params ? location.search === (item as any).params : true);
            return (
              <ListItem key={`${item.path}-${index}`} disablePadding sx={{ mb: 0.5, justifyContent: 'center' }}>
                <ListItemButton
                  onClick={() => onNavigate(fullPath)}
                  sx={{
                    borderRadius: '10px',
                    py: 1,
                    px: 1,
                    minWidth: 0,
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      background: item.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: active ? '0 3px 8px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.15)',
                      transform: active ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <Icon sx={{ fontSize: 18, color: '#fff' }} />
                  </Box>
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
          onClick={onLogoutClick}
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
});

CollapsedSidebarContent.displayName = 'CollapsedSidebarContent';

export { SidebarContent, CollapsedSidebarContent };
export { createItems, uploadItems, contentItems, publishItems, accountItems, gradients };
