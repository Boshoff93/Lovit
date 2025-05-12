import React, { useCallback, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  useTheme,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { SEO, createFAQStructuredData } from '../utils/seoHelper';

const faqItems = [
  {
    question: "What is Lovit?",
    answer: "Lovit is an AI-powered virtual try-on platform that allows you to create realistic AI models of yourself and try on any outfit virtually. You can generate professional-quality photos in any setting, perfect for fashion shopping, social media content, or professional headshots."
  },
  {
    question: "How does Lovit work?",
    answer: "Simply upload 10-20 photos of yourself (or anyone else), and our AI will create a hyper-realistic model. Once your model is ready, you can upload any outfit you want to try on, and our AI will generate realistic photos of you wearing those clothes in any setting you choose."
  },
  {
    question: "How many photos do I need to create my AI model?",
    answer: "We recommend uploading 10-20 photos for the best results. The photos should be clear, well-lit, and show different angles of your face. The more variety in your photos, the better your AI model will be."
  },
  {
    question: "Can I try on any outfit?",
    answer: "Yes! You can try on any outfit by uploading a photo of the clothing item. This works for everything from wedding dresses to casual wear, and you can see exactly how it looks on you before making a purchase."
  },
  {
    question: "How long does it take to create my AI model?",
    answer: "Creating your AI model takes only 1-2 minutes with premium settings. After that, you can generate unlimited high-quality photos instantly!"
  },
  {
    question: "What's the difference between the plans?",
    answer: "We offer three plans: Starter, Pro, and Premium. The main differences are in the number of AI photos you can generate, the number of AI models you can create, the quality of the photos, and the number of parallel generations you can run. Check our pricing page for detailed comparisons."
  },
  {
    question: "Can I download the generated images?",
    answer: "Yes! All generated images can be downloaded in high resolution. Once downloaded, you have full rights to use them for personal or commercial purposes."
  },
  {
    question: "Can I share my generated images on social media?",
    answer: "Absolutely! You can share your generated images on any social media platform. The images are yours to use and share as you wish."
  },
  {
    question: "What are the licensing terms for the generated images?",
    answer: "Once you download an image, it's free to use for both personal and commercial purposes. You own the rights to the generated images and can use them however you like."
  },
  {
    question: "What should I do if I get a missing token error?",
    answer: "If you encounter a missing token error, try logging out of your account and logging back in. If the issue persists, please contact our support team at admin@trylovit.com for assistance."
  },
  {
    question: "How can I get more help or support?",
    answer: "For any additional questions or support, please email us at admin@trylovit.com. Our team is here to help you get the most out of your Lovit experience."
  }
];

const FAQPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const accordionRefs = useRef<Array<HTMLDivElement | null>>([]);

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
      if (index !== -1 && accordionRefs.current[index]) {
        const element = accordionRefs.current[index];
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add a small delay to ensure the element is in view before expanding
        setTimeout(() => {
          const accordion = element?.querySelector('.MuiAccordion-root');
          if (accordion) {
            (accordion as HTMLElement).click();
          }
        }, 100);
      }
    }
  }, [location.hash, createSlug]);

  // Function to handle accordion click and update URL
  const handleAccordionClick = useCallback((question: string) => {
    const slug = createSlug(question);
    navigate(`/faq#${slug}`, { replace: true });
  }, [navigate, createSlug]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <SEO
        title="Frequently Asked Questions - Lovit AI Fashion Platform"
        description="Get answers to all your questions about Lovit's AI fashion platform. Learn about virtual try-on, AI model creation, pricing plans, and how to get started with our revolutionary fashion technology."
        keywords="Lovit FAQ, AI fashion, virtual try-on, AI model creation, fashion technology, virtual fitting room, wedding dress try-on, AI headshots, fashion app"
        ogTitle="Frequently Asked Questions - Lovit AI Fashion Platform"
        ogDescription="Get answers to all your questions about Lovit's AI fashion platform. Learn about virtual try-on, AI model creation, pricing plans, and how to get started."
        ogType="website"
        ogUrl="https://trylovit.com/faq"
        twitterTitle="Frequently Asked Questions - Lovit AI Fashion Platform"
        twitterDescription="Get answers to all your questions about Lovit's AI fashion platform. Learn about virtual try-on, AI model creation, pricing plans, and how to get started."
        structuredData={createFAQStructuredData(faqItems)}
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 4 }}
        >
          Back
        </Button>

        <Paper 
          elevation={0} 
          component="section"
          sx={{ 
            p: 3, 
            borderRadius: 3,
            backgroundColor: 'transparent'
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{fontSize: { xs: '2rem', md: '2.5rem' }, mb: 4 }}>
            Frequently Asked Questions
          </Typography>
          {faqItems.map((item, index) => (
            <Accordion 
              key={index}
              component="article"
              ref={(el: HTMLDivElement | null) => {
                accordionRefs.current[index] = el;
              }}
              id={createSlug(item.question)}
              onChange={() => handleAccordionClick(item.question)}
              sx={{ 
                mb: 2,
                borderRadius: '8px !important',
                '&:before': {
                  display: 'none',
                },
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label={`Toggle answer for ${item.question}`}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    my: 1,
                  }
                }}
              >
                <Typography 
                  variant="h2" 
                  component="h2"
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography 
                  variant="body1" 
                  component="p"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    lineHeight: 1.7
                  }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQPage; 
