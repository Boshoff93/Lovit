import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Paper,
  Chip,
  Pagination,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  SelectChangeEvent,
  Divider,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { songsApi } from '../services/api';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import LyricsIcon from '@mui/icons-material/Lyrics';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import PublishIcon from '@mui/icons-material/Publish';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { videosApi } from '../services/api';
import { useAccountData } from '../hooks/useAccountData';
import { GhostButton, GhostIconButton } from '../components/GhostButton';
import { VideoLoadingPlaceholder } from '../components/VideoLoadingPlaceholder';

// Genre options for filter with images
const genreOptions = [
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
  { id: 'tropical-house', name: 'Tropical House', image: '/genres/chillout.jpeg' },
  { id: 'gospel', name: 'Gospel', image: '/genres/gospels.jpeg' },
];

// Mood options for filter with images
const moodOptions = [
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

// Animated Equalizer Component
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

// Image cache map to avoid reloading
const imageCache = new Map<string, HTMLImageElement>();

// Preload and cache an image
const preloadImage = (src: string): void => {
  if (!src || imageCache.has(src)) return;
  const img = new Image();
  img.src = src;
  imageCache.set(src, img);
};

// Preload static images on module load
const staticImages = [
  '/gruvi.png',
  '/gruvi/octopus-landscape-wait.jpeg',
  '/gruvi/octopus-portrait-wait.jpeg',
  '/gruvi/gruvi-fail-landscape.jpeg',
  '/gruvi/gruvi-fail-portrait.jpeg',
];
staticImages.forEach(preloadImage);

// Genre to image mapping
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

// Mood to image mapping
const moodImages: Record<string, string> = {
  'happy': '/moods/happy.jpeg',
  'sad': '/moods/sad.jpeg',
  'energetic': '/moods/energetic.jpeg',
  'romantic': '/moods/romantic.jpeg',
  'chill': '/moods/chill.jpeg',
  'epic': '/moods/epic.jpeg',
  'dreamy': '/moods/dreamy.jpeg',
  'dark': '/moods/dark.jpeg',
  'uplifting': '/moods/uplifting.jpeg',
  'nostalgic': '/moods/nostalgic.jpeg',
  'peaceful': '/moods/peacful.jpeg',
  'intense': '/moods/intense.jpeg',
  'melancholic': '/moods/melancholic.jpeg',
  'playful': '/moods/playful.jpeg',
  'mysterious': '/moods/mysterious.jpeg',
  'triumphant': '/moods/triumphant.jpeg',
  'promotional': '/moods/promotional.jpeg',
};

const getMoodImage = (mood: string): string => {
  const normalizedMood = mood.toLowerCase().replace(/\s+/g, '-');
  return moodImages[normalizedMood] || '/moods/happy.jpeg';
};

interface Song {
  songId: string;
  songTitle: string;
  genre: string;
  mood?: string;
  actualDuration?: number;
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  progressMessage?: string;
  audioUrl?: string;
  coverUrl?: string; // Cover art URL for user-uploaded songs
  lyrics?: string;
  lyricsWithTags?: string;
  songPrompt?: string; // Original prompt used to generate the song
  language?: string;
  customInstructions?: string;
  creativity?: number; // 0-10 scale for prompt adherence
  songLength?: 'short' | 'standard'; // Song duration preference
  isUserUpload?: boolean; // Flag for user-uploaded content
  artist?: string; // Artist name for user-uploaded songs
  isPremium?: boolean; // Premium track (ElevenLabs)
}

interface Video {
  videoId: string;
  songId: string;
  songTitle?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'interrupted';
  progress?: number;
  progressMessage?: string;
  queuePosition?: number; // Position in queue (1-indexed)
  createdAt: string;
  duration?: number;
  aspectRatio?: 'portrait' | 'landscape';
  videoCategory?: 'app' | 'place' | 'product' | 'music'; // Type of video based on characters used
}

// Helper to get video category label for display
const getVideoCategoryLabel = (category?: string): string => {
  switch (category) {
    case 'app': return 'App Video';
    case 'place': return 'Place Video';
    case 'product': return 'Product Video';
    case 'music':
    default: return 'Music Video';
  }
};

// VideoCard component with hover preview
interface VideoCardProps {
  video: Video;
  isDeleting: boolean;
  onWatch: (video: Video) => void;
  onMenuClick: (e: React.MouseEvent<HTMLElement>, video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isDeleting, onWatch, onMenuClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Store the video URL when hover starts to prevent URL changes from resetting playback
  const videoUrlRef = useRef<string | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      onMouseEnter={() => {
        // Capture the current video URL when hover starts
        videoUrlRef.current = video.videoUrl || null;
        hoverTimeoutRef.current = setTimeout(() => {
          setIsHovered(true);
        }, 200);
      }}
      onMouseLeave={() => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        setIsHovered(false);
        setIsVideoReady(false);
        videoUrlRef.current = null;
      }}
      onClick={() => video.status === 'completed' && onWatch(video)}
      sx={{
        position: 'relative',
        aspectRatio: video.aspectRatio === 'landscape' ? '16/9' : '9/16',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: video.status === 'completed' ? 'pointer' : 'default',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        opacity: isDeleting ? 0.5 : 1,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': video.status === 'completed' ? {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        } : {},
      }}
    >
      {/* Thumbnail Image or Loading Placeholder */}
      {(video.status === 'processing' || video.status === 'queued' || video.status === 'interrupted') ? (
        <VideoLoadingPlaceholder
          aspectRatio={video.aspectRatio as 'landscape' | 'portrait'}
          progress={video.progress || 0}
          message={video.progressMessage || 'Creating your video...'}
          isQueued={video.status === 'queued'}
          queuePosition={video.queuePosition}
        />
      ) : (
        <Box
          component="img"
          src={
            video.status === 'completed'
              ? (video.thumbnailUrl || '/gruvi/gruvi-with-background.jpeg')
              : (video.aspectRatio === 'landscape' ? '/gruvi/gruvi-fail-landscape.jpeg' : '/gruvi/gruvi-fail-portrait.jpeg')
          }
          alt={video.songTitle || 'Music Video'}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = '/gruvi/gruvi-with-background.jpeg';
          }}
        />
      )}

      {/* Video Preview on Hover */}
      {video.status === 'completed' && videoUrlRef.current && isHovered && (
        <Box
          component="video"
          src={videoUrlRef.current}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setIsVideoReady(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            background: 'transparent',
            opacity: isVideoReady ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}

      {/* Info overlay at bottom - only for completed/failed videos */}
      {(video.status === 'completed' || video.status === 'failed') && (
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
          pt: 4,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }}
      >
        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {video.songTitle || 'Music Video'}
        </Typography>
        {video.status === 'failed' ? (
          <Chip
            label="Failed"
            size="small"
            sx={{
              background: 'rgba(239,68,68,0.9)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 500,
              height: 24,
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          />
        ) : (
          <Chip
            label={getVideoCategoryLabel(video.videoCategory)}
            size="small"
            sx={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 500,
              height: 24,
              borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          />
        )}
      </Box>
      )}

      {/* More Menu Button - Top right */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onMenuClick(e, video);
        }}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          width: 32,
          height: 32,
          '&:hover': {
            background: 'rgba(0,0,0,0.5)',
          },
        }}
      >
        {isDeleting ? (
          <CircularProgress size={16} sx={{ color: '#fff' }} />
        ) : (
          <MoreVertIcon sx={{ fontSize: 18 }} />
        )}
      </IconButton>
    </Box>
  );
};

