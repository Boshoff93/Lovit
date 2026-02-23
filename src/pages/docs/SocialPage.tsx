import React, { useCallback, useState } from 'react';
import { Box, Container, Typography, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { SEO } from '../../utils/seoHelper';
import { MarketingHeader } from '../../components/marketing';

const SectionDivider: React.FC = () => (
  <Box sx={{ my: 6 }}>
    <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)' }} />
  </Box>
);

const FeatureItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
    <CheckCircleOutlineIcon sx={{ color: '#4ECDC4', fontSize: 22, mt: 0.3, flexShrink: 0 }} />
    <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Box>
);

const tableCellSx = { color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.08)', fontSize: '0.95rem' };
const tableHeadSx = { color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)', fontWeight: 600, fontSize: '0.85rem' };

const SocialPage: React.FC = () => {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const handleOpenAuth = useCallback(() => setAuthOpen(true), []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #12121a 15%, #0a0a0c 30%, #0a0a0c 50%, #12121a 75%, #15151f 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(78, 205, 196, 0.15) 0%, transparent 40%), radial-gradient(ellipse 60% 30% at 70% 10%, rgba(139, 92, 246, 0.1) 0%, transparent 40%)',
        pointerEvents: 'none',
        zIndex: 0,
      },
    }}>
      <SEO
        title="Social Publishing & Analytics | Gruvi Documentation"
        description="Publish AI content to YouTube, TikTok, Instagram, Facebook, LinkedIn — and track performance with real-time analytics dashboards."
        keywords="social media publishing, schedule posts, YouTube analytics, TikTok analytics, social media analytics, content performance tracking"
        ogTitle="Social Publishing & Analytics | Gruvi"
        ogDescription="Publish to every platform and track what's working with real-time analytics"
        ogType="article"
        ogUrl="https://agentgruvi.com/docs/social"
      />

      <MarketingHeader onOpenAuth={handleOpenAuth} transparent alwaysBlurred />

      {/* Hero Section */}
      <Box sx={{ pt: { xs: 12, md: 16 }, pb: { xs: 1, md: 2 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            color="inherit"
            onClick={() => navigate('/docs')}
            sx={{ color: '#fff', mb: 2, '&:hover': { background: 'rgba(255,255,255,0.08)' } }}
          >
            Back to Docs
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Chip label="Feature" size="small" sx={{ background: 'rgba(78, 205, 196, 0.15)', color: '#4ECDC4', fontWeight: 600 }} />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#fff',
              mb: 1.5,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            Social Publishing{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              & Analytics
            </Box>
          </Typography>

          <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Publish your content everywhere and track what's working — all from one place.
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Box sx={{ py: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            '& p': { color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 },
            '& h2': { color: '#fff', fontSize: { xs: '1.5rem', md: '1.75rem' }, fontWeight: 700, mt: 0, mb: 3 },
          }}>

            <Typography component="p">
              Gruvi handles the entire publish-and-measure loop. Connect your social accounts, publish AI-generated content with a single click (or let your agent do it via API), then track views, engagement, and growth with real-time analytics dashboards.
            </Typography>

            <SectionDivider />

            {/* ==================== PUBLISHING ==================== */}

            <Typography component="h2">Supported Platforms</Typography>

            <TableContainer sx={{
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              mb: 4,
            }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableHeadSx}>Platform</TableCell>
                    <TableCell sx={tableHeadSx}>Publishing</TableCell>
                    <TableCell sx={tableHeadSx}>Analytics</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { name: 'TikTok', pub: 'Videos, captions, hashtags', analytics: 'Live' },
                    { name: 'YouTube', pub: 'Videos, Shorts, titles, descriptions, tags', analytics: 'Live' },
                    { name: 'Instagram', pub: 'Reels, video posts', analytics: 'Coming soon' },
                    { name: 'Facebook', pub: 'Videos to pages or profiles', analytics: 'Coming soon' },
                    { name: 'LinkedIn', pub: 'Professional video content', analytics: 'Planned' },
                    { name: 'X (Twitter)', pub: 'Video posts', analytics: 'Planned' },
                  ].map(row => (
                    <TableRow key={row.name}>
                      <TableCell sx={{ ...tableCellSx, fontWeight: 600 }}>{row.name}</TableCell>
                      <TableCell sx={tableCellSx}>{row.pub}</TableCell>
                      <TableCell sx={tableCellSx}>
                        <Chip
                          label={row.analytics}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            background: row.analytics === 'Live' ? 'rgba(52,199,89,0.15)' : 'rgba(255,255,255,0.06)',
                            color: row.analytics === 'Live' ? '#34C759' : 'rgba(255,255,255,0.5)',
                            border: row.analytics === 'Live' ? '1px solid rgba(52,199,89,0.3)' : '1px solid rgba(255,255,255,0.1)',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <SectionDivider />

            <Typography component="h2">Connecting Accounts</Typography>

            <Typography component="p">
              Go to <strong>Settings &gt; Integrations</strong> and click <strong>Connect</strong> next to each platform. You'll authorize Gruvi via OAuth — your credentials are stored securely and you can disconnect at any time. You can connect up to 3 accounts per platform for multi-brand management.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Publishing Content</Typography>

            <Typography component="p">
              After creating content (music, video, UGC), publish directly from the creation page or your content library. Select platforms, add a caption, and publish immediately or schedule for later.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>One-click multi-platform</strong> — select TikTok, YouTube, and Instagram at once and publish to all three simultaneously.</FeatureItem>
              <FeatureItem><strong>Scheduling</strong> — pick a date and time, and Gruvi publishes automatically. Great for maintaining a consistent cadence.</FeatureItem>
              <FeatureItem><strong>Calendar view</strong> — see all your upcoming posts in a day/week/month calendar at <strong>/settings/scheduled-content</strong>.</FeatureItem>
              <FeatureItem><strong>Agent-powered</strong> — AI agents can publish via the scheduling API, automating the entire content pipeline end to end.</FeatureItem>
            </Box>

            <SectionDivider />

            {/* ==================== ANALYTICS ==================== */}

            <Typography component="h2">Analytics Overview</Typography>

            <Typography component="p">
              The analytics hub at <strong>/analytics</strong> shows all your connected platforms at a glance. Click into any platform for a full analytics dashboard with KPI cards, trend charts, and performance tables.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>Analytics hub</strong> — overview of all platforms with quick-glance metrics and navigation to detailed dashboards.</FeatureItem>
              <FeatureItem><strong>Per-platform dashboards</strong> — deep-dive into TikTok at <strong>/analytics/tiktok</strong> and YouTube at <strong>/analytics/youtube</strong>.</FeatureItem>
              <FeatureItem><strong>Multi-account selector</strong> — if you manage multiple accounts on one platform, switch between them from the dropdown.</FeatureItem>
              <FeatureItem><strong>API access</strong> — every metric visible in the dashboard is also available via API for your AI agent to query programmatically.</FeatureItem>
            </Box>

            <SectionDivider />

            <Typography component="h2">TikTok Analytics</Typography>

            <Typography component="p">
              Full analytics for your TikTok account — updated in real time from the TikTok API.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>KPI cards</strong> — followers, total videos, total views (with week-over-week change), total likes, and engagement rate.</FeatureItem>
              <FeatureItem><strong>Last 7 days</strong> — see which videos you posted each day with thumbnail previews and hover-to-see metrics (views, likes, comments, shares).</FeatureItem>
              <FeatureItem><strong>Views over time</strong> — area chart with daily, weekly, or monthly toggle.</FeatureItem>
              <FeatureItem><strong>Engagement over time</strong> — stacked bar chart showing likes, comments, and shares per period.</FeatureItem>
              <FeatureItem><strong>Post frequency</strong> — bar chart showing how often you're posting.</FeatureItem>
              <FeatureItem><strong>Week-over-week comparison</strong> — table comparing this week's metrics to the monthly average.</FeatureItem>
              <FeatureItem><strong>Top performers</strong> — tables of your best videos ranked by views and by engagement rate.</FeatureItem>
            </Box>

            <SectionDivider />

            <Typography component="h2">YouTube Analytics</Typography>

            <Typography component="p">
              Channel and video performance powered by the YouTube Data API v3.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>KPI cards</strong> — subscribers, total videos, total views (with week-over-week change), total likes, and engagement rate.</FeatureItem>
              <FeatureItem><strong>Last 7 days</strong> — recent uploads with 16:9 thumbnail previews and hover metrics (views, likes, comments).</FeatureItem>
              <FeatureItem><strong>Views over time</strong> — area chart with daily, weekly, or monthly toggle.</FeatureItem>
              <FeatureItem><strong>Engagement over time</strong> — stacked bar chart for likes and comments per period.</FeatureItem>
              <FeatureItem><strong>Upload frequency</strong> — bar chart tracking your posting cadence.</FeatureItem>
              <FeatureItem><strong>Week-over-week comparison</strong> — views, likes, comments, and uploads vs monthly average.</FeatureItem>
              <FeatureItem><strong>Top performers</strong> — best videos by views and by engagement rate, with direct links to YouTube.</FeatureItem>
            </Box>

            <Typography component="p">
              <strong>Note:</strong> YouTube does not publicly expose share counts, so engagement is calculated as (likes + comments) / views.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Instagram & Facebook Analytics</Typography>

            <Typography component="p">
              Analytics for Instagram and Facebook are coming soon. They'll follow the same dashboard pattern — KPI cards, trend charts, top performers — so the experience will be familiar.
            </Typography>

            <SectionDivider />

            <Typography component="h2">Tips for Growing Your Channels</Typography>

            <Box sx={{ mb: 4 }}>
              <FeatureItem><strong>Publish everywhere.</strong> The same video can perform very differently across platforms. Post to all and let the analytics show you where to double down.</FeatureItem>
              <FeatureItem><strong>Be consistent.</strong> Schedule 1-3 posts per day. Consistent cadence beats sporadic bursts for algorithm performance.</FeatureItem>
              <FeatureItem><strong>Use your data.</strong> Check top performers weekly. Notice which topics, styles, and hooks drive the most engagement — then create more of that.</FeatureItem>
              <FeatureItem><strong>Let agents handle the loop.</strong> AI agents can create content, publish on schedule, pull analytics, and adjust strategy automatically — giving your channels an unfair advantage.</FeatureItem>
            </Box>

            {/* CTA */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', mb: 2 }}>
                Ready to Grow?
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, maxWidth: 500, mx: 'auto' }}>
                Connect your social accounts to start publishing and tracking performance.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/settings/connected-accounts')}
                  sx={{
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { background: 'linear-gradient(135deg, #5DE0D7 0%, #4FB89F 100%)' },
                  }}
                >
                  Connect Accounts
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/analytics')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': { borderColor: '#4ECDC4', background: 'rgba(78,205,196,0.1)' },
                  }}
                >
                  View Analytics
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default SocialPage;
