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
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { songsApi, videosApi, charactersApi } from '../services/api';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import AnimationIcon from '@mui/icons-material/Animation';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PaletteIcon from '@mui/icons-material/Palette';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
  { id: 'pop', name: 'Pop', icon: '🎤' },
  { id: 'hip-hop', name: 'Hip Hop', icon: '🎧' },
  { id: 'rnb', name: 'R&B', icon: '💜' },
  { id: 'electronic', name: 'Electronic', icon: '⚡' },
  { id: 'dance', name: 'Dance', icon: '💃' },
  { id: 'house', name: 'House', icon: '🏠' },
  { id: 'edm', name: 'EDM', icon: '🔊' },
  { id: 'techno', name: 'Techno', icon: '🤖' },
  { id: 'rock', name: 'Rock', icon: '🎸' },
  { id: 'alternative', name: 'Alternative', icon: '🔥' },
  { id: 'indie', name: 'Indie', icon: '🌙' },
  { id: 'punk', name: 'Punk', icon: '⚡' },
  { id: 'metal', name: 'Metal', icon: '🤘' },
  { id: 'jazz', name: 'Jazz', icon: '🎷' },
  { id: 'blues', name: 'Blues', icon: '🎺' },
  { id: 'soul', name: 'Soul', icon: '❤️' },
  { id: 'funk', name: 'Funk', icon: '🕺' },
  { id: 'classical', name: 'Classical', icon: '🎻' },
  { id: 'orchestral', name: 'Orchestral', icon: '🎼' },
  { id: 'cinematic', name: 'Cinematic', icon: '🎬' },
  { id: 'country', name: 'Country', icon: '🤠' },
  { id: 'folk', name: 'Folk', icon: '🪕' },
  { id: 'acoustic', name: 'Acoustic', icon: '🎸' },
  { id: 'latin', name: 'Latin', icon: '💃' },
  { id: 'reggaeton', name: 'Reggaeton', icon: '🔥' },
  { id: 'kpop', name: 'K-Pop', icon: '🇰🇷' },
  { id: 'jpop', name: 'J-Pop', icon: '🇯🇵' },
  { id: 'reggae', name: 'Reggae', icon: '🌴' },
  { id: 'lofi', name: 'Lo-fi', icon: '🌙' },
  { id: 'ambient', name: 'Ambient', icon: '🌌' },
  { id: 'chillout', name: 'Chill', icon: '😌' },
  { id: 'gospel', name: 'Gospel', icon: '🙏' },
];

// Mood options
const moods = [
  { id: 'happy', name: 'Happy', icon: '😊' },
  { id: 'sad', name: 'Sad', icon: '😢' },
  { id: 'energetic', name: 'Energetic', icon: '⚡' },
  { id: 'romantic', name: 'Romantic', icon: '💕' },
  { id: 'chill', name: 'Chill', icon: '😌' },
  { id: 'epic', name: 'Epic', icon: '🔥' },
  { id: 'dreamy', name: 'Dreamy', icon: '✨' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'uplifting', name: 'Uplifting', icon: '🌈' },
  { id: 'nostalgic', name: 'Nostalgic', icon: '📻' },
  { id: 'peaceful', name: 'Peaceful', icon: '🕊️' },
  { id: 'intense', name: 'Intense', icon: '💥' },
  { id: 'melancholic', name: 'Melancholic', icon: '🌧️' },
  { id: 'playful', name: 'Playful', icon: '🎈' },
  { id: 'mysterious', name: 'Mysterious', icon: '🔮' },
  { id: 'triumphant', name: 'Triumphant', icon: '🏆' },
];

