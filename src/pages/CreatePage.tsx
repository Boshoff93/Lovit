import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Snackbar,
  Alert,
  TextField,
  IconButton,
  Paper,
  Chip,
  CircularProgress,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Tooltip,
  Slider,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { songsApi, videosApi, charactersApi } from '../services/api';
import { getTokensFromAllowances, createCheckoutSession, updateTokensUsed } from '../store/authSlice';
import { stripeConfig } from '../config/stripe';
import UpgradePopup from '../components/UpgradePopup';
import MentionTextField from '../components/MentionTextField';
import { reportPurchaseConversion } from '../utils/googleAds';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PaletteIcon from '@mui/icons-material/Palette';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import BoltIcon from '@mui/icons-material/Bolt';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TvIcon from '@mui/icons-material/Tv';

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
      // Show top gradient only when scrolled down
      setShowTopGradient(scrollTop > 10);
      // Show bottom gradient only when there's more content below
      setShowBottomGradient(scrollTop + clientHeight < scrollHeight - 10);
    }
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      // Check initial scroll state
      handleScroll();
      list.addEventListener('scroll', handleScroll);
      return () => list.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
      {/* Top fade gradient - only visible when scrolled */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: 48, 
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0) 100%)',
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
      {/* Bottom fade gradient - only visible when more content below */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: 48, 
        background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showBottomGradient ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />
    </Box>
  );
};

