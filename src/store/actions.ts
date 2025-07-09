import { logout as authLogout } from './authSlice';
import { clearModels } from './modelsSlice';
import { clearGallery } from './gallerySlice';

// Shared logout action that clears all relevant state
export const logoutAllState = () => (dispatch: any) => {
  dispatch(authLogout());
  dispatch(clearModels());
  dispatch(clearGallery());
}; 