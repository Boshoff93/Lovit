import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Button,
  LinearProgress,
  Chip,
  CircularProgress,
  Skeleton
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ImageIcon from '@mui/icons-material/Image';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useLayout } from './Layout';
import { fetchModels, updateModel, Model } from '../store/modelsSlice';
import { 
  fetchGeneratedImages, 
  selectImageGroups,
  selectGeneratingImages,
  selectGalleryLoading,
  removeGeneratingImage,
  addGeneratedImages,
  clearGeneratingImages,
  GeneratedImage,
  ImageGroup as GalleryImageGroup
} from '../store/gallerySlice';
import { AppDispatch } from '../store/store';
import { useLocation } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 0 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface ImageGroup {
  date: string;
  formattedDate: string;
  images: {
    id: string;
    url: string;
    title: string;
    createdAt: string;
  }[];
}

// Mock data
const mockModels: Model[] = [
  {
    id: 'model_1',
    name: 'Summer Casual',
    gender: 'Female',
    bodyType: 'Athletic',
    createdAt: '2024-04-20T14:22:18Z',
    status: 'completed',
    progress: 100,
    ethnicity: 'Asian',
    hairColor: 'Black',
    hairStyle: 'Long',
    eyeColor: 'Brown',
    height: 'Average (~170cm/5\'7")',
    age: 24,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80'
  },
  {
    id: 'model_2',
    name: 'Business Professional',
    gender: 'Male',
    bodyType: 'Average',
    createdAt: '2024-04-19T09:15:00Z',
    status: 'IN_PROGRESS',
    progress: 67,
    ethnicity: 'Caucasian',
    hairColor: 'Brown',
    hairStyle: 'Short',
    eyeColor: 'Blue',
    height: 'Tall (~180cm/5\'11")',
    age: 32,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
  },
  {
    id: 'model_3',
    name: 'Evening Elegance',
    gender: 'Female',
    bodyType: 'Slim',
    createdAt: '2024-04-18T18:30:00Z',
    status: 'WAITING',
    progress: 0,
    ethnicity: 'Hispanic/Latino',
    hairColor: 'Brown',
    hairStyle: 'Wavy',
    eyeColor: 'Brown',
    height: 'Short (~160cm/5\'3")',
    age: 28,
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
  },
  {
    id: 'model_4',
    name: 'Urban Streetwear',
    gender: 'Non-binary',
    bodyType: 'Athletic',
    createdAt: '2024-04-17T11:45:00Z',
    status: 'FAILED',
    progress: 45,
    ethnicity: 'Mixed',
    hairColor: 'Black',
    hairStyle: 'Medium',
    eyeColor: 'Hazel',
    height: 'Average (~170cm/5\'7")',
    age: 26,
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80'
  },
  {
    id: 'model_5',
    name: 'Bohemian Style',
    gender: 'Female',
    bodyType: 'Curvy',
    createdAt: '2024-04-16T16:20:00Z',
    status: 'completed',
    progress: 100,
    ethnicity: 'Black',
    hairColor: 'Black',
    hairStyle: 'Curly',
    eyeColor: 'Brown',
    height: 'Average (~170cm/5\'7")',
    age: 29,
    imageUrl: 'https://images.unsplash.com/photo-1539701938214-0d9736e1c16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=691&q=80'
  },
  {
    id: 'model_6',
    name: 'Sporty Casual',
    gender: 'Male',
    bodyType: 'Athletic',
    createdAt: '2024-04-15T13:40:00Z',
    status: 'completed',
    progress: 100,
    ethnicity: 'East Asian',
    hairColor: 'Black',
    hairStyle: 'Medium',
    eyeColor: 'Brown',
    height: 'Average (~175cm/5\'9")',
    age: 25,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
  }
];

// Helper function to get fallback image based on model ID hash
const getFallbackImage = (modelId: string): string => {
  // Simple hash function
  const hash = modelId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Use modulo 3 to get a number between 0-2
  const imageIndex = hash % 3;
  return `/dress${imageIndex + 1}.jpg`;
};

