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
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
        "text-xs font-semibold bg-warning text-text-inverse",
      ].join(" ")}
      aria-label={copy.dashboard.fixtureNotice}
    >
      {copy.dashboard.fixtureBadge}
    </span>
  );
}
