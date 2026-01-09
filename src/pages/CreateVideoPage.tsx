import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { setTokensRemaining } from '../store/authSlice';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MovieIcon from '@mui/icons-material/Movie';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PaletteIcon from '@mui/icons-material/Palette';
import ImageIcon from '@mui/icons-material/Image';
import AnimationIcon from '@mui/icons-material/Animation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TvIcon from '@mui/icons-material/Tv';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import PersonIcon from '@mui/icons-material/Person';
import { RootState } from '../store/store';
import { videosApi, charactersApi } from '../services/api';

// Character type matching the API response
interface Character {
  characterId: string;
  characterName: string;
  characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App';
  description?: string;
  imageUrls?: string[];
}

// Art styles for music videos - matching HomePage styles
const artStyles = [
  { id: '3d-cartoon', label: '3D Cartoon', image: '/art_styles/boy_cartoon.jpeg' },
  { id: 'claymation', label: 'Claymation', image: '/art_styles/boy_claymation.jpeg' },
  { id: 'childrens-storybook', label: "Children's Book", image: '/art_styles/boy_storybook.jpeg' },
  { id: 'photo-realism', label: 'Realistic', image: '/art_styles/boy_real.jpeg' },
  { id: 'comic-book', label: 'Comic Book', image: '/art_styles/boy_comic.jpeg' },
  { id: 'classic-blocks', label: 'Classic Blocks', image: '/art_styles/boy_lego.jpeg' },
  { id: 'anime', label: 'Animation', image: '/art_styles/boy_anime.jpeg' },
  { id: 'spray-paint', label: 'Spray Paint', image: '/art_styles/boy_spray_paint.jpeg' },
  { id: 'playground-crayon', label: 'Crayon', image: '/art_styles/boy_crayon.jpeg' },
  { id: 'wool-knit', label: 'Cozy Woolknit', image: '/art_styles/boy_woolknit.jpeg' },
  { id: 'watercolor', label: 'Watercolor', image: '/art_styles/boy_watercolor.jpeg' },
  { id: 'pixel', label: '2D Game', image: '/art_styles/boy_pixel.jpeg' },
  { id: 'sugarpop', label: 'Sugarpop', image: '/art_styles/boy_sugerpop.jpeg' },
  { id: 'origami', label: 'Origami', image: '/art_styles/boy_origami.jpeg' },
  { id: 'sketch', label: 'B&W Sketch', image: '/art_styles/boy_sketch.jpeg' },
];

// Video type options - Credit costs:
// Token costs:
// Song = 20 tokens
// Still image video = 40 tokens
// Still image video = 100 tokens
// Cinematic video = 1000 tokens
const videoTypes = [
  { id: 'still', label: 'Still Image', credits: 40, description: 'Static images synced to music', icon: ImageIcon },
  { id: 'standard', label: 'Cinematic', credits: 1000, description: 'AI-powered cinematic video', icon: AnimationIcon },
];

// Aspect ratio options
const aspectRatios = [
  { id: 'portrait', label: 'Portrait', Icon: SmartphoneIcon, ratio: '9:16', description: 'Best for mobile & social' },
  { id: 'landscape', label: 'Landscape', Icon: TvIcon, ratio: '16:9', description: 'Best for TV & YouTube' },
];

// Helper to get character type image
const getCharacterTypeImage = (characterType?: string) => {
  switch (characterType) {
    case 'Product': return '/characters/product.jpeg';
    case 'Place': return '/characters/house.jpeg';
    case 'App': return '/gruvi/app.jpeg';
    case 'Non-Human': return '/characters/dog.jpeg';
    default: return '/characters/human.jpeg';
  }
};

// Scrollable list wrapper with dynamic fade gradients
interface ScrollableListProps {
  children: React.ReactNode;
  maxHeight?: string;
}

