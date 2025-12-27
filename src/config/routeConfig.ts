// Route configuration for SEO-optimized pages
export interface RouteConfig {
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  breadcrumbName: string;
  // Hero section content
  heroTagline: string; // Text after "Gruvi:" 
  heroHeading: string; // Main heading (can include line break with \n)
  heroSubtext: string; // Description below heading
  examplePrompts: string[]; // 4 example prompts
}

// =============================================================================
// GENRE DATA
// =============================================================================
const genreData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'pop': { 
    name: 'Pop', 
    prompts: ['Catchy summer pop anthem', 'Upbeat dance pop hit', 'Emotional pop ballad', 'Synth-pop love song'],
    subtext: 'Create infectious pop songs with catchy hooks and radio-ready production.'
  },
  'rock': { 
    name: 'Rock', 
    prompts: ['Hard-hitting rock anthem', 'Classic rock guitar riff', 'Arena rock power ballad', 'Garage rock energy'],
    subtext: 'Generate powerful rock tracks with driving guitars and thunderous drums.'
  },
  'hip-hop': { 
    name: 'Hip-Hop', 
    prompts: ['Hard-hitting hip-hop beat', 'Old school boom bap track', 'Modern trap-influenced hip-hop', 'Conscious hip-hop anthem'],
    subtext: 'Create authentic hip-hop beats with hard-hitting drums and smooth flows.'
  },
  'rap': { 
    name: 'Rap', 
    prompts: ['Fast-paced rap flow', 'Lyrical rap masterpiece', 'Club rap banger', 'Storytelling rap track'],
    subtext: 'Generate rap tracks with tight flows and punchy production.'
  },
  'jazz': { 
    name: 'Jazz', 
    prompts: ['Smooth jazz for dinner', 'Upbeat swing jazz', 'Cool jazz with saxophone', 'Jazz fusion exploration'],
    subtext: 'Create sophisticated jazz compositions with rich harmonies and improvisation.'
  },
  'classical': { 
    name: 'Classical', 
    prompts: ['Orchestral symphony movement', 'Piano sonata piece', 'String quartet composition', 'Romantic era classical'],
    subtext: 'Generate elegant classical compositions with orchestral arrangements.'
  },
  'electronic': { 
    name: 'Electronic', 
    prompts: ['Pulsing electronic dance track', 'Ambient electronic soundscape', 'Glitchy electronic beat', 'Melodic electronic journey'],
    subtext: 'Create cutting-edge electronic music with synthesizers and digital production.'
  },
  'edm': { 
    name: 'EDM', 
    prompts: ['Festival EDM banger', 'Progressive house drop', 'Big room EDM anthem', 'Future bass EDM track'],
    subtext: 'Generate high-energy EDM tracks ready for the dance floor.'
  },
  'house': { 
    name: 'House', 
    prompts: ['Deep house groove', 'Tech house with driving bass', 'Vocal house anthem', 'Funky house track'],
    subtext: 'Create infectious house music with four-on-the-floor beats and groovy basslines.'
  },
  'techno': { 
    name: 'Techno', 
    prompts: ['Dark techno warehouse track', 'Minimal techno loop', 'Industrial techno banger', 'Melodic techno journey'],
    subtext: 'Generate hypnotic techno tracks with pounding kicks and atmospheric synths.'
  },
  'lofi': { 
    name: 'Lo-Fi', 
    prompts: ['Chill lo-fi study beats', 'Rainy day lo-fi vibes', 'Late night lo-fi groove', 'Nostalgic lo-fi hip-hop'],
    subtext: 'Create relaxing lo-fi beats perfect for studying, working, or chilling.'
  },
  'rnb': { 
    name: 'R&B', 
    prompts: ['Smooth R&B slow jam', 'Modern R&B with trap drums', '90s R&B throwback', 'Sensual R&B ballad'],
    subtext: 'Generate silky R&B tracks with soulful vocals and smooth production.'
  },
  'soul': { 
    name: 'Soul', 
    prompts: ['Classic Motown soul', 'Neo-soul groove', 'Gospel-influenced soul', 'Funky soul track'],
    subtext: 'Create heartfelt soul music with rich vocals and organic instrumentation.'
  },
  'funk': { 
    name: 'Funk', 
    prompts: ['Groovy funk jam', 'Slap bass funk track', '70s disco funk', 'Modern funk fusion'],
    subtext: 'Generate irresistible funk tracks with tight grooves and punchy bass.'
  },
  'disco': { 
    name: 'Disco', 
    prompts: ['Classic 70s disco hit', 'Nu-disco dance track', 'Disco with strings', 'Funky disco groove'],
    subtext: 'Create dazzling disco tracks with lush strings and danceable rhythms.'
  },
  'country': { 
    name: 'Country', 
    prompts: ['Modern country anthem', 'Classic country ballad', 'Country rock crossover', 'Acoustic country song'],
    subtext: 'Generate authentic country music with twangy guitars and heartfelt lyrics.'
  },
  'folk': { 
    name: 'Folk', 
    prompts: ['Acoustic folk ballad', 'Indie folk with harmonies', 'Traditional folk song', 'Folk rock anthem'],
    subtext: 'Create intimate folk songs with acoustic instruments and storytelling.'
  },
  'blues': { 
    name: 'Blues', 
    prompts: ['12-bar blues shuffle', 'Slow blues ballad', 'Chicago electric blues', 'Delta blues acoustic'],
    subtext: 'Generate soulful blues tracks with expressive guitar and emotional depth.'
  },
  'reggae': { 
    name: 'Reggae', 
    prompts: ['Classic roots reggae', 'Dub reggae with effects', 'Reggae love song', 'Dancehall reggae beat'],
    subtext: 'Create laid-back reggae vibes with offbeat rhythms and positive messages.'
  },
  'latin': { 
    name: 'Latin', 
    prompts: ['Salsa dance track', 'Latin pop hit', 'Bachata love song', 'Cumbia party anthem'],
    subtext: 'Generate vibrant Latin music with infectious rhythms and passionate energy.'
  },
  'reggaeton': { 
    name: 'Reggaeton', 
    prompts: ['Reggaeton club banger', 'Romantic reggaeton', 'Old school reggaeton', 'Reggaeton with dembow'],
    subtext: 'Create explosive reggaeton tracks with dembow beats and urban flair.'
  },
  'k-pop': { 
    name: 'K-Pop', 
    prompts: ['K-pop dance anthem', 'K-pop ballad with harmonies', 'K-pop with rap verse', 'Upbeat K-pop hit'],
    subtext: 'Generate polished K-pop tracks with catchy hooks and dynamic production.'
  },
  'afrobeats': { 
    name: 'Afrobeats', 
    prompts: ['Afrobeats dance track', 'Afropop love song', 'Afrobeats with amapiano', 'Nigerian afrobeats'],
    subtext: 'Create infectious Afrobeats with groovy rhythms and vibrant energy.'
  },
  'metal': { 
    name: 'Metal', 
    prompts: ['Heavy metal anthem', 'Thrash metal aggression', 'Power metal epic', 'Progressive metal journey'],
    subtext: 'Generate crushing metal tracks with heavy riffs and powerful vocals.'
  },
  'indie': { 
    name: 'Indie', 
    prompts: ['Indie rock anthem', 'Dreamy indie pop', 'Lo-fi indie track', 'Alternative indie song'],
    subtext: 'Create distinctive indie music with creative production and authentic vibes.'
  },
  'ambient': { 
    name: 'Ambient', 
    prompts: ['Ethereal ambient soundscape', 'Dark ambient atmosphere', 'Nature-inspired ambient', 'Space ambient journey'],
    subtext: 'Generate immersive ambient soundscapes for relaxation and focus.'
  },
  'cinematic': { 
    name: 'Cinematic', 
    prompts: ['Epic movie trailer music', 'Emotional film score', 'Action movie soundtrack', 'Dramatic orchestral piece'],
    subtext: 'Create powerful cinematic music perfect for films, trailers, and videos.'
  },
  'trap': { 
    name: 'Trap', 
    prompts: ['Hard trap beat with 808s', 'Melodic trap anthem', 'Dark trap instrumental', 'Festival trap banger'],
    subtext: 'Generate hard-hitting trap beats with booming 808s and hi-hat rolls.'
  },
  'synthwave': { 
    name: 'Synthwave', 
    prompts: ['Retro 80s synthwave', 'Dark synthwave track', 'Outrun synthwave drive', 'Dreamy synthwave vibes'],
    subtext: 'Create nostalgic synthwave with retro synths and neon-soaked atmospheres.'
  },
  'gospel': { 
    name: 'Gospel', 
    prompts: ['Uplifting gospel choir', 'Contemporary gospel song', 'Traditional gospel hymn', 'Gospel with soul'],
    subtext: 'Generate inspiring gospel music with powerful vocals and spiritual messages.'
  },
  'meditation': { 
    name: 'Meditation', 
    prompts: ['Peaceful meditation music', 'Tibetan bowl meditation', 'Guided meditation ambient', 'Deep relaxation sounds'],
    subtext: 'Create calming meditation music for mindfulness and inner peace.'
  },
  'workout': { 
    name: 'Workout', 
    prompts: ['High-energy workout track', 'Running motivation music', 'Gym pump-up anthem', 'HIIT training beat'],
    subtext: 'Generate energizing workout music to power through your training.'
  },
  'gaming': { 
    name: 'Gaming', 
    prompts: ['Epic boss battle theme', 'Retro 8-bit game music', 'Intense gaming soundtrack', 'Victory fanfare music'],
    subtext: 'Create immersive gaming soundtracks for streams and videos.'
  },
  'lullaby': { 
    name: 'Lullaby', 
    prompts: ['Gentle baby lullaby', 'Music box lullaby', 'Calming sleep music', 'Soft piano lullaby'],
    subtext: 'Generate soothing lullabies to help little ones drift off to sleep.'
  },
  'kids': { 
    name: 'Kids Music', 
    prompts: ['Fun educational song', 'Silly kids dance track', 'Alphabet learning song', 'Happy birthday party song'],
    subtext: 'Create fun and educational music that kids will love to sing along to.'
  },
  'wedding-music': { 
    name: 'Wedding', 
    prompts: ['Romantic first dance song', 'Wedding ceremony music', 'Upbeat reception anthem', 'Wedding processional'],
    subtext: 'Generate beautiful music for your special day and wedding celebration.'
  },
  'party': { 
    name: 'Party', 
    prompts: ['Club party banger', 'Birthday party anthem', 'House party playlist', 'Get the party started'],
    subtext: 'Create high-energy party tracks that get everyone on the dance floor.'
  },
};

// =============================================================================
// LANGUAGE DATA
// =============================================================================
const languageData: { [key: string]: { name: string; prompts: string[] } } = {
  'english': { name: 'English', prompts: ['Pop song in English', 'Rock anthem in English', 'Hip-hop track in English', 'Ballad in English'] },
  'spanish': { name: 'Spanish', prompts: ['Reggaeton en español', 'Balada romántica española', 'Pop latino en español', 'Bachata en español'] },
  'french': { name: 'French', prompts: ['Chanson française romantique', 'Pop song in French', 'French jazz ballad', 'Electro track en français'] },
  'german': { name: 'German', prompts: ['German pop song', 'Schlager auf Deutsch', 'German electronic track', 'Rock song auf Deutsch'] },
  'japanese': { name: 'Japanese', prompts: ['J-Pop アニメソング', 'Japanese city pop', 'Enka ballad 演歌', 'Japanese rock anthem'] },
  'korean': { name: 'Korean', prompts: ['K-Pop dance track 한국어', 'Korean ballad 발라드', 'Korean hip-hop 힙합', 'Korean R&B song'] },
  'chinese': { name: 'Chinese', prompts: ['C-Pop 流行歌曲', 'Mandarin ballad 中文', 'Chinese hip-hop 说唱', 'Traditional Chinese music'] },
  'portuguese': { name: 'Portuguese', prompts: ['Bossa nova em português', 'Brazilian funk', 'Sertanejo brasileiro', 'Fado português'] },
  'italian': { name: 'Italian', prompts: ['Italian pop canzone', 'Opera aria in Italian', 'Italian love song', 'Modern Italian track'] },
  'hindi': { name: 'Hindi', prompts: ['Bollywood song हिंदी', 'Hindi romantic ballad', 'Punjabi beat mix', 'Indian pop track'] },
  'arabic': { name: 'Arabic', prompts: ['Arabic pop عربي', 'Middle Eastern fusion', 'Arabic love song', 'Khaleeji music track'] },
  'russian': { name: 'Russian', prompts: ['Russian pop песня', 'Russian rap трек', 'Russian folk inspired', 'Electronic на русском'] },
};

// =============================================================================
// HOLIDAY DATA
// =============================================================================
const holidayData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'christmas': { 
    name: 'Christmas', 
    prompts: ['Classic Christmas carol', 'Modern Christmas pop', 'Cozy Christmas jazz', 'Upbeat Christmas dance'],
    subtext: 'Create magical Christmas music to spread holiday cheer and festive joy.'
  },
  'halloween': { 
    name: 'Halloween', 
    prompts: ['Spooky Halloween theme', 'Creepy haunted house', 'Fun Halloween party', 'Dark gothic Halloween'],
    subtext: 'Generate spooky Halloween tracks perfect for haunted celebrations.'
  },
  'birthday': { 
    name: 'Birthday', 
    prompts: ['Personalized birthday song', 'Fun birthday party track', 'Birthday celebration anthem', 'Sweet birthday ballad'],
    subtext: 'Create custom birthday songs to make their special day unforgettable.'
  },
  'wedding': { 
    name: 'Wedding', 
    prompts: ['First dance love song', 'Wedding ceremony music', 'Reception party anthem', 'Romantic wedding ballad'],
    subtext: 'Generate beautiful wedding music for your perfect day.'
  },
  'valentines-day': { 
    name: "Valentine's Day", 
    prompts: ['Romantic love song', 'Valentine serenade', 'Sweet love ballad', 'Passionate love anthem'],
    subtext: 'Create heartfelt love songs for Valentine\'s Day romance.'
  },
  'new-years': { 
    name: 'New Year', 
    prompts: ['New Year celebration anthem', 'Countdown party track', 'Fresh start new beginnings', 'Midnight celebration song'],
    subtext: 'Generate exciting New Year music to ring in new beginnings.'
  },
  'thanksgiving': { 
    name: 'Thanksgiving', 
    prompts: ['Grateful thanksgiving song', 'Family gathering music', 'Autumn harvest theme', 'Thankful celebration'],
    subtext: 'Create warm Thanksgiving music celebrating gratitude and family.'
  },
  'mothers-day': { 
    name: "Mother's Day", 
    prompts: ['Song for mom', 'Thank you mother ballad', 'Mothers love tribute', 'Special mom anthem'],
    subtext: 'Generate heartfelt songs to celebrate the amazing moms in your life.'
  },
  'fathers-day': { 
    name: "Father's Day", 
    prompts: ['Song for dad', 'Father tribute anthem', 'Thank you dad ballad', 'Special father song'],
    subtext: 'Create meaningful songs honoring fathers and father figures.'
  },
  'graduation': { 
    name: 'Graduation', 
    prompts: ['Graduation celebration song', 'Moving forward anthem', 'Achievement celebration', 'New chapter beginning'],
    subtext: 'Generate inspiring graduation songs for this milestone moment.'
  },
};

// =============================================================================
// VIDEO STYLE DATA
// =============================================================================
const videoStyleData: { [key: string]: { name: string; prompts: string[] } } = {
  'anime': { name: 'Anime', prompts: ['Epic anime opening theme', 'Emotional anime ending', 'Action anime battle music', 'Cute anime soundtrack'] },
  'cartoon': { name: 'Cartoon', prompts: ['Fun cartoon theme song', 'Silly cartoon music', 'Adventure cartoon track', 'Kids cartoon intro'] },
  'pixar-style': { name: 'Pixar Style', prompts: ['Heartwarming Pixar-style', 'Whimsical animation music', 'Emotional journey score', 'Family adventure theme'] },
  'disney-style': { name: 'Disney Style', prompts: ['Disney princess ballad', 'Magical Disney theme', 'Disney villain song', 'Disney musical number'] },
  'cinematic': { name: 'Cinematic', prompts: ['Epic movie trailer', 'Emotional film score', 'Action scene music', 'Dramatic climax theme'] },
  'cyberpunk': { name: 'Cyberpunk', prompts: ['Neon cyberpunk track', 'Dark futuristic beat', 'Cyber city atmosphere', 'Digital dystopia theme'] },
  'fantasy': { name: 'Fantasy', prompts: ['Epic fantasy adventure', 'Magical kingdom theme', 'Dragon battle music', 'Enchanted forest soundtrack'] },
  'retro': { name: 'Retro', prompts: ['80s retro synthwave', '70s disco throwback', 'Vintage rock sound', 'Nostalgic retro pop'] },
};

