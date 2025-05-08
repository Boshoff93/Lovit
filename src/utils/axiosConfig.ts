import axios from 'axios';
import { store } from '../store/store';
import { refreshToken, logout } from '../store/authSlice';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

// Create a base axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true // Enable sending cookies across domains
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For multipart/form-data requests, don't manually set Content-Type
    // Let the browser set it with the proper boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const state = store.getState();
        const currentToken = state.auth.token;
        
        if (currentToken) {
          // Use the refreshToken thunk directly since we can't use hooks outside of components
          const result = await store.dispatch(refreshToken(currentToken));
          
          if (refreshToken.fulfilled.match(result)) {
            // Get the new token from the store
            const newToken = store.getState().auth.token;
            
            // Update the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            // Retry the original request
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // If token refresh fails, dispatch logout action
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 