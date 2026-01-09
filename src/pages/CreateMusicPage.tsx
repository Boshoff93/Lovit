import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  TextField,
  Paper,
  Chip,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Slider,
  IconButton,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { songsApi, charactersApi } from '../services/api';
import { getTokensFromAllowances, createCheckoutSession, setTokensRemaining } from '../store/authSlice';
import { topUpBundles, TopUpBundle } from '../config/stripe';
import UpgradePopup from '../components/UpgradePopup';
import MentionTextField from '../components/MentionTextField';
import { reportPurchaseConversion } from '../utils/googleAds';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TimerIcon from '@mui/icons-material/Timer';
import TuneIcon from '@mui/icons-material/Tune';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';

// Genre options
const genres = [
  { id: 'pop', name: 'Pop', image: '/genres/pop.jpeg' },
  { id: 'hip-hop', name: 'Hip Hop', image: '/genres/hip-hop.jpeg' },
  { id: 'rnb', name: 'R&B', image: '/genres/rnb.jpeg' },
  { id: 'electronic', name: 'Electronic', image: '/genres/electronic.jpeg' },
  { id: 'dance', name: 'Dance', image: '/genres/dance.jpeg' },
  { id: 'house', name: 'House', image: '/genres/house.jpeg' },
  { id: 'tropical-house', name: 'Tropical House', image: '/genres/chillout.jpeg' },
  { id: 'edm', name: 'EDM', image: '/genres/edm.jpeg' },
  { id: 'techno', name: 'Techno', image: '/genres/techno.jpeg' },
  { id: 'rock', name: 'Rock', image: '/genres/rock.jpeg' },
  { id: 'alternative', name: 'Alternative', image: '/genres/alternative.jpeg' },
  { id: 'indie', name: 'Indie', image: '/genres/indie.jpeg' },
  { id: 'punk', name: 'Punk', image: '/genres/punk.jpeg' },
  { id: 'metal', name: 'Metal', image: '/genres/metal.jpeg' },
  { id: 'jazz', name: 'Jazz', image: '/genres/jazz.jpeg' },
  { id: 'blues', name: 'Blues', image: '/genres/blues.jpeg' },
  { id: 'soul', name: 'Soul', image: '/genres/soul.jpeg' },
  { id: 'funk', name: 'Funk', image: '/genres/funk.jpeg' },
  { id: 'classical', name: 'Classical', image: '/genres/classic.jpeg' },
  { id: 'orchestral', name: 'Orchestral', image: '/genres/orchestral.jpeg' },
  { id: 'cinematic', name: 'Cinematic', image: '/genres/cinematic.jpeg' },
  { id: 'country', name: 'Country', image: '/genres/country.jpeg' },
  { id: 'folk', name: 'Folk', image: '/genres/folk.jpeg' },
  { id: 'acoustic', name: 'Acoustic', image: '/genres/acoustic.jpeg' },
  { id: 'latin', name: 'Latin', image: '/genres/latin.jpeg' },
  { id: 'reggaeton', name: 'Reggaeton', image: '/genres/raggaeton.jpeg' },
  { id: 'kpop', name: 'K-Pop', image: '/genres/kpop.jpeg' },
  { id: 'jpop', name: 'J-Pop', image: '/genres/jpop.jpeg' },
  { id: 'reggae', name: 'Reggae', image: '/genres/raggae.jpeg' },
  { id: 'lofi', name: 'Lo-fi', image: '/genres/lofi.jpeg' },
  { id: 'ambient', name: 'Ambient', image: '/genres/ambient.jpeg' },
  { id: 'gospel', name: 'Gospel', image: '/genres/gospels.jpeg' },
];

// Mood options
const moods = [
  { id: 'happy', name: 'Happy', image: '/moods/happy.jpeg' },
  { id: 'sad', name: 'Sad', image: '/moods/sad.jpeg' },
  { id: 'energetic', name: 'Energetic', image: '/moods/energetic.jpeg' },
  { id: 'romantic', name: 'Romantic', image: '/moods/romantic.jpeg' },
  { id: 'chill', name: 'Chill', image: '/moods/chill.jpeg' },
  { id: 'epic', name: 'Epic', image: '/moods/epic.jpeg' },
  { id: 'dreamy', name: 'Dreamy', image: '/moods/dreamy.jpeg' },
  { id: 'dark', name: 'Dark', image: '/moods/dark.jpeg' },
  { id: 'uplifting', name: 'Uplifting', image: '/moods/uplifting.jpeg' },
  { id: 'nostalgic', name: 'Nostalgic', image: '/moods/nostalgic.jpeg' },
  { id: 'peaceful', name: 'Peaceful', image: '/moods/peacful.jpeg' },
  { id: 'intense', name: 'Intense', image: '/moods/intense.jpeg' },
  { id: 'melancholic', name: 'Melancholic', image: '/moods/melancholic.jpeg' },
  { id: 'playful', name: 'Playful', image: '/moods/playful.jpeg' },
  { id: 'mysterious', name: 'Mysterious', image: '/moods/mysterious.jpeg' },
  { id: 'triumphant', name: 'Triumphant', image: '/moods/triumphant.jpeg' },
  { id: 'promotional', name: 'Promotional', image: '/moods/promotional.jpeg' },
];

