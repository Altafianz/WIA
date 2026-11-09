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

  return (
    <section
      aria-label={ariaLabel}
      data-testid={testId}
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-text">
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-prose text-sm text-text-muted">
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
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-text transition-colors duration-150 hover:border-border-strong hover:bg-surface"
          >
            {showTable ? (
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Table2 className="h-4 w-4" aria-hidden="true" />
            )}
            {showTable ? copy.dashboard.viewAsChart : copy.dashboard.viewAsTable}
          </button>
        )}
      </div>

      <div id={testId ? `${testId}-content` : undefined} className="mt-5 flex-1">
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
