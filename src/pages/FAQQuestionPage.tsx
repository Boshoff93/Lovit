import React, { useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';

const faqItems = [
  {
    question: "What is Lovit?",
    answer: "Lovit is an AI-powered virtual try-on platform that allows you to create realistic AI models of yourself and try on any outfit virtually. You can generate professional-quality photos in any setting, perfect for fashion shopping, social media content, or professional headshots.",
    detailedAnswer: "Lovit is a revolutionary AI-powered virtual try-on platform that transforms how you experience fashion. Using advanced artificial intelligence, Lovit allows you to create hyper-realistic digital models of yourself from just 10-20 photos. Once your AI model is created, you can virtually try on any outfit by simply uploading a photo of the clothing item. The platform generates professional-quality photos of you wearing those clothes in any setting you choose, from beach vacations to city streets to professional environments.\n\nThis technology is perfect for wedding dress shopping, exploring new styles, building social media content, creating professional headshots, or simply making confident fashion purchases. Lovit eliminates the need for expensive photoshoots and helps you avoid costly fashion mistakes by seeing exactly how clothes look on you before buying."
  },
  {
    question: "How does Lovit work?",
    answer: "Simply upload 10-20 photos of yourself (or anyone else), and our AI will create a hyper-realistic model. Once your model is ready, you can upload any outfit you want to try on, and our AI will generate realistic photos of you wearing those clothes in any setting you choose.",
    detailedAnswer: "Lovit works through a sophisticated AI pipeline that creates your digital twin. First, you upload 10-20 clear, well-lit photos of yourself from different angles. Our advanced AI algorithms analyze these images to understand your unique facial features, body proportions, and personal style. The AI then creates a hyper-realistic digital model that captures your likeness with incredible accuracy. Once your model is ready (which takes just 1-2 minutes), you can upload photos of any clothing item you want to try on, from wedding dresses to casual wear to business attire.\n\nOur AI then generates realistic photos of you wearing those clothes in any setting you specify. You can choose backgrounds like beach scenes, city streets, professional offices, or any other environment. The generated images are high-quality and suitable for social media, professional portfolios, or personal use. This technology eliminates the need for physical fitting rooms and expensive photoshoots."
  },
  {
    question: "How many photos do I need to create my AI model?",
    answer: "We recommend uploading 10-20 photos for the best results. The photos should be clear, well-lit, and show different angles of your face. The more variety in your photos, the better your AI model will be.",
    detailedAnswer: "For optimal AI model creation, we recommend uploading 10-20 high-quality photos of yourself. These photos should be clear, well-lit, and showcase different angles of your face and body. Include photos from various perspectives, front view, side views, and different expressions. Good lighting is crucial for the AI to accurately capture your features. Avoid heavily filtered or edited photos, as the AI works best with natural images.\n\nThe more variety in your photos (different hairstyles, expressions, lighting conditions), the more accurate and versatile your AI model will be. While you can create a model with fewer photos, 10-20 photos provide the best balance of accuracy and convenience. The AI uses these photos to understand your unique facial features, skin tone, hair texture, and overall appearance, ensuring the generated images look authentically like you."
  },
  {
    question: "Can I try on any outfit?",
    answer: "Yes! You can try on any outfit by uploading a photo of the clothing item. This works for everything from wedding dresses to casual wear, and you can see exactly how it looks on you before making a purchase.",
    detailedAnswer: "Absolutely! Lovit's virtual try-on technology works with any type of clothing or outfit. Simply upload a photo of the clothing item you want to try on, and our AI will generate realistic images of you wearing it. This works for everything from formal wedding dresses and business suits to casual jeans and summer dresses. You can try on swimsuits, activewear, evening gowns, streetwear, or any other fashion item.\n\nThe technology is particularly useful for expensive purchases like wedding dresses, where you want to see exactly how the garment looks on your body before making a significant investment. You can also try on multiple variations of the same item in different colors or styles. The AI maintains realistic proportions and fit, so you get an accurate representation of how the clothing would look on your actual body type. This eliminates the guesswork from online shopping and helps you make confident fashion decisions."
  },
  {
    question: "How long does it take to create my AI model?",
    answer: "Creating your AI model takes only 1-2 minutes with premium settings. After that, you can generate unlimited high-quality photos instantly!",
    detailedAnswer: "Creating your AI model is incredibly fast and efficient. With premium settings, your AI model is ready in just 1-2 minutes after you upload your photos. The process involves our advanced AI algorithms analyzing your uploaded images to understand your unique features and create a digital twin. Once your model is created, you can generate unlimited high-quality photos instantly. There's no waiting time for individual photo generations, they're produced immediately.\n\nThe speed and efficiency make Lovit perfect for quick fashion decisions, last-minute outfit planning, or creating content on demand. This rapid processing time sets Lovit apart from traditional AI image generation services that can take hours or days to produce results. The combination of fast model creation and instant photo generation means you can try on dozens of outfits in a single session, making it ideal for comprehensive wardrobe planning or shopping sprees."
  },
  {
    question: "What's the difference between the plans?",
    answer: "We offer three plans: Starter, Pro, and Premium. The main differences are in the number of AI photos you can generate, the number of AI models you can create, the quality of the photos, and the number of parallel generations you can run. Check our pricing page for detailed comparisons.",
    detailedAnswer: "Lovit offers three carefully designed plans to meet different needs and budgets. The Starter plan is perfect for beginners, offering 100 AI photos, 1 AI model, lower quality photos, and 1 photo at a time generation. The Pro plan is ideal for regular users, providing 250 photos, 2 AI models, medium quality photos, and 2 parallel generations. The Premium plan is designed for power users and professionals, offering 1000 photos, 2 AI models, high quality photos, 4 parallel generations, and priority support.\n\nThe quality differences are significant, Premium photos have much higher model and more realistic details. Parallel generations allow you to create multiple photos simultaneously, dramatically speeding up your workflow. The number of AI models determines how many different people you can create models for (useful for families, businesses, or representing multiple clients). Each plan includes photorealistic images, but the Premium plan delivers the most professional results suitable for commercial use."
  },
  {
    question: "Can I download the generated images?",
    answer: "Yes! All generated images can be downloaded in high resolution. Once downloaded, you have full rights to use them for personal or commercial purposes.",
    detailedAnswer: "Absolutely! All images generated through Lovit can be downloaded in high resolution. Once you download an image, you have complete ownership and full rights to use it for both personal and commercial purposes. There are no watermarks, licensing fees, or usage restrictions. You can use the images for social media posts, professional portfolios, marketing materials, or any other purpose you choose.\n\nThe high-resolution downloads ensure your images look professional and crisp across all platforms and print materials. This makes Lovit perfect for content creators, businesses, and anyone who needs professional-quality images without the cost and time of traditional photoshoots. The downloaded images are yours to keep forever, and you can use them however you like without any additional fees or permissions required."
  },
  {
    question: "Can I share my generated images on social media?",
    answer: "Absolutely! You can share your generated images on any social media platform. The images are yours to use and share as you wish.",
    detailedAnswer: "Yes, you have complete freedom to share your generated images on any social media platform! Once you download an image from Lovit, it's yours to use and share however you wish. You can post them on Instagram, Facebook, TikTok, Twitter, LinkedIn, or any other social media platform. The images are perfect for creating engaging content, showcasing your style, or building your personal brand.\n\nMany users create entire social media campaigns using their Lovit-generated images. The high-quality, professional-looking photos help you stand out on social media and create consistent, polished content. Whether you're a fashion influencer, business professional, or just someone who loves sharing their style, Lovit gives you the tools to create stunning social media content without the expense of professional photography."
  },
  {
    question: "What are the licensing terms for the generated images?",
    answer: "Once you download an image, it's free to use for both personal and commercial purposes. You own the rights to the generated images and can use them however you like.",
    detailedAnswer: "Lovit's licensing terms are simple and generous. Once you download a generated image, you own it completely and can use it for both personal and commercial purposes without any restrictions. There are no licensing fees, usage limitations, or attribution requirements. You can use the images for personal projects, business marketing, social media content, professional portfolios, or any other purpose.\n\nThis makes Lovit ideal for entrepreneurs, content creators, and businesses who need professional images without the complexity and cost of traditional licensing agreements. The images are yours to keep forever, and you can use them across multiple platforms and projects. This comprehensive licensing approach gives you maximum flexibility and value from your Lovit subscription.",
  },
  {
    question: "What should I do if I get a missing token error?",
    answer: "If you encounter a missing token error, try logging out of your account and logging back in. If the issue persists, please contact our support team at admin@trylovit.com for assistance.",
    detailedAnswer: "Missing token errors are usually related to authentication issues and can be resolved quickly. First, try logging out of your account completely and then logging back in. This refreshes your authentication token. If the error persists, clear your browser cache and cookies, then try logging in again. Sometimes the issue can be resolved by using a different browser or device.\n\nIf you continue to experience problems, please contact our support team at admin@trylovit.com with details about when the error occurs and what you were doing at the time. Include your account email and any error messages you see. Our technical team will investigate and provide a solution. These errors are typically temporary and related to session management, so they're usually resolved quickly with a simple logout/login cycle.",
  },
  {
    question: "How can I get more help or support?",
    answer: "For any additional questions or support, please email us at admin@trylovit.com. Our team is here to help you get the most out of your Lovit experience.",
    detailedAnswer: "We're committed to providing excellent support to help you get the most out of Lovit. For technical issues, billing questions, or general assistance, please email our support team at admin@trylovit.com. We typically respond within 24 hours and often much sooner. When contacting support, please include your account email, describe the issue you're experiencing, and provide any relevant screenshots or error messages. This helps us provide faster, more accurate assistance.\n\nWe also offer comprehensive documentation and tutorials within the platform to help you get started. Our support team is knowledgeable about all aspects of the platform and can help with everything from account setup to advanced features. We're here to ensure you have a smooth and enjoyable experience with Lovit."
  }
];

const FAQQuestionPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { question } = useParams<{ question: string }>();

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
    { name: 'Lovit', url: 'https://trylovit.com/' },
    { name: 'FAQ', url: 'https://trylovit.com/faq' },
    { name: faqItem.question, url: `https://trylovit.com/faq/${question}` }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <SEO
        title={`${faqItem.question} - Lovit FAQ`}
        description={faqItem.answer}
        keywords="Lovit FAQ, AI fashion, virtual try-on, fashion technology"
        ogTitle={`${faqItem.question} - Lovit FAQ`}
        ogDescription={faqItem.answer}
        ogType="article"
        ogUrl={`https://trylovit.com/faq/${question}`}
        twitterTitle={`${faqItem.question} - Lovit FAQ`}
        twitterDescription={faqItem.answer}
        structuredData={createBreadcrumbStructuredData(breadcrumbData)}
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/faq')}
          sx={{ mb: 1, px: 1}}
        >
          Back to FAQ
        </Button>

        <Breadcrumbs sx={{ mb: 2, px: 1 }}>
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/faq" color="inherit">
            FAQ
          </Link>
          <Typography color="text.primary">{faqItem.question}</Typography>
        </Breadcrumbs>

        <Paper 
          elevation={0} 
          component="article"
          sx={{ 
            p: 2, 
            borderRadius: 3,
            backgroundColor: 'transparent'
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom sx={{fontSize: { xs: '2rem', md: '2.5rem' }, mb: 4 }}>
            {faqItem.question}
          </Typography>
          
                    <Typography 
            variant="body1" 
            component="div"
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: { xs: '1rem', md: '1.1rem' },
              '& p': {
                mb: 2
              }
            }}
          >
            {faqItem.detailedAnswer.split('\n\n').map((paragraph, index) => (
              <Typography key={index} component="p" sx={{ mb: 2 }}>
                {paragraph.trim()}
              </Typography>
            ))}
          </Typography>
        </Paper>

        {/* Signup Footer */}
        <Paper 
          elevation={0} 
          sx={{ 
            mt: 6, 
            p: 4, 
            borderRadius: 3,
            background: `linear-gradient(145deg, ${theme.palette.primary.light}15, ${theme.palette.primary.main}25)`,
            border: `1px solid ${theme.palette.primary.light}30`,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom color="primary.main" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            Ready to Transform Your Fashion Experience?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Join thousands of users who are already using Lovit to visualize themselves in any outfit before making a purchase.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/')}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              py: { xs: 1, sm: 2 },
              px: { xs: 4, sm: 6 },
              fontSize: { xs: '1rem', sm: '1.2rem' },
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Try it, Lovit!
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQQuestionPage; 