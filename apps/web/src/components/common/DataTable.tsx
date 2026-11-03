import React from "react";
import { SectorSlice, findGlossaryEntry } from "@danaterbuka/shared";
import { formatRupiahCompact, formatPercent } from "../../lib/format.js";
import { getDataTableCopy } from "../../lib/simple-text.js";
import { TermTooltip } from "../ui/Tooltip.js";

interface DataTableProps {
  slices: SectorSlice[];
  caption: string;
  simple?: boolean;
}

export function DataTable({ slices, caption, simple = false }: DataTableProps) {
  const tableCopy = getDataTableCopy(simple);

  const sectorDef = findGlossaryEntry("Fungsi/Sektor")?.simpleDefinition ?? "";
  const paguDef = findGlossaryEntry("Pagu")?.simpleDefinition ?? "";
  const realisasiDef = findGlossaryEntry("Realisasi")?.simpleDefinition ?? "";
  const rateDef = findGlossaryEntry("Persentase realisasi")?.simpleDefinition ?? "";

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-4 font-semibold text-text-muted">
              {simple ? (
                tableCopy.sectorHeader
              ) : (
                <TermTooltip term={tableCopy.sectorHeader} definition={sectorDef} />
              )}
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold text-text-muted text-right">
              {simple ? (
                tableCopy.paguHeader
              ) : (
                <TermTooltip term={tableCopy.paguHeader} definition={paguDef} />
              )}
            </th>
            <th scope="col" className="py-2 pr-4 font-semibold text-text-muted text-right">
              {simple ? (
                tableCopy.realisasiHeader
              ) : (
                <TermTooltip term={tableCopy.realisasiHeader} definition={realisasiDef} />
              )}
            </th>
            <th scope="col" className="py-2 font-semibold text-text-muted text-right">
              {simple ? (
                tableCopy.rateHeader
              ) : (
                <TermTooltip term={tableCopy.rateHeader} definition={rateDef} />
              )}
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
