import React, { useState, useCallback, useRef } from 'react';
import Lottie from 'react-lottie';
import cloudBlueAnimationData from '../assets/animations/cloud-blue.json';
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
  Paper,
  useMediaQuery,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { MarketingHeader, CTASection } from '../components/marketing';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';

// Owner user ID for the seed songs
const SEED_SONGS_USER_ID = 'b1b35a41-efb4-4f79-ad61-13151294940d';

// Genre to image mapping
const genreToImage: Record<string, string> = {
  'indie': '/genres/indie.png',
  'chillout': '/genres/chill.png',
  'chill': '/genres/chill.png',
  'hip-hop': '/genres/hip-hop.png',
  'pop': '/genres/pop.png',
  'kpop': '/genres/kpop.png',
  'jpop': '/genres/jpop.png',
  'dance': '/genres/dance.png',
  'gospel': '/genres/gospels.png',
  'ambient': '/genres/ambient.png',
  'lofi': '/genres/lofi.png',
  'house': '/genres/house.png',
  'tropical-house': '/genres/house.png', // Uses house image for now
  'metal': '/genres/metal.png',
  'jazz': '/genres/jazz.png',
  'blues': '/genres/blues.png',
  'soul': '/genres/soul.png',
  'rnb': '/genres/rnb.png',
  'funk': '/genres/funk.png',
  'classical': '/genres/classical.png',
  'orchestral': '/genres/orchestral.png',
  'cinematic': '/genres/cinematic.png',
  'country': '/genres/country.png',
  'folk': '/genres/folk.png',
  'acoustic': '/genres/acoustic.png',
  'rock': '/genres/rock.png',
  'latin': '/genres/latin.png',
  'reggaeton': '/genres/raggaeton.png',
  'reggae': '/genres/raggae.png',
  'electronic': '/genres/electronic.png',
  'alternative': '/genres/alternative.png',
  'punk': '/genres/punk.png',
  'edm': '/genres/edm.png',
  'techno': '/genres/techno.png',
};

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

// Split tracks: first half for Featured, second half for Explore
const featuredTracks = sampleTracks.slice(0, Math.ceil(sampleTracks.length / 2));
const exploreTracks = sampleTracks.slice(Math.ceil(sampleTracks.length / 2));

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
  { id: 'hip-hop', name: 'Hip Hop', color: '#9D4EDD' },
  { id: 'rnb', name: 'R&B', color: '#A855F7' },
  { id: 'electronic', name: 'Electronic', color: '#00D9FF' },
  { id: 'dance', name: 'Dance', color: '#FF1493' },
  { id: 'house', name: 'House', color: '#00CED1' },
  { id: 'edm', name: 'EDM', color: '#7B68EE' },
  { id: 'techno', name: 'Techno', color: '#8A2BE2' },
  { id: 'rock', name: 'Rock', color: '#FF4757' },
  { id: 'alternative', name: 'Alternative', color: '#DC143C' },
  { id: 'indie', name: 'Indie', color: '#B8860B' },
  { id: 'punk', name: 'Punk', color: '#FF6347' },
  { id: 'metal', name: 'Metal', color: '#2F4F4F' },
  { id: 'jazz', name: 'Jazz', color: '#FFB347' },
  { id: 'blues', name: 'Blues', color: '#4169E1' },
  { id: 'soul', name: 'Soul', color: '#CD5C5C' },
  { id: 'funk', name: 'Funk', color: '#FF8C00' },
  { id: 'classical', name: 'Classical', color: '#4ECDC4' },
  { id: 'orchestral', name: 'Orchestral', color: '#8B4513' },
  { id: 'cinematic', name: 'Cinematic', color: '#1E293B' },
  { id: 'country', name: 'Country', color: '#D4A574' },
  { id: 'folk', name: 'Folk', color: '#8B7355' },
  { id: 'acoustic', name: 'Acoustic', color: '#DEB887' },
  { id: 'latin', name: 'Latin', color: '#FF4500' },
  { id: 'reggaeton', name: 'Reggaeton', color: '#FF6B35' },
  { id: 'kpop', name: 'K-Pop', color: '#FF69B4' },
  { id: 'jpop', name: 'J-Pop', color: '#FFB7C5' },
  { id: 'reggae', name: 'Reggae', color: '#22C55E' },
  { id: 'lofi', name: 'Lo-fi', color: '#94A3B8' },
  { id: 'ambient', name: 'Ambient', color: '#06B6D4' },
  { id: 'chillout', name: 'Chill', color: '#5F9EA0' },
  { id: 'tropical-house', name: 'Tropical House', color: '#00CED1' },
  { id: 'gospel', name: 'Gospel', color: '#FFD700' },
];

