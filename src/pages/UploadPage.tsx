import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
  IconButton,
  LinearProgress,
  Chip,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import {
  CloudUpload,
  MusicNote,
  MusicNote as MusicNoteIcon,
  Movie as MovieIcon,
  VideoLibrary,
  CheckCircle,
  Close,
  Image as ImageIcon,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { RootState } from '../store/store';
import { songsApi, videosApi } from '../services/api';

// Genres with images
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

// Moods with images
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
        background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
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
        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: showBottomGradient ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }} />
    </Box>
  );
};

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  
  
  // Get type from URL params - update when URL changes
  const urlType = searchParams.get('type') === 'video' ? 'video' : 'song';

  const [uploadType, setUploadType] = useState<'song' | 'video'>(urlType);

  // Sync uploadType with URL when URL changes (e.g., sidebar navigation)
  useEffect(() => {
    setUploadType(urlType);
    // Reset form when switching types
    setSelectedFile(null);
    setCoverImage(null);
    setCoverImagePreview(null);
    setTitle('');
    setError(null);
    setSuccess(null);
  }, [urlType]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  // Metadata state
  const [title, setTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('pop'); // Auto-select first option
  const [selectedMood, setSelectedMood] = useState('happy'); // Auto-select first option
  const [genrePickerOpen, setGenrePickerOpen] = useState(false);
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'landscape'>('portrait');
  
  // Auto-populated from user profile
  const artist: string = user?.artistName || user?.name || '';
  const album: string = '';
  const description: string = '';
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  const acceptedAudioFormats = '.mp3,.wav,.m4a,.aac,.flac';
  const acceptedVideoFormats = '.mp4,.mov,.webm';
  
  // File size limits
  const MAX_AUDIO_SIZE_MB = 50; // 50MB for audio
  const MAX_VIDEO_SIZE_MB = 200; // 200MB for video
  const MAX_AUDIO_SIZE = MAX_AUDIO_SIZE_MB * 1024 * 1024;
  const MAX_VIDEO_SIZE = MAX_VIDEO_SIZE_MB * 1024 * 1024;
  
  const handleFileSelect = useCallback((file: File) => {
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|flac)$/i.test(file.name);
    const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm)$/i.test(file.name);
    
    if (uploadType === 'song' && !isAudio) {
      setError('Please select an audio file (MP3, WAV, M4A, AAC, or FLAC)');
      return;
    }
    
    if (uploadType === 'video' && !isVideo) {
      setError('Please select a video file (MP4, MOV, or WebM)');
      return;
    }
    
    // Check file size
    const maxSize = uploadType === 'video' ? MAX_VIDEO_SIZE : MAX_AUDIO_SIZE;
    const maxSizeMB = uploadType === 'video' ? MAX_VIDEO_SIZE_MB : MAX_AUDIO_SIZE_MB;
    if (file.size > maxSize) {
      setError(`File is too large (${formatFileSize(file.size)}). Maximum size is ${maxSizeMB}MB`);
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    
    // Auto-fill title from filename
    if (!title) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      setTitle(nameWithoutExtension);
    }
  }, [uploadType, title]);
  
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
  
  const handleCoverImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    setCoverImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);
  
  const handleUpload = async () => {
    if (!user?.userId) {
      setError('Please log in to upload');
      return;
    }

    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      if (uploadType === 'song') {
        // Songs still use the original upload flow (smaller files)
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', title.trim());
        formData.append('type', uploadType);

        if (artist) formData.append('artist', artist.trim());
        if (album) formData.append('album', album.trim());
        if (description) formData.append('description', description.trim());
        if (coverImage) formData.append('coverImage', coverImage);
        if (selectedGenre) formData.append('genre', selectedGenre);
        if (selectedMood) formData.append('mood', selectedMood);

        await songsApi.uploadSong(user.userId, formData, (progress) => {
          setUploadProgress(progress);
        });
        setSuccess('Song uploaded successfully!');
      } else {
        // Videos use direct S3 upload (bypasses server for large files)
        console.log('[Upload] Getting presigned URL for video upload...');

        // Step 1: Get presigned URL from backend
        const urlResponse = await videosApi.getUploadUrl(user.userId, {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        });

        const { uploadUrl, videoId, videoKey } = urlResponse.data;
        console.log(`[Upload] Got presigned URL for video ${videoId}`);

        // Step 2: Upload directly to S3 using presigned URL
        console.log('[Upload] Uploading video directly to S3...');
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 90); // Reserve 10% for finalization
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

        // Step 3: Tell backend to finalize (create DB record, extract thumbnail)
        await videosApi.finalizeUpload(user.userId, {
          videoId,
          videoKey,
          title: title.trim(),
          description: description?.trim(),
          aspectRatio,
        });

        setUploadProgress(100);
        setSuccess('Video uploaded successfully!');
      }

      // Navigate back to library after short delay
      setTimeout(() => {
        navigate(uploadType === 'song' ? '/my-music' : '/my-videos');
      }, 1500);

    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.error || err.message || 'Failed to upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <>
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
        {/* Page Header with Title and Toggle */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          gap: 2,
        }}>
          {/* Left: Page Title with Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
            <Box
              key={uploadType}
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
              {uploadType === 'song' ? (
                <MusicNoteIcon sx={{ fontSize: 28, color: '#fff' }} />
              ) : (
                <MovieIcon sx={{ fontSize: 28, color: '#fff' }} />
              )}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
                Upload {uploadType === 'song' ? 'Music' : 'Video'}
              </Typography>
              <Typography sx={{ color: '#86868B', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
                Upload your own {uploadType === 'song' ? 'music' : 'videos'} to Gruvi
              </Typography>
            </Box>
          </Box>

          {/* View My Music / View My Video button */}
          <Box sx={{ flexShrink: 0 }}>
            <Button
              variant="contained"
              onClick={() => navigate(uploadType === 'song' ? '/my-music' : '/my-videos')}
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
              {uploadType === 'song' ? 'View My Music' : 'View My Videos'}
            </Button>
            <IconButton
              onClick={() => navigate(uploadType === 'song' ? '/my-music' : '/my-videos')}
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
              {uploadType === 'song' ? (
                <MusicNote sx={{ fontSize: 22 }} />
              ) : (
                <VideoLibrary sx={{ fontSize: 22 }} />
              )}
            </IconButton>
          </Box>
        </Box>
        
        {/* Alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        {/* File Upload Section - Full width for videos */}
        {uploadType === 'video' && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: { xs: '16px', sm: '20px' },
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CloudUpload sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Select File
              </Typography>
              <Chip label="Required" size="small" sx={{ ml: 1, background: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontWeight: 600, fontSize: '0.7rem' }} />
            </Box>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Upload your video file
            </Typography>

            {/* File Drop Zone */}
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed ${isDragging ? '#007AFF' : 'rgba(0,0,0,0.15)'}`,
                borderRadius: '12px',
                p: { xs: 3, sm: 4 },
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isDragging ? 'rgba(0,122,255,0.05)' : 'rgba(0,0,0,0.02)',
                '&:hover': {
                  borderColor: '#007AFF',
                  background: 'rgba(0,122,255,0.02)',
                },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedVideoFormats}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />

              {selectedFile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <CheckCircle sx={{ color: '#34C759', fontSize: 32 }} />
                  <Box sx={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1d1d1f', wordBreak: 'break-word' }}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#86868B' }}>
                      {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    sx={{ color: '#86868B' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <CloudUpload sx={{ fontSize: 48, color: '#86868B', mb: 2 }} />
                  <Typography sx={{ fontWeight: 600, color: '#1d1d1f', mb: 1 }}>
                    Drag and drop your video file here
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
                    or click to browse
                  </Typography>
                  <Chip
                    label={`MP4, MOV, WebM (max ${MAX_VIDEO_SIZE_MB}MB)`}
                    size="small"
                    sx={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}
                  />
                </>
              )}
            </Box>

            {/* Upload Progress */}
            {isUploading && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 4, height: 8 }} />
                <Typography variant="body2" sx={{ color: '#86868B', mt: 1, textAlign: 'center' }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Video Details: Title + Aspect Ratio in two columns on lg+ */}
        {uploadType === 'video' && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3,
            mb: 3,
          }}>
            {/* Video Details (Title) Section */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: { xs: '16px', sm: '20px' },
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <VideoLibrary sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Video Details
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Add basic information about your video
              </Typography>

              {/* Title Field */}
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                placeholder="Enter video title"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    height: 52,
                    '& input': { py: 1.5 },
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                    '&.Mui-focused': { backgroundColor: 'rgba(0,122,255,0.03)' },
                  },
                }}
              />
            </Paper>

            {/* Aspect Ratio Section */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: { xs: '16px', sm: '20px' },
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <VideoLibrary sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Aspect Ratio
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Choose the format for your video
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
                <Box
                  onClick={() => setAspectRatio('portrait')}
                  sx={{
                    flex: { xs: 'none', sm: 1 },
                    height: 52,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    borderRadius: '10px',
                    background: aspectRatio === 'portrait' ? 'rgba(0,122,255,0.08)' : '#fff',
                    border: aspectRatio === 'portrait' ? '2px solid #007AFF' : '1px solid rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    '&:hover': { background: aspectRatio === 'portrait' ? 'rgba(0,122,255,0.12)' : 'rgba(0,0,0,0.02)' },
                  }}
                >
                  <Box sx={{ width: 18, height: 28, border: '2px solid', borderRadius: '3px', borderColor: aspectRatio === 'portrait' ? '#007AFF' : '#86868B', flexShrink: 0 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: aspectRatio === 'portrait' ? '#007AFF' : '#1D1D1F' }}>Portrait</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#86868B', fontWeight: 500 }}>9:16</Typography>
                  </Box>
                </Box>
                <Box
                  onClick={() => setAspectRatio('landscape')}
                  sx={{
                    flex: { xs: 'none', sm: 1 },
                    height: 52,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    borderRadius: '10px',
                    background: aspectRatio === 'landscape' ? 'rgba(0,122,255,0.08)' : '#fff',
                    border: aspectRatio === 'landscape' ? '2px solid #007AFF' : '1px solid rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    '&:hover': { background: aspectRatio === 'landscape' ? 'rgba(0,122,255,0.12)' : 'rgba(0,0,0,0.02)' },
                  }}
                >
                  <Box sx={{ width: 28, height: 18, border: '2px solid', borderRadius: '3px', borderColor: aspectRatio === 'landscape' ? '#007AFF' : '#86868B', flexShrink: 0 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: aspectRatio === 'landscape' ? '#007AFF' : '#1D1D1F' }}>Landscape</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#86868B', fontWeight: 500 }}>16:9</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* File Upload Section - For songs only (original grid) */}
        {uploadType === 'song' && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: { xs: '16px', sm: '20px' },
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <CloudUpload sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Select File
              </Typography>
              <Chip label="Required" size="small" sx={{ ml: 1, background: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontWeight: 600, fontSize: '0.7rem' }} />
            </Box>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Upload your audio file
            </Typography>

            {/* File Drop Zone */}
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed ${isDragging ? '#007AFF' : 'rgba(0,0,0,0.15)'}`,
                borderRadius: '12px',
                p: { xs: 3, sm: 4 },
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isDragging ? 'rgba(0,122,255,0.05)' : 'rgba(0,0,0,0.02)',
                '&:hover': {
                  borderColor: '#007AFF',
                  background: 'rgba(0,122,255,0.02)',
                },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedAudioFormats}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />

              {selectedFile ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <CheckCircle sx={{ color: '#34C759', fontSize: 32 }} />
                  <Box sx={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1d1d1f', wordBreak: 'break-word' }}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#86868B' }}>
                      {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    sx={{ color: '#86868B' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <CloudUpload sx={{ fontSize: 48, color: '#86868B', mb: 2 }} />
                  <Typography sx={{ fontWeight: 600, color: '#1d1d1f', mb: 1 }}>
                    Drag and drop your audio file here
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>
                    or click to browse
                  </Typography>
                  <Chip
                    label={`MP3, WAV, M4A, AAC, FLAC (max ${MAX_AUDIO_SIZE_MB}MB)`}
                    size="small"
                    sx={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}
                  />
                </>
              )}
            </Box>

            {/* Upload Progress */}
            {isUploading && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 4, height: 8 }} />
                <Typography variant="body2" sx={{ color: '#86868B', mt: 1, textAlign: 'center' }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Songs: Cover Art + Song Details Row */}
        {uploadType === 'song' && (
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Cover Art Section */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                flex: { lg: 1 },
                borderRadius: { xs: '16px', sm: '20px' },
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <ImageIcon sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Cover Art
                </Typography>
                <Chip label="Optional" size="small" sx={{ ml: 1, background: 'rgba(0,0,0,0.05)', color: '#86868B', fontWeight: 600, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Add album artwork
              </Typography>

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleCoverImageSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
              <Box
                onClick={() => coverInputRef.current?.click()}
                sx={{
                  flex: 1,
                  width: '100%',
                  minHeight: { xs: 200, sm: 180 },
                  borderRadius: '12px',
                  border: '2px dashed rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  background: 'rgba(0,0,0,0.02)',
                  '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.02)' },
                }}
              >
                {coverImagePreview ? (
                  <img
                    src={coverImagePreview}
                    alt="Cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <ImageIcon sx={{ color: '#86868B', fontSize: 48, mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#86868B', fontWeight: 500 }}>
                      Click to add
                    </Typography>
                  </>
                )}
              </Box>
            </Paper>

            {/* Song Details Section */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                flex: { lg: 2 },
                borderRadius: { xs: '16px', sm: '20px' },
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <MusicNote sx={{ color: '#007AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Song Details
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Add basic information about your song
              </Typography>

              {/* Title Field */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#1D1D1F', mb: 0.5 }}>
                  Title
                </Typography>
                <TextField
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                  placeholder="Enter song title"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      backgroundColor: '#fff',
                      height: 52,
                      '& input': { py: 1.5 },
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                      '&.Mui-focused': { backgroundColor: 'rgba(0,122,255,0.03)' },
                    },
                  }}
                />
              </Box>

              {/* Genre and Mood Selection */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                {/* Genre */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#1D1D1F', mb: 0.5 }}>
                    Genre
                  </Typography>
                  <Button
                    onClick={() => setGenrePickerOpen(true)}
                    fullWidth
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.15)',
                      background: '#fff',
                      justifyContent: 'space-between',
                      textTransform: 'none',
                      color: '#1D1D1F',
                      '&:hover': { background: 'rgba(0,0,0,0.02)', borderColor: 'rgba(0,0,0,0.2)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        component="img"
                        src={genres.find(g => g.id === selectedGenre)?.image}
                        alt={genres.find(g => g.id === selectedGenre)?.name}
                        sx={{ width: 28, height: 28, borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                        {genres.find(g => g.id === selectedGenre)?.name || 'Select Genre'}
                      </Typography>
                    </Box>
                    <KeyboardArrowDown sx={{ color: '#86868B' }} />
                  </Button>
                </Box>

                {/* Mood */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#1D1D1F', mb: 0.5 }}>
                    Mood
                  </Typography>
                  <Button
                    onClick={() => setMoodPickerOpen(true)}
                    fullWidth
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderRadius: '10px',
                      border: '1px solid rgba(0,0,0,0.15)',
                      background: '#fff',
                      justifyContent: 'space-between',
                      textTransform: 'none',
                      color: '#1D1D1F',
                      '&:hover': { background: 'rgba(0,0,0,0.02)', borderColor: 'rgba(0,0,0,0.2)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        component="img"
                        src={moods.find(m => m.id === selectedMood)?.image}
                        alt={moods.find(m => m.id === selectedMood)?.name}
                        sx={{ width: 28, height: 28, borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                        {moods.find(m => m.id === selectedMood)?.name || 'Select Mood'}
                      </Typography>
                    </Box>
                    <KeyboardArrowDown sx={{ color: '#86868B' }} />
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Upload Button Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: { xs: '16px', sm: '20px' },
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#86868B', flex: 1, minWidth: 200 }}>
              {uploadType === 'song' 
                ? 'Uploaded songs can be distributed to music platforms.'
                : 'Uploaded videos can be shared to social platforms.'
              }
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={isUploading}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  px: 3,
                  borderColor: 'rgba(0,0,0,0.15)',
                  color: '#86868B',
                  '&:hover': { borderColor: '#007AFF', color: '#007AFF' },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!selectedFile || !title.trim() || isUploading}
                startIcon={isUploading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <CloudUpload />}
                sx={{
                  background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                  '&:hover': { boxShadow: '0 6px 20px rgba(0,122,255,0.4)' },
                  '&:disabled': { background: 'rgba(0,0,0,0.12)' },
                }}
              >
                {isUploading ? 'Uploading...' : `Upload ${uploadType === 'song' ? 'Song' : 'Video'}`}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Genre Picker Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={genrePickerOpen}
        onClose={() => setGenrePickerOpen(false)}
        onOpen={() => setGenrePickerOpen(true)}
        disableSwipeToOpen
        sx={{
          zIndex: 1400,
          '& .MuiBackdrop-root': {
            left: { xs: 0, md: 240 },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: '20px 20px 0 0',
            maxHeight: '70vh',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            left: { xs: 0, sm: 0, md: 310 },
            right: { xs: 0, sm: 0, md: 70 },
            width: 'auto',
            maxWidth: 1100,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
          }
        }}
      >
        <Box sx={{ pt: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
            Select Genre
          </Typography>
        </Box>
        <ScrollableListWrapper maxHeight="calc(70vh - 140px)">
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
                  sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', mr: 2 }}
                />
                <Typography sx={{ fontWeight: selectedGenre === genre.id ? 600 : 400, color: selectedGenre === genre.id ? '#007AFF' : '#1D1D1F' }}>
                  {genre.name}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </ScrollableListWrapper>
        <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
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
      </SwipeableDrawer>

      {/* Mood Picker Drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={moodPickerOpen}
        onClose={() => setMoodPickerOpen(false)}
        onOpen={() => setMoodPickerOpen(true)}
        disableSwipeToOpen
        sx={{
          zIndex: 1400,
          '& .MuiBackdrop-root': {
            left: { xs: 0, md: 240 },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: '20px 20px 0 0',
            maxHeight: '70vh',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            left: { xs: 0, sm: 0, md: 310 },
            right: { xs: 0, sm: 0, md: 70 },
            width: 'auto',
            maxWidth: 1100,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
          }
        }}
      >
        <Box sx={{ pt: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
            Select Mood
          </Typography>
        </Box>
        <ScrollableListWrapper maxHeight="calc(70vh - 140px)">
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
                  sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', mr: 2 }}
                />
                <Typography sx={{ fontWeight: selectedMood === mood.id ? 600 : 400, color: selectedMood === mood.id ? '#007AFF' : '#1D1D1F' }}>
                  {mood.name}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </ScrollableListWrapper>
        <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
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
      </SwipeableDrawer>
    </>
  );
};

export default UploadPage;

