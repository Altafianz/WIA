import React from "react";
import { Database } from "lucide-react";
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
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-0 sm:gap-1.5">
      <dt className="text-sm font-semibold text-text-muted">{label}</dt>
      <dd className="min-w-0 text-sm text-text">{value}</dd>
    </div>
  );
}

export function SourceInfoCard({ meta }: SourceInfoCardProps) {
  if (!meta) return null;

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
        >
          <Database className="h-5 w-5" />
        </span>
        <h2 className="text-xl font-bold tracking-tight text-text">
          {copy.dashboard.sourceCardTitle}
        </h2>
      </div>
      <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 xl:grid-cols-3">
        <Row label={copy.dashboard.sourceFieldSource} value={meta.sourceName} />
        <Row
          label={copy.dashboard.sourceFieldCoverage}
          value={copy.dashboard.dataCoverage}
        />
        <Row
          label={copy.dashboard.sourceFieldUrl}
          value={
            meta.sourceUrl ? (
              <a
                href={meta.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-medium text-brand-700 underline decoration-dotted underline-offset-4 transition-colors duration-150 hover:text-brand-900"
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-sm font-semibold text-brand-800">
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
