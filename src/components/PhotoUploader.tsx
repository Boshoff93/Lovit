import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress,
  Typography,
  Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadPhotos } from '../services/api';
import { Photo } from '../types';

interface PhotoUploaderProps {
  onUploadComplete: (photos: Photo[]) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onUploadComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
      
      // Create previews
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const response = await uploadPhotos(files);
      if (response.success) {
        onUploadComplete(response.data);
        // Clear files after successful upload
        setFiles([]);
        setPreviews([]);
      } else {
        setUploadError(response.message || 'Upload failed');
      }
    } catch (error) {
      setUploadError('An error occurred during upload');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Your Photos
      </Typography>
      
      <Box 
        sx={{ 
          border: '2px dashed #ccc', 
          borderRadius: 2, 
          p: 3, 
          textAlign: 'center',
          mb: 2,
          backgroundColor: '#f8f8f8'
        }}
      >
        <input
          accept="image/*"
          type="file"
          id="photo-upload"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="photo-upload">
          <Button 
            component="span" 
            variant="contained" 
            startIcon={<CloudUploadIcon />}
            disabled={isUploading}
          >
            Select Photos
          </Button>
        </label>
        
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Select 5-10 photos of yourself for best results
        </Typography>
      </Box>

      {previews.length > 0 && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Selected Photos ({previews.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {previews.map((preview, index) => (
              <Box 
                key={index}
                sx={{ 
                  flex: { 
                    xs: '1 1 calc(33.333% - 4px)', 
                    sm: '1 1 calc(25% - 4px)', 
                    md: '1 1 calc(16.666% - 4px)' 
                  } 
                }}
              >
                <Box
                  component="img"
                  src={preview}
                  alt={`Preview ${index}`}
                  sx={{
                    width: '100%',
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              </Box>
            ))}
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpload}
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </Button>
          
          {uploadError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {uploadError}
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
};

export default PhotoUploader; 