import React, { useState, useMemo } from 'react';
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
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
  FormControl,
  Select,
  SelectChangeEvent,
  Divider,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';
import Crop54Icon from '@mui/icons-material/Crop54';
import { useGetSlideshowsQuery, useDeleteSlideshowMutation, Slideshow } from '../store/apiSlice';
import { GhostButton } from '../components/GhostButton';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ITEMS_PER_PAGE = 12;

// Filter options for aspect ratio
const ratioOptions = [
  { id: '9:16', name: 'Portrait (9:16)', icon: CropPortraitIcon },
  { id: '4:5', name: 'Square (4:5)', icon: Crop54Icon },
];

const MySlideshowsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [ratioFilter, setRatioFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuSlideshow, setMenuSlideshow] = useState<Slideshow | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading } = useGetSlideshowsQuery();
  const [deleteSlideshow, { isLoading: isDeleting }] = useDeleteSlideshowMutation();

  const allSlideshows = data?.slideshows || [];

  // Filter and sort
  const filtered = useMemo(() => {
    let result = allSlideshows;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        (s.title || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      );
    }
    if (ratioFilter) {
      result = result.filter(s => s.aspectRatio === ratioFilter);
    }
    return [...result].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [allSlideshows, search, ratioFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const [downloadingSlideshowId, setDownloadingSlideshowId] = useState<string | null>(null);

  const handleView = (slideshow: Slideshow) => {
    navigate(`/slideshow/${slideshow.slideshowId}`);
  };

  const handleDownload = async (slideshow: Slideshow) => {
    if (!slideshow.imageUrls?.length) return;
    setDownloadingSlideshowId(slideshow.slideshowId);
    try {
      const zip = new JSZip();
      const fetches = slideshow.imageUrls.map(async (url: string, i: number) => {
        const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
        const blob = await res.blob();
        zip.file(`slide-${i + 1}.jpg`, blob);
      });
      await Promise.all(fetches);
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${slideshow.title || 'slideshow'}-slides.zip`);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingSlideshowId(null);
    }
  };

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

  const hasActiveFilters = search || ratioFilter;

  return (
    <Box sx={{ pt: { xs: 0, md: 2 }, pb: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        gap: 2,
      }}>
        {/* Left: Icon + Title + Count */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
              flexShrink: 0,
            }}
          >
            <ViewCarouselIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                My Slideshows
              </Typography>
              <Chip
                label={allSlideshows.length}
                size="small"
                sx={{
                  backgroundColor: 'rgba(16,185,129,0.1)',
                  color: '#10B981',
                  fontWeight: 500,
                  height: 24,
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              Your AI-generated slideshows
            </Typography>
          </Box>
        </Box>

        {/* Right: Create Button */}
        <Box sx={{ flexShrink: 0 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create/slideshow')}
              sx={{
                background: '#007AFF',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.75,
                boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                '&:hover': { background: '#0066DD' },
              }}
            >
              Create Slideshow
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              onClick={() => navigate('/create/slideshow')}
              sx={{
                width: 44,
                height: 44,
                background: '#007AFF',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                '&:hover': { background: '#0066DD' },
              }}
            >
              <AddIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Search and Filters - matching MyNarrativesPage style */}
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
          placeholder="Search slideshows..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          size="small"
          sx={{
            flex: { lg: 1 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: search ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
              border: search ? '2px solid #3B82F6' : '2px solid transparent',
              color: '#fff',
              '& fieldset': { border: 'none' },
              '&:hover': { backgroundColor: search ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)' },
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
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch('')}>
                  <ClearIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Aspect Ratio Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: 0, lg: 180 }, flex: { xs: 1, lg: 'none' } }}>
          <Select
            value={ratioFilter}
            onChange={(e: SelectChangeEvent) => { setRatioFilter(e.target.value); setPage(1); }}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                    <Box sx={{
                      width: { xs: 24, sm: 28 },
                      height: { xs: 24, sm: 28 },
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10B981, #14B8A6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <AutoAwesomeIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#fff' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' }, color: '#fff' }}>All Ratios</Typography>
                  </Box>
                );
              }
              const opt = ratioOptions.find(o => o.id === selected);
              const Icon = opt?.icon || AspectRatioIcon;
              return opt ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                  <Box sx={{
                    width: { xs: 24, sm: 28 },
                    height: { xs: 24, sm: 28 },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981, #14B8A6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#fff' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' }, color: '#fff' }}>{opt.name}</Typography>
                </Box>
              ) : selected;
            }}
            sx={{
              borderRadius: '10px',
              backgroundColor: ratioFilter ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
              border: ratioFilter ? '2px solid #3B82F6' : '2px solid transparent',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover': { backgroundColor: ratioFilter ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)' },
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
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981, #14B8A6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AutoAwesomeIcon sx={{ fontSize: 16, color: '#fff' }} />
                </Box>
                <Typography sx={{ fontWeight: 500, color: '#fff' }}>All Ratios</Typography>
              </Box>
            </MenuItem>
            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
            {ratioOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <MenuItem
                  key={opt.id}
                  value={opt.id}
                  sx={{
                    py: 1,
                    '&:hover': { backgroundColor: 'rgba(59,130,246,0.15)' },
                    '&.Mui-selected': { backgroundColor: 'rgba(59,130,246,0.2)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10B981, #14B8A6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 500, color: '#fff' }}>{opt.name}</Typography>
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            size="small"
            onClick={() => { setSearch(''); setRatioFilter(''); setPage(1); }}
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

      {/* Loading state - skeleton tiles matching MyVideosPage */}
      {isLoading && (
        <Box>
          {/* First date group */}
          <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 5,
          }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={`group-1-${i}`} sx={{ position: 'relative' }}>
                <Skeleton
                  variant="rounded"
                  sx={{
                    width: '100%',
                    paddingTop: '177.78%',
                    borderRadius: '20px',
                  }}
                />
                <Skeleton
                  variant="circular"
                  width={32}
                  height={32}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1.5,
                }}>
                  <Skeleton variant="text" width="70%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
                  <Skeleton variant="rounded" width="50%" height={24} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                </Box>
              </Box>
            ))}
          </Box>

          {/* Second date group */}
          <Skeleton variant="text" width={140} height={24} sx={{ mb: 2 }} />
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={`group-2-${i}`} sx={{ position: 'relative' }}>
                <Skeleton
                  variant="rounded"
                  sx={{
                    width: '100%',
                    paddingTop: '177.78%',
                    borderRadius: '20px',
                  }}
                />
                <Skeleton
                  variant="circular"
                  width={32}
                  height={32}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                />
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1.5,
                }}>
                  <Skeleton variant="text" width="70%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
                  <Skeleton variant="rounded" width="50%" height={24} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
          <ViewCarouselIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#fff' }}>
            {hasActiveFilters ? 'No matching slideshows' : 'No slideshows yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, mb: 3, px: 2 }}>
            {hasActiveFilters ? 'Try adjusting your filters' : 'Create your first AI-generated slideshow'}
          </Typography>
          {!hasActiveFilters && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create/slideshow')}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
              }}
            >
              Create Slideshow
            </Button>
          )}
        </Box>
      )}

      {/* Grid - consistent 9:16 tiles regardless of slideshow aspect ratio */}
      {!isLoading && paginated.length > 0 && (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}>
          {paginated.map((slideshow) => (
            <Box
              key={slideshow.slideshowId}
              onClick={() => navigate(`/slideshow/${slideshow.slideshowId}`)}
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                },
              }}
            >
              {/* Thumbnail - consistent 9:16 aspect for all tiles */}
              <Box sx={{ position: 'relative', aspectRatio: '9/16', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)' }}>
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
                {/* Status badge - top left */}
                <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                  {getStatusBadge(slideshow.status)}
                </Box>
                {/* Slide count badge - top left after status */}
                <Chip
                  label={`${slideshow.slideCount} slides`}
                  size="small"
                  sx={{
                    position: 'absolute', top: 8, left: slideshow.status ? 32 : 8,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    fontSize: '0.65rem', fontWeight: 500, height: 22,
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                />
                {/* Menu button - top right */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuAnchor(e.currentTarget);
                    setMenuSlideshow(slideshow);
                  }}
                  sx={{
                    position: 'absolute', top: 6, right: 6,
                    backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff',
                    width: 28, height: 28,
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
                  }}
                >
                  <MoreVertIcon sx={{ fontSize: 16 }} />
                </IconButton>
                {/* Bottom gradient overlay for title */}
                <Box sx={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                  p: 1.5, pt: 4,
                }}>
                  <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem', lineHeight: 1.3 }} noWrap>
                    {slideshow.title || 'Untitled Slideshow'}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
                    {new Date(slideshow.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
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

      {/* Context Menu - matching video page */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => { setMenuAnchor(null); setMenuSlideshow(null); }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            minWidth: 160,
            bgcolor: '#141418 !important',
            backgroundImage: 'none !important',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      >
        {menuSlideshow?.status === 'ready' && (
          <MenuItem
            onClick={() => {
              if (menuSlideshow) handleView(menuSlideshow);
              setMenuAnchor(null);
              setMenuSlideshow(null);
            }}
          >
            <ListItemIcon>
              <PlayArrowRoundedIcon sx={{ color: '#3B82F6' }} />
            </ListItemIcon>
            <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>View</ListItemText>
          </MenuItem>
        )}
        {menuSlideshow?.status === 'ready' && menuSlideshow?.imageUrls?.length > 0 && (
          <MenuItem
            onClick={() => {
              if (menuSlideshow) handleDownload(menuSlideshow);
              setMenuAnchor(null);
              setMenuSlideshow(null);
            }}
            disabled={downloadingSlideshowId === menuSlideshow?.slideshowId}
          >
            <ListItemIcon>
              {downloadingSlideshowId === menuSlideshow?.slideshowId ? (
                <CircularProgress size={20} sx={{ color: '#3B82F6' }} />
              ) : (
                <DownloadIcon sx={{ color: '#3B82F6' }} />
              )}
            </ListItemIcon>
            <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>
              {downloadingSlideshowId === menuSlideshow?.slideshowId ? 'Downloading...' : 'Download'}
            </ListItemText>
          </MenuItem>
        )}
        {menuSlideshow?.status === 'ready' && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <MenuItem
              onClick={() => {
                if (menuSlideshow) {
                  navigate(`/slideshow/${menuSlideshow.slideshowId}?scrollTo=social`);
                }
                setMenuAnchor(null);
                setMenuSlideshow(null);
              }}
            >
              <ListItemIcon>
                <ShareIcon sx={{ color: '#34C759' }} />
              </ListItemIcon>
              <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>Upload to Social Channels</ListItemText>
            </MenuItem>
          </>
        )}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setDeleteDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ color: '#FF3B30' }} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ sx: { color: '#fff' } }} />
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
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
            width: 48, height: 48, borderRadius: '12px',
            bgcolor: 'rgba(255,59,48,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <DeleteIcon sx={{ fontSize: 24, color: '#FF3B30' }} />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#fff' }}>
            Delete Slideshow?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Are you sure you want to delete "<strong style={{ color: '#fff' }}>{menuSlideshow?.title || 'Untitled Slideshow'}</strong>"? This will permanently remove all images. This action cannot be undone.
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
            onClick={handleDelete}
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
    </Box>
  );
};

export default MySlideshowsPage;
