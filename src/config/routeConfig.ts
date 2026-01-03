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
  // Route category for carousel customization
  routeCategory?: RouteCategory;
}

// Route categories for carousel title variations
export type RouteCategory = 
  | 'genre'           // Pop, Rock, Hip-Hop, etc.
  | 'language'        // English, Spanish, Japanese, etc.
  | 'mood'            // Happy, Sad, Energetic, etc.
  | 'holiday'         // Christmas, Halloween, etc.
  | 'occasion'        // Gym, Running, New Years, etc.
  | 'videoStyle'      // Anime, 3D, Cinematic, etc.
  | 'platform'        // YouTube, TikTok, etc.
  | 'airbnb'          // Airbnb, Vacation Rental, etc.
  | 'ecommerce'       // Shopify, Amazon, etc.
  | 'ugc'             // Cheap UGC, AI Ads, etc.
  | 'adTesting'       // Prototype Ads, A/B Testing, etc.
  | 'artist'          // Music Like Taylor Swift, etc.
  | 'anime'           // Anime soundtrack routes
  | 'showMovie'       // TV/Movie soundtrack routes
  | 'promotional'     // Business promotional videos
  | 'contentCreator'  // Vlogger, Streamer, etc.
  | 'default';

// Carousel titles by category - provides variety for SEO while keeping content relevant
export const carouselTitlesByCategory: Record<RouteCategory, {
  featuredTracks: { title: string; subtitle: string };
  musicVideos: { title: string; subtitle: string };
  cinematicVideos: { title: string; subtitle: string };
  moreTracks: { title: string; subtitle: string };
  promoVideos: { title: string; subtitle: string };
  genres: { title: string; subtitle: string };
  moreGenres: { title: string; subtitle: string };
  videoStyles: { title: string; subtitle: string };
}> = {
  default: {
    featuredTracks: { title: 'Featured Tracks for You', subtitle: 'Hear what Gruvi can create - professional AI-generated music' },
    musicVideos: { title: 'Turn Songs Into Music Videos', subtitle: 'Stunning AI-generated visuals synced to your music' },
    cinematicVideos: { title: 'Create Cinematic Music Videos', subtitle: 'Widescreen videos perfect for YouTube and streaming' },
    moreTracks: { title: 'Explore More Tracks', subtitle: 'Discover more AI-generated songs across every genre' },
    promoVideos: { title: 'Turn Your Music into Promo Videos', subtitle: 'Showcase products, Airbnb listings, e-commerce stores & more' },
    genres: { title: 'Discover More Genres', subtitle: 'From Hip-Hop to Classical - generate professional tracks in seconds' },
    moreGenres: { title: 'Create Music in Any Genre', subtitle: 'Even more AI-generated music to explore' },
    videoStyles: { title: 'Create Videos in Any Style', subtitle: 'Anime, Cinematic, 3D, Cyberpunk - pick your visual style' },
  },
  genre: {
    featuredTracks: { title: 'Popular Tracks in This Genre', subtitle: 'Listen to what others have created with Gruvi' },
    musicVideos: { title: 'Genre-Perfect Music Videos', subtitle: 'AI visuals that match your musical style' },
    cinematicVideos: { title: 'Widescreen Genre Videos', subtitle: 'Professional music videos for any platform' },
    moreTracks: { title: 'More Songs Like This', subtitle: 'Explore similar AI-generated tracks' },
    promoVideos: { title: 'Use This Sound for Your Brand', subtitle: 'Perfect background music for promotional content' },
    genres: { title: 'Related Genres to Explore', subtitle: 'Discover similar styles and sounds' },
    moreGenres: { title: 'Expand Your Sound', subtitle: 'Try blending genres for unique results' },
    videoStyles: { title: 'Visualize Your Music', subtitle: 'Choose the perfect art style for your track' },
  },
  language: {
    featuredTracks: { title: 'Songs in This Language', subtitle: 'AI-generated music with authentic vocals' },
    musicVideos: { title: 'Multilingual Music Videos', subtitle: 'Beautiful visuals for songs in any language' },
    cinematicVideos: { title: 'International Cinematic Content', subtitle: 'Professional videos that transcend borders' },
    moreTracks: { title: 'More Multilingual Music', subtitle: 'Explore songs in different languages' },
    promoVideos: { title: 'Reach Global Audiences', subtitle: 'Create content that speaks to international markets' },
    genres: { title: 'Popular Genres in This Language', subtitle: 'Discover what sounds great in different languages' },
    moreGenres: { title: 'Cross-Cultural Sounds', subtitle: 'Blend genres with multilingual vocals' },
    videoStyles: { title: 'Cultural Visual Styles', subtitle: 'Match your visuals to your language and culture' },
  },
  mood: {
    featuredTracks: { title: 'Tracks That Match This Mood', subtitle: 'AI-generated music for every emotion' },
    musicVideos: { title: 'Mood-Matched Videos', subtitle: 'Visuals that amplify the emotional impact' },
    cinematicVideos: { title: 'Emotional Cinematic Content', subtitle: 'Tell stories through mood and atmosphere' },
    moreTracks: { title: 'More of This Vibe', subtitle: 'Keep the mood going with similar tracks' },
    promoVideos: { title: 'Set the Right Mood for Your Brand', subtitle: 'Background music that evokes the perfect feeling' },
    genres: { title: 'Genres for This Mood', subtitle: 'Find the sound that matches your vibe' },
    moreGenres: { title: 'Explore Mood Combinations', subtitle: 'Mix feelings for unique emotional depth' },
    videoStyles: { title: 'Visuals That Feel Right', subtitle: 'Art styles that enhance the emotional tone' },
  },
  holiday: {
    featuredTracks: { title: 'Celebrate with Music', subtitle: 'AI-generated songs for your special occasions' },
    musicVideos: { title: 'Festive Music Videos', subtitle: 'Holiday-themed visuals for your celebrations' },
    cinematicVideos: { title: 'Holiday Cinematic Content', subtitle: 'Widescreen videos for seasonal celebrations' },
    moreTracks: { title: 'More Holiday Music', subtitle: 'Build the perfect seasonal playlist' },
    promoVideos: { title: 'Holiday Marketing Made Easy', subtitle: 'Seasonal promo content for your campaigns' },
    genres: { title: 'Holiday Genre Mixes', subtitle: 'Traditional and modern takes on seasonal music' },
    moreGenres: { title: 'Unique Holiday Sounds', subtitle: 'Fresh takes on classic holiday vibes' },
    videoStyles: { title: 'Festive Visual Styles', subtitle: 'Holiday-perfect animation and video styles' },
  },
  occasion: {
    featuredTracks: { title: 'Music for the Moment', subtitle: 'Perfect tracks for every activity and occasion' },
    musicVideos: { title: 'Activity-Perfect Videos', subtitle: 'Visuals that match your lifestyle moments' },
    cinematicVideos: { title: 'Lifestyle Cinematic Content', subtitle: 'Capture the feeling of every occasion' },
    moreTracks: { title: 'More Music for This Activity', subtitle: 'Build your perfect activity playlist' },
    promoVideos: { title: 'Market to Lifestyle Moments', subtitle: 'Reach audiences during key activities' },
    genres: { title: 'Best Genres for This Moment', subtitle: 'Find the sound that fits the activity' },
    moreGenres: { title: 'Activity Soundtracks', subtitle: 'Music that enhances every experience' },
    videoStyles: { title: 'Lifestyle Video Styles', subtitle: 'Visuals that capture the moment' },
  },
  videoStyle: {
    featuredTracks: { title: 'Tracks Perfect for This Style', subtitle: 'Music that complements these visuals' },
    musicVideos: { title: 'More in This Visual Style', subtitle: 'Explore AI-generated videos in this aesthetic' },
    cinematicVideos: { title: 'Cinematic Takes on This Style', subtitle: 'Widescreen versions of this visual approach' },
    moreTracks: { title: 'Songs That Fit This Aesthetic', subtitle: 'Music that matches this visual vibe' },
    promoVideos: { title: 'Use This Style for Your Brand', subtitle: 'Stand out with unique visual branding' },
    genres: { title: 'Best Genres for This Look', subtitle: 'Musical styles that pair perfectly' },
    moreGenres: { title: 'Genre + Style Combos', subtitle: 'Experiment with sound and visuals' },
    videoStyles: { title: 'Similar Visual Styles', subtitle: 'Explore related aesthetics and art directions' },
  },
  platform: {
    featuredTracks: { title: 'Trending on This Platform', subtitle: 'Music optimized for maximum engagement' },
    musicVideos: { title: 'Platform-Ready Videos', subtitle: 'Formatted and styled for this platform' },
    cinematicVideos: { title: 'Premium Platform Content', subtitle: 'High-quality videos that stand out' },
    moreTracks: { title: 'More Platform-Optimized Music', subtitle: 'Tracks designed for engagement' },
    promoVideos: { title: 'Promotional Content That Converts', subtitle: 'Ads and promos for this platform' },
    genres: { title: 'What Works on This Platform', subtitle: 'Popular genres for maximum reach' },
    moreGenres: { title: 'Trending Sounds', subtitle: 'Stay ahead of platform trends' },
    videoStyles: { title: 'Platform-Perfect Styles', subtitle: 'Visual formats that perform best' },
  },
  airbnb: {
    featuredTracks: { title: 'Ambient Music for Properties', subtitle: 'Set the perfect atmosphere for your guests' },
    musicVideos: { title: 'Property Showcase Videos', subtitle: 'Stunning visuals that highlight your rental' },
    cinematicVideos: { title: 'Cinematic Property Tours', subtitle: 'Widescreen videos that sell the experience' },
    moreTracks: { title: 'More Hospitality Music', subtitle: 'Build playlists for guest experiences' },
    promoVideos: { title: 'Vacation Rental Marketing', subtitle: 'Videos that increase bookings and engagement' },
    genres: { title: 'Music by Property Type', subtitle: 'Beach house vibes to mountain cabin sounds' },
    moreGenres: { title: 'Atmosphere for Every Space', subtitle: 'Match music to your property\'s character' },
    videoStyles: { title: 'Property Video Styles', subtitle: 'From cozy cabins to luxury villas' },
  },
  ecommerce: {
    featuredTracks: { title: 'Music for Product Content', subtitle: 'Background tracks that boost conversions' },
    musicVideos: { title: 'Product Showcase Videos', subtitle: 'Make your products shine with AI visuals' },
    cinematicVideos: { title: 'Premium Product Videos', subtitle: 'High-end content for luxury brands' },
    moreTracks: { title: 'More E-commerce Music', subtitle: 'Sounds that sell' },
    promoVideos: { title: 'Sales & Campaign Videos', subtitle: 'Black Friday, launches, and flash sales' },
    genres: { title: 'Best Sounds for Products', subtitle: 'Match music to your brand identity' },
    moreGenres: { title: 'Brand Sound Exploration', subtitle: 'Find your unique sonic identity' },
    videoStyles: { title: 'Product Video Aesthetics', subtitle: 'From minimalist to bold and vibrant' },
  },
  ugc: {
    featuredTracks: { title: 'Music for Authentic Content', subtitle: 'Tracks that feel genuine and relatable' },
    musicVideos: { title: 'UGC-Style Videos', subtitle: 'Content that connects with audiences' },
    cinematicVideos: { title: 'Premium UGC Content', subtitle: 'Elevated creator-style videos' },
    moreTracks: { title: 'More Creator-Friendly Music', subtitle: 'Royalty-free tracks for your content' },
    promoVideos: { title: 'UGC Ads That Convert', subtitle: 'Authentic-feeling promotional content' },
    genres: { title: 'Trending Creator Sounds', subtitle: 'What\'s working in UGC right now' },
    moreGenres: { title: 'Fresh Content Sounds', subtitle: 'Stay ahead of UGC trends' },
    videoStyles: { title: 'UGC Visual Styles', subtitle: 'Authentic aesthetics that resonate' },
  },
  adTesting: {
    featuredTracks: { title: 'Music for Ad Creative', subtitle: 'Test different sounds before spending' },
    musicVideos: { title: 'Video Ad Prototypes', subtitle: 'Iterate quickly on creative concepts' },
    cinematicVideos: { title: 'Premium Ad Concepts', subtitle: 'High-quality prototypes for big campaigns' },
    moreTracks: { title: 'A/B Testing Music', subtitle: 'Multiple variations for split testing' },
    promoVideos: { title: 'Ad Creative Library', subtitle: 'Prototype before you commit' },
    genres: { title: 'Sound Testing by Genre', subtitle: 'Find what resonates with your audience' },
    moreGenres: { title: 'Creative Sound Exploration', subtitle: 'Discover unexpected winners' },
    videoStyles: { title: 'Visual Format Testing', subtitle: 'Test different styles before scaling' },
  },
  artist: {
    featuredTracks: { title: 'Inspired by This Sound', subtitle: 'AI-generated tracks in a similar style' },
    musicVideos: { title: 'Videos in This Aesthetic', subtitle: 'Visuals that match the vibe' },
    cinematicVideos: { title: 'Cinematic Tributes', subtitle: 'Epic visuals inspired by iconic sounds' },
    moreTracks: { title: 'More in This Style', subtitle: 'Explore the full spectrum of this sound' },
    promoVideos: { title: 'Use This Sound for Content', subtitle: 'Perfect for brand alignment' },
    genres: { title: 'Related Musical Styles', subtitle: 'Explore the artist\'s genre influences' },
    moreGenres: { title: 'Sonic Neighbors', subtitle: 'Similar artists and sounds to discover' },
    videoStyles: { title: 'Visual Aesthetics That Fit', subtitle: 'Match the vibe with the right style' },
  },
  anime: {
    featuredTracks: { title: 'Epic Anime Soundtracks', subtitle: 'AI-generated music inspired by your favorites' },
    musicVideos: { title: 'Anime-Style Music Videos', subtitle: 'Stunning animation for your tracks' },
    cinematicVideos: { title: 'Cinematic Anime Content', subtitle: 'Widescreen anime-inspired visuals' },
    moreTracks: { title: 'More Anime Music', subtitle: 'Battle themes, emotional scores, and openings' },
    promoVideos: { title: 'Anime for Brands', subtitle: 'Reach anime-loving audiences' },
    genres: { title: 'Anime Genre Fusion', subtitle: 'J-Pop, orchestral, electronic and more' },
    moreGenres: { title: 'Anime Sound Exploration', subtitle: 'From Shonen to Slice of Life' },
    videoStyles: { title: 'Anime Art Styles', subtitle: 'Classic, modern, and everything between' },
  },
  showMovie: {
    featuredTracks: { title: 'Soundtrack-Inspired Music', subtitle: 'Capture that cinematic feeling' },
    musicVideos: { title: 'Cinematic Universe Videos', subtitle: 'Visuals worthy of the big screen' },
    cinematicVideos: { title: 'Epic Cinematic Content', subtitle: 'Blockbuster-quality video production' },
    moreTracks: { title: 'More Soundtrack Styles', subtitle: 'Scores and themes from every genre' },
    promoVideos: { title: 'Cinematic Brand Content', subtitle: 'Movie-quality promotional videos' },
    genres: { title: 'Soundtrack Genres', subtitle: 'Orchestral, synth, ambient and more' },
    moreGenres: { title: 'Score Exploration', subtitle: 'Find your cinematic sound' },
    videoStyles: { title: 'Cinematic Visual Styles', subtitle: 'From noir to sci-fi to fantasy' },
  },
  promotional: {
    featuredTracks: { title: 'Music for Business', subtitle: 'Professional tracks for commercial use' },
    musicVideos: { title: 'Business Promo Videos', subtitle: 'Make your brand stand out' },
    cinematicVideos: { title: 'Corporate Cinematic Content', subtitle: 'Premium business video production' },
    moreTracks: { title: 'More Business Music', subtitle: 'Build your brand sound library' },
    promoVideos: { title: 'Full Promotional Suite', subtitle: 'Everything you need for marketing' },
    genres: { title: 'Music by Industry', subtitle: 'Sounds that work for your sector' },
    moreGenres: { title: 'Brand Sound Options', subtitle: 'Find your unique sonic identity' },
    videoStyles: { title: 'Business Video Styles', subtitle: 'Professional aesthetics for every brand' },
  },
  contentCreator: {
    featuredTracks: { title: 'Creator-Ready Tracks', subtitle: 'Royalty-free music for your content' },
    musicVideos: { title: 'Videos for Creators', subtitle: 'Stunning content for your channels' },
    cinematicVideos: { title: 'Premium Creator Content', subtitle: 'Level up your production value' },
    moreTracks: { title: 'More Creator Music', subtitle: 'Never run out of fresh tracks' },
    promoVideos: { title: 'Sponsored Content Made Easy', subtitle: 'Professional branded content' },
    genres: { title: 'Trending Creator Genres', subtitle: 'What\'s working for top creators' },
    moreGenres: { title: 'Fresh Sound Ideas', subtitle: 'Stand out from the crowd' },
    videoStyles: { title: 'Creator Visual Styles', subtitle: 'Match your brand aesthetic' },
  },
};

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
    examplePrompts: prompts,
    routeCategory: 'genre',
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
    examplePrompts: prompts,
    routeCategory: 'language',
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
    examplePrompts: prompts,
    routeCategory: 'holiday',
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
    examplePrompts: prompts,
    routeCategory: 'videoStyle',
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
    examplePrompts: prompts,
    routeCategory: 'platform',
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
    examplePrompts: prompts,
    routeCategory: 'mood',
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
    examplePrompts: data.prompts,
    routeCategory: 'default',
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
    examplePrompts: prompts,
    routeCategory: 'airbnb',
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
    examplePrompts: prompts,
    routeCategory: 'promotional',
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
    examplePrompts: prompts,
    routeCategory: 'ecommerce',
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
    examplePrompts: prompts,
    routeCategory: 'contentCreator',
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
    examplePrompts: prompts,
    routeCategory: 'occasion',
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
    examplePrompts: prompts,
    routeCategory: 'mood',
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
    examplePrompts: prompts,
    routeCategory: 'mood',
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
    examplePrompts: prompts,
    routeCategory: 'occasion',
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
    examplePrompts: prompts,
    routeCategory: 'occasion',
  };
}

