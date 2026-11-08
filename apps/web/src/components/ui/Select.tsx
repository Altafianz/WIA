import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
}

export function Select({ label, id, className = "", children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-text">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-label={label}
          className={[
            "h-12 w-full appearance-none rounded-xl border border-border bg-card pl-4 pr-11 text-base text-text",
            "transition-colors duration-150 hover:border-border-strong",
            "focus:outline-none disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        />
      </div>
    </div>
  );
}
