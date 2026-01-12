/**
 * Tab-Specific Dynamic Headers Configuration
 *
 * Provides SEO-optimized header variations for tab pages based on route parameters.
 * Each tab (AI Music, AI Video Shorts, Social Media, Pricing) has custom headers.
 */

export interface TabHeaders {
  badge: string;
  title: string;
  subtitle: string;
}

// ========================================
// AI MUSIC PAGE HEADERS
// ========================================

export function getAIMusicHeaders(pathname: string): TabHeaders {
  const path = pathname.replace(/^\/ai-music\/?/, '').replace(/\/$/, '');

  // Default AI Music page
  if (!path) {
    return {
      badge: 'AI Music Generator',
      title: 'Create Music in Any Genre with AI',
      subtitle: 'Generate original songs in seconds. 32 genres, 24 languages. Your music, your rights — use it anywhere you want.',
    };
  }

  // Genre routes: /ai-music/pop, /ai-music/hip-hop
  const genreMap: Record<string, { name: string; description: string }> = {
    'pop': { name: 'Pop', description: 'catchy pop songs' },
    'hip-hop': { name: 'Hip-Hop', description: 'authentic hip-hop beats and flows' },
    'rock': { name: 'Rock', description: 'powerful rock anthems' },
    'jazz': { name: 'Jazz', description: 'smooth jazz compositions' },
    'electronic': { name: 'Electronic', description: 'electronic dance music' },
    'classical': { name: 'Classical', description: 'orchestral classical pieces' },
    'country': { name: 'Country', description: 'country music with twang' },
    'rnb': { name: 'R&B', description: 'soulful R&B grooves' },
    'latin': { name: 'Latin', description: 'vibrant Latin rhythms' },
    'k-pop': { name: 'K-Pop', description: 'energetic K-Pop hits' },
    'indie': { name: 'Indie', description: 'unique indie sounds' },
    'metal': { name: 'Metal', description: 'heavy metal tracks' },
  };

  if (genreMap[path]) {
    const genre = genreMap[path];
    return {
      badge: `AI ${genre.name} Music Generator`,
      title: `Create ${genre.name} Music with AI`,
      subtitle: `Generate professional ${genre.description} in seconds. Perfect for artists, producers, and content creators.`,
    };
  }

  // Language routes: /ai-music/spanish-music, /ai-music/japanese-music
  const languageMatch = path.match(/^([a-z]+)-music$/);
  if (languageMatch) {
    const langMap: Record<string, string> = {
      'spanish': 'Spanish',
      'french': 'French',
      'japanese': 'Japanese',
      'korean': 'Korean',
      'german': 'German',
      'italian': 'Italian',
      'portuguese': 'Portuguese',
      'chinese': 'Chinese',
      'hindi': 'Hindi',
      'arabic': 'Arabic',
    };
    const language = langMap[languageMatch[1]] || languageMatch[1];
    return {
      badge: `AI ${language} Music Generator`,
      title: `Create AI Music in ${language}`,
      subtitle: `Generate songs with authentic ${language} vocals. Native-quality lyrics and pronunciation powered by AI.`,
    };
  }

  // Viral routes: /ai-music/viral-tiktok, /ai-music/trending
  const viralMap: Record<string, { badge: string; title: string; subtitle: string }> = {
    'viral-tiktok': {
      badge: 'Viral TikTok Music Generator',
      title: 'Create Viral TikTok Music with AI',
      subtitle: 'Generate TikTok-ready tracks optimized for trending sounds and maximum engagement.',
    },
    'youtube-shorts': {
      badge: 'YouTube Shorts Music Generator',
      title: 'Create YouTube Shorts Music with AI',
      subtitle: 'Generate copyright-free music perfect for YouTube Shorts that keeps viewers watching.',
    },
    'instagram-reels': {
      badge: 'Instagram Reels Music Generator',
      title: 'Create Instagram Reels Music with AI',
      subtitle: 'Generate trending Reels audio that captures attention and boosts engagement.',
    },
    'trending': {
      badge: 'Trending Music Generator',
      title: 'Create Trending Music with AI',
      subtitle: 'Generate music in trending styles that resonate with today\'s audiences across all platforms.',
    },
  };

  if (viralMap[path]) {
    return viralMap[path];
  }

  // Default fallback with path name
  const displayName = path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    badge: `AI ${displayName} Music`,
    title: `Create ${displayName} Music with AI`,
    subtitle: 'Generate professional, copyright-free music in seconds with AI.',
  };
}

