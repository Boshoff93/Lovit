import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';

export interface PickerOption {
  id: string;
  label: string;
  image?: string;
  description?: string;
  icon?: React.ReactNode;
}

interface StyledPickerProps {
  options: PickerOption[];
  value: string | string[];
  onChange: (id: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  /** Multiple selection mode */
  multiple?: boolean;
  /** Max items for multiple selection */
  maxItems?: number;
  /** Custom render for selected display */
  renderSelected?: (selected: PickerOption | PickerOption[]) => React.ReactNode;
  /** Custom render for option in list */
  renderOption?: (option: PickerOption, isSelected: boolean) => React.ReactNode;
  /** Empty state message */
  emptyMessage?: string;
  /** Empty state action */
  emptyAction?: React.ReactNode;
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
        background: 'linear-gradient(to bottom, rgba(20,20,24,1) 0%, rgba(20,20,24,0.8) 50%, rgba(20,20,24,0) 100%)',
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
        background: 'linear-gradient(to top, rgba(20,20,24,1) 0%, rgba(20,20,24,0.8) 50%, rgba(20,20,24,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showBottomGradient ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />
    </Box>
  );
};

const StyledPicker: React.FC<StyledPickerProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  icon,
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  fullWidth = false,
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearchChange,
  multiple = false,
  maxItems,
  renderSelected,
  renderOption,
  emptyMessage = 'No options available',
  emptyAction,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const open = Boolean(anchorEl);

  const selectedIds = Array.isArray(value) ? value : value ? [value] : [];
  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));
  const hasSelection = selectedIds.length > 0;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled && !loading) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery('');
  };

  const handleSelect = (id: string) => {
    onChange(id);
    if (!multiple) {
      handleClose();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  // Filter options based on search query if not using external search
  const filteredOptions = onSearchChange
    ? options
    : options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Default selected display
  const defaultRenderSelected = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CircularProgress size={20} sx={{ color: '#fff' }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            {loadingText}
          </Typography>
        </Box>
      );
    }

    if (!hasSelection) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {icon && (
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.5)' }}>
              {icon}
            </Box>
          )}
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
            {placeholder}
          </Typography>
        </Box>
      );
    }

    if (multiple && selectedOptions.length > 1) {
      const first = selectedOptions[0];
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {first.image ? (
            <Avatar src={first.image} sx={{ width: 24, height: 24 }} />
          ) : first.icon ? (
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#007AFF' }}>
              {first.icon}
            </Box>
          ) : null}
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>
            {first.label} +{selectedOptions.length - 1}
          </Typography>
        </Box>
      );
    }

    const selected = selectedOptions[0];
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {selected.image ? (
          <Avatar src={selected.image} sx={{ width: 24, height: 24 }} />
        ) : selected.icon ? (
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#007AFF' }}>
            {selected.icon}
          </Box>
        ) : icon ? (
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#007AFF' }}>
            {icon}
          </Box>
        ) : null}
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>
          {selected.label}
        </Typography>
      </Box>
    );
  };

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
          border: (open || hasSelection) ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
          background: open ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
          cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          '&:hover': {
            background: (disabled || loading) ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
            borderColor: (disabled || loading) ? 'rgba(255,255,255,0.1)' : (open || hasSelection) ? '#007AFF' : 'rgba(0,122,255,0.3)',
          },
        }}
      >
        {renderSelected ? renderSelected(multiple ? selectedOptions : selectedOptions[0]) : defaultRenderSelected()}
        <KeyboardArrowDownIcon
          sx={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 20,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
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
              background: '#141418',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              minWidth: 220,
              maxWidth: 360,
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Search field */}
        {searchable && (
          <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <TextField
              fullWidth
              size="small"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                },
                '& .MuiInputBase-input': {
                  color: '#fff',
                  fontSize: '0.9rem',
                  '&::placeholder': { color: 'rgba(255,255,255,0.5)' },
                },
              }}
            />
          </Box>
        )}

        {/* Options list */}
        {filteredOptions.length > 0 ? (
          <ScrollableList>
            {filteredOptions.map((option) => {
              const isSelected = selectedIds.includes(option.id);
              const isDisabled = multiple && maxItems && selectedIds.length >= maxItems && !isSelected;

              return (
                <ListItem key={option.id} disablePadding>
                  <ListItemButton
                    onClick={() => !isDisabled && handleSelect(option.id)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      background: isSelected ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                      opacity: isDisabled ? 0.5 : 1,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      '&:hover': { background: isDisabled ? 'transparent' : 'rgba(255,255,255,0.08)' },
                    }}
                  >
                    {renderOption ? (
                      renderOption(option, isSelected)
                    ) : (
                      <>
                        {option.image && (
                          <ListItemAvatar sx={{ minWidth: 48 }}>
                            <Avatar src={option.image} sx={{ width: 36, height: 36 }} />
                          </ListItemAvatar>
                        )}
                        {option.icon && !option.image && (
                          <ListItemAvatar sx={{ minWidth: 40 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#007AFF' }}>
                              {option.icon}
                            </Box>
                          </ListItemAvatar>
                        )}
                        <ListItemText
                          primary={option.label}
                          secondary={option.description}
                          primaryTypographyProps={{
                            sx: { color: '#fff', fontWeight: 500, fontSize: '0.9rem' }
                          }}
                          secondaryTypographyProps={{
                            sx: {
                              color: 'rgba(255,255,255,0.5)',
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }
                          }}
                        />
                        {isSelected && (
                          <CheckIcon sx={{ color: '#007AFF', fontSize: 20, ml: 1 }} />
                        )}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </ScrollableList>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: emptyAction ? 2 : 0 }}>
              {emptyMessage}
            </Typography>
            {emptyAction}
          </Box>
        )}
      </Popover>
    </>
  );
};

export default StyledPicker;
