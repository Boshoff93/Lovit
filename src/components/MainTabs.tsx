import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

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

interface Model {
  id: string;
  name: string;
  gender: string;
  bodyType: string;
  createdAt: string;
  imageUrl: string;
  status?: string;
  progress?: number;
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
    id: '1',
    name: 'Summer Model',
    gender: 'Female',
    bodyType: 'Athletic',
    createdAt: '2024-04-18T14:22:18Z',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=962&q=80'
  },
  {
    id: '2',
    name: 'Casual Style',
    gender: 'Male',
    bodyType: 'Average',
    createdAt: '2024-04-17T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1287&q=80'
  },
  {
    id: '3',
    name: 'Evening Elegance',
    gender: 'Female',
    bodyType: 'Slim',
    createdAt: '2024-04-16T18:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80'
  }
];

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

const MainTabs: React.FC = () => {
  // Set default tab to Gallery (index 1)
  const [value, setValue] = useState(0);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get auth token from Redux store
  const { token } = useSelector((state: RootState) => state.auth);
  
  // Get training updates from WebSocket context
  const { trainingUpdates, connect } = useWebSocket();

  // Fetch models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://api.trylovit.com'}/api/models`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setModels(data.models || []);
          
          // Connect to WebSocket for each model
          data.models.forEach((model: Model) => {
            if (model.status === 'IN_PROGRESS' || model.status === 'WAITING') {
              connect(model.id);
            }
          });
        } else {
          console.error('Failed to fetch models');
          // Fallback to mock data in development
          if (process.env.NODE_ENV === 'development') {
            setModels(mockModels);
          }
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // Fallback to mock data in development
        if (process.env.NODE_ENV === 'development') {
          setModels(mockModels);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchModels();
    } else {
      // If no token, use mock data in development
      if (process.env.NODE_ENV === 'development') {
        setModels(mockModels);
        setLoading(false);
      }
    }
  }, [token, connect]);

  // Update models when training updates are received
  useEffect(() => {
    if (Object.keys(trainingUpdates).length > 0) {
      setModels(prevModels => 
        prevModels.map(model => {
          const updates = trainingUpdates[model.id];
          if (updates && updates.length > 0) {
            // Get the latest update
            const latestUpdate = updates[updates.length - 1];
            return {
              ...model,
              status: latestUpdate.status,
              progress: latestUpdate.progress
            };
          }
          return model;
        })
      );
    }
  }, [trainingUpdates]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Helper function to render status chip based on training status
  const renderStatusChip = (status?: string) => {
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
  };

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
          {loading ? (
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
                onClick={() => window.location.href = '/dashboard'}
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
                    height="240"
                    image={model.imageUrl}
                    alt={model.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="div">
                        {model.name}
                      </Typography>
                      {renderStatusChip(model.status)}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {model.gender} • {model.bodyType}
                    </Typography>
                    
                    {/* Show progress bar for in-progress models */}
                    {model.status === 'IN_PROGRESS' && model.progress && (
                      <Box sx={{ mt: 1.5, mb: 0.5 }}>
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
                    
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Created on {new Date(model.createdAt).toLocaleDateString()}
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
        
        {mockImageGroups.map((group) => (
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
                      alt={image.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{image.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(image.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </TabPanel>
    </Box>
  );
};

export default MainTabs;