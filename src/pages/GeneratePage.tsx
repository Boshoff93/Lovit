import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  CircularProgress, 
  TextField,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getModels, generateImage } from '../services/api';
import { TrainingModel, GeneratedImage } from '../types';

// Predefined prompt options
const OUTFIT_OPTIONS = [
  { label: 'Wedding Dress', value: 'wedding dress, white elegant gown, bridal' },
  { label: 'Formal Gown', value: 'formal evening gown, elegant, red carpet' },
  { label: 'Casual Outfit', value: 'casual outfit, jeans and t-shirt, everyday wear' },
  { label: 'Business Attire', value: 'business professional attire, suit, formal office wear' },
  { label: 'Summer Dress', value: 'summer dress, floral pattern, beach outfit' },
  { label: 'Winter Outfit', value: 'winter outfit, coat, scarf, cold weather' },
];

const STYLE_OPTIONS = [
  { label: 'Photorealistic', value: 'photorealistic, detailed, high resolution photo' },
  { label: 'Anime Style', value: 'anime style, cartoon, illustrated' },
  { label: 'Vintage', value: 'vintage, retro, old photograph, film grain' },
  { label: 'Fantasy', value: 'fantasy setting, magical, mystical' },
  { label: 'Artistic', value: 'artistic, painterly style, impressionist' },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({children, value, index}) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const GeneratePage: React.FC = () => {
  const [models, setModels] = useState<TrainingModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedOutfit, setSelectedOutfit] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await getModels();
        if (response.success) {
          const completedModels = response.data.filter(model => model.status === 'completed');
          setModels(completedModels);
          
          if (completedModels.length > 0) {
            setSelectedModel(completedModels[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch models', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    // Build the prompt based on selections
    const outfitPrompt = selectedOutfit ? selectedOutfit : '';
    const stylePrompt = selectedStyle ? `, ${selectedStyle}` : '';
    
    if (outfitPrompt || stylePrompt) {
      setPrompt(`person wearing ${outfitPrompt}${stylePrompt}`);
    } else {
      setPrompt('');
    }
  }, [selectedOutfit, selectedStyle]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOutfitChange = (event: SelectChangeEvent) => {
    setSelectedOutfit(event.target.value);
  };

  const handleStyleChange = (event: SelectChangeEvent) => {
    setSelectedStyle(event.target.value);
  };

  const handleGenerate = async () => {
    if (!selectedModel || !prompt) return;
    
    setIsGenerating(true);
    
    try {
      const response = await generateImage(selectedModel, prompt);
      if (response.success) {
        setGeneratedImages(prev => [response.data, ...prev]);
      }
    } catch (error) {
      console.error('Failed to generate image', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (models.length === 0) {
    return (
      <Box sx={{ py: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No trained models found
          </Typography>
          <Typography variant="body1" paragraph>
            You need to train a model before you can generate images.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/train')}
          >
            Go to Training
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Generate Images
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Create New Images
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Preset Options" />
            <Tab label="Custom Prompt" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
              <FormControl fullWidth>
                <InputLabel>Outfit Type</InputLabel>
                <Select
                  value={selectedOutfit}
                  onChange={handleOutfitChange}
                  label="Outfit Type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {OUTFIT_OPTIONS.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
              <FormControl fullWidth>
                <InputLabel>Style</InputLabel>
                <Select
                  value={selectedStyle}
                  onChange={handleStyleChange}
                  label="Style"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {STYLE_OPTIONS.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <TextField
            fullWidth
            label="Custom Prompt"
            value={prompt}
            onChange={handlePromptChange}
            multiline
            rows={3}
            helperText="Describe the outfit and style you want to generate"
          />
        </TabPanel>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Final Prompt:
          </Typography>
          <Paper 
            variant="outlined" 
            sx={{ p: 2, backgroundColor: '#f5f5f5', mb: 2 }}
          >
            <Typography>
              {prompt || 'Please select options or enter a custom prompt'}
            </Typography>
          </Paper>
          
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : null}
            fullWidth
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </Button>
        </Box>
      </Paper>
      
      {generatedImages.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Images
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {generatedImages.map((image) => (
              <Box 
                key={image.id} 
                sx={{ 
                  flex: { 
                    xs: '1 1 100%', 
                    sm: '1 1 calc(50% - 12px)', 
                    md: '1 1 calc(33.333% - 16px)' 
                  } 
                }}
              >
                <Card>
                  <CardMedia
                    component="img"
                    height={300}
                    image={image.url}
                    alt={image.prompt}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {image.prompt}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {new Date(image.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default GeneratePage; 