import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getToken } from '../utils/storage';

/**
 * Component to initialize token from HTTP-only cookies on application startup
 * This should be placed near the root of your application
 */
const AuthInitializer: React.FC = () => {
  const { updateToken } = useAuth();
  
  useEffect(() => {
    // Check for token in cookies
    const token = getToken();
    if (token) {
      // Set the token in Redux
      updateToken(token);
    }
  }, [updateToken]);
  
  // This component doesn't render anything
  return null;
};

export default AuthInitializer; 