// Languages
const languages = [
  { id: 'en', name: 'English', image: '/locales/en.jpeg' },
  { id: 'es', name: 'Spanish', image: '/locales/es.jpeg' },
  { id: 'fr', name: 'French', image: '/locales/fr.jpeg' },
  { id: 'de', name: 'German', image: '/locales/de.jpeg' },
  { id: 'it', name: 'Italian', image: '/locales/it.jpeg' },
  { id: 'pt', name: 'Portuguese', image: '/locales/pt.jpeg' },
  { id: 'nl', name: 'Dutch', image: '/locales/nl.jpeg' },
  { id: 'pl', name: 'Polish', image: '/locales/pl.jpeg' },
  { id: 'ro', name: 'Romanian', image: '/locales/ro.jpeg' },
  { id: 'cs', name: 'Czech', image: '/locales/cs.jpeg' },
  { id: 'el', name: 'Greek', image: '/locales/el.jpeg' },
  { id: 'bg', name: 'Bulgarian', image: '/locales/bg.jpeg' },
  { id: 'fi', name: 'Finnish', image: '/locales/fi.jpeg' },
  { id: 'uk', name: 'Ukrainian', image: '/locales/uk.jpeg' },
  { id: 'ru', name: 'Russian', image: '/locales/ru.jpeg' },
  { id: 'tr', name: 'Turkish', image: '/locales/tr.jpeg' },
  { id: 'ar', name: 'Arabic', image: '/locales/ar.jpeg' },
  { id: 'hi', name: 'Hindi', image: '/locales/hi.jpeg' },
  { id: 'th', name: 'Thai', image: '/locales/th.jpeg' },
  { id: 'vi', name: 'Vietnamese', image: '/locales/vi.jpeg' },
  { id: 'id', name: 'Indonesian', image: '/locales/id.jpeg' },
  { id: 'ja', name: 'Japanese', image: '/locales/js.jpeg' },
  { id: 'ko', name: 'Korean', image: '/locales/ko.jpeg' },
  { id: 'zh', name: 'Chinese', image: '/locales/zh.jpeg' },
];

// Character interface
interface Character {
  characterId: string;
  characterName: string;
  imageUrls?: string[];
  characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App';
  description?: string;
}

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

// Order of character types for display
const characterTypeOrder = ['Human', 'Non-Human', 'Product', 'Place', 'App'];

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

