import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import {
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { SEO, createBreadcrumbStructuredData } from '../utils/seoHelper';
import { songsApi } from '../services/api';

// Owner user ID for the seed songs (your account)
const SEED_SONGS_USER_ID = 'c6ab6e72-915f-449e-8483-9ef73cec258b';

// Genre data with detailed information - matching the genres we support with images
export const genreData = [
  { id: 'pop', name: 'Pop', image: '/genres/pop.jpeg', color: '#FF6B9D', description: 'Catchy melodies and upbeat rhythms for the masses', fullDescription: 'Pop music is characterized by its catchy melodies, memorable hooks, and accessible sound. Perfect for creating viral content, feel-good tracks, and songs that appeal to a wide audience. From dance-pop to synth-pop, this genre offers endless creative possibilities.' },
  { id: 'hip-hop', name: 'Hip Hop', image: '/genres/hip-hop.jpeg', color: '#9D4EDD', description: 'Urban beats with powerful vocals and rhythms', fullDescription: 'Hip Hop combines rhythmic beats with spoken word, rap, and samples. Create everything from boom bap classics to modern trap-influenced tracks. Perfect for storytelling, social commentary, or party anthems.' },
  { id: 'rnb', name: 'R&B', image: '/genres/rnb.jpeg', color: '#A855F7', description: 'Smooth soulful vibes with emotional depth', fullDescription: 'R&B blends rhythm and blues with soul, funk, and contemporary influences. Create smooth, emotional tracks perfect for romance, reflection, or late-night vibes. Features rich harmonies and groove-driven production.' },
  { id: 'electronic', name: 'Electronic', image: '/genres/electronic.jpeg', color: '#00D9FF', description: 'Synthesized sounds and electronic production', fullDescription: 'Electronic music encompasses a vast world of synthesized sounds, from ambient textures to high-energy bangers. Create everything from chill electronic to festival anthems with cutting-edge production.' },
  { id: 'dance', name: 'Dance', image: '/genres/dance.jpeg', color: '#FF1493', description: 'High-energy beats that move the crowd', fullDescription: 'Dance music is designed to get people moving. With driving beats, infectious rhythms, and euphoric builds, create tracks perfect for clubs, parties, and workout playlists.' },
  { id: 'house', name: 'House', image: '/genres/house.jpeg', color: '#00CED1', description: 'Four-on-the-floor beats and deep grooves', fullDescription: 'House music features the iconic four-on-the-floor beat pattern with soulful elements and deep basslines. From deep house to tech house, create groovy tracks that define dance floor culture.' },
  { id: 'edm', name: 'EDM', image: '/genres/edm.jpeg', color: '#7B68EE', description: 'Festival-ready electronic dance anthems', fullDescription: 'EDM brings together the most explosive elements of electronic music with massive drops, soaring synths, and crowd-moving energy. Perfect for festival anthems and high-energy content.' },
  { id: 'techno', name: 'Techno', image: '/genres/techno.jpeg', color: '#8A2BE2', description: 'Hypnotic rhythms and industrial textures', fullDescription: 'Techno features hypnotic, repetitive rhythms with industrial and mechanical textures. Create mind-bending tracks that build tension and release through subtle evolution and driving beats.' },
  { id: 'rock', name: 'Rock', image: '/genres/rock.jpeg', color: '#FF4757', description: 'Guitar-driven power and raw energy', fullDescription: 'Rock music delivers guitar-driven power with drums and bass creating the foundation. From classic rock to modern alternative, create songs with attitude, energy, and timeless appeal.' },
  { id: 'alternative', name: 'Alternative', image: '/genres/alternative.jpeg', color: '#DC143C', description: 'Indie spirit with experimental edge', fullDescription: 'Alternative rock pushes boundaries while maintaining accessibility. Create unique sounds that blend indie sensibilities with rock power, perfect for distinctive artistic expression.' },
  { id: 'indie', name: 'Indie', image: '/genres/indie.jpeg', color: '#B8860B', description: 'Independent spirit with authentic sound', fullDescription: 'Indie music embraces authentic, DIY aesthetics with diverse influences. Create heartfelt tracks with lo-fi charm or polished indie-pop that stands out from mainstream sounds.' },
  { id: 'punk', name: 'Punk', image: '/genres/punk.jpeg', color: '#FF6347', description: 'Fast, loud, and rebellious', fullDescription: 'Punk delivers fast tempos, aggressive energy, and rebellious attitude. Create raw, energetic tracks with simple chord progressions and powerful messages.' },
  { id: 'metal', name: 'Metal', image: '/genres/metal.jpeg', color: '#2F4F4F', description: 'Heavy riffs and powerful intensity', fullDescription: 'Metal music features heavy guitar riffs, powerful drums, and intense vocals. From heavy metal to death metal, create tracks with maximum intensity and technical prowess.' },
  { id: 'jazz', name: 'Jazz', image: '/genres/jazz.jpeg', color: '#FFB347', description: 'Sophisticated harmonies and improvisation', fullDescription: 'Jazz features complex harmonies, swing rhythms, and improvisation. Create sophisticated tracks from cool jazz to fusion, perfect for cafes, relaxation, or artistic expression.' },
  { id: 'blues', name: 'Blues', image: '/genres/blues.jpeg', color: '#4169E1', description: 'Soulful expression with deep emotion', fullDescription: 'Blues music expresses deep emotion through distinctive chord progressions and soulful vocals. Create authentic tracks with the characteristic 12-bar blues and heartfelt lyrics.' },
  { id: 'soul', name: 'Soul', image: '/genres/soul.jpeg', color: '#CD5C5C', description: 'Heartfelt vocals with gospel influence', fullDescription: 'Soul music combines gospel passion with R&B groove. Create deeply emotional tracks with powerful vocals, rich harmonies, and moving arrangements.' },
  { id: 'funk', name: 'Funk', image: '/genres/funk.jpeg', color: '#FF8C00', description: 'Groovy bass and rhythmic power', fullDescription: 'Funk emphasizes the groove with syncopated bass lines, rhythmic guitars, and punchy horns. Create tracks that demand dancing with irresistible rhythms.' },
  { id: 'classical', name: 'Classical', image: '/genres/classic.jpeg', color: '#4ECDC4', description: 'Timeless orchestral compositions', fullDescription: 'Classical music encompasses centuries of orchestral tradition. Create elegant compositions with strings, woodwinds, brass, and percussion in timeless arrangements.' },
  { id: 'orchestral', name: 'Orchestral', image: '/genres/orchestral.jpeg', color: '#8B4513', description: 'Full orchestra arrangements', fullDescription: 'Orchestral music harnesses the full power of the symphony orchestra. Create grand, sweeping compositions perfect for film, games, or standalone listening.' },
  { id: 'cinematic', name: 'Cinematic', image: '/genres/cinematic.jpeg', color: '#1E293B', description: 'Epic soundscapes for visual media', fullDescription: 'Cinematic music creates emotional soundscapes for films, trailers, and games. Create epic, moving tracks with orchestral and electronic elements.' },
  { id: 'country', name: 'Country', image: '/genres/country.jpeg', color: '#D4A574', description: 'Heartland stories with acoustic roots', fullDescription: 'Country music tells stories of life, love, and land with acoustic instruments and heartfelt lyrics. Create tracks from traditional country to modern country-pop.' },
  { id: 'folk', name: 'Folk', image: '/genres/folk.jpeg', color: '#8B7355', description: 'Traditional acoustic storytelling', fullDescription: 'Folk music preserves traditional storytelling with acoustic instruments. Create intimate tracks with banjo, guitar, and authentic vocals.' },
  { id: 'acoustic', name: 'Acoustic', image: '/genres/acoustic.jpeg', color: '#DEB887', description: 'Stripped-down unplugged sound', fullDescription: 'Acoustic music strips away production to focus on raw instrumentation. Create intimate tracks with guitar, piano, and natural sounds.' },
  { id: 'latin', name: 'Latin', image: '/genres/latin.jpeg', color: '#FF4500', description: 'Passionate rhythms from Latin America', fullDescription: 'Latin music encompasses the rich traditions of Latin America with passionate rhythms, brass, and percussion. Create tracks from salsa to modern Latin pop.' },
  { id: 'reggaeton', name: 'Reggaeton', image: '/genres/raggaeton.jpeg', color: '#FF6B35', description: 'Urban Latin beats with dembow rhythm', fullDescription: 'Reggaeton blends Caribbean rhythms with hip-hop production. Create infectious tracks with the signature dembow beat that dominates global charts.' },
  { id: 'kpop', name: 'K-Pop', image: '/genres/kpop.jpeg', color: '#FF69B4', description: 'Korean pop with polished production', fullDescription: 'K-Pop features highly polished production with catchy hooks and dynamic arrangements. Create radio-ready tracks with the glossy K-Pop aesthetic.' },
  { id: 'jpop', name: 'J-Pop', image: '/genres/jpop.jpeg', color: '#FFB7C5', description: 'Japanese pop with unique character', fullDescription: 'J-Pop brings Japanese pop sensibilities with energetic performances and memorable melodies. Create tracks with the distinctive J-Pop sound.' },
  { id: 'reggae', name: 'Reggae', image: '/genres/raggae.jpeg', color: '#22C55E', description: 'Laid-back Jamaican rhythms', fullDescription: 'Reggae features the off-beat rhythm guitar and bass-heavy grooves of Jamaica. Create chill, positive tracks with the iconic reggae sound.' },
  { id: 'lofi', name: 'Lo-fi', image: '/genres/lofi.jpeg', color: '#94A3B8', description: 'Chill beats with nostalgic warmth', fullDescription: 'Lo-fi music embraces imperfection with warm, nostalgic sounds. Create chill beats perfect for studying, relaxation, and background ambiance.' },
  { id: 'ambient', name: 'Ambient', image: '/genres/ambient.jpeg', color: '#06B6D4', description: 'Atmospheric soundscapes', fullDescription: 'Ambient music creates atmospheric, textural soundscapes. Create meditative, immersive tracks perfect for relaxation and focus.' },
  { id: 'chillout', name: 'Chill', image: '/genres/chillout.jpeg', color: '#5F9EA0', description: 'Relaxed electronic grooves', fullDescription: 'Chill music brings relaxed electronic beats with chilled vibes. Create laid-back tracks for lounge settings and evening relaxation.' },
  { id: 'gospel', name: 'Gospel', image: '/genres/gospels.jpeg', color: '#FFD700', description: 'Spiritual music with powerful vocals', fullDescription: 'Gospel music brings spiritual power with passionate vocals and choir harmonies. Create uplifting, inspirational tracks with gospel tradition.' },
];

// Sample tracks for each genre with song IDs for playback
const genreSampleTracks: Record<string, Array<{id: string; title: string; duration: string; plays: string}>> = {
  'pop': [
    { id: 'a93fd48c-9c12-41a5-8158-7afea227714f', title: 'Unstoppable', duration: '2:17', plays: '0' },
    { id: '49995520-1898-4675-9657-3fd93142fd99', title: 'Neon Confessions', duration: '2:49', plays: '0' },
    { id: '93e99651-7173-49b3-bc47-37e6b33dc15b', title: 'City Lights On My Heart', duration: '2:02', plays: '0' },
  ],
  'hip-hop': [
    { id: '801063e2-df5e-4abf-87b4-5fbfb49cb103', title: 'From the Concrete', duration: '1:45', plays: '0' },
    { id: '48f6a5d8-6086-43ca-9755-5fbbb576c35c', title: 'Concrete Shadows', duration: '1:39', plays: '0' },
    { id: '95bdc790-2b0b-4089-a5b8-a4e948fc00c2', title: 'Legacy in the Making', duration: '1:30', plays: '0' },
  ],
  'rnb': [
    { id: 'a9b292d1-0215-4e5c-a87d-17a9e7654c0c', title: 'Candlelight Promise', duration: '2:55', plays: '0' },
    { id: 'd881f5e8-fa8b-4bad-9b56-f4272841f3a9', title: 'Closer to Midnight', duration: '2:08', plays: '0' },
    { id: '1001f55b-6365-49c6-88a1-0ed1a3670f9c', title: 'Pieces of Tomorrow', duration: '2:58', plays: '0' },
  ],
  'electronic': [
    { id: '40a9ad54-b56d-4cfe-a3be-e19ea85aedee', title: 'Rise Into the Light', duration: '2:55', plays: '0' },
    { id: '79b6d662-b0cd-4a8d-9924-b4e3ba16d7d3', title: 'Crystalline Drift', duration: '2:56', plays: '0' },
    { id: 'd582b35a-792f-43f5-a60c-93ed84282a8c', title: 'Bass Cathedral', duration: '2:45', plays: '0' },
  ],
  'dance': [
    { id: '0fb24f5f-029f-4fc0-bf17-6ef34a709a3e', title: 'Hands Up to the Sky', duration: '2:05', plays: '0' },
    { id: 'b5774873-ea24-49c3-8ff7-4f3ab4f49740', title: 'Rise Into The Light', duration: '2:02', plays: '0' },
    { id: 'b2eafede-e68a-4800-bfc7-fd4cbe8fb926', title: 'Sunrise Protocol', duration: '2:14', plays: '0' },
  ],
  'house': [
    { id: 'dfcaddd2-2896-499a-8823-007483fc76ce', title: 'Golden Hour', duration: '2:29', plays: '0' },
    { id: '9c31f3fa-f744-4cfd-b549-b6d754393de4', title: 'Feel the Groove Tonight', duration: '2:36', plays: '0' },
    { id: '11c4b4cb-bd63-46ad-8473-0ee15014d701', title: 'Shadows on the Floor', duration: '2:00', plays: '0' },
  ],
  'edm': [
    { id: 'a1cf722f-4ec1-45a6-923d-d26b9647ecdb', title: 'Rise Into The Light', duration: '2:08', plays: '0' },
    { id: '61503ad8-a2dd-44e8-8ad6-ac749df1d320', title: 'Rise Into The Light', duration: '3:04', plays: '0' },
    { id: 'f8811329-fc2d-45cc-a25d-7c6ecf8040d8', title: 'Drop The Chaos', duration: '1:36', plays: '0' },
  ],
  'techno': [
    { id: '91e4fe1b-c091-4332-9598-0e0c7d5500f0', title: 'Steel Cathedral', duration: '2:21', plays: '0' },
    { id: 'a10e20cb-3d1c-4ba3-ade6-14c970ba2974', title: 'Machine Heart Protocol', duration: '2:26', plays: '0' },
    { id: '5dab088b-779f-4ae3-a3ef-1c206066f01a', title: 'Pulse of the Infinite', duration: '2:25', plays: '0' },
  ],
  'rock': [
    { id: 'dc096869-8a5e-4c9f-a664-53da6e55966c', title: 'Burn The Night', duration: '2:32', plays: '0' },
    { id: '60bc406a-6e0e-4d92-a0d2-c749a49ed27c', title: 'Ashes of Tomorrow', duration: '2:49', plays: '0' },
    { id: '51815c85-86d9-4c3b-a355-189851a7685f', title: 'Rise Against The Machine', duration: '2:18', plays: '0' },
  ],
  'alternative': [
    { id: 'b2cf2690-797b-4d79-96a1-b75a61d58bb9', title: 'Empty Rooms', duration: '2:50', plays: '0' },
    { id: '10b9b6fa-811c-421f-8ca6-31ac93d25d88', title: 'Concrete Veins', duration: '2:14', plays: '0' },
    { id: '6dbd92a4-21b7-43bd-9292-af33e9959ef5', title: 'Glass Cathedral', duration: '2:33', plays: '0' },
  ],
  'indie': [
    { id: 'abbde752-0560-40dc-858c-75fbc5e5d2b6', title: 'Golden Hour Getaway', duration: '1:57', plays: '0' },
    { id: '64c4cad1-edf4-46c0-b27d-7d4b5ff6c466', title: 'Morning Light on Wooden Floors', duration: '2:03', plays: '0' },
    { id: '5c49bfef-b207-42ac-9a61-762112f1a101', title: 'Polaroid Summer', duration: '1:59', plays: '0' },
  ],
  'punk': [
    { id: '394e6756-92c5-4f55-8ec4-f7a83f09b580', title: 'Not Your Puppet', duration: '1:55', plays: '0' },
    { id: '6af8ad99-6fdc-413d-9080-c6949dc42ee0', title: 'Burn The Blueprint', duration: '1:40', plays: '0' },
    { id: '08fb2cd6-82f9-4c8b-95c1-aff31b1eb212', title: 'Friday Never Ends', duration: '2:14', plays: '0' },
  ],
  'metal': [
    { id: '279f4e79-00bd-45d2-b602-1638fabf8211', title: 'Forge of the Fallen', duration: '4:00', plays: '0' },
    { id: 'dcfcae83-63a5-4975-8496-7b97e04fc7d4', title: 'Teeth of the Void', duration: '3:46', plays: '0' },
    { id: '89a95448-5c1d-4350-9def-714bdeb85b37', title: 'Rise of the Immortal Flame', duration: '3:24', plays: '0' },
  ],
  'jazz': [
    { id: 'd00b4220-bc57-43f8-836d-cae5089da865', title: 'Midnight at the Blue Room', duration: '2:50', plays: '0' },
    { id: '31a82512-422d-47ee-9661-655d6d050ce7', title: 'Sunshine in My Coffee Cup', duration: '2:05', plays: '0' },
    { id: '270244fb-5b27-4012-a989-2be66b03cb35', title: 'Smoke and Shadows', duration: '4:00', plays: '0' },
  ],
  'blues': [
    { id: '39e76336-ea40-4a4a-9458-c45c02e6dc3c', title: 'Worn Down to the Bone', duration: '2:40', plays: '0' },
    { id: '9c309daf-4d94-4325-a617-4964737c489f', title: 'Burning Down the House Tonight', duration: '2:44', plays: '0' },
    { id: 'b92e8d8a-992a-4969-b9a4-f102779044ba', title: 'River Knows My Name', duration: '2:20', plays: '0' },
  ],
  'soul': [
    { id: '147671d9-8dce-4cf4-977a-76747e2403fc', title: 'Rise Up Higher', duration: '2:10', plays: '0' },
    { id: '93bbc4cd-1765-42b0-b688-3bdb6f36234a', title: 'Every Beat of My Heart', duration: '2:39', plays: '0' },
    { id: '3cec23f5-d29d-4fd2-a515-b035c88df0a9', title: 'Empty Chair', duration: '2:50', plays: '0' },
  ],
  'funk': [
    { id: '47b4c888-7c69-43b9-86a4-380f9397fa1c', title: 'Get Up and Groove', duration: '1:47', plays: '0' },
    { id: 'b06697d0-250a-437a-b076-5bf3b3fd2df0', title: 'Pocket Monster', duration: '2:10', plays: '0' },
    { id: 'aa612eba-893a-483a-9235-0639193f8fcb', title: 'Velvet Shadows', duration: '2:37', plays: '0' },
  ],
  'classical': [
    { id: '01be3e64-589a-4dcf-b807-4c34ed357d6e', title: 'Where Rivers Dream', duration: '2:59', plays: '0' },
    { id: '2ec0ddb0-942d-47bd-a9d5-3ae9ec0c218f', title: 'Rise of the Eternal Dawn', duration: '3:38', plays: '0' },
    { id: '4e67936e-4e62-4502-9f55-9ef209060c3d', title: 'Shadows on the Keys', duration: '2:53', plays: '0' },
  ],
  'orchestral': [
    { id: '3484cbee-8a84-4c78-a64a-38f2f402c9c2', title: 'Rise to Glory', duration: '2:25', plays: '0' },
    { id: '9bd4a5e3-b7b9-44bd-bb44-677304166b48', title: 'Kingdom in the Clouds', duration: '2:02', plays: '0' },
    { id: '097b6582-aff3-4c1e-b027-213c9fa2526f', title: 'Through the Ashes We Rise', duration: '3:38', plays: '0' },
  ],
  'cinematic': [
    { id: '84085a8a-cff2-4e62-bd5b-9826472e4f92', title: 'Rise From The Ashes', duration: '2:49', plays: '0' },
    { id: '288e99ea-c174-4b50-8851-8d9b5b4655e1', title: 'Shadows Know Your Name', duration: '2:31', plays: '0' },
    { id: '4ed4cf4d-6a02-457b-adb2-5718501abc9c', title: 'Dawn Will Find Us', duration: '2:46', plays: '0' },
  ],
  'country': [
    { id: '2fba956d-acf6-46e4-85b8-199b09457f60', title: 'Front Porch Kind of Love', duration: '2:32', plays: '0' },
    { id: '2f654e24-9234-41f5-ad36-32ee1ee531cd', title: 'Whiskey and Goodbye', duration: '2:10', plays: '0' },
    { id: '04613af8-ef05-435e-a029-16cd49b61195', title: 'Dust and Neon Nights', duration: '2:35', plays: '0' },
  ],
  'folk': [
    { id: '56dcabf6-d863-4196-af8d-dec64005ba59', title: 'Where the River Leads', duration: '2:17', plays: '0' },
    { id: '9e17a9e2-92c1-4cbe-922b-ccfc4e287c7a', title: 'Where the Porch Light Burns', duration: '2:08', plays: '0' },
    { id: '1b04f3f2-a6e4-43c1-a1f7-6ee6c612ec3a', title: 'Gather Round the Fire', duration: '2:07', plays: '0' },
  ],
  'acoustic': [
    { id: 'eb6a7b3e-e096-4d8b-a4da-b76ee97c2cd3', title: 'Golden Morning Light', duration: '2:24', plays: '0' },
    { id: 'a0745ff4-44ad-4931-879d-398527047196', title: 'Bare Bones', duration: '2:29', plays: '0' },
    { id: 'c9c7d69a-5321-43ff-9f96-9f2df2e00ffc', title: 'Golden Afternoons', duration: '2:33', plays: '0' },
  ],
  'latin': [
    { id: '70e5649c-af1b-4ad8-b2a5-d5c7bdfb9a35', title: 'Fuego en la Pista', duration: '2:24', plays: '0' },
    { id: 'c5f621e3-a198-407a-93a2-cf4a69c23db2', title: 'Fuego en la Pista', duration: '2:00', plays: '0' },
    { id: '9dd51f61-11dc-40f8-b082-397bb1d63786', title: 'Tears on the Guitar Strings', duration: '2:41', plays: '0' },
  ],
  'reggaeton': [
    { id: '6c892b5e-47ba-4e34-b7f1-70d106099608', title: 'Fuego Tonight', duration: '1:26', plays: '0' },
    { id: '20c7291d-3b78-44d2-a874-72e1bcab691d', title: 'Midnight Fire', duration: '2:03', plays: '0' },
    { id: 'b6828045-623e-4b3d-bae4-0b43200d68d7', title: 'Fuego Tonight', duration: '1:31', plays: '0' },
  ],
  'kpop': [
    { id: 'f2614c35-ce09-458d-b647-4ff84ed37ac5', title: 'Shine Like Stars', duration: '1:44', plays: '0' },
    { id: 'f55faf65-d32d-45d1-bc02-57711dbcba82', title: 'Fading Into You', duration: '2:51', plays: '0' },
    { id: '5aba5129-27c4-4220-a8cd-0a440b01aa9b', title: 'Venom Kiss', duration: '1:56', plays: '0' },
  ],
  'jpop': [
    { id: '92cb584b-7a19-4c77-83cf-bd22c85f2c41', title: 'Sunshine in My Heart', duration: '2:04', plays: '0' },
    { id: '899eca98-ce7a-4e5f-9a45-39ceafa9ae1a', title: 'Rising Light', duration: '2:54', plays: '0' },
    { id: 'cba96fc1-204a-4da8-8830-965fc8a081c0', title: 'Neon Heartbeat Warriors', duration: '2:09', plays: '0' },
  ],
  'reggae': [
    { id: '8ebafbb4-6274-400f-83db-62ad1c98c9ad', title: 'Sunshine State of Mind', duration: '2:26', plays: '0' },
    { id: 'a9e15e55-e418-4937-af41-4333bd1be5c7', title: 'One Heart Rising', duration: '2:24', plays: '0' },
    { id: '553196cc-7be1-4834-ba8d-39f2c24f4f21', title: 'Midnight Dub Session', duration: '2:18', plays: '0' },
  ],
  'lofi': [
    { id: 'f4e20940-11a6-4a5c-b992-71961cd53c23', title: 'Rainy Window Afternoons', duration: '1:50', plays: '0' },
    { id: 'b29d4705-e86d-4062-b1fa-5472094c9350', title: 'Raindrops on My Window', duration: '2:11', plays: '0' },
    { id: '3619c929-e7ee-4f88-b62e-9300e545d47d', title: '3AM Thoughts', duration: '2:22', plays: '0' },
  ],
  'ambient': [
    { id: 'c54f6f53-f8ee-4222-8fa0-98a7eb01f6ff', title: 'Infinite Drift', duration: '2:05', plays: '0' },
    { id: '54169f29-44da-4515-912a-38c3e7c428ec', title: 'Whispers of the Forest', duration: '2:22', plays: '0' },
    { id: '4599e89f-77df-48b9-8386-c4597ccb60a1', title: 'Still Waters', duration: '2:04', plays: '0' },
  ],
  'chillout': [
    { id: '06142aaf-4c01-4af4-a318-945bfaf91a36', title: 'Golden Hour Fade', duration: '2:59', plays: '0' },
    { id: '6a55157d-71b5-4052-8beb-229e6399ec57', title: 'Saltwater Dreams', duration: '2:26', plays: '0' },
    { id: 'dd493e6b-a5ac-497c-8952-28161a270e71', title: 'Golden Hour Drive', duration: '2:41', plays: '0' },
  ],
  'gospel': [
    { id: '5de7af18-791c-4a7e-8c81-7b317dc25a6c', title: 'Rise Up in Glory', duration: '2:20', plays: '0' },
    { id: 'bf3942b0-600d-45a9-ab9e-f7bcd3b7b33e', title: 'Grace Like Morning Light', duration: '2:13', plays: '0' },
    { id: '3ad00d73-60e9-46d7-b056-91c8f82038af', title: 'Victory Morning', duration: '2:37', plays: '0' },
  ],
};

const GenreDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { genreId } = useParams<{ genreId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Audio player context
  const { currentSong, isPlaying, playSong, pauseSong } = useAudioPlayer();
  const hasActivePlayer = !!currentSong;
  
  // State for loading songs
  const [loadingSongId, setLoadingSongId] = useState<string | null>(null);
  const [songCache, setSongCache] = useState<Record<string, any>>({});

  // Handle play button click
  const handlePlayClick = useCallback(async (track: { id: string; title: string; duration: string }) => {
    // If this song is currently playing, pause it
    if (currentSong?.songId === track.id && isPlaying) {
      pauseSong();
      return;
    }
    
    // If we already have this song cached, play it
    if (songCache[track.id]) {
      playSong(songCache[track.id]);
      return;
    }
    
    // Fetch the song metadata with audio URL
    setLoadingSongId(track.id);
    try {
      const response = await songsApi.getSongsByIds(SEED_SONGS_USER_ID, [track.id]);
      const songs = response.data?.songs || [];
      
      if (songs.length > 0 && songs[0].audioUrl) {
        const song = {
          songId: songs[0].songId,
          songTitle: songs[0].songTitle,
          genre: songs[0].genre,
          audioUrl: songs[0].audioUrl,
          status: songs[0].status,
          createdAt: songs[0].createdAt,
          duration: songs[0].actualDuration,
        };
        
        // Cache the song
        setSongCache(prev => ({ ...prev, [track.id]: song }));
        
        // Play it
        playSong(song);
      } else {
        console.error('Song not found or no audio URL');
      }
    } catch (error) {
      console.error('Error fetching song:', error);
    } finally {
      setLoadingSongId(null);
    }
  }, [currentSong, isPlaying, playSong, pauseSong, songCache]);

  // Handle create button click - navigate to create page or login
  const handleCreateClick = () => {
    if (user?.userId) {
      navigate('/create?tab=song');
    } else {
      navigate('/login');
    }
  };

  // Find the current genre data
  const currentGenre = useMemo(() => {
    return genreData.find(genre => genre.id === genreId);
  }, [genreId]);

  // Get sample tracks for this genre
  const sampleTracks = useMemo(() => {
    return genreSampleTracks[genreId || ''] || genreSampleTracks['default'];
  }, [genreId]);

  // Scroll to top when component mounts or genreId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [genreId]);

  // If genre not found, redirect to home
  if (!currentGenre) {
    navigate('/');
    return null;
  }

  // Create breadcrumb data
  const breadcrumbData = [
    { name: 'Gruvi', url: 'https://gruvi.ai/' },
    { name: 'Genres', url: 'https://gruvi.ai/genres' },
    { name: currentGenre.name, url: `https://gruvi.ai/genres/${currentGenre.id}` }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fff',
        position: 'relative',
        // Add bottom padding when audio player is visible
        pb: hasActivePlayer ? 12 : 0,
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(ellipse at top, ${currentGenre.color}10 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <SEO
        title={`Create ${currentGenre.name} Music with AI | Gruvi`}
        description={`Generate original ${currentGenre.name} music with Gruvi's AI music generator. ${currentGenre.fullDescription}`}
        keywords={`${currentGenre.name.toLowerCase()} music, AI ${currentGenre.name.toLowerCase()} generator, create ${currentGenre.name.toLowerCase()} songs, ${currentGenre.name.toLowerCase()} beats`}
        ogTitle={`Create ${currentGenre.name} Music with AI | Gruvi`}
        ogDescription={`Generate original ${currentGenre.name} music with Gruvi's AI music generator. ${currentGenre.description}`}
        ogType="website"
        ogUrl={`https://gruvi.ai/genres/${currentGenre.id}`}
        twitterTitle={`Create ${currentGenre.name} Music with AI | Gruvi`}
        twitterDescription={currentGenre.description}
        structuredData={[createBreadcrumbStructuredData(breadcrumbData)]}
      />

      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            mb: 4,
            color: '#1D1D1F',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(0,0,0,0.05)',
            }
          }}
        >
          Back to Home
        </Button>

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          {/* Genre Image */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 140,
              height: 140,
              borderRadius: '32px',
              overflow: 'hidden',
              border: `3px solid ${currentGenre.color}40`,
              boxShadow: `0 20px 60px ${currentGenre.color}30, 0 8px 24px rgba(0,0,0,0.1)`,
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={currentGenre.image}
              alt={currentGenre.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              color: '#1D1D1F',
              mb: 2,
            }}
          >
            {currentGenre.name} Music
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: '1.25rem',
              color: '#86868B',
              mb: 3,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {currentGenre.description}
          </Typography>

          {/* Full Description */}
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: '#1D1D1F',
              mb: 4,
              lineHeight: 1.8,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            {currentGenre.fullDescription}
          </Typography>

          {/* CTA Button */}
          <Button
            variant="contained"
            onClick={handleCreateClick}
            endIcon={<KeyboardArrowRightIcon />}
            sx={{
              background: 'rgba(0,0,0,0.9)',
              backdropFilter: 'blur(20px)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '16px',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              },
            }}
          >
            Create {currentGenre.name} Music
          </Button>
        </Box>

        {/* Sample Tracks Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#1D1D1F',
              mb: 3,
              textAlign: 'center',
            }}
          >
            Example {currentGenre.name} Tracks
          </Typography>

          <Box
            sx={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderRadius: '24px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}
          >
            {sampleTracks.map((track, index) => (
              <Box
                key={track.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderBottom: index < sampleTracks.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(0,122,255,0.04)',
                  },
                }}
              >
                {/* Track Number */}
                <Typography sx={{ width: 24, color: '#86868B', fontWeight: 500 }}>
                  {index + 1}
                </Typography>

                {/* Genre Image as Cover */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <Box
                    component="img"
                    src={currentGenre.image}
                    alt={currentGenre.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                {/* Track Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                    {track.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#86868B' }}>
                    {currentGenre.name} • {track.duration}
                  </Typography>
                </Box>

                {/* Play Button */}
                <IconButton
                  size="small"
                  onClick={() => handlePlayClick(track)}
                  disabled={loadingSongId === track.id}
                  sx={{
                    background: currentSong?.songId === track.id ? '#007AFF' : '#fff',
                    color: currentSong?.songId === track.id ? '#fff' : '#007AFF',
                    width: 40,
                    height: 40,
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: currentSong?.songId === track.id ? '#0066CC' : '#fff',
                      transform: 'translateY(-2px) scale(1.05)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    },
                    '&:disabled': {
                      background: '#f5f5f5',
                    },
                  }}
                >
                  {loadingSongId === track.id ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : currentSong?.songId === track.id && isPlaying ? (
                    <PauseRoundedIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <PlayArrowRoundedIcon sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Related Genres */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1D1D1F',
              mb: 3,
            }}
          >
            Explore More Genres
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
            {genreData.slice(0, 12).filter(g => g.id !== genreId).slice(0, 8).map((genre) => (
              <Box
                key={genre.id}
                onClick={() => navigate(`/genres/${genre.id}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    borderColor: `${genre.color}40`,
                  },
                }}
              >
                <Box
                  component="img"
                  src={genre.image}
                  alt={genre.name}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <Typography sx={{ fontWeight: 500, color: '#1D1D1F' }}>{genre.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            p: 5,
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 2 }}>
            Ready to Create Your Own {currentGenre.name} Track?
          </Typography>
          <Typography sx={{ color: '#86868B', mb: 3, fontSize: '1.1rem' }}>
            Sign up for Gruvi and start generating professional {currentGenre.name} music in seconds.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            sx={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,1))',
              backdropFilter: 'blur(20px)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '16px',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              '&:hover': {
                background: '#000',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              },
            }}
          >
            {user?.userId ? 'Create Music' : 'Get Started Free'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default GenreDetailPage;

