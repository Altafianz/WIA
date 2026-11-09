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
    "border border-border bg-card text-text shadow-sm hover:border-border-strong hover:bg-surface",
  ghost: "bg-transparent text-brand-700 hover:bg-brand-50",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-[44px] px-4 py-1.5 text-sm rounded-full",
  md: "min-h-[44px] px-5 py-2 text-sm rounded-full",
  lg: "min-h-[48px] px-7 py-3 text-base rounded-full",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 font-semibold",
        "transition-colors duration-150 ease-out",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        sizeClass[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
