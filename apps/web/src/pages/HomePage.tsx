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

const QUESTIONS = [
  {
    icon: PieChart,
    title: copy.home.question1Title,
    body: copy.home.question1Body,
  },
  {
    icon: HelpCircle,
    title: copy.home.question2Title,
    body: copy.home.question2Body,
  },
  {
    icon: ShieldAlert,
    title: copy.home.question3Title,
    body: copy.home.question3Body,
  },
];

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
    <div className="flex flex-col gap-14 py-10">
      <PageMeta
        title={`${copy.common.siteName} — ${copy.common.tagline}`}
        description={copy.home.heroSubheadline}
      />

      {/* Hero Section */}
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <div>
          <FixtureBadge visible={isFixture} />
        </div>
        <h1 className="type-display">{copy.home.heroHeadline}</h1>
        <p className="prose-readable text-lg leading-relaxed text-text-muted">
          {copy.home.heroSubheadline}
        </p>
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="flex w-full items-center justify-center gap-2"
            >
              {copy.home.ctaDashboard}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
          <Link to="/metodologi" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full">
              {copy.home.ctaMethodology}
            </Button>
          </Link>
        </div>
      </section>

      {/* 3 Questions Answered */}
      <section className="w-full">
        <h2 className="type-h2 mb-8 text-center">
          {copy.home.questionsHeading}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {QUESTIONS.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="flex flex-col gap-4" padding="lg">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="type-h3">{title}</h3>
              <p className="text-base leading-relaxed text-text-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Preview Teaser Section */}
      <section className="w-full">
        <Card
          padding="lg"
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
        >
          <div className="flex max-w-2xl flex-col gap-2">
            <h3 className="type-h3">{copy.dashboard.title}</h3>
            <p className="text-base leading-relaxed text-text-muted">
              {copy.dashboard.description}
            </p>
          </div>
          <Link to="/dashboard" className="w-full shrink-0 md:w-auto">
            <Button className="flex w-full items-center justify-center gap-2 md:w-auto">
              {copy.home.ctaDashboard}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Data Notice Section */}
      <section className="w-full">
        <div className="flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <Info
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-brand-700"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-brand-800">
              {copy.home.dataNoticeTitle}
            </h2>
            <p className="prose-readable text-base leading-relaxed text-text-muted">
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
