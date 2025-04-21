import axios from 'axios';
import { Photo, TrainingModel, GeneratedImage, ApiResponse } from '../types';
import { store } from '../store/store';
import { createAuthenticatedRequest } from '../store/authSlice';

// In a real app, this would come from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

// Create a base axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Photo uploads
export const uploadPhotos = async (files: File[]): Promise<ApiResponse<Photo[]>> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('photos', file);
  });

  const response = await api.post<ApiResponse<Photo[]>>('/photos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getPhotos = async (): Promise<ApiResponse<Photo[]>> => {
  const response = await api.get<ApiResponse<Photo[]>>('/photos');
  return response.data;
};

// Model training
export const trainModel = async (photoIds: string[]): Promise<ApiResponse<TrainingModel>> => {
  const response = await api.post<ApiResponse<TrainingModel>>('/models/train', {
    photoIds,
  });
  
  return response.data;
};

export const getModelStatus = async (modelId: string): Promise<ApiResponse<TrainingModel>> => {
  const response = await api.get<ApiResponse<TrainingModel>>(`/models/${modelId}/status`);
  return response.data;
};

export const getModels = async (): Promise<ApiResponse<TrainingModel[]>> => {
  const response = await api.get<ApiResponse<TrainingModel[]>>('/models');
  return response.data;
};

// Image generation
export const generateImage = async (modelId: string, prompt: string): Promise<ApiResponse<GeneratedImage>> => {
  const response = await api.post<ApiResponse<GeneratedImage>>('/images/generate', {
    modelId,
    prompt,
  });
  
  return response.data;
};

export const getGeneratedImages = async (): Promise<ApiResponse<GeneratedImage[]>> => {
  const response = await api.get<ApiResponse<GeneratedImage[]>>('/images');
  return response.data;
};

// API service with methods for different endpoints
export const apiService = {
  // Function to get authenticated API instance
  getAuthInstance: () => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    return createAuthenticatedRequest(token);
  },
  
  // Models
  models: {
    // Get all models for a user
    getAll: async () => {
      try {
        const authApi = apiService.getAuthInstance();
        const state = store.getState();
        const userId = state.auth.user?.userId;
        
        if (!userId) {
          throw new Error('User ID not found');
        }
        
        const response = await authApi.get(`/api/users/${userId}/models`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    // Get a specific model
    getById: async (modelId: string) => {
      try {
        const authApi = apiService.getAuthInstance();
        const state = store.getState();
        const userId = state.auth.user?.userId;
        
        if (!userId) {
          throw new Error('User ID not found');
        }
        
        const response = await authApi.get(`/api/users/${userId}/models/${modelId}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    
    // Train a new model (using FormData)
    train: async (formData: FormData) => {
      try {
        const authApi = apiService.getAuthInstance();
        const response = await authApi.post('/api/train-model', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
  
  // Other API endpoints can be added here
  // For example:
  // - user profile management
  // - payment processing
  // - image generation
};

export default apiService; 