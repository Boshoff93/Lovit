import React, { useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { faqItems } from './FAQPage';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const FAQQuestionPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { question } = useParams<{ question: string }>();
  const { currentSong } = useAudioPlayer();

  // Function to create a URL-friendly slug from a question
  const createSlug = useCallback((question: string): string => {
    return question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, []);

  // Find the FAQ item based on the slug
  const faqItem = faqItems.find(item => createSlug(item.question) === question);

  useEffect(() => {
    if (!faqItem) {
      navigate('/faq');
    }
  }, [faqItem, navigate]);

  if (!faqItem) {
    return null;
  }

  // Create breadcrumb data for structured data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://gruvimusic.com/' },
    { name: 'FAQ', url: 'https://gruvimusic.com/faq' },
    { name: faqItem.question, url: `https://gruvimusic.com/faq/${question}` }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      pb: currentSong ? { xs: 10, sm: 12, md: 14 } : 0,
      transition: 'padding-bottom 0.3s ease-out',
    }}>
      <SEO
        title={`${faqItem.question} - Gruvi FAQ`}
        description={faqItem.answer}
        keywords={`Gruvi FAQ, AI music generator, music video creator, promo video maker, product video, Airbnb video, ${faqItem.category.toLowerCase()}`}
        ogTitle={`${faqItem.question} - Gruvi FAQ`}
        ogDescription={faqItem.answer}
        ogType="article"
        ogUrl={`https://gruvimusic.com/faq/${question}`}
        canonicalUrl={`https://gruvimusic.com/faq/${question}`}
        twitterTitle={`${faqItem.question} - Gruvi FAQ`}
        twitterDescription={faqItem.answer}
        structuredData={[
          createBreadcrumbStructuredData(breadcrumbData),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
              "@type": "Question",
              "name": faqItem.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faqItem.detailedAnswer || faqItem.answer
              }
            }]
          }
        ]}
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/faq')}
          sx={{ mb: 1, px: 1 }}
        >
          Back to FAQ
        </Button>

        <Breadcrumbs sx={{ mb: 3, px: 1 }}>
          <Link component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none' }}>
            Home
          </Link>
          <Link component={RouterLink} to="/faq" color="inherit" sx={{ textDecoration: 'none' }}>
            FAQ
          </Link>
          <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
            {faqItem.question.length > 50 ? `${faqItem.question.substring(0, 50)}...` : faqItem.question}
          </Typography>
        </Breadcrumbs>

        <Paper 
          elevation={0} 
          component="article"
          sx={{ 
            p: { xs: 3, md: 4 }, 
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' }, 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 4,
              lineHeight: 1.3,
            }}
          >
            {faqItem.question}
          </Typography>
          
                    <Typography 
            variant="body1" 
            component="div"
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.8,
            }}
          >
            {faqItem.detailedAnswer.split('\n\n').map((paragraph, index) => (
              <Typography 
                key={index} 
                component="p" 
                sx={{ 
                  mb: 2.5,
                  whiteSpace: 'pre-wrap',
                  '& strong': {
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                  }
                }}
                dangerouslySetInnerHTML={{ 
                  __html: paragraph.trim()
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br />')
                }}
              />
            ))}
          </Typography>
        </Paper>

        {/* CTA Footer */}
        <Paper 
          elevation={0} 
          sx={{ 
            mt: 6, 
            p: 5, 
            borderRadius: 4,
            background: 'linear-gradient(145deg, rgba(0,122,255,0.05), rgba(0,122,255,0.1))',
            border: '1px solid rgba(0,122,255,0.15)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            Ready to Create Music with AI?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#86868B', fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Join thousands of creators making amazing music and music videos with Gruvi.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/')}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              py: 1.5,
              px: 5,
              fontSize: '1rem',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              background: '#1D1D1F',
              '&:hover': {
                background: '#000',
              }
            }}
          >
            Start Creating Free
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQQuestionPage; 
