import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  CircularProgress, 
  Stepper, 
  Step, 
  StepLabel,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getPhotos, trainModel, getModelStatus } from '../services/api';
import { Photo, TrainingModel } from '../types';

const TrainModelPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingModel, setTrainingModel] = useState<TrainingModel | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await getPhotos();
        if (response.success) {
          setPhotos(response.data);
          // Pre-select all photos by default
          setSelectedPhotos(response.data.map(photo => photo.id));
        }
      } catch (error) {
        console.error('Failed to fetch photos', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (trainingModel && trainingModel.status === 'training') {
      intervalId = setInterval(async () => {
        try {
          const response = await getModelStatus(trainingModel.id);
          if (response.success) {
            setTrainingModel(response.data);
            
            if (response.data.status === 'completed') {
              clearInterval(intervalId);
              setActiveStep(2);
            } else if (response.data.status === 'failed') {
              clearInterval(intervalId);
            }
          }
        } catch (error) {
          console.error('Failed to get model status', error);
        }
      }, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [trainingModel]);

  const handlePhotoToggle = (photoId: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        return prev.filter(id => id !== photoId);
      } else {
        return [...prev, photoId];
      }
    });
  };

  const handleStartTraining = async () => {
    if (selectedPhotos.length < 5) return;
    
    setIsTraining(true);
    
    try {
      const response = await trainModel(selectedPhotos);
      if (response.success) {
        setTrainingModel(response.data);
        setActiveStep(1);
      }
    } catch (error) {
      console.error('Failed to start training', error);
    } finally {
      setIsTraining(false);
    }
  };

  const handleGoToGenerate = () => {
    navigate('/generate');
  };

  const steps = ['Select Photos', 'Train Model', 'Ready to Generate'];

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Train Your Model
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {activeStep === 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Select Photos for Training
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose at least 5 photos to train your AI model. Select your best photos for better results.
          </Typography>
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {photos.map((photo) => (
                  <Box 
                    key={photo.id} 
                    sx={{ 
                      flex: { 
                        xs: '1 1 calc(50% - 8px)', 
                        sm: '1 1 calc(25% - 8px)', 
                        md: '1 1 calc(20% - 8px)' 
                      } 
                    }}
                  >
                    <Card 
                      sx={{ 
                        border: selectedPhotos.includes(photo.id) ? '2px solid #ff4081' : 'none',
                        position: 'relative'
                      }}
                    >
                      <Box
                        component="img"
                        src={photo.url}
                        alt={photo.filename}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                        }}
                      />
                      <FormGroup sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedPhotos.includes(photo.id)}
                              onChange={() => handlePhotoToggle(photo.id)}
                              color="primary"
                            />
                          }
                          label=""
                        />
                      </FormGroup>
                    </Card>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  size="large"
                  onClick={handleStartTraining}
                  disabled={selectedPhotos.length < 5 || isTraining}
                  startIcon={isTraining ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isTraining ? 'Starting Training...' : 'Start Training'}
                </Button>
              </Box>

              {selectedPhotos.length < 5 && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Please select at least 5 photos to continue
                </Typography>
              )}
            </>
          )}
        </Paper>
      )}
      
      {activeStep === 1 && trainingModel && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Training in Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', py: 4 }}>
            <CircularProgress 
              variant={trainingModel.progress ? "determinate" : "indeterminate"} 
              value={trainingModel.progress || 0} 
              size={80} 
              thickness={4} 
              sx={{ mb: 2 }}
            />
            <Typography variant="h5" sx={{ mb: 1 }}>
              {trainingModel.progress ? `${Math.round(trainingModel.progress)}%` : 'Training...'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This may take 15-30 minutes. You can close this page and come back later.
            </Typography>
          </Box>
        </Paper>
      )}
      
      {activeStep === 2 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Training Complete!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Your AI model is ready to generate images
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You can now create images of yourself in different outfits and styles.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={handleGoToGenerate}
            >
              Start Generating Images
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TrainModelPage; 