import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Divider,
  SelectChangeEvent,
  FormControlLabel,
  Checkbox,
  Slider,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface PromptSectionProps {
  onGenerate: (promptData: PromptData) => void;
  isGenerating: boolean;
}

export interface PromptData {
  prompt: string;
  negativePrompt: string;
  orientation: string;
  numberOfImages: number;
  uploadedClothImage?: File | null;
  seedNumber?: string;
  useSeed: boolean;
}

const ORIENTATION_OPTIONS = ['Portrait', 'Landscape', 'Square'];

const PromptSection: React.FC<PromptSectionProps> = ({ onGenerate, isGenerating }) => {
  const [promptData, setPromptData] = useState<PromptData>({
    prompt: '',
    negativePrompt: '',
    orientation: 'Portrait',
    numberOfImages: 4,
    uploadedClothImage: null,
    seedNumber: '',
    useSeed: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clothPreviewUrl, setClothPreviewUrl] = useState<string | null>(null);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPromptData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setPromptData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setPromptData(prev => ({
      ...prev,
      numberOfImages: newValue as number
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setPromptData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setPromptData(prev => ({
        ...prev,
        uploadedClothImage: files[0]
      }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(files[0]);
      setClothPreviewUrl(previewUrl);
    }
  };

  const handleGenerateClick = () => {
    onGenerate(promptData);
  };

  const handleClearCloth = () => {
    setPromptData(prev => ({
      ...prev,
      uploadedClothImage: null
    }));
    setClothPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Generate Images
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Prompt"
          name="prompt"
          value={promptData.prompt}
          onChange={handleTextChange}
          multiline
          rows={2}
          placeholder="model walking through Chinatown in Bangkok sunset golden hour"
          required
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Negative Prompt (Optional)"
          name="negativePrompt"
          value={promptData.negativePrompt}
          onChange={handleTextChange}
          multiline
          rows={2}
          placeholder='Optional negative prompt that describes what you don&apos;t want like "old, ugly, wrinkles, curly hair"'
        />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Image Settings
      </Typography>
      
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Orientation</InputLabel>
          <Select
            name="orientation"
            value={promptData.orientation}
            label="Orientation"
            onChange={handleSelectChange}
          >
            {ORIENTATION_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box>
          <Typography gutterBottom>
            Number of Images: {promptData.numberOfImages}
          </Typography>
          <Slider
            value={promptData.numberOfImages}
            onChange={handleSliderChange}
            step={1}
            marks
            min={1}
            max={10}
            valueLabelDisplay="auto"
          />
        </Box>
        
        <Box>
          <Typography gutterBottom>Clothing Reference (Optional)</Typography>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<CloudUploadIcon />} 
              onClick={handleFileButtonClick}
            >
              Upload Clothing Image
            </Button>
            {clothPreviewUrl && (
              <Button 
                variant="text" 
                color="error" 
                size="small"
                onClick={handleClearCloth}
              >
                Remove
              </Button>
            )}
          </Box>
          
          {clothPreviewUrl && (
            <Box sx={{ mt: 2, maxWidth: 200 }}>
              <img 
                src={clothPreviewUrl} 
                alt="Uploaded clothing" 
                style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '4px' }}
              />
            </Box>
          )}
        </Box>
        
        <Box>
          <FormControlLabel
            control={
              <Checkbox 
                checked={promptData.useSeed} 
                onChange={handleCheckboxChange}
                name="useSeed"
              />
            }
            label="Use seed number for reproducible results"
          />
          
          {promptData.useSeed && (
            <TextField
              fullWidth
              label="Seed Number"
              name="seedNumber"
              value={promptData.seedNumber}
              onChange={handleTextChange}
              placeholder="e.g., 47571"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </Stack>
      
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={handleGenerateClick}
          disabled={isGenerating || !promptData.prompt}
        >
          {isGenerating ? 'Generating...' : `Take ${promptData.numberOfImages} photo${promptData.numberOfImages > 1 ? 's' : ''}`}
        </Button>
      </Box>
    </Paper>
  );
};

export default PromptSection; 