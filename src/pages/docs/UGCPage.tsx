import React, { useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader } from '../../components/marketing';

const SectionDivider: React.FC = () => (
  <Box sx={{ my: 6 }}>
    <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)' }} />
  </Box>
);

const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

const UGCPage: React.FC = () => {
  const navigate = useNavigate();
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
        title="UGC Creator | Gruvi Documentation"
        description="Create authentic user-generated content style videos with AI avatars and voiceovers."
        keywords="UGC creator, AI avatar video, user generated content, AI video creation, voice change"
        ogTitle="UGC Creator | Gruvi"
        ogDescription="Create authentic UGC-style videos with AI avatars and voice change"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/ugc"
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* Hero Section */}
      <Box sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 1, md: 2 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            color="inherit"
            onClick={() => navigate('/docs')}
            sx={{ color: '#fff', mb: 2, '&:hover': { background: 'rgba(255,255,255,0.08)' } }}
          >
            Back to Docs
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Chip label="Feature" size="small" sx={{ background: 'rgba(78, 205, 196, 0.15)', color: '#4ECDC4', fontWeight: 600 }} />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#fff',
              mb: 1.5,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            UGC{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Creator
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Authentic user-generated content with AI avatars and voice change
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Box sx={{ py: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            '& p': { color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 },
            '& h2': { color: '#fff', fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mt: 0, mb: 3 },
          }}>

            <Typography component="p">
              The UGC Creator lets you generate authentic-looking user-generated content videos using AI avatars. Perfect for product promotions, testimonials, and social media content that feels natural and relatable.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Creation Modes</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>AI Avatar</strong> - Select a voiceover and an AI avatar generates a realistic talking-head video, enhanced with AI for natural expressions and lip sync.</FeatureItem>
              <FeatureItem><strong>Custom Characters</strong> - Use your own AI assets as the avatar, or let Gruvi generate one automatically.</FeatureItem>
              <FeatureItem><strong>Background Music</strong> - Optionally add soft instrumental background music behind the voiceover.</FeatureItem>
            </Box>

            <SectionDivider />

            <Typography component="h2">AI Avatars</Typography>

            <Typography component="p">
              Choose from a library of AI avatars or create your own custom characters using the <strong>AI Assets</strong> feature. Avatars can speak your script with natural lip-sync and expressions.
            </Typography>

            <Typography component="p">
              You can also apply <strong>voice change</strong> to swap the avatar's voice with any of 25+ AI voices, giving your content the perfect tone and personality.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Voice Change</Typography>

            <Typography component="p">
              Optionally swap the AI-generated voice with a different voice from Gruvi's voice library. Choose from professional narrators, social media-style voices, and more. The voice swap happens automatically after video generation.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Token Costs</Typography>

            <Box sx={{
              my: 3,
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}>
              {[
                { name: 'UGC Video', cost: '100 tokens' },
                { name: 'Background Music (optional)', cost: '50 tokens / 30s' },
              ].map((item, i) => (
                <Box key={item.name} sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 1,
                  borderBottom: i < 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <Typography component="span" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{item.name}</Typography>
                  <Typography component="span" sx={{ color: '#4ECDC4', fontWeight: 600, fontSize: '0.95rem' }}>{item.cost}</Typography>
                </Box>
              ))}
            </Box>

            <SectionDivider />

            <Typography component="h2">Tips</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem>Keep scripts short and conversational for the most authentic UGC feel.</FeatureItem>
              <FeatureItem>Use <strong>AI Assets</strong> to create custom characters that match your brand.</FeatureItem>
              <FeatureItem>Combine with <strong>Social Publishing</strong> to schedule UGC content across platforms.</FeatureItem>
            </Box>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Create UGC Content
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Start creating authentic UGC videos with AI avatars.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/create/video')}
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
                Try UGC Creator
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default UGCPage;
