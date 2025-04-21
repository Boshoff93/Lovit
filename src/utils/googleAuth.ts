// Google Auth utility functions
// Separated for cleaner code organization, since this isn't directly Redux-related

// Load Google Auth API
export const loadGoogleAuth = (): Promise<void> => {
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
};

// Get Google auth instance
export const getGoogleAuthInstance = async () => {
  if (!window.gapi || !window.gapi.auth2) {
    await loadGoogleAuth();
  }
  return window.gapi.auth2.getAuthInstance();
};

// Sign in with Google and get ID token
export const signInWithGoogle = async (): Promise<string> => {
  try {
    const authInstance = await getGoogleAuthInstance();
    const googleUser = await authInstance.signIn();
    return googleUser.getAuthResponse().id_token;
  } catch (error) {
    throw error;
  }
};

// For TypeScript
declare global {
  interface Window {
    gapi: any;
  }
} 