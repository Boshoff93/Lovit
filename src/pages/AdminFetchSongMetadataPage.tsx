import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { songsApi } from '../services/api';

// All song IDs organized by category
const genreSongIds: Record<string, string[]> = {
  'pop': [
    'a93fd48c-9c12-41a5-8158-7afea227714f',
    '49995520-1898-4675-9657-3fd93142fd99',
    '93e99651-7173-49b3-bc47-37e6b33dc15b',
  ],
  'hip-hop': [
    '801063e2-df5e-4abf-87b4-5fbfb49cb103',
    '48f6a5d8-6086-43ca-9755-5fbbb576c35c',
    '95bdc790-2b0b-4089-a5b8-a4e948fc00c2',
  ],
  'rnb': [
    'a9b292d1-0215-4e5c-a87d-17a9e7654c0c',
    'd881f5e8-fa8b-4bad-9b56-f4272841f3a9',
    '1001f55b-6365-49c6-88a1-0ed1a3670f9c',
  ],
  'electronic': [
    '40a9ad54-b56d-4cfe-a3be-e19ea85aedee',
    '79b6d662-b0cd-4a8d-9924-b4e3ba16d7d3',
    'd582b35a-792f-43f5-a60c-93ed84282a8c',
  ],
  'dance': [
    '0fb24f5f-029f-4fc0-bf17-6ef34a709a3e',
    'b5774873-ea24-49c3-8ff7-4f3ab4f49740',
    'b2eafede-e68a-4800-bfc7-fd4cbe8fb926',
  ],
  'house': [
    'dfcaddd2-2896-499a-8823-007483fc76ce',
    '9c31f3fa-f744-4cfd-b549-b6d754393de4',
    '11c4b4cb-bd63-46ad-8473-0ee15014d701',
  ],
  'edm': [
    'a1cf722f-4ec1-45a6-923d-d26b9647ecdb',
    '61503ad8-a2dd-44e8-8ad6-ac749df1d320',
    'f8811329-fc2d-45cc-a25d-7c6ecf8040d8',
  ],
  'techno': [
    '91e4fe1b-c091-4332-9598-0e0c7d5500f0',
    'a10e20cb-3d1c-4ba3-ade6-14c970ba2974',
    '5dab088b-779f-4ae3-a3ef-1c206066f01a',
  ],
  'rock': [
    'dc096869-8a5e-4c9f-a664-53da6e55966c',
    '60bc406a-6e0e-4d92-a0d2-c749a49ed27c',
    '51815c85-86d9-4c3b-a355-189851a7685f',
  ],
  'alternative': [
    'b2cf2690-797b-4d79-96a1-b75a61d58bb9',
    '10b9b6fa-811c-421f-8ca6-31ac93d25d88',
    '6dbd92a4-21b7-43bd-9292-af33e9959ef5',
  ],
  'indie': [
    'abbde752-0560-40dc-858c-75fbc5e5d2b6',
    '64c4cad1-edf4-46c0-b27d-7d4b5ff6c466',
    '5c49bfef-b207-42ac-9a61-762112f1a101',
  ],
  'punk': [
    '394e6756-92c5-4f55-8ec4-f7a83f09b580',
    '6af8ad99-6fdc-413d-9080-c6949dc42ee0',
    '08fb2cd6-82f9-4c8b-95c1-aff31b1eb212',
  ],
  'metal': [
    '279f4e79-00bd-45d2-b602-1638fabf8211',
    'dcfcae83-63a5-4975-8496-7b97e04fc7d4',
    '89a95448-5c1d-4350-9def-714bdeb85b37',
  ],
  'jazz': [
    'd00b4220-bc57-43f8-836d-cae5089da865',
    '31a82512-422d-47ee-9661-655d6d050ce7',
    '270244fb-5b27-4012-a989-2be66b03cb35',
  ],
  'blues': [
    '39e76336-ea40-4a4a-9458-c45c02e6dc3c',
    '9c309daf-4d94-4325-a617-4964737c489f',
    'b92e8d8a-992a-4969-b9a4-f102779044ba',
  ],
  'soul': [
    '147671d9-8dce-4cf4-977a-76747e2403fc',
    '93bbc4cd-1765-42b0-b688-3bdb6f36234a',
    '3cec23f5-d29d-4fd2-a515-b035c88df0a9',
  ],
  'funk': [
    '47b4c888-7c69-43b9-86a4-380f9397fa1c',
    'b06697d0-250a-437a-b076-5bf3b3fd2df0',
    'aa612eba-893a-483a-9235-0639193f8fcb',
  ],
  'classical': [
    '01be3e64-589a-4dcf-b807-4c34ed357d6e',
    '2ec0ddb0-942d-47bd-a9d5-3ae9ec0c218f',
    '4e67936e-4e62-4502-9f55-9ef209060c3d',
  ],
  'orchestral': [
    '3484cbee-8a84-4c78-a64a-38f2f402c9c2',
    '9bd4a5e3-b7b9-44bd-bb44-677304166b48',
    '097b6582-aff3-4c1e-b027-213c9fa2526f',
  ],
  'cinematic': [
    '84085a8a-cff2-4e62-bd5b-9826472e4f92',
    '288e99ea-c174-4b50-8851-8d9b5b4655e1',
    '4ed4cf4d-6a02-457b-adb2-5718501abc9c',
  ],
  'country': [
    '2fba956d-acf6-46e4-85b8-199b09457f60',
    '2f654e24-9234-41f5-ad36-32ee1ee531cd',
    '04613af8-ef05-435e-a029-16cd49b61195',
  ],
  'folk': [
    '56dcabf6-d863-4196-af8d-dec64005ba59',
    '9e17a9e2-92c1-4cbe-922b-ccfc4e287c7a',
    '1b04f3f2-a6e4-43c1-a1f7-6ee6c612ec3a',
  ],
  'acoustic': [
    'eb6a7b3e-e096-4d8b-a4da-b76ee97c2cd3',
    'a0745ff4-44ad-4931-879d-398527047196',
    'c9c7d69a-5321-43ff-9f96-9f2df2e00ffc',
  ],
  'latin': [
    '70e5649c-af1b-4ad8-b2a5-d5c7bdfb9a35',
    'c5f621e3-a198-407a-93a2-cf4a69c23db2',
    '9dd51f61-11dc-40f8-b082-397bb1d63786',
  ],
  'reggaeton': [
    '6c892b5e-47ba-4e34-b7f1-70d106099608',
    '20c7291d-3b78-44d2-a874-72e1bcab691d',
    'b6828045-623e-4b3d-bae4-0b43200d68d7',
  ],
  'kpop': [
    'f2614c35-ce09-458d-b647-4ff84ed37ac5',
    'f55faf65-d32d-45d1-bc02-57711dbcba82',
    '5aba5129-27c4-4220-a8cd-0a440b01aa9b',
  ],
  'jpop': [
    '92cb584b-7a19-4c77-83cf-bd22c85f2c41',
    '899eca98-ce7a-4e5f-9a45-39ceafa9ae1a',
    'cba96fc1-204a-4da8-8830-965fc8a081c0',
  ],
  'reggae': [
    '8ebafbb4-6274-400f-83db-62ad1c98c9ad',
    'a9e15e55-e418-4937-af41-4333bd1be5c7',
    '553196cc-7be1-4834-ba8d-39f2c24f4f21',
  ],
  'lofi': [
    'f4e20940-11a6-4a5c-b992-71961cd53c23',
    'b29d4705-e86d-4062-b1fa-5472094c9350',
    '3619c929-e7ee-4f88-b62e-9300e545d47d',
  ],
  'ambient': [
    'c54f6f53-f8ee-4222-8fa0-98a7eb01f6ff',
    '54169f29-44da-4515-912a-38c3e7c428ec',
    '4599e89f-77df-48b9-8386-c4597ccb60a1',
  ],
  'chillout': [
    '06142aaf-4c01-4af4-a318-945bfaf91a36',
    '6a55157d-71b5-4052-8beb-229e6399ec57',
    'dd493e6b-a5ac-497c-8952-28161a270e71',
  ],
  'gospel': [
    '5de7af18-791c-4a7e-8c81-7b317dc25a6c',
    'bf3942b0-600d-45a9-ab9e-f7bcd3b7b33e',
    '3ad00d73-60e9-46d7-b056-91c8f82038af',
  ],
};

