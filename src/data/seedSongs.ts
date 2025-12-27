/**
 * Seed Songs Data for Gruvi
 * 
 * This file contains carefully crafted song prompts for each genre and mood.
 * Each song is designed to showcase the best of each category.
 * 
 * Usage:
 * 1. Navigate to /admin/seed-songs (when logged in)
 * 2. Click "Generate All" or generate individual songs
 * 3. The song IDs will be logged to console and can be updated here
 * 4. Update GenreDetailPage.tsx and MoodDetailPage.tsx with the generated IDs
 */

export interface SeedSong {
  id?: string; // Will be populated after generation
  title: string;
  prompt: string;
  genre: string;
  mood: string;
  language: string;
  duration?: string;
  audioUrl?: string;
  coverUrl?: string;
}

// ============================================================================
// GENRE-BASED SEED SONGS
// Each genre has 3 carefully crafted songs that showcase the genre's essence
// ============================================================================

export const genreSeedSongs: Record<string, SeedSong[]> = {
  // POP
  'pop': [
    {
      title: 'Golden Hour',
      prompt: 'An uplifting pop anthem about chasing dreams and living your best life. Catchy hooks, bright synths, and an infectious chorus that builds to an euphoric drop. Think summer vibes, windows down, feeling unstoppable.',
      genre: 'pop',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Midnight Confessions',
      prompt: 'A slick pop track about late-night revelations and hidden feelings. Smooth vocals over pulsing synth bass, with a memorable pre-chorus that leads into a dance-worthy chorus. Modern pop production with 80s-inspired elements.',
      genre: 'pop',
      mood: 'romantic',
      language: 'en',
    },
    {
      title: 'Neon Hearts',
      prompt: 'An energetic pop song about falling in love in the city. Sparkling production, punchy drums, and a sing-along melody. Features a powerful bridge and an anthemic final chorus. Radio-ready hit vibes.',
      genre: 'pop',
      mood: 'energetic',
      language: 'en',
    },
  ],

  // HIP-HOP
  'hip-hop': [
    {
      title: 'Rise From Nothing',
      prompt: 'A powerful hip-hop track about overcoming adversity and making it from the bottom. Hard-hitting 808s, crisp hi-hats, and motivational verses about the hustle. Features a triumphant hook.',
      genre: 'hip-hop',
      mood: 'triumphant',
      language: 'en',
    },
    {
      title: 'City Never Sleeps',
      prompt: 'A nocturnal hip-hop vibe about late nights in the urban jungle. Dark atmospheric beats, trap influences, and smooth flows about ambition and street wisdom. Moody and cinematic.',
      genre: 'hip-hop',
      mood: 'dark',
      language: 'en',
    },
    {
      title: 'Legacy',
      prompt: 'An introspective hip-hop track about building something that lasts. Soulful sample-based production, boom bap drums, and thoughtful lyrics about purpose and leaving a mark on the world.',
      genre: 'hip-hop',
      mood: 'uplifting',
      language: 'en',
    },
  ],

  // R&B
  'rnb': [
    {
      title: 'Velvet Dreams',
      prompt: 'A silky smooth R&B ballad about deep romantic connection. Lush harmonies, subtle guitar, and passionate vocals over a slow groove. Late-night vibes, candlelit dinner energy.',
      genre: 'rnb',
      mood: 'romantic',
      language: 'en',
    },
    {
      title: 'After Hours',
      prompt: 'A sensual R&B track with modern production. Minimalist beats, airy synths, and vulnerable vocals about intimacy and desire. Think bedroom pop meets classic R&B.',
      genre: 'rnb',
      mood: 'chill',
      language: 'en',
    },
    {
      title: 'Healing Touch',
      prompt: 'An emotional R&B song about mending a broken heart. Soul-stirring vocals, gospel-influenced harmonies, and production that builds from intimate to powerful. Cathartic and beautiful.',
      genre: 'rnb',
      mood: 'sad',
      language: 'en',
    },
  ],

  // ELECTRONIC
  'electronic': [
    {
      title: 'Synthetic Sunrise',
      prompt: 'A progressive electronic track that builds from atmospheric pads to a euphoric climax. Arpeggiated synths, sidechained bass, and a melody that soars. Festival-ready production.',
      genre: 'electronic',
      mood: 'epic',
      language: 'en',
    },
    {
      title: 'Digital Dreamscape',
      prompt: 'A dreamy electronic composition with ethereal textures and glitchy percussion. Floating melodies, reversed sounds, and a hypnotic beat. Ambient meets experimental electronica.',
      genre: 'electronic',
      mood: 'dreamy',
      language: 'en',
    },
    {
      title: 'Circuit Breaker',
      prompt: 'A high-energy electronic banger with aggressive bass design and relentless energy. Build-ups, drops, and intricate sound design. Made for big speakers and late nights.',
      genre: 'electronic',
      mood: 'energetic',
      language: 'en',
    },
  ],

  // DANCE
  'dance': [
    {
      title: 'Feel The Rhythm',
      prompt: 'An irresistible dance track with a four-on-the-floor beat and infectious groove. Funky bassline, chopped vocal samples, and hands-in-the-air moments. Pure club energy.',
      genre: 'dance',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Euphoria',
      prompt: 'A big room dance anthem with massive synth stabs and a drop that hits like a wave. Tension and release, building anticipation, then pure bliss. Festival main stage vibes.',
      genre: 'dance',
      mood: 'epic',
      language: 'en',
    },
    {
      title: 'After Midnight',
      prompt: 'A groovy late-night dance track with subtle tech house influences. Rolling basslines, percussive elements, and a hypnotic melody that keeps you moving until sunrise.',
      genre: 'dance',
      mood: 'energetic',
      language: 'en',
    },
  ],

  // HOUSE
  'house': [
    {
      title: 'Sunset Sessions',
      prompt: 'A deep house track with warm pads, a rolling bassline, and soulful vocal chops. Beach club vibes, golden hour energy. Groovy and sophisticated.',
      genre: 'house',
      mood: 'chill',
      language: 'en',
    },
    {
      title: 'Warehouse Dreams',
      prompt: 'A classic house track with Chicago influences. Punchy drums, jazzy keys, and uplifting chord progressions. Pure dancefloor joy and timeless groove.',
      genre: 'house',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Deeper',
      prompt: 'A dark and driving deep house track. Minimal elements, hypnotic bassline, and atmospheric textures. Underground club energy, heads-down dancing.',
      genre: 'house',
      mood: 'dark',
      language: 'en',
    },
  ],

  // EDM
  'edm': [
    {
      title: 'Supernova',
      prompt: 'An explosive EDM anthem with a massive build-up and earth-shaking drop. Soaring synth leads, crowd-pleasing melodies, and pure festival energy. Hands up, lights on.',
      genre: 'edm',
      mood: 'epic',
      language: 'en',
    },
    {
      title: 'Electric Dreams',
      prompt: 'An uplifting EDM track with melodic elements and emotional chord progressions. Features a powerful vocal hook and a drop that gives you chills. Made for stadium shows.',
      genre: 'edm',
      mood: 'uplifting',
      language: 'en',
    },
    {
      title: 'Rave Nation',
      prompt: 'A high-octane EDM banger with aggressive basslines and relentless energy. Hard-hitting kicks, screeching synths, and non-stop intensity. Mosh pit approved.',
      genre: 'edm',
      mood: 'energetic',
      language: 'en',
    },
  ],

  // TECHNO
  'techno': [
    {
      title: 'Pulse',
      prompt: 'A driving techno track with industrial textures and hypnotic repetition. Pounding kick drums, acid synths, and an unrelenting groove. Berlin club energy.',
      genre: 'techno',
      mood: 'intense',
      language: 'en',
    },
    {
      title: 'Machine Heart',
      prompt: 'A dark and mechanical techno piece with dystopian atmosphere. Cold synths, robotic rhythms, and evolving textures. Warehouse rave at 4am vibes.',
      genre: 'techno',
      mood: 'dark',
      language: 'en',
    },
    {
      title: 'Transcendence',
      prompt: 'A melodic techno journey that builds emotional depth over hypnotic rhythms. Beautiful synth work, driving percussion, and moments of transcendent beauty.',
      genre: 'techno',
      mood: 'epic',
      language: 'en',
    },
  ],

  // ROCK
  'rock': [
    {
      title: 'Thunder Road',
      prompt: 'A powerful rock anthem with crunchy guitars and stadium-worthy drums. Raw energy, rebellious spirit, and a chorus that demands to be shouted. Classic rock meets modern production.',
      genre: 'rock',
      mood: 'energetic',
      language: 'en',
    },
    {
      title: 'Burning Bridges',
      prompt: 'An emotional rock ballad that builds from acoustic intimacy to electric catharsis. Heartfelt lyrics about moving on, with soaring guitar solos and passionate vocals.',
      genre: 'rock',
      mood: 'sad',
      language: 'en',
    },
    {
      title: 'Revolution Rising',
      prompt: 'A driving rock track about standing up and fighting back. Aggressive riffs, pounding drums, and defiant energy. Protest song vibes with modern edge.',
      genre: 'rock',
      mood: 'intense',
      language: 'en',
    },
  ],

  // ALTERNATIVE
  'alternative': [
    {
      title: 'Parallel Lives',
      prompt: 'An atmospheric alternative track with shimmering guitars and introspective lyrics. Builds from quiet verses to an expansive chorus. Think Radiohead meets modern indie.',
      genre: 'alternative',
      mood: 'dreamy',
      language: 'en',
    },
    {
      title: 'Static',
      prompt: 'A gritty alternative rock song with angular guitars and restless energy. Post-punk influences, urgent vocals, and a driving rhythm that never lets up.',
      genre: 'alternative',
      mood: 'intense',
      language: 'en',
    },
    {
      title: 'Paper Walls',
      prompt: 'A melancholic alternative track about isolation and longing. Layered textures, vulnerable vocals, and a slow build to an emotional crescendo.',
      genre: 'alternative',
      mood: 'melancholic',
      language: 'en',
    },
  ],

  // INDIE
  'indie': [
    {
      title: 'Wildflower',
      prompt: 'A sun-drenched indie pop track about carefree summer days. Jangly guitars, shimmering synths, and a melody that sticks in your head for days. Feel-good and authentic.',
      genre: 'indie',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Coffee Shop',
      prompt: 'A warm indie acoustic song about quiet moments and simple pleasures. Fingerpicked guitar, soft harmonies, and a cozy, intimate atmosphere.',
      genre: 'indie',
      mood: 'peaceful',
      language: 'en',
    },
    {
      title: 'Old Photographs',
      prompt: 'A nostalgic indie track about memories and the passage of time. Lo-fi production, wistful melodies, and lyrics that hit close to home.',
      genre: 'indie',
      mood: 'nostalgic',
      language: 'en',
    },
  ],

  // PUNK
  'punk': [
    {
      title: 'No Rules',
      prompt: 'A fast and furious punk track about rejecting conformity. Three chords, maximum attitude, and a chorus that demands a mosh pit. Raw and unpolished.',
      genre: 'punk',
      mood: 'energetic',
      language: 'en',
    },
    {
      title: 'System Failure',
      prompt: 'An aggressive punk anthem about fighting the machine. Distorted bass, thrashing drums, and shouted vocals full of righteous anger.',
      genre: 'punk',
      mood: 'intense',
      language: 'en',
    },
    {
      title: 'Weekend Warriors',
      prompt: 'A fun pop-punk track about living for the weekend. Catchy hooks, bouncy rhythm, and youthful exuberance. Made for singing along with friends.',
      genre: 'punk',
      mood: 'happy',
      language: 'en',
    },
  ],

  // METAL
  'metal': [
    {
      title: 'Forged in Fire',
      prompt: 'An epic metal track with thunderous double bass drums and crushing riffs. Powerful vocals, intricate guitar work, and a breakdown that shakes the earth.',
      genre: 'metal',
      mood: 'epic',
      language: 'en',
    },
    {
      title: 'Descent',
      prompt: 'A dark and heavy metal song about inner demons. Growling vocals, down-tuned guitars, and an oppressive atmosphere. Cathartic heaviness.',
      genre: 'metal',
      mood: 'dark',
      language: 'en',
    },
    {
      title: 'Warrior\'s Call',
      prompt: 'A triumphant power metal anthem about glory and battle. Soaring clean vocals, galloping rhythms, and guitar harmonies that inspire greatness.',
      genre: 'metal',
      mood: 'triumphant',
      language: 'en',
    },
  ],

  // JAZZ
  'jazz': [
    {
      title: 'Blue Velvet Nights',
      prompt: 'A smoky jazz piece with sultry saxophone and brushed drums. Late-night cocktail bar vibes, sophisticated harmonies, and improvisational flourishes.',
      genre: 'jazz',
      mood: 'romantic',
      language: 'en',
    },
    {
      title: 'Sunday Morning',
      prompt: 'A bright and cheerful jazz tune with walking bass and piano comping. Upbeat swing feel, playful melodies, and a sunny disposition.',
      genre: 'jazz',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Midnight in Manhattan',
      prompt: 'A contemplative jazz ballad with muted trumpet and gentle piano. Introspective and moody, perfect for quiet reflection. Classic jazz vibes.',
      genre: 'jazz',
      mood: 'melancholic',
      language: 'en',
    },
  ],

  // BLUES
  'blues': [
    {
      title: 'Trouble on My Mind',
      prompt: 'A soulful blues track about heartache and hard times. Wailing guitar, shuffle rhythm, and vocals that tell a story of struggle. Authentic and raw.',
      genre: 'blues',
      mood: 'sad',
      language: 'en',
    },
    {
      title: 'Roadhouse Stomp',
      prompt: 'An upbeat blues rocker with driving rhythm and fiery guitar licks. Foot-stomping energy, call-and-response vocals, and pure juke joint energy.',
      genre: 'blues',
      mood: 'energetic',
      language: 'en',
    },
    {
      title: 'Delta Sunrise',
      prompt: 'A reflective acoustic blues piece with fingerpicked guitar and weathered vocals. Story of redemption and new beginnings. Roots music at its finest.',
      genre: 'blues',
      mood: 'peaceful',
      language: 'en',
    },
  ],

  // SOUL
  'soul': [
    {
      title: 'Higher Ground',
      prompt: 'An uplifting soul anthem with gospel choir and powerful lead vocals. Inspiring lyrics about rising above, with horns and a groove that moves your spirit.',
      genre: 'soul',
      mood: 'uplifting',
      language: 'en',
    },
    {
      title: 'Tenderness',
      prompt: 'A romantic soul ballad with lush strings and intimate vocals. Classic Motown vibes, sweet harmonies, and pure emotional connection.',
      genre: 'soul',
      mood: 'romantic',
      language: 'en',
    },
    {
      title: 'Broken Wings',
      prompt: 'A heart-wrenching soul track about loss and longing. Emotional vocals, subtle organ, and a slow-burning arrangement that builds to a tearful crescendo.',
      genre: 'soul',
      mood: 'sad',
      language: 'en',
    },
  ],

  // FUNK
  'funk': [
    {
      title: 'Get Down Tonight',
      prompt: 'An irresistible funk track with slap bass and tight horns. Chicken scratch guitar, syncopated drums, and vocals that make you move. Party starter energy.',
      genre: 'funk',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Groove Machine',
      prompt: 'A deep funk groove with minimal elements and maximum pocket. Heavy bass, crispy drums, and wah-wah guitar. Instrumental funk at its finest.',
      genre: 'funk',
      mood: 'energetic',
      language: 'en',
    },
    {
      title: 'Midnight Funk',
      prompt: 'A dark and dirty funk track with synth bass and smoky vibes. Late-night groove, seductive energy, and a beat you can\'t resist.',
      genre: 'funk',
      mood: 'dark',
      language: 'en',
    },
  ],

  // CLASSICAL
  'classical': [
    {
      title: 'Elysian Fields',
      prompt: 'A beautiful orchestral piece with sweeping strings and delicate woodwinds. Romantic era inspired, with emotional peaks and tender valleys.',
      genre: 'classical',
      mood: 'peaceful',
      language: 'en',
    },
    {
      title: 'Storm Symphony',
      prompt: 'A dramatic classical composition with urgent strings and powerful brass. Building tension, thunderous timpani, and a triumphant resolution.',
      genre: 'classical',
      mood: 'epic',
      language: 'en',
    },
    {
      title: 'Nocturne in Blue',
      prompt: 'A gentle piano piece with subtle string accompaniment. Melancholic and beautiful, inspired by Chopin. Perfect for quiet contemplation.',
      genre: 'classical',
      mood: 'melancholic',
      language: 'en',
    },
  ],

  // ORCHESTRAL
  'orchestral': [
    {
      title: 'The Hero\'s Journey',
      prompt: 'An epic orchestral theme with full symphony and choir. Rising action, heroic brass, and a melody that inspires greatness. Film score quality.',
      genre: 'orchestral',
      mood: 'epic',
      language: 'en',
    },
    {
      title: 'Enchanted Forest',
      prompt: 'A magical orchestral piece with whimsical woodwinds and sparkling strings. Fairy tale vibes, wonder and adventure. Perfect for fantasy content.',
      genre: 'orchestral',
      mood: 'dreamy',
      language: 'en',
    },
    {
      title: 'Requiem',
      prompt: 'A solemn and powerful orchestral piece with dark strings and haunting choir. Emotional depth, tragedy, and ultimately hope.',
      genre: 'orchestral',
      mood: 'sad',
      language: 'en',
    },
  ],

  // CINEMATIC
  'cinematic': [
    {
      title: 'Dawn of Destiny',
      prompt: 'An epic cinematic track for trailers and climactic moments. Building percussion, soaring strings, and a powerful brass climax. Goosebumps guaranteed.',
      genre: 'cinematic',
      mood: 'epic',
      language: 'en',
    },
    {
      title: 'Shadows Rising',
      prompt: 'A dark and suspenseful cinematic piece. Tension-building strings, ominous brass, and electronic elements. Perfect for thriller and horror content.',
      genre: 'cinematic',
      mood: 'dark',
      language: 'en',
    },
    {
      title: 'New Horizons',
      prompt: 'An uplifting cinematic track about hope and new beginnings. Inspiring melody, warm strings, and a sense of endless possibility.',
      genre: 'cinematic',
      mood: 'uplifting',
      language: 'en',
    },
  ],

  // COUNTRY
  'country': [
    {
      title: 'Dirt Roads',
      prompt: 'A feel-good country song about small-town life and simple pleasures. Acoustic guitar, pedal steel, and honest lyrics about home.',
      genre: 'country',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Whiskey and Memories',
      prompt: 'A heartfelt country ballad about love lost and lessons learned. Emotional vocals, fiddle, and a chorus that stays with you.',
      genre: 'country',
      mood: 'sad',
      language: 'en',
    },
    {
      title: 'Friday Night Lights',
      prompt: 'An upbeat country rock track about weekend fun. Driving guitars, party energy, and anthemic hooks. Made for tailgates and bonfires.',
      genre: 'country',
      mood: 'energetic',
      language: 'en',
    },
  ],

  // FOLK
  'folk': [
    {
      title: 'The River Song',
      prompt: 'A gentle folk ballad with fingerpicked acoustic guitar and harmonies. Story of journey and discovery, with imagery of nature and wandering.',
      genre: 'folk',
      mood: 'peaceful',
      language: 'en',
    },
    {
      title: 'Homecoming',
      prompt: 'A warm folk song about returning to where you belong. Banjo, acoustic guitar, and lyrics about family, roots, and belonging.',
      genre: 'folk',
      mood: 'nostalgic',
      language: 'en',
    },
    {
      title: 'The Gathering',
      prompt: 'An uplifting folk anthem meant for singing together. Stomping rhythm, group vocals, and a spirit of community and celebration.',
      genre: 'folk',
      mood: 'happy',
      language: 'en',
    },
  ],

  // ACOUSTIC
  'acoustic': [
    {
      title: 'Morning Coffee',
      prompt: 'A cozy acoustic track for quiet mornings. Gentle fingerpicking, warm tones, and a melody that feels like a hug. Perfect background music.',
      genre: 'acoustic',
      mood: 'peaceful',
      language: 'en',
    },
    {
      title: 'Unplugged Heart',
      prompt: 'An emotional acoustic ballad about vulnerability and love. Raw vocals, minimal production, just guitar and truth.',
      genre: 'acoustic',
      mood: 'romantic',
      language: 'en',
    },
    {
      title: 'Campfire Stories',
      prompt: 'A warm and inviting acoustic song about friendship and shared moments. Strumming guitar, soft harmonies, and feel-good vibes.',
      genre: 'acoustic',
      mood: 'happy',
      language: 'en',
    },
  ],

  // LATIN
  'latin': [
    {
      title: 'Fuego del Corazón',
      prompt: 'A passionate Latin track with fiery rhythms and romantic energy. Brass, percussion, and a melody that makes you want to dance. Salsa-inspired heat.',
      genre: 'latin',
      mood: 'romantic',
      language: 'en',
    },
    {
      title: 'Carnival Nights',
      prompt: 'An explosive Latin party track with infectious energy. Horns, timbales, and a rhythm that never stops. Pure celebration and joy.',
      genre: 'latin',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Alma Triste',
      prompt: 'A beautiful Latin ballad about heartbreak. Acoustic guitar, tender vocals, and emotional depth. Bolero-influenced melancholy.',
      genre: 'latin',
      mood: 'sad',
      language: 'en',
    },
  ],

  // REGGAETON
  'reggaeton': [
    {
      title: 'Noche de Fuego',
      prompt: 'A modern reggaeton banger with the signature dembow rhythm. Urban production, catchy hooks, and club-ready energy. Made for the dance floor.',
      genre: 'reggaeton',
      mood: 'energetic',
      language: 'en',
    },
    {
      title: 'Contigo',
      prompt: 'A romantic reggaeton track about passion and desire. Smooth vocals, sensual rhythm, and late-night vibes.',
      genre: 'reggaeton',
      mood: 'romantic',
      language: 'en',
    },
    {
      title: 'Perreo All Night',
      prompt: 'An explosive reggaeton party anthem. Hard-hitting beats, aggressive flow, and maximum energy. Turn up the speakers.',
      genre: 'reggaeton',
      mood: 'happy',
      language: 'en',
    },
  ],

  // K-POP
  'kpop': [
    {
      title: 'Starlight',
      prompt: 'A polished K-pop track with dynamic production and catchy hooks. Dance break, rap verse, and an unforgettable chorus. Idol group energy.',
      genre: 'kpop',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Heartbreak Avenue',
      prompt: 'An emotional K-pop ballad with powerful vocals and cinematic production. Builds to an explosive climax. Made for fan projects.',
      genre: 'kpop',
      mood: 'sad',
      language: 'en',
    },
    {
      title: 'Fierce',
      prompt: 'An intense K-pop track with hard-hitting beats and confident energy. Dark concepts, powerful choreography vibes, and attitude.',
      genre: 'kpop',
      mood: 'intense',
      language: 'en',
    },
  ],

  // J-POP
  'jpop': [
    {
      title: 'Cherry Blossom Dreams',
      prompt: 'A bright and cheerful J-pop track with bouncy production. Sweet melodies, uplifting energy, and a feel-good vibe. Anime opening energy.',
      genre: 'jpop',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Tomorrow\'s Promise',
      prompt: 'An emotional J-pop ballad about hope and determination. Piano-driven, with a powerful vocal performance and inspiring message.',
      genre: 'jpop',
      mood: 'uplifting',
      language: 'en',
    },
    {
      title: 'Electric City',
      prompt: 'An energetic J-pop track with electronic elements and fast-paced production. Neon vibes, anime battle scene energy, and pure excitement.',
      genre: 'jpop',
      mood: 'energetic',
      language: 'en',
    },
  ],

  // REGGAE
  'reggae': [
    {
      title: 'Island Breeze',
      prompt: 'A classic reggae track with laid-back rhythm and positive vibes. Offbeat guitar, deep bass, and sunshine energy. Beach day perfection.',
      genre: 'reggae',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'One Love Rising',
      prompt: 'An uplifting roots reggae track about unity and peace. Conscious lyrics, organic production, and spiritual energy.',
      genre: 'reggae',
      mood: 'uplifting',
      language: 'en',
    },
    {
      title: 'Midnight Dub',
      prompt: 'A heavy dub reggae track with spacey effects and deep bass. Reverb, delay, and a hypnotic groove. Late-night session vibes.',
      genre: 'reggae',
      mood: 'chill',
      language: 'en',
    },
  ],

  // LO-FI
  'lofi': [
    {
      title: 'Study Session',
      prompt: 'A cozy lo-fi beat with vinyl crackle and jazzy chords. Perfect for studying, working, or relaxing. Warm and nostalgic.',
      genre: 'lofi',
      mood: 'chill',
      language: 'en',
    },
    {
      title: 'Rainy Day',
      prompt: 'A melancholic lo-fi track with rain sounds and mellow piano. Introspective vibes, perfect for quiet reflection.',
      genre: 'lofi',
      mood: 'melancholic',
      language: 'en',
    },
    {
      title: 'Late Night Thoughts',
      prompt: 'A dreamy lo-fi beat with soft synths and gentle drums. 3am vibes, when the world is quiet and thoughts flow freely.',
      genre: 'lofi',
      mood: 'dreamy',
      language: 'en',
    },
  ],

  // AMBIENT
  'ambient': [
    {
      title: 'Cosmos',
      prompt: 'A spacious ambient piece with evolving pads and ethereal textures. Vast and meditative, like floating through space.',
      genre: 'ambient',
      mood: 'dreamy',
      language: 'en',
    },
    {
      title: 'Forest Sanctuary',
      prompt: 'A peaceful ambient soundscape with nature-inspired elements. Gentle, organic, and deeply relaxing. Perfect for meditation.',
      genre: 'ambient',
      mood: 'peaceful',
      language: 'en',
    },
    {
      title: 'Deep Focus',
      prompt: 'A minimal ambient track designed for concentration. Subtle textures, no distracting elements, pure focus enhancement.',
      genre: 'ambient',
      mood: 'chill',
      language: 'en',
    },
  ],

  // CHILL
  'chillout': [
    {
      title: 'Sunset Lounge',
      prompt: 'A smooth chillout track with downtempo beats and atmospheric pads. Perfect for unwinding at the end of the day. Ibiza sunset vibes.',
      genre: 'chillout',
      mood: 'chill',
      language: 'en',
    },
    {
      title: 'Ocean Breeze',
      prompt: 'A relaxing chillout piece with gentle rhythms and airy synths. Beach bar energy, waves in the background, total serenity.',
      genre: 'chillout',
      mood: 'peaceful',
      language: 'en',
    },
    {
      title: 'Golden Hour',
      prompt: 'A warm and uplifting chillout track with positive energy. Sunset drive vibes, windows down, feeling content.',
      genre: 'chillout',
      mood: 'happy',
      language: 'en',
    },
  ],

  // GOSPEL
  'gospel': [
    {
      title: 'Glory Rising',
      prompt: 'A powerful gospel anthem with full choir and soaring vocals. Uplifting message, clapping rhythms, and spiritual elevation.',
      genre: 'gospel',
      mood: 'uplifting',
      language: 'en',
    },
    {
      title: 'Amazing Grace Reimagined',
      prompt: 'A modern gospel arrangement with traditional roots. Choir harmonies, organ, and a message of redemption and hope.',
      genre: 'gospel',
      mood: 'peaceful',
      language: 'en',
    },
    {
      title: 'Joy in the Morning',
      prompt: 'A celebratory gospel track about overcoming trials. Handclaps, tambourine, and infectious joy. Sunday morning energy.',
      genre: 'gospel',
      mood: 'happy',
      language: 'en',
    },
  ],
};

