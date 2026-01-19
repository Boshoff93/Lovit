import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  SelectChangeEvent,
  Divider,
  Skeleton,
  LinearProgress,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { narrativesApi, Narrative } from '../services/api';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CampaignIcon from '@mui/icons-material/Campaign';
import { GhostButton, GhostIconButton } from '../components/GhostButton';

// Type options for filter
const typeOptions = [
  { id: 'story', name: 'Story', icon: MenuBookIcon },
  { id: 'content', name: 'Content', icon: CampaignIcon },
];

// Animated Equalizer Component
const AudioEqualizer: React.FC<{ isPlaying: boolean; size?: number; color?: string }> = ({
  isPlaying,
  size = 20,
  color = '#00D4AA'
}) => {
  const barWidth = size / 5;
  const gap = size / 10;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: `${gap}px`,
        height: size,
        width: size,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            width: barWidth,
            backgroundColor: color,
            borderRadius: `${barWidth / 2}px`,
            height: isPlaying ? undefined : `${size * 0.2}px`,
            minHeight: `${size * 0.15}px`,
            animation: isPlaying
              ? `equalizer${i} 0.${4 + i}s ease-in-out infinite alternate`
              : 'none',
            '@keyframes equalizer0': {
              '0%': { height: `${size * 0.2}px` },
              '100%': { height: `${size * 0.9}px` },
            },
            '@keyframes equalizer1': {
              '0%': { height: `${size * 0.5}px` },
              '100%': { height: `${size * 0.3}px` },
            },
            '@keyframes equalizer2': {
              '0%': { height: `${size * 0.3}px` },
              '100%': { height: `${size * 0.8}px` },
            },
            '@keyframes equalizer3': {
              '0%': { height: `${size * 0.6}px` },
              '100%': { height: `${size * 0.4}px` },
            },
          }}
        />
      ))}
    </Box>
  );
};

