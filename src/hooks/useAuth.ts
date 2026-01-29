import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { 
  loginWithEmail, 
  signupWithEmail, 
  loginWithGoogle, 
  logout as logoutAction,
  setSubscription,
  setToken,
  setUser,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  confirmPasswordReset,
  refreshToken,
  fetchSubscription,
  createCheckoutSession,
  createPortalSession,
  setAllowances,
  Subscription,
  Allowances
} from '../store/authSlice';
import { signInWithGoogle } from '../utils/googleAuth';
import { getToken as getStoredToken, storeAuthData as storeData, clearAuthData, AuthData, User } from '../utils/storage';
import { logoutAllState } from '../store/actions';
import { useEffect, useState, useCallback } from 'react';

// Authentication custom hook
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, subscription, allowances, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Login with email and password
  const login = useCallback(async (email: string, password: string) => {
    return dispatch(loginWithEmail({ email, password }));
  }, [dispatch]);

  // Sign up with email, password, and username
  const signup = useCallback(async (email: string, password: string, username: string, turnstileToken?: string) => {
    return dispatch(signupWithEmail({ email, password, username, turnstileToken }));
  }, [dispatch]);

  // Login with Google
  const googleLogin = useCallback(async (accessToken: string) => {
    return dispatch(loginWithGoogle(accessToken));
  }, [dispatch]);

  // Get Google access token (does NOT make authentication API call)
  const getGoogleIdToken = useCallback(async () => {
    return signInWithGoogle();
  }, []);

  // Verify email with token and userId
  const verifyUserEmail = useCallback((token: string, userId: string) => {
    return dispatch(verifyEmail({ token, userId }));
  }, [dispatch]);

  // Resend verification email
  const resendVerificationEmail = useCallback((email: string) => {
    return dispatch(resendVerification(email));
  }, [dispatch]);

  // Request password reset email
  const resetPassword = useCallback((email: string) => {
    return dispatch(requestPasswordReset(email));
  }, [dispatch]);

  // Confirm password reset with token and new password
  const confirmResetPassword = useCallback((token: string, newPassword: string, userId?: string) => {
    return dispatch(confirmPasswordReset({ token, newPassword, userId }));
  }, [dispatch]);

  // Refresh auth token
  const refreshAuthToken = useCallback((currentToken: string) => {
    return dispatch(refreshToken(currentToken));
  }, [dispatch]);

  // Sign out user
  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  // Get user subscription data
  const getUserSubscription = useCallback(() => {
    return dispatch(fetchSubscription());
  }, [dispatch]);

  // Create checkout session
  const createStripeCheckout = useCallback((priceId: string, productId: string) => {
    return dispatch(createCheckoutSession({ priceId, productId }));
  }, [dispatch]);

  // Create portal session
  const createStripePortal = useCallback(() => {
    return dispatch(createPortalSession());
  }, [dispatch]);

  // Update subscription data
  const updateSubscription = useCallback((subscriptionData: Subscription) => {
    dispatch(setSubscription(subscriptionData));
  }, [dispatch]);

  // Update allowances data
  const updateAllowances = useCallback((allowancesData: Allowances) => {
    dispatch(setAllowances(allowancesData));
  }, [dispatch]);

  // Set token manually (useful when retrieving from cookies)
  const updateToken = useCallback((newToken: string) => {
    dispatch(setToken(newToken));
  }, [dispatch]);

  // Set user manually
  const updateUser = useCallback((newUser: User) => {
    dispatch(setUser(newUser));
  }, [dispatch]);

  // Store auth data (token in cookies, user in Redux)
  const storeAuthData = useCallback((data: AuthData) => {
    // Store token in cookies
    storeData(data);
    
    // Update Redux state (will be persisted by redux-persist)
    dispatch(setToken(data.token));
    dispatch(setUser(data.user));
  }, [dispatch]);

  // Check if user is authenticated
  const isAuthenticated = !!token;

  return {
    user,
    token,
    subscription,
    allowances,
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
    confirmResetPassword,
    refreshAuthToken,
    getUserSubscription,
    createStripeCheckout,
    createStripePortal,
    updateSubscription,
    updateAllowances,
    logout,
    updateToken,
    updateUser,
    storeAuthData
  };
}; 