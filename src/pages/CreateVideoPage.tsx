import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
  Popover,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MovieIcon from '@mui/icons-material/Movie';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PaletteIcon from '@mui/icons-material/Palette';
import ImageIcon from '@mui/icons-material/Image';
import AnimationIcon from '@mui/icons-material/Animation';
import CheckIcon from '@mui/icons-material/Check';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TvIcon from '@mui/icons-material/Tv';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessIcon from '@mui/icons-material/Business';
import { RootState } from '../store/store';
import { useGetUserCharactersQuery, useGetUserNarrativesQuery, useGetUserSongsQuery, apiSlice } from '../store/apiSlice';
import { videosApi, songsApi, Narrative } from '../services/api';
import StyledDropdown, { DropdownOption } from '../components/StyledDropdown';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CasinoIcon from '@mui/icons-material/Casino';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GruviCoin from '../components/GruviCoin';
import { useAudioPlayer, Song as AudioPlayerSong } from '../contexts/AudioPlayerContext';

// Character type matching the API response
interface Character {
  characterId: string;
  characterName: string;
  characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App' | 'Business';
  description?: string;
  imageUrls?: string[];
}

// Song type for selection
interface Song {
  songId: string;
  songTitle: string;
  genre: string;
  mood?: string;
  status: 'processing' | 'completed' | 'failed';
  audioUrl?: string;
  actualDuration?: number;
}

// Animated Equalizer Component for song picker
const AudioEqualizer: React.FC<{ isPlaying: boolean; size?: number; color?: string }> = ({
  isPlaying,
  size = 20,
  color = '#007AFF'
}) => {
  const barWidth = size / 5;
  const gap = size / 10;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: `${gap}px`,
        height: size,
        width: size,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            width: barWidth,
            backgroundColor: color,
            borderRadius: `${barWidth / 2}px`,
            height: isPlaying ? undefined : `${size * 0.2}px`,
            minHeight: `${size * 0.15}px`,
            animation: isPlaying
              ? `equalizer${i} 0.${4 + i}s ease-in-out infinite alternate`
              : 'none',
            '@keyframes equalizer0': {
              '0%': { height: `${size * 0.2}px` },
              '100%': { height: `${size * 0.9}px` },
            },
            '@keyframes equalizer1': {
              '0%': { height: `${size * 0.5}px` },
              '100%': { height: `${size * 0.3}px` },
            },
            '@keyframes equalizer2': {
              '0%': { height: `${size * 0.3}px` },
              '100%': { height: `${size * 0.8}px` },
            },
            '@keyframes equalizer3': {
              '0%': { height: `${size * 0.6}px` },
              '100%': { height: `${size * 0.4}px` },
            },
          }}
        />
      ))}
    </Box>
  );
};

// Genre to image mapping - same as AppPage
const genreImages: Record<string, string> = {
  'pop': '/genres/pop.jpeg',
  'hip-hop': '/genres/hip-hop.jpeg',
  'rnb': '/genres/rnb.jpeg',
  'electronic': '/genres/electronic.jpeg',
  'dance': '/genres/dance.jpeg',
  'house': '/genres/house.jpeg',
  'edm': '/genres/edm.jpeg',
  'techno': '/genres/techno.jpeg',
  'rock': '/genres/rock.jpeg',
  'alternative': '/genres/alternative.jpeg',
  'indie': '/genres/indie.jpeg',
  'punk': '/genres/punk.jpeg',
  'metal': '/genres/metal.jpeg',
  'jazz': '/genres/jazz.jpeg',
  'blues': '/genres/blues.jpeg',
  'soul': '/genres/soul.jpeg',
  'funk': '/genres/funk.jpeg',
  'classical': '/genres/classic.jpeg',
  'orchestral': '/genres/orchestral.jpeg',
  'cinematic': '/genres/cinematic.jpeg',
  'country': '/genres/country.jpeg',
  'folk': '/genres/folk.jpeg',
  'acoustic': '/genres/acoustic.jpeg',
  'latin': '/genres/latin.jpeg',
  'reggaeton': '/genres/raggaeton.jpeg',
  'kpop': '/genres/kpop.jpeg',
  'k-pop': '/genres/kpop.jpeg',
  'jpop': '/genres/jpop.jpeg',
  'j-pop': '/genres/jpop.jpeg',
  'reggae': '/genres/raggae.jpeg',
  'lofi': '/genres/lofi.jpeg',
  'ambient': '/genres/ambient.jpeg',
  'chillout': '/genres/chillout.jpeg',
  'chill': '/genres/chillout.jpeg',
  'tropical-house': '/genres/chillout.jpeg',
  'gospel': '/genres/gospels.jpeg',
};

const getGenreImage = (genre: string | undefined): string => {
  if (!genre) return '/genres/pop.jpeg';
  const normalizedGenre = genre.toLowerCase().replace(/\s+/g, '-');
  return genreImages[normalizedGenre] || '/genres/pop.jpeg';
};

// Art styles for music videos - matching HomePage styles
// Art style options (DropdownOption format)
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

// Video content type options for the main dropdown
// Simplified to 3 main types with sub-options via toggles
const videoContentTypes: DropdownOption[] = [
  { id: 'ai-video', label: 'Cinematic Story', description: 'AI-generated scenes' },
  { id: 'ugc', label: 'UGC Creator', description: 'Influencer-style content' },
  { id: 'app-showcase', label: 'App Showcase', description: 'App screenshots + audio' },
];

// Video type options (DropdownOption format)
// Token costs: Still image video = 200 tokens flat, All other videos = 50 tokens per second
const STILL_VIDEO_COST = 200;
const TOKENS_PER_SEC = 50; // 50 credits per second (cinematic, UGC, app showcase)
const BACKGROUND_MUSIC_TOKENS_PER_30S = 50; // 50 tokens per 30 seconds of background music

// Calculate UGC video cost based on audio duration (50 tokens per second)
const getUgcCost = (audioDurationSeconds: number | undefined) => {
  if (!audioDurationSeconds) return TOKENS_PER_SEC; // Default 1s = 50 tokens
  return Math.ceil(audioDurationSeconds) * TOKENS_PER_SEC;
};

// Calculate cinematic video cost based on audio duration (50 tokens per second)
const getCinematicCost = (audioDurationSeconds: number | undefined) => {
  if (!audioDurationSeconds) return TOKENS_PER_SEC; // Default 1s = 50 tokens
  return Math.ceil(audioDurationSeconds) * TOKENS_PER_SEC;
};

// Calculate background music cost (50 tokens per 30 seconds, rounded up)
const getBackgroundMusicCost = (audioDurationSeconds: number | undefined) => {
  if (!audioDurationSeconds) return BACKGROUND_MUSIC_TOKENS_PER_30S; // Default 1 unit
  return Math.ceil(audioDurationSeconds / 30) * BACKGROUND_MUSIC_TOKENS_PER_30S;
};

const videoTypes: (DropdownOption & { baseCredits: number; IconComponent: React.ElementType; tooltip: string })[] = [
  { id: 'still', label: 'Still Image', description: '200 credits', baseCredits: STILL_VIDEO_COST, IconComponent: ImageIcon, tooltip: 'Video with still images. Perfect for storytelling and storybook-style videos where movement isn\'t needed.' },
  { id: 'standard', label: 'Cinematic', description: 'Dynamic pricing', baseCredits: 0, IconComponent: AnimationIcon, tooltip: 'Actual video footage with dynamic camera angles, lip sync, and motion. 50 credits/second.' },
];

