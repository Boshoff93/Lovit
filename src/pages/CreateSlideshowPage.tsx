import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { setTokensRemaining } from '../store/authSlice';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  TextField,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Slider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessIcon from '@mui/icons-material/Business';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { RootState } from '../store/store';
import { useGetUserCharactersQuery, apiSlice } from '../store/apiSlice';
import { slideshowsApi, Character } from '../services/api';
import StyledDropdown, { DropdownOption } from '../components/StyledDropdown';
import GruviCoin from '../components/GruviCoin';

// Art styles (same as CreateVideoPage)
const artStyles: DropdownOption[] = [
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

// Slide count slider marks (increments of 4)
const slideCountMarks = [
  { value: 4, label: '4' },
  { value: 8, label: '8' },
  { value: 12, label: '12' },
  { value: 16, label: '16' },
  { value: 20, label: '20' },
];

// Aspect ratio options (matching CreateVideoPage ToggleButton pattern)
const aspectRatioOptions: { id: '9:16' | '4:5'; label: string; description: string; Icon: React.ElementType }[] = [
  { id: '9:16', label: 'Portrait (9:16)', description: 'Best for TikTok & Reels', Icon: SmartphoneIcon },
  { id: '4:5', label: 'Square (4:5)', description: 'Best for Instagram carousel', Icon: CropSquareIcon },
];

// Character type styling helper
const getCharacterTypeStyle = (characterType?: string) => {
  switch (characterType) {
    case 'Product': return { icon: InventoryIcon, iconBg: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' };
    case 'Place': return { icon: HomeIcon, iconBg: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)' };
    case 'App': return { icon: PhoneIphoneIcon, iconBg: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' };
    case 'Business': return { icon: BusinessIcon, iconBg: 'linear-gradient(135deg, #EAB308 0%, #FACC15 100%)' };
    case 'Non-Human': return { icon: PetsIcon, iconBg: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' };
    default: return { icon: PersonIcon, iconBg: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' };
  }
};

const CharacterAvatar: React.FC<{ character: Character; size?: number }> = ({ character, size = 40 }) => {
  const hasImage = character.imageUrls && character.imageUrls.length > 0 && character.imageUrls[0];
  if (hasImage) {
    return <Avatar src={character.imageUrls![0]} sx={{ width: size, height: size }} />;
  }
  const { icon: IconComponent, iconBg } = getCharacterTypeStyle(character.characterType);
  return (
    <Box sx={{
      width: size, height: size, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: iconBg, boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }}>
      <IconComponent sx={{ fontSize: size * 0.55, color: '#fff' }} />
    </Box>
  );
};

const MAX_CAST_MEMBERS = 5;

const CreateSlideshowPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const allowances = useSelector((state: RootState) => state.auth.allowances);
  const tokens = allowances?.tokens;
  const remainingTokens = ((tokens?.max || 0) + (tokens?.topup || 0)) - (tokens?.used || 0);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hookText, setHookText] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('3d-cartoon');
  const [slideCount, setSlideCount] = useState(8);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '4:5'>('9:16');
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cast picker state
  const [castPickerOpen, setCastPickerOpen] = useState(false);
  const [castPickerAnchor, setCastPickerAnchor] = useState<HTMLElement | null>(null);

  // Fetch characters
  const { data: charactersData, isLoading: isLoadingCharacters } = useGetUserCharactersQuery(
    { userId: user?.userId || '' },
    { skip: !user?.userId }
  );
  const characters = charactersData?.characters || [];
  const selectedCastMembers = characters.filter(c => selectedCharacterIds.includes(c.characterId));

  const tokenCost = (slideCount / 4) * 50;
  const hasEnoughTokens = remainingTokens >= tokenCost;
  const instagramWarning = aspectRatio === '4:5' && slideCount > 8;

  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacterIds(prev =>
      prev.includes(characterId)
        ? prev.filter(id => id !== characterId)
        : prev.length < MAX_CAST_MEMBERS
          ? [...prev, characterId]
          : prev
    );
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!hasEnoughTokens) {
      setError('Not enough tokens');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await slideshowsApi.createSlideshow({
        description: description.trim(),
        slideCount: slideCount as 4 | 8 | 12 | 16 | 20,
        style: selectedStyle,
        aspectRatio,
        characterIds: selectedCharacterIds.length > 0 ? selectedCharacterIds : undefined,
        hook: hookText.trim() || undefined,
        ctaText: ctaText.trim() || undefined,
        title: title.trim() || undefined,
      });

      const { slideshowId, tokenCost: cost } = response.data;

      // Update token count
      if (tokens) {
        dispatch(setTokensRemaining((tokens.used || 0) + cost));
      }

      // Invalidate slideshows list cache
      dispatch(apiSlice.util.invalidateTags([{ type: 'Slideshows', id: 'LIST' }]));

      navigate(`/slideshow/${slideshowId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create slideshow');
    } finally {
      setIsGenerating(false);
    }
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      fontSize: '0.9rem',
      '& .MuiOutlinedInput-input': { py: 1.5, px: 2 },
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderWidth: '1px' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
    },
    '& .MuiInputBase-input': {
      '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
    },
  };

  return (
    <Box sx={{ pt: { xs: 0, md: 2 }, pb: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', minWidth: 0, display: 'flex', flexDirection: 'column', mx: 'auto' }}>
      {/* Header - matching CreateVideoPage */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
              flexShrink: 0,
              animation: 'iconEntrance 0.5s ease-out',
              '@keyframes iconEntrance': {
                '0%': { opacity: 0, transform: 'scale(0.5) rotate(-10deg)' },
                '50%': { transform: 'scale(1.1) rotate(5deg)' },
                '100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
              },
            }}
          >
            <ViewCarouselIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              Create Slideshow
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              Generate AI carousel images for TikTok and Instagram
            </Typography>
          </Box>
        </Box>

        {/* My Slideshows button - Full on large, icon on small */}
        <Button
          variant="contained"
          onClick={() => navigate('/my-slideshows')}
          startIcon={<ViewCarouselIcon />}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            background: '#007AFF',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 2.5,
            py: 1,
            boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            '&:hover': {
              background: '#0066CC',
              boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
            },
          }}
        >
          My Slideshows
        </Button>
        <IconButton
          onClick={() => navigate('/my-slideshows')}
          sx={{
            display: { xs: 'flex', sm: 'none' },
            width: 44,
            height: 44,
            background: '#007AFF',
            color: '#fff',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
            '&:hover': { background: '#0066CC' },
          }}
        >
          <ViewCarouselIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'column', lg: 'row' }, gap: 3, width: '100%', minWidth: 0 }}>
        {/* Left Column - Form */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {/* Title */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Title
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                Give your slideshow a name (optional)
              </Typography>
              <TextField
                fullWidth
                placeholder="Internal reference name for this slideshow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={textFieldSx}
                inputProps={{ maxLength: 100 }}
              />
            </Box>

            {/* Hook & CTA */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Hook & CTA
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                Add hook text for first slide and CTA for last slide (optional)
              </Typography>
              <TextField
                fullWidth
                placeholder="Hook text for first slide (e.g., 'I asked AI to put my kid in a fairy tale')"
                value={hookText}
                onChange={(e) => setHookText(e.target.value)}
                sx={{ ...textFieldSx, mb: 1.5 }}
                inputProps={{ maxLength: 100 }}
              />
              <TextField
                fullWidth
                placeholder="CTA text for last slide (e.g., 'Download our app')"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                sx={textFieldSx}
                inputProps={{ maxLength: 100 }}
              />
            </Box>

            {/* Slideshow Prompt */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AutoAwesomeIcon sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Slideshow Prompt
                </Typography>
                <Chip
                  label="Required"
                  size="small"
                  sx={{
                    ml: 'auto',
                    background: 'rgba(255,59,48,0.1)',
                    color: '#FF3B30',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                Describe the scenes and story for your slideshow
              </Typography>

              {/* AI Assets - inline with prompt like video page */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1 }}>
                  Add AI assets to your slideshow (optional, max {MAX_CAST_MEMBERS}):
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Box
                    onClick={(e) => {
                      if (!isLoadingCharacters) {
                        setCastPickerAnchor(e.currentTarget);
                        setCastPickerOpen(true);
                      }
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                      py: 1.5,
                      px: 2,
                      borderRadius: '12px',
                      border: (castPickerOpen || selectedCastMembers.length > 0) ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                      background: castPickerOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                      cursor: isLoadingCharacters ? 'not-allowed' : 'pointer',
                      opacity: isLoadingCharacters ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      flex: 1,
                      minWidth: 0,
                      '&:hover': {
                        background: isLoadingCharacters ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                        borderColor: isLoadingCharacters ? 'rgba(255,255,255,0.1)' : (castPickerOpen || selectedCastMembers.length > 0) ? '#007AFF' : 'rgba(0,122,255,0.3)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {isLoadingCharacters ? (
                        <>
                          <CircularProgress size={20} sx={{ color: '#fff' }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Loading...</Typography>
                        </>
                      ) : selectedCastMembers.length === 0 ? (
                        <>
                          <FolderSpecialIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }} />
                          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
                            Select AI Assets
                          </Typography>
                        </>
                      ) : (
                        <>
                          <CharacterAvatar character={selectedCastMembers[0]} size={24} />
                          <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff' }}>
                            {selectedCastMembers.length === 1
                              ? selectedCastMembers[0].characterName
                              : `${selectedCastMembers[0].characterName} +${selectedCastMembers.length - 1}`}
                          </Typography>
                        </>
                      )}
                    </Box>
                    <KeyboardArrowDownIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }} />
                  </Box>
                  <Tooltip title="Create new AI asset" arrow>
                    <Button
                      onClick={() => navigate('/ai-assets/create')}
                      sx={{
                        minWidth: 48, width: 48, height: 48, p: 0,
                        border: '2px dashed rgba(0,122,255,0.4)',
                        borderRadius: '12px', color: '#007AFF',
                        '&:hover': { background: 'rgba(0,122,255,0.1)', border: '2px dashed #007AFF' },
                      }}
                    >
                      <AddIcon />
                    </Button>
                  </Tooltip>
                </Box>
                {selectedCastMembers.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                    {selectedCastMembers.map((char) => (
                      <Chip
                        key={char.characterId}
                        label={char.characterName}
                        onDelete={() => handleCharacterToggle(char.characterId)}
                        avatar={<CharacterAvatar character={char} size={24} />}
                        sx={{
                          background: 'rgba(0,122,255,0.1)',
                          border: '1.5px solid #007AFF',
                          fontWeight: 500, pl: 0.5,
                          '& .MuiChip-label': { color: '#fff', pl: 1 },
                          '& .MuiChip-avatar': { ml: 0 },
                          '& .MuiChip-deleteIcon': { color: '#007AFF', '&:hover': { color: '#0056b3' } },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>

              <TextField
                multiline
                rows={4}
                fullWidth
                placeholder="Describe your slideshow concept. Be detailed about the scenes, characters, mood, and story you want to tell..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', borderWidth: '1px' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#007AFF', borderWidth: '2px' },
                  },
                  '& .MuiInputBase-input': {
                    '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                  },
                }}
              />
            </Box>

            {/* Visual Style, Slide Count, Aspect Ratio - Each on own row */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Visual Style */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                  Visual Style
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                  Choose the art style for your slideshow
                </Typography>
                <StyledDropdown
                  options={artStyles}
                  value={selectedStyle}
                  onChange={setSelectedStyle}
                  placeholder="Select style"
                  fullWidth
                />
              </Box>

              {/* Slide Count */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                    Slide Count
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                      {tokenCost} x
                    </Typography>
                    <GruviCoin size={20} />
                  </Box>
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 2 }}>
                  Slide to choose how many slides to generate
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={slideCount}
                    onChange={(_, value) => setSlideCount(value as number)}
                    step={null}
                    marks={slideCountMarks}
                    min={4}
                    max={20}
                    valueLabelDisplay="off"
                    sx={{
                      color: '#007AFF',
                      '& .MuiSlider-markLabel': {
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.5)',
                      },
                      '& .MuiSlider-mark': {
                        backgroundColor: '#007AFF',
                        height: 8,
                        width: 2,
                      },
                      '& .MuiSlider-thumb': {
                        width: 20,
                        height: 20,
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0 0 0 8px rgba(0, 122, 255, 0.16)',
                        },
                      },
                      '& .MuiSlider-rail': {
                        opacity: 0.3,
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Aspect Ratio */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                  Aspect Ratio
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                  Choose the format for your slideshow
                </Typography>
                <ToggleButtonGroup
                  value={aspectRatio}
                  exclusive
                  onChange={(_, value) => value && setAspectRatio(value)}
                  fullWidth
                  sx={{
                    gap: 1.5,
                    '& .MuiToggleButtonGroup-grouped': {
                      border: 'none !important',
                      borderRadius: '12px !important',
                      m: 0,
                    },
                    '& .MuiToggleButton-root': {
                      flex: 1,
                      py: 1.5,
                      borderRadius: '12px !important',
                      border: '2px solid rgba(255,255,255,0.1) !important',
                      background: 'rgba(255,255,255,0.05)',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.08)',
                      },
                      '&.Mui-selected': {
                        background: 'rgba(0,122,255,0.15)',
                        border: '2px solid #007AFF !important',
                        '&:hover': { background: 'rgba(0,122,255,0.2)' },
                      },
                    },
                  }}
                >
                  {aspectRatioOptions.map((ar) => {
                    const ArIcon = ar.Icon;
                    const isSelected = aspectRatio === ar.id;
                    return (
                      <ToggleButton key={ar.id} value={ar.id} sx={{ flexDirection: 'column', gap: 0.5, py: 2 }}>
                        <ArIcon sx={{ fontSize: 28, color: isSelected ? '#007AFF' : 'rgba(255,255,255,0.5)' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                          {ar.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                          {ar.description}
                        </Typography>
                      </ToggleButton>
                    );
                  })}
                </ToggleButtonGroup>
                {instagramWarning && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#FF9500' }}>
                    Instagram limits carousels to 10 images. Consider reducing slide count for Instagram posts.
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Summary & Generate - shown inside Paper on xs/sm/md */}
            <Box sx={{ display: { xs: 'block', lg: 'none' }, mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Summary header */}
              <Typography variant="subtitle2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', mb: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                Summary
              </Typography>

              {/* Compact chip-style summary */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
                {/* Style chip */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '20px',
                  background: 'rgba(0, 122, 255, 0.15)',
                  border: '1px solid rgba(0, 122, 255, 0.3)',
                }}>
                  <Box
                    component="img"
                    src={artStyles.find(s => s.id === selectedStyle)?.image}
                    sx={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                    {artStyles.find(s => s.id === selectedStyle)?.label}
                  </Typography>
                </Box>

                {/* Slide count chip */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '20px',
                  background: 'rgba(88, 86, 214, 0.15)',
                  border: '1px solid rgba(88, 86, 214, 0.3)',
                }}>
                  <ViewCarouselIcon sx={{ fontSize: 16, color: '#5856D6' }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                    {slideCount} Slides
                  </Typography>
                </Box>

                {/* Aspect Ratio chip */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '20px',
                  background: aspectRatio === '9:16' ? 'rgba(255, 149, 0, 0.15)' : 'rgba(52, 199, 89, 0.15)',
                  border: aspectRatio === '9:16' ? '1px solid rgba(255, 149, 0, 0.3)' : '1px solid rgba(52, 199, 89, 0.3)',
                }}>
                  {(() => {
                    const arInfo = aspectRatioOptions.find(ar => ar.id === aspectRatio);
                    const ArIcon = arInfo?.Icon;
                    return (
                      <>
                        {ArIcon && <ArIcon sx={{ fontSize: 16, color: aspectRatio === '9:16' ? '#FF9500' : '#34C759' }} />}
                        <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                          {arInfo?.label}
                        </Typography>
                      </>
                    );
                  })()}
                </Box>

                {/* Token cost chip */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                    {tokenCost}
                  </Typography>
                  <GruviCoin size={16} />
                </Box>
              </Box>

              {/* Generate Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isGenerating || !description.trim() || !hasEnoughTokens}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                    boxShadow: '0 8px 24px rgba(0,122,255,0.3)',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': { boxShadow: '0 12px 32px rgba(0,122,255,0.4)' },
                    '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
                  }}
                >
                  {isGenerating ? (
                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                  ) : (
                    'Create Slideshow'
                  )}
                </Button>
              </Box>

              {!hasEnoughTokens && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#FF3B30', textAlign: 'center' }}>
                  Not enough tokens. You need {tokenCost - remainingTokens} more tokens.
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Right Column - Summary & Generate - only on lg screens */}
        <Box sx={{ width: 320, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              position: 'sticky',
              top: 28,
            }}
          >
            {/* Header row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                Summary
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                  {tokenCost} x
                </Typography>
                <GruviCoin size={20} />
              </Box>
            </Box>

            {/* Summary bullets */}
            <Box sx={{ mb: 3, mt: 3 }}>
              {/* Style row */}
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Style</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  <Box
                    component="img"
                    src={artStyles.find(s => s.id === selectedStyle)?.image}
                    alt={artStyles.find(s => s.id === selectedStyle)?.label}
                    sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                    {artStyles.find(s => s.id === selectedStyle)?.label}
                  </Typography>
                </Box>
              </Box>

              {/* Slide count row */}
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Slides</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  <ViewCarouselIcon sx={{ fontSize: 18, color: '#5856D6' }} />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>
                    {slideCount} Slides
                  </Typography>
                </Box>
              </Box>

              {/* Aspect Ratio row */}
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Aspect Ratio</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  {(() => {
                    const arInfo = aspectRatioOptions.find(ar => ar.id === aspectRatio);
                    const ArIcon = arInfo?.Icon;
                    return (
                      <>
                        {ArIcon && <ArIcon sx={{ fontSize: 18, color: aspectRatio === '9:16' ? '#FF9500' : '#34C759' }} />}
                        <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>
                          {arInfo?.label}
                        </Typography>
                      </>
                    );
                  })()}
                </Box>
              </Box>
            </Box>

            {/* Generate Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={isGenerating || !description.trim() || !hasEnoughTokens}
              sx={{
                py: 2,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                boxShadow: '0 8px 24px rgba(0,122,255,0.3)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': { boxShadow: '0 12px 32px rgba(0,122,255,0.4)' },
                '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)' },
              }}
            >
              {isGenerating ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Create Slideshow'
              )}
            </Button>

            {!hasEnoughTokens && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#FF3B30', textAlign: 'center' }}>
                Not enough tokens. You need {tokenCost - remainingTokens} more tokens.
              </Typography>
            )}

            <Typography
              variant="caption"
              sx={{ textAlign: 'center', mt: 2, display: 'block', color: 'rgba(255,255,255,0.5)' }}
            >
              Generation typically takes 2-5 minutes
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Cast Picker Popover */}
      <Popover
        open={castPickerOpen}
        anchorEl={castPickerAnchor}
        onClose={() => {
          setCastPickerOpen(false);
          setCastPickerAnchor(null);
        }}
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
              minWidth: 280,
              maxWidth: 360,
              maxHeight: 400,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        {/* Header with selection count */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
            Select AI Assets
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
            {selectedCastMembers.length}/{MAX_CAST_MEMBERS}
          </Typography>
        </Box>

        {/* Character list */}
        <List sx={{
          py: 0.5,
          maxHeight: 300,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 0, background: 'transparent' },
          scrollbarWidth: 'none',
        }}>
          {characters.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: 2 }}>
                No AI assets yet
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setCastPickerOpen(false);
                  setCastPickerAnchor(null);
                  navigate('/ai-assets/create');
                }}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  borderColor: '#007AFF',
                  color: '#007AFF',
                }}
              >
                Create AI Asset
              </Button>
            </Box>
          ) : (
            characters.map((character) => {
              const isSelected = selectedCharacterIds.includes(character.characterId);
              const isDisabled = !isSelected && selectedCastMembers.length >= MAX_CAST_MEMBERS;
              return (
                <ListItem key={character.characterId} disablePadding>
                  <ListItemButton
                    onClick={() => handleCharacterToggle(character.characterId)}
                    disabled={isDisabled}
                    sx={{
                      py: 1,
                      px: 2,
                      borderRadius: '8px',
                      mx: 0.5,
                      mb: 0.25,
                      opacity: isDisabled ? 0.4 : 1,
                      '&:hover': { background: 'rgba(255,255,255,0.05)' },
                      ...(isSelected && {
                        background: 'rgba(0,122,255,0.1)',
                        '&:hover': { background: 'rgba(0,122,255,0.15)' },
                      }),
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 44 }}>
                      <CharacterAvatar character={character} size={32} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={character.characterName}
                      secondary={character.characterType || 'Human'}
                      primaryTypographyProps={{ sx: { color: '#fff', fontWeight: isSelected ? 600 : 400, fontSize: '0.9rem' } }}
                      secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' } }}
                    />
                    {isSelected && <CheckIcon sx={{ fontSize: 18, color: '#007AFF' }} />}
                  </ListItemButton>
                </ListItem>
              );
            })
          )}
        </List>
      </Popover>

      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ borderRadius: '12px' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateSlideshowPage;
