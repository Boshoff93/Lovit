import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SEO } from '../utils/seoHelper';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const privacyStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Gruvi",
    "description": "Privacy Policy for Gruvi - AI Music & Video Creation Platform. Learn about how we collect, use, and protect your personal information.",
    "publisher": {
      "@type": "Organization",
      "name": "Gruvi",
      "url": "https://gruvimusic.com"
    },
    "datePublished": "2024-01-01",
    "dateModified": "2026-01-02"
  };

  return (
    <>
      <SEO
        title="Privacy Policy - Gruvi"
        description="Privacy Policy for Gruvi - AI Music & Video Creation Platform. Learn about how we collect, use, and protect your personal information."
        keywords="privacy policy, data protection, user privacy, personal information, Gruvi privacy, AI music, video creation"
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
            Last updated: January 2, 2026
          </Typography>

          <Typography variant="h6" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect the following types of information:
          </Typography>
          <ul>
            <li>Account information (email, username, password)</li>
            <li>Profile information (name)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>User-generated content (uploaded images, AI-generated songs, music videos, thumbnails)</li>
            <li>Usage data and analytics</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use your information to:
          </Typography>
          <ul>
            <li>Generate AI music and videos based on your prompts and uploaded content</li>
            <li>Provide and improve our services</li>
            <li>Process your payments and manage credits</li>
            <li>Communicate with you about your account</li>
            <li>Ensure the security of our services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            3. Data Storage and Security
          </Typography>
          <Typography variant="body1" paragraph>
            We store your data securely using industry-standard practices including encrypted storage on AWS. Your generated content (songs, videos, images) is stored securely and only accessible to you unless you choose to share it.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph>
            We use third-party services including:
          </Typography>
          <ul>
            <li>Payment processors (Stripe)</li>
            <li>Authentication providers (Google Sign-In)</li>
            <li>Cloud storage providers (AWS S3)</li>
            <li>AI generation services (Fal AI, Minimax)</li>
            <li>Analytics services</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            5. YouTube Integration
          </Typography>
          <Typography variant="body1" paragraph>
            If you choose to connect your YouTube account, we request access to:
          </Typography>
          <ul>
            <li>Upload videos to your channel on your behalf</li>
            <li>Set custom thumbnails on uploaded videos</li>
            <li>View your channel name and profile picture</li>
          </ul>
          <Typography variant="body1" paragraph>
            We only upload content when you explicitly click "Upload to YouTube". You can disconnect your YouTube account at any time from your settings. We store your YouTube OAuth tokens securely and encrypted. We do not access your existing YouTube videos or any other YouTube data beyond what is necessary for uploads.
          </Typography>
          <Typography variant="body1" paragraph>
            Google's use and transfer of information received from Google APIs adheres to the{' '}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>, including the Limited Use requirements.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Cookies and Tracking
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to improve your experience and analyze usage patterns. You can control cookie settings through your browser.
          </Typography>

          <Typography variant="h6" gutterBottom>
            7. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data and generated content</li>
            <li>Disconnect connected accounts (YouTube, Google)</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            8. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </Typography>

          <Typography variant="h6" gutterBottom>
            9. Changes to Privacy Policy
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