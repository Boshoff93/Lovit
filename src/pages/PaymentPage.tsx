import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { SEO } from '../utils/seoHelper';
import {
  Box,
  Container,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Snackbar,
  keyframes,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GruviCoin from '../components/GruviCoin';
import SecurityIcon from '@mui/icons-material/Security';
import DiamondIcon from '@mui/icons-material/Diamond';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VideocamIcon from '@mui/icons-material/Videocam';
import ShareIcon from '@mui/icons-material/Share';
import { AnimatedPrice, PulsingBadge, FeatureComparison } from '../components/pricing';
import { gruviGradients } from '../index';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createCheckoutSession, 
  createPortalSession,
} from '../store/authSlice';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';
import { useAccountData } from '../hooks/useAccountData';
import { useAuth } from '../hooks/useAuth';
import { useTabHeaders } from '../hooks/useTabHeaders';
import {
  trackPaymentPageView,
  trackPlanSelected,
  trackBillingCycleChanged,
  trackCheckoutStarted,
  trackSubscriptionManagement,
  trackCustomerJourneyMilestone
} from '../utils/analytics';
import { stripeConfig, topUpBundles } from '../config/stripe';
import { MarketingHeader } from '../components/marketing';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

interface PricePlan {
  id: string;
  title: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  tokens: number;
  gradient: string;
  stripePrices: {
    monthly: string;
    yearly: string;
  };
  productId: string;
}

// TikTok icon component (not available in MUI icons)
const TikTokIcon: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    sx={{ width: 16, height: 16, ...sx }}
  >
    <path
      fill="currentColor"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
    />
  </Box>
);

