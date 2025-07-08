export interface RouteConfig {
  path: string;
  title: string;
  hook: string;
  description: string;
  keywords: string[];
  priority: number;
  features: {
    tryOn: string;
    headshots: string;
    socialMedia: string;
    savings: string;
  };
}

export const routeConfigs: RouteConfig[] = [
  {
    path: '/',
    title: 'Lovit - AI Fashion Try-On & Virtual Styling',
    hook: 'Professional Photographer + Virtual Try-on Studio',
    description: 'Transform your fashion experience with AI-powered virtual try-on. Create stunning professional photos with your own AI model and try on any clothing item virtually.',
    keywords: ['AI fashion', 'virtual try-on', 'professional photos', 'AI model', 'fashion technology'],
    priority: 1.0,
    features: {
      tryOn: 'Try on any wedding dress or outfits before you rent or buy',
      headshots: 'Generate ultra-realistic AI headshots and professional photos',
      socialMedia: 'Create stunning content for social media in any style or setting',
      savings: 'Save thousands on professional photoshoots'
    }
  },
  {
    path: '/try-on-fashion-for-plus-size-figures',
    title: 'Plus Size Fashion Virtual Try-On | Lovit',
    hook: 'Inclusive Fashion for Every Body Type',
    description: 'Discover how AI technology is revolutionizing plus-size fashion. Try on clothing virtually and see how it looks on your unique body shape before making a purchase.',
    keywords: ['plus size fashion', 'inclusive fashion', 'body positive', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Try on plus-size dresses and outfits that flatter your body type',
      headshots: 'Generate professional photos that celebrate your unique beauty',
      socialMedia: 'Create inclusive content that represents diverse body types',
      savings: 'Save money by avoiding returns on ill-fitting clothes'
    }
  },
  {
    path: '/bachelorette-party-outfits',
    title: 'Bachelorette Party Outfits Virtual Try-On | Lovit',
    hook: 'Perfect Looks for Your Special Celebration',
    description: 'Plan your bachelorette party wardrobe with confidence. Try on stunning outfits virtually and find the perfect look for your celebration with AI-powered fashion technology.',
    keywords: ['bachelorette party', 'party outfits', 'celebration fashion', 'virtual try-on', 'AI styling'],
    priority: 0.9,
    features: {
      tryOn: 'Try on bachelorette party dresses and celebration outfits',
      headshots: 'Generate stunning photos for your special celebration',
      socialMedia: 'Create memorable content for your bachelorette party',
      savings: 'Save money by avoiding expensive party dress rentals'
    }
  },
  {
    path: '/wedding-dress-virtual-try-on',
    title: 'Wedding Dress Virtual Try-On | Lovit',
    hook: 'Find Your Dream Wedding Dress with AI',
    description: 'Experience the future of wedding dress shopping. Try on hundreds of wedding dresses virtually and see how they look on you before visiting bridal boutiques.',
    keywords: ['wedding dress', 'bridal fashion', 'virtual try-on', 'AI wedding', 'bridal shopping'],
    priority: 0.9,
    features: {
      tryOn: 'Try on wedding dresses and bridal gowns before buying',
      headshots: 'Generate beautiful bridal photos for your special day',
      socialMedia: 'Create stunning engagement and wedding content',
      savings: 'Save thousands on wedding dress shopping and photoshoots'
    }
  },
  {
    path: '/weekend-going-out-outfits',
    title: 'Weekend Going Out Outfits | Lovit',
    hook: 'Weekend Ready Looks for Every Occasion',
    description: 'Get weekend-ready with AI-powered fashion styling. Try on trendy going-out outfits and find the perfect look for your weekend adventures with virtual try-on technology.',
    keywords: ['weekend fashion', 'going out outfits', 'trendy fashion', 'virtual styling', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on weekend going-out outfits and party dresses',
      headshots: 'Generate trendy photos for your weekend adventures',
      socialMedia: 'Create Instagram-worthy content for your nights out',
      savings: 'Save money by avoiding impulse purchases on going-out clothes'
    }
  },
  {
    path: '/shopping-outfit-ideas',
    title: 'Shopping Outfit Ideas Virtual Try-On | Lovit',
    hook: 'Shop Smarter with Virtual Try-On',
    description: 'Revolutionize your shopping experience with AI-powered virtual try-on. See how clothing looks on you before buying and make confident fashion decisions.',
    keywords: ['shopping outfits', 'virtual shopping', 'fashion technology', 'AI shopping', 'smart shopping'],
    priority: 0.8,
    features: {
      tryOn: 'Try on shopping outfits and see how they look before buying',
      headshots: 'Generate photos to help you make confident purchases',
      socialMedia: 'Create content showcasing your shopping finds',
      savings: 'Save money by avoiding returns and bad purchases'
    }
  },
  {
    path: '/halloween-costume-virtual-try-on',
    title: 'Halloween Costume Virtual Try-On | Lovit',
    hook: 'Spooktacular Costumes for Every Style',
    description: 'Get creative with Halloween costume ideas using AI technology. Try on costumes virtually and find the perfect spooky or cute look for your Halloween celebration.',
    keywords: ['halloween costumes', 'costume ideas', 'virtual try-on', 'AI costumes', 'halloween fashion'],
    priority: 0.7,
    features: {
      tryOn: 'Try on Halloween costumes and spooky outfits',
      headshots: 'Generate fun Halloween photos for your celebrations',
      socialMedia: 'Create spooky content for Halloween social media',
      savings: 'Save money by avoiding expensive costume rentals'
    }
  },
  {
    path: '/formal-event-outfits',
    title: 'Formal Event Outfits Virtual Try-On | Lovit',
    hook: 'Elegant Looks for Special Occasions',
    description: 'Dress to impress for formal events with AI-powered styling. Try on elegant outfits virtually and find the perfect sophisticated look for any special occasion.',
    keywords: ['formal outfits', 'elegant fashion', 'special occasions', 'virtual styling', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on formal event dresses and elegant outfits',
      headshots: 'Generate sophisticated photos for special occasions',
      socialMedia: 'Create elegant content for formal event memories',
      savings: 'Save money by avoiding expensive formal wear rentals'
    }
  },
  {
    path: '/christmas-party-outfits',
    title: 'Christmas Party Outfits Virtual Try-On | Lovit',
    hook: 'Festive Fashion for Holiday Celebrations',
    description: 'Spread holiday cheer with stunning Christmas party outfits. Try on festive looks virtually and find the perfect outfit for your holiday celebrations.',
    keywords: ['christmas outfits', 'holiday fashion', 'party outfits', 'festive fashion', 'virtual try-on'],
    priority: 0.7,
    features: {
      tryOn: 'Try on Christmas party dresses and festive outfits',
      headshots: 'Generate merry photos for your holiday celebrations',
      socialMedia: 'Create festive content for your Christmas memories',
      savings: 'Save money by avoiding expensive holiday party outfits'
    }
  },
  {
    path: '/summer-fashion-try-on',
    title: 'Summer Fashion Virtual Try-On | Lovit',
    hook: 'Hot Summer Styles for Every Adventure',
    description: 'Stay cool and stylish this summer with AI-powered fashion. Try on summer outfits virtually and discover the perfect looks for beach days, barbecues, and summer adventures.',
    keywords: ['summer fashion', 'summer outfits', 'beach fashion', 'summer styling', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on summer dresses and beach vacation outfits',
      headshots: 'Generate sunny photos for your summer adventures',
      socialMedia: 'Create summer vibes content for your social media',
      savings: 'Save money by avoiding seasonal fashion mistakes'
    }
  },
  {
    path: '/winter-fashion-virtual-try-on',
    title: 'Winter Fashion Virtual Try-On | Lovit',
    hook: 'Cozy Winter Looks for Cold Weather',
    description: 'Bundle up in style with winter fashion virtual try-on. See how winter coats, sweaters, and accessories look on you before making seasonal purchases.',
    keywords: ['winter fashion', 'winter coats', 'cold weather fashion', 'winter styling', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on winter coats and cozy seasonal outfits',
      headshots: 'Generate warm photos for your winter memories',
      socialMedia: 'Create cozy content for your winter social media',
      savings: 'Save money by avoiding expensive winter coat purchases'
    }
  },
  {
    path: '/fall-fashion-try-on',
    title: 'Fall Fashion Virtual Try-On | Lovit',
    hook: 'Autumn Style for Cozy Weather',
    description: 'Embrace fall fashion with AI-powered virtual try-on. Try on autumn outfits and see how seasonal trends look on you before updating your wardrobe.',
    keywords: ['fall fashion', 'autumn outfits', 'seasonal fashion', 'fall styling', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on fall sweaters and autumn seasonal outfits',
      headshots: 'Generate cozy photos for your autumn memories',
      socialMedia: 'Create fall vibes content for your seasonal posts',
      savings: 'Save money by avoiding seasonal fashion mistakes'
    }
  },
  {
    path: '/spring-fashion-virtual-try-on',
    title: 'Spring Fashion Virtual Try-On | Lovit',
    hook: 'Fresh Spring Styles for Renewal',
    description: 'Welcome spring with fresh fashion ideas. Try on spring outfits virtually and discover the perfect looks for blooming weather and outdoor activities.',
    keywords: ['spring fashion', 'spring outfits', 'seasonal fashion', 'spring styling', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on spring dresses and fresh seasonal outfits',
      headshots: 'Generate blooming photos for your spring memories',
      socialMedia: 'Create fresh content for your spring social media',
      savings: 'Save money by avoiding seasonal fashion mistakes'
    }
  },
  {
    path: '/fashion-trends-virtual-try-on',
    title: 'Fashion Trends Virtual Try-On | Lovit',
    hook: 'Stay Ahead with Trending Styles',
    description: 'Keep up with the latest fashion trends using AI technology. Try on trending outfits virtually and see how current styles look on your unique body type.',
    keywords: ['fashion trends', 'trendy outfits', 'current fashion', 'trend styling', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on trending outfits and current fashion styles',
      headshots: 'Generate trendy photos that keep you ahead of the curve',
      socialMedia: 'Create trendsetting content for your social media',
      savings: 'Save money by avoiding expensive trend purchases'
    }
  },
  {
    path: '/social-media-fashion-content',
    title: 'Social Media Fashion Content | Lovit',
    hook: 'Create Stunning Content for Your Platforms',
    description: 'Elevate your social media presence with AI-generated fashion content. Create professional photos and try on outfits virtually for Instagram, TikTok, and more.',
    keywords: ['social media fashion', 'content creation', 'Instagram fashion', 'AI content', 'virtual styling'],
    priority: 0.8,
    features: {
      tryOn: 'Try on outfits perfect for your social media content',
      headshots: 'Generate Instagram-worthy photos for your platforms',
      socialMedia: 'Create consistent content for all your social channels',
      savings: 'Save thousands on professional content creation'
    }
  },
  {
    path: '/professional-headshots-virtual-try-on',
    title: 'Professional Headshots Virtual Try-On | Lovit',
    hook: 'Professional Looks for Career Success',
    description: 'Make a lasting impression with professional headshots. Try on business attire virtually and create stunning professional photos for LinkedIn and career opportunities.',
    keywords: ['professional headshots', 'business attire', 'career fashion', 'professional photos', 'AI headshots'],
    priority: 0.8,
    features: {
      tryOn: 'Try on professional business attire and office outfits',
      headshots: 'Generate LinkedIn-worthy professional headshots',
      socialMedia: 'Create professional content for your career brand',
      savings: 'Save thousands on professional headshot sessions'
    }
  },
  {
    path: '/streetwear-virtual-try-on',
    title: 'Streetwear Virtual Try-On | Lovit',
    hook: 'Urban Style for Street Fashion',
    description: 'Express your urban style with streetwear virtual try-on. Try on trendy street fashion and see how urban looks complement your personal style.',
    keywords: ['streetwear', 'urban fashion', 'street style', 'casual fashion', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on streetwear and urban fashion styles',
      headshots: 'Generate edgy photos for your street style',
      socialMedia: 'Create urban content for your street fashion brand',
      savings: 'Save money by avoiding expensive streetwear purchases'
    }
  },
  {
    path: '/cute-dresses-virtual-try-on',
    title: 'Cute Dresses Virtual Try-On | Lovit',
    hook: 'Adorable Dresses for Every Occasion',
    description: 'Find your perfect cute dress with AI-powered virtual try-on. Try on adorable dresses and see how they look on you before making your purchase.',
    keywords: ['cute dresses', 'dress fashion', 'feminine style', 'dress shopping', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on cute dresses and feminine fashion styles',
      headshots: 'Generate adorable photos for your cute style',
      socialMedia: 'Create sweet content for your feminine fashion brand',
      savings: 'Save money by avoiding dress purchases that don\'t fit'
    }
  },
  {
    path: '/budget-shopping-virtual-try-on',
    title: 'Budget Shopping Virtual Try-On | Lovit',
    hook: 'Smart Shopping for Every Budget',
    description: 'Shop smarter with budget-friendly virtual try-on. See how affordable fashion looks on you before buying and make the most of your shopping budget.',
    keywords: ['budget shopping', 'affordable fashion', 'smart shopping', 'budget friendly', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on budget-friendly outfits before making purchases',
      headshots: 'Generate affordable photos for your budget style',
      socialMedia: 'Create budget-friendly content for your fashion posts',
      savings: 'Save money by avoiding expensive fashion mistakes'
    }
  },
  {
    path: '/future-of-online-shopping',
    title: 'Future of Online Shopping | Lovit',
    hook: 'Experience the Future of Fashion Shopping',
    description: 'Discover how AI technology is revolutionizing online shopping. Learn about virtual try-on, AI-powered styling, and the future of fashion retail.',
    keywords: ['future of shopping', 'online shopping', 'fashion technology', 'AI retail', 'virtual shopping'],
    priority: 0.8,
    features: {
      tryOn: 'Try on the future of fashion shopping technology',
      headshots: 'Generate photos using cutting-edge AI technology',
      socialMedia: 'Create futuristic content for your tech-forward brand',
      savings: 'Save money by embracing the future of shopping'
    }
  },
  {
    path: '/workout-clothes-virtual-try-on',
    title: 'Workout Clothes Virtual Try-On | Lovit',
    hook: 'Activewear for Your Fitness Journey',
    description: 'Find the perfect workout clothes with virtual try-on. See how activewear looks on your body type and choose the best fitness fashion for your routine.',
    keywords: ['workout clothes', 'activewear', 'fitness fashion', 'gym clothes', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on workout clothes and activewear styles',
      headshots: 'Generate fitness photos for your workout journey',
      socialMedia: 'Create fitness content for your active lifestyle',
      savings: 'Save money by avoiding expensive activewear purchases'
    }
  },
  {
    path: '/business-casual-virtual-try-on',
    title: 'Business Casual Virtual Try-On | Lovit',
    hook: 'Professional Yet Comfortable Office Style',
    description: 'Master business casual dressing with AI-powered virtual try-on. Try on professional yet comfortable outfits perfect for modern office environments.',
    keywords: ['business casual', 'office fashion', 'professional style', 'work fashion', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on business casual outfits and office wear',
      headshots: 'Generate professional photos for your career',
      socialMedia: 'Create office-appropriate content for your work brand',
      savings: 'Save money by avoiding expensive work wardrobe purchases'
    }
  },
  {
    path: '/date-night-outfits',
    title: 'Date Night Outfits Virtual Try-On | Lovit',
    hook: 'Romantic Looks for Special Evenings',
    description: 'Create unforgettable date night looks with virtual try-on. Try on romantic outfits and find the perfect ensemble for your special evening.',
    keywords: ['date night outfits', 'romantic fashion', 'evening wear', 'date fashion', 'virtual styling'],
    priority: 0.8,
    features: {
      tryOn: 'Try on date night dresses and romantic outfits',
      headshots: 'Generate romantic photos for your special evenings',
      socialMedia: 'Create date night content for your romantic memories',
      savings: 'Save money by avoiding expensive date night outfit purchases'
    }
  },
  {
    path: '/travel-outfits-virtual-try-on',
    title: 'Travel Outfits Virtual Try-On | Lovit',
    hook: 'Adventure-Ready Fashion for Travelers',
    description: 'Pack smart with travel outfit virtual try-on. See how travel-friendly fashion looks on you and plan your perfect travel wardrobe.',
    keywords: ['travel outfits', 'travel fashion', 'vacation style', 'travel wardrobe', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on travel outfits and vacation fashion styles',
      headshots: 'Generate travel photos for your adventure memories',
      socialMedia: 'Create travel content for your wanderlust brand',
      savings: 'Save money by avoiding expensive travel wardrobe purchases'
    }
  },
  {
    path: '/beach-vacation-outfits',
    title: 'Beach Vacation Outfits Virtual Try-On | Lovit',
    hook: 'Beach-Ready Style for Your Getaway',
    description: 'Get beach-ready with vacation outfit virtual try-on. Try on swimsuits, cover-ups, and beach fashion perfect for your tropical getaway.',
    keywords: ['beach outfits', 'vacation fashion', 'swimwear', 'beach style', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on beach vacation outfits and swimwear styles',
      headshots: 'Generate beach photos for your vacation memories',
      socialMedia: 'Create beach vibes content for your vacation posts',
      savings: 'Save money by avoiding expensive beach vacation outfits'
    }
  },
  {
    path: '/cozy-loungewear-virtual-try-on',
    title: 'Cozy Loungewear Virtual Try-On | Lovit',
    hook: 'Comfortable Style for Relaxation',
    description: 'Stay comfortable and stylish with loungewear virtual try-on. Try on cozy outfits perfect for relaxing at home or casual outings.',
    keywords: ['loungewear', 'comfortable fashion', 'casual style', 'home fashion', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on cozy loungewear and comfortable home outfits',
      headshots: 'Generate relaxed photos for your comfortable style',
      socialMedia: 'Create cozy content for your relaxed lifestyle',
      savings: 'Save money by avoiding expensive loungewear purchases'
    }
  },
  {
    path: '/instagram-fashion-content',
    title: 'Instagram Fashion Content | Lovit',
    hook: 'Instagram-Worthy Fashion Content Creation',
    description: 'Create stunning Instagram fashion content with AI-powered virtual try-on. Generate Instagram-worthy photos and try on trendy outfits perfect for your Instagram feed.',
    keywords: ['Instagram fashion', 'Instagram content', 'fashion influencer', 'Instagram photos', 'virtual try-on'],
    priority: 0.9,
    features: {
      tryOn: 'Try on Instagram-worthy outfits and trendy fashion',
      headshots: 'Generate Instagram-perfect photos for your feed',
      socialMedia: 'Create consistent Instagram content that grows your following',
      savings: 'Save thousands on professional Instagram content creation'
    }
  },
  {
    path: '/facebook-fashion-content',
    title: 'Facebook Fashion Content | Lovit',
    hook: 'Facebook-Ready Fashion Content Creation',
    description: 'Create engaging Facebook fashion content with AI technology. Generate professional photos and try on outfits perfect for Facebook posts and business pages.',
    keywords: ['Facebook fashion', 'Facebook content', 'business fashion', 'Facebook photos', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Facebook-appropriate outfits and business fashion',
      headshots: 'Generate professional photos for your Facebook posts',
      socialMedia: 'Create engaging Facebook content for your audience',
      savings: 'Save money on professional Facebook content creation'
    }
  },
  {
    path: '/tiktok-fashion-content',
    title: 'TikTok Fashion Content | Lovit',
    hook: 'TikTok-Ready Fashion Content Creation',
    description: 'Create viral TikTok fashion content with AI-powered virtual try-on. Generate trendy photos and try on outfits perfect for TikTok videos and fashion trends.',
    keywords: ['TikTok fashion', 'TikTok content', 'viral fashion', 'TikTok trends', 'virtual try-on'],
    priority: 0.9,
    features: {
      tryOn: 'Try on TikTok-trending outfits and viral fashion styles',
      headshots: 'Generate TikTok-worthy photos for your videos',
      socialMedia: 'Create viral TikTok content that trends on the platform',
      savings: 'Save money on expensive TikTok fashion content creation'
    }
  },
  {
    path: '/youtube-fashion-content',
    title: 'YouTube Fashion Content | Lovit',
    hook: 'YouTube-Ready Fashion Content Creation',
    description: 'Create professional YouTube fashion content with AI technology. Generate high-quality photos and try on outfits perfect for YouTube videos and fashion channels.',
    keywords: ['YouTube fashion', 'YouTube content', 'fashion videos', 'YouTube thumbnails', 'virtual try-on'],
    priority: 0.8,
    features: {
      tryOn: 'Try on YouTube-worthy outfits and professional fashion',
      headshots: 'Generate high-quality photos for your YouTube videos',
      socialMedia: 'Create professional YouTube content for your channel',
      savings: 'Save thousands on professional YouTube content production'
    }
  }
];

export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return routeConfigs.find(config => config.path === path);
};

export const getDefaultRouteConfig = (): RouteConfig => {
  return routeConfigs[0]; // Return the home page config as default
}; 