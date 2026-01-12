import React, { useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
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
      background: 'linear-gradient(180deg, #0D0D0F 0%, #0F0F14 50%, #0D0D0F 100%)',
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
          sx={{
            mb: 1,
            px: 1,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': {
              background: 'rgba(255,255,255,0.05)',
              color: '#FFFFFF',
            }
          }}
        >
          Back to FAQ
        </Button>

        <Breadcrumbs sx={{ mb: 3, px: 1 }}>
          <Link
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.6)',
              '&:hover': { color: '#3B82F6' }
            }}
          >
            Home
          </Link>
          <Link
            component={RouterLink}
            to="/faq"
            sx={{
              textDecoration: 'none',
              color: 'rgba(255,255,255,0.6)',
              '&:hover': { color: '#3B82F6' }
            }}
          >
            FAQ
          </Link>
          <Typography sx={{ fontSize: '0.875rem', color: '#FFFFFF' }}>
            {faqItem.question.length > 50 ? `${faqItem.question.substring(0, 50)}...` : faqItem.question}
          </Typography>
        </Breadcrumbs>

        <Box
          component="article"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 600,
              color: '#FFFFFF',
              mb: 4,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
            }}
          >
            {faqItem.question}
          </Typography>

          <Typography
            variant="body1"
            component="div"
            sx={{
              color: 'rgba(255,255,255,0.6)',
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
                  color: 'rgba(255,255,255,0.6)',
                  '& strong': {
                    color: '#FFFFFF',
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
            Ready to Create Music with AI?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255,255,255,0.6)', fontSize: { xs: '1rem', md: '1.1rem' } }}>
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
            Start Creating Free
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQQuestionPage; 