interface AppPageProps {
  defaultTab?: 'songs' | 'videos';
}

const AppPage: React.FC<AppPageProps> = ({ defaultTab }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Account data is cached globally - no need to fetch here
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Determine initial tab from: prop > URL path > URL param > default
  const getInitialTab = (): 'songs' | 'videos' => {
    if (defaultTab) return defaultTab;
    const tabParam = searchParams.get('tab');
    if (tabParam === 'videos') return 'videos';
    return 'songs';
  };

  const [songs, setSongs] = useState<Song[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentVideoPage, setCurrentVideoPage] = useState(1);
  const [totalSongsCount, setTotalSongsCount] = useState(0);
  const [totalVideosCount, setTotalVideosCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'songs' | 'videos'>(getInitialTab());
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [moodFilter, setMoodFilter] = useState<string>('');

  // Update tab when route changes or tab query param changes
  useEffect(() => {
    setActiveTab(getInitialTab());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, defaultTab, searchParams]);

  const songsPerPage = 10;
  const videosPerPage = 12; // 12 videos per page (works well with 4-column grid)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoPollingRef = useRef<NodeJS.Timeout | null>(null);
  const processingSongIdsRef = useRef<Set<string>>(new Set()); // Track IDs of songs we're waiting for
  const processingVideoIdsRef = useRef<Set<string>>(new Set()); // Track IDs of videos we're waiting for
  
  // Global audio player
  const { 
    currentSong, 
    isPlaying: isAudioPlaying, 
    progress: audioProgress, 
    duration: audioDuration,
    playSong,
    setSongsList,
  } = useAudioPlayer();
  
  const [lyricsDialogOpen, setLyricsDialogOpen] = useState(false);
  const [selectedSongForLyrics, setSelectedSongForLyrics] = useState<Song | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuSong, setMenuSong] = useState<Song | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  
  // Video menu and delete state
  const [videoMenuAnchorEl, setVideoMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuVideo, setMenuVideo] = useState<Video | null>(null);
  const [videoDeleteConfirmOpen, setVideoDeleteConfirmOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch songs from API
  // Fetch songs with server-side pagination and filtering
  const fetchSongs = useCallback(async (showLoading = true, page = currentPage) => {
    if (!user?.userId) return;

    if (showLoading) setIsLoadingSongs(true);
    try {
      const response = await songsApi.getUserSongs(user.userId, {
        page,
        limit: songsPerPage,
        search: searchQuery || undefined,
        genre: genreFilter || undefined,
        mood: moodFilter || undefined,
      });
      const fetchedSongs = response.data.songs || [];
      const pagination = response.data.pagination;

      setSongs(fetchedSongs);
      // Use pagination.totalCount if available, otherwise fallback to songs length
      if (pagination?.totalCount !== undefined) {
        setTotalSongsCount(pagination.totalCount);
      } else {
        setTotalSongsCount(fetchedSongs.length);
      }

      // Return list of processing song IDs
      const processingSongIds = fetchedSongs
        .filter((s: Song) => s.status === 'processing')
        .map((s: Song) => s.songId);
      return processingSongIds as string[];
    } catch (error) {
      console.error('[Songs] Error fetching songs:', error);
    } finally {
      if (showLoading) setIsLoadingSongs(false);
    }
    return [] as string[];
  }, [user?.userId, currentPage, searchQuery, genreFilter, moodFilter]);

  // Refetch when filters change (with debounce for search)
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // Clear any pending debounce
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    
    // Debounce search queries to avoid too many requests while typing
    if (searchQuery) {
      searchDebounceRef.current = setTimeout(() => {
        setCurrentPage(1);
        fetchSongs(true, 1);
      }, 300);
    } else {
      // For non-search filter changes, fetch immediately
      setCurrentPage(1);
      fetchSongs(true, 1);
    }
    
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, genreFilter, moodFilter]);

  // Start polling for song updates
  const startPolling = useCallback((initialProcessingIds: string[]) => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Track the song IDs we're waiting for
    initialProcessingIds.forEach(id => processingSongIdsRef.current.add(id));
    
    // Poll every 5 seconds
    pollingIntervalRef.current = setInterval(async () => {
      const currentProcessingIds = await fetchSongs(false);

      // Check if any songs we were waiting for have completed
      const processingIds = currentProcessingIds || [];
      const completedIds = Array.from(processingSongIdsRef.current).filter(
        id => !processingIds.includes(id)
      );

      // Show notification for each completed song
      if (completedIds.length > 0) {
        setNotification({
          open: true,
          message: completedIds.length === 1 ? 'Your song is ready! 🎵' : `${completedIds.length} songs are ready! 🎵`,
          severity: 'success'
        });
        // Remove completed songs from tracking
        completedIds.forEach(id => processingSongIdsRef.current.delete(id));
      }

      // Add any new processing songs to tracking
      processingIds.forEach(id => processingSongIdsRef.current.add(id));

      // Stop polling if no more songs to track
      if (processingIds.length === 0 && pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        processingSongIdsRef.current.clear();
      }
    }, 5000);
  }, [fetchSongs]);

  // Initial fetch and polling setup
  useEffect(() => {
    const initFetch = async () => {
      const processingIds = await fetchSongs(true);
      
      // If there are processing songs, start polling
      if (processingIds && processingIds.length > 0) {
        startPolling(processingIds);
      }
    };
    
    if (user?.userId) {
      initFetch();
    }
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [user?.userId, fetchSongs, startPolling]);

  // Handle generating=true query param (coming from create page)
  useEffect(() => {
    const isGenerating = searchParams.get('generating') === 'true';
    const activeTab = searchParams.get('tab');
    
    if (isGenerating) {
      // Show appropriate notification based on what's being generated
      const isVideoGeneration = activeTab === 'videos';
      setNotification({
        open: true,
        message: isVideoGeneration 
          ? 'Your video is being created... This usually takes a few minutes.'
          : 'Your song is being created... This usually takes about a minute or two.',
        severity: 'info'
      });
      
      // Fetch songs to get processing IDs, then start polling
      (async () => {
        const processingIds = await fetchSongs(false);
        if (processingIds && processingIds.length > 0) {
          startPolling(processingIds);
        }
      })();
      
      // Remove the query param from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('generating');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, startPolling, fetchSongs]);

  // Account data hook for refreshing after purchases
  const { fetchAccountData } = useAccountData();

  useEffect(() => {
    // Check if user just subscribed or topped up
    const hasSubscribed = searchParams.get('subscription') === 'true';
    const hasTopup = searchParams.get('topup') === 'true';
    
    if (hasSubscribed) {
      setNotification({
        open: true,
        message: `Welcome to Gruvi! Start creating your first song!`,
        severity: 'success'
      });
      // Force refresh account data to get updated tokens
      fetchAccountData(true);
    }

    if (hasTopup) {
      setNotification({
        open: true,
        message: `Thank you for your purchase! Tokens have been added to your account.`,
        severity: 'success'
      });
      // Force refresh account data to get updated tokens
      fetchAccountData(true);
    }
  }, [searchParams, fetchAccountData]);

  // Fetch videos
  // Fetch videos with server-side pagination
  const fetchVideos = useCallback(async (showLoading = true, page = currentVideoPage): Promise<boolean> => {
    if (!user?.userId) return false;
    
    if (showLoading) {
      setIsLoadingVideos(true);
    }
    
    try {
      const response = await videosApi.getUserVideos(user.userId, { page, limit: videosPerPage });
      const fetchedVideos = response.data.videos || [];
      
      setVideos(fetchedVideos);
      const pagination = response.data.pagination;
      // Use pagination.totalCount if available, otherwise fallback to videos length
      if (pagination?.totalCount !== undefined) {
        setTotalVideosCount(pagination.totalCount);
      } else {
        setTotalVideosCount(fetchedVideos.length);
      }
      
      // Check if any videos are still processing, queued, or interrupted (will auto-retry)
      const hasProcessing = (response.data.videos || []).some(
        (video: Video) => video.status === 'processing' || video.status === 'queued' || video.status === 'interrupted'
      );
      
      return hasProcessing;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return false;
    } finally {
      if (showLoading) {
        setIsLoadingVideos(false);
      }
    }
  }, [user?.userId, currentVideoPage]);

  // Start video polling only when there are processing videos
  const startVideoPolling = useCallback((initialProcessingIds: string[]) => {
    if (videoPollingRef.current) {
      clearInterval(videoPollingRef.current);
    }

    // Track the video IDs we're waiting for
    initialProcessingIds.forEach(id => processingVideoIdsRef.current.add(id));

    videoPollingRef.current = setInterval(async () => {
      const hasProcessing = await fetchVideos(false);

      // Stop polling if no more processing videos
      if (!hasProcessing && videoPollingRef.current) {
        clearInterval(videoPollingRef.current);
        videoPollingRef.current = null;

        // Show notification if we were tracking any videos
        if (processingVideoIdsRef.current.size > 0) {
          setNotification({
            open: true,
            message: 'Your video is ready! 🎬',
            severity: 'success'
          });
        }
        processingVideoIdsRef.current.clear();
      }
    }, 5000);
  }, [fetchVideos]);

  // Fetch videos on mount and start polling if needed
  useEffect(() => {
    const initVideoFetch = async () => {
      const hasProcessing = await fetchVideos(true);
      if (hasProcessing) {
        // Get processing video IDs from the response (fetchVideos updates state, so we check after)
        startVideoPolling([]);
      }
    };

    if (user?.userId) {
      initVideoFetch();
    }

    return () => {
      if (videoPollingRef.current) {
        clearInterval(videoPollingRef.current);
      }
    };
  }, [user?.userId, fetchVideos, startVideoPolling]);

  // Preload cover/genre images when songs load
  useEffect(() => {
    songs.forEach(song => {
      if (song.coverUrl) {
        preloadImage(song.coverUrl);
      } else if (song.genre) {
        preloadImage(getGenreImage(song.genre));
      }
    });
  }, [songs]);

  // Preload video thumbnails when videos load
  useEffect(() => {
    videos.forEach(video => {
      if (video.thumbnailUrl) {
        preloadImage(video.thumbnailUrl);
      }
    });
  }, [videos]);

  // Audio player handlers
  const handlePlaySong = useCallback((song: Song) => {
    if (!song.audioUrl) {
      setNotification({
        open: true,
        message: 'Audio not available yet',
        severity: 'warning'
      });
      return;
    }
    
    // Convert Song to AudioPlayer Song format
    const audioSong = {
      songId: song.songId,
      songTitle: song.songTitle,
      genre: song.genre,
      mood: song.mood,
      audioUrl: song.audioUrl,
      status: song.status,
      createdAt: song.createdAt,
      duration: song.actualDuration,
      lyrics: song.lyrics,
      lyricsWithTags: song.lyricsWithTags,
    };
    
    // Get all completed songs for the playlist
    const completedSongs = songs
      .filter(s => s.status === 'completed' && s.audioUrl)
      .map(s => ({
        songId: s.songId,
        songTitle: s.songTitle,
        genre: s.genre,
        mood: s.mood,
        audioUrl: s.audioUrl,
        status: s.status,
        createdAt: s.createdAt,
        duration: s.actualDuration,
        lyrics: s.lyrics,
        lyricsWithTags: s.lyricsWithTags,
      }));
    
    playSong(audioSong, completedSongs);
  }, [songs, playSong]);

  // Update songs list in global player when songs change
  useEffect(() => {
    const completedSongs = songs
      .filter(s => s.status === 'completed' && s.audioUrl)
      .map(s => ({
        songId: s.songId,
        songTitle: s.songTitle,
        genre: s.genre,
        mood: s.mood,
        audioUrl: s.audioUrl,
        status: s.status,
        createdAt: s.createdAt,
        duration: s.actualDuration,
        lyrics: s.lyrics,
        lyricsWithTags: s.lyricsWithTags,
      }));
    setSongsList(completedSongs);
  }, [songs, setSongsList]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCloseNotification = useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return; // Don't close on clickaway
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const handlePlayPause = (songId: string) => {
    const song = songs.find(s => s.songId === songId);
    if (song) {
      handlePlaySong(song);
    }
  };

  const handleDownload = async (song: Song) => {
    if (!song.audioUrl) {
      setNotification({
        open: true,
        message: 'Audio not available for download',
        severity: 'warning'
      });
      return;
    }

    setIsDownloading(song.songId);
    
    try {
      const response = await fetch(song.audioUrl, {
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!response.ok) throw new Error('Failed to fetch audio');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${song.songTitle || 'song'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
      setNotification({
        open: true,
        message: `Downloaded "${song.songTitle}"`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Download error:', error);
      setNotification({
        open: true,
        message: 'Download failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsDownloading(null);
    }
  };

  const handleViewLyrics = (song: Song) => {
    setSelectedSongForLyrics(song);
    setLyricsDialogOpen(true);
  };

  const handleCreateVideo = (song: Song) => {
    // Navigate to video creation page with song ID
    navigate(`/create-video/${song.songId}`);
  };

  const handleShareSong = async (song: Song) => {
    const shareUrl = `${window.location.origin}/song/${song.songId}`;
    const shareData = {
      title: song.songTitle,
      text: `Check out "${song.songTitle}" on Gruvi!`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setNotification({
          open: true,
          message: 'Link copied to clipboard!',
          severity: 'success'
        });
      }
    } catch (error) {
      // User cancelled share or error occurred
      if ((error as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(shareUrl);
        setNotification({
          open: true,
          message: 'Link copied to clipboard!',
          severity: 'success'
        });
      }
    }
  };

  const handleDeleteSong = (song: Song) => {
    setSongToDelete(song);
    setDeleteConfirmOpen(true);
  };

  // Generate a similar song by navigating to create page with pre-filled data
  const handleGenerateSimilar = (song: Song) => {
    // Build query params with the original song's data
    const params = new URLSearchParams();
    
    if (song.songPrompt) {
      // Add slight variation hint to the prompt
      params.set('prompt', song.songPrompt);
    }
    if (song.genre) {
      params.set('genre', song.genre);
    }
    if (song.mood) {
      params.set('mood', song.mood);
    }
    if (song.language) {
      params.set('language', song.language);
    }
    // Pass creativity and song length settings
    if (song.creativity !== undefined) {
      params.set('creativity', song.creativity.toString());
    }
    if (song.songLength) {
      params.set('songLength', song.songLength);
    }
    // Mark this as a "similar" generation so CreatePage can add variation
    params.set('similar', 'true');
    params.set('originalTitle', song.songTitle);
    
    navigate(`/create/music?${params.toString()}`);
  };

  const confirmDeleteSong = async () => {
    if (!user?.userId || !songToDelete) return;
    
    setDeleteConfirmOpen(false);
    setDeletingSongId(songToDelete.songId);
    
    try {
      await songsApi.deleteSong(user.userId, songToDelete.songId);
      
      // Remove from local state
      setSongs(prev => prev.filter(s => s.songId !== songToDelete.songId));
      
      setNotification({
        open: true,
        message: `"${songToDelete.songTitle}" deleted`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting song:', error);
      setNotification({
        open: true,
        message: 'Failed to delete song',
        severity: 'error'
      });
    } finally {
      setDeletingSongId(null);
      setSongToDelete(null);
    }
  };

  const handleWatchVideo = (video: Video) => {
    navigate(`/video/${video.videoId}`);
  };

  const [downloadingVideoId, setDownloadingVideoId] = useState<string | null>(null);
  
  const handleDownloadVideo = async (video: Video) => {
    if (!video.videoUrl) {
      setNotification({
        open: true,
        message: 'Video not available for download yet',
        severity: 'warning'
      });
      return;
    }

    setDownloadingVideoId(video.videoId);
    
    try {
      const response = await fetch(video.videoUrl, {
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!response.ok) throw new Error('Failed to fetch video');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${video.songTitle || 'music-video'}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
      setNotification({
        open: true,
        message: `Downloaded "${video.songTitle || 'Music Video'}"`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Download error:', error);
      setNotification({
        open: true,
        message: 'Download failed. Please try again.',
        severity: 'error'
      });
    } finally {
      setDownloadingVideoId(null);
    }
  };

  const handleDeleteVideo = (video: Video) => {
    setVideoToDelete(video);
    setVideoDeleteConfirmOpen(true);
  };

  const confirmDeleteVideo = async () => {
    if (!user?.userId || !videoToDelete) return;
    
    setVideoDeleteConfirmOpen(false);
    setDeletingVideoId(videoToDelete.videoId);
    
    try {
      await videosApi.deleteVideo(user.userId, videoToDelete.videoId);
      
      // Remove from local state
      setVideos(prev => prev.filter(v => v.videoId !== videoToDelete.videoId));
      
      setNotification({
        open: true,
        message: `Video deleted`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      setNotification({
        open: true,
        message: 'Failed to delete video',
        severity: 'error'
      });
    } finally {
      setDeletingVideoId(null);
      setVideoToDelete(null);
    }
  };

  const handleVideoMenuClick = (event: React.MouseEvent<HTMLElement>, video: Video) => {
    event.stopPropagation();
    setVideoMenuAnchorEl(event.currentTarget);
    setMenuVideo(video);
  };

  const handleVideoMenuClose = () => {
    setVideoMenuAnchorEl(null);
    setMenuVideo(null);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Always fetch from server (filtering is now server-side)
    fetchSongs(true, page);
  };

  // Filter songs based on search query, genre, and mood
  // Check if any filters are active (for UI display purposes)
  const hasActiveFilters = searchQuery || genreFilter || moodFilter;

  // Calculate pagination for songs (server handles filtering, totalSongsCount reflects filtered results)
  const totalPages = Math.ceil(totalSongsCount / songsPerPage);
  
  // Songs are already filtered and paginated from the server
  const displayedSongs = songs;

  // Calculate pagination for videos (using server-side total count)
  const totalVideoPages = Math.ceil(totalVideosCount / videosPerPage);
  // Videos are already paginated from the server
  // Videos are already paginated from the server
  const displayedVideos = videos;

  const handleVideoPageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentVideoPage(page);
    // Fetch data for the new page
    fetchVideos(true, page);
  };

  return (
    <Box sx={{ pt: { xs: 0, md: 2 }, pb: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
      {/* Persistent Header - Always visible */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        gap: 2,
      }}>
        {/* Left: Icon + Title + Subtitle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          <Box
            key={activeTab}
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
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
            {activeTab === 'songs' ? (
              <LibraryMusicIcon sx={{ fontSize: 28, color: '#fff' }} />
            ) : (
              <VideoLibraryIcon sx={{ fontSize: 28, color: '#fff' }} />
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                {activeTab === 'songs' ? 'My Music' : 'My Videos'}
              </Typography>
              <Chip
                label={activeTab === 'songs' ? totalSongsCount : totalVideosCount}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0,122,255,0.1)',
                  color: '#007AFF',
                  fontWeight: 500,
                  height: 24,
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5, fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              {activeTab === 'songs' ? 'Your generated and uploaded tracks' : 'Your generated and uploaded videos'}
            </Typography>
          </Box>
        </Box>

        {/* Right: Upload and Create Buttons */}
        <Box sx={{ flexShrink: 0 }}>
          {/* Full buttons on sm+ screens */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            {/* Upload Button */}
            <GhostButton
              startIcon={<CloudUploadIcon />}
              onClick={() => navigate(activeTab === 'songs' ? '/upload?type=song' : '/upload?type=video')}
              sx={{ borderRadius: '10px', px: 2, py: 0.75 }}
            >
              Upload
            </GhostButton>
            {/* Create New Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(activeTab === 'songs' ? '/create/music' : '/create/video')}
              sx={{
                background: '#007AFF',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.75,
                boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                '&:hover': { background: '#0066CC' },
              }}
            >
              Create New
            </Button>
          </Box>
          {/* Circle icon buttons on xs screens */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', gap: 1 }}>
            <GhostIconButton
              onClick={() => navigate(activeTab === 'songs' ? '/upload?type=song' : '/upload?type=video')}
              sx={{ width: 44, height: 44 }}
            >
              <CloudUploadIcon sx={{ fontSize: 22 }} />
            </GhostIconButton>
            <IconButton
              onClick={() => navigate(activeTab === 'songs' ? '/create/music' : '/create/video')}
              sx={{
                width: 44,
                height: 44,
                background: '#007AFF',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                '&:hover': {
                  background: '#0066CC',
                },
              }}
            >
              <AddIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Songs Tracklist */}
      {activeTab === 'songs' && (
      <Box
        sx={{
          background: 'transparent',
          overflow: 'hidden',
        }}
      >
        {/* Search and Filters */}
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 1.5, lg: 2 },
            alignItems: { xs: 'stretch', lg: 'center' },
          }}
        >
          {/* Search Bar */}
          <TextField
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            size="small"
            sx={{
              flex: { lg: 1 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: searchQuery ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                border: searchQuery ? '2px solid #3B82F6' : '2px solid transparent',
                color: '#fff',
                '& fieldset': { border: 'none' },
                '&:hover': { backgroundColor: searchQuery ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)' },
                '&.Mui-focused': { backgroundColor: 'rgba(59,130,246,0.1)', border: '2px solid #3B82F6' },
              },
              '& .MuiInputBase-input': {
                color: '#fff',
                '&::placeholder': { color: 'rgba(255,255,255,0.5)', opacity: 1 },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#fff' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Filters Container - side by side on all sizes */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: { xs: 1.5, sm: 2 }, 
            width: { xs: '100%', lg: 'auto' },
            flexShrink: 0,
          }}>
            {/* Genre Filter */}
            <FormControl size="small" sx={{ minWidth: { xs: 0, lg: 160 }, flex: { xs: 1, lg: 'none' } }}>
            <Select
              value={genreFilter}
              onChange={(e: SelectChangeEvent) => {
                setGenreFilter(e.target.value);
                setCurrentPage(1);
              }}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                      <Box sx={{
                        width: { xs: 24, sm: 28 },
                        height: { xs: 24, sm: 28 },
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <MusicNoteIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#fff' }} />
                      </Box>
                      <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>All Genres</Typography>
                    </Box>
                  );
                }
                const genre = genreOptions.find(g => g.id === selected);
                return genre ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                    <Box
                      component="img"
                      src={genre.image}
                      alt={genre.name}
                      sx={{ width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 }, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexShrink: 0 }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>{genre.name}</Typography>
                  </Box>
                ) : selected;
              }}
              sx={{
                borderRadius: '10px',
                backgroundColor: genreFilter ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                border: genreFilter ? '2px solid #3B82F6' : '2px solid transparent',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover': { backgroundColor: genreFilter ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)' },
                '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 400,
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    mt: 1,
                    bgcolor: '#141418',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }
                }
              }}
            >
              <MenuItem value="" sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6, #5AC8FA)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <MusicNoteIcon sx={{ fontSize: 16, color: '#fff' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 500, color: '#fff' }}>All Genres</Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
              {genreOptions.map((genre) => (
                <MenuItem
                  key={genre.id}
                  value={genre.id}
                  sx={{
                    py: 1,
                    '&:hover': { backgroundColor: 'rgba(59,130,246,0.15)' },
                    '&.Mui-selected': { backgroundColor: 'rgba(59,130,246,0.2)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      component="img"
                      src={genre.image}
                      alt={genre.name}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Typography sx={{ fontWeight: 500, color: '#fff' }}>{genre.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            </FormControl>

            {/* Mood Filter */}
            <FormControl size="small" sx={{ minWidth: { xs: 0, lg: 160 }, flex: { xs: 1, lg: 'none' } }}>
            <Select
              value={moodFilter}
              onChange={(e: SelectChangeEvent) => {
                setMoodFilter(e.target.value);
                setCurrentPage(1);
              }}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                      <Box sx={{
                        width: { xs: 24, sm: 28 },
                        height: { xs: 24, sm: 28 },
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <AutoAwesomeIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#fff' }} />
                      </Box>
                      <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>All Moods</Typography>
                    </Box>
                  );
                }
                const mood = moodOptions.find(m => m.id === selected);
                return mood ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                    <Box
                      component="img"
                      src={mood.image}
                      alt={mood.name}
                      sx={{ width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 }, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexShrink: 0 }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>{mood.name}</Typography>
                  </Box>
                ) : selected;
              }}
              sx={{
                borderRadius: '10px',
                backgroundColor: moodFilter ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                border: moodFilter ? '2px solid #3B82F6' : '2px solid transparent',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover': { backgroundColor: moodFilter ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)' },
                '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 400,
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    mt: 1,
                    bgcolor: '#141418',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }
                }
              }}
            >
              <MenuItem value="" sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <AutoAwesomeIcon sx={{ fontSize: 16, color: '#fff' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 500, color: '#fff' }}>All Moods</Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
              {moodOptions.map((mood) => (
                <MenuItem
                  key={mood.id}
                  value={mood.id}
                  sx={{
                    py: 1,
                    '&:hover': { backgroundColor: 'rgba(59,130,246,0.15)' },
                    '&.Mui-selected': { backgroundColor: 'rgba(59,130,246,0.2)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      component="img"
                      src={mood.image}
                      alt={mood.name}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Typography sx={{ fontWeight: 500, color: '#fff' }}>{mood.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
              </Select>
            </FormControl>
          </Box>

          {/* Clear Filters Button - only show when filters are active */}
          {hasActiveFilters && (
            <Button
              size="small"
              onClick={() => {
                setSearchQuery('');
                setGenreFilter('');
                setMoodFilter('');
                setCurrentPage(1);
              }}
              sx={{
                textTransform: 'none',
                color: '#fff !important',
                whiteSpace: 'nowrap',
                '& .MuiSvgIcon-root': { color: '#fff !important' },
                '&:hover': { color: '#fff !important', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
              startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
            >
              Clear filters
            </Button>
          )}
        </Box>

        {/* Tracklist */}
        {isLoadingSongs ? (
          <Box>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  px: { xs: 2, sm: 3 },
                  borderBottom: i < 10 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                }}
              >
                {/* Track Number */}
                <Box sx={{ width: { xs: 24, sm: 32 }, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                  <Skeleton variant="rounded" width={16} height={24} sx={{ borderRadius: '6px' }} />
                </Box>
                {/* Album Art */}
                <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: '6px', flexShrink: 0 }} />
                {/* Title and Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Skeleton variant="text" width="45%" height={22} />
                  <Skeleton variant="text" width="30%" height={18} />
                </Box>
                {/* Action Buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
                  {/* Play Button */}
                  <Skeleton variant="circular" width={40} height={40} />
                  {/* More Menu - vertical dots */}
                  <Box sx={{ width: 28, display: 'flex', justifyContent: 'center' }}>
                    <Skeleton variant="rounded" width={6} height={18} sx={{ borderRadius: '3px' }} />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ) : totalSongsCount === 0 ? (
          <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
            <MusicNoteIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#fff' }}>
              No songs yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, mb: 3, px: 2 }}>
              Create your first song to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create/music')}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              }}
            >
              Create Song
            </Button>
          </Box>
        ) : (
          <Box>
            {displayedSongs.map((song, index) => {
              const isProcessing = song.status === 'processing';
              const isFailed = song.status === 'failed';

              return (
                <Box
                  key={song.songId}
                  onClick={() => !isProcessing && !isFailed && handlePlayPause(song.songId)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    p: { xs: 1.5, sm: 2 },
                    px: { xs: 2, sm: 3 },
                    borderBottom: index < displayedSongs.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    transition: 'all 0.2s ease',
                    opacity: isProcessing ? 0.85 : 1,
                    cursor: isProcessing || isFailed ? 'default' : 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(59,130,246,0.08)',
                      '& .play-overlay': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {/* Track Number */}
                  <Typography
                    sx={{
                      width: { xs: 24, sm: 32 },
                      textAlign: 'center',
                      color: '#fff',
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {(currentPage - 1) * songsPerPage + index + 1}
                  </Typography>

                  {/* Album Art / Loading Indicator */}
                  <Box
                    sx={{
                      width: { xs: 44, sm: 48 },
                      height: { xs: 44, sm: 48 },
                      borderRadius: '50%',
                      background: isProcessing
                        ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                        : isFailed
                        ? 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)'
                        : '#282828',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {isProcessing ? (
                      <AutorenewIcon 
                        sx={{ 
                          color: '#fff', 
                          fontSize: 24,
                          animation: 'spin 1.5s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }} 
                      />
                    ) : (
                      <>
                        {/* Cover image or Genre image background */}
                        <Box
                          component="img"
                          src={song.coverUrl || getGenreImage(song.genre)}
                          alt={song.songTitle || song.genre}
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
                        {/* Play overlay - shows on hover or when playing */}
                        <Box
                          className="play-overlay"
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: currentSong?.songId === song.songId ? 'rgba(0,122,255,0.5)' : 'rgba(0,0,0,0.4)',
                            opacity: currentSong?.songId === song.songId ? 1 : 0,
                            transition: 'opacity 0.2s',
                          }}
                        >
                          {currentSong?.songId === song.songId && isAudioPlaying ? (
                            <AudioEqualizer isPlaying={true} size={22} color="#fff" />
                          ) : (
                            <PlayArrowRoundedIcon sx={{ fontSize: 22, color: '#fff' }} />
                          )}
                        </Box>
                      </>
                    )}
                  </Box>

                  {/* Track Info */}
                  <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: isFailed ? '#FF3B30' : '#fff',
                          fontSize: { xs: '0.85rem', sm: '0.95rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {song.songTitle}
                      </Typography>
                      {song.isPremium && (
                        <Tooltip title="Premium Track" arrow>
                          <WorkspacePremiumIcon sx={{ fontSize: 18, color: '#FFB800', flexShrink: 0 }} />
                        </Tooltip>
                      )}
                    </Box>
                    {isProcessing ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#007AFF', fontSize: { xs: '0.75rem', sm: '0.85rem' }, fontWeight: 500 }}>
                          {song.progressMessage || 'Creating...'}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={song.progress || 0} 
                          sx={{ 
                            flex: 1, 
                            maxWidth: 100,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: 'rgba(0,122,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#007AFF',
                              borderRadius: 2,
                            }
                          }} 
                        />
                      </Box>
                    ) : (
                      <Typography sx={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {song.genre} • {song.actualDuration ? `${Math.floor(song.actualDuration / 60)}:${String(Math.floor(song.actualDuration % 60)).padStart(2, '0')}` : '--:--'} • {new Date(song.createdAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>

                  {/* Action Buttons - Only show for completed songs */}
                  {!isProcessing && !isFailed && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
                      {/* Play Button */}
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause(song.songId);
                        }}
                        sx={{
                          width: { xs: 36, md: 40 },
                          height: { xs: 36, md: 40 },
                          background: '#3B82F6',
                          color: '#fff',
                          '&:hover': {
                            background: '#2563EB',
                          },
                        }}
                      >
                        {currentSong?.songId === song.songId && isAudioPlaying ? (
                          <PauseIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                        ) : (
                          <PlayArrowRoundedIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
                        )}
                      </IconButton>


                      {/* More Menu Button */}
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuAnchorEl(e.currentTarget);
                          setMenuSong(song);
                        }}
                        size="small"
                        sx={{
                          color: '#fff',
                          '&:hover': {
                            color: '#fff',
                            background: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        <MoreVertIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>
                  )}
                  
                  {/* Processing songs - show cancel/delete button */}
                  {isProcessing && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Cancel/Remove" arrow>
                        <IconButton
                          onClick={() => handleDeleteSong(song)}
                          disabled={deletingSongId === song.songId}
                          sx={{
                            width: 40,
                            height: 40,
                            background: 'rgba(255,59,48,0.75)',
                            color: '#fff',
                            '&:hover': {
                              background: 'rgba(255,59,48,0.9)',
                            },
                          }}
                        >
                          {deletingSongId === song.songId ? (
                            <CircularProgress size={20} sx={{ color: '#fff' }} />
                          ) : (
                            <DeleteIcon sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  
                  {/* Failed status with delete button */}
                  {isFailed && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label="Failed" 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255,59,48,0.1)',
                          color: '#FF3B30',
                          fontWeight: 500
                        }} 
                      />
                      <Tooltip title="Delete failed song" arrow>
                        <IconButton
                          onClick={() => handleDeleteSong(song)}
                          disabled={deletingSongId === song.songId}
                          sx={{
                            width: 40,
                            height: 40,
                            background: 'rgba(255,59,48,0.75)',
                            color: '#fff',
                            '&:hover': {
                              background: 'rgba(255,59,48,0.9)',
                            },
                          }}
                        >
                          {deletingSongId === song.songId ? (
                            <CircularProgress size={20} sx={{ color: '#fff' }} />
                          ) : (
                            <DeleteIcon sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box 
            sx={{ 
              p: 3, 
              display: 'flex', 
              justifyContent: 'center',
              borderTop: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              siblingCount={0}
              boundaryCount={1}
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </Box>
        )}
      </Box>
      )}

      {/* Music Videos Tab */}
      {activeTab === 'videos' && (
        <Box
          sx={{
            background: 'transparent',
            overflow: 'visible',
          }}
        >
          {/* Videos Grid - Grouped by Date */}
          {isLoadingVideos ? (
            <Box>
              {/* First date group */}
              <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
              {/* First row - 4 portrait video skeletons */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2,
                mb: 5,
              }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box key={`portrait-1-${i}`} sx={{ position: 'relative' }}>
                    <Skeleton
                      variant="rounded"
                      sx={{
                        width: '100%',
                        paddingTop: '177.78%', // 9:16 aspect ratio for portrait
                        borderRadius: '20px',
                      }}
                    />
                    {/* More menu button skeleton */}
                    <Skeleton
                      variant="circular"
                      width={32}
                      height={32}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                    />
                    {/* Title overlay skeleton */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1.5,
                    }}>
                      <Skeleton variant="text" width="70%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
                      <Skeleton variant="rounded" width="50%" height={24} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Second date group */}
              <Skeleton variant="text" width={140} height={24} sx={{ mb: 2 }} />
              {/* Second row - 4 portrait video skeletons */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2,
              }}>
                {[1, 2, 3, 4].map((i) => (
                  <Box key={`portrait-2-${i}`} sx={{ position: 'relative' }}>
                    <Skeleton
                      variant="rounded"
                      sx={{
                        width: '100%',
                        paddingTop: '177.78%', // 9:16 aspect ratio for portrait
                        borderRadius: '20px',
                      }}
                    />
                    {/* More menu button skeleton */}
                    <Skeleton
                      variant="circular"
                      width={32}
                      height={32}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                    />
                    {/* Title overlay skeleton */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1.5,
                    }}>
                      <Skeleton variant="text" width="70%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
                      <Skeleton variant="rounded" width="50%" height={24} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : totalVideosCount > 0 ? (
            <Box sx={{ overflow: 'visible' }}>
              {/* Group displayed videos by date */}
              {(() => {
                // Group displayed videos by date (paginated)
                const groupedVideos: { [key: string]: Video[] } = {};
                displayedVideos.forEach((video) => {
                  const dateKey = new Date(video.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                  if (!groupedVideos[dateKey]) {
                    groupedVideos[dateKey] = [];
                  }
                  groupedVideos[dateKey].push(video);
                });
                
                // Get today's and yesterday's date strings for comparison
                const today = new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
                const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
                
                // Sort date groups by date descending (most recent first)
                const sortedDateEntries = Object.entries(groupedVideos).sort((a, b) => {
                  return new Date(b[0]).getTime() - new Date(a[0]).getTime();
                });
                
                return sortedDateEntries.map(([dateKey, dateVideos]) => {
                  // Display "Today", "Yesterday", or the date
                  const displayDate = dateKey === today ? 'Today' : dateKey === yesterday ? 'Yesterday' : dateKey;
                  
                  return (
                    <Box key={dateKey} sx={{ mb: 4, overflow: 'visible' }}>
                      {/* Date Section Header */}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'rgba(255,255,255,0.5)',
                          fontWeight: 600,
                          mb: 2,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {displayDate}
                      </Typography>
                      
                      {/* Videos Grid for this date - separate portrait and landscape */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'visible' }}>
                        {/* Portrait videos in grid */}
                        {dateVideos.filter(v => v.aspectRatio !== 'landscape').length > 0 && (
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                            gap: 2,
                            overflow: 'visible',
                          }}>
                            {dateVideos.filter(v => v.aspectRatio !== 'landscape').map((video) => (
                              <VideoCard
                                key={video.videoId}
                                video={video}
                                isDeleting={deletingVideoId === video.videoId}
                                onWatch={handleWatchVideo}
                                onMenuClick={handleVideoMenuClick}
                              />
                            ))}
                          </Box>
                        )}
                        
                        {/* Landscape videos - 2 per row on larger screens, full width on mobile */}
                        <Box sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                          gap: 2,
                          overflow: 'visible',
                        }}>
                          {dateVideos.filter(v => v.aspectRatio === 'landscape').map((video) => (
                            <VideoCard
                              key={video.videoId}
                              video={video}
                              isDeleting={deletingVideoId === video.videoId}
                              onWatch={handleWatchVideo}
                              onMenuClick={handleVideoMenuClick}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  );
                });
              })()}
              
              {/* Video Pagination */}
              {totalVideoPages > 1 && (
                <Box 
                  sx={{ 
                    pt: 3, 
                    display: 'flex', 
                    justifyContent: 'center',
                  }}
                >
                  <Pagination
                    count={totalVideoPages}
                    page={currentVideoPage}
                    onChange={handleVideoPageChange}
                    color="primary"
                    siblingCount={0}
                    boundaryCount={1}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
              <VideoLibraryIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#fff' }}>
                No music videos yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1, mb: 3, px: 2 }}>
                Create a song first, then generate a music video from it
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create/video')}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                }}
              >
                Create Video
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Subscription Success Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          mt: 7
        }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: '100%',
            alignItems: 'center',
            bgcolor: notification.severity === 'success' ? '#10B981' : notification.severity === 'error' ? '#EF4444' : '#3B82F6',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff',
            },
            '& .MuiAlert-action': {
              color: '#fff',
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Lyrics Dialog */}
      <Dialog
        open={lyricsDialogOpen}
        onClose={() => setLyricsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: '#141418',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #3B82F6 0%, #5AC8FA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LyricsIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, color: '#fff' }}>
              {selectedSongForLyrics?.songTitle || 'Lyrics'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {selectedSongForLyrics?.genre}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedSongForLyrics?.lyrics ? (
            <Typography
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'Georgia, serif',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              {selectedSongForLyrics.lyrics}
            </Typography>
          ) : (
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 4 }}>
              Lyrics not available for this song
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setLyricsDialogOpen(false)}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #3B82F6 0%, #5AC8FA 100%)',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Song Actions Menu (Mobile) */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => {
          setMenuAnchorEl(null);
          setMenuSong(null);
        }}
        slotProps={{
          backdrop: { invisible: true }, // Allow interaction with drawer while menu is open
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '16px',
            minWidth: 180,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            bgcolor: '#141418 !important',
            backgroundImage: 'none !important',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <MenuItem onClick={() => {
          if (menuSong) handleViewLyrics(menuSong);
          setMenuAnchorEl(null);
          setMenuSong(null);
        }}>
          <ListItemIcon>
            <LyricsIcon sx={{ color: '#3B82F6' }} />
          </ListItemIcon>
          <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>View Lyrics</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (menuSong) handleDownload(menuSong);
          setMenuAnchorEl(null);
          setMenuSong(null);
        }}>
          <ListItemIcon>
            <DownloadIcon sx={{ color: '#3B82F6' }} />
          </ListItemIcon>
          <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (menuSong) handleCreateVideo(menuSong);
          setMenuAnchorEl(null);
          setMenuSong(null);
        }}>
          <ListItemIcon>
            <MovieIcon sx={{ color: '#3B82F6' }} />
          </ListItemIcon>
          <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>Create Video</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuSong) handleGenerateSimilar(menuSong);
            setMenuAnchorEl(null);
            setMenuSong(null);
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon sx={{ color: '#3B82F6' }} />
          </ListItemIcon>
          <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>Generate Similar</ListItemText>
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <MenuItem
          onClick={() => {
            if (menuSong) handleDeleteSong(menuSong);
            setMenuAnchorEl(null);
            setMenuSong(null);
          }}
          sx={{ color: '#FF3B30' }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ color: '#FF3B30' }} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ sx: { color: '#FF3B30' } }} />
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setSongToDelete(null);
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '16px',
            p: 1,
            minWidth: 340,
            bgcolor: '#141418 !important',
            backgroundImage: 'none !important',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: 'rgba(255,59,48,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DeleteIcon sx={{ color: '#FF3B30', fontSize: 24 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
            Delete Song?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Are you sure you want to delete "<strong style={{ color: '#fff' }}>{songToDelete?.songTitle}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <GhostButton
            onClick={() => {
              setDeleteConfirmOpen(false);
              setSongToDelete(null);
            }}
            sx={{ flex: 1, py: 1.25 }}
          >
            Cancel
          </GhostButton>
          <Button
            onClick={confirmDeleteSong}
            variant="contained"
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)',
              boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E53528 0%, #FF5252 100%)',
                boxShadow: '0 6px 16px rgba(255, 59, 48, 0.4)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Actions Menu */}
      <Menu
        anchorEl={videoMenuAnchorEl}
        open={Boolean(videoMenuAnchorEl)}
        onClose={handleVideoMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          backdrop: { invisible: true }, // Allow interaction with drawer while menu is open
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            minWidth: 160,
            bgcolor: '#141418 !important',
            backgroundImage: 'none !important',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        {menuVideo?.status === 'completed' && (
          <MenuItem
            onClick={() => {
              if (menuVideo) handleWatchVideo(menuVideo);
              handleVideoMenuClose();
            }}
          >
            <ListItemIcon>
              <PlayArrowRoundedIcon sx={{ color: '#3B82F6' }} />
            </ListItemIcon>
            <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>Watch</ListItemText>
          </MenuItem>
        )}
        {menuVideo?.status === 'completed' && menuVideo?.videoUrl && (
          <MenuItem
            onClick={() => {
              if (menuVideo) handleDownloadVideo(menuVideo);
              handleVideoMenuClose();
            }}
            disabled={downloadingVideoId === menuVideo?.videoId}
          >
            <ListItemIcon>
              {downloadingVideoId === menuVideo?.videoId ? (
                <CircularProgress size={20} sx={{ color: '#3B82F6' }} />
              ) : (
                <DownloadIcon sx={{ color: '#3B82F6' }} />
              )}
            </ListItemIcon>
            <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>
              {downloadingVideoId === menuVideo?.videoId ? 'Downloading...' : 'Download'}
            </ListItemText>
          </MenuItem>
        )}
        {menuVideo?.status === 'completed' && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <MenuItem
              onClick={() => {
                if (menuVideo) {
                  navigate(`/video/${menuVideo.videoId}?scrollTo=social`);
                }
                handleVideoMenuClose();
              }}
            >
              <ListItemIcon>
                <ShareIcon sx={{ color: '#34C759' }} />
              </ListItemIcon>
              <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#fff' } }}>Upload to Social Channels</ListItemText>
            </MenuItem>
          </>
        )}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <MenuItem
          onClick={() => {
            if (menuVideo) handleDeleteVideo(menuVideo);
            handleVideoMenuClose();
          }}
          sx={{ color: '#FF3B30' }}
        >
          <ListItemIcon>
            <DeleteIcon sx={{ color: '#FF3B30' }} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ sx: { color: '#FF3B30' } }} />
        </MenuItem>
      </Menu>

      {/* Video Delete Confirmation Dialog */}
      <Dialog
        open={videoDeleteConfirmOpen}
        onClose={() => {
          setVideoDeleteConfirmOpen(false);
          setVideoToDelete(null);
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: '16px',
            p: 1,
            minWidth: 340,
            bgcolor: '#141418 !important',
            backgroundImage: 'none !important',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              background: 'rgba(255,59,48,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DeleteIcon sx={{ color: '#FF3B30', fontSize: 24 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
            Delete Video?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Are you sure you want to delete this video? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <GhostButton
            onClick={() => {
              setVideoDeleteConfirmOpen(false);
              setVideoToDelete(null);
            }}
            sx={{ flex: 1, py: 1.25 }}
          >
            Cancel
          </GhostButton>
          <Button
            onClick={confirmDeleteVideo}
            variant="contained"
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)',
              boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E53528 0%, #FF5252 100%)',
                boxShadow: '0 6px 16px rgba(255, 59, 48, 0.4)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Audio player is now global - see GlobalAudioPlayer component */}
    </Box>
  );
};

export default AppPage;
