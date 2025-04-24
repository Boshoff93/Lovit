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
  FormControlLabel,
  Checkbox,
  Badge,
  Stack,
  useMediaQuery,
  Alert,
  Snackbar,
  CircularProgress,
  LinearProgress,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FaceIcon from '@mui/icons-material/Face';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CollectionsIcon from '@mui/icons-material/Collections';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate, useLocation } from 'react-router-dom';
import { PromptData } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logoutAllState } from '../store/actions';
import { useWebSocket } from '../contexts/WebSocketContext';
import { trainModel, selectModels } from '../store/modelsSlice';
import { AppDispatch } from '../store/store';
import { Model } from '../store/modelsSlice';

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

const API_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';
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
const ORIENTATION_OPTIONS = ['Portrait', 'Landscape', 'Square'];

interface LayoutProps {
  children: React.ReactNode;
}

const recentImages = [
  { id: 1, title: 'Beach Vacation Style', date: '2 mins ago' },
  { id: 2, title: 'Professional Office Look', date: '1 hour ago' },
  { id: 3, title: 'Evening Gown Red Carpet', date: 'Yesterday' },
  { id: 4, title: 'Casual Weekend Outfit', date: 'Last week' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);
  const { subscription } = useSelector((state: RootState) => state.auth);
  const models = useSelector(selectModels);
  
  // WebSocket integration
  const { lastMessage, trainingUpdates, connect } = useWebSocket();
  
  const [open, setOpen] = useState(true);
  const [modelOpen, setModelOpen] = useState(false);
  const [imagesOpen, setImagesOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
    const tier = (subscription?.tier || 'free').charAt(0).toUpperCase() + (subscription?.tier || 'free').slice(1);
    return TIER_IMAGE_LIMITS[tier as keyof typeof TIER_IMAGE_LIMITS] || 0;
  }, [subscription?.tier]);
  
  // Update notification when WebSocket receives a message
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'model_training_update') {
      // Set notification based on training status
      let severity: 'success' | 'error' | 'info' | 'warning' = 'info';
      let message = '';
      
      switch (lastMessage.status) {
        case 'WAITING':
          severity = 'info';
          message = `Model training queued - ${lastMessage.modelId}`;
          break;
        case 'IN_PROGRESS':
          severity = 'info';
          message = `Training in progress ${lastMessage.progress ? `- ${lastMessage.progress}%` : ''}`;
          break;
        case 'completed':
          severity = 'success';
          message = 'Model training completed successfully!';
          break;
        case 'FAILED':
        case 'failed':
          severity = 'error';
          message = 'Model training failed. Please try again.';
          break;
        default:
          severity = 'info';
          message = `Model status: ${lastMessage.status}`;
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
  
  // Add a ref for the Model Name TextField
  const modelNameRef = useRef<HTMLInputElement>(null);
  
  // Image upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  
  // Prompt creation state
  const [promptData, setPromptData] = useState<PromptData>({
    prompt: '',
    negativePrompt: '',
    orientation: 'Portrait',
    numberOfImages: 1,
    uploadedClothImage: null,
    seedNumber: '',
    useSeed: false,
    modelId: ''
  });
  
  const clothFileInputRef = useRef<HTMLInputElement>(null);
  const [clothPreviewUrl, setClothPreviewUrl] = useState<string | null>(null);

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

  const handleCheckboxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setPromptData(prev => ({
      ...prev,
      [name]: checked
    }));
  }, []);
  
  // Clothing image upload handlers
  const handleClothButtonClick = useCallback(() => {
    if (clothFileInputRef.current) {
      clothFileInputRef.current.click();
    }
  }, []);

  const handleClothFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setPromptData(prev => ({
        ...prev,
        uploadedClothImage: files[0]
      }));
      
      const previewUrl = URL.createObjectURL(files[0]);
      setClothPreviewUrl(previewUrl);
    }
  }, []);
  
  const handleClearCloth = useCallback(() => {
    setPromptData(prev => ({
      ...prev,
      uploadedClothImage: null
    }));
    setClothPreviewUrl(null);
    if (clothFileInputRef.current) {
      clothFileInputRef.current.value = '';
    }
  }, []);
  
  // Submit handlers
  const handleCreateModel = useCallback(async () => {
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

    setLoading(true);
    
    try {
      // Get auth token from Redux state instead of localStorage
      if (!token) {
        setNotification({
          open: true,
          message: 'Authentication required. Please log in again.',
          severity: 'error'
        });
        setLoading(false);
        return;
      }

      // Create form data with all images and profile data
      const formData = new FormData();
      uploadedImages.forEach(image => {
        formData.append('images', image);
      });
      formData.append('profileData', JSON.stringify(userProfile));

      // Use Redux action to train model
      const result = await dispatch(trainModel(formData)).unwrap();

      // Connect to WebSocket for this specific model
      if (result.modelId) {
        connect(result.modelId);
      }

      setNotification({
        open: true,
        message: `Model training started successfully! Model ID: ${result.modelId}`,
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
    } catch (error) {
      console.error('Error creating model:', error);
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [uploadedImages, userProfile, token, connect, navigate, isMobile, setOpen, setNotification, dispatch]);
  
  const handleGenerateImages = useCallback(() => {
    // Ensure we have a model selected
    if (!promptData.modelId) {
      setNotification({
        open: true,
        message: 'Please select a model to generate images',
        severity: 'error'
      });
      return;
    }
    
    // Check if user has appropriate tier
    const maxImages = getMaxImagesForTier();
    if (maxImages === 0) {
      setNotification({
        open: true,
        message: 'Please upgrade your subscription to generate images',
        severity: 'error'
      });
      return;
    }
    
    // Here you would normally send this data to your backend with modelId
    console.log('Generating images with:', {
      modelId: promptData.modelId,
      prompt: promptData.prompt,
      numberOfImages: promptData.numberOfImages,
      orientation: promptData.orientation,
      uploadedClothImage: promptData.uploadedClothImage ? 'yes' : 'no'
    });
    
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen, promptData, getMaxImagesForTier, setNotification]);

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

  return (
    <LayoutContext.Provider value={{ openModel }}>
      <Box sx={{ display: 'flex' }}>
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Lovit
            </Typography>
            {token && (
              <IconButton color="inherit" onClick={() => handleLogout()}>
                <LogoutIcon />
              </IconButton>
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
              boxShadow: '4px 0 10px rgba(0,0,0,0.05)',
            },
          }}
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <DrawerHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'left', width: '100%' }}>
                Lovit Hub
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
            <List sx={{ px: 1 }}>
              
              {/* Account Section */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ px: 2, borderRadius: 2, mb: 1 }}
                  onClick={() => handleNavigate('/account')}
                >
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Account" />
                </ListItemButton>
              </ListItem>
              
              {/* Dashboard Section */}
              <ListItem disablePadding>
                <ListItemButton 
                  sx={{ px: 2, borderRadius: 2, mb: 1 }}
                  onClick={() => handleNavigate('/dashboard')}
                >
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              
              {/* Models Section */}
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton 
                  sx={{ px: 2, borderRadius: 2, mb: 1 }}
                  onClick={handleModelClick}
                >
                  <ListItemIcon>
                    <FaceIcon />
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
                      
                      <FormControl fullWidth size="small">
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
                          backgroundColor: theme.palette.success.light + '10', 
                          borderColor: theme.palette.success.light
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
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
                          backgroundColor: theme.palette.error.light + '10', 
                          borderColor: theme.palette.error.light
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Bad Photos:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Low variety, group photos, other people, sunglasses, hats, face cutoff
                        </Typography>
                      </Paper>
                      
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      
                      <Button 
                        variant="outlined" 
                        startIcon={<CloudUploadIcon />}
                        onClick={handleFileButtonClick}
                        fullWidth
                        sx={{ height: 48 }}
                      >
                        Upload Photos • {uploadedCount} of {MIN_REQUIRED_IMAGES}-{MAX_ALLOWED_IMAGES} Required
                      </Button>
                      
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
                        disabled={loading || uploadedImages.length < MIN_REQUIRED_IMAGES || !userProfile.name || !userProfile.gender || !userProfile.age || !userProfile.height || 
                                  !userProfile.ethnicity || !userProfile.hairColor || !userProfile.hairStyle || 
                                  !userProfile.eyeColor || !userProfile.bodyType}
                        onClick={handleCreateModel}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Model'}
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
                  <ListItemIcon>
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
                            <MenuItem key={model.id} value={model.id}>
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
                    
                      <TextField
                        fullWidth
                        size="small"
                        label="Prompt"
                        name="prompt"
                        value={promptData.prompt}
                        onChange={handlePromptTextChange}
                        multiline
                        rows={2}
                        placeholder="Describe what you want to generate"
                        required
                      />
                      
                      <FormControl fullWidth size="small">
                        <InputLabel>Orientation</InputLabel>
                        <Select
                          name="orientation"
                          value={promptData.orientation}
                          label="Orientation"
                          onChange={handlePromptSelectChange}
                        >
                          {ORIENTATION_OPTIONS.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2">
                            Number of Images: {promptData.numberOfImages}
                          </Typography>
                          
                          {/* Show subscription tier limit info */}
                          <Chip
                            label={`${subscription?.tier || 'Free'}: ${getMaxImagesForTier()} max`}
                            size="small"
                            sx={{ 
                              backgroundColor: '#F5F5DC',
                              color: 'text.primary',
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
                          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                            Upgrade your subscription to generate images
                          </Typography>
                        )}
                      </Box>
                      
                      {/* Clothing Upload - Simplified */}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={clothFileInputRef}
                        onChange={handleClothFileChange}
                      />
                      
                      <Button 
                        variant="outlined" 
                        startIcon={<CloudUploadIcon />}
                        onClick={handleClothButtonClick}
                        size="small"
                        sx={{ height: 48 }}
                      >
                        Upload Clothing Reference
                      </Button>
                      
                      {clothPreviewUrl && (
                        <Box sx={{ position: 'relative', height: 100 }}>
                          <img 
                            src={clothPreviewUrl} 
                            alt="Clothing reference" 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%', 
                              objectFit: 'contain',
                              borderRadius: '4px'
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 0, 
                              right: 0,
                              backgroundColor: 'rgba(255,255,255,0.8)',
                              p: 0.5
                            }}
                            onClick={handleClearCloth}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                      
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ height: 48 }}
                        disabled={!promptData.prompt || !promptData.modelId || getMaxImagesForTier() === 0}
                        onClick={handleGenerateImages}
                      >
                        {getMaxImagesForTier() === 0 ? 'Upgrade to Generate Images' : 
                          `Generate ${promptData.numberOfImages} Image${promptData.numberOfImages > 1 ? 's' : ''}`}
                      </Button>

                      {getMaxImagesForTier() < 4 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ fontSize: 16, mr: 0.5, color: 'gold' }} />
                            Upgrade to Premium for up to 4 images at once
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
                  borderRadius: 2,
                  backgroundColor: theme.palette.primary.light + '10', 
                  borderColor: theme.palette.primary.light
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
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9999,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
        
        {/* Notification */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
        
        {/* Training Progress Indicator */}
        {lastMessage && lastMessage.status === 'IN_PROGRESS' && lastMessage.progress && (
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
              Training Model: {lastMessage.modelId}
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