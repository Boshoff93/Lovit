import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import YouTubeAnalyticsPage from './YouTubeAnalyticsPage';
jest.mock('react-redux', () => ({useSelector: (fn: any) => fn({auth:{user:{userId:'owner'}}})}));
jest.mock('recharts', () => ({ResponsiveContainer:()=>null,AreaChart:()=>null,Area:()=>null,BarChart:()=>null,Bar:()=>null,XAxis:()=>null,YAxis:()=>null,CartesianGrid:()=>null,Tooltip:()=>null,Legend:()=>null}));
jest.mock('../store/apiSlice', () => {
  const summary={totalPosts:3,totals:{views:123,likes:4,comments:1},averages:{views:41},lastWeek:{views:10,likes:2,comments:1,posts:1},lastMonth:{views:123,likes:4,comments:1,posts:3},topByViews:[],topByEngagement:[]};
  const result=(args:any,data:any)=>({currentData:args.accountId==='one'?data:undefined,isFetching:args.accountId!=='one',refetch:jest.fn()});
  return {
    useGetSocialAccountsQuery:()=>({data:{accounts:[{accountId:'one',platform:'youtube',accountName:'First channel'},{accountId:'two',platform:'youtube',accountName:'Second channel'}]},refetch:jest.fn()}),
    useGetYouTubeSummaryQuery:(args:any)=>result(args,summary),
    useGetYouTubeTrendsQuery:(args:any)=>result(args,{trends:[]}),
    useGetYouTubeAccountStatsQuery:(args:any)=>result(args,{subscriberCount:99,videoCount:3}),
    useGetYouTubeVideosQuery:(args:any)=>result(args,{videos:[]}),
  };
});
test('switching video accounts keeps navigation usable and hides the previous account metrics while loading', async()=>{
  render(<MemoryRouter initialEntries={['/analytics/youtube?account=one']}><YouTubeAnalyticsPage/></MemoryRouter>);
  expect(screen.getByText('99')).toBeInTheDocument();
  await act(async()=>{fireEvent.mouseDown(screen.getByRole('combobox',{name:/Connected account/}));});
  fireEvent.click(await screen.findByRole('option',{name:'Second channel'}));
  expect(screen.getByRole('combobox',{name:/Connected account/})).toHaveTextContent('Second channel');
  expect(screen.getByRole('status',{name:'Loading YouTube analytics'})).toBeInTheDocument();
  expect(screen.queryByText('99')).not.toBeInTheDocument();
  expect(screen.getByRole('link',{name:'Analytics'})).toHaveAttribute('href','/analytics');
});
