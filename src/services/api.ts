import api from '../utils/axiosConfig';
import { createAuthenticatedRequest } from '../store/authSlice';

// Character interface
export interface Character {
  characterId: string;
  userId: string;
  characterName: string;
  characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App';
  gender?: string;
  age?: string;
  description?: string;
  imageUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
}

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
    genre: string; // 'auto' to let AI pick based on prompt
    mood: string; // 'auto' to let AI pick based on prompt
    language?: string;
    characterIds?: string[];
    customInstructions?: string;
    creativity?: number; // 0-10 scale: 0 = literal, 10 = creative
    songLength?: 'short' | 'standard'; // 'short' = ~45-60s, 'standard' = ~90-120s
  }) => api.post('/api/gruvi/songs/generate', data),
  
  getUserSongs: (userId: string, options?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    genre?: string;
    mood?: string;
  }) => {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.search) params.append('search', options.search);
    if (options?.genre) params.append('genre', options.genre);
    if (options?.mood) params.append('mood', options.mood);
    const queryString = params.toString();
    return api.get(`/api/gruvi/songs/${userId}${queryString ? `?${queryString}` : ''}`);
  },
  
  deleteSong: (userId: string, songId: string) => 
    api.delete(`/api/gruvi/songs/${userId}/${songId}`),
  
  /**
   * Fetch a single song by ID (for lyrics, details, etc.)
   */
  getSong: (userId: string, songId: string) => 
    api.get(`/api/gruvi/songs/${userId}/${songId}`),
  
  /**
   * Fetch multiple songs by their IDs (for playlists, featured songs, etc.)
   * @param userId - The user who owns these songs
   * @param songIds - Array of song IDs to fetch
   */
  getSongsByIds: (userId: string, songIds: string[]) => 
    api.post('/api/gruvi/songs/batch', { userId, songIds }),
  
  /**
   * Fetch public sample songs (no auth required - for homepage, genre, mood, language pages)
   * Uses the seed songs user ID to fetch pre-generated sample tracks
   * Doesn't require user to be logged in
   * @param userId - The user ID who owns these songs (seed songs user ID)
   * @param songIds - Array of song IDs to fetch
   */
  getPublicSampleSongs: (userId: string, songIds: string[]) => 
    api.post('/api/public/songs/batch', { userId, songIds }),
};

// Videos API
export const videosApi = {
  generateVideo: (data: {
    userId: string;
    songId: string;
    videoType: 'still' | 'standard' | 'professional'; // still=slideshow, standard=Seedance, professional=Kling
    style?: string;
    videoPrompt?: string;
    aspectRatio?: 'portrait' | 'landscape';
    characterIds?: string[];
    placeDescription?: string; // Optional: User's description of their property/location for web search
    creativity?: number; // 0-10: 0 = exact prompt adherence, 10 = creative interpretation
  }) => api.post('/api/gruvi/videos/generate', data),
  
  getUserVideos: (userId: string, options?: { page?: number; limit?: number; all?: boolean }) => {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.all) params.append('all', 'true');
    const queryString = params.toString();
    return api.get(`/api/gruvi/videos/${userId}${queryString ? `?${queryString}` : ''}`);
  },
  
  // Legacy method kept for backward compatibility
  getAllUserVideos: (userId: string) => 
    api.get(`/api/gruvi/videos/${userId}`),
  
  // Get a single video by ID
  getVideo: (userId: string, videoId: string) =>
    api.get(`/api/gruvi/videos/${userId}/${videoId}`),
  
  deleteVideo: (userId: string, videoId: string) => 
    api.delete(`/api/gruvi/videos/${userId}/${videoId}`),
  
  // Social Sharing APIs
  generateSocialMetadata: (userId: string, videoId: string, data?: { location?: string }) =>
    api.post(`/api/gruvi/videos/${userId}/${videoId}/social-metadata`, data || {}),
  
  getSocialMetadata: (userId: string, videoId: string) =>
    api.get(`/api/gruvi/videos/${userId}/${videoId}/social-metadata`),
  
  updateSocialMetadata: (userId: string, videoId: string, data: {
    title?: string;
    description?: string;
    tags?: string[];
    hook?: string;
    location?: string;
  }) => api.put(`/api/gruvi/videos/${userId}/${videoId}/social-metadata`, data),
  
  generateSocialThumbnail: (userId: string, videoId: string, data: {
    hookText: string;
    customPrompt?: string;
    selectedCharacterIds?: string[];
    selectedImageUrls?: string[];
  }) => api.post(`/api/gruvi/videos/${userId}/${videoId}/social-thumbnail`, data),
  
  // Upload custom thumbnail
  uploadThumbnail: (userId: string, videoId: string, data: {
    thumbnailBase64: string;
  }) => api.post(`/api/gruvi/videos/${userId}/${videoId}/upload-thumbnail`, data),
  
  // YouTube Upload
  uploadToYouTube: (userId: string, videoId: string, data?: { addThumbnailIntro?: boolean }) =>
    api.post(`/api/gruvi/videos/${userId}/${videoId}/youtube-upload`, data || {}),
};

// YouTube API
export const youtubeApi = {
  getAuthUrl: (userId: string) =>
    api.get(`/api/gruvi/youtube/auth-url?userId=${userId}`),
  
  handleCallback: (code: string, state: string) =>
    api.post('/api/public/youtube/callback', { code, state }),
  
  getStatus: (userId: string) =>
    api.get(`/api/gruvi/youtube/status?userId=${userId}`),
  
  disconnect: (userId: string) =>
    api.delete(`/api/gruvi/youtube/disconnect?userId=${userId}`),
};

// Characters API
export const charactersApi = {
  createCharacter: (data: {
    userId: string;
    characterName: string;
    gender?: string;
    age?: string;
    description?: string;
    characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App';
    imageBase64Array: string[];
  }) => api.post('/api/gruvi/characters', data),
  
  updateCharacter: (userId: string, characterId: string, data: {
    characterName?: string;
    gender?: string;
    age?: string;
    description?: string;
    characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App';
    imageBase64Array?: string[];
  }) => api.put(`/api/gruvi/characters/${userId}/${characterId}`, data),
  
  getUserCharacters: (userId: string) => 
    api.get(`/api/gruvi/characters/${userId}`),
  
  deleteCharacter: (userId: string, characterId: string) => 
    api.delete(`/api/gruvi/characters/${userId}/${characterId}`),
};

export default api; 