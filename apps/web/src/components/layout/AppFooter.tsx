import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { copy } from "../../content/copy.id.js";
import { useMeta } from "../../hooks/useMeta.js";
import { BrandMark } from "./BrandMark.js";

const PAGES = [
  { to: "/", label: copy.nav.home },
  { to: "/dashboard", label: copy.nav.dashboard },
  { to: "/bandingkan", label: copy.nav.compare },
  { to: "/glosarium", label: copy.nav.glossary },
  { to: "/metodologi", label: copy.nav.methodology },
];

const footerLinkClass =
  "inline-flex items-center gap-1.5 rounded-md text-footer-muted transition-colors duration-150 hover:text-footer-text";

export function AppFooter() {
  const { data } = useMeta();
  const isFixture = data?.meta.isFixture ?? false;

  return (
    <footer className="mt-auto bg-footer-bg text-footer-text">
      <div className="page-gutter py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <BrandMark inverse />
            <h2 className="text-base font-semibold text-footer-text">
              {copy.footer.aboutTitle}
            </h2>
            <p className="prose-readable text-sm leading-relaxed text-footer-muted">
              {copy.footer.description}
            </p>
            <p className="text-sm leading-relaxed text-footer-subtle">
              {isFixture
                ? copy.common.sourceAttributionFixture
                : copy.common.sourceAttributionOfficial}
            </p>
          </div>

          {/* Pages */}
          <div>
            <h2 className="mb-4 text-base font-semibold text-footer-text">
              {copy.footer.pagesTitle}
            </h2>
            <ul className="space-y-3 text-sm">
              {PAGES.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data sources */}
          <div>
            <h2 className="mb-4 text-base font-semibold text-footer-text">
              {copy.footer.dataTitle}
            </h2>
            <p className="prose-readable text-sm leading-relaxed text-footer-muted">
              {copy.footer.dataDescription}
            </p>
            <Link
              to="/metodologi"
              className="mt-3 inline-flex items-center gap-1.5 rounded-md text-brand-200 transition-colors duration-150 hover:text-footer-text"
            >
              {copy.nav.methodology}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Feedback */}
          <div>
            <h2 className="mb-4 text-base font-semibold text-footer-text">
              {copy.footer.feedbackTitle}
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/#saran" className={footerLinkClass}>
                  {copy.footer.feedbackLink}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${copy.footer.contactEmail}`}
                  className={footerLinkClass}
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {copy.footer.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${copy.footer.contactPhone}`}
                  className={footerLinkClass}
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {copy.footer.contactPhone}
                </a>
              </li>
              <li className="inline-flex items-center gap-1.5 text-footer-muted">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{copy.footer.contactLocation}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-2 border-t border-footer-border pt-6 text-sm text-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.footer.copyright}</p>
          <p>{copy.common.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
}
