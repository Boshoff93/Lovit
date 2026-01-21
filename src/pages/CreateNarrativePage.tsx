import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  TextField,
  Paper,
  CircularProgress,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { narrativesApi, charactersApi, Narrative } from '../services/api';
import { getTokensFromAllowances, createCheckoutSession, fetchSubscription, setTokensRemaining } from '../store/authSlice';
import { TopUpBundle } from '../config/stripe';
import UpgradePopup from '../components/UpgradePopup';
import StyledDropdown, { DropdownOption } from '../components/StyledDropdown';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import GruviCoin from '../components/GruviCoin';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessIcon from '@mui/icons-material/Business';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CampaignIcon from '@mui/icons-material/Campaign';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// Narrative type options
type NarrativeType = 'story' | 'ugc';

// Character type matching the API response
interface Character {
  characterId: string;
  characterName: string;
  characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App' | 'Business';
  description?: string;
  imageUrls?: string[];
}

// Flat cost per voiceover
const VOICEOVER_COST = 25;
// Story narratives: up to 5 AI assets of any type
// UGC narratives: just 1 product/place/app (no character needed)
const MAX_CAST_MEMBERS_STORY = 5;
const MAX_CAST_MEMBERS_UGC = 1;

// Character type icons
const characterTypeIcons: Record<string, React.ReactNode> = {
  'Human': <PersonIcon sx={{ fontSize: 20 }} />,
  'Non-Human': <PetsIcon sx={{ fontSize: 20 }} />,
  'Product': <InventoryIcon sx={{ fontSize: 20 }} />,
  'Place': <HomeIcon sx={{ fontSize: 20 }} />,
  'App': <PhoneIphoneIcon sx={{ fontSize: 20 }} />,
  'Business': <BusinessIcon sx={{ fontSize: 20 }} />,
};

// Character Avatar component
const CharacterAvatar: React.FC<{ character: Character; size?: number; sx?: any }> = ({ character, size = 40, sx }) => {
  const hasImage = character.imageUrls && character.imageUrls.length > 0;
  const type = character.characterType || 'Human';

  if (hasImage) {
    return (
      <Avatar
        src={character.imageUrls![0]}
        sx={{ width: size, height: size, ...sx }}
      />
    );
  }

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: 'rgba(0,122,255,0.2)',
        color: '#007AFF',
        ...sx
      }}
    >
      {characterTypeIcons[type] || <PersonIcon sx={{ fontSize: size * 0.5 }} />}
    </Avatar>
  );
};

