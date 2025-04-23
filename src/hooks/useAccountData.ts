import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export const useAccountData = (shouldFetch: boolean = true) => {
  const { user, subscription, token, updateUser } = useAuth();
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const lastFetched = useRef<Date | null>(null);

  const fetchAccountData = useCallback(async (force: boolean = false) => {
    if (!token) return;
    
    // Skip fetch if we recently fetched and force is false
    if (!force && lastFetched.current && (new Date().getTime() - lastFetched.current.getTime() < 60000)) {
      return;
    }
    
    try {
      setStatus('loading');
      setError(null);
      
      console.log('Fetching account data with token:', token);
      console.log('Current user:', user);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'https://api.trylovit.com'}/api/user/account`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            userId: user?.userId
          }
        }
      );
      
      console.log('Account data response:', response.data);
      const { user: fetchedUser } = response.data;
      
      // Always update if we have fetched user data
      if (fetchedUser && 
        (fetchedUser.username !== user?.username || 
         fetchedUser.email !== user?.email || 
         fetchedUser.isVerified !== user?.isVerified ||
         fetchedUser.subscription?.tier !== subscription?.tier ||
         fetchedUser.subscription?.status !== subscription?.status)) {
        console.log('Updating user with:', fetchedUser);
        updateUser(fetchedUser);
      }
      
      lastFetched.current = new Date();
      setStatus('success');
    } catch (err: any) {
      console.error('Failed to fetch account data:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      });
      setError(err.response?.data?.error || 'Failed to load account data');
      setStatus('error');
    }
  },[token, updateUser]); // don't add all dependencies

  // Initial fetch on mount
  useEffect(() => {
    if (shouldFetch && token) {
      fetchAccountData();
    }
  }, [token, shouldFetch, fetchAccountData]);

  return {
    status,
    isLoading: status === 'loading',
    error,
    lastFetched: lastFetched.current,
    fetchAccountData
  };
}; 