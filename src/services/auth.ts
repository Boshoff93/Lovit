import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface User {
  userId: string;
  username: string;
  email: string;
  isVerified: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  // Email signup
  signupWithEmail: async (email: string, password: string, username: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password,
        username
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Email login
  loginWithEmail: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Google login/signup
  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        token: idToken
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify email with token
  verifyEmail: async (token: string): Promise<void> => {
    try {
      await axios.get(`${API_BASE_URL}/auth/verify-email/${token}`);
    } catch (error) {
      throw error;
    }
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-verification`, {
        email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/password-reset`, {
        email
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Load Google Auth API
  loadGoogleAuth: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if the Google API script is already loaded
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.gapi.auth2
            .init({
              client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
            })
            .then(() => resolve())
            .catch((error: any) => reject(error));
        });
      } else {
        // Load the Google API script dynamically
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          window.gapi.load('auth2', () => {
            window.gapi.auth2
              .init({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
              })
              .then(() => resolve())
              .catch((error: any) => reject(error));
          });
        };
        script.onerror = (error) => reject(error);
        document.head.appendChild(script);
      }
    });
  },

  // Get Google auth instance
  getGoogleAuthInstance: async () => {
    if (!window.gapi || !window.gapi.auth2) {
      await authService.loadGoogleAuth();
    }
    return window.gapi.auth2.getAuthInstance();
  },

  // Sign in with Google and get ID token
  signInWithGoogle: async (): Promise<string> => {
    try {
      const authInstance = await authService.getGoogleAuthInstance();
      const googleUser = await authInstance.signIn();
      return googleUser.getAuthResponse().id_token;
    } catch (error) {
      throw error;
    }
  },

  // Store authentication data
  storeAuthData: (data: AuthResponse): void => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// For TypeScript
declare global {
  interface Window {
    gapi: any;
  }
} 