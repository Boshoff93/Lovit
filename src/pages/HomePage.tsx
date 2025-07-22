import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Stack,
  Container,
  Paper,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Link,
  AppBar,
  Toolbar,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '@mui/material/styles';
import DecorativeLine from '../components/DecorativeLine';
import BrandShowcase from '../components/BrandShowcase';
import { 
  trackHomePageView,
  trackSignupButtonClick,
  trackSignupCardsClick,
  trackSignupStart,
  trackSignupSuccess,
  trackLoginSuccess,
  trackHeroCTAClick,
  trackGalleryImageClick,
  trackVideoPlay,
  trackSignupFormOpen,
  getFunnelStep,
  trackCustomerJourneyMilestone,
  trackBillingCycleChanged
} from '../utils/analytics';
import { 
  SEO, 
  createHomePageStructuredData, 
  createBreadcrumbStructuredData,
  createVideoStructuredData,
  createArticleStructuredData 
} from '../utils/seoHelper';
import Lottie from 'react-lottie';
import camera from '../assets/animations/camera.json'
import dress from '../assets/animations/dress.json'
import piggy from '../assets/animations/piggy.json'
import social from '../assets/animations/social.json'
import { getRouteConfig, getDefaultRouteConfig, routeConfigs } from '../config/routeConfig';

const featureItems = [
  {
    title: "The Most Advanced AI Photo Studio",
    description: "Say goodbye to AI image generators with distorted faces, poor resemblance, and inconsistent characters. With Lovit, you can instantly create high-quality AI photographs featuring consistent, realistic characters.",
    image: "/28 Medium.jpg",
  },
  {
    title: "Create Your Own AI Model",
    description: "Upload just 10–20 images of yourself (or an influencer you represent) to create a hyper-realistic AI model. Creating your model takes only 1–2 minutes with premium settings. After that, generate unlimited high-quality photos instantly!",
    image: "/34 Medium.jpg",
  },
  {
    title: "Try On Any Outfit",
    description: "Find your perfect wedding dress without the hassle of multiple boutique visits. Try on any dress virtually - from designer gowns to casual wear. Simply upload a photo of any outfit, and see exactly how it looks on you before making a purchase.",
    image: "/31 Medium.png",
  },
  {
    title: "Professional Photoshoots Anywhere",
    description: "With Lovit, you can create full-scale photoshoots from anywhere, just choose a model, upload clothing items, and describe your vision with prompts. Whether you need unique product photos for your Shopify store or polished, professional headshots, Lovit delivers high-quality results in minutes.",
    image: "/32 Medium.jpeg",
  },
];

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

interface GalleryImage {
  src: string;
  prompt: string;
}

const gridImages: GalleryImage[] = [
  {
    src: "/glamorous-beauty-portrait.jpeg",
    prompt: "Glamorous beauty portrait with bold red lipstick, dramatic eye makeup, and elegant black evening wear."
  },
  {
    src: "/nyc-street-style.jpeg",
    prompt: "New York City, woman black coat, jeans, boots chic street style."
  },
  {
    src: "/bridal-portrait.jpeg",
    prompt: "Close-up of a bride with natural makeup, soft veil, and captivating green eyes, wedding inspiration."
  },
  {
    src: "/high-fashion-editorial.jpeg",
    prompt: "High-fashion editorial, model in a sleek black dress, dramatic side lighting, minimalist studio."
  },
  {
    src: "/urban-chic-style.jpeg",
    prompt: "Chic urban style, woman in denim jacket and heels, sitting on stairs, confident night look."
  },
  {
    src: "/beauty-closeup.jpeg",
    prompt: "Beauty close-up, woman applying nude lipstick, glowing skin, soft natural makeup."
  },
  {
    src: "/modern-swimsuit.jpeg",
    prompt: "Modern swimsuit look, white minimalist vibes, outdoor sunny setting, elegant pose, roses in background."
  },
  {
    src: "/romantic-bridal.jpeg",
    prompt: "Romantic bridal portrait, lace wedding gown, blooming rose garden, soft natural light."
  },
  {
    src: "/vibrant-fashion.jpeg",
    prompt: "Vibrant fashion editorial, bold colorful makeup, high bun hairstyle, pink background."
  },
  {
    src: "/nightlife-fashion.jpeg",
    prompt: "Nightlife fashion, woman in black leather outfit, neon city lights, cyberpunk style."
  },
  {
    src: "/classic-beauty.jpeg",
    prompt: "Classic beauty portrait, red lipstick, soft curls, warm bokeh background, timeless glamour."
  },
  {
    src: "/summer-fashion.jpeg",
    prompt: "Summer fashion, wide-brim hat, sunflower field, natural makeup, outdoor lifestyle."
  },
  {
    src: "/natural-light-portrait.jpeg",
    prompt: "Natural light portrait, young woman with freckles, soft golden hour glow, casual style."
  },
  {
    src: "/spring-fashion.jpeg",
    prompt: "Spring fashion, woman in a flowing yellow dress, walking in a blooming park, cheerful mood."
  },
  {
    src: "/glamorous-beauty-dark.jpeg",
    prompt: "Glamorous beauty shot, dark skin, gold glitter eyeshadow, glossy lips, dramatic lighting."
  },
  {
    src: "/elegant-evening-gown.jpeg",
    prompt: "Elegant evening gown, sparkling dress, bokeh lights, luxury event, confident pose."
  },
  {
    src: "/beach-lifestyle.jpeg",
    prompt: "Beach lifestyle, woman in pink ruffle swimsuit, playful and smiling, ocean background."
  },
  {
    src: "/classic-glamour.jpeg",
    prompt: "Classic glamour portrait, bold red lipstick, statement jewelry, flawless makeup."
  },
  {
    src: "/chic-city-style.jpeg",
    prompt: "Chic city style, woman in camel coat, street fashion, urban background, confident walk."
  },
  {
    src: "/sunset-fitness.jpeg",
    prompt: "Sunset fitness, sporty woman in black tank top, city skyline, golden hour workout."
  },
  {
    src: "/beauty-lipstick.jpeg",
    prompt: "Beauty close-up, glossy pink lips, applying lipstick, soft focus, feminine style."
  },
  {
    src: "/romantic-bridal-garden.jpeg",
    prompt: "Romantic bridal portrait, lace wedding dress, rose garden, dreamy outdoor setting."
  },
  {
    src: "/trendy-street-style.jpeg",
    prompt: "Trendy street style, woman in crop top and joggers, graffiti wall, urban summer fashion."
  },
  {
    src: "/beach-fashion.jpeg",
    prompt: "Beach fashion, woman in floral bikini and sun hat, sandy shore, summer vacation vibes."
  }
];


