import React from "react";
import { Landmark } from "lucide-react";
import { copy } from "../../content/copy.id.js";

const SITE_NAME = copy.common.siteName;
const BRAND_SPLIT = "Dana".length;

interface BrandMarkProps {
  className?: string;
  /** Use light-on-dark colours for the footer. */
  inverse?: boolean;
}

/** Wordmark: "Dana" in deep green, "Terbuka" in the primary green. */
export function BrandMark({ className = "", inverse = false }: BrandMarkProps) {
  return (
    <span className={["inline-flex items-center gap-2", className].join(" ")}>
      <span
        aria-hidden="true"
        className={[
          "flex h-9 w-9 items-center justify-center rounded-xl",
          inverse
            ? "bg-brand-800 text-footer-subtle"
            : "bg-brand-50 text-brand-700",
        ].join(" ")}
      >
        <Landmark className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        <span className={inverse ? "text-footer-text" : "text-brand-900"}>
          {SITE_NAME.slice(0, BRAND_SPLIT)}
        </span>
        <span className={inverse ? "text-footer-subtle" : "text-brand-600"}>
          {SITE_NAME.slice(BRAND_SPLIT)}
        </span>
      </span>
    </span>
  );
}
