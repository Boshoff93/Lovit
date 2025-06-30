import { logEvent, setUserProperties } from "firebase/analytics";
import { analytics } from "./firebase";

// Custom event names for customer journey tracking
export const ANALYTICS_EVENTS = {
  // Page Views
  HOME_PAGE_VIEW: 'home_page_view',
  PAYMENT_PAGE_VIEW: 'payment_page_view',
  
  // User Actions - Home Page
  SIGNUP_BUTTON_CLICK: 'signup_button_click',
  SIGNUP_CARDS_CLICK: 'signup_cards_click', 
  HERO_CTA_CLICK: 'hero_cta_click',
  PRICING_CTA_CLICK: 'pricing_cta_click',
  FINAL_CTA_CLICK: 'final_cta_click',
  
  // User Actions - Authentication
  SIGNUP_FORM_OPEN: 'signup_form_open',
  LOGIN_FORM_OPEN: 'login_form_open',
  GOOGLE_SIGNUP_START: 'google_signup_start',
  EMAIL_SIGNUP_START: 'email_signup_start',
  EMAIL_LOGIN_START: 'email_login_start',
  SIGNUP_SUCCESS: 'signup_success',
  LOGIN_SUCCESS: 'login_success',
  
  // User Actions - Payment Page
  PLAN_SELECTED: 'plan_selected',
  BILLING_CYCLE_CHANGED: 'billing_cycle_changed',
  CHECKOUT_STARTED: 'checkout_started',
  SUBSCRIPTION_MANAGEMENT_CLICK: 'subscription_management_click',
  
  // User Engagement
  GALLERY_IMAGE_CLICK: 'gallery_image_click',
  VIDEO_PLAY: 'video_play',
  FEATURE_VIEW: 'feature_view',
  TESTIMONIAL_VIEW: 'testimonial_view',
  
  // Navigation
  SECTION_SCROLL: 'section_scroll',
  FAQ_CLICK: 'faq_click',
  BRAND_CLICK: 'brand_click',
} as const;

// Helper function to log events safely
const logAnalyticsEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, {
        ...parameters,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {

    }
  }
};

// Set user properties
export const setAnalyticsUserProperties = (properties: Record<string, string>) => {
  if (analytics) {
    try {
      setUserProperties(analytics, properties);
    } catch (error) {

    }
  }
};

// PAGE VIEW TRACKING
export const trackHomePageView = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.HOME_PAGE_VIEW, {
    page_title: 'Home - Lovit AI Fashion Platform',
    page_location: window.location.href,
  });
};

export const trackPaymentPageView = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.PAYMENT_PAGE_VIEW, {
    page_title: 'Payment - Choose Your Plan',
    page_location: window.location.href,
  });
};

// SIGNUP/LOGIN TRACKING
export const trackSignupButtonClick = (location: string, button_text?: string) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.SIGNUP_BUTTON_CLICK, {
    click_location: location,
    button_text: button_text || 'Try it, Lovit!',
  });
};

export const trackSignupFormOpen = (tab: 'login' | 'signup') => {
  logAnalyticsEvent(ANALYTICS_EVENTS.SIGNUP_FORM_OPEN, {
    form_type: tab,
  });
};

export const trackSignupStart = (method: 'email' | 'google') => {
  const eventName = method === 'google' ? ANALYTICS_EVENTS.GOOGLE_SIGNUP_START : ANALYTICS_EVENTS.EMAIL_SIGNUP_START;
  logAnalyticsEvent(eventName, {
    signup_method: method,
  });
};

export const trackLoginStart = (method: 'email' | 'google') => {
  const eventName = method === 'google' ? ANALYTICS_EVENTS.GOOGLE_SIGNUP_START : ANALYTICS_EVENTS.EMAIL_LOGIN_START;
  logAnalyticsEvent(eventName, {
    login_method: method,
  });
};

export const trackSignupSuccess = (method: 'email' | 'google', user_id?: string) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.SIGNUP_SUCCESS, {
    signup_method: method,
    user_id: user_id,
  });
  
  // Set user properties
  if (user_id) {
    setAnalyticsUserProperties({
      user_id: user_id,
      signup_method: method,
      signup_date: new Date().toISOString(),
    });
  }
};

export const trackLoginSuccess = (method: 'email' | 'google', user_id?: string) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.LOGIN_SUCCESS, {
    login_method: method,
    user_id: user_id,
  });
};

