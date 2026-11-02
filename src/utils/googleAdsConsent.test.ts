import {
  reportConversion,
  reportPageViewConversion,
  reportPurchaseConversion,
} from "./googleAds";

test("declining marketing skips conversion reporting without blocking the caller", async () => {
  const host = window as any;
  host.Cookiebot = {
    hasResponse: true,
    consent: { statistics: true, marketing: false },
  };
  host.gtag = jest.fn();
  await reportConversion({ sendTo: "test-conversion" });
  await reportPurchaseConversion();
  await reportPageViewConversion();
  expect(host.gtag).not.toHaveBeenCalled();
});

test("conversion reporting can run after marketing consent", async () => {
  const host = window as any;
  host.Cookiebot = {
    hasResponse: true,
    consent: { statistics: true, marketing: true },
  };
  host.gtag = jest.fn((_command: string, _event: string, params: any) =>
    params?.event_callback?.(),
  );
  await reportConversion({ sendTo: "test-conversion" });
  expect(host.gtag).toHaveBeenCalledWith(
    "event",
    "conversion",
    expect.objectContaining({ send_to: "test-conversion" }),
  );
});
