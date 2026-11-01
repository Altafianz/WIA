import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
}

export function Select({ label, id, className = "", children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-text-muted">
        {label}
      </label>
      <select
        id={id}
        aria-label={label}
        className={[
          "rounded-md border border-border bg-surface px-3 py-2 text-sm text-text",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-1",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
