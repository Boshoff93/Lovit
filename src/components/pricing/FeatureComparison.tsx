import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { gruviGradients } from '../../index';

interface ComparisonFeature {
  name: string;
  category?: string;
  starter: string | boolean;
  scale: string | boolean;
  beast: string | boolean;
}

const defaultFeatures: ComparisonFeature[] = [
  // Token Allocation
  { name: 'AI Media Tokens/month', category: 'Tokens', starter: '5,000', scale: '20,000', beast: '50,000' },

  // Content Creation
  { name: 'AI Songs/month', category: 'Creation', starter: '~250', scale: '~1,000', beast: '~2,500' },
  { name: 'Promo Videos/month', category: 'Creation', starter: '~50', scale: '~200', beast: '~500' },
  { name: 'Cinematic Videos/month', category: 'Creation', starter: '~5', scale: '~20', beast: '~50' },

  // Features
  { name: 'AI Music Generation', category: 'Features', starter: true, scale: true, beast: true },
  { name: 'Commercial License', category: 'Features', starter: true, scale: true, beast: true },
  { name: 'Social Media Scheduling', category: 'Features', starter: true, scale: true, beast: true },
  { name: 'Priority Generation', category: 'Features', starter: false, scale: true, beast: true },
  { name: 'Dedicated Support', category: 'Features', starter: false, scale: false, beast: true },
];

interface FeatureComparisonProps {
  features?: ComparisonFeature[];
  defaultExpanded?: boolean;
  darkMode?: boolean;
}

/**
 * FeatureComparison - Expandable accordion with side-by-side feature comparison table
 */
const FeatureComparison: React.FC<FeatureComparisonProps> = ({
  features = defaultFeatures,
  defaultExpanded = false,
  darkMode = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderValue = (value: string | boolean, tierColor: string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircleIcon sx={{ color: '#34C759', fontSize: 22 }} />
      ) : (
        <RemoveCircleOutlineIcon sx={{ color: darkMode ? 'rgba(255,255,255,0.3)' : '#C7C7CC', fontSize: 22 }} />
      );
    }
    return (
      <Typography sx={{ fontWeight: 600, color: tierColor, fontSize: '0.9rem' }}>
        {value}
      </Typography>
    );
  };

  const tierColors = {
    starter: '#3B82F6',
    scale: '#EC4899',
    beast: '#EF4444',
  };

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    const category = feature.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, ComparisonFeature[]>);

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Chip
          label="DETAILED COMPARISON"
          size="small"
          sx={{
            mb: 2,
            background: darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
            color: '#A78BFA',
            fontWeight: 600,
            fontSize: '0.7rem',
            height: 26,
            borderRadius: '100px',
            letterSpacing: '0.05em',
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            fontWeight: 700,
            fontFamily: '"Fredoka", "Nunito", sans-serif',
            color: darkMode ? '#fff' : '#141418',
            mb: 1,
          }}
        >
          Compare Plans{' '}
          <Box component="span" sx={{
            background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Side by Side
          </Box>
        </Typography>
        <Typography
          sx={{
            fontSize: '1rem',
            color: darkMode ? 'rgba(255,255,255,0.6)' : '#48484A',
            maxWidth: '500px',
            mx: 'auto',
          }}
        >
          Get a detailed overview of what each plan offers
        </Typography>
      </Box>

      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          background: darkMode ? 'rgba(20, 20, 28, 0.95)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px !important',
          border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: darkMode ? '0 4px 24px rgba(0, 0, 0, 0.4)' : '0 4px 24px rgba(0, 0, 0, 0.06)',
          '&:before': { display: 'none' },
          '&.Mui-expanded': {
            margin: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: darkMode ? '#A78BFA' : '#007AFF' }} />}
          sx={{
            px: 3,
            py: 1,
            '& .MuiAccordionSummary-content': {
              my: 2,
            },
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: darkMode ? '#fff' : '#141418' }}>
            Compare All Features
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ px: { xs: 1, sm: 3 }, pb: 3 }}>
          <TableContainer>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? 'rgba(255,255,255,0.5)' : '#86868B',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: darkMode ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(0, 0, 0, 0.08)',
                      width: { xs: '40%', sm: '35%' },
                    }}
                  >
                    Feature
                  </TableCell>
                  {['Starter', 'Scale', 'Content Engine'].map((tier, index) => (
                    <TableCell
                      key={tier}
                      align="center"
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        borderBottom: darkMode ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <Box
                        sx={{
                          background: Object.values(gruviGradients)[index + 3], // starter, scale, beast gradients
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {tier}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                  <React.Fragment key={category}>
                    {/* Category header */}
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{
                          pt: 2.5,
                          pb: 1,
                          px: 1,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: darkMode ? 'rgba(255,255,255,0.5)' : '#86868B',
                          borderBottom: 'none',
                          background: 'transparent',
                        }}
                      >
                        {category}
                      </TableCell>
                    </TableRow>

                    {/* Features in category */}
                    {categoryFeatures.map((feature, idx) => (
                      <TableRow
                        key={feature.name}
                        sx={{
                          '&:hover': {
                            background: darkMode ? 'rgba(139, 92, 246, 0.05)' : 'rgba(0, 122, 255, 0.03)',
                          },
                          animation: expanded
                            ? `fadeInRow 0.3s ease ${idx * 50}ms forwards`
                            : 'none',
                          opacity: expanded ? 1 : 0,
                          '@keyframes fadeInRow': {
                            from: { opacity: 0, transform: 'translateY(10px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            color: darkMode ? 'rgba(255,255,255,0.9)' : '#141418',
                            borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)',
                            py: 1.5,
                          }}
                        >
                          {feature.name}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)',
                            py: 1.5,
                          }}
                        >
                          {renderValue(feature.starter, tierColors.starter)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)',
                            py: 1.5,
                          }}
                        >
                          {renderValue(feature.scale, tierColors.scale)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)',
                            py: 1.5,
                          }}
                        >
                          {renderValue(feature.beast, tierColors.beast)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FeatureComparison;
