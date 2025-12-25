import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { useAuth } from './hooks/useAuth';
import api from './utils/axiosConfig';

// Layout
import Layout from './components/Layout';

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
import FAQQuestionPage from './pages/FAQQuestionPage';
import AdminEmailPage from './pages/AdminEmailPage';
import UnsubscribePage from './pages/UnsubscribePage';
import GenreDetailPage from './pages/GenreDetailPage';
import LanguageDetailPage from './pages/LanguageDetailPage';
import StyleDetailPage from './pages/StyleDetailPage';
import MusicVideoDetailPage from './pages/MusicVideoDetailPage';
import CreateVideoPage from './pages/CreateVideoPage';
import CreatePage from './pages/CreatePage';
import MusicVideoPlayer from './pages/MusicVideoPlayer';

// Route config
import { getAllRoutePaths } from './config/routeConfig';

// Route guard to check authentication and premium membership
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { token, user, subscription} = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isPremiumMember = subscription?.tier && subscription.tier !== 'free'
  
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const redirectVerified = searchParams.get('verified') === 'true';

  // Check if user is verified
  if (user && !user.isVerified && !redirectVerified) {
    return <Navigate to="/resend-verification" state={{ from: location }} replace />;
  }

  // Check for subscription in URL params (user just subscribed)
  const hasNewSubscription = searchParams.get('subscription') === 'true';
  
  // Use isPremiumMember instead of checking subscription tier
  // Allow user through if they have just successfully subscribed
  if (!isPremiumMember && !hasNewSubscription) {
    return <Navigate to="/payment" state={{ from: location }} replace />;
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/" state={{ from: location, error }} replace />;
  }

  return <>{children}</>;
};

// Get all SEO routes from config
const seoRoutes = getAllRoutePaths().filter(path => path !== '/');

function App() {
  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dynamic SEO routes - all render HomePage with different SEO meta */}
        {seoRoutes.map((path) => (
          <Route key={path} path={path} element={<HomePage />} />
        ))}
        
        {/* Unsubscribe page */}
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        
        {/* Admin email management - protected admin route */}
        <Route path="/admin/email" element={
          <RequireAdmin>
            <Layout>
              <AdminEmailPage />
            </Layout>
          </RequireAdmin>
        } />
        
        {/* Payment page */}
        <Route path="/payment" element={<PaymentPage />} />
        
        {/* App dashboard with layout and tabs - protected route */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <Layout>
              <AppPage />
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
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/faq/:question" element={<FAQQuestionPage />} />
        
        {/* Detail pages */}
        <Route path="/genres/:genreId" element={<GenreDetailPage />} />
        <Route path="/languages/:languageId" element={<LanguageDetailPage />} />
        <Route path="/styles/:styleId" element={<StyleDetailPage />} />
        <Route path="/videos/:videoId" element={<MusicVideoDetailPage />} />
        
        {/* Create page - protected route */}
        <Route path="/create" element={
           <RequireAuth>
            <Layout>
              <CreatePage />
            </Layout>
          </RequireAuth>
        } />
        
        {/* Create video page (legacy) - protected route */}
        <Route path="/create-video/:songId" element={
           <RequireAuth>
            <Layout>
              <CreateVideoPage />
            </Layout>
           </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;
