import React from 'react';
import { render, screen } from '@testing-library/react';
import InstagramCallbackPage from './InstagramCallbackPage';
import { instagramApi } from '../services/api';
jest.mock('../services/api', () => ({ instagramApi: { handleCallback: jest.fn(), handleAnalyticsCallback: jest.fn() } }));
beforeEach(() => jest.clearAllMocks());
test('Meta callback exchanges once under StrictMode and explains missing asset access without signing out', async () => {
  const state = btoa(JSON.stringify({ platform: 'facebook', analytics: true }));
  window.history.replaceState(null, '', '/instagram/callback?code=private-code&state=' + encodeURIComponent(state));
  (instagramApi.handleAnalyticsCallback as jest.Mock).mockRejectedValue({ response: { data: { code: 'META_PAGE_ACCESS_REQUIRED', error: 'Meta has not granted access to the selected Page.' } } });
  render(<React.StrictMode><InstagramCallbackPage/></React.StrictMode>);
  expect(await screen.findByText('Meta has not granted access to the selected Page.')).toBeInTheDocument();
  expect(instagramApi.handleAnalyticsCallback).toHaveBeenCalledTimes(1);
  expect(instagramApi.handleCallback).not.toHaveBeenCalled();
  expect(screen.getByRole('link', { name: 'Back to analytics' })).toHaveAttribute('href', '/analytics/facebook');
  expect(screen.getByRole('link', { name: /Review Meta access/ })).toHaveAttribute('href', 'https://www.facebook.com/settings?tab=business_tools');
  expect(window.location.search).toBe('');
});
test('cancelled Meta consent never sends an authorization request', async () => {
  window.history.replaceState(null, '', '/instagram/callback?error=access_denied');
  render(<InstagramCallbackPage/>);
  expect(await screen.findByText(/Meta authorization was cancelled/)).toBeInTheDocument();
  expect(instagramApi.handleAnalyticsCallback).not.toHaveBeenCalled();
  expect(instagramApi.handleCallback).not.toHaveBeenCalled();
});
