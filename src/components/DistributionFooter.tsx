import React from "react";
import { Link } from "react-router-dom";
import CookiePreferencesButton from "./CookiePreferencesButton";
export default function DistributionFooter() {
  return (
    <footer className="gd-footer gd-container">
      <div>
        <Link className="gd-logo" to="/">
          <img src="/gruvi.png" alt="" width="32" height="32" />
          <span>Gruvi</span>
        </Link>
        <p>Content distribution for agents.</p>
      </div>
      <nav aria-label="Footer">
        <Link to="/docs">Documentation</Link>
        <a href="/llms.txt">Agent discovery</a>
        <Link to="/pricing">Pricing</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <CookiePreferencesButton className="gd-footer-cookie-preferences" />
      </nav>
      <div className="gd-footer-bottom">
        © {new Date().getFullYear()} Gruvi · WB Tech Ventures LLC
      </div>
    </footer>
  );
}
