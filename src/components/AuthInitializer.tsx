import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getToken, clearAuthData } from '../utils/storage';
import { setToken, refreshUserData, fetchSubscription, logout } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Component to initialize auth state on application startup.
 * Ensures we have valid auth state before rendering the app.
 */
const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token: reduxToken, user } = useSelector((state: RootState) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);
  const initStarted = useRef(false);

  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initStarted.current) return;
    initStarted.current = true;

    const initAuth = async () => {
      console.log('[AuthInitializer] Starting auth initialization...');
      console.log('[AuthInitializer] Redux token:', reduxToken ? 'exists' : 'null');
      console.log('[AuthInitializer] Redux user:', user ? user.email : 'null');

      // Get token from Redux or cookies
      let token = reduxToken;
      if (!token) {
        const cookieToken = getToken();
        console.log('[AuthInitializer] Cookie token:', cookieToken ? 'exists' : 'null');
        if (cookieToken) {
          token = cookieToken;
          dispatch(setToken(cookieToken));
        }
      }

      // If we have a token, ensure we have user data
      if (token) {
        if (!user) {
          console.log('[AuthInitializer] Have token but no user, fetching user data...');
          try {
            await dispatch(refreshUserData()).unwrap();
            console.log('[AuthInitializer] User data fetched successfully');
            await dispatch(fetchSubscription());
            console.log('[AuthInitializer] Subscription fetched successfully');
          } catch (error) {
            // Token is invalid - clear everything
            console.error('[AuthInitializer] Failed to fetch user data, logging out:', error);
            clearAuthData();
            dispatch(logout());
          }
        } else {
          console.log('[AuthInitializer] Already have user data, skipping fetch');
        }
      } else {
        // No token anywhere - ensure clean logged out state
        console.log('[AuthInitializer] No token found, ensuring logged out state');
        if (user) {
          // We have user but no token - inconsistent state, clear it
          console.log('[AuthInitializer] Found user without token, clearing...');
          dispatch(logout());
        }
      }

      console.log('[AuthInitializer] Initialization complete');
      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch, reduxToken, user]);

  // Block rendering until initialized
  if (!isInitialized) {
    console.log('[AuthInitializer] Not yet initialized, blocking render');
    return null;
  }

  return <>{children}</>;
};

export default AuthInitializer;
