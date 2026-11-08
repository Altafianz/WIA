import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { SectorSlice, findGlossaryEntry } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact } from "../../lib/format.js";
import { getSectorChartCopy } from "../../lib/simple-text.js";
import { ChartWrapper } from "../ui/ChartWrapper.js";
import { DataTable } from "../common/DataTable.js";
import { TermTooltip } from "../ui/Tooltip.js";
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
  simple = false,
  selectedSector,
}: SectorChartProps) {
  if (state === "loading") {
    return <ChartSkeleton />;
  }

  if (state === "empty" || state === "error" || slices.length === 0) {
    return null;
  }

  const chartCopy = getSectorChartCopy(simple);
  const alokasiDef = findGlossaryEntry("Alokasi")?.simpleDefinition ?? "";

  const chartTitle = simple ? (
    <span>{chartCopy.title}</span>
  ) : (
    <TermTooltip term={chartCopy.title} definition={alokasiDef} />
  );

  const chartData = slices.map((s) => ({
    sectorId: s.sectorId,
    name: s.name,
    pagu: s.pagu,
    realisasi: s.realisasi,
    share: s.share,
  }));

  const tableContent = (
    <DataTable slices={slices} caption={chartCopy.title} simple={simple} />
  );

  const tooltipPaguLabel = simple
    ? copy.dashboard.summaryPaguSimple
    : copy.dashboard.summaryPagu;

  const axisTick = {
    fontSize: 14,
    fill: "var(--color-text-muted)",
    fontFamily: "var(--font-sans)",
  };

  return (
    <ChartWrapper
      title={chartTitle}
      description={chartCopy.description}
      ariaLabel={copy.a11y.sectorChartLabel}
      tableContent={tableContent}
      data-testid="sector-chart"
    >
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 16, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              horizontal
              vertical={false}
              stroke="var(--color-chart-grid)"
            />
            <XAxis
              type="number"
              domain={[0, "auto"]}
              tickFormatter={(v) => formatRupiahCompact(v)}
              tick={axisTick}
              tickLine={false}
              axisLine={{ stroke: "var(--color-chart-grid)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={132}
              tick={axisTick}
              tickLine={false}
              axisLine={false}
            />
            <RechartsTooltip
              cursor={{ fill: "var(--color-surface)" }}
              formatter={(val: number) => [formatRupiahCompact(val), tooltipPaguLabel]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-md)",
                fontSize: 14,
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 12, fontSize: 14 }}
              formatter={() => tooltipPaguLabel}
            />
            <Bar
              dataKey="pagu"
              name={tooltipPaguLabel}
              fill="var(--color-sector-2)"
              radius={[0, 6, 6, 0]}
              // Keep positive sectors visible when one sector dominates the
              // linear scale; exact values stay available in the tooltip/table.
              minPointSize={(value) =>
                typeof value === "number" && value > 0 ? 3 : 0
              }
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.sectorId}`}
                  fill={
                    selectedSector && selectedSector === entry.sectorId
                      ? "var(--color-sector-1)"
                      : "var(--color-sector-2)"
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
