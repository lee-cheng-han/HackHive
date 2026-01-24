import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { VoiceTranscriptionResponse, ApiError } from '../types/api';
import { Story } from '../types/story';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      // Could redirect to login here
    }
    return Promise.reject(error);
  }
);

// Story API
export const storyApi = {
  getStory: async (storyId: string): Promise<Story> => {
    const response = await api.get(`/stories/${storyId}`);
    return response.data;
  },

  listStories: async (params: { language?: string; level?: string; limit?: number; offset?: number }) => {
    const response = await api.get('/stories', { params });
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/recommendations');
    return response.data;
  },
};

// Voice API
export const voiceApi = {
  transcribe: async (audioBlob: Blob, languageCode: string): Promise<VoiceTranscriptionResponse> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('language_code', languageCode);
    
    try {
      const response = await api.post('/voice-to-text', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000, // 10 second timeout
      });
      
      return response.data;
    } catch (error: any) {
      // Re-throw with more context
      if (error.response) {
        // Server responded with error
        throw error;
      } else if (error.request) {
        // Request made but no response (backend not running)
        throw new Error('Backend server is not running. Please start it with: cd backend && python run.py');
      } else {
        // Something else happened
        throw error;
      }
    }
  },
};

// User API
export const userApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  register: async (data: { email: string; password: string; name: string; preferred_language: string }) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProgress: async (storyId: string, sceneId: string, status: string) => {
    const response = await api.post('/user/progress', {
      story_id: storyId,
      current_scene: sceneId,
      status,
    });
    return response.data;
  },
};

export default api;

