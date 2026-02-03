import React, { useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader } from '../../components/marketing';

const SectionDivider: React.FC = () => (
  <Box sx={{ my: 6 }}>
    <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)' }} />
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

const TipBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{
    my: 4,
    p: 3,
    borderRadius: '16px',
    background: 'rgba(78, 205, 196, 0.08)',
    border: '1px solid rgba(78, 205, 196, 0.2)',
    '& p': { mb: 0 },
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
      <TipsAndUpdatesIcon sx={{ color: '#4ECDC4', fontSize: 22 }} />
      <Typography sx={{ color: '#4ECDC4', fontWeight: 600, fontSize: '1.1rem' }}>{title}</Typography>
    </Box>
    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.6, ml: 4.5 }}>
      {children}
    </Typography>
  </Box>
);

const VoiceCard: React.FC<{ name: string; description: string; id: string }> = ({ name, description, id }) => (
  <Box sx={{
    p: 2,
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
  }}>
    <Typography sx={{ color: '#4ECDC4', fontWeight: 600, mb: 0.5 }}>{name}</Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 1 }}>{description}</Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontFamily: 'monospace' }}>ID: {id}</Typography>
  </Box>
);

const VoiceoverPage: React.FC = () => {
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
        title="AI Voiceovers | Gruvi Documentation"
        description="Create professional voiceovers with 25+ AI voices. Perfect for UGC content, narratives, and storytelling."
        keywords="AI voiceover, text to speech, TTS, UGC voiceover, narrative"
        ogTitle="AI Voiceovers | Gruvi"
        ogDescription="Professional AI voiceovers with 25+ unique voices"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/voiceover"
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
              Voiceovers
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Professional text-to-speech with 25+ AI voices
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Box sx={{ py: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            '& p': { color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 },
            '& h2': { color: '#fff', fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mt: 0, mb: 3 },
            '& h3': { color: '#fff', fontSize: { xs: '1.25rem', md: '1.4rem' }, fontWeight: 600, mt: 4, mb: 2 },
          }}>

            <Typography component="p">
              Gruvi's voiceover system creates natural-sounding speech with distinct personalities. Use direct text-to-speech for exact scripts, or let AI generate engaging narratives from a simple prompt.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Narrative Types</Typography>

            <TableContainer component={Paper} sx={{ my: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Type</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Best For</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>How It Works</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>direct</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Exact scripts</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Speaks your text exactly as written</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>story</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Storytelling</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>AI writes a narrative from your concept</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>ugc</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Social content</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Hook-driven script for influencer-style content</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TipBox title="UGC is Best for Social">
              The "ugc" type generates scripts optimized for short-form video. It automatically creates attention-grabbing hooks and calls-to-action that perform well on TikTok, Reels, and Shorts.
            </TipBox>

            <SectionDivider />

            <Typography component="h2">Voice Selection</Typography>

            <Typography component="p">
              Choose from 25+ voices with different personalities, accents, and styles. Here are some popular options:
            </Typography>

            <Typography component="h3">Storyteller Voices</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Sir Albus" description="Friendly grandpa storyteller" id="albus" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Aunt Beth" description="English granny narrator" id="beth" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="King Arthur" description="Heroic American male" id="arthur" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Fiona" description="Irish woman with character" id="fiona" />
              </Grid>
            </Grid>

            <Typography component="h3">Social Media Voices</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Kristen" description="Energetic social media narrator" id="Kristen" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Gracie" description="Valley girl influencer vibe" id="Gracie" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Nathan" description="Energetic British for social media" id="Nathan" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Liam" description="Energetic social media creator" id="Liam" />
              </Grid>
            </Grid>

            <Typography component="h3">Professional Voices</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Annie" description="Professional female narrator" id="Annie" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Daniel" description="Steady broadcaster" id="Daniel" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Sarah" description="Mature, reassuring, confident" id="Sarah" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <VoiceCard name="Brian" description="Deep, resonant, comforting" id="Brian" />
              </Grid>
            </Grid>

            <CodeBlock language="bash">
{`# Get all available voices
curl -H "Authorization: Bearer $GRUVI_KEY" \\
  https://api.gruvimusic.com/api/gruvi/narratives/voices`}
            </CodeBlock>

            <SectionDivider />

            <Typography component="h2">For AI Agents</Typography>

            <CodeBlock language="bash">
{`# Create a UGC voiceover (AI writes the hook-driven script)
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Create a voiceover about my new fitness app. It helps people track workouts and stay motivated.",
    "narrativeType": "ugc",
    "narratorId": "Kristen"
  }' \\
  https://api.gruvimusic.com/api/gruvi/narratives/{userId}`}
            </CodeBlock>

            <CodeBlock language="bash">
{`# Create a direct voiceover (exact script)
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Welcome to your daily dose of motivation. Today, we are going to talk about the power of consistency.",
    "narrativeType": "direct",
    "narratorId": "Daniel"
  }' \\
  https://api.gruvimusic.com/api/gruvi/narratives/{userId}`}
            </CodeBlock>

            <Box sx={{
              my: 4,
              p: 3,
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <Typography component="span" sx={{ display: 'block', color: '#4ECDC4', fontWeight: 600, mb: 1 }}>Cost</Typography>
              <Typography component="span" sx={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7 }}>
                25 tokens flat rate for all voiceovers, regardless of length or narrative type.
              </Typography>
            </Box>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Create Your Voiceover
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Choose a voice and bring your content to life.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/create/narrative')}
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
                Create Voiceover
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default VoiceoverPage;