const plans = [
  {
    id: 'starter',
    title: 'Starter',
    monthlyPrice: 14.99,
    yearlyPrice: 8.99,
    features: {
      photoCount: '100 AI photos',
      modelCount: '1 AI Model',
      quality: 'Lower quality photos',
      likeness: 'Low Likeness',
      parallel: '2 photo at a time',
      other: ['Photorealistic images']
    }
  },
  {
    id: 'pro',
    title: 'Pro',
    monthlyPrice: 29.99,
    yearlyPrice: 19.99,
    features: {
      photoCount: '250 photos',
      modelCount: '2 AI models',
      quality: 'Medium quality photos',
      likeness: 'Medium likeness',
      parallel: '4 photos in parallel',
      other: ['Photorealistic images']
    }
  },
  {
    id: 'premium',
    title: 'Premium',
    monthlyPrice: 59.99,
    yearlyPrice: 44.99,
    popular: true,
    features: {
      photoCount: '1000 AI photos',
      modelCount: '2 AI models',
      quality: 'High quality photos',
      likeness: 'High likeness',
      parallel: '8 photos in parallel',
      other: ['Photorealistic images', 'Priority support']
    }
  }
];

// Create breadcrumb data
const breadcrumbData = [
  { name: 'Lovit', url: 'https://trylovit.com/' },
  { name: 'What Our Users Say', url: 'https://trylovit.com/#what-our-users-say' },
  { name: 'Personal AI Fashion Studio', url: 'https://trylovit.com/#ai-studio' },
  { name: 'Try On Any Outfit', url: 'https://trylovit.com/#any-outfit' },
  { name: 'How It Works', url: 'https://trylovit.com/#how-it-works' },
  { name: 'Choose Your Plan', url: 'https://trylovit.com/#pricing' },
  { name: 'Gallery', url: 'https://trylovit.com/#gallery-showcase' }
];

// Create video data for demo video
const videoData = {
  name: "Lovit - Your AI Fashion Studio",
  description: "See how Lovit's AI-powered fashion platform helps you try on clothes virtually and create professional photos instantly.",
  thumbnailUrl: "https://img.youtube.com/vi/h3DZNpx1JqI/maxresdefault.jpg",
  uploadDate: "2025-05-12",
  duration: "PT2M30S",
  url: "https://www.youtube.com/watch?v=h3DZNpx1JqI",
  embedUrl: "https://www.youtube.com/embed/h3DZNpx1JqI",
  contentUrl: "https://www.youtube.com/watch?v=h3DZNpx1JqI"
};

// Create article data for featured content
const articleData = {
  headline: "Transform Your Fashion Experience with AI",
  description: "Discover how Lovit's AI technology is revolutionizing the way we shop for clothes and create professional photos.",
  image: "/lovit.png",
  datePublished: "2025-05-11T08:00:00Z",
  dateModified: "2025-05-11T08:00:00Z",
  author: {
    name: "Lovit Team",
    url: "https://trylovit.com"
  },
  url: "https://trylovit.com/blog/transform-fashion-experience"
};

const numColumns = {
  xs: 3,
  sm: 4,
  md: 6
};

const GalleryGrid: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const rows = useMemo(() => {
    return gridImages.reduce((acc: GalleryImage[][], img, i) => {
      const rowIndex = Math.floor(i / numColumns.xs);
      if (!acc[rowIndex]) {
        acc[rowIndex] = [];
      }
      acc[rowIndex].push(img);
      return acc;
    }, []);
  }, []);

  const handleImageClick = useCallback((img: GalleryImage, idx: number) => {
    trackGalleryImageClick(img.src, idx);
    setSelectedImage(img.src);
    const imageName = img.src.replace(/^\/|\.(jpeg|jpg|png)$/g, '');
    navigate(`#${imageName}`);
  }, [navigate]);

  const handleCloseOverlay = useCallback(() => {
    setSelectedImage(null);
    navigate('#');
  }, [navigate]);

  // Handle URL hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const matchingImage = gridImages.find(img => {
        const imageName = img.src.replace(/^\/|\.(jpeg|jpg|png)$/g, '');
        return imageName === hash;
      });
      if (matchingImage) {
        setSelectedImage(matchingImage.src);
      }
    } else {
      setSelectedImage(null);
    }
  }, [location.hash]);

  return (
    <Box sx={{
      position: 'relative',
      width: '100vw',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      px: { xs: 2, md: 2 },
    }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(6, 1fr)',
            xl: 'repeat(8, 1fr)'
          },
          columnGap: { xs: 2},
          width: '100%',
          position: 'relative',
          px: { xs: 0, md: 4 },
          zIndex: 1,
        }}
      >
        {rows.flat().map((img, idx) => {
          const offset = {
            xs: idx % 3 === 1 ? 1 : -1,
            sm: idx % 2 === 0 ? -2 : 2,
            md: idx % 2 === 0 ? -3 : 3
          };
          
          return (
            <Box
              key={idx}
              onClick={() => handleImageClick(img, idx)}
              sx={{
                width: '100%',
                aspectRatio: '9/16',
                overflow: 'hidden',
                borderRadius: { xs: 1, sm: 2, md: 3 },
                boxShadow: '0 2px 12px rgba(43, 45, 66, 0.10)',
                opacity: 1,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  opacity: 0.7,
                  transform: 'translateY(-4px)',
                  '& .overlay-text': {
                    opacity: 1,
                  }
                },
                marginTop: offset,
              }}
            >
              <Box
                component="img"
                src={img.src.replace('/public', '')}
                alt={img.prompt}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  display: 'block',
                }}
              />
              <Box
                className="overlay-text"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                  color: 'white',
                  p: 2,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {img.prompt}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Image Overlay Modal */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseOverlay}
        PaperProps={{
          sx: {
            boxShadow: 'none',
            overflow: 'hidden',
            bgcolor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: '100%', sm: 'none' },
            maxHeight: '100vh',
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(4px)'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'transparent',
            p: 0,
            m: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
            maxHeight: '100vh',
            overflow: 'auto'
          }}
          onClick={handleCloseOverlay}
        >
          {selectedImage && (
            <Box
              onClick={handleCloseOverlay}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: { xs: 0, sm: 3 },
                p: { xs: 1, sm: 2 },
                width: { xs: 'auto', sm: 'auto' },
                maxWidth: { xs: '100%', sm: '80vw', md: '60vw' },
                maxHeight: { xs: '100vh', sm: '100vh' },
                height: 'auto',
                overflow: 'visible',
                cursor: 'default',
                gap: 1
              }}
            >
              <Box
                component="img"
                src={selectedImage.replace('/public', '')}
                alt={gridImages.find(img => img.src === selectedImage)?.prompt || 'Gallery Image'}
                sx={{
                  width: 'auto',
                  height: 'auto',
                  maxHeight: { xs: '50vh', sm: '60vh', md: '65vh' },
                  objectFit: 'contain',
                  objectPosition: 'center',
                  borderRadius: { xs: 0, sm: 2 },
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  display: 'block',
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  mt: 0.5,
                  mb: 0.5,
                  textAlign: 'center',
                  color: 'secondary.dark',
                  maxWidth: '700px',
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  px: { xs: 1, sm: 2 },
                }}
              >
                {gridImages.find(img => img.src === selectedImage)?.prompt}
              </Typography>
              <Button
                variant="contained"
                onClick={handleCloseOverlay}
                color="secondary"
                sx={{
                  mt: 0.5,
                  mb: { xs: 1, sm: 1 },
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)',
                  },
                  position: 'relative',
                  zIndex: 2,
                  py: 0.5
                }}
              >
                Close
              </Button>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

