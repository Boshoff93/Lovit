import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { setStoreGetter } from './utils/axiosConfig';
import './utils/firebase';

// Set up store access for axios config
setStoreGetter(() => store);

// Initialize the app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Gruvi Gradient Definitions - Used across marketing and pricing pages
export const gruviGradients = {
  // Primary brand gradients
  purplePink: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  blueCyan: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
  redOrange: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',

  // Pricing card gradients
  starter: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
  scale: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
  beast: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',

  // Hero and accent gradients
  heroAccent: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
  textGradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)',

  // Header gradient (dark)
  header: 'linear-gradient(135deg, #141418 0%, #2D2D30 100%)',

  // Glass effects
  glassLight: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  glassDark: 'linear-gradient(135deg, rgba(20, 20, 24, 0.95) 0%, rgba(45, 45, 48, 0.9) 100%)',
};

// Animation keyframe definitions for reuse
export const gruviAnimations = {
  // Gradient shift for text
  gradientShift: `
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
  `,
  // Pulse animation for badges
  pulse: `
    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4), 0 0 0 0 rgba(236, 72, 153, 0.4);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4), 0 0 0 8px rgba(236, 72, 153, 0);
        transform: scale(1.02);
      }
    }
  `,
  // Fade in up animation
  fadeInUp: `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  // Scale in animation
  scaleIn: `
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `,
  // Count up shimmer
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
};

// Dark Glassy Theme - Dashboard Dark Mode
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007AFF', // Apple Blue
      light: '#5AC8FA', // Light blue
      dark: '#0056CC', // Dark blue
    },
    secondary: {
      main: '#34C759', // Apple Green
      light: '#6DD58C', // Light green
      dark: '#248A3D', // Dark green
    },
    success: {
      main: '#34C759', // Green
      light: '#6DD58C',
      dark: '#248A3D',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FF3B30', // Apple Red
      light: '#FF6961',
      dark: '#D70015',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FF9500', // Apple Orange
      light: '#FFAC33',
      dark: '#CC7700',
      contrastText: '#ffffff',
    },
    background: {
      default: '#14171f', // Dark blue-gray background (Fable style)
      paper: '#1E1E22', // Dark paper (cards/panels)
    },
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#86868B', // Gray secondary text
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontFamily: '"Fredoka", "Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#FFFFFF',
    },
    h2: {
      fontFamily: '"Fredoka", "Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#FFFFFF',
    },
    h3: {
      fontFamily: '"Fredoka", "Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#FFFFFF',
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#FFFFFF',
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: '#FFFFFF',
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#FFFFFF',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      letterSpacing: '0',
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '-0.01em',
      color: '#FFFFFF',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '-0.01em',
      color: '#86868B',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0D0D0F',
          color: '#FFFFFF',
        },
        // Global scrollbar styling
        '*': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.25)',
              backgroundClip: 'padding-box',
            },
            '&:active': {
              background: 'rgba(0, 122, 255, 0.5)',
              backgroundClip: 'padding-box',
            },
          },
          '&::-webkit-scrollbar-corner': {
            background: 'transparent',
          },
          // Firefox scrollbar
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.15) rgba(255, 255, 255, 0.03)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          minHeight: '44px',
          padding: '10px 20px',
          WebkitTapHighlightColor: 'transparent',
          transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
          '&.Mui-disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.3)',
          },
          '&.MuiButton-contained': {
            background: '#FFFFFF',
            color: '#141418',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              background: '#F0F0F0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              background: '#E0E0E0',
              transform: 'translateY(0)',
            },
            '&.MuiButton-containedPrimary': {
              background: '#007AFF',
              color: '#ffffff',
              '&:hover': {
                background: '#0056CC',
              },
            },
            '&.Mui-disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
              boxShadow: 'none',
            },
          },
          '&.MuiButton-outlined': {
            borderColor: 'rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            borderWidth: '1px',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:active': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&.Mui-disabled': {
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
          '&.MuiButton-text': {
            color: '#007AFF',
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
            },
            '&:active': {
              backgroundColor: 'rgba(0, 122, 255, 0.15)',
            },
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-sizeSmall': {
            height: 26,
            fontSize: '0.8rem',
          },
        },
        label: {
          fontWeight: 500,
        },
        filled: {
          backgroundColor: 'rgba(0, 122, 255, 0.2)',
          color: '#5AC8FA',
          '&:hover': {
            backgroundColor: 'rgba(0, 122, 255, 0.3)',
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#1E1E22 !important',
          backgroundImage: 'none !important',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#141418 !important',
          backgroundImage: 'none !important',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E22 !important',
          backgroundImage: 'none !important',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation0: {
          boxShadow: 'none',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        },
        elevation3: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 12,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#007AFF',
            borderWidth: '2px',
          },
        },
        input: {
          color: '#FFFFFF',
          '&::placeholder': {
            color: '#86868B',
            opacity: 1,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: '#FFFFFF',
        },
        input: {
          '&::placeholder': {
            color: '#86868B',
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#86868B',
          '&.Mui-focused': {
            color: '#007AFF',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          '&.Mui-disabled': {
            opacity: 0.5,
            color: 'rgba(255, 255, 255, 0.3)',
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 122, 255, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.2)',
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#141418 !important',
          backgroundImage: 'none !important',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#141418 !important',
          backgroundImage: 'none !important',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(13, 13, 15, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 1px 0 rgba(255, 255, 255, 0.06)',
          color: '#FFFFFF',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: '#141418 !important',
          backgroundImage: 'none !important',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
        option: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(0, 122, 255, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.2)',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#007AFF',
          height: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          color: '#86868B',
          '&.Mui-selected': {
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#007AFF',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#007AFF',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#86868B',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        standardSuccess: {
          backgroundColor: 'rgba(52, 199, 89, 0.15)',
          border: '1px solid rgba(52, 199, 89, 0.3)',
          color: '#6DD58C',
        },
        standardError: {
          backgroundColor: 'rgba(255, 59, 48, 0.15)',
          border: '1px solid rgba(255, 59, 48, 0.3)',
          color: '#FF6961',
        },
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <WebSocketProvider>
            <App />
          </WebSocketProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
