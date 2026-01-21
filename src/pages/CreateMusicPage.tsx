import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Chip,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Slider,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { songsApi, charactersApi } from '../services/api';
import { getTokensFromAllowances, createCheckoutSession, setTokensRemaining } from '../store/authSlice';
import { topUpBundles, TopUpBundle } from '../config/stripe';
import UpgradePopup from '../components/UpgradePopup';
import { reportPurchaseConversion } from '../utils/googleAds';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TimerIcon from '@mui/icons-material/Timer';
import TuneIcon from '@mui/icons-material/Tune';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessIcon from '@mui/icons-material/Business';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Avatar from '@mui/material/Avatar';
import GruviCoin from '../components/GruviCoin';
import StyledDropdown, { DropdownOption } from '../components/StyledDropdown';

// Genre options (DropdownOption format)
const genres: DropdownOption[] = [
  { id: 'pop', label: 'Pop', image: '/genres/pop.jpeg' },
  { id: 'hip-hop', label: 'Hip Hop', image: '/genres/hip-hop.jpeg' },
  { id: 'rnb', label: 'R&B', image: '/genres/rnb.jpeg' },
  { id: 'electronic', label: 'Electronic', image: '/genres/electronic.jpeg' },
  { id: 'dance', label: 'Dance', image: '/genres/dance.jpeg' },
  { id: 'house', label: 'House', image: '/genres/house.jpeg' },
  { id: 'tropical-house', label: 'Tropical House', image: '/genres/chillout.jpeg' },
  { id: 'edm', label: 'EDM', image: '/genres/edm.jpeg' },
  { id: 'techno', label: 'Techno', image: '/genres/techno.jpeg' },
  { id: 'rock', label: 'Rock', image: '/genres/rock.jpeg' },
  { id: 'alternative', label: 'Alternative', image: '/genres/alternative.jpeg' },
  { id: 'indie', label: 'Indie', image: '/genres/indie.jpeg' },
  { id: 'punk', label: 'Punk', image: '/genres/punk.jpeg' },
  { id: 'metal', label: 'Metal', image: '/genres/metal.jpeg' },
  { id: 'jazz', label: 'Jazz', image: '/genres/jazz.jpeg' },
  { id: 'blues', label: 'Blues', image: '/genres/blues.jpeg' },
  { id: 'soul', label: 'Soul', image: '/genres/soul.jpeg' },
  { id: 'funk', label: 'Funk', image: '/genres/funk.jpeg' },
  { id: 'classical', label: 'Classical', image: '/genres/classic.jpeg' },
  { id: 'orchestral', label: 'Orchestral', image: '/genres/orchestral.jpeg' },
  { id: 'cinematic', label: 'Cinematic', image: '/genres/cinematic.jpeg' },
  { id: 'country', label: 'Country', image: '/genres/country.jpeg' },
  { id: 'folk', label: 'Folk', image: '/genres/folk.jpeg' },
  { id: 'acoustic', label: 'Acoustic', image: '/genres/acoustic.jpeg' },
  { id: 'latin', label: 'Latin', image: '/genres/latin.jpeg' },
  { id: 'reggaeton', label: 'Reggaeton', image: '/genres/raggaeton.jpeg' },
  { id: 'kpop', label: 'K-Pop', image: '/genres/kpop.jpeg' },
  { id: 'jpop', label: 'J-Pop', image: '/genres/jpop.jpeg' },
  { id: 'reggae', label: 'Reggae', image: '/genres/raggae.jpeg' },
  { id: 'lofi', label: 'Lo-fi', image: '/genres/lofi.jpeg' },
  { id: 'ambient', label: 'Ambient', image: '/genres/ambient.jpeg' },
  { id: 'gospel', label: 'Gospel', image: '/genres/gospels.jpeg' },
];

// Mood options (DropdownOption format)
const moods: DropdownOption[] = [
  { id: 'happy', label: 'Happy', image: '/moods/happy.jpeg' },
  { id: 'sad', label: 'Sad', image: '/moods/sad.jpeg' },
  { id: 'energetic', label: 'Energetic', image: '/moods/energetic.jpeg' },
  { id: 'romantic', label: 'Romantic', image: '/moods/romantic.jpeg' },
  { id: 'chill', label: 'Chill', image: '/moods/chill.jpeg' },
  { id: 'epic', label: 'Epic', image: '/moods/epic.jpeg' },
  { id: 'dreamy', label: 'Dreamy', image: '/moods/dreamy.jpeg' },
  { id: 'dark', label: 'Dark', image: '/moods/dark.jpeg' },
  { id: 'uplifting', label: 'Uplifting', image: '/moods/uplifting.jpeg' },
  { id: 'nostalgic', label: 'Nostalgic', image: '/moods/nostalgic.jpeg' },
  { id: 'peaceful', label: 'Peaceful', image: '/moods/peacful.jpeg' },
  { id: 'intense', label: 'Intense', image: '/moods/intense.jpeg' },
  { id: 'melancholic', label: 'Melancholic', image: '/moods/melancholic.jpeg' },
  { id: 'playful', label: 'Playful', image: '/moods/playful.jpeg' },
  { id: 'mysterious', label: 'Mysterious', image: '/moods/mysterious.jpeg' },
  { id: 'triumphant', label: 'Triumphant', image: '/moods/triumphant.jpeg' },
  { id: 'promotional', label: 'Promotional', image: '/moods/promotional.jpeg' },
];

