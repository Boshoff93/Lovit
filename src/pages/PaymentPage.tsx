import React, { useState, useEffect } from 'react';
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
  Snackbar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
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
      yearly: 'price_1RGUBLPU9E45VDzjaqxSyZgk'
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

const PaymentPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  
  // Get auth state from Redux
  const { isLoading, token, subscription, user } = useSelector((state: RootState) => state.auth);

  // Check if user is logged in
  useEffect(() => {
    if (!token) {
      // Redirect to login page if not logged in
      navigate('/login', { state: { from: '/payment' } });
    }
  }, [token, navigate]);

  // Fetch user's subscription on component mount
  useEffect(() => {
    if (token) {
      dispatch(fetchSubscription());
    }
  }, [dispatch, token]);

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
      // Refresh subscription data
      dispatch(fetchSubscription());
    } else if (success === 'false') {
      setError('Payment was not completed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [dispatch]);

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

  // Check if the user is allowed to proceed based on their current subscription
  const canProceedToPayment = () => {
    if (!selectedPlan) return false;
    
    // If the user is on a free plan, they can select any plan
    if (!subscription || subscription.tier === 'free') return true;
    
    // If they selected the same plan they already have, redirect to management
    if (subscription.tier === selectedPlan) return false;
    
    return true;
  };

  // Determine the button text based on subscription status
  const getButtonText = () => {
    if (isLoading) {
      return <CircularProgress size={24} color="inherit" />;
    }
    
    if (subscription?.tier === selectedPlan) {
      return 'Manage Subscription';
    }
    
    if (subscription && subscription.tier !== 'free') {
      return 'Change Plan';
    }
    
    return 'Proceed to Payment';
  };

  const handleButtonClick = () => {
    if (subscription?.tier === selectedPlan) {
      handleManageSubscription();
    } else {
      handleProceedToPayment();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Select the perfect plan for your needs
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
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
        
        {/* Subscription info alert */}
        {subscription && subscription.tier !== 'free' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You currently have the {subscription.tier} plan ({subscription.status})
            {subscription.currentPeriodEnd && (
              <>. Next billing date: {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}</>
            )}
          </Alert>
        )}
        
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
              minWidth: { xs: '100%', md: '300px' }
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
                <Button 
                  fullWidth 
                  variant={selectedPlan === plan.id ? "contained" : "outlined"}
                  color="primary"
                  size="large"
                  sx={{ py: 1 }}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          disabled={!selectedPlan || isLoading || !canProceedToPayment()}
          onClick={handleButtonClick}
          sx={{
            py: 1.5,
            px: 6,
            fontSize: '1.1rem',
          }}
        >
          {getButtonText()}
        </Button>
        
        {subscription && subscription.tier !== 'free' && (
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            onClick={handleManageSubscription}
            sx={{ ml: 2, py: 1.5 }}
          >
            Manage Current Subscription
          </Button>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          If you are unhappy with the product please contact us within 7 days of purchase and we will do our best to refund your purchase.
        </Typography>
      </Box>
    </Container>
  );
};

export default PaymentPage; 