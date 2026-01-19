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
import GruviCoin from './GruviCoin';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinkIcon from '@mui/icons-material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
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
  { path: '/create/narrative', label: 'Create Voiceover', icon: HeadsetMicIcon, gradient: gradients.create },
  { path: '/create/video', label: 'Create Video', icon: MovieIcon, gradient: gradients.create },
  { path: '/motion-capture', label: 'Create Motion Capture', icon: SwapHorizIcon, gradient: gradients.create },
  { path: '/ai-assets/create', label: 'Create AI Asset', icon: PersonAddIcon, gradient: gradients.create },
];

const uploadItems = [
  { path: '/upload', label: 'Upload Audio', icon: MusicNoteIcon, params: '?type=song', gradient: gradients.upload },
  { path: '/upload', label: 'Upload Video', icon: MovieIcon, params: '?type=video', gradient: gradients.upload },
];

const contentItems = [
  { path: '/my-music', label: 'My Music', icon: LibraryMusicIcon, gradient: gradients.content },
  { path: '/my-narratives', label: 'My Voiceovers', icon: HeadsetMicIcon, gradient: gradients.content },
  { path: '/my-videos', label: 'My Videos', icon: VideoLibraryIcon, gradient: gradients.content },
  { path: '/ai-assets', label: 'My AI Assets', icon: FolderSpecialIcon, gradient: gradients.content },
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

// Sign Out is separate - moved to bottom of sidebar
const signOutItem = { path: 'logout', label: 'Sign Out', icon: LogoutIcon, gradient: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)', isLogout: true };

const footerItems = [
  { path: '/terms', label: 'Terms', external: false },
  { path: '/privacy', label: 'Privacy', external: false },
];

// Current viewing item info for sub-navigation
interface CurrentViewingItem {
  type: 'video' | 'music' | 'asset';
  title: string;
  path: string;
}

interface SidebarContentProps {
  hasToken: boolean;
  remainingTokens: number;
  isMobile: boolean;
  hasSubscription: boolean;
  currentViewingItem?: CurrentViewingItem | null;
  onNavigate: (path: string) => void;
  onSidebarCollapse: () => void;
  onTokensClick: () => void;
  onLogoutClick: () => void;
  showMobileBackButton?: boolean;
  onMobileBackClick?: () => void;
  trialDaysRemaining?: number;
  isTrialActive?: boolean;
}

// Memoized sidebar content - only re-renders when props change
const SidebarContent = memo<SidebarContentProps>(({
  hasToken,
  remainingTokens,
  isMobile,
  hasSubscription,
  currentViewingItem,
  onNavigate,
  onSidebarCollapse,
  onTokensClick,
  onLogoutClick,
  showMobileBackButton,
  onMobileBackClick,
  trialDaysRemaining,
  isTrialActive,
}) => {
  // Use location inside the memoized component - changes will only cause this component to re-render
  const location = useLocation();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      py: 2,
      pb: 0
    }}>
      {/* Logo and Collapse/Back button row */}
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
              filter: 'drop-shadow(0 2px 8px rgba(0, 210, 211, 0.5))',
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

        {/* Desktop collapse button or Mobile back button */}
        {showMobileBackButton ? (
          <IconButton
            onClick={onMobileBackClick}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.5)',
              '&:hover': {
                color: '#007AFF',
                backgroundColor: 'rgba(0,122,255,0.08)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        ) : !isMobile && (
          <IconButton
            onClick={onSidebarCollapse}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.5)',
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

      {/* Trial Status Banner */}
      {isTrialActive && trialDaysRemaining !== undefined && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Box
            onClick={() => onNavigate('/payment')}
            sx={{
              borderRadius: '12px',
              p: 2,
              background: 'linear-gradient(135deg, #FF9500 0%, #FF2D55 100%)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 16px rgba(255,149,0,0.4)',
              },
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                mb: 0.5,
              }}
            >
              {trialDaysRemaining} days left in trial
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.75rem',
              }}
            >
              Upgrade now to keep creating
            </Typography>
          </Box>
        </Box>
      )}

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
            <span style={{ color: '#fff' }}>{remainingTokens.toLocaleString()}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>|</span>
            <GruviCoin size={20} />
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
            color: 'rgba(255,255,255,0.5)',
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
                      backgroundColor: active ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.05)',
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
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
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
                      color: '#FFFFFF',
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
            color: 'rgba(255,255,255,0.5)',
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
                      backgroundColor: active ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)',
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
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
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
                      color: '#FFFFFF',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* CONTENT Section */}
        <Typography
          variant="caption"
          sx={{
            px: 3,
            py: 1,
            display: 'block',
            color: 'rgba(255,255,255,0.5)',
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
            // Show "AI Assets" as active when editing an AI asset
            const isEditingCast = item.path === '/ai-assets' && location.pathname.startsWith('/ai-assets/edit/');
            const isHighlighted = active || isViewingVideo || isViewingMusic || isEditingCast;

            // Check if this item should show a sub-item
            const showSubItem = currentViewingItem && (
              (item.path === '/my-videos' && currentViewingItem.type === 'video') ||
              (item.path === '/my-music' && currentViewingItem.type === 'music') ||
              (item.path === '/ai-assets' && currentViewingItem.type === 'asset')
            );

            return (
              <React.Fragment key={`${item.path}-${index}`}>
                <ListItem disablePadding sx={{ mb: showSubItem ? 0 : 0.25 }}>
                  <ListItemButton
                    onClick={() => onNavigate(item.path)}
                    sx={{
                      borderRadius: '10px',
                      py: 1,
                      px: 2,
                      backgroundColor: isHighlighted ? 'rgba(16,185,129,0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: isHighlighted ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
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
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
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
                        color: '#FFFFFF',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {/* Sub-item for currently viewing video/music/cast */}
                {showSubItem && currentViewingItem && (
                  <ListItem disablePadding sx={{ mb: 0.25, pt: 1, pl: 2, pr: 0, overflow: 'hidden' }}>
                    {/* Tree connector with pulsing dot */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: 24,
                        height: 32,
                        flexShrink: 0,
                        mt: 0.5,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 10,
                          top: -4,
                          width: 2,
                          height: 18,
                          backgroundColor: '#10B981',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          left: 10,
                          top: 12,
                          width: 16,
                          height: 2,
                          backgroundColor: '#10B981',
                        },
                      }}
                    >
                      {/* Pulsing dot at end of connector */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 20,
                          top: 9,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': {
                              transform: 'scale(1)',
                            },
                            '50%': {
                              transform: 'scale(1.2)',
                            },
                          },
                        }}
                      />
                    </Box>
                    <ListItemButton
                      onClick={() => onNavigate(currentViewingItem.path)}
                      sx={{
                        borderRadius: '10px',
                        py: 0.75,
                        px: 1.5,
                        ml: 1.5,
                        mr: 0,
                        minWidth: 0,
                        flex: 1,
                        overflow: 'hidden',
                        backgroundColor: 'rgba(16,185,129,0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(16,185,129,0.15)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, flexShrink: 0 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '6px',
                            background: gradients.content,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          }}
                        >
                          {currentViewingItem.type === 'asset' ? (
                            <PersonIcon sx={{ fontSize: 14, color: '#fff' }} />
                          ) : currentViewingItem.type === 'music' ? (
                            <MusicNoteIcon sx={{ fontSize: 14, color: '#fff' }} />
                          ) : (
                            <PlayCircleOutlineIcon sx={{ fontSize: 14, color: '#fff' }} />
                          )}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={currentViewingItem.title}
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          color: '#10B981',
                          noWrap: true,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        sx={{ minWidth: 0, flex: 1 }}
                      />
                    </ListItemButton>
                  </ListItem>
                )}
              </React.Fragment>
            );
          })}
        </List>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* PUBLISH Section */}
        <Typography
          variant="caption"
          sx={{
            px: 3,
            py: 1,
            display: 'block',
            color: 'rgba(255,255,255,0.5)',
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
                      backgroundColor: active ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
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
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
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
                      color: '#FFFFFF',
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
            color: 'rgba(255,255,255,0.5)',
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
                      backgroundColor: active ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
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
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
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
                      color: '#FFFFFF',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Sign Out - Separated at bottom */}
      <Box sx={{ px: 2, pb: 1 }}>
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
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '8px',
                background: signOutItem.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              <LogoutIcon sx={{ fontSize: 16, color: '#fff' }} />
            </Box>
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

      {/* Footer Links - matches GlobalAudioPlayer height */}
      <Divider sx={{ mx: 2 }} />
      <Box sx={{display: 'flex', gap: 2, justifyContent: 'center', height: 72, alignItems: 'center' }}>
        {footerItems.map((item) => (
          <Typography
            key={item.path}
            component="a"
            href={item.path}
            sx={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              '&:hover': {
                color: '#007AFF',
                textDecoration: 'underline',
              },
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
});

SidebarContent.displayName = 'SidebarContent';

// Collapsed sidebar content
interface CollapsedSidebarContentProps {
  onNavigate: (path: string) => void;
  onSidebarCollapse: () => void;
  onLogoutClick: () => void;
}

const CollapsedSidebarContent = memo<CollapsedSidebarContentProps>(({
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
              filter: 'drop-shadow(0 2px 8px rgba(0, 210, 211, 0.5))',
            }}
          />
        </Box>
        <IconButton
          onClick={onSidebarCollapse}
          size="small"
          sx={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0066CC 0%, #4AB8EA 100%)',
              boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
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
                      backgroundColor: 'rgba(255,255,255,0.05)',
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

      {/* Sign Out - at bottom */}
      <Box sx={{ px: 1, pb: 2, display: 'flex', justifyContent: 'center' }}>
        <ListItemButton
          onClick={onLogoutClick}
          sx={{
            borderRadius: '10px',
            py: 1,
            px: 1,
            minWidth: 0,
            justifyContent: 'center',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,59,48,0.08)',
            },
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: signOutItem.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            <LogoutIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
        </ListItemButton>
      </Box>
    </Box>
  );
});

CollapsedSidebarContent.displayName = 'CollapsedSidebarContent';

export { SidebarContent, CollapsedSidebarContent };
export { createItems, uploadItems, contentItems, publishItems, accountItems, gradients };
export type { CurrentViewingItem };
