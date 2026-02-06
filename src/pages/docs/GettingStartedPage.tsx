import React, { useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader } from '../../components/marketing';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const SectionDivider: React.FC = () => (
  <Box sx={{ my: 6 }}>
    <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)' }} />
  </Box>
);

const StepItem: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.15rem', mb: 0.5, lineHeight: 1.4 }}>
      <Box component="span" sx={{ color: '#4ECDC4', fontWeight: 700, mr: 1 }}>{number}.</Box>
      {title}
    </Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

const CodeBlock: React.FC<{ children: string; language?: string }> = ({ children, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{
      position: 'relative',
      my: 3,
      borderRadius: '12px',
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden',
    }}>
      {language && (
        <Box sx={{
          px: 3,
          py: 1,
          background: 'rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
            {language}
          </Typography>
          <Button
            size="small"
            onClick={handleCopy}
            startIcon={copied ? <CheckCircleOutlineIcon /> : <ContentCopyIcon />}
            sx={{
              color: copied ? '#4ECDC4' : 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem',
              textTransform: 'none',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </Box>
      )}
      <Box sx={{ p: 3, overflow: 'auto' }}>
        <Typography
          component="pre"
          sx={{
            color: '#4ECDC4',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            m: 0,
          }}
        >
          {children}
        </Typography>
      </Box>
    </Box>
  );
};

const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

const GettingStartedPage: React.FC = () => {
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
        title="Getting Started | Gruvi Documentation"
        description="Learn how to create AI music, videos, voiceovers, and more with Gruvi. Your complete guide to AI content creation."
        keywords="gruvi getting started, AI music creation, AI video creation, AI voiceover, content creation"
        ogTitle="Getting Started with Gruvi"
        ogDescription="Your complete guide to creating AI-powered content with Gruvi"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/getting-started"
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
            <Chip label="Guide" size="small" sx={{ background: 'rgba(78, 205, 196, 0.15)', color: '#4ECDC4', fontWeight: 600 }} />
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
            Getting Started with{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Gruvi
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Everything you need to start creating AI-powered content
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
              Gruvi is an AI content creation platform that lets you generate music, videos, voiceovers, and publish directly to social media. Here's how to get started.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Quick Setup</Typography>

            <StepItem number={1} title="Create Your Account">
              Sign up at <strong>agentgruvi.com</strong> and choose a subscription plan. You'll get tokens to use for content creation.
            </StepItem>

            <StepItem number={2} title="Explore the Dashboard">
              Once logged in, you'll see tools for creating <strong>AI Music</strong>, <strong>AI Videos</strong>, <strong>Voiceovers</strong>, <strong>UGC content</strong>, and more. Each tool has its own dedicated page.
            </StepItem>

            <StepItem number={3} title="Create Your First Content">
              Pick any tool and start creating. Describe what you want, choose your style, and Gruvi handles the rest.
            </StepItem>

            <SectionDivider />

            <Typography component="h2">What You Can Create</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>AI Music</strong> - Original songs in 32 genres, 24 languages. Standard and premium quality.</FeatureItem>
              <FeatureItem><strong>AI Voiceovers</strong> - Professional narration with 25+ voices and different personalities.</FeatureItem>
              <FeatureItem><strong>AI Videos</strong> - Cinematic videos, music videos, and story-driven content.</FeatureItem>
              <FeatureItem><strong>UGC Creator</strong> - Authentic user-generated content with AI avatars and voiceovers.</FeatureItem>
              <FeatureItem><strong>Character Swap</strong> - Replace characters in videos using AI. Swap faces, environments, or use custom prompts.</FeatureItem>
              <FeatureItem><strong>AI Assets</strong> - Create reusable characters, products, places, and more for your content.</FeatureItem>
              <FeatureItem><strong>Social Publishing</strong> - Schedule and publish to YouTube, TikTok, Instagram, Facebook, LinkedIn, and X.</FeatureItem>
            </Box>

            <SectionDivider />

            <Typography component="h2">Token Costs</Typography>

            <Typography component="p">
              Every creation uses tokens from your balance:
            </Typography>

            <Box sx={{
              my: 3,
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}>
              {[
                { name: 'Standard Song', cost: '25-50 tokens' },
                { name: 'Premium Song', cost: '50 tokens / 30s' },
                { name: 'Voiceover', cost: '25 tokens' },
                { name: 'Video', cost: '50 tokens / second' },
                { name: 'UGC Video', cost: '50 tokens / second' },
                { name: 'Character Swap', cost: '50 tokens / second' },
              ].map((item, i) => (
                <Box key={item.name} sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 3,
                  py: 1,
                  borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <Typography component="span" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{item.name}</Typography>
                  <Typography component="span" sx={{ color: '#4ECDC4', fontWeight: 600, fontSize: '0.95rem' }}>{item.cost}</Typography>
                </Box>
              ))}
            </Box>

            <SectionDivider />

            <Typography component="h2">Using AI Agents</Typography>

            <Typography component="p">
              You can also use Gruvi through AI agents like Claude Code or ChatGPT. See the <strong>Agent Integration</strong> guide for setup instructions.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Next Steps</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem>Explore the feature docs for <strong>Music</strong>, <strong>Video</strong>, <strong>Voiceover</strong>, and more</FeatureItem>
              <FeatureItem>Create your first <strong>AI Asset</strong> to use across multiple projects</FeatureItem>
              <FeatureItem>Connect your social accounts for <strong>one-click publishing</strong></FeatureItem>
            </Box>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Ready to Create?
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                {isLoggedIn ? 'Head to the dashboard to start creating.' : 'Sign up free and start creating AI content.'}
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => isLoggedIn ? navigate('/create/music') : handleOpenAuth()}
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
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default GettingStartedPage;
