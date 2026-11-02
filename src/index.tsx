import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { setStoreGetter } from './utils/axiosConfig';
import './utils/firebase';

// Set up store access for axios config
setStoreGetter(() => store);

// Initialize the app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Gruvi Gradient Definitions - Used across marketing and pricing pages
export { gruviGradients, gruviAnimations } from './theme';

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
