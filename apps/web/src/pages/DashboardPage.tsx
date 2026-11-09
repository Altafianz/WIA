import React, { useCallback, useMemo } from "react";
import { copy } from "../content/copy.id.js";
import { PageMeta } from "../lib/seo.js";
import { useMeta } from "../hooks/useMeta.js";
import { useFilters } from "../hooks/useFilters.js";
import { useSimpleMode } from "../hooks/useSimpleMode.js";
import { useBudgetSummary } from "../hooks/useBudgetSummary.js";
import { useSectorBreakdown } from "../hooks/useSectorBreakdown.js";
import { useTrend } from "../hooks/useTrend.js";
import { useInsights } from "../hooks/useInsights.js";

import { ProvinceSelect } from "../components/filters/ProvinceSelect.js";
import { SubRegionSelect } from "../components/filters/SubRegionSelect.js";
import { YearSelect } from "../components/filters/YearSelect.js";
import {
  groupRegions,
  getProvinceOf,
  getSubRegions,
  formatRegionAnnouncement,
} from "../lib/region-grouping.js";
import { CopyLinkButton } from "../components/common/CopyLinkButton.js";
import { ExportCsvButton } from "../components/common/ExportCsvButton.js";
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
import { Card } from "../components/ui/Card.js";
import {
  buildCsvFilename,
  buildSectorCsv,
  downloadCsv,
} from "../lib/export-csv.js";