// Languages
const languages = [
  { id: 'english', name: 'English', icon: '🇺🇸' },
  { id: 'spanish', name: 'Spanish', icon: '🇪🇸' },
  { id: 'french', name: 'French', icon: '🇫🇷' },
  { id: 'german', name: 'German', icon: '🇩🇪' },
  { id: 'italian', name: 'Italian', icon: '🇮🇹' },
  { id: 'portuguese', name: 'Portuguese', icon: '🇵🇹' },
  { id: 'japanese', name: 'Japanese', icon: '🇯🇵' },
  { id: 'korean', name: 'Korean', icon: '🇰🇷' },
  { id: 'chinese', name: 'Chinese', icon: '🇨🇳' },
  { id: 'hindi', name: 'Hindi', icon: '🇮🇳' },
  { id: 'arabic', name: 'Arabic', icon: '🇸🇦' },
  { id: 'russian', name: 'Russian', icon: '🇷🇺' },
  { id: 'dutch', name: 'Dutch', icon: '🇳🇱' },
  { id: 'swedish', name: 'Swedish', icon: '🇸🇪' },
  { id: 'polish', name: 'Polish', icon: '🇵🇱' },
  { id: 'turkish', name: 'Turkish', icon: '🇹🇷' },
  { id: 'thai', name: 'Thai', icon: '🇹🇭' },
  { id: 'vietnamese', name: 'Vietnamese', icon: '🇻🇳' },
  { id: 'indonesian', name: 'Indonesian', icon: '🇮🇩' },
  { id: 'tagalog', name: 'Tagalog', icon: '🇵🇭' },
];

// Art styles from HomePage
const artStyles = [
  { id: '3d-cartoon', label: '3D Cartoon', image: '/art_styles/boy_cartoon.jpeg' },
  { id: 'claymation', label: 'Claymation', image: '/art_styles/boy_claymation.jpeg' },
  { id: 'storybook', label: 'Storybook', image: '/art_styles/boy_storybook.jpeg' },
  { id: 'realistic', label: 'Realistic', image: '/art_styles/boy_real.jpeg' },
  { id: 'comic-book', label: 'Comic Book', image: '/art_styles/boy_comic.jpeg' },
  { id: 'classic-blocks', label: 'Classic Blocks', image: '/art_styles/boy_lego.jpeg' },
  { id: 'anime', label: 'Anime', image: '/art_styles/boy_anime.jpeg' },
  { id: 'spray-paint', label: 'Spray Paint', image: '/art_styles/boy_spray_paint.jpeg' },
  { id: 'crayon', label: 'Crayon', image: '/art_styles/boy_crayon.jpeg' },
  { id: 'cozy-woolknit', label: 'Cozy Woolknit', image: '/art_styles/boy_woolknit.jpeg' },
  { id: 'watercolor', label: 'Watercolor', image: '/art_styles/boy_watercolor.jpeg' },
  { id: 'pixel', label: 'Pixel Art', image: '/art_styles/boy_pixel.jpeg' },
  { id: 'sugarpop', label: 'Sugarpop', image: '/art_styles/boy_sugerpop.jpeg' },
  { id: 'origami', label: 'Origami', image: '/art_styles/boy_origami.jpeg' },
  { id: 'bw-sketch', label: 'B&W Sketch', image: '/art_styles/boy_sketch.jpeg' },
  { id: 'minecraft', label: 'Minecraft', image: '/art_styles/boy_mincraft.jpeg' },
];

// Video types and quality options
const videoTypes = [
  { 
    id: 'still', 
    label: 'Still', 
    credits: 50, 
    description: 'Static images synced to music',
    tooltip: 'Images transition with smooth fades, synced to your song. Fast and affordable.',
    icon: ImageIcon,
  },
  { 
    id: 'standard', 
    label: 'Standard', 
    credits: 200, 
    description: 'Animated video',
    tooltip: 'Powered by Seedance AI. Brings your scenes to life with fluid motion and animations.',
    icon: AnimationIcon,
  },
  { 
    id: 'professional', 
    label: 'Professional', 
    credits: 2000, 
    description: 'Premium AI animated video',
    tooltip: 'Powered by Kling 1.0 AI. Cinema-quality animations with the most realistic motion and detail.',
    icon: MovieIcon,
  },
];

// Character kind options
const characterKindOptions = [
  { id: 'Human', label: 'Human', icon: '👤' },
  { id: 'Non-Human', label: 'Non-Human', icon: '🐾' },
];

// Gender options
const genderOptions = [
  { id: 'Male', label: 'Male', icon: '♂️' },
  { id: 'Female', label: 'Female', icon: '♀️' },
];

// Age options
const ageOptions = [
  { id: 'Baby', label: 'Baby (0-2)' },
  { id: 'Toddler', label: 'Toddler (2-4)' },
  { id: 'Child', label: 'Child (5-12)' },
  { id: 'Teen', label: 'Teen (13-19)' },
  { id: 'Young Adult', label: 'Young Adult (20-35)' },
  { id: 'Adult', label: 'Adult (35-55)' },
  { id: 'Senior', label: 'Senior (55+)' },
];

