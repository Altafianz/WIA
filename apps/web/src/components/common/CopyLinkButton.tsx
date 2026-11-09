import React, { useState } from "react";
import { Check, Link2 } from "lucide-react";
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
          "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
          "transition-colors duration-150 ease-out",
          copied
            ? "border-brand-600 bg-brand-50 text-brand-800"
            : "border-border bg-card text-text hover:border-border-strong hover:bg-surface",
        ].join(" ")}
        aria-label={copy.dashboard.copyLink}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4" aria-hidden="true" />
        )}
        {copy.dashboard.copyLink}
      </button>
      {/* aria-live region for accessibility announcement */}
      <span aria-live="polite" className="sr-only">
        {copied ? copy.dashboard.copyLinkSuccess : ""}
      </span>
    </div>
  );
}
