import React, { useState } from "react";
import { openCookiePreferences } from "../utils/privacyConsent";

export default function CookiePreferencesButton({
  className = "gm-legal-link",
}: {
  className?: string;
}) {
  const [unavailable, setUnavailable] = useState(false);
  return (
    <span className="gd-cookie-preferences">
      <button
        type="button"
        className={className}
        onClick={() => setUnavailable(!openCookiePreferences())}
      >
        Cookie preferences
      </button>
      {unavailable && (
        <span className="gm-cookie-message" role="status">
          Cookie settings are unavailable in this browser. Use your browser's
          cookie controls or contact admin@wbtechventures.com.
        </span>
      )}
    </span>
  );
}
