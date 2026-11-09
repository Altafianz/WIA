import React from "react";
import { Link } from "react-router-dom";
import { copy } from "../../content/copy.id.js";
import { useMeta } from "../../hooks/useMeta.js";
import { BrandMark } from "./BrandMark.js";

const PAGE_LINKS = [
  { to: "/", label: copy.nav.home },
  { to: "/dashboard", label: copy.nav.dashboard },
  { to: "/bandingkan", label: copy.nav.compare },
  { to: "/glosarium", label: copy.nav.glossary },
  { to: "/metodologi", label: copy.nav.methodology },
];

export function AppFooter() {
  const { data } = useMeta();
  const isFixture = data?.meta.isFixture ?? false;

  return (
    <footer className="mt-auto bg-footer-bg text-footer-text">
      <div className="page-gutter py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.15fr_1.15fr]">
          {/* Brand info */}
          <div className="space-y-4">
            <BrandMark inverse />
            <p className="max-w-sm text-sm leading-relaxed text-footer-muted">
              {copy.footer.description}
            </p>
            <p className="max-w-sm text-xs leading-relaxed text-footer-subtle">
              {isFixture
                ? copy.common.sourceAttributionFixture
                : copy.common.sourceAttributionOfficial}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label={copy.footer.pagesTitle}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-footer-subtle">
              {copy.footer.pagesTitle}
            </h2>
            <ul className="space-y-2.5 text-sm text-footer-muted">
              {PAGE_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex min-h-[32px] items-center rounded transition-colors duration-150 hover:text-footer-text"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Data source */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-footer-subtle">
              {copy.footer.dataTitle}
            </h2>
            <p className="text-sm leading-relaxed text-footer-muted">
              {copy.footer.dataDescription}
            </p>
            <Link
              to="/metodologi"
              className="mt-3 inline-flex min-h-[32px] items-center text-sm font-semibold text-footer-subtle transition-colors duration-150 hover:text-footer-text"
            >
              {copy.nav.methodology}
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-footer-subtle">
              {copy.footer.contactSectionTitle}
            </h2>
            <ul className="space-y-2.5 text-sm text-footer-muted">
              <li>
                <Link
                  to="/#saran"
                  className="inline-flex min-h-[32px] items-center font-semibold text-footer-subtle transition-colors duration-150 hover:text-footer-text"
                >
                  {copy.footer.feedbackLink}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${copy.footer.contactEmail}`}
                  className="inline-flex min-h-[32px] items-center transition-colors duration-150 hover:text-footer-text"
                >
                  {copy.footer.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${copy.footer.contactPhone}`}
                  className="inline-flex min-h-[32px] items-center transition-colors duration-150 hover:text-footer-text"
                >
                  {copy.footer.contactPhone}
                </a>
              </li>
              <li>{copy.footer.contactLocation}</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-footer-border pt-6 text-sm text-footer-muted">
          <p>{copy.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
