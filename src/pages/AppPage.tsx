import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
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
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
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
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DeleteIcon from '@mui/icons-material/Delete';
import LyricsIcon from '@mui/icons-material/Lyrics';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { videosApi } from '../services/api';
import { useAccountData } from '../hooks/useAccountData';

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
  lyrics?: string;
  lyricsWithTags?: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'songs' | 'videos'>(getInitialTab());

  // Update tab when route changes (e.g., navigating to /characters)
  useEffect(() => {
    setActiveTab(getInitialTab());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, defaultTab]);

  const songsPerPage = 10;
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoPollingRef = useRef<NodeJS.Timeout | null>(null);
  
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
        message: 'Your song is being created... This usually takes about a minute or two.',
        severity: 'info'
      });
      startPolling();
      
      // Remove the query param from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('generating');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, startPolling]);

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
    
    // Convert Song to AudioPlayer Song format
    const audioSong = {
      songId: song.songId,
      songTitle: song.songTitle,
      genre: song.genre,
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
        audioUrl: s.audioUrl,
        status: s.status,
        createdAt: s.createdAt,
        duration: s.actualDuration,
        lyrics: s.lyrics,
        lyricsWithTags: s.lyricsWithTags,
      }));
    
    playSong(audioSong, completedSongs);
    setPlayingId(song.songId);
  }, [songs, playSong]);

  // Update songs list in global player when songs change
  useEffect(() => {
    const completedSongs = songs
      .filter(s => s.status === 'completed' && s.audioUrl)
      .map(s => ({
        songId: s.songId,
        songTitle: s.songTitle,
        genre: s.genre,
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
      // Try fetching with CORS mode first
      const response = await fetch(song.audioUrl, {
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!response.ok) throw new Error('Failed to fetch audio');
      
      const blob = await response.blob();
      
      // Create a download link with the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${song.songTitle || 'song'}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup after a short delay
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
      setNotification({
        open: true,
        message: `Downloaded "${song.songTitle}"`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Download error:', error);
      
      // Fallback: Use an iframe to trigger download without opening new tab
      try {
        // Create a hidden iframe to trigger download
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Create a link inside the iframe document to force download
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const link = iframeDoc.createElement('a');
          link.href = song.audioUrl;
          link.download = `${song.songTitle || 'song'}.mp3`;
          link.setAttribute('download', `${song.songTitle || 'song'}.mp3`);
          iframeDoc.body.appendChild(link);
          link.click();
          
          // Remove iframe after a delay
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        } else {
          // Last resort: direct link click without target="_blank"
          const link = document.createElement('a');
          link.href = song.audioUrl;
          link.download = `${song.songTitle || 'song'}.mp3`;
          link.setAttribute('download', `${song.songTitle || 'song'}.mp3`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        setNotification({
          open: true,
          message: `Downloading "${song.songTitle}"...`,
          severity: 'info'
        });
      } catch (fallbackError) {
        setNotification({
          open: true,
          message: 'Failed to download. Try right-clicking and "Save as..."',
          severity: 'error'
        });
      }
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
    navigate(`/create?tab=video&song=${song.songId}`);
  };

  const handleDeleteSong = (song: Song) => {
    setSongToDelete(song);
    setDeleteConfirmOpen(true);
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

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTab: 'songs' | 'videos' | null
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
    <Container maxWidth="lg" sx={{ pt: 2, pb: 3, px: { xs: 2, sm: 3 } }}>
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
                    ) : currentSong?.songId === song.songId && isAudioPlaying ? (
                      <VolumeUpIcon sx={{ color: '#fff', fontSize: 24 }} />
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
                        {song.genre} • {song.actualDuration ? `${Math.floor(song.actualDuration / 60)}:${String(Math.floor(song.actualDuration % 60)).padStart(2, '0')}` : '--:--'} • {new Date(song.createdAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>

                  {/* Action Buttons - Only show for completed songs */}
                  {!isProcessing && !isFailed && (
                    <>
                      {/* Desktop: Full buttons */}
                      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
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

                        {/* View Lyrics Button */}
                        <Tooltip title="View Lyrics" arrow>
                          <IconButton
                            onClick={() => handleViewLyrics(song)}
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
                            <LyricsIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>

                        {/* Download Button */}
                        <Tooltip title="Download" arrow>
                          <IconButton
                            onClick={() => handleDownload(song)}
                            disabled={isDownloading === song.songId}
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
                            {isDownloading === song.songId ? (
                              <CircularProgress size={20} sx={{ color: '#007AFF' }} />
                            ) : (
                              <DownloadIcon sx={{ fontSize: 20 }} />
                            )}
                          </IconButton>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            onClick={() => handleDeleteSong(song)}
                            disabled={deletingSongId === song.songId}
                            sx={{
                              width: 40,
                              height: 40,
                              background: '#fff',
                              border: '1px solid rgba(0,0,0,0.08)',
                              color: '#FF3B30',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                              '&:hover': {
                                background: '#fff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              },
                            }}
                          >
                            {deletingSongId === song.songId ? (
                              <CircularProgress size={20} sx={{ color: '#FF3B30' }} />
                            ) : (
                              <DeleteIcon sx={{ fontSize: 20 }} />
                            )}
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

                      {/* Mobile: Play button + More menu */}
                      <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        {/* Play Button */}
                        <IconButton
                          onClick={() => handlePlayPause(song.songId)}
                          sx={{
                            width: 36,
                            height: 36,
                            background: '#fff',
                            border: '1px solid rgba(0,0,0,0.08)',
                            color: '#007AFF',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          }}
                        >
                          {playingId === song.songId ? (
                            <PauseIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>

                        {/* More Menu Button */}
                        <IconButton
                          onClick={(e) => {
                            setMenuAnchorEl(e.currentTarget);
                            setMenuSong(song);
                          }}
                          sx={{
                            width: 36,
                            height: 36,
                            background: '#fff',
                            border: '1px solid rgba(0,0,0,0.08)',
                            color: '#86868B',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          }}
                        >
                          <MoreVertIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </>
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

      {/* Lyrics Dialog */}
      <Dialog
        open={lyricsDialogOpen}
        onClose={() => setLyricsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(180deg, #fff 0%, #f8f9fa 100%)',
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
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LyricsIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {selectedSongForLyrics?.songTitle || 'Lyrics'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B' }}>
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
                color: '#1D1D1F',
              }}
            >
              {selectedSongForLyrics.lyrics}
            </Typography>
          ) : (
            <Typography sx={{ color: '#86868B', textAlign: 'center', py: 4 }}>
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
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
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
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }
        }}
      >
        <MenuItem onClick={() => {
          if (menuSong) handleViewLyrics(menuSong);
          setMenuAnchorEl(null);
          setMenuSong(null);
        }}>
          <ListItemIcon>
            <LyricsIcon sx={{ color: '#007AFF' }} />
          </ListItemIcon>
          <ListItemText>View Lyrics</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (menuSong) handleDownload(menuSong);
          setMenuAnchorEl(null);
          setMenuSong(null);
        }}>
          <ListItemIcon>
            <DownloadIcon sx={{ color: '#007AFF' }} />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (menuSong) handleCreateVideo(menuSong);
          setMenuAnchorEl(null);
          setMenuSong(null);
        }}>
          <ListItemIcon>
            <MovieIcon sx={{ color: '#007AFF' }} />
          </ListItemIcon>
          <ListItemText>Create Video</ListItemText>
        </MenuItem>
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
          <ListItemText>Delete</ListItemText>
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
          sx: {
            borderRadius: 3,
            p: 1,
            minWidth: 340,
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Delete Song?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#86868B' }}>
            Are you sure you want to delete "<strong>{songToDelete?.songTitle}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setDeleteConfirmOpen(false);
              setSongToDelete(null);
            }}
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: 2,
              textTransform: 'none',
              borderColor: 'rgba(0,0,0,0.15)',
              color: '#1D1D1F',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteSong}
            variant="contained"
            sx={{
              flex: 1,
              borderRadius: 2,
              textTransform: 'none',
              background: '#FF3B30',
              '&:hover': {
                background: '#E53528',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Audio player is now global - see GlobalAudioPlayer component */}
    </Container>
  );
};

export default AppPage;