// =============================================================================
// ARTIST "MUSIC LIKE" DATA - 50 Popular Artists
// =============================================================================
const artistData: { [key: string]: { name: string; genre: string; prompts: string[]; subtext: string } } = {
  // Pop (10)
  'taylor-swift': { name: 'Taylor Swift', genre: 'Pop', prompts: ['Emotional storytelling pop ballad', 'Catchy pop anthem with personal lyrics', 'Dreamy synth-pop love song', 'Country-pop crossover track'], subtext: 'Create music inspired by Taylor Swift\'s signature storytelling and catchy melodies.' },
  'ed-sheeran': { name: 'Ed Sheeran', genre: 'Pop', prompts: ['Acoustic pop love song', 'Loop-based beatbox pop', 'Irish-folk influenced pop', 'Romantic wedding song'], subtext: 'Generate heartfelt acoustic pop inspired by Ed Sheeran\'s intimate songwriting style.' },
  'dua-lipa': { name: 'Dua Lipa', genre: 'Pop', prompts: ['Retro disco-pop dance track', 'Empowering pop anthem', 'Nu-disco club banger', '80s-inspired synth pop'], subtext: 'Create disco-infused pop bangers inspired by Dua Lipa\'s future nostalgia sound.' },
  'the-weeknd': { name: 'The Weeknd', genre: 'Pop/R&B', prompts: ['Dark synth-wave R&B', '80s-inspired pop track', 'Moody atmospheric ballad', 'Retro-futuristic pop'], subtext: 'Generate atmospheric synth-wave pop inspired by The Weeknd\'s cinematic sound.' },
  'ariana-grande': { name: 'Ariana Grande', genre: 'Pop', prompts: ['Powerful vocal pop anthem', 'R&B-infused pop track', 'Whistle-tone pop ballad', 'Trap-pop hybrid song'], subtext: 'Create soaring vocal pop tracks inspired by Ariana Grande\'s powerhouse style.' },
  'bruno-mars': { name: 'Bruno Mars', genre: 'Pop/Funk', prompts: ['Retro funk-pop groove', 'Romantic R&B ballad', '70s soul-inspired pop', 'Uptown funk dance track'], subtext: 'Generate feel-good retro funk-pop inspired by Bruno Mars\' timeless grooves.' },
  'billie-eilish': { name: 'Billie Eilish', genre: 'Pop', prompts: ['Whispery dark pop', 'Minimalist bass-heavy track', 'Haunting electronic ballad', 'ASMR-influenced pop'], subtext: 'Create atmospheric, bass-heavy dark pop inspired by Billie Eilish\'s unique sound.' },
  'harry-styles': { name: 'Harry Styles', genre: 'Pop/Rock', prompts: ['70s rock-influenced pop', 'Soft rock ballad', 'Psychedelic pop track', 'British invasion inspired'], subtext: 'Generate vintage rock-influenced pop inspired by Harry Styles\' classic sound.' },
  'olivia-rodrigo': { name: 'Olivia Rodrigo', genre: 'Pop/Rock', prompts: ['Angsty pop-rock anthem', 'Emotional breakup ballad', 'Gen-Z pop punk track', 'Confessional singer-songwriter'], subtext: 'Create emotionally raw pop-rock inspired by Olivia Rodrigo\'s vulnerable songwriting.' },
  'lady-gaga': { name: 'Lady Gaga', genre: 'Pop', prompts: ['Theatrical dance-pop anthem', 'Powerful piano ballad', 'Electronic art pop', 'Avant-garde pop track'], subtext: 'Generate theatrical, boundary-pushing pop inspired by Lady Gaga\'s iconic artistry.' },
  // Hip-Hop/Rap (10)
  'drake': { name: 'Drake', genre: 'Hip-Hop', prompts: ['Melodic rap with singing', 'Toronto vibes hip-hop', 'Emotional rap ballad', 'Club-ready rap anthem'], subtext: 'Create melodic hip-hop inspired by Drake\'s signature emotional rap style.' },
  'kendrick-lamar': { name: 'Kendrick Lamar', genre: 'Hip-Hop', prompts: ['Conscious lyrical rap', 'Jazz-influenced hip-hop', 'Storytelling rap track', 'West coast experimental rap'], subtext: 'Generate thought-provoking, lyrical hip-hop inspired by Kendrick Lamar\'s artistry.' },
  'travis-scott': { name: 'Travis Scott', genre: 'Hip-Hop', prompts: ['Psychedelic trap banger', 'Auto-tuned atmospheric rap', 'Dark Houston trap', 'Festival-ready hip-hop anthem'], subtext: 'Create psychedelic trap bangers inspired by Travis Scott\'s atmospheric production.' },
  'kanye-west': { name: 'Kanye West', genre: 'Hip-Hop', prompts: ['Soulful sample-based hip-hop', 'Experimental rap production', 'Gospel-influenced rap', 'Maximalist hip-hop anthem'], subtext: 'Generate innovative, genre-bending hip-hop inspired by Kanye West\'s production.' },
  'j-cole': { name: 'J. Cole', genre: 'Hip-Hop', prompts: ['Introspective boom-bap rap', 'Soulful conscious hip-hop', 'Storytelling rap track', 'Smooth lyrical flow'], subtext: 'Create introspective, soulful hip-hop inspired by J. Cole\'s thoughtful lyricism.' },
  'post-malone': { name: 'Post Malone', genre: 'Hip-Hop/Pop', prompts: ['Melodic pop-rap hybrid', 'Sad boy rock-rap', 'Guitar-driven hip-hop', 'Catchy hook-heavy rap'], subtext: 'Generate genre-blending melodic rap inspired by Post Malone\'s versatile style.' },
  'eminem': { name: 'Eminem', genre: 'Hip-Hop', prompts: ['Fast-paced lyrical rap', 'Emotional storytelling rap', 'Technical rap battle track', 'Rock-influenced hip-hop'], subtext: 'Create technically impressive, lyrical rap inspired by Eminem\'s legendary flow.' },
  'lil-nas-x': { name: 'Lil Nas X', genre: 'Hip-Hop/Pop', prompts: ['Genre-bending pop-rap', 'Country-trap fusion', 'Catchy viral hit', 'Bold statement anthem'], subtext: 'Generate boundary-breaking pop-rap inspired by Lil Nas X\'s genre-defying hits.' },
  'tyler-the-creator': { name: 'Tyler, The Creator', genre: 'Hip-Hop', prompts: ['Neo-soul hip-hop fusion', 'Jazzy experimental rap', 'Quirky alternative hip-hop', 'Psychedelic soul-rap'], subtext: 'Create eccentric, neo-soul hip-hop inspired by Tyler, The Creator\'s artistic vision.' },
  '21-savage': { name: '21 Savage', genre: 'Hip-Hop', prompts: ['Dark Atlanta trap', 'Menacing slow-flow rap', 'Street storytelling hip-hop', 'Hard-hitting trap beat'], subtext: 'Generate dark, hard-hitting Atlanta trap inspired by 21 Savage\'s cold delivery.' },
  // Rock/Alternative (8)
  'imagine-dragons': { name: 'Imagine Dragons', genre: 'Rock', prompts: ['Epic anthemic rock', 'Stadium rock with electronic elements', 'Powerful motivational rock', 'Cinematic pop-rock'], subtext: 'Create epic, anthemic rock inspired by Imagine Dragons\' stadium-filling sound.' },
  'coldplay': { name: 'Coldplay', genre: 'Rock/Pop', prompts: ['Atmospheric piano rock ballad', 'Uplifting anthemic rock', 'Ethereal electronic rock', 'Emotional epic rock'], subtext: 'Generate emotional, atmospheric rock inspired by Coldplay\'s sweeping melodies.' },
  'arctic-monkeys': { name: 'Arctic Monkeys', genre: 'Rock', prompts: ['Indie rock with witty lyrics', 'Retro lounge rock', 'British garage rock', 'Desert rock groove'], subtext: 'Create sharp, witty indie rock inspired by Arctic Monkeys\' distinctive style.' },
  'linkin-park': { name: 'Linkin Park', genre: 'Rock', prompts: ['Nu-metal with electronic elements', 'Emotional rock with rap verses', 'Heavy alternative rock', 'Anthemic rock ballad'], subtext: 'Generate powerful nu-metal and alt-rock inspired by Linkin Park\'s iconic sound.' },
  'foo-fighters': { name: 'Foo Fighters', genre: 'Rock', prompts: ['High-energy rock anthem', 'Power rock with big drums', 'Melodic hard rock', 'Arena rock track'], subtext: 'Create driving, energetic rock inspired by Foo Fighters\' powerful performances.' },
  'green-day': { name: 'Green Day', genre: 'Rock', prompts: ['Pop-punk anthem', 'Political punk rock', 'Power chord rock song', 'Melodic punk track'], subtext: 'Generate catchy pop-punk inspired by Green Day\'s rebellious energy.' },
  'twenty-one-pilots': { name: 'Twenty One Pilots', genre: 'Alternative', prompts: ['Genre-blending alt-pop', 'Ukulele and rap hybrid', 'Existential alternative track', 'Electronic-rock fusion'], subtext: 'Create genre-defying alternative music inspired by Twenty One Pilots\' unique blend.' },
  'the-1975': { name: 'The 1975', genre: 'Alternative/Pop', prompts: ['80s-influenced indie pop', 'Synth-driven alternative', 'Atmospheric pop-rock', 'Art-pop with spoken word'], subtext: 'Generate stylish, 80s-influenced indie pop inspired by The 1975\'s aesthetic.' },
  // Electronic/EDM (8)
  'calvin-harris': { name: 'Calvin Harris', genre: 'EDM', prompts: ['Festival house anthem', 'Summer dance pop hit', 'Funk-influenced EDM', 'Big room house drop'], subtext: 'Create festival-ready house anthems inspired by Calvin Harris\' chart-topping productions.' },
  'marshmello': { name: 'Marshmello', genre: 'EDM', prompts: ['Happy future bass track', 'Melodic dubstep anthem', 'Pop-EDM crossover', 'Feel-good electronic dance'], subtext: 'Generate uplifting future bass inspired by Marshmello\'s accessible EDM sound.' },
  'daft-punk': { name: 'Daft Punk', genre: 'Electronic', prompts: ['French house disco', 'Vocoder-heavy electronic', 'Robotic funk groove', 'Retro-futuristic dance'], subtext: 'Create legendary French house and disco-funk inspired by Daft Punk\'s iconic sound.' },
  'avicii': { name: 'Avicii', genre: 'EDM', prompts: ['Melodic progressive house', 'Country-EDM fusion', 'Emotional festival anthem', 'Uplifting dance track'], subtext: 'Generate emotional, melodic EDM inspired by Avicii\'s heartfelt productions.' },
  'deadmau5': { name: 'Deadmau5', genre: 'Electronic', prompts: ['Progressive house journey', 'Dark techno-influenced EDM', 'Atmospheric electronic', 'Build-and-drop house'], subtext: 'Create progressive house masterpieces inspired by Deadmau5\'s technical productions.' },
  'kygo': { name: 'Kygo', genre: 'Electronic', prompts: ['Tropical house vibes', 'Summer sunset electronic', 'Laid-back dance track', 'Acoustic-electronic fusion'], subtext: 'Generate tropical house and chill electronic inspired by Kygo\'s signature sound.' },
  'zedd': { name: 'Zedd', genre: 'EDM', prompts: ['Electro house anthem', 'Classical-influenced EDM', 'Pop-EDM crossover hit', 'Euphoric dance buildup'], subtext: 'Create polished electro house inspired by Zedd\'s precise, musical productions.' },
  'skrillex': { name: 'Skrillex', genre: 'Electronic', prompts: ['Aggressive dubstep drop', 'Bass music banger', 'Glitchy electronic track', 'Heavy bass hybrid'], subtext: 'Generate intense dubstep and bass music inspired by Skrillex\'s groundbreaking sound.' },
  // R&B/Soul (6)
  'sza': { name: 'SZA', genre: 'R&B', prompts: ['Neo-soul with hip-hop beats', 'Vulnerable R&B ballad', 'Alternative R&B track', 'Dreamy slow jam'], subtext: 'Create vulnerable, dreamy R&B inspired by SZA\'s emotionally honest songwriting.' },
  'frank-ocean': { name: 'Frank Ocean', genre: 'R&B', prompts: ['Experimental R&B', 'Minimalist soul track', 'Introspective slow jam', 'Art-R&B with layers'], subtext: 'Generate experimental, introspective R&B inspired by Frank Ocean\'s artistic vision.' },
  'beyonce': { name: 'Beyoncé', genre: 'R&B/Pop', prompts: ['Powerful R&B anthem', 'Dance-pop with strong vocals', 'Empowerment ballad', 'Genre-bending R&B'], subtext: 'Create powerful, genre-spanning R&B inspired by Beyoncé\'s legendary artistry.' },
  'usher': { name: 'Usher', genre: 'R&B', prompts: ['Smooth R&B groove', 'Dance-floor R&B hit', 'Classic slow jam', 'Upbeat R&B pop track'], subtext: 'Generate smooth, danceable R&B inspired by Usher\'s classic sound.' },
  'alicia-keys': { name: 'Alicia Keys', genre: 'R&B/Soul', prompts: ['Soulful piano ballad', 'Neo-soul R&B track', 'Gospel-influenced soul', 'Empowering piano-driven song'], subtext: 'Create soulful, piano-driven R&B inspired by Alicia Keys\' timeless artistry.' },
  'daniel-caesar': { name: 'Daniel Caesar', genre: 'R&B', prompts: ['Gospel-soul R&B', 'Intimate acoustic R&B', 'Heavenly vocal harmonies', 'Modern soul ballad'], subtext: 'Generate gospel-influenced, intimate R&B inspired by Daniel Caesar\'s angelic sound.' },
  // Latin (4)
  'bad-bunny': { name: 'Bad Bunny', genre: 'Latin', prompts: ['Reggaeton perreo track', 'Latin trap banger', 'Experimental Latin pop', 'Caribbean dembow beat'], subtext: 'Create genre-pushing Latin music inspired by Bad Bunny\'s innovative style.' },
  'j-balvin': { name: 'J Balvin', genre: 'Latin', prompts: ['Colorful reggaeton hit', 'Latin urban dance track', 'Catchy Latino pop', 'Tropical house reggaeton'], subtext: 'Generate vibrant reggaeton and Latin pop inspired by J Balvin\'s colorful productions.' },
  'shakira': { name: 'Shakira', genre: 'Latin/Pop', prompts: ['Latin pop dance hit', 'Middle Eastern-Latin fusion', 'World music pop blend', 'Energetic dance track'], subtext: 'Create dynamic Latin pop inspired by Shakira\'s global, genre-blending sound.' },
  'daddy-yankee': { name: 'Daddy Yankee', genre: 'Latin', prompts: ['Classic reggaeton banger', 'Dembow party anthem', 'Latin urban hit', 'Perreo intenso track'], subtext: 'Generate classic reggaeton bangers inspired by Daddy Yankee\'s legendary beats.' },
  // K-Pop (4)
  'bts': { name: 'BTS', genre: 'K-Pop', prompts: ['K-pop dance anthem', 'Emotional K-pop ballad', 'Hip-hop influenced K-pop', 'Uplifting fan song'], subtext: 'Create dynamic K-pop inspired by BTS\'s genre-spanning, globally acclaimed sound.' },
  'blackpink': { name: 'BLACKPINK', genre: 'K-Pop', prompts: ['Powerful girl crush K-pop', 'EDM-infused K-pop anthem', 'Fierce dance track', 'Trendy K-pop banger'], subtext: 'Generate fierce, trendsetting K-pop inspired by BLACKPINK\'s bold style.' },
  'stray-kids': { name: 'Stray Kids', genre: 'K-Pop', prompts: ['Experimental K-pop', 'Self-produced hip-hop K-pop', 'Intense EDM K-pop', 'Genre-bending K-pop track'], subtext: 'Create experimental, self-produced K-pop inspired by Stray Kids\' unique sound.' },
  'newjeans': { name: 'NewJeans', genre: 'K-Pop', prompts: ['Y2K-inspired K-pop', 'Minimal R&B K-pop', 'Retro 90s influenced', 'Fresh Gen-Z K-pop'], subtext: 'Generate fresh, Y2K-influenced K-pop inspired by NewJeans\' nostalgic yet modern sound.' },
};

