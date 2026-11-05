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
import { LimitationList } from "../components/methodology/LimitationList.js";

const c = copy.methodology;

export function MethodologyPage() {
  const { data, isLoading, isError } = useMeta();
  useHashScroll();

  const source = data?.meta;
  const updatedAt = source?.sourceUpdatedAt ?? source?.retrievedAt;
  const lastUpdated = updatedAt ? formatDateId(updatedAt) : c.notAvailable;

  return (
    <>
      <PageMeta
        title={c.metaTitle}
        description={c.description}
        path="/metodologi"
      />

      <div className="py-8">
        <header className="max-w-content">
          <h1 className="mb-2 text-2xl font-bold text-text">{c.title}</h1>
          <p className="text-text-muted">{c.description}</p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <MethodologyToc rules={INSIGHT_RULE_META} />

          <div className="min-w-0 max-w-content space-y-8">
            <MethodologySection
              id={c.anchorSummary}
              title={c.summaryHeading}
            >
              <p>{c.summaryBody}</p>
            </MethodologySection>

            <MethodologySection id={c.anchorSource} title={c.sourceHeading}>
              <SourceAttributionTable
                source={source}
                isLoading={isLoading}
                isError={isError}
              />
            </MethodologySection>

            <MethodologySection
              id={c.anchorMetrics}
              title={c.metricsHeading}
            >
              <p>{c.metricsDescription}</p>
              <MetricFormulaTable metrics={METRIC_DEFINITIONS} />
            </MethodologySection>

            <MethodologySection
              id={c.anchorInsights}
              title={c.insightsHeading}
            >
              <p>{c.insightsDescription}</p>
              <InsightRuleList rules={INSIGHT_RULE_META} />
            </MethodologySection>

            <MethodologySection
              id={c.anchorDisclaimer}
              title={c.globalDisclaimerHeading}
            >
              <p>{GLOBAL_DISCLAIMER}</p>
              <h3 className="pt-2 text-base font-semibold text-text">
                {c.limitationsHeading}
              </h3>
              <LimitationList items={c.limitations} />
            </MethodologySection>

            <MethodologySection id={c.anchorUpdate} title={c.anchorUpdate}>
              <p>
                {c.updatedLabel} {lastUpdated}
              </p>
              <h3 className="pt-2 text-base font-semibold text-text">
                {c.reportHeading}
              </h3>
              <p>{c.reportBody}</p>
              <a
                href={`mailto:${copy.footer.contactEmail}`}
                className="text-brand-600 underline hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                {c.reportLinkLabel.replace("{email}", copy.footer.contactEmail)}
              </a>
            </MethodologySection>
          </div>
        </div>
      </div>
    </>
  );
}
