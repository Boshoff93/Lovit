import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, storeAuthData, getToken, clearAuthData, storeToken } from '../utils/storage';
import api from '../utils/axiosConfig';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

// Define subscription tier type
export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'premium';

// Define subscription interface
export interface Subscription {
  tier: SubscriptionTier;
  status: string;
  subscriptionId?: string;
  customerId?: string;
  currentPeriodStart?: number;
  currentPeriodEnd: number;
}

// Define allowance interface
export interface Allowance {
  used: number;
  max: number;
  topup: number;
}

// Define allowances interface
export interface Allowances {
  aiPhotos: Allowance;
  aiModels: Allowance;
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  subscription: Subscription;
  allowances: Allowances | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: getToken(),
  subscription: {
    tier: 'free',
    status: 'active',
    currentPeriodEnd: -1
  },
  allowances: null,
  isLoading: false,
  error: null
};

// Async thunks for authentication
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ token, userId }: { token: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/verify-email`, {
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
      const response = await api.post(`/auth/resend-verification`, {
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
      const response = await api.post(`/auth/password-reset`, {
        email
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to request password reset');
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async ({ token, newPassword, userId }: { token: string; newPassword: string; userId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/reset-password-confirm`, {
        token,
        newPassword,
        userId
      });
      
      // Store auth data in cookies and localStorage if login successful
      if (response.data.token) {
        storeAuthData(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Password reset failed');
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/login`, {
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
      const response = await api.post(`/auth/signup`, {
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
      const response = await api.post(`/auth/google`, {
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

// Add the missing refreshToken thunk
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (currentToken: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/refresh-token`, {
        token: currentToken
      });
      if (response.data.token) {
        storeToken(response.data.token);
        return response.data.token; // <-- Only return the token
      }
      throw new Error('No token in response');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Token refresh failed');
    }
  }
);

// Create axios instance with auth header
export const createAuthenticatedRequest = (token: string) => {
  return axios.create({
    baseURL: API_BASE_URL,
  });
};

// Add thunk for fetching user subscription data
export const fetchSubscription = createAsyncThunk(
  'auth/fetchSubscription',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      
      if (!auth.token) {
        return rejectWithValue('No auth token available');
      }
      
      const response = await api.get(`/api/user/subscription`);
      
      return response.data.subscription;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch subscription data');
    }
  }
);

// Create checkout session thunk
export const createCheckoutSession = createAsyncThunk(
  'auth/createCheckoutSession',
  async ({ priceId, productId }: { priceId: string; productId: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      
      if (!auth.token) {
        return rejectWithValue('No auth token available');
      }
      
      const response = await api.post(
        `/api/create-checkout-session`,
        { priceId, productId }
      );
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create checkout session');
    }
  }
);

// Create customer portal session thunk
export const createPortalSession = createAsyncThunk(
  'auth/createPortalSession',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      
      if (!auth.token) {
        return rejectWithValue('No auth token available');
      }
      
      const response = await api.post(
        `/api/create-portal-session`,
        {}
      );
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create portal session');
    }
  }
);

// Add thunk for updating email preferences
export const updateEmailPreferences = createAsyncThunk(
  'auth/updateEmailPreferences',
  async ({ notifications }: { notifications: boolean }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      
      if (!auth.token) {
        return rejectWithValue('No auth token available');
      }
      
      const response = await api.post(
        `/api/user/email-preferences`,
        { notifications }
      );
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update email preferences');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set subscription data
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = {
        ...action.payload,
        currentPeriodEnd: action.payload.currentPeriodEnd || -1
      };
    },
    // Logout action
    logout: (state) => {
      // Clear cookies and local storage
      clearAuthData();
      
      // Reset state
      state.user = null;
      state.token = null;
      state.subscription = {
        tier: 'free',
        status: 'active',
        currentPeriodEnd: -1
      };
      state.allowances = null;
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
    },
    // Add this action to set allowances
    setAllowances: (state, action: PayloadAction<Allowances>) => {
      state.allowances = action.payload;
    },
    // Update AI Photos allowance based on number of images generated
    updateAiPhotoAllowance: (state, action: PayloadAction<number>) => {
      if (state.allowances && state.allowances.aiPhotos) {
        state.allowances.aiPhotos.used += action.payload;
      }
    },
    // Update AI Models allowance when creating a new model
    updateAiModelAllowance: (state, action: PayloadAction<number>) => {
      if (state.allowances && state.allowances.aiModels) {
        state.allowances.aiModels.used += action.payload;
      }
    },
    // Add topup to allowances
    addTopupToAllowance: (state, action: PayloadAction<{ type: 'aiPhotos' | 'aiModels', amount: number }>) => {
      if (state.allowances) {
        const { type, amount } = action.payload;
        state.allowances[type].topup += amount;
      }
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

    // Confirm Password Reset
    builder
      .addCase(confirmPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(confirmPasswordReset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
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
        state.token = action.payload; // <-- Use the token directly
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch subscription
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = {
          ...action.payload,
          currentPeriodEnd: action.payload.currentPeriodEnd || -1
        };
        state.error = null;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create checkout session
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create portal session
    builder
      .addCase(createPortalSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPortalSession.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createPortalSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update email preferences
    builder
      .addCase(updateEmailPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEmailPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.emailPreferences = {
            ...state.user.emailPreferences,
            notifications: action.payload.notifications
          };
        }
        state.error = null;
      })
      .addCase(updateEmailPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Export actions and reducer
export const { 
  setSubscription,
  logout, 
  setToken, 
  setUser,
  clearError,
  setAllowances,
  updateAiPhotoAllowance,
  updateAiModelAllowance,
  addTopupToAllowance
} = authSlice.actions;

export default authSlice.reducer; 