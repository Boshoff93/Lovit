import React, { useState } from 'react';
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
  useMediaQuery
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSubscription } from '../store/authSlice';

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
    }
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
    }
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
      other: ['Photorealistic models', 'Priority support', 'Advanced editing tools']
    }
  }
];

const PaymentPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();

  const handleToggleInterval = () => {
    setIsYearly(!isYearly);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan) return;
    
    // In a real application, redirect to payment processor
    console.log(`Processing payment for ${selectedPlan} plan (${isYearly ? 'yearly' : 'monthly'})`);
    
    // After successful payment, update Redux state and redirect to dashboard
    // For now, just simulate a successful payment
    setTimeout(() => {
      // Set user as premium member in Redux
      dispatch(setSubscription({ tier: 'premium', status: 'active' }));
      navigate('/dashboard');
    }, 1000);
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
          disabled={!selectedPlan}
          onClick={handleProceedToPayment}
          sx={{
            py: 1.5,
            px: 6,
            fontSize: '1.1rem',
          }}
        >
          Proceed to Payment
        </Button>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          All plans include a 7-day money-back guarantee
        </Typography>
      </Box>
    </Container>
  );
};

export default PaymentPage; 