// ========================================
// AI VIDEO SHORTS PAGE HEADERS
// ========================================

export function getAIVideoShortsHeaders(pathname: string): TabHeaders {
  const path = pathname.replace(/^\/ai-video-shorts\/?/, '').replace(/\/$/, '');

  // Default AI Video Shorts page
  if (!path) {
    return {
      badge: 'AI Video Shorts Generator',
      title: 'Create UGC Videos with AI',
      subtitle: 'Transform your products into engaging video content. AI avatars showcase your products 24/7 with perfect delivery, multiple languages, and unlimited scalability.',
    };
  }

  // Use case routes
  const useCaseMap: Record<string, { badge: string; title: string; subtitle: string }> = {
    'product': {
      badge: 'Product Video Generator',
      title: 'Create Product Videos with AI',
      subtitle: 'Transform your products into scroll-stopping videos perfect for TikTok, Instagram Reels, and YouTube Shorts.',
    },
    'ugc': {
      badge: 'UGC Video Generator',
      title: 'Create UGC Videos with AI',
      subtitle: 'Generate authentic user-generated content style videos at scale. No filming required.',
    },
    'ads': {
      badge: 'Ad Video Generator',
      title: 'Create Ad Videos with AI',
      subtitle: 'Generate high-converting video ads in seconds. Perfect for Facebook, Instagram, and TikTok advertising.',
    },
    'promo': {
      badge: 'Promo Video Generator',
      title: 'Create Promo Videos with AI',
      subtitle: 'Create professional promotional videos that drive conversions and boost brand awareness.',
    },
    'social': {
      badge: 'Social Media Video Generator',
      title: 'Create Social Media Videos with AI',
      subtitle: 'Generate engaging social content optimized for every platform - TikTok, Reels, Shorts, and more.',
    },
    'tiktok': {
      badge: 'TikTok Video Generator',
      title: 'Create TikTok Videos with AI',
      subtitle: 'Generate viral TikTok content with AI. Trending formats, perfect timing, maximum engagement.',
    },
    'instagram': {
      badge: 'Instagram Reels Generator',
      title: 'Create Instagram Reels with AI',
      subtitle: 'Generate scroll-stopping Reels that boost your Instagram engagement and follower growth.',
    },
    'youtube': {
      badge: 'YouTube Shorts Generator',
      title: 'Create YouTube Shorts with AI',
      subtitle: 'Generate YouTube Shorts that capture attention and drive subscribers to your channel.',
    },
    'brand': {
      badge: 'Brand Video Generator',
      title: 'Create Brand Videos with AI',
      subtitle: 'Generate professional brand videos that tell your story and connect with your audience.',
    },
    'marketing': {
      badge: 'Marketing Video Generator',
      title: 'Create Marketing Videos with AI',
      subtitle: 'Generate marketing videos that convert. Perfect for campaigns, launches, and promotions.',
    },
  };

  if (useCaseMap[path]) {
    return useCaseMap[path];
  }

  // Style routes: /ai-video-shorts/anime-style, /ai-video-shorts/realistic-style
  const styleMatch = path.match(/^([a-z]+)-style$/);
  if (styleMatch) {
    const styleMap: Record<string, string> = {
      'anime': 'Anime',
      'realistic': 'Realistic',
      '3d': '3D',
      'cartoon': 'Cartoon',
      'cinematic': 'Cinematic',
      'minimalist': 'Minimalist',
    };
    const style = styleMap[styleMatch[1]] || styleMatch[1];
    return {
      badge: `${style} Video Generator`,
      title: `Create ${style} Videos with AI`,
      subtitle: `Generate stunning ${style.toLowerCase()}-style videos perfect for social media and marketing.`,
    };
  }

  // Viral platform routes
  const viralMap: Record<string, { badge: string; title: string; subtitle: string }> = {
    'viral-tiktok': {
      badge: 'Viral TikTok Video Generator',
      title: 'Create Viral TikTok Videos with AI',
      subtitle: 'Generate TikTok videos optimized for the algorithm. Trending formats, perfect hooks, maximum virality.',
    },
    'reels': {
      badge: 'Instagram Reels Generator',
      title: 'Create Instagram Reels with AI',
      subtitle: 'Generate Reels that stop the scroll and boost your Instagram presence.',
    },
  };

  if (viralMap[path]) {
    return viralMap[path];
  }

  // Default fallback
  const displayName = path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    badge: `AI ${displayName} Video Generator`,
    title: `Create ${displayName} Videos with AI`,
    subtitle: 'Generate professional video content in seconds with AI.',
  };
}