// =============================================================================
// PLATFORM DATA
// =============================================================================
const platformData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'youtube': { 
    name: 'YouTube', 
    prompts: ['YouTube intro music', 'Video background track', 'YouTube outro theme', 'Vlog background music'],
    subtext: 'Create copyright-free music perfect for your YouTube videos and channel.'
  },
  'tiktok': { 
    name: 'TikTok', 
    prompts: ['Viral TikTok sound', 'TikTok dance trend', 'Catchy TikTok hook', '15-second TikTok clip'],
    subtext: 'Generate catchy sounds designed to go viral on TikTok.'
  },
  'instagram': { 
    name: 'Instagram', 
    prompts: ['Instagram Reels music', 'Story background track', 'Aesthetic Instagram vibe', 'Trendy Reel sound'],
    subtext: 'Create trendy music for Instagram Reels and Stories.'
  },
  'spotify': { 
    name: 'Spotify', 
    prompts: ['Streaming-ready track', 'Playlist-worthy song', 'Album release single', 'Lo-fi playlist addition'],
    subtext: 'Generate professional music ready for Spotify distribution.'
  },
  'podcast': { 
    name: 'Podcast', 
    prompts: ['Podcast intro theme', 'Podcast outro music', 'Background podcast bed', 'Transition jingle'],
    subtext: 'Create professional intro and outro music for your podcast.'
  },
  'twitch': { 
    name: 'Twitch', 
    prompts: ['Stream starting soon', 'Twitch alert sounds', 'Gaming stream background', 'Subscriber notification'],
    subtext: 'Generate music and sounds for your Twitch streaming setup.'
  },
};

// =============================================================================
// MOOD DATA
// =============================================================================
const moodData: { [key: string]: { name: string; prompts: string[] } } = {
  'happy': { name: 'Happy', prompts: ['Joyful upbeat track', 'Happy celebration song', 'Feel-good summer vibes', 'Cheerful positive anthem'] },
  'sad': { name: 'Sad', prompts: ['Melancholic piano ballad', 'Heartbreak sad song', 'Emotional tearjerker', 'Somber reflective piece'] },
  'energetic': { name: 'Energetic', prompts: ['High-energy workout', 'Adrenaline pumping track', 'Energetic dance anthem', 'Power-up motivation'] },
  'chill': { name: 'Chill', prompts: ['Relaxed chill vibes', 'Laid-back afternoon', 'Calm and peaceful', 'Easy listening chill'] },
  'romantic': { name: 'Romantic', prompts: ['Romantic dinner music', 'Love song serenade', 'Passionate romance', 'Sweet love ballad'] },
  'epic': { name: 'Epic', prompts: ['Epic orchestral piece', 'Heroic adventure theme', 'Grand cinematic score', 'Triumphant victory music'] },
  'dark': { name: 'Dark', prompts: ['Dark atmospheric track', 'Ominous suspense music', 'Moody dark beat', 'Sinister villain theme'] },
  'uplifting': { name: 'Uplifting', prompts: ['Inspirational uplift', 'Motivational anthem', 'Hopeful new beginning', 'Empowering rise up'] },
};