// PAYMENT PAGE TRACKING
export const trackPlanSelected = (plan_id: string, plan_name: string, price: number, billing_cycle: 'monthly' | 'yearly') => {
  logAnalyticsEvent(ANALYTICS_EVENTS.PLAN_SELECTED, {
    plan_id,
    plan_name,
    price,
    billing_cycle,
    currency: 'USD',
  });
};

export const trackBillingCycleChanged = (new_cycle: 'monthly' | 'yearly', selected_plan?: string) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.BILLING_CYCLE_CHANGED, {
    billing_cycle: new_cycle,
    selected_plan,
  });
};

export const trackCheckoutStarted = (plan_id: string, plan_name: string, price: number, billing_cycle: 'monthly' | 'yearly') => {
  logAnalyticsEvent(ANALYTICS_EVENTS.CHECKOUT_STARTED, {
    plan_id,
    plan_name,
    price,
    billing_cycle,
    currency: 'USD',
    value: price,
  });
};

export const trackSubscriptionManagement = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.SUBSCRIPTION_MANAGEMENT_CLICK);
};

// USER ENGAGEMENT TRACKING
export const trackGalleryImageClick = (image_src: string, image_index: number) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.GALLERY_IMAGE_CLICK, {
    image_src,
    image_index,
  });
};

export const trackVideoPlay = (video_id: string, video_title?: string) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.VIDEO_PLAY, {
    video_id,
    video_title,
  });
};

export const trackFeatureView = (feature_title: string, feature_index: number) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.FEATURE_VIEW, {
    feature_title,
    feature_index,
  });
};

export const trackSectionScroll = (section_id: string) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.SECTION_SCROLL, {
    section_id,
  });
};

// CTA TRACKING
export const trackHeroCTAClick = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.HERO_CTA_CLICK, {
    button_text: 'Try it, Lovit!',
    location: 'hero_section',
  });
};

export const trackPricingCTAClick = (plan_id?: string) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.PRICING_CTA_CLICK, {
    button_text: 'Try it, Lovit!',
    location: 'pricing_section',
    selected_plan: plan_id,
  });
};

export const trackFinalCTAClick = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.FINAL_CTA_CLICK, {
    button_text: 'Try it, Lovit!',
    location: 'final_cta',
  });
};

export const trackSignupCardsClick = (plan_id: string) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.SIGNUP_CARDS_CLICK, {
    plan_id,
    location: 'pricing_cards',
  });
};

// NAVIGATION TRACKING
export const trackFAQClick = () => {
  logAnalyticsEvent(ANALYTICS_EVENTS.FAQ_CLICK);
};

export const trackBrandClick = (brand_name: string) => {
  logAnalyticsEvent(ANALYTICS_EVENTS.BRAND_CLICK, {
    brand_name,
  });
};

// FUNNEL ANALYSIS HELPERS
export const getFunnelStep = (step: string, additional_data?: Record<string, any>) => {
  logAnalyticsEvent('funnel_step', {
    step_name: step,
    step_timestamp: Date.now(),
    ...additional_data,
  });
};

// Customer Journey Milestones
export const trackCustomerJourneyMilestone = (milestone: string, user_data?: Record<string, any>) => {
  logAnalyticsEvent('customer_journey_milestone', {
    milestone,
    ...user_data,
  });
};

// SECTION-SPECIFIC TRACKING
export const trackSectionEngagement = (section: string, engagement_type: string, additional_data?: Record<string, any>) => {
  logAnalyticsEvent('section_engagement', {
    section,
    engagement_type,
    ...additional_data,
  });
};

// FAQ and Navigation tracking
export const trackFAQPageVisit = () => {
  logAnalyticsEvent('faq_page_visit', {
    page_title: 'FAQ - Lovit AI Fashion Platform',
    page_location: window.location.href,
  });
};

// Conversion funnel tracking with completion rates
export const trackFunnelConversion = (from_step: string, to_step: string, user_id?: string) => {
  logAnalyticsEvent('funnel_conversion', {
    from_step,
    to_step,
    user_id,
    conversion_timestamp: Date.now(),
  });
};

// Track when users exit without converting
export const trackExitIntent = (last_section: string, time_on_page: number) => {
  logAnalyticsEvent('exit_intent', {
    last_section,
    time_on_page_seconds: Math.floor(time_on_page / 1000),
  });
};

// Track scroll depth to measure engagement
export const trackScrollDepth = (percentage: number, section?: string) => {
  logAnalyticsEvent('scroll_depth', {
    scroll_percentage: percentage,
    current_section: section,
  });
}; 