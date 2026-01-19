import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
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
import { videosApi, charactersApi, songsApi, narrativesApi, Narrative } from '../services/api';
import StyledDropdown, { DropdownOption } from '../components/StyledDropdown';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import CasinoIcon from '@mui/icons-material/Casino';
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

// Video type options (DropdownOption format)
// Token costs: Still image video = 40 tokens, Cinematic video = 1000 tokens
const videoTypes: (DropdownOption & { credits: number; IconComponent: React.ElementType })[] = [
  { id: 'still', label: 'Still Image', description: '40 credits', credits: 40, IconComponent: ImageIcon },
  { id: 'standard', label: 'Cinematic', description: '1000 credits', credits: 1000, IconComponent: AnimationIcon },
];

// Aspect ratio options (DropdownOption format)
const aspectRatios: (DropdownOption & { Icon: React.ElementType; ratio: string })[] = [
  { id: 'portrait', label: 'Portrait (9:16)', description: 'Best for mobile & social', Icon: SmartphoneIcon, ratio: '9:16' },
  { id: 'landscape', label: 'Landscape (16:9)', description: 'Best for TV & YouTube', Icon: TvIcon, ratio: '16:9' },
];

// Helper to get character type icon and color
const getCharacterTypeIcon = (characterType?: string): { icon: React.ElementType; color: string } => {
  switch (characterType) {
    case 'Product': return { icon: InventoryIcon, color: '#34C759' };
    case 'Place': return { icon: HomeIcon, color: '#AF52DE' };
    case 'App': return { icon: PhoneIphoneIcon, color: '#5856D6' };
    case 'Business': return { icon: BusinessIcon, color: '#FF3B30' };
    case 'Non-Human': return { icon: PetsIcon, color: '#FF9500' };
    default: return { icon: PersonIcon, color: '#007AFF' };
  }
};

