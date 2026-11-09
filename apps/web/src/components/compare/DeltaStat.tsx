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
    className: "text-brand-700",
    Icon: ArrowUpRight,
  },
  down: {
    label: copy.compare.deltaDown,
    className: "text-brand-900",
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
    <Card className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-text-muted">{label}</p>
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full bg-surface",
            config.className,
          ].join(" ")}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span
          className={`break-words text-2xl font-extrabold tracking-tight ${config.className}`}
        >
          {formatSignedValue(delta, format)}
        </span>
        <span className="sr-only">{config.label}</span>
      </div>
      <p className="text-sm text-text-muted">
        {formatSignedValue(deltaPercent, "percent")}
      </p>
      <p className="mt-1 border-t border-border pt-2 text-sm leading-relaxed text-text-muted">
        {copy.compare.columnA}: {formatValue(aValue, format)} ·{" "}
        {copy.compare.columnB}: {formatValue(bValue, format)}
      </p>
    </Card>
  );
}
