import React from "react";
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
      <h2 className="type-h3">
        {copy.compare.sectorDeltaTitle}
      </h2>
      <p className="mt-1 text-sm text-text-muted">
        {copy.compare.sectorDeltaDescription}
      </p>
      <ul className="mt-4 divide-y divide-border">
        {items.map((item) => (
          <li key={item.sectorId} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-text">{item.name}</span>
              <span className="tabular-nums text-text">
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
