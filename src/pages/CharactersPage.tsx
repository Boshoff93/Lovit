import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
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
import PetsIcon from '@mui/icons-material/Pets';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import { charactersApi } from '../services/api';
import { GhostButton } from '../components/GhostButton';

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
          bgcolor: 'rgba(255,255,255,0.1)',
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
        {fallback || <PersonIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />}
      </Avatar>
    </Box>
  );
};

interface Character {
  characterId: string;
  characterName: string;
  characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App' | 'Business';
  gender?: string;
  age?: string;
  description?: string;
  imageUrls?: string[];
  imageKeys?: string[];
  createdAt: string;
}

// Helper to get character type icon and color (matching CreateAIAssetPage icons)
const getCharacterTypeIcon = (characterType?: string, description?: string): { icon: React.ElementType; color: string } => {
  // Check characterType field first
  if (characterType) {
    switch (characterType) {
      case 'Product': return { icon: InventoryIcon, color: '#FF2D55' }; // Pink/red
      case 'Place': return { icon: HomeIcon, color: '#5856D6' }; // Purple
      case 'App': return { icon: PhoneIphoneIcon, color: 'rgba(255,255,255,0.6)' }; // Gray
      case 'Business': return { icon: BusinessIcon, color: '#FF3B30' };
      case 'Non-Human': return { icon: PetsIcon, color: '#FF9500' }; // Orange
      default: return { icon: PersonIcon, color: '#007AFF' }; // Blue for human
    }
  }
  // Fallback to description parsing for legacy data
  if (description) {
    if (description.includes('Place')) return { icon: HomeIcon, color: '#5856D6' };
    if (description.includes('App')) return { icon: PhoneIphoneIcon, color: 'rgba(255,255,255,0.6)' };
    if (description.includes('Product')) return { icon: InventoryIcon, color: '#FF2D55' };
    if (description.includes('Business')) return { icon: BusinessIcon, color: '#FF3B30' };
    if (description.includes('Non-Human')) return { icon: PetsIcon, color: '#FF9500' };
  }
  return { icon: PersonIcon, color: '#007AFF' };
};

