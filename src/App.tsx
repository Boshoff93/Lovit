import React, { useEffect, useState, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import api from './utils/axiosConfig';
import FeatureLockedModal from './components/FeatureLockedModal';

// Layout
import Layout from './components/Layout';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import AuthInitializer from './components/AuthInitializer';

// Pages
import HomePage from './pages/HomePage';
import AppPage from './pages/AppPage';
import AccountPage from './pages/AccountPage';
import PaymentPage from './pages/PaymentPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResendVerificationPage from './pages/ResendVerificationPage';
import PasswordResetRequestPage from './pages/PasswordResetRequestPage';
import PasswordResetPage from './pages/PasswordResetPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import SupportPage from './pages/SupportPage';
import FAQPage from './pages/FAQPage';
import DashboardFAQPage from './pages/DashboardFAQPage';
import FAQQuestionPage from './pages/FAQQuestionPage';
import AdminEmailPage from './pages/AdminEmailPage';
import UnsubscribePage from './pages/UnsubscribePage';
import GenreDetailPage from './pages/GenreDetailPage';
import LanguageDetailPage from './pages/LanguageDetailPage';
import MoodDetailPage from './pages/MoodDetailPage';
import StyleDetailPage from './pages/StyleDetailPage';
import SocialDetailPage from './pages/SocialDetailPage';
import MusicVideoDetailPage from './pages/MusicVideoDetailPage';
import CreateVideoPage from './pages/CreateVideoPage';
import CreateMusicPage from './pages/CreateMusicPage';
import MusicVideoPlayer from './pages/MusicVideoPlayer';
import SettingsPage from './pages/SettingsPage';
import ConnectedAccountsPage from './pages/ConnectedAccountsPage';
import CharactersPage from './pages/CharactersPage';
import CreateCharacterPage from './pages/CreateCharacterPage';
import YouTubeCallbackPage from './pages/YouTubeCallbackPage';
import TikTokCallbackPage from './pages/TikTokCallbackPage';
import InstagramCallbackPage from './pages/InstagramCallbackPage';
import LinkedInCallbackPage from './pages/LinkedInCallbackPage';
import UploadPage from './pages/UploadPage';
import TrackDetailPage from './pages/TrackDetailPage';
import ScheduledContentPage from './pages/ScheduledContentPage';
import DashboardSubscriptionPage from './pages/DashboardSubscriptionPage';
import AIMusicPage from './pages/AIMusicPage';
import AIMusicVideosPage from './pages/AIMusicVideosPage';
import AIVideoShortsPage from './pages/AIVideoShortsPage';
import SocialMediaPage from './pages/SocialMediaPage';
import BlogPage from './pages/BlogPage';
import MotionControlViralContent from './pages/blog/motion-control-viral-content';
import HowToCreatePromoMusicVideo from './pages/blog/how-to-create-promo-music-video';
import MotionCapturePage from './pages/MotionCapturePage';
import CreateNarrativePage from './pages/CreateNarrativePage';
import MyNarrativesPage from './pages/MyNarrativesPage';

// Route config
import { getAllRoutePaths } from './config/routeConfig';

// FAQ page wrapper - shows Dashboard-style in Layout when accessed from dashboard, standalone otherwise
const FAQWithOptionalLayout = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  // Check if coming from dashboard (via state)
  const fromDashboard = location.state?.fromDashboard === true;
  
  // If logged in and coming from dashboard, show Dashboard-style FAQ
  if (token && fromDashboard) {
    return (
      <Layout>
        <DashboardFAQPage />
      </Layout>
    );
  }
  
  // Otherwise show standalone full-page FAQ (Fable-style) - including from HomePage
  return <FAQPage />;
};

