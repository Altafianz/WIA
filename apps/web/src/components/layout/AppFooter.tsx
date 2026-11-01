import React from "react";
import { Link } from "react-router-dom";
import { copy } from "../../content/copy.id.js";

export function AppFooter() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="mx-auto max-w-container px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-muted">
        <p className="text-center sm:text-left">{copy.common.sourceAttribution}</p>
        <div className="flex items-center gap-4">
          <Link
            to="/metodologi"
            className="hover:text-text underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
          >
            {copy.nav.methodology}
          </Link>
          <span>{copy.common.allRightsReserved}</span>
        </div>
      </div>
    </footer>
  );
}
