import React from 'react';
import { Box, Typography, Container, Button, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

interface MarketingSectionProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning';
  gradientTitle?: boolean;
  ctaText?: string;
  ctaLink?: string;
  background?: 'white' | 'gradient-subtle' | 'gradient-purple' | 'gradient-teal';
  align?: 'left' | 'center';
  id?: string;
  darkMode?: boolean;
}

/**
 * MarketingSection - Professional section wrapper with Followr.ai styling
 * Provides gradient backgrounds, animated badges, and enhanced typography
 */
const MarketingSection: React.FC<MarketingSectionProps> = ({
  children,
  title,
  subtitle,
  badge,
  badgeColor = 'primary',
  gradientTitle = false,
  ctaText,
  ctaLink,
  background = 'white',
  align = 'left',
  id,
  darkMode = false,
}) => {
  const getBackgroundStyles = () => {
    if (darkMode) {
      switch (background) {
        case 'gradient-subtle':
          return {
            background: 'linear-gradient(180deg, #0D0D0F 0%, #121218 40%, #0F0F14 100%)',
          };
        case 'gradient-purple':
          return {
            background: 'linear-gradient(180deg, #0F0A14 0%, #1A1028 40%, #140E1A 100%)',
          };
        case 'gradient-teal':
          return {
            background: 'linear-gradient(180deg, #0A1014 0%, #0E1820 40%, #0A1418 100%)',
          };
        case 'white':
        default:
          return {
            background: 'transparent',
          };
      }
    }
    switch (background) {
      case 'gradient-subtle':
        return {
          background: 'linear-gradient(180deg, rgba(78, 205, 196, 0.03) 0%, rgba(68, 160, 141, 0.05) 100%)',
          borderTop: '1px solid rgba(78, 205, 196, 0.1)',
          borderBottom: '1px solid rgba(78, 205, 196, 0.1)',
        };
      case 'gradient-purple':
        return {
          background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%)',
          borderTop: '1px solid rgba(139, 92, 246, 0.08)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.08)',
        };
      case 'gradient-teal':
        return {
          background: 'linear-gradient(180deg, rgba(78, 205, 196, 0.05) 0%, rgba(68, 160, 141, 0.08) 100%)',
          borderTop: '1px solid rgba(78, 205, 196, 0.15)',
          borderBottom: '1px solid rgba(78, 205, 196, 0.15)',
        };
      case 'white':
      default:
        return {
          background: 'transparent',
        };
    }
  };

  const getBadgeColor = () => {
    switch (badgeColor) {
      case 'secondary':
        return { bg: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' };
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22C55E' };
      case 'warning':
        return { bg: 'rgba(249, 115, 22, 0.1)', color: '#F97316' };
      case 'primary':
      default:
        return { bg: 'rgba(78, 205, 196, 0.12)', color: '#4ECDC4' };
    }
  };

  const bgStyles = getBackgroundStyles();
  const badgeColors = getBadgeColor();

  return (
    <Box
      id={id}
      sx={{
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        ...bgStyles,
      }}
    >
      {/* Decorative gradient orbs for non-white backgrounds */}
      {background !== 'white' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '-20%',
              right: '-5%',
              width: '30%',
              height: '60%',
              background: background === 'gradient-purple'
                ? 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.08) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(78, 205, 196, 0.1) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-10%',
              left: '-5%',
              width: '25%',
              height: '50%',
              background: background === 'gradient-purple'
                ? 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.06) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(68, 160, 141, 0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            textAlign: align,
            display: 'flex',
            flexDirection: 'column',
            alignItems: align === 'center' ? 'center' : 'flex-start',
          }}
        >
          {/* Badge */}
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                mb: 1.5,
                background: badgeColors.bg,
                color: badgeColors.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.02em',
                height: 26,
                borderRadius: '100px',
                animation: 'fadeInDown 0.4s ease forwards',
                '@keyframes fadeInDown': {
                  from: { opacity: 0, transform: 'translateY(-8px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            />
          )}

          {/* Title with optional gradient */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
              fontWeight: 700,
              mb: subtitle ? 1 : 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              ...(gradientTitle
                ? {
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 50%, #4ECDC4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }
                : {
                    color: darkMode ? '#FFFFFF' : '#1D1D1F',
                  }),
            }}
          >
            {title}
          </Typography>

          {/* Subtitle */}
          {subtitle && (
            <Typography
              sx={{
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                color: darkMode ? 'rgba(255,255,255,0.7)' : '#48484A',
                maxWidth: align === 'center' ? '600px' : '100%',
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* CTA Link */}
          {ctaText && ctaLink && (
            <Button
              component={RouterLink}
              to={ctaLink}
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                mt: 2,
                color: '#4ECDC4',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.9rem',
                px: 0,
                '&:hover': {
                  background: 'transparent',
                  color: '#44A08D',
                  '& .MuiSvgIcon-root': {
                    transform: 'translateX(4px)',
                  },
                },
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.2s ease',
                },
              }}
            >
              {ctaText}
            </Button>
          )}
        </Box>

        {/* Section Content */}
        {children}
      </Container>
    </Box>
  );
};

export default MarketingSection;
