import { readCookieConsent } from "./privacyConsent";

test("optional measurement stays off without a recorded cookie response", () => {
  expect(readCookieConsent()).toEqual({ statistics: false, marketing: false });
  expect(
    readCookieConsent({
      hasResponse: false,
      consent: { statistics: true, marketing: true },
    }),
  ).toEqual({ statistics: false, marketing: false });
});
test("statistics and marketing are separate choices", () => {
  expect(
    readCookieConsent({
      hasResponse: true,
      consent: { statistics: true, marketing: false },
    }),
  ).toEqual({ statistics: true, marketing: false });
  expect(
    readCookieConsent({
      hasResponse: true,
      consent: { statistics: false, marketing: true },
    }),
  ).toEqual({ statistics: false, marketing: true });
  expect(
    readCookieConsent({
      hasResponse: true,
      consent: { statistics: false, marketing: false },
    }),
  ).toEqual({ statistics: false, marketing: false });
});
