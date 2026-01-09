import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import FAQIcon from '@mui/icons-material/QuestionAnswer';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useNavigate } from 'react-router-dom';

const SupportPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEmailClick = () => {
    window.location.href = 'mailto:admin@wbtechventures.com';
  };

  const handleFAQClick = () => {
    navigate('/faq');
  };

  const faqItems = [
    {
      question: 'How do I create a character for my music video?',
      answer: 'Go to Create, select "Character", and upload a reference photo. You can customize their name and details before adding them to your videos.'
    },
    {
      question: 'How do credits work?',
      answer: 'Credits are used to generate songs and music videos. Each song costs credits, and your credits refresh monthly based on your subscription tier.'
    },
    {
      question: 'What are the subscription tiers?',
      answer: 'We offer Starter, Pro, and Premium tiers. Each tier comes with different monthly credit allowances and features.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'Go to your Account Settings, and select Manage Subscription. You will be able to cancel your subscription through the Stripe portal.'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.'
    },
    {
      question: 'How do I verify my email?',
      answer: 'Check your inbox for a verification email and click the verification link. If the link expired you will automatically be navigated to reset password page.'
    }
  ];

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SupportAgentIcon sx={{ color: '#fff', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F', mb: 0.5 }}>
            Support
          </Typography>
          <Typography sx={{ color: '#86868B' }}>
            Get help and find answers to your questions
          </Typography>
        </Box>
      </Box>

      {/* Contact Support Card */}
      <Card sx={{ mb: 3, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' }}>
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
                Contact Support
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                We typically respond within 24 hours
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<EmailIcon />}
            onClick={handleEmailClick}
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
            Email Support Team
          </Button>
        </CardContent>
      </Card>

      {/* FAQ Section Card */}
      <Card sx={{ mb: 3, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #AF52DE, #BF5AF2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FAQIcon sx={{ fontSize: '1.25rem', color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  Frequently Asked Questions
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                  Quick answers to common questions
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<FAQIcon />}
              onClick={handleFAQClick}
              sx={{
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                borderColor: '#007AFF',
                color: '#007AFF',
                '&:hover': {
                  borderColor: '#0066DD',
                  backgroundColor: 'rgba(0,122,255,0.05)',
                }
              }}
            >
              View All FAQs
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {faqItems.map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#007AFF',
                    backgroundColor: 'rgba(0,122,255,0.02)',
                  }
                }}
              >
                <Typography sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                  {item.question}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#86868B', lineHeight: 1.6 }}>
                  {item.answer}
                </Typography>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SupportPage;
