import React, { useState, useEffect, useCallback } from 'react';
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
  Tooltip
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAccountData } from '../hooks/useAccountData';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import MovieIcon from '@mui/icons-material/Movie';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';

// Mock data for generated songs
const mockSongs = [
  { id: '1', title: 'Summer Vibes', genre: 'Pop', duration: '3:24', createdAt: '2024-12-20', status: 'completed', albumArt: '/song1.jpg' },
  { id: '2', title: 'Midnight Dreams', genre: 'Lo-fi Hip Hop', duration: '2:45', createdAt: '2024-12-19', status: 'completed', albumArt: '/song2.jpg' },
  { id: '3', title: 'Electric Pulse', genre: 'Electronic', duration: '4:12', createdAt: '2024-12-18', status: 'completed', albumArt: '/song3.jpg' },
  { id: '4', title: 'Acoustic Morning', genre: 'Acoustic', duration: '3:56', createdAt: '2024-12-17', status: 'completed', albumArt: '/song4.jpg' },
  { id: '5', title: 'Jazz Cafe', genre: 'Jazz', duration: '5:02', createdAt: '2024-12-16', status: 'completed', albumArt: '/song5.jpg' },
];

interface Song {
  id: string;
  title: string;
  genre: string;
  duration: string;
  createdAt: string;
  status: string;
  albumArt: string;
}

const AppPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchAccountData } = useAccountData(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [songs] = useState<Song[]>(mockSongs);
  const [currentPage, setCurrentPage] = useState(1);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'songs' | 'videos' | 'characters'>('songs');
  const songsPerPage = 10;
  
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch latest account data when the dashboard loads
  useEffect(() => {
    fetchAccountData(false);
  }, [fetchAccountData]);

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

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const handlePlayPause = (songId: string) => {
    if (playingId === songId) {
      setPlayingId(null);
    } else {
      setPlayingId(songId);
    }
  };

  const handleDownload = (song: Song) => {
    // TODO: Implement download functionality
    setNotification({
      open: true,
      message: `Downloading "${song.title}"...`,
      severity: 'info'
    });
  };

  const handleCreateVideo = (song: Song) => {
    // Navigate to video creation page
    navigate(`/create?tab=video&song=${song.id}`);
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
    <Container maxWidth="lg" sx={{ pt: 0, pb: 3, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      {/* Toggle Buttons - Equal width pill style */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
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
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '100px !important',
              flex: 1,
              minWidth: 140,
              px: 3,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
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
        {songs.length === 0 ? (
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
            {displayedSongs.map((song, index) => (
              <Box
                key={song.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  px: 3,
                  borderBottom: index < displayedSongs.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  transition: 'all 0.2s ease',
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

                {/* Album Art */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, #1D1D1F 0%, #3a3a3c 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MusicNoteIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Box>

                {/* Track Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1D1D1F',
                      fontSize: '0.95rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {song.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#86868B',
                      fontSize: '0.85rem',
                    }}
                  >
                    {song.genre} • {song.duration}
                  </Typography>
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

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* Play Button */}
                  <Tooltip title={playingId === song.id ? "Pause" : "Play"} arrow>
                    <IconButton
                      onClick={() => handlePlayPause(song.id)}
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
                      {playingId === song.id ? (
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
              </Box>
            ))}
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
                label="0 videos" 
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
    </Container>
  );
};

export default AppPage;
