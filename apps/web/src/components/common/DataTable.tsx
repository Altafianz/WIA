import React from "react";
import { SectorSlice } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact, formatPercent } from "../../lib/format.js";

interface DataTableProps {
  slices: SectorSlice[];
  caption: string;
}

export function DataTable({ slices, caption }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-semibold text-text-muted">
              {copy.table.sectorHeader}
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold text-text-muted text-right">
              {copy.table.paguHeader}
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold text-text-muted text-right">
              {copy.table.realisasiHeader}
            </th>
            <th scope="col" className="py-2 font-semibold text-text-muted text-right">
              {copy.table.rateHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {slices.map((slice) => (
            <tr
              key={slice.sectorId}
              className="border-b border-border hover:bg-surface last:border-0"
            >
              <td className="py-2 pr-4 text-text">
                {slice.isAggregate ? (
                  <em>{slice.name}</em>
                ) : (
                  slice.name
                )}
              </td>
              <td className="py-2 pr-4 text-right text-text tabular-nums">
                {formatRupiahCompact(slice.pagu)}
              </td>
              <td className="py-2 pr-4 text-right text-text tabular-nums">
                {slice.realisasi !== null
                  ? formatRupiahCompact(slice.realisasi)
                  : "—"}
              </td>
              <td className="py-2 text-right text-text tabular-nums">
                {slice.realizationRate !== null
                  ? formatPercent(slice.realizationRate)
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
