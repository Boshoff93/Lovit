import api from '../utils/axiosConfig';
import { createAuthenticatedRequest } from '../store/authSlice';

// Character interface
export interface Character {
  characterId: string;
  userId: string;
  characterName: string;
  characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App' | 'Business';
  gender?: string;
  age?: string;
  description?: string;
  imageUrls?: string[];
  imageKeys?: string[];
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

// User profile API
export const userApi = {
  getAccount: () => 
    api.get('/api/user/account'),
  
  updateProfile: (data: { name?: string; artistName?: string; directorName?: string }) => 
    api.put('/api/user/profile', data),
};

// User subscription API
export const subscriptionApi = {
  getUserSubscription: () =>
    api.get('/api/user/subscription'),

  createCheckoutSession: (priceId: string, productId: string, allowPriceSwitch = true) =>
    api.post('/api/create-checkout-session', { priceId, productId, allowPriceSwitch }),

  createPortalSession: () =>
    api.post('/api/create-portal-session'),

  // End trial immediately and convert to paid subscription
  endTrialNow: () =>
    api.post<{ success: boolean; subscriptionId: string; status: string; message: string }>('/api/stripe/end-trial'),
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
    trackType?: 'standard' | 'premium'; // 'premium' uses ElevenLabs for higher quality
    premiumDurationMs?: number; // Duration in ms for premium tracks (30000-180000)
    forceInstrumental?: boolean; // For premium tracks: true = instrumental only, false = with lyrics
    rouletteMode?: boolean; // If true, AI picks video concept based on track (ignores prompt & characters)
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
  
  /**
   * Upload a user's own song file
   */
  uploadSong: (userId: string, formData: FormData, onProgress?: (progress: number) => void) =>
    api.post(`/api/gruvi/songs/${userId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }),

  /**
   * Enhance a user's song prompt with AI
   */
  enhancePrompt: async (prompt: string, options?: { genre?: string; mood?: string; characters?: Array<{ characterName: string }> }) => {
    const response = await api.post('/api/gruvi/enhance-prompt', {
      prompt,
      genre: options?.genre,
      mood: options?.mood,
      characters: options?.characters,
    });
    return response.data as { originalPrompt: string; enhancedPrompt: string };
  },
};

// Videos API
export const videosApi = {
  generateVideo: (data: {
    userId: string;
    songId?: string | null; // Required for music videos, optional for other types
    narrativeId?: string | null; // Required for story/ugc-voiceover videos
    videoType: 'still' | 'standard' | 'professional'; // still=slideshow, standard=Seedance, professional=Kling
    style?: string;
    videoPrompt?: string;
    aspectRatio?: 'portrait' | 'landscape';
    characterIds?: string[];
    placeDescription?: string; // Optional: User's description of their property/location for web search
    creativity?: number; // 0-10: 0 = exact prompt adherence, 10 = creative interpretation
    rouletteMode?: boolean; // Let AI pick the video concept based on the track
    videoContentType?: 'music' | 'story' | 'ugc-voiceover' | 'ugc-avatar'; // Specific video content type
    avatarVideoDuration?: 5 | 10 | 15; // Duration for avatar videos in seconds
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
  generateSocialMetadata: (userId: string, videoId: string, data?: { location?: string; userContext?: string }) =>
    api.post(`/api/gruvi/videos/${userId}/${videoId}/social-metadata`, data || {}),
  
  getSocialMetadata: (userId: string, videoId: string) =>
    api.get(`/api/gruvi/videos/${userId}/${videoId}/social-metadata`),
  
  updateSocialMetadata: (userId: string, videoId: string, data: {
    title?: string;
    description?: string;
    tags?: string[];
    hook?: string;
    location?: string;
    videoFooter?: string;
  }) => api.put(`/api/gruvi/videos/${userId}/${videoId}/social-metadata`, data),
  
  generateSocialThumbnail: (userId: string, videoId: string, data: {
    hookText: string;
    thumbnailDescription?: string;
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
  
  // Batch Social Upload (background processing with email notification)
  batchSocialUpload: (userId: string, videoId: string, data: {
    platforms: string[];
    addThumbnailIntro?: boolean;
    tiktokSettings?: {
      postMode: 'draft' | 'direct';
      privacyLevel: string;
      allowComment: boolean;
      allowDuet: boolean;
      allowStitch: boolean;
      discloseContent: boolean;
      brandOrganic: boolean;
      brandedContent: boolean;
    };
  }) => api.post(`/api/gruvi/videos/${userId}/${videoId}/batch-social-upload`, data),
  
  // Get social upload status (for polling)
  getSocialUploadStatus: (userId: string, videoId: string) =>
    api.get(`/api/gruvi/videos/${userId}/${videoId}/social-upload-status`),
  
  // Reset social upload status to idle (used when dismissing the status banner)
  // If platform is provided, only dismiss that platform; otherwise dismiss all
  resetSocialUploadStatus: (userId: string, videoId: string, platform?: string) =>
    api.delete(`/api/gruvi/videos/${userId}/${videoId}/social-upload-status${platform ? `?platform=${platform}` : ''}`),
  
  /**
   * Get presigned URL for direct S3 video upload
   */
  getUploadUrl: (userId: string, data: { fileName: string; fileType: string; fileSize: number }) =>
    api.post(`/api/gruvi/videos/${userId}/get-upload-url`, data),

  /**
   * Finalize video upload after direct S3 upload
   */
  finalizeUpload: (userId: string, data: {
    videoId: string;
    videoKey: string;
    title: string;
    description?: string;
    aspectRatio?: string;
  }) =>
    api.post(`/api/gruvi/videos/${userId}/finalize-upload`, data),

  /**
   * Upload a user's own video file (legacy - through server, for small files)
   */
  uploadVideo: (userId: string, formData: FormData, onProgress?: (progress: number) => void) =>
    api.post(`/api/gruvi/videos/${userId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000, // 10 minutes for large video uploads
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }),
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

// TikTok API
export const tiktokApi = {
  getAuthUrl: (userId: string) =>
    api.get(`/api/gruvi/tiktok/auth-url?userId=${userId}`),

  handleCallback: (code: string, state: string) =>
    api.post('/api/public/tiktok/callback', { code, state }),

  getStatus: (userId: string) =>
    api.get(`/api/gruvi/tiktok/status?userId=${userId}`),

  // Get creator info for posting UI (required by TikTok UX guidelines)
  getCreatorInfo: (userId: string) =>
    api.get(`/api/gruvi/tiktok/creator-info?userId=${userId}`),

  disconnect: (userId: string) =>
    api.delete(`/api/gruvi/tiktok/disconnect?userId=${userId}`),

  upload: (userId: string, videoId: string) =>
    api.post(`/api/gruvi/videos/${userId}/${videoId}/tiktok-upload`),
};

// Instagram API
export const instagramApi = {
  getAuthUrl: (userId: string) =>
    api.get(`/api/gruvi/instagram/auth-url?userId=${userId}`),
  
  handleCallback: (code: string, state: string) =>
    api.post('/api/gruvi/instagram/callback', { code, state }),
  
  getStatus: (userId: string) =>
    api.get(`/api/gruvi/instagram/status?userId=${userId}`),
  
  disconnect: (userId: string) =>
    api.delete(`/api/gruvi/instagram/disconnect?userId=${userId}`),
  
  upload: (userId: string, videoId: string) =>
    api.post(`/api/gruvi/videos/${userId}/${videoId}/instagram-upload`),
};

// Facebook API (uses same OAuth as Instagram)
export const facebookApi = {
  // Facebook uses same auth flow as Instagram - no separate auth needed
  getStatus: (userId: string) =>
    api.get(`/api/gruvi/facebook/status?userId=${userId}`),

  disconnect: (userId: string) =>
    api.delete(`/api/gruvi/facebook/disconnect?userId=${userId}`),

  upload: (userId: string, videoId: string) =>
    api.post(`/api/gruvi/videos/${userId}/${videoId}/facebook-upload`),
};

// LinkedIn API
export const linkedinApi = {
  getAuthUrl: (userId: string) =>
    api.get(`/api/gruvi/linkedin/auth-url?userId=${userId}`),
  
  handleCallback: (code: string, state: string) =>
    api.post('/api/gruvi/linkedin/callback', { code, state }),
  
  getStatus: (userId: string) =>
    api.get(`/api/gruvi/linkedin/status?userId=${userId}`),
  
  disconnect: (userId: string) =>
    api.delete(`/api/gruvi/linkedin/disconnect?userId=${userId}`),
  
  upload: (userId: string, videoId: string) =>
    api.post(`/api/gruvi/videos/${userId}/${videoId}/linkedin-upload`),
};

// Characters API
export const charactersApi = {
  createCharacter: (data: {
    userId: string;
    characterName: string;
    gender?: string;
    age?: string;
    description?: string;
    characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App' | 'Business';
    imageBase64Array: string[];
  }) => api.post('/api/gruvi/characters', data),
  
  updateCharacter: (userId: string, characterId: string, data: {
    characterName?: string;
    gender?: string;
    age?: string;
    description?: string;
    characterType?: 'Human' | 'Non-Human' | 'Product' | 'Place' | 'App' | 'Business';
    imageBase64Array?: string[];
    keepImageKeys?: string[];
  }) => api.put(`/api/gruvi/characters/${userId}/${characterId}`, data),
  
  getUserCharacters: (userId: string) => 
    api.get(`/api/gruvi/characters/${userId}`),
  
  deleteCharacter: (userId: string, characterId: string) =>
    api.delete(`/api/gruvi/characters/${userId}/${characterId}`),
};

// Scheduled Posts interface
export interface ScheduledPost {
  userId: string;
  scheduleId: string;
  videoId: string;
  platforms: Array<{
    platform: string;
    accountId?: string;
    accountName?: string;
  }>;
  scheduledTime: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  hook?: string;
  tags?: string[];
  videoFooter?: string;
  aspectRatio?: 'portrait' | 'landscape';
  status: 'scheduled' | 'publishing' | 'published' | 'partial' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  uploadResults?: Array<{
    platform: string;
    success: boolean;
    postId?: string;
    postUrl?: string;
    error?: string;
  }>;
}

// Scheduled Posts API
export const scheduledPostsApi = {
  // Create a new scheduled post
  createScheduledPost: (data: {
    videoId: string;
    platforms: Array<{ platform: string; accountId?: string; accountName?: string }>;
    scheduledTime: string;
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    hook?: string;
    tags?: string[];
    videoFooter?: string;
    aspectRatio?: 'portrait' | 'landscape';
  }) => api.post('/api/gruvi/scheduled-posts', data),

  // Get all scheduled posts for the current user
  getScheduledPosts: () =>
    api.get<{ scheduledPosts: ScheduledPost[] }>('/api/gruvi/scheduled-posts'),

  // Get a specific scheduled post
  getScheduledPost: (scheduleId: string) =>
    api.get<{ scheduledPost: ScheduledPost }>(`/api/gruvi/scheduled-posts/${scheduleId}`),

  // Cancel a scheduled post
  cancelScheduledPost: (scheduleId: string) =>
    api.delete(`/api/gruvi/scheduled-posts/${scheduleId}`),
};

// Swap Studio API - Character/Motion Swap
export const swapStudioApi = {
  // Create a motion capture swap using S3 key + character reference
  createSwap: (data: {
    userId: string;
    sourceVideoKey: string;
    videoDuration: number; // Duration in seconds for pricing calculation
    characterId?: string;
    characterPrompt?: string;
    artStyle?: string;
    swapMode: 'wan-replace' | 'wan-move' | 'kling-motion';
    klingPrompt?: string;
    characterOrientation?: 'image' | 'video';
    enableVoiceChange?: boolean;
    voiceId?: string;
    removeBackgroundNoise?: boolean;
  }) => api.post('/api/gruvi/swap-studio/create', data),

  // Get swap status
  getSwapStatus: (userId: string, swapId: string) =>
    api.get(`/api/gruvi/swap-studio/${userId}/${swapId}`),

  // Get all swaps for user
  getUserSwaps: (userId: string) =>
    api.get(`/api/gruvi/swap-studio/${userId}`),

  // Delete a swap
  deleteSwap: (userId: string, swapId: string) =>
    api.delete(`/api/gruvi/swap-studio/${userId}/${swapId}`),
};

// Alias for the new name
export const motionCaptureApi = swapStudioApi;

// Narrative interface
export interface NarratorVoice {
  id: string;
  voiceId: string;
  label: string;
  description: string;
  isPremium: boolean;
}

export interface Narrative {
  narrativeId: string;
  userId: string;
  title: string;
  text: string;
  voiceId: string;
  narratorId: string;
  narrativeType?: 'story' | 'ugc';
  characterIds?: string[];
  generatedText?: string; // AI-generated narrative text (for story/ugc modes)
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  progressMessage: string;
  audioUrl?: string;
  audioKey?: string;
  durationMs?: number;
  tokensCost: number;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

// Narratives API - Text-to-Speech
export const narrativesApi = {
  // Get available narrator voices
  getVoices: () =>
    api.get<{ voices: NarratorVoice[]; freeVoiceIds: string[] }>('/api/gruvi/narratives/voices'),

  // Create a new narrative (text-to-speech or AI-generated content)
  createNarrative: (data: {
    userId: string;
    text: string;
    narratorId: string;
    title?: string;
    characterIds?: string[];
    narrativeType?: 'story' | 'ugc';
  }) => api.post<{
    narrativeId: string;
    status: string;
    tokensCost: number;
    tokensRemaining: number;
  }>(`/api/gruvi/narratives/${data.userId}`, data),

  // Get single narrative
  getNarrative: (userId: string, narrativeId: string) =>
    api.get<Narrative>(`/api/gruvi/narratives/${userId}/${narrativeId}`),

  // Get all narratives for user
  getUserNarratives: (userId: string) =>
    api.get<{ narratives: Narrative[] }>(`/api/gruvi/narratives/${userId}`),

  // Delete a narrative
  deleteNarrative: (userId: string, narrativeId: string) =>
    api.delete(`/api/gruvi/narratives/${userId}/${narrativeId}`),
};

export default api; 