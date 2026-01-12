/**
 * Dynamic Section Headers Configuration
 *
 * This config provides SEO-optimized header variations based on route context.
 * Headers adapt based on genre, platform, use case, language, mood, etc.
 */

export interface SectionHeaders {
  // Hero section
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  // Product Videos section
  productVideos: {
    title: string;
    subtitle: string;
  };
  // Landscape Video section
  landscapeVideo: {
    title: string;
    subtitle: string;
  };
  // Social Platforms section
  socialPlatforms: {
    title: string;
    subtitle: string;
  };
  // Featured Tracks section
  featuredTracks: {
    title: string;
    subtitle: string;
  };
  // Genres section
  genres: {
    title: string;
    subtitle: string;
  };
  // Languages section
  languages: {
    title: string;
    subtitle: string;
  };
  // Moods section
  moods: {
    title: string;
    subtitle: string;
  };
  // Everything You Need section
  features: {
    title: string;
    subtitle: string;
  };
  // Pricing section
  pricing: {
    title: string;
    subtitle: string;
  };
  // FAQ section
  faq: {
    title: string;
  };
  // Explore More section
  exploreMore: {
    title: string;
  };
}

// Default headers (base template)
export const defaultHeaders: SectionHeaders = {
  hero: {
    badge: 'AI Music + Video Generator',
    title: 'Create Original Music & Videos with AI',
    subtitle: 'Generate studio-quality songs and stunning videos in seconds. No musical experience needed.',
  },
  productVideos: {
    title: 'AI-Powered Product Videos',
    subtitle: 'Create stunning product videos with AI. Perfect for TikTok, Instagram Reels, and YouTube Shorts.',
  },
  landscapeVideo: {
    title: 'Cinematic Brand Videos',
    subtitle: 'Showcase your products with cinematic AI-generated videos perfect for ads and social media.',
  },
  socialPlatforms: {
    title: 'Publish to All Platforms in One Click',
    subtitle: 'Say goodbye to logging into each platform separately. Create your content once, then blast it everywhere instantly.',
  },
  featuredTracks: {
    title: 'Listen to Sample Tracks',
    subtitle: 'Discover the quality and variety of AI-generated music',
  },
  genres: {
    title: 'Create in Any Genre',
    subtitle: 'From Pop to Classical, Hip-Hop to Jazz - AI-powered music in every style',
  },
  languages: {
    title: 'Make Music in Any Language',
    subtitle: 'Create songs with native-quality vocals in 24+ languages - reach a global audience',
  },
  moods: {
    title: 'Set the Perfect Mood',
    subtitle: 'Uplifting, melancholic, energetic - create music that captures any emotion',
  },
  features: {
    title: 'Everything You Need to Create',
    subtitle: 'Professional music and video generation at your fingertips',
  },
  pricing: {
    title: 'Start Making Music for Free',
    subtitle: 'New customers get 2 free songs when they sign up. Select the plan that best fits your needs.',
  },
  faq: {
    title: 'Frequently Asked Questions',
  },
  exploreMore: {
    title: 'Explore More',
  },
};

/**
 * Generate niche-specific headers based on route type and parameters
 */
