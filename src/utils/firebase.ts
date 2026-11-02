// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAnalytics,
  Analytics,
  setAnalyticsCollectionEnabled,
  setConsent,
} from "firebase/analytics";
import { getCookieConsent } from "./privacyConsent";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnGJh3n-wQysaf5ARVq7t1nAQKxC2oGkM",
  authDomain: "lovit-c8d66.firebaseapp.com",
  projectId: "lovit-c8d66",
  storageBucket: "lovit-c8d66.firebasestorage.app",
  messagingSenderId: "218606485885",
  appId: "1:218606485885:web:463b2d5bdf3f3d30c0cc14",
  measurementId: "G-S4M0PM3S4W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase authentication remains available independently of optional analytics.
let analytics: Analytics | null = null;
let analyticsInstance: Analytics | null = null;
function syncAnalyticsConsent() {
  const consent = getCookieConsent();
  const settings = {
    analytics_storage: consent.statistics
      ? ("granted" as const)
      : ("denied" as const),
    ad_storage: consent.marketing ? ("granted" as const) : ("denied" as const),
    ad_user_data: consent.marketing
      ? ("granted" as const)
      : ("denied" as const),
    ad_personalization: consent.marketing
      ? ("granted" as const)
      : ("denied" as const),
  };
  if (!consent.statistics) {
    if (analyticsInstance) {
      setConsent(settings);
      setAnalyticsCollectionEnabled(analyticsInstance, false);
    }
    analytics = null;
    return;
  }
  try {
    if (!analyticsInstance) {
      // Set consent before the analytics tag can load its automatic events.
      const host = window as unknown as {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
      };
      host.dataLayer = host.dataLayer || [];
      host.gtag =
        host.gtag ||
        ((...args: unknown[]) => {
          host.dataLayer!.push(args);
        });
      host.gtag("consent", "default", settings);
      analyticsInstance = getAnalytics(app);
    }
    setConsent(settings);
    setAnalyticsCollectionEnabled(analyticsInstance, true);
    analytics = analyticsInstance;
  } catch {
    analytics = null;
  }
}
if (typeof window !== "undefined") {
  for (const event of [
    "CookiebotOnConsentReady",
    "CookiebotOnAccept",
    "CookiebotOnDecline",
  ])
    window.addEventListener(event, syncAnalyticsConsent);
  syncAnalyticsConsent();
}

export { analytics };
export default app;