// =============================================================================
// BEGINNER/EASE-OF-USE ROUTES DATA
// =============================================================================
const beginnerRouteData: { [key: string]: { title: string; description: string; keywords: string; heroTagline: string; heroHeading: string; heroSubtext: string; prompts: string[] } } = {
  'easy-music-maker': {
    title: 'Easy Music Maker - No Experience Required | Gruvi',
    description: 'The easiest way to create music online. No musical experience needed - just describe your song and AI does the rest. Perfect for beginners.',
    keywords: 'easy music maker, simple music creator, beginner music app, no experience music',
    heroTagline: 'Easy Music Maker',
    heroHeading: 'Easy Music Maker\nNo experience required',
    heroSubtext: 'Create professional music without any musical training. Just describe what you want and our AI creates it instantly. Perfect for complete beginners.',
    prompts: ['A fun dance song', 'Relaxing background music', 'An upbeat party track', 'Calm meditation sounds']
  },
  'simple-song-maker': {
    title: 'Simple Song Maker - Create Music in Seconds | Gruvi',
    description: 'The simplest way to make your own songs. Type a description, click create, get your song. No complicated software or music theory required.',
    keywords: 'simple song maker, easy song creator, quick song generator, beginner song maker',
    heroTagline: 'Simple Song Maker',
    heroHeading: 'Simple Song Maker\nCreate songs in seconds',
    heroSubtext: 'Making music has never been easier. Just type what kind of song you want and watch as AI creates it for you in seconds.',
    prompts: ['A happy birthday song for mom', 'Chill beats for studying', 'An epic adventure theme', 'Romantic dinner music']
  },
  'beginner-music-generator': {
    title: 'Beginner Music Generator - Start Making Music Today | Gruvi',
    description: 'Perfect for beginners! Create professional-sounding music with zero experience. Our AI handles the complex stuff - you just describe your idea.',
    keywords: 'beginner music generator, music for beginners, learn to make music, first time music maker',
    heroTagline: 'For Beginners',
    heroHeading: 'Beginner Music Generator\nStart making music today',
    heroSubtext: 'Never made music before? No problem! Our AI-powered generator is designed for beginners. Just describe your song idea and create professional music instantly.',
    prompts: ['My first pop song', 'Simple acoustic melody', 'Easy electronic beat', 'Beginner-friendly instrumental']
  },
  'online-music-maker': {
    title: 'Online Music Maker - Create Music in Your Browser | Gruvi',
    description: 'Make music online without downloading software. Create songs directly in your browser with our AI music generator. Works on any device.',
    keywords: 'online music maker, browser music creator, web music generator, no download music maker',
    heroTagline: 'Online Music Maker',
    heroHeading: 'Online Music Maker\nCreate music in your browser',
    heroSubtext: 'No software downloads needed. Create professional music directly in your web browser. Works on desktop, tablet, and mobile.',
    prompts: ['Quick online beat', 'Browser-made song', 'Instant music creation', 'Web music project']
  },
  'instant-music-generator': {
    title: 'Instant Music Generator - Songs in 60 Seconds | Gruvi',
    description: 'Generate complete songs in under 60 seconds. The fastest AI music generator online. From idea to finished track instantly.',
    keywords: 'instant music generator, fast song maker, quick music creator, 60 second songs',
    heroTagline: 'Instant Music',
    heroHeading: 'Instant Music Generator\nComplete songs in 60 seconds',
    heroSubtext: 'No waiting around. Our AI generates complete, professional songs in under a minute. Type your idea and have a finished track almost instantly.',
    prompts: ['Quick pop hit', 'Instant beat drop', 'Fast track creation', 'Rapid song generation']
  },
  'ai-song-maker': {
    title: 'AI Song Maker - Let AI Create Your Music | Gruvi',
    description: 'Let artificial intelligence create songs for you. Describe your vision, choose a genre, and AI composes original music with lyrics and vocals.',
    keywords: 'ai song maker, artificial intelligence music, ai composer, auto song creator',
    heroTagline: 'AI Song Maker',
    heroHeading: 'AI Song Maker\nLet AI create your music',
    heroSubtext: 'Artificial intelligence that composes real music. Describe what you want - genre, mood, theme - and our AI creates complete songs with lyrics and vocals.',
    prompts: ['AI compose a love song', 'Let AI write my anthem', 'AI-generated pop hit', 'Computer-composed masterpiece']
  },
  'song-generator-with-lyrics': {
    title: 'Song Generator with Lyrics - Complete Songs Created | Gruvi',
    description: 'Generate complete songs with AI-written lyrics and vocals. Not just beats - full songs with words, verses, choruses, and professional vocals.',
    keywords: 'song generator with lyrics, ai lyrics generator, songs with words, complete song maker',
    heroTagline: 'Songs with Lyrics',
    heroHeading: 'Song Generator with Lyrics\nComplete songs with words',
    heroSubtext: 'Create complete songs with AI-generated lyrics and vocals. Verses, choruses, bridges - everything you need for a real song.',
    prompts: ['Love song with romantic lyrics', 'Party anthem with catchy words', 'Emotional ballad with deep lyrics', 'Fun song with silly words']
  },
  'music-generator-with-vocals': {
    title: 'Music Generator with Vocals - AI Singing | Gruvi',
    description: 'Generate music with realistic AI vocals. Choose male or female voices, adjust the style, and create songs with professional singing.',
    keywords: 'music with vocals, ai singing, vocal music generator, songs with voice',
    heroTagline: 'AI Vocals',
    heroHeading: 'Music Generator with Vocals\nAI-powered singing',
    heroSubtext: 'Create songs with realistic AI-generated vocals. Male, female, or harmonized voices that sound natural and professional.',
    prompts: ['Female pop vocals', 'Male R&B singer', 'Harmonized choir', 'Solo acoustic voice']
  },
  'beat-maker-online': {
    title: 'Beat Maker Online - Create Beats Free | Gruvi',
    description: 'Make beats online with AI. Create hip-hop, trap, lo-fi, and electronic beats in your browser. No equipment or experience needed.',
    keywords: 'beat maker online, free beats, make beats online, ai beat generator',
    heroTagline: 'Beat Maker',
    heroHeading: 'Beat Maker Online\nCreate beats with AI',
    heroSubtext: 'Make professional beats online without any equipment. Hip-hop, trap, lo-fi, electronic - describe the vibe and AI creates it.',
    prompts: ['Hard trap beat', 'Chill lo-fi beat', 'Bouncy hip-hop instrumental', 'Dark drill beat']
  },
  'custom-song-creator': {
    title: 'Custom Song Creator - Personalized Music | Gruvi',
    description: 'Create fully customized songs for any occasion. Personalized birthday songs, wedding music, tributes, and more with your own ideas.',
    keywords: 'custom song creator, personalized music, custom songs, made to order music',
    heroTagline: 'Custom Songs',
    heroHeading: 'Custom Song Creator\nPersonalized music for you',
    heroSubtext: 'Create fully personalized songs for any occasion. Add names, dates, special messages - make music that\'s uniquely yours.',
    prompts: ['Birthday song for Sarah', 'Our wedding first dance', 'Graduation song for Class of 2025', 'Anniversary surprise song']
  },
  'text-to-music': {
    title: 'Text to Music Generator - Type and Create | Gruvi',
    description: 'Turn text into music with AI. Simply type a description and our generator transforms your words into original songs and beats.',
    keywords: 'text to music, type to song, words to music, description to song',
    heroTagline: 'Text to Music',
    heroHeading: 'Text to Music\nType it, hear it',
    heroSubtext: 'Transform your ideas into music instantly. Type any description and watch as AI converts your words into professional songs.',
    prompts: ['Turn this poem into a song', 'Make music from my story', 'Convert my feelings to melody', 'Words become music']
  },
  'no-signup-music-maker': {
    title: 'Music Maker No Signup - Try Free Instantly | Gruvi',
    description: 'Create music without signing up. Try our AI music generator instantly - no account required, no email needed. Start making music now.',
    keywords: 'no signup music maker, try without account, instant music creation, no registration',
    heroTagline: 'No Signup Needed',
    heroHeading: 'No Signup Music Maker\nTry instantly for free',
    heroSubtext: 'No account needed to try. Create your first AI-generated song right now without signing up. See how easy it is.',
    prompts: ['Try it now', 'Quick demo song', 'Test the AI', 'Instant creation']
  },
  'one-click-music': {
    title: 'One Click Music Generator - Instant Songs | Gruvi',
    description: 'Generate music with one click. Choose a style, hit generate, get your song. The absolute easiest way to create original music.',
    keywords: 'one click music, instant song generator, automatic music maker, easy music creation',
    heroTagline: 'One Click Music',
    heroHeading: 'One Click Music\nGenerate songs instantly',
    heroSubtext: 'Just click and create. Select a genre, mood, or occasion - one click generates a complete original song. It couldn\'t be simpler.',
    prompts: ['One-click pop', 'Instant rock song', 'Quick jazz track', 'Auto-generate electronic']
  },
  'professional-music-maker': {
    title: 'Professional Music Maker - Studio Quality AI | Gruvi',
    description: 'Create professional, studio-quality music with AI. High-definition audio, industry-standard production, ready for release.',
    keywords: 'professional music maker, studio quality, high quality music, release ready',
    heroTagline: 'Professional Quality',
    heroHeading: 'Professional Music Maker\nStudio-quality results',
    heroSubtext: 'Create music that sounds professionally produced. High-definition audio quality ready for streaming platforms, videos, or commercial use.',
    prompts: ['Radio-ready pop song', 'Professional soundtrack', 'Studio-quality beat', 'Release-ready track']
  },
  'royalty-free-music-generator': {
    title: 'Royalty Free Music Generator - Use Anywhere | Gruvi',
    description: 'Generate royalty-free music you can use anywhere. No copyright claims, no licensing fees. Use for YouTube, TikTok, podcasts, and more.',
    keywords: 'royalty free music, no copyright music, free to use music, license free songs',
    heroTagline: 'Royalty Free',
    heroHeading: 'Royalty Free Music\nUse anywhere, no claims',
    heroSubtext: 'Create music you actually own. Use it on YouTube, TikTok, podcasts, commercials - anywhere without copyright claims or licensing fees.',
    prompts: ['YouTube background music', 'Copyright-free beats', 'Podcast intro music', 'Commercial-safe track']
  },
  'instrumental-generator': {
    title: 'Instrumental Music Generator - Beats Without Vocals | Gruvi',
    description: 'Generate instrumental music without vocals. Create background music, beats, soundtracks, and backing tracks for any purpose.',
    keywords: 'instrumental music, no vocals, background music, backing tracks',
    heroTagline: 'Instrumentals Only',
    heroHeading: 'Instrumental Generator\nMusic without vocals',
    heroSubtext: 'Create instrumental tracks perfect for background music, videos, presentations, and more. Pure music without vocals.',
    prompts: ['Piano instrumental', 'Guitar background music', 'Electronic instrumental', 'Orchestral soundtrack']
  },
  'ai-producer': {
    title: 'AI Music Producer - Virtual Producer | Gruvi',
    description: 'Your personal AI music producer. Creates complete productions with mixing, arrangement, and professional sound design.',
    keywords: 'ai producer, virtual producer, ai music production, auto producer',
    heroTagline: 'AI Producer',
    heroHeading: 'AI Music Producer\nYour virtual producer',
    heroSubtext: 'Let AI handle the production. Our virtual producer creates fully mixed and mastered tracks with professional arrangements.',
    prompts: ['Produce my pop idea', 'AI produce a hip-hop track', 'Virtual producer session', 'Full production beat']
  },
  'song-writer-ai': {
    title: 'AI Songwriter - Write Songs with AI | Gruvi',
    description: 'AI that writes songs for you. Generates original lyrics, melodies, and complete song structures. Your AI songwriting partner.',
    keywords: 'ai songwriter, song writing ai, auto lyrics, ai song writer',
    heroTagline: 'AI Songwriter',
    heroHeading: 'AI Songwriter\nWrite songs with AI',
    heroSubtext: 'Stuck on lyrics? Let AI write them. Our songwriter AI generates original lyrics, catchy melodies, and complete song structures.',
    prompts: ['Write a love song for me', 'AI write my breakup anthem', 'Generate song lyrics', 'Create my next hit']
  },
  'music-for-videos': {
    title: 'Music for Videos - Background Music Generator | Gruvi',
    description: 'Generate perfect background music for your videos. YouTube, TikTok, Instagram, corporate videos - royalty-free and ready to use.',
    keywords: 'music for videos, video background music, youtube music, content creator music',
    heroTagline: 'Music for Videos',
    heroHeading: 'Music for Videos\nPerfect background tracks',
    heroSubtext: 'Create custom background music for your video content. Matches your video\'s mood perfectly, royalty-free for all platforms.',
    prompts: ['YouTube intro music', 'Vlog background track', 'Dramatic video score', 'Upbeat social media music']
  },
  'commercial-music-generator': {
    title: 'Commercial Music Generator - Ads & Business | Gruvi',
    description: 'Create music for commercials, advertisements, and business use. Professional tracks licensed for commercial purposes.',
    keywords: 'commercial music, advertising music, business music, ad jingles',
    heroTagline: 'Commercial Music',
    heroHeading: 'Commercial Music\nFor ads and business',
    heroSubtext: 'Generate professional music for commercials, advertisements, and corporate content. Fully licensed for commercial use.',
    prompts: ['Upbeat commercial jingle', 'Corporate presentation music', 'Product ad soundtrack', 'Brand anthem']
  },
  'ai-music-creator': {
    title: 'AI Music Creator - Create Original Music Online | Gruvi',
    description: 'Create original music online with AI. The simplest music creation tool - describe what you want, get professional results.',
    keywords: 'ai music creator, create music ai, music creation online',
    heroTagline: 'AI Music Creator',
    heroHeading: 'AI Music Creator\nCreate original music online',
    heroSubtext: 'The simplest way to create music. Just describe your idea and AI creates professional, original music instantly.',
    prompts: ['Create an upbeat track', 'Make chill vibes', 'Generate a dance song', 'Compose something unique']
  },
  'make-music-online': {
    title: 'Make Music Online Free - No Download Required | Gruvi',
    description: 'Make music online without downloading any software. Create songs in your browser with AI. Works on any device.',
    keywords: 'make music online, online music creation, browser music maker',
    heroTagline: 'Make Music Online',
    heroHeading: 'Make Music Online\nNo download required',
    heroSubtext: 'Create music directly in your browser. No software to download, no plugins needed. Just describe and create.',
    prompts: ['Make a pop song online', 'Create beats in browser', 'Online music production', 'Web-based song creation']
  },
  'create-song-online': {
    title: 'Create Song Online - Free Song Creator | Gruvi',
    description: 'Create songs online for free. AI generates complete songs with vocals and lyrics. No musical experience needed.',
    keywords: 'create song online, online song creator, make songs free',
    heroTagline: 'Create Songs Online',
    heroHeading: 'Create Song Online\nComplete songs with AI',
    heroSubtext: 'Create complete songs online with AI-generated vocals and lyrics. Professional quality, free to try.',
    prompts: ['Create my first song', 'Online song about love', 'Make a party anthem', 'Generate a ballad']
  },
  'generate-music': {
    title: 'Generate Music with AI - Instant Song Creation | Gruvi',
    description: 'Generate music instantly with artificial intelligence. From idea to finished song in under a minute.',
    keywords: 'generate music, music generation, ai music, auto music',
    heroTagline: 'Generate Music',
    heroHeading: 'Generate Music\nAI-powered creation',
    heroSubtext: 'Generate original music with the power of AI. Describe your vision and watch as complete songs are created instantly.',
    prompts: ['Generate pop music', 'Auto-create hip-hop', 'Instant rock generation', 'AI make my song']
  },
  'make-a-song': {
    title: 'Make a Song - Easy Song Maker Online | Gruvi',
    description: 'Make a song about anything. Describe your idea, choose a genre, and AI creates a complete song with music and vocals.',
    keywords: 'make a song, song maker, create a song, make music',
    heroTagline: 'Make a Song',
    heroHeading: 'Make a Song\nAbout anything',
    heroSubtext: 'Make a song about literally anything. Your ideas, your topics, your style - AI brings it to life with music and vocals.',
    prompts: ['Make a song about my dog', 'Create a song for mom', 'Song about summer vibes', 'Make my story a song']
  },
  'song-maker': {
    title: 'Song Maker - Free Online Song Creator | Gruvi',
    description: 'Free song maker powered by AI. Create original songs with vocals, lyrics, and professional production. No experience needed.',
    keywords: 'song maker, song creator, make songs, song generator',
    heroTagline: 'Song Maker',
    heroHeading: 'Song Maker\nCreate songs for free',
    heroSubtext: 'The easiest song maker online. AI creates complete songs with vocals and professional production. Just describe what you want.',
    prompts: ['Make a love song', 'Create party music', 'Generate a ballad', 'Craft an anthem']
  },
  'music-maker': {
    title: 'Music Maker Online - Free AI Music Creator | Gruvi',
    description: 'Free online music maker powered by AI. Create original music in any genre without any musical experience.',
    keywords: 'music maker, music creator, make music, free music maker',
    heroTagline: 'Music Maker',
    heroHeading: 'Music Maker\nCreate music for free',
    heroSubtext: 'The simplest music maker online. No experience needed - just describe your idea and AI creates professional music.',
    prompts: ['Make electronic music', 'Create rock track', 'Generate jazz piece', 'Produce hip-hop beat']
  },
  'create-music': {
    title: 'Create Music with AI - Song & Beat Generator | Gruvi',
    description: 'Create music with AI technology. Generate songs, beats, instrumentals, and complete tracks in any genre.',
    keywords: 'create music, music creation, ai music maker, generate music',
    heroTagline: 'Create Music',
    heroHeading: 'Create Music\nWith AI technology',
    heroSubtext: 'Create any kind of music with AI. Songs with vocals, beats, instrumentals - describe what you want and get professional results.',
    prompts: ['Create pop song', 'Make a beat', 'Generate instrumental', 'Compose soundtrack']
  },
  'make-beats': {
    title: 'Make Beats Online Free - AI Beat Maker | Gruvi',
    description: 'Make beats online for free. AI-powered beat maker creates hip-hop, trap, lo-fi, and electronic beats instantly.',
    keywords: 'make beats, beat maker, free beats, ai beats',
    heroTagline: 'Make Beats',
    heroHeading: 'Make Beats\nAI beat maker online',
    heroSubtext: 'Create professional beats online with AI. Hip-hop, trap, lo-fi, electronic - any style, instantly generated.',
    prompts: ['Make trap beat', 'Create lo-fi beat', 'Generate boom bap', 'Produce drill beat']
  },
  'background-music-generator': {
    title: 'Background Music Generator - Royalty Free | Gruvi',
    description: 'Generate royalty-free background music for videos, presentations, and content. Professional quality, any mood.',
    keywords: 'background music generator, royalty free background, video background music',
    heroTagline: 'Background Music',
    heroHeading: 'Background Music Generator\nRoyalty-free tracks',
    heroSubtext: 'Create perfect background music for any project. Videos, presentations, podcasts - royalty-free and customized to your needs.',
    prompts: ['Corporate background', 'Upbeat background track', 'Calm ambient background', 'Motivational background']
  },
  'intro-music-maker': {
    title: 'Intro Music Maker - YouTube & Podcast Intros | Gruvi',
    description: 'Create catchy intro music for YouTube, podcasts, and content. Professional intros that grab attention.',
    keywords: 'intro music, youtube intro, podcast intro, intro maker',
    heroTagline: 'Intro Music',
    heroHeading: 'Intro Music Maker\nCatchy intros for content',
    heroSubtext: 'Create memorable intro music for your YouTube channel, podcast, or content. Professional quality that grabs attention.',
    prompts: ['YouTube intro theme', 'Podcast opening music', 'Channel intro jingle', 'Short attention-grabber']
  },
  'outro-music-maker': {
    title: 'Outro Music Maker - End Screen Music | Gruvi',
    description: 'Create outro music for videos and podcasts. Professional end screen music that leaves a lasting impression.',
    keywords: 'outro music, end music, youtube outro, podcast outro',
    heroTagline: 'Outro Music',
    heroHeading: 'Outro Music Maker\nPerfect endings',
    heroSubtext: 'Create memorable outro music that wraps up your content professionally. Perfect for YouTube end screens and podcast outros.',
    prompts: ['YouTube outro theme', 'Podcast closing music', 'Fade out music', 'End credits track']
  },
  'jingle-maker': {
    title: 'Jingle Maker - Create Catchy Jingles | Gruvi',
    description: 'Create catchy jingles and short musical pieces. Perfect for brands, ads, and memorable audio branding.',
    keywords: 'jingle maker, create jingles, ad jingle, brand jingle',
    heroTagline: 'Jingle Maker',
    heroHeading: 'Jingle Maker\nCatchy audio branding',
    heroSubtext: 'Create memorable jingles that stick in people\'s heads. Perfect for brands, advertisements, and audio branding.',
    prompts: ['Catchy brand jingle', 'Commercial jingle', 'Short memorable tune', 'Radio jingle']
  },
  'theme-song-generator': {
    title: 'Theme Song Generator - Create Theme Music | Gruvi',
    description: 'Generate theme songs for shows, channels, podcasts, and more. Create memorable theme music that defines your brand.',
    keywords: 'theme song generator, create theme music, theme song maker',
    heroTagline: 'Theme Songs',
    heroHeading: 'Theme Song Generator\nDefine your brand',
    heroSubtext: 'Create the perfect theme song for your show, channel, or brand. Memorable music that becomes your signature sound.',
    prompts: ['Channel theme song', 'Podcast theme music', 'Show opening theme', 'Brand anthem']
  },
  'study-music-generator': {
    title: 'Study Music Generator - Focus Music for Studying | Gruvi',
    description: 'Generate study music to help you focus. Lo-fi beats, ambient sounds, and concentration-boosting tracks.',
    keywords: 'study music, focus music, concentration music, lo-fi study',
    heroTagline: 'Study Music',
    heroHeading: 'Study Music Generator\nFocus and concentrate',
    heroSubtext: 'Create the perfect study soundtrack. Lo-fi beats, ambient sounds, and focus music designed to boost concentration.',
    prompts: ['Lo-fi study beats', 'Calm focus music', 'Library ambient', 'Deep concentration track']
  },
  'sleep-music-generator': {
    title: 'Sleep Music Generator - Relaxing Sleep Sounds | Gruvi',
    description: 'Generate relaxing sleep music and sounds. Drift off to AI-created sleep soundscapes and calming melodies.',
    keywords: 'sleep music, relaxing music, sleep sounds, bedtime music',
    heroTagline: 'Sleep Music',
    heroHeading: 'Sleep Music Generator\nDrift off peacefully',
    heroSubtext: 'Create calming sleep music to help you drift off. Gentle melodies, ambient sounds, and relaxing soundscapes.',
    prompts: ['Gentle sleep melody', 'Ambient sleep sounds', 'Calming bedtime music', 'Deep relaxation track']
  },
  'focus-music-generator': {
    title: 'Focus Music Generator - Productivity Music | Gruvi',
    description: 'Generate focus music to boost productivity. Concentration-enhancing tracks for work, study, and deep focus.',
    keywords: 'focus music, productivity music, concentration music, work music',
    heroTagline: 'Focus Music',
    heroHeading: 'Focus Music Generator\nBoost productivity',
    heroSubtext: 'Create music designed to enhance focus and productivity. Perfect background for work, coding, and deep concentration.',
    prompts: ['Deep focus ambient', 'Productivity beats', 'Coding background', 'Work flow music']
  },
  'ringtone-maker': {
    title: 'Ringtone Maker - Create Custom Ringtones | Gruvi',
    description: 'Create unique custom ringtones with AI. Stand out with personalized ringtones in any style or genre.',
    keywords: 'ringtone maker, custom ringtones, create ringtone, phone ringtone',
    heroTagline: 'Ringtones',
    heroHeading: 'Ringtone Maker\nUnique phone sounds',
    heroSubtext: 'Create one-of-a-kind ringtones that stand out. AI generates unique sounds in any style for your phone.',
    prompts: ['Catchy ringtone melody', 'Electronic ringtone', 'Calm notification sound', 'Epic ringtone']
  },
  'alarm-music-maker': {
    title: 'Alarm Music Maker - Custom Wake Up Sounds | Gruvi',
    description: 'Create custom alarm music and wake-up sounds. Start your day right with personalized morning melodies.',
    keywords: 'alarm music, wake up music, alarm sounds, morning alarm',
    heroTagline: 'Alarm Music',
    heroHeading: 'Alarm Music Maker\nWake up your way',
    heroSubtext: 'Create the perfect wake-up sound. Gentle morning melodies or energizing alarm music - personalized for you.',
    prompts: ['Gentle wake up melody', 'Energizing alarm', 'Morning motivation music', 'Peaceful alarm sound']
  },
};

// =============================================================================
// PROMOTIONAL VIDEO DATA - PLACES
// =============================================================================
const promotionalPlaceData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'airbnb': { name: 'Airbnb', prompts: ['Cozy cabin Airbnb promo', 'Beach house rental showcase', 'City apartment tour music', 'Unique stays promotional'], subtext: 'Create stunning promotional music videos for your Airbnb listing to attract more guests.' },
  'hotel': { name: 'Hotel', prompts: ['Luxury hotel showcase', 'Boutique hotel promo', 'Resort experience video', 'Hotel amenities highlight'], subtext: 'Generate professional hotel promotional videos with AI music and visuals.' },
  'restaurant': { name: 'Restaurant', prompts: ['Fine dining atmosphere', 'Casual restaurant vibe', 'Food showcase music', 'Restaurant ambiance video'], subtext: 'Create mouth-watering restaurant promotional videos with perfect background music.' },
  'cafe': { name: 'Café', prompts: ['Cozy cafe atmosphere', 'Coffee shop vibes', 'Cafe promotional music', 'Morning coffee experience'], subtext: 'Generate inviting café promotional content with relaxing background music.' },
  'bar': { name: 'Bar', prompts: ['Cocktail bar promo', 'Sports bar energy', 'Wine bar elegance', 'Nightlife bar atmosphere'], subtext: 'Create exciting bar promotional videos with the perfect party soundtrack.' },
  'spa': { name: 'Spa', prompts: ['Relaxing spa promo', 'Wellness retreat video', 'Massage therapy showcase', 'Spa experience music'], subtext: 'Generate calming spa promotional videos with soothing ambient music.' },
  'gym': { name: 'Gym', prompts: ['Fitness center promo', 'Gym motivation video', 'Workout facility showcase', 'Personal training promo'], subtext: 'Create high-energy gym promotional videos with motivating workout music.' },
  'yoga-studio': { name: 'Yoga Studio', prompts: ['Peaceful yoga studio', 'Meditation center promo', 'Yoga class showcase', 'Wellness studio video'], subtext: 'Generate serene yoga studio promotional content with calming music.' },
  'salon': { name: 'Salon', prompts: ['Hair salon promo', 'Beauty salon showcase', 'Spa salon experience', 'Styling session video'], subtext: 'Create stylish salon promotional videos with trendy background music.' },
  'real-estate': { name: 'Real Estate', prompts: ['Property listing video', 'Home tour music', 'Luxury real estate promo', 'House showcase'], subtext: 'Generate professional real estate listing videos with ambient background music.' },
  'wedding-venue': { name: 'Wedding Venue', prompts: ['Wedding venue showcase', 'Reception hall promo', 'Romantic venue tour', 'Event space video'], subtext: 'Create romantic wedding venue promotional videos with beautiful music.' },
  'event-space': { name: 'Event Space', prompts: ['Conference center promo', 'Event venue showcase', 'Party space video', 'Meeting room tour'], subtext: 'Generate professional event space promotional content with appropriate music.' },
  'coworking-space': { name: 'Coworking Space', prompts: ['Modern coworking promo', 'Office space showcase', 'Creative workspace video', 'Startup hub tour'], subtext: 'Create dynamic coworking space promotional videos with productive background music.' },
  'art-gallery': { name: 'Art Gallery', prompts: ['Gallery exhibition promo', 'Art showcase video', 'Museum tour music', 'Cultural space highlight'], subtext: 'Generate sophisticated art gallery promotional content with elegant music.' },
  'nightclub': { name: 'Nightclub', prompts: ['Club night promo', 'DJ event video', 'Dance floor energy', 'VIP experience showcase'], subtext: 'Create electrifying nightclub promotional videos with pumping EDM tracks.' },
  'brewery': { name: 'Brewery', prompts: ['Craft brewery tour', 'Beer tasting promo', 'Brewery experience video', 'Taproom showcase'], subtext: 'Generate authentic brewery promotional videos with laid-back music.' },
  'winery': { name: 'Winery', prompts: ['Wine tasting experience', 'Vineyard tour video', 'Winery promo music', 'Wine country showcase'], subtext: 'Create elegant winery promotional content with sophisticated background music.' },
  'golf-course': { name: 'Golf Course', prompts: ['Golf club promo', 'Course tour video', 'Golfing experience music', 'Country club showcase'], subtext: 'Generate professional golf course promotional videos with relaxing music.' },
  'campground': { name: 'Campground', prompts: ['Camping destination promo', 'Outdoor adventure video', 'Nature retreat showcase', 'Campsite tour'], subtext: 'Create inviting campground promotional content with nature-inspired music.' },
  'beach-resort': { name: 'Beach Resort', prompts: ['Tropical resort promo', 'Beach vacation video', 'Paradise getaway music', 'Seaside resort showcase'], subtext: 'Generate stunning beach resort promotional videos with tropical vibes.' },
  'ski-resort': { name: 'Ski Resort', prompts: ['Winter resort promo', 'Ski adventure video', 'Mountain lodge showcase', 'Snow sports music'], subtext: 'Create exciting ski resort promotional content with energetic winter music.' },
  'theme-park': { name: 'Theme Park', prompts: ['Amusement park promo', 'Ride experience video', 'Family fun showcase', 'Theme park adventure'], subtext: 'Generate thrilling theme park promotional videos with exciting music.' },
  'museum': { name: 'Museum', prompts: ['Museum tour promo', 'Exhibition showcase', 'Cultural experience video', 'History museum music'], subtext: 'Create educational museum promotional content with inspiring background music.' },
  'aquarium': { name: 'Aquarium', prompts: ['Ocean life showcase', 'Aquarium tour video', 'Marine world promo', 'Underwater experience'], subtext: 'Generate mesmerizing aquarium promotional videos with ambient ocean music.' },
  'zoo': { name: 'Zoo', prompts: ['Wildlife experience promo', 'Zoo tour video', 'Animal encounter showcase', 'Family zoo adventure'], subtext: 'Create engaging zoo promotional content with fun, family-friendly music.' },
};