// Genre options from HomePage
const genres = [
  { id: 'pop', name: 'Pop', image: '/genres/pop.jpeg' },
  { id: 'hip-hop', name: 'Hip Hop', image: '/genres/hip-hop.jpeg' },
  { id: 'rnb', name: 'R&B', image: '/genres/rnb.jpeg' },
  { id: 'electronic', name: 'Electronic', image: '/genres/electronic.jpeg' },
  { id: 'dance', name: 'Dance', image: '/genres/dance.jpeg' },
  { id: 'house', name: 'House', image: '/genres/house.jpeg' },
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
{ id: 'chillout', name: 'Chill', image: '/genres/chillout.jpeg' },
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

// Art styles - IDs must match backend STYLE_DESCRIPTIONS keys in gruvi-prompts.ts
const artStyles = [
  { id: '3d-cartoon', label: '3D Cartoon', image: '/art_styles/boy_cartoon.jpeg' },
  { id: 'claymation', label: 'Claymation', image: '/art_styles/boy_claymation.jpeg' },
  { id: 'childrens-storybook', label: 'Storybook', image: '/art_styles/boy_storybook.jpeg' },
  { id: 'photo-realism', label: 'Realistic', image: '/art_styles/boy_real.jpeg' },
  { id: 'comic-book', label: 'Comic Book', image: '/art_styles/boy_comic.jpeg' },
  { id: 'classic-blocks', label: 'Classic Blocks', image: '/art_styles/boy_lego.jpeg' },
  { id: 'anime', label: 'Anime', image: '/art_styles/boy_anime.jpeg' },
  { id: 'spray-paint', label: 'Spray Paint', image: '/art_styles/boy_spray_paint.jpeg' },
  { id: 'playground-crayon', label: 'Crayon', image: '/art_styles/boy_crayon.jpeg' },
  { id: 'wool-knit', label: 'Cozy Woolknit', image: '/art_styles/boy_woolknit.jpeg' },
  { id: 'watercolor', label: 'Watercolor', image: '/art_styles/boy_watercolor.jpeg' },
  { id: 'pixel', label: 'Pixel Art', image: '/art_styles/boy_pixel.jpeg' },
  { id: 'sugarpop', label: 'Sugarpop', image: '/art_styles/boy_sugerpop.jpeg' },
  { id: 'origami', label: 'Origami', image: '/art_styles/boy_origami.jpeg' },
  { id: 'sketch', label: 'B&W Sketch', image: '/art_styles/boy_sketch.jpeg' },
  { id: 'classic-blocks', label: 'Minecraft', image: '/art_styles/boy_mincraft.jpeg' },
];

// Video types and quality options
// Token costs: Still = 40, Cinematic = 200
const videoTypes = [
  { 
    id: 'still', 
    label: 'Still', 
    credits: 40, 
    description: 'Beautifully composed scenes',
    tooltip: 'Stunning AI-generated visuals with cinematic transitions, perfectly synced to your music.',
    icon: ImageIcon,
  },
  { 
    id: 'standard', 
    label: 'Cinematic', 
    credits: 200, 
    description: 'Motion picture quality',
    tooltip: 'Premium AI-powered motion brings your music video to life with fluid, cinematic animations.',
    icon: MovieIcon,
  },
];




// Character interface
interface Character {
  characterId: string;
  characterName: string;
  imageUrls?: string[];
}

// Song interface for video creation
interface Song {
  songId: string;
  songTitle: string;
  genre: string;
  status: string;
  audioUrl?: string;
}

const MAX_CHARACTER_IMAGES = 5;

type TabType = 'song' | 'video';

const CreatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const initialTab = (searchParams.get('tab') as TabType) || 'song';
  const songIdFromUrl = searchParams.get('song');
  
  // Get user and allowances from Redux store
  const { user, allowances, subscription } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  
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
  
  // Token costs
  const SONG_COST = 20;
  const VIDEO_COSTS: Record<string, number> = {
    'still': 40,
    'standard': 200,
  };
  
  // Check if user has enough tokens
  const hasEnoughTokens = (cost: number) => remainingTokens >= cost;
  
  // Handle upgrade popup actions
  const handleTopUp = useCallback(async () => {
    try {
      setIsTopUpLoading(true);
      await reportPurchaseConversion();
      
      const resultAction = await dispatch(createCheckoutSession({ 
        priceId: stripeConfig.topUp.priceId,
        productId: stripeConfig.topUp.productId
      }));
      
      if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
        window.location.href = resultAction.payload.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsTopUpLoading(false);
    }
  }, [dispatch]);
  
  const handleUpgrade = useCallback(() => {
    setIsUpgradeLoading(true);
    navigate('/payment');
  }, [navigate]);
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  
  // Song creation state
  const [songPrompt, setSongPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [selectedMood, setSelectedMood] = useState('happy');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [creativity, setCreativity] = useState(5); // 0-10 scale: 0 = literal, 10 = creative
  const [genrePickerOpen, setGenrePickerOpen] = useState(false);
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);
  
  // Video creation state
  const [selectedSong, setSelectedSong] = useState(songIdFromUrl || '');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('3d-cartoon');
  const [videoType, setVideoType] = useState('still'); // 'still', 'casual', or 'creator'
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('portrait');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  
  // Action sheet state
  const [songPickerOpen, setSongPickerOpen] = useState(false);
  const [stylePickerOpen, setStylePickerOpen] = useState(false);
  
  // Validation error state (only show after user tries to submit)
  const [showSongPromptError, setShowSongPromptError] = useState(false);
  const [showVideoPromptError, setShowVideoPromptError] = useState(false);
  const [showSongSelectionError, setShowSongSelectionError] = useState(false);
  
  
  // Character creation state
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [characterKind, setCharacterKind] = useState('Human');
  const [characterGender, setCharacterGender] = useState('Male');
  const [characterAge, setCharacterAge] = useState('Child');
  const [characterHairColor, setCharacterHairColor] = useState('Dark Brown');
  const [characterHairLength, setCharacterHairLength] = useState('Medium');
  const [characterEyeColor, setCharacterEyeColor] = useState('Brown');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const [showCharacterNameError, setShowCharacterNameError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Action sheet states for character options
  const [agePickerOpen, setAgePickerOpen] = useState(false);
  const [hairColorPickerOpen, setHairColorPickerOpen] = useState(false);
  const [hairLengthPickerOpen, setHairLengthPickerOpen] = useState(false);
  const [eyeColorPickerOpen, setEyeColorPickerOpen] = useState(false);
  
  // Fetched data
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [songSearchResults, setSongSearchResults] = useState<Song[]>([]);
  const [isSearchingSongs, setIsSearchingSongs] = useState(false);
  const songSearchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [songsPage, setSongsPage] = useState(1);
  const [hasMoreSongs, setHasMoreSongs] = useState(true);
  const [isLoadingMoreSongs, setIsLoadingMoreSongs] = useState(false);
  
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['song', 'video'].includes(tab)) {
      setActiveTab(tab);
    }
    const song = searchParams.get('song');
    if (song) {
      setSelectedSong(song);
    } else {
      // Clear selected song if no song param in URL (e.g., navigating to /create?tab=video directly)
      setSelectedSong('');
    }
    // Initialize song prompt from URL parameter
    const promptFromUrl = searchParams.get('prompt');
    if (promptFromUrl) {
      setSongPrompt(promptFromUrl);
    }
  }, [searchParams]);

  // Fetch user's characters and songs
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!user?.userId) return;
      
      setIsLoadingCharacters(true);
      try {
        const response = await charactersApi.getUserCharacters(user.userId);
        setCharacters(response.data.characters || []);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setIsLoadingCharacters(false);
      }
    };
    
    const fetchSongs = async () => {
      if (!user?.userId) return;
      
      setIsLoadingSongs(true);
      setSongsPage(1);
      try {
        // Fetch recent songs for recommendations (limit 20)
        const response = await songsApi.getUserSongs(user.userId, { page: 1, limit: 20 });
        // Only show completed songs
        const completedSongs = (response.data.songs || [])
          .filter((s: Song) => s.status === 'completed');
        setSongs(completedSongs);
        
        // Check if there are more songs
        const pagination = response.data.pagination;
        setHasMoreSongs(pagination?.hasNextPage ?? completedSongs.length >= 20);
        
        // If a song is pre-selected (from URL) but not in the list, fetch it separately
        const preSelectedSong = searchParams.get('song');
        if (preSelectedSong && !completedSongs.find((s: Song) => s.songId === preSelectedSong)) {
          try {
            const singleSongResponse = await songsApi.getSongsByIds(user.userId, [preSelectedSong]);
            const fetchedSong = singleSongResponse.data?.songs?.[0];
            if (fetchedSong && fetchedSong.status === 'completed') {
              // Add to beginning, but ensure no duplicates
              setSongs(prev => {
                const filtered = prev.filter(s => s.songId !== fetchedSong.songId);
                return [fetchedSong, ...filtered];
              });
            }
          } catch (err) {
            console.warn('Could not fetch pre-selected song:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setIsLoadingSongs(false);
      }
    };
    
    fetchCharacters();
    fetchSongs();
  }, [user?.userId, searchParams]);

  // Server-side song search with debounce
  useEffect(() => {
    if (!user?.userId) return;
    
    // Clear previous debounce
    if (songSearchDebounceRef.current) {
      clearTimeout(songSearchDebounceRef.current);
    }
    
    if (!songSearchQuery.trim()) {
      setSongSearchResults([]);
      setIsSearchingSongs(false);
      return;
    }
    
    // Debounce search
    songSearchDebounceRef.current = setTimeout(async () => {
      setIsSearchingSongs(true);
      try {
        const response = await songsApi.getUserSongs(user.userId, { 
          search: songSearchQuery.trim(),
          limit: 20 
        });
        const results = (response.data.songs || []).filter((s: Song) => s.status === 'completed');
        setSongSearchResults(results);
      } catch (error) {
        console.error('Error searching songs:', error);
        setSongSearchResults([]);
      } finally {
        setIsSearchingSongs(false);
      }
    }, 300);
    
    return () => {
      if (songSearchDebounceRef.current) {
        clearTimeout(songSearchDebounceRef.current);
      }
    };
  }, [songSearchQuery, user?.userId]);

  // Load more songs for pagination
  const loadMoreSongs = useCallback(async () => {
    if (!user?.userId || isLoadingMoreSongs || !hasMoreSongs) return;
    
    setIsLoadingMoreSongs(true);
    const nextPage = songsPage + 1;
    
    try {
      const response = await songsApi.getUserSongs(user.userId, { page: nextPage, limit: 20 });
      const newSongs = (response.data.songs || []).filter((s: Song) => s.status === 'completed');
      
      setSongs(prev => {
        // Avoid duplicates
        const existingIds = new Set(prev.map(s => s.songId));
        const uniqueNewSongs = newSongs.filter((s: Song) => !existingIds.has(s.songId));
        return [...prev, ...uniqueNewSongs];
      });
      
      setSongsPage(nextPage);
      const pagination = response.data.pagination;
      setHasMoreSongs(pagination?.hasNextPage ?? newSongs.length >= 20);
    } catch (error) {
      console.error('Error loading more songs:', error);
    } finally {
      setIsLoadingMoreSongs(false);
    }
  }, [user?.userId, songsPage, isLoadingMoreSongs, hasMoreSongs]);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const handleTabChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTab: TabType | null
  ) => {
    if (newTab !== null) {
      setActiveTab(newTab);
      navigate(`/create?tab=${newTab}`, { replace: true });
    }
  };

  const insertCharacter = (name: string) => {
    if (activeTab === 'song') {
      setSongPrompt(prev => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} @${name} ` : `@${name} `;
      });
    } else if (activeTab === 'video') {
      setVideoPrompt(prev => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} @${name} ` : `@${name} `;
      });
    }
  };

  // Extract unique character IDs from text with @mentions
  // Matches @Name or @"Multi Word Name" patterns
  const getTaggedCharacterIds = (text: string): string[] => {
    const ids: string[] = [];
    
    // For each character, check if their name appears after an @ in the text
    // This handles multi-word names like "Dior Sauvage"
    for (const char of characters) {
      const charName = char.characterName;
      // Check for @CharacterName (case insensitive) followed by word boundary or end
      const regex = new RegExp(`@${charName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$|[^\\w])`, 'i');
      if (regex.test(text)) {
        if (!ids.includes(char.characterId)) {
          ids.push(char.characterId);
        }
      }
    }
    
    return ids;
  };

  // Song generation handler
  const handleGenerateSong = async () => {
    if (!songPrompt.trim()) {
      setShowSongPromptError(true);
      return;
    }
    
    if (!user?.userId) {
      setNotification({
        open: true,
        message: 'Please log in to generate songs.',
        severity: 'error'
      });
      return;
    }
    
    // Check if user has enough tokens
    if (!hasEnoughTokens(SONG_COST)) {
      setUpgradePopupMessage(`You need ${SONG_COST} tokens to generate a song. You have ${remainingTokens} tokens remaining.`);
      setUpgradePopupOpen(true);
      return;
    }
    
    setIsGeneratingSong(true);
    try {
      // Extract tagged character IDs from prompt
      const characterIds = getTaggedCharacterIds(songPrompt);
      
      // Call the async song generation API (returns immediately with pending status)
      const response = await songsApi.generateSong({
        userId: user.userId,
        songPrompt: songPrompt.trim(),
        genre: selectedGenre,
        mood: selectedMood,
        language: selectedLanguage,
        characterIds: characterIds.length > 0 ? characterIds : undefined,
        creativity,
      });
      
      console.log('Song generation started:', response.data);
      
      // Update local token count immediately so UI reflects the spend
      dispatch(updateTokensUsed(SONG_COST));
      
      // Clear form
      setSongPrompt('');
      setShowSongPromptError(false);
      
      // Navigate immediately to library - song will appear in loading state
      navigate('/dashboard?tab=songs&generating=true');
    } catch (error: any) {
      console.error('Song generation error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to generate song. Please try again.';
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsGeneratingSong(false);
    }
  };

  // Video generation handler
  const handleGenerateVideo = async () => {
    let hasError = false;
    if (!selectedSong) {
      setShowSongSelectionError(true);
      hasError = true;
    }
    if (!videoPrompt.trim()) {
      setShowVideoPromptError(true);
      hasError = true;
    }
    if (hasError) return;
    
    if (!user?.userId) {
      setNotification({
        open: true,
        message: 'Please log in to generate videos.',
        severity: 'error'
      });
      return;
    }
    
    // Check if user has enough tokens for the selected video type
    const videoCost = VIDEO_COSTS[videoType] || 40;
    if (!hasEnoughTokens(videoCost)) {
      setUpgradePopupMessage(`You need ${videoCost} tokens to generate a ${videoType} video. You have ${remainingTokens} tokens remaining.`);
      setUpgradePopupOpen(true);
      return;
    }
    
    setIsGeneratingVideo(true);
    try {
      // Extract tagged character IDs from prompt
      const characterIds = getTaggedCharacterIds(videoPrompt);
      
      // Call the actual video generation API
      const response = await videosApi.generateVideo({
        userId: user.userId,
        songId: selectedSong,
        videoType: videoType as 'still' | 'standard',
        style: selectedStyle,
        videoPrompt: videoPrompt.trim(),
        aspectRatio,
        characterIds: characterIds.length > 0 ? characterIds : undefined,
      });
      
      console.log('Video generation response:', response.data);
      
      // Update local token count immediately so UI reflects the spend
      const videoCostToDeduct = VIDEO_COSTS[videoType] || 40;
      dispatch(updateTokensUsed(videoCostToDeduct));
      
      setNotification({
        open: true,
        message: 'Music video generation started! Check your library.',
        severity: 'success'
      });
      setVideoPrompt('');
      setShowVideoPromptError(false);
      setShowSongSelectionError(false);
      
      // Navigate to Music Videos tab after a short delay
      setTimeout(() => navigate('/dashboard?tab=videos'), 1500);
    } catch (error: any) {
      console.error('Video generation error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to generate video. Please try again.';
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Character creation handler
  const handleCreateCharacter = async () => {
    if (!characterName.trim()) {
      setShowCharacterNameError(true);
      setNotification({
        open: true,
        message: 'Please enter a character name',
        severity: 'error'
      });
      return;
    }

    // Reference images are optional - removed the check

    if (!user?.userId) {
      setNotification({
        open: true,
        message: 'Please log in to create characters.',
        severity: 'error'
      });
      return;
    }

    setIsCreatingCharacter(true);
    try {
      // Convert uploaded images to base64
      const imageBase64Array: string[] = await Promise.all(
        uploadedImages.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      // Build description from character attributes
      const fullDescription = [
        characterDescription,
        `${characterKind}, ${characterGender}, ${characterAge}`,
        `Hair: ${characterHairColor}, ${characterHairLength}`,
        `Eyes: ${characterEyeColor}`,
      ].filter(Boolean).join('. ');

      // Call the actual character creation API
      const response = await charactersApi.createCharacter({
        userId: user.userId,
        characterName: characterName.trim(),
        gender: characterGender,
        age: characterAge,
        description: fullDescription,
        imageBase64Array,
      });
      
      console.log('Character creation response:', response.data);
      
      setNotification({
        open: true,
        message: `Character "${characterName}" created successfully!`,
        severity: 'success'
      });
      
      // Reset all character fields
      setCharacterName('');
      setCharacterDescription('');
      setCharacterKind('Human');
      setCharacterGender('Male');
      setCharacterAge('Child');
      setCharacterHairColor('Dark Brown');
      setCharacterHairLength('Medium');
      setCharacterEyeColor('Brown');
      setUploadedImages([]);
      setShowCharacterNameError(false);
      
      // Navigate to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error: any) {
      console.error('Character creation error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create character. Please try again.';
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsCreatingCharacter(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      setUploadedImages(prev => {
        const combined = [...prev, ...newImages];
        if (combined.length > MAX_CHARACTER_IMAGES) {
          setNotification({
            open: true,
            message: `Maximum ${MAX_CHARACTER_IMAGES} images allowed.`,
            severity: 'info'
          });
        }
        return combined.slice(0, MAX_CHARACTER_IMAGES);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const getCredits = () => {
    return videoTypes.find(t => t.id === videoType)?.credits || 0;
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 3, px: { xs: 1, sm: 2, md: 3 }, minHeight: 0, overflow: 'visible' }}>
      {/* Toggle Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, width: '100%' }}>
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          fullWidth
          sx={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '100px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            p: 0.5,
            maxWidth: { xs: '100%', sm: 500 },
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '100px !important',
              flex: 1,
              minWidth: { xs: 'auto', sm: 140 },
              px: { xs: 1.5, sm: 3 },
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              color: '#86868B',
              gap: 0.75,
              whiteSpace: 'nowrap',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&.Mui-selected': {
                background: '#007AFF',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,122,255,0.35)',
                '&:hover': { background: '#007AFF' },
              },
              '&:hover': { background: 'rgba(0,122,255,0.06)' },
            },
          }}
        >
          <ToggleButton value="song">
            <MusicNoteIcon sx={{ fontSize: 18 }} />
            Music
          </ToggleButton>
          <ToggleButton value="video">
            <VideoLibraryIcon sx={{ fontSize: 18 }} />
            Music Videos
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Song Creation Tab */}
      {activeTab === 'song' && (
        <>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left Column - Song Options */}
          <Box sx={{ flex: 1 }}>
            {/* Prompt Input */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                border: showSongPromptError && !songPrompt.trim() ? '1px solid rgba(255,59,48,0.5)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AutoAwesomeIcon sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Song Prompt
                </Typography>
                <Chip label="Required" size="small" sx={{ ml: 1, background: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Describe what you want your song to be about - theme, story, or vibe
              </Typography>
              
              {/* Characters Section */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#86868B', display: 'block', mb: 1 }}>
                  Add characters or products to your song:
                </Typography>
                {isLoadingCharacters ? (
                  <Typography variant="caption" sx={{ color: '#86868B' }}>Loading characters...</Typography>
                ) : characters.length > 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    alignItems: 'center',
                    overflowX: 'auto',
                    pb: 0.5,
                    '&::-webkit-scrollbar': { height: 4 },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.1)', borderRadius: 2 },
                  }}>
                    {/* Create Character chip - always first */}
                    <Chip
                      label="+ Create"
                      onClick={() => navigate('/characters/create')}
                      size="small"
                      sx={{
                        borderRadius: '100px',
                        background: 'rgba(0,122,255,0.08)',
                        border: '1px dashed rgba(0,122,255,0.3)',
                        color: '#007AFF',
                        fontWeight: 500,
                        cursor: 'pointer',
                        flexShrink: 0,
                        '&:hover': { background: 'rgba(0,122,255,0.15)' },
                      }}
                    />
                    {characters.map((char) => {
                      const isInPrompt = songPrompt.toLowerCase().includes(`@${char.characterName.toLowerCase()}`);
                      return (
                        <Tooltip
                          key={char.characterId}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              {char.imageUrls?.[0] && (
                                <Box
                                  component="img"
                                  src={char.imageUrls[0]}
                                  alt={char.characterName}
                                  sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }}
                                />
                              )}
                              <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1D1D1F' }}>{char.characterName}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>
                                  {isInPrompt ? 'Already added' : 'Click to add'}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          arrow
                          placement="top"
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: '#fff',
                                color: '#1D1D1F',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                                borderRadius: '12px',
                                p: 1.5,
                                border: '1px solid rgba(0,0,0,0.06)',
                              },
                            },
                            arrow: {
                              sx: {
                                color: '#fff',
                                '&::before': {
                                  border: '1px solid rgba(0,0,0,0.06)',
                                },
                              },
                            },
                          }}
                        >
                          <Chip
                            label={`@${char.characterName}`}
                            onClick={() => insertCharacter(char.characterName)}
                            size="small"
                            sx={{
                              borderRadius: '100px',
                              background: isInPrompt ? 'rgba(52,199,89,0.15)' : 'rgba(0,122,255,0.1)',
                              color: isInPrompt ? '#34C759' : '#007AFF',
                              fontWeight: 600,
                              cursor: 'pointer',
                              flexShrink: 0,
                              border: isInPrompt ? '1px solid rgba(52,199,89,0.3)' : '1px solid transparent',
                              '&:hover': { background: isInPrompt ? 'rgba(52,199,89,0.25)' : 'rgba(0,122,255,0.2)' },
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                  </Box>
                ) : (
                  <Chip
                    label="+ Create a character"
                    onClick={() => navigate('/characters/create')}
                    size="small"
                    sx={{
                      borderRadius: '100px',
                      background: 'rgba(0,122,255,0.08)',
                      border: '1px dashed rgba(0,122,255,0.3)',
                      color: '#007AFF',
                      fontWeight: 500,
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(0,122,255,0.15)' },
                    }}
                  />
                )}
              </Box>
              
              <MentionTextField
                value={songPrompt}
                onChange={(value) => {
                  setSongPrompt(value);
                  if (value.trim()) setShowSongPromptError(false);
                }}
                placeholder="Describe your song idea..."
                error={showSongPromptError && !songPrompt.trim()}
                helperText={showSongPromptError && !songPrompt.trim() ? 'Please describe your song idea' : ''}
                characterNames={characters.map(c => c.characterName)}
              />
              
              {/* Creativity Slider - inline below prompt */}
              <Box sx={{ mt: 3, px: 1 }}>
                <Typography variant="caption" sx={{ color: '#86868B', display: 'block', mb: 1.5 }}>
                  How closely should the song follow your prompt?
                </Typography>
                <Slider
                  value={creativity}
                  onChange={(_, value) => setCreativity(value as number)}
                  min={0}
                  max={10}
                  step={1}
                  marks={[
                    { value: 0, label: 'Literal' },
                    { value: 5, label: 'Balanced' },
                    { value: 10, label: 'Creative' },
                  ]}
                  sx={{
                    color: '#007AFF',
                    '& .MuiSlider-thumb': {
                      width: 18,
                      height: 18,
                      backgroundColor: '#fff',
                      border: '2px solid #007AFF',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 6px rgba(0,122,255,0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      height: 4,
                      borderRadius: 2,
                    },
                    '& .MuiSlider-rail': {
                      height: 4,
                      borderRadius: 2,
                      opacity: 0.3,
                    },
                    '& .MuiSlider-mark': {
                      display: 'none',
                    },
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.7rem',
                      color: '#86868B',
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                Genre
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Choose a music style for your track
              </Typography>
              <Button
                onClick={() => setGenrePickerOpen(true)}
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
                  '&:hover': { background: 'rgba(0,122,255,0.05)', borderColor: '#007AFF' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={genres.find(g => g.id === selectedGenre)?.image}
                    alt={genres.find(g => g.id === selectedGenre)?.name}
                    sx={{ width: 24, height: 24, borderRadius: '6px', objectFit: 'cover' }}
                  />
                  {genres.find(g => g.id === selectedGenre)?.name}
                </Box>
                <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                Mood
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Set the emotional tone of your song
              </Typography>
              <Button
                onClick={() => setMoodPickerOpen(true)}
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
                  '&:hover': { background: 'rgba(0,122,255,0.05)', borderColor: '#007AFF' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={moods.find(m => m.id === selectedMood)?.image}
                    alt={moods.find(m => m.id === selectedMood)?.name}
                    sx={{ width: 24, height: 24, borderRadius: '6px', objectFit: 'cover' }}
                  />
                  {moods.find(m => m.id === selectedMood)?.name}
                </Box>
                <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />
              </Button>
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
                Select the language for lyrics
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
                  '&:hover': { background: 'rgba(0,122,255,0.05)', borderColor: '#007AFF' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    component="img"
                    src={languages.find(l => l.id === selectedLanguage)?.image}
                    alt={languages.find(l => l.id === selectedLanguage)?.name}
                    sx={{ width: 24, height: 24, borderRadius: '6px', objectFit: 'cover' }}
                  />
                  {languages.find(l => l.id === selectedLanguage)?.name}
                </Box>
                <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />
              </Button>
            </Paper>

          </Box>

          {/* Right Column - Summary */}
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
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
                Summary
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Genre</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <Box
                      component="img"
                      src={genres.find(g => g.id === selectedGenre)?.image}
                      alt={genres.find(g => g.id === selectedGenre)?.name}
                      sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {genres.find(g => g.id === selectedGenre)?.name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Mood</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <Box
                      component="img"
                      src={moods.find(m => m.id === selectedMood)?.image}
                      alt={moods.find(m => m.id === selectedMood)?.name}
                      sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {moods.find(m => m.id === selectedMood)?.name}
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
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Prompt</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <Box
                      component="img"
                      src="/gruvi-support.png"
                      alt="Prompt"
                      sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {songPrompt.trim() || 'Not entered'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(88,86,214,0.1) 100%)', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BoltIcon sx={{ color: '#007AFF', fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>Total Tokens</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    20
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

        {/* Genre Picker Action Sheet */}
        <Drawer
          anchor="bottom"
          open={genrePickerOpen}
          onClose={() => setGenrePickerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '70vh',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', textAlign: 'left' }}>
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
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      objectFit: 'cover',
                      mr: 2,
                    }}
                  />
                  <ListItemText 
                    primary={genre.name} 
                    primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} 
                  />
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

        {/* Mood Picker Action Sheet */}
        <Drawer
          anchor="bottom"
          open={moodPickerOpen}
          onClose={() => setMoodPickerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '70vh',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', textAlign: 'left' }}>
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
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      objectFit: 'cover',
                      mr: 2,
                    }}
                  />
                  <ListItemText 
                    primary={mood.name} 
                    primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} 
                  />
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

        {/* Language Picker Action Sheet */}
        <Drawer
          anchor="bottom"
          open={languagePickerOpen}
          onClose={() => setLanguagePickerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '70vh',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', textAlign: 'left' }}>
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
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      objectFit: 'cover',
                      mr: 2,
                    }}
                  />
                  <ListItemText 
                    primary={language.name} 
                    primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} 
                  />
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
        </>
      )}

      {/* Video Creation Tab */}
      {activeTab === 'video' && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            {/* Song Selection - Action Sheet Trigger */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                border: showSongSelectionError && !selectedSong ? '1px solid rgba(255,59,48,0.5)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <MusicNoteIcon sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Select Song
                </Typography>
                <Chip label="Required" size="small" sx={{ ml: 1, background: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Choose which song to create a music video for
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setSongPickerOpen(true)}
                sx={{
                  justifyContent: 'space-between',
                  py: 1.5,
                  px: 2,
                  borderRadius: '12px',
                  borderColor: showSongSelectionError && !selectedSong ? 'rgba(255,59,48,0.5)' : 'rgba(0,0,0,0.15)',
                  color: selectedSong ? '#1D1D1F' : '#86868B',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#007AFF',
                    background: 'rgba(0,122,255,0.04)',
                  },
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    flex: 1,
                    textAlign: 'left',
                  }}
                >
                  {selectedSong 
                    ? (isLoadingSongs 
                        ? 'Loading songs...'
                        : (songs.find(s => s.songId === selectedSong)?.songTitle 
                            ? `${songs.find(s => s.songId === selectedSong)?.songTitle} (${songs.find(s => s.songId === selectedSong)?.genre})`
                            : 'Song not found'))
                    : 'Select a song'}
                </Box>
                <KeyboardArrowDownIcon sx={{ color: '#86868B', ml: 1, flexShrink: 0 }} />
              </Button>
              {showSongSelectionError && !selectedSong && (
                <Typography variant="caption" sx={{ color: '#FF3B30', mt: 1, display: 'block' }}>
                  Please select a song
                </Typography>
              )}
            </Paper>

            {/* Song Selection Action Sheet */}
            <Drawer
              anchor="bottom"
              open={songPickerOpen}
              onClose={() => {
                setSongPickerOpen(false);
                setSongSearchQuery('');
              }}
              PaperProps={{
                sx: {
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  maxHeight: '70vh',
                  background: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(20px)',
                },
              }}
            >
              <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', textAlign: 'left', mb: 2 }}>
                  Select Song
                </Typography>
                {/* Search Bar */}
                <TextField
                  placeholder="Search your songs..."
                  value={songSearchQuery}
                  onChange={(e) => setSongSearchQuery(e.target.value)}
                  size="small"
                  fullWidth
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      backgroundColor: 'rgba(0,0,0,0.03)',
                      '& fieldset': { border: 'none' },
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                      '&.Mui-focused': { backgroundColor: 'rgba(0,122,255,0.05)' },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#86868B' }} />
                      </InputAdornment>
                    ),
                    endAdornment: songSearchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSongSearchQuery('')}>
                          <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <ScrollableListWrapper>
                {isLoadingSongs ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#86868B' }}>Loading songs...</Typography>
                  </Box>
                )                 : (() => {
                  // Use server-side search results when searching, otherwise show recent songs
                  const isSearching = songSearchQuery.trim().length > 0;
                  const displaySongs = isSearching ? songSearchResults : songs;
                  
                  // Show loading state when searching
                  if (isSearching && isSearchingSongs) {
                    return (
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <CircularProgress size={24} sx={{ color: '#007AFF' }} />
                        <Typography variant="body2" sx={{ color: '#86868B', mt: 1 }}>Searching...</Typography>
                      </Box>
                    );
                  }
                  
                  return displaySongs.length > 0 ? (
                    <>
                      {displaySongs.map((song) => (
                    <ListItem key={song.songId} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          setSelectedSong(song.songId);
                          // If song is from search results, add it to songs array so it can be displayed
                          if (!songs.find(s => s.songId === song.songId)) {
                            setSongs(prev => [song, ...prev]);
                          }
                          setSongPickerOpen(false);
                          setSongSearchQuery('');
                          setShowSongSelectionError(false);
                        }}
                        sx={{
                          borderRadius: '12px',
                          mb: 0.5,
                          py: 1.5,
                          background: selectedSong === song.songId ? 'rgba(0,122,255,0.1)' : 'transparent',
                          border: selectedSong === song.songId ? '2px solid #007AFF' : '2px solid transparent',
                        }}
                      >
                        <ListItemIcon>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '10px',
                              background: '#1D1D1F',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <Box
                              component="img"
                              src={`/genres/${(() => {
                                const genre = song.genre?.toLowerCase().replace(/\s+/g, '-') || 'pop';
                                // Handle filename mismatches
                                const genreMap: Record<string, string> = {
                                  'reggaeton': 'raggaeton',
                                  'reggae': 'raggae',
                                  'classical': 'classic',
                                  'gospel': 'gospels',
                                };
                                return genreMap[genre] || genre;
                              })()}.jpeg`}
                              alt={song.genre}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                              }}
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={song.songTitle}
                          secondary={song.genre}
                          primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }}
                          secondaryTypographyProps={{ color: '#86868B' }}
                        />
                        {selectedSong === song.songId && (
                          <CheckIcon sx={{ color: '#007AFF' }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))}
                      {/* Load More Button - only show when not searching and there are more songs */}
                      {!isSearching && hasMoreSongs && (
                        <Box sx={{ py: 2, textAlign: 'center' }}>
                          <Button
                            onClick={loadMoreSongs}
                            disabled={isLoadingMoreSongs}
                            sx={{
                              textTransform: 'none',
                              color: '#007AFF',
                              fontWeight: 500,
                              '&:hover': { background: 'rgba(0,122,255,0.08)' },
                            }}
                          >
                            {isLoadingMoreSongs ? (
                              <>
                                <CircularProgress size={16} sx={{ mr: 1, color: '#007AFF' }} />
                                Loading...
                              </>
                            ) : (
                              'Load more songs'
                            )}
                          </Button>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
                        {songSearchQuery.trim() ? 'No songs match your search' : 'No songs available'}
                      </Typography>
                      {!songSearchQuery.trim() && (
                        <Chip
                          label="+ Create a song first"
                          onClick={() => {
                            setSongPickerOpen(false);
                            setActiveTab('song');
                          }}
                          sx={{
                            borderRadius: '100px',
                            background: 'rgba(0,122,255,0.08)',
                            border: '1px dashed rgba(0,122,255,0.3)',
                            color: '#007AFF',
                            fontWeight: 500,
                            cursor: 'pointer',
                            '&:hover': { background: 'rgba(0,122,255,0.15)' },
                          }}
                        />
                      )}
                    </Box>
                  );
                })()}
              </ScrollableListWrapper>
              <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => setSongPickerOpen(false)}
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

            {/* Video Prompt */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AutoAwesomeIcon sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Video Description
                </Typography>
                <Chip label="Required" size="small" sx={{ ml: 1, background: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Describe the visual story, scenes, and setting for your music video
              </Typography>
              
              {/* Characters Section */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#86868B', display: 'block', mb: 1 }}>
                  Add characters or products to your video:
                </Typography>
                {isLoadingCharacters ? (
                  <Typography variant="caption" sx={{ color: '#86868B' }}>Loading characters...</Typography>
                ) : characters.length > 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    alignItems: 'center',
                    overflowX: 'auto',
                    pb: 0.5,
                    '&::-webkit-scrollbar': { height: 4 },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.1)', borderRadius: 2 },
                  }}>
                    {/* Create Character chip - always first */}
                    <Chip
                      label="+ Create"
                      onClick={() => navigate('/characters/create')}
                      size="small"
                      sx={{
                        borderRadius: '100px',
                        background: 'rgba(0,122,255,0.08)',
                        border: '1px dashed rgba(0,122,255,0.3)',
                        color: '#007AFF',
                        fontWeight: 500,
                        cursor: 'pointer',
                        flexShrink: 0,
                        '&:hover': { background: 'rgba(0,122,255,0.15)' },
                      }}
                    />
                    {characters.map((char) => {
                      const isInPrompt = videoPrompt.toLowerCase().includes(`@${char.characterName.toLowerCase()}`);
                      return (
                        <Tooltip
                          key={char.characterId}
                          title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              {char.imageUrls?.[0] && (
                                <Box
                                  component="img"
                                  src={char.imageUrls[0]}
                                  alt={char.characterName}
                                  sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }}
                                />
                              )}
                              <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1D1D1F' }}>{char.characterName}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>
                                  {isInPrompt ? 'Already added' : 'Click to add'}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          arrow
                          placement="top"
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: '#fff',
                                color: '#1D1D1F',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                                borderRadius: '12px',
                                p: 1.5,
                                border: '1px solid rgba(0,0,0,0.06)',
                              },
                            },
                            arrow: {
                              sx: {
                                color: '#fff',
                                '&::before': {
                                  border: '1px solid rgba(0,0,0,0.06)',
                                },
                              },
                            },
                          }}
                        >
                          <Chip
                            label={`@${char.characterName}`}
                            onClick={() => insertCharacter(char.characterName)}
                            size="small"
                            sx={{
                              borderRadius: '100px',
                              background: isInPrompt ? 'rgba(52,199,89,0.15)' : 'rgba(0,122,255,0.1)',
                              color: isInPrompt ? '#34C759' : '#007AFF',
                              fontWeight: 600,
                              cursor: 'pointer',
                              flexShrink: 0,
                              border: isInPrompt ? '1px solid rgba(52,199,89,0.3)' : '1px solid transparent',
                              '&:hover': { background: isInPrompt ? 'rgba(52,199,89,0.25)' : 'rgba(0,122,255,0.2)' },
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                  </Box>
                ) : (
                  <Chip
                    label="+ Create a character"
                    onClick={() => navigate('/characters/create')}
                    size="small"
                    sx={{
                      borderRadius: '100px',
                      background: 'rgba(0,122,255,0.08)',
                      border: '1px dashed rgba(0,122,255,0.3)',
                      color: '#007AFF',
                      fontWeight: 500,
                      cursor: 'pointer',
                      '&:hover': { background: 'rgba(0,122,255,0.15)' },
                    }}
                  />
                )}
              </Box>
              
              <MentionTextField
                value={videoPrompt}
                onChange={(value) => {
                  setVideoPrompt(value);
                  if (value.trim()) setShowVideoPromptError(false);
                }}
                placeholder="Describe the scenes, setting, and story for your music video..."
                error={showVideoPromptError && !videoPrompt.trim()}
                helperText={showVideoPromptError && !videoPrompt.trim() ? 'Please describe your video' : ''}
                characterNames={characters.map(c => c.characterName)}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <PaletteIcon sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Visual Style
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Choose the art style and visual aesthetic for your music video
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setStylePickerOpen(true)}
                sx={{
                  justifyContent: 'space-between',
                  py: 1.5,
                  px: 2,
                  borderRadius: '12px',
                  borderColor: 'rgba(0,0,0,0.15)',
                  color: '#1D1D1F',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.04)' },
                }}
                endIcon={<KeyboardArrowDownIcon />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    component="img"
                    src={artStyles.find(s => s.id === selectedStyle)?.image}
                    alt={artStyles.find(s => s.id === selectedStyle)?.label}
                    sx={{ width: 36, height: 36, borderRadius: '8px', objectFit: 'cover' }}
                  />
                  {artStyles.find(s => s.id === selectedStyle)?.label}
                </Box>
              </Button>
            </Paper>

            {/* Style Picker Action Sheet */}
            <Drawer
              anchor="bottom"
              open={stylePickerOpen}
              onClose={() => setStylePickerOpen(false)}
              PaperProps={{
                sx: {
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  maxHeight: '70vh',
                  background: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'blur(20px)',
                },
              }}
            >
              <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', textAlign: 'left' }}>
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
                      <ListItemIcon>
                        <Box 
                          component="img" 
                          src={style.image} 
                          alt={style.label} 
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            borderRadius: '10px', 
                            objectFit: 'cover',
                            border: '2px solid rgba(0,0,0,0.1)',
                          }} 
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={style.label} 
                        primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F', ml: 1 }} 
                      />
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

            {/* Video Type */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <MovieIcon sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Video Type
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Select between still images or full animation for your music video
              </Typography>
              <ToggleButtonGroup
                value={videoType}
                exclusive
                onChange={(_e, v) => v && setVideoType(v)}
                fullWidth
                orientation="vertical"
                sx={{
                  gap: 1.5,
                  '& .MuiToggleButtonGroup-grouped': { border: 'none !important', borderRadius: '16px !important', m: 0 },
                }}
              >
                {videoTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = videoType === type.id;
                  return (
                    <Tooltip 
                      key={type.id}
                      title={type.tooltip} 
                      arrow 
                      placement="right"
                      enterDelay={300}
                      sx={{ maxWidth: 220 }}
                    >
                      <ToggleButton
                        value={type.id}
                        sx={{
                          py: 2,
                          px: 2.5,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: 2,
                          textTransform: 'none',
                          background: isSelected ? 'rgba(0,122,255,0.08)' : 'rgba(0,0,0,0.02)',
                          color: '#1D1D1F',
                          border: isSelected ? '2px solid #007AFF' : '2px solid rgba(0,0,0,0.08)',
                          boxShadow: isSelected ? '0 4px 16px rgba(0,122,255,0.15)' : 'none',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': { 
                            background: isSelected ? 'rgba(0,122,255,0.12)' : 'rgba(0,0,0,0.04)',
                            borderColor: isSelected ? '#007AFF' : 'rgba(0,0,0,0.15)',
                          },
                          '&.Mui-selected': { 
                            background: 'rgba(0,122,255,0.08)', 
                            color: '#1D1D1F',
                            '&:hover': { background: 'rgba(0,122,255,0.12)' },
                          },
                        }}
                      >
                        <IconComponent sx={{ fontSize: 28, color: isSelected ? '#007AFF' : '#1D1D1F', flexShrink: 0 }} />
                        <Box sx={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#007AFF' : '#1D1D1F' }}>{type.label}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#86868B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{type.description}</Typography>
                        </Box>
                        <Chip 
                          icon={<BoltIcon sx={{ fontSize: 14, color: '#007AFF !important' }} />}
                          label={`${type.credits}`} 
                          size="small" 
                          sx={{ fontWeight: 700, background: 'rgba(0,122,255,0.1)', color: '#007AFF', flexShrink: 0 }} 
                        />
                      </ToggleButton>
                    </Tooltip>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AspectRatioIcon sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Aspect Ratio
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Choose the format for your music video
              </Typography>
              
              <ToggleButtonGroup
                value={aspectRatio}
                exclusive
                onChange={(_event, newValue) => {
                  if (newValue !== null) setAspectRatio(newValue);
                }}
                fullWidth
                orientation="vertical"
                sx={{
                  gap: 1.5,
                  '& .MuiToggleButtonGroup-grouped': { border: 'none !important', borderRadius: '16px !important', m: 0 },
                }}
              >
                <ToggleButton
                  value="portrait"
                  sx={{
                    py: 2,
                    px: 2.5,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                    textTransform: 'none',
                    background: aspectRatio === 'portrait' ? 'rgba(0,122,255,0.08)' : 'rgba(0,0,0,0.02)',
                    color: '#1D1D1F',
                    border: aspectRatio === 'portrait' ? '2px solid #007AFF' : '2px solid rgba(0,0,0,0.08)',
                    boxShadow: aspectRatio === 'portrait' ? '0 4px 16px rgba(0,122,255,0.15)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      background: aspectRatio === 'portrait' ? 'rgba(0,122,255,0.12)' : 'rgba(0,0,0,0.04)',
                      borderColor: aspectRatio === 'portrait' ? '#007AFF' : 'rgba(0,0,0,0.15)',
                    },
                    '&.Mui-selected': { 
                      background: 'rgba(0,122,255,0.08)', 
                      color: '#1D1D1F',
                      '&:hover': { background: 'rgba(0,122,255,0.12)' },
                    },
                  }}
                >
                  <SmartphoneIcon sx={{ fontSize: 28, flexShrink: 0, color: aspectRatio === 'portrait' ? '#007AFF' : '#86868B' }} />
                  <Box sx={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: aspectRatio === 'portrait' ? '#007AFF' : '#1D1D1F' }}>Portrait</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>9:16 • Best for mobile & TikTok</Typography>
                  </Box>
                </ToggleButton>
                <ToggleButton
                  value="landscape"
                  sx={{
                    py: 2,
                    px: 2.5,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 2,
                    textTransform: 'none',
                    background: aspectRatio === 'landscape' ? 'rgba(0,122,255,0.08)' : 'rgba(0,0,0,0.02)',
                    color: '#1D1D1F',
                    border: aspectRatio === 'landscape' ? '2px solid #007AFF' : '2px solid rgba(0,0,0,0.08)',
                    boxShadow: aspectRatio === 'landscape' ? '0 4px 16px rgba(0,122,255,0.15)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      background: aspectRatio === 'landscape' ? 'rgba(0,122,255,0.12)' : 'rgba(0,0,0,0.04)',
                      borderColor: aspectRatio === 'landscape' ? '#007AFF' : 'rgba(0,0,0,0.15)',
                    },
                    '&.Mui-selected': { 
                      background: 'rgba(0,122,255,0.08)', 
                      color: '#1D1D1F',
                      '&:hover': { background: 'rgba(0,122,255,0.12)' },
                    },
                  }}
                >
                  <TvIcon sx={{ fontSize: 28, flexShrink: 0, color: aspectRatio === 'landscape' ? '#007AFF' : '#86868B' }} />
                  <Box sx={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: aspectRatio === 'landscape' ? '#007AFF' : '#1D1D1F' }}>Landscape</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>16:9 • Best for YouTube & TV</Typography>
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>

          </Box>

          {/* Right Column - Summary */}
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
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 3 }}>
                Summary
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Song</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <MusicNoteIcon sx={{ fontSize: 18, color: '#007AFF', flexShrink: 0 }} />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {isLoadingSongs ? 'Loading...' : (songs.find(s => s.songId === selectedSong)?.songTitle || 'Not selected')}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Style</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <Box
                      component="img"
                      src={artStyles.find(s => s.id === selectedStyle)?.image}
                      alt={artStyles.find(s => s.id === selectedStyle)?.label}
                      sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {artStyles.find(s => s.id === selectedStyle)?.label}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Type</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <MovieIcon sx={{ fontSize: 18, color: '#FF9500', flexShrink: 0 }} />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {videoTypes.find(t => t.id === videoType)?.label}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Aspect Ratio</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    {aspectRatio === 'portrait' ? (
                      <SmartphoneIcon sx={{ fontSize: 18, color: '#007AFF', flexShrink: 0 }} />
                    ) : (
                      <TvIcon sx={{ fontSize: 18, color: '#007AFF', flexShrink: 0 }} />
                    )}
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {aspectRatio === 'portrait' ? '9:16 (Portrait)' : '16:9 (Landscape)'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(88,86,214,0.1) 100%)', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BoltIcon sx={{ color: '#007AFF', fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>Total Tokens</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {getCredits()}
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || !selectedSong || !videoPrompt.trim()}
                sx={{
                  py: 2,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                  boxShadow: '0 8px 24px rgba(0,122,255,0.3)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': { boxShadow: '0 12px 32px rgba(0,122,255,0.4)' },
                }}
              >
                {isGeneratingVideo ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (
                  <>
                    <MovieIcon sx={{ mr: 1 }} />
                    Generate Music Video
                  </>
                )}
              </Button>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 7 }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
      
      {/* Upgrade/Top-up Popup */}
      <UpgradePopup
        open={upgradePopupOpen}
        type="photo"
        message={upgradePopupMessage}
        title="Not Enough Tokens"
        isPremiumTier={isPremiumTier}
        onClose={() => setUpgradePopupOpen(false)}
        onTopUp={handleTopUp}
        onUpgrade={handleUpgrade}
        isTopUpLoading={isTopUpLoading}
        isUpgradeLoading={isUpgradeLoading}
      />
    </Container>
  );
};

export default CreatePage;