// Languages (DropdownOption format)
const languages: DropdownOption[] = [
  { id: 'en', label: 'English', image: '/locales/en.png' },
  { id: 'es', label: 'Spanish', image: '/locales/es.png' },
  { id: 'fr', label: 'French', image: '/locales/fr.png' },
  { id: 'de', label: 'German', image: '/locales/de.png' },
  { id: 'it', label: 'Italian', image: '/locales/it.png' },
  { id: 'pt', label: 'Portuguese', image: '/locales/pt.png' },
  { id: 'nl', label: 'Dutch', image: '/locales/nl.png' },
  { id: 'pl', label: 'Polish', image: '/locales/pl.png' },
  { id: 'ro', label: 'Romanian', image: '/locales/ro.png' },
  { id: 'cs', label: 'Czech', image: '/locales/cs.png' },
  { id: 'el', label: 'Greek', image: '/locales/el.png' },
  { id: 'bg', label: 'Bulgarian', image: '/locales/bg.png' },
  { id: 'fi', label: 'Finnish', image: '/locales/fi.png' },
  { id: 'uk', label: 'Ukrainian', image: '/locales/uk.png' },
  { id: 'ru', label: 'Russian', image: '/locales/ru.png' },
  { id: 'tr', label: 'Turkish', image: '/locales/tr.png' },
  { id: 'ar', label: 'Arabic', image: '/locales/ar.png' },
  { id: 'hi', label: 'Hindi', image: '/locales/hi.png' },
  { id: 'th', label: 'Thai', image: '/locales/th.png' },
  { id: 'vi', label: 'Vietnamese', image: '/locales/vi.png' },
  { id: 'id', label: 'Indonesian', image: '/locales/id.png' },
  { id: 'ja', label: 'Japanese', image: '/locales/ja.png' },
  { id: 'ko', label: 'Korean', image: '/locales/ko.png' },
  { id: 'zh', label: 'Chinese', image: '/locales/zh.png' },
];

// Character interface
interface Character {
  characterId: string;
  characterName: string;
  imageUrls?: string[];
  characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App' | 'Business';
  description?: string;
}

// Helper to get character type icon, color, and gradient background
const getCharacterTypeStyle = (characterType?: string): { icon: React.ElementType; color: string; iconBg: string; label: string } => {
  switch (characterType) {
    case 'Product': return { icon: InventoryIcon, color: '#8B5CF6', iconBg: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', label: 'Products' };
    case 'Place': return { icon: HomeIcon, color: '#22C55E', iconBg: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)', label: 'Places' };
    case 'App': return { icon: PhoneIphoneIcon, color: '#EC4899', iconBg: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)', label: 'Software & Apps' };
    case 'Business': return { icon: BusinessIcon, color: '#EAB308', iconBg: 'linear-gradient(135deg, #EAB308 0%, #FACC15 100%)', label: 'Businesses' };
    case 'Non-Human': return { icon: PetsIcon, color: '#F97316', iconBg: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', label: 'Non-Humans' };
    default: return { icon: PersonIcon, color: '#3B82F6', iconBg: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)', label: 'Humans' };
  }
};

// Backwards compatibility alias
const getCharacterTypeIcon = (characterType?: string) => {
  const style = getCharacterTypeStyle(characterType);
  return { icon: style.icon, color: style.color };
};

// Character Avatar component that shows icon when no image
const CharacterAvatar: React.FC<{
  character: Character;
  size?: number;
  sx?: object;
  square?: boolean;
}> = ({ character, size = 40, sx = {}, square = false }) => {
  const hasImage = character.imageUrls && character.imageUrls.length > 0 && character.imageUrls[0];

  if (hasImage) {
    return (
      <Avatar
        src={character.imageUrls![0]}
        sx={{ width: size, height: size, borderRadius: square ? '8px' : '50%', ...sx }}
        variant={square ? 'rounded' : 'circular'}
      />
    );
  }

  const { icon: IconComponent, iconBg } = getCharacterTypeStyle(character.characterType);
  return (
    <Box sx={{
      width: size,
      height: size,
      borderRadius: square ? '8px' : '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: iconBg,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      ...sx
    }}>
      <IconComponent sx={{ fontSize: size * 0.55, color: '#fff' }} />
    </Box>
  );
};

// Order of character types for display
const characterTypeOrder = ['Human', 'Non-Human', 'Product', 'Place', 'App', 'Business'];

// Max cast members allowed
const MAX_CAST_MEMBERS = 5;

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
        background: 'linear-gradient(to bottom, rgba(20,20,24,1) 0%, rgba(20,20,24,0.8) 50%, rgba(20,20,24,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showTopGradient ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />
      <List
        ref={listRef}
        sx={{ py: 1, maxHeight, overflowY: 'auto' }}
      >
        {children}
      </List>
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        background: 'linear-gradient(to top, rgba(20,20,24,1) 0%, rgba(20,20,24,0.8) 50%, rgba(20,20,24,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showBottomGradient ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />
    </Box>
  );
};

