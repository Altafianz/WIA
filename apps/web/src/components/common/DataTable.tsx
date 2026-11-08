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
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="py-2.5 pr-4 font-semibold text-text-muted">
              {simple ? (
                tableCopy.sectorHeader
              ) : (
                <TermTooltip term={tableCopy.sectorHeader} definition={sectorDef} />
              )}
            </th>
            <th scope="col" className="py-2.5 pr-4 text-right font-semibold text-text-muted">
              {simple ? (
                tableCopy.paguHeader
              ) : (
                <TermTooltip term={tableCopy.paguHeader} definition={paguDef} />
              )}
            </th>
            <th scope="col" className="py-2.5 pr-4 text-right font-semibold text-text-muted">
              {simple ? (
                tableCopy.realisasiHeader
              ) : (
                <TermTooltip term={tableCopy.realisasiHeader} definition={realisasiDef} />
              )}
            </th>
            <th scope="col" className="py-2.5 text-right font-semibold text-text-muted">
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
              className="border-b border-border last:border-0 hover:bg-surface"
            >
              <td className="py-2.5 pr-4 text-text">
                {slice.isAggregate ? (
                  <em>{slice.name}</em>
                ) : (
                  slice.name
                )}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-text">
                {formatRupiahCompact(slice.pagu)}
              </td>
              <td className="py-2.5 pr-4 text-right tabular-nums text-text">
                {slice.realisasi !== null
                  ? formatRupiahCompact(slice.realisasi)
                  : "—"}
              </td>
              <td className="py-2.5 text-right tabular-nums text-text">
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
