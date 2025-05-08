import React, { useState, useRef, useEffect, createContext, useContext, useCallback } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Slider,
  Stack,
  useMediaQuery,
  Alert,
  Snackbar,
  CircularProgress,
  LinearProgress,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ImageIcon from '@mui/icons-material/Image';
import FaceIcon from '@mui/icons-material/Face';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StyleIcon from '@mui/icons-material/Style';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Face3Icon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import EditIcon from '@mui/icons-material/Edit';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logoutAllState } from '../store/actions';
import { TrainingUpdate, useWebSocket } from '../contexts/WebSocketContext';
import { selectModels, getModelUploadUrls, trainModelWithS3 } from '../store/modelsSlice';
import { 
  generateImages, 
  uploadClothingItem,
  selectIsUploadingClothing,
  selectClothingKey,
  selectGeneratingImages
} from '../store/gallerySlice';
import { AppDispatch } from '../store/store';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Person from '@mui/icons-material/Person';
import { Allowances } from '../store/authSlice';
import { createCheckoutSession, createPortalSession } from '../store/authSlice';
import UpgradePopup from './UpgradePopup';


// Define UserProfile interface here to modify the age type
interface UserProfile {
  name: string;
  gender: string;
  age: string | number;
  height: string;
  nationality?: string;
  ethnicity: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  bodyType: string;
  breastSize: string;
}

// Define the maximum number of images per tier
const TIER_IMAGE_LIMITS = {
  free: 0,
  starter: 1,
  pro: 2,
  premium: 4
};

// Create a context for the Layout functions
interface LayoutContextType {
  openModel: () => void;
  openImages: () => void;
  isDrawerOpen: boolean;  // Add drawer state to the context
  drawerWidth: number;    // Share drawer width with components
}

export const LayoutContext = createContext<LayoutContextType | null>(null);

// Hook to use the Layout context
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

// Responsive drawer width
const drawerWidth = 360;

const MIN_REQUIRED_IMAGES = 10;
const MAX_ALLOWED_IMAGES = 20;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? 0 : `-${drawerWidth}px`,
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    padding: theme.spacing(2),
    width: '100%',
  },
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('md')]: {
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

// Model specific constants
const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other'];
const BODY_TYPE_OPTIONS = ['Slim', 'Athletic', 'Average', 'Curvy', 'Muscular', 'Plus-size'];
const HAIR_COLOR_OPTIONS = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Other'];
const HAIR_STYLE_OPTIONS = ['Short', 'Medium', 'Long', 'Curly', 'Straight', 'Wavy', 'Bald'];
const EYE_COLOR_OPTIONS = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Black'];
const BREAST_SIZE_OPTIONS = ['Small', 'Medium', 'Large'];
const ETHNICITY_OPTIONS = ['Asian', 'Black', 'Caucasian', 'Hispanic/Latino', 'Middle Eastern', 'Mixed', 'Native American', 'Pacific Islander', 'Other'];
const HEIGHT_OPTIONS = ['Very Short (~140cm/4\'7")', 'Petite (~150cm/4\'11")', 'Short (~160cm/5\'3")', 'Average (~170cm/5\'7")', 'Tall (~180cm/5\'11")', 'Very Tall (190cm+/6\'3"+)'];

// Generation specific constants
const ORIENTATION_OPTIONS = [
  { value: 'square_hd', label: 'Square' },
  { value: 'portrait_4_3', label: 'Portrait 3:4' },
  { value: 'portrait_16_9', label: 'Portrait 9:16' },
  { value: 'landscape_4_3', label: 'Landscape 4:3' },
  { value: 'landscape_16_9', label: 'Landscape 16:9' }
];

interface LayoutProps {
  children: React.ReactNode;
}

const recentImages = [
  { id: 1, title: 'Beach Vacation Style', date: '2 mins ago' },
  { id: 2, title: 'Professional Office Look', date: '1 hour ago' },
  { id: 3, title: 'Evening Gown Red Carpet', date: 'Yesterday' },
  { id: 4, title: 'Casual Weekend Outfit', date: 'Last week' },
];

interface PromptData {
  modelId: string;
  prompt: string;
  numberOfImages: number;
  orientation: string;
  uploadedClothImage: File | null;
  useRandomPrompt: boolean;
  seedNumber?: number;
  inferenceSteps?: number;
}

const AllowanceDisplay: React.FC<{ 
  allowances: Allowances | null;
  onUpgrade: (type: 'photo' | 'model') => void;
}> = ({ allowances, onUpgrade }) => {
  if (!allowances) return null;

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* AI Photos Allowance */}
      <Box 
        onClick={() => onUpgrade('photo')}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 8,
          px: 1.5,
          py: 0.5,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.25)',
          }
        }}
      >
        <PhotoCameraIcon sx={{ fontSize: 18, mr: 0.5 }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {allowances.aiPhotos.used}/{allowances.aiPhotos.max + (allowances.aiPhotos.topup || 0)}
        </Typography>
      </Box>

      {/* AI Models Allowance */}
      <Box 
        onClick={() => onUpgrade('model')}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 8,
          px: 1.5,
          py: 0.5,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.25)',
          }
        }}
      >
        <Person sx={{ fontSize: 18, mr: 0.5 }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {allowances.aiModels.used}/{allowances.aiModels.max + (allowances.aiModels.topup || 0)}
        </Typography>
      </Box>
    </Box>
  );
};

