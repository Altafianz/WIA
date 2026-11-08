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
    "bg-brand-600 text-text-inverse shadow-sm hover:bg-brand-700 active:bg-brand-800",
  secondary:
    "border border-brand-600 bg-card text-brand-700 hover:bg-brand-50 active:bg-brand-100",
  ghost:
    "bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100",
};

const sizeClass: Record<Size, string> = {
  sm: "h-10 px-4 text-base",
  md: "h-11 px-5 text-base",
  lg: "h-12 px-7 text-base",
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
        "inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold",
        "transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
        variantClass[variant],
        sizeClass[size],
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
