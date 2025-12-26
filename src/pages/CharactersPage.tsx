import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../utils/axiosConfig';

interface Character {
  characterId: string;
  characterName: string;
  gender?: string;
  age?: string;
  description?: string;
  imageUrls?: string[];
  imageKeys?: string[];
  createdAt: string;
}

const CharactersPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCharacters = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      setIsLoading(true);
      const response = await api.get(`/api/gruvi/characters/${user.userId}`);
      setCharacters(response.data.characters || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setCharacters([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '100vh',
      pt: 4,
      pb: { xs: 4, sm: 8 },
      px: 0
    }}>
      <Container maxWidth="md" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        p: 0
      }}>
        {/* Back Button */}
        <Box sx={{ width: '100%', mb: 2, px: { xs: 2, sm: 0 } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/settings')}
            sx={{
              color: '#007AFF',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(0,122,255,0.08)',
              },
            }}
          >
            Back to Settings
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: { xs: 2, sm: 3 },
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#007AFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                Your Characters
              </Typography>
              <Chip 
                label={`${characters.length} character${characters.length !== 1 ? 's' : ''}`}
                size="small" 
                sx={{ 
                  ml: 1,
                  backgroundColor: 'rgba(0,122,255,0.1)',
                  color: '#007AFF',
                  fontWeight: 500
                }} 
              />
            </Box>
            {isMobile ? (
              <Tooltip title="Create New Character" arrow>
                <IconButton
                  onClick={() => navigate('/characters/create')}
                  sx={{
                    background: '#007AFF',
                    color: '#fff',
                    width: 32,
                    height: 32,
                    boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                    '&:hover': {
                      background: '#0066CC',
                    },
                  }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/characters/create')}
                sx={{
                  background: '#007AFF',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
                  '&:hover': {
                    background: '#0066CC',
                  },
                }}
              >
                Create New
              </Button>
            )}
          </Box>

          {isLoading ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <CircularProgress sx={{ color: '#007AFF' }} />
            </Box>
          ) : characters.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 64, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No characters yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Create characters to include in your song lyrics and music videos
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/characters/create')}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                }}
              >
                Create Character
              </Button>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              {characters.map((character) => (
                <Box
                  key={character.characterId}
                  onClick={() => navigate(`/characters/edit/${character.characterId}`)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0,122,255,0.05)',
                      borderColor: '#007AFF',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,122,255,0.15)',
                    },
                  }}
                >
                  <Avatar
                    src={character.imageUrls?.[0]}
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: '#E5E5EA',
                    }}
                  >
                    <PersonIcon sx={{ color: '#8E8E93' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                      {character.characterName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%'
                    }}>
                      {character.description || `${character.gender || ''} ${character.age ? `• ${character.age}` : ''}`}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CharactersPage;

