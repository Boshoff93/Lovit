import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import GoogleIcon from '@mui/icons-material/Google';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LanguageIcon from '@mui/icons-material/Language';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { useAuth } from '../hooks/useAuth';
import { useInView } from '../hooks/useInView';
import { songsApi } from '../services/api';
import { SEO } from '../utils/seoHelper';
import { MarketingHeader, CTASection } from '../components/marketing';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';

// Owner user ID for the seed songs
const SEED_SONGS_USER_ID = 'b1b35a41-efb4-4f79-ad61-13151294940d';

// Genre to image mapping
const genreToImage: Record<string, string> = {
  'indie': '/genres/indie.jpeg',
  'chillout': '/genres/chillout.jpeg',
  'chill': '/genres/chillout.jpeg',
  'hip-hop': '/genres/hip-hop.jpeg',
  'pop': '/genres/pop.jpeg',
  'kpop': '/genres/kpop.jpeg',
  'jpop': '/genres/jpop.jpeg',
  'dance': '/genres/dance.jpeg',
  'gospel': '/genres/gospels.jpeg',
  'ambient': '/genres/ambient.jpeg',
  'lofi': '/genres/lofi.jpeg',
  'house': '/genres/house.jpeg',
  'metal': '/genres/metal.jpeg',
  'jazz': '/genres/jazz.jpeg',
  'blues': '/genres/blues.jpeg',
  'soul': '/genres/soul.jpeg',
  'rnb': '/genres/rnb.jpeg',
  'funk': '/genres/funk.jpeg',
  'classical': '/genres/classic.jpeg',
  'orchestral': '/genres/orchestral.jpeg',
  'cinematic': '/genres/cinematic.jpeg',
  'country': '/genres/country.jpeg',
  'folk': '/genres/folk.jpeg',
  'acoustic': '/genres/acoustic.jpeg',
  'rock': '/genres/rock.jpeg',
  'latin': '/genres/latin.jpeg',
  'reggaeton': '/genres/raggaeton.jpeg',
  'reggae': '/genres/raggae.jpeg',
  'electronic': '/genres/electronic.jpeg',
  'alternative': '/genres/alternative.jpeg',
  'punk': '/genres/punk.jpeg',
  'edm': '/genres/edm.jpeg',
  'techno': '/genres/techno.jpeg',
};

// Featured tracks (top picks)
const featuredTracks = [
  { id: 'a93fd48c-9c12-41a5-8158-7afea227714f', title: 'Unstoppable', genre: 'pop', duration: '2:17' },
  { id: '48f6a5d8-6086-43ca-9755-5fbbb576c35c', title: 'Concrete Shadows', genre: 'hip-hop', duration: '1:39' },
  { id: '4ed4cf4d-6a02-457b-adb2-5718501abc9c', title: 'Dawn Will Find Us', genre: 'cinematic', duration: '2:46' },
  { id: '31a82512-422d-47ee-9661-655d6d050ce7', title: 'Sunshine in My Coffee Cup', genre: 'jazz', duration: '2:05' },
];

