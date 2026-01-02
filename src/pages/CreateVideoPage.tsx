import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  Avatar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PaletteIcon from '@mui/icons-material/Palette';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import ImageIcon from '@mui/icons-material/Image';
import AnimationIcon from '@mui/icons-material/Animation';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
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
  { id: 'portrait', label: 'Portrait', icon: '📱', ratio: '9:16', description: 'Best for mobile & social' },
  { id: 'landscape', label: 'Landscape', icon: '🖥️', ratio: '16:9', description: 'Best for TV & YouTube' },
];

// Genres/Moods for music video
const genres = [
  { id: 'pop', label: 'Pop', emoji: '🎵' },
  { id: 'rock', label: 'Rock', emoji: '🎸' },
  { id: 'hip-hop', label: 'Hip Hop', emoji: '🎤' },
  { id: 'rnb', label: 'R&B', emoji: '💜' },
  { id: 'electronic', label: 'Electronic', emoji: '🎧' },
  { id: 'jazz', label: 'Jazz', emoji: '🎷' },
  { id: 'classical', label: 'Classical', emoji: '🎻' },
  { id: 'country', label: 'Country', emoji: '🤠' },
  { id: 'folk', label: 'Folk', emoji: '🪕' },
  { id: 'reggae', label: 'Reggae', emoji: '🌴' },
  { id: 'metal', label: 'Metal', emoji: '🤘' },
  { id: 'indie', label: 'Indie', emoji: '🌟' },
];

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'romantic', label: 'Romantic', emoji: '💕' },
  { id: 'chill', label: 'Chill', emoji: '😌' },
  { id: 'epic', label: 'Epic', emoji: '🔥' },
  { id: 'dreamy', label: 'Dreamy', emoji: '✨' },
  { id: 'dark', label: 'Dark', emoji: '🌙' },
  { id: 'uplifting', label: 'Uplifting', emoji: '🌈' },
  { id: 'nostalgic', label: 'Nostalgic', emoji: '📻' },
  { id: 'promotional', label: 'Promotional', emoji: '📣' },
];

// Helper to get character type icon
const getCharacterTypeIcon = (characterType?: string) => {
  switch (characterType) {
    case 'Product': return <ShoppingBagIcon sx={{ fontSize: 16 }} />;
    case 'Place': return <HomeIcon sx={{ fontSize: 16 }} />;
    case 'App': return <PhoneIphoneIcon sx={{ fontSize: 16 }} />;
    case 'Non-Human': return '🐕';
    default: return <PersonIcon sx={{ fontSize: 16 }} />;
  }
};

