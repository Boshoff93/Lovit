export interface Photo {
  id: string;
  url: string;
  filename: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  gender: string;
  age: number;
  height: string;
  ethnicity: string;
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  bodyType: string;
  breastSize?: string; // Optional, only applicable for certain genders
}

export interface TrainingModel {
  id: string;
  status: 'pending' | 'training' | 'completed' | 'failed';
  progress?: number;
  createdAt: string;
  userProfile?: UserProfile;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  modelId: string;
  createdAt: string;
}

export interface PromptData {
  prompt: string;
  negativePrompt: string;
  orientation: string;
  numberOfImages: number;
  uploadedClothImage?: File | null;
  seedNumber?: string;
  useSeed: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
} 