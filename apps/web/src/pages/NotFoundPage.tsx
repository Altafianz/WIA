import React from "react";
import { Link } from "react-router-dom";
import { copy } from "../content/copy.id.js";
import { Button } from "../components/ui/Button.js";
import { PageMeta } from "../lib/seo.js";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <PageMeta
        title={`${copy.notFound.title} — ${copy.common.siteName}`}
        description={copy.notFound.description}
      />
      <div className="text-5xl" aria-hidden="true">
        404
      </div>
      <h1 className="text-2xl font-bold text-text">
        {copy.notFound.title}
      </h1>
      <p className="text-text-muted max-w-md">
        {copy.notFound.description}
      </p>
      <div className="flex gap-3 mt-4">
        <Link to="/">
          <Button variant="secondary">
            {copy.notFound.backHome}
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button>
            {copy.nav.dashboard}
          </Button>
        </Link>
      </div>
    </div>
  );
}
