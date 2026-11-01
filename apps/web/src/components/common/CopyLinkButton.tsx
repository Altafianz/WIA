import React, { useState } from "react";
import { copy } from "../../content/copy.id.js";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Clipboard API may be unavailable; silently ignore
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        className={[
          "text-sm px-3 py-1.5 rounded-md border transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          copied
            ? "border-success text-success bg-surface"
            : "border-border text-text-muted hover:text-text bg-surface",
        ].join(" ")}
        aria-label={copy.dashboard.copyLink}
      >
        {copied ? "✓" : "🔗"} {copy.dashboard.copyLink}
      </button>
      {/* aria-live region for accessibility announcement */}
      <span aria-live="polite" className="sr-only">
        {copied ? copy.dashboard.copyLinkSuccess : ""}
      </span>
    </div>
  );
}
