import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import modelsReducer from './modelsSlice';
import galleryReducer from './gallerySlice';

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  models: modelsReducer,
  gallery: galleryReducer,
});

// Redux persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'models', 'gallery'], // Persist auth, models, and gallery state
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
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 