// =============================================================================
// TV SHOWS/MOVIES/STREAMING MUSIC DATA
// =============================================================================
const showMusicData: { [key: string]: { name: string; category: string; prompts: string[]; subtext: string } } = {
  // Netflix
  'stranger-things': { name: 'Stranger Things', category: 'Netflix', prompts: ['80s synth horror soundtrack', 'Retro electronic suspense', 'Nostalgic synth-wave score', 'Eerie synthesizer theme'], subtext: 'Create retro 80s synth music inspired by Stranger Things\' iconic soundtrack.' },
  'squid-game': { name: 'Squid Game', category: 'Netflix', prompts: ['Tense orchestral suspense', 'Korean thriller soundtrack', 'Childlike melody with dark twist', 'Dramatic game show music'], subtext: 'Generate tense, dramatic music inspired by Squid Game\'s haunting score.' },
  'wednesday': { name: 'Wednesday', category: 'Netflix', prompts: ['Gothic orchestral theme', 'Dark whimsical soundtrack', 'Cello-driven mysterious music', 'Quirky dark comedy score'], subtext: 'Create gothic, whimsical music inspired by Wednesday\'s dark aesthetic.' },
  'bridgerton': { name: 'Bridgerton', category: 'Netflix', prompts: ['Classical pop cover arrangement', 'Regency era orchestral', 'String quartet pop adaptation', 'Romantic period drama score'], subtext: 'Generate elegant classical-pop crossovers inspired by Bridgerton\'s unique soundtrack.' },
  'the-witcher': { name: 'The Witcher', category: 'Netflix', prompts: ['Medieval fantasy bard song', 'Epic orchestral battle music', 'Slavic folk-inspired theme', 'Tavern music with lute'], subtext: 'Create medieval fantasy music inspired by The Witcher\'s atmospheric score.' },
  'money-heist': { name: 'Money Heist', category: 'Netflix', prompts: ['Spanish heist tension music', 'Bella Ciao style anthem', 'Dramatic suspense soundtrack', 'Flamenco-influenced score'], subtext: 'Generate dramatic heist music inspired by Money Heist\'s intense soundtrack.' },
  // HBO/Other
  'game-of-thrones': { name: 'Game of Thrones', category: 'HBO', prompts: ['Epic fantasy orchestra', 'Medieval war drums theme', 'Haunting cello melody', 'Throne room fanfare'], subtext: 'Create epic fantasy orchestral music inspired by Game of Thrones\' legendary score.' },
  'house-of-the-dragon': { name: 'House of the Dragon', category: 'HBO', prompts: ['Dragon flight orchestral', 'Targaryen house theme', 'Medieval royal fanfare', 'Epic fantasy battle music'], subtext: 'Generate epic dragon-themed orchestral inspired by House of the Dragon.' },
  'euphoria': { name: 'Euphoria', category: 'HBO', prompts: ['Dreamy electronic indie', 'Emotional synth-pop', 'Dark ambient electronic', 'Gen-Z mood soundtrack'], subtext: 'Create atmospheric electronic music inspired by Euphoria\'s moody soundtrack.' },
  'the-last-of-us': { name: 'The Last of Us', category: 'HBO', prompts: ['Acoustic guitar post-apocalyptic', 'Emotional survival theme', 'Haunting minimal score', 'Tension-building ambient'], subtext: 'Generate emotional, acoustic-driven music inspired by The Last of Us.' },
  'succession': { name: 'Succession', category: 'HBO', prompts: ['Hip-hop orchestral blend', 'Power and wealth theme', 'Piano-driven dramatic score', 'Modern classical drama'], subtext: 'Create dramatic, hip-hop influenced orchestral inspired by Succession\'s unique score.' },
  // Movies/Franchises
  'marvel': { name: 'Marvel/MCU', category: 'Movies', prompts: ['Superhero epic orchestra', 'Heroic brass fanfare', 'Action movie soundtrack', 'Avengers-style theme'], subtext: 'Generate epic superhero orchestral music inspired by the Marvel Cinematic Universe.' },
  'star-wars': { name: 'Star Wars', category: 'Movies', prompts: ['Space opera orchestra', 'Epic brass fanfare theme', 'Force mystical melody', 'Imperial march style'], subtext: 'Create legendary space opera music inspired by Star Wars\' iconic score.' },
  'harry-potter': { name: 'Harry Potter', category: 'Movies', prompts: ['Magical whimsical orchestra', 'Wizard school theme', 'Fantasy adventure score', 'Enchanting celesta melody'], subtext: 'Generate magical, whimsical orchestral inspired by Harry Potter\'s enchanting soundtrack.' },
  'lord-of-the-rings': { name: 'Lord of the Rings', category: 'Movies', prompts: ['Epic fantasy adventure', 'Elvish ethereal choir', 'Hobbit folk theme', 'Fellowship journey music'], subtext: 'Create epic fantasy music inspired by Lord of the Rings\' legendary score.' },
  'christopher-nolan': { name: 'Christopher Nolan Films', category: 'Movies', prompts: ['Time-bending orchestral', 'BWAAAAM inception horn', 'Tense ticking soundtrack', 'Mind-bending score'], subtext: 'Generate mind-bending, time-warped orchestral inspired by Christopher Nolan films.' },
  'james-bond': { name: 'James Bond', category: 'Movies', prompts: ['Spy thriller orchestra', 'Suave jazz-orchestral blend', 'Action spy theme', 'Dramatic opening credits'], subtext: 'Create sophisticated spy thriller music inspired by James Bond\'s iconic sound.' },
  // Gaming
  'zelda': { name: 'Legend of Zelda', category: 'Gaming', prompts: ['Adventure game orchestra', 'Heroic fantasy theme', 'Field exploration music', 'Temple puzzle soundtrack'], subtext: 'Generate adventure game orchestral inspired by The Legend of Zelda\'s timeless music.' },
  'final-fantasy': { name: 'Final Fantasy', category: 'Gaming', prompts: ['JRPG epic orchestra', 'Emotional piano theme', 'Battle victory fanfare', 'Crystal theme melody'], subtext: 'Create emotional JRPG orchestral inspired by Final Fantasy\'s legendary soundtracks.' },
  'cyberpunk-2077': { name: 'Cyberpunk 2077', category: 'Gaming', prompts: ['Futuristic synth-rock', 'Dystopian electronic', 'Neon city soundtrack', 'Cyberpunk industrial'], subtext: 'Generate futuristic synth-rock inspired by Cyberpunk 2077\'s immersive soundtrack.' },
  'hollow-knight': { name: 'Hollow Knight', category: 'Gaming', prompts: ['Atmospheric piano ambient', 'Melancholic exploration music', 'Dark cavern soundtrack', 'Indie game orchestral'], subtext: 'Create atmospheric, melancholic music inspired by Hollow Knight\'s beautiful score.' },
  'minecraft': { name: 'Minecraft', category: 'Gaming', prompts: ['Peaceful piano ambient', 'Nostalgic exploration music', 'Calm creative mode soundtrack', 'Block world ambience'], subtext: 'Generate peaceful, ambient piano music inspired by Minecraft\'s relaxing soundtrack.' },
};

