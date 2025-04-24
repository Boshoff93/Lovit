import { createAction } from '@reduxjs/toolkit';
import { AppDispatch } from './store';
import { logout as authLogout } from './authSlice';
import { clearModels } from './modelsSlice';

// Shared logout action that clears all relevant state
export const logoutAllState = () => (dispatch: AppDispatch) => {
  dispatch(authLogout());
  dispatch(clearModels());
}; 