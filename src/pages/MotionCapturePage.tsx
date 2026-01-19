import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getTokensFromAllowances, setAllowances } from '../store/authSlice';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Paper,
  LinearProgress,
  Chip,
  Switch,
  FormControlLabel,
  Grid,
  Avatar,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PersonIcon from '@mui/icons-material/Person';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BrushIcon from '@mui/icons-material/Brush';
import GruviCoin from '../components/GruviCoin';
import StyledDropdown, { DropdownOption } from '../components/StyledDropdown';
import { swapStudioApi, videosApi, charactersApi, Character } from '../services/api';

// Custom stepper connector
const GradientConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1,
  },
}));

// Custom step icon
const StepIconRoot = styled('div')<{ ownerState: { completed?: boolean; active?: boolean } }>(
  ({ ownerState }) => ({
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 1,
    color: 'rgba(255,255,255,0.5)',
    width: 44,
    height: 44,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      color: '#fff',
      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
    }),
    ...(ownerState.completed && {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      color: '#fff',
    }),
  }),
);

function CustomStepIcon(props: { active?: boolean; completed?: boolean; icon: React.ReactNode; className?: string }) {
  const { active, completed, className, icon } = props;
  const icons: { [index: string]: React.ReactElement } = {
    1: <VideoLibraryIcon />,
    2: <SwapHorizIcon />,
    3: <PersonIcon />,
    4: <RecordVoiceOverIcon />,
  };
  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {completed ? <CheckCircleIcon /> : icons[String(icon)]}
    </StepIconRoot>
  );
}

const steps = ['Select Video', 'Swap Mode', 'Select Character', 'Voice (Optional)'];

// Swap mode types
type SwapMode = 'wan-replace' | 'wan-move' | 'kling-motion';

// Pricing: 50 tokens per 10 seconds (rounded up)
const TOKENS_PER_10_SECONDS = 50;

// Max video duration: 3 minutes (180 seconds)
const MAX_VIDEO_DURATION_SECONDS = 180;

// Max duration for Kling mode: 30 seconds
const MAX_KLING_DURATION_SECONDS = 30;

// Voice change: 50 tokens per minute (rounded up)
const VOICE_TOKENS_PER_MINUTE = 50;

// Calculate video swap cost based on duration
const calculateSwapCost = (durationSeconds: number): number => {
  // Round up to next 10 seconds
  const roundedSeconds = Math.ceil(durationSeconds / 10) * 10;
  return (roundedSeconds / 10) * TOKENS_PER_10_SECONDS;
};

// Calculate voice change cost based on duration (50 tokens per minute, rounded up)
const calculateVoiceChangeCost = (durationSeconds: number): number => {
  const minutes = Math.ceil(durationSeconds / 60);
  return minutes * VOICE_TOKENS_PER_MINUTE;
};

// Art style options for reference image generation
const ART_STYLE_OPTIONS: DropdownOption[] = [
  { id: '3d-cartoon', label: '3D Cartoon', image: '/art_styles/boy_cartoon.jpeg' },
  { id: 'claymation', label: 'Claymation', image: '/art_styles/boy_claymation.jpeg' },
  { id: 'childrens-storybook', label: "Children's Book", image: '/art_styles/boy_storybook.jpeg' },
  { id: 'photo-realism', label: 'Realistic', image: '/art_styles/boy_real.jpeg' },
  { id: 'comic-book', label: 'Comic Book', image: '/art_styles/boy_comic.jpeg' },
  { id: 'classic-blocks', label: 'Classic Blocks', image: '/art_styles/boy_lego.jpeg' },
  { id: 'anime', label: 'Animation', image: '/art_styles/boy_anime.jpeg' },
  { id: 'spray-paint', label: 'Spray Paint', image: '/art_styles/boy_spray_paint.jpeg' },
  { id: 'playground-crayon', label: 'Crayon', image: '/art_styles/boy_crayon.jpeg' },
];

// Voice options for dropdown (same as CreateNarrativePage)
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

interface VideoInfo {
  videoId: string;
  videoKey?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  title?: string;
}

interface SwapResult {
  swapId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultVideoUrl?: string;
  progress?: number;
  progressMessage?: string;
  error?: string;
}

// Format duration as mm:ss
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Get video duration from URL by loading metadata
const getVideoDuration = (videoUrl: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      resolve(video.duration);
      video.remove();
    };
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
      video.remove();
    };
    video.src = videoUrl;
  });
};

