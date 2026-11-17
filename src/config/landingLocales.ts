import locales from "./landingLocales.json";

export const siteOrigin = "https://agentgruvi.com";
export type LandingLocale = keyof typeof locales;
export type TranslatedLandingLocale = Exclude<LandingLocale, "en">;

export const landingLocales = Object.keys(locales) as LandingLocale[];
export const translatedLandingLocales = landingLocales.filter(
  (locale): locale is TranslatedLandingLocale => locale !== "en",
);

export const landingAlternateLinks = [
  ...landingLocales.map((locale) => ({
    language: locale,
    href: siteOrigin + locales[locale].path,
  })),
  { language: "x-default", href: siteOrigin + locales.en.path },
];
