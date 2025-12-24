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

// Apple-Inspired Light Glassy Theme - Clean Blue Accents
const theme = createTheme({
  palette: {
    mode: 'light',
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
      default: '#F5F5F7', // Apple light gray
      paper: '#FFFFFF', // Pure white
    },
    text: {
      primary: '#1D1D1F', // Apple dark text
      secondary: '#86868B', // Apple secondary text
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#1D1D1F',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#1D1D1F',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: '#1D1D1F',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: '#1D1D1F',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#1D1D1F',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#1D1D1F',
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0',
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      letterSpacing: '-0.01em',
      color: '#1D1D1F',
    },
    body2: {
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
          backgroundColor: '#F5F5F7',
          color: '#1D1D1F',
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
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            color: 'rgba(0, 0, 0, 0.3)',
          },
          '&.MuiButton-contained': {
            background: '#1D1D1F',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            '&:hover': {
              background: '#000000',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              background: '#1D1D1F',
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
              background: 'rgba(0, 0, 0, 0.05)',
              color: 'rgba(0, 0, 0, 0.3)',
              boxShadow: 'none',
            },
          },
          '&.MuiButton-outlined': {
            borderColor: 'rgba(0, 0, 0, 0.15)',
            color: '#1D1D1F',
            borderWidth: '1px',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              borderColor: 'rgba(0, 0, 0, 0.3)',
            },
            '&:active': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
            '&.Mui-disabled': {
              backgroundColor: 'transparent',
              color: 'rgba(0, 0, 0, 0.3)',
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
          },
          '&.MuiButton-text': {
            color: '#007AFF',
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.05)',
            },
            '&:active': {
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
            },
            '&.Mui-disabled': {
              color: 'rgba(0, 0, 0, 0.3)',
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
          backgroundColor: 'rgba(0, 122, 255, 0.1)',
          color: '#007AFF',
          '&:hover': {
            backgroundColor: 'rgba(0, 122, 255, 0.15)',
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderColor: 'rgba(0, 0, 0, 0.12)',
          color: '#1D1D1F',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
        },
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 12,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
          '&.Mui-focused': {
            backgroundColor: '#FFFFFF',
          },
          '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.2)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#007AFF',
            borderWidth: '2px',
          },
        },
        input: {
          color: '#1D1D1F',
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
          color: '#1D1D1F',
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
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          '&.Mui-disabled': {
            opacity: 0.5,
            color: 'rgba(0, 0, 0, 0.3)',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 122, 255, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.12)',
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: 24,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 1px 0 rgba(0, 0, 0, 0.06)',
          color: '#1D1D1F',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
        option: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
          },
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(0, 122, 255, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(0, 122, 255, 0.12)',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.08)',
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
            color: '#1D1D1F',
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
          backgroundColor: 'rgba(52, 199, 89, 0.1)',
          border: '1px solid rgba(52, 199, 89, 0.2)',
          color: '#248A3D',
        },
        standardError: {
          backgroundColor: 'rgba(255, 59, 48, 0.1)',
          border: '1px solid rgba(255, 59, 48, 0.2)',
          color: '#D70015',
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
