import React from 'react';
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
import { useNavigate } from 'react-router-dom';

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

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 8,
      background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
    }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            left: { xs: 16, sm: 24 },
            top: 24,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Back
        </Button>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 6
          }}
        >
          Frequently Asked Questions
        </Typography>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            backgroundColor: 'transparent'
          }}
        >
          {faqItems.map((item, index) => (
            <Accordion 
              key={index}
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
                sx={{
                  '& .MuiAccordionSummary-content': {
                    my: 1,
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.text.primary
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography 
                  variant="body1" 
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