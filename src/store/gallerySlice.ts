import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';
import { updateAiPhotoAllowance } from './authSlice';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

// Base image interface for common properties
export interface ImageBase {
  imageId: string;
  imageUrl?: string;
  modelId?: string;
  prompt?: string;
  status?: string;
  title?: string;
  clothingKey?: string;
  seedNumber?: number;
  orientation?: string;
  dripRating?: string[];
}

// Image interface
export interface GeneratedImage extends ImageBase {
  imageUrl: string;
  title?: string;
  createdAt?: string;
  progress?: number;
  imageKey?: string;
}

// Image group interface for displaying in gallery
export interface ImageGroup {
  date: string;
  formattedDate: string;
  images: GeneratedImage[];
}

// Generating image interface for tracking in-progress generations
export interface GeneratingImage extends ImageBase {
  timestamp?: number;
  progress?: number;
}

// Gallery state interface
interface GalleryState {
  images: GeneratedImage[];
  imageGroups: ImageGroup[];
  generatingImages: GeneratingImage[];
  isLoading: boolean;
  isUploadingClothing: boolean;
  clothingKey: string | null;
  error: string | null;
}

// Initial state
const initialState: GalleryState = {
  images: [],
  imageGroups: [],
  generatingImages: [],
  isLoading: false,
  isUploadingClothing: false,
  clothingKey: null,
  error: null
};

// Async thunk for fetching all generated images
export const fetchGeneratedImages = createAsyncThunk(
  'gallery/fetchGeneratedImages',
  async (
    // Add an optional object parameter
    options: { connectCallback?: ((imageId: string, type: "IMAGE" | "MODEL") => void) | undefined } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as { auth: { token: string | null, user: { userId: string } | null } };
      
      if (!auth.token || !auth.user?.userId) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get(`${API_BASE_URL}/api/generated-images`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        },
        params: {
          userId: auth.user.userId
        }
      });
      
      // Check if there are any generating images in the response and connect to their WebSockets
      const images = response.data.images || [];
      const generatingImages = images.filter((img: any) => img.status === 'in_progress');
      const connectCallback = options?.connectCallback;
      
      if (generatingImages.length > 0 && connectCallback && typeof connectCallback === 'function') {
        console.log(`Connecting to WebSockets for ${generatingImages.length} existing generating images`);
        
        generatingImages.forEach((img: any) => {
          if (img.imageId) {
            console.log(`Connecting to WebSocket for existing generating image ${img.imageId}`);
            connectCallback(img.imageId, "IMAGE");
          }
        });
      }
      
      return images;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch images');
    }
  }
);

