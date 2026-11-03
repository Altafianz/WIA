import React from "react";
import { Link } from "react-router-dom";
import { copy } from "../../content/copy.id.js";

export function AppFooter() {
  return (
    <footer className="bg-footer-bg text-footer-text mt-auto">
      <div className="mx-auto max-w-container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-7 h-7 text-footer-subtle shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                <path d="m4.93 4.93 2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
              </svg>
              <span className="font-bold text-lg tracking-wider uppercase text-footer-text">
                {copy.common.siteName}
              </span>
            </div>
            <p className="text-sm text-footer-muted leading-relaxed">
              {copy.footer.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="font-semibold text-footer-text text-base mb-4">
              {copy.footer.navigationTitle}
            </h2>
            <ul className="space-y-2 text-sm text-footer-muted">
              <li>
                <Link to="/" className="hover:text-footer-text transition-colors">
                  {copy.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-footer-text transition-colors">
                  {copy.nav.dashboard}
                </Link>
              </li>
              <li>
                <Link to="/bandingkan" className="hover:text-footer-text transition-colors">
                  {copy.nav.compare}
                </Link>
              </li>
              <li>
                <Link to="/glosarium" className="hover:text-footer-text transition-colors">
                  {copy.nav.glossary}
                </Link>
              </li>
              <li>
                <Link to="/metodologi" className="hover:text-footer-text transition-colors">
                  {copy.nav.methodology}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-semibold text-footer-text text-base mb-4">
              {copy.footer.contactTitle}
            </h2>
            <ul className="space-y-2 text-sm text-footer-muted">
              <li>
                <a
                  href={`mailto:${copy.footer.contactEmail}`}
                  className="hover:text-footer-text transition-colors"
                >
                  {copy.footer.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${copy.footer.contactPhone}`}
                  className="hover:text-footer-text transition-colors"
                >
                  {copy.footer.contactPhone}
                </a>
              </li>
              <li>
                <span>{copy.footer.contactLocation}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-footer-text/10 text-center text-xs text-footer-muted">
          <p>{copy.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