// ============================================================================
// MOOD-BASED SEED SONGS
// Each mood has 3 songs that perfectly capture the emotional essence
// ============================================================================

export const moodSeedSongs: Record<string, SeedSong[]> = {
  // HAPPY
  'happy': [
    {
      title: 'Best Day Ever',
      prompt: 'An irresistibly joyful pop track about celebrating life. Bright synths, upbeat drums, and a chorus that makes you smile. Pure happiness in song form.',
      genre: 'pop',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Dancing in the Sun',
      prompt: 'A feel-good indie track with jangly guitars and carefree energy. Summer vibes, outdoor festival, best friends singing along.',
      genre: 'indie',
      mood: 'happy',
      language: 'en',
    },
    {
      title: 'Good Times',
      prompt: 'A funky, groovy track about having fun. Slap bass, horns, and a rhythm that gets everyone moving. Instant party starter.',
      genre: 'funk',
      mood: 'happy',
      language: 'en',
    },
  ],

  // SAD
  'sad': [
    {
      title: 'Letting Go',
      prompt: 'A heartbreaking ballad about saying goodbye to someone you love. Piano, strings, and vulnerable vocals that cut deep.',
      genre: 'pop',
      mood: 'sad',
      language: 'en',
    },
    {
      title: 'Empty Rooms',
      prompt: 'An atmospheric track about loneliness and loss. Sparse production, haunting melody, and lyrics that resonate with heartache.',
      genre: 'alternative',
      mood: 'sad',
      language: 'en',
    },
    {
      title: 'Rain on the Window',
      prompt: 'A gentle acoustic piece about quiet sadness and reflection. Fingerpicked guitar, soft vocals, and tears falling like rain.',
      genre: 'acoustic',
      mood: 'sad',
      language: 'en',
    },
  ],

  // ENERGETIC
  'energetic': [
    {
      title: 'Unstoppable',
      prompt: 'A high-octane track about being invincible. Driving beat, powerful synths, and lyrics about breaking limits. Workout playlist essential.',
      genre: 'electronic',
      mood: 'energetic',
      language: 'en',
    },
    {
      title: 'Ignite',
      prompt: 'An explosive rock anthem that gets your blood pumping. Crunchy guitars, pounding drums, and raw power.',
      genre: 'rock',
      mood: 'energetic',
      language: 'en',
    },
    {
      title: 'Go Hard',
      prompt: 'A motivational hip-hop track about giving everything you\'ve got. Hard-hitting beats, confident delivery, and relentless energy.',
      genre: 'hip-hop',
      mood: 'energetic',
      language: 'en',
    },
  ],

  // ROMANTIC
  'romantic': [
    {
      title: 'Forever Yours',
      prompt: 'A timeless love song about devotion and commitment. Beautiful melody, heartfelt lyrics, and arrangements that sweep you off your feet.',
      genre: 'pop',
      mood: 'romantic',
      language: 'en',
    },
    {
      title: 'Candlelight',
      prompt: 'An intimate R&B track about deep connection. Silky vocals, subtle production, and pure romance. Date night perfection.',
      genre: 'rnb',
      mood: 'romantic',
      language: 'en',
    },
    {
      title: 'First Dance',
      prompt: 'A classic-feeling song perfect for a wedding first dance. Orchestral touches, gentle rhythm, and love in every note.',
      genre: 'acoustic',
      mood: 'romantic',
      language: 'en',
    },
  ],

  // CHILL
  'chill': [
    {
      title: 'Floating',
      prompt: 'A supremely relaxed track with ambient textures and gentle beats. Like floating on calm water, completely at peace.',
      genre: 'chillout',
      mood: 'chill',
      language: 'en',
    },
    {
      title: 'Lazy Sunday',
      prompt: 'A laid-back lo-fi track for doing nothing at all. Warm sounds, no rush, just vibes.',
      genre: 'lofi',
      mood: 'chill',
      language: 'en',
    },
    {
      title: 'Hammock Dreams',
      prompt: 'A tropical-influenced chill track with gentle grooves. Afternoon nap energy, palm trees swaying, zero worries.',
      genre: 'reggae',
      mood: 'chill',
      language: 'en',
    },
  ],

  // EPIC
  'epic': [
    {
      title: 'The Final Stand',
      prompt: 'A massive cinematic piece about the ultimate battle. Full orchestra, thunderous percussion, and a melody that gives you chills.',
      genre: 'cinematic',
      mood: 'epic',
      language: 'en',
    },
    {
      title: 'Legends Never Die',
      prompt: 'An anthemic rock-orchestral hybrid about immortal legacy. Soaring vocals, guitar and strings together, triumphant energy.',
      genre: 'rock',
      mood: 'epic',
      language: 'en',
    },
    {
      title: 'Beyond the Stars',
      prompt: 'An expansive electronic track about infinite possibility. Building layers, euphoric climax, and a sense of cosmic wonder.',
      genre: 'electronic',
      mood: 'epic',
      language: 'en',
    },
  ],

  // DREAMY
  'dreamy': [
    {
      title: 'Lucid',
      prompt: 'A hazy, ethereal track that feels like a waking dream. Floating synths, gentle vocals, and otherworldly textures.',
      genre: 'electronic',
      mood: 'dreamy',
      language: 'en',
    },
    {
      title: 'Cloud Kingdom',
      prompt: 'A whimsical ambient piece with childlike wonder. Delicate melodies, soft bells, and magical atmosphere.',
      genre: 'ambient',
      mood: 'dreamy',
      language: 'en',
    },
    {
      title: 'Stardust',
      prompt: 'A shoegaze-inspired track with walls of reverb and distant vocals. Beautiful, hazy, like stars twinkling in a dream.',
      genre: 'alternative',
      mood: 'dreamy',
      language: 'en',
    },
  ],

  // DARK
  'dark': [
    {
      title: 'Shadows',
      prompt: 'A menacing track with ominous bass and unsettling textures. Something lurking in the darkness, heart pounding.',
      genre: 'electronic',
      mood: 'dark',
      language: 'en',
    },
    {
      title: 'Nightmare',
      prompt: 'A heavy, disturbing metal track about facing your demons. Crushing weight, tortured vocals, cathartic darkness.',
      genre: 'metal',
      mood: 'dark',
      language: 'en',
    },
    {
      title: 'The Abyss',
      prompt: 'A deep, atmospheric track about the void. Drone textures, minimal elements, and existential dread in sonic form.',
      genre: 'ambient',
      mood: 'dark',
      language: 'en',
    },
  ],

  // UPLIFTING
  'uplifting': [
    {
      title: 'Rise',
      prompt: 'An inspirational anthem about overcoming obstacles. Building progression, triumphant chorus, and a message of hope.',
      genre: 'pop',
      mood: 'uplifting',
      language: 'en',
    },
    {
      title: 'New Beginnings',
      prompt: 'A cinematic piece about fresh starts and endless possibility. Emotional strings, hopeful melody, and light after darkness.',
      genre: 'cinematic',
      mood: 'uplifting',
      language: 'en',
    },
    {
      title: 'We Can Do This',
      prompt: 'A motivational gospel-influenced track about collective strength. Choir, claps, and an energy that lifts spirits.',
      genre: 'gospel',
      mood: 'uplifting',
      language: 'en',
    },
  ],

  // NOSTALGIC
  'nostalgic': [
    {
      title: 'Photographs',
      prompt: 'A bittersweet track about memories and the passage of time. Vintage sounds, warm production, and lyrics that make you remember.',
      genre: 'indie',
      mood: 'nostalgic',
      language: 'en',
    },
    {
      title: 'Summers Past',
      prompt: 'An 80s-inspired synth track about youth and innocence. Retro sounds, sunset vibes, and beautiful melancholy.',
      genre: 'electronic',
      mood: 'nostalgic',
      language: 'en',
    },
    {
      title: 'Old Love Letters',
      prompt: 'A tender acoustic song about revisiting the past. Gentle guitar, honest vocals, and the ache of what was.',
      genre: 'folk',
      mood: 'nostalgic',
      language: 'en',
    },
  ],

  // PEACEFUL
  'peaceful': [
    {
      title: 'Still Waters',
      prompt: 'A serene ambient piece like a calm lake at dawn. Gentle pads, nature sounds, and complete tranquility.',
      genre: 'ambient',
      mood: 'peaceful',
      language: 'en',
    },
    {
      title: 'Garden Meditation',
      prompt: 'A peaceful acoustic track for relaxation. Soft fingerpicking, birds in the background, and inner calm.',
      genre: 'acoustic',
      mood: 'peaceful',
      language: 'en',
    },
    {
      title: 'Temple Bells',
      prompt: 'A meditative piece with Eastern influences. Gentle bells, flowing melodies, and spiritual serenity.',
      genre: 'classical',
      mood: 'peaceful',
      language: 'en',
    },
  ],

  // INTENSE
  'intense': [
    {
      title: 'Breaking Point',
      prompt: 'A ferocious track about reaching your limit. Aggressive production, urgent energy, and no holding back.',
      genre: 'rock',
      mood: 'intense',
      language: 'en',
    },
    {
      title: 'Overdrive',
      prompt: 'A relentless electronic track that never lets up. Pounding beats, distorted synths, and maximum intensity.',
      genre: 'electronic',
      mood: 'intense',
      language: 'en',
    },
    {
      title: 'War Cry',
      prompt: 'A powerful metal anthem about going to battle. Crushing riffs, fierce vocals, and warrior energy.',
      genre: 'metal',
      mood: 'intense',
      language: 'en',
    },
  ],

  // MELANCHOLIC
  'melancholic': [
    {
      title: 'Grey Skies',
      prompt: 'A beautifully sad track about lingering sadness. Piano, subtle strings, and a weight that feels familiar.',
      genre: 'classical',
      mood: 'melancholic',
      language: 'en',
    },
    {
      title: 'Fading Light',
      prompt: 'An indie track about beautiful sadness. Bittersweet melodies, introspective lyrics, and emotional depth.',
      genre: 'indie',
      mood: 'melancholic',
      language: 'en',
    },
    {
      title: 'The Long Goodbye',
      prompt: 'A jazz-influenced piece about parting. Muted trumpet, gentle piano, and the beauty in farewell.',
      genre: 'jazz',
      mood: 'melancholic',
      language: 'en',
    },
  ],

  // PLAYFUL
  'playful': [
    {
      title: 'Bounce',
      prompt: 'A fun and quirky track that makes you smile. Bouncy rhythm, playful synths, and childlike joy.',
      genre: 'pop',
      mood: 'playful',
      language: 'en',
    },
    {
      title: 'Mischief',
      prompt: 'A cheeky instrumental with cartoon energy. Xylophone, pizzicato strings, and pure silliness.',
      genre: 'orchestral',
      mood: 'playful',
      language: 'en',
    },
    {
      title: 'Party Animal',
      prompt: 'A wild funk track about letting loose. Ridiculous energy, funny sounds, and maximum fun.',
      genre: 'funk',
      mood: 'playful',
      language: 'en',
    },
  ],

  // MYSTERIOUS
  'mysterious': [
    {
      title: 'The Unknown',
      prompt: 'An eerie, intriguing track about secrets and shadows. Unexpected sounds, tension, and curiosity.',
      genre: 'electronic',
      mood: 'mysterious',
      language: 'en',
    },
    {
      title: 'Ancient Riddles',
      prompt: 'A cinematic piece about discovery and wonder. Exotic scales, subtle percussion, and archaeological adventure vibes.',
      genre: 'cinematic',
      mood: 'mysterious',
      language: 'en',
    },
    {
      title: 'Midnight Detective',
      prompt: 'A jazz-noir track about solving mysteries. Smoky saxophone, walking bass, and film noir atmosphere.',
      genre: 'jazz',
      mood: 'mysterious',
      language: 'en',
    },
  ],

  // TRIUMPHANT
  'triumphant': [
    {
      title: 'Victory',
      prompt: 'A glorious anthem about winning against all odds. Brass fanfares, powerful drums, and pure triumph.',
      genre: 'orchestral',
      mood: 'triumphant',
      language: 'en',
    },
    {
      title: 'Champion',
      prompt: 'A rock anthem about being the best. Stadium energy, fist-pumping chorus, and unshakeable confidence.',
      genre: 'rock',
      mood: 'triumphant',
      language: 'en',
    },
    {
      title: 'We Made It',
      prompt: 'A hip-hop celebration of success. Victorious beats, confident flow, and the sweet taste of achievement.',
      genre: 'hip-hop',
      mood: 'triumphant',
      language: 'en',
    },
  ],

  // PROMOTIONAL
  'promotional': [
    {
      title: 'The Future is Now',
      prompt: 'A sleek, modern track for tech and innovation content. Polished production, forward-thinking energy, and professional appeal.',
      genre: 'electronic',
      mood: 'promotional',
      language: 'en',
    },
    {
      title: 'Your Story',
      prompt: 'An inspiring track for brand storytelling. Emotional but professional, with a sense of journey and aspiration.',
      genre: 'cinematic',
      mood: 'promotional',
      language: 'en',
    },
    {
      title: 'Make It Happen',
      prompt: 'An upbeat corporate track that motivates action. Positive energy, clear progression, and a call to action feel.',
      genre: 'pop',
      mood: 'promotional',
      language: 'en',
    },
  ],
};

// Helper to get all genre IDs
export const getAllGenreIds = (): string[] => Object.keys(genreSeedSongs);

// Helper to get all mood IDs  
export const getAllMoodIds = (): string[] => Object.keys(moodSeedSongs);

// Helper to get songs for a specific genre
export const getSongsForGenre = (genreId: string): SeedSong[] => genreSeedSongs[genreId] || [];

// Helper to get songs for a specific mood
export const getSongsForMood = (moodId: string): SeedSong[] => moodSeedSongs[moodId] || [];

// Total count helpers
export const getTotalGenreSongs = (): number => 
  Object.values(genreSeedSongs).reduce((acc, songs) => acc + songs.length, 0);

export const getTotalMoodSongs = (): number => 
  Object.values(moodSeedSongs).reduce((acc, songs) => acc + songs.length, 0);

