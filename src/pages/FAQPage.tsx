import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  useTheme,
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

export const faqItems = [
  // ============================================
  // GETTING STARTED
  // ============================================
  {
    category: "Getting Started",
    question: "What is Gruvi AI Music Generator?",
    answer: "Gruvi is an AI-powered platform that creates original music and music videos from text descriptions. Simply describe the song you want and our AI generates professional-quality music in seconds.",
    detailedAnswer: "Gruvi is a revolutionary AI-powered platform that transforms how you create music and music videos. Using cutting-edge artificial intelligence, Gruvi allows you to generate original, royalty-free songs simply by describing what you want. Whether you want a catchy pop song, an emotional ballad, or a high-energy EDM track, just type your idea and our AI creates a complete song with vocals, instrumentals, and lyrics.\n\nBut Gruvi goes beyond just music generation. You can also turn your songs into stunning animated music videos in 16 different art styles - from 3D cartoon to anime to photorealistic. Add your own characters using reference images, and watch as AI brings your vision to life. It's the complete creative studio for musicians, content creators, and anyone who wants to make music without needing technical skills."
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

  // ============================================
  // MUSIC CREATION
  // ============================================
  {
    category: "Music Creation",
    question: "What music genres can Gruvi create?",
    answer: "Gruvi supports 60+ genres including Pop, Rock, Hip-Hop, Jazz, Classical, Electronic, R&B, Country, Latin, K-Pop, Afrobeats, Lo-Fi, Metal, Indie, Folk, and many more.",
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
    answer: "By default, Gruvi creates songs around 2-3 minutes in length - the perfect duration for streaming and social media. Custom lengths are available on higher plans.",
    detailedAnswer: "Song duration options vary by use case:\n\n**Default Length:**\n- 2-3 minutes: Ideal for streaming platforms, social media, and general use\n\n**Short Form:**\n- 30-60 seconds: Perfect for TikTok, Instagram Reels, YouTube Shorts, ads, and intros\n\n**Extended Versions:**\n- 3-5 minutes: Available on Pro and Premium plans for longer compositions\n\n**Custom Lengths:**\n- Premium users can specify exact durations\n- Great for film scoring, podcasts, and specific use cases\n\nMost songs are optimized for modern streaming, where 2-3 minutes is the sweet spot for listener engagement."
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
    answer: "After generating a song, select 'Create Video' and choose from 16 art styles including anime, 3D cartoon, cinematic, and more. Upload character references if desired, then generate.",
    detailedAnswer: "Creating music videos with Gruvi is seamless:\n\n**Step 1: Generate Your Song**\nStart by creating your AI-generated track\n\n**Step 2: Choose Your Art Style**\nSelect from 16 distinct visual styles:\n- 3D Cartoon\n- Anime/Animation\n- Photorealistic\n- Watercolor\n- Pixel Art\n- Cyberpunk\n- And 10 more!\n\n**Step 3: Add Characters (Optional)**\nUpload 1-3 reference images of people or characters to include in your video\n\n**Step 4: Generate**\nOur AI creates a fully animated music video synchronized to your song\n\n**Video Types:**\n- **Still Image Videos:** More affordable, single animated scene\n- **Full Animation:** Complete motion and scene changes"
  },
  {
    category: "Music Videos",
    question: "What art styles are available for music videos?",
    answer: "Choose from 16 styles: 3D Cartoon, Anime, Photorealistic, Watercolor, Pixel Art, Cyberpunk, Comic Book, Claymation, Oil Painting, Sketch, Minimalist, and more.",
    detailedAnswer: "Our 16 art styles cover every aesthetic:\n\n**Animation Styles:**\n- 3D Cartoon (Pixar-like)\n- Anime/Manga\n- 2D Classic Animation\n- Claymation/Stop Motion\n\n**Artistic Styles:**\n- Watercolor\n- Oil Painting\n- Sketch/Pencil\n- Comic Book/Graphic Novel\n\n**Modern/Digital:**\n- Cyberpunk/Neon\n- Pixel Art/8-Bit\n- Vaporwave/Retro\n- Minimalist/Abstract\n\n**Realistic:**\n- Photorealistic\n- Cinematic\n- Film Noir\n- Vintage/Retro\n\nEach style is optimized to create stunning visuals that match your music's mood and genre."
  },
  {
    category: "Music Videos",
    question: "Can I add myself or custom characters to music videos?",
    answer: "Yes! Upload reference photos of yourself, friends, or any character. The AI will incorporate them into your music video while maintaining the chosen art style.",
    detailedAnswer: "Custom character support is one of Gruvi's most powerful features:\n\n**How It Works:**\n1. Upload 1-3 clear reference images\n2. Our AI learns the appearance\n3. Characters appear in your video matching your art style\n\n**Use Cases:**\n- Feature yourself as the star\n- Create personalized birthday videos\n- Make branded content with mascots\n- Create gifts featuring friends/family\n- Design virtual avatars\n\n**Best Practices:**\n- Use clear, well-lit photos\n- Front-facing images work best\n- Multiple angles improve accuracy\n- Characters adapt to any art style"
  },
  {
    category: "Music Videos",
    question: "What's the difference between still image and animated videos?",
    answer: "Still image videos feature a single animated scene (40 tokens), while full animated videos include motion, scene changes, and dynamic effects (200 tokens).",
    detailedAnswer: "Choose the video type that fits your needs:\n\n**Still Image Videos (40 tokens):**\n- Single beautiful scene\n- Subtle motion effects (parallax, particles)\n- Faster to generate\n- More affordable\n- Great for lyric videos, social posts\n\n**Full Animated Videos (200 tokens):**\n- Multiple scenes and transitions\n- Full character motion\n- Dynamic camera movements\n- Scene changes matching the music\n- Professional music video quality\n\n**When to Use Each:**\n- **Still:** Social media clips, quick content, testing ideas\n- **Animated:** Professional releases, YouTube, presentations"
  },

  // ============================================
  // LICENSING & COMMERCIAL USE
  // ============================================
  {
    category: "Licensing",
    question: "Can I use Gruvi music commercially?",
    answer: "Yes! Pro and Premium subscribers get a full commercial license. Use your music for YouTube, TikTok, podcasts, games, films, and any commercial project royalty-free.",
    detailedAnswer: "Commercial licensing is one of Gruvi's standout features:\n\n**What's Included (Pro/Premium):**\n- Full commercial license for all generated music\n- Use in YouTube videos, TikTok, Instagram, all platforms\n- Include in podcasts, games, films, advertisements\n- Stream on Spotify, Apple Music, and other platforms\n- No royalty payments ever\n- No attribution required\n- Monetize your content freely\n\n**What You Can Do:**\n- Release songs commercially as an artist\n- Use as background music in content\n- Create jingles and ads\n- License to others (Premium)\n- Build a music catalog"
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
    answer: "Yes! Pro and Premium users can distribute their AI-generated music to Spotify, Apple Music, and all major streaming platforms. The music is yours to release.",
    detailedAnswer: "Distribute your AI music anywhere:\n\n**Supported Platforms:**\n- Spotify\n- Apple Music\n- Amazon Music\n- YouTube Music\n- Tidal\n- Deezer\n- SoundCloud\n- Bandcamp\n- All major streaming services\n\n**How to Distribute:**\n1. Download your songs from Gruvi\n2. Use a distribution service (DistroKid, TuneCore, etc.)\n3. Upload and release\n4. Keep 100% of your royalties\n\n**Requirements:**\n- Pro or Premium subscription\n- Download high-quality audio\n- Your name as the artist"
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
    answer: "Gruvi offers three plans: Starter ($6.99/mo), Pro ($12.99/mo), and Premium ($24.99/mo). Each includes monthly tokens for creating songs and videos, plus commercial licensing.",
    detailedAnswer: "Our pricing is designed to fit every creator:\n\n**Starter - $6.99/month**\n- 500 tokens (~25 songs)\n- Standard audio quality\n- Commercial license\n- Perfect for hobbyists\n\n**Pro - $12.99/month**\n- 1,200 tokens (~60 songs)\n- High-quality audio\n- Full commercial license\n- Priority generation\n- Best for content creators\n\n**Premium - $24.99/month**\n- 2,500 tokens (~125 songs)\n- Studio-quality audio\n- Stem separation\n- Priority support\n- Best for professionals\n\n**Annual Plans:** Save up to 30% with yearly billing!"
  },
  {
    category: "Pricing",
    question: "How does the token system work?",
    answer: "Tokens are used to generate content: 1 song = 20 tokens, still image video = 40 tokens, full animated video = 200 tokens. Tokens reset monthly with your subscription.",
    detailedAnswer: "Understanding tokens:\n\n**Token Costs:**\n- **1 Song:** 20 tokens\n- **Still Image Video:** 40 tokens\n- **Full Animated Video:** 200 tokens\n- **Regeneration:** Same cost as original\n\n**Monthly Allowances:**\n- Starter: 500 tokens\n- Pro: 1,200 tokens\n- Premium: 2,500 tokens\n\n**Token Math Examples:**\n- 500 tokens = 25 songs OR 12 still videos OR 2 animated videos\n- 1,200 tokens = 60 songs OR 30 still videos OR 6 animated videos\n- Mix and match based on your needs\n\n**Tips:**\n- Tokens reset at billing cycle start\n- Unused tokens don't roll over\n- Top-up packs available if needed"
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
    detailedAnswer: "Audio quality by plan:\n\n**Starter Plan:**\n- Standard quality MP3\n- Good for personal use\n- Suitable for social media\n- Demo-quality output\n\n**Pro Plan:**\n- High-quality audio\n- Better bitrate and clarity\n- Great for YouTube and podcasts\n- Semi-professional standard\n\n**Premium Plan:**\n- Studio-grade quality\n- High-resolution audio\n- Streaming-platform ready\n- Professional release quality\n- Suitable for Spotify/Apple Music"
  },
  {
    category: "Quality",
    question: "Can I download stems or separate tracks?",
    answer: "Premium subscribers can access stem separation - download separate vocal, instrumental, drum, and bass tracks for advanced mixing and production work.",
    detailedAnswer: "Stem separation for professionals:\n\n**Available Stems:**\n- Vocals (isolated)\n- Instrumental (full backing)\n- Drums/Percussion\n- Bass\n- Other/Melodic elements\n\n**Use Cases:**\n- Custom mixing in your DAW\n- Creating remixes\n- Adjusting vocal levels\n- Extracting instrumentals\n- Professional post-production\n\n**How to Access:**\n- Premium plan required\n- Select 'Download Stems' option\n- Receive ZIP file with all tracks\n- Import into any DAW"
  },
  {
    category: "Quality",
    question: "How fast is AI music generation?",
    answer: "Most songs generate in 15-30 seconds. Music videos take 1-3 minutes depending on complexity. Pro and Premium users get priority generation for faster results.",
    detailedAnswer: "Generation speed breakdown:\n\n**Song Generation:**\n- Typical: 15-30 seconds\n- Complex prompts: Up to 1 minute\n- Priority queue (Pro/Premium): ~10 seconds\n\n**Video Generation:**\n- Still image: 1-2 minutes\n- Full animation: 2-5 minutes\n- With custom characters: +30 seconds\n\n**Factors Affecting Speed:**\n- Server load\n- Prompt complexity\n- Video style chosen\n- Subscription tier\n\n**Tips for Faster Results:**\n- Use clear, concise prompts\n- Generate during off-peak hours\n- Upgrade for priority access"
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
    answer: "Gruvi combines music AND video generation in one platform. We offer 60+ genres, 24 languages, 16 video styles, and custom characters - all with commercial licensing.",
    detailedAnswer: "What makes Gruvi unique:\n\n**All-in-One Platform:**\n- Music + video creation together\n- No need for multiple subscriptions\n- Seamless creative workflow\n\n**Creative Range:**\n- 60+ genres (more than competitors)\n- 24+ languages\n- 16 video art styles\n- Custom character support\n\n**Business Value:**\n- Full commercial licensing\n- No hidden royalty fees\n- Competitive pricing\n- Generous token allowances\n\n**Quality:**\n- State-of-the-art AI\n- Professional audio output\n- Stunning video production"
  },
  {
    category: "Comparison",
    question: "Is Gruvi better than hiring a music producer?",
    answer: "Gruvi is faster and more affordable for quick projects. For complex productions, professional producers offer nuanced expertise. Many creators use both - Gruvi for rapid content, producers for major releases.",
    detailedAnswer: "Gruvi vs. Traditional Production:\n\n**Gruvi Advantages:**\n- Instant results (seconds vs. weeks)\n- Much lower cost ($7-25/mo vs. $500+/song)\n- Unlimited iterations\n- No scheduling or communication delays\n- Available 24/7\n\n**Producer Advantages:**\n- Nuanced creative direction\n- Industry connections\n- Live instruments possible\n- Complex arrangements\n- Mixing/mastering expertise\n\n**Best of Both:**\n- Use Gruvi for demos and concepts\n- Rapid content creation\n- Reserve producers for major releases\n- Let Gruvi handle volume, producers handle flagship"
  },
  {
    category: "Comparison",
    question: "Can Gruvi replace royalty-free music libraries?",
    answer: "Yes! Unlike libraries with overused tracks, every Gruvi song is unique and created just for you. No more hearing 'your' music in competitors' videos.",
    detailedAnswer: "Gruvi vs. Music Libraries:\n\n**Problems with Libraries:**\n- Same tracks used by thousands\n- Recognize music in other content\n- Limited to existing catalog\n- Licensing confusion\n- Monthly fees for limited selection\n\n**Gruvi Benefits:**\n- Every song is 100% unique\n- Created specifically for you\n- Unlimited variety\n- Clear licensing\n- Custom to your needs\n\n**When Libraries Still Work:**\n- Need something in seconds\n- Very specific existing track\n- One-time small project\n\nFor regular creators, Gruvi offers better value and uniqueness."
  }
];

const FAQPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const accordionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
    { name: 'Gruvi', url: 'https://gruvi.ai/' },
    { name: 'FAQ', url: 'https://gruvi.ai/faq' }
  ];

  // Filter FAQs by category
  const filteredFAQs = activeCategory 
    ? faqItems.filter(item => item.category === activeCategory)
    : faqItems;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: '#fff',
      position: 'relative',
    }}>
      {/* Subtle background gradient */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at top, rgba(0, 122, 255, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SEO
        title="FAQ - AI Music Generator Questions Answered | Gruvi"
        description="Get answers to all your questions about Gruvi's AI music generator and music video creator. Learn about music generation, video creation, pricing, commercial licensing, and how to get started."
        keywords="Gruvi FAQ, AI music generator questions, music video creator help, AI music commercial license, music generation tutorial, Gruvi pricing, AI song generator guide"
        ogTitle="Frequently Asked Questions - Gruvi AI Music Generator"
        ogDescription="Everything you need to know about creating AI-generated music and music videos with Gruvi. Pricing, licensing, features, and more."
        ogType="website"
        ogUrl="https://gruvi.ai/faq"
        twitterTitle="FAQ - Gruvi AI Music Generator"
        twitterDescription="Get answers to all your questions about Gruvi's AI music generator and music video creator."
        structuredData={[
          createFAQStructuredData(faqItems),
          createBreadcrumbStructuredData(breadcrumbData)
        ]}
      />
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            component={RouterLink}
            to="/"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: '#86868B',
              textDecoration: 'none',
              '&:hover': { color: '#007AFF' }
            }}
          >
            <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
            Gruvi
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>FAQ</Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ 
            mb: 4,
            color: '#1D1D1F',
            '&:hover': {
              background: 'rgba(0,0,0,0.05)',
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
              color: '#1D1D1F',
              mb: 2
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography sx={{ color: '#86868B', fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
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
                  background: 'rgba(255,255,255,0.98)',
                  color: '#007AFF',
                  border: '1px solid rgba(0,122,255,0.3)',
                  boxShadow: '0 4px 16px rgba(0,122,255,0.15), 0 2px 4px rgba(0,0,0,0.06), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                  '&:hover': { 
                    background: '#fff',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(0,122,255,0.2), 0 3px 6px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                  }
                } : {
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  color: '#1D1D1F',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
                  '&:hover': { 
                    background: '#fff',
                    borderColor: 'rgba(0,122,255,0.3)',
                    color: '#007AFF',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)',
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
                    background: 'rgba(255,255,255,0.98)',
                    color: '#007AFF',
                    border: '1px solid rgba(0,122,255,0.3)',
                    boxShadow: '0 4px 16px rgba(0,122,255,0.15), 0 2px 4px rgba(0,0,0,0.06), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                    '&:hover': { 
                      background: '#fff',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(0,122,255,0.2), 0 3px 6px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                    }
                  } : {
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    color: '#1D1D1F',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
                    '&:hover': { 
                      background: '#fff',
                      borderColor: 'rgba(0,122,255,0.3)',
                      color: '#007AFF',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)',
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
                    background: 'rgba(255,255,255,0.98)',
                    color: '#007AFF',
                    border: '1px solid rgba(0,122,255,0.3)',
                    boxShadow: '0 4px 16px rgba(0,122,255,0.15), 0 2px 4px rgba(0,0,0,0.06), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                    '&:hover': { 
                      background: '#fff',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(0,122,255,0.2), 0 3px 6px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.05)',
                    }
                  } : {
                    background: 'rgba(255,255,255,0.9)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    color: '#1D1D1F',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
                    '&:hover': { 
                      background: '#fff',
                      borderColor: 'rgba(0,122,255,0.3)',
                      color: '#007AFF',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)',
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
        <Typography sx={{ textAlign: 'center', color: '#86868B', mb: 4, fontSize: '0.9rem' }}>
          Showing {filteredFAQs.length} of {faqItems.length} questions
        </Typography>

        {/* FAQ Accordions */}
        <Paper 
          elevation={0} 
          component="section"
          sx={{ 
            p: { xs: 2, md: 3 }, 
            borderRadius: 3,
            backgroundColor: 'transparent'
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
                mb: 2,
                  borderRadius: '16px !important',
                '&:before': {
                  display: 'none',
                },
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  },
                  '&.Mui-expanded': {
                    boxShadow: '0 8px 24px rgba(0,122,255,0.1)',
                    border: '1px solid rgba(0,122,255,0.15)',
                }
              }}
            >
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#007AFF' }} />}
                aria-label={`Toggle answer for ${item.question}`}
                sx={{
                    px: 3,
                  '& .MuiAccordionSummary-content': {
                      my: 2,
                      flexDirection: 'column',
                      gap: 0.5,
                    }
                  }}
                >
                  <Typography 
                    sx={{ 
                      fontSize: '0.75rem',
                      color: '#007AFF',
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
                      fontWeight: 500,
                      color: '#1D1D1F',
                      fontSize: { xs: '1rem', md: '1.1rem' }
                  }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography 
                  variant="body1" 
                  component="p"
                  sx={{ 
                      color: '#86868B',
                    lineHeight: 1.7,
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
                        color: '#007AFF',
                        '&:hover': {
                          background: 'rgba(0,122,255,0.05)',
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
        </Paper>

        {/* CTA Footer */}
        <Paper 
          elevation={0} 
          sx={{ 
            mt: 6, 
            p: 5, 
            borderRadius: 4,
            background: 'linear-gradient(145deg, rgba(0,122,255,0.05), rgba(0,122,255,0.1))',
            border: '1px solid rgba(0,122,255,0.15)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1D1D1F', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            Still Have Questions?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#86868B', fontSize: { xs: '1rem', md: '1.1rem' } }}>
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
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                background: 'rgba(0,0,0,0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#000',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
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
                borderRadius: '12px',
              textTransform: 'none',
                fontWeight: 600,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.08)',
                color: '#1D1D1F',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#fff',
                  borderColor: 'rgba(0,122,255,0.3)',
                  color: '#007AFF',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1)',
                }
              }}
            >
              Start Creating
          </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default FAQPage; 