// Hair color options
const hairColorOptions = [
  { id: 'Black', label: 'Black', image: '/hair/short_black.jpeg' },
  { id: 'Dark Brown', label: 'Dark Brown', image: '/hair/short_brown.jpeg' },
  { id: 'Light Brown', label: 'Light Brown', image: '/hair/short_light_brown.jpeg' },
  { id: 'Blonde', label: 'Blonde', image: '/hair/short_blonde.jpeg' },
  { id: 'Strawberry Blonde', label: 'Strawberry Blonde', image: '/hair/short_strawberry_blonde.jpeg' },
  { id: 'Red', label: 'Red / Orange', image: '/hair/short_red.jpeg' },
  { id: 'Grey', label: 'Grey', image: '/hair/short_grey.jpeg' },
  { id: 'White', label: 'White', image: '/hair/short_white.jpeg' },
];

// Hair length options
const hairLengthOptions = [
  { id: 'Short', label: 'Short', image: '/hair/short_blonde.jpeg' },
  { id: 'Medium', label: 'Medium', image: '/hair/medium_brown.jpeg' },
  { id: 'Long', label: 'Long', image: '/hair/long_strawberry_blonde.jpeg' },
  { id: 'Very Long', label: 'Very Long', image: '/hair/very_long_blonde.jpeg' },
  { id: 'Bald', label: 'Bald', image: '/hair/bald.jpeg' },
];

// Eye color options
const eyeColorOptions = [
  { id: 'Brown', label: 'Brown', image: '/eyes/brown.jpg' },
  { id: 'Blue', label: 'Blue', image: '/eyes/blue.jpg' },
  { id: 'Green', label: 'Green', image: '/eyes/green.jpg' },
  { id: 'Hazel', label: 'Hazel', image: '/eyes/hazel.jpg' },
  { id: 'Grey', label: 'Grey', image: '/eyes/grey.jpg' },
];


// Character interface
interface Character {
  characterId: string;
  characterName: string;
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

type TabType = 'song' | 'video' | 'character';

const CreatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const initialTab = (searchParams.get('tab') as TabType) || 'song';
  const songIdFromUrl = searchParams.get('song');
  
