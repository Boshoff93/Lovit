import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SEO } from '../utils/seoHelper';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  const termsStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - Lovit",
    "description": "Terms of Service for Lovit - AI Fashion Platform. Learn about our terms, conditions, and user agreements.",
    "publisher": {
      "@type": "Organization",
      "name": "Lovit",
      "url": "https://trylovit.com"
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString()
  };

  return (
    <>
      <SEO
        title="Terms of Service - Lovit"
        description="Terms of Service for Lovit - AI Fashion Platform. Learn about our terms, conditions, and user agreements."
        keywords="terms of service, user agreement, terms and conditions, Lovit terms, service agreement"
        ogType="website"
        structuredData={termsStructuredData}
      />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Terms of Service
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using Lovit ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Description of Service
          </Typography>
          <Typography variant="body1" paragraph>
            Lovit provides AI-powered image generation and model creation services. Users can create AI models, generate images, and try on virtual clothing.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. User Accounts
          </Typography>
          <Typography variant="body1" paragraph>
            To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Subscription and Payments
          </Typography>
          <Typography variant="body1" paragraph>
            The Service offers various subscription tiers. All payments are non-refundable. We reserve the right to modify subscription fees at any time with notice to users.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. User Content
          </Typography>
          <Typography variant="body1" paragraph>
            You retain ownership of any content you upload or create using the Service. By using the Service, you grant us a license to use, store, and process your content as necessary to provide the Service.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Prohibited Uses
          </Typography>
          <Typography variant="body1" paragraph>
            You agree not to use the Service for any illegal or unauthorized purpose, including but not limited to:
          </Typography>
          <ul>
            <li>Creating harmful or offensive content</li>
            <li>Violating intellectual property rights</li>
            <li>Attempting to gain unauthorized access to the Service</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            7. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these terms at any time. We will notify users of any material changes. Continued use of the Service after changes constitutes acceptance of the new terms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            8. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            The Service is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2">
              For any questions about these Terms of Service, please contact us at{' '}
              <Link to="/contact">admin@trylovit.com</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default TermsPage; 