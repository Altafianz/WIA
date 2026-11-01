import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export function Tooltip({ children, text }: TooltipProps) {
  return (
    <span className="relative group inline-block">
      {children}
      <span
        role="tooltip"
        className={[
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10",
          "w-56 rounded-md border border-border bg-surface px-3 py-2",
          "text-xs text-text-muted shadow-md",
          "invisible opacity-0 group-hover:visible group-hover:opacity-100",
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
}

export function TermTooltip({ term, definition }: TermTooltipProps) {
  return (
    <Tooltip text={definition}>
      <span className="underline decoration-dotted cursor-help text-brand-600">
        {term}
      </span>
    </Tooltip>
  );
}
