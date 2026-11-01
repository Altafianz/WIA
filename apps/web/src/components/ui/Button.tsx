import React from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-text-inverse hover:bg-brand-700 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
  secondary:
    "bg-surface border border-border text-text hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
  ghost:
    "bg-transparent text-brand-600 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-sm",
  md: "px-4 py-2 text-base rounded-md",
  lg: "px-6 py-3 text-lg rounded-md",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 font-medium transition-colors outline-none",
        variantClass[variant],
        sizeClass[size],
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
