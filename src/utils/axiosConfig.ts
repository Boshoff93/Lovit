import axios from 'axios';
import { refreshToken, logout } from '../store/authSlice';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

// Create a base axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true // Enable sending cookies across domains
});

// Track if we're currently refreshing the token to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// We'll set this up after the store is created
let getStore: () => any = () => null;

// Function to set the store getter (called from store.ts after store creation)
export const setStoreGetter = (storeGetter: () => any) => {
  getStore = storeGetter;
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const store = getStore();
    if (!store) return config;
    
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', {
        url: config.url,
        tokenPrefix: token.substring(0, 20) + '...',
        tokenLength: token.length
      });
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
    
    // Log all error responses for debugging
    console.log('API Error:', {
      status: error.response?.status,
      url: originalRequest?.url,
      data: error.response?.data
    });
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const store = getStore();
        if (!store) {
          throw new Error('Store not available');
        }
        
        const state = store.getState();
        const currentToken = state.auth.token;
        
        if (currentToken) {
          // Use the refreshToken thunk directly since we can't use hooks outside of components
          const result = await store.dispatch(refreshToken(currentToken));
          
          if (refreshToken.fulfilled.match(result)) {
            // Get the new token from the thunk result
            const newToken = result.payload;
            // Process any queued requests
            processQueue(null, newToken);
            // Update the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // Retry the original request
            return api(originalRequest);
          } else {
            // Refresh failed
            processQueue(new Error('Token refresh failed'));
            store.dispatch(logout());
            return Promise.reject(error);
          }
        } else {
          processQueue(new Error('No token available'));
          store.dispatch(logout());
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If token refresh fails, dispatch logout action
        processQueue(refreshError);
        const store = getStore();
        if (store) {
          store.dispatch(logout());
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle 403 Forbidden errors (permission/subscription issues)
    if (error.response?.status === 403) {
      console.log('403 Forbidden - Permission denied:', error.response?.data);
      // You might want to redirect to payment page or show subscription error
    }
    
    return Promise.reject(error);
  }
);

export default api; 