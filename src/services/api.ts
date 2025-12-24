import api from '../utils/axiosConfig';
import { createAuthenticatedRequest } from '../store/authSlice';

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

// Songs API
export const songsApi = {
  generateSong: (data: {
    userId: string;
    songPrompt: string;
    genre: string;
    mood: string;
    language?: string;
    characterIds?: string[];
    customInstructions?: string;
  }) => api.post('/api/gruvi/songs/generate', data),
  
  getUserSongs: (userId: string) => 
    api.get(`/api/gruvi/songs/${userId}`),
};

export default api; 