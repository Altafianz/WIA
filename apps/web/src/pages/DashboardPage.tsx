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
    <div className="flex flex-col gap-6 py-4">
      <PageMeta
        title={`${copy.dashboard.title} — ${regionDisplayName}`}
        description={copy.dashboard.description}
      />

      <Toast message={correctionMessage} onDismiss={dismissCorrection} />

      {/* Header & Filter Bar */}
      <div className="flex flex-col gap-4 border-b border-border pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text">
              {copy.dashboard.title}
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {copy.dashboard.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <ProvinceSelect
                provinces={provinces}
                value={currentProvinceSlug}
                onChange={handleProvinceChange}
                disabled={isLoading}
                className="w-full sm:w-48"
              />
            </div>
            <div className="w-full sm:w-auto">
              <SubRegionSelect
                subRegions={subRegions}
                value={region}
                onChange={handleSubRegionChange}
                disabled={isLoading}
                className="w-full sm:w-64"
              />
            </div>
            <div className="w-full sm:w-auto">
              <YearSelect
                years={years}
                value={year}
                onChange={setYear}
                disabled={isLoading}
                className="w-full sm:w-28"
              />
            </div>
            <div className="w-full sm:w-auto pt-2 sm:pt-0">
              <CopyLinkButton />
            </div>
          </div>
        </div>

        {regionAnnouncement && (
          <p
            aria-live="polite"
            className="text-sm font-medium text-text-muted"
            data-testid="region-announcement"
          >
            {regionAnnouncement}
          </p>
        )}
      </div>

      {/* Status Badges & Period Notice */}
      <div className="flex flex-wrap items-center gap-3">
        <FixtureBadge visible={summaryResp?.meta.isFixture ?? metaResp?.meta.isFixture ?? false} />
        {summaryResp?.data.periodStatus && (
          <PeriodNotice
            periodStatus={summaryResp.data.periodStatus}
            fiscalYear={summaryResp.data.fiscalYear}
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
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex justify-end">
            <ExportCsvButton
              onClick={handleExportCsv}
              disabled={exportDisabled}
            />
          </div>
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
