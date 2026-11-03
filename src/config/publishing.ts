export const DISTRIBUTION_TAGLINE = "Content distribution. Built for agents.";
export const DISTRIBUTION_DESCRIPTION =
  "Content distribution built for agents. Publish and schedule social videos with Gruvi's API and MCP server, custom thumbnails and a social calendar.";
export const publishingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 10,
    posts: 60,
    productId: "prod_SApdzvErjotcRN",
    priceId: "price_1UXBpVB6HvdZJCd5ptfudrcw",
    description: "For one publishing workflow.",
  },
  {
    id: "scale",
    name: "Scale",
    price: 25,
    posts: 120,
    productId: "prod_SApgUFg3gLoB70",
    priceId: "price_1UXBpWB6HvdZJCd5WDP2SbSB",
    description: "For a growing publishing schedule.",
  },
  {
    id: "pro",
    name: "Pro",
    price: 50,
    posts: 240,
    productId: "prod_SAphmL67DhziEI",
    priceId: "price_1UXBpWB6HvdZJCd5M1Ao8eki",
    description: "For busy agents and teams.",
  },
] as const;
export const distributionNav = [
  { label: "Overview", path: "/dashboard", icon: "overview" },
  { label: "New post", path: "/posts/new", icon: "post" },
  { label: "Carousel posts", path: "/posts/carousel", icon: "post" },
  { label: "Bulk scheduling", path: "/posts/bulk", icon: "calendar" },
  { label: "Media library", path: "/media", icon: "media" },
  {
    label: "Posts & schedule",
    path: "/settings/scheduled-content",
    icon: "calendar",
  },
  { label: "Analytics", path: "/analytics", icon: "analytics" },
  {
    label: "Connected accounts",
    path: "/settings/connected-accounts",
    icon: "accounts",
  },
  { label: "Agent access", path: "/agents", icon: "agent" },
];
export const platformNames: Record<string, string> = {
  twitter: "X",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

export function hasPublishingAccess(subscription?: { tier?: string; status?: string; currentPeriodEnd?: number; accessHold?: string } | null, now = Date.now()): boolean {
  return Boolean(subscription && ['starter', 'pro', 'scale', 'premium', 'beast', 'hardcore'].includes(subscription.tier || '') && ['active', 'trialing'].includes(subscription.status || '') && !subscription.accessHold && (subscription.currentPeriodEnd === undefined || (Number.isFinite(subscription.currentPeriodEnd) && subscription.currentPeriodEnd > 0 && subscription.currentPeriodEnd * 1000 > now)));
}
