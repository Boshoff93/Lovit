import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import WorkspaceNotice from "../components/WorkspaceNotice";
import React, { useMemo } from 'react';
import { Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LinkIcon from '@mui/icons-material/Link';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useGetSocialAccountsQuery } from '../store/apiSlice';

interface PlatformConfig {
  id: string;
  name: string;
  gradient: string;
  route: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const YTIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.27 8.27 0 0 0 4.81 1.54V6.84a4.86 4.86 0 0 1-1.05-.15z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const platforms: PlatformConfig[] = [
  { id: 'twitter', name: 'X', gradient: '#202936', route: '/analytics/twitter', icon: <span aria-hidden="true">𝕏</span> },
  {
    id: 'tiktok',
    name: 'TikTok',
    gradient: 'linear-gradient(135deg, #EE1D52 0%, #69C9D0 100%)',
    route: '/analytics/tiktok',
    icon: <TikTokIcon />,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
    route: '/analytics/youtube',
    icon: <YTIcon />,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    gradient: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
    route: '/analytics/instagram',
    icon: <InstagramIcon />,
    comingSoon: false,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0C5DC7 100%)',
    route: '/analytics/facebook',
    icon: <FacebookIcon />,
    comingSoon: false,
  },
];

const AnalyticsOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId || '';

  const accountsQuery = useGetSocialAccountsQuery(
    { userId },
    { skip: !userId }
  );

  const connectedPlatforms = useMemo(() => {
    const accounts = accountsQuery.data?.accounts || [];
    const connected = new Set<string>();
    accounts.forEach(a => connected.add(a.platform));
    return connected;
  }, [accountsQuery.data]);

  if (!userId) {
    return <Alert severity="info">Sign in to view analytics.</Alert>;
  }

  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Measure your content</p>
          <h1>Analytics</h1>
          <p>See how your published content performs on each channel.</p>
          <Button className="gd-text-link gd-related-link" onClick={() => navigate('/settings/connected-accounts')} endIcon={<ArrowForwardIcon />} sx={{ textTransform: 'none', p: 0 }}>
            Connected accounts
          </Button>
        </div>
      </header>
      {accountsQuery.isError && (
        <WorkspaceNotice onRetry={() => accountsQuery.refetch()}>
          Your connected accounts could not be loaded.
        </WorkspaceNotice>
      )}
      {accountsQuery.isLoading ? (
        <WorkspaceSkeleton label="Loading analytics channels" rows={4} />
      ) : (
        <div className="gd-channel-grid gd-analytics-grid">
          {platforms.map((platform) => {
            const isConnected = connectedPlatforms.has(platform.id);
            const isAvailable = !platform.comingSoon;
            return (
              <article className="gd-channel-card" key={platform.id}>
                <div className="gd-channel-heading">
                  <div className="gd-channel-icon" style={{ background: platform.gradient }} aria-hidden="true">{platform.icon}</div>
                  <span className={`gd-channel-status${platform.comingSoon ? ' is-soon' : isConnected ? ' is-connected' : ''}`}>
                    {platform.comingSoon ? <ScheduleIcon /> : isConnected ? <CheckCircleIcon /> : <LinkIcon />}
                    {platform.comingSoon ? 'Coming soon' : isConnected ? 'Connected' : 'Connect to view'}
                  </span>
                </div>
                <div>
                  <h2>{platform.name}</h2>
                  <p>{platform.comingSoon
                    ? `${platform.name} analytics is coming to Gruvi.`
                    : isConnected ? `View ${platform.id === 'twitter' ? 'recent post engagement (beta)' : ['instagram','facebook'].includes(platform.id) ? 'account insights and recent post engagement' : 'performance and engagement'} for your ${platform.name} content.`
                    : `Connect your ${platform.name} account to view its performance.`}</p>
                </div>
                {isAvailable ? (
                  <Button
                    className="gd-channel-action gd-primary-action gd-card-action"
                    variant="contained"
                    disabled={accountsQuery.isError}
                    onClick={() => navigate(isConnected ? platform.route : '/settings/connected-accounts')}
                    endIcon={<ArrowForwardIcon />}
                  >
                    {isConnected ? 'View analytics' : `Connect ${platform.name}`}
                  </Button>
                ) : (
                  <p className="gd-analytics-note">Publishing is available now. Analytics is coming next.</p>
                )}
              </article>
            );
          })}
        </div>
      )}
      <div className="gd-connection-note">
        <BarChartIcon sx={{ color: '#71e4dc', mt: 0.25, flexShrink: 0 }} />
        <p>Analytics availability varies by platform. Your posts and delivery status are always in <button className="gd-text-link" onClick={() => navigate('/settings/scheduled-content')}>Posts & Calendar</button>.</p>
      </div>
    </div>
  );
};

export default AnalyticsOverviewPage;
