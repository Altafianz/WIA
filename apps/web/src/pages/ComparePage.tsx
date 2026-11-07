import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_FISCAL_YEAR,
  DEFAULT_REGION_SLUG,
} from "@danaterbuka/shared";
import { copy } from "../content/copy.id.js";
import { PageMeta } from "../lib/seo.js";
import { useMeta } from "../hooks/useMeta.js";
import { useSimpleMode } from "../hooks/useSimpleMode.js";
import { useCompare } from "../hooks/useCompare.js";
import {
  buildCompareSearchParams,
  resolveCompareParams,
} from "../lib/compare-params.js";
import { ApiClientError } from "../lib/api-client.js";
import { CompareForm, CompareFormValues } from "../components/compare/CompareForm.js";
import { DeltaStat } from "../components/compare/DeltaStat.js";
import {
  CompareTable,
  getCompareMetricLabel,
} from "../components/compare/CompareTable.js";
import { SectorDeltaList } from "../components/compare/SectorDeltaList.js";
import { CopyLinkButton } from "../components/common/CopyLinkButton.js";
import { FixtureBadge } from "../components/dashboard/FixtureBadge.js";
import { EmptyState } from "../components/states/EmptyState.js";
import { ErrorState } from "../components/states/ErrorState.js";
import { CardSkeleton, ChartSkeleton } from "../components/states/LoadingSkeleton.js";
import { Toast } from "../components/ui/Toast.js";
import { Card } from "../components/ui/Card.js";

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: metaResp, isLoading: isMetaLoading } = useMeta();
  const [isSimple] = useSimpleMode();
  const [notice, setNotice] = useState<string | null>(null);

  const regions = metaResp?.data.regions ?? [];
  const years = metaResp?.data.availableYears ?? [2021, 2022, 2023, 2024, 2025];
  const defaultYear = metaResp?.data.latestFinalYear ?? DEFAULT_FISCAL_YEAR;
  const defaultRegion = metaResp?.data.defaultRegionSlug ?? DEFAULT_REGION_SLUG;

  const resolved = useMemo(
    () =>
      resolveCompareParams(
        {
          mode: searchParams.get("mode"),
          a: searchParams.get("a"),
          b: searchParams.get("b"),
          year: searchParams.get("year"),
          yearA: searchParams.get("yearA"),
          yearB: searchParams.get("yearB"),
        },
        { regions, years, defaultRegion, defaultYear }
      ),
    [searchParams, regions, years, defaultRegion, defaultYear]
  );

  useEffect(() => {
    if (!metaResp) return;

    if (resolved.regionCollision) {
      setNotice(copy.compare.differentRegions);
    } else if (resolved.yearCollision) {
      setNotice(copy.compare.differentYears);
    }

    if (resolved.needsReplace) {
      setSearchParams(buildCompareSearchParams(resolved), { replace: true });
    }
  }, [metaResp, resolved, setSearchParams]);

  const {
    data: compareResp,
    isLoading: isCompareLoading,
    isError,
    error,
    refetch,
  } = useCompare({
    mode: resolved.mode,
    a: resolved.a,
    b: resolved.b,
    year: resolved.year,
    yearA: resolved.yearA,
    yearB: resolved.yearB,
  });

  const handleChange = useCallback(
    (patch: Partial<CompareFormValues>) => {
      const next = { ...resolved, ...patch };
      setSearchParams(buildCompareSearchParams(next), { replace: true });
    },
    [resolved, setSearchParams]
  );

  const formValues: CompareFormValues = {
    mode: resolved.mode,
    a: resolved.a,
    b: resolved.b,
    year: resolved.year,
    yearA: resolved.yearA,
    yearB: resolved.yearB,
  };

  const isLoading = isMetaLoading || isCompareLoading;
  const errorCode = error instanceof ApiClientError ? error.code : null;
  const isNotFound =
    errorCode === "DATA_NOT_FOUND" || errorCode === "REGION_NOT_FOUND";
  const isEmpty = !isLoading && isNotFound;
  const isErrorState = !isLoading && isError && !isNotFound;

  const regionA = regions.find((r) => r.slug === resolved.a);
  const regionB = regions.find((r) => r.slug === resolved.b);
  const isDifferentLevel =
    resolved.mode === "region" &&
    Boolean(
      regionA &&
      regionB &&
      ((regionA.level === "province" && regionB.level !== "province") ||
        (regionA.level !== "province" && regionB.level === "province"))
    );

  return (
    <div className="flex flex-col gap-6 py-4">
      <PageMeta
        title={`${copy.compare.title} — ${copy.common.siteName}`}
        description={copy.compare.description}
      />

      <Toast message={notice} onDismiss={() => setNotice(null)} />

      <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text md:text-3xl">
            {copy.compare.title}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {copy.compare.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <FixtureBadge
            visible={compareResp?.meta.isFixture ?? metaResp?.meta.isFixture ?? false}
          />
          <CopyLinkButton />
        </div>
      </div>

      <CompareForm
        values={formValues}
        regions={regions}
        years={years}
        onChange={handleChange}
        disabled={isLoading}
      />

      {isDifferentLevel && (
        <div
          role="note"
          data-testid="level-difference-notice"
          className="rounded-lg border border-border bg-surface p-4 text-sm text-text-muted"
        >
          <p>
            {isSimple
              ? copy.compare.levelDifferenceNoticeSimple
              : copy.compare.levelDifferenceNotice}
          </p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
          <ChartSkeleton />
        </div>
      )}

      {isEmpty && (
        <EmptyState
          title={copy.compare.emptyTitle}
          description={copy.compare.emptyDescription}
        />
      )}

      {isErrorState && <ErrorState onRetry={() => refetch()} />}

      {!isLoading && !isEmpty && !isErrorState && compareResp && (
        <div className="flex flex-col gap-6">
          <section aria-labelledby="compare-delta-heading">
            <div className="mb-3">
              <h2 id="compare-delta-heading" className="text-lg font-semibold text-text">
                {copy.compare.deltaTitle}
              </h2>
              <p className="text-sm text-text-muted">{copy.compare.deltaSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {compareResp.data.rows.map((row) => (
                <DeltaStat
                  key={row.metric}
                  label={getCompareMetricLabel(row, isSimple)}
                  aValue={row.aValue}
                  bValue={row.bValue}
                  delta={row.delta}
                  deltaPercent={row.deltaPercent}
                  format={row.metric === "realizationRate" ? "percent" : "rupiah"}
                />
              ))}
            </div>
          </section>

          <Card>
            <CompareTable
              rows={compareResp.data.rows}
              aLabel={compareResp.data.a.label}
              bLabel={compareResp.data.b.label}
              simple={isSimple}
            />
          </Card>

          <SectorDeltaList items={compareResp.data.topSectorDeltas} />
        </div>
      )}
    </div>
  );
}
