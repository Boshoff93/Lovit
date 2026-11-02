import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
  setConsent,
} from "firebase/analytics";

jest.mock("firebase/app", () => ({ initializeApp: () => ({}) }));
jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(() => ({})),
  setAnalyticsCollectionEnabled: jest.fn(),
  setConsent: jest.fn(),
}));

test("analytics starts only after consent and stops when consent is withdrawn", () => {
  (getAnalytics as jest.Mock).mockReturnValue({});
  const host = window as any;
  host.Cookiebot = {
    hasResponse: false,
    consent: { statistics: false, marketing: false },
  };
  const firebase = require("./firebase");
  expect(getAnalytics).not.toHaveBeenCalled();
  expect(firebase.analytics).toBeNull();
  host.Cookiebot = {
    hasResponse: true,
    consent: { statistics: true, marketing: false },
  };
  window.dispatchEvent(new Event("CookiebotOnConsentReady"));
  expect(getAnalytics).toHaveBeenCalledTimes(1);
  expect(setAnalyticsCollectionEnabled).toHaveBeenLastCalledWith(
    expect.anything(),
    true,
  );
  expect(setConsent).toHaveBeenLastCalledWith(
    expect.objectContaining({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    }),
  );
  host.Cookiebot.consent = { statistics: false, marketing: false };
  window.dispatchEvent(new Event("CookiebotOnDecline"));
  expect(setAnalyticsCollectionEnabled).toHaveBeenLastCalledWith(
    expect.anything(),
    false,
  );
  expect(firebase.analytics).toBeNull();
});
