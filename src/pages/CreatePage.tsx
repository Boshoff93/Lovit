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
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAudioPlayer, Song as AudioSong } from '../contexts/AudioPlayerContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { songsApi, videosApi, charactersApi } from '../services/api';
import { getTokensFromAllowances, createCheckoutSession, updateTokensUsed } from '../store/authSlice';
import { topUpBundles, TopUpBundle } from '../config/stripe';
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import BoltIcon from '@mui/icons-material/Bolt';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TvIcon from '@mui/icons-material/Tv';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TimerIcon from '@mui/icons-material/Timer';
import TuneIcon from '@mui/icons-material/Tune';

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
// Token costs: Music Video = 100, Cinematic = 1000
const videoTypes = [
  { 
    id: 'still', 
    label: 'Music Video', 
    credits: 100, 
    description: 'Beautifully composed scenes',
    tooltip: 'Stunning AI-generated visuals with cinematic transitions, perfectly synced to your music.',
    icon: ImageIcon,
  },
  { 
    id: 'standard', 
    label: 'Cinematic', 
    credits: 1000, 
    description: 'With movement',
    tooltip: 'Dynamic video scenes with realistic movement and motion, bringing your music video to life.',
    icon: MovieIcon,
  },
];




// Character interface
interface Character {
  characterId: string;
  characterName: string;
  imageUrls?: string[];
  characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place';
  description?: string;
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
  
