import { store, persistor } from './store';
import { apiSlice } from './apiSlice';
import { logout } from './authSlice';

jest.mock('axios', () => ({ create: jest.fn() }));
jest.mock('../utils/axiosConfig', () => ({ __esModule: true, default: {} }));
// CRA's Jest predates conditional package exports. Use the same library's CJS build.
jest.mock('@standard-schema/utils', () => jest.requireActual('../../node_modules/@standard-schema/utils/dist/index.cjs'));

afterAll(() => persistor.pause());

test('sign-out removes private query results before another account can sign in', async () => {
  await store.dispatch(apiSlice.util.upsertQueryData('getScheduledPosts', undefined, {
    scheduledPosts: [{ scheduleId: 'previous-account-private-post' } as any],
  }));
  expect(JSON.stringify(store.getState().api.queries)).toContain('previous-account-private-post');
  store.dispatch(logout());
  expect(store.getState().api.queries).toEqual({});
});
