import React from "react";
import { copy } from "../content/copy.id.js";
import { PageMeta } from "../lib/seo.js";
import { useMeta } from "../hooks/useMeta.js";
import { useFilters } from "../hooks/useFilters.js";
import { useSimpleMode } from "../hooks/useSimpleMode.js";
import { useBudgetSummary } from "../hooks/useBudgetSummary.js";
import { useSectorBreakdown } from "../hooks/useSectorBreakdown.js";
import { useTrend } from "../hooks/useTrend.js";
import { useInsights } from "../hooks/useInsights.js";

import { RegionSelect } from "../components/filters/RegionSelect.js";
import { YearSelect } from "../components/filters/YearSelect.js";
import { CopyLinkButton } from "../components/common/CopyLinkButton.js";
import { FixtureBadge } from "../components/dashboard/FixtureBadge.js";
import { PeriodNotice } from "../components/dashboard/PeriodNotice.js";
import { SimpleModeHelp } from "../components/dashboard/SimpleModeHelp.js";
import { SummaryCards } from "../components/dashboard/SummaryCards.js";
import { SectorChart } from "../components/dashboard/SectorChart.js";
import { TrendChart } from "../components/dashboard/TrendChart.js";
import { InsightPanel } from "../components/dashboard/InsightPanel.js";
import { SourceInfoCard } from "../components/dashboard/SourceInfoCard.js";
import { EmptyState } from "../components/states/EmptyState.js";
import { ErrorState } from "../components/states/ErrorState.js";
import { Toast } from "../components/ui/Toast.js";

export function DashboardPage() {
  const { data: metaResp, isLoading: isMetaLoading } = useMeta();
  const [isSimple] = useSimpleMode();

  const regions = metaResp?.data.regions ?? [];
  const years = metaResp?.data.availableYears ?? [2021, 2022, 2023, 2024, 2025];
  const validRegionSlugs = regions.map((r) => r.slug);

  const {
    region,
    year,
    sector,
    setRegion,
    setYear,
    correctionMessage,
    dismissCorrection,
  } = useFilters(
    years,
    validRegionSlugs,
    metaResp?.data.latestFinalYear
  );

  const {
    data: summaryResp,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useBudgetSummary(region, year);

  const {
    data: sectorsResp,
    isLoading: isSectorsLoading,
  } = useSectorBreakdown(region, year);

  const {
    data: trendResp,
    isLoading: isTrendLoading,
  } = useTrend(region);

  const {
    data: insightsResp,
  } = useInsights(region, year);

  const isLoading = isMetaLoading || isSummaryLoading;
  const isError = isSummaryError;
  const isEmpty = !isLoading && !isError && (!summaryResp || summaryResp.data.totalPagu === 0);

  let state: "loading" | "empty" | "error" | "data" = "data";
  if (isLoading) state = "loading";
  else if (isError) state = "error";
  else if (isEmpty) state = "empty";

  const selectedRegion = regions.find((r) => r.slug === region);
  const regionName = selectedRegion ? selectedRegion.name : region;

  return (
    <div className="flex flex-col gap-6 py-4">
      <PageMeta
        title={`${copy.dashboard.title} — ${regionName}`}
        description={copy.dashboard.description}
      />

      <Toast message={correctionMessage} onDismiss={dismissCorrection} />

      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text">
            {copy.dashboard.title}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {copy.dashboard.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <RegionSelect
            regions={regions}
            value={region}
            onChange={setRegion}
            disabled={isLoading}
          />
          <YearSelect
            years={years}
            value={year}
            onChange={setYear}
            disabled={isLoading}
          />
          <div className="pt-6">
            <CopyLinkButton />
          </div>
        </div>
      </div>

      {/* Status Badges & Period Notice */}
      <div className="flex flex-wrap items-center gap-3">
        <FixtureBadge visible={summaryResp?.meta.isFixture ?? metaResp?.meta.isFixture ?? true} />
        {summaryResp?.data.periodStatus && (
          <PeriodNotice
            periodStatus={summaryResp.data.periodStatus}
            simple={isSimple}
          />
        )}
      </div>

      {/* States Handling */}
      {state === "empty" && (
        <EmptyState onResetYear={() => setYear(metaResp?.data.latestFinalYear ?? 2024)} />
      )}

      {state === "error" && (
        <ErrorState onRetry={() => refetchSummary()} />
      )}

      {/* Cara Membaca Halaman Ini (Mode Sederhana) */}
      {isSimple && <SimpleModeHelp />}

      {/* 4 Summary Cards */}
      <SummaryCards
        summary={summaryResp?.data}
        simple={isSimple}
        state={state}
      />

      {/* Sector Chart + Insight Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SectorChart
            slices={sectorsResp?.data.slices}
            totalPagu={summaryResp?.data.totalPagu}
            simple={isSimple}
            state={isSectorsLoading ? "loading" : state}
            selectedSector={sector}
          />
        </div>
        <div className="lg:col-span-5">
          {insightsResp?.data && (
            <InsightPanel
              items={insightsResp.data.items}
              disclaimer={insightsResp.data.disclaimer}
              simple={isSimple}
            />
          )}
        </div>
      </div>

      {/* Trend Chart Full Width */}
      <TrendChart
        points={trendResp?.data.points}
        simple={isSimple}
        state={isTrendLoading ? "loading" : state}
      />

      {/* Source Attribution Card */}
      {(summaryResp?.meta ?? metaResp?.meta) && (
        <SourceInfoCard meta={summaryResp?.meta ?? metaResp?.meta} />
      )}
    </div>
  );
}
