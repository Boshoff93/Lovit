// Stripe configuration - switches between test and production based on environment

// TODO: Set back to false after testing!
// TEMPORARY: Force test mode for testing Stripe integration
const FORCE_TEST_MODE = true;

const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Production Stripe IDs
const productionConfig = {
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

// Test Stripe IDs (for localhost)
const testConfig = {
  topUp: {
    priceId: 'price_1SiH0wPU9E45VDzjVUwnRnxU',
    productId: 'prod_SDuQwcDcLNpFsl'
  },
  starter: {
    productId: 'prod_SApqHExCIJHZbN',
    monthly: 'price_1SiH3dPU9E45VDzjXqRqGXjl',
    yearly: 'price_1SiH3dPU9E45VDzjePBeHO5T'
  },
  pro: {
    productId: 'prod_SAprsgkM7ZjCXr',
    monthly: 'price_1SiH4yPU9E45VDzjOndlKcRy',
    yearly: 'price_1SiH4yPU9E45VDzjDhA4TLIc'
  },
  premium: {
    productId: 'prod_SAprvoCikmsgYW',
    monthly: 'price_1SiH6mPU9E45VDzjUTH2VCPy',
    yearly: 'price_1SiH6mPU9E45VDzjWh5DZKRJ'
  }
};

// Export the appropriate config based on environment
// TEMPORARY: Using FORCE_TEST_MODE for testing - set to false for production!
export const stripeConfig = (FORCE_TEST_MODE || isLocalhost) ? testConfig : productionConfig;

// Helper to get top-up details
export const getTopUpConfig = () => stripeConfig.topUp;

// Helper to get plan prices
export const getPlanConfig = (planId: 'starter' | 'pro' | 'premium') => stripeConfig[planId];

