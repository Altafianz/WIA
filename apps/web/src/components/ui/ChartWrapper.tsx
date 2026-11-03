import React, { useState } from "react";
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
    <section aria-label={ariaLabel} data-testid={testId}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        {description && (
          <p className="text-sm text-text-muted mt-1">{description}</p>
        )}
      </div>
      {tableContent && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            aria-expanded={showTable}
            aria-controls={testId ? `${testId}-content` : undefined}
            onClick={() => setShowTable((v) => !v)}
            className={[
              "text-sm text-brand-600 underline hover:text-brand-700",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm",
            ].join(" ")}
          >
            {showTable ? copy.dashboard.viewAsChart : copy.dashboard.viewAsTable}
          </button>
        </div>
      )}
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
