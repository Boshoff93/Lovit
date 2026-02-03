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

const AssetsPage: React.FC = () => {
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
        title="AI Assets | Gruvi Documentation"
        description="Create reusable AI assets: human characters, products, places, apps, and non-human characters for your content."
        keywords="AI assets, AI characters, reusable content, product shots, brand characters"
        ogTitle="AI Assets | Gruvi"
        ogDescription="Create reusable AI characters and assets for your content"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/assets"
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
            AI{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Assets
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Reusable characters, products, and places for your content
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
              AI Assets let you create reusable elements for your content. Build a library of characters, products, places, and more that you can use across videos, character swaps, and UGC content.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Asset Types</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>Human Characters</strong> - Create realistic AI people with specific appearances, styles, and personalities. Use them as avatars in UGC videos or swap them into existing content.</FeatureItem>
              <FeatureItem><strong>Products</strong> - Upload or describe your products. Use them in promotional videos, UGC content, and social media posts.</FeatureItem>
              <FeatureItem><strong>Places</strong> - Define locations and environments. Use them as backgrounds and settings in your video content.</FeatureItem>
              <FeatureItem><strong>Apps</strong> - Showcase app interfaces and screenshots in your promotional content.</FeatureItem>
              <FeatureItem><strong>Non-Human Characters</strong> - Create animated mascots, cartoon characters, or fantasy creatures for your brand.</FeatureItem>
            </Box>

            <SectionDivider />

            <Typography component="h2">Creating Assets</Typography>

            <Typography component="p">
              To create an asset, go to the <strong>My Characters</strong> page and click <strong>Create New</strong>. Choose the asset type, provide a description or upload reference images, and the AI will generate your asset.
            </Typography>

            <Typography component="p">
              Once created, your assets appear in your library and can be selected when creating videos, UGC content, or performing character swaps.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Using Assets</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>In UGC Videos</strong> - Select a human character as your avatar for authentic-looking content.</FeatureItem>
              <FeatureItem><strong>In Character Swap</strong> - Use any character asset to replace people in existing videos.</FeatureItem>
              <FeatureItem><strong>In AI Videos</strong> - Reference your assets in video prompts for consistent branding.</FeatureItem>
            </Box>

            <SectionDivider />

            <Typography component="h2">Tips</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem>Create a consistent brand character and reuse it across all your content.</FeatureItem>
              <FeatureItem>Upload high-quality reference images for the most accurate asset generation.</FeatureItem>
              <FeatureItem>Give your assets descriptive names so they're easy to find later.</FeatureItem>
            </Box>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Create Your Assets
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Build a library of reusable characters and elements.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/ai-assets')}
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
                Manage Assets
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AssetsPage;