// Pricing constants
const SONG_COST_SHORT = 25;      // Short tracks (~30-90s)
const SONG_COST_STANDARD = 50;   // Standard tracks (~1.5-3min)
const PREMIUM_COST_PER_30S = 50; // Premium tracks: 50 credits per 30 seconds

// Premium duration options (in seconds)
// Note: 59/119/179 instead of 60/120/180 to stay under ElevenLabs minute thresholds (saves $0.80 per minute tier)
const PREMIUM_DURATION_OPTIONS = [
  { value: 30, label: '30 sec', cost: 50 },
  { value: 59, label: '1 min', cost: 100 },
  { value: 90, label: '1.5 min', cost: 150 },
  { value: 119, label: '2 min', cost: 200 },
  { value: 150, label: '2.5 min', cost: 250 },
  { value: 179, label: '3 min', cost: 300 },
];

const CreateMusicPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  // Get user and allowances from Redux store
  const { user, allowances, subscription } = useSelector((state: RootState) => state.auth);

  // Token checking state
  const [upgradePopupOpen, setUpgradePopupOpen] = useState(false);
  const [upgradePopupMessage, setUpgradePopupMessage] = useState('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [isUpgradeLoading, setIsUpgradeLoading] = useState(false);

  const isPremiumTier = (subscription?.tier || '').toLowerCase() === 'premium';

  // Get remaining tokens
  const tokens = getTokensFromAllowances(allowances);
  const totalTokens = (tokens?.max || 0) + (tokens?.topup || 0);
  const usedTokens = tokens?.used || 0;
  const remainingTokens = totalTokens - usedTokens;

  // Check if user has enough tokens
  const hasEnoughTokens = (cost: number) => remainingTokens >= cost;

  // Song creation state
  const [songPrompt, setSongPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [selectedMood, setSelectedMood] = useState('happy');
  const [autoPickGenre, setAutoPickGenre] = useState(false);
  const [autoPickMood, setAutoPickMood] = useState(false);
  const [songLength, setSongLength] = useState<'short' | 'standard'>('standard');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [creativity, setCreativity] = useState(5);
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);

  // Premium track state
  const [trackType, setTrackType] = useState<'standard' | 'premium'>('standard');
  const [premiumDuration, setPremiumDuration] = useState<number>(59); // seconds
  const [forceInstrumental, setForceInstrumental] = useState<boolean>(false);

  // Calculate song cost based on track type and settings
  const calculateSongCost = () => {
    if (trackType === 'premium') {
      return Math.ceil(premiumDuration / 30) * PREMIUM_COST_PER_30S;
    }
    return songLength === 'short' ? SONG_COST_SHORT : SONG_COST_STANDARD;
  };

  const songCost = calculateSongCost();

  // Picker states
  const [castPickerAnchor, setCastPickerAnchor] = useState<HTMLElement | null>(null);
  const castPickerOpen = Boolean(castPickerAnchor);

  // Validation
  const [showSongPromptError, setShowSongPromptError] = useState(false);

  // Characters for AI assets selection
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);

  // Notification
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  // Load characters
  useEffect(() => {
    const loadCharacters = async () => {
      if (!user?.userId) return;
      setIsLoadingCharacters(true);
      try {
        const response = await charactersApi.getUserCharacters(user.userId);
        setCharacters(response.data.characters || []);
      } catch (error) {
        console.error('Failed to load characters:', error);
      } finally {
        setIsLoadingCharacters(false);
      }
    };
    loadCharacters();
  }, [user?.userId]);

  // Handle URL parameters for "Generate Similar" functionality
  useEffect(() => {
    // Initialize song prompt from URL parameter
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl) {
      setSongPrompt(promptFromUrl);
    }

    // Handle "Generate Similar" - pre-fill form with original song's data
    const isSimilar = searchParams.get('similar') === 'true';
    if (isSimilar) {
      const genreFromUrl = searchParams.get('genre');
      const moodFromUrl = searchParams.get('mood');
      const languageFromUrl = searchParams.get('language');

      // Genre normalization - map legacy IDs to current ones
      const normalizeGenre = (genre: string): string => {
        const genreAliases: Record<string, string> = {
          'chillout': 'tropical-house',
          'chill': 'tropical-house',
          'j-pop': 'jpop',
          'k-pop': 'kpop',
        };
        const normalized = genre.toLowerCase();
        return genreAliases[normalized] || normalized;
      };

      // Pre-fill genre and mood - handle "auto" values correctly
      if (genreFromUrl) {
        if (genreFromUrl.toLowerCase() === 'auto') {
          setAutoPickGenre(true);
        } else {
          setSelectedGenre(normalizeGenre(genreFromUrl));
          setAutoPickGenre(false);
        }
      }
      if (moodFromUrl) {
        if (moodFromUrl.toLowerCase() === 'auto') {
          setAutoPickMood(true);
        } else {
          setSelectedMood(moodFromUrl.toLowerCase());
          setAutoPickMood(false);
        }
      }
      if (languageFromUrl) {
        setSelectedLanguage(languageFromUrl);
      }

      // Pre-fill creativity and song length
      const creativityFromUrl = searchParams.get('creativity');
      const songLengthFromUrl = searchParams.get('songLength');

      if (creativityFromUrl) {
        const creativityValue = parseInt(creativityFromUrl, 10);
        if (!isNaN(creativityValue) && creativityValue >= 0 && creativityValue <= 10) {
          setCreativity(creativityValue);
        }
      }
      if (songLengthFromUrl === 'short' || songLengthFromUrl === 'standard') {
        setSongLength(songLengthFromUrl);
      }
    }
  }, [searchParams]);

  // Toggle character selection
  const handleCharacterToggle = useCallback((characterId: string) => {
    setSelectedCharacterIds(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else if (prev.length < MAX_CAST_MEMBERS) {
        return [...prev, characterId];
      }
      return prev;
    });
  }, []);

  // Group characters by type
  const groupedCharacters = characters.reduce((acc, char) => {
    const type = char.characterType || 'Human';
    if (!acc[type]) acc[type] = [];
    acc[type].push(char);
    return acc;
  }, {} as Record<string, Character[]>);

  // Get selected characters from IDs
  const selectedCastMembers = characters.filter(char =>
    selectedCharacterIds.includes(char.characterId)
  );

  // Handle upgrade popup actions
  const handleTopUp = useCallback(async (bundle?: TopUpBundle) => {
    try {
      setIsTopUpLoading(true);
      await reportPurchaseConversion();
      const selectedBundle = bundle || topUpBundles[0];
      const resultAction = await dispatch(createCheckoutSession({
        priceId: selectedBundle.priceId,
        productId: selectedBundle.productId
      }));
      if (createCheckoutSession.fulfilled.match(resultAction)) {
        window.location.href = resultAction.payload.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    } finally {
      setIsTopUpLoading(false);
    }
  }, [dispatch]);

  const handleUpgrade = useCallback(() => {
    setIsUpgradeLoading(true);
    navigate('/payment');
  }, [navigate]);

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Enhance prompt with AI
  const handleEnhancePrompt = async () => {
    if (!songPrompt.trim() || isEnhancingPrompt) return;

    setIsEnhancingPrompt(true);
    try {
      // Get tagged character names for context (case-insensitive)
      const taggedCharacters = characters
        .filter(c => {
          const pattern = new RegExp(`@${c.characterName}\\b`, 'i');
          return pattern.test(songPrompt);
        })
        .map(c => ({ characterName: c.characterName }));

      const response = await songsApi.enhancePrompt(songPrompt.trim(), {
        genre: autoPickGenre ? undefined : selectedGenre,
        mood: autoPickMood ? undefined : selectedMood,
        characters: taggedCharacters.length > 0 ? taggedCharacters : undefined,
      });

      if (response.enhancedPrompt) {
        setSongPrompt(response.enhancedPrompt);
        setNotification({
          open: true,
          message: 'Prompt enhanced!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Failed to enhance prompt:', error);
      setNotification({
        open: true,
        message: 'Failed to enhance prompt',
        severity: 'error'
      });
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Generate song
  const handleGenerateSong = async () => {
    // Validation: need prompt
    if (!songPrompt.trim()) {
      setShowSongPromptError(true);
      setNotification({
        open: true,
        message: 'Please enter a video description',
        severity: 'error'
      });
      return;
    }

    if (!hasEnoughTokens(songCost)) {
      setUpgradePopupMessage(`You need ${songCost} tokens to generate a song. You have ${remainingTokens} tokens remaining.`);
      setUpgradePopupOpen(true);
      return;
    }

    setIsGeneratingSong(true);
    try {
      const characterIds = characters
        .filter(c => {
          const pattern = new RegExp(`@${c.characterName}\\b`, 'i');
          return pattern.test(songPrompt);
        })
        .map(c => c.characterId);

      const response = await songsApi.generateSong({
        userId: user?.userId || '',
        songPrompt,
        genre: autoPickGenre ? 'auto' : selectedGenre,
        mood: autoPickMood ? 'auto' : selectedMood,
        language: selectedLanguage,
        songLength,
        creativity,
        characterIds: characterIds.length > 0 ? characterIds : undefined,
        // Premium track options
        trackType,
        premiumDurationMs: trackType === 'premium' ? premiumDuration * 1000 : undefined,
        forceInstrumental: trackType === 'premium' ? forceInstrumental : undefined,
      });

      // Update tokens - setTokensRemaining expects remaining tokens count
      dispatch(setTokensRemaining(remainingTokens - songCost));

      navigate('/my-music?generating=true');
    } catch (error: any) {
      console.error('Failed to generate song:', error);
      setNotification({
        open: true,
        message: error?.response?.data?.message || 'Failed to generate song',
        severity: 'error'
      });
    } finally {
      setIsGeneratingSong(false);
    }
  };

  return (
    <Box sx={{ pt: { xs: 0, md: 2 }, pb: 4, px: { xs: 2, sm: 3, md: 4 },width: '100%', minWidth: 0, display: "flex", flexDirection: "column", mx: 'auto'}}>
      {/* Header */}
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
            <MusicNoteIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              Create Music
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              Generate AI-powered music with custom lyrics
            </Typography>
          </Box>
        </Box>

        {/* View My Music button - Full on large, icon on small */}
        <Button
          variant="contained"
          onClick={() => navigate('/my-music')}
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
          View My Music
        </Button>
        {/* Circle icon button for small screens */}
        <IconButton
          onClick={() => navigate('/my-music')}
          sx={{
            display: { xs: 'flex', sm: 'none' },
            width: 44,
            height: 44,
            background: '#007AFF',
            color: '#fff',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
            '&:hover': {
              background: '#0066CC',
            },
          }}
        >
          <LibraryMusicIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: "column", lg: "row" }, gap: { xs: 0, lg: 3 }, width: '100%', minWidth: 0 }}>
        {/* Left Column - Settings */}
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
          {/* Song Prompt */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2,  }}>
              <AutoAwesomeIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                Song Prompt
              </Typography>
              <Chip
                label="Required"
                size="small"
                sx={{
                  ml: 'auto',
                  background: 'rgba(255,59,48,0.1)',
                  color: '#FF3B30',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}
              />
            </Box>

          {/* Cast Selection */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1 }}>
              Add AI assets to give your song context — feature a character, product, or set a fitting mood
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center',  }}>
              {/* Dropdown button */}
              <Box
                onClick={(e) => setCastPickerAnchor(e.currentTarget)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  background: castPickerOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                  border: (castPickerOpen || selectedCastMembers.length > 0) ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  py: 1.5,
                  px: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flex: 1,
                  minWidth: 0,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                    borderColor: (castPickerOpen || selectedCastMembers.length > 0) ? '#007AFF' : 'rgba(0,122,255,0.3)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {selectedCastMembers.length === 0 ? (
                    <>
                      <FolderSpecialIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.7)',
                        }}
                      >
                        Select AI Assets
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CharacterAvatar
                        character={selectedCastMembers[0]}
                        size={24}
                      />
                      <Typography
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          color: '#fff',
                        }}
                      >
                        {selectedCastMembers.length === 1
                          ? selectedCastMembers[0].characterName
                          : `${selectedCastMembers[0].characterName} +${selectedCastMembers.length - 1}`}
                      </Typography>
                    </>
                  )}
                </Box>
                <KeyboardArrowDownIcon
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 20,
                    transform: castPickerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>

              {/* Create button - dotted outline square */}
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

            {/* Selected cast preview */}
            {selectedCastMembers.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                {selectedCastMembers.map((char) => (
                  <Chip
                    key={char.characterId}
                    label={char.characterName}
                    onDelete={() => {
                      // Remove from selected characters
                      setSelectedCharacterIds(prev => prev.filter(id => id !== char.characterId));
                      // Also remove from prompt (case-insensitive)
                      const mentionPattern = new RegExp(`@${char.characterName}\\b`, 'gi');
                      setSongPrompt(prev => prev.replace(mentionPattern, '').replace(/\s+/g, ' ').trim());
                    }}
                    avatar={
                      <CharacterAvatar character={char} size={24} />
                    }
                    sx={{
                      background: 'rgba(0,122,255,0.1)',
                      border: '1.5px solid #007AFF',
                      fontWeight: 500,
                      pl: 0.5,
                      '& .MuiChip-label': {
                        color: '#fff',
                        pl: 1,
                      },
                      '& .MuiChip-avatar': {
                        ml: 0,
                      },
                      '& .MuiChip-deleteIcon': {
                        color: '#007AFF',
                        '&:hover': { color: '#0056b3' },
                      },
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
            value={songPrompt}
            onChange={(e) => {
              setSongPrompt(e.target.value);
              if (e.target.value.trim()) setShowSongPromptError(false);
            }}
            placeholder="Write a fun, upbeat pop song about summer adventures..."
            error={showSongPromptError && !songPrompt.trim()}
            helperText={showSongPromptError && !songPrompt.trim() ? 'Please enter a song description' : ''}
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
                '&.Mui-error fieldset': { borderColor: '#f44336' },
              },
              '& .MuiInputBase-input': {
                '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
              },
              '& .MuiFormHelperText-root': {
                color: '#f44336',
              },
            }}
          />

          {/* Creativity Slider - inside Song Prompt */}
          <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Prompt adherence
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                {creativity <= 2 ? 'Robot' : creativity <= 4 ? 'Literal' : creativity <= 6 ? 'Balanced' : creativity <= 8 ? 'Creative' : 'Picasso'} ({creativity}/10)
              </Typography>
            </Box>
            <Slider
              value={creativity}
              onChange={(_, value) => setCreativity(value as number)}
              min={1}
              max={10}
              sx={{
                color: '#007AFF',
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                },
                '& .MuiSlider-track': {
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                },
              }}
            />
          </Box>
          </Box>

          {/* Genre, Mood & Language Selection - Each on own row */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
            {/* Genre */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5,  }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Genre
                </Typography>
                <Box
                  onClick={() => setAutoPickGenre(!autoPickGenre)}
                  sx={{
                    background: autoPickGenre ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' : 'transparent',
                    border: '1.5px solid',
                    borderColor: autoPickGenre ? '#5AC8FA' : '#007AFF',
                    borderRadius: '100px',
                    px: 1.5,
                    py: 0.5,
                    gap: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      borderColor: '#5AC8FA',
                      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.4)',
                      '& .auto-icon, & .auto-text': {
                        color: '#fff',
                      },
                    },
                  }}
                >
                  <AutoAwesomeIcon className="auto-icon" sx={{ fontSize: 14, color: '#fff', transition: 'color 0.2s ease' }} />
                  <Box
                    component="span"
                    className="auto-text"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#fff',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    Auto
                  </Box>
                </Box>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                Select the musical style for your track
              </Typography>
              <Box sx={{  }}>
                {autoPickGenre ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: 1.5,
                      px: 2,
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,122,255,0.1)',
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 24, color: '#007AFF' }} />
                    <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>AI picks</Typography>
                  </Box>
                ) : (
                  <StyledDropdown
                    options={genres}
                    value={selectedGenre}
                    onChange={setSelectedGenre}
                    placeholder="Select genre"
                    fullWidth
                  />
                )}
              </Box>
            </Box>

            {/* Mood */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5,  }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Mood
                </Typography>
                <Box
                  onClick={() => setAutoPickMood(!autoPickMood)}
                  sx={{
                    background: autoPickMood ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' : 'transparent',
                    border: '1.5px solid',
                    borderColor: autoPickMood ? '#5AC8FA' : '#007AFF',
                    borderRadius: '100px',
                    px: 1.5,
                    py: 0.5,
                    gap: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      borderColor: '#5AC8FA',
                      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.4)',
                      '& .auto-icon-mood, & .auto-text-mood': {
                        color: '#fff',
                      },
                    },
                  }}
                >
                  <AutoAwesomeIcon className="auto-icon-mood" sx={{ fontSize: 14, color: '#fff', transition: 'color 0.2s ease' }} />
                  <Box
                    component="span"
                    className="auto-text-mood"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#fff',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    Auto
                  </Box>
                </Box>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                Set the emotional tone of your song
              </Typography>
              <Box sx={{  }}>
                {autoPickMood ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: 1.5,
                      px: 2,
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,122,255,0.1)',
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 24, color: '#007AFF' }} />
                    <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>AI picks</Typography>
                  </Box>
                ) : (
                  <StyledDropdown
                    options={moods}
                    value={selectedMood}
                    onChange={setSelectedMood}
                    placeholder="Select mood"
                    fullWidth
                  />
                )}
              </Box>
            </Box>

            {/* Language */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Language
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                Choose the language for your lyrics
              </Typography>
              <Box sx={{  }}>
                <StyledDropdown
                  options={languages}
                  value={selectedLanguage}
                  onChange={setSelectedLanguage}
                  placeholder="Select language"
                  fullWidth
                />
              </Box>
            </Box>
          </Box>

          {/* Track Quality */}
          <Box
            sx={{
              mb: 3,
              borderRadius: '20px',
              background: 'transparent',
            }}
          >
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
            Track Quality
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, fontSize: '0.85rem' }}>
            Choose between standard or premium quality
          </Typography>
          <ToggleButtonGroup
            value={trackType}
            exclusive
            onChange={(_, value) => value && setTrackType(value)}
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
            <ToggleButton value="standard" sx={{ flexDirection: 'column', gap: 0.5, py: 2 }}>
              <MusicNoteIcon sx={{ fontSize: 28, color: trackType === 'standard' ? '#007AFF' : 'rgba(255,255,255,0.5)' }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: trackType === 'standard' ? '#fff' : 'rgba(255,255,255,0.7)' }}>Standard</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>With lyrics</Typography>
              <Typography variant="body2" sx={{ color: trackType === 'standard' ? '#5AC8FA' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>
                {songLength === 'short' ? '20' : '40'} credits
              </Typography>
            </ToggleButton>
            <ToggleButton value="premium" sx={{ flexDirection: 'column', gap: 0.5, py: 2, position: 'relative' }}>
              <Tooltip
                title={
                  <Box sx={{ p: 0.5, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.5, color: '#fff' }}>Premium Sound</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
                      Enhanced audio quality and production.
                    </Typography>
                  </Box>
                }
                arrow
                placement="top-end"
                enterTouchDelay={0}
                leaveTouchDelay={3000}
                componentsProps={{
                  tooltip: {
                    sx: {
                      background: 'linear-gradient(135deg, #5856D6 0%, #FF2D55 100%)',
                      borderRadius: '12px',
                      px: 2,
                      py: 1.5,
                      maxWidth: 200,
                      '& .MuiTooltip-arrow': {
                        color: '#5856D6',
                      },
                    },
                  },
                  popper: {
                    modifiers: [
                      {
                        name: 'preventOverflow',
                        options: {
                          padding: 16,
                          boundary: 'viewport',
                        },
                      },
                      {
                        name: 'flip',
                        options: {
                          fallbackPlacements: ['top-start', 'left', 'bottom'],
                        },
                      },
                    ],
                  },
                }}
              >
                <InfoOutlinedIcon
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#5856D6',
                    },
                  }}
                />
              </Tooltip>
              <AutoAwesomeIcon sx={{ fontSize: 28, color: trackType === 'premium' ? '#007AFF' : 'rgba(255,255,255,0.5)' }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: trackType === 'premium' ? '#fff' : 'rgba(255,255,255,0.7)' }}>Premium</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>With / Without Lyrics</Typography>
              <Typography variant="body2" sx={{ color: trackType === 'premium' ? '#5AC8FA' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>
                50 credits / 30s
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

          {/* Song Length / Duration */}
          <Box
            sx={{
              mb: 3,
            }}
          >
          {trackType === 'standard' ? (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Song Length
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2, fontSize: '0.85rem' }}>
                Choose the duration of your song
              </Typography>
              <ToggleButtonGroup
                value={songLength}
                exclusive
                onChange={(_, value) => value && setSongLength(value)}
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
                <ToggleButton value="short" sx={{ flexDirection: 'column', gap: 0.5, py: 2 }}>
                  <TimerIcon sx={{ fontSize: 28, color: songLength === 'short' ? '#007AFF' : 'rgba(255,255,255,0.5)' }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: songLength === 'short' ? '#fff' : 'rgba(255,255,255,0.7)' }}>Short</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>~30-90 seconds</Typography>
                  <Typography variant="body2" sx={{ color: songLength === 'short' ? '#5AC8FA' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>25 credits</Typography>
                </ToggleButton>
                <ToggleButton value="standard" sx={{ flexDirection: 'column', gap: 0.5, py: 2 }}>
                  <MusicNoteIcon sx={{ fontSize: 28, color: songLength === 'standard' ? '#007AFF' : 'rgba(255,255,255,0.5)' }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: songLength === 'standard' ? '#fff' : 'rgba(255,255,255,0.7)' }}>Standard</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>~1.5-3 minutes</Typography>
                  <Typography variant="body2" sx={{ color: songLength === 'standard' ? '#5AC8FA' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>50 credits</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Track Duration
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                    {songCost} x
                  </Typography>
                  <GruviCoin size={18} />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, fontSize: '0.85rem' }}>
                Slide to choose your track length
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={premiumDuration}
                  onChange={(_, value) => setPremiumDuration(value as number)}
                  step={null}
                  marks={PREMIUM_DURATION_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
                  min={30}
                  max={179}
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
              {/* Instrumental toggle */}
              <Box
                onClick={() => setForceInstrumental(!forceInstrumental)}
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: '12px',
                  border: `2px solid ${forceInstrumental ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                  background: forceInstrumental ? 'rgba(0,122,255,0.1)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: forceInstrumental ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
                    Instrumental only
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                    No vocals, perfect for background music
                  </Typography>
                </Box>
                <Box sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '6px',
                  border: `2px solid ${forceInstrumental ? '#007AFF' : 'rgba(255,255,255,0.2)'}`,
                  background: forceInstrumental ? '#007AFF' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  {forceInstrumental && <CheckIcon sx={{ fontSize: 16, color: '#fff' }} />}
                </Box>
              </Box>
            </>
          )}
        </Box>

          {/* Summary & Generate - shown inside Paper on xs/sm/md */}
          <Box sx={{ display: { xs: 'block', lg: 'none' }, mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Summary header */}
            <Typography variant="subtitle2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', mb: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
              Summary
            </Typography>

            {/* Compact chip-style summary */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
              {/* Genre chip */}
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
                {autoPickGenre ? (
                  <>
                    <AutoAwesomeIcon sx={{ fontSize: 16, color: '#007AFF' }} />
                    <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>AI Genre</Typography>
                  </>
                ) : (
                  <>
                    <Box
                      component="img"
                      src={genres.find(g => g.id === selectedGenre)?.image}
                      sx={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                      {genres.find(g => g.id === selectedGenre)?.label}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Mood chip */}
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
                {autoPickMood ? (
                  <>
                    <AutoAwesomeIcon sx={{ fontSize: 16, color: '#5856D6' }} />
                    <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>AI Mood</Typography>
                  </>
                ) : (
                  <>
                    <Box
                      component="img"
                      src={moods.find(m => m.id === selectedMood)?.image}
                      sx={{ width: 18, height: 18, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                      {moods.find(m => m.id === selectedMood)?.label}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Length chip */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.75,
                borderRadius: '20px',
                background: songLength === 'short' ? 'rgba(255, 149, 0, 0.15)' : 'rgba(52, 199, 89, 0.15)',
                border: songLength === 'short' ? '1px solid rgba(255, 149, 0, 0.3)' : '1px solid rgba(52, 199, 89, 0.3)',
              }}>
                <TimerIcon sx={{ fontSize: 16, color: songLength === 'short' ? '#FF9500' : '#34C759' }} />
                <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                  {trackType === 'premium' ? `${premiumDuration}s` : (songLength === 'short' ? 'Short' : 'Standard')}
                </Typography>
              </Box>

              {/* Quality chip - only show if premium */}
              {trackType === 'premium' && (
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '20px',
                  background: 'rgba(255, 184, 0, 0.15)',
                  border: '1px solid rgba(255, 184, 0, 0.3)',
                }}>
                  <WorkspacePremiumIcon sx={{ fontSize: 16, color: '#FFB800' }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>Premium</Typography>
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
                  {songCost}
                </Typography>
                <GruviCoin size={16} />
              </Box>
            </Box>

            {/* Generate Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleGenerateSong}
                disabled={isGeneratingSong}
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
                {isGeneratingSong ? (
                  <CircularProgress size={24} sx={{ color: '#fff' }} />
                ) : (
                  'Generate Song'
                )}
              </Button>
            </Box>

            <Typography
              variant="caption"
              sx={{ textAlign: 'center', mt: 2, display: 'block', color: 'rgba(255,255,255,0.5)' }}
            >
              Generation typically takes 2-3 minutes
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
                  {songCost} x
                </Typography>
                <GruviCoin size={20} />
              </Box>
            </Box>

            {/* Summary bullets - single column */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Genre</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  {autoPickGenre ? (
                    <>
                      <AutoAwesomeIcon sx={{ fontSize: 18, color: '#007AFF' }} />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#007AFF' }}>
                        AI picks
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Box
                        component="img"
                        src={genres.find(g => g.id === selectedGenre)?.image}
                        alt={genres.find(g => g.id === selectedGenre)?.label}
                        sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                        {genres.find(g => g.id === selectedGenre)?.label}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Mood</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  {autoPickMood ? (
                    <>
                      <AutoAwesomeIcon sx={{ fontSize: 18, color: '#007AFF' }} />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#007AFF' }}>
                        AI picks
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Box
                        component="img"
                        src={moods.find(m => m.id === selectedMood)?.image}
                        alt={moods.find(m => m.id === selectedMood)?.label}
                        sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                        {moods.find(m => m.id === selectedMood)?.label}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Length</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  <TimerIcon sx={{ fontSize: 18, color: songLength === 'short' ? '#FF9500' : '#34C759' }} />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>
                    {songLength === 'short' ? '30 - 90s' : '1.5 - 3 min'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Creativity</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  <TuneIcon sx={{ fontSize: 18, flexShrink: 0, color: creativity <= 2 ? '#007AFF' : creativity <= 4 ? '#5856D6' : creativity <= 6 ? '#5856D6' : creativity <= 8 ? '#AF52DE' : '#FF2D55' }} />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                    {creativity <= 2 ? 'Robot' : creativity <= 4 ? 'Literal' : creativity <= 6 ? 'Balanced' : creativity <= 8 ? 'Creative' : 'Picasso'} ({creativity}/10)
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Language</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  <Box
                    component="img"
                    src={languages.find(l => l.id === selectedLanguage)?.image}
                    alt={languages.find(l => l.id === selectedLanguage)?.label}
                    sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                    {languages.find(l => l.id === selectedLanguage)?.label}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Track Quality</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  {trackType === 'premium' ? (
                    <>
                      <WorkspacePremiumIcon sx={{ fontSize: 18, color: '#FFB800' }} />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>
                        Premium
                      </Typography>
                    </>
                  ) : (
                    <>
                      <MusicNoteIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>
                        Standard
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Generate Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleGenerateSong}
              disabled={isGeneratingSong}
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
              {isGeneratingSong ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Generate Song'
              )}
            </Button>

            <Typography
              variant="caption"
              sx={{ textAlign: 'center', mt: 2, display: 'block', color: 'rgba(255,255,255,0.5)' }}
            >
              Generation typically takes 2-3 minutes
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Cast Picker Popover */}
      <Popover
        open={castPickerOpen}
        anchorEl={castPickerAnchor}
        onClose={() => setCastPickerAnchor(null)}
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
            },
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
            Select AI Assets
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            {selectedCastMembers.length}/{MAX_CAST_MEMBERS} selected
          </Typography>
        </Box>
        <ScrollableListWrapper maxHeight="280px">
          {characterTypeOrder.map((type) => {
            const chars = groupedCharacters[type];
            if (!chars || chars.length === 0) return null;
            const typeStyle = getCharacterTypeStyle(type);
            return (
              <Box key={type}>
                <Typography
                  sx={{
                    px: 2,
                    py: 0.75,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {typeStyle.label}
                </Typography>
                {chars.map((char) => {
                  const isSelected = selectedCharacterIds.includes(char.characterId);
                  const isDisabled = !isSelected && selectedCastMembers.length >= MAX_CAST_MEMBERS;
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
                          py: 0.5,
                          px: 2,
                          background: isSelected ? 'rgba(0,122,255,0.15)' : 'transparent',
                          '&:hover': {
                            background: isSelected ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.05)',
                          },
                          '&.Mui-disabled': {
                            opacity: 0.5,
                          },
                        }}
                      >
                        <CharacterAvatar character={char} size={28} square sx={{ mr: 1.5, flexShrink: 0 }} />
                        <ListItemText
                          primary={char.characterName}
                          secondary={char.description || type}
                          primaryTypographyProps={{
                            sx: { fontWeight: 500, color: '#fff', fontSize: '0.9rem' }
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
                        {isSelected && <CheckIcon sx={{ color: '#007AFF', fontSize: 20 }} />}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </Box>
            );
          })}
          {characters.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, fontSize: '0.85rem' }}>
                No AI assets yet
              </Typography>
              <Button
                onClick={() => {
                  setCastPickerAnchor(null);
                  navigate('/ai-assets/create');
                }}
                sx={{
                  color: '#007AFF',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Create your first character
              </Button>
            </Box>
          )}
        </ScrollableListWrapper>
      </Popover>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ borderRadius: '12px' }}>
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Upgrade Popup */}
      <UpgradePopup
        open={upgradePopupOpen}
        message={upgradePopupMessage}
        isPremiumTier={isPremiumTier}
        onClose={() => setUpgradePopupOpen(false)}
        onTopUp={handleTopUp}
        onUpgrade={handleUpgrade}
        isTopUpLoading={isTopUpLoading}
        isUpgradeLoading={isUpgradeLoading}
      />
    </Box>
  );
};

export default CreateMusicPage;
