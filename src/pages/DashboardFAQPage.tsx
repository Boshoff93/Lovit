import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
    if (isExpanded) {
      navigate(`/faq#${panel}`, { replace: true });
    }
  }, [navigate]);

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
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '100vh',
      pt: 4,
      pb: { xs: 4, sm: 8 },
      px: 0
    }}>
      <Container maxWidth="md" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        p: 0
      }}>
        <Card sx={{ 
          width: '100%', 
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          overflow: 'visible',
          position: 'relative',
          mt: 4,
        }}>
          <CardContent sx={{ p: 0 }}>
            {/* Header with icon */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              pt: { xs: 5, sm: 6 },
              pb: { xs: 3, sm: 4 },
              position: 'relative'
            }}>
              <Box 
                sx={{ 
                  width: { xs: 80, sm: 100 }, 
                  height: { xs: 80, sm: 100 }, 
                  mb: 2,
                  position: 'absolute',
                  top: { xs: -40, sm: -50 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src="/gruvi-faq.png"
                  alt="FAQ"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Box sx={{ mt: 7, textAlign: 'center' }}>
                <Typography 
                  variant="h5"
                  fontWeight="600"
                  gutterBottom
                >
                  Frequently Asked Questions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Everything you need to know about Gruvi
                </Typography>
              </Box>
            </Box>
            
            <Divider />

            {/* Category Filter */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Chip
                  label="All"
                  onClick={() => setActiveCategory(null)}
                  sx={{
                    fontWeight: 500,
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
              <Typography sx={{ textAlign: 'center', color: '#86868B', mt: 2, fontSize: '0.85rem' }}>
                Showing {filteredFAQs.length} of {faqItems.length} questions
              </Typography>
            </Box>

            <Divider />

            {/* FAQ List */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
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
                      p: { xs: 2, sm: 3 },
                      mb: 2,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: expandedPanel === panelId ? 'primary.main' : 'divider',
                      background: expandedPanel === panelId 
                        ? 'linear-gradient(135deg, rgba(0,122,255,0.02) 0%, rgba(0,122,255,0.05) 100%)'
                        : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.light',
                        background: 'rgba(0,122,255,0.02)',
                      }
                    }}
                    onClick={() => handleAccordionChange(panelId)(null, expandedPanel !== panelId)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                          variant="subtitle1" 
                          fontWeight={600}
                          sx={{ color: '#1D1D1F' }}
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
                          mt: 0.5
                        }} 
                      />
                    </Box>
                    {expandedPanel === panelId && (
                      <Box sx={{ mt: 2 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ color: '#86868B', lineHeight: 1.7, mb: 2 }}
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

            <Divider />

            {/* Contact Support */}
            <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                Still Have Questions?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Can't find what you're looking for? Our support team is here to help.
              </Typography>
              <Button 
                variant="contained"
                onClick={() => window.location.href = 'mailto:support@gruvi.ai'}
                sx={{ 
                  borderRadius: '100px',
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                  boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0066DD, #4AB8F0)',
                    boxShadow: '0 6px 20px rgba(0,122,255,0.4)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                Contact Support
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default DashboardFAQPage;

