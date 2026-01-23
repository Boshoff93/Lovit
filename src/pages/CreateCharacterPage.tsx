import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import PetsIcon from '@mui/icons-material/Pets';
import InventoryIcon from '@mui/icons-material/Inventory';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import BusinessIcon from '@mui/icons-material/Business';
import { charactersApi, Character } from '../services/api';
import { useGetUserCharactersQuery } from '../store/apiSlice';
import { useLayout } from '../components/Layout';
import StyledDropdown, { DropdownOption } from '../components/StyledDropdown';

// Character kind options for dropdown with icons and colors (matching dashboard gradient style)
const characterKindOptions: DropdownOption[] = [
  { id: 'Human', label: 'Human', icon: <PersonIcon sx={{ fontSize: 18 }} />, iconBg: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' },
  { id: 'Non-Human', label: 'Non-Human', icon: <PetsIcon sx={{ fontSize: 18 }} />, iconBg: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)' },
  { id: 'Product', label: 'Product', icon: <InventoryIcon sx={{ fontSize: 18 }} />, iconBg: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' },
  { id: 'Place', label: 'Place / Airbnb', icon: <HomeIcon sx={{ fontSize: 18 }} />, iconBg: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)' },
  { id: 'App', label: 'Software & Apps', icon: <PhoneIphoneIcon sx={{ fontSize: 18 }} />, iconBg: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' },
  { id: 'Business', label: 'Business', icon: <BusinessIcon sx={{ fontSize: 18 }} />, iconBg: 'linear-gradient(135deg, #EAB308 0%, #FACC15 100%)' },
];

// Character type icons mapping
const characterTypeIcons: Record<string, React.ReactNode> = {
  'Human': <PersonIcon sx={{ fontSize: 20 }} />,
  'Non-Human': <PetsIcon sx={{ fontSize: 20 }} />,
  'Product': <InventoryIcon sx={{ fontSize: 20 }} />,
  'Place': <HomeIcon sx={{ fontSize: 20 }} />,
  'App': <PhoneIphoneIcon sx={{ fontSize: 20 }} />,
  'Business': <BusinessIcon sx={{ fontSize: 20 }} />,
};

// Gender options
const genderOptions: DropdownOption[] = [
  { id: 'Male', label: 'Male' },
  { id: 'Female', label: 'Female' },
];

// Age options
const ageOptions: DropdownOption[] = [
  { id: 'Baby', label: 'Baby (0-2)' },
  { id: 'Toddler', label: 'Toddler (2-4)' },
  { id: 'Child', label: 'Child (5-12)' },
  { id: 'Teen', label: 'Teen (13-19)' },
  { id: 'Young Adult', label: 'Young Adult (20-35)' },
  { id: 'Adult', label: 'Adult (35-55)' },
  { id: 'Senior', label: 'Senior (55+)' },
];

// Hair color to file name mapping
const hairColorFileMap: Record<string, string> = {
  'Black': 'black',
  'Dark Brown': 'brown',
  'Light Brown': 'light_brown',
  'Blonde': 'blonde',
  'Strawberry Blonde': 'strawberry_blonde',
  'Red': 'red',
  'Grey': 'grey',
  'White': 'white',
};

// Hair length to file prefix mapping
const hairLengthPrefixMap: Record<string, string> = {
  'Short': 'short',
  'Medium': 'medium',
  'Long': 'long',
  'Very Long': 'very_long',
  'Bald': 'bald',
};

// Function to get hair color options based on selected hair length
const getHairColorOptions = (hairLength: string): DropdownOption[] => {
  const prefix = hairLengthPrefixMap[hairLength] || 'medium';
  return [
    { id: 'Black', label: 'Black', image: `/hair/${prefix}_black.jpeg` },
    { id: 'Dark Brown', label: 'Dark Brown', image: `/hair/${prefix}_brown.jpeg` },
    { id: 'Light Brown', label: 'Light Brown', image: `/hair/${prefix}_light_brown.jpeg` },
    { id: 'Blonde', label: 'Blonde', image: `/hair/${prefix}_blonde.jpeg` },
    { id: 'Strawberry Blonde', label: 'Strawberry Blonde', image: `/hair/${prefix}_strawberry_blonde.jpeg` },
    { id: 'Red', label: 'Red / Orange', image: `/hair/${prefix}_red.jpeg` },
    { id: 'Grey', label: 'Grey', image: `/hair/${prefix}_grey.jpeg` },
    { id: 'White', label: 'White', image: `/hair/${prefix}_white.jpeg` },
  ];
};

// Function to get hair length options based on selected hair color
const getHairLengthOptions = (hairColor: string): DropdownOption[] => {
  const colorFile = hairColorFileMap[hairColor] || 'brown';
  return [
    { id: 'Short', label: 'Short', image: `/hair/short_${colorFile}.jpeg` },
    { id: 'Medium', label: 'Medium', image: `/hair/medium_${colorFile}.jpeg` },
    { id: 'Long', label: 'Long', image: `/hair/long_${colorFile}.jpeg` },
    { id: 'Very Long', label: 'Very Long', image: `/hair/very_long_${colorFile}.jpeg` },
    { id: 'Bald', label: 'Bald', image: '/hair/bald.jpeg' },
  ];
};

// Eye color options with images
const eyeColorOptions: DropdownOption[] = [
  { id: 'Brown', label: 'Brown', image: '/eyes/brown.jpg' },
  { id: 'Blue', label: 'Blue', image: '/eyes/blue.jpg' },
  { id: 'Green', label: 'Green', image: '/eyes/green.jpg' },
  { id: 'Hazel', label: 'Hazel', image: '/eyes/hazel.jpg' },
  { id: 'Grey', label: 'Grey', image: '/eyes/grey.jpg' },
];

// Max images: 20 for Places (property photos), 10 for others
const MAX_IMAGES_PLACE = 20;
const MAX_IMAGES_DEFAULT = 10;

// Compress image before upload to reduce bandwidth and storage
// Returns a base64 data URL
const compressImage = (file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const CreateCharacterPage: React.FC = () => {
  const navigate = useNavigate();
  const { characterId } = useParams<{ characterId?: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { setCurrentViewingItem } = useLayout();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit mode state
  const isEditMode = !!characterId;
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imagesChanged, setImagesChanged] = useState(false);
  const [formPopulated, setFormPopulated] = useState(false);

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

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // RTK Query for characters (used in edit mode to find the character)
  const charactersQuery = useGetUserCharactersQuery(
    { userId: user?.userId || '' },
    { skip: !isEditMode || !user?.userId }
  );
  const isLoadingCharacter = charactersQuery.isLoading;

  // Find the character being edited from cached data
  const editingCharacter = useMemo(() => {
    if (!isEditMode || !characterId || !charactersQuery.data?.characters) return null;
    return charactersQuery.data.characters.find((c: Character) => c.characterId === characterId);
  }, [isEditMode, characterId, charactersQuery.data?.characters]);

  // Populate form fields when character data is available (edit mode)
  useEffect(() => {
    if (!editingCharacter || formPopulated) return;

    setCharacterName(editingCharacter.characterName || '');
    setCharacterGender(editingCharacter.gender || 'Male');
    setCharacterAge(editingCharacter.age || 'Child');
    setExistingImageUrls(editingCharacter.imageUrls || []);

    // Parse the description to extract user-written description vs auto-generated traits
    const desc = editingCharacter.description || '';

    // Check for character kind
    if (desc.includes('Place')) {
      setCharacterKind('Place');
    } else if (desc.includes('App')) {
      setCharacterKind('App');
    } else if (desc.includes('Product')) {
      setCharacterKind('Product');
    } else if (desc.includes('Business')) {
      setCharacterKind('Business');
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

    setFormPopulated(true);
  }, [editingCharacter, formPopulated]);

  // Set the current viewing item for sidebar navigation when editing
  useEffect(() => {
    if (isEditMode && characterId && characterName) {
      setCurrentViewingItem({
        type: 'asset',
        title: characterName,
        path: `/ai-assets/edit/${characterId}`,
      });
    }
  }, [isEditMode, characterId, characterName, setCurrentViewingItem]);

  // Max images: 20 for Places, 10 for others
  const maxImages = characterKind === 'Place' ? MAX_IMAGES_PLACE : MAX_IMAGES_DEFAULT;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
      setUploadedImages(prev => [...prev, ...imageFiles].slice(0, maxImages));
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
        setUploadedImages(prev => [...prev, ...imageFiles].slice(0, maxImages));
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
      // Compress and convert uploaded images to base64 (if any)
      // This significantly reduces upload size for large property photos
      const imageBase64Array: string[] = uploadedImages.length > 0
        ? await Promise.all(
            uploadedImages.map((file) => compressImage(file, 1920, 1920, 0.85))
          )
        : [];

      // Build description from character attributes
      // Product, Place, and App types don't have age, gender, hair, eye color
      const isProductOrPlaceOrApp = characterKind === 'Product' || characterKind === 'Place' || characterKind === 'App' || characterKind === 'Business';
      const fullDescription = isProductOrPlaceOrApp
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
          characterType: characterKind as 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App' | 'Business',
          ...(isProductOrPlaceOrApp ? {} : { gender: characterGender, age: characterAge }),
          description: fullDescription,
          ...(imagesChanged && { imageBase64Array }),
        });

        console.log('Character/Product/App/Business update response:', response.data);

        const typeLabel = characterKind === 'Place' ? 'Place' : (characterKind === 'Product' ? 'Product' : (characterKind === 'App' ? 'App' : (characterKind === 'Business' ? 'Business' : 'Character')));
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
          characterType: characterKind as 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App' | 'Business',
          ...(isProductOrPlaceOrApp ? {} : { gender: characterGender, age: characterAge }),
          description: fullDescription,
          imageBase64Array,
        });

        console.log('Character/Product/Place/App/Business creation response:', response.data);

        const typeLabel = characterKind === 'Place' ? 'Place' : (characterKind === 'Product' ? 'Product' : (characterKind === 'App' ? 'App' : (characterKind === 'Business' ? 'Business' : 'Character')));
        setNotification({
          open: true,
          message: `${typeLabel} "${characterName}" created successfully!`,
          severity: 'success'
        });
      }

      // Navigate back to AI assets page
      navigate('/ai-assets');
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

  // Check if this is a non-human type (Product, Place, App, Business)
  const isProductOrPlaceOrApp = characterKind === 'Product' || characterKind === 'Place' || characterKind === 'App' || characterKind === 'Business';

  return (
    <Box sx={{
      pt: { xs: 0, md: 2 },
      pb: 4,
      px: { xs: 2, sm: 3, md: 4 },
      width: '100%',
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      mx: 'auto',
    }}>
      {/* Header - matching CreateNarrativePage style */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: isEditMode
              ? 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)'
              : 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isEditMode
              ? '0 8px 24px rgba(16,185,129,0.3)'
              : '0 8px 24px rgba(236,72,153,0.3)',
          }}
        >
          <PersonIcon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
            {isEditMode ? 'Edit AI Asset' : 'Create AI Asset'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' } }}>
            {isEditMode ? 'Update your asset details' : 'Add a character, product, or place to your AI assets'}
          </Typography>
        </Box>
        <Box sx={{ flexShrink: 0 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/ai-assets')}
            startIcon={<FolderSpecialIcon />}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              background: '#007AFF',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              px: 2.5,
              py: 1,
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              '&:hover': {
                background: '#0066CC',
                boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
              },
            }}
          >
            My AI Assets
          </Button>
          <IconButton
            onClick={() => navigate('/ai-assets')}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              width: 44,
              height: 44,
              background: '#007AFF',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
              '&:hover': {
                background: '#0066CC',
                boxShadow: '0 4px 12px rgba(0,122,255,0.4)',
              },
            }}
          >
            <FolderSpecialIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Form wrapped in Paper - matching CreateNarrativePage style */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        {/* Name Input */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
              Name
            </Typography>
            <Chip label="Required" size="small" sx={{ background: 'rgba(255,59,48,0.2)', color: '#FF6B6B', fontWeight: 600, fontSize: '0.7rem' }} />
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, fontSize: '0.85rem' }}>
            Give your asset a memorable name. This is how you'll reference it when creating songs, videos, narratives, and motion swaps.
          </Typography>
          <Box>
            <TextField
              fullWidth
              value={characterName}
              onChange={(e) => {
                setCharacterName(e.target.value);
                if (e.target.value.trim()) setShowCharacterNameError(false);
              }}
              placeholder="e.g., Luna, Max, Summer Villa, Chuck Taylors"
              error={showCharacterNameError && !characterName.trim()}
              helperText={showCharacterNameError && !characterName.trim() ? 'Please enter a name' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: characterName.trim() ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.05)',
                  border: characterName.trim() ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  transition: 'all 0.2s ease',
                  '& input': {
                    py: 1.5,
                    color: '#fff',
                    '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                  },
                  '&:hover': {
                    backgroundColor: characterName.trim() ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.08)',
                    borderColor: characterName.trim() ? '#3B82F6' : 'rgba(255,255,255,0.2)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    borderColor: '#3B82F6',
                  },
                  '& fieldset': { border: 'none' },
                },
              }}
            />
          </Box>
        </Box>

        {/* Two-column grid for form fields on md+ */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 0, md: 3 },
          alignItems: 'start',
          mb: 3
        }}>
          {/* Type Dropdown */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
              Type
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontSize: '0.85rem', minHeight: { md: 40 } }}>
              This determines how AI generates and showcases your video content
            </Typography>
            <StyledDropdown
              options={characterKindOptions}
              value={characterKind}
              onChange={setCharacterKind}
              placeholder="Select type..."
              icon={characterTypeIcons[characterKind]}
              fullWidth
            />
          </Box>

          {/* Gender - Only for Human and Non-Human */}
          {!isProductOrPlaceOrApp && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Gender
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontSize: '0.85rem', minHeight: { md: 40 } }}>
                Select the gender identity for your character
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {genderOptions.map((gender) => {
                  const isSelected = characterGender === gender.id;
                  const isMale = gender.id === 'Male';
                  return (
                    <Box
                      key={gender.id}
                      onClick={() => setCharacterGender(gender.id)}
                      sx={{
                        flex: '1 1 0',
                        minWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        py: 1.5,
                        minHeight: 52,
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(0,122,255,0.15)' : 'rgba(255,255,255,0.05)',
                        border: isSelected ? '2px solid #007AFF' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: isSelected ? 'rgba(0,122,255,0.2)' : 'rgba(255,255,255,0.08)',
                          borderColor: isSelected ? '#007AFF' : 'rgba(255,255,255,0.2)',
                        },
                      }}
                    >
                      {isMale ? (
                        <MaleIcon sx={{ fontSize: 22, color: isSelected ? '#007AFF' : '#007AFF' }} />
                      ) : (
                        <FemaleIcon sx={{ fontSize: 22, color: isSelected ? '#007AFF' : '#EC4899' }} />
                      )}
                      <Typography sx={{
                        fontWeight: isSelected ? 600 : 500,
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}>
                        {gender.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Age - Only for Human and Non-Human */}
          {!isProductOrPlaceOrApp && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Age
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontSize: '0.85rem', minHeight: { md: '1.3em' } }}>
                Select the age range for your character
              </Typography>
              <StyledDropdown
                options={ageOptions}
                value={characterAge}
                onChange={setCharacterAge}
                placeholder="Select age..."
                fullWidth
              />
            </Box>
          )}

          {/* Hair Length - Only for humans */}
          {characterKind === 'Human' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Hair Length
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontSize: '0.85rem', minHeight: { md: '1.3em' } }}>
                Select the hair length style for your character
              </Typography>
              <StyledDropdown
                options={getHairLengthOptions(characterHairColor)}
                value={characterHairLength}
                onChange={setCharacterHairLength}
                placeholder="Select hair length..."
                fullWidth
              />
            </Box>
          )}

          {/* Hair Color - Only for humans with hair (not bald) */}
          {characterKind === 'Human' && characterHairLength !== 'Bald' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Hair Color
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontSize: '0.85rem', minHeight: { md: '1.3em' } }}>
                Choose the hair color for your character
              </Typography>
              <StyledDropdown
                options={getHairColorOptions(characterHairLength)}
                value={characterHairColor}
                onChange={setCharacterHairColor}
                placeholder="Select hair color..."
                fullWidth
              />
            </Box>
          )}

          {/* Eye Color - Only for Human and Non-Human */}
          {!isProductOrPlaceOrApp && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
                Eye Color
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontSize: '0.85rem', minHeight: { md: '1.3em' } }}>
                Pick the eye color for your character
              </Typography>
              <StyledDropdown
                options={eyeColorOptions}
                value={characterEyeColor}
                onChange={setCharacterEyeColor}
                placeholder="Select eye color..."
                fullWidth
              />
            </Box>
          )}
        </Box>

        {/* Reference Images */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
            Reference Images
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontSize: '0.85rem' }}>
            Upload up to {maxImages} reference images {characterKind === 'Place' ? 'to showcase your property' : characterKind === 'Product' ? 'showing your product from different angles' : characterKind === 'App' ? 'showing your app screens and features' : characterKind === 'Business' ? 'showcasing your business, storefront, or brand' : 'for appearance in music videos'}
          </Typography>
          {characterKind === 'Product' && (
            <Typography sx={{ color: '#007AFF', mb: 2, fontSize: '0.8rem', fontStyle: 'italic' }}>
              💡 Tip: Create one product entry per item. For example, if you have different shoe colors or variants, create a separate entry for each one.
            </Typography>
          )}
          {characterKind === 'Place' && (
            <Typography sx={{ color: '#007AFF', mb: 2, fontSize: '0.8rem', fontStyle: 'italic' }}>
              💡 Tip: Upload up to 20 photos! Include interior rooms, exterior views, surrounding area (beachfront, garden, pool), and unique features. Each photo becomes a scene in your video.
            </Typography>
          )}
          {characterKind === 'App' && (
            <Typography sx={{ color: '#007AFF', mb: 2, fontSize: '0.8rem', fontStyle: 'italic' }}>
              💡 Tip: Include app screenshots, UI mockups, logo, and feature highlights. Show key screens and user flows for the best promo video.
            </Typography>
          )}
          {characterKind === 'Business' && (
            <Typography sx={{ color: '#007AFF', mb: 2, fontSize: '0.8rem', fontStyle: 'italic' }}>
              💡 Tip: Include your logo, storefront, team photos, office space, and any branded materials. Show what makes your business unique.
            </Typography>
          )}

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
              border: isDragging ? '2px dashed #007AFF' : '2px dashed rgba(255,255,255,0.2)',
              backgroundColor: isDragging ? 'rgba(0,122,255,0.1)' : 'rgba(255,255,255,0.02)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#007AFF',
                backgroundColor: 'rgba(0,122,255,0.05)',
              }
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 32, color: isDragging ? '#007AFF' : 'rgba(255,255,255,0.5)', mb: 1 }} />
            <Typography sx={{ color: isDragging ? '#007AFF' : '#fff', fontWeight: 500 }}>
              {isDragging ? 'Drop images here' : 'Drag & drop or click to upload'}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5, fontSize: '0.85rem' }}>
              {existingImageUrls.length + uploadedImages.length}/{maxImages} images
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
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontSize: '0.8rem' }}>
                Current images:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1.5, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                {existingImageUrls.map((url, index) => (
                  <Box key={`existing-${index}`} sx={{ position: 'relative', width: 70, height: 70 }}>
                    <img
                      src={url}
                      alt={`Existing ${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(0,0,0,0.8)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' }, p: 0.5 }}
                      onClick={(e) => { e.stopPropagation(); handleRemoveExistingImage(index); }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: '#FF6B6B' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Newly uploaded images */}
          {uploadedImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontSize: '0.8rem' }}>
                New images to upload:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 1.5, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                {uploadedImages.map((image, index) => (
                  <Box key={index} sx={{ position: 'relative', width: 70, height: 70 }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(0,0,0,0.8)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.9)' }, p: 0.5 }}
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: '#FF6B6B' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
            {characterKind === 'Place'
              ? 'Property Details'
              : characterKind === 'Product'
                ? 'Product Description'
                : characterKind === 'App'
                  ? 'App Description'
                  : characterKind === 'Business'
                    ? 'Business Description'
                    : 'Description'} (Optional)
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, fontSize: '0.85rem' }}>
            {characterKind === 'Place'
              ? 'Describe the location, style, key features, amenities, and vibe'
              : characterKind === 'Product'
                ? 'Describe the product features, materials, colors, and unique details'
                : characterKind === 'App'
                  ? 'Describe the app, its key features, target users, and what makes it unique'
                  : characterKind === 'Business'
                    ? 'Describe your business, services, brand identity, and what sets you apart'
                    : 'Add extra details about personality, appearance, features, or traits'}
          </Typography>
          <TextField
            fullWidth
            value={characterDescription}
            onChange={(e) => setCharacterDescription(e.target.value)}
            multiline
            rows={3}
            placeholder={
              characterKind === 'Place'
                ? "e.g., Beachfront villa in Cape Town with ocean views, modern coastal decor, infinity pool, 3 bedrooms with en-suite bathrooms"
                : characterKind === 'Product'
                  ? "e.g., Sleek red sneakers with white soles, premium leather material, iconic logo on side"
                  : characterKind === 'App'
                    ? "e.g., A fitness tracking app with clean UI, progress charts, workout plans, social features, and gamification elements"
                    : characterKind === 'Business'
                      ? "e.g., A modern coffee shop with artisan roasts, cozy atmosphere, community events, and sustainable sourcing"
                      : "e.g., A cheerful girl who loves adventures, always wears a red scarf"
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: characterDescription.trim() ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.05)',
                border: characterDescription.trim() ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                transition: 'all 0.2s ease',
                '& textarea': {
                  color: '#fff',
                  '&::placeholder': { color: 'rgba(255,255,255,0.4)' },
                },
                '&:hover': {
                  backgroundColor: characterDescription.trim() ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.08)',
                  borderColor: characterDescription.trim() ? '#3B82F6' : 'rgba(255,255,255,0.2)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  borderColor: '#3B82F6',
                },
                '& fieldset': { border: 'none' },
              },
            }}
          />
        </Box>

        {/* Create/Update Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
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
              width: { xs: '100%', sm: 'fit-content' },
              px: 4,
              '&:hover': { boxShadow: '0 12px 32px rgba(0,122,255,0.4)' },
              '&.Mui-disabled': { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' },
            }}
          >
            {isCreatingCharacter ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : (
              isEditMode
                ? `Update ${characterKind === 'Place' ? 'Place' : (characterKind === 'Product' ? 'Product' : (characterKind === 'App' ? 'App' : (characterKind === 'Business' ? 'Business' : 'Character')))}`
                : `Create ${characterKind === 'Place' ? 'Place' : (characterKind === 'Product' ? 'Product' : (characterKind === 'App' ? 'App' : (characterKind === 'Business' ? 'Business' : 'Character')))}`
            )}
          </Button>
        </Box>
      </Paper>

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
    </Box>
  );
};

export default CreateCharacterPage;
