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

const SocialPage: React.FC = () => {
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
        title="Social Publishing | Gruvi Documentation"
        description="Schedule and publish content to YouTube, TikTok, Instagram, Facebook, LinkedIn, and X from Gruvi."
        keywords="social media publishing, schedule posts, YouTube upload, TikTok posting, Instagram publishing"
        ogTitle="Social Publishing | Gruvi"
        ogDescription="Publish your AI content to all major social platforms"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/social"
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
            Social{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Publishing
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Publish your content to all major social platforms
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
              Gruvi's Social Publishing lets you schedule and publish your AI-generated content directly to social media platforms. Connect your accounts once and publish from Gruvi with a single click.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Supported Platforms</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>YouTube</strong> - Upload videos with titles, descriptions, and tags. Supports Shorts and regular videos.</FeatureItem>
              <FeatureItem><strong>TikTok</strong> - Post videos directly to your TikTok account.</FeatureItem>
              <FeatureItem><strong>Instagram</strong> - Share Reels and video posts to your Instagram profile.</FeatureItem>
              <FeatureItem><strong>Facebook</strong> - Publish videos to your Facebook page or profile.</FeatureItem>
              <FeatureItem><strong>LinkedIn</strong> - Share professional content to your LinkedIn profile.</FeatureItem>
              <FeatureItem><strong>X (Twitter)</strong> - Post videos and content to your X account.</FeatureItem>
            </Box>

            <SectionDivider />

            <Typography component="h2">Connecting Accounts</Typography>

            <Typography component="p">
              Go to the <strong>Social</strong> page and click <strong>Connect</strong> next to the platform you want to link. You'll be redirected to authorize Gruvi to post on your behalf. Your credentials are stored securely and you can disconnect at any time.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Publishing Content</Typography>

            <Typography component="p">
              After creating any content (music, video, UGC), you can publish it directly from the creation page. Select your connected platforms, add a caption or description, and publish immediately or schedule for later.
            </Typography>

            <Typography component="p">
              You can also publish from your content library - browse your previously created content and share it to any connected platform.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Scheduling</Typography>

            <Typography component="p">
              Schedule posts for specific dates and times. Gruvi will automatically publish your content at the scheduled time. This is great for maintaining a consistent posting schedule across platforms.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Tips</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem>Connect all your platforms once and publish everywhere with one click.</FeatureItem>
              <FeatureItem>Use scheduling to post at optimal times for each platform.</FeatureItem>
              <FeatureItem>AI agents can automate the entire workflow: create content and publish, all in one command.</FeatureItem>
            </Box>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Connect Your Accounts
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Link your social platforms and start publishing.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/settings/connected-accounts')}
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
                Manage Social Accounts
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default SocialPage;
