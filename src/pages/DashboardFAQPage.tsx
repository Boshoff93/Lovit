import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate, useLocation } from 'react-router-dom';
import { faqItems } from './FAQPage';

const DashboardFAQPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accordionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  // Function to create a URL-friendly slug from a question
  const createSlug = useCallback((question: string): string => {
    return question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, []);

  // Handle hash changes and expand the corresponding accordion
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const index = faqItems.findIndex(item => createSlug(item.question) === hash);
      if (index !== -1) {
        setExpandedPanel(createSlug(faqItems[index].question));
        if (accordionRefs.current[index]) {
          setTimeout(() => {
            accordionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }
  }, [location.hash, createSlug]);

  // Function to handle accordion change
  const handleAccordionChange = useCallback((panel: string) => (_event: React.SyntheticEvent | null, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
    // Update hash without navigating away from the current page
    if (isExpanded) {
      window.history.replaceState(null, '', `#${panel}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // Function to handle read more click
  const handleReadMore = useCallback((question: string) => {
    const slug = createSlug(question);
    navigate(`/faq/${slug}`);
  }, [navigate, createSlug]);

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
          <HelpOutlineIcon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
            Help & FAQ
          </Typography>
          <Typography sx={{ color: '#86868B' }}>
            Everything you need to know about Gruvi
          </Typography>
        </Box>
      </Box>

      {/* Category Filter Card */}
      <Card sx={{ mb: 3, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 650, mx: 'auto' }}>
            <Chip
              label="All"
              onClick={() => setActiveCategory(null)}
              sx={{
                fontWeight: 500,
                borderRadius: '20px',
                px: 0.5,
                ...(activeCategory === null ? {
                  background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                  color: '#fff',
                } : {
                  background: 'rgba(0,0,0,0.05)',
                  color: '#1D1D1F',
                  '&:hover': { background: 'rgba(0,122,255,0.1)' }
                })
              }}
            />
            {categories.map(category => (
              <Chip
                key={category}
                label={category}
                onClick={() => setActiveCategory(category)}
                sx={{
                  fontWeight: 500,
                  borderRadius: '20px',
                  px: 0.5,
                  ...(activeCategory === category ? {
                    background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                    color: '#fff',
                  } : {
                    background: 'rgba(0,0,0,0.05)',
                    color: '#1D1D1F',
                    '&:hover': { background: 'rgba(0,122,255,0.1)' }
                  })
                }}
              />
            ))}
          </Box>
          <Typography sx={{ color: '#86868B', mt: 2, fontSize: '0.85rem', textAlign: 'center' }}>
            Showing {filteredFAQs.length} of {faqItems.length} questions
          </Typography>
        </CardContent>
      </Card>

      {/* FAQ List Card */}
      <Card sx={{ mb: 3, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredFAQs.map((item, index) => {
              const panelId = createSlug(item.question);
              const globalIndex = faqItems.findIndex(faq => faq.question === item.question);
              return (
                <Paper
                  key={index}
                  elevation={0}
                  ref={(el: HTMLDivElement | null) => {
                    accordionRefs.current[globalIndex] = el;
                  }}
                  id={panelId}
                  sx={{
                    p: 2.5,
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: expandedPanel === panelId ? '#007AFF' : 'rgba(0,0,0,0.08)',
                    background: expandedPanel === panelId
                      ? 'rgba(0,122,255,0.02)'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#007AFF',
                      background: 'rgba(0,122,255,0.02)',
                    }
                  }}
                  onClick={() => handleAccordionChange(panelId)(null, expandedPanel !== panelId)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          color: '#007AFF',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          mb: 0.5
                        }}
                      >
                        {item.category}
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 600, color: '#1D1D1F' }}
                      >
                        {item.question}
                      </Typography>
                    </Box>
                    <ExpandMoreIcon
                      sx={{
                        color: '#007AFF',
                        transition: 'transform 0.2s',
                        transform: expandedPanel === panelId ? 'rotate(180deg)' : 'rotate(0deg)',
                        ml: 1,
                      }}
                    />
                  </Box>
                  {expandedPanel === panelId && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        sx={{ color: '#86868B', lineHeight: 1.7, mb: 2, fontSize: '0.9rem' }}
                      >
                        {item.answer}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="text"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReadMore(item.question);
                          }}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            color: '#007AFF',
                            '&:hover': {
                              background: 'rgba(0,122,255,0.05)',
                            }
                          }}
                        >
                          Read Full Answer
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Contact Support Card */}
      <Card sx={{ borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <EmailIcon sx={{ fontSize: '1.25rem', color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Still Have Questions?
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                Can't find what you're looking for? Our support team is here to help.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={() => window.location.href = 'mailto:support@gruvi.ai'}
            sx={{
              borderRadius: '10px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              width: { xs: '100%', sm: 'auto' },
              background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0066DD, #4AB8F0)',
                boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
              }
            }}
          >
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardFAQPage;
