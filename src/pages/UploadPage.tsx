import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhotoUploader from '../components/PhotoUploader';
import { getPhotos } from '../services/api';
import { Photo } from '../types';

const UploadPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await getPhotos();
        if (response.success) {
          setPhotos(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch photos', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleUploadComplete = (newPhotos: Photo[]) => {
    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
  };

  const handleContinue = () => {
    navigate('/train');
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upload Your Photos
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload 5-10 good quality photos of yourself to get the best results. Try to include various angles and expressions.
      </Typography>

      <PhotoUploader onUploadComplete={handleUploadComplete} />

      {photos.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Photos ({photos.length})
          </Typography>
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
                <Box
                  component="img"
                  src={photo.url}
                  alt={photo.filename}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={handleContinue}
              disabled={photos.length < 5}
            >
              Continue to Training
            </Button>
          </Box>

          {photos.length < 5 && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Please upload at least 5 photos to continue
            </Typography>
          )}
        </Paper>
      )}

      {isLoading && (
        <Typography>Loading your photos...</Typography>
      )}
    </Box>
  );
};

export default UploadPage; 