// Video card with hover preview
interface VideoCardProps {
  video: VideoInfo;
  isSelected: boolean;
  onClick: () => void;
  isTooLong?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isSelected, onClick, isTooLong = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoUrlRef = useRef<string | null>(null);

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
      onClick={isTooLong ? undefined : onClick}
      sx={{
        position: 'relative',
        aspectRatio: '9/16',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: isTooLong ? 'not-allowed' : 'pointer',
        opacity: isTooLong ? 0.5 : 1,
        boxShadow: isSelected
          ? '0 0 0 3px #8B5CF6, 0 8px 32px rgba(139, 92, 246, 0.4)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.2s ease',
        '&:hover': isTooLong ? {} : {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: isSelected
            ? '0 0 0 3px #8B5CF6, 0 12px 40px rgba(139, 92, 246, 0.5)'
            : '0 12px 40px rgba(0,0,0,0.4)',
        },
      }}
    >
      {/* Thumbnail Image */}
      <Box
        component="img"
        src={video.thumbnailUrl || '/gruvi/octopus-portrait-wait.jpeg'}
        alt={video.title || 'Video'}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = '/gruvi/octopus-portrait-wait.jpeg';
        }}
      />

      {/* Video Preview on Hover */}
      {videoUrlRef.current && isHovered && !isTooLong && (
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

      {/* Duration badge */}
      {video.duration && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            px: 1,
            py: 0.25,
            borderRadius: '4px',
            background: isTooLong ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0,0,0,0.7)',
          }}
        >
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
            {formatDuration(video.duration)}
          </Typography>
        </Box>
      )}

      {/* Too long overlay */}
      {isTooLong && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            px: 1.5,
            py: 0.75,
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.9)',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
            Max 3 min
          </Typography>
        </Box>
      )}

      {/* Info overlay at bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1.5,
          pt: 4,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }}
      >
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {video.title}
        </Typography>
      </Box>

      {/* Selection indicator */}
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 16, color: '#fff' }} />
        </Box>
      )}
    </Box>
  );
};

const MotionCapturePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, allowances, subscription } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId || '';

  // Get remaining tokens from allowances
  const tokens = getTokensFromAllowances(allowances);
  const totalTokens = (tokens?.max || 0) + (tokens?.topup || 0);
  const usedTokens = tokens?.used || 0;
  const tokensRemaining = totalTokens - usedTokens;

  // Check subscription status for premium voices
  const hasSubscription = subscription?.tier !== 'free' && subscription?.status === 'active';

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterPrompt, setCharacterPrompt] = useState('');
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [swapMode, setSwapMode] = useState<SwapMode>('wan-replace');
  const [klingPrompt, setKlingPrompt] = useState('');
  const [enableVoiceChange, setEnableVoiceChange] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('albus');
  const [isGenerating, setIsGenerating] = useState(false);
  const [swapResult, setSwapResult] = useState<SwapResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Data loading
  const [userVideos, setUserVideos] = useState<VideoInfo[]>([]);
  const [userCharacters, setUserCharacters] = useState<Character[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const [loadingDuration, setLoadingDuration] = useState(false);

  // Pagination state
  const [videoPage, setVideoPage] = useState(1);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [loadingMoreVideos, setLoadingMoreVideos] = useState(false);
  const VIDEOS_PER_PAGE = 12;

  // Refs
  const resultVideoRef = useRef<HTMLVideoElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load user videos and characters
  useEffect(() => {
    if (userId) {
      loadUserVideos();
      loadUserCharacters();
    }
  }, [userId]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Reset swap mode to wan-replace if user selects a video > 30s and has Kling selected
  useEffect(() => {
    if (selectedVideo && (selectedVideo.duration || 0) > 30 && swapMode === 'kling-motion') {
      setSwapMode('wan-replace');
    }
  }, [selectedVideo]);

  const loadUserVideos = async (page: number = 1, append: boolean = false) => {
    if (append) {
      setLoadingMoreVideos(true);
    } else {
      setLoadingVideos(true);
    }
    try {
      const response = await videosApi.getUserVideos(userId, {
        page,
        limit: VIDEOS_PER_PAGE,
      });
      // Filter to only show completed videos that have a videoKey
      const videos: VideoInfo[] = (response.data.videos || [])
        .filter((v: any) => v.status === 'completed' && v.videoKey)
        .map((v: any) => ({
          videoId: v.videoId,
          videoKey: v.videoKey,
          videoUrl: v.videoUrl,
          thumbnailUrl: v.thumbnailUrl,
          duration: v.duration,
          title: v.title || v.songTitle || v.name || 'Untitled Video',
        }));

      if (append) {
        setUserVideos(prev => [...prev, ...videos]);
      } else {
        setUserVideos(videos);
      }

      // Check if there are more videos to load
      const totalCount = response.data.totalCount || response.data.videos?.length || 0;
      const loadedCount = append ? userVideos.length + videos.length : videos.length;
      setHasMoreVideos(loadedCount < totalCount);
      setVideoPage(page);

      // Fetch missing durations in the background
      fetchMissingDurations(videos);
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoadingVideos(false);
      setLoadingMoreVideos(false);
    }
  };

  // Fetch durations for videos that don't have them (runs in background)
  const fetchMissingDurations = async (videos: VideoInfo[]) => {
    const videosWithoutDuration = videos.filter(v => !v.duration && v.videoUrl);
    if (videosWithoutDuration.length === 0) return;

    // Fetch durations in parallel (limit to 4 concurrent to avoid overwhelming browser)
    const batchSize = 4;
    for (let i = 0; i < videosWithoutDuration.length; i += batchSize) {
      const batch = videosWithoutDuration.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(async (video) => {
          try {
            const duration = await getVideoDuration(video.videoUrl!);
            return { videoId: video.videoId, duration };
          } catch {
            return null;
          }
        })
      );

      // Update state with fetched durations
      const updates = results
        .filter((r): r is PromiseFulfilledResult<{ videoId: string; duration: number } | null> =>
          r.status === 'fulfilled' && r.value !== null
        )
        .map(r => r.value!);

      if (updates.length > 0) {
        setUserVideos(prev => prev.map(v => {
          const update = updates.find(u => u.videoId === v.videoId);
          return update ? { ...v, duration: update.duration } : v;
        }));
      }
    }
  };

  const handleLoadMoreVideos = () => {
    loadUserVideos(videoPage + 1, true);
  };

  const loadUserCharacters = async () => {
    setLoadingCharacters(true);
    try {
      const response = await charactersApi.getUserCharacters(userId);
      setUserCharacters(response.data.characters || []);
    } catch (err) {
      console.error('Failed to load characters:', err);
    } finally {
      setLoadingCharacters(false);
    }
  };

  // Handle video selection - fetch duration from video metadata if not available
  const handleVideoSelect = async (video: VideoInfo) => {
    // If video already has duration, use it directly
    if (video.duration) {
      setSelectedVideo(video);
      setActiveStep(1);
      return;
    }

    // Otherwise, fetch duration from video metadata
    if (video.videoUrl) {
      setLoadingDuration(true);
      try {
        const duration = await getVideoDuration(video.videoUrl);
        const videoWithDuration = { ...video, duration };
        setSelectedVideo(videoWithDuration);
        // Also update the video in the list so duration is cached
        setUserVideos(prev => prev.map(v =>
          v.videoId === video.videoId ? videoWithDuration : v
        ));
        setActiveStep(1);
      } catch (err) {
        console.error('Failed to get video duration:', err);
        // Still select the video even if we can't get duration
        setSelectedVideo(video);
        setActiveStep(1);
      } finally {
        setLoadingDuration(false);
      }
    } else {
      // No video URL, just select it
      setSelectedVideo(video);
      setActiveStep(1);
    }
  };

  // Convert characters to dropdown options
  const characterOptions: DropdownOption[] = userCharacters.map(char => ({
    id: char.characterId,
    label: char.characterName,
    description: char.characterType || 'Character',
    image: char.imageUrls?.[0],
  }));

  // Video duration checks
  const videoDuration = selectedVideo?.duration || 0;
  const isVideoTooLong = videoDuration > MAX_VIDEO_DURATION_SECONDS;
  const isVideoTooLongForKling = videoDuration > MAX_KLING_DURATION_SECONDS;

  // Swap mode options - dynamically disable Kling for videos > 30 seconds
  const swapModeOptions: DropdownOption[] = useMemo(() => [
    {
      id: 'wan-replace',
      label: 'Replace Character',
      description: 'Swap the character while keeping the original background (WAN)',
    },
    {
      id: 'wan-move',
      label: 'Replace Character + Environment',
      description: 'Swap both the character and background to a new scene (WAN)',
    },
    {
      id: 'kling-motion',
      label: 'Replace + Custom Prompt',
      description: 'Add a text prompt to guide the motion. Best for lip sync (Kling, max 30s)',
      disabled: isVideoTooLongForKling,
      disabledReason: 'Video exceeds 30 second limit',
    },
  ], [isVideoTooLongForKling]);

  // Calculate total cost based on video duration
  const calculateTotalCost = () => {
    if (!selectedVideo?.duration) return 0;
    let cost = calculateSwapCost(selectedVideo.duration);
    if (enableVoiceChange) {
      cost += calculateVoiceChangeCost(selectedVideo.duration);
    }
    return cost;
  };

  // Check if form is valid
  const isFormValid = () => {
    if (!selectedVideo?.videoKey) return false;
    if (!selectedStyle) return false;
    if (useCustomPrompt) {
      return characterPrompt.trim().length > 0;
    }
    return selectedCharacter !== null;
  };

  // Generate swap
  const handleGenerateSwap = async () => {
    if (!selectedVideo?.videoKey) {
      setError('Please select a video first');
      return;
    }

    if (!useCustomPrompt && !selectedCharacter) {
      setError('Please select a character or enter a custom description');
      return;
    }

    if (useCustomPrompt && !characterPrompt.trim()) {
      setError('Please enter a character description');
      return;
    }

    if (!selectedStyle) {
      setError('Please select an art style');
      return;
    }

    const totalCost = calculateTotalCost();
    if (tokensRemaining < totalCost) {
      setError(`Not enough tokens. You need ${totalCost} tokens but only have ${tokensRemaining}.`);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await swapStudioApi.createSwap({
        userId,
        sourceVideoKey: selectedVideo.videoKey,
        videoDuration: selectedVideo.duration || 0, // Send duration for pricing calculation
        characterId: useCustomPrompt ? undefined : selectedCharacter?.characterId,
        characterPrompt: useCustomPrompt ? characterPrompt : undefined,
        artStyle: selectedStyle,
        swapMode,
        klingPrompt: swapMode === 'kling-motion' && klingPrompt.trim() ? klingPrompt.trim() : undefined,
        enableVoiceChange,
        voiceId: enableVoiceChange ? selectedVoiceId : undefined,
      });

      const swapId = response.data.swapId;
      setSwapResult({
        swapId,
        status: 'processing',
        progress: 0,
      });

      // Update allowances if returned
      if (response.data.allowances) {
        dispatch(setAllowances(response.data.allowances));
      }

      // Start polling for status
      startPolling(swapId);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start swap');
      setIsGenerating(false);
    }
  };

  // Poll for swap status
  const startPolling = (swapId: string) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const response = await swapStudioApi.getSwapStatus(userId, swapId);
        const data = response.data;

        setSwapResult({
          swapId,
          status: data.status,
          resultVideoUrl: data.videoUrl,
          progress: data.progress || 0,
          progressMessage: data.progressMessage,
          error: data.error,
        });

        if (data.status === 'completed' || data.status === 'failed') {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          setIsGenerating(false);

          if (data.status === 'completed') {
            setSuccessMessage('Motion capture completed!');
          } else if (data.error) {
            setError(data.error);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
  };

  // Download result video
  const handleDownload = async () => {
    if (!swapResult?.resultVideoUrl) return;

    try {
      const response = await fetch(swapResult.resultVideoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `motion-capture-${swapResult.swapId}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download video');
    }
  };

  // Reset and try again
  const handleReset = () => {
    setSelectedVideo(null);
    setSelectedCharacter(null);
    setCharacterPrompt('');
    setSwapResult(null);
    setError(null);
    setIsGenerating(false);
  };

  // Handle voice selection with premium check
  const handleVoiceSelect = (voiceId: string) => {
    const voice = VOICE_OPTIONS.find(v => v.id === voiceId);
    if (voice?.isPremium && !hasSubscription) {
      setError('Premium voices require a subscription');
      return;
    }
    setSelectedVoiceId(voiceId);
  };

  // If generating or completed, show result view
  if (swapResult) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 50%, #0D0D0F 100%)',
          py: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
              }}
            >
              <SwapHorizIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                Motion Capture
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {swapResult.status === 'processing' ? 'Generating your video...' : swapResult.status === 'completed' ? 'Your video is ready!' : 'Generation failed'}
              </Typography>
            </Box>
          </Box>

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
            {swapResult.status === 'processing' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress sx={{ mb: 2, color: '#8B5CF6' }} />
                <Typography variant="h6" sx={{ mb: 1, color: '#fff' }}>
                  {swapResult.progressMessage || 'Processing...'}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={swapResult.progress || 0}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    maxWidth: 400,
                    mx: 'auto',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    },
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {swapResult.progress || 0}% complete
                </Typography>
              </Box>
            )}

            {swapResult.status === 'completed' && swapResult.resultVideoUrl && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CheckCircleIcon sx={{ color: '#22C55E' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                    Motion Capture Complete!
                  </Typography>
                </Box>

                <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 3, maxWidth: 600, mx: 'auto' }}>
                  <video
                    ref={resultVideoRef}
                    src={swapResult.resultVideoUrl}
                    controls
                    style={{
                      width: '100%',
                      maxHeight: '500px',
                      background: '#000',
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    sx={{
                      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                      px: 3,
                    }}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: '#fff',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                        background: 'rgba(255,255,255,0.05)',
                      },
                    }}
                  >
                    Create Another
                  </Button>
                </Box>
              </Box>
            )}

            {swapResult.status === 'failed' && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: '#EF4444', mb: 2 }}>
                  Generation Failed
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
                  {swapResult.error || 'An error occurred'}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleReset}
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  }}
                >
                  Try Again
                </Button>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 50%, #0D0D0F 100%)',
        py: 4,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                flexShrink: 0,
              }}
            >
              <SwapHorizIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                Motion Capture
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
                Create viral character swaps with AI motion control
              </Typography>
            </Box>
          </Box>

          {/* View My Videos button */}
          <Button
            variant="contained"
            onClick={() => navigate('/my-videos')}
            startIcon={<VideoLibraryIcon />}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              background: '#8B5CF6',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              '&:hover': {
                background: '#7C3AED',
                boxShadow: '0 4px 12px rgba(139,92,246,0.4)',
              },
            }}
          >
            View My Videos
          </Button>
          <IconButton
            onClick={() => navigate('/my-videos')}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              width: 44,
              height: 44,
              background: '#8B5CF6',
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
              '&:hover': {
                background: '#7C3AED',
              },
            }}
          >
            <VideoLibraryIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<GradientConnector />}
          sx={{ mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography sx={{ color: '#fff', fontSize: { xs: '0.7rem', sm: '0.85rem' }, fontWeight: 500 }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Main Content - Two Column Layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, width: '100%', minWidth: 0 }}>
          {/* Left Column - Step Content */}
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
              {/* Step 0: Source Video Selection */}
              {activeStep === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <VideoLibraryIcon sx={{ color: '#8B5CF6' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                      Select Source Video
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mb: 3 }}>
                    Choose a video to apply motion capture. The character in this video will be replaced.
                  </Typography>

                  {loadingVideos || loadingDuration ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, gap: 2 }}>
                      <CircularProgress sx={{ color: '#8B5CF6' }} />
                      {loadingDuration && (
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                          Loading video details...
                        </Typography>
                      )}
                    </Box>
                  ) : userVideos.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, background: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
                        No videos found. Create a video first!
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/create/video')}
                        sx={{
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        }}
                      >
                        Create Video
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Grid container spacing={2}>
                        {userVideos.map((video) => {
                          const videoTooLong = (video.duration || 0) > MAX_VIDEO_DURATION_SECONDS;
                          return (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={video.videoId}>
                              <VideoCard
                                video={video}
                                isSelected={selectedVideo?.videoId === video.videoId}
                                isTooLong={videoTooLong}
                                onClick={() => handleVideoSelect(video)}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>

                      {hasMoreVideos && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                          <Button
                            variant="outlined"
                            onClick={handleLoadMoreVideos}
                            disabled={loadingMoreVideos}
                            sx={{
                              borderColor: 'rgba(139, 92, 246, 0.5)',
                              color: '#8B5CF6',
                              '&:hover': {
                                borderColor: '#8B5CF6',
                                background: 'rgba(139, 92, 246, 0.1)',
                              },
                            }}
                          >
                            {loadingMoreVideos ? (
                              <CircularProgress size={20} sx={{ mr: 1, color: '#8B5CF6' }} />
                            ) : null}
                            {loadingMoreVideos ? 'Loading...' : 'Load More Videos'}
                          </Button>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              )}

              {/* Step 1: Swap Mode Selection */}
              {activeStep === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <SwapHorizIcon sx={{ color: '#8B5CF6' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                      Swap Mode
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mb: 3 }}>
                    Choose how you want to apply the character swap. Pricing: 50 tokens per 10 seconds of video (rounded up).
                  </Typography>

                  <Box sx={{ width: { xs: '100%', md: '50%' }, mb: 3 }}>
                    <StyledDropdown
                      options={swapModeOptions}
                      value={swapMode}
                      onChange={(id) => setSwapMode(id as SwapMode)}
                      placeholder="Select swap mode"
                      icon={<SwapHorizIcon sx={{ fontSize: 20 }} />}
                      fullWidth
                    />
                  </Box>

                  {/* Kling Mode Prompt - only shown when Kling is selected */}
                  {swapMode === 'kling-motion' && (
                    <Box sx={{ mb: 3 }}>
                      <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', mb: 1 }}>
                        Kling Prompt (Optional)
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 2 }}>
                        Describe the motion or action you want. E.g., "An African American woman dancing energetically"
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Describe the motion or action..."
                        value={klingPrompt}
                        onChange={(e) => setKlingPrompt(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            color: '#fff',
                            fontSize: '0.95rem',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                            '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                          },
                          '& .MuiInputBase-input': {
                            '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                          },
                        }}
                      />
                    </Box>
                  )}

                  {/* Pricing explanation */}
                  <Box sx={{ p: 2, borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <GruviCoin size={16} />
                      <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
                        Pricing
                      </Typography>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                      50 tokens per 10 seconds of video (rounded up to next 10s).
                      {selectedVideo?.duration && (
                        <> Your {Math.round(selectedVideo.duration)}s video = <strong>{calculateSwapCost(selectedVideo.duration)} tokens</strong>.</>
                      )}
                    </Typography>
                  </Box>

                  {/* Navigation buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Button
                      startIcon={<ArrowBackIcon />}
                      onClick={() => {
                        setSelectedVideo(null);
                        setActiveStep(0);
                      }}
                      sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none' }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => setActiveStep(2)}
                      sx={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        textTransform: 'none',
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 2: Character Selection */}
              {activeStep === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon sx={{ color: '#EC4899' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                      Select Character
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mb: 3 }}>
                    Choose the character you want us to swap into the video. We'll use the reference images of that character to create your UGC video.
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={useCustomPrompt}
                        onChange={(e) => setUseCustomPrompt(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B5CF6' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8B5CF6' },
                        }}
                      />
                    }
                    label="Use custom description"
                    sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}
                  />

                  {useCustomPrompt ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Describe the new character in detail. E.g., 'A young woman with long red hair, wearing a blue dress, smiling warmly'"
                      value={characterPrompt}
                      onChange={(e) => setCharacterPrompt(e.target.value)}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '16px',
                          background: 'rgba(255,255,255,0.03)',
                          color: '#fff',
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                          '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                        },
                        '& .MuiInputBase-input': {
                          '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
                        },
                      }}
                    />
                  ) : (
                    <Box sx={{ width: { xs: '100%', md: '50%' }, mb: 3 }}>
                      {loadingCharacters ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
                          <CircularProgress size={20} sx={{ color: '#8B5CF6' }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Loading characters...</Typography>
                        </Box>
                      ) : characterOptions.length === 0 ? (
                        <Box sx={{ py: 2 }}>
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontSize: '0.9rem' }}>
                            No characters found.
                          </Typography>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => setUseCustomPrompt(true)}
                            sx={{ color: '#8B5CF6', textTransform: 'none' }}
                          >
                            Use custom description instead
                          </Button>
                        </Box>
                      ) : (
                        <StyledDropdown
                          options={characterOptions}
                          value={selectedCharacter?.characterId || ''}
                          onChange={(id) => {
                            const char = userCharacters.find(c => c.characterId === id);
                            setSelectedCharacter(char || null);
                          }}
                          placeholder="Select character"
                          icon={<PersonIcon sx={{ fontSize: 20 }} />}
                          fullWidth
                        />
                      )}
                    </Box>
                  )}

                  {/* Art Style Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <BrushIcon sx={{ color: '#8B5CF6', fontSize: 20 }} />
                      <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                        Art Style
                      </Typography>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 2 }}>
                      Select the style for the reference image we'll generate as the start frame.
                    </Typography>
                    <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                      <StyledDropdown
                        options={ART_STYLE_OPTIONS}
                        value={selectedStyle}
                        onChange={(id) => setSelectedStyle(id)}
                        placeholder="Select art style"
                        icon={<BrushIcon sx={{ fontSize: 20 }} />}
                        fullWidth
                      />
                    </Box>
                  </Box>

                  {/* Navigation buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Button
                      startIcon={<ArrowBackIcon />}
                      onClick={() => setActiveStep(1)}
                      sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none' }}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => setActiveStep(3)}
                      disabled={(useCustomPrompt ? !characterPrompt.trim() : !selectedCharacter) || !selectedStyle}
                      sx={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        textTransform: 'none',
                        '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Step 3: Voice Change (Optional) & Generate */}
              {activeStep === 3 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <RecordVoiceOverIcon sx={{ color: '#F59E0B' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                      Voice Change
                    </Typography>
                    <Chip
                      label="Optional"
                      size="small"
                      sx={{
                        ml: 1,
                        background: 'rgba(245,158,11,0.1)',
                        color: '#F59E0B',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mb: 3 }}>
                    Optionally change the voice to match the new character.
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={enableVoiceChange}
                        onChange={(e) => setEnableVoiceChange(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#F59E0B' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#F59E0B' },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Enable voice transformation</Typography>
                        {selectedVideo?.duration && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography sx={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.85rem' }}>+{calculateVoiceChangeCost(selectedVideo.duration)}</Typography>
                            <GruviCoin size={14} />
                          </Box>
                        )}
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />

                  {enableVoiceChange && (
                    <Box sx={{ width: { xs: '100%', md: '50%' }, mb: 3 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 1.5 }}>
                        Select target voice
                      </Typography>
                      <StyledDropdown
                        options={VOICE_OPTIONS}
                        value={selectedVoiceId}
                        onChange={handleVoiceSelect}
                        showAudioPreview
                        hasPremiumAccess={hasSubscription}
                        icon={<RecordVoiceOverIcon sx={{ fontSize: 20 }} />}
                        fullWidth
                      />
                    </Box>
                  )}

                  {/* Voice pricing explanation */}
                  <Box sx={{ p: 2, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <GruviCoin size={16} />
                      <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
                        Voice Pricing
                      </Typography>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                      50 tokens per minute of video (rounded up to next minute).
                      {selectedVideo?.duration && (
                        <> Your {Math.round(selectedVideo.duration)}s video = <strong>{calculateVoiceChangeCost(selectedVideo.duration)} tokens</strong> for voice change.</>
                      )}
                    </Typography>
                  </Box>

                  {/* Navigation buttons - generate is in mobile summary below */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Button
                      startIcon={<ArrowBackIcon />}
                      onClick={() => setActiveStep(2)}
                      sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none' }}
                    >
                      Back
                    </Button>
                    {/* Generate button on lg screens (mobile has it in summary below) */}
                    <Button
                      variant="contained"
                      onClick={handleGenerateSwap}
                      disabled={isGenerating || !isFormValid() || tokensRemaining < calculateTotalCost()}
                      sx={{
                        display: { xs: 'none', lg: 'flex' },
                        px: 4,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          boxShadow: '0 12px 32px rgba(139, 92, 246, 0.4)',
                        },
                        '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      {isGenerating ? (
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                      ) : (
                        'Generate Motion Capture'
                      )}
                    </Button>
                  </Box>
                </Box>
              )}

            {/* Mobile Summary Section - shows on smaller screens after video selected */}
            {activeStep > 0 && selectedVideo && (
              <Box sx={{ display: { xs: 'block', lg: 'none' }, mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Summary header */}
                <Typography variant="subtitle2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', mb: 2, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                  Summary
                </Typography>

                {/* Compact chip-style summary */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
                  {/* Video chip */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '20px',
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}>
                    {selectedVideo?.thumbnailUrl && (
                      <Box
                        component="img"
                        src={selectedVideo.thumbnailUrl}
                        sx={{ width: 20, height: 20, borderRadius: '4px', objectFit: 'cover' }}
                      />
                    )}
                    <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedVideo?.duration ? formatDuration(selectedVideo.duration) : 'Video'}
                    </Typography>
                  </Box>

                  {/* Swap Mode chip */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <SwapHorizIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
                    <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                      {swapModeOptions.find(m => m.id === swapMode)?.label?.replace(' Character', '') || 'Replace'}
                    </Typography>
                  </Box>

                  {/* Character chip - only show if selected */}
                  {((useCustomPrompt && characterPrompt.trim()) || selectedCharacter) && (
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
                      {!useCustomPrompt && selectedCharacter?.imageUrls?.[0] && (
                        <Avatar src={selectedCharacter.imageUrls[0]} sx={{ width: 20, height: 20 }} />
                      )}
                      <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {useCustomPrompt ? 'Custom' : selectedCharacter?.characterName}
                      </Typography>
                    </Box>
                  )}

                  {/* Art Style chip - only show if selected */}
                  {selectedStyle && (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                      <Avatar
                        src={ART_STYLE_OPTIONS.find(s => s.id === selectedStyle)?.image}
                        sx={{ width: 20, height: 20, borderRadius: '4px' }}
                        variant="rounded"
                      />
                      <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                        {ART_STYLE_OPTIONS.find(s => s.id === selectedStyle)?.label}
                      </Typography>
                    </Box>
                  )}

                  {/* Voice chip - only show on step 3 if enabled */}
                  {activeStep === 3 && enableVoiceChange && (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '20px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}>
                      <Avatar src={VOICE_OPTIONS.find(v => v.id === selectedVoiceId)?.image} sx={{ width: 20, height: 20 }} />
                      <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                        {VOICE_OPTIONS.find(v => v.id === selectedVoiceId)?.label}
                      </Typography>
                    </Box>
                  )}

                  {/* Token cost chip */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}>
                    <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                      {calculateTotalCost()}
                    </Typography>
                    <GruviCoin size={16} />
                  </Box>
                </Box>

                {/* Generate Button - only enabled on last step */}
                {activeStep === 3 ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={handleGenerateSwap}
                        disabled={isGenerating || !isFormValid() || tokensRemaining < calculateTotalCost()}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '1rem',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                          },
                          '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
                        }}
                      >
                        {isGenerating ? (
                          <CircularProgress size={24} sx={{ color: '#fff' }} />
                        ) : (
                          'Generate Motion Capture'
                        )}
                      </Button>
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{ textAlign: 'center', mt: 2, display: 'block', color: 'rgba(255,255,255,0.5)' }}
                    >
                      Generation typically takes 3-5 minutes
                    </Typography>
                  </>
                ) : (
                  <Typography
                    variant="caption"
                    sx={{ textAlign: 'center', display: 'block', color: 'rgba(255,255,255,0.5)' }}
                  >
                    Complete all steps to generate
                  </Typography>
                )}
              </Box>
            )}
            </Paper>
          </Box>

          {/* Right Column - Summary - only on lg screens and only after step 0 (video selected) */}
          {activeStep > 0 && selectedVideo && (
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
                      {calculateTotalCost()} x
                    </Typography>
                    <GruviCoin size={20} />
                  </Box>
                </Box>

                {/* Summary bullets */}
                <Box>
                  {/* Video */}
                  <Box sx={{ display: 'flex', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', width: 100, flexShrink: 0, color: 'rgba(255,255,255,0.6)' }}>Video</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                      <Box
                        component="img"
                        src={selectedVideo.thumbnailUrl}
                        sx={{ width: 32, height: 32, borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#8B5CF6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedVideo.title || 'Video'}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Character */}
                  <Box sx={{ display: 'flex', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', width: 100, flexShrink: 0, color: 'rgba(255,255,255,0.6)' }}>Character</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                      {useCustomPrompt ? (
                        <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: characterPrompt.trim() ? '#EC4899' : 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {characterPrompt.trim() ? 'Custom description' : 'Not specified'}
                        </Typography>
                      ) : selectedCharacter ? (
                        <>
                          <Avatar
                            src={selectedCharacter.imageUrls?.[0]}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#EC4899', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedCharacter.characterName}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                          Not selected
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {/* Art Style */}
                  <Box sx={{ display: 'flex', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', width: 100, flexShrink: 0, color: 'rgba(255,255,255,0.6)' }}>Art Style</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                      {selectedStyle ? (
                        <>
                          <Avatar
                            src={ART_STYLE_OPTIONS.find(s => s.id === selectedStyle)?.image}
                            sx={{ width: 24, height: 24, borderRadius: '4px' }}
                            variant="rounded"
                          />
                          <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#8B5CF6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ART_STYLE_OPTIONS.find(s => s.id === selectedStyle)?.label}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                          Not selected
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {/* Swap Mode */}
                  <Box sx={{ display: 'flex', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', width: 100, flexShrink: 0, color: 'rgba(255,255,255,0.6)' }}>Swap Mode</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                      <SwapHorizIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {swapModeOptions.find(m => m.id === swapMode)?.label}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Voice Change */}
                  <Box sx={{ display: 'flex', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', width: 100, flexShrink: 0, color: 'rgba(255,255,255,0.6)' }}>Voice</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                      {enableVoiceChange ? (
                        <>
                          <Avatar
                            src={VOICE_OPTIONS.find(v => v.id === selectedVoiceId)?.image}
                            sx={{ width: 18, height: 18 }}
                          />
                          <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: '#F59E0B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {VOICE_OPTIONS.find(v => v.id === selectedVoiceId)?.label}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ fontWeight: 500, fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                          None
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Typography
                  variant="caption"
                  sx={{ textAlign: 'center', mt: 3, display: 'block', color: 'rgba(255,255,255,0.5)' }}
                >
                  Generation typically takes 3-5 minutes
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MotionCapturePage;
