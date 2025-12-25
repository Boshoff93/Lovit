import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Paper,
  Chip,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
  CircularProgress,
  LinearProgress,
  Skeleton
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { songsApi } from '../services/api';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CloseIcon from '@mui/icons-material/Close';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import DeleteIcon from '@mui/icons-material/Delete';
import { videosApi } from '../services/api';

interface Song {
  songId: string;
  songTitle: string;
  genre: string;
  actualDuration?: number;
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  progressMessage?: string;
  audioUrl?: string;
}

interface Video {
  videoId: string;
  songId: string;
  songTitle?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  progressMessage?: string;
  createdAt: string;
  duration?: number;
}

const AppPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Account data is cached globally - no need to fetch here
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'songs' | 'videos' | 'characters'>('songs');
  const songsPerPage = 10;
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoPollingRef = useRef<NodeJS.Timeout | null>(null);
  
  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
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
  const fetchSongs = useCallback(async (showLoading = true) => {
    if (!user?.userId) return;
    
    if (showLoading) setIsLoadingSongs(true);
    try {
      const response = await songsApi.getUserSongs(user.userId);
      const fetchedSongs = response.data.songs || [];
      
      // Sort by createdAt descending (newest first)
      fetchedSongs.sort((a: Song, b: Song) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setSongs(fetchedSongs);
      
      // Check if any songs are still processing
      const hasProcessingSongs = fetchedSongs.some((s: Song) => s.status === 'processing');
      return hasProcessingSongs;
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      if (showLoading) setIsLoadingSongs(false);
    }
    return false;
  }, [user?.userId]);

  // Start polling for song updates
  const startPolling = useCallback(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Poll every 3 seconds
    pollingIntervalRef.current = setInterval(async () => {
      const hasProcessing = await fetchSongs(false);
      
      // Stop polling if no more processing songs
      if (!hasProcessing && pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        
        // Show success notification when song completes
        setNotification({
          open: true,
          message: 'Your song is ready! 🎵',
          severity: 'success'
        });
      }
    }, 3000);
  }, [fetchSongs]);

  // Initial fetch and polling setup
  useEffect(() => {
    const initFetch = async () => {
      const hasProcessing = await fetchSongs(true);
      
      // If there are processing songs, start polling
      if (hasProcessing) {
        startPolling();
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
    if (isGenerating) {
      // Show notification and start polling
      setNotification({
        open: true,
        message: 'Your song is being created... This usually takes about a minute.',
        severity: 'info'
      });
      startPolling();
      
      // Remove the query param from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('generating');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, startPolling]);

  // Note: Account data is cached globally and only fetched when needed (e.g., AccountPage)

  useEffect(() => {
    // Check if user just subscribed
    const hasSubscribed = searchParams.get('subscription') === 'true';
    const hasTopup = searchParams.get('topup') === 'true';
    if (hasSubscribed) {
      setNotification({
        open: true,
        message: `Welcome to Gruvi! Start creating your first song!`,
        severity: 'success'
      });
    }

    if (hasTopup) {
      setNotification({
        open: true,
        message: `Thank you for your purchase! Credits have been added to your account.`,
        severity: 'success'
      });
    }
  }, [searchParams]);

  // Fetch videos
  const fetchVideos = useCallback(async (showLoading = true): Promise<boolean> => {
    if (!user?.userId) return false;
    
    if (showLoading) {
      setIsLoadingVideos(true);
    }
    
    try {
      const response = await videosApi.getUserVideos(user.userId);
      setVideos(response.data.videos || []);
      
      // Check if any videos are still processing
      const hasProcessing = (response.data.videos || []).some(
        (video: Video) => video.status === 'processing'
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
  }, [user?.userId]);

  // Start video polling for processing videos
  const startVideoPolling = useCallback(() => {
    if (videoPollingRef.current) {
      clearInterval(videoPollingRef.current);
    }
    
    videoPollingRef.current = setInterval(async () => {
      const hasProcessing = await fetchVideos(false);
      
      if (!hasProcessing && videoPollingRef.current) {
        clearInterval(videoPollingRef.current);
        videoPollingRef.current = null;
        
        setNotification({
          open: true,
          message: 'Your music video is ready! 🎬',
          severity: 'success'
        });
      }
    }, 5000);
  }, [fetchVideos]);

  // Fetch videos on mount
  useEffect(() => {
    const initVideoFetch = async () => {
      const hasProcessing = await fetchVideos(true);
      if (hasProcessing) {
        startVideoPolling();
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
    
    if (currentSong?.songId === song.songId && isAudioPlaying) {
      // Pause current song
      audioRef.current?.pause();
      setIsAudioPlaying(false);
    } else if (currentSong?.songId === song.songId && !isAudioPlaying) {
      // Resume current song
      audioRef.current?.play();
      setIsAudioPlaying(true);
    } else {
      // Play new song
      setCurrentSong(song);
      setPlayingId(song.songId);
      setAudioProgress(0);
      
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.load();
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  }, [currentSong, isAudioPlaying]);

  const handleAudioTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setAudioProgress(audioRef.current.currentTime);
    }
  }, []);

  const handleAudioLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    setIsAudioPlaying(false);
    setAudioProgress(0);
    setPlayingId(null);
    
    // Auto-play next song if available
    const currentIndex = songs.findIndex(s => s.songId === currentSong?.songId);
    const nextSong = songs[currentIndex + 1];
    if (nextSong && nextSong.status === 'completed' && nextSong.audioUrl) {
      handlePlaySong(nextSong);
    }
  }, [songs, currentSong, handlePlaySong]);

  const handleSeekAudio = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioDuration) return;
    
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * audioDuration;
    
    audioRef.current.currentTime = newTime;
    setAudioProgress(newTime);
  }, [audioDuration]);

  const handleClosePlayer = useCallback(() => {
    audioRef.current?.pause();
    setCurrentSong(null);
    setIsAudioPlaying(false);
    setPlayingId(null);
    setAudioProgress(0);
  }, []);

  const handlePreviousSong = useCallback(() => {
    const completedSongs = songs.filter(s => s.status === 'completed' && s.audioUrl);
    const currentInCompleted = completedSongs.findIndex(s => s.songId === currentSong?.songId);
    const prevSong = completedSongs[currentInCompleted - 1];
    if (prevSong) {
      handlePlaySong(prevSong);
    }
  }, [songs, currentSong, handlePlaySong]);

  const handleNextSong = useCallback(() => {
    const completedSongs = songs.filter(s => s.status === 'completed' && s.audioUrl);
    const currentInCompleted = completedSongs.findIndex(s => s.songId === currentSong?.songId);
    const nextSong = completedSongs[currentInCompleted + 1];
    if (nextSong) {
      handlePlaySong(nextSong);
    }
  }, [songs, currentSong, handlePlaySong]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCloseNotification = useCallback(() => {
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

  const handleDownload = (song: Song) => {
    if (song.audioUrl) {
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = song.audioUrl;
      link.download = `${song.songTitle || 'song'}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setNotification({
        open: true,
        message: `Downloading "${song.songTitle}"...`,
        severity: 'info'
      });
    } else {
      setNotification({
        open: true,
        message: 'Audio not available for download',
        severity: 'warning'
      });
    }
  };

  const handleCreateVideo = (song: Song) => {
    // Navigate to video creation page with song ID
    navigate(`/create?tab=video&song=${song.songId}`);
  };

  const handleDeleteSong = async (song: Song) => {
    if (!user?.userId) return;
    
    setDeletingSongId(song.songId);
    
    try {
      await songsApi.deleteSong(user.userId, song.songId);
      
      // Remove from local state
      setSongs(prev => prev.filter(s => s.songId !== song.songId));
      
      setNotification({
        open: true,
        message: `"${song.songTitle}" deleted`,
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
    }
  };

  const handleWatchVideo = (video: Video) => {
    navigate(`/video/${video.videoId}`);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTab: 'songs' | 'videos' | 'characters' | null
  ) => {
    if (newTab !== null) {
      setActiveTab(newTab);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(songs.length / songsPerPage);
  const displayedSongs = songs.slice(
    (currentPage - 1) * songsPerPage,
    currentPage * songsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 0, sm: 0 }, pb: 3, px: { xs: 2, sm: 3 } }}>
      {/* Toggle Buttons - Equal width pill style */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, width: '100%' }}>
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          fullWidth
          sx={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '100px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            p: 0.5,
            position: 'relative',
            display: 'flex',
            width: '100%',
            maxWidth: { xs: '100%', sm: 480 },
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '100px !important',
              flex: 1,
              minWidth: { xs: 0, sm: 140 },
              px: { xs: 1.5, sm: 3 },
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              color: '#86868B',
              gap: 0.75,
              whiteSpace: 'nowrap',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 1,
              justifyContent: 'center',
              '&.Mui-selected': {
                background: '#007AFF',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,122,255,0.35)',
                '&:hover': {
                  background: '#007AFF',
                },
              },
              '&:hover': {
                background: 'rgba(0,122,255,0.06)',
              },
            },
          }}
        >
          <ToggleButton value="songs">
            <MusicNoteIcon sx={{ fontSize: 18 }} />
            Music
          </ToggleButton>
          <ToggleButton value="videos">
            <VideoLibraryIcon sx={{ fontSize: 18 }} />
            Music Videos
          </ToggleButton>
          <ToggleButton value="characters">
            <PersonIcon sx={{ fontSize: 18 }} />
            Characters
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Songs Tracklist */}
      {activeTab === 'songs' && (
      <Paper
        elevation={0}
        sx={{
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Tracklist Header */}
        <Box 
          sx={{ 
            p: 3, 
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QueueMusicIcon sx={{ color: '#007AFF' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
              Your Songs
            </Typography>
            <Chip 
              label={`${songs.length} tracks`} 
              size="small" 
              sx={{ 
                ml: 1,
                backgroundColor: 'rgba(0,122,255,0.1)',
                color: '#007AFF',
                fontWeight: 500
              }} 
            />
          </Box>
          {isMobile ? (
            <Tooltip title="Create New Song" arrow>
              <IconButton
                onClick={() => navigate('/create?tab=song')}
                sx={{
                  background: '#007AFF',
                  color: '#fff',
                  width: 32,
                  height: 32,
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: '#0066CC',
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create?tab=song')}
              sx={{
                background: '#007AFF',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.75,
                boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                '&:hover': {
                  background: '#0066CC',
                },
              }}
            >
              Create New
            </Button>
          )}
        </Box>

        {/* Tracklist */}
        {isLoadingSongs ? (
          <Box sx={{ p: 3 }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Skeleton variant="text" width={32} />
                <Skeleton variant="rounded" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </Box>
        ) : songs.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <MusicNoteIcon sx={{ fontSize: 64, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No songs yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Create your first song to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create?tab=song')}
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
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    px: 3,
                    borderBottom: index < displayedSongs.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                    transition: 'all 0.2s ease',
                    opacity: isProcessing ? 0.85 : 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0,122,255,0.03)',
                    },
                  }}
                >
                  {/* Track Number */}
                  <Typography
                    sx={{
                      width: 32,
                      textAlign: 'center',
                      color: '#86868B',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    {(currentPage - 1) * songsPerPage + index + 1}
                  </Typography>

                  {/* Album Art / Loading Indicator */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '8px',
                      background: isProcessing 
                        ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                        : isFailed
                        ? 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)'
                        : 'linear-gradient(135deg, #1D1D1F 0%, #3a3a3c 100%)',
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
                      <MusicNoteIcon sx={{ color: '#fff', fontSize: 24 }} />
                    )}
                  </Box>

                  {/* Track Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: isFailed ? '#FF3B30' : '#1D1D1F',
                        fontSize: '0.95rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {song.songTitle}
                    </Typography>
                    {isProcessing ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#007AFF', fontSize: '0.85rem', fontWeight: 500 }}>
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
                      <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
                        {song.genre} • {song.actualDuration ? `${Math.floor(song.actualDuration / 60)}:${String(Math.floor(song.actualDuration % 60)).padStart(2, '0')}` : '--:--'}
                      </Typography>
                    )}
                  </Box>

                  {/* Date */}
                  <Typography
                    sx={{
                      color: '#86868B',
                      fontSize: '0.85rem',
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    {new Date(song.createdAt).toLocaleDateString()}
                  </Typography>

                  {/* Action Buttons - Only show for completed songs */}
                  {!isProcessing && !isFailed && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* Play Button */}
                      <Tooltip title={playingId === song.songId ? "Pause" : "Play"} arrow>
                        <IconButton
                          onClick={() => handlePlayPause(song.songId)}
                          sx={{
                            width: 40,
                            height: 40,
                            background: '#fff',
                            border: '1px solid rgba(0,0,0,0.08)',
                            color: '#007AFF',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            '&:hover': {
                              background: '#fff',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          {playingId === song.songId ? (
                            <PauseIcon sx={{ fontSize: 20 }} />
                          ) : (
                            <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </Tooltip>

                      {/* Download Button */}
                      <Tooltip title="Download" arrow>
                        <IconButton
                          onClick={() => handleDownload(song)}
                          sx={{
                            width: 40,
                            height: 40,
                            background: '#fff',
                            border: '1px solid rgba(0,0,0,0.08)',
                            color: '#007AFF',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            '&:hover': {
                              background: '#fff',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            },
                          }}
                        >
                          <DownloadIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>

                      {/* Create Video Button - Gradient matching "The AI Music Generator" */}
                      <Tooltip title="Create Music Video" arrow>
                        <IconButton
                          onClick={() => handleCreateVideo(song)}
                          sx={{
                            width: 40,
                            height: 40,
                            background: 'linear-gradient(135deg, #007AFF 0%, #00D4FF 50%, #5856D6 100%)',
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(0,122,255,0.4)',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <MovieIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  
                  {/* Processing indicator for action button area */}
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
                          size="small"
                          disabled={deletingSongId === song.songId}
                          sx={{
                            color: '#FF3B30',
                            '&:hover': {
                              backgroundColor: 'rgba(255,59,48,0.1)',
                            },
                          }}
                        >
                          {deletingSongId === song.songId ? (
                            <CircularProgress size={18} sx={{ color: '#FF3B30' }} />
                          ) : (
                            <DeleteIcon sx={{ fontSize: 18 }} />
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
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </Box>
        )}
      </Paper>
      )}

      {/* Music Videos Tab */}
      {activeTab === 'videos' && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VideoLibraryIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Your Music Videos
              </Typography>
              <Chip 
                label={`${videos.length} video${videos.length !== 1 ? 's' : ''}`} 
                size="small" 
                sx={{ 
                  ml: 1,
                  backgroundColor: 'rgba(0,122,255,0.1)',
                  color: '#007AFF',
                  fontWeight: 500
                }} 
              />
            </Box>
            {isMobile ? (
              <Tooltip title="Create New Video" arrow>
                <IconButton
                  onClick={() => navigate('/create?tab=video')}
                  sx={{
                    background: '#007AFF',
                    color: '#fff',
                    width: 32,
                    height: 32,
                    boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                    '&:hover': {
                      background: '#0066CC',
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create?tab=video')}
                sx={{
                  background: '#007AFF',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: '#0066CC',
                  },
                }}
              >
                Create New
              </Button>
            )}
          </Box>
          
          {/* Videos Grid */}
          {isLoadingVideos ? (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, 
              gap: 2,
              p: 3
            }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton 
                  key={index}
                  variant="rectangular" 
                  sx={{ 
                    aspectRatio: '9/16', 
                    borderRadius: 2,
                    background: 'rgba(0,122,255,0.1)'
                  }} 
                />
              ))}
            </Box>
          ) : videos.length > 0 ? (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, 
              gap: 2,
              p: 3
            }}>
              {videos.map((video) => (
                <Paper
                  key={video.videoId}
                  onClick={() => video.status === 'completed' && handleWatchVideo(video)}
                  sx={{
                    position: 'relative',
                    aspectRatio: '9/16',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: video.status === 'completed' ? 'pointer' : 'default',
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': video.status === 'completed' ? {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,122,255,0.2)',
                      borderColor: '#007AFF',
                    } : {},
                  }}
                >
                  {/* Thumbnail or Processing State */}
                  {video.status === 'processing' ? (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(0,122,255,0.1), rgba(88,86,214,0.1))',
                      }}
                    >
                      <CircularProgress 
                        size={40} 
                        sx={{ color: '#007AFF', mb: 2 }} 
                        variant={video.progress ? 'determinate' : 'indeterminate'}
                        value={video.progress || 0}
                      />
                      <Typography variant="caption" sx={{ color: '#007AFF', fontWeight: 600 }}>
                        {video.progressMessage || 'Creating video...'}
                      </Typography>
                      {video.progress && (
                        <Typography variant="caption" sx={{ color: '#86868B', mt: 0.5 }}>
                          {video.progress}%
                        </Typography>
                      )}
                    </Box>
                  ) : video.status === 'failed' ? (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(255,59,48,0.1), rgba(255,149,0,0.1))',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#FF3B30', fontWeight: 600 }}>
                        Failed to generate
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {/* Video Thumbnail */}
                      <Box
                        component="img"
                        src={video.thumbnailUrl || '/gruvi.png'}
                        alt={video.songTitle || 'Music Video'}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = '/gruvi.png';
                        }}
                      />
                      
                      {/* Play Icon Overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.3)',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                          }}
                        >
                          <PlayArrowRoundedIcon sx={{ fontSize: 32, color: '#007AFF', ml: 0.5 }} />
                        </Box>
                      </Box>
                    </>
                  )}
                  
                  {/* Title Gradient Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      p: 2,
                      pt: 4,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        lineHeight: 1.2,
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {video.songTitle || 'Music Video'}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.7rem',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                      }}
                    >
                      {new Date(video.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <VideoLibraryIcon sx={{ fontSize: 64, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No music videos yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Create a song first, then generate a music video from it
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create?tab=video')}
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
        </Paper>
      )}

      {/* Characters Tab */}
      {activeTab === 'characters' && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Your Characters
              </Typography>
              <Chip 
                label="0 characters" 
                size="small" 
                sx={{ 
                  ml: 1,
                  backgroundColor: 'rgba(0,122,255,0.1)',
                  color: '#007AFF',
                  fontWeight: 500
                }} 
              />
            </Box>
            {isMobile ? (
              <Tooltip title="Create New Character" arrow>
                <IconButton
                  onClick={() => navigate('/create?tab=character')}
                  sx={{
                    background: '#007AFF',
                    color: '#fff',
                    width: 32,
                    height: 32,
                    boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                    '&:hover': {
                      background: '#0066CC',
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create?tab=character')}
                sx={{
                  background: '#007AFF',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: '#0066CC',
                  },
                }}
              >
                Create New
              </Button>
            )}
          </Box>
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 64, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No characters yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Create characters to include in your song lyrics and music videos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create?tab=character')}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              }}
            >
              Create Character
            </Button>
          </Box>
        </Paper>
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
          sx={{ width: '100%', alignItems: 'center' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={handleAudioEnded}
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
        preload="metadata"
      />

      {/* Fixed Bottom Audio Player */}
      {currentSong && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            px: { xs: 2, sm: 3 },
            py: 1.5,
          }}
        >
          <Box sx={{ maxWidth: 'lg', mx: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Song Icon */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <VolumeUpIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>

            {/* Song Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#1D1D1F',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentSong.songTitle}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#86868B' }}
              >
                {currentSong.genre}
              </Typography>
            </Box>

            {/* Progress Bar */}
            <Box 
              onClick={handleSeekAudio}
              sx={{ 
                flex: 2, 
                display: { xs: 'none', sm: 'flex' }, 
                alignItems: 'center', 
                gap: 1,
                cursor: 'pointer',
              }}
            >
              <Typography variant="caption" sx={{ color: '#86868B', minWidth: 32 }}>
                {formatTime(audioProgress)}
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  height: 4,
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, #007AFF, #5856D6)',
                    borderRadius: 2,
                    transition: 'width 0.1s linear',
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#86868B', minWidth: 32 }}>
                {formatTime(audioDuration)}
              </Typography>
            </Box>

            {/* Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                onClick={handlePreviousSong}
                size="small"
                sx={{ color: '#1D1D1F' }}
              >
                <SkipPreviousIcon />
              </IconButton>
              <IconButton
                onClick={() => handlePlaySong(currentSong)}
                sx={{
                  width: 44,
                  height: 44,
                  background: '#007AFF',
                  color: '#fff',
                  '&:hover': {
                    background: '#0066CC',
                  },
                }}
              >
                {isAudioPlaying ? <PauseIcon /> : <PlayArrowRoundedIcon />}
              </IconButton>
              <IconButton
                onClick={handleNextSong}
                size="small"
                sx={{ color: '#1D1D1F' }}
              >
                <SkipNextIcon />
              </IconButton>
              <IconButton
                onClick={handleClosePlayer}
                size="small"
                sx={{ color: '#86868B', ml: 1 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AppPage;