// Voice data - copied from Fable with local assets
const VOICE_OPTIONS: DropdownOption[] = [
  // Free voices
  { id: 'albus', label: 'Sir Albus', image: '/voices/avatars/albus.jpeg', audioPreview: '/voices/albus.mp3', description: 'Wise storyteller', isPremium: false },
  { id: 'beth', label: 'Aunt Beth', image: '/voices/avatars/beth.jpeg', audioPreview: '/voices/beth.mp3', description: 'Warm & nurturing', isPremium: false },
  // Premium voices
  { id: 'fiona', label: 'Fiona', image: '/voices/avatars/fiona.jpeg', audioPreview: '/voices/fiona.mp3', description: 'Elegant narrator', isPremium: true },
  { id: 'ash', label: 'Ash', image: '/voices/avatars/ash.jpeg', audioPreview: '/voices/ash.mp3', description: 'Young & energetic', isPremium: true },
  { id: 'juni', label: 'Juni', image: '/voices/avatars/juni.jpeg', audioPreview: '/voices/juni.mp3', description: 'Playful & bright', isPremium: true },
  { id: 'optimus', label: 'Optimus', image: '/voices/avatars/optimus.jpeg', audioPreview: '/voices/optimus.mp3', description: 'Deep & powerful', isPremium: true },
  { id: 'shimmer', label: 'Cherry Twinkle', image: '/voices/avatars/shimmer.jpg', audioPreview: '/voices/shimmer.mp3', description: 'Magical & whimsical', isPremium: true },
  { id: 'coral', label: 'Finn', image: '/voices/avatars/coral.jpg', audioPreview: '/voices/coral.mp3', description: 'Adventurous spirit', isPremium: true },
  { id: 'queen', label: 'Queen Bee', image: '/voices/avatars/queen.jpeg', audioPreview: '/voices/queen.mp3', description: 'Regal & commanding', isPremium: true },
  { id: 'nova', label: 'Penny Snow', image: '/voices/avatars/nova.jpeg', audioPreview: '/voices/nova.mp3', description: 'Soft & gentle', isPremium: true },
  { id: 'arthur', label: 'King Arthur', image: '/voices/avatars/arthur.jpeg', audioPreview: '/voices/arthur.mp3', description: 'Noble & heroic', isPremium: true },
  { id: 'walker', label: 'Ms. Walker', image: '/voices/avatars/walker.jpeg', audioPreview: '/voices/walker.mp3', description: 'Professional tone', isPremium: true },
  { id: 'captain', label: 'Captain Flint', image: '/voices/avatars/captain.jpeg', audioPreview: '/voices/captain.mp3', description: 'Bold adventurer', isPremium: true },
  { id: 'sage', label: 'Sage', image: '/voices/avatars/sage.jpeg', audioPreview: '/voices/sage.mp3', description: 'Calm & wise', isPremium: true },
  { id: 'jane', label: 'Nimble', image: '/voices/avatars/jane.jpeg', audioPreview: '/voices/jane.mp3', description: 'Quick & clever', isPremium: true },
  { id: 'percy', label: 'Master Percy', image: '/voices/avatars/percy.jpeg', audioPreview: '/voices/percy.mp3', description: 'Distinguished butler', isPremium: true },
  { id: 'william', label: 'Detective Gadget', image: '/voices/avatars/william.jpeg', audioPreview: '/voices/william.mp3', description: 'Curious investigator', isPremium: true },
  { id: 'juggernaut', label: 'Lord Ragnar', image: '/voices/avatars/juggernaut.jpeg', audioPreview: '/voices/ragnar.mp3', description: 'Mighty warrior', isPremium: true },
  { id: 'atlas', label: 'Atlas', image: '/voices/avatars/atlas.jpeg', audioPreview: '/voices/atlas.mp3', description: 'Strong & steady', isPremium: true },
  { id: 'orin', label: 'Orin Stormvale', image: '/voices/avatars/orin.jpeg', audioPreview: '/voices/orin.mp3', description: 'Mysterious mage', isPremium: true },
  { id: 'fable', label: 'Lucian', image: '/voices/avatars/fable.jpg', audioPreview: '/voices/fable.mp3', description: 'Classic narrator', isPremium: true },
  { id: 'echo', label: 'Dexter Dynamite', image: '/voices/avatars/echo.jpg', audioPreview: '/voices/echo.mp3', description: 'Explosive energy', isPremium: true },
  { id: 'anna', label: 'Anna', image: '/voices/avatars/anna.jpeg', audioPreview: '/voices/anna.mp3', description: 'Sweet & sincere', isPremium: true },
  { id: 'amelia', label: 'Amelia', image: '/voices/avatars/amelia.jpeg', audioPreview: '/voices/amelia.mp3', description: 'Warm narrator', isPremium: true },
  { id: 'quinn', label: 'Quinn', image: '/voices/avatars/quinn.jpeg', audioPreview: '/voices/quinn.mp3', description: 'Modern & fresh', isPremium: true },
  { id: 'polly', label: 'Polly', image: '/voices/avatars/polly.jpeg', audioPreview: '/voices/polly.mp3', description: 'Cheerful spirit', isPremium: true },
  { id: 'khali', label: 'Khali', image: '/voices/avatars/khali.jpeg', audioPreview: '/voices/khali.mp3', description: 'Rich & soulful', isPremium: true },
];

// Character type ordering
const characterTypeOrder = ['Human', 'Non-Human', 'Product', 'Place', 'App', 'Business'];

const CreateNarrativePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auth state
  const { user, token, allowances, subscription } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;
  const userId = user?.userId || '';

  // Get remaining tokens from allowances
  const tokens = getTokensFromAllowances(allowances);
  const totalTokens = (tokens?.max || 0) + (tokens?.topup || 0);
  const usedTokens = tokens?.used || 0;
  const tokensRemaining = totalTokens - usedTokens;

  // Check subscription status
  const hasSubscription = subscription?.tier !== 'free' && subscription?.status === 'active';

  // Form state
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<string>('albus');
  const [narrativeType, setNarrativeType] = useState<NarrativeType>('story');

  // AI Assets state
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [castPickerOpen, setCastPickerOpen] = useState(false);
  const [castPickerAnchor, setCastPickerAnchor] = useState<HTMLElement | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [currentNarrative, setCurrentNarrative] = useState<Narrative | null>(null);
  const [pollingInterval, setPollingIntervalState] = useState<NodeJS.Timeout | null>(null);

  // Error state - show at top of page
  const [pageError, setPageError] = useState<string | null>(null);

  // Audio preview state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  // Popup state
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState(false);

  // Check if premium tier
  const isPremiumTier = (subscription?.tier || '').toLowerCase() === 'premium';

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Flat cost per voiceover
  const estimatedCost = VOICEOVER_COST;

  // Derived state for characters
  const selectedCastMembers = characters.filter(c => selectedCharacterIds.includes(c.characterId));
  const groupedCharacters = characters.reduce((acc, char) => {
    const type = char.characterType || 'Human';
    if (!acc[type]) acc[type] = [];
    acc[type].push(char);
    return acc;
  }, {} as Record<string, Character[]>);

  // Check if selection is allowed for a character type
  // Story mode: up to 5 AI assets of any type
  // UGC mode: just 1 product/place/app (no characters)
  const canSelectCharacter = (char: Character) => {
    const isCharacter = char.characterType === 'Human' || char.characterType === 'Non-Human' || !char.characterType;

    // UGC mode: only allow products/places/apps, max 1
    if (narrativeType === 'ugc') {
      if (isCharacter) return false; // No characters in UGC mode
      return selectedCastMembers.length < MAX_CAST_MEMBERS_UGC;
    }

    // Story mode: up to 5 AI assets of any type
    return selectedCastMembers.length < MAX_CAST_MEMBERS_STORY;
  };

  // Load characters on mount
  useEffect(() => {
    if (userId && isAuthenticated) {
      loadCharacters();
    }
  }, [userId, isAuthenticated]);

  const loadCharacters = async () => {
    if (!userId) return;
    setIsLoadingCharacters(true);
    try {
      const response = await charactersApi.getUserCharacters(userId);
      setCharacters(response.data.characters || []);
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setIsLoadingCharacters(false);
    }
  };

  const handleCharacterToggle = (characterId: string) => {
    const char = characters.find(c => c.characterId === characterId);
    setSelectedCharacterIds(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else if (char && canSelectCharacter(char)) {
        return [...prev, characterId];
      }
      return prev;
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [pollingInterval]);

  const handleVoiceSelect = (voiceId: string) => {
    const voice = VOICE_OPTIONS.find(v => v.id === voiceId);
    if (voice?.isPremium && !hasSubscription) {
      setUpgradeMessage('Premium voices require a subscription');
      setShowUpgradePopup(true);
      return;
    }
    setSelectedVoice(voiceId);
  };

  const handlePremiumVoiceClick = (option: DropdownOption) => {
    setUpgradeMessage('Premium voices require a subscription');
    setShowUpgradePopup(true);
  };

  const handlePreviewStateChange = (id: string | null, isPlaying: boolean) => {
    setPlayingVoiceId(id);
  };

  const handleGenerate = async () => {
    if (!userId || !isAuthenticated) {
      setPageError('Please sign in to generate audio');
      return;
    }

    if (!text.trim()) {
      setPageError('Please enter some text');
      return;
    }

    if (text.length > 10000) {
      setPageError('Text is too long (max 10,000 characters)');
      return;
    }

    if (tokensRemaining < estimatedCost) {
      setUpgradeMessage(`You need ${estimatedCost} tokens but only have ${tokensRemaining}`);
      setShowUpgradePopup(true);
      return;
    }

    // Clear any previous errors
    setPageError(null);
    setIsLoading(true);
    setCurrentNarrative(null);

    try {
      const response = await narrativesApi.createNarrative({
        userId,
        text: text.trim(),
        narratorId: selectedVoice,
        title: title.trim() || undefined,
        characterIds: selectedCharacterIds.length > 0 ? selectedCharacterIds : undefined,
        narrativeType,
      });

      // Update local token count
      dispatch(setTokensRemaining(response.data.tokensRemaining));

      // Start polling for status
      const narrativeId = response.data.narrativeId;
      startPolling(narrativeId);

      setSnackbar({
        open: true,
        message: 'Generating audio...',
        severity: 'info',
      });
    } catch (error: any) {
      console.error('Failed to create narrative:', error);
      setIsLoading(false);

      if (error.response?.status === 402) {
        setUpgradeMessage('Insufficient tokens');
        setShowUpgradePopup(true);
      } else if (error.response?.status === 403) {
        setUpgradeMessage('Premium voice requires subscription');
        setShowUpgradePopup(true);
      } else {
        setPageError(error.response?.data?.error || 'Failed to generate audio');
      }
    }
  };

  const startPolling = (narrativeId: string) => {
    if (!userId) return;

    const interval = setInterval(async () => {
      try {
        const response = await narrativesApi.getNarrative(userId, narrativeId);
        const narrative = response.data;

        setCurrentNarrative(narrative);

        if (narrative.status === 'completed') {
          clearInterval(interval);
          setPollingIntervalState(null);
          setIsLoading(false);
          setSnackbar({
            open: true,
            message: 'Audio generated successfully!',
            severity: 'success',
          });
        } else if (narrative.status === 'failed') {
          clearInterval(interval);
          setPollingIntervalState(null);
          setIsLoading(false);
          // Refresh tokens (refund)
          dispatch(fetchSubscription());
          setPageError(narrative.errorMessage || 'Generation failed');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);

    setPollingIntervalState(interval);
  };

  const handlePlayPause = () => {
    if (!currentNarrative?.audioUrl || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = currentNarrative.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!currentNarrative?.audioUrl) return;

    const link = document.createElement('a');
    link.href = currentNarrative.audioUrl;
    link.download = `${currentNarrative.title || 'narrative'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTopUp = async (bundle?: TopUpBundle) => {
    if (!bundle) return;
    setIsTopUpLoading(true);
    try {
      const response = await dispatch(createCheckoutSession({
        priceId: bundle.priceId,
        productId: bundle.productId,
      })).unwrap();

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Top-up error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to start checkout',
        severity: 'error',
      });
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const handleUpgrade = () => {
    navigate('/payment');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 0, md: 2 },
        pb: 4,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Error Banner - Show at top of page */}
        {pageError && (
          <Alert
            severity="error"
            onClose={() => setPageError(null)}
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              '& .MuiAlert-message': { color: '#fff' },
              '& .MuiAlert-icon': { color: '#f44336' },
            }}
          >
            {pageError}
          </Alert>
        )}

        {/* Header - matching CreateVideoPage style */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          gap: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                flexShrink: 0,
              }}
            >
              <HeadsetMicIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                Create Voiceover
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
                Transform your text into professional AI-generated audio
              </Typography>
            </Box>
          </Box>
          {/* View My Voiceovers button - Full on large, icon on small */}
          <Button
            variant="contained"
            onClick={() => navigate('/my-narratives')}
            startIcon={<HeadsetMicIcon />}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              px: 2.5,
              py: 1,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              border: '1px solid rgba(255,255,255,0.1)',
              flexShrink: 0,
              '&:hover': {
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
              },
            }}
          >
            View My Voiceovers
          </Button>
          <IconButton
            onClick={() => navigate('/my-narratives')}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              color: '#fff',
              border: 'none',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563EB 0%, #0891B2 100%)',
                boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
              },
            }}
          >
            <HeadsetMicIcon />
          </IconButton>
        </Box>

        {/* Main Content - Two Column Layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 0, lg: 3 }, width: '100%', minWidth: 0 }}>
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
          {/* Narrative Type Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 2 }}>
              Narrative Type
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
              Choose the style of content to generate
            </Typography>
            <ToggleButtonGroup
              value={narrativeType}
              exclusive
              onChange={(_e, value) => {
                if (value) {
                  setNarrativeType(value);
                  // When switching to UGC, remove any selected characters (only products/places/apps allowed)
                  if (value === 'ugc') {
                    setSelectedCharacterIds(prev => {
                      const productIds = prev.filter(id => {
                        const char = characters.find(c => c.characterId === id);
                        return char && (char.characterType === 'Product' || char.characterType === 'App' || char.characterType === 'Business' || char.characterType === 'Place');
                      });
                      // Keep only the first product/place/app
                      return productIds.slice(0, 1);
                    });
                  }
                }
              }}
              sx={{
                display: 'flex',
                gap: 0.5,
                flexDirection: { xs: 'column', sm: 'row' },
                width: '100%',
                '& .MuiToggleButtonGroup-grouped': {
                  border: 'none',
                  '&:not(:first-of-type)': {
                    borderRadius: '16px',
                    ml: { xs: 0, sm: 1 },
                    mt: { xs: 1, sm: 0 },
                  },
                  '&:first-of-type': {
                    borderRadius: '16px',
                  },
                },
              }}
            >
              <ToggleButton
                value="story"
                sx={{
                  flex: 1,
                  flexDirection: 'column',
                  gap: 1,
                  py: 2.5,
                  px: 3,
                  background: narrativeType === 'story'
                    ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.2) 0%, rgba(0, 122, 255, 0.2) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  border: narrativeType === 'story'
                    ? '2px solid #00D4AA !important'
                    : '1px solid rgba(255,255,255,0.1) !important',
                  '&:hover': {
                    background: narrativeType === 'story'
                      ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.25) 0%, rgba(0, 122, 255, 0.25) 100%)'
                      : 'rgba(255,255,255,0.06)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.2) 0%, rgba(0, 122, 255, 0.2) 100%)',
                  },
                }}
              >
                <MenuBookIcon sx={{ fontSize: 28, color: narrativeType === 'story' ? '#00D4AA' : 'rgba(255,255,255,0.5)' }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: narrativeType === 'story' ? '#fff' : 'rgba(255,255,255,0.7)' }}>Story</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textAlign: 'center' }}>
                  Narrative storytelling with characters and scenes
                </Typography>
              </ToggleButton>
              <ToggleButton
                value="ugc"
                sx={{
                  flex: 1,
                  flexDirection: 'column',
                  gap: 1,
                  py: 2.5,
                  px: 3,
                  background: narrativeType === 'ugc'
                    ? 'linear-gradient(135deg, rgba(255, 45, 85, 0.2) 0%, rgba(175, 82, 222, 0.2) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  border: narrativeType === 'ugc'
                    ? '2px solid #FF2D55 !important'
                    : '1px solid rgba(255,255,255,0.1) !important',
                  '&:hover': {
                    background: narrativeType === 'ugc'
                      ? 'linear-gradient(135deg, rgba(255, 45, 85, 0.25) 0%, rgba(175, 82, 222, 0.25) 100%)'
                      : 'rgba(255,255,255,0.06)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(255, 45, 85, 0.2) 0%, rgba(175, 82, 222, 0.2) 100%)',
                  },
                }}
              >
                <CampaignIcon sx={{ fontSize: 28, color: narrativeType === 'ugc' ? '#FF2D55' : 'rgba(255,255,255,0.5)' }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: narrativeType === 'ugc' ? '#fff' : 'rgba(255,255,255,0.7)' }}>UGC / Influencer</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textAlign: 'center' }}>
                  Hook-driven content for social media
                </Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Voice Selection */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                Voice
              </Typography>
              <Chip
                label="Required"
                size="small"
                sx={{
                  ml: 'auto',
                  bgcolor: 'rgba(0, 212, 170, 0.15)',
                  color: '#00D4AA',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}
              />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
              Choose a voice for your narrative
            </Typography>
            <Box sx={{  }}>
              <StyledDropdown
                options={VOICE_OPTIONS}
                value={selectedVoice}
                onChange={handleVoiceSelect}
                showAudioPreview
                hasPremiumAccess={hasSubscription}
                onPremiumClick={handlePremiumVoiceClick}
                currentlyPlayingId={playingVoiceId}
                onPreviewStateChange={handlePreviewStateChange}
                icon={<RecordVoiceOverIcon sx={{ fontSize: 20 }} />}
                fullWidth
              />
            </Box>
          </Box>

          {/* Content Prompt */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <AutoAwesomeIcon sx={{ color: narrativeType === 'story' ? '#00D4AA' : '#FF2D55' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                {narrativeType === 'story' ? 'Story Prompt' : 'Content Prompt'}
              </Typography>
              <Chip
                label="Required"
                size="small"
                sx={{
                  ml: 'auto',
                  bgcolor: narrativeType === 'story' ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255, 45, 85, 0.15)',
                  color: narrativeType === 'story' ? '#00D4AA' : '#FF2D55',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}
              />
            </Box>
            {/* AI Assets Selection */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1 }}>
                {narrativeType === 'ugc'
                  ? 'Select AI asset (1 product/place/app)'
                  : 'Add AI assets (up to 5 max)'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center',  }}>
                {/* Dropdown button */}
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

                {/* Create button */}
                <Tooltip title="Create new AI asset" arrow>
                  <Button
                    onClick={() => navigate('/ai-assets/create')}
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
                </Tooltip>
              </Box>

              {/* Selected cast chips */}
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
                        fontWeight: 500,
                        pl: 0.5,
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
              rows={6}
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={narrativeType === 'story'
                ? "A magical adventure about a young wizard discovering their powers..."
                : "Promote my new skincare product that helps with acne and gives glowing skin..."}
              inputProps={{ maxLength: 2000 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                },
                '& .MuiInputBase-input': {
                  '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                },
              }}
            />
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mt: 1 }}>
              {text.length.toLocaleString()} / 2,000 characters
            </Typography>
          </Box>

          {/* Summary & Generate - shown inside Paper on xs/sm/md */}
          <Box sx={{ display: { xs: 'block', lg: 'none' }, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Summary header */}
            <Typography variant="subtitle2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', mb: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
              Summary
            </Typography>

            {/* Compact chip-style summary */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
              {/* Type chip */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.75,
                borderRadius: '20px',
                background: narrativeType === 'story' ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255, 45, 85, 0.15)',
                border: narrativeType === 'story' ? '1px solid rgba(0, 212, 170, 0.3)' : '1px solid rgba(255, 45, 85, 0.3)',
              }}>
                {narrativeType === 'story' ? (
                  <>
                    <MenuBookIcon sx={{ fontSize: 16, color: '#00D4AA' }} />
                    <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>Story</Typography>
                  </>
                ) : (
                  <>
                    <CampaignIcon sx={{ fontSize: 16, color: '#FF2D55' }} />
                    <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>UGC</Typography>
                  </>
                )}
              </Box>

              {/* Voice chip */}
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
                <Avatar
                  src={VOICE_OPTIONS.find(v => v.id === selectedVoice)?.image}
                  sx={{ width: 18, height: 18 }}
                />
                <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                  {VOICE_OPTIONS.find(v => v.id === selectedVoice)?.label}
                </Typography>
              </Box>

              {/* Characters chip - only if selected */}
              {selectedCastMembers.length > 0 && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '20px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                }}>
                  <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                    {selectedCastMembers.length} Asset{selectedCastMembers.length > 1 ? 's' : ''}
                  </Typography>
                </Box>
              )}

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
                  {estimatedCost}
                </Typography>
                <GruviCoin size={16} />
              </Box>
            </Box>

            {/* Generate Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={isLoading || !text.trim() || !isAuthenticated}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '12px',
                  background: narrativeType === 'story'
                    ? 'linear-gradient(135deg, #00D4AA 0%, #007AFF 100%)'
                    : 'linear-gradient(135deg, #FF2D55 0%, #AF52DE 100%)',
                  boxShadow: narrativeType === 'story'
                    ? '0 8px 24px rgba(0, 212, 170, 0.3)'
                    : '0 8px 24px rgba(255, 45, 85, 0.3)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    boxShadow: narrativeType === 'story'
                      ? '0 12px 32px rgba(0, 212, 170, 0.4)'
                      : '0 12px 32px rgba(255, 45, 85, 0.4)',
                  },
                  '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                ) : (
                  narrativeType === 'story' ? 'Generate Story' : 'Generate UGC Content'
                )}
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{ textAlign: 'center', mt: 2, display: 'block', color: 'rgba(255,255,255,0.5)' }}
            >
              {narrativeType === 'story'
                ? 'AI will generate a full narrative based on your prompt'
                : 'AI will create hook-driven content for social media'}
            </Typography>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Summary
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                    {estimatedCost} x
                  </Typography>
                  <GruviCoin size={20} />
                </Box>
              </Box>

              {/* Summary bullets - single column */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Type</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    {narrativeType === 'story' ? (
                      <>
                        <MenuBookIcon sx={{ fontSize: 18, color: '#00D4AA' }} />
                        <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>Story</Typography>
                      </>
                    ) : (
                      <>
                        <CampaignIcon sx={{ fontSize: 18, color: '#FF2D55' }} />
                        <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>UGC</Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Voice</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <Avatar
                      src={VOICE_OPTIONS.find(v => v.id === selectedVoice)?.image}
                      sx={{ width: 22, height: 22 }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>
                      {VOICE_OPTIONS.find(v => v.id === selectedVoice)?.label}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Prompt Length</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', flex: 1, color: '#fff' }}>
                    {text.length.toLocaleString()} chars
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>AI Assets</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', flex: 1, color: '#fff' }}>
                    {selectedCastMembers.length > 0 ? selectedCastMembers.length : 'None'}
                  </Typography>
                </Box>
              </Box>

              {/* Generate Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleGenerate}
                disabled={isLoading || !text.trim() || !isAuthenticated}
                sx={{
                  py: 2,
                  borderRadius: '16px',
                  background: narrativeType === 'story'
                    ? 'linear-gradient(135deg, #00D4AA 0%, #007AFF 100%)'
                    : 'linear-gradient(135deg, #FF2D55 0%, #AF52DE 100%)',
                  boxShadow: narrativeType === 'story'
                    ? '0 8px 24px rgba(0, 212, 170, 0.3)'
                    : '0 8px 24px rgba(255, 45, 85, 0.3)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    boxShadow: narrativeType === 'story'
                      ? '0 12px 32px rgba(0, 212, 170, 0.4)'
                      : '0 12px 32px rgba(255, 45, 85, 0.4)',
                  },
                  '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)' },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                ) : (
                  narrativeType === 'story' ? 'Generate Story' : 'Generate UGC Content'
                )}
              </Button>

              <Typography
                variant="caption"
                sx={{ textAlign: 'center', mt: 2, display: 'block', color: 'rgba(255,255,255,0.5)' }}
              >
                {narrativeType === 'story'
                  ? 'AI will generate a full narrative based on your prompt'
                  : 'AI will create hook-driven content for social media'}
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Progress / Result section */}
        {currentNarrative && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {currentNarrative.status === 'processing' && (
              <Box>
                <Typography sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                  Generating Audio...
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={currentNarrative.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #00D4AA 0%, #007AFF 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    mt: 1,
                    fontSize: '0.875rem',
                  }}
                >
                  {currentNarrative.progressMessage}
                </Typography>
              </Box>
            )}

            {currentNarrative.status === 'completed' && (
              <Box>
                <Typography sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                  {currentNarrative.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={handlePlayPause}
                    sx={{
                      bgcolor: 'rgba(0, 212, 170, 0.2)',
                      color: '#00D4AA',
                      '&:hover': { bgcolor: 'rgba(0, 212, 170, 0.3)' },
                    }}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <Button
                    variant="outlined"
                    onClick={handleDownload}
                    sx={{
                      borderColor: '#00D4AA',
                      color: '#00D4AA',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#00D4AA',
                        bgcolor: 'rgba(0, 212, 170, 0.1)',
                      },
                    }}
                  >
                    Download MP3
                  </Button>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
                    {currentNarrative.durationMs
                      ? `${Math.round(currentNarrative.durationMs / 1000)}s`
                      : ''}
                  </Typography>
                </Box>
              </Box>
            )}

            {currentNarrative.status === 'failed' && (
              <Box>
                <Typography sx={{ color: '#FF4444', fontWeight: 600 }}>
                  Generation Failed
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
                  {currentNarrative.errorMessage || 'An error occurred'}
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
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
            {selectedCastMembers.length}/{narrativeType === 'ugc' ? MAX_CAST_MEMBERS_UGC : MAX_CAST_MEMBERS_STORY}
          </Typography>
        </Box>

        {/* Character list */}
        <List sx={{
          py: 0.5,
          maxHeight: 300,
          overflowY: 'auto',
        }}>
          {(() => {
            // Filter types based on narrative mode
            const productTypes = ['Product', 'Place', 'App', 'Business'];
            const allowedTypes = narrativeType === 'ugc'
              ? productTypes
              : characterTypeOrder;

            // Check if there are any available assets for the allowed types
            const hasAvailableAssets = allowedTypes.some(type =>
              groupedCharacters[type] && groupedCharacters[type].length > 0
            );

            if (characters.length === 0 || !hasAvailableAssets) {
              return (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: 2 }}>
                    {narrativeType === 'ugc'
                      ? 'No products, places, or apps yet'
                      : 'No AI assets yet'}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setCastPickerOpen(false);
                      setCastPickerAnchor(null);
                      navigate(narrativeType === 'ugc' ? '/ai-assets/create?type=product' : '/ai-assets/create');
                    }}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      borderColor: '#007AFF',
                      color: '#007AFF',
                    }}
                  >
                    <AddIcon sx={{ mr: 0.5, fontSize: 18 }} />
                    Create Asset
                  </Button>
                </Box>
              );
            }

            return allowedTypes.map((type) => {
              const typeCharacters = groupedCharacters[type];
              if (!typeCharacters || typeCharacters.length === 0) return null;
              return (
                <Box key={type}>
                  <Typography
                    sx={{
                      display: 'block',
                      px: 2,
                      py: 0.75,
                      color: 'rgba(255,255,255,0.4)',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {type === 'Non-Human' ? 'Non-Humans' : type === 'Place' ? 'Places' : type + 's'}
                  </Typography>
                  {typeCharacters.map((char) => {
                    const isSelected = selectedCharacterIds.includes(char.characterId);
                    const isDisabled = !isSelected && !canSelectCharacter(char);
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
                            py: 1.5,
                            px: 2,
                            background: isSelected ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                            opacity: isDisabled ? 0.5 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            '&:hover': { background: isDisabled ? 'transparent' : 'rgba(255,255,255,0.08)' },
                          }}
                        >
                          <ListItemAvatar sx={{ minWidth: 44 }}>
                            <CharacterAvatar character={char} size={32} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={char.characterName}
                            secondary={char.description?.slice(0, 30) || type}
                            primaryTypographyProps={{
                              sx: { color: '#fff', fontWeight: 500, fontSize: '0.9rem' }
                            }}
                            secondaryTypographyProps={{
                              sx: {
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '0.75rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }
                            }}
                          />
                          {isSelected && <CheckIcon sx={{ color: '#007AFF', fontSize: 20, ml: 1 }} />}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </Box>
              );
            });
          })()}
        </List>

        {/* Done button when selections made */}
        {selectedCharacterIds.length > 0 && (
          <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setCastPickerOpen(false);
                setCastPickerAnchor(null);
              }}
              sx={{
                backgroundColor: '#007AFF',
                color: '#fff',
                borderRadius: '10px',
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#0066DD',
                  boxShadow: 'none',
                }
              }}
            >
              Done
            </Button>
          </Box>
        )}
      </Popover>

      {/* Upgrade popup */}
      <UpgradePopup
        open={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        title="Upgrade Required"
        message={upgradeMessage}
        isPremiumTier={isPremiumTier}
        onTopUp={handleTopUp}
        onUpgrade={handleUpgrade}
        isTopUpLoading={isTopUpLoading}
        isUpgradeLoading={isUpgradeLoading}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateNarrativePage;