// All sample tracks
const sampleTracks = [
  { id: '5c49bfef-b207-42ac-9a61-762112f1a101', title: 'Polaroid Summer', genre: 'indie', duration: '1:59' },
  { id: 'dd493e6b-a5ac-497c-8952-28161a270e71', title: 'Golden Hour Drive', genre: 'chillout', duration: '2:41' },
  { id: '48f6a5d8-6086-43ca-9755-5fbbb576c35c', title: 'Concrete Shadows', genre: 'hip-hop', duration: '1:39' },
  { id: 'a93fd48c-9c12-41a5-8158-7afea227714f', title: 'Unstoppable', genre: 'pop', duration: '2:17' },
  { id: 'f2614c35-ce09-458d-b647-4ff84ed37ac5', title: 'Shine Like Stars', genre: 'kpop', duration: '1:44' },
  { id: 'cba96fc1-204a-4da8-8830-965fc8a081c0', title: 'Neon Heartbeat Warriors', genre: 'jpop', duration: '2:09' },
  { id: '0fb24f5f-029f-4fc0-bf17-6ef34a709a3e', title: 'Hands Up to the Sky', genre: 'dance', duration: '2:05' },
  { id: '5de7af18-791c-4a7e-8c81-7b317dc25a6c', title: 'Rise Up in Glory', genre: 'gospel', duration: '2:20' },
  { id: '54169f29-44da-4515-912a-38c3e7c428ec', title: 'Whispers of the Forest', genre: 'ambient', duration: '2:22' },
  { id: '3619c929-e7ee-4f88-b62e-9300e545d47d', title: '3AM Thoughts', genre: 'lofi', duration: '2:22' },
  { id: 'dfcaddd2-2896-499a-8823-007483fc76ce', title: 'Golden Hour', genre: 'house', duration: '2:29' },
  { id: '279f4e79-00bd-45d2-b602-1638fabf8211', title: 'Forge of the Fallen', genre: 'metal', duration: '4:00' },
  { id: '31a82512-422d-47ee-9661-655d6d050ce7', title: 'Sunshine in My Coffee Cup', genre: 'jazz', duration: '2:05' },
  { id: '39e76336-ea40-4a4a-9458-c45c02e6dc3c', title: 'Worn Down to the Bone', genre: 'blues', duration: '2:40' },
  { id: '3cec23f5-d29d-4fd2-a515-b035c88df0a9', title: 'Empty Chair', genre: 'soul', duration: '2:50' },
  { id: '1001f55b-6365-49c6-88a1-0ed1a3670f9c', title: 'Pieces of Tomorrow', genre: 'rnb', duration: '2:58' },
  { id: '47b4c888-7c69-43b9-86a4-380f9397fa1c', title: 'Get Up and Groove', genre: 'funk', duration: '1:47' },
  { id: '4e67936e-4e62-4502-9f55-9ef209060c3d', title: 'Shadows on the Keys', genre: 'classical', duration: '2:53' },
  { id: '9bd4a5e3-b7b9-44bd-bb44-677304166b48', title: 'Kingdom in the Clouds', genre: 'orchestral', duration: '2:02' },
  { id: '4ed4cf4d-6a02-457b-adb2-5718501abc9c', title: 'Dawn Will Find Us', genre: 'cinematic', duration: '2:46' },
  { id: '2f654e24-9234-41f5-ad36-32ee1ee531cd', title: 'Whiskey and Goodbye', genre: 'country', duration: '2:10' },
  { id: '9e17a9e2-92c1-4cbe-922b-ccfc4e287c7a', title: 'Where the Porch Light Burns', genre: 'folk', duration: '2:08' },
  { id: 'a0745ff4-44ad-4931-879d-398527047196', title: 'Bare Bones', genre: 'acoustic', duration: '2:29' },
  { id: '51815c85-86d9-4c3b-a355-189851a7685f', title: 'Rise Against The Machine', genre: 'rock', duration: '2:18' },
  { id: '70e5649c-af1b-4ad8-b2a5-d5c7bdfb9a35', title: 'Fuego en la Pista', genre: 'latin', duration: '2:24' },
  { id: '6c892b5e-47ba-4e34-b7f1-70d106099608', title: 'Fuego Tonight', genre: 'reggaeton', duration: '1:26' },
  { id: '553196cc-7be1-4834-ba8d-39f2c24f4f21', title: 'Midnight Dub Session', genre: 'reggae', duration: '2:18' },
  { id: 'f4e20940-11a6-4a5c-b992-71961cd53c23', title: 'Rainy Window Afternoons', genre: 'lofi', duration: '1:50' },
  { id: '08fb2cd6-82f9-4c8b-95c1-aff31b1eb212', title: 'Friday Never Ends', genre: 'punk', duration: '2:14' },
  { id: '40a9ad54-b56d-4cfe-a3be-e19ea85aedee', title: 'Rise Into the Light', genre: 'electronic', duration: '2:55' },
  { id: '10b9b6fa-811c-421f-8ca6-31ac93d25d88', title: 'Concrete Veins', genre: 'alternative', duration: '2:14' },
  { id: '5dab088b-779f-4ae3-a3ef-1c206066f01a', title: 'Pulse of the Infinite', genre: 'techno', duration: '2:25' },
  // Additional genre tracks
  { id: '49995520-1898-4675-9657-3fd93142fd99', title: 'Neon Confessions', genre: 'pop', duration: '2:49' },
  { id: '93e99651-7173-49b3-bc47-37e6b33dc15b', title: 'City Lights On My Heart', genre: 'pop', duration: '2:02' },
  { id: '801063e2-df5e-4abf-87b4-5fbfb49cb103', title: 'From the Concrete', genre: 'hip-hop', duration: '1:45' },
  { id: 'a9b292d1-0215-4e5c-a87d-17a9e7654c0c', title: 'Candlelight Promise', genre: 'rnb', duration: '2:55' },
  { id: '79b6d662-b0cd-4a8d-9924-b4e3ba16d7d3', title: 'Crystalline Drift', genre: 'electronic', duration: '2:56' },
  { id: 'b5774873-ea24-49c3-8ff7-4f3ab4f49740', title: 'Rise Into The Light', genre: 'dance', duration: '2:02' },
  { id: '9c31f3fa-f744-4cfd-b549-b6d754393de4', title: 'Feel the Groove Tonight', genre: 'house', duration: '2:36' },
  { id: 'a1cf722f-4ec1-45a6-923d-d26b9647ecdb', title: 'Rise Into The Light', genre: 'edm', duration: '2:08' },
  { id: 'a10e20cb-3d1c-4ba3-ade6-14c970ba2974', title: 'Machine Heart Protocol', genre: 'techno', duration: '2:26' },
  { id: 'dc096869-8a5e-4c9f-a664-53da6e55966c', title: 'Burn The Night', genre: 'rock', duration: '2:32' },
  { id: 'b2cf2690-797b-4d79-96a1-b75a61d58bb9', title: 'Empty Rooms', genre: 'alternative', duration: '2:50' },
  { id: 'abbde752-0560-40dc-858c-75fbc5e5d2b6', title: 'Golden Hour Getaway', genre: 'indie', duration: '1:57' },
  { id: '394e6756-92c5-4f55-8ec4-f7a83f09b580', title: 'Not Your Puppet', genre: 'punk', duration: '1:55' },
  { id: 'dcfcae83-63a5-4975-8496-7b97e04fc7d4', title: 'Teeth of the Void', genre: 'metal', duration: '3:46' },
  { id: 'd00b4220-bc57-43f8-836d-cae5089da865', title: 'Midnight at the Blue Room', genre: 'jazz', duration: '2:50' },
];

