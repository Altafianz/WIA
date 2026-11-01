import React from "react";
import { Link } from "react-router-dom";
import { copy } from "../../content/copy.id.js";

export function AppFooter() {
  return (
    <footer className="bg-footer-bg text-footer-text mt-auto">
      <div className="mx-auto max-w-container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

          {/* Follow Us */}
          <div>
            <h2 className="font-semibold text-footer-text text-base mb-4">
              {copy.footer.followUsTitle}
            </h2>
            <div className="flex items-center gap-3">
              <a
                href=""
                aria-label={copy.footer.socialInstagram}
                className="w-9 h-9 rounded-full bg-footer-text/15 hover:bg-footer-text/25 flex items-center justify-center text-footer-text transition-colors"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href=""
                aria-label={copy.footer.socialX}
                className="w-9 h-9 rounded-full bg-footer-text/15 hover:bg-footer-text/25 flex items-center justify-center text-footer-text transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href=""
                aria-label={copy.footer.socialFacebook}
                className="w-9 h-9 rounded-full bg-footer-text/15 hover:bg-footer-text/25 flex items-center justify-center text-footer-text transition-colors"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
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
