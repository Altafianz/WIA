import React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { formatPercent, formatRupiahCompact } from "../../lib/format.js";
import { Card } from "../ui/Card.js";

export type DeltaFormat = "rupiah" | "percent";
export type DeltaDirection = "up" | "down" | "flat";

export interface DeltaStatProps {
  label: string;
  aValue: number | null;
  bValue: number | null;
  delta: number | null;
  deltaPercent: number | null;
  format: DeltaFormat;
}

export function getDeltaDirection(delta: number | null): DeltaDirection {
  if (delta === null || delta === 0) return "flat";
  return delta > 0 ? "up" : "down";
}

export function formatSignedValue(
  value: number | null,
  format: DeltaFormat
): string {
  if (value === null) return copy.compare.noValue;
  const formatted =
    format === "percent" ? formatPercent(value) : formatRupiahCompact(value);
  return value > 0 ? `+${formatted}` : formatted;
}

export function formatValue(value: number | null, format: DeltaFormat): string {
  if (value === null) return copy.compare.noValue;
  return format === "percent" ? formatPercent(value) : formatRupiahCompact(value);
}

const directionConfig = {
  up: {
    label: copy.compare.deltaUp,
    className: "text-success",
    Icon: ArrowUpRight,
  },
  down: {
    label: copy.compare.deltaDown,
    className: "text-danger",
    Icon: ArrowDownRight,
  },
  flat: {
    label: copy.compare.deltaFlat,
    className: "text-text-muted",
    Icon: Minus,
  },
};

export function DeltaStat({
  label,
  aValue,
  bValue,
  delta,
  deltaPercent,
  format,
}: DeltaStatProps) {
  const direction = getDeltaDirection(delta);
  const config = directionConfig[direction];
  const Icon = config.Icon;

  return (
    <Card>
      <p className="text-sm text-text-muted mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${config.className}`} aria-hidden="true" />
        <span className={`text-2xl font-bold ${config.className}`}>
          {formatSignedValue(delta, format)}
        </span>
        <span className="sr-only">{config.label}</span>
      </div>
      <p className="text-xs text-text-muted mt-1">
        {formatSignedValue(deltaPercent, "percent")}
      </p>
      <p className="text-xs text-text-muted mt-2">
        {copy.compare.columnA}: {formatValue(aValue, format)} ·{" "}
        {copy.compare.columnB}: {formatValue(bValue, format)}
      </p>
    </Card>
  );
}