// =============================================================================
// PROMOTIONAL VIDEO DATA - BUSINESSES
// =============================================================================
const promotionalBusinessData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'small-business': { name: 'Small Business', prompts: ['Local business promo', 'Small shop showcase', 'Family business story', 'Entrepreneur spotlight'], subtext: 'Create professional promotional videos for your small business with AI-generated music.' },
  'startup': { name: 'Startup', prompts: ['Tech startup promo', 'Innovation showcase', 'Startup launch video', 'Disruptive company intro'], subtext: 'Generate dynamic startup promotional content with modern, energetic music.' },
  'bakery': { name: 'Bakery', prompts: ['Fresh bakery promo', 'Artisan bread showcase', 'Sweet treats video', 'Bakery shop tour'], subtext: 'Create delicious bakery promotional videos with warm, inviting music.' },
  'florist': { name: 'Florist', prompts: ['Flower shop promo', 'Floral arrangement showcase', 'Bouquet design video', 'Florist studio tour'], subtext: 'Generate beautiful florist promotional content with elegant background music.' },
  'pet-store': { name: 'Pet Store', prompts: ['Pet shop promo', 'Pet supplies showcase', 'Animal store tour', 'Pet care video'], subtext: 'Create adorable pet store promotional videos with playful, fun music.' },
  'bookstore': { name: 'Bookstore', prompts: ['Indie bookshop promo', 'Literary haven showcase', 'Book lover video', 'Cozy bookstore tour'], subtext: 'Generate charming bookstore promotional content with thoughtful background music.' },
  'clothing-boutique': { name: 'Clothing Boutique', prompts: ['Fashion boutique promo', 'Style showcase video', 'New collection reveal', 'Boutique shopping experience'], subtext: 'Create stylish clothing boutique promotional videos with trendy music.' },
  'jewelry-store': { name: 'Jewelry Store', prompts: ['Jewelry collection showcase', 'Luxury jeweler promo', 'Diamond store video', 'Fine jewelry display'], subtext: 'Generate elegant jewelry store promotional content with sophisticated music.' },
  'auto-dealer': { name: 'Auto Dealer', prompts: ['Car dealership promo', 'New vehicle showcase', 'Auto showroom video', 'Test drive experience'], subtext: 'Create dynamic auto dealer promotional videos with exciting music.' },
  'dental-office': { name: 'Dental Office', prompts: ['Dental practice promo', 'Smile transformation video', 'Modern dentistry showcase', 'Patient care highlight'], subtext: 'Generate professional dental office promotional content with calming music.' },
  'law-firm': { name: 'Law Firm', prompts: ['Legal services promo', 'Attorney firm showcase', 'Law office video', 'Professional legal team'], subtext: 'Create authoritative law firm promotional videos with professional background music.' },
  'accounting-firm': { name: 'Accounting Firm', prompts: ['CPA firm promo', 'Financial services video', 'Tax professional showcase', 'Accounting expertise'], subtext: 'Generate professional accounting firm promotional content with business music.' },
  'insurance-agency': { name: 'Insurance Agency', prompts: ['Insurance services promo', 'Protection coverage video', 'Agency team showcase', 'Customer care highlight'], subtext: 'Create trustworthy insurance agency promotional videos with reassuring music.' },
  'cleaning-service': { name: 'Cleaning Service', prompts: ['Professional cleaning promo', 'Home cleaning showcase', 'Commercial cleaning video', 'Spotless results highlight'], subtext: 'Generate fresh cleaning service promotional content with upbeat music.' },
  'landscaping': { name: 'Landscaping', prompts: ['Lawn care promo', 'Garden design showcase', 'Outdoor transformation video', 'Landscaping portfolio'], subtext: 'Create beautiful landscaping promotional videos with nature-inspired music.' },
  'plumber': { name: 'Plumber', prompts: ['Plumbing services promo', 'Emergency plumber video', 'Professional plumbing showcase', 'Reliable service highlight'], subtext: 'Generate trustworthy plumber promotional content with professional music.' },
  'electrician': { name: 'Electrician', prompts: ['Electrical services promo', 'Licensed electrician video', 'Home electrical showcase', 'Safety first highlight'], subtext: 'Create professional electrician promotional videos with energetic music.' },
  'hvac': { name: 'HVAC', prompts: ['Heating cooling promo', 'HVAC installation video', 'Climate control showcase', 'Comfort solutions highlight'], subtext: 'Generate professional HVAC promotional content with appropriate background music.' },
  'roofing': { name: 'Roofing', prompts: ['Roofing company promo', 'Roof installation video', 'Storm damage repair showcase', 'Quality roofing highlight'], subtext: 'Create reliable roofing company promotional videos with professional music.' },
  'moving-company': { name: 'Moving Company', prompts: ['Moving services promo', 'Relocation specialists video', 'Careful movers showcase', 'Stress-free moving highlight'], subtext: 'Generate trustworthy moving company promotional content with upbeat music.' },
  'photography-studio': { name: 'Photography Studio', prompts: ['Photo studio promo', 'Portrait photography video', 'Creative photography showcase', 'Memorable moments highlight'], subtext: 'Create artistic photography studio promotional videos with inspiring music.' },
  'tattoo-shop': { name: 'Tattoo Shop', prompts: ['Tattoo studio promo', 'Custom ink video', 'Tattoo artist showcase', 'Body art highlight'], subtext: 'Generate edgy tattoo shop promotional content with alternative music.' },
  'fitness-trainer': { name: 'Fitness Trainer', prompts: ['Personal trainer promo', 'Fitness coaching video', 'Transformation showcase', 'Training results highlight'], subtext: 'Create motivating fitness trainer promotional videos with workout music.' },
  'music-school': { name: 'Music School', prompts: ['Music lessons promo', 'Instrument training video', 'Music education showcase', 'Student performance highlight'], subtext: 'Generate inspiring music school promotional content with diverse music styles.' },
  'dance-studio': { name: 'Dance Studio', prompts: ['Dance class promo', 'Choreography showcase', 'Dance school video', 'Performance highlight'], subtext: 'Create dynamic dance studio promotional videos with danceable music.' },
  'martial-arts': { name: 'Martial Arts', prompts: ['Martial arts school promo', 'Self-defense training video', 'Dojo showcase', 'Belt ceremony highlight'], subtext: 'Generate powerful martial arts promotional content with energetic music.' },
  'tutoring-service': { name: 'Tutoring Service', prompts: ['Academic tutoring promo', 'Learning success video', 'Education support showcase', 'Student achievement highlight'], subtext: 'Create professional tutoring service promotional videos with focused music.' },
  'daycare': { name: 'Daycare', prompts: ['Childcare center promo', 'Learning through play video', 'Daycare tour showcase', 'Happy children highlight'], subtext: 'Generate warm daycare promotional content with playful, child-friendly music.' },
  'veterinarian': { name: 'Veterinarian', prompts: ['Vet clinic promo', 'Pet care video', 'Animal hospital showcase', 'Compassionate care highlight'], subtext: 'Create caring veterinarian promotional videos with gentle background music.' },
  'pharmacy': { name: 'Pharmacy', prompts: ['Local pharmacy promo', 'Health services video', 'Prescription care showcase', 'Community pharmacy highlight'], subtext: 'Generate trustworthy pharmacy promotional content with professional music.' },
  'optometrist': { name: 'Optometrist', prompts: ['Eye care promo', 'Vision center video', 'Eyewear showcase', 'Clear vision highlight'], subtext: 'Create professional optometrist promotional videos with modern music.' },
  'chiropractor': { name: 'Chiropractor', prompts: ['Chiropractic care promo', 'Spine health video', 'Wellness adjustment showcase', 'Pain relief highlight'], subtext: 'Generate healing chiropractor promotional content with calming music.' },
  'massage-therapist': { name: 'Massage Therapist', prompts: ['Massage therapy promo', 'Relaxation session video', 'Therapeutic massage showcase', 'Stress relief highlight'], subtext: 'Create soothing massage therapist promotional videos with spa music.' },
  'nail-salon': { name: 'Nail Salon', prompts: ['Nail art promo', 'Manicure pedicure video', 'Nail design showcase', 'Salon experience highlight'], subtext: 'Generate stylish nail salon promotional content with trendy music.' },
  'barbershop': { name: 'Barbershop', prompts: ['Classic barbershop promo', 'Men grooming video', 'Haircut showcase', 'Barber skills highlight'], subtext: 'Create cool barbershop promotional videos with vintage or modern vibes.' },
  'food-truck': { name: 'Food Truck', prompts: ['Food truck promo', 'Street food video', 'Mobile kitchen showcase', 'Tasty treats highlight'], subtext: 'Generate appetizing food truck promotional content with fun, upbeat music.' },
  'catering': { name: 'Catering', prompts: ['Catering service promo', 'Event food video', 'Menu showcase', 'Delicious spread highlight'], subtext: 'Create elegant catering promotional videos with sophisticated background music.' },
  'event-planner': { name: 'Event Planner', prompts: ['Event planning promo', 'Party design video', 'Celebration showcase', 'Perfect event highlight'], subtext: 'Generate exciting event planner promotional content with festive music.' },
  'wedding-planner': { name: 'Wedding Planner', prompts: ['Wedding planning promo', 'Dream wedding video', 'Bridal showcase', 'Perfect day highlight'], subtext: 'Create romantic wedding planner promotional videos with beautiful music.' },
  'travel-agency': { name: 'Travel Agency', prompts: ['Travel agency promo', 'Vacation packages video', 'Destination showcase', 'Adventure awaits highlight'], subtext: 'Generate wanderlust-inspiring travel agency promotional content with world music.' },
  'real-estate-agent': { name: 'Real Estate Agent', prompts: ['Realtor promo video', 'Home buying journey', 'Property expert showcase', 'Dream home highlight'], subtext: 'Create professional real estate agent promotional videos with ambient music.' },
  'interior-designer': { name: 'Interior Designer', prompts: ['Interior design promo', 'Room transformation video', 'Design portfolio showcase', 'Beautiful spaces highlight'], subtext: 'Generate stylish interior designer promotional content with sophisticated music.' },
  'architect': { name: 'Architect', prompts: ['Architecture firm promo', 'Building design video', 'Project portfolio showcase', 'Vision to reality highlight'], subtext: 'Create impressive architect promotional videos with modern, inspiring music.' },
  'construction': { name: 'Construction', prompts: ['Construction company promo', 'Building project video', 'Construction showcase', 'Quality craftsmanship highlight'], subtext: 'Generate professional construction promotional content with powerful music.' },
  'print-shop': { name: 'Print Shop', prompts: ['Printing services promo', 'Custom print video', 'Print quality showcase', 'Design to print highlight'], subtext: 'Create vibrant print shop promotional videos with creative music.' },
  'tech-repair': { name: 'Tech Repair', prompts: ['Device repair promo', 'Phone fix video', 'Tech support showcase', 'Fast repair highlight'], subtext: 'Generate modern tech repair promotional content with electronic music.' },
  'computer-store': { name: 'Computer Store', prompts: ['Computer shop promo', 'Tech products video', 'Gaming setup showcase', 'Tech deals highlight'], subtext: 'Create exciting computer store promotional videos with tech-inspired music.' },
  'furniture-store': { name: 'Furniture Store', prompts: ['Furniture showroom promo', 'Home furnishing video', 'Interior style showcase', 'Comfort living highlight'], subtext: 'Generate elegant furniture store promotional content with sophisticated music.' },
  'home-decor': { name: 'Home Decor', prompts: ['Home decor promo', 'Interior accessories video', 'Style your space showcase', 'Beautiful home highlight'], subtext: 'Create stylish home decor promotional videos with ambient background music.' },
  'antique-shop': { name: 'Antique Shop', prompts: ['Antique store promo', 'Vintage finds video', 'Collectibles showcase', 'Timeless treasures highlight'], subtext: 'Generate nostalgic antique shop promotional content with vintage-inspired music.' },
};