// =============================================================================
// ANIME SOUNDTRACK DATA
// =============================================================================
const animeSoundtrackData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'dragon-ball': { name: 'Dragon Ball', prompts: ['Epic power-up transformation', 'Intense battle orchestra', 'Super Saiyan theme music', 'Anime fight scene soundtrack'], subtext: 'Create epic battle music inspired by Dragon Ball\'s legendary soundtrack.' },
  'one-piece': { name: 'One Piece', prompts: ['Pirate adventure orchestra', 'Emotional nakama theme', 'Ocean sailing music', 'Epic crew moment soundtrack'], subtext: 'Generate adventurous pirate music inspired by One Piece\'s emotional score.' },
  'naruto': { name: 'Naruto', prompts: ['Ninja action soundtrack', 'Sadness and sorrow theme', 'Epic shinobi battle music', 'Emotional ninja journey'], subtext: 'Create emotional ninja soundtrack inspired by Naruto\'s iconic music.' },
  'attack-on-titan': { name: 'Attack on Titan', prompts: ['Epic choir battle anthem', 'German-influenced orchestra', 'Intense action soundtrack', 'Titan transformation theme'], subtext: 'Generate intense, choir-driven orchestral inspired by Attack on Titan.' },
  'demon-slayer': { name: 'Demon Slayer', prompts: ['Japanese orchestra action', 'Emotional anime ballad', 'Sword fighting soundtrack', 'Traditional Japanese fusion'], subtext: 'Create beautiful Japanese-influenced orchestral inspired by Demon Slayer.' },
  'my-hero-academia': { name: 'My Hero Academia', prompts: ['Heroic anime orchestra', 'Plus Ultra power theme', 'Superhero training music', 'Emotional hero moment'], subtext: 'Generate heroic, inspiring music inspired by My Hero Academia\'s soundtrack.' },
  'jujutsu-kaisen': { name: 'Jujutsu Kaisen', prompts: ['Dark sorcery soundtrack', 'Hip-hop anime fusion', 'Cursed energy battle music', 'Modern anime action theme'], subtext: 'Create dark, hip-hop influenced music inspired by Jujutsu Kaisen.' },
  'spy-x-family': { name: 'Spy x Family', prompts: ['Jazz spy comedy soundtrack', 'Elegant espionage music', 'Playful family theme', 'Sophisticated action jazz'], subtext: 'Generate jazz-infused spy comedy music inspired by Spy x Family.' },
  'chainsaw-man': { name: 'Chainsaw Man', prompts: ['Dark electronic anime', 'Chaotic action soundtrack', 'Horror-rock anime theme', 'Edgy modern anime music'], subtext: 'Create dark, edgy music inspired by Chainsaw Man\'s intense soundtrack.' },
  'death-note': { name: 'Death Note', prompts: ['Dark orchestral suspense', 'Gothic choir theme', 'Psychological thriller music', 'L vs Light soundtrack'], subtext: 'Generate dark, psychological orchestral inspired by Death Note.' },
  'bleach': { name: 'Bleach', prompts: ['Rock-orchestra anime fusion', 'Soul reaper battle theme', 'Spanish guitar action', 'Epic bankai transformation'], subtext: 'Create rock-infused anime soundtrack inspired by Bleach\'s iconic music.' },
  'hunter-x-hunter': { name: 'Hunter x Hunter', prompts: ['Adventure orchestra theme', 'Dark chimera ant arc', 'Emotional character music', 'Nen battle soundtrack'], subtext: 'Generate adventurous orchestral inspired by Hunter x Hunter\'s diverse score.' },
  'fullmetal-alchemist': { name: 'Fullmetal Alchemist', prompts: ['Epic alchemy orchestra', 'Emotional brothers theme', 'Military drama soundtrack', 'Equivalent exchange music'], subtext: 'Create emotional, epic orchestral inspired by Fullmetal Alchemist.' },
  'cowboy-bebop': { name: 'Cowboy Bebop', prompts: ['Space jazz fusion', 'Bebop and blues mix', 'Noir jazz soundtrack', 'Futuristic jazz band'], subtext: 'Generate legendary jazz-fusion inspired by Cowboy Bebop\'s iconic soundtrack.' },
  'studio-ghibli': { name: 'Studio Ghibli', prompts: ['Whimsical piano orchestra', 'Magical adventure theme', 'Nostalgic Japanese melody', 'Peaceful nature music'], subtext: 'Create magical, whimsical music inspired by Studio Ghibli\'s beautiful soundtracks.' },
  'evangelion': { name: 'Neon Genesis Evangelion', prompts: ['Psychological mecha orchestra', 'Classical anime fusion', 'Existential anime soundtrack', 'Dramatic eva unit theme'], subtext: 'Generate complex, psychological orchestral inspired by Evangelion.' },
  'sailor-moon': { name: 'Sailor Moon', prompts: ['Magical girl transformation', '90s anime pop theme', 'Moon princess orchestra', 'Sailor guardian anthem'], subtext: 'Create magical girl music inspired by Sailor Moon\'s iconic soundtrack.' },
  'pokemon': { name: 'Pokémon', prompts: ['Adventure journey theme', 'Battle ready music', 'Pokémon center healing', 'Champion battle orchestra'], subtext: 'Generate adventurous, nostalgic music inspired by Pokémon\'s beloved soundtrack.' },
  'sword-art-online': { name: 'Sword Art Online', prompts: ['Virtual world orchestra', 'MMORPG adventure theme', 'Boss battle music', 'Emotional gamer soundtrack'], subtext: 'Create virtual world orchestral inspired by Sword Art Online.' },
  'tokyo-ghoul': { name: 'Tokyo Ghoul', prompts: ['Dark rock anime opening', 'Tragic character theme', 'Ghoul transformation music', 'Emotional dark soundtrack'], subtext: 'Generate dark, emotional rock-orchestral inspired by Tokyo Ghoul.' },
};

// =============================================================================
// PRODUCT/AD MUSIC DATA
// =============================================================================
const adMusicData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'tv-commercial': { name: 'TV Commercial', prompts: ['Upbeat commercial jingle', '30-second ad music', 'Catchy brand theme', 'Professional ad soundtrack'], subtext: 'Create professional TV commercial music and jingles for broadcast advertising.' },
  'social-media-ad': { name: 'Social Media Ad', prompts: ['Trendy Instagram ad music', 'Short attention-grabbing track', 'TikTok ad background', 'Scroll-stopping audio'], subtext: 'Generate trending music for social media advertisements and sponsored content.' },
  'youtube-ad': { name: 'YouTube Ad', prompts: ['Non-skippable ad music', 'Pre-roll video soundtrack', 'Brand awareness jingle', 'Product showcase music'], subtext: 'Create compelling music for YouTube pre-roll and mid-roll advertisements.' },
  'radio-commercial': { name: 'Radio Commercial', prompts: ['Catchy radio jingle', 'Memorable ad tune', 'Voice-over background music', 'Drive-time ad track'], subtext: 'Generate memorable radio commercial jingles and background music.' },
  'product-launch': { name: 'Product Launch', prompts: ['Exciting reveal music', 'Tech product unveiling', 'Grand announcement soundtrack', 'Innovative launch theme'], subtext: 'Create exciting product launch and announcement music.' },
  'brand-anthem': { name: 'Brand Anthem', prompts: ['Corporate brand theme', 'Company identity music', 'Inspirational brand soundtrack', 'Mission statement music'], subtext: 'Generate powerful brand anthems that define your company identity.' },
  'explainer-video': { name: 'Explainer Video', prompts: ['Clear educational background', 'SaaS demo music', 'How-it-works soundtrack', 'Friendly explanation tune'], subtext: 'Create friendly background music for explainer and demo videos.' },
  'testimonial-video': { name: 'Testimonial Video', prompts: ['Trustworthy background music', 'Customer story soundtrack', 'Authentic testimonial audio', 'Believable ambient track'], subtext: 'Generate authentic, trustworthy music for customer testimonial videos.' },
  'e-commerce': { name: 'E-commerce', prompts: ['Online shopping music', 'Product showcase background', 'Sale announcement jingle', 'Buy now excitement'], subtext: 'Create engaging music for e-commerce product videos and listings.' },
  'startup-pitch': { name: 'Startup Pitch', prompts: ['Innovative pitch deck music', 'Investor presentation soundtrack', 'Disruptive energy track', 'Growth mindset theme'], subtext: 'Generate confident, innovative music for startup pitch presentations.' },
  'event-promo': { name: 'Event Promo', prompts: ['Exciting event announcement', 'Conference promo music', 'Festival ad soundtrack', 'Event countdown theme'], subtext: 'Create exciting promotional music for events and conferences.' },
  'real-estate-ad': { name: 'Real Estate Ad', prompts: ['Luxury home tour music', 'Property showcase soundtrack', 'Dream home background', 'Aspirational living theme'], subtext: 'Generate elegant music for real estate and property advertisements.' },
  'automotive-ad': { name: 'Automotive Ad', prompts: ['Car commercial soundtrack', 'Driving excitement music', 'Luxury vehicle theme', 'Road trip adventure'], subtext: 'Create dynamic music for automotive commercials and car advertisements.' },
  'food-beverage-ad': { name: 'Food & Beverage Ad', prompts: ['Appetizing ad music', 'Restaurant promo soundtrack', 'Refreshing drink jingle', 'Tasty product theme'], subtext: 'Generate appetizing music for food and beverage advertisements.' },
  'fashion-ad': { name: 'Fashion Ad', prompts: ['Runway show music', 'Fashion brand soundtrack', 'Stylish lookbook background', 'Trendsetting ad theme'], subtext: 'Create stylish, trendy music for fashion advertisements and lookbooks.' },
};

// =============================================================================
// STREAMING PLATFORM EXPORT DATA
// =============================================================================
const streamingExportData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'spotify': { name: 'Spotify', prompts: ['Streaming-ready track', 'Playlist-worthy song', 'Spotify release single', 'Discover Weekly style'], subtext: 'Create professional music ready for Spotify distribution and playlists.' },
  'apple-music': { name: 'Apple Music', prompts: ['Apple Music quality track', 'Curated playlist song', 'High-fidelity audio', 'Apple featured style'], subtext: 'Generate high-quality music optimized for Apple Music distribution.' },
  'amazon-music': { name: 'Amazon Music', prompts: ['Amazon Music track', 'Alexa-friendly audio', 'Prime playlist song', 'Voice-search optimized'], subtext: 'Create music ready for Amazon Music and Alexa playback.' },
  'youtube-music': { name: 'YouTube Music', prompts: ['YouTube Music release', 'Video-ready audio', 'Trending on YouTube style', 'Music video soundtrack'], subtext: 'Generate music optimized for YouTube Music and video content.' },
  'soundcloud': { name: 'SoundCloud', prompts: ['Underground SoundCloud track', 'Independent artist style', 'Remix-ready audio', 'SoundCloud rapper beat'], subtext: 'Create independent, underground-style music for SoundCloud.' },
  'tidal': { name: 'Tidal', prompts: ['High-fidelity audio track', 'Master quality audio', 'Audiophile-grade music', 'Premium streaming quality'], subtext: 'Generate high-fidelity music for Tidal\'s premium streaming.' },
  'deezer': { name: 'Deezer', prompts: ['Flow playlist song', 'Discovery-ready track', 'International streaming audio', 'Global music style'], subtext: 'Create music ready for Deezer\'s global streaming platform.' },
  'audiomack': { name: 'Audiomack', prompts: ['Hip-hop streaming track', 'Trending Audiomack style', 'Urban music release', 'Rap-ready audio'], subtext: 'Generate hip-hop and urban music for Audiomack distribution.' },
  'bandcamp': { name: 'Bandcamp', prompts: ['Independent artist release', 'Direct-to-fan music', 'Album-quality track', 'Supporter-edition audio'], subtext: 'Create independent music for Bandcamp artist releases.' },
  'listen-on-gruvi': { name: 'Listen on Gruvi', prompts: ['Gruvi showcase track', 'Platform featured song', 'Community favorite style', 'Gruvi original music'], subtext: 'Create and share your music directly on Gruvi\'s platform.' },
};

// =============================================================================
// EASE OF USE / BEGINNER MARKETING DATA
// =============================================================================
const easeOfUseData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'no-experience-needed': { name: 'No Experience Needed', prompts: ['First-time music creation', 'Beginner-friendly track', 'Easy starter song', 'Simple melody creation'], subtext: 'Create professional music with zero musical experience required.' },
  'describe-and-create': { name: 'Describe and Create', prompts: ['Just describe your song', 'Text-to-music generation', 'Idea to song instantly', 'Words become music'], subtext: 'Simply describe what you want and AI creates it for you.' },
  'one-minute-songs': { name: 'One Minute Songs', prompts: ['Quick 60-second track', 'Fast music generation', 'Instant song creation', 'Rapid results'], subtext: 'Generate complete songs in under 60 seconds.' },
  'zero-learning-curve': { name: 'Zero Learning Curve', prompts: ['Intuitive creation', 'No tutorials needed', 'Click and create', 'Instant understanding'], subtext: 'Start creating immediately with our intuitive interface.' },
  'non-musicians': { name: 'Music for Non-Musicians', prompts: ['Anyone can create', 'No instruments required', 'AI does the work', 'Musical creativity unlocked'], subtext: 'Unleash your musical creativity without any musical training.' },
  'ai-does-everything': { name: 'AI Does Everything', prompts: ['Fully automated creation', 'AI handles the details', 'Set and forget music', 'Complete AI composition'], subtext: 'Let AI handle all the musical complexity for you.' },
  'mobile-friendly': { name: 'Mobile Friendly', prompts: ['Create on your phone', 'Mobile music making', 'Anywhere anytime creation', 'On-the-go generation'], subtext: 'Create professional music right from your smartphone.' },
  'instant-download': { name: 'Instant Download', prompts: ['Download immediately', 'No waiting required', 'Instant MP3 access', 'Quick export'], subtext: 'Download your created music instantly, no waiting.' },
  'free-to-start': { name: 'Free to Start', prompts: ['Try before you buy', 'Free first song', 'No credit card needed', 'Risk-free trial'], subtext: 'Start creating for free with no credit card required.' },
  'professional-quality': { name: 'Professional Quality', prompts: ['Studio-grade output', 'Radio-ready audio', 'Commercial quality', 'Professional sound'], subtext: 'Get studio-quality professional music from simple descriptions.' },
};

