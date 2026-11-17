import React from "react";
import { Link } from "react-router-dom";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import CookiePreferencesButton from "../components/CookiePreferencesButton";
import LandingLanguageLinks from "../components/marketing/LandingLanguageLinks";
import { PlatformGrid, SectionHeading, SocialOrbit } from "../components/marketing/DistributionShowcase";
import locales from "../config/landingLocales.json";
import { landingAlternateLinks, siteOrigin, TranslatedLandingLocale } from "../config/landingLocales";
import { publishingPlans } from "../config/publishing";
import translations from "../content/localizedHome.json";
import { SEO } from "../utils/seoHelper";
import "../distribution.css";
import "../public-content.css";
import "../components/marketing/DistributionMarketing.css";

const stepIcons = [VideoLibraryOutlinedIcon, CalendarMonthRoundedIcon, PublishRoundedIcon];
const guideLinks = [
  "/blog/bulk-video-scheduling",
  "/blog/instagram-tiktok-carousel-posts",
  "/blog/social-media-analytics-api",
];

export default function LocalizedHomePage({ locale }: { locale: TranslatedLandingLocale }) {
  const { path, ogLocale } = locales[locale];
  const { title, description, nav, hero, channels, workflow, integration, features, plans, faq, footer } = translations[locale];
  const canonical = siteOrigin + path;
  const isRtl = locale === "ar";
  const money = new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat(locale);

  return (
    <div className="gd gm gm-localized" dir={isRtl ? "rtl" : undefined}>
      <SEO
        title={title}
        description={description}
        canonicalUrl={canonical}
        language={locale}
        ogLocale={ogLocale}
        ogImageAlt={hero.orbit.label}
        alternateLanguages={landingAlternateLinks}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          description,
          url: canonical,
          inLanguage: locale,
          isPartOf: { "@type": "WebSite", "@id": siteOrigin + "/#website", name: "Gruvi", url: siteOrigin + "/" },
        }}
      />
      <header className="gm-local-header">
        <div className="gm-container gm-local-header-inner">
          <Link className="gd-logo" to={path}>
            <img src="/gruvi.png" alt="" width="32" height="32" />
            <span>Gruvi</span>
          </Link>
          <nav aria-label={nav.menu}>
            <a href="#platforms">{nav.platforms}</a>
            <Link to="/docs">{nav.docs}</Link>
            <a href="#pricing">{nav.pricing}</a>
            <a href="#landing-languages">{nav.language}</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="gm-hero">
          <div className="gm-container gm-hero-grid">
            <div className="gm-hero-copy">
              <p className="gm-eyebrow">{hero.eyebrow}</p>
              <h1>{hero.title} <span className="gm-gradient-text">{hero.accent}</span></h1>
              <p className="gm-hero-description">{hero.body}</p>
              <div className="gm-actions">
                <Link className="gm-button" to="/?signin=1">{nav.start}<ArrowForwardRoundedIcon className="gm-local-forward" /></Link>
                <Link className="gm-button gm-button-secondary" to="/docs/agent-integration">{nav.docs}<CodeRoundedIcon /></Link>
              </div>
            </div>
            <SocialOrbit {...hero.orbit} />
          </div>
        </section>

        <section className="gm-platform-section" id="platforms">
          <div className="gm-container gm-section">
            <SectionHeading title={channels.title}>{channels.body}</SectionHeading>
            <PlatformGrid details={channels.details} />
            <p className="gm-section-note">{channels.note} <Link to="/docs/social">{channels.link}</Link></p>
          </div>
        </section>

        <section className="gm-container gm-section gm-process-section" id="how-it-works">
          <SectionHeading title={workflow.title} />
          <ol className="gm-process">
            {workflow.steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <li key={step.title}>
                  <span className="gm-process-icon"><Icon /></span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="gr-home-developers" id="api">
          <div className="gm-container">
            <div className="gr-home-dev-intro">
              <div>
                <h2>{integration.title}</h2>
                <p>{integration.body}</p>
              </div>
              <Link className="gm-button gm-button-secondary" to="/api">{integration.api}<CodeRoundedIcon /></Link>
            </div>
            <div className="gr-home-feature-links">
              {features.map((feature, index) => (
                <article className="gr-card" key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                  <Link className="gr-card-link" to={guideLinks[index]}>
                    {feature.link} <span aria-hidden="true">{isRtl ? "←" : "→"}</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="gm-section gm-pricing-section" id="pricing">
          <div className="gm-container">
            <SectionHeading title={plans.title}>{plans.body}</SectionHeading>
            <ul className="gm-local-plans">
              {publishingPlans.map((plan) => (
                <li className="gr-card" key={plan.id}>
                  <h3>{plan.name}</h3>
                  <p className="gm-local-price"><strong>{money.format(plan.price)}</strong> <span>{plans.monthly}</span></p>
                  <p>{plans.posts.replace("{count}", number.format(plan.posts))}</p>
                </li>
              ))}
            </ul>
            <div className="gm-local-plan-action"><Link className="gm-button gm-button-secondary" to="/pricing">{plans.action}<ArrowForwardRoundedIcon className="gm-local-forward" /></Link></div>
          </div>
        </section>

        <section className="gm-section gm-faq-section" id="faq">
          <div className="gm-container gm-faq-grid">
            <SectionHeading title={faq.title} />
            <div className="gm-faq-list">
              {faq.items.map(({ question, answer }) => (
                <details key={question}>
                  <summary>{question}<span aria-hidden="true">+</span></summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="gd-footer gd-container">
        <Link className="gd-logo" to={path}><img src="/gruvi.png" alt="" width="32" height="32" /><span>Gruvi</span></Link>
        <nav aria-label={footer.navigation}>
          <Link to="/api">API</Link>
          <Link to="/docs">{nav.docs}</Link>
          <Link to="/blog">{footer.blog}</Link>
          <Link to="/pricing">{nav.pricing}</Link>
          <Link to="/terms">{footer.terms}</Link>
          <Link to="/privacy">{footer.privacy}</Link>
          <CookiePreferencesButton className="gd-footer-cookie-preferences" label={footer.cookies} unavailableMessage={footer.cookieError} />
        </nav>
      </footer>
      <LandingLanguageLinks current={locale} label={nav.language} />
    </div>
  );
}