// Genres list for filtering
const genres = [
  { id: 'all', name: 'All Genres' },
  { id: 'pop', name: 'Pop' },
  { id: 'hip-hop', name: 'Hip Hop' },
  { id: 'rnb', name: 'R&B' },
  { id: 'electronic', name: 'Electronic' },
  { id: 'rock', name: 'Rock' },
  { id: 'jazz', name: 'Jazz' },
  { id: 'classical', name: 'Classical' },
  { id: 'country', name: 'Country' },
  { id: 'latin', name: 'Latin' },
  { id: 'lofi', name: 'Lo-fi' },
];

// Genre showcase data
const genreShowcase = [
  { id: 'pop', name: 'Pop', color: '#FF6B9D' },
  { id: 'hip-hop', name: 'Hip Hop', color: '#8B5CF6' },
  { id: 'electronic', name: 'Electronic', color: '#00D4FF' },
  { id: 'rock', name: 'Rock', color: '#FF4444' },
  { id: 'jazz', name: 'Jazz', color: '#FFB347' },
  { id: 'classical', name: 'Classical', color: '#9D8DF1' },
];

// Languages - All 24 supported languages with images
const languages = [
  { id: 'en', name: 'English', image: '/locales/en.jpeg' },
  { id: 'es', name: 'Spanish', image: '/locales/es.jpeg' },
  { id: 'fr', name: 'French', image: '/locales/fr.jpeg' },
  { id: 'de', name: 'German', image: '/locales/de.jpeg' },
  { id: 'it', name: 'Italian', image: '/locales/it.jpeg' },
  { id: 'pt', name: 'Portuguese', image: '/locales/pt.jpeg' },
  { id: 'nl', name: 'Dutch', image: '/locales/nl.jpeg' },
  { id: 'pl', name: 'Polish', image: '/locales/pl.jpeg' },
  { id: 'ro', name: 'Romanian', image: '/locales/ro.jpeg' },
  { id: 'cs', name: 'Czech', image: '/locales/cs.jpeg' },
  { id: 'el', name: 'Greek', image: '/locales/el.jpeg' },
  { id: 'bg', name: 'Bulgarian', image: '/locales/bg.jpeg' },
  { id: 'fi', name: 'Finnish', image: '/locales/fi.jpeg' },
  { id: 'uk', name: 'Ukrainian', image: '/locales/uk.jpeg' },
  { id: 'ru', name: 'Russian', image: '/locales/ru.jpeg' },
  { id: 'tr', name: 'Turkish', image: '/locales/tr.jpeg' },
  { id: 'ar', name: 'Arabic', image: '/locales/ar.jpeg' },
  { id: 'hi', name: 'Hindi', image: '/locales/hi.jpeg' },
  { id: 'th', name: 'Thai', image: '/locales/th.jpeg' },
  { id: 'vi', name: 'Vietnamese', image: '/locales/vi.jpeg' },
  { id: 'id', name: 'Indonesian', image: '/locales/id.jpeg' },
  { id: 'ja', name: 'Japanese', image: '/locales/js.jpeg' },
  { id: 'ko', name: 'Korean', image: '/locales/ko.jpeg' },
  { id: 'zh', name: 'Chinese', image: '/locales/zh.jpeg' },
];

