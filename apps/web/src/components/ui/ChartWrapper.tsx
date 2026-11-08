import React, { useState } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { copy } from "../../content/copy.id.js";

interface ChartWrapperProps {
  title: React.ReactNode;
  description?: string;
  ariaLabel: string;
  children: React.ReactNode;
  tableContent?: React.ReactNode;
  "data-testid"?: string;
}

export function ChartWrapper({
  title,
  description,
  ariaLabel,
  children,
  tableContent,
  "data-testid": testId,
}: ChartWrapperProps) {
  const [showTable, setShowTable] = useState(false);
  const Icon = showTable ? BarChart3 : Table2;

  return (
    <section
      aria-label={ariaLabel}
      data-testid={testId}
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="type-h2">{title}</h2>
          {description && (
            <p className="prose-readable mt-1.5 text-sm text-text-muted">
              {description}
            </p>
          )}
        </div>
        {tableContent && (
          <button
            type="button"
            aria-expanded={showTable}
            aria-controls={testId ? `${testId}-content` : undefined}
            onClick={() => setShowTable((v) => !v)}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 text-base font-semibold text-brand-700 transition-colors duration-150 hover:border-brand-600 hover:bg-brand-50"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {showTable ? copy.dashboard.viewAsChart : copy.dashboard.viewAsTable}
          </button>
        )}
      </div>
      <div id={testId ? `${testId}-content` : undefined}>
        {showTable && tableContent ? (
          <div role="region" aria-label={`${ariaLabel} tabel`}>
            {tableContent}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
