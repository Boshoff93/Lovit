import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import EngagementAnalyticsPage from './EngagementAnalyticsPage';
import api from '../utils/axiosConfig';
jest.mock('../utils/axiosConfig', () => ({ __esModule: true, default: { get: jest.fn() } }));
jest.mock('react-redux', () => ({ useSelector: (select: any) => select({ auth: { user: { userId: 'alice' } } }) }));
jest.mock('react-router-dom', () => ({ useParams: () => ({ platform: 'instagram' }), Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a> }));
jest.mock('../store/apiSlice', () => ({ useGetSocialAccountsQuery: () => ({ data: { accounts: [{ accountId: 'one', platform: 'instagram', accountName: 'Account one', avatarUrl: 'https://images.example.com/one.jpg' }, { accountId: 'two', platform: 'instagram', accountName: 'Account two' }] } }) }));
jest.mock('recharts', () => ({ ResponsiveContainer: () => null, CartesianGrid: () => null, Line: () => null, LineChart: () => null, Tooltip: () => null, XAxis: () => null, YAxis: () => null }));
const response = (accountId: string, title: string, status = 'permission_required') => ({ data: { accountId, followers: 42, postCount: 1, postsAvailable: true, paging: { hasMore: false, nextCursor: null }, totals: { likes: 1, comments: null, shares: null }, posts: [{ id: accountId, title, likes: 1, comments: null, shares: null }], updatedAt: '2026-11-03T12:00:00Z', insights: { status, window: { since: '2026-10-06T00:00:00Z', until: '2026-11-03T00:00:00Z' }, metrics: { views: { value: null }, reach: { value: null }, interactions: { value: null } }, daily: { label: 'Accounts reached each day', points: [] } } } });
async function choose(name: string) { await act(async () => { fireEvent.mouseDown(screen.getByRole('combobox', { name: /Connected account/ })); }); const option = await screen.findByRole('option', { name }); await act(async () => { fireEvent.click(option); }); }
beforeEach(() => jest.clearAllMocks());
test('a late account response cannot overwrite the currently selected account', async () => {
  let first: (x: any) => void = () => {};
  (api.get as jest.Mock).mockImplementation((url, config) => config.params.accountId === 'one' && url.endsWith('/summary') ? new Promise(resolve => { first = resolve; }) : Promise.resolve(response(config.params.accountId, config.params.accountId === 'one' ? 'First account post' : 'Second account post')));
  render(<EngagementAnalyticsPage/>); await choose('Account one'); await choose('Account two');
  expect(await screen.findByText('Second account post')).toBeInTheDocument();
  await act(async () => { const stale = response('one','Stale account post'); stale.data.followers = 999; first(stale); });
  expect(screen.queryByText('999 followers')).not.toBeInTheDocument();
  expect(screen.getByText('Second account post')).toBeInTheDocument();
});
test('permission-dependent insights preserve post data and show an explicit Meta authorization action', async () => {
  (api.get as jest.Mock).mockResolvedValue(response('one','Available post'));
  render(<EngagementAnalyticsPage/>); await choose('Account one');
  expect(await screen.findByText('Available post')).toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Continue with Meta'})).toBeInTheDocument();
  expect(screen.getAllByText('Unavailable').length).toBeGreaterThan(0);
  expect(screen.getByText(/Meta will ask you to approve read access/)).toBeInTheDocument();
});
test('failed analytics never displays false zero posts or followers', async () => {
  (api.get as jest.Mock).mockRejectedValue({response:{data:{error:'Meta rejected this connection.',code:'ANALYTICS_RECONNECT_REQUIRED'}}});
  render(<EngagementAnalyticsPage/>); await choose('Account one');
  await waitFor(() => expect(screen.getByText('Meta rejected this connection.')).toBeInTheDocument());
  expect(screen.queryByText(/0 posts returned/)).not.toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Continue with Meta'})).toBeInTheDocument();
});

test('account avatars appear in the selected value, dropdown and snapshot', async () => {
  (api.get as jest.Mock).mockResolvedValue(response('one','Available post'));
  const { container } = render(<EngagementAnalyticsPage/>); await choose('Account one');
  await screen.findByRole('region', {name:'Selected account snapshot'});
  expect(container.querySelectorAll('img[src="https://images.example.com/one.jpg"]').length).toBe(2);
  expect(screen.getByText('42 followers')).toBeInTheDocument();
  expect(screen.getByText('Current snapshot')).toBeInTheDocument();
  await act(async () => { fireEvent.mouseDown(screen.getByRole('combobox', {name:/Connected account/})); });
  const option = await screen.findByRole('option', {name:'Account one'});
  expect(option.querySelector('img')?.getAttribute('src')).toBe('https://images.example.com/one.jpg');
});

test('posts load independently while account insights are pending and remain visible when the period changes', async () => {
  let finishInsights: (value: any) => void = () => {};
  (api.get as jest.Mock).mockImplementation((url) => url.endsWith('/summary') ? new Promise(resolve => { finishInsights = resolve; }) : Promise.resolve(response('one','Ready before insights')));
  render(<EngagementAnalyticsPage/>); await choose('Account one');
  expect(await screen.findByText('Ready before insights')).toBeInTheDocument();
  expect(screen.getByRole('status',{name:'Loading analytics'})).toHaveAttribute('aria-busy','true');
  expect(screen.queryByText('42 followers')).not.toBeInTheDocument();
  await act(async()=>{finishInsights(response('one','Ready before insights','available'));});
  expect(await screen.findByText('42 followers')).toBeInTheDocument();
  expect(screen.queryByRole('status',{name:'Loading analytics'})).not.toBeInTheDocument();
  await act(async()=>{fireEvent.mouseDown(screen.getByRole('combobox',{name:/Account insights/}));});
  await act(async()=>{fireEvent.click(await screen.findByRole('option',{name:'Last 7 complete days'}));});
  expect(screen.getByText('Ready before insights')).toBeInTheDocument();
  expect(screen.getByRole('status',{name:'Loading analytics'})).toBeInTheDocument();
  expect((api.get as jest.Mock).mock.calls.filter(([url])=>url.endsWith('/posts'))).toHaveLength(1);
});