// ========================================
// SOCIAL MEDIA PAGE HEADERS
// ========================================

export function getSocialMediaHeaders(pathname: string): TabHeaders {
  const path = pathname.replace(/^\/social-media\/?/, '').replace(/\/$/, '');

  // Default Social Media page
  if (!path) {
    return {
      badge: 'Social Media Publishing',
      title: 'Publish to All Platforms in One Click',
      subtitle: 'Stop manually posting to each platform. Connect your accounts once, then share your music and videos everywhere with a single click.',
    };
  }

  // Platform routes
  const platformMap: Record<string, { badge: string; title: string; subtitle: string }> = {
    'youtube': {
      badge: 'YouTube Publishing',
      title: 'Publish to YouTube Automatically',
      subtitle: 'Schedule and auto-post your videos to YouTube. Optimize titles, descriptions, and tags for maximum reach.',
    },
    'tiktok': {
      badge: 'TikTok Publishing',
      title: 'Publish to TikTok Automatically',
      subtitle: 'Auto-post to TikTok at optimal times. Schedule unlimited videos and grow your TikTok presence.',
    },
    'instagram': {
      badge: 'Instagram Publishing',
      title: 'Publish to Instagram Automatically',
      subtitle: 'Schedule Reels and posts to Instagram. Maintain consistent posting without lifting a finger.',
    },
    'facebook': {
      badge: 'Facebook Publishing',
      title: 'Publish to Facebook Automatically',
      subtitle: 'Auto-post videos and music to Facebook. Schedule content and engage your audience effortlessly.',
    },
    'linkedin': {
      badge: 'LinkedIn Publishing',
      title: 'Publish to LinkedIn Automatically',
      subtitle: 'Share professional content to LinkedIn on autopilot. Build your brand with consistent posting.',
    },
    'twitter': {
      badge: 'Twitter Publishing',
      title: 'Publish to Twitter Automatically',
      subtitle: 'Schedule tweets and media posts. Stay active on Twitter without constant manual posting.',
    },
    'x': {
      badge: 'X Publishing',
      title: 'Publish to X Automatically',
      subtitle: 'Auto-post your content to X (Twitter). Schedule unlimited posts and grow your presence.',
    },
    'pinterest': {
      badge: 'Pinterest Publishing',
      title: 'Publish to Pinterest Automatically',
      subtitle: 'Schedule pins and drive traffic from Pinterest. Automate your Pinterest marketing strategy.',
    },
  };

  if (platformMap[path]) {
    return platformMap[path];
  }

  // Feature routes
  const featureMap: Record<string, { badge: string; title: string; subtitle: string }> = {
    'scheduler': {
      badge: 'Social Media Scheduler',
      title: 'Schedule Posts to All Platforms',
      subtitle: 'Plan your content calendar weeks in advance. Auto-post at optimal times for maximum engagement.',
    },
    'analytics': {
      badge: 'Social Media Analytics',
      title: 'Track Performance Across All Platforms',
      subtitle: 'Monitor views, engagement, and growth across all your social accounts in one dashboard.',
    },
    'auto-post': {
      badge: 'Auto-Posting Tool',
      title: 'Auto-Post to All Platforms',
      subtitle: 'Create once, publish everywhere automatically. Save hours every week with intelligent auto-posting.',
    },
    'cross-post': {
      badge: 'Cross-Platform Publishing',
      title: 'Cross-Post to All Platforms Instantly',
      subtitle: 'Share your content to YouTube, TikTok, Instagram, Facebook, and more with one click.',
    },
    'calendar': {
      badge: 'Social Media Calendar',
      title: 'Manage Your Content Calendar',
      subtitle: 'Visualize your posting schedule across all platforms. Drag, drop, and schedule content effortlessly.',
    },
    'bulk-upload': {
      badge: 'Bulk Upload Tool',
      title: 'Upload Multiple Posts at Once',
      subtitle: 'Schedule weeks of content in minutes. Upload and schedule 100+ posts across all platforms.',
    },
  };

  if (featureMap[path]) {
    return featureMap[path];
  }

  // Default fallback
  const displayName = path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    badge: `Social Media ${displayName}`,
    title: `${displayName} for Social Media`,
    subtitle: 'Streamline your social media workflow and grow your presence across all platforms.',
  };
}

