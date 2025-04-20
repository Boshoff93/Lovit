import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Layout
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import AppPage from './pages/AppPage';
import AccountPage from './pages/AccountPage';
import PaymentPage from './pages/PaymentPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResendVerificationPage from './pages/ResendVerificationPage';

// Route guard to check premium membership
const RequirePremium = ({ children }: { children: React.ReactNode }) => {
  const isPremiumMember = localStorage.getItem('isPremiumMember') === 'true';
  const location = useLocation();

  if (!isPremiumMember) {
    // Redirect to payment page if not a premium member
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
          <RequirePremium>
            <Layout>
              <AppPage />
            </Layout>
          </RequirePremium>
        } />
        
        {/* Account page - protected route */}
        <Route path="/account" element={
          <RequirePremium>
            <Layout>
              <AccountPage />
            </Layout>
          </RequirePremium>
        } />
        
        {/* Gallery page - protected route */}
        <Route path="/gallery" element={
          <RequirePremium>
            <Layout>
              <AppPage />
            </Layout>
          </RequirePremium>
        } />
        
        {/* Models page - protected route */}
        <Route path="/models" element={
          <RequirePremium>
            <Layout>
              <AppPage />
            </Layout>
          </RequirePremium>
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
