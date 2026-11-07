import React from "react";
import type { SourceMeta } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatDateId } from "../../lib/format.js";

const c = copy.methodology;

interface SourceFileTableProps {
  source?: SourceMeta;
}

export function SourceFileTable({ source }: SourceFileTableProps) {
  const files = source?.sourceFiles ?? [];
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-text">{c.fileTableHeading}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{c.fileTableCaption}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-semibold text-text">
                {c.colFile}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-text">
                {c.colSheet}
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold text-text">
                {c.colPeriod}
              </th>
              <th scope="col" className="py-2 font-semibold text-text">
                {c.colFileDate}
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={`${file.kind}-${file.period}`} className="align-top border-b border-border/60">
                <td className="py-2 pr-4 text-text">{file.fileName}</td>
                <td className="py-2 pr-4 text-text-muted">{file.sheetName}</td>
                <td className="py-2 pr-4 text-text-muted">{file.period}</td>
                <td className="py-2 text-text-muted">
                  {file.modifiedAt ? formatDateId(file.modifiedAt) : c.fileDateUnknown}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