const CreateVideoPage: React.FC = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [selectedStyle, setSelectedStyle] = useState<string>('3d-cartoon');
  const [videoType, setVideoType] = useState<string>('still');
  const [aspectRatio, setAspectRatio] = useState<string>('portrait');
  const [selectedGenre, setSelectedGenre] = useState<string>('pop');
  const [selectedMood, setSelectedMood] = useState<string>('happy');
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
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
    setSelectedCharacterIds(prev => 
      prev.includes(characterId)
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  // Get credits for selected video type
  const getCredits = () => {
    return videoTypes.find(t => t.id === videoType)?.credits || 0;
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleVideoTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: string | null
  ) => {
    if (newType !== null) {
      setVideoType(newType);
    }
  };

  const handleGenreChange = (genreId: string) => {
    setSelectedGenre(genreId);
  };

  const handleMoodChange = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVideoPrompt(event.target.value);
  };


  const handleGenerate = async () => {
    if (!songId || !videoPrompt.trim()) {
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
      await videosApi.generateVideo({
        userId: user.userId,
        songId,
        videoType: videoType as 'still' | 'standard' | 'professional',
        style: selectedStyle,
        videoPrompt: videoPrompt.trim(),
        aspectRatio: aspectRatio as 'portrait' | 'landscape',
        characterIds: selectedCharacterIds,
      });
      
      setNotification({
        open: true,
        message: 'Music video generation started! It will appear in your library when ready.',
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate('/my-library?tab=videos');
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
    <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(0,122,255,0.2)',
            color: '#007AFF',
            '&:hover': { 
              background: 'rgba(0,122,255,0.1)',
              border: '1px solid rgba(0,122,255,0.3)',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 700,
              color: '#1D1D1F'
            }}
          >
            Create Music Video
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Song ID: {songId}
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Left Column - Settings */}
        <Box sx={{ flex: 1 }}>
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
            
            {/* Character Selection */}
            {isLoadingCharacters ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">Loading your characters...</Typography>
              </Box>
            ) : characters.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#1D1D1F', 
                    fontWeight: 600,
                    display: 'block', 
                    mb: 1.5,
                  }}
                >
                  🎭 Select Characters, Products, Places, or Apps for your video:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {characters.map((char) => {
                    const isSelected = selectedCharacterIds.includes(char.characterId);
                    const hasImage = char.imageUrls && char.imageUrls.length > 0;
                    return (
                      <Box
                        key={char.characterId}
                        onClick={() => handleCharacterToggle(char.characterId)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          pr: 1.5,
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #007AFF' : '1px solid rgba(0,0,0,0.1)',
                          background: isSelected ? 'rgba(0,122,255,0.08)' : 'rgba(255,255,255,0.9)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#007AFF',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,122,255,0.15)',
                          },
                        }}
                      >
                        {/* Checkbox or Avatar */}
                        {hasImage ? (
                          <Box sx={{ position: 'relative' }}>
                            <Avatar 
                              src={char.imageUrls![0]} 
                              alt={char.characterName}
                              sx={{ width: 40, height: 40, borderRadius: '8px' }}
                            />
                            {isSelected && (
                              <CheckCircleIcon 
                                sx={{ 
                                  position: 'absolute', 
                                  bottom: -4, 
                                  right: -4, 
                                  fontSize: 18, 
                                  color: '#007AFF',
                                  background: 'white',
                                  borderRadius: '50%'
                                }} 
                              />
                            )}
                          </Box>
                        ) : (
                          <Checkbox 
                            checked={isSelected} 
                            size="small"
                            sx={{ p: 0, color: '#007AFF' }}
                          />
                        )}
                        
                        {/* Name and Type */}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1D1D1F', lineHeight: 1.2 }}>
                            {char.characterName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {getCharacterTypeIcon(char.characterType)}
                            <Typography variant="caption" sx={{ color: '#86868B', fontSize: '0.7rem' }}>
                              {char.characterType || 'Character'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                {selectedCharacterIds.length > 0 && (
                  <Typography variant="caption" sx={{ color: '#007AFF', mt: 1, display: 'block' }}>
                    ✓ {selectedCharacterIds.length} selected - these will appear in your video
                  </Typography>
                )}
              </Box>
            ) : (
              <Box sx={{ mb: 2, p: 2, background: 'rgba(0,122,255,0.05)', borderRadius: '12px', border: '1px dashed rgba(0,122,255,0.3)' }}>
                <Typography variant="body2" sx={{ color: '#86868B' }}>
                  💡 <strong>No characters yet?</strong> Create characters, products, places, or apps to feature them in your videos!
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/characters/new')}
                  sx={{ mt: 1, textTransform: 'none', color: '#007AFF' }}
                >
                  + Create Your First Character
                </Button>
              </Box>
            )}
            
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Describe the scenes, setting, and story for your music video... Selected characters above will automatically appear in your video."
              value={videoPrompt}
              onChange={handlePromptChange}
              required
              error={!videoPrompt.trim()}
              helperText={!videoPrompt.trim() ? 'Please describe your music video' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  background: '#fff',
                  '& fieldset': {
                    borderColor: !videoPrompt.trim() ? 'rgba(255,59,48,0.5)' : 'rgba(0,0,0,0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: !videoPrompt.trim() ? 'rgba(255,59,48,0.7)' : 'rgba(0,122,255,0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: !videoPrompt.trim() ? '#FF3B30' : '#007AFF',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                },
              }}
            />
            
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                mt: 1.5, 
                color: '#86868B',
                ml: 0.5
              }}
            >
              Example: "A summer adventure with @Luna and @Max exploring a magical forest, dancing under twinkling lights"
            </Typography>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <PaletteIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Visual Style
              </Typography>
            </Box>
            
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', 
                gap: 1.5 
              }}
            >
              {artStyles.map((style) => (
                <Box
                  key={style.id}
                  onClick={() => handleStyleChange(style.id)}
                  sx={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedStyle === style.id 
                      ? '3px solid #007AFF' 
                      : '2px solid rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    boxShadow: selectedStyle === style.id 
                      ? '0 4px 16px rgba(0,122,255,0.25)'
                      : '0 2px 8px rgba(0,0,0,0.06)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={style.image}
                    alt={style.label}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      p: 0.75,
                      pt: 2,
                    }}
                  >
                    <Typography 
                      sx={{ 
                        color: '#fff', 
                        fontSize: '0.65rem', 
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      {style.label}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Video Type Toggle */}
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
              <MovieIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Video Type
              </Typography>
            </Box>
            
            <ToggleButtonGroup
              value={videoType}
              exclusive
              onChange={handleVideoTypeChange}
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
              {videoTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <ToggleButton
                    key={type.id}
                    value={type.id}
                    sx={{
                      flex: 1,
                      py: 2,
                      px: 2,
                      flexDirection: 'column',
                      gap: 1,
                      textTransform: 'none',
                      background: videoType === type.id 
                        ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)' 
                        : 'rgba(0,0,0,0.03)',
                      color: videoType === type.id ? '#fff' : '#1D1D1F',
                      border: videoType === type.id 
                        ? '2px solid transparent' 
                        : '2px solid rgba(0,0,0,0.08)',
                      boxShadow: videoType === type.id 
                        ? '0 4px 16px rgba(0,122,255,0.3)' 
                        : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: videoType === type.id 
                          ? 'linear-gradient(135deg, #0056CC 0%, #4240B0 100%)' 
                          : 'rgba(0,0,0,0.06)',
                      },
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0056CC 0%, #4240B0 100%)',
                        },
                      },
                    }}
                  >
                    <IconComponent sx={{ fontSize: 28 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {type.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                      {type.description}
                    </Typography>
                    <Chip 
                      label={`${type.credits} credits`}
                      size="small"
                      sx={{
                        mt: 0.5,
                        fontWeight: 700,
                        background: videoType === type.id 
                          ? 'rgba(255,255,255,0.2)' 
                          : 'rgba(0,122,255,0.1)',
                        color: videoType === type.id ? '#fff' : '#007AFF',
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
              <Typography sx={{ fontSize: '1.2rem' }}>📐</Typography>
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
              {aspectRatios.map((ar) => (
                <ToggleButton
                  key={ar.id}
                  value={ar.id}
                  sx={{
                    flex: 1,
                    py: 2,
                    px: 2,
                    flexDirection: 'column',
                    gap: 0.5,
                    textTransform: 'none',
                    background: aspectRatio === ar.id 
                      ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)' 
                      : 'rgba(0,0,0,0.03)',
                    color: aspectRatio === ar.id ? '#fff' : '#1D1D1F',
                    border: aspectRatio === ar.id 
                      ? '2px solid transparent' 
                      : '2px solid rgba(0,0,0,0.08)',
                    boxShadow: aspectRatio === ar.id 
                      ? '0 4px 16px rgba(0,122,255,0.3)' 
                      : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: aspectRatio === ar.id 
                        ? 'linear-gradient(135deg, #0056CC 0%, #4240B0 100%)' 
                        : 'rgba(0,0,0,0.06)',
                    },
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                      color: '#fff',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0056CC 0%, #4240B0 100%)',
                      },
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '1.5rem' }}>{ar.icon}</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {ar.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    {ar.ratio}
                  </Typography>
                  <Typography sx={{ fontSize: '0.7rem', opacity: 0.7, mt: 0.5 }}>
                    {ar.description}
                  </Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Paper>

          {/* Genre Selection */}
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
              <MusicNoteIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Genre
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={`${genre.emoji} ${genre.label}`}
                  onClick={() => handleGenreChange(genre.id)}
                  sx={{
                    px: 1,
                    py: 2.5,
                    fontSize: '0.85rem',
                    fontWeight: selectedGenre === genre.id ? 600 : 500,
                    borderRadius: '100px',
                    background: selectedGenre === genre.id 
                      ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)' 
                      : 'rgba(0,0,0,0.03)',
                    color: selectedGenre === genre.id ? '#fff' : '#1D1D1F',
                    border: selectedGenre === genre.id 
                      ? 'none' 
                      : '1px solid rgba(0,0,0,0.08)',
                    boxShadow: selectedGenre === genre.id 
                      ? '0 4px 12px rgba(0,122,255,0.25)' 
                      : 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      background: selectedGenre === genre.id 
                        ? 'linear-gradient(135deg, #0056CC 0%, #4240B0 100%)' 
                        : 'rgba(0,0,0,0.06)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Mood Selection */}
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
              <TheaterComedyIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Mood
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {moods.map((mood) => (
                <Chip
                  key={mood.id}
                  label={`${mood.emoji} ${mood.label}`}
                  onClick={() => handleMoodChange(mood.id)}
                  sx={{
                    px: 1,
                    py: 2.5,
                    fontSize: '0.85rem',
                    fontWeight: selectedMood === mood.id ? 600 : 500,
                    borderRadius: '100px',
                    background: selectedMood === mood.id 
                      ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)' 
                      : 'rgba(0,0,0,0.03)',
                    color: selectedMood === mood.id ? '#fff' : '#1D1D1F',
                    border: selectedMood === mood.id 
                      ? 'none' 
                      : '1px solid rgba(0,0,0,0.08)',
                    boxShadow: selectedMood === mood.id 
                      ? '0 4px 12px rgba(0,122,255,0.25)' 
                      : 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      background: selectedMood === mood.id 
                        ? 'linear-gradient(135deg, #0056CC 0%, #4240B0 100%)' 
                        : 'rgba(0,0,0,0.06)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>

        </Box>

        {/* Right Column - Summary & Generate */}
        <Box sx={{ width: { xs: '100%', md: 320 } }}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Style</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                  {artStyles.find(s => s.id === selectedStyle)?.label}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Type</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                  {videoTypes.find(t => t.id === videoType)?.label}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Genre</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                  {genres.find(g => g.id === selectedGenre)?.emoji} {genres.find(g => g.id === selectedGenre)?.label}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Mood</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                  {moods.find(m => m.id === selectedMood)?.emoji} {moods.find(m => m.id === selectedMood)?.label}
                </Typography>
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
                <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>Total Credits</Typography>
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
    </Container>
  );
};

export default CreateVideoPage;

