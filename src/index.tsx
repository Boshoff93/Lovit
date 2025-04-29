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
      main: '#eed9b6', // Warm cream
      light: '#f7ecdb', // Light cream
      dark: '#e5c696', // Darker cream
    },
    background: {
      default: '#fdfbf8', // Lightest cream
      paper: '#faf4e9', // Light warm cream
    },
    text: {
      primary: '#2B2D42', // Navy for text
      secondary: '#4B4D62', // Darker muted navy for better contrast
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
          minHeight: '42px',
          '&.Mui-disabled': {
            backgroundColor: '#e0e0e0',
            color: '#8d8d8d',
            borderColor: '#bdbdbd',
          },
          '&.MuiButton-contained': {
            background: 'linear-gradient(145deg, #2B2D42, #14213D)',
            color: '#faf4e9',
            '&:hover': {
              background: 'linear-gradient(145deg, #eed9b6, #e5c696)',
              color: '#2B2D42',
            },
            '&.MuiButton-containedSecondary': {
              background: 'linear-gradient(145deg, #eed9b6, #e5c696)',
              color: '#2B2D42',
              '&:hover': {
                background: 'linear-gradient(145deg, #f1e1c5, #eed9b6)',
              },
            },
            '&.Mui-disabled': {
              background: '#e0e0e0',
              color: '#8d8d8d',
            },
          },
          '&.MuiButton-outlined': {
            borderColor: '#2B2D42',
            color: '#2B2D42',
            borderWidth: '1.5px',
            backgroundColor: '#fdfbf8',
            '&:hover': {
              background: 'linear-gradient(145deg, #eed9b6, #e5c696)',
              borderColor: '#2B2D42',
              color: '#2B2D42',
            },
            '&.MuiButton-outlinedSecondary': {
              borderColor: '#eed9b6',
              color: '#2B2D42',
              backgroundColor: '#fdfbf8',
              '&:hover': {
                background: 'linear-gradient(145deg, #f1e1c5, #eed9b6)',
                borderColor: '#e5c696',
                color: '#2B2D42',
              },
            },
            '&.Mui-disabled': {
              backgroundColor: '#e0e0e0',
              color: '#8d8d8d',
              borderColor: '#bdbdbd',
            },
          },
          '&.MuiButton-text': {
            color: '#2B2D42',
            '&:hover': {
              backgroundColor: '#faf4e9',
            },
            '&.MuiButton-textSecondary': {
              color: '#2B2D42',
              '&:hover': {
                backgroundColor: 'rgba(238, 217, 182, 0.08)',
              },
            },
            '&.Mui-disabled': {
              color: '#8d8d8d',
              backgroundColor: '#e0e0e0',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-sizeSmall': {
            height: 24,
            fontSize: '0.75rem',
          },
        },
        label: {
          fontWeight: 500,
        },
        filled: {
          backgroundColor: '#2B2D42',
          color: '#faf4e9',
          '&:hover': {
            backgroundColor: '#3B3D52',
          },
          '& .MuiChip-deleteIcon': {
            color: '#8D99AE',
            '&:hover': {
              color: '#faf4e9',
            },
          },
        },
        outlined: {
          backgroundColor: '#f7ecdb',
          borderColor: '#eed9b6',
          color: '#2B2D42',
          '&:hover': {
            backgroundColor: '#f3e4cc',
          },
          '& .MuiChip-deleteIcon': {
            color: '#2B2D42',
            '&:hover': {
              color: '#14213D',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(43, 45, 66, 0.08)',
          backgroundColor: '#faf4e9',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
        },
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 4px 12px rgba(43, 45, 66, 0.08)',
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fdfbf8',
            '&:hover': {
              backgroundColor: '#fdfbf8',
            },
            '&.Mui-focused': {
              backgroundColor: '#fdfbf8',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fdfbf8',
          '&:hover': {
            backgroundColor: '#fdfbf8',
          },
          '&.Mui-focused': {
            backgroundColor: '#fdfbf8',
          },
          '& fieldset': {
            borderColor: '#2B2D42',
            borderWidth: '1.5px',
          },
          '&:hover fieldset': {
            borderColor: '#14213D',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#14213D',
            borderWidth: '2px',
          },
        },
        input: {
          '&::placeholder': {
            color: '#757575',
            opacity: 1,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#fdfbf8',
        },
        input: {
          '&::placeholder': {
            color: '#757575',
            opacity: 1,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#fdfbf8',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#fdfbf8',
          '&.Mui-disabled': {
            opacity: 0.7,
            color: '#757575',
            backgroundColor: '#fdfbf8',
          },
          '&:hover': {
            backgroundColor: '#faf4e9',
          },
          '&.Mui-selected': {
            backgroundColor: '#f7ecdb',
            '&:hover': {
              backgroundColor: '#f3e4cc',
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fdfbf8',
          '& .MuiMenuItem-root': {
            '&:hover': {
              backgroundColor: '#faf4e9',
            },
            '&.Mui-selected': {
              backgroundColor: '#f7ecdb',
              '&:hover': {
                backgroundColor: '#f3e4cc',
              },
            },
            '&.Mui-disabled': {
              opacity: 0.7,
              color: '#757575',
              backgroundColor: '#fdfbf8',
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fdfbf8',
        },
        option: {
          '&:hover': {
            backgroundColor: '#faf4e9',
          },
          '&[aria-selected="true"]': {
            backgroundColor: '#f7ecdb',
            '&:hover': {
              backgroundColor: '#f3e4cc',
            },
          },
        },
        listbox: {
          backgroundColor: '#fdfbf8',
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
