import React from "react";
import MarketingHeader from "./marketing/MarketingHeader";
import DistributionFooter from "./DistributionFooter";
import "../distribution.css";
import "../public-content.css";
export default function PublicPage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`gd gr-public ${className}`}>
      <MarketingHeader />
      {children}
      <DistributionFooter />
    </div>
  );
}
