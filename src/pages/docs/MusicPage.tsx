import React, { useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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

const MusicPage: React.FC = () => {
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
        title="AI Music | Gruvi Documentation"
        description="Create original, royalty-free AI music in 32 genres and 24 languages. Standard and premium options for every use case."
        keywords="AI music, royalty free music, music generation, gruvi music"
        ogTitle="AI Music Generation | Gruvi"
        ogDescription="Create original songs with AI in 32 genres and 24 languages"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/music"
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
              Music
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Generate original, royalty-free music in 32 genres and 24 languages
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
              Gruvi's AI music generation creates original, copyright-free songs from text prompts. Every song is unique and 100% yours to use commercially. Choose from standard (with lyrics) or premium (instrumental with precise duration control).
            </Typography>

            <SectionDivider />

            <Typography component="h2">Track Types</Typography>

            <Typography component="h3">Standard Music</Typography>
            <Typography component="p">
              AI-generated songs with vocals and lyrics. Great for social media content, promotional videos, and creative projects. Available in short (~45-60 seconds) or standard (~90-120 seconds) lengths.
            </Typography>

            <TableContainer component={Paper} sx={{ my: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Option</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Duration</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Tokens</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Short</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>~45-60 seconds</TableCell>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>25 tokens</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Standard</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>~90-120 seconds</TableCell>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>50 tokens</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography component="h3">Premium Music</Typography>
            <Typography component="p">
              Higher-fidelity instrumental tracks with precise duration control (30-180 seconds). Perfect for professional video production where you need exact timing. Can optionally include lyrics.
            </Typography>

            <Box sx={{
              my: 4,
              p: 3,
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <Typography component="span" sx={{ display: 'block', color: '#4ECDC4', fontWeight: 600, mb: 1 }}>Premium Pricing</Typography>
              <Typography component="span" sx={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7 }}>
                50 tokens per 30 seconds of audio. A 60-second track costs 100 tokens, a 180-second track costs 300 tokens.
              </Typography>
            </Box>

            <SectionDivider />

            <Typography component="h2">Genres & Languages</Typography>

            <Typography component="h3">32 Genres Available</Typography>
            <Typography component="p">
              Pop, Rock, Hip Hop, R&B, Country, Jazz, Blues, Electronic, Dance, EDM, House, Techno, Reggae, Latin, Salsa, K-Pop, J-Pop, Indie, Folk, Classical, Orchestral, Cinematic, Lofi, Ambient, Metal, Punk, Soul, Funk, Gospel, Trap, Drill, and Afrobeat.
            </Typography>

            <Typography component="h3">24 Languages</Typography>
            <Typography component="p">
              English, Spanish, French, German, Italian, Portuguese, Japanese, Korean, Chinese (Mandarin), Hindi, Arabic, Russian, Dutch, Swedish, Norwegian, Danish, Finnish, Polish, Turkish, Greek, Hebrew, Thai, Vietnamese, and Indonesian.
            </Typography>

            <TipBox title="Let AI Choose">
              Set genre and mood to "auto" and Gruvi will analyze your prompt to pick the best combination. Great for when you want creative suggestions.
            </TipBox>

            <SectionDivider />

            <Typography component="h2">For AI Agents</Typography>

            <Typography component="p">
              Here's how to generate music programmatically:
            </Typography>

            <CodeBlock language="bash">
{`# Generate a standard song
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "songPrompt": "Upbeat summer anthem about beach adventures",
    "genre": "pop",
    "mood": "happy",
    "songLength": "standard",
    "trackType": "standard",
    "language": "en"
  }' \\
  https://api.gruvimusic.com/api/gruvi/songs/generate

# Returns: {"songId": "...", "status": "processing"}
# Poll status every 10s until complete`}
            </CodeBlock>

            <CodeBlock language="bash">
{`# Generate a premium instrumental (60 seconds)
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "songPrompt": "Epic cinematic orchestral theme",
    "genre": "cinematic",
    "mood": "dramatic",
    "trackType": "premium",
    "premiumDurationMs": 60000,
    "forceInstrumental": true
  }' \\
  https://api.gruvimusic.com/api/gruvi/songs/generate`}
            </CodeBlock>

            <SectionDivider />

            <Typography component="h2">Prompt Tips</Typography>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <strong>Be specific:</strong> "Chill lofi beat with rainy day vibes" beats "calm song"
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <strong>Include emotions:</strong> Describe the feeling you want listeners to experience
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <strong>Reference characters:</strong> Include character IDs to feature them in the lyrics
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <strong>Use enhance:</strong> Call the enhance-prompt endpoint to improve your prompts
                </Typography>
              </Box>
            </Box>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Start Creating Music
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Generate your first AI song in seconds.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/create/music')}
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
                Create Music
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MusicPage;