// =============================================================================
// CINEMATIC PRODUCT PROMO DATA
// =============================================================================
const cinematicPromoData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'product-reveal': { name: 'Product Reveal', prompts: ['Dramatic product unveiling', 'Cinematic reveal music', 'Suspenseful buildup', 'Epic product debut'], subtext: 'Create cinematic music for dramatic product reveal videos.' },
  'unboxing-video': { name: 'Unboxing Video', prompts: ['Exciting unboxing soundtrack', 'First impressions music', 'Package reveal theme', 'Unboxing experience audio'], subtext: 'Generate exciting music for product unboxing content.' },
  'product-demo': { name: 'Product Demo', prompts: ['Feature showcase music', 'Demo walkthrough soundtrack', 'Product in action theme', 'How it works background'], subtext: 'Create engaging background music for product demonstrations.' },
  'tech-showcase': { name: 'Tech Showcase', prompts: ['Innovation reveal music', 'Futuristic tech theme', 'Gadget showcase soundtrack', 'Technology demonstration'], subtext: 'Generate futuristic music for technology product showcases.' },
  'luxury-product': { name: 'Luxury Product', prompts: ['Premium brand music', 'High-end product theme', 'Sophisticated showcase', 'Luxury experience soundtrack'], subtext: 'Create sophisticated music for luxury product presentations.' },
  'before-after': { name: 'Before & After', prompts: ['Transformation music', 'Before after reveal', 'Dramatic change soundtrack', 'Results showcase theme'], subtext: 'Generate transformation music for before-and-after content.' },
  'product-comparison': { name: 'Product Comparison', prompts: ['Comparison video music', 'Side by side soundtrack', 'Feature battle theme', 'Which is better audio'], subtext: 'Create objective background music for product comparison videos.' },
  'testimonial-montage': { name: 'Testimonial Montage', prompts: ['Customer story music', 'Review compilation soundtrack', 'Happy customer theme', 'Success stories audio'], subtext: 'Generate heartfelt music for customer testimonial compilations.' },
  'lifestyle-product': { name: 'Lifestyle Product', prompts: ['Lifestyle brand music', 'Living the life soundtrack', 'Aspirational product theme', 'Dream lifestyle audio'], subtext: 'Create aspirational music for lifestyle product marketing.' },
  'product-story': { name: 'Product Story', prompts: ['Brand story music', 'Origin tale soundtrack', 'Behind the product theme', 'Journey of creation audio'], subtext: 'Generate storytelling music for product origin and brand stories.' },
  'seasonal-promo': { name: 'Seasonal Promo', prompts: ['Holiday product music', 'Seasonal campaign soundtrack', 'Limited edition theme', 'Special occasion audio'], subtext: 'Create festive music for seasonal product promotions.' },
  'flash-sale': { name: 'Flash Sale', prompts: ['Urgent sale music', 'Limited time soundtrack', 'Act now theme', 'Countdown excitement audio'], subtext: 'Generate urgent, exciting music for flash sale promotions.' },
  'influencer-collab': { name: 'Influencer Collab', prompts: ['Collab announcement music', 'Partnership reveal soundtrack', 'Creator edition theme', 'Influencer promo audio'], subtext: 'Create trendy music for influencer collaboration promotions.' },
  'crowdfunding': { name: 'Crowdfunding', prompts: ['Kickstarter campaign music', 'Funding goal soundtrack', 'Support us theme', 'Backer appreciation audio'], subtext: 'Generate inspiring music for crowdfunding campaigns.' },
  'app-store-preview': { name: 'App Store Preview', prompts: ['App preview music', 'Mobile app soundtrack', 'Download now theme', 'App store video audio'], subtext: 'Create engaging music for app store preview videos.' },
};

// =============================================================================
// UGC / CHEAP AI VIDEO CONTENT DATA
// =============================================================================
const ugcVideoData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'cheap-ugc': { name: 'Cheap UGC', prompts: ['Authentic UGC music', 'User generated content vibe', 'Real customer testimonial', 'Organic social content'], subtext: 'Create professional UGC-style videos for a fraction of the cost of traditional production.' },
  'ai-ugc-ads': { name: 'AI UGC Ads', prompts: ['Social ad music', 'Scroll-stopping beat', 'TikTok ad soundtrack', 'Instagram reel music'], subtext: 'Generate AI-powered UGC ads completely automated - just describe what you want.' },
  'automated-video-ads': { name: 'Automated Video Ads', prompts: ['Ad campaign music', 'Conversion-focused track', 'Social media ad vibe', 'Performance ad soundtrack'], subtext: 'Fully automated video ad creation - tell us your product and we handle the rest.' },
  'social-media-ads': { name: 'Social Media Ads', prompts: ['Instagram ad music', 'Facebook ad soundtrack', 'TikTok ad beat', 'YouTube ad intro'], subtext: 'Create scroll-stopping social media ads with AI-generated music and visuals.' },
  'test-ad-creative': { name: 'Test Ad Creative', prompts: ['A/B test music', 'Ad variant soundtrack', 'Creative testing vibe', 'Split test audio'], subtext: 'Prototype ad creatives before committing to expensive production costs.' },
  'prototype-ads': { name: 'Prototype Ads', prompts: ['Concept ad music', 'Draft campaign sound', 'Pre-production track', 'Ad mockup audio'], subtext: 'Test your ad concepts with AI-generated prototypes before spending on production.' },
  'low-cost-ads': { name: 'Low Cost Ads', prompts: ['Budget-friendly ad music', 'Affordable campaign track', 'Cost-effective production', 'Startup ad soundtrack'], subtext: 'Create professional ads on a startup budget with AI automation.' },
  'bulk-video-content': { name: 'Bulk Video Content', prompts: ['Content library music', 'Batch production track', 'Multiple variations', 'Scale your content'], subtext: 'Generate bulk video content for your campaigns - dozens of variations in minutes.' },
  'influencer-style-ads': { name: 'Influencer Style Ads', prompts: ['Creator aesthetic music', 'Authentic brand vibe', 'Native content sound', 'Organic ad feel'], subtext: 'Create influencer-style content without the influencer price tag.' },
  'product-review-video': { name: 'Product Review Video', prompts: ['Review video music', 'Product showcase track', 'Honest review vibe', 'Unbiased look soundtrack'], subtext: 'Generate product review style videos with authentic-feeling music.' },
  'testimonial-ad': { name: 'Testimonial Ad', prompts: ['Customer story music', 'Success story track', 'Real results vibe', 'Transformation soundtrack'], subtext: 'Create compelling testimonial-style ads with AI-generated content.' },
  'hook-video': { name: 'Hook Video', prompts: ['Attention grabbing music', 'Scroll stopper beat', 'First 3 seconds track', 'Pattern interrupt sound'], subtext: 'Generate hook videos designed to stop the scroll and grab attention.' },
};

// =============================================================================
// AD TESTING / PROTOTYPE DATA
// =============================================================================
const adTestingData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'ad-creative-testing': { name: 'Ad Creative Testing', prompts: ['Test creative music', 'A/B test soundtrack', 'Creative variation track', 'Performance test audio'], subtext: 'Test ad creatives before doubling down on ad spend - prototype first, commit later.' },
  'pre-launch-ads': { name: 'Pre-Launch Ads', prompts: ['Coming soon music', 'Launch teaser track', 'Anticipation builder', 'Pre-release soundtrack'], subtext: 'Create pre-launch ads to gauge interest before your product is ready.' },
  'mvp-marketing': { name: 'MVP Marketing', prompts: ['Minimum viable music', 'Lean startup track', 'Quick iteration sound', 'Fast test audio'], subtext: 'Generate marketing content for your MVP without breaking the bank.' },
  'ad-mockups': { name: 'Ad Mockups', prompts: ['Mockup presentation music', 'Client pitch track', 'Concept demo sound', 'Draft ad audio'], subtext: 'Create ad mockups to present to clients or stakeholders before production.' },
  'creative-iterations': { name: 'Creative Iterations', prompts: ['Version 2 music', 'Iteration soundtrack', 'Refined concept track', 'Improved creative audio'], subtext: 'Quickly iterate on ad creatives to find what resonates with your audience.' },
  'audience-testing': { name: 'Audience Testing', prompts: ['Target audience music', 'Demographic test track', 'Segment specific sound', 'Persona testing audio'], subtext: 'Create audience-specific ad variations to test which segments convert best.' },
  'message-testing': { name: 'Message Testing', prompts: ['Value prop music', 'Messaging test track', 'Headline variant sound', 'Copy testing audio'], subtext: 'Test different messaging angles with AI-generated ad prototypes.' },
  'format-testing': { name: 'Format Testing', prompts: ['Vertical format music', 'Square video track', 'Stories format sound', 'Reels style audio'], subtext: 'Test different ad formats - vertical, square, landscape - before scaling.' },
};

// =============================================================================
// OCCASION / ACTIVITY MUSIC DATA
// =============================================================================
const occasionMusicData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  // Daily activities
  'morning-routine': { name: 'Morning Routine', prompts: ['Calm morning music', 'Sunrise soundtrack', 'Peaceful wake up', 'Gentle start to day'], subtext: 'Create peaceful music for your calm morning routine.' },
  'gym-workout': { name: 'Gym Workout', prompts: ['High energy gym music', 'Workout motivation track', 'Lifting heavy soundtrack', 'Fitness motivation beat'], subtext: 'Generate pumping gym music to power through your workout.' },
  'running': { name: 'Running', prompts: ['Running pace music', 'Cardio motivation track', 'Jogging rhythm beat', 'Runner high soundtrack'], subtext: 'Create the perfect running playlist with motivating BPM-matched music.' },
  'yoga-session': { name: 'Yoga Session', prompts: ['Yoga flow music', 'Zen meditation track', 'Mindful movement sound', 'Peaceful yoga soundtrack'], subtext: 'Generate calming music for your yoga and stretching practice.' },
  'meditation': { name: 'Meditation', prompts: ['Deep meditation music', 'Mindfulness soundtrack', 'Breathing exercise track', 'Inner peace audio'], subtext: 'Create soothing meditation music for mindfulness and relaxation.' },
  'studying': { name: 'Studying', prompts: ['Focus study music', 'Concentration soundtrack', 'Exam prep track', 'Deep work audio'], subtext: 'Generate study music that helps you focus and retain information.' },
  'working-from-home': { name: 'Working From Home', prompts: ['Productive WFH music', 'Home office soundtrack', 'Focus without distraction', 'Remote work vibe'], subtext: 'Create the perfect work-from-home ambiance with productivity-boosting music.' },
  'cooking': { name: 'Cooking', prompts: ['Kitchen cooking music', 'Chef vibes soundtrack', 'Dinner party prep', 'Culinary inspiration track'], subtext: 'Generate music that makes cooking feel like a culinary adventure.' },
  'dinner-party': { name: 'Dinner Party', prompts: ['Elegant dinner music', 'Dinner party ambiance', 'Sophisticated gathering', 'Evening soiree soundtrack'], subtext: 'Create sophisticated background music for hosting dinner parties.' },
  'road-trip': { name: 'Road Trip', prompts: ['Highway driving music', 'Road trip adventure', 'Open road soundtrack', 'Journey beats'], subtext: 'Generate the ultimate road trip playlist for your adventures.' },
  'beach-day': { name: 'Beach Day', prompts: ['Beach vibes music', 'Ocean waves soundtrack', 'Summer sun track', 'Seaside relaxation'], subtext: 'Create chill beach music for your day by the ocean.' },
  'pool-party': { name: 'Pool Party', prompts: ['Pool party beats', 'Summer splash music', 'Poolside vibes', 'Day drinking soundtrack'], subtext: 'Generate fun pool party music to keep the party going.' },
  'bbq-cookout': { name: 'BBQ Cookout', prompts: ['Backyard BBQ music', 'Cookout vibes', 'Summer gathering track', 'Grill master soundtrack'], subtext: 'Create laid-back music for your backyard BBQ or cookout.' },
  'game-night': { name: 'Game Night', prompts: ['Game night music', 'Board game background', 'Competitive fun track', 'Friends gathering sound'], subtext: 'Generate fun background music for game nights with friends.' },
  'spa-day': { name: 'Spa Day', prompts: ['Spa relaxation music', 'Self-care soundtrack', 'Pamper day vibes', 'Wellness retreat audio'], subtext: 'Create calming spa music for your at-home self-care routine.' },
  'sunday-brunch': { name: 'Sunday Brunch', prompts: ['Brunch vibes music', 'Lazy Sunday soundtrack', 'Mimosa morning track', 'Weekend chill audio'], subtext: 'Generate the perfect soundtrack for a leisurely Sunday brunch.' },
  'late-night-vibes': { name: 'Late Night Vibes', prompts: ['Late night music', 'After hours soundtrack', 'Midnight vibes', 'Night owl tracks'], subtext: 'Create atmospheric music for those late night moments.' },
  'coffee-shop': { name: 'Coffee Shop', prompts: ['Coffee shop ambiance', 'Cafe music vibes', 'Latte art soundtrack', 'Cozy coffee track'], subtext: 'Generate that perfect coffee shop atmosphere music.' },
  'cleaning-house': { name: 'Cleaning House', prompts: ['Cleaning motivation music', 'Housework energy', 'Tidying up soundtrack', 'Productive cleaning beats'], subtext: 'Create upbeat music that makes cleaning feel less like a chore.' },
  'walking-dog': { name: 'Walking Dog', prompts: ['Dog walk music', 'Neighborhood stroll', 'Park walking soundtrack', 'Pet adventure vibes'], subtext: 'Generate pleasant walking music for your daily dog walks.' },
  // Celebrations
  'new-years-eve': { name: 'New Years Eve', prompts: ['New years countdown music', 'NYE party soundtrack', 'Midnight celebration', 'Year end bash'], subtext: 'Create the perfect New Years Eve party music to ring in the new year.' },
  'new-years-day': { name: 'New Years Day', prompts: ['Fresh start music', 'New beginnings soundtrack', 'January first vibes', 'Hopeful new year'], subtext: 'Generate hopeful music for new beginnings and fresh starts.' },
  'super-bowl-party': { name: 'Super Bowl Party', prompts: ['Game day music', 'Football party soundtrack', 'Touchdown celebration', 'Sports party vibes'], subtext: 'Create hype music for your Super Bowl watch party.' },
  'july-4th': { name: 'July 4th', prompts: ['Independence day music', 'Patriotic celebration', 'Fireworks soundtrack', 'Summer holiday vibes'], subtext: 'Generate festive music for Fourth of July celebrations.' },
  'cinco-de-mayo': { name: 'Cinco de Mayo', prompts: ['Cinco party music', 'Mexican celebration', 'Fiesta soundtrack', 'Mariachi fusion'], subtext: 'Create lively music for your Cinco de Mayo fiesta.' },
  'st-patricks-day': { name: 'St Patricks Day', prompts: ['Irish celebration music', 'St Patricks soundtrack', 'Celtic party vibes', 'Green day celebration'], subtext: 'Generate festive Irish-inspired music for St. Patricks Day.' },
  'mardi-gras': { name: 'Mardi Gras', prompts: ['Mardi Gras music', 'Carnival celebration', 'New Orleans vibes', 'Fat Tuesday party'], subtext: 'Create vibrant Mardi Gras music for your celebration.' },
  'baby-shower': { name: 'Baby Shower', prompts: ['Baby shower music', 'Expecting celebration', 'Sweet baby soundtrack', 'Parent party vibes'], subtext: 'Generate sweet, celebratory music for baby showers.' },
  'bridal-shower': { name: 'Bridal Shower', prompts: ['Bridal party music', 'Pre-wedding celebration', 'Bride to be soundtrack', 'Girls celebration'], subtext: 'Create fun music for bridal showers and bachelorette parties.' },
  'bachelor-party': { name: 'Bachelor Party', prompts: ['Bachelor party music', 'Stag do soundtrack', 'Last night out vibes', 'Groom celebration'], subtext: 'Generate party music for bachelor parties and stag nights.' },
  'anniversary': { name: 'Anniversary', prompts: ['Anniversary music', 'Love celebration soundtrack', 'Years together track', 'Romantic milestone'], subtext: 'Create romantic music to celebrate anniversaries.' },
  'retirement-party': { name: 'Retirement Party', prompts: ['Retirement celebration music', 'Career milestone soundtrack', 'New chapter vibes', 'Golden years track'], subtext: 'Generate celebratory music for retirement parties.' },
  'housewarming': { name: 'Housewarming', prompts: ['Housewarming party music', 'New home celebration', 'Welcome home soundtrack', 'House party vibes'], subtext: 'Create welcoming music for housewarming parties.' },
  'promotion-celebration': { name: 'Promotion Celebration', prompts: ['Career success music', 'Promotion party soundtrack', 'Level up vibes', 'Achievement celebration'], subtext: 'Generate triumphant music to celebrate promotions and career wins.' },
};

