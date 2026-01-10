import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  CircularProgress,
  Radio,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { createCheckoutSession, logout } from '../store/authSlice';
import { stripeConfig } from '../config/stripe';

interface TrialPaywallModalProps {
  open: boolean;
  trialExpired?: boolean;
}

interface PlanOption {
  id: 'starter' | 'scale' | 'beast';
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyTotal: number;
  tokens: number;
  productId: string;
  monthlyPriceId: string;
  yearlyPriceId: string;
  features: string[];
  gradient: string;
  borderColor: string;
  bgColor: string;
  popular?: boolean;
  mascotImage: string;
}

const plans: PlanOption[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Create while others are still planning',
    monthlyPrice: 39,
    yearlyPrice: 29,
    yearlyTotal: 348,
    tokens: 5000,
    productId: stripeConfig.starter.productId,
    monthlyPriceId: stripeConfig.starter.monthly,
    yearlyPriceId: stripeConfig.starter.yearly,
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    borderColor: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    mascotImage: '/gruvi/gruvi-started.png',
    features: [
      'AI Music Videos',
      'Cinematic Videos',
      'AI Songs',
      'Commercial License',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'Go viral while competitors are still planning',
    monthlyPrice: 99,
    yearlyPrice: 69,
    yearlyTotal: 828,
    tokens: 20000,
    productId: stripeConfig.scale.productId,
    monthlyPriceId: stripeConfig.scale.monthly,
    yearlyPriceId: stripeConfig.scale.yearly,
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    borderColor: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    mascotImage: '/gruvi/gruvi-scale.png',
    features: [
      'AI Music Videos',
      'Cinematic Videos',
      'AI Songs',
      'Schedule Posts',
    ],
    popular: true,
  },
  {
    id: 'beast',
    name: 'Beast',
    tagline: 'Flood the feed while the competition falls behind',
    monthlyPrice: 199,
    yearlyPrice: 149,
    yearlyTotal: 1788,
    tokens: 50000,
    productId: stripeConfig.beast.productId,
    monthlyPriceId: stripeConfig.beast.monthly,
    yearlyPriceId: stripeConfig.beast.yearly,
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
    borderColor: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    mascotImage: '/gruvi/gruvi-beast.png',
    features: [
      'AI Music Videos',
      'Cinematic Videos',
      'AI Songs',
      'Dedicated Support',
    ],
  },
];