// ========================================
// PRICING PAGE HEADERS
// ========================================

export function getPricingHeaders(pathname: string): TabHeaders {
  const path = pathname.replace(/^\/pricing\/?/, '').replace(/\/$/, '');

  // Default Pricing page
  if (!path) {
    return {
      badge: 'Pricing Plans',
      title: 'Unlimited AI Creativity Starting Today',
      subtitle: 'Generate unlimited AI images, videos, viral shorts, and avatars.',
    };
  }

  // Plan-specific routes
  const planMap: Record<string, { badge: string; title: string; subtitle: string }> = {
    'free': {
      badge: 'Free Plan',
      title: 'Start Creating for Free',
      subtitle: 'Try Gruvi with 2 free credits. Generate AI music and videos with no credit card required.',
    },
    'starter': {
      badge: 'Starter Plan',
      title: 'Perfect for Getting Started',
      subtitle: 'Generate unlimited AI music and videos. Perfect for content creators and small businesses.',
    },
    'pro': {
      badge: 'Pro Plan',
      title: 'Most Popular for Creators',
      subtitle: 'Everything in Starter, plus advanced features and priority support for serious creators.',
    },
    'business': {
      badge: 'Business Plan',
      title: 'Scale Your Content Creation',
      subtitle: 'Advanced features, team collaboration, and white-label options for growing businesses.',
    },
    'enterprise': {
      badge: 'Enterprise Plan',
      title: 'Custom Solutions for Enterprises',
      subtitle: 'Unlimited usage, dedicated support, custom integrations, and SLA guarantees.',
    },
    'monthly': {
      badge: 'Monthly Pricing',
      title: 'Flexible Monthly Plans',
      subtitle: 'Pay month-to-month with the flexibility to upgrade, downgrade, or cancel anytime.',
    },
    'yearly': {
      badge: 'Annual Pricing',
      title: 'Save 40% with Annual Plans',
      subtitle: 'Get 2 months free when you subscribe annually. Best value for committed creators.',
    },
    'lifetime': {
      badge: 'Lifetime Deal',
      title: 'Pay Once, Create Forever',
      subtitle: 'One-time payment for lifetime access. No recurring fees, unlimited creation forever.',
    },
  };

  if (planMap[path]) {
    return planMap[path];
  }

  // Use case pricing routes
  const useCaseMap: Record<string, { badge: string; title: string; subtitle: string }> = {
    'for-creators': {
      badge: 'Pricing for Creators',
      title: 'Creator-Friendly Pricing',
      subtitle: 'Affordable plans designed for content creators, influencers, and YouTubers.',
    },
    'for-businesses': {
      badge: 'Pricing for Businesses',
      title: 'Business Pricing Plans',
      subtitle: 'Scalable solutions for businesses of all sizes. Team accounts and bulk creation included.',
    },
    'for-agencies': {
      badge: 'Pricing for Agencies',
      title: 'Agency Pricing Plans',
      subtitle: 'White-label options, client management, and bulk generation for marketing agencies.',
    },
    'for-musicians': {
      badge: 'Pricing for Musicians',
      title: 'Musician Pricing Plans',
      subtitle: 'Commercial licensing, unlimited downloads, and full rights for music professionals.',
    },
    'for-marketers': {
      badge: 'Pricing for Marketers',
      title: 'Marketer Pricing Plans',
      subtitle: 'Ad creation, A/B testing, and analytics for digital marketing professionals.',
    },
    'for-influencers': {
      badge: 'Pricing for Influencers',
      title: 'Influencer Pricing Plans',
      subtitle: 'Unlimited content generation to keep your social media presence consistent and engaging.',
    },
  };

  if (useCaseMap[path]) {
    return useCaseMap[path];
  }

  // Default fallback
  const displayName = path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    badge: `${displayName} Pricing`,
    title: `${displayName} Plans`,
    subtitle: 'Choose the plan that fits your needs and start creating with AI today.',
  };
}