  // Get user from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  
  // Song creation state
  const [songPrompt, setSongPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [selectedMood, setSelectedMood] = useState('happy');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [genrePickerOpen, setGenrePickerOpen] = useState(false);
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const [isGeneratingSong, setIsGeneratingSong] = useState(false);
  
  // Video creation state
  const [selectedSong, setSelectedSong] = useState(songIdFromUrl || '');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('3d-cartoon');
  const [videoType, setVideoType] = useState('still'); // 'still', 'casual', or 'creator'
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
  
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['song', 'video', 'character'].includes(tab)) {
      setActiveTab(tab);
    }
    const song = searchParams.get('song');
    if (song) {
      setSelectedSong(song);
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
      try {
        const response = await songsApi.getUserSongs(user.userId);
        // Only show completed songs
        const completedSongs = (response.data.songs || []).filter(
          (s: Song) => s.status === 'completed'
        );
        setSongs(completedSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setIsLoadingSongs(false);
      }
    };
    
    fetchCharacters();
    fetchSongs();
  }, [user?.userId]);

  const handleCloseNotification = useCallback(() => {
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
      setSongPrompt(prev => prev + ` @${name} `);
    } else if (activeTab === 'video') {
      setVideoPrompt(prev => prev + ` @${name} `);
    }
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
    
    setIsGeneratingSong(true);
    try {
      // Call the async song generation API (returns immediately with pending status)
      const response = await songsApi.generateSong({
        userId: user.userId,
        songPrompt: songPrompt.trim(),
        genre: selectedGenre,
        mood: selectedMood,
        language: selectedLanguage,
      });
      
      console.log('Song generation started:', response.data);
      
      // Clear form
      setSongPrompt('');
      setShowSongPromptError(false);
      
      // Navigate immediately to library - song will appear in loading state
      navigate('/dashboard?tab=songs&generating=true');
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
    
    setIsGeneratingVideo(true);
    try {
      // Call the actual video generation API
      const response = await videosApi.generateVideo({
        userId: user.userId,
        songId: selectedSong,
        videoType: videoType as 'still' | 'standard' | 'professional',
        style: selectedStyle,
      });
      
      console.log('Video generation response:', response.data);
      
      setNotification({
        open: true,
        message: 'Music video generated successfully! Check your library.',
        severity: 'success'
      });
      setVideoPrompt('');
      setShowVideoPromptError(false);
      setShowSongSelectionError(false);
      
      // Navigate to dashboard after a short delay
      setTimeout(() => navigate('/dashboard'), 1500);
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

    if (uploadedImages.length === 0) {
      setNotification({
        open: true,
        message: 'Please upload at least one reference image',
        severity: 'error'
      });
      return;
    }

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
      setTimeout(() => navigate('/dashboard'), 1500);
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
    <Container maxWidth="lg" sx={{ pt: 0, pb: 3, px: { xs: 1, sm: 2, md: 3 }, minHeight: 0, overflow: 'visible' }}>
      {/* Toggle Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, width: '100%' }}>
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          fullWidth
          sx={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '100px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            p: 0.5,
            maxWidth: { xs: '100%', sm: 500 },
            '& .MuiToggleButton-root': {
              border: 'none',
              borderRadius: '100px !important',
              flex: 1,
              minWidth: { xs: 'auto', sm: 140 },
              px: { xs: 1.5, sm: 3 },
              py: 1.25,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              color: '#86868B',
              gap: 0.75,
              whiteSpace: 'nowrap',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&.Mui-selected': {
                background: '#007AFF',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,122,255,0.35)',
                '&:hover': { background: '#007AFF' },
              },
              '&:hover': { background: 'rgba(0,122,255,0.06)' },
            },
          }}
        >
          <ToggleButton value="song">
            <MusicNoteIcon sx={{ fontSize: 18 }} />
            Music
          </ToggleButton>
          <ToggleButton value="video">
            <VideoLibraryIcon sx={{ fontSize: 18 }} />
            Music Videos
          </ToggleButton>
          <ToggleButton value="character">
            <PersonIcon sx={{ fontSize: 18 }} />
            Characters
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Song Creation Tab */}
      {activeTab === 'song' && (
        <>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Left Column - Song Options */}
          <Box sx={{ flex: 1 }}>
            {/* Prompt Input */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                border: showSongPromptError && !songPrompt.trim() ? '1px solid rgba(255,59,48,0.5)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
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
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#86868B', display: 'block', mb: 1 }}>
                  Add characters to your song:
                </Typography>
                {isLoadingCharacters ? (
                  <Typography variant="caption" sx={{ color: '#86868B' }}>Loading characters...</Typography>
                ) : characters.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {characters.map((char) => (
                      <Chip
                        key={char.characterId}
                        label={`@${char.characterName}`}
                        onClick={() => insertCharacter(char.characterName)}
                        size="small"
                        sx={{
                          borderRadius: '100px',
                          background: 'rgba(0,122,255,0.1)',
                          color: '#007AFF',
                          fontWeight: 500,
                          cursor: 'pointer',
                          '&:hover': { background: 'rgba(0,122,255,0.2)' },
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Chip
                    label="+ Create a character"
                    onClick={() => setActiveTab('character')}
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
              
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Describe your song idea... E.g., 'An upbeat summer anthem about road trips and friendship'"
                value={songPrompt}
                onChange={(e) => {
                  setSongPrompt(e.target.value);
                  if (e.target.value.trim()) setShowSongPromptError(false);
                }}
                error={showSongPromptError && !songPrompt.trim()}
                helperText={showSongPromptError && !songPrompt.trim() ? 'Please describe your song idea' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: '#fff',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,122,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                  },
                }}
              />
            </Paper>

            {/* Genre Selection */}
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                Genre
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Choose a music style for your track
              </Typography>
              <Button
                onClick={() => setGenrePickerOpen(true)}
                fullWidth
                sx={{
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  py: 1.5,
                  px: 2,
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: '#fff',
                  color: '#1D1D1F',
                  fontWeight: 500,
                  '&:hover': { background: 'rgba(0,122,255,0.05)', borderColor: '#007AFF' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {genres.find(g => g.id === selectedGenre)?.icon} {genres.find(g => g.id === selectedGenre)?.name}
                </Box>
                <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />
              </Button>
            </Paper>

            {/* Mood Selection */}
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                Mood
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Set the emotional tone of your song
              </Typography>
              <Button
                onClick={() => setMoodPickerOpen(true)}
                fullWidth
                sx={{
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  py: 1.5,
                  px: 2,
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: '#fff',
                  color: '#1D1D1F',
                  fontWeight: 500,
                  '&:hover': { background: 'rgba(0,122,255,0.05)', borderColor: '#007AFF' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {moods.find(m => m.id === selectedMood)?.icon} {moods.find(m => m.id === selectedMood)?.name}
                </Box>
                <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />
              </Button>
            </Paper>

            {/* Language Selection */}
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
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                Language
              </Typography>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                Select the language for lyrics
              </Typography>
              <Button
                onClick={() => setLanguagePickerOpen(true)}
                fullWidth
                sx={{
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  py: 1.5,
                  px: 2,
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: '#fff',
                  color: '#1D1D1F',
                  fontWeight: 500,
                  '&:hover': { background: 'rgba(0,122,255,0.05)', borderColor: '#007AFF' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {languages.find(l => l.id === selectedLanguage)?.icon} {languages.find(l => l.id === selectedLanguage)?.name}
                </Box>
                <KeyboardArrowDownIcon sx={{ color: '#86868B' }} />
              </Button>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Genre</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {genres.find(g => g.id === selectedGenre)?.icon} {genres.find(g => g.id === selectedGenre)?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Mood</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {moods.find(m => m.id === selectedMood)?.icon} {moods.find(m => m.id === selectedMood)?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Language</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {languages.find(l => l.id === selectedLanguage)?.icon} {languages.find(l => l.id === selectedLanguage)?.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Prompt</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', maxWidth: 180, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {songPrompt.trim() ? songPrompt.substring(0, 30) + (songPrompt.length > 30 ? '...' : '') : 'Not entered'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(88,86,214,0.1) 100%)', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>Total Credits</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    25
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
                  <ListItemText 
                    primary={`${genre.icon} ${genre.name}`} 
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
                  <ListItemText 
                    primary={`${mood.icon} ${mood.name}`} 
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
                  <ListItemText 
                    primary={`${language.icon} ${language.name}`} 
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
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
                {selectedSong 
                  ? songs.find(s => s.songId === selectedSong)?.songTitle + ' (' + songs.find(s => s.songId === selectedSong)?.genre + ')' 
                  : 'Choose a song from your library'}
                <KeyboardArrowDownIcon sx={{ color: '#86868B', ml: 1 }} />
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
              onClose={() => setSongPickerOpen(false)}
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
                  Select Song
                </Typography>
              </Box>
              <ScrollableListWrapper>
                {isLoadingSongs ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#86868B' }}>Loading songs...</Typography>
                  </Box>
                ) : songs.length > 0 ? (
                  songs.map((song) => (
                    <ListItem key={song.songId} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          setSelectedSong(song.songId);
                          setSongPickerOpen(false);
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
                              background: 'linear-gradient(135deg, #1D1D1F 0%, #3a3a3c 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <MusicNoteIcon sx={{ color: '#fff' }} />
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
                  ))
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#86868B', mb: 2 }}>No songs available</Typography>
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
                  </Box>
                )}
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
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#86868B', display: 'block', mb: 1 }}>
                  Add characters to your video:
                </Typography>
                {isLoadingCharacters ? (
                  <Typography variant="caption" sx={{ color: '#86868B' }}>Loading characters...</Typography>
                ) : characters.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {characters.map((char) => (
                      <Chip
                        key={char.characterId}
                        label={`@${char.characterName}`}
                        onClick={() => insertCharacter(char.characterName)}
                        size="small"
                        sx={{
                          borderRadius: '100px',
                          background: 'rgba(0,122,255,0.1)',
                          color: '#007AFF',
                          fontWeight: 500,
                          cursor: 'pointer',
                          '&:hover': { background: 'rgba(0,122,255,0.2)' },
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Chip
                    label="+ Create a character"
                    onClick={() => setActiveTab('character')}
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
              
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Describe the scenes, setting, and story for your music video..."
                value={videoPrompt}
                onChange={(e) => {
                  setVideoPrompt(e.target.value);
                  if (e.target.value.trim()) setShowVideoPromptError(false);
                }}
                error={showVideoPromptError && !videoPrompt.trim()}
                helperText={showVideoPromptError && !videoPrompt.trim() ? 'Please describe your video' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: '#fff',
                    '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(0,122,255,0.3)' },
                    '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                  },
                }}
              />
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
                      placement="top"
                      enterDelay={300}
                      sx={{ maxWidth: 220 }}
                    >
                      <ToggleButton
                        value={type.id}
                        sx={{
                          flex: 1,
                          py: 2,
                          flexDirection: 'column',
                          gap: 1,
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
                        <IconComponent sx={{ fontSize: 28, color: isSelected ? '#007AFF' : '#1D1D1F' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: isSelected ? '#007AFF' : '#1D1D1F' }}>{type.label}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>{type.description}</Typography>
                        <Chip label={`${type.credits} tokens`} size="small" sx={{ mt: 0.5, fontWeight: 700, background: 'rgba(0,122,255,0.1)', color: '#007AFF' }} />
                      </ToggleButton>
                    </Tooltip>
                  );
                })}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Song</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {songs.find(s => s.songId === selectedSong)?.songTitle || 'Not selected'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Style</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {artStyles.find(s => s.id === selectedStyle)?.label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>Type</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    {videoTypes.find(t => t.id === videoType)?.label}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ p: 2, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(88,86,214,0.1) 100%)', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>Total Credits</Typography>
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

      {/* Character Creation Tab */}
      {activeTab === 'character' && (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          {/* Character Name */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: showCharacterNameError && !characterName.trim() ? '1px solid rgba(255,59,48,0.5)' : '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <PersonIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Character Name
              </Typography>
              <Chip label="Required" size="small" sx={{ ml: 1, background: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontWeight: 600, fontSize: '0.7rem' }} />
            </Box>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Give your character a unique name to reference in songs and videos
            </Typography>
            <TextField
              fullWidth
              value={characterName}
              onChange={(e) => {
                setCharacterName(e.target.value);
                if (e.target.value.trim()) setShowCharacterNameError(false);
              }}
              placeholder="e.g., Luna, Max, Aria"
              error={showCharacterNameError && !characterName.trim()}
              helperText={showCharacterNameError && !characterName.trim() ? 'Please enter a character name' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: '#fff',
                },
              }}
            />
          </Paper>

          {/* Character Kind */}
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Kind of Character
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Choose whether your character is human or non-human (animals, fantasy creatures, etc.)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {characterKindOptions.map((kind) => (
                <Chip
                  key={kind.id}
                  label={`${kind.icon} ${kind.label}`}
                  onClick={() => setCharacterKind(kind.id)}
                  sx={{
                    px: 2,
                    py: 2.5,
                    fontSize: '0.9rem',
                    fontWeight: characterKind === kind.id ? 600 : 500,
                    borderRadius: '100px',
                    background: characterKind === kind.id ? 'rgba(0,122,255,0.1)' : 'rgba(0,0,0,0.03)',
                    color: characterKind === kind.id ? '#007AFF' : '#1D1D1F',
                    border: characterKind === kind.id ? '2px solid #007AFF' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { background: characterKind === kind.id ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.06)' },
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Gender */}
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Gender
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Select the gender identity for your character
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {genderOptions.map((gender) => (
                <Chip
                  key={gender.id}
                  label={`${gender.icon} ${gender.label}`}
                  onClick={() => setCharacterGender(gender.id)}
                  sx={{
                    px: 2,
                    py: 2.5,
                    fontSize: '0.9rem',
                    fontWeight: characterGender === gender.id ? 600 : 500,
                    borderRadius: '100px',
                    background: characterGender === gender.id ? 'rgba(0,122,255,0.1)' : 'rgba(0,0,0,0.03)',
                    color: characterGender === gender.id ? '#007AFF' : '#1D1D1F',
                    border: characterGender === gender.id ? '2px solid #007AFF' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { background: characterGender === gender.id ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.06)' },
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Image Mode Selection */}
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Reference Images
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Upload up to {MAX_CHARACTER_IMAGES} reference images for your character's appearance in music videos
            </Typography>
            
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ width: '100%', borderRadius: '12px', py: 1.5, borderColor: '#007AFF', color: '#007AFF' }}
            >
              Upload Images ({uploadedImages.length}/{MAX_CHARACTER_IMAGES})
              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </Button>
            
            {uploadedImages.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                {uploadedImages.map((image, index) => (
                  <Box key={index} sx={{ position: 'relative', width: 70, height: 70 }}>
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`Upload ${index}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(255,255,255,0.9)', '&:hover': { backgroundColor: '#fff' }, p: 0.5 }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: '#FF3B30' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* Human-specific options */}
          {characterKind === 'Human' && (
            <>
              {/* Hair Color */}
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
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                  Hair Color
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                  Choose the hair color for your character
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setHairColorPickerOpen(true)}
                  sx={{
                    justifyContent: 'space-between',
                    py: 1.5,
                    px: 2,
                    borderRadius: '12px',
                    borderColor: 'rgba(0,0,0,0.15)',
                    color: '#1D1D1F',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.04)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box component="img" src={hairColorOptions.find(h => h.id === characterHairColor)?.image} alt={characterHairColor} sx={{ width: 32, height: 32, borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
                    {hairColorOptions.find(h => h.id === characterHairColor)?.label}
                  </Box>
                  <KeyboardArrowDownIcon sx={{ color: '#007AFF', ml: 1 }} />
                </Button>
              </Paper>

              {/* Hair Length */}
              {characterHairLength !== 'Bald' && (
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
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                    Hair Length
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
                    Select the hair length style for your character
                  </Typography>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setHairLengthPickerOpen(true)}
                    sx={{
                      justifyContent: 'space-between',
                      py: 1.5,
                      px: 2,
                      borderRadius: '12px',
                      borderColor: 'rgba(0,0,0,0.15)',
                      color: '#1D1D1F',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.04)' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box component="img" src={hairLengthOptions.find(h => h.id === characterHairLength)?.image} alt={characterHairLength} sx={{ width: 32, height: 32, borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
                      {hairLengthOptions.find(h => h.id === characterHairLength)?.label}
                    </Box>
                    <KeyboardArrowDownIcon sx={{ color: '#007AFF', ml: 1 }} />
                  </Button>
                </Paper>
              )}
            </>
          )}

          {/* Eye Color */}
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Eye Color
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Pick the eye color for your character
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setEyeColorPickerOpen(true)}
              sx={{
                justifyContent: 'space-between',
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                borderColor: 'rgba(0,0,0,0.15)',
                color: '#1D1D1F',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.04)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box component="img" src={eyeColorOptions.find(e => e.id === characterEyeColor)?.image} alt={characterEyeColor} sx={{ width: 32, height: 32, borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
                {eyeColorOptions.find(e => e.id === characterEyeColor)?.label}
              </Box>
              <KeyboardArrowDownIcon sx={{ color: '#007AFF', ml: 1 }} />
            </Button>
          </Paper>

          {/* Age */}
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Age
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Select the age range for your character
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setAgePickerOpen(true)}
              sx={{
                justifyContent: 'space-between',
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                borderColor: 'rgba(0,0,0,0.15)',
                color: '#1D1D1F',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.04)' },
              }}
            >
              {ageOptions.find(a => a.id === characterAge)?.label}
              <MusicNoteIcon sx={{ color: '#007AFF', ml: 1 }} />
            </Button>
          </Paper>

          {/* Description */}
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
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Description (Optional)
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Add extra details about your character's personality, appearance, or traits
            </Typography>
            <TextField
              fullWidth
              value={characterDescription}
              onChange={(e) => setCharacterDescription(e.target.value)}
              multiline
              rows={3}
              placeholder="e.g., A cheerful girl who loves adventures, always wears a red scarf"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  background: '#fff',
                },
              }}
            />
          </Paper>

          {/* Create Character Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleCreateCharacter}
            disabled={isCreatingCharacter}
            sx={{
              py: 2,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
              boxShadow: '0 8px 24px rgba(0,122,255,0.3)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              '&:hover': { boxShadow: '0 12px 32px rgba(0,122,255,0.4)' },
              '&.Mui-disabled': { background: 'rgba(0,0,0,0.1)' },
            }}
          >
            {isCreatingCharacter ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              <>
                <PersonIcon sx={{ mr: 1 }} />
                Create Character
              </>
            )}
          </Button>

          {/* Action Sheets / Bottom Drawers */}

          {/* Age Picker */}
          <Drawer
            anchor="bottom"
            open={agePickerOpen}
            onClose={() => setAgePickerOpen(false)}
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
                Select Age
              </Typography>
            </Box>
            <List sx={{ px: 1, py: 1 }}>
              {ageOptions.map((age) => (
                <ListItem key={age.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setCharacterAge(age.id);
                      setAgePickerOpen(false);
                    }}
                    sx={{
                      borderRadius: '12px',
                      mb: 0.5,
                      py: 1.5,
                      background: characterAge === age.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                      border: characterAge === age.id ? '2px solid #007AFF' : '2px solid transparent',
                    }}
                  >
                    <ListItemText primary={age.label} primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} />
                    {characterAge === age.id && <CheckIcon sx={{ color: '#007AFF' }} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => setAgePickerOpen(false)} 
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

          {/* Hair Color Picker */}
          <Drawer
            anchor="bottom"
            open={hairColorPickerOpen}
            onClose={() => setHairColorPickerOpen(false)}
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
                Select Hair Color
              </Typography>
            </Box>
            <List sx={{ px: 1, py: 1 }}>
              {hairColorOptions.map((color) => (
                <ListItem key={color.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setCharacterHairColor(color.id);
                      setHairColorPickerOpen(false);
                    }}
                    sx={{
                      borderRadius: '12px',
                      mb: 0.5,
                      py: 1.5,
                      background: characterHairColor === color.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                      border: characterHairColor === color.id ? '2px solid #007AFF' : '2px solid transparent',
                    }}
                  >
                    <ListItemIcon>
                      <Box component="img" src={color.image} alt={color.label} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.1)' }} />
                    </ListItemIcon>
                    <ListItemText primary={color.label} primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} />
                    {characterHairColor === color.id && <CheckIcon sx={{ color: '#007AFF' }} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => setHairColorPickerOpen(false)} 
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

          {/* Hair Length Picker */}
          <Drawer
            anchor="bottom"
            open={hairLengthPickerOpen}
            onClose={() => setHairLengthPickerOpen(false)}
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
                Select Hair Length
              </Typography>
            </Box>
            <List sx={{ px: 1, py: 1 }}>
              {hairLengthOptions.map((length) => (
                <ListItem key={length.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setCharacterHairLength(length.id);
                      setHairLengthPickerOpen(false);
                    }}
                    sx={{
                      borderRadius: '12px',
                      mb: 0.5,
                      py: 1.5,
                      background: characterHairLength === length.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                      border: characterHairLength === length.id ? '2px solid #007AFF' : '2px solid transparent',
                    }}
                  >
                    <ListItemIcon>
                      <Box component="img" src={length.image} alt={length.label} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.1)' }} />
                    </ListItemIcon>
                    <ListItemText primary={length.label} primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} />
                    {characterHairLength === length.id && <CheckIcon sx={{ color: '#007AFF' }} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => setHairLengthPickerOpen(false)} 
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

          {/* Eye Color Picker */}
          <Drawer
            anchor="bottom"
            open={eyeColorPickerOpen}
            onClose={() => setEyeColorPickerOpen(false)}
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
                Select Eye Color
              </Typography>
            </Box>
            <List sx={{ px: 1, py: 1 }}>
              {eyeColorOptions.map((color) => (
                <ListItem key={color.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      setCharacterEyeColor(color.id);
                      setEyeColorPickerOpen(false);
                    }}
                    sx={{
                      borderRadius: '12px',
                      mb: 0.5,
                      py: 1.5,
                      background: characterEyeColor === color.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                      border: characterEyeColor === color.id ? '2px solid #007AFF' : '2px solid transparent',
                    }}
                  >
                    <ListItemIcon>
                      <Box component="img" src={color.image} alt={color.label} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.1)' }} />
                    </ListItemIcon>
                    <ListItemText primary={color.label} primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} />
                    {characterEyeColor === color.id && <CheckIcon sx={{ color: '#007AFF' }} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => setEyeColorPickerOpen(false)} 
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
    </Container>
  );
};

export default CreatePage;

