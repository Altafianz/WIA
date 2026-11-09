import React, { useId } from "react";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export function Tooltip({ children, text }: TooltipProps) {
  const tooltipId = useId();

  return (
    <span className="group relative inline-flex items-center">
      <span
        tabIndex={0}
        aria-describedby={tooltipId}
        className="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        {children}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className={[
          "pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2",
          "rounded-xl border border-border bg-card px-3.5 py-2.5",
          "text-sm font-normal leading-relaxed text-text shadow-md",
          "invisible opacity-0 transition-opacity duration-150",
          "group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
        ].join(" ")}
      >
        {text}
      </span>
    </span>
  );
}

interface TermTooltipProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
  /** "plain" keeps headings free of the dotted glossary underline. */
  variant?: "term" | "plain";
}

export function TermTooltip({
  term,
  definition,
  children,
  variant = "term",
}: TermTooltipProps) {
  return (
    <Tooltip text={definition}>
      {children ??
        (variant === "plain" ? (
          <span className="cursor-help text-text transition-colors hover:text-brand-700">
            {term}
          </span>
        ) : (
          <span className="cursor-help text-text underline decoration-dotted underline-offset-4 transition-colors hover:text-brand-700">
            {term}
          </span>
        ))}
    </Tooltip>
  );
}
