import React, { useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader, CTASection } from '../../components/marketing';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

// Placeholder Image Component
const PlaceholderImage: React.FC<{ id: string; description: string; aspectRatio?: string }> = ({
  id,
  description,
  aspectRatio = '16/9'
}) => (
  <Box
    sx={{
      width: '100%',
      aspectRatio,
      background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
      borderRadius: '16px',
      border: '2px dashed rgba(78, 205, 196, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      my: 4,
      p: 3,
    }}
  >
    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textAlign: 'center' }}>
      [{id}]
    </Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mt: 1, textAlign: 'center' }}>
      {description}
    </Typography>
  </Box>
);

const HowToCreatePromoMusicVideo: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;

  const [authOpen, setAuthOpen] = useState(false);
  const handleOpenAuth = useCallback(() => setAuthOpen(true), []);

  return (
    <Box sx={{ minHeight: '100vh', background: '#0D0D0F' }}>
      <SEO
        title="How to Create a Promo Music Video with AI in Minutes | Gruvi Blog"
        description="Step-by-step guide to creating stunning promotional music videos for your brand, product, or business using AI-generated music and visuals. No editing experience required."
        keywords="promo video, music video maker, AI video generator, promotional video, product video, brand video, AI music, video marketing"
        ogTitle="How to Create a Promo Music Video with AI in Minutes"
        ogDescription="Create stunning promotional videos with AI-generated music and visuals. No experience required."
        ogType="article"
        ogUrl="https://gruvimusic.com/blog/how-to-create-promo-music-video"
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 20 },
          pb: { xs: 6, md: 10 },
          background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orbs */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '40%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(78, 205, 196, 0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '0%',
          right: '10%',
          width: '35%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Back button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blog')}
            sx={{
              color: 'rgba(255,255,255,0.7)',
              mb: 4,
              '&:hover': { color: '#fff', background: 'transparent' },
            }}
          >
            Back to Blog
          </Button>

          {/* Category & Meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip
              label="Tutorial"
              size="small"
              sx={{
                background: 'rgba(78, 205, 196, 0.15)',
                color: '#4ECDC4',
                fontWeight: 600,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">6 min read</Typography>
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
              mb: 3,
            }}
          >
            How to Create a Promo Music Video with AI in Minutes
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            The complete guide to creating stunning promotional videos for your brand, product,
            or business using AI-generated music and visuals. No video editing experience required.
          </Typography>

          {/* Author & Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: 700 }}>G</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 600 }}>Gruvi Team</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                January 15, 2026
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Article Content */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{
          '& h2': {
            fontSize: { xs: '1.5rem', md: '1.75rem' },
            fontWeight: 700,
            color: '#fff',
            mt: 6,
            mb: 3,
          },
          '& h3': {
            fontSize: { xs: '1.25rem', md: '1.4rem' },
            fontWeight: 600,
            color: '#fff',
            mt: 4,
            mb: 2,
          },
          '& p': {
            fontSize: '1.05rem',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.8,
            mb: 3,
          },
          '& ul, & ol': {
            color: 'rgba(255,255,255,0.8)',
            pl: 3,
            mb: 3,
            '& li': {
              mb: 1.5,
              lineHeight: 1.7,
            },
          },
        }}>
          <PlaceholderImage
            id="HERO_IMAGE"
            description="Promo video showcase - split screen showing AI music + visuals"
          />

          <Typography component="h2">Why AI Promo Videos Are Game-Changing</Typography>

          <Typography component="p">
            Traditional promotional video production costs thousands of dollars and takes weeks to complete.
            You need a videographer, editor, music licensing, and often a full creative team. AI changes everything.
          </Typography>

          <Typography component="p">
            With Gruvi, you can create professional-quality promotional videos in minutes. The AI generates
            original, royalty-free music that perfectly matches your brand, then creates stunning visuals
            synchronized to every beat.
          </Typography>

          <Typography component="h2">What You Can Create</Typography>

          <Typography component="p">
            Gruvi is perfect for creating:
          </Typography>

          <ul>
            <li><strong>Product Launch Videos</strong> - Showcase new products with cinematic visuals and energetic music</li>
            <li><strong>Brand Awareness Content</strong> - Build recognition with consistent, professional videos</li>
            <li><strong>Social Media Ads</strong> - Create scroll-stopping content for TikTok, Instagram, and YouTube</li>
            <li><strong>Real Estate Tours</strong> - Property videos with atmospheric music and beautiful imagery</li>
            <li><strong>Event Promotions</strong> - Generate excitement with dynamic, engaging videos</li>
            <li><strong>App & SaaS Demos</strong> - Explain your product with compelling visuals</li>
          </ul>

          <PlaceholderImage
            id="USE_CASES"
            description="Grid showing different promo video types: product, brand, real estate, event"
          />

          <Typography component="h2">Step-by-Step: Creating Your First Promo Video</Typography>

          <Typography component="h3">Step 1: Define Your Video Prompt</Typography>

          <Typography component="p">
            Start by describing what you want. The more specific, the better. Include:
          </Typography>

          <ul>
            <li>What you're promoting (product, service, event)</li>
            <li>The mood you want (energetic, calm, professional, fun)</li>
            <li>Your target audience (young professionals, families, tech enthusiasts)</li>
            <li>Key visuals you'd like to see</li>
          </ul>

          <Box sx={{
            background: 'rgba(78, 205, 196, 0.1)',
            border: '1px solid rgba(78, 205, 196, 0.3)',
            borderRadius: '12px',
            p: 3,
            my: 4,
          }}>
            <Typography sx={{ color: '#4ECDC4', fontWeight: 600, mb: 2 }}>
              Example Prompt:
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
              "Create an energetic promo video for a new fitness app. Show dynamic workout scenes,
              modern cityscapes, and motivated people achieving their goals. The music should be
              upbeat electronic with a driving beat. Target audience: young professionals aged 25-35."
            </Typography>
          </Box>

          <Typography component="h3">Step 2: Choose Your Music Style</Typography>

          <Typography component="p">
            Gruvi offers multiple music generation options:
          </Typography>

          <TableContainer component={Paper} sx={{ my: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Music Type</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Best For</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Standard Track</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Quick social content</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>15-60 seconds</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Premium Track</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Professional campaigns</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>30 seconds - 3 minutes</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Upload Your Own</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Brand-specific audio</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Any length</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography component="h3">Step 3: Select Visual Style</Typography>

          <Typography component="p">
            Choose the aspect ratio based on where you'll publish:
          </Typography>

          <ul>
            <li><strong>9:16 Portrait</strong> - TikTok, Instagram Reels, YouTube Shorts</li>
            <li><strong>16:9 Landscape</strong> - YouTube, LinkedIn, websites</li>
          </ul>

          <PlaceholderImage
            id="ASPECT_RATIOS"
            description="Side-by-side comparison of portrait vs landscape video formats"
          />

          <Typography component="h3">Step 4: Generate and Review</Typography>

          <Typography component="p">
            Click "Generate" and watch the AI create your video. The process typically takes 2-5 minutes.
            Once complete, you can:
          </Typography>

          <ul>
            <li>Preview the full video</li>
            <li>Regenerate specific scenes if needed</li>
            <li>Add text overlays and CTAs</li>
            <li>Download in HD quality</li>
          </ul>

          <Typography component="h2">Pro Tips for Better Promo Videos</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 4 }}>
            {[
              { num: '1', title: 'Keep it Short', desc: 'Under 30 seconds for social media performs best' },
              { num: '2', title: 'Hook Early', desc: 'Capture attention in the first 3 seconds' },
              { num: '3', title: 'Match Music to Brand', desc: 'Energetic for fitness, calm for wellness, professional for B2B' },
              { num: '4', title: 'Include a CTA', desc: 'Always tell viewers what to do next' },
              { num: '5', title: 'Batch Create', desc: 'Generate multiple variations to test what works' },
            ].map((tip) => (
              <Box key={tip.num} sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                p: 2,
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <Box sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#fff',
                }}>
                  {tip.num}
                </Box>
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>{tip.title}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{tip.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Typography component="h2">Real Results: What Creators Are Achieving</Typography>

          <Typography component="p">
            Businesses using AI-generated promo videos report:
          </Typography>

          <ul>
            <li><strong>80% reduction</strong> in video production costs</li>
            <li><strong>10x faster</strong> content creation</li>
            <li><strong>Higher engagement</strong> with original, royalty-free music</li>
            <li><strong>More testing</strong> - create multiple versions to find what works</li>
          </ul>

          <PlaceholderImage
            id="RESULTS"
            description="Stats infographic showing cost savings and speed improvements"
          />

          <Typography component="h2">Get Started Today</Typography>

          <Typography component="p">
            Ready to create your first AI promo video? Gruvi makes it simple. Just describe what you want,
            and let the AI handle the music, visuals, and editing.
          </Typography>

          <Typography component="p">
            No subscriptions required to start. Create your first video free and see the results for yourself.
          </Typography>
        </Box>

        {/* CTA Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => isLoggedIn ? navigate('/create-video') : handleOpenAuth()}
            sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              color: '#fff',
              fontWeight: 600,
              px: 5,
              py: 2,
              fontSize: '1.1rem',
              borderRadius: '12px',
              textTransform: 'none',
              boxShadow: '0 4px 20px rgba(78, 205, 196, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5DE0D7 0%, #4FB89F 100%)',
                boxShadow: '0 6px 24px rgba(78, 205, 196, 0.5)',
              },
            }}
          >
            Create Your Promo Video
          </Button>
        </Box>
      </Container>

      {/* CTA Section */}
      <CTASection
        title="Ready to Create Your Promo Video?"
        subtitle="Turn your music into stunning promotional content in minutes"
        primaryButtonText="Get Started Free"
        primaryButtonAction={() => isLoggedIn ? navigate('/create-video') : handleOpenAuth()}
      />
    </Box>
  );
};

export default HowToCreatePromoMusicVideo;
