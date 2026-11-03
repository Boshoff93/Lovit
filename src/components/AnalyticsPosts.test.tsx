import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import AnalyticsPosts from './AnalyticsPosts';
import api from '../utils/axiosConfig';
jest.mock('../utils/axiosConfig', () => ({ __esModule: true, default: { get: jest.fn() } }));
const page = (title: string, nextCursor: string | null = null) => ({data:{posts:[{id:title,title,likes:1,comments:null,shares:null}],totals:{likes:1,comments:null,shares:null},paging:{hasMore:!!nextCursor,nextCursor}}});
beforeEach(() => jest.clearAllMocks());
test('loads one bounded page at a time and navigates back with the original cursor', async () => {
  (api.get as jest.Mock).mockImplementation((_url, config) => Promise.resolve(page(config.params.cursor ? 'Older post' : 'Latest post', config.params.cursor ? null : 'signed-cursor')));
  render(<AnalyticsPosts platform="instagram" accountId="one"/>);
  await screen.findByText('Latest post'); expect(api.get).toHaveBeenCalledTimes(1);
  expect(api.get).toHaveBeenLastCalledWith('/api/gruvi/instagram/analytics/posts', expect.objectContaining({params:{accountId:'one',limit:10}}));
  fireEvent.click(screen.getByRole('button',{name:'Next'}));
  await screen.findByText('Older post'); expect(screen.queryByText('Latest post')).not.toBeInTheDocument();
  expect(api.get).toHaveBeenLastCalledWith(expect.any(String),expect.objectContaining({params:{accountId:'one',limit:10,cursor:'signed-cursor'}}));
  expect(screen.getByRole('button',{name:'Next'})).toBeDisabled();
  expect(screen.getByText('Page 2 · End of available posts')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Previous'})); await screen.findByText('Latest post');
  expect(screen.getByRole('button',{name:'Previous'})).toBeDisabled(); expect(api.get).toHaveBeenCalledTimes(3);
});
test('late page responses cannot replace the active page or show a false empty result', async () => {
  let finish: (x:any)=>void = () => {};
  (api.get as jest.Mock).mockImplementation((_url, config) => config.params.accountId === 'one' ? new Promise(resolve => { finish = resolve; }) : Promise.resolve(page('Other account')));
  const {rerender}=render(<AnalyticsPosts key="one" platform="instagram" accountId="one"/>);
  expect(screen.queryByText(/No posts were returned/)).not.toBeInTheDocument();
  rerender(<AnalyticsPosts key="two" platform="instagram" accountId="two"/>); await screen.findByText('Other account');
  await act(async()=>{finish(page('Stale post'));}); expect(screen.queryByText('Stale post')).not.toBeInTheDocument();
});
test('expired cursors offer recovery to the latest posts', async () => {
  (api.get as jest.Mock).mockImplementation((_url,config)=>config.params.cursor ? Promise.reject({response:{data:{error:'This post page has expired.',code:'ANALYTICS_CURSOR_INVALID'}}}) : Promise.resolve(page('Latest post','expired-cursor')));
  render(<AnalyticsPosts platform="facebook" accountId="one"/>); await screen.findByText('Latest post');
  fireEvent.click(screen.getByRole('button',{name:'Next'})); await screen.findByText('This post page has expired.');
  fireEvent.click(screen.getByRole('button',{name:'Try again'})); await screen.findByText('Latest post');
  await waitFor(()=>expect(screen.getByRole('button',{name:'Previous'})).toBeDisabled());
});

test('renders real artwork beside a separate headline and caption with graceful image failure', async () => {
  const result=page('Legacy truncated title');
  Object.assign(result.data.posts[0],{caption:'A clear headline\n\nA separate caption with more detail.',thumbnailUrl:'https://cdn.example/post.jpg'});
  (api.get as jest.Mock).mockResolvedValue(result);
  const {container}=render(<AnalyticsPosts platform="facebook" accountId="one"/>);
  expect(await screen.findByRole('heading',{name:'A clear headline'})).toBeInTheDocument();
  expect(screen.getByText('A separate caption with more detail.')).toBeInTheDocument();
  const image=container.querySelector('.gd-post-artwork img')!;
  expect(image.getAttribute('src')).toBe('https://cdn.example/post.jpg');expect(image.getAttribute('loading')).toBe('lazy');
  fireEvent.error(image);expect(screen.getByRole('img',{name:'Thumbnail unavailable'})).toBeInTheDocument();
  expect(container.querySelector('.gd-post-artwork img')).toBeNull();expect(screen.getByRole('heading',{name:'A clear headline'})).toBeInTheDocument();
});
test('missing artwork and unsafe image URLs use a neutral placeholder', async () => {
  const result=page('Text-only post');Object.assign(result.data.posts[0],{thumbnailUrl:'javascript:alert(1)'});
  (api.get as jest.Mock).mockResolvedValue(result);
  const {container}=render(<AnalyticsPosts platform="instagram" accountId="one"/>);
  await screen.findByText('Text-only post');expect(screen.getByRole('img',{name:'Thumbnail unavailable'})).toBeInTheDocument();expect(container.querySelector('.gd-post-artwork img')).toBeNull();
});
