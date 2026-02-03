/**
 * Tab Routing Configuration
 *
 * Maps routes to their corresponding tabs for navigation purposes.
 * This ensures the correct tab is selected based on the current route.
 */

export type TabType = 'home' | 'ai-music' | 'ai-music-videos' | 'ai-video-shorts' | 'social-media' | 'blog' | 'docs' | 'pricing';

export interface TabRoute {
  path: string;
  tab: TabType;
  exact?: boolean; // If true, must match exactly. If false, can match as prefix
}

/**
 * All tab routes mapped to their corresponding tabs.
 * Routes are checked in order, so more specific routes should come first.
 */
export const tabRoutes: TabRoute[] = [
  // Exact tab pages
  { path: '/ai-music', tab: 'ai-music', exact: true },
  { path: '/ai-music-videos', tab: 'ai-music-videos', exact: true },
  { path: '/ai-video-shorts', tab: 'ai-video-shorts', exact: true },
  { path: '/social-media', tab: 'social-media', exact: true },
  { path: '/blog', tab: 'blog', exact: true },
  { path: '/docs', tab: 'docs', exact: true },
  { path: '/pricing', tab: 'pricing', exact: true },

  // Docs tab - all doc pages (prefix match)
  { path: '/docs/', tab: 'docs', exact: false },

  // Blog tab - all blog articles (prefix match)
  { path: '/blog/', tab: 'blog', exact: false },

  // AI Music tab - Niche routes (prefix match)
  { path: '/ai-music/', tab: 'ai-music', exact: false },

  // AI Video Shorts tab - Niche routes (prefix match)
  { path: '/ai-video-shorts/', tab: 'ai-video-shorts', exact: false },

  // Social Media tab - Niche routes (prefix match)
  { path: '/social-media/', tab: 'social-media', exact: false },

  // Pricing tab - Niche routes (prefix match)
  { path: '/pricing/', tab: 'pricing', exact: false },

  // Home tab - all niche landing pages and root
  { path: '/', tab: 'home', exact: true },

  // Genre routes → Home tab with dynamic headers
  { path: '/create-pop-music', tab: 'home', exact: true },
  { path: '/create-rock-music', tab: 'home', exact: true },
  { path: '/create-hip-hop-music', tab: 'home', exact: true },
  { path: '/create-jazz-music', tab: 'home', exact: true },
  { path: '/create-classical-music', tab: 'home', exact: true },
  { path: '/create-electronic-music', tab: 'home', exact: true },
  { path: '/create-edm-music', tab: 'home', exact: true },
  { path: '/create-country-music', tab: 'home', exact: true },
  { path: '/create-folk-music', tab: 'home', exact: true },
  { path: '/create-blues-music', tab: 'home', exact: true },
  { path: '/create-reggae-music', tab: 'home', exact: true },
  { path: '/create-latin-music', tab: 'home', exact: true },
  { path: '/create-k-pop-music', tab: 'home', exact: true },
  { path: '/create-j-pop-music', tab: 'home', exact: true },
  { path: '/create-indie-music', tab: 'home', exact: true },
  { path: '/create-metal-music', tab: 'home', exact: true },
  { path: '/create-punk-music', tab: 'home', exact: true },
  { path: '/create-rnb-music', tab: 'home', exact: true },
  { path: '/create-soul-music', tab: 'home', exact: true },
  { path: '/create-funk-music', tab: 'home', exact: true },
  { path: '/create-disco-music', tab: 'home', exact: true },
  { path: '/create-trap-music', tab: 'home', exact: true },
  { path: '/create-drill-music', tab: 'home', exact: true },
  { path: '/create-lofi-music', tab: 'home', exact: true },
  { path: '/create-ambient-music', tab: 'home', exact: true },
  { path: '/create-cinematic-music', tab: 'home', exact: true },
  { path: '/create-gospel-music', tab: 'home', exact: true },
  { path: '/create-opera-music', tab: 'home', exact: true },
  { path: '/create-bollywood-music', tab: 'home', exact: true },

  // Platform routes → Home tab
  { path: '/music-for-tiktok', tab: 'home', exact: true },
  { path: '/music-for-youtube', tab: 'home', exact: true },
  { path: '/music-for-instagram', tab: 'home', exact: true },
  { path: '/music-for-facebook', tab: 'home', exact: true },
  { path: '/music-for-twitter', tab: 'home', exact: true },
  { path: '/music-for-x', tab: 'home', exact: true },
  { path: '/music-for-snapchat', tab: 'home', exact: true },
  { path: '/music-for-linkedin', tab: 'home', exact: true },

  // Language routes → Home tab
  { path: '/create-music-in-spanish', tab: 'home', exact: true },
  { path: '/create-music-in-french', tab: 'home', exact: true },
  { path: '/create-music-in-german', tab: 'home', exact: true },
  { path: '/create-music-in-italian', tab: 'home', exact: true },
  { path: '/create-music-in-portuguese', tab: 'home', exact: true },
  { path: '/create-music-in-japanese', tab: 'home', exact: true },
  { path: '/create-music-in-korean', tab: 'home', exact: true },
  { path: '/create-music-in-chinese', tab: 'home', exact: true },
  { path: '/create-music-in-hindi', tab: 'home', exact: true },
  { path: '/create-music-in-arabic', tab: 'home', exact: true },
  { path: '/create-music-in-russian', tab: 'home', exact: true },
  { path: '/create-music-in-turkish', tab: 'home', exact: true },

  // Mood routes → Home tab
  { path: '/create-happy-music', tab: 'home', exact: true },
  { path: '/create-sad-music', tab: 'home', exact: true },
  { path: '/create-energetic-music', tab: 'home', exact: true },
  { path: '/create-calm-music', tab: 'home', exact: true },
  { path: '/create-romantic-music', tab: 'home', exact: true },
  { path: '/create-epic-music', tab: 'home', exact: true },
  { path: '/create-peaceful-music', tab: 'home', exact: true },
  { path: '/create-uplifting-music', tab: 'home', exact: true },
  { path: '/create-melancholic-music', tab: 'home', exact: true },
  { path: '/create-chill-music', tab: 'home', exact: true },

  // Use case routes → Home tab
  { path: '/airbnb-videos', tab: 'home', exact: true },
  { path: '/ecommerce-videos', tab: 'home', exact: true },
  { path: '/restaurant-videos', tab: 'home', exact: true },
  { path: '/real-estate-videos', tab: 'home', exact: true },
  { path: '/fitness-videos', tab: 'home', exact: true },
  { path: '/travel-videos', tab: 'home', exact: true },
  { path: '/fashion-videos', tab: 'home', exact: true },
  { path: '/tech-videos', tab: 'home', exact: true },
  { path: '/automotive-videos', tab: 'home', exact: true },
  { path: '/beauty-videos', tab: 'home', exact: true },

  // Video style routes → Home tab
  { path: '/create-anime-music-video', tab: 'home', exact: true },
  { path: '/create-cartoon-music-video', tab: 'home', exact: true },
  { path: '/create-3d-cartoon-music-video', tab: 'home', exact: true },
  { path: '/create-realistic-music-video', tab: 'home', exact: true },
  { path: '/create-cinematic-music-video', tab: 'home', exact: true },
  { path: '/create-pixar-style-music-video', tab: 'home', exact: true },
  { path: '/create-disney-style-music-video', tab: 'home', exact: true },
  { path: '/create-cyberpunk-music-video', tab: 'home', exact: true },
  { path: '/create-fantasy-music-video', tab: 'home', exact: true },
  { path: '/create-sci-fi-music-video', tab: 'home', exact: true },
];

/**
 * Get the appropriate tab for a given pathname
 * @param pathname - The current pathname (e.g., '/create-pop-music')
 * @returns The tab that should be selected
 */
export function getTabForRoute(pathname: string): TabType {
  // Normalize pathname (remove trailing slash)
  const normalizedPath = pathname.replace(/\/$/, '') || '/';

  // Check for exact matches first
  const exactMatch = tabRoutes.find(route => route.exact && route.path === normalizedPath);
  if (exactMatch) {
    return exactMatch.tab;
  }

  // Check for prefix matches
  const prefixMatch = tabRoutes.find(route => !route.exact && normalizedPath.startsWith(route.path));
  if (prefixMatch) {
    return prefixMatch.tab;
  }

  // Default to home tab
  return 'home';
}

/**
 * Check if a route should display the Home tab content
 * @param pathname - The current pathname
 * @returns True if the route should show Home tab
 */
export function isHomeRoute(pathname: string): boolean {
  return getTabForRoute(pathname) === 'home';
}
