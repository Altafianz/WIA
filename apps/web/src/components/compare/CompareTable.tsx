import React from "react";
import { CompareRow } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatPercent, formatRupiahCompact } from "../../lib/format.js";
import { formatSignedValue } from "./DeltaStat.js";

interface CompareTableProps {
  rows: CompareRow[];
  aLabel: string;
  bLabel: string;
  simple: boolean;
}

export function getCompareMetricLabel(row: CompareRow, simple: boolean): string {
  if (row.metric === "totalPagu") {
    return simple ? copy.compare.metricPaguSimple : copy.compare.metricPagu;
  }
  if (row.metric === "totalRealisasi") {
    return simple
      ? copy.compare.metricRealisasiSimple
      : copy.compare.metricRealisasi;
  }
  return simple ? copy.compare.metricRateSimple : copy.compare.metricRate;
}

function formatMetric(value: number | null, row: CompareRow): string {
  if (value === null) return copy.compare.noValue;
  return row.metric === "realizationRate"
    ? formatPercent(value)
    : formatRupiahCompact(value);
}

function deltaFormat(row: CompareRow): "rupiah" | "percent" {
  return row.metric === "realizationRate" ? "percent" : "rupiah";
}

export function CompareTable({ rows, aLabel, bLabel, simple }: CompareTableProps) {
  return (
    <div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{copy.compare.tableCaption}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-4 font-semibold text-text-muted">
                {copy.compare.columnMetric}
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold text-text-muted">
                {aLabel}
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold text-text-muted">
                {bLabel}
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold text-text-muted">
                {copy.compare.columnDelta}
              </th>
              <th scope="col" className="py-2 text-right font-semibold text-text-muted">
                {copy.compare.columnDeltaPercent}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.metric} className="border-b border-border last:border-0">
                <th scope="row" className="py-2 pr-4 text-left font-medium text-text">
                  {getCompareMetricLabel(row, simple)}
                </th>
                <td className="py-2 pr-4 text-right tabular-nums text-text">
                  {formatMetric(row.aValue, row)}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums text-text">
                  {formatMetric(row.bValue, row)}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums text-text">
                  {formatSignedValue(row.delta, deltaFormat(row))}
                </td>
                <td className="py-2 text-right tabular-nums text-text">
                  {formatSignedValue(row.deltaPercent, "percent")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="divide-y divide-border md:hidden">
        {rows.map((row) => (
          <div key={row.metric} className="py-3">
            <dt className="font-medium text-text">{getCompareMetricLabel(row, simple)}</dt>
            <dd className="mt-1 text-sm text-text-muted">
              {copy.compare.columnA} ({aLabel}): {formatMetric(row.aValue, row)}
            </dd>
            <dd className="text-sm text-text-muted">
              {copy.compare.columnB} ({bLabel}): {formatMetric(row.bValue, row)}
            </dd>
            <dd className="mt-1 text-sm text-text">
              {copy.compare.columnDelta}:{" "}
              {formatSignedValue(row.delta, deltaFormat(row))} (
              {formatSignedValue(row.deltaPercent, "percent")})
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