// Character Avatar component that shows icon when no image
const CharacterAvatar: React.FC<{
  character: Character;
  size: { xs: number; sm: number };
}> = ({ character, size }) => {
  const hasImage = character.imageUrls && character.imageUrls.length > 0 && character.imageUrls[0];

  if (hasImage) {
    return (
      <LoadingAvatar
        src={character.imageUrls![0]}
        size={size}
      />
    );
  }

  const { icon: IconComponent, color } = getCharacterTypeIcon(character.characterType, character.description);
  return (
    <Box sx={{
      width: size,
      height: size,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: color,
      flexShrink: 0,
    }}>
      <IconComponent sx={{ fontSize: { xs: size.xs * 0.5, sm: size.sm * 0.5 }, color: '#fff' }} />
    </Box>
  );
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
    <Box sx={{ pt: { xs: 0, md: 2 }, pb: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
      {/* Header Row: Title + Create Button */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        gap: 2,
      }}>
        {/* Left: Title with Icon */}
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
              animation: 'iconEntrance 0.5s ease-out',
              '@keyframes iconEntrance': {
                '0%': {
                  opacity: 0,
                  transform: 'scale(0.5) rotate(-10deg)',
                },
                '50%': {
                  transform: 'scale(1.1) rotate(5deg)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1) rotate(0deg)',
                },
              },
            }}
          >
            <FolderSpecialIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                My AI Assets
              </Typography>
              <Chip
                label={`${characters.length}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(59,130,246,0.15)',
                  color: '#3B82F6',
                  fontWeight: 500,
                  height: 24,
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              Manage your characters, products, and places
            </Typography>
          </Box>
        </Box>

        {/* Right: Create Button */}
        <Box sx={{ flexShrink: 0 }}>
          {/* Mobile: Icon button */}
          <Tooltip title="Create New" arrow>
            <IconButton
              onClick={() => navigate('/ai-assets/create')}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                background: '#3B82F6',
                color: '#fff',
                width: 44,
                height: 44,
                boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                '&:hover': { background: '#2563EB' },
              }}
            >
              <AddIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
          {/* Desktop: Full button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/ai-assets/create')}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              background: '#3B82F6',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              py: 0.75,
              boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
              '&:hover': { background: '#2563EB' },
            }}
          >
            Create New
          </Button>
        </Box>
      </Box>

      {/* Description */}
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mb: 3 }}>
        Add people, products, or places. Tag them when creating a video to feature them! This helps the AI understand exactly what they look like, so your videos match your vision.
      </Typography>

      {/* Content */}
      {isLoading ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#3B82F6' }} />
        </Box>
      ) : characters.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#fff' }}>
            No references yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, mb: 3 }}>
            Add characters, products or places to feature in your songs and videos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/ai-assets/create')}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: '#3B82F6',
              '&:hover': { background: '#2563EB' },
            }}
          >
            Create New
          </Button>
        </Box>
      ) : (
        (() => {
          // Group characters by type - use characterType field, fallback to description parsing
          const getCharacterCategory = (char: Character): 'human' | 'nonhuman' | 'product' | 'place' | 'app' => {
            // Prefer characterType field if available
            if (char.characterType) {
              switch (char.characterType) {
                case 'Human': return 'human';
                case 'Non-Human': return 'nonhuman';
                case 'Product': return 'product';
                case 'Place': return 'place';
                case 'App': return 'app';
              }
            }
            // Fallback to description parsing for legacy data
            if (char.description?.includes('Place')) return 'place';
            if (char.description?.includes('App')) return 'app';
            if (char.description?.includes('Product')) return 'product';
            if (char.description?.includes('Non-Human')) return 'nonhuman';
            return 'human';
          };

          const grouped = {
            human: characters.filter(c => getCharacterCategory(c) === 'human'),
            nonhuman: characters.filter(c => getCharacterCategory(c) === 'nonhuman'),
            product: characters.filter(c => getCharacterCategory(c) === 'product'),
            place: characters.filter(c => getCharacterCategory(c) === 'place'),
            app: characters.filter(c => getCharacterCategory(c) === 'app'),
          };

          const sections = [
            { key: 'human', label: 'People', items: grouped.human },
            { key: 'nonhuman', label: 'Non-Humans', items: grouped.nonhuman },
            { key: 'product', label: 'Products', items: grouped.product },
            { key: 'place', label: 'Places', items: grouped.place },
            { key: 'app', label: 'Software & Apps', items: grouped.app },
          ].filter(section => section.items.length > 0);

          const renderCharacterItem = (character: Character) => (
            <Box
              key={character.characterId}
              onClick={() => navigate(`/ai-assets/edit/${character.characterId}`)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 2 },
                p: { xs: 1.5, sm: 2 },
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(59,130,246,0.08)',
                  borderColor: 'rgba(59,130,246,0.3)',
                },
              }}
            >
              <CharacterAvatar
                character={character}
                size={{ xs: 40, sm: 44 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#fff',
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
                  sx={{
                    color: 'rgba(255,255,255,0.5)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {character.description?.includes('Place') 
                    ? 'Place' 
                    : character.description?.includes('App')
                      ? 'Software & Apps'
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
                    color: 'rgba(255,255,255,0.8)',
                    flexShrink: 0,
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );

          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: { xs: '100%', md: '100%%' } }}>
              {sections.map((section) => (
                <Box key={section.key}>
                  <Typography
                    sx={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mb: 1.5,
                    }}
                  >
                    {section.label}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {section.items.map(renderCharacterItem)}
                  </Box>
                </Box>
              ))}
            </Box>
          );
        })()
      )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !isDeleting && setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
              minWidth: 340,
              bgcolor: '#141418',
              border: '1px solid rgba(255,255,255,0.1)',
            }
          }}
        >
          <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: 'rgba(255,59,48,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DeleteIcon sx={{ fontSize: 24, color: '#FF3B30' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
              Delete AI Asset?
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Are you sure you want to delete "<strong style={{ color: '#fff' }}>{characterToDelete?.characterName}</strong>"? This action cannot be undone.
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
    </Box>
  );
};

export default CharactersPage;

