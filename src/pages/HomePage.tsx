import React, { useCallback, useState, useEffect, useRef } from 'react';
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
  Divider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { getRouteConfig } from '../config/routeConfig';
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
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BoltIcon from '@mui/icons-material/Bolt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { faqItems } from './FAQPage';

// Sample tracks data (for showcase)
const sampleTracks = [
  {
    id: 1,
    title: "Midnight Dreams",
    genre: "Lo-fi Hip Hop",
    duration: "2:34",
    plays: "12.5K",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Electric Pulse",
    genre: "Electronic",
    duration: "3:12",
    plays: "8.2K",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Summer Gruvis",
    genre: "Pop",
    duration: "2:58",
    plays: "15.8K",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Jazz Cafe",
    genre: "Jazz",
    duration: "4:21",
    plays: "6.3K",
    cover: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Epic Adventure",
    genre: "Cinematic",
    duration: "3:45",
    plays: "22.1K",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
  },
];

// Sample music videos data (portrait orientation 9:16)
const sampleVideos = [
  {
    id: 1,
    title: "Neon City Nights",
    style: "Cyberpunk",
    views: "45.2K",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=533&fit=crop",
  },
  {
    id: 2,
    title: "Ocean Dreams",
    style: "3D Animation",
    views: "32.8K",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=533&fit=crop",
  },
  {
    id: 3,
    title: "Mountain Journey",
    style: "Cinematic",
    views: "28.5K",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=533&fit=crop",
  },
  {
    id: 4,
    title: "Urban Rhythm",
    style: "Anime",
    views: "38.1K",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=533&fit=crop",
  },
  {
    id: 5,
    title: "Fantasy Quest",
    style: "3D Cartoon",
    views: "52.3K",
    thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=533&fit=crop",
  },
];

