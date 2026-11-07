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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{c.sourceTableCaption}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-semibold text-text">
                {c.colSource}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-text">
                {c.colUrl}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-text">
                {c.colRetrieved}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-text">
                {c.colUpdated}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-text">
                {c.colLicense}
              </th>
              <th scope="col" className="py-2 font-semibold text-text">
                {c.colStatus}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="align-top">
              <th scope="row" className="py-3 pr-4 font-medium text-text">
                {source.sourceName}
              </th>
              <td className="py-3 pr-4 text-text-muted">
                {source.sourceUrl ? (
                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-brand-600 underline hover:text-brand-700"
                  >
                    {source.sourceUrl}
                  </a>
                ) : (
                  c.notAvailable
                )}
              </td>
              <td className="py-3 pr-4 text-text-muted">
                {formatDateId(source.retrievedAt)}
              </td>
              <td className="py-3 pr-4 text-text-muted">
                {source.sourceUpdatedAt
                  ? formatDateId(source.sourceUpdatedAt)
                  : c.notAvailable}
              </td>
              <td className="py-3 pr-4 text-text-muted">
                {source.licenseUrl ? (
                  <a
                    href={source.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 underline hover:text-brand-700"
                  >
                    {source.license}
                  </a>
                ) : (
                  source.license || c.notAvailable
                )}
              </td>
              <td className="py-3 text-text-muted">{statusLabel(source)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-text-muted">
        {source.isFixture ? c.sourceFixtureNote : c.sourceOfficialNote}
      </p>
    </div>
  );
}
