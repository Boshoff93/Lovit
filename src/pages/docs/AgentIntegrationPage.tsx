import React, { useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader } from '../../components/marketing';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

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

const AgentIntegrationPage: React.FC = () => {
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
        title="Agent Integration | Gruvi Documentation"
        description="Learn how to integrate Gruvi with Claude Code, ChatGPT, and other AI agents. Complete API reference and workflow examples."
        keywords="gruvi agent, AI integration, Claude Code skill, API reference, workflow automation"
        ogTitle="Agent Integration Guide | Gruvi"
        ogDescription="Integrate Gruvi with your AI agent for automated content creation"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/agent-integration"
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
            <Chip label="Integration" size="small" sx={{ background: 'rgba(78, 205, 196, 0.15)', color: '#4ECDC4', fontWeight: 600 }} />
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
            Agent{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Integration
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Connect Gruvi to your AI agent for automated content creation
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
              Gruvi is designed to work with AI agents. Use natural language to create music, videos, and publish content. This guide covers how to set up the Gruvi skill and use it effectively.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Installing the Gruvi Skill</Typography>

            <Typography component="h3">For Claude Code (Anthropic)</Typography>

            <Typography component="p">
              Install the Gruvi skill with this command:
            </Typography>

            <CodeBlock language="bash">
{`curl -s https://agentgruvi.com/skill.md -o ~/.claude/skills/gruvi/SKILL.md
export GRUVI_KEY="gruvi_agent_xxxx"`}
            </CodeBlock>

            <Typography component="p">
              Once installed, Claude automatically knows how to use Gruvi. Just say <strong>"Use the gruvi skill to create..."</strong> and Claude will handle everything - creating music, generating videos, publishing to social media, and more.
            </Typography>

            <TipBox title="Claude Understands Context">
              The skill file teaches Claude everything about Gruvi's capabilities. You don't need to explain API endpoints or parameters - just describe what you want in natural language and Claude will figure out the right commands.
            </TipBox>

            <Typography component="h3">For Other AI Agents</Typography>

            <Typography component="p">
              If your AI agent supports custom tools or function calling, point it to the skill file at <code>https://agentgruvi.com/skill.md</code> - it contains all the instructions and API details the agent needs.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Available Commands</Typography>

            <Typography component="p">
              Once installed, you can use these commands by speaking naturally to your agent:
            </Typography>

            <TableContainer component={Paper} sx={{ my: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Command</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Description</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>Tokens</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>create-song</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Generate AI music</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>25-50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>create-voiceover</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Generate text-to-speech</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>25</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>create-video</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Generate video from song/voiceover</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>50/sec</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>create-ugc</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Generate UGC-style avatar video</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>character-swap</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Replace character in video (Kling)</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>50/sec</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>create-asset</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Create reusable AI asset</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Free</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>schedule</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Schedule content for publishing</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>10</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>publish</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Publish immediately to platforms</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>10</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>check-status</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Check job completion status</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Free</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#4ECDC4', borderColor: 'rgba(255,255,255,0.1)', fontFamily: 'monospace' }}>list-content</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>List your songs, videos, etc.</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Free</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <SectionDivider />

            <Typography component="h2">Example Workflows</Typography>

            <Typography component="h3">1. Create and Publish a Product Video</Typography>

            <CodeBlock language="conversation">
{`You: "Create a UGC video promoting my new fitness app.
     Make it energetic, 15 seconds, and publish to TikTok and Instagram."

Agent: I'll create this for you. Let me:
       1. Generate an upbeat voiceover about your fitness app
       2. Create a UGC video with an AI avatar
       3. Schedule it to your connected TikTok and Instagram accounts

       [Creates voiceover - 25 tokens]
       [Creates UGC video - 75 tokens]
       [Schedules to platforms - 10 tokens]

       Done! Your video is scheduled for optimal posting times.`}
            </CodeBlock>

            <Typography component="h3">2. Create a Music Video</Typography>

            <CodeBlock language="conversation">
{`You: "Create a chill lofi song about late night coding,
     then make a cinematic video with city lights and rain."

Agent: Creating your content:
       1. Generating lofi track (standard, ~60 seconds)
       2. Creating cinematic video with city/rain visuals

       [Creates song - 50 tokens]
       [Creates video - 3000 tokens (60 sec × 50)]

       Your music video is ready! Want me to publish it?`}
            </CodeBlock>

            <Typography component="h3">3. Character Swap for Viral Content</Typography>

            <CodeBlock language="conversation">
{`You: "Take this trending dance video and swap the person
     with my brand mascot character."

Agent: I'll use the Kling character swap:
       1. Upload your video
       2. Apply character replacement with your mascot asset

       [Character swap - 50 tokens/sec of video]

       Done! The video now features your mascot performing the dance.`}
            </CodeBlock>

            <TipBox title="Pro Tip: Voice Change for UGC">
              When creating UGC videos, use the voice change option to make AI-generated content sound more authentic. The prompt-based creation with voice change produces the most natural results.
            </TipBox>

            <SectionDivider />

            <Typography component="h2">Async Operations</Typography>

            <Typography component="p">
              Most Gruvi operations are asynchronous. When you create content:
            </Typography>

            <Box sx={{ mb: 3, pl: 3 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>
                1. The API returns immediately with a job ID
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>
                2. Your agent polls for completion (handled automatically by the skill)
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>
                3. Once complete, the content is available in your library
              </Typography>
            </Box>

            <Typography component="p">
              Typical generation times:
            </Typography>

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
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Music Generation</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 500 }}>30-90 seconds</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Voiceover</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 500 }}>10-30 seconds</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Video Generation</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 500 }}>2-10 minutes</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mb: 0.5 }}>Character Swap</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 500 }}>3-8 minutes</Typography>
                </Box>
              </Box>
            </Box>

            <SectionDivider />

            <Typography component="h2">Social Platform Setup</Typography>

            <Typography component="p">
              Before publishing, connect your social accounts in the Gruvi dashboard:
            </Typography>

            <Box sx={{ mb: 3, pl: 3 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
                • <strong>YouTube</strong> - Full upload and scheduling
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
                • <strong>TikTok</strong> - Direct or draft posting, privacy settings
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
                • <strong>Instagram</strong> - Reels via Graph API
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
                • <strong>Facebook</strong> - Page posting
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
                • <strong>LinkedIn</strong> - Professional video sharing
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 1 }}>
                • <strong>X (Twitter)</strong> - Video tweets
              </Typography>
            </Box>

            <Typography component="p">
              You can connect up to 3 accounts per platform, allowing you to manage multiple brands or pages.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Error Handling</Typography>

            <Typography component="p">
              The skill handles common errors gracefully:
            </Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>Insufficient tokens:</strong> Agent will notify you and suggest topping up</FeatureItem>
              <FeatureItem><strong>Generation failed:</strong> Agent will explain the issue and suggest alternatives</FeatureItem>
              <FeatureItem><strong>Platform not connected:</strong> Agent will guide you to connect the account</FeatureItem>
            </Box>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Start Building
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Get your agent key and start creating AI content today.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => isLoggedIn ? navigate('/account') : handleOpenAuth()}
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
                {isLoggedIn ? 'Get Agent Key' : 'Sign Up Now'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AgentIntegrationPage;
