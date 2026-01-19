import React, { useEffect, useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader, CTASection } from '../../components/marketing';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAuth } from '../../hooks/useAuth';

// Twitter/X Embed Component
const TweetEmbed: React.FC<{ tweetUrl: string }> = ({ tweetUrl }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Twitter widgets script if not already loaded
    if (!(window as any).twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    } else {
      // If already loaded, render the widget
      (window as any).twttr.widgets?.load(containerRef.current);
    }
  }, [tweetUrl]);

  return (
    <Box ref={containerRef} sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
      <blockquote className="twitter-tweet" data-theme="dark" data-dnt="true">
        <a href={tweetUrl}></a>
      </blockquote>
    </Box>
  );
};

// Placeholder Image Component
const PlaceholderImage: React.FC<{ id: string; description: string; aspectRatio?: string }> = ({
  id,
  description,
  aspectRatio = '16/9'
}) => (
  <Box
    sx={{
      width: '100%',
      aspectRatio,
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(78, 205, 196, 0.2) 100%)',
      borderRadius: '16px',
      border: '2px dashed rgba(139, 92, 246, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      my: 4,
      p: 3,
    }}
  >
    <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textAlign: 'center' }}>
      [{id}]
    </Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mt: 1, textAlign: 'center' }}>
      {description}
    </Typography>
  </Box>
);

