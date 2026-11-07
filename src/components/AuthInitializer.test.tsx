import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthInitializer from './AuthInitializer';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch, useSelector: (select: any) => select({ auth: { token: 'test-token', user: null } }) }));
jest.mock('../utils/storage', () => ({ getToken: () => null }));
jest.mock('../store/authSlice', () => ({ refreshUserData: () => ({ type: 'refresh-user' }), fetchSubscription: () => ({ type: 'refresh-subscription' }), setToken: () => ({}), logout: () => ({}) }));
jest.mock('./Layout', () => ({ __esModule: true, default: ({ children, isInitializing }: any) => <div data-testid="workspace-frame" data-initializing={isInitializing}><nav aria-label="Workspace navigation">Gruvi</nav>{children}</div> }));

test.each(['/dashboard', '/'])('account restoration shows the dashboard frame on %s with a saved session', async (path) => {
  let finish!: () => void;
  const pending = new Promise<void>(resolve => { finish = resolve; });
  mockDispatch.mockImplementation(action => action.type === 'refresh-user' ? { unwrap: () => pending } : Promise.resolve());
  render(<MemoryRouter initialEntries={[path]}><AuthInitializer><div>Protected dashboard data</div></AuthInitializer></MemoryRouter>);
  expect(screen.getByRole('navigation', { name: 'Workspace navigation' })).toBeInTheDocument();
  expect(screen.getByTestId('workspace-frame')).toHaveAttribute('data-initializing', 'true');
  expect(screen.getByRole('status', { name: 'Loading dashboard' })).toBeInTheDocument();
  expect(screen.queryByText('Protected dashboard data')).not.toBeInTheDocument();
  await act(async () => { finish(); await pending; });
  expect(screen.getByText('Protected dashboard data')).toBeInTheDocument();
  expect(screen.queryByRole('status', { name: 'Loading dashboard' })).not.toBeInTheDocument();
  expect(mockDispatch).not.toHaveBeenCalledWith({ type: 'refresh-subscription' });
});
