import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSkeleton from './DashboardOverview';
import Layout from './Layout';
import WorkspaceSkeleton from './WorkspaceSkeleton';

export default function AccountLoadingState() {
  const { pathname } = useLocation();
  if (pathname.replace(/\/$/, '') === '/dashboard') {
    return <Layout isInitializing><DashboardSkeleton /></Layout>;
  }
  return <div className="gd-workspace gd-auth-loading"><WorkspaceSkeleton label="Loading account" /></div>;
}
