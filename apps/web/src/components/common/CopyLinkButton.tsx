import React, { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
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

  const Icon = copied ? Check : LinkIcon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        className={[
          "inline-flex h-12 items-center gap-2 rounded-full border px-4 text-base font-semibold transition-colors duration-150",
          copied
            ? "border-success-200 bg-success-50 text-success"
            : "border-border bg-card text-text-muted hover:border-border-strong hover:text-text",
        ].join(" ")}
        aria-label={copy.dashboard.copyLink}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {copy.dashboard.copyLink}
      </button>
      {/* aria-live region for accessibility announcement */}
      <span aria-live="polite" className="sr-only">
        {copied ? copy.dashboard.copyLinkSuccess : ""}
      </span>
    </div>
  );
}
