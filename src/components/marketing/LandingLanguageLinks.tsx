import React from "react";
import locales from "../../config/landingLocales.json";
import { landingLocales, LandingLocale } from "../../config/landingLocales";
import "./LocalizedLanding.css";

export default function LandingLanguageLinks({
  current = "en",
  label = "Language",
}: {
  current?: LandingLocale;
  label?: string;
}) {
  return (
    <nav id="landing-languages" className="gm-language-links" aria-label={label}>
      {landingLocales.map((locale) => (
        <a key={locale} href={locales[locale].path} hrefLang={locale}
          lang={locale} aria-current={current === locale ? "page" : undefined}>
          {locales[locale].name}
        </a>
      ))}
    </nav>
  );
}
