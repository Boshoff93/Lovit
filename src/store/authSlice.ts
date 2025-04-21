import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, storeAuthData, getToken, clearAuthData } from '../utils/storage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isPremiumMember: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: getToken(),
  isPremiumMember: false,
  isLoading: false,
  error: null
};

// Async thunks for authentication
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ token, userId }: { token: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify-email`, {
        params: { token, userId }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Email verification failed');
    }
  }
);

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-verification`, {
        email
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to resend verification email');
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/password-reset`, {
        email
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to request password reset');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (currentToken: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        token: currentToken
      });
      
      // Store the new token in cookies
      storeAuthData(response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to refresh token');
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      // Store auth data in cookies and localStorage
      storeAuthData(response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const signupWithEmail = createAsyncThunk(
  'auth/signupWithEmail',
  async ({ email, password, username }: { email: string; password: string; username: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password,
        username
      });
      
      // Store auth data in cookies and localStorage
      storeAuthData(response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Signup failed');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        token: idToken
      });
      
      // Store auth data in cookies and localStorage
      storeAuthData(response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Google login failed');
    }
  }
);

// Create axios instance with auth header
export const createAuthenticatedRequest = (token: string) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set premium status
    setPremiumStatus: (state, action: PayloadAction<boolean>) => {
      state.isPremiumMember = action.payload;
    },
    // Logout action
    logout: (state) => {
      // Clear cookies and local storage
      clearAuthData();
      
      // Reset state
      state.user = null;
      state.token = null;
      state.isPremiumMember = false;
      state.error = null;
    },
    // Set token manually (useful for restoring from storage)
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    // Set user manually
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login with email
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Signup with email
    builder
      .addCase(signupWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login with Google
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
      
    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        // If user exists, update verification status
        if (state.user) {
          state.user.isVerified = true;
        }
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Resend Verification Email
    builder
      .addCase(resendVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Request Password Reset
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { 
  setPremiumStatus, 
  logout, 
  setToken, 
  setUser,
  clearError 
} = authSlice.actions;

export default authSlice.reducer; 