import React from "react";
import { BudgetSummaryData } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact, formatPercent } from "../../lib/format.js";
import { Card } from "../ui/Card.js";
import { CardSkeleton } from "../states/LoadingSkeleton.js";

type CardState = "loading" | "empty" | "error" | "data";

interface SummaryCardsProps {
  summary?: BudgetSummaryData;
  simple: boolean;
  state: CardState;
}

interface MetricCardProps {
  label: string;
  value: string | null;
  testId: string;
  muted?: boolean;
}

function MetricCard({ label, value, testId, muted }: MetricCardProps) {
  return (
    <Card data-testid={testId}>
      <p className="text-sm text-text-muted mb-1">{label}</p>
      <p
        className={[
          "text-2xl font-bold truncate",
          muted ? "text-text-muted" : "text-text",
        ].join(" ")}
      >
        {value ?? "—"}
      </p>
    </Card>
  );
}

export function SummaryCards({ summary, simple, state }: SummaryCardsProps) {
  if (state === "loading") {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (state === "error" || state === "empty" || !summary) {
    return null;
  }

  const paguLabel = simple ? copy.dashboard.summaryPaguSimple : copy.dashboard.summaryPagu;
  const realisasiLabel = simple
    ? copy.dashboard.summaryRealisasiSimple
    : copy.dashboard.summaryRealisasi;
  const rateLabel = simple ? copy.dashboard.summaryRateSimple : copy.dashboard.summaryRate;
  const remainingLabel = simple
    ? copy.dashboard.summaryRemainingSimple
    : copy.dashboard.summaryRemaining;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        testId="summary-pagu"
        label={paguLabel}
        value={formatRupiahCompact(summary.totalPagu)}
      />
      <MetricCard
        testId="summary-realisasi"
        label={realisasiLabel}
        value={
          summary.totalRealisasi !== null
            ? formatRupiahCompact(summary.totalRealisasi)
            : copy.dashboard.realizationNotReleased
        }
        muted={summary.totalRealisasi === null}
      />
      <MetricCard
        testId="summary-rate"
        label={rateLabel}
        value={
          summary.realizationRate !== null
            ? formatPercent(summary.realizationRate)
            : null
        }
      />
      <MetricCard
        testId="summary-gap"
        label={remainingLabel}
        value={
          summary.remainingBudget !== null
            ? formatRupiahCompact(summary.remainingBudget)
            : null
        }
      />
    </div>
  );
}
