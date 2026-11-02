import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Alert,
  Chip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Link as LinkIcon,
  ArrowForward,
  Schedule,
  CheckCircle,
  YouTube,
  Add,
  Close,
} from '@mui/icons-material';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { youtubeApi, tiktokApi, instagramApi, linkedinApi, twitterApi, socialAccountsApi } from '../services/api';
import { useGetSocialAccountsQuery } from '../store/apiSlice';

// Social platform configurations
const socialPlatforms = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: () => (
      <YouTube sx={{ fontSize: 20, color: '#fff' }} />
    ),
    color: '#FF0000',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
    available: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 18, height: 18, fill: '#fff' }}
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </Box>
    ),
    color: '#000000',
    gradient: 'linear-gradient(135deg, #243c47, #15303b)',
    available: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 18, height: 18, fill: '#fff' }}
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </Box>
    ),
    color: '#E4405F',
    gradient: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
    available: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 18, height: 18, fill: '#fff' }}
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </Box>
    ),
    color: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0D5DB8 100%)',
    available: true,
    sharedAuth: 'instagram',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 18, height: 18, fill: '#fff' }}
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </Box>
    ),
    color: '#0077B5',
    gradient: 'linear-gradient(135deg, #0077B5 0%, #005582 100%)',
    available: true,
  },
  {
    id: 'twitter',
    name: 'X',
    icon: () => (
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 16, height: 16, fill: '#fff' }}
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </Box>
    ),
    color: '#000000',
    gradient: 'linear-gradient(135deg, #3b475c, #253144)',
    available: true,
  },
];

interface SocialAccount {
  accountId: string;
  platform: string;
  accountName?: string;
  username?: string;
  avatarUrl?: string;
  connectedAt?: string;
}

const ConnectedAccountsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId || '';

  // Fetch all social accounts from the unified endpoint
  const socialAccountsQuery = useGetSocialAccountsQuery({ userId }, { skip: !userId });
  const { refetch: refetchAccounts } = socialAccountsQuery;
  const accounts = useMemo<SocialAccount[]>(() => socialAccountsQuery.data?.accounts || [], [socialAccountsQuery.data?.accounts]);

  // Group accounts by platform
  const accountsByPlatform = useMemo(() => {
    const grouped: Record<string, SocialAccount[]> = {};
    for (const platform of socialPlatforms) {
      grouped[platform.id] = accounts.filter(a => a.platform === platform.id);
    }
    return grouped;
  }, [accounts]);

  // Local state
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [disconnectingAccountId, setDisconnectingAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    const availablePlatforms = socialPlatforms.filter(p => p.available);
    const connectedCount = accounts.length;
    const platformsConnected = availablePlatforms.filter(p => accountsByPlatform[p.id]?.length > 0).length;
    const totalAvailable = availablePlatforms.length;
    return { connectedCount, platformsConnected, totalAvailable };
  }, [accounts, accountsByPlatform]);

  // Handle OAuth redirect result from URL params
  useEffect(() => {
    const youtubeResult = searchParams.get('youtube');
    const tiktokResult = searchParams.get('tiktok');
    const instagramResult = searchParams.get('instagram');
    const message = searchParams.get('message');
    const channel = searchParams.get('channel');
    const username = searchParams.get('username');

    if (youtubeResult === 'success') {
      setSuccess(`YouTube connected${channel ? ` to ${channel}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
      refetchAccounts();
    } else if (youtubeResult === 'error') {
      setError(message || 'Failed to connect YouTube');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }

    if (tiktokResult === 'success') {
      setSuccess(`TikTok connected${username ? ` as @${username}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
      refetchAccounts();
    } else if (tiktokResult === 'error') {
      setError(message || 'Failed to connect TikTok');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }

    if (instagramResult === 'success') {
      setSuccess(`Instagram connected${username ? ` as @${username}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
      refetchAccounts();
    } else if (instagramResult === 'error') {
      setError(message || 'Failed to connect Instagram');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }

    const xResult = searchParams.get('x');
    if (xResult === 'success') {
      setSuccess(`X connected${username ? ` as @${username}` : ''}!`);
      setTimeout(() => setSuccess(null), 5000);
      setSearchParams({});
      refetchAccounts();
    } else if (xResult === 'error') {
      setError(message || 'Failed to connect X');
      setTimeout(() => setError(null), 5000);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, refetchAccounts]);

  const handleConnect = async (platformId: string) => {
    if (!userId) return;

    setConnectingPlatform(platformId);

    try {
      let authUrl: string;
      switch (platformId) {
        case 'youtube':
          authUrl = (await youtubeApi.getAuthUrl(userId)).data.authUrl;
          break;
        case 'tiktok':
          authUrl = (await tiktokApi.getAuthUrl(userId)).data.authUrl;
          break;
        case 'instagram':
          authUrl = (await instagramApi.getAuthUrl(userId, 'instagram')).data.authUrl;
          break;
        case 'facebook':
          authUrl = (await instagramApi.getAuthUrl(userId, 'facebook')).data.authUrl;
          break;
        case 'linkedin':
          authUrl = (await linkedinApi.getAuthUrl(userId)).data.authUrl;
          break;
        case 'twitter':
          // OAuth 2.0 with PKCE: supports v2 pay-as-you-go API (media upload + tweets)
          authUrl = (await twitterApi.getAuthUrl(userId)).data.authUrl;
          break;
        default:
          throw new Error('Unknown platform');
      }
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to start ${platformId} connection`);
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (accountId: string, platformName: string) => {
    if (!userId) return;

    setDisconnectingAccountId(accountId);

    try {
      await socialAccountsApi.disconnect(userId, accountId);
      refetchAccounts();
      setSuccess(`${platformName} account disconnected`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to disconnect ${platformName}`);
    } finally {
      setDisconnectingAccountId(null);
    }
  };

  const getAccountDisplayName = (account: SocialAccount): string => {
    if (account.username) return `@${account.username}`;
    if (account.accountName) return account.accountName;
    return 'Connected';
  };

  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Your publishing channels</p>
          <h1>Connected accounts</h1>
          <p>Connect your channels to publish from Gruvi or through your agent.</p>
          <div className="gd-connection-summary">
            <span><strong>{stats.connectedCount}</strong> accounts</span>
            <span><strong>{stats.platformsConnected}/{stats.totalAvailable}</strong> channels connected</span>
          </div>
        </div>
      </header>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 3 }}>{success}</Alert>}
      {socialAccountsQuery.isError && (
        <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" onClick={() => socialAccountsQuery.refetch()}>Retry</Button>}>
          Your connected accounts could not be loaded. Try again before making changes.
        </Alert>
      )}

      {socialAccountsQuery.isLoading ? (
        <Box sx={{ width: "100%" }}>
          <WorkspaceSkeleton label="Loading connected accounts" rows={6} />
        </Box>
      ) : (
        <div className="gd-channel-grid">
          {socialPlatforms.map((platform) => {
            const platformAccounts = accountsByPlatform[platform.id] || [];
            const IconComponent = platform.icon;
            const isConnecting = connectingPlatform === platform.id;
            const hasAccounts = platformAccounts.length > 0;

            return (
              <article key={platform.id} className={`gd-channel-card${hasAccounts ? ' is-connected' : ''}`}>
                <div className="gd-channel-heading">
                  <div className="gd-channel-icon" style={{ background: platform.gradient }} aria-hidden="true">
                    <IconComponent />
                  </div>
                  <span className={`gd-channel-status${hasAccounts ? ' is-connected' : !platform.available ? ' is-soon' : ''}`}>
                    {hasAccounts ? <CheckCircle /> : !platform.available ? <Schedule /> : <LinkIcon />}
                    {hasAccounts ? 'Connected' : platform.available ? 'Ready to connect' : 'Coming soon'}
                  </span>
                </div>
                <div>
                  <h2>{platform.name}</h2>
                  <p>{hasAccounts
                    ? `${platformAccounts.length} ${platformAccounts.length === 1 ? 'account' : 'accounts'} connected for publishing.`
                    : platform.available ? `Connect ${platform.name} to add it to your publishing channels.`
                    : `${platform.name} publishing is on the way.`}</p>
                </div>
                {hasAccounts && (
                  <div className="gd-connected-chips">
                    {platformAccounts.map((account) => (
                      <Chip
                        key={account.accountId}
                        avatar={account.avatarUrl ? <Avatar src={account.avatarUrl} alt="">{getAccountDisplayName(account).replace(/^@/, "").charAt(0).toUpperCase()}</Avatar> : undefined}
                        label={getAccountDisplayName(account)}
                        onDelete={disconnectingAccountId ? undefined : () => handleDisconnect(account.accountId, platform.name)}
                        deleteIcon={disconnectingAccountId === account.accountId
                          ? <CircularProgress size={14} aria-label="Disconnecting account" />
                          : <Close aria-label={`Disconnect ${getAccountDisplayName(account)}`} />}
                      />
                    ))}
                  </div>
                )}
                {platform.available && (
                  <Button
                    className="gd-channel-action gd-primary-action gd-card-action"
                    variant="contained"
                    onClick={() => handleConnect(platform.id)}
                    disabled={!!connectingPlatform || socialAccountsQuery.isError}
                    aria-label={hasAccounts ? `Add another ${platform.name} account` : `Connect ${platform.name}`}
                    startIcon={isConnecting ? <CircularProgress size={16} color="inherit" /> : <Add />}
                    endIcon={!isConnecting ? <ArrowForward /> : undefined}
                  >
                    {isConnecting ? 'Connecting...' : hasAccounts ? 'Add account' : `Connect ${platform.name}`}
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      )}
      <div className="gd-connection-note">
        <LinkIcon sx={{ color: '#71e4dc', mt: 0.25, flexShrink: 0 }} />
        <p>Connect once, then choose the accounts for each post. Use the same channels in your <Link to="/posts/new">post composer</Link> or through <Link to="/agents">agent access</Link>.</p>
      </div>
    </div>
  );
};

export default ConnectedAccountsPage;
