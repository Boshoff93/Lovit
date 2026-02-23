import React, { useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BarChartIcon from '@mui/icons-material/BarChart';
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
    comingSoon: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0C5DC7 100%)',
    route: '/analytics/facebook',
    icon: <FacebookIcon />,
    comingSoon: true,
  },
];

const AnalyticsOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId || '';

  const { data: socialAccountsData } = useGetSocialAccountsQuery(
    { userId },
    { skip: !userId }
  );

  const connectedPlatforms = useMemo(() => {
    const accounts = socialAccountsData?.accounts || [];
    const connected = new Set<string>();
    accounts.forEach(a => connected.add(a.platform));
    return connected;
  }, [socialAccountsData]);

  if (!userId) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 }, textAlign: 'center', py: 8 }}>
        <BarChartIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.2)', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)' }}>Sign in to view analytics</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <Box sx={{
          width: 56, height: 56, borderRadius: '16px',
          background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,122,255,0.3)',
          flexShrink: 0,
        }}>
          <BarChartIcon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' } }}>
            Analytics
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Track performance across your social channels
          </Typography>
        </Box>
      </Box>

      {/* Platform Cards Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}>
        {platforms.map((platform) => {
          const isConnected = connectedPlatforms.has(platform.id);
          const isAvailable = !platform.comingSoon;

          return (
            <Box
              key={platform.id}
              onClick={() => {
                if (isAvailable && isConnected) {
                  navigate(platform.route);
                }
              }}
              sx={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: isAvailable && isConnected ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': isAvailable && isConnected ? {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.15)',
                } : {},
              }}
            >
              {/* Gradient header */}
              <Box sx={{
                background: platform.gradient,
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: platform.comingSoon ? 0.6 : 1,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {platform.icon}
                  <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                    {platform.name}
                  </Typography>
                </Box>
                {platform.comingSoon && (
                  <Box sx={{
                    px: 1.5, py: 0.5,
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.9)',
                  }}>
                    Coming Soon
                  </Box>
                )}
              </Box>

              {/* Card body */}
              <Box sx={{ p: 2.5 }}>
                {platform.comingSoon ? (
                  <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', mb: 1 }}>
                    Analytics for {platform.name} will be available soon.
                  </Typography>
                ) : isConnected ? (
                  <>
                    <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                      View detailed analytics for your {platform.name} channel.
                    </Typography>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(platform.route);
                      }}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        px: 2,
                        py: 0.75,
                        textTransform: 'none',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      View Analytics
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', mb: 2 }}>
                      Connect your {platform.name} account to see analytics.
                    </Typography>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/settings/connected-accounts');
                      }}
                      startIcon={<LinkIcon />}
                      sx={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        px: 2,
                        py: 0.75,
                        textTransform: 'none',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      Connect in Settings
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AnalyticsOverviewPage;