const MyNarrativesPage: React.FC = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auth state
  const { user, token } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  const userId = user?.userId || '';

  // Data state
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Audio state
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  // Menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Polling for processing narratives
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processingIdsRef = useRef<Set<string>>(new Set());

  // Load narratives
  const loadNarratives = useCallback(async (showLoading = true) => {
    if (!userId || !isAuthenticated) return;

    if (showLoading) setIsLoading(true);
    try {
      setError(null);
      const response = await narrativesApi.getUserNarratives(userId);
      let fetched = response.data.narratives || [];

      // Sort by createdAt descending (newest first)
      fetched = fetched.sort((a: Narrative, b: Narrative) => b.createdAt - a.createdAt);

      setNarratives(fetched);
      setTotalCount(fetched.length);

      // Return processing IDs for polling
      const processingIds = fetched
        .filter((n: Narrative) => n.status === 'processing')
        .map((n: Narrative) => n.narrativeId);
      return processingIds as string[];
    } catch (err: any) {
      console.error('Failed to load narratives:', err);
      setError(err.response?.data?.error || 'Failed to load narratives');
      return [] as string[];
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [userId, isAuthenticated]);

  // Start polling for processing updates
  const startPolling = useCallback((initialProcessingIds: string[]) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    initialProcessingIds.forEach(id => processingIdsRef.current.add(id));

    pollingIntervalRef.current = setInterval(async () => {
      const currentProcessingIds = await loadNarratives(false);
      const processingIds = currentProcessingIds || [];

      const completedIds = Array.from(processingIdsRef.current).filter(
        id => !processingIds.includes(id)
      );

      if (completedIds.length > 0) {
        setNotification({
          open: true,
          message: completedIds.length === 1 ? 'Your voiceover is ready! 🎙️' : `${completedIds.length} voiceovers are ready! 🎙️`,
          severity: 'success'
        });
        completedIds.forEach(id => processingIdsRef.current.delete(id));
      }

      processingIds.forEach(id => processingIdsRef.current.add(id));

      if (processingIds.length === 0 && pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }, 5000);
  }, [loadNarratives]);

  // Load narratives on mount
  useEffect(() => {
    if (userId && isAuthenticated) {
      loadNarratives().then((processingIds) => {
        if (processingIds && processingIds.length > 0) {
          startPolling(processingIds);
        }
      });
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [userId, isAuthenticated, loadNarratives, startPolling]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Filter narratives based on search and type
  const filteredNarratives = narratives.filter(narrative => {
    const matchesSearch = !searchQuery ||
      (narrative.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = !typeFilter || narrative.narrativeType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handlePlayPause = (narrative: Narrative) => {
    if (!narrative.audioUrl) return;

    if (playingId === narrative.narrativeId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(narrative.audioUrl);
      audioRef.current.onended = () => setPlayingId(null);
      audioRef.current.onerror = () => setPlayingId(null);
      audioRef.current.play();
      setPlayingId(narrative.narrativeId);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, narrative: Narrative) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedNarrative(narrative);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedNarrative(null);
  };

  const handleDownload = () => {
    if (!selectedNarrative?.audioUrl) return;

    const link = document.createElement('a');
    link.href = selectedNarrative.audioUrl;
    link.download = `${selectedNarrative.title || 'voiceover'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();

    setNotification({
      open: true,
      message: `Downloaded "${selectedNarrative.title || 'Voiceover'}"`,
      severity: 'success'
    });
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNarrative) return;

    try {
      setIsDeleting(true);
      await narrativesApi.deleteNarrative(userId, selectedNarrative.narrativeId);
      setNarratives(prev => prev.filter(n => n.narrativeId !== selectedNarrative.narrativeId));
      setTotalCount(prev => prev - 1);

      if (playingId === selectedNarrative.narrativeId) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setPlayingId(null);
      }

      setNotification({
        open: true,
        message: `"${selectedNarrative.title || 'Voiceover'}" deleted`,
        severity: 'success'
      });
    } catch (err: any) {
      console.error('Failed to delete narrative:', err);
      setNotification({
        open: true,
        message: 'Failed to delete voiceover',
        severity: 'error'
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedNarrative(null);
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '--:--';
    const seconds = Math.round(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const hasActiveFilters = searchQuery || typeFilter;

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        gap: 2,
      }}>
        {/* Left: Icon + Title + Subtitle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,212,170,0.3)',
              flexShrink: 0,
            }}
          >
            <HeadsetMicIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                My Voiceovers
              </Typography>
              <Chip
                label={totalCount}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0,212,170,0.1)',
                  color: '#00D4AA',
                  fontWeight: 500,
                  height: 24,
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              Your generated and uploaded voiceovers
            </Typography>
          </Box>
        </Box>

        {/* Right: Upload and Create Buttons */}
        <Box sx={{ flexShrink: 0 }}>
          {/* Full buttons on sm+ screens */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <GhostButton
              startIcon={<CloudUploadIcon />}
              onClick={() => navigate('/upload?type=song&audioType=voice')}
              sx={{ borderRadius: '10px', px: 2, py: 0.75 }}
            >
              Upload
            </GhostButton>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create/narrative')}
              sx={{
                background: '#00D4AA',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.75,
                boxShadow: '0 2px 8px rgba(0,212,170,0.3)',
                '&:hover': { background: '#00B894' },
              }}
            >
              Create New
            </Button>
          </Box>
          {/* Circle icon buttons on xs screens */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
            <GhostIconButton
              onClick={() => navigate('/upload?type=song&audioType=voice')}
              sx={{ width: 44, height: 44 }}
            >
              <CloudUploadIcon sx={{ fontSize: 22 }} />
            </GhostIconButton>
            <IconButton
              onClick={() => navigate('/create/narrative')}
              sx={{
                width: 44,
                height: 44,
                background: '#00D4AA',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0,212,170,0.3)',
                '&:hover': { background: '#00B894' },
              }}
            >
              <AddIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Error Banner - compact, at top */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            mb: 2,
            maxWidth: 400,
            borderRadius: '12px',
            bgcolor: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            '& .MuiAlert-message': { color: '#fff', fontSize: '0.875rem' },
            '& .MuiAlert-icon': { color: '#f44336' },
          }}
        >
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 1.5, lg: 2 },
          alignItems: { xs: 'stretch', lg: 'center' },
        }}
      >
        {/* Search Bar */}
        <TextField
          placeholder="Search voiceovers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{
            flex: { lg: 1 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: searchQuery ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
              border: searchQuery ? '2px solid #3B82F6' : '2px solid transparent',
              color: '#fff',
              '& fieldset': { border: 'none' },
              '&:hover': { backgroundColor: searchQuery ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)' },
              '&.Mui-focused': { backgroundColor: 'rgba(59,130,246,0.1)', border: '2px solid #3B82F6' },
            },
            '& .MuiInputBase-input': {
              color: '#fff',
              '&::placeholder': { color: 'rgba(255,255,255,0.5)', opacity: 1 },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Type Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: 0, lg: 160 }, flex: { xs: 1, lg: 'none' } }}>
          <Select
            value={typeFilter}
            onChange={(e: SelectChangeEvent) => setTypeFilter(e.target.value)}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                    <Box sx={{
                      width: { xs: 24, sm: 28 },
                      height: { xs: 24, sm: 28 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00D4AA, #00B894)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <AutoAwesomeIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#fff' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' }, color: '#fff' }}>All Types</Typography>
                  </Box>
                );
              }
              const type = typeOptions.find(t => t.id === selected);
              const Icon = type?.icon || AutoAwesomeIcon;
              return type ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                  <Box sx={{
                    width: { xs: 24, sm: 28 },
                    height: { xs: 24, sm: 28 },
                    borderRadius: '50%',
                    background: selected === 'story' ? 'linear-gradient(135deg, #00D4AA, #00B894)' : 'linear-gradient(135deg, #FF2D55, #FF6B9D)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#fff' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' }, color: '#fff' }}>{type.name}</Typography>
                </Box>
              ) : selected;
            }}
            sx={{
              borderRadius: '10px',
              backgroundColor: typeFilter ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
              border: typeFilter ? '2px solid #3B82F6' : '2px solid transparent',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover': { backgroundColor: typeFilter ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)' },
              '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 400,
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  mt: 1,
                  bgcolor: '#141418',
                  border: '1px solid rgba(255,255,255,0.1)',
                }
              }
            }}
          >
            <MenuItem value="" sx={{ py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00D4AA, #00B894)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AutoAwesomeIcon sx={{ fontSize: 16, color: '#fff' }} />
                </Box>
                <Typography sx={{ fontWeight: 500, color: '#fff' }}>All Types</Typography>
              </Box>
            </MenuItem>
            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
            {typeOptions.map((type) => {
              const Icon = type.icon;
              return (
                <MenuItem
                  key={type.id}
                  value={type.id}
                  sx={{
                    py: 1,
                    '&:hover': { backgroundColor: 'rgba(59,130,246,0.15)' },
                    '&.Mui-selected': { backgroundColor: 'rgba(59,130,246,0.2)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: type.id === 'story' ? 'linear-gradient(135deg, #00D4AA, #00B894)' : 'linear-gradient(135deg, #FF2D55, #FF6B9D)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 500, color: '#fff' }}>{type.name}</Typography>
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            size="small"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('');
            }}
            sx={{
              textTransform: 'none',
              color: '#fff !important',
              whiteSpace: 'nowrap',
              '& .MuiSvgIcon-root': { color: '#fff !important' },
              '&:hover': { color: '#fff !important', backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
            startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
          >
            Clear filters
          </Button>
        )}
      </Box>

      {/* Loading state */}
      {isLoading ? (
        <Box>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 2 },
                p: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 3 },
                borderBottom: i < 8 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <Box sx={{ width: { xs: 24, sm: 32 }, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <Skeleton variant="rounded" width={16} height={24} sx={{ borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Box>
              <Skeleton variant="circular" width={48} height={48} sx={{ flexShrink: 0, bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton variant="text" width="45%" height={22} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Skeleton variant="text" width="30%" height={18} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Box sx={{ width: 28, display: 'flex', justifyContent: 'center' }}>
                  <Skeleton variant="rounded" width={6} height={18} sx={{ borderRadius: '3px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ) : filteredNarratives.length === 0 ? (
        <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
          <HeadsetMicIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#fff' }}>
            {hasActiveFilters ? 'No matching voiceovers' : 'No voiceovers yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, mb: 3, px: 2 }}>
            {hasActiveFilters ? 'Try adjusting your filters' : 'Create your first voiceover to get started'}
          </Typography>
          {!hasActiveFilters && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create/narrative')}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)',
              }}
            >
              Create Voiceover
            </Button>
          )}
        </Box>
      ) : (
        <Box>
          {filteredNarratives.map((narrative, index) => {
            const isProcessing = narrative.status === 'processing';
            const isFailed = narrative.status === 'failed';
            const isPlaying = playingId === narrative.narrativeId;
            const isCompleted = narrative.status === 'completed';

            return (
              <Box
                key={narrative.narrativeId}
                onClick={() => !isProcessing && !isFailed && isCompleted && handlePlayPause(narrative)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  px: { xs: 2, sm: 3 },
                  borderBottom: index < filteredNarratives.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  transition: 'all 0.2s ease',
                  opacity: isProcessing ? 0.85 : 1,
                  cursor: isProcessing || isFailed || !isCompleted ? 'default' : 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(59,130,246,0.08)',
                    '& .play-overlay': {
                      opacity: 1,
                    },
                  },
                }}
              >
                {/* Track Number */}
                <Typography
                  sx={{
                    width: { xs: 24, sm: 32 },
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </Typography>

                {/* Icon / Loading Indicator */}
                <Box
                  sx={{
                    width: { xs: 44, sm: 48 },
                    height: { xs: 44, sm: 48 },
                    borderRadius: '50%',
                    background: isProcessing
                      ? 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)'
                      : isFailed
                      ? 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)'
                      : narrative.narrativeType === 'story'
                      ? 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)'
                      : 'linear-gradient(135deg, #FF2D55 0%, #FF6B9D 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isProcessing ? (
                    <AutorenewIcon
                      sx={{
                        color: '#fff',
                        fontSize: 24,
                        animation: 'spin 1.5s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                  ) : (
                    <>
                      {narrative.narrativeType === 'story' ? (
                        <MenuBookIcon sx={{ fontSize: 22, color: '#fff' }} />
                      ) : (
                        <CampaignIcon sx={{ fontSize: 22, color: '#fff' }} />
                      )}
                      {/* Play overlay - shows on hover or when playing */}
                      {isCompleted && (
                        <Box
                          className="play-overlay"
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isPlaying ? 'rgba(0,212,170,0.7)' : 'rgba(0,0,0,0.5)',
                            opacity: isPlaying ? 1 : 0,
                            transition: 'opacity 0.2s',
                          }}
                        >
                          {isPlaying ? (
                            <AudioEqualizer isPlaying={true} size={22} color="#fff" />
                          ) : (
                            <PlayArrowRoundedIcon sx={{ fontSize: 22, color: '#fff' }} />
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </Box>

                {/* Track Info */}
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: isFailed ? '#FF3B30' : '#fff',
                      fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {narrative.title || 'Untitled'}
                  </Typography>
                  {isProcessing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: '#00D4AA', fontSize: { xs: '0.75rem', sm: '0.85rem' }, fontWeight: 500 }}>
                        Creating...
                      </Typography>
                      <LinearProgress
                        variant="indeterminate"
                        sx={{
                          flex: 1,
                          maxWidth: 100,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: 'rgba(0,212,170,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#00D4AA',
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography sx={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {narrative.narrativeType === 'story' ? 'Story' : 'Content'} • {formatDuration(narrative.durationMs)} • {formatDate(narrative.createdAt)}
                    </Typography>
                  )}
                </Box>

                {/* Action Buttons - Only show for completed voiceovers */}
                {!isProcessing && !isFailed && isCompleted && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
                    {/* Play Button */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(narrative);
                      }}
                      sx={{
                        width: { xs: 36, md: 40 },
                        height: { xs: 36, md: 40 },
                        background: '#00D4AA',
                        color: '#fff',
                        '&:hover': {
                          background: '#00B894',
                        },
                      }}
                    >
                      {isPlaying ? (
                        <PauseIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                      ) : (
                        <PlayArrowRoundedIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                      )}
                    </IconButton>

                    {/* More Menu Button */}
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, narrative)}
                      size="small"
                      sx={{
                        color: '#fff',
                        '&:hover': {
                          color: '#fff',
                          background: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                )}

                {/* Failed state */}
                {isFailed && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNarrative(narrative);
                      setDeleteDialogOpen(true);
                    }}
                    sx={{
                      width: 40,
                      height: 40,
                      background: 'rgba(255,59,48,0.1)',
                      border: '1px solid rgba(255,59,48,0.3)',
                      color: '#FF3B30',
                      '&:hover': {
                        background: 'rgba(255,59,48,0.2)',
                      },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: '#141418',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            minWidth: 160,
          },
        }}
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon sx={{ color: '#3B82F6' }} />
          </ListItemIcon>
          <ListItemText primary="Download" primaryTypographyProps={{ sx: { color: '#fff' } }} />
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon sx={{ color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ sx: { color: '#f44336' } }} />
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#141418',
            borderRadius: '16px',
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 1,
        }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: 'rgba(255,59,48,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DeleteIcon sx={{ fontSize: 24, color: '#FF3B30' }} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#fff' }}>
            Delete Voiceover?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Are you sure you want to delete "<strong style={{ color: '#fff' }}>{selectedNarrative?.title || 'this voiceover'}</strong>"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <GhostButton
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
            sx={{ flex: 1, py: 1.25 }}
          >
            Cancel
          </GhostButton>
          <Button
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            variant="contained"
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)',
              boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E53528 0%, #FF5252 100%)',
                boxShadow: '0 6px 16px rgba(255, 59, 48, 0.4)',
              },
              '&:disabled': { opacity: 0.7 },
            }}
          >
            {isDeleting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{
            borderRadius: 2,
            bgcolor: notification.severity === 'success' ? 'rgba(0,212,170,0.15)' : 'rgba(244,67,54,0.15)',
            border: `1px solid ${notification.severity === 'success' ? 'rgba(0,212,170,0.3)' : 'rgba(244,67,54,0.3)'}`,
            '& .MuiAlert-message': { color: '#fff' },
            '& .MuiAlert-icon': { color: notification.severity === 'success' ? '#00D4AA' : '#f44336' },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyNarrativesPage;
