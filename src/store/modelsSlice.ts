import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

// Model interface
export interface Model {
  id: string;
  name: string;
  gender: string;
  bodyType: string;
  createdAt: string;
  imageUrl: string;
  status?: string;
  progress?: number;
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
      
      const response = await axios.get(`${API_BASE_URL}/api/models`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data'
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

// Async thunk for training a new model
export const trainModel = createAsyncThunk(
  'models/trainModel',
  async (
    payload: FormData | { formData: FormData; axiosConfig?: any }, 
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const { auth } = state;
      
      // Extract formData and axiosConfig from payload
      let formData: FormData;
      let axiosConfig = {};
      
      if (payload instanceof FormData) {
        formData = payload;
      } else {
        formData = payload.formData;
        axiosConfig = payload.axiosConfig || {};
      }

      if (!auth.token) {
        return rejectWithValue('Authentication required');
      }

      const response = await axios.post(`${API_BASE_URL}/api/train-model`, formData, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        },
        timeout: 0,
        ...axiosConfig
      });
      
      return response.data;
    } catch (error: any) {
      // Enhanced error handling
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timed out. The file upload may be too large.');
      }
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return rejectWithValue(error.response.data?.error || `Server error: ${error.response.status}`);
      } else if (error.request) {
        console.log('error.request', error);
        // The request was made but no response was received
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        return rejectWithValue(`Error: ${error.message || 'Unknown error'}`);
      }
    }
  }
);

// Models slice
const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    // Update a model (e.g., from WebSocket updates)
    updateModel: (state, action: PayloadAction<{ modelId: string, status: string, progress?: number }>) => {
      const { modelId, status, progress } = action.payload;
      const model = state.models.find(model => model.id === modelId);
      
      if (model) {
        model.status = status;
        if (progress !== undefined) {
          model.progress = progress;
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
      
    // Train model
    builder
      .addCase(trainModel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(trainModel.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the new model to the list if it's returned in the response
        if (action.payload?.model) {
          state.models.push(action.payload.model);
        }
        state.error = null;
      })
      .addCase(trainModel.rejected, (state, action) => {
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
