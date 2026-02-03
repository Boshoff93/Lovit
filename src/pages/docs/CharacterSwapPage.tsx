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

const CharacterSwapPage: React.FC = () => {
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
        title="Character Swap | Gruvi Documentation"
        description="Replace characters in videos using AI. Swap faces, change environments, or use custom prompts to transform your content."
        keywords="character swap, AI face swap, video editing, Kling AI, character replacement"
        ogTitle="Character Swap | Gruvi"
        ogDescription="Replace characters in videos using AI-powered character swap"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/character-swap"
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
            Character{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Swap
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Replace characters in videos using AI-powered transformation
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
              Character Swap uses Kling AI to replace people or characters in your videos. You can swap faces, change environments, or use custom prompts to completely transform who appears in your content.
            </Typography>

            <SectionDivider />

            <Typography component="h2">How It Works</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>Upload a video</strong> - Start with any video that contains a person or character you want to replace.</FeatureItem>
              <FeatureItem><strong>Choose a replacement</strong> - Select an AI Asset character, upload a reference image, or describe the replacement with a prompt.</FeatureItem>
              <FeatureItem><strong>AI transforms the video</strong> - Kling AI processes the swap, maintaining natural motion and expressions.</FeatureItem>
            </Box>

            <SectionDivider />

            <Typography component="h2">Swap Modes</Typography>

            <Typography component="p">
              <strong>Face Swap</strong> - Replace just the face of a character while keeping the body, clothing, and movements intact. Great for putting your AI character into existing footage.
            </Typography>

            <Typography component="p">
              <strong>Full Character Swap</strong> - Replace the entire character appearance. The AI adapts the new character to match the original movements and scene.
            </Typography>

            <Typography component="p">
              <strong>Prompt-Based Swap</strong> - Describe the transformation you want in natural language. The AI interprets your prompt and applies the changes.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Using AI Assets</Typography>

            <Typography component="p">
              Create reusable characters in <strong>AI Assets</strong> and use them for consistent character swaps across multiple videos. This is ideal for building a recognizable brand character or spokesperson.
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
                { name: 'Character Swap', cost: '50 tokens / second' },
              ].map((item) => (
                <Box key={item.name} sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 1,
                }}>
                  <Typography component="span" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{item.name}</Typography>
                  <Typography component="span" sx={{ color: '#4ECDC4', fontWeight: 600, fontSize: '0.95rem' }}>{item.cost}</Typography>
                </Box>
              ))}
            </Box>

            <SectionDivider />

            <Typography component="h2">Tips</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem>Use well-lit source videos for the best swap quality.</FeatureItem>
              <FeatureItem>Create dedicated <strong>AI Assets</strong> for characters you'll reuse often.</FeatureItem>
              <FeatureItem>Shorter videos process faster and use fewer tokens.</FeatureItem>
            </Box>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Try Character Swap
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Transform your videos with AI-powered character replacement.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/motion-capture')}
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
                Open Swap Studio
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default CharacterSwapPage;
