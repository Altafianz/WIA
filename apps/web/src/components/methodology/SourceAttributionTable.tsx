import React from "react";
import type { SourceMeta } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatDateId } from "../../lib/format.js";

const c = copy.methodology;

interface SourceAttributionTableProps {
  source?: SourceMeta;
  isLoading: boolean;
  isError: boolean;
}

function statusLabel(source: SourceMeta): string {
  if (source.isFixture) return c.statusFixture;

  switch (source.dataStatus) {
    case "degraded":
      return c.statusDegraded;
    case "stale":
      return c.statusStale;
    default:
      return c.statusReady;
  }
}

export function SourceAttributionTable({
  source,
  isLoading,
  isError,
}: SourceAttributionTableProps) {
  if (isLoading) {
    return (
      <p role="status" className="text-sm text-text-muted">
        {c.sourceLoading}
      </p>
    );
  }

  if (isError || !source) {
    return (
      <>
        <p role="alert" className="text-sm text-text-muted">
          {c.sourceNotAvailable}
        </p>
        <p className="text-sm text-text-muted">{c.sourceFixtureNote}</p>
      </>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <caption className="sr-only">{c.sourceTableCaption}</caption>
          <thead>
            <tr className="border-b border-border bg-surface">
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colSource}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colUrl}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colRetrieved}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colUpdated}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colLicense}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colStatus}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="align-top">
              <th scope="row" className="px-4 py-3 font-medium text-text">
                {source.sourceName}
              </th>
              <td className="px-4 py-3 text-text-muted">
                {source.sourceUrl ? (
                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-medium text-brand-700 underline decoration-dotted underline-offset-4 hover:text-brand-900"
                  >
                    {source.sourceUrl}
                  </a>
                ) : (
                  c.notAvailable
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                {formatDateId(source.retrievedAt)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                {source.sourceUpdatedAt
                  ? formatDateId(source.sourceUpdatedAt)
                  : c.notAvailable}
              </td>
              <td className="px-4 py-3 text-text-muted">
                {source.licenseUrl ? (
                  <a
                    href={source.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-700 underline decoration-dotted underline-offset-4 hover:text-brand-900"
                  >
                    {source.license}
                  </a>
                ) : (
                  source.license || c.notAvailable
                )}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-0.5 text-sm font-medium text-text">
                  {statusLabel(source)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="max-w-content text-sm text-text-muted">
        {source.isFixture ? c.sourceFixtureNote : c.sourceOfficialNote}
      </p>
    </div>
  );
}
