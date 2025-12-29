import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { charactersApi } from '../services/api';

// Avatar with skeleton loading state
const LoadingAvatar: React.FC<{
  src: string;
  size: { xs: number; sm: number };
  fallback?: React.ReactNode;
}> = ({ src, size, fallback }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {isLoading && !hasError && (
        <Skeleton 
          variant="circular" 
          sx={{ 
            width: size, 
            height: size, 
            position: 'absolute',
            top: 0,
            left: 0,
          }} 
          animation="wave"
        />
      )}
      <Avatar
        src={hasError ? undefined : src}
        sx={{
          width: size,
          height: size,
          bgcolor: '#E5E5EA',
          opacity: isLoading && !hasError ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}
        imgProps={{
          onLoad: () => setIsLoading(false),
          onError: () => {
            setIsLoading(false);
            setHasError(true);
          },
          loading: 'lazy',
        }}
      >
        {fallback || <PersonIcon sx={{ color: '#8E8E93' }} />}
      </Avatar>
    </Box>
  );
};

interface Character {
  characterId: string;
  characterName: string;
  gender?: string;
  age?: string;
  description?: string;
  imageUrls?: string[];
  imageKeys?: string[];
  createdAt: string;
}

// Get the type image based on character description
const getCharacterTypeImage = (description?: string): string => {
  if (!description) return '/characters/human.jpeg';
  if (description.includes('Place')) return '/characters/house.jpeg';
  if (description.includes('Product')) return '/characters/product.jpeg';
  if (description.includes('Non-Human')) return '/characters/dog.jpeg';
  return '/characters/human.jpeg';
};

const CharactersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const fetchCharacters = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      setIsLoading(true);
      const response = await charactersApi.getUserCharacters(user.userId);
      setCharacters(response.data.characters || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setCharacters([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const handleDeleteClick = (e: React.MouseEvent, character: Character) => {
    e.stopPropagation(); // Prevent navigating to edit page
    setCharacterToDelete(character);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user?.userId || !characterToDelete) return;
    
    setIsDeleting(true);
    try {
      await charactersApi.deleteCharacter(user.userId, characterToDelete.characterId);
      setCharacters(prev => prev.filter(c => c.characterId !== characterToDelete.characterId));
      setNotification({
        open: true,
        message: `"${characterToDelete.characterName}" deleted successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting character:', error);
      setNotification({
        open: true,
        message: 'Failed to delete character. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCharacterToDelete(null);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '100vh',
      pt: 4,
      pb: { xs: 4, sm: 8 },
      px: { xs: 2, sm: 3 },
      overflow: 'hidden',
    }}>
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        maxWidth: { xs: '100%', lg: '900px' },
        p: 0,
        overflow: 'hidden',
      }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: { xs: 2, sm: 3 },
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                <PersonIcon sx={{ color: '#007AFF', flexShrink: 0 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', whiteSpace: 'nowrap' }}>
                  My Cast
                </Typography>
                <Chip 
                  label={`${characters.length}`}
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(0,122,255,0.1)',
                    color: '#007AFF',
                    fontWeight: 500,
                    display: { xs: 'none', sm: 'flex' },
                  }} 
                />
              </Box>
            {/* Mobile: Icon button */}
            <Tooltip title="Create New" arrow>
              <IconButton
                onClick={() => navigate('/characters/create')}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  background: '#007AFF',
                  color: '#fff',
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: '#0066CC',
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            {/* Desktop: Full button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/characters/create')}
              sx={{
                display: { xs: 'none', md: 'flex' },
                background: '#007AFF',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.75,
                boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                '&:hover': {
                  background: '#0066CC',
                },
              }}
            >
              Create New
            </Button>
            </Box>
            <Typography sx={{ color: '#86868B', fontSize: '0.85rem', mt: 0.5, maxWidth: 400 }}>
              Add people, products, or places. Tag them when creating a video to feature them!
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <CircularProgress sx={{ color: '#007AFF' }} />
            </Box>
          ) : characters.length === 0 ? (
            <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 64, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No references yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, px: 2 }}>
                Add characters, products or places to feature in your songs and videos
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/characters/create')}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                }}
              >
                Create New
              </Button>
            </Box>
          ) : (
            <Box sx={{ 
              p: 3, 
              maxHeight: 'calc(100vh - 250px)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}>
              {characters.map((character) => (
                <Box
                  key={character.characterId}
                  onClick={() => navigate(`/characters/edit/${character.characterId}`)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0,122,255,0.05)',
                      borderColor: '#007AFF',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,122,255,0.15)',
                    },
                  }}
                >
                  <LoadingAvatar
                    src={character.imageUrls?.[0] || getCharacterTypeImage(character.description)}
                    size={{ xs: 48, sm: 56 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#1D1D1F',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      {character.characterName}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      {character.description?.includes('Place') 
                        ? 'Place' 
                        : character.description?.includes('Product') 
                          ? 'Product' 
                          : `${character.gender || ''}${character.age ? ` • ${character.age}` : ''}`}
                    </Typography>
                  </Box>
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      onClick={(e) => handleDeleteClick(e, character)}
                      size="small"
                      sx={{
                        color: '#8E8E93',
                        flexShrink: 0,
                        '&:hover': {
                          color: '#FF3B30',
                          backgroundColor: 'rgba(255,59,48,0.1)',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !isDeleting && setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              maxWidth: 400,
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            Delete?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{characterToDelete?.characterName}"? This cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              variant="outlined"
              sx={{
                color: '#1D1D1F',
                borderColor: 'rgba(0,0,0,0.2)',
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '12px',
                px: 3,
                py: 1,
                flex: 1,
                '&:hover': {
                  borderColor: 'rgba(0,0,0,0.4)',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              variant="contained"
              sx={{
                color: '#fff',
                backgroundColor: '#007AFF',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '12px',
                px: 3,
                py: 1,
                flex: 1,
                '&:hover': {
                  backgroundColor: '#0066CC',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0,122,255,0.5)',
                  color: '#fff',
                },
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
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: 8 }}
        >
          <Alert
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.severity}
            sx={{ width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CharactersPage;

