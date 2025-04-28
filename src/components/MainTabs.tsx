import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Skeleton,
  Dialog,
  DialogContent,
  IconButton,
  Slide
} from '@mui/material';
import Grid from '@mui/material/Grid';
import FaceIcon from '@mui/icons-material/Person';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ImageIcon from '@mui/icons-material/Image';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { TransitionProps } from '@mui/material/transitions';
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
  clearGeneratingImages,
  ImageGroup as GalleryImageGroup,
  GeneratedImage
} from '../store/gallerySlice';
import { AppDispatch } from '../store/store';
import { useLocation } from 'react-router-dom';
import AutoFixHigh from '@mui/icons-material/AutoFixHigh';

// Define local interface for image groups
interface ImageGroup {
  date: string;
  formattedDate: string;
  images: GeneratedImage[];
}

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

// Mock data
const mockModels: Model[] = [
  {
    modelId: 'model_1',
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
    modelId: 'model_2',
    name: 'Business Professional',
    gender: 'Male',
    bodyType: 'Average',
    createdAt: '2024-04-19T09:15:00Z',
    status: 'in_progress',
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
    modelId: 'model_3',
    name: 'Evening Elegance',
    gender: 'Female',
    bodyType: 'Slim',
    createdAt: '2024-04-18T18:30:00Z',
    status: 'queued',
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
    modelId: 'model_4',
    name: 'Urban Streetwear',
    gender: 'Non-binary',
    bodyType: 'Athletic',
    createdAt: '2024-04-17T11:45:00Z',
    status: 'failed',
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
    modelId: 'model_5',
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
    modelId: 'model_6',
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

// Mock image data grouped by date
const mockImageGroups: ImageGroup[] = [
  {
    date: '2024-04-21',
    formattedDate: 'Sun, 21st April, 2024',
    images: [
      {
        imageId: '1',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=720&q=80',
        title: 'Elegant Formal Outfit',
        createdAt: '2024-04-21T15:30:00Z',
        orientation: 'portrait_4_3',
        dripRating: ['Chic', 'Elegant', 'Sophisticated', 'Glamorous', 'Formal']
      },
      {
        imageId: '2',
        imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
        title: 'Luxury Evening Wear',
        createdAt: '2024-04-21T14:20:00Z',
        orientation: 'portrait_16_9',
        dripRating: ['Elegant', 'Glamorous', 'Luxurious', 'Sophisticated', 'Stylish']
      },
      {
        imageId: '3',
        imageUrl: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=672&q=80',
        title: 'Bright Summer Collection',
        createdAt: '2024-04-21T12:10:00Z',
        orientation: 'landscape_16_9',
        dripRating: ['Vibrant', 'Playful', 'Casual', 'Fun', 'Summery']
      },
      {
        imageId: '4',
        imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=673&q=80',
        title: 'City Street Fashion',
        createdAt: '2024-04-21T10:15:00Z',
        orientation: 'square_hd',
        dripRating: ['Urban', 'Stylish', 'Edgy', 'Modern', 'Trendy']
      }
    ]
  },
  {
    date: '2024-04-20',
    formattedDate: 'Sat, 20th April, 2024',
    images: [
      {
        imageId: '5',
        imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80',
        title: 'Professional Business Look',
        createdAt: '2024-04-20T19:45:00Z',
        orientation: 'portrait_4_3',
        dripRating: ['Professional', 'Sophisticated', 'Polished', 'Formal', 'Elegant']
      },
      {
        imageId: '6',
        imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80',
        title: 'Evening Gown Collection',
        createdAt: '2024-04-20T18:30:00Z',
        orientation: 'landscape_4_3',
        dripRating: ['Glamorous', 'Elegant', 'Sophisticated', 'Luxurious', 'Chic']
      },
      {
        imageId: '7',
        imageUrl: 'https://images.unsplash.com/photo-1632149877166-f75d49000351?ixlib=rb-4.0.3&auto=format&fit=crop&w=664&q=80',
        title: 'Urban Fashion Style',
        createdAt: '2024-04-20T16:40:00Z',
        orientation: 'portrait_16_9',
        dripRating: ['Urban', 'Edgy', 'Stylish', 'Modern', 'Trendy']
      }
    ]
  },
  {
    date: '2024-04-19',
    formattedDate: 'Fri, 19th April, 2024',
    images: [
      {
        imageId: '8',
        imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=686&q=80',
        title: 'Casual Summer Outfit',
        createdAt: '2024-04-19T16:20:00Z',
        dripRating: ['Casual', 'Fun', 'Vibrant', 'Summery', 'Relaxed']
      },
      {
        imageId: '9',
        imageUrl: 'https://images.unsplash.com/photo-1576185850227-1f72b7f8d483?ixlib=rb-4.0.3&auto=format&fit=crop&w=725&q=80',
        title: 'Winter Collection',
        createdAt: '2024-04-19T14:10:00Z',
        dripRating: ['Cozy', 'Elegant', 'Sophisticated', 'Warm', 'Seasonal']
      }
    ]
  }
];

// Helper function to get fallback image based on model ID hash
const getFallbackImage = (modelId: string): string => {
  // Simple hash function
  if(!modelId) return '/dress1.jpg';
  const hash = modelId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Use modulo 3 to get a number between 0-2
  const imageIndex = hash % 3;
  return `/dress${imageIndex + 1}.jpg`;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MainTabs: React.FC = () => {
  // Set default tab to Gallery (index 0)
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  // State to toggle mock data display
  const [useMockData, setUseMockData] = useState(true);
  // State for selected image and modal
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
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
  const { connect } = useWebSocket();
  const connectRef = useRef(connect);
  
  // Get layout context
  const { openModel, openImages, isDrawerOpen } = useLayout();
  
  // Simplify the getGridSize function based on new requirements
  const getGridSize = useCallback(() => {
    // Single image - make it prominently larger
    return { 
      xs: 12, 
      sm: isDrawerOpen ? 12 : 6, 
      md: isDrawerOpen ? 12 : 4,
      lg: isDrawerOpen ? 4 : 3
    };
  }, [isDrawerOpen]);

  // Function to handle image errors
  const handleImageError = useCallback(() => {
    return '/dress4.jpg';
  }, []);

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
      // Only fetch models once during component lifecycle
      if (hasFetchedRef.current || !userId || !token) return;
      
      try {
        setLoading(true);
        const result = await dispatch(fetchModels());
        
        // Connect to WebSocket for in-progress models
        // After fetching models, connect to any that are in progress
        if (result.payload && Array.isArray(result.payload)) {
          result.payload.forEach((model: Model) => {
            if ((model.status === 'in_progress' || model.status === 'queued') && model.modelId) {
              connect(model.modelId, "MODEL");
            }
          });
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
        hasFetchedRef.current = true;
      }
    };
    
    fetchModelsData();
  }, [token, userId, dispatch, connect]);

  // Update connectRef when connect changes
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // Fetch images when gallery tab is active
  useEffect(() => {
    const fetchImagesData = async () => {
      if (hasLoadedImagesRef.current || !userId || !token) return;
      
      try {
        console.log("Fetching generated images from API");
        await dispatch(clearGeneratingImages());
        
        // Pass the connect function as a callback via the ref
        const result = await dispatch(fetchGeneratedImages({
          connectCallback: connectRef.current
        }));
        
        console.log("Fetched images results:", result.payload);
        hasLoadedImagesRef.current = true;
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
  }, [token, userId, dispatch]);

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
      case 'queued':
        color = 'secondary';
        label = 'Queued';
        break;
      case 'in_progress':
        color = 'primary';
        label = 'Training';
        break;
      case 'completed':
        color = 'success';
        label = 'Ready';
        break;
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

  // Function to handle opening the image modal
  const handleOpenModal = useCallback((image: GeneratedImage) => {
    setSelectedImage(image);
    setModalOpen(true);
  }, []);

  // Function to handle closing the image modal
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    // Clear selected image after animation completes
    setTimeout(() => setSelectedImage(null), 300);
  }, []);

  // Function to handle image download
  const handleDownloadImage = useCallback(async (imageUrl: string | undefined, title: string | undefined) => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'lovit-image'}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }, []);

  const gridSize = getGridSize();

  return (
    <Box sx={{ width: '100%', backgroundColor: 'transparent' }}>
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
                key={model.modelId} 
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
                        backgroundImage: `url(${model.imageUrl ?? getFallbackImage(model.modelId)})`,
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
                      image={model.imageUrl ?? getFallbackImage(model.modelId)}
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
                    {model.status === 'in_progress' && model.progress && (
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
                key={model.modelId} 
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
                        backgroundImage: `url(${model.imageUrl ?? getFallbackImage(model.modelId)})`,
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
                      image={model.imageUrl ?? getFallbackImage(model.modelId)}
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
                    {model.status === 'in_progress' && model.progress && (
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
          // Loading state with gallery-like layout
          <Grid container spacing={0} sx={{ width: '100%' }}>
            {[1, 2, 3, 4, 5, 6].map((skeleton, index) => {
              // Use consistent height for all images
              const imageHeight = 320;
              
              return (
                <Grid
                  key={`skeleton-${skeleton}`} 
                  size={{ xs: 12, sm: 6, md: isDrawerOpen ? 6 : 4, lg: isDrawerOpen ? 4 : 3 }}
                  sx={{ p: 0.5 }}
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 1, boxShadow: 'none' }}>
                    <Skeleton variant="rectangular" height={imageHeight} />
                    <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
                      <Skeleton variant="text" sx={{ mt: 0.5 }} />
                      <Skeleton variant="text" width="60%" />
                    </Box>
                    <Skeleton variant="rectangular" height={imageHeight} />
                    <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
                      <Skeleton variant="text" sx={{ mt: 0.5 }} />
                      <Skeleton variant="text" width="60%" />
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : useMockData ? (
          // Show mock image data with dynamic Grid sizing
          mockImageGroups.map((group: ImageGroup) => (
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
              
              <Grid 
                container 
                spacing={1} 
                sx={{ 
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start' 
                }}
              >
                {group.images.map((image: GeneratedImage, index: number) => {
                  return (
                    <Grid 
                      key={image.imageId}
                      size={{
                        xs: gridSize.xs,
                        sm: gridSize.sm,
                        md: gridSize.md,
                        lg: gridSize.lg
                      }}
                      sx={{ p: 0.5, display: 'flex' }}
                    >
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        overflow: 'hidden',
                        borderRadius: 1,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                        mx: 'auto', // Center the card horizontally
                        width: '100%',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          cursor: 'pointer'
                        },
                      }}
                      onClick={() => handleOpenModal(image)}>
                        <Box sx={{ 
                          position: 'relative', 
                          height: group.images.length === 1 ? 450 : 320,
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundImage: `url(${image.imageUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              filter: 'blur(15px)',
                              transform: 'scale(1.1)', // Avoid blur edges showing
                              opacity: 0.8,
                            }}
                          />
                          <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            width: '100%',
                            position: 'relative',
                            zIndex: 1,
                            padding: 2
                          }}>
                            <Box 
                              sx={{ 
                                position: 'relative', 
                                height: group.images.length === 1 ? 450 : 320,
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center'
                              }}>
                              <Box sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%',
                                position: 'relative',
                                zIndex: 1,
                                padding: 2
                              }}>
                                <Box 
                                  sx={{ 
                                    display: 'inline-block',
                                    position: 'relative',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                  }}
                                >
                                  <CardMedia
                                    component="img"
                                    image={image.imageUrl}
                                    alt={image.title || 'Image'}
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                      e.currentTarget.src = handleImageError();
                                    }}
                                    sx={{ 
                                      objectFit: 'contain',
                                      maxHeight: group.images.length === 1 ? 400 : 280,
                                      maxWidth: '100%',
                                      width: 'auto',
                                      display: 'block',
                                      backgroundColor: 'transparent',
                                      borderRadius: '4px',
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        <CardContent sx={{ py: 1, px: 1.5, flexGrow: 0, bgcolor: 'background.paper' }}>
                          {image.dripRating && image.dripRating.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
                              {image.dripRating.map((tag: string, idx: number) => (
                                <Chip
                                  key={idx}
                                  label={tag}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#F5F5DC', // Gold color
                                    color: 'rgba(0, 0, 0, 0.87)', // Dark text for contrast
                                    fontWeight: 500,
                                    fontSize: '0.7rem',
                                    height: 20
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                          <Typography variant="subtitle1" noWrap>
                            {image.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(image.createdAt ?? '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))
        ) : (
          // Show real data with dynamic Grid layout
          <>
            {/* Show generating images section */}
            {generatingImages.length > 0 && (
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
                
                <Grid container spacing={0} sx={{ width: '100%' }}>
                  {generatingImages.map((genImage, index) => {
                    return (
                      <Grid
                        key={genImage.imageId} 
                        size={{
                          xs: gridSize.xs,
                          sm: gridSize.sm,
                          md: gridSize.md,
                          lg: gridSize.lg
                        }}
                        sx={{ p: 0.5 }}
                      >
                        <Card sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          overflow: 'hidden',
                          borderRadius: 1,
                          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                        }}>
                          <Box 
                            sx={{ 
                              height: 320, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              flexDirection: 'column',
                              bgcolor: 'action.hover',
                              p: 0,
                              m: 0,
                              position: 'relative'
                            }}
                          >
                            {genImage.progress !== undefined ? (
                              <>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                                  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                                    <AutoFixHigh 
                                      sx={{ 
                                        fontSize: 40, 
                                        color: 'primary.main', 
                                        animation: 'pulse 1.5s infinite ease-in-out, sparkle 2s infinite ease-in-out' 
                                      }} 
                                    />
                                  </Box>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={genImage.progress} 
                                    sx={{ width: '80%', height: 6, borderRadius: 3, mb: 2 }} 
                                  />
                                  <Typography 
                                    variant="body2" 
                                    align="center" 
                                    sx={{ 
                                      mb: 0,
                                      fontWeight: 500,
                                      color: 'primary.main',
                                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                    }}
                                  >
                                    {genImage.progress !== undefined 
                                      ? `Generating Image ${Math.round(genImage.progress)}%`
                                      : "Generating Image"}
                                  </Typography>
                                </Box>
                              </>
                            ) : (
                              <CircularProgress sx={{ mb: 1 }} />
                            )}
                          </Box>
                          <CardContent sx={{ py: 1, px: 1.5, flexGrow: 0, bgcolor: 'background.paper' }}>
                            <Typography variant="subtitle1" noWrap>In Progress</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {/* Show finished images grouped by date */}
            {imageGroups.length > 0 ? (
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
                  
                  <Grid 
                    container 
                    spacing={1} 
                    sx={{ 
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-start' 
                    }}
                  >
                    {group.images.map((image, index) => {
                      return (
                        <Grid 
                          key={image.imageId}
                          size={{
                            xs: gridSize.xs,
                            sm: gridSize.sm,
                            md: gridSize.md,
                            lg: gridSize.lg
                          }}
                          sx={{ p: 0.5, display: 'flex' }}
                        >
                          <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            overflow: 'hidden',
                            borderRadius: 1,
                            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                            mx: 'auto',
                            width: '100%',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              cursor: 'pointer'
                            },
                          }}
                          onClick={() => handleOpenModal(image)}>
                            <Box sx={{ 
                              position: 'relative', 
                              height: group.images.length === 1 ? 450 : 320,
                              overflow: 'hidden',
                              display: 'flex',
                              justifyContent: 'center'
                            }}>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundImage: `url(${image.imageUrl})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  filter: 'blur(15px)',
                                  transform: 'scale(1.1)', // Avoid blur edges showing
                                  opacity: 0.8,
                                }}
                              />
                              <Box sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%',
                                position: 'relative',
                                zIndex: 1,
                                padding: 2
                              }}>
                                <Box 
                                  sx={{ 
                                    position: 'relative', 
                                    height: group.images.length === 1 ? 450 : 320,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    justifyContent: 'center'
                                  }}>
                                  <Box sx={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    width: '100%',
                                    position: 'relative',
                                    zIndex: 1,
                                    padding: 2
                                  }}>
                                    <Box 
                                      sx={{ 
                                        display: 'inline-block',
                                        position: 'relative',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                      }}
                                    >
                                      <CardMedia
                                        component="img"
                                        image={image.imageUrl}
                                        alt={image.title || 'Image'}
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                          e.currentTarget.src = handleImageError();
                                        }}
                                        sx={{ 
                                          objectFit: 'contain',
                                          maxHeight: group.images.length === 1 ? 400 : 280,
                                          maxWidth: '100%',
                                          width: 'auto',
                                          display: 'block',
                                          backgroundColor: 'transparent',
                                          borderRadius: '4px',
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                            <CardContent sx={{ py: 1, px: 1.5, flexGrow: 0, bgcolor: 'background.paper' }}>
                              {image.dripRating && image.dripRating.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
                                  {image.dripRating.map((tag, idx) => (
                                    <Chip
                                      key={idx}
                                      label={tag}
                                      size="small"
                                      sx={{
                                        backgroundColor: '#F5F5DC', // Gold color
                                        color: 'rgba(0, 0, 0, 0.87)', // Dark text for contrast
                                        fontWeight: 500,
                                        fontSize: '0.7rem',
                                        height: 20
                                      }}
                                    />
                                  ))}
                                </Box>
                              )}
                              <Typography variant="subtitle1" noWrap>
                                {image.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(image.createdAt ?? '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              ))
            ) : generatingImages.length === 0 ? (
              // Show empty state only when there are no images and nothing generating
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
          </>
        )}
      </TabPanel>

      {/* Image Modal */}
      <Dialog
        fullScreen
        open={modalOpen}
        onClose={handleCloseModal}
        TransitionComponent={Transition}
        onClick={(e) => {
          // This ensures clicks anywhere outside the content container will close the modal
          const target = e.target as HTMLElement;
          if (target.classList.contains('MuiDialog-container')) {
            handleCloseModal();
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            overflow: 'hidden' // Prevent scrolling in the dialog
          }
        }}
      >
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
            overflow: 'hidden',
            height: '100vh',
            position: 'relative'
          }}
        >
          {selectedImage && (
            <Box sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 2, sm: 4 }
            }}>
              {/* Background blur effect */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${selectedImage?.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(30px)',
                  transform: 'scale(1.2)',
                  opacity: 0.3,
                }}
              />
              
              {/* Clickable backdrop - this will close the modal when clicked */}
              <Box
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 5,
                  cursor: 'pointer'
                }}
              />
              
              {/* Main content container */}
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '90%',
                  maxHeight: '90%',
                  position: 'relative',
                  zIndex: 10,
                  borderRadius: 3,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  p: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              >
                {/* Image */}
                <Box sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  overflow: 'hidden',
                  mb: 2,
                  position: 'relative'
                }}>
                  <img
                    src={selectedImage?.imageUrl}
                    alt={selectedImage?.title || 'Full-size image'}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                      display: 'block',
                      borderRadius: '8px'
                    }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = handleImageError();
                    }}
                  />
                  {/* Download button on top right of image */}
                  <IconButton
                    onClick={() => handleDownloadImage(selectedImage?.imageUrl, selectedImage?.title)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: '#F5F5DC',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      }
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Box>
                
                {/* Title and tags below the image */}
                <Box sx={{ 
                  width: '100%',
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2
                }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    {selectedImage?.title}
                  </Typography>
                  
                  {selectedImage?.dripRating && selectedImage.dripRating.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedImage.dripRating.map((tag, idx) => (
                        <Chip
                          key={idx}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: 'primary.main', // Gold color
                            color: 'rgba(0, 0, 0, 0.87)',
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                
                {/* Close button below */}
                <Button
                  variant="text"
                  startIcon={<CloseIcon />}
                  onClick={handleCloseModal}
                  sx={{
                    color: 'white',
                    alignSelf: 'center',
                    mt: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MainTabs;