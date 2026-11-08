import React, { useId } from "react";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export function Tooltip({ children, text }: TooltipProps) {
  const tooltipId = useId();

  return (
    <span className="relative group inline-flex items-center">
      <span
        tabIndex={0}
        aria-describedby={tooltipId}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm inline-flex items-center"
      >
        {children}
      </span>
      <span
        id={tooltipId}
        role="tooltip"
        className={[
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 pointer-events-none",
          "w-56 rounded-md border border-border bg-surface px-3 py-2",
          "text-xs font-normal text-text-muted shadow-md",
          "invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
          "transition-opacity duration-150",
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
}

export function TermTooltip({ term, definition, children }: TermTooltipProps) {
  return (
    <Tooltip text={definition}>
      {children ?? (
        <span className="underline decoration-dotted cursor-help text-text hover:text-brand-600 transition-colors">
          {term}
        </span>
      )}
    </Tooltip>
  );
}
