import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';
import { Allowances } from '../store/authSlice';

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export const useAccountData = (shouldFetch: boolean = true) => {
  const { user, subscription, token, updateUser, updateSubscription, updateAllowances } = useAuth();
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
      
      const { user: fetchedUser } = response.data;
      
      // Always update if we have fetched user data
      if (fetchedUser && 
        (fetchedUser.username !== user?.username || 
         fetchedUser.email !== user?.email || 
         fetchedUser.isVerified !== user?.isVerified ||
         fetchedUser.createdAt !== user?.createdAt ||
         fetchedUser.userId !== user?.userId ||
         fetchedUser.emailPreferences?.notifications !== user?.emailPreferences?.notifications ||
         fetchedUser.isAdmin !== user?.isAdmin)) {
        updateUser(fetchedUser);
      }
      
      // Check if subscription data exists and update it separately
      if (fetchedUser?.subscription) {
        const fetchedSubscription = fetchedUser.subscription;
        if (
          !subscription ||
          fetchedSubscription.tier !== subscription.tier ||
          fetchedSubscription.status !== subscription.status ||
          fetchedSubscription.subscriptionId !== subscription.subscriptionId ||
          fetchedSubscription.customerId !== subscription.customerId ||
          fetchedSubscription.currentPeriodEnd !== subscription.currentPeriodEnd
        ) {
          updateSubscription(fetchedSubscription);
        }
      }
      
      // Update allowances if available
      if (fetchedUser.allowances) {
        updateAllowances(fetchedUser.allowances);
      }
      
      lastFetched.current = new Date();
      setStatus('success');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load account data');
      setStatus('error');
    }
  },[token, user, updateUser, updateSubscription, updateAllowances, subscription]);

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