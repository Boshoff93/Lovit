import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import Lottie from 'react-lottie';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import socialsAnimationData from '../assets/animations/socials.json';
import { 
  Typography, 
  Button, 
  Box, 
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Link,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { getRouteConfig, carouselTitlesByCategory, RouteCategory } from '../config/routeConfig';
import { getSongIndexForRoute } from '../config/routeSampleSongs';
import { stripeConfig } from '../config/stripe';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import BoltIcon from '@mui/icons-material/Bolt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TranslateIcon from '@mui/icons-material/Translate';
import { useAuth } from '../hooks/useAuth';
import { useSectionHeaders } from '../hooks/useSectionHeaders';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { createCheckoutSession } from '../store/authSlice';
import { faqItems } from './FAQPage';
import { songsApi } from '../services/api';
import api from '../utils/axiosConfig';
import UpgradePopup from '../components/UpgradePopup';
import { topUpBundles, TopUpBundle } from '../config/stripe';
// PauseRoundedIcon replaced with AudioEqualizer component
import { SEO, createMusicPlaylistStructuredData, createSoftwareAppStructuredData, createOrganizationStructuredData } from '../utils/seoHelper';
import { AvatarShowcase, CTASection, MarketingSection, MarketingHeader, VideoShowcase } from '../components/marketing';
import { AnimatedPrice, PulsingBadge } from '../components/pricing';
import DiamondIcon from '@mui/icons-material/Diamond';

// Owner user ID for the seed songs
const SEED_SONGS_USER_ID = 'b1b35a41-efb4-4f79-ad61-13151294940d';

// Genre to image mapping for sample tracks
const genreToImage: Record<string, string> = {
  'indie': '/genres/indie.jpeg',
  'chillout': '/genres/chillout.jpeg',
  'chill': '/genres/chillout.jpeg',
  'tropical-house': '/genres/chillout.jpeg',
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

// Animated Equalizer Component for playing tracks
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

// Default sample tracks for the home route (/)
const defaultSampleTracks = [
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
];

// All songs per genre (3 songs each) for dynamic route-based selection
const allGenreSongs: Record<string, Array<{id: string; title: string; genre: string; duration: string}>> = {
  'pop': [
    { id: 'a93fd48c-9c12-41a5-8158-7afea227714f', title: 'Unstoppable', genre: 'pop', duration: '2:17' },
    { id: '49995520-1898-4675-9657-3fd93142fd99', title: 'Neon Confessions', genre: 'pop', duration: '2:49' },
    { id: '93e99651-7173-49b3-bc47-37e6b33dc15b', title: 'City Lights On My Heart', genre: 'pop', duration: '2:02' },
  ],
  'hip-hop': [
    { id: '801063e2-df5e-4abf-87b4-5fbfb49cb103', title: 'From the Concrete', genre: 'hip-hop', duration: '1:45' },
    { id: '48f6a5d8-6086-43ca-9755-5fbbb576c35c', title: 'Concrete Shadows', genre: 'hip-hop', duration: '1:39' },
    { id: '95bdc790-2b0b-4089-a5b8-a4e948fc00c2', title: 'Legacy in the Making', genre: 'hip-hop', duration: '1:30' },
  ],
  'rnb': [
    { id: 'a9b292d1-0215-4e5c-a87d-17a9e7654c0c', title: 'Candlelight Promise', genre: 'rnb', duration: '2:55' },
    { id: 'd881f5e8-fa8b-4bad-9b56-f4272841f3a9', title: 'Closer to Midnight', genre: 'rnb', duration: '2:08' },
    { id: '1001f55b-6365-49c6-88a1-0ed1a3670f9c', title: 'Pieces of Tomorrow', genre: 'rnb', duration: '2:58' },
  ],
  'electronic': [
    { id: '40a9ad54-b56d-4cfe-a3be-e19ea85aedee', title: 'Rise Into the Light', genre: 'electronic', duration: '2:55' },
    { id: '79b6d662-b0cd-4a8d-9924-b4e3ba16d7d3', title: 'Crystalline Drift', genre: 'electronic', duration: '2:56' },
    { id: 'd582b35a-792f-43f5-a60c-93ed84282a8c', title: 'Bass Cathedral', genre: 'electronic', duration: '2:45' },
  ],
  'dance': [
    { id: '0fb24f5f-029f-4fc0-bf17-6ef34a709a3e', title: 'Hands Up to the Sky', genre: 'dance', duration: '2:05' },
    { id: 'b5774873-ea24-49c3-8ff7-4f3ab4f49740', title: 'Rise Into The Light', genre: 'dance', duration: '2:02' },
    { id: 'b2eafede-e68a-4800-bfc7-fd4cbe8fb926', title: 'Sunrise Protocol', genre: 'dance', duration: '2:14' },
  ],
  'house': [
    { id: 'dfcaddd2-2896-499a-8823-007483fc76ce', title: 'Golden Hour', genre: 'house', duration: '2:29' },
    { id: '9c31f3fa-f744-4cfd-b549-b6d754393de4', title: 'Feel the Groove Tonight', genre: 'house', duration: '2:36' },
    { id: '11c4b4cb-bd63-46ad-8473-0ee15014d701', title: 'Shadows on the Floor', genre: 'house', duration: '2:00' },
  ],
  'edm': [
    { id: 'a1cf722f-4ec1-45a6-923d-d26b9647ecdb', title: 'Rise Into The Light', genre: 'edm', duration: '2:08' },
    { id: '61503ad8-a2dd-44e8-8ad6-ac749df1d320', title: 'Rise Into The Light', genre: 'edm', duration: '3:04' },
    { id: 'f8811329-fc2d-45cc-a25d-7c6ecf8040d8', title: 'Drop The Chaos', genre: 'edm', duration: '1:36' },
  ],
  'techno': [
    { id: '91e4fe1b-c091-4332-9598-0e0c7d5500f0', title: 'Steel Cathedral', genre: 'techno', duration: '2:21' },
    { id: 'a10e20cb-3d1c-4ba3-ade6-14c970ba2974', title: 'Machine Heart Protocol', genre: 'techno', duration: '2:26' },
    { id: '5dab088b-779f-4ae3-a3ef-1c206066f01a', title: 'Pulse of the Infinite', genre: 'techno', duration: '2:25' },
  ],
  'rock': [
    { id: 'dc096869-8a5e-4c9f-a664-53da6e55966c', title: 'Burn The Night', genre: 'rock', duration: '2:32' },
    { id: '60bc406a-6e0e-4d92-a0d2-c749a49ed27c', title: 'Ashes of Tomorrow', genre: 'rock', duration: '2:49' },
    { id: '51815c85-86d9-4c3b-a355-189851a7685f', title: 'Rise Against The Machine', genre: 'rock', duration: '2:18' },
  ],
  'alternative': [
    { id: 'b2cf2690-797b-4d79-96a1-b75a61d58bb9', title: 'Empty Rooms', genre: 'alternative', duration: '2:50' },
    { id: '10b9b6fa-811c-421f-8ca6-31ac93d25d88', title: 'Concrete Veins', genre: 'alternative', duration: '2:14' },
    { id: '6dbd92a4-21b7-43bd-9292-af33e9959ef5', title: 'Glass Cathedral', genre: 'alternative', duration: '2:33' },
  ],
  'indie': [
    { id: 'abbde752-0560-40dc-858c-75fbc5e5d2b6', title: 'Golden Hour Getaway', genre: 'indie', duration: '1:57' },
    { id: '64c4cad1-edf4-46c0-b27d-7d4b5ff6c466', title: 'Morning Light on Wooden Floors', genre: 'indie', duration: '2:03' },
    { id: '5c49bfef-b207-42ac-9a61-762112f1a101', title: 'Polaroid Summer', genre: 'indie', duration: '1:59' },
  ],
  'punk': [
    { id: '394e6756-92c5-4f55-8ec4-f7a83f09b580', title: 'Not Your Puppet', genre: 'punk', duration: '1:55' },
    { id: '6af8ad99-6fdc-413d-9080-c6949dc42ee0', title: 'Burn The Blueprint', genre: 'punk', duration: '1:40' },
    { id: '08fb2cd6-82f9-4c8b-95c1-aff31b1eb212', title: 'Friday Never Ends', genre: 'punk', duration: '2:14' },
  ],
  'metal': [
    { id: '279f4e79-00bd-45d2-b602-1638fabf8211', title: 'Forge of the Fallen', genre: 'metal', duration: '4:00' },
    { id: 'dcfcae83-63a5-4975-8496-7b97e04fc7d4', title: 'Teeth of the Void', genre: 'metal', duration: '3:46' },
    { id: '89a95448-5c1d-4350-9def-714bdeb85b37', title: 'Rise of the Immortal Flame', genre: 'metal', duration: '3:24' },
  ],
  'jazz': [
    { id: 'd00b4220-bc57-43f8-836d-cae5089da865', title: 'Midnight at the Blue Room', genre: 'jazz', duration: '2:50' },
    { id: '31a82512-422d-47ee-9661-655d6d050ce7', title: 'Sunshine in My Coffee Cup', genre: 'jazz', duration: '2:05' },
    { id: '270244fb-5b27-4012-a989-2be66b03cb35', title: 'Smoke and Shadows', genre: 'jazz', duration: '4:00' },
  ],
  'blues': [
    { id: '39e76336-ea40-4a4a-9458-c45c02e6dc3c', title: 'Worn Down to the Bone', genre: 'blues', duration: '2:40' },
    { id: '9c309daf-4d94-4325-a617-4964737c489f', title: 'Burning Down the House Tonight', genre: 'blues', duration: '2:44' },
    { id: 'b92e8d8a-992a-4969-b9a4-f102779044ba', title: 'River Knows My Name', genre: 'blues', duration: '2:20' },
  ],
  'soul': [
    { id: '147671d9-8dce-4cf4-977a-76747e2403fc', title: 'Rise Up Higher', genre: 'soul', duration: '2:10' },
    { id: '93bbc4cd-1765-42b0-b688-3bdb6f36234a', title: 'Every Beat of My Heart', genre: 'soul', duration: '2:39' },
    { id: '3cec23f5-d29d-4fd2-a515-b035c88df0a9', title: 'Empty Chair', genre: 'soul', duration: '2:50' },
  ],
  'funk': [
    { id: '47b4c888-7c69-43b9-86a4-380f9397fa1c', title: 'Get Up and Groove', genre: 'funk', duration: '1:47' },
    { id: 'b06697d0-250a-437a-b076-5bf3b3fd2df0', title: 'Pocket Monster', genre: 'funk', duration: '2:10' },
    { id: 'aa612eba-893a-483a-9235-0639193f8fcb', title: 'Velvet Shadows', genre: 'funk', duration: '2:37' },
  ],
  'classical': [
    { id: '01be3e64-589a-4dcf-b807-4c34ed357d6e', title: 'Where Rivers Dream', genre: 'classical', duration: '2:59' },
    { id: '2ec0ddb0-942d-47bd-a9d5-3ae9ec0c218f', title: 'Rise of the Eternal Dawn', genre: 'classical', duration: '3:38' },
    { id: '4e67936e-4e62-4502-9f55-9ef209060c3d', title: 'Shadows on the Keys', genre: 'classical', duration: '2:53' },
  ],
  'orchestral': [
    { id: '3484cbee-8a84-4c78-a64a-38f2f402c9c2', title: 'Rise to Glory', genre: 'orchestral', duration: '2:25' },
    { id: '9bd4a5e3-b7b9-44bd-bb44-677304166b48', title: 'Kingdom in the Clouds', genre: 'orchestral', duration: '2:02' },
    { id: '097b6582-aff3-4c1e-b027-213c9fa2526f', title: 'Through the Ashes We Rise', genre: 'orchestral', duration: '3:38' },
  ],
  'cinematic': [
    { id: '84085a8a-cff2-4e62-bd5b-9826472e4f92', title: 'Rise From The Ashes', genre: 'cinematic', duration: '2:49' },
    { id: '288e99ea-c174-4b50-8851-8d9b5b4655e1', title: 'Shadows Know Your Name', genre: 'cinematic', duration: '2:31' },
    { id: '4ed4cf4d-6a02-457b-adb2-5718501abc9c', title: 'Dawn Will Find Us', genre: 'cinematic', duration: '2:46' },
  ],
  'country': [
    { id: '2fba956d-acf6-46e4-85b8-199b09457f60', title: 'Front Porch Kind of Love', genre: 'country', duration: '2:32' },
    { id: '2f654e24-9234-41f5-ad36-32ee1ee531cd', title: 'Whiskey and Goodbye', genre: 'country', duration: '2:10' },
    { id: '04613af8-ef05-435e-a029-16cd49b61195', title: 'Dust and Neon Nights', genre: 'country', duration: '2:35' },
  ],
  'folk': [
    { id: '56dcabf6-d863-4196-af8d-dec64005ba59', title: 'Where the River Leads', genre: 'folk', duration: '2:17' },
    { id: '9e17a9e2-92c1-4cbe-922b-ccfc4e287c7a', title: 'Where the Porch Light Burns', genre: 'folk', duration: '2:08' },
    { id: '1b04f3f2-a6e4-43c1-a1f7-6ee6c612ec3a', title: 'Gather Round the Fire', genre: 'folk', duration: '2:07' },
  ],
  'acoustic': [
    { id: 'eb6a7b3e-e096-4d8b-a4da-b76ee97c2cd3', title: 'Golden Morning Light', genre: 'acoustic', duration: '2:24' },
    { id: 'a0745ff4-44ad-4931-879d-398527047196', title: 'Bare Bones', genre: 'acoustic', duration: '2:29' },
    { id: 'c9c7d69a-5321-43ff-9f96-9f2df2e00ffc', title: 'Golden Afternoons', genre: 'acoustic', duration: '2:33' },
  ],
  'latin': [
    { id: '70e5649c-af1b-4ad8-b2a5-d5c7bdfb9a35', title: 'Fuego en la Pista', genre: 'latin', duration: '2:24' },
    { id: 'c5f621e3-a198-407a-93a2-cf4a69c23db2', title: 'Fuego en la Pista', genre: 'latin', duration: '2:00' },
    { id: '9dd51f61-11dc-40f8-b082-397bb1d63786', title: 'Tears on the Guitar Strings', genre: 'latin', duration: '2:41' },
  ],
  'reggaeton': [
    { id: '6c892b5e-47ba-4e34-b7f1-70d106099608', title: 'Fuego Tonight', genre: 'reggaeton', duration: '1:26' },
    { id: '20c7291d-3b78-44d2-a874-72e1bcab691d', title: 'Midnight Fire', genre: 'reggaeton', duration: '2:03' },
    { id: 'b6828045-623e-4b3d-bae4-0b43200d68d7', title: 'Fuego Tonight', genre: 'reggaeton', duration: '1:31' },
  ],
  'kpop': [
    { id: 'f2614c35-ce09-458d-b647-4ff84ed37ac5', title: 'Shine Like Stars', genre: 'kpop', duration: '1:44' },
    { id: 'f55faf65-d32d-45d1-bc02-57711dbcba82', title: 'Fading Into You', genre: 'kpop', duration: '2:51' },
    { id: '5aba5129-27c4-4220-a8cd-0a440b01aa9b', title: 'Venom Kiss', genre: 'kpop', duration: '1:56' },
  ],
  'jpop': [
    { id: '92cb584b-7a19-4c77-83cf-bd22c85f2c41', title: 'Sunshine in My Heart', genre: 'jpop', duration: '2:04' },
    { id: '899eca98-ce7a-4e5f-9a45-39ceafa9ae1a', title: 'Rising Light', genre: 'jpop', duration: '2:54' },
    { id: 'cba96fc1-204a-4da8-8830-965fc8a081c0', title: 'Neon Heartbeat Warriors', genre: 'jpop', duration: '2:09' },
  ],
  'reggae': [
    { id: '8ebafbb4-6274-400f-83db-62ad1c98c9ad', title: 'Sunshine State of Mind', genre: 'reggae', duration: '2:26' },
    { id: 'a9e15e55-e418-4937-af41-4333bd1be5c7', title: 'One Heart Rising', genre: 'reggae', duration: '2:24' },
    { id: '553196cc-7be1-4834-ba8d-39f2c24f4f21', title: 'Midnight Dub Session', genre: 'reggae', duration: '2:18' },
  ],
  'lofi': [
    { id: 'f4e20940-11a6-4a5c-b992-71961cd53c23', title: 'Rainy Window Afternoons', genre: 'lofi', duration: '1:50' },
    { id: 'b29d4705-e86d-4062-b1fa-5472094c9350', title: 'Raindrops on My Window', genre: 'lofi', duration: '2:11' },
    { id: '3619c929-e7ee-4f88-b62e-9300e545d47d', title: '3AM Thoughts', genre: 'lofi', duration: '2:22' },
  ],
  'ambient': [
    { id: 'c54f6f53-f8ee-4222-8fa0-98a7eb01f6ff', title: 'Infinite Drift', genre: 'ambient', duration: '2:05' },
    { id: '54169f29-44da-4515-912a-38c3e7c428ec', title: 'Whispers of the Forest', genre: 'ambient', duration: '2:22' },
    { id: '4599e89f-77df-48b9-8386-c4597ccb60a1', title: 'Still Waters', genre: 'ambient', duration: '2:04' },
  ],
  'chillout': [
    { id: '06142aaf-4c01-4af4-a318-945bfaf91a36', title: 'Golden Hour Fade', genre: 'chillout', duration: '2:59' },
    { id: '6a55157d-71b5-4052-8beb-229e6399ec57', title: 'Saltwater Dreams', genre: 'chillout', duration: '2:26' },
    { id: 'dd493e6b-a5ac-497c-8952-28161a270e71', title: 'Golden Hour Drive', genre: 'chillout', duration: '2:41' },
  ],
  'gospel': [
    { id: '5de7af18-791c-4a7e-8c81-7b317dc25a6c', title: 'Rise Up in Glory', genre: 'gospel', duration: '2:20' },
    { id: 'bf3942b0-600d-45a9-ab9e-f7bcd3b7b33e', title: 'Grace Like Morning Light', genre: 'gospel', duration: '2:13' },
    { id: '3ad00d73-60e9-46d7-b056-91c8f82038af', title: 'Victory Morning', genre: 'gospel', duration: '2:37' },
  ],
};

// List of genres in display order
const genreOrder = [
  'indie', 'chillout', 'hip-hop', 'pop', 'kpop', 'jpop', 'dance', 'gospel',
  'ambient', 'lofi', 'house', 'metal', 'jazz', 'blues', 'soul', 'rnb',
  'funk', 'classical', 'orchestral', 'cinematic', 'country', 'folk', 'acoustic',
  'rock', 'latin', 'reggaeton', 'reggae', 'punk', 'electronic', 'alternative', 'techno', 'edm'
];

// Language sample tracks - using working sample track IDs with language-themed display names
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

// Language display order for the carousel (15 languages)
const languageOrder = ['english', 'spanish', 'french', 'german', 'japanese', 'korean', 'chinese', 'portuguese', 'italian', 'hindi', 'arabic', 'russian', 'turkish', 'thai', 'vietnamese'];

// Language name to image code mapping
const languageToImageCode: Record<string, string> = {
  'english': 'en', 'spanish': 'es', 'french': 'fr', 'german': 'de',
  'japanese': 'ja', 'korean': 'ko', 'chinese': 'zh', 'portuguese': 'pt',
  'italian': 'it', 'hindi': 'hi', 'arabic': 'ar', 'russian': 'ru',
  'turkish': 'tr', 'thai': 'th', 'vietnamese': 'vi',
};

// Function to get language tracks (15 distinct tracks, one per language)
function getLanguageTracksForRoute(): Array<{id: string; title: string; language: string; duration: string; image: string}> {
  return languageOrder.map(lang => {
    const track = languageSampleTracks[lang][0];
    const langName = lang.charAt(0).toUpperCase() + lang.slice(1);
    const imageCode = languageToImageCode[lang] || lang.slice(0, 2);
    return { ...track, language: langName, image: `/locales/${imageCode}.png` };
  });
}

// Additional genre tracks to fill the remaining carousel (tracks not in defaultSampleTracks)
const additionalGenreTracks = [
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

// Function to generate sample tracks based on current route
function getSampleTracksForRoute(pathname: string): Array<{id: string; title: string; genre: string; duration: string}> {
  // Use default tracks for home route
  if (pathname === '/') {
    return defaultSampleTracks;
  }
  
  // For other routes, dynamically pick one song per genre based on route hash
  return genreOrder.map(genre => {
    const songs = allGenreSongs[genre];
    if (!songs || songs.length === 0) return null;
    const index = getSongIndexForRoute(pathname, genre);
    return songs[index];
  }).filter((track): track is {id: string; title: string; genre: string; duration: string} => track !== null);
}

// Video type definition
interface VideoItem {
  id: string;
  title: string;
  style: string;
  views: string;
  thumbnail: string;
  aspectRatio: 'portrait' | 'landscape';
  videoUrl: string;
  tag?: string; // Optional brand/product tag for promo videos
}

// PROMO VIDEOS - Product/brand promotional content (like Walk Right In with Chanel)
const promoVideosPortrait: VideoItem[] = [
  {
    id: '564c0a00-5064-4713-a6d5-b191f2ab751f',
    title: "Powder Dreams",
    style: "Cinematic",
    views: "1.8K",
    thumbnail: "/thumbnails/skiis.jpeg",
    aspectRatio: 'portrait',
    videoUrl: 'https://gruvimusic.com/video/564c0a00-5064-4713-a6d5-b191f2ab751f',
    tag: "Rossignol Skis",
  },
  {
    id: 'b19d1ce4-6650-40dc-afdb-c3d12800ffac',
    title: "Walk Right In",
    style: "Cinematic",
    views: "892",
    thumbnail: "/thumbnails/chanel.jpeg",
    aspectRatio: 'portrait',
    videoUrl: 'https://gruvimusic.com/video/b19d1ce4-6650-40dc-afdb-c3d12800ffac',
    tag: "Coco Chanel",
  },
  {
    id: 'ef807231-faab-4a97-a51b-08f574fbae52',
    title: "Beneath the Surface",
    style: "Cinematic",
    views: "1.0K",
    thumbnail: "/thumbnails/rolex.jpeg",
    aspectRatio: 'portrait',
    videoUrl: 'https://gruvimusic.com/video/ef807231-faab-4a97-a51b-08f574fbae52',
    tag: "Rolex",
  },
  {
    id: '134e4aed-1b25-4d0b-a41a-73a683f76225',
    title: "Gotta Catch 'Em All",
    style: "Cinematic",
    views: "1.2K",
    thumbnail: "/thumbnails/pokeball.jpeg",
    aspectRatio: 'portrait',
    videoUrl: 'https://gruvimusic.com/video/134e4aed-1b25-4d0b-a41a-73a683f76225',
    tag: "Pokeball",
  },
  {
    id: '9a3a7f9d-3f03-44a7-8ea5-ae306c4172e5',
    title: "Labubu Gang",
    style: "Cinematic",
    views: "1.0K",
    thumbnail: "/thumbnails/labubu.jpeg",
    aspectRatio: 'portrait',
    videoUrl: 'https://gruvimusic.com/video/9a3a7f9d-3f03-44a7-8ea5-ae306c4172e5',
    tag: "Labubu",
  },
  {
    id: '18061fda-525d-4aba-a6b9-cbd41b1748c5',
    title: "Kiss Me Slow",
    style: "Cinematic",
    views: "1.1K",
    thumbnail: "/thumbnails/kiss.jpeg",
    aspectRatio: 'portrait',
    videoUrl: 'https://gruvimusic.com/video/18061fda-525d-4aba-a6b9-cbd41b1748c5',
    tag: "MAC Lipstick",
  },
  {
    id: '5405e955-ec86-453e-ae75-ae666a0f693c',
    title: "Under the Open Sky",
    style: "Cinematic",
    views: "1.3K",
    thumbnail: "/thumbnails/tent.jpeg",
    aspectRatio: 'portrait',
    videoUrl: 'https://gruvimusic.com/video/5405e955-ec86-453e-ae75-ae666a0f693c',
    tag: "North Face",
  },
];

const promoVideosLandscape: VideoItem[] = [
  {
    id: 'dc6c22f4-22e5-433d-aa38-5792bc653185',
    title: "Glide",
    style: "Cinematic",
    views: "1.5K",
    thumbnail: "/thumbnails/tesla.jpeg",
    aspectRatio: 'landscape',
    videoUrl: 'https://gruvimusic.com/video/dc6c22f4-22e5-433d-aa38-5792bc653185',
    tag: "Tesla",
  },
  {
    id: '4d42bf20-328b-4d80-b319-8ff8d9867036',
    title: "Frinton Sunrise",
    style: "Cinematic",
    views: "892",
    thumbnail: "/thumbnails/frinton.jpeg",
    aspectRatio: 'landscape',
    videoUrl: 'https://gruvimusic.com/video/4d42bf20-328b-4d80-b319-8ff8d9867036',
    tag: "Airbnb",
  },
  {
    id: '4a7ec232-aca9-4538-bc79-45149d705812',
    title: "Cha-La Head-Cha-La",
    style: "Anime",
    views: "2.1K",
    thumbnail: "/thumbnails/goku.jpeg",
    aspectRatio: 'landscape',
    videoUrl: 'https://gruvimusic.com/video/4a7ec232-aca9-4538-bc79-45149d705812',
    tag: "Dragon Ball",
  },
];

// MUSIC VIDEOS - Song-focused artistic videos
const musicVideosPortrait: VideoItem[] = [
  {
    id: 'da4d792d-a24b-45d8-87ba-5b41778496e8',
    title: "Polaroid Summer",
    style: "3D Cartoon",
    views: "1.2K",
    thumbnail: "/thumbnails/duck.jpeg",
    aspectRatio: 'portrait',
    videoUrl: 'https://gruvimusic.com/video/da4d792d-a24b-45d8-87ba-5b41778496e8',
  },
  // Add more portrait music videos here
];

const musicVideosLandscape: VideoItem[] = [
  {
    id: '4a7ec232-aca9-4538-bc79-45149d705812',
    title: "Cha-La Head-Cha-La",
    style: "Anime",
    views: "3.5K",
    thumbnail: "/thumbnails/goku.jpeg",
    aspectRatio: 'landscape',
    videoUrl: 'https://gruvimusic.com/video/4a7ec232-aca9-4538-bc79-45149d705812',
    tag: "Dragon Ball",
  },
  {
    id: '4221ddeb-136c-4968-a46f-7585635827f1',
    title: "Set Sail to Glory",
    style: "Anime",
    views: "2.1K",
    thumbnail: "/thumbnails/one-piece.jpeg",
    aspectRatio: 'landscape',
    videoUrl: 'https://gruvimusic.com/video/4221ddeb-136c-4968-a46f-7585635827f1',
    tag: "One Piece",
  },
];

// Genres data - matching the genres we support with images
const genres = [
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
  { id: 'tropical-house', name: 'Tropical House', image: '/genres/chillout.jpeg' },
  { id: 'gospel', name: 'Gospel', image: '/genres/gospels.jpeg' },
];

// Moods data - matching the moods we support with images
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

// Art styles for music videos (matching Fable's art styles with boy images)
const artStyles = [
  { id: '3d-cartoon', label: '3D Cartoon', image: '/art_styles/boy_cartoon.jpeg' },
  { id: 'claymation', label: 'Claymation', image: '/art_styles/boy_claymation.jpeg' },
  { id: 'childrens-storybook', label: "Children's Book", image: '/art_styles/boy_storybook.jpeg' },
  { id: 'photo-realism', label: 'Realistic', image: '/art_styles/boy_real.jpeg' },
  { id: 'comic-book', label: 'Comic Book', image: '/art_styles/boy_comic.jpeg' },
  { id: 'classic-blocks', label: 'Classic Blocks', image: '/art_styles/boy_lego.jpeg' },
  { id: 'anime', label: 'Animation', image: '/art_styles/boy_anime.jpeg' },
  { id: 'spray-paint', label: 'Spray Paint', image: '/art_styles/boy_spray_paint.jpeg' },
  { id: 'playground-crayon', label: 'Crayon', image: '/art_styles/boy_crayon.jpeg' },
  { id: 'wool-knit', label: 'Cozy Woolknit', image: '/art_styles/boy_woolknit.jpeg' },
  { id: 'minecraft', label: 'Blockcraft', image: '/art_styles/boy_lego.jpeg' },
  { id: 'watercolor', label: 'Watercolor', image: '/art_styles/boy_watercolor.jpeg' },
  { id: 'pixel', label: '2D Game', image: '/art_styles/boy_pixel.jpeg' },
  { id: 'sugarpop', label: 'Sugarpop', image: '/art_styles/boy_sugerpop.jpeg' },
  { id: 'origami', label: 'Origami', image: '/art_styles/boy_origami.jpeg' },
  { id: 'sketch', label: 'B&W Sketch', image: '/art_styles/boy_sketch.jpeg' },
];

// Languages - All 24 supported languages with images
const languages = [
  { id: 'en', name: 'English', image: '/locales/en.png' },
  { id: 'es', name: 'Spanish', image: '/locales/es.png' },
  { id: 'fr', name: 'French', image: '/locales/fr.png' },
  { id: 'de', name: 'German', image: '/locales/de.png' },
  { id: 'it', name: 'Italian', image: '/locales/it.png' },
  { id: 'pt', name: 'Portuguese', image: '/locales/pt.png' },
  { id: 'nl', name: 'Dutch', image: '/locales/nl.png' },
  { id: 'pl', name: 'Polish', image: '/locales/pl.png' },
  { id: 'ro', name: 'Romanian', image: '/locales/ro.png' },
  { id: 'cs', name: 'Czech', image: '/locales/cs.png' },
  { id: 'el', name: 'Greek', image: '/locales/el.png' },
  { id: 'bg', name: 'Bulgarian', image: '/locales/bg.png' },
  { id: 'fi', name: 'Finnish', image: '/locales/fi.png' },
  { id: 'uk', name: 'Ukrainian', image: '/locales/uk.png' },
  { id: 'ru', name: 'Russian', image: '/locales/ru.png' },
  { id: 'tr', name: 'Turkish', image: '/locales/tr.png' },
  { id: 'ar', name: 'Arabic', image: '/locales/ar.png' },
  { id: 'hi', name: 'Hindi', image: '/locales/hi.png' },
  { id: 'th', name: 'Thai', image: '/locales/th.png' },
  { id: 'vi', name: 'Vietnamese', image: '/locales/vi.png' },
  { id: 'id', name: 'Indonesian', image: '/locales/id.png' },
  { id: 'ja', name: 'Japanese', image: '/locales/ja.png' },
  { id: 'ko', name: 'Korean', image: '/locales/ko.png' },
  { id: 'zh', name: 'Chinese', image: '/locales/zh.png' },
];

// Subscription plans
// Token-based pricing system
// Token costs:
// 1 Short Song = 25 tokens, 1 Standard Song = 50 tokens
// 1 Still Image Video = 200 tokens
// 1 Cinematic Video = 50 tokens per 10 seconds

interface PricePlan {
  id: string;
  title: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  tokens: number;
  gradient: string;
  stripePrices: {
    monthly: string;
    yearly: string;
  };
  productId: string;
}

const plans: PricePlan[] = [
  {
    id: 'starter',
    title: 'Starter',
    tagline: 'Create videos while others are still writing scripts',
    monthlyPrice: 39,
    yearlyPrice: 348, // $29/mo × 12 (25% off)
    tokens: 5000,
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    features: [
      '5,000 AI Media Tokens/month',
      '~2 music videos',
      '~5 avatar videos',
      '~200 AI songs',
      '~200 AI voiceovers',
      '~2 character swap videos',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.starter.monthly,
      yearly: stripeConfig.starter.yearly
    },
    productId: stripeConfig.starter.productId
  },
  {
    id: 'scale',
    title: 'Scale',
    tagline: 'Go viral while competitors are still planning',
    monthlyPrice: 99,
    yearlyPrice: 828, // $69/mo × 12 (30% off)
    popular: true,
    tokens: 20000,
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    features: [
      '20,000 AI Media Tokens/month',
      '~8 music videos',
      '~20 avatar videos',
      '~800 AI songs',
      '~800 AI voiceovers',
      '~8 character swap videos',
      'Priority generation',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.scale.monthly,
      yearly: stripeConfig.scale.yearly
    },
    productId: stripeConfig.scale.productId
  },
  {
    id: 'beast',
    title: 'Content Engine',
    tagline: 'Flood the feed while the competition falls behind',
    monthlyPrice: 199,
    yearlyPrice: 1788, // $149/mo × 12 (25% off)
    tokens: 50000,
    gradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
    features: [
      '50,000 AI Media Tokens/month',
      '~20 music videos',
      '~50 avatar videos',
      '~2,000 AI songs',
      '~2,000 AI voiceovers',
      '~20 character swap videos',
      'Priority generation',
      'Dedicated support',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.hardcore.monthly,
      yearly: stripeConfig.hardcore.yearly
    },
    productId: stripeConfig.hardcore.productId
  }
];


// Section Divider Component - Dark theme with gradient
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
        background: 'linear-gradient(90deg, transparent 0%, transparent 15%, rgba(139,92,246,0.2) 35%, rgba(236,72,153,0.25) 50%, rgba(139,92,246,0.2) 65%, transparent 85%, transparent 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-2px',
          left: '30%',
          right: '30%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.05) 30%, rgba(236,72,153,0.08) 50%, rgba(139,92,246,0.05) 70%, transparent 100%)',
          filter: 'blur(2px)',
        },
      }}
    />
  </Box>
);

