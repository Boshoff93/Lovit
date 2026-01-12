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

const DOMAIN = 'https://gruvi.ai';
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

