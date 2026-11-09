import React from "react";
import { BarChart3, Table2 } from "lucide-react";
import { copy } from "../../content/copy.id.js";

interface ChartTableToggleProps {
  showTable: boolean;
  onToggle: () => void;
}

export function ChartTableToggle({ showTable, onToggle }: ChartTableToggleProps) {
  const Icon = showTable ? BarChart3 : Table2;

  return (
    <button
      type="button"
      aria-expanded={showTable}
      onClick={onToggle}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-base font-semibold text-brand-700 transition-colors duration-150 hover:border-brand-600 hover:bg-brand-50"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {showTable ? copy.dashboard.viewAsChart : copy.dashboard.viewAsTable}
    </button>
  );
}
