import React from "react";
import { SourceMeta } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { Card } from "../ui/Card.js";
import { formatDateId } from "../../lib/format.js";

interface SourceInfoCardProps {
  meta?: SourceMeta;
}

interface RowProps {
  label: string;
  value: React.ReactNode;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-2 border-b border-border last:border-0">
      <dt className="text-sm font-medium text-text-muted w-40 shrink-0">{label}</dt>
      <dd className="text-sm text-text">{value}</dd>
    </div>
  );
}

export function SourceInfoCard({ meta }: SourceInfoCardProps) {
  if (!meta) return null;

  return (
    <Card>
      <h3 className="text-base font-semibold text-text mb-3">
        {copy.dashboard.sourceCardTitle}
      </h3>
      <dl>
        <Row label={copy.dashboard.sourceFieldSource} value={meta.sourceName} />
        <Row
          label={copy.dashboard.sourceFieldUrl}
          value={
            meta.sourceUrl ? (
              <a
                href={meta.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline hover:text-brand-700 break-all"
              >
                {meta.sourceUrl}
              </a>
            ) : (
              "—"
            )
          }
        />
        <Row
          label={copy.dashboard.sourceFieldRetrieved}
          value={meta.retrievedAt ? formatDateId(meta.retrievedAt) : "—"}
        />
        <Row
          label={copy.dashboard.sourceFieldUpdated}
          value={meta.sourceUpdatedAt ? formatDateId(meta.sourceUpdatedAt) : "—"}
        />
        <Row label={copy.dashboard.sourceFieldLicense} value={meta.license ?? "—"} />
        <Row
          label={copy.dashboard.sourceFieldStatus}
          value={
            <span
              className={[
                "inline-flex items-center gap-1 font-medium",
                meta.isFixture ? "text-warning" : "text-success",
              ].join(" ")}
            >
              {meta.isFixture
                ? copy.dashboard.fixtureBadge
                : copy.dashboard.sourceStatusOfficial}
            </span>
          }
        />
      </dl>
    </Card>
  );
}
