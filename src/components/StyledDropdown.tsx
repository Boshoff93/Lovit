import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

export interface DropdownOption {
  id: string;
  label: string;
  image?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  description?: string;
  audioPreview?: string;
  isPremium?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

interface StyledDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (id: string) => void;
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  showAllOption?: boolean;
  allOptionLabel?: string;
  allOptionIcon?: React.ReactNode;
  showAudioPreview?: boolean;
  disabled?: boolean;
  /** Called when a premium option is clicked but user doesn't have access */
  onPremiumClick?: (option: DropdownOption) => void;
  /** Whether user has premium access */
  hasPremiumAccess?: boolean;
  /** Currently playing preview voice ID */
  currentlyPlayingId?: string | null;
  /** Callback when audio preview state changes */
  onPreviewStateChange?: (id: string | null, isPlaying: boolean) => void;
  /** If true, dropdown stretches to fill container width */
  fullWidth?: boolean;
}

// Scrollable list with gradient fade indicators
const ScrollableList: React.FC<{ children: React.ReactNode; maxHeight?: string }> = ({
  children,
  maxHeight = '300px'
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(true);

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      setShowTopGradient(scrollTop > 10);
      setShowBottomGradient(scrollTop + clientHeight < scrollHeight - 10);
    }
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => list.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Top gradient */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 32,
        background: 'linear-gradient(to bottom, rgba(29,29,31,1) 0%, rgba(29,29,31,0.8) 50%, rgba(29,29,31,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showTopGradient ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />
      <List
        ref={listRef}
        sx={{
          py: 0.5,
          maxHeight,
          overflowY: 'auto',
          // Hide scrollbar but keep functionality
          '&::-webkit-scrollbar': { width: 0, background: 'transparent' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </List>
      {/* Bottom gradient */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 32,
        background: 'linear-gradient(to top, rgba(29,29,31,1) 0%, rgba(29,29,31,0.8) 50%, rgba(29,29,31,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showBottomGradient ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />
    </Box>
  );
};

const StyledDropdown: React.FC<StyledDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select...',
  icon,
  showAllOption = false,
  allOptionLabel = 'All',
  allOptionIcon,
  showAudioPreview = false,
  disabled = false,
  onPremiumClick,
  hasPremiumAccess = true,
  currentlyPlayingId,
  onPreviewStateChange,
  fullWidth = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const open = Boolean(anchorEl);

  // Use external playing state if provided
  const effectivePlayingId = currentlyPlayingId !== undefined ? currentlyPlayingId : playingId;

  const selectedOption = options.find(opt => opt.id === value);
  const displayLabel = value === 'all' ? allOptionLabel : selectedOption?.label || placeholder;
  const displayImage = value === 'all' ? undefined : selectedOption?.image;
  const displayIcon = value === 'all' ? allOptionIcon : (selectedOption?.icon || icon);
  const displayIconBg = value === 'all' ? undefined : selectedOption?.iconBg;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    // Stop any playing audio when closing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (onPreviewStateChange) {
      onPreviewStateChange(null, false);
    } else {
      setPlayingId(null);
    }
  };

  const handleSelect = (id: string, option?: DropdownOption) => {
    // Check if premium and user doesn't have access
    if (option?.isPremium && !hasPremiumAccess && onPremiumClick) {
      onPremiumClick(option);
      return;
    }
    onChange(id);
    handleClose();
  };

  const handlePlayPreview = (e: React.MouseEvent, option: DropdownOption) => {
    e.stopPropagation();

    if (!option.audioPreview) return;

    // If this voice is already playing, stop it
    if (effectivePlayingId === option.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (onPreviewStateChange) {
        onPreviewStateChange(null, false);
      } else {
        setPlayingId(null);
      }
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create new audio and play
    audioRef.current = new Audio(option.audioPreview);
    audioRef.current.onended = () => {
      if (onPreviewStateChange) {
        onPreviewStateChange(null, false);
      } else {
        setPlayingId(null);
      }
    };
    audioRef.current.onerror = () => {
      if (onPreviewStateChange) {
        onPreviewStateChange(null, false);
      } else {
        setPlayingId(null);
      }
    };
    audioRef.current.play();

    if (onPreviewStateChange) {
      onPreviewStateChange(option.id, true);
    } else {
      setPlayingId(option.id);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <Box
        onClick={handleClick}
        sx={{
          display: fullWidth ? 'flex' : 'inline-flex',
          width: fullWidth ? '100%' : 'auto',
          alignItems: 'center',
          justifyContent: fullWidth ? 'space-between' : 'flex-start',
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderRadius: '12px',
          border: (open || value) ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
          background: open ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            background: disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
            borderColor: disabled ? 'rgba(255,255,255,0.1)' : (open || value) ? '#007AFF' : 'rgba(0,122,255,0.3)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {displayImage ? (
            <Avatar
              src={displayImage}
              sx={{ width: 24, height: 24 }}
            />
          ) : displayIcon ? (
            displayIconBg ? (
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: displayIconBg,
                  color: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}
              >
                {displayIcon}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#007AFF' }}>
                {displayIcon}
              </Box>
            )
          ) : null}
          <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>
            {displayLabel}
          </Typography>
        </Box>
        <KeyboardArrowDownIcon
          sx={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 20,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </Box>

      {/* Dropdown Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: '16px',
              background: '#1D1D1F',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              minWidth: 220,
              maxWidth: 320,
              overflow: 'hidden',
            },
          },
        }}
      >
        <ScrollableList>
          {/* "All" option if enabled */}
          {showAllOption && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSelect('all')}
                sx={{
                  py: 1.5,
                  px: 2,
                  background: value === 'all' ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.08)' },
                }}
              >
                {allOptionIcon && (
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#007AFF' }}>
                      {allOptionIcon}
                    </Box>
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={allOptionLabel}
                  primaryTypographyProps={{
                    sx: { color: '#fff', fontWeight: 500 }
                  }}
                />
                {value === 'all' && <CheckIcon sx={{ color: '#007AFF', fontSize: 20 }} />}
              </ListItemButton>
            </ListItem>
          )}

          {/* Options */}
          {options.map((option) => {
            const isSelected = value === option.id;
            const isPlaying = effectivePlayingId === option.id;
            const isLocked = option.isPremium && !hasPremiumAccess;
            const isDisabled = option.disabled || isLocked;

            return (
              <ListItem key={option.id} disablePadding>
                <ListItemButton
                  onClick={() => !isDisabled && handleSelect(option.id, option)}
                  disabled={isDisabled}
                  sx={{
                    py: 1.5,
                    px: 2,
                    background: isSelected ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                    opacity: isDisabled ? 0.5 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    '&:hover': { background: isDisabled ? 'transparent' : 'rgba(255,255,255,0.08)' },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  {option.image ? (
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar
                        src={option.image}
                        sx={{ width: 36, height: 36 }}
                      />
                    </ListItemAvatar>
                  ) : option.icon ? (
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: option.iconBg || 'rgba(0, 122, 255, 0.2)',
                          color: '#fff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                      >
                        {option.icon}
                      </Box>
                    </ListItemAvatar>
                  ) : null}
                  <ListItemText
                    primary={option.label}
                    secondary={option.disabled && option.disabledReason ? option.disabledReason : option.description}
                    primaryTypographyProps={{
                      sx: { color: isDisabled ? 'rgba(255,255,255,0.5)' : '#fff', fontWeight: 500, fontSize: '0.9rem' }
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        color: option.disabled && option.disabledReason ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255,255,255,0.5)',
                        fontSize: '0.75rem',
                      }
                    }}
                  />

                  {/* Audio preview button */}
                  {showAudioPreview && option.audioPreview && !isDisabled && (
                    <IconButton
                      size="small"
                      onClick={(e) => handlePlayPreview(e, option)}
                      sx={{
                        ml: 1,
                        color: isPlaying ? '#007AFF' : 'rgba(255,255,255,0.6)',
                        bgcolor: isPlaying ? 'rgba(0, 122, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                        '&:hover': {
                          bgcolor: isPlaying ? 'rgba(0, 122, 255, 0.3)' : 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      {isPlaying ? <StopIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                    </IconButton>
                  )}

                  {isSelected && !showAudioPreview && !isDisabled && (
                    <CheckIcon sx={{ color: '#007AFF', fontSize: 20, ml: 1 }} />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </ScrollableList>
      </Popover>
    </>
  );
};

export default StyledDropdown;
