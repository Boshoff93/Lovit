import axios from 'axios';
import { Photo, TrainingModel, GeneratedImage, ApiResponse } from '../types';

// In a real app, this would come from environment variables
const API_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export default {
  uploadPhotos,
  getPhotos,
  trainModel,
  getModelStatus,
  getModels,
  generateImage,
  getGeneratedImages,
}; 