// Genres data - comprehensive list
const genres = [
  // Popular/Mainstream
  { id: 'pop', name: 'Pop', icon: '🎤', color: '#FF6B9D' },
  { id: 'hip-hop', name: 'Hip Hop', icon: '🎧', color: '#9D4EDD' },
  { id: 'rnb', name: 'R&B', icon: '💜', color: '#A855F7' },
  { id: 'electronic', name: 'Electronic', icon: '⚡', color: '#00D9FF' },
  { id: 'dance', name: 'Dance', icon: '💃', color: '#FF1493' },
  { id: 'house', name: 'House', icon: '🏠', color: '#00CED1' },
  { id: 'edm', name: 'EDM', icon: '🔊', color: '#7B68EE' },
  { id: 'techno', name: 'Techno', icon: '🤖', color: '#8A2BE2' },
  // Rock & Alternative
  { id: 'rock', name: 'Rock', icon: '🎸', color: '#FF4757' },
  { id: 'alternative', name: 'Alternative', icon: '🔥', color: '#DC143C' },
  { id: 'indie', name: 'Indie', icon: '🌙', color: '#B8860B' },
  { id: 'punk', name: 'Punk', icon: '⚡', color: '#FF6347' },
  { id: 'metal', name: 'Metal', icon: '🤘', color: '#2F4F4F' },
  { id: 'grunge', name: 'Grunge', icon: '🎵', color: '#696969' },
  // Jazz & Blues
  { id: 'jazz', name: 'Jazz', icon: '🎷', color: '#FFB347' },
  { id: 'blues', name: 'Blues', icon: '🎺', color: '#4169E1' },
  { id: 'soul', name: 'Soul', icon: '❤️', color: '#CD5C5C' },
  { id: 'funk', name: 'Funk', icon: '🕺', color: '#FF8C00' },
  // Classical & Orchestral
  { id: 'classical', name: 'Classical', icon: '🎻', color: '#4ECDC4' },
  { id: 'orchestral', name: 'Orchestral', icon: '🎼', color: '#8B4513' },
  { id: 'opera', name: 'Opera', icon: '🎭', color: '#800020' },
  { id: 'cinematic', name: 'Cinematic', icon: '🎬', color: '#1E293B' },
  { id: 'soundtrack', name: 'Soundtrack', icon: '🎞️', color: '#2C3E50' },
  // Country & Folk
  { id: 'country', name: 'Country', icon: '🤠', color: '#D4A574' },
  { id: 'folk', name: 'Folk', icon: '🪕', color: '#8B7355' },
  { id: 'bluegrass', name: 'Bluegrass', icon: '🌾', color: '#6B8E23' },
  { id: 'acoustic', name: 'Acoustic', icon: '🎸', color: '#DEB887' },
  // Latin & World
  { id: 'latin', name: 'Latin', icon: '💃', color: '#FF4500' },
  { id: 'reggaeton', name: 'Reggaeton', icon: '🔥', color: '#FF6B35' },
  { id: 'salsa', name: 'Salsa', icon: '🌶️', color: '#E74C3C' },
  { id: 'bossa-nova', name: 'Bossa Nova', icon: '🌴', color: '#3CB371' },
  { id: 'afrobeat', name: 'Afrobeat', icon: '🌍', color: '#DAA520' },
  { id: 'kpop', name: 'K-Pop', icon: '🇰🇷', color: '#FF69B4' },
  { id: 'jpop', name: 'J-Pop', icon: '🇯🇵', color: '#FFB7C5' },
  { id: 'bollywood', name: 'Bollywood', icon: '🇮🇳', color: '#FF9933' },
  // Caribbean & Tropical
  { id: 'reggae', name: 'Reggae', icon: '🌴', color: '#22C55E' },
  { id: 'dancehall', name: 'Dancehall', icon: '🎉', color: '#ADFF2F' },
  { id: 'ska', name: 'Ska', icon: '🎺', color: '#FFD700' },
  { id: 'tropical', name: 'Tropical', icon: '🏝️', color: '#00FA9A' },
  // Electronic Sub-genres
  { id: 'lofi', name: 'Lo-fi', icon: '☁️', color: '#94A3B8' },
  { id: 'chillwave', name: 'Chillwave', icon: '🌅', color: '#87CEEB' },
  { id: 'synthwave', name: 'Synthwave', icon: '🌆', color: '#FF00FF' },
  { id: 'drum-bass', name: 'Drum & Bass', icon: '🥁', color: '#FF1744' },
  { id: 'dubstep', name: 'Dubstep', icon: '💥', color: '#9C27B0' },
  { id: 'trance', name: 'Trance', icon: '🌀', color: '#00BFFF' },
  { id: 'ambient', name: 'Ambient', icon: '🌊', color: '#06B6D4' },
  { id: 'downtempo', name: 'Downtempo', icon: '🌙', color: '#5F9EA0' },
  // Other
  { id: 'gospel', name: 'Gospel', icon: '⛪', color: '#FFD700' },
  { id: 'trap', name: 'Trap', icon: '🔥', color: '#E040FB' },
  { id: 'drill', name: 'Drill', icon: '💎', color: '#757575' },
  { id: 'disco', name: 'Disco', icon: '🪩', color: '#C71585' },
  { id: 'new-wave', name: 'New Wave', icon: '🌊', color: '#00CED1' },
  { id: 'shoegaze', name: 'Shoegaze', icon: '👟', color: '#DDA0DD' },
  { id: 'emo', name: 'Emo', icon: '🖤', color: '#2C2C2C' },
  { id: 'hyperpop', name: 'Hyperpop', icon: '✨', color: '#FF69B4' },
  { id: 'experimental', name: 'Experimental', icon: '🧪', color: '#9370DB' },
  { id: 'noise', name: 'Noise', icon: '📢', color: '#708090' },
  { id: 'meditation', name: 'Meditation', icon: '🧘', color: '#98FB98' },
  { id: 'childrens', name: 'Children\'s', icon: '🧸', color: '#FFB6C1' },
  { id: 'holiday', name: 'Holiday', icon: '🎄', color: '#228B22' },
  { id: 'videogame', name: 'Video Game', icon: '🎮', color: '#32CD32' },
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

// Languages - All 24 supported languages (matching Fable locales)
const languages = [
  { name: 'English', flag: '🇺🇸', code: 'en' },
  { name: 'Spanish', flag: '🇪🇸', code: 'es' },
  { name: 'French', flag: '🇫🇷', code: 'fr' },
  { name: 'German', flag: '🇩🇪', code: 'de' },
  { name: 'Italian', flag: '🇮🇹', code: 'it' },
  { name: 'Portuguese', flag: '🇧🇷', code: 'pt' },
  { name: 'Dutch', flag: '🇳🇱', code: 'nl' },
  { name: 'Polish', flag: '🇵🇱', code: 'pl' },
  { name: 'Russian', flag: '🇷🇺', code: 'ru' },
  { name: 'Ukrainian', flag: '🇺🇦', code: 'uk' },
  { name: 'Bulgarian', flag: '🇧🇬', code: 'bg' },
  { name: 'Czech', flag: '🇨🇿', code: 'cs' },
  { name: 'Romanian', flag: '🇷🇴', code: 'ro' },
  { name: 'Greek', flag: '🇬🇷', code: 'el' },
  { name: 'Finnish', flag: '🇫🇮', code: 'fi' },
  { name: 'Turkish', flag: '🇹🇷', code: 'tr' },
  { name: 'Arabic', flag: '🇸🇦', code: 'ar' },
  { name: 'Hindi', flag: '🇮🇳', code: 'hi' },
  { name: 'Japanese', flag: '🇯🇵', code: 'ja' },
  { name: 'Korean', flag: '🇰🇷', code: 'ko' },
  { name: 'Chinese', flag: '🇨🇳', code: 'zh' },
  { name: 'Thai', flag: '🇹🇭', code: 'th' },
  { name: 'Vietnamese', flag: '🇻🇳', code: 'vi' },
  { name: 'Indonesian', flag: '🇮🇩', code: 'id' },
];

// Subscription plans
// Credit-based pricing system
// Credit costs:
// 1 Song = 25 credits
// 1 Still Image Video = 100 credits
// 1 Animated Video = 500 credits

interface PricePlan {
  id: string;
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  credits: number;
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
    monthlyPrice: 8.99,
    yearlyPrice: 7.19,
    credits: 500,
    musicVideos: true,
    features: [
      '500 credits/month',
      '20 songs',
      '5 still image videos',
      '1 animated video',
      'Standard quality audio',
      'Commercial license',
    ],
    stripePrices: {
      monthly: 'price_1RQOjAB6HvdZJCd5zQoxXdLw',
      yearly: 'price_1RQOkxB6HvdZJCd5un20D2Y2'
    },
    productId: 'prod_SApdzvErjotcRN'
  },
  {
    id: 'pro',
    title: 'Pro',
    monthlyPrice: 16.99,
    yearlyPrice: 13.59,
    popular: true,
    credits: 1000,
    musicVideos: true,
    features: [
      '1,000 credits/month',
      '40 songs',
      '10 still image videos',
      '2 animated videos',
      'High quality audio',
      'Commercial license',
    ],
    stripePrices: {
      monthly: 'price_1RQOniB6HvdZJCd5s4ByVBwl',
      yearly: 'price_1RQOoXB6HvdZJCd5v8SgG1OB'
    },
    productId: 'prod_SApgUFg3gLoB70'
  },
  {
    id: 'premium',
    title: 'Premium',
    monthlyPrice: 29.99,
    yearlyPrice: 23.99,
    credits: 2500,
    musicVideos: true,
    features: [
      '2,500 credits/month',
      '100 songs',
      '25 still image videos',
      '5 animated videos',
      'Highest quality audio',
      'Priority generation',
      'Commercial license',
    ],
    stripePrices: {
      monthly: 'price_1RQOqeB6HvdZJCd57Mq2AnFi',
      yearly: 'price_1RQOrJB6HvdZJCd5hw8d3dsZ'
    },
    productId: 'prod_SAphmL67DhziEI'
  }
];

