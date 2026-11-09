import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CarouselPage from './CarouselPage';
import api from '../utils/axiosConfig';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (select: any) => select({ auth: { user: { userId: 'owner' }, subscription: { tier: 'pro', status: 'active' } } }),
}));
jest.mock('../store/apiSlice', () => ({
  useGetSocialAccountsQuery: () => ({ data: { accounts: [
    { platform: 'instagram', accountId: 'ig-account', accountName: 'Fable' },
    { platform: 'facebook', accountId: 'fb-page', accountName: 'Fable Page' },
    { platform: 'tiktok', accountId: 'tt-account', accountName: 'Fable' },
    { platform: 'youtube', accountId: 'yt-account', accountName: 'Fable' },
  ] } }),
}));
jest.mock('../components/PublishingPaywall', () => () => null);
jest.mock('../utils/axiosConfig', () => ({ get: jest.fn(), post: jest.fn() }));

test('the carousel screen offers Facebook and Instagram and publishes to the selected Page', async () => {
  const carouselId = '11111111-1111-4111-8111-111111111111';
  Object.defineProperty(globalThis, 'crypto', { configurable: true, value: { randomUUID: () => 'test-request-id' } });
  (api.get as jest.Mock).mockResolvedValue({ data: { carousels: [{ carouselId, title: 'The Pigs', description: 'The claim.' }] } });
  (api.post as jest.Mock).mockResolvedValue({ data: { status: 'published' } });

  render(<MemoryRouter><CarouselPage /></MemoryRouter>);
  fireEvent.click(await screen.findByRole('button', { name: 'The Pigs' }));
  expect(screen.getByRole('checkbox', { name: 'Instagram · Fable' })).toBeEnabled();
  expect(screen.getByRole('checkbox', { name: 'TikTok · Fable' })).toBeEnabled();
  expect(screen.queryByRole('checkbox', { name: 'YouTube · Fable' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Facebook · Fable Page' }));
  fireEvent.mouseDown(screen.getByLabelText('When'));
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'Publish now' }));
  fireEvent.click(screen.getByRole('button', { name: 'Publish carousel' }));

  await waitFor(() => expect(api.post).toHaveBeenCalledWith(`/api/gruvi/carousels/${carouselId}/publish`, {
    platform: 'facebook', accountId: 'fb-page', caption: 'The claim.', requestId: 'test-request-id',
  }));
  expect(await screen.findByText('Published on Facebook.')).toBeVisible();
});
