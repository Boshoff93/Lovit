import React, { useCallback, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideocamIcon from '@mui/icons-material/Videocam';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ShareIcon from '@mui/icons-material/Share';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader } from '../../components/marketing';

interface DocCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  tag?: string;
}

const DocCard: React.FC<DocCardProps> = ({ icon, title, description, path, tag }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(path)}
      sx={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%',
        '&:hover': {
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(78, 205, 196, 0.3)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4ECDC4',
          }}>
            {icon}
          </Box>
          {tag && (
            <Chip
              label={tag}
              size="small"
              sx={{
                background: 'rgba(78, 205, 196, 0.15)',
                color: '#4ECDC4',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', mb: 1 }}>
          {title}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const DocsPage: React.FC = () => {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const handleOpenAuth = useCallback(() => setAuthOpen(true), []);

  const creatorDocs: DocCardProps[] = [
    {
      icon: <RocketLaunchIcon />,
      title: 'Getting Started',
      description: 'Learn how to create AI music, videos, voiceovers, and more with Gruvi.',
      path: '/docs/getting-started',
      tag: 'Start Here',
    },
    {
      icon: <MusicNoteIcon />,
      title: 'AI Music',
      description: 'Generate original, royalty-free music in 32 genres and 24 languages. Standard and premium options.',
      path: '/docs/music',
    },
    {
      icon: <RecordVoiceOverIcon />,
      title: 'Voiceovers',
      description: 'Create professional voiceovers with 25+ AI voices. Perfect for UGC content and narratives.',
      path: '/docs/voiceover',
    },
    {
      icon: <VideocamIcon />,
      title: 'AI Videos',
      description: 'Create cinematic videos, music videos, and UGC content with AI-powered visuals.',
      path: '/docs/video',
    },
    {
      icon: <PersonIcon />,
      title: 'UGC Creator',
      description: 'Generate authentic user-generated content style videos with AI avatars and voice change.',
      path: '/docs/ugc',
    },
    {
      icon: <SwapHorizIcon />,
      title: 'Character Swap',
      description: 'Replace characters in videos using Kling AI. Swap faces, environments, or use custom prompts.',
      path: '/docs/character-swap',
    },
    {
      icon: <PersonIcon />,
      title: 'AI Assets',
      description: 'Create reusable assets: Human characters, products, places, apps, and non-human characters.',
      path: '/docs/assets',
    },
    {
      icon: <ShareIcon />,
      title: 'Social Publishing',
      description: 'Schedule and publish to YouTube, TikTok, Instagram, Facebook, LinkedIn, and X.',
      path: '/docs/social',
    },
  ];

  const agentDocs: DocCardProps[] = [
    {
      icon: <SmartToyIcon />,
      title: 'Agent Integration',
      description: 'Learn how to integrate Gruvi with Claude, ChatGPT, or any AI agent using the gruvi skill.',
      path: '/docs/agent-integration',
      tag: 'Start Here',
    },
  ];

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
        title="Documentation | Gruvi - AI Content Creation Platform"
        description="Learn how to use Gruvi to create AI music, videos, voiceovers, and more. Comprehensive guides for creators and AI agents."
        keywords="gruvi documentation, AI music tutorial, AI video guide, UGC creator, social media publishing"
        ogTitle="Gruvi Documentation"
        ogDescription="Comprehensive guides for AI content creation with Gruvi"
        ogType="website"
        ogUrl="https://agentgruvi.com/docs"
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* Hero Section */}
      <Box sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip
              label="Documentation"
              sx={{
                background: 'rgba(78, 205, 196, 0.15)',
                color: '#4ECDC4',
                fontWeight: 600,
                mb: 3,
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                color: '#fff',
                mb: 3,
                letterSpacing: '-0.03em',
              }}
            >
              Gruvi{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Documentation
              </Box>
            </Typography>
            <Typography sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.7,
            }}>
              Everything you need to create AI-powered content. Guides for creators and AI agents.
            </Typography>
          </Box>

          {/* For Creators Section */}
          <Box sx={{ mb: 8 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.5rem', mb: 3 }}>
              For Creators
            </Typography>
            <Grid container spacing={3}>
              {creatorDocs.map((doc) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.title}>
                  <DocCard {...doc} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* For AI Agents Section */}
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.5rem', mb: 3 }}>
              For AI Agents
            </Typography>
            <Grid container spacing={3}>
              {agentDocs.map((doc) => (
                <Grid size={{ xs: 12, md: 6 }} key={doc.title}>
                  <DocCard {...doc} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Quick Links */}
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.5rem', mb: 2 }}>
            Need Help?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
            Can't find what you're looking for?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/faq')}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.2)',
                '&:hover': { borderColor: '#4ECDC4', background: 'rgba(78, 205, 196, 0.1)' },
              }}
            >
              FAQ
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/support')}
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.2)',
                '&:hover': { borderColor: '#4ECDC4', background: 'rgba(78, 205, 196, 0.1)' },
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DocsPage;
