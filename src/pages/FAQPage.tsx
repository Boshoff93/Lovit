import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { SEO, createFAQStructuredData, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

export { distributionFaq as faqItems } from "../config/distributionFaq";
import { distributionFaq as faqItems } from "../config/distributionFaq";

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accordionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { currentSong } = useAudioPlayer();
  
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
        // Don't filter by category when expanding - just show the question in context
        if (accordionRefs.current[index]) {
        setTimeout(() => {
            accordionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          }
      }
    }
  }, [location.hash, createSlug]);

  // Function to handle accordion change
  const handleAccordionChange = useCallback((panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
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

  // Create breadcrumb data for structured data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://agentgruvi.com/' },
    { name: 'FAQ', url: 'https://agentgruvi.com/faq' }
  ];

  // Filter FAQs by category
  const filteredFAQs = activeCategory 
    ? faqItems.filter(item => item.category === activeCategory)
    : faqItems;

  // Always show the full-page standalone style (Fable-like)
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0D0D0F 0%, #0F0F14 50%, #0D0D0F 100%)',
      position: 'relative',
      pb: currentSong ? { xs: 10, sm: 12, md: 14 } : 0,
      transition: 'padding-bottom 0.3s ease-out',
    }}>
      {/* Subtle background gradient */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SEO
        title="Gruvi FAQ | Social Publishing, Scheduling & MCP"
        description="Get help with Gruvi channel connections, video uploads, scheduling, publishing plans, analytics and MCP setup for agents."
        keywords="Gruvi FAQ, social publishing help, social media scheduling, MCP setup, publishing API, Gruvi pricing"
        ogTitle="Gruvi FAQ | Publishing and Agent Setup"
        ogDescription="Answers about distributing your finished content through Gruvi, from channel setup to scheduling and delivery status."
        ogType="website"
        ogUrl="https://agentgruvi.com/faq"
        canonicalUrl="https://agentgruvi.com/faq"
        twitterTitle="Gruvi FAQ | Publishing and Agent Setup"
        twitterDescription="Get help with social publishing, account connections, publishing plans and agent access in Gruvi."
        structuredData={[
          createFAQStructuredData(faqItems),
          createBreadcrumbStructuredData(breadcrumbData)
        ]}
      />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              '&:hover': { color: '#3B82F6' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Gruvi
          </Link>
          <Typography sx={{ fontWeight: 500, color: '#FFFFFF' }}>FAQ</Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBackIcon />}
          color="inherit"
          onClick={() => navigate('/')}
          sx={{
            mb: 4,
            color: '#fff',
            '&:hover': {
              background: 'rgba(255,255,255,0.08)',
            }
          }}
        >
          Back to Home
        </Button>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#FFFFFF',
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
            Get help with uploads, connected channels, scheduling and publishing through Gruvi.
          </Typography>
        </Box>

        {/* Category Filter */}
        {/* Category Filters - Two Rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center', mb: 5 }}>
          {/* Row 1 */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="text"
              color="inherit"
              onClick={() => setActiveCategory(null)}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                px: 3,
                py: 1,
                fontWeight: 500,
                color: '#fff !important',
                transition: 'all 0.2s ease',
                ...(activeCategory === null ? {
                  backgroundColor: '#007AFF',
                  '&:hover': {
                    backgroundColor: '#007AFF',
                  }
                } : {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  }
                })
              }}
            >
              All Questions
            </Button>
            {categories.slice(0, 5).map(category => (
              <Button
                key={category}
                variant="text"
                color="inherit"
                onClick={() => setActiveCategory(category)}
                sx={{
                  borderRadius: '100px',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  color: '#fff !important',
                  transition: 'all 0.2s ease',
                  ...(activeCategory === category ? {
                    backgroundColor: '#007AFF',
                    '&:hover': {
                      backgroundColor: '#007AFF',
                    }
                  } : {
                    backgroundColor: 'rgba(255,255,255,0.08)',
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
          {/* Row 2 */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.slice(5).map(category => (
              <Button
                key={category}
                variant="text"
                color="inherit"
                onClick={() => setActiveCategory(category)}
                sx={{
                  borderRadius: '100px',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  color: '#fff !important',
                  transition: 'all 0.2s ease',
                  ...(activeCategory === category ? {
                    backgroundColor: '#007AFF',
                    '&:hover': {
                      backgroundColor: '#007AFF',
                    }
                  } : {
                    backgroundColor: 'rgba(255,255,255,0.08)',
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
        </Box>

        {/* FAQ Count */}
        <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', mb: 4, fontSize: '0.9rem' }}>
          Showing {filteredFAQs.length} of {faqItems.length} questions
        </Typography>

        {/* FAQ Accordions */}
        <Box
          component="section"
          sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {filteredFAQs.map((item, index) => {
            const panelId = createSlug(item.question);
            const globalIndex = faqItems.findIndex(faq => faq.question === item.question);
            return (
            <Accordion
              key={index}
              component="article"
              ref={(el: HTMLDivElement | null) => {
                  accordionRefs.current[globalIndex] = el;
              }}
                id={panelId}
                expanded={expandedPanel === panelId}
                onChange={handleAccordionChange(panelId)}
              sx={{
                background: 'transparent',
                borderBottom: index !== filteredFAQs.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                boxShadow: 'none',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  margin: 0,
                  background: 'rgba(59, 130, 246, 0.05)',
                },
              }}
            >
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#3B82F6' }} />}
                aria-label={`Toggle answer for ${item.question}`}
                sx={{
                    padding: '20px 24px',
                  '& .MuiAccordionSummary-content': {
                      margin: 0,
                      flexDirection: 'column',
                      gap: 0.5,
                    },
                    transition: 'background 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.02)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#3B82F6',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.category}
                  </Typography>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                      fontWeight: 600,
                      color: '#FFFFFF',
                      fontSize: { xs: '1rem', md: '1.1rem' }
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
                <AccordionDetails sx={{ padding: '0 24px 24px 24px' }}>
                <Typography
                  variant="body1"
                  component="p"
                  sx={{
                      color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.8,
                    mb: 2
                  }}
                >
                  {item.answer}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                      variant="text"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => handleReadMore(item.question)}
                    sx={{
                      textTransform: 'none',
                        fontWeight: 500,
                        color: '#3B82F6',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(59, 130, 246, 0.1)',
                          transform: 'translateX(4px)',
                        }
                      }}
                    >
                      Read Full Answer
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
            );
          })}
        </Box>

        {/* CTA Footer */}
        <Box
          sx={{
            mt: 6,
            p: 5,
            borderRadius: '20px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            Still Have Questions?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255,255,255,0.6)', fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Can't find what you're looking for? Our support team is here to help.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
              size="large"
              onClick={() => window.location.href = 'mailto:admin@wbtechventures.com'}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 600,
                background: '#3B82F6',
                color: '#FFFFFF',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#2563EB',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                }
              }}
            >
              Contact Support
            </Button>
            <Button
              variant="outlined"
            size="large"
            onClick={() => navigate('/')}
            endIcon={<ArrowForwardIcon />}
            sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                borderRadius: '100px',
              textTransform: 'none',
                fontWeight: 600,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderColor: '#3B82F6',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Start Creating
          </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQPage; 
