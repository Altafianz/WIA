import React from "react";
import { Percent, PiggyBank, TrendingUp, Wallet } from "lucide-react";
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
  icon: React.ReactNode;
  muted?: boolean;
  subtext?: string;
}

function MetricCard({ label, value, testId, icon, muted, subtext }: MetricCardProps) {
  return (
    <Card data-testid={testId} className="flex flex-col gap-3" padding="md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-h-[1.5rem] items-center text-sm font-semibold text-text-muted">
          {label}
        </div>
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
        >
          {icon}
        </span>
      </div>
      <p
        className={[
          "break-words text-2xl font-extrabold leading-tight tracking-tight lg:text-[1.7rem] xl:text-3xl",
          muted ? "text-text-muted" : "text-text",
        ].join(" ")}
      >
        {value ?? "—"}
      </p>
      {subtext && (
        <p className="border-t border-border pt-3 text-sm leading-relaxed text-text-muted">
          {subtext}
        </p>
      )}
    </Card>
  );
}

export function SummaryCards({ summary, simple, state }: SummaryCardsProps) {
  if (state === "loading") {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        testId="summary-pagu"
        label={paguLabel}
        icon={<Wallet className="h-5 w-5" />}
        value={formatRupiahCompact(summary.totalPagu)}
      />
      <MetricCard
        testId="summary-realisasi"
        label={realisasiLabel}
        icon={<TrendingUp className="h-5 w-5" />}
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
        icon={<Percent className="h-5 w-5" />}
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
        icon={<PiggyBank className="h-5 w-5" />}
        value={
          summary.remainingBudget !== null
            ? formatRupiahCompact(summary.remainingBudget)
            : null
        }
      />
    </div>
  );
}
