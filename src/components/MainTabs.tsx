import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card,
  CardMedia,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  CircularProgress,
  Skeleton,
  IconButton
} from '@mui/material';
import Grid from '@mui/material/Grid';
import FaceIcon from '@mui/icons-material/Person';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ImageIcon from '@mui/icons-material/Image';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoFixHigh from '@mui/icons-material/AutoFixHigh';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useLayout } from './Layout';
import { fetchModels, Model, deleteModel } from '../store/modelsSlice';
import { 
  fetchGeneratedImages, 
  selectImageGroups,
  selectGeneratingImages,
  selectGalleryLoading,
  selectGalleryLoadingMore,
  selectHasMoreImages,
  clearGeneratingImages,
  loadMoreImages,
  ImageGroup as GalleryImageGroup,
  GeneratedImage,
  deleteImage
} from '../store/gallerySlice';
import { AppDispatch } from '../store/store';
import { useLocation } from 'react-router-dom';
import ImageDetailModal from './ImageDetailModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { mockImageGroups, mockModels } from '../utils/mockData';

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
        <Box sx={{ py: { xs: 1, sm: 2 }, px: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

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

const MainTabs: React.FC = () => {
  // Set default tab to Gallery (index 0)
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  // State to toggle mock data display
  const [useMockData, setUseMockData] = useState(false);
  // State for selected image and modal
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'model' | 'image', imageKey?: string}>(
    {id: '', type: 'model'}
  );
  const [isDeleting, setIsDeleting] = useState(false);
  
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
  const isLoadingMore = useSelector(selectGalleryLoadingMore);
  const hasMoreImages = useSelector(selectHasMoreImages);
  
  // Get training updates from WebSocket context
  const { connect } = useWebSocket();
  const connectRef = useRef(connect);
  
  // Get layout context
  const { openModel, openImages, isDrawerOpen } = useLayout();
  

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
        await dispatch(clearGeneratingImages());
        
        // Pass the connect function as a callback via the ref
        await dispatch(fetchGeneratedImages({
          connectCallback: connectRef.current,
          reset: true,
          limit: 24
        }));

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

  // Function to handle loading more images
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMoreImages) return;
    
    try {
      await dispatch(loadMoreImages({
        connectCallback: connectRef.current,
        limit: 24
      }));
    } catch (error) {
      console.error('Error loading more images:', error);
    }
  }, [dispatch, isLoadingMore, hasMoreImages, connectRef]);

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

  // Function to handle delete confirmation modal
  const handleDeleteClick = useCallback((event: React.MouseEvent, id: string, type: 'model' | 'image', imageKey?: string) => {
    // Stop the click event from propagating to the parent (card)
    event.stopPropagation();
    
    setItemToDelete({id, type, imageKey});
    setDeleteModalOpen(true);
  }, []);

  // Function to handle delete confirmation
  const handleDeleteConfirm = useCallback(async () => {
    console.log(itemToDelete)
    if (!itemToDelete.id) return;
    
    setIsDeleting(true);
    
    try {
      if (itemToDelete.type === 'model') {
        await dispatch(deleteModel({ modelId: itemToDelete.id }));
      } else if (itemToDelete.type === 'image' && itemToDelete.imageKey) {
        await dispatch(deleteImage({ imageId: itemToDelete.id, imageKey: itemToDelete.imageKey }));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  }, [dispatch, itemToDelete]);

  // Function to handle delete modal close
  const handleDeleteModalClose = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', backgroundColor: 'transparent' }}>
      <Box sx={{ 
        mb: 4,
        display: 'flex',
        justifyContent: 'center',
        gap: 2
      }}>
        <Button
          variant={value === 0 ? "contained" : "outlined"}
          onClick={(e) => handleChange(e, 0)}
          startIcon={<PhotoLibraryIcon />}
          sx={{
            borderRadius: 8,
            py: 1.2,
            px: 3.5,
            minWidth: '120px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            borderColor: value === 0 ? 'primary.main' : 'divider',
            '&:hover': {
              borderColor: value === 0 ? 'primary.main' : 'primary.light',
            }
          }}
        >
          Gallery
        </Button>
        <Button
          variant={value === 1 ? "contained" : "outlined"}
          onClick={(e) => handleChange(e, 1)}
          startIcon={<FaceIcon />}
          sx={{
            borderRadius: 8,
            py: 1.2,
            px: 3.5,
            minWidth: '120px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            borderColor: value === 1 ? 'primary.main' : 'divider',
            '&:hover': {
              borderColor: value === 1 ? 'primary.main' : 'primary.light',
            }
          }}
        >
          Models
        </Button>
      </Box>
      
      {/* Models Tab */}
      <TabPanel value={value} index={1}>
        <Grid container spacing={3}>
          {modelsLoading || loading && !useMockData ? (
            <Grid size={12} sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Grid>
          ) : models.length === 0 && !useMockData ? (
            <Grid 
              size={12} 
              sx={{ 
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
                  bgcolor: 'rgba(25, 118, 210, 0.08)', 
                  borderRadius: '50%', 
                  width: 110, 
                  height: 110, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)'
                }}
              >
                <FaceIcon sx={{ fontSize: 52, color: 'primary.main' }} />
              </Box>
              <Typography variant="h5" color="text.primary" fontWeight="500">
                Your model collection is empty
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, mb: 4, maxWidth: 550 }}>
                Create personalized AI models to generate custom fashion images
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
                    backgroundColor: 'primary.dark'
                  }
                }}
                onClick={openModel}
              >
                Create Your First Model
              </Button>
            </Grid>
          ) : useMockData ? (
            // Show mock models
            mockModels.map((model) => (
              <Grid 
                key={model.modelId} 
                size={{                               
                  xs: 12,
                  sm: 12,
                  md: 12,
                  lg: 6 
                }}
                sx={{ mt: 5 }}
              >
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  },
                  position: 'relative'
                }}>
                  {/* Delete icon */}
                  <IconButton 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      zIndex: 2,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.8)',
                      }
                    }}
                    onClick={(e) => handleDeleteClick(e, model.modelId, 'model')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
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
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="320"
                          image={model.imageUrl ?? getFallbackImage(model.modelId)}
                          alt={model.name}
                          sx={{ 
                            objectFit: 'contain',
                            height: '100%',
                            maxHeight: 280,
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
                    {model.status === 'in_progress' && (
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <LinearProgress 
                          variant={model.progress ? "determinate" : "indeterminate"}
                          value={model.progress || 0}
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                              transition: 'transform 0.4s linear'
                            }
                          }} 
                        />
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                          {model.progress ? `${model.progress}% Complete` : 'Processing...'}
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                      Created on {new Date(model.createdAt ?? '').toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // Show API models
            models.map((model) => (
              <Grid 
                key={model.modelId} 
                size={{                               
                  xs: 12,
                  sm: 12,
                  md: 12,
                  lg: 6 
                }}
                sx={{ mt: 5 }}
              >
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  },
                  position: 'relative'
                }}>
                  {/* Delete icon */}
                  <IconButton 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      zIndex: 2,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.8)',
                      }
                    }}
                    onClick={(e) => handleDeleteClick(e, model.modelId, 'model')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
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
                          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="320"
                          image={model.imageUrl ?? getFallbackImage(model.modelId)}
                          alt={model.name}
                          sx={{ 
                            objectFit: 'contain',
                            height: '100%',
                            maxHeight: 280,
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
                    {model.status === 'in_progress' && (
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <LinearProgress 
                          variant={model.progress ? "determinate" : "indeterminate"}
                          value={model.progress || 0}
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                              transition: 'transform 0.4s linear'
                            }
                          }} 
                        />
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                          {model.progress ? `${model.progress}% Complete` : 'Processing...'}
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                      Created on {new Date(model.createdAt ?? '').toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>
      
      {/* Gallery Tab */}
      <TabPanel value={value} index={0}>
        {isLoadingImages && !useMockData ? (
          // Loading state with gallery-like layout
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((skeleton, index) => {
              // Use consistent height for all images
              const imageHeight = 320;
              
              return (
                <Grid
                  key={`skeleton-${skeleton}`} 
                  size={{                   
                    xs: 12,
                    sm: 12,
                    md: 12,
                    lg: 6 
                  }}
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
              <Box 
                sx={{ 
                  mb: 4, 
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  py: 1,
                  width: '100%'
                }}
              >
                <Box sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'divider',
                  left: 0,
                  top: '50%'
                }} />
                <Typography 
                  variant="subtitle1" 
                  component="div" 
                  sx={{
                    backgroundColor: 'background.default',
                    px: 4,
                    position: 'relative',
                    fontWeight: 500,
                    color: 'text.secondary'
                  }}
                >
                  {group.formattedDate}
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                {group.images.map((image: GeneratedImage, index: number) => {
                  return (
                    <Grid 
                      key={image.imageId}
                      size={{
                        xs: 12,
                        sm: 12,
                        md: 12,
                        lg: 6 
                      }}
                    >
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        overflow: 'hidden',
                        borderRadius: 2,
                        width: '100%',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        },
                        position: 'relative'
                      }}
                      onClick={() => handleOpenModal(image)}>
                        {/* Delete icon */}
                        <IconButton 
                          size="small" 
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8, 
                            zIndex: 2,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(211, 47, 47, 0.8)',
                            }
                          }}
                          onClick={(e) => handleDeleteClick(e, image.imageId, 'image', image.imageKey)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
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
                        <CardContent sx={{ py: 1.5, px: 2, flexGrow: 0 }}>
                          {image.dripRating && image.dripRating.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
                              {image.dripRating.map((tag: string, idx: number) => (
                                <Chip
                                  key={idx}
                                  label={tag}
                                  size="small"
                                  variant="filled"
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    height: 24,
                                    color: theme.palette.secondary.light,
                                    ml: 0.5,
                                    mb: 0.5
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
                <Box 
                  sx={{ 
                    mb: 2, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    py: 2,
                    width: '100%'
                  }}
                >
                  <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '1px',
                    backgroundColor: 'divider',
                    left: 0,
                    top: '50%'
                  }} />
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{
                      backgroundColor: 'background.default',
                      px: 3,
                      position: 'relative',
                      fontWeight: 500
                    }}
                  >
                    Currently Generating
                  </Typography>
                </Box>
                
                <Grid container spacing={4}>
                  {generatingImages.map((genImage, index) => {
                    return (
                      <Grid
                        key={genImage.imageId} 
                        size={{
                          xs: 12,
                          sm: 12,
                          md: 12,
                          lg: 6 
                        }}
                      >
                        <Card sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          overflow: 'hidden',
                          borderRadius: 2,
                          bgcolor: 'action.hover',
                        }}>
                          {/* No delete button for generating images */}
                          <Box 
                            sx={{ 
                              height: 320, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              flexDirection: 'column',
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
                                    variant={genImage.status === 'try_on' ? "indeterminate" : "determinate"} 
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
                                    {genImage.status === 'try_on' 
                                      ? "Trying on outfit..."
                                      : genImage.progress !== undefined 
                                        ? `Generating Image ${Math.round(genImage.progress)}%`
                                        : "Generating Image"}
                                  </Typography>
                                </Box>
                              </>
                            ) : (
                              <CircularProgress sx={{ mb: 1 }} />
                            )}
                          </Box>
                          <CardContent sx={{ py: 1.5, px: 2, flexGrow: 0 }}>
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
              <>
                {imageGroups.map((group) => (
                  <Box key={group.date} sx={{ mb: 4 }}>
                    <Box 
                      sx={{ 
                        mb: 4, 
                        mt: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        py: 1,
                        width: '100%'
                      }}
                    >
                      <Box sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '1px',
                        backgroundColor: 'divider',
                        left: 0,
                        top: '50%'
                      }} />
                      <Typography 
                        variant="subtitle1" 
                        component="div" 
                        sx={{
                          backgroundColor: 'background.default',
                          px: 4,
                          position: 'relative',
                          fontWeight: 500,
                          color: 'text.secondary'
                        }}
                      >
                        {group.formattedDate}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={4}>
                      {group.images.map((image, index) => {
                        return (
                          <Grid 
                            key={image.imageId}
                            size={{
                              xs: 12,
                              sm: 12,
                              md: 12,
                              lg: 6 
                            }}
                          >
                            <Card sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              overflow: 'hidden',
                              borderRadius: 2,
                              width: '100%',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                                cursor: 'pointer'
                              },
                              position: 'relative'
                            }}
                            onClick={() => handleOpenModal(image)}>
                              {/* Delete icon */}
                              <IconButton 
                                size="small" 
                                sx={{ 
                                  position: 'absolute', 
                                  top: 8, 
                                  right: 8, 
                                  zIndex: 2,
                                  backgroundColor: 'rgba(0,0,0,0.5)',
                                  color: 'white',
                                  '&:hover': {
                                    backgroundColor: 'rgba(211, 47, 47, 0.8)',
                                  }
                                }}
                                onClick={(e) => handleDeleteClick(e, image.imageId, 'image', image.imageKey)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
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
                              <CardContent sx={{ py: 1.5, px: 2, flexGrow: 0 }}>
                                {image.dripRating && image.dripRating.length > 0 && (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 1 }}>
                                    {image.dripRating.map((tag, idx) => (
                                      <Chip
                                        key={idx}
                                        label={tag}
                                        size="small"
                                        variant="filled"
                                        sx={{
                                          fontWeight: 600,
                                          fontSize: '0.75rem',
                                          height: 24,
                                          color: theme.palette.secondary.light,
                                          ml: 0.5,
                                          mb: 0.5
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
                ))}
                
                {/* Load More Button */}
                {hasMoreImages && (
                  <Box sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 4, 
                    mb: 2 
                  }}>
                    <Button
                      variant="outlined"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        px: 4,
                        position: 'relative'
                      }}
                    >
                      {isLoadingMore ? (
                        <>
                          <CircularProgress 
                            size={24} 
                            sx={{ 
                              color: 'primary',
                              position: 'absolute',
                              left: 'calc(50% - 12px)',
                            }} 
                          />
                          <span style={{ visibility: 'hidden' }}>Load More</span>
                        </>
                      ) : (
                        'Load More'
                      )}
                    </Button>
                  </Box>
                )}
              </>
            ) : generatingImages.length === 0 ? (
              // Show empty state only when there are no images and nothing generating
              <Grid container justifyContent="center">
                <Grid 
                  size={12}
                  sx={{ 
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
                      bgcolor: 'rgba(25, 118, 210, 0.08)', 
                      borderRadius: '50%', 
                      width: 110, 
                      height: 110, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 52, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h5" color="text.primary" fontWeight="500">
                    Your gallery is empty
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, mb: 4, maxWidth: 550 }}>
                    Generate stunning fashion images with your personalized AI models
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<AutoFixHighIcon />}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
                        backgroundColor: 'primary.dark'
                      }
                    }}
                    onClick={handleCreateImageClick}
                  >
                    Create Your First Image
                  </Button>
                </Grid>
              </Grid>
            ) : null}
          </>
        )}
      </TabPanel>

      {/* Image Modal */}
      <ImageDetailModal 
        open={modalOpen}
        onClose={handleCloseModal}
        selectedImage={selectedImage}
        onImageError={handleImageError}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        open={deleteModalOpen}
        title={`Delete ${itemToDelete.type === 'model' ? 'Model' : 'Image'}`}
        message={`Are you sure you want to delete this ${itemToDelete.type}? This action cannot be undone.`}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </Box>
  );
};

export default MainTabs;