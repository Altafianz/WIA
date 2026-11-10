import React from "react";
import { X } from "lucide-react";
import { copy } from "../../content/copy.id.js";

interface NoticePopupProps {
  open: boolean;
  onDismiss: () => void;
  popupRef: React.RefObject<HTMLDivElement>;
  icon?: React.ReactNode;
  testId?: string;
  children: React.ReactNode;
}

export function NoticePopup({
  open,
  onDismiss,
  popupRef,
  icon,
  testId,
  children,
}: NoticePopupProps) {
  if (!open) return null;

  return (
    <div
      ref={popupRef}
      role="status"
      aria-live="polite"
      data-testid={testId}
      className={[
        "notice-popup-enter fixed left-4 right-4 top-[calc(4rem+1rem)] z-30",
        "flex max-h-[calc(100vh-6rem)] items-start gap-3 overflow-y-auto",
        "rounded-xl border border-brand-200 bg-brand-50 p-4 pr-14 text-sm leading-relaxed text-brand-900 shadow-lg",
        "sm:right-auto sm:w-full sm:max-w-[420px] md:top-[calc(var(--header-height)+1rem)]",
      ].join(" ")}
    >
      {icon && (
        <span aria-hidden="true" className="mt-0.5 shrink-0 text-brand-700">
          {icon}
        </span>
      )}
      <div className="min-w-0">{children}</div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={copy.a11y.closeNotice}
        className="absolute right-1 top-1 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-brand-800 transition-colors duration-150 hover:bg-brand-100"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