// Mock image data grouped by date
const mockImageGroups: ImageGroup[] = [
  {
    date: '2024-04-21',
    formattedDate: 'Sun, 21st April, 2024',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=720&q=80',
        title: 'Elegant Formal Outfit',
        createdAt: '2024-04-21T15:30:00Z'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
        title: 'Luxury Evening Wear',
        createdAt: '2024-04-21T14:20:00Z'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=672&q=80',
        title: 'Bright Summer Collection',
        createdAt: '2024-04-21T12:10:00Z'
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=673&q=80',
        title: 'City Street Fashion',
        createdAt: '2024-04-21T10:15:00Z'
      }
    ]
  },
  {
    date: '2024-04-20',
    formattedDate: 'Sat, 20th April, 2024',
    images: [
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80',
        title: 'Professional Business Look',
        createdAt: '2024-04-20T19:45:00Z'
      },
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80',
        title: 'Evening Gown Collection',
        createdAt: '2024-04-20T18:30:00Z'
      },
      {
        id: '7',
        url: 'https://images.unsplash.com/photo-1632149877166-f75d49000351?ixlib=rb-4.0.3&auto=format&fit=crop&w=664&q=80',
        title: 'Urban Fashion Style',
        createdAt: '2024-04-20T16:40:00Z'
      }
    ]
  },
  {
    date: '2024-04-19',
    formattedDate: 'Fri, 19th April, 2024',
    images: [
      {
        id: '8',
        url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80',
        title: 'Casual Summer Outfit',
        createdAt: '2024-04-19T16:20:00Z'
      },
      {
        id: '9',
        url: 'https://images.unsplash.com/photo-1576185850227-1f72b7f8d483?ixlib=rb-4.0.3&auto=format&fit=crop&w=725&q=80',
        title: 'Winter Collection',
        createdAt: '2024-04-19T14:10:00Z'
      }
    ]
  }
];

// Add a new interface for generating images
interface GeneratingImage {
  id: string;
  modelId: string;
  prompt: string;
  timestamp: number;
  numberOfImages: number;
}

// Add interface to handle WebSocket image generation updates
interface ImageGenerationUpdate {
  type: string;
  status: string;
  generationId: string;
  modelId: string;
  images?: GeneratedImage[];
}

