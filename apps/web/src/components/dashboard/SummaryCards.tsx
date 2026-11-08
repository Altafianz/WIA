import React from "react";
import { BudgetSummaryData, findGlossaryEntry } from "@danaterbuka/shared";
import { copy } from "../../content/copy.id.js";
import { formatRupiahCompact, formatPercent, formatPerHundred } from "../../lib/format.js";
import { Card } from "../ui/Card.js";
import { TermTooltip } from "../ui/Tooltip.js";
import { CardSkeleton } from "../states/LoadingSkeleton.js";

type CardState = "loading" | "empty" | "error" | "data";

interface SummaryCardsProps {
  summary?: BudgetSummaryData;
  simple: boolean;
  state: CardState;
}

interface MetricCardProps {
  label: React.ReactNode;
  value: string | null;
  testId: string;
  muted?: boolean;
  subtext?: string;
}

function MetricCard({ label, value, testId, muted, subtext }: MetricCardProps) {
  return (
    <Card data-testid={testId}>
      <div className="text-sm text-text-muted mb-1 flex items-center min-h-[1.5rem]">
        {label}
      </div>
      <p
        className={[
          "text-2xl font-bold truncate",
          muted ? "text-text-muted" : "text-text",
        ].join(" ")}
      >
        {value ?? "—"}
      </p>
      {subtext && (
        <p className="text-xs text-text-muted mt-2 leading-relaxed border-t border-border pt-2">
          {subtext}
        </p>
      )}
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

  const paguDef = findGlossaryEntry("Pagu")?.simpleDefinition ?? "";
  const realisasiDef = findGlossaryEntry("Realisasi")?.simpleDefinition ?? "";
  const rateDef = findGlossaryEntry("Persentase realisasi")?.simpleDefinition ?? "";
  const gapDef = findGlossaryEntry("Sisa anggaran")?.simpleDefinition ?? "";

  const paguLabel = simple ? (
    <span>{copy.dashboard.summaryPaguSimple}</span>
  ) : (
    <TermTooltip term={copy.dashboard.summaryPagu} definition={paguDef} />
  );

  const realisasiLabel = simple ? (
    <span>{copy.dashboard.summaryRealisasiSimple}</span>
  ) : (
    <TermTooltip term={copy.dashboard.summaryRealisasi} definition={realisasiDef} />
  );

  const rateLabel = simple ? (
    <span>{copy.dashboard.summaryRateSimple}</span>
  ) : (
    <TermTooltip term={copy.dashboard.summaryRate} definition={rateDef} />
  );

  const remainingLabel = simple ? (
    <span>{copy.dashboard.summaryRemainingSimple}</span>
  ) : (
    <TermTooltip term={copy.dashboard.summaryRemaining} definition={gapDef} />
  );

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
        subtext={simple ? formatPerHundred(summary.realizationRate) : undefined}
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