// Character Avatar component that shows icon when no image
const CharacterAvatar: React.FC<{
  character: Character;
  size?: number;
  sx?: object;
}> = ({ character, size = 40, sx = {} }) => {
  const hasImage = character.imageUrls && character.imageUrls.length > 0 && character.imageUrls[0];

  if (hasImage) {
    return (
      <Avatar
        src={character.imageUrls![0]}
        sx={{ width: size, height: size, ...sx }}
      />
    );
  }

  const { icon: IconComponent, color } = getCharacterTypeIcon(character.characterType);
  return (
    <Box sx={{
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `${color}15`,
      border: `2px solid ${color}30`,
      ...sx
    }}>
      <IconComponent sx={{ fontSize: size * 0.55, color }} />
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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { playSong, pauseSong, currentSong, isPlaying } = useAudioPlayer();

  const [selectedStyle, setSelectedStyle] = useState<string>('3d-cartoon');
  const [videoType, setVideoType] = useState<string>('still');
  const [aspectRatio, setAspectRatio] = useState<string>('portrait');
  const [videoPrompt, setVideoPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPromptError, setShowPromptError] = useState(false);
  const [rouletteMode, setRouletteMode] = useState(false);

  // Video content type: 'music' for music videos, 'narrative' for UGC/influencer content
  const [contentType, setContentType] = useState<'music' | 'narrative'>('music');

  // Narrative selection state (for narrative videos)
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [selectedNarrativeId, setSelectedNarrativeId] = useState<string | null>(null);
  const [isLoadingNarratives, setIsLoadingNarratives] = useState(false);

  // Song selection state
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(urlSongId || null);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);

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

  // Picker states
  const [castPickerOpen, setCastPickerOpen] = useState(false);
  const [songPickerOpen, setSongPickerOpen] = useState(false);
  const [narrativePickerOpen, setNarrativePickerOpen] = useState(false);

  // Anchor elements for popovers
  const [songPickerAnchor, setSongPickerAnchor] = useState<HTMLElement | null>(null);
  const [castPickerAnchor, setCastPickerAnchor] = useState<HTMLElement | null>(null);
  const [narrativePickerAnchor, setNarrativePickerAnchor] = useState<HTMLElement | null>(null);

  // Song picker search and pagination (server-side)
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [songPickerPage, setSongPickerPage] = useState(1);
  const [songPickerTotalCount, setSongPickerTotalCount] = useState(0);
  const [isLoadingMoreSongs, setIsLoadingMoreSongs] = useState(false);
  const songSearchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const SONGS_PAGE_SIZE = 10;

  // Get the selected narrative to determine its type
  const selectedNarrative = narratives.find(n => n.narrativeId === selectedNarrativeId);
  const selectedNarrativeType = selectedNarrative?.narrativeType; // 'story' | 'ugc' | undefined

  // Max cast members allowed:
  // - Music video: max 5
  // - Narrative (Story): max 8 of any type
  // - Narrative (UGC): max 1 character + 1 product/app/place
  const MAX_CAST_MEMBERS = contentType === 'music' ? 5 :
    selectedNarrativeType === 'ugc' ? 2 : 8;

  // Check if selection is allowed for a character type
  const canSelectCharacter = (char: Character) => {
    // Music video or Story narrative: simple count limit
    if (contentType === 'music' || selectedNarrativeType === 'story' || !selectedNarrativeType) {
      return selectedCharacterIds.length < MAX_CAST_MEMBERS;
    }

    // UGC narrative: 1 character + 1 product/app/place
    const isCharacter = char.characterType === 'Human' || char.characterType === 'Non-Human' || !char.characterType;
    const isProduct = char.characterType === 'Product' || char.characterType === 'App' || char.characterType === 'Business' || char.characterType === 'Place';

    const selectedChars = characters.filter(c => selectedCharacterIds.includes(c.characterId));
    const hasCharacter = selectedChars.some(c => c.characterType === 'Human' || c.characterType === 'Non-Human' || !c.characterType);
    const hasProduct = selectedChars.some(c => c.characterType === 'Product' || c.characterType === 'App' || c.characterType === 'Business' || c.characterType === 'Place');

    if (isCharacter && hasCharacter) return false;
    if (isProduct && hasProduct) return false;
    return true;
  };

  // Derived: selected cast members with full character data
  const selectedCastMembers = characters.filter(char =>
    selectedCharacterIds.includes(char.characterId)
  );

  // Group characters by type
  const groupedCharacters = characters.reduce((acc, char) => {
    const type = char.characterType || 'Human';
    if (!acc[type]) acc[type] = [];
    acc[type].push(char);
    return acc;
  }, {} as Record<string, Character[]>);

  // Order of character types for display
  const characterTypeOrder = ['Human', 'Non-Human', 'Product', 'Place', 'App', 'Business'];

  // Fetch songs for picker with server-side search/pagination
  const fetchSongsForPicker = useCallback(async (page = 1, search = '', append = false) => {
    if (!user?.userId) return;

    if (append) {
      setIsLoadingMoreSongs(true);
    } else {
      setIsLoadingSongs(true);
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
        setSongs(prev => [...prev, ...fetchedSongs]);
      } else {
        setSongs(fetchedSongs);
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
      setIsLoadingSongs(false);
      setIsLoadingMoreSongs(false);
    }
  }, [user?.userId]);

  // Initial fetch on mount
  useEffect(() => {
    fetchSongsForPicker(1, '');
  }, [fetchSongsForPicker]);

  // Track previous search query to detect actual changes
  const prevSongSearchQueryRef = useRef(songSearchQuery);

  // Debounced search for song picker - only triggers on actual search query changes
  useEffect(() => {
    // Skip if picker is not open
    if (!songPickerOpen) return;

    // Only fetch if search query actually changed (not just on picker open)
    if (prevSongSearchQueryRef.current === songSearchQuery) return;
    prevSongSearchQueryRef.current = songSearchQuery;

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

  // Fetch user's narratives on mount
  useEffect(() => {
    const fetchNarratives = async () => {
      if (!user?.userId) return;

      setIsLoadingNarratives(true);
      try {
        const response = await narrativesApi.getUserNarratives(user.userId);
        // Filter to only completed narratives with audio
        const completedNarratives = (response.data?.narratives || []).filter(
          (n: Narrative) => n.status === 'completed' && n.audioUrl
        );
        setNarratives(completedNarratives);
      } catch (error) {
        console.error('Failed to fetch narratives:', error);
      } finally {
        setIsLoadingNarratives(false);
      }
    };

    fetchNarratives();
  }, [user?.userId]);

  // Auto-select Cinematic video type when UGC narrative is selected (Still not supported for UGC)
  useEffect(() => {
    if (contentType === 'narrative' && selectedNarrativeType === 'ugc' && videoType === 'still') {
      setVideoType('standard');
    }
  }, [contentType, selectedNarrativeType, videoType]);

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

  // Get credits for selected video type
  const getCredits = () => {
    return videoTypes.find(t => t.id === videoType)?.credits || 0;
  };

  const handleGenerate = async () => {
    // For music videos, require a song
    if (contentType === 'music' && !selectedSongId) {
      setNotification({
        open: true,
        message: 'Please select a song first',
        severity: 'error'
      });
      return;
    }

    // For voiceover videos, require a voiceover
    if (contentType === 'narrative' && !selectedNarrativeId) {
      setNotification({
        open: true,
        message: 'Please select a voiceover first',
        severity: 'error'
      });
      return;
    }

    // Validation: either need prompt or roulette mode
    if (!videoPrompt.trim() && !rouletteMode) {
      setShowPromptError(true);
      setNotification({
        open: true,
        message: contentType === 'music'
          ? 'Please describe your music video concept or use Gruvi Roulette'
          : 'Please describe your voiceover video content or use Gruvi Roulette',
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
        songId: contentType === 'music' ? selectedSongId : undefined,
        narrativeId: contentType === 'narrative' ? selectedNarrativeId : undefined,
        videoType: videoType as 'still' | 'standard' | 'professional',
        style: selectedStyle,
        videoPrompt: rouletteMode ? '' : videoPrompt.trim(),
        aspectRatio: aspectRatio as 'portrait' | 'landscape',
        characterIds: rouletteMode ? [] : selectedCharacterIds,
        rouletteMode,
        contentType, // 'music' or 'narrative'
      });

      // Update tokens in UI with actual value from backend
      if (response.data.tokensRemaining !== undefined) {
        dispatch(setTokensRemaining(response.data.tokensRemaining));
      }

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

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 },width: '100%', minWidth: 0, display: "flex", flexDirection: "column", mx: 'auto' }}>
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
              {contentType === 'music' ? 'Transform your song into a stunning video' : 'Create UGC & influencer content with AI'}
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
            {/* Content Type Toggle */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 1.5 }}>
                Video Type
              </Typography>
              <ToggleButtonGroup
                value={contentType}
                exclusive
                onChange={(_, value) => {
                  if (value) {
                    setContentType(value);
                    // Clear selections when switching modes
                    setSelectedCharacterIds([]);
                    if (value === 'narrative') {
                      setSelectedSongId(null);
                    } else {
                      setSelectedNarrativeId(null);
                    }
                  }
                }}
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
                <ToggleButton value="music" sx={{ flexDirection: 'column', gap: 0.5, py: 2 }}>
                  <MusicNoteIcon sx={{ fontSize: 28, color: contentType === 'music' ? '#007AFF' : 'rgba(255,255,255,0.5)' }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: contentType === 'music' ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                    Music Video
                  </Typography>
                  <Typography variant="body2" sx={{ color: contentType === 'music' ? '#5AC8FA' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                    Song-driven content
                  </Typography>
                </ToggleButton>
                <ToggleButton value="narrative" sx={{ flexDirection: 'column', gap: 0.5, py: 2 }}>
                  <RecordVoiceOverIcon sx={{ fontSize: 28, color: contentType === 'narrative' ? '#007AFF' : 'rgba(255,255,255,0.5)' }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: contentType === 'narrative' ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                    Voiceover Video
                  </Typography>
                  <Typography variant="body2" sx={{ color: contentType === 'narrative' ? '#5AC8FA' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                    UGC & influencer
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Voiceover Selection - only for voiceover videos */}
            {contentType === 'narrative' && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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

            {/* Song Selection - only for music videos */}
            {contentType === 'music' && (
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

              {/* Cast Selection - hidden in roulette mode */}
              {!rouletteMode && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1 }}>
                  {contentType === 'narrative' && selectedNarrativeType === 'ugc'
                    ? 'Add AI assets (1 character + 1 product/place max):'
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
              )}

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
                    {contentType === 'music'
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
                  placeholder={contentType === 'music'
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
                  Please describe your {contentType === 'music' ? 'music video' : 'voiceover video'} or use Gruvi Roulette
                </Typography>
              )}
            </Box>

            {/* Visual Style, Video Type, Aspect Ratio - Each on own row */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Visual Style */}
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

              {/* Video Type */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                  Video Type
                </Typography>
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
                    // Disable "Still" for UGC narratives (UGC uses OmniHuman which requires cinematic)
                    const isDisabled = type.id === 'still' && contentType === 'narrative' && selectedNarrativeType === 'ugc';
                    return (
                      <ToggleButton
                        key={type.id}
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
                          {isDisabled ? 'Not available for UGC' : `${type.credits} credits`}
                        </Typography>
                      </ToggleButton>
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
                </Box>
              </Box>

              {/* Generate Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={isGenerating || (!videoPrompt.trim() && !rouletteMode) || (contentType === 'music' && !selectedSongId) || (contentType === 'narrative' && !selectedNarrativeId)}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: '12px',
                    background: contentType === 'narrative'
                      ? 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)'
                      : 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                    boxShadow: contentType === 'narrative'
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
                    contentType === 'narrative' ? 'Generate Voiceover Video' : 'Generate Music Video'
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
            <Box sx={{ mb: 3 }}>
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
              disabled={isGenerating || (!videoPrompt.trim() && !rouletteMode) || (contentType === 'music' && !selectedSongId) || (contentType === 'narrative' && !selectedNarrativeId)}
              sx={{
                py: 2,
                borderRadius: '16px',
                background: contentType === 'narrative'
                  ? 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)'
                  : 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                boxShadow: contentType === 'narrative'
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
                contentType === 'narrative' ? 'Generate Voiceover Video' : 'Generate Music Video'
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
              background: '#1D1D1F',
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
                <AddIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Create Asset
              </Button>
            </Box>
          ) : (
            characterTypeOrder.map((type) => {
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
              background: '#1D1D1F',
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
              background: 'rgba(29,29,31,0.8)',
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
              background: '#1D1D1F',
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
          {narratives.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: 2 }}>
                No voiceovers yet
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
            narratives.map((narrative) => {
              const isSelected = selectedNarrativeId === narrative.narrativeId;
              return (
                <ListItem key={narrative.narrativeId} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setSelectedNarrativeId(narrative.narrativeId);
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
                    <ListItemAvatar sx={{ minWidth: 48 }}>
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

