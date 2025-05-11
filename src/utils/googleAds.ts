interface ConversionEvent {
  sendTo: string;
  url?: string;
}

// Conversion event IDs
export const CONVERSION_EVENTS = {
  SUBSCRIBE_STARTER_MONTHLY: 'AW-17071071515/KQeACKKy08UaEJvCj8w_',
  SUBSCRIBE_STARTER_YEARLY: 'AW-17071071515/jU9TCKWy08UaEJvCj8w_',
  SUBSCRIBE_PRO_MONTHLY: 'AW-17071071515/LQr5CKiy08UaEJvCj8w_',
  SUBSCRIBE_PRO_YEARLY: 'AW-17071071515/Vr4dCKuy08UaEJvCj8w_',
  SUBSCRIBE_PREMIUM_MONTHLY: 'AW-17071071515/1WeuCIDM08UaEJvCj8w_',
  SUBSCRIBE_PREMIUM_YEARLY: 'AW-17071071515/E758CIPM08UaEJvCj8w_',
  SIGN_UP_BUTTON_CLICK: 'AW-17071071515/Xb-mCLj31sUaEJvCj8w_',
  SIGN_UP_SUBMIT: 'AW-17071071515/CGPLCLv31sUaEJvCj8w_',
  SIGN_UP_CARDS_CLICK: 'AW-17071071515/g5ROCL731sUaEJvCj8w_',
} as const;

/**
 * Reports a conversion event to Google Ads
 * @param event - The conversion event to report
 * @returns Promise that resolves when the conversion is reported
 */
export const reportConversion = (event: ConversionEvent): Promise<void> => {
  return new Promise((resolve) => {
    const callback = () => {
      if (event.url) {
        window.location.href = event.url;
      }
      resolve();
    };

    // Check if gtag is available
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': event.sendTo,
        'event_callback': callback
      });
    } else {
      console.warn('Google Analytics gtag not found');
      callback();
    }
  });
};

/**
 * Reports a subscribe starter monthly conversion
 * @param url - Optional URL to redirect to after conversion
 */
export const reportSubscribeStarterMonthlyConversion = (url?: string): Promise<void> => {
  return reportConversion({
    sendTo: CONVERSION_EVENTS.SUBSCRIBE_STARTER_MONTHLY,
    url
  });
};

/**
 * Reports a subscribe starter yearly conversion
 * @param url - Optional URL to redirect to after conversion
 */
export const reportSubscribeStarterYearlyConversion = (url?: string): Promise<void> => {
  return reportConversion({
    sendTo: CONVERSION_EVENTS.SUBSCRIBE_STARTER_YEARLY,
    url
  });
};

/**
 * Reports a subscribe pro monthly conversion
 * @param url - Optional URL to redirect to after conversion
 */
export const reportSubscribeProMonthlyConversion = (url?: string): Promise<void> => {
  return reportConversion({
    sendTo: CONVERSION_EVENTS.SUBSCRIBE_PRO_MONTHLY,
    url
  });
};

/**
 * Reports a subscribe pro yearly conversion
 * @param url - Optional URL to redirect to after conversion
 */
export const reportSubscribeProYearlyConversion = (url?: string): Promise<void> => {
  return reportConversion({
    sendTo: CONVERSION_EVENTS.SUBSCRIBE_PRO_YEARLY,
    url
  });
};

/**
 * Reports a subscribe premium monthly conversion
 * @param url - Optional URL to redirect to after conversion
 */
export const reportSubscribePremiumMonthlyConversion = (url?: string): Promise<void> => {
  return reportConversion({
    sendTo: CONVERSION_EVENTS.SUBSCRIBE_PREMIUM_MONTHLY,
    url
  });
};

/**
 * Reports a subscribe premium yearly conversion
 * @param url - Optional URL to redirect to after conversion
 */
export const reportSubscribePremiumYearlyConversion = (url?: string): Promise<void> => {
  return reportConversion({
    sendTo: CONVERSION_EVENTS.SUBSCRIBE_PREMIUM_YEARLY,
    url
  });
};

/**
 * Reports a sign up button click conversion
 * @param url - Optional URL to redirect to after conversion
 */
export const reportSignUpButtonClickConversion = (url?: string): Promise<void> => {
  return reportConversion({
    sendTo: CONVERSION_EVENTS.SIGN_UP_BUTTON_CLICK,
    url
  });
};

/**
 * Reports a sign up form submission conversion
 * @param url - Optional URL to redirect to after conversion
 */
export const reportSignUpSubmitConversion = (url?: string): Promise<void> => {
  return reportConversion({
    sendTo: CONVERSION_EVENTS.SIGN_UP_SUBMIT,
    url
  });
};

/**
 * Reports a sign up cards click conversion
 * @param url - Optional URL to redirect to after conversion
 */
export const reportSignUpCardsClickConversion = (url?: string): Promise<void> => {
  return reportConversion({
    sendTo: CONVERSION_EVENTS.SIGN_UP_CARDS_CLICK,
    url
  });
};

// Add TypeScript declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params: {
        send_to: string;
        event_callback?: () => void;
      }
    ) => void;
  }
} 