const moodSongIds: Record<string, string[]> = {
  'happy': [
    '7f4f3eb5-596a-4d46-b33c-dd4697a74a83',
    '5beb25e2-4c15-48cc-9a89-79fb8dd04402',
    'd89b3510-bbdc-4a0c-9139-293bd950b78d',
  ],
  'sad': [
    '837fc2d9-cf58-45ff-a9d0-e07f87ff3283',
    '83f79863-e9b5-4232-a0ee-3f74b208e485',
    '45655657-4b0b-4345-b2a3-096fbdbb325c',
  ],
  'energetic': [
    '1a8457ce-7e62-487a-9a40-0c21a16946c6',
    '4b366df5-654b-4b2e-99e7-d032168b66a3',
    '9a3848b9-42fd-4eb5-8a0f-c3afff95833e',
  ],
  'romantic': [
    '5f435834-05ba-4cdb-8a2a-d18a2cd62516',
    '9bdfd8d2-e81e-46ea-b96f-cfd5678a5c12',
    'ff603ac3-6c99-47bd-ad02-217a8acd5132',
  ],
  'chill': [
    'e4311b6b-e5b6-4a45-8683-9abb166ac987',
    'e07563ca-8240-4a84-868b-f6fe2c93b170',
    '260edba5-d9d2-4ebe-a041-125342cf13f7',
  ],
  'epic': [
    '873ba9a5-b04b-4e2d-826c-4480c660d6bd',
    'bec5e3c4-45e5-419b-b304-6550a34996fd',
    '59e116e0-b584-4fd6-a1d6-95a56149ff8f',
  ],
  'dreamy': [
    'a674a1db-f278-4bf2-b243-03c52f925a9a',
    'd37169f4-c62d-4a92-b4bc-05efe7eb6822',
    '4e29c826-fba9-4d73-bf37-8e2f848b844a',
  ],
  'dark': [
    '596c838c-4dc7-418b-9782-6d71fb2bd76b',
    'efcc46e1-d9b4-47e8-a1fd-fb48124ae637',
    'd803f9ca-45d9-4ba5-8c60-ef619804ed8f',
  ],
  'uplifting': [
    '1f46a1d0-8aba-4292-b70d-03f2a16135ff',
    'a62fe964-b721-47e9-95a0-387af2621783',
    '0a2f7170-bcfc-4dfd-99ff-9d59fca45234',
  ],
  'nostalgic': [
    '225cffc1-7630-4409-83a3-e126c6111d87',
    '14c25030-c245-4700-9833-9fcb943a3649',
    'e0646d71-e6dc-4cf4-9330-c0608fd81795',
  ],
  'peaceful': [
    '84c6a79e-058e-4962-a46a-f242c32ae475',
    '48b7b427-8027-498c-bc4c-31bb8f8db128',
    '3d211cf3-3978-4e83-9a5e-4a430761d26d',
  ],
  'intense': [
    '2b64c7a5-2cf6-4d38-8176-9892dbac5e14',
    '6c65a6d5-3af9-4822-b5dd-1d5acc5e5488',
    'ddd8a5ab-fe8b-4a3b-9ccb-44176de7291d',
  ],
  'melancholic': [
    '50c472d1-fa58-44e5-8498-f0747143f1c5',
    '5029fa45-e83c-4cea-adaf-4384e56da016',
    '4ee19d88-aa4e-4afb-a521-43432ecd3238',
  ],
  'playful': [
    'b7c4fc6d-31b0-4cb2-8143-7f4ccc80e959',
    'de03bede-6f6b-4637-8b42-30a6b389e0a8',
    '86a564cc-4111-4841-9b4d-f992971280b5',
  ],
  'mysterious': [
    '335a246a-ae01-4226-b2e2-45b05d9f9b36',
    '457efe01-0fa2-4522-af10-dfbafd935b3d',
    '6912cf23-bd04-47b1-bcf6-e268181c0412',
  ],
  'triumphant': [
    'fb24a715-5fad-4390-81fd-38d626652b06',
    'f9f05234-2774-4670-bde4-4b18c37e54bc',
    'ff010436-732f-43bf-97d9-d62ddcf51a92',
  ],
  'promotional': [
    '7d37576a-53d2-4f24-bb14-58875a1000ef',
    '5c1382e3-4a20-418a-b315-06d5ffc124a9',
    '4fddf01d-da46-4f73-baaa-c1918f0813b1',
  ],
};