// =============================================================================
// PROMOTIONAL VIDEO DATA - PRODUCTS
// =============================================================================
const promotionalProductData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'handmade-jewelry': { name: 'Handmade Jewelry', prompts: ['Artisan jewelry promo', 'Handcrafted pieces video', 'Unique jewelry showcase', 'Custom jewelry highlight'], subtext: 'Create beautiful handmade jewelry promotional videos with elegant music.' },
  'clothing-brand': { name: 'Clothing Brand', prompts: ['Fashion brand promo', 'New collection video', 'Style showcase', 'Brand story highlight'], subtext: 'Generate stylish clothing brand promotional content with trendy music.' },
  'skincare-products': { name: 'Skincare Products', prompts: ['Skincare line promo', 'Beauty routine video', 'Glow up showcase', 'Natural ingredients highlight'], subtext: 'Create fresh skincare products promotional videos with soothing music.' },
  'cosmetics': { name: 'Cosmetics', prompts: ['Makeup brand promo', 'Beauty products video', 'Cosmetics showcase', 'Glam look highlight'], subtext: 'Generate glamorous cosmetics promotional content with chic music.' },
  'candles': { name: 'Candles', prompts: ['Artisan candles promo', 'Scented candle video', 'Handpoured showcase', 'Cozy ambiance highlight'], subtext: 'Create warm candle promotional videos with relaxing background music.' },
  'soap': { name: 'Handmade Soap', prompts: ['Natural soap promo', 'Artisan soap video', 'Handcrafted showcase', 'Clean beauty highlight'], subtext: 'Generate fresh handmade soap promotional content with natural-inspired music.' },
  'pottery': { name: 'Pottery', prompts: ['Ceramic pottery promo', 'Handmade ceramics video', 'Artisan pottery showcase', 'Clay creations highlight'], subtext: 'Create artistic pottery promotional videos with earthy, organic music.' },
  'artwork': { name: 'Artwork', prompts: ['Original art promo', 'Artist portfolio video', 'Painting showcase', 'Creative vision highlight'], subtext: 'Generate inspiring artwork promotional content with artistic background music.' },
  'photography-prints': { name: 'Photography Prints', prompts: ['Photo prints promo', 'Wall art video', 'Photography showcase', 'Captured moments highlight'], subtext: 'Create stunning photography prints promotional videos with ambient music.' },
  'digital-products': { name: 'Digital Products', prompts: ['Digital download promo', 'Online product video', 'Digital asset showcase', 'Instant delivery highlight'], subtext: 'Generate modern digital products promotional content with electronic music.' },
  'online-course': { name: 'Online Course', prompts: ['E-learning promo', 'Course launch video', 'Educational content showcase', 'Learn today highlight'], subtext: 'Create professional online course promotional videos with inspiring music.' },
  'ebook': { name: 'E-Book', prompts: ['Ebook launch promo', 'Digital book video', 'Author showcase', 'Read now highlight'], subtext: 'Generate engaging e-book promotional content with thoughtful music.' },
  'subscription-box': { name: 'Subscription Box', prompts: ['Subscription box promo', 'Unboxing experience video', 'Monthly surprise showcase', 'Subscribe now highlight'], subtext: 'Create exciting subscription box promotional videos with upbeat music.' },
  'pet-products': { name: 'Pet Products', prompts: ['Pet supplies promo', 'Pet toys video', 'Animal products showcase', 'Happy pets highlight'], subtext: 'Generate adorable pet products promotional content with playful music.' },
  'baby-products': { name: 'Baby Products', prompts: ['Baby items promo', 'Infant care video', 'Baby essentials showcase', 'New parent highlight'], subtext: 'Create tender baby products promotional videos with gentle music.' },
  'kids-toys': { name: 'Kids Toys', prompts: ['Toy brand promo', 'Playtime video', 'Kids entertainment showcase', 'Fun toys highlight'], subtext: 'Generate fun kids toys promotional content with playful, energetic music.' },
  'home-appliances': { name: 'Home Appliances', prompts: ['Appliance promo', 'Kitchen gadget video', 'Home product showcase', 'Life easier highlight'], subtext: 'Create modern home appliances promotional videos with contemporary music.' },
  'kitchen-products': { name: 'Kitchen Products', prompts: ['Kitchenware promo', 'Cooking tools video', 'Chef essentials showcase', 'Culinary highlight'], subtext: 'Generate appetizing kitchen products promotional content with upbeat music.' },
  'fitness-equipment': { name: 'Fitness Equipment', prompts: ['Gym equipment promo', 'Home workout video', 'Fitness gear showcase', 'Get fit highlight'], subtext: 'Create energizing fitness equipment promotional videos with workout music.' },
  'outdoor-gear': { name: 'Outdoor Gear', prompts: ['Adventure gear promo', 'Outdoor equipment video', 'Camping gear showcase', 'Explore nature highlight'], subtext: 'Generate adventurous outdoor gear promotional content with nature-inspired music.' },
  'electronics': { name: 'Electronics', prompts: ['Tech product promo', 'Gadget showcase video', 'Electronics launch', 'Innovation highlight'], subtext: 'Create exciting electronics promotional videos with modern electronic music.' },
  'smartphone-accessories': { name: 'Phone Accessories', prompts: ['Phone case promo', 'Mobile accessories video', 'Device protection showcase', 'Style your phone highlight'], subtext: 'Generate trendy phone accessories promotional content with upbeat music.' },
  'gaming-products': { name: 'Gaming Products', prompts: ['Gaming gear promo', 'Gamer setup video', 'Gaming accessories showcase', 'Level up highlight'], subtext: 'Create exciting gaming products promotional videos with epic gaming music.' },
  'audio-equipment': { name: 'Audio Equipment', prompts: ['Headphones promo', 'Speaker showcase video', 'Audio gear highlight', 'Sound quality showcase'], subtext: 'Generate immersive audio equipment promotional content with quality music.' },
  'watches': { name: 'Watches', prompts: ['Timepiece promo', 'Watch collection video', 'Luxury watch showcase', 'Craftsmanship highlight'], subtext: 'Create elegant watch promotional videos with sophisticated music.' },
  'sunglasses': { name: 'Sunglasses', prompts: ['Eyewear promo', 'Sunglasses collection video', 'Summer style showcase', 'UV protection highlight'], subtext: 'Generate cool sunglasses promotional content with trendy summer music.' },
  'bags-purses': { name: 'Bags & Purses', prompts: ['Handbag promo', 'Designer bag video', 'Fashion accessories showcase', 'Style statement highlight'], subtext: 'Create stylish bags promotional videos with fashionable background music.' },
  'shoes': { name: 'Shoes', prompts: ['Footwear promo', 'Shoe collection video', 'Sneaker drop showcase', 'Walk in style highlight'], subtext: 'Generate trendy shoes promotional content with urban, stylish music.' },
  'activewear': { name: 'Activewear', prompts: ['Athletic wear promo', 'Workout clothes video', 'Fitness fashion showcase', 'Move in style highlight'], subtext: 'Create energetic activewear promotional videos with workout music.' },
  'swimwear': { name: 'Swimwear', prompts: ['Swimsuit promo', 'Beach wear video', 'Summer collection showcase', 'Pool ready highlight'], subtext: 'Generate sunny swimwear promotional content with tropical beach music.' },
  'lingerie': { name: 'Lingerie', prompts: ['Intimate apparel promo', 'Lingerie collection video', 'Comfort luxury showcase', 'Confidence highlight'], subtext: 'Create elegant lingerie promotional videos with sophisticated music.' },
  'supplements': { name: 'Supplements', prompts: ['Health supplements promo', 'Vitamin products video', 'Wellness showcase', 'Better health highlight'], subtext: 'Generate healthy supplements promotional content with uplifting music.' },
  'organic-food': { name: 'Organic Food', prompts: ['Organic products promo', 'Natural food video', 'Healthy eating showcase', 'Farm fresh highlight'], subtext: 'Create fresh organic food promotional videos with natural, earthy music.' },
  'coffee-products': { name: 'Coffee Products', prompts: ['Coffee brand promo', 'Artisan roast video', 'Coffee lover showcase', 'Morning ritual highlight'], subtext: 'Generate cozy coffee products promotional content with warm, inviting music.' },
  'tea-products': { name: 'Tea Products', prompts: ['Tea collection promo', 'Artisan tea video', 'Tea ceremony showcase', 'Relaxation highlight'], subtext: 'Create calming tea products promotional videos with serene music.' },
  'wine-spirits': { name: 'Wine & Spirits', prompts: ['Wine brand promo', 'Craft spirits video', 'Tasting experience showcase', 'Cheers highlight'], subtext: 'Generate sophisticated wine and spirits promotional content with elegant music.' },
  'craft-beer': { name: 'Craft Beer', prompts: ['Craft brewery promo', 'Beer tasting video', 'Artisan brew showcase', 'Hoppy highlight'], subtext: 'Create refreshing craft beer promotional videos with casual, fun music.' },
  'sauces-condiments': { name: 'Sauces & Condiments', prompts: ['Gourmet sauce promo', 'Artisan condiment video', 'Flavor showcase', 'Taste upgrade highlight'], subtext: 'Generate appetizing sauces promotional content with fun, food-inspired music.' },
  'baked-goods': { name: 'Baked Goods', prompts: ['Bakery products promo', 'Fresh baked video', 'Artisan bread showcase', 'Homemade highlight'], subtext: 'Create warm baked goods promotional videos with cozy, inviting music.' },
  'chocolate': { name: 'Chocolate', prompts: ['Artisan chocolate promo', 'Luxury chocolate video', 'Confection showcase', 'Sweet indulgence highlight'], subtext: 'Generate decadent chocolate promotional content with rich, elegant music.' },
  'stationery': { name: 'Stationery', prompts: ['Paper goods promo', 'Stationery collection video', 'Planner showcase', 'Organization highlight'], subtext: 'Create charming stationery promotional videos with creative, inspiring music.' },
  'art-supplies': { name: 'Art Supplies', prompts: ['Artist supplies promo', 'Creative tools video', 'Art materials showcase', 'Create today highlight'], subtext: 'Generate inspiring art supplies promotional content with artistic music.' },
  'plants': { name: 'Plants', prompts: ['Plant shop promo', 'Indoor plants video', 'Green living showcase', 'Plant parent highlight'], subtext: 'Create fresh plants promotional videos with nature-inspired, calming music.' },
  'home-fragrance': { name: 'Home Fragrance', prompts: ['Room scent promo', 'Diffuser video', 'Aromatherapy showcase', 'Fresh home highlight'], subtext: 'Generate relaxing home fragrance promotional content with ambient music.' },
  'bedding': { name: 'Bedding', prompts: ['Luxury bedding promo', 'Sleep essentials video', 'Comfort showcase', 'Better sleep highlight'], subtext: 'Create cozy bedding promotional videos with soothing, peaceful music.' },
  'cleaning-products': { name: 'Cleaning Products', prompts: ['Eco cleaning promo', 'Natural cleaners video', 'Clean home showcase', 'Fresh and clean highlight'], subtext: 'Generate fresh cleaning products promotional content with upbeat music.' },
  'outdoor-furniture': { name: 'Outdoor Furniture', prompts: ['Patio furniture promo', 'Outdoor living video', 'Garden decor showcase', 'Backyard oasis highlight'], subtext: 'Create relaxing outdoor furniture promotional videos with summer music.' },
  'vintage-items': { name: 'Vintage Items', prompts: ['Vintage collection promo', 'Retro finds video', 'Antique showcase', 'Timeless style highlight'], subtext: 'Generate nostalgic vintage items promotional content with retro-inspired music.' },
  'upcycled-products': { name: 'Upcycled Products', prompts: ['Sustainable products promo', 'Eco-friendly video', 'Upcycled showcase', 'Green living highlight'], subtext: 'Create eco-conscious upcycled products promotional videos with nature music.' },
  'custom-gifts': { name: 'Custom Gifts', prompts: ['Personalized gifts promo', 'Custom creation video', 'Unique presents showcase', 'Perfect gift highlight'], subtext: 'Generate heartfelt custom gifts promotional content with emotional music.' },
};

// =============================================================================
// CONTENT CREATOR DATA
// =============================================================================
const contentCreatorData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'vlogger': { name: 'Vlogger', prompts: ['Daily vlog music', 'Travel vlog soundtrack', 'Lifestyle vlog background', 'Vlog intro theme'], subtext: 'Create perfect background music and intros for your vlogs.' },
  'gaming-streamer': { name: 'Gaming Streamer', prompts: ['Stream starting music', 'Gaming session background', 'Victory celebration', 'Chill gaming vibes'], subtext: 'Generate epic gaming music for your Twitch or YouTube streams.' },
  'beauty-influencer': { name: 'Beauty Influencer', prompts: ['Makeup tutorial music', 'Beauty routine background', 'Get ready with me soundtrack', 'Glam transformation music'], subtext: 'Create trendy background music for beauty and makeup content.' },
  'fitness-influencer': { name: 'Fitness Influencer', prompts: ['Workout video music', 'Fitness motivation track', 'Exercise routine background', 'Gym session soundtrack'], subtext: 'Generate high-energy music for workout videos and fitness content.' },
  'food-blogger': { name: 'Food Blogger', prompts: ['Cooking video music', 'Recipe tutorial background', 'Food photography music', 'Kitchen vibes soundtrack'], subtext: 'Create appetizing background music for cooking and food content.' },
  'travel-blogger': { name: 'Travel Blogger', prompts: ['Adventure travel music', 'Destination video soundtrack', 'Wanderlust vibes', 'Travel montage music'], subtext: 'Generate wanderlust-inspiring music for your travel content.' },
  'tech-reviewer': { name: 'Tech Reviewer', prompts: ['Tech review background', 'Unboxing video music', 'Gadget showcase soundtrack', 'Product demo music'], subtext: 'Create modern, tech-inspired background music for reviews.' },
  'asmr-creator': { name: 'ASMR Creator', prompts: ['Gentle ASMR background', 'Relaxing ambient music', 'Sleep ASMR sounds', 'Calming soundscape'], subtext: 'Generate soothing ambient music for ASMR content.' },
  'comedy-creator': { name: 'Comedy Creator', prompts: ['Funny sketch music', 'Comedy skit background', 'Comedic timing music', 'Silly sound effects'], subtext: 'Create fun, playful music for comedy sketches and videos.' },
  'educational-creator': { name: 'Educational Creator', prompts: ['Explainer video music', 'Tutorial background', 'Learning content soundtrack', 'Focus study music'], subtext: 'Generate focused background music for educational content.' },
  'music-producer': { name: 'Music Producer', prompts: ['Beat making inspiration', 'Production tutorial background', 'Studio session vibes', 'Creative flow music'], subtext: 'Create inspiring background music for music production content.' },
  'photographer': { name: 'Photographer', prompts: ['Photo shoot music', 'Behind the scenes soundtrack', 'Portfolio showcase music', 'Creative session vibes'], subtext: 'Generate artistic background music for photography content.' },
  'artist-creator': { name: 'Artist Creator', prompts: ['Art tutorial music', 'Painting session background', 'Creative process soundtrack', 'Studio vibes music'], subtext: 'Create inspiring music for art and creative process content.' },
  'diy-creator': { name: 'DIY Creator', prompts: ['Craft tutorial music', 'DIY project background', 'Making things soundtrack', 'Creative hands music'], subtext: 'Generate fun, productive background music for DIY content.' },
  'lifestyle-influencer': { name: 'Lifestyle Influencer', prompts: ['Day in my life music', 'Aesthetic vibes background', 'Morning routine soundtrack', 'Self care music'], subtext: 'Create aesthetic background music for lifestyle content.' },
  'motivational-speaker': { name: 'Motivational Speaker', prompts: ['Inspirational speech music', 'Motivation background', 'Uplifting talk soundtrack', 'Success mindset music'], subtext: 'Generate powerful, uplifting music for motivational content.' },
  'book-reviewer': { name: 'Book Reviewer', prompts: ['Bookish atmosphere music', 'Reading vibes background', 'Literary soundtrack', 'Cozy book music'], subtext: 'Create cozy, literary background music for book content.' },
  'pet-content-creator': { name: 'Pet Content Creator', prompts: ['Cute pet video music', 'Animal content background', 'Playful pet soundtrack', 'Adorable moments music'], subtext: 'Generate adorable, playful music for pet content.' },
  'parenting-creator': { name: 'Parenting Creator', prompts: ['Family vlog music', 'Parenting tips background', 'Kids activity soundtrack', 'Family moments music'], subtext: 'Create warm, family-friendly music for parenting content.' },
  'minimalist-creator': { name: 'Minimalist Creator', prompts: ['Minimal aesthetic music', 'Simple living background', 'Declutter soundtrack', 'Calm minimal vibes'], subtext: 'Generate calm, minimal background music for simplicity content.' },
  'finance-creator': { name: 'Finance Creator', prompts: ['Money tips background', 'Investment video music', 'Financial education soundtrack', 'Success money music'], subtext: 'Create professional background music for finance content.' },
  'true-crime-creator': { name: 'True Crime Creator', prompts: ['Mystery investigation music', 'True crime background', 'Suspenseful storytelling soundtrack', 'Dark mystery vibes'], subtext: 'Generate suspenseful, atmospheric music for true crime content.' },
  'history-creator': { name: 'History Creator', prompts: ['Historical documentary music', 'Period piece background', 'Epic history soundtrack', 'Timeless era music'], subtext: 'Create cinematic background music for history content.' },
  'science-creator': { name: 'Science Creator', prompts: ['Science explainer music', 'Discovery background', 'Experiment soundtrack', 'Curious minds music'], subtext: 'Generate inspiring, wonder-filled music for science content.' },
  'fashion-influencer': { name: 'Fashion Influencer', prompts: ['Runway style music', 'Fashion haul background', 'Outfit showcase soundtrack', 'Trendy style music'], subtext: 'Create chic, trendy background music for fashion content.' },
};

