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
  },
  // Popular Brand Routes
  {
    path: '/adidas-virtual-try-on',
    title: 'Adidas Virtual Try-On | Lovit',
    hook: 'Sportswear Excellence with Virtual Try-On',
    description: 'Try on Adidas sportswear and athletic wear virtually. See how Adidas clothing looks on you before making your purchase with AI-powered virtual try-on technology.',
    keywords: ['adidas', 'sportswear', 'athletic wear', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Experience Adidas sportswear and athletic clothing virtually',
      headshots: 'Capture dynamic athletic photos in Adidas sportswear',
      socialMedia: 'Build your sporty brand with Adidas fashion content',
      savings: 'Avoid costly returns by testing Adidas styles first'
    }
  },
  {
    path: '/nike-virtual-try-on',
    title: 'Nike Virtual Try-On | Lovit',
    hook: 'Just Do It with Virtual Try-On Technology',
    description: 'Experience Nike sportswear with AI-powered virtual try-on. See how Nike clothing and athletic wear looks on your body type before purchasing.',
    keywords: ['nike', 'sportswear', 'athletic wear', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Visualize Nike sportswear and athletic clothing on your body',
      headshots: 'Showcase your athletic prowess in Nike sportswear',
      socialMedia: 'Elevate your fitness content with Nike fashion',
      savings: 'Make confident purchases by previewing Nike styles'
    }
  },
  {
    path: '/gucci-virtual-try-on',
    title: 'Gucci Virtual Try-On | Lovit',
    hook: 'Luxury Fashion with AI Technology',
    description: 'Experience Gucci luxury fashion with virtual try-on. See how Gucci clothing and accessories look on you before making your luxury purchase.',
    keywords: ['gucci', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Explore Gucci luxury clothing and accessories on your frame',
      headshots: 'Portray sophistication in Gucci luxury fashion',
      socialMedia: 'Cultivate your luxury aesthetic with Gucci style',
      savings: 'Make confident luxury purchases by previewing Gucci pieces first'
    }
  },
  {
    path: '/prada-virtual-try-on',
    title: 'Prada Virtual Try-On | Lovit',
    hook: 'Sophisticated Luxury with Virtual Try-On',
    description: 'Try on Prada luxury fashion virtually. See how Prada clothing and accessories complement your style with AI-powered virtual try-on technology.',
    keywords: ['prada', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Discover how Prada luxury clothing fits your silhouette',
      headshots: 'Exhibit refined elegance in Prada fashion',
      socialMedia: 'Develop your sophisticated brand with Prada style',
      savings: 'Choose luxury pieces confidently by testing Prada first'
    }
  },
  {
    path: '/skims-virtual-try-on',
    title: 'Skims Virtual Try-On | Lovit',
    hook: 'Shapewear and Loungewear with Virtual Try-On',
    description: 'Try on Skims shapewear and loungewear virtually. See how Skims clothing fits your body type with AI-powered virtual try-on technology.',
    keywords: ['skims', 'shapewear', 'loungewear', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'See how Skims shapewear and loungewear enhances your figure',
      headshots: 'Highlight your best features in Skims clothing',
      socialMedia: 'Share your comfort journey with Skims style',
      savings: 'Eliminate guesswork by previewing Skims fits'
    }
  },
  {
    path: '/alice-olivia-virtual-try-on',
    title: 'Alice + Olivia Virtual Try-On | Lovit',
    hook: 'Feminine Fashion with Virtual Try-On',
    description: 'Try on Alice + Olivia feminine fashion virtually. See how Alice + Olivia clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['alice olivia', 'feminine fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Alice + Olivia feminine clothing virtually',
      headshots: 'Generate feminine photos in Alice + Olivia fashion',
      socialMedia: 'Create elegant content with Alice + Olivia style',
      savings: 'Save money by trying on Alice + Olivia clothes before buying'
    }
  },
  {
    path: '/vuori-virtual-try-on',
    title: 'Vuori Virtual Try-On | Lovit',
    hook: 'Performance Apparel with Virtual Try-On',
    description: 'Try on Vuori performance apparel virtually. See how Vuori activewear fits your body type with AI-powered virtual try-on technology.',
    keywords: ['vuori', 'performance apparel', 'activewear', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Vuori performance apparel and activewear virtually',
      headshots: 'Generate athletic photos in Vuori clothing',
      socialMedia: 'Create active content with Vuori style',
      savings: 'Save money by trying on Vuori clothes before buying'
    }
  },
  {
    path: '/lululemon-virtual-try-on',
    title: 'Lululemon Virtual Try-On | Lovit',
    hook: 'Athleisure Excellence with Virtual Try-On',
    description: 'Try on Lululemon athleisure and activewear virtually. See how Lululemon clothing fits your body type with AI-powered virtual try-on technology.',
    keywords: ['lululemon', 'athleisure', 'activewear', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Test Lululemon athleisure and activewear on your body',
      headshots: 'Demonstrate your fitness journey in Lululemon clothing',
      socialMedia: 'Inspire others with your Lululemon lifestyle',
      savings: 'Choose the perfect fit by testing Lululemon first'
    }
  },
  {
    path: '/louis-vuitton-virtual-try-on',
    title: 'Louis Vuitton Virtual Try-On | Lovit',
    hook: 'Luxury Fashion with Virtual Try-On',
    description: 'Try on Louis Vuitton luxury fashion virtually. See how Louis Vuitton clothing and accessories look on you with AI-powered virtual try-on technology.',
    keywords: ['louis vuitton', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Preview Louis Vuitton luxury clothing on your frame',
      headshots: 'Embody luxury sophistication in Louis Vuitton fashion',
      socialMedia: 'Establish your luxury presence with Louis Vuitton style',
      savings: 'Ensure perfect luxury fits by testing Louis Vuitton first'
    }
  },
  {
    path: '/chanel-virtual-try-on',
    title: 'Chanel Virtual Try-On | Lovit',
    hook: 'Timeless Elegance with Virtual Try-On',
    description: 'Try on Chanel luxury fashion virtually. See how Chanel clothing and accessories complement your style with AI-powered virtual try-on technology.',
    keywords: ['chanel', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Experience Chanel luxury clothing on your silhouette',
      headshots: 'Radiate timeless elegance in Chanel fashion',
      socialMedia: 'Craft your legacy with Chanel style content',
      savings: 'Shop luxury confidently by previewing Chanel pieces'
    }
  },
  {
    path: '/hermes-virtual-try-on',
    title: 'Hermès Virtual Try-On | Lovit',
    hook: 'Ultimate Luxury with Virtual Try-On',
    description: 'Try on Hermès luxury fashion virtually. See how Hermès clothing and accessories look on you with AI-powered virtual try-on technology.',
    keywords: ['hermes', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Visualize Hermès luxury clothing on your frame',
      headshots: 'Personify ultimate luxury in Hermès fashion',
      socialMedia: 'Define your luxury identity with Hermès style',
      savings: 'Shop luxury wisely by testing Hermès first'
    }
  },
  {
    path: '/balenciaga-virtual-try-on',
    title: 'Balenciaga Virtual Try-On | Lovit',
    hook: 'Avant-Garde Fashion with Virtual Try-On',
    description: 'Try on Balenciaga avant-garde fashion virtually. See how Balenciaga clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['balenciaga', 'avant-garde fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Balenciaga avant-garde clothing virtually',
      headshots: 'Generate edgy photos in Balenciaga fashion',
      socialMedia: 'Create bold content with Balenciaga style',
      savings: 'Save money by trying on Balenciaga clothes before buying'
    }
  },
  {
    path: '/yves-saint-laurent-virtual-try-on',
    title: 'Yves Saint Laurent Virtual Try-On | Lovit',
    hook: 'Sophisticated Elegance with Virtual Try-On',
    description: 'Try on Yves Saint Laurent luxury fashion virtually. See how YSL clothing and accessories complement your style with AI-powered virtual try-on technology.',
    keywords: ['yves saint laurent', 'ysl', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Yves Saint Laurent luxury clothing and accessories virtually',
      headshots: 'Generate sophisticated photos in YSL fashion',
      socialMedia: 'Create elegant content with YSL style',
      savings: 'Save money by trying on YSL clothes before buying'
    }
  },
  {
    path: '/dior-virtual-try-on',
    title: 'Dior Virtual Try-On | Lovit',
    hook: 'Parisian Elegance with Virtual Try-On',
    description: 'Try on Dior luxury fashion virtually. See how Dior clothing and accessories look on you with AI-powered virtual try-on technology.',
    keywords: ['dior', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Discover Dior luxury clothing on your silhouette',
      headshots: 'Channel Parisian elegance in Dior fashion',
      socialMedia: 'Build your sophisticated brand with Dior style',
      savings: 'Ensure perfect fit by previewing Dior pieces'
    }
  },
  {
    path: '/fendi-virtual-try-on',
    title: 'Fendi Virtual Try-On | Lovit',
    hook: 'Italian Luxury with Virtual Try-On',
    description: 'Try on Fendi luxury fashion virtually. See how Fendi clothing and accessories complement your style with AI-powered virtual try-on technology.',
    keywords: ['fendi', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Fendi luxury clothing and accessories virtually',
      headshots: 'Generate luxury photos in Fendi fashion',
      socialMedia: 'Create high-end content with Fendi style',
      savings: 'Save money by trying on Fendi clothes before buying'
    }
  },
  {
    path: '/bottega-veneta-virtual-try-on',
    title: 'Bottega Veneta Virtual Try-On | Lovit',
    hook: 'Quiet Luxury with Virtual Try-On',
    description: 'Try on Bottega Veneta luxury fashion virtually. See how Bottega Veneta clothing and accessories look on you with AI-powered virtual try-on technology.',
    keywords: ['bottega veneta', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Bottega Veneta luxury clothing and accessories virtually',
      headshots: 'Generate sophisticated photos in Bottega Veneta fashion',
      socialMedia: 'Create elegant content with Bottega Veneta style',
      savings: 'Save money by trying on Bottega Veneta clothes before buying'
    }
  },
  {
    path: '/saint-laurent-virtual-try-on',
    title: 'Saint Laurent Virtual Try-On | Lovit',
    hook: 'Parisian Chic with Virtual Try-On',
    description: 'Try on Saint Laurent luxury fashion virtually. See how Saint Laurent clothing and accessories complement your style with AI-powered virtual try-on technology.',
    keywords: ['saint laurent', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Saint Laurent luxury clothing and accessories virtually',
      headshots: 'Generate chic photos in Saint Laurent fashion',
      socialMedia: 'Create sophisticated content with Saint Laurent style',
      savings: 'Save money by trying on Saint Laurent clothes before buying'
    }
  },
  {
    path: '/givenchy-virtual-try-on',
    title: 'Givenchy Virtual Try-On | Lovit',
    hook: 'French Elegance with Virtual Try-On',
    description: 'Try on Givenchy luxury fashion virtually. See how Givenchy clothing and accessories look on you with AI-powered virtual try-on technology.',
    keywords: ['givenchy', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Givenchy luxury clothing and accessories virtually',
      headshots: 'Generate elegant photos in Givenchy fashion',
      socialMedia: 'Create sophisticated content with Givenchy style',
      savings: 'Save money by trying on Givenchy clothes before buying'
    }
  },
  {
    path: '/valentino-virtual-try-on',
    title: 'Valentino Virtual Try-On | Lovit',
    hook: 'Italian Romance with Virtual Try-On',
    description: 'Try on Valentino luxury fashion virtually. See how Valentino clothing and accessories complement your style with AI-powered virtual try-on technology.',
    keywords: ['valentino', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Valentino luxury clothing and accessories virtually',
      headshots: 'Generate romantic photos in Valentino fashion',
      socialMedia: 'Create elegant content with Valentino style',
      savings: 'Save money by trying on Valentino clothes before buying'
    }
  },
  {
    path: '/versace-virtual-try-on',
    title: 'Versace Virtual Try-On | Lovit',
    hook: 'Bold Italian Style with Virtual Try-On',
    description: 'Try on Versace luxury fashion virtually. See how Versace clothing and accessories look on you with AI-powered virtual try-on technology.',
    keywords: ['versace', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Versace luxury clothing and accessories virtually',
      headshots: 'Generate bold photos in Versace fashion',
      socialMedia: 'Create dramatic content with Versace style',
      savings: 'Save money by trying on Versace clothes before buying'
    }
  },
  {
    path: '/dolce-gabbana-virtual-try-on',
    title: 'Dolce & Gabbana Virtual Try-On | Lovit',
    hook: 'Sicilian Glamour with Virtual Try-On',
    description: 'Try on Dolce & Gabbana luxury fashion virtually. See how Dolce & Gabbana clothing and accessories complement your style with AI-powered virtual try-on technology.',
    keywords: ['dolce gabbana', 'luxury fashion', 'designer clothes', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Dolce & Gabbana luxury clothing and accessories virtually',
      headshots: 'Generate glamorous photos in Dolce & Gabbana fashion',
      socialMedia: 'Create bold content with Dolce & Gabbana style',
      savings: 'Save money by trying on Dolce & Gabbana clothes before buying'
    }
  },
  {
    path: '/michael-kors-virtual-try-on',
    title: 'Michael Kors Virtual Try-On | Lovit',
    hook: 'Jet Set Style with Virtual Try-On',
    description: 'Try on Michael Kors fashion virtually. See how Michael Kors clothing and accessories look on you with AI-powered virtual try-on technology.',
    keywords: ['michael kors', 'designer fashion', 'accessible luxury', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Michael Kors clothing and accessories virtually',
      headshots: 'Generate sophisticated photos in Michael Kors fashion',
      socialMedia: 'Create elegant content with Michael Kors style',
      savings: 'Save money by trying on Michael Kors clothes before buying'
    }
  },
  {
    path: '/kate-spade-virtual-try-on',
    title: 'Kate Spade Virtual Try-On | Lovit',
    hook: 'Playful Elegance with Virtual Try-On',
    description: 'Try on Kate Spade fashion virtually. See how Kate Spade clothing and accessories complement your style with AI-powered virtual try-on technology.',
    keywords: ['kate spade', 'designer fashion', 'playful style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Kate Spade clothing and accessories virtually',
      headshots: 'Generate playful photos in Kate Spade fashion',
      socialMedia: 'Create cheerful content with Kate Spade style',
      savings: 'Save money by trying on Kate Spade clothes before buying'
    }
  },
  {
    path: '/coach-virtual-try-on',
    title: 'Coach Virtual Try-On | Lovit',
    hook: 'American Heritage with Virtual Try-On',
    description: 'Try on Coach fashion virtually. See how Coach clothing and accessories look on you with AI-powered virtual try-on technology.',
    keywords: ['coach', 'designer fashion', 'american heritage', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Coach clothing and accessories virtually',
      headshots: 'Generate classic photos in Coach fashion',
      socialMedia: 'Create timeless content with Coach style',
      savings: 'Save money by trying on Coach clothes before buying'
    }
  },
  {
    path: '/tory-burch-virtual-try-on',
    title: 'Tory Burch Virtual Try-On | Lovit',
    hook: 'Preppy Chic with Virtual Try-On',
    description: 'Try on Tory Burch fashion virtually. See how Tory Burch clothing and accessories complement your style with AI-powered virtual try-on technology.',
    keywords: ['tory burch', 'designer fashion', 'preppy style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Tory Burch clothing and accessories virtually',
      headshots: 'Generate preppy photos in Tory Burch fashion',
      socialMedia: 'Create sophisticated content with Tory Burch style',
      savings: 'Save money by trying on Tory Burch clothes before buying'
    }
  },
  {
    path: '/reformation-virtual-try-on',
    title: 'Reformation Virtual Try-On | Lovit',
    hook: 'Sustainable Fashion with Virtual Try-On',
    description: 'Try on Reformation sustainable fashion virtually. See how Reformation clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['reformation', 'sustainable fashion', 'eco-friendly', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Reformation sustainable clothing virtually',
      headshots: 'Generate eco-friendly photos in Reformation fashion',
      socialMedia: 'Create sustainable content with Reformation style',
      savings: 'Save money by trying on Reformation clothes before buying'
    }
  },
  {
    path: '/anthropologie-virtual-try-on',
    title: 'Anthropologie Virtual Try-On | Lovit',
    hook: 'Bohemian Chic with Virtual Try-On',
    description: 'Try on Anthropologie bohemian fashion virtually. See how Anthropologie clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['anthropologie', 'bohemian fashion', 'boho chic', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Anthropologie bohemian clothing virtually',
      headshots: 'Generate boho photos in Anthropologie fashion',
      socialMedia: 'Create bohemian content with Anthropologie style',
      savings: 'Save money by trying on Anthropologie clothes before buying'
    }
  },
  {
    path: '/free-people-virtual-try-on',
    title: 'Free People Virtual Try-On | Lovit',
    hook: 'Free-Spirited Fashion with Virtual Try-On',
    description: 'Try on Free People bohemian fashion virtually. See how Free People clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['free people', 'bohemian fashion', 'free-spirited', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Free People bohemian clothing virtually',
      headshots: 'Generate free-spirited photos in Free People fashion',
      socialMedia: 'Create bohemian content with Free People style',
      savings: 'Save money by trying on Free People clothes before buying'
    }
  },
  {
    path: '/urban-outfitters-virtual-try-on',
    title: 'Urban Outfitters Virtual Try-On | Lovit',
    hook: 'Urban Style with Virtual Try-On',
    description: 'Try on Urban Outfitters trendy fashion virtually. See how Urban Outfitters clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['urban outfitters', 'trendy fashion', 'urban style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Urban Outfitters trendy clothing virtually',
      headshots: 'Generate urban photos in Urban Outfitters fashion',
      socialMedia: 'Create trendy content with Urban Outfitters style',
      savings: 'Save money by trying on Urban Outfitters clothes before buying'
    }
  },
  {
    path: '/madewell-virtual-try-on',
    title: 'Madewell Virtual Try-On | Lovit',
    hook: 'Effortless Style with Virtual Try-On',
    description: 'Try on Madewell casual fashion virtually. See how Madewell clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['madewell', 'casual fashion', 'effortless style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Madewell casual clothing virtually',
      headshots: 'Generate effortless photos in Madewell fashion',
      socialMedia: 'Create casual content with Madewell style',
      savings: 'Save money by trying on Madewell clothes before buying'
    }
  },
  {
    path: '/levis-virtual-try-on',
    title: 'Levi\'s Virtual Try-On | Lovit',
    hook: 'Denim Heritage with Virtual Try-On',
    description: 'Try on Levi\'s denim and casual fashion virtually. See how Levi\'s clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['levis', 'denim', 'casual fashion', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Levi\'s denim and casual clothing virtually',
      headshots: 'Generate casual photos in Levi\'s fashion',
      socialMedia: 'Create denim content with Levi\'s style',
      savings: 'Save money by trying on Levi\'s clothes before buying'
    }
  },
  {
    path: '/good-american-virtual-try-on',
    title: 'Good American Virtual Try-On | Lovit',
    hook: 'Inclusive Denim with Virtual Try-On',
    description: 'Try on Good American inclusive denim virtually. See how Good American clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['good american', 'inclusive denim', 'body positive', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Good American inclusive denim virtually',
      headshots: 'Generate inclusive photos in Good American fashion',
      socialMedia: 'Create body-positive content with Good American style',
      savings: 'Save money by trying on Good American clothes before buying'
    }
  },
  {
    path: '/citizens-of-humanity-virtual-try-on',
    title: 'Citizens of Humanity Virtual Try-On | Lovit',
    hook: 'Premium Denim with Virtual Try-On',
    description: 'Try on Citizens of Humanity premium denim virtually. See how Citizens of Humanity clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['citizens of humanity', 'premium denim', 'designer jeans', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Citizens of Humanity premium denim virtually',
      headshots: 'Generate premium photos in Citizens of Humanity fashion',
      socialMedia: 'Create denim content with Citizens of Humanity style',
      savings: 'Save money by trying on Citizens of Humanity clothes before buying'
    }
  },
  {
    path: '/farm-rio-virtual-try-on',
    title: 'Farm Rio Virtual Try-On | Lovit',
    hook: 'Brazilian Vibrancy with Virtual Try-On',
    description: 'Try on Farm Rio vibrant fashion virtually. See how Farm Rio clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['farm rio', 'brazilian fashion', 'vibrant style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Farm Rio vibrant clothing virtually',
      headshots: 'Generate vibrant photos in Farm Rio fashion',
      socialMedia: 'Create colorful content with Farm Rio style',
      savings: 'Save money by trying on Farm Rio clothes before buying'
    }
  },
  {
    path: '/eloquii-virtual-try-on',
    title: 'Eloquii Virtual Try-On | Lovit',
    hook: 'Plus Size Fashion with Virtual Try-On',
    description: 'Try on Eloquii plus-size fashion virtually. See how Eloquii clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['eloquii', 'plus size fashion', 'inclusive fashion', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Eloquii plus-size clothing virtually',
      headshots: 'Generate inclusive photos in Eloquii fashion',
      socialMedia: 'Create plus-size content with Eloquii style',
      savings: 'Save money by trying on Eloquii clothes before buying'
    }
  },
  {
    path: '/favoritedaughter-virtual-try-on',
    title: 'Favorite Daughter Virtual Try-On | Lovit',
    hook: 'Feminine Fashion with Virtual Try-On',
    description: 'Try on Favorite Daughter feminine fashion virtually. See how Favorite Daughter clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['favoritedaughter', 'feminine fashion', 'romantic style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Favorite Daughter feminine clothing virtually',
      headshots: 'Generate feminine photos in Favorite Daughter fashion',
      socialMedia: 'Create romantic content with Favorite Daughter style',
      savings: 'Save money by trying on Favorite Daughter clothes before buying'
    }
  },
  {
    path: '/rollas-virtual-try-on',
    title: 'Rolla\'s Virtual Try-On | Lovit',
    hook: 'Australian Fashion with Virtual Try-On',
    description: 'Try on Rolla\'s Australian fashion virtually. See how Rolla\'s clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['rollas', 'australian fashion', 'casual style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Rolla\'s Australian clothing virtually',
      headshots: 'Generate casual photos in Rolla\'s fashion',
      socialMedia: 'Create Australian content with Rolla\'s style',
      savings: 'Save money by trying on Rolla\'s clothes before buying'
    }
  },
  {
    path: '/selkie-virtual-try-on',
    title: 'Selkie Virtual Try-On | Lovit',
    hook: 'Whimsical Fashion with Virtual Try-On',
    description: 'Try on Selkie whimsical fashion virtually. See how Selkie clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['selkie', 'whimsical fashion', 'fantasy style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Selkie whimsical clothing virtually',
      headshots: 'Generate whimsical photos in Selkie fashion',
      socialMedia: 'Create fantasy content with Selkie style',
      savings: 'Save money by trying on Selkie clothes before buying'
    }
  },
  {
    path: '/agolde-virtual-try-on',
    title: 'Agolde Virtual Try-On | Lovit',
    hook: 'Premium Denim with Virtual Try-On',
    description: 'Try on Agolde premium denim virtually. See how Agolde clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['agolde', 'premium denim', 'designer jeans', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on Agolde premium denim virtually',
      headshots: 'Generate premium photos in Agolde fashion',
      socialMedia: 'Create denim content with Agolde style',
      savings: 'Save money by trying on Agolde clothes before buying'
    }
  },
  {
    path: '/astr-the-label-virtual-try-on',
    title: 'ASTR the Label Virtual Try-On | Lovit',
    hook: 'Contemporary Fashion with Virtual Try-On',
    description: 'Try on ASTR the Label contemporary fashion virtually. See how ASTR clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['astr the label', 'contemporary fashion', 'modern style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on ASTR the Label contemporary clothing virtually',
      headshots: 'Generate modern photos in ASTR fashion',
      socialMedia: 'Create contemporary content with ASTR style',
      savings: 'Save money by trying on ASTR clothes before buying'
    }
  },
  // Rental Website Routes
  {
    path: '/rent-the-runway-virtual-try-on',
    title: 'Rent the Runway Virtual Try-On | Lovit',
    hook: 'Luxury Rental with Virtual Try-On',
    description: 'Try on Rent the Runway luxury fashion virtually. See how Rent the Runway clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['rent the runway', 'luxury rental', 'designer rental', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Preview Rent the Runway luxury clothing on your frame',
      headshots: 'Showcase luxury rental fashion in stunning photos',
      socialMedia: 'Elevate your rental experience with Rent the Runway style',
      savings: 'Maximize your rental value by testing styles first'
    }
  },
  {
    path: '/fashion-pass-virtual-try-on',
    title: 'Fashion Pass Virtual Try-On | Lovit',
    hook: 'Subscription Fashion with Virtual Try-On',
    description: 'Try on Fashion Pass subscription fashion virtually. See how Fashion Pass clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['fashion pass', 'subscription fashion', 'rental fashion', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Explore Fashion Pass subscription clothing on your body',
      headshots: 'Document your subscription journey with Fashion Pass style',
      socialMedia: 'Share your subscription lifestyle with Fashion Pass content',
      savings: 'Optimize your subscription by previewing styles first'
    }
  },
  {
    path: '/nuuly-virtual-try-on',
    title: 'Nuuly Virtual Try-On | Lovit',
    hook: 'Sustainable Rental with Virtual Try-On',
    description: 'Try on Nuuly sustainable rental fashion virtually. See how Nuuly clothing looks on you with AI-powered virtual try-on technology.',
    keywords: ['nuuly', 'sustainable rental', 'eco-friendly fashion', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Experience Nuuly sustainable rental clothing on your frame',
      headshots: 'Capture your sustainable fashion journey with Nuuly style',
      socialMedia: 'Inspire eco-conscious living with Nuuly content',
      savings: 'Support sustainability by testing Nuuly styles first'
    }
  },
  {
    path: '/dress-k-pop-star',
    title: 'Dress as K-Pop Star Virtual Try-On | Lovit',
    hook: 'Channel Your Inner K-Pop Idol',
    description: 'Transform into your favorite K-Pop star with AI-powered virtual try-on. Try on K-Pop fashion styles and create stunning idol-worthy photos.',
    keywords: ['k-pop fashion', 'k-pop star', 'korean fashion', 'idol style', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on K-Pop star outfits and idol fashion styles',
      headshots: 'Generate K-Pop idol-worthy photos and performances',
      socialMedia: 'Create K-Pop inspired content for social media',
      savings: 'Save money by avoiding expensive K-Pop fashion purchases'
    }
  },
  {
    path: '/dress-anime-k-pop',
    title: 'Anime K-Pop Fashion Virtual Try-On | Lovit',
    hook: 'Anime Meets K-Pop Style',
    description: 'Combine anime aesthetics with K-Pop fashion using AI virtual try-on. Create unique anime-inspired K-Pop looks and generate stunning crossover content.',
    keywords: ['anime k-pop', 'anime fashion', 'k-pop anime', 'japanese korean fashion', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on anime-inspired K-Pop outfits and crossover styles',
      headshots: 'Generate anime K-Pop fusion photos and character looks',
      socialMedia: 'Create unique anime K-Pop content for social media',
      savings: 'Save money by avoiding expensive anime K-Pop fashion'
    }
  },
  {
    path: '/indian-wedding-outfits',
    title: 'Indian Wedding Outfits Virtual Try-On | Lovit',
    hook: 'Find the Perfect Outfit for Any Indian Wedding Event',
    description: 'Attending an Indian wedding? Instantly try on lehengas, sarees, sherwanis, and more with AI-powered virtual try-on. Discover the perfect look for every ceremony—whether you’re a guest, family member, or part of the wedding party.',
    keywords: ['indian wedding', 'wedding guest outfits', 'lehenga', 'saree', 'sherwani', 'indian fashion', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Try on Indian wedding guest outfits, lehengas, sarees, sherwanis, and more for any event',
      headshots: 'Generate stunning photos in traditional and contemporary Indian styles',
      socialMedia: 'Create vibrant content for any Indian wedding celebration',
      savings: 'Save money by previewing your Indian wedding looks before you buy or rent'
    }
  },
  {
    path: '/cocktail-hour-outfits',
    title: 'Cocktail Hour Outfits Virtual Try-On | Lovit',
    hook: 'Sophisticated Style for Evening Elegance',
    description: 'Dress to impress for cocktail hour with AI-powered virtual try-on. Try on elegant cocktail dresses and sophisticated evening wear perfect for special occasions.',
    keywords: ['cocktail hour', 'cocktail dresses', 'evening wear', 'sophisticated fashion', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on cocktail hour dresses and sophisticated evening outfits',
      headshots: 'Generate elegant photos perfect for cocktail hour events',
      socialMedia: 'Create sophisticated content for your evening events',
      savings: 'Save money by avoiding expensive cocktail dress purchases'
    }
  },
  {
    path: '/bridesmaid-dresses',
    title: 'Bridesmaid Dresses Virtual Try-On | Lovit',
    hook: 'Find the Perfect Bridesmaid Look Instantly',
    description: 'Try on a variety of bridesmaid dresses virtually and discover the perfect style and color for your wedding party. Make confident choices with AI-powered try-on technology.',
    keywords: ['bridesmaid dresses', 'wedding party', 'virtual try-on', 'AI fashion', 'wedding planning'],
    priority: 0.9,
    features: {
      tryOn: 'Try on bridesmaid dresses in different styles and colors',
      headshots: 'Generate beautiful group photos for your bridal party',
      socialMedia: 'Create memorable content for your wedding journey',
      savings: 'Save money by previewing bridesmaid looks before buying'
    }
  },
  {
    path: '/dresses-for-wedding-near-me',
    title: 'Dresses for Wedding Near Me | Lovit',
    hook: 'Find Local Wedding Dress Styles Instantly',
    description: 'Explore and try on wedding dresses available near you with AI-powered virtual try-on. Discover local styles and make shopping easier than ever.',
    keywords: ['wedding dresses', 'near me', 'local wedding', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on wedding dresses from local boutiques virtually',
      headshots: 'Generate bridal photos in local styles',
      socialMedia: 'Share your local wedding dress journey online',
      savings: 'Save time and money by previewing local options first'
    }
  },
  {
    path: '/bridal-styles',
    title: 'Bridal Styles Virtual Try-On | Lovit',
    hook: 'Explore Every Bridal Style Instantly',
    description: 'Discover and try on a wide range of bridal styles virtually. From classic to modern, find the perfect look for your big day with AI-powered technology.',
    keywords: ['bridal styles', 'wedding fashion', 'virtual try-on', 'AI bridal', 'wedding trends'],
    priority: 0.9,
    features: {
      tryOn: 'Try on classic, modern, boho, and more bridal styles',
      headshots: 'Generate stunning bridal portraits in any style',
      socialMedia: 'Create content showcasing your bridal style journey',
      savings: 'Save money by previewing styles before committing'
    }
  },
  {
    path: '/what-to-wear-wedding-dress-shopping',
    title: 'What to Wear Wedding Dress Shopping | Lovit',
    hook: 'Dress Smart for Your Bridal Appointment',
    description: 'Get tips and virtually try on outfits perfect for wedding dress shopping. See what to wear for comfort and style during your bridal appointment.',
    keywords: ['wedding dress shopping', 'what to wear', 'bridal appointment', 'virtual try-on', 'AI fashion'],
    priority: 0.7,
    features: {
      tryOn: 'Try on comfortable and stylish outfits for dress shopping',
      headshots: 'Generate photos to inspire your shopping day',
      socialMedia: 'Share your wedding dress shopping experience',
      savings: 'Avoid outfit regrets by previewing your look first'
    }
  },
  {
    path: '/what-to-wear-bridal-dress-shopping',
    title: 'What to Wear Bridal Dress Shopping | Lovit',
    hook: 'Look and Feel Your Best at Bridal Appointments',
    description: 'Virtually try on the best outfits for bridal dress shopping. Discover what to wear for confidence and ease while finding your dream dress.',
    keywords: ['bridal dress shopping', 'what to wear', 'wedding shopping', 'virtual try-on', 'AI fashion'],
    priority: 0.7,
    features: {
      tryOn: 'Try on ideal outfits for bridal dress shopping',
      headshots: 'Generate photos to capture your shopping day',
      socialMedia: 'Create content about your bridal shopping journey',
      savings: 'Save money by choosing the right shopping outfit'
    }
  },
  {
    path: '/formal-wedding-guest-dresses',
    title: 'Formal Wedding Guest Dresses Virtual Try-On | Lovit',
    hook: 'Elegant Looks for Every Formal Wedding',
    description: 'Find and try on formal wedding guest dresses virtually. Discover elegant styles and make a statement at any formal wedding event.',
    keywords: ['formal wedding guest', 'guest dresses', 'virtual try-on', 'AI fashion', 'wedding outfits'],
    priority: 0.8,
    features: {
      tryOn: 'Try on formal dresses for wedding guest occasions',
      headshots: 'Generate elegant photos for your next wedding',
      socialMedia: 'Share your formal wedding guest look online',
      savings: 'Save money by previewing guest dresses before buying'
    }
  },
  {
    path: '/dresses-for-wedding-on-the-beach',
    title: 'Dresses for Wedding on the Beach Virtual Try-On | Lovit',
    hook: 'Beach Wedding Styles for Every Guest',
    description: 'Virtually try on dresses perfect for beach weddings. Find breezy, beautiful styles for your next seaside celebration.',
    keywords: ['beach wedding', 'wedding guest', 'beach dresses', 'virtual try-on', 'AI fashion'],
    priority: 0.8,
    features: {
      tryOn: 'Try on dresses ideal for beach wedding settings',
      headshots: 'Generate stunning beach wedding guest photos',
      socialMedia: 'Create content for your beach wedding experience',
      savings: 'Save money by previewing beach wedding looks first'
    }
  },
  {
    path: '/bridal-dress-online',
    title: 'Bridal Dress Online Virtual Try-On | Lovit',
    hook: 'Shop Bridal Dresses Online with Confidence',
    description: 'Try on bridal dresses online virtually before you buy. Experience the convenience of online shopping with the confidence of seeing your look first.',
    keywords: ['bridal dress online', 'online wedding dress', 'virtual try-on', 'AI bridal', 'wedding shopping'],
    priority: 0.8,
    features: {
      tryOn: 'Try on bridal dresses from online stores virtually',
      headshots: 'Generate bridal portraits in online styles',
      socialMedia: 'Share your online bridal dress shopping journey',
      savings: 'Avoid costly returns by previewing online dresses first'
    }
  },
  {
    path: '/designer-dresses-for-wedding',
    title: 'Designer Dresses for Wedding Virtual Try-On | Lovit',
    hook: 'Luxury Designer Looks for Your Wedding',
    description: 'Virtually try on designer dresses for weddings. Explore luxury styles and find the perfect designer look for your special day.',
    keywords: ['designer dresses', 'wedding fashion', 'luxury wedding', 'virtual try-on', 'AI fashion'],
    priority: 0.9,
    features: {
      tryOn: 'Try on luxury designer dresses for weddings',
      headshots: 'Generate high-fashion wedding photos',
      socialMedia: 'Create luxury wedding content for social media',
      savings: 'Save money by previewing designer looks before buying'
    }
  },
];

export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return routeConfigs.find(config => config.path === path);
};

export const getDefaultRouteConfig = (): RouteConfig => {
  return routeConfigs[0]; // Return the home page config as default
}; 