// Languages - All 24 supported languages with flag images
const languages = [
  { id: 'en', name: 'English', flag: '/locales/en.png', gradient: 'linear-gradient(135deg, #3C3B6E 0%, #B22234 50%, #FFFFFF 100%)', glow: '#B22234' },
  { id: 'es', name: 'Spanish', flag: '/locales/es.png', gradient: 'linear-gradient(135deg, #AA151B 0%, #F1BF00 50%, #AA151B 100%)', glow: '#F1BF00' },
  { id: 'fr', name: 'French', flag: '/locales/fr.png', gradient: 'linear-gradient(135deg, #002395 0%, #FFFFFF 50%, #ED2939 100%)', glow: '#E8E8FF' },
  { id: 'de', name: 'German', flag: '/locales/de.png', gradient: 'linear-gradient(135deg, #000000 0%, #DD0000 50%, #FFCE00 100%)', glow: '#FFCE00' },
  { id: 'it', name: 'Italian', flag: '/locales/it.png', gradient: 'linear-gradient(135deg, #009246 0%, #FFFFFF 50%, #CE2B37 100%)', glow: '#009246' },
  { id: 'pt', name: 'Portuguese', flag: '/locales/pt.png', gradient: 'linear-gradient(135deg, #006600 0%, #FF0000 50%, #FFCC00 100%)', glow: '#FF0000' },
  { id: 'nl', name: 'Dutch', flag: '/locales/nl.png', gradient: 'linear-gradient(135deg, #AE1C28 0%, #FFFFFF 50%, #21468B 100%)', glow: '#AE1C28' },
  { id: 'pl', name: 'Polish', flag: '/locales/pl.png', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #DC143C 100%)', glow: '#DC143C' },
  { id: 'ro', name: 'Romanian', flag: '/locales/ro.png', gradient: 'linear-gradient(135deg, #002B7F 0%, #FCD116 50%, #CE1126 100%)', glow: '#FCD116' },
  { id: 'cs', name: 'Czech', flag: '/locales/cs.png', gradient: 'linear-gradient(135deg, #11457E 0%, #FFFFFF 50%, #D7141A 100%)', glow: '#E8E8FF' },
  { id: 'el', name: 'Greek', flag: '/locales/el.png', gradient: 'linear-gradient(135deg, #0D5EAF 0%, #FFFFFF 100%)', glow: '#E8E8FF' },
  { id: 'bg', name: 'Bulgarian', flag: '/locales/bg.png', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #00966E 50%, #D62612 100%)', glow: '#00966E' },
  { id: 'fi', name: 'Finnish', flag: '/locales/fi.png', gradient: 'linear-gradient(135deg, #003580 0%, #FFFFFF 100%)', glow: '#E8E8FF' },
  { id: 'uk', name: 'Ukrainian', flag: '/locales/uk.png', gradient: 'linear-gradient(135deg, #005BBB 0%, #FFD500 100%)', glow: '#FFD500' },
  { id: 'ru', name: 'Russian', flag: '/locales/ru.png', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #0039A6 50%, #D52B1E 100%)', glow: '#E8E8FF' },
  { id: 'tr', name: 'Turkish', flag: '/locales/tr.png', gradient: 'linear-gradient(135deg, #E30A17 0%, #FFFFFF 100%)', glow: '#E30A17' },
  { id: 'ar', name: 'Arabic', flag: '/locales/ar.png', gradient: 'linear-gradient(135deg, #006C35 0%, #FFFFFF 100%)', glow: '#006C35' },
  { id: 'hi', name: 'Hindi', flag: '/locales/hi.png', gradient: 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)', glow: '#FF9933' },
  { id: 'th', name: 'Thai', flag: '/locales/th.png', gradient: 'linear-gradient(135deg, #A51931 0%, #FFFFFF 50%, #2D2A4A 100%)', glow: '#A51931' },
  { id: 'vi', name: 'Vietnamese', flag: '/locales/vi.png', gradient: 'linear-gradient(135deg, #DA251D 0%, #FFFF00 100%)', glow: '#FFFF00' },
  { id: 'id', name: 'Indonesian', flag: '/locales/id.png', gradient: 'linear-gradient(135deg, #FF0000 0%, #FFFFFF 100%)', glow: '#FF0000' },
  { id: 'ja', name: 'Japanese', flag: '/locales/ja.png', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #BC002D 100%)', glow: '#BC002D' },
  { id: 'ko', name: 'Korean', flag: '/locales/ko.png', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #C60C30 50%, #003478 100%)', glow: '#C60C30' },
  { id: 'zh', name: 'Chinese', flag: '/locales/zh.png', gradient: 'linear-gradient(135deg, #DE2910 0%, #FFDE00 100%)', glow: '#FFDE00' },
];

// Mood showcase - selection of moods for the marketing page
const moodShowcase = [
  { id: 'happy', name: 'Happy', image: '/moods/happy.jpeg', color: '#FFD93D' },
  { id: 'sad', name: 'Sad', image: '/moods/sad.jpeg', color: '#5B8FB9' },
  { id: 'energetic', name: 'Energetic', image: '/moods/energetic.jpeg', color: '#FF6B35' },
  { id: 'romantic', name: 'Romantic', image: '/moods/romantic.jpeg', color: '#FF69B4' },
  { id: 'chill', name: 'Chill', image: '/moods/chill.jpeg', color: '#87CEEB' },
  { id: 'epic', name: 'Epic', image: '/moods/epic.jpeg', color: '#9B59B6' },
  { id: 'dreamy', name: 'Dreamy', image: '/moods/dreamy.jpeg', color: '#DDA0DD' },
  { id: 'dark', name: 'Dark', image: '/moods/dark.jpeg', color: '#6B46C1' },
  { id: 'uplifting', name: 'Uplifting', image: '/moods/uplifting.jpeg', color: '#27AE60' },
  { id: 'nostalgic', name: 'Nostalgic', image: '/moods/nostalgic.jpeg', color: '#D4A574' },
  { id: 'peaceful', name: 'Peaceful', image: '/moods/peacful.jpeg', color: '#98FB98' },
  { id: 'intense', name: 'Intense', image: '/moods/intense.jpeg', color: '#E74C3C' },
  { id: 'melancholic', name: 'Melancholic', image: '/moods/melancholic.jpeg', color: '#7F8C8D' },
  { id: 'playful', name: 'Playful', image: '/moods/playful.jpeg', color: '#F39C12' },
  { id: 'mysterious', name: 'Mysterious', image: '/moods/mysterious.jpeg', color: '#8E44AD' },
  { id: 'triumphant', name: 'Triumphant', image: '/moods/triumphant.jpeg', color: '#F1C40F' },
  { id: 'promotional', name: 'Promotional', image: '/moods/promotional.jpeg', color: '#3498DB' },
];

// Language sample tracks - using actual multilingual track IDs from LanguageDetailPage
const languageSampleTracks: Record<string, Array<{id: string; title: string; duration: string}>> = {
  'english': [{ id: 'ca9e75ed-551e-4f0e-b939-2130ac0fcdc3', title: 'Wide Open Sky', duration: '2:19' }],
  'spanish': [{ id: '1faa7d07-51ef-4bbd-841c-67d0e78a1add', title: 'Fuego en la Piel', duration: '1:38' }],
  'french': [{ id: 'a67bee12-fab5-45ef-aa3a-1c846c60e4d9', title: 'Sous le Ciel de Paris', duration: '2:21' }],
  'german': [{ id: '72b806e0-ff44-4385-ab26-c27c328fc0dc', title: 'Unbezwingbar', duration: '2:17' }],
  'japanese': [{ id: '2ea32de2-7ed0-44bf-8130-d418e10926e4', title: '桜の約束', duration: '2:18' }],
  'korean': [{ id: '9488d94b-e493-4a45-9813-fbcb111185cd', title: '첫눈에 (At First Sight)', duration: '2:09' }],
  'chinese': [{ id: '074cf19a-cb08-428a-9f0b-32f1560eff70', title: '月光下的誓言', duration: '2:36' }],
  'portuguese': [{ id: 'aedc9a75-0796-4355-9f13-cdb3a55ea37e', title: 'Onde o Mar Me Espera', duration: '2:13' }],
  'italian': [{ id: '80470df4-8d6d-4049-a208-4adf3489e4b2', title: 'Sei Tu L\'Amore Vero', duration: '3:09' }],
  'hindi': [{ id: '98e7a1f5-d7c1-4c58-afe8-b9f4e7e3cee9', title: 'Tere Bina Adhura', duration: '2:14' }],
  'arabic': [{ id: '7213cafe-3f48-4dd5-82c1-4dd1795467d3', title: 'قلبي معاك', duration: '1:57' }],
  'russian': [{ id: '3e05a0a9-a3a6-465b-8156-b1e8afd69588', title: 'Огни Москвы', duration: '2:38' }],
  'turkish': [{ id: '05714691-b94e-474a-b7a1-7ff90fbeba2b', title: 'Sensiz Olamam', duration: '2:34' }],
  'thai': [{ id: 'df7effc0-2628-41fd-a522-ffb64cc25a06', title: 'รักแรกพบ', duration: '2:35' }],
  'vietnamese': [{ id: '771d81bd-b99f-4ebb-bae7-3ce05013f134', title: 'Lần Đầu Yêu', duration: '2:13' }],
};

// Language display order for the carousel
const languageOrder = ['english', 'spanish', 'french', 'german', 'japanese', 'korean', 'chinese', 'portuguese', 'italian', 'hindi', 'arabic', 'russian', 'turkish', 'thai', 'vietnamese'];

// Language name to flag image path mapping
const languageToFlag: Record<string, string> = {
  'english': '/locales/en.png', 'spanish': '/locales/es.png', 'french': '/locales/fr.png', 'german': '/locales/de.png',
  'japanese': '/locales/ja.png', 'korean': '/locales/ko.png', 'chinese': '/locales/zh.png', 'portuguese': '/locales/pt.png',
  'italian': '/locales/it.png', 'hindi': '/locales/hi.png', 'arabic': '/locales/ar.png', 'russian': '/locales/ru.png',
  'turkish': '/locales/tr.png', 'thai': '/locales/th.png', 'vietnamese': '/locales/vi.png',
};

// Function to get language tracks
function getLanguageTracksForRoute(): Array<{id: string; title: string; language: string; duration: string; flag: string}> {
  return languageOrder.map(lang => {
    const track = languageSampleTracks[lang][0];
    const langName = lang.charAt(0).toUpperCase() + lang.slice(1);
    const flag = languageToFlag[lang] || '🌍';
    return { ...track, language: langName, flag };
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

// Dark-themed ScrollableCarousel component
interface ScrollableCarouselProps {
  id: string;
  children: React.ReactNode;
}

const ScrollableCarousel: React.FC<ScrollableCarouselProps> = ({ id, children }) => {
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);
  const [maskImage, setMaskImage] = React.useState('linear-gradient(to right, black 0%, black 95%, transparent 100%)');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const checkScrollPosition = React.useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtStart = scrollLeft <= 10;
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;

      setShowLeftArrow(!isAtStart);
      setShowRightArrow(!isAtEnd);

      // Build dynamic mask like HomePage
      let mask = 'linear-gradient(to right, ';
      if (isAtStart) {
        mask += 'black 0%, black 95%, transparent 100%)';
      } else if (isAtEnd) {
        mask += 'transparent 0%, black 5%, black 100%)';
      } else {
        mask += 'transparent 0%, black 5%, black 95%, transparent 100%)';
      }
      setMaskImage(mask);
    }
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      checkScrollPosition();
      setTimeout(checkScrollPosition, 100);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [checkScrollPosition]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'visible' }}>
      {showLeftArrow && (
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '50%',
            boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
            width: 40,
            height: 40,
            animation: 'pulseOutBlue 2.5s ease-out infinite',
            '@keyframes pulseOutBlue': {
              '0%': {
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
              },
              '100%': {
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 12px rgba(59, 130, 246, 0)',
              },
            },
            '&:hover': {
              background: 'rgba(59, 130, 246, 0.15)',
              border: '2px solid rgba(96, 165, 250, 0.6)',
              transform: 'translateY(-50%) scale(1.05)',
              animation: 'none',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.5)',
            },
          }}
        >
          <ChevronLeftIcon sx={{ color: '#3B82F6' }} />
        </IconButton>
      )}
      {showRightArrow && (
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '50%',
            boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
            width: 40,
            height: 40,
            animation: 'pulseOutBlue 2.5s ease-out infinite',
            '@keyframes pulseOutBlue': {
              '0%': {
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
              },
              '100%': {
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 12px rgba(59, 130, 246, 0)',
              },
            },
            '&:hover': {
              background: 'rgba(59, 130, 246, 0.15)',
              border: '2px solid rgba(96, 165, 250, 0.6)',
              transform: 'translateY(-50%) scale(1.05)',
              animation: 'none',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.5)',
            },
          }}
        >
          <ChevronRightIcon sx={{ color: '#3B82F6' }} />
        </IconButton>
      )}
      <Box
        ref={containerRef}
        id={id}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          px: 1,
          py: 1,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// Genre Carousel Component - Similar to Fable's MusicalCarousel with drag support
