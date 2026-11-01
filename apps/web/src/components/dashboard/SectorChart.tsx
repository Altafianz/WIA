import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";
import { SectorSlice } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact } from "../../lib/format.js";
import { ChartWrapper } from "../ui/ChartWrapper.js";
import { DataTable } from "../common/DataTable.js";
import { ChartSkeleton } from "../states/LoadingSkeleton.js";

interface SectorChartProps {
  slices?: SectorSlice[];
  totalPagu?: number;
  simple?: boolean;
  state: "loading" | "empty" | "error" | "data";
  selectedSector?: string;
}

export function SectorChart({
  slices = [],
  state,
  selectedSector,
}: SectorChartProps) {
  if (state === "loading") {
    return <ChartSkeleton />;
  }

  if (state === "empty" || state === "error" || slices.length === 0) {
    return null;
  }

  const chartData = slices.map((s) => ({
    sectorId: s.sectorId,
    name: s.name,
    pagu: s.pagu,
    realisasi: s.realisasi,
    share: s.share,
  }));

  const tableContent = (
    <DataTable slices={slices} caption={copy.dashboard.sectorChartTitle} />
  );

  return (
    <ChartWrapper
      title={copy.dashboard.sectorChartTitle}
      description={copy.dashboard.sectorChartDescription}
      ariaLabel={copy.a11y.sectorChartLabel}
      tableContent={tableContent}
      data-testid="sector-chart"
    >
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, "auto"]}
              tickFormatter={(v) => formatRupiahCompact(v)}
              stroke="var(--color-text-muted)"
              fontSize={12}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              stroke="var(--color-text-muted)"
              fontSize={12}
              tickLine={false}
            />
            <RechartsTooltip
              formatter={(val: number) => [formatRupiahCompact(val), copy.dashboard.summaryPagu]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-md)",
              }}
            />
            <Bar dataKey="pagu" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.sectorId}`}
                  fill={
                    selectedSector && selectedSector === entry.sectorId
                      ? "var(--color-brand-700)"
                      : "var(--color-brand-600)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartWrapper>
  );
}
