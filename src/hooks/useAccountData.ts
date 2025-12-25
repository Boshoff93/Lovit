import { useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import api from '../utils/axiosConfig';

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

// Global cache to prevent multiple components from fetching simultaneously
let globalLastFetched: Date | null = null;
const CACHE_DURATION_MS = 1 * 60 * 1000; // 5 minutes cache

export const useAccountData = (_shouldFetch: boolean = false) => {
  const { user, token, updateUser, updateSubscription, updateAllowances } = useAuth();
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);

  const fetchAccountData = useCallback(async (force: boolean = false) => {
    if (!token || !user?.userId) return;
    
    // Prevent concurrent fetches
    if (isFetching.current) return;
    
    // Skip fetch if we recently fetched and force is false (use global cache)
    if (!force && globalLastFetched && (Date.now() - globalLastFetched.getTime() < CACHE_DURATION_MS)) {
      return;
    }
    
    try {
      isFetching.current = true;
      setStatus('loading');
      setError(null);
      
      const response = await api.get(
        '/api/user/account', 
        {
          params: {
            userId: user.userId
          }
        }
      );
      
      const { user: fetchedUser } = response.data;
      
      if (fetchedUser) {
        // Update user data
        updateUser(fetchedUser);
        
        // Update subscription if available
        if (fetchedUser.subscription) {
          updateSubscription(fetchedUser.subscription);
        }
        
        // Update allowances if available
        if (fetchedUser.allowances) {
          updateAllowances(fetchedUser.allowances);
        }
      }
      
      globalLastFetched = new Date();
      setStatus('success');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load account data');
      setStatus('error');
    } finally {
      isFetching.current = false;
    }
  }, [token, user?.userId, updateUser, updateSubscription, updateAllowances]);

  // Note: We no longer auto-fetch on mount. Components should explicitly call fetchAccountData(true)
  // when they need fresh data (e.g., AccountPage on mount)

  return {
    status,
    isLoading: status === 'loading',
    error,
    lastFetched: globalLastFetched,
    fetchAccountData
  };
}; 