// FAQ data for homepage
// FAQ data is now imported from FAQPage as faqItems

// Reviews data
const reviews = [
  { id: 1, name: 'Alex M.', rating: 5, text: 'Mind-blowing! Created a full song in seconds. This is the future of music.', avatar: '🎵' },
  { id: 2, name: 'Sarah K.', rating: 5, text: 'As a content creator, this saves me hours. The quality is incredible.', avatar: '🎤' },
  { id: 3, name: 'David L.', rating: 4.5, text: 'Love the variety of genres. Made K-Pop and lo-fi beats in one session!', avatar: '🎧' },
  { id: 4, name: 'Emma R.', rating: 5, text: 'The music videos are stunning. My YouTube channel has never looked better.', avatar: '🎬' },
  { id: 5, name: 'James T.', rating: 4, text: 'Great for quick inspiration. Some gems, some misses, but always creative.', avatar: '🎹' },
  { id: 6, name: 'Mia C.', rating: 5, text: 'Made a birthday song for my mom. She cried happy tears!', avatar: '💖' },
  { id: 7, name: 'Chris P.', rating: 5, text: 'Professional quality output. Using it for all my podcast intros now.', avatar: '🎙️' },
  { id: 8, name: 'Nina S.', rating: 4.5, text: 'The anime style music videos are exactly what I was looking for!', avatar: '✨' },
  { id: 9, name: 'Ryan B.', rating: 5, text: 'Created 50+ songs last month. Best investment for my content business.', avatar: '🚀' },
  { id: 10, name: 'Olivia H.', rating: 4, text: 'Easy to use and the results keep getting better. Love this tool!', avatar: '🌟' },
  { id: 11, name: 'Marcus W.', rating: 5, text: 'The Spanish songs are so authentic! Native speakers loved them.', avatar: '🌎' },
  { id: 12, name: 'Luna Z.', rating: 4.5, text: 'Finally, AI music that actually sounds like real music. Impressed!', avatar: '🎶' },
];

