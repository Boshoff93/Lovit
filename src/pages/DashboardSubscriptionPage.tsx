import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import GruviCoin from '../components/GruviCoin';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCheckoutSession,
  createPortalSession,
  fetchSubscription,
} from '../store/authSlice';
import { subscriptionApi } from '../services/api';
import { RootState, AppDispatch } from '../store/store';
import { useAccountData } from '../hooks/useAccountData';
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
  badgeColor: string;
  icon: string;
  stripePrices: {
    monthly: string;
    yearly: string;
  };
  productId: string;
}

// TikTok icon component
const TikTokIcon: React.FC<{ sx?: any }> = ({ sx }) => (
  <Box
    component="svg"
    viewBox="0 0 24 24"
    sx={{ width: 18, height: 18, ...sx }}
  >
    <path
      fill="currentColor"
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
    />
  </Box>
);

// Mini social icons row
const SocialPlatformIconsMini: React.FC = () => (
  <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
    {[
      { icon: <InstagramIcon sx={{ fontSize: 18 }} />, bg: 'linear-gradient(135deg, #E4405F, #C13584)' },
      { icon: <FacebookIcon sx={{ fontSize: 18 }} />, bg: '#1877F2' },
      { icon: <XIcon sx={{ fontSize: 15 }} />, bg: '#000' },
      { icon: <LinkedInIcon sx={{ fontSize: 18 }} />, bg: '#0A66C2' },
      { icon: <TikTokIcon sx={{ color: '#fff' }} />, bg: '#000' },
      { icon: <YouTubeIcon sx={{ fontSize: 18 }} />, bg: '#FF0000' },
    ].map((item, idx) => (
      <Box
        key={idx}
        sx={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: item.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        {item.icon}
      </Box>
    ))}
  </Box>
);

const plans: PricePlan[] = [
  {
    id: 'starter',
    title: 'Starter',
    tagline: 'Create videos while others are still writing scripts',
    monthlyPrice: 39,
    yearlyPrice: 348,
    tokens: 5000,
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
    badgeColor: '#3B82F6',
    icon: '/gruvi/gruvi-started.png',
    features: [
      '~2 music videos ',
      '~5 avatar videos',
      '~200 AI songs',
      '~200 AI voiceovers',
      '~2 character swap videos',
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
    yearlyPrice: 828,
    popular: true,
    tokens: 20000,
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    badgeColor: '#EC4899',
    icon: '/gruvi/gruvi-scale.png',
    features: [
      '~8 music videos ',
      '~20 avatar videos',
      '~800 AI songs',
      '~800 AI voiceovers',
      '~8 character swap videos',
      'Priority generation',
      'Scheduled Posts',
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
    yearlyPrice: 1788,
    tokens: 50000,
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
    badgeColor: '#F97316',
    icon: '/gruvi/gruvi-beast.png',
    features: [
      '~20 music videos ',
      '~50 avatar videos',
      '~2,000 AI songs',
      '~2,000 AI voiceovers',
      '~20 character swap videos',
      'Priority generation',
      'Dedicated support',
      'Scheduled Posts',
      'Commercial license',
    ],
    stripePrices: {
      monthly: stripeConfig.hardcore.monthly,
      yearly: stripeConfig.hardcore.yearly
    },
    productId: stripeConfig.hardcore.productId
  }
];

const DashboardSubscriptionPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isManagingSubscription, setIsManagingSubscription] = useState<boolean>(false);
  const [isEndingTrial, setIsEndingTrial] = useState<boolean>(false);
  const [loadingTopUpId, setLoadingTopUpId] = useState<string | null>(null);
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();
  const { subscription } = useSelector((state: RootState) => state.auth);
  const { fetchAccountData } = useAccountData(false);

  // Check if subscription is in trial
  const isTrialing = subscription?.status === 'trialing';
  const trialEndDate = subscription?.currentPeriodEnd
    ? new Date(Number(subscription.currentPeriodEnd) * 1000)
    : null;
  const trialDaysRemaining = trialEndDate
    ? Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  useEffect(() => {
    if (subscription?.tier && subscription.tier !== 'free' && !selectedPlan) {
      setSelectedPlan(subscription.tier);
    }
  }, [subscription, selectedPlan]);

  useEffect(() => {
    fetchAccountData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to topup section if hash is present
  useEffect(() => {
    if (location.hash === '#topup') {
      setTimeout(() => {
        const element = document.getElementById('topup');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get('success');

    if (successParam === 'true') {
      setSuccess('Payment successful! Your subscription has been updated.');
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchAccountData(true);
    } else if (successParam === 'false') {
      setError('Payment was not completed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectPlan = useCallback((planId: string) => {
    setSelectedPlan(planId);
  }, []);

  const handleProceedToPayment = useCallback(async () => {
    if (!selectedPlan) return;

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    const priceId = isYearly ? plan.stripePrices.yearly : plan.stripePrices.monthly;
    const productId = plan.productId;

    try {
      setError(null);

      const resultAction = await dispatch(createCheckoutSession({ priceId, productId }));

      if (createCheckoutSession.fulfilled.match(resultAction)) {
        if (resultAction.payload.url) {
          window.location.href = resultAction.payload.url;
        }
      } else if (createCheckoutSession.rejected.match(resultAction)) {
        setError(resultAction.payload as string || 'Failed to create checkout session');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  }, [dispatch, selectedPlan, isYearly]);

  const handleManageSubscription = useCallback(async () => {
    try {
      setError(null);
      setIsManagingSubscription(true);

      const resultAction = await dispatch(createPortalSession());

      if (createPortalSession.fulfilled.match(resultAction)) {
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
  }, [dispatch]);

  const handleEndTrial = useCallback(async () => {
    try {
      setError(null);
      setIsEndingTrial(true);

      const response = await subscriptionApi.endTrialNow();

      if (response.data.success) {
        setSuccess('Your trial has ended and your subscription is now active!');
        // Refresh subscription data
        dispatch(fetchSubscription());
        fetchAccountData(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to end trial');
    } finally {
      setIsEndingTrial(false);
    }
  }, [dispatch, fetchAccountData]);

  const isSubscribed = subscription && subscription.tier !== 'free';

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: { xs: '1 0 100%', sm: 1 } }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
              flexShrink: 0,
              animation: 'iconEntrance 0.5s ease-out',
              '@keyframes iconEntrance': {
                '0%': {
                  opacity: 0,
                  transform: 'scale(0.5) rotate(-10deg)',
                },
                '50%': {
                  transform: 'scale(1.1) rotate(5deg)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1) rotate(0deg)',
                },
              },
            }}
          >
            <CreditCardIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
              Subscription
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
              Manage your plan and billing
            </Typography>
          </Box>
        </Box>

        {/* Current Plan - Right side of header, wraps below on xs */}
        {isSubscribed && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexShrink: 0,
          }}>
            <Box
              component="img"
              src={
                subscription.tier === 'premium'
                  ? '/gruvi/gruvi-beast.png'
                  : subscription.tier === 'pro'
                  ? '/gruvi/gruvi-scale.png'
                  : '/gruvi/gruvi-started.png'
              }
              alt={subscription.tier}
              sx={{
                height: 48,
                width: 'auto',
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Current Plan: {subscription.tier === 'premium' ? 'Content Engine' : subscription.tier === 'pro' ? 'Scale' : subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
              </Typography>
              {subscription.currentPeriodEnd && subscription.currentPeriodEnd > 0 && (
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.8rem', sm: '0.85rem' } }}>
                  Next billing: {new Date(Number(subscription.currentPeriodEnd) * 1000).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Error/Success alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ borderRadius: '12px' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Trial Banner */}
      {isTrialing && (
        <Card
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
                  You're on a Free Trial
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                  {trialDaysRemaining > 0
                    ? `${trialDaysRemaining} day${trialDaysRemaining === 1 ? '' : 's'} remaining - your card will be charged when the trial ends`
                    : 'Your trial ends today'}
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleEndTrial}
                disabled={isEndingTrial}
                sx={{
                  bgcolor: '#fff',
                  color: '#D97706',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '10px',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(255,255,255,0.5)',
                    color: 'rgba(217,119,6,0.5)',
                  },
                }}
              >
                {isEndingTrial ? <CircularProgress size={20} sx={{ color: '#D97706' }} /> : 'Start Subscription Now'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Main content: Plans + Checkout Sidebar */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column-reverse', lg: 'row' } }}>
        {/* Plans list */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                onClick={() => handleSelectPlan(plan.id)}
                sx={{
                  borderRadius: '16px',
                  cursor: 'pointer',
                  bgcolor: '#1E1E22',
                  border: selectedPlan === plan.id
                    ? `2px solid ${plan.badgeColor}`
                    : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: selectedPlan === plan.id
                    ? `0 8px 24px ${plan.badgeColor}30`
                    : 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  },
                }}
              >
                {/* Most Popular badge */}
                {plan.popular && (
                  <Chip
                    label="Most Popular"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 16,
                      background: plan.gradient,
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                )}

                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Left: Gradient header with tokens */}
                    <Box
                      sx={{
                        background: plan.gradient,
                        p: 2.5,
                        minWidth: { md: 180 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: { xs: '14px 14px 0 0', md: '14px 0 0 14px' },
                      }}
                    >
                      <Box
                        component="img"
                        src={plan.icon}
                        alt={plan.title}
                        sx={{
                          height: 64,
                          width: 'auto',
                          mb: 1,
                        }}
                      />
                      <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                        {plan.tokens.toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                        AI Tokens/mo
                      </Typography>
                    </Box>

                    {/* Right: Plan details */}
                    <Box sx={{ flex: 1, p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box>
                          <Chip
                            label={plan.title}
                            size="small"
                            sx={{
                              background: plan.gradient,
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              mb: 0.5,
                            }}
                          />
                          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                            {plan.tagline}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                            ${isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                            <Typography component="span" sx={{ fontSize: '0.9rem', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
                              /mo
                            </Typography>
                          </Typography>
                          {isYearly && (
                            <Typography sx={{ fontSize: '0.75rem', color: '#34C759', fontWeight: 600 }}>
                              Billed ${plan.yearlyPrice}/yr
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {/* Features list */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                        {plan.features.slice(0, 6).map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <CheckCircleIcon sx={{ fontSize: 14, color: plan.badgeColor }} />
                            <Typography sx={{ fontSize: '0.85rem', color: '#fff' }}>{feature}</Typography>
                          </Box>
                        ))}
                      </Box>

                      {/* Bottom: Social platforms + Select button */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                        <Box>
                          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
                            Publish to All Platforms
                          </Typography>
                          <SocialPlatformIconsMini />
                        </Box>
                        <Button
                          variant={selectedPlan === plan.id ? 'contained' : 'outlined'}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPlan(plan.id);
                          }}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2,
                            minWidth: 100,
                            background: selectedPlan === plan.id ? plan.gradient : 'transparent',
                            borderColor: selectedPlan === plan.id ? 'transparent' : plan.badgeColor,
                            color: selectedPlan === plan.id ? '#fff' : plan.badgeColor,
                            '&:hover': {
                              background: selectedPlan === plan.id ? plan.gradient : `${plan.badgeColor}10`,
                              borderColor: plan.badgeColor,
                            },
                          }}
                        >
                          {isSubscribed && subscription?.tier === plan.id ? 'Current' : (selectedPlan === plan.id ? 'Selected' : 'Select')}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Right sidebar: Checkout Card */}
        <Box sx={{ width: { xs: '100%', lg: 300 }, flexShrink: 0, position: { lg: 'sticky' }, top: 20, alignSelf: 'flex-start' }}>
          <Card sx={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', bgcolor: '#1E1E22' }}>
            <CardContent sx={{ p: 3 }}>
              {/* Billing Frequency */}
              <Typography sx={{ fontWeight: 600, color: '#fff', mb: 1.5 }}>
                Billing Frequency
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                {/* Monthly option */}
                <Box
                  onClick={() => setIsYearly(false)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: '10px',
                    border: !isYearly ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.15)',
                    background: !isYearly ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Typography sx={{ fontWeight: 500, color: '#fff' }}>Monthly</Typography>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: !isYearly ? '6px solid #007AFF' : '2px solid rgba(255,255,255,0.3)',
                      background: !isYearly ? '#007AFF' : 'transparent',
                    }}
                  />
                </Box>
                {/* Yearly option */}
                <Box
                  onClick={() => setIsYearly(true)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: '10px',
                    border: isYearly ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.15)',
                    background: isYearly ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 500, color: '#fff' }}>Yearly</Typography>
                    <Chip
                      label="Save 25%"
                      size="small"
                      sx={{
                        background: '#34C759',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: isYearly ? '6px solid #007AFF' : '2px solid rgba(255,255,255,0.3)',
                      background: isYearly ? '#007AFF' : 'transparent',
                    }}
                  />
                </Box>
              </Box>

              {/* Tokens display - only show when plan selected */}
              {selectedPlan && (
                <>
                  <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', my: 2 }} />
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: '12px',
                    background: plans.find(p => p.id === selectedPlan)?.gradient,
                    mb: 2,
                  }}>
                    <Box
                      component="img"
                      src={plans.find(p => p.id === selectedPlan)?.icon}
                      alt={plans.find(p => p.id === selectedPlan)?.title}
                      sx={{ width: 40, height: 40, objectFit: 'contain' }}
                    />
                    <Box>
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                        {(plans.find(p => p.id === selectedPlan)?.tokens || 0).toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                        AI Tokens/mo
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}

              {/* Divider */}
              <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', my: 2 }} />

              {/* Monthly Total */}
              {selectedPlan ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Monthly total</Typography>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                      ${isYearly
                        ? Math.round((plans.find(p => p.id === selectedPlan)?.yearlyPrice || 0) / 12)
                        : plans.find(p => p.id === selectedPlan)?.monthlyPrice || 0}
                    </Typography>
                  </Box>
                  {isYearly && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Billed yearly</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                        ${plans.find(p => p.id === selectedPlan)?.yearlyPrice || 0}
                      </Typography>
                    </Box>
                  )}
                  {!isYearly && <Box sx={{ mb: 2 }} />}
                </>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textAlign: 'center' }}>
                    Select a plan to continue
                  </Typography>
                </Box>
              )}

              {/* CTA Button */}
              <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', sm: 'center', lg: 'stretch' } }}>
              <Button
                variant="contained"
                disabled={!selectedPlan || isManagingSubscription}
                onClick={isSubscribed ? handleManageSubscription : handleProceedToPayment}
                endIcon={!isManagingSubscription && <ChevronRightIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  width: { xs: '100%', sm: 'auto', lg: '100%' },
                  background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                  boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0066CC 0%, #4AB8EA 100%)',
                    boxShadow: '0 6px 16px rgba(0,122,255,0.4)',
                  },
                  '&.Mui-disabled': {
                    background: isManagingSubscription
                      ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                      : 'rgba(255,255,255,0.1)',
                    color: isManagingSubscription ? '#fff' : 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {isManagingSubscription ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Loading...</span>
                  </Box>
                ) : isSubscribed ? (
                  'Manage Subscription'
                ) : (
                  'Unlock Gruvi'
                )}
              </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Token Top-ups - Only show in sidebar on large screens */}
          <Box id="topup" sx={{ mt: 3, scrollMarginTop: '80px', display: { xs: 'none', lg: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
              Need More Tokens?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 2 }}>
              Top-up tokens never expire!
            </Typography>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
              {topUpBundles.map((bundle) => {
                const isThisBundleLoading = loadingTopUpId === bundle.id;
                const isAnyLoading = loadingTopUpId !== null;
                return (
                <Card
                  key={bundle.id}
                  sx={{
                    borderRadius: '16px',
                    bgcolor: '#1E1E22',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'visible',
                    opacity: isAnyLoading && !isThisBundleLoading ? 0.5 : 1,
                  }}
                >
                  {/* Badge */}
                  {bundle.badge && (
                    <Chip
                      label={bundle.badge}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 16,
                        background: bundle.badge === 'BEST VALUE'
                          ? 'linear-gradient(135deg, #34C759 0%, #30D158 100%)'
                          : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    {/* Top row: token amount left, price right */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        +{bundle.tokens.toLocaleString()} x <GruviCoin size={20} />
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                        ${bundle.price}
                      </Typography>
                    </Box>
                    {/* Buy button - full width */}
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      disabled={isAnyLoading}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (isAnyLoading) return;
                        try {
                          setLoadingTopUpId(bundle.id);
                          const resultAction = await dispatch(createCheckoutSession({
                            priceId: bundle.priceId,
                            productId: bundle.productId
                          }));
                          if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
                            window.location.href = resultAction.payload.url;
                          }
                        } catch (err: any) {
                          setError(err.message || 'Failed to create checkout session');
                        } finally {
                          setLoadingTopUpId(null);
                        }
                      }}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        py: 0.5,
                        background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0066CC 0%, #4AB8EA 100%)',
                        },
                        '&.Mui-disabled': {
                          background: isThisBundleLoading
                            ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                            : 'rgba(255,255,255,0.12)',
                          color: isThisBundleLoading ? '#fff' : 'rgba(255,255,255,0.3)',
                        },
                      }}
                    >
                      {isThisBundleLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={14} sx={{ color: '#fff' }} />
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
          </Box>
        </Box>
      </Box>

      {/* Token Top-ups - Show at very bottom on smaller screens */}
      <Box sx={{ mt: 4, display: { xs: 'block', lg: 'none' } }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
          Need More Tokens?
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 2 }}>
          Top-up tokens never expire!
        </Typography>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}>
          {topUpBundles.map((bundle) => {
            const isThisBundleLoading = loadingTopUpId === bundle.id;
            const isAnyLoading = loadingTopUpId !== null;
            return (
            <Card
              key={bundle.id}
              sx={{
                borderRadius: '12px',
                bgcolor: '#1E1E22',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'visible',
                opacity: isAnyLoading && !isThisBundleLoading ? 0.5 : 1,
              }}
            >
              {/* Badge */}
              {bundle.badge && (
                <Chip
                  label={bundle.badge}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: 12,
                    background: bundle.badge === 'BEST VALUE'
                      ? 'linear-gradient(135deg, #34C759 0%, #30D158 100%)'
                      : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.6rem',
                    height: 20,
                  }}
                />
              )}

              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {/* Top row: token amount left, price right */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    +{bundle.tokens.toLocaleString()} x <GruviCoin size={20} />
                  </Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                    ${bundle.price}
                  </Typography>
                </Box>
                {/* Buy button - full width */}
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  disabled={isAnyLoading}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (isAnyLoading) return;
                    try {
                      setLoadingTopUpId(bundle.id);
                      const resultAction = await dispatch(createCheckoutSession({
                        priceId: bundle.priceId,
                        productId: bundle.productId
                      }));
                      if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
                        window.location.href = resultAction.payload.url;
                      }
                    } catch (err: any) {
                      setError(err.message || 'Failed to create checkout session');
                    } finally {
                      setLoadingTopUpId(null);
                    }
                  }}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 0.5,
                    background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                    color: '#fff',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0066CC 0%, #4AB8EA 100%)',
                    },
                    '&.Mui-disabled': {
                      background: isThisBundleLoading
                        ? 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'
                        : 'rgba(255,255,255,0.12)',
                      color: isThisBundleLoading ? '#fff' : 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  {isThisBundleLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={14} sx={{ color: '#fff' }} />
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
      </Box>
    </Box>
  );
};

export default DashboardSubscriptionPage;