// Language sample tracks - using the same tracks as LanguageDetailPage (one per language)
const languageSampleTracks: Record<string, Array<{id: string; title: string; duration: string}>> = {
  'english': [{ id: 'ca9e75ed-551e-4f0e-b939-2130ac0fcdc3', title: 'Wide Open Sky', duration: '2:19' }],
  'spanish': [{ id: '1faa7d07-51ef-4bbd-841c-67d0e78a1add', title: 'Fuego en la Piel', duration: '1:38' }],
  'french': [{ id: 'a67bee12-fab5-45ef-aa3a-1c846c60e4d9', title: 'Sous le Ciel de Paris', duration: '2:21' }],
  'german': [{ id: 'b6413f7f-31fc-4cf4-b9f9-49a0d6c75a14', title: 'Sternenstaub', duration: '2:16' }],
  'japanese': [{ id: '2a1ff05d-cc16-4a81-b2ff-e4df1b14a14a', title: 'Sakura no Yume', duration: '2:08' }],
  'korean': [{ id: '74f73f7a-ddbb-4b7a-9e6b-3157e6dd7e0c', title: 'Neo-Seoul Nights', duration: '2:22' }],
  'chinese': [{ id: 'b9826c0a-ec29-4f59-8d3b-19f9f1e9e7d0', title: 'Yue Xia Du Xing', duration: '2:17' }],
  'portuguese': [{ id: '7e52e4b2-7c61-4afc-8c77-0f4e2cd3c7fd', title: 'Saudade do Mar', duration: '2:33' }],
  'italian': [{ id: 'a2bc2d41-41e6-4a28-a7ef-96a19cc5db75', title: 'Sotto le Stelle', duration: '2:23' }],
  'hindi': [{ id: '6d17acca-6915-491a-a38a-23b5f03f2f43', title: 'Dil Ki Awaaz', duration: '2:28' }],
  'arabic': [{ id: 'ad6b6c30-e2f9-42b5-b0b9-e5b66d1f6d74', title: 'Layl Al-Qamar', duration: '2:13' }],
  'russian': [{ id: 'db6ee7c8-55c7-4b03-86ed-89d38d1fa0f4', title: 'Snezhnaya Noch', duration: '2:30' }],
  'turkish': [{ id: 'f2614c35-ce09-458d-b647-4ff84ed37ac6', title: 'Istanbul Rüyası', duration: '2:18' }],
  'thai': [{ id: 'e4c8a4a7-5e3c-4b8e-b3f5-3a7c8d9e0f1b', title: 'Khwam Rak Nai Jai', duration: '2:07' }],
  'vietnamese': [{ id: '771d81bd-b99f-4ebb-bae7-3ce05013f134', title: 'Lần Đầu Yêu', duration: '2:13' }],
};

// Language display order for the carousel
const languageOrder = ['english', 'spanish', 'french', 'german', 'japanese', 'korean', 'chinese', 'portuguese', 'italian', 'hindi', 'arabic', 'russian', 'turkish', 'thai', 'vietnamese'];

// Language name to image code mapping
const languageToImageCode: Record<string, string> = {
  'english': 'en', 'spanish': 'es', 'french': 'fr', 'german': 'de',
  'japanese': 'js', 'korean': 'ko', 'chinese': 'zh', 'portuguese': 'pt',
  'italian': 'it', 'hindi': 'hi', 'arabic': 'ar', 'russian': 'ru',
  'turkish': 'tr', 'thai': 'th', 'vietnamese': 'vi',
};

// Function to get language tracks
function getLanguageTracksForRoute(): Array<{id: string; title: string; language: string; duration: string; image: string}> {
  return languageOrder.map(lang => {
    const track = languageSampleTracks[lang][0];
    const langName = lang.charAt(0).toUpperCase() + lang.slice(1);
    const imageCode = languageToImageCode[lang] || lang.slice(0, 2);
    return { ...track, language: langName, image: `/locales/${imageCode}.jpeg` };
  });
}

// Animated Equalizer Component
const AudioEqualizer: React.FC<{ isPlaying: boolean; size?: number; color?: string }> = ({
  isPlaying,
  size = 20,
  color = '#3B82F6'
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

// Blue-themed Section Divider for AI Music page - absolute positioned style
const SectionDivider: React.FC = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 10,
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, transparent 15%, rgba(59,130,246,0.2) 35%, rgba(6,182,212,0.25) 50%, rgba(59,130,246,0.2) 65%, transparent 85%, transparent 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-2px',
          left: '30%',
          right: '30%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.05) 30%, rgba(6,182,212,0.08) 50%, rgba(59,130,246,0.05) 70%, transparent 100%)',
          filter: 'blur(2px)',
        },
      }}
    />
  </Box>
);

const AIMusicPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;
  const { currentSong, isPlaying, playSong, pauseSong } = useAudioPlayer();
  const { login, signup, googleLogin, getGoogleIdToken, resendVerificationEmail, error: authError } = useAuth();

  // Scroll-triggered animation refs
  const { ref: featuredRef, inView: featuredInView } = useInView({ threshold: 0.1 });
  const { ref: whyRef, inView: whyInView } = useInView({ threshold: 0.1 });
  const { ref: genresRef, inView: genresInView } = useInView({ threshold: 0.1 });
  const { ref: languagesRef, inView: languagesInView } = useInView({ threshold: 0.1 });
  const { ref: exploreRef, inView: exploreInView } = useInView({ threshold: 0.1 });

  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loadingSongId, setLoadingSongId] = useState<string | null>(null);
  const [songCache, setSongCache] = useState<Record<string, any>>({});

  // Auth modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter tracks by genre
  const filteredTracks = selectedGenre === 'all'
    ? sampleTracks
    : sampleTracks.filter(t => t.genre === selectedGenre);

  // Handle play button click
  const handlePlayTrack = useCallback(async (track: { id: string; title: string; genre: string; duration: string }) => {
    if (currentSong?.songId === track.id && isPlaying) {
      pauseSong();
      return;
    }

    if (songCache[track.id]) {
      playSong(songCache[track.id]);
      return;
    }

    setLoadingSongId(track.id);
    try {
      const response = await songsApi.getPublicSampleSongs(SEED_SONGS_USER_ID, [track.id]);
      const songs = response.data?.songs || [];

      if (songs.length > 0 && songs[0].audioUrl) {
        const song = {
          songId: songs[0].songId,
          songTitle: songs[0].songTitle,
          genre: songs[0].genre,
          audioUrl: songs[0].audioUrl,
          status: songs[0].status,
          createdAt: songs[0].createdAt,
          duration: songs[0].actualDuration,
        };
        setSongCache(prev => ({ ...prev, [track.id]: song }));
        playSong(song);
      }
    } catch (error) {
      console.error('Error fetching song:', error);
    } finally {
      setLoadingSongId(null);
    }
  }, [currentSong, isPlaying, playSong, pauseSong, songCache]);

  // Auth handlers
  const handleOpenAuth = useCallback(() => {
    setAuthOpen(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setError(null);
  }, []);

  const handleCloseAuth = useCallback(() => {
    setAuthOpen(false);
    setIsLoading(false);
    setIsGoogleLoading(false);
  }, []);

  const handleEmailLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password) {
        setError('Please enter your email and password');
        setIsLoading(false);
        return;
      }

      const result = await login(email, password);
      if (result.type === 'auth/login/fulfilled') {
        handleCloseAuth();
        navigate('/my-music');
      } else {
        setError(result.payload || 'Login failed');
      }
    } catch (err: any) {
      setError(authError || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, [login, email, password, authError, handleCloseAuth, navigate]);

  const handleEmailSignup = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password || !username) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be 8+ chars with uppercase, number, and special character');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const result = await signup(email, password, username);
      if (result.type.endsWith('/fulfilled')) {
        handleCloseAuth();
      } else {
        setError(result.payload || 'Signup failed');
      }
    } catch (err: any) {
      setError(authError || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  }, [signup, email, password, confirmPassword, username, authError, handleCloseAuth]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);

      const accessToken = await getGoogleIdToken();
      const result = await googleLogin(accessToken);

      if (result.type === 'auth/loginWithGoogle/fulfilled') {
        const userData = result.payload.user;
        if (!userData.isVerified) {
          await resendVerificationEmail(userData.email);
        } else {
          navigate('/my-music');
        }
        handleCloseAuth();
      } else {
        setError(result.payload || 'Google login failed');
      }
    } catch (err: any) {
      if (err.error === 'popup_closed_by_user') {
        setError('Google sign-in was cancelled');
      } else {
        setError(authError || 'Google sign-in failed');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }, [googleLogin, getGoogleIdToken, resendVerificationEmail, navigate, handleCloseAuth, authError]);

  return (
    <Box sx={{ minHeight: '100vh', background: '#0D0D0F' }}>
      <SEO
        title="AI Music Generator | Create Songs in 32 Genres | Gruvi"
        description="Create AI-generated music in any genre. Pop, Hip-Hop, Rock, Jazz, Classical, Electronic, and more. 100% original songs with commercial license."
        keywords="AI music generator, AI song creator, create music with AI, pop music AI, hip hop AI, rock music AI, jazz AI, classical AI"
        ogTitle="AI Music Generator | 32 Genres | Gruvi"
        ogDescription="Create AI-generated songs in any genre. 100% original music with commercial license."
        ogType="website"
        ogUrl="https://gruvimusic.com/ai-music"
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 20 },
          pb: { xs: 10, md: 16 },
          background: 'linear-gradient(180deg, #0D0D0F 0%, #0A0E18 30%, #101828 60%, #152038 100%)',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Gradient orbs */}
        <Box sx={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          width: '50%',
          height: '70%',
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '0%',
          right: '5%',
          width: '40%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="AI Music Generation"
                size="small"
                sx={{
                  mb: 3,
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#3B82F6',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  height: 32,
                  borderRadius: '100px',
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.75rem', sm: '3.5rem', md: '4.25rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 3,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                }}
              >
                Create Music in{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Any Genre
                </Box>
                {' '}with AI
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: '540px',
                }}
              >
                Generate original songs in seconds. 32 genres, 24 languages. Every track is 100% yours with a commercial license included.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => isLoggedIn ? navigate('/create/music') : handleOpenAuth()}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                    color: '#fff',
                    px: 4,
                    py: 1.75,
                    borderRadius: '100px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(59, 130, 246, 0.5)',
                    },
                  }}
                >
                  Start Creating Free
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => document.getElementById('explore-tracks')?.scrollIntoView({ behavior: 'smooth' })}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    px: 4,
                    py: 1.75,
                    borderRadius: '100px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  Listen to Samples
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="img"
                  src="/gruvi/gruvi-create-music.png"
                  alt="Gruvi AI Music Creation"
                  sx={{
                    width: '100%',
                    maxWidth: 380,
                    height: 'auto',
                    filter: 'drop-shadow(0 30px 60px rgba(59, 130, 246, 0.3))',
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-15px)' },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
        <SectionDivider />
      </Box>

      {/* Featured Tracks Section - Gradient transition */}
      <Box
        ref={featuredRef}
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #152038 0%, #0E1525 40%, #0A0E18 60%, #0E1525 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 800,
                color: '#fff',
                mb: 2,
              }}
            >
              Featured Tracks
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '500px', mx: 'auto' }}>
              Hand-picked AI-generated songs showcasing our best work
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {featuredTracks.map((track, index) => {
              const isCurrentSong = currentSong?.songId === track.id;
              const isThisPlaying = isCurrentSong && isPlaying;
              const isLoadingThis = loadingSongId === track.id;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={track.id}>
                  <Box
                    onClick={() => handlePlayTrack(track)}
                    sx={{
                      position: 'relative',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      transition: 'background 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      // Start at opacity 0, animate to visible when inView
                      opacity: 0,
                      transform: 'translateY(30px)',
                      ...(featuredInView && {
                        animation: `fadeInUp 0.5s ease ${index * 100}ms forwards`,
                      }),
                      '@keyframes fadeInUp': {
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        background: 'rgba(255,255,255,0.06)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                        '& .play-overlay': { opacity: 1 },
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', aspectRatio: '1' }}>
                      <Box
                        component="img"
                        src={genreToImage[track.genre] || '/genres/pop.jpeg'}
                        alt={track.genre}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Box
                        className="play-overlay"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: isThisPlaying ? 1 : 0,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        {isLoadingThis ? (
                          <CircularProgress size={40} sx={{ color: '#3B82F6' }} />
                        ) : isThisPlaying ? (
                          <AudioEqualizer isPlaying={true} size={40} color="#3B82F6" />
                        ) : (
                          <Box sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
                          }}>
                            <PlayArrowRoundedIcon sx={{ fontSize: 36, color: '#fff', ml: 0.5 }} />
                          </Box>
                        )}
                      </Box>
                      <Chip
                        label="Featured"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          color: '#000',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                    <Box sx={{ p: 2.5 }}>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff', mb: 0.5 }}>
                        {track.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '0.85rem', color: '#3B82F6', textTransform: 'capitalize' }}>
                          {track.genre}
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                          {track.duration}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <SectionDivider />
      </Box>

      {/* Why Choose Gruvi - Feature Cards with Mascot */}
      <Box
        ref={whyRef}
        sx={{
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(180deg, #0E1525 0%, #121A2D 40%, #182540 60%, #121A2D 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component="img"
                src="/gruvi/gruvi-my-music.png"
                alt="Gruvi Music Library"
                sx={{
                  width: '100%',
                  maxWidth: 350,
                  height: 'auto',
                  mx: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 20px 40px rgba(139, 92, 246, 0.2))',
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 4,
                }}
              >
                Why Musicians Love Gruvi
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  { icon: AutoAwesomeIcon, title: 'AI-Powered Creation', desc: 'Generate unique songs from text descriptions. Our AI understands music theory and creates professional-quality tracks.', color: '#3B82F6' },
                  { icon: VerifiedIcon, title: '100% Copyright Free', desc: 'Every song you create is yours to use commercially. No royalties, no licensing fees, full ownership.', color: '#8B5CF6' },
                  { icon: SpeedIcon, title: 'Ready in Seconds', desc: 'From idea to finished track in under a minute. Create, iterate, and perfect your sound instantly.', color: '#FF6B9D' },
                  { icon: LanguageIcon, title: '24 Languages', desc: 'Generate lyrics and vocals in English, Spanish, Japanese, Korean, and 20+ more languages.', color: '#FFB347' },
                ].map((feature, index) => (
                  <Box
                    key={feature.title}
                    sx={{
                      display: 'flex',
                      gap: 3,
                      p: 3,
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'background 0.3s ease, border-color 0.3s ease',
                      // Start at opacity 0, animate to visible when inView
                      opacity: 0,
                      transform: 'translateX(30px)',
                      ...(whyInView && {
                        animation: `slideIn 0.5s ease ${index * 100}ms forwards`,
                      }),
                      '@keyframes slideIn': {
                        to: { opacity: 1, transform: 'translateX(0)' },
                      },
                      '&:hover': {
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: `${feature.color}40`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: '14px',
                        background: `${feature.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <feature.icon sx={{ color: feature.color, fontSize: 26 }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem', mb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        {feature.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
        <SectionDivider />
      </Box>

      {/* Create Music in Any Genre */}
      <Box
        ref={genresRef}
        sx={{
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(180deg, #121A2D 0%, #0E1525 40%, #0A0E18 60%, #0E1828 100%)',
          position: 'relative',
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '30%',
          height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(255, 107, 157, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="32 Genres"
              size="small"
              sx={{ mb: 2, background: 'rgba(255, 107, 157, 0.15)', color: '#FF6B9D', fontWeight: 600 }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 800,
                color: '#fff',
                mb: 2,
              }}
            >
              Create Music in Any Genre
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', mx: 'auto' }}>
              From chart-topping Pop to intricate Classical compositions. Our AI masters every style.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {genreShowcase.map((genre, index) => (
              <Grid size={{ xs: 6, sm: 4, md: 2 }} key={genre.id}>
                <Box
                  onClick={() => { setSelectedGenre(genre.id); document.getElementById('explore-tracks')?.scrollIntoView({ behavior: 'smooth' }); }}
                  sx={{
                    p: 3,
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, ${genre.color}15 0%, ${genre.color}05 100%)`,
                    border: `1px solid ${genre.color}30`,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                    // Start at opacity 0, animate to visible when inView
                    opacity: 0,
                    transform: 'scale(0.9)',
                    ...(genresInView && {
                      animation: `pop 0.4s ease ${index * 50}ms forwards`,
                    }),
                    '@keyframes pop': {
                      to: { opacity: 1, transform: 'scale(1)' },
                    },
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.02)',
                      boxShadow: `0 20px 40px ${genre.color}20`,
                      borderColor: `${genre.color}60`,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={genreToImage[genre.id] || '/genres/pop.jpeg'}
                    alt={genre.name}
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '16px',
                      objectFit: 'cover',
                      mb: 2,
                      boxShadow: `0 8px 20px ${genre.color}30`,
                    }}
                  />
                  <Typography sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                    {genre.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
        <SectionDivider />
      </Box>

      {/* Upload Your Own Music Section */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(180deg, #0E1828 0%, #142035 40%, #1A2845 60%, #142035 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Upload & Distribute"
                size="small"
                sx={{ mb: 2, background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 3,
                }}
              >
                Already Have Music?{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Upload It
                </Box>
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', lineHeight: 1.7, mb: 4 }}>
                Gruvi isn't just for AI music. Upload your existing tracks and we'll turn them into engaging video content for all your social platforms.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {[
                  'Upload MP3, WAV, or any audio format',
                  'AI generates matching video visuals',
                  'One-click publish to YouTube, TikTok, Instagram',
                  'Schedule posts for optimal engagement',
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#8B5CF6' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                onClick={() => isLoggedIn ? navigate('/create/music') : handleOpenAuth()}
                startIcon={<CloudUploadIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  color: '#fff',
                  px: 4,
                  py: 1.75,
                  borderRadius: '100px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(236, 72, 153, 0.5)',
                  },
                }}
              >
                Upload Your Music
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                component="img"
                src="/gruvi/gruvi-upload-music.png"
                alt="Upload Music to Gruvi"
                sx={{
                  width: '100%',
                  maxWidth: 350,
                  height: 'auto',
                  mx: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 25px 50px rgba(139, 92, 246, 0.25))',
                }}
              />
            </Grid>
          </Grid>
        </Container>
        <SectionDivider />
      </Box>

      {/* Explore All Tracks Section */}
      <Box ref={exploreRef} id="explore-tracks" sx={{ background: 'linear-gradient(180deg, #142035 0%, #0E1525 40%, #0A0E18 60%, #0D0D0F 100%)', py: { xs: 8, md: 12 }, position: 'relative' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 800,
                color: '#fff',
                mb: 2,
              }}
            >
              Explore More Tracks
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: '550px', mx: 'auto', mb: 4 }}>
              Browse our library of AI-generated music across all genres
            </Typography>

            {/* Genre Filter */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  onClick={() => setSelectedGenre(genre.id)}
                  sx={{
                    background: selectedGenre === genre.id
                      ? 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
                      : 'rgba(255,255,255,0.08)',
                    color: selectedGenre === genre.id ? '#fff' : 'rgba(255,255,255,0.7)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    px: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: selectedGenre === genre.id
                        ? 'linear-gradient(135deg, #45B7AA 0%, #3D9480 100%)'
                        : 'rgba(255,255,255,0.12)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Tracks Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {filteredTracks.map((track, index) => {
              const isCurrentSong = currentSong?.songId === track.id;
              const isThisPlaying = isCurrentSong && isPlaying;
              const isLoadingThis = loadingSongId === track.id;

              return (
                <Box
                  key={track.id}
                  onClick={() => handlePlayTrack(track)}
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    // Start at opacity 0, animate to visible when inView
                    opacity: 0,
                    transform: 'translateY(20px)',
                    ...(exploreInView && {
                      animation: `fadeInUp 0.4s ease ${Math.min(index, 10) * 30}ms forwards`,
                    }),
                    '@keyframes fadeInUp': {
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      background: 'rgba(255,255,255,0.07)',
                      borderColor: 'rgba(59, 130, 246, 0.3)',
                      '& .play-overlay': { opacity: 1 },
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', aspectRatio: '1' }}>
                    <Box
                      component="img"
                      src={genreToImage[track.genre] || '/genres/pop.jpeg'}
                      alt={track.genre}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Box
                      className="play-overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isThisPlaying ? 1 : 0,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      {isLoadingThis ? (
                        <CircularProgress size={32} sx={{ color: '#3B82F6' }} />
                      ) : isThisPlaying ? (
                        <AudioEqualizer isPlaying={true} size={32} color="#3B82F6" />
                      ) : (
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <PlayArrowRoundedIcon sx={{ fontSize: 28, color: '#1D1D1F', ml: 0.3 }} />
                        </Box>
                      )}
                    </Box>
                    <Chip
                      label={track.genre}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 22,
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: '#fff',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {track.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                      {track.duration}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Container>
        <SectionDivider />
      </Box>

      {/* CTA Section */}
      <CTASection
        title="Ready to Create Your Own Music?"
        subtitle="Start generating AI music in any genre. No musical experience required."
        primaryButtonText="Create Music Now"
        primaryButtonAction={() => isLoggedIn ? navigate('/create/music') : handleOpenAuth()}
        variant="dark"
      />

      {/* Auth Modal */}
      <Dialog
        open={authOpen}
        onClose={handleCloseAuth}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: '#1D1D1F',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.25rem' }}>
            {authTab === 0 ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <IconButton onClick={handleCloseAuth} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={authTab}
            onChange={(_, v) => { setAuthTab(v); setError(null); }}
            sx={{
              mb: 3,
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 600 },
              '& .Mui-selected': { color: '#3B82F6' },
              '& .MuiTabs-indicator': { backgroundColor: '#3B82F6' },
            }}
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && (
            <Typography sx={{ color: '#FF6B6B', fontSize: '0.85rem', mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {authTab === 1 && (
              <TextField
                fullWidth
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  },
                }}
              />
            )}
            <TextField
              fullWidth
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                },
              }}
            />
            <TextField
              fullWidth
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  color: '#fff',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                },
              }}
            />
            {authTab === 1 && (
              <TextField
                fullWidth
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                  },
                }}
              />
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={authTab === 0 ? handleEmailLogin : handleEmailSignup}
              disabled={isLoading}
              sx={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (authTab === 0 ? 'Log In' : 'Sign Up')}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 1 }}>
              <Box sx={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>or</Typography>
              <Box sx={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            </Box>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              startIcon={isGoogleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              Continue with Google
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Global Audio Player */}
      <GlobalAudioPlayer />
    </Box>
  );
};

export default AIMusicPage;
