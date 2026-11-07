import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to and focuses the element matching the URL hash on mount/hash change.
 * Elements should have scroll-margin-top to avoid being hidden by the sticky header.
 * Respects prefers-reduced-motion (no smooth scrolling when reduced motion is preferred).
 */
export function useHashScroll(): void {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // Keep the raw hash segment when it cannot be decoded.
    }

    const frame = window.requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (!element) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      element.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      // Move focus to heading if present, otherwise to the element itself
      const heading =
        element.querySelector<HTMLElement>(
          "h1[tabindex], h2[tabindex], h3[tabindex]"
        ) || (element.tagName.match(/^H[1-6]$/i) ? element : null);

      if (heading) {
        heading.focus({ preventScroll: true });
      } else {
        element.focus({ preventScroll: true });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash]);
}