const MainTabs: React.FC = () => {
  // Set default tab to Gallery (index 0)
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  // State to toggle mock data display
  const [useMockData, setUseMockData] = useState(false);
  const hasFetchedRef = useRef(false);
  const hasLoadedImagesRef = useRef(false);
  const location = useLocation();
  
  // Get auth token from Redux store
  const { token, user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;
  
  // Get models from Redux store
  const dispatch = useDispatch<AppDispatch>();
  const models = useSelector((state: RootState) => state.models.models);
  const modelsLoading = useSelector((state: RootState) => state.models.isLoading);
  
  // Get gallery data from Redux store
  const imageGroups = useSelector(selectImageGroups);
  const generatingImages = useSelector(selectGeneratingImages);
  const isLoadingImages = useSelector(selectGalleryLoading);
  
  // Get training updates from WebSocket context
  const { lastMessage, trainingUpdates, connect, imageGenerationUpdates, lastImageUpdate } = useWebSocket();
  
  // Get openModel function from Layout context
  const { openModel, openImages } = useLayout();

  // Check for tab parameter in URL and set active tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam === 'models') {
      setValue(1); // Set to Models tab
    } else if (tabParam === 'gallery') {
      setValue(0); // Set to Gallery tab
    }
    
    // Listen for custom tab change events
    const handleTabChange = (e: CustomEvent) => {
      if (e.detail && e.detail.tab === 'models') {
        setValue(1); // Set to Models tab
      } else if (e.detail && e.detail.tab === 'gallery') {
        setValue(0); // Set to Gallery tab
      }
    };
    
    // Add event listener for custom tab change events
    window.addEventListener('tabChange', handleTabChange as EventListener);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('tabChange', handleTabChange as EventListener);
    };
  }, [location.search]);

  // Fetch models on component mount
  useEffect(() => {
    const fetchModelsData = async () => {
      if (hasFetchedRef.current || !userId || !token) return;
      
      try {
        setLoading(true);
        await dispatch(fetchModels());
        
        // Connect to WebSocket for in-progress models
        models.forEach((model: Model) => {
          if ((model.status === 'IN_PROGRESS' || model.status === 'WAITING') && model.id) {
            connect(model.id);
          }
        });
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
        hasFetchedRef.current = true;
      }
    };
    
    fetchModelsData();
  }, [token, connect, userId, dispatch, models]);

  // Fetch images when gallery tab is active
  useEffect(() => {
    const fetchImagesData = async () => {
      if (hasLoadedImagesRef.current || !userId || !token) return;
      
      try {
        if (value === 0) { // Gallery tab is active
          const result = await dispatch(fetchGeneratedImages());
          hasLoadedImagesRef.current = true;
          
          // If images array is empty, make sure to clear any leftover generating images
          if (result.payload && Array.isArray(result.payload) && result.payload.length === 0) {
            // Clear any stale generating images that might be showing
            dispatch(clearGeneratingImages());
          }
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        // Clear generating images on error as well
        dispatch(clearGeneratingImages());
      }
    };
    
    fetchImagesData();
    
    // Reset hasLoadedImagesRef when component unmounts
    return () => {
      hasLoadedImagesRef.current = false;
    };
  }, [value, token, userId, dispatch]);

  // Listen for image generation updates from WebSocket
  useEffect(() => {
    if (lastImageUpdate && lastImageUpdate.type === 'image_generation_update') {
      // Process the update based on status
      if (lastImageUpdate.status === 'completed' && lastImageUpdate.images && lastImageUpdate.images.length > 0) {
        // Add the new images to the store
        dispatch(addGeneratedImages(lastImageUpdate.images));
        
        // Remove from generating images
        dispatch(removeGeneratingImage(lastImageUpdate.generationId));
        
        // Show notification - possibly implement this
      } else if (lastImageUpdate.status === 'failed') {
        // Remove from generating images
        dispatch(removeGeneratingImage(lastImageUpdate.generationId));
        
        // Show error notification - possibly implement this
      }
    }
  }, [lastImageUpdate, dispatch]);

  // Update models when training updates are received
  useEffect(() => {
    if (Object.keys(trainingUpdates).length > 0) {
      Object.entries(trainingUpdates).forEach(([modelId, updates]) => {
        if (updates && updates.length > 0) {
          // Get the latest update
          const latestUpdate = updates[updates.length - 1];
          dispatch(updateModel({
            modelId,
            status: latestUpdate.status,
            progress: latestUpdate.progress
          }));
        }
      });
    }
  }, [trainingUpdates, dispatch]);

  const handleChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    const url = new URL(window.location.href);
    setValue(newValue);
    if(newValue === 1) {
      url.searchParams.set('tab', 'models');
      window.history.replaceState({}, '', url);

      window.dispatchEvent(new CustomEvent('tabChange', { detail: { tab: 'models' } }));
    } else {
      url.searchParams.set('tab', 'gallery');
      window.history.replaceState({}, '', url);
      window.dispatchEvent(new CustomEvent('tabChange', { detail: { tab: 'gallery' } }));
    }

  }, []);

  // Helper function to render status chip based on training status
  const renderStatusChip = useCallback((status?: string) => {
    if (!status) return null;
    
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    let label = status;
    
    switch (status) {
      case 'WAITING':
        color = 'secondary';
        label = 'Queued';
        break;
      case 'IN_PROGRESS':
        color = 'primary';
        label = 'Training';
        break;
      case 'completed':
        color = 'success';
        label = 'Ready';
        break;
      case 'FAILED':
      case 'failed':
        color = 'error';
        label = 'Failed';
        break;
      default:
        color = 'default';
    }
    
    return (
      <Chip 
        label={label} 
        color={color} 
        size="small" 
        sx={{ mt: 1 }}
      />
    );
  }, []);

  // Function to handle create image button
  const handleCreateImageClick = useCallback(() => {
    // Use the context function to open the images tab
    openImages();
  }, [openImages]);

  return (
    <Box sx={{ width: '100%'}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Main navigation tabs"
          sx={{ 
            '& .MuiTab-root': { 
              fontWeight: 600,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              py: { xs: 1.5, sm: 2 },
              minWidth: { xs: '50%', sm: 'auto' }
            },
            '& .MuiTabs-flexContainer': {
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }
          }}
        >

          <Tab icon={<PhotoLibraryIcon />} label="Gallery" iconPosition="start" />
          <Tab icon={<FaceIcon />} label="Models" iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Models Tab */}
      <TabPanel value={value} index={1}>
        <Typography variant="h5" gutterBottom>
          Your Models
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {modelsLoading || loading && !useMockData ? (
            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : models.length === 0 && !useMockData ? (
            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                You haven't created any models yet.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={openModel}
              >
                Create Your First Model
              </Button>
            </Box>
          ) : useMockData ? (
            // Show mock models
            mockModels.map((model) => (
              <Box 
                key={model.id} 
                sx={{ 
                  flex: { 
                    xs: '1 1 100%', 
                    sm: '1 1 calc(50% - 8px)', 
                    md: '1 1 calc(50% - 10px)', 
                    lg: '1 1 calc(33% - 10px)' 
                  } 
                }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative', height: 320, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${model.imageUrl ?? getFallbackImage(model.id)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(15px)',
                        transform: 'scale(1.1)', // Slightly scale up to avoid blur edges
                        opacity: 0.9,
                      }}
                    />
                    <CardMedia
                      component="img"
                      height="320"
                      image={model.imageUrl ?? getFallbackImage(model.id)}
                      alt={model.name}
                      sx={{ 
                        objectFit: 'contain',
                        position: 'relative',
                        zIndex: 1,
                        height: '100%',
                        width: 'auto',
                        maxWidth: '100%',
                        margin: '0 auto',
                        display: 'block',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {model.name}
                      </Typography>
                      {renderStatusChip(model.status)}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {model.gender} • {model.bodyType}
                    </Typography>
                    
                    {/* Show progress bar for in-progress models */}
                    {model.status === 'IN_PROGRESS' && model.progress && (
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={model.progress} 
                          sx={{ height: 6, borderRadius: 3 }} 
                        />
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                          {model.progress}% Complete
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                      Created on {new Date(model.createdAt ?? '').toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            // Show API models
            models.map((model) => (
              <Box 
                key={model.id} 
                sx={{ 
                   flex: { 
                      xs: '1 1 100%', 
                      sm: '1 1 calc(50% - 8px)', 
                      md: '1 1 calc(50% - 10px)', 
                      lg: '1 1 calc(33% - 10px)' 
                    } 
                }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative', height: 320, overflow: 'hidden' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${model.imageUrl ?? getFallbackImage(model.id)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(15px)',
                        transform: 'scale(1.1)', // Slightly scale up to avoid blur edges
                        opacity: 0.9,
                      }}
                    />
                    <CardMedia
                      component="img"
                      height="320"
                      image={model.imageUrl ?? getFallbackImage(model.id)}
                      alt={model.name}
                      sx={{ 
                        objectFit: 'contain',
                        position: 'relative',
                        zIndex: 1,
                        height: '100%',
                        width: 'auto',
                        maxWidth: '100%',
                        margin: '0 auto',
                        display: 'block',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {model.name}
                      </Typography>
                      {renderStatusChip(model.status)}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {model.gender} • {model.bodyType}
                    </Typography>
                    
                    {/* Show progress bar for in-progress models */}
                    {model.status === 'IN_PROGRESS' && model.progress && (
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={model.progress} 
                          sx={{ height: 6, borderRadius: 3 }} 
                        />
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                          {model.progress}% Complete
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                      Created on {new Date(model.createdAt ?? '').toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          )}
        </Box>
      </TabPanel>
      
      {/* Gallery Tab */}
      <TabPanel value={value} index={0}>
        <Typography variant="h5" gutterBottom>
          Your Gallery
        </Typography>
        
        {isLoadingImages && !useMockData ? (
          // Loading state
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {[1, 2, 3, 4].map(skeleton => (
              <Box 
                key={`skeleton-${skeleton}`}
                sx={{ 
                    flex: { 
                      xs: '1 1 100%', 
                      sm: '1 1 calc(50% - 8px)', 
                      md: '1 1 calc(50% - 10px)', 
                      lg: '1 1 calc(33% - 10px)' 
                    } 
                }}
              >
                <Skeleton variant="rectangular" height={320} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
              </Box>
            ))}
          </Box>
        ) : generatingImages.length > 0 && !useMockData ? (
          // Show generating images
          <Box sx={{ mb: 4 }}>
            <Paper 
              sx={{ 
                p: 2, 
                mb: 2, 
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'background.default',
                borderRadius: '12px 12px 0 0',
                boxShadow: 'none',
                borderBottom: 1,
                borderColor: 'divider'
              }}
            >
              <Typography variant="h6" component="div">
                Currently Generating
              </Typography>
            </Paper>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {generatingImages.map((genImage) => (
                <Box 
                  key={genImage.id} 
                  sx={{ 
                      flex: { 
                        xs: '1 1 100%', 
                        sm: '1 1 calc(50% - 8px)', 
                        md: '1 1 calc(50% - 10px)', 
                        lg: '1 1 calc(33% - 10px)' 
                      } 
                  }}
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box 
                      sx={{ 
                        height: 320, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexDirection: 'column',
                        bgcolor: 'action.hover',
                        p: 2
                      }}
                    >
                      <CircularProgress sx={{ mb: 2 }} />
                      <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                        Generating Image
                      </Typography>
                    </Box>
                    <CardContent sx={{ py: 1.5 }}>
                      <Typography variant="subtitle1">In Progress</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Started {new Date(genImage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        ) : useMockData ? (
          // Show mock image data
          mockImageGroups.map((group) => (
            <Box key={group.date} sx={{ mb: 4 }}>
              <Paper 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.default',
                  borderRadius: '12px 12px 0 0',
                  boxShadow: 'none',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" component="div">
                  {group.formattedDate}
                </Typography>
              </Paper>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {group.images.map((image) => (
                  <Box 
                    key={image.id} 
                    sx={{ 
                      flex: { 
                        xs: '1 1 100%', 
                        sm: '1 1 calc(50% - 8px)', 
                        md: '1 1 calc(50% - 10px)', 
                        lg: '1 1 calc(33% - 10px)' 
                      } 
                    }}
                  >
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ position: 'relative', height: 320, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${image.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(18px)',
                            transform: 'scale(1.1)', // Slightly scale up to avoid blur edges
                            opacity: 0.9,
                          }}
                        />
                        <CardMedia
                          component="img"
                          height={320}
                          image={image.url}
                          alt={image.title}
                          sx={{ 
                            objectFit: 'contain',
                            position: 'relative',
                            zIndex: 1,
                            height: '100%',
                            width: 'auto',
                            maxWidth: '100%',
                            margin: '0 auto',
                            display: 'block',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          }}
                        />
                      </Box>
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle1">
                          {image.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(image.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        ) : imageGroups.length > 0 ? (
          // Show existing images grouped by date
          imageGroups.map((group) => (
            <Box key={group.date} sx={{ mb: 4 }}>
              <Paper 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.default',
                  borderRadius: '12px 12px 0 0',
                  boxShadow: 'none',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" component="div">
                  {group.formattedDate}
                </Typography>
              </Paper>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {group.images.map((image) => (
                  <Box 
                    key={image.id} 
                    sx={{ 
                      flex: { 
                        xs: '1 1 100%', 
                        sm: '1 1 calc(50% - 8px)', 
                        md: '1 1 calc(50% - 10px)', 
                        lg: '1 1 calc(33% - 10px)' 
                      } 
                    }}
                  >
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ position: 'relative', height: 320, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${image.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(15px)',
                            transform: 'scale(1.1)', // Slightly scale up to avoid blur edges
                            opacity: 0.9,
                          }}
                        />
                        <CardMedia
                          component="img"
                          height={320}
                          image={image.url}
                          alt={image.title || image.prompt.substring(0, 30)}
                          sx={{ 
                            objectFit: 'contain',
                            position: 'relative',
                            zIndex: 1,
                            height: '100%',
                            width: 'auto',
                            maxWidth: '100%',
                            margin: '0 auto',
                            display: 'block',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                            borderRadius: '4px',
                            padding: '8px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          }}
                        />
                      </Box>
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="subtitle1">
                          {image.title || image.prompt.substring(0, 30) + (image.prompt.length > 30 ? '...' : '')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(image.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        ) : generatingImages.length === 0 ? (
          // Show empty state when no images and nothing generating
          <Box 
            sx={{ 
              width: '100%', 
              textAlign: 'center', 
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box 
              sx={{ 
                bgcolor: 'action.hover', 
                borderRadius: '50%', 
                width: 80, 
                height: 80, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 3
              }}
            >
              <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h6" color="text.primary">
              No images yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Generate your first image with one of your models
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<AutoFixHighIcon />}
              onClick={handleCreateImageClick}
            >
              Create Your First Image
            </Button>
          </Box>
        ) : null}
      </TabPanel>
    </Box>
  );
};

export default MainTabs;