export function getNicheHeaders(routeType: string, routeParam?: string): SectionHeaders {
  const param = routeParam || '';
  const paramDisplay = param.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Genre-specific headers
  if (routeType === 'genre') {
    return {
      hero: {
        badge: `${paramDisplay} Music Generator`,
        title: `Create Original ${paramDisplay} Music with AI`,
        subtitle: `Generate professional ${paramDisplay} tracks in seconds. Perfect for artists, producers, and content creators.`,
      },
      productVideos: {
        title: `${paramDisplay} Music for Product Videos`,
        subtitle: `Energize your product content with AI-generated ${paramDisplay} tracks that boost engagement and conversions.`,
      },
      landscapeVideo: {
        title: `${paramDisplay} Background Music for Brands`,
        subtitle: `Elevate your brand videos with custom ${paramDisplay} soundtracks that match your identity.`,
      },
      socialPlatforms: {
        title: 'Share Your Music to All Platforms',
        subtitle: `Post your ${paramDisplay} tracks to YouTube, Spotify, TikTok, and Instagram in one click.`,
      },
      featuredTracks: {
        title: `Sample ${paramDisplay} Tracks`,
        subtitle: `Listen to AI-generated ${paramDisplay} music and hear the quality for yourself`,
      },
      genres: {
        title: 'Explore More Genres',
        subtitle: `Love ${paramDisplay}? Discover other styles and expand your musical horizons`,
      },
      languages: {
        title: `${paramDisplay} Music in Any Language`,
        subtitle: `Create ${paramDisplay} songs with vocals in English, Spanish, Japanese, and 20+ more languages`,
      },
      moods: {
        title: `Set the Mood for Your ${paramDisplay}`,
        subtitle: `From uplifting to melancholic - create ${paramDisplay} tracks that capture any emotion`,
      },
      features: {
        title: `Complete ${paramDisplay} Creation Toolkit`,
        subtitle: `Everything you need to produce, edit, and share professional ${paramDisplay} music`,
      },
      pricing: {
        title: `Start Creating ${paramDisplay} Music for Free`,
        subtitle: `Get 2 free ${paramDisplay} tracks when you sign up. No credit card required.`,
      },
      faq: {
        title: `${paramDisplay} Music Generator FAQ`,
      },
      exploreMore: {
        title: 'More Ways to Create',
      },
    };
  }

  // Platform-specific headers
  if (routeType === 'platform') {
    return {
      hero: {
        badge: `Music for ${paramDisplay}`,
        title: `Create Viral ${paramDisplay} Music with AI`,
        subtitle: `Generate ${paramDisplay}-ready tracks optimized for maximum engagement and reach.`,
      },
      productVideos: {
        title: `Product Videos for ${paramDisplay}`,
        subtitle: `Create scroll-stopping product content with AI-powered videos perfect for ${paramDisplay}.`,
      },
      landscapeVideo: {
        title: `${paramDisplay} Brand Content`,
        subtitle: `Professional video content designed for ${paramDisplay}'s audience and format.`,
      },
      socialPlatforms: {
        title: `Post to ${paramDisplay} and More`,
        subtitle: `Upload to ${paramDisplay}, TikTok, Instagram, YouTube, and all major platforms in one click.`,
      },
      featuredTracks: {
        title: `Music That Works on ${paramDisplay}`,
        subtitle: `Sample tracks optimized for ${paramDisplay}'s algorithm and audience`,
      },
      genres: {
        title: `Best Genres for ${paramDisplay}`,
        subtitle: `Discover which music styles perform best on ${paramDisplay}`,
      },
      languages: {
        title: `Reach ${paramDisplay}'s Global Audience`,
        subtitle: `Create music in 24+ languages to connect with ${paramDisplay} users worldwide`,
      },
      moods: {
        title: `${paramDisplay} Trending Moods`,
        subtitle: `Create music with the emotional tones that resonate on ${paramDisplay}`,
      },
      features: {
        title: `${paramDisplay} Content Creation Suite`,
        subtitle: `Music, videos, and scheduling - everything for ${paramDisplay} success`,
      },
      pricing: {
        title: `Start Growing on ${paramDisplay} for Free`,
        subtitle: `Get 2 free tracks to test on ${paramDisplay}. Upgrade anytime.`,
      },
      faq: {
        title: `${paramDisplay} Music FAQ`,
      },
      exploreMore: {
        title: 'Explore Other Platforms',
      },
    };
  }

  // Language-specific headers
  if (routeType === 'language') {
    return {
      hero: {
        badge: `${paramDisplay} Music Generator`,
        title: `Create AI Music in ${paramDisplay}`,
        subtitle: `Generate songs with authentic ${paramDisplay} vocals. Native-quality lyrics and pronunciation.`,
      },
      productVideos: {
        title: `Product Videos with ${paramDisplay} Music`,
        subtitle: `Reach ${paramDisplay}-speaking audiences with localized product content and music.`,
      },
      landscapeVideo: {
        title: `${paramDisplay} Brand Content`,
        subtitle: `Culturally relevant video content with authentic ${paramDisplay} soundtracks.`,
      },
      socialPlatforms: {
        title: `Share ${paramDisplay} Music Globally`,
        subtitle: `Post your ${paramDisplay} content to international platforms and reach millions.`,
      },
      featuredTracks: {
        title: `Sample ${paramDisplay} Tracks`,
        subtitle: `Listen to AI-generated music with authentic ${paramDisplay} vocals`,
      },
      genres: {
        title: `${paramDisplay} Music in Every Genre`,
        subtitle: `Pop, Rock, Hip-Hop, and more - all with native ${paramDisplay} vocals`,
      },
      languages: {
        title: 'Create in 24+ Languages',
        subtitle: `Beyond ${paramDisplay} - reach audiences in English, Spanish, Japanese, Arabic, and more`,
      },
      moods: {
        title: `Express Emotions in ${paramDisplay}`,
        subtitle: `Create music that connects emotionally with ${paramDisplay}-speaking listeners`,
      },
      features: {
        title: `${paramDisplay} Music Creation Suite`,
        subtitle: `Professional tools for creating, editing, and sharing ${paramDisplay} music`,
      },
      pricing: {
        title: `Start Creating ${paramDisplay} Music Free`,
        subtitle: `Test AI-generated ${paramDisplay} songs with 2 free credits. No payment required.`,
      },
      faq: {
        title: `${paramDisplay} Music Generator FAQ`,
      },
      exploreMore: {
        title: 'Explore More Languages',
      },
    };
  }

  // Mood-specific headers
  if (routeType === 'mood') {
    return {
      hero: {
        badge: `${paramDisplay} Music Generator`,
        title: `Create ${paramDisplay} Music with AI`,
        subtitle: `Generate ${paramDisplay.toLowerCase()} tracks that capture the perfect emotional tone for your project.`,
      },
      productVideos: {
        title: `${paramDisplay} Music for Product Videos`,
        subtitle: `Match your product's vibe with ${paramDisplay.toLowerCase()} background tracks.`,
      },
      landscapeVideo: {
        title: `${paramDisplay} Brand Soundtracks`,
        subtitle: `Create ${paramDisplay.toLowerCase()} music that reinforces your brand message.`,
      },
      socialPlatforms: {
        title: 'Share Your Music Everywhere',
        subtitle: `Post your ${paramDisplay.toLowerCase()} tracks to all social platforms in one click.`,
      },
      featuredTracks: {
        title: `Sample ${paramDisplay} Tracks`,
        subtitle: `Hear how AI captures the ${paramDisplay.toLowerCase()} mood you're looking for`,
      },
      genres: {
        title: `${paramDisplay} Music in Every Genre`,
        subtitle: `Create ${paramDisplay.toLowerCase()} music in Pop, Rock, Electronic, and more`,
      },
      languages: {
        title: `${paramDisplay} Music in Any Language`,
        subtitle: `Express ${paramDisplay.toLowerCase()} emotions in 24+ languages`,
      },
      moods: {
        title: 'Explore More Moods',
        subtitle: `Beyond ${paramDisplay.toLowerCase()} - discover energetic, peaceful, dramatic, and more`,
      },
      features: {
        title: `${paramDisplay} Music Creation Tools`,
        subtitle: `Everything you need to create perfect ${paramDisplay.toLowerCase()} soundtracks`,
      },
      pricing: {
        title: `Start Creating ${paramDisplay} Music Free`,
        subtitle: `Get 2 free ${paramDisplay.toLowerCase()} tracks to try. Upgrade when you're ready.`,
      },
      faq: {
        title: `${paramDisplay} Music FAQ`,
      },
      exploreMore: {
        title: 'Discover More Moods',
      },
    };
  }

  // Use case-specific headers (Airbnb, e-commerce, etc.)
  if (routeType === 'use-case') {
    const useCaseMap: Record<string, { name: string; context: string }> = {
      'airbnb': { name: 'Airbnb', context: 'property tours' },
      'ecommerce': { name: 'E-Commerce', context: 'product showcases' },
      'restaurant': { name: 'Restaurant', context: 'food and dining' },
      'real-estate': { name: 'Real Estate', context: 'property listings' },
      'fitness': { name: 'Fitness', context: 'workout videos' },
      'travel': { name: 'Travel', context: 'destination content' },
      'fashion': { name: 'Fashion', context: 'lookbooks and runway' },
      'tech': { name: 'Tech', context: 'product demos' },
      'automotive': { name: 'Automotive', context: 'car showcases' },
      'beauty': { name: 'Beauty', context: 'tutorials and reviews' },
    };

    const useCase = useCaseMap[param] || { name: paramDisplay, context: 'content' };

    return {
      hero: {
        badge: `${useCase.name} Content Generator`,
        title: `Create Stunning ${useCase.name} Videos with AI`,
        subtitle: `Generate professional ${useCase.context} videos with custom music in minutes.`,
      },
      productVideos: {
        title: `AI-Powered ${useCase.name} Videos`,
        subtitle: `Transform your ${useCase.context} into engaging content that converts viewers into customers.`,
      },
      landscapeVideo: {
        title: `Professional ${useCase.name} Showcases`,
        subtitle: `Cinematic videos perfect for ${useCase.context} and brand storytelling.`,
      },
      socialPlatforms: {
        title: `Publish ${useCase.name} Content Everywhere`,
        subtitle: `Share your ${useCase.context} videos to TikTok, Instagram, YouTube, and more in one click.`,
      },
      featuredTracks: {
        title: `Music for ${useCase.name} Content`,
        subtitle: `Background tracks specifically curated for ${useCase.context}`,
      },
      genres: {
        title: `Best Music Genres for ${useCase.name}`,
        subtitle: `Discover which styles work best for ${useCase.context}`,
      },
      languages: {
        title: `Reach Global ${useCase.name} Audiences`,
        subtitle: `Create content in 24+ languages to expand your market reach`,
      },
      moods: {
        title: `Perfect Moods for ${useCase.name}`,
        subtitle: `Set the right emotional tone for ${useCase.context}`,
      },
      features: {
        title: `Complete ${useCase.name} Creation Suite`,
        subtitle: `Everything you need for professional ${useCase.context}`,
      },
      pricing: {
        title: `Start Creating ${useCase.name} Content Free`,
        subtitle: `Test with 2 free videos. Perfect for ${useCase.context}.`,
      },
      faq: {
        title: `${useCase.name} Content FAQ`,
      },
      exploreMore: {
        title: 'Explore Other Use Cases',
      },
    };
  }

  // Video style-specific headers
  if (routeType === 'video-style') {
    return {
      hero: {
        badge: `${paramDisplay} Video Generator`,
        title: `Create ${paramDisplay} Music Videos with AI`,
        subtitle: `Generate stunning ${paramDisplay.toLowerCase()}-style videos for your music in seconds.`,
      },
      productVideos: {
        title: `${paramDisplay} Product Videos`,
        subtitle: `Showcase products with eye-catching ${paramDisplay.toLowerCase()}-style visuals.`,
      },
      landscapeVideo: {
        title: `${paramDisplay} Brand Videos`,
        subtitle: `Create memorable brand content in the ${paramDisplay.toLowerCase()} aesthetic.`,
      },
      socialPlatforms: {
        title: 'Share Your Videos Everywhere',
        subtitle: `Post your ${paramDisplay.toLowerCase()} videos to all platforms instantly.`,
      },
      featuredTracks: {
        title: `Music for ${paramDisplay} Videos`,
        subtitle: `Tracks that complement the ${paramDisplay.toLowerCase()} visual style`,
      },
      genres: {
        title: `${paramDisplay} Videos in Every Genre`,
        subtitle: `Combine ${paramDisplay.toLowerCase()} visuals with any music genre`,
      },
      languages: {
        title: `${paramDisplay} Videos in Any Language`,
        subtitle: `Create globally appealing ${paramDisplay.toLowerCase()} content`,
      },
      moods: {
        title: `${paramDisplay} Mood Variations`,
        subtitle: `Express different emotions with ${paramDisplay.toLowerCase()} aesthetics`,
      },
      features: {
        title: `${paramDisplay} Video Creation Tools`,
        subtitle: `Professional toolkit for ${paramDisplay.toLowerCase()}-style content`,
      },
      pricing: {
        title: `Start Creating ${paramDisplay} Videos Free`,
        subtitle: `Get 2 free ${paramDisplay.toLowerCase()} videos to test the quality.`,
      },
      faq: {
        title: `${paramDisplay} Video Generator FAQ`,
      },
      exploreMore: {
        title: 'Explore More Video Styles',
      },
    };
  }

  // Default fallback
  return defaultHeaders;
}