export function DashboardPage() {
  const { data: metaResp, isLoading: isMetaLoading } = useMeta();
  const [isSimple] = useSimpleMode();

  const regions = metaResp?.data.regions ?? [];
  const years = metaResp?.data.availableYears ?? [];
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
    metaResp?.data.latestFinalYear,
    metaResp?.data.defaultRegionSlug
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
  const insightItems = insightsResp?.data.items;
  const hasInsightColumn = insightItems === undefined || insightItems.length > 0;

  const isLoading = isMetaLoading || isSummaryLoading;
  const isError = isSummaryError;
  const isEmpty = !isLoading && !isError && (!summaryResp || summaryResp.data.totalPagu === 0);

  let state: "loading" | "empty" | "error" | "data" = "data";
  if (isLoading) state = "loading";
  else if (isError) state = "error";
  else if (isEmpty) state = "empty";

  const selectedRegion = regions.find((r) => r.slug === region);
  const currentProvince = useMemo(
    () => getProvinceOf(region, regions),
    [region, regions]
  );

  const provinceGroups = useMemo(() => groupRegions(regions), [regions]);
  const provinces = useMemo(
    () => provinceGroups.map((g) => g.province),
    [provinceGroups]
  );
  const currentProvinceSlug = currentProvince?.slug ?? provinces[0]?.slug ?? "";

  const subRegions = useMemo(
    () => getSubRegions(currentProvinceSlug, regions),
    [currentProvinceSlug, regions]
  );

  const handleProvinceChange = useCallback(
    (newProvinceSlug: string) => {
      setRegion(newProvinceSlug);
    },
    [setRegion]
  );

  const handleSubRegionChange = useCallback(
    (newSubRegionSlug: string) => {
      setRegion(newSubRegionSlug);
    },
    [setRegion]
  );

  const regionAnnouncement = useMemo(
    () => formatRegionAnnouncement(selectedRegion, currentProvince, year),
    [selectedRegion, currentProvince, year]
  );

  const regionDisplayName = selectedRegion
    ? selectedRegion.level === "province"
      ? selectedRegion.name
      : `${selectedRegion.name}, ${currentProvince?.name ?? ""}`
    : region;

  const exportDisabled =
    state !== "data" ||
    isSectorsLoading ||
    !sectorsResp?.data ||
    !summaryResp?.data;

  const handleExportCsv = () => {
    if (!sectorsResp?.data || !summaryResp?.data) return;

    const sourceMeta = summaryResp.meta ?? metaResp?.meta;
    const csv = buildSectorCsv(
      sectorsResp.data.slices,
      {
        isFixture: sourceMeta?.isFixture ?? false,
        totalPagu: summaryResp.data.totalPagu,
        totalRealisasi: summaryResp.data.totalRealisasi,
      },
      isSimple,
    );
    downloadCsv(buildCsvFilename(region, year), csv);
  };

  return (
    <div className="page-gutter flex w-full flex-col gap-6 py-6 lg:gap-8 lg:py-8">
      <PageMeta
        title={`${copy.dashboard.title} — ${regionDisplayName}`}
        description={copy.dashboard.description}
      />

      <Toast message={correctionMessage} onDismiss={dismissCorrection} />

      {/* Page heading */}
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-prose">
          <h1 className="type-h1 text-text">{copy.dashboard.title}</h1>
          <p className="mt-2 text-base text-text-muted">
            {copy.dashboard.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FixtureBadge
            visible={summaryResp?.meta.isFixture ?? metaResp?.meta.isFixture ?? false}
          />
        </div>
      </header>

      {/* Filter area: selects plus link/export actions */}
      <Card className="flex flex-col gap-4" padding="md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_10rem]">
          <ProvinceSelect
            provinces={provinces}
            value={currentProvinceSlug}
            onChange={handleProvinceChange}
            disabled={isLoading}
          />
          <div>
            <SubRegionSelect
              subRegions={subRegions}
              value={region}
              onChange={handleSubRegionChange}
              disabled={isLoading}
            />
          </div>
          <YearSelect
            years={years}
            value={year}
            onChange={setYear}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          {regionAnnouncement ? (
            <p
              aria-live="polite"
              className="text-sm font-medium text-text-muted"
              data-testid="region-announcement"
            >
              {regionAnnouncement}
            </p>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap items-center gap-2">
            <CopyLinkButton />
            <ExportCsvButton onClick={handleExportCsv} disabled={exportDisabled} />
          </div>
        </div>
      </Card>

      {/* Period status */}
      {summaryResp?.data.periodStatus && (
        <div className="flex flex-wrap items-start gap-3">
          <PeriodNotice
            periodStatus={summaryResp.data.periodStatus}
            fiscalYear={summaryResp.data.fiscalYear}
            simple={isSimple}
          />
        </div>
      )}

      {/* States Handling */}
      {state === "empty" && (
        <EmptyState onResetYear={() => setYear(metaResp?.data.latestFinalYear ?? 2024)} />
      )}

      {state === "error" && <ErrorState onRetry={() => refetchSummary()} />}

      {/* Cara Membaca Halaman Ini (Mode Sederhana) */}
      {isSimple && <SimpleModeHelp />}

      {/* 4 Summary Cards */}
      <SummaryCards summary={summaryResp?.data} simple={isSimple} state={state} />

      {/* Sector chart + insight panel: side by side on wide screens.
          When a region/year has no insights, the chart keeps the full row. */}
      <div
        className={[
          "grid grid-cols-1 gap-6",
          hasInsightColumn
            ? "xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] xl:items-start"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <SectorChart
          slices={sectorsResp?.data.slices}
          totalPagu={summaryResp?.data.totalPagu}
          simple={isSimple}
          state={isSectorsLoading ? "loading" : state}
          selectedSector={sector}
        />
        {insightItems && insightItems.length > 0 && (
          <div className="min-w-0">
            <InsightPanel
              items={insightItems}
              disclaimer={insightsResp?.data.disclaimer ?? ""}
              simple={isSimple}
            />
          </div>
        )}
      </div>

      {/* Trend chart full width */}
      <TrendChart
        points={trendResp?.data.points}
        simple={isSimple}
        state={isTrendLoading ? "loading" : state}
      />

      {/* Source attribution card */}
      {(summaryResp?.meta ?? metaResp?.meta) && (
        <SourceInfoCard meta={summaryResp?.meta ?? metaResp?.meta} />
      )}
    </div>
  );
}