const SONG_COST = 20;

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

  // Picker states
  const [genrePickerOpen, setGenrePickerOpen] = useState(false);
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [castPickerOpen, setCastPickerOpen] = useState(false);

  // Validation
  const [showSongPromptError, setShowSongPromptError] = useState(false);

  // Characters for mentions
  const [characters, setCharacters] = useState<Character[]>([]);
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

  // Insert character into prompt
  const insertCharacter = useCallback((character: Character) => {
    const mentionText = `@${character.characterName}`;
    setSongPrompt(prev => {
      if (prev.includes(mentionText)) return prev;
      return prev ? `${prev} ${mentionText}` : mentionText;
    });
  }, []);

  // Group characters by type
  const groupedCharacters = characters.reduce((acc, char) => {
    const type = char.characterType || 'Human';
    if (!acc[type]) acc[type] = [];
    acc[type].push(char);
    return acc;
  }, {} as Record<string, Character[]>);

  // Get characters that are mentioned in the prompt (case-insensitive)
  const selectedCastMembers = characters.filter(char => {
    const mentionPattern = new RegExp(`@${char.characterName}\\b`, 'i');
    return mentionPattern.test(songPrompt);
  });

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
    if (!songPrompt.trim()) {
      setShowSongPromptError(true);
      setNotification({
        open: true,
        message: 'Please enter a song prompt',
        severity: 'error'
      });
      return;
    }

    if (!hasEnoughTokens(SONG_COST)) {
      setUpgradePopupMessage(`You need ${SONG_COST} tokens to generate a song. You have ${remainingTokens} tokens remaining.`);
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
        songPrompt: songPrompt,
        genre: autoPickGenre ? 'auto' : selectedGenre,
        mood: autoPickMood ? 'auto' : selectedMood,
        language: selectedLanguage,
        songLength,
        creativity,
        characterIds: characterIds.length > 0 ? characterIds : undefined,
      });

      // Update tokens - setTokensRemaining expects remaining tokens count
      dispatch(setTokensRemaining(remainingTokens - SONG_COST));

      setNotification({
        open: true,
        message: 'Song generation started! Redirecting to your tracks...',
        severity: 'success'
      });

      setTimeout(() => {
        navigate('/tracks');
      }, 1500);
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
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 },width: '100%', minWidth: 0, display: "flex", flexDirection: "column", mx: 'auto'}}>
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
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
              Create Music
            </Typography>
            <Typography sx={{ color: '#86868B' }}>
              Generate AI-powered music with custom lyrics
            </Typography>
          </Box>
        </Box>

        {/* View My Music button */}
        <Button
          variant="contained"
          onClick={() => navigate('/my-music')}
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
          View My Music
        </Button>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: "column", lg: "row" }, gap: 3, width: '100%', minWidth: 0 }}>
        {/* Left Column - Settings */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Song Prompt */}
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
                Song Prompt
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

          {/* Cast Selection */}
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: '#86868B', fontSize: '0.8rem', mb: 1 }}>
              Add characters to your song (max {MAX_CAST_MEMBERS}):
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              {/* Dropdown button */}
              <Button
                onClick={() => setCastPickerOpen(true)}
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedCastMembers.length === 0 ? (
                    <PersonIcon sx={{ fontSize: 20, color: '#86868B' }} />
                  ) : (
                    <Box sx={{ display: 'flex', ml: -0.5 }}>
                      {selectedCastMembers.slice(0, 3).map((char, idx) => (
                        <Avatar
                          key={char.characterId}
                          src={char.imageUrls?.[0] || getCharacterTypeImage(char.characterType)}
                          sx={{
                            width: 24,
                            height: 24,
                            border: '2px solid #fff',
                            ml: idx > 0 ? -1 : 0,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  <span>
                    {selectedCastMembers.length === 0
                      ? 'Select Cast Members'
                      : `${selectedCastMembers.length} selected`}
                  </span>
                </Box>
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
            {selectedCastMembers.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                {selectedCastMembers.map((char) => (
                  <Chip
                    key={char.characterId}
                    label={char.characterName}
                    onDelete={() => {
                      // Remove from prompt (case-insensitive)
                      const mentionPattern = new RegExp(`@${char.characterName}\\b`, 'gi');
                      setSongPrompt(prev => prev.replace(mentionPattern, '').replace(/\s+/g, ' ').trim());
                    }}
                    avatar={
                      <Avatar
                        src={char.imageUrls?.[0] || getCharacterTypeImage(char.characterType)}
                        alt={char.characterName}
                        sx={{ width: 24, height: 24 }}
                      />
                    }
                    sx={{
                      background: 'rgba(0,122,255,0.1)',
                      border: '1.5px solid #007AFF',
                      fontWeight: 500,
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

          <MentionTextField
            value={songPrompt}
            onChange={(value) => {
              setSongPrompt(value);
              if (value.trim()) setShowSongPromptError(false);
            }}
            characterNames={characters.map(c => c.characterName)}
            placeholder="e.g., A nostalgic summer love song about meeting @Luna at the beach"
            rows={4}
            error={showSongPromptError && !songPrompt.trim()}
            helperText={showSongPromptError && !songPrompt.trim() ? 'Please enter a song prompt' : ''}
            onEnhance={handleEnhancePrompt}
            isEnhancing={isEnhancingPrompt}
          />

          {/* Creativity Slider - inside Song Prompt */}
          <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#86868B' }}>
                  Prompt adherence
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#007AFF', fontWeight: 600 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Genre
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', fontSize: '0.85rem' }}>
                Select a genre for your song
              </Typography>
            </Box>
            <IconButton
              onClick={() => setAutoPickGenre(!autoPickGenre)}
              size="small"
              sx={{
                background: autoPickGenre ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' : 'transparent',
                border: '1.5px solid #007AFF',
                borderColor: autoPickGenre ? 'transparent' : '#007AFF',
                borderRadius: '20px',
                px: 1.5,
                py: 0.5,
                gap: 0.5,
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                  borderColor: 'transparent',
                  '& .auto-icon, & .auto-text': {
                    color: '#fff',
                  },
                },
              }}
            >
              <AutoAwesomeIcon className="auto-icon" sx={{ fontSize: 14, color: autoPickGenre ? '#fff' : '#007AFF', transition: 'color 0.2s ease' }} />
              <Box
                component="span"
                className="auto-text"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: autoPickGenre ? '#fff' : '#007AFF',
                  transition: 'color 0.2s ease',
                }}
              >
                Auto
              </Box>
            </IconButton>
          </Box>
          <Button
            onClick={() => !autoPickGenre && setGenrePickerOpen(true)}
            disabled={autoPickGenre}
            fullWidth
            sx={{
              justifyContent: 'space-between',
              textTransform: 'none',
              py: 1.5,
              px: 2,
              mt: 1,
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.1)',
              background: autoPickGenre ? 'rgba(0,122,255,0.05)' : '#fff',
              color: autoPickGenre ? '#007AFF' : '#1D1D1F',
              fontWeight: 500,
              '&:hover': { background: autoPickGenre ? 'rgba(0,122,255,0.05)' : 'rgba(0,122,255,0.05)' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {autoPickGenre ? (
                <>
                  <AutoAwesomeIcon sx={{ fontSize: 22 }} />
                  <span>AI picks best genre</span>
                </>
              ) : (
                <>
                  <Box
                    component="img"
                    src={genres.find(g => g.id === selectedGenre)?.image}
                    alt={genres.find(g => g.id === selectedGenre)?.name}
                    sx={{ width: 28, height: 28, borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <span>{genres.find(g => g.id === selectedGenre)?.name}</span>
                </>
              )}
            </Box>
            {!autoPickGenre && <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />}
          </Button>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Mood
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', fontSize: '0.85rem' }}>
                What mood should the song have?
              </Typography>
            </Box>
            <IconButton
              onClick={() => setAutoPickMood(!autoPickMood)}
              size="small"
              sx={{
                background: autoPickMood ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' : 'transparent',
                border: '1.5px solid #007AFF',
                borderColor: autoPickMood ? 'transparent' : '#007AFF',
                borderRadius: '20px',
                px: 1.5,
                py: 0.5,
                gap: 0.5,
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                  borderColor: 'transparent',
                  '& .auto-icon-mood, & .auto-text-mood': {
                    color: '#fff',
                  },
                },
              }}
            >
              <AutoAwesomeIcon className="auto-icon-mood" sx={{ fontSize: 14, color: autoPickMood ? '#fff' : '#007AFF', transition: 'color 0.2s ease' }} />
              <Box
                component="span"
                className="auto-text-mood"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: autoPickMood ? '#fff' : '#007AFF',
                  transition: 'color 0.2s ease',
                }}
              >
                Auto
              </Box>
            </IconButton>
          </Box>
          <Button
            onClick={() => !autoPickMood && setMoodPickerOpen(true)}
            disabled={autoPickMood}
            fullWidth
            sx={{
              justifyContent: 'space-between',
              textTransform: 'none',
              py: 1.5,
              px: 2,
              mt: 1,
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.1)',
              background: autoPickMood ? 'rgba(0,122,255,0.05)' : '#fff',
              color: autoPickMood ? '#007AFF' : '#1D1D1F',
              fontWeight: 500,
              '&:hover': { background: autoPickMood ? 'rgba(0,122,255,0.05)' : 'rgba(0,122,255,0.05)' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {autoPickMood ? (
                <>
                  <AutoAwesomeIcon sx={{ fontSize: 22 }} />
                  <span>AI picks best mood</span>
                </>
              ) : (
                <>
                  <Box
                    component="img"
                    src={moods.find(m => m.id === selectedMood)?.image}
                    alt={moods.find(m => m.id === selectedMood)?.name}
                    sx={{ width: 28, height: 28, borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <span>{moods.find(m => m.id === selectedMood)?.name}</span>
                </>
              )}
            </Box>
            {!autoPickMood && <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />}
          </Button>
        </Paper>

          {/* Song Length */}
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
            Song Length
          </Typography>
          <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
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
                border: '2px solid rgba(0,0,0,0.08) !important',
                background: 'rgba(0,0,0,0.03)',
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(0,0,0,0.06)',
                },
                '&.Mui-selected': {
                  background: 'rgba(0,122,255,0.08)',
                  border: '2px solid #007AFF !important',
                  '&:hover': { background: 'rgba(0,122,255,0.12)' },
                },
              },
            }}
          >
            <ToggleButton value="short" sx={{ flexDirection: 'column', gap: 0.5, py: 1.5 }}>
              <TimerIcon sx={{ fontSize: 24, color: songLength === 'short' ? '#007AFF' : '#86868B' }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: songLength === 'short' ? '#007AFF' : '#1D1D1F' }}>Short</Typography>
              <Typography variant="body2" sx={{ color: '#86868B', fontSize: '0.65rem' }}>~30-90 seconds</Typography>
            </ToggleButton>
            <ToggleButton value="standard" sx={{ flexDirection: 'column', gap: 0.5, py: 1.5 }}>
              <MusicNoteIcon sx={{ fontSize: 24, color: songLength === 'standard' ? '#007AFF' : '#86868B' }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: songLength === 'standard' ? '#007AFF' : '#1D1D1F' }}>Standard</Typography>
              <Typography variant="body2" sx={{ color: '#86868B', fontSize: '0.65rem' }}>~1.5-3 minutes</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>

          {/* Language Selection */}
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
            Language
          </Typography>
          <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
            Select the language for your song
          </Typography>
          <Button
            onClick={() => setLanguagePickerOpen(true)}
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
                src={languages.find(l => l.id === selectedLanguage)?.image}
                alt={languages.find(l => l.id === selectedLanguage)?.name}
                sx={{ width: 28, height: 28, borderRadius: '6px', objectFit: 'cover' }}
              />
              <span>{languages.find(l => l.id === selectedLanguage)?.name}</span>
            </Box>
            <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />
          </Button>
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
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Genre</Typography>
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
                        alt={genres.find(g => g.id === selectedGenre)?.name}
                        sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {genres.find(g => g.id === selectedGenre)?.name}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Mood</Typography>
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
                        alt={moods.find(m => m.id === selectedMood)?.name}
                        sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {moods.find(m => m.id === selectedMood)?.name}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Length</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  <TimerIcon sx={{ fontSize: 18, color: songLength === 'short' ? '#FF9500' : '#34C759' }} />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {songLength === 'short' ? '30 - 90s' : '1.5 - 3 min'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Creativity</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  <TuneIcon sx={{ fontSize: 18, color: creativity <= 2 ? '#007AFF' : creativity <= 4 ? '#5856D6' : creativity <= 6 ? '#5856D6' : creativity <= 8 ? '#AF52DE' : '#FF2D55' }} />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {creativity <= 2 ? 'Robot' : creativity <= 4 ? 'Literal' : creativity <= 6 ? 'Balanced' : creativity <= 8 ? 'Creative' : 'Picasso'} ({creativity}/10)
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Language</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  <Box
                    component="img"
                    src={languages.find(l => l.id === selectedLanguage)?.image}
                    alt={languages.find(l => l.id === selectedLanguage)?.name}
                    sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {languages.find(l => l.id === selectedLanguage)?.name}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(88,86,214,0.1) 100%)', mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>Total Tokens</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {SONG_COST}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
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
                '&.Mui-disabled': { background: 'rgba(0,0,0,0.1)' },
              }}
            >
              {isGeneratingSong ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                <>
                  <MusicNoteIcon sx={{ mr: 1 }} />
                  Generate Song
                </>
              )}
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* Genre Picker Drawer */}
      <Drawer
        anchor="bottom"
        open={genrePickerOpen}
        onClose={() => setGenrePickerOpen(false)}
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
            Select Genre
          </Typography>
        </Box>
        <ScrollableListWrapper>
          {genres.map((genre) => (
            <ListItem key={genre.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  setSelectedGenre(genre.id);
                  setGenrePickerOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  mb: 0.5,
                  py: 1.5,
                  background: selectedGenre === genre.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                  border: selectedGenre === genre.id ? '2px solid #007AFF' : '2px solid transparent',
                }}
              >
                <Box
                  component="img"
                  src={genre.image}
                  alt={genre.name}
                  sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', mr: 2 }}
                />
                <ListItemText primary={genre.name} primaryTypographyProps={{ fontWeight: 600 }} />
                {selectedGenre === genre.id && <CheckIcon sx={{ color: '#007AFF' }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </ScrollableListWrapper>
        <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setGenrePickerOpen(false)}
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

      {/* Mood Picker Drawer */}
      <Drawer
        anchor="bottom"
        open={moodPickerOpen}
        onClose={() => setMoodPickerOpen(false)}
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
            Select Mood
          </Typography>
        </Box>
        <ScrollableListWrapper>
          {moods.map((mood) => (
            <ListItem key={mood.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  setSelectedMood(mood.id);
                  setMoodPickerOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  mb: 0.5,
                  py: 1.5,
                  background: selectedMood === mood.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                  border: selectedMood === mood.id ? '2px solid #007AFF' : '2px solid transparent',
                }}
              >
                <Box
                  component="img"
                  src={mood.image}
                  alt={mood.name}
                  sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', mr: 2 }}
                />
                <ListItemText primary={mood.name} primaryTypographyProps={{ fontWeight: 600 }} />
                {selectedMood === mood.id && <CheckIcon sx={{ color: '#007AFF' }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </ScrollableListWrapper>
        <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setMoodPickerOpen(false)}
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

      {/* Language Picker Drawer */}
      <Drawer
        anchor="bottom"
        open={languagePickerOpen}
        onClose={() => setLanguagePickerOpen(false)}
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
            Select Language
          </Typography>
        </Box>
        <ScrollableListWrapper>
          {languages.map((language) => (
            <ListItem key={language.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  setSelectedLanguage(language.id);
                  setLanguagePickerOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  mb: 0.5,
                  py: 1.5,
                  background: selectedLanguage === language.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                  border: selectedLanguage === language.id ? '2px solid #007AFF' : '2px solid transparent',
                }}
              >
                <Box
                  component="img"
                  src={language.image}
                  alt={language.name}
                  sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', mr: 2 }}
                />
                <ListItemText primary={language.name} primaryTypographyProps={{ fontWeight: 600 }} />
                {selectedLanguage === language.id && <CheckIcon sx={{ color: '#007AFF' }} />}
              </ListItemButton>
            </ListItem>
          ))}
        </ScrollableListWrapper>
        <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setLanguagePickerOpen(false)}
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
            Select Cast Members
          </Typography>
          <Typography variant="caption" sx={{ color: '#86868B' }}>
            {selectedCastMembers.length}/{MAX_CAST_MEMBERS} selected
          </Typography>
        </Box>
        <ScrollableListWrapper>
          {characterTypeOrder.map((type) => {
            const chars = groupedCharacters[type];
            if (!chars || chars.length === 0) return null;
            return (
              <Box key={type} sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#86868B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {type === 'Non-Human' ? 'Non-Humans' : type === 'Place' ? 'Places / Businesses' : type + 's'}
                </Typography>
                {chars.map((char) => {
                  const mentionPattern = new RegExp(`@${char.characterName}\\b`, 'i');
                  const isSelected = mentionPattern.test(songPrompt);
                  const isDisabled = !isSelected && selectedCastMembers.length >= MAX_CAST_MEMBERS;
                  return (
                    <ListItem key={char.characterId} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          if (isSelected) {
                            // Remove from prompt (case-insensitive)
                            const removePattern = new RegExp(`@${char.characterName}\\b`, 'gi');
                            setSongPrompt(prev => prev.replace(removePattern, '').replace(/\s+/g, ' ').trim());
                          } else if (!isDisabled) {
                            // Add to prompt
                            insertCharacter(char);
                          }
                        }}
                        disabled={isDisabled}
                        sx={{
                          borderRadius: '12px',
                          mb: 0.5,
                          mx: 1,
                          py: 1.5,
                          background: isSelected ? 'rgba(0,122,255,0.1)' : 'transparent',
                          border: isSelected ? '2px solid #007AFF' : '2px solid transparent',
                          '&.Mui-disabled': {
                            opacity: 0.5,
                          },
                        }}
                      >
                        <Avatar
                          src={char.imageUrls?.[0] || getCharacterTypeImage(char.characterType)}
                          alt={char.characterName}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <ListItemText
                          primary={char.characterName}
                          secondary={char.description?.slice(0, 50) || ''}
                          slotProps={{
                            primary: { fontWeight: 600 },
                            secondary: { fontSize: '0.75rem', color: '#86868B' }
                          }}
                        />
                        {isSelected && <CheckIcon sx={{ color: '#007AFF' }} />}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </Box>
            );
          })}
          {characters.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography sx={{ color: '#86868B', mb: 2 }}>
                No cast members yet
              </Typography>
              <Button
                onClick={() => {
                  setCastPickerOpen(false);
                  navigate('/my-cast/create');
                }}
                sx={{
                  color: '#007AFF',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Create your first character
              </Button>
            </Box>
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
