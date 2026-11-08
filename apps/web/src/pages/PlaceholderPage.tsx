import React from "react";
import { Link } from "react-router-dom";
import { copy } from "../content/copy.id.js";
import { Button } from "../components/ui/Button.js";
import { PageMeta } from "../lib/seo.js";

interface PlaceholderPageProps {
  pageName: string;
}

export function PlaceholderPage({ pageName }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <PageMeta
        title={`${pageName} — ${copy.common.siteName}`}
        description={copy.placeholder.description}
      />
      <h1 className="text-2xl font-bold text-text">{copy.placeholder.title}</h1>
      <p className="text-text-muted max-w-md">{copy.placeholder.description}</p>
      <Link to="/dashboard" className="mt-4">
        <Button>{copy.placeholder.backToDashboard}</Button>
      </Link>
    </div>
  );
}
