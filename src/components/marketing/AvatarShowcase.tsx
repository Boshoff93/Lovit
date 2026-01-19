import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

interface Avatar {
  id: string;
  name: string;
  image: string;
  type: string;
  tags?: string[];
}

const defaultAvatars: Avatar[] = [
  { id: '1', name: 'Emma', image: '/avatars/emma.jpg', type: 'Human', tags: ['Female', 'Professional'] },
  { id: '2', name: 'Marcus', image: '/avatars/marcus.jpg', type: 'Human', tags: ['Male', 'Creative'] },
  { id: '3', name: 'Sakura', image: '/avatars/sakura.jpg', type: 'Anime', tags: ['Female', 'Anime'] },
  { id: '4', name: 'Robo', image: '/avatars/robo.jpg', type: 'Non-Human', tags: ['Robot', '3D'] },
  { id: '5', name: 'Luna', image: '/avatars/luna.jpg', type: 'Human', tags: ['Female', 'Artistic'] },
  { id: '6', name: 'Alex', image: '/avatars/alex.jpg', type: 'Human', tags: ['Unisex', 'Modern'] },
];

interface AvatarShowcaseProps {
  avatars?: Avatar[];
  title?: string;
  subtitle?: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  maxDisplay?: number;
}

/**
 * AvatarShowcase - Marketing-focused grid display for AI avatars/characters
 * Designed to look professional like Followr.ai instead of app-like
 */
const AvatarShowcase: React.FC<AvatarShowcaseProps> = ({
  avatars = defaultAvatars,
  title = 'Create AI Avatars for Your Videos',
  subtitle = 'Use consistent characters across all your content. Human, anime, 3D, and more.',
  showCTA = true,
  ctaText = 'Explore All Avatars',
  ctaLink = '/ai-assets-landing',
  maxDisplay = 6,
}) => {
  const displayAvatars = avatars.slice(0, maxDisplay);

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, position: 'relative' }}>
      {/* Background accent */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: 700,
              color: '#141418',
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.15rem' },
              color: '#48484A',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/* Avatar Grid */}
        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
          {displayAvatars.map((avatar, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 4, lg: 2 }} key={avatar.id}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#fff',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  animation: `fadeInUp 0.5s ease ${index * 80}ms forwards`,
                  opacity: 0,
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.2)',
                    '& .avatar-overlay': {
                      opacity: 1,
                    },
                    '& .avatar-image': {
                      transform: 'scale(1.05)',
                    },
                  },
                }}
              >
                {/* Avatar Image */}
                <Box
                  sx={{
                    aspectRatio: '1',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Box
                    className="avatar-image"
                    component="img"
                    src={avatar.image}
                    alt={avatar.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = '/avatars/placeholder.jpg';
                    }}
                  />

                  {/* Hover Overlay */}
                  <Box
                    className="avatar-overlay"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      pb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: 28, color: '#141418', ml: 0.5 }} />
                    </Box>
                  </Box>
                </Box>

                {/* Avatar Info */}
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#141418',
                      mb: 0.5,
                    }}
                  >
                    {avatar.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#86868B',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {avatar.type}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* CTA Button */}
        {showCTA && (
          <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}>
            <Button
              component={RouterLink}
              to={ctaLink}
              variant="outlined"
              sx={{
                borderColor: 'rgba(139, 92, 246, 0.5)',
                color: '#8B5CF6',
                px: 4,
                py: 1.5,
                borderRadius: '100px',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: '#8B5CF6',
                  background: 'rgba(139, 92, 246, 0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {ctaText}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AvatarShowcase;
