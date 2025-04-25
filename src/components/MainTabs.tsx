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
    createdAt: '2024-04-18T14:22:18Z',
    status: 'completed',
    progress: 100,
    ethnicity: 'Asian',
    hairColor: 'Black',
    hairStyle: 'Long',
    eyeColor: 'Brown',
    height: 'Average (~170cm/5\'7")',
    age: 24
  },
  {
    id: 'model_2',
    name: 'Professional Look',
    gender: 'Male',
    bodyType: 'Average',
    createdAt: '2024-04-17T09:15:00Z',
    imageUrl: '/dress3.jpg',
    status: 'IN_PROGRESS',
    progress: 67,
    ethnicity: 'Caucasian',
    hairColor: 'Brown',
    hairStyle: 'Short',
    eyeColor: 'Blue',
    height: 'Tall (~180cm/5\'11")',
    age: 32
  },
  {
    id: 'model_3',
    name: 'Evening Style',
    gender: 'Female',
    bodyType: 'Slim',
    createdAt: '2024-04-16T18:30:00Z',
    imageUrl: '/dress2.jpg',
    status: 'WAITING',
    progress: 0,
    ethnicity: 'Hispanic/Latino',
    hairColor: 'Brown',
    hairStyle: 'Wavy',
    eyeColor: 'Brown',
    height: 'Short (~160cm/5\'3")',
    age: 28
  },
  {
    id: 'model_4',
    name: 'Urban Streetwear',
    gender: 'Non-binary',
    bodyType: 'Athletic',
    createdAt: '2024-04-15T11:45:00Z',
    imageUrl: '/dress3.jpg',
    status: 'FAILED',
    progress: 45,
    ethnicity: 'Mixed',
    hairColor: 'Black',
    hairStyle: 'Medium',
    eyeColor: 'Hazel',
    height: 'Average (~170cm/5\'7")',
    age: 26
  },
  {
    id: 'model_5',
    name: 'Boho Chic',
    gender: 'Female',
    bodyType: 'Curvy',
    createdAt: '2024-04-14T16:20:00Z',
    imageUrl: '/dress1.jpg',
    status: 'completed',
    progress: 100,
    ethnicity: 'Black',
    hairColor: 'Black',
    hairStyle: 'Curly',
    eyeColor: 'Brown',
    height: 'Average (~170cm/5\'7")',
    age: 29
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
    date: '2024-04-18',
    formattedDate: 'Thu, 18th April, 2024',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
        title: 'Gold outfit in Chinatown',
        createdAt: '2024-04-18T15:30:00Z'
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
        title: 'White dress in Bangkok',
        createdAt: '2024-04-18T14:20:00Z'
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        title: 'Street style casual',
        createdAt: '2024-04-18T12:10:00Z'
      }
    ]
  },
  {
    date: '2024-04-17',
    formattedDate: 'Wed, 17th April, 2024',
    images: [
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80',
        title: 'Evening gown',
        createdAt: '2024-04-17T19:45:00Z'
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80',
        title: 'Business casual',
        createdAt: '2024-04-17T11:30:00Z'
      }
    ]
  },
  {
    date: '2024-04-16',
    formattedDate: 'Tue, 16th April, 2024',
    images: [
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80',
        title: 'Summer dress',
        createdAt: '2024-04-16T16:20:00Z'
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
  const { lastMessage, trainingUpdates, connect } = useWebSocket();
  
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
          await dispatch(fetchGeneratedImages());
          hasLoadedImagesRef.current = true;
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    
    fetchImagesData();
  }, [value, token, userId, dispatch]);

  // Listen for image generation updates from WebSocket
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'image_generation_update') {
      // Process the update based on status
      const update = lastMessage as unknown as ImageGenerationUpdate;
      
      if (update.status === 'completed' && update.images && update.images.length > 0) {
        // Add the new images to the store
        dispatch(addGeneratedImages(update.images));
        
        // Remove from generating images
        dispatch(removeGeneratingImage(update.generationId));
        
        // Show notification - possibly implement this
      } else if (update.status === 'failed') {
        // Remove from generating images
        dispatch(removeGeneratingImage(update.generationId));
        
        // Show error notification - possibly implement this
      }
    }
  }, [lastMessage, dispatch]);

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
          {modelsLoading || loading ? (
            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : models.length === 0 ? (
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
          ) : (
            models.map((model) => (
              <Box 
                key={model.id} 
                sx={{ 
                  flex: { 
                    xs: '1 1 100%', 
                    sm: '1 1 calc(50% - 16px)', 
                    md: '1 1 calc(33.333% - 16px)' 
                  } 
                }}
              >
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="320"
                    image={model.imageUrl ?? getFallbackImage(model.id)}
                    alt={model.name}
                    sx={{ objectFit: 'cover' }}
                  />
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
        
        {isLoadingImages ? (
          // Loading state
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {[1, 2, 3, 4].map(skeleton => (
              <Box 
                key={`skeleton-${skeleton}`}
                sx={{ 
                  flex: { 
                    xs: '1 1 100%', 
                    sm: '1 1 calc(50% - 8px)', 
                    md: '1 1 calc(33.333% - 10px)', 
                    lg: '1 1 calc(25% - 12px)' 
                  } 
                }}
              >
                <Skeleton variant="rectangular" height={280} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
              </Box>
            ))}
          </Box>
        ) : generatingImages.length > 0 ? (
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
                      md: '1 1 calc(33.333% - 10px)', 
                      lg: '1 1 calc(25% - 12px)' 
                    } 
                  }}
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box 
                      sx={{ 
                        height: 280, 
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
                        Generating {genImage.numberOfImages} image{genImage.numberOfImages > 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="caption" align="center" color="text.secondary">
                        "{genImage.prompt.length > 60 ? genImage.prompt.substring(0, 60) + '...' : genImage.prompt}"
                      </Typography>
                    </Box>
                    <CardContent>
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
        ) : null}
        
        {imageGroups.length > 0 ? (
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
                        md: '1 1 calc(33.333% - 10px)', 
                        lg: '1 1 calc(25% - 12px)' 
                      } 
                    }}
                  >
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="img"
                        height={280}
                        image={image.url}
                        alt={image.title || image.prompt.substring(0, 30)}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
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