interface SongMetadata {
  songId: string;
  songTitle: string;
  actualDuration?: number;
  status: string;
  audioUrl?: string;
}

// Helper to format duration from seconds to mm:ss
const formatDuration = (seconds?: number): string => {
  if (!seconds) return '3:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AdminFetchSongMetadataPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [genreOutput, setGenreOutput] = useState<string>('');
  const [moodOutput, setMoodOutput] = useState<string>('');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const fetchAllMetadata = async () => {
    if (!user?.userId) {
      setNotification({ open: true, message: 'Please log in first', severity: 'error' });
      return;
    }

    setIsLoading(true);
    
    try {
      // Collect all song IDs
      const allGenreSongIds = Object.values(genreSongIds).flat();
      const allMoodSongIds = Object.values(moodSongIds).flat();
      const allSongIds = Array.from(new Set([...allGenreSongIds, ...allMoodSongIds])); // Dedupe
      
      console.log(`Fetching ${allSongIds.length} songs via batch endpoint...`);
      
      // Batch requests in chunks of 100 (API limit)
      const BATCH_SIZE = 100;
      const allSongs: SongMetadata[] = [];
      
      for (let i = 0; i < allSongIds.length; i += BATCH_SIZE) {
        const chunk = allSongIds.slice(i, i + BATCH_SIZE);
        console.log(`Fetching batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} songs`);
        const response = await songsApi.getSongsByIds(user.userId, chunk);
        const songs: SongMetadata[] = response.data?.songs || [];
        allSongs.push(...songs);
      }
      
      const songs = allSongs;
      
      console.log(`Batch endpoint returned ${songs.length} songs`);
      
      // Create a map for quick lookup
      const songMap = new Map<string, SongMetadata>(songs.map(s => [s.songId, s]));
      
      console.log(`Fetched ${songs.length} songs from backend`);
      console.log('Song map:', Object.fromEntries(songMap));
      
      // Generate genre output
      let genreCode = `// GENRE SAMPLE TRACKS - Copy this to GenreDetailPage.tsx\n`;
      genreCode += `const genreSampleTracks: Record<string, Array<{id: string; title: string; duration: string; plays: string}>> = {\n`;
      
      for (const [genreId, songIds] of Object.entries(genreSongIds)) {
        genreCode += `  '${genreId}': [\n`;
        songIds.forEach((id) => {
          const song = songMap.get(id);
          if (song) {
            const title = song.songTitle || 'Unknown';
            const duration = formatDuration(song.actualDuration);
            genreCode += `    { id: '${id}', title: '${title.replace(/'/g, "\\'")}', duration: '${duration}', plays: '0' },\n`;
          } else {
            genreCode += `    { id: '${id}', title: 'NOT FOUND', duration: '0:00', plays: '0' },\n`;
          }
        });
        genreCode += `  ],\n`;
      }
      genreCode += `};\n`;
      
      setGenreOutput(genreCode);
      console.log('\n=== GENRE SAMPLE TRACKS ===\n');
      console.log(genreCode);
      
      // Generate mood output
      let moodCode = `// MOOD SAMPLE TRACKS - Copy this to MoodDetailPage.tsx\n`;
      moodCode += `const moodSampleTracks: Record<string, Array<{id: string; title: string; duration: string; plays: string}>> = {\n`;
      
      for (const [moodId, songIds] of Object.entries(moodSongIds)) {
        moodCode += `  '${moodId}': [\n`;
        songIds.forEach((id) => {
          const song = songMap.get(id);
          if (song) {
            const title = song.songTitle || 'Unknown';
            const duration = formatDuration(song.actualDuration);
            moodCode += `    { id: '${id}', title: '${title.replace(/'/g, "\\'")}', duration: '${duration}', plays: '0' },\n`;
          } else {
            moodCode += `    { id: '${id}', title: 'NOT FOUND', duration: '0:00', plays: '0' },\n`;
          }
        });
        moodCode += `  ],\n`;
      }
      moodCode += `};\n`;
      
      setMoodOutput(moodCode);
      console.log('\n=== MOOD SAMPLE TRACKS ===\n');
      console.log(moodCode);
      
      setNotification({ open: true, message: 'Metadata fetched! Check console and copy buttons below.', severity: 'success' });
      
    } catch (error) {
      console.error('Error fetching songs:', error);
      setNotification({ open: true, message: 'Failed to fetch songs', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setNotification({ open: true, message: `${label} copied to clipboard!`, severity: 'success' });
  };

  if (!user?.userId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          You must be logged in to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f7', py: 4 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              🎵 Fetch Song Metadata
            </Typography>
            <Typography color="text.secondary">
              Fetch metadata for all generated songs and output code for GenreDetailPage and MoodDetailPage.
            </Typography>
          </Box>

          {/* Fetch Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            onClick={fetchAllMetadata}
            disabled={isLoading}
            sx={{
              background: '#007AFF',
              borderRadius: '16px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              mb: 4,
            }}
          >
            {isLoading ? 'Fetching...' : 'Fetch All Song Metadata'}
          </Button>

          {/* Genre Output */}
          {genreOutput && (
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', background: '#f8f9fa' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Genre Sample Tracks (GenreDetailPage.tsx)
                </Typography>
                <Button
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(genreOutput, 'Genre code')}
                  sx={{ textTransform: 'none' }}
                >
                  Copy
                </Button>
              </Box>
              <Box
                component="pre"
                sx={{
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  p: 2,
                  borderRadius: '8px',
                  overflow: 'auto',
                  maxHeight: 400,
                  fontSize: '12px',
                  fontFamily: 'Monaco, Consolas, monospace',
                }}
              >
                {genreOutput}
              </Box>
            </Paper>
          )}

          {/* Mood Output */}
          {moodOutput && (
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', background: '#f8f9fa' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Mood Sample Tracks (MoodDetailPage.tsx)
                </Typography>
                <Button
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(moodOutput, 'Mood code')}
                  sx={{ textTransform: 'none' }}
                >
                  Copy
                </Button>
              </Box>
              <Box
                component="pre"
                sx={{
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  p: 2,
                  borderRadius: '8px',
                  overflow: 'auto',
                  maxHeight: 400,
                  fontSize: '12px',
                  fontFamily: 'Monaco, Consolas, monospace',
                }}
              >
                {moodOutput}
              </Box>
            </Paper>
          )}

          {/* Instructions */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: '16px', 
              background: 'rgba(0,122,255,0.05)',
              border: '1px solid rgba(0,122,255,0.1)'
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              📋 Instructions
            </Typography>
            <Typography component="ol" sx={{ pl: 2 }}>
              <li>Click "Fetch All Song Metadata" to get all song info from the database</li>
              <li>The code will appear in boxes above with copy buttons</li>
              <li>Copy the Genre code and replace the <code>genreSampleTracks</code> object in <code>GenreDetailPage.tsx</code></li>
              <li>Copy the Mood code and replace the <code>moodSampleTracks</code> object in <code>MoodDetailPage.tsx</code></li>
              <li>Note: The type for <code>id</code> needs to change from <code>number</code> to <code>string</code></li>
            </Typography>
          </Paper>
        </Paper>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={notification.severity} onClose={() => setNotification(prev => ({ ...prev, open: false }))}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminFetchSongMetadataPage;

