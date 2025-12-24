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

// =============================================================================
// ARRAYS FOR ROUTE GENERATION
// =============================================================================
const genres = Object.keys(genreData);
const languages = Object.keys(languageData);
const holidays = Object.keys(holidayData);
const videoStyles = Object.keys(videoStyleData);
const platforms = Object.keys(platformData);
const moods = Object.keys(moodData);

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
