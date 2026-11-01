import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle, PieChart, ShieldAlert } from "lucide-react";
import { copy } from "../content/copy.id.js";
import { Card } from "../components/ui/Card.js";
import { Button } from "../components/ui/Button.js";
import { PageMeta } from "../lib/seo.js";
import { FixtureBadge } from "../components/dashboard/FixtureBadge.js";

export function HomePage() {
  return (
    <div className="flex flex-col gap-12 py-8">
      <PageMeta
        title={`${copy.common.siteName} — ${copy.common.tagline}`}
        description={copy.home.heroSubheadline}
      />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto px-4 flex flex-col items-center gap-6">
        <div>
          <FixtureBadge visible={true} />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-text tracking-tight leading-tight">
          {copy.home.heroHeadline}
        </h1>
        <p className="text-base md:text-lg text-text-muted leading-relaxed">
          {copy.home.heroSubheadline}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full flex items-center justify-center gap-2">
              {copy.home.ctaDashboard}
              <ArrowRight className="w-4 h-4" />
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
      <section className="max-w-container mx-auto px-4 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-text text-center mb-8">
          {copy.home.questionsHeading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col gap-3 p-6">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-text">
              {copy.home.question1Title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {copy.home.question1Body}
            </p>
          </Card>

          <Card className="flex flex-col gap-3 p-6">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-text">
              {copy.home.question2Title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {copy.home.question2Body}
            </p>
          </Card>

          <Card className="flex flex-col gap-3 p-6">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-text">
              {copy.home.question3Title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {copy.home.question3Body}
            </p>
          </Card>
        </div>
      </section>

      {/* Preview Teaser Section */}
      <section className="max-w-container mx-auto px-4 w-full">
        <div className="border border-border rounded-xl bg-surface p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h3 className="text-lg md:text-xl font-bold text-text">
              {copy.dashboard.title}
            </h3>
            <p className="text-sm text-text-muted">
              {copy.dashboard.description}
            </p>
          </div>
          <Link to="/dashboard">
            <Button className="whitespace-nowrap flex items-center gap-2">
              {copy.home.ctaDashboard}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Data Notice Section */}
      <section className="max-w-container mx-auto px-4 w-full mb-4">
        <div className="border-l-4 border-brand-600 bg-brand-50 p-4 rounded-r-md">
          <h4 className="font-semibold text-brand-700 text-sm mb-1">
            {copy.home.dataNoticeTitle}
          </h4>
          <p className="text-sm text-text-muted">
            {copy.home.dataNoticeBody}
          </p>
        </div>
      </section>
    </div>
  );
}