const HomePage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [authTab, setAuthTab] = useState<number>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, googleLogin, user, error: authError, resendVerificationEmail, getGoogleIdToken, subscription } = useAuth();
  const isPremiumMember = subscription?.tier && subscription.tier !== 'free'
  const theme = useTheme();

  // Get route configuration based on current path
  const routeConfig = getRouteConfig(location.pathname) || getDefaultRouteConfig();

  // Add page view tracking
  useEffect(() => {
    trackHomePageView();
  }, []);

  const handleSectionClick = useCallback((section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update URL with hash
      navigate(`#${section}`, { replace: true });
    }
  }, [navigate]);

  // Handle URL hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleClickOpen = useCallback(async (section?: string, event?: React.MouseEvent) => {
    if (user) {
      if (isPremiumMember) {
        navigate('/dashboard');
        return;
      } else {
        navigate('/payment');
        return;
      }
    }
    
    // Track button click with section info
    const clickSection = section || 'unknown';
    trackSignupButtonClick(clickSection, 'Try it, Lovit!');
    
    setOpen(true);
    // Reset form state when opening the dialog
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setError(null);
  }, [user, isPremiumMember, navigate]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setIsLoading(false);
    setIsGoogleLoading(false);
  }, []);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setAuthTab(newValue);
    setError(null);
    trackSignupFormOpen(newValue === 0 ? 'login' : 'signup');
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEmailSignup = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password || !username) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }
      // Password validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError('Password must be at least 8 characters and include at least one capital letter, one number, and one special character');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      trackSignupStart('email');
      // Call signup using useAuth hook
      const result = await signup(email, password, username);
      
      // Check if the signup was successful by looking at the fulfilled action
      if (result.type.endsWith('/fulfilled')) {
        trackSignupSuccess('email', result.payload?.user?.id);
        trackCustomerJourneyMilestone('signup_completed', { method: 'email' });
        setIsLoading(false);
        handleClose();
        showSnackbar('Account created successfully! Please check your email to verify your account.');
      } else {
        // If we get here, there was an error
        setIsLoading(false);
        setError(result.payload || 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      setIsLoading(false);
      // Use authError from useAuth hook if available
      setError(authError || 'Signup failed. Please try again.');
    }
  }, [signup, authError, email, password, confirmPassword, username, handleClose]);

  const handleGoogleSignup = useCallback(async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      
      trackSignupStart('google');
      // Get Google access token using the auth hook utility
      const accessToken = await getGoogleIdToken();
      
      // Use our Redux action through the useAuth hook and store the result
      const result = await googleLogin(accessToken);
      
      // Check if the login was successful
      if (result.type === 'auth/loginWithGoogle/fulfilled') {
        trackSignupSuccess('google', result.payload?.user?.id);
        trackCustomerJourneyMilestone('signup_completed', { method: 'google' });
        showSnackbar('Signed in with Google successfully!');
        
        // Get user data from the response
        const userData = result.payload.user;
        
        // Check if user is verified using response data
        if (!userData.isVerified) {
          // User is not verified, send verification email and show notification
          try {
            await resendVerificationEmail(userData.email);
            showSnackbar('Your email is not verified. A new verification email has been sent - please check your inbox.');
          } catch (err) {
            console.error('Failed to resend verification email:', err);
            showSnackbar('Your email is not verified. Please check your inbox for the verification email.');
          }
        } else {
          // Navigate to dashboard if authentication was successful
          navigate('/dashboard');
        }
      } else {
        // Login was rejected, set error message
        setError(result.payload || 'Google login failed.');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Use authError from useAuth hook if available
      if (error.error === 'popup_closed_by_user') {
        setError('Google sign-in was cancelled. Please try again.');
      } else {
        setError(authError || 'Google sign-in failed. Please try again or use email signup.');
      }
    } finally {
      // Always reset loading state and close dialog
      setIsGoogleLoading(false);
      handleClose();
    }
  }, [googleLogin, authError, getGoogleIdToken, resendVerificationEmail, navigate, handleClose]);

  const handleEmailLogin = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email || !password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      // Call login using our useAuth hook and store the result
      const result = await login(email, password);
      
      setIsLoading(false);

      // Check if the login was successful
      if (result.type === 'auth/loginWithEmail/fulfilled') {
        trackLoginSuccess('email', result.payload?.user?.id);
        trackCustomerJourneyMilestone('login_completed', { method: 'email' });
        handleClose();
        const userData = result.payload.user;
        
        // Check if user is verified using response data
        if (!userData.isVerified) {
          // User is not verified, send verification email and show single notification
          try {
            await resendVerificationEmail(userData.email);
            showSnackbar('Your email is not verified. A new verification email has been sent - please check your inbox.');
          } catch (err) {
            console.error('Failed to resend verification email:', err);
            showSnackbar('Your email is not verified. Please check your inbox for the verification email.');
          }
        } else {
          // User is verified, proceed as normal
          showSnackbar('Logged in successfully!');
          navigate('/dashboard');
        }
      } else {
        // Login was rejected, set error message
        setError(result.payload || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      setIsLoading(false);
      // Use authError from useAuth hook if available
      setError(authError || 'Login failed. Please check your credentials.');
    }
  }, [login, authError, email, password, navigate, resendVerificationEmail, handleClose]);

  const handleKeyPressLogin = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleEmailLogin();
    }
  }, [handleEmailLogin, isLoading]);

  const handleKeyPressSignup = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleEmailSignup();
    }
  }, [handleEmailSignup, isLoading]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      width: '100%'
    }}>
      <SEO
        title={routeConfig.title}
        description={routeConfig.description}
        keywords={routeConfig.keywords.join(', ')}
        ogTitle={routeConfig.title}
        ogDescription={routeConfig.description}
        ogType="website"
        ogUrl={`https://trylovit.com${location.pathname}`}
        twitterTitle={routeConfig.title}
        twitterDescription={routeConfig.description}
        structuredData={[
          createHomePageStructuredData(featureItems),
          createBreadcrumbStructuredData(breadcrumbData),
          createVideoStructuredData(videoData),
          createArticleStructuredData(articleData)
        ]}
      />

      {/* Transparent Header */}
      <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(4px)' }}>
        <Toolbar sx={{ display: {xs: 'none', sm: 'flex'}, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              component="img"
              src="/lovit.png"
              alt="Lovit - AI Fashion Platform Logo"
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: theme.palette.secondary.main,
                p: '5px',
                mr: 1
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.4rem' }}>
              Lovit
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="inherit" 
              onClick={useCallback(() => handleSectionClick('pricing'), [handleSectionClick])}
              sx={{ fontWeight: 700,  borderRadius: 2,textTransform: 'none', fontSize: '1.2rem', display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Pricing
            </Button>
            <Button 
              variant="contained" 
              color="inherit" 
              component={RouterLink} 
              to="/faq"
              sx={{ fontWeight: 700,  borderRadius: 2,textTransform: 'none', fontSize: '1.2rem', display: { xs: 'none', sm: 'inline-flex' } }}
            >
              FAQ
            </Button>
            <Button 
              variant="contained" 
              color="inherit" 
              onClick={useCallback(() => handleSectionClick('gallery-showcase'), [handleSectionClick])}
              sx={{ fontWeight: 700,  borderRadius: 2, textTransform: 'none', fontSize: '1.2rem', display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Gallery
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={useCallback(() => handleClickOpen('header'), [handleClickOpen])}
              sx={{ fontWeight: 700,  borderRadius: 2, textTransform: 'none', fontSize: '1.2rem', display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Try it
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed header */}

      {/* Hero Section */}
      <Box style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '32%', 
        background: `linear-gradient(180deg, 
          ${theme.palette.primary.dark}CC,
          ${theme.palette.primary.dark}99,
          ${theme.palette.background.default}99),
          linear-gradient(to bottom,
          ${theme.palette.background.default}00,
          ${theme.palette.background.default}FF)`,
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease-in-out',
        zIndex: -2
      }}/>
      <Box sx={{ 
        position: 'relative',
        width: '100%',
        py: { xs: 0, md: 0 }, 
        px: { xs: 2, md: 2 },
        textAlign: 'center',
        zIndex: 2,
        height: { xs: 'auto', md: '100%' },
        minHeight: { xs: '100vh', md: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        mb: 8
      }}>
        <Container maxWidth="xl" sx={{ 
          textAlign: 'left',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Logo/Image above slogan */}
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Box 
              component="img"
              src="/lovit.png"
              alt="Lovit - AI Fashion Platform Logo"
              sx={{
                width: { xs: '140px', md: '200px' },
                p: "5px",
                height: 'auto',
                borderRadius: '50%'
              }}
            />
          </Box>
          
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '2rem', md: '4rem' },
              fontWeight: 900,
              mb: 3,
              color: theme.palette.secondary.dark,
              lineHeight: 1.1,
              textAlign: 'center'
            }}
          >
            Try it, Love it, Buy it
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1.3rem', md: '2rem' },
              mb: 2, 
              maxWidth: '800px', 
              mx: 'auto', 
              color: theme.palette.secondary.light,
              fontWeight: 700,
              lineHeight: 1.3,
              textAlign: 'center'
            }}
          >
            {routeConfig.hook}
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: { xs: '1rem', md: '1.2rem' },
              mb: 2, 
              maxWidth: '800px', 
              mx: 'auto', 
              color: theme.palette.secondary.light,
              lineHeight: 1.3,
              textAlign: 'center'
            }}
          >
            {routeConfig.description}
          </Typography>

          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, sm: 4 },
            mb: 4
          }}>
            <Box
              component="img"
              src="/fashion.png"
              alt="Lovit - #1 AI Fashion App for Virtual Try-On"
              sx={{
                width: { xs: '120px', sm: '200px', md: '200px' },
                height: 'auto',
                display:'block'
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={useCallback(() => {
                trackHeroCTAClick();
                handleClickOpen('hero');
              }, [handleClickOpen])}
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                py: { xs: 1, sm: 2, md: 2 },
                px: { xs: 4, sm: 6, md: 6 },
                mt: { xs: 2, sm: 0 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '200%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 3s infinite',
                  transform: 'translateX(-100%)',
                },
                '@keyframes shimmer': {
                  '0%': {
                    transform: 'translateX(-100%)',
                  },
                  '100%': {
                    transform: 'translateX(50%)',
                  },
                },
              }}
            >
              Try it, Lovit!
            </Button>
          </Box>
        </Container>
        {/* <Container id="gallery" maxWidth="lg" sx={{ mb: 0, position: 'relative', zIndex: 2}}>
          <BrandShowcase />
        </Container> */}

              {/* Gallery Preview */}
        {/* <Typography 
            variant="h3"
            sx={{ 
              fontSize: { xs: '2rem', md: '4rem' },
              mt: 0,
              mb: 2, 
              maxWidth: '800px', 
              mx: 'auto', 
              color: theme.palette.secondary.dark,
              fontWeight: 700,
              lineHeight: 1.3,
              textAlign: 'center',
            }}
          >
            Your Online Fitting Room
          </Typography>
          <Typography 
            sx={{ 
              mb: 8, 
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              color: theme.palette.secondary.light,
              fontWeight: 700,
              lineHeight: 1.3,
              textAlign: 'center',
            }}
          >
            Create your own digital twin and see exactly what you look like in any outfit
          </Typography> */}
          <Container maxWidth="xl" sx={{ textAlign: 'left', mb:8 }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              mx: 'auto',
              mt: 6,
              mb: 0,
              alignItems: 'center'
            }}>
            {/* Image Section */}
            <Box sx={{
              width: { xs: '100%', md: '90%' },
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              mb: { xs: 4, md: 0 }
            }}>
              <Box
                component="img"
                src={
                  location.pathname === '/halloween-costume-virtual-try-on' 
                    ? '/halloween.jpg' 
                    : [
                        '/wedding-dress-virtual-try-on',
                        '/bridesmaid-dresses',
                        '/dresses-for-wedding-near-me',
                        '/bridal-styles',
                        '/what-to-wear-wedding-dress-shopping',
                        '/what-to-wear-bridal-dress-shopping',
                        '/formal-wedding-guest-dresses',
                        '/dresses-for-wedding-on-the-beach',
                        '/bridal-dress-online',
                        '/designer-dresses-for-wedding'
                      ].includes(location.pathname)
                    ? '/wedding.jpg'
                    : '/personalized-photos.png'
                }
                alt={
                  location.pathname === '/halloween-costume-virtual-try-on'
                    ? 'Halloween costume virtual try-on'
                    : [
                        '/wedding-dress-virtual-try-on',
                        '/bridesmaid-dresses',
                        '/dresses-for-wedding-near-me',
                        '/bridal-styles',
                        '/what-to-wear-wedding-dress-shopping',
                        '/what-to-wear-bridal-dress-shopping',
                        '/formal-wedding-guest-dresses',
                        '/dresses-for-wedding-on-the-beach',
                        '/bridal-dress-online',
                        '/designer-dresses-for-wedding'
                      ].includes(location.pathname)
                    ? 'Wedding and bridal virtual try-on'
                    : 'Personalize your AI model'
                }
                sx={{
                  width: '90%',
                  height: 'auto',
                  borderRadius: 3,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                  position: 'relative',
                  zIndex: 1
                }}
              />
              <Box
                component="img"
                src="/real-person.png"
                alt="Real Personalized Photos"
                sx={{
                  width: { xs: '40%', sm: '30%', md: '35%' },
                  height: 'auto',
                  borderRadius: 3,
                  position: 'absolute',
                  top: { xs: -50, sm: -60, md: -50, lg: -80 },
                  left: { xs: -15, sm: -10, md: -20, lg: -20 },
                  zIndex: 2
                }}
              />
            </Box>


            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              mb: 4,
              width: { xs: '100%', md: '100%' },
              color: theme.palette.secondary.light,
              '& > *': {
                fontSize: { xs: '1.6rem', md: '1.6rem' },
                fontWeight: 600,
                lineHeight: 1.4
              }
            }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box component="span" sx={{ 
                  flexShrink: 0,
                  fontSize: { xs: '1.2rem',sm: '1.4rem', md: '1.8rem' },
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                <Lottie options={{
                  loop: true,
                  autoplay: true, 
                  animationData: dress,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                    }
                  }}
                  height={100}
                  width={100}/>  
                </Box>
                <Typography sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '1.2rem',sm: '1.4rem', md: '1.8rem' },
                  color: { xs: 'secondary.main', md: 'secondary.main' }
                }}>
                  {routeConfig.features.tryOn}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box component="span" sx={{ 
                  flexShrink: 0,
                  fontSize: { xs: '1.2rem',sm: '1.4rem', md: '1.8rem' },
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}><Lottie options={{
                  loop: true,
                  autoplay: true, 
                  animationData: camera,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                    }
                  }}
                  height={100}
                  width={100}/>  </Box>
                <Typography sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '1.2rem',sm: '1.4rem', md: '1.8rem' },
                  color: { xs: 'secondary.main', md: 'secondary.main' }
                }}>
                  {routeConfig.features.headshots}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box component="span" sx={{ 
                  flexShrink: 0,
                  fontSize: { xs: '1.2rem',sm: '1.4rem', md: '1.8rem' },
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}><Lottie options={{
                  loop: true,
                  autoplay: true, 
                  animationData: social,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                    }
                  }}
                  height={100}
                  width={100}/>  </Box>
                <Typography sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '1.2rem',sm: '1.4rem', md: '1.8rem' },
                  color: { xs: 'secondary.main', md: 'secondary.main' }
                }}>
                  {routeConfig.features.socialMedia}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box component="span" sx={{ 
                  flexShrink: 0,
                  fontSize: { xs: '1.2rem',sm: '1.4rem', md: '1.8rem' },
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}><Lottie options={{
                  loop: true,
                  autoplay: true, 
                  animationData: piggy,
                  rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                    }
                  }}
                  height={100}
                  width={100}/></Box>
                <Typography sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '1.2rem',sm: '1.4rem', md: '1.8rem' },
                  color: { xs: 'secondary.main', md: 'secondary.main' }
                }}>
                  {routeConfig.features.savings}
                </Typography>
              </Box>
            </Box>
          </Box>

        </Container>
      </Box>
      {/* Auth Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(43, 45, 66, 0.2)',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.primary.light}`,
            '&::before': {
              display: 'none'
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          py: 2
        }}>
          {authTab === 0 ? 'Login to Lovit' : 'Sign Up for Lovit'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Tabs 
            value={authTab} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main
              },
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main
              }
            }}
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
          
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {authTab === 0 ? (
              // Login Form
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email-login"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  id="password-login"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPressLogin}
                  sx={{ mb: 3 }}
                />
                <Box sx={{ width: '100%', textAlign: 'center', mb: 2 }}>
                  <Link
                    component={RouterLink}
                    to="/reset-password-request"
                    variant="body2"
                    underline="hover"
                  >
                    Forgot Password?
                  </Link>
                </Box>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary"
                  onClick={handleEmailLogin}
                  disabled={isLoading}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Login with Email'}
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={
                    isGoogleLoading ? (
                      <CircularProgress size={18} />
                    ) : (
                      <Box
                        component="img"
                        src="/google-color.svg"
                        alt="Google"
                        sx={{
                          width: 18,
                          height: 18,
                          marginRight: 1
                        }}
                      />
                    )
                  }
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading}
                  sx={{ py: 1.5 }}
                >
                  Sign in with Google
                </Button>
              </>
            ) : (
              // Sign Up Form
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  id="username"
                  label="Username"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={username}
                  onChange={(e: any) => setUsername(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPressSignup}
                  sx={{ mb: 3 }}
                />
                <TextField
                  margin="dense"
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e: any) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPressSignup}
                  sx={{ mb: 3 }}
                />
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary"
                  onClick={handleEmailSignup}
                  disabled={isLoading}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Sign up with Email'}
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  startIcon={
                    isGoogleLoading ? (
                      <CircularProgress size={18} />
                    ) : (
                      <Box
                        component="img"
                        src="/google-color.svg"
                        alt="Google"
                        sx={{
                          width: 18,
                          height: 18,
                          marginRight: 1
                        }}
                      />
                    )
                  }
                  onClick={handleGoogleSignup}
                  disabled={isGoogleLoading}
                  sx={{ py: 1.5 }}
                >
                  Sign in with Google
                </Button>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    By signing up, you agree to our{' '}
                    <RouterLink 
                      to="/terms" 
                      style={{ 
                        textDecoration: 'none', 
                        color: theme.palette.primary.main 
                      }}
                    >
                      Terms of Service
                    </RouterLink>
                    {' '}and{' '}
                    <RouterLink 
                      to="/privacy" 
                      style={{ 
                        textDecoration: 'none', 
                        color: theme.palette.primary.main 
                      }}
                    >
                      Privacy Policy
                    </RouterLink>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          mt: 7,
        }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
        
        <DecorativeLine 
        src="/line_secondary_reverse.png"
      />
      {/* Main Content */}
      <Box sx={{ 
        width: '100%',
        overflowX: 'hidden',
        position: 'relative'
      }}>
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ 
          py: { xs: 4, md: 8 },
          px: { xs: 2, md: 3 },
          width: '100%',
          maxWidth: '100%'
        }}>
          {/* Main Value Proposition */}
          <Box id="ai-studio" sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" gutterBottom color="primary.main" sx={{ fontSize: { xs: '2rem', md: '4rem' } }}>
              Your Own Personal AI Fashion Studio
            </Typography>
            <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' }, maxWidth: '800px', mx: 'auto', mb: 4 }}>
              Experience the future of fashion with our revolutionary virtual try-on technology. Upload your photos to create your digital twin, then instantly see how any outfit looks on you. Perfect for wedding dress shopping, exploring new styles, or building your dream wardrobe! All from the comfort of your home.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={useCallback(() => handleClickOpen('ai_studio'), [handleClickOpen])}
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                py: { xs: 1, sm: 2, md: 2 },
                px: { xs: 4, sm: 6, md: 6 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '200%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 3s infinite',
                  transform: 'translateX(-100%)',
                },
                '@keyframes shimmer': {
                  '0%': {
                    transform: 'translateX(-100%)',
                  },
                  '100%': {
                    transform: 'translateX(50%)',
                  },
                },
              }}
            >
              Try it, Lovit!
            </Button>
          </Box>
          {/* Features Section */}
          <Box sx={{ 
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            overflow: 'hidden',
            mb: 0 ,
          }}>
            
            {/* First feature - full width */}
            <Box id="any-outfit" sx={{ 
              width: { xs: '90%', sm: '85%', md: '80%' }, 
              mb: 8,
              mx: 'auto',
              textAlign: 'center',
              overflow: 'hidden',
              p: 2
            }}>
              <Box
                sx={{
                  width: '100%',
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 Aspect Ratio
                  borderRadius: { xs: 2, sm: 3, md: 4 },
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                  cursor: 'pointer'
                }}
                onClick={(e: any) => {
                  trackVideoPlay('h3DZNpx1JqI', 'Lovit Demo Video');
                  const iframe = e.currentTarget.querySelector('iframe');
                  const thumbnail = e.currentTarget.querySelector('img');
                  const playButton = e.currentTarget.querySelector('.play-button');
                  if (iframe && thumbnail && playButton) {
                    iframe.style.opacity = '1';
                    iframe.style.pointerEvents = 'auto';
                    thumbnail.style.display = 'none';
                    iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
                  }
                }}
              >
                <Box
                  component="img"
                  src={featureItems[2].image}
                  alt={`${featureItems[2].title} - Virtual Try-On Feature`}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                      opacity: 0.9
                    }
                  }}
                />
                <Box
                  className="play-button"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      transform: 'translate(-50%, -50%) scale(1.1)'
                    }
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 0,
                      height: 0,
                      borderTop: '20px solid transparent',
                      borderBottom: '20px solid transparent',
                      borderLeft: '30px solid white',
                      marginLeft: '5px'
                    }}
                  />
                </Box>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    opacity: 0,
                    pointerEvents: 'none'
                  }}
                  src="https://www.youtube.com/embed/h3DZNpx1JqI?autoplay=0&mute=1&loop=1&playlist=h3DZNpx1JqI"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
              <Container maxWidth="xl">
                <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: { xs: 12, sm: 12, md: 12 }, px: { xs: 2, md: 3 } }}>
                  <Typography variant="h3" gutterBottom fontWeight={700} color="primary.main" sx={{ fontSize: { xs: '2rem', md: '4rem' } }}>
                    {featureItems[2].title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' }, lineHeight: 1.8 }}>
                    {featureItems[2].description}
                  </Typography>
                </Box>
              </Container>
            </Box>

            {/* Remaining features grid */}
            <Container maxWidth="xl">
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: { xs: 2, sm: 3 },
                width: '100%',
                justifyContent: 'center',
                '& > *': {
                  width: '100%',
                  maxWidth: {
                    xs: '500px',
                    xl: 'calc(33.333% - 16px)'
                  },
                  marginBottom: { xs: 3, sm: 4 }
                }
              }}>
                {[0, 3, 1].map((index) => (
                  <Box 
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      p: 2
                    }}
                  >
                    <Box
                      component="img"
                      src={featureItems[index].image}
                      alt={featureItems[index].title}
                      sx={{
                        width: '100%',
                        aspectRatio: '9/16',
                        objectFit: 'cover',
                        objectPosition: index === 1 ? 'center' : 'top',
                        borderRadius: 3,
                        mb: 3,
                        display: 'block',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h5" 
                        gutterBottom 
                        fontWeight={700} 
                        color="primary.main"
                        sx={{
                          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' }
                        }}
                      >
                        {featureItems[index].title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ 
                          lineHeight: 1.6,
                          fontSize: { xs: '1rem', sm: '1rem', md: '1.1rem' }
                        }}
                      >
                        {featureItems[index].description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Container>
          </Box>
          {/* How It Works */}
          <Box id="how-it-works" sx={{ mb: 8, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={useCallback(() => handleClickOpen('how_it_works'), [handleClickOpen])}
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                py: { xs: 1, sm: 2, md: 2 },
                px: { xs: 4, sm: 6, md: 6 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '200%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 3s infinite',
                  transform: 'translateX(-100%)',
                },
                '@keyframes shimmer': {
                  '0%': {
                    transform: 'translateX(-100%)',
                  },
                  '100%': {
                    transform: 'translateX(50%)',
                  },
                },
              }}
            >
              Try it, Lovit!
            </Button>
          </Box>
          </Container>
          <DecorativeLine 
            src="/line_primary.png"
          />
          <Container maxWidth="lg" sx={{ mb: 12, mt: 12 , position: 'relative', zIndex: 2}}>
          <Box sx={{ mb: 8 }}>
            <Typography variant="h3" gutterBottom textAlign="center" color="primary.main" sx={{ fontSize: { xs: '2rem', md: '4rem' } }}>
              How It Works
            </Typography>
            <Divider sx={{ mb: 5, borderColor: theme.palette.primary.light }} />
            
                    {/* Main Image */}
            <Box sx={{ 
                width: '100%',
                maxWidth: '800px',
                mx: 'auto',
                mb: 4,
                px: { xs: 2, md: 0 }
              }}>
                <Box
                  component="img"
                  src="/woman.jpg"
                  alt="Virtual Fashion Try-On"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: { xs: 2, md: 3 },
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                  }}
                />
              </Box>
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              <Typography variant="body1" paragraph sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                <strong>Create your AI model</strong> in minutes - either of yourself or anyone else. Simply upload 10-20 photos and our advanced AI will learn to recognize and replicate unique features, expressions, and style.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                Once your model is ready, <strong>upload any outfit you want to try</strong> from any online store. Just take a screenshot or save the image of the clothing item you're interested in.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                <strong>Generate stunning images instantly</strong> of your model wearing those outfits in any setting of your choosing. From beach vacations to city streets or professional settings - see exactly how the clothes will look on you before making a purchase.
              </Typography>
            </Box>
          </Box>
          </Container>
          <Container id="gallery-showcase" maxWidth="lg" sx={{ mb: 12, mt: 0 , position: 'relative', zIndex: 2}}>
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                mb: 4, 
                maxWidth: '800px', 
                mx: 'auto',
                  fontSize: { xs: '2rem',sm: '2.4rem', md: '2.8rem' },
                color: theme.palette.primary.main,
                fontWeight: 700,
                lineHeight: 1.3,
                textAlign: 'center',
              }}
            >
              Try on 1000s of brands + designers
            </Typography>
            <Container maxWidth="lg" sx={{ mb: 0, position: 'relative', zIndex: 2}}>
            <BrandShowcase />
          </Container>
            <GalleryGrid />
          </Container>

          <DecorativeLine 
            src="/line_primary_reverse.png"
          />
        <Container maxWidth="lg" sx={{ mb: 12, mt: 12 , position: 'relative', zIndex: 2}}>
          {/* Pricing Section */}
          <Box id="pricing" sx={{ py: 4}}>
            <Container maxWidth="lg">
              <Typography variant="h3" align="center" gutterBottom color="primary.main" sx={{ fontSize: { xs: '2rem', md: '4rem' } }}>
                Choose Your Plan
              </Typography>
              <Typography variant="h6" align="center" sx={{ mb: 4, color: 'text.secondary', fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
                Select the perfect plan for your needs
              </Typography>

              {/* Billing Cycle Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                <ToggleButtonGroup
                  value={billingCycle}
                  exclusive
                  onChange={useCallback((e: any, value: any) => {
                    if (value) {
                      setBillingCycle(value);
                      // Emit analytics event for billing cycle change
                      trackBillingCycleChanged(value);
                    }
                  }, [setBillingCycle])}
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      minWidth: '200px', // Increased width to prevent wrapping
                      whiteSpace: 'nowrap', // Prevent text wrapping
                      border: `1px solid ${theme.palette.primary.main}`,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value="monthly"><Typography variant="h6" align="center" sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>Monthly</Typography></ToggleButton>
                  <ToggleButton value="yearly"><Typography variant="h6" align="center" sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>Yearly (Save 50%+)</Typography></ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Pricing Cards */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr', lg: 'repeat(3, 1fr)' },
                gap: 4,
                mt: 4
              }}>
                {plans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className="pricing-card"
                    sx={{ 
                      p: 3,
                      borderRadius: 3,
                      border: `1px solid ${plan.popular ? theme.palette.primary.main : theme.palette.primary.light}30`,
                      backgroundColor: plan.popular ? `${theme.palette.secondary.light}` : `${theme.palette.secondary.light}`,
                      position: 'relative',
                      transition: 'transform 0.2s',
                      overflow: 'visible',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }
                    }}
                    onClick={(event: any) => {
                      handleClickOpen('pricing_cards');
                      trackSignupCardsClick(plan.id);
                    }}
                  >
                    {plan.popular && (
                      <Box sx={{ 
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        zIndex: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(115deg, transparent, rgba(255,255,255,0.2), transparent)',
                          animation: 'shimmer 2s infinite',
                          transform: 'translateX(-100%)',
                        },
                        '@keyframes shimmer': {
                          '100%': {
                            transform: 'translateX(100%)',
                          },
                        },
                      }}>
                        Most Popular
                      </Box>
                    )}
                    <CardContent sx={{ 
                      p: 0, 
                      position: 'relative', 
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" gutterBottom color="primary.main">
                          {plan.title}
                        </Typography>
                        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
                          ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {billingCycle === 'monthly' ? 'per month' : 'per month'}
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={plan.features.modelCount} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={plan.features.photoCount} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={plan.features.quality} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={plan.features.likeness} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={plan.features.parallel} />
                          </ListItem>
                          {plan.features.other?.map((feature, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CheckCircleIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      <Button 
                        fullWidth 
                        variant={plan.popular ? "contained" : "outlined"}
                        color="primary"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          handleClickOpen('pricing_plan_button');
                        }}
                        sx={{ 
                          mt: 3,
                          position: 'relative',
                          zIndex: 2
                        }}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Container>
          </Box>
        </Container>
 
        <Container maxWidth="lg" sx={{ mb: 12, mt: 12 , position: 'relative', zIndex: 2}}>
          
                    
          {/* CTA */}
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 6, 
              px: 3,
              background: `linear-gradient(145deg, ${theme.palette.primary.light}15, ${theme.palette.primary.main}25)`,
              borderRadius: 4,
              border: `1px solid ${theme.palette.primary.light}30`
            }}
          >
            <Typography variant="h4" gutterBottom color="primary.main" sx={{ fontSize: { xs: '2.0rem', md: '2.4rem', lg: '2.8rem' } }}>
              Ready to transform your shopping experience?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', fontSize: { xs: '1.1rem', md: '1.2rem' } }}>
              Join thousands of users who are already using Lovit to visualize themselves in any outfit before making a purchase.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => handleClickOpen('final_cta')}
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                py: { xs: 1, sm: 2, md: 2 },
                px: { xs: 4, sm: 6, md: 6 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '200%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'shimmer 3s infinite',
                  transform: 'translateX(-100%)',
                },
                '@keyframes shimmer': {
                  '0%': {
                    transform: 'translateX(-100%)',
                  },
                  '100%': {
                    transform: 'translateX(50%)',
                  },
                },
              }}
            >
              Try it, Lovit!
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Sign up with email
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* FAQ and Niche Route Simple Lists */}
      <Container maxWidth="lg" sx={{ mb: 8, mt: 2, position: 'relative', zIndex: 2 }}>
        {/* FAQ List - visually identical to FAQPage */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'text.secondary', letterSpacing: 1 }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {faqItems.map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  bgcolor: 'background.paper',
                  p: 0,
                  mb: 0,
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                  },
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 56,
                }}
                onClick={() => window.location.href = `/faq/${item.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
              >
                <Box sx={{ flex: 1, px: 3, py: 2, fontWeight: 600, color: 'text.primary', fontSize: { xs: '1rem', md: '1.1rem' } }}>
                  {item.question}
                </Box>
                <ArrowForwardIcon sx={{ color: 'text.secondary', mr: 2 }} />
              </Paper>
            ))}
          </Box>
        </Box>
        {/* Niche Routes List - columns of basic text links */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'text.secondary', letterSpacing: 1 }}>
            Explore More
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
              gap: 0.5,
              pl: 1,
            }}
          >
            {routeConfigs.slice(1).map((route, index) => (
              <Box
                key={index}
                component="button"
                onClick={() => {
                  navigate(route.path);
                  window.scrollTo(0, 0);
                }}
                sx={{
                  display: 'block',
                  fontSize: { xs: '0.8rem', md: '0.8rem' },
                  fontWeight: 500,
                  py: 1,
                  px: 0,
                  width: '100%',
                  textAlign: 'left',
                  transition: 'color 0.2s',
                  color: 'text.primary',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                }}
              >
                {route.title.split('|')[0].trim()}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto',
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <RouterLink 
              to="/terms" 
              style={{ 
                textDecoration: 'none', 
                color: theme.palette.text.secondary,
                fontSize: '0.875rem'
              }}
            >
              Terms of Service
            </RouterLink>
            <Typography 
              component="span" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: '0.875rem'
              }}
            >
              •
            </Typography>
            <RouterLink 
              to="/privacy" 
              style={{ 
                textDecoration: 'none', 
                color: theme.palette.text.secondary,
                fontSize: '0.875rem'
              }}
            >
              Privacy Policy
            </RouterLink>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 1 }}
          >
            © {new Date().getFullYear()} Lovit. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 


