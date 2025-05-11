import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Grid,
  Card,
  CardContent,
  Divider,
  useTheme,
  Avatar
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FAQIcon from '@mui/icons-material/QuestionAnswer';
import { useNavigate } from 'react-router-dom';

const SupportPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleEmailClick = () => {
    window.location.href = 'mailto:admin@trylovit.com';
  };

  const handleFAQClick = () => {
    navigate('/faq');
  };

  const faqItems = [
    {
      question: 'How do I create an AI model?',
      answer: 'Click "Create New Model" in the left drawers. Follow the step-by-step guide to set up your model.'
    },
    {
      question: 'What are the subscription tiers?',
      answer: 'We offer Starter, Pro, and Premium tiers. Each tier comes with different features and usage limits.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'Go to your Account Settings, and select Manage Subscription. You will be able to cancel your subscription through stripe portal.'
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
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              pt: { xs: 5, sm: 6 },
              pb: { xs: 3, sm: 4 },
              position: 'relative'
            }}>
              <Avatar 
                sx={{ 
                  width: { xs: 100, sm: 120 }, 
                  height: { xs: 100, sm: 120 }, 
                  mb: 2,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  position: 'absolute',
                  backgroundColor: 'secondary.light',
                  top: { xs: -50, sm: -60 }
                }}
              >
                <SupportAgentIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Avatar>
              <Box sx={{ mt: 7, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Support Center
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
                  We're here to help! Get in touch with our support team or browse our FAQ section.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<FAQIcon />}
                  onClick={handleFAQClick}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3
                  }}
                >
                  View All FAQs
                </Button>
              </Box>
            </Box>

            <Divider />

            <Box sx={{ p: { xs: 3, sm: 4 }}}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  backgroundColor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  mb: 4
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Contact Support</Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<EmailIcon />}
                  onClick={handleEmailClick}
                  sx={{ 
                    py: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    fontWeight: 600,
                    maxWidth: '400px',
                    mx: 'auto',
                    display: 'flex',
                    
                  }}
                >
                  Email Support Team
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  We typically respond within 24 hours
                </Typography>
              </Paper>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Frequently Asked Questions
              </Typography>
              <Grid container spacing={2}>
                {faqItems.map((item, index) => (
                  <Grid size={12} key={index}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: { xs: 2, sm: 2.5 },
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {item.question}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.answer}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  startIcon={<FAQIcon />}
                  onClick={handleFAQClick}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5
                  }}
                >
                  View All FAQs
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SupportPage; 