import React from "react";
import { AlertTriangle } from "lucide-react";
import { copy } from "../../content/copy.id.js";

interface FixtureBadgeProps {
  visible: boolean;
}

export function FixtureBadge({ visible }: FixtureBadgeProps) {
  if (!visible) return null;
  return (
    <span
      data-testid="fixture-badge"
      className={[
        "inline-flex items-center gap-1.5 rounded-full border border-warning-200 bg-warning-50 px-3 py-1",
        "text-sm font-semibold text-warning",
      ].join(" ")}
      aria-label={copy.dashboard.fixtureNotice}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {copy.dashboard.fixtureBadge}
    </span>
  );
}
