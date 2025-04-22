import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export const useAccountData = (shouldFetch: boolean = true) => {
  const { user, subscription, token, updateUserInfo } = useAuth();
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchAccountData = async (force: boolean = false) => {
    if (!token) return;
    
    // Skip fetch if we recently fetched and force is false
    if (!force && lastFetched && (new Date().getTime() - lastFetched.getTime() < 60000)) {
      return;
    }
    
    try {
      setStatus('loading');
      setError(null);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'https://api.trylovit.com'}/api/user/account`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const { user: fetchedUser } = response.data;
      
      // Only update if data is different
      if (fetchedUser && 
          (fetchedUser.username !== user?.username || 
           fetchedUser.email !== user?.email || 
           fetchedUser.isVerified !== user?.isVerified ||
           fetchedUser.subscription?.tier !== subscription?.tier ||
           fetchedUser.subscription?.status !== subscription?.status)) {
        updateUserInfo(fetchedUser);
      }
      
      setLastFetched(new Date());
      setStatus('success');
    } catch (err: any) {
      console.error('Failed to fetch account data:', err);
      setError(err.response?.data?.error || 'Failed to load account data');
      setStatus('error');
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    if (shouldFetch && token) {
      fetchAccountData();
    }
  }, [token, shouldFetch]);

  return {
    status,
    isLoading: status === 'loading',
    error,
    lastFetched,
    fetchAccountData
  };
}; 