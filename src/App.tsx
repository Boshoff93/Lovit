import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<HomePage />} />
        
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
      </Routes>
    </Router>
  );
}

export default App;
