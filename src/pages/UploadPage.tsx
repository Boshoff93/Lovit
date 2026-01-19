import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  MusicNote,
  MusicNote as MusicNoteIcon,
  Movie as MovieIcon,
  VideoLibrary,
  CheckCircle,
  Close,
  RecordVoiceOver as RecordVoiceOverIcon,
  LibraryMusic as LibraryMusicIcon,
  HeadsetMic as HeadsetMicIcon,
} from '@mui/icons-material';
import { RootState } from '../store/store';
import { songsApi, videosApi } from '../services/api';
import StyledDropdown, { DropdownOption } from '../components/StyledDropdown';
import { GhostButton } from '../components/GhostButton';

// Genres with images for dropdown
const genres: DropdownOption[] = [
  { id: 'pop', label: 'Pop', image: '/genres/pop.jpeg' },
  { id: 'hip-hop', label: 'Hip Hop', image: '/genres/hip-hop.jpeg' },
  { id: 'rnb', label: 'R&B', image: '/genres/rnb.jpeg' },
  { id: 'electronic', label: 'Electronic', image: '/genres/electronic.jpeg' },
  { id: 'dance', label: 'Dance', image: '/genres/dance.jpeg' },
  { id: 'house', label: 'House', image: '/genres/house.jpeg' },
  { id: 'tropical-house', label: 'Tropical House', image: '/genres/chillout.jpeg' },
  { id: 'edm', label: 'EDM', image: '/genres/edm.jpeg' },
  { id: 'techno', label: 'Techno', image: '/genres/techno.jpeg' },
  { id: 'rock', label: 'Rock', image: '/genres/rock.jpeg' },
  { id: 'alternative', label: 'Alternative', image: '/genres/alternative.jpeg' },
  { id: 'indie', label: 'Indie', image: '/genres/indie.jpeg' },
  { id: 'punk', label: 'Punk', image: '/genres/punk.jpeg' },
  { id: 'metal', label: 'Metal', image: '/genres/metal.jpeg' },
  { id: 'jazz', label: 'Jazz', image: '/genres/jazz.jpeg' },
  { id: 'blues', label: 'Blues', image: '/genres/blues.jpeg' },
  { id: 'soul', label: 'Soul', image: '/genres/soul.jpeg' },
  { id: 'funk', label: 'Funk', image: '/genres/funk.jpeg' },
  { id: 'classical', label: 'Classical', image: '/genres/classic.jpeg' },
  { id: 'orchestral', label: 'Orchestral', image: '/genres/orchestral.jpeg' },
  { id: 'cinematic', label: 'Cinematic', image: '/genres/cinematic.jpeg' },
  { id: 'country', label: 'Country', image: '/genres/country.jpeg' },
  { id: 'folk', label: 'Folk', image: '/genres/folk.jpeg' },
  { id: 'acoustic', label: 'Acoustic', image: '/genres/acoustic.jpeg' },
  { id: 'latin', label: 'Latin', image: '/genres/latin.jpeg' },
  { id: 'reggaeton', label: 'Reggaeton', image: '/genres/raggaeton.jpeg' },
  { id: 'kpop', label: 'K-Pop', image: '/genres/kpop.jpeg' },
  { id: 'jpop', label: 'J-Pop', image: '/genres/jpop.jpeg' },
  { id: 'reggae', label: 'Reggae', image: '/genres/raggae.jpeg' },
  { id: 'lofi', label: 'Lo-fi', image: '/genres/lofi.jpeg' },
  { id: 'ambient', label: 'Ambient', image: '/genres/ambient.jpeg' },
  { id: 'gospel', label: 'Gospel', image: '/genres/gospels.jpeg' },
];

