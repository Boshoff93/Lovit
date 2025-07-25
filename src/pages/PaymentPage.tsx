import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Snackbar,
  keyframes,
  AppBar,
  Toolbar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
  getFunnelStep,
  trackCustomerJourneyMilestone
} from '../utils/analytics';

interface PricePlan {
  id: string;
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: {
    photoCount: string;
    modelCount: string;
    quality: string;
    resemblance: string;
    parallel: string;
    other?: string[];
  };
  stripePrices: {
    monthly: string;
    yearly: string;
  };
  productId: string;
}

const plans: PricePlan[] = [
  {
    id: 'starter',
    title: 'Starter',
    monthlyPrice: 14.99,
    yearlyPrice: 8.99,
    features: {
      photoCount: '100 AI photos',
      modelCount: '1 AI Model',
      quality: 'Standard quality photos',
      resemblance: 'Standard model resemblance',
      parallel: '2 photo at a time',
      other: ['Photorealistic images']
    },
    stripePrices: {
      monthly: 'price_1RQOjAB6HvdZJCd5zQoxXdLw',
      yearly: 'price_1RQOkxB6HvdZJCd5un20D2Y2'
    },
    productId: 'prod_SApdzvErjotcRN'
  },
  {
    id: 'pro',
    title: 'Pro',
    monthlyPrice: 29.99,
    yearlyPrice: 19.99,
    features: {
      photoCount: '250 photos',
      modelCount: '2 AI models',
      quality: 'Enhanced quality photos',
      resemblance: 'Better model resemblance',
      parallel: '4 photos in parallel',
      other: ['Photorealistic images']
    },
    stripePrices: {
      monthly: 'price_1RQOniB6HvdZJCd5s4ByVBwl',
      yearly: 'price_1RQOoXB6HvdZJCd5v8SgG1OB'
    },
    productId: 'prod_SApgUFg3gLoB70'
  },
  {
    id: 'premium',
    title: 'Premium',
    monthlyPrice: 59.99,
    yearlyPrice: 44.99,
    popular: true,
    features: {
      photoCount: '1000 AI photos',
      modelCount: '2 Premium AI models',
      quality: 'Exceptional quality photos',
      resemblance: 'Best model resemblance',
      parallel: '8 photos in parallel',
      other: ['Photorealistic images', 'Priority support']
    },
    stripePrices: {
      monthly: 'price_1RQOqeB6HvdZJCd57Mq2AnFi',
      yearly: 'price_1RQOrJB6HvdZJCd5hw8d3dsZ'
    },
    productId: 'prod_SAphmL67DhziEI'
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
  
  // Fetch subscription data directly on component mount and track page view
  useEffect(() => {
    trackPaymentPageView();
    fetchAccountData(true);
  }, [fetchAccountData]);

  // Check for success query param (for Stripe redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    
    if (success === 'true') {
      setSuccess('Payment successful! Your subscription has been updated.');
      // Clear the URL parameters after reading them
      window.history.replaceState({}, document.title, window.location.pathname);
      // Refresh account data
      fetchAccountData(true);
    } else if (success === 'false') {
      setError('Payment was not completed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [fetchAccountData]);

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
    } catch (error: any) {
      setError(error.message || 'An error occurred');
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
    } catch (error: any) {
      setError(error.message || 'An error occurred');
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
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/lovit.png" 
              alt="Lovit Logo" 
              style={{ 
                height: '32px', 
                width: '32px', 
                marginRight: '10px',
                borderRadius: '50%'
              }} 
            />
            <Typography variant="h6" component="div">
              Lovit
            </Typography>
          </Box>
          <Button 
            color="primary" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Choose Your Plan
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Select the perfect plan for your needs
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', maxWidth: '500px' }}>
                {error}
              </Alert>
            )}

            <Snackbar 
              open={!!success} 
              autoHideDuration={6000} 
              onClose={() => setSuccess(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              sx={{
                mt: 7
              }}
            >
              <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
                {success}
              </Alert>
            </Snackbar>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={isYearly}
                  onChange={handleToggleInterval}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: isYearly ? 'normal' : 'bold', 
                      color: isYearly ? 'text.secondary' : 'primary.main'
                    }}
                  >
                    Monthly
                  </Typography>
                  <Box sx={{ mx: 1 }}>|</Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: isYearly ? 'bold' : 'normal', 
                      color: isYearly ? 'primary.main' : 'text.secondary'
                    }}
                  >
                    Yearly <Box component="span" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      (Save up to 40%)
                    </Box>
                  </Typography>
                </Box>
              }
              labelPlacement="end"
            />
            
            {/* Subscription info alert */}
            {subscription && subscription.tier !== 'free' && (
              <Alert severity="info" sx={{ mt: 1, width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                You currently are subscribed to the {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} plan
                {subscription.currentPeriodEnd && subscription.currentPeriodEnd > 0 && (
                  <>. Next billing date: {new Date(Number(subscription.currentPeriodEnd) * 1000).toLocaleDateString()}</>
                )}
              </Alert>
            )}
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          justifyContent: 'center'
        }}>
          {plans.map((plan) => (
            <Box 
              key={plan.id}
              sx={{ 
                flex: { xs: '1 1 100%', md: '1 1 calc(33% - 24px)' }, 
                maxWidth: { xs: '100%', md: 'calc(33% - 24px)' },
                minWidth: { xs: '100%', md: '300px' },
                position: 'relative'
              }}
            >
              <Card 
                elevation={plan.popular ? 6 : 2} 
                onClick={() => {
                  // Only allow plan selection if user is not already subscribed
                  if (!subscription || subscription.tier === 'free') {
                    handleSelectPlan(plan.id);
                  }
                }}
                sx={{ 
                  height: '100%',
                  border: selectedPlan === plan.id 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : plan.popular ? `2px solid ${theme.palette.primary.main}` : 'none',
                  position: 'relative',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: (!subscription || subscription.tier === 'free') ? 'pointer' : 'default',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: (!subscription || subscription.tier === 'free') ? 'translateY(-4px)' : 'none',
                    boxShadow: theme.shadows[selectedPlan === plan.id ? 8 : 4],
                  },
                  bgcolor: selectedPlan === plan.id ? 'unset' : 'background.paper',
                  background: selectedPlan === plan.id ? 
                    `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` : 
                    'background.paper',
                  color: selectedPlan === plan.id ? 'white' : 'inherit',
                  opacity: (subscription && subscription.tier !== 'free') ? 0.85 : 1
                }}
              >
                {plan.popular && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: selectedPlan === plan.id ? -18 : -15, 
                      left: 0, 
                      right: 0,
                      textAlign: 'center',
                      zIndex: 2,
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: selectedPlan === plan.id 
                          ? `linear-gradient(145deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`
                          : `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        color: selectedPlan === plan.id ? theme.palette.primary.main : 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        boxShadow: selectedPlan === plan.id 
                          ? '0 6px 12px rgba(0, 0, 0, 0.2)' 
                          : '0 4px 8px rgba(0, 0, 0, 0.15)',
                        border: selectedPlan === plan.id ? `2px solid ${theme.palette.primary.main}` : 'none'
                      }}
                    >
                      <StarIcon 
                        fontSize="small" 
                        sx={{ 
                          mr: 0.5, 
                          color: selectedPlan === plan.id ? theme.palette.primary.main : theme.palette.secondary.light 
                        }} 
                      />
                      Most Popular
                    </Box>
                  </Box>
                )}
                
                <CardContent sx={{ p: 3, flex: '1 1 auto' }}>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    {plan.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography variant="h3" component="span" fontWeight="bold">
                      ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </Typography>
                    <Typography variant="body1" color={selectedPlan === plan.id ? "white" : "text.secondary"} sx={{ ml: 1 }}>
                      /month
                    </Typography>
                  </Box>
                  
                  {isYearly && (
                    <Typography variant="body2" color={selectedPlan === plan.id ? theme.palette.secondary.light : "success.main"} sx={{ mb: 2 }}>
                      Billed annually (${plan.yearlyPrice * 12}/year)
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 2, borderColor: selectedPlan === plan.id ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)' }} />
                  
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color={selectedPlan === plan.id ? "inherit" : "primary"} sx={{ color: selectedPlan === plan.id ? theme.palette.secondary.light : undefined }} />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.photoCount} />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color={selectedPlan === plan.id ? "inherit" : "primary"} sx={{ color: selectedPlan === plan.id ? theme.palette.secondary.light : undefined }} />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.modelCount} />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color={selectedPlan === plan.id ? "inherit" : "primary"} sx={{ color: selectedPlan === plan.id ? theme.palette.secondary.light : undefined }} />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.quality} />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color={selectedPlan === plan.id ? "inherit" : "primary"} sx={{ color: selectedPlan === plan.id ? theme.palette.secondary.light : undefined }} />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.resemblance} />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color={selectedPlan === plan.id ? "inherit" : "primary"} sx={{ color: selectedPlan === plan.id ? theme.palette.secondary.light : undefined }} />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.parallel} />
                    </ListItem>
                    
                    {plan.features.other?.map((feature, index) => (
                      <ListItem disableGutters key={index}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color={selectedPlan === plan.id ? "inherit" : "primary"} sx={{ color: selectedPlan === plan.id ? theme.palette.secondary.light : undefined }} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0, mt: 'auto' }}>
                  <Typography 
                    variant="body1" 
                    align="center"
                    color={selectedPlan === plan.id ? theme.palette.secondary.light : "text.secondary"}
                    sx={{ 
                      width: '100%', 
                      fontWeight: selectedPlan === plan.id ? 'bold' : 'normal',
                      py: 1
                    }}
                  >
                    {selectedPlan === plan.id ? "✓ Selected" : "Select"}
                  </Typography>
                </CardActions>
              </Card>
            </Box>
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
                color="primary" 
                size="large" 
                disabled={!selectedPlan || isLoading}
                onClick={handleButtonClick}
                sx={{
                  py: 1.5,
                  px: 6,
                  fontSize: '1.1rem',
                  width: { xs: '100%', sm: 'auto', md: 'auto' }
                }}
              >
                {getButtonText()}
              </Button>
            )}
            
            {subscription && subscription.tier !== 'free' && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleManageSubscription}
                disabled={isManagingSubscription}
                sx={{ 
                  py: 1.5, 
                  px: 6, 
                  fontSize: '1.1rem',
                  width: { xs: '100%', sm: 'auto', md: 'auto' }
                }}
              >
                {isManagingSubscription ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Manage Subscription'
                )}
              </Button>
            )}

            {subscription && subscription.tier !== 'free' && (<Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<DashboardIcon />}
              onClick={handleNavigateToDashboard}
              sx={{ 
                py: 1.5, 
                px: 6, 
                fontSize: '1.1rem',
                width: { xs: '100%', sm: 'auto', md: 'auto' }
              }}
            >
              Back to Dashboard
            </Button>)}
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 2,
              maxWidth: '600px',
              mx: 'auto'  // Centers the text block
            }}
          >
            If you are unhappy with the product please contact us within 7 days of purchase and we will do our best to refund your purchase.
          </Typography>
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
              bgcolor: theme.palette.primary.main,
              color: 'white',
              borderRadius: '50%',
              boxShadow: 4,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 4px 12px rgba(103, 58, 183, 0.5))'
            }}
          >
            <KeyboardArrowDownIcon fontSize="medium" />
          </Box>
        </Box>
      )}
    </>
  );
};

export default PaymentPage; 