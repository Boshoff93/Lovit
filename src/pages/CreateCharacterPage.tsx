import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import { charactersApi } from '../services/api';

// Character kind options
const characterKindOptions = [
  { id: 'Human', label: 'Human', image: '/characters/human.jpeg' },
  { id: 'Non-Human', label: 'Non-Human', image: '/characters/dog.jpeg' },
  { id: 'Product', label: 'Product', image: '/characters/product.jpeg' },
  { id: 'Place', label: 'Place / Airbnb', image: '/characters/house.jpeg' },
];

// Gender options
const genderOptions = [
  { id: 'Male', label: 'Male', image: '/characters/male.jpeg' },
  { id: 'Female', label: 'Female', image: '/characters/female.jpeg' },
];

// Age options
const ageOptions = [
  { id: 'Baby', label: 'Baby (0-2)' },
  { id: 'Toddler', label: 'Toddler (2-4)' },
  { id: 'Child', label: 'Child (5-12)' },
  { id: 'Teen', label: 'Teen (13-19)' },
  { id: 'Young Adult', label: 'Young Adult (20-35)' },
  { id: 'Adult', label: 'Adult (35-55)' },
  { id: 'Senior', label: 'Senior (55+)' },
];

// Hair color options with images
const hairColorOptions = [
  { id: 'Black', label: 'Black', image: '/hair/short_black.jpeg' },
  { id: 'Dark Brown', label: 'Dark Brown', image: '/hair/short_brown.jpeg' },
  { id: 'Light Brown', label: 'Light Brown', image: '/hair/short_light_brown.jpeg' },
  { id: 'Blonde', label: 'Blonde', image: '/hair/short_blonde.jpeg' },
  { id: 'Strawberry Blonde', label: 'Strawberry Blonde', image: '/hair/short_strawberry_blonde.jpeg' },
  { id: 'Red', label: 'Red / Orange', image: '/hair/short_red.jpeg' },
  { id: 'Grey', label: 'Grey', image: '/hair/short_grey.jpeg' },
  { id: 'White', label: 'White', image: '/hair/short_white.jpeg' },
];

// Hair length options - images will be dynamically generated based on selected color
const hairLengthOptions = [
  { id: 'Short', label: 'Short' },
  { id: 'Medium', label: 'Medium' },
  { id: 'Long', label: 'Long' },
  { id: 'Very Long', label: 'Very Long' },
  { id: 'Bald', label: 'Bald' },
];

// Helper to get hair length image based on color and length
const getHairLengthImage = (length: string, color: string): string => {
  if (length === 'Bald') return '/hair/bald.jpeg';
  
  // Map color to filename
  const colorMap: Record<string, string> = {
    'Black': 'black',
    'Dark Brown': 'brown',
    'Light Brown': 'light_brown',
    'Blonde': 'blonde',
    'Strawberry Blonde': 'strawberry_blonde',
    'Red': 'red',
    'Grey': 'grey',
    'White': 'white',
  };
  
  // Map length to prefix
  const lengthMap: Record<string, string> = {
    'Short': 'short',
    'Medium': 'medium',
    'Long': 'long',
    'Very Long': 'very_long',
  };
  
  const colorSlug = colorMap[color] || 'brown';
  const lengthSlug = lengthMap[length] || 'medium';
  
  return `/hair/${lengthSlug}_${colorSlug}.jpeg`;
};

// Eye color options with images
const eyeColorOptions = [
  { id: 'Brown', label: 'Brown', image: '/eyes/brown.jpg' },
  { id: 'Blue', label: 'Blue', image: '/eyes/blue.jpg' },
  { id: 'Green', label: 'Green', image: '/eyes/green.jpg' },
  { id: 'Hazel', label: 'Hazel', image: '/eyes/hazel.jpg' },
  { id: 'Grey', label: 'Grey', image: '/eyes/grey.jpg' },
];

const MAX_CHARACTER_IMAGES = 5;