// Moods with images for dropdown
const moods: DropdownOption[] = [
  { id: 'happy', label: 'Happy', image: '/moods/happy.jpeg' },
  { id: 'sad', label: 'Sad', image: '/moods/sad.jpeg' },
  { id: 'energetic', label: 'Energetic', image: '/moods/energetic.jpeg' },
  { id: 'romantic', label: 'Romantic', image: '/moods/romantic.jpeg' },
  { id: 'chill', label: 'Chill', image: '/moods/chill.jpeg' },
  { id: 'epic', label: 'Epic', image: '/moods/epic.jpeg' },
  { id: 'dreamy', label: 'Dreamy', image: '/moods/dreamy.jpeg' },
  { id: 'dark', label: 'Dark', image: '/moods/dark.jpeg' },
  { id: 'uplifting', label: 'Uplifting', image: '/moods/uplifting.jpeg' },
  { id: 'nostalgic', label: 'Nostalgic', image: '/moods/nostalgic.jpeg' },
  { id: 'peaceful', label: 'Peaceful', image: '/moods/peacful.jpeg' },
  { id: 'intense', label: 'Intense', image: '/moods/intense.jpeg' },
  { id: 'melancholic', label: 'Melancholic', image: '/moods/melancholic.jpeg' },
  { id: 'playful', label: 'Playful', image: '/moods/playful.jpeg' },
  { id: 'mysterious', label: 'Mysterious', image: '/moods/mysterious.jpeg' },
  { id: 'triumphant', label: 'Triumphant', image: '/moods/triumphant.jpeg' },
  { id: 'promotional', label: 'Promotional', image: '/moods/promotional.jpeg' },
];

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  // Get type from URL params - update when URL changes
  const urlType = searchParams.get('type') === 'video' ? 'video' : 'song';
  const urlAudioType = searchParams.get('audioType') === 'voice' ? 'voice' : 'music';

  const [uploadType] = useState<'song' | 'video'>(urlType);

  // Sync uploadType with URL when URL changes (e.g., sidebar navigation)
  useEffect(() => {
    // Reset form when switching types
    setSelectedFile(null);
    setTitle('');
    setAudioType(urlAudioType);
    setError(null);
    setSuccess(null);
  }, [urlType, urlAudioType]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metadata state
  const [title, setTitle] = useState('');
  const [audioType, setAudioType] = useState<'music' | 'voice'>('music');
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [selectedMood, setSelectedMood] = useState('happy');
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('portrait');

  // Auto-populated from user profile
  const artist: string = user?.artistName || user?.name || '';
  const album: string = '';
  const description: string = '';

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const acceptedAudioFormats = '.mp3,.wav,.m4a,.aac,.flac';
  const acceptedVideoFormats = '.mp4,.mov,.webm';

  // File size limits
  const MAX_AUDIO_SIZE_MB = 50;
  const MAX_VIDEO_SIZE_MB = 200;
  const MAX_AUDIO_SIZE = MAX_AUDIO_SIZE_MB * 1024 * 1024;
  const MAX_VIDEO_SIZE = MAX_VIDEO_SIZE_MB * 1024 * 1024;

  const handleFileSelect = useCallback((file: File) => {
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|flac)$/i.test(file.name);
    const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name);

    if (urlType === 'song' && !isAudio) {
      setNotification({ open: true, message: 'Please select an audio file (MP3, WAV, M4A, AAC, or FLAC)', severity: 'error' });
      return;
    }

    if (urlType === 'video' && !isVideo) {
      setNotification({ open: true, message: 'Please select a video file (MP4, MOV, or WebM)', severity: 'error' });
      return;
    }

    // Check file size
    const maxSize = urlType === 'video' ? MAX_VIDEO_SIZE : MAX_AUDIO_SIZE;
    const maxSizeMB = urlType === 'video' ? MAX_VIDEO_SIZE_MB : MAX_AUDIO_SIZE_MB;
    if (file.size > maxSize) {
      setNotification({ open: true, message: `File is too large (${formatFileSize(file.size)}). Maximum size is ${maxSizeMB}MB`, severity: 'error' });
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Auto-fill title from filename
    if (!title) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      setTitle(nameWithoutExtension);
    }
  }, [urlType, title]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUpload = async () => {
    if (!user?.userId) {
      setNotification({ open: true, message: 'Please log in to upload', severity: 'error' });
      return;
    }

    if (!selectedFile) {
      setNotification({ open: true, message: 'Please select a file to upload', severity: 'error' });
      return;
    }

    if (!title.trim()) {
      setNotification({ open: true, message: 'Please enter a title', severity: 'error' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      if (urlType === 'song') {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', title.trim());
        formData.append('type', uploadType);

        if (artist) formData.append('artist', artist.trim());
        if (album) formData.append('album', album.trim());
        if (description) formData.append('description', description.trim());

        // Only send genre/mood for music type
        if (audioType === 'music') {
          if (selectedGenre) formData.append('genre', selectedGenre);
          if (selectedMood) formData.append('mood', selectedMood);
        }

        await songsApi.uploadSong(user.userId, formData, (progress) => {
          setUploadProgress(progress);
        });
        setSuccess('Audio uploaded successfully!');
        setNotification({ open: true, message: 'Audio uploaded successfully!', severity: 'success' });
      } else {
        console.log('[Upload] Getting presigned URL for video upload...');

        const urlResponse = await videosApi.getUploadUrl(user.userId, {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        });

        const { uploadUrl, videoId, videoKey } = urlResponse.data;
        console.log(`[Upload] Got presigned URL for video ${videoId}`);

        console.log('[Upload] Uploading video directly to S3...');
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 90);
              setUploadProgress(progress);
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`S3 upload failed with status ${xhr.status}`));
            }
          });

          xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
          xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

          xhr.open('PUT', uploadUrl);
          xhr.setRequestHeader('Content-Type', selectedFile.type);
          xhr.send(selectedFile);
        });

        console.log('[Upload] S3 upload complete, finalizing...');
        setUploadProgress(95);

        await videosApi.finalizeUpload(user.userId, {
          videoId,
          videoKey,
          title: title.trim(),
          description: description?.trim(),
          aspectRatio,
        });

        setUploadProgress(100);
        setSuccess('Video uploaded successfully!');
        setNotification({ open: true, message: 'Video uploaded successfully!', severity: 'success' });
      }

      // Navigate back to library after short delay
      setTimeout(() => {
        navigate(urlType === 'song' ? '/my-music' : '/my-videos');
      }, 1500);

    } catch (err: any) {
      console.error('Upload failed:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to upload. Please try again.';
      setError(errorMessage);
      setNotification({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isAudioUpload = urlType === 'song';
  const isVideoUpload = urlType === 'video';

  return (
    <Box sx={{
      py: { xs: 3, md: 4 },
      px: { xs: 2, sm: 3, md: 4 },
      width: '100%',
      maxWidth: 1200,
      mx: 'auto'
    }}>
      {/* Page Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
              flexShrink: 0,
            }}
          >
            {isAudioUpload ? (
              <MusicNoteIcon sx={{ fontSize: 28, color: '#fff' }} />
            ) : (
              <MovieIcon sx={{ fontSize: 28, color: '#fff' }} />
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              Upload {isAudioUpload ? 'Audio' : 'Video'}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              Upload your own {isAudioUpload ? 'audio' : 'videos'} to Gruvi
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <Button
            variant="contained"
            onClick={() => navigate(isAudioUpload ? (audioType === 'voice' ? '/my-narratives' : '/my-music') : '/my-videos')}
            startIcon={isAudioUpload ? (audioType === 'voice' ? <HeadsetMicIcon /> : <LibraryMusicIcon />) : <VideoLibrary />}
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
              '&:hover': {
                background: '#0066CC',
                boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
              },
            }}
          >
            {isAudioUpload ? (audioType === 'voice' ? 'View My Voiceovers' : 'View My Music') : 'View My Videos'}
          </Button>
          <IconButton
            onClick={() => navigate(isAudioUpload ? (audioType === 'voice' ? '/my-narratives' : '/my-music') : '/my-videos')}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              width: 44,
              height: 44,
              background: '#007AFF',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              '&:hover': {
                background: '#0066CC',
                boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
              },
            }}
          >
            {isAudioUpload ? (
              audioType === 'voice' ? <HeadsetMicIcon sx={{ fontSize: 22 }} /> : <LibraryMusicIcon sx={{ fontSize: 22 }} />
            ) : (
              <VideoLibrary sx={{ fontSize: 22 }} />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Single Paper Container */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        {/* Title Field */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
              Title
            </Typography>
            <Chip
              label="Required"
              size="small"
              sx={{ background: 'rgba(255,59,48,0.2)', color: '#FF6B6B', fontWeight: 600, fontSize: '0.7rem' }}
            />
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, fontSize: '0.85rem' }}>
            Give your {isAudioUpload ? 'audio' : 'video'} a title
          </Typography>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            placeholder={`Enter ${isAudioUpload ? 'audio' : 'video'} title`}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#007AFF' },
              },
              '& .MuiInputBase-input': {
                '&::placeholder': { color: 'rgba(255,255,255,0.4)', opacity: 1 },
              },
            }}
          />
        </Box>

        {/* Audio Type Selection - Only for audio uploads */}
        {isAudioUpload && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
              Audio Type
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, fontSize: '0.85rem' }}>
              Is this music or voice/narration?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box
                onClick={() => setAudioType('music')}
                sx={{
                  flex: 1,
                  py: 2,
                  px: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: audioType === 'music' ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                  border: audioType === 'music' ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: audioType === 'music' ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.08)',
                    borderColor: audioType === 'music' ? '#007AFF' : 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                <MusicNoteIcon sx={{ fontSize: 22, color: audioType === 'music' ? '#007AFF' : 'rgba(255,255,255,0.6)' }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: audioType === 'music' ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                  Music
                </Typography>
              </Box>
              <Box
                onClick={() => setAudioType('voice')}
                sx={{
                  flex: 1,
                  py: 2,
                  px: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: audioType === 'voice' ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                  border: audioType === 'voice' ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: audioType === 'voice' ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.08)',
                    borderColor: audioType === 'voice' ? '#007AFF' : 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                <RecordVoiceOverIcon sx={{ fontSize: 22, color: audioType === 'voice' ? '#007AFF' : 'rgba(255,255,255,0.6)' }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: audioType === 'voice' ? '#fff' : 'rgba(255,255,255,0.7)' }}>
                  Voice
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Genre and Mood - Only show for music type audio uploads */}
        {isAudioUpload && audioType === 'music' && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
            mb: 3
          }}>
            {/* Genre */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Genre
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, fontSize: '0.85rem' }}>
                Select the musical style
              </Typography>
              <StyledDropdown
                options={genres}
                value={selectedGenre}
                onChange={setSelectedGenre}
                placeholder="Select genre"
                fullWidth
              />
            </Box>

            {/* Mood */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Mood
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, fontSize: '0.85rem' }}>
                Set the emotional tone
              </Typography>
              <StyledDropdown
                options={moods}
                value={selectedMood}
                onChange={setSelectedMood}
                placeholder="Select mood"
                fullWidth
              />
            </Box>
          </Box>
        )}

        {/* Aspect Ratio - Video uploads only */}
        {isVideoUpload && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
              Aspect Ratio
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, fontSize: '0.85rem' }}>
              Choose the format for your video
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Box
                onClick={() => setAspectRatio('portrait')}
                sx={{
                  flex: 1,
                  py: 2,
                  px: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: aspectRatio === 'portrait' ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                  border: aspectRatio === 'portrait' ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: aspectRatio === 'portrait' ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.08)',
                    borderColor: aspectRatio === 'portrait' ? '#007AFF' : 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                <Box sx={{
                  width: 18,
                  height: 28,
                  border: '2px solid',
                  borderRadius: '3px',
                  borderColor: aspectRatio === 'portrait' ? '#007AFF' : 'rgba(255,255,255,0.5)',
                  flexShrink: 0
                }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>
                    Portrait
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                    9:16
                  </Typography>
                </Box>
              </Box>
              <Box
                onClick={() => setAspectRatio('landscape')}
                sx={{
                  flex: 1,
                  py: 2,
                  px: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: aspectRatio === 'landscape' ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                  border: aspectRatio === 'landscape' ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: aspectRatio === 'landscape' ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.08)',
                    borderColor: aspectRatio === 'landscape' ? '#007AFF' : 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                <Box sx={{
                  width: 28,
                  height: 18,
                  border: '2px solid',
                  borderRadius: '3px',
                  borderColor: aspectRatio === 'landscape' ? '#007AFF' : 'rgba(255,255,255,0.5)',
                  flexShrink: 0
                }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>
                    Landscape
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                    16:9
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* File Upload Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
              Select File
            </Typography>
            <Chip
              label="Required"
              size="small"
              sx={{ background: 'rgba(255,59,48,0.2)', color: '#FF6B6B', fontWeight: 600, fontSize: '0.7rem' }}
            />
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontSize: '0.85rem' }}>
            Upload your {isAudioUpload ? 'audio' : 'video'} file
          </Typography>

          {/* File Drop Zone */}
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: `2px dashed ${isDragging ? '#007AFF' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: '16px',
              p: { xs: 3, sm: 4 },
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: isDragging ? 'rgba(0,122,255,0.1)' : 'rgba(255,255,255,0.03)',
              '&:hover': {
                borderColor: '#007AFF',
                background: 'rgba(0,122,255,0.05)',
              },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={isAudioUpload ? acceptedAudioFormats : acceptedVideoFormats}
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              style={{ display: 'none' }}
            />

            {selectedFile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <CheckCircle sx={{ color: '#34C759', fontSize: 32 }} />
                <Box sx={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: '#fff', wordBreak: 'break-word' }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {formatFileSize(selectedFile.size)}
                  </Typography>
                </Box>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  sx={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  <Close />
                </IconButton>
              </Box>
            ) : (
              <>
                <CloudUpload sx={{ fontSize: 48, color: 'rgba(255,255,255,0.4)', mb: 2 }} />
                <Typography sx={{ fontWeight: 600, color: '#fff', mb: 1 }}>
                  Drag and drop your {isAudioUpload ? 'audio' : 'video'} file here
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2 }}>
                  or click to browse
                </Typography>
                <Chip
                  label={isAudioUpload
                    ? `MP3, WAV, M4A, AAC, FLAC (max ${MAX_AUDIO_SIZE_MB}MB)`
                    : `MP4, MOV, WebM (max ${MAX_VIDEO_SIZE_MB}MB)`
                  }
                  size="small"
                  sx={{ background: 'rgba(0,122,255,0.2)', color: '#fff' }}
                />
              </>
            )}
          </Box>

          {/* Upload Progress */}
          {isUploading && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  borderRadius: 4,
                  height: 8,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                  }
                }}
              />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1, textAlign: 'center' }}>
                Uploading... {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Box>

        {/* Upload Button Section */}
        <Box sx={{
          pt: 3,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', flex: 1, minWidth: 200 }}>
            {isAudioUpload
              ? 'Uploaded audio can be used in video creation.'
              : 'Uploaded videos can be shared to social platforms.'
            }
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <GhostButton
              onClick={() => navigate(-1)}
              disabled={isUploading}
              sx={{ px: 3 }}
            >
              Cancel
            </GhostButton>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || !title.trim() || isUploading}
              startIcon={isUploading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <CloudUpload />}
              sx={{
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                '&:hover': { boxShadow: '0 6px 20px rgba(0,122,255,0.4)' },
                '&:disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
              }}
            >
              {isUploading ? 'Uploading...' : `Upload ${isAudioUpload ? 'Audio' : 'Video'}`}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ borderRadius: '12px' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadPage;
