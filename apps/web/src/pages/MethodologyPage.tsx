import React from "react";
import {
  GLOBAL_DISCLAIMER,
  INSIGHT_RULE_META,
  METRIC_DEFINITIONS,
} from "@danaterbuka/shared";
import { copy } from "../content/copy.id.js";
import { PageMeta } from "../lib/seo.js";
import { useMeta } from "../hooks/useMeta.js";
import { useHashScroll } from "../hooks/useHashScroll.js";
import { formatDateId } from "../lib/format.js";
import { MethodologySection } from "../components/methodology/MethodologySection.js";
import { MethodologyToc } from "../components/methodology/MethodologyToc.js";
import { MetricFormulaTable } from "../components/methodology/MetricFormulaTable.js";
import { InsightRuleList } from "../components/methodology/InsightRuleList.js";
import { SourceAttributionTable } from "../components/methodology/SourceAttributionTable.js";
import { SourceFileTable } from "../components/methodology/SourceFileTable.js";
import { LimitationList } from "../components/methodology/LimitationList.js";

const c = copy.methodology;

export function MethodologyPage() {
  const { data, isLoading, isError } = useMeta();
  useHashScroll();

  const source = data?.meta;
  const isFixture = source?.isFixture ?? false;
  const updatedAt = source?.sourceUpdatedAt ?? source?.retrievedAt;
  const lastUpdated = updatedAt ? formatDateId(updatedAt) : c.notAvailable;

  return (
    <div className="relative w-full">
      <PageMeta
        title={c.metaTitle}
        description={c.description}
        path="/metodologi"
      />

      {/* Full-height tinted rail behind the sticky sidebar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[21rem] border-r border-border bg-surface lg:block xl:w-[23rem]"
      />

      <div className="lg:flex lg:items-start">
        {/* Left rail: title, description and table of contents */}
        <aside className="w-full border-b border-border bg-surface px-4 py-8 sm:px-6 lg:sticky lg:top-header lg:h-[calc(100vh_-_var(--header-height))] lg:w-[21rem] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:px-6 lg:py-10 xl:w-[23rem]">
          <h1 className="type-h1 text-text">{c.title}</h1>
          <p className="mt-3 max-w-content text-base text-text-muted">
            {c.description}
          </p>
          <MethodologyToc rules={INSIGHT_RULE_META} />
        </aside>

        {/* Content fills the remaining width, starting at the top */}
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10 2xl:px-12">
          <div className="space-y-10">
            <MethodologySection id={c.anchorSummary} title={c.summaryHeading}>
              <p>{isFixture ? c.summaryBody : c.summaryBodyOfficial}</p>
            </MethodologySection>

            <MethodologySection id={c.anchorSource} title={c.sourceHeading}>
              <SourceAttributionTable
                source={source}
                isLoading={isLoading}
                isError={isError}
              />
              <SourceFileTable source={source} />
            </MethodologySection>

            <MethodologySection id={c.anchorMetrics} title={c.metricsHeading}>
              <p>{c.metricsDescription}</p>
              <MetricFormulaTable metrics={METRIC_DEFINITIONS} />
            </MethodologySection>

            <MethodologySection id={c.anchorInsights} title={c.insightsHeading}>
              <p>{c.insightsDescription}</p>
              <InsightRuleList rules={INSIGHT_RULE_META} />
            </MethodologySection>

            <MethodologySection
              id={c.anchorDisclaimer}
              title={c.globalDisclaimerHeading}
            >
              <p>{GLOBAL_DISCLAIMER}</p>
              <h3 className="pt-2 text-xl font-bold text-text">
                {c.limitationsHeading}
              </h3>
              <LimitationList
                items={isFixture ? c.limitations : c.limitationsOfficial}
              />
            </MethodologySection>

            <MethodologySection id={c.anchorUpdate} title={c.anchorUpdate}>
              <p>
                {c.updatedLabel} {lastUpdated}
              </p>
              <h3 className="pt-2 text-xl font-bold text-text">
                {c.reportHeading}
              </h3>
              <p>{c.reportBody}</p>
              <a
                href={`mailto:${copy.footer.contactEmail}`}
                className="break-all font-semibold text-brand-700 underline decoration-dotted underline-offset-4 transition-colors duration-150 hover:text-brand-900"
              >
                {c.reportLinkLabel.replace("{email}", copy.footer.contactEmail)}
              </a>
            </MethodologySection>
          </div>
        </div>
      </div>
    </div>
  );
}
