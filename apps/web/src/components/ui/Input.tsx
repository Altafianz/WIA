import React from "react";

const controlBase = [
  "w-full rounded-xl border bg-card px-4 text-base text-text placeholder:text-text-muted",
  "transition-colors duration-150 hover:border-border-strong",
  "focus:outline-none disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted",
].join(" ");

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className = "", invalid = false, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={[
          controlBase,
          "h-12",
          invalid ? "border-danger-600" : "border-border",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = "", invalid = false, ...props }, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        aria-invalid={invalid || undefined}
        className={[
          controlBase,
          "min-h-[120px] resize-y py-3",
          invalid ? "border-danger-600" : "border-border",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }
);
