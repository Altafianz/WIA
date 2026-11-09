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
      <h3 className="text-xl font-bold text-text">{c.fileTableHeading}</h3>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <caption className="sr-only">{c.fileTableCaption}</caption>
          <thead>
            <tr className="border-b border-border bg-surface">
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colFile}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colSheet}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colPeriod}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-text">
                {c.colFileDate}
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={`${file.kind}-${file.period}`}
                className="border-b border-border align-top last:border-0 hover:bg-surface"
              >
                <td className="px-4 py-3 text-text">{file.fileName}</td>
                <td className="px-4 py-3 text-text-muted">{file.sheetName}</td>
                <td className="px-4 py-3 text-text-muted">{file.period}</td>
                <td className="whitespace-nowrap px-4 py-3 text-text-muted">
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
