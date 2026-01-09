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
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BoltIcon from '@mui/icons-material/Bolt';
import SecurityIcon from '@mui/icons-material/Security';
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
import {
  trackPaymentPageView,
  trackPlanSelected,
  trackBillingCycleChanged,
  trackCheckoutStarted,
  trackSubscriptionManagement,
  trackCustomerJourneyMilestone
} from '../utils/analytics';
import { stripeConfig, topUpBundles } from '../config/stripe';

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
// 1 Song = 20 tokens
// 1 Still Image Video = 100 tokens
// 1 Animated/Cinematic Video = 1,000 tokens

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
      '5,000 AI Media Tokens/month',
      '~50 music promo videos',
      '~5 cinematic music videos',
      '~250 AI songs',
      'AI Music Generation',
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
      '20,000 AI Media Tokens/month',
      '~200 music promo videos',
      '~20 cinematic music videos',
      '~1,000 AI songs',
      'AI Music Generation',
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
    title: 'Beast',
    tagline: 'Flood the feed while the competition falls behind',
    monthlyPrice: 199,
    yearlyPrice: 1788, // $149/mo × 12 (25% off)
    tokens: 50000,
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
    features: [
      '50,000 AI Media Tokens/month',
      '~500 music promo videos',
      '~50 cinematic music videos',
      '~2,500 AI songs',
      'AI Music Generation',
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

const PaymentPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(true);
  const [isManagingSubscription, setIsManagingSubscription] = useState<boolean>(false);
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Check if audio player is active to add bottom padding
  const { currentSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  
  // Get auth state from Redux
  const { isLoading, subscription } = useSelector((state: RootState) => state.auth);
  
  // Use account data hook
  const { fetchAccountData } = useAccountData(false);
  
  // Get signout function from useAuth
  const { logout } = useAuth();

  const proceedRef = useRef<HTMLDivElement>(null);

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

  const scrollToProceed = useCallback(() => {
    proceedRef.current?.scrollIntoView({ behavior: 'smooth' });
  },[proceedRef]);

  return (
    <Box sx={{
      color: '#1D1D1F',
      position: 'relative',
      // Add bottom padding when audio player is visible
      pb: hasActivePlayer ? 12 : 0,
    }}>
      {/* SEO */}
      <SEO
        title="Gruvi Pricing & Plans | AI Music Promo Generator | Create & Publish Everywhere"
        description="Choose the perfect Gruvi plan. Starter $29/mo (5,000 tokens), Scale $69/mo (20,000 tokens), or Beast $149/mo (50,000 tokens). Create AI music videos and publish to all social platforms. Save 25% with yearly billing."
        keywords="Gruvi pricing, AI music promo generator, music video generator pricing, subscription plans, AI content creator, viral video maker, token pricing, Gruvi Scale, Gruvi Beast, commercial license"
        ogTitle="Gruvi AI: The Music Promo Generator | Pricing & Plans"
        ogDescription="Create viral music promos with AI. Publish to YouTube, TikTok, Instagram & more. Plans from $29/mo with yearly savings."
        ogType="website"
        ogUrl="https://gruvimusic.com/payment"
        canonicalUrl="https://gruvimusic.com/payment"
      />

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        {/* Current Plan Header - shown for subscribed users */}
        {subscription && subscription.tier !== 'free' && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SecurityIcon sx={{ fontSize: 24, color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                  {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Plan
                </Typography>
                <Typography variant="body2" sx={{ color: '#86868B' }}>
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
                background: '#007AFF',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                '&:hover': {
                  background: '#0066CC',
                  boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
                },
              }}
            >
              {isManagingSubscription ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Manage Subscription'
              )}
            </Button>
          </Box>
        )}

        {/* Choose Your Plan Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
        }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BoltIcon sx={{ fontSize: 24, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
              Choose Your Plan
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B' }}>
              Select the perfect plan for your needs
            </Typography>
          </Box>
        </Box>

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
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#007AFF',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#007AFF',
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontWeight: isYearly ? 'normal' : 'bold',
                    color: isYearly ? '#86868B' : '#1D1D1F'
                  }}
                >
                  Monthly
                </Typography>
                <Box sx={{ mx: 1, color: '#86868B' }}>|</Box>
                <Typography
                  sx={{
                    fontWeight: isYearly ? 'bold' : 'normal',
                    color: isYearly ? '#1D1D1F' : '#86868B'
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
          {plans.map((plan) => (
            <Card
              key={plan.id}
              onClick={() => {
                if (!subscription || subscription.tier === 'free') {
                  handleSelectPlan(plan.id);
                }
              }}
              sx={{
                background: '#fff',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'visible',
                cursor: (!subscription || subscription.tier === 'free') ? 'pointer' : 'default',
                border: selectedPlan === plan.id
                  ? `3px solid ${plan.id === 'starter' ? '#3B82F6' : plan.id === 'scale' ? '#EC4899' : '#F97316'}`
                  : plan.popular
                    ? '2px solid rgba(236,72,153,0.5)'
                    : '1px solid rgba(0,0,0,0.08)',
                boxShadow: selectedPlan === plan.id
                  ? (plan.id === 'starter' ? '0 20px 60px rgba(59,130,246,0.3)' : plan.id === 'scale' ? '0 20px 60px rgba(236,72,153,0.3)' : '0 20px 60px rgba(249,115,22,0.3)')
                  : plan.popular
                    ? '0 20px 60px rgba(236,72,153,0.2)'
                    : '0 8px 40px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: (!subscription || subscription.tier === 'free') ? 'translateY(-8px)' : 'none',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
                },
              }}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: plan.gradient,
                    color: '#fff',
                    px: 2.5,
                    py: 0.75,
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    border: '2px solid rgba(255,255,255,0.5)',
                    boxShadow: '0 4px 12px rgba(236,72,153,0.4), 0 0 20px rgba(255,255,255,0.3)',
                    zIndex: 10,
                  }}
                >
                  Most Popular
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

                {/* Shield Icon */}
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                }}>
                  <SecurityIcon sx={{ fontSize: 28, color: '#fff' }} />
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
                    fontSize: '0.85rem',
                    color: '#86868B',
                    textAlign: 'center',
                    mb: 2,
                    minHeight: 40,
                  }}
                >
                  {plan.tagline}
                </Typography>

                {/* Price */}
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: '#1D1D1F',
                    }}
                  >
                    ${isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{ fontSize: '1rem', color: '#86868B', ml: 0.5 }}
                  >
                    /month
                  </Typography>
                </Box>

                {/* Billed annually text */}
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    color: '#86868B',
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
                      handleSelectPlan(plan.id);
                    }
                  }}
                  disabled={subscription && subscription.tier !== 'free'}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    mb: 2.5,
                    background: plan.gradient,
                    color: '#fff',
                    boxShadow: selectedPlan === plan.id
                      ? (plan.id === 'starter' ? '0 4px 12px rgba(59,130,246,0.4)' : plan.id === 'scale' ? '0 4px 12px rgba(236,72,153,0.4)' : '0 4px 12px rgba(249,115,22,0.4)')
                      : '0 4px 16px rgba(0,0,0,0.2)',
                    '&:hover': {
                      filter: 'brightness(1.1)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(0,0,0,0.1)',
                      color: 'rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  {selectedPlan === plan.id ? '✓ Selected' : 'Get Started →'}
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
                          sx: { color: '#1D1D1F', fontSize: '0.875rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* Publish to All Platforms */}
                <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', pt: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#86868B',
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
        
        <Box ref={proceedRef} sx={{ mt: 4, textAlign: 'center' }}>
          {/* Proceed to Payment button - only for non-subscribers */}
          {(!subscription || subscription.tier === 'free') && (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                size="large"
                disabled={!selectedPlan || isLoading}
                onClick={handleButtonClick}
                sx={{
                  py: 1.5,
                  px: 6,
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: '#007AFF',
                  boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                  transition: 'all 0.2s ease',
                  width: { xs: '100%', sm: 'auto', md: 'auto' },
                  '&:hover': {
                    background: '#0066DD',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,122,255,0.4)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(0,0,0,0.1)',
                    color: 'rgba(0,0,0,0.3)',
                  },
                }}
              >
                {getButtonText()}
              </Button>
            </Box>
          )}
          
          {/* Token Top-ups */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1, textAlign: 'center' }}>
              Token Top-Up Bundles
            </Typography>
            <Typography sx={{ color: '#86868B', fontSize: '0.9rem', mb: 3, textAlign: 'center' }}>
              Need more tokens? Top-up tokens never expire!
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2, 
              justifyContent: 'center',
              maxWidth: '800px',
              mx: 'auto',
            }}>
              {topUpBundles.map((bundle, index) => (
                <Card
                  key={bundle.id}
                  onClick={async () => {
                    if (!subscription || subscription.tier === 'free') {
                      setError('Please subscribe to a plan first before purchasing top-up tokens.');
                      return;
                    }
                    try {
                      const resultAction = await dispatch(createCheckoutSession({ 
                        priceId: bundle.priceId,
                        productId: bundle.productId
                      }));
                      if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
                        window.location.href = resultAction.payload.url;
                      }
                    } catch (err: any) {
                      setError(err.message || 'Failed to create checkout session');
                    }
                  }}
                  sx={{
                    flex: { sm: 1 },
                    maxWidth: { sm: 240 },
                    background: bundle.badge ? 'rgba(0, 122, 255, 0.04)' : 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(20px)',
                    border: bundle.badge ? '2px solid rgba(0, 122, 255, 0.3)' : '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'visible',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,122,255,0.15)',
                      borderColor: '#007AFF',
                    },
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
                        background: index === 2 ? '#34C759' : '#007AFF', // Green for "Best Value", blue for others
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.6rem',
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                    {/* Lightning bolts - 1, 2, or 3 based on bundle size */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                      {Array.from({ length: index + 1 }).map((_, i) => (
                        <BoltIcon key={i} sx={{ fontSize: 20, color: '#007AFF' }} />
                      ))}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                      {bundle.tokens.toLocaleString()} Tokens
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#007AFF' }}>
                      ${bundle.price}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            <Typography sx={{ color: '#86868B', fontSize: '0.8rem', mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
              Top-ups available in your account settings after subscribing
            </Typography>
          </Box>
        </Box>
      </Container>

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
    </Box>
  );
};

export default PaymentPage;
