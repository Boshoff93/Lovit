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
    "description": "Privacy Policy for Gruvi - Music & Video Creation Platform. Learn about how we collect, use, and protect your personal information.",
    "publisher": {
      "@type": "Organization",
      "name": "Gruvi",
      "url": "https://gruvimusic.com"
    },
    "datePublished": "2024-01-01",
    "dateModified": "2026-01-06"
  };

  return (
    <>
      <SEO
        title="Privacy Policy - Gruvi"
        description="Privacy Policy for Gruvi - Music & Video Creation Platform. Learn about how we collect, use, and protect your personal information."
        keywords="privacy policy, data protection, user privacy, personal information, Gruvi privacy, music, video creation"
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
            Privacy Policy for Gruvi
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated: January 6, 2026
          </Typography>

          <Typography variant="body1" paragraph>
            This Privacy Policy describes how <strong>Gruvi</strong> ("we", "us", or "our"), operated by WB Tech Ventures, collects, uses, and protects your personal information when you use the Gruvi application and website (gruvimusic.com). By using Gruvi, you agree to the collection and use of information in accordance with this policy.
          </Typography>

          <Typography variant="body1" paragraph>
            Gruvi's use and transfer of information received from Google APIs adheres to the{' '}
            <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
              Google API Services User Data Policy
            </a>, including the Limited Use requirements.
          </Typography>

          <Typography variant="h6" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            When you use Gruvi, we collect the following types of information:
          </Typography>
          <ul>
            <li>Account information (email, username, password)</li>
            <li>Profile information (name)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>User-generated content (images you upload, text prompts you enter, generated songs, music videos, and thumbnails)</li>
            <li>Usage data and analytics</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use your information to:
          </Typography>
          <ul>
            <li>Generate music and videos based on your prompts and uploaded content</li>
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
            4. Third-Party Services and Data Flows
          </Typography>
          <Typography variant="body1" paragraph>
            We use third-party services to provide our platform. Each service receives only the specific data required for its function. Our systems are designed to keep data flows segregated.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Content Generation Services (Features and Labels)
          </Typography>
          <Typography variant="body1" paragraph>
            We use Features and Labels as our infrastructure provider to generate music, videos, and images. Features and Labels receives only:
          </Typography>
          <ul>
            <li>Text prompts you type into the app (e.g., "create an upbeat pop song about summer")</li>
            <li>Images you manually upload from your device</li>
          </ul>
          <Typography variant="body1" paragraph>
            Features and Labels does not receive any data from social media platforms, authentication providers, or any connected accounts. There is no data pipeline between social platform APIs and content generation services.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Payment Processing (Stripe)
          </Typography>
          <Typography variant="body1" paragraph>
            Stripe processes your payment information. We do not store your full credit card details on our servers.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Cloud Storage (AWS S3)
          </Typography>
          <Typography variant="body1" paragraph>
            Your generated content (songs, videos, thumbnails) is stored securely on AWS S3.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Analytics Services
          </Typography>
          <Typography variant="body1" paragraph>
            We use analytics to understand how users interact with our platform. This data is anonymized and aggregated.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            5. Social Media Platform Integrations
          </Typography>
          <Typography variant="body1" paragraph>
            Gruvi allows you to connect social media accounts to publish your created content. Each integration is optional and can be disconnected at any time. All integrations are one-way: we send your generated content to these platforms when you request it. We do not retrieve content from these platforms to use elsewhere.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Google Sign-In
          </Typography>
          <Typography variant="body1" paragraph>
            If you choose to sign in with Google, we receive your email address and name for account authentication. This data is stored securely on our servers and is used only for login purposes. It is not shared with content generation services or any other third party.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            YouTube Integration
          </Typography>
          <Typography variant="body1" paragraph>
            If you connect your YouTube account, we request access to:
          </Typography>
          <ul>
            <li>Upload videos to your channel on your behalf (youtube.upload scope)</li>
            <li>View your channel name and profile picture (youtube.readonly scope)</li>
          </ul>
          <Typography variant="body1" paragraph>
            We only upload content when you explicitly click "Upload to YouTube." This is a one-way transfer from our servers to YouTube. We do not retrieve videos or data from your YouTube account. YouTube data is never sent to content generation services or any other third party. You can disconnect your YouTube account at any time from your settings.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            TikTok Integration
          </Typography>
          <Typography variant="body1" paragraph>
            If you connect your TikTok account, we request access to:
          </Typography>
          <ul>
            <li>Post videos to your TikTok account on your behalf</li>
            <li>View your TikTok username and profile picture</li>
          </ul>
          <Typography variant="body1" paragraph>
            We only post content when you explicitly request it. This is a one-way transfer. We do not retrieve videos or data from your TikTok account. TikTok data is never sent to content generation services or any other third party. You can disconnect your TikTok account at any time.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Instagram Integration
          </Typography>
          <Typography variant="body1" paragraph>
            If you connect your Instagram account, we request access to:
          </Typography>
          <ul>
            <li>Post Reels to your Instagram account on your behalf</li>
            <li>View your Instagram username and profile picture</li>
          </ul>
          <Typography variant="body1" paragraph>
            We only post content when you explicitly request it. This is a one-way transfer. We do not retrieve posts or data from your Instagram account. Instagram data is never sent to content generation services or any other third party. You can disconnect your Instagram account at any time.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Facebook Integration
          </Typography>
          <Typography variant="body1" paragraph>
            If you connect your Facebook account, we request access to post videos to your Facebook page on your behalf. We only post content when you explicitly request it. This is a one-way transfer. We do not retrieve posts or data from your Facebook account. Facebook data is never sent to content generation services or any other third party. You can disconnect your Facebook account at any time.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Music Streaming Platforms (Spotify, Apple Music, Amazon Music, SoundCloud)
          </Typography>
          <Typography variant="body1" paragraph>
            If you choose to distribute your music to streaming platforms, we facilitate the upload of your generated music. This is a one-way transfer. We do not retrieve data from these platforms. Streaming platform data is never sent to content generation services or any other third party.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            6. Data Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell, rent, or trade your personal information to third parties. We share data only as follows:
          </Typography>
          <ul>
            <li><strong>Content Generation:</strong> Text prompts you enter and images you upload are sent to Features and Labels to generate content. No social media data, authentication data, or data from connected accounts is sent to content generation services.</li>
            <li><strong>Social Platforms:</strong> When you choose to publish content, we send your generated videos/music to the platform you select. This is always user-initiated and one-way.</li>
            <li><strong>Payment Processing:</strong> Payment details are sent to Stripe to process transactions.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.</li>
          </ul>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            7. Cookies and Tracking
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to improve your experience and analyze usage patterns. You can control cookie settings through your browser.
          </Typography>

          <Typography variant="h6" gutterBottom>
            8. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data and generated content</li>
            <li>Disconnect any connected social media accounts</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <Typography variant="h6" gutterBottom>
            9. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </Typography>

          <Typography variant="h6" gutterBottom>
            10. Changes to Privacy Policy
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
