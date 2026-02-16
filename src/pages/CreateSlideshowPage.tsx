import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { setTokensRemaining } from '../store/authSlice';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  TextField,
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

// Slide count options
const slideCountOptions: DropdownOption[] = [
  { id: '4', label: '4 Slides', description: '50 tokens' },
  { id: '8', label: '8 Slides', description: '100 tokens' },
  { id: '12', label: '12 Slides', description: '150 tokens' },
  { id: '16', label: '16 Slides', description: '200 tokens' },
  { id: '20', label: '20 Slides', description: '250 tokens' },
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

const CreateSlideshowPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const allowances = useSelector((state: RootState) => state.auth.allowances);
  const tokens = allowances?.tokens;
  const remainingTokens = ((tokens?.max || 0) + (tokens?.topup || 0)) - (tokens?.used || 0);

  // Form state
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('3d-cartoon');
  const [slideCount, setSlideCount] = useState('8');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '4:5'>('9:16');
  const [hookText, setHookText] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch characters
  const { data: charactersData } = useGetUserCharactersQuery(
    { userId: user?.userId || '' },
    { skip: !user?.userId }
  );
  const characters = charactersData?.characters || [];

  const tokenCost = (parseInt(slideCount) / 4) * 50;
  const hasEnoughTokens = remainingTokens >= tokenCost;
  const instagramWarning = aspectRatio === '4:5' && parseInt(slideCount) > 8;

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
        slideCount: parseInt(slideCount) as 4 | 8 | 12 | 16 | 20,
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

  const toggleCharacter = (characterId: string) => {
    setSelectedCharacterIds(prev =>
      prev.includes(characterId)
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box sx={{
          width: 56, height: 56, borderRadius: '16px',
          background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
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
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
            Create Slideshow
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
            Generate AI carousel images for TikTok and Instagram
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/my-slideshows')}
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
      </Box>

      {/* Description */}
      <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#fff' }}>
          Description *
        </Typography>
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
      </Paper>

      {/* Style + Slide Count */}
      <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <StyledDropdown
              options={artStyles}
              value={selectedStyle}
              onChange={setSelectedStyle}
              label="Art Style"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StyledDropdown
              options={slideCountOptions}
              value={slideCount}
              onChange={setSlideCount}
              label="Slide Count"
            />
          </Box>
        </Box>
      </Paper>

      {/* Aspect Ratio */}
      <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#fff' }}>
          Aspect Ratio
        </Typography>
        <ToggleButtonGroup
          value={aspectRatio}
          exclusive
          onChange={(_, val) => val && setAspectRatio(val)}
          sx={{ gap: 1 }}
        >
          <ToggleButton value="9:16" sx={{
            borderRadius: '12px !important', px: 3, py: 1.5, textTransform: 'none',
            border: '1px solid rgba(255,255,255,0.1) !important',
            color: 'rgba(255,255,255,0.7)',
            '&.Mui-selected': { backgroundColor: 'rgba(0,122,255,0.15)', borderColor: '#007AFF !important', color: '#007AFF' },
          }}>
            <SmartphoneIcon sx={{ mr: 1, fontSize: 20 }} /> 9:16 TikTok
          </ToggleButton>
          <ToggleButton value="4:5" sx={{
            borderRadius: '12px !important', px: 3, py: 1.5, textTransform: 'none',
            border: '1px solid rgba(255,255,255,0.1) !important',
            color: 'rgba(255,255,255,0.7)',
            '&.Mui-selected': { backgroundColor: 'rgba(0,122,255,0.15)', borderColor: '#007AFF !important', color: '#007AFF' },
          }}>
            <CropSquareIcon sx={{ mr: 1, fontSize: 20 }} /> 4:5 Instagram
          </ToggleButton>
        </ToggleButtonGroup>
        {instagramWarning && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#FF9500' }}>
            Instagram limits carousels to 10 images. Consider reducing slide count for Instagram posts.
          </Typography>
        )}
      </Paper>

      {/* Hook + CTA */}
      <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#fff' }}>
          Hook & CTA (Optional)
        </Typography>
        <TextField
          fullWidth
          placeholder="Hook text for first slide (e.g., 'I asked AI to put my kid in a fairy tale')"
          value={hookText}
          onChange={(e) => setHookText(e.target.value)}
          sx={{
            mb: 2,
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
          }}
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          fullWidth
          placeholder="CTA text for last slide (e.g., 'Download our app')"
          value={ctaText}
          onChange={(e) => setCtaText(e.target.value)}
          sx={{
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
          }}
          inputProps={{ maxLength: 100 }}
        />
      </Paper>

      {/* Title */}
      <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#fff' }}>
          Title (Optional)
        </Typography>
        <TextField
          fullWidth
          placeholder="Internal reference name for this slideshow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
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
          }}
          inputProps={{ maxLength: 100 }}
        />
      </Paper>

      {/* Characters */}
      {characters.length > 0 && (
        <Paper sx={{ p: 3, borderRadius: '20px', mb: 3, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} elevation={0}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#fff' }}>
            Characters (Optional)
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 2 }}>
            Select AI assets to include as character references in your slideshow
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {characters.map((character) => {
              const isSelected = selectedCharacterIds.includes(character.characterId);
              return (
                <Box
                  key={character.characterId}
                  onClick={() => toggleCharacter(character.characterId)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 1.5, py: 1, borderRadius: '12px', cursor: 'pointer',
                    border: isSelected ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                    background: isSelected ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: isSelected ? '#007AFF' : 'rgba(255,255,255,0.2)',
                      background: isSelected ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <CharacterAvatar character={character} size={32} />
                  <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 400, color: '#fff' }}>
                    {character.characterName}
                  </Typography>
                  {isSelected && <CheckIcon sx={{ fontSize: 16, color: '#007AFF' }} />}
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}

      {/* Token Cost + Submit */}
      <Paper sx={{
        p: 3, borderRadius: '20px', mb: 3,
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }} elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Cost:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
              {tokenCost}
            </Typography>
            <GruviCoin size={20} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Balance:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: hasEnoughTokens ? '#22C55E' : '#FF3B30' }}>
              {remainingTokens.toLocaleString()}
            </Typography>
            <GruviCoin size={16} />
          </Box>
        </Box>
        <Button
          fullWidth
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
            '&.Mui-disabled': {
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          {isGenerating ? (
            <CircularProgress size={24} sx={{ color: '#fff' }} />
          ) : (
            `Create Slideshow (${tokenCost} tokens)`
          )}
        </Button>
        {!hasEnoughTokens && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#FF3B30', textAlign: 'center' }}>
            Not enough tokens. You need {tokenCost - remainingTokens} more tokens.
          </Typography>
        )}
      </Paper>

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