// Aspect ratio options (DropdownOption format)
const aspectRatios: (DropdownOption & { Icon: React.ElementType; ratio: string })[] = [
  { id: 'portrait', label: 'Portrait (9:16)', description: 'Best for mobile & social', Icon: SmartphoneIcon, ratio: '9:16' },
  { id: 'landscape', label: 'Landscape (16:9)', description: 'Best for TV & YouTube', Icon: TvIcon, ratio: '16:9' },
];

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
    <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
        sx={{ px: 1, py: 1, flex: 1, overflowY: 'auto', maxHeight: maxHeight !== '100%' ? maxHeight : undefined }}
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
  const { songId: urlSongId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { playSong, pauseSong, currentSong, isPlaying } = useAudioPlayer();

  // Get URL params for preselecting narrative
  const urlNarrativeId = searchParams.get('narrativeId');
  const urlVideoType = searchParams.get('type') as 'story' | 'ugc' | null;

  const [selectedStyle, setSelectedStyle] = useState<string>('3d-cartoon');
  const [videoType, setVideoType] = useState<string>('standard');
  const [aspectRatio, setAspectRatio] = useState<string>('portrait');
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPromptError, setShowPromptError] = useState(false);
  const [rouletteMode, setRouletteMode] = useState(false);

  // Video content type: main categories
  // 'ai-video' - AI-generated scenes (music or story)
  // 'ugc' - UGC/Influencer content (voiceover)
  // 'app-showcase' - App screenshots video (uses Remotion)
  const [videoContentType, setVideoContentType] = useState<'ai-video' | 'ugc' | 'app-showcase'>('ai-video');

  // AI Video audio source toggle: 'music' (song) or 'voiceover' (narrative)
  const [aiVideoAudioSource, setAiVideoAudioSource] = useState<'music' | 'voiceover'>('music');

  // Audio source toggle for App Showcase mode: 'music' or 'voiceover'
  const [appShowcaseAudioSource, setAppShowcaseAudioSource] = useState<'music' | 'voiceover'>('music');

  // Background music option (for narrative videos) - style is AI-generated based on story
  const [includeBackgroundMusic, setIncludeBackgroundMusic] = useState(false);

  // RTK Query for characters - cached and shared across app
  const { data: charactersData, isLoading: isLoadingCharacters } = useGetUserCharactersQuery(
    { userId: user?.userId || '' },
    { skip: !user?.userId }
  );
  const characters = charactersData?.characters || [];

  // RTK Query for narratives - cached and shared across app
  const { data: narrativesData, isLoading: isLoadingNarratives } = useGetUserNarrativesQuery(
    { userId: user?.userId || '' },
    { skip: !user?.userId }
  );
  // Only show completed narratives - memoize to prevent infinite loop in useEffect
  const narratives = useMemo(
    () => (narrativesData?.narratives || []).filter((n: Narrative) => n.status === 'completed'),
    [narrativesData?.narratives]
  );

  // RTK Query for songs (first page) - cached and shared across app
  const { data: songsData, isLoading: isLoadingSongsInitial } = useGetUserSongsQuery(
    { userId: user?.userId || '', page: 1, limit: 20 },
    { skip: !user?.userId }
  );
  // Filter to completed songs only - memoize to prevent re-renders
  const cachedSongs = useMemo(
    () => (songsData?.songs || []).filter((s: Song) => s.status === 'completed'),
    [songsData?.songs]
  );

  // Additional songs from "load more" or search - local state for pagination/search
  const [additionalSongs, setAdditionalSongs] = useState<Song[]>([]);
  const [isSearchingSongs, setIsSearchingSongs] = useState(false);
  // When searching, only show search results. Otherwise combine cached + paginated songs
  const songs = useMemo(
    () => isSearchingSongs
      ? additionalSongs
      : [...cachedSongs, ...additionalSongs.filter(s => !cachedSongs.find(c => c.songId === s.songId))],
    [cachedSongs, additionalSongs, isSearchingSongs]
  );
  const isLoadingSongs = isLoadingSongsInitial;

  // Narrative selection state (for narrative videos)
  const [selectedNarrativeId, setSelectedNarrativeId] = useState<string | null>(null);

  // Song selection state
  const [selectedSongId, setSelectedSongId] = useState<string | null>(urlSongId || null);

  // Sync URL song param when navigating between routes (component may not remount)
  useEffect(() => {
    if (urlSongId && urlSongId !== selectedSongId) {
      setSelectedSongId(urlSongId);
      // Ensure we're in music mode when a song is pre-selected
      setVideoContentType('ai-video');
      setAiVideoAudioSource('music');
    }
  }, [urlSongId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Character selection state
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Picker states
  const [castPickerOpen, setCastPickerOpen] = useState(false);
  const [songPickerOpen, setSongPickerOpen] = useState(false);
  const [narrativePickerOpen, setNarrativePickerOpen] = useState(false);

  // Anchor elements for popovers
  const [songPickerAnchor, setSongPickerAnchor] = useState<HTMLElement | null>(null);
  const [castPickerAnchor, setCastPickerAnchor] = useState<HTMLElement | null>(null);
  const [narrativePickerAnchor, setNarrativePickerAnchor] = useState<HTMLElement | null>(null);

  // Narrative audio preview state
  const [previewingNarrativeId, setPreviewingNarrativeId] = useState<string | null>(null);
  const narrativeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Song picker search and pagination (server-side)
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [songPickerPage, setSongPickerPage] = useState(1);
  const [songPickerTotalCount, setSongPickerTotalCount] = useState(0);
  const [isLoadingMoreSongs, setIsLoadingMoreSongs] = useState(false);
  const songSearchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const SONGS_PAGE_SIZE = 10;

  // Derive content type helpers from videoContentType and sub-toggles
  const isAiVideo = videoContentType === 'ai-video';
  const isUgc = videoContentType === 'ugc';
  const isAppShowcase = videoContentType === 'app-showcase';

  // AI Video sub-types (derived from toggle)
  const isMusic = isAiVideo && aiVideoAudioSource === 'music';
  const isStory = isAiVideo && aiVideoAudioSource === 'voiceover';

  // App Showcase audio source (derived from toggle)
  const appShowcaseNeedsMusic = isAppShowcase && appShowcaseAudioSource === 'music';
  const appShowcaseNeedsVoiceover = isAppShowcase && appShowcaseAudioSource === 'voiceover';

  // What audio sources are needed for the current configuration
  const needsVoiceover = isStory || isUgc || appShowcaseNeedsVoiceover;
  const needsSong = isMusic || appShowcaseNeedsMusic;

  // Filter narratives based on video content type - memoize for performance
  const filteredNarratives = useMemo(
    () => narratives.filter(n => {
      if (isStory) return n.narrativeType === 'story';
      if (isUgc) return n.narrativeType === 'ugc';
      if (appShowcaseNeedsVoiceover) return true; // App Showcase can use any narrative
      return true;
    }),
    [narratives, isStory, isUgc, appShowcaseNeedsVoiceover]
  );

  // Filter characters for App Showcase - only show App type
  const filteredCharacters = useMemo(
    () => isAppShowcase
      ? characters.filter(c => c.characterType === 'App')
      : characters,
    [characters, isAppShowcase]
  );

  // Max cast members allowed:
  // - Music video: max 5
  // - Story video: max 8 of any type
  // - UGC: max 2 (1 character + 1 product/app/place)
  // - App Showcase: max 1 (single app)
  const MAX_CAST_MEMBERS = isMusic ? 5 :
    isStory ? 8 :
    isUgc ? 2 :
    isAppShowcase ? 1 : 5;

  // Helper to get asset type group (Place and Business are treated as same category)
  const getAssetGroup = (type?: string) =>
    (type === 'Place' || type === 'Business') ? 'Place/Business' : type;

  // Check if selection is allowed for a character type
  const canSelectCharacter = (char: Character) => {
    const isCharacter = char.characterType === 'Human' || char.characterType === 'Non-Human' || !char.characterType;
    const isAsset = char.characterType === 'Product' || char.characterType === 'App' ||
                    char.characterType === 'Business' || char.characterType === 'Place';

    const selectedChars = characters.filter(c => selectedCharacterIds.includes(c.characterId));
    const selectedCharacterCount = selectedChars.filter(c =>
      c.characterType === 'Human' || c.characterType === 'Non-Human' || !c.characterType
    ).length;
    const selectedAssets = selectedChars.filter(c =>
      c.characterType === 'Product' || c.characterType === 'App' ||
      c.characterType === 'Business' || c.characterType === 'Place'
    );
    const selectedAssetGroup = selectedAssets.length > 0
      ? getAssetGroup(selectedAssets[0].characterType) : null;

    // App Showcase: only allow App type assets
    if (isAppShowcase) {
      return char.characterType === 'App' && selectedCharacterIds.length < 1;
    }

    // UGC: 1 character + 1 product/app/place
    if (isUgc) {
      const hasCharacter = selectedCharacterCount > 0;
      const hasAsset = selectedAssets.length > 0;
      if (isCharacter && hasCharacter) return false;
      if (isAsset && hasAsset) return false;
      return true;
    }

    // General rules for Music/Story videos:
    // 1. Max 4 characters (Human/Non-Human) when any asset is selected
    // 2. Only ONE asset type allowed (Product OR App OR Place/Business)
    // 3. Total count limit still applies

    // Check total count limit
    if (selectedCharacterIds.length >= MAX_CAST_MEMBERS) return false;

    // Character limit: max 4 when assets are selected
    if (isCharacter && selectedAssets.length > 0 && selectedCharacterCount >= 4) return false;

    // Asset mixing rule: can't mix different asset types
    if (isAsset && selectedAssetGroup && selectedAssetGroup !== getAssetGroup(char.characterType)) {
      return false;
    }

    return true;
  };

  // Derived: selected cast members with full character data
  const selectedCastMembers = characters.filter(char =>
    selectedCharacterIds.includes(char.characterId)
  );

  // Group characters by type - use filteredCharacters for App Showcase
  const groupedCharacters = filteredCharacters.reduce((acc, char) => {
    const type = char.characterType || 'Human';
    if (!acc[type]) acc[type] = [];
    acc[type].push(char);
    return acc;
  }, {} as Record<string, Character[]>);

  // Order of character types for display - App Showcase only shows App type
  const characterTypeOrder = isAppShowcase
    ? ['App']
    : ['Human', 'Non-Human', 'Product', 'Place', 'App', 'Business'];

  // Load more songs for pagination (beyond cached first page)
  const fetchSongsForPicker = useCallback(async (page = 1, search = '', append = false) => {
    if (!user?.userId) return;

    // Page 1 without search is handled by RTK Query cache
    if (page === 1 && !search) {
      setSongPickerPage(1);
      setSongPickerTotalCount(songsData?.totalCount || cachedSongs.length);
      return;
    }

    if (append) {
      setIsLoadingMoreSongs(true);
    }

    try {
      const response = await songsApi.getUserSongs(user.userId, {
        page,
        limit: SONGS_PAGE_SIZE,
        search: search || undefined,
      });

      // Filter to only completed songs with audio
      const fetchedSongs = (response.data?.songs || []).filter(
        (song: Song) => song.status === 'completed' && song.audioUrl
      );
      const pagination = response.data?.pagination;

      if (append) {
        setAdditionalSongs(prev => [...prev, ...fetchedSongs]);
      } else {
        // For search results, replace additional songs
        setAdditionalSongs(fetchedSongs);
      }

      if (pagination?.totalCount !== undefined) {
        setSongPickerTotalCount(pagination.totalCount);
      } else {
        setSongPickerTotalCount(fetchedSongs.length);
      }
      setSongPickerPage(page);
    } catch (error) {
      console.error('Failed to fetch songs:', error);
    } finally {
      setIsLoadingMoreSongs(false);
    }
  }, [user?.userId, songsData?.totalCount, cachedSongs.length]);

  // Track previous search query to detect actual changes
  const prevSongSearchQueryRef = useRef(songSearchQuery);

  // Debounced search for song picker - only triggers on actual search query changes
  useEffect(() => {
    // Skip if picker is not open
    if (!songPickerOpen) return;

    // Only fetch if search query actually changed (not just on picker open)
    if (prevSongSearchQueryRef.current === songSearchQuery) return;
    prevSongSearchQueryRef.current = songSearchQuery;

    // Update search mode
    setIsSearchingSongs(!!songSearchQuery.trim());

    if (songSearchDebounceRef.current) {
      clearTimeout(songSearchDebounceRef.current);
    }

    songSearchDebounceRef.current = setTimeout(() => {
      fetchSongsForPicker(1, songSearchQuery);
    }, 300);

    return () => {
      if (songSearchDebounceRef.current) {
        clearTimeout(songSearchDebounceRef.current);
      }
    };
  }, [songSearchQuery, songPickerOpen, fetchSongsForPicker]);

  // Set initial song picker count from RTK Query data
  useEffect(() => {
    if (songsData?.totalCount) {
      setSongPickerTotalCount(songsData.totalCount);
    }
  }, [songsData?.totalCount]);

  // Handle URL params for preselecting narrative and video type
  useEffect(() => {
    if (urlNarrativeId && narratives.length > 0) {
      const narrative = narratives.find(n => n.narrativeId === urlNarrativeId);
      if (narrative) {
        setSelectedNarrativeId(urlNarrativeId);
        // Auto-load characters from the narrative, or clear if none
        setSelectedCharacterIds(
          narrative.characterIds && narrative.characterIds.length > 0
            ? narrative.characterIds
            : []
        );
        // Set video content type based on URL param or narrative type
        if (urlVideoType === 'story') {
          setVideoContentType('ai-video');
          setAiVideoAudioSource('voiceover');
        } else if (urlVideoType === 'ugc') {
          setVideoContentType('ugc');
        } else if (narrative.narrativeType === 'story') {
          setVideoContentType('ai-video');
          setAiVideoAudioSource('voiceover');
        } else if (narrative.narrativeType === 'ugc' || narrative.narrativeType === 'content') {
          setVideoContentType('ugc');
        }
      }
    }
  }, [urlNarrativeId, urlVideoType, narratives]);

  // Auto-select Cinematic video type when UGC with voiceover is selected (Still not supported for UGC)
  // Stop narrative audio preview when picker closes
  useEffect(() => {
    if (!narrativePickerOpen && previewingNarrativeId) {
      narrativeAudioRef.current?.pause();
      setPreviewingNarrativeId(null);
    }
  }, [narrativePickerOpen, previewingNarrativeId]);

  // Cleanup narrative audio on unmount
  useEffect(() => {
    return () => {
      narrativeAudioRef.current?.pause();
    };
  }, []);

  // Toggle character selection
  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacterIds(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else if (prev.length < MAX_CAST_MEMBERS) {
        return [...prev, characterId];
      }
      return prev;
    });
  };

  // Get audio duration from selected song or narrative
  const getAudioDuration = (): number | undefined => {
    if (needsSong && selectedSongId) {
      const song = songs.find(s => s.songId === selectedSongId);
      return song?.actualDuration;
    }
    if (needsVoiceover && selectedNarrativeId) {
      const narrative = narratives.find(n => n.narrativeId === selectedNarrativeId);
      // durationMs is in milliseconds, convert to seconds
      return narrative?.durationMs ? narrative.durationMs / 1000 : undefined;
    }
    return undefined;
  };

  // Get credits for selected video type (includes background music if enabled)
  const getCredits = () => {
    let baseCost = 0;
    if (isUgc) {
      const audioDuration = getAudioDuration();
      baseCost = getUgcCost(audioDuration); // 100 tokens per 5 seconds for UGC videos
    } else if (videoType === 'still') {
      baseCost = STILL_VIDEO_COST;
    } else {
      // Voiceover: 50 credits/10s based on audio duration
      const audioDuration = getAudioDuration();
      baseCost = getCinematicCost(audioDuration);
    }

    // Add background music cost if enabled (for voiceover videos)
    if (needsVoiceover && includeBackgroundMusic) {
      baseCost += getBackgroundMusicCost(getAudioDuration());
    }

    return baseCost;
  };

  // Get a human-readable cost breakdown string for transparency
  const getCostBreakdown = (): string => {
    const audioDuration = getAudioDuration();
    const parts: string[] = [];

    if (videoType === 'still') {
      parts.push('200 flat');
    } else {
      if (audioDuration) {
        const cost = isUgc ? getUgcCost(audioDuration) : getCinematicCost(audioDuration);
        parts.push(`${cost} video (${Math.round(audioDuration)}s × 50/s)`);
      } else {
        parts.push('50 tokens/s');
      }
    }

    if (needsVoiceover && includeBackgroundMusic) {
      if (audioDuration) {
        parts.push(`${getBackgroundMusicCost(audioDuration)} music`);
      } else {
        parts.push('music 50/30s');
      }
    }

    return parts.join(' + ');
  };

  const handleGenerate = async () => {
    // For App Showcase, require an app asset
    if (isAppShowcase && selectedCharacterIds.length === 0) {
      setNotification({
        open: true,
        message: 'Please select an app first',
        severity: 'error'
      });
      return;
    }

    // For music videos or App Showcase with music, require a song
    if (needsSong && !selectedSongId) {
      setNotification({
        open: true,
        message: 'Please select a song first',
        severity: 'error'
      });
      return;
    }

    // For voiceover videos or App Showcase with voiceover, require a voiceover
    if (needsVoiceover && !selectedNarrativeId) {
      setNotification({
        open: true,
        message: 'Please select a voiceover first',
        severity: 'error'
      });
      return;
    }

    // Validation: prompt is required for all except roulette mode (app showcase don't support roulette)
    // App Showcase prompt is optional - it will use default if not provided
    if (!videoPrompt.trim() && !rouletteMode && !isAppShowcase) {
      setShowPromptError(true);
      setNotification({
        open: true,
        message: isMusic
          ? 'Please describe your music video concept or use Gruvi Roulette'
          : (isStory || isUgc)
          ? 'Please describe your video content or use Gruvi Roulette'
          : 'Please describe your video concept',
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
      // Map frontend consolidated types to backend types
      // AI Video: 'music' or 'story' based on aiVideoAudioSource
      // UGC: always 'ugc-voiceover'
      // App Showcase: 'app-promo-music' or 'app-promo-voiceover' based on appShowcaseAudioSource
      let backendVideoContentType: 'music' | 'story' | 'ugc-voiceover' | 'app-promo-music' | 'app-promo-voiceover';
      if (isAiVideo) {
        backendVideoContentType = aiVideoAudioSource === 'music' ? 'music' : 'story';
      } else if (isUgc) {
        backendVideoContentType = 'ugc-voiceover';
      } else if (isAppShowcase) {
        backendVideoContentType = appShowcaseAudioSource === 'music' ? 'app-promo-music' : 'app-promo-voiceover';
      } else {
        backendVideoContentType = 'music'; // fallback
      }

      const response = await videosApi.generateVideo({
        userId: user.userId,
        songId: needsSong ? selectedSongId : undefined,
        narrativeId: needsVoiceover ? selectedNarrativeId : undefined,
        videoType: videoType as 'still' | 'standard' | 'professional',
        style: selectedStyle,
        videoPrompt: rouletteMode ? '' : videoPrompt.trim(),
        aspectRatio: aspectRatio as 'portrait' | 'landscape',
        characterIds: selectedCharacterIds,
        rouletteMode: isAppShowcase ? false : rouletteMode,
        videoContentType: backendVideoContentType,
        includeBackgroundMusic: needsVoiceover && !isAppShowcase ? includeBackgroundMusic : undefined,
      });

      // Update tokens in UI with actual value from backend
      if (response.data.tokensRemaining !== undefined) {
        dispatch(setTokensRemaining(response.data.tokensRemaining));
      }

      // Invalidate videos cache so My Videos page shows the new processing video
      dispatch(apiSlice.util.invalidateTags([{ type: 'Videos', id: 'LIST' }]));

      navigate('/my-videos?generating=true');
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

  // Handle narrative audio preview
  const handleNarrativePreview = useCallback((narrative: Narrative, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't select the narrative when clicking play

    if (!narrative.audioUrl) return;

    // If already playing this narrative, stop it
    if (previewingNarrativeId === narrative.narrativeId) {
      narrativeAudioRef.current?.pause();
      setPreviewingNarrativeId(null);
      return;
    }

    // Stop any currently playing audio
    narrativeAudioRef.current?.pause();

    // Create and play new audio
    const audio = new Audio(narrative.audioUrl);
    narrativeAudioRef.current = audio;
    audio.play();
    setPreviewingNarrativeId(narrative.narrativeId);

    // Reset when audio ends
    audio.onended = () => {
      setPreviewingNarrativeId(null);
    };
  }, [previewingNarrativeId]);

  // Helper to get narrator character for a narrative
  const getNarratorForNarrative = useCallback((narrative: Narrative) => {
    return characters.find(c => c.characterId === narrative.narratorId);
  }, [characters]);

  return (
    <Box sx={{ pt: { xs: 0, md: 2 }, pb: 4, px: { xs: 2, sm: 3, md: 4 },width: '100%', minWidth: 0, display: "flex", flexDirection: "column", mx: 'auto' }}>
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
            <MovieIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              Create Video
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              {isMusic ? 'Transform your song into a stunning video' :
               'Create UGC & influencer content with AI'}
            </Typography>
          </Box>
        </Box>

        {/* View My Videos button - Full on large, icon on small */}
        <Button
          variant="contained"
          onClick={() => navigate('/my-videos')}
          startIcon={<VideoLibraryIcon />}
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
          View My Videos
        </Button>
        {/* Circle icon button for small screens */}
        <IconButton
          onClick={() => navigate('/my-videos')}
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
          <VideoLibraryIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box sx={{ display: 'flex', flexDirection: { xs:'column', sm: 'column', md: "column", lg: "row"  }, gap: 3, width: '100%', minWidth: 0 }}>
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
            {/* Video Content Type Dropdown */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Video Type
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                Choose your video content type
              </Typography>
              <StyledDropdown
                options={videoContentTypes}
                value={videoContentType}
                onChange={(value) => {
                  setVideoContentType(value as 'ai-video' | 'ugc' | 'app-showcase');
                  // Clear selections when switching modes
                  setSelectedCharacterIds([]);
                  setSelectedSongId(null);
                  setSelectedNarrativeId(null);
                  // App Showcase doesn't support roulette mode
                  if (value === 'app-showcase') {
                    setRouletteMode(false);
                  }
                }}
                placeholder="Select video type"
                fullWidth
              />
            </Box>

            {/* AI Video Audio Source Toggle */}
            {isAiVideo && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Audio Source
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                Choose music or voiceover for your video
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                  onClick={() => { setAiVideoAudioSource('music'); setSelectedNarrativeId(null); }}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: '12px',
                    border: `2px solid ${aiVideoAudioSource === 'music' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                    background: aiVideoAudioSource === 'music' ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: aiVideoAudioSource === 'music' ? '#007AFF' : 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <MusicNoteIcon sx={{ fontSize: '1rem', color: '#fff' }} />
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>Music</Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Sync to song</Typography>
                </Box>
                <Box
                  onClick={() => { setAiVideoAudioSource('voiceover'); setSelectedSongId(null); }}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: '12px',
                    border: `2px solid ${aiVideoAudioSource === 'voiceover' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                    background: aiVideoAudioSource === 'voiceover' ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: aiVideoAudioSource === 'voiceover' ? '#007AFF' : 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <RecordVoiceOverIcon sx={{ fontSize: '1rem', color: '#fff' }} />
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>Voiceover</Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>Story narration</Typography>
                </Box>
              </Box>
            </Box>
            )}

            {/* Avatar Voice Selection removed - UGC is now always voiceover-based */}
            {/* Background Music Option - for avatar prompt-driven mode removed */}
            {/* App Showcase Audio Source Toggle */}
            {isAppShowcase && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Audio Source
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                Choose music or voiceover for your app showcase
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                  onClick={() => { setAppShowcaseAudioSource('music'); setSelectedNarrativeId(null); }}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: '12px',
                    border: `2px solid ${appShowcaseAudioSource === 'music' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                    background: appShowcaseAudioSource === 'music' ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: appShowcaseAudioSource === 'music' ? '#007AFF' : 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <MusicNoteIcon sx={{ fontSize: '1rem', color: '#fff' }} />
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>Music</Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                    Sync to song beats
                  </Typography>
                </Box>
                <Box
                  onClick={() => setAppShowcaseAudioSource('voiceover')}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: '12px',
                    border: `2px solid ${appShowcaseAudioSource === 'voiceover' ? '#007AFF' : 'rgba(255,255,255,0.1)'}`,
                    background: appShowcaseAudioSource === 'voiceover' ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: appShowcaseAudioSource === 'voiceover' ? '#007AFF' : 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <RecordVoiceOverIcon sx={{ fontSize: '1rem', color: '#fff' }} />
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>Voiceover</Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                    Sync to narration
                  </Typography>
                </Box>
              </Box>
            </Box>
            )}

            {/* Voiceover Selection - only for story and ugc modes */}
            {needsVoiceover && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Select Voiceover
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

              <Box
                onClick={(e) => {
                  if (!isLoadingNarratives) {
                    setNarrativePickerAnchor(e.currentTarget);
                    setNarrativePickerOpen(true);
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1.5,
                  px: 2,
                  borderRadius: '12px',
                  border: (selectedNarrativeId || narrativePickerOpen) ? '2px solid #5856D6' : '1px solid rgba(255,255,255,0.1)',
                  background: narrativePickerOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                  cursor: isLoadingNarratives ? 'not-allowed' : 'pointer',
                  opacity: isLoadingNarratives ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: isLoadingNarratives ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                    borderColor: isLoadingNarratives ? 'rgba(255,255,255,0.1)' : (selectedNarrativeId || narrativePickerOpen) ? '#5856D6' : 'rgba(88,86,214,0.3)',
                  },
                }}
              >
                {isLoadingNarratives ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: '#fff' }} />
                    <span>Loading voiceovers...</span>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                    {selectedNarrativeId ? (
                      (() => {
                        const selectedNarrative = narratives.find(n => n.narrativeId === selectedNarrativeId);
                        const narrator = selectedNarrative ? getNarratorForNarrative(selectedNarrative) : null;
                        const narratorImage = narrator?.imageUrls?.[0];
                        return narratorImage ? (
                          <Avatar
                            src={narratorImage}
                            sx={{
                              width: 32,
                              height: 32,
                              flexShrink: 0,
                              border: '2px solid #5856D6',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <RecordVoiceOverIcon sx={{ fontSize: 16, color: '#fff' }} />
                          </Box>
                        );
                      })()
                    ) : (
                      <RecordVoiceOverIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }} />
                    )}
                    <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
                      {selectedNarrativeId ? (
                        <>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {narratives.find(n => n.narrativeId === selectedNarrativeId)?.title || 'Selected Voiceover'}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                            {(() => {
                              const durationMs = narratives.find(n => n.narrativeId === selectedNarrativeId)?.durationMs;
                              if (!durationMs) return 'Audio voiceover';
                              const totalSecs = Math.floor(durationMs / 1000);
                              return `${Math.floor(totalSecs / 60)}:${String(totalSecs % 60).padStart(2, '0')}`;
                            })()}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                          Choose a voiceover for your video
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                <KeyboardArrowDownIcon sx={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
              </Box>
            </Box>
            )}

            {/* Background Music Option - only for narrative videos */}
            {needsVoiceover && selectedNarrativeId && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <MusicNoteIcon sx={{ fontSize: 20, color: '#007AFF' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                    Background Music
                  </Typography>
                  <Chip
                    label="Optional"
                    size="small"
                    sx={{
                      ml: 'auto',
                      background: 'rgba(0,122,255,0.15)',
                      color: '#007AFF',
                      fontWeight: 600,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>

                {/* Toggle for background music */}
                <Box
                  onClick={() => setIncludeBackgroundMusic(!includeBackgroundMusic)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    px: 2,
                    borderRadius: '12px',
                    border: includeBackgroundMusic ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                    background: includeBackgroundMusic ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: includeBackgroundMusic ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        minWidth: 20,
                        width: 20,
                        height: 20,
                        borderRadius: '4px',
                        border: includeBackgroundMusic ? '2px solid #007AFF' : '2px solid rgba(255,255,255,0.3)',
                        background: includeBackgroundMusic ? '#007AFF' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {includeBackgroundMusic && <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
                        Add instrumental background music
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        Soft music that plays behind your narration
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.25 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <GruviCoin size={14} />
                      <Typography sx={{ fontSize: '0.75rem', color: '#007AFF', fontWeight: 600 }}>
                        +{(() => {
                          const narrative = narratives.find(n => n.narrativeId === selectedNarrativeId);
                          const durationSecs = narrative?.durationMs ? narrative.durationMs / 1000 : 60;
                          return Math.ceil(durationSecs / 30) * 50;
                        })()}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>
                      50 tokens/30s
                    </Typography>
                  </Box>
                </Box>

                {/* Music style is now AI-generated based on the story content */}
              </Box>
            )}

            {/* Song Selection - only for music videos */}
            {needsSong && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  Select Song
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

              <Box
                onClick={(e) => {
                  if (!isLoadingSongs) {
                    setSongPickerAnchor(e.currentTarget);
                    setSongPickerOpen(true);
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 1.5,
                  px: 2,
                  borderRadius: '12px',
                  border: (selectedSongId || songPickerOpen) ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                  background: songPickerOpen ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                  cursor: isLoadingSongs ? 'not-allowed' : 'pointer',
                  opacity: isLoadingSongs ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: isLoadingSongs ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                    borderColor: isLoadingSongs ? 'rgba(255,255,255,0.1)' : (selectedSongId || songPickerOpen) ? '#007AFF' : 'rgba(0,122,255,0.3)',
                  },
                }}
              >
                {isLoadingSongs ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: '#fff' }} />
                    <span>Loading songs...</span>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                    {selectedSongId ? (
                      <Box
                        component="img"
                        src={getGenreImage(songs.find(s => s.songId === selectedSongId)?.genre)}
                        alt="Song genre"
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <MusicNoteIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.5)' }} />
                    )}
                    <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
                      {selectedSongId ? (
                        <>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {songs.find(s => s.songId === selectedSongId)?.songTitle || 'Selected Song'}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                            {songs.find(s => s.songId === selectedSongId)?.genre}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Choose a song for your video
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                <KeyboardArrowDownIcon sx={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
              </Box>

              {songs.length === 0 && !isLoadingSongs && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mb: 1 }}>
                    No songs yet. Create your first song!
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/create/music')}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      borderColor: '#007AFF',
                      color: '#007AFF',
                    }}
                  >
                    Create Music
                  </Button>
                </Box>
              )}
            </Box>
            )}

            {/* Video Prompt */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <AutoAwesomeIcon sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  {rouletteMode ? 'Video Concept' : 'Video Prompt'}
                </Typography>
                {!rouletteMode && (
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
                )}
              </Box>

              {/* Cast Selection - always visible (even in roulette mode) */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1 }}>
                  {isAppShowcase
                    ? 'Select your app (App type only):'
                    : isUgc
                    ? 'Add AI assets (1 character + 1 product max):'
                    : `Add AI assets to your video (max ${MAX_CAST_MEMBERS}):`}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
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
                          background: 'rgba(0,122,255,0.1)',
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
                        onDelete={() => handleCharacterToggle(char.characterId)}
                        avatar={<CharacterAvatar character={char} size={24} />}
                        sx={{
                          background: 'rgba(0,122,255,0.1)',
                          border: '1.5px solid #007AFF',
                          fontWeight: 500,
                          pl: 0.5,
                          '& .MuiChip-label': { color: '#fff', pl: 1 },
                          '& .MuiChip-avatar': { ml: 0 },
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

              {/* Text field with integrated Roulette button */}
              {rouletteMode ? (
                // Roulette mode - show special UI
                <Box
                  sx={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(0,122,255,0.08) 0%, rgba(88,86,214,0.08) 50%, rgba(255,45,85,0.08) 100%)',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                    position: 'relative',
                    p: 3,
                    minHeight: 4 * 24 + 32,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '16px',
                      padding: '2px',
                      background: 'linear-gradient(135deg, #007AFF, #5856D6, #FF2D55)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    },
                    '&:hover': {
                      transform: 'scale(1.01)',
                    },
                  }}
                  onClick={() => setRouletteMode(false)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <CasinoIcon sx={{ fontSize: 32, color: '#5856D6' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                      Gruvi Roulette Active
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', textAlign: 'center', maxWidth: 320 }}>
                    {isMusic
                      ? "We'll create an epic video concept based on your track. Sit back and let the magic happen!"
                      : "We'll create an amazing voiceover video for you. Sit back and let the magic happen!"}
                  </Typography>
                  <Typography sx={{ color: '#007AFF', fontSize: '0.75rem', mt: 2, fontWeight: 500 }}>
                    Click to enter your own prompt instead
                  </Typography>
                </Box>
              ) : (
                // Normal text field with integrated bottom bar
              <Box
                sx={{
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: (showPromptError && !videoPrompt.trim())
                    ? '2px solid #f44336'
                    : videoPrompt.trim()
                      ? '2px solid #007AFF'
                      : '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: (showPromptError && !videoPrompt.trim())
                      ? '#f44336'
                      : videoPrompt.trim()
                        ? '#007AFF'
                        : 'rgba(0,122,255,0.3)',
                    background: 'rgba(255,255,255,0.08)',
                  },
                  '&:focus-within': {
                    borderColor: (showPromptError && !videoPrompt.trim()) ? '#f44336' : '#007AFF',
                    borderWidth: '2px',
                  },
                }}
              >
                {/* Text input area */}
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={videoPrompt}
                  onChange={(e) => {
                    setVideoPrompt(e.target.value);
                    if (e.target.value.trim()) setShowPromptError(false);
                  }}
                  placeholder={isMusic
                    ? "Describe the scenes, setting, and story for your music video..."
                    : "Describe the voiceover video - what story to tell or what the character should say..."}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      background: 'transparent',
                      color: '#fff',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused fieldset': { border: 'none' },
                    },
                    '& .MuiInputBase-input': {
                      '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                    },
                  }}
                />

                {/* Divider and Roulette button */}
                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', px: 2, py: 1.5, display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip
                    title={
                      <Box sx={{ p: 0.5, textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.5, color: '#fff' }}>
                          Feeling lucky?
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
                          Let Gruvi AI pick for you
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          background: 'linear-gradient(135deg, #5856D6 0%, #FF2D55 100%)',
                          borderRadius: '12px',
                          px: 2,
                          py: 1.5,
                          maxWidth: 220,
                          '& .MuiTooltip-arrow': {
                            color: '#5856D6',
                          },
                        },
                      },
                    }}
                  >
                  <Box
                    onClick={() => {
                      setRouletteMode(true);
                      setVideoPrompt('');
                      setShowPromptError(false);
                    }}
                    sx={{
                      background: '#5856D6',
                      border: 'none',
                      borderRadius: '20px',
                      px: 1.5,
                      py: 0.5,
                      gap: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5856D6 0%, #FF2D55 100%)',
                      },
                    }}
                  >
                    <CasinoIcon sx={{ fontSize: 14, color: '#fff' }} />
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
                      Roulette
                    </Typography>
                  </Box>
                  </Tooltip>
                </Box>
              </Box>
              )}
              {/* Error message */}
              {showPromptError && !videoPrompt.trim() && !rouletteMode && (
                <Typography sx={{ color: '#f44336', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>
                  Please describe your {isMusic ? 'music video' : 'voiceover video'} or use Gruvi Roulette
                </Typography>
              )}
            </Box>

            {/* Visual Style, Video Type, Aspect Ratio - Each on own row */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Visual Style - hidden for App Showcase (uses app screenshots directly) */}
              {!isAppShowcase && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                  Visual Style
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                  Choose the art style for your video
                </Typography>
                <StyledDropdown
                    options={artStyles}
                    value={selectedStyle}
                    onChange={setSelectedStyle}
                    placeholder="Select style"
                    fullWidth
                  />
              </Box>
              )}

              {/* Video Type */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                    Video Type
                  </Typography>
                  <Tooltip
                    title="Still Image videos use AI-generated images with your audio. Cinematic videos use actual video footage with dynamic camera angles, lip sync, and motion - priced based on audio length."
                    placement="top"
                    arrow
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: '#1E1E22',
                          color: '#fff',
                          fontSize: '0.8rem',
                          maxWidth: 280,
                          border: '1px solid rgba(255,255,255,0.1)',
                          '& .MuiTooltip-arrow': {
                            color: '#1E1E22',
                          },
                        },
                      },
                    }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', cursor: 'help' }} />
                  </Tooltip>
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                  Choose between still images or cinematic video
                </Typography>
                <ToggleButtonGroup
                  value={videoType}
                  exclusive
                  onChange={(_, value) => value && setVideoType(value)}
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
                  {videoTypes.map((type) => {
                    const TypeIcon = type.IconComponent;
                    const isSelected = videoType === type.id;
                    // Disable "Still" for all UGC (uses OmniHuman) and App Showcase (uses Remotion)
                    const isDisabled = type.id === 'still' && (isUgc || isAppShowcase);
                    // Show rate on the button, not total
                    const creditsText = type.id === 'still'
                      ? `${STILL_VIDEO_COST} credits`
                      : '50 tokens/s';
                    return (
                      <Tooltip
                        key={type.id}
                        title={type.tooltip}
                        placement="top"
                        arrow
                        slotProps={{
                          tooltip: {
                            sx: {
                              bgcolor: '#1E1E22',
                              color: '#fff',
                              fontSize: '0.8rem',
                              maxWidth: 250,
                              border: '1px solid rgba(255,255,255,0.1)',
                              '& .MuiTooltip-arrow': {
                                color: '#1E1E22',
                              },
                            },
                          },
                        }}
                      >
                        <ToggleButton
                          value={type.id}
                          disabled={isDisabled}
                          sx={{
                            flexDirection: 'column',
                            gap: 0.5,
                            py: 2,
                            opacity: isDisabled ? 0.4 : 1,
                            '&.Mui-disabled': {
                              color: 'rgba(255,255,255,0.3)',
                            },
                          }}
                        >
                          <TypeIcon sx={{ fontSize: 28, color: isDisabled ? 'rgba(255,255,255,0.3)' : isSelected ? '#007AFF' : 'rgba(255,255,255,0.5)' }} />
                          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: isDisabled ? 'rgba(255,255,255,0.3)' : isSelected ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                            {type.label}
                          </Typography>
                          <Typography variant="body2" sx={{ color: isDisabled ? 'rgba(255,255,255,0.2)' : isSelected ? '#5AC8FA' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>
                            {isDisabled ? 'Not available for UGC' : creditsText}
                          </Typography>
                        </ToggleButton>
                      </Tooltip>
                    );
                  })}
                </ToggleButtonGroup>
              </Box>

              {/* Aspect Ratio */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                  Aspect Ratio
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                  Choose the format for your video
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
                  {aspectRatios.map((ar) => {
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

                {/* Type chip */}
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
                  {(() => {
                    const typeInfo = videoTypes.find(t => t.id === videoType);
                    const TypeIcon = typeInfo?.IconComponent;
                    return (
                      <>
                        {TypeIcon && <TypeIcon sx={{ fontSize: 16, color: '#5856D6' }} />}
                        <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                          {typeInfo?.label}
                        </Typography>
                      </>
                    );
                  })()}
                </Box>

                {/* Aspect Ratio chip */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '20px',
                  background: aspectRatio === 'portrait' ? 'rgba(255, 149, 0, 0.15)' : 'rgba(52, 199, 89, 0.15)',
                  border: aspectRatio === 'portrait' ? '1px solid rgba(255, 149, 0, 0.3)' : '1px solid rgba(52, 199, 89, 0.3)',
                }}>
                  {(() => {
                    const arInfo = aspectRatios.find(ar => ar.id === aspectRatio);
                    const ArIcon = arInfo?.Icon;
                    return (
                      <>
                        {ArIcon && <ArIcon sx={{ fontSize: 16, color: aspectRatio === 'portrait' ? '#FF9500' : '#34C759' }} />}
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
                    {getCredits()}
                  </Typography>
                  <GruviCoin size={16} />
                  <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', ml: 0.25 }}>
                    {getCostBreakdown()}
                  </Typography>
                </Box>
              </Box>

              {/* Generate Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={isGenerating || (!videoPrompt.trim() && !rouletteMode) || (needsSong && !selectedSongId) || (needsVoiceover && !selectedNarrativeId)}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '12px',
                    background: needsVoiceover
                      ? 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)'
                      : 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                    boxShadow: needsVoiceover
                      ? '0 8px 24px rgba(88,86,214,0.3)'
                      : '0 8px 24px rgba(0,122,255,0.3)',
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
                    needsSong ? 'Generate Music Video' :
                    isUgc ? 'Generate UGC Video' :
                    'Generate Voiceover Video'
                  )}
                </Button>
              </Box>

              <Typography
                variant="caption"
                sx={{ textAlign: 'center', mt: 2, display: 'block', color: 'rgba(255,255,255,0.5)' }}
              >
                Generation typically takes 5-10 minutes
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                Summary
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                  {getCredits()} x
                </Typography>
                <GruviCoin size={20} />
              </Box>
            </Box>

            {/* Summary bullets */}
            <Box sx={{ mb: 3, mt: 3 }}>
              {/* Pricing line item */}
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Pricing</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', flex: 1, color: 'rgba(255,255,255,0.6)' }}>
                  {getCostBreakdown()}
                </Typography>
              </Box>
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
              <Box sx={{ display: 'flex', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Type</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  {(() => {
                    const typeInfo = videoTypes.find(t => t.id === videoType);
                    const TypeIcon = typeInfo?.IconComponent;
                    return (
                      <>
                        {TypeIcon && <TypeIcon sx={{ fontSize: 18, color: '#007AFF' }} />}
                        <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#fff' }}>
                          {typeInfo?.label}
                        </Typography>
                      </>
                    );
                  })()}
                </Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography sx={{ fontSize: '0.9rem', flex: 1, color: '#fff' }}>Aspect Ratio</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                  {(() => {
                    const arInfo = aspectRatios.find(ar => ar.id === aspectRatio);
                    const ArIcon = arInfo?.Icon;
                    return (
                      <>
                        {ArIcon && <ArIcon sx={{ fontSize: 18, color: aspectRatio === 'portrait' ? '#FF9500' : '#34C759' }} />}
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
              onClick={handleGenerate}
              disabled={isGenerating || (!videoPrompt.trim() && !rouletteMode) || (needsSong && !selectedSongId) || (needsVoiceover && !selectedNarrativeId)}
              sx={{
                py: 2,
                borderRadius: '16px',
                background: needsVoiceover
                  ? 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)'
                  : 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                boxShadow: needsVoiceover
                  ? '0 8px 24px rgba(88,86,214,0.3)'
                  : '0 8px 24px rgba(0,122,255,0.3)',
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
                needsSong ? 'Generate Music Video' :
                isUgc ? 'Generate UGC Video' :
                'Generate Voiceover Video'
              )}
            </Button>

            <Typography
              variant="caption"
              sx={{ textAlign: 'center', mt: 2, display: 'block', color: 'rgba(255,255,255,0.5)' }}
            >
              Generation typically takes 5-10 minutes
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
          {filteredCharacters.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: 2 }}>
                {isAppShowcase ? 'No App assets yet - create one first' : 'No AI assets yet'}
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
                <AddIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Create Asset
              </Button>
            </Box>
          ) : (
            characterTypeOrder.map((type) => {
              const typeCharacters = groupedCharacters[type];
              if (!typeCharacters || typeCharacters.length === 0) return null;
              const typeStyle = getCharacterTypeStyle(type);
              const TypeIcon = typeStyle.icon;
              return (
                <Box key={type}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: typeStyle.iconBg,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      <TypeIcon sx={{ fontSize: 14, color: '#fff' }} />
                    </Box>
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {typeStyle.label}
                    </Typography>
                  </Box>
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
                            py: 0.5,
                            px: 2,
                            background: isSelected ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                            opacity: isDisabled ? 0.5 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            '&:hover': { background: isDisabled ? 'transparent' : 'rgba(255,255,255,0.08)' },
                          }}
                        >
                          <ListItemAvatar sx={{ minWidth: 40, flexShrink: 0 }}>
                            <CharacterAvatar character={char} size={28} square />
                          </ListItemAvatar>
                          <ListItemText
                            primary={char.characterName}
                            secondary={char.description || type}
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
            })
          )}
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

      {/* Song Picker Popover */}
      <Popover
        open={songPickerOpen}
        anchorEl={songPickerAnchor}
        onClose={() => {
          setSongPickerOpen(false);
          setSongPickerAnchor(null);
          setSongSearchQuery('');
          setIsSearchingSongs(false);
          setAdditionalSongs([]);
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
              minWidth: 320,
              maxWidth: 400,
              maxHeight: 420,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        {/* Search input */}
        <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search songs..."
            value={songSearchQuery}
            onChange={(e) => setSongSearchQuery(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#007AFF' },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
                fontSize: '0.9rem',
                '&::placeholder': { color: 'rgba(255,255,255,0.5)' },
              },
            }}
          />
        </Box>

        {/* Song list */}
        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {/* Loading overlay */}
          {isLoadingSongs && songSearchQuery && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(20,20,24,0.8)',
              zIndex: 1,
            }}>
              <CircularProgress size={24} sx={{ color: '#007AFF' }} />
            </Box>
          )}

          <List sx={{
            py: 0.5,
            maxHeight: 300,
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 0, background: 'transparent' },
            scrollbarWidth: 'none',
          }}>
            {songs.length === 0 && !songSearchQuery ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: 2 }}>
                  No songs yet
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSongPickerOpen(false);
                    setSongPickerAnchor(null);
                    navigate('/create/music');
                  }}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    borderColor: '#007AFF',
                    color: '#007AFF',
                  }}
                >
                  <MusicNoteIcon sx={{ mr: 1, fontSize: 18 }} />
                  Create Music
                </Button>
              </Box>
            ) : songs.length === 0 && songSearchQuery ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                  No songs match "{songSearchQuery}"
                </Typography>
              </Box>
            ) : (
              <>
                {songs.map((song) => {
                  const isSelected = selectedSongId === song.songId;
                  const isCurrentlyPlaying = currentSong?.songId === song.songId;
                  const isThisSongPlaying = isCurrentlyPlaying && isPlaying;
                  return (
                    <ListItem key={song.songId} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          setSelectedSongId(song.songId);
                          setSongPickerOpen(false);
                          setSongPickerAnchor(null);
                          setSongSearchQuery('');
                          setIsSearchingSongs(false);
                          setAdditionalSongs([]);
                        }}
                        sx={{
                          py: 1.5,
                          px: 2,
                          background: isSelected ? 'rgba(0, 122, 255, 0.15)' : 'transparent',
                          '&:hover': { background: 'rgba(255,255,255,0.08)' },
                        }}
                      >
                        {/* Song thumbnail with equalizer overlay */}
                        <ListItemAvatar sx={{ minWidth: 48 }}>
                          <Box sx={{ position: 'relative', width: 36, height: 36 }}>
                            <Avatar
                              src={getGenreImage(song.genre)}
                              sx={{ width: 36, height: 36 }}
                            />
                            {isThisSongPlaying && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  borderRadius: '50%',
                                  background: 'rgba(0,0,0,0.6)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <AudioEqualizer isPlaying={true} size={16} color="#fff" />
                              </Box>
                            )}
                          </Box>
                        </ListItemAvatar>

                        <ListItemText
                          primary={song.songTitle}
                          secondary={`${song.genre}${song.actualDuration ? ` • ${Math.floor(song.actualDuration / 60)}:${String(Math.floor(song.actualDuration % 60)).padStart(2, '0')}` : ''}`}
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

                        {/* Play/Pause button */}
                        {song.audioUrl && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isThisSongPlaying) {
                                pauseSong();
                              } else {
                                playSong({
                                  songId: song.songId,
                                  songTitle: song.songTitle,
                                  genre: song.genre,
                                  audioUrl: song.audioUrl,
                                  status: song.status,
                                  createdAt: '',
                                } as AudioPlayerSong, songs.filter(s => s.audioUrl).map(s => ({
                                  songId: s.songId,
                                  songTitle: s.songTitle,
                                  genre: s.genre,
                                  audioUrl: s.audioUrl,
                                  status: s.status,
                                  createdAt: '',
                                } as AudioPlayerSong)));
                              }
                            }}
                            sx={{
                              ml: 1,
                              color: isThisSongPlaying ? '#007AFF' : 'rgba(255,255,255,0.6)',
                              bgcolor: isThisSongPlaying ? 'rgba(0, 122, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                              '&:hover': {
                                bgcolor: isThisSongPlaying ? 'rgba(0, 122, 255, 0.3)' : 'rgba(255,255,255,0.1)',
                              },
                            }}
                          >
                            {isThisSongPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                          </IconButton>
                        )}

                        {isSelected && (
                          <CheckIcon sx={{ color: '#007AFF', fontSize: 20, ml: 1 }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
                {songs.length < songPickerTotalCount && (
                  <Box sx={{ p: 1.5, textAlign: 'center' }}>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => fetchSongsForPicker(songPickerPage + 1, songSearchQuery, true)}
                      disabled={isLoadingMoreSongs}
                      sx={{
                        color: '#007AFF',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >
                      {isLoadingMoreSongs ? (
                        <CircularProgress size={14} sx={{ mr: 1, color: '#007AFF' }} />
                      ) : null}
                      Load More
                    </Button>
                  </Box>
                )}
              </>
            )}
          </List>
        </Box>
      </Popover>

      {/* Narrative Picker Popover */}
      <Popover
        open={narrativePickerOpen}
        anchorEl={narrativePickerAnchor}
        onClose={() => {
          setNarrativePickerOpen(false);
          setNarrativePickerAnchor(null);
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
              minWidth: 320,
              maxWidth: 400,
              maxHeight: 420,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
            Select Voiceover
          </Typography>
        </Box>

        {/* Voiceover list */}
        <List sx={{
          py: 0.5,
          maxHeight: 340,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 0, background: 'transparent' },
          scrollbarWidth: 'none',
        }}>
          {filteredNarratives.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: 2 }}>
{isStory ? 'No story voiceovers yet' : isUgc ? 'No UGC voiceovers yet' : 'No voiceovers yet'}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setNarrativePickerOpen(false);
                  setNarrativePickerAnchor(null);
                  navigate('/create/narrative');
                }}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  borderColor: '#5856D6',
                  color: '#5856D6',
                }}
              >
                <RecordVoiceOverIcon sx={{ mr: 1, fontSize: 18 }} />
                Create Voiceover
              </Button>
            </Box>
          ) : (
            filteredNarratives.map((narrative) => {
              const isSelected = selectedNarrativeId === narrative.narrativeId;
              const isPlaying = previewingNarrativeId === narrative.narrativeId;
              const narrator = getNarratorForNarrative(narrative);
              const narratorImage = narrator?.imageUrls?.[0];

              return (
                <ListItem key={narrative.narrativeId} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setSelectedNarrativeId(narrative.narrativeId);
                      // Auto-load characters from the narrative, or clear if none
                      setSelectedCharacterIds(
                        narrative.characterIds && narrative.characterIds.length > 0
                          ? narrative.characterIds
                          : []
                      );
                      setNarrativePickerOpen(false);
                      setNarrativePickerAnchor(null);
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      background: isSelected ? 'rgba(88, 86, 214, 0.15)' : 'transparent',
                      '&:hover': { background: 'rgba(255,255,255,0.08)' },
                    }}
                  >
                    {/* Narrator Avatar */}
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      {narratorImage ? (
                        <Avatar
                          src={narratorImage}
                          sx={{
                            width: 36,
                            height: 36,
                            border: isSelected ? '2px solid #5856D6' : '2px solid transparent',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: isSelected
                              ? 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)'
                              : 'rgba(88,86,214,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <RecordVoiceOverIcon sx={{ fontSize: 18, color: isSelected ? '#fff' : '#5856D6' }} />
                        </Box>
                      )}
                    </ListItemAvatar>

                    <ListItemText
                      primary={narrative.title}
                      secondary={narrative.durationMs
                        ? `${Math.floor(narrative.durationMs / 1000 / 60)}:${String(Math.floor(narrative.durationMs / 1000 % 60)).padStart(2, '0')}`
                        : 'Audio voiceover'}
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

                    {/* Play/Pause Preview Button */}
                    {narrative.audioUrl && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleNarrativePreview(narrative, e)}
                        sx={{
                          ml: 1,
                          width: 32,
                          height: 32,
                          background: isPlaying ? 'rgba(88,86,214,0.3)' : 'rgba(255,255,255,0.08)',
                          '&:hover': { background: isPlaying ? 'rgba(88,86,214,0.4)' : 'rgba(255,255,255,0.15)' },
                        }}
                      >
                        {isPlaying ? (
                          <PauseIcon sx={{ fontSize: 18, color: '#5856D6' }} />
                        ) : (
                          <PlayArrowIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
                        )}
                      </IconButton>
                    )}

                    {isSelected && (
                      <CheckIcon sx={{ color: '#5856D6', fontSize: 20, ml: 1 }} />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })
          )}
        </List>
      </Popover>

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

