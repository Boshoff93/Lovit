// Stripe configuration - always use production Stripe IDs

// Production Stripe IDs (used everywhere including localhost)
export const stripeConfig = {
  topUp: {
    priceId: 'price_1SiFnwB6HvdZJCd5vP1AyQeE',
    productId: 'prod_SDuZQfG5jCbfwZ'
  },
  starter: {
    productId: 'prod_SApdzvErjotcRN',
    monthly: 'price_1SiFU4B6HvdZJCd5ZyiydCYp',
    yearly: 'price_1SiFU4B6HvdZJCd5puG59PPq'
  },
  pro: {
    productId: 'prod_SApgUFg3gLoB70',
    monthly: 'price_1SiFb1B6HvdZJCd5bwT7Gc7x',
    yearly: 'price_1SiFbyB6HvdZJCd5t8FyyaEO'
  },
  premium: {
    productId: 'prod_SAphmL67DhziEI',
    monthly: 'price_1SiFiBB6HvdZJCd5Rpoh13hd',
    yearly: 'price_1SiFiBB6HvdZJCd5KdRTbrco'
  }
};

// Helper to get top-up details
export const getTopUpConfig = () => stripeConfig.topUp;

// Helper to get plan prices
export const getPlanConfig = (planId: 'starter' | 'pro' | 'premium') => stripeConfig[planId];

