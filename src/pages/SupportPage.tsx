import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import { faqItems } from './FAQPage';

const SupportPage: React.FC = () => {
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  // Function to handle accordion change
  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:admin@wbtechventures.com';
  };

  // Filter FAQs by category
  const filteredFAQs = activeCategory
    ? faqItems.filter(item => item.category === activeCategory)
    : faqItems;

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
            flexShrink: 0,
            animation: 'iconEntrance 0.5s ease-out',
            '@keyframes iconEntrance': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.5) rotate(-10deg)',
              },
              '50%': {
                transform: 'scale(1.1) rotate(5deg)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1) rotate(0deg)',
              },
            },
          }}
        >
          <HeadsetMicIcon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
            Support & FAQ
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Get help and find answers to your questions
          </Typography>
        </Box>
      </Box>

      {/* Main Content Paper */}
      <Paper sx={{
        borderRadius: '16px',
        bgcolor: '#1E1E22',
        border: '1px solid rgba(255,255,255,0.06)',
        p: 3,
      }}>
        {/* Contact Support Section */}
        <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                Contact Support
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                We typically respond within 24 hours
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleEmailClick}
              startIcon={<EmailIcon />}
              sx={{
                borderRadius: '10px',
                px: 3,
                py: 1.25,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                  boxShadow: '0 6px 16px rgba(0,122,255,0.4)',
                }
              }}
            >
              Email Support Team
            </Button>
          </Box>
        </Box>

        {/* FAQ Section */}
        <Box>
          {/* FAQ Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
              Frequently Asked Questions
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
              Everything you need to know about Gruvi
            </Typography>
          </Box>

          {/* Category Filters */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            <Button
              variant={activeCategory === null ? 'contained' : 'text'}
              onClick={() => setActiveCategory(null)}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                px: 2,
                py: 0.75,
                fontWeight: 500,
                fontSize: '0.85rem',
                minWidth: 'auto',
                ...(activeCategory === null ? {
                  backgroundColor: '#007AFF',
                  color: '#fff',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#007AFF',
                    boxShadow: 'none',
                  }
                } : {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#fff !important',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  }
                })
              }}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? 'contained' : 'text'}
                onClick={() => setActiveCategory(category)}
                sx={{
                  borderRadius: '100px',
                  textTransform: 'none',
                  px: 2,
                  py: 0.75,
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  minWidth: 'auto',
                  ...(activeCategory === category ? {
                    backgroundColor: '#007AFF',
                    color: '#fff',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#007AFF',
                      boxShadow: 'none',
                    }
                  } : {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff !important',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.12)',
                    }
                  })
                }}
              >
                {category}
              </Button>
            ))}
          </Box>

          {/* FAQ Count */}
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontSize: '0.85rem' }}>
            Showing {filteredFAQs.length} of {faqItems.length} questions
          </Typography>

          {/* FAQ Accordions */}
          <Box>
            {filteredFAQs.map((item, index) => {
              const panelId = `faq-${index}`;
              return (
                <Accordion
                  key={index}
                  expanded={expandedPanel === panelId}
                  onChange={handleAccordionChange(panelId)}
                  sx={{
                    mb: 1.5,
                    borderRadius: '12px !important',
                    '&:before': {
                      display: 'none',
                    },
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.06)',
                    },
                    '&.Mui-expanded': {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(0,122,255,0.3)',
                      boxShadow: '0 4px 12px rgba(0,122,255,0.15)',
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#007AFF' }} />}
                    sx={{
                      px: 2.5,
                      '& .MuiAccordionSummary-content': {
                        my: 1.5,
                        flexDirection: 'column',
                        gap: 0.25,
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        color: '#007AFF',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {item.category}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: '#fff',
                        fontSize: '0.95rem'
                      }}
                    >
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.7,
                        fontSize: '0.9rem'
                      }}
                    >
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SupportPage;
