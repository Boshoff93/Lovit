import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
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
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { createCheckoutSession } from '../store/authSlice';
import { faqItems } from './FAQPage';
import { songsApi } from '../services/api';
import UpgradePopup from '../components/UpgradePopup';
import { topUpBundles, TopUpBundle } from '../config/stripe';
// PauseRoundedIcon replaced with AudioEqualizer component
import { SEO, createMusicPlaylistStructuredData, createSoftwareAppStructuredData, createOrganizationStructuredData } from '../utils/seoHelper';

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

// Language sample tracks - using the same tracks as LanguageDetailPage (one per language, 15 total)
// These are distinct tracks not used elsewhere on the page
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
  'japanese': 'js', 'korean': 'ko', 'chinese': 'zh', 'portuguese': 'pt',
  'italian': 'it', 'hindi': 'hi', 'arabic': 'ar', 'russian': 'ru',
  'turkish': 'tr', 'thai': 'th', 'vietnamese': 'vi',
};

// Function to get language tracks (15 distinct tracks, one per language)
function getLanguageTracksForRoute(): Array<{id: string; title: string; language: string; duration: string; image: string}> {
  return languageOrder.map(lang => {
    const track = languageSampleTracks[lang][0];
    const langName = lang.charAt(0).toUpperCase() + lang.slice(1);
    const imageCode = languageToImageCode[lang] || lang.slice(0, 2);
    return { ...track, language: langName, image: `/locales/${imageCode}.jpeg` };
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

// Subscription plans
// Token-based pricing system
// Token costs:
// 1 Song = 20 tokens
// 1 Still Image Video = 100 tokens
// 1 Animated/Cinematic Video = 1,000 tokens

interface PricePlan {
  id: string;
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  tokens: number;
  musicVideos: boolean;
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
    monthlyPrice: 9.99,
    yearlyPrice: 107.88, // 10% off ($8.99/mo)
    tokens: 1000,
    musicVideos: true,
    features: [
      '1,000 tokens/month',
      '~50 songs',
      '~10 still image videos',
      '~1 cinematic video',
      'Standard quality audio',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.starter.monthly,
      yearly: stripeConfig.starter.yearly
    },
    productId: stripeConfig.starter.productId
  },
  {
    id: 'pro',
    title: 'Pro',
    monthlyPrice: 39.99,
    yearlyPrice: 431.88, // 10% off ($35.99/mo)
    popular: true,
    tokens: 5000,
    musicVideos: true,
    features: [
      '5,000 tokens/month',
      '~250 songs',
      '~50 still image videos',
      '~5 cinematic videos',
      'High quality audio',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.pro.monthly,
      yearly: stripeConfig.pro.yearly
    },
    productId: stripeConfig.pro.productId
  },
  {
    id: 'premium',
    title: 'Premium',
    monthlyPrice: 79.99,
    yearlyPrice: 863.88, // 10% off ($71.99/mo)
    tokens: 10000,
    musicVideos: true,
    features: [
      '10,000 tokens/month',
      '~500 songs',
      '~100 still image videos',
      '~10 cinematic videos',
      'Highest quality audio',
      'Priority generation',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.premium.monthly,
      yearly: stripeConfig.premium.yearly
    },
    productId: stripeConfig.premium.productId
  }
];


// Section Divider Component
const SectionDivider: React.FC = () => (
  <Container maxWidth="md">
    <Box
      sx={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,122,255,0.15) 20%, rgba(0,0,0,0.12) 50%, rgba(0,122,255,0.15) 80%, transparent 100%)',
        my: { xs: 2, md: 4 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '20px',
          background: 'radial-gradient(ellipse at center, rgba(0,122,255,0.08) 0%, transparent 70%)',
          filter: 'blur(8px)',
        },
      }}
    />
  </Container>
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
  const containerRef = React.useRef<HTMLDivElement>(null);

  const checkScrollPosition = React.useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
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
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Left fade + arrow */}
      {showLeftArrow && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: -1,
              top: -8,
              bottom: -8,
              width: 64,
              background: 'linear-gradient(to right, #fff 0%, #fff 20%, transparent 100%)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              background: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              width: 40,
              height: 40,
              '&:hover': {
                background: '#fff',
                transform: 'translateY(-50%) scale(1.05)',
              },
            }}
          >
            <ChevronLeftIcon sx={{ color: '#1D1D1F' }} />
          </IconButton>
        </>
      )}

      {/* Right fade + arrow */}
      {showRightArrow && (
        <>
          <Box
            sx={{
              position: 'absolute',
              right: -1,
              top: -8,
              bottom: -8,
              width: 64,
              background: 'linear-gradient(to left, #fff 0%, #fff 20%, transparent 100%)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              background: '#fff',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              width: 40,
              height: 40,
              '&:hover': {
                background: '#fff',
                transform: 'translateY(-50%) scale(1.05)',
              },
            }}
          >
            <ChevronRightIcon sx={{ color: '#1D1D1F' }} />
          </IconButton>
        </>
      )}

      {/* Scrollable content */}
      <Box
        ref={containerRef}
        id={id}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          py: 1, // Add vertical padding for hover transforms
          px: 0.5, // Add horizontal padding so edge items aren't clipped
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// Video Card Component for reuse
interface VideoCardProps {
  video: VideoItem;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const isLandscape = video.aspectRatio === 'landscape';
  const portraitWidth = { xs: 150, sm: 175, md: 200 };
  const landscapeWidth = { xs: 280, sm: 320, md: 360 };

