import React, { useEffect, useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader, CTASection } from '../../components/marketing';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

// Styled Divider Component - simple line like other pages
const SectionDivider: React.FC = () => (
  <Box sx={{ my: 6 }}>
    <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)' }} />
  </Box>
);

// Feature List Item
const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    <CheckCircleOutlineIcon sx={{ color: '#8B5CF6', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

// Tip Box Component
const TipBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{
    my: 4,
    p: 3,
    borderRadius: '16px',
    background: 'rgba(139, 92, 246, 0.08)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <TipsAndUpdatesIcon sx={{ color: '#8B5CF6', fontSize: 20, mt: '5px' }} />
      <Typography sx={{ color: '#8B5CF6', fontWeight: 600, fontSize: '1.1rem' }}>{title}</Typography>
    </Box>
    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.5 }}>
      {children}
    </Typography>
  </Box>
);

// Mode Card Component
const ModeCard: React.FC<{ title: string; bestFor: string; description: string }> = ({ title, bestFor, description }) => (
  <Box sx={{
    p: 3,
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    mb: 2,
  }}>
    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>{title}</Typography>
    <Typography sx={{ color: '#8B5CF6', fontSize: '0.9rem', mb: 1 }}>{bestFor}</Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>{description}</Typography>
  </Box>
);

