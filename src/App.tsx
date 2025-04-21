import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

// Layout
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import AppPage from './pages/AppPage';
import AccountPage from './pages/AccountPage';
import PaymentPage from './pages/PaymentPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResendVerificationPage from './pages/ResendVerificationPage';

// Route guard to check authentication and premium membership
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { token, isPremiumMember, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user is verified (using status from token/auth state)
  if (user && !user.isVerified) {
    return <Navigate to="/resend-verification" state={{ from: location }} replace />;
  }

  // Check if user is a premium member
  if (!isPremiumMember) {
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
      </Routes>
    </Router>
  );
}

export default App;
