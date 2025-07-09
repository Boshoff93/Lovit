import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { updateAiModelAllowance } from './authSlice';
import api from '../utils/axiosConfig';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

// Model interface
export interface Model {
  modelId: string;
  name?: string;
  gender?: string;
  bodyType?: string;
  createdAt?: string;
  imageUrl?: string;
  status?: string;
  progress?: number;
  profileData?: any;
  ethnicity?: string;
  hairColor?: string;
  hairStyle?: string;
  eyeColor?: string;
  height?: string;
  age?: number;
}

// Models state interface
interface ModelsState {
  models: Model[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ModelsState = {
  models: [],
  isLoading: false,
  error: null
};

// Async thunk for fetching models
export const fetchModels = createAsyncThunk(
  'models/fetchModels',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null, user: { userId: string } | null } };
      
      if (!auth.token || !auth.user?.userId) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await api.get(`${API_BASE_URL}/api/models`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        },
        params: {
          userId: auth.user.userId
        }
      });
      
      return response.data.models || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch models');
    }
  }
);

// New async thunk for getting presigned URLs for model image uploads
export const getModelUploadUrls = createAsyncThunk(
  'models/getModelUploadUrls',
  async (
    payload: { fileCount: number, fileTypes: string[] },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token || !auth.user?.userId) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await api.post(
        `${API_BASE_URL}/api/get-model-upload-urls`,
        {
          userId: auth.user.userId,
          fileCount: payload.fileCount,
          fileTypes: payload.fileTypes,
          numberOfImages: payload.fileCount
        },
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue(error.response.data?.error || 'You have reached your model limit');
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to get upload URLs');
    }
  }
);

// New async thunk for training a model with S3 uploaded images
export const trainModelWithS3 = createAsyncThunk(
  'models/trainModelWithS3',
  async (
    payload: { 
      modelId: string; 
      imageKeys: string[]; 
      profileData: any;
    },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const state = getState() as RootState;
      const { auth } = state;
      
      if (!auth.token || !auth.user?.userId) {
        return rejectWithValue('Authentication required');
      }

      const response = await api.post(
        `${API_BASE_URL}/api/train-model`,
        {
          userId: auth.user.userId,
          modelId: payload.modelId,
          imageKeys: payload.imageKeys,
          profileData: payload.profileData
        },
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      );
      
      // Update model allowance counter - increment by 1 for each model creation
      dispatch(updateAiModelAllowance(1));
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return rejectWithValue(error.response.data?.error || 'You have reached your model limit');
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to train model');
    }
  }
);

// Add the delete model thunk near other thunks
export const deleteModel = createAsyncThunk(
  'models/deleteModel',
  async (
    { modelId }: { modelId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as RootState;
      
      if (!auth.token || !auth.user?.userId) {
        return rejectWithValue('Authentication required');
      }
      
      await api.delete(`${API_BASE_URL}/api/models/${modelId}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        },
        data: {
          userId: auth.user.userId
        }
      });
      
      return { modelId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete model');
    }
  }
);

// Models slice
const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    // Update a model (e.g., from WebSocket updates)
    updateModel: (state, action: PayloadAction<Partial<Model> & { modelId: string }>) => {
      const { modelId, ...updates } = action.payload;
      const modelIndex = state.models.findIndex(model => model.modelId === modelId);
      
      if (modelIndex >= 0) {
        // Update all provided fields
        state.models[modelIndex] = { 
          ...state.models[modelIndex],
          ...updates
        };
      } else {
        // If model not found but we have enough data, add it as a new model
        if (updates.status) {
          state.models.push({ modelId, ...updates });
        }
      }
    },
    
    // Clear models data (e.g., on logout)
    clearModels: (state) => {
      state.models = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch models
    builder
      .addCase(fetchModels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.models = action.payload;
        state.error = null;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle getModelUploadUrls thunk
    builder
      .addCase(getModelUploadUrls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getModelUploadUrls.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getModelUploadUrls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle trainModelWithS3 thunk
    builder
      .addCase(trainModelWithS3.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(trainModelWithS3.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.model) {
          state.models.push(action.payload.model);
        }
        state.error = null;
      })
      .addCase(trainModelWithS3.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add the delete model reducer cases to extraReducers
    builder
      .addCase(deleteModel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteModel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.models = state.models.filter(model => model.modelId !== action.payload.modelId);
        state.error = null;
      })
      .addCase(deleteModel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { updateModel, clearModels } = modelsSlice.actions;

export default modelsSlice.reducer;

// Selector to get models from state
export const selectModels = (state: RootState) => state.models.models;
export const selectModelsLoading = (state: RootState) => state.models.isLoading;
export const selectModelsError = (state: RootState) => state.models.error; 
