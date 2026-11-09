import React from "react";
import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import { copy } from "../content/copy.id.js";
import { Button } from "../components/ui/Button.js";
import { PageMeta } from "../lib/seo.js";

interface PlaceholderPageProps {
  pageName: string;
}

export function PlaceholderPage({ pageName }: PlaceholderPageProps) {
  return (
    <div className="page-gutter flex w-full flex-col items-center justify-center gap-4 py-24 text-center">
      <PageMeta
        title={`${pageName} — ${copy.common.siteName}`}
        description={copy.placeholder.description}
      />
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"
      >
        <Construction className="h-8 w-8" />
      </span>
      <h1 className="type-h1 text-text">{copy.placeholder.title}</h1>
      <p className="max-w-md text-base text-text-muted">
        {copy.placeholder.description}
      </p>
      <Link to="/dashboard" className="mt-3">
        <Button>{copy.placeholder.backToDashboard}</Button>
      </Link>
    </div>
  );
}