  return (
    <Box
      onClick={onClick}
      sx={{
        width: isLandscape ? landscapeWidth : portraitWidth,
        minWidth: isLandscape ? landscapeWidth : portraitWidth,
        flexShrink: 0,
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-2px) scale(1.02)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
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
        <Box
          component="img"
          src={video.thumbnail}
          alt={video.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Tag - top right with glassy blur (brand tag or style) */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            px: 1.5,
            py: 0.5,
            borderRadius: '100px',
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
              color: '#1D1D1F',
              letterSpacing: '0.02em',
            }}
          >
            {video.tag || video.style}
          </Typography>
        </Box>
        {/* Play button - center with glassy blur */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '50%',
              width: isLandscape ? 52 : 40,
              height: isLandscape ? 52 : 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
              transition: 'all 0.2s ease',
            }}
          >
            <PlayArrowRoundedIcon sx={{ fontSize: isLandscape ? 28 : 22, color: '#007AFF' }} />
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
  
  // Get carousel titles based on route category (with fallback to default)
  const routeCategory: RouteCategory = routeConfig.routeCategory || 'default';
  const carouselTitles = carouselTitlesByCategory[routeCategory];

  // Scroll to top when route changes (makes navigation feel like a new page)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

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
      background: '#FFFFFF',
      color: '#1D1D1F',
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