/**
 * Detect route type and parameters from pathname
 */
export function parseRoute(pathname: string): { type: string; param?: string } {
  // Remove leading/trailing slashes
  const path = pathname.replace(/^\/|\/$/g, '');

  // Genre routes: /create-pop-music, /pop-music-generator
  if (path.match(/^create-([a-z-]+)-music$/) || path.match(/^([a-z-]+)-music(-generator)?$/)) {
    const match = path.match(/create-([a-z-]+)-music/) || path.match(/^([a-z-]+)-music/);
    return { type: 'genre', param: match?.[1] };
  }

  // Platform routes: /music-for-tiktok, /tiktok-music
  if (path.match(/^music-for-([a-z-]+)$/) || path.match(/^([a-z-]+)-music$/)) {
    const match = path.match(/music-for-([a-z-]+)/) || path.match(/^([a-z-]+)-music/);
    return { type: 'platform', param: match?.[1] };
  }

  // Language routes: /create-music-in-spanish, /spanish-music
  if (path.match(/^create-music-in-([a-z-]+)$/) || path.match(/^([a-z-]+)-language-music$/)) {
    const match = path.match(/create-music-in-([a-z-]+)/) || path.match(/^([a-z-]+)-language/);
    return { type: 'language', param: match?.[1] };
  }

  // Mood routes: /create-happy-music, /happy-music-generator
  if (path.match(/^create-([a-z-]+)-music$/) && !path.includes('generator')) {
    const match = path.match(/create-([a-z-]+)-music/);
    // Check if it's a mood (not genre)
    const moods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'epic', 'peaceful', 'uplifting', 'melancholic', 'chill'];
    if (moods.includes(match?.[1] || '')) {
      return { type: 'mood', param: match?.[1] };
    }
  }

  // Use case routes: /airbnb-videos, /create-airbnb-videos
  if (path.match(/^(create-)?([a-z-]+)-(videos|music)$/)) {
    const match = path.match(/^(create-)?([a-z-]+)-/);
    const useCases = ['airbnb', 'ecommerce', 'restaurant', 'real-estate', 'fitness', 'travel', 'fashion', 'tech', 'automotive', 'beauty'];
    if (useCases.includes(match?.[2] || '')) {
      return { type: 'use-case', param: match?.[2] };
    }
  }

  // Video style routes: /create-anime-music-video, /anime-video-generator
  if (path.match(/^create-([a-z-]+)-(music-)?video$/) || path.match(/^([a-z-]+)-video(-generator)?$/)) {
    const match = path.match(/create-([a-z-]+)-/) || path.match(/^([a-z-]+)-video/);
    return { type: 'video-style', param: match?.[1] };
  }

  return { type: 'default' };
}
