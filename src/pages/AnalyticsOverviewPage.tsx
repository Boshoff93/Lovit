import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useGetSocialAccountsQuery } from '../store/apiSlice';
import AnalyticsWorkspaceHeader from '../components/AnalyticsWorkspaceHeader';
import AnalyticsSnapshot from '../components/AnalyticsSnapshot';
import WorkspaceNotice from '../components/WorkspaceNotice';
import { AnalyticsChannelsSkeleton } from '../components/AnalyticsSkeleton';

export default function AnalyticsOverviewPage() {
  const userId = useSelector((state: RootState) => state.auth.user?.userId) || '';
  const accounts = useGetSocialAccountsQuery({ userId }, { skip: !userId });
  if (!userId) return <WorkspaceNotice severity="info">Sign in to view analytics.</WorkspaceNotice>;
  return <div className="gd gd-analytics-overview">
    <AnalyticsWorkspaceHeader accounts={accounts.data?.accounts || []} loading={accounts.isLoading}/>
    {accounts.isError && <WorkspaceNotice onRetry={() => accounts.refetch()}>Your connected accounts could not be loaded.</WorkspaceNotice>}
    {accounts.isLoading ? <AnalyticsChannelsSkeleton/> : !accounts.isError && <AnalyticsSnapshot accounts={accounts.data?.accounts || []} userId={userId}/>}
  </div>;
}
