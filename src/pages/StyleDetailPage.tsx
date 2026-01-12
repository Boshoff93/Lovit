import React, { useMemo, useEffect } from 'react';
import {
  Typography,
  Box,
  Container,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

// Art style data with detailed information and boy images
export const artStyleData = [
  { id: '3d-cartoon', label: '3D Cartoon', icon: '🎨', color: '#88cfff', image: '/art_styles/boy_cartoon.jpeg', description: 'Pixar-style 3D animated visuals with vibrant colors', fullDescription: '3D Cartoon style brings your music videos to life with smooth, polished characters and bright, eye-catching colors. This modern animation style creates engaging visuals that capture attention with lifelike depth and dimension, perfect for fun, energetic songs.' },
  { id: 'claymation', label: 'Claymation', icon: '🎭', color: '#e8b545', image: '/art_styles/boy_claymation.jpeg', description: 'Stop-motion clay animation aesthetic', fullDescription: 'Claymation brings the tactile, handcrafted quality of stop-motion animation to your music videos. Characters feel real and touchable with clay-like textures, perfect for whimsical, creative songs that stand out.' },
  { id: 'childrens-storybook', label: "Children's Book", icon: '📖', color: '#ffd89b', image: '/art_styles/boy_storybook.jpeg', description: 'Illustrated storybook with soft colors', fullDescription: "Children's Book style creates warm, illustrated visuals with soft colors and friendly character designs. Perfect for family-friendly music, lullabies, and songs that evoke nostalgia and comfort." },
  { id: 'photo-realism', label: 'Realistic', icon: '📷', color: '#545454', image: '/art_styles/boy_real.jpeg', description: 'Photo-realistic imagery and cinematography', fullDescription: 'Realistic style produces stunning visuals that look like actual photography or film. This style brings incredible detail and authenticity to your music videos, perfect for serious, dramatic, or emotionally powerful songs.' },
  { id: 'comic-book', label: 'Comic Book', icon: '💥', color: '#d8e8ff', image: '/art_styles/boy_comic.jpeg', description: 'Bold colors and dynamic comic panels', fullDescription: 'Comic Book style captures the excitement of graphic novels with bold colors, dynamic poses, and dramatic action. Perfect for energetic, powerful songs with superhero-like energy.' },
  { id: 'classic-blocks', label: 'Classic Blocks', icon: '🧱', color: '#ff6b6b', image: '/art_styles/boy_lego.jpeg', description: 'LEGO-inspired block aesthetic', fullDescription: 'Classic Blocks brings the playful charm of building toys to your music videos. Colorful interlocking bricks and smooth plastic surfaces create a fun, nostalgic aesthetic perfect for creative songs.' },
  { id: 'anime', label: 'Animation', icon: '✨', color: '#ffa8ac', image: '/art_styles/boy_anime.jpeg', description: 'Japanese anime-inspired art style', fullDescription: 'Animation style features expressive characters with large, emotive eyes and vibrant styling inspired by Japanese animation. Perfect for dramatic, emotional, or action-packed songs with dynamic energy.' },
  { id: 'spray-paint', label: 'Spray Paint', icon: '🎨', color: '#ff9800', image: '/art_styles/boy_spray_paint.jpeg', description: 'Street art and graffiti aesthetic', fullDescription: 'Spray Paint style brings urban energy with bold outlines and vibrant colors. Perfect for hip-hop, rap, and edgy songs that embrace street culture and artistic rebellion.' },
  { id: 'playground-crayon', label: 'Crayon', icon: '🖍️', color: '#ffeb3b', image: '/art_styles/boy_crayon.jpeg', description: 'Childlike crayon drawings', fullDescription: 'Crayon style creates playful, childlike visuals with bright colors and hand-drawn charm. Perfect for fun, lighthearted songs that embrace innocence and creativity.' },
  { id: 'wool-knit', label: 'Cozy Woolknit', icon: '🧶', color: '#f5ebd9', image: '/art_styles/boy_woolknit.jpeg', description: 'Warm knitted textile aesthetic', fullDescription: 'Cozy Woolknit style wraps your music video in warmth with textured, handcrafted aesthetics. Soft materials and cozy vibes make it perfect for gentle songs about comfort and home.' },
  { id: 'minecraft', label: 'Blockcraft', icon: '⛏️', color: '#8bc34a', image: '/art_styles/boy_lego.jpeg', description: 'Minecraft-inspired voxel world', fullDescription: 'Blockcraft style brings the iconic cube-based aesthetic of Minecraft to your music videos. Perfect for gaming-related content and songs that appeal to the gaming community.' },
  { id: 'watercolor', label: 'Watercolor', icon: '🎨', color: '#c2eabb', image: '/art_styles/boy_watercolor.jpeg', description: 'Soft flowing watercolor paintings', fullDescription: 'Watercolor style creates beautiful, artistic videos with soft brushstrokes and gentle color blending. Perfect for emotional, peaceful songs with an organic, artistic feel.' },
  { id: 'pixel', label: '2D Game', icon: '👾', color: '#d4a657', image: '/art_styles/boy_pixel.jpeg', description: 'Retro pixel art video game style', fullDescription: '2D Game style captures the nostalgia of classic video games with crisp pixel graphics and vibrant colors. Perfect for retro, gaming, or synthwave-influenced songs.' },
  { id: 'sugarpop', label: 'Sugarpop', icon: '🍭', color: '#ff6ec7', image: '/art_styles/boy_sugerpop.jpeg', description: 'Bright pop art with candy colors', fullDescription: 'Sugarpop style bursts with bright, dreamy colors and bold cartoon styling. Perfect for energetic pop songs that demand attention with maximum visual impact.' },
  { id: 'origami', label: 'Origami', icon: '🦢', color: '#90caf9', image: '/art_styles/boy_origami.jpeg', description: 'Paper folding art with geometric shapes', fullDescription: 'Origami style brings the elegance of Japanese paper folding to your music videos. Geometric shapes and crisp creases create a sophisticated, artistic aesthetic.' },
  { id: 'sketch', label: 'B&W Sketch', icon: '✏️', color: '#9e9e9e', image: '/art_styles/boy_sketch.jpeg', description: 'Black and white pencil drawings', fullDescription: 'B&W Sketch style creates artistic videos with detailed black and white pencil work. Perfect for contemplative, artistic songs that embrace minimalism and raw emotion.' },
];


const StyleDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { styleId } = useParams<{ styleId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentSong } = useAudioPlayer();

  // Handle create button click - navigate to create page or login
  const handleCreateClick = () => {
    if (user?.userId) {
      navigate('/create?tab=video');
    } else {
      navigate('/login');
    }
  };
  
  const currentStyle = useMemo(() => {
    return artStyleData.find(style => style.id === styleId);
  }, [styleId]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [styleId]);

  // If style not found, redirect to home
  if (!currentStyle) {
    navigate('/');
    return null;
  }

  // Create breadcrumb data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://gruvi.ai/' },
    { name: 'Styles', url: 'https://gruvi.ai/styles' },
    { name: currentStyle.label, url: `https://gruvi.ai/styles/${currentStyle.id}` }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 50%, #0D0D0F 100%)',
        position: 'relative',
        pb: currentSong ? { xs: 10, sm: 12, md: 14 } : 0,
        transition: 'padding-bottom 0.3s ease-out',
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
          background: `radial-gradient(ellipse at top, ${currentStyle.color}15 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SEO
        title={`${currentStyle.label} Music Videos | AI Video Generator | Gruvi`}
        description={`Create stunning ${currentStyle.label} music videos with Gruvi's AI. ${currentStyle.fullDescription}`}
        keywords={`${currentStyle.label.toLowerCase()} music video, AI ${currentStyle.label.toLowerCase()} animation, create ${currentStyle.label.toLowerCase()} video, music video generator`}
        ogTitle={`${currentStyle.label} Music Videos | Gruvi`}
        ogDescription={currentStyle.description}
        ogType="website"
        ogUrl={`https://gruvi.ai/styles/${currentStyle.id}`}
        twitterTitle={`${currentStyle.label} Music Videos | Gruvi`}
        twitterDescription={currentStyle.description}
        structuredData={[createBreadcrumbStructuredData(breadcrumbData)]}
      />

      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 4,
            color: '#A78BFA !important',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#C4B5FD !important',
            },
            '& .MuiSvgIcon-root': {
              color: '#A78BFA !important',
            }
          }}
        >
          Back
        </Button>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          {/* Style Image */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 140,
              height: 140,
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: `0 20px 60px ${currentStyle.color}25, 0 8px 24px rgba(0,0,0,0.15)`,
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={currentStyle.image}
              alt={`${currentStyle.label} style example`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              color: '#FFFFFF',
              mb: 2,
            }}
          >
            {currentStyle.label} Music Videos
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.5)',
              mb: 3,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {currentStyle.description}
          </Typography>

          {/* Full Description */}
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.7)',
              mb: 4,
              lineHeight: 1.8,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            {currentStyle.fullDescription}
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            onClick={handleCreateClick}
            endIcon={<KeyboardArrowRightIcon />}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%) !important',
              backgroundColor: 'transparent !important',
              color: '#fff !important',
              fontWeight: 600,
              borderRadius: '12px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%) !important',
                backgroundColor: 'transparent !important',
                color: '#fff !important',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(139, 92, 246, 0.5) !important',
              },
            }}
          >
            Create {currentStyle.label} Video
          </Button>
        </Box>


        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#FFFFFF',
              mb: 3,
              textAlign: 'center',
            }}
          >
            {currentStyle.label} Style Features
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {[
              { title: 'AI-Powered', desc: 'Fully automated video creation from your song' },
              { title: 'Custom Characters', desc: 'Add your own characters using reference photos' },
              { title: 'Sync to Music', desc: 'Visuals perfectly synchronized to your audio' },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 600, color: '#FFFFFF', mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Other Styles */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#FFFFFF',
              mb: 3,
            }}
          >
            Explore More Styles
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {artStyleData.filter(s => s.id !== styleId).slice(0, 8).map((style) => (
              <Box
                key={style.id}
                onClick={() => navigate(`/styles/${style.id}`)}
                sx={{
                  width: 80,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255,255,255,0.08)',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={style.image}
                  alt={`${style.label} style`}
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ p: 0.75, background: 'rgba(255,255,255,0.03)' }}>
                  <Typography sx={{ fontWeight: 500, color: '#FFFFFF', fontSize: '0.65rem', textAlign: 'center' }}>{style.label}</Typography>
                </Box>
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
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#FFFFFF', mb: 2 }}>
            Create Your {currentStyle.label} Music Video
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, fontSize: '1.1rem' }}>
            Turn any song into a stunning {currentStyle.label} cinematic video with AI.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%) !important',
              backgroundColor: 'transparent !important',
              color: '#fff !important',
              fontWeight: 600,
              borderRadius: '12px',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #8B5CF6 0%, #C084FC 100%) !important',
                backgroundColor: 'transparent !important',
                color: '#fff !important',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(139, 92, 246, 0.5) !important',
              },
            }}
          >
            {user?.userId ? 'Create Music Video' : 'Get Started Free'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default StyleDetailPage;