// =============================================================================
// E-COMMERCE SPECIFIC DATA
// =============================================================================
const ecommerceData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'shopify-store': { name: 'Shopify Store', prompts: ['Shopify store music', 'E-commerce vibe', 'Online shop soundtrack', 'Product page audio'], subtext: 'Create professional promo videos for your Shopify store.' },
  'amazon-fba': { name: 'Amazon FBA', prompts: ['Amazon listing music', 'FBA product video', 'Marketplace promo', 'Amazon seller soundtrack'], subtext: 'Generate product videos for Amazon FBA listings.' },
  'etsy-shop': { name: 'Etsy Shop', prompts: ['Handmade product music', 'Artisan shop vibes', 'Craft store soundtrack', 'Etsy seller promo'], subtext: 'Create charming promo videos for your Etsy handmade shop.' },
  'dropshipping': { name: 'Dropshipping', prompts: ['Dropship product music', 'Trending item promo', 'Viral product video', 'Quick commerce track'], subtext: 'Generate fast, scroll-stopping videos for dropshipping products.' },
  'product-launch': { name: 'Product Launch', prompts: ['Launch day music', 'New product reveal', 'Coming soon soundtrack', 'Release announcement'], subtext: 'Create hype music for your product launch campaigns.' },
  'flash-sale-promo': { name: 'Flash Sale Promo', prompts: ['Urgent sale music', 'Limited time offer', 'Act now soundtrack', 'Countdown timer vibes'], subtext: 'Generate urgent, converting music for flash sales.' },
  'black-friday': { name: 'Black Friday', prompts: ['Black friday music', 'Mega sale soundtrack', 'Shopping frenzy', 'Deal day vibes'], subtext: 'Create exciting music for Black Friday campaigns.' },
  'cyber-monday': { name: 'Cyber Monday', prompts: ['Cyber monday music', 'Online deals soundtrack', 'Digital shopping vibes', 'Tech sale track'], subtext: 'Generate modern music for Cyber Monday promotions.' },
  'holiday-sale': { name: 'Holiday Sale', prompts: ['Holiday shopping music', 'Seasonal sale soundtrack', 'Gift giving vibes', 'Festive deals track'], subtext: 'Create festive music for holiday sales and promotions.' },
  'subscription-box': { name: 'Subscription Box', prompts: ['Unboxing music', 'Monthly surprise soundtrack', 'Subscription reveal', 'Box opening excitement'], subtext: 'Generate exciting music for subscription box promotions.' },
  'bundle-deal': { name: 'Bundle Deal', prompts: ['Bundle value music', 'Package deal soundtrack', 'Save more vibes', 'Combo offer track'], subtext: 'Create compelling music for bundle and package deals.' },
  'new-arrival': { name: 'New Arrival', prompts: ['New arrival music', 'Fresh stock soundtrack', 'Just dropped vibes', 'Latest collection track'], subtext: 'Generate trendy music for new arrival promotions.' },
  'clearance-sale': { name: 'Clearance Sale', prompts: ['Clearance music', 'Everything must go', 'Final sale soundtrack', 'Deep discount vibes'], subtext: 'Create urgent music for clearance and end-of-season sales.' },
  'free-shipping': { name: 'Free Shipping', prompts: ['Free shipping music', 'No cost delivery', 'Shipping deal soundtrack', 'Order now vibes'], subtext: 'Generate promotional music highlighting free shipping offers.' },
  'loyalty-program': { name: 'Loyalty Program', prompts: ['Rewards music', 'VIP member soundtrack', 'Points program vibes', 'Exclusive perks track'], subtext: 'Create engaging music for loyalty and rewards programs.' },
};

// =============================================================================
// SOFTWARE & APP PROMO VIDEO DATA
// =============================================================================
const softwareAppData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  // Mobile Apps
  'mobile-app': { name: 'Mobile App', prompts: ['App store preview video', 'Mobile app demo music', 'iOS Android promo', 'App launch video'], subtext: 'Create stunning mobile app promo videos that drive downloads and installs.' },
  'ios-app': { name: 'iOS App', prompts: ['iPhone app showcase', 'iOS app store video', 'Apple app promo', 'Swift app demo'], subtext: 'Generate professional iOS app preview videos for the App Store.' },
  'android-app': { name: 'Android App', prompts: ['Google Play video', 'Android app demo', 'Kotlin app showcase', 'Play Store promo'], subtext: 'Create compelling Android app videos for Google Play Store listings.' },
  'react-native-app': { name: 'React Native App', prompts: ['Cross-platform app video', 'React Native demo', 'Mobile app promo', 'Hybrid app showcase'], subtext: 'Generate promo videos for your React Native cross-platform apps.' },
  'flutter-app': { name: 'Flutter App', prompts: ['Flutter app demo video', 'Cross-platform showcase', 'Dart app promo', 'Flutter UI video'], subtext: 'Create beautiful promo videos for Flutter apps with smooth animations.' },
  
  // Web Apps & SaaS
  'web-app': { name: 'Web App', prompts: ['SaaS product video', 'Web app demo music', 'Browser app promo', 'Cloud software video'], subtext: 'Create professional web app demo videos that convert visitors to users.' },
  'saas-product': { name: 'SaaS Product', prompts: ['SaaS demo video', 'Subscription software promo', 'Cloud platform showcase', 'B2B software video'], subtext: 'Generate compelling SaaS product videos for landing pages and ads.' },
  'chrome-extension': { name: 'Chrome Extension', prompts: ['Browser extension demo', 'Chrome Web Store video', 'Extension promo music', 'Browser plugin showcase'], subtext: 'Create Chrome extension promo videos that drive installs.' },
  
  // Desktop Software
  'desktop-app': { name: 'Desktop App', prompts: ['Desktop software demo', 'Mac Windows app video', 'Native app promo', 'Desktop tool showcase'], subtext: 'Generate professional desktop application promotional videos.' },
  'mac-app': { name: 'Mac App', prompts: ['macOS app video', 'Mac App Store promo', 'Apple desktop demo', 'Mac software showcase'], subtext: 'Create stunning Mac app videos for the Mac App Store.' },
  'windows-app': { name: 'Windows App', prompts: ['Windows software demo', 'Microsoft Store video', 'PC app promo', 'Windows tool showcase'], subtext: 'Generate professional Windows application promo videos.' },
  
  // Website Builders & No-Code
  'website-builder': { name: 'Website Builder', prompts: ['Site builder demo', 'No-code website video', 'Drag drop builder', 'Website creator promo'], subtext: 'Create promo videos for website builder platforms and templates.' },
  'squarespace-site': { name: 'Squarespace Site', prompts: ['Squarespace template video', 'Portfolio site promo', 'Squarespace design demo', 'Beautiful website showcase'], subtext: 'Generate stunning Squarespace website promotional videos.' },
  'wix-site': { name: 'Wix Site', prompts: ['Wix website demo', 'Wix template promo', 'Drag drop site video', 'Wix design showcase'], subtext: 'Create professional Wix website promo videos.' },
  'webflow-site': { name: 'Webflow Site', prompts: ['Webflow design video', 'No-code website promo', 'Webflow template demo', 'Design showcase'], subtext: 'Generate beautiful Webflow website promotional content.' },
  'framer-site': { name: 'Framer Site', prompts: ['Framer website video', 'Interactive site promo', 'Framer template demo', 'Motion design showcase'], subtext: 'Create dynamic Framer website promo videos with motion.' },
  'wordpress-site': { name: 'WordPress Site', prompts: ['WordPress demo video', 'Theme showcase promo', 'CMS website video', 'WordPress design'], subtext: 'Generate WordPress website and theme promotional videos.' },
  'shopify-store-app': { name: 'Shopify Store', prompts: ['Shopify store demo', 'E-commerce site video', 'Online store promo', 'Shopify theme showcase'], subtext: 'Create Shopify store promotional videos that drive sales.' },
  
  // AI-Coded / Vibe-Coded Apps
  'ai-coded-app': { name: 'AI-Coded App', prompts: ['AI built app video', 'Vibe coded promo', 'AI generated software', 'No-code AI app demo'], subtext: 'Create promo videos for apps built with AI coding assistants.' },
  'lovable-app': { name: 'Lovable App', prompts: ['Lovable built app demo', 'AI generated app video', 'Lovable project promo', 'Vibe coded showcase'], subtext: 'Generate promo videos for apps built with Lovable AI.' },
  'bolt-app': { name: 'Bolt App', prompts: ['Bolt built app video', 'AI coded demo', 'Bolt project promo', 'Instant app showcase'], subtext: 'Create stunning promo videos for Bolt-generated applications.' },
  'cursor-app': { name: 'Cursor-Built App', prompts: ['Cursor coded app demo', 'AI pair programmed video', 'Cursor project promo', 'AI-assisted software'], subtext: 'Generate promo videos for apps built with Cursor AI.' },
  'v0-app': { name: 'v0 App', prompts: ['v0 generated UI video', 'AI designed app promo', 'v0 component showcase', 'Generative UI demo'], subtext: 'Create promo videos for v0-generated interfaces and apps.' },
  'replit-app': { name: 'Replit App', prompts: ['Replit built app video', 'Cloud IDE project promo', 'Replit deployment demo', 'Collaborative app showcase'], subtext: 'Generate promo videos for apps deployed on Replit.' },
  
  // Framework-Specific
  'react-app': { name: 'React App', prompts: ['React application video', 'Frontend app promo', 'React UI demo', 'Component showcase'], subtext: 'Create professional promo videos for React applications.' },
  'nextjs-app': { name: 'Next.js App', prompts: ['Next.js app video', 'Vercel deployment promo', 'SSR app demo', 'Full-stack showcase'], subtext: 'Generate promo videos for Next.js applications.' },
  'vue-app': { name: 'Vue App', prompts: ['Vue.js application video', 'Vue UI promo', 'Frontend demo', 'Vue component showcase'], subtext: 'Create stunning promo videos for Vue.js applications.' },
  'nuxt-app': { name: 'Nuxt App', prompts: ['Nuxt.js app video', 'Vue SSR promo', 'Nuxt project demo', 'Full-stack Vue showcase'], subtext: 'Generate promo videos for Nuxt.js applications.' },
  'svelte-app': { name: 'Svelte App', prompts: ['Svelte application video', 'SvelteKit promo', 'Svelte UI demo', 'Reactive app showcase'], subtext: 'Create promo videos for Svelte and SvelteKit apps.' },
  
  // Startup & Product Hunt
  'startup-app': { name: 'Startup App', prompts: ['Startup product video', 'MVP demo promo', 'Launch day video', 'Investor pitch visual'], subtext: 'Create compelling startup app videos for launches and pitches.' },
  'product-hunt-launch': { name: 'Product Hunt Launch', prompts: ['Product Hunt video', 'Launch day promo', 'Indie maker demo', 'PH featured showcase'], subtext: 'Generate Product Hunt launch videos that get upvotes.' },
  'indie-hacker-app': { name: 'Indie Hacker App', prompts: ['Indie project video', 'Solo developer promo', 'Side project demo', 'Bootstrapped app showcase'], subtext: 'Create authentic promo videos for indie hacker projects.' },
  
  // Developer Tools
  'developer-tool': { name: 'Developer Tool', prompts: ['Dev tool demo video', 'Developer productivity promo', 'Coding tool showcase', 'DevEx software video'], subtext: 'Generate promo videos for developer tools and utilities.' },
  'api-product': { name: 'API Product', prompts: ['API demo video', 'Developer platform promo', 'Integration showcase', 'API documentation video'], subtext: 'Create promo videos for API products and developer platforms.' },
  'cli-tool': { name: 'CLI Tool', prompts: ['Command line demo', 'Terminal tool promo', 'CLI showcase video', 'Developer utility demo'], subtext: 'Generate promo videos for command-line tools and utilities.' },
};

