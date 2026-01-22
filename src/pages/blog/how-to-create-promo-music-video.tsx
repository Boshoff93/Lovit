import React, { useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader, CTASection } from '../../components/marketing';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

// Simple line divider like other pages
const SectionDivider: React.FC = () => (
  <Box sx={{ my: 6 }}>
    <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)' }} />
  </Box>
);

// Feature List Item
const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

// Tip Box Component
const TipBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{
    my: 4,
    p: 3,
    borderRadius: '16px',
    background: 'rgba(78, 205, 196, 0.08)',
    border: '1px solid rgba(78, 205, 196, 0.2)',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <TipsAndUpdatesIcon sx={{ color: '#4ECDC4', fontSize: 20, mt: '5px' }} />
      <Typography sx={{ color: '#4ECDC4', fontWeight: 600, fontSize: '1.1rem' }}>{title}</Typography>
    </Box>
    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.5 }}>
      {children}
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
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #12121a 15%, #0a0a0c 30%, #0a0a0c 50%, #12121a 75%, #15151f 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(78, 205, 196, 0.15) 0%, transparent 40%), radial-gradient(ellipse 60% 30% at 70% 10%, rgba(139, 92, 246, 0.1) 0%, transparent 40%)',
        pointerEvents: 'none',
        zIndex: 0,
      },
    }}>
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
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blog')}
            sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, '&:hover': { color: '#fff', background: 'transparent' } }}
          >
            Back to Blog
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip label="Tutorial" size="small" sx={{ background: 'rgba(78, 205, 196, 0.15)', color: '#4ECDC4', fontWeight: 600 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: '0.85rem' }}>6 min read</Typography>
            </Box>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#fff',
              mb: 3,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            How to Create a{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Promo Music Video
            </Box>{' '}
            with AI
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontStyle: 'italic' }}>
            The complete guide to creating stunning promotional videos for your brand
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>By Gruvi Team</Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>January 2026</Typography>
          </Box>
        </Container>
      </Box>

      {/* Article Content */}
      <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            '& p': { color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 },
            '& h2': { color: '#fff', fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mt: 0, mb: 3 },
            '& h3': { color: '#fff', fontSize: { xs: '1.25rem', md: '1.4rem' }, fontWeight: 600, mt: 4, mb: 2 },
          }}>

            {/* Intro */}
            <Typography component="p">
              Traditional promotional video production costs thousands of dollars and takes weeks to complete. You need a videographer, editor, music licensing, and often a full creative team. AI changes everything.
            </Typography>

            <Typography component="p">
              With Gruvi, you can create professional-quality promotional videos in minutes. The AI generates original, royalty-free music that perfectly matches your brand, then creates stunning visuals synchronized to every beat.
            </Typography>

            <SectionDivider />

            {/* What You Can Create */}
            <Typography component="h2">What You Can Create</Typography>

            <Typography component="p">
              Gruvi is perfect for creating a wide range of promotional content:
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FeatureItem><strong>Product Launch Videos</strong> – Showcase new products with cinematic visuals and energetic music</FeatureItem>
              <FeatureItem><strong>Brand Awareness Content</strong> – Build recognition with consistent, professional videos</FeatureItem>
              <FeatureItem><strong>Social Media Ads</strong> – Create scroll-stopping content for TikTok, Instagram, and YouTube</FeatureItem>
              <FeatureItem><strong>Real Estate Tours</strong> – Property videos with atmospheric music and beautiful imagery</FeatureItem>
              <FeatureItem><strong>Event Promotions</strong> – Generate excitement with dynamic, engaging videos</FeatureItem>
              <FeatureItem><strong>App & SaaS Demos</strong> – Explain your product with compelling visuals</FeatureItem>
            </Box>

            <SectionDivider />

            {/* Step by Step */}
            <Typography component="h2">Step-by-Step: Creating Your First Promo Video</Typography>

            <Typography component="h3">Step 1: Define Your Video Prompt</Typography>
            <Typography component="p">
              Start by describing what you want. The more specific, the better. Include what you're promoting, the mood you want (energetic, calm, professional), your target audience, and key visuals you'd like to see.
            </Typography>

            <TipBox title="Example Prompt">
              "Create an energetic promo video for a new fitness app. Show dynamic workout scenes, modern cityscapes, and motivated people achieving their goals. The music should be upbeat electronic with a driving beat. Target audience: young professionals aged 25-35."
            </TipBox>

            <Typography component="h3">Step 2: Choose Your Music Style</Typography>
            <Typography component="p">
              Gruvi offers multiple music generation options to match your needs:
            </Typography>

            <TableContainer component={Paper} sx={{ my: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
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
              Choose the aspect ratio based on where you'll publish your content:
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FeatureItem><strong>9:16 Portrait</strong> – TikTok, Instagram Reels, YouTube Shorts</FeatureItem>
              <FeatureItem><strong>16:9 Landscape</strong> – YouTube, LinkedIn, websites</FeatureItem>
            </Box>

            <Typography component="h3">Step 4: Generate and Review</Typography>
            <Typography component="p">
              Click "Generate" and watch the AI create your video. The process typically takes 2-5 minutes. Once complete, you can preview the full video, regenerate specific scenes if needed, add text overlays and CTAs, and download in HD quality.
            </Typography>

            <SectionDivider />

            {/* Pro Tips */}
            <Typography component="h2">Pro Tips for Better Promo Videos</Typography>

            <Box sx={{ mb: 3 }}>
              <FeatureItem><strong>Keep it Short:</strong> Under 30 seconds for social media performs best</FeatureItem>
              <FeatureItem><strong>Hook Early:</strong> Capture attention in the first 3 seconds</FeatureItem>
              <FeatureItem><strong>Match Music to Brand:</strong> Energetic for fitness, calm for wellness, professional for B2B</FeatureItem>
              <FeatureItem><strong>Include a CTA:</strong> Always tell viewers what to do next</FeatureItem>
              <FeatureItem><strong>Batch Create:</strong> Generate multiple variations to test what works</FeatureItem>
            </Box>

            <TipBox title="Why Original Music Matters">
              Using AI-generated music means you own full commercial rights. No licensing fees, no copyright strikes, and unique audio that sets your brand apart from competitors using the same stock tracks.
            </TipBox>

            <SectionDivider />

            {/* Results */}
            <Typography component="h2">Real Results: What Creators Are Achieving</Typography>

            <Typography component="p">
              Businesses using AI-generated promo videos are seeing significant improvements:
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FeatureItem><strong>80% reduction</strong> in video production costs</FeatureItem>
              <FeatureItem><strong>10x faster</strong> content creation</FeatureItem>
              <FeatureItem><strong>Higher engagement</strong> with original, royalty-free music</FeatureItem>
              <FeatureItem><strong>More testing</strong> – create multiple versions to find what works</FeatureItem>
            </Box>

            <SectionDivider />

            {/* CTA Box */}
            <Box
              sx={{
                mt: 6,
                p: 4,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15) 0%, rgba(68, 160, 141, 0.15) 100%)',
                border: '1px solid rgba(78, 205, 196, 0.3)',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Ready to Create?
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Start making AI promo videos in minutes. No video editing experience required.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => isLoggedIn ? navigate('/create-video') : handleOpenAuth()}
                sx={{
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { background: 'linear-gradient(135deg, #5DE0D7 0%, #4FB89F 100%)' },
                }}
              >
                Create Your Promo Video
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bottom CTA section */}
      <Box sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        zIndex: 1,
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: '#fff', mb: 2 }}>
            Ready to Create Your Promo Video?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, fontSize: '1.1rem', maxWidth: 500, mx: 'auto' }}>
            Turn your ideas into stunning promotional content in minutes
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => isLoggedIn ? navigate('/create-video') : handleOpenAuth()}
            sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              px: 5,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: '0 4px 20px rgba(78, 205, 196, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5DE0D7 0%, #4FB89F 100%)',
                boxShadow: '0 6px 24px rgba(78, 205, 196, 0.5)',
              },
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HowToCreatePromoMusicVideo;
