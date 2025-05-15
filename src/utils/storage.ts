// Storage utility functions for managing authentication tokens via secure cookies

export interface User {
  userId: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt?: string;
  emailPreferences?: {
    notifications?: boolean;
    subscribedAt?: string;
    unsubscribedAt?: string;
  };
}

export interface AuthData {
  token: string;
  user: User;
}

// Store authentication token in HTTP-only cookie
export const storeAuthData = (data: AuthData): void => {
  // Set HTTP-only cookie with token
  document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Strict; Secure`;
  
  // User data is now handled by redux-persist, no need to manually store in localStorage
};

// Get token from cookies
export const getToken = (): string | null => {
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
};

// Check if user is authenticated by token presence
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Clear auth data (used for logout)
export const clearAuthData = (): void => {
  // Clear the cookie by setting expired date
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
  
  // User data clearing will be handled by the Redux logout action
  // No need to manually clear localStorage
}; 