const MotionControlViralContent: React.FC = () => {
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
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 40%), radial-gradient(ellipse 60% 30% at 70% 10%, rgba(236, 72, 153, 0.1) 0%, transparent 40%)',
        pointerEvents: 'none',
        zIndex: 0,
      },
    }}>
      <SEO
        title="AI Character Swap: How to Go Viral with Motion Control Videos | Gruvi"
        description="Learn how creators are generating millions of views with AI character swaps and motion control videos. Complete guide to WAN, Kling, and motion transfer."
        keywords="AI character swap, motion control video, viral content, Kling, WAN, video to video, face swap, viral TikTok"
        ogTitle="AI Character Swap: How to Go Viral with Motion Control Videos"
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
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/blog')}
            sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, '&:hover': { color: '#fff', background: 'transparent' } }}
          >
            Back to Blog
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip label="Guide" size="small" sx={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', fontWeight: 600 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: '0.85rem' }}>5 min read</Typography>
            </Box>
          </Box>

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
            AI Character Swap: How to Go Viral with{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Motion Control
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontStyle: 'italic' }}>
            The new wave of AI content taking over social media
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>By Gruvi Team</Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>January 2026</Typography>
          </Box>
        </Container>
      </Box>

      {/* Article Content */}
      <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            '& p': { color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 },
            '& h2': { color: '#fff', fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mt: 0, mb: 3 },
            '& h3': { color: '#fff', fontSize: { xs: '1.25rem', md: '1.4rem' }, fontWeight: 600, mt: 4, mb: 2 },
          }}>

            {/* Intro */}
            <Typography component="p">
              AI Character Swap is taking over social media. Creators are generating millions of views by swapping characters in videos while preserving natural motion—and you can do it too without any technical skills.
            </Typography>

            <Typography component="p">
              This guide covers everything you need to know about AI Character Swap (powered by WAN 2.2 and Kling), from understanding the technology to creating your own viral content.
            </Typography>

            <SectionDivider />

            {/* What is AI Character Swap */}
            <Typography component="h2">What is AI Character Swap?</Typography>

            <Typography component="p">
              AI Character Swap (powered by models like WAN 2.2 and Kling) lets you take any video and transfer the movement to a completely new character or scene. The AI analyzes:
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FeatureItem>Body movements, poses, and gestures</FeatureItem>
              <FeatureItem>Facial expressions and lip synchronization</FeatureItem>
              <FeatureItem>Camera movement and perspective</FeatureItem>
              <FeatureItem>Timing and rhythm of the original performance</FeatureItem>
            </Box>

            <Typography component="p">
              The result? A seamless transformation that looks like it was filmed that way. You can turn yourself into a cartoon character, swap genders, change ethnicities, or create entirely fictional personas—all while keeping the natural human movement.
            </Typography>

            <TipBox title="Why It Works">
              The human eye is incredibly sensitive to unnatural movement. Traditional deepfakes often look "off" because they only swap faces. Motion control transfers the entire performance, making the result far more believable and engaging.
            </TipBox>

            <SectionDivider />

            {/* The 3 Modes */}
            <Typography component="h2">The 3 Swap Modes</Typography>

            <Typography component="p">
              Gruvi offers three different AI Character Swap modes, each powered by different AI models and optimized for different use cases:
            </Typography>

            <ModeCard
              title="1. Replace Character (WAN 2.2)"
              bestFor="Best for: Character swaps while keeping the original environment"
              description="Swaps the character while preserving the original background and setting. Powered by WAN 2.2 for seamless integration. Perfect for corporate videos, testimonials, or when the environment is important to the story."
            />

            <ModeCard
              title="2. Replace Character + Environment (WAN 2.2)"
              bestFor="Best for: Completely new worlds and creative transformations"
              description="Transfers motion to a new character in an entirely new environment. Also powered by WAN 2.2. Ideal for fantasy content, brand mascots, or when you want to tell a story in a different setting."
            />

            <ModeCard
              title="3. Replace + Custom Prompt (Kling)"
              bestFor="Best for: Complex motion, perfect lip sync, stylized content"
              description="Our highest quality option using Kling's advanced motion control. Supports up to 30 seconds and handles complex movements, dancing, and detailed lip synchronization. Add a custom prompt to control the style and environment."
            />

            <TipBox title="Which Mode Should I Use?">
              Start with Replace Character (WAN 2.2) for quick swaps. Use Replace + Environment for creative content with new backgrounds. Choose Kling when quality matters most or you need custom prompts—ideal for ads or professional content. Note: Kling mode is limited to 30 seconds.
            </TipBox>

            <SectionDivider />

            {/* Step by Step */}
            <Typography component="h2">How to Create Your First Character Swap</Typography>

            <Typography component="h3">Step 1: Choose Your Source Video</Typography>
            <Typography component="p">
              The source video determines the motion that will be transferred. For best results:
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FeatureItem>Clear shot of a single person (multiple people can confuse the AI)</FeatureItem>
              <FeatureItem>Full body or upper body clearly visible</FeatureItem>
              <FeatureItem>Good lighting without harsh shadows</FeatureItem>
              <FeatureItem>Keep it under 30 seconds for optimal processing</FeatureItem>
              <FeatureItem>Avoid rapid camera movements or scene changes</FeatureItem>
            </Box>

            <Typography component="h3">Step 2: Select or Create Your Character</Typography>
            <Typography component="p">
              You have two options: use an existing AI asset from your library, or describe a new character with a text prompt. The AI will generate a front-facing reference image automatically.
            </Typography>

            <TipBox title="Character Prompt Tips">
              Be specific about appearance: "A friendly cartoon turtle with a green shell and big expressive eyes, full body, front facing" works better than just "a turtle."
            </TipBox>

            <Typography component="h3">Step 3: Choose Your Mode</Typography>
            <Typography component="p">
              Select the mode that fits your creative vision. Remember: Replace Character (WAN 2.2) keeps the background, Replace + Environment creates a new scene, and Kling mode offers custom prompts and highest quality for videos up to 30 seconds.
            </Typography>

            <Typography component="h3">Step 4: Optional - Add Voice Change</Typography>
            <Typography component="p">
              If you're changing the character's gender, age, or species, consider enabling voice transformation. This keeps the original delivery and timing while changing the voice characteristics for a seamless audio-visual match.
            </Typography>

            <Typography component="h3">Step 5: Generate and Download</Typography>
            <Typography component="p">
              Hit generate and wait for processing—typically 3-20 minutes depending on video length. Quality takes time! Once complete, download in HD and share directly to your social platforms.
            </Typography>

            <SectionDivider />

            {/* Pro Tips */}
            <Typography component="h2">Pro Tips for Viral Content</Typography>

            <Box sx={{ mb: 3 }}>
              <FeatureItem><strong>Use trending audio:</strong> Pair your character swap with popular songs or sounds for maximum reach</FeatureItem>
              <FeatureItem><strong>Unexpected transformations:</strong> The more surprising the swap, the more shares it gets</FeatureItem>
              <FeatureItem><strong>Keep it short:</strong> 10-15 seconds performs best on TikTok and Reels</FeatureItem>
              <FeatureItem><strong>Show the before/after:</strong> People love seeing the transformation</FeatureItem>
              <FeatureItem><strong>Hook in first 2 seconds:</strong> Start with the most impressive moment</FeatureItem>
              <FeatureItem><strong>Post consistently:</strong> Test different character styles to find what resonates</FeatureItem>
            </Box>

            <TipBox title="Content Ideas That Go Viral">
              Celebrity impressions, historical figure recreations, brand mascot takeovers, "POV: you're a..." trends, cartoon versions of real conversations, and unexpected character reveals all perform exceptionally well.
            </TipBox>

            <SectionDivider />

            {/* Use Cases */}
            <Typography component="h2">Popular Use Cases</Typography>

            <Typography component="h3">Content Creators</Typography>
            <Typography component="p">
              Build a faceless brand, create character-based content series, or add variety to your feed without showing your face. Many successful creators use AI character swaps to maintain privacy while building engaged audiences.
            </Typography>

            <Typography component="h3">Brands & Marketing</Typography>
            <Typography component="p">
              Create brand mascot content, localize ads for different markets (swap characters to match demographics), or produce UGC-style content at scale without hiring influencers.
            </Typography>

            <Typography component="h3">Entertainment & Memes</Typography>
            <Typography component="p">
              The meme potential is unlimited. Put historical figures in modern situations, create "what if" scenarios, or build entirely fictional character universes.
            </Typography>

            <SectionDivider />

            {/* CTA Box */}
            <Box
              sx={{
                mt: 6,
                p: 4,
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(78, 205, 196, 0.15) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Ready to Create?
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Start making AI character swaps in minutes. No technical skills required.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => isLoggedIn ? navigate('/motion-capture') : handleOpenAuth()}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' },
                }}
              >
                Try AI Character Swap
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bottom CTA section */}
      <Box sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        zIndex: 1,
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, color: '#fff', mb: 2 }}>
            Explore More AI Tools
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, fontSize: '1.1rem', maxWidth: 500, mx: 'auto' }}>
            Character swap is just one of many AI creation tools available on Gruvi.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              px: 5,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                boxShadow: '0 6px 24px rgba(139, 92, 246, 0.5)',
              },
            }}
          >
            See All Features
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default MotionControlViralContent;