// Star rating component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<StarIcon key={i} sx={{ color: '#FFD700', fontSize: 16 }} />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalfIcon key={i} sx={{ color: '#FFD700', fontSize: 16 }} />);
    } else {
      stars.push(<StarBorderIcon key={i} sx={{ color: '#FFD700', fontSize: 16 }} />);
    }
  }
  return <Box sx={{ display: 'flex', gap: 0.25 }}>{stars}</Box>;
};

// Section Divider Component
const SectionDivider: React.FC = () => (
  <Container maxWidth="md">
    <Box
      sx={{
        height: '1.5px',
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
];

const HomePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [authTab, setAuthTab] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>('');
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);
  const promptInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, googleLogin, user, error: authError, resendVerificationEmail, getGoogleIdToken, subscription } = useAuth();
  const { token } = useSelector((state: RootState) => state.auth);
  const isPremiumMember = subscription?.tier && subscription.tier !== 'free';
  const isLoggedIn = !!token;

  // Get route-specific content
  const routeConfig = getRouteConfig(location.pathname);
  const heroHeadingParts = routeConfig.heroHeading.split('\n');
  const heroSubtext = routeConfig.heroSubtext;
  const examplePrompts = routeConfig.examplePrompts;

  // Scroll to top when route changes (makes navigation feel like a new page)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Save prompt to localStorage when user tries to generate
  const handleGenerateClick = useCallback(() => {
    if (prompt.trim()) {
      localStorage.setItem('pendingPrompt', prompt.trim());
    }
    if (user) {
      if (isPremiumMember) {
        navigate('/dashboard');
      } else {
        navigate('/payment');
      }
    } else {
      setOpen(true);
    }
  }, [user, isPremiumMember, navigate, prompt]);

  // Restore prompt from localStorage on auth success
  useEffect(() => {
    if (user && open) {
      const savedPrompt = localStorage.getItem('pendingPrompt');
      if (savedPrompt) {
        setPrompt(savedPrompt);
      }
    }
  }, [user, open]);

  const handleClickOpen = useCallback(async () => {
    if (user) {
      if (isPremiumMember) {
        navigate('/dashboard');
        return;
      } else {
        navigate('/payment');
        return;
      }
    }
    setOpen(true);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setError(null);
  }, [user, isPremiumMember, navigate]);

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

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
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
          navigate('/dashboard');
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
          navigate('/dashboard');
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

  const handleSelectPlan = useCallback((planId: string) => {
    setSelectedPlan(planId);
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#FFFFFF',
      color: '#1D1D1F',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle gradient background - Apple-style clean blue */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at top center, rgba(0, 122, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(90, 200, 250, 0.05) 0%, transparent 40%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Header - Glassy White */}
      <Box
        component="header"
              sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2,
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                fontSize: '1.5rem',
                color: '#1D1D1F',
                letterSpacing: '-0.02em',
              }}
            >
              Gruvi
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
                variant="text"
                sx={{ 
                  color: '#86868B',
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': { color: '#1D1D1F' },
                }}
              component={RouterLink} 
              to="/faq"
            >
              FAQ
            </Button>
            <Button 
                variant="outlined"
                onClick={handleClickOpen}
                sx={{
                  borderColor: 'rgba(0,0,0,0.15)',
                  color: '#1D1D1F',
                  px: 3,
                  borderRadius: '100px',
                  '&:hover': {
                    borderColor: 'rgba(0,0,0,0.3)',
                    background: 'rgba(0,0,0,0.03)',
                  },
                }}
              >
                Sign In
            </Button>
            <Button 
              variant="contained" 
                onClick={handleClickOpen}
                sx={{
                  background: '#1D1D1F',
                  color: '#fff',
                  px: 3,
                  borderRadius: '100px',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': {
                    background: '#000',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Sign Up
            </Button>
          </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section with Prompt Input */}
      <Box sx={{ 
        pt: { xs: 16, md: 20 },
        pb: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 1,
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            {/* Main Headline with Gruvi branding */}
          <Typography 
            variant="h1" 
            sx={{ 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 700,
                color: '#1D1D1F',
              lineHeight: 1.1,
                mb: 2,
                letterSpacing: '-0.03em',
              }}
            >
              Gruvi:{' '}
              <Box 
                component="span" 
            sx={{ 
                  background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {heroHeadingParts[0]}
              </Box>
          </Typography>

            {/* Tagline */}
          <Typography 
            sx={{ 
                fontFamily: '"Fredoka", "Inter", sans-serif',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                fontWeight: 600,
                color: '#1D1D1F',
                mb: 2,
            }}
          >
              {heroHeadingParts[1] || 'Make a song about anything'}
          </Typography>

            {/* Prompt Input - Glassy */}
          <Box sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              mb: 4,
            }}>
              <TextField
                fullWidth
                placeholder="Type any idea you have into a song..."
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
                        <SendRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              sx={{ 
                  '& .MuiOutlinedInput-root': {
                    background: '#fff',
                    borderRadius: '100px',
                    pr: 1.5,
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
                    py: 2.5,
                    px: 3,
                    fontSize: '1.1rem',
                    fontWeight: 400,
                    '&::placeholder': {
                      color: '#86868B',
                      opacity: 1,
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
              gap: 1, 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              mb: 6,
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
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderRadius: '100px',
                    px: 0.5,
                    height: 36,
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

        {/* Reviews Carousel */}
        <Box sx={{ overflow: 'hidden', py: 2 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              animation: 'scrollReviews 45s linear infinite',
              '&:hover': {
                animationPlayState: 'paused',
              },
              '@keyframes scrollReviews': {
                '0%': { transform: 'translateX(0)' },
                '100%': { transform: 'translateX(-50%)' },
              },
            }}
          >
            {/* Duplicate reviews for seamless loop */}
            {[...reviews, ...reviews].map((review, index) => (
              <Box
                key={`${review.id}-${index}`}
                sx={{
                  minWidth: { xs: 260, sm: 300 },
                  p: 2.5,
                  borderRadius: '16px',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(90,200,250,0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                    }}
                  >
                    {review.avatar}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: '0.9rem' }}>
                      {review.name}
                    </Typography>
                    <StarRating rating={review.rating} />
                  </Box>
                </Box>
                <Typography sx={{ color: '#86868B', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  "{review.text}"
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <SectionDivider />

      {/* Featured Tracks Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
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
              Mind blowing song quality
          </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '1rem' }}>
              Hear what others have created with Gruvi
                </Typography>
          </Box>

          {/* Tracklist UI - Premium Glass */}
          <Box
            sx={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
              overflow: 'hidden',
            }}
          >
            {sampleTracks.map((track, index) => (
              <Box
                key={track.id}
            sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 2, sm: 3 },
                  p: { xs: 1.5, sm: 2 },
                  borderBottom: index < sampleTracks.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(0,122,255,0.04)',
                  },
                }}
              >
                {/* Track Number */}
          <Typography 
            sx={{ 
                    width: 24,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#86868B',
              textAlign: 'center',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {index + 1}
                </Typography>

                {/* Album Art */}
                <Box
                        sx={{
              position: 'relative',
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    borderRadius: '10px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
              <Box
                component="img"
                    src={track.cover}
                    alt={track.title}
                sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ color: '#007AFF', fontSize: 20 }} />
                    </Box>
                  </Box>
            </Box>

                {/* Track Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600,
                      color: '#1D1D1F',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {track.title}
                </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.8rem',
                      color: '#86868B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {track.genre}
                </Typography>
              </Box>



                {/* Action Buttons - Closer together */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                                  {/* Plays */}
                <Typography
                  sx={{
                    alignSelf: 'center',
                    fontSize: '0.85rem',
                    color: '#86868B',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {track.plays}
                </Typography>
                  {/* Download Button */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoggedIn) {
                        setOpen(true);
                      }
                    }}
                    sx={{
                      background: '#fff',
                      color: '#007AFF',
                      width: 40,
                      height: 40,
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        background: '#fff',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <DownloadRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>

                  {/* Play Button */}
                  <IconButton
                    size="small"
                    sx={{ 
                      background: '#fff',
                      color: '#007AFF',
                      width: 40,
                      height: 40,
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        background: '#fff',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
                </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <SectionDivider />

      {/* Music Videos Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
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
              Turn your music into videos
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '1rem', maxWidth: '500px', mx: 'auto' }}>
              Create stunning AI-generated music videos in any style. 
              Add your characters and bring your music to life.
                  </Typography>
                </Box>

          {/* Videos Carousel */}
          <Box
        sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              py: 4,
              px: 2,
              justifyContent: 'center',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {sampleVideos.map((video) => (
              <Box
                key={video.id}
                onClick={() => navigate(`/videos/${video.title.toLowerCase().replace(/\s+/g, '-')}`)}
              sx={{ 
                  minWidth: { xs: '160px', sm: '180px' },
                position: 'relative',
                  borderRadius: '20px',
                overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
              }}
            >
              {/* Image container */}
              <Box
                sx={{
                  position: 'relative',
                    aspectRatio: '9/16',
                  overflow: 'hidden',
                  borderRadius: '16px',
                }}
              >
                <Box
                  component="img"
                    src={video.thumbnail}
                    alt={video.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Play button overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                      inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                    <IconButton
                    sx={{
                        background: '#fff',
                        color: '#007AFF',
                        width: 52,
                        height: 52,
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          background: '#fff', 
                          transform: 'translateY(-2px) scale(1.05)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        },
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: 28, color: '#007AFF' }} />
                    </IconButton>
                </Box>
                {/* Info overlay at bottom with dark gradient */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1.5,
                    pt: 4,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                  }}
                >
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {video.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={video.style}
                      size="small"
                      sx={{
                        background: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        height: 24,
                        borderRadius: '100px',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                    <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>
                      {video.views}
                  </Typography>
                  </Box>
                </Box>
                </Box>
              </Box>
            ))}
                </Box>
              </Container>
            </Box>

      <SectionDivider />

      {/* Value Proposition - Genres */}
      <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
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
              Every genre imaginable
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '1rem' }}>
              From pop to classical, hip hop to ambient — create any style of music
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
            {genres.map((genre, index) => (
                  <Box 
                    key={index}
                    onClick={() => navigate(`/genres/${genre.id}`)}
                    sx={{
                      display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
                    transform: 'translateY(-2px) scale(1.02)',
                    borderColor: 'rgba(0,122,255,0.2)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '1.25rem' }}>{genre.icon}</Typography>
                <Typography sx={{ color: '#1D1D1F', fontWeight: 500, fontSize: '0.9rem' }}>
                  {genre.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <SectionDivider />

      {/* Value Proposition - Art Styles */}
      <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
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
              Music videos in any style
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '1rem' }}>
              Choose from dozens of visual styles for your music videos
            </Typography>
          </Box>

          <Box
                      sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(8, 1fr)' },
              gap: 2,
            }}
          >
            {artStyles.map((style, index) => (
              <Box
                key={index}
                onClick={() => navigate(`/styles/${style.id}`)}
                sx={{
                  aspectRatio: '1',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={style.image}
                  alt={`${style.label} style example`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Label overlay at bottom */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    padding: '24px 8px 8px 8px',
                  }}
                >
                  <Typography sx={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                    {style.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <SectionDivider />

      {/* Value Proposition - Languages */}
      <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
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
              Create in any language
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '1rem' }}>
              Generate lyrics and vocals in 24+ languages
                      </Typography>
                    </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            {languages.map((lang, index) => (
              <Box
                key={index}
                onClick={() => navigate(`/languages/${lang.name.toLowerCase()}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
                    transform: 'translateY(-2px)',
                    borderColor: 'rgba(0,122,255,0.2)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '1.25rem' }}>{lang.flag}</Typography>
                <Typography sx={{ color: '#1D1D1F', fontSize: '0.9rem', fontWeight: 500 }}>
                  {lang.name}
                </Typography>
                  </Box>
                ))}
              </Box>
            </Container>
          </Box>

      <SectionDivider />

      {/* Features Grid */}
      <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
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
              Everything you need to make music your way
            </Typography>
          </Box>

          <Box
                  sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {[
              {
                icon: <MusicNoteIcon sx={{ fontSize: 32 }} />,
                title: 'High-quality audio',
                description: 'Professional-grade AI music generation with studio-quality output.',
              },
              {
                icon: <PersonIcon sx={{ fontSize: 32 }} />,
                title: 'Add anyone to your video',
                description: 'Create characters with reference images and feature them in your music videos.',
              },
              {
                icon: <ShareIcon sx={{ fontSize: 32 }} />,
                title: 'Share everywhere',
                description: 'Export and share your creations on any platform or social media.',
              },
              {
                icon: <VideoLibraryIcon sx={{ fontSize: 32 }} />,
                title: 'Music videos',
                description: 'Turn any song into a stunning AI-generated music video.',
              },
              {
                icon: <BoltIcon sx={{ fontSize: 32 }} />,
                title: 'Fast generation',
                description: 'Get your music in seconds, not minutes. Iterate quickly.',
              },
              {
                icon: <ThumbUpIcon sx={{ fontSize: 32 }} />,
                title: 'Commercial license',
                description: 'Use your creations for content, streaming, or commercial projects.',
              },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 3.5,
                  borderRadius: '24px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)',
                    borderColor: 'rgba(0,122,255,0.15)',
                  },
                }}
              >
                <Box sx={{ color: '#007AFF', mb: 2, filter: 'drop-shadow(0 2px 4px rgba(0,122,255,0.2))' }}>{feature.icon}</Box>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
                  {feature.title}
              </Typography>
                <Typography sx={{ color: '#86868B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {feature.description}
              </Typography>
            </Box>
            ))}
          </Box>
          </Container>
      </Box>

      <SectionDivider />

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
              Start making music for free
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '1rem', mb: 4 }}>
              Select the plan that best fits your needs
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
                onClick={() => handleSelectPlan(plan.id)}
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
                    {plan.id === 'starter' ? 'Our starter plan.' : 
                     plan.id === 'pro' ? 'Access to music videos and more.' : 
                     'Maximum credits and every feature unlocked.'}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
                          {plan.title}
                        </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </Typography>
                    <Typography sx={{ color: '#86868B', ml: 1 }}>
                      /month
                        </Typography>
                      </Box>
                  
                  {isYearly && (
                    <Typography sx={{ fontSize: '0.85rem', color: '#007AFF', mb: 3 }}>
                      Saves ${((plan.monthlyPrice - plan.yearlyPrice) * 12).toFixed(0)} by billing yearly!
                    </Typography>
                  )}

                      <Button 
                        fullWidth 
                    variant={selectedPlan === plan.id ? 'contained' : 'outlined'}
                    onClick={(e) => {
                          e.stopPropagation();
                      handleSelectPlan(plan.id);
                      handleClickOpen();
                        }}
                        sx={{ 
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      mb: 3,
                      ...(selectedPlan === plan.id ? {
                        background: '#1D1D1F',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        '&:hover': { background: '#000' },
                      } : {
                        borderColor: 'rgba(0,0,0,0.15)',
                        color: '#1D1D1F',
                        '&:hover': { 
                          borderColor: 'rgba(0,0,0,0.3)',
                          background: 'rgba(0,0,0,0.03)',
                        },
                      }),
                    }}
                  >
                    {plan.id === 'starter' ? 'Sign Up' : 'Subscribe'}
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

          {/* Credit Top-ups */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography sx={{ color: '#86868B', fontSize: '0.9rem' }}>
              Need more credits? Purchase additional credit packs anytime. 
              <Link href="#" sx={{ color: '#007AFF', ml: 0.5 }}>Learn more</Link>
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
      <Box sx={{ py: { xs: 6, md: 8 }, position: 'relative', zIndex: 1 }}>
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

      <SectionDivider />

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
          severity="success"
          sx={{ 
            borderRadius: '12px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            color: '#22C55E',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage; 
