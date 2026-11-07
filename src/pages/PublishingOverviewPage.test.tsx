import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PublishingOverviewPage from './PublishingOverviewPage';
import DashboardSkeleton from '../components/DashboardOverview';
import { summarizeSchedule } from '../utils/dashboardSchedule';
import type { ScheduledPost } from '../services/api';

let mockPosts: any;
let mockAccounts: any;
let mockSnapshot: any;
jest.mock('react-redux', () => ({ useSelector: (select: any) => select({ auth: { user: { userId: 'owner' } } }) }));
jest.mock('../store/apiSlice', () => ({
  useGetScheduleOverviewQuery: () => mockPosts,
  useGetSocialAccountsQuery: () => mockAccounts,
  useGetAnalyticsSnapshotQuery: () => mockSnapshot,
}));

beforeEach(() => {
  mockPosts = { isLoading: true, refetch: jest.fn() };
  mockAccounts = { isLoading: true, refetch: jest.fn() };
  mockSnapshot = { isFetching: false, refetch: jest.fn() };
});

test('startup and data loading share the same dashboard layout', () => {
  const { container, rerender } = render(<MemoryRouter><DashboardSkeleton /></MemoryRouter>);
  const header = container.querySelector('.gd-workspace-header')!;
  expect(screen.getByRole('status', { name: 'Loading dashboard' })).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('heading', { name: 'Audience & engagement' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'New post' })).toHaveAttribute('href', '/posts/new');
  expect(container.querySelectorAll('.gd-dashboard-metric')).toHaveLength(3);
  expect(container.querySelectorAll('.gd-stat-grid > .gd-stat')).toHaveLength(3);
  expect(container.querySelectorAll('.gd-dashboard-next > div')).toHaveLength(2);
  expect(screen.getByRole('status', { name: 'Loading upcoming posts' })).toBeInTheDocument();
  rerender(<MemoryRouter><PublishingOverviewPage /></MemoryRouter>);
  expect(container.querySelector('.gd-workspace-header')).toEqual(header);
});

test('future schedules link to the right calendar entry and recent problems exclude old failures and processing', () => {
  const now = Date.now();
  const row = (scheduleId: string, status: ScheduledPost['status'], offsetHours: number, uploadResults?: ScheduledPost['uploadResults']) => ({
    scheduleId, status, title: scheduleId, scheduledTime: new Date(now + offsetHours * 3600000).toISOString(),
    platforms: [{ platform: 'youtube' }], uploadResults,
  } as ScheduledPost);
  mockPosts = { ...mockPosts, isLoading: false, currentData: summarizeSchedule([
    row('Missed date', 'scheduled', -240),
    row('Next post', 'scheduled', 2),
    row('Later post', 'scheduled', 24),
    row('Recent failure', 'failed', -2),
    row('Historical failure', 'failed', -240),
    row('Still processing', 'partial', -3, [{ platform: 'youtube', status: 'provider_processing', success: false }]),
  ], now) };
  render(<MemoryRouter><PublishingOverviewPage /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /Scheduled 2 Open/ })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Needs attention Past 7 days 1 Open/ })).toHaveAttribute('href', '/settings/scheduled-content?highlight=Recent%20failure');
  expect(screen.getByRole('link', { name: /Next post YouTube/ })).toHaveAttribute('href', '/settings/scheduled-content?highlight=Next%20post');
  expect(screen.queryByText('Missed date')).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Connected accounts Loading Open/ })).toBeInTheDocument();
});

test('refresh keeps cached analytics visible and retry only fetches the failed resource', async () => {
  mockAccounts = { ...mockAccounts, isLoading: false, isError: true };
  mockSnapshot = { ...mockSnapshot, isFetching: true, currentData: [
    { accountId: 'one', platform: 'youtube', followers: 100, likes: 55, comments: 0, coverage: 'videos' },
  ] };
  render(<MemoryRouter><PublishingOverviewPage /></MemoryRouter>);
  expect(screen.getByText('Syncing')).toBeInTheDocument();
  expect(screen.getByText('100')).toBeInTheDocument();
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Try again' })); });
  expect(mockAccounts.refetch).toHaveBeenCalledTimes(1);
  expect(mockPosts.refetch).not.toHaveBeenCalled();
  expect(mockSnapshot.refetch).not.toHaveBeenCalled();
});
