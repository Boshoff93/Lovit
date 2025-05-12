// Google Auth utility functions using Google Identity Services
// Separated for cleaner code organization, since this isn't directly Redux-related

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '187159025302-73fkd561r5bfpgpjjdvo7ncb7p8fk0rd.apps.googleusercontent.com';

// Load Google Identity Services
export const loadGoogleAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the Google Identity Services script is already loaded
    if (window.google?.accounts) {
      resolve();
    } else {
      // Load the Google Identity Services script dynamically
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    }
  });
};

// Sign in with Google and get ID token
export const signInWithGoogle = async (): Promise<string> => {
  try {
    await loadGoogleAuth();
    
    return new Promise((resolve, reject) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: (response: any) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.access_token);
          }
        },
      });

      client.requestAccessToken();
    });
  } catch (error) {
    throw error;
  }
};

// For TypeScript
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: any) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
} 