// Route guard to check authentication (no subscription requirement - upsell happens when user tries to generate)
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const redirectVerified = searchParams.get('verified') === 'true';

  // Check if user is verified
  if (user && !user.isVerified && !redirectVerified) {
    return <Navigate to="/resend-verification" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Route guard to check authentication and admin status
const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAdmin = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await api.get('/api/validate-admin');
        const data = response.data;

        if (!data.isAdmin) {
          setIsAuthorized(false);
          setError(data.error || 'Unauthorized access');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
        setError('Error validating admin access');
      }
    };

    validateAdmin();
  }, [token]);

  if (isAuthorized === null) {
    // Still loading
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0D0D0F' }}>
        <CircularProgress sx={{ color: '#007AFF' }} />
      </Box>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" state={{ from: location, error }} replace />;
  }

  return <>{children}</>;
};

// Route guard to check subscription status - shows modal for free users
const RequireSubscription = ({
  children,
  featureName,
  description
}: {
  children: React.ReactNode;
  featureName: string;
  description?: string;
}) => {
  const { subscription, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const hasSubscription = subscription?.tier && subscription.tier !== 'free';
  const isTrialing = subscription?.status === 'trialing';

  // Check if TrialPaywallModal would be shown (same logic as Layout.tsx)
  // If so, don't show FeatureLockedModal to avoid double modals
  const showTrialPaywall = !!user && !hasSubscription && !isTrialing;

  // Reset and show modal when navigating to a different locked page
  useEffect(() => {
    if (!hasSubscription) {
      setShowModal(true);
    }
  }, [hasSubscription, location.pathname]);

  // If trial paywall is showing, don't show feature locked modal - just render children
  // The TrialPaywallModal from Layout will handle the blocking
  if (showTrialPaywall) {
    return <>{children}</>;
  }

  if (!hasSubscription) {
    return (
      <Box sx={{ position: 'relative', width: '100%', minHeight: '100%' }}>
        {/* Blur overlay - only covers content area, accounts for mobile top bar */}
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 56, md: 0 }, // Account for mobile top bar (56px)
            left: { xs: 0, md: 240 },
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(241, 245, 249, 0.8) 50%, rgba(219, 234, 254, 0.7) 100%)',
            backdropFilter: 'blur(3px)',
            zIndex: 1300,
          }}
        />
        <FeatureLockedModal
          open={showModal}
          onClose={() => {}} // Modal cannot be dismissed - only way out is to subscribe
          featureName={featureName}
          description={description}
        />
        {children}
      </Box>
    );
  }

  return <>{children}</>;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Get all SEO routes from config
const seoRoutes = getAllRoutePaths().filter(path => path !== '/');

