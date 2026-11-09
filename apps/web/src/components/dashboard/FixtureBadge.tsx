import React from "react";
import { copy } from "../../content/copy.id.js";

interface FixtureBadgeProps {
  visible: boolean;
}

export function FixtureBadge({ visible }: FixtureBadgeProps) {
  if (!visible) return null;
  return (
    <span
      data-testid="fixture-badge"
      className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-900"
      aria-label={copy.dashboard.fixtureNotice}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-brand-600"
      />
      {copy.dashboard.fixtureBadge}
    </span>
  );
}
