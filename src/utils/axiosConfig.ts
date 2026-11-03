import axios from "axios";
import { logout } from "../store/authSlice";
import { API_BASE_URL } from "./apiBaseUrl";
import { shouldClearSession } from "./sessionErrors";

// Always use production API

// Create a base axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable sending cookies across domains
});

// We'll set this up after the store is created
let getStore: () => any = () => null;

// Function to set the store getter (called from store.ts after store creation)
export const setStoreGetter = (storeGetter: () => any) => {
  getStore = storeGetter;
};

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const store = getStore();
    if (!store) return config;

    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For multipart/form-data requests, don't manually set Content-Type
    // Let the browser set it with the proper boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Rejected sessions require a new sign-in. Never refresh a rejected credential,
// or confuse a plan/permission failure with an authentication failure.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const store = getStore();
    const original = error.config;
    const url = original?.url || "";
    const protectedRequest =
      !url.startsWith("/auth/") || url === "/auth/refresh-token";
    const requestToken = String(original?.headers?.Authorization || "").replace(
      /^Bearer /,
      "",
    );
    if (
      protectedRequest &&
      store &&
      shouldClearSession(
        error.response?.status,
        error.response?.data,
        requestToken,
        store.getState().auth.token,
      )
    )
      store.dispatch(logout());
    return Promise.reject(error);
  },
);

export default api;