function App() {
  return (
    <AudioPlayerProvider>
      <Router>
        <ScrollToTop />
        <AuthInitializer>
        <Routes>
        {/* Public landing page */}
        <Route path="/" element={<HomePage />} />

        {/* Public pricing page - for non-logged in users */}
        <Route path="/pricing" element={<PaymentPage />} />

        {/* Public landing pages with dedicated designs */}
        <Route path="/ai-music" element={<AIMusicPage />} />
        <Route path="/ai-music-videos" element={<AIMusicVideosPage />} />
        <Route path="/ai-video-shorts" element={<AIVideoShortsPage />} />
        <Route path="/social-media" element={<SocialMediaPage />} />

        {/* Blog pages */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/motion-control-viral-content" element={<MotionControlViralContent />} />
        <Route path="/blog/how-to-create-promo-music-video" element={<HowToCreatePromoMusicVideo />} />

        {/* Social platform detail pages - must be before SEO routes */}
        <Route path="/platforms/:platformId" element={<SocialDetailPage />} />
        
        {/* Dynamic SEO routes - all render HomePage with different SEO meta */}
        {seoRoutes.map((path) => (
          <Route key={path} path={path} element={<HomePage />} />
        ))}
        
        {/* Unsubscribe page */}
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        
        {/* YouTube OAuth callback */}
        <Route path="/youtube/callback" element={<YouTubeCallbackPage />} />
        
        {/* TikTok OAuth callback */}
        <Route path="/tiktok/callback" element={<TikTokCallbackPage />} />
        
        {/* Instagram OAuth callback */}
        <Route path="/instagram/callback" element={<InstagramCallbackPage />} />
        
        {/* LinkedIn OAuth callback */}
        <Route path="/linkedin/callback" element={<LinkedInCallbackPage />} />
        
        {/* Admin email management - protected admin route */}
        <Route path="/admin/email" element={
          <RequireAdmin>
            <Layout>
              <AdminEmailPage />
            </Layout>
          </RequireAdmin>
        } />
        
        {/* Dashboard subscription page - with sidebar for logged in users */}
        <Route path="/payment" element={
          <RequireAuth>
            <Layout>
              <DashboardSubscriptionPage />
            </Layout>
          </RequireAuth>
        } />
        
        {/* Dedicated My Music route */}
        <Route path="/my-music" element={
          <RequireAuth>
            <Layout>
              <AppPage defaultTab="songs" />
            </Layout>
          </RequireAuth>
        } />

        {/* Dedicated My Videos route */}
        <Route path="/my-videos" element={
          <RequireAuth>
            <Layout>
              <AppPage defaultTab="videos" />
            </Layout>
          </RequireAuth>
        } />
        
        {/* Account page - protected route */}
        <Route path="/account" element={
          <RequireAuth>
            <Layout>
              <AccountPage />
            </Layout>
          </RequireAuth>
        } />

        {/* Settings page - protected route */}
        <Route path="/settings" element={
          <RequireAuth>
            <Layout>
              <SettingsPage />
            </Layout>
          </RequireAuth>
        } />
        <Route path="/settings/connected-accounts" element={
          <RequireAuth>
            <Layout>
              <RequireSubscription
                featureName="Integrations"
                description="Connect your social media accounts to share your videos directly to your favorite platforms, all in one click."
              >
                <ConnectedAccountsPage />
              </RequireSubscription>
            </Layout>
          </RequireAuth>
        } />
        <Route path="/settings/scheduled-content" element={
          <RequireAuth>
            <Layout>
              <RequireSubscription
                featureName="Scheduled Posts"
                description="Schedule your content to be automatically posted to your connected social media accounts."
              >
                <ScheduledContentPage />
              </RequireSubscription>
            </Layout>
          </RequireAuth>
        } />

        {/* AI Assets page - protected route */}
        <Route path="/ai-assets" element={
          <RequireAuth>
            <Layout>
              <CharactersPage />
            </Layout>
          </RequireAuth>
        } />

        {/* Create AI Asset page - protected route */}
        <Route path="/ai-assets/create" element={
          <RequireAuth>
            <Layout>
              <CreateCharacterPage />
            </Layout>
          </RequireAuth>
        } />

        {/* Edit AI Asset page - protected route */}
        <Route path="/ai-assets/edit/:characterId" element={
          <RequireAuth>
            <Layout>
              <CreateCharacterPage />
            </Layout>
          </RequireAuth>
        } />
        
        {/* Redirects for old routes */}
        <Route path="/dashboard" element={<Navigate to="/my-music" replace />} />
        <Route path="/my-library" element={<Navigate to="/my-music" replace />} />
        <Route path="/characters" element={<Navigate to="/ai-assets" replace />} />
        <Route path="/characters/create" element={<Navigate to="/ai-assets/create" replace />} />
        <Route path="/characters/edit/:characterId" element={<Navigate to="/ai-assets/edit/:characterId" replace />} />
        <Route path="/my-cast" element={<Navigate to="/ai-assets" replace />} />
        <Route path="/my-cast/create" element={<Navigate to="/ai-assets/create" replace />} />
        <Route path="/my-cast/edit/:characterId" element={<Navigate to="/ai-assets/edit/:characterId" replace />} />
        
        {/* Verify email page */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        
        {/* Resend verification page */}
        <Route path="/resend-verification" element={<ResendVerificationPage />} />

        {/* Password reset request page */}
        <Route path="/reset-password-request" element={<PasswordResetRequestPage />} />
        
        {/* Password reset page */}
        <Route path="/reset-password" element={<PasswordResetPage />} />

        {/* Terms, Privacy, and Support pages */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/support" element={
          <RequireAuth>
            <Layout>
              <SupportPage />
            </Layout>
          </RequireAuth>
        } />
        <Route path="/faq" element={<FAQWithOptionalLayout />} />
        <Route path="/faq/:question" element={<FAQQuestionPage />} />
        
        {/* Detail pages */}
        <Route path="/genres/:genreId" element={<GenreDetailPage />} />
        <Route path="/languages/:languageId" element={<LanguageDetailPage />} />
        <Route path="/moods/:moodId" element={<MoodDetailPage />} />
        <Route path="/styles/:styleId" element={<StyleDetailPage />} />
        <Route path="/videos/:videoId" element={<MusicVideoDetailPage />} />
        
        {/* Music Video Player - protected route */}
        <Route path="/video/:videoId" element={
          <RequireAuth>
            <Layout>
              <MusicVideoPlayer />
            </Layout>
          </RequireAuth>
        } />
        
        {/* Create pages - protected routes */}
        <Route path="/create" element={<Navigate to="/create/music" replace />} />
        <Route path="/create/music" element={
           <RequireAuth>
            <Layout>
              <CreateMusicPage />
            </Layout>
          </RequireAuth>
        } />
        <Route path="/create/video" element={
           <RequireAuth>
            <Layout>
              <RequireSubscription
                featureName="Create Video"
                description="Create stunning AI-powered music promo videos and cinematic music videos for your tracks."
              >
                <CreateVideoPage />
              </RequireSubscription>
            </Layout>
          </RequireAuth>
        } />

        {/* Motion Capture - Character/Motion Swap */}
        <Route path="/motion-capture" element={
          <RequireAuth>
            <Layout>
              <RequireSubscription
                featureName="Motion Capture"
                description="Create viral character swaps and motion control videos with cutting-edge AI."
              >
                <MotionCapturePage />
              </RequireSubscription>
            </Layout>
          </RequireAuth>
        } />

        {/* Create Voiceover - Text-to-Speech */}
        <Route path="/create/narrative" element={
          <RequireAuth>
            <Layout>
              <CreateNarrativePage />
            </Layout>
          </RequireAuth>
        } />

        {/* My Voiceovers - List user's voiceovers */}
        <Route path="/my-narratives" element={
          <RequireAuth>
            <Layout>
              <MyNarrativesPage />
            </Layout>
          </RequireAuth>
        } />

        {/* Upload page - protected route */}
        <Route path="/upload" element={
          <RequireAuth>
            <Layout>
              <UploadPage />
            </Layout>
          </RequireAuth>
        } />
        
        {/* Track detail page - protected route */}
        <Route path="/track/:songId" element={
          <RequireAuth>
            <TrackDetailPage />
          </RequireAuth>
        } />
        
        {/* Create video page (legacy) - protected route */}
        <Route path="/create-video/:songId" element={
           <RequireAuth>
            <Layout>
              <RequireSubscription
                featureName="Create Video"
                description="Create stunning AI-powered music promo videos and cinematic music videos for your tracks."
              >
                <CreateVideoPage />
              </RequireSubscription>
            </Layout>
           </RequireAuth>
        } />

        {/* Catch-all for niche landing pages - route to appropriate tab page */}
        <Route path="/ai-music/*" element={<AIMusicPage />} />
        <Route path="/ai-video-shorts/*" element={<AIVideoShortsPage />} />
        <Route path="/social-media/*" element={<SocialMediaPage />} />
        <Route path="/pricing/*" element={<PaymentPage />} />

        {/* Catch-all for any other niche routes - all go to HomePage with dynamic headers */}
        <Route path="*" element={<HomePage />} />
        </Routes>
        <GlobalAudioPlayer />
        </AuthInitializer>
      </Router>
    </AudioPlayerProvider>
  );
}

export default App;
