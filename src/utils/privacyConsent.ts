export interface CookiebotState {
  hasResponse?: boolean;
  consent?: { statistics?: boolean; marketing?: boolean };
  renew?: () => void;
}

function cookieManager(): CookiebotState | undefined {
  return typeof window === "undefined"
    ? undefined
    : (window as unknown as { Cookiebot?: CookiebotState }).Cookiebot;
}

export function readCookieConsent(manager?: CookiebotState) {
  return {
    statistics:
      manager?.hasResponse === true && manager.consent?.statistics === true,
    marketing:
      manager?.hasResponse === true && manager.consent?.marketing === true,
  };
}

export function getCookieConsent() {
  return readCookieConsent(cookieManager());
}

export function openCookiePreferences(): boolean {
  const manager = cookieManager();
  if (typeof manager?.renew !== "function") return false;
  try {
    manager.renew();
    return true;
  } catch {
    return false;
  }
}