const TrialPaywallModal: React.FC<TrialPaywallModalProps> = ({ open, trialExpired = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<string>('scale');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSubscribe = async () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!user?.userId || !plan) return;

    setIsLoading(true);

    try {
      const priceId = isYearly ? plan.yearlyPriceId : plan.monthlyPriceId;

      const result = await dispatch(createCheckoutSession({
        priceId,
        productId: plan.productId,
        withTrial: !trialExpired,
      }));

      if (createCheckoutSession.fulfilled.match(result)) {
        window.location.href = result.payload.url;
      }
    } catch (error) {
      console.error('Failed to start trial:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlan = plans.find(p => p.id === selectedPlan);
  const currentPrice = currentPlan ? (isYearly ? currentPlan.yearlyPrice : currentPlan.monthlyPrice) : 0;

  // Calculate trial end date (3 days from now)
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 3);
  const formattedTrialEnd = trialEndDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          maxWidth: 950,
          width: '95%',
          maxHeight: '90vh',
          p: 0,
          overflow: 'hidden',
          background: '#fff',
        }
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
        },
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: { xs: 'auto', md: '100%' },
        maxHeight: { xs: '90vh', md: 'none' },
        overflow: 'auto',
      }}>
        {/* Left side - Plan Selection */}
        <Box sx={{
          flex: 1,
          p: { xs: 2.5, sm: 3 },
          borderRight: { md: '1px solid rgba(0,0,0,0.08)' },
          overflow: 'auto',
        }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {trialExpired ? (
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FF9500 0%, #FF3B30 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(255, 149, 0, 0.3)',
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 24, color: '#fff' }} />
              </Box>
            ) : (
              <Box
                component="img"
                src="/gruvi.png"
                alt="Gruvi"
                sx={{
                  width: 48,
                  height: 48,
                  objectFit: 'contain',
                }}
              />
            )}
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#1D1D1F',
                }}
              >
                Choose Your Plan
              </Typography>
              <Typography
                sx={{
                  color: '#86868B',
                  fontSize: '0.85rem',
                }}
              >
                Select the perfect plan for your needs
              </Typography>
            </Box>
          </Box>

          {/* Plan Rows */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {plans.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const isSelected = selectedPlan === plan.id;

              return (
                <Box
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '16px',
                    border: isSelected ? `2px solid ${plan.borderColor}` : '2px solid rgba(0,0,0,0.06)',
                    background: `linear-gradient(135deg, ${plan.bgColor} 0%, rgba(255,255,255,0.98) 60%, rgba(255,255,255,1) 100%)`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 4px 20px ${plan.bgColor}` : 'none',
                    '&:hover': {
                      borderColor: isSelected ? plan.borderColor : 'rgba(0,0,0,0.12)',
                      boxShadow: `0 4px 20px ${plan.bgColor}`,
                    },
                  }}
                >
                  {/* Mascot */}
                  <Box
                    component="img"
                    src={plan.mascotImage}
                    alt={plan.name}
                    sx={{
                      width: 64,
                      height: 64,
                      objectFit: 'contain',
                      flexShrink: 0,
                    }}
                  />

                  {/* Plan Info - Name, Tagline & Tokens */}
                  <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.15rem',
                          background: plan.gradient,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {plan.name}
                      </Typography>
                      {plan.popular && (
                        <Box
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: '6px',
                            background: plan.gradient,
                            color: '#fff',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          Popular
                        </Box>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        color: '#86868B',
                        fontSize: '0.8rem',
                        lineHeight: 1.3,
                        mb: 0.75,
                      }}
                    >
                      {plan.tagline}
                    </Typography>

                    {/* Tokens underneath tagline */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}>
                      <AddIcon sx={{ fontSize: 14, color: plan.borderColor }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1D1D1F' }}>
                        {plan.tokens.toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>x</Typography>
                      <Box
                        component="img"
                        src="/gruvi/gruvi-coin.png"
                        alt="credits"
                        sx={{
                          width: 20,
                          height: 20,
                          objectFit: 'contain',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.75rem', color: '#86868B', ml: 0.25 }}>
                        tokens / month
                      </Typography>
                    </Box>
                  </Box>

                  {/* Features (hidden on smaller screens) */}
                  <Box sx={{
                    display: { xs: 'none', lg: 'flex' },
                    flexDirection: 'column',
                    gap: 0.25,
                    mr: 3,
                    flexShrink: 0,
                    minWidth: 140,
                  }}>
                    {plan.features.map((feature, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleIcon sx={{ fontSize: 14, color: plan.borderColor }} />
                        <Typography sx={{ fontSize: '0.75rem', color: '#555' }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Price */}
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: '#1D1D1F',
                        lineHeight: 1,
                      }}
                    >
                      ${price}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#86868B' }}>
                      / month
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Right side - Billing & CTA */}
        <Box sx={{
          width: { xs: '100%', md: 260 },
          p: { xs: 2.5, sm: 3 },
          background: 'rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Billing Frequency */}
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1D1D1F', mb: 2 }}>
            Billing Frequency
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            <Box
              onClick={() => setIsYearly(false)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <Typography sx={{ fontSize: '0.9rem', color: '#1D1D1F' }}>Monthly</Typography>
              <Radio
                checked={!isYearly}
                sx={{ color: '#D1D1D6', '&.Mui-checked': { color: '#007AFF' } }}
              />
            </Box>
            <Box
              onClick={() => setIsYearly(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.9rem', color: '#1D1D1F' }}>Annually</Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                  }}
                >
                  Save 25%
                </Box>
              </Box>
              <Radio
                checked={isYearly}
                sx={{ color: '#D1D1D6', '&.Mui-checked': { color: '#007AFF' } }}
              />
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', my: 2 }} />

          {/* Monthly Total */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: '0.9rem', color: '#1D1D1F' }}>Monthly total</Typography>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: '#1D1D1F' }}>
              ${currentPrice}
            </Typography>
          </Box>

          {/* CTA Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubscribe}
            disabled={isLoading}
            sx={{
              py: 1.25,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              },
              '&.Mui-disabled': {
                background: 'rgba(0,0,0,0.1)',
                color: 'rgba(0,0,0,0.3)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={18} sx={{ color: '#fff' }} />
            ) : trialExpired ? (
              <>Subscribe Now &nbsp;›</>
            ) : (
              <>Start Free Trial &nbsp;›</>
            )}
          </Button>

          {/* Trial info */}
          {!trialExpired && (
            <Typography sx={{ color: '#86868B', fontSize: '0.75rem', textAlign: 'center', mt: 1.5 }}>
              You won't be charged until {formattedTrialEnd}.
            </Typography>
          )}

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Logout */}
          <Button
            onClick={() => dispatch(logout())}
            startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: '#FF3B30',
              fontSize: '0.85rem',
              fontWeight: 500,
              textTransform: 'none',
              mt: 2,
              '&:hover': {
                background: 'rgba(255, 59, 48, 0.08)',
              },
            }}
          >
            Log out
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default TrialPaywallModal;
