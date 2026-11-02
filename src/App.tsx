import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import api from "./utils/axiosConfig";
import Layout from "./components/Layout";
import AuthInitializer from "./components/AuthInitializer";
import { SidebarProvider } from "./contexts/SidebarContext";
import HomePage from "./pages/HomePage";
import PaymentPage from "./pages/PaymentPage";
import DashboardSubscriptionPage from "./pages/DashboardSubscriptionPage";
import PublishingOverviewPage from "./pages/PublishingOverviewPage";
import MediaLibraryPage from "./pages/MediaLibraryPage";
import PostComposerPage from "./pages/PostComposerPage";
import PostStatusPage from "./pages/PostStatusPage";
import AgentAccessPage from "./pages/AgentAccessPage";
import AccountPage from "./pages/AccountPage";
import DistributionDocsPage from "./pages/docs/DistributionDocsPage";
import ScheduledContentPage from "./pages/ScheduledContentPage";
import ConnectedAccountsPage from "./pages/ConnectedAccountsPage";
import AnalyticsOverviewPage from "./pages/AnalyticsOverviewPage";
import TikTokAnalyticsPage from "./pages/TikTokAnalyticsPage";
import YouTubeAnalyticsPage from "./pages/YouTubeAnalyticsPage";
import UploadPage from "./pages/UploadPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResendVerificationPage from "./pages/ResendVerificationPage";
import PasswordResetRequestPage from "./pages/PasswordResetRequestPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SupportPage from "./pages/SupportPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import AdminEmailPage from "./pages/AdminEmailPage";
import YouTubeCallbackPage from "./pages/YouTubeCallbackPage";
import TikTokCallbackPage from "./pages/TikTokCallbackPage";
import InstagramCallbackPage from "./pages/InstagramCallbackPage";
import LinkedInCallbackPage from "./pages/LinkedInCallbackPage";
import TwitterCallbackPage from "./pages/TwitterCallbackPage";
import "./distribution.css";
import "./components/Workspace.css";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, user, isLoading } = useSelector((s: RootState) => s.auth);
  const location = useLocation();
  if (isLoading && !user)
    return <CircularProgress aria-label="Loading account" />;
  if (!token)
    return <Navigate to="/?signin=1" state={{ from: location }} replace />;
  if (user && !user.isVerified)
    return <Navigate to="/resend-verification" replace />;
  return <>{children}</>;
}
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    api
      .get("/api/validate-admin")
      .then((r) => {
        if (active) setAllowed(!!r.data.isAdmin);
      })
      .catch(() => {
        if (active) setAllowed(false);
      });
    return () => {
      active = false;
    };
  }, []);
  return allowed === null ? (
    <CircularProgress />
  ) : allowed ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
const workspace = (element: React.ReactNode) => (
  <RequireAuth>
    <Layout>{element}</Layout>
  </RequireAuth>
);
function LegacyVideo() {
  const location = useLocation();
  return (
    <Navigate
      to={`/posts/new?videoId=${encodeURIComponent(location.pathname.split("/").pop() || "")}`}
      replace
    />
  );
}
function LegacyPublishing() {
  const { hash } = useLocation();
  return <Navigate to={"/" + (hash || "#publishing")} replace />;
}
export default function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthInitializer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/social-media" element={<LegacyPublishing />} />
            <Route path="/publishing" element={<LegacyPublishing />} />
            <Route path="/pricing" element={<PaymentPage />} />
            {[
              "/docs",
              "/docs/getting-started",
              "/docs/agent-integration",
              "/docs/api-reference",
              "/docs/social",
            ].map((path) => (
              <Route
                key={path}
                path={path}
                element={<DistributionDocsPage />}
              />
            ))}
            <Route
              path="/dashboard"
              element={workspace(<PublishingOverviewPage />)}
            />
            <Route
              path="/posts/new"
              element={workspace(<PostComposerPage />)}
            />
            <Route
              path="/posts/status/:videoId"
              element={workspace(<PostStatusPage />)}
            />
            <Route path="/media" element={workspace(<MediaLibraryPage />)} />
            <Route path="/upload" element={workspace(<UploadPage />)} />
            <Route
              path="/settings/scheduled-content"
              element={workspace(<ScheduledContentPage />)}
            />
            <Route
              path="/settings/connected-accounts"
              element={workspace(<ConnectedAccountsPage />)}
            />
            <Route
              path="/analytics"
              element={workspace(<AnalyticsOverviewPage />)}
            />
            <Route
              path="/analytics/tiktok"
              element={workspace(<TikTokAnalyticsPage />)}
            />
            <Route
              path="/analytics/youtube"
              element={workspace(<YouTubeAnalyticsPage />)}
            />
            <Route path="/agents" element={workspace(<AgentAccessPage />)} />
            <Route path="/account" element={workspace(<AccountPage />)} />
            <Route
              path="/payment"
              element={workspace(<DashboardSubscriptionPage />)}
            />
            <Route
              path="/settings"
              element={<Navigate to="/account" replace />}
            />
            <Route path="/support" element={workspace(<SupportPage />)} />
            <Route
              path="/admin/email"
              element={
                <RequireAuth>
                  <RequireAdmin>
                    <Layout>
                      <AdminEmailPage />
                    </Layout>
                  </RequireAdmin>
                </RequireAuth>
              }
            />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route
              path="/resend-verification"
              element={<ResendVerificationPage />}
            />
            <Route
              path="/reset-password-request"
              element={<PasswordResetRequestPage />}
            />
            <Route path="/reset-password" element={<PasswordResetPage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/youtube/callback" element={<YouTubeCallbackPage />} />
            <Route path="/tiktok/callback" element={<TikTokCallbackPage />} />
            <Route
              path="/instagram/callback"
              element={<InstagramCallbackPage />}
            />
            <Route
              path="/linkedin/callback"
              element={<LinkedInCallbackPage />}
            />
            <Route path="/twitter/callback" element={<TwitterCallbackPage />} />
            {[
              "/my-videos",
              "/my-music",
              "/my-narratives",
              "/my-slideshows",
              "/my-library",
            ].map((path) => (
              <Route
                path={path}
                key={path}
                element={<Navigate to="/media" replace />}
              />
            ))}
            <Route path="/video/:videoId" element={<LegacyVideo />} />
            <Route path="/videos/:videoId" element={<LegacyVideo />} />
            {[
              "/create/*",
              "/create",
              "/create-video/*",
              "/motion-capture",
              "/ai-assets/*",
              "/characters/*",
              "/my-cast/*",
            ].map((path) => (
              <Route
                key={path}
                path={path}
                element={<Navigate to="/posts/new" replace />}
              />
            ))}
            {[
              "/ai-music/*",
              "/ai-music-videos/*",
              "/ai-video-shorts/*",
              "/genres/*",
              "/languages/*",
              "/moods/*",
              "/styles/*",
              "/blog/*",
              "/platforms/*",
            ].map((path) => (
              <Route
                key={path}
                path={path}
                element={<Navigate to="/#platforms" replace />}
              />
            ))}
            <Route
              path="/docs/*"
              element={<Navigate to="/docs/getting-started" replace />}
            />
            <Route
              path="/faq/*"
              element={<Navigate to="/docs/getting-started" replace />}
            />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AuthInitializer>
      </BrowserRouter>
    </SidebarProvider>
  );
}
