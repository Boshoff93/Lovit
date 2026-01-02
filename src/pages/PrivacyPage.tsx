import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SEO } from '../utils/seoHelper';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const privacyStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Lovit",
    "description": "Privacy Policy for Lovit - AI Fashion Platform. Learn about how we collect, use, and protect your personal information.",
    "publisher": {
      "@type": "Organization",
      "name": "Gruvi",
      "url": "https://gruvimusic.com"
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString()
  };

  return (
    <>
      <SEO
        title="Privacy Policy - Lovit"
        description="Privacy Policy for Lovit - AI Fashion Platform. Learn about how we collect, use, and protect your personal information."
        keywords="privacy policy, data protection, user privacy, personal information, Lovit privacy"
        ogType="website"
        structuredData={privacyStructuredData}
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
            Privacy Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h6" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect the following types of information:
          </Typography>
          <ul>
            <li>Account information (email, username, password)</li>
            <li>Profile information (name, gender, age, etc.)</li>
            <li>Payment information (processed securely through our payment provider)</li>
            <li>User-generated content (photos, models, generated images)</li>
            <li>Usage data and analytics</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use your information to:
          </Typography>
          <ul>
            <li>Provide and improve our services</li>
            <li>Process your payments</li>
            <li>Communicate with you about your account</li>
            <li>Ensure the security of our services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            3. Data Storage and Security
          </Typography>
          <Typography variant="body1" paragraph>
            We store your data securely using industry-standard practices. While we implement reasonable security measures, no system is completely secure, and we cannot guarantee absolute security.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph>
            We use third-party services including:
          </Typography>
          <ul>
            <li>Payment processors (Stripe)</li>
            <li>Authentication providers (Google)</li>
            <li>Cloud storage providers (AWS)</li>
            <li>Analytics services</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            5. Cookies and Tracking
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to improve your experience and analyze usage patterns. You can control cookie settings through your browser.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            7. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </Typography>

          <Typography variant="h6" gutterBottom>
            8. Changes to Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2">
              For any questions about our Privacy Policy, please contact us at{' '}
              <a href="mailto:admin@wbtechventures.com">admin@wbtechventures.com</a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default PrivacyPage; 