// Quick links / routes for footer SEO - using valid routes from routeConfig
const quickRoutes = [
  // Core Features
  { path: '/ai-music-generator', label: 'AI Music Generator' },
  { path: '/free-music-generator', label: 'Free Music Generator' },
  { path: '/music-video-generator', label: 'Music Video Creator' },
  
  // Popular Genres (pattern: /create-{genre}-music)
  { path: '/create-pop-music', label: 'Create Pop Music' },
  { path: '/create-rock-music', label: 'Create Rock Music' },
  { path: '/create-hip-hop-music', label: 'Create Hip-Hop' },
  { path: '/create-rap-music', label: 'Create Rap Music' },
  { path: '/create-jazz-music', label: 'Create Jazz' },
  { path: '/create-classical-music', label: 'Create Classical' },
  { path: '/create-electronic-music', label: 'Create Electronic' },
  { path: '/create-edm-music', label: 'Create EDM' },
  { path: '/create-house-music', label: 'Create House Music' },
  { path: '/create-techno-music', label: 'Create Techno' },
  { path: '/create-lofi-music', label: 'Create Lo-Fi Beats' },
  { path: '/create-rnb-music', label: 'Create R&B' },
  { path: '/create-soul-music', label: 'Create Soul Music' },
  { path: '/create-funk-music', label: 'Create Funk' },
  { path: '/create-disco-music', label: 'Create Disco' },
  { path: '/create-country-music', label: 'Create Country' },
  { path: '/create-folk-music', label: 'Create Folk Music' },
  { path: '/create-blues-music', label: 'Create Blues' },
  { path: '/create-reggae-music', label: 'Create Reggae' },
  { path: '/create-latin-music', label: 'Create Latin Music' },
  { path: '/create-reggaeton-music', label: 'Create Reggaeton' },
  { path: '/create-k-pop-music', label: 'Create K-Pop' },
  { path: '/create-afrobeats-music', label: 'Create Afrobeats' },
  { path: '/create-metal-music', label: 'Create Metal' },
  { path: '/create-indie-music', label: 'Create Indie Music' },
  { path: '/create-ambient-music', label: 'Create Ambient' },
  { path: '/create-cinematic-music', label: 'Create Cinematic' },
  { path: '/create-trap-music', label: 'Create Trap Beats' },
  { path: '/create-synthwave-music', label: 'Create Synthwave' },
  { path: '/create-gospel-music', label: 'Create Gospel' },
  { path: '/create-meditation-music', label: 'Create Meditation Music' },
  { path: '/create-workout-music', label: 'Create Workout Music' },
  { path: '/create-gaming-music', label: 'Create Gaming Music' },
  { path: '/create-lullaby-music', label: 'Create Lullabies' },
  { path: '/create-kids-music', label: 'Create Kids Music' },
  { path: '/create-wedding-music-music', label: 'Create Wedding Music' },
  { path: '/create-party-music', label: 'Create Party Music' },
  
  // Languages (pattern: /create-music-in-{lang})
  { path: '/create-music-in-english', label: 'Music in English' },
  { path: '/create-music-in-spanish', label: 'Music in Spanish' },
  { path: '/create-music-in-french', label: 'Music in French' },
  { path: '/create-music-in-german', label: 'Music in German' },
  { path: '/create-music-in-japanese', label: 'Music in Japanese' },
  { path: '/create-music-in-korean', label: 'Music in Korean' },
  { path: '/create-music-in-chinese', label: 'Music in Chinese' },
  { path: '/create-music-in-portuguese', label: 'Music in Portuguese' },
  { path: '/create-music-in-italian', label: 'Music in Italian' },
  { path: '/create-music-in-hindi', label: 'Music in Hindi' },
  { path: '/create-music-in-arabic', label: 'Music in Arabic' },
  { path: '/create-music-in-russian', label: 'Music in Russian' },
  
  // Holidays & Occasions (pattern: /{holiday}-music)
  { path: '/christmas-music', label: 'Christmas Music' },
  { path: '/halloween-music', label: 'Halloween Music' },
  { path: '/birthday-music', label: 'Birthday Songs' },
  { path: '/wedding-music', label: 'Wedding Music' },
  { path: '/valentines-day-music', label: "Valentine's Day Music" },
  { path: '/new-years-music', label: 'New Year Music' },
  { path: '/thanksgiving-music', label: 'Thanksgiving Music' },
  { path: '/mothers-day-music', label: "Mother's Day Songs" },
  { path: '/fathers-day-music', label: "Father's Day Songs" },
  { path: '/graduation-music', label: 'Graduation Music' },
  
  // Video Styles (pattern: /create-{style}-music-video)
  { path: '/create-anime-music-video', label: 'Anime Music Videos' },
  { path: '/create-cartoon-music-video', label: 'Cartoon Music Videos' },
  { path: '/create-pixar-style-music-video', label: 'Pixar Style Videos' },
  { path: '/create-disney-style-music-video', label: 'Disney Style Videos' },
  { path: '/create-cinematic-music-video', label: 'Cinematic Videos' },
  { path: '/create-cyberpunk-music-video', label: 'Cyberpunk Videos' },
  { path: '/create-fantasy-music-video', label: 'Fantasy Videos' },
  { path: '/create-retro-music-video', label: 'Retro Style Videos' },
  
  // Platforms (pattern: /music-for-{platform})
  { path: '/music-for-youtube', label: 'Music for YouTube' },
  { path: '/music-for-tiktok', label: 'Music for TikTok' },
  { path: '/music-for-instagram', label: 'Music for Instagram' },
  { path: '/music-for-spotify', label: 'Music for Spotify' },
  { path: '/music-for-podcast', label: 'Music for Podcasts' },
  { path: '/music-for-twitch', label: 'Music for Twitch' },
  
  // Moods (pattern: /create-{mood}-music)
  { path: '/create-happy-music', label: 'Happy Music' },
  { path: '/create-sad-music', label: 'Sad Music' },
  { path: '/create-energetic-music', label: 'Energetic Music' },
  { path: '/create-chill-music', label: 'Chill Music' },
  { path: '/create-romantic-music', label: 'Romantic Music' },
  { path: '/create-epic-music', label: 'Epic Music' },
  { path: '/create-dark-music', label: 'Dark Music' },
  { path: '/create-uplifting-music', label: 'Uplifting Music' },
  
  // UGC & Cheap AI Video Ads
  { path: '/cheap-ugc-video', label: 'Cheap UGC Content' },
  { path: '/ai-ugc-ads-video', label: 'AI UGC Ads' },
  { path: '/automated-video-ads-video', label: 'Automated Video Ads' },
  { path: '/social-media-ads-video', label: 'Social Media Ads' },
  { path: '/test-ad-creative-video', label: 'Test Ad Creative' },
  { path: '/prototype-ads-video', label: 'Prototype Ads' },
  { path: '/low-cost-ads-video', label: 'Low Cost Ads' },
  { path: '/bulk-video-content-video', label: 'Bulk Video Content' },
  { path: '/influencer-style-ads-video', label: 'Influencer Style Ads' },
  
  // Ad Testing & Prototyping
  { path: '/ad-creative-testing', label: 'Ad Creative Testing' },
  { path: '/pre-launch-ads', label: 'Pre-Launch Ads' },
  { path: '/mvp-marketing', label: 'MVP Marketing' },
  { path: '/ad-mockups', label: 'Ad Mockups' },
  { path: '/creative-iterations', label: 'Creative Iterations' },
  { path: '/audience-testing', label: 'Audience Testing' },
  
  // Occasion & Activity Music
  { path: '/music-for-morning-routine', label: 'Morning Routine Music' },
  { path: '/music-for-gym-workout', label: 'Gym Workout Music' },
  { path: '/music-for-running', label: 'Running Music' },
  { path: '/music-for-yoga-session', label: 'Yoga Music' },
  { path: '/music-for-meditation', label: 'Meditation Music' },
  { path: '/music-for-studying', label: 'Studying Music' },
  { path: '/music-for-working-from-home', label: 'Work From Home Music' },
  { path: '/music-for-cooking', label: 'Cooking Music' },
  { path: '/music-for-dinner-party', label: 'Dinner Party Music' },
  { path: '/music-for-road-trip', label: 'Road Trip Music' },
  { path: '/music-for-beach-day', label: 'Beach Day Music' },
  { path: '/music-for-pool-party', label: 'Pool Party Music' },
  { path: '/music-for-bbq-cookout', label: 'BBQ Cookout Music' },
  { path: '/music-for-late-night-vibes', label: 'Late Night Vibes' },
  { path: '/music-for-coffee-shop', label: 'Coffee Shop Music' },
  { path: '/music-for-new-years-eve', label: 'New Years Eve Music' },
  { path: '/music-for-new-years-day', label: 'New Years Day Music' },
  { path: '/music-for-super-bowl-party', label: 'Super Bowl Party Music' },
  { path: '/music-for-july-4th', label: 'July 4th Music' },
  { path: '/music-for-baby-shower', label: 'Baby Shower Music' },
  { path: '/music-for-bridal-shower', label: 'Bridal Shower Music' },
  { path: '/music-for-bachelor-party', label: 'Bachelor Party Music' },
  { path: '/music-for-anniversary', label: 'Anniversary Music' },
  { path: '/music-for-retirement-party', label: 'Retirement Party Music' },
  { path: '/music-for-housewarming', label: 'Housewarming Music' },
  
  // E-commerce Promo Videos
  { path: '/shopify-store-promo-video', label: 'Shopify Store Videos' },
  { path: '/amazon-fba-promo-video', label: 'Amazon FBA Videos' },
  { path: '/etsy-shop-promo-video', label: 'Etsy Shop Videos' },
  { path: '/dropshipping-promo-video', label: 'Dropshipping Videos' },
  { path: '/product-launch-promo-video', label: 'Product Launch Videos' },
  { path: '/flash-sale-promo-promo-video', label: 'Flash Sale Videos' },
  { path: '/black-friday-promo-video', label: 'Black Friday Videos' },
  { path: '/cyber-monday-promo-video', label: 'Cyber Monday Videos' },
  { path: '/holiday-sale-promo-video', label: 'Holiday Sale Videos' },
  { path: '/subscription-box-promo-video', label: 'Subscription Box Videos' },
  
  // Airbnb & Rental Property Videos
  { path: '/airbnb-listing-promo-video', label: 'Airbnb Listing Videos' },
  { path: '/vacation-rental-promo-video', label: 'Vacation Rental Videos' },
  { path: '/beach-house-rental-promo-video', label: 'Beach House Rental' },
  { path: '/mountain-cabin-promo-video', label: 'Mountain Cabin Videos' },
  { path: '/city-apartment-promo-video', label: 'City Apartment Videos' },
  { path: '/luxury-villa-promo-video', label: 'Luxury Villa Videos' },
  { path: '/tiny-house-promo-video', label: 'Tiny House Videos' },
  { path: '/treehouse-promo-video', label: 'Treehouse Videos' },
  { path: '/glamping-promo-video', label: 'Glamping Videos' },
  { path: '/farmstay-promo-video', label: 'Farmstay Videos' },
  { path: '/pet-friendly-rental-promo-video', label: 'Pet Friendly Rentals' },
  { path: '/romantic-getaway-promo-video', label: 'Romantic Getaway Videos' },
  { path: '/superhost-promo-promo-video', label: 'Superhost Promo Videos' },
];

