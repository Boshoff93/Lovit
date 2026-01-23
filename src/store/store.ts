import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import modelsReducer from './modelsSlice';
import galleryReducer from './gallerySlice';
import dataReducer from './dataSlice';
import { apiSlice } from './apiSlice';

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  models: modelsReducer,
  gallery: galleryReducer,
  data: dataReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Redux persist configuration
// Note: 'data' is intentionally NOT in whitelist - we want fresh data on hard refresh
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'models', 'gallery'], // Persist auth, models, and gallery state (NOT data - fetch fresh on hard refresh)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 