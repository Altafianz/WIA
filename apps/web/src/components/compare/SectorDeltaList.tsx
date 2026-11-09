import React from "react";
import { Scale } from "lucide-react";
import { SectorDelta } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact } from "../../lib/format.js";
import { Card } from "../ui/Card.js";
import { formatSignedValue } from "./DeltaStat.js";

interface SectorDeltaListProps {
  items: SectorDelta[];
}

export function SectorDeltaList({ items }: SectorDeltaListProps) {
  if (items.length === 0) return null;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
        >
          <Scale className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-text">
            {copy.compare.sectorDeltaTitle}
          </h2>
          <p className="mt-0.5 text-sm text-text-muted">
            {copy.compare.sectorDeltaDescription}
          </p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-border">
        {items.map((item) => (
          <li key={item.sectorId} className="flex flex-col gap-1 py-3 first:pt-2 last:pb-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-text">{item.name}</span>
              <span className="tabular-nums font-semibold text-text">
                {formatSignedValue(item.delta, "rupiah")}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
              <span>
                {copy.compare.columnPaguA}: {formatRupiahCompact(item.aPagu)}
              </span>
              <span>
                {copy.compare.columnPaguB}: {formatRupiahCompact(item.bPagu)}
              </span>
              <span>
                {copy.compare.columnDeltaPercent}:{" "}
                {formatSignedValue(item.deltaPercent, "percent")}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