const ScrollableListWrapper: React.FC<ScrollableListProps> = ({ children, maxHeight = '50vh' }) => {
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
    <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showTopGradient ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />
      <List
        ref={listRef}
        sx={{ px: 1, py: 1, maxHeight, overflowY: 'auto' }}
      >
        {children}
      </List>
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showBottomGradient ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />
    </Box>
  );
};

const CreateVideoPage: React.FC = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [selectedStyle, setSelectedStyle] = useState<string>('3d-cartoon');
  const [videoType, setVideoType] = useState<string>('still');
  const [aspectRatio, setAspectRatio] = useState<string>('portrait');
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPromptError, setShowPromptError] = useState(false);

  // Character selection state
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Picker drawer states
  const [stylePickerOpen, setStylePickerOpen] = useState(false);
  const [castPickerOpen, setCastPickerOpen] = useState(false);

  // Max cast members allowed
  const MAX_CAST_MEMBERS = 5;

  // Group characters by type
  const groupedCharacters = characters.reduce((acc, char) => {
    const type = char.characterType || 'Human';
    if (!acc[type]) acc[type] = [];
    acc[type].push(char);
    return acc;
  }, {} as Record<string, Character[]>);

  // Order of character types for display
  const characterTypeOrder = ['Human', 'Non-Human', 'Product', 'Place', 'App'];

  // Fetch user's characters on mount
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!user?.userId) return;
      
      setIsLoadingCharacters(true);
      try {
        const response = await charactersApi.getUserCharacters(user.userId);
        setCharacters(response.data?.characters || []);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setIsLoadingCharacters(false);
      }
    };
    
    fetchCharacters();
  }, [user?.userId]);
  
  // Toggle character selection
  const handleCharacterToggle = (characterId: string) => {
    const character = characters.find(c => c.characterId === characterId);
    const isCurrentlySelected = selectedCharacterIds.includes(characterId);

    setSelectedCharacterIds(prev =>
      isCurrentlySelected
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );

    // Also update the prompt with @CharacterName
    if (character) {
      const mentionText = `@${character.characterName}`;
      if (isCurrentlySelected) {
        // Remove from prompt
        setVideoPrompt(prev => prev.replace(mentionText, '').replace(/\s+/g, ' ').trim());
      } else {
        // Add to prompt if not already there
        setVideoPrompt(prev => {
          if (prev.includes(mentionText)) return prev;
          return prev ? `${prev} ${mentionText}` : mentionText;
        });
      }
    }
  };

  // Get credits for selected video type
  const getCredits = () => {
    return videoTypes.find(t => t.id === videoType)?.credits || 0;
  };

  const handleGenerate = async () => {
    if (!songId || !videoPrompt.trim()) {
      setShowPromptError(true);
      setNotification({
        open: true,
        message: 'Please describe your music video concept',
        severity: 'error'
      });
      return;
    }
    
    if (!user?.userId) {
      setNotification({
        open: true,
        message: 'Please sign in to create videos',
        severity: 'error'
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await videosApi.generateVideo({
        userId: user.userId,
        songId,
        videoType: videoType as 'still' | 'standard' | 'professional',
        style: selectedStyle,
        videoPrompt: videoPrompt.trim(),
        aspectRatio: aspectRatio as 'portrait' | 'landscape',
        characterIds: selectedCharacterIds,
      });
      
      // Update tokens in UI with actual value from backend
      if (response.data.tokensRemaining !== undefined) {
        dispatch(setTokensRemaining(response.data.tokensRemaining));
      }
      
      setNotification({
        open: true,
        message: 'Music video generation started! It will appear in your library when ready.',
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate('/my-videos');
      }, 2000);
    } catch (error: any) {
      console.error('Video generation error:', error);
      setNotification({
        open: true,
        message: error.response?.data?.error || 'Failed to generate video. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 },width: '100%', minWidth: 0, display: "flex", flexDirection: "column", mx: 'auto' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        mb: 4,
        gap: 2,
        flexWrap: 'wrap',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src="/gruvi/gruvi-create-video.png"
            alt="Create Video"
            sx={{
              height: 64,
              width: 'auto',
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
              Create Music Video
            </Typography>
            <Typography sx={{ color: '#86868B' }}>
              Transform your song into a stunning video
            </Typography>
          </Box>
        </Box>

        {/* View My Videos button */}
        <Button
          variant="contained"
          onClick={() => navigate('/my-videos')}
          sx={{
            background: '#007AFF',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 2.5,
            py: 1,
            boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
            whiteSpace: 'nowrap',
            '&:hover': {
              background: '#0066CC',
              boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
            },
          }}
        >
          View My Videos
        </Button>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs:'column', sm: 'column', md: "column", lg: "row"  }, gap: 3, width: '100%', minWidth: 0 }}>
        {/* Left Column - Settings */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Video Description - FIRST (mandatory) */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AutoAwesomeIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Video Description
              </Typography>
              <Chip 
                label="Required" 
                size="small" 
                sx={{ 
                  ml: 1, 
                  background: 'rgba(255,59,48,0.1)', 
                  color: '#FF3B30',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }} 
              />
            </Box>
            
            {/* Cast Selection - Dropdown + Create Button */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#86868B', fontSize: '0.8rem', mb: 1 }}>
                Add characters to your video (max {MAX_CAST_MEMBERS}):
              </Typography>

              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {/* Dropdown button */}
                <Button
                  onClick={() => setCastPickerOpen(true)}
                  disabled={isLoadingCharacters}
                  sx={{
                    flex: 1,
                    justifyContent: 'space-between',
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    py: 1.5,
                    px: 2,
                    color: '#1D1D1F',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      background: 'rgba(0,122,255,0.05)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(0,0,0,0.02)',
                      color: '#86868B',
                    },
                  }}
                >
                  {isLoadingCharacters ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <span>Loading...</span>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {selectedCharacterIds.length === 0 ? (
                        <PersonIcon sx={{ fontSize: 20, color: '#86868B' }} />
                      ) : (
                        <Box sx={{ display: 'flex', ml: -0.5 }}>
                          {selectedCharacterIds.slice(0, 3).map((id, idx) => {
                            const char = characters.find(c => c.characterId === id);
                            return (
                              <Avatar
                                key={id}
                                src={char?.imageUrls?.[0] || getCharacterTypeImage(char?.characterType)}
                                sx={{
                                  width: 24,
                                  height: 24,
                                  border: '2px solid #fff',
                                  ml: idx > 0 ? -1 : 0,
                                }}
                              />
                            );
                          })}
                        </Box>
                      )}
                      <span>
                        {selectedCharacterIds.length === 0
                          ? 'Select Cast Members'
                          : `${selectedCharacterIds.length} selected`}
                      </span>
                    </Box>
                  )}
                  <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />
                </Button>

                {/* Create button - dotted outline square */}
                <Button
                  onClick={() => navigate('/my-cast/create')}
                  sx={{
                    minWidth: 48,
                    width: 48,
                    height: 48,
                    p: 0,
                    border: '2px dashed rgba(0,122,255,0.4)',
                    borderRadius: '12px',
                    color: '#007AFF',
                    '&:hover': {
                      background: 'rgba(0,122,255,0.05)',
                      border: '2px dashed #007AFF',
                    },
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>

              {/* Selected cast preview */}
              {selectedCharacterIds.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                  {selectedCharacterIds.map((id) => {
                    const char = characters.find(c => c.characterId === id);
                    if (!char) return null;
                    return (
                      <Chip
                        key={id}
                        avatar={char.imageUrls?.[0] ? <Avatar src={char.imageUrls[0]} /> : undefined}
                        label={char.characterName}
                        onDelete={() => handleCharacterToggle(id)}
                        size="small"
                        sx={{
                          background: 'rgba(0,122,255,0.1)',
                          color: '#007AFF',
                          '& .MuiChip-deleteIcon': {
                            color: '#007AFF',
                            '&:hover': { color: '#0056CC' },
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Describe the scenes, setting, and story for your music video... Selected characters above will automatically appear in your video."
              value={videoPrompt}
              onChange={(e) => {
                setVideoPrompt(e.target.value);
                if (e.target.value.trim()) setShowPromptError(false);
              }}
              required
              error={showPromptError && !videoPrompt.trim()}
              helperText={showPromptError && !videoPrompt.trim() ? 'Please describe your music video' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  background: '#fff',
                  '& fieldset': {
                    borderColor: (showPromptError && !videoPrompt.trim()) ? 'rgba(255,59,48,0.5)' : 'rgba(0,0,0,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: (showPromptError && !videoPrompt.trim()) ? 'rgba(255,59,48,0.7)' : 'rgba(0,122,255,0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: (showPromptError && !videoPrompt.trim()) ? '#FF3B30' : '#007AFF',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                },
              }}
            />
          </Paper>

          {/* Visual Style Selection */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PaletteIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Visual Style
              </Typography>
            </Box>

            <Button
              onClick={() => setStylePickerOpen(true)}
              fullWidth
              sx={{
                justifyContent: 'space-between',
                textTransform: 'none',
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: '#fff',
                color: '#1D1D1F',
                fontWeight: 500,
                '&:hover': { background: 'rgba(0,122,255,0.05)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  component="img"
                  src={artStyles.find(s => s.id === selectedStyle)?.image}
                  alt={artStyles.find(s => s.id === selectedStyle)?.label}
                  sx={{ width: 28, height: 28, borderRadius: '6px', objectFit: 'cover' }}
                />
                <span>{artStyles.find(s => s.id === selectedStyle)?.label}</span>
              </Box>
              <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />
            </Button>
          </Paper>

          {/* Video Type Selection - Toggle Style */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MovieIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Video Type
              </Typography>
            </Box>

            <ToggleButtonGroup
              value={videoType}
              exclusive
              onChange={(_event, newValue) => {
                if (newValue !== null) setVideoType(newValue);
              }}
              fullWidth
              sx={{
                gap: 1,
                '& .MuiToggleButtonGroup-grouped': {
                  border: 'none !important',
                  borderRadius: '12px !important',
                  m: 0,
                },
              }}
            >
              {videoTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <ToggleButton
                    key={type.id}
                    value={type.id}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      px: 1.5,
                      flexDirection: 'column',
                      gap: 0.5,
                      textTransform: 'none',
                      background: videoType === type.id
                        ? 'rgba(0,122,255,0.1)'
                        : 'rgba(0,0,0,0.03)',
                      color: videoType === type.id ? '#007AFF' : '#1D1D1F',
                      border: videoType === type.id
                        ? '2px solid #007AFF'
                        : '2px solid rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: videoType === type.id
                          ? 'rgba(0,122,255,0.15)'
                          : 'rgba(0,0,0,0.06)',
                      },
                      '&.Mui-selected': {
                        background: 'rgba(0,122,255,0.1)',
                        color: '#007AFF',
                        '&:hover': {
                          background: 'rgba(0,122,255,0.15)',
                        },
                      },
                    }}
                  >
                    <IconComponent sx={{ fontSize: 24 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {type.label}
                    </Typography>
                    <Chip
                      label={`${type.credits} credits`}
                      size="small"
                      sx={{
                        mt: 0.5,
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 20,
                        background: videoType === type.id
                          ? 'rgba(0,122,255,0.15)'
                          : 'rgba(0,0,0,0.06)',
                        color: videoType === type.id ? '#007AFF' : '#86868B',
                      }}
                    />
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </Paper>

          {/* Aspect Ratio Selection */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AspectRatioIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Aspect Ratio
              </Typography>
            </Box>

            <ToggleButtonGroup
              value={aspectRatio}
              exclusive
              onChange={(_event, newValue) => {
                if (newValue !== null) setAspectRatio(newValue);
              }}
              fullWidth
              sx={{
                gap: 1.5,
                '& .MuiToggleButtonGroup-grouped': {
                  border: 'none !important',
                  borderRadius: '16px !important',
                  m: 0,
                },
              }}
            >
              {aspectRatios.map((ar) => {
                const IconComponent = ar.Icon;
                return (
                  <ToggleButton
                    key={ar.id}
                    value={ar.id}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      px: 1.5,
                      flexDirection: 'column',
                      gap: 0.5,
                      textTransform: 'none',
                      background: aspectRatio === ar.id
                        ? 'rgba(0,122,255,0.1)'
                        : 'rgba(0,0,0,0.03)',
                      color: aspectRatio === ar.id ? '#007AFF' : '#1D1D1F',
                      border: aspectRatio === ar.id
                        ? '2px solid #007AFF'
                        : '2px solid rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: aspectRatio === ar.id
                          ? 'rgba(0,122,255,0.15)'
                          : 'rgba(0,0,0,0.06)',
                      },
                      '&.Mui-selected': {
                        background: 'rgba(0,122,255,0.1)',
                        color: '#007AFF',
                        '&:hover': {
                          background: 'rgba(0,122,255,0.15)',
                        },
                      },
                    }}
                  >
                    <IconComponent sx={{ fontSize: 24 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {ar.label}
                    </Typography>
                    <Chip
                      label={ar.ratio}
                      size="small"
                      sx={{
                        mt: 0.5,
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 20,
                        background: aspectRatio === ar.id
                          ? 'rgba(0,122,255,0.15)'
                          : 'rgba(0,0,0,0.06)',
                        color: aspectRatio === ar.id ? '#007AFF' : '#86868B',
                      }}
                    />
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </Paper>

        </Box>

        {/* Right Column - Summary & Generate */}
        <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: 100,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
              Summary
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Style</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  <Box
                    component="img"
                    src={artStyles.find(s => s.id === selectedStyle)?.image}
                    alt={artStyles.find(s => s.id === selectedStyle)?.label}
                    sx={{ width: 22, height: 22, borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {artStyles.find(s => s.id === selectedStyle)?.label}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Type</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  {(() => {
                    const typeInfo = videoTypes.find(t => t.id === videoType);
                    const TypeIcon = typeInfo?.icon;
                    return (
                      <>
                        {TypeIcon && <TypeIcon sx={{ fontSize: 18, color: '#007AFF' }} />}
                        <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                          {typeInfo?.label}
                        </Typography>
                      </>
                    );
                  })()}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Aspect Ratio</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  {(() => {
                    const arInfo = aspectRatios.find(ar => ar.id === aspectRatio);
                    const ArIcon = arInfo?.Icon;
                    return (
                      <>
                        {ArIcon && <ArIcon sx={{ fontSize: 18, color: aspectRatio === 'portrait' ? '#FF9500' : '#34C759' }} />}
                        <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                          {arInfo?.label} ({arInfo?.ratio})
                        </Typography>
                      </>
                    );
                  })()}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(88,86,214,0.1) 100%)',
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>Total Tokens</Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {getCredits()}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerate}
              disabled={isGenerating || !videoPrompt.trim()}
              sx={{
                py: 2,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                boxShadow: '0 8px 24px rgba(0,122,255,0.3)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(0,122,255,0.4)',
                },
              }}
            >
              {isGenerating ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                <>
                  <MovieIcon sx={{ mr: 1 }} />
                  Generate Music Video
                </>
              )}
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center', mt: 2 }}
            >
              Generation typically takes 5-10 minutes
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Visual Style Picker Drawer */}
      <Drawer
        anchor="bottom"
        open={stylePickerOpen}
        onClose={() => setStylePickerOpen(false)}
        sx={{ zIndex: 1400 }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            maxHeight: '70vh',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
            Select Visual Style
          </Typography>
        </Box>
        <ScrollableListWrapper>
          {artStyles.map((style) => (
            <ListItem key={style.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  setSelectedStyle(style.id);
                  setStylePickerOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  mb: 0.5,
                  py: 1.5,
                  background: selectedStyle === style.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                  border: selectedStyle === style.id ? '2px solid #007AFF' : '2px solid transparent',
                }}
              >
                <Box
                  component="img"
                  src={style.image}
                  alt={style.label}
                  sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', mr: 2 }}
                />
                <ListItemText primary={style.label} primaryTypographyProps={{ fontWeight: 600 }} />
                {selectedStyle === style.id && <CheckIcon sx={{ color: '#007AFF' }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </ScrollableListWrapper>
        <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setStylePickerOpen(false)}
            sx={{
              color: '#86868B',
              borderColor: 'rgba(0,0,0,0.15)',
              borderRadius: '12px',
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: 'rgba(0,0,0,0.3)',
                backgroundColor: 'rgba(0,0,0,0.02)',
              }
            }}
          >
            Cancel
          </Button>
        </Box>
      </Drawer>

      {/* Cast Picker Drawer */}
      <Drawer
        anchor="bottom"
        open={castPickerOpen}
        onClose={() => setCastPickerOpen(false)}
        sx={{ zIndex: 1400 }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            maxHeight: '70vh',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
              Select Cast Members
            </Typography>
            <Typography variant="caption" sx={{ color: '#86868B' }}>
              {selectedCharacterIds.length}/{MAX_CAST_MEMBERS} selected
            </Typography>
          </Box>
        </Box>
        <ScrollableListWrapper maxHeight="55vh">
          {characters.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
                No cast members yet. Create your first character!
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setCastPickerOpen(false);
                  navigate('/my-cast/create');
                }}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  borderColor: '#007AFF',
                  color: '#007AFF',
                }}
              >
                <AddIcon sx={{ mr: 1 }} />
                Create Character
              </Button>
            </Box>
          ) : (
            characterTypeOrder.map((type) => {
              const typeCharacters = groupedCharacters[type];
              if (!typeCharacters || typeCharacters.length === 0) return null;
              return (
                <Box key={type}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      px: 2,
                      py: 1,
                      color: '#86868B',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {type === 'Non-Human' ? 'Non-Humans' : type === 'Place' ? 'Places / Businesses' : type + 's'}
                  </Typography>
                  {typeCharacters.map((char) => {
                    const isSelected = selectedCharacterIds.includes(char.characterId);
                    const isDisabled = !isSelected && selectedCharacterIds.length >= MAX_CAST_MEMBERS;
                    return (
                      <ListItem key={char.characterId} disablePadding>
                        <ListItemButton
                          onClick={() => {
                            if (!isDisabled || isSelected) {
                              handleCharacterToggle(char.characterId);
                            }
                          }}
                          disabled={isDisabled}
                          sx={{
                            borderRadius: '12px',
                            mx: 1,
                            mb: 0.5,
                            py: 1.5,
                            background: isSelected ? 'rgba(0,122,255,0.1)' : 'transparent',
                            border: isSelected ? '2px solid #007AFF' : '2px solid transparent',
                            opacity: isDisabled ? 0.5 : 1,
                          }}
                        >
                          <Avatar
                            src={char.imageUrls?.[0] || getCharacterTypeImage(char.characterType)}
                            sx={{ width: 40, height: 40, borderRadius: '8px', mr: 2 }}
                          />
                          <ListItemText
                            primary={char.characterName}
                            secondary={char.description?.slice(0, 50) || type}
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
                          />
                          {isSelected && <CheckIcon sx={{ color: '#007AFF' }} />}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </Box>
              );
            })
          )}
        </ScrollableListWrapper>
        <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setCastPickerOpen(false)}
            sx={{
              color: '#86868B',
              borderColor: 'rgba(0,0,0,0.15)',
              borderRadius: '12px',
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: 'rgba(0,0,0,0.3)',
                backgroundColor: 'rgba(0,0,0,0.02)',
              }
            }}
          >
            Cancel
          </Button>
        </Box>
      </Drawer>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateVideoPage;

