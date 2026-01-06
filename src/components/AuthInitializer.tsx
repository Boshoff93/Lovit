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
      // Get token from Redux or cookies
      let token = reduxToken;
      if (!token) {
        const cookieToken = getToken();
        if (cookieToken) {
          token = cookieToken;
          dispatch(setToken(cookieToken));
        }
      }

      // If we have a token, ensure we have user data
      if (token) {
        if (!user) {
          try {
            await dispatch(refreshUserData()).unwrap();
            await dispatch(fetchSubscription());
          } catch {
            // Token is invalid - clear everything
            clearAuthData();
            dispatch(logout());
          }
        }
      } else {
        // No token anywhere - ensure clean logged out state
        if (user) {
          dispatch(logout());
        }
      }

      setIsInitialized(true);
    };

    initAuth();
  }, [dispatch, reduxToken, user]);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

export default AuthInitializer;
