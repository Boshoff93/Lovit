import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SEO } from '../utils/seoHelper';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  const termsStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service - Gruvi",
    "description": "Terms of Service for Gruvi - AI Music & Video Creation Platform. Learn about our terms, conditions, and user agreements.",
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
        title="Terms of Service - Gruvi"
        description="Terms of Service for Gruvi - AI Music & Video Creation Platform. Learn about our terms, conditions, and user agreements."
        keywords="terms of service, user agreement, terms and conditions, Gruvi terms, service agreement, AI music, video creation"
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
            Terms of Service for Gruvi
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated: January 5, 2026
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontWeight: 'bold', bgcolor: 'rgba(0,122,255,0.05)', p: 2, borderRadius: 1, mb: 3 }}>
            These Terms of Service ("Terms") govern your use of <strong>Gruvi</strong>, an AI-powered music and video creation platform operated by WB Tech Ventures. Gruvi is accessible via the website gruvimusic.com and associated services. By accessing or using Gruvi, you agree to be bound by these Terms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using Gruvi ("the Service", "the App", or "Gruvi"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use Gruvi.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Description of Service
          </Typography>
          <Typography variant="body1" paragraph>
            Gruvi provides AI-powered music and video creation services. Users can generate original songs with custom lyrics, create music videos, promotional videos for products and apps, and publish content to social media platforms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. User Accounts
          </Typography>
          <Typography variant="body1" paragraph>
            To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Credits and Payments
          </Typography>
          <Typography variant="body1" paragraph>
            The Service uses a credit-based system. Credits are purchased and used to generate songs, videos, and other content. All credit purchases are non-refundable. We reserve the right to modify credit pricing at any time with notice to users.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. User Content and Ownership
          </Typography>
          <Typography variant="body1" paragraph>
            You retain ownership of any content you upload (images, product photos, app screenshots) and the AI-generated content created using the Service (songs, videos, thumbnails). By using the Service, you grant us a license to use, store, and process your content as necessary to provide the Service.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Third-Party Platform Integration
          </Typography>
          <Typography variant="body1" paragraph>
            Gruvi allows you to connect third-party social media accounts (including YouTube, TikTok, Instagram, Facebook, and LinkedIn) to publish your created content. When you connect these accounts:
          </Typography>
          <ul>
            <li>You authorize Gruvi to upload content on your behalf when you explicitly request it</li>
            <li>You are responsible for ensuring your content complies with each platform's terms of service</li>
            <li>You can disconnect these accounts at any time from your Gruvi settings</li>
            <li>Gruvi only accesses these platforms when you explicitly request to publish content</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            7. Prohibited Uses
          </Typography>
          <Typography variant="body1" paragraph>
            You agree not to use the Service for any illegal or unauthorized purpose, including but not limited to:
          </Typography>
          <ul>
            <li>Creating harmful, offensive, or illegal content</li>
            <li>Generating content that infringes on intellectual property rights</li>
            <li>Creating deepfakes or misleading content without consent</li>
            <li>Attempting to gain unauthorized access to the Service</li>
            <li>Uploading content you don't have rights to use</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            8. AI-Generated Content
          </Typography>
          <Typography variant="body1" paragraph>
            Content generated by our AI systems is created based on your prompts and inputs. While we strive for high quality, we cannot guarantee that AI-generated content will be free from errors, biases, or unintended outputs. You are responsible for reviewing all generated content before publishing or sharing.
          </Typography>

          <Typography variant="h6" gutterBottom>
            9. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these terms at any time. We will notify users of any material changes. Continued use of the Service after changes constitutes acceptance of the new terms.
          </Typography>

          <Typography variant="h6" gutterBottom>
            10. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            The Service is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service, including but not limited to issues with AI-generated content, third-party platform integrations, or service interruptions.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2">
              For any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:admin@wbtechventures.com">admin@wbtechventures.com</a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default TermsPage;