interface GenreCarouselProps {
  genres: Array<{ id: string; name: string; color: string }>;
  genreToImage: Record<string, string>;
  onGenreClick: (id: string) => void;
}

const GenreCarousel: React.FC<GenreCarouselProps> = ({ genres, genreToImage, onGenreClick }) => {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(genres.length / 2));

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + genres.length) % genres.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % genres.length);
  };

  const getItemPosition = (index: number) => {
    const diff = (index - currentIndex + genres.length) % genres.length;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === genres.length - 1) return 'left';
    if (diff === 2) return 'far-right';
    if (diff === genres.length - 2) return 'far-left';
    return 'hidden';
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1100px', margin: '0 auto', py: 4, pt:0 }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: '320px', sm: '360px', md: '420px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {genres.map((genre, index) => {
          const position = getItemPosition(index);
          const isCenter = position === 'center';
          const isLeft = position === 'left';
          const isRight = position === 'right';
          const isFarLeft = position === 'far-left';
          const isFarRight = position === 'far-right';
          const isVisible = position !== 'hidden';

          return (
            <Box
              key={genre.id}
              onClick={() => isCenter && onGenreClick(genre.id)}
              sx={{
                position: 'absolute',
                width: isCenter
                  ? { xs: '220px', sm: '260px', md: '300px' }
                  : (isLeft || isRight)
                  ? { xs: '170px', sm: '200px', md: '230px' }
                  : { xs: '130px', sm: '150px', md: '170px' },
                cursor: isCenter ? 'pointer' : 'default',
                transition: 'all 0.4s ease-out',
                transform: `translateX(${
                  isCenter
                    ? 0
                    : isLeft
                    ? -180
                    : isRight
                    ? 180
                    : isFarLeft
                    ? -340
                    : isFarRight
                    ? 340
                    : 0
                }px) scale(${isCenter ? 1 : (isLeft || isRight) ? 0.85 : 0.7})`,
                opacity: isCenter ? 1 : (isLeft || isRight) ? 0.7 : (isFarLeft || isFarRight) ? 0.4 : 0,
                zIndex: isCenter ? 10 : (isLeft || isRight) ? 5 : 1,
                pointerEvents: isCenter ? 'auto' : 'none',
                display: isVisible ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Glow effect behind selected record */}
              {isCenter && (
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${genre.color}50 0%, ${genre.color}25 50%, transparent 70%)`,
                    filter: 'blur(25px)',
                    animation: 'glowPulse 3s ease-in-out infinite',
                    '@keyframes glowPulse': {
                      '0%, 100%': { opacity: 0.7, transform: 'scale(1)' },
                      '50%': { opacity: 1, transform: 'scale(1.08)' },
                    },
                  }}
                />
              )}
              {/* Vinyl image with subtle white glow */}
              <Box
                component="img"
                src={genreToImage[genre.id] || '/genres/pop.png'}
                alt={genre.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  filter: isCenter
                    ? `drop-shadow(0 8px 24px ${genre.color}60) drop-shadow(0 0 3px rgba(255,255,255,0.5))`
                    : 'drop-shadow(0 4px 12px rgba(0,0,0,0.4)) drop-shadow(0 0 2px rgba(255,255,255,0.3))',
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  color: '#fff',
                  mt: 1.5,
                  fontSize: isCenter
                    ? { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                    : { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                  textAlign: 'center',
                  opacity: isCenter ? 1 : 0.7,
                  transition: 'all 0.4s ease',
                }}
              >
                {genre.name}
              </Typography>
            </Box>
          );
        })}

        {/* Navigation Arrows */}
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: { xs: 8, sm: 20, md: 40 },
            zIndex: 20,
            background: 'rgba(59, 130, 246, 0.25)',
            border: '2px solid rgba(96, 165, 250, 0.5)',
            color: '#60A5FA',
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'rgba(59, 130, 246, 0.4)',
              border: '2px solid rgba(96, 165, 250, 0.8)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            },
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: { xs: 8, sm: 20, md: 40 },
            zIndex: 20,
            background: 'rgba(59, 130, 246, 0.25)',
            border: '2px solid rgba(96, 165, 250, 0.5)',
            color: '#60A5FA',
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'rgba(59, 130, 246, 0.4)',
              border: '2px solid rgba(96, 165, 250, 0.8)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            },
          }}
        >
          <ChevronRightIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
        </IconButton>
      </Box>

      {/* Dots Indicator */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 0.75,
          mt: 2,
          flexWrap: 'wrap',
          maxWidth: '80%',
          mx: 'auto',
        }}
      >
        {genres.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: index === currentIndex ? 20 : 6,
              height: 6,
              borderRadius: '3px',
              background: index === currentIndex ? '#3B82F6' : 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: index === currentIndex ? '#60A5FA' : 'rgba(255, 255, 255, 0.5)',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const AIMusicPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;
  const { currentSong, isPlaying, playSong, pauseSong } = useAudioPlayer();
  const { login, signup, googleLogin, getGoogleIdToken, resendVerificationEmail, error: authError } = useAuth();

  // Scroll-triggered animation refs
  const { ref: featuredRef } = useInView({ threshold: 0.1 });
  const { ref: whyRef, inView: whyInView } = useInView({ threshold: 0.1 });
  const { ref: genresRef } = useInView({ threshold: 0.1 });
  const { ref: languagesRef, inView: languagesInView } = useInView({ threshold: 0.1 });
  const { ref: moodsRef } = useInView({ threshold: 0.1 });
  const { ref: exploreRef } = useInView({ threshold: 0.1 });

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

  // Filter tracks by genre (for Explore section - second half of tracks)
  const filteredTracks = selectedGenre === 'all'
    ? exploreTracks
    : exploreTracks.filter(t => t.genre === selectedGenre);

  // Handle play button click - now accepts optional playlist for next/previous navigation
  const handlePlayTrack = useCallback(async (
    track: { id: string; title: string; genre: string; duration: string },
    playlist?: { id: string; title: string; genre: string; duration: string }[]
  ) => {
    if (currentSong?.songId === track.id && isPlaying) {
      pauseSong();
      return;
    }

    // Build the full songs list from cache + fetch missing
    const buildPlaylist = async () => {
      if (!playlist || playlist.length === 0) return undefined;

      // Get all song IDs that aren't in cache
      const uncachedIds = playlist.filter(t => !songCache[t.id]).map(t => t.id);

      // Fetch all uncached songs in one request
      if (uncachedIds.length > 0) {
        try {
          const response = await songsApi.getPublicSampleSongs(SEED_SONGS_USER_ID, uncachedIds);
          const fetchedSongs = response.data?.songs || [];

          // Add fetched songs to cache
          const newCacheEntries: Record<string, any> = {};
          fetchedSongs.forEach((s: any) => {
            if (s.audioUrl) {
              newCacheEntries[s.songId] = {
                songId: s.songId,
                songTitle: s.songTitle,
                genre: s.genre,
                audioUrl: s.audioUrl,
                status: s.status,
                createdAt: s.createdAt,
                duration: s.actualDuration,
              };
            }
          });
          setSongCache(prev => ({ ...prev, ...newCacheEntries }));

          // Build full playlist from cache + newly fetched
          return playlist
            .map(t => songCache[t.id] || newCacheEntries[t.id])
            .filter(Boolean);
        } catch (error) {
          console.error('Error fetching playlist songs:', error);
          return undefined;
        }
      }

      // All songs are already cached
      return playlist.map(t => songCache[t.id]).filter(Boolean);
    };

    if (songCache[track.id]) {
      const allSongs = await buildPlaylist();
      playSong(songCache[track.id], allSongs);
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
        const allSongs = await buildPlaylist();
        playSong(song, allSongs);
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
    <Box sx={{ minHeight: '100vh', background: '#0D0D0F', overflowX: 'hidden' }}>
      <SEO
        title="AI Music Generator | Create Songs in 32 Genres | Gruvi"
        description="Create AI-generated music in any genre. Pop, Hip-Hop, Rock, Jazz, Classical, Electronic, and more. 100% original songs with commercial license."
        keywords="AI music generator, AI song creator, create music with AI, pop music AI, hip hop AI, rock music AI, jazz AI, classical AI"
        ogTitle="AI Music Generator | 32 Genres | Gruvi"
        ogDescription="Create AI-generated songs in any genre. 100% original music with commercial license."
        ogType="website"
        ogUrl="https://gruvimusic.com/ai-music"
        structuredData={[createBreadcrumbStructuredData([
          { name: 'Home', url: 'https://gruvimusic.com' },
          { name: 'AI Music Generator', url: 'https://gruvimusic.com/ai-music' }
        ])]}
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
                  borderRadius: '12px',
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
                Generate original songs in seconds. 32 genres, 24 languages. Your music, your rights — use it anywhere you want.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => isLoggedIn ? navigate('/create/music') : handleOpenAuth()}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%) !important',
                    color: '#fff',
                    px: 4,
                    py: 1.75,
                    borderRadius: '12px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4F91F7 0%, #18C5D9 100%) !important',
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
                    borderColor: '#00D4AA !important',
                    borderWidth: '2px !important',
                    color: '#FFFFFF !important',
                    backgroundColor: 'transparent !important',
                    px: 4,
                    py: 1.75,
                    borderRadius: '12px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.05rem',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: '#00D4AA !important',
                      borderWidth: '2px !important',
                      color: '#FFFFFF !important',
                      backgroundColor: 'rgba(0, 212, 170, 0.1) !important',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 16px rgba(0, 212, 170, 0.3)',
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
                {/* Animated stars and shimmer background */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                    pointerEvents: 'none',
                  }}
                >
                  {/* 4-point stars using SVG */}
                  {[
                    { top: '5%', left: '10%', size: 24, delay: 0 },
                    { top: '15%', right: '5%', size: 18, delay: 0.5 },
                    { top: '70%', left: '5%', size: 16, delay: 1.2 },
                    { top: '80%', right: '15%', size: 20, delay: 0.8 },
                    { top: '25%', left: '0%', size: 14, delay: 1.5 },
                    { top: '60%', right: '0%', size: 17, delay: 0.3 },
                  ].map((star, i) => (
                    <Box
                      key={`star-${i}`}
                      component="svg"
                      viewBox="0 0 24 24"
                      sx={{
                        position: 'absolute',
                        top: star.top,
                        left: star.left,
                        right: star.right,
                        width: star.size,
                        height: star.size,
                        fill: '#60A5FA',
                        filter: 'drop-shadow(0 0 4px rgba(96, 165, 250, 0.8))',
                        animation: `starTwinkle 2.5s ease-in-out ${star.delay}s infinite`,
                        '@keyframes starTwinkle': {
                          '0%, 100%': { opacity: 0.5, transform: 'scale(0.7)' },
                          '50%': { opacity: 1, transform: 'scale(1.1)' },
                        },
                      }}
                    >
                      <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
                    </Box>
                  ))}
                  {/* Shimmering dots */}
                  {[
                    { top: '10%', left: '25%', delay: 0.2 },
                    { top: '20%', right: '20%', delay: 0.7 },
                    { top: '35%', left: '8%', delay: 1.1 },
                    { top: '45%', right: '8%', delay: 0.4 },
                    { top: '55%', left: '15%', delay: 1.6 },
                    { top: '65%', right: '25%', delay: 0.9 },
                    { top: '75%', left: '20%', delay: 1.3 },
                    { top: '85%', right: '10%', delay: 0.1 },
                    { top: '30%', left: '2%', delay: 1.8 },
                    { top: '50%', right: '2%', delay: 0.6 },
                  ].map((dot, i) => (
                    <Box
                      key={`dot-${i}`}
                      sx={{
                        position: 'absolute',
                        top: dot.top,
                        left: dot.left,
                        right: dot.right,
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#93C5FD',
                        boxShadow: '0 0 6px 2px rgba(147, 197, 253, 0.6)',
                        animation: `dotShimmer 1.5s ease-in-out ${dot.delay}s infinite`,
                        '@keyframes dotShimmer': {
                          '0%, 100%': { opacity: 0.3, transform: 'scale(0.5)' },
                          '50%': { opacity: 1, transform: 'scale(1.5)' },
                        },
                      }}
                    />
                  ))}
                </Box>
                <Box
                  component="img"
                  src="/landing/disco.png"
                  alt="AI Music disco ball"
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    height: 'auto',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
        <SectionDivider />
      </Box>

      {/* Featured Tracks Section */}
      <Box ref={featuredRef} id="featured-tracks" sx={{ background: 'linear-gradient(180deg, #152038 0%, #0E1525 40%, #0A0E18 60%, #0E1525 100%)', py: { xs: 8, md: 12 }, position: 'relative' }}>
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
              Featured Tracks
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: '550px', mx: 'auto' }}>
              A track for every vibe - see what Gruvi can do
            </Typography>
          </Box>

          {/* Featured Tracks List - ScrollableCarousel with columns of 3 */}
          <ScrollableCarousel id="featured-tracks-carousel">
            {(() => {
              // Group featured tracks into columns of 3
              const columns: typeof featuredTracks[] = [];
              for (let i = 0; i < featuredTracks.length; i += 3) {
                columns.push(featuredTracks.slice(i, i + 3));
              }
              return columns.map((columnTracks, colIndex) => (
                <Box
                  key={`featured-column-${colIndex}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  {columnTracks.map((track) => {
                    const isCurrentSong = currentSong?.songId === track.id;
                    const isThisPlaying = isCurrentSong && isPlaying;
                    const isLoadingThis = loadingSongId === track.id;

                    return (
                      <Paper
                        key={track.id}
                        elevation={0}
                        onClick={() => handlePlayTrack(track, featuredTracks)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          width: { xs: 260, sm: 290, md: 320 },
                          background: isCurrentSong
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          border: isCurrentSong
                            ? '1px solid rgba(59, 130, 246, 0.4)'
                            : '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            background: isCurrentSong
                              ? 'rgba(59, 130, 246, 0.2)'
                              : 'rgba(255,255,255,0.08)',
                            transform: 'translateY(-2px)',
                            '& .play-overlay': { opacity: 1 },
                          },
                        }}
                      >
                        {/* Album Art with white border */}
                        <Box
                          sx={{
                            position: 'relative',
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            flexShrink: 0,
                            padding: '2px',
                            background: 'rgba(255,255,255,0.85)',
                            boxShadow: '0 0 10px rgba(255,255,255,0.15)',
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              component="img"
                              src={genreToImage[track.genre] || '/genres/pop.png'}
                              alt={track.title}
                              sx={{ width: '140%', height: '140%', objectFit: 'cover', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                            />
                            {/* Play overlay */}
                            <Box
                              className="play-overlay"
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isCurrentSong ? 'rgba(59,130,246,0.5)' : 'rgba(0,0,0,0.5)',
                                opacity: isCurrentSong ? 1 : 0,
                                transition: 'opacity 0.2s',
                                borderRadius: '50%',
                              }}
                            >
                              {isLoadingThis ? (
                                <CircularProgress size={14} sx={{ color: '#fff' }} />
                              ) : isThisPlaying ? (
                                <AudioEqualizer isPlaying={true} size={14} color="#fff" />
                              ) : (
                                <PlayArrowRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
                              )}
                            </Box>
                          </Box>
                        </Box>

                        {/* Track Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: isCurrentSong ? '#3B82F6' : '#fff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {track.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              color: 'rgba(255,255,255,0.5)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              textTransform: 'capitalize',
                            }}
                          >
                            {track.genre}
                          </Typography>
                        </Box>

                        {/* Duration */}
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                          {track.duration}
                        </Typography>
                      </Paper>
                    );
                  })}
                </Box>
              ));
            })()}
          </ScrollableCarousel>
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
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                {/* Disco light beams */}
                {[
                  { angle: -30, color: '#8B5CF6', delay: 0 },
                  { angle: -15, color: '#3B82F6', delay: 0.3 },
                  { angle: 0, color: '#06B6D4', delay: 0.6 },
                  { angle: 15, color: '#EC4899', delay: 0.9 },
                  { angle: 30, color: '#F59E0B', delay: 1.2 },
                ].map((beam, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'absolute',
                      top: '10%',
                      left: '50%',
                      width: '4px',
                      height: '120%',
                      background: `linear-gradient(180deg, ${beam.color}80 0%, transparent 70%)`,
                      transformOrigin: 'top center',
                      transform: `translateX(-50%) rotate(${beam.angle}deg)`,
                      opacity: 0.4,
                      animation: `discoBeam 2s ease-in-out ${beam.delay}s infinite`,
                      '@keyframes discoBeam': {
                        '0%, 100%': { opacity: 0.2, filter: 'blur(2px)' },
                        '50%': { opacity: 0.6, filter: 'blur(4px)' },
                      },
                    }}
                  />
                ))}
                {/* Sparkle dots */}
                {[
                  { top: '5%', left: '20%', color: '#8B5CF6', delay: 0 },
                  { top: '15%', right: '15%', color: '#3B82F6', delay: 0.4 },
                  { top: '25%', left: '10%', color: '#EC4899', delay: 0.8 },
                  { top: '35%', right: '10%', color: '#06B6D4', delay: 1.2 },
                  { top: '50%', left: '5%', color: '#F59E0B', delay: 0.2 },
                  { top: '60%', right: '5%', color: '#8B5CF6', delay: 0.6 },
                  { top: '70%', left: '15%', color: '#3B82F6', delay: 1.0 },
                  { top: '80%', right: '20%', color: '#EC4899', delay: 0.5 },
                ].map((sparkle, index) => (
                  <Box
                    key={`sparkle-${index}`}
                    sx={{
                      position: 'absolute',
                      top: sparkle.top,
                      left: sparkle.left,
                      right: sparkle.right,
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: sparkle.color,
                      boxShadow: `0 0 10px 3px ${sparkle.color}80`,
                      animation: `sparkle 1.5s ease-in-out ${sparkle.delay}s infinite`,
                      '@keyframes sparkle': {
                        '0%, 100%': { opacity: 0.2, transform: 'scale(0.5)' },
                        '50%': { opacity: 1, transform: 'scale(1.2)' },
                      },
                    }}
                  />
                ))}
                {/* Lady image */}
                <Box
                  component="img"
                  src="/landing/lady.png"
                  alt="Gruvi Creator"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    position: 'relative',
                    zIndex: 1,
                    filter: 'drop-shadow(0 20px 40px rgba(139, 92, 246, 0.3))',
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 6,
                }}
              >
                Why Creators Love Gruvi
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
          background: 'linear-gradient(180deg, #121A2D 0%, #0E1525 40%, #0A1220 60%, #0C1524 100%)',
          position: 'relative',
          overflow: 'hidden',
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
          <Box sx={{ textAlign: 'center', mb: 0 }}>
            <Chip
              label="33 Genres"
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