// Async thunk for generating new images
export const generateImages = createAsyncThunk(
  'gallery/generateImages',
  async (
    payload: { 
      modelId: string;
      prompt: string;
      numberOfImages: number;
      orientation: string;
      clothingKey?: string;
      seedNumber?: string;
      inferenceSteps?: number;
      dripRating?: string[];
      connectCallback?: (imageId: string, type: "IMAGE" | "MODEL") => void; // Add callback for connection
    },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token || !auth.user?.userId) {
        return rejectWithValue('Authentication required');
      }
      
      // Determine inference steps based on subscription tier
      const tier = (auth.subscription?.tier || 'free').toLowerCase();
      const inferenceSteps = payload.inferenceSteps || (tier === 'starter' ? 1000 : 2000);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/generate-photo`,
        {
          userId: auth.user.userId,
          modelId: payload.modelId,
          prompt: payload.prompt,
          numberOfImages: payload.numberOfImages,
          orientation: payload.orientation,
          clothingKey: payload.clothingKey,
          seedNumber: payload.seedNumber,
          inferenceSteps
        },
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      );
      
      console.log("Image generation response:", response.data);
      
      // Handle the images array from the response
      const images = response.data.images || [];
      
      if (images.length === 0) {
        console.error('Warning: No images in API response', JSON.stringify(response.data));
      } else {
        console.log(`Received ${images.length} images in generation response`);
        
        // Connect to WebSocket for each image ID using the provided callback
        if (payload.connectCallback) {
          images.forEach((image: any) => {
            if (image && image.imageId) {
              console.log(`Connecting to WebSocket for newly generated image ${image.imageId}`);
              payload.connectCallback?.(image.imageId, "IMAGE");
            }
          });
        }
        
        // Update the AI photos allowance counter
        dispatch(updateAiPhotoAllowance(payload.numberOfImages));
      }
      
      // Create generatingImages array for Redux store
      const generatingImages = images.map((image: any) => ({
        imageId: image.imageId,
        modelId: payload.modelId,
        prompt: payload.prompt,
        timestamp: Date.now(),
        numberOfImages: payload.numberOfImages,
        orientation: payload.orientation,
        clothingKey: payload.clothingKey,
        seedNumber: Number(image.seedNumber || payload.seedNumber),
        dripRating: image.dripRating || payload.dripRating,
        title: image.title,
        status: image.status || 'queued'
      }));
      
      return {
        ...response.data,
        generatingImages
      };
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue(error.response.data?.error || 'You have reached your photo limit');
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to generate images');
    }
  }
);

// Async thunk for uploading clothing items
export const uploadClothingItem = createAsyncThunk(
  'gallery/uploadClothingItem',
  async (
    payload: { 
      file: File;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token || !auth.user?.userId) {
        return rejectWithValue('Authentication required');
      }
      
      // Get a presigned URL for the upload
      const fileType = payload.file.type;
      const presignedResponse = await axios.post(
        `${API_BASE_URL}/api/get-clothing-upload-url`,
        {
          userId: auth.user.userId,
          fileType
        },
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      );
      
      const { url, key } = presignedResponse.data;
      
      if (!url || !key) {
        return rejectWithValue('Failed to get upload URL');
      }
      
      // Upload the file to the presigned URL
      await axios.put(url, payload.file, {
        headers: {
          'Content-Type': fileType,
        },
      });
      
      return { key };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to upload clothing item');
    }
  }
);

// Helper function to group images by date
const groupImagesByDate = (images: GeneratedImage[]): ImageGroup[] => {
  // Sort images by date (newest first)
  const sortedImages = [...images].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
  
  // Group by date
  const groups: Record<string, GeneratedImage[]> = {};
  
  sortedImages.forEach(image => {
    if (!image.createdAt) {
      // Skip images without a creation date
      return;
    }
    
    const date = new Date(image.createdAt);
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    
    groups[dateString].push(image);
  });
  
  // Convert to array of image groups
  return Object.entries(groups).map(([date, images]) => {
    // Format the date string
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    return {
      date,
      formattedDate,
      images
    };
  });
};

// Gallery slice
const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    // Add a generating image (for tracking in-progress generations)
    addGeneratingImage: (state, action: PayloadAction<GeneratingImage>) => {
      console.log("Adding generating image:", action.payload);
      state.generatingImages.push(action.payload);
    },
    
    // Add multiple generating images at once
    addGeneratingImages: (state, action: PayloadAction<GeneratingImage[]>) => {
      console.log(`Adding ${action.payload.length} generating images`);
      state.generatingImages.push(...action.payload);
    },
    
    // Remove a generating image (when completed or failed)
    removeGeneratingImage: (state, action: PayloadAction<string>) => {
      console.log("Removing generating image:", action.payload);
      state.generatingImages = state.generatingImages.filter(
        img => img.imageId !== action.payload
      );
    },
    
    // Update progress for a generating image
    updateGeneratingImageProgress: (state, action: PayloadAction<{imageId: string, progress: number}>) => {
      console.log("Updating generating image progress:", action.payload);
      const index = state.generatingImages.findIndex(img => img.imageId === action.payload.imageId);
      if (index !== -1) {
        state.generatingImages[index].progress = action.payload.progress;
      }
    },
    
    // Update an existing generating image or add it if it doesn't exist
    updateGeneratingImage: (state, action: PayloadAction<GeneratingImage>) => {
      console.log("Updating generating image:", action.payload);
      const index = state.generatingImages.findIndex(img => img.imageId === action.payload.imageId);
      if (index !== -1) {
        // Update existing image
        state.generatingImages[index] = {
          ...state.generatingImages[index],
          ...action.payload
        };
      } else {
        // Add new image if it doesn't exist
        state.generatingImages.push(action.payload);
      }
    },
    
    // Add new images when they're received from WebSocket
    addGeneratedImages: (state, action: PayloadAction<GeneratedImage[]>) => {
      state.images = [...action.payload, ...state.images];
      // Re-group images
      state.imageGroups = groupImagesByDate(state.images);
    },
    
    // Clear clothing key
    clearClothingKey: (state) => {
      state.clothingKey = null;
    },
    
    // Clear all generating images
    clearGeneratingImages: (state) => {
      state.generatingImages = [];
    },
    
    // Clear gallery data (e.g., on logout)
    clearGallery: (state) => {
      state.images = [];
      state.imageGroups = [];
      state.generatingImages = [];
      state.clothingKey = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch generated images
    builder
      .addCase(fetchGeneratedImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneratedImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload;
        state.imageGroups = groupImagesByDate(action.payload);
        state.error = null;
      })
      .addCase(fetchGeneratedImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Generate images
    builder
      .addCase(generateImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateImages.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Check if we have valid generating images to add
        const generatingImages = action.payload.generatingImages || [];
        
        if (generatingImages.length > 0) {
          console.log(`Adding ${generatingImages.length} generating images to state`);
          
          // Filter out any images without imageId
          const validImages = generatingImages.filter((img: GeneratingImage) => img && img.imageId);
          
          if (validImages.length !== generatingImages.length) {
            console.error('Some generating images are missing imageId and will be skipped');
          }
          
          if (validImages.length > 0) {
            state.generatingImages.push(...validImages);
          }
        } else {
          console.error('No generating images data in fulfilled action:', JSON.stringify(action.payload));
        }
        
        state.error = null;
      })
      .addCase(generateImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
      
    // Upload clothing item
    builder
      .addCase(uploadClothingItem.pending, (state) => {
        state.isUploadingClothing = true;
        state.error = null;
      })
      .addCase(uploadClothingItem.fulfilled, (state, action) => {
        state.isUploadingClothing = false;
        state.clothingKey = action.payload.key;
        state.error = null;
      })
      .addCase(uploadClothingItem.rejected, (state, action) => {
        state.isUploadingClothing = false;
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { 
  addGeneratingImage, 
  addGeneratingImages,
  removeGeneratingImage, 
  updateGeneratingImageProgress,
  updateGeneratingImage,
  addGeneratedImages,
  clearClothingKey,
  clearGeneratingImages,
  clearGallery
} = gallerySlice.actions;

export default gallerySlice.reducer;

// Selectors
export const selectAllImages = (state: RootState) => state.gallery.images;
export const selectImageGroups = (state: RootState) => state.gallery.imageGroups;
export const selectGeneratingImages = (state: RootState) => state.gallery.generatingImages;
export const selectGalleryLoading = (state: RootState) => state.gallery.isLoading;
export const selectGalleryError = (state: RootState) => state.gallery.error;
export const selectIsUploadingClothing = (state: RootState) => state.gallery.isUploadingClothing;
export const selectClothingKey = (state: RootState) => state.gallery.clothingKey; 