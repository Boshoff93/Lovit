import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  primaryButtonAction?: () => void;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  variant?: 'gradient' | 'light' | 'dark' | 'orange' | 'green';
  /** Custom gradient background - overrides variant background */
  gradientBackground?: string;
}

/**
 * CTASection - Marketing call-to-action section
 * Professional design matching Followr.ai style
 */
const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryButtonText = 'Get Started Free',
  primaryButtonLink,
  primaryButtonAction,
  secondaryButtonText,
  secondaryButtonLink,
  variant = 'gradient',
  gradientBackground,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return {
          background: 'linear-gradient(180deg, #0D0D0F 0%, #1A1A2E 50%, #0D0D0F 100%)',
          titleColor: '#fff',
          subtitleColor: 'rgba(255,255,255,0.8)',
        };
      case 'light':
        return {
          background: '#fff',
          titleColor: '#1D1D1F',
          subtitleColor: '#48484A',
        };
      case 'orange':
        return {
          background: 'linear-gradient(135deg, #0D0D0F 0%, #1A1A2E 100%)',
          titleColor: '#fff',
          subtitleColor: 'rgba(255,255,255,0.8)',
        };
      case 'green':
        return {
          background: 'linear-gradient(135deg, #0D0D0F 0%, #0F1A14 50%, #1A1A2E 100%)',
          titleColor: '#fff',
          subtitleColor: 'rgba(255,255,255,0.8)',
        };
      case 'gradient':
      default:
        return {
          background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
          titleColor: '#fff',
          subtitleColor: 'rgba(255,255,255,0.9)',
        };
    }
  };

  const styles = getVariantStyles();

  const PrimaryButton = () => {
    const getButtonStyles = () => {
      if (variant === 'gradient') {
        return {
          background: '#fff',
          color: '#06B6D4',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          hoverShadow: '0 8px 32px rgba(0,0,0,0.2)',
        };
      }
      if (variant === 'orange') {
        return {
          background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%) !important',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
          hoverShadow: '0 8px 32px rgba(249, 115, 22, 0.5)',
        };
      }
      if (variant === 'green') {
        return {
          background: 'linear-gradient(135deg, #22C55E 0%, #10B981 100%) !important',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
          hoverShadow: '0 8px 32px rgba(34, 197, 94, 0.5)',
        };
      }
      return {
        background: 'linear-gradient(135deg, #3B82F6 0%, #22D3EE 100%) !important',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
        hoverShadow: '0 8px 32px rgba(59, 130, 246, 0.5)',
      };
    };

    const btnStyles = getButtonStyles();
    const buttonStyles = {
      background: btnStyles.background,
      color: btnStyles.color,
      px: { xs: 4, sm: 5 },
      py: { xs: 1.5, sm: 1.75 },
      borderRadius: '100px',
      fontWeight: 600,
      textTransform: 'none' as const,
      fontSize: { xs: '1rem', sm: '1.1rem' },
      boxShadow: btnStyles.boxShadow,
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: btnStyles.hoverShadow,
      },
    };

    if (primaryButtonLink) {
      return (
        <Button
          component={RouterLink}
          to={primaryButtonLink}
          variant="contained"
          sx={buttonStyles}
        >
          {primaryButtonText}
        </Button>
      );
    }

    return (
      <Button
        variant="contained"
        onClick={primaryButtonAction}
        sx={buttonStyles}
      >
        {primaryButtonText}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: gradientBackground || styles.background,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements for gradient variant */}
      {variant === 'gradient' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '50%',
              height: '200%',
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-30%',
              left: '-10%',
              width: '40%',
              height: '150%',
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      {/* Decorative elements for orange variant */}
      {variant === 'orange' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '40%',
              height: '100%',
              background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.12) 0%, transparent 60%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '-10%',
              width: '35%',
              height: '80%',
              background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.08) 0%, transparent 60%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      {/* Decorative elements for green variant */}
      {variant === 'green' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '40%',
              height: '150%',
              background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.15) 0%, transparent 60%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '35%',
              height: '120%',
              background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, transparent 60%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: 700,
              color: styles.titleColor,
              mb: 2,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          {/* Subtitle */}
          {subtitle && (
            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: styles.subtitleColor,
                maxWidth: '500px',
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <PrimaryButton />

            {secondaryButtonText && secondaryButtonLink && (
              <Button
                component={RouterLink}
                to={secondaryButtonLink}
                variant="outlined"
                sx={{
                  borderColor: variant === 'gradient' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.15)',
                  color: variant === 'gradient' ? '#fff' : '#1D1D1F',
                  px: { xs: 4, sm: 5 },
                  py: { xs: 1.5, sm: 1.75 },
                  borderRadius: '100px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    borderColor: variant === 'gradient' ? '#fff' : '#3B82F6',
                    background: variant === 'gradient' ? 'rgba(255,255,255,0.1)' : 'rgba(59, 130, 246, 0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {secondaryButtonText}
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
