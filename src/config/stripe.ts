// Stripe configuration - always use production Stripe IDs

// Top-up bundle definitions
export interface TopUpBundle {
  id: string;
  tokens: number;
  price: number;
  priceId: string;
  productId: string;
  badge?: string; // Optional badge label (e.g., "MOST POPULAR", "BEST VALUE")
  description?: string; // Description for Stripe product
}

// Top-up bundles (slightly more expensive than subscription value)
// Description: "Instant token boost. Add X tokens to your account. Never expires, use for songs, videos, or any generation."
export const topUpBundles: TopUpBundle[] = [
  {
    id: 'topup-1000',
    tokens: 1000,
    price: 12.99,
    priceId: 'price_1SkQupB6HvdZJCd5q3km6imx',
    productId: 'prod_SDuZQfG5jCbfwZ',
    description: 'Instant token boost. Add 1,000 tokens to your account. Never expires, use for songs, videos, or any generation.',
  },
  {
    id: 'topup-5000',
    tokens: 5000,
    price: 49.99,
    priceId: 'price_1SkQwGB6HvdZJCd5bt3D6XZP',
    productId: 'prod_ThqdsQBYBfbACF',
    badge: 'MOST POPULAR',
    description: 'Instant token boost. Add 5,000 tokens to your account. Never expires, use for songs, videos, or any generation.',
  },
  {
    id: 'topup-10000',
    tokens: 10000,
    price: 89.99,
    priceId: 'price_1SkQyxB6HvdZJCd5rqi8buXl',
    productId: 'prod_Thqgf4M9iCHzxj',
    badge: 'BEST VALUE',
    description: 'Instant token boost. Add 10,000 tokens to your account. Never expires, use for songs, videos, or any generation.',
  },
];

// Production Stripe IDs (used everywhere including localhost)
export const stripeConfig = {
  // Legacy single top-up (keeping for backwards compatibility)
  topUp: {
    priceId: 'price_1SkQupB6HvdZJCd5q3km6imx',
    productId: 'prod_SDuZQfG5jCbfwZ'
  },
  starter: {
    productId: 'prod_SApdzvErjotcRN',
    monthly: 'price_1SkQkVB6HvdZJCd5O3R8X8ck',
    yearly: 'price_1RQOkxB6HvdZJCd5un20D2Y2'
  },
  pro: {
    productId: 'prod_SApgUFg3gLoB70',
    monthly: 'price_1SkQm7B6HvdZJCd58zuxl8DI',
    yearly: 'price_1SkQm7B6HvdZJCd5IhSkNYIK'
  },
  premium: {
    productId: 'prod_SAphmL67DhziEI',
    monthly: 'price_1SkQsXB6HvdZJCd5WgeI2SGs',
    yearly: 'price_1SkQsXB6HvdZJCd5oOjkBNE2'
  }
};

// Helper to get top-up bundles
export const getTopUpBundles = () => topUpBundles;

// Helper to get a specific top-up bundle by ID
export const getTopUpBundle = (bundleId: string) => topUpBundles.find(b => b.id === bundleId);

// Helper to get legacy top-up details (backwards compatibility)
export const getTopUpConfig = () => stripeConfig.topUp;

// Helper to get plan prices
export const getPlanConfig = (planId: 'starter' | 'pro' | 'premium') => stripeConfig[planId];

