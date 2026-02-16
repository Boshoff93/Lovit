import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useGetSlideshowsQuery, useDeleteSlideshowMutation, Slideshow } from '../store/apiSlice';

const ITEMS_PER_PAGE = 12;

const MySlideshowsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuSlideshow, setMenuSlideshow] = useState<Slideshow | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading } = useGetSlideshowsQuery();
  const [deleteSlideshow, { isLoading: isDeleting }] = useDeleteSlideshowMutation();

  const allSlideshows = data?.slideshows || [];

  // Filter by search
  const filtered = search
    ? allSlideshows.filter(s =>
        (s.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (s.description || '').toLowerCase().includes(search.toLowerCase())
      )
    : allSlideshows;

  // Sort by most recent
  const sorted = [...filtered].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = async () => {
    if (!menuSlideshow) return;
    try {
      await deleteSlideshow(menuSlideshow.slideshowId).unwrap();
    } catch (err) {
      console.error('Failed to delete slideshow:', err);
    }
    setDeleteDialogOpen(false);
    setMenuSlideshow(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generating':
        return <CircularProgress size={16} sx={{ color: '#007AFF' }} />;
      case 'ready':
        return <CheckCircleIcon sx={{ fontSize: 18, color: '#22C55E' }} />;
      case 'failed':
        return <ErrorIcon sx={{ fontSize: 18, color: '#FF3B30' }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px',
            background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            flexShrink: 0,
            animation: 'iconEntrance 0.5s ease-out',
            '@keyframes iconEntrance': {
              '0%': { opacity: 0, transform: 'scale(0.5) rotate(-10deg)' },
              '50%': { transform: 'scale(1.1) rotate(5deg)' },
              '100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
            },
          }}>
            <ViewCarouselIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              My Slideshows
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {sorted.length} slideshow{sorted.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/create/slideshow')}
          sx={{
            background: '#007AFF',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 2.5,
            py: 1,
            boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
            '&:hover': {
              background: '#0066CC',
              boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
            },
          }}
        >
          Create Slideshow
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search slideshows..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
          },
          '& .MuiInputBase-input': {
            '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#007AFF' }} />
        </Box>
      )}

      {/* Empty state */}
      {!isLoading && sorted.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ViewCarouselIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>No slideshows yet</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 3 }}>
            Create your first AI-generated slideshow for TikTok or Instagram
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create/slideshow')}
            sx={{
              background: '#007AFF',
              color: '#fff',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              '&:hover': { background: '#0066CC' },
            }}
          >
            Create Slideshow
          </Button>
        </Box>
      )}

      {/* Grid */}
      {!isLoading && paginated.length > 0 && (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2,
        }}>
          {paginated.map((slideshow) => (
            <Box
              key={slideshow.slideshowId}
              onClick={() => navigate(`/slideshow/${slideshow.slideshowId}`)}
              sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
              }}
            >
              {/* Thumbnail */}
              <Box sx={{ position: 'relative', aspectRatio: slideshow.aspectRatio === '4:5' ? '4/5' : '9/16', maxHeight: 280, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                {slideshow.imageUrls?.[0] ? (
                  <Box
                    component="img"
                    src={slideshow.imageUrls[0]}
                    alt={slideshow.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    {slideshow.status === 'generating' ? (
                      <CircularProgress size={32} sx={{ color: '#007AFF' }} />
                    ) : (
                      <ViewCarouselIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)' }} />
                    )}
                  </Box>
                )}
                {/* Status badge */}
                <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                  {getStatusBadge(slideshow.status)}
                </Box>
                {/* Slide count badge */}
                <Chip
                  label={`${slideshow.slideCount} slides`}
                  size="small"
                  sx={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    fontSize: '0.7rem', fontWeight: 500, height: 24,
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
                {/* Menu button */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuAnchor(e.currentTarget);
                    setMenuSlideshow(slideshow);
                  }}
                  sx={{
                    position: 'absolute', bottom: 8, right: 8,
                    backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
                  }}
                >
                  <MoreVertIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>

              {/* Info */}
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }} noWrap>
                  {slideshow.title || 'Untitled Slideshow'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {new Date(slideshow.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            sx={{
              '& .Mui-selected': { backgroundColor: '#007AFF !important', color: '#fff' },
              '& .MuiPaginationItem-root': { color: 'rgba(255,255,255,0.7)' },
            }}
          />
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => { setMenuAnchor(null); setMenuSlideshow(null); }}
      >
        <MenuItem onClick={() => {
          setMenuAnchor(null);
          setDeleteDialogOpen(true);
        }}>
          <DeleteIcon sx={{ fontSize: 18, mr: 1, color: '#FF3B30' }} />
          <Typography variant="body2" sx={{ color: '#FF3B30' }}>Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', p: 1, bgcolor: '#1D1D1F' } }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>Delete Slideshow?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            This will permanently delete "{menuSlideshow?.title || 'Untitled Slideshow'}" and all its images. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', color: 'rgba(255,255,255,0.7)' }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            sx={{ textTransform: 'none', borderRadius: '10px' }}
          >
            {isDeleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MySlideshowsPage;