// =============================================================================
// AIRBNB / SHORT-TERM RENTAL DATA
// =============================================================================
const airbnbData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'airbnb-listing': { name: 'Airbnb Listing', prompts: ['Vacation rental music', 'Property showcase', 'Guest welcome soundtrack', 'Booking promo'], subtext: 'Create stunning Airbnb listing videos that attract more bookings.' },
  'vacation-rental': { name: 'Vacation Rental', prompts: ['Holiday home music', 'Vacation property showcase', 'Getaway destination', 'Rental property promo'], subtext: 'Generate beautiful vacation rental promo videos.' },
  'beach-house-rental': { name: 'Beach House Rental', prompts: ['Beach property music', 'Oceanfront rental', 'Coastal getaway', 'Seaside vacation'], subtext: 'Create dreamy beach house rental videos with ocean vibes.' },
  'mountain-cabin': { name: 'Mountain Cabin', prompts: ['Cabin retreat music', 'Mountain escape', 'Rustic getaway', 'Forest hideaway'], subtext: 'Generate cozy mountain cabin rental promotional videos.' },
  'city-apartment': { name: 'City Apartment', prompts: ['Urban rental music', 'Downtown apartment', 'City stay vibes', 'Metro living'], subtext: 'Create stylish city apartment rental videos.' },
  'luxury-villa': { name: 'Luxury Villa', prompts: ['Villa showcase music', 'Luxury property', 'Premium rental', 'Exclusive estate'], subtext: 'Generate sophisticated luxury villa promotional content.' },
  'tiny-house': { name: 'Tiny House', prompts: ['Tiny house music', 'Compact living', 'Minimalist retreat', 'Small space vibes'], subtext: 'Create charming tiny house rental promotional videos.' },
  'treehouse': { name: 'Treehouse', prompts: ['Treehouse adventure music', 'Elevated escape', 'Unique stay vibes', 'Canopy retreat'], subtext: 'Generate whimsical treehouse rental promotional content.' },
  'glamping': { name: 'Glamping', prompts: ['Glamping music', 'Luxury camping', 'Outdoor comfort', 'Nature retreat vibes'], subtext: 'Create enticing glamping site promotional videos.' },
  'houseboat': { name: 'Houseboat', prompts: ['Houseboat living music', 'Floating home', 'Water living vibes', 'Boat stay soundtrack'], subtext: 'Generate unique houseboat rental promotional content.' },
  'farmstay': { name: 'Farmstay', prompts: ['Farm experience music', 'Country living', 'Agricultural retreat', 'Rural getaway'], subtext: 'Create authentic farmstay promotional videos.' },
  'eco-lodge': { name: 'Eco Lodge', prompts: ['Sustainable stay music', 'Eco-friendly retreat', 'Green living vibes', 'Nature harmony'], subtext: 'Generate eco-conscious lodge promotional content.' },
  'historic-property': { name: 'Historic Property', prompts: ['Historic charm music', 'Heritage stay', 'Classic elegance', 'Timeless property'], subtext: 'Create elegant historic property rental videos.' },
  'pet-friendly-rental': { name: 'Pet Friendly Rental', prompts: ['Pet welcome music', 'Furry friend stay', 'Dog friendly vibes', 'Pet paradise'], subtext: 'Generate pet-friendly rental promotional content.' },
  'family-vacation-home': { name: 'Family Vacation Home', prompts: ['Family getaway music', 'Kid friendly stay', 'Group vacation vibes', 'Multi-gen retreat'], subtext: 'Create family-focused vacation rental videos.' },
  'romantic-getaway': { name: 'Romantic Getaway', prompts: ['Romantic retreat music', 'Couples escape', 'Love nest vibes', 'Honeymoon destination'], subtext: 'Generate romantic getaway rental promotional content.' },
  'business-travel': { name: 'Business Travel', prompts: ['Corporate stay music', 'Business trip', 'Executive rental', 'Work travel vibes'], subtext: 'Create professional business travel rental videos.' },
  'monthly-rental': { name: 'Monthly Rental', prompts: ['Extended stay music', 'Long term rental', 'Monthly discount', 'Flexible living'], subtext: 'Generate monthly rental promotional content for long-term guests.' },
  'superhost-promo': { name: 'Superhost Promo', prompts: ['5-star host music', 'Top rated stay', 'Superhost quality', 'Premium hosting'], subtext: 'Create Superhost-worthy promotional videos.' },
  'guest-experience': { name: 'Guest Experience', prompts: ['Welcome guest music', 'Local experience', 'Host hospitality', 'Memorable stay'], subtext: 'Generate guest experience showcase videos.' },
};

// Brand Content / AI Promo Content Data
const brandContentData: { [key: string]: { name: string; prompts: string[]; subtext: string } } = {
  'brand-content-creation': { 
    name: 'Brand Content Creation', 
    prompts: ['AI brand content music', 'Promotional video soundtrack', 'Marketing content track', 'Brand story music'],
    subtext: 'Turn AI music into stunning promotional content for your brand. Create 10-20 content variations in minutes, not weeks.'
  },
  'cheap-ugc-alternative': { 
    name: 'Cheap UGC Alternative', 
    prompts: ['Affordable UGC music', 'Cost-effective brand video', 'AI-generated user content', 'Budget marketing video'],
    subtext: 'Skip expensive UGC creators ($200-500 per video). Generate unlimited, high-quality content for a fraction of the cost.'
  },
  'bulk-social-content': { 
    name: 'Bulk Social Content Creator', 
    prompts: ['Mass social media content', 'Multiple video variations', 'A/B testing content', 'High volume social videos'],
    subtext: 'Create 10-20 variations to find what resonates with your audience. Stop guessing, start testing.'
  },
  'copyright-free-brand-music': { 
    name: 'Copyright-Free Brand Music', 
    prompts: ['Royalty-free brand music', 'No copyright strike audio', 'Safe marketing music', 'Original brand soundtrack'],
    subtext: '100% original, copyright-free music. Safe to use across all your marketing channels without fear of strikes.'
  },
  'one-click-social-posting': { 
    name: 'One-Click Social Posting', 
    prompts: ['Automated social upload music', 'Cross-platform posting', 'Instant social sharing', 'Multi-channel video upload'],
    subtext: 'Publish your promotional videos to YouTube, TikTok, Instagram, and Facebook with one click. Save hours of tedious uploading.'
  },
  'brand-content-at-scale': { 
    name: 'Brand Content at Scale', 
    prompts: ['Scalable marketing content', 'High volume brand videos', 'Automated content generation', 'Mass promotional video'],
    subtext: 'Effortlessly create hundreds of branded videos from a single product description. Scale your marketing without scaling your budget.'
  },
  'skip-expensive-ugc': { 
    name: 'Skip Expensive UGC Creators', 
    prompts: ['Affordable influencer content', 'AI-powered UGC alternative', 'Cost-saving video marketing', 'Budget-friendly brand content'],
    subtext: 'Get the same quality as expensive UGC creators, with instant delivery and unlimited revisions. Maximize your ROI.'
  },
  'test-before-you-spend': { 
    name: 'Test Before You Spend', 
    prompts: ['Ad creative testing music', 'Performance marketing video', 'A/B test ad content', 'Data-driven video ads'],
    subtext: 'Create 20 variations, test which performs best with your audience, and double down on the winners. Optimize your ad spend.'
  },
  'promotional-content-automation': { 
    name: 'Promotional Content Automation', 
    prompts: ['Automated marketing video', 'AI content pipeline', 'Hands-free brand promotion', 'Continuous content generation'],
    subtext: 'Describe your brand once, and get fresh, engaging promotional content automatically generated for all your campaigns.'
  },
  'social-media-content-factory': { 
    name: 'Social Media Content Factory', 
    prompts: ['Unlimited social videos', 'Content generation machine', 'Never run out of ideas', 'Always-on content stream'],
    subtext: 'Never run out of content ideas again. Your personal AI content factory generates unlimited branded videos for all your social channels.'
  },
};

// =============================================================================
// HELPER FUNCTIONS FOR NEW ROUTES
// =============================================================================

function generateArtistRoute(artist: string): RouteConfig {
  const data = artistData[artist];
  const name = data?.name || capitalize(artist);
  const genre = data?.genre || 'Various';
  const prompts = data?.prompts || [`Music inspired by ${name}`, `${name} style track`, `Sound like ${name}`, `${name} inspired song`];
  const subtext = data?.subtext || `Create original music inspired by ${name}'s distinctive sound and style.`;
  
  return {
    path: `/music-like-${artist}`,
    title: `Music Like ${name} - AI ${genre} Music Generator | Gruvi`,
    description: `Generate original music that sounds like ${name}. Create ${genre.toLowerCase()} tracks inspired by ${name}'s iconic style with AI.`,
    keywords: `music like ${name.toLowerCase()}, ${name.toLowerCase()} style music, ai ${name.toLowerCase()} songs, sound like ${name.toLowerCase()}`,
    ogTitle: `Music Like ${name} | Gruvi`,
    ogDescription: `Generate original music inspired by ${name}'s iconic sound.`,
    twitterTitle: `Music Like ${name} | Gruvi`,
    twitterDescription: `Create AI music that sounds like ${name}.`,
    breadcrumbName: `Like ${name}`,
    heroTagline: `Music Like ${name}`,
    heroHeading: `Music Like ${name}\nAI-generated ${genre.toLowerCase()} in their style`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'artist',
  };
}

function generateShowMusicRoute(show: string): RouteConfig {
  const data = showMusicData[show];
  const name = data?.name || capitalize(show);
  const category = data?.category || 'Entertainment';
  const prompts = data?.prompts || [`${name} style soundtrack`, `Music inspired by ${name}`, `${name} theme music`, `${name} score style`];
  const subtext = data?.subtext || `Create original music inspired by ${name}'s iconic soundtrack.`;
  
  return {
    path: `/music-like-${show}`,
    title: `Music Like ${name} - ${category} Soundtrack Generator | Gruvi`,
    description: `Generate original music inspired by ${name}. Create ${category.toLowerCase()} soundtrack-style tracks with AI.`,
    keywords: `${name.toLowerCase()} soundtrack, music like ${name.toLowerCase()}, ${name.toLowerCase()} music, ${category.toLowerCase()} soundtrack`,
    ogTitle: `Music Like ${name} | Gruvi`,
    ogDescription: `Generate music inspired by ${name}'s iconic soundtrack.`,
    twitterTitle: `Music Like ${name} | Gruvi`,
    twitterDescription: `Create AI music in the style of ${name}.`,
    breadcrumbName: name,
    heroTagline: `${name} Style Music`,
    heroHeading: `Music Like ${name}\nAI soundtrack inspired by ${name}`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'showMovie',
  };
}

function generateAnimeSoundtrackRoute(anime: string): RouteConfig {
  const data = animeSoundtrackData[anime];
  const name = data?.name || capitalize(anime);
  const prompts = data?.prompts || [`${name} style anime music`, `${name} battle theme`, `${name} emotional soundtrack`, `${name} opening style`];
  const subtext = data?.subtext || `Create epic anime music inspired by ${name}'s legendary soundtrack.`;
  
  return {
    path: `/anime-music-${anime}`,
    title: `${name} Style Anime Music - AI Soundtrack Generator | Gruvi`,
    description: `Generate original anime music inspired by ${name}. Create epic soundtracks, battle themes, and emotional scores with AI.`,
    keywords: `${name.toLowerCase()} music, ${name.toLowerCase()} soundtrack, anime music like ${name.toLowerCase()}, ${name.toLowerCase()} ost style`,
    ogTitle: `${name} Style Anime Music | Gruvi`,
    ogDescription: `Generate anime music inspired by ${name}'s iconic soundtrack.`,
    twitterTitle: `${name} Anime Music | Gruvi`,
    twitterDescription: `Create AI anime music in the style of ${name}.`,
    breadcrumbName: name,
    heroTagline: `${name} Style Music`,
    heroHeading: `${name} Anime Music\nAI soundtrack inspired by ${name}`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'anime',
  };
}

function generateAdMusicRoute(adType: string): RouteConfig {
  const data = adMusicData[adType];
  const name = data?.name || capitalize(adType);
  const prompts = data?.prompts || [`${name} background music`, `${name} jingle`, `${name} soundtrack`, `${name} audio`];
  const subtext = data?.subtext || `Create professional ${name.toLowerCase()} music for your advertising campaigns.`;
  
  return {
    path: `/music-for-${adType}`,
    title: `${name} Music - Ad & Commercial Music Generator | Gruvi`,
    description: `Generate professional ${name.toLowerCase()} music with AI. Create jingles, soundtracks, and background music for advertising.`,
    keywords: `${adType.replace(/-/g, ' ')} music, ad music, commercial jingle, advertising soundtrack`,
    ogTitle: `${name} Music | Gruvi`,
    ogDescription: `Generate professional ${name.toLowerCase()} music with AI.`,
    twitterTitle: `${name} Music | Gruvi`,
    twitterDescription: `Create AI music for ${name.toLowerCase()}.`,
    breadcrumbName: name,
    heroTagline: `${name} Music`,
    heroHeading: `${name} Music\nProfessional ad music with AI`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'promotional',
  };
}

function generateStreamingExportRoute(platform: string): RouteConfig {
  const data = streamingExportData[platform];
  const name = data?.name || capitalize(platform);
  const prompts = data?.prompts || [`${name} ready track`, `Music for ${name}`, `${name} quality audio`, `${name} release`];
  const subtext = data?.subtext || `Create professional music ready for ${name} distribution and streaming.`;
  
  return {
    path: `/download-for-${platform}`,
    title: `Download for ${name} - Create & Export Music | Gruvi`,
    description: `Create AI music and export to ${name}. Generate streaming-ready tracks for ${name} distribution.`,
    keywords: `${name.toLowerCase()} music, upload to ${name.toLowerCase()}, ${name.toLowerCase()} distribution, music for ${name.toLowerCase()}`,
    ogTitle: `Download for ${name} | Gruvi`,
    ogDescription: `Create AI music ready for ${name} distribution.`,
    twitterTitle: `Music for ${name} | Gruvi`,
    twitterDescription: `Create and export music to ${name}.`,
    breadcrumbName: name,
    heroTagline: `Music for ${name}`,
    heroHeading: `Download for ${name}\nCreate streaming-ready music`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'platform',
  };
}

function generateEaseOfUseRoute(feature: string): RouteConfig {
  const data = easeOfUseData[feature];
  const name = data?.name || capitalize(feature);
  const prompts = data?.prompts || [`Easy ${feature} music`, `Simple song creation`, `Beginner ${feature}`, `Quick ${feature}`];
  const subtext = data?.subtext || `Create professional music easily with our ${name.toLowerCase()} approach.`;
  
  return {
    path: `/${feature}`,
    title: `${name} - Easy AI Music Generator | Gruvi`,
    description: `${subtext} The simplest way to create professional music with AI.`,
    keywords: `easy music maker, ${feature.replace(/-/g, ' ')}, simple song creator, beginner music`,
    ogTitle: `${name} | Gruvi`,
    ogDescription: subtext,
    twitterTitle: `${name} | Gruvi`,
    twitterDescription: `The simplest way to create music.`,
    breadcrumbName: name,
    heroTagline: name,
    heroHeading: `${name}\nThe easiest way to create music`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'default',
  };
}

function generateCinematicPromoRoute(promoType: string): RouteConfig {
  const data = cinematicPromoData[promoType];
  const name = data?.name || capitalize(promoType);
  const prompts = data?.prompts || [`Cinematic ${name.toLowerCase()} music`, `${name} soundtrack`, `${name} background music`, `${name} theme`];
  const subtext = data?.subtext || `Create cinematic music for ${name.toLowerCase()} videos and content.`;
  
  return {
    path: `/cinematic-music-for-${promoType}`,
    title: `Cinematic ${name} Music - Product Promo Soundtrack | Gruvi`,
    description: `Generate cinematic music for ${name.toLowerCase()} videos. Create professional soundtracks for product promotions with AI.`,
    keywords: `${promoType.replace(/-/g, ' ')} music, cinematic promo music, product video soundtrack`,
    ogTitle: `Cinematic ${name} Music | Gruvi`,
    ogDescription: `Generate cinematic music for ${name.toLowerCase()} videos.`,
    twitterTitle: `${name} Music | Gruvi`,
    twitterDescription: `Create cinematic music for ${name.toLowerCase()}.`,
    breadcrumbName: name,
    heroTagline: `${name} Music`,
    heroHeading: `Cinematic ${name} Music\nEpic soundtracks for your videos`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'promotional',
  };
}

