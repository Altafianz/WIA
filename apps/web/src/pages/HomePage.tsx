import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, Info, PieChart, ShieldAlert } from "lucide-react";
import { copy } from "../content/copy.id.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { PageMeta } from "../lib/seo.js";
import { FixtureBadge } from "../components/dashboard/FixtureBadge.js";
import { useMeta } from "../hooks/useMeta.js";
import { useHashScroll } from "../hooks/useHashScroll.js";
import { useSimpleMode } from "../hooks/useSimpleMode.js";
import { useSubmitFeedback } from "../hooks/useSubmitFeedback.js";
import { FeedbackSection } from "../components/home/FeedbackSection.js";

export function HomePage() {
  useHashScroll();
  const { data } = useMeta();
  const [isSimple] = useSimpleMode();
  const isFixture = data?.meta.isFixture ?? false;

  const {
    formData,
    fieldErrors,
    errorMessage,
    isSubmitting,
    isSuccess,
    successRef,
    onChangeField,
    onSubmit,
    onResetSuccess,
  } = useSubmitFeedback();

  return (
    <div className="page-gutter flex w-full flex-col gap-14 py-10 lg:gap-20 lg:py-16">
      <PageMeta
        title={`${copy.common.siteName} — ${copy.common.tagline}`}
        description={copy.home.heroSubheadline}
      />

      {/* Hero Section */}
      <section className="mx-auto flex flex-col items-center gap-5 text-center">
        <FixtureBadge visible={isFixture} />
        <h1 className="type-display text-text">{copy.home.heroHeadline}</h1>
        <p className="max-w-4xl text-base leading-relaxed text-text-muted sm:text-lg">
          {copy.home.heroSubheadline}
        </p>
        <div className="mt-2 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full justify-center gap-2 sm:w-auto"
            >
              {copy.home.ctaDashboard}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link to="/metodologi" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              {copy.home.ctaMethodology}
            </Button>
          </Link>
        </div>
      </section>

      {/* 3 Questions Answered */}
      <section className="w-full">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-text sm:text-3xl">
          {copy.home.questionsHeading}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card interactive className="flex flex-col gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
            >
              <PieChart className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-bold text-text">
              {copy.home.question1Title}
            </h3>
            <p className="text-sm leading-relaxed text-text-muted">
              {copy.home.question1Body}
            </p>
          </Card>

          <Card interactive className="flex flex-col gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
            >
              <HelpCircle className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-bold text-text">
              {copy.home.question2Title}
            </h3>
            <p className="text-sm leading-relaxed text-text-muted">
              {copy.home.question2Body}
            </p>
          </Card>

          <Card interactive className="flex flex-col gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
            >
              <ShieldAlert className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-bold text-text">
              {copy.home.question3Title}
            </h3>
            <p className="text-sm leading-relaxed text-text-muted">
              {copy.home.question3Body}
            </p>
          </Card>
        </div>
      </section>

      {/* Preview Teaser Section */}
      <section className="w-full">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-surface p-6 md:flex-row md:items-center lg:p-10">
          <div className="flex max-w-2xl flex-col gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-text">
              {copy.dashboard.title}
            </h3>
            <p className="text-base leading-relaxed text-text-muted">
              {copy.dashboard.description}
            </p>
          </div>
          <Link to="/dashboard" className="w-full md:w-auto">
            <Button className="w-full justify-center gap-2 whitespace-nowrap md:w-auto">
              {copy.home.ctaDashboard}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Data Notice Section */}
      <section className="w-full">
        <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card text-brand-700"
          >
            <Info className="h-4 w-4" />
          </span>
          <div>
            <h4 className="mb-1 text-base font-bold text-brand-900">
              {copy.home.dataNoticeTitle}
            </h4>
            <p className="text-sm leading-relaxed text-brand-900">
              {isFixture
                ? copy.home.dataNoticeBodyFixture
                : copy.home.dataNoticeBodyOfficial}
            </p>
          </div>
        </div>
      </section>

      {/* Kirim Saran Section */}
      <FeedbackSection
        formData={formData}
        fieldErrors={fieldErrors}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        successRef={successRef}
        onChangeField={onChangeField}
        onSubmit={onSubmit}
        onResetSuccess={onResetSuccess}
        simple={isSimple}
      />
    </div>
  );
}
