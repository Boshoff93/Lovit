import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { narrativesApi, Narrative } from '../services/api';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';

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

  // Audio state
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedNarrative, setSelectedNarrative] = useState<Narrative | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load narratives on mount
  useEffect(() => {
    if (userId && isAuthenticated) {
      loadNarratives();
    }
  }, [userId, isAuthenticated]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const loadNarratives = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await narrativesApi.getUserNarratives(userId);
      // Sort by createdAt descending (newest first)
      const sorted = (response.data.narratives || []).sort(
        (a, b) => b.createdAt - a.createdAt
      );
      setNarratives(sorted);
    } catch (err: any) {
      console.error('Failed to load narratives:', err);
      setError(err.response?.data?.error || 'Failed to load narratives');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = (narrative: Narrative) => {
    if (!narrative.audioUrl) return;

    if (playingId === narrative.narrativeId) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingId(null);
    } else {
      // Start playing
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
    link.download = `${selectedNarrative.title || 'narrative'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    setMenuAnchor(null); // Close menu but keep selectedNarrative
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNarrative) return;

    try {
      setIsDeleting(true);
      await narrativesApi.deleteNarrative(userId, selectedNarrative.narrativeId);
      // Remove from local state
      setNarratives(prev => prev.filter(n => n.narrativeId !== selectedNarrative.narrativeId));
      // Stop audio if this was playing
      if (playingId === selectedNarrative.narrativeId) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setPlayingId(null);
      }
    } catch (err: any) {
      console.error('Failed to delete narrative:', err);
      setError(err.response?.data?.error || 'Failed to delete narrative');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedNarrative(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    const seconds = Math.round(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `0:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 50%, #0D0D0F 100%)',
        py: 4,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Error Banner */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError(null)}
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              '& .MuiAlert-message': { color: '#fff' },
              '& .MuiAlert-icon': { color: '#f44336' },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#fff',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <RecordVoiceOverIcon sx={{ color: '#00D4AA' }} />
              My Narratives
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Your generated voice narratives
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create/narrative')}
            sx={{
              background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%)',
              color: '#fff',
              px: 3,
              py: 1,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
              },
            }}
          >
            Create New
          </Button>
        </Box>

        {/* Loading state */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#00D4AA' }} />
          </Box>
        )}

        {/* Empty state */}
        {!isLoading && narratives.length === 0 && (
          <Paper
            sx={{
              p: 6,
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              textAlign: 'center',
            }}
          >
            <RecordVoiceOverIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
            <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
              No narratives yet
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
              Create your first AI-generated voice narrative
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create/narrative')}
              sx={{
                background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%)',
                color: '#fff',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                },
              }}
            >
              Create Narrative
            </Button>
          </Paper>
        )}

        {/* Narratives list */}
        {!isLoading && narratives.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {narratives.map((narrative) => {
              const isPlaying = playingId === narrative.narrativeId;
              const isCompleted = narrative.status === 'completed';
              const isFailed = narrative.status === 'failed';
              const isProcessing = narrative.status === 'processing';

              return (
                <Paper
                  key={narrative.narrativeId}
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.05)',
                      borderColor: 'rgba(255,255,255,0.12)',
                    },
                  }}
                >
                  {/* Play button */}
                  <IconButton
                    onClick={() => handlePlayPause(narrative)}
                    disabled={!isCompleted}
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: isPlaying ? 'rgba(0, 212, 170, 0.2)' : 'rgba(255,255,255,0.05)',
                      color: isCompleted ? (isPlaying ? '#00D4AA' : '#fff') : 'rgba(255,255,255,0.3)',
                      '&:hover': {
                        bgcolor: isPlaying ? 'rgba(0, 212, 170, 0.3)' : 'rgba(255,255,255,0.1)',
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(255,255,255,0.02)',
                        color: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {narrative.title || 'Untitled'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                        {formatDate(narrative.createdAt)}
                      </Typography>
                      {isCompleted && narrative.durationMs && (
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                          {formatDuration(narrative.durationMs)}
                        </Typography>
                      )}
                      {isProcessing && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CircularProgress size={12} sx={{ color: '#00D4AA' }} />
                          <Typography sx={{ color: '#00D4AA', fontSize: '0.8rem' }}>
                            Processing...
                          </Typography>
                        </Box>
                      )}
                      {isFailed && (
                        <Typography sx={{ color: '#f44336', fontSize: '0.8rem' }}>
                          Failed
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Menu button */}
                  {isCompleted && (
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, narrative)}
                      sx={{
                        color: 'rgba(255,255,255,0.5)',
                        '&:hover': { color: '#fff' },
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </Paper>
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
              bgcolor: '#1D1D1F',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2,
              minWidth: 160,
            },
          }}
        >
          <MenuItem onClick={handleDownload}>
            <ListItemIcon>
              <DownloadIcon sx={{ color: '#fff' }} />
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
              bgcolor: '#1D1D1F',
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff' }}>Delete Narrative</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Are you sure you want to delete "{selectedNarrative?.title || 'this narrative'}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              sx={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              sx={{
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                color: '#f44336',
                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' },
              }}
            >
              {isDeleting ? <CircularProgress size={20} sx={{ color: '#f44336' }} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MyNarrativesPage;
