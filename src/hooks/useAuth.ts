import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { 
  loginWithEmail, 
  signupWithEmail, 
  loginWithGoogle, 
  logout, 
  setPremiumStatus,
  setToken,
  setUser,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  refreshToken
} from '../store/authSlice';
import { signInWithGoogle } from '../utils/googleAuth';
import { getToken as getStoredToken, storeAuthData as storeData, AuthData, User } from '../utils/storage';

// Authentication custom hook
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isPremiumMember, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Login with email and password
  const login = async (email: string, password: string) => {
    return dispatch(loginWithEmail({ email, password }));
  };

  // Sign up with email, password, and username
  const signup = async (email: string, password: string, username: string) => {
    return dispatch(signupWithEmail({ email, password, username }));
  };

  // Login with Google
  const googleLogin = async (idToken: string) => {
    return dispatch(loginWithGoogle(idToken));
  };

  // Get Google ID token (does NOT make authentication API call)
  const getGoogleIdToken = async () => {
    return signInWithGoogle();
  };

  // Verify email with token and userId
  const verifyUserEmail = async (token: string, userId: string) => {
    return dispatch(verifyEmail({ token, userId }));
  };

  // Resend verification email
  const resendVerificationEmail = async (email: string) => {
    return dispatch(resendVerification(email));
  };

  // Request password reset email
  const resetPassword = async (email: string) => {
    return dispatch(requestPasswordReset(email));
  };

  // Refresh auth token
  const refreshAuthToken = async () => {
    // First check if we have a token to refresh
    const currentToken = token || getStoredToken();
    if (!currentToken) {
      throw new Error('No token available to refresh');
    }
    return dispatch(refreshToken(currentToken));
  };

  // Sign out user
  const signout = () => {
    dispatch(logout());
  };

  // Set premium membership status
  const setPremium = (status: boolean) => {
    dispatch(setPremiumStatus(status));
  };

  // Set token manually (useful when retrieving from cookies)
  const updateToken = (newToken: string) => {
    dispatch(setToken(newToken));
  };

  // Set user manually
  const updateUser = (newUser: User) => {
    dispatch(setUser(newUser));
  };

  // Store auth data (token in cookies, user in Redux)
  const storeAuthData = (data: AuthData) => {
    // Store token in cookies
    storeData(data);
    
    // Update Redux state (will be persisted by redux-persist)
    dispatch(setToken(data.token));
    dispatch(setUser(data.user));
  };

  // Check if user is authenticated
  const isAuthenticated = !!token;

  return {
    user,
    token,
    isPremiumMember,
    isLoading,
    error,
    isAuthenticated,
    login,
    signup,
    googleLogin,
    getGoogleIdToken,
    verifyUserEmail,
    resendVerificationEmail,
    resetPassword,
    refreshAuthToken,
    signout,
    setPremium,
    updateToken,
    updateUser,
    storeAuthData
  };
}; 