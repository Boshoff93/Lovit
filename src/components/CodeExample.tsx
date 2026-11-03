import React, { useEffect, useState } from "react";
export default function CodeExample({
  code,
  label = "Example request",
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setCopied(false);
    setFailed(false);
  }, [code]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  };
  return (
    <div className="gr-code">
      <div className="gr-code-header">
        <span>{label}</span>
        <button className="gr-copy" type="button" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      <span className="gr-sr-only" role="status">
        {copied
          ? "Code copied to clipboard."
          : failed
            ? "Copy unavailable. Select the code to copy it."
            : ""}
      </span>
    </div>
  );
}
