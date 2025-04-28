import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { setupAxiosInterceptors } from './store/authSlice';
import { WebSocketProvider } from './contexts/WebSocketContext';

// Initialize axios interceptors with the Redux store
setupAxiosInterceptors(store);

const theme = createTheme({
  palette: {
    primary: {
      main: '#2B2D42', // Navy blue
      light: '#8D99AE', // Light navy
      dark: '#14213D', // Dark navy
    },
    secondary: {
      main: '#EDF2F4', // Off-white
      light: '#FFFFFF', // Pure white
      dark: '#8D99AE', // Gray blue
    },
    background: {
      default: '#F8F9FA', // White
      paper: '#F8F9FA', // Very light gray
    },
    text: {
      primary: '#2B2D42', // Navy for text
      secondary: '#8D99AE', // Medium gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#EDF2F4', // Light background matching our secondary main
          '&.MuiChip-sizeSmall': {
            height: 24,
            fontSize: '0.75rem',
          },
        },
        label: {
          fontWeight: 500,
          color: '#2B2D42', // Navy text matching our primary main
        },
        filled: {
          backgroundColor: '#EDF2F4',
          '&:hover': {
            backgroundColor: '#8D99AE', // Light navy on hover
          },
        },
        outlined: {
          borderColor: '#8D99AE',
          color: '#2B2D42',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// The React 19 update requires ensuring hooks are called only in component functions
const AppRoot = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <WebSocketProvider>
              <CssBaseline />
              <App />
            </WebSocketProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
};

root.render(<AppRoot />);