// Add these new interfaces after the existing interfaces
interface DragDropAreaProps {
  onDrop: (files: File[]) => void;
  children: React.ReactNode;
  isClothing?: boolean;
}

// Add the DragDropArea component before the Layout component
const DragDropArea: React.FC<DragDropAreaProps> = ({ onDrop, children, isClothing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onDrop(files);
    }
  };

  if (isXs) {
    return (
      <Box sx={{ width: '100%' }}>
        {children}
      </Box>
    );
  }

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        position: 'relative',
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'divider',
        borderRadius: 2,
        backgroundColor: isDragging ? `${theme.palette.primary.main}10` : 'transparent',
        transition: 'all 0.2s ease',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: `${theme.palette.primary.main}05`,
        }
      }}
    >
      {children}
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mt: 1,
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        {isDragging ? 'Drop your images here' : 'Drag and drop images here'}
      </Typography>
    </Box>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { subscription } = useSelector((state: RootState) => state.auth);
  const models = useSelector(selectModels);
  
  // Selectors for clothing upload state
  const storedClothingKey = useSelector(selectClothingKey);
  
  // WebSocket integration
  const { lastMessage, connect } = useWebSocket();
  
  // Initialize open state based on screen size
  const [open, setOpen] = useState(!useMediaQuery(theme.breakpoints.down('md')));
  const [modelOpen, setModelOpen] = useState(false);
  const [imagesOpen, setImagesOpen] = useState(false);
  const [isModelUploading, setIsModelUploading] = useState(false);
  const [isExecutingGenerating, setIsExecutingGenerating] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Get max allowed images based on subscription tier
  const getMaxImagesForTier = useCallback(() => {
    const tier = (subscription?.tier || 'free').toLowerCase();
    return TIER_IMAGE_LIMITS[tier as keyof typeof TIER_IMAGE_LIMITS] || 0;
  }, [subscription?.tier]);
  
  // Update notification when WebSocket receives a message
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'model_training_update') {
      // Set notification based on training status
      let severity: 'success' | 'error' | 'info' | 'warning' = 'info';
      let message = '';
      const trainingUpdate = lastMessage as TrainingUpdate;
      switch (trainingUpdate.status) {
        case 'queued':
          severity = 'info';
          message = `Model training queued - ${trainingUpdate.modelId}`;
          break;
        case 'in_progress':
          severity = 'info';
          message = `Training in progress ${trainingUpdate.progress ? `- ${trainingUpdate.progress}%` : ''}`;
          break;
        case 'completed':
          severity = 'success';
          message = 'Model training completed successfully!';
          break;
        case 'failed':
          severity = 'error';
          message = 'Model training failed. Please try again.';
          break;
        default:
          severity = 'info';
          message = `Model status: ${trainingUpdate.status}`;
      }
      
      setNotification({
        open: true,
        message,
        severity
      });
    }
  }, [lastMessage]);
  
  // Update drawer state when screen size changes
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  
  // Model creation state
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
  
  // Add upload and compression progress state
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Add a ref for the Model Name TextField
  const modelNameRef = useRef<HTMLInputElement>(null);
  
  // Image upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  
  // Prompt creation state
  const [promptData, setPromptData] = useState<PromptData>({
    prompt: '',
    numberOfImages: 1,
    orientation: 'portrait_16_9',
    uploadedClothImage: null,
    modelId: '',
    useRandomPrompt: false,
    seedNumber: undefined,
    inferenceSteps: 50
  });

  // Add clothing item state
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [clothingUrl, setClothingUrl] = useState<string | null>(null);
  const [clothingKey, setClothingKey] = useState<string | null>(null);
  
  // Sync clothingKey from Redux when it changes
  useEffect(() => {
    if (storedClothingKey) {
      setClothingKey(storedClothingKey);
    }
  }, [storedClothingKey]);

  // Add generatingImages from Redux store
  const generatingImages = useSelector(selectGeneratingImages);
  const isGeneratingImages = generatingImages.length > 0;

  const [upgradePopup, setUpgradePopup] = useState<{
    open: boolean;
    type: 'photo' | 'model' | null;
    message: string;
  }>({
    open: false,
    type: null,
    message: ''
  });

  // Check if user is on premium tier
  const isPremiumTier = (subscription?.tier || '').toLowerCase() === 'premium';

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleModelClick = () => {
    setModelOpen(!modelOpen);
    if (imagesOpen) setImagesOpen(false);
  };

  // Function to open model section and focus on name field
  const openModel = useCallback(() => {
    setOpen(true);
    setModelOpen(true);
    setTimeout(() => {
      if (modelNameRef.current) {
        modelNameRef.current.focus();
      }
    }, 750);
  }, []);

  const handleImagesClick = useCallback(() => {
    setImagesOpen(!imagesOpen);
    if (modelOpen) setModelOpen(false);
  }, [imagesOpen, modelOpen]);
  
  // Function to open images section
  const openImages = useCallback(() => {
    setOpen(true);
    setImagesOpen(true);
    if (modelOpen) setModelOpen(false);
  }, [modelOpen]);
  
  const handleNavigate = useCallback((path: string, e?: React.MouseEvent) => {
    navigate(path);
    if (isMobile && (!e || !(e.target instanceof Element) || !e.target.closest('.MuiSelect-select'))) {
      setOpen(false);
    }
  }, [navigate, isMobile]);
  
  // Model form handlers
  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleNumberChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numberValue = parseInt(value);
    if (!isNaN(numberValue)) {
      setUserProfile(prev => ({
        ...prev,
        [name]: numberValue
      }));
    }
  }, []);
  
  const handleAgeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Allow empty string to clear the input
    if (value === '') {
      setUserProfile(prev => ({
        ...prev,
        age: ''
      }));
    } else {
      const numberValue = parseInt(value);
      if (!isNaN(numberValue)) {
        setUserProfile(prev => ({
          ...prev,
          age: numberValue
        }));
      }
    }
  }, []);

  const handleSelectChange = useCallback((event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  // Image upload handlers
  const handleFileButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      
      setUploadedImages(prev => {
        // Calculate combined images
        const combined = [...prev, ...newImages];
        
        // If exceeding maximum, show notification
        if (combined.length > MAX_ALLOWED_IMAGES) {
          setNotification({
            open: true,
            message: `Maximum ${MAX_ALLOWED_IMAGES} images allowed. Only the first ${MAX_ALLOWED_IMAGES} images will be used.`,
            severity: 'info'
          });
        }
        
        // Return capped array
        return combined.slice(0, MAX_ALLOWED_IMAGES);
      });
      
      // Update count based on capped array
      setUploadedCount(prev => {
        const newCount = prev + newImages.length;
        return Math.min(newCount, MAX_ALLOWED_IMAGES);
      });
    }
  }, [setNotification]);
  
  const handleRemoveImage = useCallback((index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setUploadedCount(prev => prev - 1);
  }, []);
  
  // Prompt form handlers
  const handlePromptTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPromptData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePromptSelectChange = useCallback((event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setPromptData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleModelSelectChange = useCallback((event: SelectChangeEvent) => {
    const modelId = event.target.value;
    setPromptData(prev => ({
      ...prev,
      modelId
    }));
  }, []);

  const handleSliderChange = useCallback((_event: Event, newValue: number | number[]) => {
    const maxAllowed = getMaxImagesForTier();
    // Cap the value based on subscription tier
    const cappedValue = Math.min(newValue as number, maxAllowed === 0 ? 1 : maxAllowed);
    
    setPromptData(prev => ({
      ...prev,
      numberOfImages: cappedValue
    }));
  }, [getMaxImagesForTier]);
  

  
  // Submit handlers
  const handleCreateModel = useCallback(async () => {
    // Check if images are currently being generated
    if (isGeneratingImages) {
      setNotification({
        open: true,
        message: 'Please wait for current image generation to complete before creating a model',
        severity: 'info'
      });
      return;
    }

    // Validate we have at least 10 images
    if (uploadedImages.length < MIN_REQUIRED_IMAGES) {
      setNotification({
        open: true,
        message: `Please upload at least ${MIN_REQUIRED_IMAGES} images for better model training`,
        severity: 'error'
      });
      return;
    }

    // Validate profile data is complete
    if (!userProfile.name || !userProfile.gender || !userProfile.age || !userProfile.height || 
        !userProfile.ethnicity || !userProfile.hairColor || !userProfile.hairStyle || 
        !userProfile.eyeColor) {
      setNotification({
        open: true,
        message: 'Please fill in all model details',
        severity: 'error'
      });
      return;
    }

    setIsModelUploading(true);
    setIsCompressing(true);
    setCompressionProgress(0);
    setUploadProgress(0);
    setIsUploading(false);
    
    try {
      // Get auth token from Redux state instead of localStorage
      if (!token || !user?.userId) {
        setNotification({
          open: true,
          message: 'Authentication required. Please log in again.',
          severity: 'error'
        });
        setIsModelUploading(false);
        setIsCompressing(false);
        setIsUploading(false);
        return;
      }

      // Compress all images before uploading
      setNotification({
        open: true,
        message: 'Preparing images...',
        severity: 'info'
      });
      
      // Configure compression options
      const options = {
        maxSizeMB: 1,         // Max file size in MB
        maxWidthOrHeight: 1024, // Resize to this dimension (keeping aspect ratio)
        useWebWorker: true,   // Use web workers for better performance
        fileType: 'image/jpeg' // Force JPEG for better compression
      };
      
      const totalImages = uploadedImages.length;
      let completedImages = 0;
      
      // Track when each image is completed to update progress
      const updateProgress = () => {
        completedImages++;
        const progress = Math.round((completedImages / totalImages) * 100);
        setCompressionProgress(progress);
      };
      
      // Create an array of compression promises
      const compressionPromises = uploadedImages.map(async (image, index) => {
        try {
          // Log original file size
          console.log(`Original image size (${index+1}/${totalImages}): ${(image.size / 1024 / 1024).toFixed(2)} MB`);
          
          // Compress the image
          const compressedFile = await imageCompression(image, options);
          
          // Log compressed file size
          console.log(`Compressed image size (${index+1}/${totalImages}): ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
          
          // Update progress after each image is compressed
          updateProgress();
          
          return compressedFile;
        } catch (error) {
          console.error(`Error compressing image ${image.name}:`, error);
          // Update progress even if compression fails
          updateProgress();
          // If compression fails, use the original
          return image;
        }
      });
      
      // Wait for all compressions to complete in parallel
      const compressedImages = await Promise.all(compressionPromises);
      
      // Compression complete
      setIsCompressing(false);
      setIsUploading(true);
      
      // Update notification
      setNotification({
        open: true,
        message: 'Preparing to upload images...',
        severity: 'info'
      });
      
      // Get the MIME types of each image
      const fileTypes = compressedImages.map(file => file.type);
      
      // First, get presigned URLs for uploading images
      const urlsResponse = await dispatch(getModelUploadUrls({
        fileCount: compressedImages.length,
        fileTypes
      })).unwrap();
      
      const { modelId, urls } = urlsResponse;
      
      if (!modelId || !urls || !urls.length) {
        throw new Error('Failed to get upload URLs');
      }
      
      setNotification({
        open: true,
        message: 'Uploading images to secure storage...',
        severity: 'info'
      });
      
      // Upload each image directly to S3 using the presigned URLs
      let uploadedCount = 0;
      const imageKeys: string[] = [];
      
      for (let i = 0; i < compressedImages.length; i++) {
        const file = compressedImages[i];
        const { url, key } = urls[i];
        
        try {
          await axios.put(url, file, {
            headers: {
              'Content-Type': file.type
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                // Calculate overall progress based on this file's progress and previously completed files
                const fileProgress = (progressEvent.loaded / progressEvent.total);
                const overallProgress = Math.round(((uploadedCount + fileProgress) / compressedImages.length) * 100);
                setUploadProgress(overallProgress);
              }
            }
          });
          
          imageKeys.push(key);
          uploadedCount++;
          
          // Update progress notification
          const percentComplete = Math.round((uploadedCount / compressedImages.length) * 100);
          setNotification({
            open: true,
            message: `Uploading images: ${percentComplete}% complete`,
            severity: 'info'
          });
          
        } catch (error) {
          console.error(`Error uploading image ${i}:`, error);
        }
      }
      
      if (imageKeys.length === 0) {
        throw new Error('Failed to upload any images');
      }
      
      setNotification({
        open: true,
        message: 'Starting model training...',
        severity: 'info'
      });
      
      // Now start the model training process with the uploaded image keys
      const result = await dispatch(trainModelWithS3({
        modelId,
        imageKeys,
        profileData: userProfile
      })).unwrap();
      
      // Set URL parameter without page refresh
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'models');
      window.history.replaceState({}, '', url);
      
      // Dispatch a custom event to notify components about the tab change
      window.dispatchEvent(new CustomEvent('tabChange', { detail: { tab: 'models' } }));
      
      // Connect to WebSocket for this specific model
      if (result.modelId) {
        connect(result.modelId, "MODEL");
      }

      setNotification({
        open: true,
        message: `Model training started successfully! Model name: ${result.modelId}`,
        severity: 'success'
      });

      // Reset form
      setUserProfile({
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
      
      setUploadedImages([]);
      setUploadedCount(0);
      
      // Navigate to dashboard
      navigate('/dashboard');
      if (isMobile) {
        setOpen(false);
      }
    } catch (error: any) {
      // Check if error is exactly 'Model limit reached'
      if (error === 'Model limit reached') {
        setUpgradePopup({
          open: true,
          type: 'model',
          message: 'You have reached your AI model limit. Upgrade your subscription or top up to create more models!'
        });
      } else {
        setNotification({
          open: true,
          message: error instanceof Error ? error.message : error || 'Unknown error occurred',
          severity: 'error'
        });
      }
    } finally {
      setIsModelUploading(false);
      setIsCompressing(false);
      setIsUploading(false);
    }
  }, [uploadedImages, userProfile, token, user, connect, navigate, isMobile, setOpen, setNotification, dispatch, isGeneratingImages, setUpgradePopup]);
  
  // Add this function for clothing upload
  const handleClothingFileChange = async (file: File | null) => {
    if (!file) {
      setClothingFile(null);
      setClothingUrl(null);
      setClothingKey(null);
      return;
    }

    setClothingFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setClothingUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImages = async () => {
    // Add a check to prevent generating images while others are in progress
    if (isGeneratingImages) {
      setNotification({
        open: true,
        message: 'Please wait for current image generation to complete',
        severity: 'info'
      });
      return;
    }

    if (!promptData.modelId) {
      setNotification({
        open: true,
        message: 'Please select a model and enter a prompt',
        severity: 'error'
      });
      return;
    }

    try {
      let uploadedClothingKey = null;
      if (clothingFile) {
        setIsModelUploading(true);
        setIsUploading(false);
        setCompressionProgress(0);
        setUploadProgress(0);
        setIsCompressing(true);
        try {
          const result = await dispatch(uploadClothingItem({
            file: clothingFile
          })).unwrap();
          uploadedClothingKey = result.key;
        } catch (error) {
          console.error('Error uploading clothing item:', error);
          if (error === 'Photo limit reached') {
            setUpgradePopup({
              open: true,
              type: 'photo',
              message: 'You have reached your AI photo limit. Upgrade your subscription or top up to generate more images!'
            });
          } else {
            setNotification({
              open: true,
              message: 'Failed to upload clothing item',
              severity: 'error'
            });
          }
          setIsModelUploading(false);
          return;
        } finally {
          setIsCompressing(false);
        }
      } else {
        uploadedClothingKey = null;
      }

      setIsExecutingGenerating(true);
      const result = await dispatch(generateImages({
        modelId: promptData.modelId,
        prompt: promptData.prompt,
        numberOfImages: promptData.numberOfImages,
        orientation: promptData.orientation,
        clothingKey: uploadedClothingKey || undefined,
        seedNumber: promptData.seedNumber !== undefined ? String(promptData.seedNumber) : undefined,
        inferenceSteps: promptData.inferenceSteps,
        connectCallback: connect
      })).unwrap();
      setIsExecutingGenerating(false);

      if (result && !result.error) {
        // The actual images will be received through the WebSocket
        setNotification({
          open: true,
          message: 'Images generating!',
          severity: 'success'
        });
        
        // Navigate to the gallery tab after successful generation
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'gallery');
        window.history.replaceState({}, '', url);
        window.dispatchEvent(new CustomEvent('tabChange', { detail: { tab: 'gallery' } }));
      } else {
        if (result?.error === 'Photo limit reached') {
          setUpgradePopup({
            open: true,
            type: 'photo',
            message: 'You have reached your AI photo limit. Upgrade your subscription or top up to generate more images!'
          });
        } else {
          setNotification({
            open: true,
            message: result?.error || 'Failed to generate images',
            severity: 'error'
          });
        }
      }
    } catch (error: any) {
      if (error === 'Photo limit reached') {
        setUpgradePopup({
          open: true,
          type: 'photo',
          message: 'You have reached your AI photo limit. Upgrade your subscription or top up to generate more images!'
        });
      } else {
        setNotification({
          open: true,
          message: error instanceof Error ? error.message : error || 'Unknown error occurred',
          severity: 'error'
        });
      }
    } finally {
      setIsModelUploading(false);
      setIsCompressing(false);
      setIsUploading(false);
      setIsExecutingGenerating(false);
    }
  };

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, [setNotification]);

  // Update logout handler to use Redux logout
  const handleLogout = useCallback(() => {
    dispatch(logoutAllState());
    navigate('/login');
    if (isMobile) {
      setOpen(false);
    }
  }, [dispatch, navigate, isMobile, setOpen]);

  // Add a new handler for the toggle button
  const handlePromptModeChange = useCallback((_event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    // Prevent null value (i.e., disable toggling off both buttons)
    if (newValue !== null) {
      setPromptData(prev => ({
        ...prev,
        useRandomPrompt: newValue === 'random'
      }));
    }
  }, []);

  const handleUpgradePopupClose = () => {
    setUpgradePopup(prev => ({
      ...prev,
      open: false,
    }));
  };

  const allowances = useSelector((state: RootState) => state.auth.allowances);

  const handleTopUp = useCallback(async () => {
    try {
      const resultAction = await dispatch(createCheckoutSession({ 
        priceId: 'price_1RJSc0PU9E45VDzjai47qewH',
        productId: 'prod_SDuQwcDcLNpFsl'
      }));
      if (createCheckoutSession.fulfilled.match(resultAction) && resultAction.payload.url) {
        window.location.href = resultAction.payload.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  }, [dispatch]);

  const handleUpgrade = useCallback(async () => {
    try {
      const resultAction = await dispatch(createPortalSession());
      if (createPortalSession.fulfilled.match(resultAction) && resultAction.payload.url) {
        window.location.href = resultAction.payload.url;
      }
    } catch (error) {
      console.error('Failed to access subscription management:', error);
    }
  }, [dispatch]);

  return (
    <LayoutContext.Provider value={{ 
      openModel, 
      openImages: openImages, 
      isDrawerOpen: open, 
      drawerWidth 
    }}>
      <Box sx={{ display: 'flex' }}>
        <AppBarStyled position="fixed" open={open}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="secondary"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Lovit
              </Typography>
            </Box>

            {token && (
              <AllowanceDisplay 
                allowances={allowances} 
                onUpgrade={(type) => {
                  setUpgradePopup({
                    open: true,
                    type,
                    message: type === 'photo' 
                      ? 'Upgrade your subscription or top up to generate more images!'
                      : 'Upgrade your subscription or top up to create more models!'
                  });
                }}
              />
            )}

            {token && (
              <Box>
                <IconButton color="secondary" onClick={() => handleLogout()}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </AppBarStyled>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '0 16px 16px 0',
            },
          }}
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={open}
          onClose={isMobile ? handleDrawerClose : undefined}
          ModalProps={isMobile ? {
            keepMounted: true,
            disablePortal: true,
            disableEnforceFocus: true,
            disableAutoFocus: true
          } : undefined}
          SlideProps={{
            timeout: {
              enter: theme.transitions.duration.enteringScreen,
              exit: theme.transitions.duration.leavingScreen
            }
          }}
        >
          <DrawerHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'left', width: '100%' }}>
                Lovit Hub
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerClose} color="primary">
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
            <List sx={{ px: 1 }}>
              {/* Dashboard Section */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ px: 2, borderRadius: 2, mb: 1 }}
                  onClick={() => handleNavigate('/dashboard')}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <CheckroomIcon />
                  </ListItemIcon>
                  <ListItemText primary="Style Studio" />
                </ListItemButton>
              </ListItem>

              {/* Account Section */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ px: 2, borderRadius: 2, mb: 1 }}
                  onClick={() => handleNavigate('/account')}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItemButton>
              </ListItem>

              {/* Support Section */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ px: 2, borderRadius: 2, mb: 1 }}
                  onClick={() => handleNavigate('/support')}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <SupportAgentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Support" />
                </ListItemButton>
              </ListItem>
              
              {/* Models Section */}
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton 
                  sx={{ px: 2, borderRadius: 2, mb: 1 }}
                  onClick={handleModelClick}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <Face3Icon />
                  </ListItemIcon>
                  <ListItemText primary="Create Model" />
                  {modelOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={modelOpen} timeout="auto" unmountOnExit>
                  <Box sx={{ p: 2 }}>
                    {/* Simplified Model Form */}
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Model Name"
                        name="name"
                        value={userProfile.name}
                        onChange={handleTextChange}
                        required
                        inputRef={modelNameRef}
                      />
                      
                      <FormControl fullWidth size="small" required>
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
                      
                      <TextField
                        fullWidth
                        size="small"
                        label="Age"
                        name="age"
                        type="text"
                        value={userProfile.age}
                        onChange={handleAgeChange}
                        required
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*'
                        }}
                      />
                      
                      <FormControl fullWidth size="small" required>
                        <InputLabel>Height</InputLabel>
                        <Select
                          name="height"
                          value={userProfile.height}
                          label="Height"
                          onChange={handleSelectChange}
                        >
                          {HEIGHT_OPTIONS.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth size="small" required>
                        <InputLabel>Ethnicity</InputLabel>
                        <Select
                          name="ethnicity"
                          value={userProfile.ethnicity}
                          label="Ethnicity"
                          onChange={handleSelectChange}
                        >
                          {ETHNICITY_OPTIONS.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth size="small" required>
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
                      
                      <FormControl fullWidth size="small" required>
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
                      
                      <FormControl fullWidth size="small" required>
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
                      
                      <FormControl fullWidth size="small" required>
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
                      
                      <FormControl fullWidth size="small" required>
                        <InputLabel>Breast Size</InputLabel>
                        <Select
                          name="breastSize"
                          value={userProfile.breastSize}
                          label="Breast Size"
                          onChange={handleSelectChange}
                        >
                          {BREAST_SIZE_OPTIONS.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      {/* Image Upload - Simplified */}
                      <Typography variant="body2" gutterBottom>
                        Required: {MIN_REQUIRED_IMAGES} to {MAX_ALLOWED_IMAGES} Photos
                      </Typography>
                      
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 1.5, 
                          mb: 1.5,
                          borderRadius: 1,
                          backgroundColor: `${theme.palette.success.main}10`, 
                          borderColor: theme.palette.success.main,
                        }}
                      >
                        <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Good Photos:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          High quality, mix of close up selfies and full body shots in a variety of places, angles, clothes, and expressions
                        </Typography>
                      </Paper>
                      
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 1.5, 
                          mb: 1.5,
                          borderRadius: 1,
                          backgroundColor: `${theme.palette.warning.main}10`, 
                          borderColor: theme.palette.warning.main
                        }}
                      >
                        <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Bad Photos:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Low variety, group photos, other people, sunglasses, hats, face cutoff
                        </Typography>
                      </Paper>
                      
                      <DragDropArea onDrop={(files) => {
                        const newImages = Array.from(files);
                        setUploadedImages(prev => {
                          const combined = [...prev, ...newImages];
                          if (combined.length > MAX_ALLOWED_IMAGES) {
                            setNotification({
                              open: true,
                              message: `Maximum ${MAX_ALLOWED_IMAGES} images allowed. Only the first ${MAX_ALLOWED_IMAGES} images will be used.`,
                              severity: 'info'
                            });
                          }
                          return combined.slice(0, MAX_ALLOWED_IMAGES);
                        });
                        setUploadedCount(prev => {
                          const newCount = prev + newImages.length;
                          return Math.min(newCount, MAX_ALLOWED_IMAGES);
                        });
                      }}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CloudUploadIcon />}
                          sx={{ mb: 1, width: '100%' }}
                        >
                          Upload Images
                          <input
                            type="file"
                            multiple
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </Button>
                      </DragDropArea>
                      
                      {uploadedImages.length > 0 && (
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1,
                            maxHeight: '140px',
                            overflowY: 'auto',
                            p: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1
                          }}
                        >
                          {uploadedImages.map((image, index) => (
                            <Box key={index} sx={{ position: 'relative', width: 60, height: 60 }}>
                              <img 
                                src={URL.createObjectURL(image)} 
                                alt={`Upload ${index}`} 
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover',
                                  borderRadius: '4px'
                                }}
                              />
                              <IconButton
                                size="small"
                                sx={{ 
                                  position: 'absolute', 
                                  top: -8, 
                                  right: -8,
                                  backgroundColor: 'rgba(255,255,255,0.8)',
                                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
                                  p: 0.5
                                }}
                                onClick={() => handleRemoveImage(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ height: 48 }}
                        disabled={
                          isModelUploading || 
                          !userProfile.name || 
                          !userProfile.gender || 
                          !userProfile.age || 
                          !userProfile.height || 
                          !userProfile.ethnicity || 
                          !userProfile.hairColor || 
                          !userProfile.hairStyle || 
                          !userProfile.eyeColor ||
                          !userProfile.bodyType ||
                          !userProfile.breastSize ||
                          uploadedImages.length < MIN_REQUIRED_IMAGES
                        }
                        onClick={handleCreateModel}
                      >
                        {isModelUploading ? <CircularProgress size={24} color="inherit" /> : 'Create Model'}
                      </Button>
                    </Stack>
                  </Box>
                </Collapse>
              </ListItem>
              
              {/* Images Section */}
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton 
                  sx={{ px: 2, borderRadius: 2, mb: 1 }}
                  onClick={handleImagesClick}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    <ImageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Generate Images" />
                  {imagesOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={imagesOpen} timeout="auto" unmountOnExit>
                  <Box sx={{ p: 2 }}>
                    {/* Simplified Prompt Form */}
                    <Stack spacing={2}>
                      <FormControl fullWidth size="small" required>
                        <InputLabel>Select Model</InputLabel>
                        <Select
                          name="modelId"
                          value={promptData.modelId || ''}
                          label="Select Model"
                          onChange={handleModelSelectChange}
                        >
                          {models.map(model => (
                            <MenuItem key={model.modelId} value={model.modelId}>
                              {model.name}
                            </MenuItem>
                          ))}
                          {models.length === 0 && (
                            <MenuItem disabled value="">
                              No models available
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth size="small">
                        <InputLabel>Orientation</InputLabel>
                        <Select
                          name="orientation"
                          value={promptData.orientation}
                          label="Orientation"
                          onChange={handlePromptSelectChange}
                        >
                          {ORIENTATION_OPTIONS.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <Paper 
                          elevation={0}
                          variant="outlined" 
                          sx={{ 
                            backgroundColor: 'background.paper',
                            borderColor: 'primary.main',
                          }}
                        >
                          <ToggleButtonGroup
                            exclusive
                            value={promptData.useRandomPrompt ? 'random' : 'custom'}
                            onChange={handlePromptModeChange}
                            aria-label="prompt type"
                            size="medium"
                            sx={{ width: '100%' }}
                          >
                            <ToggleButton 
                              value="custom" 
                              aria-label="custom prompt"
                              sx={{ 
                                px: 2,
                                borderRadius: 1,
                                backgroundColor: `${theme.palette.background.default}`,
                                '&.Mui-selected': {
                                  backgroundColor: `${theme.palette.secondary.main}`,
                                  color: theme.palette.primary.main,
                                  fontWeight: 'bold'
                                }
                              }}
                            >
                              <EditIcon sx={{ mr: 1, fontSize: '1rem' }} />
                              Write My Own
                            </ToggleButton>
                            <ToggleButton 
                              value="random" 
                              aria-label="random prompt"
                              sx={{ 
                                px: 2,
                                borderRadius: 1,
                                backgroundColor: `${theme.palette.background.default}`,
                                '&.Mui-selected': {
                                  backgroundColor: `${theme.palette.secondary.main}`,
                                  color: theme.palette.primary.main,
                                  fontWeight: 'bold'
                                }
                              }}
                            >
                              <AutoFixHighIcon sx={{ mr: 1, fontSize: '1rem' }} />
                              Pick For Me
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Paper>
                      </Box>
                      
                      {!promptData.useRandomPrompt ? (
                        <TextField
                          fullWidth
                          size="small"
                          label="Describe your outfit & location"
                          name="prompt"
                          value={promptData.prompt}
                          onChange={handlePromptTextChange}
                          multiline
                          rows={4}
                          placeholder="Example: 'Me in a red dress walking in New York City"
                          required
                        />
                      ) : (
                        <Paper
                          elevation={0}
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            borderWidth: 2,
                            borderStyle: 'dashed',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 108, // Same height as the TextField with 3 rows
                            textAlign: 'center'
                          }}
                        >
                          <AutoFixHighIcon 
                            color="primary" 
                            sx={{ fontSize: 28, mb: 1 }}
                          />
                          <Typography 
                            variant="body1" 
                            color="primary.main"
                            sx={{ fontWeight: 500 }}
                          >
                            We'll create something for you with your model
                          </Typography>
                        </Paper>
                      )}
                      
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2">
                            Number of Images: {promptData.numberOfImages}
                          </Typography>
                          
                          {/* Show subscription tier limit info */}
                          <Chip
                            label={`${(subscription?.tier || 'free').charAt(0).toUpperCase() + (subscription?.tier || 'free').slice(1)}: ${getMaxImagesForTier()} max`}
                            size="small"
                            sx={{ 
                              fontWeight: 500
                            }}
                          />
                        </Box>
                        <Slider
                          value={promptData.numberOfImages}
                          onChange={handleSliderChange}
                          step={1}
                          marks
                          min={1}
                          max={4}
                          size="medium"
                          disabled={getMaxImagesForTier() === 0}
                        />
                        
                        {getMaxImagesForTier() === 0 && (
                          <Typography variant="caption" color="error.dark" sx={{ display: 'block', mt: 1 }}>
                            Upgrade your subscription to generate images
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Clothing Upload - Simplified */}
                      <Box sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="subtitle1">Try On Item (Optional)</Typography>
                        <DragDropArea 
                          onDrop={(files) => {
                            if (files.length > 0) {
                              handleClothingFileChange(files[0]);
                            }
                          }}
                          isClothing
                        >
                          {clothingUrl ? (
                            <Box sx={{ width: '100%' }}>
                              <Paper 
                                elevation={0}
                                sx={{ 
                                  p: 1, 
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  position: 'relative',
                                  overflow: 'hidden'
                                }}
                              >
                                <Box sx={{ p:1, position: 'relative', width: '100%', height: 200, display: 'flex', justifyContent: 'center' }}>
                                  <img 
                                    src={clothingUrl} 
                                    alt="Clothing reference" 
                                    style={{ 
                                      maxWidth: '100%',
                                      maxHeight: '100%',
                                      objectFit: 'cover',
                                      borderRadius: 8,
                                    }} 
                                  />
                                </Box>
                                <Box sx={{ 
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                  <IconButton 
                                    onClick={() => handleClothingFileChange(null)}
                                    size="small"
                                    sx={{ 
                                      color: 'primary.main'
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Paper>
                            </Box>
                          ) : (
                            <Button
                              variant="outlined"
                              component="label"
                              disabled={isGeneratingImages || isExecutingGenerating}
                              startIcon={<CloudUploadIcon />}
                              sx={{ mt: 1, width: '100%' }}
                              fullWidth
                            >
                              Upload Clothing
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleClothingFileChange(e.target.files ? e.target.files[0] : null)}
                              />
                            </Button>
                          )}
                        </DragDropArea>
                      </Box>
                      
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ height: 48 }}
                        disabled={(!promptData.prompt && !promptData.useRandomPrompt) || !promptData.modelId || getMaxImagesForTier() === 0 || isGeneratingImages || isExecutingGenerating}
                        onClick={handleGenerateImages}
                      >
                        {isGeneratingImages || isExecutingGenerating ? 'Images Currently Generating...' :
                          getMaxImagesForTier() === 0 ? 'Upgrade to Generate Images' : 
                          `Generate ${promptData.numberOfImages} Image${promptData.numberOfImages > 1 ? 's' : ''}`}
                      </Button>

                      {getMaxImagesForTier() < 4 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ fontSize: 16, mr: 1.5, color: 'gold' }} />
                            Upgrade to Premium to generate up to 4 images at a time
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </Collapse>
              </ListItem>
            </List>
            
            <Box sx={{ mt: 'auto', p: 2 }}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Pro Tip
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  For best results, use high-quality photos with neutral expressions and clear lighting.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 3, 
              width: '100%', 
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 3, sm: 4 }
            }}
          >
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              {children}
            </Box>
          </Box>
        </Main>
        
        {/* Loading indicator */}
        {isModelUploading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
            }}
          >
            <Paper 
              elevation={6}
              sx={{ 
                py: 4, 
                px: 5, 
                maxWidth: 450, 
                width: '90%', 
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}
            >
              {/* Main loading spinner */}
              <CircularProgress size={60} />
              
              <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                {isCompressing ? 'Processing Your Images' : 
                 isUploading ? 'Uploading Your Model' : 
                 'Initializing...'}
              </Typography>
                
              {/* Status description */}
              <Typography variant="body2" color="text.secondary" align="center">
                {isCompressing ? 'Converting and optimizing your photos.' : 
                 isUploading ? 'Uploading photos to secure storage.' : 
                 'Getting things ready...'}
              </Typography>
              
              {/* Compression progress */}
              {isCompressing && (
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Processing</Typography>
                    <Typography variant="body2" color="primary" fontWeight={600}>{compressionProgress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={compressionProgress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #9370DB, #9370DB)'
                      }
                    }} 
                  />
                </Box>
              )}
              
              {/* Upload progress */}
              {isUploading && (
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Uploading</Typography>
                    <Typography variant="body2" color="primary" fontWeight={600}>{uploadProgress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #9370DB, #9370DB)'
                      }
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    align="center" 
                    sx={{ 
                      display: 'block', 
                      mt: 2,
                      fontStyle: 'italic'
                    }}
                  >
                    Please keep this window open until the upload completes
                  </Typography>
                </Box>
              )}
              
              {/* Tips section */}
              <Box 
                sx={{ 
                  mt: 2, 
                  pt: 2, 
                  borderTop: '1px solid', 
                  borderColor: 'divider',
                  width: '100%'
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  <b>While you wait:</b> After your model is trained, you'll be able to try generating images and try on any cloths of your liking!
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
        
        {/* Image Generation Popup */}
        {!isGeneratingImages && isExecutingGenerating && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
            }}
          >
            <Paper 
              elevation={6}
              sx={{ 
                py: 4, 
                px: 5, 
                maxWidth: 450, 
                width: '90%', 
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
              }}
            >
              {/* Animation spinner */}
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress size={70} thickness={3} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AutoFixHighIcon sx={{ fontSize: 30, color: 'primary.main' }} />
                </Box>
              </Box>
              
              <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                Generating Your Images
              </Typography>
                
              <Typography variant="body1" color="text.secondary" align="center">
                Your images are being created and will appear momentarily
              </Typography>
              
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
                <LinearProgress 
                  sx={{ 
                    width: '70%',
                    height: 6, 
                    borderRadius: 3,
                  }}
                />
              </Box>
              
              <Box 
                sx={{ 
                  mt: 3, 
                  pt: 2, 
                  borderTop: '1px solid', 
                  borderColor: 'divider',
                  width: '100%'
                }}
              >
                <Typography variant="body2" color="text.secondary" align="center">
                  <b>AI Styling in Progress:</b> Our AI is styling your model in the outfit you described. Images will appear in your gallery when ready.
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
        
        {/* Notification */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            mt: 7,
            [theme.breakpoints.up('md')]: {
              ...(open && {
                marginLeft: `${drawerWidth/2}px`
              })
            }
          }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
        
        {/* Subscription Upgrade Popup */}
        <UpgradePopup
          open={upgradePopup.open}
          type={upgradePopup.type}
          message={upgradePopup.message}
          isPremiumTier={isPremiumTier}
          onClose={handleUpgradePopupClose}
          onTopUp={handleTopUp}
          onUpgrade={handleUpgrade}
        />
        
        {/* Training Progress Indicator */}
        {lastMessage && lastMessage.type === 'model_training_update' && lastMessage.status === 'in_progress' && lastMessage.progress && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" gutterBottom>
              Training Model: {(lastMessage as TrainingUpdate).modelId}
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 400, mb: 1 }}>
              <LinearProgress variant="determinate" value={lastMessage.progress} 
                sx={{ height: 10, borderRadius: 5 }} 
              />
            </Box>
            <Typography variant="caption">
              Progress: {lastMessage.progress}%
            </Typography>
          </Box>
        )}
      </Box>
    </LayoutContext.Provider>
  );
};

export default Layout; 