// =============================================================================
// SONGS ABOUT LIFE TOPICS
// =============================================================================
const lifeSongData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'laundry': { name: 'Laundry', prompts: ['Funny laundry day song', 'Washing machine beat', 'Folding clothes tune', 'Laundry room anthem'], subtext: 'Create fun songs about doing laundry and household chores.' },
  'cooking': { name: 'Cooking', prompts: ['Kitchen cooking song', 'Chef anthem', 'Recipe rhythm', 'Cooking dance beat'], subtext: 'Generate catchy songs about cooking and being in the kitchen.' },
  'cleaning': { name: 'Cleaning', prompts: ['Cleaning motivation song', 'Tidy up anthem', 'Housework beat', 'Spotless home tune'], subtext: 'Create energizing songs to motivate cleaning and tidying.' },
  'morning-routine': { name: 'Morning Routine', prompts: ['Wake up song', 'Morning motivation anthem', 'Start the day tune', 'Rise and shine beat'], subtext: 'Generate uplifting songs about morning routines and starting the day.' },
  'bedtime': { name: 'Bedtime', prompts: ['Goodnight song', 'Sleep time lullaby', 'Bedtime routine tune', 'Dreams await melody'], subtext: 'Create soothing songs about bedtime and going to sleep.' },
  'commute': { name: 'Commute', prompts: ['Driving to work song', 'Traffic jam anthem', 'Subway ride beat', 'Commuter life tune'], subtext: 'Generate songs about commuting and daily travel.' },
  'monday': { name: 'Monday', prompts: ['Monday motivation song', 'Start of week anthem', 'Case of the Mondays beat', 'Monday morning tune'], subtext: 'Create songs about surviving and thriving on Mondays.' },
  'friday': { name: 'Friday', prompts: ['Friday celebration song', 'Weekend is here anthem', 'TGIF beat', 'Friday night tune'], subtext: 'Generate exciting songs about Fridays and weekend anticipation.' },
  'weekend': { name: 'Weekend', prompts: ['Weekend vibes song', 'Saturday fun anthem', 'Sunday relaxation tune', 'Weekend warrior beat'], subtext: 'Create carefree songs about enjoying the weekend.' },
  'working-from-home': { name: 'Working From Home', prompts: ['WFH anthem', 'Home office song', 'Pajama workday tune', 'Remote work beat'], subtext: 'Generate relatable songs about working from home life.' },
  'coffee': { name: 'Coffee', prompts: ['Coffee lover song', 'Morning brew anthem', 'Caffeine addiction tune', 'Coffee break beat'], subtext: 'Create fun songs celebrating coffee and caffeine culture.' },
  'exercise': { name: 'Exercise', prompts: ['Workout motivation song', 'Exercise anthem', 'Gym pump beat', 'Fitness journey tune'], subtext: 'Generate motivating songs about exercise and working out.' },
  'diet': { name: 'Dieting', prompts: ['Healthy eating song', 'Diet struggle anthem', 'Fitness food tune', 'Salad life beat'], subtext: 'Create songs about dieting, healthy eating, and food choices.' },
  'shopping': { name: 'Shopping', prompts: ['Retail therapy song', 'Shopping spree anthem', 'Mall trip beat', 'Online shopping tune'], subtext: 'Generate fun songs about shopping and retail adventures.' },
  'social-media': { name: 'Social Media', prompts: ['Instagram life song', 'TikTok addiction anthem', 'Social media detox tune', 'Scroll and post beat'], subtext: 'Create songs about social media culture and digital life.' },
  'phone-addiction': { name: 'Phone Addiction', prompts: ['Smartphone song', 'Screen time anthem', 'Digital detox tune', 'Always online beat'], subtext: 'Generate songs about phone addiction and digital wellness.' },
  'procrastination': { name: 'Procrastination', prompts: ['Procrastinator anthem', 'Do it later song', 'Deadline panic tune', 'Tomorrow will do beat'], subtext: 'Create relatable songs about procrastination and avoidance.' },
  'adulting': { name: 'Adulting', prompts: ['Adulting is hard song', 'Grown up life anthem', 'Bills and responsibilities tune', 'Adult problems beat'], subtext: 'Generate songs about the struggles and joys of being an adult.' },
  'taxes': { name: 'Taxes', prompts: ['Tax season song', 'IRS blues anthem', 'Deductions and receipts tune', 'April deadline beat'], subtext: 'Create funny songs about taxes and tax season.' },
  'bills': { name: 'Bills', prompts: ['Paying bills song', 'Bill pile anthem', 'Expenses everywhere tune', 'Budget life beat'], subtext: 'Generate relatable songs about bills and expenses.' },
  'traffic': { name: 'Traffic', prompts: ['Stuck in traffic song', 'Road rage anthem', 'Commuter chaos tune', 'Highway standstill beat'], subtext: 'Create songs about traffic jams and commuting frustrations.' },
  'weather': { name: 'Weather', prompts: ['Rainy day song', 'Sunny weather anthem', 'Weather changes tune', 'Seasons shifting beat'], subtext: 'Generate songs about weather and seasonal changes.' },
  'aging': { name: 'Aging', prompts: ['Getting older song', 'Age gracefully anthem', 'Birthday years tune', 'Time flies beat'], subtext: 'Create thoughtful songs about aging and growing older.' },
  'technology': { name: 'Technology', prompts: ['Tech troubles song', 'Digital age anthem', 'Update required tune', 'Tech support beat'], subtext: 'Generate songs about technology and modern digital life.' },
  'self-care': { name: 'Self Care', prompts: ['Self care Sunday song', 'Me time anthem', 'Self love tune', 'Taking care of me beat'], subtext: 'Create soothing songs about self-care and personal wellness.' },
};

// =============================================================================
// EMOTIONAL/THERAPEUTIC SONGS
// =============================================================================
const emotionalSongData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'grief': { name: 'Grief & Loss', prompts: ['Mourning song', 'Loss of loved one anthem', 'Grief journey tune', 'Missing you forever beat'], subtext: 'Create healing songs to help process grief and loss.' },
  'mourning': { name: 'Mourning', prompts: ['In memory song', 'Funeral tribute anthem', 'Heaven bound tune', 'Rest in peace melody'], subtext: 'Generate touching songs for mourning and remembrance.' },
  'healing': { name: 'Healing', prompts: ['Healing journey song', 'Recovery anthem', 'Getting better tune', 'Strength returns beat'], subtext: 'Create hopeful songs about healing and recovery.' },
  'depression': { name: 'Depression', prompts: ['Depression awareness song', 'Dark times anthem', 'Light through darkness tune', 'Mental health matters beat'], subtext: 'Generate supportive songs about depression and mental health.' },
  'anxiety': { name: 'Anxiety', prompts: ['Calm anxiety song', 'Worry less anthem', 'Peace of mind tune', 'Breathe through it beat'], subtext: 'Create calming songs to help with anxiety and stress.' },
  'loneliness': { name: 'Loneliness', prompts: ['Alone but okay song', 'Lonely nights anthem', 'Finding yourself tune', 'Solo journey beat'], subtext: 'Generate comforting songs about loneliness and self-discovery.' },
  'heartbreak': { name: 'Heartbreak', prompts: ['Broken heart song', 'Love lost anthem', 'Tears and healing tune', 'Moving on beat'], subtext: 'Create emotional songs about heartbreak and lost love.' },
  'divorce': { name: 'Divorce', prompts: ['Divorce journey song', 'New chapter anthem', 'Letting go tune', 'Starting over beat'], subtext: 'Generate supportive songs about divorce and new beginnings.' },
  'tough-times': { name: 'Tough Times', prompts: ['Hard times song', 'Struggle anthem', 'Keep going tune', 'This too shall pass beat'], subtext: 'Create encouraging songs to help through difficult times.' },
  'overcoming': { name: 'Overcoming', prompts: ['Overcome obstacles song', 'Victory anthem', 'Rise above tune', 'Stronger now beat'], subtext: 'Generate inspiring songs about overcoming challenges.' },
  'hope': { name: 'Hope', prompts: ['Hope returns song', 'Brighter days anthem', 'Light ahead tune', 'Never give up beat'], subtext: 'Create uplifting songs about hope and optimism.' },
  'strength': { name: 'Strength', prompts: ['Inner strength song', 'Warrior anthem', 'Unbreakable tune', 'Power within beat'], subtext: 'Generate empowering songs about finding inner strength.' },
  'self-worth': { name: 'Self Worth', prompts: ['Know your worth song', 'Self value anthem', 'I am enough tune', 'Worthy of love beat'], subtext: 'Create affirming songs about self-worth and value.' },
  'forgiveness': { name: 'Forgiveness', prompts: ['Forgiveness song', 'Letting go of anger anthem', 'Peace through forgiveness tune', 'Free yourself beat'], subtext: 'Generate healing songs about forgiveness and letting go.' },
  'gratitude': { name: 'Gratitude', prompts: ['Gratitude song', 'Thankful heart anthem', 'Blessed life tune', 'Count blessings beat'], subtext: 'Create thankful songs about gratitude and appreciation.' },
  'life-lessons': { name: 'Life Lessons', prompts: ['Wisdom learned song', 'Life lesson anthem', 'Growing wiser tune', 'Experience teaches beat'], subtext: 'Generate thoughtful songs about life lessons and wisdom.' },
  'perseverance': { name: 'Perseverance', prompts: ['Keep pushing song', 'Never quit anthem', 'Persistence tune', 'One more step beat'], subtext: 'Create motivating songs about perseverance and determination.' },
  'change': { name: 'Change', prompts: ['Embracing change song', 'New season anthem', 'Transform tune', 'Different now beat'], subtext: 'Generate hopeful songs about change and transformation.' },
  'acceptance': { name: 'Acceptance', prompts: ['Accept and move on song', 'It is what it is anthem', 'Peace with reality tune', 'Letting go beat'], subtext: 'Create peaceful songs about acceptance and peace.' },
  'self-love': { name: 'Self Love', prompts: ['Love yourself song', 'Self acceptance anthem', 'Beautiful me tune', 'Self appreciation beat'], subtext: 'Generate empowering songs about self-love and acceptance.' },
};

// =============================================================================
// FUNNY/NOVELTY SONGS
// =============================================================================
const funnySongData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'funny': { name: 'Funny', prompts: ['Hilarious comedy song', 'Laugh out loud anthem', 'Silly tune', 'Comedic masterpiece'], subtext: 'Create laugh-out-loud funny songs for entertainment.' },
  'parody': { name: 'Parody', prompts: ['Song parody', 'Funny remake anthem', 'Comedic twist tune', 'Parody hit beat'], subtext: 'Generate funny parody-style songs and humorous takes.' },
  'silly': { name: 'Silly', prompts: ['Silly nonsense song', 'Goofy anthem', 'Ridiculous tune', 'Absurd beat'], subtext: 'Create silly, nonsensical songs for pure fun.' },
  'sarcastic': { name: 'Sarcastic', prompts: ['Sarcastic commentary song', 'Ironic anthem', 'Eye roll tune', 'Dry humor beat'], subtext: 'Generate witty, sarcastic songs with sharp humor.' },
  'roast': { name: 'Roast', prompts: ['Roast song', 'Burn anthem', 'Friendly roast tune', 'Playful diss beat'], subtext: 'Create playful roast songs for friends and fun.' },
  'awkward': { name: 'Awkward', prompts: ['Awkward moments song', 'Cringe anthem', 'Social fails tune', 'Embarrassing beat'], subtext: 'Generate relatable songs about awkward situations.' },
  'dad-jokes': { name: 'Dad Jokes', prompts: ['Dad joke song', 'Punny anthem', 'Cheesy joke tune', 'Groan-worthy beat'], subtext: 'Create songs full of dad jokes and puns.' },
  'complaints': { name: 'Complaints', prompts: ['First world problems song', 'Complaining anthem', 'Whining tune', 'Petty grievances beat'], subtext: 'Generate funny songs about everyday complaints.' },
  'absurd': { name: 'Absurd', prompts: ['Completely absurd song', 'Makes no sense anthem', 'Random chaos tune', 'Weird and wonderful beat'], subtext: 'Create wonderfully absurd and random songs.' },
  'meme': { name: 'Meme', prompts: ['Meme song', 'Internet culture anthem', 'Viral content tune', 'Trending meme beat'], subtext: 'Generate meme-worthy songs for internet culture.' },
};

// =============================================================================
// RELATIONSHIP SONGS
// =============================================================================
const relationshipSongData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'best-friend': { name: 'Best Friend', prompts: ['Best friends forever song', 'Friendship anthem', 'BFF tune', 'Soul sister beat'], subtext: 'Create heartfelt songs celebrating best friendships.' },
  'sibling': { name: 'Sibling', prompts: ['Brother sister song', 'Sibling love anthem', 'Family bond tune', 'Sibling rivalry beat'], subtext: 'Generate songs about sibling relationships and bonds.' },
  'parent': { name: 'Parent', prompts: ['Thank you parents song', 'Mom and dad anthem', 'Parental love tune', 'Raised me right beat'], subtext: 'Create touching songs honoring parents.' },
  'grandparent': { name: 'Grandparent', prompts: ['Grandparents song', 'Grandma grandpa anthem', 'Generational wisdom tune', 'Family legacy beat'], subtext: 'Generate sweet songs about grandparents and family.' },
  'child': { name: 'Child', prompts: ['Song for my child', 'Parental love anthem', 'My baby tune', 'Watching you grow beat'], subtext: 'Create loving songs from parents to children.' },
  'spouse': { name: 'Spouse', prompts: ['Love my spouse song', 'Marriage anthem', 'Forever partner tune', 'Married life beat'], subtext: 'Generate romantic songs celebrating marriage and partnership.' },
  'long-distance': { name: 'Long Distance', prompts: ['Long distance love song', 'Miles apart anthem', 'Missing you tune', 'Until we meet beat'], subtext: 'Create songs about long-distance relationships.' },
  'new-relationship': { name: 'New Relationship', prompts: ['New love song', 'Falling for you anthem', 'Butterflies tune', 'Getting to know you beat'], subtext: 'Generate exciting songs about new relationships.' },
  'anniversary': { name: 'Anniversary', prompts: ['Anniversary song', 'Years together anthem', 'Celebrating us tune', 'Love grows beat'], subtext: 'Create romantic anniversary celebration songs.' },
  'pet-love': { name: 'Pet Love', prompts: ['My dog song', 'Cat parent anthem', 'Pet best friend tune', 'Fur baby beat'], subtext: 'Generate adorable songs about beloved pets.' },
  'teacher': { name: 'Teacher', prompts: ['Thank you teacher song', 'Educator appreciation anthem', 'Learning from you tune', 'Teacher impact beat'], subtext: 'Create appreciation songs for teachers and mentors.' },
  'mentor': { name: 'Mentor', prompts: ['Mentor appreciation song', 'Guide in life anthem', 'Wisdom shared tune', 'Thank you mentor beat'], subtext: 'Generate grateful songs honoring mentors.' },
  'coworker': { name: 'Coworker', prompts: ['Work buddy song', 'Office friend anthem', 'Coworker appreciation tune', 'Team spirit beat'], subtext: 'Create fun songs about workplace friendships.' },
  'neighbor': { name: 'Neighbor', prompts: ['Good neighbor song', 'Next door friend anthem', 'Community spirit tune', 'Neighborhood beat'], subtext: 'Generate friendly songs about good neighbors.' },
  'online-friend': { name: 'Online Friend', prompts: ['Internet friend song', 'Never met but close anthem', 'Digital friendship tune', 'Online connection beat'], subtext: 'Create songs celebrating online friendships.' },
};

