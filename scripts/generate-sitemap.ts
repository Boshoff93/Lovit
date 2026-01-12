/**
 * Script to generate sitemap.xml from routeConfig
 * Run with: npx ts-node scripts/generate-sitemap.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import route config - we'll inline the arrays since we can't import from src
const genres = [
  'pop', 'rock', 'hip-hop', 'rap', 'jazz', 'classical', 'electronic', 'edm',
  'house', 'techno', 'dubstep', 'drum-and-bass', 'trance', 'ambient', 'chillout',
  'lofi', 'lo-fi-hip-hop', 'rnb', 'r-and-b', 'soul', 'funk', 'disco', 'country',
  'folk', 'bluegrass', 'blues', 'reggae', 'ska', 'latin', 'salsa', 'bachata',
  'reggaeton', 'cumbia', 'bossa-nova', 'flamenco', 'k-pop', 'j-pop', 'c-pop',
  'afrobeats', 'afropop', 'highlife', 'amapiano', 'gqom', 'metal', 'heavy-metal',
  'death-metal', 'black-metal', 'thrash-metal', 'punk', 'punk-rock', 'grunge',
  'alternative', 'indie', 'indie-rock', 'indie-pop', 'shoegaze', 'post-rock',
  'progressive-rock', 'psychedelic', 'garage-rock', 'surf-rock', 'new-wave',
  'synthwave', 'retrowave', 'vaporwave', 'trap', 'drill', 'grime', 'boom-bap',
  'conscious-hip-hop', 'mumble-rap', 'emo-rap', 'gospel', 'christian', 'worship',
  'opera', 'orchestral', 'cinematic', 'soundtrack', 'musical-theater', 'broadway',
  'childrens', 'kids', 'nursery-rhymes', 'lullaby', 'meditation', 'spa',
  'new-age', 'world-music', 'celtic', 'indian-classical', 'bollywood',
  'arabic', 'middle-eastern', 'asian', 'japanese-traditional', 'chinese-traditional',
  'acoustic', 'singer-songwriter', 'ballad', 'power-ballad', 'love-songs',
  'romantic', 'wedding-music', 'party', 'dance', 'club', 'festival',
  'workout', 'fitness', 'gym', 'running', 'yoga', 'pilates',
  'gaming', 'video-game', '8-bit', 'chiptune', 'retro-gaming',
  'podcast-intro', 'jingle', 'commercial', 'advertising', 'corporate',
  'motivational', 'inspirational', 'epic', 'trailer', 'action',
  'horror', 'suspense', 'thriller', 'mystery', 'dramatic', 'emotional',
  'happy', 'upbeat', 'sad', 'melancholic', 'angry', 'aggressive',
  'chill', 'relaxing', 'peaceful', 'calming', 'energetic', 'hype'
];

const languages = [
  'english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'dutch',
  'russian', 'polish', 'ukrainian', 'czech', 'swedish', 'norwegian', 'danish',
  'finnish', 'japanese', 'korean', 'chinese', 'mandarin', 'cantonese',
  'hindi', 'bengali', 'punjabi', 'urdu', 'tamil', 'telugu', 'marathi',
  'arabic', 'hebrew', 'turkish', 'persian', 'farsi', 'thai', 'vietnamese',
  'indonesian', 'malay', 'tagalog', 'filipino', 'swahili', 'yoruba', 'igbo',
  'zulu', 'afrikaans', 'greek', 'hungarian', 'romanian', 'bulgarian',
  'croatian', 'serbian', 'slovenian', 'slovak', 'lithuanian', 'latvian',
  'estonian', 'icelandic', 'catalan', 'basque', 'galician', 'welsh', 'irish'
];

const holidays = [
  'christmas', 'hanukkah', 'kwanzaa', 'new-years', 'new-years-eve',
  'valentines-day', 'easter', 'passover', 'mothers-day', 'fathers-day',
  'independence-day', 'fourth-of-july', 'labor-day', 'memorial-day',
  'thanksgiving', 'halloween', 'dia-de-los-muertos', 'cinco-de-mayo',
  'st-patricks-day', 'mardi-gras', 'carnival', 'diwali', 'holi',
  'chinese-new-year', 'lunar-new-year', 'eid', 'ramadan', 'oktoberfest',
  'birthday', 'anniversary', 'graduation', 'wedding', 'baby-shower',
  'bridal-shower', 'bachelorette-party', 'bachelor-party', 'retirement',
  'farewell', 'welcome-party', 'housewarming', 'communion', 'confirmation',
  'bar-mitzvah', 'bat-mitzvah', 'quinceañera', 'sweet-sixteen'
];

const videoStyles = [
  'anime', 'cartoon', 'pixar-style', 'disney-style', '3d-animation',
  '2d-animation', 'stop-motion', 'claymation', 'hand-drawn', 'watercolor',
  'oil-painting', 'digital-art', 'pixel-art', '8-bit', 'retro',
  'cyberpunk', 'steampunk', 'fantasy', 'sci-fi', 'futuristic',
  'realistic', 'photorealistic', 'cinematic', 'film-noir', 'vintage',
  '80s-style', '90s-style', 'vaporwave', 'synthwave', 'neon',
  'minimalist', 'abstract', 'surreal', 'psychedelic', 'trippy',
  'nature', 'landscape', 'urban', 'cityscape', 'space',
  'underwater', 'forest', 'beach', 'mountain', 'desert',
  'romantic', 'dramatic', 'action', 'horror', 'comedy',
  'musical', 'broadway', 'concert', 'live-performance', 'studio',
  'lyric-video', 'visualizer', 'kaleidoscope', 'geometric', 'mandala',
  'graffiti', 'street-art', 'comic-book', 'manga', 'graphic-novel',
  'storybook', 'fairytale', 'childrens', 'educational', 'corporate'
];

const occasions = [
  'birthday-song', 'wedding-song', 'anniversary-song', 'graduation-song',
  'baby-shower-song', 'proposal-song', 'first-dance-song', 'mothers-day-song',
  'fathers-day-song', 'memorial-song', 'tribute-song', 'celebration-song',
  'party-song', 'workout-anthem', 'motivation-song', 'study-music',
  'focus-music', 'sleep-music', 'relaxation-music', 'meditation-music',
  'yoga-music', 'spa-music', 'massage-music', 'nature-sounds',
  'white-noise', 'background-music', 'dinner-party-music', 'cocktail-music',
  'road-trip-playlist', 'summer-playlist', 'winter-playlist', 'fall-playlist',
  'spring-playlist', 'morning-playlist', 'evening-playlist', 'night-playlist',
  'sunrise-music', 'sunset-music', 'romantic-dinner', 'date-night',
  'breakup-song', 'heartbreak-song', 'empowerment-anthem', 'self-love-song',
  'friendship-song', 'family-song', 'pet-song', 'dog-song', 'cat-song'
];

const platforms = [
  'youtube', 'youtube-shorts', 'tiktok', 'instagram', 'instagram-reels',
  'facebook', 'twitter', 'x', 'snapchat', 'pinterest', 'linkedin',
  'spotify', 'apple-music', 'amazon-music', 'soundcloud', 'bandcamp',
  'podcast', 'podcast-intro', 'podcast-outro', 'podcast-background',
  'twitch', 'stream', 'streaming', 'gaming-stream', 'vlog',
  'video-intro', 'video-outro', 'channel-intro', 'brand-music',
  'commercial', 'advertisement', 'ad-music', 'jingle', 'radio-jingle',
  'tv-commercial', 'web-ad', 'social-media-ad', 'promotional-video',
  'presentation', 'corporate-video', 'training-video', 'explainer-video',
  'documentary', 'film', 'short-film', 'indie-film', 'student-film',
  'wedding-video', 'event-video', 'recap-video', 'highlight-reel',
  'travel-video', 'vlog-music', 'montage', 'timelapse', 'drone-footage'
];

const audiences = [
  'kids', 'children', 'toddler', 'baby', 'nursery', 'preschool',
  'elementary', 'tween', 'teen', 'teenager', 'young-adult', 'adult',
  'seniors', 'family-friendly', 'all-ages', 'clean', 'safe-for-kids',
  'explicit', 'mature', 'parental-advisory', 'educational', 'learning',
  'classroom', 'teacher', 'student', 'school', 'college', 'university'
];

const functionality = [
  'free-music', 'free-music-generator', 'free-ai-music', 'no-signup',
  'download-music', 'download-mp3', 'download-wav', 'high-quality-audio',
  'royalty-free', 'copyright-free', 'no-copyright', 'commercial-use',
  'licensed-music', 'music-licensing', 'sync-licensing', 'broadcast-license',
  'personal-use', 'non-commercial', 'creative-commons', 'attribution-free',
  'instant-download', 'fast-generation', 'quick-music', 'one-click',
  'custom-length', 'loop', 'seamless-loop', 'stem-separation', 'instrumental',
  'vocals-only', 'karaoke', 'backing-track', 'minus-one', 'remix',
  'mashup', 'cover-song', 'original-music', 'ai-composed', 'ai-written',
  'lyrics-generator', 'melody-generator', 'beat-maker', 'drum-machine',
  'chord-progression', 'music-theory', 'beginner-friendly', 'professional',
  'studio-quality', 'mastered', 'mixed', 'produced', 'arrangement'
];

const useCases = [
  'social-media', 'content-creator', 'influencer', 'creator-economy',
  'marketing', 'advertising', 'brand-content', 'business', 'startup',
  'small-business', 'entrepreneur', 'freelancer', 'agency',
  'storytelling', 'narrative', 'audiobook', 'voice-over', 'narration',
  'gaming', 'video-game-music', 'game-soundtrack', 'mobile-game',
  'indie-game', 'rpg-music', 'boss-battle', 'menu-music', 'victory-music',
  'sports', 'sports-highlight', 'sports-intro', 'team-anthem', 'stadium',
  'fitness', 'workout', 'gym', 'running', 'cycling', 'hiit', 'crossfit',
  'competition', 'contest', 'award-show', 'ceremony', 'gala', 'fundraiser',
  'church', 'religious', 'spiritual', 'worship', 'hymn', 'gospel-choir',
  'theater', 'stage', 'performance', 'dance', 'ballet', 'contemporary-dance',
  'fashion-show', 'runway', 'photoshoot', 'lookbook', 'catalog',
  'restaurant', 'cafe', 'bar', 'lounge', 'hotel', 'spa', 'resort',
  'retail', 'store', 'shopping', 'mall', 'boutique', 'showroom',
  'waiting-room', 'lobby', 'elevator', 'on-hold', 'phone-system', 'ivr'
];

const moods = [
  'happy', 'sad', 'angry', 'peaceful', 'energetic', 'calm', 'excited',
  'romantic', 'nostalgic', 'hopeful', 'melancholic', 'dramatic', 'epic',
  'mysterious', 'suspenseful', 'scary', 'dark', 'light', 'bright',
  'uplifting', 'inspiring', 'motivational', 'empowering', 'confident',
  'playful', 'fun', 'silly', 'serious', 'intense', 'aggressive',
  'chill', 'relaxed', 'mellow', 'dreamy', 'ethereal', 'atmospheric',
  'groovy', 'funky', 'bouncy', 'driving', 'powerful', 'soft', 'gentle',
  'warm', 'cool', 'hot', 'cold', 'summer-vibes', 'winter-vibes',
  'tropical', 'coastal', 'urban', 'rural', 'nature', 'industrial'
];

const DOMAIN = 'https://gruvimusic.com';
const today = new Date().toISOString().split('T')[0];

function generateSitemap(): string {
  const urls: string[] = [];
  
  // Static routes with high priority
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/ai-music', priority: '0.95', changefreq: 'weekly' },
    { path: '/ai-music-videos', priority: '0.95', changefreq: 'weekly' },
    { path: '/ai-video-shorts', priority: '0.95', changefreq: 'weekly' },
    { path: '/social-media', priority: '0.95', changefreq: 'weekly' },
    { path: '/pricing', priority: '0.9', changefreq: 'weekly' },
    { path: '/ai-music-generator', priority: '0.9', changefreq: 'weekly' },
    { path: '/ai-song-generator', priority: '0.9', changefreq: 'weekly' },
    { path: '/music-video-generator', priority: '0.9', changefreq: 'weekly' },
    { path: '/free-music-generator', priority: '0.9', changefreq: 'weekly' },
    { path: '/lyrics-generator', priority: '0.9', changefreq: 'weekly' },
    { path: '/beat-maker', priority: '0.9', changefreq: 'weekly' },
    { path: '/faq', priority: '0.6', changefreq: 'monthly' },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/payment', priority: '0.7', changefreq: 'monthly' },
  ];
  
  staticRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);
  });
  
  // Genre routes
  genres.forEach(genre => {
    urls.push(`  <url>
    <loc>${DOMAIN}/create-${genre}-music</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });
  
  // Language routes
  languages.forEach(lang => {
    urls.push(`  <url>
    <loc>${DOMAIN}/create-music-in-${lang}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });
  
  // Holiday routes
  holidays.forEach(holiday => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${holiday}-music</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });
  
  // Platform routes (music-for-tiktok, music-for-youtube, etc.)
  const socialPlatforms = ['tiktok', 'youtube', 'instagram', 'facebook', 'twitter', 'x', 'snapchat', 'linkedin'];
  socialPlatforms.forEach(platform => {
    urls.push(`  <url>
    <loc>${DOMAIN}/music-for-${platform}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // Mood routes (create-happy-music, create-sad-music, etc.)
  const musicMoods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'epic', 'peaceful', 'uplifting', 'melancholic', 'chill'];
  musicMoods.forEach(mood => {
    urls.push(`  <url>
    <loc>${DOMAIN}/create-${mood}-music</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // Use case routes (airbnb-videos, ecommerce-videos, etc.)
  const businessUseCases = ['airbnb', 'ecommerce', 'restaurant', 'real-estate', 'fitness', 'travel', 'fashion', 'tech', 'automotive', 'beauty'];
  businessUseCases.forEach(useCase => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${useCase}-videos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // AI Music tab - Genre-specific routes
  const topMusicGenres = ['pop', 'hip-hop', 'rock', 'jazz', 'electronic', 'classical', 'country', 'rnb', 'latin', 'k-pop', 'indie', 'metal'];
  topMusicGenres.forEach(genre => {
    urls.push(`  <url>
    <loc>${DOMAIN}/ai-music/${genre}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
  });

  // AI Music tab - Language-specific routes
  const topLanguages = ['spanish', 'french', 'japanese', 'korean', 'german', 'italian', 'portuguese', 'chinese', 'hindi', 'arabic'];
  topLanguages.forEach(lang => {
    urls.push(`  <url>
    <loc>${DOMAIN}/ai-music/${lang}-music</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
  });

  // AI Video Shorts tab - Use case routes
  const videoUseCases = ['product', 'ugc', 'ads', 'promo', 'social', 'tiktok', 'instagram', 'youtube', 'brand', 'marketing'];
  videoUseCases.forEach(useCase => {
    urls.push(`  <url>
    <loc>${DOMAIN}/ai-video-shorts/${useCase}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
  });

  // AI Video Shorts tab - Style routes
  const videoStylesShort = ['anime', 'realistic', '3d', 'cartoon', 'cinematic', 'minimalist'];
  videoStylesShort.forEach(style => {
    urls.push(`  <url>
    <loc>${DOMAIN}/ai-video-shorts/${style}-style</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
  });

  // Social Media tab - Platform-specific routes
  const socialMediaPlatforms = ['youtube', 'tiktok', 'instagram', 'facebook', 'linkedin', 'twitter', 'x', 'pinterest'];
  socialMediaPlatforms.forEach(platform => {
    urls.push(`  <url>
    <loc>${DOMAIN}/social-media/${platform}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
  });

  // Social Media tab - Feature routes
  const socialFeatures = ['scheduler', 'analytics', 'auto-post', 'cross-post', 'calendar', 'bulk-upload'];
  socialFeatures.forEach(feature => {
    urls.push(`  <url>
    <loc>${DOMAIN}/social-media/${feature}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
  });

  // Pricing tab - Plan-specific routes
  const pricingVariations = ['free', 'starter', 'pro', 'business', 'enterprise', 'monthly', 'yearly', 'lifetime'];
  pricingVariations.forEach(plan => {
    urls.push(`  <url>
    <loc>${DOMAIN}/pricing/${plan}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // Pricing tab - Use case routes
  const pricingUseCases = ['creators', 'businesses', 'agencies', 'musicians', 'marketers', 'influencers'];
  pricingUseCases.forEach(useCase => {
    urls.push(`  <url>
    <loc>${DOMAIN}/pricing/for-${useCase}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // ============================================
  // VIRAL CONTENT ROUTES - High search volume
  // ============================================

  // Viral TikTok routes
  const viralTikTokRoutes = [
    'viral-tiktok-music', 'tiktok-trending-sounds', 'tiktok-viral-song-generator',
    'tiktok-background-music', 'tiktok-dance-music', 'tiktok-transition-music',
    'tiktok-challenge-music', 'tiktok-duet-music', 'tiktok-reels-music'
  ];
  viralTikTokRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  });

  // Viral YouTube Shorts routes
  const viralYouTubeRoutes = [
    'youtube-shorts-music', 'viral-youtube-shorts', 'youtube-shorts-background-music',
    'youtube-shorts-trending', 'youtube-shorts-beats', 'youtube-shorts-intro-music',
    'youtube-shorts-outro-music', 'youtube-shorts-monetization-music'
  ];
  viralYouTubeRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  });

  // Instagram Reels viral routes
  const viralInstagramRoutes = [
    'instagram-reels-music', 'viral-instagram-reels', 'reels-trending-audio',
    'instagram-reels-background-music', 'instagram-story-music', 'instagram-viral-sounds',
    'reels-transition-music', 'instagram-reels-beats'
  ];
  viralInstagramRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  });

  // Platform + Genre combinations (viral keywords)
  const platformGenreCombos = [
    'tiktok-rap-music', 'tiktok-pop-music', 'tiktok-edm-beats',
    'youtube-shorts-hip-hop', 'youtube-shorts-lofi', 'youtube-shorts-beats',
    'instagram-reels-trap', 'instagram-reels-afrobeats', 'instagram-reels-house-music',
    'viral-dance-music', 'viral-workout-music', 'viral-motivation-music'
  ];
  platformGenreCombos.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
  });

  // AI Music + Viral combinations
  const aiMusicViralRoutes = [
    'ai-music/viral-tiktok', 'ai-music/youtube-shorts', 'ai-music/instagram-reels',
    'ai-music/trending', 'ai-music/viral-sounds', 'ai-music/background-music',
    'ai-music/royalty-free', 'ai-music/copyright-free', 'ai-music/commercial-use',
    'ai-music/no-copyright', 'ai-music/free-download', 'ai-music/beats',
    'ai-music/instrumentals', 'ai-music/vocals', 'ai-music/remixes'
  ];
  aiMusicViralRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.88</priority>
  </url>`);
  });

  // AI Video Shorts + Content type combinations
  const videoContentTypes = [
    'ai-video-shorts/viral-tiktok', 'ai-video-shorts/youtube-shorts', 'ai-video-shorts/reels',
    'ai-video-shorts/trending', 'ai-video-shorts/faceless', 'ai-video-shorts/voiceover',
    'ai-video-shorts/text-to-video', 'ai-video-shorts/image-to-video', 'ai-video-shorts/lyrics-video',
    'ai-video-shorts/visualizer', 'ai-video-shorts/music-video', 'ai-video-shorts/podcast-clips',
    'ai-video-shorts/quote-videos', 'ai-video-shorts/motivation', 'ai-video-shorts/educational',
    'ai-video-shorts/tutorial', 'ai-video-shorts/explainer', 'ai-video-shorts/storytime'
  ];
  videoContentTypes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.87</priority>
  </url>`);
  });

  // Industry-specific routes (more use cases)
  const industryRoutes = [
    'real-estate-video-music', 'real-estate-property-tours', 'real-estate-listings-video',
    'gym-workout-music', 'gym-promo-videos', 'fitness-motivation-music',
    'spa-relaxation-music', 'salon-background-music', 'yoga-studio-music',
    'coffee-shop-music', 'retail-store-music', 'boutique-background-music',
    'dental-office-music', 'medical-waiting-room-music', 'clinic-background-music',
    'car-dealership-videos', 'auto-repair-shop-videos', 'mechanic-promo-videos',
    'law-firm-videos', 'accounting-firm-videos', 'consulting-videos',
    'wedding-videographer-music', 'photographer-portfolio-music', 'drone-footage-music'
  ];
  industryRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.82</priority>
  </url>`);
  });

  // Content creator niches
  const creatorNiches = [
    'gaming-content-music', 'gaming-montage-music', 'gaming-stream-music',
    'vlog-background-music', 'travel-vlog-music', 'daily-vlog-music',
    'cooking-video-music', 'recipe-video-music', 'food-channel-music',
    'beauty-tutorial-music', 'makeup-tutorial-music', 'skincare-video-music',
    'tech-review-music', 'unboxing-video-music', 'product-review-music',
    'prank-video-music', 'comedy-sketch-music', 'funny-video-music',
    'storytime-video-music', 'podcast-intro-music', 'podcast-outro-music'
  ];
  creatorNiches.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.82</priority>
  </url>`);
  });

  // Social Media + Use Case combinations
  const socialMediaCombos = [
    'social-media/content-calendar', 'social-media/batch-posting', 'social-media/viral-strategy',
    'social-media/engagement-tools', 'social-media/hashtag-generator', 'social-media/caption-writer',
    'social-media/brand-management', 'social-media/influencer-tools', 'social-media/creator-studio',
    'social-media/multi-account', 'social-media/team-collaboration', 'social-media/client-management'
  ];
  socialMediaCombos.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.83</priority>
  </url>`);
  });

  // Seasonal/Trending routes
  const seasonalRoutes = [
    'summer-music', 'summer-vibes-music', 'beach-music', 'pool-party-music',
    'winter-music', 'holiday-music', 'festive-music', 'celebration-music',
    'back-to-school-music', 'graduation-music', 'wedding-season-music',
    'black-friday-promo-music', 'cyber-monday-videos', 'holiday-sale-videos'
  ];
  seasonalRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.78</priority>
  </url>`);
  });

  // ============================================
  // BROAD DESIRE & SOLUTION-FOCUSED ROUTES
  // ============================================

  // UGC Content Creation (high-value searches)
  const ugcRoutes = [
    'create-ugc-videos', 'ugc-content-creator', 'ugc-video-generator',
    'bulk-ugc-videos', 'affordable-ugc-content', 'ugc-at-scale',
    'ai-ugc-creator', 'automated-ugc-videos', 'ugc-without-filming',
    'virtual-ugc-creator', 'ai-avatar-ugc', '100-ugc-videos'
  ];
  ugcRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.89</priority>
  </url>`);
  });

  // E-commerce & Amazon Sellers
  const ecommerceRoutes = [
    'amazon-product-videos', 'amazon-store-promotion', 'amazon-listing-videos',
    'shopify-product-videos', 'shopify-store-music', 'shopify-ads',
    'etsy-shop-videos', 'etsy-product-showcase', 'etsy-promo-videos',
    'ebay-listing-videos', 'ebay-store-promotion',
    'ecommerce-product-videos', 'online-store-videos', 'product-demo-videos',
    'dropshipping-videos', 'dropshipping-ads', 'print-on-demand-videos'
  ];
  ecommerceRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.87</priority>
  </url>`);
  });

  // Hotel, Tourism & Hospitality
  const hospitalityRoutes = [
    'hotel-promo-videos', 'hotel-room-tours', 'hotel-marketing-videos',
    'resort-promotional-videos', 'vacation-rental-videos', 'bnb-promo-videos',
    'tourism-videos', 'travel-destination-videos', 'city-tour-videos',
    'cruise-ship-videos', 'adventure-tour-videos', 'ski-resort-videos'
  ];
  hospitalityRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.84</priority>
  </url>`);
  });

  // Music for Specific Purposes (problem-solving)
  const purposeMusicRoutes = [
    'music-for-videos', 'background-music-for-videos', 'intro-music-for-videos',
    'outro-music-for-videos', 'transition-music', 'logo-reveal-music',
    'slideshow-music', 'presentation-background-music', 'corporate-presentation-music',
    'on-hold-music', 'waiting-music', 'elevator-music',
    'study-music', 'focus-music', 'concentration-music',
    'sleep-music', 'relaxation-music', 'stress-relief-music',
    'meditation-music', 'mindfulness-music', 'zen-music'
  ];
  purposeMusicRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.83</priority>
  </url>`);
  });

  // Bulk Content Creation (scalability focus)
  const bulkContentRoutes = [
    'bulk-video-creation', 'batch-create-videos', '100-videos-at-once',
    'automated-content-creation', 'ai-content-factory', 'mass-video-production',
    'scale-content-creation', 'unlimited-video-generation', 'infinite-content',
    'video-automation', 'content-automation', 'auto-generate-videos'
  ];
  bulkContentRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.86</priority>
  </url>`);
  });

  // Multilingual Content
  const multilingualRoutes = [
    'multilingual-videos', 'translate-videos', 'multi-language-content',
    'global-content-creation', 'international-videos', 'worldwide-audience',
    'localized-content', 'regional-videos', 'native-language-videos'
  ];
  multilingualRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.82</priority>
  </url>`);
  });

  // Cost-Saving & Efficiency (value proposition)
  const valuePropRoutes = [
    'replace-video-editor', 'replace-music-producer', 'no-video-crew-needed',
    'affordable-video-production', 'cheap-video-creation', 'budget-friendly-videos',
    'free-video-maker', 'free-music-creator', 'no-subscription-video',
    'one-time-payment-video', 'unlimited-videos', 'unlimited-music'
  ];
  valuePropRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.81</priority>
  </url>`);
  });

  // Avatar & Talking Head Videos
  const avatarRoutes = [
    'ai-avatar-videos', 'talking-avatar-creator', 'virtual-spokesperson',
    'ai-presenter-videos', 'digital-avatar-generator', 'animated-character-videos',
    'custom-avatar-creator', 'brand-mascot-videos', 'virtual-influencer'
  ];
  avatarRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
  });

  // Faceless Content (trending niche)
  const facelessRoutes = [
    'faceless-youtube-channel', 'faceless-content-creation', 'anonymous-videos',
    'no-camera-videos', 'faceless-tiktok', 'faceless-instagram',
    'faceless-monetization', 'passive-income-videos', 'automated-youtube-channel'
  ];
  facelessRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.88</priority>
  </url>`);
  });

  // AI Music Shorts (specific combos)
  const aiMusicShortsRoutes = [
    'ai-music-shorts', 'ai-generated-music-videos', 'ai-music-with-visuals',
    'music-video-automation', 'instant-music-videos', 'one-click-music-video',
    'lyrics-to-video', 'song-to-video-converter', 'audio-to-video-ai'
  ];
  aiMusicShortsRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  });

  // Specific Platform Domination
  const platformDominationRoutes = [
    'dominate-tiktok', 'grow-youtube-shorts', 'viral-on-instagram',
    'tiktok-growth-tool', 'youtube-shorts-growth', 'instagram-reels-growth',
    'increase-tiktok-followers', 'youtube-shorts-views', 'instagram-engagement',
    'tiktok-algorithm-hack', 'youtube-shorts-algorithm', 'reels-algorithm'
  ];
  platformDominationRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.86</priority>
  </url>`);
  });

  // Quick & Easy (instant gratification)
  const quickEasyRoutes = [
    'instant-video-creation', 'quick-music-generator', 'fast-video-maker',
    '1-minute-video-creator', '5-second-music', 'instant-content',
    'no-skills-required', 'beginner-friendly-video', 'easy-music-maker',
    'drag-and-drop-video', 'simple-video-creator', 'effortless-content'
  ];
  quickEasyRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.79</priority>
  </url>`);
  });

  // Side Hustle & Monetization
  const monetizationRoutes = [
    'content-creation-side-hustle', 'make-money-with-videos', 'monetize-content',
    'youtube-monetization-music', 'tiktok-creator-fund', 'passive-income-content',
    'sell-music-online', 'license-music', 'royalty-free-for-resale',
    'white-label-music', 'resell-videos', 'content-reseller'
  ];
  monetizationRoutes.forEach(route => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.83</priority>
  </url>`);
  });

  // Video style routes
  videoStyles.forEach(style => {
    urls.push(`  <url>
    <loc>${DOMAIN}/create-${style}-music-video</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });
  
  // Occasion routes
  occasions.forEach(occasion => {
    urls.push(`  <url>
    <loc>${DOMAIN}/create-${occasion}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });
  
  // Platform routes
  platforms.forEach(platform => {
    urls.push(`  <url>
    <loc>${DOMAIN}/music-for-${platform}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });
  
  // Audience routes
  audiences.forEach(audience => {
    urls.push(`  <url>
    <loc>${DOMAIN}/music-for-${audience}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });
  
  // Functionality routes
  functionality.forEach(func => {
    urls.push(`  <url>
    <loc>${DOMAIN}/${func}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });
  
  // Use case routes
  useCases.forEach(useCase => {
    urls.push(`  <url>
    <loc>${DOMAIN}/music-for-${useCase}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });
  
  // Mood routes
  moods.forEach(mood => {
    urls.push(`  <url>
    <loc>${DOMAIN}/create-${mood}-music</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

// Generate and write sitemap
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemap);
console.log(`✅ Sitemap generated with ${sitemap.split('<url>').length - 1} URLs`);
console.log(`📁 Output: ${outputPath}`);

