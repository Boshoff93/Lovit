import React, { useState, useEffect, useRef } from 'react';
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import DashboardIcon from '@mui/icons-material/SpaceDashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setSubscription, 
  createCheckoutSession, 
  fetchSubscription,
  createPortalSession,
  Subscription
} from '../store/authSlice';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';
import { useAccountData } from '../hooks/useAccountData';
import { useAuth } from '../hooks/useAuth';

interface PlanFeature {
  title: string;
  included: boolean;
}

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
    likeness: string;
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
    monthlyPrice: 19,
    yearlyPrice: 9,
    features: {
      photoCount: '50 AI photos',
      modelCount: '1 AI Model',
      quality: 'Lower quality photos',
      likeness: 'Low Likeness',
      parallel: '1 photo at a time',
      other: ['Photorealistic images']
    },
    stripePrices: {
      monthly: 'price_1RGUCfPU9E45VDzj0yy0rp9M',
      yearly: 'price_1RGUAdPU9E45VDzjB0cxMIkA'
    },
    productId: 'prod_SApqHExCIJHZbN'
  },
  {
    id: 'pro',
    title: 'Pro',
    monthlyPrice: 49,
    yearlyPrice: 21,
    features: {
      photoCount: '1000 photos',
      modelCount: '3 AI models',
      quality: 'Medium quality photos',
      likeness: 'Medium likeness',
      parallel: '4 photos in parallel',
      other: ['Photorealistic models']
    },
    stripePrices: {
      monthly: 'price_1RGUD3PU9E45VDzjCxaJWHm7',
      yearly: 'price_1RGYP6PU9E45VDzjejMIqaWW'
    },
    productId: 'prod_SAprsgkM7ZjCXr'
  },
  {
    id: 'premium',
    title: 'Premium',
    monthlyPrice: 99,
    yearlyPrice: 42,
    popular: true,
    features: {
      photoCount: '3000 AI photos',
      modelCount: '10 AI models',
      quality: 'High quality photos',
      likeness: 'High likeness',
      parallel: '8 photos in parallel',
      other: ['Photorealistic models', 'Priority support']
    },
    stripePrices: {
      monthly: 'price_1RGUDJPU9E45VDzjF6MoO9vT',
      yearly: 'price_1RGUBzPU9E45VDzjANCpxjAB'
    },
    productId: 'prod_SAprvoCikmsgYW'
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
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  
  // Get auth state from Redux
  const { isLoading, token, subscription, user } = useSelector((state: RootState) => state.auth);
  
  // Use account data hook
  const { fetchAccountData } = useAccountData(true);
  
  // Get signout function from useAuth
  const { signout } = useAuth();

  const proceedRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in
  useEffect(() => {
    // if (!token) {
    //   // Redirect to login page if not logged in
    //   navigate('/', { state: { from: '/payment' } });
    // }
  }, [token, navigate]);

  // Auto-select current plan if user has one
  useEffect(() => {
    if (subscription?.tier && subscription.tier !== 'free') {
      setSelectedPlan(subscription.tier);
    }
  }, [subscription]);

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

  const handleToggleInterval = () => {
    setIsYearly(!isYearly);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan) return;
    
    // Find the selected plan
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;
    
    // Get the appropriate price ID based on billing interval
    const priceId = isYearly ? plan.stripePrices.yearly : plan.stripePrices.monthly;
    const productId = plan.productId;
    
    try {
      setError(null);
      
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
  };

  const handleManageSubscription = async () => {
    try {
      setError(null);
      
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
    }
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleLogout = () => {
    signout();
    navigate('/');
  };

  // Determine the button text based on subscription status
  const getButtonText = () => {
    if (isLoading) {
      return <CircularProgress size={24} color="inherit" />;
    }
    
    return 'Proceed to Payment';
  };

  const handleButtonClick = () => {
    handleProceedToPayment();
  };

  const scrollToProceed = () => {
    proceedRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/lovit.jpeg" 
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
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
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
                      (Save up to 57%)
                    </Box>
                  </Typography>
                </Box>
              }
              labelPlacement="end"
            />
            
            {/* Subscription info alert */}
            {subscription && subscription.tier !== 'free' && (
              <Alert severity="info" sx={{ mt: 1, width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                You currently have the {subscription.tier} plan
                {subscription.currentPeriodEnd && (
                  <>. Next billing date: {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}</>
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
                onClick={() => handleSelectPlan(plan.id)}
                sx={{ 
                  height: '100%',
                  border: selectedPlan === plan.id 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : plan.popular ? `2px solid ${theme.palette.primary.main}` : 'none',
                  position: 'relative',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[selectedPlan === plan.id ? 8 : 4],
                  },
                  bgcolor: selectedPlan === plan.id ? 'rgba(147, 112, 219, 0.05)' : 'background.paper'
                }}
              >
                {plan.popular && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -15, 
                      left: 0, 
                      right: 0,
                      textAlign: 'center'
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}
                    >
                      <StarIcon fontSize="small" sx={{ mr: 0.5 }} />
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
                    <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                      /month
                    </Typography>
                  </Box>
                  
                  {isYearly && (
                    <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
                      Billed annually (${plan.yearlyPrice * 12}/year)
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <List dense disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.photoCount} />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.modelCount} />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.quality} />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.likeness} />
                    </ListItem>
                    
                    <ListItem disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={plan.features.parallel} />
                    </ListItem>
                    
                    {plan.features.other?.map((feature, index) => (
                      <ListItem disableGutters key={index}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="primary" />
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
                    color={selectedPlan === plan.id ? "primary" : "text.secondary"}
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
                sx={{ 
                  py: 1.5, 
                  px: 6, 
                  fontSize: '1.1rem',
                  width: { xs: '100%', sm: 'auto', md: 'auto' }
                }}
              >
                Manage Subscription
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