import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import {
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { SEO, createBreadcrumbStructuredData, createMusicPlaylistStructuredData } from '../utils/seoHelper';
import { songsApi } from '../services/api';

// User ID for seed songs (pre-generated sample tracks)
const SEED_SONGS_USER_ID = 'b1b35a41-efb4-4f79-ad61-13151294940d';

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

// Sample tracks for each language with song IDs for playback
const languageSampleTracks: Record<string, Array<{id: string; title: string; duration: string}>> = {
  'english': [
    { id: 'ca9e75ed-551e-4f0e-b939-2130ac0fcdc3', title: 'Wide Open Sky', duration: '2:19' },
    { id: '59873808-9066-49ca-9920-b4b6f8e63cd0', title: 'Midnight in Your Eyes', duration: '2:55' },
    { id: '41a5f546-a67f-4506-a99b-3410ac190354', title: 'Rise From The Ashes', duration: '2:43' },
  ],
  'spanish': [
    { id: '1faa7d07-51ef-4bbd-841c-67d0e78a1add', title: 'Fuego en la Piel', duration: '1:38' },
    { id: '8ac40eec-8d56-4f4b-91d6-f03af139f56f', title: 'Contigo Hasta el Amanecer', duration: '2:21' },
    { id: '5628d8f9-53b1-4660-b611-e98a90d96332', title: 'Encontraré Mi Luz', duration: '2:28' },
  ],
  'french': [
    { id: 'a67bee12-fab5-45ef-aa3a-1c846c60e4d9', title: 'Sous le Ciel de Paris', duration: '2:21' },
    { id: 'bba8e5e2-7561-4fe8-b105-b4a923a582be', title: 'Lumières de Minuit', duration: '1:53' },
    { id: '917bc153-e9f1-4b90-bb05-bb3148ee3aeb', title: 'Les Cafés de Mémoire', duration: '2:00' },
  ],
  'german': [
    { id: '72b806e0-ff44-4385-ab26-c27c328fc0dc', title: 'Unbezwingbar', duration: '2:17' },
    { id: 'df4c0636-6e04-4c9d-8759-82a1b228d4bf', title: 'Neonlichter', duration: '2:25' },
    { id: '44e5a738-a89e-437d-96ec-e27ba260a837', title: 'Für Immer In Mir', duration: '2:19' },
  ],
  'italian': [
    { id: '80470df4-8d6d-4049-a208-4adf3489e4b2', title: 'Sei Tu L\'Amore Vero', duration: '3:09' },
    { id: 'bfecafb9-1a50-4fc9-b089-bdf367628543', title: 'Liberi Stanotte', duration: '2:23' },
    { id: 'b3cf3d2d-d6ca-41ea-b47a-9e6cf593461e', title: 'Fotografie Sbiadite', duration: '2:21' },
  ],
  'portuguese': [
    { id: 'aedc9a75-0796-4355-9f13-cdb3a55ea37e', title: 'Onde o Mar Me Espera', duration: '2:13' },
    { id: 'dd361956-cd80-4336-941d-3dd8429f15aa', title: 'Baile da Madrugada', duration: '1:41' },
    { id: '170379a6-d6f2-4c59-9013-17a3aa01a892', title: 'Coração de Poeira', duration: '2:33' },
  ],
  'dutch': [
    { id: '63c1e199-2faf-4f68-900f-fbcf1f86f4f2', title: 'Vrij Als De Wind', duration: '2:14' },
    { id: '35bfcf88-a893-449a-854f-d09a2ef9ea6d', title: 'Neonlicht', duration: '2:04' },
    { id: '8eba3462-4d4d-444a-bddd-d5bedc4f40e8', title: 'Terug Naar Huis', duration: '2:12' },
  ],
  'polish': [
    { id: '29ef8653-6dbf-4e39-8e61-00dd6db11998', title: 'Niezniszczalny', duration: '2:23' },
    { id: '644a84c9-6e09-4f0a-ad9f-9027f2d54b6a', title: 'Neonowe Sny', duration: '1:51' },
    { id: '33f93854-0ab4-4cd4-98bc-623e9732e1a0', title: 'Echo Tamtych Dni', duration: '2:16' },
  ],
  'romanian': [
    { id: '23cf8d43-64ef-4e25-a33d-864b23c2bd53', title: 'Foc și Gheață', duration: '2:08' },
    { id: '3ff2a6ea-8009-4887-8f7a-ca107ec2c973', title: 'Noaptea E a Noastră', duration: '2:10' },
    { id: '95e89fd5-aabb-477d-8e39-286d7c9f4660', title: 'Drum de Toamnă', duration: '2:17' },
  ],
  'czech': [
    { id: '74823a1a-2ba1-44fa-874d-870c42467b2a', title: 'Nový svítání', duration: '2:09' },
    { id: 'e81dd042-37cd-482c-8172-65dfe64a1647', title: 'Noční Praha', duration: '2:22' },
    { id: '777e2911-1880-4f51-b24d-a45384baf420', title: 'Fotografie v krabici', duration: '2:05' },
  ],
  'greek': [
    { id: '01d51540-f395-43d6-a931-b4e0cb6977f0', title: 'Καλοκαιρινός Έρωτας', duration: '2:33' },
    { id: 'f40eace2-592c-4d33-843e-417b479c2c2e', title: 'Στα Μπουζούκια Απόψε', duration: '2:22' },
    { id: '8d10647e-44bc-4ffd-a0fd-53f7bcc26c0e', title: 'Μια Ζωή Μαζί Σου', duration: '2:03' },
  ],
  'bulgarian': [
    { id: '208cce14-e3c5-4e54-9d84-125b1a4094fe', title: 'Слънце в сърцето', duration: '1:50' },
    { id: '32317da6-4fc3-4c45-b88c-b846c935b86a', title: 'Нощен Пулс', duration: '2:28' },
    { id: 'aaf702d4-d824-4cd5-aae7-db91d3e31a3e', title: 'Спомени от вчера', duration: '2:40' },
  ],
  'finnish': [
    { id: '5c97653b-5b5b-4c01-8320-076bcf230911', title: 'Revontulet', duration: '2:13' },
    { id: 'c1728aeb-80b5-49f1-a264-3585463e5ad0', title: 'Teräksen Sydän', duration: '2:55' },
    { id: '81d0442e-6ec9-447d-9e81-1778ef1155e4', title: 'Hiljaisuuden laulu', duration: '1:52' },
  ],
  'ukrainian': [
    { id: '5b65bddb-bf00-4ddd-abc3-8b650fd86cf5', title: 'Вогонь Свободи', duration: '2:00' },
    { id: 'a7106672-d7bd-4ae1-beb7-8c533cdbbb1b', title: 'Ніч Без Меж', duration: '2:06' },
    { id: 'cc121209-d13f-4708-bec7-e4a3dd72a462', title: 'Калинова Доля', duration: '2:35' },
  ],
  'russian': [
    { id: '3e05a0a9-a3a6-465b-8156-b1e8afd69588', title: 'Огни Москвы', duration: '2:38' },
    { id: 'bac05d97-c7fb-4efd-9663-078ec3efbddf', title: 'Встань и иди', duration: '2:51' },
    { id: 'c4a35f4f-0c03-4032-b36d-377da625fe1b', title: 'Снег на старых письмах', duration: '2:24' },
  ],
  'turkish': [
    { id: '05714691-b94e-474a-b7a1-7ff90fbeba2b', title: 'Sensiz Olamam', duration: '2:34' },
    { id: '1ac289a8-491c-44af-85a3-b2b00348b0dc', title: 'Gece Bizimle Yaşıyor', duration: '2:15' },
    { id: '844a8c6c-4156-4cb5-8b5a-ab36340c863e', title: 'Hassatisfaction', duration: '1:43' },
  ],
  'arabic': [
    { id: '7213cafe-3f48-4dd5-82c1-4dd1795467d3', title: 'قلبي معاك', duration: '1:57' },
    { id: 'b241a4c8-b14e-4656-a248-4d5571692d5b', title: 'ليلة بلا نهاية', duration: '2:11' },
    { id: '9e089ad7-bb1b-479d-adbe-9e6d9d654015', title: 'يا ليل الشوق', duration: '2:27' },
  ],
  'hindi': [
    { id: '98e7a1f5-d7c1-4c58-afe8-b9f4e7e3cee9', title: 'Tere Bina Adhura', duration: '2:14' },
    { id: '3ecf27cd-cb9c-47b2-bf3b-520aba01aabe', title: 'नाचो रे', duration: '2:02' },
    { id: '0193a3c7-910b-4c89-a017-4eb28d3ac3d8', title: 'तन्हाई का साया', duration: '2:33' },
  ],
  'thai': [
    { id: 'df7effc0-2628-41fd-a522-ffb64cc25a06', title: 'รักแรกพบ', duration: '2:35' },
    { id: '9bd60414-f260-4c84-9fee-6c23fcf39c14', title: 'แสงไฟในความมืด', duration: '2:08' },
    { id: '70420f27-b3d3-4d3a-90a5-e184adc8bcb4', title: 'ยังคงจำ', duration: '2:16' },
  ],
  'vietnamese': [
    { id: '771d81bd-b99f-4ebb-bae7-3ce05013f134', title: 'Lần Đầu Yêu', duration: '2:13' },
    { id: '4ec74e38-0a4a-4a9b-998f-c495925e157b', title: 'Đêm Sài Gòn', duration: '1:27' },
    { id: '31db8738-55a1-4d91-b4d7-1eccb060f9d0', title: 'Về Bến Sông Xưa', duration: '2:05' },
  ],
  'indonesian': [
    { id: '5fbc4978-ed58-405f-a505-7224b27e417c', title: 'Kisah Pertama', duration: '2:53' },
    { id: '103f2656-c926-4a96-bd7d-409906994a8a', title: 'Malam Jakarta', duration: '2:03' },
    { id: '106c776d-3c3f-4bad-baa4-8ca9452b2d7c', title: 'Rindu Yang Tak Sampai', duration: '2:38' },
  ],
  'japanese': [
    { id: '2ea32de2-7ed0-44bf-8130-d418e10926e4', title: '桜の約束', duration: '2:18' },
    { id: '05775b58-38bb-48ab-ab80-80fee8511a58', title: 'ネオン・ハートビート', duration: '2:51' },
    { id: 'cb81529e-aadd-41b3-abd2-5bcf272f56be', title: '雨の記憶', duration: '2:42' },
  ],
  'korean': [
    { id: '9488d94b-e493-4a45-9813-fbcb111185cd', title: '첫눈에 (At First Sight)', duration: '2:09' },
    { id: 'b0025c10-02b3-413c-99bd-eabcf505cbe2', title: '불을 질러 (Set It On Fire)', duration: '1:23' },
    { id: 'f15f9218-84d7-4b63-8127-1343723f34d7', title: '꿈의 빛 (Light of Dreams)', duration: '2:48' },
  ],
  'chinese': [
    { id: '074cf19a-cb08-428a-9f0b-32f1560eff70', title: '月光下的誓言', duration: '2:36' },
    { id: 'd1ef5597-173f-427e-b965-094b8fb009a1', title: '霓虹狂欢', duration: '2:24' },
    { id: 'dd8cab2d-849f-49e8-8ab6-514492b31698', title: '故乡的月光', duration: '3:14' },
  ],
};

const LanguageDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { languageId } = useParams<{ languageId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Audio player context
  const { currentSong, isPlaying, playSong, pauseSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;
  
  // State for loading songs
  const [loadingSongId, setLoadingSongId] = useState<string | null>(null);
  const [songCache, setSongCache] = useState<Record<string, any>>({});

  // Handle play button click
  const handlePlayClick = useCallback(async (track: { id: string; title: string; duration: string }) => {
    // Skip placeholder tracks
    if (track.id.startsWith('placeholder-')) {
      console.log('Song not yet generated. Generate seed songs first.');
      return;
    }
    
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

  // Get sample tracks for this language
  const sampleTracks = useMemo(() => {
    return languageSampleTracks[languageId || ''] || [];
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
        structuredData={[
          createBreadcrumbStructuredData(breadcrumbData),
          createMusicPlaylistStructuredData({
            name: `${currentLanguage.name} Music by Gruvi`,
            description: `AI-generated music in ${currentLanguage.name} created with Gruvi.`,
            url: `https://gruvi.ai/languages/${currentLanguage.id}`,
            tracks: sampleTracks.map(track => ({
              name: track.title,
              duration: `PT${track.duration.replace(':', 'M')}S`,
            })),
          }),
        ]}
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

        {/* Sample Tracks Section */}
        {sampleTracks.length > 0 && (
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
              Example {currentLanguage.name} Tracks
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

                  {/* Language Image as Cover */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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

                  {/* Track Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                      {track.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                      {currentLanguage.name} • {track.duration}
                    </Typography>
                  </Box>

                  {/* Play Button */}
                  <IconButton
                    size="small"
                    onClick={() => handlePlayClick(track)}
                    disabled={loadingSongId === track.id || track.id.startsWith('placeholder-')}
                    sx={{
                      background: currentSong?.songId === track.id ? '#007AFF' : '#fff',
                      color: currentSong?.songId === track.id ? '#fff' : track.id.startsWith('placeholder-') ? '#ccc' : '#007AFF',
                      width: 40,
                      height: 40,
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: currentSong?.songId === track.id ? '#0066CC' : '#fff',
                        transform: track.id.startsWith('placeholder-') ? 'none' : 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      },
                      '&:disabled': {
                        background: '#f5f5f5',
                        color: '#ccc',
                      },
                    }}
                  >
                    {loadingSongId === track.id ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : currentSong?.songId === track.id && isPlaying ? (
                      <PauseRoundedIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </Box>
              ))}
            </Box>
            
          </Box>
        )}

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