  // Audio player for song preview
  const { currentSong, isPlaying, playSong, pauseSong } = useAudioPlayer();
  
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
    'still': 100,      // Still image video
    'standard': 1000,  // Animated/Cinematic video
  };
  
  // Check if user has enough tokens
  const hasEnoughTokens = (cost: number) => remainingTokens >= cost;
  
  // Handle upgrade popup actions
  const handleTopUp = useCallback(async (bundle?: TopUpBundle) => {
    try {
      setIsTopUpLoading(true);
      await reportPurchaseConversion();
      
      // Use selected bundle or default to first bundle
      const selectedBundle = bundle || topUpBundles[0];
      
      const resultAction = await dispatch(createCheckoutSession({ 
        priceId: selectedBundle.priceId,
        productId: selectedBundle.productId
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
  const [autoPickGenre, setAutoPickGenre] = useState(false); // Let AI pick genre based on prompt
  const [autoPickMood, setAutoPickMood] = useState(false); // Let AI pick mood based on prompt
  const [songLength, setSongLength] = useState<'short' | 'standard'>('standard'); // Song duration preference
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
  const [videoCreativity, setVideoCreativity] = useState(5); // 0-10 scale: 0 = literal, 10 = creative
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
  const songCastScrollRef = useRef<HTMLDivElement>(null);
  const videoCastScrollRef = useRef<HTMLDivElement>(null);
  const [songCastCanScroll, setSongCastCanScroll] = useState({ left: false, right: false });
  const [videoCastCanScroll, setVideoCastCanScroll] = useState({ left: false, right: false });
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

  // Check if cast carousel can scroll left/right
  const checkCastScrollPosition = useCallback(() => {
    if (songCastScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = songCastScrollRef.current;
      setSongCastCanScroll({
        left: scrollLeft > 5,
        right: scrollLeft < scrollWidth - clientWidth - 5,
      });
    }
    if (videoCastScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = videoCastScrollRef.current;
      setVideoCastCanScroll({
        left: scrollLeft > 5,
        right: scrollLeft < scrollWidth - clientWidth - 5,
      });
    }
  }, []);

  // Update scroll position when characters change or on scroll
  useEffect(() => {
    checkCastScrollPosition();
    
    const songRef = songCastScrollRef.current;
    const videoRef = videoCastScrollRef.current;
    
    if (songRef) {
      songRef.addEventListener('scroll', checkCastScrollPosition);
    }
    if (videoRef) {
      videoRef.addEventListener('scroll', checkCastScrollPosition);
    }
    
    return () => {
      if (songRef) {
        songRef.removeEventListener('scroll', checkCastScrollPosition);
      }
      if (videoRef) {
        videoRef.removeEventListener('scroll', checkCastScrollPosition);
      }
    };
  }, [characters, checkCastScrollPosition]);

  const scrollCast = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.6;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

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
        };
        const normalized = genre.toLowerCase();
        return genreAliases[normalized] || normalized;
      };
      
      // Pre-fill genre and mood (don't use auto-pick for similar songs)
      if (genreFromUrl) {
        setSelectedGenre(normalizeGenre(genreFromUrl));
        setAutoPickGenre(false);
      }
      if (moodFromUrl) {
        setSelectedMood(moodFromUrl.toLowerCase());
        setAutoPickMood(false);
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

  const handleCloseNotification = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return; // Don't close on clickaway
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
        return trimmed ? `${trimmed} ${name} ` : `${name} `;
      });
    } else if (activeTab === 'video') {
      setVideoPrompt(prev => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} ${name} ` : `${name} `;
      });
    }
  };

  // Extract unique character IDs from text by matching character names naturally
  // Matches character names as whole words (case-insensitive)
  const getTaggedCharacterIds = (text: string): string[] => {
    const ids: string[] = [];
    const lowerText = text.toLowerCase();
    
    // For each character, check if their name appears in the text
    for (const char of characters) {
      const charName = char.characterName.toLowerCase();
      // Check for the character name as a whole word (case insensitive)
      const escapedName = charName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\s|,|\\.|!|\\?)${escapedName}($|\\s|,|\\.|!|\\?)`, 'i');
      if (regex.test(lowerText)) {
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
        genre: autoPickGenre ? 'auto' : selectedGenre,
        mood: autoPickMood ? 'auto' : selectedMood,
        language: selectedLanguage,
        characterIds: characterIds.length > 0 ? characterIds : undefined,
        creativity,
        songLength, // 'short' or 'standard'
      });
      
      console.log('Song generation started:', response.data);
      
      // Update local token count immediately so UI reflects the spend
      dispatch(updateTokensUsed(SONG_COST));
      
      // Clear form
      setSongPrompt('');
      setShowSongPromptError(false);
      
      // Navigate immediately to library - song will appear in loading state
      navigate('/my-library?tab=songs&generating=true');
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
        creativity: videoCreativity,
      });
      
      console.log('Video generation response:', response.data);
      
      // Update local token count immediately so UI reflects the spend
      const videoCostToDeduct = VIDEO_COSTS[videoType] || 40;
      dispatch(updateTokensUsed(videoCostToDeduct));
      
      setVideoPrompt('');
      setShowVideoPromptError(false);
      setShowSongSelectionError(false);
      
      // Navigate immediately to Music Videos tab
      navigate('/my-library?tab=videos&generating=true');
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
      setTimeout(() => navigate('/my-library'), 1500);
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
    <Container maxWidth="lg" sx={{ pt: 2, pb: 3, px: { xs: 0, md: 3 }, minHeight: 0, overflow: 'visible' }}>
      {/* Header with Title and Toggle */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3,
        gap: 2,
        flexWrap: 'wrap',
      }}>
        {/* Left: Page Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon sx={{ color: '#007AFF', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
            {activeTab === 'song' ? 'Create Music' : 'Create Video'}
          </Typography>
        </Box>

        {/* Toggle - same size on mobile and desktop */}
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          sx={{
            background: 'rgba(0,0,0,0.04)',
            borderRadius: '10px',
            p: '3px',
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '8px !important',
              px: { xs: 1.5, md: 2 },
              py: '7px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#86868B',
              gap: 0.75,
              '&.Mui-selected': {
                background: '#fff',
                color: '#007AFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': { background: '#fff' },
              },
              '&:hover': { background: 'rgba(0,0,0,0.02)' },
            },
          }}
        >
          <ToggleButton value="song">
            <MusicNoteIcon sx={{ fontSize: 18 }} />
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>Music</Box>
          </ToggleButton>
          <ToggleButton value="video">
            <VideoLibraryIcon sx={{ fontSize: 18 }} />
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>Video</Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Song Creation Tab */}
      {activeTab === 'song' && (
        <>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 0, md: 3 }, width: '100%' }}>
          {/* Left Column - Song Options */}
          <Box sx={{ flex: 1, minWidth: 0, mb: { xs: 0, md: 0 } }}>
            {/* Prompt Input */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
                borderRadius: { xs: '16px', sm: '20px' },
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                border: showSongPromptError && !songPrompt.trim() ? '1px solid rgba(255,59,48,0.5)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                maxWidth: '100%',
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
              <Box sx={{ mb: 2, width: '100%', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: '#86868B', fontSize: '0.8rem' }}>
                    Add characters, products or places to your song:
                  </Typography>
                  {/* Scroll arrows - top right */}
                  {(songCastCanScroll.left || songCastCanScroll.right) && characters.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => scrollCast(songCastScrollRef, 'left')}
                        disabled={!songCastCanScroll.left}
                        sx={{
                          width: 24,
                          height: 24,
                          background: 'rgba(0,0,0,0.04)',
                          opacity: songCastCanScroll.left ? 1 : 0.4,
                          '&:hover': { background: 'rgba(0,0,0,0.08)' },
                        }}
                      >
                        <ChevronLeftIcon sx={{ fontSize: 16, color: '#86868B' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => scrollCast(songCastScrollRef, 'right')}
                        disabled={!songCastCanScroll.right}
                        sx={{
                          width: 24,
                          height: 24,
                          background: 'rgba(0,0,0,0.04)',
                          opacity: songCastCanScroll.right ? 1 : 0.4,
                          '&:hover': { background: 'rgba(0,0,0,0.08)' },
                        }}
                      >
                        <ChevronRightIcon sx={{ fontSize: 16, color: '#86868B' }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                {isLoadingCharacters ? (
                  <Typography variant="caption" sx={{ color: '#86868B' }}>Loading your cast...</Typography>
                ) : characters.length > 0 ? (
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    {/* Left gradient fade - only show when can scroll left */}
                    {songCastCanScroll.left && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 24,
                          background: 'linear-gradient(to right, #fff 0%, transparent 100%)',
                          zIndex: 1,
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                    {/* Right gradient fade - only show when can scroll right */}
                    {songCastCanScroll.right && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: 32,
                          background: 'linear-gradient(to left, #fff 0%, transparent 100%)',
                          zIndex: 1,
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                    <Box 
                      ref={songCastScrollRef}
                      sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        alignItems: 'center',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        pb: 0.5,
                        pr: 1, // Small padding for last item
                        maxWidth: '100%',
                        '&::-webkit-scrollbar': { display: 'none' },
                      }}>
                      {/* Create Character chip - always first */}
                      <Chip
                        label="+ Create"
                        onClick={() => navigate('/my-cast/create')}
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
                      const charNameLower = char.characterName.toLowerCase();
                      const promptLower = songPrompt.toLowerCase();
                      const escapedName = charNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                      const regex = new RegExp(`(^|\\s|,|\\.|!|\\?)${escapedName}($|\\s|,|\\.|!|\\?)`, 'i');
                      const isInPrompt = regex.test(promptLower);
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
                            label={char.characterName}
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
                  </Box>
                ) : (
                  <Chip
                    label="+ Create a character"
                    onClick={() => navigate('/my-cast/create')}
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
              
              {/* Creativity Slider - subtle inline control */}
              <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#86868B' }}>
                      Prompt adherence
                    </Typography>
                    <Tooltip 
                      title="Exact = lyrics closely follow your prompt. Creative = captures the feeling. Recommended: 5"
                      arrow
                      placement="top"
                    >
                      <InfoOutlinedIcon sx={{ fontSize: 14, color: '#86868B', cursor: 'help' }} />
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#1D1D1F', fontWeight: 500 }}>
                    {creativity <= 3 ? 'Exact' : creativity <= 6 ? 'Balanced' : 'Creative'} ({creativity}/10)
                  </Typography>
                </Box>
                <Slider
                  value={creativity}
                  onChange={(_, value) => setCreativity(value as number)}
                  min={0}
                  max={10}
                  step={1}
                  sx={{
                    color: '#007AFF',
                    height: 4,
                    padding: '8px 0',
                    '& .MuiSlider-thumb': {
                      width: 14,
                      height: 14,
                      backgroundColor: '#007AFF',
                      border: 'none',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 4px rgba(0,122,255,0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      borderRadius: 2,
                    },
                    '& .MuiSlider-rail': {
                      borderRadius: 2,
                      opacity: 0.2,
                      backgroundColor: '#86868B',
                    },
                  }}
                />
              </Box>
            </Paper>

            {/* Genre & Mood Selection - Side by Side on sm+ */}
            <Box sx={{ display: 'flex', gap: { xs: 0, sm: 3 }, mb: { xs: 0, sm: 3 }, flexDirection: { xs: 'column', sm: 'row' } }}>
              {/* Genre Selection */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  flex: { sm: 1 },
                  mb: { xs: 3, sm: 0 },
                  borderRadius: { xs: '16px', sm: '20px' },
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  minWidth: 0,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.95rem' }}>
                    Genre
                  </Typography>
                  <Box 
                    onClick={() => setAutoPickGenre(!autoPickGenre)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5, 
                      cursor: 'pointer',
                      color: autoPickGenre ? '#fff' : '#007AFF',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      px: 1,
                      py: 0.4,
                      borderRadius: '16px',
                      background: autoPickGenre 
                        ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' 
                        : 'transparent',
                      border: autoPickGenre ? 'none' : '1.5px solid #007AFF',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      '&:hover': { 
                        background: autoPickGenre 
                          ? 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)'
                          : 'rgba(0, 122, 255, 0.08)',
                      },
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 12 }} />
                    Auto
                  </Box>
                </Box>
                <Button
                  onClick={() => !autoPickGenre && setGenrePickerOpen(true)}
                  disabled={autoPickGenre}
                  fullWidth
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    py: 1.25,
                    px: 1.5,
                    mt: 1,
                    borderRadius: '10px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: autoPickGenre ? 'rgba(0,122,255,0.05)' : '#fff',
                    color: autoPickGenre ? '#007AFF' : '#1D1D1F',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    opacity: autoPickGenre ? 0.7 : 1,
                    minWidth: 0,
                    '&:hover': { background: autoPickGenre ? 'rgba(0,122,255,0.05)' : 'rgba(0,122,255,0.05)', borderColor: '#007AFF' },
                    '&.Mui-disabled': { color: '#007AFF', background: 'rgba(0,122,255,0.05)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, overflow: 'hidden' }}>
                    {autoPickGenre ? (
                      <>
                        <AutoAwesomeIcon sx={{ fontSize: 18, flexShrink: 0 }} />
                        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>AI picks</Box>
                      </>
                    ) : (
                      <>
                        <Box
                          component="img"
                          src={genres.find(g => g.id === selectedGenre)?.image}
                          alt={genres.find(g => g.id === selectedGenre)?.name}
                          sx={{ width: 22, height: 22, borderRadius: '5px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {genres.find(g => g.id === selectedGenre)?.name}
                        </Box>
                      </>
                    )}
                  </Box>
                  {!autoPickGenre && <KeyboardArrowDownIcon sx={{ color: '#86868B', fontSize: 20, flexShrink: 0 }} />}
                </Button>
              </Paper>

              {/* Mood Selection */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  flex: { sm: 1 },
                  mb: { xs: 3, sm: 0 },
                  borderRadius: { xs: '16px', sm: '20px' },
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  minWidth: 0,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.95rem' }}>
                    Mood
                  </Typography>
                  <Box 
                    onClick={() => setAutoPickMood(!autoPickMood)}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5, 
                      cursor: 'pointer',
                      color: autoPickMood ? '#fff' : '#007AFF',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      px: 1,
                      py: 0.4,
                      borderRadius: '16px',
                      background: autoPickMood 
                        ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' 
                        : 'transparent',
                      border: autoPickMood ? 'none' : '1.5px solid #007AFF',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      '&:hover': { 
                        background: autoPickMood 
                          ? 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)'
                          : 'rgba(0, 122, 255, 0.08)',
                      },
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 12 }} />
                    Auto
                  </Box>
                </Box>
                <Button
                  onClick={() => !autoPickMood && setMoodPickerOpen(true)}
                  disabled={autoPickMood}
                  fullWidth
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    py: 1.25,
                    px: 1.5,
                    mt: 1,
                    borderRadius: '10px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: autoPickMood ? 'rgba(0,122,255,0.05)' : '#fff',
                    color: autoPickMood ? '#007AFF' : '#1D1D1F',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    opacity: autoPickMood ? 0.7 : 1,
                    minWidth: 0,
                    '&:hover': { background: autoPickMood ? 'rgba(0,122,255,0.05)' : 'rgba(0,122,255,0.05)', borderColor: '#007AFF' },
                    '&.Mui-disabled': { color: '#007AFF', background: 'rgba(0,122,255,0.05)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, overflow: 'hidden' }}>
                    {autoPickMood ? (
                      <>
                        <AutoAwesomeIcon sx={{ fontSize: 18, flexShrink: 0 }} />
                        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>AI picks</Box>
                      </>
                    ) : (
                      <>
                        <Box
                          component="img"
                          src={moods.find(m => m.id === selectedMood)?.image}
                          alt={moods.find(m => m.id === selectedMood)?.name}
                          sx={{ width: 22, height: 22, borderRadius: '5px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {moods.find(m => m.id === selectedMood)?.name}
                        </Box>
                      </>
                    )}
                  </Box>
                  {!autoPickMood && <KeyboardArrowDownIcon sx={{ color: '#86868B', fontSize: 20, flexShrink: 0 }} />}
                </Button>
              </Paper>
            </Box>

            {/* Song Length & Language - Side by Side on sm+ */}
            <Box sx={{ display: 'flex', gap: { xs: 0, sm: 3 }, mb: { xs: 0, sm: 3 }, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'flex-start' } }}>
              {/* Song Length Toggle */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  flex: { sm: 1 },
                  mb: { xs: 3, sm: 0 },
                  borderRadius: { xs: '16px', sm: '20px' },
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }}
              >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5, fontSize: '0.95rem' }}>
                Song Length
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 1.5, fontSize: '0.8rem' }}>
                Choose track length
              </Typography>
              <ToggleButtonGroup
                value={songLength}
                exclusive
                onChange={(_e, v) => v && setSongLength(v)}
                fullWidth
                orientation="vertical"
                sx={{
                  gap: 1,
                  '& .MuiToggleButtonGroup-grouped': { border: 'none !important', borderRadius: '12px !important', m: 0 },
                }}
              >
                {/* Short Option */}
                <ToggleButton
                  value="short"
                  sx={{
                    py: 1.25,
                    px: 1.5,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1.5,
                    textTransform: 'none',
                    background: songLength === 'short' ? 'rgba(0,122,255,0.08)' : 'rgba(0,0,0,0.02)',
                    color: '#1D1D1F',
                    border: songLength === 'short' ? '2px solid #007AFF' : '2px solid rgba(0,0,0,0.08)',
                    boxShadow: songLength === 'short' ? '0 4px 16px rgba(0,122,255,0.15)' : 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: songLength === 'short' ? 'rgba(0,122,255,0.12)' : 'rgba(0,0,0,0.04)',
                      borderColor: '#007AFF',
                    },
                    '&.Mui-selected': {
                      background: 'rgba(0,122,255,0.08)',
                      color: '#1D1D1F',
                      '&:hover': { background: 'rgba(0,122,255,0.12)' },
                    },
                  }}
                >
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: songLength === 'short' ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.05)',
                    flexShrink: 0,
                  }}>
                    <TimerIcon sx={{ color: songLength === 'short' ? '#007AFF' : '#86868B', fontSize: 18 }} />
                  </Box>
                  <Box sx={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, color: songLength === 'short' ? '#007AFF' : '#1D1D1F', fontSize: '0.85rem' }}>
                      Short
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#86868B', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      ~30-90 seconds
                    </Typography>
                  </Box>
                </ToggleButton>

                {/* Standard Option */}
                <ToggleButton
                  value="standard"
                  sx={{
                    py: 1.25,
                    px: 1.5,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1.5,
                    textTransform: 'none',
                    background: songLength === 'standard' ? 'rgba(0,122,255,0.08)' : 'rgba(0,0,0,0.02)',
                    color: '#1D1D1F',
                    border: songLength === 'standard' ? '2px solid #007AFF' : '2px solid rgba(0,0,0,0.08)',
                    boxShadow: songLength === 'standard' ? '0 4px 16px rgba(0,122,255,0.15)' : 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: songLength === 'standard' ? 'rgba(0,122,255,0.12)' : 'rgba(0,0,0,0.04)',
                      borderColor: '#007AFF',
                    },
                    '&.Mui-selected': {
                      background: 'rgba(0,122,255,0.08)',
                      color: '#1D1D1F',
                      '&:hover': { background: 'rgba(0,122,255,0.12)' },
                    },
                  }}
                >
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: songLength === 'standard' ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.05)',
                    flexShrink: 0,
                  }}>
                    <MusicNoteIcon sx={{ color: songLength === 'standard' ? '#007AFF' : '#86868B', fontSize: 18 }} />
                  </Box>
                  <Box sx={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, color: songLength === 'standard' ? '#007AFF' : '#1D1D1F', fontSize: '0.85rem' }}>
                      Standard
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#86868B', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      ~1.5-3 minutes
                    </Typography>
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>

              {/* Language Selection */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  flex: { sm: 1 },
                  mb: { xs: 3, sm: 0 },
                  borderRadius: { xs: '16px', sm: '20px' },
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  alignSelf: { sm: 'flex-start' },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5, fontSize: '0.95rem' }}>
                  Language
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868B', mb: 1.5, fontSize: '0.8rem' }}>
                  Select language
                </Typography>
                <Button
                  onClick={() => setLanguagePickerOpen(true)}
                  fullWidth
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    py: 1.25,
                    px: 1.5,
                    borderRadius: '10px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: '#fff',
                    color: '#1D1D1F',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    minWidth: 0,
                    '&:hover': { background: 'rgba(0,122,255,0.05)', borderColor: '#007AFF' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={languages.find(l => l.id === selectedLanguage)?.image}
                      alt={languages.find(l => l.id === selectedLanguage)?.name}
                      sx={{ width: 22, height: 22, borderRadius: '5px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {languages.find(l => l.id === selectedLanguage)?.name}
                    </Box>
                  </Box>
                  <KeyboardArrowDownIcon sx={{ color: '#86868B', fontSize: 20, flexShrink: 0 }} />
                </Button>
              </Paper>
            </Box>

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
                    <TuneIcon sx={{ fontSize: 18, color: creativity <= 3 ? '#007AFF' : creativity >= 7 ? '#AF52DE' : '#5856D6' }} />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      {creativity <= 3 ? 'Literal' : creativity >= 7 ? 'Creative' : 'Balanced'} ({creativity}/10)
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
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
                              cursor: 'pointer',
                              '&:hover .play-overlay': {
                                opacity: 1,
                              },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (song.audioUrl) {
                                const isCurrentSong = currentSong?.songId === song.songId;
                                if (isCurrentSong && isPlaying) {
                                  pauseSong();
                                } else {
                                  playSong({
                                    songId: song.songId,
                                    songTitle: song.songTitle,
                                    genre: song.genre,
                                    audioUrl: song.audioUrl,
                                  } as AudioSong);
                                }
                              }
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
                                  'tropical-house': 'chillout',
                                  'chill': 'chillout',
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
                            {/* Play/Pause overlay */}
                            <Box
                              className="play-overlay"
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(0,0,0,0.5)',
                                opacity: currentSong?.songId === song.songId ? 1 : 0,
                                transition: 'opacity 0.2s',
                              }}
                            >
                              {currentSong?.songId === song.songId && isPlaying ? (
                                <PauseIcon sx={{ fontSize: 24, color: '#fff' }} />
                              ) : (
                                <PlayArrowRoundedIcon sx={{ fontSize: 24, color: '#fff' }} />
                              )}
                            </Box>
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
                overflow: 'hidden',
                maxWidth: '100%',
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
              <Box sx={{ mb: 2, width: '100%', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: '#86868B', fontSize: '0.8rem' }}>
                    Add characters, products or places to your video:
                  </Typography>
                  {/* Scroll arrows - top right */}
                  {(videoCastCanScroll.left || videoCastCanScroll.right) && characters.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => scrollCast(videoCastScrollRef, 'left')}
                        disabled={!videoCastCanScroll.left}
                        sx={{
                          width: 24,
                          height: 24,
                          background: 'rgba(0,0,0,0.04)',
                          opacity: videoCastCanScroll.left ? 1 : 0.4,
                          '&:hover': { background: 'rgba(0,0,0,0.08)' },
                        }}
                      >
                        <ChevronLeftIcon sx={{ fontSize: 16, color: '#86868B' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => scrollCast(videoCastScrollRef, 'right')}
                        disabled={!videoCastCanScroll.right}
                        sx={{
                          width: 24,
                          height: 24,
                          background: 'rgba(0,0,0,0.04)',
                          opacity: videoCastCanScroll.right ? 1 : 0.4,
                          '&:hover': { background: 'rgba(0,0,0,0.08)' },
                        }}
                      >
                        <ChevronRightIcon sx={{ fontSize: 16, color: '#86868B' }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                {isLoadingCharacters ? (
                  <Typography variant="caption" sx={{ color: '#86868B' }}>Loading your cast...</Typography>
                ) : characters.length > 0 ? (
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    {/* Left gradient fade - only show when can scroll left */}
                    {videoCastCanScroll.left && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 24,
                          background: 'linear-gradient(to right, #fff 0%, transparent 100%)',
                          zIndex: 1,
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                    {/* Right gradient fade - only show when can scroll right */}
                    {videoCastCanScroll.right && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: 32,
                          background: 'linear-gradient(to left, #fff 0%, transparent 100%)',
                          zIndex: 1,
                          pointerEvents: 'none',
                        }}
                      />
                    )}
                    <Box 
                      ref={videoCastScrollRef}
                      sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        alignItems: 'center',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        pb: 0.5,
                        pr: 1, // Small padding for last item
                        maxWidth: '100%',
                        '&::-webkit-scrollbar': { display: 'none' },
                      }}>
                      {/* Create Character chip - always first */}
                      <Chip
                        label="+ Create"
                        onClick={() => navigate('/my-cast/create')}
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
                        const charNameLower = char.characterName.toLowerCase();
                        const promptLower = videoPrompt.toLowerCase();
                        const escapedName = charNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp(`(^|\\s|,|\\.|!|\\?)${escapedName}($|\\s|,|\\.|!|\\?)`, 'i');
                        const isInPrompt = regex.test(promptLower);
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
                            label={char.characterName}
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
                  </Box>
                ) : (
                  <Chip
                    label="+ Create a character"
                    onClick={() => navigate('/my-cast/create')}
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
              
              {/* Prompt Adherence Slider */}
              <Box sx={{ mt: 2.5, px: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#86868B' }}>
                      Prompt adherence
                    </Typography>
                    <Tooltip 
                      title="Exact = scenes closely follow your description. Creative = AI interprets freely. Recommended: 5"
                      arrow
                      placement="top"
                    >
                      <InfoOutlinedIcon sx={{ fontSize: 14, color: '#86868B', cursor: 'help' }} />
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#1D1D1F', fontWeight: 500 }}>
                    {videoCreativity <= 3 ? 'Exact' : videoCreativity <= 6 ? 'Balanced' : 'Creative'} ({videoCreativity}/10)
                  </Typography>
                </Box>
                <Slider
                  value={videoCreativity}
                  onChange={(_e, v) => setVideoCreativity(v as number)}
                  min={0}
                  max={10}
                  step={1}
                  sx={{
                    color: '#007AFF',
                    height: 6,
                    '& .MuiSlider-thumb': {
                      width: 18,
                      height: 18,
                      backgroundColor: '#fff',
                      border: '2px solid #007AFF',
                      boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
                      },
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(90deg, #007AFF 0%, #5AC8FA 100%)',
                      border: 'none',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    },
                  }}
                />
              </Box>
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
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', flex: 1 }}>Creativity</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                    <TuneIcon sx={{ fontSize: 18, color: videoCreativity <= 3 ? '#007AFF' : videoCreativity >= 7 ? '#AF52DE' : '#5856D6', flexShrink: 0 }} />
                    <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {videoCreativity <= 3 ? 'Exact' : videoCreativity >= 7 ? 'Creative' : 'Balanced'} ({videoCreativity}/10)
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

