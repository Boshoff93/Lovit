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
    heroHeading: 'The AI Music Generator\nMake a song about anything',
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
export { genres, languages, holidays, videoStyles, platforms, moods };