const CreateCharacterPage: React.FC = () => {
  const navigate = useNavigate();
  const { characterId } = useParams<{ characterId?: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit mode state
  const isEditMode = !!characterId;
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(false);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imagesChanged, setImagesChanged] = useState(false);

  // Character state
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [characterKind, setCharacterKind] = useState('Human');
  const [characterGender, setCharacterGender] = useState('Male');
  const [characterAge, setCharacterAge] = useState('Child');
  const [characterHairColor, setCharacterHairColor] = useState('Dark Brown');
  const [characterHairLength, setCharacterHairLength] = useState('Medium');
  const [characterEyeColor, setCharacterEyeColor] = useState('Brown');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const [showCharacterNameError, setShowCharacterNameError] = useState(false);

  // Drawer states for action sheets
  const [agePickerOpen, setAgePickerOpen] = useState(false);
  const [hairColorPickerOpen, setHairColorPickerOpen] = useState(false);
  const [hairLengthPickerOpen, setHairLengthPickerOpen] = useState(false);
  const [eyeColorPickerOpen, setEyeColorPickerOpen] = useState(false);
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Fetch character data in edit mode
  const fetchCharacter = useCallback(async () => {
    if (!isEditMode || !user?.userId || !characterId) return;
    
    setIsLoadingCharacter(true);
    try {
      const response = await charactersApi.getUserCharacters(user.userId);
      const characters = response.data.characters || [];
      const character = characters.find((c: any) => c.characterId === characterId);
      
      if (character) {
        setCharacterName(character.characterName || '');
        setCharacterGender(character.gender || 'Male');
        setCharacterAge(character.age || 'Child');
        setExistingImageUrls(character.imageUrls || []);
        
        // Parse the description to extract user-written description vs auto-generated traits
        const desc = character.description || '';
        
        // Check for character kind
        if (desc.includes('Place')) {
          setCharacterKind('Place');
        } else if (desc.includes('Product')) {
          setCharacterKind('Product');
        } else if (desc.includes('Non-Human')) {
          setCharacterKind('Non-Human');
        }
        
        // Extract hair color/length/eye color if present in description
        const hairColorMatch = desc.match(/Hair: ([^,]+),/);
        if (hairColorMatch) setCharacterHairColor(hairColorMatch[1]);
        const hairLengthMatch = desc.match(/Hair: [^,]+, ([^.]+)/);
        if (hairLengthMatch) setCharacterHairLength(hairLengthMatch[1]);
        const eyeColorMatch = desc.match(/Eyes: ([^.]+)/);
        if (eyeColorMatch) setCharacterEyeColor(eyeColorMatch[1]);
        
        // Extract only the user-written description (the part before the auto-generated traits)
        // The auto-generated part starts with "Human," or "Non-Human,"
        const userDescParts = desc.split(/\.\s*(Human|Non-Human),/);
        if (userDescParts.length > 1 && userDescParts[0].trim()) {
          setCharacterDescription(userDescParts[0].trim());
        } else if (!desc.match(/^(Human|Non-Human),/)) {
          // If description doesn't start with auto-generated traits, it might be all user content
          // But check if it contains any auto-generated patterns
          const cleanDesc = desc
            .replace(/\.\s*(Human|Non-Human), (Male|Female), [^.]+\./g, '')
            .replace(/\.\s*Hair: [^.]+\./g, '')
            .replace(/\.\s*Eyes: [^.]+/g, '')
            .trim();
          setCharacterDescription(cleanDesc || '');
        } else {
          // Description is all auto-generated, leave description empty
          setCharacterDescription('');
        }
      }
    } catch (error) {
      console.error('Error fetching character:', error);
      setNotification({
        open: true,
        message: 'Failed to load character',
        severity: 'error'
      });
    } finally {
      setIsLoadingCharacter(false);
    }
  }, [isEditMode, user?.userId, characterId]);

  useEffect(() => {
    fetchCharacter();
  }, [fetchCharacter]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
      setUploadedImages(prev => [...prev, ...imageFiles].slice(0, MAX_CHARACTER_IMAGES));
      setImagesChanged(true);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagesChanged(true);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    setImagesChanged(true);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        setUploadedImages(prev => [...prev, ...imageFiles].slice(0, MAX_CHARACTER_IMAGES));
        setImagesChanged(true);
      } else {
        setNotification({
          open: true,
          message: 'Please drop image files only',
          severity: 'warning'
        });
      }
    }
  };

  const handleCreateCharacter = async () => {
    if (!characterName.trim()) {
      setShowCharacterNameError(true);
      setNotification({
        open: true,
        message: 'Please enter a character name',
        severity: 'error'
      });
      return;
    }

    if (!user?.userId) {
      setNotification({
        open: true,
        message: 'Please log in to create characters.',
        severity: 'error'
      });
      return;
    }

    setIsCreatingCharacter(true);
    try {
      // Convert uploaded images to base64 (if any)
      const imageBase64Array: string[] = uploadedImages.length > 0
        ? await Promise.all(
            uploadedImages.map((file) => {
              return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });
            })
          )
        : [];

      // Build description from character attributes
      // Product and Place types don't have age, gender, hair, eye color
      const isProductOrPlace = characterKind === 'Product' || characterKind === 'Place';
      const fullDescription = isProductOrPlace
        ? [
            characterDescription,
            characterKind, // "Product" or "Place"
          ].filter(Boolean).join('. ')
        : [
            characterDescription,
            `${characterKind}, ${characterGender}, ${characterAge}`,
            `Hair: ${characterHairColor}, ${characterHairLength}`,
            `Eyes: ${characterEyeColor}`,
          ].filter(Boolean).join('. ');

      if (isEditMode && characterId) {
        // Update existing character/product/place
        const response = await charactersApi.updateCharacter(user.userId, characterId, {
          characterName: characterName.trim(),
          characterType: characterKind as 'Human' | 'Non-Human' | 'Product' | 'Place',
          ...(isProductOrPlace ? {} : { gender: characterGender, age: characterAge }),
          description: fullDescription,
          ...(imagesChanged && { imageBase64Array }),
        });

        console.log('Character/Product update response:', response.data);

        const typeLabel = characterKind === 'Place' ? 'Place' : (characterKind === 'Product' ? 'Product' : 'Character');
        setNotification({
          open: true,
          message: `${typeLabel} "${characterName}" updated successfully!`,
          severity: 'success'
        });
      } else {
        // Create new character/product/place
        const response = await charactersApi.createCharacter({
          userId: user.userId,
          characterName: characterName.trim(),
          characterType: characterKind as 'Human' | 'Non-Human' | 'Product' | 'Place',
          ...(isProductOrPlace ? {} : { gender: characterGender, age: characterAge }),
          description: fullDescription,
          imageBase64Array,
        });

        console.log('Character/Product/Place creation response:', response.data);

        const typeLabel = characterKind === 'Place' ? 'Place' : (characterKind === 'Product' ? 'Product' : 'Character');
        setNotification({
          open: true,
          message: `${typeLabel} "${characterName}" created successfully!`,
          severity: 'success'
        });
      }

      // Navigate back to characters page after a short delay
      setTimeout(() => navigate('/characters'), 1500);
    } catch (error: any) {
      console.error('Character save error:', error);
      const errorMessage = error.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} character. Please try again.`;
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setIsCreatingCharacter(false);
    }
  };

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '100vh',
      pt: 4,
      pb: { xs: 4, sm: 8 },
      px: 0
    }}>
      <Container maxWidth="md" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%',
        p: 0
      }}>
        {/* Back Button */}
        <Box sx={{ width: '100%', mb: 2, px: { xs: 2, sm: 0 } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/characters')}
            sx={{
              color: '#007AFF',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(0,122,255,0.08)',
              },
            }}
          >
            Back to Characters & Products
          </Button>
        </Box>

        <Box sx={{ width: '100%', px: { xs: 2, sm: 0 } }}>
        {/* Name */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: showCharacterNameError && !characterName.trim() ? '1px solid rgba(255,59,48,0.5)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <PersonIcon sx={{ color: '#007AFF' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
              Name
            </Typography>
            <Chip label="Required" size="small" sx={{ ml: 1, background: 'rgba(255,59,48,0.1)', color: '#FF3B30', fontWeight: 600, fontSize: '0.7rem' }} />
          </Box>
          <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
            Give your character or product a unique name to reference in songs and videos
          </Typography>
          <TextField
            fullWidth
            value={characterName}
            onChange={(e) => {
              setCharacterName(e.target.value);
              if (e.target.value.trim()) setShowCharacterNameError(false);
            }}
            placeholder="e.g., Luna, Max, Aria, Cool Sneakers"
            error={showCharacterNameError && !characterName.trim()}
            helperText={showCharacterNameError && !characterName.trim() ? 'Please enter a character name' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: '#fff',
              },
            }}
          />
        </Paper>

        {/* Type */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
            Type
          </Typography>
          <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
            Human, non-human (animals, fantasy creatures), or product
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {characterKindOptions.map((kind) => {
              const isSelected = characterKind === kind.id;
              return (
                <Box
                  key={kind.id}
                  onClick={() => setCharacterKind(kind.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    borderRadius: '100px',
                    background: isSelected ? 'rgba(0,122,255,0.1)' : 'rgba(0,0,0,0.03)',
                    border: isSelected ? '2px solid #007AFF' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { background: isSelected ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.06)' },
                  }}
                >
                  <Box 
                    component="img" 
                    src={kind.image} 
                    alt={kind.label} 
                    sx={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: '50%', 
                      objectFit: 'cover',
                    }} 
                  />
                  <Typography sx={{ 
                    fontWeight: isSelected ? 600 : 500, 
                    color: isSelected ? '#007AFF' : '#1D1D1F',
                    fontSize: '0.9rem',
                  }}>
                    {kind.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Gender - Only for Human and Non-Human */}
        {characterKind !== 'Product' && characterKind !== 'Place' && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Gender
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Select the gender identity for your character
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {genderOptions.map((gender) => {
                const isSelected = characterGender === gender.id;
                return (
                  <Box
                    key={gender.id}
                    onClick={() => setCharacterGender(gender.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 2,
                      py: 1.5,
                      borderRadius: '100px',
                      background: isSelected ? 'rgba(0,122,255,0.1)' : 'rgba(0,0,0,0.03)',
                      border: isSelected ? '2px solid #007AFF' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': { background: isSelected ? 'rgba(0,122,255,0.15)' : 'rgba(0,0,0,0.06)' },
                    }}
                  >
                    <Box 
                      component="img" 
                      src={gender.image} 
                      alt={gender.label} 
                      sx={{ 
                        width: 28, 
                        height: 28, 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                      }} 
                    />
                    <Typography sx={{ 
                      fontWeight: isSelected ? 600 : 500, 
                      color: isSelected ? '#007AFF' : '#1D1D1F',
                      fontSize: '0.9rem',
                    }}>
                      {gender.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        )}

        {/* Hair Length - Only for humans */}
        {characterKind === 'Human' && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Hair Length
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Select the hair length style for your character
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setHairLengthPickerOpen(true)}
              sx={{
                justifyContent: 'space-between',
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                borderColor: 'rgba(0,0,0,0.15)',
                color: '#1D1D1F',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.04)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box component="img" src={getHairLengthImage(characterHairLength, characterHairColor)} alt={characterHairLength} sx={{ width: 32, height: 32, borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
                {hairLengthOptions.find(h => h.id === characterHairLength)?.label}
              </Box>
              <KeyboardArrowDownIcon sx={{ color: '#007AFF', ml: 1 }} />
            </Button>
          </Paper>
        )}

        {/* Hair Color - Only for humans with hair (not bald) */}
        {characterKind === 'Human' && characterHairLength !== 'Bald' && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Hair Color
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Choose the hair color for your character
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setHairColorPickerOpen(true)}
              sx={{
                justifyContent: 'space-between',
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                borderColor: 'rgba(0,0,0,0.15)',
                color: '#1D1D1F',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.04)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box component="img" src={hairColorOptions.find(h => h.id === characterHairColor)?.image} alt={characterHairColor} sx={{ width: 32, height: 32, borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
                {hairColorOptions.find(h => h.id === characterHairColor)?.label}
              </Box>
              <KeyboardArrowDownIcon sx={{ color: '#007AFF', ml: 1 }} />
            </Button>
          </Paper>
        )}

        {/* Eye Color - Only for Human and Non-Human */}
        {characterKind !== 'Product' && characterKind !== 'Place' && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Eye Color
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Pick the eye color for your character
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setEyeColorPickerOpen(true)}
              sx={{
                justifyContent: 'space-between',
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                borderColor: 'rgba(0,0,0,0.15)',
                color: '#1D1D1F',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.04)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box component="img" src={eyeColorOptions.find(e => e.id === characterEyeColor)?.image} alt={characterEyeColor} sx={{ width: 32, height: 32, borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }} />
                {eyeColorOptions.find(e => e.id === characterEyeColor)?.label}
              </Box>
              <KeyboardArrowDownIcon sx={{ color: '#007AFF', ml: 1 }} />
            </Button>
          </Paper>
        )}

        {/* Age - Only for Human and Non-Human */}
        {characterKind !== 'Product' && characterKind !== 'Place' && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
              Age
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
              Select the age range for your character
            </Typography>
            <Button
              fullWidth
              variant="outlined"
            onClick={() => setAgePickerOpen(true)}
            sx={{
              justifyContent: 'space-between',
              py: 1.5,
              px: 2,
              borderRadius: '12px',
              borderColor: 'rgba(0,0,0,0.15)',
              color: '#1D1D1F',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { borderColor: '#007AFF', background: 'rgba(0,122,255,0.04)' },
            }}
          >
            {ageOptions.find(a => a.id === characterAge)?.label}
            <KeyboardArrowDownIcon sx={{ color: '#007AFF', ml: 1 }} />
            </Button>
          </Paper>
        )}

        {/* Reference Images */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
            Reference Images
          </Typography>
          <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
            Upload up to {MAX_CHARACTER_IMAGES} reference images for appearance in music videos
          </Typography>
          
          {/* Drag and drop area */}
          <Box
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              width: '100%',
              minHeight: 120,
              borderRadius: '12px',
              border: isDragging ? '2px dashed #007AFF' : '2px dashed rgba(0,0,0,0.15)',
              backgroundColor: isDragging ? 'rgba(0,122,255,0.05)' : 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0,122,255,0.02)',
              }
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 32, color: isDragging ? '#007AFF' : '#86868B', mb: 1 }} />
            <Typography sx={{ color: isDragging ? '#007AFF' : '#1D1D1F', fontWeight: 500 }}>
              {isDragging ? 'Drop images here' : 'Drag & drop or click to upload'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#86868B', mt: 0.5 }}>
              {existingImageUrls.length + uploadedImages.length}/{MAX_CHARACTER_IMAGES} images
            </Typography>
            <input
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </Box>
          
          {/* Existing images (in edit mode) */}
          {existingImageUrls.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 1, fontSize: '0.8rem' }}>
                Current images:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                {existingImageUrls.map((url, index) => (
                  <Box key={`existing-${index}`} sx={{ position: 'relative', width: 70, height: 70 }}>
                    <img 
                      src={url} 
                      alt={`Existing ${index}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(255,255,255,0.9)', '&:hover': { backgroundColor: '#fff' }, p: 0.5 }}
                      onClick={(e) => { e.stopPropagation(); handleRemoveExistingImage(index); }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: '#FF3B30' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Newly uploaded images */}
          {uploadedImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#86868B', mb: 1, fontSize: '0.8rem' }}>
                New images to upload:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                {uploadedImages.map((image, index) => (
                  <Box key={index} sx={{ position: 'relative', width: 70, height: 70 }}>
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`Upload ${index}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(255,255,255,0.9)', '&:hover': { backgroundColor: '#fff' }, p: 0.5 }}
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: '#FF3B30' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Description */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
            Description (Optional)
          </Typography>
          <Typography variant="body2" sx={{ color: '#86868B', mb: 2, fontSize: '0.85rem' }}>
            Add extra details about personality, appearance, features, or traits
          </Typography>
          <TextField
            fullWidth
            value={characterDescription}
            onChange={(e) => setCharacterDescription(e.target.value)}
            multiline
            rows={3}
            placeholder={
              characterKind === 'Place' 
                ? "e.g., Modern beach house with infinity pool, ocean views, open-plan living" 
                : characterKind === 'Product' 
                  ? "e.g., Sleek red sneakers with white soles, premium leather material" 
                  : "e.g., A cheerful girl who loves adventures, always wears a red scarf"
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                background: '#fff',
              },
            }}
          />
        </Paper>

        {/* Create/Update Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleCreateCharacter}
          disabled={isCreatingCharacter || isLoadingCharacter}
          sx={{
            py: 2,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
            boxShadow: '0 8px 24px rgba(0,122,255,0.3)',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1.1rem',
            '&:hover': { boxShadow: '0 12px 32px rgba(0,122,255,0.4)' },
            '&.Mui-disabled': { background: 'rgba(0,0,0,0.1)' },
          }}
        >
          {isCreatingCharacter ? (
            <CircularProgress size={24} sx={{ color: '#fff' }} />
          ) : (
            <>
              <PersonIcon sx={{ mr: 1 }} />
              {isEditMode 
                ? `Update ${characterKind === 'Place' ? 'Place' : (characterKind === 'Product' ? 'Product' : 'Character')}` 
                : `Create ${characterKind === 'Place' ? 'Place' : (characterKind === 'Product' ? 'Product' : 'Character')}`}
            </>
          )}
        </Button>

        {/* Action Sheets / Bottom Drawers */}

        {/* Age Picker */}
        <Drawer
          anchor="bottom"
          open={agePickerOpen}
          onClose={() => setAgePickerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '70vh',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', textAlign: 'left' }}>
              Select Age
            </Typography>
          </Box>
          <List sx={{ px: 1, py: 1 }}>
            {ageOptions.map((age) => (
              <ListItem key={age.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setCharacterAge(age.id);
                    setAgePickerOpen(false);
                  }}
                  sx={{
                    borderRadius: '12px',
                    mb: 0.5,
                    py: 1.5,
                    background: characterAge === age.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                    border: characterAge === age.id ? '2px solid #007AFF' : '2px solid transparent',
                  }}
                >
                  <ListItemText primary={age.label} primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} />
                  {characterAge === age.id && <CheckIcon sx={{ color: '#007AFF' }} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={() => setAgePickerOpen(false)} 
              sx={{ 
                color: '#86868B', 
                borderColor: 'rgba(0,0,0,0.15)', 
                borderRadius: '12px',
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: 'rgba(0,0,0,0.3)',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Drawer>

        {/* Hair Color Picker */}
        <Drawer
          anchor="bottom"
          open={hairColorPickerOpen}
          onClose={() => setHairColorPickerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '70vh',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', textAlign: 'left' }}>
              Select Hair Color
            </Typography>
          </Box>
          <List sx={{ px: 1, py: 1 }}>
            {hairColorOptions.map((color) => (
              <ListItem key={color.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setCharacterHairColor(color.id);
                    setHairColorPickerOpen(false);
                  }}
                  sx={{
                    borderRadius: '12px',
                    mb: 0.5,
                    py: 1.5,
                    background: characterHairColor === color.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                    border: characterHairColor === color.id ? '2px solid #007AFF' : '2px solid transparent',
                  }}
                >
                  <ListItemIcon>
                    <Box component="img" src={color.image} alt={color.label} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.1)' }} />
                  </ListItemIcon>
                  <ListItemText primary={color.label} primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} />
                  {characterHairColor === color.id && <CheckIcon sx={{ color: '#007AFF' }} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={() => setHairColorPickerOpen(false)} 
              sx={{ 
                color: '#86868B', 
                borderColor: 'rgba(0,0,0,0.15)', 
                borderRadius: '12px',
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: 'rgba(0,0,0,0.3)',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Drawer>

        {/* Hair Length Picker */}
        <Drawer
          anchor="bottom"
          open={hairLengthPickerOpen}
          onClose={() => setHairLengthPickerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '70vh',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', textAlign: 'left' }}>
              Select Hair Length
            </Typography>
          </Box>
          <List sx={{ px: 1, py: 1 }}>
            {hairLengthOptions.map((length) => (
              <ListItem key={length.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setCharacterHairLength(length.id);
                    setHairLengthPickerOpen(false);
                  }}
                  sx={{
                    borderRadius: '12px',
                    mb: 0.5,
                    py: 1.5,
                    background: characterHairLength === length.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                    border: characterHairLength === length.id ? '2px solid #007AFF' : '2px solid transparent',
                  }}
                >
              
                    <ListItemIcon>
                      <Box component="img" src={getHairLengthImage(length.id, characterHairColor)} alt={length.label} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.1)' }} />
                    </ListItemIcon>
              
                  <ListItemText primary={length.label} primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} />
                  {characterHairLength === length.id && <CheckIcon sx={{ color: '#007AFF' }} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={() => setHairLengthPickerOpen(false)} 
              sx={{ 
                color: '#86868B', 
                borderColor: 'rgba(0,0,0,0.15)', 
                borderRadius: '12px',
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: 'rgba(0,0,0,0.3)',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Drawer>

        {/* Eye Color Picker */}
        <Drawer
          anchor="bottom"
          open={eyeColorPickerOpen}
          onClose={() => setEyeColorPickerOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '70vh',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.2)', mx: 'auto', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', textAlign: 'left' }}>
              Select Eye Color
            </Typography>
          </Box>
          <List sx={{ px: 1, py: 1 }}>
            {eyeColorOptions.map((color) => (
              <ListItem key={color.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setCharacterEyeColor(color.id);
                    setEyeColorPickerOpen(false);
                  }}
                  sx={{
                    borderRadius: '12px',
                    mb: 0.5,
                    py: 1.5,
                    background: characterEyeColor === color.id ? 'rgba(0,122,255,0.1)' : 'transparent',
                    border: characterEyeColor === color.id ? '2px solid #007AFF' : '2px solid transparent',
                  }}
                >
                  <ListItemIcon>
                    <Box component="img" src={color.image} alt={color.label} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(0,0,0,0.1)' }} />
                  </ListItemIcon>
                  <ListItemText primary={color.label} primaryTypographyProps={{ fontWeight: 600, color: '#1D1D1F' }} />
                  {characterEyeColor === color.id && <CheckIcon sx={{ color: '#007AFF' }} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ p: 2, pt: 1, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={() => setEyeColorPickerOpen(false)} 
              sx={{ 
                color: '#86868B', 
                borderColor: 'rgba(0,0,0,0.15)', 
                borderRadius: '12px',
                px: 4,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: 'rgba(0,0,0,0.3)',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </Drawer>
      </Box>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: 8 }}
        >
          <Alert
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.severity}
            sx={{ width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CreateCharacterPage;
