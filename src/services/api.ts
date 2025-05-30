import axios from 'axios';
import { store } from '../store/store';
import { createAuthenticatedRequest } from '../store/authSlice';

// Create axios instance with base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User and authentication API
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  signup: (email: string, password: string, username: string) => 
    api.post('/auth/signup', { email, password, username }),
  
  googleLogin: (token: string) => 
    api.post('/auth/google', { token }),
  
  refreshToken: (token: string) => 
    api.post('/auth/refresh-token', { token }),
  
  verifyEmail: (token: string, userId: string) => 
    api.get(`/auth/verify-email?token=${token}&userId=${userId}`),
  
  resendVerification: (email: string) => 
    api.post('/auth/resend-verification', { email }),
  
  requestPasswordReset: (email: string) => 
    api.post('/auth/password-reset', { email }),
};

// User subscription API
export const subscriptionApi = {
  getUserSubscription: () => 
    api.get('/api/user/subscription'),
  
  createCheckoutSession: (priceId: string, productId: string, allowPriceSwitch = true) => 
    api.post('/api/create-checkout-session', { priceId, productId, allowPriceSwitch }),
  
  createPortalSession: () => 
    api.post('/api/create-portal-session'),
};

// User models API
export const modelsApi = {
  getAllModels: (userId: string) => 
    api.get(`/api/users/${userId}/models`),
  
  getModelById: (userId: string, modelId: string) => 
    api.get(`/api/users/${userId}/models/${modelId}`),
  
  trainModel: (userId: string, images: File[], profileData: any) => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('profileData', JSON.stringify(profileData));
    
    // Append all images to form data
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    
    return api.post('/api/train-model', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
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
        console.error('Model training error:', error);
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