      {/* Header - Followr-style dark header */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: isLoggedIn ? 'rgba(255, 255, 255, 0.95)' : '#1D1D1F',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isLoggedIn ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
          width: '100%',
          maxWidth: '1400px',
          mx: 'auto',
        }}>
          {/* Logo - left */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/gruvi.png"
              alt="Gruvi"
              sx={{
                height: 36,
                width: 36,
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontFamily: '"Fredoka", "Inter", sans-serif',
                fontWeight: 600,
                fontSize: '1.4rem',
                letterSpacing: '-0.01em',
                background: isLoggedIn
                  ? 'linear-gradient(135deg, #007AFF, #5AC8FA)'
                  : 'linear-gradient(135deg, #00D4AA, #5AC8FA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Gruvi
            </Typography>
          </Box>

          {/* Mobile: hamburger menu */}
          {isMobile ? (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: isLoggedIn ? '#007AFF' : '#fff',
                ml: 'auto',
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              {isLoggedIn ? (
                // Logged in - go to dashboard button
                <Button
                  component={RouterLink}
                  to="/my-music"
                  variant="contained"
                  sx={{
                    ml: 'auto',
                    background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                    color: '#fff',
                    px: 3,
                    py: 1,
                    borderRadius: '100px',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                      boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
                    },
                  }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                // Not logged in - Followr-style centered nav
                <>
                  {/* Center navigation links */}
                  <Box sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}>
                    {[
                      { label: 'AI Music', href: '#music' },
                      { label: 'AI Video Shorts', href: '#shorts' },
                      { label: 'Cinematic Promos', href: '#cinematic' },
                      { label: 'Social Media', href: '#social' },
                      { label: 'Pricing', href: '/payment' },
                      { label: 'FAQ', href: '/faq' },
                    ].map((item) => (
                      <Button
                        key={item.label}
                        component={item.href.startsWith('/') ? RouterLink : 'a'}
                        to={item.href.startsWith('/') ? item.href : undefined}
                        href={!item.href.startsWith('/') ? item.href : undefined}
                        sx={{
                          color: 'rgba(255,255,255,0.85)',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          px: 1.5,
                          py: 0.75,
                          borderRadius: '8px',
                          minWidth: 'auto',
                          '&:hover': {
                            color: '#fff',
                            background: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>

                  {/* Right side: Login + CTA */}
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', ml: 'auto' }}>
                    <Button
                      onClick={handleClickOpen}
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        '&:hover': {
                          color: '#fff',
                          background: 'transparent',
                        },
                      }}
                    >
                      Log in
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleClickOpen}
                      sx={{
                        background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)',
                        color: '#fff',
                        px: 2.5,
                        py: 1,
                        borderRadius: '100px',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        boxShadow: '0 2px 8px rgba(0,212,170,0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #00B894 0%, #009B7D 100%)',
                          boxShadow: '0 4px 12px rgba(0,212,170,0.4)',
                        },
                      }}
                    >
                      Start Free Trial
                    </Button>
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: false,
          disableScrollLock: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            background: isLoggedIn ? 'rgba(255, 255, 255, 0.95)' : '#1D1D1F',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px 0 0 16px',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            borderLeft: isLoggedIn ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: isLoggedIn ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255,255,255,0.1)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/gruvi.png"
              alt="Gruvi"
              sx={{ height: 32, width: 32, objectFit: 'contain' }}
            />
            <Typography
              sx={{
                fontFamily: '"Fredoka", "Inter", sans-serif',
                fontWeight: 600,
                fontSize: '1.25rem',
                background: isLoggedIn
                  ? 'linear-gradient(135deg, #007AFF, #5AC8FA)'
                  : 'linear-gradient(135deg, #00D4AA, #5AC8FA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Gruvi
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle} sx={{ color: isLoggedIn ? 'inherit' : '#fff' }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Drawer Content */}
        <List sx={{ px: 1, py: 2 }}>
          {isLoggedIn ? (
            // Logged in - go to dashboard
            <ListItemButton
              component={RouterLink}
              to="/my-music"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: 'rgba(0,122,255,0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(0,122,255,0.12)',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#007AFF' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Go to Dashboard" primaryTypographyProps={{ fontWeight: 600, color: '#007AFF' }} />
            </ListItemButton>
          ) : (
            // Logged out menu items - matching header nav
            <>
              {[
                { label: 'AI Music', href: '#music' },
                { label: 'AI Video Shorts', href: '#shorts' },
                { label: 'Cinematic Promos', href: '#cinematic' },
                { label: 'Social Media', href: '#social' },
                { label: 'Pricing', href: '/payment' },
                { label: 'FAQ', href: '/faq' },
              ].map((item) => (
                <ListItemButton
                  key={item.label}
                  component={item.href.startsWith('/') ? RouterLink : 'a'}
                  to={item.href.startsWith('/') ? item.href : undefined}
                  href={!item.href.startsWith('/') ? item.href : undefined}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  />
                </ListItemButton>
              ))}
            </>
          )}
        </List>

        {/* Bottom buttons */}
        <Box sx={{
          mt: 'auto',
          p: 2,
          borderTop: isLoggedIn ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}>
          {isLoggedIn ? (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                handleDrawerToggle();
                logout();
              }}
              startIcon={<LogoutIcon />}
              sx={{
                borderColor: 'rgba(0,0,0,0.15)',
                color: '#1D1D1F',
                borderRadius: '100px',
                py: 1.5,
                '&:hover': {
                  borderColor: '#FF3B30',
                  color: '#FF3B30',
                  background: 'rgba(255,59,48,0.05)',
                },
              }}
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  handleDrawerToggle();
                  handleClickOpen();
                }}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.9)',
                  borderRadius: '100px',
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Log in
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  handleDrawerToggle();
                  handleClickOpen();
                  setAuthTab(1);
                }}
                sx={{
                  background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)',
                  color: '#fff',
                  borderRadius: '100px',
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00B894 0%, #009B7D 100%)',
                  }
                }}
              >
                Start Free Trial
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* Hero Section with Prompt Input */}
      <Box sx={{ 
        pt: { xs: 14, md: 18 },
        pb: { xs: 2 },
        position: 'relative',
        zIndex: 1,
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            {/* Main Headline with Gruvi branding - prevent cutoff */}
          <Typography 
            variant="h1" 
            sx={{ 
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 700,
                color: '#1D1D1F',
              lineHeight: 1.15,
                mb: 1.5,
                letterSpacing: '-0.02em',
                px: { xs: 1, sm: 0 },
              }}
            >
              <Box 
                component="span"
                sx={{ color: '#1D1D1F' }}
              >
                Gruvi:
              </Box>{' '}
              <Box 
                component="span" 
            sx={{ 
                  background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {heroHeadingParts[0]}
              </Box>
          </Typography>

            {/* Tagline */}
          <Typography 
            sx={{ 
                fontFamily: '"Fredoka", "Inter", sans-serif',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                fontWeight: 600,
                color: '#1D1D1F',
                mb: 2,
            }}
          >
              {heroHeadingParts[1] || 'Everyone Deserves a Hit Song'}
          </Typography>

            {/* Prompt Input - Glassy */}
            <Box sx={{
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
              px: { xs: 2, sm: 0 },
            }}>
              <TextField
                fullWidth
                placeholder={isMobile ? "Type any idea into a song..." : "Type any idea you have into a song..."}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handlePromptKeyPress}
                inputRef={promptInputRef}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleGenerateClick}
                        disabled={!prompt.trim()}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          background: prompt.trim() ? '#007AFF' : 'rgba(0,0,0,0.05)',
                          color: prompt.trim() ? '#fff' : '#86868B',
                          mr: -0.5,
                          '&:hover': {
                            background: prompt.trim() ? '#0056CC' : 'rgba(0,0,0,0.08)',
                          },
                          '&.Mui-disabled': {
                            color: '#86868B',
                          },
                        }}
                      >
                        <SendRoundedIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: '#fff',
                    borderRadius: '100px',
                    pr: { xs: 1, sm: 1.5 },
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,0,0,0.12)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 12px 40px rgba(0,122,255,0.15), 0 4px 12px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(0,122,255,0.3)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#1D1D1F',
                    py: { xs: 1.25, sm: 2 },
                    px: { xs: 1.5, sm: 2.5 },
                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                    fontWeight: 400,
                    textOverflow: 'ellipsis',
                    '&::placeholder': {
                      color: '#86868B',
                      opacity: 1,
                      fontSize: 'inherit',
                    },
                    // Override browser autofill background color
                    '&:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px #fff inset !important',
                      WebkitTextFillColor: '#1D1D1F !important',
                      caretColor: '#1D1D1F',
                    },
                    '&:-webkit-autofill:hover': {
                      WebkitBoxShadow: '0 0 0 1000px #fff inset !important',
                    },
                    '&:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px #fff inset !important',
                    },
                    '&:-webkit-autofill:active': {
                      WebkitBoxShadow: '0 0 0 1000px #fff inset !important',
                    },
                  },
                }}
              />
            </Box>

            {/* Quick Prompt Suggestions */}
            <Box sx={{
              display: 'flex',
              gap: { xs: 0.75, sm: 1 },
              flexWrap: 'wrap',
              justifyContent: 'center',
              mb: 6,
              px: { xs: 1, sm: 0 },
            }}>
              {examplePrompts.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  sx={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    color: '#86868B',
                    fontSize: { xs: '0.7rem', sm: '0.85rem', md: '0.95rem' },
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderRadius: '100px',
                    height: { xs: '32px', sm: '38px', md: '42px' },
                    '& .MuiChip-label': {
                      px: { xs: 1.5, sm: 2, md: 2.5 },
                    },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: '#fff',
                      borderColor: 'rgba(0,122,255,0.3)',
                      color: '#007AFF',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>

        
      </Box>

      <SectionDivider />

{/* Featured Tracks Section - columns of 3 tracks each */}
      <Box sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              {carouselTitles.featuredTracks.title}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
              {carouselTitles.featuredTracks.subtitle}
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
                        background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.08)' : '#fff',
                        borderRadius: '12px',
                        border: currentSong?.songId === track.id ? '1px solid rgba(0,122,255,0.3)' : '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                          transform: 'translateY(-2px)',
                          '& .play-overlay': { opacity: 1 },
                        },
                      }}
                    >
                      {/* Album Art */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: 48,
                          height: 48,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <Box
                          component="img"
                          src={genreToImage[track.genre] || '/genres/pop.jpeg'}
                          alt={track.title}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                            background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.4)' : 'rgba(0,0,0,0.4)',
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

                      {/* Track Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: currentSong?.songId === track.id ? '#007AFF' : '#1D1D1F',
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
                            color: '#86868B',
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
                      <Typography sx={{ fontSize: '0.75rem', color: '#86868B', flexShrink: 0 }}>
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

      {/* Promo Videos - Portrait */}
      {promoVideosPortrait.length > 0 && (
        <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
              >
                {carouselTitles.promoVideos.title}
              </Typography>
              <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
                {carouselTitles.promoVideos.subtitle}
              </Typography>
            </Box>
            <ScrollableCarousel id="promo-videos-portrait">
              {promoVideosPortrait.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => navigate(`/videos/${video.title.toLowerCase().replace(/\s+/g, '-')}`)}
                />
              ))}
            </ScrollableCarousel>
          </Container>
        </Box>
      )}

      {/* Share Everywhere Section - Carousel */}
      <Box sx={{ py: { xs: 4, md: 5 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              The AI Music Promo Generator
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
              Your AI-generated content is 100% original - post to YouTube, TikTok, Instagram & more without strikes or claims
            </Typography>
          </Box>

          {/* Platform Icons Carousel */}
          <ScrollableCarousel id="platforms-carousel">
            {[
              { id: 'youtube', name: 'YouTube', color: '#FF0000', image: '/music-apps/youtube.png', svgPath: null },
              { id: 'tiktok', name: 'TikTok', color: '#000000', image: null, svgPath: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z' },
              { id: 'instagram', name: 'Instagram', color: '#E4405F', image: null, svgPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z', gradient: true },
              { id: 'facebook', name: 'Facebook', color: '#1877F2', image: null, svgPath: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { id: 'linkedin', name: 'LinkedIn', color: '#0077B5', image: null, svgPath: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
            ].map((platform) => (
              <Box
                key={platform.id}
                onClick={() => navigate(`/platforms/${platform.id}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: { xs: 85, sm: 100 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                  '&:hover .platform-icon': { 
                    boxShadow: `0 8px 24px ${platform.color}30`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  className="platform-icon"
                  sx={{
                    width: { xs: 64, md: 80 },
                    height: { xs: 64, md: 80 },
                    borderRadius: '18px',
                    background: `linear-gradient(135deg, ${platform.color}12 0%, ${platform.color}22 100%)`,
                    border: `1px solid ${platform.color}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  {platform.image ? (
                    <Box
                      component="img"
                      src={platform.image}
                      alt={platform.name}
                      sx={{ 
                        width: { xs: 32, md: 40 }, 
                        height: { xs: 32, md: 40 }, 
                        objectFit: 'contain' 
                      }}
                    />
                  ) : platform.svgPath ? (
                    <Box component="svg" viewBox="0 0 24 24" sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }}>
                      {platform.gradient && (
                        <defs>
                          <linearGradient id={`ig-gradient-${platform.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFDC80" />
                            <stop offset="25%" stopColor="#F77737" />
                            <stop offset="50%" stopColor="#E1306C" />
                            <stop offset="75%" stopColor="#C13584" />
                            <stop offset="100%" stopColor="#833AB4" />
                          </linearGradient>
                        </defs>
                      )}
                      <path d={platform.svgPath} fill={platform.gradient ? `url(#ig-gradient-${platform.id})` : platform.color} />
                    </Box>
                  ) : null}
                </Box>
                <Typography sx={{ 
                  fontSize: { xs: '0.7rem', md: '0.8rem' }, 
                  fontWeight: 600, 
                  color: '#1D1D1F',
                  textAlign: 'center',
                }}>
                  {platform.name}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* More Tracks Section - columns of 3 tracks each */}
      <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              {carouselTitles.moreTracks.title}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
              {carouselTitles.moreTracks.subtitle}
            </Typography>
          </Box>

          {/* Single carousel with columns of 3 tracks each - tracks 15-30 (5 columns × 3 rows) */}
          <ScrollableCarousel id="more-tracks-carousel">
            {(() => {
              // Use tracks from index 15 to 30 (15 tracks = 5 columns × 3 rows), group into columns of 3
              const secondBatch = sampleTracks.slice(15, 30);
              const columns: typeof sampleTracks[] = [];
              for (let i = 0; i < secondBatch.length; i += 3) {
                columns.push(secondBatch.slice(i, i + 3));
              }
              return columns.map((columnTracks, colIndex) => (
                <Box
                  key={`more-track-column-${colIndex}`}
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
                        background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.08)' : '#fff',
                        borderRadius: '12px',
                        border: currentSong?.songId === track.id ? '1px solid rgba(0,122,255,0.3)' : '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                          transform: 'translateY(-2px)',
                          '& .play-overlay': { opacity: 1 },
                        },
                      }}
                    >
                      {/* Album Art */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: 48,
                          height: 48,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <Box
                          component="img"
                          src={genreToImage[track.genre] || '/genres/pop.jpeg'}
                          alt={track.title}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                            background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.4)' : 'rgba(0,0,0,0.4)',
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

                      {/* Track Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: currentSong?.songId === track.id ? '#007AFF' : '#1D1D1F',
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
                            color: '#86868B',
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
                      <Typography sx={{ fontSize: '0.75rem', color: '#86868B', flexShrink: 0 }}>
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

      {/* Promo Videos - Landscape */}
      {promoVideosLandscape.length > 0 && (
        <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
              >
                Cinematic Brand Videos
              </Typography>
              <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
                Widescreen promo videos with AI-generated music for your brand
              </Typography>
            </Box>
            <ScrollableCarousel id="promo-videos-landscape">
              {promoVideosLandscape.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => navigate(`/videos/${video.title.toLowerCase().replace(/\s+/g, '-')}`)}
                />
              ))}
            </ScrollableCarousel>
          </Container>
        </Box>
      )}

      {/* Genres Section - Strong hook */}
      <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              {carouselTitles.genres.title}
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
              {carouselTitles.genres.subtitle}
            </Typography>
          </Box>

          <ScrollableCarousel id="genres-carousel">
            {genres.map((genre) => (
              <Box 
                key={genre.id}
                onClick={() => navigate(`/genres/${genre.id}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  minWidth: { xs: 85, sm: 100 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                  '&:hover .genre-circle': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
                }}
              >
                <Box
                  className="genre-circle"
                  sx={{
                    width: { xs: 72, sm: 88 },
                    height: { xs: 72, sm: 88 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    p: 0.5,
                    background: '#fff',
                  }}
                >
                  <Box
                    component="img"
                    src={genre.image}
                    alt={genre.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                </Box>
                <Typography sx={{ color: '#1D1D1F', fontWeight: 600, fontSize: '0.8rem', textAlign: 'center' }}>
                  {genre.name}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* Music Videos - Landscape (Create Your Very Own Music Video) */}
      {musicVideosLandscape.length > 0 && (
        <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
              >
                Create Your Very Own Music Video with AI
              </Typography>
              <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
                {carouselTitles.cinematicVideos.subtitle}
              </Typography>
            </Box>
            <ScrollableCarousel id="music-videos-landscape">
              {musicVideosLandscape.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => navigate(`/videos/${video.title.toLowerCase().replace(/\s+/g, '-')}`)}
                />
              ))}
            </ScrollableCarousel>
          </Container>
        </Box>
      )}

      {/* Discover More Tracks Section - remaining 3 tracks + 12 additional genre tracks = 15 total */}
      <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              {carouselTitles.moreGenres.title}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
              {carouselTitles.moreGenres.subtitle}
            </Typography>
          </Box>

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
                        background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.08)' : '#fff',
                        borderRadius: '12px',
                        border: currentSong?.songId === track.id ? '1px solid rgba(0,122,255,0.3)' : '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                          transform: 'translateY(-2px)',
                          '& .play-overlay': { opacity: 1 },
                        },
                      }}
                    >
                      {/* Album Art */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: 48,
                          height: 48,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <Box
                          component="img"
                          src={genreToImage[track.genre] || '/genres/pop.jpeg'}
                          alt={track.title}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                            background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.4)' : 'rgba(0,0,0,0.4)',
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

                      {/* Track Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: currentSong?.songId === track.id ? '#007AFF' : '#1D1D1F',
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
                            color: '#86868B',
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
                      <Typography sx={{ fontSize: '0.75rem', color: '#86868B', flexShrink: 0 }}>
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

      {/* Music Videos - Portrait (Turn Songs Into Music Videos) */}
      {musicVideosPortrait.length > 0 && (
        <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          <Container maxWidth="lg">
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
              >
                {carouselTitles.musicVideos.title}
              </Typography>
              <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
                {carouselTitles.musicVideos.subtitle}
              </Typography>
            </Box>
            <ScrollableCarousel id="music-videos-portrait">
              {musicVideosPortrait.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => navigate(`/videos/${video.title.toLowerCase().replace(/\s+/g, '-')}`)}
                />
              ))}
            </ScrollableCarousel>
          </Container>
        </Box>
      )}

      {/* Art Styles Section - Strong hook */}
      <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              {carouselTitles.videoStyles.title}
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
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
                <Typography sx={{ color: '#1D1D1F', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {style.label}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* Languages Section - Strong hook */}
      <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              Make Music in Any Language
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
              24+ languages with native-quality vocals - reach a global audience
            </Typography>
          </Box>

          <ScrollableCarousel id="languages-carousel">
            {languages.map((lang) => (
              <Box 
                key={lang.id}
                onClick={() => navigate(`/languages/${lang.name.toLowerCase()}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  minWidth: { xs: 85, sm: 100 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                  '&:hover .lang-circle': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
                }}
              >
                <Box
                  className="lang-circle"
                  sx={{
                    width: { xs: 80, sm: 96 },
                    height: { xs: 80, sm: 96 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    p: 1,
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    component="img"
                    src={lang.image}
                    alt={lang.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', padding: 1 }}
                  />
                </Box>
                <Typography sx={{ color: '#1D1D1F', fontWeight: 600, fontSize: '0.8rem', textAlign: 'center' }}>
                  {lang.name}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* Language Tracks Section - 15 tracks in different languages (below Make Music in Any Language) */}
      <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              Enjoy Music from Around the World
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
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
                        width: { xs: 240, sm: 280, md: 300 },
                        background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.08)' : '#fff',
                        borderRadius: '12px',
                        border: currentSong?.songId === track.id ? '1px solid rgba(0,122,255,0.3)' : '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                          transform: 'translateY(-2px)',
                        },
                        '&:hover .lang-play-overlay': {
                          opacity: 1,
                        },
                      }}
                    >
                      {/* Language flag as album art */}
                      <Box
                        className="lang-track-image"
                        sx={{
                          position: 'relative',
                          width: 48,
                          height: 48,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          background: '#fff',
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
                            width: '85%', 
                            height: '85%', 
                            objectFit: 'contain',
                            transition: 'opacity 0.2s ease',
                          }}
                        />
                        {/* Play overlay - shows on hover */}
                        <Box
                          className="lang-play-overlay"
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: currentSong?.songId === track.id ? 'rgba(0,122,255,0.5)' : 'rgba(0,0,0,0.35)',
                            opacity: currentSong?.songId === track.id ? 1 : 0,
                            transition: 'opacity 0.2s ease',
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

                      {/* Track Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: currentSong?.songId === track.id ? '#007AFF' : '#1D1D1F',
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
                            color: '#86868B',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {track.language}
                        </Typography>
                      </Box>

                      {/* Duration */}
                      <Typography sx={{ fontSize: '0.75rem', color: '#86868B', flexShrink: 0 }}>
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

      {/* Moods Section - Strong hook */}
      <Box sx={{ py: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              Set the Perfect Mood
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
              Uplifting, melancholic, energetic - music that captures any emotion
            </Typography>
          </Box>

          <ScrollableCarousel id="moods-carousel">
            {moods.map((mood) => (
              <Box 
                key={mood.id}
                onClick={() => navigate(`/moods/${mood.id}`)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.75,
                  minWidth: { xs: 85, sm: 100 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                  '&:hover .mood-circle': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
                }}
              >
                <Box
                  className="mood-circle"
                  sx={{
                    width: { xs: 72, sm: 88 },
                    height: { xs: 72, sm: 88 },
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    p: 0.5,
                    background: '#fff',
                  }}
                >
                  <Box
                    component="img"
                    src={mood.image}
                    alt={mood.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                </Box>
                <Typography sx={{ color: '#1D1D1F', fontWeight: 600, fontSize: '0.8rem', textAlign: 'center' }}>
                  {mood.name}
                </Typography>
              </Box>
            ))}
          </ScrollableCarousel>
        </Container>
      </Box>

      {/* Features Section - Strong hook */}
      <Box sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1, marginBottom: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}
            >
              Everything You Need to Create
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.85rem' }}>
              Professional music and video generation at your fingertips
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {[
              {
                icon: <MusicNoteIcon sx={{ fontSize: 24 }} />,
                title: 'Studio-quality audio',
                description: 'Professional AI music generation.',
              },
              {
                icon: <PersonIcon sx={{ fontSize: 24 }} />,
                title: 'Custom characters',
                description: 'Add anyone to your videos.',
              },
              {
                icon: <ShareIcon sx={{ fontSize: 24 }} />,
                title: 'Share everywhere',
                description: 'Export to any platform.',
              },
              {
                icon: <VideoLibraryIcon sx={{ fontSize: 24 }} />,
                title: 'AI music videos',
                description: 'Stunning visuals from your songs.',
              },
              {
                icon: <BoltIcon sx={{ fontSize: 24 }} />,
                title: 'Fast generation',
                description: 'Songs in seconds, not minutes.',
              },
              {
                icon: <ThumbUpIcon sx={{ fontSize: 24 }} />,
                title: 'Commercial license',
                description: 'Use for content and streaming.',
              },
              {
                icon: <HomeWorkIcon sx={{ fontSize: 24 }} />,
                title: 'Property promos',
                description: 'Showcase Airbnbs and rentals.',
              },
              {
                icon: <ShoppingBagIcon sx={{ fontSize: 24 }} />,
                title: 'Product videos',
                description: 'Promote your brand and products.',
              },
              {
                icon: <TranslateIcon sx={{ fontSize: 24 }} />,
                title: '24 languages',
                description: 'Most popular languages supported.',
              },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: '10px',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    color: '#007AFF', 
                    width: 40, 
                    height: 40, 
                    borderRadius: '8px',
                    background: 'rgba(0,122,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1D1D1F' }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: '#86868B', fontSize: '0.8rem' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2"
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 600,
                color: '#1D1D1F',
                mb: 2,
              }}
            >
              Start Making Music for Free
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '1rem', mb: 4 }}>
              New customers get 2 free songs when they sign up. Select the plan that best fits your needs.
              </Typography>

            {/* Billing Toggle */}
            <FormControlLabel
              control={
                <Switch 
                  checked={isYearly}
                  onChange={handleToggleInterval}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#007AFF',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#007AFF',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    sx={{ 
                      fontWeight: isYearly ? 'normal' : 'bold', 
                      color: isYearly ? '#86868B' : '#1D1D1F'
                    }}
                  >
                    Monthly
                  </Typography>
                  <Box sx={{ mx: 1, color: '#86868B' }}>|</Box>
                  <Typography 
                    sx={{ 
                      fontWeight: isYearly ? 'bold' : 'normal', 
                      color: isYearly ? '#1D1D1F' : '#86868B'
                    }}
                  >
                    Yearly
                  </Typography>
                  {isYearly && (
                    <Chip 
                      label="SAVE 20%" 
                      size="small" 
                      sx={{ 
                        ml: 1, 
                        background: 'rgba(52, 199, 89, 0.15)', 
                        color: '#248A3D',
                        fontSize: '0.7rem',
                        height: 20,
                      }} 
                    />
                  )}
                </Box>
              }
              labelPlacement="end"
            />
              </Box>

              {/* Pricing Cards */}
          <Box
            sx={{
                display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: '1000px',
              mx: 'auto',
            }}
          >
                {plans.map((plan) => (
                  <Card 
                    key={plan.id}
                onClick={() => handleSubscribeClick(plan.id)}
                    sx={{ 
                  background: selectedPlan === plan.id 
                    ? 'rgba(0, 122, 255, 0.06)'
                    : 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: selectedPlan === plan.id 
                    ? '2px solid #007AFF'
                    : '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '28px',
                      position: 'relative',
                      overflow: 'visible',
                        cursor: 'pointer',
                  boxShadow: selectedPlan === plan.id
                    ? '0 12px 48px rgba(0,122,255,0.2), 0 4px 16px rgba(0,122,255,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                    : '0 8px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: selectedPlan === plan.id
                      ? '0 20px 60px rgba(0,122,255,0.25), 0 8px 24px rgba(0,122,255,0.15)'
                      : '0 16px 56px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                  },
                    }}
                  >
                    {plan.popular && (
                  <Box
                    sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      background: '#007AFF',
                      color: '#fff',
                        px: 2,
                        py: 0.5,
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                        fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
                    }}
                  >
                    <StarIcon sx={{ fontSize: 14 }} />
                    MOST POPULAR
                      </Box>
                    )}
                <CardContent sx={{ p: 4 }}>
                  <Typography sx={{ fontSize: '0.9rem', color: '#86868B', mb: 1, fontStyle: 'italic' }}>
                    {plan.id === 'starter' ? 'Perfect for trying Gruvi. 500 tokens per month with commercial license.' : 
                     plan.id === 'pro' ? 'Great for content creators. 1,000 tokens per month with high quality audio.' : 
                     'Maximum power for professionals. 2,500 tokens per month with priority generation.'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                      {plan.title}
                    </Typography>
                    {isYearly && (
                      <Chip 
                        label={`Save $${((plan.monthlyPrice * 12) - plan.yearlyPrice).toFixed(0)}`}
                        size="small"
                        sx={{ 
                          background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          height: 24,
                        }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 0.5 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
                      ${isYearly ? (plan.yearlyPrice / 12).toFixed(2) : plan.monthlyPrice}
                    </Typography>
                    <Typography sx={{ color: '#86868B', ml: 1 }}>
                      /month
                    </Typography>
                  </Box>
                  
                  {isYearly && (
                    <Typography sx={{ fontSize: '0.85rem', color: '#86868B', mb: 3 }}>
                      ${plan.yearlyPrice}/year
                    </Typography>
                  )}
                  
                  {!isYearly && (
                    <Box sx={{ mb: 3 }} />
                  )}

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
                      mb: 3,
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      color: '#fff',
                      boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                        boxShadow: '0 6px 16px rgba(0,122,255,0.4)',
                      },
                    }}
                  >
                    {isCheckoutLoading === plan.id ? (
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                      plan.id === 'starter' ? 'Sign Up' : 'Subscribe'
                    )}
                      </Button>

                  <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', mb: 3 }} />

                  <List dense disablePadding>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ color: '#007AFF', fontSize: 18 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          primaryTypographyProps={{ 
                            sx: { color: '#1D1D1F', fontSize: '0.9rem' } 
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                    </CardContent>
                  </Card>
                ))}
              </Box>

          {/* Token Top-ups */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography sx={{ color: '#86868B', fontSize: '0.9rem' }}>
              Need more tokens? Top-up bundles: 1,000 tokens ($12.99) • 5,000 tokens ($49.99) • 10,000 tokens ($89.99). Tokens never expire!
            </Typography>
          </Box>
        </Container>
      </Box>

      <SectionDivider />

      {/* FAQ Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }} id="faq">
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 600,
                color: '#1D1D1F',
                mb: 2,
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '1rem' }}>
              Everything you need to know about creating music with AI
            </Typography>
          </Box>

          <Box sx={{ 
              borderRadius: '24px', 
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}>
            {faqItems.map((faq, index) => {
              const faqSlug = faq.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              return (
              <Accordion
                key={faqSlug}
                id={faqSlug}
                expanded={expandedFAQ === faqSlug}
                onChange={handleFAQChange(faqSlug)}
            sx={{ 
                  background: 'transparent',
                  borderBottom: index !== faqItems.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': {
                    margin: 0,
                    background: 'rgba(0,122,255,0.03)',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#007AFF' }} />}
                  sx={{
                    padding: '16px 24px',
                    '& .MuiAccordionSummary-content': { margin: '0' },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      color: '#1D1D1F',
                      textAlign: 'left',
                    }}
                  >
                    {faq.question}
            </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0 24px 20px 24px' }}>
                  <Box>
                    <Typography
                      sx={{
                        color: '#86868B',
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
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
                          color: '#007AFF',
                textTransform: 'none',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          '&:hover': {
                            background: 'rgba(0,122,255,0.05)',
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

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/faq"
              variant="outlined"
                sx={{
                borderColor: 'rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#007AFF',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
                  '&:hover': {
                  borderColor: '#007AFF',
                  border: '1px solid #007AFF',
                  color: '#007AFF',
                  background: '#fff',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,122,255,0.15)',
                  },
                }}
              >
              View All FAQs
            </Button>
                </Box>
        </Container>
          </Box>

      <SectionDivider />

      {/* Explore Routes Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1, marginBottom: 8}}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 600,
                color: '#1D1D1F',
                mb: 1,
              }}
            >
            Explore More
          </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.95rem' }}>
              Discover all the ways you can create with Gruvi
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              justifyContent: 'center',
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
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  color: '#1D1D1F',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  px: 1.5,
                  height: 40,
                  borderRadius: '100px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: '#fff',
                    color: '#007AFF',
                    borderColor: 'rgba(0,122,255,0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)',
                  },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.75rem', md: '2rem' },
                fontWeight: 600,
                color: '#1D1D1F',
                mb: 2,
              }}
            >
              Ready to make music?
            </Typography>
            <Typography sx={{ color: '#86868B', mb: 4 }}>
              Join thousands of creators making amazing music with AI.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleClickOpen}
              endIcon={<KeyboardArrowRightIcon />}
              sx={{
                background: '#007AFF',
                color: '#fff',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#0066DD',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,122,255,0.4)',
                },
              }}
            >
              Start Creating Free
            </Button>
        </Box>
      </Container>
      </Box>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
            <Typography sx={{ color: '#86868B', fontSize: '0.875rem' }}>
              © {new Date().getFullYear()} Gruvi. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link
                component={RouterLink}
              to="/terms" 
                sx={{ color: '#86868B', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { color: '#1D1D1F' } }}
              >
                Terms
              </Link>
              <Link
                component={RouterLink}
                to="/privacy"
                sx={{ color: '#86868B', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { color: '#1D1D1F' } }}
              >
                Privacy
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Auth Dialog - Glassy White */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255,255,255,0.5)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pt: 4,
          pb: 0,
          px: 4,
          textAlign: 'center',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
            {authTab === 0 ? 'Welcome back' : 'Create account'}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#86868B',
              '&:hover': { background: 'rgba(0,0,0,0.03)' },
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
                color: '#86868B',
                textTransform: 'none',
              },
              '& .Mui-selected': {
                color: '#1D1D1F',
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
                      background: 'rgba(0,0,0,0.02)',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: '#86868B' },
                    '& .MuiInputBase-input': { color: '#1D1D1F' },
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
                      background: 'rgba(0,0,0,0.02)',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: '#86868B' },
                    '& .MuiInputBase-input': { color: '#1D1D1F' },
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
                    background: '#1D1D1F',
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
                      background: 'rgba(0,0,0,0.02)',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: '#86868B' },
                    '& .MuiInputBase-input': { color: '#1D1D1F' },
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
                      background: 'rgba(0,0,0,0.02)',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: '#86868B' },
                    '& .MuiInputBase-input': { color: '#1D1D1F' },
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
                      background: 'rgba(0,0,0,0.02)',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: '#86868B' },
                    '& .MuiInputBase-input': { color: '#1D1D1F' },
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
                      background: 'rgba(0,0,0,0.02)',
                      '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: '#86868B' },
                    '& .MuiInputBase-input': { color: '#1D1D1F' },
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
                    background: '#1D1D1F',
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
                background: 'rgba(0,0,0,0.08)' 
              }} />
            <Typography 
              sx={{ 
                  position: 'relative', 
                  display: 'inline-block', 
                  px: 2, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#86868B',
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
                  <CircularProgress size={18} sx={{ color: '#86868B' }} />
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
                borderColor: 'rgba(0,0,0,0.15)',
                color: '#1D1D1F',
                '&:hover': {
                  borderColor: 'rgba(0,0,0,0.3)',
                  background: 'rgba(0,0,0,0.03)',
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
                  color: '#86868B',
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
              : 'rgba(34, 197, 94, 0.1)',
            border: snackbarSeverity === 'error'
              ? '1px solid rgba(255, 59, 48, 0.2)'
              : '1px solid rgba(34, 197, 94, 0.2)',
            color: snackbarSeverity === 'error' ? '#D70015' : '#22C55E',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            '& .MuiAlert-icon': { 
              color: snackbarSeverity === 'error' ? '#D70015' : '#22C55E' 
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