const MotionControlViralContent: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;

  // Auth modal state (simplified - you can extend with full auth modal if needed)
  const [authOpen, setAuthOpen] = useState(false);
  const handleOpenAuth = useCallback(() => setAuthOpen(true), []);

  return (
    <Box sx={{ minHeight: '100vh', background: '#0D0D0F' }}>
      <SEO
        title="Motion Control Video: How to Go Viral with AI Character Swaps | Gruvi Blog"
        description="Learn how creators are generating millions of views with AI character swaps and motion control videos. Step-by-step tutorial with WAN, Kling, and Flux 2 Pro."
        keywords="AI character swap, motion control video, viral content, Kling, WAN, video to video, face swap, viral TikTok"
        ogTitle="Motion Control Video: How to Go Viral with AI Character Swaps"
        ogDescription="The new wave of AI content that's taking over social media. Learn how to create viral character swaps."
        ogType="article"
        ogUrl="https://gruvimusic.com/blog/motion-control-viral-content"
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 14, md: 20 },
          pb: { xs: 6, md: 10 },
          background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradient orbs */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '40%',
          height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '0%',
          right: '10%',
          width: '35%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(78, 205, 196, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Back button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blog')}
            sx={{
              color: 'rgba(255,255,255,0.7)',
              mb: 4,
              '&:hover': { color: '#fff', background: 'transparent' },
            }}
          >
            Back to Blog
          </Button>

          {/* Category & Meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip
              label="Tutorial"
              size="small"
              sx={{
                background: 'rgba(139, 92, 246, 0.15)',
                color: '#8B5CF6',
                fontWeight: 600,
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: '0.85rem' }}>5 min read</Typography>
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#fff',
              mb: 3,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            Motion Control Video: How to Go Viral with{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AI Character Swaps
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            The new wave of AI content that's taking over social media
          </Typography>

          {/* Author & Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              By Gruvi Team
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              January 18, 2026
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Article Content */}
      <Box sx={{ py: { xs: 6, md: 10 }, background: '#0D0D0F' }}>
        <Container maxWidth="md">
          <Box sx={{
            '& p': {
              color: 'rgba(255,255,255,0.85)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3
            },
            '& h2': {
              color: '#fff',
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              fontWeight: 700,
              mt: 6,
              mb: 3,
            },
            '& h3': {
              color: '#fff',
              fontSize: { xs: '1.25rem', md: '1.4rem' },
              fontWeight: 600,
              mt: 4,
              mb: 2,
            },
            '& ul, & ol': {
              color: 'rgba(255,255,255,0.85)',
              pl: 3,
              mb: 3,
              '& li': {
                mb: 1,
                fontSize: '1.05rem',
                lineHeight: 1.7,
              },
            },
          }}>
            <PlaceholderImage
              id="PLACEHOLDER_IMAGE_1"
              description="Hero image: Before/after character swap example"
            />

            <Typography component="h2">The Viral AI Trend</Typography>

            <Typography component="p">
              AI character swaps are blowing up right now. Creators like @minchoi and @levelsio
              have generated millions of views with videos that swap characters while preserving
              natural motion. Here's how you can do it too with Gruvi.
            </Typography>

            <Typography component="h3">See What's Going Viral</Typography>

            <TweetEmbed tweetUrl="https://x.com/minchoi/status/2011473626927624460" />
            <TweetEmbed tweetUrl="https://x.com/minchoi/status/2011446019142348947" />
            <TweetEmbed tweetUrl="https://x.com/levelsio/status/2011938736058007782" />

            <Typography component="h2">What is Motion Control?</Typography>

            <Typography component="p">
              Motion control lets you take any video and transfer the movement to a completely
              new character or scene. The AI analyzes:
            </Typography>

            <Box component="ul">
              <li>Body movements and poses</li>
              <li>Facial expressions and lip sync</li>
              <li>Camera movement</li>
            </Box>

            <Typography component="p">
              Then applies them to your new character image, creating a seamless transformation
              that looks like it was filmed that way.
            </Typography>

            <Typography component="h2">The 3 Methods We Support</Typography>

            <Typography component="h3">1. Replace Character (Keep Background)</Typography>
            <Typography component="p">
              Best for: Swapping faces while keeping the original environment intact.
            </Typography>
            <PlaceholderImage
              id="PLACEHOLDER_IMAGE_3"
              description="Replace mode example: Same room, different person"
            />

            <Typography component="h3">2. New Scene (Character + Background)</Typography>
            <Typography component="p">
              Best for: Taking motion into a completely different world.
            </Typography>
            <PlaceholderImage
              id="PLACEHOLDER_IMAGE_4"
              description="Move mode example: Dance moves transferred to new environment"
            />

            <Typography component="h3">3. Premium Kling Motion (Best Quality)</Typography>
            <Typography component="p">
              Best for: Complex motions, perfect lip sync, and full-body movement. Supports up to 30 seconds.
            </Typography>
            <PlaceholderImage
              id="PLACEHOLDER_IMAGE_5"
              description="Kling example: High quality complex motion with lip sync"
            />

            {/* Comparison Table */}
            <Box sx={{ my: 4 }}>
              <TableContainer component={Paper} sx={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, borderColor: 'rgba(255,255,255,0.1)' }}>Mode</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, borderColor: 'rgba(255,255,255,0.1)' }}>Best For</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 700, borderColor: 'rgba(255,255,255,0.1)' }}>Token Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Replace</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Face swaps, same background</TableCell>
                      <TableCell sx={{ color: '#8B5CF6', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Move</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>New character + new world</TableCell>
                      <TableCell sx={{ color: '#8B5CF6', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>100</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Kling Premium</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.1)' }}>Complex motion, lip sync</TableCell>
                      <TableCell sx={{ color: '#8B5CF6', fontWeight: 600, borderColor: 'rgba(255,255,255,0.1)' }}>150</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Typography component="h2">Step-by-Step Tutorial</Typography>

            <Typography component="h3">Step 1: Find Your Reference Video</Typography>
            <Box component="ul">
              <li>Clear shot of a single person</li>
              <li>Full or upper body visible</li>
              <li>Good lighting</li>
              <li>Up to 30 seconds for best results</li>
            </Box>
            <PlaceholderImage
              id="PLACEHOLDER_IMAGE_6"
              description="Good vs bad reference video examples"
            />

            <Typography component="h3">Step 2: Transform the First Frame</Typography>
            <Typography component="p">
              Use our AI to edit the first frame of your video:
            </Typography>
            <Box component="ul">
              <li>Keep the character's pose exactly the same</li>
              <li>Change the person, outfit, or entire scene</li>
              <li>The more similar the pose, the better the result</li>
            </Box>
            <PlaceholderImage
              id="PLACEHOLDER_IMAGE_7"
              description="UI screenshot: First frame transformation"
            />

            <Typography component="h3">Step 3: Choose Your Mode</Typography>
            <Typography component="p">
              Select the mode that best fits your creative vision:
            </Typography>
            <Box component="ul">
              <li><strong>Replace:</strong> "Keep the background, change the person"</li>
              <li><strong>Move:</strong> "Transfer motion to completely new scene"</li>
              <li><strong>Kling Premium:</strong> "Best for complex motions & lip sync"</li>
            </Box>

            <Typography component="h3">Step 4: Add Voice Change (Optional)</Typography>
            <Typography component="p">
              If you're changing the character's gender, age, or ethnicity, use voice transformation to match:
            </Typography>
            <Box component="ul">
              <li>Keeps the original delivery and timing</li>
              <li>Changes the voice characteristics</li>
              <li>Seamless audio-visual match</li>
            </Box>
            <PlaceholderImage
              id="PLACEHOLDER_IMAGE_8"
              description="UI screenshot: Voice change toggle"
              aspectRatio="4/3"
            />

            <Typography component="h3">Step 5: Generate and Share</Typography>
            <Box component="ul">
              <li>Processing takes 1-3 minutes</li>
              <li>Download in HD</li>
              <li>Share directly to social media</li>
            </Box>

            <Typography component="h2">Pro Tips for Viral Content</Typography>

            <Box component="ol">
              <li><strong>Use trending audio</strong> - Pair with popular songs or sounds</li>
              <li><strong>Unexpected transformations</strong> - The more surprising, the more shares</li>
              <li><strong>Keep it short</strong> - 10-15 seconds performs best</li>
              <li><strong>Show the before/after</strong> - People love seeing the transformation</li>
              <li><strong>Add a hook</strong> - Start with the most impressive moment</li>
            </Box>

            <Typography component="h2">Examples That Went Viral</Typography>

            <PlaceholderImage
              id="PLACEHOLDER_IMAGE_9"
              description="Gallery grid of successful viral examples"
            />

            {/* CTA Box */}
            <Box
              sx={{
                mt: 8,
                p: 4,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(78, 205, 196, 0.2) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Ready to Create?
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                Start making viral AI character swaps now with Gruvi.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => isLoggedIn ? navigate('/create/video') : handleOpenAuth()}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                  },
                }}
              >
                Try Character Swap Studio
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer CTA */}
      <CTASection
        title="More AI Tools for Creators"
        subtitle="Explore our full suite of AI-powered content creation tools."
        primaryButtonText="Explore Features"
        primaryButtonAction={() => navigate('/')}
        variant="dark"
      />
    </Box>
  );
};

export default MotionControlViralContent;
