import React, { useState } from 'react';
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
  SelectChangeEvent
} from '@mui/material';
import { UserProfile } from '../types';

interface ModelCreationFormProps {
  onSubmit: (userProfile: UserProfile) => void;
  isLoading: boolean;
}

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other'];
const BODY_TYPE_OPTIONS = ['Slim', 'Athletic', 'Average', 'Curvy', 'Muscular', 'Plus-size'];
const HAIR_COLOR_OPTIONS = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Other'];
const HAIR_STYLE_OPTIONS = ['Short', 'Medium', 'Long', 'Curly', 'Straight', 'Wavy', 'Bald'];
const EYE_COLOR_OPTIONS = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Black'];
const BREAST_SIZE_OPTIONS = ['Small', 'Medium', 'Large'];

const ModelCreationForm: React.FC<ModelCreationFormProps> = ({ onSubmit, isLoading }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    gender: '',
    age: 25,
    height: '',
    ethnicity: '',
    hairColor: '',
    hairStyle: '',
    eyeColor: '',
    bodyType: '',
    breastSize: ''
  });

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numberValue = parseInt(value);
    if (!isNaN(numberValue)) {
      setUserProfile(prev => ({
        ...prev,
        [name]: numberValue
      }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(userProfile);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create Your AI Model
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define your model's characteristics to generate more accurate images
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: '100%' }}>
            <Divider>
              <Typography variant="subtitle1">Basic Information</Typography>
            </Divider>
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <TextField
              fullWidth
              label="Model Name"
              name="name"
              value={userProfile.name}
              onChange={handleTextChange}
              required
              placeholder="Give your model a name"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <FormControl fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={userProfile.gender}
                label="Gender"
                onChange={handleSelectChange}
              >
                {GENDER_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={userProfile.age}
              onChange={handleNumberChange}
              inputProps={{ min: 18, max: 99 }}
              required
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <TextField
              fullWidth
              label="Height"
              name="height"
              value={userProfile.height}
              onChange={handleTextChange}
              placeholder="e.g., 5'9&quot; or 175cm"
              required
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <TextField
              fullWidth
              label="Ethnicity"
              name="ethnicity"
              value={userProfile.ethnicity}
              onChange={handleTextChange}
              placeholder="e.g., Caucasian, Asian, etc."
            />
          </Box>
          
          <Box sx={{ width: '100%' }}>
            <Divider>
              <Typography variant="subtitle1">Physical Characteristics</Typography>
            </Divider>
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <FormControl fullWidth required>
              <InputLabel>Body Type</InputLabel>
              <Select
                name="bodyType"
                value={userProfile.bodyType}
                label="Body Type"
                onChange={handleSelectChange}
              >
                {BODY_TYPE_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <FormControl fullWidth required>
              <InputLabel>Hair Color</InputLabel>
              <Select
                name="hairColor"
                value={userProfile.hairColor}
                label="Hair Color"
                onChange={handleSelectChange}
              >
                {HAIR_COLOR_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <FormControl fullWidth required>
              <InputLabel>Hair Style</InputLabel>
              <Select
                name="hairStyle"
                value={userProfile.hairStyle}
                label="Hair Style"
                onChange={handleSelectChange}
              >
                {HAIR_STYLE_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <FormControl fullWidth required>
              <InputLabel>Eye Color</InputLabel>
              <Select
                name="eyeColor"
                value={userProfile.eyeColor}
                label="Eye Color"
                onChange={handleSelectChange}
              >
                {EYE_COLOR_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {userProfile.gender === 'Female' && (
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <FormControl fullWidth>
                <InputLabel>Breast Size</InputLabel>
                <Select
                  name="breastSize"
                  value={userProfile.breastSize || ''}
                  label="Breast Size"
                  onChange={handleSelectChange}
                >
                  {BREAST_SIZE_OPTIONS.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          
          <Box sx={{ width: '100%', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Creating Model...' : 'Create AI Model'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default ModelCreationForm; 