// Social platform icons component for pricing cards
const SocialPlatformIcons: React.FC = () => (
  <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center', flexWrap: 'wrap' }}>
    <Box sx={{
      width: 24, height: 24, borderRadius: '50%',
      background: 'linear-gradient(135deg, #E4405F, #C13584, #833AB4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <InstagramIcon sx={{ fontSize: 14, color: '#fff' }} />
    </Box>
    <Box sx={{
      width: 24, height: 24, borderRadius: '50%',
      background: '#1877F2',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <FacebookIcon sx={{ fontSize: 14, color: '#fff' }} />
    </Box>
    <Box sx={{
      width: 24, height: 24, borderRadius: '50%',
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <XIcon sx={{ fontSize: 12, color: '#fff' }} />
    </Box>
    <Box sx={{
      width: 24, height: 24, borderRadius: '50%',
      background: '#0A66C2',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <LinkedInIcon sx={{ fontSize: 14, color: '#fff' }} />
    </Box>
    <Box sx={{
      width: 24, height: 24, borderRadius: '50%',
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <TikTokIcon sx={{ color: '#fff' }} />
    </Box>
    <Box sx={{
      width: 24, height: 24, borderRadius: '50%',
      background: '#FF0000',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <YouTubeIcon sx={{ fontSize: 14, color: '#fff' }} />
    </Box>
  </Box>
);

// Token costs:
// 1 Short Song = 25 tokens, 1 Standard Song = 50 tokens
// 1 Still Image Video = 200 tokens
// 1 Cinematic Video = 50 tokens per 10 seconds

const plans: PricePlan[] = [
  {
    id: 'starter',
    title: 'Starter',
    tagline: 'Create videos while others are still writing scripts',
    monthlyPrice: 39,
    yearlyPrice: 348, // $29/mo × 12 (25% off)
    tokens: 5000,
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    features: [
      'AI Music Videos',
      'AI Avatar Videos',
      'AI Songs',
      'AI Voiceovers',
      'AI Character Swap',
      'Scheduled Posts',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.starter.monthly,
      yearly: stripeConfig.starter.yearly
    },
    productId: stripeConfig.starter.productId
  },
  {
    id: 'scale',
    title: 'Scale',
    tagline: 'Go viral while competitors are still planning',
    monthlyPrice: 99,
    yearlyPrice: 828, // $69/mo × 12 (30% off)
    popular: true,
    tokens: 20000,
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    features: [
      'AI Music Videos',
      'AI Avatar Videos',
      'AI Songs',
      'AI Voiceovers',
      'AI Character Swap',
      'Scheduled Posts',
      'Priority generation',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.scale.monthly,
      yearly: stripeConfig.scale.yearly
    },
    productId: stripeConfig.scale.productId
  },
  {
    id: 'beast',
    title: 'Content Engine',
    tagline: 'Flood the feed while the competition falls behind',
    monthlyPrice: 199,
    yearlyPrice: 1788, // $149/mo × 12 (25% off)
    tokens: 50000,
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
    features: [
      'AI Music Videos',
      'AI Avatar Videos',
      'AI Songs',
      'AI Voiceovers',
      'AI Character Swap',
      'Scheduled Posts',
      'Priority generation',
      'Dedicated support',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.hardcore.monthly,
      yearly: stripeConfig.hardcore.yearly
    },
    productId: stripeConfig.hardcore.productId
  }
];

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

// Purple-blue themed Section Divider matching SocialMediaPage style
const SectionDivider: React.FC = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 10,
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, transparent 15%, rgba(139,92,246,0.2) 35%, rgba(139,92,246,0.25) 50%, rgba(139,92,246,0.2) 65%, transparent 85%, transparent 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-2px',
          left: '30%',
          right: '30%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.05) 30%, rgba(139,92,246,0.08) 50%, rgba(139,92,246,0.05) 70%, transparent 100%)',
          filter: 'blur(2px)',
        },
      }}
    />
  </Box>
);

const PaymentPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);
  const [isManagingSubscription, setIsManagingSubscription] = useState<boolean>(false);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [loadingTopUpId, setLoadingTopUpId] = useState<string | null>(null);
  const [topUpError, setTopUpError] = useState<string | null>(null);

  // Auth modal state
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const navigate = useNavigate();
  const theme = useTheme();

  // Dynamic headers based on route
  const headers = useTabHeaders();

  // Check if audio player is active to add bottom padding
  const { currentSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state from Redux
  const { isLoading, subscription } = useSelector((state: RootState) => state.auth);

  // Use account data hook
  const { fetchAccountData } = useAccountData(false);

  // Get auth functions from useAuth
  const { logout, login, signup, googleLogin, getGoogleIdToken, resendVerificationEmail, error: useAuthError } = useAuth();

  const proceedRef = useRef<HTMLDivElement>(null);
  const plansSectionRef = useRef<HTMLDivElement>(null);

  // Auto-select current plan if user has one (only if no plan is currently selected)
  useEffect(() => {
    if (subscription?.tier && subscription.tier !== 'free' && !selectedPlan) {
      setSelectedPlan(subscription.tier);
    }
  }, [subscription, selectedPlan]);
  
  // Track page view on mount
  useEffect(() => {
    trackPaymentPageView();
    fetchAccountData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for success query param (for Stripe redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get('success');
    
    if (successParam === 'true') {
      setSuccess('Payment successful! Your subscription has been updated.');
      // Clear the URL parameters after reading them
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh account data
      fetchAccountData(true);
    } else if (successParam === 'false') {
      setError('Payment was not completed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use Intersection Observer to detect if proceed button is in viewport
  useEffect(() => {
    if (!proceedRef.current || !selectedPlan || !isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsButtonVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(proceedRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [selectedPlan, isMobile]);

  const handleToggleInterval = useCallback(() => {
    const newCycle = !isYearly ? 'yearly' : 'monthly';
    trackBillingCycleChanged(newCycle, selectedPlan || undefined);
    setIsYearly(!isYearly);
  },[setIsYearly, isYearly, selectedPlan]);

  const handleSelectPlan = useCallback((planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
      const billing_cycle = isYearly ? 'yearly' : 'monthly';
      trackPlanSelected(planId, plan.title, price, billing_cycle);
    }
    setSelectedPlan(planId);
  },[setSelectedPlan, isYearly]);

  const handleProceedToPayment = useCallback(async () => {
    if (!selectedPlan) return;
    
    // Find the selected plan
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;
    
    // Get the appropriate price ID based on billing interval
    const priceId = isYearly ? plan.stripePrices.yearly : plan.stripePrices.monthly;
    const productId = plan.productId;
    
    try {
      setError(null);
    
      // Track checkout started
      const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
      const billing_cycle = isYearly ? 'yearly' : 'monthly';
      
      trackCheckoutStarted(plan.id, plan.title, price, billing_cycle);
      trackCustomerJourneyMilestone('checkout_started', {
        plan_id: plan.id,
        plan_name: plan.title,
        price: price,
        billing_cycle: billing_cycle
      });
      
      // Use the Redux action to create a checkout session
      const resultAction = await dispatch(createCheckoutSession({ priceId, productId }));
      
      if (createCheckoutSession.fulfilled.match(resultAction)) {
        // Redirect to Stripe checkout
        if (resultAction.payload.url) {
          window.location.href = resultAction.payload.url;
        }
      } else if (createCheckoutSession.rejected.match(resultAction)) {
        setError(resultAction.payload as string || 'Failed to create checkout session');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  },[dispatch, selectedPlan, isYearly]);

  const handleManageSubscription = useCallback(async () => {
    try {
      setError(null);
      setIsManagingSubscription(true);
      
      trackSubscriptionManagement();
      
      // Use the Redux action to create a portal session
      const resultAction = await dispatch(createPortalSession());
      
      if (createPortalSession.fulfilled.match(resultAction)) {
        // Redirect to Stripe customer portal
        if (resultAction.payload.url) {
          window.location.href = resultAction.payload.url;
        }
      } else if (createPortalSession.rejected.match(resultAction)) {
        setError(resultAction.payload as string || 'Failed to access subscription management');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsManagingSubscription(false);
    }
  },[dispatch]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  },[logout, navigate]);

  // Auth modal handlers
  const handleOpenAuth = useCallback(() => {
    setAuthOpen(true);
    setAuthError(null);
  }, []);

  const handleCloseAuth = useCallback(() => {
    setAuthOpen(false);
    setIsAuthLoading(false);
    setIsGoogleLoading(false);
    setAuthError(null);
  }, []);

  const handleAuthTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setAuthTab(newValue);
    setAuthError(null);
  }, []);

  const handleEmailLogin = useCallback(async () => {
    try {
      setIsAuthLoading(true);
      setAuthError(null);

      if (!email || !password) {
        setAuthError('Please fill in all fields');
        setIsAuthLoading(false);
        return;
      }

      const result = await login(email, password);

      if (result.type.endsWith('/fulfilled')) {
        setIsAuthLoading(false);
        handleCloseAuth();
        fetchAccountData(true);
      } else {
        setIsAuthLoading(false);
        setAuthError(result.payload || 'Login failed. Please try again.');
      }
    } catch (error: any) {
      setIsAuthLoading(false);
      setAuthError(useAuthError || 'Login failed. Please try again.');
    }
  }, [login, email, password, handleCloseAuth, fetchAccountData, useAuthError]);

  const handleEmailSignup = useCallback(async () => {
    try {
      setIsAuthLoading(true);
      setAuthError(null);

      if (!email || !password || !username) {
        setAuthError('Please fill in all fields');
        setIsAuthLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setAuthError('Please enter a valid email address');
        setIsAuthLoading(false);
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        setAuthError('Password must be at least 8 characters with uppercase, number, and special character');
        setIsAuthLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setAuthError('Passwords do not match');
        setIsAuthLoading(false);
        return;
      }

      const result = await signup(email, password, username);

      if (result.type.endsWith('/fulfilled')) {
        setIsAuthLoading(false);
        handleCloseAuth();
        setSuccess('Account created! Please check your email to verify.');
      } else {
        setIsAuthLoading(false);
        setAuthError(result.payload || 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      setIsAuthLoading(false);
      setAuthError(useAuthError || 'Signup failed. Please try again.');
    }
  }, [signup, email, password, confirmPassword, username, handleCloseAuth, useAuthError]);

  const handleGoogleSignup = useCallback(async () => {
    try {
      setIsGoogleLoading(true);
      setAuthError(null);

      const accessToken = await getGoogleIdToken();
      const result = await googleLogin(accessToken);

      if (result.type === 'auth/loginWithGoogle/fulfilled') {
        const userData = result.payload.user;

        if (!userData.isVerified) {
          try {
            await resendVerificationEmail(userData.email);
            setSuccess('Verification email sent - please check your inbox.');
          } catch (err) {
            console.error('Failed to resend verification email:', err);
          }
        }
        handleCloseAuth();
        fetchAccountData(true);
      } else {
        setAuthError(result.payload || 'Google login failed.');
      }
    } catch (error: any) {
      if (error.error === 'popup_closed_by_user') {
        setAuthError('Google sign-in was cancelled.');
      } else {
        setAuthError(useAuthError || 'Google sign-in failed.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }, [googleLogin, getGoogleIdToken, resendVerificationEmail, handleCloseAuth, fetchAccountData, useAuthError]);

  const handleAuthKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAuthLoading) {
      if (authTab === 0) {
        handleEmailLogin();
      } else {
        handleEmailSignup();
      }
    }
  }, [authTab, handleEmailLogin, handleEmailSignup, isAuthLoading]);

  // Determine the button text based on subscription status
  const getButtonText = useCallback(() => {
    if (isLoading) {
      return <CircularProgress size={24} color="inherit" />;
    }
    
    return 'Proceed to Payment';
  },[isLoading]);

  const handleButtonClick = useCallback(() => {
    handleProceedToPayment();
  },[handleProceedToPayment]);

  // Direct checkout for a specific plan (used by card CTA buttons)
  const handleStartTrial = useCallback(async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    // Set loading state for this plan
    setLoadingPlanId(planId);

    // Get the appropriate price ID based on billing interval
    const priceId = isYearly ? plan.stripePrices.yearly : plan.stripePrices.monthly;
    const productId = plan.productId;

    try {
      setError(null);

      // Track checkout started
      const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
      const billing_cycle = isYearly ? 'yearly' : 'monthly';

      trackCheckoutStarted(plan.id, plan.title, price, billing_cycle);
      trackCustomerJourneyMilestone('checkout_started', {
        plan_id: plan.id,
        plan_name: plan.title,
        price: price,
        billing_cycle: billing_cycle
      });

      // Use the Redux action to create a checkout session
      const resultAction = await dispatch(createCheckoutSession({ priceId, productId }));

      if (createCheckoutSession.fulfilled.match(resultAction)) {
        // Redirect to Stripe checkout
        if (resultAction.payload.url) {
          window.location.href = resultAction.payload.url;
        }
      } else if (createCheckoutSession.rejected.match(resultAction)) {
        setError(resultAction.payload as string || 'Failed to create checkout session');
        setLoadingPlanId(null);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoadingPlanId(null);
    }
  },[dispatch, isYearly]);

  const scrollToProceed = useCallback(() => {
    proceedRef.current?.scrollIntoView({ behavior: 'smooth' });
  },[proceedRef]);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#0D0D0F',
      color: '#fff',
      position: 'relative',
      // Add bottom padding when audio player is visible
      pb: hasActivePlayer ? 12 : 0,
      pt: { xs: 8, md: 10 }, // Add top padding for fixed header
    }}>
      {/* Decorative gradient orbs */}
      <Box sx={{
        position: 'fixed',
        top: '5%',
        left: '5%',
        width: '50%',
        height: '60%',
        background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'fixed',
        top: '20%',
        right: '0%',
        width: '45%',
        height: '50%',
        background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'fixed',
        bottom: '10%',
        left: '20%',
        width: '40%',
        height: '45%',
        background: 'radial-gradient(ellipse at center, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      {/* Marketing Header */}
      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* SEO */}
      <SEO
        title="Gruvi Pricing & Plans | AI Music Promo Generator | Create & Publish Everywhere"
        description="Choose the perfect Gruvi plan. Starter $29/mo (5,000 tokens), Scale $69/mo (20,000 tokens), or Content Engine $149/mo (50,000 tokens). Create AI music videos and publish to all social platforms. Save 25% with yearly billing."
        keywords="Gruvi pricing, AI music promo generator, music video generator pricing, subscription plans, AI content creator, viral video maker, token pricing, Gruvi Scale, Gruvi Content Engine, commercial license"
        ogTitle="Gruvi AI: The AI Music Promo Generator | Pricing & Plans"
        ogDescription="Create viral music promos with AI. Publish to YouTube, TikTok, Instagram & more. Plans from $29/mo with yearly savings."
        ogType="website"
        ogUrl="https://gruvimusic.com/payment"
        canonicalUrl="https://gruvimusic.com/payment"
      />

      {/* Hero Section with gradient */}
      <Box sx={{
        background: 'linear-gradient(180deg, #0D0D0F 0%, #0F0A14 30%, #1A1028 60%, #1E1435 100%)',
        position: 'relative',
        pb: { xs: 10, md: 10 },
      }}>
        <Container maxWidth="lg">
          {/* Hero Section - Followr Style */}
          <Box sx={{
            textAlign: 'center',
            mb: { xs: 2, md: 3 },
            pt: { xs: 4, md: 8 },
          }}>
          <Chip
            label={headers.badge}
            size="small"
            sx={{
              mb: 2,
              background: 'rgba(192, 132, 252, 0.15)',
              color: '#C084FC',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              borderRadius: '12px',
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 800,
              fontFamily: '"Fredoka", "Nunito", sans-serif',
              mb: 3,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: '#fff',
            }}
          >
            {headers.titlePrefix}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #C084FC 0%, #A78BFA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {headers.titleHighlight}
            </Box>
            {headers.titleSuffix}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.7,
              mt: 2,
            }}
          >
            {headers.subtitle}
          </Typography>
        </Box>
        </Container>
        <SectionDivider />
      </Box>

      {/* Plans Section with gradient */}
      <Box sx={{
        background: 'linear-gradient(180deg, #1E1435 0%, #140E1A 30%, #0E0A10 50%, #140E1A 70%, #1A1230 100%)',
        position: 'relative',
        pt: { xs: 6, md: 10 },
        pb: { xs: 10, md: 10 },
      }}>
        <Container maxWidth="lg">
          {/* Plans Section Header */}
        <Box ref={plansSectionRef} sx={{ textAlign: 'center', mb: { xs: 4, md: 5 }, mt: { xs: 2, md: 4 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              fontFamily: '"Fredoka", "Nunito", sans-serif',
              color: '#fff',
              mb: 1,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Choose Your
          </Typography>
          <Typography
            component="div"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              fontFamily: '"Fredoka", "Nunito", sans-serif',
              mb: 3,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Creative Power Level
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            From solo creators to enterprise teams, unlock unlimited AI-powered content creation.
            Every plan includes access to AI images, videos, avatars, and viral shorts.
          </Typography>
        </Box>

        {/* Current Plan & Manage Subscription - shown for subscribed users, above cards */}
        {subscription && subscription.tier !== 'free' && (() => {
          // Get tier-specific colors
          const tierColors: Record<string, { gradient: string; bgColor: string; borderColor: string; shadowColor: string }> = {
            starter: {
              gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
              bgColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 0.2)',
              shadowColor: 'rgba(59, 130, 246, 0.3)',
            },
            pro: {
              gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
              bgColor: 'rgba(236, 72, 153, 0.1)',
              borderColor: 'rgba(236, 72, 153, 0.2)',
              shadowColor: 'rgba(236, 72, 153, 0.3)',
            },
            premium: {
              gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
              bgColor: 'rgba(249, 115, 22, 0.1)',
              borderColor: 'rgba(249, 115, 22, 0.2)',
              shadowColor: 'rgba(249, 115, 22, 0.3)',
            },
          };
          const colors = tierColors[subscription.tier] || tierColors.starter;

          return (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            py: 3,
            px: 4,
            maxWidth: '600px',
            mx: 'auto',
            background: colors.bgColor,
            borderRadius: '16px',
            border: `1px solid ${colors.borderColor}`,
            flexWrap: 'wrap',
            gap: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: colors.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SecurityIcon sx={{ fontSize: 24, color: '#fff' }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '1.1rem' }}>
                  {subscription.tier === 'premium' ? 'Content Engine' : subscription.tier === 'pro' ? 'Scale' : subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {subscription.currentPeriodEnd && subscription.currentPeriodEnd > 0
                    ? `Next billing: ${new Date(Number(subscription.currentPeriodEnd) * 1000).toLocaleDateString()}`
                    : 'Active subscription'}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={handleManageSubscription}
              disabled={isManagingSubscription}
              sx={{
                background: colors.gradient,
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '100px',
                px: 3,
                py: 1.25,
                minWidth: 180,
                boxShadow: `0 4px 12px ${colors.shadowColor}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: `0 6px 16px ${colors.shadowColor}`,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {isManagingSubscription ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={18} color="inherit" />
                  <span>Loading...</span>
                </Box>
              ) : (
                'Manage Subscription'
              )}
            </Button>
          </Box>
          );
        })()}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '12px',
                background: 'rgba(255, 59, 48, 0.1)',
                border: '1px solid rgba(255, 59, 48, 0.2)',
                color: '#D70015',
              }}
            >
              {error}
            </Alert>
          )}

          <Snackbar
            open={!!success}
            autoHideDuration={6000}
            onClose={() => setSuccess(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ mt: 7 }}
          >
            <Alert
              onClose={() => setSuccess(null)}
              severity="success"
              sx={{
                borderRadius: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                color: '#22C55E',
              }}
            >
              {success}
            </Alert>
          </Snackbar>

          {/* Billing Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={isYearly}
                onChange={handleToggleInterval}
                sx={{
                  '& .MuiSwitch-switchBase': {
                    color: '#6B7280',
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#34C759',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#34C759',
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontWeight: isYearly ? 'normal' : 'bold',
                    color: isYearly ? 'rgba(255,255,255,0.5)' : '#fff'
                  }}
                >
                  Monthly
                </Typography>
                <Box sx={{ mx: 1, color: 'rgba(255,255,255,0.3)' }}>|</Box>
                <Typography
                  sx={{
                    fontWeight: isYearly ? 'bold' : 'normal',
                    color: isYearly ? '#fff' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  Yearly
                </Typography>
                {isYearly && (
                  <Chip
                    label="Save 25%"
                    size="small"
                    sx={{
                      ml: 1,
                      background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 22,
                    }}
                  />
                )}
              </Box>
            }
            labelPlacement="end"
          />
        </Box>

        {/* Pricing Cards - Followr-style vibrant gradients */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            maxWidth: '1100px',
            mx: 'auto',
          }}
        >
          {plans.map((plan, index) => (
            <Card
              key={plan.id}
              onClick={() => {
                if (!subscription || subscription.tier === 'free') {
                  handleStartTrial(plan.id);
                }
              }}
              sx={{
                background: plan.popular
                  ? 'linear-gradient(145deg, rgba(30,30,35,1) 0%, rgba(25,25,30,1) 100%)'
                  : 'rgba(255,255,255,0.03)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'visible',
                cursor: (!subscription || subscription.tier === 'free') ? 'pointer' : 'default',
                border: selectedPlan === plan.id
                  ? `3px solid ${plan.id === 'starter' ? '#3B82F6' : plan.id === 'scale' ? '#EC4899' : '#F97316'}`
                  : plan.popular
                    ? '2px solid rgba(236,72,153,0.5)'
                    : plan.id === 'beast'
                      ? '2px solid rgba(249,115,22,0.4)'
                      : '1px solid rgba(255,255,255,0.1)',
                boxShadow: selectedPlan === plan.id
                  ? (plan.id === 'starter' ? '0 20px 60px rgba(59,130,246,0.3)' : plan.id === 'scale' ? '0 20px 60px rgba(236,72,153,0.3)' : '0 20px 60px rgba(249,115,22,0.35)')
                  : plan.popular
                    ? '0 24px 80px rgba(236,72,153,0.2)'
                    : plan.id === 'beast'
                      ? '0 16px 60px rgba(249,115,22,0.15)'
                      : '0 8px 40px rgba(0,0,0,0.2)',
                // Popular card is scaled up
                transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
                zIndex: plan.popular ? 2 : 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                // Staggered animation on mount
                animation: `cardFadeIn 0.5s ease ${index * 100}ms forwards`,
                opacity: 0,
                '@keyframes cardFadeIn': {
                  from: { opacity: 0, transform: plan.popular ? 'scale(0.98) translateY(20px)' : 'scale(0.95) translateY(20px)' },
                  to: { opacity: 1, transform: plan.popular ? 'scale(1.03)' : 'scale(1)' },
                },
                '&:hover': {
                  transform: (!subscription || subscription.tier === 'free')
                    ? (plan.popular ? 'scale(1.06) translateY(-8px)' : 'scale(1.02) translateY(-8px)')
                    : (plan.popular ? 'scale(1.03)' : 'none'),
                  boxShadow: plan.popular
                    ? '0 32px 80px rgba(236,72,153,0.3)'
                    : '0 24px 60px rgba(0,0,0,0.3)',
                  background: plan.popular
                    ? 'linear-gradient(145deg, rgba(35,35,40,1) 0%, rgba(30,30,35,1) 100%)'
                    : 'rgba(255,255,255,0.05)',
                },
              }}
            >
              {/* Most Popular Badge - Using PulsingBadge component */}
              {plan.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                  }}
                >
                  <PulsingBadge
                    label="Most Popular"
                    gradient={plan.gradient}
                    size="medium"
                  />
                </Box>
              )}

              {/* Gradient Header with Token Display */}
              <Box
                sx={{
                  background: plan.gradient,
                  borderRadius: '21px 21px 0 0',
                  p: 3,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Sparkle effects */}
                <Box sx={{
                  position: 'absolute',
                  top: '20%',
                  left: '15%',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.6)',
                }} />
                <Box sx={{
                  position: 'absolute',
                  top: '60%',
                  right: '20%',
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.5)',
                }} />

                {/* Gem/Diamond Icon - Followr style */}
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                  <DiamondIcon sx={{ fontSize: 32, color: '#fff' }} />
                </Box>

                {/* Token Number */}
                <Typography
                  sx={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: '#fff',
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  {plan.tokens.toLocaleString()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                  }}
                >
                  AI Media Tokens per month
                </Typography>
              </Box>

              <CardContent sx={{ p: 3, pt: 2.5 }}>
                {/* Plan Title */}
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    background: plan.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    mb: 0.5,
                  }}
                >
                  {plan.title}
                </Typography>

                {/* Tagline */}
                <Typography
                  sx={{
                    fontSize: '0.9rem',
                    color: '#fff',
                    textAlign: 'center',
                    mb: 2,
                    minHeight: 40,
                    fontWeight: 500,
                  }}
                >
                  {plan.tagline}
                </Typography>

                {/* Price - Using AnimatedPrice component */}
                <Box sx={{ textAlign: 'center', mb: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                  <AnimatedPrice
                    price={isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                    duration={400}
                    fontSize="2.5rem"
                    fontWeight={800}
                    color="#fff"
                  />
                  <Typography
                    component="span"
                    sx={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', ml: 0.5 }}
                  >
                    /month
                  </Typography>
                </Box>

                {/* Billed annually text */}
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'center',
                    mb: 2.5,
                  }}
                >
                  {isYearly
                    ? `Billed annually: $${plan.yearlyPrice} • Save 25%`
                    : `Or $${Math.round(plan.yearlyPrice / 12)}/mo billed yearly`}
                </Typography>

                {/* CTA Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!subscription || subscription.tier === 'free') {
                      handleStartTrial(plan.id);
                    }
                  }}
                  disabled={(subscription && subscription.tier !== 'free') || loadingPlanId === plan.id}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 2.5,
                    background: `${plan.gradient} !important`,
                    backgroundColor: 'transparent',
                    color: '#fff',
                    boxShadow: `0 4px 12px ${plan.id === 'starter' ? 'rgba(59,130,246,0.3)' : plan.id === 'scale' ? 'rgba(236,72,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    '&:hover': {
                      background: `${plan.gradient} !important`,
                      filter: 'brightness(1.1)',
                      boxShadow: `0 6px 20px ${plan.id === 'starter' ? 'rgba(59,130,246,0.4)' : plan.id === 'scale' ? 'rgba(236,72,153,0.4)' : 'rgba(239,68,68,0.4)'}`,
                    },
                    '&.Mui-disabled': {
                      background: loadingPlanId === plan.id ? `${plan.gradient} !important` : 'rgba(255,255,255,0.1) !important',
                      color: loadingPlanId === plan.id ? '#fff' : 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  {loadingPlanId === plan.id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                      <span>Loading...</span>
                    </Box>
                  ) : (
                    'Start Your Free Trial'
                  )}
                </Button>

                {/* Features List */}
                <List dense disablePadding sx={{ mb: 2 }}>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters sx={{ py: 0.4 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircleIcon sx={{
                          fontSize: 18,
                          background: plan.gradient,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          sx: { color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* Publish to All Platforms */}
                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.5)',
                      textAlign: 'center',
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    Publish to All Platforms
                  </Typography>
                  <SocialPlatformIcons />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        </Container>
        <SectionDivider />
      </Box>

      {/* Feature Highlights Section with gradient */}
      <Box sx={{
        background: 'linear-gradient(180deg, #1A1230 0%, #1E1438 40%, #251840 60%, #1E1438 100%)',
        position: 'relative',
        pt: { xs: 10, md: 10 },
        pb: { xs: 10, md: 10 },
      }}>
        <Container maxWidth="lg">
          {/* Feature Highlights Section */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Chip
            label="PLATFORM FEATURES"
            size="small"
            sx={{
              mb: 2,
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#A78BFA',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 26,
              borderRadius: '100px',
              letterSpacing: '0.05em',
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              fontWeight: 800,
              fontFamily: '"Fredoka", "Nunito", sans-serif',
              color: '#fff',
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Create Professional{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AI Content
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Everything you need to create, produce, and publish stunning AI-powered content
          </Typography>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          maxWidth: '1000px',
          mx: 'auto',
          mb: 2,
        }}>
          {[
            {
              icon: <MusicNoteIcon sx={{ fontSize: 28, color: '#fff' }} />,
              title: 'AI Music Generation',
              description: 'Create original songs with AI. Any genre, any mood, unlimited creativity.',
              gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
            },
            {
              icon: <VideocamIcon sx={{ fontSize: 28, color: '#fff' }} />,
              title: 'Cinematic Videos',
              description: 'Transform your music into stunning visual content for any platform.',
              gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
            },
            {
              icon: <ShareIcon sx={{ fontSize: 28, color: '#fff' }} />,
              title: 'Publish Everywhere',
              description: 'One-click publishing to TikTok, YouTube, Instagram, and more.',
              gradient: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
            },
          ].map((feature, index) => (
            <Box
              key={index}
              sx={{
                p: 3,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.06)',
                  transform: 'translateY(-4px)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: feature.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: `0 8px 24px ${feature.gradient.includes('#3B82F6') ? 'rgba(59,130,246,0.3)' : feature.gradient.includes('#EC4899') ? 'rgba(236,72,153,0.3)' : 'rgba(249,115,22,0.3)'}`,
                }}
              >
                {feature.icon}
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#fff',
                  mb: 1,
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          ))}
        </Box>
        </Container>
        <SectionDivider />
      </Box>

      {/* Feature Comparison Section with gradient */}
      <Box sx={{
        background: 'linear-gradient(180deg, #1E1438 0%, #140E18 40%, #0E0A10 60%, #140E18 100%)',
        position: 'relative',
        pt: { xs: 6, md: 10 },
        pb: { xs: 10, md: 10 },
      }}>
        <Container maxWidth="lg">
          {/* Feature Comparison Table */}
        <Box sx={{ maxWidth: '1100px', mx: 'auto' }}>
          <FeatureComparison defaultExpanded={true} darkMode />
        </Box>

        {/* Select Your Plan CTA Button */}
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            variant="contained"
            onClick={() => {
              if (plansSectionRef.current) {
                const headerOffset = 100; // Account for fixed header
                const elementPosition = plansSectionRef.current.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%) !important',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.1rem',
              borderRadius: '100px',
              px: 5,
              py: 1.5,
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(139,92,246,0.35)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(139,92,246,0.45)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Select Your Plan
          </Button>
        </Box>

        </Container>
        <SectionDivider />
      </Box>

      {/* Token Top-ups Section with gradient */}
      <Box sx={{
        background: 'linear-gradient(180deg, #140E18 0%, #1A1230 40%, #201538 60%, #1A1230 100%)',
        position: 'relative',
        pt: { xs: 6, md: 10 },
        pb: { xs: 10, md: 10 },
      }}>
        <Container maxWidth="lg">
          {/* Token Top-ups */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: '"Fredoka", "Nunito", sans-serif', color: '#fff', mb: 1, textAlign: 'center' }}>
              Token Top-Up Bundles
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', mb: 2, textAlign: 'center' }}>
              Need more tokens? Top-up tokens never expire!
            </Typography>

            {/* Top-up Error Alert */}
            {topUpError && (
              <Alert
                severity="error"
                onClose={() => setTopUpError(null)}
                sx={{
                  maxWidth: '600px',
                  mx: 'auto',
                  mb: 3,
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  '& .MuiAlert-icon': { color: '#EF4444' },
                }}
              >
                {topUpError}
              </Alert>
            )}

            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              maxWidth: '800px',
              mx: 'auto',
            }}>
              {topUpBundles.map((bundle, index) => {
                const isThisBundleLoading = loadingTopUpId === bundle.id;
                const isAnyLoading = loadingTopUpId !== null;
                return (
                <Card
                  key={bundle.id}
                  sx={{
                    flex: { sm: 1 },
                    maxWidth: { sm: 240 },
                    background: bundle.badge ? 'rgba(20, 20, 25, 0.95)' : 'rgba(20, 20, 25, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: bundle.badge ? '2px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'all 0.2s ease',
                    opacity: isAnyLoading && !isThisBundleLoading ? 0.5 : 1,
                  }}
                >
                  {bundle.badge && (
                    <Chip
                      label={bundle.badge}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: index === 2 ? '#34C759' : '#3B82F6',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.6rem',
                        zIndex: 1,
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      {bundle.tokens.toLocaleString()} x <GruviCoin size={22} />
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#3B82F6', mb: 1.5 }}>
                      ${bundle.price}
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={isAnyLoading || !subscription || subscription.tier === 'free'}
                      onClick={async () => {
                        if (isAnyLoading) return;
                        if (!subscription || subscription.tier === 'free') {
                          setTopUpError('Please subscribe to a plan first before purchasing top-up tokens.');
                          return;
                        }
                        try {
                          setTopUpError(null);
                          setLoadingTopUpId(bundle.id);
                          const resultAction = await dispatch(createCheckoutSession({
                            priceId: bundle.priceId,
                            productId: bundle.productId
                          }));
                          if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
                            window.location.href = resultAction.payload.url;
                          }
                        } catch (err: any) {
                          setTopUpError(err.message || 'Failed to create checkout session');
                        } finally {
                          setLoadingTopUpId(null);
                        }
                      }}
                      sx={{
                        py: 1,
                        borderRadius: '10px',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #2563EB 0%, #0891B2 100%)',
                        },
                        '&.Mui-disabled': {
                          background: isThisBundleLoading
                            ? 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
                            : 'rgba(255,255,255,0.12)',
                          color: isThisBundleLoading ? '#fff' : 'rgba(255,255,255,0.3)',
                        },
                      }}
                    >
                      {isThisBundleLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={18} sx={{ color: '#fff' }} />
                          <span>Loading...</span>
                        </Box>
                      ) : (
                        'Buy Now'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
              })}
            </Box>

            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
              Top-ups available in your account settings after subscribing
            </Typography>
          </Box>
        </Container>
        <SectionDivider />
      </Box>

      {/* FAQ Section with gradient */}
      <Box sx={{
        background: 'linear-gradient(180deg, #1A1230 0%, #120C18 50%, #0D0D0F 100%)',
        position: 'relative',
        py: { xs: 6, md: 10 },
      }}>
        <Container maxWidth="lg">
          {/* FAQ Section */}
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip
              label="FAQ"
              size="small"
              sx={{
                mb: 2,
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#4ADE80',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 26,
                borderRadius: '100px',
                letterSpacing: '0.05em',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontWeight: 700,
                fontFamily: '"Fredoka", "Nunito", sans-serif',
                color: '#fff',
                mb: 1,
              }}
            >
              Got Questions?{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                We've Got Answers
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '500px',
                mx: 'auto',
              }}
            >
              Everything you need to know about Gruvi
            </Typography>
          </Box>

          {/* FAQ Items */}
          {[
            {
              question: 'What are AI Media Tokens?',
              answer: 'AI Media Tokens are the credits you use to generate content on Gruvi. Different types of content cost different amounts: AI songs cost 25-50 tokens (short/standard), still image videos cost 200 tokens, and cinematic videos cost 50 tokens per 10 seconds based on audio length. Your monthly tokens refresh at the start of each billing cycle.',
            },
            {
              question: 'Can I cancel my subscription anytime?',
              answer: 'Yes! You can cancel your subscription at any time with no penalties. Your access will continue until the end of your current billing period. You can manage your subscription directly from the Pricing page or through the Stripe customer portal.',
            },
            {
              question: 'What happens if I run out of tokens?',
              answer: 'If you run out of monthly tokens, you can purchase top-up bundles that never expire. Alternatively, you can upgrade to a higher tier for more monthly tokens. Top-up tokens are used after your monthly allocation is depleted.',
            },
            {
              question: 'Do I own the content I create?',
              answer: 'Yes! All content you create with Gruvi comes with a commercial license. You own full rights to your AI-generated music, videos, and promotional content. Use them for personal projects, social media, or commercial purposes.',
            },
            {
              question: 'Can I switch between plans?',
              answer: 'Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the change takes effect at your next billing cycle.',
            },
          ].map((faq, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 3,
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  color: '#fff',
                  mb: 1.5,
                }}
              >
                {faq.question}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.7,
                }}
              >
                {faq.answer}
              </Typography>
            </Box>
          ))}
        </Box>
        </Container>
      </Box>

      {/* Only show arrow when "Proceed to Payment" button is not visible */}
      {isMobile && selectedPlan && !isButtonVisible && (
        <Box
          onClick={scrollToProceed}
          sx={{
            position: 'fixed',
            bottom: 20,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1000,
            animation: `${bounceAnimation} 2s infinite`,
            cursor: 'pointer'
          }}
        >
          <Box
            sx={{
              bgcolor: '#007AFF',
              color: 'white',
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(0,122,255,0.4)',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KeyboardArrowDownIcon fontSize="medium" />
          </Box>
        </Box>
      )}

      {/* Auth Dialog - Dark Theme */}
      <Dialog
        open={authOpen}
        onClose={handleCloseAuth}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            background: 'rgba(20, 20, 24, 0.95)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{
          pt: 4,
          pb: 0,
          px: 4,
          textAlign: 'center',
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#FFFFFF' }}>
            {authTab === 0 ? 'Welcome back' : 'Create account'}
          </Typography>
          <IconButton
            onClick={handleCloseAuth}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'rgba(255,255,255,0.6)',
              '&:hover': { background: 'rgba(255,255,255,0.1)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Tabs
            value={authTab}
            onChange={handleAuthTabChange}
            variant="fullWidth"
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'none',
              },
              '& .Mui-selected': {
                color: '#FFFFFF',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#007AFF',
              }
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {authError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  background: 'rgba(255, 59, 48, 0.1)',
                  border: '1px solid rgba(255, 59, 48, 0.2)',
                  color: '#D70015',
                  '& .MuiAlert-icon': { alignItems: 'center', color: '#D70015' },
                }}
              >
                {authError}
              </Alert>
            )}

            {authTab === 0 ? (
              <>
                <TextField
                  autoFocus
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleAuthKeyPress}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleAuthKeyPress}
                  sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <Box sx={{ textAlign: 'right', mb: 3 }}>
                  <Link
                    component={RouterLink}
                    to="/reset-password-request"
                    sx={{ fontSize: '0.875rem', color: '#007AFF', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Forgot password?
                  </Link>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleEmailLogin}
                  disabled={isAuthLoading}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    background: '#141418',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': { background: '#000' },
                  }}
                >
                  {isAuthLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
                </Button>
              </>
            ) : (
              <>
                <TextField
                  autoFocus
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleAuthKeyPress}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.05)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
                      '&.Mui-focused fieldset': { borderColor: '#007AFF' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
                    '& .MuiInputBase-input': { color: '#FFFFFF' },
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleEmailSignup}
                  disabled={isAuthLoading}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    background: '#141418',
                    color: '#fff',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': { background: '#000' },
                  }}
                >
                  {isAuthLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Account'}
                </Button>
              </>
            )}

            <Box sx={{ position: 'relative', my: 3 }}>
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '1px',
                background: 'rgba(255,255,255,0.1)'
              }} />
              <Typography
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  px: 2,
                  background: 'rgba(20, 20, 24, 0.95)',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.875rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                or
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={
                isGoogleLoading ? (
                  <CircularProgress size={18} sx={{ color: 'rgba(255,255,255,0.6)' }} />
                ) : (
                  <Box
                    component="img"
                    src="/google-color.svg"
                    alt="Google"
                    sx={{ width: 18, height: 18 }}
                  />
                )
              }
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                borderColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              Continue with Google
            </Button>

            {authTab === 1 && (
              <Typography
                sx={{
                  mt: 3,
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.5,
                }}
              >
                By signing up, you agree to our{' '}
                <Link component={RouterLink} to="/terms" sx={{ color: '#007AFF' }}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link component={RouterLink} to="/privacy" sx={{ color: '#007AFF' }}>
                  Privacy Policy
                </Link>
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PaymentPage;
