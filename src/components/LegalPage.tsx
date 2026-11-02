import React from "react";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import MarketingHeader from "./marketing/MarketingHeader";
import DistributionFooter from "./DistributionFooter";
import { SEO } from "../utils/seoHelper";
import "../distribution.css";
import "./legal.css";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}
export const LEGAL_UPDATED_DATE = "2026-11-01";

export default function LegalPage({
  title,
  path,
  description,
  intro,
  sections,
  related,
}: {
  title: string;
  path: string;
  description: string;
  intro: React.ReactNode;
  sections: LegalSection[];
  related: { path: string; title: string };
}) {
  const wide = useMediaQuery("(min-width: 900px)");
  const url = "https://agentgruvi.com" + path;
  return (
    <div className="gd gm-legal-page">
      <SEO
        title={`${title} | Gruvi`}
        description={description}
        canonicalUrl={url}
        ogUrl={url}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${title} | Gruvi`,
          url,
          description,
          dateModified: LEGAL_UPDATED_DATE,
          publisher: {
            "@type": "Organization",
            name: "WB Tech Ventures LLC",
            url: "https://wbtechventures.com",
          },
        }}
      />
      <MarketingHeader />
      <main className="gd-container gm-legal-layout">
        <header className="gm-legal-intro">
          <p className="gm-legal-eyebrow">Gruvi · Legal</p>
          <h1>{title}</h1>
          <p className="gm-legal-date">
            Last updated:{" "}
            <time dateTime={LEGAL_UPDATED_DATE}>November 1, 2026</time>
          </p>
          <div className="gm-legal-summary">{intro}</div>
        </header>
        <aside className="gm-legal-sidebar">
          <details open={wide}>
            <summary>On this page</summary>
            <nav aria-label={`${title} contents`}>
              {sections.map((section, index) => (
                <a href={`#${section.id}`} key={section.id}>
                  {index + 1}. {section.title}
                </a>
              ))}
            </nav>
          </details>
        </aside>
        <article className="gm-legal-body">
          {sections.map((section, index) => (
            <section
              id={section.id}
              key={section.id}
              aria-labelledby={`${section.id}-heading`}
            >
              <h2 id={`${section.id}-heading`}>
                {index + 1}. {section.title}
              </h2>
              {section.content}
            </section>
          ))}
          <div className="gm-legal-related">
            Also read our <Link to={related.path}>{related.title}</Link>.
          </div>
        </article>
      </main>
      <DistributionFooter />
    </div>
  );
}
