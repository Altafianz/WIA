import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { copy } from "../content/copy.id.js";
import { Button } from "../components/ui/Button.js";
import { PageMeta } from "../lib/seo.js";

export function NotFoundPage() {
  return (
    <div className="page-gutter flex w-full flex-col items-center justify-center gap-4 py-24 text-center">
      <PageMeta
        title={`${copy.notFound.title} — ${copy.common.siteName}`}
        description={copy.notFound.description}
      />
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"
      >
        <Compass className="h-8 w-8" />
      </span>
      <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
        404
      </p>
      <h1 className="type-h1 text-text">{copy.notFound.title}</h1>
      <p className="max-w-md text-base text-text-muted">
        {copy.notFound.description}
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Link to="/">
          <Button variant="secondary" className="w-full sm:w-auto">
            {copy.notFound.backHome}
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button className="w-full sm:w-auto">{copy.nav.dashboard}</Button>
        </Link>
      </div>
    </div>
  );
}
