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

const VideoPage: React.FC = () => {
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
        title="AI Videos | Gruvi Documentation"
        description="Create cinematic videos, music videos, and promotional content with AI-powered visuals."
        keywords="AI video, music video, cinematic video, AI animation, video generation"
        ogTitle="AI Video Generation | Gruvi"
        ogDescription="Create stunning videos with AI-powered visuals"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/video"
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
              Videos
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Cinematic videos, music videos, and story-driven content
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
              Gruvi generates animated videos by combining AI-generated scenes with your audio (music or voiceover). Each video is unique, with scenes that match the content and mood of your audio.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Video Types</Typography>

            <TableContainer component={Paper} sx={{ my: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Type</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Audio Source</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Best For</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>music</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Song</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Music videos, promotional content</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>story</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Voiceover</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Storytelling, educational content</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>app-promo-music</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Song</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>App showcase with music</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>app-promo-voiceover</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Voiceover</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>App showcase with narration</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <SectionDivider />

            <Typography component="h2">Visual Styles</Typography>

            <Typography component="p">
              Choose from multiple visual styles for your video scenes:
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <strong>3D Cartoon:</strong> Pixar-style animated characters and environments
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <strong>Anime:</strong> Japanese animation style
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <strong>Cinematic:</strong> Film-quality realistic visuals
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                  <strong>Photo-Realism:</strong> Hyper-realistic imagery
                </Typography>
              </Box>
            </Box>

            <TipBox title="Characters Drive the Story">
              Add character assets to your video generation. Gruvi will feature them prominently in scenes, creating a consistent visual narrative throughout the video.
            </TipBox>

            <SectionDivider />

            <Typography component="h2">Aspect Ratios</Typography>

            <Box sx={{
              my: 4,
              p: 3,
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              '& p': { mb: 0 },
            }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Portrait</Typography>
                  <Typography sx={{ color: '#4ECDC4', fontWeight: 600 }}>9:16</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>TikTok, Reels, Shorts</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Landscape</Typography>
                  <Typography sx={{ color: '#4ECDC4', fontWeight: 600 }}>16:9</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>YouTube, presentations</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Square</Typography>
                  <Typography sx={{ color: '#4ECDC4', fontWeight: 600 }}>1:1</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Instagram feed</Typography>
                </Box>
              </Box>
            </Box>

            <SectionDivider />

            <Typography component="h2">For AI Agents</Typography>

            <CodeBlock language="bash">
{`# Generate a music video
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "videoContentType": "music",
    "songId": "your-song-id",
    "characterIds": ["char-id-1", "char-id-2"],
    "style": "3D Cartoon",
    "aspectRatio": "portrait"
  }' \\
  https://api.gruvimusic.com/api/gruvi/videos/generate

# Returns: {"videoId": "...", "status": "processing"}
# Poll status every 30s until complete`}
            </CodeBlock>

            <CodeBlock language="bash">
{`# Generate a story video from voiceover
curl -X POST -H "Authorization: Bearer $GRUVI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "videoContentType": "story",
    "narrativeId": "your-narrative-id",
    "characterIds": ["char-id"],
    "style": "Cinematic",
    "aspectRatio": "landscape"
  }' \\
  https://api.gruvimusic.com/api/gruvi/videos/generate`}
            </CodeBlock>

            <CodeBlock language="bash">
{`# Check video status
curl -H "Authorization: Bearer $GRUVI_KEY" \\
  https://api.gruvimusic.com/api/gruvi/videos/{userId}/{videoId}/status`}
            </CodeBlock>

            <SectionDivider />

            <Typography component="h2">Cost & Timing</Typography>

            <Box sx={{
              my: 4,
              p: 3,
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              '& p': { mb: 0 },
            }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Token Cost</Typography>
                  <Typography sx={{ color: '#4ECDC4', fontWeight: 600 }}>50 tokens / second</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Generation Time</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 500 }}>2-10 minutes</Typography>
                </Box>
              </Box>
            </Box>

            <Typography component="p">
              Example: A 60-second video costs 3,000 tokens (60 × 50).
            </Typography>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Create Your Video
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Turn your music or voiceover into stunning visuals.
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
                Create Video
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default VideoPage;