// Reusable Scrollable Carousel with fade edges and arrows
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

      // Build dynamic mask based on scroll position
      let mask = 'linear-gradient(to right, ';
      if (isAtStart) {
        // At start: no left fade
        mask += 'black 0%, black 95%, transparent 100%)';
      } else if (isAtEnd) {
        // At end: no right fade
        mask += 'transparent 0%, black 5%, black 100%)';
      } else {
        // Middle: fade both sides
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
      // Initial check and delayed check for content to render
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
      {/* Left arrow */}
      {showLeftArrow && (
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%)',
            boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
            width: 40,
            height: 40,
            animation: 'pulseOut 2.5s ease-out infinite',
            '@keyframes pulseOut': {
              '0%': {
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
              },
              '100%': {
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 12px rgba(59, 130, 246, 0)',
              },
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%)',
              transform: 'translateY(-50%) scale(1.05)',
              animation: 'none',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.5)',
            },
          }}
        >
          <ChevronLeftIcon sx={{ color: '#FFFFFF' }} />
        </IconButton>
      )}

      {/* Right arrow */}
      {showRightArrow && (
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%)',
            boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
            width: 40,
            height: 40,
            animation: 'pulseOut 2.5s ease-out infinite',
            '@keyframes pulseOut': {
              '0%': {
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.6)',
              },
              '100%': {
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3), 0 0 0 12px rgba(59, 130, 246, 0)',
              },
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%)',
              transform: 'translateY(-50%) scale(1.05)',
              animation: 'none',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.5)',
            },
          }}
        >
          <ChevronRightIcon sx={{ color: '#FFFFFF' }} />
        </IconButton>
      )}

      {/* Scrollable content */}
      <Box
        ref={containerRef}
        id={id}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          overflowY: 'visible',
          py: 3, // Extra vertical padding to prevent clipping on hover
          px: 0.5, // Add horizontal padding so edge items aren't clipped
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

