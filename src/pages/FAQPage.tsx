import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { SEO, createFAQStructuredData, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

export const faqItems = [
  // ============================================
  // GETTING STARTED
  // ============================================
  {
    category: "Getting Started",
    question: "What is Gruvi AI Music Generator?",
    answer: "Gruvi is an AI-powered platform that creates original music and music videos from text descriptions. Generate songs, create stunning music videos, and produce promotional videos for products, Airbnbs, and brands.",
    detailedAnswer: "Gruvi is a revolutionary AI-powered platform that transforms how you create music and video content. Using cutting-edge artificial intelligence, Gruvi allows you to generate original, royalty-free songs simply by describing what you want. Whether you want a catchy pop song, an emotional ballad, or a high-energy EDM track, just type your idea and our AI creates a complete song with vocals, instrumentals, and lyrics.\n\nBut Gruvi goes beyond just music generation:\n\n**Music Videos:** Turn your songs into stunning animated music videos in 16 different art styles - from anime to cinematic to 3D cartoon.\n\n**Promo Videos:** Create professional promotional videos for your brand, products, or business with AI-generated music.\n\n**Product Videos:** Generate e-commerce videos for Shopify, Amazon, Etsy with custom music that sells.\n\n**Property Videos:** Showcase Airbnbs, hotels, restaurants, and real estate with cinematic videos and original soundtracks.\n\n**Custom Characters:** Add yourself, your products, or any character using reference images.\n\nIt's the complete creative studio for musicians, content creators, businesses, and anyone who wants professional-quality content without needing technical skills."
  },
  {
    category: "Getting Started",
    question: "How do I create my first AI-generated song?",
    answer: "Go to Gruvi, type a description of the music you want (like 'upbeat pop song about summer vacation'), and click generate. Your custom song will be ready in seconds.",
    detailedAnswer: "Creating your first song with Gruvi is simple:\n\n**Step 1: Sign Up**\nCreate a free account to get started. No credit card required.\n\n**Step 2: Describe Your Song**\nIn the prompt box, describe what you want. Be specific about:\n- Genre (pop, rock, hip-hop, jazz, etc.)\n- Mood (happy, sad, energetic, chill)\n- Theme or subject matter\n- Any specific lyrics or phrases\n- Language preference\n\n**Step 3: Generate**\nClick the generate button and wait a few seconds. Our AI will create a complete song with vocals, instruments, and lyrics.\n\n**Step 4: Refine**\nNot quite right? Regenerate with a modified prompt or try different variations. Each generation is unique.\n\n**Step 5: Download**\nWhen you're happy, download your song and use it however you like!"
  },
  {
    category: "Getting Started",
    question: "Is Gruvi free to use?",
    answer: "Yes! You can try Gruvi for free when you sign up. Create songs and experience the platform before choosing a subscription plan.",
    detailedAnswer: "Gruvi offers a free trial so you can experience the magic of AI music creation before committing:\n\n**Free Trial Includes:**\n- Create songs to test the platform\n- Try different genres and prompts\n- Experience the music generation quality\n- Explore the interface and features\n\n**No Credit Card Required:**\n- Sign up with just an email\n- Start creating immediately\n- Upgrade when you're ready\n\n**Subscription Plans:**\nAfter your trial, choose from Starter ($6.99/mo), Pro ($12.99/mo), or Premium ($24.99/mo) based on your needs. All plans include commercial licensing and download access."
  },
  {
    category: "Getting Started",
    question: "Do I need any musical experience to use Gruvi?",
    answer: "No musical experience needed! Gruvi's AI handles all the composition, arrangement, and production. Just describe what you want in plain English.",
    detailedAnswer: "Gruvi is designed for everyone, regardless of musical background:\n\n**For Complete Beginners:**\n- No need to read music or play instruments\n- No music theory knowledge required\n- No production or mixing skills needed\n- Just describe your ideas in natural language\n\n**For Musicians:**\n- Speed up your creative process\n- Generate ideas and inspiration\n- Create backing tracks and demos\n- Explore new genres and styles\n\n**For Professionals:**\n- Rapid prototyping for clients\n- Unlimited creative exploration\n- Stem separation for further production\n- Commercial-ready output\n\nWhether you've never touched an instrument or you're a professional producer, Gruvi meets you where you are."
  },
  {
    category: "Getting Started",
    question: "What can I create with Gruvi?",
    answer: "Create AI-generated songs, music videos, product promo videos, Airbnb/property videos, brand videos, and more. All with original music and stunning visuals.",
    detailedAnswer: "Gruvi is a complete creative platform for multiple use cases:\n\n**Music Creation:**\n- Original songs in 100+ genre and mood combinations\n- Vocals in 24+ languages\n- Instrumental tracks\n- Jingles and sound effects\n\n**Music Videos:**\n- Full cinematic music videos\n- 15 art styles (Animation, 3D Cartoon, Realistic, etc.)\n- Custom characters from your photos\n- Portrait (TikTok) and landscape (YouTube) formats\n\n**Promotional Videos:**\n- Product showcase videos for e-commerce\n- Airbnb and property tour videos\n- Restaurant and food promo videos\n- Brand marketing videos\n- Social media ad content\n\n**Business Uses:**\n- YouTube content creation\n- Podcast intros and outros\n- Background music for videos\n- Event and wedding music\n- Gaming and streaming content"
  },
  {
    category: "Getting Started",
    question: "How long does it take to generate a song or video?",
    answer: "Songs generate in 15-30 seconds. Music videos take 2-5 minutes depending on complexity. Scale and Content Engine users get priority processing for faster results.",
    detailedAnswer: "Generation times vary by content type:\n\n**Song Generation:**\n- Standard: 15-30 seconds\n- Complex prompts: Up to 1 minute\n- Priority queue (Scale/Content Engine): ~10 seconds\n\n**Video Generation:**\n- Still image videos: 1-2 minutes\n- Full cinematic videos: 2-5 minutes\n- Videos with custom characters: +30 seconds\n\n**Factors Affecting Speed:**\n- Video length and complexity\n- Number of reference images\n- Current server demand\n- Your subscription tier\n\n**Tips for Faster Results:**\n- Use clear, concise prompts\n- Optimize reference images (they're auto-compressed)\n- Upgrade for priority access\n- Generate during off-peak hours"
  },

  // ============================================
  // MUSIC CREATION
  // ============================================
  {
    category: "Music Creation",
    question: "What music genres can Gruvi create?",
    answer: "Gruvi supports 100+ genre and mood combinations including Pop, Rock, Hip-Hop, Jazz, Classical, Electronic, R&B, Country, Latin, K-Pop, Afrobeats, Lo-Fi, Metal, Indie, Folk, and many more.",
    detailedAnswer: "We support an incredibly diverse range of musical genres:\n\n**Popular Genres:** Pop, Rock, Hip-Hop, Rap, R&B, Soul, Country, Jazz, Blues, Classical, Electronic, EDM, House, Techno, Trance, Dubstep\n\n**World Music:** K-Pop, J-Pop, Latin, Reggaeton, Afrobeats, Bollywood, Flamenco, Bossa Nova, Samba, Reggae, Dancehall\n\n**Modern Subgenres:** Trap, Drill, Phonk, Lo-Fi, Synthwave, Retrowave, Vaporwave, Chillhop, Boom Bap, Grime\n\n**Rock Subgenres:** Alternative, Indie Rock, Metal, Punk, Grunge, Classic Rock, Hard Rock, Progressive Rock\n\n**Other Styles:** Folk, Acoustic, Singer-Songwriter, Gospel, Christian, Ambient, New Age, Cinematic, Orchestral\n\nYou can even blend genres to create unique fusion styles!"
  },
  {
    category: "Music Creation",
    question: "What languages can I create songs in?",
    answer: "Gruvi supports 24+ languages including English, Spanish, French, German, Japanese, Korean, Chinese, Portuguese, Italian, Arabic, Hindi, and many more.",
    detailedAnswer: "Create music in your native language or explore global sounds:\n\n**European Languages:** English, Spanish, French, German, Italian, Portuguese, Dutch, Polish, Swedish, Danish, Norwegian, Finnish, Greek, Russian\n\n**Asian Languages:** Japanese, Korean, Mandarin Chinese, Cantonese, Thai, Vietnamese, Indonesian, Hindi, Tamil, Telugu\n\n**Middle Eastern Languages:** Arabic, Hebrew, Turkish, Persian\n\n**African Languages:** Swahili, Yoruba, Zulu, Afrikaans\n\nThe AI generates authentic-sounding lyrics and vocal performances in each language, respecting natural cadence and phonetics. Perfect for K-Pop, Latin reggaeton, French pop, Bollywood, and any international style."
  },
  {
    category: "Music Creation",
    question: "How long are the songs Gruvi creates?",
    answer: "By default, Gruvi creates songs around 2-3 minutes in length - perfect for streaming and social media. Premium users can control the exact length up to 3 minutes.",
    detailedAnswer: "Song duration options vary by plan:\n\n**Default Length:**\n- 2-3 minutes: Ideal for streaming platforms, social media, and general use\n\n**Premium Duration Control:**\n- Choose your exact song length up to 3 minutes\n- Perfect for matching specific video lengths\n- Great for content that needs precise timing\n\n**Short Form:**\n- 30-60 seconds: Perfect for TikTok, Instagram Reels, YouTube Shorts, ads, and intros\n\nMost songs are optimized for modern streaming, where 2-3 minutes is the sweet spot for listener engagement."
  },
  {
    category: "Music Creation",
    question: "Can I write my own lyrics for AI to use?",
    answer: "Yes! You can provide your own lyrics in the prompt and our AI will compose music around them. Great for songwriters who want help with the musical arrangement.",
    detailedAnswer: "Gruvi offers flexible lyric options:\n\n**AI-Generated Lyrics:**\n- Describe your theme and the AI writes complete lyrics\n- Specify mood, story, and key phrases to include\n- Get creative suggestions you might not have thought of\n\n**Custom Lyrics:**\n- Paste your own lyrics directly into the prompt\n- The AI composes music that fits your words\n- Perfect for songwriters and poets\n\n**Hybrid Approach:**\n- Provide a chorus and let AI write the verses\n- Give key lines and let AI expand\n- Collaborate with the AI on your vision\n\nThis flexibility makes Gruvi useful whether you want a complete hands-off experience or creative collaboration."
  },
  {
    category: "Music Creation",
    question: "How do I get better results from AI music generation?",
    answer: "Be specific in your prompts! Include genre, mood, tempo, instruments, vocal style, and theme. The more detail you provide, the closer the result to your vision.",
    detailedAnswer: "Tips for getting the best results:\n\n**Be Specific About Genre:**\n- ❌ 'Make a song'\n- ✅ 'Create an upbeat indie pop song with acoustic guitar'\n\n**Describe the Mood:**\n- Include emotions: happy, melancholic, aggressive, peaceful\n- Reference the energy: energetic, chill, building, explosive\n\n**Mention Instruments:**\n- Piano-driven, guitar-heavy, synth-based, orchestral\n- Specific sounds: 808 bass, vintage drums, strings\n\n**Specify Vocals:**\n- Male/female voice, rap, singing, falsetto\n- Vocal style: soulful, raspy, clear, whispered\n\n**Include Theme:**\n- What's the song about? Love, loss, party, journey?\n- Specific imagery or story elements\n\n**Reference Artists (Optional):**\n- 'In the style of...' can help guide the sound\n- Combine influences for unique results"
  },
  {
    category: "Music Creation",
    question: "Can I create instrumental music without vocals?",
    answer: "Yes! Simply specify 'instrumental' or 'no vocals' in your prompt. Perfect for background music, study tracks, gaming streams, and more.",
    detailedAnswer: "Gruvi excels at instrumental music creation:\n\n**How to Create Instrumentals:**\n- Add 'instrumental' or 'no vocals' to your prompt\n- Specify the genre and mood you want\n- Describe the instruments you'd like featured\n\n**Popular Instrumental Uses:**\n- **Background Music:** Videos, podcasts, presentations\n- **Study/Focus:** Lo-fi beats, ambient, classical\n- **Gaming:** Stream background, game soundtracks\n- **Content Creation:** YouTube, TikTok, Instagram\n- **Relaxation:** Meditation, spa, sleep music\n- **Commercial:** Ads, corporate videos, hold music\n\n**Instrumental Genres:**\n- Lo-Fi Hip Hop\n- Ambient Electronic\n- Classical/Orchestral\n- Jazz\n- Cinematic/Soundtrack\n- Acoustic/Folk\n- Electronic/EDM"
  },

  // ============================================
  // MUSIC VIDEOS
  // ============================================
  {
    category: "Music Videos",
    question: "How do I create AI music videos?",
    answer: "After generating a song, select 'Create Video' and choose from 15 art styles including Animation, 3D Cartoon, Realistic, and more. Upload character or product references if desired, then generate.",
    detailedAnswer: "Creating music videos with Gruvi is seamless:\n\n**Step 1: Generate Your Song**\nStart by creating your AI-generated track, or use your own music\n\n**Step 2: Choose Your Art Style**\nSelect from 15 distinct visual styles:\n- 3D Cartoon (Pixar-style)\n- Animation (Anime)\n- Realistic\n- Claymation\n- Comic Book\n- Watercolor\n- 2D Game (Pixel)\n- And 8 more!\n\n**Step 3: Add Characters, Products, or Places (Optional)**\n- Upload reference images of people to star in your video\n- Add product photos for promotional videos\n- Upload property photos for Airbnb/hotel videos\n\n**Step 4: Generate**\nOur AI creates a fully animated music video synchronized to your song, with dynamic scenes, camera movements, and professional transitions.\n\n**Video Formats:**\n- **Portrait (9:16):** Perfect for TikTok, Instagram Reels, YouTube Shorts\n- **Landscape (16:9):** Ideal for YouTube, presentations, websites"
  },
  {
    category: "Music Videos",
    question: "What art styles are available for music videos?",
    answer: "Choose from 15 styles: 3D Cartoon, Animation, Realistic, Claymation, Comic Book, Watercolor, 2D Game, B&W Sketch, Children's Book, Origami, and more.",
    detailedAnswer: "Our 15 art styles cover every aesthetic:\n\n**Animation Styles:**\n- 3D Cartoon (Pixar-like)\n- Animation (Anime)\n- Claymation\n- 2D Game (Pixel Art)\n\n**Artistic Styles:**\n- Watercolor\n- B&W Sketch\n- Spray Paint\n- Crayon\n- Comic Book\n\n**Creative Styles:**\n- Children's Book\n- Origami\n- Cozy Woolknit\n- Sugarpop\n- Classic Blocks\n\n**Realistic:**\n- Realistic (Photorealistic)\n\nEach style is optimized to create stunning visuals that match your music's mood and genre."
  },
  {
    category: "Music Videos",
    question: "Can I add myself or custom characters to music videos?",
    answer: "Yes! Upload reference photos of yourself, friends, or any character. The AI will incorporate them into your music video while maintaining the chosen art style.",
    detailedAnswer: "Custom character support is one of Gruvi's most powerful features:\n\n**How It Works:**\n1. Upload 1-3 clear reference images\n2. Our AI learns the appearance\n3. Characters appear in your video matching your art style\n\n**Use Cases:**\n- Feature yourself as the star\n- Create personalized birthday videos\n- Make branded content with mascots\n- Create gifts featuring friends/family\n- Design virtual avatars\n\n**Best Practices:**\n- Use clear, well-lit photos\n- Front-facing images work best\n- Multiple angles improve accuracy\n- Characters adapt to any art style"
  },
  {
    category: "Music Videos",
    question: "What's the difference between still image and cinematic videos?",
    answer: "Still image videos use beautiful static images - perfect for storytelling and storybook-style content (200 tokens flat). Cinematic videos feature actual video footage with dynamic camera angles, lip sync, and motion (50 tokens per 10 seconds based on audio length).",
    detailedAnswer: "Choose the video type that fits your needs:\n\n**Still Image Videos (200 tokens flat):**\n- Video with still images and smooth transitions\n- Perfect for storytelling and storybook-style content\n- Great when movement isn't needed\n- Faster to generate\n- Ideal for lyric videos, story content, social posts\n\n**Cinematic Videos (50 tokens per 10 seconds):**\n- Actual video footage in your video\n- Dynamic camera angles and movements\n- Lip sync for characters\n- Full motion and animation\n- Professional music video quality\n- Price based on audio duration\n\n**When to Use Each:**\n- **Still:** Storybook content, lyric videos, narration-focused content, testing ideas\n- **Cinematic:** Professional releases, YouTube, presentations, character-focused videos"
  },

  // ============================================
  // PROMO & PRODUCT VIDEOS
  // ============================================
  {
    category: "Promo Videos",
    question: "Can I create promotional videos for my brand or product?",
    answer: "Yes! Gruvi creates professional promo videos with AI-generated music. Upload product photos and get cinematic videos perfect for marketing, social media ads, and e-commerce.",
    detailedAnswer: "Gruvi is perfect for creating promotional content:\n\n**What You Can Promote:**\n- Physical products (cosmetics, electronics, fashion)\n- E-commerce stores (Shopify, Amazon, Etsy)\n- Brands and logos\n- Services and apps\n- Events and launches\n\n**How It Works:**\n1. Upload 1-10 product photos from different angles\n2. Describe the vibe and mood you want\n3. AI generates a catchy song that fits your brand\n4. Get a professional promo video with your product as the star\n\n**Video Styles:**\n- Cinematic product showcase\n- Social media ad format\n- Lifestyle integration\n- Animated product reveals\n\n**Perfect For:**\n- Instagram and TikTok ads\n- Website hero videos\n- Product launch campaigns\n- E-commerce listings"
  },
  {
    category: "Promo Videos",
    question: "Can I create videos for my Airbnb or rental property?",
    answer: "Absolutely! Upload photos of your property and Gruvi creates stunning promotional videos with original music. Perfect for Airbnb, VRBO, hotels, and real estate listings.",
    detailedAnswer: "Showcase your property with professional videos:\n\n**Property Types Supported:**\n- Airbnb and vacation rentals\n- Hotels and resorts\n- Real estate listings\n- Restaurants and cafes\n- Event venues\n- Retail spaces\n\n**How It Works:**\n1. Upload up to 20 photos of your property\n2. Choose a mood (relaxing, luxurious, cozy, vibrant)\n3. AI generates a custom soundtrack\n4. Get a cinematic video tour of your space\n\n**Features:**\n- Smooth camera movements through your space\n- Atmospheric lighting and mood\n- Original music that sets the vibe\n- Professional transitions\n\n**Use For:**\n- Airbnb listing enhancement\n- Social media promotion\n- Website hero videos\n- Booking platform listings\n\n**Pro Tip:** Upload photos in the order you want them to appear - like a virtual tour walking through your space."
  },
  {
    category: "Promo Videos",
    question: "How do I create product videos for e-commerce?",
    answer: "Upload product photos, describe your brand vibe, and Gruvi generates professional videos with custom music. Perfect for Shopify, Amazon, Etsy, and social media marketing.",
    detailedAnswer: "Create e-commerce videos that sell:\n\n**Supported Platforms:**\n- Shopify product pages\n- Amazon listings\n- Etsy shop videos\n- eBay listings\n- Social media ads\n- Your own website\n\n**Step-by-Step Process:**\n1. Upload 3-10 product photos (different angles, lifestyle shots)\n2. Describe your brand and target audience\n3. Choose a music genre and mood that fits\n4. AI generates a professional product video\n\n**Video Styles:**\n- Product showcase with music\n- Lifestyle integration\n- Before/after reveals\n- Unboxing style\n- 360-degree product views\n\n**Why It Works:**\n- Videos increase conversion rates by up to 80%\n- Stand out from static images\n- Custom music creates brand recognition\n- Professional quality without expensive production"
  },
  {
    category: "Promo Videos",
    question: "Can I create restaurant or food promo videos?",
    answer: "Yes! Upload photos of your dishes, restaurant interior, or menu items. Gruvi creates mouth-watering promotional videos with custom music perfect for social media marketing.",
    detailedAnswer: "Make your food irresistible with video:\n\n**What You Can Showcase:**\n- Individual dishes and meals\n- Restaurant interior and ambiance\n- Menu highlights\n- Chef and kitchen action\n- Cocktails and beverages\n- Seasonal specials\n\n**How It Works:**\n1. Upload photos of your food and space\n2. Choose a mood (cozy, upscale, vibrant, romantic)\n3. AI creates music that matches your vibe\n4. Get a video that makes people hungry\n\n**Perfect For:**\n- Instagram Reels and TikTok\n- Google Business Profile\n- Yelp and TripAdvisor\n- Website hero sections\n- Delivery app listings\n- Special event promotion\n\n**Tips for Best Results:**\n- Use well-lit, appetizing photos\n- Include ambiance shots\n- Show food being prepared or served\n- Include exterior shots for location context"
  },

  // ============================================
  // LICENSING & COMMERCIAL USE
  // ============================================
  {
    category: "Licensing",
    question: "Can I use Gruvi music commercially?",
    answer: "Yes! Scale and Content Engine subscribers get a full commercial license. Use your music for YouTube, TikTok, podcasts, games, films, and any commercial project royalty-free.",
    detailedAnswer: "Commercial licensing is one of Gruvi's standout features:\n\n**What's Included (Scale/Content Engine):**\n- Full commercial license for all generated music\n- Use in YouTube videos, TikTok, Instagram, all platforms\n- Include in podcasts, games, films, advertisements\n- Stream on Spotify, Apple Music, and other platforms\n- No royalty payments ever\n- No attribution required\n- Monetize your content freely\n\n**What You Can Do:**\n- Release songs commercially as an artist\n- Use as background music in content\n- Create jingles and ads\n- License to others (Premium)\n- Build a music catalog"
  },
  {
    category: "Licensing",
    question: "Is AI-generated music copyright-free?",
    answer: "Yes! All music created with Gruvi is original and royalty-free. You won't receive copyright claims on YouTube or other platforms for music generated on our service.",
    detailedAnswer: "Understanding copyright for AI music:\n\n**Your Rights:**\n- Music is 100% original, created by AI\n- You won't receive Content ID claims\n- No existing copyrights to infringe\n- Safe for monetization\n\n**Platform Safety:**\n- YouTube: No copyright strikes\n- TikTok: Full use without issues\n- Instagram: Safe for Reels and posts\n- Spotify/Streaming: Clear for distribution\n\n**Important Notes:**\n- Each generation is unique\n- AI doesn't copy existing songs\n- Your commercial license is permanent\n- Download and own forever"
  },
  {
    category: "Licensing",
    question: "Can I upload AI music to Spotify and streaming platforms?",
    answer: "Yes! Download your songs from Gruvi and use a distribution service like DistroKid to release on Spotify, Apple Music, and all major streaming platforms.",
    detailedAnswer: "Release your AI music anywhere:\n\n**How It Works:**\nGruvi doesn't distribute music directly. You download your songs and use a third-party distribution service to release them.\n\n**Popular Distribution Services:**\n- DistroKid (recommended)\n- TuneCore\n- CD Baby\n- Amuse\n- UnitedMasters\n\n**Supported Platforms (via distributors):**\n- Spotify\n- Apple Music\n- Amazon Music\n- YouTube Music\n- Tidal\n- Deezer\n- SoundCloud\n- And 150+ more\n\n**Steps to Release:**\n1. Generate and download your song from Gruvi\n2. Sign up for a distribution service\n3. Upload your track and artwork\n4. Release and keep 100% of your royalties"
  },
  {
    category: "Licensing",
    question: "Do I need to credit Gruvi when using the music?",
    answer: "No attribution required! Use your AI-generated music without any credit or mention of Gruvi. It's your music to use as you wish.",
    detailedAnswer: "No attribution needed:\n\n**Your Music, Your Credit:**\n- Release under your artist name\n- No 'Made with Gruvi' requirements\n- No watermarks on audio\n- No forced credits\n\n**However, We Appreciate:**\n- Sharing your creations with us\n- Telling others about Gruvi\n- Leaving reviews and feedback\n- Following us on social media\n\nThis is completely optional - your music is fully yours with no strings attached."
  },

  // ============================================
  // PRICING & TOKENS
  // ============================================
  {
    category: "Pricing",
    question: "How does Gruvi's pricing work?",
    answer: "Gruvi offers three plans: Starter ($29/mo yearly), Scale ($69/mo yearly), and Content Engine ($149/mo yearly). Each includes monthly tokens for creating songs and cinematic videos, plus commercial licensing.",
    detailedAnswer: "Our pricing is designed to fit every creator:\n\n**Starter - $29/month (yearly) or $39/month**\n- 5,000 tokens/month\n- Standard audio quality\n- Commercial license\n- Perfect for getting started\n\n**Scale - $69/month (yearly) or $99/month**\n- 20,000 tokens/month\n- High-quality audio\n- Full commercial license\n- Best for content creators\n\n**Content Engine - $149/month (yearly) or $199/month**\n- 50,000 tokens/month\n- Highest-quality audio\n- Priority generation\n- Priority support\n- Best for professionals and agencies\n\n**Annual Plans:** Save up to 30% with yearly billing!"
  },
  {
    category: "Pricing",
    question: "How does the token system work?",
    answer: "Tokens are used to generate content: 1 song = 25-50 tokens, still image video = 200 tokens, cinematic video = 50 tokens per second, AI voiceover = 25 tokens, motion capture = 50 tokens per second. Tokens reset monthly with your subscription.",
    detailedAnswer: "Understanding tokens:\n\n**Token Costs:**\n- **Short Song (~30-90s):** 25 tokens\n- **Standard Song (~1.5-3min):** 50 tokens\n- **Still Image Video:** 200 tokens flat\n- **Cinematic Video:** 50 tokens per second (based on audio length)\n- **AI Voiceover:** 25 tokens\n- **Motion Capture/Character Swap:** 50 tokens per second\n- **Regeneration:** Same cost as original\n\n**Monthly Allowances:**\n- Starter: 5,000 tokens\n- Scale: 20,000 tokens\n- Content Engine: 50,000 tokens\n\n**Token Math Examples:**\n- 5,000 tokens = ~200 songs OR ~25 still videos OR ~200 voiceovers\n- 20,000 tokens = ~800 songs OR ~100 still videos OR ~800 voiceovers\n- Mix and match based on your needs\n\n**Tips:**\n- Tokens reset at billing cycle start\n- Unused tokens don't roll over\n- Top-up bundles available for purchase"
  },
  {
    category: "Pricing",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! Cancel anytime from your account settings. You'll keep access until the end of your billing period. No cancellation fees or hidden charges.",
    detailedAnswer: "Easy, no-hassle cancellation:\n\n**How to Cancel:**\n1. Go to Account Settings\n2. Click 'Manage Subscription'\n3. Select 'Cancel'\n4. Confirm\n\n**What Happens:**\n- Access continues until period ends\n- Downloaded content is yours forever\n- No cancellation fees\n- No penalties\n\n**Alternatives to Canceling:**\n- Downgrade to a smaller plan\n- Pause your subscription\n- Switch to annual for savings\n\nWe believe in earning your business monthly, not trapping you in contracts."
  },
  {
    category: "Pricing",
    question: "Is there a free trial without credit card?",
    answer: "Yes! Sign up with just your email to try Gruvi free. No credit card required to get started. Experience AI music generation before you subscribe.",
    detailedAnswer: "Our trial is designed to give you a real experience:\n\n**What's Included:**\n- Create songs to test the platform\n- Try different genres and styles\n- Experience the quality firsthand\n- No credit card needed\n\n**How to Start:**\n1. Visit Gruvi\n2. Click 'Sign Up'\n3. Enter your email\n4. Start creating immediately\n\n**After Trial:**\n- Choose the right plan for you\n- Keep songs created during trial\n- Upgrade seamlessly\n\nNo pressure, no commitment - just try it out."
  },

  // ============================================
  // PLATFORMS & USE CASES
  // ============================================
  {
    category: "Platforms",
    question: "Can I use Gruvi music on YouTube without copyright strikes?",
    answer: "Absolutely! All Gruvi-generated music is original and won't trigger Content ID claims. Monetize your videos freely without copyright worries.",
    detailedAnswer: "YouTube-safe music creation:\n\n**Why It's Safe:**\n- Music is 100% AI-generated original\n- No samples from existing songs\n- No Content ID matches\n- Created uniquely for you\n\n**Benefits for YouTubers:**\n- No copyright claims\n- Full monetization rights\n- No revenue sharing\n- No claim disputes to fight\n\n**Best Practices:**\n- Keep your Gruvi receipts\n- Use consistent account\n- Download high-quality versions\n- Perfect for intros, outros, background\n\nThousands of YouTubers use Gruvi safely every day."
  },
  {
    category: "Platforms",
    question: "Is Gruvi music safe for TikTok and Instagram Reels?",
    answer: "Yes! Create original music for TikTok, Instagram Reels, and Shorts without worrying about takedowns or muted audio. Your content stays up.",
    detailedAnswer: "Perfect for short-form content:\n\n**Platform Compatibility:**\n- TikTok: Full support\n- Instagram Reels: No issues\n- YouTube Shorts: Safe to use\n- Facebook Reels: Compatible\n- Snapchat: Works great\n\n**Advantages:**\n- Never get muted for copyright\n- Unique sounds no one else has\n- Stand out from trending audios\n- Create viral original sounds\n\n**Tips for Short-Form:**\n- Generate catchy, hook-driven songs\n- Create 30-60 second versions\n- Make instrumentals for voiceovers\n- Design sound effects and stingers"
  },
  {
    category: "Platforms",
    question: "Can I use Gruvi for podcast intros and background music?",
    answer: "Perfect for podcasts! Create custom intro music, outro themes, transition sounds, and background tracks. Professional audio quality for professional content.",
    detailedAnswer: "Gruvi is ideal for podcasters:\n\n**What You Can Create:**\n- Custom intro themes\n- Outro music\n- Segment transitions\n- Background ambient\n- Sound effects\n- Ad break stingers\n\n**Podcast-Specific Tips:**\n- Request 'podcast intro' in prompts\n- Keep intros 15-30 seconds\n- Use subtle background for talking segments\n- Create consistent theme across episodes\n\n**Quality:**\n- Broadcast-ready audio\n- No compression artifacts\n- Clean for voice mixing\n- Professional sound"
  },
  {
    category: "Platforms",
    question: "Can I create music for video games with Gruvi?",
    answer: "Yes! Generate game soundtracks, menu music, battle themes, ambient tracks, and victory jingles. Many indie developers use Gruvi for their game audio.",
    detailedAnswer: "Game audio creation:\n\n**What You Can Make:**\n- Main menu themes\n- Level/stage music\n- Boss battle tracks\n- Victory/defeat jingles\n- Ambient exploration music\n- Cutscene scores\n- Character themes\n\n**Game-Specific Features:**\n- Loopable tracks\n- Varying intensity levels\n- 8-bit and chiptune styles\n- Orchestral and cinematic\n- Atmospheric and ambient\n\n**Popular for:**\n- Indie game developers\n- Game jam projects\n- Mobile games\n- Visual novels\n- RPG Maker games"
  },

  // ============================================
  // QUALITY & TECHNICAL
  // ============================================
  {
    category: "Quality",
    question: "What audio quality does Gruvi produce?",
    answer: "Gruvi produces professional-quality audio. Starter gets standard quality, Pro gets high quality, and Premium gets studio-grade audio suitable for commercial releases.",
    detailedAnswer: "Audio quality by plan:\n\n**Starter Plan:**\n- Standard quality MP3\n- Good for personal use\n- Suitable for social media\n- Demo-quality output\n\n**Scale Plan:**\n- High-quality audio\n- Better bitrate and clarity\n- Great for YouTube and podcasts\n- Semi-professional standard\n\n**Content Engine Plan:**\n- Studio-grade quality\n- High-resolution audio\n- Streaming-platform ready\n- Professional release quality\n- Suitable for Spotify/Apple Music"
  },
  {
    category: "Quality",
    question: "Can I download stems or separate tracks?",
    answer: "Premium subscribers can access stem separation - download separate vocal, instrumental, drum, and bass tracks for advanced mixing and production work.",
    detailedAnswer: "Stem separation for professionals:\n\n**Available Stems:**\n- Vocals (isolated)\n- Instrumental (full backing)\n- Drums/Percussion\n- Bass\n- Other/Melodic elements\n\n**Use Cases:**\n- Custom mixing in your DAW\n- Creating remixes\n- Adjusting vocal levels\n- Extracting instrumentals\n- Professional post-production\n\n**How to Access:**\n- Content Engine plan required\n- Select 'Download Stems' option\n- Receive ZIP file with all tracks\n- Import into any DAW"
  },
  {
    category: "Quality",
    question: "How fast is AI music generation?",
    answer: "Most songs generate in 15-30 seconds. Music videos take 1-3 minutes depending on complexity. Scale and Content Engine users get priority generation for faster results.",
    detailedAnswer: "Generation speed breakdown:\n\n**Song Generation:**\n- Typical: 15-30 seconds\n- Complex prompts: Up to 1 minute\n- Priority queue (Scale/Content Engine): ~10 seconds\n\n**Video Generation:**\n- Still image: 1-2 minutes\n- Full animation: 2-5 minutes\n- With custom characters: +30 seconds\n\n**Factors Affecting Speed:**\n- Server load\n- Prompt complexity\n- Video style chosen\n- Subscription tier\n\n**Tips for Faster Results:**\n- Use clear, concise prompts\n- Generate during off-peak hours\n- Upgrade for priority access"
  },

  // ============================================
  // MOTION CAPTURE
  // ============================================
  {
    category: "Motion Capture",
    question: "What is Motion Capture and how does it work?",
    answer: "Motion Capture lets you transfer motion from any reference video to a new character or scene. Upload a video of someone dancing, talking, or moving, transform the first frame with AI, and the motion transfers to your new character.",
    detailedAnswer: "Motion Capture is one of the hottest AI video trends right now. Here's how it works:\n\n**The Process:**\n1. Upload a reference video (up to 30 seconds)\n2. Our AI extracts the first frame\n3. You transform the first frame with a new character/scene\n4. The motion from your video transfers to the new character\n\n**What Gets Transferred:**\n- Body movements and poses\n- Facial expressions and lip sync\n- Camera movement\n- Timing and rhythm\n\n**Use Cases:**\n- Turn yourself into any character\n- Create viral AI character swap content\n- Make brand mascots come to life\n- Transform dance videos with new characters"
  },
  {
    category: "Motion Capture",
    question: "What makes a good reference video for Motion Capture?",
    answer: "Use videos with a single person clearly visible, good lighting, upper or full body in frame, and movements that aren't too fast or complex. 10-30 second clips work best.",
    detailedAnswer: "Getting great Motion Capture results starts with the right reference video:\n\n**Ideal Reference Video:**\n- Single person clearly visible (not multiple people)\n- Upper body or full body in frame\n- Good lighting (not too dark)\n- Stable camera or smooth movements\n- 10-30 seconds in length\n\n**What Works Well:**\n- Dancing and choreography\n- Talking/presenting to camera\n- Simple gestures and expressions\n- Walking or basic movements\n\n**What to Avoid:**\n- Multiple people in frame\n- Fast, chaotic movements\n- Poor lighting or silhouettes\n- Extremely close-up face shots\n- Videos longer than 30 seconds\n\n**Pro Tip:** Record your own reference videos for the most control, or find clips on TikTok/YouTube with clear single-person shots."
  },
  {
    category: "Motion Capture",
    question: "How do I transform the first frame for Motion Capture?",
    answer: "After uploading your reference video, describe your new character or scene in the prompt. Keep the pose and position identical - only change the appearance. The AI will generate a transformed first frame that the motion applies to.",
    detailedAnswer: "The first frame transformation is crucial for good results:\n\n**How to Transform:**\n1. Upload your reference video\n2. The AI extracts the first frame automatically\n3. Describe what you want changed in the prompt\n4. Click 'Transform' to generate your new first frame\n\n**What You Can Change:**\n- The character (person to cartoon, man to woman, etc.)\n- The background/environment\n- Clothing and style\n- Art style (realistic to anime, etc.)\n\n**Critical Rule:** Keep the pose EXACTLY the same!\n- Same body position\n- Same arm placement\n- Same head angle\n- Same frame composition\n\n**Example Prompts:**\n- 'Replace the person with a cartoon character in the same pose'\n- 'Transform into a futuristic robot, keep exact same position'\n- 'Change to anime style character, same pose and framing'"
  },
  {
    category: "Motion Capture",
    question: "What's the difference between the Motion Capture modes?",
    answer: "Replace Character keeps the original background and swaps only the character. Replace Character + Environment creates an entirely new scene with both new character AND new background. Replace + Custom Prompt lets you describe your desired transformation in detail (videos must be 30 seconds or less).",
    detailedAnswer: "Understanding the three modes helps you get the right result:\n\n**Replace Character:**\n- Keeps the original background/environment\n- Only the character changes\n- Best for: Face swaps, character transformations\n- Example: Person dancing in a room → Cartoon dancing in same room\n\n**Replace Character + Environment:**\n- Creates entirely new scene\n- Both character AND background change\n- Best for: Complete scene transformations\n- Example: Person dancing in room → Robot dancing on Mars\n\n**Replace + Custom Prompt:**\n- Describe exactly what you want in a text prompt\n- Maximum creative control\n- Limited to videos 30 seconds or less\n- Best for: Specific artistic visions\n\n**When to Use Each:**\n- **Replace Character:** You like the original setting, just want a different character\n- **Replace Character + Environment:** You want to transport the motion to a completely different world\n- **Replace + Custom Prompt:** You have a specific transformation in mind\n\n**Pro Tip:** Replace Character often produces more stable results since the background stays consistent. Start with Replace Character if you're new to Motion Capture."
  },
  {
    category: "Motion Capture",
    question: "Should I change the voice after Motion Capture?",
    answer: "If you change the character's gender, age, or ethnicity significantly, yes! The original audio stays with the video, so use voice transformation to match your new character for a seamless result.",
    detailedAnswer: "Voice matching is key for believable Motion Capture videos:\n\n**When to Change Voice:**\n- Male to female character (or vice versa)\n- Adult to child character\n- Significant ethnicity/accent change\n- Human to creature/robot\n\n**When to Keep Original Voice:**\n- Similar character type\n- No dialogue in the video\n- Intentional contrast for humor\n\n**How Voice Change Works:**\n- Original audio is preserved in the video\n- Voice transformation keeps the delivery and timing\n- Only the voice characteristics change\n- Result: Lip sync stays perfect!\n\n**Pro Tip:** For videos without speech (just dancing or movement), you don't need voice change - just add new music!"
  },
  {
    category: "Motion Capture",
    question: "How long can Motion Capture videos be?",
    answer: "Up to 30 seconds for best quality. Shorter clips (10-15 seconds) often produce the most stable and viral-worthy results. Complex movements may work better in shorter segments.",
    detailedAnswer: "Video length affects quality and processing:\n\n**Recommended Lengths:**\n- **Optimal:** 10-15 seconds (best quality, fastest)\n- **Good:** 15-25 seconds (great for most content)\n- **Maximum:** 30 seconds (may have quality tradeoffs)\n\n**Why Shorter is Better:**\n- More stable motion tracking\n- Faster processing time\n- Less chance of drift or artifacts\n- Perfect for social media formats\n\n**For Longer Content:**\n- Break into multiple clips\n- Process each segment separately\n- Edit together in post-production\n\n**Social Media Sweet Spots:**\n- TikTok: 15-30 seconds\n- Instagram Reels: 15-30 seconds\n- YouTube Shorts: 15-60 seconds\n\n**Pro Tip:** The most viral Motion Capture videos are usually 10-20 seconds with a single impressive transformation."
  },
  {
    category: "Motion Capture",
    question: "How can I make my Motion Capture videos go viral?",
    answer: "Use trending audio, create unexpected transformations (the more surprising the better), keep it short (10-15 seconds), show before/after, and start with your most impressive moment as the hook.",
    detailedAnswer: "Tips from creators getting millions of views:\n\n**Content Strategy:**\n1. **Unexpected Transformations** - The more surprising, the more shares\n2. **Trending Audio** - Pair with popular songs or sounds\n3. **Show Before/After** - People love seeing the transformation\n4. **Hook in First 2 Seconds** - Start with the most impressive moment\n\n**What Goes Viral:**\n- Celebrity transformations\n- Pop culture characters\n- Extreme style changes (realistic to cartoon)\n- Dancing/movement that looks impossible for the character\n\n**Technical Tips:**\n- Clean, well-lit reference video\n- High-contrast transformation (don't be subtle!)\n- Perfect lip sync if there's dialogue\n- Smooth, not glitchy motion\n\n**Posting Strategy:**\n- Post when your audience is active\n- Use relevant hashtags\n- Engage with comments quickly\n- Cross-post to multiple platforms"
  },

  // ============================================
  // AI ASSETS & CHARACTERS
  // ============================================
  {
    category: "AI Assets",
    question: "What are AI Assets and why should I create them?",
    answer: "AI Assets are custom characters, products, or people you upload to Gruvi. They appear in your music videos and content with consistent likeness. Create assets of yourself, your brand mascot, or products for personalized content.",
    detailedAnswer: "AI Assets are your secret weapon for personalized content:\n\n**What You Can Create:**\n- **Characters:** Yourself, friends, fictional personas\n- **Products:** Your merchandise, brand items\n- **Mascots:** Brand characters with consistent look\n- **People:** Celebrities (for personal use), historical figures\n\n**Why Create AI Assets:**\n- Consistent character appearance across videos\n- Personalized content that stands out\n- Brand recognition and identity\n- Faster video creation (reuse assets)\n\n**Use Cases:**\n- Feature yourself in music videos\n- Put your product in promotional content\n- Create recurring characters for a series\n- Make personalized gifts featuring friends/family"
  },
  {
    category: "AI Assets",
    question: "How do I create an AI Asset with strong likeness?",
    answer: "Upload 3-5 clear photos from different angles, with good lighting, consistent appearance, and the face/subject clearly visible. Front-facing photos work best. Avoid sunglasses, hats, or heavy shadows.",
    detailedAnswer: "Getting great AI Asset likeness requires good reference images:\n\n**Photo Requirements:**\n- 3-5 images minimum (more = better likeness)\n- Clear, well-lit photos\n- Face clearly visible (no obstructions)\n- Consistent appearance across photos\n\n**Best Angles to Include:**\n- Front-facing (most important)\n- 3/4 angle (slight turn)\n- Profile (side view)\n- Different expressions if possible\n\n**What to Avoid:**\n- Sunglasses or hats covering face\n- Heavy shadows or backlighting\n- Blurry or low-resolution images\n- Different hairstyles/looks across photos\n- Group photos (confuses the AI)\n\n**Pro Tips:**\n- Selfies work great if well-lit\n- Consistent lighting across all photos\n- Neutral backgrounds help AI focus on subject\n- Include full body shots if you want body likeness too"
  },
  {
    category: "AI Assets",
    question: "How do I use AI Assets in music videos?",
    answer: "When creating a video, select your AI Asset from 'My AI Assets'. The character will appear in scenes matching your chosen art style. Mention them in your video prompt for better integration.",
    detailedAnswer: "Using AI Assets in your videos:\n\n**How to Include:**\n1. Go to Create Video\n2. Click 'Add AI Asset' or select from your assets\n3. Choose which asset(s) to include\n4. Generate your video\n\n**Prompt Tips for Better Results:**\n- Reference the character in your prompt\n- Describe what they're doing in the scene\n- Specify their role (main character, background, etc.)\n\n**Example Prompts:**\n- 'The character walking through a neon city at night'\n- 'Show the character performing on stage with dramatic lighting'\n- 'The character sitting at a cafe, looking thoughtful'\n\n**Art Style Integration:**\n- Your asset adapts to any art style\n- Anime, 3D, cinematic - likeness carries through\n- Each style interprets the character differently"
  },
  {
    category: "AI Assets",
    question: "Can I use AI Assets in Motion Capture videos?",
    answer: "Yes! AI Assets work great with Motion Capture. Upload your reference video, then use your AI Asset as the character in the transformed first frame for even stronger likeness.",
    detailedAnswer: "Combining AI Assets with Motion Capture:\n\n**The Power Combo:**\n- AI Asset provides consistent character likeness\n- Motion Capture provides realistic movement\n- Result: Your character moving naturally\n\n**How to Do It:**\n1. Create an AI Asset first (with multiple good photos)\n2. Go to Motion Capture\n3. Upload your reference video\n4. Select your AI Asset for the transformation\n5. The motion applies to your custom character\n\n**Why This Works Better:**\n- Stronger likeness than single-prompt transformations\n- Consistent character across multiple videos\n- AI already knows what your character looks like\n\n**Use Cases:**\n- Put yourself in dance videos\n- Make your mascot perform actions\n- Create a virtual presenter/influencer"
  },
  {
    category: "AI Assets",
    question: "How many AI Assets can I create?",
    answer: "All subscription plans include AI Asset creation. Starter allows 5 assets, Scale allows 20 assets, and Content Engine allows unlimited AI Assets. Delete unused assets to make room for new ones.",
    detailedAnswer: "AI Asset limits by plan:\n\n**Starter Plan:**\n- 5 AI Assets\n- Great for personal use and basic branding\n\n**Scale Plan:**\n- 20 AI Assets\n- Ideal for content creators with multiple characters\n\n**Content Engine Plan:**\n- Unlimited AI Assets\n- Perfect for agencies and heavy users\n\n**Managing Your Assets:**\n- Delete unused assets to free up slots\n- You can always recreate deleted assets\n- Assets persist month to month\n\n**Pro Tip:** Create fewer, higher-quality assets with more reference images rather than many assets with few images each."
  },

  // ============================================
  // VOICEOVERS & NARRATIVES
  // ============================================
  {
    category: "Voiceovers",
    question: "What are Voiceovers and how do I create them?",
    answer: "Voiceovers let you generate professional narration from text. Type or paste your script, choose a voice, and get studio-quality audio. Perfect for video narration, podcasts, and content without music.",
    detailedAnswer: "Create professional voiceovers in seconds:\n\n**How It Works:**\n1. Go to Create Voiceover\n2. Type or paste your script\n3. Choose a voice from our library\n4. Click Generate\n5. Download your audio\n\n**Voice Options:**\n- Male and female voices\n- Different ages and styles\n- Multiple languages\n- Various accents\n\n**Use Cases:**\n- Video narration and explainers\n- Podcast intros/outros\n- Audiobook creation\n- Presentation voiceovers\n- Documentary-style content\n\n**Pricing:**\n- ~20 tokens per voiceover\n- Cost-effective for narration\n- Great for text-heavy content"
  },
  {
    category: "Voiceovers",
    question: "How do I get natural-sounding voiceovers?",
    answer: "Write conversationally, use punctuation for pacing, break long sentences into shorter ones, and include natural pauses. Avoid ALL CAPS and excessive exclamation marks.",
    detailedAnswer: "Tips for natural-sounding voiceovers:\n\n**Writing for Voice:**\n- Write how you speak, not how you write\n- Use contractions (don't, can't, won't)\n- Keep sentences short and punchy\n- Read your script out loud before generating\n\n**Punctuation for Pacing:**\n- Commas = short pause\n- Periods = medium pause\n- Ellipses (...) = longer pause\n- Question marks = natural upturn\n\n**What to Avoid:**\n- ALL CAPS (sounds like shouting)\n- Too many exclamation marks!!!\n- Run-on sentences without breaks\n- Technical jargon that's hard to pronounce\n\n**Pro Tips:**\n- Add '[pause]' for deliberate pauses\n- Numbers often sound better spelled out\n- Test different voices for your content type\n- Formal voices for business, casual for social"
  },
  {
    category: "Voiceovers",
    question: "Can I use voiceovers in my music videos?",
    answer: "Yes! Create a voiceover, save it to My Voiceovers, then use it as audio in video creation. Perfect for documentary-style content, explainer videos, or adding narration to visual stories.",
    detailedAnswer: "Combining voiceovers with video:\n\n**How to Use Voiceovers in Videos:**\n1. Create your voiceover and save it\n2. Go to Create Video\n3. Select 'Upload Audio' instead of generating music\n4. Choose your voiceover from My Voiceovers\n5. Generate video to match your narration\n\n**Content Types:**\n- Documentary-style videos\n- Product explainer videos\n- Educational content\n- Story narration\n- Brand videos with voiceover\n\n**Tips:**\n- Write your script first, then create visuals\n- Time your scenes to match narration beats\n- Consider adding background music separately\n\n**Pro Workflow:**\n1. Write script\n2. Generate voiceover\n3. Create video with voiceover as audio\n4. Add subtle background music in post"
  },
  {
    category: "Voiceovers",
    question: "What's the difference between Voiceovers and AI Music with vocals?",
    answer: "Voiceovers are spoken narration from text - perfect for presentations, explainers, and podcasts. AI Music with vocals is sung music with instruments - perfect for songs and entertainment content.",
    detailedAnswer: "Understanding the difference:\n\n**Voiceovers (Narration):**\n- Spoken word, not sung\n- From your written script\n- No instruments or music\n- ~20 tokens per voiceover\n- Use for: Explainers, podcasts, presentations\n\n**AI Music (Songs):**\n- Sung vocals with lyrics\n- Full musical arrangement\n- Complete song production\n- 25-50 tokens per song\n- Use for: Entertainment, music videos, social content\n\n**When to Use Each:**\n- **Voiceover:** You need someone to speak your exact words\n- **Music:** You want a song with emotional impact\n\n**Combine Them:**\n- Use voiceover for intro, then music for main content\n- Create educational videos with narration + background music\n- Mix narration with musical breaks"
  },

  // ============================================
  // SPECIAL USE CASES
  // ============================================
  {
    category: "Special Uses",
    question: "Can I create birthday songs with Gruvi?",
    answer: "Yes! Create personalized birthday songs with the recipient's name. Perfect for unique birthday greetings, party music, and memorable gifts.",
    detailedAnswer: "Personalized birthday music:\n\n**How to Create:**\n- Prompt: 'Upbeat birthday song for [Name]'\n- Include their interests if desired\n- Choose their favorite music style\n- Add inside jokes or references\n\n**Ideas:**\n- Pop birthday anthem\n- Rock celebration song\n- Hip-hop birthday shoutout\n- Country tribute\n- Kids' party song\n\n**Make it Special:**\n- Add to a video slideshow\n- Play at their party\n- Send as a video message\n- Create a music video with their photos"
  },
  {
    category: "Special Uses",
    question: "Can I make wedding songs and first dance music?",
    answer: "Absolutely! Create custom wedding songs, first dance tracks, ceremony music, and reception playlist additions. Make your special day even more unique.",
    detailedAnswer: "Wedding music creation:\n\n**What to Create:**\n- First dance song\n- Ceremony processional\n- Reception entrance music\n- Father-daughter dance\n- Mother-son dance\n- Party playlist tracks\n\n**Personalization Ideas:**\n- Include your names\n- Reference your story\n- Mention your wedding date\n- Incorporate shared memories\n\n**Style Options:**\n- Romantic ballad\n- Upbeat celebration\n- Classical elegance\n- Modern pop\n- Country love song\n\n**Add a Video:**\n- Create a music video with your photos\n- Perfect for rehearsal dinners or receptions"
  },
  {
    category: "Special Uses",
    question: "Can I create kids' music and nursery rhymes?",
    answer: "Yes! Generate age-appropriate children's songs, educational music, lullabies, and fun nursery rhymes. Perfect for parents, teachers, and content creators.",
    detailedAnswer: "Children's music creation:\n\n**Types of Kids' Music:**\n- Educational songs (ABCs, counting)\n- Nursery rhymes\n- Lullabies\n- Fun dance songs\n- Story songs\n- Character themes\n\n**Safety Features:**\n- AI trained on appropriate content\n- Clean lyrics by default\n- Family-friendly output\n\n**Use Cases:**\n- Parents creating for their kids\n- Teachers for classroom use\n- YouTube kids channels\n- Children's apps and games\n- Daycare and preschool\n\n**Tips:**\n- Specify 'children's song' or 'kids music'\n- Request simple, repetitive lyrics\n- Ask for educational elements"
  },
  {
    category: "Special Uses",
    question: "Can I create workout and fitness music?",
    answer: "Create high-energy workout tracks, running playlists, yoga ambient music, and gym motivation anthems. Perfect for fitness content and personal training.",
    detailedAnswer: "Fitness music creation:\n\n**Workout Types:**\n- HIIT/High intensity\n- Running/Cardio\n- Weightlifting\n- Yoga/Stretching\n- Dance fitness\n- Cycling/Spin\n- Cooldown/Recovery\n\n**BPM Guidelines:**\n- Walking: 100-120 BPM\n- Jogging: 120-140 BPM\n- Running: 140-160 BPM\n- HIIT: 160-180 BPM\n- Yoga: 60-80 BPM\n\n**Use Cases:**\n- Personal workout playlists\n- Fitness YouTube channels\n- Gym class instructors\n- Training apps\n- Fitness influencers"
  },
  {
    category: "Special Uses",
    question: "Can I create holiday music for Christmas, Halloween, etc?",
    answer: "Yes! Generate seasonal music for any holiday - Christmas carols, Halloween spooky tracks, Thanksgiving songs, Valentine's Day love songs, and more.",
    detailedAnswer: "Seasonal and holiday music:\n\n**Holidays Supported:**\n- Christmas/Holiday Season\n- Halloween\n- Thanksgiving\n- Valentine's Day\n- Easter\n- New Year's Eve\n- Independence Day\n- Mother's/Father's Day\n- And many more!\n\n**International Holidays:**\n- Diwali\n- Chinese New Year\n- Hanukkah\n- Eid\n- Cinco de Mayo\n- Oktoberfest\n\n**Use Cases:**\n- Holiday content creation\n- Party playlists\n- Store/business background music\n- Personalized holiday greetings\n- Seasonal marketing"
  },

  // ============================================
  // TROUBLESHOOTING & SUPPORT
  // ============================================
  {
    category: "Support",
    question: "What if I don't like the song that was generated?",
    answer: "Simply regenerate! Each generation is unique. Refine your prompt for better results, or try completely different descriptions. Unlimited experimentation within your token balance.",
    detailedAnswer: "Getting the perfect result:\n\n**If You Don't Like It:**\n1. **Regenerate:** Click generate again for a new version\n2. **Refine Prompt:** Add more specific details\n3. **Change Approach:** Try different genre/mood\n4. **Iterate:** Each generation teaches you what works\n\n**Common Fixes:**\n- Too slow? Specify 'upbeat tempo'\n- Wrong mood? Add emotional descriptors\n- Wrong style? Name the genre explicitly\n- Wrong vocals? Specify male/female/style\n\n**Remember:**\n- Each regeneration uses tokens\n- Save prompts that work well\n- Small changes can make big differences"
  },
  {
    category: "Support",
    question: "How do I contact customer support?",
    answer: "Email us at support@gruvi.ai for any questions or issues. Premium subscribers get priority support with faster response times.",
    detailedAnswer: "Getting help when you need it:\n\n**Contact Methods:**\n- **Email:** support@gruvi.ai\n- Response within 24 hours\n- Premium: Priority queue\n\n**Self-Service:**\n- This FAQ section\n- In-app help guides\n- Video tutorials\n- Community forums (coming soon)\n\n**What to Include:**\n- Your account email\n- Description of issue\n- Screenshots if relevant\n- Browser/device info\n\n**Support Covers:**\n- Technical issues\n- Billing questions\n- Feature requests\n- Creative guidance"
  },
  {
    category: "Support",
    question: "Why did my song generation fail?",
    answer: "Generation can fail due to server load, connection issues, or complex prompts. Try again, simplify your prompt, or check your internet connection. Contact support if problems persist.",
    detailedAnswer: "Troubleshooting failed generations:\n\n**Common Causes:**\n- High server demand\n- Network interruption\n- Browser issues\n- Overly complex prompt\n\n**Solutions:**\n1. Wait a moment and try again\n2. Refresh the page\n3. Simplify your prompt\n4. Check internet connection\n5. Try a different browser\n6. Clear browser cache\n\n**If Problem Persists:**\n- Contact support with details\n- Include the prompt you used\n- Note any error messages\n- Tokens refunded for failed generations"
  },
  {
    category: "Support",
    question: "Can I get a refund?",
    answer: "We offer refunds within 7 days of purchase if you haven't used your tokens. Contact support to request a refund. After 7 days or token usage, we cannot offer refunds.",
    detailedAnswer: "Refund policy details:\n\n**Eligible for Refund:**\n- Request within 7 days of purchase\n- Haven't used tokens\n- First-time request\n\n**Not Eligible:**\n- After 7 days\n- Tokens have been used\n- Multiple refund requests\n- Abuse of refund policy\n\n**How to Request:**\n1. Email support@gruvi.ai\n2. Include your account email\n3. State reason for refund\n4. Wait for confirmation\n\n**Processing Time:**\n- 3-5 business days\n- Original payment method"
  },

  // ============================================
  // COMPARISON & ALTERNATIVES
  // ============================================
  {
    category: "Comparison",
    question: "How is Gruvi different from other AI music generators?",
    answer: "Gruvi combines music AND video generation in one platform. We offer 100+ genre and mood combinations, 24 languages, 15 art styles, and custom characters - all with commercial licensing.",
    detailedAnswer: "What makes Gruvi unique:\n\n**All-in-One Platform:**\n- Music + video creation together\n- No need for multiple subscriptions\n- Seamless creative workflow\n\n**Creative Range:**\n- 100+ genre and mood combinations (more than competitors)\n- 24+ languages\n- 15 art styles\n- Custom character support\n\n**Business Value:**\n- Full commercial licensing\n- No hidden royalty fees\n- Competitive pricing\n- Generous token allowances\n\n**Quality:**\n- State-of-the-art AI\n- Professional audio output\n- Stunning video production"
  },
  {
    category: "Comparison",
    question: "Is Gruvi better than hiring a music producer?",
    answer: "Gruvi is faster and more affordable for quick projects. For complex productions, professional producers offer nuanced expertise. Many creators use both - Gruvi for rapid content, producers for major releases.",
    detailedAnswer: "Gruvi vs. Traditional Production:\n\n**Gruvi Advantages:**\n- Instant results (seconds vs. weeks)\n- Much lower cost ($29-149/mo vs. $500+/song)\n- Unlimited iterations\n- No scheduling or communication delays\n- Available 24/7\n\n**Producer Advantages:**\n- Nuanced creative direction\n- Industry connections\n- Live instruments possible\n- Complex arrangements\n- Mixing/mastering expertise\n\n**Best of Both:**\n- Use Gruvi for demos and concepts\n- Rapid content creation\n- Reserve producers for major releases\n- Let Gruvi handle volume, producers handle flagship"
  },
  {
    category: "Comparison",
    question: "Can Gruvi replace royalty-free music libraries?",
    answer: "Yes! Unlike libraries with overused tracks, every Gruvi song is unique and created just for you. No more hearing 'your' music in competitors' videos.",
    detailedAnswer: "Gruvi vs. Music Libraries:\n\n**Problems with Libraries:**\n- Same tracks used by thousands\n- Recognize music in other content\n- Limited to existing catalog\n- Licensing confusion\n- Monthly fees for limited selection\n\n**Gruvi Benefits:**\n- Every song is 100% unique\n- Created specifically for you\n- Unlimited variety\n- Clear licensing\n- Custom to your needs\n\n**When Libraries Still Work:**\n- Need something in seconds\n- Very specific existing track\n- One-time small project\n\nFor regular creators, Gruvi offers better value and uniqueness."
  }
];

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accordionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { currentSong } = useAudioPlayer();
  
  // Get unique categories
  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  // Function to create a URL-friendly slug from a question
  const createSlug = useCallback((question: string): string => {
    return question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, []);

  // Handle hash changes and expand the corresponding accordion
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      const index = faqItems.findIndex(item => createSlug(item.question) === hash);
      if (index !== -1) {
        setExpandedPanel(createSlug(faqItems[index].question));
        // Don't filter by category when expanding - just show the question in context
        if (accordionRefs.current[index]) {
        setTimeout(() => {
            accordionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          }
      }
    }
  }, [location.hash, createSlug]);

  // Function to handle accordion change
  const handleAccordionChange = useCallback((panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
    if (isExpanded) {
      navigate(`/faq#${panel}`, { replace: true });
    }
  }, [navigate]);

  // Function to handle read more click
  const handleReadMore = useCallback((question: string) => {
    const slug = createSlug(question);
    navigate(`/faq/${slug}`);
  }, [navigate, createSlug]);

  // Create breadcrumb data for structured data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://gruvimusic.com/' },
    { name: 'FAQ', url: 'https://gruvimusic.com/faq' }
  ];

  // Filter FAQs by category
  const filteredFAQs = activeCategory 
    ? faqItems.filter(item => item.category === activeCategory)
    : faqItems;

  // Always show the full-page standalone style (Fable-like)
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0D0D0F 0%, #0F0F14 50%, #0D0D0F 100%)',
      position: 'relative',
      pb: currentSong ? { xs: 10, sm: 12, md: 14 } : 0,
      transition: 'padding-bottom 0.3s ease-out',
    }}>
      {/* Subtle background gradient */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SEO
        title="FAQ - AI Music & Video Generator Questions Answered | Gruvi"
        description="Get answers about Gruvi's AI music generator, music video creator, and promo video maker. Learn about creating product videos, Airbnb promos, brand videos, pricing, and commercial licensing."
        keywords="Gruvi FAQ, AI music generator questions, music video creator help, AI promo video, product video generator, Airbnb video maker, AI music commercial license, music generation tutorial, Gruvi pricing, AI song generator guide, e-commerce video"
        ogTitle="Frequently Asked Questions - Gruvi AI Music & Video Generator"
        ogDescription="Everything you need to know about creating AI-generated music, music videos, and promotional videos with Gruvi. Products, Airbnbs, brands, pricing, licensing, and more."
        ogType="website"
        ogUrl="https://gruvimusic.com/faq"
        canonicalUrl="https://gruvimusic.com/faq"
        twitterTitle="FAQ - Gruvi AI Music & Video Generator"
        twitterDescription="Get answers about Gruvi's AI music generator, video creator, and promo video maker for products, Airbnbs, and brands."
        structuredData={[
          createFAQStructuredData(faqItems),
          createBreadcrumbStructuredData(breadcrumbData)
        ]}
      />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none',
              '&:hover': { color: '#3B82F6' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Gruvi
          </Link>
          <Typography sx={{ fontWeight: 500, color: '#FFFFFF' }}>FAQ</Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            mb: 4,
            color: 'rgba(255,255,255,0.7)',
            '&:hover': {
              background: 'rgba(255,255,255,0.05)',
              color: '#FFFFFF',
            }
          }}
        >
          Back to Home
        </Button>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#FFFFFF',
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
            Everything you need to know about creating AI-generated music and music videos with Gruvi.
          </Typography>
        </Box>

        {/* Category Filter */}
        {/* Category Filters - Two Rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center', mb: 5 }}>
          {/* Row 1 */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="text"
              onClick={() => setActiveCategory(null)}
              sx={{
                borderRadius: '100px',
                textTransform: 'none',
                px: 3,
                py: 1,
                fontWeight: 500,
                transition: 'all 0.2s ease',
                ...(activeCategory === null ? {
                  backgroundColor: '#007AFF',
                  color: '#fff',
                  boxShadow: 'none',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: '#007AFF',
                    boxShadow: 'none',
                  }
                } : {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  }
                })
              }}
            >
              All Questions
            </Button>
            {categories.slice(0, 5).map(category => (
              <Button
                key={category}
                variant="text"
                onClick={() => setActiveCategory(category)}
                sx={{
                  borderRadius: '100px',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  ...(activeCategory === category ? {
                    backgroundColor: '#007AFF',
                    color: '#fff',
                    boxShadow: 'none',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#007AFF',
                      boxShadow: 'none',
                    }
                  } : {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.12)',
                    }
                  })
                }}
              >
                {category}
              </Button>
            ))}
          </Box>
          {/* Row 2 */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            {categories.slice(5).map(category => (
              <Button
                key={category}
                variant="text"
                onClick={() => setActiveCategory(category)}
                sx={{
                  borderRadius: '100px',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  ...(activeCategory === category ? {
                    backgroundColor: '#007AFF',
                    color: '#fff',
                    boxShadow: 'none',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#007AFF',
                      boxShadow: 'none',
                    }
                  } : {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.12)',
                    }
                  })
                }}
              >
                {category}
              </Button>
            ))}
          </Box>
        </Box>

        {/* FAQ Count */}
        <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', mb: 4, fontSize: '0.9rem' }}>
          Showing {filteredFAQs.length} of {faqItems.length} questions
        </Typography>

        {/* FAQ Accordions */}
        <Box
          component="section"
          sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {filteredFAQs.map((item, index) => {
            const panelId = createSlug(item.question);
            const globalIndex = faqItems.findIndex(faq => faq.question === item.question);
            return (
            <Accordion
              key={index}
              component="article"
              ref={(el: HTMLDivElement | null) => {
                  accordionRefs.current[globalIndex] = el;
              }}
                id={panelId}
                expanded={expandedPanel === panelId}
                onChange={handleAccordionChange(panelId)}
              sx={{
                background: 'transparent',
                borderBottom: index !== filteredFAQs.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                boxShadow: 'none',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  margin: 0,
                  background: 'rgba(59, 130, 246, 0.05)',
                },
              }}
            >
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#3B82F6' }} />}
                aria-label={`Toggle answer for ${item.question}`}
                sx={{
                    padding: '20px 24px',
                  '& .MuiAccordionSummary-content': {
                      margin: 0,
                      flexDirection: 'column',
                      gap: 0.5,
                    },
                    transition: 'background 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.02)',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: '#3B82F6',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.category}
                  </Typography>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                      fontWeight: 600,
                      color: '#FFFFFF',
                      fontSize: { xs: '1rem', md: '1.1rem' }
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
                <AccordionDetails sx={{ padding: '0 24px 24px 24px' }}>
                <Typography
                  variant="body1"
                  component="p"
                  sx={{
                      color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.8,
                    mb: 2
                  }}
                >
                  {item.answer}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                      variant="text"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => handleReadMore(item.question)}
                    sx={{
                      textTransform: 'none',
                        fontWeight: 500,
                        color: '#3B82F6',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(59, 130, 246, 0.1)',
                          transform: 'translateX(4px)',
                        }
                      }}
                    >
                      Read Full Answer
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
            );
          })}
        </Box>

        {/* CTA Footer */}
        <Box
          sx={{
            mt: 6,
            p: 5,
            borderRadius: '20px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#FFFFFF', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            Still Have Questions?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255,255,255,0.6)', fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Can't find what you're looking for? Our support team is here to help.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
              size="large"
              onClick={() => window.location.href = 'mailto:support@gruvi.ai'}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                borderRadius: '100px',
                textTransform: 'none',
                fontWeight: 600,
                background: '#3B82F6',
                color: '#FFFFFF',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#2563EB',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                }
              }}
            >
              Contact Support
            </Button>
            <Button
              variant="outlined"
            size="large"
            onClick={() => navigate('/')}
            endIcon={<ArrowForwardIcon />}
            sx={{
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                borderRadius: '100px',
              textTransform: 'none',
                fontWeight: 600,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderColor: '#3B82F6',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Start Creating
          </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQPage; 