// =============================================================================
// ACTIVITY/HOBBY SONGS
// =============================================================================
const hobbySongData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'gaming': { name: 'Gaming', prompts: ['Gamer life song', 'Video game anthem', 'Level up tune', 'Victory royale beat'], subtext: 'Create epic songs about gaming and gamer culture.' },
  'reading': { name: 'Reading', prompts: ['Bookworm song', 'Reading is magic anthem', 'Lost in pages tune', 'Book lover beat'], subtext: 'Generate cozy songs about reading and books.' },
  'gardening': { name: 'Gardening', prompts: ['Garden song', 'Green thumb anthem', 'Growing things tune', 'Plant life beat'], subtext: 'Create peaceful songs about gardening and nature.' },
  'photography': { name: 'Photography', prompts: ['Photographer song', 'Capture moments anthem', 'Through the lens tune', 'Perfect shot beat'], subtext: 'Generate artistic songs about photography.' },
  'painting': { name: 'Painting', prompts: ['Artist painting song', 'Canvas and colors anthem', 'Creative expression tune', 'Brush strokes beat'], subtext: 'Create inspiring songs about painting and art.' },
  'writing': { name: 'Writing', prompts: ['Writer life song', 'Words flow anthem', 'Storyteller tune', 'Creative writing beat'], subtext: 'Generate thoughtful songs about writing and creativity.' },
  'hiking': { name: 'Hiking', prompts: ['Trail hiking song', 'Mountain adventure anthem', 'Nature walk tune', 'Summit bound beat'], subtext: 'Create adventurous songs about hiking and trails.' },
  'camping': { name: 'Camping', prompts: ['Camping song', 'Campfire anthem', 'Outdoor adventure tune', 'Starry night beat'], subtext: 'Generate cozy songs about camping adventures.' },
  'fishing': { name: 'Fishing', prompts: ['Fishing song', 'Catch of the day anthem', 'Peaceful fishing tune', 'By the water beat'], subtext: 'Create relaxing songs about fishing.' },
  'surfing': { name: 'Surfing', prompts: ['Surfing song', 'Catch a wave anthem', 'Beach surfer tune', 'Ocean vibes beat'], subtext: 'Generate chill songs about surfing and beach life.' },
  'skateboarding': { name: 'Skateboarding', prompts: ['Skater song', 'Shred anthem', 'Kickflip tune', 'Skatepark beat'], subtext: 'Create edgy songs about skateboarding culture.' },
  'cycling': { name: 'Cycling', prompts: ['Cycling song', 'Bike ride anthem', 'Pedal power tune', 'Two wheels beat'], subtext: 'Generate energetic songs about cycling.' },
  'running': { name: 'Running', prompts: ['Runner song', 'Marathon anthem', 'Keep running tune', 'Mile after mile beat'], subtext: 'Create motivating songs about running.' },
  'yoga-hobby': { name: 'Yoga', prompts: ['Yoga practice song', 'Namaste anthem', 'Inner peace tune', 'Meditation flow beat'], subtext: 'Generate peaceful songs about yoga practice.' },
  'dancing': { name: 'Dancing', prompts: ['Love to dance song', 'Dance floor anthem', 'Move your body tune', 'Dancing queen beat'], subtext: 'Create fun songs about dancing and movement.' },
  'cooking-hobby': { name: 'Cooking', prompts: ['Home chef song', 'Kitchen magic anthem', 'Recipe master tune', 'Cooking passion beat'], subtext: 'Generate delicious songs about cooking as a hobby.' },
  'baking-hobby': { name: 'Baking', prompts: ['Baking song', 'Fresh baked anthem', 'Sweet treats tune', 'Oven love beat'], subtext: 'Create sweet songs about baking.' },
  'crafting': { name: 'Crafting', prompts: ['Crafter song', 'DIY anthem', 'Handmade love tune', 'Creative craft beat'], subtext: 'Generate creative songs about crafting.' },
  'knitting': { name: 'Knitting', prompts: ['Knitting song', 'Yarn and needles anthem', 'Cozy creation tune', 'Stitch by stitch beat'], subtext: 'Create cozy songs about knitting.' },
  'collecting': { name: 'Collecting', prompts: ['Collector song', 'Treasure hunt anthem', 'Collection grows tune', 'Rare finds beat'], subtext: 'Generate exciting songs about collecting hobbies.' },
  'bird-watching': { name: 'Bird Watching', prompts: ['Birder song', 'Feathered friends anthem', 'Bird spotting tune', 'Wings and songs beat'], subtext: 'Create peaceful songs about bird watching.' },
  'astronomy': { name: 'Astronomy', prompts: ['Stargazer song', 'Cosmic wonder anthem', 'Night sky tune', 'Universe amazes beat'], subtext: 'Generate awe-inspiring songs about astronomy.' },
  'woodworking': { name: 'Woodworking', prompts: ['Woodworker song', 'Sawdust anthem', 'Craft with wood tune', 'Workshop beat'], subtext: 'Create satisfying songs about woodworking.' },
  'podcasting': { name: 'Podcasting', prompts: ['Podcaster song', 'On the mic anthem', 'Audio content tune', 'Episode drops beat'], subtext: 'Generate fun songs about podcasting.' },
  'streaming': { name: 'Streaming', prompts: ['Streamer life song', 'Going live anthem', 'Content creator tune', 'Chat vibes beat'], subtext: 'Create exciting songs about streaming.' },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function capitalize(str: string): string {
  return str.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function generateGenreRoute(genre: string): RouteConfig {
  const data = genreData[genre];
  const name = data?.name || capitalize(genre);
  const prompts = data?.prompts || [`Create ${name.toLowerCase()} track`, `${name} with vocals`, `Instrumental ${name.toLowerCase()}`, `Modern ${name.toLowerCase()} song`];
  const subtext = data?.subtext || `Create original ${name} music with AI. Generate professional ${name.toLowerCase()} tracks instantly.`;
  
  return {
    path: `/create-${genre}-music`,
    title: `Create ${name} Music with AI - Free ${name} Song Generator | Gruvi`,
    description: `Generate original ${name} music instantly with Gruvi's AI music generator. Create custom ${name.toLowerCase()} songs, beats, and tracks. Free to try, professional quality.`,
    keywords: `${genre} music generator, create ${genre} music, ai ${genre} songs, ${genre} beat maker, free ${genre} music`,
    ogTitle: `Create ${name} Music with AI | Gruvi`,
    ogDescription: `Generate original ${name} music instantly with AI. Professional quality ${name.toLowerCase()} songs.`,
    twitterTitle: `Create ${name} Music with AI | Gruvi`,
    twitterDescription: `Generate original ${name} music instantly. Professional quality songs you can download.`,
    breadcrumbName: `${name} Music`,
    heroTagline: `Create ${name} Music`,
    heroHeading: `${name} Music Generator\nGenerate ${name.toLowerCase()} music with AI`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generateLanguageRoute(lang: string): RouteConfig {
  const data = languageData[lang];
  const name = data?.name || capitalize(lang);
  const prompts = data?.prompts || [`Pop song in ${name}`, `${name} love ballad`, `Hip-hop track in ${name}`, `${name} dance music`];
  
  return {
    path: `/create-music-in-${lang}`,
    title: `Create Music in ${name} - AI ${name} Song Generator | Gruvi`,
    description: `Generate original songs in ${name} with Gruvi's AI music generator. Create ${name.toLowerCase()} lyrics and vocals, any genre.`,
    keywords: `${lang} music generator, ${lang} songs, ai ${lang} lyrics, create ${lang} music`,
    ogTitle: `Create Music in ${name} | Gruvi`,
    ogDescription: `Generate original songs in ${name} with AI. Create ${name.toLowerCase()} lyrics and vocals.`,
    twitterTitle: `Create Music in ${name} | Gruvi`,
    twitterDescription: `Generate original ${name} songs with AI. Any genre, professional quality.`,
    breadcrumbName: `${name} Music`,
    heroTagline: `${name} Music Generator`,
    heroHeading: `${name} Music Generator\nCreate songs in ${name} with AI`,
    heroSubtext: `Generate original songs with ${name} lyrics and vocals. Create authentic ${name.toLowerCase()} music in any genre with AI.`,
    examplePrompts: prompts
  };
}

function generateHolidayRoute(holiday: string): RouteConfig {
  const data = holidayData[holiday];
  const name = data?.name || capitalize(holiday);
  const prompts = data?.prompts || [`${name} celebration song`, `${name} party music`, `${name} themed track`, `Happy ${name} anthem`];
  const subtext = data?.subtext || `Create original ${name} music and songs with AI. Generate custom ${name.toLowerCase()} tracks and celebration music.`;
  
  return {
    path: `/${holiday}-music`,
    title: `${name} Music Generator - Create ${name} Songs | Gruvi`,
    description: `Create original ${name} music and songs with AI. Generate custom ${name.toLowerCase()} tracks, jingles, and celebration music.`,
    keywords: `${holiday} music, ${holiday} songs, ${holiday} jingle, create ${holiday} music`,
    ogTitle: `${name} Music Generator | Gruvi`,
    ogDescription: `Create original ${name} music with AI. Custom songs, jingles, and celebration tracks.`,
    twitterTitle: `${name} Music Generator | Gruvi`,
    twitterDescription: `Create original ${name} music and songs with AI.`,
    breadcrumbName: `${name} Music`,
    heroTagline: `${name} Music Generator`,
    heroHeading: `${name} Music Generator\nCreate ${name.toLowerCase()} songs with AI`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generateVideoStyleRoute(style: string): RouteConfig {
  const data = videoStyleData[style];
  const name = data?.name || capitalize(style);
  const prompts = data?.prompts || [`${name} style music video`, `${name} visual theme`, `${name} aesthetic track`, `${name} animation music`];
  
  return {
    path: `/create-${style}-music-video`,
    title: `Create ${name} Music Videos with AI | Gruvi`,
    description: `Generate stunning ${name} style music videos with AI. Transform your songs into visual masterpieces.`,
    keywords: `${style} music video, ${style} animation, ai ${style} video, create ${style} visuals`,
    ogTitle: `Create ${name} Music Videos | Gruvi`,
    ogDescription: `Generate stunning ${name} style music videos. Transform songs into visual masterpieces.`,
    twitterTitle: `${name} Music Videos | Gruvi`,
    twitterDescription: `Create ${name} style music videos with AI.`,
    breadcrumbName: `${name} Videos`,
    heroTagline: `${name} Music Videos`,
    heroHeading: `${name} Music Videos\nCreate ${name.toLowerCase()} style music videos`,
    heroSubtext: `Generate stunning ${name} style music videos with AI. Transform your songs into visual masterpieces with ${name.toLowerCase()} aesthetics.`,
    examplePrompts: prompts
  };
}

function generatePlatformRoute(platform: string): RouteConfig {
  const data = platformData[platform];
  const name = data?.name || capitalize(platform);
  const prompts = data?.prompts || [`${name} background music`, `${name} intro theme`, `${name} content track`, `${name} audio`];
  const subtext = data?.subtext || `Create perfect music for ${name} with AI. Generate royalty-free tracks optimized for ${name.toLowerCase()} content.`;
  
  return {
    path: `/music-for-${platform}`,
    title: `Music for ${name} - AI Music Generator | Gruvi`,
    description: `Create perfect music for ${name} with AI. Generate royalty-free tracks optimized for ${name.toLowerCase()} content.`,
    keywords: `${platform} music, music for ${platform}, ${platform} background music, ${platform} royalty free`,
    ogTitle: `Music for ${name} | Gruvi`,
    ogDescription: `Create perfect music for ${name}. Royalty-free, copyright-safe tracks.`,
    twitterTitle: `Music for ${name} | Gruvi`,
    twitterDescription: `Create perfect music for ${name} content.`,
    breadcrumbName: `${name} Music`,
    heroTagline: `Music for ${name}`,
    heroHeading: `Music for ${name}\nCreate royalty-free tracks for ${name.toLowerCase()}`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generateMoodRoute(mood: string): RouteConfig {
  const data = moodData[mood];
  const name = data?.name || capitalize(mood);
  const prompts = data?.prompts || [`${name} vibes track`, `${name} mood music`, `${name} atmosphere`, `${name} feeling song`];
  
  return {
    path: `/create-${mood}-music`,
    title: `Create ${name} Music with AI | Gruvi`,
    description: `Generate ${name.toLowerCase()} music instantly with AI. Create tracks that capture the perfect ${name.toLowerCase()} mood.`,
    keywords: `${mood} music, ${mood} songs, ${mood} vibes, create ${mood} music`,
    ogTitle: `Create ${name} Music | Gruvi`,
    ogDescription: `Generate ${name.toLowerCase()} music instantly with AI.`,
    twitterTitle: `${name} Music | Gruvi`,
    twitterDescription: `Create ${name.toLowerCase()} music with AI.`,
    breadcrumbName: `${name} Music`,
    heroTagline: `${name} Music Generator`,
    heroHeading: `${name} Music Generator\nCreate ${name.toLowerCase()} vibes with AI`,
    heroSubtext: `Generate ${name.toLowerCase()} music that perfectly captures the mood. Create tracks with the exact ${name.toLowerCase()} atmosphere you need.`,
    examplePrompts: prompts
  };
}

function generateBeginnerRoute(key: string): RouteConfig {
  const data = beginnerRouteData[key];
  return {
    path: `/${key}`,
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    ogTitle: data.title.split(' - ')[0] + ' | Gruvi',
    ogDescription: data.description.substring(0, 150),
    twitterTitle: data.title.split(' - ')[0] + ' | Gruvi',
    twitterDescription: data.description.substring(0, 150),
    breadcrumbName: capitalize(key),
    heroTagline: data.heroTagline,
    heroHeading: data.heroHeading,
    heroSubtext: data.heroSubtext,
    examplePrompts: data.prompts
  };
}

function generatePromotionalPlaceRoute(place: string): RouteConfig {
  const data = promotionalPlaceData[place];
  const name = data?.name || capitalize(place);
  const prompts = data?.prompts || [`${name} promo video`, `${name} showcase`, `${name} promotional music`, `${name} marketing video`];
  const subtext = data?.subtext || `Create stunning promotional videos for your ${name.toLowerCase()} with AI-generated music and visuals.`;
  
  return {
    path: `/promotional-video-for-${place}`,
    title: `Create ${name} Promotional Video with AI Music | Gruvi`,
    description: `Generate stunning promotional videos for your ${name.toLowerCase()} with AI music. Create marketing content that converts.`,
    keywords: `${place} promotional video, ${place} marketing video, ${place} promo music, ai ${place} video`,
    ogTitle: `${name} Promotional Video | Gruvi`,
    ogDescription: `Create stunning ${name.toLowerCase()} promotional videos with AI music.`,
    twitterTitle: `${name} Promotional Video | Gruvi`,
    twitterDescription: `Generate ${name.toLowerCase()} promotional content with AI.`,
    breadcrumbName: `${name} Promo`,
    heroTagline: `${name} Promotional Videos`,
    heroHeading: `${name} Promotional Videos\nCreate stunning ${name.toLowerCase()} marketing content`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generatePromotionalBusinessRoute(business: string): RouteConfig {
  const data = promotionalBusinessData[business];
  const name = data?.name || capitalize(business);
  const prompts = data?.prompts || [`${name} promo video`, `${name} showcase`, `${name} promotional music`, `${name} marketing video`];
  const subtext = data?.subtext || `Create professional promotional videos for your ${name.toLowerCase()} with AI-generated music.`;
  
  return {
    path: `/promotional-video-for-${business}`,
    title: `Create ${name} Promotional Video with AI | Gruvi`,
    description: `Generate professional promotional videos for your ${name.toLowerCase()} with AI music. Boost your business marketing.`,
    keywords: `${business} promotional video, ${business} marketing, ${business} promo, ai ${business} video`,
    ogTitle: `${name} Promotional Video | Gruvi`,
    ogDescription: `Create professional ${name.toLowerCase()} promotional videos with AI.`,
    twitterTitle: `${name} Promotional Video | Gruvi`,
    twitterDescription: `Generate ${name.toLowerCase()} promotional content with AI.`,
    breadcrumbName: `${name} Promo`,
    heroTagline: `${name} Promotional Videos`,
    heroHeading: `${name} Promotional Videos\nProfessional marketing content with AI`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generatePromotionalProductRoute(product: string): RouteConfig {
  const data = promotionalProductData[product];
  const name = data?.name || capitalize(product);
  const prompts = data?.prompts || [`${name} promo video`, `${name} showcase`, `${name} promotional music`, `${name} marketing video`];
  const subtext = data?.subtext || `Create stunning promotional videos for your ${name.toLowerCase()} with AI-generated music.`;
  
  return {
    path: `/promotional-video-for-${product}`,
    title: `Create ${name} Promotional Video with AI | Gruvi`,
    description: `Generate stunning promotional videos for ${name.toLowerCase()} with AI music. Boost product sales with professional marketing.`,
    keywords: `${product} promotional video, ${product} marketing, ${product} promo, ai product video`,
    ogTitle: `${name} Promotional Video | Gruvi`,
    ogDescription: `Create stunning ${name.toLowerCase()} promotional videos with AI.`,
    twitterTitle: `${name} Promotional Video | Gruvi`,
    twitterDescription: `Generate ${name.toLowerCase()} promotional content with AI.`,
    breadcrumbName: `${name} Promo`,
    heroTagline: `${name} Promotional Videos`,
    heroHeading: `${name} Promotional Videos\nShowcase your products with AI`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generateContentCreatorRoute(creator: string): RouteConfig {
  const data = contentCreatorData[creator];
  const name = data?.name || capitalize(creator);
  const prompts = data?.prompts || [`${name} background music`, `${name} intro`, `${name} content soundtrack`, `${name} video music`];
  const subtext = data?.subtext || `Create perfect background music for ${name.toLowerCase()} content.`;
  
  return {
    path: `/music-for-${creator}`,
    title: `Music for ${name}s - Content Creator Music | Gruvi`,
    description: `Create perfect background music for ${name.toLowerCase()} content. Royalty-free tracks designed for creators.`,
    keywords: `${creator} music, ${creator} background music, ${creator} intro music, content creator music`,
    ogTitle: `Music for ${name}s | Gruvi`,
    ogDescription: `Create perfect music for ${name.toLowerCase()} content.`,
    twitterTitle: `Music for ${name}s | Gruvi`,
    twitterDescription: `Generate ${name.toLowerCase()} content music with AI.`,
    breadcrumbName: `${name} Music`,
    heroTagline: `Music for ${name}s`,
    heroHeading: `Music for ${name}s\nPerfect background tracks for your content`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generateLifeSongRoute(topic: string): RouteConfig {
  const data = lifeSongData[topic];
  const name = data?.name || capitalize(topic);
  const prompts = data?.prompts || [`Song about ${name.toLowerCase()}`, `${name} anthem`, `Fun ${name.toLowerCase()} tune`, `${name} life beat`];
  const subtext = data?.subtext || `Create fun songs about ${name.toLowerCase()} and everyday life.`;
  
  return {
    path: `/songs-about-${topic}`,
    title: `Songs About ${name} - Create ${name} Music | Gruvi`,
    description: `Create original songs about ${name.toLowerCase()}. Generate fun, relatable music about everyday life topics.`,
    keywords: `songs about ${topic}, ${topic} song, ${topic} music, funny ${topic} song`,
    ogTitle: `Songs About ${name} | Gruvi`,
    ogDescription: `Create original songs about ${name.toLowerCase()}.`,
    twitterTitle: `Songs About ${name} | Gruvi`,
    twitterDescription: `Generate songs about ${name.toLowerCase()} with AI.`,
    breadcrumbName: `${name} Songs`,
    heroTagline: `Songs About ${name}`,
    heroHeading: `Songs About ${name}\nCreate music about everyday life`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generateEmotionalSongRoute(emotion: string): RouteConfig {
  const data = emotionalSongData[emotion];
  const name = data?.name || capitalize(emotion);
  const prompts = data?.prompts || [`${name} song`, `${name} healing anthem`, `${name} journey tune`, `${name} support beat`];
  const subtext = data?.subtext || `Create healing songs about ${name.toLowerCase()} to help process emotions.`;
  
  return {
    path: `/songs-for-${emotion}`,
    title: `Songs for ${name} - Healing Music | Gruvi`,
    description: `Create supportive songs for ${name.toLowerCase()}. Generate healing music to help through difficult times.`,
    keywords: `${emotion} songs, ${emotion} healing music, ${emotion} support song, songs for ${emotion}`,
    ogTitle: `Songs for ${name} | Gruvi`,
    ogDescription: `Create healing songs for ${name.toLowerCase()}.`,
    twitterTitle: `Songs for ${name} | Gruvi`,
    twitterDescription: `Generate supportive ${name.toLowerCase()} songs with AI.`,
    breadcrumbName: `${name} Songs`,
    heroTagline: `Songs for ${name}`,
    heroHeading: `Songs for ${name}\nHealing music for difficult times`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generateFunnySongRoute(type: string): RouteConfig {
  const data = funnySongData[type];
  const name = data?.name || capitalize(type);
  const prompts = data?.prompts || [`${name} song`, `Hilarious ${name.toLowerCase()} anthem`, `${name} comedy tune`, `${name} laugh beat`];
  const subtext = data?.subtext || `Create hilarious ${name.toLowerCase()} songs for entertainment and laughs.`;
  
  return {
    path: `/create-${type}-songs`,
    title: `Create ${name} Songs - Comedy Music Generator | Gruvi`,
    description: `Generate hilarious ${name.toLowerCase()} songs with AI. Create comedy music that makes everyone laugh.`,
    keywords: `${type} songs, ${type} music, comedy songs, funny ${type} song`,
    ogTitle: `${name} Songs | Gruvi`,
    ogDescription: `Create hilarious ${name.toLowerCase()} songs with AI.`,
    twitterTitle: `${name} Songs | Gruvi`,
    twitterDescription: `Generate ${name.toLowerCase()} comedy songs with AI.`,
    breadcrumbName: `${name} Songs`,
    heroTagline: `${name} Songs`,
    heroHeading: `${name} Songs\nCreate hilarious comedy music`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generateRelationshipSongRoute(relationship: string): RouteConfig {
  const data = relationshipSongData[relationship];
  const name = data?.name || capitalize(relationship);
  const prompts = data?.prompts || [`${name} song`, `${name} tribute anthem`, `${name} appreciation tune`, `${name} love beat`];
  const subtext = data?.subtext || `Create heartfelt songs about ${name.toLowerCase()} relationships.`;
  
  return {
    path: `/songs-for-${relationship}`,
    title: `${name} Songs - Create Tribute Music | Gruvi`,
    description: `Create heartfelt songs for your ${name.toLowerCase()}. Generate tribute music celebrating special relationships.`,
    keywords: `${relationship} song, song for ${relationship}, ${relationship} tribute, ${relationship} music`,
    ogTitle: `${name} Songs | Gruvi`,
    ogDescription: `Create heartfelt songs for your ${name.toLowerCase()}.`,
    twitterTitle: `${name} Songs | Gruvi`,
    twitterDescription: `Generate ${name.toLowerCase()} tribute songs with AI.`,
    breadcrumbName: `${name} Songs`,
    heroTagline: `${name} Songs`,
    heroHeading: `${name} Songs\nCelebrate special relationships`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

function generateHobbySongRoute(hobby: string): RouteConfig {
  const data = hobbySongData[hobby];
  const name = data?.name || capitalize(hobby);
  const prompts = data?.prompts || [`${name} song`, `${name} passion anthem`, `${name} lifestyle tune`, `${name} hobby beat`];
  const subtext = data?.subtext || `Create songs about ${name.toLowerCase()} and your favorite hobbies.`;
  
  return {
    path: `/songs-about-${hobby}`,
    title: `${name} Songs - Music for ${name} Lovers | Gruvi`,
    description: `Create songs about ${name.toLowerCase()}. Generate music celebrating your favorite hobbies and activities.`,
    keywords: `${hobby} songs, ${hobby} music, songs about ${hobby}, ${hobby} anthem`,
    ogTitle: `${name} Songs | Gruvi`,
    ogDescription: `Create songs about ${name.toLowerCase()}.`,
    twitterTitle: `${name} Songs | Gruvi`,
    twitterDescription: `Generate ${name.toLowerCase()} hobby songs with AI.`,
    breadcrumbName: `${name} Songs`,
    heroTagline: `${name} Songs`,
    heroHeading: `${name} Songs\nMusic for hobby enthusiasts`,
    heroSubtext: subtext,
    examplePrompts: prompts
  };
}

// =============================================================================
// ARRAYS FOR ROUTE GENERATION
// =============================================================================
const genres = Object.keys(genreData);
const languages = Object.keys(languageData);
const holidays = Object.keys(holidayData);
const videoStyles = Object.keys(videoStyleData);
const platforms = Object.keys(platformData);
const moods = Object.keys(moodData);
const beginnerRoutes = Object.keys(beginnerRouteData);
const promotionalPlaces = Object.keys(promotionalPlaceData);
const promotionalBusinesses = Object.keys(promotionalBusinessData);
const promotionalProducts = Object.keys(promotionalProductData);
const contentCreators = Object.keys(contentCreatorData);
const lifeTopics = Object.keys(lifeSongData);
const emotionalTopics = Object.keys(emotionalSongData);
const funnyTypes = Object.keys(funnySongData);
const relationshipTypes = Object.keys(relationshipSongData);
const hobbyTypes = Object.keys(hobbySongData);

// =============================================================================
// GENERATE ALL ROUTES
// =============================================================================

export const routeConfigs: { [key: string]: RouteConfig } = {
  // Default route
  '/': {
    path: '/',
    title: 'Gruvi - AI Music Generator & Music Video Creator',
    description: 'Create original AI-generated music and stunning music videos in any style. Make a song about anything - describe your idea and our AI creates professional quality music instantly.',
    keywords: 'ai music generator, music video creator, ai songs, create music, ai studio, free music generator',
    ogTitle: 'Gruvi - AI Music Generator & Music Video Creator',
    ogDescription: 'Create original AI music and stunning music videos in any style. Make a song about anything with AI.',
    twitterTitle: 'Gruvi - AI Music Generator',
    twitterDescription: 'Create original AI music and music videos. Make a song about anything.',
    breadcrumbName: 'Home',
    heroTagline: 'The AI Music Generator',
    heroHeading: 'The AI Music Generator\nA Hit Song for Anyone, in Any Genre',
    heroSubtext: 'Describe your song idea and our AI will create original music. Sign up to download and create more.',
    examplePrompts: ['An upbeat pop song about summer', 'Relaxing jazz for a rainy day', 'Epic cinematic orchestra', 'Funky disco groove']
  },

  // Core feature routes
  '/ai-music-generator': {
    path: '/ai-music-generator',
    title: 'AI Music Generator - Create Original Songs Instantly | Gruvi',
    description: 'Generate original music with AI in seconds. Describe your song idea and our advanced AI creates professional quality tracks in any genre.',
    keywords: 'ai music generator, ai song maker, artificial intelligence music, generate music',
    ogTitle: 'AI Music Generator | Gruvi',
    ogDescription: 'Generate original music with AI in seconds. Professional quality tracks in any genre.',
    twitterTitle: 'AI Music Generator | Gruvi',
    twitterDescription: 'Generate original music with AI in seconds.',
    breadcrumbName: 'AI Music Generator',
    heroTagline: 'AI Music Generator',
    heroHeading: 'AI Music Generator\nCreate music with artificial intelligence',
    heroSubtext: 'Generate original music with AI in seconds. Describe your song idea and create professional quality tracks in any genre.',
    examplePrompts: ['Create an energetic workout track', 'Generate a calm meditation piece', 'Make a catchy jingle', 'Compose an emotional ballad']
  },

  '/free-music-generator': {
    path: '/free-music-generator',
    title: 'Free AI Music Generator - Create Songs Without Paying | Gruvi',
    description: 'Create AI-generated music for free. No credit card required, no signup needed to try. Generate original songs instantly.',
    keywords: 'free music generator, free ai music, create music free, no cost music maker',
    ogTitle: 'Free AI Music Generator | Gruvi',
    ogDescription: 'Create AI music for free. No credit card, no signup needed to try.',
    twitterTitle: 'Free AI Music Generator | Gruvi',
    twitterDescription: 'Create AI music for free, no signup required.',
    breadcrumbName: 'Free Music Generator',
    heroTagline: 'Free Music Generator',
    heroHeading: 'Free Music Generator\nCreate AI music for free',
    heroSubtext: 'Generate original AI music without paying. No credit card required, no signup needed. Try it now and create your first song.',
    examplePrompts: ['Free pop song creation', 'Generate free beats', 'Create free background music', 'Make free jingles']
  },

  '/music-video-generator': {
    path: '/music-video-generator',
    title: 'AI Music Video Generator - Create Stunning Visuals | Gruvi',
    description: 'Transform your music into stunning AI-generated music videos. Choose from anime, 3D animation, cinematic, and more styles.',
    keywords: 'music video generator, ai music video, create music video, animated music video',
    ogTitle: 'AI Music Video Generator | Gruvi',
    ogDescription: 'Transform your music into stunning AI-generated music videos.',
    twitterTitle: 'AI Music Video Generator | Gruvi',
    twitterDescription: 'Create stunning AI music videos in any style.',
    breadcrumbName: 'Music Video Generator',
    heroTagline: 'Music Video Generator',
    heroHeading: 'Music Video Generator\nCreate stunning AI music videos',
    heroSubtext: 'Transform your music into stunning AI-generated music videos. Choose from anime, 3D, cinematic, and 16+ art styles.',
    examplePrompts: ['Anime style music video', '3D cartoon animation', 'Cinematic film look', 'Retro 80s aesthetic']
  },

  // Generate all dynamic routes
  ...Object.fromEntries(genres.map(g => [generateGenreRoute(g).path, generateGenreRoute(g)])),
  ...Object.fromEntries(languages.map(l => [generateLanguageRoute(l).path, generateLanguageRoute(l)])),
  ...Object.fromEntries(holidays.map(h => [generateHolidayRoute(h).path, generateHolidayRoute(h)])),
  ...Object.fromEntries(videoStyles.map(v => [generateVideoStyleRoute(v).path, generateVideoStyleRoute(v)])),
  ...Object.fromEntries(platforms.map(p => [generatePlatformRoute(p).path, generatePlatformRoute(p)])),
  ...Object.fromEntries(moods.map(m => [generateMoodRoute(m).path, generateMoodRoute(m)])),
  ...Object.fromEntries(beginnerRoutes.map(b => [generateBeginnerRoute(b).path, generateBeginnerRoute(b)])),
  // NEW: Promotional video routes
  ...Object.fromEntries(promotionalPlaces.map(p => [generatePromotionalPlaceRoute(p).path, generatePromotionalPlaceRoute(p)])),
  ...Object.fromEntries(promotionalBusinesses.map(b => [generatePromotionalBusinessRoute(b).path, generatePromotionalBusinessRoute(b)])),
  ...Object.fromEntries(promotionalProducts.map(p => [generatePromotionalProductRoute(p).path, generatePromotionalProductRoute(p)])),
  // NEW: Content creator routes
  ...Object.fromEntries(contentCreators.map(c => [generateContentCreatorRoute(c).path, generateContentCreatorRoute(c)])),
  // NEW: Life topic songs
  ...Object.fromEntries(lifeTopics.map(t => [generateLifeSongRoute(t).path, generateLifeSongRoute(t)])),
  // NEW: Emotional/therapeutic songs
  ...Object.fromEntries(emotionalTopics.map(e => [generateEmotionalSongRoute(e).path, generateEmotionalSongRoute(e)])),
  // NEW: Funny/novelty songs
  ...Object.fromEntries(funnyTypes.map(f => [generateFunnySongRoute(f).path, generateFunnySongRoute(f)])),
  // NEW: Relationship songs
  ...Object.fromEntries(relationshipTypes.map(r => [generateRelationshipSongRoute(r).path, generateRelationshipSongRoute(r)])),
  // NEW: Hobby songs
  ...Object.fromEntries(hobbyTypes.map(h => [generateHobbySongRoute(h).path, generateHobbySongRoute(h)])),
};

// Helper function to get route config by path
export const getRouteConfig = (path: string): RouteConfig => {
  return routeConfigs[path] || routeConfigs['/'];
};

// Helper function to get all route paths
export const getAllRoutePaths = (): string[] => {
  return Object.keys(routeConfigs);
};

// Export arrays for use in components
export { 
  genres, languages, holidays, videoStyles, platforms, moods,
  promotionalPlaces, promotionalBusinesses, promotionalProducts,
  contentCreators, lifeTopics, emotionalTopics, funnyTypes, 
  relationshipTypes, hobbyTypes 
};
