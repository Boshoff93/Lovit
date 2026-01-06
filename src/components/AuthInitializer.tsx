import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getToken, clearAuthData } from '../utils/storage';
import { setToken, refreshUserData, fetchSubscription, logout } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Component to initialize auth state on application startup.
 * - If redux-persist has a token, use it and fetch user data if needed
 * - If no token in Redux but there's one in cookies, sync it to Redux
 * - Blocks rendering until auth state is fully initialized
 */
const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token: reduxToken, user } = useSelector((state: RootState) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // First, check if we have a token in Redux (from redux-persist)
      let token = reduxToken;

      // If no token in Redux, check cookies as fallback
      if (!token) {
        const cookieToken = getToken();
        if (cookieToken) {
          token = cookieToken;
          dispatch(setToken(cookieToken));
        }
      }

      // If we have a token but no user data, fetch it from the server
      if (token && !user) {
        try {
          const result = await dispatch(refreshUserData()).unwrap();
          // If we got user data, also fetch subscription
          if (result) {
            await dispatch(fetchSubscription());
          }
        } catch (error) {
          // Token is invalid or expired - clear everything and log out
          console.error('Failed to fetch user data, clearing auth state:', error);
          clearAuthData();
          dispatch(logout());
        }
      }

      setIsInitialized(true);
    };

    initAuth();
  }, []); // Run only once on mount

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

export default AuthInitializer;