// Video Card Component for reuse - with hover-to-play
interface VideoCardProps {
  video: VideoItem;
  onClick: () => void;
  isInView?: boolean; // When true, auto-play video; otherwise, play on hover
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isLandscape = video.aspectRatio === 'landscape';
  const portraitWidth = { xs: 150, sm: 175, md: 200 };
  const landscapeWidth = { xs: 280, sm: 320, md: 360 };

  // Auto-play when isInView prop is true
  useEffect(() => {
    if (isInView !== undefined) {
      setShowVideo(isInView);
    }
  }, [isInView]);

  // Handle hover start - 300ms delay before playing (only when not using isInView)
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (isInView === undefined) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowVideo(true);
      }, 300);
    }
  }, [isInView]);

  // Handle hover end - stop video immediately (only when not using isInView)
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (isInView === undefined) {
      setShowVideo(false);
      // Reset video to start
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isInView]);

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
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: isLandscape ? landscapeWidth : portraitWidth,
        minWidth: isLandscape ? landscapeWidth : portraitWidth,
        flexShrink: 0,
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 12px 32px rgba(0,0,0,0.18)' : '0 2px 12px rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.03)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: isLandscape ? '16/9' : '9/16',
          overflow: 'hidden',
          borderRadius: '10px',
        }}
      >
        {/* Thumbnail Image */}
        <Box
          component="img"
          src={video.thumbnail}
          alt={video.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: showVideo ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Video - only visible on hover after delay */}
        {video.videoUrl && (
          <Box
            component="video"
            ref={videoRef}
            src={video.videoUrl}
            autoPlay={showVideo}
            muted
            loop
            playsInline
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: showVideo ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          />
        )}
        {/* Tag - top right with glassy blur (brand tag or style) */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            px: 1.5,
            py: 0.5,
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '0.02em',
            }}
          >
            {video.tag || video.style}
          </Typography>
        </Box>
        {/* Play button - center with glassy blur, hidden when video is playing */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: showVideo ? 0 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: showVideo ? 'none' : 'auto',
          }}
        >
          <Box
            sx={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '50%',
              width: isLandscape ? 56 : 44,
              height: isLandscape ? 56 : 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
              transition: 'all 0.25s ease',
              transform: isHovered && !showVideo ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <PlayArrowRoundedIcon sx={{ fontSize: isLandscape ? 30 : 24, color: '#06B6D4', ml: 0.25 }} />
          </Box>
        </Box>
        {/* Info overlay - centered title only */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1.5,
            pt: 4,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {video.title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Landscape Video Card Component - copied from AIVideoShortsPage
const LandscapeVideoCard: React.FC<{
  video: VideoItem;
  videoUrl?: string;
  onClick?: () => void;
  inView?: boolean;
}> = ({ video, videoUrl, onClick, inView = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (videoRef.current && videoUrl) {
      videoRef.current.currentTime = 0; // Restart from beginning on hover
      timeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {});
        }
      }, 300); // 300ms delay before playing
    }
  }, [videoUrl]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPlaying(false);
    // Clear the pending timeout to prevent video from starting after mouse leaves
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: 0,
        transform: 'translateY(20px)',
        ...(inView && {
          animation: 'fadeInUp 0.5s ease forwards',
        }),
        '@keyframes fadeInUp': {
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        boxShadow: isHovered
          ? '0 16px 40px rgba(0, 0, 0, 0.4)'
          : '0 8px 24px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Video/Thumbnail Container - 16:9 aspect ratio */}
      <Box sx={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        {/* Thumbnail */}
        <Box
          component="img"
          src={video.thumbnail}
          alt={video.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease, opacity 0.3s ease',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            opacity: isPlaying ? 0 : 1,
            zIndex: 1,
          }}
        />
        {/* Video - plays muted on hover */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              zIndex: 0,
            }}
          />
        )}

        {/* Gradient overlay for text */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.9) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Content overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2,
            zIndex: 3,
          }}
        >
          {/* Top: Brand Tag */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {video.tag && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>
                  {video.tag}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Bottom: Title and Play Button */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
            <Box>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#fff',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}
              >
                {video.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {video.style}
              </Typography>
            </Box>

            {/* Play button */}
            <Box
              sx={{
                flexShrink: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                opacity: isPlaying ? 0.6 : 1,
                transform: isHovered && !isPlaying ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <PlayArrowRoundedIcon sx={{ fontSize: 18, color: '#F97316', ml: 0.25 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  
  // Audio player context
  const { currentSong, isPlaying, playSong, pauseSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;
  
  // State for playing sample tracks
  const [loadingSongId, setLoadingSongId] = useState<string | null>(null);
  const [songCache, setSongCache] = useState<Record<string, any>>({});

  // State for video URLs
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  
  const [open, setOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [authTab, setAuthTab] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>('');
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);
  const promptInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, googleLogin, user, error: authError, resendVerificationEmail, getGoogleIdToken, logout, subscription } = useAuth();
  const { token, allowances } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;
  const isPremiumTier = subscription?.tier === 'premium' || subscription?.tier === 'pro';

  // Upgrade popup state
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  // Handle top-up purchase
  const handleTopUp = async (bundle?: TopUpBundle) => {
    if (!bundle) return;
    setIsTopUpLoading(true);
    try {
      const result = await dispatch(createCheckoutSession({
        priceId: bundle.priceId,
        productId: bundle.productId,
      })).unwrap();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error('Failed to create checkout session:', err);
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const handleUpgradePlan = () => {
    setShowUpgradePopup(false);
    navigate('/payment');
  };

  // Get sample tracks based on current route (default for /, hashed for other routes)
  const sampleTracks = useMemo(() => getSampleTracksForRoute(location.pathname), [location.pathname]);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen]);

  // Handle play button click for sample tracks
  const handlePlaySampleTrack = useCallback(async (track: { id: string; title: string; genre?: string; duration: string }) => {
    // If this song is currently playing, pause it
    if (currentSong?.songId === track.id && isPlaying) {
      pauseSong();
      return;
    }
    
    // If we already have this song cached, play it
    if (songCache[track.id]) {
      playSong(songCache[track.id]);
      return;
    }
    
    // Fetch the song metadata with audio URL (using public endpoint - no auth required)
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
        
        // Cache the song
        setSongCache(prev => ({ ...prev, [track.id]: song }));
        
        // Play it
        playSong(song);
      } else {
        console.error('Song not found or no audio URL');
      }
    } catch (error) {
      console.error('Error fetching song:', error);
    } finally {
      setLoadingSongId(null);
    }
  }, [currentSong, isPlaying, playSong, pauseSong, songCache]);

  // Get route-specific content
  const routeConfig = getRouteConfig(location.pathname);
  const heroHeadingParts = routeConfig.heroHeading.split('\n');
  const heroSubtext = routeConfig.heroSubtext;
  const examplePrompts = routeConfig.examplePrompts;

  // Get dynamic section headers
  const headers = useSectionHeaders();

  // Get carousel titles based on route category (with fallback to default)
  const routeCategory: RouteCategory = routeConfig.routeCategory || 'default';
  const carouselTitles = carouselTitlesByCategory[routeCategory];

  // Scroll to top when route changes (makes navigation feel like a new page)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Check for ?auth=open query param to open auth modal (used by PaymentPage etc)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('auth') === 'open' && !user) {
      setOpen(true);
      // Clear the query param from URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.search, location.pathname, user]);

  // Track scroll progress for header blur effect (0 = top, 1 = scrolled 100px+)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 100, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate to create page with prompt
  const handleGenerateClick = useCallback(() => {
    if (user) {
      // Navigate to create page with prompt as query param
      const createUrl = prompt.trim() 
        ? `/create?tab=song&prompt=${encodeURIComponent(prompt.trim())}`
        : '/create?tab=song';
      navigate(createUrl);
    } else {
      // Save prompt to localStorage for after login, then open auth modal
      if (prompt.trim()) {
        localStorage.setItem('pendingPrompt', prompt.trim());
      }
      setOpen(true);
    }
  }, [user, navigate, prompt]);

  // Navigate to create page after successful login with saved prompt
  useEffect(() => {
    if (user && open) {
      const savedPrompt = localStorage.getItem('pendingPrompt');
      localStorage.removeItem('pendingPrompt'); // Clear after using
      setOpen(false); // Close auth modal
      
      // Navigate to create page with the saved prompt
      const createUrl = savedPrompt 
        ? `/create?tab=song&prompt=${encodeURIComponent(savedPrompt)}`
        : '/create?tab=song';
      navigate(createUrl);
    }
  }, [user, open, navigate]);

  const handleClickOpen = useCallback(async () => {
    if (user) {
      // Navigate to dashboard - token check happens when user tries to generate
      navigate('/my-music');
      return;
    }
    setOpen(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setError(null);
  }, [user, navigate]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setIsLoading(false);
    setIsGoogleLoading(false);
  }, []);

  const handleFAQChange = useCallback((panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFAQ(isExpanded ? panel : false);
  }, []);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setAuthTab(newValue);
    setError(null);
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEmailSignup = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password || !username) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters with uppercase, number, and special character');
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
        setIsLoading(false);
        handleClose();
        showSnackbar('Account created! Please check your email to verify.');
      } else {
        setIsLoading(false);
        setError(result.payload || 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(authError || 'Signup failed. Please try again.');
    }
  }, [signup, authError, email, password, confirmPassword, username, handleClose]);

  const handleGoogleSignup = useCallback(async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      
      const accessToken = await getGoogleIdToken();
      const result = await googleLogin(accessToken);
      
      if (result.type === 'auth/loginWithGoogle/fulfilled') {
        showSnackbar('Signed in with Google successfully!');
        const userData = result.payload.user;
        
        if (!userData.isVerified) {
          try {
            await resendVerificationEmail(userData.email);
            showSnackbar('Verification email sent - please check your inbox.');
          } catch (err) {
            console.error('Failed to resend verification email:', err);
          }
        } else {
          navigate('/my-music');
        }
      } else {
        setError(result.payload || 'Google login failed.');
      }
    } catch (error: any) {
      if (error.error === 'popup_closed_by_user') {
        setError('Google sign-in was cancelled.');
      } else {
        setError(authError || 'Google sign-in failed.');
      }
    } finally {
      setIsGoogleLoading(false);
      handleClose();
    }
  }, [googleLogin, authError, getGoogleIdToken, resendVerificationEmail, navigate, handleClose]);

  const handleEmailLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      const result = await login(email, password);
      setIsLoading(false);

      if (result.type === 'auth/loginWithEmail/fulfilled') {
        handleClose();
        const userData = result.payload.user;
        
        if (!userData.isVerified) {
          try {
            await resendVerificationEmail(userData.email);
            showSnackbar('Verification email sent - please check your inbox.');
          } catch (err) {
            console.error('Failed to resend verification email:', err);
          }
        } else {
          showSnackbar('Logged in successfully!');
          navigate('/my-music');
        }
      } else {
        setError(result.payload || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(authError || 'Login failed.');
    }
  }, [login, authError, email, password, navigate, resendVerificationEmail, handleClose]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (authTab === 0) {
      handleEmailLogin();
      } else {
        handleEmailSignup();
      }
    }
  }, [authTab, handleEmailLogin, handleEmailSignup, isLoading]);

  const handlePromptKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && prompt.trim()) {
      handleGenerateClick();
    }
  }, [prompt, handleGenerateClick]);

  const handleToggleInterval = useCallback(() => {
    setIsYearly(!isYearly);
  }, [isYearly]);

  // Handle subscription button click - direct to Stripe checkout if logged in
  const handleSubscribeClick = useCallback(async (planId: string) => {
    // Find the plan
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    // If user is logged in
    if (isLoggedIn) {
      // If already subscribed (not free tier), go to dashboard
      if (subscription && subscription.tier !== 'free') {
        navigate('/my-music');
        return;
      }

      // Otherwise, go directly to Stripe checkout
      setIsCheckoutLoading(planId);
      try {
        const priceId = isYearly ? plan.stripePrices.yearly : plan.stripePrices.monthly;
        const productId = plan.productId;
        
        const resultAction = await dispatch(createCheckoutSession({ priceId, productId }));
        
        if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
          window.location.href = resultAction.payload.url;
        } else {
          showSnackbar('Failed to create checkout session. Please try again.', 'error');
        }
      } catch (err) {
        console.error('Checkout error:', err);
        showSnackbar('Something went wrong. Please try again.', 'error');
      } finally {
        setIsCheckoutLoading(null);
      }
    } else {
      // Not logged in - save pending plan and show auth dialog
      setPendingPlanId(planId);
      setSelectedPlan(planId);
      setOpen(true);
    }
  }, [isLoggedIn, subscription, isYearly, dispatch, navigate]);

  // After successful login/signup, check if there's a pending plan
  useEffect(() => {
    if (isLoggedIn && pendingPlanId && !open) {
      // User just logged in and had a pending plan - trigger checkout
      handleSubscribeClick(pendingPlanId);
      setPendingPlanId(null);
    }
  }, [isLoggedIn, pendingPlanId, open, handleSubscribeClick]);

  // Fetch video URLs from public API endpoint
  useEffect(() => {
    const fetchVideoUrls = async () => {
      const urls: Record<string, string> = {};
      const allVideos = [...promoVideosPortrait.slice(0, 3), ...promoVideosLandscape];

      await Promise.all(
        allVideos.map(async (video) => {
          try {
            const response = await api.get(`/api/public/videos/${video.id}`);
            if (response.data?.videoUrl) {
              urls[video.id] = response.data.videoUrl;
            }
          } catch (err) {
            console.error(`Error fetching video URL for ${video.id}:`, err);
          }
        })
      );

      setVideoUrls(urls);
    };

    fetchVideoUrls();
  }, []);

  // Create structured data for SEO
  const trackStructuredData = useMemo(() => createMusicPlaylistStructuredData({
    name: 'Gruvi Featured Tracks for You',
    description: 'Listen to AI-generated music created with Gruvi. High-quality songs across all genres.',
    url: 'https://gruvi.ai/',
    tracks: sampleTracks.slice(0, 10).map(track => ({
      name: track.title,
      duration: `PT${track.duration.replace(':', 'M')}S`,
      genre: track.genre,
    })),
  }), [sampleTracks]);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#0D0D0F',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
      // Add bottom padding when audio player is visible
      pb: hasActivePlayer ? 12 : 0,
    }}>
      {/* SEO */}
      <SEO
        title="Gruvi: AI Music Generator & Video Maker | Create Songs & Promo Videos in 32 Genres & 24 Languages"
        description="Create AI-generated songs, cinematic music videos, and stunning promo videos with Gruvi. Generate professional music in 32 genres (pop, hip-hop, rock, jazz, K-pop, anime) and 24 languages. Create brand videos like Rolex, Tesla, and Chanel. Perfect for artists, content creators, Airbnb hosts, e-commerce stores, and businesses."
        keywords="AI music generator, AI song generator, create music with AI, AI music videos, AI promo videos, product video generator, Airbnb promo video, Gruvi, brand video maker, e-commerce video, promotional videos, K-pop generator, anime music video, custom character video, 3D cartoon music video, cinematic video maker, multilingual music generator, AI beat maker, lyrics generator, free music generator, Tesla video, Rolex video, luxury brand promo"
        ogTitle="Gruvi: AI Music & Video Generator | 32 Genres, 24 Languages"
        ogDescription="Create AI-generated songs and stunning promo videos. Make cinematic music videos with custom characters. Create brand videos for products, Airbnb, and e-commerce."
        ogType="website"
        ogUrl="https://gruvimusic.com/"
        twitterTitle="Gruvi: AI Music & Video Generator | Songs & Promo Videos"
        twitterDescription="Create AI-generated songs and stunning promo videos. Make cinematic music videos with custom characters. Perfect for artists, brands, and content creators."
        structuredData={[
          trackStructuredData,
          createSoftwareAppStructuredData(),
          createOrganizationStructuredData(),
        ]}
      />

      <MarketingHeader onOpenAuth={handleClickOpen} transparent alwaysBlurred />

      {/* Master Gradient Wrapper - One seamless gradient for entire page */}
      <Box sx={{
        background: 'linear-gradient(180deg, #050B14 0%, #0A1628 8%, #0D1F30 15%, #0F2838 22%, #11303E 30%, #133844 40%, #11303E 50%, #0F2838 60%, #0D1F30 68%, #0A1628 76%, #070F1A 84%, #050A12 92%, #0D0D0F 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}>

      {/* Hero Section with Prompt Input */}
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 10 },
        position: 'relative',
        zIndex: 1,
        background: 'transparent',
        // Subtle gradient accent on edges
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-10%',
          width: '50%',
          height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(13, 185, 180, 0.12) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '50%',
          height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        },
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Badge */}
            <Chip
              label={routeConfig.heroTagline || headers.hero.badge}
              size="small"
              sx={{
                mb: 3,
                background: 'rgba(0, 206, 209, 0.15)',
                color: '#00CED1',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
                border: '1px solid rgba(0, 206, 209, 0.3)',
              }}
            />

            {/* Main Headline with Gruvi branding - animated gradient */}
          <Typography
            variant="h1"
            sx={{
                fontSize: { xs: '2.25rem', sm: '3.25rem', md: '4rem' },
                fontWeight: 800,
                color: '#FFFFFF',
              lineHeight: 1.1,
                mb: 1.5,
                letterSpacing: '-0.01em',
                px: { xs: 1, sm: 0 },
              }}
            >
              <Box
                component="span"
            sx={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #0EA5E9 50%, #06B6D4 100%)',
                  backgroundSize: '200% 200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 4s ease infinite',
                  '@keyframes gradientShift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                  },
                }}
              >
                {heroHeadingParts.length > 1 ? heroHeadingParts[0] : headers.hero.title}
              </Box>
              {heroHeadingParts.length > 1 && (
                <Box component="span" sx={{ display: 'block', color: '#FFFFFF' }}>
                  {heroHeadingParts[1]}
                </Box>
              )}
          </Typography>

            {/* Tagline */}
          <Typography
            sx={{
                fontFamily: '"Fredoka", "Inter", sans-serif',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.85rem' },
                fontWeight: 600,
                color: 'rgba(255,255,255,0.7)',
                mb: 3,
            }}
          >
              {heroSubtext || headers.hero.subtitle}
          </Typography>

            {/* CTA Buttons */}
            <Box sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <Button
                variant="contained"
                onClick={handleClickOpen}
                sx={{
                  background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                  backgroundColor: 'transparent !important',
                  color: '#fff !important',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                    backgroundColor: 'transparent !important',
                    color: '#fff !important',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5) !important',
                  },
                }}
              >
                Start Your Free Trial
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  document.getElementById('promo-videos-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                sx={{
                  borderColor: '#00D4AA !important',
                  borderWidth: '2px !important',
                  color: '#FFFFFF !important',
                  backgroundColor: 'transparent !important',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
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
                See AI in Action
              </Button>
            </Box>
          </Box>
        </Container>


      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: 0
      }} />

      {/* ============================================
          PROMO VIDEOS SECTION - Using VideoShowcase Component
          ============================================ */}
      <Box id="promo-videos-section" sx={{ position: 'relative', background: 'transparent' }}>
        <VideoShowcase
          videos={promoVideosPortrait.slice(0, 3).map(v => ({
            id: v.id,
            title: v.title,
            style: v.style,
            thumbnail: v.thumbnail,
            tag: v.tag
          }))}
          videoUrls={videoUrls}
          title={<><Box component="span" sx={{ background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI-Powered</Box> Product Videos</>}
          subtitle="Create stunning product videos with AI"
          badge="UGC Content"
          ctaText="Start Creating"
          ctaLink={isLoggedIn ? '/create/video' : undefined}
          onVideoClick={(video) => navigate(`/videos/${video.title.toLowerCase().replace(/\s+/g, '-')}`)}
          darkMode
          gradientBackground="transparent"
          playButtonColor="#06B6D4"
          badgeBackground="rgba(0, 212, 170, 0.15)"
          badgeColor="#00D4AA"
        />
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: 0
      }} />

      {/* Product Promo Video Section - Side by side layout */}
      {promoVideosLandscape.length > 0 && (
        <Box sx={{
          py: { xs: 8, md: 10 },
          position: 'relative',
          background: 'transparent',
        }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 4, md: 6 },
                alignItems: 'center',
              }}
            >
              {/* Text Content on Left */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Chip
                  label="Promo Videos"
                  size="small"
                  sx={{
                    mb: 2,
                    width: 'fit-content',
                    background: 'rgba(139, 92, 246, 0.2)',
                    color: '#A78BFA',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 28,
                    borderRadius: '12px',
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    fontWeight: 700,
                    color: '#fff',
                    mb: 2,
                  }}
                >
                  Cinematic{' '}
                  <Box component="span" sx={{
                    background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Brand Videos
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.7)',
                    mb: 3,
                    lineHeight: 1.7,
                  }}
                >
                  Showcase your products with cinematic videos
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.5 }}>
                  {[
                    'Cinematic quality visually stunning videos',
                    'Perfect for YouTube ads & social media',
                    'AI handles editing, music & effects',
                  ].map((point, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleIcon sx={{ color: '#A78BFA', fontSize: 20 }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{point}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              {/* Video Card on Right */}
              <Box sx={{ flex: 1, width: '100%' }}>
                <LandscapeVideoCard
                  video={promoVideosLandscape[0]}
                  videoUrl={videoUrls[promoVideosLandscape[0].id]}
                  onClick={() => navigate(`/videos/${promoVideosLandscape[0].title.toLowerCase().replace(/\s+/g, '-')}`)}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* Airbnb/Property Video Section - Side by side layout (video on left on desktop) */}
      {promoVideosLandscape.length > 1 && (
        <Box sx={{
          py: { xs: 6, md: 8 },
          position: 'relative',
          background: 'transparent',
        }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 4, md: 6 },
                alignItems: 'center',
              }}
            >
              {/* Text Content - first on mobile, second on desktop */}
              <Box sx={{ flex: 1, order: { xs: 0, md: 1 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Chip
                  label="Property Videos"
                  size="small"
                  sx={{
                    mb: 2,
                    width: 'fit-content',
                    background: 'rgba(78, 205, 196, 0.2)',
                    color: '#4ECDC4',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 28,
                    borderRadius: '12px',
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    fontWeight: 700,
                    color: '#fff',
                    mb: 2,
                  }}
                >
                  Create{' '}
                  <Box component="span" sx={{
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #2AB5AB 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Airbnb Videos
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.7)',
                    mb: 3,
                    lineHeight: 1.7,
                  }}
                >
                  Generate stunning property tours and vacation rental showcases that convert viewers into guests.
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.5 }}>
                  {[
                    'Virtual property tours that sell',
                    'Perfect for Airbnb & real estate listings',
                    'Increase bookings & engagement',
                  ].map((point, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleIcon sx={{ color: '#4ECDC4', fontSize: 20 }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{point}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              {/* Video Card - second on mobile, first on desktop */}
              <Box sx={{ flex: 1, width: '100%', order: { xs: 1, md: 0 } }}>
                <LandscapeVideoCard
                  video={promoVideosLandscape[1]}
                  videoUrl={videoUrls[promoVideosLandscape[1].id]}
                  onClick={() => navigate(`/videos/${promoVideosLandscape[1].title.toLowerCase().replace(/\s+/g, '-')}`)}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* Music Video Section - Turn any song into a music video */}
      {promoVideosLandscape.length > 2 && (
        <Box sx={{
          py: { xs: 6, md: 8 },
          position: 'relative',
          background: 'transparent',
        }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 4, md: 6 },
                alignItems: 'center',
              }}
            >
              {/* Text Content on Left */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Chip
                  label="Music Videos"
                  size="small"
                  sx={{
                    mb: 2,
                    width: 'fit-content',
                    background: 'rgba(251, 146, 60, 0.2)',
                    color: '#FB923C',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 28,
                    borderRadius: '12px',
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    fontWeight: 700,
                    color: '#fff',
                    mb: 2,
                  }}
                >
                  Turn Any Song Into a{' '}
                  <Box component="span" sx={{
                    background: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Music Video
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.7)',
                    mb: 3,
                    lineHeight: 1.7,
                  }}
                >
                  Upload your track or create AI-generated music, then watch as AI transforms it into a stunning visual experience in any style.
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1.5 }}>
                  {[
                    'Works with any song or audio',
                    'Multiple visual styles: Anime, Cinematic, Abstract',
                    'Perfect sync with beats and rhythm',
                  ].map((point, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircleIcon sx={{ color: '#FB923C', fontSize: 20 }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>{point}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              {/* Video Card on Right */}
              <Box sx={{ flex: 1, width: '100%' }}>
                <LandscapeVideoCard
                  video={promoVideosLandscape[2]}
                  videoUrl={videoUrls[promoVideosLandscape[2].id]}
                  onClick={() => navigate(`/videos/${promoVideosLandscape[2].title.toLowerCase().replace(/\s+/g, '-')}`)}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* CTA Button to AI Video Shorts Page */}
      <Box sx={{ textAlign: 'center', pt: { xs: 3, md: 4 },pb: 10, background: 'transparent' }}>
        <Button
          component={RouterLink}
          to="/ai-video-shorts"
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
            backgroundColor: 'transparent !important',
            color: '#fff !important',
            px: { xs: 4, sm: 5 },
            py: { xs: 1.5, sm: 1.75 },
            borderRadius: '12px',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
              backgroundColor: 'transparent !important',
              color: '#fff !important',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5) !important',
            },
          }}
        >
          Explore More Videos
        </Button>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: { xs: 3, md: 4 }
      }} />

      {/* ============================================
          SOCIAL PLATFORMS SECTION - Teal/Cyan Theme Zone
          ============================================ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          position: 'relative',
          background: 'transparent',
        }}
      >
        {/* Teal/Cyan decorative orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '40%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.12) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '35%',
            height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(13, 185, 180, 0.08) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Hero-style 2-column layout with Lottie */}
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Grid container spacing={6} alignItems="center" sx={{ maxWidth: '1200px' }}>
              <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="One-Click Distribution"
                size="small"
                sx={{
                  mb: 3,
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#06B6D4',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  height: 32,
                  borderRadius: '12px',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  color: '#fff',
                  mb: 3,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                Post to{' '}
                <Box component="span" sx={{
                  background: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  All Platforms
                </Box>
                {' '}in One Click
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.7,
                  mb: 2,
                }}
              >
                Upload to YouTube, TikTok, Instagram, and all major platforms
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.7,
                  mb: 4,
                }}
              >
                Gruvi handles the formatting for each platform automatically. Schedule posts for optimal engagement times across YouTube, TikTok, Instagram, and more.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 420,
                  }}
                >
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: socialsAnimationData,
                      rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                      }
                    }}
                    isClickToPauseDisabled={true}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
          </Box>
        </Container>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        mb: { xs: 3, md: 4 },
        mt: 0
      }} />

      {/* ============================================
          FEATURED TRACKS SECTION - Teal/Cyan Theme Zone
          ============================================ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          position: 'relative',
          background: 'transparent',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Chip
              label="AI-Generated Music"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#A78BFA',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
                border: '1px solid #A78BFA',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Listen to Sample Tracks
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Discover the quality and variety
            </Typography>
          </Box>
          {/* Single carousel with columns of 3 tracks each - first 15 tracks (5 columns × 3 rows) */}
          <ScrollableCarousel id="featured-tracks-carousel">
            {(() => {
              // Use first 15 tracks (5 columns × 3 rows), group into columns of 3
              const firstBatch = sampleTracks.slice(0, 15);
              const columns: typeof sampleTracks[] = [];
              for (let i = 0; i < firstBatch.length; i += 3) {
                columns.push(firstBatch.slice(i, i + 3));
              }
              return columns.map((columnTracks, colIndex) => (
                <Box
                  key={`track-column-${colIndex}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  {columnTracks.map((track) => (
                    <Paper
                      key={track.id}
                      elevation={0}
                      onClick={() => handlePlaySampleTrack(track)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        width: { xs: 240, sm: 280, md: 300 },
                        background: currentSong?.songId === track.id ? 'rgba(59,130,246,0.15)' : 'rgba(15, 45, 69, 0.5)',
                        borderRadius: '12px',
                        border: currentSong?.songId === track.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          background: currentSong?.songId === track.id ? 'rgba(59,130,246,0.2)' : 'rgba(15, 45, 69, 0.7)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
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
                            src={genreToImage[track.genre] || '/genres/pop.jpeg'}
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
                              background: currentSong?.songId === track.id ? 'rgba(59,130,246,0.5)' : 'rgba(0,0,0,0.5)',
                              opacity: currentSong?.songId === track.id ? 1 : 0,
                              transition: 'opacity 0.2s',
                            }}
                          >
                            {loadingSongId === track.id ? (
                              <CircularProgress size={14} sx={{ color: '#fff' }} />
                            ) : currentSong?.songId === track.id && isPlaying ? (
                              <AudioEqualizer isPlaying={true} size={20} color="#fff" />
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
                            color: currentSong?.songId === track.id ? '#5AC8FA' : '#fff',
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
                            color: 'rgba(255,255,255,0.6)',
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
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                        {track.duration}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ));
            })()}
          </ScrollableCarousel>

          {/* CTA Buttons */}
          <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/create"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                backgroundColor: 'transparent !important',
                color: '#fff !important',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                  backgroundColor: 'transparent !important',
                  color: '#fff !important',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5) !important',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Create Your Own Song
            </Button>
            <Button
              component={RouterLink}
              to="/ai-music"
              variant="outlined"
              sx={{
                borderColor: '#00D4AA !important',
                borderWidth: '2px !important',
                color: '#FFFFFF !important',
                backgroundColor: 'transparent !important',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
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
              More Songs
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: { xs: 3, md: 4 }
      }} />

      {/* ============================================
          GENRES SECTION - Teal/Cyan Theme Zone (Vinyl Style)
          ============================================ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          position: 'relative',
          background: 'transparent',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Chip
              label="30+ Genres"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06B6D4',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Create in{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8A80 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Any Genre
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              From Pop to Classical, Hip-Hop to Jazz
            </Typography>
          </Box>

          {/* Vinyl-Style Genre Carousel */}
          <ScrollableCarousel id="genres-carousel">
            {genres.map((genre) => (
              <Box
                key={genre.id}
                onClick={() => navigate(`/genres/${genre.id}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: { xs: 100, sm: 120 },
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'scale(1.08)' },
                  '&:hover .genre-vinyl': {
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 8px 32px rgba(0,0,0,0.4)',
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                }}
              >
                {/* Vinyl Record Style */}
                <Box
                  className="genre-vinyl"
                  sx={{
                    width: { xs: 80, sm: 100, md: 110 },
                    height: { xs: 80, sm: 100, md: 110 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.2), 0 4px 16px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    border: '3px solid rgba(255,255,255,0.3)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, transparent 30%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={genre.image}
                    alt={genre.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Typography sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}>
                  {genre.name}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: { xs: 3, md: 4 }
      }} />

      {/* Discover More Tracks Section - remaining 3 tracks + 12 additional genre tracks = 15 total */}
      <MarketingSection darkMode
        title={<><Box component="span" sx={{ background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Sound</Box>, Your Style</>}
        subtitle="Explore AI-generated tracks across every genre"
        badge="Discover"
        badgeColor="primary"
        background="white"
        align="center"
      >
          {/* Single carousel with columns of 3 tracks each - remaining + additional tracks (5 columns × 3 rows) */}
          <ScrollableCarousel id="discover-tracks-carousel">
            {(() => {
              // Combine remaining 2 tracks from sampleTracks (30-32) with 13 additional genre tracks to make 15
              const remainingTracks = sampleTracks.slice(30);
              const combinedTracks = [...remainingTracks, ...additionalGenreTracks.slice(0, 15 - remainingTracks.length)];
              const columns: typeof combinedTracks[] = [];
              for (let i = 0; i < combinedTracks.length; i += 3) {
                columns.push(combinedTracks.slice(i, i + 3));
              }
              return columns.map((columnTracks, colIndex) => (
                <Box
                  key={`discover-track-column-${colIndex}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  {columnTracks.map((track) => (
                    <Paper
                      key={track.id}
                      elevation={0}
                      onClick={() => handlePlaySampleTrack(track)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        width: { xs: 240, sm: 280, md: 300 },
                        background: currentSong?.songId === track.id ? 'rgba(59,130,246,0.15)' : 'rgba(15, 45, 69, 0.5)',
                        borderRadius: '12px',
                        border: currentSong?.songId === track.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          background: currentSong?.songId === track.id ? 'rgba(59,130,246,0.2)' : 'rgba(15, 45, 69, 0.7)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
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
                            src={genreToImage[track.genre] || '/genres/pop.jpeg'}
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
                              background: currentSong?.songId === track.id ? 'rgba(59,130,246,0.5)' : 'rgba(0,0,0,0.5)',
                              opacity: currentSong?.songId === track.id ? 1 : 0,
                              transition: 'opacity 0.2s',
                            }}
                          >
                            {loadingSongId === track.id ? (
                              <CircularProgress size={14} sx={{ color: '#fff' }} />
                            ) : currentSong?.songId === track.id && isPlaying ? (
                              <AudioEqualizer isPlaying={true} size={20} color="#fff" />
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
                            color: currentSong?.songId === track.id ? '#5AC8FA' : '#fff',
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
                            color: 'rgba(255,255,255,0.6)',
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
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                        {track.duration}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ));
            })()}
          </ScrollableCarousel>
      </MarketingSection>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: 0
      }} />

      {/* ============================================
          ART STYLES SECTION - Teal/Cyan Theme Zone
          ============================================ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          position: 'relative',
          background: 'transparent',
        }}
      >
        {/* Teal/Cyan decorative orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '40%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '35%',
            height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(13, 185, 180, 0.06) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Chip
              label="20+ Styles"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(249, 115, 22, 0.15)',
                color: '#FB923C',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
                border: '1px solid #FB923C',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Create Videos in Any Style
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              {carouselTitles.videoStyles.subtitle}
            </Typography>
          </Box>
          <ScrollableCarousel id="styles-carousel">
            {artStyles.map((style, index) => (
              <Box
                key={index}
                onClick={() => navigate(`/styles/${style.id}`)}
                sx={{
                  minWidth: { xs: 130, sm: 150, md: 160 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.03)' },
                  '&:hover .style-card': { boxShadow: '0 12px 32px rgba(0,0,0,0.2)' },
                }}
              >
                <Box
                  className="style-card"
                  sx={{
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    mb: 1,
                  }}
                >
                  <Box
                    component="img"
                    src={style.image}
                    alt={`${style.label} style example`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Typography sx={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {style.label}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: { xs: 3, md: 4 }
      }} />

      {/* ============================================
          LANGUAGES SECTION - Teal/Cyan Theme Zone
          ============================================ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          position: 'relative',
          background: 'transparent',
          overflow: 'visible',
        }}
      >
        {/* Teal/Cyan decorative orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '40%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '35%',
            height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(13, 185, 180, 0.1) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, overflow: 'visible' }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Chip
              label="24+ Languages"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ADE80',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
                border: '1px solid #4ADE80',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Make Music in Any Language
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Create songs in 24+ languages
            </Typography>
          </Box>

          {/* Glassy Language Flag Circles */}
          <ScrollableCarousel id="languages-carousel">
            {languages.map((lang, index) => (
              <Box
                key={lang.id}
                onClick={() => navigate(`/languages/${lang.name.toLowerCase()}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: { xs: 90, sm: 110 },
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05) translateY(-4px)',
                    '& .lang-glass': {
                      boxShadow: '0 0 30px rgba(139, 92, 246, 0.5), 0 8px 24px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(255,255,255,0.4)',
                    },
                    '& .flag-wave': {
                      animationPlayState: 'paused',
                    },
                  },
                }}
              >
                {/* Glassy Circle with Flag */}
                <Box
                  className="lang-glass"
                  sx={{
                    width: { xs: 72, sm: 88, md: 96 },
                    height: { xs: 72, sm: 88, md: 96 },
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.15), 0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 1.5,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    className="flag-wave"
                    component="img"
                    src={lang.image}
                    alt={lang.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                      // Wave animation on the flag itself
                      animation: `flagWave 2.5s ease-in-out ${index * 0.15}s infinite`,
                      transformOrigin: 'left center',
                      '@keyframes flagWave': {
                        '0%, 100%': {
                          transform: 'skewX(0deg) scaleX(1)',
                        },
                        '25%': {
                          transform: 'skewX(-2deg) scaleX(1.02)',
                        },
                        '50%': {
                          transform: 'skewX(1deg) scaleX(0.98)',
                        },
                        '75%': {
                          transform: 'skewX(-1deg) scaleX(1.01)',
                        },
                      },
                    }}
                  />
                </Box>
                <Typography sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}>
                  {lang.name}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: { xs: 3, md: 4 }
      }} />

      {/* ============================================
          LANGUAGE TRACKS SECTION - Teal/Cyan Theme Zone
          ============================================ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          position: 'relative',
          background: 'transparent',
        }}
      >
        {/* Teal/Cyan decorative orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '40%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(13, 185, 180, 0.1) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '35%',
            height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Chip
              label="Multilingual"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ADE80',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
                border: '1px solid #4ADE80',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Enjoy Music from Around the World
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              AI-generated songs in 15+ languages - from English to Japanese to Arabic
            </Typography>
          </Box>
          {/* Single carousel with columns of 3 tracks each - 15 language tracks (5 columns × 3 rows) */}
          <ScrollableCarousel id="language-tracks-carousel">
            {(() => {
              const languageTracks = getLanguageTracksForRoute();
              const columns: typeof languageTracks[] = [];
              for (let i = 0; i < languageTracks.length; i += 3) {
                columns.push(languageTracks.slice(i, i + 3));
              }
              return columns.map((columnTracks, colIndex) => (
                <Box
                  key={`lang-track-column-${colIndex}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    flexShrink: 0,
                  }}
                >
                  {columnTracks.map((track) => (
                    <Paper
                      key={`${track.id}-${track.language}`}
                      elevation={0}
                      onClick={() => handlePlaySampleTrack(track)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        width: { xs: 260, sm: 290, md: 320 },
                        background: currentSong?.songId === track.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 45, 69, 0.5)',
                        borderRadius: '12px',
                        border: currentSong?.songId === track.id ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          background: currentSong?.songId === track.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 45, 69, 0.7)',
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
                          src={track.image}
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
                            background: currentSong?.songId === track.id ? 'rgba(59,130,246,0.5)' : 'rgba(0,0,0,0.5)',
                            opacity: currentSong?.songId === track.id ? 1 : 0,
                            transition: 'opacity 0.2s',
                          }}
                        >
                          {loadingSongId === track.id ? (
                            <CircularProgress size={12} sx={{ color: '#fff' }} />
                          ) : currentSong?.songId === track.id && isPlaying ? (
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
                            color: currentSong?.songId === track.id ? '#3B82F6' : '#fff',
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
                  ))}
                </Box>
              ));
            })()}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: 0
      }} />

      {/* ============================================
          MOODS SECTION - Teal/Cyan Theme Zone
          ============================================ */}
      <Box
        sx={{
          pt: { xs: 8, md: 10 },
          pb: 2,
          position: 'relative',
          background: 'transparent',
        }}
      >
        {/* Teal/Cyan decorative orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '40%',
            height: '100%',
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '35%',
            height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(13, 185, 180, 0.1) 0%, transparent 60%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Chip
              label="17 Moods"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#A78BFA',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
                border: '1px solid #A78BFA',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Set the{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Perfect Mood
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Choose from energetic beats to peaceful melodies
            </Typography>
          </Box>

          {/* Mood Cards Carousel */}
          <ScrollableCarousel id="moods-carousel">
            {moods.map((mood) => (
              <Box
                key={mood.id}
                onClick={() => navigate(`/moods/${mood.id}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  minWidth: { xs: 100, sm: 120 },
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'scale(1.08)' },
                  '&:hover .mood-card': {
                    boxShadow: '0 0 30px rgba(236, 72, 153, 0.4), 0 8px 32px rgba(0,0,0,0.4)',
                    borderColor: 'rgba(255,255,255,0.4)',
                  },
                }}
              >
                {/* Mood Image Card */}
                <Box
                  className="mood-card"
                  sx={{
                    width: { xs: 80, sm: 100, md: 110 },
                    height: { xs: 80, sm: 100, md: 110 },
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 0 20px rgba(236, 72, 153, 0.15), 0 4px 16px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    border: '2px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <Box
                    component="img"
                    src={mood.image}
                    alt={mood.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Typography sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}>
                  {mood.name}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* CTA Button for Make Your Content Gruvi */}
      <Box sx={{ textAlign: 'center', pb: { xs: 8, md: 10 }, background: 'transparent' }}>
        <Button
          variant="contained"
          onClick={() => {
            if (user) {
              navigate('/my-music');
            } else {
              setOpen(true);
              setAuthTab(1); // Open login tab
            }
          }}
          sx={{
            background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
            backgroundColor: 'transparent !important',
            color: '#fff !important',
            px: { xs: 4, sm: 5 },
            py: { xs: 1.5, sm: 1.75 },
            borderRadius: '12px',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
              backgroundColor: 'transparent !important',
              color: '#fff !important',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5) !important',
            },
          }}
        >
          Make Content Gruvi Again
        </Button>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: 0
      }} />

      {/* ============================================
          EVERYTHING YOU NEED SECTION - Teal/Cyan Theme
          ============================================ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          position: 'relative',
          background: 'transparent',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Chip
              label="All-In-One"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(249, 115, 22, 0.15)',
                color: '#FB923C',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
                border: '1px solid #FB923C',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Everything You Need to Create
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Professional music and video creation tools
            </Typography>
          </Box>

          {/* Feature Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {[
              {
                icon: <MusicNoteIcon sx={{ fontSize: 24 }} />,
                title: 'Studio-quality audio',
                description: 'Professional AI music generation.',
                color: '#06B6D4',
              },
              {
                icon: <PersonIcon sx={{ fontSize: 24 }} />,
                title: 'Custom characters',
                description: 'Add anyone to your videos.',
                color: '#10B981',
              },
              {
                icon: <ShareIcon sx={{ fontSize: 24 }} />,
                title: 'Share everywhere',
                description: 'Export to any platform.',
                color: '#EC4899',
              },
              {
                icon: <VideoLibraryIcon sx={{ fontSize: 24 }} />,
                title: 'AI music videos',
                description: 'Stunning visuals from your songs.',
                color: '#3B82F6',
              },
              {
                icon: <BoltIcon sx={{ fontSize: 24 }} />,
                title: 'Fast generation',
                description: 'Songs in seconds, not minutes.',
                color: '#FBBF24',
              },
              {
                icon: <ThumbUpIcon sx={{ fontSize: 24 }} />,
                title: 'Commercial license',
                description: 'Use for content and streaming.',
                color: '#A855F7',
              },
              {
                icon: <HomeWorkIcon sx={{ fontSize: 24 }} />,
                title: 'Property promos',
                description: 'Showcase Airbnbs and rentals.',
                color: '#14B8A6',
              },
              {
                icon: <ShoppingBagIcon sx={{ fontSize: 24 }} />,
                title: 'Product videos',
                description: 'Promote your brand and products.',
                color: '#F97316',
              },
              {
                icon: <TranslateIcon sx={{ fontSize: 24 }} />,
                title: '24 languages',
                description: 'Most popular languages supported.',
                color: '#EF4444',
              },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                    boxShadow: `0 8px 32px ${feature.color}20`,
                    transform: 'translateY(-4px)',
                    border: `1px solid ${feature.color}40`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    color: feature.color,
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: `${feature.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#fff', mb: 0.5 }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: 0
      }} />

      {/* Pricing Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 1,
          background: 'transparent',
        }}
      >
        {/* Decorative orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '-10%',
            width: '40%',
            height: '60%',
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '-10%',
            width: '40%',
            height: '60%',
            background: 'radial-gradient(ellipse at center, rgba(13, 185, 180, 0.08) 0%, transparent 60%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Pricing"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#A78BFA',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
                border: '1px solid #A78BFA',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              Choose Your Plan
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', mb: 4, maxWidth: '500px', mx: 'auto' }}>
              Start creating for free
            </Typography>

            {/* Billing Toggle - Dark themed */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                p: 1,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography
                onClick={() => isYearly && handleToggleInterval()}
                sx={{
                  fontWeight: !isYearly ? 600 : 400,
                  color: !isYearly ? '#fff' : 'rgba(255,255,255,0.5)',
                  px: 2,
                  py: 0.75,
                  borderRadius: '12px',
                  background: !isYearly ? 'rgba(255,255,255,0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Monthly
              </Typography>
              <Box
                onClick={() => !isYearly && handleToggleInterval()}
                sx={{
                  fontWeight: isYearly ? 600 : 400,
                  color: isYearly ? '#fff' : 'rgba(255,255,255,0.5)',
                  px: 2,
                  py: 0.75,
                  borderRadius: '12px',
                  background: isYearly ? 'rgba(255,255,255,0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                Yearly
                {isYearly && (
                  <Chip
                    label="SAVE 25%"
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      height: 20,
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Pricing Cards - Followr-style with gradient headers */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: '1100px',
              mx: 'auto',
            }}
          >
            {plans.map((plan, index) => {
              // Get shadow color for each plan
              const getShadowColor = () => {
                if (plan.id === 'starter') return 'rgba(59,130,246,0.3)';
                if (plan.id === 'scale') return 'rgba(236,72,153,0.3)';
                return 'rgba(239,68,68,0.3)'; // beast
              };
              const shadowColor = getShadowColor();

              return (
                <Card
                  key={plan.id}
                  onClick={() => handleSubscribeClick(plan.id)}
                  sx={{
                    background: plan.popular
                      ? 'linear-gradient(145deg, rgba(30,30,35,1) 0%, rgba(25,25,30,1) 100%)'
                      : 'linear-gradient(145deg, rgba(20,20,25,1) 0%, rgba(15,15,20,1) 100%)',
                    borderRadius: '24px',
                    position: 'relative',
                    overflow: 'visible',
                    cursor: 'pointer',
                    border: plan.popular
                      ? '2px solid rgba(236,72,153,0.5)'
                      : plan.id === 'beast'
                        ? '2px solid rgba(249,115,22,0.4)'
                        : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: plan.popular
                      ? '0 24px 80px rgba(236,72,153,0.2)'
                      : plan.id === 'beast'
                        ? '0 16px 60px rgba(249,115,22,0.15)'
                        : '0 8px 40px rgba(0,0,0,0.2)',
                    transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
                    zIndex: plan.popular ? 2 : 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: `cardFadeIn 0.5s ease ${index * 100}ms forwards`,
                    opacity: 0,
                    '@keyframes cardFadeIn': {
                      from: { opacity: 0, transform: plan.popular ? 'scale(0.98) translateY(20px)' : 'scale(0.95) translateY(20px)' },
                      to: { opacity: 1, transform: plan.popular ? 'scale(1.03)' : 'scale(1)' },
                    },
                    '&:hover': {
                      transform: plan.popular ? 'scale(1.06) translateY(-8px)' : 'scale(1.02) translateY(-8px)',
                      boxShadow: plan.popular
                        ? '0 32px 80px rgba(236,72,153,0.3)'
                        : '0 24px 60px rgba(0,0,0,0.3)',
                      background: plan.popular
                        ? 'linear-gradient(145deg, rgba(35,35,40,1) 0%, rgba(30,30,35,1) 100%)'
                        : 'linear-gradient(145deg, rgba(25,25,30,1) 0%, rgba(20,20,25,1) 100%)',
                    },
                  }}
                >
                  {/* Most Popular Badge - Using PulsingBadge component */}
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -14,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                      }}
                    >
                      <PulsingBadge
                        label="Most Popular"
                        gradient={plan.gradient}
                        size="medium"
                      />
                    </Box>
                  )}

                  {/* Gradient Header with Token Display */}
                  <Box
                    sx={{
                      background: plan.gradient,
                      borderRadius: '21px 21px 0 0',
                      p: 3,
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Sparkle effects */}
                    <Box sx={{
                      position: 'absolute',
                      top: '20%',
                      left: '15%',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.6)',
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: '60%',
                      right: '20%',
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.5)',
                    }} />

                    {/* Diamond Icon */}
                    <Box sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 1.5,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}>
                      <DiamondIcon sx={{ fontSize: 32, color: '#fff' }} />
                    </Box>

                    {/* Token Number */}
                    <Typography
                      sx={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: '#fff',
                        lineHeight: 1,
                        mb: 0.5,
                      }}
                    >
                      {plan.tokens.toLocaleString()}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 500,
                      }}
                    >
                      AI Media Tokens per month
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 3, pt: 2.5 }}>
                    {/* Plan Title */}
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        background: plan.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textAlign: 'center',
                        mb: 0.5,
                      }}
                    >
                      {plan.title}
                    </Typography>

                    {/* Tagline */}
                    <Typography
                      sx={{
                        fontSize: '0.9rem',
                        color: '#fff',
                        textAlign: 'center',
                        mb: 2,
                        minHeight: 40,
                        fontWeight: 500,
                      }}
                    >
                      {plan.tagline}
                    </Typography>

                    {/* Price - Using AnimatedPrice component */}
                    <Box sx={{ textAlign: 'center', mb: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                      <AnimatedPrice
                        price={isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                        duration={400}
                        fontSize="2.5rem"
                        fontWeight={800}
                        color="#fff"
                      />
                      <Typography
                        component="span"
                        sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', ml: 0.5 }}
                      >
                        /month
                      </Typography>
                    </Box>

                    {/* Billed annually text */}
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        color: 'rgba(255,255,255,0.5)',
                        textAlign: 'center',
                        mb: 2.5,
                      }}
                    >
                      {isYearly
                        ? `Billed annually: $${plan.yearlyPrice} • Save 25%`
                        : `Or $${Math.round(plan.yearlyPrice / 12)}/mo billed yearly`}
                    </Typography>

                    {/* CTA Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={isCheckoutLoading === plan.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubscribeClick(plan.id);
                      }}
                      sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '1rem',
                        mb: 2.5,
                        background: `${plan.gradient} !important`,
                        backgroundColor: 'transparent',
                        color: '#fff',
                        boxShadow: `0 4px 12px ${shadowColor}`,
                        '&:hover': {
                          background: `${plan.gradient} !important`,
                          filter: 'brightness(1.1)',
                          boxShadow: `0 6px 20px ${shadowColor}`,
                        },
                      }}
                    >
                      {isCheckoutLoading === plan.id ? (
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                      ) : (
                        'Start Your Free Trial'
                      )}
                    </Button>

                    {/* Features List */}
                    <List dense disablePadding sx={{ mb: 0 }}>
                      {plan.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} disableGutters sx={{ py: 0.4 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircleIcon sx={{
                              fontSize: 18,
                              background: plan.gradient,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              sx: { color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

        </Container>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: 0
      }} />

      {/* FAQ Section - Dark themed */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 1,
          background: 'transparent',
        }}
        id="faq"
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="FAQ"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06B6D4',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem' }}>
              Everything you need to know about creating music with AI
            </Typography>
          </Box>

          {/* Dark accordion container */}
          <Box
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {faqItems.map((faq, index) => {
              const faqSlug = faq.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              return (
                <Accordion
                  key={faqSlug}
                  id={faqSlug}
                  expanded={expandedFAQ === faqSlug}
                  onChange={handleFAQChange(faqSlug)}
                  sx={{
                    background: 'rgba(15, 45, 69, 0.3)',
                    borderBottom: index !== faqItems.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: 0,
                      background: 'rgba(15, 45, 69, 0.5)',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#06B6D4' }} />}
                    sx={{
                      padding: '20px 24px',
                      '& .MuiAccordionSummary-content': { margin: '0' },
                      transition: 'background 0.2s ease',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.02)',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#FFFFFF',
                        textAlign: 'left',
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: '0 24px 24px 24px' }}>
                    <Box>
                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.95rem',
                          lineHeight: 1.8,
                          textAlign: 'left',
                          mb: 2,
                        }}
                      >
                        {faq.answer}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          component={RouterLink}
                          to={`/faq/${faqSlug}`}
                          variant="text"
                          size="small"
                          endIcon={<KeyboardArrowRightIcon />}
                          sx={{
                            color: '#3B82F6',
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              background: 'rgba(59, 130, 246, 0.1)',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          Read More
                        </Button>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              component={RouterLink}
              to="/faq"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                backgroundColor: 'transparent !important',
                color: '#fff !important',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                border: 'none',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3B82F6 35%, #00D4AA 100%) !important',
                  backgroundColor: 'transparent !important',
                  color: '#fff !important',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.5) !important',
                },
              }}
            >
              View All FAQs
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: 0
      }} />

      {/* Explore Routes Section - Dark with white pills */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          position: 'relative',
          zIndex: 1,
          background: 'transparent',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Explore"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06B6D4',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 28,
                borderRadius: '12px',
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontWeight: 700,
                color: '#FFFFFF',
                mb: 1.5,
                letterSpacing: '-0.02em',
              }}
            >
              Explore More
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>
              Discover all the ways you can create with Gruvi
            </Typography>
          </Box>

          {/* Pill buttons grid */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              justifyContent: 'center',
              maxWidth: '900px',
              mx: 'auto',
            }}
          >
            {quickRoutes.map((route) => (
              <Chip
                key={route.path}
                component={RouterLink}
                to={route.path}
                label={route.label}
                clickable
                sx={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  px: 2,
                  height: 44,
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 0 24px rgba(78, 205, 196, 0.3), 0 8px 24px rgba(0,0,0,0.3)',
                  },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* End Master Gradient Wrapper */}
      </Box>

      {/* Section Divider */}
      <Box sx={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
        my: 0
      }} />

      {/* Final CTA + Footer - Continue previous section's color */}
      <Box
        sx={{
          background: '#0D0D0F',
          position: 'relative',
        }}
      >
        <CTASection
          title="Ready to Create Amazing Music?"
          subtitle="Join thousands of creators making music and videos with AI. Start for free today."
          primaryButtonText="Start Creating Free"
          primaryButtonAction={handleClickOpen}
          variant="dark"
        />

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
            }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
              © {new Date().getFullYear()} Gruvi. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link
                component={RouterLink}
                to="/terms"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#fff' },
                }}
              >
                Terms
              </Link>
              <Link
                component={RouterLink}
                to="/privacy"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#fff' },
                }}
              >
                Privacy
              </Link>
            </Box>
          </Box>
        </Container>
        </Box>
      </Box>

      {/* Auth Dialog - Dark Theme */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'rgba(20, 20, 24, 0.95)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pt: 4,
          pb: 0,
          px: 4,
          textAlign: 'center',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
            {authTab === 0 ? 'Welcome back' : 'Create account'}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'rgba(255,255,255,0.6)',
              '&:hover': { background: 'rgba(255,255,255,0.1)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Tabs 
            value={authTab} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'none',
              },
              '& .Mui-selected': {
                color: '#FFFFFF',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#007AFF',
              }
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: '12px',
                  background: 'rgba(255, 59, 48, 0.1)',
                  border: '1px solid rgba(255, 59, 48, 0.2)',
                  color: '#D70015',
                  '& .MuiAlert-icon': { alignItems: 'center', color: '#D70015' },
                }}
              >
                {error}
              </Alert>
            )}
            
            {authTab === 0 ? (
              <>
                <TextField
                  autoFocus
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <Box sx={{ textAlign: 'right', mb: 3 }}>
                  <Link
                    component={RouterLink}
                    to="/reset-password-request"
                    sx={{ fontSize: '0.875rem', color: '#007AFF', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Forgot password?
                  </Link>
                </Box>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={handleEmailLogin}
                  disabled={isLoading}
                  sx={{ 
                    mb: 2, 
                    py: 1.5,
                    borderRadius: '12px',
                    background: '#141418',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': { background: '#000' },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
                </Button>
              </>
            ) : (
              <>
                <TextField
                  autoFocus
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={handleEmailSignup}
                  disabled={isLoading}
                  sx={{ 
                    mb: 2, 
                    py: 1.5,
                    borderRadius: '12px',
                    background: '#141418',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': { background: '#000' },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Account'}
                </Button>
              </>
            )}

            <Box sx={{ position: 'relative', my: 3 }}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                background: 'rgba(255,255,255,0.1)'
              }} />
            <Typography
              sx={{
                  position: 'relative',
                  display: 'inline-block',
                  px: 2,
                  background: 'rgba(20, 20, 24, 0.95)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.875rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                or
            </Typography>
            </Box>

            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={
                isGoogleLoading ? (
                  <CircularProgress size={18} sx={{ color: 'rgba(255,255,255,0.6)' }} />
                ) : (
                  <Box
                    component="img"
                    src="/google-color.svg"
                    alt="Google"
                    sx={{ width: 18, height: 18 }}
                  />
                )
              }
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                borderColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              Continue with Google
            </Button>

            {authTab === 1 && (
          <Typography 
                sx={{ 
                  mt: 3, 
                  textAlign: 'center', 
                  fontSize: '0.75rem', 
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.5,
                }}
              >
                By signing up, you agree to our{' '}
                <Link component={RouterLink} to="/terms" sx={{ color: '#007AFF' }}>
                  Terms
                </Link>
                {' '}and{' '}
                <Link component={RouterLink} to="/privacy" sx={{ color: '#007AFF' }}>
                  Privacy Policy
                </Link>
          </Typography>
            )}
      </Box>
        </DialogContent>
      </Dialog>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 7 }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ 
            borderRadius: '12px',
            background: snackbarSeverity === 'error' 
              ? 'rgba(255, 59, 48, 0.1)' 
              : 'rgba(6, 182, 212, 0.1)',
            border: snackbarSeverity === 'error'
              ? '1px solid rgba(255, 59, 48, 0.2)'
              : '1px solid rgba(6, 182, 212, 0.2)',
            color: snackbarSeverity === 'error' ? '#D70015' : '#06B6D4',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            '& .MuiAlert-icon': { 
              color: snackbarSeverity === 'error' ? '#D70015' : '#06B6D4'
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Tokens Upgrade Popup */}
      <UpgradePopup
        open={showUpgradePopup}
        message="Upgrade your subscription or top up to get more tokens!"
        title="Tokens"
        isPremiumTier={isPremiumTier}
        onClose={() => setShowUpgradePopup(false)}
        onTopUp={handleTopUp}
        onUpgrade={handleUpgradePlan}
        isTopUpLoading={isTopUpLoading}
      />
    </Box>
  );
};

export default HomePage; 
