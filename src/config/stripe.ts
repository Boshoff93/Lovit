// Stripe configuration
// CURRENTLY USING: TEST IDs for testing
//
// ===================================================================================
// PRODUCTION STRIPE IDs (restore these after testing):
// ===================================================================================
// Top-ups:
//   2500:  productId: 'prod_SDuZQfG5jCbfwZ', priceId: 'price_1SnUjOB6HvdZJCd55v24fmPe'
//   10000: productId: 'prod_ThqdsQBYBfbACF', priceId: 'price_1SnUlAB6HvdZJCd5T1pufEBE'
//   25000: productId: 'prod_Thqgf4M9iCHzxj', priceId: 'price_1SnUm9B6HvdZJCd5qPqqRlQ8'
//
// Subscriptions:
//   starter:  productId: 'prod_SApdzvErjotcRN', monthly: 'price_1SndETB6HvdZJCd560ysur06', yearly: 'price_1SndFBB6HvdZJCd5R49zzb2A'
//   scale:    productId: 'prod_SApgUFg3gLoB70', monthly: 'price_1SndGRB6HvdZJCd56Vj0oeXq', yearly: 'price_1SndG9B6HvdZJCd5OCA3MxsS'
//   hardcore: productId: 'prod_SAphmL67DhziEI', monthly: 'price_1SndHlB6HvdZJCd5QrZvPZh9', yearly: 'price_1SndI5B6HvdZJCd56Ctrk6d3'
//
// Legacy top-up: priceId: 'price_1SkQupB6HvdZJCd5q3km6imx', productId: 'prod_SDuZQfG5jCbfwZ'
// ===================================================================================

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
// NOTE: Create new Stripe products for these bundles and update the priceId/productId
export const topUpBundles: TopUpBundle[] = [
  {
    id: 'topup-2500',
    tokens: 2500,
    price: 19,
    priceId: 'price_1Srs64PiRhmm7KZmzn0TaO8F',
    productId: 'prod_TpXAXcN4C94NhX',
    description: 'Instant token boost. Add 2,500 tokens to your account. Never expires, use for songs, videos, or any generation.',
  },
  {
    id: 'topup-10000',
    tokens: 10000,
    price: 69,
    priceId: 'price_1Srs6XPiRhmm7KZmlqDBNuMW',
    productId: 'prod_TpXAWWB2wJJDWr',
    badge: 'MOST POPULAR',
    description: 'Instant token boost. Add 10,000 tokens to your account. Never expires, use for songs, videos, or any generation.',
  },
  {
    id: 'topup-25000',
    tokens: 25000,
    price: 149,
    priceId: 'price_1Srs6vPiRhmm7KZmlV58zIwM',
    productId: 'prod_TpXBIp1GTodt98',
    badge: 'BEST VALUE',
    description: 'Instant token boost. Add 25,000 tokens to your account. Never expires, use for songs, videos, or any generation.',
  },
];

// Production Stripe IDs (used everywhere including localhost)
// NOTE: When creating new Stripe products, update these IDs
// New pricing: Starter $39/$29, Scale $99/$74, Hardcore $199/$149
export const stripeConfig = {
  // Legacy single top-up (keeping for backwards compatibility)
  topUp: {
    priceId: 'price_1Srs64PiRhmm7KZmzn0TaO8F',
    productId: 'prod_TpXAXcN4C94NhX'
  },
  // Starter: $39/mo monthly, $29/mo yearly ($348/yr) - 5,000 tokens
  starter: {
    productId: 'prod_TpXSZj2sesIn6F',
    monthly: 'price_1SrsNiPiRhmm7KZmVYk6jUyw',
    yearly: 'price_1SrsO5PiRhmm7KZmGD3OhTuj'
  },
  // Scale (formerly Pro): $99/mo monthly, $74/mo yearly ($888/yr) - 20,000 tokens
  scale: {
    productId: 'prod_TpXBIp1GTodt98',
    monthly: 'price_1SrsObPiRhmm7KZmRVmXT4hw',
    yearly: 'price_1SrsOrPiRhmm7KZm6ngXadnw'
  },
  // Beast (formerly Hardcore/Premium): $199/mo monthly, $149/mo yearly ($1,788/yr) - 50,000 tokens
  hardcore: {
    productId: 'prod_TpXUNhRcj9OEvk',
    monthly: 'price_1SrsPLPiRhmm7KZmoBV5mY6a',
    yearly: 'price_1SrsQ6PiRhmm7KZmFERRi7AJ'
  },
  // Beast alias (same as hardcore)
  beast: {
    productId: 'prod_TpXUNhRcj9OEvk',
    monthly: 'price_1SrsPLPiRhmm7KZmoBV5mY6a',
    yearly: 'price_1SrsQ6PiRhmm7KZmFERRi7AJ'
  },
  // Legacy aliases for backwards compatibility
  pro: {
    productId: 'prod_TpXBIp1GTodt98',
    monthly: 'price_1SrsObPiRhmm7KZmRVmXT4hw',
    yearly: 'price_1SrsOrPiRhmm7KZm6ngXadnw'
  },
  premium: {
    productId: 'prod_TpXUNhRcj9OEvk',
    monthly: 'price_1SrsPLPiRhmm7KZmoBV5mY6a',
    yearly: 'price_1SrsQ6PiRhmm7KZmFERRi7AJ'
  }
};

// Helper to get top-up bundles
export const getTopUpBundles = () => topUpBundles;

// Helper to get a specific top-up bundle by ID
export const getTopUpBundle = (bundleId: string) => topUpBundles.find(b => b.id === bundleId);

// Helper to get legacy top-up details (backwards compatibility)
export const getTopUpConfig = () => stripeConfig.topUp;

// Helper to get plan prices
export const getPlanConfig = (planId: 'starter' | 'scale' | 'hardcore' | 'beast' | 'pro' | 'premium') => stripeConfig[planId];