function generateUgcVideoRoute(ugcType: string): RouteConfig {
  const data = ugcVideoData[ugcType];
  const name = data?.name || capitalize(ugcType);
  const prompts = data?.prompts || [`${name} promo music`, `${name} video soundtrack`, `${name} content`, `${name} ads`];
  const subtext = data?.subtext || `Create ${name.toLowerCase()} content with AI-generated music and visuals.`;
  
  return {
    path: `/${ugcType}-video`,
    title: `${name} Video Creator - AI UGC & Ad Generator | Gruvi`,
    description: `Create ${name.toLowerCase()} videos with AI. ${subtext} No expensive production - just describe what you want.`,
    keywords: `${ugcType.replace(/-/g, ' ')}, cheap ugc content, ai video ads, automated video content, low cost ads`,
    ogTitle: `${name} Videos | Gruvi`,
    ogDescription: `Create ${name.toLowerCase()} content with AI - fraction of traditional costs.`,
    twitterTitle: `${name} | Gruvi`,
    twitterDescription: `AI-powered ${name.toLowerCase()} creation.`,
    breadcrumbName: name,
    heroTagline: `${name}`,
    heroHeading: `${name}\nAI-powered videos for a fraction of the cost`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'ugc',
  };
}

function generateAdTestingRoute(adType: string): RouteConfig {
  const data = adTestingData[adType];
  const name = data?.name || capitalize(adType);
  const prompts = data?.prompts || [`${name} soundtrack`, `${name} music`, `Test ${name.toLowerCase()}`, `${name} prototype`];
  const subtext = data?.subtext || `Prototype ${name.toLowerCase()} before committing to expensive production.`;
  
  return {
    path: `/${adType}`,
    title: `${name} - Test Ads Before Spending | Gruvi`,
    description: `${subtext} Create AI-powered ad prototypes to test before doubling down on ad spend.`,
    keywords: `${adType.replace(/-/g, ' ')}, test ad creative, prototype ads, ad testing, pre-production ads`,
    ogTitle: `${name} | Gruvi`,
    ogDescription: `Test ad creatives before spending - prototype first.`,
    twitterTitle: `${name} | Gruvi`,
    twitterDescription: `Test before you invest in ads.`,
    breadcrumbName: name,
    heroTagline: `${name}`,
    heroHeading: `${name}\nTest before you commit to ad spend`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'adTesting',
  };
}

function generateOccasionMusicRoute(occasion: string): RouteConfig {
  const data = occasionMusicData[occasion];
  const name = data?.name || capitalize(occasion);
  const prompts = data?.prompts || [`${name} music`, `${name} soundtrack`, `${name} vibes`, `${name} playlist`];
  const subtext = data?.subtext || `Create the perfect music for ${name.toLowerCase()}.`;
  
  return {
    path: `/music-for-${occasion}`,
    title: `${name} Music - AI Generated Soundtrack | Gruvi`,
    description: `Create AI-generated music for ${name.toLowerCase()}. ${subtext}`,
    keywords: `${occasion.replace(/-/g, ' ')} music, ${name.toLowerCase()} playlist, ${name.toLowerCase()} soundtrack, ai music generator`,
    ogTitle: `${name} Music | Gruvi`,
    ogDescription: `Create the perfect ${name.toLowerCase()} soundtrack with AI.`,
    twitterTitle: `${name} Music | Gruvi`,
    twitterDescription: `AI music for ${name.toLowerCase()}.`,
    breadcrumbName: name,
    heroTagline: `${name} Music`,
    heroHeading: `${name} Music\nThe perfect soundtrack for every moment`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'occasion',
  };
}

function generateEcommerceRoute(ecomType: string): RouteConfig {
  const data = ecommerceData[ecomType];
  const name = data?.name || capitalize(ecomType);
  const prompts = data?.prompts || [`${name} promo music`, `${name} video soundtrack`, `${name} ad`, `${name} commercial`];
  const subtext = data?.subtext || `Create professional ${name.toLowerCase()} promotional videos with AI.`;
  
  return {
    path: `/${ecomType}-promo-video`,
    title: `${name} Promo Video - AI E-commerce Video Generator | Gruvi`,
    description: `Create ${name.toLowerCase()} promotional videos with AI. ${subtext}`,
    keywords: `${ecomType.replace(/-/g, ' ')} video, ecommerce promo, product video, ai ad generator, ${name.toLowerCase()} ads`,
    ogTitle: `${name} Promo Videos | Gruvi`,
    ogDescription: `Create ${name.toLowerCase()} videos with AI.`,
    twitterTitle: `${name} Videos | Gruvi`,
    twitterDescription: `AI-powered ${name.toLowerCase()} promo videos.`,
    breadcrumbName: name,
    heroTagline: `${name} Videos`,
    heroHeading: `${name} Promo Videos\nAI-powered e-commerce marketing`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'ecommerce',
  };
}

function generateAirbnbRoute(airbnbType: string): RouteConfig {
  const data = airbnbData[airbnbType];
  const name = data?.name || capitalize(airbnbType);
  const prompts = data?.prompts || [`${name} promo music`, `${name} video`, `${name} showcase`, `${name} listing`];
  const subtext = data?.subtext || `Create stunning ${name.toLowerCase()} promotional videos to attract more bookings.`;
  
  return {
    path: `/${airbnbType}-promo-video`,
    title: `${name} Promo Video - AI Rental Property Marketing | Gruvi`,
    description: `Create ${name.toLowerCase()} promotional videos with AI. ${subtext}`,
    keywords: `${airbnbType.replace(/-/g, ' ')} video, airbnb promo, vacation rental video, property marketing, ${name.toLowerCase()} listing`,
    ogTitle: `${name} Promo Videos | Gruvi`,
    ogDescription: `Create ${name.toLowerCase()} videos to attract more bookings.`,
    twitterTitle: `${name} Videos | Gruvi`,
    twitterDescription: `AI-powered ${name.toLowerCase()} marketing.`,
    breadcrumbName: name,
    heroTagline: `${name} Videos`,
    heroHeading: `${name} Promo Videos\nAttract more bookings with AI`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'airbnb',
  };
}

function generateSoftwareAppRoute(appType: string): RouteConfig {
  const data = softwareAppData[appType];
  const name = data?.name || capitalize(appType);
  const prompts = data?.prompts || [`${name} promo video`, `${name} demo`, `${name} showcase`, `${name} launch`];
  const subtext = data?.subtext || `Create professional ${name.toLowerCase()} promotional videos with AI-generated music and visuals.`;
  
  return {
    path: `/${appType}-promo-video`,
    title: `${name} Promo Video - AI Software & App Marketing | Gruvi`,
    description: `Create stunning ${name.toLowerCase()} promotional videos with AI. ${subtext} Fully automated - just upload screenshots and describe your app.`,
    keywords: `${appType.replace(/-/g, ' ')} promo video, app demo video, software marketing video, ${name.toLowerCase()} showcase, ai video generator`,
    ogTitle: `${name} Promo Videos | Gruvi`,
    ogDescription: `Create ${name.toLowerCase()} videos with AI - drive downloads and signups.`,
    twitterTitle: `${name} Videos | Gruvi`,
    twitterDescription: `AI-powered ${name.toLowerCase()} promo videos.`,
    breadcrumbName: name,
    heroTagline: `${name} Videos`,
    heroHeading: `${name} Promo Videos\nAI-powered app marketing`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'promotional',
  };
}

function generateBrandContentRoute(contentType: string): RouteConfig {
  const data = brandContentData[contentType];
  const name = data?.name || capitalize(contentType);
  const prompts = data?.prompts || [`${name} music`, `${name} video`, `${name} content`, `${name} marketing`];
  const subtext = data?.subtext || `Create stunning ${name.toLowerCase()} with AI-generated music and visuals.`;
  
  return {
    path: `/${contentType}-video`,
    title: `${name} - AI Brand Content & Promo Video Generator | Gruvi`,
    description: `Create stunning ${name.toLowerCase()} with AI. ${subtext} Fully automated - just describe your brand and get professional videos.`,
    keywords: `${contentType.replace(/-/g, ' ')} video, brand content, promotional video, ai marketing, ugc alternative`,
    ogTitle: `${name} | Gruvi`,
    ogDescription: `Create stunning ${name.toLowerCase()} with AI - streamline your brand marketing.`,
    twitterTitle: `${name} | Gruvi`,
    twitterDescription: `AI-powered ${name.toLowerCase()} for your brand.`,
    breadcrumbName: name,
    heroTagline: name,
    heroHeading: `${name}\nAI-powered content for your brand`,
    heroSubtext: subtext,
    examplePrompts: prompts,
    routeCategory: 'promotional',
  };
}

// =============================================================================
// ARRAYS FOR ROUTE GENERATION
// =============================================================================
const artists = Object.keys(artistData);
const showsAndMovies = Object.keys(showMusicData);
const animeSoundtracks = Object.keys(animeSoundtrackData);
const adMusicTypes = Object.keys(adMusicData);
const streamingPlatforms = Object.keys(streamingExportData);
const easeOfUseFeatures = Object.keys(easeOfUseData);
const cinematicPromoTypes = Object.keys(cinematicPromoData);
const ugcVideoTypes = Object.keys(ugcVideoData);
const adTestingTypes = Object.keys(adTestingData);
const occasionMusicTypes = Object.keys(occasionMusicData);
const ecommerceTypes = Object.keys(ecommerceData);
const airbnbTypes = Object.keys(airbnbData);
const softwareAppTypes = Object.keys(softwareAppData);
const brandContentTypes = Object.keys(brandContentData);
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
    heroHeading: 'The AI Music Generator\nEveryone Deserves a Hit Song',
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

  '/product-video-generator': {
    path: '/product-video-generator',
    title: 'AI Product Video Generator - E-commerce & Shopify Videos | Gruvi',
    description: 'Create professional product videos for e-commerce and Shopify stores. Upload product photos and get AI-generated videos with custom music.',
    keywords: 'product video generator, ecommerce video maker, shopify product video, amazon listing video, product promo',
    ogTitle: 'AI Product Video Generator | Gruvi',
    ogDescription: 'Create professional product videos for your online store.',
    twitterTitle: 'AI Product Video Generator | Gruvi',
    twitterDescription: 'Turn product photos into stunning videos.',
    breadcrumbName: 'Product Video Generator',
    heroTagline: 'Product Video Generator',
    heroHeading: 'AI Product Videos\nSell more with music videos',
    heroSubtext: 'Transform product photos into professional videos with AI-generated music. Perfect for Shopify, Amazon, Etsy, and e-commerce stores.',
    examplePrompts: ['Jewelry product showcase', 'Skincare routine video', 'Fashion lookbook', 'Tech product demo'],
    routeCategory: 'ecommerce',
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
  // NEW: Artist "Music Like" routes
  ...Object.fromEntries(artists.map(a => [generateArtistRoute(a).path, generateArtistRoute(a)])),
  // NEW: TV Shows/Movies/Gaming music routes
  ...Object.fromEntries(showsAndMovies.map(s => [generateShowMusicRoute(s).path, generateShowMusicRoute(s)])),
  // NEW: Anime soundtrack routes
  ...Object.fromEntries(animeSoundtracks.map(a => [generateAnimeSoundtrackRoute(a).path, generateAnimeSoundtrackRoute(a)])),
  // NEW: Ad/Commercial music routes
  ...Object.fromEntries(adMusicTypes.map(a => [generateAdMusicRoute(a).path, generateAdMusicRoute(a)])),
  // NEW: Streaming platform export routes
  ...Object.fromEntries(streamingPlatforms.map(p => [generateStreamingExportRoute(p).path, generateStreamingExportRoute(p)])),
  // NEW: Ease of use marketing routes
  ...Object.fromEntries(easeOfUseFeatures.map(f => [generateEaseOfUseRoute(f).path, generateEaseOfUseRoute(f)])),
  // NEW: Cinematic product promo routes
  ...Object.fromEntries(cinematicPromoTypes.map(c => [generateCinematicPromoRoute(c).path, generateCinematicPromoRoute(c)])),
  // NEW: UGC / Cheap AI video content routes
  ...Object.fromEntries(ugcVideoTypes.map(u => [generateUgcVideoRoute(u).path, generateUgcVideoRoute(u)])),
  // NEW: Ad testing / prototype routes
  ...Object.fromEntries(adTestingTypes.map(a => [generateAdTestingRoute(a).path, generateAdTestingRoute(a)])),
  // NEW: Occasion / activity music routes
  ...Object.fromEntries(occasionMusicTypes.map(o => [generateOccasionMusicRoute(o).path, generateOccasionMusicRoute(o)])),
  // NEW: E-commerce specific routes
  ...Object.fromEntries(ecommerceTypes.map(e => [generateEcommerceRoute(e).path, generateEcommerceRoute(e)])),
  // NEW: Airbnb / short-term rental routes
  ...Object.fromEntries(airbnbTypes.map(a => [generateAirbnbRoute(a).path, generateAirbnbRoute(a)])),
  // NEW: Software & App promo video routes
  ...Object.fromEntries(softwareAppTypes.map(s => [generateSoftwareAppRoute(s).path, generateSoftwareAppRoute(s)])),
  // NEW: Brand content / AI promo content routes
  ...Object.fromEntries(brandContentTypes.map(b => [generateBrandContentRoute(b).path, generateBrandContentRoute(b)])),
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
  relationshipTypes, hobbyTypes,
  // NEW exports
  artists, showsAndMovies, animeSoundtracks, adMusicTypes,
  streamingPlatforms, easeOfUseFeatures, cinematicPromoTypes,
  // UGC, Ad Testing, Occasions, E-commerce, Airbnb exports
  ugcVideoTypes, adTestingTypes, occasionMusicTypes, ecommerceTypes, airbnbTypes,
  // Software & App promo video exports
  softwareAppTypes,
  // Brand content / AI promo content exports
  brandContentTypes
};
