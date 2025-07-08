import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { useAuth } from './hooks/useAuth';

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
import TransformFashionExperience from './pages/blog/transform-fashion-experience';
import AdminEmailPage from './pages/AdminEmailPage';
import UnsubscribePage from './pages/UnsubscribePage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.trylovit.com';

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
        const response = await fetch(`${API_BASE_URL}/api/validate-admin`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok || !data.isAdmin) {
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Dynamic fashion routes */}
        <Route path="/try-on-fashion-for-plus-size-figures" element={<HomePage />} />
        <Route path="/bachelorette-party-outfits" element={<HomePage />} />
        <Route path="/wedding-dress-virtual-try-on" element={<HomePage />} />
        <Route path="/weekend-going-out-outfits" element={<HomePage />} />
        <Route path="/shopping-outfit-ideas" element={<HomePage />} />
        <Route path="/halloween-costume-virtual-try-on" element={<HomePage />} />
        <Route path="/formal-event-outfits" element={<HomePage />} />
        <Route path="/christmas-party-outfits" element={<HomePage />} />
        <Route path="/summer-fashion-try-on" element={<HomePage />} />
        <Route path="/winter-fashion-virtual-try-on" element={<HomePage />} />
        <Route path="/fall-fashion-try-on" element={<HomePage />} />
        <Route path="/spring-fashion-virtual-try-on" element={<HomePage />} />
        <Route path="/fashion-trends-virtual-try-on" element={<HomePage />} />
        <Route path="/social-media-fashion-content" element={<HomePage />} />
        <Route path="/professional-headshots-virtual-try-on" element={<HomePage />} />
        <Route path="/streetwear-virtual-try-on" element={<HomePage />} />
        <Route path="/cute-dresses-virtual-try-on" element={<HomePage />} />
        <Route path="/budget-shopping-virtual-try-on" element={<HomePage />} />
        <Route path="/future-of-online-shopping" element={<HomePage />} />
        <Route path="/workout-clothes-virtual-try-on" element={<HomePage />} />
        <Route path="/business-casual-virtual-try-on" element={<HomePage />} />
        <Route path="/date-night-outfits" element={<HomePage />} />
        <Route path="/travel-outfits-virtual-try-on" element={<HomePage />} />
        <Route path="/beach-vacation-outfits" element={<HomePage />} />
        <Route path="/cozy-loungewear-virtual-try-on" element={<HomePage />} />
        <Route path="/instagram-fashion-content" element={<HomePage />} />
        <Route path="/facebook-fashion-content" element={<HomePage />} />
        <Route path="/tiktok-fashion-content" element={<HomePage />} />
        <Route path="/youtube-fashion-content" element={<HomePage />} />
        
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

        {/* Blog routes */}
        <Route path="/blog/transform-fashion-experience" element={<TransformFashionExperience />} />
      </Routes>
    </Router>
  );
}

export default App;
