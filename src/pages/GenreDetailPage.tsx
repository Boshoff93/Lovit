import React, { useMemo, useEffect } from 'react';
import {
  Typography,
  Box,
  Container,
  Button,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';

// Genre data with detailed information
export const genreData = [
  // Popular/Mainstream
  { id: 'pop', name: 'Pop', icon: '🎤', color: '#FF6B9D', description: 'Catchy melodies and upbeat rhythms for the masses', fullDescription: 'Pop music is characterized by its catchy melodies, memorable hooks, and accessible sound. Perfect for creating viral content, feel-good tracks, and songs that appeal to a wide audience. From dance-pop to synth-pop, this genre offers endless creative possibilities.' },
  { id: 'hip-hop', name: 'Hip Hop', icon: '🎧', color: '#9D4EDD', description: 'Urban beats with powerful vocals and rhythms', fullDescription: 'Hip Hop combines rhythmic beats with spoken word, rap, and samples. Create everything from boom bap classics to modern trap-influenced tracks. Perfect for storytelling, social commentary, or party anthems.' },
  { id: 'rnb', name: 'R&B', icon: '💜', color: '#A855F7', description: 'Smooth soulful vibes with emotional depth', fullDescription: 'R&B blends rhythm and blues with soul, funk, and contemporary influences. Create smooth, emotional tracks perfect for romance, reflection, or late-night vibes. Features rich harmonies and groove-driven production.' },
  { id: 'electronic', name: 'Electronic', icon: '⚡', color: '#00D9FF', description: 'Synthesized sounds and electronic production', fullDescription: 'Electronic music encompasses a vast world of synthesized sounds, from ambient textures to high-energy bangers. Create everything from chill electronic to festival anthems with cutting-edge production.' },
  { id: 'dance', name: 'Dance', icon: '💃', color: '#FF1493', description: 'High-energy beats that move the crowd', fullDescription: 'Dance music is designed to get people moving. With driving beats, infectious rhythms, and euphoric builds, create tracks perfect for clubs, parties, and workout playlists.' },
  { id: 'house', name: 'House', icon: '🏠', color: '#00CED1', description: 'Four-on-the-floor beats and deep grooves', fullDescription: 'House music features the iconic four-on-the-floor beat pattern with soulful elements and deep basslines. From deep house to tech house, create groovy tracks that define dance floor culture.' },
  { id: 'edm', name: 'EDM', icon: '🔊', color: '#7B68EE', description: 'Festival-ready electronic dance anthems', fullDescription: 'EDM brings together the most explosive elements of electronic music with massive drops, soaring synths, and crowd-moving energy. Perfect for festival anthems and high-energy content.' },
  { id: 'techno', name: 'Techno', icon: '🤖', color: '#8A2BE2', description: 'Hypnotic rhythms and industrial textures', fullDescription: 'Techno features hypnotic, repetitive rhythms with industrial and mechanical textures. Create mind-bending tracks that build tension and release through subtle evolution and driving beats.' },
  // Rock & Alternative
  { id: 'rock', name: 'Rock', icon: '🎸', color: '#FF4757', description: 'Guitar-driven power and raw energy', fullDescription: 'Rock music delivers guitar-driven power with drums and bass creating the foundation. From classic rock to modern alternative, create songs with attitude, energy, and timeless appeal.' },
  { id: 'alternative', name: 'Alternative', icon: '🔥', color: '#DC143C', description: 'Indie spirit with experimental edge', fullDescription: 'Alternative rock pushes boundaries while maintaining accessibility. Create unique sounds that blend indie sensibilities with rock power, perfect for distinctive artistic expression.' },
  { id: 'indie', name: 'Indie', icon: '🌙', color: '#B8860B', description: 'Independent spirit with authentic sound', fullDescription: 'Indie music embraces authentic, DIY aesthetics with diverse influences. Create heartfelt tracks with lo-fi charm or polished indie-pop that stands out from mainstream sounds.' },
  { id: 'punk', name: 'Punk', icon: '⚡', color: '#FF6347', description: 'Fast, loud, and rebellious', fullDescription: 'Punk delivers fast tempos, aggressive energy, and rebellious attitude. Create raw, energetic tracks with simple chord progressions and powerful messages.' },
  { id: 'metal', name: 'Metal', icon: '🤘', color: '#2F4F4F', description: 'Heavy riffs and powerful intensity', fullDescription: 'Metal music features heavy guitar riffs, powerful drums, and intense vocals. From heavy metal to death metal, create tracks with maximum intensity and technical prowess.' },
  { id: 'grunge', name: 'Grunge', icon: '🎵', color: '#696969', description: 'Raw emotion with distorted guitars', fullDescription: 'Grunge blends punk energy with heavy metal influences and introspective lyrics. Create raw, emotional tracks with the signature dirty guitar sound of the genre.' },
  // Jazz & Blues
  { id: 'jazz', name: 'Jazz', icon: '🎷', color: '#FFB347', description: 'Sophisticated harmonies and improvisation', fullDescription: 'Jazz features complex harmonies, swing rhythms, and improvisation. Create sophisticated tracks from cool jazz to fusion, perfect for cafes, relaxation, or artistic expression.' },
  { id: 'blues', name: 'Blues', icon: '🎺', color: '#4169E1', description: 'Soulful expression with deep emotion', fullDescription: 'Blues music expresses deep emotion through distinctive chord progressions and soulful vocals. Create authentic tracks with the characteristic 12-bar blues and heartfelt lyrics.' },
  { id: 'soul', name: 'Soul', icon: '❤️', color: '#CD5C5C', description: 'Heartfelt vocals with gospel influence', fullDescription: 'Soul music combines gospel passion with R&B groove. Create deeply emotional tracks with powerful vocals, rich harmonies, and moving arrangements.' },
  { id: 'funk', name: 'Funk', icon: '🕺', color: '#FF8C00', description: 'Groovy bass and rhythmic power', fullDescription: 'Funk emphasizes the groove with syncopated bass lines, rhythmic guitars, and punchy horns. Create tracks that demand dancing with irresistible rhythms.' },
  // Classical & Orchestral
  { id: 'classical', name: 'Classical', icon: '🎻', color: '#4ECDC4', description: 'Timeless orchestral compositions', fullDescription: 'Classical music encompasses centuries of orchestral tradition. Create elegant compositions with strings, woodwinds, brass, and percussion in timeless arrangements.' },
  { id: 'orchestral', name: 'Orchestral', icon: '🎼', color: '#8B4513', description: 'Full orchestra arrangements', fullDescription: 'Orchestral music harnesses the full power of the symphony orchestra. Create grand, sweeping compositions perfect for film, games, or standalone listening.' },
  { id: 'opera', name: 'Opera', icon: '🎭', color: '#800020', description: 'Dramatic vocal performances', fullDescription: 'Opera combines dramatic singing with orchestral accompaniment. Create powerful vocal pieces with operatic flair and theatrical emotion.' },
  { id: 'cinematic', name: 'Cinematic', icon: '🎬', color: '#1E293B', description: 'Epic soundscapes for visual media', fullDescription: 'Cinematic music creates emotional soundscapes for films, trailers, and games. Create epic, moving tracks with orchestral and electronic elements.' },
  { id: 'soundtrack', name: 'Soundtrack', icon: '🎞️', color: '#2C3E50', description: 'Music designed for visual storytelling', fullDescription: 'Soundtrack music supports visual narratives with emotional precision. Create versatile tracks that enhance video content, from tension to triumph.' },
  // Country & Folk
  { id: 'country', name: 'Country', icon: '🤠', color: '#D4A574', description: 'Heartland stories with acoustic roots', fullDescription: 'Country music tells stories of life, love, and land with acoustic instruments and heartfelt lyrics. Create tracks from traditional country to modern country-pop.' },
  { id: 'folk', name: 'Folk', icon: '🪕', color: '#8B7355', description: 'Traditional acoustic storytelling', fullDescription: 'Folk music preserves traditional storytelling with acoustic instruments. Create intimate tracks with banjo, guitar, and authentic vocals.' },
  { id: 'bluegrass', name: 'Bluegrass', icon: '🌾', color: '#6B8E23', description: 'Fast-picking acoustic string music', fullDescription: 'Bluegrass features virtuosic string playing with fast tempos and tight harmonies. Create energetic acoustic tracks with mandolin, banjo, and fiddle.' },
  { id: 'acoustic', name: 'Acoustic', icon: '🎸', color: '#DEB887', description: 'Stripped-down unplugged sound', fullDescription: 'Acoustic music strips away production to focus on raw instrumentation. Create intimate tracks with guitar, piano, and natural sounds.' },
  // Latin & World
  { id: 'latin', name: 'Latin', icon: '💃', color: '#FF4500', description: 'Passionate rhythms from Latin America', fullDescription: 'Latin music encompasses the rich traditions of Latin America with passionate rhythms, brass, and percussion. Create tracks from salsa to modern Latin pop.' },
  { id: 'reggaeton', name: 'Reggaeton', icon: '🔥', color: '#FF6B35', description: 'Urban Latin beats with dembow rhythm', fullDescription: 'Reggaeton blends Caribbean rhythms with hip-hop production. Create infectious tracks with the signature dembow beat that dominates global charts.' },
  { id: 'salsa', name: 'Salsa', icon: '🌶️', color: '#E74C3C', description: 'Energetic Cuban-influenced dance music', fullDescription: 'Salsa features energetic percussion, brass, and Cuban rhythms. Create dance floor-ready tracks with infectious montuno patterns.' },
  { id: 'bossa-nova', name: 'Bossa Nova', icon: '🌴', color: '#3CB371', description: 'Smooth Brazilian jazz fusion', fullDescription: 'Bossa Nova combines Brazilian samba with jazz harmonies. Create smooth, sophisticated tracks with gentle rhythms and warm melodies.' },
  { id: 'afrobeat', name: 'Afrobeat', icon: '🌍', color: '#DAA520', description: 'West African rhythmic complexity', fullDescription: 'Afrobeat fuses West African music with jazz and funk. Create complex polyrhythmic tracks with call-and-response vocals and extended grooves.' },
  { id: 'kpop', name: 'K-Pop', icon: '🇰🇷', color: '#FF69B4', description: 'Korean pop with polished production', fullDescription: 'K-Pop features highly polished production with catchy hooks and dynamic arrangements. Create radio-ready tracks with the glossy K-Pop aesthetic.' },
  { id: 'jpop', name: 'J-Pop', icon: '🇯🇵', color: '#FFB7C5', description: 'Japanese pop with unique character', fullDescription: 'J-Pop brings Japanese pop sensibilities with energetic performances and memorable melodies. Create tracks with the distinctive J-Pop sound.' },
  { id: 'bollywood', name: 'Bollywood', icon: '🇮🇳', color: '#FF9933', description: 'Colorful Indian film music', fullDescription: 'Bollywood music blends Indian classical, folk, and modern pop for film soundtracks. Create dramatic, colorful tracks with rich instrumentation.' },
  // Caribbean & Tropical
  { id: 'reggae', name: 'Reggae', icon: '🌴', color: '#22C55E', description: 'Laid-back Jamaican rhythms', fullDescription: 'Reggae features the off-beat rhythm guitar and bass-heavy grooves of Jamaica. Create chill, positive tracks with the iconic reggae sound.' },
  { id: 'dancehall', name: 'Dancehall', icon: '🎉', color: '#ADFF2F', description: 'Energetic Jamaican party music', fullDescription: 'Dancehall brings energetic Jamaican club music with digital rhythms and toasting vocals. Create party tracks with Caribbean flavor.' },
  { id: 'ska', name: 'Ska', icon: '🎺', color: '#FFD700', description: 'Upbeat with walking basslines', fullDescription: 'Ska features walking basslines, offbeat rhythms, and brass sections. Create upbeat, energetic tracks with the distinctive ska sound.' },
  { id: 'tropical', name: 'Tropical', icon: '🏝️', color: '#00FA9A', description: 'Island vibes and sunny sounds', fullDescription: 'Tropical music brings sunny, island vibes with steel drums, marimbas, and beach-ready rhythms. Create feel-good vacation soundtracks.' },
  // Electronic Sub-genres
  { id: 'lofi', name: 'Lo-fi', icon: '☁️', color: '#94A3B8', description: 'Chill beats with nostalgic warmth', fullDescription: 'Lo-fi music embraces imperfection with warm, nostalgic sounds. Create chill beats perfect for studying, relaxation, and background ambiance.' },
  { id: 'chillwave', name: 'Chillwave', icon: '🌅', color: '#87CEEB', description: 'Dreamy synths with retro vibes', fullDescription: 'Chillwave features dreamy synthesizers and nostalgic production. Create hazy, atmospheric tracks with vintage electronic warmth.' },
  { id: 'synthwave', name: 'Synthwave', icon: '🌆', color: '#FF00FF', description: 'Retro 80s electronic nostalgia', fullDescription: 'Synthwave captures 80s nostalgia with pulsing synths and neon aesthetics. Create retro-futuristic tracks perfect for driving and content.' },
  { id: 'drum-bass', name: 'Drum & Bass', icon: '🥁', color: '#FF1744', description: 'Fast breakbeats and heavy bass', fullDescription: 'Drum and bass features rapid breakbeats with deep basslines. Create high-energy tracks with intense rhythms and bass-driven power.' },
  { id: 'dubstep', name: 'Dubstep', icon: '💥', color: '#9C27B0', description: 'Heavy wobbles and bass drops', fullDescription: 'Dubstep delivers heavy bass wobbles and massive drops. Create impactful tracks with signature LFO modulation and powerful low end.' },
  { id: 'trance', name: 'Trance', icon: '🌀', color: '#00BFFF', description: 'Euphoric builds and melodic journeys', fullDescription: 'Trance features euphoric melodies and building energy. Create uplifting tracks with arpeggiated synths and emotional peaks.' },
  { id: 'ambient', name: 'Ambient', icon: '🌊', color: '#06B6D4', description: 'Atmospheric soundscapes', fullDescription: 'Ambient music creates atmospheric, textural soundscapes. Create meditative, immersive tracks perfect for relaxation and focus.' },
  { id: 'downtempo', name: 'Downtempo', icon: '🌙', color: '#5F9EA0', description: 'Relaxed electronic grooves', fullDescription: 'Downtempo brings relaxed electronic beats with chilled vibes. Create laid-back tracks for lounge settings and evening relaxation.' },
  // Other
  { id: 'gospel', name: 'Gospel', icon: '⛪', color: '#FFD700', description: 'Spiritual music with powerful vocals', fullDescription: 'Gospel music brings spiritual power with passionate vocals and choir harmonies. Create uplifting, inspirational tracks with gospel tradition.' },
  { id: 'trap', name: 'Trap', icon: '🔥', color: '#E040FB', description: 'Heavy 808s and hi-hat patterns', fullDescription: 'Trap features heavy 808 bass, rapid hi-hats, and dark atmospheres. Create hard-hitting tracks with the signature trap production style.' },
  { id: 'drill', name: 'Drill', icon: '💎', color: '#757575', description: 'Dark, aggressive hip-hop subgenre', fullDescription: 'Drill delivers dark, aggressive production with sliding 808s and ominous atmospheres. Create intense tracks with the drill sound.' },
  { id: 'disco', name: 'Disco', icon: '🪩', color: '#C71585', description: 'Classic dance floor grooves', fullDescription: 'Disco brings four-on-the-floor beats with funk bass and orchestral strings. Create timeless dance tracks with that classic disco feel.' },
  { id: 'new-wave', name: 'New Wave', icon: '🌊', color: '#00CED1', description: '80s synth-pop with artistic edge', fullDescription: 'New Wave blends synthesizers with punk energy and artistic sensibility. Create tracks with the distinctive 80s sound and modern edge.' },
  { id: 'shoegaze', name: 'Shoegaze', icon: '👟', color: '#DDA0DD', description: 'Wall of guitar effects and ethereal vocals', fullDescription: 'Shoegaze features heavily effected guitars and ethereal vocals. Create dreamy, immersive tracks with layers of sound and texture.' },
  { id: 'emo', name: 'Emo', icon: '🖤', color: '#4A0E0E', description: 'Emotional punk with introspective lyrics', fullDescription: 'Emo combines punk energy with deeply emotional, introspective lyrics. Create passionate tracks that express raw feelings.' },
  { id: 'hyperpop', name: 'Hyperpop', icon: '✨', color: '#FF10F0', description: 'Maximalist pop with experimental production', fullDescription: 'Hyperpop pushes pop music to extremes with distorted vocals, glitchy production, and maximalist energy. Create boundary-pushing tracks.' },
  { id: 'experimental', name: 'Experimental', icon: '🧪', color: '#32CD32', description: 'Boundary-pushing sonic exploration', fullDescription: 'Experimental music breaks all rules with avant-garde approaches. Create unique soundscapes that challenge conventions.' },
  { id: 'noise', name: 'Noise', icon: '📢', color: '#8B0000', description: 'Abstract sonic textures', fullDescription: 'Noise music explores abstract sonic textures and extreme sounds. Create challenging, artistic tracks for adventurous listeners.' },
  { id: 'meditation', name: 'Meditation', icon: '🧘', color: '#9370DB', description: 'Peaceful sounds for mindfulness', fullDescription: 'Meditation music creates peaceful environments for mindfulness practice. Create serene tracks with calming tones and gentle progressions.' },
  { id: 'childrens', name: "Children's", icon: '👶', color: '#FFB6C1', description: 'Fun music for young audiences', fullDescription: "Children's music entertains and educates young listeners. Create fun, age-appropriate tracks with simple melodies and positive messages." },
  { id: 'holiday', name: 'Holiday', icon: '🎄', color: '#228B22', description: 'Seasonal celebration music', fullDescription: 'Holiday music celebrates seasonal occasions with festive sounds. Create tracks for Christmas, Halloween, and other celebrations.' },
  { id: 'videogame', name: 'Video Game', icon: '🎮', color: '#9400D3', description: 'Music for gaming experiences', fullDescription: 'Video game music enhances gaming with adaptive, immersive scores. Create tracks from 8-bit chiptune to epic orchestral game soundtracks.' },
];

// Sample tracks for each genre (you'd expand this)
const genreSampleTracks: Record<string, Array<{id: number; title: string; duration: string; plays: string}>> = {
  'pop': [
    { id: 1, title: 'Summer Dreams', duration: '2:45', plays: '24.5K' },
    { id: 2, title: 'Dancing Tonight', duration: '3:12', plays: '18.2K' },
    { id: 3, title: 'Heart of Gold', duration: '2:58', plays: '32.1K' },
  ],
  'hip-hop': [
    { id: 1, title: 'City Lights', duration: '3:22', plays: '41.3K' },
    { id: 2, title: 'Rise Up', duration: '2:56', plays: '28.7K' },
    { id: 3, title: 'Street Stories', duration: '3:45', plays: '35.9K' },
  ],
  // Default tracks for genres without specific samples
  'default': [
    { id: 1, title: 'Track One', duration: '2:45', plays: '15.2K' },
    { id: 2, title: 'Track Two', duration: '3:18', plays: '12.8K' },
    { id: 3, title: 'Track Three', duration: '2:32', plays: '18.4K' },
  ],
};

const GenreDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { genreId } = useParams<{ genreId: string }>();

  // Find the current genre data
  const currentGenre = useMemo(() => {
    return genreData.find(genre => genre.id === genreId);
  }, [genreId]);

  // Get sample tracks for this genre
  const sampleTracks = useMemo(() => {
    return genreSampleTracks[genreId || ''] || genreSampleTracks['default'];
  }, [genreId]);

  // Scroll to top when component mounts or genreId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [genreId]);

  // If genre not found, redirect to home
  if (!currentGenre) {
    navigate('/');
    return null;
  }

  // Create breadcrumb data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://gruvi.ai/' },
    { name: 'Genres', url: 'https://gruvi.ai/genres' },
    { name: currentGenre.name, url: `https://gruvi.ai/genres/${currentGenre.id}` }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fff',
        position: 'relative',
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at top, ${currentGenre.color}10 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SEO
        title={`Create ${currentGenre.name} Music with AI | Gruvi`}
        description={`Generate original ${currentGenre.name} music with Gruvi's AI music generator. ${currentGenre.fullDescription}`}
        keywords={`${currentGenre.name.toLowerCase()} music, AI ${currentGenre.name.toLowerCase()} generator, create ${currentGenre.name.toLowerCase()} songs, ${currentGenre.name.toLowerCase()} beats`}
        ogTitle={`Create ${currentGenre.name} Music with AI | Gruvi`}
        ogDescription={`Generate original ${currentGenre.name} music with Gruvi's AI music generator. ${currentGenre.description}`}
        ogType="website"
        ogUrl={`https://gruvi.ai/genres/${currentGenre.id}`}
        twitterTitle={`Create ${currentGenre.name} Music with AI | Gruvi`}
        twitterDescription={currentGenre.description}
        structuredData={[createBreadcrumbStructuredData(breadcrumbData)]}
      />

      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            mb: 4,
            color: '#1D1D1F',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(0,0,0,0.05)',
            }
          }}
        >
          Back to Home
        </Button>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          {/* Genre Icon */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: '32px',
              background: `linear-gradient(135deg, ${currentGenre.color}20, ${currentGenre.color}40)`,
              backdropFilter: 'blur(20px)',
              border: `2px solid ${currentGenre.color}30`,
              boxShadow: `0 20px 60px ${currentGenre.color}20, 0 8px 24px rgba(0,0,0,0.1)`,
              mb: 4,
            }}
          >
            <Typography sx={{ fontSize: '4rem' }}>{currentGenre.icon}</Typography>
          </Box>

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              color: '#1D1D1F',
              mb: 2,
            }}
          >
            {currentGenre.name} Music
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: '1.25rem',
              color: '#86868B',
              mb: 3,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {currentGenre.description}
          </Typography>

          {/* Full Description */}
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: '#1D1D1F',
              mb: 4,
              lineHeight: 1.8,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            {currentGenre.fullDescription}
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            endIcon={<KeyboardArrowRightIcon />}
            sx={{
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(20px)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '16px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              },
            }}
          >
            Create {currentGenre.name} Music
          </Button>
        </Box>

        {/* Sample Tracks Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#1D1D1F',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Example {currentGenre.name} Tracks
          </Typography>

          <Box
            sx={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}
          >
            {sampleTracks.map((track, index) => (
              <Box
                key={track.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderBottom: index < sampleTracks.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(0,122,255,0.04)',
                  },
                }}
              >
                {/* Track Number */}
                <Typography sx={{ width: 24, color: '#86868B', fontWeight: 500 }}>
                  {index + 1}
                </Typography>

                {/* Genre Icon as Cover */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${currentGenre.color}30, ${currentGenre.color}50)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  {currentGenre.icon}
                </Box>

                {/* Track Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                    {track.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                    {currentGenre.name} • {track.duration}
                  </Typography>
                </Box>

                {/* Plays */}
                <Typography sx={{ color: '#86868B', fontSize: '0.9rem', display: { xs: 'none', sm: 'block' } }}>
                  {track.plays}
                </Typography>

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <DownloadRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
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
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Related Genres */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1D1D1F',
              mb: 3,
            }}
          >
            Explore More Genres
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
            {genreData.slice(0, 12).filter(g => g.id !== genreId).slice(0, 8).map((genre) => (
              <Box
                key={genre.id}
                onClick={() => navigate(`/genres/${genre.id}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    borderColor: `${genre.color}40`,
                  },
                }}
              >
                <Typography sx={{ fontSize: '1.25rem' }}>{genre.icon}</Typography>
                <Typography sx={{ fontWeight: 500, color: '#1D1D1F' }}>{genre.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            p: 5,
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
            Ready to Create Your Own {currentGenre.name} Track?
          </Typography>
          <Typography sx={{ color: '#86868B', mb: 3, fontSize: '1.1rem' }}>
            Sign up for Gruvi and start generating professional {currentGenre.name} music in seconds.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,1))',
              backdropFilter: 'blur(20px)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '16px',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              '&:hover': {
                background: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              },
            }}
          >
            Get Started Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default GenreDetailPage;

