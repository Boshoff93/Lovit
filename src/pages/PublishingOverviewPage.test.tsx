import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PublishingOverviewPage from './PublishingOverviewPage';
import DashboardSkeleton from '../components/DashboardOverview';

let mockPosts: any;
let mockAccounts: any;
jest.mock('react-redux', () => ({ useSelector: (select: any) => select({ auth: { user: { userId: 'owner' } } }) }));
jest.mock('../store/apiSlice', () => ({
  useGetScheduledPostsQuery: () => mockPosts,
  useGetSocialAccountsQuery: () => mockAccounts,
}));

beforeEach(() => {
  mockPosts = { isLoading: true, isError: false, refetch: jest.fn() };
  mockAccounts = { isLoading: true, isError: false, refetch: jest.fn() };
});

test('startup dashboard uses the same header, three summary cards and action panels as the loaded page', () => {
  const { container, rerender } = render(<MemoryRouter><DashboardSkeleton /></MemoryRouter>);
  const header = container.querySelector('.gd-workspace-header')!;
  expect(screen.getByRole('status', { name: 'Loading dashboard' })).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('heading', { name: 'Ready for your next post.' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'New post' })).toHaveAttribute('href', '/posts/new');
  expect(container.querySelectorAll('.gd-stat-grid > .gd-stat')).toHaveLength(3);
  expect(container.querySelectorAll('.gd-dashboard-next > div')).toHaveLength(2);
  expect(container.querySelector('.gd-loading-shell')).not.toBeInTheDocument();
  rerender(<MemoryRouter><PublishingOverviewPage /></MemoryRouter>);
  expect(container.querySelector('.gd-workspace-header')).toEqual(header);
  expect(container.querySelectorAll('.gd-stat-grid > .gd-stat')).toHaveLength(3);
});

test('only pending counts load, without hiding available counts or showing false zeroes', () => {
  mockPosts = { ...mockPosts, isLoading: false, data: { scheduledPosts: [
    { scheduleId: 'a', status: 'scheduled', title: 'A real post', scheduledTime: '2026-11-04T18:00:00Z', platforms: [] },
    { scheduleId: 'b', status: 'failed' },
  ] } };
  const { container, rerender } = render(<MemoryRouter><PublishingOverviewPage /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Scheduled 1 Open/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Need attention 1 Open/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Connected accounts Loading Open/ })).toBeInTheDocument();
  expect(container.querySelectorAll('.gd-dashboard-stat-loading')).toHaveLength(1);
  mockAccounts = { ...mockAccounts, isLoading: false, data: { accounts: [{ accountId: 'one' }, { accountId: 'two' }] } };
  rerender(<MemoryRouter><PublishingOverviewPage /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Connected accounts 2 Open/ })).toBeInTheDocument();
  expect(container.querySelectorAll('.gd-dashboard-stat-loading')).toHaveLength(0);
});

test('upcoming posts load as schedule rows and failed counts stay unavailable', () => {
  mockAccounts = { ...mockAccounts, isLoading: false, isError: true };
  const { container } = render(<MemoryRouter><PublishingOverviewPage /></MemoryRouter>);
  expect(screen.getByRole('status', { name: 'Loading upcoming posts' })).toBeInTheDocument();
  expect(container.querySelectorAll('.gd-dashboard-upcoming-loading .gd-upcoming-row')).toHaveLength(2);
  expect(container.querySelector('.gd-upcoming .gd-loading-card')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Connected accounts — Open/ })).toBeInTheDocument();
});
