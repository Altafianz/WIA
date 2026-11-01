import React from "react";
import { copy } from "../../content/copy.id.js";

interface ChartTableToggleProps {
  showTable: boolean;
  onToggle: () => void;
}

export function ChartTableToggle({ showTable, onToggle }: ChartTableToggleProps) {
  return (
    <button
      type="button"
      aria-expanded={showTable}
      onClick={onToggle}
      className={[
        "text-sm text-brand-600 underline hover:text-brand-700",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm",
      ].join(" ")}
    >
      {showTable ? copy.dashboard.viewAsChart : copy.dashboard.viewAsTable}
    </button>
  );
}
