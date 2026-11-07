import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export interface UseMobileNavReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  drawerRef: React.RefObject<HTMLDivElement>;
}

export function useMobileNav(): UseMobileNavReturn {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  // Lock scroll, handle Escape and focus trap
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the drawer or its first focusable element
    const timer = setTimeout(() => {
      const drawer = drawerRef.current;
      if (drawer) {
        const focusables = drawer.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          drawer.focus();
        }
      }
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key === "Tab") {
        const drawer = drawerRef.current;
        if (!drawer) return;

        const focusables = drawer.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
    triggerRef: triggerRef as React.RefObject<HTMLButtonElement>,
    drawerRef: drawerRef as React.RefObject<HTMLDivElement>,
  };
}

