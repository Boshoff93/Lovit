import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Grid from '@mui/material/Grid';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: string;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4;
}

/**
 * FeatureGrid - Marketing-focused feature showcase with larger cards
 * Designed for professional landing page appearance like Followr.ai
 */
const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  title,
  subtitle,
  columns = 3,
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 2:
        return { xs: 12, sm: 6 };
      case 4:
        return { xs: 12, sm: 6, md: 3 };
      case 3:
      default:
        return { xs: 12, sm: 6, md: 4 };
    }
  };

  const gridCols = getGridCols();

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        {(title || subtitle) && (
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            {title && (
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                  fontWeight: 700,
                  color: '#1D1D1F',
                  mb: 2,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
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
            )}
          </Box>
        )}

        {/* Feature Cards Grid */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {features.map((feature, index) => (
            <Grid size={gridCols} key={index}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  height: '100%',
                  borderRadius: '20px',
                  background: '#fff',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp 0.5s ease ${index * 80}ms forwards`,
                  opacity: 0,
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
                    borderColor: 'rgba(78, 205, 196, 0.3)',
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    background: feature.gradient || 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)',
                    '& svg': {
                      fontSize: 28,
                      color: '#fff',
                    },
                  }}
                >
                  {feature.icon}
                </Box>

                {/* Title */}
                <Typography
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    fontWeight: 600,
                    color: '#1D1D1F',
                    mb: 1.5,
                    lineHeight: 1.3,
                  }}
                >
                  {feature.title}
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    fontSize: '0.95rem',
                    color: '#48484A',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureGrid;
