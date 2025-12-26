import React, { useMemo, useEffect } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
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

// Language data with detailed information - using image icons
export const languageData = [
  { id: 'english', name: 'English', image: '/locales/en.jpeg', code: 'en', description: 'Create music in English', fullDescription: 'English is the most widely used language in global music. Create songs with native-quality English lyrics and vocals. Perfect for international audiences, pop, rock, hip-hop, and all mainstream genres. Our AI understands English idioms, slang, and poetic expressions.' },
  { id: 'spanish', name: 'Spanish', image: '/locales/es.jpeg', code: 'es', description: 'Create music in Spanish', fullDescription: 'Spanish is the second most spoken native language worldwide. Create authentic Latin music, reggaeton, flamenco, and Spanish pop. Our AI captures the passion and rhythm of Spanish-language music with proper pronunciation and cultural nuance.' },
  { id: 'french', name: 'French', image: '/locales/fr.jpeg', code: 'fr', description: 'Create music in French', fullDescription: 'French brings elegance and romance to music. Create chanson française, French pop, or international hits with French lyrics. Our AI delivers authentic French pronunciation with the sophisticated charm the language is known for.' },
  { id: 'german', name: 'German', image: '/locales/de.jpeg', code: 'de', description: 'Create music in German', fullDescription: 'German offers powerful expression for music. Create Schlager, German rap, rock, or electronic music with German lyrics. Perfect for the Central European market with authentic pronunciation and cultural relevance.' },
  { id: 'italian', name: 'Italian', image: '/locales/it.jpeg', code: 'it', description: 'Create music in Italian', fullDescription: 'Italian is the language of opera and beautiful melodies. Create Italian pop, love songs, or classical pieces with authentic Italian vocals. Our AI captures the musicality inherent in the Italian language.' },
  { id: 'portuguese', name: 'Portuguese', image: '/locales/pt.jpeg', code: 'pt', description: 'Create music in Portuguese', fullDescription: 'Portuguese brings the rhythm of Brazil and Portugal to your music. Create bossa nova, Brazilian funk, sertanejo, or Portuguese fado. Our AI delivers both Brazilian and European Portuguese styles.' },
  { id: 'dutch', name: 'Dutch', image: '/locales/nl.jpeg', code: 'nl', description: 'Create music in Dutch', fullDescription: 'Dutch music has a unique character in European pop. Create Dutch-language songs with authentic pronunciation for the Netherlands and Belgium market.' },
  { id: 'polish', name: 'Polish', image: '/locales/pl.jpeg', code: 'pl', description: 'Create music in Polish', fullDescription: 'Polish offers rich expression for music. Create Polish pop, disco polo, or contemporary tracks with authentic Polish vocals for the Polish market.' },
  { id: 'romanian', name: 'Romanian', image: '/locales/ro.jpeg', code: 'ro', description: 'Create music in Romanian', fullDescription: 'Romanian combines Latin roots with Eastern European flavor. Create Romanian pop, manele, or contemporary tracks with authentic vocals.' },
  { id: 'czech', name: 'Czech', image: '/locales/cs.jpeg', code: 'cs', description: 'Create music in Czech', fullDescription: 'Czech brings Central European charm to music. Create Czech-language songs with proper pronunciation for the Czech market.' },
  { id: 'greek', name: 'Greek', image: '/locales/el.jpeg', code: 'el', description: 'Create music in Greek', fullDescription: 'Greek has ancient musical heritage. Create Greek pop, laika, or modern tracks with authentic Greek pronunciation and Mediterranean feel.' },
  { id: 'bulgarian', name: 'Bulgarian', image: '/locales/bg.jpeg', code: 'bg', description: 'Create music in Bulgarian', fullDescription: 'Bulgarian offers unique musical traditions and vocal styles. Create Bulgarian pop or traditional music with authentic pronunciation.' },
  { id: 'finnish', name: 'Finnish', image: '/locales/fi.jpeg', code: 'fi', description: 'Create music in Finnish', fullDescription: 'Finnish offers unique sonic qualities for music. Create Finnish pop, metal, or contemporary tracks with authentic Nordic vocals.' },
  { id: 'ukrainian', name: 'Ukrainian', image: '/locales/uk.jpeg', code: 'uk', description: 'Create music in Ukrainian', fullDescription: 'Ukrainian music has beautiful melodic traditions. Create Ukrainian pop, folk-influenced tracks, or modern songs with authentic Ukrainian vocals.' },
  { id: 'russian', name: 'Russian', image: '/locales/ru.jpeg', code: 'ru', description: 'Create music in Russian', fullDescription: 'Russian is spoken across Eastern Europe and Central Asia. Create Russian pop, rap, or traditional music with authentic Cyrillic lyrics and native pronunciation.' },
  { id: 'turkish', name: 'Turkish', image: '/locales/tr.jpeg', code: 'tr', description: 'Create music in Turkish', fullDescription: 'Turkish bridges East and West in music. Create Turkish pop, arabesque, or modern tracks with authentic Turkish vocals and cultural nuance.' },
  { id: 'arabic', name: 'Arabic', image: '/locales/ar.jpeg', code: 'ar', description: 'Create music in Arabic', fullDescription: 'Arabic is rich with musical tradition. Create Arabic pop, khaleeji, Egyptian, or Levantine style music with authentic Arabic vocals and pronunciation.' },
  { id: 'hindi', name: 'Hindi', image: '/locales/hi.jpeg', code: 'hi', description: 'Create music in Hindi', fullDescription: 'Hindi dominates Bollywood and Indian pop music. Create Hindi songs, Bollywood-style tracks, or contemporary Indian music with authentic Hindi vocals.' },
  { id: 'thai', name: 'Thai', image: '/locales/th.jpeg', code: 'th', description: 'Create music in Thai', fullDescription: 'Thai music has distinctive character. Create Thai pop, luk thung, or modern tracks with authentic Thai vocals and tonal accuracy.' },
  { id: 'vietnamese', name: 'Vietnamese', image: '/locales/vi.jpeg', code: 'vi', description: 'Create music in Vietnamese', fullDescription: 'Vietnamese offers melodic tonal qualities. Create V-Pop or Vietnamese traditional-influenced music with authentic pronunciation.' },
  { id: 'indonesian', name: 'Indonesian', image: '/locales/id.jpeg', code: 'id', description: 'Create music in Indonesian', fullDescription: 'Indonesian unites Southeast Asia\'s largest nation. Create Indonesian pop, dangdut, or contemporary tracks with authentic Indonesian vocals.' },
  { id: 'japanese', name: 'Japanese', image: '/locales/js.jpeg', code: 'ja', description: 'Create music in Japanese', fullDescription: 'Japanese is essential for J-Pop and anime music. Create Japanese songs with authentic pronunciation, perfect for J-Pop, rock, or anime openings.' },
  { id: 'korean', name: 'Korean', image: '/locales/ko.jpeg', code: 'ko', description: 'Create music in Korean', fullDescription: 'Korean powers the global K-Pop phenomenon. Create K-Pop style tracks with authentic Korean pronunciation, perfect for the polished K-Pop sound.' },
  { id: 'chinese', name: 'Chinese', image: '/locales/zh.jpeg', code: 'zh', description: 'Create music in Chinese', fullDescription: 'Chinese (Mandarin) opens the world\'s largest music market. Create C-Pop, Chinese ballads, or contemporary tracks with authentic tonal pronunciation.' },
];

const LanguageDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { languageId } = useParams<{ languageId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Check if audio player is active to add bottom padding
  const { currentSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;

  // Handle create button click - navigate to create page or login
  const handleCreateClick = () => {
    if (user?.userId) {
      navigate('/create?tab=song');
    } else {
      navigate('/login');
    }
  };

  // Find the current language data
  const currentLanguage = useMemo(() => {
    return languageData.find(lang => lang.id === languageId);
  }, [languageId]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [languageId]);

  // If language not found, redirect to home
  if (!currentLanguage) {
    navigate('/');
    return null;
  }

  // Create breadcrumb data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://gruvi.ai/' },
    { name: 'Languages', url: 'https://gruvi.ai/languages' },
    { name: currentLanguage.name, url: `https://gruvi.ai/languages/${currentLanguage.id}` }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fff',
        position: 'relative',
        // Add bottom padding when audio player is visible
        pb: hasActivePlayer ? 12 : 0,
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
          background: 'radial-gradient(ellipse at top, rgba(0, 122, 255, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SEO
        title={`Create Music in ${currentLanguage.name} with AI | Gruvi`}
        description={`Generate original ${currentLanguage.name} music with Gruvi's AI music generator. ${currentLanguage.fullDescription}`}
        keywords={`${currentLanguage.name.toLowerCase()} music, AI ${currentLanguage.name.toLowerCase()} songs, create music in ${currentLanguage.name.toLowerCase()}, ${currentLanguage.name.toLowerCase()} lyrics generator`}
        ogTitle={`Create Music in ${currentLanguage.name} with AI | Gruvi`}
        ogDescription={currentLanguage.description}
        ogType="website"
        ogUrl={`https://gruvi.ai/languages/${currentLanguage.id}`}
        twitterTitle={`Create Music in ${currentLanguage.name} | Gruvi`}
        twitterDescription={currentLanguage.description}
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
          {/* Language Image */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 140,
              height: 140,
              borderRadius: '32px',
              overflow: 'hidden',
              border: '3px solid rgba(0,122,255,0.3)',
              boxShadow: '0 20px 60px rgba(0,122,255,0.15), 0 8px 24px rgba(0,0,0,0.1)',
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={currentLanguage.image}
              alt={currentLanguage.name}
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
              color: '#1D1D1F',
              mb: 2,
            }}
          >
            Create Music in {currentLanguage.name}
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
            {currentLanguage.description}
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
            {currentLanguage.fullDescription}
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            onClick={handleCreateClick}
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
            Create {currentLanguage.name} Music
          </Button>
        </Box>

        {/* Features Section */}
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
            {currentLanguage.name} Music Features
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {[
              { title: 'Native Pronunciation', desc: 'AI-generated vocals with authentic pronunciation and accent' },
              { title: 'Cultural Nuance', desc: 'Lyrics that capture the cultural context and idioms' },
              { title: 'Multiple Genres', desc: `Create any genre of music in ${currentLanguage.name}` },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography sx={{ color: '#86868B', fontSize: '0.95rem' }}>
                  {feature.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Other Languages */}
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
            Explore More Languages
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
            {languageData.filter(l => l.id !== languageId).slice(0, 12).map((lang) => (
              <Box
                key={lang.id}
                onClick={() => navigate(`/languages/${lang.id}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={lang.image}
                  alt={lang.name}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <Typography sx={{ fontWeight: 500, color: '#1D1D1F' }}>{lang.name}</Typography>
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
            Ready to Create in {currentLanguage.name}?
          </Typography>
          <Typography sx={{ color: '#86868B', mb: 3, fontSize: '1.1rem' }}>
            Sign up for Gruvi and start generating {currentLanguage.name} music with AI.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateClick}
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
            {user?.userId ? 'Create Music' : 'Get Started Free'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LanguageDetailPage;

