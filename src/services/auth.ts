import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

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
  verifyEmail: async (token: string, userId: string): Promise<void> => {
    try {
      await axios.get(`${API_BASE_URL}/auth/verify-email?token=${token}&userId=${userId}`);
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
    // Set HTTP-only cookie with token instead of localStorage
    document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Strict; Secure`;
    
    // Still store non-sensitive user data in localStorage for easy access
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  // Get token from cookies
  getToken: (): string | null => {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
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
    return !!authService.getToken();
  },

  // Logout
  logout: (): void => {
    // Clear the cookie by setting expired date
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
    localStorage.removeItem('user');
  }
};

// For TypeScript
declare global {
  interface Window {
    gapi: any;
  }
} 