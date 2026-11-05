import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to and focuses the element matching the URL hash on mount/hash change.
 * Elements should have scroll-margin-top to avoid being hidden by the sticky header.
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
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      element.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash]);
}