{/* Genre Carousel */}
          <GenreCarousel genres={genreShowcase} genreToImage={genreToImage} onGenreClick={(id) => navigate(`/genres/${id}`)} />
        </Container>
        <SectionDivider />
      </Box>

      {/* Languages Section */}
      <Box
        ref={languagesRef}
        sx={{
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(180deg, #0C1524 0%, #0E1828 40%, #101C30 60%, #0E1828 100%)',
          position: 'relative',
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '30%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="24 Languages"
              size="small"
              sx={{ mb: 2, background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', fontWeight: 600 }}
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
              Create Music in Any Language
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', mx: 'auto' }}>
              Generate lyrics and vocals in 24 languages. Reach a global audience with native-quality vocals.
            </Typography>
          </Box>

          {/* Languages Grid with Flag Emojis - each with gradient container */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: { xs: 1.5, md: 2.5 },
              maxWidth: '900px',
              mx: 'auto',
              // Wind animation keyframes
              '@keyframes windWave': {
                '0%, 100%': {
                  transform: 'rotate(-3deg) skewX(-2deg)',
                },
                '25%': {
                  transform: 'rotate(2deg) skewX(3deg)',
                },
                '50%': {
                  transform: 'rotate(-2deg) skewX(-1deg)',
                },
                '75%': {
                  transform: 'rotate(3deg) skewX(2deg)',
                },
              },
            }}
          >
            {languages.map((lang, index) => {
              // Calculate row and column for staggered wind delay (left to right)
              const col = index % 9; // Approximate columns
              const row = Math.floor(index / 9);
              const windDelay = (col * 0.15) + (row * 0.3); // Stagger by column then row

              return (
              <Box
                key={lang.id}
                onClick={() => navigate(`/languages/${lang.name.toLowerCase()}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  cursor: 'pointer',
                  opacity: 0,
                  transform: 'scale(0.9)',
                  ...(languagesInView && {
                    animation: `pop 0.4s ease ${index * 30}ms forwards`,
                  }),
                  '@keyframes pop': {
                    to: { opacity: 1, transform: 'scale(1)' },
                  },
                  '&:hover': {
                    transform: 'scale(1.05)',
                    '& .lang-card': {
                      transform: 'scale(1.15)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.25)',
                    },
                    '& .lang-flag': {
                      animationPlayState: 'paused',
                      transform: 'rotate(0deg) skewX(0deg) !important',
                    },
                  },
                }}
              >
                {/* Circular glassy card with flag - iOS Control Center style */}
                <Box
                  className="lang-card"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: 56, md: 64 },
                    height: { xs: 56, md: 64 },
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '50%',
                    boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px ${lang.glow}25`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box
                    component="img"
                    src={lang.flag}
                    alt={lang.name}
                    className="lang-flag"
                    sx={{
                      width: { xs: 36, md: 42 },
                      height: { xs: 36, md: 42 },
                      objectFit: 'cover',
                      borderRadius: '50%',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                      transformOrigin: 'left center',
                      animation: `windWave 2.5s ease-in-out ${windDelay}s infinite`,
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </Box>
                {/* Language name outside the card */}
                <Typography sx={{
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 500,
                  fontSize: { xs: '0.7rem', md: '0.75rem' },
                  textAlign: 'center',
                }}>
                  {lang.name}
                </Typography>
              </Box>
              );
            })}
          </Box>

          {/* Divider between language grid and tracks carousel */}
          <Box
            sx={{
              mt: 6,
              mb: 6,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)',
            }}
          />

          {/* Language Tracks Carousel - columns of 3 */}
          <Box>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 2,
                }}
              >
                Listen to Sample Tracks
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                AI-generated songs in 15+ languages
              </Typography>
            </Box>
            <ScrollableCarousel id="language-tracks-carousel">
              {(() => {
                const languageTracks = getLanguageTracksForRoute();
                // Build playlist in the expected format for handlePlayTrack
                const languagePlaylist = languageTracks.map(t => ({
                  id: t.id,
                  title: t.title,
                  genre: t.language.toLowerCase(),
                  duration: t.duration,
                }));
                const columns: typeof languageTracks[] = [];
                for (let i = 0; i < languageTracks.length; i += 3) {
                  columns.push(languageTracks.slice(i, i + 3));
                }
                return columns.map((columnTracks, colIndex) => (
                  <Box
                    key={`lang-column-${colIndex}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    {columnTracks.map((track) => {
                      const isCurrentSong = currentSong?.songId === track.id;
                      const isThisPlaying = isCurrentSong && isPlaying;
                      const isLoadingThis = loadingSongId === track.id;

                      return (
                        <Paper
                          key={`${track.id}-${track.language}`}
                          elevation={0}
                          onClick={() => handlePlayTrack({ id: track.id, title: track.title, genre: track.language.toLowerCase(), duration: track.duration }, languagePlaylist)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            width: { xs: 260, sm: 290, md: 320 },
                            background: isCurrentSong
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            border: isCurrentSong
                              ? '1px solid rgba(59, 130, 246, 0.4)'
                              : '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            '&:hover': {
                              background: isCurrentSong
                                ? 'rgba(59, 130, 246, 0.2)'
                                : 'rgba(255,255,255,0.08)',
                              transform: 'translateY(-2px)',
                            },
                            '&:hover .lang-play-overlay': {
                              opacity: 1,
                            },
                          }}
                        >
                          {/* Language flag as album art - circular glassy */}
                          <Box
                            sx={{
                              position: 'relative',
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              overflow: 'hidden',
                              flexShrink: 0,
                              background: 'rgba(255,255,255,0.08)',
                              backdropFilter: 'blur(20px)',
                              WebkitBackdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Box
                              component="img"
                              src={track.flag}
                              alt={track.language}
                              sx={{
                                width: 28,
                                height: 28,
                                objectFit: 'cover',
                                borderRadius: '50%',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                              }}
                            />
                            {/* Play overlay */}
                            <Box
                              className="lang-play-overlay"
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isCurrentSong ? 'rgba(59,130,246,0.5)' : 'rgba(0,0,0,0.5)',
                                opacity: isCurrentSong ? 1 : 0,
                                transition: 'opacity 0.2s',
                              }}
                            >
                              {isLoadingThis ? (
                                <CircularProgress size={12} sx={{ color: '#fff' }} />
                              ) : isThisPlaying ? (
                                <AudioEqualizer isPlaying={true} size={14} color="#fff" />
                              ) : (
                                <PlayArrowRoundedIcon sx={{ fontSize: 16, color: '#fff' }} />
                              )}
                            </Box>
                          </Box>

                          {/* Track Info */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: isCurrentSong ? '#3B82F6' : '#fff',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {track.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: 'rgba(255,255,255,0.5)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {track.language}
                            </Typography>
                          </Box>

                          {/* Duration */}
                          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                            {track.duration}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Box>
                ));
              })()}
            </ScrollableCarousel>
          </Box>
        </Container>
        <SectionDivider />
      </Box>

      {/* Moods Section */}
      <Box
        ref={moodsRef}
        sx={{
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(180deg, #0E1828 0%, #101A28 40%, #0C1620 60%, #0E1828 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '25%',
          height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="17 Moods"
              size="small"
              sx={{ mb: 2, background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', fontWeight: 600 }}
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
              Set the Perfect Mood
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: '600px', mx: 'auto' }}>
              From energetic to melancholic, create music that perfectly captures any emotion.
            </Typography>
          </Box>

          {/* Swiper Coverflow Carousel for Moods */}
          <Box sx={{ width: '100%', position: 'relative' }}>
            {/* Custom Navigation Buttons - Outside masked area */}
            <IconButton
              onClick={() => {
                const swiperEl = document.querySelector('.mood-swiper') as any;
                swiperEl?.swiper?.slidePrev();
              }}
              sx={{
                position: 'absolute',
                left: { xs: 8, sm: 16 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                width: { xs: 44, md: 52 },
                height: { xs: 44, md: 52 },
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '2px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '50%',
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
                animation: 'pulseOutBlue 2.5s ease-out infinite',
                transition: 'all 0.3s ease',
                '@keyframes pulseOutBlue': {
                  '0%': {
                    boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
                  },
                  '100%': {
                    boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 12px rgba(59, 130, 246, 0)',
                  },
                },
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '2px solid rgba(96, 165, 250, 0.6)',
                  transform: 'translateY(-50%) scale(1.05)',
                  animation: 'none',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.5)',
                },
              }}
            >
              <ChevronLeftIcon sx={{ color: '#3B82F6', fontSize: { xs: 24, md: 28 } }} />
            </IconButton>

            <IconButton
              onClick={() => {
                const swiperEl = document.querySelector('.mood-swiper') as any;
                swiperEl?.swiper?.slideNext();
              }}
              sx={{
                position: 'absolute',
                right: { xs: 8, sm: 16 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                width: { xs: 44, md: 52 },
                height: { xs: 44, md: 52 },
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '2px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '50%',
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
                animation: 'pulseOutBlue 2.5s ease-out infinite',
                transition: 'all 0.3s ease',
                '@keyframes pulseOutBlue': {
                  '0%': {
                    boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
                  },
                  '100%': {
                    boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 12px rgba(59, 130, 246, 0)',
                  },
                },
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '2px solid rgba(96, 165, 250, 0.6)',
                  transform: 'translateY(-50%) scale(1.05)',
                  animation: 'none',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.5)',
                },
              }}
            >
              <ChevronRightIcon sx={{ color: '#3B82F6', fontSize: { xs: 24, md: 28 } }} />
            </IconButton>

            {/* Masked Swiper Container */}
            <Box sx={{
              '& .swiper': {
                width: '100%',
                pt: 6,
                pb: 6,
                // Apply mask to swiper only
                maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
              },
              '& .swiper-slide': {
                width: { xs: 180, sm: 220, md: 260 },
                height: { xs: 180, sm: 220, md: 260 },
              },
              '& .swiper-slide img': {
                display: 'block',
                width: '100%',
              },
            }}>
              <Swiper
                className="mood-swiper"
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                initialSlide={Math.floor(moodShowcase.length / 2)}
                loop={true}
                navigation={false}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                modules={[EffectCoverflow]}
              >
              {moodShowcase.map((mood) => (
                <SwiperSlide key={mood.id}>
                  <Box
                    onClick={() => navigate(`/moods/${mood.id}`)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '85%',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: `0 8px 24px ${mood.color}30`,
                      }}
                    >
                      <Box
                        component="img"
                        src={mood.image}
                        alt={mood.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Typography sx={{
                      fontWeight: 700,
                      color: '#fff',
                      mt: 1.5,
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      textAlign: 'center',
                    }}>
                      {mood.name}
                    </Typography>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
            </Box>
          </Box>
        </Container>
        <SectionDivider />
      </Box>

      {/* Upload Your Own Music Section */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(180deg, #0E1828 0%, #121D30 40%, #142035 60%, #101C2D 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Upload & Distribute"
                size="small"
                sx={{ mb: 2, background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', fontWeight: 600 }}
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
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
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
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                onClick={() => isLoggedIn ? navigate('/create/music') : handleOpenAuth()}
                startIcon={<CloudUploadIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%) !important',
                  color: '#fff',
                  px: 4,
                  py: 1.75,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4F91F7 0%, #18C5D9 100%) !important',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.5)',
                  },
                }}
              >
                Upload Your Music
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: cloudBlueAnimationData,
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid slice'
                    }
                  }}
                  height={350}
                  width={350}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
        <SectionDivider />
      </Box>

      {/* Explore All Tracks Section */}
      <Box ref={exploreRef} id="explore-tracks" sx={{ background: 'linear-gradient(180deg, #101C2D 0%, #0C1620 40%, #0A1018 60%, #0D0D0F 100%)', py: { xs: 8, md: 12 }, position: 'relative' }}>
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

          {/* Tracks List - ScrollableCarousel with columns of 3 */}
          <ScrollableCarousel id="explore-tracks-carousel">
            {(() => {
              // Group filtered tracks into columns of 3
              const columns: typeof filteredTracks[] = [];
              for (let i = 0; i < filteredTracks.length; i += 3) {
                columns.push(filteredTracks.slice(i, i + 3));
              }
              return columns.map((columnTracks, colIndex) => (
                <Box
                  key={`explore-column-${colIndex}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  {columnTracks.map((track) => {
                    const isCurrentSong = currentSong?.songId === track.id;
                    const isThisPlaying = isCurrentSong && isPlaying;
                    const isLoadingThis = loadingSongId === track.id;

                    return (
                      <Paper
                        key={track.id}
                        elevation={0}
                        onClick={() => handlePlayTrack(track, filteredTracks)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          p: 1.5,
                          width: { xs: 260, sm: 290, md: 320 },
                          background: isCurrentSong
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          border: isCurrentSong
                            ? '1px solid rgba(59, 130, 246, 0.4)'
                            : '1px solid rgba(255,255,255,0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            background: isCurrentSong
                              ? 'rgba(59, 130, 246, 0.2)'
                              : 'rgba(255,255,255,0.08)',
                            transform: 'translateY(-2px)',
                            '& .play-overlay': { opacity: 1 },
                          },
                        }}
                      >
                        {/* Album Art with white border */}
                        <Box
                          sx={{
                            position: 'relative',
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            flexShrink: 0,
                            padding: '2px',
                            background: 'rgba(255,255,255,0.85)',
                            boxShadow: '0 0 10px rgba(255,255,255,0.15)',
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              component="img"
                              src={genreToImage[track.genre] || '/genres/pop.png'}
                              alt={track.title}
                              sx={{ width: '140%', height: '140%', objectFit: 'cover', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                            />
                            {/* Play overlay */}
                            <Box
                              className="play-overlay"
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isCurrentSong ? 'rgba(59,130,246,0.5)' : 'rgba(0,0,0,0.5)',
                                opacity: isCurrentSong ? 1 : 0,
                                transition: 'opacity 0.2s',
                                borderRadius: '50%',
                              }}
                            >
                              {isLoadingThis ? (
                                <CircularProgress size={14} sx={{ color: '#fff' }} />
                              ) : isThisPlaying ? (
                                <AudioEqualizer isPlaying={true} size={14} color="#fff" />
                              ) : (
                                <PlayArrowRoundedIcon sx={{ fontSize: 20, color: '#fff' }} />
                              )}
                            </Box>
                          </Box>
                        </Box>

                        {/* Track Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: isCurrentSong ? '#3B82F6' : '#fff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {track.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              color: 'rgba(255,255,255,0.5)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              textTransform: 'capitalize',
                            }}
                          >
                            {track.genre}
                          </Typography>
                        </Box>

                        {/* Duration */}
                        <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                          {track.duration}
                        </Typography>
                      </Paper>
                    );
                  })}
                </Box>
              ));
            })()}
          </ScrollableCarousel>
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
        gradientBackground="#0D0D0F"
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
