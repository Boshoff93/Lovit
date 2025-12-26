import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
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
  Link
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
import { stripeConfig } from '../config/stripe';

interface PricePlan {
  id: string;
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  tokens: number;
  musicVideos: boolean;
  stripePrices: {
    monthly: string;
    yearly: string;
  };
  productId: string;
}

// Token costs:
// 1 Song = 20 tokens
// 1 Still Image Video = 40 tokens
// 1 Animated Video = 200 tokens

const plans: PricePlan[] = [
  {
    id: 'starter',
    title: 'Starter',
    monthlyPrice: 8.99,
    yearlyPrice: 85.99,
    tokens: 500,
    musicVideos: true,
    features: [
      '500 tokens/month',
      '25 songs',
      '12 still image videos',
      '2 animated videos',
      'Standard quality audio',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.starter.monthly,
      yearly: stripeConfig.starter.yearly
    },
    productId: stripeConfig.starter.productId
  },
  {
    id: 'pro',
    title: 'Pro',
    monthlyPrice: 16.99,
    yearlyPrice: 162.99,
    popular: true,
    tokens: 1000,
    musicVideos: true,
    features: [
      '1,000 tokens/month',
      '50 songs',
      '25 still image videos',
      '5 animated videos',
      'High quality audio',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.pro.monthly,
      yearly: stripeConfig.pro.yearly
    },
    productId: stripeConfig.pro.productId
  },
  {
    id: 'premium',
    title: 'Premium',
    monthlyPrice: 29.99,
    yearlyPrice: 287.88,
    tokens: 2500,
    musicVideos: true,
    features: [
      '2,500 tokens/month',
      '125 songs',
      '62 still image videos',
      '12 animated videos',
      'Highest quality audio',
      'Priority generation',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.premium.monthly,
      yearly: stripeConfig.premium.yearly
    },
    productId: stripeConfig.premium.productId
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

  const handleNavigateToDashboard = useCallback(() => {
    navigate('/dashboard');
  },[navigate]);
  
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
      minHeight: '100vh',
      background: '#FFFFFF',
      color: '#1D1D1F',
      position: 'relative',
      overflow: 'hidden',
      // Add bottom padding when audio player is visible
      pb: hasActivePlayer ? 12 : 0,
    }}>
      {/* Subtle gradient background - Apple-style clean blue */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at top center, rgba(0, 122, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(90, 200, 250, 0.05) 0%, transparent 40%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Header - Glassy White */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2,
          }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <Box
                component="img"
                src="/gruvi.png"
                alt="Gruvi"
                sx={{
                  height: 40,
                  width: 40,
                  objectFit: 'contain',
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: '"Fredoka", "Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '1.5rem',
                  letterSpacing: '-0.01em',
                  background: 'linear-gradient(135deg, #007AFF, #5AC8FA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Gruvi
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button 
                variant="contained" 
                component={RouterLink}
                to="/dashboard"
                startIcon={<DashboardIcon />}
                sx={{
                  background: '#007AFF',
                  color: '#fff',
                  px: 3,
                  borderRadius: '100px',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: '#0066DD',
                    boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
                  },
                }}
              >
                Dashboard
              </Button>
              <Button 
                variant="outlined"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  borderColor: 'rgba(0,0,0,0.15)',
                  color: '#1D1D1F',
                  px: 3,
                  borderRadius: '100px',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#FF3B30',
                    color: '#FF3B30',
                    background: 'rgba(255,59,48,0.05)',
                  },
                }}
              >
                Sign Out
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ pt: 14, pb: 8, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2"
            sx={{ 
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 600,
              color: '#1D1D1F',
              mb: 2,
            }}
          >
            Choose Your Plan
          </Typography>
          <Typography sx={{ color: '#86868B', fontSize: '1rem', mb: 4 }}>
            Select the plan that best fits your needs
          </Typography>
          
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
                      label="SAVE 20%" 
                      size="small" 
                      sx={{ 
                        ml: 1, 
                        background: 'rgba(52, 199, 89, 0.15)', 
                        color: '#248A3D',
                        fontSize: '0.7rem',
                        height: 20,
                      }} 
                    />
                  )}
                </Box>
              }
              labelPlacement="end"
            />
            
            {/* Subscription info alert */}
            {subscription && subscription.tier !== 'free' && (
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 1, 
                  width: '100%', 
                  maxWidth: '500px', 
                  textAlign: 'center',
                  borderRadius: '12px',
                  background: 'rgba(0, 122, 255, 0.1)',
                  border: '1px solid rgba(0, 122, 255, 0.2)',
                }}
              >
                You currently are subscribed to the {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} plan
                {subscription.currentPeriodEnd && subscription.currentPeriodEnd > 0 && (
                  <>. Next billing date: {new Date(Number(subscription.currentPeriodEnd) * 1000).toLocaleDateString()}</>
                )}
              </Alert>
            )}
          </Box>
        </Box>

        {/* Pricing Cards */}
        <Box
          sx={{
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            maxWidth: '1000px',
            mx: 'auto',
          }}
        >
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              onClick={() => {
                // Only allow plan selection if user is not already subscribed
                if (!subscription || subscription.tier === 'free') {
                  handleSelectPlan(plan.id);
                }
              }}
              sx={{ 
                background: selectedPlan === plan.id 
                  ? 'rgba(0, 122, 255, 0.06)'
                  : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: selectedPlan === plan.id 
                  ? '2px solid #007AFF'
                  : '1px solid rgba(0,0,0,0.08)',
                borderRadius: '28px',
                position: 'relative',
                overflow: 'visible',
                cursor: (!subscription || subscription.tier === 'free') ? 'pointer' : 'default',
                boxShadow: selectedPlan === plan.id
                  ? '0 12px 48px rgba(0,122,255,0.2), 0 4px 16px rgba(0,122,255,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                  : '0 8px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
                transition: 'all 0.3s ease',
                opacity: (subscription && subscription.tier !== 'free') ? 0.85 : 1,
                '&:hover': {
                  transform: (!subscription || subscription.tier === 'free') ? 'translateY(-6px)' : 'none',
                  boxShadow: selectedPlan === plan.id
                    ? '0 20px 60px rgba(0,122,255,0.25), 0 8px 24px rgba(0,122,255,0.15)'
                    : '0 16px 56px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                },
              }}
            >
              {plan.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#007AFF',
                    color: '#fff',
                    px: 2,
                    py: 0.5,
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
                  }}
                >
                  <StarIcon sx={{ fontSize: 14 }} />
                  MOST POPULAR
                </Box>
              )}
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                    {plan.title}
                  </Typography>
                  {isYearly && (
                    <Chip 
                      label={`Save $${((plan.monthlyPrice * 12) - plan.yearlyPrice).toFixed(0)}`}
                      size="small"
                      sx={{ 
                        background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 24,
                      }}
                    />
                  )}
                </Box>
                <Typography sx={{ fontSize: '0.85rem', color: '#86868B', mb: 2, fontStyle: 'italic' }}>
                  {plan.id === 'starter' ? 'Ideal for beginners and hobbyists' : 
                   plan.id === 'pro' ? 'Best value for regular creators' : 
                   'Unlimited potential for power users'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 0.5 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
                    ${isYearly ? (plan.yearlyPrice / 12).toFixed(2) : plan.monthlyPrice}
                  </Typography>
                  <Typography sx={{ color: '#86868B', ml: 1 }}>
                    /month
                  </Typography>
                </Box>
                
                {isYearly && (
                  <Typography sx={{ fontSize: '0.85rem', color: '#86868B', mb: 3 }}>
                    ${plan.yearlyPrice}/year
                  </Typography>
                )}
                
                {!isYearly && (
                  <Box sx={{ mb: 3 }} />
                )}

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
                    mb: 3,
                    background: selectedPlan === plan.id 
                      ? 'linear-gradient(135deg, #34C759 0%, #30D158 100%)' 
                      : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                    color: '#fff',
                    boxShadow: selectedPlan === plan.id 
                      ? '0 4px 12px rgba(52,199,89,0.3)' 
                      : '0 4px 12px rgba(0,122,255,0.3)',
                    '&:hover': { 
                      background: selectedPlan === plan.id 
                        ? 'linear-gradient(135deg, #2DB84E 0%, #28C050 100%)' 
                        : 'linear-gradient(135deg, #0066DD 0%, #4AB8F0 100%)',
                      boxShadow: selectedPlan === plan.id 
                        ? '0 6px 16px rgba(52,199,89,0.4)' 
                        : '0 6px 16px rgba(0,122,255,0.4)',
                    },
                    '&.Mui-disabled': {
                      background: 'rgba(0,0,0,0.1)',
                      color: 'rgba(0,0,0,0.3)',
                    },
                  }}
                >
                  {selectedPlan === plan.id ? '✓ Selected' : 'Select Plan'}
                </Button>

                <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)', mb: 3 }} />

                <List dense disablePadding>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ color: '#007AFF', fontSize: 18 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ 
                          sx: { color: '#1D1D1F', fontSize: '0.9rem' } 
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
        
        <Box ref={proceedRef} sx={{ mt: 6, textAlign: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 2,
            mb: 2
          }}>
            {(!subscription || subscription.tier === 'free') && (
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
            )}
            
            {subscription && subscription.tier !== 'free' && (
              <Button
                variant="contained"
                size="large"
                onClick={handleManageSubscription}
                disabled={isManagingSubscription}
                sx={{ 
                  py: 1.5, 
                  px: 6, 
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  background: '#007AFF',
                  boxShadow: '0 4px 16px rgba(0,122,255,0.3)',
                  width: { xs: '100%', sm: 'auto', md: 'auto' },
                  '&:hover': {
                    background: '#0066DD',
                  },
                }}
              >
                {isManagingSubscription ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Manage Subscription'
                )}
              </Button>
            )}

            {subscription && subscription.tier !== 'free' && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<DashboardIcon />}
                onClick={handleNavigateToDashboard}
                sx={{ 
                  py: 1.5, 
                  px: 6, 
                  fontSize: '1.1rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  borderColor: 'rgba(0,0,0,0.15)',
                  color: '#1D1D1F',
                  width: { xs: '100%', sm: 'auto', md: 'auto' },
                  '&:hover': { 
                    borderColor: 'rgba(0,0,0,0.3)',
                    background: 'rgba(0,0,0,0.03)',
                  },
                }}
              >
                Back to Dashboard
              </Button>
            )}
          </Box>
          
          {/* Token Top-ups */}
          <Typography sx={{ color: '#86868B', fontSize: '0.9rem', mt: 4 }}>
            Need more tokens? Purchase a 500 token top-up pack anytime for $8.99. Top-up tokens never expire and can be used for songs, videos, or any generation.
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4,
          borderTop: '1px solid rgba(0,0,0,0.06)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}>
            <Typography sx={{ color: '#86868B', fontSize: '0.875rem' }}>
              © {new Date().getFullYear()} Gruvi. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link
                component={RouterLink}
                to="/terms" 
                sx={{ color: '#86868B', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { color: '#1D1D1F' } }}
              >
                Terms
              </Link>
              <Link
                component={RouterLink}
                to="/privacy"
                sx={{ color: '#86868B', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { color: '#1D1D1F' } }}
              >
                Privacy
              </Link>
            </Box>
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
    </Box>
  );
};

export default PaymentPage;
